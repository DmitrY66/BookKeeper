'use strict';

import { URL_DATA1, URL_DATA_TOTAL, URL_SAVE, URL_DEL, URL_DEL_TOTAL, URL_EXPORT, BTN_RENAME } from './urls.js';

import {
  asideRightItems,
  asideRightSum,
  totalsum,
  asideRightMessage,
  btnExpenseItemsJs,
} from './variables.js';

import {
  deleteElem,
} from './functions.js';



// функция отправки GET запроса ==> получение и вывод данных в правую колонку
export const getDataOutput = (nameObject) => {

  // функция отправки GET запроса
  const getData = () => fetch(URL_DATA1, {

    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    }

  });

  getData()

    // получаем данные. .json() - декодирует ответ в формате JSON
    .then(res => res.json())

    // если ошибка выводим сообщение 'нет данных'
    .catch(() => {
      asideRightItems.innerHTML = 'нет данных';
      console.log('нет данных')
    })

    // перебираем полученный объект по ключам, создаем параграф и вставляем в него ключь и его значение. затем вставляем параграф в правую колонку
    .then(res => {

      if (Object.keys(res).includes(nameObject) && Object.keys(res[nameObject]).length !== 0) {

        Object.keys(res[nameObject]).forEach(function (item) {

          const contItem = document.createElement('div');
          contItem.classList.add('aside__right-block');

          const p = document.createElement('p');
          p.innerHTML = `${item} &DDotrahd; ${this[item]}`;

          const btnDelete = document.createElement('button');
          btnDelete.classList.add('aside__right-btn');
          btnDelete.addEventListener('click', (e) => (deleteElem(e, nameObject)));

          contItem.append(p);
          contItem.append(btnDelete);
          asideRightItems.append(contItem);

        }, res[nameObject]);

      } else {

        const contItem = document.createElement('div');
        contItem.classList.add('aside__right-block');

        const p = document.createElement('p');
        p.innerHTML = 'нет данных';

        contItem.append(p);
        asideRightItems.append(contItem);

      }

    })

    // если ошибка выводим сообщение 'ошибка второго блока' (если сработал .catch выше, то этот тоже обязательно сработает)
    .catch(() => { console.log('ошибка второго блока') })

};



// отправка GET запроса ==> подсчёт и вывод суммы в правую колонку
export const getDataOutputSum = (nameObject) => {

  // функция отправки GET запроса
  const getDataSum = () => fetch(URL_DATA1, {

    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    }

  });

  getDataSum()

    // получаем данные. .json() - декодирует ответ в формате JSON
    .then(res => res.json())

    // если ошибка выводим сообщение 'данных нет'
    .catch(() => {

      asideRightSum.innerHTML = 'сумма не подсчитывается';
      console.log('данных нет');

    })

    // перебираем полученный объект по значению и подсчитываем сумму. создаем параграф и вставляем в него сумму, затем вставляем параграф в правую колонку
    .then(res => {

      let sum = 0;

      // проверяем содержится ли имя 'nameObject' в пришедшем объекте 'res'
      if (Object.keys(res).includes(nameObject)) {

        Object.values(res[nameObject]).forEach(item => {
          sum += item;
        }, res[nameObject]);

      }

      let h4 = document.createElement('h4');
      h4.innerHTML = `Сумма = ${sum}`;
      asideRightSum.append(h4);

    })

    // если ошибка выводим сообщение 'ошибка второго блока' (если сработал .catch выше, то этот тоже обязательно сработает)
    .catch(() => { console.log('ошибка получения и подсчёта суммы') })

};



