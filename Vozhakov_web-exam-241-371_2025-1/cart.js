const API_KEY = '96326ceb-d317-435d-936d-68d3002346a4';
const API_URL_GOODS = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods';
const API_URL_ORDERS = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders';

let cartProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    
    document.getElementById('delivery_date').addEventListener('change', calculateTotal);
    document.getElementById('delivery_interval').addEventListener('change', calculateTotal);
    document.getElementById('order-form').addEventListener('submit', submitOrder);
});

function showNotification(msg, type = 'success') {
    const area = document.getElementById('global-notification');
    const text = document.getElementById('notification-text');
    const alert = document.getElementById('notification-alert');

    text.textContent = msg;
    alert.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show text-center mb-0 rounded-0`;
    area.style.display = 'block';

    setTimeout(() => { area.style.display = 'none'; }, 4000);
}

async function loadCart() {
    const cartIds = JSON.parse(localStorage.getItem('cart_ids')) || [];
    if (cartIds.length === 0) {
        showEmptyCart();
        return;
    }

    try {
        const requests = cartIds.map(id => fetch(`${API_URL_GOODS}/${id}?api_key=${API_KEY}`));
        const responses = await Promise.all(requests);
        
        cartProducts = [];
        for (const res of responses) {
            if (res.ok) cartProducts.push(await res.json());
        }

        renderCartItems();
        calculateTotal();
        document.getElementById('cart-loader').style.display = 'none';
        document.getElementById('order-section').style.display = 'block';
    } catch (error) {
        showNotification('Ошибка загрузки данных', 'error');
    }
}

function renderCartItems() {
    const container = document.getElementById('cart-container');
    container.innerHTML = '';

    cartProducts.forEach(item => {
        const hasDiscount = item.discount_price !== null && item.discount_price > 0;
        const percent = hasDiscount ? Math.round((1 - item.discount_price / item.actual_price) * 100) : 0;
        
        const priceHtml = hasDiscount 
            ? `<div class="product-price-block">
                <span class="current-price text-dark">${item.discount_price} ₽</span>
                <span class="old-price text-danger ms-2">${item.actual_price} ₽</span>
                <span class="discount-badge ms-2">-${percent}%</span>
               </div>`
            : `<div class="product-price-block">
                <span class="current-price text-dark">${item.actual_price} ₽</span>
               </div>`;

        container.insertAdjacentHTML('beforeend', `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="product-card p-3 border rounded d-flex flex-column h-100 bg-white">
                    <div class="product-img-wrapper mb-3 text-center">
                        <img src="${item.image_url}" class="img-fluid" style="max-height: 180px; object-fit: contain;">
                    </div>
                    <div class="product-body d-flex flex-column flex-grow-1">
                        <h5 class="product-title h6 fw-bold mb-2">${item.name}</h5>
                        <div class="product-footer">
                            <div class="product-rating mb-2">
                                <span class="me-1 fw-bold text-dark">${item.rating}</span>
                                ${renderStars(item.rating)}
                            </div>
                            ${priceHtml}
                            <button class="btn btn-secondary w-100 mt-3" onclick="removeFromCart(${item.id})">Удалить</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
}

function renderStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) html += '<i class="bi bi-star-fill text-warning"></i>';
        else if (i - 0.5 <= rating) html += '<i class="bi bi-star-half text-warning"></i>';
        else html += '<i class="bi bi-star text-warning"></i>';
    }
    return html;
}

function removeFromCart(id) {
    cartProducts = cartProducts.filter(p => p.id !== id);
    localStorage.setItem('cart_ids', JSON.stringify(cartProducts.map(p => p.id)));
    renderCartItems();
    calculateTotal();
    showNotification('Товар удален из корзины', 'info');
    if (cartProducts.length === 0) showEmptyCart();
}

function calculateTotal() {
    let goodsTotal = cartProducts.reduce((sum, p) => sum + (p.discount_price || p.actual_price), 0);
    let deliveryPrice = 200;
    
    const dateVal = document.getElementById('delivery_date').value;
    const interval = document.getElementById('delivery_interval').value;

    if (dateVal) {
        const day = new Date(dateVal).getDay();
        if (day === 0 || day === 6) deliveryPrice = 500;
        else if (interval === '18:00-22:00') deliveryPrice = 400;
    }

    document.getElementById('delivery-cost').textContent = deliveryPrice;
    document.getElementById('total-price').textContent = goodsTotal + deliveryPrice;
}

async function submitOrder(e) {
    e.preventDefault();
    
    const orderData = {
        full_name: document.getElementById('full_name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subscribe: document.getElementById('subscribe').checked,
        delivery_address: document.getElementById('delivery_address').value,
        delivery_date: document.getElementById('delivery_date').value.split('-').reverse().join('.'),
        delivery_interval: document.getElementById('delivery_interval').value,
        comment: document.getElementById('comment').value,
        good_ids: cartProducts.map(p => p.id)
    };

    try {
        const resp = await fetch(`${API_URL_ORDERS}?api_key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (resp.ok) {
            showNotification('Заказ успешно оформлен! Сейчас вы будете перенаправлены...');
            localStorage.removeItem('cart_ids');
            setTimeout(() => window.location.href = 'index.html', 3000);
        } else {
            showNotification('Ошибка при оформлении заказа', 'error');
        }
    } catch (err) {
        showNotification('Ошибка сети', 'error');
    }
}

function showEmptyCart() {
    document.getElementById('cart-loader').style.display = 'none';
    document.getElementById('cart-container').innerHTML = '';
    document.getElementById('order-section').style.display = 'none';
    document.getElementById('cart-empty').style.display = 'block';
}