"use strict";
function mapCategory(apiCat) {
    switch (apiCat) {
        case "main-course": return "main";
        case "salad": return "salads";
        case "dessert": return "desserts";
        default: return apiCat;
    }
}
function renderDishes() {
    const categories = ["soup", "main-course", "salad", "drink", "dessert"];
    categories.forEach(function(cat) {
        let gridId = "";
        switch (cat) {
            case "soup": gridId = "soup_grid"; break;
            case "main-course": gridId = "main_grid"; break;
            case "salad": gridId = "salads_grid"; break;
            case "drink": gridId = "drinks_grid"; break;
            case "dessert": gridId = "desserts_grid"; break;
        }
        const grid = document.getElementById(gridId);
        if (!grid) return;
        dishes
            .filter(function(d) { return d.category === cat; })
            .sort(function(a, b) { return a.name.localeCompare(b.name); })
            .forEach(function(dish) {
                const div = document.createElement("div");
                div.className = "meal-map";
                div.dataset.category = mapCategory(dish.category);
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
}
