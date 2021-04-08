document.addEventListener('DOMContentLoaded', function () {
  var selects = document.querySelectorAll('.select'); //Селекты на странице
  selects.forEach(element => {
    var selectLable = element.querySelector('.select__lable'); //Заголовок списка
    var selectList = element.querySelector('.select__list'); //Сам список
    var selectItems = selectList.querySelectorAll('.select__item'); //Элементы списка
    const selectPlaceholder = selectLable.textContent; //Запомним текст лейбла
    //Функция раскрытия списка
    function toggleSelectList(event) {
      event.preventDefault();
      selectList.classList.toggle('select__list_opened');
    }
    //Функция счётчика для мультиселекта
    var selectCounter = () => {
      var selectCounterSpan = selectLable.querySelector('.select__counter'); //Спан счётчика
      var noSelectCounterSpan = !selectCounterSpan; //Счётчика нет?
      if (noSelectCounterSpan) {
        var selectedLength = element.querySelectorAll('.select__item_selected').length; //Получим количество выбранных элементов
        selectLable.insertAdjacentHTML('beforeend', '<span class="select__counter">' + selectedLength + '</span>'); //Добавим счётчик
      } else {
        var selectedLength = element.querySelectorAll('.select__item_selected').length; //Получим количество выбранных элементов
        selectCounterSpan.textContent = selectedLength; //Просто меняем значения счётчика
      }
    }
    //Функция выбора
    function selectElement(event) {
      event.preventDefault();
      let eventElement = event.target; //Элемент, по которому кликнули
      let itemData = eventElement.dataset; //Дата-атрибуты элемента списка
      let selectData = element.dataset; //Дата-атрибуты селекта
      let selectMultiple = selectList.parentNode.classList.contains('select_multiple'); //Селект мультивыбора?
      let selectSingle = !selectMultiple; //Или селект сингл?

      if (itemData.selected == "") { //Если элемент выбран, при клике отключаем его
        delete itemData.selected;
        eventElement.classList.remove('select__item_selected');
      } else {
        if (selectSingle) { //Если селект одиночный, а элемент не выбран
          selectItems.forEach(element => {
            delete element.dataset.selected; //отключаем выбор у всех остальных элементов
            element.classList.remove('select__item_selected');
          });
        } //Если нет, минуем этот фрагмент и делаем мультивыбор
        itemData.selected = ""; //Выбираем только нужный элемент
        eventElement.classList.add('select__item_selected');
      }
      if (selectSingle && itemData.value !== "") { //Если у нас сингл селект, а значение элемента, не пустое
        selectData.value = itemData.value; //То сразу переписываем значение селекта
        selectLable.textContent = selectData.value;
      } else if (selectMultiple & itemData.value !== "") { //Если у нас мультиселект и элемент не пустой
        if (!selectData.value) { //Если значение селекта пустое, то мы тоже просто переписываем его значением элемента
          selectData.value = itemData.value;
          selectCounter();
        } else if (selectData.value.length > 0 && !selectData.value.includes(itemData.value)) { //Если значение селекта не пустое, но оно не содержит значение выбранного элемента
          selectData.value += " " + itemData.value; //, то мы добавляем его в список значений через пробел в с троку
          selectData.value = selectData.value.replace("  ", " "); //И подчищаем, если появились двойные пробелы
          selectCounter();
        } else if (selectData.value.length > 0 && selectData.value.includes(itemData.value)) { //Если же значение элемента содержится в списке значений селекта
          selectData.value = selectData.value.replace(itemData.value, ""); //Мы удаляем его
          selectData.value = selectData.value.replace("  ", " "); //И подчищаем, если появились двойные пробелы
          var selectValueLength = selectData.value.length; //Нам ещё понадобится длина значения селекта
          if (selectData.value[selectValueLength - 1] === " ") {
            selectData.value = selectData.value.substring(0, selectValueLength - 1); //Иногда ещё остаётся один лишний пробел в конце, тоже его подчищаем
          }
          selectCounter();
          if (selectData.value === "") { //И если значение оказывается пустым, удаляем его вместе со счётчиком и возвращаем плейсхолдер
            delete selectData.value;
            selectLable.textContent = selectPlaceholder;
          }
        }
      } else if (itemData.value === "") { //Если значение элемента пустое, то сбрасываем значение селекта и выборку (метод clear)
        delete selectData.value;
        selectItems.forEach(element => {
          delete element.dataset.selected;
          element.classList.remove('select__item_selected');
          if (selectMultiple) { selectList.classList.toggle('select__list_opened') } //И закрываем список, если он мультивыборный
        });
        selectLable.textContent = selectPlaceholder;
      }
      if (selectSingle) {
        selectList.classList.toggle('select__list_opened'); //Сингл селект мы закрываем всегда при клике по элементы
      }
    }
    selectList.addEventListener('click', selectElement); //Вешаем обработчик на список элементов, он будет следить откуда всплывают события
    selectLable.addEventListener('click', toggleSelectList); //Вешаем обработчик на заголовки списков, чтобы открывать списки и закрывать
    document.addEventListener('keydown', e => { //Закрываем селекты по Esc
      if (e.keyCode === 27) {
        var selectOpened = document.querySelector('.select__list_opened');
        if (selectOpened) {
          selectOpened.classList.remove('select__list_opened');
        }
      }
    });
    document.addEventListener('click', function (e) {
      if (!e.target.classList.value.includes('select')) {
        var selectOpened = document.querySelector('.select__list_opened');
        if (selectOpened) {
          selectOpened.classList.remove('select__list_opened');
        }
      }
    })
  });
})