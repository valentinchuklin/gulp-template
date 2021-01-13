const gulp = require('gulp')
//Очистка папки build перед заданием
const GulpClean = require('gulp-clean')

const buildsCleanFunction = function () {
  return gulp.src(['./build/*', './dev-build/*'], {read: false})
  .pipe(GulpClean())
}

const cleanBuilds = gulp.series(buildsCleanFunction)
module.exports = gulp.series(cleanBuilds)