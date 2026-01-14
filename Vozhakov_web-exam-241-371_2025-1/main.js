const API_KEY = '96326ceb-d317-435d-936d-68d3002346a4';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods';
const API_AUTOCOMPLETE = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/autocomplete';

let allGoods = [];
let filteredGoods = [];
let displayedCount = 0;
const perPage = 9;

const categoryMap = {
    "beauty & health": "Красота и здоровье",
    "home & kitchen": "Дом и кухня",
    "sports & fitness": "Спорт и фитнес",
    "tv, audio & cameras": "ТВ, аудио и камеры"
};

document.addEventListener('DOMContentLoaded', () => {
    fetchGoods();
    setupSearch();
    updateCartBadge();
});

async function fetchGoods() {
    try {
        const response = await fetch(`${API_URL}?api_key=${API_KEY}`);
        allGoods = await response.json();

        generateCategoryFilters();
        applyFiltersAndSort();
        document.getElementById('loader').style.display = 'none';
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
}

function generateCategoryFilters() {
    const container = document.getElementById('category-filters');
    const categories = [...new Set(allGoods.map(g => g.main_category))];

    container.innerHTML = categories.map((cat, index) => `
        <div class="form-check">
            <input class="form-check-input" type="checkbox" name="category" value="${cat}" id="cat${index}">
            <label class="form-check-label" for="cat${index}">
                ${categoryMap[cat.toLowerCase()] || cat}
            </label>
        </div>
    `).join('');
}

function setupSearch() {
    const searchInputs = [document.getElementById('search-input'), document.getElementById('search-input-mobile')];

    searchInputs.forEach(input => {
        if (!input) return;

        const list = input.parentElement.parentElement.querySelector('.autocomplete-suggestions');

        input.addEventListener('input', async (e) => {
            const query = e.target.value.trim();
            if (query.length < 2) {
                list.style.display = 'none';
                return;
            }

            try {
                const resp = await fetch(`${API_AUTOCOMPLETE}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
                const suggestions = await resp.json();

                if (suggestions.length > 0) {
                    list.innerHTML = suggestions.map(s => `<div class="suggestion-item">${s}</div>`).join('');
                    list.style.display = 'block';
                } else {
                    list.style.display = 'none';
                }
            } catch (err) { console.error(err); }
        });

        list.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-item')) {
                input.value = e.target.textContent;
                list.style.display = 'none';
                applyFiltersAndSort();
            }
        });
    });

    document.getElementById('search-btn').addEventListener('click', applyFiltersAndSort);
}

function applyFiltersAndSort() {
    const formData = new FormData(document.getElementById('filter-form'));
    const selectedCats = formData.getAll('category');
    const minP = parseFloat(document.getElementById('min-price').value) || 0;
    const maxP = parseFloat(document.getElementById('max-price').value) || Infinity;
    const onlyDisc = document.getElementById('only-discount').checked;
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    const sortVal = document.getElementById('sort-select').value;

    filteredGoods = allGoods.filter(g => {
        const price = g.discount_price || g.actual_price;
        const matchesCat = selectedCats.length === 0 || selectedCats.includes(g.main_category);
        const matchesPrice = price >= minP && price <= maxP;
        const matchesDisc = !onlyDisc || (g.discount_price > 0);
        const matchesSearch = g.name.toLowerCase().includes(searchQuery);

        return matchesCat && matchesPrice && matchesDisc && matchesSearch;
    });

    filteredGoods.sort((a, b) => {
        const pA = a.discount_price || a.actual_price;
        const pB = b.discount_price || b.actual_price;
        if (sortVal === 'price_asc') return pA - pB;
        if (sortVal === 'price_desc') return pB - pA;
        if (sortVal === 'rating_asc') return a.rating - b.rating;
        if (sortVal === 'rating_desc') return b.rating - a.rating;
        return 0;
    });

    displayedCount = 0;
    document.getElementById('goods-container').innerHTML = '';
    renderNextPage();
}

function renderNextPage() {
    const container = document.getElementById('goods-container');
    const items = filteredGoods.slice(displayedCount, displayedCount + perPage);

    items.forEach(item => {
        container.insertAdjacentHTML('beforeend', createProductCard(item));
    });

    displayedCount += items.length;
    document.getElementById('load-more-btn').style.display = displayedCount < filteredGoods.length ? 'inline-block' : 'none';
}

function renderStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            html += '<i class="bi bi-star-fill text-warning"></i>';
        } else if (i - 0.5 <= rating) {
            html += '<i class="bi bi-star-half text-warning"></i>';
        } else {
            html += '<i class="bi bi-star text-warning"></i>';
        }
    }
    return html;
}

function createProductCard(item) {
    const hasDiscount = item.discount_price !== null && item.discount_price > 0;

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

function showNotification(msg, type = 'success') {
    const area = document.getElementById('global-notification');
    const text = document.getElementById('notification-text');
    const alert = document.getElementById('notification-alert');

    text.textContent = msg;
    alert.className = `alert alert-${type} alert-dismissible fade show text-center mb-0`;
    area.style.display = 'block';

    setTimeout(() => { area.style.display = 'none'; }, 4000);
}

function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart_ids')) || [];
    if (!cart.includes(id)) {
        cart.push(id);
        localStorage.setItem('cart_ids', JSON.stringify(cart));
        updateCartBadge();
        showNotification('Товар добавлен в корзину');
    } else {
        showNotification('Товар уже в корзине', 'info');
    }
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart_ids')) || [];
    document.getElementById('cart-badge').textContent = cart.length;
}

document.getElementById('filter-form').addEventListener('submit', (e) => { e.preventDefault(); applyFiltersAndSort(); });
document.getElementById('sort-select').addEventListener('change', applyFiltersAndSort);
document.getElementById('load-more-btn').addEventListener('click', renderNextPage);