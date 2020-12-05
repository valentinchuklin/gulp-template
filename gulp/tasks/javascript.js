const gulp = require('gulp');
const terser = require('gulp-terser');
 
module.exports = function es(){
  return gulp.src('./src/**/*.js')
    .pipe(terser())
    .pipe(gulp.dest('./build/js/**/'));
}