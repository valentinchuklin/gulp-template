const gulp = require('gulp');
const rename = require('gulp-rename'); //Переименование
const replace = require('gulp-replace'); //Замена

// Live server
const browsersync = require('browser-sync');
const liveserver = function bsync() {
  browsersync.init({
    watch: true,
    server: {
      baseDir: "./dev-build/",
    }
  })
}

//Pug2html
const fileinclude = require('gulp-file-include');
const htmlBeautify = require('gulp-html-beautify');
const htmlmin = require('gulp-htmlmin');
const posthtml = require('gulp-posthtml')
const posthtmlWebpWidthSizes = require('../posthtml/posthtmlWebpWidthSizes');
const htmlminOptions = {
  collapseWhitespace: true,
  includeAutoGeneratedTags: false
}
const htmlBeautifyOptions = {
  "indent_size": 2
}
var cacheTimeStamp = new Date().getTime();

const htmlfunction = function (cb) {
  return gulp.src(['./src/**/index.html', '!./src/components/**', '!./src/third-party/**'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(posthtml([posthtmlWebpWidthSizes()]))
    .pipe(replace('style.css', 'style.css?t=' + cacheTimeStamp))
    .pipe(replace('script.js', 'script.js?t=' + cacheTimeStamp))
    .pipe(htmlmin(htmlminOptions))
    .pipe(htmlBeautify(htmlBeautifyOptions))
    .pipe(gulp.dest('./dev-build'))
    .pipe(browsersync.stream());
}
//Watch html function
const watchhtmlchanges = function () {
  gulp.watch(['src/**/*.html', '!./src/components/**', '!./src/third-party/**'], { events: 'all' }, htmlfunction)
}

//CSS function
const sass = require('gulp-sass')
sass.compiler = require('node-sass')
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const sortMediaQueries = require('postcss-sort-media-queries');
const processors = [
  autoprefixer(),
  sortMediaQueries({
    sort: 'mobile-first'
  })
]

const cssfunction = function () {
  return gulp.src(['./src/**/style.sass', '!./src/components/**', '!./src/third-party/**'])
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dev-build/'))
    .pipe(browsersync.stream());
}
//Watch sass function
const watchsasschanges = function () {
  gulp.watch(['./src/**/*.css', '!./src/components/**', '!./src/third-party/**'], { events: 'all' }, cssfunction)
}

//JS function
//Функция сборщик скриптов страницы из build-script.pug в script.js, если требуется
const buildCustomStyle = function () {
  return gulp.src(['./src/**/build-script.js', '!./src/components/**', '!./src/third-party/**'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(rename(function (path) {
      path.basename = 'script';
      path.extname = '.js'
    }))
    .pipe(gulp.dest('./dev-build/'))
    .pipe(browsersync.stream());
}
//Если скрипт небольшой минуем этап сборки и пишем сразу в script.js
const jsMinFunction = function () {
  return gulp.src(['./src/**/script.js', '!./src/components/**', '!./src/third-party/**'])
    .pipe(gulp.dest('./dev-build/'))
    .pipe(browsersync.stream());
}
//Создаём серию
const jsfunction = gulp.series(buildCustomStyle, jsMinFunction);
//Watch js function
const watchjs = function () {
  gulp.watch(['./src/**/*.js', '!./src/components/**', '!./src/components/**', '!./src/third-party/**'], { events: 'all' }, jsfunction)
}
//PHP function
const phpfunction = function () {
  return gulp.src(['./src/**/*.php', '!./src/components/**', '!./src/third-party/**'])
    .pipe(gulp.dest('./dev-build/'))
    .pipe(browsersync.stream());
}
//Watch PHP function
const watchphp = function () {
  gulp.watch(['./src/**/*.php', '!./src/components/**', '!./src/third-party/**'], { events: 'all' }, phpfunction)
}
//Оптимизация картинок
const imagemin = require('gulp-imagemin');
const imgCompress = require('imagemin-jpeg-recompress');
const cache = require('gulp-cache');
const imgMinFunction = function () {
  return gulp.src(['./src/**/*.svg', './src/**/*.jpg', './src/**/*.png', './src/**/*.gif', '!./src/components/**', '!./src/third-party/**'])
    .pipe(
      cache(
        imagemin([
          imgCompress({
            loops: 4,
            min: 70,
            max: 75,
            quality: 'high'
          }),
          imagemin.gifsicle(),
          imagemin.optipng(),
          imagemin.svgo()
        ])
      )
    )
    .pipe(gulp.dest('dev-build/'))
    .pipe(browsersync.stream());
}
const webp = require('gulp-webp');
const webpFunction = function (input, output) {
  return gulp.src(['src/**/*.png', 'src/**/*.jpg', 'src/**/*.gif', '!./src/components/**', '!./src/third-party/**'])
    .pipe(webp())
    .pipe(gulp.dest('dev-build/'));
}
const imgfunction = gulp.series(imgMinFunction, webpFunction);
//Watch img functionwebpFunction
const watchimg = function () {
  gulp.watch(['./src/**/*.svg', './src/**/*.jpg', './src/**/*.png', './src/**/*.gif', '!./src/components/**', '!./src/third-party/**'], { events: 'all' }, imgfunction)
}

//Копирование шрифтов
const copyfontsfunction = function () {
  return gulp.src('./src/common/fonts/*.woff*')
    .pipe(gulp.dest('./dev-build/common/fonts/'))
    .pipe(browsersync.stream());
}
//Watch fonts
const watchfonts = function () {
  gulp.watch('./src/common/fonts/*.woff*', { events: 'all' }, copyfontsfunction)
}

//Копирование сторонних скриптов
const copyThirdPartyFunction = function () {
  return gulp.src('./src/third-party/**')
    .pipe(gulp.dest('./dev-build/third-party/'))
    .pipe(browsersync.stream());
}
//Watch third-party
const watchThirdPartyFunction = function () {
  gulp.watch('./src/third-party/**', { events: 'all' }, copyThirdPartyFunction)
}
//Очистка папки dev-build перед заданием
const gulpClean = require('gulp-clean')

const devBuildCleanFunction = function () {
  return gulp.src('./dev-build/*', { read: false })
    .pipe(gulpClean())
}
//Final task
const build = gulp.series(devBuildCleanFunction, htmlfunction, cssfunction, jsfunction, phpfunction, imgfunction, copyfontsfunction, copyThirdPartyFunction)
const watch = gulp.parallel(liveserver, watchhtmlchanges, watchsasschanges, watchjs, watchphp, watchimg, watchfonts, watchThirdPartyFunction)

module.exports = gulp.series(build, watch)