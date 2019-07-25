import EventEmitter from 'events';

/**
 * abstract Application
 *
 * An application is a program / webapp / etc. that can be launched by the appLauncher
 */
export default class Application extends EventEmitter {

  /**
   * Constructor
   *
   * @param {object} config
   *  The app config object
   */
  constructor(config, appLauncher) {
    super();

    if (new.target === Application) {
      throw new TypeError('Cannot construct Application instances directly');
    }

    this.appLauncher = appLauncher;

    this.id = config.id;
    this.type = config.type;
    this.root = config.root;
    this.version = config.version;
    this.main = config.main;
    this.name = config.name;
  }

  /**
   * Visual setup previous to running the app
   *
   * Use this to perform loading animations / transitions before
   * the app is actually launched (which affects performance and
   * animation fluidity).
   */
  // eslint-disable-next-line class-methods-use-this
  init() {
    // Override (optional)
  }

  /**
   * Run the application
   *
   * @param {string} lang
   *  (optional) ISO Language code. Defaults to 'en'.
   */
  // eslint-disable-next-line no-unused-vars,class-methods-use-this
  run(lang = 'en') {
    // Override
    throw new Error('The run method must be overriden');
  }

  /**
   * Close the app
   */
  close() {
    this.doClose();
    this.emit('close');
  }

  /**
   * Cleanup when the app is closed
   */
  // eslint-disable-next-line class-methods-use-this
  doClose() {
    // Override (optional)
  }
}
