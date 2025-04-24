import { readDepartmentById } from "./read-by-id.js";

async function readAllDepartments() {
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
            throw new Error(`Помилка завантаження даних: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        renderDepartmentCards(data.departments);
    } catch (error) {
        console.error(error);
    }
}

function renderDepartmentCards(departments) {
    const container = document.querySelector(".department__read-all-container");
    container.innerHTML = "";

    if (!departments || departments.length === 0) {
        container.innerHTML = "<p>Дані відсутні.</p>";
        return;
    }

    departments.forEach(department => {
        const block = document.createElement("div");
        block.classList.add("department-block");
        block.id = department.id;

        const img = document.createElement("img");
        img.src = "#"; 
        img.alt = "PHOTO";

        const h2 = document.createElement("h2");
        h2.classList.add("title");
        h2.textContent = department.name || "Без назви";

        const p = document.createElement("p");
        p.textContent = department.manager?.firstName + " " 
        +  department.manager?.lastName + " " 
        + department.manager?.middleName || "Менеджер не вказаний";

        const btnWrapper = document.createElement("div");
        btnWrapper.classList.add("btn-wrapper-dark");

        const btnLink = document.createElement("a");
        btnLink.href = "javascript:void(0)";
        btnLink.innerHTML = `<span>Детальніше</span>`;
        btnLink.addEventListener("click", () => {
                const departmentBlock = btnLink.closest(".department-block");
                const departmentId = departmentBlock?.id;
                if (departmentId) {
                   readDepartmentById(departmentId);
                } else {
                    console.warn("ID не знайдено");
                }
            });

        btnWrapper.appendChild(btnLink);
        block.appendChild(img);
        block.appendChild(h2);
        block.appendChild(p);
        block.appendChild(btnWrapper);

        container.appendChild(block);
    });
}
readAllDepartments();
