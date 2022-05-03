'use strict';

import {
  asideRightItems,
  asideRightSum,
  asideRightMessage,
  btnExpenseItemsJs,
  inpExpenseItemJs,
  btnModal,
  courentDate,
} from './variables.js';

import {
  getDataOutput,
  getDataOutputSum,
  getDataOutputSumTotal,
  postDataWrapp,
  postDataDelWrapp,
  btnRename,
} from './requests.js';



// функция вывода месяца и года текущего периода
export let courentDatePeriod = () => {

  let manth = new Date().toLocaleString('default', { month: 'long' });
  let year = new Date().getFullYear();

  courentDate.textContent = `${manth} / ${year}`

}


// функция именования кнопок расходов
export const getNamesBtn = () => {

  fetch('../../data/namesBtn.json')
    .then(response => response.json())
    .then(json => {

      if (json.length > 0) {

        const buttonsNaming = () => {
          btnExpenseItemsJs.forEach((item, index) => {

            item.children[0].textContent = json[index];

          })
        };
        buttonsNaming();

      } else {

        console.log('список названий кнопок расходов пуст');

      }

    })
    .catch(json => console.log('json файл namesBtn.json пуст'))

};


// функция показа, скрытия поля ввода
export const changeInputHeight = (item) => {

  if (getComputedStyle(item).height === '45px') {

    item.style.height = '120px';
    item.children[0].classList.add('btnColorActive');

  }
};


// функция показа, скрытия кнопки "Подтвердить действие"
export const showConfirmAction = () => {

  if (getComputedStyle(btnModal).top === '50px') {
    btnModal.style.top = '6px';
  }

  if (getComputedStyle(btnModal).top === '6px') {
    btnModal.style.top = '50px';
  }

};


// функция скрытия поля ввода не активного элемента
export const changeInputHeightOut = () => {

  btnExpenseItemsJs.forEach(item => {

    if (getComputedStyle(item).height === '120px') {
      item.style.height = '45px';
      item.children[0].classList.remove('btnColorActive');
    }

  })
};


// функция запрета ввода символов в input кроме цыфр
export const inputValidation = () => {

  inpExpenseItemJs.forEach(item => {
    item.oninput = function () {
      let numberOnly = /[^\d]/g;
      this.value = this.value.replace(numberOnly, '');
    }
  })

};


// функция создания блока элемента в правой колонке
export const createBlockElement = (nameObject, inpExpense) => {

  const contItem = document.createElement('div');
  contItem.classList.add('aside__right-block');

  const p = document.createElement('p');
  p.innerHTML = `${new Date().toLocaleString()} &DDotrahd; ${+inpExpense.value}`;

  const btnDelete = document.createElement('button');
  btnDelete.classList.add('aside__right-btn');
  btnDelete.addEventListener('click', (e) => (deleteElem(e, nameObject)));
  // console.log('nameObject: ', nameObject);

  contItem.append(p);
  contItem.append(btnDelete);
  asideRightItems.append(contItem);

};


// функция удаления элемента
export const deleteElem = (e, nameObject) => {

  e.preventDefault();

  if (e.target.className === 'aside__right-btn') {

    let targetContent = e.target.parentNode.children[0].textContent;

    targetContent = targetContent.split(' ⤑ ');

    targetContent = { [targetContent[0]]: +targetContent[1] };

    e.target.parentNode.remove();

    postDataDelWrapp(targetContent);

    asideRightSum.innerHTML = '';
    if (asideRightMessage) asideRightMessage.textContent = '';

    if (asideRightItems.textContent === '') {
      asideRightSum.innerHTML = `<p>нет данных</p>`;
    }

    setTimeout(getDataOutputSum, 500, nameObject);
    setTimeout(getDataOutputSumTotal, 500);
  }

};


// функция - открытие, закрытие, очистка ввода, отправка запросов серверу
export const actionElemLeftColumn = (exp, objectName) => {

  changeInputHeight(exp);
  changeInputHeightOut();

  if (getComputedStyle(exp).height === '45px') {

    asideRightItems.innerHTML = '';
    asideRightSum.innerHTML = '';
    asideRightMessage.textContent = '';

    getDataOutput(objectName);

    getDataOutputSum(objectName);

    getDataOutputSumTotal();

  } else {

    asideRightItems.innerHTML = '';
    asideRightSum.innerHTML = '';
    asideRightMessage.textContent = '';

  }

};


// функция - отправка запросов серверу на сохранение и отображение введенных данных
export const actionElemLeftColumnSave = (expInp, objectName) => {

  if (expInp.value !== '') {

    postDataWrapp(objectName, expInp);

    if (asideRightItems.textContent === 'нет данных') {

      asideRightItems.innerHTML = '';
      asideRightSum.innerHTML = '';
      createBlockElement(objectName, expInp);

    } else {

      createBlockElement(objectName, expInp);
      asideRightSum.innerHTML = '';

    }
    // очищаем поле ввода
    expInp.value = '';

    // убираем сообщение "ДАННЫЕ УСПЕШНО ОЧИЩЕНЫ"
    asideRightMessage.textContent = '';

    // setTimeout(() => getDataOutputSum(objectName), 500) //  тоже самое что и ниже
    setTimeout(getDataOutputSum, 500, objectName);

  }

};


// функция смены имени кнопки
export const changeNameButton = (target) => {

  let indexBtn = +target.slice(12);

  // создаём overlay и блок с кнопкой и инпутом для переименования
  const body = document.querySelector('body');
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.addEventListener('click', () => {
    div.remove();
    overlay.remove();
    getNamesBtn();
  })

  const div = document.createElement('div');
  div.className = 'modal-change-name';

  const input = document.createElement('input');
  input.className = 'inp-change-name';
  input.setAttribute('maxlength', 14);

  const button = document.createElement('button');
  button.className = 'btn-change-name';
  button.textContent = 'Переименовать';

  // вставляем на страницу 
  body.append(overlay);
  div.append(input);
  div.append(button);
  btnExpenseItemsJs[indexBtn - 1].append(div);

  const inpChangeName = document.querySelector('.inp-change-name');
  const btnChangeName = document.querySelector('.btn-change-name');

  let arrNewNameAndIndex = [];
  let newNameBtn = '';

  inpChangeName.oninput = function () {

    this.value = this.value.replace(/[^a-zA-Zа-яёА-ЯЁ0-9-\s]/g, '');

    this.value = this.value.replace('  ', ' ');

    newNameBtn = this.value.trim();

  };

  btnChangeName.addEventListener('click', () => {

    if (newNameBtn !== '') {
      arrNewNameAndIndex = [indexBtn, newNameBtn];
      console.log('arrNewNameAndIndex: ', arrNewNameAndIndex);

      btnRename(arrNewNameAndIndex);
    } 

  });

}