// отправка GET запроса ==> подсчёт и вывод общей суммы в правую колонку
export const getDataOutputSumTotal = () => {

  // функция отправки GET запроса
  const getDataSumTotal = () => fetch(URL_DATA_TOTAL, {

    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    }

  });

  getDataSumTotal()

    // получаем данные. .json() - декодирует ответ в формате JSON
    .then(res => res.json())

    // если ошибка выводим сообщение 'данных нет'
    .catch(() => {

      totalsum.innerHTML = 'Сумма всех расходов ⤏&nbsp;0';
      console.log('данных нет');

    })

    // перебираем полученный объект по значению. внутри значения также перебираем по значению и суммируем
    .then(res => {

      let sum = 0;

      Object.values(res).forEach(objectItems => {
        Object.values(objectItems).forEach(item => {
          sum += item;
        }, objectItems)
      }, res);

      totalsum.innerHTML = `Сумма всех расходов ⤑&nbsp;${sum}`;

    })

    // если ошибка выводим сообщение в консоль (если сработал .catch выше, то этот тоже обязательно сработает)
    .catch(() => { console.log('ошибка получения и подсчёта общей суммы') })

};



// отправка GET запроса ==> очистка файла json, удаление всех данных
export const getTotalDelete = () => {

  // функция отправки GET запроса
  const totalDelete = () => fetch(URL_DEL_TOTAL, {

    headers: {
      'Content-Type': 'text/plain; charset=UTF-8',
    }

  });

  totalDelete()

    // получаем ответ
    .then(res => res.text())
    .then(res => {

      asideRightMessage.textContent = res
      console.log(res)

    })

    // если ошибка выводим сообщение 'данных нет'
    .catch(() => { console.log('ошибка при удалении всех данных') })

};



// отправка POST запроса для передачи введённых данных и времени ввода
export const postDataWrapp = (nameObject, inpExpense) => {

  // функция отправки POST запроса
  const postData = (nameObject, inpExpense) => fetch(URL_SAVE, {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },

    // передаём необходимые данные (имя объекта, дату и время, введенную сумму) в массиве
    body: JSON.stringify([nameObject, new Date().toLocaleString(), +inpExpense.value])

  });

  postData(nameObject, inpExpense)

    // получаем ответ сервера
    .then(res => res.text())
    .then(res => console.log(res))

    .catch(() => { console.log('произощла ошибка отправки данных') })

};



// отправка POST запроса для удаления элемента
export const postDataDelWrapp = (bodyContent) => {

  // функция отправки POST запроса
  const postDataDel = (bodyContent) => fetch(URL_DEL, {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },

    // передаём необходимые данные (имя объекта, дату и время, введенную сумму) в массиве
    body: JSON.stringify(bodyContent)

  });

  postDataDel(bodyContent)

    // получаем ответ сервера
    .then(res => res.text())
    .then(res => console.log(res))

    .catch(() => { console.log('произощла ошибка POSTdel запроса') })

};



// отправка POST запроса ==> экспорт всех данных в файл
export const postExport = () => {

  const arrayBtnExpenseItemsJs = [];

  // собираем в массив названия кнопок расходов, чтобы передать его на сервер для формирования отчета
  btnExpenseItemsJs.forEach((item, index) => {
    arrayBtnExpenseItemsJs.push(btnExpenseItemsJs[index].children[0].textContent);
  });

  // функция отправки POST запроса
  const exportInFile = () => fetch(URL_EXPORT, {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },

    // передаём массив c названиями кнопок левой панели
    body: JSON.stringify(arrayBtnExpenseItemsJs)

  });

  exportInFile()

    // получаем ответ сервера
    .then(res => res.text())
    .then(res => {

      asideRightMessage.textContent = res;
      console.log(res);

    })

    // если ошибка выводим сообщение 'ошибка при экспорте'
    .catch(() => { console.log('ошибка при экспорте') })
};



// отправка POST запроса ==> переименование кнопки расхода
export const btnRename = (arrNameInd) => {

  const postBtnRename = () => fetch(BTN_RENAME, {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },

    // передаём введенное название кнопки левой панели
    body: JSON.stringify(arrNameInd)

  });

  postBtnRename()

    // получаем ответ сервера
    .then(res => res.text())
    .then(res => {

      asideRightMessage.textContent = res;
      console.log(res);

    })

    // если ошибка выводим сообщение 'ошибка при экспорте'
    .catch(() => { console.log('ошибка при экспорте') })

};
