document.addEventListener('DOMContentLoaded', () => {

    const tabs = document.querySelectorAll('.tabheader__item'), // Получаем все вкладки
          tabsContent = document.querySelectorAll('.tabcontent'), // Получаем весь контент
          tabsParent = document.querySelector('.tabheader__items'); // Получаем родителя всех вкладок

    // TABS

    // Скрываем весь контент на сайте
    function hideTabContent() { 
        tabsContent.forEach(item => {
            item.style.display = 'none';
        });

        tabs.forEach(item => { // Удаляем класс активности вкладки
            item.classList.remove('tabheader__item_active');
        });
    }


    // Показываем табы
    function showTabContent(i = 0) { // i - номер таба который нам нужно показать
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        const target = e.target;

        if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if(target == item) { // если тот элемент на который кликнули будет совпадать с тем который мы перебираем в цикле forEach (если это один и тот же элемент) то мы вызываем 2 функции скрытия и показа табов
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // TIMER

    const deadline = '2020-08-01';

    // Функция получения разницы между дедлайном и текущим временем

    function getTimeRemain(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()), // Date.parse(endtime) - кол-во миллисекунд до которого нам нужно дойти (t - общее кол-во миллисекунд)
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor((t / (1000 * 60 * 60) % 24)), // 1000 - кол-во миллисекунд в одном часе ((t / 1000 * 60 * 60) - общее кол-во часов до дедлайна)
              minutes = Math.floor((t / 1000 / 60) % 60),
              seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num){
        if(num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemain(endtime); // В переменную t записывается результат работы функции getTimeRemain это обьект с разными свойствами и величинами

            days.textContent = getZero(t.days);
            hours.textContent = getZero(t.hours);
            minutes.textContent = getZero(t.minutes);
            seconds.textContent = getZero(t.seconds);
            
            if(t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }
    
    setClock('.timer', deadline);
});