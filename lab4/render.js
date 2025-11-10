/* global dishes */
"use strict";
document.addEventListener("DOMContentLoaded", function () {
    const categories = ['soup', 'main', 'drink'];
    categories.forEach(cat => {
        const gridId = cat === 'soup' ? 'soup_grid' : cat === 'main' ? 'main_grid' : 'drinks_grid';
        const grid = document.getElementById(gridId);
        dishes
            .filter(d => d.category === cat)
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(dish => {
                const div = document.createElement('div');
                div.className = 'meal-map';
                div.dataset.dish = dish.keyword;
                div.innerHTML = `<img src="${dish.image}" alt="${dish.name}">
                    <p class="price">${dish.price}₽</p>
                    <p class="name">${dish.name}</p>
                    <p class="weight">${dish.count}</p>
                    <button type="button">Добавить</button>`;
                grid.appendChild(div);
            });
    });
});
