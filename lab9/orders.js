"use strict";

const API_KEY = "96326ceb-d317-435d-936d-68d3002346a4";
const API_BASE_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api";
let allDishes = [];
let allOrders = [];

// Инициализация страницы
document.addEventListener('DOMContentLoaded', function () {
    updateNavigation();
    loadAllData();
    setupEventListeners();
});

function updateNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === 'orders.html') {
            link.classList.add('active');
        }
    });
}

async function loadAllData() {
    showLoading();

    try {
        await loadDishes();
        await loadOrders();

        if (allOrders.length > 0) {
            renderOrders();
        } else {
            showEmptyState();
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        showErrorState();
    }
}

async function loadDishes() {
    try {
        const response = await fetch(`${API_BASE_URL}/dishes?api_key=${API_KEY}`);
        if (!response.ok) throw new Error(`Ошибка загрузки блюд: ${response.status}`);
        allDishes = await response.json();
    } catch (error) {
        console.error('Ошибка загрузки блюд:', error);
    }
}

async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders?api_key=${API_KEY}`);
        if (!response.ok) throw new Error(`Ошибка загрузки заказов: ${response.status}`);
        allOrders = await response.json();
        allOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
        throw error;
    }
}

function renderOrders() {
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'orders-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>№</th>
                <th>Дата оформления</th>
                <th>Состав заказа</th>
                <th>Стоимость</th>
                <th>Время доставки</th>
                <th>Действия</th>
            </tr>
        </thead>
        <tbody id="orders-tbody"></tbody>
    `;

    ordersList.appendChild(table);
    const tbody = document.getElementById('orders-tbody');

    allOrders.forEach((order, index) => {
        const row = document.createElement('tr');
        const dishNames = getDishNames(order);
        const deliveryTime = getDeliveryTimeText(order);
        const totalPrice = calculateOrderTotal(order);

        // Создаем полный список блюд с переносами строк
        const dishesHTML = dishNames.map(dish =>
            `<div style="margin-bottom: 4px;">${dish}</div>`
        ).join('');

        row.innerHTML = `
            <td class="order-number">${index + 1}</td>
            <td class="order-date" style="white-space: nowrap;">${formatDate(order.created_at)}</td>
            <td class="order-items">
                ${dishesHTML}
            </td>
            <td class="order-total">${totalPrice} ₽</td>
            <td class="order-delivery-time" style="white-space: nowrap;">${deliveryTime}</td>
            <td class="order-actions">
                <button class="action-btn view" data-order-id="${order.id}" title="Подробнее">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="action-btn edit" data-order-id="${order.id}" title="Редактировать">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="action-btn delete" data-order-id="${order.id}" title="Удалить">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });

    hideLoading();
    ordersList.style.display = 'block';
}

function getDishNames(order) {
    const dishNames = [];
    const dishIds = [
        order.soup_id,
        order.main_course_id,
        order.salad_id,
        order.drink_id,
        order.dessert_id
    ];

    dishIds.forEach(id => {
        if (id) {
            const dish = allDishes.find(d => d.id === id);
            if (dish) dishNames.push(dish.name);
        }
    });

    return dishNames;
}

function calculateOrderTotal(order) {
    let total = 0;
    const dishIds = [
        order.soup_id,
        order.main_course_id,
        order.salad_id,
        order.drink_id,
        order.dessert_id
    ];

    dishIds.forEach(id => {
        if (id) {
            const dish = allDishes.find(d => d.id === id);
            if (dish) total += dish.price;
        }
    });

    return total;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getDeliveryTimeText(order) {
    if (order.delivery_type === 'now') {
        return 'Как можно скорее (с 7:00 до 23:00)';
    } else if (order.delivery_type === 'by_time' && order.delivery_time) {
        // Форматирование времени чч:мм
        const [hours, minutes] = order.delivery_time.split(':');
        return `${hours}:${minutes}`;
    }
    return 'Не указано';
}

function showLoading() {
    document.getElementById('orders-loading').style.display = 'block';
    document.getElementById('orders-empty').style.display = 'none';
    document.getElementById('orders-error').style.display = 'none';
    document.getElementById('orders-list').style.display = 'none';
}

function hideLoading() {
    document.getElementById('orders-loading').style.display = 'none';
}

function showEmptyState() {
    hideLoading();
    document.getElementById('orders-empty').style.display = 'block';
}

function showErrorState() {
    hideLoading();
    document.getElementById('orders-error').style.display = 'block';
}

function setupEventListeners() {
    // Кнопка повторной загрузки
    document.getElementById('retry-load-btn')?.addEventListener('click', loadAllData);

    // Модальные окна
    setupModalHandlers();

    // Обработчики действий с заказами
    document.getElementById('orders-list')?.addEventListener('click', handleOrderActions);

    // Обработчики форм
    setupFormHandlers();
}

function setupModalHandlers() {
    // Закрытие по клику на крестик
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Закрытие по клику на кнопки "ОК" и "Отмена"
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    window.addEventListener('click', function (event) {
        if (event.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
}

function handleOrderActions(event) {
    const target = event.target.closest('.action-btn');
    if (!target) return;

    const orderId = target.getAttribute('data-order-id');
    const order = allOrders.find(o => o.id == orderId);

    if (!order) return;

    if (target.classList.contains('view')) {
        showOrderDetails(order);
    } else if (target.classList.contains('edit')) {
        showEditOrderForm(order);
    } else if (target.classList.contains('delete')) {
        showDeleteConfirmation(order);
    }
}

function showOrderDetails(order) {
    const modal = document.getElementById('order-details-modal');
    const content = document.getElementById('order-details-content');

    let total = 0;
    const items = [];

    const orderMap = [
        { key: 'main_course_id', label: 'Основное блюдо' },
        { key: 'soup_id', label: 'Суп' },
        { key: 'salad_id', label: 'Салат/Стартер' },
        { key: 'drink_id', label: 'Напиток' },
        { key: 'dessert_id', label: 'Десерт' }
    ];

    orderMap.forEach(item => {
        if (order[item.key]) {
            const dish = allDishes.find(d => d.id === order[item.key]);
            if (dish) {
                items.push(`${item.label}: ${dish.name} (${dish.price}Р)`);
                total += dish.price;
            }
        }
    });

    let deliveryTimeDisplay;
    if (order.delivery_type === 'now') {
        deliveryTimeDisplay = 'Как можно скорее';
    } else if (order.delivery_type === 'by_time' && order.delivery_time) {
        const [hours, minutes] = order.delivery_time.split(':');
        deliveryTimeDisplay = `${hours}:${minutes}`;
    } else {
        deliveryTimeDisplay = 'Не указано';
    }

    content.innerHTML = `
        <div class="order-view">
            <div class="date-section">
                <h4 style="display: inline;">Дата оформления</h4>
                <span class="regular-text" style="margin-left: 10px;">${formatDate(order.created_at)}</span>
            </div>
            
            <h4>Доставка</h4>
            <table class="no-border-table">
                <tr>
                    <td><strong>Имя получателя</strong></td>
                    <td class="regular-text">${order.full_name}</td>
                </tr>
                <tr>
                    <td><strong>Адрес доставки</strong></td>
                    <td class="regular-text">${order.delivery_address}</td>
                </tr>
                <tr>
                    <td><strong>Время доставки</strong></td>
                    <td class="regular-text">${deliveryTimeDisplay}</td>
                </tr>
                <tr>
                    <td><strong>Телефон</strong></td>
                    <td class="regular-text">${order.phone}</td>
                </tr>
                <tr>
                    <td><strong>Email</strong></td>
                    <td class="regular-text">${order.email}</td>
                </tr>
            </table>

            ${order.comment ? `
                <h4>Комментарий</h4>
                <p class="comment regular-text">${order.comment}</p>
            ` : ''}

            <h4>Состав заказа</h4>
            <table class="no-border-table">
                ${items.map(item => `
                    <tr>
                        <td><strong>${item.split(':')[0]}</strong></td>
                        <td class="regular-text">${item.split(':')[1]}</td>
                    </tr>
                `).join('')}
            </table>

            <hr>
            <p class="total"><strong>Стоимость: ${total}Р</strong></p>
        </div>
    `;

    modal.style.display = 'block';
}

function showEditOrderForm(order) {
    const modal = document.getElementById('edit-order-modal');
    const content = document.getElementById('edit-modal-content');

    let total = 0;
    const items = [];

    const orderMap = [
        { key: 'main_course_id', label: 'Основное блюдо' },
        { key: 'soup_id', label: 'Суп' },
        { key: 'salad_id', label: 'Салат/Стартер' },
        { key: 'drink_id', label: 'Напиток' },
        { key: 'dessert_id', label: 'Десерт' }
    ];

    orderMap.forEach(item => {
        if (order[item.key]) {
            const dish = allDishes.find(d => d.id === order[item.key]);
            if (dish) {
                items.push(`${item.label}: ${dish.name} (${dish.price}Р)`);
                total += dish.price;
            }
        }
    });

    let deliveryTimeValue = '';
    if (order.delivery_type === 'by_time' && order.delivery_time) {
        const [hours, minutes] = order.delivery_time.split(':');
        deliveryTimeValue = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    }

    content.innerHTML = `
        <div class="modal-header">
            <h3>Редактирование заказа</h3>
            <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
            <div class="order-view">
                <div class="date-section">
                    <h4 style="display: inline;">Дата оформления</h4>
                    <span class="regular-text" style="margin-left: 10px;">${formatDate(order.created_at)}</span>
                </div>
                
                <div class="order-section">
                    <h4>Доставка</h4>
                    <form id="edit-order-form">
                        <input type="hidden" id="edit-order-id" value="${order.id}">
                        
                        <table class="no-border-table">
                            <tr>
                                <td><strong>Имя получателя</strong></td>
                                <td><input type="text" id="edit-full-name" value="${order.full_name}" required class="regular-text"></td>
                            </tr>
                            <tr>
                                <td><strong>Адрес доставки</strong></td>
                                <td><input type="text" id="edit-delivery-address" value="${order.delivery_address}" required class="regular-text"></td>
                            </tr>
                            <tr>
                                <td><strong>Тип доставки</strong></td>
                                <td>
                                    <div class="radio-group">
                                        <label class="regular-text">
                                            <input type="radio" name="delivery_type" value="now" 
                                                   ${order.delivery_type === 'now' ? 'checked' : ''}>
                                            Как можно скорее
                                        </label><br>
                                        <label class="regular-text">
                                            <input type="radio" name="delivery_type" value="by_time"
                                                   ${order.delivery_type === 'by_time' ? 'checked' : ''}>
                                            Ко времени
                                        </label>
                                    </div>
                                </td>
                            </tr>
                            <tr id="delivery-time-row" style="${order.delivery_type === 'now' ? 'display: none;' : ''}">
                                <td><strong>Время доставки</strong></td>
                                <td><input type="time" id="edit-delivery-time" 
                                           value="${deliveryTimeValue}" 
                                           min="07:00" max="23:00" step="300"
                                           class="regular-text"></td>
                            </tr>
                            <tr>
                                <td><strong>Телефон</strong></td>
                                <td><input type="tel" id="edit-phone" value="${order.phone}" required class="regular-text"></td>
                            </tr>
                            <tr>
                                <td><strong>Email</strong></td>
                                <td><input type="email" id="edit-email" value="${order.email}" required class="regular-text"></td>
                            </tr>
                        </table>
                    </form>
                </div>
                
                <div class="order-section">
                    <h4>Комментарий</h4>
                    <textarea id="edit-comment" rows="3" class="full-width regular-text">${order.comment || ''}</textarea>
                </div>
                
                <div class="order-section">
                    <h4>Состав заказа</h4>
                    <table class="no-border-table">
                        ${items.map(item => `
                            <tr>
                                <td><strong>${item.split(':')[0]}</strong></td>
                                <td class="regular-text">${item.split(':')[1].trim()}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
                
                <hr>
                <p class="total"><strong>Стоимость: ${total}Р</strong></p>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn-secondary close-modal-btn">Отмена</button>
            <button type="button" id="save-order-btn" class="btn-primary">Сохранить</button>
        </div>
    `;

    // Обработчики
    const closeBtn = content.querySelector('.close-modal');
    const closeModalBtn = content.querySelector('.close-modal-btn');
    const saveBtn = content.querySelector('#save-order-btn');

    closeBtn.addEventListener('click', closeAllModals);
    closeModalBtn.addEventListener('click', closeAllModals);
    saveBtn.addEventListener('click', handleSaveOrder);

    // Обработчик изменения типа доставки
    const deliveryTypeRadios = content.querySelectorAll('input[name="delivery_type"]');
    const deliveryTimeRow = content.querySelector('#delivery-time-row');

    deliveryTypeRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            deliveryTimeRow.style.display = this.value === 'by_time' ? 'table-row' : 'none';
        });
    });

    modal.style.display = 'block';
}

