const body = document.querySelector("body");

/* ==== BURGER MENU ==== */
const btnBurger = document.querySelector(".header__menu-burger");
const burgerLine = document.querySelector(".header__menu-burger-lines");

/* MAIN MENU */
const menuAndPersonalaccountBlock = document.querySelector(".header__menu-and-personal-account");
const menuItems = document.querySelectorAll(".header__menu-item");

/* PERSONAL account */
const personalaccountIcon = document.querySelector("#personal-account-icon");
const personalaccountSubmenu = document.querySelector(".header__personal-account-submenu-list");

/* Функція закриття меню */
const closeMenu = () => {
    btnBurger.classList.remove("menu-visible");
    burgerLine.classList.remove("menu-visible");
    menuAndPersonalaccountBlock.classList.remove("menu-visible");

    menuItems.forEach((item) => {
        item.classList.remove("menu-visible");
    });

    document.querySelectorAll(".header__submenu-list, .header__personal-account-submenu-list").forEach((submenu) => {
        submenu.style.height = "0px";
        submenu.classList.remove("menu-visible");
    });

    document.querySelectorAll(".header__menu-item-text, .header__menu-item-arrow").forEach((el) => {
        el.classList.remove("menu-visible");
    });
};

/* Відкриття/закриття бургер-меню */
btnBurger.addEventListener("click", () => {
    const isMenuOpen = btnBurger.classList.contains("menu-visible");

    if (isMenuOpen) {
        closeMenu();
    } else {
        btnBurger.classList.add("menu-visible");
        burgerLine.classList.add("menu-visible");
        menuAndPersonalaccountBlock.classList.add("menu-visible");

        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add("menu-visible");
            }, index * 100);
        });
    }
});

/* ==== SUBMENU ANIMATION (MAIN MENU) ==== */
document.querySelectorAll(".header__menu-item-btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
        const parentItem = btn.closest(".header__menu-item");
        const submenu = parentItem.querySelector(".header__submenu-list");
        const mainMenuText = parentItem.querySelector(".header__menu-item-text");
        const arrow = parentItem.querySelector(".header__menu-item-arrow");

        if (!submenu) return;

        event.preventDefault();

        const isOpen = submenu.classList.contains("menu-visible");

        // Закриваємо сабменю Personal account, якщо воно було відкрите
        if (personalaccountSubmenu.classList.contains("menu-visible")) {
            personalaccountSubmenu.style.height = "0px";
            personalaccountSubmenu.classList.remove("menu-visible");
        }

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

/* ==== SUBMENU ANIMATION (PERSONAL account) ==== */
personalaccountIcon.addEventListener("click", (event) => {
    if (!event.target.closest("a")) {
        event.preventDefault();
    }

    const isOpen = personalaccountSubmenu.classList.contains("menu-visible");

    // Закриваємо всі інші сабменю перед відкриттям Personal account
    document.querySelectorAll(".header__submenu-list").forEach((submenu) => {
        submenu.style.height = "0px";
        submenu.classList.remove("menu-visible");

        const parentItem = submenu.closest(".header__menu-item");
        const arrow = parentItem.querySelector(".header__menu-item-arrow");
        const mainMenuText = parentItem.querySelector(".header__menu-item-text");

        mainMenuText.classList.remove("menu-visible");
        arrow.classList.remove("menu-visible");
    });

    if (isOpen) {
        personalaccountSubmenu.style.height = "0px";
        personalaccountSubmenu.classList.remove("menu-visible");
    } else {
        personalaccountSubmenu.style.height = personalaccountSubmenu.scrollHeight + "px";
        personalaccountSubmenu.classList.add("menu-visible");
    }
});

/* ==== Закриття меню при кліку на елемент сабменю (крім персонального акаунта) ==== */
document.querySelectorAll(".header__submenu-list li a").forEach((submenuItem) => {
    submenuItem.addEventListener("click", () => {
        closeMenu();
    });
});

/* ==== Закриття сабменю при кліку за межами меню (тільки для десктопної версії) ==== */
document.addEventListener("click", (event) => {
    if (window.innerWidth >= 1150) {
        const isClickInsideMenu = menuAndPersonalaccountBlock.contains(event.target) || 
                                  btnBurger.contains(event.target) ||
                                  personalaccountIcon.contains(event.target);

        if (!isClickInsideMenu) {
            closeMenu();
        }
    }
});
