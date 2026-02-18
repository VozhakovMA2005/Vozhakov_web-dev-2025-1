// --- КОНСТАНТЫ И НАСТРОЙКИ ---
const API_KEY = '96326ceb-d317-435d-936d-68d3002346a4';
// Ссылки на API вынесены в константы, чтобы их легко было менять в одном месте
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods';
const API_AUTOCOMPLETE = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/autocomplete';

// --- ГЛОБАЛЬНОЕ СОСТОЯНИЕ (STATE) ---
// allGoods: хранит "сырые" данные с сервера (оригинал). Нужен, чтобы всегда можно было сбросить фильтры.
let allGoods = []; 
// filteredGoods: хранит текущий набор товаров после применения поиска и фильтров.
let filteredGoods = []; 
// displayedCount: счетчик для пагинации (сколько товаров уже показано на экране).
let displayedCount = 0; 
const perPage = 9; // Константа: сколько товаров подгружать за раз.

// Словарь для перевода категорий (ключ с сервера -> красивый текст для пользователя).
const categoryMap = {
    "beauty & health": "Красота и здоровье",
    "home & kitchen": "Дом и кухня",
    "sports & fitness": "Спорт и фитнес",
    "tv, audio & cameras": "ТВ, аудио и камеры"
};

// --- ИНИЦИАЛИЗАЦИЯ ---
// Ждем, пока весь HTML загрузится, прежде чем выполнять скрипт.
document.addEventListener('DOMContentLoaded', () => {
    productRequest();    // 1. Загружаем товары
    setupSearch();       // 2. Настраиваем логику поиска (автодополнение)
    updateCartBadge();   // 3. Обновляем счетчик корзины из LocalStorage
});

// --- РАБОТА С API (АСИНХРОННОСТЬ) ---
async function productRequest() {
    try {
        // await "замораживает" функцию, пока сервер не ответит.
        const response = await fetch(`${API_URL}?api_key=${API_KEY}`);
        // Преобразуем ответ из формата JSON в JavaScript-объект/массив.
        allGoods = await response.json();

        generateCategoryFilters(); // Создаем чекбоксы на основе полученных данных
        applyFiltersAndSort();     // Применяем сортировку/фильтрацию по умолчанию и рисуем товары
        document.getElementById('loader').style.display = 'none'; // Скрываем спиннер загрузки
    } catch (error) {
        // Если интернет пропал или сервер упал, код попадет сюда.
        console.error('Ошибка загрузки:', error);
    }
}
ёё
// --- ДИНАМИЧЕСКАЯ ГЕНЕРАЦИЯ UI ---
function generateCategoryFilters() {
    const container = document.getElementById('category-filters');
    // 1. map берет категории из товаров.
    // 2. new Set удаляет дубликаты (оставляет только уникальные категории).
    // 3. [...Set] превращает Set обратно в массив.
    const categories = [...new Set(allGoods.map(g => g.main_category))];

    // Генерируем HTML для чекбоксов. Используем map, чтобы превратить массив строк в массив HTML-строк.
    container.innerHTML = categories.map((cat, index) => `
        <div class="form-check">
            <input class="form-check-input" type="checkbox" name="category" value="${cat}" id="cat${index}">
            <label class="form-check-label" for="cat${index}">
                ${categoryMap[cat.toLowerCase()] || cat} </label>
        </div>
    `).join(''); // join('') склеивает массив HTML-строк в одну большую строку.
}

