/* globals IMAGINARY */

/**
 * Remote launchers are a mechanism for the app launcher to trigger the execution of
 * code beyond launching a web or executable app when an icon is clicked.
 *
 * A remote launcher is registered in the appLauncher using an ID that an app can
 * reference. If the app's icon is clicked the run method will be called, and if the
 * app needs to close, close will be called.
 *
 * Remote launchers are created and initialized when the appLauncher is created and
 * live until the appLauncher is closed, so they can persist remote connections or
 * whatever they need to do their work.
 *
 * Define and register a remoteLauncher in a JS file inside an AppLauncher plugin,
 * which can be included in the appLauncher config.
 */
IMAGINARY.AppLauncher.registerRemoteLauncher('sampleRemoteLauncher', (function () {
  // eslint-disable-next-line no-underscore-dangle,no-unused-vars
  let _appLauncher = null;

  /**
   * Init the launcher
   *
   * This method will be called by the appLauncher when it starts.
   *
   * @param {AppLauncher} appLauncher
   *  The AppLauncher instance
   */
  function init(appLauncher) {
    _appLauncher = appLauncher;
  }

  /**
   * Launch an app
   *
   * This method will be called by the appLauncher when the user launchs an app
   * associated with this launcher.
   *
   * @param {object} appCfg
   *  Configuration of the app to launch
   * @param {string} lang
   *  Language to launch the app with
   * @param {function} onClose
   *  Callback to call if the app decides to close on its own
   */
  // eslint-disable-next-line no-unused-vars
  function run(appCfg, lang, onClose) {

  }

  /**
   * Close the currently running app
   *
   * This method will be called by the appLauncher when the app needs to close
   *
   */
  function close() {

  }

  return {
    init,
    run,
    close,
  };
}()));
