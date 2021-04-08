function Carousel(carouselSelector, options) {

  //ОПЦИИ
  //Задаём изначальные параметры карусели
  this.options = {
    blocksPerView: 1,
    spaceBetween: 20,
    navigation: true,
    breakpoints: null
  }
  //Если объект с параметрами был передан в качестве аргуммента функции, объединяем его с исхрдными параметрами
  if (options) {
    Object.assign(this.options, options)
  }

  //ПЕРЕМЕННЫЕ
  this.carousel = document.querySelector(carouselSelector); //Получаем ссылку на карусель
  this.lenta = this.carousel.children[0]; // Получаем ссылку на список (ленту) внутри
  this.lentaChildrenQuantity = this.lenta.childElementCount; //Узнаём, сколько детишек в ленте (кол-во блоков)
  this.blocks = []; for (let i = 0; i < this.lentaChildrenQuantity; i++) { this.blocks.push(this.lenta.children[i]); } //Создадим массив из ссылок на блоки внутри ленты
  this.currentBreakpoint = 0; //Установим брейкпоинт по усолчанию 0
  this.blocksPerView = this.options.blocksPerView; //Default количество блоков во вьюпорте из options
  this.spaceBetween = this.options.spaceBetween; //Default горизонтальный gap между блоками
  this.setNavigation = this.options.navigation; //Зададим навигацию по умолчанию
  this.blockMinWidth = '100%'; //По умолчанию 1 блок занимает всю ширину контейнера 
  this.animationDuration = '320'; //Скорость анимации прокрутки (в мс)
  this.animationEaseFunction = 'ease-in-out'; //Функция изинга анимации

  //ПОДГОТОВКА КОНТЕЙНЕРОВ КАРУСЕЛИ К РАБОТЕ
  this.carousel.setAttribute('style', 'display: block; overflow: hidden; position: relative; padding: 3px; margin: -3px'); //Установим карусель в relative и спрячем всё, что выходит за границы
  this.lenta.setAttribute('style', 'display: flex; position: relative; flex-wrap: nowrap; justify-content: flex-start; gap: unset; padding: 0; transition: ' + this.animationDuration + 'ms ' + this.animationEaseFunction + ' margin'); //А ленту будем двигать внутри карусели
  this.blocks.forEach((block) => { block.setAttribute('style', 'margin: 0;'); }); //Сбросим все внешние отступы у блоков

  //МЕТОДЫ
  //Создадим метод, который будет узнавать текущий брейкпоинт
  this.setBreakpoint = () => {
    this.viewportWidth = window.innerWidth; //Получаем ширину вьюпорта
    let currentBreakpoint = 0; //Установим изначальный брейкпоинт 0 и попытаемся найти самый большой брейк из опций
    if (this.options.breakpoints) {
      for (breakpoint in this.options.breakpoints) {
        if (parseInt(breakpoint, 10) > currentBreakpoint && parseInt(breakpoint, 10) <= this.viewportWidth) {
          currentBreakpoint = parseInt(breakpoint, 10); //Переписываем текущий брейкпоинт
        }
      }
    }
    this.currentBreakpoint = currentBreakpoint;
  }
  //Попробуем узнаем сколько блоков помещается во вьюпорт
  this.getBlocksPerView = () => {
    let blocksPerView = this.options.blocksPerView; //Установим для начала количество блоков по умолчанию
    //А если брейкпоинт выше нуля, проверим его свойства на предмет количества блоков
    if (this.currentBreakpoint > 0) {
      if (this.options.breakpoints[this.currentBreakpoint].blocksPerView) {
        blocksPerView = this.options.breakpoints[this.currentBreakpoint].blocksPerView;
      } else { //Если свойства не обнаружено, переберём свойства в других брейках
        for (breakpoint in this.options.breakpoints) {
          if (parseInt(breakpoint, 10) < this.currentBreakpoint && this.options.breakpoints[breakpoint].blocksPerView) {
            blocksPerView = this.options.breakpoints[breakpoint].blocksPerView;
          }
        }
      }
    }
    this.blocksPerView = blocksPerView; //И присвоим финальное значение в переменную конструктора
  }
  //Попробуем узнаем расстояние между блоками на текущем брейкпоинте
  this.getSpaceBetween = () => {
    let spaceBetween = this.options.spaceBetween; //Установим gap по умолчанию
    //А если брейкпоинт выше нуля, проверим его свойства на предмет gap-а
    if (this.currentBreakpoint > 0) {
      if (this.options.breakpoints[this.currentBreakpoint].spaceBetween) {
        spaceBetween = this.options.breakpoints[this.currentBreakpoint].spaceBetween;
      } else { //Если свойства не обнаружено, переберём свойства в других брейках
        for (breakpoint in this.options.breakpoints) {
          if (parseInt(breakpoint, 10) < this.currentBreakpoint && this.options.breakpoints[breakpoint].spaceBetween) {
            spaceBetween = this.options.breakpoints[breakpoint].spaceBetween;
          }
        }
      }
    }
    this.spaceBetween = spaceBetween; //И присвоим финальное значение в переменную конструктора
  }
  this.setBlocksPerView = () => { //А теперь присвоим стили блокам на странице, чтобы они разместились в заданном количестве, на заданном расстоянии друг возле друга
    this.blockMinWidth = this.carouselWidth / this.blocksPerView - ((this.spaceBetween * this.blocksPerView - this.spaceBetween) / this.blocksPerView)
    this.blocks.forEach((block) => {
      block.style.minWidth = this.blockMinWidth + 'px';
      block.style.marginRight = this.spaceBetween + 'px';
    })
  }
  this.getNavigation = () => { //Вычисляем, нужна ли навигация в карусели
    let setNavigation = this.options.navigation; //Установим во временную переменную значение навигации с 0 брейкпоинта
    if (this.currentBreakpoint > 0) { //Если текущий брейкпоинт больше нуля
      for (breakpoint in this.options.breakpoints) { //И проверим все брейкпоинты меньше или равные текущему на предмет указаний на навигацию
        if (this.currentBreakpoint >= parseInt(breakpoint, 10)) {
          if (this.options.breakpoints[breakpoint].navigation === true) { //Если на брейкпоинте, явно указано, что есть навигация
            setNavigation = true; //Ставим метку
          } else if (this.options.breakpoints[breakpoint].navigation === false) { //Если явно указано, что навигации нет
            setNavigation = false; //Ставим другую метку
          }
        }
      }
    }
    this.setNavigation = setNavigation; //Результат вычислений запишем в свойство нашего объекта
  }
  this.toggleNavigation = () => { //Сделав выбор
    this.navigationTemplate = '<div class="navigation" id="carouselNavigation"><button class="navigation__prev navigation__prev_background_light" id="carouselPrevButton" title="vorherige Folie"></button><button id="сarouselNextButton" class="navigation__next navigation__next_background_light" title="nächste Folie"></button></div>'; //Создадим шаблон навигации
    if (this.setNavigation === true && !this.navigation) { //Если навигация включена в опциях, но не установлена на странице
      this.carousel.insertAdjacentHTML('beforeend', this.navigationTemplate); //Установим навигацию
      this.navigation = this.carousel.querySelector('#carouselNavigation'); //Получим ссылку на неё
      this.navigationNext = this.navigation.querySelector('#сarouselNextButton'); //И ссыку на вперёд
      this.navigationPrev = this.navigation.querySelector('#carouselPrevButton'); //И ссыку - назад
      this.navigationNext.addEventListener('click', this.moveLentaLeft); //Подключим прослушиватели к кнопкам
      this.navigationPrev.addEventListener('click', this.moveLentaRight); //Подключим прослушиватели к кнопкам
    } else if (this.setNavigation === false && this.navigation) {//Или удалим навигацию
      this.navigation.remove();
      this.navigation = ''; //Удалим ссылку на навигацию тоже (надо проверить, может она сама исчезнет)
      this.navigationNext = '';
      this.navigationPrev = '';
    }
  }
  this.moveLentaLeftNotDebounced = (event) => { //Подвинуть ленту вправо
    event.preventDefault();
    if (this.lentaMarginMax + this.lentaMargin > this.spaceBetween) { //И пока сдвиг не превышает максимально допустимого
      this.lenta.style.marginLeft = (this.lentaMargin - this.step) + 'px'; //Мы можем двигать ленту влево
      this.navigationPossibility();
    }
  }
  this.moveLentaRightNotDebounced = (event) => { //Подвинуть ленту влево
    event.preventDefault();
    if (this.lentaMargin < 0) {
      this.lenta.style.marginLeft = (parseInt(this.lenta.style.marginLeft, 10) + this.step) + 'px';
      this.navigationPossibility();
    }
  }
  this.moveLentaLeft = debounce(this.moveLentaLeftNotDebounced, this.animationDuration / 2, { immediate: true });//Сделаем deboounce
  this.moveLentaRight = debounce(this.moveLentaRightNotDebounced, this.animationDuration / 2, { immediate: true });//Сделаем deboounce
  this.navigationPossibility = () => { //Ну и будем активировать и дезактивировать стрелочки навигации вместе с возможностью прокрутки
    this.lentaMargin = parseInt(this.lenta.style.marginLeft, 10); //Получаем текущий сдвиг ленты
    if (this.lentaChildrenQuantity <= this.blocksPerView) { //Если количество блоков в ленте меньше или равно кол-ву блоков на экран
      if (this.navigation) { //И если включена навигация, то отключаем её
        this.navigation.remove();
        this.navigation = '';
        this.navigationNext = '';
        this.navigationPrev = '';
      }
    } else {
      if (this.lentaMargin >= 0 && this.navigationPrev && !this.navigationPrev.classList.contains('navigation__prev_inactive')) {
        //Иначе, если сдвиг ленты отсутствует, навигация включена, а стрелка влево видна
        this.navigationPrev.classList.add('navigation__prev_inactive'); //Дезактивируем стрелку
      } 
      if (this.lentaMargin < 0 && this.navigationPrev && this.navigationPrev.classList.contains('navigation__prev_inactive')) {
        this.navigationPrev.classList.remove('navigation__prev_inactive'); //Активируем стрелку влево, если есть куда лестать влево
      } 
      if (this.lentaMarginMax + this.lentaMargin < this.spaceBetween && this.navigationNext && !this.navigationNext.classList.contains('navigation__next_inactive')) { 
        //А если достигнуто максимальное смещение, 
        this.navigationNext.classList.add('navigation__next_inactive'); //Дезактивируем стрелку вправо
      } 
      if (this.lentaMarginMax + this.lentaMargin > this.spaceBetween && this.navigationNext && this.navigationNext.classList.contains('navigation__next_inactive')) {
        //Либо, если есть куда листать, включаем стрелку обратно
        this.navigationNext.classList.remove('navigation__next_inactive'); //Дезактивируем стрелку вправо
      }
    } 
  }
  this.addSwipeListener = () => { //Если ширина ленты больше ширины карусели
    if (this.lentaWidth - this.spaceBetween > this.carouselWidth) {
      swipe(this.lenta); //То подключим прослушиватель свайпов и назначим два действия, как у кнопок
      this.lenta.addEventListener('swipe', //Слушаем свайпы и запускаем функции prev и next соответственно
        (event) => {
          if (event.detail.direction == 'left') {
            this.moveLentaLeft(event);
          };
          if (event.detail.direction == 'right') {
            this.moveLentaRight(event);
          };
        },
        { passive: false });
    }
  }
  this.run = () => { //Объединяем все основные методы в один, чтобы повторно их запустить в случае ресайза вьюпорта
    //ДИНАМИЧЕСКИ ОБНОВЛЯЮЩИЕСЯ ПЕРЕМЕННЫЕ...
    this.carouselWidth = parseInt(window.getComputedStyle(this.carousel, null).getPropertyValue('width'), 10); //Узнаём ширину контейнера
    this.setBreakpoint();//Сразу узнаём, какой брейкпоинт сейчас актуальный, если их больше одного
    //МЕТОДЫ...
    this.lenta.style.margin = '0'; //Сбросим отступ у ленты при первом запуске, на случай ресайза вьюпорта
    this.getBlocksPerView(); //Получаем количество блоков
    this.getSpaceBetween(); //Получаем расстояние между блоками
    this.setBlocksPerView(); //Устанавливаем ширину блоков ленты и отступы между ними
    //...ДИНАМИЧЕСКИ ОБНОВЛЯЮЩИЕСЯ ПЕРЕМЕННЫЕ - ПРОДОЛЖЕНИЕ
    this.step = this.spaceBetween + this.blockMinWidth; //Вычисляем размер одного шага прокрутки (1 блок + отступ справа)
    this.lentaWidth = this.step * this.lentaChildrenQuantity; //Получаем ширину ленты
    this.lentaMarginMax = this.lentaWidth - this.carouselWidth - this.spaceBetween; //Получаем максимальный сдвиг
    //..МЕТОДЫ - ПРОДОЛЖЕНИЕ
    this.getNavigation();//Получаем информацию о навигации
    this.toggleNavigation();//Установим или удалим навигацию
    this.addSwipeListener();//Подключим свайп
    this.navigationPossibility();//Прячем неактивные стрелки
  }
  this.onResize = () => { //Создадим функцию для ресайза
    let lastBreakpoint = this.currentBreakpoint; //Получим последний брейкпоинт
    this.setBreakpoint();
    let newCarowselwidth = parseInt(window.getComputedStyle(this.carousel, null).getPropertyValue('width'), 10);
    if (lastBreakpoint != this.currentBreakpoint || newCarowselwidth != this.carouselWidth) { //И если ширина отличается от предыдущей хоть на 20px
      this.run(); //перезапустим карусель
    }
  }

  //ВЫЗОВ МЕТОДОВ
  this.run(); //Запустим карусель
  window.addEventListener('resize', this.onResize); //И подключим прослушиватель на ресайз вьюпорта
}

//ПОДКЛЮЧЕНИЕ ЭКЗЕМПЛЯРА КАРУСЕЛИ НА СТРАНИЦЕ С ПАРАМЕТРАМИ
document.addEventListener('DOMContentLoaded', function () {
  var carousel = new Carousel('#carousel', {
    breakpoints: {
      734: {
        blocksPerView: 2,
        spaceBetween: 28
      },
      1125: {
        blocksPerView: 3,
        spaceBetween: 21
      },
      1480: {
        blocksPerView: 4,
        navigation: false
      }
    }
  });
})