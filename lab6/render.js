/* global dishes */
"use strict";
document.addEventListener("DOMContentLoaded", function () {
    const categories = ['soup', 'main', 'salads', 'drink', 'desserts'];
    categories.forEach(cat => {
        let gridId = '';
        switch (cat) {
            case 'soup': gridId = 'soup_grid'; break;
            case 'main': gridId = 'main_grid'; break;
            case 'salads': gridId = 'salads_grid'; break;
            case 'drink': gridId = 'drinks_grid'; break;
            case 'desserts': gridId = 'desserts_grid'; break;
        }
        const grid = document.getElementById(gridId);
        if (!grid) return;
        dishes
            .filter(d => d.category === cat)
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(dish => {
                const div = document.createElement('div');
                div.className = 'meal-map';
                div.dataset.dish = dish.keyword;
                div.dataset.kind = dish.kind;
                div.innerHTML = `
                    <img src="${dish.image}" alt="${dish.name}">
                    <p class="price">${dish.price}₽</p>
                    <p class="name">${dish.name}</p>
                    <p class="weight">${dish.count}</p>
                    <button type="button">Добавить</button>
                `;
                grid.appendChild(div);
            });
    });
});
