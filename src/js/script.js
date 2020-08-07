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
          modalTrigger = document.querySelectorAll('[data-modal]'),
          modalClose = document.querySelector('[data-close]');


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
    modalClose.addEventListener('click', closeModal);
    

    modal.addEventListener('click', (e)=> {
        if(e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown',(e)=> {
        if(e.code === "Escape") {
            closeModal();
        }
    });
    // Показ модального окна через определенный промежуток времени
    // const modalTimer = setTimeout(showModal, 15000); 

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
    new MenuCard(
        "img/tabs/vegy.jpg",
        'vegy',
        'Меню "Фитнес"',
        9,
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        '.menu .container'
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        'elite',
        'Меню “Премиум”',
        13,
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        '.menu .container'
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        'post',
        'Меню "Постное"',
        7,
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        '.menu .container'
    ).render();

    // FORMS

    const forms = document.querySelectorAll('form'); // Получаем все элементы по тегу form

    const message = {  // Статус отправки данных
        loading: "Загрузка",
        success: "Спасибо! Мы скоро с вами свяжемся",
        failure: "Произошла ошибка"
    };

    // Под все формы подвязываем функцию postData
    forms.forEach(item => {
        postData(item);
    });

    // Функция которая будет отвечать за постинг данных
    function postData(form) {   // функция принимает в себя аргумент(форму)
        form.addEventListener('submit', (e) => {
            e.preventDefault(); //отменяем стандартное поведение браузера

            const statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.textContent = message.loading;
            form.append(statusMessage);

            const request = new XMLHttpRequest();

            request.open('POST', 'server.php');

            // при связке XMLHTTPRequest и formData заголовок устанавливается автоматически поэтому здесь он не нужен
            // request.setRequestHeader('Content-type', 'multipart/form-data'); 

            // Для отправки данных в формате JSON

            // request.setRequestHeader('Content-type', 'application/json');
            // const formData = new FormData(form);
            // const object = {};
            // formData.forEach(function(value, key){
            //     object[key] = value;
            // });
            // const json = JSON.stringify(object);
            // request.send(json);

            const formData = new FormData(form); //внутрь передаем форму с которой нужно собрать информацию

            request.send(formData);  // отправляем данные

            request.addEventListener('load', ()=> {
                if(request.status === 200){
                    console.log(request.response);
                    statusMessage.textContent = message.success;
                    form.reset();
                    setTimeout(()=> {
                        statusMessage.remove();
                    },2000);
                } else {
                    statusMessage.textContent = message.failure;
                }
            });
        });

    }
});