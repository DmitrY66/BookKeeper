'use strict';

const { app, BrowserWindow, screen } = require('electron');

// ========== серверная часть ==========
const http = require('http');
const fs = require('fs');
const path = require('path');


// отключаем аппаратное ускорение (из-за ошибки "[10444:0331/135000.551:ERROR:gpu_init.cc(446)] Passthrough is not supported, GL is disabled, ANGLE is")
app.disableHardwareAcceleration();

let mainWindow = null;

const createWindow = (heightScreen) => {

  mainWindow = new BrowserWindow({
    width: 1200,
    height: heightScreen,
    frame: false,
    icon: path.join(__dirname, './img/icon.png'),

  });

  // так страница тоже загрузится
  // mainWindow.loadFile('index.html');

  // так загрузится страница
  mainWindow.loadURL('http://localhost:2200/');

  // открывает панель разработчика
  // mainWindow.webContents.openDevTools();

  // слушаем событие 'closed' и выполняем действие
  mainWindow.on('closed', () => {

    mainWindow = null;

  });
};


// когда app прочитан создаем окно программы
app.whenReady().then(() => {

  // получаем параметры начального экрана
  const primaryDisplay = screen.getPrimaryDisplay();

  // из параметров начального экрана получаем высоту
  const { height } = primaryDisplay.workAreaSize;

  if (height <= 1000) {

    // запускаем функцию создания окна и передаем туда высоту экрана
    createWindow(heightScreen);

  } else {

    // запускаем функцию создания окна и передаем туда высоту экрана
    createWindow(1000);

  }

});


// если пользователь не на 'mac', закрываем программу при всех закрытых окнах
app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') app.quit();

});







// ========== серверная часть ==========


const PORT //= введите номер вашего порта;


// функция чтения файла
const sendResContent = (url, contentType, res) => {
  let file = path.join(__dirname, url);
  fs.readFile(file, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.write('введен не существующий адрес');
      res.end();
      console.log(`errorische 404 ${file}`);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.write(content);
      res.end();
    }
  })
};


// определяем тип сонтента при запросе к серверу
const getContentType = (url) => {
  switch (path.extname(url)) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    case '.json':
      return 'application/json';
    case '.ico':
      return 'image/x-icon';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octate-stream';
  }
}


