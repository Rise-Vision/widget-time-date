/* jshint node: true */

(function () {
  "use strict";

  var bump = require("gulp-bump");
  var del = require("del");
  var factory = require("widget-tester").gulpTaskFactory;
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
    return gulp.src("src/components/rv-common-style/dist/fonts/**/*")
      .pipe(gulp.dest("dist/fonts"));
  });

  gulp.task("i18n", function(cb) {
    return gulp.src(["src/components/rv-common-i18n/dist/locales/**/*"])
      .pipe(gulp.dest("dist/locales"));
  });

  gulp.task("build", function (cb) {
    runSequence(["clean", "config"], ["source", "fonts", "i18n"], ["unminify"], cb);
  });

  gulp.task("default", function(cb) {
    runSequence("build", cb);
  });
})();
