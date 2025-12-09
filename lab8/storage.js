"use strict";

const ORDER_STORAGE_KEY = 'foodConstructOrder';

// Получить текущий заказ из localStorage
function getCurrentOrder() {
    const savedOrder = localStorage.getItem(ORDER_STORAGE_KEY);
    return savedOrder ? JSON.parse(savedOrder) : {};
}

// Сохранить заказ в localStorage
function saveOrder(order) {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
}

// Очистить заказ
function clearOrder() {
    localStorage.removeItem(ORDER_STORAGE_KEY);
}

// Добавить блюдо в заказ
function addToOrder(category, dish) {
    const order = getCurrentOrder();
    order[category] = dish.keyword;
    saveOrder(order);
    return order;
}

// Удалить блюдо из заказа
function removeFromOrder(category) {
    const order = getCurrentOrder();
    delete order[category];
    saveOrder(order);
    return order;
}

// Проверить, есть ли блюдо в заказе
function isInOrder(category, dishKeyword) {
    const order = getCurrentOrder();
    return order[category] === dishKeyword;
}

// Получить общую стоимость заказа
function getOrderTotalPrice(allDishes) {
    const order = getCurrentOrder();
    let total = 0;
    
    Object.keys(order).forEach(category => {
        const dish = allDishes.find(d => d.keyword === order[category]);
        if (dish) {
            total += dish.price;
        }
    });
    
    return total;
}

// Проверка валидности комбо
function checkComboValidity() {
    const order = getCurrentOrder();
    const hasSoup = !!order.soup;
    const hasMain = !!order.main;
    const hasSalad = !!order.salads;
    const hasDrink = !!order.drink;

    // Должен быть выбран напиток
    if (!hasDrink) {
        return false;
    }

    // Проверяем все возможные комбинации
    const combo1 = hasSoup && hasMain && hasSalad && hasDrink;     // суп, главное, салат, напиток
    const combo2 = hasSoup && hasMain && hasDrink && !hasSalad;    // суп, главное, напиток
    const combo3 = hasSoup && hasSalad && hasDrink && !hasMain;    // суп, салат, напиток
    const combo4 = hasMain && hasSalad && hasDrink && !hasSoup;    // главное, салат, напиток
    const combo5 = hasMain && hasDrink && !hasSoup && !hasSalad;   // главное, напиток

    return combo1 || combo2 || combo3 || combo4 || combo5;
}