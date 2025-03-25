async function loadScripts() {
  console.log("🔄 Ініціалізація скриптів...");

  try {
    // Завантажуємо бібліотеку slick
    console.log("Завантаження slick.min.js...");
    await import("./slick.min.js");

    // Завантажуємо скрипт для персонального акаунту
    console.log("Завантаження user-profile-view.js...");
    await import("./personal-account/user-profile-view.js");

    /* HEADER */
    console.log("Завантаження header скриптів...");
    await import("./header/toggle-personal-account-icons.js");
    await import("./header/menu.js");
    await import("./header/show-login-block.js");
    await import("./header/login.js");
    await import("./header/logout.js");

    /* INDEX */
    console.log("Завантаження index скриптів...");
    await import("./index/index-carousel.js");
    await import("./index/index-avgust-in-numbers-counter.js");

    console.log("✅ Всі скрипти завантажені!");
  } catch (error) {
    console.error("❌ Помилка при завантаженні скриптів:", error);
  }
}

const totalPartials = document.querySelectorAll('[hx-trigger="load"], [data-hx-trigger="load"]').length;
let loadedPartialsCount = 0;

if (totalPartials > 0) {
  document.body.addEventListener("htmx:afterOnLoad", () => {
    loadedPartialsCount++;
    if (loadedPartialsCount === totalPartials) {
      console.log("🔄 Всі частини HTMX завантажені, запускаємо скрипти...");
      loadScripts();
    }
  });
} else {
  console.log("⚡ Немає HTMX-завантажень, запускаємо скрипти відразу...");
  loadScripts();
}
