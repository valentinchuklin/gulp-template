//ВЁРСТКА
const construct = require('./gulp/tasks/construct');
const build = require('./gulp/tasks/build');
const cleanBuilds = require('./gulp/tasks/cleanBuilds');

//Комплексная задача разработки на лету DEV-BUILD (Праллельно: Live-server, преобразование pug в html, sass в css, оптимизация img и т.д.)
module.exports.construct = construct;
//Финальная сборка в BUILD
module.exports.build = build;
//Очистка директорий build и dev-build
module.exports.cleanBuilds = cleanBuilds;

//ЛАБОРАТОРИЯ
const makeSvgSymbolSprite = require('./gulp/tasks/makeSvgSymbolSprite');
const convertToWebp = require('./gulp/tasks/convertToWebp');
const exportComponent = require('./gulp/tasks/exportComponent');
const cleanExport = require('./gulp/tasks/cleanExport');

//Конвертировать в webp в лаборатории
module.exports.convertToWebp = convertToWebp;
//Создание SVG symbol спрайтов
module.exports.makeSvgSymbolSprite = makeSvgSymbolSprite;
//Экспорт и компиляция модулей
module.exports.exportComponent = exportComponent;
//Очистка экспорта
module.exports.cleanExport = cleanExport;