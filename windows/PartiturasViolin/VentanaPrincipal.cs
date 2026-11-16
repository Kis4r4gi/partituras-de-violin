using System.Diagnostics;
using System.Drawing;
using System.IO.Compression;
using System.Reflection;
using System.Security.Cryptography;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace PartiturasViolin;

/// <summary>
/// Ventana principal: aloja la aplicación web (PWA) embebida en el .exe mediante
/// WebView2, sin barra de navegador. Los enlaces externos se abren en el navegador
/// del sistema; todo lo demás funciona dentro de la ventana.
/// </summary>
public sealed class VentanaPrincipal : Form
{
    private const string HOST = "app.partituras.local";

    private static readonly string DirDatos = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
        "Partituras de violin");
    private static readonly string DirApp = Path.Combine(DirDatos, "app");
    private static readonly string DirPerfil = Path.Combine(DirDatos, "perfil");
    private static readonly string FicheroEstado = Path.Combine(DirDatos, "ventana.txt");
    private static readonly string FicheroMarca = Path.Combine(DirDatos, "app.zip.sha");

    private readonly WebView2 _web = new() { Dock = DockStyle.Fill };

    public VentanaPrincipal()
    {
        Text = "Partituras de violín";
        StartPosition = FormStartPosition.CenterScreen;
        MinimumSize = new Size(940, 620);
        Width = 1340;
        Height = 900;
        BackColor = Color.FromArgb(18, 16, 14);

        ExtraerAplicacion();
        try { Icon = new System.Drawing.Icon(Path.Combine(DirApp, "assets", "icon.ico")); }
        catch { /* se usa el icono por defecto */ }

        RestaurarEstado();
        Controls.Add(_web);

        Load += async (_, _) => await IniciarAsync();
        FormClosing += (_, _) => GuardarEstado();
    }

    /* ---------- archivos de la aplicación ---------- */

    private static void ExtraerAplicacion()
    {
        try
        {
            Directory.CreateDirectory(DirDatos);

            using var stm = Assembly.GetExecutingAssembly().GetManifestResourceStream("app.zip");
            if (stm == null) return;

            byte[] zip;
            using (var ms = new MemoryStream()) { stm.CopyTo(ms); zip = ms.ToArray(); }

            // Sello con hash: solo se vuelve a extraer si cambió el contenido.
            var marca = Convert.ToHexString(SHA256.HashData(zip));
            var completo = File.Exists(Path.Combine(DirApp, "index.html"));
            if (completo && File.Exists(FicheroMarca) && File.ReadAllText(FicheroMarca) == marca)
                return;

            Directory.CreateDirectory(DirApp);
            using (var archivo = new MemoryStream(zip))
            using (var za = new ZipArchive(archivo, ZipArchiveMode.Read))
                za.ExtractToDirectory(DirApp, overwriteFiles: true);

            File.WriteAllText(FicheroMarca, marca);
        }
        catch
        {
            // Si falla la extracción, el error se verá al intentar cargar la página.
        }
    }

    /* ---------- arranque de WebView2 ---------- */

    private async Task IniciarAsync()
    {
        // Preferir el WebView2 incluido junto al .exe (instalador completo);
        // si no esta, usar el instalado en el sistema.
        var exe = Environment.ProcessPath;
        var dirExe = (exe != null ? Path.GetDirectoryName(exe) : null)
            ?? AppContext.BaseDirectory;
        var propio = Path.Combine(dirExe, "WebView2", "msedgewebview2.exe");
        var carpeta = File.Exists(propio) ? Path.GetDirectoryName(propio) : null;

        try
        {
            await CrearWebView2Async(carpeta);
        }
        catch when (carpeta != null)
        {
            // El incluido no sirvio: se prueba con el del sistema.
            try { await CrearWebView2Async(null); }
            catch { FaltaWebView2(); return; }
        }
        catch
        {
            FaltaWebView2();
            return;
        }

        var n = _web.CoreWebView2;

        // Sirve los archivos locales como si fueran un sitio HTTPS.
        n.SetVirtualHostNameToFolderMapping(HOST, DirApp, CoreWebView2HostResourceAccessKind.DenyCors);

        n.Settings.AreDefaultContextMenusEnabled = false;
        n.Settings.IsStatusBarEnabled = false;
        n.Settings.IsSwipeNavigationEnabled = false;

        // Los enlaces salientes se abren en el navegador del sistema.
        n.NavigationStarting += (_, e) =>
        {
            if (Uri.TryCreate(e.Uri, UriKind.Absolute, out var u) &&
                !string.Equals(u.Host, HOST, StringComparison.OrdinalIgnoreCase))
            {
                e.Cancel = true;
                AbrirExterno(u);
            }
        };
        n.NewWindowRequested += (_, e) =>
        {
            e.Handled = true;
            if (Uri.TryCreate(e.Uri, UriKind.Absolute, out var u)) AbrirExterno(u);
        };

        n.Navigate($"https://{HOST}/index.html");
    }

    private async Task CrearWebView2Async(string? carpeta)
    {
        var entorno = await CoreWebView2Environment.CreateAsync(
            browserExecutableFolder: carpeta,
            userDataFolder: DirPerfil,
            options: new CoreWebView2EnvironmentOptions());
        await _web.EnsureCoreWebView2Async(entorno);
    }

    private void FaltaWebView2()
    {
        var r = MessageBox.Show(
            "Para ejecutar esta aplicación se necesita el componente " +
            "Microsoft Edge WebView2 Runtime.\n\n¿Abrir la página de descarga oficial?",
            Text, MessageBoxButtons.YesNo, MessageBoxIcon.Error);
        if (r == DialogResult.Yes)
            AbrirExterno("https://developer.microsoft.com/microsoft-edge/webview2/");
        Close();
    }

    private static void AbrirExterno(string url)
    {
        try { Process.Start(new ProcessStartInfo(url) { UseShellExecute = true }); }
        catch { /* sin navegador predeterminado: ignorar */ }
    }

    private static void AbrirExterno(Uri u) => AbrirExterno(u.AbsoluteUri);

    /* ---------- tamaño y posición de la ventana ---------- */

    private void RestaurarEstado()
    {
        try
        {
            if (!File.Exists(FicheroEstado)) return;
            var p = File.ReadAllText(FicheroEstado).Split(';');
            if (p.Length != 4) return;
            Width = int.Parse(p[0]);
            Height = int.Parse(p[1]);
            Left = int.Parse(p[2]);
            Top = int.Parse(p[3]);
            StartPosition = FormStartPosition.Manual;
        }
        catch { /* valores inválidos: se usa la posición por defecto */ }
    }

    private void GuardarEstado()
    {
        try
        {
            Directory.CreateDirectory(DirDatos);
            File.WriteAllText(FicheroEstado, $"{Width};{Height};{Left};{Top}");
        }
        catch { /* no crítico */ }
    }
}
