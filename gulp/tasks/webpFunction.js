//Конвертация в webp
const gulp = require('gulp');
const webp = require('gulp-webp');

const webpFunction = function(input, output) {
  var input = './lab/img-rastr/input/**/*.*';
  var output = './lab/img-rastr/output/';
  return gulp.src(input)
    .pipe(webp())
    .pipe(gulp.dest(output));
}

module.exports = webpFunction;