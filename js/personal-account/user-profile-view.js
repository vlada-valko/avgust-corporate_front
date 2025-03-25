async function loadUserPage() {
  console.log("start");
  try {
    const token = localStorage.getItem("jwt-token");
    const userId = localStorage.getItem("userId");
    console.log("start");

    if (!token || !userId) {
      alert("Вам необхідно увійти!");
      window.location.href = "/login.html";
      return;
    }

    const response = await fetch(`http://localhost:8080/employees/${userId}`, {
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
    renderUserData(data);
  } catch (error) {
    console.error(error);
    document.querySelector(".user-profile-container").innerHTML = "<p>Не вдалося завантажити дані користувача.</p>";
  }
}

function renderUserData(data) {
  const userContainer = document.querySelector(".user-profile-container");

  const userDataList = document.createElement("ul");
  for (const key in data.employee) {
    if (data.employee[key] !== null && key !== "photo") {
      const listItem = document.createElement("li");

      // Якщо це дата народження, форматувати її
      if (key === "Дата народження") {
        listItem.innerHTML = `<strong>${formatKey(key)}:</strong> ${formatDate(data.employee[key])}`;
      } else {
        listItem.innerHTML = `<strong>${formatKey(key)}:</strong> ${formatData(data.employee[key])}`;
      }
      
      userDataList.appendChild(listItem);
    }
  }
  userContainer.appendChild(userDataList);

  // Якщо є фото, відображаємо його
  if (data.photo) {
    const imgElement = document.createElement("img");
    imgElement.src = `data:image/jpeg;base64,${data.photo}`;  // Використовуємо Base64
    imgElement.alt = "Фото користувача";
    imgElement.style.width = "150px";
    userContainer.appendChild(imgElement);
  } else {
    const noPhotoMessage = document.createElement("p");
    noPhotoMessage.innerText = "Фото не завантажено.";
    userContainer.appendChild(noPhotoMessage);
  }
}

// Функція для форматування значень (якщо це об'єкт)
function formatData(value) {
  return typeof value === "object" ? JSON.stringify(value, null, 2) : value;
}

// Функція для форматування ключів, для кращого вигляду (наприклад, firstName -> First name)
function formatKey(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

// Функція для форматування дати у формат дд/мм/рррр
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Місяці в JavaScript починаються з 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

loadUserPage();
