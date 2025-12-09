"use strict";

const ORDER_STORAGE_KEY = 'foodConstructOrder';

function getCurrentOrder() {
    const savedOrder = localStorage.getItem(ORDER_STORAGE_KEY);
    return savedOrder ? JSON.parse(savedOrder) : {};
}

function saveOrder(order) {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
}

function clearOrder() {
    localStorage.removeItem(ORDER_STORAGE_KEY);
}

function addToOrder(category, dish) {
    const order = getCurrentOrder();
    order[category] = dish.keyword;
    saveOrder(order);
    return order;
}

function removeFromOrder(category) {
    const order = getCurrentOrder();
    delete order[category];
    saveOrder(order);
    return order;
}

function isInOrder(category, dishKeyword) {
    const order = getCurrentOrder();
    return order[category] === dishKeyword;
}

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

function checkComboValidity() {
    const order = getCurrentOrder();
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