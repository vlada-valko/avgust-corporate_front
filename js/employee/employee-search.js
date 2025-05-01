console.log("NN")

import { readAllEmployee } from "./employee-read-all.js";
console.log("NN")
    try {
        const response = await readAllEmployee();


        const listContainer = document.querySelector('.elastic');
        const inputField = document.getElementById("elastic");

        if (!Array.isArray(employees) || employees.length === 0) {
            console.warn("Список співробітників порожній або неправильний формат.");
            return;
        }

        // Функція для створення елемента списку
        const createListItem = (employee) => {
            const listItem = document.createElement('li');
            listItem.className = 'hide';

            const link = document.createElement('a');
            const fullName = [employee.lastName, employee.firstName, employee.middleName]
                .filter(Boolean)
                .join(' ');

            const position = employee.position?.name || 'Посада не вказана';
            const department = employee.department?.name || 'Без департаменту';

            link.href = `#${employee.id}`;
            link.textContent = `${fullName} - ${position} (${department})`;

            listItem.appendChild(link);
            return listItem;
        };

        // Додаємо всіх співробітників до списку одразу (не лише при пошуку)
        employees.forEach(emp => {
            const listItem = createListItem(emp);
            listContainer.appendChild(listItem);
        });

        // Обробка пошуку
        inputField.addEventListener('input', () => {
            const val = inputField.value.trim().toLowerCase();
            listContainer.innerHTML = '';

            employees.forEach(emp => {
                const fullName = [emp.lastName, emp.firstName, emp.middleName]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();

                const position = emp.position?.name?.toLowerCase() || '';
                const department = emp.department?.name?.toLowerCase() || '';

                if (
                    fullName.includes(val) ||
                    position.includes(val) ||
                    department.includes(val)
                ) {
                    const listItem = createListItem(emp);
                    listContainer.appendChild(listItem);
                }
            });
        });

        // Очищення поля
        document.querySelector(".clear-button").addEventListener("click", () => {
            inputField.value = "";
            listContainer.innerHTML = '';
        });

        // Перехід по ID
        listContainer.addEventListener('click', (event) => {
            if (event.target.tagName === 'A') {
                event.preventDefault();
                const targetId = event.target.getAttribute('href');
                const card = document.querySelector(targetId);
                if (card) {
                    card.classList.add('active-search-card');
                    window.location.href = targetId;
                }
            }
        });

    } catch (error) {
        console.error("Помилка при отриманні даних:", error);
    }
