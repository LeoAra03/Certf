package cl.certf.app

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import org.json.JSONObject
import java.util.Calendar

/** Una fecha crítica del catálogo ya resuelta a días restantes. */
data class Deadline(val id: String, val title: String, val date: String, val note: String, val url: String, val days: Int)

/**
 * Lee web/data.json (copiado a assets en tiempo de build) y muestra notificaciones
 * nativas para los vencimientos de los próximos 7 días.
 */
object Alerts {

    private const val TAG = "Certf"
    private const val CHANNEL_ID = "certf_deadlines"
    private const val REQ_CODE = 4242
    private const val WINDOW_DAYS = 7

    /** Lee y parsea las fechas críticas desde assets/www/data.json. */
    fun load(context: Context): List<Deadline> = try {
        val json = context.assets.open("www/data.json").bufferedReader().use { it.readText() }
        val arr = JSONObject(json).getJSONArray("deadlines")
        val out = ArrayList<Deadline>(arr.length())
        for (i in 0 until arr.length()) {
            val o = arr.getJSONObject(i)
            out.add(
                Deadline(
                    id = o.optString("id"),
                    title = o.optString("title"),
                    date = o.optString("date"),
                    note = o.optString("note"),
                    url = o.optString("url"),
                    days = daysUntil(o.optString("date"))
                )
            )
        }
        out
    } catch (e: Exception) {
        Log.w(TAG, "No se pudo leer assets/www/data.json", e)
        emptyList()
    }

    /** Días enteros entre hoy y una fecha ISO yyyy-MM-dd (negativo = ya pasó). */
    fun daysUntil(iso: String): Int {
        val parts = iso.split("-")
        if (parts.size != 3) return Int.MAX_VALUE
        val y = parts[0].toIntOrNull() ?: return Int.MAX_VALUE
        val m = parts[1].toIntOrNull() ?: return Int.MAX_VALUE
        val d = parts[2].toIntOrNull() ?: return Int.MAX_VALUE
        val target = Calendar.getInstance().apply {
            set(Calendar.YEAR, y)
            set(Calendar.MONTH, m - 1)
            set(Calendar.DAY_OF_MONTH, d)
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }.timeInMillis
        val today = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }.timeInMillis
        return ((target - today) / 86_400_000L).toInt()
    }

    fun ensureChannel(context: Context) {
        if (Build.VERSION.SDK_INT < 26) return
        val nm = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (nm.getNotificationChannel(CHANNEL_ID) == null) {
            nm.createNotificationChannel(
                NotificationChannel(CHANNEL_ID, "Fechas límite de certificaciones", NotificationManager.IMPORTANCE_DEFAULT).apply {
                    description = "Avisos de vencimiento de vouchers, becas y promociones."
                }
            )
        }
    }

    /** Alarma diaria (aprox. 09:00) que se reprograma sola tras cada disparo. */
    fun scheduleDaily(context: Context) {
        val am = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return
        val pi = pendingIntent(context)
        val cal = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, 9)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
            if (timeInMillis <= System.currentTimeMillis()) add(Calendar.DAY_OF_YEAR, 1)
        }
        try {
            am.setInexactRepeating(AlarmManager.RTC_WAKEUP, cal.timeInMillis, AlarmManager.INTERVAL_DAY, pi)
        } catch (e: SecurityException) {
            Log.w(TAG, "Sin permiso para programar alarmas", e)
        }
    }

    private fun pendingIntent(context: Context): PendingIntent {
        val flags = if (Build.VERSION.SDK_INT >= 23) {
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        } else {
            PendingIntent.FLAG_UPDATE_CURRENT
        }
        return PendingIntent.getBroadcast(context, REQ_CODE, Intent(context, ReminderReceiver::class.java), flags)
    }

    /** Dispara las notificaciones de las fechas que vencen dentro de la ventana. */
    fun notifyUpcoming(context: Context) {
        ensureChannel(context)
        val upcoming = load(context).filter { it.days in 0..WINDOW_DAYS }
        if (upcoming.isEmpty()) {
            Log.i(TAG, "Sin fechas críticas en los próximos $WINDOW_DAYS días")
            return
        }
        if (Build.VERSION.SDK_INT >= 33 &&
            context.checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) !=
            android.content.pm.PackageManager.PERMISSION_GRANTED
        ) {
            Log.i(TAG, "Permiso de notificaciones no concedido todavía")
            return
        }

        val openApp = PendingIntent.getActivity(
            context, 7,
            Intent(context, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP),
            if (Build.VERSION.SDK_INT >= 23) PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            else PendingIntent.FLAG_UPDATE_CURRENT
        )

        val nm = NotificationManagerCompat.from(context)
        upcoming.forEachIndexed { index, d ->
            val whenText = when (d.days) {
                0 -> "Vence HOY"
                1 -> "Vence mañana"
                else -> "Vence en ${d.days} días"
            }
            val notif = NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_popup_reminder)
                .setContentTitle("$whenText · ${d.title}")
                .setContentText(d.note)
                .setStyle(NotificationCompat.BigTextStyle().bigText("${d.note}\n\nFecha: ${d.date}"))
                .setContentIntent(openApp)
                .setAutoCancel(true)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .build()
            try {
                nm.notify(1000 + index, notif)
            } catch (e: SecurityException) {
                Log.w(TAG, "No se pudo notificar (permiso denegado)", e)
            }
        }
    }
}
