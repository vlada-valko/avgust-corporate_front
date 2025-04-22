   // Функція для входу
   document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();  

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok && data['jwt-token']) {
            
            errorMessage.style.display = 'none';
            localStorage.setItem('jwt-token', data['jwt-token']);
            localStorage.setItem('userId', data['userId']);
            localStorage.setItem('userRole', data['userRole']);

            
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
            window.history.replaceState({}, "", "/index.html");
            location.reload(); 

        } else {
            errorMessage.textContent = 'Неправильний логін або пароль';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error during login:', error);
        errorMessage.textContent = 'Помилка підключення до сервера';
        errorMessage.style.display = 'block';
    }
});