// --- ПОИСК И АВТОДОПОЛНЕНИЕ ---
function setupSearch() {
    // Поддерживаем поиск и для десктопа, и для мобилки (два разных инпута)
    const searchInputs = [document.getElementById('search-input'), document.getElementById('search-input-mobile')];

    searchInputs.forEach(input => {
        if (!input) return; // Защита: если элемента нет на странице, пропускаем.

        // Находим выпадающий список подсказок рядом с конкретным инпутом
        const list = input.parentElement.parentElement.querySelector('.autocomplete-suggestions');

        // Событие 'input' срабатывает при каждом нажатии клавиши
        input.addEventListener('input', async (e) => {
            const query = e.target.value.trim();
            // Не ищем, если введено меньше 2 символов (экономим запросы к API)
            if (query.length < 2) {
                list.style.display = 'none';
                return;
            }

            try {
                // Запрос к API автодополнения. encodeURIComponent нужен, чтобы пробелы и спецсимволы не сломали URL.
                const resp = await fetch(`${API_AUTOCOMPLETE}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
                const suggestions = await resp.json();

                if (suggestions.length > 0) {
                    // Рисуем подсказки
                    list.innerHTML = suggestions.map(s => `<div class="suggestion-item">${s}</div>`).join('');
                    list.style.display = 'block';
                } else {
                    list.style.display = 'none';
                }
            } catch (err) { console.error(err); }
        });

        // Делегирование событий: клик по подсказке
        list.addEventListener('click', (e) => {
            // Проверяем, что кликнули именно по элементу подсказки
            if (e.target.classList.contains('suggestion-item')) {
                input.value = e.target.textContent; // Подставляем текст в поле
                list.style.display = 'none';        // Скрываем список
                applyFiltersAndSort();              // Сразу запускаем поиск товаров
            }
        });
    });

    // Кнопка "Найти"
    document.getElementById('search-btn').addEventListener('click', applyFiltersAndSort);
}

// --- ГЛАВНАЯ ЛОГИКА (ФИЛЬТРАЦИЯ И СОРТИРОВКА) ---
function applyFiltersAndSort() {
    // FormData собирает значения всех полей формы (чекбоксы, инпуты)
    const formData = new FormData(document.getElementById('filter-form'));
    const selectedCats = formData.getAll('category'); // Получаем массив выбранных галочек
    const minP = parseFloat(document.getElementById('min-price').value) || 0;
    const maxP = parseFloat(document.getElementById('max-price').value) || Infinity; // Infinity - если макс. цена не указана
    const onlyDisc = document.getElementById('only-discount').checked;
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    const sortVal = document.getElementById('sort-select').value;

    // 1. ФИЛЬТРАЦИЯ
    filteredGoods = allGoods.filter(g => {
        const price = g.discount_price || g.actual_price; // Берем цену со скидкой, если есть
        
        // Логика: (Выбрано 0 категорий ИЛИ категория товара есть в выбранных)
        const matchesCat = selectedCats.length === 0 || selectedCats.includes(g.main_category);
        const matchesPrice = price >= minP && price <= maxP;
        const matchesDisc = !onlyDisc || (g.discount_price > 0);
        const matchesSearch = g.name.toLowerCase().includes(searchQuery);

        // Товар остается, только если ВСЕ условия true
        return matchesCat && matchesPrice && matchesDisc && matchesSearch;
    });

    // 2. СОРТИРОВКА
    filteredGoods.sort((a, b) => {
        const pA = a.discount_price || a.actual_price;
        const pB = b.discount_price || b.actual_price;
        
        // Сортировка возвращает: <0 (a раньше b), >0 (b раньше a), 0 (равны)
        if (sortVal === 'price_asc') return pA - pB;       // От меньшего к большему
        if (sortVal === 'price_desc') return pB - pA;      // От большего к меньшему
        if (sortVal === 'rating_asc') return a.rating - b.rating;
        if (sortVal === 'rating_desc') return b.rating - a.rating;
        return 0;
    });

    // 3. СБРОС И ОТРИСОВКА
    displayedCount = 0; // Сбрасываем счетчик показанных товаров
    document.getElementById('goods-container').innerHTML = ''; // Очищаем контейнер
    renderNextPage(); // Рисуем первую "страницу"
}

// --- ПАГИНАЦИЯ (Load More) ---
function renderNextPage() {
    const container = document.getElementById('goods-container');
    // Берем кусочек массива (от current до current + 9)
    const items = filteredGoods.slice(displayedCount, displayedCount + perPage);

    // Добавляем HTML в конец контейнера (не перезаписывая старое)
    items.forEach(item => {
        container.insertAdjacentHTML('beforeend', createProductCard(item));
    });

    displayedCount += items.length;
    
    // Если показали все товары, скрываем кнопку "Загрузить еще"
    document.getElementById('load-more-btn').style.display = displayedCount < filteredGoods.length ? 'inline-block' : 'none';
}

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (РЕНДЕРИНГ) ---
function renderStars(rating) {
    let html = '';
    // Цикл от 1 до 5 звезд
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            html += '<i class="bi bi-star-fill text-warning"></i>'; // Полная звезда
        } else if (i - 0.5 <= rating) {
            html += '<i class="bi bi-star-half text-warning"></i>'; // Половинка
        } else {
            html += '<i class="bi bi-star text-warning"></i>'; // Пустая
        }
    }
    return html;
}

function createProductCard(item) {
    // Проверка на наличие скидки для стилизации цен
    const hasDiscount = item.discount_price !== null && item.discount_price > 0;
    
    // Формируем HTML для блока цены
    let priceHtml = '';
    if (hasDiscount) {
        const percent = Math.round((1 - item.discount_price / item.actual_price) * 100);
        priceHtml = `
            <div class="product-price-block">
                <span class="current-price">${item.discount_price}₽</span>
                <span class="old-price">${item.actual_price}₽</span>
                <span class="discount-badge">-${percent}%</span>
            </div>
        `;
    } else {
        priceHtml = `
            <div class="product-price-block">
                <span class="current-price">${item.actual_price}₽</span>
            </div>
        `;
    }

    // Возвращаем верстку карточки (Template String)
    return `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="product-card">
                <div class="product-img-wrapper">
                    <img src="${item.image_url}" alt="${item.name}">
                </div>
                <div class="product-body">
                    <h5 class="product-title " title="${item.name}">${item.name}</h5>
                    
                    <div class="product-footer">
                        <div class="product-rating">
                            <span class="me-1 fw-bold text-dark">${item.rating}</span>
                            ${renderStars(item.rating)}
                        </div>
                        ${priceHtml}
                        <button class="btn btn-warning w-100 py-2 fw-bold" onclick="addToCart(${item.id})">
                            Добавить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// --- УВЕДОМЛЕНИЯ ---
function showNotification(msg, type = 'success') {
    const area = document.getElementById('global-notification');
    const text = document.getElementById('notification-text');
    const alert = document.getElementById('notification-alert');

    text.textContent = msg;
    // Меняем класс цвета (success - зеленый, info - синий и т.д.)
    alert.className = `alert alert-${type} alert-dismissible fade show text-center mb-0`;
    area.style.display = 'block';

    // Через 4 секунды скрываем уведомление
    setTimeout(() => { area.style.display = 'none'; }, 4000);
}

// --- КОРЗИНА (LOCAL STORAGE) ---
function addToCart(id) {
    // 1. Читаем из localStorage. Если там пусто, возвращаем пустой массив [].
    // JSON.parse обязательно, так как в storage хранятся только строки.
    let cart = JSON.parse(localStorage.getItem('cart_ids')) || [];
    
    // 2. Проверяем, нет ли уже такого ID в массиве
    if (!cart.includes(id)) {
        cart.push(id);
        // 3. Сохраняем обратно, превратив массив в строку (JSON.stringify)
        localStorage.setItem('cart_ids', JSON.stringify(cart));
        updateCartBadge();
        showNotification('Товар добавлен в корзину');
    } else {
        showNotification('Товар уже в корзине', 'info');
    }
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart_ids')) || [];
    // Обновляем цифру на иконке корзины
    document.getElementById('cart-badge').textContent = cart.length;
}

// --- ОБРАБОТЧИКИ СОБЫТИЙ (LISTENERS) ---
// e.preventDefault() нужен, чтобы форма не перезагружала страницу при нажатии Enter
document.getElementById('filter-form').addEventListener('submit', (e) => { e.preventDefault(); applyFiltersAndSort(); });
document.getElementById('sort-select').addEventListener('change', applyFiltersAndSort);
document.getElementById('load-more-btn').addEventListener('click', renderNextPage);