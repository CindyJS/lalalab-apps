import Application from './application';
import runExecutableApp from '../helpers/run-executable-app';

/**
 * Web applications that run in an iframe
 */
export default class IframeApplication extends Application {

  constructor(config, appLauncher) {
    super(config, appLauncher);
    this.width = config.width;
    this.height = config.height;
    this.enableExecution = config.enableExecution;
  }

  init() {
    this.appLauncher.setTheaterMode();
    if (this.id !== this.appLauncher.config.infoApp) {
      this.appLauncher.utilBar.displayTitle(this.appLauncher.getLocalizedValue(this.name));
    }
  }

  run(lang = 'en') {
    const container = this.appLauncher.appArea.getContainer();
    window.IMAGINARY.CindyViewer.create(
      container,
      `${this.root}/${this.main}`,
      this.width ? this.width : '100%',
      this.height ? this.height : '100%',
      lang
    );
    const innerWindow = $(container).find('iframe')[0].contentWindow;
    if (innerWindow.IMAGINARY === undefined) {
      innerWindow.IMAGINARY = {};
    }
    innerWindow.IMAGINARY.AppLauncher = this.appLauncher.getWebAPI();

    // Eventually this has to be integrated into the API better
    if (this.enableExecution) {
      innerWindow.parentRunExecutableApp = runExecutableApp;
    }

    this.appLauncher.setAppVisible(true);
  }

  doClose() {
    this.appLauncher.setAppVisible(false);
    this.appLauncher.setMenuMode();
    this.appLauncher.utilBar.hideTitle();
    this.appLauncher.appArea.clear();
  }
}
