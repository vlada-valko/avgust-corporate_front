function showCreateDepartmentAbility() {
    if (localStorage.getItem("jwt-token")) {
        const userRole = localStorage.getItem("userRole");
        if (userRole !== "ROLE_MANAGER" && userRole !== "ROLE_ADMIN") {
            document.querySelector(".create-department-btn").style.display = "none";
        }
    }
}

// Показ/приховування форми та її ініціалізація
function showCreateDepartmentBlock() {
    const container = document.querySelector(".create-department-container");
    container.classList.toggle("visible");

    if (container.classList.contains("visible")) {
        createDepartment(); // форма створюється тільки при відкритті
    }
}

// Основна логіка завантаження форми створення
async function createDepartment() {
    try {
        const token = localStorage.getItem("jwt-token");
        const response = await fetch("http://localhost:8080/departments/new", {
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
        renderUserData(data);

    } catch (error) {
        console.error("Помилка при завантаженні форми:", error);
    }
}

// Генерація форми та відправка на сервер
function renderUserData(data) {
    const createDepartmentContainer = document.querySelector(".create-department-container");
    createDepartmentContainer.innerHTML = "";

    if (!data.department) {
        createDepartmentContainer.innerHTML = "<p>Дані відсутні.</p>";
        return;
    }

    const form = document.createElement("form");
    form.classList.add("department-create-form");
    createDepartmentContainer.appendChild(form);

    const formData = {};

    for (const [key, value] of Object.entries(data.department)) {
        if (key === "employees" || key === "positions") continue;

        const label = document.createElement("label");
        label.classList.add("title");
        const labelText = fieldMapping[key] || key;
        label.textContent = `${labelText.charAt(0).toUpperCase() + labelText.slice(1)}:`;

        if (key === "manager") {
            const select = document.createElement("select");
            select.name = key;
            form.appendChild(label);
            form.appendChild(select);
            select.addEventListener("change", () => {
                formData[key] = select.value;
            });
        } else {
            const input = document.createElement("input");
            input.name = key;
            input.value = value || "";
            form.appendChild(label);
            form.appendChild(input);
            input.addEventListener("input", () => {
                formData[key] = input.value;
            });
        }
    }

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.textContent = "Зберегти";
    saveButton.classList.add("save-button");
    form.appendChild(saveButton);

    saveButton.addEventListener("click", async () => {
        try {
            const token = localStorage.getItem("jwt-token");
            const response = await fetch("http://localhost:8080/departments", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const text = await response.text();
                alert(text);
                setTimeout(() => window.location.reload(), 500);
            } else {
                const errorData = await response.json();
                console.error("Помилки на сервері:", errorData);
                displayErrors(errorData);
            }
        } catch (error) {
            console.error("Помилка відправки:", error);
        }
    });
}

// Показ повідомлень про помилки біля відповідних полів
function displayErrors(errors) {
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach((e) => e.remove());

    for (const [field, message] of Object.entries(errors)) {
        const fieldName = fieldMapping[field] || field;
        const inputField = document.querySelector(`[name="${field}"]`);
        if (inputField) {
            const errorMessage = document.createElement("span");
            errorMessage.classList.add("error-message");
            errorMessage.textContent = message;
            inputField.insertAdjacentElement("afterend", errorMessage);
        }
    }
}

// 1. Перевіряємо права
showCreateDepartmentAbility();

// 2. Навішуємо обробник на кнопку
document.querySelector(".create-department-btn").addEventListener("click", showCreateDepartmentBlock);
