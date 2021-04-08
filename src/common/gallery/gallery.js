//Функция-конструктор вызывается в самом низу и принимает в качестве аргумента только
//селектор (Id) галереи. Если объектов множество, лучше назначить им каждому id и вызвать функцию конструктор с id каждого объекта
//можно листать фотографии

function Gallery(gallerySelector) {

  //ОБЩЕЕ

  //ОБЩИЕ ПЕРЕМЕННЫЕ
  this.body = document.querySelector('.body'); //Ссылка на body
  this.gallery = this.body.querySelector(gallerySelector); //Ссылка на галерею
  this.galleryList = this.gallery.querySelector('.gallery__list'); //Ссылка на список (обёртку) слайдов
  this.slider = this.gallery.querySelector('.gallery__slider'); //Если есть блок .gallery__slider, то будут подключены методы для слайдера
  this.isStrippedSlider = this.gallery.classList.contains('gallery_stripped'); //Првоеряем, не обрезанный ли у нас слайдер
  this.slides = this.galleryList.querySelectorAll('.gallery__slide'); //Стопка слайдов
  this.slidesLength = this.slides.length; //Количество слайдов в стопке
  this.currentSlidePosition = 0; //Порядковый номер слайда в стопке c нуля
  this.currentSlide = this.slides[this.currentSlidePosition]; //Ссылка на выбранный слайд
  this.animationDuration = 160; //Исходная скорость анимации перелистывания слайдов, появления, исчезновения модального окна и т.д. (может меняться от случая к случаю)

  //ОБЩИЕ МЕТОДЫ
  //Метод захвата фокуса (в качестве параметра принимает аргумент со ссылкой на модальное окно)
  this.capture = (area) => {
    if (focusManager) {
      focusManager.capture(area);
    }
  }
  //Метод возвращения фокуса ко всему дкоументу (в качестве параметра принимает аргумент со ссылкой на модальное окно)
  this.release = (area) => {
    if (focusManager) {
      focusManager.release(area);
    }
  }
  //Метод нумерации слайдов с помощью data-slide-id
  this.toNumberSlides = (slides) => {
    let index = 0;
    slides.forEach((slide) => {
      slide.dataset.slideId = index;
      index++;
    })
  }
  //Метод - следующий слайд без debounce, но мы будем применять метод - ниже, под ним
  this.nextSlideNotDebounced = (event) => {
    event.preventDefault();
    if (this.currentSlidePosition < this.slidesLength - 1) {
      this.currentSlidePosition++;
      this.currentSlide = this.slides[this.currentSlidePosition];
      if (this.modal) {
        this.drawModalFigure();
        this.pictureInModal.style.animation = 'slide-left-out ' + this.animationDuration + 'ms linear';
        setTimeout(() => {
          this.pictureInModal.style.animation = 'slide-left ' + this.animationDuration + 'ms linear';
        }, this.animationDuration - (this.animationDuration / 2));
        setTimeout(() => {
          this.pictureInModal.style = '';
        }, this.animationDuration * 2);
        this.modalNavigationPossibility();
      }
      if (this.slider) {
        this.drawSlide();
        this.sliderPicture.style.animation = 'slide-left-out ' + this.animationDuration + 'ms linear';
        setTimeout(() => {
          this.sliderPicture.style.animation = 'slide-left ' + this.animationDuration + 'ms linear';
        }, this.animationDuration - (this.animationDuration / 2));
        setTimeout(() => {
          this.sliderPicture.style = '';
        }, this.animationDuration * 2)
        this.sliderNavigationPossibility();
      }
    }
  }
  //Метод следующий слайд с debounce
  this.nextSlide = debounce(this.nextSlideNotDebounced, this.animationDuration * 2, { immediate: true });
  //Метод - предыдущий слайд без debounce
  this.prevSlideNotDebounced = (event) => {
    event.preventDefault();
    if (this.currentSlidePosition > 0) {
      this.currentSlidePosition--;
      this.currentSlide = this.slides[this.currentSlidePosition];
      if (this.modal) {
        this.drawModalFigure();
        this.pictureInModal.style.animation = 'slide-right-out ' + this.animationDuration + 'ms linear';
        setTimeout(() => {
          this.pictureInModal.style.animation = 'slide-right ' + this.animationDuration + 'ms linear';
        }, this.animationDuration - (this.animationDuration / 2));
        setTimeout(() => {
          this.pictureInModal.style = '';
        }, this.animationDuration * 2)
        this.modalNavigationPossibility();
      }
      if (this.slider) {
        this.drawSlide();
        this.sliderPicture.style.animation = 'slide-right-out ' + this.animationDuration + 'ms linear';
        setTimeout(() => {
          this.sliderPicture.style.animation = 'slide-right ' + this.animationDuration + 'ms linear';
        }, this.animationDuration - (this.animationDuration / 2));
        setTimeout(() => {
          this.sliderPicture.style = '';
        }, this.animationDuration * 2)
        this.sliderNavigationPossibility();
      }
    }
  }
  //Создадим debounce этих методов, чтобы анимация не прерывалась при частых кликах
  this.prevSlide = debounce(this.prevSlideNotDebounced, this.animationDuration * 2, { immediate: true });

  //ВЫЗОВ ОБЩИХ МЕТОДОВ
  this.toNumberSlides(this.slides); //Пронумеруем слайды

  //СЛАЙДЕР
  if (this.slider) { //Если есть слайдер, то по ссылке из списка она откроется в слейдере, а из слайдера её можно открыть на полный экран
    //HTML Слайдера
    this.sliderTemplate = '<div class="navigation"><button title="vorherige Folie" id="gallerySliderPrevButton" class="navigation__prev navigation__prev_background_light"></button><button title="nächste Folie" id="gallerySliderNextButton" class="navigation__next navigation__next_background_light"></button></div><picture class="picture gallery__slide-picture"><source type="image/webp" sizes="(min-width:1024px) 465px, 345px"></source><img class="gallery__slide-img" sizes="(min-width:1024px) 465px, 345px"></img></picture>'
    //Вставляем код слайдера в галерею
    this.slider.insertAdjacentHTML('beforeend', this.sliderTemplate);
    //ПЕРЕМЕННЫЕ СЛАЙДЕРА
    this.sliderPicture = this.slider.querySelector('picture'); //Ссылка на picture
    this.sliderImg = this.slider.querySelector('img'); //Ссылка на img
    this.sliderSource = this.sliderPicture.querySelector('source'); //Ссылка на source в picture
    //МЕТОДЫ СЛАЙДЕРА
    //Метод отображения стрелок навигации в слайдере
    this.sliderNavigationPossibility = () => {
      this.sliderNextButton = this.slider.querySelector('#gallerySliderNextButton');
      this.sliderPrevButton = this.slider.querySelector('#gallerySliderPrevButton');
      if (this.slidesLength == 1) {
        this.sliderNextButton.style.display = 'none'
        this.sliderPrevButton.style.display = 'none'
      }
      if (this.currentSlidePosition == 0 && !this.sliderPrevButton.classList.contains('navigation__prev_inactive')) {
        this.sliderPrevButton.classList.add('navigation__prev_inactive');
        setTimeout(() => {
          this.sliderPrevButton.style.display = 'none';
        }, this.animationDuration)
      } else if (this.currentSlidePosition > 0 && this.sliderPrevButton.classList.contains('navigation__prev_inactive')) {
        this.sliderPrevButton.style.display = 'block';
        this.sliderPrevButton.classList.remove('navigation__prev_inactive');
      }
      if (this.currentSlidePosition == this.slidesLength - 1 && !this.sliderNextButton.classList.contains('navigation__next_inactive')) {
        this.sliderNextButton.classList.add('navigation__next_inactive');
        setTimeout(() => {
          this.sliderNextButton.style.display = 'none';
        }, this.animationDuration)
      } else if (this.currentSlidePosition < this.slidesLength - 1 && this.sliderNextButton.classList.contains('navigation__next_inactive')) {
        this.sliderNextButton.style.display = 'block';
        this.sliderNextButton.classList.remove('navigation__next_inactive');
      }
    }
    //Отрисовка слайда и подсветка активного слайда в превью снизу да и ещё кача всега
    this.drawSlide = () => {
      let href = this.currentSlide.getAttribute('href');
      let img = this.currentSlide.querySelector('img');
      let id = this.currentSlide.dataset.slideId;
      let src = img.getAttribute('src');
      let srcset = img.getAttribute('srcset');
      let webpSrcset = this.currentSlide.querySelector('source').getAttribute('srcset');
      let alt = img.getAttribute('alt');
      if (id) {
        this.slider.dataset.dlideId = id;
        this.currentSlidePosition = id;
      }
      if (alt) {
        this.sliderImg.setAttribute('alt', alt);
      }
      if (webpSrcset) {
        this.sliderSource.setAttribute('srcset', webpSrcset);
      }
      if (href || src) {
        if (href.length > 5) { this.sliderImg.setAttribute('src', href); }
        else if (src) { this.sliderImg.setAttribute('src', src); }
      }
      if (srcset) { this.sliderImg.setAttribute('srcset', srcset); }
      this.slides.forEach((el) => {
        el.classList.remove('gallery__slide_active');
      })
      this.currentSlide.classList.add('gallery__slide_active');
      this.sliderNavigationPossibility();
    }
    //ЗАПУСК МЕТОДОВ СЛАЙДЕРА
    this.drawSlide(); //Отрисовать содержимое слайдера
    this.slider.addEventListener('click', (event) => { //Добавить прослушиватель к кнопкам слайдера
      if (event.target.closest('#gallerySliderNextButton')) {
        this.nextSlide(event);
      } else if (event.target.closest('#gallerySliderPrevButton')) {
        this.prevSlide(event);
      } else {
        this.showModal(event);
      }
    });
    swipe(this.slider); //Подключаем свайпы к слайдеру
    this.slider.addEventListener('swipe', //Слушаем свайпы и запускаем функции prev и next соответственно
      (event) => {
        if (event.detail.direction == 'left') {
          this.nextSlide(event);
        };
        if (event.detail.direction == 'right') {
          this.prevSlide(event);
        };
      },
      { passive: false });
    this.galleryList.addEventListener('click', (event) => { //Добавляем прослушиватели на ссылки в списке слайдов, чтобы переключать слайды в слайдере
      if (event.target.closest('a')) {
        event.preventDefault();
        this.currentSlide = event.target.closest('a');
        this.sliderPicture.style.animation = 'slide-up ' + this.animationDuration + 'ms linear';
        setTimeout(() => {
          this.sliderPicture.style = '';
        }, this.animationDuration);
        this.drawSlide(event);
      }
    });
  }

  //ПЕРЕМЕННЫЕ МОДАЛЬНОГО ОКНА
  this.modal = null; //Ссылка, на модальное окно
  this.pictureInModal = ''; //Ссылка на контейнер изображения в модальном окне
  this.sourseOfPictureInModal = ''; //Ссылка на тег source в picture модального окна
  //HTML модального окна
  this.modalTemplate = '<div id="galleryModal" class="gallery__modal"><button title="Modal schließen" id="galleryCloseButton" class="close-button close-button_background_light gallery__close-button"></button><div class="navigation" id="galleryModalNavigation"><button id="galleryPrevButton" class="navigation__prev" title="vorherige Folie"></button><button title="nächste Folie" id="galleryNextButton" class="navigation__next"></button></div><picture class="picture gallery__modal-picture"><source type="image/webp" sizes="calc(100vw - 16px)"></source><img class="gallery__modal-img" sizes="calc(100vw - 16px)"></img></picture><div id="#galleryModalCaption" class="gallery__popcaption"></div></div>';

  //МОДАЛЬНОЕ ОКНО
  //МЕТОДЫ МОДАЛЬНОГО ОКНА
  //Функция показа модального окна
  this.showModal = (event) => {
    event.preventDefault(); //Отмена действия по умолчанию при клике по ссылке в галерее
    this.currentSlide = event.target.closest('a'); //Получаем ссылку на DOM узел с иннфоррмацией о слайде по клику по ссылке в галерее
    if (this.currentSlide) { //Если ссылка на узел с информацией о слайде была получена
      this.body.style.overflow = 'hidden'; //Блокируем прокрутку документа
      this.gallery.insertAdjacentHTML('beforeend', this.modalTemplate); //Вставляем HTML модального окна в галерею
      this.modal = this.gallery.querySelector('#galleryModal'); //Получаем ссылку, на модальное окно
      this.pictureInModal = this.modal.querySelector('picture'); //Получаем ссылку на контейнер изображения в модальном окне
      this.sourseOfPictureInModal = this.modal.querySelector('source'); //Получаем ссылку на тег source в picture модального окна
      this.capture(this.modal); //Захват фокуса внутри модального окна
      document.addEventListener('keydown', (e) => { //Подключаем обработчик событий на кнопку Esc, чтобы модальное окно закрывалось по нажатию клавиши
        if (e.key === 'Escape') {
          this.closeModal(); //Метод закрыть модальное окно
        }
      });
      this.drawModalFigure(); //Отрисовываем изображение с подписью внутри модала
      this.getSlidePosition(this.currentSlide); //Узнаём порядковый номер открывшегося слайда в стопке слайдов
      this.modalNavigationPossibility();
      swipe(this.modal); //Подключаем обработчик события свайпа к модальному окну
      this.modal.addEventListener('swipe',
        (event) => {
          if (event.detail.direction == 'left') {
            this.nextSlide(event); //Если свайп - влево, то вып. devbounce функции следующего слайда модала
          };
          if (event.detail.direction == 'right') {
            this.prevSlide(event); //Если свайп - вправо, то вып. devbounce функции предыдущего слайда модала
          };
        },
        { passive: false });
      //Подключаем обработчик событий к кнопкам модального окна c помощью метода this.modalSwitch
      this.modal.addEventListener('click', this.modalSwitch)
    }
  }
  //Метод переключатель (что делает каждая кнопка в модальном окне)
  this.modalSwitch = (event) => {
    let buttonId = event.target.id;
    switch (buttonId) {
      case 'galleryCloseButton':
        this.closeModal();
        break;
      case 'galleryNextButton':
        this.nextSlide(event);
        break;
      case 'galleryPrevButton':
        this.prevSlide(event);
        break;
    }
  }
  //Метод закрытия модального окна
  this.closeModal = () => {
    this.modal.style.animation = "slide-down-out ease-in " + this.animationDuration + "ms";
    setTimeout(() => {
      this.body.style.overflow = 'auto';
      this.release(this.modal);
      this.modal.remove();
      this.modal = null;
    }, this.animationDuration - 20);
  }
  //Метод получения порядкового номера слайда в стопке слайдов галереи
  this.getSlidePosition = (currentSlide) => {
    if (this.slidesLength > 0) { //Если в стопке слайдов есть хоть один слайд
      let index = 0; //Проверим на совпадение data-slide-id все слайды, начиная с 0
      this.slides.forEach((slide) => {
        if (slide.dataset.slideId == currentSlide.dataset.slideId) {
          this.currentSlidePosition = index;
          this.modalNavigationPossibility();
        } else {
          index++;
        }
      })
    }
  }
  //Метод отображения навигации в модальном окне
  this.modalNavigationPossibility = () => {
    this.modalNextButton = this.modal.querySelector('#galleryNextButton');
    this.modalPrevButton = this.modal.querySelector('#galleryPrevButton');
    if (this.slidesLength == 1) {
      this.modalNextButton.style.display = 'none'
      this.modalPrevButton.style.display = 'none'
    }
    if (this.currentSlidePosition == 0 && !this.modalPrevButton.classList.contains('navigation__prev_inactive')) {
      this.modalPrevButton.classList.add('navigation__prev_inactive');
      setTimeout(() => {
        this.modalPrevButton.style.display = 'none';
      }, this.animationDuration)
    } else if (this.currentSlidePosition > 0 && this.modalPrevButton.classList.contains('navigation__prev_inactive')) {
      this.modalPrevButton.style.display = 'block';
      this.modalPrevButton.classList.remove('navigation__prev_inactive');
    }
    if (this.currentSlidePosition == this.slidesLength - 1 && !this.modalNextButton.classList.contains('navigation__next_inactive')) {
      this.modalNextButton.classList.add('navigation__next_inactive');
      setTimeout(() => {
        this.modalNextButton.style.display = 'none';
      }, this.animationDuration)
    } else if (this.currentSlidePosition < this.slidesLength - 1 && this.modalNextButton.classList.contains('navigation__next_inactive')) {
      this.modalNextButton.style.display = 'block';
      this.modalNextButton.classList.remove('navigation__next_inactive');
    }
  }
  //Метод показа контента в модале
  this.drawModalFigure = () => {
    let href = this.currentSlide.getAttribute('href');
    let img = this.currentSlide.querySelector('img');
    let src = img.getAttribute('src');
    let srcset = img.getAttribute('srcset');
    let webpSrcset = this.currentSlide.querySelector('source').getAttribute('srcset');
    let alt = img.getAttribute('alt');
    let figcaption = this.currentSlide.querySelector('figcaption');
    if (figcaption) {
      var galleryFigcaption = figcaption.textContent;
    }
    let galleryModalImg = this.modal.querySelector('img')
    if (galleryFigcaption || alt) {
      let galleryModalCaption = this.modal.querySelector('.gallery__popcaption');
      if (galleryFigcaption) {
        galleryModalCaption.textContent = galleryFigcaption;
      } else if (alt) {
        galleryModalCaption.textContent = alt;
      }
      if (alt) {
        galleryModalImg.setAttribute('alt', alt);
      } else if (galleryFigcaption) {
        galleryModalImg.setAttribute('alt', galleryFigcaption);
      }
    }
    if (webpSrcset) {
      this.sourseOfPictureInModal.setAttribute('srcset', webpSrcset)
    }
    if (href.length > 5 || src) {
      if (href.length > 5) { galleryModalImg.setAttribute('src', href); }
      else if (src) { galleryModalImg.setAttribute('src', src); }
    }
    if (srcset) { galleryModalImg.setAttribute('srcset', srcset) }
  }
  //ВЫЗОВ МЕТОДА МОДАЛА
  if (!this.gallery.querySelector('.gallery__slider')) { //Если в галерее нет маленького слайдера, то будетем открывать слайды из списка сразу на полный экран
    this.galleryList.addEventListener('click', this.showModal);
  }

  //МЕТОД УРЕЗАННОЙ ГАЛЕРЕИ
  //Для урезанной менюшки с белой полоской, уберём фокусровку по табу, чтобы фокус не сломал перекрытие беллой полоской
  if (this.isStrippedSlider) {
    this.slides.forEach((slide) => {
      slide.setAttribute('tabindex', '-1');
    });
  }
}

//ИНИЦИАЛИЗИРУЕМ ПЛАГИН НА СТРАНИЦЕ!!! (УКАЗАТЬ НУЖНЫЙ ID В АТРИБУТЕ)
document.addEventListener('DOMContentLoaded', function () {
  var fotogallery = new Gallery('#gallery');
})