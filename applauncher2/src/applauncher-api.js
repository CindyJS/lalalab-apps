/**
 * AppLauncher2 API for providing services and operations
 * to launched web apps.
 *
 * The member methods and properties in this class are provided
 * to web clients through window.IMAGINARY.AppLauncher.
 */

export default class AppLauncherWebAPI {
  /**
   * Constructor
   *
   * @param appLauncher the host AppLauncher instance
   */
  constructor(appLauncher) {
    this.appLauncher = appLauncher;
  }

  /**
   * Close the active running app and go back to the menu
   */
  closeApp() {
    this.appLauncher.closeApp();
    this.appLauncher.setMenuMode();
  }

  // TO DO:
  // Get active language, enumerate languages, change language, access cfg?
  // launch executable programs, etc.
}
