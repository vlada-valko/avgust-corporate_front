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
console.log(username, password)
        const data = await response.json();
        console.log(response)
        console.log(data)

        if (response.ok && data.status === 'success' && data.data) {
          localStorage.setItem("jwt-token", data.data.token); 
          localStorage.setItem("userRole", data.data.userRole); 

            errorMessage.style.display = 'none';

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

if(localStorage.getItem('jwt-token') === undefined) {
     localStorage.removeItem("jwt-token");
    window.history.replaceState({}, "", "/index.html");
    location.reload(); 
}
