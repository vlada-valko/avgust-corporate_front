const loginLink = document.getElementById("login");
const personalAccount = document.getElementById("personal-account-icon");
const token = localStorage.getItem("jwt-token");

if (!token) {
    loginLink.style.display = "flex";
    personalAccount.style.display = "none";
  } else {
    loginLink.style.display = "none";
    personalAccount.style.display = "flex";
  }