function showDeleteConfirmation(order) {
    const modal = document.getElementById('delete-order-modal');
    document.getElementById('delete-order-id').value = order.id;
    modal.style.display = 'block';
}

function setupFormHandlers() {
    // Обработчик сохранения заказа
    document.addEventListener('click', function (event) {
        if (event.target.id === 'save-order-btn') {
            handleSaveOrder();
        }
    });

    // Обработчик удаления заказа
    document.getElementById('confirm-delete-btn').addEventListener('click', handleDeleteOrder);
}

async function handleSaveOrder() {
    const orderId = document.getElementById('edit-order-id').value;
    const formData = getEditFormData();

    try {
        await updateOrder(orderId, formData);
        showNotification('Заказ успешно изменён', 'success');
        closeAllModals();
        await reloadOrders();
    } catch (error) {
        showNotification(`Ошибка при изменении заказа: ${error.message}`, 'error');
    }
}

async function handleDeleteOrder() {
    const orderId = document.getElementById('delete-order-id').value;

    try {
        await deleteOrder(orderId);
        showNotification('Заказ успешно удалён', 'success');
        closeAllModals();
        await reloadOrders();
    } catch (error) {
        showNotification(`Ошибка при удалении заказа: ${error.message}`, 'error');
    }
}

function getEditFormData() {
    const form = document.querySelector('#edit-order-form');
    const data = {};

    data.full_name = document.getElementById('edit-full-name').value.trim();
    data.email = document.getElementById('edit-email').value.trim();
    data.phone = document.getElementById('edit-phone').value.trim();
    data.delivery_address = document.getElementById('edit-delivery-address').value.trim();

    const commentInput = document.getElementById('edit-comment');
    data.comment = commentInput ? commentInput.value.trim() : '';

    const deliveryType = form.querySelector('input[name="delivery_type"]:checked');
    data.delivery_type = deliveryType.value;

    if (data.delivery_type === 'by_time') {
        const deliveryTime = document.getElementById('edit-delivery-time').value;
        if (!deliveryTime) {
            throw new Error('Укажите время доставки');
        }
        data.delivery_time = deliveryTime;
    } else {
        data.delivery_time = null;
    }

    return data;
}

async function updateOrder(orderId, data) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}?api_key=${API_KEY}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
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

async function deleteOrder(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}?api_key=${API_KEY}`, {
            method: 'DELETE'
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

async function reloadOrders() {
    showLoading();

    try {
        await loadOrders();

        if (allOrders.length > 0) {
            renderOrders();
        } else {
            showEmptyState();
        }
    } catch (error) {
        console.error('Ошибка перезагрузки заказов:', error);
        showErrorState();
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function showNotification(message, type = 'info') {
    // Удаление предыдущих уведомлений
    const existingNotification = document.querySelector('.notification-overlay');
    if (existingNotification) {
        existingNotification.remove();
    }

    // ССоздание нового уведомления
    const notification = document.createElement('div');
    notification.className = `notification-overlay ${type}`;

    const notificationContent = document.createElement('div');
    notificationContent.className = 'notification-content';
    notificationContent.textContent = message;

    notification.appendChild(notificationContent);
    document.body.appendChild(notification);

    // Скрываем через 3 сек
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}