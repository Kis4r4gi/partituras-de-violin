// Instalador.cs — Instalador autocontenido de "Partituras de violin" para Windows.
// Se compila con el csc de .NET Framework (incluido en Windows 10/11), sin
// dependencias externas: el instalador lleva dentro el .exe de la aplicacion,
// el runtime de Microsoft Edge WebView2 y el desinstalador.
//
// El ZIP con el payload se anade al final de este .exe (ver compilar-instalador.ps1);
// los ultimos 8 bytes del archivo indican la longitud del ZIP.
//
// Modos de uso:
//   (sin argumentos)          -> instalar con interfaz grafica
//   /S | /silent | /quiet     -> instalar sin interfaz
//   /uninstall                -> desinstalar (pregunta antes)
//   /uninstall /quiet         -> desinstalar sin preguntar
//
// Requiere solo .NET Framework 4.8 (incluido de fabrica en Windows 10 y 11).

using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.IO.Compression;
using System.Windows.Forms;

internal static class Instalador
{
    private const string Nombre = "Partituras de violin";
    private const string Version = "1.1.0";
    private const string ClaveRegistro = "PartiturasDeViolin";

    [System.Runtime.InteropServices.DllImport("user32.dll")]
    private static extern bool SetProcessDPIAware();

    [STAThread]
    private static void Main(string[] args)
    {
        try { SetProcessDPIAware(); } catch { }

        bool quiet = false;
        bool desinstalar = false;
        foreach (string a in args)
        {
            string x = (a ?? "").Trim().ToLowerInvariant();
            if (x == "/s" || x == "/silent" || x == "/quiet" || x == "-s" || x == "--silent")
                quiet = true;
            if (x == "/uninstall" || x == "/desinstalar" || x == "-uninstall" || x == "--uninstall")
                desinstalar = true;
        }

        // Un ejecutable llamado "Desinstalar.exe" desinstala aunque no reciba argumentos.
        if (!desinstalar)
        {
            string propio = Path.GetFileName(Application.ExecutablePath) ?? "";
            if (propio.StartsWith("Desinstalar", StringComparison.OrdinalIgnoreCase))
                desinstalar = true;
        }

        if (desinstalar)
        {
            Desinstalar(quiet);
            return;
        }

        if (quiet)
        {
            bool ok = Instalar(null);
            Environment.Exit(ok ? 0 : 1);
            return;
        }

        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new Ventana());
    }

    // ------------------------------------------------------------------ rutas

    private static string DirInstal
    {
        get
        {
            return Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Programs",
                Nombre);
        }
    }

    private static string DirDatos
    {
        get
        {
            return Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                Nombre);
        }
    }

    private static string ExeApp
    {
        get { return Path.Combine(DirInstal, Nombre + ".exe"); }
    }

    private static string ExeDesinstalar
    {
        get { return Path.Combine(DirInstal, "Desinstalar.exe"); }
    }

    // ------------------------------------------------------------- instalar

    private static bool Instalar(Ventana ui)
    {
        CerrarApp();
        try
        {
            if (ui != null) ui.Estado("Leyendo el paquete de instalación...");

            using (Stream fs = AbrirPayload())
            {
                if (fs == null)
                    throw new InvalidDataException(
                        "No se encontró el paquete de datos añadido al instalador. " +
                        "Vuelve a descargar el archivo completo.");

                using (var za = new ZipArchive(fs, ZipArchiveMode.Read))
                {
                    long total = 0;
                    foreach (ZipArchiveEntry e in za.Entries) total += e.Length;

                    long hechos = 0;
                    Directory.CreateDirectory(DirInstal);

                    foreach (ZipArchiveEntry e in za.Entries)
                    {
                        if (ui != null && ui.Cancelado)
                            throw new OperationCanceledException();

                        string rel = e.FullName.Replace('/', Path.DirectorySeparatorChar);
                        if (rel.Length == 0 || rel == ".") continue;

                        string destino = Path.Combine(DirInstal, rel);

                        if (e.FullName.EndsWith("/"))
                        {
                            Directory.CreateDirectory(destino);
                            continue;
                        }

                        string carpeta = Path.GetDirectoryName(destino);
                        if (!string.IsNullOrEmpty(carpeta)) Directory.CreateDirectory(carpeta);

                        using (Stream entrada = e.Open())
                        using (Stream salida = File.Create(destino))
                        {
                            byte[] buf = new byte[65536];
                            int n;
                            while ((n = entrada.Read(buf, 0, buf.Length)) > 0)
                            {
                                salida.Write(buf, 0, n);
                                hechos += n;
                            }
                        }

                        if (ui != null) ui.Progreso(hechos, total, e.FullName);
                    }
                }
            }

            if (ui != null) ui.Estado("Creando accesos directos y registro...");
            CrearAtajos();
            EscribirRegistro();
            return true;
        }
        catch (Exception ex)
        {
            if (ui != null && !ui.Cancelado)
            {
                string msg = (ex is OperationCanceledException)
                    ? "La instalación se canceló."
                    : "Error al instalar:\n\n" + ex.Message;
                MessageBox.Show(msg, Nombre, MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            return false;
        }
    }

    // --------------------------------------------------------- payload (ZIP)

    // Lee el ZIP anadido al final del propio .exe. Los ultimos 8 bytes son la
    // longitud (Int64) del ZIP; este metodo devuelve un Stream que representa
    // solo esa ventana del archivo (con seek relativo al inicio del ZIP).
    private static Stream AbrirPayload()
    {
        string exe = Application.ExecutablePath;
        var fs = new FileStream(exe, FileMode.Open, FileAccess.Read, FileShare.Read);
        try
        {
            long len = fs.Length;
            if (len < 9) { fs.Dispose(); return null; }

            byte[] cola = new byte[8];
            fs.Seek(len - 8, SeekOrigin.Begin);
            int leidos = 0;
            while (leidos < 8)
            {
                int n = fs.Read(cola, leidos, 8 - leidos);
                if (n <= 0) break;
                leidos += n;
            }
            if (leidos < 8) { fs.Dispose(); return null; }

            long zipLen = BitConverter.ToInt64(cola, 0);
            if (zipLen <= 0 || zipLen > len - 8) { fs.Dispose(); return null; }

            long inicio = len - 8 - zipLen;
            fs.Seek(inicio, SeekOrigin.Begin);
            return new SubStream(fs, zipLen);
        }
        catch
        {
            fs.Dispose();
            throw;
        }
    }

    // Stream "ventana": expone [0, tam) del stream base como si empezara en 0,
    // necesario porque las referencias del ZIP son relativas al inicio del ZIP.
    private sealed class SubStream : Stream
    {
        private readonly Stream _base;
        private readonly long _inicio;
        private readonly long _tam;
        private long _pos;

        public SubStream(Stream baseStream, long tam)
        {
            _base = baseStream;
            _inicio = baseStream.Position;
            _tam = tam;
            _pos = 0;
        }

        public override bool CanRead { get { return true; } }
        public override bool CanSeek { get { return true; } }
        public override bool CanWrite { get { return false; } }
        public override long Length { get { return _tam; } }

        public override long Position
        {
            get { return _pos; }
            set { Seek(value, SeekOrigin.Begin); }
        }

        public override int Read(byte[] buffer, int offset, int count)
        {
            if (count <= 0) return 0;
            long quedan = _tam - _pos;
            if (quedan <= 0) return 0;
            if (count > quedan) count = (int)quedan;
            int n = _base.Read(buffer, offset, count);
            _pos += n;
            return n;
        }

        public override long Seek(long offset, SeekOrigin origin)
        {
            long nueva;
            if (origin == SeekOrigin.Begin) nueva = offset;
            else if (origin == SeekOrigin.Current) nueva = _pos + offset;
            else nueva = _tam + offset;
            if (nueva < 0) throw new IOException("Posición fuera de rango.");
            if (nueva > _tam) nueva = _tam;
            _base.Seek(_inicio + nueva, SeekOrigin.Begin);
            _pos = nueva;
            return nueva;
        }

        public override void Flush() { }
        public override void SetLength(long value) { throw new NotSupportedException(); }
        public override void Write(byte[] buffer, int offset, int count) { throw new NotSupportedException(); }

        protected override void Dispose(bool disposing)
        {
            if (disposing) _base.Dispose();
            base.Dispose(disposing);
        }
    }

    // ---------------------------------------------------------- desinstalar

    private static void Desinstalar(bool quiet)
    {
        if (!quiet)
        {
            DialogResult r = MessageBox.Show(
                "Se desinstalará " + Nombre + " de este equipo.\n\n" +
                "Tus datos (favoritos, progreso y búsquedas guardadas) se conservarán.\n\n" +
                "¿Continuar?",
                "Desinstalar " + Nombre,
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Question);
            if (r != DialogResult.Yes) return;
        }

        CerrarApp();

        // Accesos directos
        BorrarAtajo(Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory),
            Nombre + ".lnk"));
        BorrarAtajo(Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.Programs),
            Nombre + ".lnk"));

        // Entrada del Panel de control
        try
        {
            Microsoft.Win32.Registry.CurrentUser.DeleteSubKeyTree(
                @"Software\Microsoft\Windows\CurrentVersion\Uninstall\" + ClaveRegistro,
                false);
        }
        catch { }

        if (!quiet)
        {
            MessageBox.Show(
                "Desinstalado.\n\n" +
                "Los datos (favoritos, progreso y búsquedas guardadas) se conservan en:\n" +
                DirDatos + "\n\n" +
                "Para borrarlos también, elimina esa carpeta.",
                Nombre,
                MessageBoxButtons.OK,
                MessageBoxIcon.Information);
        }

        // Borrar la carpeta de instalacion al terminar: este proceso vive dentro
        // de ella, asi que la eliminacion se pospone unos segundos.
        if (Directory.Exists(DirInstal))
        {
            string cmd = "ping 127.0.0.1 -n 4 >nul & rmdir /s /q \"" + DirInstal + "\"";
            var psi = new ProcessStartInfo("cmd.exe", "/c " + cmd);
            psi.UseShellExecute = false;
            psi.CreateNoWindow = true;
            try { Process.Start(psi); } catch { }
        }
    }

    private static void BorrarAtajo(string ruta)
    {
        try
        {
            if (File.Exists(ruta)) File.Delete(ruta);
        }
        catch { }
    }

    private static void CerrarApp()
    {
        Process[] procesos;
        try { procesos = Process.GetProcessesByName(Nombre); }
        catch { return; }
        foreach (Process p in procesos)
        {
            try
            {
                if (!p.HasExited) p.Kill();
                p.WaitForExit(3000);
            }
            catch { }
            try { p.Dispose(); } catch { }
        }
    }

    // --------------------------------------------------- accesos y registro

    private static void CrearAtajos()
    {
        Type tipo = Type.GetTypeFromProgID("WScript.Shell");
        if (tipo == null) return;
        dynamic shell = Activator.CreateInstance(tipo);
        CrearAtajo(shell, Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory),
            Nombre + ".lnk"));
        CrearAtajo(shell, Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.Programs),
            Nombre + ".lnk"));
    }

    private static void CrearAtajo(dynamic shell, string ruta)
    {
        dynamic sc = shell.CreateShortcut(ruta);
        sc.TargetPath = ExeApp;
        sc.WorkingDirectory = DirInstal;
        sc.Description = Nombre;
        sc.IconLocation = ExeApp + ",0";
        sc.Save();
    }

    private static void EscribirRegistro()
    {
        string clave = @"Software\Microsoft\Windows\CurrentVersion\Uninstall\" + ClaveRegistro;
        using (var rk = Microsoft.Win32.Registry.CurrentUser.CreateSubKey(clave))
        {
            if (rk == null) return;
            rk.SetValue("DisplayName", Nombre);
            rk.SetValue("DisplayVersion", Version);
            rk.SetValue("Publisher", "Kis4r4gi");
            rk.SetValue("InstallLocation", DirInstal);
            rk.SetValue("UninstallString", "\"" + ExeDesinstalar + "\" /uninstall");
            rk.SetValue("QuietUninstallString", "\"" + ExeDesinstalar + "\" /uninstall /quiet");
            rk.SetValue("DisplayIcon", ExeApp);
            rk.SetValue("URLInfoAbout", "https://github.com/Kis4r4gi/partituras-de-violin");

            long kb = 0;
            try
            {
                foreach (FileInfo f in new DirectoryInfo(DirInstal).EnumerateFiles("*", SearchOption.AllDirectories))
                    kb += f.Length;
            }
            catch { }
            rk.SetValue("EstimatedSize", (int)(kb / 1024), Microsoft.Win32.RegistryValueKind.DWord);
            rk.SetValue("NoModify", 1, Microsoft.Win32.RegistryValueKind.DWord);
            rk.SetValue("NoRepair", 1, Microsoft.Win32.RegistryValueKind.DWord);
        }
    }

    // ------------------------------------------------------------ interfaz

    private sealed class Ventana : Form
    {
        private readonly Label _titulo;
        private readonly Label _sub;
        private readonly ProgressBar _barra;
        private readonly Label _estado;
        private readonly Label _ruta;
        private readonly CheckBox _ejecutar;
        private readonly Button _boton;
        private bool _listo;
        private bool _cancelado;

        public bool Cancelado { get { return _cancelado; } }

        public Ventana()
        {
            Text = "Instalar " + Nombre;
            FormBorderStyle = FormBorderStyle.FixedDialog;
            MaximizeBox = false;
            MinimizeBox = false;
            StartPosition = FormStartPosition.CenterScreen;
            ClientSize = new Size(452, 200);
            Font = new Font("Segoe UI", 9F);
            BackColor = Color.FromArgb(18, 16, 14);
            ForeColor = Color.FromArgb(240, 234, 226);
            try { Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath); }
            catch { }

            _titulo = new Label();
            _titulo.Text = Nombre;
            _titulo.Font = new Font(Font.FontFamily, 13F, FontStyle.Bold);
            _titulo.ForeColor = Color.FromArgb(242, 236, 228);
            _titulo.AutoSize = true;
            _titulo.Location = new Point(16, 14);

            _sub = new Label();
            _sub.Text = "Versión " + Version + " — instalación completa: incluye Microsoft Edge " +
                        "WebView2, no se necesita ningún otro componente.";
            _sub.ForeColor = Color.FromArgb(168, 159, 148);
            _sub.Location = new Point(16, 44);
            _sub.Size = new Size(420, 34);

            _barra = new ProgressBar();
            _barra.Location = new Point(16, 84);
            _barra.Size = new Size(420, 22);
            _barra.Minimum = 0;
            _barra.Maximum = 100;

            _estado = new Label();
            _estado.Text = "Preparando...";
            _estado.ForeColor = Color.FromArgb(214, 205, 194);
            _estado.Location = new Point(16, 112);
            _estado.Size = new Size(420, 18);
            _estado.AutoEllipsis = true;

            _ruta = new Label();
            _ruta.Text = "Se instalará en:\r\n" + DirInstal;
            _ruta.ForeColor = Color.FromArgb(140, 132, 122);
            _ruta.Font = new Font("Segoe UI", 7.5F);
            _ruta.Location = new Point(16, 136);
            _ruta.Size = new Size(420, 28);

            _ejecutar = new CheckBox();
            _ejecutar.Text = "Ejecutar Partituras de violin al finalizar";
            _ejecutar.ForeColor = Color.FromArgb(240, 234, 226);
            _ejecutar.BackColor = BackColor;
            _ejecutar.FlatStyle = FlatStyle.Flat;
            _ejecutar.Location = new Point(16, 170);
            _ejecutar.AutoSize = true;
            _ejecutar.Visible = false;

            _boton = new Button();
            _boton.Text = "Instalar";
            _boton.Enabled = false;
            _boton.Size = new Size(90, 28);
            _boton.Location = new Point(346, 166);
            _boton.FlatStyle = FlatStyle.Flat;
            _boton.FlatAppearance.BorderColor = Color.FromArgb(201, 162, 39);
            _boton.BackColor = Color.FromArgb(43, 38, 32);
            _boton.ForeColor = Color.FromArgb(240, 234, 226);
            _boton.Cursor = Cursors.Hand;
            _boton.Click += AlPulsarBoton;

            Controls.Add(_titulo);
            Controls.Add(_sub);
            Controls.Add(_barra);
            Controls.Add(_estado);
            Controls.Add(_ruta);
            Controls.Add(_ejecutar);
            Controls.Add(_boton);
        }

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            // Dejar pintar la ventana antes de empezar a extraer.
            BeginInvoke((MethodInvoker)delegate
            {
                bool ok = Instalar(this);
                if (ok) Terminado();
                else if (!Cancelado) Close();
            });
        }

        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            _cancelado = true;
            base.OnFormClosing(e);
        }

        public void Estado(string texto)
        {
            if (IsDisposed || _cancelado) return;
            _estado.Text = texto;
            Application.DoEvents();
        }

        public void Progreso(long hechos, long total, string archivo)
        {
            if (IsDisposed || _cancelado) return;
            if (total > 0)
            {
                int p = (int)(hechos * 100 / total);
                if (p < 0) p = 0;
                if (p > 100) p = 100;
                _barra.Value = p;
            }
            _estado.Text = "Extrayendo: " + archivo;
            Application.DoEvents();
        }

        private void Terminado()
        {
            _listo = true;
            _barra.Value = 100;
            _estado.Text = "Instalación completada.";
            _ejecutar.Visible = true;
            _ejecutar.Checked = true;
            _boton.Enabled = true;
            _boton.Text = "Finalizar";
        }

        private void AlPulsarBoton(object sender, EventArgs e)
        {
            if (!_listo) return;
            if (_ejecutar.Checked)
            {
                try { Process.Start(ExeApp); } catch { }
            }
            Close();
        }
    }
}
