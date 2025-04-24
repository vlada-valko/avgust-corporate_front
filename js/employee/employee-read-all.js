// import { readDepartmentById } from "./read-by-id.js";

async function readAllEmployee() {
    try {
        const token = localStorage.getItem("jwt-token");
        const response = await fetch("http://localhost:8080/employees/all", {
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
        console.log(data);
        renderEmployeeCards(data.employees);
    } catch (error) {
        console.error(error);
    }
}

function renderEmployeeCards(employees) {
    const container = document.querySelector(".our-team__container");
    container.innerHTML = "";

    if (!employees || employees.length === 0) {
        container.innerHTML = "<p>Дані відсутні.</p>";
        return;
    }

    employees.forEach(employee => {
        const card = document.createElement("div");
        card.classList.add("our-team__card");

        // Photo Wrapper
        const photoWrapper = document.createElement("div");
        photoWrapper.classList.add("our-team__person-photo");

        const photoForm = document.createElement("form");
        const photoInput = document.createElement("input");
        photoInput.type = "image";
        photoInput.id = "image";
        photoInput.alt = "photo";
        const base64Data = employee.photo;
        photoInput.src = base64Data !== null ? 
          `data:image/jpeg;base64,${base64Data}` 
          :  "/img/team/default.jpg"; 
        photoInput.style = "pointer-events: none; cursor: default";
        photoForm.appendChild(photoInput);
        photoWrapper.appendChild(photoForm);

        // Info Wrapper
        const infoWrapper = document.createElement("div");
        infoWrapper.classList.add("our-team__person-info");

        const infoForm = document.createElement("form");

        const nameGroup = document.createElement("div");
        nameGroup.classList.add("form-group");

        const lastNameInput = document.createElement("input");
        lastNameInput.type = "text";
        lastNameInput.id = "lastName";
        lastNameInput.value = employee.lastName || "Без прізвища";
        lastNameInput.classList.add("title");
        lastNameInput.readOnly = true;

        const firstNameInput = document.createElement("input");
        firstNameInput.type = "text";
        firstNameInput.id = "firstName";
        firstNameInput.value = employee.firstName || "Без імені";
        firstNameInput.classList.add("title");
        firstNameInput.readOnly = true;

        const middleNameInput = document.createElement("input");
        middleNameInput.type = "text";
        middleNameInput.id = "middleName";
        middleNameInput.value = employee.middleName || "Без по батькові";
        middleNameInput.classList.add("title");
        middleNameInput.readOnly = true;

        nameGroup.appendChild(lastNameInput);
        nameGroup.appendChild(firstNameInput);
        nameGroup.appendChild(middleNameInput);

        const positionGroup = document.createElement("div");
        positionGroup.classList.add("form-group");

        const positionInput = document.createElement("input");
        positionInput.type = "text";
        positionInput.id = "position";
        positionInput.value = employee.position || "Не вказано";
        positionInput.classList.add("main-text");
        positionInput.readOnly = true;

        const experienceInput = document.createElement("input");
        experienceInput.type = "text";
        experienceInput.id = "experience";
        const experience = Date.now() - new Date(employee.employmentStartDate).getTime();
        const yearsExperience = experience / (1000 * 60 * 60 * 24 * 365.25);    
        experienceInput.value =  employee.employmentStartDate === null 
        ? "Не вказано" 
        : (Math.floor(yearsExperience)) + " роки досвіду";
        experienceInput.classList.add("main-text");
        experienceInput.readOnly = true;

        positionGroup.appendChild(positionInput);
        positionGroup.appendChild(experienceInput);

        infoForm.appendChild(nameGroup);
        infoForm.appendChild(positionGroup);

        infoWrapper.appendChild(infoForm);

        // Contact Wrapper
        const contactWrapper = document.createElement("div");
        contactWrapper.classList.add("our-team__person-contacts");

        // Phone Icon
        const callIcon = document.createElement("div");
        callIcon.classList.add("contact-icon");
        const callLink = document.createElement("a");
        callLink.href = "tel:" + employee.personalMobile;  // Додаємо номер телефону
        const callImg = document.createElement("img");
        callImg.src = "/img/call.png";
        callImg.alt = "call";
        callLink.title = `Телефон: ${employee.personalMobile || "не вказано"}`;
        callLink.appendChild(callImg);
        const callText = document.createElement("span");
        callText.innerText = employee.personalMobile || "Телефон не вказано";  // Текст для телефону
        callIcon.appendChild(callLink);
        callIcon.appendChild(callText);

        // Email Icon
        const emailIcon = document.createElement("div");
        emailIcon.classList.add("contact-icon");
        const emailLink = document.createElement("a");
        emailLink.href = `mailto:${employee.personalEmail}`;  // Додаємо email
        const emailImg = document.createElement("img");
        emailImg.src = "/img/email.png";
        emailImg.alt = "email";
        emailLink.appendChild(emailImg);
        const emailText = document.createElement("span");
        emailText.innerText = employee.personalEmail || "Email не вказано";  // Текст для email
        emailText.title = `Пошта: ${employee.personalEmail || "не вказано"}`;
        emailIcon.appendChild(emailLink);
        emailIcon.appendChild(emailText);

        contactWrapper.appendChild(callIcon);
        contactWrapper.appendChild(emailIcon);

        // Button Wrapper
        const btnWrapper = document.createElement("div");
        btnWrapper.classList.add("btn-wrapper-dark");
        const btnLink = document.createElement("a");
        btnLink.href = `/pages/employee-detail.html?id=${employee.id}`;
        btnLink.innerHTML = `<span>Більше</span>`;
        btnWrapper.appendChild(btnLink);

        // Add elements to card
        card.appendChild(photoWrapper);
        card.appendChild(infoWrapper);
        card.appendChild(contactWrapper);
        card.appendChild(btnWrapper);

        container.appendChild(card);
    });
}

readAllEmployee();

readAllEmployee();


