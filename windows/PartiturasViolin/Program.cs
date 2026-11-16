using System.Diagnostics;
using System.Runtime.InteropServices;

namespace PartiturasViolin;

internal static class Program
{
    [DllImport("user32.dll")] private static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")] private static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

    [STAThread]
    private static void Main()
    {
        // Una sola instancia: si ya está abierta, se trae la ventana existente al frente.
        using var mutex = new Mutex(true, "PartiturasDeViolin_SesionUnica", out bool primera);
        if (!primera)
        {
            var otra = Process.GetProcessesByName("Partituras de violin")
                .FirstOrDefault(p => p.Id != Environment.ProcessId && p.MainWindowHandle != IntPtr.Zero);
            if (otra != null)
            {
                ShowWindow(otra.MainWindowHandle, 9); // SW_RESTORE
                SetForegroundWindow(otra.MainWindowHandle);
            }
            return;
        }

        ApplicationConfiguration.Initialize();
        Application.Run(new VentanaPrincipal());
    }
}
