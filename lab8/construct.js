"use strict";

// Инициализация страницы "Собрать ланч"
function initConstructPage() {
    const categories = ["soup", "main", "drink", "salads", "desserts"];
    const stickyPanel = document.getElementById("sticky-order-panel");
    const currentOrderTotal = document.getElementById("current-order-total");
    const goToOrderBtn = document.getElementById("go-to-order-btn");
    
    // Загружаем текущий заказ
    let currentOrder = getCurrentOrder();
    
    // Функция обновления отображения
    function updateDisplay() {
        let sum = 0;
        
        // Обновляем выделение карточек и подсчитываем сумму
        categories.forEach(category => {
            const dishKeyword = currentOrder[category];
            if (dishKeyword) {
                // Находим карточку блюда и выделяем ее
                const cards = document.querySelectorAll(`.meal-map[data-category="${category}"]`);
                cards.forEach(card => {
                    if (card.dataset.dish === dishKeyword) {
                        card.classList.add('selected');
                        const button = card.querySelector('button');
                        
                        // Находим блюдо для подсчета суммы
                        const dish = window.dishes.find(d => d.keyword === dishKeyword);
                        if (dish) {
                            sum += dish.price;
                        }
                    } else {
                        card.classList.remove('selected');
                        const button = card.querySelector('button');
                        if (button) {
                            button.textContent = 'Добавить';
                        }
                    }
                });
            } else {
                // Снимаем выделение со всех карточек этой категории
                const cards = document.querySelectorAll(`.meal-map[data-category="${category}"]`);
                cards.forEach(card => {
                    card.classList.remove('selected');
                    const button = card.querySelector('button');
                });
            }
        });
        
        // Обновляем sticky-панель
        if (Object.keys(currentOrder).length > 0) {
            stickyPanel.style.display = 'block';
            currentOrderTotal.textContent = `${sum} ₽`;
            currentOrderTotal.style.color = '#000'; // Черный цвет
            
            // Проверяем валидность комбо для активации кнопки
            if (checkComboValidity()) {
                goToOrderBtn.classList.remove('disabled');
                goToOrderBtn.style.pointerEvents = 'auto';
                goToOrderBtn.style.opacity = '1';
                goToOrderBtn.style.backgroundColor = '#000'; // Черный цвет
                goToOrderBtn.style.color = 'white';
            } else {
                goToOrderBtn.classList.add('disabled');
                goToOrderBtn.style.pointerEvents = 'none';
                goToOrderBtn.style.opacity = '0.5';
                goToOrderBtn.style.backgroundColor = '#ccc';
                goToOrderBtn.style.color = '#666';
            }
        } else {
            stickyPanel.style.display = 'none';
        }
    }
    
    // Инициализация обработчиков для кнопок "Добавить"
    document.addEventListener('click', function(e) {
        if (e.target.closest('.meal-map button')) {
            const btn = e.target.closest('.meal-map button');
            const div = e.target.closest('.meal-map');
            const dishKeyword = div.dataset.dish;
            const category = div.dataset.category;
            
            // Находим объект блюда
            const dish = window.dishes.find(function(x) { 
                return x.keyword === dishKeyword; 
            });
            
            if (!dish) return;
            
            // Проверяем, не выбрано ли уже блюдо этой категории
            const currentDish = currentOrder[category];
            
            if (currentDish === dishKeyword) {
                // Если уже выбрано, убираем выделение и удаляем из заказа
                div.classList.remove("selected");
                currentOrder = removeFromOrder(category);
                btn.textContent = 'Добавить';
            } else {
                // Снимаем выделение с предыдущего блюда этой категории
                if (currentDish) {
                    const prevCard = document.querySelector(
                        `.meal-map[data-category="${category}"][data-dish="${currentDish}"]`
                    );
                    if (prevCard) {
                        prevCard.classList.remove("selected");
                        const prevButton = prevCard.querySelector('button');
                        if (prevButton) {
                            prevButton.textContent = 'Добавить';
                        }
                    }
                }
                
                // Добавляем новое блюдо
                div.classList.add("selected");
                currentOrder = addToOrder(category, dish);
            }
            
            updateDisplay();
        }
    });
    
    // Инициализация при загрузке страницы
    updateDisplay();
}

// Запускаем инициализацию после загрузки DOM и блюд
document.addEventListener("DOMContentLoaded", function () {
    if (typeof loadDishes === 'function') {
        loadDishes().then(function () {
            if (typeof renderDishes === 'function') {
                renderDishes();
            }
            initConstructPage();
        });
    }
});