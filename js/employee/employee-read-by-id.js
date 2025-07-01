export async function readEmployeeById(id) {
  console.log(id);
  window.scrollTo({ top: 0, behavior: "smooth" });
  try {
    const token = localStorage.getItem("jwt-token");
    const response = await fetch(`http://localhost:8080/employees/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Помилка завантаження даних: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    renderEmployeeCard(data.data);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

import { employeeFieldMapping } from "./employee-mapping.js";

function renderEmployeeCard(employee) {
  const container = document.querySelector(".our-team-person-card-container");
  container.id = employee.id;
  if (!employee) {
    container.innerHTML = "<p>Дані відсутні.</p>";
    return;
  }

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? "не заповнено";
  };

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

  // Проходимося по всіх ключах маппера
  Object.keys(employeeFieldMapping).forEach((fieldKey) => {
    let value = employee[fieldKey];

    // Особлива логіка для деяких полів:
    if (fieldKey === "dateOfBirth") {
      value = formatDate(value);
    } else if (fieldKey === "employmentStartDate") {
      // Якщо треба, додаємо це поле в маппер і обробляємо
      value = calculateExperience(value);
    }

    // Визначаємо, як виводити: контакт чи просте поле
    if (
      fieldKey === "personalMobile" ||
      fieldKey === "corporateMobile" ||
      fieldKey === "personalEmail" ||
      fieldKey === "corporateEmail"
    ) {
      setContact(fieldKey, value);
    } else {
      setText(fieldKey, value);
    }
  });

  // Фото
  const photo = document.getElementById("photo");
  if (photo) {
    photo.src = employee.photo
      ? `data:image/jpeg;base64,${employee.photo}`
      : "/img/team/default.jpg";
  }

  // Обробка кнопки закриття
  const closeBtn = document.querySelector(
    ".our-team-person-card-container .close-btn"
  );
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (container.classList.contains("visible")) {
        container.classList.remove("visible");
      }
    });
  }
}

import { updateEmployeeById } from "./employee-update.js";
document.querySelector(".employee-card__edit").addEventListener("click", () => {
  console.log("start editing");
  const cardSection = document
    .querySelector(".employee-card__edit")
    .closest(".our-team-person-card-container");
  if (cardSection) {
     document.querySelector(".our-team-person-card-container").classList.remove("visible");
    updateEmployeeById(cardSection.id);
  } else {
    console.log("Картка не знайдена");
  }
});
