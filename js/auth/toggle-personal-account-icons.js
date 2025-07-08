const loginLink = document.getElementById("login");
const personalaccount = document.getElementById("personal-account-icon");
const token = localStorage.getItem("jwt-token");


if (!token) {
    loginLink.style.display = "flex";
    personalaccount.style.display = "none";
  } else {
    loginLink.style.display = "none";
    personalaccount.style.display = "flex";
  }