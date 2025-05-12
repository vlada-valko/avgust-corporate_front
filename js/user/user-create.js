import { userFieldMapping } from './user-mapping.js';
import { getCreateEmployeeForms } from '../employee/employee-create.js';

export async function getCreateUserForms() {
    try {
        const token = localStorage.getItem("jwt-token");
        const response = await fetch("http://localhost:8080/users/new", {
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
        createUserForm(data);
        getCreateEmployeeForms();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}
function createUserForm(data) {
    document.querySelector(".create-new-employee__container").classList.add("visible");
    const formContainer = document.querySelector(".create-new-employee__create-user");
    formContainer.innerHTML = "";

    const closeBtnWrapper = document.createElement("div");
    closeBtnWrapper.className = "close-btn";
    closeBtnWrapper.innerHTML = `
        <button>
            <img src="/img/close.png" alt="close-cross">
        </button>
    `;
    formContainer.appendChild(closeBtnWrapper);
    closeBtnWrapper.addEventListener("click", () => {
        document.querySelector(".create-new-employee__container").classList.remove("visible");
    });

    const roleOptions = data.roles || [];
    const fields = ['username', 'password', 'confirmPassword', 'role'];
    const formElements = {};
    const errorContainers = {};

    fields.forEach(field => {
        const fieldWrapper = document.createElement("div");
        fieldWrapper.className = "form-field";

        const label = document.createElement("label");
        label.htmlFor = field;
        label.classList.add("main-text");
        label.textContent = userFieldMapping[field] || field;

        let input;

        if (field === 'role') {
            input = document.createElement("select");
            if (roleOptions.length > 0) {
                roleOptions.forEach(role => {
                    const option = document.createElement("option");
                    option.value = role;
                    option.textContent = role;
                    input.appendChild(option);
                });
            } else {
                const noRolesOption = document.createElement("option");
                noRolesOption.textContent = "Ролі недоступні";
                input.appendChild(noRolesOption);
            }
        } else {
            input = document.createElement("input");
            input.type = field.toLowerCase().includes("password") ? "password" : "text";
        }

        input.id = field;
        input.name = field;

        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.id = `${field}-error`; // Унікальний ID для кожної помилки
        errorContainers[field] = errorDiv;

        formElements[field] = input;

        fieldWrapper.appendChild(label);
        fieldWrapper.appendChild(input);
        fieldWrapper.appendChild(errorDiv); 
        formContainer.appendChild(fieldWrapper);
    });

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
        createUser();
    });
}
export async function createUser() {
    try {
        const token = localStorage.getItem("jwt-token");
        const form = document.querySelector(".create-new-employee__create-user");
        const inputs = form.querySelectorAll("input, select, textarea");
        const data = {};

        // Очистити попередні помилки
        const errorMessages = form.querySelectorAll(".error-message");
        errorMessages.forEach(error => error.textContent = '');

        // Зібрати дані з форми
        inputs.forEach(input => {
            const key = input.name || input.id;
            if (!key) return;
            data[key] = input.value.trim();
        });

        // Відправка даних на сервер
        const response = await fetch("http://localhost:8080/users/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Помилка при збереженні користувача:", errorData);

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
            return null; // Якщо користувача не створено, повертаємо null
        } else {
            alert("Користувач успішно створений");
            const createdUser = await response.json();
            console.log("Створений користувач ID:", createdUser.createdUserId);
            return createdUser.createdUserId; // Повертаємо ID створеного користувача
        }
    } catch (error) {
        console.error("Помилка відправки запиту:", error);
        return null; // Повертаємо null у випадку помилки
    }
}

