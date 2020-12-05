const gulp = require('gulp')
const pug = require('gulp-pug')

module.exports = function pug2html(cb) {
  return gulp.src(['./src/*.pug', '!./src/common.pug'])
    .pipe(pug())
    .pipe(gulp.dest('./build'))
}