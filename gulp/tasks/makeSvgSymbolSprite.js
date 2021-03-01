const gulp = require('gulp');
const gulpSvgSprite = require('gulp-svg-sprite');
const htmlBeautify = require('gulp-html-beautify');

//Спрайт будет создан из svg-файлов в папке ./src/lab/svg-sprite/input/ и помещён в output
const svgSymbolSpriteFunction = function () {
  return gulp.src('./src/lab/svg-sprite/input/*.svg')
    .pipe(gulpSvgSprite({mode: {inline: true, symbol: true}}))
    .pipe(htmlBeautify({"indent_size": 2}))
    .pipe(gulp.dest('./src/lab/svg-sprite/output/'));
}

const makeSvgSymbolSprite = gulp.series(svgSymbolSpriteFunction)
module.exports = gulp.series(makeSvgSymbolSprite)