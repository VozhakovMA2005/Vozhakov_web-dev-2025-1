const API_KEY = '96326ceb-d317-435d-936d-68d3002346a4';
const API_URL_GOODS = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods';
const API_URL_ORDERS = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders';

let allOrders = [];
let productsMap = new Map();
let currentDeleteId = null;

const tableBody = document.getElementById('orders-tbody');
const loader = document.getElementById('loader');
const notificationArea = document.getElementById('notification-area');
const notificationAlert = document.getElementById('notification-alert');
const notificationText = document.getElementById('notification-text');

let viewModal, editModal, deleteModal;

document.addEventListener('DOMContentLoaded', async () => {
    viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
    editModal = new bootstrap.Modal(document.getElementById('editModal'));
    deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    await productRequest();
    loadOrders();
});

async function productRequest() {
    try {
        const response = await fetch(`${API_URL_GOODS}?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Ошибка загрузки товаров');
        const goods = await response.json();
        
        goods.forEach(item => {
            productsMap.set(item.id, item);
        });
    } catch (error) {
        console.error(error);
        showNotification('Не удалось загрузить каталог товаров', 'danger');
    }
}

async function loadOrders() {
    loader.style.display = 'block';
    tableBody.innerHTML = '';
    
    try {
        const response = await fetch(`${API_URL_ORDERS}?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Ошибка загрузки заказов');
        
        allOrders = await response.json();
        
        allOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        renderTable();
    } catch (error) {
        console.error(error);
        showNotification('Не удалось загрузить список заказов', 'danger');
    } finally {
        loader.style.display = 'none';
    }
}

function renderTable() {
    tableBody.innerHTML = '';
    
    if (allOrders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Заказов нет</td></tr>';
        return;
    }

    allOrders.forEach((order, index) => {
        const dateObj = new Date(order.created_at);
        const formattedDate = dateObj.toLocaleDateString('ru-RU') + ' ' + dateObj.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
        
        const { productNames, totalPrice: goodsPrice } = getOrderDetails(order.good_ids);

        let calcDate = order.delivery_date;
        let displayDeliveryDate = order.delivery_date;

        if (order.delivery_date.includes('-')) {
             displayDeliveryDate = order.delivery_date.split('-').reverse().join('.');
        } 
        else if (order.delivery_date.includes('.')) {
             calcDate = order.delivery_date.split('.').reverse().join('-');
        }

        const deliveryPrice = getDeliveryCost(calcDate, order.delivery_interval);
        const finalPrice = goodsPrice + deliveryPrice;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td data-label="№">${index + 1}</td>
            <td data-label="Дата оформления">${formattedDate}</td>
            <td data-label="Состав заказа">${truncateString(productNames, 50)}</td>
            <td data-label="Стоимость">${finalPrice} ₽</td>
            <td data-label="Доставка">${displayDeliveryDate}<br>${order.delivery_interval}</td>
            <td data-label="Действия">
                <i class="bi bi-eye fs-5 me-2 action-icon" onclick="openViewModal(${order.id})" title="Просмотр"></i>
                <i class="bi bi-pencil fs-5 me-2 action-icon" onclick="openEditModal(${order.id})" title="Редактирование"></i>
                <i class="bi bi-trash3 fs-5 action-icon" onclick="openDeleteModal(${order.id})" title="Удаление"></i>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function getOrderDetails(goodIds) {
    let names = [];
    let price = 0;
    
    goodIds.forEach(id => {
        const product = productsMap.get(id);
        if (product) {
            names.push(product.name);
            price += (product.discount_price || product.actual_price); 
        }
    });  
    return { 
        productNames: names.join(', '), 
        totalPrice: price
    };
}

function truncateString(str, num) {
    if (str.length <= num) return str;
    return str.slice(0, num) + '...';
}

function openViewModal(id) {
    const order = allOrders.find(o => o.id === id);
    if (!order) return;

    const { productNames, totalPrice: goodsPrice } = getOrderDetails(order.good_ids);
    const dateObj = new Date(order.created_at);
    
    document.getElementById('view-date').textContent = dateObj.toLocaleDateString('ru-RU') + ' ' + dateObj.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
    document.getElementById('view-name').textContent = order.full_name;
    document.getElementById('view-phone').textContent = order.phone;
    document.getElementById('view-email').textContent = order.email;
    document.getElementById('view-address').textContent = order.delivery_address;
    
    let dDate = order.delivery_date;
    let calcDate = order.delivery_date;

    if(dDate.includes('-')) {
        dDate = dDate.split('-').reverse().join('.');
    } else if (dDate.includes('.')) {
        calcDate = dDate.split('.').reverse().join('-');
    }

    document.getElementById('view-delivery-date').textContent = dDate;
    document.getElementById('view-delivery-interval').textContent = order.delivery_interval;
    document.getElementById('view-goods').textContent = productNames;
    
    const deliveryPrice = getDeliveryCost(calcDate, order.delivery_interval);
    const finalPrice = goodsPrice + deliveryPrice;

    document.getElementById('view-cost').textContent = finalPrice + ' ₽';
    document.getElementById('view-comment').textContent = order.comment || '-';

    viewModal.show();
}

function openEditModal(id) {
    const order = allOrders.find(o => o.id === id);

    if (!order) return;

    document.getElementById('edit-id').value = order.id;

    const dateObj = new Date(order.created_at);

    document.getElementById('edit-created-at').textContent = dateObj.toLocaleDateString('ru-RU') + ' ' + dateObj.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
    document.getElementById('edit-name').value = order.full_name;
    document.getElementById('edit-phone').value = order.phone;
    document.getElementById('edit-email').value = order.email;
    document.getElementById('edit-address').value = order.delivery_address;
    
    let isoDate = order.delivery_date;

    if (isoDate.includes('.')) {
        isoDate = isoDate.split('.').reverse().join('-');
    }

    const dateInput = document.getElementById('edit-delivery-date');
    dateInput.value = isoDate;
    const intervalInput = document.getElementById('edit-delivery-interval');
    intervalInput.value = order.delivery_interval;
    document.getElementById('edit-comment').value = order.comment || '';
    const { productNames, totalPrice: goodsPrice } = getOrderDetails(order.good_ids);
    document.getElementById('edit-goods').textContent = productNames;

    const updateCost = () => {
        const currentDeliveryCost = getDeliveryCost(dateInput.value, intervalInput.value);
        const finalPrice = goodsPrice + currentDeliveryCost;
        document.getElementById('edit-cost').textContent = finalPrice + ' ₽';
    };

    dateInput.onchange = updateCost;
    intervalInput.onchange = updateCost;
    updateCost();
    editModal.show();
}

async function saveOrder() {
    const id = document.getElementById('edit-id').value;
    const rawDate = document.getElementById('edit-delivery-date').value;
    const formattedDate = rawDate.split('-').reverse().join('.');

    const data = {
        full_name: document.getElementById('edit-name').value,
        phone: document.getElementById('edit-phone').value,
        email: document.getElementById('edit-email').value,
        delivery_address: document.getElementById('edit-address').value,
        delivery_date: formattedDate,
        delivery_interval: document.getElementById('edit-delivery-interval').value,
        comment: document.getElementById('edit-comment').value
    };

    try {
        const response = await fetch(`${API_URL_ORDERS}/${id}?api_key=${API_KEY}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showNotification('Заказ успешно изменен', 'success');
            editModal.hide();
            loadOrders();
        } else {
            showNotification('Ошибка при сохранении', 'danger');
        }
    } catch (error) {
        console.error(error);
        showNotification('Ошибка сети', 'danger');
    }
}

function openDeleteModal(id) {
    currentDeleteId = id;
    deleteModal.show();
}

async function confirmDelete() {
    if (!currentDeleteId) return;

    try {
        const response = await fetch(`${API_URL_ORDERS}/${currentDeleteId}?api_key=${API_KEY}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showNotification('Заказ успешно удален', 'success');
            deleteModal.hide();
            loadOrders();
        } else {
            showNotification('Ошибка при удалении', 'danger');
        }
    } catch (error) {
        console.error(error);
        showNotification('Ошибка сети', 'danger');
    }
}

function showNotification(msg, type = 'success') {
    notificationText.textContent = msg;
    notificationAlert.className = `alert alert-${type} alert-dismissible fade show rounded-0 mb-0 text-center`;
    
    notificationArea.style.display = 'block';

    setTimeout(() => {
        notificationArea.style.display = 'none';
    }, 5000);
}

function getDeliveryCost(dateStr, interval) {
    let deliveryCost = 200;

    if (dateStr) {
        const date = new Date(dateStr);
        const day = date.getDay();
        const isWeekend = (day === 0 || day === 6);

        if (isWeekend) {
            deliveryCost += 300;
        } else if (interval === '18:00-22:00') {
            deliveryCost += 200;
        }
    }
    
    return deliveryCost;
}

window.openViewModal = openViewModal;
window.openEditModal = openEditModal;
window.saveOrder = saveOrder;
window.openDeleteModal = openDeleteModal;
window.confirmDelete = confirmDelete;