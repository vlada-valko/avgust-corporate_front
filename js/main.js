async function loadScripts() {

  try {
  //  SLICK
  try {
    await import("./slick.min.js");
  } catch (err) {
    console.error("❌ Помилка під час імпорту ./slick.min.js:", err);
  }
  
  //HEADER
  try {
    await import("./header/login.js");
  } catch (err) {
    console.error("❌ Помилка під час імпорту ./header/login.js:", err);
  }
  try {
    await import("./header/logout.js");
  } catch (err) {
    console.error("❌ Помилка під час імпорту ./header/logout.js:", err);
  }
  try {
    await import("./header/menu.js");
  } catch (err) {
    console.error("❌ Помилка під час імпорту ./header/menu.js:", err);
  }
  try {
    await import("./header/show-login-block.js");
  } catch (err) {
    console.error("❌ Помилка під час імпорту ./header/show-login-block.js:", err);
  }
  try {
    await import("./header/toggle-personal-account-icons.js");
  } catch (err) {
    console.error("❌ Помилка під час імпорту ./header/toggle-personal-account-icons.js:", err);
  }

//INDEX
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

//EMPLOYEE
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
  await import("./employee/employee-mapping.js");
} catch (err) {
  console.error("❌ Помилка під час імпорту ./employee/employee-mapping.js:", err);
}
try {
  await import("./employee/employee-read-all.js");
} catch (err) {
  console.error("❌ Помилка під час імпорту ./employee/employee-read-all.js:", err);
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


//ADITIONAL CSS
try {
  await import("./additional-js/documents-view-accordeon.js");
} catch (err) {
  console.error("❌ Помилка під час імпорту ./additional-js/documents-view-accordeon.js:", err);
}

  } catch (error) {
  }
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
