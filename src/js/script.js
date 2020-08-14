'use strict';
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

    // Modal

    const modal = document.querySelector('.modal'),
          modalTrigger = document.querySelectorAll('[data-modal]');


    function showModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimer); // При открытии пользователем модального окна, оно не будет повторно всплывать
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    modalTrigger.forEach(item => {
        item.addEventListener('click', showModal);
    });
    

    modal.addEventListener('click', (e)=> {
        if(e.target === modal || e.target.getAttribute('data-close') == "") { 
            closeModal();
        }
    });

    document.addEventListener('keydown',(e)=> {
        if(e.code === "Escape") {
            closeModal();
        }
    });
    // Показ модального окна через определенный промежуток времени
    const modalTimer = setTimeout(showModal, 15000); 

    // функция показа модального окна при пролистывании страницы до конца
    function showModalByScroll() {
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            showModal();
            window.removeEventListener('scroll', showModalByScroll); // удаляем обработчик событий чтобы при каждом пролистывании до конца модальное окно не открывалось
        }
    }


    window.addEventListener('scroll', showModalByScroll);

    // Используем классы для карточек

    class MenuCard {
        constructor(src, alt, title, price, descr, parentSelector){
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.price = price;
            this.descr = descr;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');
            element.innerHTML = `
                <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    const getResource = async (url) => { // когда вызываем postData передаем url который дальше передается в fetch; data - данные которые будут поститься
        const res = await fetch(url);

        if(!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });


    // getResource('http://localhost:3000/menu')
    //     .then(data => createCard(data));

    // function createCard(data) {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         const element = document.createElement('div');

    //         element.classList.add("menu__item");

    //         element.innerHTML = `
    //             <img src=${img} alt=${altimg}>
    //             <h3 class="menu__item-subtitle">${title}</h3>
    //             <div class="menu__item-descr">${descr}</div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">Цена:</div>
    //                 <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //             </div>
    //         `;
    //         document.querySelector(".menu .container").append(element);
    //     });
    // }
    
    // FORMS

    const forms = document.querySelectorAll('form'); // Получаем все элементы по тегу form

    const message = {  // Статус отправки данных
        loading: "img/spinner/spinner.svg",
        success: "Спасибо! Мы скоро с вами свяжемся",
        failure: "Произошла ошибка"
    };

    // Под все формы подвязываем функцию postData
    forms.forEach(item => {
        bindPostData(item);
    });

    // Функция которая будет отвечать за постинг данных
    const postData = async (url, data) => { // когда вызываем postData передаем url который дальше передается в fetch; data - данные которые будут поститься
        const res = await fetch(url , {
            method:'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: data
        });
        return await res.json();
    };

    
    // Функция которая будет отвечать за привязку постинга
    function bindPostData(form) {   // функция принимает в себя аргумент(форму)
        form.addEventListener('submit', (e) => {
            e.preventDefault(); //отменяем стандартное поведение браузера

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display:block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form); //внутрь передаем форму с которой нужно собрать информацию

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('server.php', json)
            .then(data => { // data данные которые вернул сервер
                console.log(data.response);
                showThanksModal(message.success);                       
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(()=> { // действия вне зависимости как прошел запрос
                form.reset();
            })
        });

    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');

        showModal();

        const thanksModal = document.createElement('div');

        thanksModal.classList.add('modal__dialog');

        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);

        setTimeout(()=> {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        },4000);
    }

    // Получим доступ к базе данных
    fetch('http://localhost:3000/menu')
        .then(data => data.json()) // Полученный ответ от сервера(данные) - data, превратим в обычный js обьект
        .then(res => console.log(res)); // Выведем результат который получили


    // SLIDER


    const slides = document.querySelectorAll('.offer__slide'), // Получаем все слайды
          prev = document.querySelector('.offer__slider-prev'), // Получаем стрелки
          next = document.querySelector('.offer__slider-next'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current');
    
    let slideIndex = 1; // Текущее положение слайдера

    showSlides(slideIndex);

    if(slides.length > 10) {
        total.textContent = `0${slides.length}`;
    } else {
        total.textContent = slides.length;
    }

    // Функция по показу и скрытию сладов

    function showSlides(n) { // n - это slideIndex
        if(n > slides.length) { // Если n будет больше чем наше количество слайдов
            slideIndex = 1;
        }

        if(n < 1) { // Если n будет меньше чем количество слайдов
            slideIndex = slides.length; // То мы перемещаемся в конец слайдов
        }

        slides.forEach(item => { // скроем все слайды
            item.style.display = 'none';
        });

        slides[slideIndex - 1].style.display = 'block'; // Показываем нужный слайд

        if(slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    }

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    prev.addEventListener('click', ()=> {
        plusSlides(-1);
    });
    next.addEventListener('click', ()=> {
        plusSlides(1);
    });
});