"use strict";

const API_KEY = "96326ceb-d317-435d-936d-68d3002346a4";
const API_URL = "https://edu.std-900.ist.mospolytech.ru/labs/api/orders";

// Загрузка избранных блюд из localStorage
function loadSelectedDishes() {
    const raw = localStorage.getItem("selectedDishes");
    if (!raw) return new Map();
    try {
        const obj = JSON.parse(raw);
        const map = new Map();
        for (const [category, id] of Object.entries(obj)) {
            const dish = window.dishes.find(d => d.id === id);
            if (dish) map.set(category, dish);
        }
        return map;
    } catch {
        return new Map();
    }
}

// Отправка заказа на сервер
function sendOrder(event) {
    event.preventDefault();

    const form = event.target;
    const data = new FormData(form);

    // Извлекаем данные из формы
    const fullName = data.get("full-name");
    const email = data.get("email");
    const phone = data.get("phone");
    const address = data.get("address");
    const timeOption = data.get("time-option");
    const deliveryTime = data.get("delivery-time");
    const comment = data.get("comment");
    const subscribe = data.get("subscribe") === 'on' ? true : false;

    // Подгружаем избранные блюда
    const orderCart = loadSelectedDishes();

    // Формируем тело запроса
    const requestBody = {
        full_name: fullName,
        email,
        phone,
        delivery_address: address,
        delivery_type: timeOption,
        delivery_time: deliveryTime,
        comment,
        subscribe,
    };

    // Добавляем выбранные блюда
    orderCart.forEach((dish, category) => {
        switch (category) {
            case "soup":
                requestBody.soup_id = dish.id;
                break;
            case "main-course":
                requestBody.main_course_id = dish.id;
                break;
            case "salad":
                requestBody.salad_id = dish.id;
                break;
            case "drink":
                requestBody.drink_id = dish.id;
                break;
            case "dessert":
                requestBody.dessert_id = dish.id;
                break;
        }
    });

    // Отправляем данные на сервер
    fetch(`${API_URL}?api_key=${API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => response.json())
    .then(result => {
        if (result.error) {
            alert("Ошибка обработки заказа: " + result.error);
        } else {
            alert("Заказ успешно оформлен!");
            localStorage.removeItem("selectedDishes"); // Очистка корзины
            location.href = "/construct.html"; // Переход обратно на главную страницу
        }
    })
    .catch(error => {
        alert("Ошибка отправки заказа. Повторите попытку позднее.");
        console.error("Ошибка:", error.message);
    });
}

// Регистрация слушателя события submit
document.getElementById("submit").addEventListener("click", sendOrder);