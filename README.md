# gulp-template
Базовый шаблон проекта на стеке Node.js + Gulp + Pug + Sass + some plugins 
(планирование и автоматизация, шаблонизация, препроцессинг HTML, CSS, минимизация JS-кода, сжатие изображений - для вёрски сайтов с учётом масштабируемости)

Установка
Для инициализации проекта необходимо скопировать репозиторий, установить node.js и вполнить в коммандной строке внутри каталога команду: npm i
После этого можно добавлять, изменять блоки на разных уровнях переопределения с помощью проводника и редактора кода вроде VS Code и использовать для сборки и проверки проекта одну из задач, описанных ниже.

Структура катологов:
Проект имеет три основных каталога: src, build, dev-build
В каталоге src располагаются исходные файлы проекта в формате pug, sass, js, svg, png, jpg, gif
В каталоге dev-build (опционально) - находятся фалы собранного проекта, образованные через задачу gulp construction, удобные для чтения
В каталоге build (опционально) - находятся сжатые файлы собранного проекта, образованные через задачу gulp build

Задачи:
Задача gulp construction предназначена для активной вёрстки и автоматической сборки проекта на лету при запущенном Live-сервере.
(Все препроцессоры и Live-сервер отслеживают изменения в src папке, динамически обновляют и отображают сборку в dev-build каталоге)
Задача gulp build предназначена для сжатой финальной сборки проекта в папке build
Помимо этого есть ряд промежуточных задач gulp, перечисленных в конфигурационном фалйе gulp.js

Функциональная структура катологов:
Проект построен по принципу БЭМ + Sass
Файловая структура построена по принципу БЭМ, но без дополнительных катологов для элементов и модификаторов блоков с целью упрощения дерева файловой системы.
При этом, следуя принципам БЭМ отсутствует деление на технологии реализации блоков. Файлы sass, js, изображения и т.д. находятся внутри папок блоков.
Адаптивные медиа-запросы не вынесены в отдельные бандлы на уровне переопределения, а находятся в sass файлах блоков с целью обеспечения удобства доступа для разработчиков.
Переопределение изначально осуществляется на уровне общего (common) уровня и уровня разных страниц из папки pages.

В текущей реализации сборочные файлы находятся в корневом каталоге src, при этом при сборке игнорируется файл common.pug, отвечающий за общую базовую структуру html.

Таким образом на выходе, в зависимости от задачи, получается финальная (build) или (dev-build) сборка проекта с html страницами в корне build или dev-build, стилями в подкаталоге css, изображениями в каталоге img, имеющим вложенную структуру, наследемую от структуры блоков, начиная из корня src, и папку js с файлами, наследующими файловую структуру по такому же принципу, что и изображения.


