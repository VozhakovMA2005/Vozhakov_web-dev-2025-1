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
            createNotification(`Ошибка загрузки меню: ${error.message}`);
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
    
    const totalElem = document.getElementById('sum');
    totalElem.textContent = `${totalPrice} ₽`;
    totalElem.style.color = '#000';
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

    const combo1 = hasSoup && hasMain && hasSalad && hasDrink;     // суп, главное, салат, напиток
    const combo2 = hasSoup && hasMain && hasDrink && !hasSalad;    // суп, главное, напиток
    const combo3 = hasSoup && hasSalad && hasDrink && !hasMain;    // суп, салат, напиток
    const combo4 = hasMain && hasSalad && hasDrink && !hasSoup;    // главное, салат, напиток
    const combo5 = hasMain && hasDrink && !hasSoup && !hasSalad;   // главное, напиток

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
        
        const responseText = await response.text();
        let result;
        
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            throw new Error(`Сервер вернул некорректный ответ`);
        }
        
        if (!response.ok) {
            if (result.error) {
                throw new Error(result.error);
            } else {
                throw new Error(`Ошибка сервера ${response.status}`);
            }
        }
        
        return result;
    } catch (error) {
        throw error;
    }
}

function validateDeliveryTime(deliveryTime) {
    if (!deliveryTime) return "Укажите время доставки";
    
    const time = new Date(`1970-01-01T${deliveryTime}:00`);
    const minTime = new Date('1970-01-01T07:00:00');
    const maxTime = new Date('1970-01-01T23:00:00');
    const now = new Date();
    const currentTime = new Date(`1970-01-01T${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`);
    
    if (time < minTime || time > maxTime) {
        return "Время доставки должно быть с 7:00 до 23:00";
    }
    
    if (time < currentTime) {
        return "Время доставки не может быть раньше текущего времени";
    }
    
    return null;
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
        deliveryTimeInput.required = false;
        
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
        
        document.getElementById('reset').addEventListener('click', function() {
            setTimeout(() => {
                updateOrderForm();
            }, 100);
        });
        
        if (form) {
            form.addEventListener('submit', async function(event) {
                event.preventDefault();
                
                if (!isValidCombo()) {
                    createNotification("Заказ не соответствует ни одному из доступных комбо. Пожалуйста, выберите блюда в соответствии с комбо.");
                    return;
                }
                
                if (this.delivery_type.value === 'by_time') {
                    const validationError = validateDeliveryTime(this.delivery_time.value);
                    if (validationError) {
                        createNotification(validationError);
                        return;
                    }
                }
                
                const formData = {
                    full_name: this.full_name.value.trim(),
                    email: this.email.value.trim(),
                    subscribe: this.subscribe.checked ? 1 : 0,
                    phone: this.phone.value.trim(),
                    delivery_address: this.delivery_address.value.trim(),
                    delivery_type: this.delivery_type.value,
                    comment: this.comment.value ? this.comment.value.trim() : ''
                };
                
                if (this.delivery_type.value === 'by_time') {
                    formData.delivery_time = this.delivery_time.value;
                }
                
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
                
                try {
                    const result = await submitOrder(formData);
                    
                    const orderDetails = `Заказ №${result.id} успешно оформлен!`;
                    createNotification(orderDetails);
                    
                    clearOrder();
                    currentOrder = {};
                    renderOrderItems();
                    updateOrderForm();
                    
                    this.reset();
                    
                    deliveryTimeInput.disabled = true;
                    deliveryTimeInput.required = false;
                    deliveryTimeInput.value = '';
                    
                } catch (error) {
                    createNotification(`Ошибка оформления заказа: ${error.message}`);
                }
            });
        }
    });
});