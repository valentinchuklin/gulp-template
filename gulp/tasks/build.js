const gulp = require('gulp');
const GulpClean = require('gulp-clean'); //Очистка
const replace = require('gulp-replace'); //Замена

//Очистка папки build перед заданием
const buildCleanFunction = function () {
  return gulp.src('./build/*', { read: false })
    .pipe(GulpClean());
}

//Pug2html
const pug = require('gulp-pug');
const htmlmin = require('gulp-htmlmin');
const pugfunction = function pug2html(cb) {
  var htmlminOptions = {
    collapseWhitespace: true,
    includeAutoGeneratedTags: false,
    removeComments: true,
    collapseBooleanAttributes: true,
    preserveLineBreaks: true
  }
  var cacheTimeStamp = new Date().getTime();
  return gulp.src(['./src/**/index.pug'])
    .pipe(pug())
    .pipe(replace('custom-style.css', 'custom-style-min.css?t=' + cacheTimeStamp))
    .pipe(replace('custom-script.js', 'custom-script-min.js?t=' + cacheTimeStamp))
    .pipe(htmlmin(htmlminOptions))
    .pipe(gulp.dest('./build/'));
}
//Sass function
const sass = require('gulp-sass')
sass.compiler = require('node-sass')
const autoprefixer = require('autoprefixer')
const postcss = require('gulp-postcss')
const sortMediaQueries = require('postcss-sort-media-queries')
const cssmin = require('gulp-cssmin')
const rename = require('gulp-rename')

const sassfunction = function () {
  var processors = [
    autoprefixer(),
    sortMediaQueries({
      sort: 'mobile-first'
    })
  ]
  return gulp.src('src/**/custom-style.sass')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(cssmin())
    .pipe(rename(function(path){path.basename += "-min"}))
    .pipe(gulp.dest('./build/'));
}

//JS function
const minify = require('gulp-minify');
//Минифицируем JS
const jsMinFunction = function () {
  return gulp.src(['./src/**/custom-script.js', '!./src/**/includes/**/*', '!./src/third-party/**/*'])
    .pipe(minify())
    .pipe(gulp.dest('./build/'));
}
//Удаляем жирный JS
const cleanJsFunction = function() {
  return gulp.src('./build/**/custom-script.js', { read: false })
    .pipe(GulpClean());
}
//Создаём серию
const jsfunction = gulp.series(jsMinFunction, cleanJsFunction);

//PHP function
const phpfunction = function () {
  return gulp.src(['./src/**/*.php', '!./src/**/includes/**/*', '!./src/third-party/**/*'])
    .pipe(gulp.dest('./build/'));
}
//Оптимизация и копирование картинок
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
    .pipe(gulp.dest('build/'));
}
const webp = require('gulp-webp');
const webpFunction = function(input, output) {
  var input = ['src/**/*.png', 'src/**/*.jpg', 'src/**/*.gif', '!src/browser-old/**/*.*'];
  var output = 'build/';
  return gulp.src(input)
    .pipe(webp())
    .pipe(gulp.dest(output));
}
const imgfunction = gulp.series(imgMinFunction, webpFunction);
//Копирование шрифтов
const copyfontsfunction = function () {
  return gulp.src('./src/common/fonts/*.woff*')
    .pipe(gulp.dest('./build/common/fonts/'));
}
//Копирование сторонних скриптов
const copyThirdPartyFunction = function () {
  return gulp.src('./src/third-party/**/*')
    .pipe(gulp.dest('./build/third-party/'));
}

//Live server - проверим результат в браузере
const browsersync = require('browser-sync')
const liveserver = function bsync() {
  browsersync.init({
    watch: true,
    server: {
      baseDir: "./build/",
    }
  })
}

//Final task
const build = gulp.series(buildCleanFunction, pugfunction, sassfunction, jsfunction, phpfunction, imgfunction, copyfontsfunction, copyThirdPartyFunction, liveserver)

module.exports = gulp.series(build)