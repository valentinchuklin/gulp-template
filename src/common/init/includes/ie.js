function detectIE() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf('MSIE ');

  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
    return true;
  }

  return false;
}
if (detectIE() && window.location.href.indexOf('browserold') < 0) {
  window.location.replace('browserold.html');
}
