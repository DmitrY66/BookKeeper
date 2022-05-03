'use strict';

import {
  asideLeft,
  asideRightItems,
  asideRightSum,
  expense1,
  expense2,
  expense3,
  expense4,
  expense5,
  expense6,
  expense7,
  expense8,
  expense9,
  expense10,
  expense1Inp,
  expense2Inp,
  expense3Inp,
  expense4Inp,
  expense5Inp,
  expense6Inp,
  expense7Inp,
  expense8Inp,
  expense9Inp,
  expense10Inp,
  objectName1,
  objectName2,
  objectName3,
  objectName4,
  objectName5,
  objectName6,
  objectName7,
  objectName8,
  objectName9,
  objectName10,
} from './modules/variables.js';

import {
  courentDatePeriod,
  getNamesBtn,
  showConfirmAction,
  inputValidation,
  actionElemLeftColumn,
  actionElemLeftColumnSave,
  changeNameButton,
} from './modules/functions.js';

import {
  getDataOutputSumTotal,
  getTotalDelete,
  postExport,
} from './modules/requests.js';

import {
  winControl,
} from './windowControl.js';



// функция управления окном программы
winControl();


// выводим месяц и год текущего периода
courentDatePeriod();


// получаем из JSON и присваиваем имена кнопкам расходов
getNamesBtn();


// запрет ввода символов в input кроме цыфр
inputValidation();


// слушаем события в левой колонке
asideLeft.addEventListener('click', (e) => {
  e.preventDefault();


  // кнопки статей расходов
  if (e.target.id === 'btn__expense1') {
    actionElemLeftColumn(expense1, objectName1);
  }

  if (e.target.id === 'btn__expense2') {
    actionElemLeftColumn(expense2, objectName2);
  }

  if (e.target.id === 'btn__expense3') {
    actionElemLeftColumn(expense3, objectName3);
  }

  if (e.target.id === 'btn__expense4') {
    actionElemLeftColumn(expense4, objectName4);
  }

  if (e.target.id === 'btn__expense5') {
    actionElemLeftColumn(expense5, objectName5);
  }

  if (e.target.id === 'btn__expense6') {
    actionElemLeftColumn(expense6, objectName6);
  }

  if (e.target.id === 'btn__expense7') {
    actionElemLeftColumn(expense7, objectName7);
  }

  if (e.target.id === 'btn__expense8') {
    actionElemLeftColumn(expense8, objectName8);
  }

  if (e.target.id === 'btn__expense9') {
    actionElemLeftColumn(expense9, objectName9);
  }

  if (e.target.id === 'btn__expense10') {
    actionElemLeftColumn(expense10, objectName10);
  }


  // кнопки "сохранить" статей расходов
  if (e.target.id === 'btn__expense1-save') {
    actionElemLeftColumnSave(expense1Inp, objectName1);
    setTimeout(getDataOutputSumTotal, 500);
  }

  if (e.target.id === 'btn__expense2-save') {
    actionElemLeftColumnSave(expense2Inp, objectName2);
    setTimeout(getDataOutputSumTotal, 500);
  }

  if (e.target.id === 'btn__expense3-save') {
    actionElemLeftColumnSave(expense3Inp, objectName3);
    setTimeout(getDataOutputSumTotal, 500);
  }

  if (e.target.id === 'btn__expense4-save') {
    actionElemLeftColumnSave(expense4Inp, objectName4);
    setTimeout(getDataOutputSumTotal, 500);
  }

  if (e.target.id === 'btn__expense5-save') {
    actionElemLeftColumnSave(expense5Inp, objectName5);
    setTimeout(getDataOutputSumTotal, 500);
  }

  if (e.target.id === 'btn__expense6-save') {
    actionElemLeftColumnSave(expense6Inp, objectName6);
    setTimeout(getDataOutputSumTotal, 500);
  }

  if (e.target.id === 'btn__expense7-save') {
    actionElemLeftColumnSave(expense7Inp, objectName7);
    setTimeout(getDataOutputSumTotal, 500);
  }

  if (e.target.id === 'btn__expense8-save') {
    actionElemLeftColumnSave(expense8Inp, objectName8);
    setTimeout(getDataOutputSumTotal, 500);
  }

  if (e.target.id === 'btn__expense9-save') {
    actionElemLeftColumnSave(expense9Inp, objectName9);
    setTimeout(getDataOutputSumTotal, 500);
  }

  if (e.target.id === 'btn__expense10-save') {
    actionElemLeftColumnSave(expense10Inp, objectName10);
    setTimeout(getDataOutputSumTotal, 500);
  }


  // кнопки "Expor", "Удалить данные", "Подтвердите действие" и "Отменить"
  if (e.target.id === 'btn__export') {
    postExport();
  }

  if (e.target.id === 'btn__deletedata') {
    showConfirmAction();
  }

  if (e.target.className === 'btn__confirm') {
    getTotalDelete();
    setTimeout(getDataOutputSumTotal, 500);
    asideRightItems.innerHTML = '';
    asideRightSum.innerHTML = '';
    showConfirmAction();
  }

  if (e.target.className === 'btn__cancel') {
    showConfirmAction();
  }

});


// слушаем события в левой колонке
asideLeft.addEventListener('contextmenu', (e) => {
  e.preventDefault();

  // кнопки статей расходов
  if (e.target.id === 'btn__expense1') {
    changeNameButton(e.target.id);
  }
  if (e.target.id === 'btn__expense2') {
    changeNameButton(e.target.id);
  }
  if (e.target.id === 'btn__expense3') {
    changeNameButton(e.target.id);
  }
  if (e.target.id === 'btn__expense4') {
    changeNameButton(e.target.id);
  }
  if (e.target.id === 'btn__expense5') {
    changeNameButton(e.target.id);
  }
  if (e.target.id === 'btn__expense6') {
    changeNameButton(e.target.id);
  }
  if (e.target.id === 'btn__expense7') {
    changeNameButton(e.target.id);
  }
  if (e.target.id === 'btn__expense8') {
    changeNameButton(e.target.id);
  }
  if (e.target.id === 'btn__expense9') {
    changeNameButton(e.target.id);
  }
  if (e.target.id === 'btn__expense10') {
    changeNameButton(e.target.id);
  }

});

getDataOutputSumTotal();
