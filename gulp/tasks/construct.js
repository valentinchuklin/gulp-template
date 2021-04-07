const gulp = require('gulp');
const rename = require('gulp-rename'); //Переименование

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
const pug = require('gulp-pug');
const htmlBeautify = require('gulp-html-beautify');
const htmlmin = require('gulp-htmlmin');

const pugfunction = function pug2html(cb) {
  var htmlBeautifyOptions = {
    "indent_size": 2
  }
  var htmlminOptions = {
    collapseWhitespace: true,
    includeAutoGeneratedTags: false
  }
  return gulp.src(['./src/**/index.pug'])
    .pipe(pug())
    .pipe(htmlmin(htmlminOptions))
    .pipe(htmlBeautify(htmlBeautifyOptions))
    .pipe(gulp.dest('./dev-build'))
    .pipe(browsersync.stream());
}
//Watch pug function
const watchpugchanges = function () {
  gulp.watch(['src/**/*.pug', '!./src/**/build-script.pug'], { events: 'all' }, pugfunction)
}

//Sass function
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const sortMediaQueries = require('postcss-sort-media-queries');

const sassfunction = function () {
  var processors = [
    autoprefixer(),
    sortMediaQueries({
      sort: 'mobile-first'
    })
  ]
  return gulp.src(['src/**/custom-style.sass'])
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dev-build/'))
    .pipe(browsersync.stream());
}
//Watch sass function
const watchsasschanges = function () {
  gulp.watch(['./src/**/*.sass'], { events: 'all' }, sassfunction)
}

//JS function
//Функция сборщик скриптов страницы из build-script.pug в custom-script.js, если требуется
const buildCustomStyle = function(){
  return gulp.src('./src/**/build-script.pug')
  .pipe(pug())
  .pipe(rename(function(path){
    path.basename = 'custom-script';
    path.extname = '.js'
  }))
  .pipe(gulp.dest('./dev-build/'))
  .pipe(browsersync.stream());
}
//Если скрипт небольшой минуем этап сборки и пишем сразу в custom-script.js
const jsMinFunction = function () {
  return gulp.src(['./src/**/custom-script.js', '!./src/**/includes/**/*', '!./src/third-party/**/*'])
    .pipe(gulp.dest('./dev-build/'))
    .pipe(browsersync.stream());
}
//Создаём серию
const jsfunction = gulp.series(buildCustomStyle, jsMinFunction);
//Watch js function
const watchjs = function () {
  gulp.watch(['./src/**/custom-script.js', './src/**/build-script.pug', '!./src/third-party/../*'], { events: 'all' }, jsfunction)
}
//PHP function
const phpfunction = function () {
  return gulp.src(['./src/**/*.php', '!./src/**/includes/**/*', '!./src/third-party/**/*', '!./lab/**/*'])
    .pipe(gulp.dest('./dev-build/'))
    .pipe(browsersync.stream());
}
//Watch PHP function
const watchphp = function () {
  gulp.watch(['./src/**/*.php', '!./src/third-party/../*'], { events: 'all' }, phpfunction)
}
//Оптимизация картинок
const imagemin = require('gulp-imagemin');
const imgCompress = require('imagemin-jpeg-recompress');
const cache = require('gulp-cache');
const imgMinFunction = function () {
  return gulp.src(['./src/**/*.svg', './src/**/*.jpg', './src/**/*.png', './src/**/*.gif', '!./src/**/includes/**/*'])
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
    .pipe(gulp.dest('dev-build/'))
    .pipe(browsersync.stream());
}
const webp = require('gulp-webp');
const webpFunction = function(input, output) {
  var input = ['src/**/*.png', 'src/**/*.jpg', 'src/**/*.gif', '!src/browser-old/**/*.*'];
  var output = 'dev-build/';
  return gulp.src(input)
    .pipe(webp())
    .pipe(gulp.dest(output));
}
const imgfunction = gulp.series(imgMinFunction, webpFunction);
//Watch img functionwebpFunction
const watchimg = function () {
  gulp.watch(['./src/**/*.svg', './src/**/*.jpg', './src/**/*.png', './src/**/*.gif', '!./src/**/includes/**/*'], { events: 'all' }, imgfunction)
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
  return gulp.src('./src/third-party/**/*')
    .pipe(gulp.dest('./dev-build/third-party/'))
    .pipe(browsersync.stream());
}
//Watch third-party
const watchThirdPartyFunction = function () {
  gulp.watch('./src/third-party/**/*', { events: 'all' }, copyThirdPartyFunction)
}
//Очистка папки dev-build перед заданием
const GulpClean = require('gulp-clean')

const devBuildCleanFunction = function () {
  return gulp.src('./dev-build/*', { read: false })
    .pipe(GulpClean())
}
//Final task
const build = gulp.series(devBuildCleanFunction, pugfunction, sassfunction, jsfunction, phpfunction, imgfunction, copyfontsfunction, copyThirdPartyFunction)
const watch = gulp.parallel(liveserver, watchpugchanges, watchsasschanges, watchjs, watchphp, watchimg, watchfonts, watchThirdPartyFunction)

module.exports = gulp.series(build, watch)