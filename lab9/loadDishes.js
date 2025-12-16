"use strict";

function loadDishes() {
    const url = "https://edu.std-900.ist.mospolytech.ru/labs/api/dishes";
    return fetch(url)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function(data) {
            window.dishes = data;   
            return data;
        })
        .catch(function(error) {
            console.error('Ошибка загрузки блюд:', error);
            window.dishes = [];
        });
}