"use strict";
function loadDishes() {
    const url = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";
    return fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            window.dishes = data;   
        });
}

document.addEventListener("DOMContentLoaded", function () {
    loadDishes().then(function () {
        renderDishes();
        initOrderHandlers();
    });
});
