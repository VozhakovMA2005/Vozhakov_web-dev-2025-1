"use strict";

let allDishes = [];
let currentOrder = {};

function loadOrderDishes() {
    const apiKey = "96326ceb-d317-435d-936d-68d3002346a4";
    const url = `https://edu.std-900.ist.mospolytech.ru/labs/api/dishes?api_key=${apiKey}`;
    
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allDishes = data;
            return data;
        })
        .catch(error => {
            console.error('Ошибка загрузки блюд:', error);
            return [];
        });
}

function renderOrderItems() {
    const container = document.getElementById('order-items-container');
    const emptyMessage = document.getElementById('empty-order-message');
    
    container.innerHTML = '';
    
    if (Object.keys(currentOrder).length === 0) {
        emptyMessage.style.display = 'block';
        container.style.display = 'none';
        return;
    }
    
    emptyMessage.style.display = 'none';
    container.style.display = 'grid';
    
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

function updateOrderForm() {
    const orderCart = document.getElementById('order-cart');
    const nothingChosen = document.getElementById('nothing-chosen');
    let totalPrice = 0;
    
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
            }
        } else {
            selectedElem.textContent = cat.defaultText;
            priceElem.textContent = '0 ₽';
            if (hiddenField) hiddenField.value = '';
        }
    });
    
    document.getElementById('sum').textContent = `${totalPrice} ₽`;
}

function isValidCombo() {
    const order = currentOrder;
    const hasSoup = !!order.soup;
    const hasMain = !!order.main;
    const hasSalad = !!order.salads;
    const hasDrink = !!order.drink;

    if (!hasDrink) {
        return false;
    }

    const combo1 = hasSoup && hasMain && hasSalad && hasDrink;
    const combo2 = hasSoup && hasMain && hasDrink && !hasSalad;
    const combo3 = hasSoup && hasSalad && hasDrink && !hasMain;
    const combo4 = hasMain && hasSalad && hasDrink && !hasSoup;
    const combo5 = hasMain && hasDrink && !hasSoup && !hasSalad;

    return combo1 || combo2 || combo3 || combo4 || combo5;
}

function createNotification(text) {
    document.querySelectorAll('.notification').forEach(el => el.remove());
    
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
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

async function submitOrder(formData) {
    const apiKey = "96326ceb-d317-435d-936d-68d3002346a4";
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
            const error = await response.json();
            throw new Error(error.error || `Ошибка сервера ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    currentOrder = getCurrentOrder();
    
    loadOrderDishes().then(() => {
        renderOrderItems();
        updateOrderForm();
        
        const form = document.getElementById('order-form');
        const deliveryTimeInput = document.getElementById('delivery-time');
        const deliveryTypeRadios = document.querySelectorAll('input[name="delivery_type"]');
        
        deliveryTimeInput.disabled = true;
        
        deliveryTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'now') {
                    deliveryTimeInput.disabled = true;
                    deliveryTimeInput.value = '';
                } else {
                    deliveryTimeInput.disabled = false;
                }
            });
        });
        
        if (form) {
            form.addEventListener('submit', async function(event) {
                event.preventDefault();
                
                // Проверка комбо 
                if (!isValidCombo()) {
                    createNotification("Заказ не соответствует ни одному из доступных комбо. Пожалуйста, выберите блюда в соответствии с комбо.");
                    return;
                }
                
                // Проверка времени доставки для типа "by_time"
                if (this.delivery_type.value === 'by_time' && !this.delivery_time.value) {
                    createNotification("Укажите время доставки");
                    return;
                }
                
                // Подготовка данных формы
                const formData = {
                    full_name: this.full_name.value.trim(),
                    email: this.email.value.trim(),
                    subscribe: this.subscribe.checked ? 1 : 0,
                    phone: this.phone.value.trim(),
                    delivery_address: this.delivery_address.value.trim(),
                    delivery_type: this.delivery_type.value,
                    comment: this.comment.value ? this.comment.value.trim() : ''
                };
                
                // Добавляем время доставки, если выбрано "by_time"
                if (this.delivery_type.value === 'by_time') {
                    formData.delivery_time = this.delivery_time.value;
                }
                
                // Добавляем ID блюд из текущего заказа
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
                
                // Отправка на сервер
                try {
                    const result = await submitOrder(formData);
                    
                    // Успешное оформление
                    createNotification(`Заказ №${result.id} успешно оформлен!`);
                    
                    // Очищаем localStorage после успешной отправки
                    clearOrder();
                    currentOrder = {};
                    renderOrderItems();
                    updateOrderForm();
                    
                    // Сбрасываем форму с проверкой
                    try {
                        if (form && typeof form.reset === 'function') {
                            form.reset();
                        } else if (this && typeof this.reset === 'function') {
                            this.reset();
                        }
                    } catch (resetError) {
                        console.warn('Не удалось сбросить форму:', resetError);
                    }
                    
                } catch (error) {
                    createNotification(`Ошибка оформления заказа: ${error.message}`);
                }
            });
        }
    });
});