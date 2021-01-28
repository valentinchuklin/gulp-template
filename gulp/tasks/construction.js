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
const htmlBeautify = require('gulp-html-beautify')
const htmlmin = require('gulp-htmlmin')

const pugfunction = function pug2html(cb) {
  var htmlBeautifyOptions = {
    "indent_size": 2
  };
  var htmlminOptions = {
    collapseWhitespace: true,
    includeAutoGeneratedTags: false
  }
  return gulp.src(['./src/*.pug', '!./src/common.pug'])
    .pipe(pug())
    .pipe(htmlmin(htmlminOptions))
    .pipe(htmlBeautify(htmlBeautifyOptions))
    .pipe(gulp.dest('./dev-build'))
}
//Watch pug function
const watchpugchanges = function () {
  gulp.watch('src/**/*.pug', { events: 'all' }, pugfunction)
}

//Sass function
const sass = require('gulp-sass')
sass.compiler = require('node-sass')
const postcss = require('gulp-postcss')
const sortMediaQueries = require('postcss-sort-media-queries')

const sassfunction = function () {
  var processors = [
    sortMediaQueries({
      sort: 'mobile-first'
    })
  ]
  return gulp.src('src/*.sass')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dev-build/css/'));
}
//Watch sass function
const watchsasschanges = function () {
  gulp.watch('./src/**/*.sass', { events: 'all' }, sassfunction)
}

//JS function
const jsfunction = function(){
  return gulp.src(['./src/**/*.js', '!./src/**/includes/**/*', '!./src/thirdparty/**/*'])
    .pipe(gulp.dest('./dev-build/js/'));
}
//Watch js function
const watchjs = function () {
  gulp.watch(['./src/**/*.js', '!./src/third-party/../*'], { events: 'all' }, jsfunction)
}

//Если будут самодельные svg-спрайты, лучше ещё раз всё проверить и сделать их
const makeSvgSymbolSprite = require('./makeSvgSymbolSprite')
module.exports.makeSvgSymbolSprite = makeSvgSymbolSprite

//И будем следить за появлением форм в папке для includ-ов спрайта
const watchSvgSpriteShapes = function () {
  gulp.watch('./src/common/includes/svg-sprite-shapes/*.svg', { events: 'all' }, makeSvgSymbolSprite)
}
//Копируем спрайт в dev-build
const copySvgSprite = function(){
  return gulp.src('./src/common/svg-sprite/*')
    .pipe(gulp.dest('./dev-build/img/common/svg-sprite/'));
}
//Следим, не появится ли новый спрайт, чтобы скопировать
const watchSvgSprite = function () {
  gulp.watch('./src/common/svg-sprite/*', { events: 'all' }, copySvgSprite)
}
//Оптимизация картинок
const imagemin = require('gulp-imagemin')
const imgCompress = require('imagemin-jpeg-recompress')
const cache = require('gulp-cache');

const imgfunction = function () {
  return gulp.src(['./src/**/*.svg', './src/**/*.jpg', './src/**/*.png', './src/**/*.gif', '!./src/**/includes/**/*', '!./src/common/svg-sprite/*'])
    .pipe(
      cache(
        imagemin([
          imgCompress({
            loops: 4,
            min: 75,
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
  gulp.watch(['./src/**/*.svg', './src/**/*.jpg', './src/**/*.png', './src/**/*.gif', '!./src/**/includes/**/*'], { events: 'all' }, imgfunction)
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

//Копирование сторонних скриптов
const copythirdpartyfunction = function () {
  return gulp.src('./src/thirdparty/**/*')
    .pipe(gulp.dest('./dev-build/thirdparty/'));
}
//Watch thirdparty
const watchthirdparty = function () {
  gulp.watch('./src/thirdparty/**/*', { events: 'all' }, copythirdpartyfunction)
}
//Очистка папки dev-build перед заданием
const GulpClean = require('gulp-clean')

const devBuildCleanFunction = function () {
  return gulp.src('./dev-build/*', {read: false})
  .pipe(GulpClean())
}
//Final task
const build = gulp.series(devBuildCleanFunction, pugfunction, sassfunction, jsfunction, imgfunction, makeSvgSymbolSprite, copySvgSprite, copyfontsfunction, copythirdpartyfunction)
const watch = gulp.parallel(liveserver, watchpugchanges, watchsasschanges, watchjs, watchimg, watchSvgSpriteShapes, watchSvgSprite, watchfonts, watchthirdparty)

module.exports = gulp.series(build, watch)