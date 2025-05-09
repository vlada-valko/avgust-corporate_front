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
        createEmployeeForm(data);
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}
function createEmployeeForm(data) {
    document.querySelector(".create-new-employee__container").classList.add("visible");
    const formContainer = document.querySelector(".create-new-employee__create-employee");
    formContainer.innerHTML = "";

    // Додаємо кнопку закриття
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
    })

    // Рендеримо поля форми
    for (const field in data.createEmployeeForm) {
        if (!employeeFieldMapping[field]) continue;

        const fieldWrapper = document.createElement("div");
        fieldWrapper.className = "form-field";

        const label = document.createElement("label");
        label.htmlFor = field;
        label.classList.add("main-text");
        label.textContent = employeeFieldMapping[field];

        const selectFields = {
            department: data.departments,
            position: data.positions,
            workplaceType: data.workplaceTypes,
            gender: data.genders,
            role: data.roles
        };

        if (selectFields[field]) {
            const select = document.createElement("select");
            select.id = field;
            select.name = field;

            selectFields[field].forEach(optionValue => {
                const option = document.createElement("option");
                option.value = optionValue;
                option.textContent = optionValue;
                select.appendChild(option);
            });

            fieldWrapper.appendChild(label);
            fieldWrapper.appendChild(select);
            formContainer.appendChild(fieldWrapper);
            continue;
        }

        const input = document.createElement("input");
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

        if (field === "residentialAddress") {
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
        } else {
            fieldWrapper.appendChild(label);
            fieldWrapper.appendChild(input);
            formContainer.appendChild(fieldWrapper);
        }
    }

    // Додаємо кнопку Вхід
    const btnWrapper = document.createElement("div");
    btnWrapper.className = "btn-wrapper-dark";
    btnWrapper.innerHTML = `
        <button class="submit-btn" type="submit">
            <span>Зберегти</span>
        </button>
    `;
    formContainer.appendChild(btnWrapper);
}
