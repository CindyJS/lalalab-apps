import EventEmitter from 'events';
import isAbsoluteUrl from 'is-absolute-url';
import IframeApplication from './applications/iframe-application';
import ExecutableApplication from './applications/executable-application';
import RemoteApplication from './applications/remote-application';
import UtilBar from './components/util-bar';
import ImageLogo from './components/logo-img';
import TextLogo from './components/logo-text';
import LangMenu from './components/lang-menu';
import Overlay from './components/overlay';
import AppArea from './components/app-area';
import InputMask from './components/input-mask';
import AppMenu from './components/app-menu';
import AppButton from './components/app-button';
import AppLauncherWebAPI from './applauncher-api';
import InfoText from './components/info-text';


/**
 * appInit event
 *  Fired when an app is initialized before opening
 * @event AppLauncher#appInit
 * @type {object}
 * @property {object} cfg The configuration of the app being initialized
 */
/**
 * appStart event
 *  Fired when an app starts
 * @event AppLauncher#appStart
 * @type {object}
 * @property {object} cfg The configuration of the app that is now running
 */
/**
 * appEnd event
 *  Fired when an app is closed
 * @event AppLauncher#appEnd
 * @type {object}
 * @property {object} cfg The configuration of the app closed
 */

/**
 * The main AppLauncher Application
 */
export default class AppLauncher {

  constructor(config) {
    this.events = new EventEmitter();
    this.$element = null;
    this.config = Object.assign({}, AppLauncher.defaultCfg, config);
    this.lang = this.config.lang;
    this.runningApp = null;
    this.remoteLaunchers = {};

    this.$body = $('body');
    this.$body.addClass('lock-position');

    this.events.on('appInit', ({ cfg }) => {
      this.$body.removeClass('app-running');
      this.$body.addClass('app-init');
    });

    this.events.on('appStart', ({ cfg }) => {
      this.$body.removeClass('app-init');
      this.$body.addClass('app-running');
    });

    this.events.on('appEnd', ({ cfg }) => {
      this.$body.removeClass('app-init');
      this.$body.removeClass('app-running');
    });

    this.overlay = new Overlay({
      onShow: this.onOverlayShow.bind(this),
      onClose: this.onOverlayClose.bind(this),
    });
    this.logo = this.createLogo();

    this.appButtons = this.config.apps.map(appID => new AppButton({
      appID,
      name: this.getLocalizedValue(this.config.appCfgs[appID].name),
      icon: `${this.config.appCfgs[appID].root}/icons/icon.png`,
      onClick: this.onAppButtonClick.bind(this),
    }));

    this.events.on('appInit', ({ cfg }) => {
      const appButton = this.appButtons.find(({ props }) => props.appID === cfg.id);
      if (appButton) {
        appButton.setInitializing();
      }
    });
    this.events.on('appStart', ({ cfg }) => {
      const appButton = this.appButtons.find(({ props }) => props.appID === cfg.id);
      if (appButton) {
        appButton.setStarted();
      }
    });
    this.events.on('appEnd', ({ cfg }) => {
      const appButton = this.appButtons.find(({ props }) => props.appID === cfg.id);
      if (appButton) {
        appButton.setClosed();
      }
    });

    this.appMenu = new AppMenu({
      appButtons: this.appButtons,
      buttonsPerRow: this.config.iconsPerRow,
      maxIconsPerRow: this.config.maxIconsPerRow,
    });

    this.utilBar = new UtilBar({
      langMenuShow: this.config.langMenuShow,
      infoAppShow: !!this.config.infoApp,
      onLangButton: this.onUtilLangButton.bind(this),
      onInfoButton: this.onUtilInfoButton.bind(this),
      onBackButton: this.onUtilBackButton.bind(this),
    });

    this.infoText = new InfoText({
      text: this.getLocalizedValue(this.config.infoText),
    });

    this.appArea = new AppArea();
    this.inputMask = new InputMask();

    this.setTitle();
    this.setMenuMode();
    this.initResizeHandler();
  }

