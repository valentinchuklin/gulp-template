//СКРИПТ ДЛЯ РАБОТЫ С WEBP В КАЧЕСТВЕ ФОНА
//Если браузер не поддерживает webp из файла css, то можно указать фон в формате jpg в дата атрибуте html-тега
//типа - data-bg="img/slide-02.jpg" (путь к файлу заменить на нужный)
document.addEventListener('DOMContentLoaded', function () {
  // Проверяем, можно ли использовать Webp формат
  function canUseWebp() {
    // Создаем элемент canvas
    let elem = document.createElement('canvas');
    // Приводим элемент к булеву типу
    if (!!(elem.getContext && elem.getContext('2d'))) {
      // Создаем изображение в формате webp, возвращаем индекс искомого элемента и сразу же проверяем его
      return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
    }
    // Иначе Webp не используем
    return false;
  }
  // Проверяем, является ли браузер посетителя сайта Firefox и получаем его версию
  let isitFirefox = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./);
  let firefoxVer = isitFirefox ? parseInt(isitFirefox[1]) : 0;
  // Если есть поддержка Webp или браузер Firefox версии больше или равно 65
  if (!canUseWebp()) {
    // Делаем все то же самое что и для jpg, но уже для изображений формата Webp
    let imagesNotWebp = document.querySelectorAll('[data-bg]');
    for (let i = 0; i < imagesNotWebp.length; i++) {
      let imageNotWebp = imagesNotWebp[i].getAttribute('data-bg');
      imagesNotWebp[i].style.backgroundImage = 'url(' + imageNotWebp + ')';
    }
  }
})
