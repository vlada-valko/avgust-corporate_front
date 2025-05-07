export async function readEmployeeById(id) {
    try {
        const token = localStorage.getItem("jwt-token");
        const response = await fetch(`http://localhost:8080/employees/${id}`, {
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
        console.log(data)
        renderEmployeeCard(data);
        return data; 
    } catch (error) {
        console.error(error);
        return [];
    }
}

function renderEmployeeCard(employee) {
  const container = document.querySelector(".our-team-person-card-container");

  if (!employee) {
    container.innerHTML = "<p>Дані відсутні.</p>";
    return;
  }

  // Функція для встановлення тексту
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? "не заповнено";
  };

  // Функція для встановлення тексту в блоках з contenteditable
  const setEditableText = (id, value) => {
    const el = document.getElementById(id);
    if (el && el.hasAttribute("contenteditable")) {
      el.textContent = value ?? "не заповнено";
    }
  };

  // Функція для встановлення тексту у вкладених <p class="main-text"> всередині id
  const setContact = (id, value) => {
    const container = document.getElementById(id);
    if (container) {
      const p = container.querySelector("p.main-text");
      if (p) p.textContent = value ?? "не заповнено";
    }
  };

  // Форматування дати народження
  const formatDate = (isoDate) => {
    if (!isoDate) return "не заповнено";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}`;
  };

  // Обчислення стажу
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

  // Очистити або поставити "не заповнено" у всіх відповідних полях
  setText("firstName", employee.firstName ?? "не заповнено");
  setText("lastName", employee.lastName ?? "не заповнено");
  setText("middleName", employee.middleName ?? "не заповнено");

  setEditableText("department", employee.department);
  setEditableText("position", employee.position);
  setEditableText("workplaceType", employee.workplaceType);
  setEditableText("experience", calculateExperience(employee.employmentStartDate));
  setEditableText("dateOfBirth", formatDate(employee.dateOfBirth));
  setEditableText("residentialAddress", employee.residentialAddress);

  setContact("personalMobile", employee.personalMobile);
  setContact("corporateMobile", employee.corporateMobile);
  setContact("personalEmail", employee.personalEmail);
  setContact("workEmail", employee.workEmail);

  // Додаткові необов’язкові блоки
  setEditableText("quote", employee.quote);
  setEditableText("inspirationAnswer", employee.inspirationAnswer);

  // Фото (якщо є)
  const photo = document.getElementById("photo");
  if (photo) {
    photo.src = employee.photo 
    ? `data:image/jpeg;base64,${employee.photo}` 
    : "/img/team/default.jpg";
  }
  document.querySelector(".our-team-person-card-container .close-btn").addEventListener("click", () => {
    const container = document.querySelector(".our-team-person-card-container");
    if (container.classList.contains("visible")) {
      container.classList.remove("visible");
    }
  });
  
}




