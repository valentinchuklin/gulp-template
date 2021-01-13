const gulp = require('gulp')

//SvgSymbolSpriteFunction
const gulpSvgSprite = require('gulp-svg-sprite')
const htmlBeautify = require('gulp-html-beautify')

const gulpSvgSpriteConfig = {
  mode: {
      inline: true, // Prepare for inline embedding
      symbol: true, // Create a «symbol» sprite
  }
}

const htmlBeautifyOptions = {
  "indent_size": 2
}

const svgSymbolSpriteFunction = function () {
  return gulp.src('./src/common/includes/svg-sprite-shapes/*.svg')
    .pipe(gulpSvgSprite(gulpSvgSpriteConfig))
    .pipe(htmlBeautify(htmlBeautifyOptions))
    .pipe(gulp.dest('./src/common/includes/svg-sprite-shapes/'));
}

const makeSvgSymbolSprite = gulp.series(svgSymbolSpriteFunction)
module.exports = gulp.series(makeSvgSymbolSprite)