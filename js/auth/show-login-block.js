  const loginButton = document.getElementById('login');
const closeBtn = document.getElementById('closeBtn');
const loginPage = document.getElementById('loginPage');
const overlay = document.getElementById('overlay');

// Перевіряємо всі потрібні елементи
if (loginButton && closeBtn && loginPage && overlay) {
    loginButton.addEventListener('click', function(event) {
        event.preventDefault();
        loginPage.style.display = 'block';
        overlay.style.display = 'block';
    });

    closeBtn.addEventListener('click', function() {
        loginPage.style.display = 'none';
        overlay.style.display = 'none';
    });

    overlay.addEventListener('click', function(event) {
        if (event.target === this) {
            loginPage.style.display = 'none';
            overlay.style.display = 'none';
        }
    });
} else {
    console.error("❌ Один або кілька елементів loginPage / overlay / closeBtn не знайдені у DOM.");
}
