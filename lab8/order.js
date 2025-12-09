"use strict";

let allDishes = [];
let currentOrder = {};

// Загрузка данных о блюдах
function loadOrderDishes() {
    const url = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            allDishes = data;
            return data;
        })
        .catch(error => {
            console.error('Ошибка загрузки блюд:', error);
            return [];
        });
}

// Отображение состава заказа в левой колонке (карточки)
function renderOrderItems() {
    const container = document.getElementById('order-items-container');
    const emptyMessage = document.getElementById('empty-order-message');
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    if (Object.keys(currentOrder).length === 0) {
        emptyMessage.style.display = 'block';
        container.style.display = 'none';
        return;
    }
    
    emptyMessage.style.display = 'none';
    container.style.display = 'grid';
    
    // Создаем карточки для каждого блюда в заказе
    Object.keys(currentOrder).forEach(category => {
        const dishKeyword = currentOrder[category];
        const dish = allDishes.find(d => d.keyword === dishKeyword);
        
        if (dish) {
            const card = document.createElement('div');
            card.className = 'meal-map';
            card.innerHTML = `
                <img src="${dish.image}" alt="${dish.name}">
                <p class="price">${dish.price}₽</p>
                <p class="name">${dish.name}</p>
                <p class="weight">${dish.count}</p>
                <button type="button" class="remove-btn" data-category="${category}" data-dish="${dishKeyword}">Удалить</button>
            `;
            container.appendChild(card);
        }
    });
    
    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            removeFromOrder(category);
            currentOrder = getCurrentOrder();
            renderOrderItems();
            updateOrderForm();
        });
    });
}

// Обновление формы в правой колонке
function updateOrderForm() {
    const orderCart = document.getElementById('order-cart');
    const nothingChosen = document.getElementById('nothing-chosen');
    let totalPrice = 0;
    
    // Показываем/скрываем элементы в зависимости от наличия заказа
    if (Object.keys(currentOrder).length === 0) {
        orderCart.style.display = 'none';
        nothingChosen.style.display = 'block';
        document.getElementById('sum').textContent = '0 ₽';
        return;
    } else {
        orderCart.style.display = 'block';
        nothingChosen.style.display = 'none';
    }
    
    const categories = [
        { 
            key: 'soup', 
            selected: 'soup-selected', 
            price: 'soup-price',
            hidden: 'soup-select',
            defaultText: 'Суп не выбран'
        },
        { 
            key: 'main', 
            selected: 'main-course-selected', 
            price: 'main-course-price',
            hidden: 'main-course-select',
            defaultText: 'Блюдо не выбрано'
        },
        { 
            key: 'salads', 
            selected: 'salad-selected', 
            price: 'salad-price',
            hidden: 'salad-select',
            defaultText: 'Блюдо не выбрано'
        },
        { 
            key: 'drink', 
            selected: 'drink-selected', 
            price: 'drink-price',
            hidden: 'drink-select',
            defaultText: 'Напиток не выбран'
        },
        { 
            key: 'desserts', 
            selected: 'dessert-selected', 
            price: 'dessert-price',
            hidden: 'dessert-select',
            defaultText: 'Десерт не выбран'
        }
    ];
    
    // Обновляем данные по каждой категории
    categories.forEach(cat => {
        const selectedElem = document.getElementById(cat.selected);
        const priceElem = document.getElementById(cat.price);
        const hiddenField = document.getElementById(cat.hidden);
        
        if (currentOrder[cat.key]) {
            const dish = allDishes.find(d => d.keyword === currentOrder[cat.key]);
            if (dish) {
                selectedElem.textContent = dish.name;
                priceElem.textContent = `${dish.price} ₽`;
                if (hiddenField) hiddenField.value = dish.id;
                totalPrice += dish.price;
                selectedElem.style.color = '#000';
                priceElem.style.color = '#000';
            }
        } else {
            selectedElem.textContent = cat.defaultText;
            priceElem.textContent = '0 ₽';
            if (hiddenField) hiddenField.value = '';
            selectedElem.style.color = '#666';
            priceElem.style.color = '#666';
        }
    });
    
    // Обновляем итоговую стоимость
    const totalElem = document.getElementById('sum');
    totalElem.textContent = `${totalPrice} ₽`;
    totalElem.style.color = '#000';
}

// Проверка комбо по правилам ЛР6
function isValidCombo() {
    const order = currentOrder;
    const hasSoup = !!order.soup;
    const hasMain = !!order.main;
    const hasSalad = !!order.salads;
    const hasDrink = !!order.drink;

    // Должен быть выбран напиток
    if (!hasDrink) {
        return false;
    }

    // Проверяем все возможные комбинации
    const combo1 = hasSoup && hasMain && hasSalad && hasDrink;     // суп, главное, салат, напиток
    const combo2 = hasSoup && hasMain && hasDrink && !hasSalad;    // суп, главное, напиток
    const combo3 = hasSoup && hasSalad && hasDrink && !hasMain;    // суп, салат, напиток
    const combo4 = hasMain && hasSalad && hasDrink && !hasSoup;    // главное, салат, напиток
    const combo5 = hasMain && hasDrink && !hasSoup && !hasSalad;   // главное, напиток

    return combo1 || combo2 || combo3 || combo4 || combo5;
}

