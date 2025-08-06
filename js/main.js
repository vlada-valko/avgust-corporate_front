async function loadScripts() {
  try {
    await import("./auth/toggle-personal-account-icons.js");
  } catch (err) {
    console.error("❌ Помилка під час імпорту ./header/toggle-personal-account-icons.js:", err);
  }

  try {
    // SLICK
    try {
      await import("./slick.min.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./slick.min.js:", err);
    }

    // HEADER
    try {
      await import("./auth/login.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./header/login.js:", err);
    }
    try {
      await import("./auth/logout.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./header/logout.js:", err);
    }
    try {
      await import("./header/menu.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./header/menu.js:", err);
    }
    try {
      await import("./auth/show-login-block.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./header/show-login-block.js:", err);
    }

    // INDEX
    try {
      await import("./index/index-avgust-in-numbers-counter.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./index/index-avgust-in-numbers-counter.js:", err);
    }
    try {
      await import("./index/index-carousel.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./index/index-carousel.js:", err);
    }

    // EMPLOYEE
    try {
      await import("./employee/employee-read-all.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./employee/employee-read-all.js:", err);
    }
    try {
      await import("./employee/employee-mapping.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./employee/employee-mapping.js:", err);
    }
    try {
      await import("./user/user-mapping.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./user/user-mapping.js:", err);
    }
    try {
      await import("./user/user-create.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./user/user-create.js:", err);
    }
    try {
      await import("./employee/employee-delete.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./employee/employee-delete.js:", err);
    }
    try {
      await import("./employee/employee-create.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./employee/employee-create.js:", err);
    }
    try {
      await import("./employee/employee-delete.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./employee/employee-delete.js:", err);
    }
    try {
      await import("./employee/employee-read-by-id.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./employee/employee-read-by-id.js:", err);
    }
    try {
      await import("./employee/employee-search.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./employee/employee-search.js:", err);
    }

      try {
      await import("./department/department-read-all.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./department/read-all.js:", err);
    }

    // ADDITIONAL
    try {
      await import("./additional-js/documents-view-accordeon.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./additional-js/documents-view-accordeon.js:", err);
    }
    try {
      await import("./mapping/employee-mapping.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./mapping/employee-mapping.js", err);
    }
    try {
      await import("./entity-create.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./entity-create.js", err);
    }
    try {
      await import("./errors.js");
    } catch (err) {
      console.error("❌ Помилка під час імпорту ./errors.js", err);
    }

    // Підключення Choices.js CSS та JS
    await loadChoicesLibrary();

    // Ініціалізація Choices для всіх селектів на сторінці
    document.querySelectorAll("select").forEach((select) => {
      new Choices(select, {
        searchEnabled: true,
        itemSelectText: '',
        shouldSort: false
      });
    });

  } catch (error) {
    console.error("❌ Помилка у loadScripts:", error);
  }
}

// Функція завантаження Choices.js динамічно
function loadChoicesLibrary() {
  return new Promise((resolve, reject) => {
    // CSS
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css";
    document.head.appendChild(css);

    // JS
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js";
    script.onload = () => resolve();
    script.onerror = () => reject("Не вдалося завантажити Choices.js");
    document.body.appendChild(script);
  });
}


const totalPartials = document.querySelectorAll('[hx-trigger="load"], [data-hx-trigger="load"]').length;
let loadedPartialsCount = 0;

if (totalPartials > 0) {
  document.body.addEventListener("htmx:afterOnLoad", () => {
    loadedPartialsCount++;
    if (loadedPartialsCount === totalPartials) {
      loadScripts();
    }
  });
} else {
  loadScripts();
}

window.addEventListener("load", () => {
  const hash = window.location.hash;
  if (hash) {
    setTimeout(() => {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
  }
});
