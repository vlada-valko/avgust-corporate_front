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
        console.log(data)
        console.log(data.data)

        createUserForm(data.data);
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}
function createUserForm(data) {
    document.querySelector(".create-new-employee__create-user").style.display = "flex";
    const formContainer = document.querySelector(".create-new-employee__create-user");
    formContainer.innerHTML = "";

    // Кнопка закриття
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
    
    const p = document.createElement("p");
    p.className = "title";
    p.innerHTML = `
        <p>
            Дані нового користувача
        </p>
    `;
    formContainer.appendChild( p);

    // Поля форми
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
        errorDiv.id = `${field}-error`;

        formElements[field] = input;
        errorContainers[field] = errorDiv;

        fieldWrapper.appendChild(label);
        fieldWrapper.appendChild(input);
        fieldWrapper.appendChild(errorDiv);

        formContainer.appendChild(fieldWrapper);
    });

    // Кнопка "Зберегти"
    const saveBtnWrapper = document.createElement("div");
    saveBtnWrapper.className = "btn-wrapper-dark";
    saveBtnWrapper.innerHTML = `
        <button class="submit-btn" type="submit">
            <span>Зберегти</span>
        </button>
    `;
    formContainer.appendChild(saveBtnWrapper);
    saveBtnWrapper.addEventListener("click", (event) => {
        event.preventDefault();
        createUser();
    });

    // Кнопка "Співробітника вже створено"
    const skipBtnWrapper = document.createElement("div");
    skipBtnWrapper.className = "btn-wrapper-dark";
    skipBtnWrapper.innerHTML = `
        <button class="skip-btn" type="button">
            <span>Користувача вже створено</span>
        </button>
    `;
    formContainer.appendChild(skipBtnWrapper);
    skipBtnWrapper.addEventListener("click", () => {
        document.querySelector(".create-new-employee__create-user").style.display = "none";
        getCreateEmployeeForms();
    });
}

export async function createUser() {
    try {
        const token = localStorage.getItem("jwt-token");
        const form = document.querySelector(".create-new-employee__create-user");
        const inputs = form.querySelectorAll("input, select, textarea");
        const data = {};

        // Очищуємо всі попередні повідомлення про помилки
        const errorMessages = form.querySelectorAll(".error-message");
        errorMessages.forEach(error => error.textContent = '');

        // Збираємо дані з форми
        inputs.forEach(input => {
            const key = input.name || input.id;
            if (key) {
                data[key] = input.value.trim();
            }
        });

        // Відправляємо запит на сервер
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
    console.error("Помилка при збереженні працівника:", errorData);

    const fieldErrors = errorData.data;
    console.log("Отримані помилки:", fieldErrors);

    if (fieldErrors && typeof fieldErrors === 'object') {
        for (const field in fieldErrors) {
            const errorContainer = document.getElementById(`${field}-error`);
            const fieldElement = document.getElementById(field);

            if (errorContainer) {
                errorContainer.textContent = fieldErrors[field];
            } else {
                console.warn(`Не знайдено контейнер помилки для поля: ${field}`);
            }
        }
    } else {
        console.warn("Поле data у відповіді відсутнє або не є обʼєктом");
    }

    return;
}


        alert("Працівник успішно створений");
        window.location.reload();

    } catch (error) {
        console.error("Помилка відправки запиту:", error);
    }
}

