import { fieldNameMapping } from "./employee-mapping.js";


export async function readEmployeeById(id) {
    try {
        const token = localStorage.getItem("jwt-token");

        // const response = await fetch("https://avgust-corporate-server.fly.dev/employees/all", {
const response = await fetch(`http://localhost:8080/employees/${id}`, {

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
  container.id = employee.employeeId;

  if (!employee) {
    container.innerHTML = "<p>Дані відсутні.</p>";
    return;
  }

const parts = [
  employee.country,
  `м. ${employee.city}`
];

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

const address = parts.join(", ");

document.getElementById("residentialAddress").textContent = address;
document.getElementById("inspirationAnswer").textContent = employee.inspiration;
  if (employee.employmentStartDate) {
            const startDate = new Date(employee.employmentStartDate).getTime();
            const diff = Date.now() - startDate;
            const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
            document.getElementById("experience").textContent = `${years} р. досвіду`;
        } else {
            document.getElementById("experience").textContent = "Не вказано";
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
    if (!startDate) return "не заповнено";
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

    if (
      fieldKey === "personalMobile" ||
      fieldKey === "corporateMobile" || 
      fieldKey === "personalEmail" ||
      fieldKey === "workEmail"
    ) {
      setContact(fieldKey, value);
    } else {
      setText(fieldKey, value);
    }
  });

  setText("department", employee.departmentName ?? "не заповнено");
  setText("position", employee.positionName ?? "не заповнено");

  const photo = document.getElementById("photo");
  if (photo) {
    photo.src = employee.photo
      ? `data:image/jpeg;base64,${employee.photo}`
      : "../../img/team/default.jpg";
  }

  const closeBtn = document.querySelector(
    ".our-team-person-card-container .close-btn"
  );
  if (closeBtn) {
    closeBtn.onclick = () => {
      container.classList.remove("visible");
    };
  }
}
