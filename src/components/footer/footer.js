document.addEventListener('DOMContentLoaded', function(){
  var copyright = function() {
    let thisYear = new Date();
    let copyrightDate = document.getElementById('copyrightDate');
    if (copyrightDate) {copyrightDate.textContent = thisYear.getFullYear()}
  }
  copyright();
})