const gulp = require('gulp')
//Очистка папки build перед заданием
const gulpClean = require('gulp-clean')

const buildsCleanFunction = function () {
  return gulp.src(['./build/*', './dev-build/*'], {read: false})
  .pipe(gulpClean())
}

const cleanBuilds = gulp.series(buildsCleanFunction)
module.exports = gulp.series(cleanBuilds)