import { fieldNameMapping } from "./employee-mapping.js";
import { deleteEmployee } from "./employee-delete.js";
import { updateEmployee } from "./employee-update.js";

export async function readEmployeeById(id) {
    try {
        const token = localStorage.getItem("jwt-token");

const response = await fetch(`http://185.25.119.99:8080/employees/${id}`, {

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
                   
                    renderError401();
                    localStorage.removeItem("jwt-token");
                    return;
                }
            }
            throw new Error(`Помилка завантаження даних: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data)
        renderEmployeeCardById(data);
        return data;

    } catch (error) {
        console.error("Помилка при отриманні співробітників:", error);
        return [];
    }
}


function renderEmployeeCardById(employee) {
  const fileInput = document.getElementById("file-input");
  if (fileInput) fileInput.style.display = "none";

  const container = document.querySelector(".our-team-person-card-container");
  container.classList.add("visible");
  window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    document.querySelector(".employee-list").style.display = "none";
  container.id = employee.employeeId;

  if (!employee) {
    container.innerHTML = "<p>Дані відсутні.</p>";
    return;
  }
  

const parts = [];

if(employee.country) {
  parts.push(employee.country);
}
if(employee.city){
  parts.push( `м. ${employee.city}`);
}

// Додаємо street, якщо є
if (employee.street) {
  parts.push(employee.street);
}

// Додаємо будинок, якщо є і не пусте
if (employee.buildingNumber) {
  parts.push(`буд. ${employee.buildingNumber}`);
}

// Додаємо квартиру, якщо є і не пусте
if (employee.apartmentNumber) {
  parts.push(`кв. ${employee.apartmentNumber}`);
}
let address = "";
if(parts.length>0) {
  address = parts.join(", ")
} else {
  address = "Ніяких даних немає("
}

document.getElementById("residentialAddress").textContent = address;
document.getElementById("inspirationAnswer").textContent = employee.inspiration;
  if (employee.employmentStartDate) {
            const startDate = new Date(employee.employmentStartDate).getTime();
            const diff = Date.now() - startDate;
            const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
            document.getElementById("experience").textContent = `${years} р. досвіду`;
        } else {
            document.getElementById("experience").textContent = "Працює з часів динозаврів. Точно не знаємо";
        }



  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? "не заповнено";
  };
  
  const workplaceTypeElem = document.getElementById("workplaceType");
  if (workplaceTypeElem) {
    workplaceTypeElem.textContent = employee.workplaceTypeName || "не заповнено";
  }
  const setContact = (id, value) => {
    const container = document.getElementById(id);
    if (container) {
      const p = container.querySelector("p.main-text");
      if (p) p.textContent = value ?? "не заповнено";
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "не заповнено";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}`;
  };

  const calculateExperience = (startDate) => {
    if (!startDate) return "Працює з часів динозаврів. Точно не знаємо";
    const start = new Date(startDate);
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    const m = now.getMonth() - start.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < start.getDate())) {
      years--;
    }
    return years > 0 ? `${years} роки(ів)` : "менше року";
  };

 Object.keys(fieldNameMapping).forEach((fieldKey) => {
  if (fieldKey === "departmentName" || fieldKey === "positionName") return;

  let value = employee[fieldKey];
  if (fieldKey === "dateOfBirth") {
    value = formatDate(value);
  } else if (fieldKey === "employmentStartDate") {
    value = calculateExperience(value);
  }

  // Контакти
  if (
    fieldKey === "personalMobile" ||
    fieldKey === "corporateMobile" || 
    fieldKey === "personalEmail" ||
    fieldKey === "workEmail"
  ) {
    const container = document.getElementById(fieldKey);
    if (container) {
      if (value && value.trim() !== "") {
        container.style.display = "flex"; // показуємо блок
        const p = container.querySelector("p.main-text");
        if (p) p.textContent = value;
      } else {
        container.style.display = "none"; // ховаємо блок
      }
    }
  } else {
    setText(fieldKey, value);
  }
});


  setText("department", employee.departmentName ?? "Департамент не визначено");
  setText("position", employee.positionName ?? "Посада в дорозі...");

     // Photo
    const photoContainer = document.querySelector(".employee-card__photo-container img");
if (employee.photo != null) {
  let relativePath = employee.photo;
  relativePath = relativePath.replace(/\\/g, "/");
  relativePath = relativePath.replace(/^.*?(uploads\/.*)/, "$1");
  relativePath = relativePath.replace(/(employees)([^/])/, "$1/$2");
  relativePath = relativePath.replace(/(employees\/)(.*)/, (match, p1, p2) => {
    return p1 + encodeURIComponent(p2);
  });
  const photoUrl = "http://185.25.119.99:8080/" + relativePath;
  photoContainer.src = photoUrl;
} else {
  photoContainer.src = "/img/team/default.jpg";
}

  const closeBtn = document.querySelector(
    ".our-team-person-card-container .close-btn"
  );
  if (closeBtn) {
    closeBtn.onclick = () => {
      container.classList.remove("visible");
          document.querySelector(".employee-list").style.display = "flex";
    };
  }


  //admin
  document.querySelector(".employee-card__admin-panel .employee-card__delete")
  .addEventListener("click", () => {
    const result = confirm("Ви впевнені, що хочете видалити?");
if (result) {
    deleteEmployee(employee.id);
} else {
    console.log("Видалення скасовано!");
}
  })
  
  document.querySelector(".employee-card__admin-panel .employee-card__edit")
  .addEventListener("click",()=>{
    updateEmployee(employee.id);
  })
  
  
}
