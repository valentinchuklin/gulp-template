//Конвертация в webp
const gulp = require('gulp');
const webp = require('gulp-webp');

const convertToWebp = function() {
  return gulp.src('lab/img-rastr/input/*.*')
    .pipe(webp())
    .pipe(gulp.dest('lab/img-rastr/output/'));
}

module.exports = convertToWebp;