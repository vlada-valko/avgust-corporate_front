import { readDepartmentById } from "./department-read-by-id.js";  // Припустимо, є аналогічний модуль
import { createDepartment } from "./department-create.js";  // Припустимо, є аналогічний модуль


const listContainer = document.getElementById('department-list');
if (listContainer) {
    readAllDepartments();
}

if (localStorage.getItem("userRole") === "ROLE_ADMIN" 
    || localStorage.getItem("userRole") === "ROLE_MANAGER") {
    const createBtn = document.getElementById("create-new-department-btn");
    if (createBtn) {
        createBtn.style.display = "flex";
        createBtn.addEventListener("click", () => {
         createDepartment();
        });
    }
}

export async function readAllDepartments() {
    console.log("try to read all departments")
    try {
        const token = localStorage.getItem("jwt-token");

        const response = await fetch("http://localhost:8080/departments/all", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                const errorBody = await response.json();
                if (errorBody.errorCode === "AUTH_EXPIRED") {
                    localStorage.removeItem("jwt-token");
                    return;
                }
            }
            throw new Error(`Помилка завантаження даних: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        renderDepartmentCards(data.data);  // або data.departments — перевір за структурою відповіді
        return data;

    } catch (error) {
        console.error("Помилка при отриманні департаментів:", error);
        return [];
    }
}

function renderDepartmentCards(departments) {
    const container = document.querySelector(".department-list__container");
    container.innerHTML = "";

    if (!departments || departments.length === 0) {
        container.innerHTML = "<p>Дані відсутні.</p>";
        return;
    }

    departments.forEach(department => {
        const card = document.createElement("div");
        card.classList.add("department-list__item");
        card.id = department.id;

        // Photo container
        const photoContainer = document.createElement("div");
        photoContainer.classList.add("department-list__item-photo-container");

        const photo = document.createElement("img");
        photo.classList.add("department-list__item-photo");
        photo.alt = "Фото департаменту";

        
        if (department.photo != null) {
    // 1. Відрізаємо все до \uploads\
    let relativePath = department.photo
        .replace(/^.*\\uploads\\/, "uploads\\") 
        .replace(/\\/g, "/"); // замінюємо бекслеші на /

    // 2. Якщо немає слеша після "departments", додамо
    relativePath = relativePath.replace(/(departments)([^/])/, "$1/$2");

    // 3. Формуємо повний URL
    photo.src = "http://localhost:8080/" + relativePath;
} else {
        photo.src = "/img/team/default.jpg"  ;
}

        photoContainer.appendChild(photo);

        // Info wrapper
        const infoWrapper = document.createElement("div");
        infoWrapper.classList.add("department-list__item-info");

        // Назва департаменту
        const nameDiv = document.createElement("div");
        nameDiv.classList.add("department-list__item-name", "title");
        nameDiv.textContent = department.name || "Без назви";

        // Менеджер
        const managerDiv = document.createElement("div");
        managerDiv.classList.add("department-list__item-manager");

        if (department.managerName) {
            managerDiv.textContent = department.managerName;
        } else {
            managerDiv.textContent = "Менеджер не вказаний";
        }

        infoWrapper.append(nameDiv, managerDiv);

        // Кнопка "Детальніше"
        const btnWrapper = document.createElement("div");
        btnWrapper.classList.add("btn-wrapper-dark");

        const btnLink = document.createElement("a");
        btnLink.href = "javascript:void(0)";
        btnLink.innerHTML = `<span>Детальніше</span>`;

        btnWrapper.appendChild(btnLink);

        // Збираємо картку
        card.append(photoContainer, infoWrapper, btnWrapper);

        container.appendChild(card);

        btnLink.addEventListener("click", () => {
            readDepartmentById(card.id);
        });
    });
}

readAllDepartments();
