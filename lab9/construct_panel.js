"use strict";

// ----------- Работа с localStorage ----------

// Преобразование данных для сохранения
function serializeOrderCart(cart) {
    const serialized = {};
    cart.forEach((dish, category) => {
        serialized[category] = dish.id; // Сохраняем только ID блюда
    });
    return serialized;
}

// Преобразование данных при загрузке
function deserializeOrderCart(serialized) {
    const deserialized = new Map();
    for (const [category, id] of Object.entries(serialized)) {
        const foundDish = window.dishes.find(d => d.id === id); // Искать по ID
        if (foundDish) {
            deserialized.set(category, foundDish);
        }
    }
    return deserialized;
}

// Загрузка данных из localStorage
function loadSelectedDishes() {
    const raw = localStorage.getItem("selectedDishes");
    if (!raw) return new Map();
    try {
        const obj = JSON.parse(raw);
        return deserializeOrderCart(obj);
    } catch {
        return new Map();
    }
}

// Сохранение данных в localStorage
function saveSelectedDishes(orderCart) {
    const serialized = serializeOrderCart(orderCart);
    localStorage.setItem("selectedDishes", JSON.stringify(serialized));
}

// ----------- Инициализация заказа ----------
let orderCart = loadSelectedDishes();

// ----------- Проверка комбо ----------
function validateCombo(categories) {
    const validCombos = [
        ["soup", "main", "drink"],      // суп + главное блюдо + напиток
        ["soup", "main", "salad", "drink"],  // суп + основное + салат + напиток
        ["soup", "salad", "drink"],     // суп + салат + напиток
        ["main", "salad", "drink"],     // основное + салат + напиток
        ["main", "drink"]                // основное + напиток
    ];
    return validCombos.some(combo => combo.every(cat => categories.includes(cat)));
}

// ----------- Пересчет суммы и обновление sticky-панели ----------
function recalculateOrderSum() {
    let totalPrice = 0;
    orderCart.forEach(dish => {
        totalPrice += dish.price;
    });
    
    const panel = document.getElementById("order-sticky-panel");
    const priceEl = document.getElementById("sticky-price");
    const goToDesignBtn = document.getElementById("go-to-design");
    const errorMsg = document.getElementById("sticky-error");

    // Скрываем панель, если ничего не выбрано
    if (totalPrice === 0) {
        panel.classList.add("hidden");
    } else {
        panel.classList.remove("hidden");
    }

    // Обновляем сумму
    priceEl.textContent = `${totalPrice} ₽`;

    // Проверяем валидность комбинации
    const categories = [...orderCart.keys()];
    if (validateCombo(categories)) {
        goToDesignBtn.classList.remove("disabled");
        goToDesignBtn.style.pointerEvents = "auto";
        errorMsg.textContent = "";
    } else {
        goToDesignBtn.classList.add("disabled");
        goToDesignBtn.style.pointerEvents = "none";
    }

    // Сохраняем состояние корзины
    saveSelectedDishes(orderCart);
}

// ----------- Обновление визуальных элементов ----------
function updateUI() {
    document.querySelectorAll(".meal-map").forEach(card => {
        const category = card.dataset.category;
        const keyword = card.dataset.dish;
        const isSelected = orderCart.has(category) &&
                          orderCart.get(category)?.keyword === keyword;
        
        if (isSelected) {
            card.classList.add("selected");
            card.style.border = "2px solid rgb(71, 135, 255)";
        } else {
            card.classList.remove("selected");
            card.style.border = "2px solid transparent";
        }
    });
}

// ----------- Главная логика ----------
document.addEventListener("DOMContentLoaded", () => {
    const waitForLoad = setInterval(() => {
        if (window.dishes && document.querySelector(".meal-map")) {
            clearInterval(waitForLoad);
            
            // Прикрепляем обработчики событий ко всем кнопкам "Добавить"
            document.querySelectorAll(".meal-map button").forEach(button => {
                const parentCard = button.closest(".meal-map");
                const category = parentCard.dataset.category;
                const keyword = parentCard.dataset.dish;
                
                button.addEventListener("click", () => {
                    const dish = dishes.find(d => d.keyword === keyword);
                    
                    if (dish) {
                        orderCart.set(category, dish); // Добавляем в корзину
                        recalculateOrderSum(); // Пересчитываем сумму
                        updateUI(); // Обновляем внешний вид
                    }
                });
            });
        }
    }, 100);
});

// Инициализация UI после загрузки страницы
recalculateOrderSum();
updateUI();