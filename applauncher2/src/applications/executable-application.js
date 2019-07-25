/* eslint-disable global-require */
import Application from './application';
import runExecutableApp from '../helpers/run-executable-app';

/**
 * Applications that are executable programs that run as child processes
 */
export default class ExecutableApplication extends Application {

  constructor(config, appLauncher) {
    super(config, appLauncher);
    this.config = config;
  }

  init() {
    this.appLauncher.setBlankMode();
  }

  run(lang = 'en') {
    runExecutableApp(this.config, lang)
      .then(() => {
        this.close();
      })
      .catch((err) => {
        console.error(err);
        window.setTimeout(() => this.close(), 2000);
      });
  }

  doClose() {
    this.appLauncher.setMenuMode();
  }
}
