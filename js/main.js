async function loadScripts() {

  try {
    // Завантажуємо бібліотеку slick
    await import("./slick.min.js");

    await import("./personal-account/user-profile-view.js");
    await import("./personal-account/edit-user.js");

    /* HEADER */
    await import("./header/toggle-personal-account-icons.js");
    await import("./header/menu.js");
    await import("./header/show-login-block.js");
    await import("./header/login.js");
    await import("./header/logout.js");

    /* INDEX */
    await import("./index/index-carousel.js");
    await import("./index/index-avgust-in-numbers-counter.js");
        /*EMPLOYEE*/
        await import("./employee/employee-mapping.js");
        await import("./employee/employee-read-all.js");
        await import("./employee/employee-create.js");
        await import("./employee/employee-read-by-id.js");
        await import("./employee/employee-delete.js");
    /*DEPARTMENTS*/
    await import("./department/department-mapping.js");
    await import("./department/department-read-all.js");
    await import("./department/department-create.js");
    await import("./department/department-read-by-id.js");
    await import("./department/department-delete.js");


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
