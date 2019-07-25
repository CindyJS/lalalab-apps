/* eslint-disable global-require */
import Application from './application';

/**
 * Applications that run remotely through an external launcher
 */
export default class RemoteApplication extends Application {
  constructor(config, appLauncher) {
    super(config, appLauncher);
    this.config = config;

    if (appLauncher.remoteLaunchers[config.main] === undefined) {
      throw new Error(`No remote launcher registered with id '${config.main}'`);
    }
    this.remoteLauncher = appLauncher.remoteLaunchers[config.main];
  }

  init() {

  }

  run(lang = 'en') {
    this.remoteLauncher.run(this.config, lang, () => {
      this.close();
    });
  }

  doClose() {
    this.remoteLauncher.close();
  }
}
