package com.kis4r4gi.partiturasviolin;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Message;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Locale;

/**
 * Ventana principal: aloja la aplicacion web (PWA) dentro de un WebView,
 * sirviendo los archivos embebidos en assets/ bajo el origen https://app.local.
 * Los enlaces externos se abren en el navegador del sistema.
 */
public class MainActivity extends Activity {

    private static final String HOST = "app.local";

    private WebView web;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(18, 16, 14));
        setContentView(web);

        WebSettings cfg = web.getSettings();
        cfg.setJavaScriptEnabled(true);
        cfg.setDomStorageEnabled(true);          // localStorage: favoritos, progreso, notas
        cfg.setAllowFileAccess(false);
        cfg.setAllowContentAccess(false);
        cfg.setSupportMultipleWindows(false);     // target=_blank pasa por shouldOverrideUrlLoading
        cfg.setMediaPlaybackRequiresUserGesture(false);

        web.setWebViewClient(new WebViewClient() {

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest req) {
                Uri u = req.getUrl();
                if (u == null || !HOST.equals(u.getHost())) return null;

                String ruta = u.getPath();
                if (ruta == null || ruta.isEmpty() || "/".equals(ruta)) ruta = "/index.html";
                if (ruta.contains("..")) return respuesta(400, "Solicitud no valida");

                try {
                    InputStream in = getAssets().open("web" + ruta);
                    return new WebResourceResponse(tipo(ruta), esTexto(ruta) ? "UTF-8" : null, in);
                } catch (IOException e) {
                    return respuesta(404, "No encontrado");
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest req) {
                Uri u = req.getUrl();
                if (u != null && !HOST.equals(u.getHost())) {
                    abrirNavegador(u);
                    return true;
                }
                return false;
            }
        });

        // Enlaces target="_blank": se abren fuera de la aplicacion.
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onCreateWindow(WebView v, boolean dialog, boolean userGesture, Message msg) {
                WebView tmp = new WebView(v.getContext());
                tmp.setWebViewClient(new WebViewClient() {
                    @Override
                    public boolean shouldOverrideUrlLoading(WebView vw, WebResourceRequest req) {
                        abrirNavegador(req.getUrl());
                        return true;
                    }
                });
                WebView.WebViewTransport t = (WebView.WebViewTransport) msg.obj;
                t.setWebView(tmp);
                msg.sendToTarget();
                return true;
            }
        });

        if (savedInstanceState != null) {
            web.restoreState(savedInstanceState);
        } else {
            web.loadUrl("https://" + HOST + "/index.html");
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    public void onBackPressed() {
        if (web != null && web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }

    private void abrirNavegador(Uri u) {
        if (u == null) return;
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, u));
        } catch (Exception ignored) {
            // sin navegador predeterminado: no hay nada que hacer
        }
    }

    private static WebResourceResponse respuesta(int codigo, String mensaje) {
        String estado = (codigo == 404) ? "Not Found" : "Bad Request";
        return new WebResourceResponse("text/plain", "UTF-8", codigo, estado,
                new HashMap<String, String>(),
                new ByteArrayInputStream(mensaje.getBytes(StandardCharsets.UTF_8)));
    }

    private static boolean esTexto(String ruta) {
        String l = ruta.toLowerCase(Locale.ROOT);
        return l.endsWith(".html") || l.endsWith(".htm") || l.endsWith(".css")
                || l.endsWith(".js") || l.endsWith(".json") || l.endsWith(".svg")
                || l.endsWith(".txt") || l.endsWith(".webmanifest") || l.endsWith(".xml");
    }

    private static String tipo(String ruta) {
        String l = ruta.toLowerCase(Locale.ROOT);
        if (l.endsWith(".html") || l.endsWith(".htm")) return "text/html";
        if (l.endsWith(".css")) return "text/css";
        if (l.endsWith(".js")) return "application/javascript";
        if (l.endsWith(".json")) return "application/json";
        if (l.endsWith(".png")) return "image/png";
        if (l.endsWith(".jpg") || l.endsWith(".jpeg")) return "image/jpeg";
        if (l.endsWith(".svg")) return "image/svg+xml";
        if (l.endsWith(".ico")) return "image/x-icon";
        if (l.endsWith(".webmanifest")) return "application/manifest+json";
        if (l.endsWith(".woff")) return "font/woff";
        if (l.endsWith(".woff2")) return "font/woff2";
        if (l.endsWith(".xml")) return "application/xml";
        if (l.endsWith(".txt")) return "text/plain";
        return "application/octet-stream";
    }
}
