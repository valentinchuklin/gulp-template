const gulp = require('gulp')

// Live server
const browsersync = require('browser-sync')
const liveserver = function bsync() {
  browsersync.init({
    watch: true,
    server: {
      baseDir: "./build",
    }
  })
}

//Pug2html
const pug = require('gulp-pug')

const pugfunction = function pug2html(cb) {
  return gulp.src(['./src/*.pug', '!./src/common.pug'])
    .pipe(pug())
    .pipe(gulp.dest('./build'))
}

//Sass function
const sass = require('gulp-sass')
sass.compiler = require('node-sass')
const cleanCSS = require('gulp-clean-css');

const sassfunction = function () {
  return gulp.src('src/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({level: 2}))
    .pipe(gulp.dest('./build/css/'));
}

//JS function
const terser = require('gulp-terser');

const jsfunction = function () {
  return gulp.src('./src/**/*.js')
    .pipe(terser())
    .pipe(gulp.dest('./build/js/'));
}
//Оптимизация картинок
const imagemin = require('gulp-imagemin')
const imgCompress = require('imagemin-jpeg-recompress')
const cache = require('gulp-cache');

const imgfunction = function () {
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
    .pipe(gulp.dest('./build/img/'));
}

//Копирование шрифтов
const copyfontsfunction = function () {
  return gulp.src('./src/common/fonts/*.woff*')
    .pipe(gulp.dest('./build/fonts/'));
}

//Final task
module.exports = gulp.series(pugfunction, sassfunction, jsfunction, imgfunction, copyfontsfunction, liveserver)