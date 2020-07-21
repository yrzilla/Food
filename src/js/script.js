document.addEventListener('DOMContentLoaded', () => {

    const tabs = document.querySelectorAll('.tabheader__item'), // Получаем все вкладки
          tabsContent = document.querySelectorAll('.tabcontent'), // Получаем весь контент
          tabsParent = document.querySelector('.tabheader__items'); // Получаем родителя всех вкладок

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
});