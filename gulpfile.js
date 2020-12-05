const gulp = require('gulp')
const pug2html = require('./gulp/tasks/pug2html')
const img = require('./gulp/tasks/img')
const sass = require('./gulp/tasks/sass')
const javascript = require('./gulp/tasks/javascript')
const construction = require('./gulp/tasks/construction')
const build = require('./gulp/tasks/build')

//Комплексная задача разработки на лету (Праллельно: Live-server, преобразование pug в html, sass в css, оптимизация img и т.д.)
module.exports.construction = construction

//Финальная сборка в build
module.exports.build = build

//Преобразовать src/pages/*.pug в build/*.html
module.exports.pug2html = pug2html
//Преобразование src/css/*.sass в build/css/*.css
module.exports.sass = sass
//Оптимизировать js для build-а
module.exports.javascript = javascript
//Оптимизировать изображения в src/img и перенести в build/img
module.exports.img = img