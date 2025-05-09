import { readEmployeeById } from "./employee-read-by-id.js";
import { getCreateUserAndEmployeeForms } from "./employee-create.js";


const listContainer = document.getElementById('employee-list');
if (listContainer && employeeContainer) {
    readAllEmployee();
}
export async function readAllEmployee() {
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
        renderEmployeeCards(data.employees);
        return data; 
    } catch (error) {
        console.error(error);
        return [];
    }
}

function renderEmployeeCards(employees) {
    const container = document.querySelector(".employee-list__container");
    container.innerHTML = "";

    if (!employees || employees.length === 0) {
        container.innerHTML = "<p>Дані відсутні.</p>";
        return;
    }

    employees.forEach(employee => {
        const card = document.createElement("div");
        card.classList.add("employee-list__item");
        card.id = employee.id;

        // Photo
        const photoContainer = document.createElement("div");
        photoContainer.classList.add("employee-list__item-photo-container");

        const photo = document.createElement("img");
        photo.classList.add("employee-list__item-photo");
        photo.alt = "";
        photo.src = employee.photo 
            ? `data:image/jpeg;base64,${employee.photo}` 
            : "/img/team/default.jpg";

        photoContainer.appendChild(photo);

        // Info Wrapper
        const infoWrapper = document.createElement("div");
        infoWrapper.classList.add("employee-list__item-info");

        // Full Name
        const fullName = document.createElement("div");
        fullName.classList.add("employee-list__item-full-name");

        const firstName = document.createElement("p");
        firstName.classList.add("employee-list__item-first-name", "title");
        firstName.innerText = employee.firstName || "Без імені";

        const lastName = document.createElement("p");
        lastName.classList.add("employee-list__item-last-name", "title");
        lastName.innerText = employee.lastName || "Без прізвища";

        const middleName = document.createElement("p");
        middleName.classList.add("employee-list__item-middle-name", "title");
        middleName.innerText = employee.middleName || "Без по батькові";

        fullName.append(firstName, lastName, middleName);

        // Position and Experience
        const posExp = document.createElement("div");
        posExp.classList.add("employee-list__item-postion-and-expirience");

        const position = document.createElement("p");
        position.classList.add("employee-list__item-position", "main-text");
        position.innerText = employee.position || "Не вказано";

        const experience = document.createElement("p");
        experience.classList.add("employee-list__item-expirience", "main-text");
        if (employee.employmentStartDate) {
            const startDate = new Date(employee.employmentStartDate).getTime();
            const diff = Date.now() - startDate;
            const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
            experience.innerText = `${years} р. досвіду`;
        } else {
            experience.innerText = "Не вказано";
        }

        posExp.append(position, experience);

        // Contacts
        const contacts = document.createElement("div");
        contacts.classList.add("employee-list__item-contacts");

        const phone = document.createElement("div");
        phone.classList.add("employee-list__item-phone");

        const phoneDecor = document.createElement("div");
        phoneDecor.classList.add("employee-list__item-decor");
        const phoneImg = document.createElement("img");
        phoneImg.src = "/img/call.png";
        phoneImg.alt = "";
        phoneDecor.appendChild(phoneImg);

        const phoneLink = document.createElement("a");
        phoneLink.classList.add("main-text");
        phoneLink.href = employee.personalMobile 
            ? `tel:${employee.personalMobile}` 
            : "#";
        phoneLink.innerText = employee.personalMobile || "Телефон не вказано";

        phone.append(phoneDecor, phoneLink);

        const email = document.createElement("div");
        email.classList.add("employee-list__item-email");

        const emailDecor = document.createElement("div");
        emailDecor.classList.add("employee-list__item-decor");
        const emailImg = document.createElement("img");
        emailImg.src = "/img/email.png";
        emailImg.alt = "";
        emailDecor.appendChild(emailImg);

        const emailLink = document.createElement("a");
        emailLink.classList.add("main-text");
        emailLink.href = employee.personalEmail 
            ? `mailto:${employee.personalEmail}` 
            : "#";
        emailLink.innerText = employee.personalEmail || "Email не вказано";

        email.append(emailDecor, emailLink);
        contacts.append(phone, email);

        // Append all to infoWrapper
        infoWrapper.append(fullName, posExp, contacts);

        // Button
        const btnWrapper = document.createElement("div");
        btnWrapper.classList.add("btn-wrapper-dark");

        const btnLink = document.createElement("a");
        btnLink.href = "javascript:void(0)";
        btnLink.innerHTML = "<span>Детальніше</span>";

        btnWrapper.appendChild(btnLink);

        // Assemble the card
        card.append(photoContainer, infoWrapper, btnWrapper);
        container.appendChild(card);

        // Add click event
        btnLink.addEventListener("click", () => {
            readEmployeeById(employee.id);
            document.querySelector(".our-team-person-card-container").classList.add("visible")
        });
    });

    if(localStorage.getItem("userRole") === "ROLE_ADMIN" 
    || localStorage.getItem("userRole") === "ROLE_MANAGER") {
        document.getElementById("create-new-employee-btn").style.display = "flex";
        document.getElementById("create-new-employee-btn").addEventListener("click",() => {
            getCreateUserAndEmployeeForms();
        })
    }
}




