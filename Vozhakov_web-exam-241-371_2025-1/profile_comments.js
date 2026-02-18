// === КОНСТАНТЫ И НАСТРОЙКИ ===
const API_KEY = '96326ceb-d317-435d-936d-68d3002346a4';
const API_URL_GOODS = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods';
const API_URL_ORDERS = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders';

// === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ (STATE) ===
let allOrders = []; // Хранит массив всех заказов, полученных с сервера
// Map используется для оптимизации. Вместо поиска по массиву (медленно),
// мы будем мгновенно получать данные товара по его ID: productsMap.get(id)
let productsMap = new Map(); 
let currentDeleteId = null; // Временная переменная для хранения ID заказа, который хотим удалить

// === ЭЛЕМЕНТЫ DOM (Кэшируем ссылки на элементы, чтобы не искать их каждый раз) ===
const tableBody = document.getElementById('orders-tbody'); // Тело таблицы, куда будем вставлять строки
const loader = document.getElementById('loader'); // Индикатор загрузки (спиннер)
const notificationArea = document.getElementById('notification-area'); // Блок уведомлений
const notificationAlert = document.getElementById('notification-alert'); // Сам алерт
const notificationText = document.getElementById('notification-text'); // Текст алерта

// Переменные для Bootstrap модальных окон
let viewModal, editModal, deleteModal;

// === ИНИЦИАЛИЗАЦИЯ ===
// Срабатывает, когда HTML полностью построен
document.addEventListener('DOMContentLoaded', async () => {
    // Инициализируем модальные окна Bootstrap (чтобы можно было делать .show() и .hide())
    viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
    editModal = new bootstrap.Modal(document.getElementById('editModal'));
    deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    // ВАЖНО: Сначала ждем загрузки товаров (await), только потом загружаем заказы.
    // Если загрузить заказы раньше, мы не сможем узнать названия товаров по их ID.
    await productRequest(); 
    loadOrders();
});

