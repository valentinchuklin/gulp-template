const gulp = require('gulp');

const exportComponent = () => {
  let indexOfKey = 0;
  let indexOfSrc = -1;
  process.argv.forEach((el) => {
    if (el == '--from') {
      indexOfSrc = indexOfKey + 1;
    } else {
      indexOfKey++;
    }
  });
  return gulp.src(process.argv[indexOfSrc])
    .pipe(gulp.dest('./lab/export/input/'));
}
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const sortMediaQueries = require('postcss-sort-media-queries');
const processors = [
  autoprefixer(),
  sortMediaQueries({
    sort: 'mobile-first'
  })
];
const sassToOutput = () => {
  return gulp.src('./lab/export/input/**/*.sass')
  .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
  .pipe(postcss(processors))
  .pipe(gulp.dest('./lab/export/output/'))
}
const pug = require('gulp-pug');
const htmlBeautify = require('gulp-html-beautify');
const htmlmin = require('gulp-htmlmin');
const htmlBeautifyOptions = {
  "indent_size": 2
}
const htmlminOptions = {
  collapseWhitespace: true,
  includeAutoGeneratedTags: false
}
const posthtml = require('gulp-posthtml')
const posthtmlWebpWidthSizes = require('../posthtml/posthtmlWebpWidthSizes');
const pugToOutPut = (cb) => {
  return gulp.src('./lab/export/input/**/*.pug')
    .pipe(pug())
    .pipe(posthtml([posthtmlWebpWidthSizes()]))
    .pipe(htmlmin(htmlminOptions))
    .pipe(htmlBeautify(htmlBeautifyOptions))
    .pipe(gulp.dest('./lab/export/output/'))
}
const copyAssets = (cb) => {
  return gulp.src(['./lab/export/input/**/*.*', '!./lab/export/input/**/*.sass', '!./lab/export/input/**/*.pug'])
    .pipe(gulp.dest('./lab/export/output/'))
}
module.exports = gulp.series(exportComponent, sassToOutput, pugToOutPut, copyAssets);