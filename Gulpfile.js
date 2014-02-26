var gulp = require('gulp'),
  concat = require('gulp-concat'),
  browserify = require('gulp-browserify'),
  sass = require('gulp-ruby-sass'),
  prefix = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  minifycss = require('gulp-minify-css'),
  mocha = require('gulp-mocha'),
  es = require('event-stream'),
  lodash = require('lodash').template,
  template = require('gulp-template'),
  path = require('path');

var app = 'app';
var dist = 'dist';

gulp.task('styles', function () {
  gulp.src(app + '/styles/main.scss')
  .pipe(sass())
  .pipe(prefix("last 1 version", "> 1%"))
  .pipe(minifycss())
  .pipe(gulp.dest(app + '/' + dist))
});

gulp.task('copy', function () {
  gulp.src(app + '/styles/bootstrap.min.css')
    .pipe(gulp.dest(app + '/' + dist));
  gulp.src(app + '/styles/fonts/*')
    .pipe(gulp.dest(app + '/' + dist + '/fonts'));
});

gulp.task('scripts', function () {
  es.merge(
    gulp.src(app + '/scripts/main.js')
      .pipe(browserify()),
    gulp.src(app + '/scripts/templates/*.html')
      .pipe(es.map(function(file, cb) {
        var contents = lodash(file.contents.toString()).source;
        file.contents = new Buffer("(function () { (window['JST'] = window['JST'] || {})['" + path.basename(file.path , path.extname(file.path).toLowerCase()) + "'] = " + contents + "; })();");
        cb(null, file);
      }))
  ).pipe(concat('main.js'))
  .pipe(uglify())
  .pipe(gulp.dest(app + '/dist'));
});

gulp.task('default', ['scripts', 'styles', 'copy'], function() {  
  gulp.watch(app + '/scripts/**/*', function() {
    gulp.run('scripts');
  });

  gulp.watch(app + '/styles/**/*.scss', function() {
    gulp.run('styles');
  });
});