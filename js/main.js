function init() {
  import("./slick.min.js");
  /* HEADER */
  import("./header/toggle-personal-account-icons.js");
  import("./header/menu.js");
  import("./header/show-login-block.js");
  import("./header/login.js");
  
  /* INDEX */
  import("./index/index-carousel.js");  
  import("./index/index-avgust-in-numbers-counter.js")

}

const totalPartials = document.querySelectorAll('[hx-trigger="load"], [data-hx-trigger="load"]').length;
let loadedPartialsCount = 0;

document.body.addEventListener('htmx:afterOnLoad', () => {
  loadedPartialsCount++;
  if (loadedPartialsCount === totalPartials) init();
});
