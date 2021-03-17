/* jshint node: true */

(function () {
  "use strict";

  var bower = require("gulp-bower");
  var bump = require("gulp-bump");
  var del = require("del");
  var factory = require("widget-tester").gulpTaskFactory;
  var file = require("gulp-file");
  var gulp = require("gulp");
  var gulpif = require("gulp-if");
  var gutil = require("gulp-util");
  var jshint = require("gulp-jshint");
  var minifyCSS = require("gulp-minify-css");
  var path = require("path");
  var rename = require("gulp-rename");
  var runSequence = require("run-sequence");
  var sourcemaps = require("gulp-sourcemaps");
  var uglify = require("gulp-uglify");
  var usemin = require("gulp-usemin");
  var wct = require("web-component-tester").gulp.init(gulp);
  var env = process.env.NODE_ENV || "prod";

  var appJSFiles = [
      "src/**/*.js",
      "!./src/components/**/*"
    ],
    htmlFiles = [
      "./src/settings.html",
      "./src/widget.html"
    ],
    vendorFiles = [
      "./src/components/tinymce/plugins/**/*",
      "./src/components/tinymce/skins/**/*",
      "./src/components/tinymce/themes/**/*",
      "./src/components/tinymce/tinymce*.js",
      "./src/components/angular/angular*.js",
      "./src/components/angular/*.gzip",
      "./src/components/angular/*.map",
      "./src/components/angular/*.css",
      "./src/components/jquery/dist/**/*",
      "./src/components/moment/min/moment.min.js",
      "./src/components/moment-timezone/builds/*.js"

    ];

  gulp.task("clean", function (cb) {
    del(["./dist/**"], cb);
  });

  gulp.task("config", function() {
    var configFile = (env === "dev" ? "dev.js" : "prod.js");

    gutil.log("Environment is", env);

    return gulp.src(["./src/config/" + configFile])
      .pipe(rename("config.js"))
      .pipe(gulp.dest("./src/config"));
  });

  gulp.task("bump", function(){
    return gulp.src(["./package.json", "./bower.json"])
      .pipe(bump({type:"patch"}))
      .pipe(gulp.dest("./"));
  });

  gulp.task("lint", function() {
    return gulp.src(appJSFiles)
      .pipe(jshint())
      .pipe(jshint.reporter("jshint-stylish"))
      .pipe(jshint.reporter("fail"));
  });

  gulp.task("version", function () {
    var pkg = require("./package.json"),
      str = '/* exported version */\n' +
        'var version = "' + pkg.version + '";';

    return file("version.js", str, {src: true})
      .pipe(gulp.dest("./src/config/"));
  });

  gulp.task("source", ["lint"], function () {
    var isProd = (env === "prod");

    return gulp.src(htmlFiles)
      .pipe(gulpif(isProd,
        // Minify for production.
        usemin({
          css: [sourcemaps.init(), minifyCSS(), sourcemaps.write()],
          js: [sourcemaps.init(), uglify(), sourcemaps.write()]
        }),
        // Don't minify for staging.
        usemin({})
      ))
      .pipe(gulp.dest("dist/"));
  });

  gulp.task("unminify", function () {
    return gulp.src(htmlFiles)
      .pipe(usemin({
        css: [rename(function (path) {
          path.basename = path.basename.substring(0, path.basename.indexOf(".min"))
        }), gulp.dest("dist")],
        js: [rename(function (path) {
          path.basename = path.basename.substring(0, path.basename.indexOf(".min"))
        }), gulp.dest("dist")]
      }))
  });

  gulp.task("fonts", function() {
    return gulp.src("src/components/common-header/dist/fonts/**/*")
      .pipe(gulp.dest("dist/fonts"));
  });

  gulp.task("i18n", function(cb) {
    return gulp.src(["src/components/common-header/dist/locales/**/*"])
      .pipe(gulp.dest("dist/locales"));
  });

  gulp.task("vendor", function(cb) {
    return gulp.src(vendorFiles, {base: "./src/components"})
      .pipe(gulp.dest("dist/js/vendor"));
  });

  gulp.task("webdriver_update", factory.webdriveUpdate());

// ***** e2e Testing ***** //

  gulp.task("html:e2e:settings", factory.htmlE2E({
    e2emomenttimezone: "components/moment-timezone/builds/moment-timezone-with-data-10-year-range.js",
    e2eTinymce: "components/tinymce/tinymce.js"
  }));

  gulp.task("e2e:server:settings", ["config", "html:e2e:settings"], factory.testServer());

  gulp.task("test:e2e:settings:run", ["webdriver_update"], factory.testE2EAngular({
    testFiles: "test/e2e/settings.js"}
  ));

  gulp.task("test:e2e:settings", function(cb) {
    runSequence(["e2e:server:settings"], "test:e2e:settings:run", "e2e:server-close", cb);
  });

  gulp.task("e2e:server-close", factory.testServerClose());

  gulp.task("test:e2e", function(cb) {
    runSequence("test:e2e:settings", cb);
  });

  // Integration testing
  gulp.task("test:integration", function(cb) {
    runSequence("test:local", cb);
  });

// ****** Unit Testing ***** //
  gulp.task("test:unit:settings", factory.testUnitAngular(
    {testFiles: [
      "src/components/jquery/dist/jquery.js",
      "src/components/angular/angular.js",
      "src/components/angular-mocks/angular-mocks.js",
      "src/components/angular-load/angular-load.js",
      "src/components/angular-translate/angular-translate.js",
      "src/components/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
      "node_modules/widget-tester/mocks/common-mock.js",
      "node_modules/widget-tester/mocks/gadget-mocks.js",
      "node_modules/widget-tester/mocks/logger-mock.js",
      "src/components/bootstrap-sass-official/assets/javascripts/bootstrap.js",
      "src/components/angular-bootstrap/ui-bootstrap-tpls.js",
      "src/components/tinymce-dist/tinymce.js",
      "src/components/angular-ui-tinymce/src/tinymce.js",
      "src/components/widget-settings-ui-components/dist/js/**/*.js",
      "src/components/widget-settings-ui-core/dist/*.js",
      "src/components/bootstrap-form-components/dist/js/**/*.js",
      "src/components/moment/moment.js",
      "src/components/moment-timezone/builds/moment-timezone-with-data-10-year-range.js",
      "src/config/version.js",
      "src/config/test.js",
      "src/settings/settings-app.js",
      "src/settings/**/*.js",
      "test/unit/settings/**/*spec.js"]}
  ));

  gulp.task("test:unit:widget", factory.testUnitAngular(
    {testFiles: [
      "node_modules/widget-tester/mocks/gadget-mocks.js",
      "node_modules/widget-tester/mocks/logger-mock.js",
      "src/components/widget-common/dist/config.js",
      "src/config/config.js",
      "src/widget/time-date.js",
      "test/unit/time-date-spec.js"
    ]}
  ));

  gulp.task("test:unit", function(cb) {
    runSequence("test:unit:settings", "test:unit:widget", cb);
  });

  gulp.task("test", function(cb) {
    runSequence("version", "test:unit", "test:e2e", "test:integration", cb);
  });

  gulp.task("bower-update", function (cb) {
    return bower({ cmd: "update"}).on("error", function(err) {
      console.log(err);
      cb();
    });
  });

  gulp.task("build", function (cb) {
    runSequence(["clean", "config", "bower-update", "version"], ["source", "fonts", "i18n", "vendor"], ["unminify"], cb);
  });

  gulp.task("default", function(cb) {
    runSequence("build", cb);
  });
})();
