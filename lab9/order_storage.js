// Функция для сохранения выбранных блюд в localStorage
function saveSelectedDishes(orderCart) {
    const obj = {};
    orderCart.forEach((dish, category) => {
        obj[category] = dish.id; // сохраняем именно ID блюда
    });
    localStorage.setItem("selectedDishes", JSON.stringify(obj));
}

// Функция для загрузки выбранных блюд из localStorage
function loadSelectedDishes() {
    const raw = localStorage.getItem("selectedDishes");
    if (!raw) return new Map();
    try {
        const obj = JSON.parse(raw);
        const map = new Map();
        for (const [category, id] of Object.entries(obj)) {
            const dish = window.dishes.find(d => d.id === id); // находим блюдо по ID
            if (dish) map.set(category, dish);
        }
        return map;
    } catch {
        return new Map();
    }
}