// сервер
http.createServer((req, res) => {


  // если запрос GET
  if (req.method === 'GET') {

    switch (req.url) {

      // если запрос = (GET)'/' (т.е главная страница), читаем файл html и отдаем броузеру контент, затем браузер отрисоввывает html 
      case '/':
        sendResContent('./index.html', 'text/html', res);
        break;

      // если запрос = (GET)'/getdata1', читаем файл json и отдаем  его содержимое в ответе
      case '/getdata1':
        sendResContent('./data/data1.json', 'application/json', res);
        break;

      // если запрос = (GET)'/getdatatotal', читаем файл json и отдаем  его содержимое в ответе
      case '/getdatatotal':
        sendResContent('./data/data1.json', 'application/json', res);
        break;

      // если запрос = (GET)'/getdatatotal', очищаем файл json и отдаем овет о результате
      case '/deletetotal':
        // очищаем файл
        fs.truncate(path.join(__dirname, './data/data1.json'), (err) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
            res.write('не удалось очистить файл');
            res.end();
            console.log('не удалось очистить файл');

          } else {
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
            res.write('данные успешно очищены');
            res.end();
            console.log('данные успешно очищены');
          }
        });
        break;

      // при отрисовке html браузер делает запросы согласно подключаемым файлам css, js, а также подключаемым шрифтам и картинкам. типы файлов определяются автоматически функцией getContentType(req.url)
      default:
        sendResContent(req.url, getContentType(req.url), res);
    }
  }


  // если запрос POST
  else if (req.method === 'POST') {

    let fileJsonContent = {};

    switch (req.url) {

      // если запрос = (POST)'/save'
      case '/save':

        let bodySave = '';

        // принимаем в bodySave запрос и записываем его чанками
        req.on('data', chunk => {

          bodySave += chunk;

          // парсим в массив полученную в bodySave строку 
          let newPost = JSON.parse(bodySave);

          // читаем файл json
          fs.readFile(path.join(__dirname, './data/data1.json'), 'utf8', (err, data) => {

            if (err) {

              res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
              res.write('не удалось прочитать файл json');
              res.end();
              console.log('не удалось прочитать файл json');
              throw err;

            } else {

              // если data есть, 
              if (data) {

                // парсим, полученные при чтении файла './data/data1.json' данные, в объект 'fileJsonContent'
                fileJsonContent = JSON.parse(data);

                // достаем ключи из объекта 'fileJsonContent' ключи и добавляем их в массив 'nameObjElems'
                let nameObjElems = Object.keys(fileJsonContent);

                // проверяем содержит ли массив 'nameObjElems' значение 'newPost[0]'
                if (nameObjElems.includes(newPost[0])) {

                  // вставляем в объект fileJsonContent полученные данные (имя объекта, дату и время, введенную сумму) 
                  fileJsonContent[newPost[0]][newPost[1]] = newPost[2];

                  // записываем обновленный объект в файл JSON и сообщаем клиенту
                  fs.writeFile(path.join(__dirname, './data/data1.json'), JSON.stringify(fileJsonContent), (err) => {
                    if (err) {

                      res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
                      res.write('не удалось сохранить введенные данные');
                      res.end();
                      console.log('не удалось сохранить введенные данные');

                    } else {

                      res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
                      res.write('введенные данные успешно сохранены');
                      res.end();
                      console.log('введенные данные успешно сохранены');

                    }
                  });

                } else {

                  // если массив 'nameObjElems' не содержит значение 'newPost[0], просто вставляем в объект fileJsonContent полученные данные (имя объекта, дату и время, введенную сумму)
                  fileJsonContent[newPost[0]] = { [newPost[1]]: newPost[2] };

                  // записываем обновленный объект в файл JSON и сообщаем результат клиенту
                  fs.writeFile(path.join(__dirname, './data/data1.json'), JSON.stringify(fileJsonContent), (err) => {
                    if (err) {

                      res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
                      res.write('не удалось сохранить введенные данные');
                      res.end();
                      console.log('не удалось сохранить введенные данные');

                    } else {

                      res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
                      res.write('введенные данные успешно сохранены');
                      res.end();
                      console.log('введенные данные успешно сохранены');

                    }
                  })

                }

              } else {

                // если data отсутствует, присваиваем пустому объекту 'fileJsonContent = {}' полученные данные (имя объекта, дату и время, введенную сумму)
                fileJsonContent = { [newPost[0]]: { [newPost[1]]: newPost[2] } }

                // записываем объект 'fileJsonContent' в файл JSON (теперь data есть) и сообщаем клиенту 
                fs.writeFile(path.join(__dirname, './data/data1.json'), JSON.stringify(fileJsonContent), (err) => {
                  if (err) {

                    res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
                    res.write('не удалось сохранить введенные данные');
                    res.end();
                    console.log('не удалось сохранить введенные данные');

                  } else {

                    res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
                    res.write('введенные данные успешно сохранены');
                    res.end();
                    console.log('введенные данные успешно сохранены');

                  }

                })

              }

            }

          })

        })
        break;


      // если запрос = (POST)'/delete'
      case '/delete':

        let bodyDel = '';

        // принимаем body запроса и записываем его чанками
        req.on('data', chunk => {

          bodyDel += chunk;

          // удаляем из строки фигурные скобки
          let postDelete = bodyDel.slice(1, -1);

          // читаем файл JSON
          fs.readFile(path.join(__dirname, './data/data1.json'), 'utf8', (err, data) => {

            if (err) {

              res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
              res.write('не удалось прочитать файл json');
              res.end();
              console.log('не удалось прочитать файл json');
              throw err;

            } else {

              // data всегда есть, парсим, полученные при чтении файла './data/data1.json' данные, в объект fileJsonContent
              fileJsonContent = JSON.parse(data);

              // перебираем объект fileJsonContent, находим совпадение с переданными данными и удаляем элемент объекта совпадающий с ними
              for (let keyI in fileJsonContent) {

                let keyName = keyI;
                keyI = fileJsonContent[keyI];

                for (let keyJ in keyI) {
                  let compare = '"' + keyJ + '"' + ':' + keyI[keyJ];

                  if (compare === postDelete) {

                    delete fileJsonContent[keyName][keyJ]

                  }
                }
              }

              // записываем обновленный объект в файл JSON и сообщаем результат клиенту
              fs.writeFile(path.join(__dirname, './data/data1.json'), JSON.stringify(fileJsonContent), (err) => {
                if (err) {

                  res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
                  res.write('не удалось удалить строку расходов');
                  res.end();
                  console.log('не удалось удалить строку расходов');

                } else {

                  res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
                  res.write('строка расходов удалена успешно');
                  res.end();
                  console.log('строка расходов удалена успешно');

                }
              })

            }

          })

        })

        break;


      // если запрос = (POST)'/exportto'
      case '/exportto':

        let bodyExportto = '';

        // принимаем body запроса и записываем его чанками
        req.on('data', chunk => {

          // переданные данные
          bodyExportto += chunk;

          // массив из переданных данных
          const arrayBodyExportto = JSON.parse(bodyExportto);

          // читаем файл JSON, формируем и записываем данные из него в файл отчета
          fs.readFile(path.join(__dirname, './data/data1.json'), 'utf8', (err, data) => {

            if (err) {

              res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
              res.write('не удалось прочитать файл json');
              res.end();
              console.log('не удалось прочитать файл json');
              throw err;

            } else {

              if (data) {

                // преобразуем в объект данные из json файла
                let convertData = JSON.parse(data);

                // достаем ключи 'cost' из объекта (это пока не нужно)
                // let arrayKeyItem = Object.keys(convertData);
                // console.log('arrayKeyItem: ', arrayKeyItem);

                // достаем значения из объекта
                let convertDataValues = Object.values(convertData);

                // создаем пустой массив чтобы сложить в него суммы по статьям расходов
                let arraySumValItem = [];

                // перебираем массив объектов значений и в каждом считаем сумму. затем каждую сумму добавляем в массив 'arraySumValItem'
                convertDataValues.forEach((dataValue) => {

                  let sumValItem = 0;

                  Object.values(dataValue).forEach(item => {
                    sumValItem += item;
                  });

                  arraySumValItem.push(sumValItem);

                }); // массив 'arraySumValItem' сформирован


                // подсчет общей суммы расходов
                let totalSum = 0;
                arraySumValItem.forEach(item => {
                  totalSum += item;
                })

                // текущий месяц
                let manth = new Date().toLocaleString('default', { month: 'long' });
                // текущий год
                let year = String(new Date().getFullYear());
                // заголовок с названием периода
                let title = `\n Отчет за период ====== ${manth} ${year} ====== \n`;

                // содержание отчета
                let content = `
                сумма расходов статьи ${arrayBodyExportto[0]} = ${arraySumValItem[0]}
  
                сумма расходов статьи ${arrayBodyExportto[1]} = ${arraySumValItem[1]}
  
                сумма расходов статьи ${arrayBodyExportto[2]} = ${arraySumValItem[2]}
  
                сумма расходов статьи ${arrayBodyExportto[3]} = ${arraySumValItem[3]}
  
                сумма расходов статьи ${arrayBodyExportto[4]} = ${arraySumValItem[4]}
  
                сумма расходов статьи ${arrayBodyExportto[5]} = ${arraySumValItem[5]}
  
                сумма расходов статьи ${arrayBodyExportto[6]} = ${arraySumValItem[6]}
  
                сумма расходов статьи ${arrayBodyExportto[7]} = ${arraySumValItem[7]}
  
                сумма расходов статьи ${arrayBodyExportto[8]} = ${arraySumValItem[8]}
  
                сумма расходов статьи ${arrayBodyExportto[9]} = ${arraySumValItem[9]}
  
  
                сумма всех расходов ====== ${totalSum} ======
              `;

                // создаем, если нет, файл "export.txt" и зписывем в него заголовок
                fs.writeFile(path.join(__dirname, '../export.txt'), title, (err) => {

                  if (err) {

                    res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
                    res.write('ошибка записи заголовка');
                    res.end();
                    console.log('ошибка записи заголовка');

                  }
                  else {

                    // добавляем в файл контент отчета
                    fs.appendFile(path.join(__dirname, '../export.txt'), content, (err) => {

                      if (err) {

                        res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
                        res.write('ошибка записи контента');
                        res.end();
                        console.log('ошибка записи контента');

                      }
                      else {

                        res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
                        res.write('файл успешно записан');
                        res.end();
                        console.log('файл успешно записан');

                      }
                    })
                  }
                });


              } else {

                res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
                res.write('читаемый файл data/data1.json абсолютно пуст и экспорт не выполнен');
                res.end();
                console.log('читаемый файл data/data1.json абсолютно пуст и экспорт не выполнен');

              }

            }
          })

        });

        break;


      // если запрос = (POST)'/btnrename'
      case '/btnrename':

        let fileJsonBtnContent = [];
        let bodyBtnrename = '';

        // принимаем body запроса и записываем его чанками
        req.on('data', chunk => {

          // переданные данные
          bodyBtnrename += chunk;

          // массив из переданных данных
          const arrayNewButtonName = JSON.parse(bodyBtnrename);

          fs.readFile(path.join(__dirname, './data/namesBtn.json'), 'utf8', (err, data) => {

            if (err) {

              res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
              res.write('не удалось прочитать файл namesBtn.json');
              res.end();
              console.log('не удалось прочитать файл namesBtn.json');
              throw err;

            } else {

              // парсим, полученные при чтении файла './data/namesBtn.json' данные, в объект 'fileJsonContent'
              fileJsonBtnContent = JSON.parse(data);

              fileJsonBtnContent[arrayNewButtonName[0] - 1] = arrayNewButtonName[1];

              // // записываем обновленный объект в файл JSON и сообщаем клиенту
              fs.writeFile(path.join(__dirname, './data/namesBtn.json'), JSON.stringify(fileJsonBtnContent),

                (err) => {
                  if (err) {

                    res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
                    res.write('новое значение кнопки не сохранено');
                    res.end();
                    console.log('the new button value is not saved');

                  } else {

                    res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
                    res.write('новое значение кнопки успешно сохранено');
                    res.end();
                    console.log('the new button value is successfully saved');

                  }
                });

            }

          });

        });

        break;

    }

  }

}).listen(PORT, (error) => {
  error ? console.log(error)
    : console.log(`Server started / port ${PORT}`);
});
