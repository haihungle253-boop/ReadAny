package expo.modules.einkrefresh

import android.util.Log
import android.view.View
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.lang.reflect.Method

/**
 * Full e-ink refresh on Onyx BOOX (Qualcomm EPD) firmware.
 *
 * Onyx patches android.view.View with a hidden refreshScreen(x, y, w, h, mode)
 * method (EpdController.refreshScreenRegion in the Onyx SDK). Calling it via
 * reflection needs no SDK dependency and is a no-op elsewhere. Mode values
 * follow KOReader's OnyxEPDController (android-luajit-launcher).
 */
class EinkRefreshModule : Module() {
  companion object {
    private const val TAG = "EinkRefresh"
    private const val UPDATE_FULL = 32
    private const val MODE_WAIT = 64
    private const val MODE_GC16 = 2
    private const val FULL_GC16 = UPDATE_FULL + MODE_WAIT + MODE_GC16

    private val refreshScreen: Method? by lazy {
      try {
        View::class.java.getMethod(
          "refreshScreen",
          Integer.TYPE, Integer.TYPE, Integer.TYPE, Integer.TYPE, Integer.TYPE,
        )
      } catch (e: Exception) {
        null
      }
    }
  }

  override fun definition() = ModuleDefinition {
    Name("EinkRefresh")

    Function("isSupported") {
      refreshScreen != null
    }

    // Returns false when unsupported. The delay lets the WebView / RN views
    // finish drawing the new frame before the panel is flashed.
    Function("fullRefresh") { delayMs: Int ->
      val method = refreshScreen ?: return@Function false
      val view = appContext.currentActivity?.window?.decorView ?: return@Function false
      Thread {
        try {
          if (delayMs > 0) Thread.sleep(delayMs.toLong())
          method.invoke(view, 0, 0, view.width, view.height, FULL_GC16)
        } catch (e: Exception) {
          Log.w(TAG, "full refresh failed", e)
        }
      }.start()
      true
    }
  }
}
