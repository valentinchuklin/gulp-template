const gulp = require('gulp')

//Сначала очищаем папку svg-sprite от старых спрайтов
const gulpClean = require('gulp-clean')

const cleanSpritesFunction = function () {
  return gulp.src(['./src/common/svg-sprite/*'], { read: false })
    .pipe(gulpClean())
}
//Очистим папку includes от спрайтов, чтобы случайно не скопировать в проект устаревший спрайт

const cleanSpritesIncludesFunction = function () {
  return gulp.src(['./src/common/includes/svg-sprite-shapes/symbol/svg/*'], { read: false })
    .pipe(gulpClean())
}

//Затем создаёмм спрайт из файлов папки src/common/includes/svg-sprite-shapes
const gulpSvgSprite = require('gulp-svg-sprite')

//Зададим настройки спрайту
const gulpSvgSpriteConfig = {
  mode: {
    inline: true, // Prepare for inline embedding
    symbol: true, // Create a «symbol» sprite
  }
}
//Сделаем спрайты хорошо читаемыми согласно стайлкоду
const htmlBeautify = require('gulp-html-beautify')
const htmlBeautifyOptions = {
  "indent_size": 2
}


const svgSymbolSpriteFunction = function () {
  return gulp.src('./src/common/includes/svg-sprite-shapes/*.svg')
    .pipe(gulpSvgSprite(gulpSvgSpriteConfig))
    .pipe(htmlBeautify(htmlBeautifyOptions))
    .pipe(gulp.dest('./src/common/includes/svg-sprite-shapes/'));
}

//Копируем готовый спрайт в папку, из который gulp его подхватит для использования в проекте в build и dev-build, так как gulp игнорирует папку includes
const copySvgSymbolSpriteForUseFunction = function () {
  return gulp.src('./src/common/includes/svg-sprite-shapes/symbol/svg/*')
    .pipe(gulp.dest('./src/common/svg-sprite/'));
}

const makeSvgSymbolSprite = gulp.series(cleanSpritesFunction, cleanSpritesIncludesFunction, svgSymbolSpriteFunction, copySvgSymbolSpriteForUseFunction, cleanSpritesIncludesFunction)
module.exports = gulp.series(makeSvgSymbolSprite)