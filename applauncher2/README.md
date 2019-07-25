# IMAGINARY AppLauncher Mark II

A graphic menu for launching applications. Based on HTML technologies! This is a rewrite of the 
[IMAGINARY Application launcher](https://github.com/IMAGINARY/applauncher).

This is a complete rewrite of the first AppLauncher that is fully configurable, translatable, 
supports from 1 to 18 applications that can be either HTML apps that run in an iframe or regular 
executable apps.

## Goals

- Configurable (without recompiling)
- Translatable (without recompiling)
- Resolution-independent
- Independent from electron, so it can run there, in a standard browser, tablets, etc.
 
It should aim towards very clean layering:

- Browser
- AppLauncher core (API, Services, Configuration)
- AppLauncher i18n
- AppLauncher layout (visual layout)
- AppLauncher theme (light on dark background, dark on light, etc.)
- Applications

The browser itself and the applications are out of the scope of this project. Facilities for integrating the three
parts might be given in a separate repository, document, etc.

## Installation

Just make the root directory accesible with a web server. You should also configure it... if you have no plans
to configure this program then it's not the one you want.  

## Configuration

The configuration file is at `cfg/config.yml`. It is fully commented so it documents its own format. (NOTE:
The JSON schema used for validation is also available at `src/schemas/cfg.schema.json`.)

The default configuration provided is for demo purposes and offers a number of CindyJS applications found
in the internet. A sample configuration that accesses the apps locally is also provided 
(`sample-local-cindy.config.yml`).

Multiple configurations can be created using the name `cfg/<prefix>.config.yml` where prefix is an identifier
made of a combination of uppercase and lowercase ascii letters, digits, underscores or dashes (e.g. 
`cfg/cindy.config.yml`). The active configuration can be set passing the config identifier through the `cfg` 
query string parameter (e.g. `http://localhost/appLauncher/?cfg=cindy`).

## Applications

Applications are added to the AppLauncher by indicating the paths where they're installed in the config file.
The indicated path should contain:

- An `app.json` file that describes the application
- An `icons/icon.png` file with a large icon image (1000x1000 is recommended, see `docs/icon template.psd`)
- Optionally it can contain other files required to run the app
  
### app.json

The app.json should contain the following keys:

- **id**: The unique machine name of the application (lowercase letters, numbers, underscore, dash)

- **version**: Version identifier, parseable by node-semver (`https://github.com/npm/node-semver`). You can 
simply use the x.y.z format (e.g. `1.0.0`).

- **name**: The human readable name of the application that will be displayed in the menu. A single string
can be specified or an object where each key is a language code and it maps to a translated name. A default
name in english (`en`) should always be provided. 

- **description**: (Optional) Description text of the application. It's currently not being displayed but might be in the
future. A single string can be specified or an object where each key is a language code and it maps to a
translated description. A default description in english (`en`) should always be provided. 

- **type**: (Optional, default: 'iframe') Type of application. Either 'iframe' for launching a web application in
an iframe, 'executable' for launching an external process or 'remote' to use a remote launcher (see below). 
 
Extra options can be set depending on the **type** of application.

#### iframe apps

These are web apps that will be launched inside an iframe within the appLauncher. 

iframe apps can have the following keys:

- **main**: File that should be opened in the iframe to launch the application. (e.g. `index.html`) 
It can be a path or an absolute url.

- **width**, **height**: (Optional) Native resolution of the app. If specified the app will be run at this 
resolution and zoomed (in or out) to fit into the window. If not specified the app will run at the resolution
of the frame where it's launched (which might be very small, very large, or change during execution).

- **enableExecution**: (Optional) Set to true for apps that are actually an appLauncher2 instance and require
launching executable apps. Electron doesn't allow node.js code run in iframes, so executable apps can't be
launcehd from iframed appLaunchers. This setting provides appLauncher with a hook to execute in the parent
window context.

#### executable apps

These are OS-level executable programs (can only be launched when running appLauncher within the electron 
browser).

- **main**: Command to run. The process should stay alive until it's time for the menu to regain control.
Note also that the program launched should provide the user for some mechanism to end the process and exit 
back to the menu.

- **args**: (Optional) An array containing the list of string arguments.

- **cwd**: (Optional) Working directory for the command

- **env**: (Optional) An object with key-value pairs to set as environment for the process. The appLauncher
automatically loads the LANG environment variable with the language selected in the menu, but it can be overriden
through this setting. 

- **shell** (Optional, default: false) If `true` the command will be run in the default shell. 
A different shell can also be specified as a string. If `false` the command is run without a shell.

#### remote apps

These are apps handled by a "Remote Launcher" registered by a Plug-In (see `sample-remote-launcher.js`). 

- **main**: ID of the remote launcher to call.

## API

Iframe apps have access to an API that allows them to execute operations and get information from the host
appLauncher. API methods and properties are accesible through `window.IMAGINARY.AppLauncher`, 
check `src/applauncher-api.js` for documentation.

## Themes

Themes allow overriding default CSS styles and images. Each theme has a directory inside `themes` where its
`default.css` file and any extra assets are placed. If a theme is specified in the `config.yml` file its 
`default.css` file will be loaded dynamically when the appLauncher starts.

Note that the theme CSS files are precompiled from SASS files placed in `sass/themes/<theme name>`.

## Plugins

Plugins allow injecting JS and CSS into the AppLauncher. Put plugins in the `plugins` directory. Each
plugin should have a directory and a `plugin.js` file with the following format:

```
{
  "id":  "my-plugin-id",
  "version": "v1.0",
  "scripts": [
    "js/path-to-js-file.js"
  ],
  "stylesheets": [
    "css/path-to-css-file.css"
  ]
}
```

Both `scripts` and `stylesheets` are optional arrays. Each script and stylesheet specified will get loaded after
the AppLauncher is built. Plugins can interact with the AppLauncher through the `IMAGINARY.AppLauncher` global 
object and the events published through `IMAGINARY.AppLauncher.events`.

## Compilation

This app is built using several compilable languages:

- The HTML pages are built from **pug** template files.
- The CSS stylesheet is pre-compiled from **sass** files.
- The JS scripts are trans-compiled from **es6** (ES2015) files. 

To make any modifications re-compilation is necessary. You should install:

- **node** and **npm**
- **yarn**
- **gulp** (install globally)

Afterwards run the following in the command line:

```
yarn
```

After it runs succesfuly you can compile as needed:

- **sass (stylesheets)**
  ```
    gulp sass
  ```

- **scripts (ES6)**
  ```
    gulp scripts:prod
  ```
  
- **scripts (ES6, debug)**
  ```
    gulp scripts:dev
  ```

## Credits

Designed and developed by Eric Londaits (eric.londaits@imaginary.org) for IMAGINARY.

## License

Copyright 2017 IMAGINARY gGmbH

Licensed under the Apache License, Version 2.0.

See the LICENSE and NOTICE files for more details.
