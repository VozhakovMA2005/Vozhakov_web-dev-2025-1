"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const categories = ["soup", "main", "drink"];
    let orderCart = {};
    let sum = 0;

    const nothingChosen = document.getElementById("nothing-chosen");
    const orderPriceBlock = document.getElementById("order_price_block");
    const orderPrice = document.getElementById("order_price");

    nothingChosen.style.display = "block";
    orderPriceBlock.style.display = "none";
    categories.forEach(cat => {
        document.getElementById(`order_${cat}`).parentNode.style.display = "none";
    });

    categories.forEach(cat => {
        let input = document.createElement("input");
        input.type = "hidden";
        input.name = `order_${cat}`;
        input.id = `${cat}_select`;
        document.querySelector("form").appendChild(input);
    });

    let priceInput = document.createElement("input");
    priceInput.type = "hidden";
    priceInput.name = "order_price";
    priceInput.id = "order_price_input";
    priceInput.value = "0";
    document.querySelector("form").appendChild(priceInput);

    document.querySelectorAll(".meal-map button").forEach(button => {
        button.addEventListener("click", function () {
            const mealDiv = this.closest(".meal-map");
            const dishKeyword = mealDiv.dataset.dish;
            const dish = dishes.find(d => d.keyword === dishKeyword);
            if (!dish) return;

            document.querySelectorAll(".meal-map.selected").forEach(el => {
                const d = dishes.find(dish => dish.keyword === el.dataset.dish);
                if (d.category === dish.category) el.classList.remove("selected");
            });

            mealDiv.classList.add("selected");

            orderCart[dish.category] = dish;

            nothingChosen.style.display = "none";
            categories.forEach(cat => {
                const catBlock = document.getElementById(`order_${cat}`).parentNode;
                const catText = document.getElementById(`order_${cat}`);
                const catInput = document.getElementById(`${cat}_select`);

                if (orderCart[cat]) {
                    catBlock.style.display = "block";
                    catText.textContent = `${orderCart[cat].name} ${orderCart[cat].price} ₽`;
                    catInput.value = orderCart[cat].keyword;
                } else {
                    catBlock.style.display = "block";
                    catText.textContent = cat === "drink" ? "Напиток не выбран" : "Блюдо не выбрано";
                    catInput.value = "";
                }
            });

            sum = Object.values(orderCart).reduce((acc, d) => acc + d.price, 0);
            orderPrice.textContent = `${sum} ₽`;
            priceInput.value = sum;
            orderPriceBlock.style.display = sum > 0 ? "block" : "none";
        });
    });

    document.querySelector(".form-buttons-reset").addEventListener("click", function () {
        document.querySelectorAll(".meal-map.selected").forEach(el => el.classList.remove("selected"));
        orderCart = {};
        sum = 0;

        nothingChosen.style.display = "block";
        orderPriceBlock.style.display = "none";

        categories.forEach(cat => {
            const catBlock = document.getElementById(`order_${cat}`).parentNode;
            const catText = document.getElementById(`order_${cat}`);
            const catInput = document.getElementById(`${cat}_select`);

            catBlock.style.display = "none";
            catText.textContent = cat === "drink" ? "Напиток не выбран" : "Блюдо не выбрано";
            catInput.value = "";
        });

        priceInput.value = "0";
    });

    const form = document.querySelector("form");
    form.addEventListener("submit", function (e) {
        if (Object.keys(orderCart).length === 0) {
            alert("Выберите хотя бы одно блюдо для заказа");
            e.preventDefault();
        }
    });
});