  /**
   * Inits the window resize handler
   *
   * The resize handler is throttled (out of love for CPUs everywhere).
   */
  initResizeHandler() {
    // Timeout for throttled resize
    let resizeTimeout;

    window.addEventListener('resize', () => {
      // ignore resize events as long as an actualResizeHandler execution is in the queue
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(() => {
          resizeTimeout = null;
          this.onResize();
          // The actualResizeHandler will execute at a rate of 15fps
        }, 66);
      }
    });
  }

  /**
   * Loads all plugins defined in the configuration.
   *
   * Adds the stylesheets and scripts defined in plugins in the
   * page header. Returns a promise that resolves once every plugin
   * script has finished loading.
   *
   * @return {Promise<any[]>}
   */
  loadPlugins() {
    const loadHandlers = [];

    this.config.pluginCfgs.forEach((cfg) => {
      cfg.stylesheets.forEach((stylesheet) => {
        const url = isAbsoluteUrl(stylesheet) ? stylesheet : `${cfg.root}/${stylesheet}`;
        const $linkElement = $('<link>');
        $linkElement.attr('rel', 'stylesheet');
        $linkElement.attr('type', 'text/css');
        $linkElement.attr('href', url);
        $linkElement.appendTo('head');
      });
    });

    this.config.pluginCfgs.forEach((cfg) => {
      cfg.scripts.forEach((script) => {
        loadHandlers.push(new Promise((accept, reject) => {
          const url = isAbsoluteUrl(script) ? script : `${cfg.root}/${script}`;
          const $scriptElement = $('<script>');
          $scriptElement.attr('type', 'text/javascript');
          $scriptElement.on('load', () => {
            accept();
          });
          $scriptElement.on('error', () => {
            reject(new Error(`Error loading '${url}' from plugin '${cfg.id}'`));
          });
          $scriptElement.appendTo('head');
          $scriptElement.attr('src', url);
        }));
      });
    });

    return Promise.all(loadHandlers);
  }

  /**
   * Loads and activates a theme
   *
   * @param {string} themeName
   */
  loadTheme() {
    if (this.config.theme !== undefined) {
      const $themeCSSFile = $('<link>');
      $themeCSSFile.attr('rel', 'stylesheet');
      $themeCSSFile.attr('type', 'text/css');
      $themeCSSFile.attr('href', `themes/${this.config.theme}/default.css`);
      $themeCSSFile.appendTo('head');
    }
  }

  /**
   * Factory method to create Application objects from a configuration
   *
   * @param {object} appConfig
   *  The app's configuration
   * @return {Application}
   */
  createApplication(appConfig) {
    if (appConfig.type === 'iframe') {
      return new IframeApplication(appConfig, this);
    } else if (appConfig.type === 'executable') {
      return new ExecutableApplication(appConfig, this);
    } else if (appConfig.type === 'remote') {
      return new RemoteApplication(appConfig, this);
    }
    throw new Error(`Unknown application type : ${appConfig.type}`);
  }

  getWebAPI() {
    return new AppLauncherWebAPI(this);
  }

  /**
   * Registers a remote launcher
   *
   * @param {string} id
   *  The id used to reference this launcher
   * @param {object} launcher
   *  A launcher object. See `sample-remote-launcher.js`
   */
  registerRemoteLauncher(id, launcher) {
    this.remoteLaunchers[id] = launcher;
    launcher.init(this);
  }

  /**
   * Returns the localized value of a configuration item
   *
   * If the passed item is a string it's returned directly. If it's an object
   * with language code as keys the most appropriate option is returned
   * (the current language, 'default' or english)
   *
   * @param {string|object} item
   *  A string or object with language codes as keys
   * @return {*}
   */
  getLocalizedValue(item) {
    if (typeof item === 'string') {
      return item;
    } else if (typeof item === 'object') {
      if (item[this.lang] !== undefined) {
        return item[this.lang];
      } else if (item.default !== undefined) {
        return item.default;
      } else if (item.en !== undefined) {
        return item.en;
      }
    }

    return '';
  }

  /**
   * Sets the active language
   *
   * @param {string} langCode
   *  ISO language code
   */
  setLang(langCode) {
    this.lang = langCode;
    this.setTitle();

    const newLogo = this.createLogo();
    this.logo.$element.replaceWith(newLogo.render());
    this.logo = newLogo;

    this.appButtons.forEach((button) => {
      button.setName(this.getLocalizedValue(this.config.appCfgs[button.props.appID].name));
    });

    const newInfoText = new InfoText({
      text: this.getLocalizedValue(this.config.infoText),
    });
    this.infoText.$element.replaceWith(newInfoText.render());
    this.infoText = newInfoText;

    this.logo.resize();
  }

  /**
   * Top logo click handler
   *
   * @return {boolean}
   */
  onLogoClicked() {
    this.closeApp();
    this.setMenuMode();
    return false;
  }

  /**
   * Language switch button handler
   */
  onUtilLangButton() {
    this.closeApp();
    const langMenu = new LangMenu({
      items: this.config.langMenuItems,
      onSelect: this.onLangMenuChoice.bind(this),
    });
    this.overlay.show(langMenu.render());
  }

  /**
   * Info button handler
   */
  onUtilInfoButton() {
    if ((this.runningApp !== null) && (this.runningApp.id === this.config.infoApp)) {
      return false;
    }
    this.runApp(this.config.infoApp);
    return false;
  }

  /**
   * Close button handler
   *
   * @return {boolean}
   */
  onUtilBackButton() {
    if (this.overlay.visible) {
      this.overlay.close();
    } else {
      this.closeApp();
      this.setMenuMode();
    }
    return false;
  }

  /**
   * App icon click handler
   *
   * @param {object} app
   *  The app config
   * @return {boolean}
   */
  onAppButtonClick(appID) {
    this.runApp(appID);
    return false;
  }

  /**
   * Run an application
   *
   * @param {string} appID
   *  The id of the app to run
   * @fires AppLauncher#appInit
   * @fires AppLauncher#appStart
   * @fires AppLauncher#appEnd
   */
  runApp(appID) {
    const appCfg = this.config.appCfgs[appID];
    if (appCfg === undefined) {
      throw new Error(`Tried to run non-existent app with ID ${appID}`);
    }
    this.inputMask.disableUserInput();
    this.closeApp();
    const app = this.createApplication(appCfg, this);
    app.init();
    this.events.emit('appInit', { cfg: appCfg });
    // Delay for fluid animation
    window.setTimeout(() => {
      app.once('close', () => {
        this.runningApp = null;
        this.events.emit('appEnd', { cfg: appCfg });
      });
      app.run(this.lang);
      this.runningApp = app;
      this.events.emit('appStart', { cfg: appCfg });
      this.inputMask.enableUserInput();
    }, 500);
  }

  /**
   * Close the active app
   */
  closeApp() {
    if (this.runningApp !== null) {
      this.runningApp.close();
    }
  }

  /**
   * Clear the active mode
   */
  clearMode() {
    this.$body.removeClass((index, className) => (className.match(/(^|\s)mode-\S+/g) || []).join(' '));
  }

  /**
   * Sets the title
   */
  setTitle() {
    document.title = this.getLocalizedValue(this.config.title);
  }

  /**
   * Sets the launcher mode to 'menu'
   *
   * Menu mode shows the main appLauncher menu
   */
  setMenuMode() {
    this.clearMode();
    this.$body.addClass('mode-menu');
  }

  /**
   * Sets the launcher mode to 'theater'
   *
   * Theater mode has top and lower framing bars and a content area in the middle
   *
   * @return {HTMLDivElement} appArea container DOM Element
   */
  setTheaterMode() {
    this.clearMode();
    this.$body.addClass('mode-app');
    return this.appArea.getContainer();
  }

  /**
   * Sets the launcher mode to 'blank'
   *
   * Blank mode shows a blank black screen
   *
   * @return {HTMLDivElement} appArea container DOM Element
   */
  setBlankMode() {
    this.clearMode();
    this.$body.addClass('mode-blank');
    return this.appArea.getContainer();
  }

  /**
   * Sets the app visibility
   *
   * @param {bool} visibility
   *  true if the app should be visible
   */
  setAppVisible(visibility) {
    if (visibility) {
      this.$body.addClass('app-visible');
    } else {
      this.$body.removeClass('app-visible');
    }
  }

  onOverlayShow() {
    this.setTheaterMode();
  }

  onOverlayClose() {
    if (this.runningApp === null) {
      this.setMenuMode();
    }
  }

  /**
   * Creates the logo
   *
   * @return {Logo}
   */
  createLogo() {
    const logoImgUrl = this.getLocalizedValue(this.config.logo);
    if (logoImgUrl !== '') {
      return new ImageLogo({
        imgUrl: logoImgUrl,
        onClick: this.onLogoClicked.bind(this),
      });
    }
    return new TextLogo({
      text: this.getLocalizedValue(this.config.title),
      onClick: this.onLogoClicked.bind(this),
    });
  }

  /**
   * Language menu selection handler
   *
   * @param code
   * @return {boolean}
   */
  onLangMenuChoice(code) {
    this.overlay.close();
    this.setLang(code);
    return false;
  }

  /**
   * Resize handler
   */
  onResize() {
    this.logo.resize();
  }

  /**
   * Renders the app Launcher
   *
   * @return {JQuery | jQuery | HTMLElement}
   */
  render() {
    this.$element = $("<div class='appLauncher'></div>");
    const rowCount = Math.ceil(this.config.apps.length / this.config.maxIconsPerRow);
    this.$element.addClass(`appLauncher-${rowCount}-rows`);

    this.$element.append(this.logo.render());
    this.$element.append(this.appMenu.render());
    this.$element.append(this.appArea.render());
    this.$element.append(this.infoText.render());
    this.$element.append(this.overlay.render());
    this.$element.append(this.utilBar.render());
    this.$element.append(this.inputMask.render());

    return this.$element;
  }
}


AppLauncher.defaultCfg = {
  lang: 'en',
  title: 'IMAGINARY',
  langMenuShow: false,
  theme: 'default',
  maxIconsPerRow: 6,
  infoText: '',
};
