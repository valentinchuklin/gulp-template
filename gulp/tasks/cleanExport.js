const gulp = require('gulp')
//Очистка папки ./lab/export/
const gulpClean = require('gulp-clean')

const cleanExport = () => {
  return gulp.src(['./lab/export/output/**', './lab/export/input/**'], {read: false})
  .pipe(gulpClean())
}
module.exports = cleanExport;