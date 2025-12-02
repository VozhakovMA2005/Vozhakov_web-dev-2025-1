"use strict";
function initOrderHandlers() {
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

    function updateDisplay() {
        const hasSelection = orderCart.size > 0;
        nothing.style.display = hasSelection ? "none" : "block";
        let sum = 0;

        cats.forEach(function(cat) {
            const p = document.getElementById("order_" + cat);
            const catBlock = p.parentNode;

            if (hasSelection) {
                catBlock.style.display = "block";

                if (orderCart.has(cat)) {
                    const d = orderCart.get(cat);
                    p.textContent = d.name + " " + d.price + " ₽";
                    document.querySelector(inputs[cat]).value = d.keyword;
                    sum += d.price;
                } else {
                    if (cat === "drink") p.textContent = "Напиток не выбран";
                    else if (cat === "salads") p.textContent = "Салат не выбран";
                    else if (cat === "desserts") p.textContent = "Десерт не выбран";
                    else p.textContent = "Блюдо не выбрано";

                    document.querySelector(inputs[cat]).value = "";
                }
            } else {
                catBlock.style.display = "none";
                if (cat === "drink") p.textContent = "Напиток не выбран";
                else if (cat === "salads") p.textContent = "Салат не выбран";
                else if (cat === "desserts") p.textContent = "Десерт не выбран";
                else p.textContent = "Блюдо не выбрано";

                document.querySelector(inputs[cat]).value = "";
            }
        });

        document.getElementById("order_price").textContent = sum + " ₽";
        document.querySelector(inputs.price).value = sum;
        priceBlock.style.display = sum ? "block" : "none";
    }

    document.querySelectorAll(".meal-map button").forEach(function(btn) {
        btn.addEventListener("click", function(e) {
            const div = e.target.closest(".meal-map");

            const d = dishes.find(function(x) { return x.keyword === div.dataset.dish; });

            const category = div.dataset.category;

            document.querySelectorAll(".meal-map.selected").forEach(function(el) {
                if (el.dataset.category === category) el.classList.remove("selected");
            });

            div.classList.add("selected");

            orderCart.set(category, d);
            updateDisplay();
        });
    });

    document.querySelector(".form-buttons-reset").addEventListener("click", function() {
        document.querySelectorAll(".meal-map.selected").forEach(function(el) {
            el.classList.remove("selected");
        });

        orderCart.clear();
        updateDisplay();
    });
}
