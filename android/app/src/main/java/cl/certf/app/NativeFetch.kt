package cl.certf.app

import android.os.Handler
import android.os.Looper
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebView
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.zip.GZIPInputStream

/**
 * Puente nativo del botón "Buscar páginas".
 *
 * La app se sirve desde file:///android_asset/, donde el navegador aplica CORS y
 * casi ninguna página oficial (AWS, Pearson VUE, Microsoft, Cisco…) permite leer
 * la respuesta. Descargando aquí con HttpURLConnection no hay CORS: se lee la
 * página completa y se le devuelve al JavaScript como texto.
 *
 * Uso desde JS:  CertfNative.fetchUrl(url, callbackId)
 * Respuesta:     window.__certfNativeChunk(callbackId, indice, total, parte)
 *                (se entrega en trozos para no chocar con el límite de 1 MB del binder)
 */
class NativeFetch(private val web: WebView) {

    private val exec: ExecutorService = Executors.newFixedThreadPool(4)
    private val main = Handler(Looper.getMainLooper())

    private companion object {
        const val TAG = "Certf"
        const val UA = "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) " +
            "Chrome/126.0.0.0 Mobile Safari/537.36 CertfApp/1.1"
        const val MAX_CHARS = 900_000      // ~900 KB de texto por página
        const val CHUNK = 120_000          // tamaño seguro por llamada a evaluateJavascript
        const val CONNECT_TIMEOUT = 12_000
        const val READ_TIMEOUT = 20_000
    }

    /** Libera los hilos al cerrar la actividad. */
    fun cerrar() {
        try { exec.shutdownNow() } catch (_: Exception) {}
    }

    /** Para que el JS sepa si está dentro de la APK (y use el puente en vez de proxies). */
    @JavascriptInterface
    fun disponible(): Boolean = true

    /** Descarga [url] en segundo plano y devuelve el resultado al callback [callbackId]. */
    @JavascriptInterface
    fun fetchUrl(url: String, callbackId: String) {
        exec.execute {
            val payload = descargar(url)
            entregar(callbackId, payload)
        }
    }

    private fun entregar(callbackId: String, payload: String) {
        val total = (payload.length + CHUNK - 1) / CHUNK
        if (total <= 1) {
            enviar(callbackId, 0, 1, payload)
            return
        }
        for (i in 0 until total) {
            val from = i * CHUNK
            val to = minOf(payload.length, from + CHUNK)
            enviar(callbackId, i, total, payload.substring(from, to))
        }
    }

    private fun enviar(callbackId: String, indice: Int, total: Int, parte: String) {
        val js = "window.__certfNativeChunk && window.__certfNativeChunk(" +
            JSONObject.quote(callbackId) + ", " + indice + ", " + total + ", " +
            JSONObject.quote(parte) + ");"
        main.post {
            try {
                web.evaluateJavascript(js, null)
            } catch (e: Exception) {
                Log.w(TAG, "No se pudo entregar el resultado al JS", e)
            }
        }
    }

    private fun descargar(url: String): String {
        val lower = url.lowercase()
        if (!lower.startsWith("https://") && !lower.startsWith("http://")) {
            return JSONObject().put("status", 0).put("error", "URL inválida").toString()
        }
        var conn: HttpURLConnection? = null
        return try {
            conn = URL(url).openConnection() as HttpURLConnection
            conn.instanceFollowRedirects = true
            conn.connectTimeout = CONNECT_TIMEOUT
            conn.readTimeout = READ_TIMEOUT
            conn.requestMethod = "GET"
            conn.setRequestProperty("User-Agent", UA)
            conn.setRequestProperty("Accept", "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8")
            conn.setRequestProperty("Accept-Language", "en,es;q=0.8")
            val status = conn.responseCode
            val base = if (status in 200..399) conn.inputStream else (conn.errorStream ?: conn.inputStream)
            val encoding = conn.contentEncoding ?: ""
            val input = if (encoding.lowercase().contains("gzip")) GZIPInputStream(base) else base
            val reader = BufferedReader(InputStreamReader(input, Charsets.UTF_8))
            val sb = StringBuilder()
            val buf = CharArray(8192)
            var leidos = 0
            while (leidos < MAX_CHARS) {
                val n = reader.read(buf)
                if (n <= 0) break
                sb.append(buf, 0, n)
                leidos += n
            }
            try { reader.close() } catch (_: Exception) {}
            JSONObject().put("status", status).put("body", sb.toString()).toString()
        } catch (e: Exception) {
            Log.i(TAG, "fetchUrl $url -> ${e.javaClass.simpleName}: ${e.message}")
            JSONObject().put("status", 0)
                .put("error", e.javaClass.simpleName + ": " + (e.message ?: ""))
                .toString()
        } finally {
            try { conn?.disconnect() } catch (_: Exception) {}
        }
    }
}
