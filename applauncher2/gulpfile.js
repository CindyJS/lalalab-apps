'use strict';

// Public HTTP directory
var http_public = '.';
// JS Output directory. Relative to the public directory. No trailing /.
var js_out_dir = '/assets/js';
// CSS Output directory. Relative to the public directory. No trailing /.
var css_out_dir = '/assets/css';
var themes__dir = '/themes';

var conf = require('./package.json');
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var babelify = require('babelify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var pack = require('tar-pack').pack;
var write = require('fs').createWriteStream;

var dependencies = [
];

// This dependencies are always external
var extDependencies = [
  'electron', 'child_process'
];

// How many times the scripts task is fired
var scriptsCount = 0;

function bundleApp(isProduction) {
  scriptsCount++;
  // Browserify will bundle all our js files together in to one and will let
  // us use modules in the front end.
  var appBundler = browserify({
    entries: './src/main.js',
    debug: true
  });

  // If it's not for production, a separate vendors.js file will be created
  // the first time gulp is run so that we don't have to rebundle things like
  // react everytime there's a change in the js file
  if (!isProduction && scriptsCount === 1){
    // create vendors.js for dev environment.
    browserify({
      require: dependencies,
      debug: true
    })
      .bundle()
      .on('error', gutil.log)
      .pipe(source('vendors.js'))
      .pipe(gulp.dest(http_public + js_out_dir + '/'));
  }
  if (!isProduction){
    // make the dependencies external so they dont get bundled by the
    // app bundler. Dependencies are already bundled in vendor.js for
    // development environments.
    dependencies.forEach(function(dep){
      appBundler.external(dep);
    });
  }

  extDependencies.forEach(function(dep){
    appBundler.external(dep);
  });

  appBundler
  // transform ES6 and JSX to ES5 with babelify
    .transform("babelify", {presets: ["es2015"]})
    .bundle()
    .on('error',gutil.log)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(http_public + js_out_dir + '/'));
}

gulp.task('scripts:dev', function () {
  bundleApp(false);
});

gulp.task('scripts:prod', function (){
  bundleApp(true);
});

gulp.task('scripts:watch', function () {
  gulp.watch(['./src/*.js'], ['scripts:dev']);
});

gulp.task('sass:default', function () {
  gulp.src(['./sass/**/*.scss', '!./sass/themes/**/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(http_public + css_out_dir));
});

gulp.task('sass:themes', function () {
  gulp.src('./sass/themes/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(http_public + themes__dir));
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass:default']);
});

gulp.task('sass', ['sass:default', 'sass:themes']);

gulp.task('distribute', function () {
  pack(process.cwd(), {
    ignoreFiles: ['.distignore']
  })
  .pipe(write('dist/applauncher2-' + conf.version + '.tar.gz'))
  .on('error', function (err) {
    console.error(err.stack)
  })
  .on('close', function () {
    console.log('done')
  });
});

gulp.task('default', ['sass', 'scripts:dev']);