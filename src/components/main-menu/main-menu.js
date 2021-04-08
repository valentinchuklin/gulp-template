//Скрипт-конструктор адаптивного меню
//N.B. Для корректной работы фокуса потребуется подключение плагина focusManager http://isaacandela.github.io/focus-manager/ До вызова этого скрипта
function AdaptiveMenu(
  //Аргументы по умолчанию 
  //Они могут быть переопределены в новом экземпляре только в полном составе в настоящий момент
  mainMenuId = 'main-menu', //Главное меню
  mainMenuDesktopBreakPoint = 1240, //Брейкпоинт на котором начинает отображаться десктопная версия меню (нужен при изменении размера вьюпорта)
  mainMenuAnimationDuration = 360, //Длительность анимации появления меню в мс
  mainMenuAnimationIn = 'slide-down', //Название анимации из animation.sass, исп при появлении меню
  mainMenuAnimationOut = 'slide-up', //Название анимации из animation.sass, исп при исчезновении меню
  mainMenuAnimationInTimeFunction = 'ease-out', //Тайминг функция появления меню
  mainMenuAnimationOutTimeFunction = 'ease-in' //Тайминг функция исчезновения меню
) {
  //Вспомогательные переменные (NB Важно именование классов по БЭМ. Класс бургера должен быть по шаблону: id__burger, крестика - id__closebutton)
  var mainMenu = document.getElementById(mainMenuId); //Главное меню
  var mainMenuChildren = mainMenu.children; //Потомки главного меню, необходимые для его работы
  for (var i = 0; i < mainMenuChildren.length; i++) {
    if (mainMenuChildren[i].classList.value.includes('burger')) { mainMenuBurger = mainMenuChildren[i]; } //Бургер
    if (mainMenuChildren[i].classList.value.includes('panel')) { mainMenuPanel = mainMenuChildren[i];} //Панелька
    if (mainMenuChildren[i].classList.value.includes('close-button')) { mainMenuCloseButton = mainMenuChildren[i]; } //Крестик, если он находится вне панельки
  }
  mainMenuPanelChildren = mainMenuPanel.children; //Потомки панельки. В них должен быть крестик
  for (var i = 0; i < mainMenuPanelChildren.length; i++) {
    if (mainMenuPanelChildren[i].classList.value.includes('close-button')) { mainMenuCloseButton = mainMenuPanelChildren[i]; } //Крестик, если он находится внутри панельки
  }
  lastViewportDisplaySmall = window.innerWidth < mainMenuDesktopBreakPoint; //Чтобы правильно отображать или скрывать меню при изменении вьюпорта потребуется определить был ли вьюпорт достаточно мал, чтобы показать адаптивный вариант меню
  isFocusManager = focusManager != null; //Проверяем подключён ли фокус-менеджер
  
  //функция открытия главного меню
  this.openMainMenuFunction = function () {
    mainMenuNotVisible = window.getComputedStyle(mainMenuPanel, null).getPropertyValue('display') == 'none';
    if (mainMenuNotVisible) {
      mainMenuPanel.style.display = 'block';
      mainMenuPanel.style.animation = mainMenuAnimationIn + ' ' + mainMenuAnimationDuration + 'ms ' + mainMenuAnimationInTimeFunction; //Анимация при появлении
      document.addEventListener('click', this.clickOutOfMenuFunction); // Закрыть меню по клику мимо меню
      if (isFocusManager) { focusManager.capture(mainMenuPanel); } //Захват фокуса с помощью плагина focusManager
      window.addEventListener('resize', this.menainMenuOnResizeFunction); //При изменении вьюпорта выше планшетного - отображаем меню и поиск, а бургер приводим в исходное состояние
    }
  }
  //Функция закрытия меню
  this.closeMainMenuFunction = function () {
    mainMenuVisible = window.getComputedStyle(mainMenuPanel, null).getPropertyValue('display') == 'block';//Меню видно?
    displaySmall = window.innerWidth < mainMenuDesktopBreakPoint;//Экран маленький, чтобы на нём показывать портативную версию меню?
    if (mainMenuVisible && displaySmall) {
      mainMenuPanel.style.animation = mainMenuAnimationOut + ' ' + mainMenuAnimationDuration + 'ms ' + mainMenuAnimationOutTimeFunction; //Анимация при скрытии
      setTimeout(function () {
        mainMenuPanel.style = null;
        document.removeEventListener('click', this.clickOutOfMenuFunction);
        if (isFocusManager) { focusManager.release(mainMenuPanel); } //Отпускание фокуса с помощью плагина focusManager
        window.removeEventListener('resize', this.menainMenuOnResizeFunction); //Удаляем прослушиватель window resize
      }, mainMenuAnimationDuration);
    }
  }
  //Функция - по клику мимо меню - закрыть меню
  this.clickOutOfMenuFunction = function (element) {
    targetClassValue = element.target.classList.value; //Классы элементы, по которому кликнули
    menuClickOut = !targetClassValue.includes('main-menu') || targetClassValue.includes('main-menu__link'); //Если класс не содержит main-menu или является ссылкой главного меню - скрыть панель меню
    if (menuClickOut) { this.closeMainMenuFunction(); } //Закрыть меню
  }
  //Функция, которая срабатывает, если меняется размер вьюпорта и надо показать или скрыть дескопный вариант меню
  this.menainMenuOnResizeFunction = function () {
    displaySmall = window.innerWidth < mainMenuDesktopBreakPoint; //Ширина вьюпорта меньше десктопной вёрстки?
    menuModeChanged = lastViewportDisplaySmall != displaySmall; //Поменялся ли стиль отображения меню с мобильного на десктопный или наоборот?
    if (!displaySmall && menuModeChanged) {
      mainMenuPanel.style = null;
      lastViewportDisplaySmall = displaySmall;
      document.removeEventListener('click', this.clickOutOfMenuFunction);
      if (isFocusManager) { focusManager.release(mainMenuPanel); } //Отпускание фокуса с помощью плагина focusManager
      window.removeEventListener('resize', this.menainMenuOnResizeFunction); //Удаляем прослушиватель window resize
    } else if (displaySmall && menuModeChanged) {
      mainMenuPanel.style = null;
      lastViewportDisplaySmall = displaySmall;
      document.removeEventListener('click', this.clickOutOfMenuFunction);
      if (isFocusManager) { focusManager.release(mainMenuPanel); } //Отпускание фокуса с помощью плагина focusManager
      window.removeEventListener('resize', this.menainMenuOnResizeFunction); //Удаляем прослушиватель window resize
    }
  }
  mainMenuBurger.addEventListener('click', this.openMainMenuFunction); //По клику на бургер - открыть меню
  mainMenuCloseButton.addEventListener('click', this.closeMainMenuFunction); //По клику на крестик - закрыть меню
}

document.addEventListener('DOMContentLoaded', function() {
  var adaptiveMainMenu = new AdaptiveMenu(); //Вызов экземпляра объекта мменю
})
