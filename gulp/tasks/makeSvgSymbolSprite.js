const gulp = require('gulp');
const gulpSvgSprite = require('gulp-svg-sprite');
const htmlBeautify = require('gulp-html-beautify');

//Спрайт будет создан из svg-файлов в папке ./lab/img-vector/nput/ и помещён в output
const svgSymbolSpriteFunction = function () {
  return gulp.src('./lab/img-vector/input/*.svg')
    .pipe(gulpSvgSprite({mode: {inline: true, symbol: true}}))
    .pipe(htmlBeautify({"indent_size": 2}))
    .pipe(gulp.dest('./lab/img-vector/output/'));
}

const makeSvgSymbolSprite = gulp.series(svgSymbolSpriteFunction);
module.exports = makeSvgSymbolSprite;