import { deleteDepartment } from "./delete.js";

export  async function readDepartmentById(id) {
    try {
        const token = localStorage.getItem("jwt-token");
        const response = await fetch(`http://localhost:8080/departments/${id}`, {
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
        document.querySelector(".department__read-by-id-container").classList.add("visible");
        renderDepartmentById(data);
    } catch (error) {
        console.error(error);
    }
}

export  function renderDepartmentById(department) {
    const container = document.querySelector(".department__read-by-id-container"); 
    container.innerHTML = "";

    if (!department || !department.id) {
        container.innerHTML = "<p>Дані відсутні.</p>";
        return;
    }

    //photo
    const img = document.createElement("img");
    img.src = "#";
    img.alt = "PHOTO";

    const h2 = document.createElement("h2");
    h2.classList.add("title");
    h2.textContent = department.name || "Без назви";

    const p = document.createElement("p");
    p.textContent = department.manager?.name || "Менеджер не вказаний";
    
    //btn
    const editBtnWrapper = document.createElement("div");
    editBtnWrapper.classList.add("btn-wrapper-dark");
    const editLink = document.createElement("a");
    editLink.href = `javascript:void(0)`;
    editLink.innerHTML = `<span>Змінити</span>`;
    const deleteBtnWrapper = document.createElement("div");
    deleteBtnWrapper.classList.add("btn-wrapper-dark");
    const deleteLink = document.createElement("a");
    deleteLink.href = `javascript:void(0)`;
    deleteLink.innerHTML = `<span>Видалити</span>`;
    deleteLink.addEventListener("click", () => {
        console.log("HERE");
        deleteDepartment(department.id);
    });

    const x = document.createElement("button");
    x.classList.add("close");
    x.innerHTML = `<span>x</span>`;

    editBtnWrapper.appendChild(editLink);
    deleteBtnWrapper.appendChild(deleteLink);
    container.appendChild(img);
    container.appendChild(h2);
    container.appendChild(p);
    container.appendChild(editBtnWrapper);
    container.appendChild(deleteBtnWrapper);
    container.appendChild(x);
    x.addEventListener ("click", () => {
        container.classList.remove("visible");
    })
}
