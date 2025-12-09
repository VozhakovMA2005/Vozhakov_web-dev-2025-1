"use strict";

// Рендеринг выбранных блюд на странице оформления заказа
function renderSelectedDishes() {
    const selectedGrid = document.getElementById("selected-grid");
    selectedGrid.innerHTML = ''; // очищаем старый список

    orderCart.forEach((dish, category) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "selected-item";
        itemDiv.innerHTML = `
            <strong>${dish.name}:</strong> ${dish.price} ₽
            <button onclick="removeFromOrder('${category}')">Удалить</button>
        `;
        selectedGrid.appendChild(itemDiv);
    });

    if (orderCart.size === 0) {
        document.getElementById("empty-text").style.display = "block";
    } else {
        document.getElementById("empty-text").style.display = "none";
    }
}

// Загрузка данных из localStorage и отображение
document.addEventListener("DOMContentLoaded", () => {
    orderCart = loadSelectedDishes(); // Загружаем данные из localStorage
    renderSelectedDishes(); // Рисуем выбранные блюда
});

// Удаление блюда из заказа
function removeFromOrder(category) {
    orderCart.delete(category);
    saveSelectedDishes(orderCart); // Сохраняем обновленную корзину
    renderSelectedDishes(); // Перерисовываем интерфейс
}