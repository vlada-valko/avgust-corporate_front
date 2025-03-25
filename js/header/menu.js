const body = document.querySelector("body");

/* ==== BURGER MENU ==== */
const btnBurger = document.querySelector(".header__menu-burger");
const burgerLine = document.querySelector(".header__menu-burger-lines");

/* MAIN MENU */
const menuAndPersonalAccountBlock = document.querySelector(".header__menu-and-personal-account");
const menuItems = document.querySelectorAll(".header__menu-item");

const closeMenu = () => {
    btnBurger.classList.remove("menu-visible");
    burgerLine.classList.remove("menu-visible");
    menuAndPersonalAccountBlock.classList.remove("menu-visible");

    menuItems.forEach((item) => {
        item.classList.remove("menu-visible");
    });

    // Закриваємо всі сабменю
    document.querySelectorAll(".header__submenu-list").forEach((submenu) => {
        submenu.style.height = "0px";
        submenu.classList.remove("menu-visible");
    });

    document.querySelectorAll(".header__menu-item-text, .header__menu-item-arrow").forEach((el) => {
        el.classList.remove("menu-visible");
    });
};

btnBurger.addEventListener("click", () => {
    const isMenuOpen = btnBurger.classList.contains("menu-visible");

    if (isMenuOpen) {
        closeMenu();
    } else {
        btnBurger.classList.add("menu-visible");
        burgerLine.classList.add("menu-visible");
        menuAndPersonalAccountBlock.classList.add("menu-visible");

        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add("menu-visible");
            }, index * 100);
        });
    }
});

/* ==== SUBMENU ANIMATION (DESKTOP & MOBILE) ==== */
document.querySelectorAll(".header__menu-item-btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
        const parentItem = btn.closest(".header__menu-item");
        const submenu = parentItem.querySelector(".header__submenu-list");
        const mainMenuText = parentItem.querySelector(".header__menu-item-text");
        const arrow = parentItem.querySelector(".header__menu-item-arrow");

        if (!submenu) return; // Якщо немає сабменю — нічого не робимо

        event.preventDefault();

        const isOpen = submenu.classList.contains("menu-visible");

        // Закриваємо всі інші сабменю
        document.querySelectorAll(".header__submenu-list").forEach((otherSubmenu) => {
            if (otherSubmenu !== submenu) {
                otherSubmenu.style.height = "0px";
                otherSubmenu.classList.remove("menu-visible");

                const otherParentItem = otherSubmenu.closest(".header__menu-item");
                const otherArrow = otherParentItem.querySelector(".header__menu-item-arrow");
                const otherMainMenuText = otherParentItem.querySelector(".header__menu-item-text");

                otherMainMenuText.classList.remove("menu-visible");
                otherArrow.classList.remove("menu-visible");
            }
        });

        if (window.innerWidth < 1150) {
            if (isOpen) {
                submenu.style.height = "0px";
                submenu.classList.remove("menu-visible");
                mainMenuText.classList.remove("menu-visible");
                arrow.classList.remove("menu-visible");
            } else {
                const gap = (submenu.querySelectorAll("li").length) * 25;
                submenu.style.height = submenu.scrollHeight + gap + "px";
                submenu.classList.add("menu-visible");
                mainMenuText.classList.add("menu-visible");
                arrow.classList.add("menu-visible");
            }
        } else {
            if (isOpen) {
                submenu.style.height = "0px";
                submenu.classList.remove("menu-visible");
                mainMenuText.classList.remove("menu-visible");
                arrow.classList.remove("menu-visible");
            } else {
                submenu.style.height = submenu.scrollHeight + "px";
                submenu.classList.add("menu-visible");
                mainMenuText.classList.add("menu-visible");
                arrow.classList.add("menu-visible");
            }
        }
    });
});

/* ==== Закриття меню при кліку на елемент сабменю ==== */
document.querySelectorAll(".header__submenu-list li a").forEach((submenuItem) => {
    submenuItem.addEventListener("click", () => {
        closeMenu();
    });
});
