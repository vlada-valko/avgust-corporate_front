    const loginButton = document.getElementById('login');
    const closeBtn = document.getElementById('closeBtn');
    const loginPage = document.getElementById('loginPage');
    const overlay = document.getElementById('overlay');
    if (loginButton) {
        loginButton.addEventListener('click', function(event) {
            event.preventDefault();
            loginPage.style.display = 'block';  // Показуємо форму
            overlay.style.display = 'block';    // Показуємо оверлей
        });

        closeBtn.addEventListener('click', function() {
            loginPage.style.display = 'none';  // Ховаємо форму
            overlay.style.display = 'none';    // Ховаємо оверлей
        });

        overlay.addEventListener('click', function(event) {
            if (event.target === this) {
                loginPage.style.display = 'none';
                overlay.style.display = 'none';
            }
        });
    } else {
        console.error("❌ Не знайдені необхідні елементи для обробки подій.");
    }

