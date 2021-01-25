function detectIE() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf('MSIE ');

  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
    return true;
  }

  return false;
}
if (detectIE()) {
  alert('Приносим свои изменения. Ваш браузер Internet Explorer устарел и больше не поддерживается разработчиками. Сайт может отображаться не корркетно. Зайдите на сайт, используя другой браузер: Google Chrome, Firefox, Opera или Yandex-браузер.')
}
