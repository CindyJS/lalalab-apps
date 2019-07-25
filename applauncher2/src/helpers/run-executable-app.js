/* eslint-disable global-require */
import isElectron from 'is-electron';

export default function runExecutableApp(appCfg, lang = 'en') {
  if (window.parentRunExecutableApp !== undefined) {
    return window.parentRunExecutableApp(appCfg, lang);
  }

  return new Promise((accept, reject) => {
    if (isElectron()) {
      try {
        // The following two requires should be included when running under electron
        // and not present when running on a regular browser.
        // They have been marked as external dependencies in the browserify configuration
        // to avoid including them when creating the application bundle.

// eslint-disable-next-line global-require,import/no-unresolved,import/no-extraneous-dependencies
        const electron = require('electron');
// eslint-disable-next-line global-require,import/no-unresolved,import/no-extraneous-dependencies
        // noinspection NodeJsCodingAssistanceForCoreModules
        const childProcess = require('child_process');
        const appProcess = childProcess.spawn(
          appCfg.main,
          appCfg.args || [],
          {
            cwd: appCfg.cwd,
            env: Object.assign(electron.remote.process.env, { LANG: lang }, appCfg.env),
            shell: appCfg.shell || false,
            stdio: ['ignore', electron.remote.process.stdout, electron.remote.process.stderr],
          }
        );
        appProcess.on('exit', () => accept());
        appProcess.on('error', (err) => {
          reject(new Error(`Error launching executable application ${appCfg.id}: ${err.message}`));
        });
      } catch (err) {
        reject(new Error(`Error launching executable application ${appCfg.id}: ${err.message}`));
      }
    } else {
      reject(new Error(`Executable application ${appCfg.id} can only be launched from electron`));
    }
  });
}
