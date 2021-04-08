function DrawCart(cartSelector) {
  this.header = document.querySelector('header'); //header
  this.cart = this.header.querySelector(cartSelector); //Корзина
  this.cartHeight = parseInt(window.getComputedStyle(this.cart, null).getPropertyValue('height'), 10); //Высота корзины
  this.cartTop = parseInt(window.getComputedStyle(this.cart, null).getPropertyValue('top'), 10); //Отступ сверху у корзины
  this.cartCounter = this.cart.querySelector('.cart__counter'); //Ищем счётчик
  this.isCartViewquery = document.querySelector('.cart-view'); //Проверяем, не находимся ли мы внутри корзины

  this.getBorder = () => { //Функция получает скролл после которого меняется стиль
    this.headerHeight = parseInt(window.getComputedStyle(this.header, null).getPropertyValue('height'), 10); //Высота header-а
    this.border = this.headerHeight - this.cartTop - this.cartHeight; //ScrollY после которого меняется стиль корзины (header - отступ сверху и высота корзины)
  }
  this.toggleCartClass = () => { //Метод смены стиля корзины при кроле
    let scrollY = window.scrollY;
    if (scrollY > this.border && !this.cart.classList.contains('cart_on-white')) {
      this.cart.classList.add('cart_on-white');
    } else if (scrollY < this.border && this.cart.classList.contains('cart_on-white')) {
      this.cart.classList.remove('cart_on-white')
    }
  }
  this.drawCounter = () => { //Метод меняет стиль счётчика корзины, в зависимости от наполненности
    this.cartIsEmpty = parseInt(this.cartCounter.textContent, 10) < 1 || this.cartCounter.textContent.length == 0;
    if (this.cartIsEmpty && !this.cartCounter.classList.contains('cart__counter_empty')) {
      this.cartCounter.classList.add('cart__counter_empty');
    } else if (!this.cartIsEmpty && this.cartCounter.classList.contains('cart__counter_empty')) {
      this.cartCounter.classList.remove('cart__counter_empty');
    }
  }
  if (this.isCartViewquery) {
    this.cart.style.display = 'none';
  } else {
    this.getBorder(); //Сразу получим границу перехода
    this.toggleCartClass(); //Сразу зададим класс корзине, если было смещение по Y или переход по якорю
    window.addEventListener('resize', this.getBorder);
    window.addEventListener('scroll', this.toggleCartClass);
    this.cart.addEventListener('DOMSubtreeModified', this.drawCounter);
  }
}
document.addEventListener('DOMContentLoaded', function () {
  var drawCart = new DrawCart('.cart');
})