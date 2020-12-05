const gulp = require('gulp')
const imagemin = require('gulp-imagemin')
const imgCompress = require('imagemin-jpeg-recompress')
const cache = require('gulp-cache');

//В разработке
module.exports = function img() {
  return gulp.src(['src/**/*.svg', 'src/**/*.jpg', 'src/**/*.png', 'src/**/*.gif'])
    .pipe(
      cache(
        imagemin([
          imgCompress({
            loops: 4,
            min: 70,
            max: 80,
            quality: 'high'
          }),
          imagemin.gifsicle(),
          imagemin.optipng(),
          imagemin.svgo()
        ])
      )
    )
    .pipe(gulp.dest('./build/img'));
}