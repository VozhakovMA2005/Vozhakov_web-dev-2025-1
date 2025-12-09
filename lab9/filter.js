"use strict";
document.addEventListener("DOMContentLoaded", function () {
    const filterBlocks = document.getElementsByClassName("filters");
    Array.from(filterBlocks).forEach(block => {
        Array.from(block.children).forEach(button => {
            button.addEventListener("click", () => {
                const dishesGrid = block.nextElementSibling.children;
                if (button.classList.contains("active-filter")) {
                    button.classList.remove("active-filter");
                    Array.from(dishesGrid).forEach(dish => {
                        dish.style.display = "flex";
                    });
                    return;
                }
                const activeButtons = block.getElementsByClassName("active-filter");
                Array.from(activeButtons).forEach(btn => btn.classList.remove("active-filter"));
                button.classList.add("active-filter");
                const kind = button.dataset.kind;
                Array.from(dishesGrid).forEach(dish => {
                    dish.style.display = (dish.dataset.kind === kind) ? "flex" : "none";
                });
            });
        });
    });
});
