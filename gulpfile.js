"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var imagemin = require("gulp-imagemin");
var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");
var webp = require("gulp-webp");
var uglify = require("gulp-uglify");
var plumber = require("gulp-plumber");
var server = require("browser-sync").create();
var del = require("del");
var run = require("run-sequence");
var watch = require("gulp-watch");

gulp.task("clean", function() {
  return del("build");
});

gulp.task("build-webp", function() {
  return gulp.src("img/*.{png,jpg}")
    .pipe(webp({quality: 80}))
    .pipe(gulp.dest("build/img"));
});

gulp.task("build-sprite", function() {
  return gulp.src("img/sprite/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
});

gulp.task("build-bg-img", function () {
  return gulp.src("img/bg/*.*")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("build-img", ["build-bg-img"], function () {
  return gulp.src("img/*.*")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("build-fonts", function() {
  return gulp.src("fonts/**/*.{woff,woff2}")
  .pipe(gulp.dest("build/fonts"))
});

gulp.task("build-style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("build-js", function() {
  return gulp.src("js/*.js")
  .pipe(gulp.dest("build/js"))
  .pipe(uglify())
  .pipe(rename({
    suffix: ".min"
  }))
  .pipe(gulp.dest("build/js"))
  .pipe(server.reload({stream: true}));
});

gulp.task("build-html", function() {
  return gulp.src("*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("build", function (done) {
  run(
    "clean",
    "build-webp",
    "build-sprite",
    "build-img",
    "build-fonts",
    "build-style",
    "build-js",
    "build-html",
    done
  );
});

gulp.task("watch", function() {
  gulp.watch("sass/**/*.{scss,sass}", ["build-style"]);
  gulp.watch("*.html", ["build-html"]);
  gulp.watch("js/*.js", ["build-js"]);
  gulp.watch("img/**/*.*", ["build-img"]);
  gulp.watch("fonts/**/*.*", ["build-fonts"]);
});

gulp.task("serve", ["watch"], function() {
  server.init({
    server: "./build",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
});
