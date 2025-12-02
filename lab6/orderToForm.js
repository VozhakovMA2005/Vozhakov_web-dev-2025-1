/* global dishes */
"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const cats = ["soup", "main", "drink", "salads", "desserts"];
    window.orderCart = new Map();
    const inputs = {
        soup: "#soup-select",
        main: "#main-select",
        drink: "#drink-select",
        salads: "#salads-select",
        desserts: "#desserts-select",
        price: "#order_price_input"
    };
    const nothing = document.getElementById("nothing-chosen");
    const priceBlock = document.getElementById("order_price_block");
    nothing.style.display = "block";
    priceBlock.style.display = "none";
    const updateDisplay = () => {
        const hasSelection = orderCart.size > 0;
        nothing.style.display = hasSelection ? "none" : "block";
        let sum = 0;
        cats.forEach(cat => {
            const p = document.getElementById(`order_${cat}`);
            const catBlock = p.parentNode;

            if (hasSelection) {
                catBlock.style.display = "block";

                if (orderCart.has(cat)) {
                    const d = orderCart.get(cat);
                    p.textContent = `${d.name} ${d.price} ₽`;
                    document.querySelector(inputs[cat]).value = d.keyword;
                    sum += d.price;
                } else {
                    if (cat === "drink") {
                        p.textContent = "Напиток не выбран";
                    } else if (cat === "salads") {
                        p.textContent = "Салат не выбран";
                    } else if (cat === "desserts") {
                        p.textContent = "Десерт не выбран";
                    } else {
                        p.textContent = "Блюдо не выбрано";
                    }
                    document.querySelector(inputs[cat]).value = "";
                }
            } else {
                catBlock.style.display = "none";
                if (cat === "drink") {
                    p.textContent = "Напиток не выбран";
                } else if (cat === "salads") {
                    p.textContent = "Салат не выбран";
                } else if (cat === "desserts") {
                    p.textContent = "Десерт не выбран";
                } else {
                    p.textContent = "Блюдо не выбрано";
                }
                document.querySelector(inputs[cat]).value = "";
            }
        });
        document.getElementById("order_price").textContent = `${sum} ₽`;
        document.querySelector(inputs.price).value = sum;
        priceBlock.style.display = sum ? "block" : "none";
    };
    document.querySelectorAll(".meal-map button").forEach(btn => {
        btn.addEventListener("click", e => {
            const div = e.target.closest(".meal-map");
            const d = dishes.find(x => x.keyword === div.dataset.dish);
            document.querySelectorAll(".meal-map.selected").forEach(el => {
                const elDish = dishes.find(x => x.keyword === el.dataset.dish);
                if (elDish.category === d.category) el.classList.remove("selected");
            });
            div.classList.add("selected");
            orderCart.set(d.category, d);
            updateDisplay();
        });
    });
    document.querySelector(".form-buttons-reset").addEventListener("click", () => {
        document.querySelectorAll(".meal-map.selected").forEach(el => el.classList.remove("selected"));
        orderCart.clear();
        updateDisplay();
    });
});
