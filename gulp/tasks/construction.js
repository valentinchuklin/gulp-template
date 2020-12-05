const gulp = require('gulp')

// Live server
const browsersync = require('browser-sync')
const liveserver = function bsync() {
  browsersync.init({
    watch: true,
    server: {
      baseDir: "./dev-build/",
    }
  })
}

//Pug2html
const pug = require('gulp-pug')

const pugfunction = function pug2html(cb) {
  return gulp.src(['./src/*.pug', '!./src/common.pug'])
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest('./dev-build'))
}
//Watch pug function
const watchpugchanges = function () {
  gulp.watch('src/**/*.pug', { events: 'all' }, pugfunction)
}

//Sass function
const sass = require('gulp-sass')
sass.compiler = require('node-sass')

const sassfunction = function () {
  return gulp.src('src/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dev-build/css/'));
}
//Watch sass function
const watchsasschanges = function () {
  gulp.watch('src/**/*.sass', { events: 'all' }, sassfunction)
}

//JS function
const terser = require('gulp-terser');
 
const jsfunction = function(){
  return gulp.src('./src/**/*.js')
    .pipe(terser())
    .pipe(gulp.dest('./dev-build/js/'));
}
//Watch js function
const watchjs = function () {
  gulp.watch('./src/**/*.js', { events: 'all' }, jsfunction)
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
    .pipe(gulp.dest('dev-build/img/'));
}
//Watch img function
const watchimg = function () {
  gulp.watch('src/img/*.*', { events: 'all' }, imgfunction)
}

//Копирование шрифтов
const copyfontsfunction = function () {
  return gulp.src('./src/common/fonts/*.woff*')
    .pipe(gulp.dest('./dev-build/fonts/'));
}
//Watch fonts
const watchfonts = function () {
  gulp.watch('./src/common/fonts/*.woff*', { events: 'all' }, copyfontsfunction)
}

//Final task
const build = gulp.series(pugfunction, sassfunction, jsfunction, imgfunction, copyfontsfunction)
const watch = gulp.parallel(liveserver, watchpugchanges, watchsasschanges, watchjs, watchimg, watchfonts)

module.exports = gulp.series(build, watch)