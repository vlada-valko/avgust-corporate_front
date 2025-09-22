export async function updateDepartment(id) {
    try {
        const token = localStorage.getItem("jwt-token");
        const response = await fetch(`http://localhost:8080/departments/${id}/edit`, {
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
        console.log("Update form data:", data);

        renderDepartmentUpdateForm(data);

    } catch (error) {
        console.error("Помилка при завантаженні форми:", error);
    }
}

async function renderDepartmentUpdateForm(data) {
    const updateDepartmentContainer = document.querySelector(".entity-update-block");
    updateDepartmentContainer.classList.add("visible");

    document.querySelector(".entity-update-block .close-btn").addEventListener(
        "click", () => {
            updateDepartmentContainer.classList.remove("visible");
        }
    );

    if (!data || Object.keys(data.data).length === 0) {
        updateDepartmentContainer.innerHTML = "<p>Дані відсутні.</p>";
        return;
    }

    const form = document.createElement("form");
    form.classList.add("entity-update-form");
    updateDepartmentContainer.innerHTML = ""; // очищаємо попередній вміст
    updateDepartmentContainer.appendChild(form);

    // 🔑 тут буде зберігатись все для відправки
    const formData = {};
    formData.id = data.data.id;

    // підключаємо мапінг
    const mappingModule = await import("../mapping/department-mapping.js");
    const fieldMapping = mappingModule.fieldNameMapping;

    for (const [key, value] of Object.entries(data.data)) {
        if (key === "employees" || key === "positions" || key === "managerName" || key === "id") continue;

        const label = document.createElement("label");
        label.classList.add("title");
        const labelText = fieldMapping[key] || key;
        label.textContent = `${labelText.charAt(0).toUpperCase() + labelText.slice(1)}:`;

        if (key === "managerId") {
            const select = document.createElement("select");
            select.name = key;

            const option = document.createElement("option");
            option.value = value;
            option.textContent = data.data.managerName || "Невідомо";
            select.appendChild(option);

            form.appendChild(label);
            form.appendChild(select);

            // ✅ одразу кладемо початкове значення
            formData[key] = value;

            select.addEventListener("change", () => {
                formData[key] = select.value;
            });
        } else {
            const input = document.createElement("input");
            input.name = key;
            input.value = value || "";
            form.appendChild(label);
            form.appendChild(input);

            // ✅ одразу кладемо початкове значення
            formData[key] = input.value;
            

            input.addEventListener("input", () => {
                formData[key] = input.value;
            });
        }
    }

    // кнопка збереження
    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.textContent = "Зберегти";
    saveButton.classList.add("save-button");
    form.appendChild(saveButton);

    saveButton.addEventListener("click", async () => {
        try {
            const token = localStorage.getItem("jwt-token");
            const response = await fetch(`http://localhost:8080/departments/${data.data.id}/edit`, {
                method: "PUT",
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
                displayErrors(errorData, fieldMapping);
            }
        } catch (error) {
            console.error("Помилка відправки:", error);
        }
    });
}


// Показ повідомлень про помилки біля відповідних полів
function displayErrors(errors, fieldMapping = {}) {
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
