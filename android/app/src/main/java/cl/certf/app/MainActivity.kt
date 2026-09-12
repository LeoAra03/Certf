package cl.certf.app

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout

/**
 * Certf: contenedor nativo de la PWA empaquetada en assets (offline).
 * Además programa la alarma diaria de recordatorios de fechas límite.
 */
class MainActivity : Activity() {

    private var web: WebView? = null
    private var nativeFetch: NativeFetch? = null

    @SuppressLint("SetJavaScriptEnabled", "SetAllowUniversalAccessFromFileURLs", "JavascriptInterface")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val root = FrameLayout(this)
        val view = WebView(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.databaseEnabled = true
            settings.allowFileAccess = true
            settings.allowContentAccess = true
            settings.cacheMode = WebSettings.LOAD_DEFAULT
            settings.mediaPlaybackRequiresUserGesture = false
            // El botón "🔎 Buscar páginas" vive en file:// (assets): sin esto el WebView
            // aplica CORS y no deja leer las respuestas de las páginas oficiales.
            // Además se usa el puente nativo CertfNative, que descarga sin CORS.
            settings.allowUniversalAccessFromFileURLs = true

            webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                    val url = request?.url?.toString()
                    if (url == null || url.startsWith("file://") || url.startsWith("about:")) return false
                    return try {
                        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                        true
                    } catch (e: Exception) {
                        false
                    }
                }
            }
            webChromeClient = WebChromeClient()
            // Puente nativo para la búsqueda en vivo de páginas (sin CORS).
            // Debe registrarse ANTES de loadUrl para que window.CertfNative exista.
            val puente = NativeFetch(this) // here `this` es el WebView
            nativeFetch = puente
            addJavascriptInterface(puente, "CertfNative")
            loadUrl("file:///android_asset/www/index.html")
        }
        root.addView(view)
        setContentView(root)
        web = view

        Alerts.ensureChannel(this)
        Alerts.scheduleDaily(this)
        requestNotificationPermissionIfNeeded()
    }

    override fun onDestroy() {
        try {
            web?.removeJavascriptInterface("CertfNative")
            nativeFetch?.cerrar()
        } catch (_: Exception) {
        }
        web?.destroy()
        web = null
        super.onDestroy()
    }

    override fun onBackPressed() {
        val w = web
        if (w != null && w.canGoBack()) w.goBack() else super.onBackPressed()
    }

    private fun requestNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT >= 33 &&
            checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) {
            requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), 1001)
        }
    }
}