// Создание уведомления
function createNotification(text) {
    let notification = document.createElement("div");
    let button = document.createElement("button");
    button.classList.add("notification-button");
    button.innerHTML = 'Ок';
    button.onclick = function (event) {
        event.target.parentElement.remove();
    };
    notification.classList.add("notification");
    notification.innerHTML = `<p class="notification-text">${text}</p>`;
    notification.append(button);
    document.body.append(notification);
}

// Отправка заказа на сервер
async function submitOrder(formData) {
    const apiKey = "ВАШ_API_KEY"; // Замените на ваш API ключ
    const apiUrl = "https://edu.std-900.ist.mospolytech.ru/labs/api/orders";
    
    try {
        const response = await fetch(`${apiUrl}?api_key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка сервера: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Ошибка при отправке заказа:', error);
        throw error;
    }
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем заказ из localStorage
    currentOrder = getCurrentOrder();
    
    // Загружаем данные о блюдах
    loadOrderDishes().then(() => {
        renderOrderItems();
        updateOrderForm();
        
        // Настраиваем форму
        const form = document.getElementById('order-form');
        const deliveryTimeInput = document.getElementById('delivery-time');
        const deliveryTypeRadios = document.querySelectorAll('input[name="delivery_type"]');
        
        // Скрываем поле времени доставки по умолчанию
        deliveryTimeInput.disabled = true;
        deliveryTimeInput.required = false;
        
        // Обработка переключения типа доставки
        deliveryTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'now') {
                    deliveryTimeInput.disabled = true;
                    deliveryTimeInput.required = false;
                    deliveryTimeInput.value = '';
                } else {
                    deliveryTimeInput.disabled = false;
                    deliveryTimeInput.required = true;
                }
            });
        });
        
        // Обработка сброса формы
        document.getElementById('reset').addEventListener('click', function() {
            // Только сбрасываем поля формы, не заказ
            setTimeout(() => {
                // После сброса формы восстанавливаем сводку заказа
                updateOrderForm();
            }, 100);
        });
        
        // Обработка отправки формы
        if (form) {
            form.addEventListener('submit', async function(event) {
                event.preventDefault();
                
                // Проверка комбо
                if (!isValidCombo()) {
                    createNotification("Заказ не соответствует ни одному из доступных комбо. Пожалуйста, выберите блюда в соответствии с комбо.");
                    return;
                }
                
                // Проверка времени доставки
                if (form.delivery_type.value === 'by_time') {
                    const deliveryTime = form.delivery_time.value;
                    if (!deliveryTime) {
                        createNotification("Укажите время доставки");
                        return;
                    }
                    
                    // Проверка времени
                    const time = new Date(`1970-01-01T${deliveryTime}:00`);
                    const minTime = new Date('1970-01-01T07:00:00');
                    const maxTime = new Date('1970-01-01T23:00:00');
                    const now = new Date();
                    const currentTime = new Date(`1970-01-01T${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`);
                    
                    if (time < minTime || time > maxTime) {
                        createNotification("Время доставки должно быть с 7:00 до 23:00");
                        return;
                    }
                    
                    if (time < currentTime) {
                        createNotification("Время доставки не может быть раньше текущего времени");
                        return;
                    }
                }
                
                // Подготовка данных формы
                const formData = {
                    full_name: form.full_name.value,
                    email: form.email.value,
                    subscribe: form.subscribe.checked ? 1 : 0,
                    phone: form.phone.value,
                    delivery_address: form.delivery_address.value,
                    delivery_type: form.delivery_type.value,
                    comment: form.comment.value || ''
                };
                
                // Добавляем время доставки, если выбрано "by_time"
                if (form.delivery_type.value === 'by_time') {
                    formData.delivery_time = form.delivery_time.value;
                }
                
                // Добавляем ID блюд, если они есть в заказе
                if (currentOrder.soup) {
                    const dish = allDishes.find(d => d.keyword === currentOrder.soup);
                    if (dish) formData.soup_id = dish.id;
                }
                if (currentOrder.main) {
                    const dish = allDishes.find(d => d.keyword === currentOrder.main);
                    if (dish) formData.main_course_id = dish.id;
                }
                if (currentOrder.salads) {
                    const dish = allDishes.find(d => d.keyword === currentOrder.salads);
                    if (dish) formData.salad_id = dish.id;
                }
                if (currentOrder.drink) {
                    const dish = allDishes.find(d => d.keyword === currentOrder.drink);
                    if (dish) formData.drink_id = dish.id;
                }
                if (currentOrder.desserts) {
                    const dish = allDishes.find(d => d.keyword === currentOrder.desserts);
                    if (dish) formData.dessert_id = dish.id;
                }
                
                // Удаляем пустые поля
                Object.keys(formData).forEach(key => {
                    if (formData[key] === null || formData[key] === '' || formData[key] === undefined) {
                        delete formData[key];
                    }
                });
                
                // Отправка на сервер
                try {
                    const result = await submitOrder(formData);
                    createNotification("Заказ успешно оформлен!");
                    
                    // Очищаем localStorage после успешной отправки
                    clearOrder();
                    currentOrder = {};
                    renderOrderItems();
                    updateOrderForm();
                    form.reset();
                    
                } catch (error) {
                    createNotification("Ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.");
                    console.error('Детали ошибки:', error);
                }
            });
        }
    });
});