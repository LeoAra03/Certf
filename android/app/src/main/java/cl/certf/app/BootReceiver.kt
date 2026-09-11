package cl.certf.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/** Reprograma los recordatorios tras reiniciar el teléfono o actualizar la app. */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action
        if (action == Intent.ACTION_BOOT_COMPLETED || action == Intent.ACTION_MY_PACKAGE_REPLACED) {
            Alerts.ensureChannel(context)
            Alerts.scheduleDaily(context)
        }
    }
}
