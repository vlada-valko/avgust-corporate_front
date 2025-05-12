import { employeeFieldMapping } from './employee-mapping.js';

export async function getCreateEmployeeForms() {
    try {
        const token = localStorage.getItem("jwt-token");
        const response = await fetch("http://localhost:8080/employees/new", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`Помилка завантаження даних: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data)
        createEmployeeForm(data);
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
    
}

function createEmployeeForm(data) {
    const formContainer = document.querySelector(".create-new-employee__create-employee");
    formContainer.innerHTML = ""; // Очищаємо форму перед її рендерингом

    const errorContainers = {}; // Об'єкт для зберігання контейнерів помилок

    const selectFields = {
        department: data.departments,
        position: data.positions,
        workplaceType: data.workplaceTypes,
        gender: data.genders,
        role: data.roles,
    };

    // Створюємо select для користувачів
    const userFieldWrapper = document.createElement("div");
    userFieldWrapper.className = "form-field";

    const userLabel = document.createElement("label");
    userLabel.htmlFor = "user";
    userLabel.classList.add("main-text");
    userLabel.textContent = "Користувач";

    const userSelect = document.createElement("select");
    userSelect.id = "user";
    userSelect.name = "user";

    // Додаємо опції для користувачів
    data.users.forEach(user => {
        const option = document.createElement("option");
        option.value = user;
        option.textContent = user;
        userSelect.appendChild(option);
    });

    // Додаємо label і select для користувачів
    userFieldWrapper.appendChild(userLabel);
    userFieldWrapper.appendChild(userSelect);

    // Додаємо контейнер помилки для користувача
    const userErrorDiv = document.createElement("div");
    userErrorDiv.className = "error-message";
    userErrorDiv.id = "user-error";  // Унікальний ID для контейнера помилки користувача
    userFieldWrapper.appendChild(userErrorDiv);

    formContainer.appendChild(userFieldWrapper); // Додаємо поле користувача в форму

    // Обробляємо інші поля форми
    for (const field in data.createEmployeeForm) {
        if (!employeeFieldMapping[field]) continue;

        const fieldWrapper = document.createElement("div");
        fieldWrapper.className = "form-field";

        const label = document.createElement("label");
        label.htmlFor = field;
        label.classList.add("main-text");
        label.textContent = employeeFieldMapping[field];

        let input;

        if (selectFields[field] && selectFields[field].length > 0) {
            input = document.createElement("select");
            input.id = field;
            input.name = field;

            // Додаємо опції в select для інших полів
            selectFields[field].forEach(optionValue => {
                const option = document.createElement("option");
                option.value = optionValue;
                option.textContent = optionValue;
                input.appendChild(option);
            });
        } else if (field === "residentialAddress") {
            // Спеціальний випадок для адреси
            const addressWrapper = document.createElement("div");
            addressWrapper.className = "form-field address-field";

            const addressLabel = document.createElement("label");
            addressLabel.htmlFor = "address";
            addressLabel.classList.add("main-text");
            addressLabel.textContent = "Адреса:";

            const addressFields = [
                { id: "country", placeholder: "Країна" },
                { id: "city", placeholder: "Місто" },
                { id: "street", placeholder: "Вулиця" },
                { id: "houseNumber", placeholder: "Будинок" },
                { id: "apartmentNumber", placeholder: "Квартира" },
            ];

            addressFields.forEach(subField => {
                const subInput = document.createElement("input");
                subInput.id = subField.id;
                subInput.name = subField.id;
                subInput.placeholder = subField.placeholder;
                subInput.type = "text";
                addressWrapper.appendChild(subInput);
            });

            formContainer.appendChild(addressLabel);
            formContainer.appendChild(addressWrapper);
            continue;
        } else {
            // Інші типи полів
            input = document.createElement("input");
            input.id = field;
            input.name = field;
            input.type =
                field === "dateOfBirth" ? "date" :
                field === "photo" ? "file" :
                field.includes("Email") ? "email" :
                field.includes("Mobile") || field === "internalPhone" || field === "corporateMobile" ? "tel" :
                "text";

            if (input.type === "tel") {
                input.pattern = "\\(\\d{3}\\)-\\d{3}-\\d{2}-\\d{2}";
                const mask = new Inputmask("(999)-999-99-99");
                mask.mask(input);
            }

            if (input.type === "email") {
                const mask = new Inputmask("email");
                mask.mask(input);
            }
        }

        // Додаємо label і input
        fieldWrapper.appendChild(label);
        fieldWrapper.appendChild(input);

        // Додаємо контейнер помилки з унікальним ID
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.id = `${field}-error`;  // Унікальний ID для контейнера помилки
        fieldWrapper.appendChild(errorDiv);
        errorContainers[field] = errorDiv;

        formContainer.appendChild(fieldWrapper);
    }

    const btnWrapper = document.createElement("div");
    btnWrapper.className = "btn-wrapper-dark";
    btnWrapper.innerHTML = `
        <button class="submit-btn" type="submit">
            <span>Зберегти</span>
        </button>
    `;
    formContainer.appendChild(btnWrapper);

    btnWrapper.addEventListener("click", (event) => {
        event.preventDefault(); 
        createEmployee(); // викликаємо функцію для створення працівника
    });
}

export async function createEmployee() {
    try {
        const token = localStorage.getItem("jwt-token");
        const form = document.querySelector(".create-new-employee__create-employee");
        const inputs = form.querySelectorAll("input, select, textarea");
        const data = {};

        const errorMessages = form.querySelectorAll(".error-message");
        errorMessages.forEach(error => error.textContent = '');

        // Зібрати дані з форми
        inputs.forEach(input => {
            const key = input.name || input.id;
            if (!key) return;
            data[key] = input.value.trim();
        });

        // Додати userId до даних
        data.userId = userId;

        // Відправка даних на сервер
        const response = await fetch("http://localhost:8080/employees/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Помилка при збереженні працівника:", errorData);

            // Виведення помилок для всіх полів
            for (const field in errorData) {
                const fieldElement = document.getElementById(field); // Використовуємо ID
                if (!fieldElement) {
                    console.error(`Не знайдено елемент для поля: ${field}`);
                    continue;
                }

                const errorContainer = document.getElementById(`${field}-error`); // Використовуємо ID контейнера помилки
                if (errorContainer) {
                    errorContainer.textContent = errorData[field];
                } else {
                    console.log(`Не знайдено контейнер для помилки для поля: ${field}`);
                }
            }
        } else {
            alert("Працівник успішно створений");
        }
    } catch (error) {
        console.error("Помилка відправки запиту:", error);
    }
}







