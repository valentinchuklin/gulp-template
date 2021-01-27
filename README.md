# gulp-template

Базовый шаблон для сборки и тестирования Web-вёрстки на стеке Node.js + Gulp + Pug + Sass по технологии **mobile&#8209;first**.

В шаблон включены: автоматизация, шаблонизация, препроцессинг HTML, CSS, постпроцессинг, сжатие изображений для вёрски сайтов с учётом масштабируемости проектов.

## Структура проекта

Оснавная структура состоит из трёх папок:

1. `src` - исходный код на PUG, SASS др.;
2. `dev-build` - рабочий код сборки HTML, CSS, JS;
3. `build` - финальная сборка в HTML, CSS и JS с автопрефиксами.

Таким обраозом, финальная сборка попадёт в папку `build`.

**Служебные файлы**

Чтобы выполнить сборку проекта понадобится node.js и конфигурационные файлы из корневого каталога проекта и папки gulp/tasks

Если node.js установлен, зависимости, необходимые для работы с исходными фалйами, устанавливаются с помощью вызова `npm i` в корневом каталоге, в консоли.

**Задачи:**

- `gulp construction`,
- `gulp build`

нужны для отслеживания изменений в `dev-build` и для финальной сборки проекта в `build` соответственно.

Проект построен по принципу БЭМ + Sass. Файловая структура построена по принципу БЭМ, но без дополнительных катологов для элементов и модификаторов блоков с целью упрощения дерева файловой системы. Cледуя принципам БЭМ, отсутствует деление на технологии реализации блоков. Файлы sass, js, изображения и т.д. находятся внутри папок блоков, а адаптивные медиа-запросы не вынесены в отдельные бандлы на уровне переопределения, а находятся в sass файлах блоков с целью обеспечения удобства доступа для разработчиков. Переопределение изначально осуществляется на уровне общего (common) уровня и уровня разных страниц из папки `pages`.

**Структура каталога `src`:**

- повторяет структуру сайта в подкаталоге `pages` по технологии БЭМ,
- содержит общие стили в папке `common`,
- в папке `thirdparty` содержит файлы сторонних разработчиков,
- а сам `src` содержит сборочные файлы общих стилей, структуру и стилей отдельных html страниц.

В текущей реализации сборочные файлы страниц и их стилей находятся в корневом каталоге `src`. При сборке игнорируется на выходе сам по себе файл `common.pug`, отвечающий за общую базовую структуру html. Он участвует только в сборке конкретных страниц, являясь шабоном.
Внутри каталогов `includes` находятся фрагменты кода и файлы, которые не экспортируются в `build` и `dev-build` напрямую, но подключаются к структуре и стилям родительских документов, либо используются для преобразования в другие форматы.

**Подзадачи:**

В проекте используется масса подзадач, среди которых можно отметить:


- Сжатие изображений;
  - Все изображения в `src` кроме папок `includes` Автоматически обрабатываются `gulp construction` и `gulp build` и попадут в папку `img` в сжатом виде в подкаталог, соответствующий положений в файловой системе относительно `src`.


  
- Создание svg-спрайтов;
  - Опционально, поместив в папку `src/common/includes/svg-sprite-shapes` svg-файлы, с помощью задач `gulp build`, `gulp construction` и `gulp makeSvgSymbolSprite` можно получить svg-спрайт на основе тегов symbol.
  - Готовый спрайт появится в папке `./src/common/svg-sprite/`, откуда переместится в соответствующую типу сборки папку + `img/commmon/svg-sprite/`.


- Помимо того в проекте используется browsersync сервер, для динамического отображения изменений в сборках на разных устройствах, раличные улучшения финального кодстайла, автопрефиксеры, и что важно отметить **сортировка медиазапросов стилей по технологии mobile-first**.


Всё это можно настроить и изменить в соответствующих конфигурационных файлах задач, снабжённых достаточно подробными комментариями.