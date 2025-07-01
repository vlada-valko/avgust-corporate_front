const logoutLink = document.getElementById("logout-link");
logoutLink.addEventListener("click", () => {
  // Показати підтвердження
  const isConfirmed = window.confirm("Точно хочете вийти?");

  if (isConfirmed) {
    // Видалити токен із localStorage
    localStorage.removeItem("jwt-token");
    window.history.replaceState({}, "", "/index.html");
    location.reload(); 
  }
});
