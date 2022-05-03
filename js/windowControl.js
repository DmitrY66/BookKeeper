'use strict';

export const winControl = () => {

  const html = document.querySelector('html');
  const headerModalSwitch = document.querySelector('.header__modal-switch');
  const headerLogo = document.querySelector('.header__logo');
  const controlRefresh = document.querySelector('.control_refresh');
  const controlMin = document.querySelector('.control_min');
  const controlMax = document.querySelector('.control_max');
  const controlClose = document.querySelector('.control_close');

  let positionXmin = screen.availWidth - 104;
  let positionYmin = screen.availHeight - 104;
  let positionXnorm = screen.availWidth / 2 - 600;
  let positionYnorm = screen.availHeight / 2 - 500;

  // перезагузить окно
  controlRefresh.addEventListener('click', () => {

    location.reload();

  });

  // свернуть и восстановить окно
  controlMin.addEventListener('click', () => {

    window.resizeTo(100, 100);

    window.moveTo(positionXmin, positionYmin);

    html.style.overflow = 'hidden';
    headerModalSwitch.style.display = 'block';
    headerLogo.classList.remove('webkit_app_region');

    headerModalSwitch.addEventListener('click', () => {

      if (screen.availHeight <= 1000) {
        window.resizeTo(1200, screen.availHeight);
        window.moveTo(positionXnorm, 0);
        html.style.overflow = 'auto';
        headerModalSwitch.style.display = 'none';
        headerLogo.classList.add('webkit_app_region');
      } else {
        window.resizeTo(1200, 1000);
        window.moveTo(positionXnorm, positionYnorm);
        html.style.overflow = 'auto';
        headerModalSwitch.style.display = 'none';
        headerLogo.classList.add('webkit_app_region');
      }

    });

  });

  // развернуть окно во весь экран и обратно
  controlMax.addEventListener('click', () => {

    if (document.body.clientWidth !== screen.width) {

      window.moveTo(0, 0);
      top.window.resizeTo(screen.availWidth, screen.availHeight);


    } else {

      if (screen.availHeight <= 1000) {
        window.resizeTo(1200, screen.availHeight);
        window.moveTo(positionXnorm, 0);
      } else {
        window.resizeTo(1200, 1000);
        window.moveTo(positionXnorm, positionYnorm);
      }

    }

  });
  controlClose.addEventListener('click', () => {

    window.close();

  });

};




