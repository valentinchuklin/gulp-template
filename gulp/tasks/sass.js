const gulp = require('gulp')
const sass = require('gulp-sass')
sass.compiler = require('node-sass')

module.exports = function () {
  return gulp.src('src/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/css/'));
}