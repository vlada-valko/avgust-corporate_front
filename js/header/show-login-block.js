document.getElementById('login').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('loginPage').style.display = 'block';  // Показуємо форму
    document.getElementById('overlay').style.display = 'block';    // Показуємо оверлей
});

document.getElementById('closeBtn').addEventListener('click', function() {
    document.getElementById('loginPage').style.display = 'none';  // Ховаємо форму
    document.getElementById('overlay').style.display = 'none';    // Ховаємо оверлей
});
document.getElementById('overlay').addEventListener('click', function(event) {
if (event.target === this) {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}
});