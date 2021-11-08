class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  distanceTo(point) {
    let dx = point.x - this.x;
    let dy = point.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  move(x, y) {
    this.x += x;
    this.y += y;
  }
}
class Circle {
  constructor(center, radius) {
    this.center = center;
    this.radius = radius;
  }
  containsPoint(point) {
    return this.center.distanceTo(point) < this.radius;
  }
}
let dragTarget = null;
let pizza;

function getPizzaCircle() {
  let rect = pizza.getBoundingClientRect();
  let cx = rect.left + rect.width / 2;
  let cy = rect.top + rect.height / 2;
  let center = new Point(cx, cy);
  return new Circle(center, rect.width / 2);
}
function setDragTargetPos(point) {
  let rect = dragTarget.getBoundingClientRect();
  point.move(-rect.width / 2, -rect.height / 2);
  dragTarget.style.left = point.x + 'px';
  dragTarget.style.top = point.y + 'px';
}
function getPosOnPizza(mousePos) {
  let rect = pizza.getBoundingClientRect();
  return new Point(mousePos.x - rect.left, mousePos.y - rect.top);
}
function activeComponents(e) {
  if (e.value === '0') {
    document.querySelector('.constructor__components').style.filter =
      'grayscale(100%)';
    document.querySelector('.constructor-sauces').style.filter =
      'grayscale(100%)';
    return true;
  } else {
    document.querySelector('.constructor__components').style.filter =
      'grayscale(0%)';
    document.querySelector('.constructor-sauces').style.filter =
      'grayscale(0%)';
    return false;
  }
}
function activeSubmit() {
  if (!document.querySelector('.constructor-pizza__list > li')) {
    document
      .querySelector('.constructor-sauces__form')
      .childNodes.forEach((e) => (e.disabled = true));
    document.querySelector('.calculator-form__submit').disabled = true;
    return true;
  } else {
    document
      .querySelector('.constructor-sauces__form')
      .childNodes.forEach((e) => (e.disabled = false));
    document.querySelector('.calculator-form__submit').disabled = false;
    return false;
  }
}
function popup(price) {
  let popup = document.querySelector('.popup');
  popup.style.display = 'block';
  let close = document.querySelector('.popup_close');

  console.log(price);
  let content = document.querySelector('.popup__content');
  let table = document.createElement('table');
  table.classList.add('popup__price');

  let caption = document.createElement('caption');
  table.append(caption);
  caption.innerHTML += 'Чек';
  table.innerHTML +=
    '<tr><th>Наименование</th><th>Количество</th><th>Стоимость</th><th>Сумма (грн.)</th></tr>';
  table.innerHTML += '<tr><th colspan="4">Ингредиенты</th></tr>';
  let totalPrice = 0;
  price.map((e, i) => {
    if (i === price.length - 2)
      table.innerHTML += '<tr><th colspan="4">Соусы</th></tr>';
    table.innerHTML += `<tr><td>${e.name}</td><td>${e.number}</td><td>${
      e.price
    }</td><td>${(e.number * e.price).toFixed(2)}</td></tr>`;
    totalPrice += e.number * e.price;
  });
  table.innerHTML += `<tr><th colspan="3">Итого</th><th>${totalPrice.toFixed(
    2
  )} грн.</th></tr>`;
  content.append(table);
  close.addEventListener('click', () => {
    popup.classList.add('popup-hidden');
    setTimeout(() => {
      popup.classList.remove('popup-hidden');
      popup.style.display = 'none';
      table.remove();
    }, 700);
  });
}
let arrPrice = [];
function price(event) {
  let pizzaComponents = document.querySelector('.constructor-pizza__list');
  let sauces = document.querySelector('.constructor-sauces__form');
  arrPrice = [];
  if (!pizzaComponents.childNodes.length) arrPrice = [];
  if (!arrPrice.length)
    arrPrice.push({
      name: 'Тесто',
      price: 20 * tempK,
      number: 1,
      index: arrPrice.length,
    });
  pizzaComponents.childNodes.forEach((e) => {
    let elementPizza = e;
    let search = arrPrice.find((e) => e.name === elementPizza.dataset.name);
    if (!search)
      arrPrice.push({
        name: elementPizza.dataset.name,
        price: parseFloat(elementPizza.dataset.price) * tempK,
        number: 1,
        index: arrPrice.length,
      });
    else if (search) arrPrice[search.index].number += 1;
  });
  sauces.childNodes.forEach((e) => {
    let elementSauces = e;
    if (elementSauces.nodeType === 1 && elementSauces.matches('input')) {
      if (!elementSauces.checked) return;
      let search = arrPrice.find((e) => e.name === elementSauces.dataset.name);
      if (!search)
        arrPrice.push({
          name: elementSauces.dataset.name,
          price: parseFloat(elementSauces.dataset.price) * tempK,
          number: 1,
          index: arrPrice.length,
        });
      else arrPrice[search.index].number += 1;
    }
  });
}
let tempK = 1;
function changePrice(k, arr) {
  if (!arr.length) return;
  arr.map((e) => {
    let a = e.price * ((1 / tempK) * k);
    e.price = a.toFixed(2);
  });
  tempK = k;
}

