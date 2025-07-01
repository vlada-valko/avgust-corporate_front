import { readAllEmployee } from "./employee-read-all.js";
if(document.getElementById("elastic")) {

(async () => {
    try {
        const response = await readAllEmployee();
        const employees = response.data;

        const listContainer = document.querySelector('.elastic');
        const inputField = document.getElementById("elastic");

        if (!Array.isArray(employees) || employees.length === 0) {
            console.warn("Список співробітників порожній або неправильний формат.");
            return;
        }

        // Створення елементів списку одразу
        employees.forEach(emp => {
            const listItem = document.createElement('li');
            listItem.classList.add('hide');
            listItem.setAttribute('data-id', emp.id);

            const link = document.createElement('a');
            const fullName = [emp.lastName, emp.firstName, emp.middleName]
                .filter(Boolean)
                .join(' ');

            const position = emp.position?.name || 'Посада не вказана';
            const department = emp.department?.name || 'Без департаменту';

            link.href = `#${emp.id}`;
            link.textContent = `${fullName} - ${position} (${department})`;

            listItem.appendChild(link);
            listContainer.appendChild(listItem);
        });

        // Обробка пошуку
        inputField.addEventListener('input', () => {
            const val = inputField.value.trim().toLowerCase();

            employees.forEach(emp => {
                const fullName = [emp.lastName, emp.firstName, emp.middleName]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();

                const position = emp.position?.name?.toLowerCase() || '';
                const department = emp.department?.name?.toLowerCase() || '';

                const matches =
                    fullName.includes(val) ||
                    position.includes(val) ||
                    department.includes(val);

                const listItem = listContainer.querySelector(`li[data-id='${emp.id}']`);
                if (listItem) {
                    if (matches) {
                        listItem.classList.remove('hide');
                    } else {
                        listItem.classList.add('hide');
                    }
                }
            });
        });

        // Очищення поля
        document.querySelector(".clear-button").addEventListener("click", () => {
            inputField.value = "";
            employees.forEach(emp => {
                const listItem = listContainer.querySelector(`li[data-id='${emp.id}']`);
                if (listItem) {
                    listItem.classList.add('hide');
                }
            });
        });
// Перехід по ID
listContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').slice(1); // Видаляємо '#'
        
        // Знімаємо клас з усіх карток
        const allCards = document.querySelectorAll('.employee-list__item');
        allCards.forEach(card => card.classList.remove('active-search-card'));

        const card = document.getElementById(targetId); // Використовуємо getElementById
        if (card) {
            card.classList.add('active-search-card');
            card.scrollIntoView({ behavior: 'smooth' }); // Прокручуємо до картки
        }
    }
});

// Знімати клас при кліку в іншому місці
document.addEventListener('click', (event) => {
    const card = document.querySelector('.active-search-card');
    
    // Перевірка, чи клікаємо не на картці, не на посиланні і не на елементах списку
    if (card && !card.contains(event.target) && !listContainer.contains(event.target)) {
        // Якщо клікаємо не на картці і не на елементах списку, знімаємо клас з усіх карток
        const allCards = document.querySelectorAll('.employee-list__item');
        allCards.forEach(card => card.classList.remove('active-search-card'));
    }
});





    } catch (error) {
        console.error("Помилка при отриманні даних:", error);
    }
})();
}