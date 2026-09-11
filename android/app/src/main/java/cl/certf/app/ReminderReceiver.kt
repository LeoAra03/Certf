package cl.certf.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/** Receptor de la alarma diaria: muestra los avisos y reprograma el día siguiente. */
class ReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        Alerts.notifyUpcoming(context)
        Alerts.scheduleDaily(context) // mantiene la alarma viva tras reinicios/cambios
    }
}