document.addEventListener('DOMContentLoaded', () => {
  let sauces = document.querySelector('.constructor-sauces__form');
  let size = document.querySelector('.calculator-form__size');
  pizza = document.querySelector('.constructor-pizza__list');
  activeComponents(document.querySelector('.calculator-form__size'));
  window.addEventListener('mousedown', (e) => {
    if (document.querySelector('.calculator-form__size').value === '0') {
      //alert('Выберете размер пиццы');
      return;
    }
    let mousePoint = new Point(e.clientX, e.clientY);
    if (e.target.closest('.constructor-components__item')) {
      dragTarget = e.target
        .closest('.constructor-components__item')
        .cloneNode(true);
      dragTarget.style.position = 'fixed';
      pizza.append(dragTarget);
      setDragTargetPos(mousePoint);
    }
    if (e.target.closest('.constructor-components__item-pizza')) {
      dragTarget = e.target
        .closest('.constructor-components__item-pizza')
        .cloneNode(true);
      e.target.closest('.constructor-components__item-pizza').remove();
      dragTarget.style.position = 'fixed';
      pizza.append(dragTarget);
      setDragTargetPos(mousePoint);
    }
  });
  window.addEventListener('mousemove', (e) => {
    let mousePoint = new Point(e.clientX, e.clientY);
    if (dragTarget) {
      setDragTargetPos(mousePoint);
      pizza.append(dragTarget);
    }
  });
  window.addEventListener('mouseup', (e) => {
    if (dragTarget) {
      let pizzaCircle = getPizzaCircle();
      let mousePos = new Point(e.clientX, e.clientY);

      if (pizzaCircle.containsPoint(mousePos)) {
        let newPos = getPosOnPizza(mousePos);
        setDragTargetPos(newPos);
        pizza.append(dragTarget);

        dragTarget.style.position = 'absolute';
        dragTarget.classList.replace(
          'constructor-components__item',
          'constructor-components__item-pizza'
        );
        dragTarget = null;
      } else {
        dragTarget.remove();
        dragTarget = null;
      }
      activeSubmit();
      price();
      changePrice(parseFloat(size.value), arrPrice);
      console.log(arrPrice);
    }
  });
  sauces.addEventListener('click', (e) => {
    if (e.target.matches('input')) {
      price(event.target);
      changePrice(size.value, arrPrice);
    }
    console.log(arrPrice);
  });
  size.addEventListener('click', (e) => {
    activeComponents(e.target);
    if (e.target.value !== '0') changePrice(e.target.value, arrPrice);
    console.log(arrPrice);
  });
  let priceList = document.querySelector('.calculator-form__list');
  let submit = document.querySelector('.calculator-form__submit');
  let pizzaComponents = document.querySelector('.constructor-pizza__list');

  submit.addEventListener('click', () => {
    let a = '';
    let totalPrice = 0;
    a +=
      'Размер пиццы: ' +
      document.querySelector('.calculator-form__size').value +
      '</br>';
    arrPrice.map((e) => {
      totalPrice += parseFloat(e.price * e.number);
      a +=
        e.name +
        ' ' +
        e.price +
        ' x ' +
        e.number +
        ' = ' +
        (e.price * e.number).toFixed(2) +
        ';</br>';
    });
    a += 'Итого_________' + totalPrice.toFixed(2);
    //priceList.innerHTML = a;
    pizzaComponents.innerHTML = '';
    document.querySelector('.calculator-form__size').value = 0;
    activeComponents(document.querySelector('.calculator-form__size'));
    activeSubmit();
    popup(arrPrice);
  });
});