// === ЗАГРУЗКА ТОВАРОВ (Справочник) ===
async function productRequest() {
    try {
        const response = await fetch(`${API_URL_GOODS}?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Ошибка загрузки товаров');
        const goods = await response.json();
        
        // Превращаем массив товаров в Map: Key = ID товара, Value = Весь объект товара
        goods.forEach(item => {
            productsMap.set(item.id, item);
        });
    } catch (error) {
        console.error(error);
        showNotification('Не удалось загрузить каталог товаров', 'danger');
    }
}

// === ЗАГРУЗКА ЗАКАЗОВ ===
async function loadOrders() {
    loader.style.display = 'block'; // Показываем спиннер
    tableBody.innerHTML = '';       // Очищаем таблицу перед загрузкой
    
    try {
        const response = await fetch(`${API_URL_ORDERS}?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Ошибка загрузки заказов');
        
        allOrders = await response.json();
        
        // Сортировка: Новые заказы сверху.
        // Превращаем строки даты в объекты Date и вычитаем (b - a дает убывание)
        allOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        renderTable(); // Рисуем таблицу
    } catch (error) {
        console.error(error);
        showNotification('Не удалось загрузить список заказов', 'danger');
    } finally {
        // finally выполняется всегда, была ошибка или нет
        loader.style.display = 'none'; // Скрываем спиннер
    }
}

// === ОТРИСОВКА ТАБЛИЦЫ ===
function renderTable() {
    tableBody.innerHTML = ''; // Очистка
    
    if (allOrders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Заказов нет</td></tr>';
        return;
    }

    // Проходим по каждому заказу и создаем строку таблицы <tr>
    allOrders.forEach((order, index) => {
        // Форматирование даты создания (из ISO строки в "15.01.2024 14:30")
        const dateObj = new Date(order.created_at);
        const formattedDate = dateObj.toLocaleDateString('ru-RU') + ' ' + dateObj.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
        
        // Получаем названия товаров и сумму через вспомогательную функцию
        const { productNames, totalPrice: goodsPrice } = getOrderDetails(order.good_ids);

        // --- ЛОГИКА ОБРАБОТКИ ДАТЫ ДОСТАВКИ ---
        // Проблема: сервер может вернуть дату как '2024-01-30' или '30.01.2024'.
        // Нам нужно привести всё к единому виду для отображения и для расчетов.
        let calcDate = order.delivery_date; // Дата для JS Date (должна быть YYYY-MM-DD)
        let displayDeliveryDate = order.delivery_date; // Дата для глаз (должна быть DD.MM.YYYY)

        if (order.delivery_date.includes('-')) {
            // Если пришло 2024-01-30 -> переворачиваем для красоты в 30.01.2024
             displayDeliveryDate = order.delivery_date.split('-').reverse().join('.');
        } 
        else if (order.delivery_date.includes('.')) {
             // Если пришло 30.01.2024 -> переворачиваем для расчетов в 2024-01-30
             calcDate = order.delivery_date.split('.').reverse().join('-');
        }

        // Считаем цену доставки (выходные/вечер)
        const deliveryPrice = getDeliveryCost(calcDate, order.delivery_interval);
        const finalPrice = goodsPrice + deliveryPrice; // Итоговая цена

        // Создаем HTML строки
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td data-label="№">${index + 1}</td>
            <td data-label="Дата оформления">${formattedDate}</td>
            <td data-label="Состав заказа">${truncateString(productNames, 50)}</td> <td data-label="Стоимость">${finalPrice} ₽</td>
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

// === ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: ПОЛУЧЕНИЕ ДЕТАЛЕЙ ЗАКАЗА ===
function getOrderDetails(goodIds) {
    let names = [];
    let price = 0;
    
    goodIds.forEach(id => {
        // ВОТ ГДЕ ИСПОЛЬЗУЕТСЯ MAP: Мгновенный поиск товара по ID
        const product = productsMap.get(id);
        if (product) {
            names.push(product.name);
            // Если есть скидочная цена, берем её, иначе обычную
            price += (product.discount_price || product.actual_price); 
        }
    });  
    return { 
        productNames: names.join(', '), // "Ручка, Карандаш"
        totalPrice: price
    };
}

// Функция для обрезки длинного текста (чтобы таблица не раздувалась)
function truncateString(str, num) {
    if (str.length <= num) return str;
    return str.slice(0, num) + '...';
}

// === МОДАЛКА ПРОСМОТРА (VIEW) ===
function openViewModal(id) {
    // Ищем заказ в массиве по ID
    const order = allOrders.find(o => o.id === id);
    if (!order) return;

    // Рассчитываем данные
    const { productNames, totalPrice: goodsPrice } = getOrderDetails(order.good_ids);
    const dateObj = new Date(order.created_at);
    
    // Заполняем поля в модалке (используем textContent для безопасности от XSS)
    document.getElementById('view-date').textContent = dateObj.toLocaleDateString('ru-RU') + ' ' + dateObj.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
    document.getElementById('view-name').textContent = order.full_name;
    document.getElementById('view-phone').textContent = order.phone;
    document.getElementById('view-email').textContent = order.email;
    document.getElementById('view-address').textContent = order.delivery_address;
    
    // Опять нормализация даты для отображения и расчета
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
    document.getElementById('view-comment').textContent = order.comment || '-'; // Если коммента нет, пишем прочерк

    viewModal.show(); // Показываем окно Bootstrap
}

// === МОДАЛКА РЕДАКТИРОВАНИЯ (EDIT) ===
function openEditModal(id) {
    const order = allOrders.find(o => o.id === id);

    if (!order) return;

    // Сохраняем ID заказа в скрытое поле, чтобы потом знать, что сохранять
    document.getElementById('edit-id').value = order.id;

    const dateObj = new Date(order.created_at);

    // Заполняем форму данными (используем .value для input полей)
    document.getElementById('edit-created-at').textContent = dateObj.toLocaleDateString('ru-RU') + ' ' + dateObj.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
    document.getElementById('edit-name').value = order.full_name;
    document.getElementById('edit-phone').value = order.phone;
    document.getElementById('edit-email').value = order.email;
    document.getElementById('edit-address').value = order.delivery_address;
    
    // input type="date" понимает только формат YYYY-MM-DD
    let isoDate = order.delivery_date;
    if (isoDate.includes('.')) {
        isoDate = isoDate.split('.').reverse().join('-');
    }

    const dateInput = document.getElementById('edit-delivery-date');
    dateInput.value = isoDate;
    const intervalInput = document.getElementById('edit-delivery-interval');
    intervalInput.value = order.delivery_interval;
    document.getElementById('edit-comment').value = order.comment || '';
    
    // Получаем цену товаров (она неизменна при редактировании заказа)
    const { productNames, totalPrice: goodsPrice } = getOrderDetails(order.good_ids);
    document.getElementById('edit-goods').textContent = productNames;

    // Функция пересчета цены В РЕАЛЬНОМ ВРЕМЕНИ (внутри модалки)
    const updateCost = () => {
        const currentDeliveryCost = getDeliveryCost(dateInput.value, intervalInput.value);
        const finalPrice = goodsPrice + currentDeliveryCost;
        document.getElementById('edit-cost').textContent = finalPrice + ' ₽';
    };

    // Вешаем слушатели: если пользователь меняет дату или интервал в модалке -> цена пересчитывается
    dateInput.onchange = updateCost;
    intervalInput.onchange = updateCost;
    
    // Вызываем один раз сразу, чтобы показать цену при открытии
    updateCost();
    editModal.show();
}

// === СОХРАНЕНИЕ ИЗМЕНЕНИЙ (PUT запрос) ===
async function saveOrder() {
    const id = document.getElementById('edit-id').value;
    const rawDate = document.getElementById('edit-delivery-date').value;
    // Сервер ждет дату в формате DD.MM.YYYY
    const formattedDate = rawDate.split('-').reverse().join('.');

    // Собираем объект для отправки
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
        // Метод PUT используется для обновления данных
        const response = await fetch(`${API_URL_ORDERS}/${id}?api_key=${API_KEY}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showNotification('Заказ успешно изменен', 'success');
            editModal.hide();
            loadOrders(); // Перезагружаем таблицу, чтобы увидеть изменения
        } else {
            showNotification('Ошибка при сохранении', 'danger');
        }
    } catch (error) {
        console.error(error);
        showNotification('Ошибка сети', 'danger');
    }
}

// === УДАЛЕНИЕ (DELETE) ===
function openDeleteModal(id) {
    currentDeleteId = id; // Запоминаем ID, который хотим удалить
    deleteModal.show();   // Показываем окно "Вы уверены?"
}

async function confirmDelete() {
    if (!currentDeleteId) return;

    try {
        // Метод DELETE
        const response = await fetch(`${API_URL_ORDERS}/${currentDeleteId}?api_key=${API_KEY}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showNotification('Заказ успешно удален', 'success');
            deleteModal.hide();
            loadOrders(); // Обновляем таблицу
        } else {
            showNotification('Ошибка при удалении', 'danger');
        }
    } catch (error) {
        console.error(error);
        showNotification('Ошибка сети', 'danger');
    }
}

// === УВЕДОМЛЕНИЯ ===
function showNotification(msg, type = 'success') {
    notificationText.textContent = msg;
    // Классы Bootstrap: alert-success (зеленый) или alert-danger (красный)
    notificationAlert.className = `alert alert-${type} alert-dismissible fade show rounded-0 mb-0 text-center`;
    
    notificationArea.style.display = 'block';

    // Авто-скрытие через 5 секунд
    setTimeout(() => {
        notificationArea.style.display = 'none';
    }, 5000);
}

// === ЛОГИКА РАСЧЕТА СТОИМОСТИ ДОСТАВКИ ===
function getDeliveryCost(dateStr, interval) {
    let deliveryCost = 200; // База

    if (dateStr) {
        // Создаем дату. Важно: dateStr должен быть YYYY-MM-DD
        const date = new Date(dateStr);
        const day = date.getDay(); // 0 - Вс, 6 - Сб
        const isWeekend = (day === 0 || day === 6);

        if (isWeekend) {
            deliveryCost += 300; // Наценка за выходные
        } else if (interval === '18:00-22:00') {
            deliveryCost += 200; // Наценка за вечер
        }
    }
    
    return deliveryCost;
}

// === ЭКСПОРТ В ГЛОБАЛЬНУЮ ОБЛАСТЬ ===
// Это критически важно! Поскольку мы используем `onclick="openViewModal(...)"` в HTML строке,
// браузер будет искать эти функции в объекте `window`. 
// Если код обернут в модуль или DOMContentLoaded, функции не видны снаружи без этого блока.
window.openViewModal = openViewModal;
window.openEditModal = openEditModal;
window.saveOrder = saveOrder;
window.openDeleteModal = openDeleteModal;
window.confirmDelete = confirmDelete;