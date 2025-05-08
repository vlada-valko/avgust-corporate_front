
import { employeeFieldMapping } from './employee-mapping.js';

export async function getCreateUserAndEmployeeForms() {
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
        createEmployeeForm(data.createEmployeeForm);
        console.log(data.createEmployeeForm)
        return data; 
    } catch (error) {
        console.error(error);
        return [];
    }
}
getCreateUserAndEmployeeForms();

function createEmployeeForm(data) {
    const formContainer = document.querySelector(".create-new-employee__create-employee");
    formContainer.innerHTML = ""; // очищаємо контейнер перед рендером

    for (const field in data) {
        if (!employeeFieldMapping[field]) continue;

        const fieldWrapper = document.createElement("div");
        fieldWrapper.className = "form-field";

        const label = document.createElement("label");
        label.htmlFor = field;
        label.textContent = employeeFieldMapping[field];

        const input = document.createElement("input");
        input.id = field;
        input.name = field;
        input.type =
            field === "dateOfBirth" ? "date" :
            field === "photo" ? "file" :
            field.includes("Email") ? "email" :
            field.includes("Mobile") || field === "internalPhone" || field === "corporateMobile" ? "tel" :
            "text";

        // Для телефонів додаємо маску
        if (input.type === "tel") {
            input.pattern = "\\(\\d{3}\\)-\\d{3}-\\d{2}-\\d{2}";
            const mask = new Inputmask("(999)-999-99-99");
            mask.mask(input);
        }

        // Для email використовуємо маску Inputmask
        if (input.type === "email") {
            const mask = new Inputmask("email");
            mask.mask(input);
        }

        // Створюємо блок для адреси тільки один раз
        if (field === "residentialAddress") {
            const addressWrapper = document.createElement("div");
            addressWrapper.className = "form-field";

            // Створюємо лейбл для адреси
            const addressLabel = document.createElement("label");
            addressLabel.htmlFor = "address";
            addressLabel.textContent = "Адреса:";

            // Окремі інпути для кожної частини адреси
            const addressFields = [
                { id: "country", placeholder: "Країна" },
                { id: "city", placeholder: "Місто" },
                { id: "street", placeholder: "Вулиця" },
                { id: "houseNumber", placeholder: "Будинок" },
                { id: "apartmentNumber", placeholder: "Квартира" },
            ];

            // Створюємо інпути для кожної частини адреси
            addressFields.forEach(field => {
                const input = document.createElement("input");
                input.id = field.id;
                input.name = field.id;
                input.placeholder = field.placeholder;
                input.type = "text";
                addressWrapper.appendChild(input);
            });

            formContainer.appendChild(addressLabel); // додаємо лейбл для адреси
            formContainer.appendChild(addressWrapper); // додаємо блок з інпутами для адреси
        } else {
            fieldWrapper.appendChild(label);
            fieldWrapper.appendChild(input);
            formContainer.appendChild(fieldWrapper);
        }
    }
}
