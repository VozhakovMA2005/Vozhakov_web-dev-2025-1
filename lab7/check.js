"use strict";
function createNotification(text) {
    let notification = document.createElement("div");
    let button = document.createElement("button");
    button.classList.add("notification-button");
    button.innerHTML = `Ок &#128076;`;
    button.onclick = function (event) {
        event.target.parentElement.remove();
    };
    notification.classList.add("notification");
    notification.innerHTML =
        `<p class="notification-text">${text}</p>`;
    notification.append(button);
    document.body.append(notification);
}
document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();
    const hasSoup = orderCart.has("soup");
    const hasMain = orderCart.has("main");
    const hasSalad = orderCart.has("salads");
    const hasDrink = orderCart.has("drink");
    const needsMain = !hasSoup && !hasSalad;
    if (orderCart.size === 0) {
        createNotification("Ничего не выбрано. Выберите блюда для заказа");
        return;
    }
    if (!hasDrink) {
        createNotification("Выберите напиток");
        return;
    }
    if (hasSoup && (!hasMain && !hasSalad)) {
        createNotification("Выберите главное блюдо/салат/стартер");
        return;
    }
    if (hasSalad && (!hasSoup && !hasMain)) {
        createNotification("Выберите суп или главное блюдо");
        return;
    }
    if (needsMain && !hasMain) {
        createNotification("Выберите главное блюдо");
        return;
    }
    event.target.submit();
});