async function loadUserPage() {
  try {
    const token = localStorage.getItem("jwt-token");
    const userId = localStorage.getItem("userId");

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
    // document.querySelector(".account-container").innerHTML = "<p>Не вдалося завантажити дані користувача.</p>";
  }
}

function renderUserData(data) {
  const userContainer = document.querySelector(".account-container");
  userContainer.innerHTML = "";

  if (!data.user && !data?.employee) {
    userContainer.innerHTML = "<p>Дані відсутні.</p>";
    return;
  }

  const form = document.createElement("form");
  form.classList.add("account-form");

  const photoContainer = document.createElement("div");
  photoContainer.classList.add("photo-container");
  form.appendChild(photoContainer);

  if (data?.employee?.Фото) {
    renderUserPhoto(data?.employee.Фото, photoContainer);
  }

  form.appendChild(createDataFields(data.user, "Дані користувача"));
  form.appendChild(createDataFields(data?.employee, "Дані працівника"));

  userContainer.appendChild(form);
}

function createDataFields(data, title) {
  if (!data) return document.createElement("div");

  const fieldset = document.createElement("fieldset");
  const legend = document.createElement("legend");
  legend.textContent = title;

  fieldset.appendChild(legend);

  for (const [key, value] of Object.entries(data)) {

    if (key !== "Фото") {
      const fieldWrapper = document.createElement("div");
      fieldWrapper.classList.add("field-wrapper");

      const label = document.createElement("label");
      label.classList.add("title");
      label.textContent = `${key}:`;

      const input = document.createElement("input");
      input.type = "text";
      input.name = key; // Додаємо атрибут name
      input.value = formatData(value);
      input.readOnly = true;
      input.disabled = true;
      input.classList.add("form-input", "main-text");

      fieldWrapper.appendChild(label);
      fieldWrapper.appendChild(input);
      fieldset.appendChild(fieldWrapper);
    }
  }

  const editButton = document.createElement("button");
  editButton.textContent = "Редагувати";
  editButton.type = "button";
  editButton.classList.add("edit-button");
  editButton.addEventListener("click", () => toggleEditMode(fieldset));

  fieldset.appendChild(editButton);

  return fieldset;
}

function formatData(value) {
  // Якщо значення "Не заповнено" або порожнє, повертаємо null
  return (value === "Не заповнено" || value === "") ? null : value;
}

function renderUserPhoto(photoBase64, container) {
  const imgElement = document.createElement("img");
  imgElement.classList.add("user-photo");
  imgElement.src = `data:image/jpeg;base64,${photoBase64.trim()}`;
  imgElement.alt = "Фото користувача";

  const fileWrapper = document.createElement("div");
  fileWrapper.classList.add("file-wrapper");

  const inputFile = document.createElement("input");
  inputFile.type = "file";
  inputFile.accept = "image/*";
  inputFile.classList.add("photo-input");
  inputFile.style.display = "none";

  inputFile.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        imgElement.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  });

  imgElement.addEventListener("click", () => {
    if (!imgElement.classList.contains("editable")) return;
    inputFile.click();
  });

  fileWrapper.appendChild(inputFile);
  container.appendChild(imgElement);
  container.appendChild(fileWrapper);
}

async function toggleEditMode(fieldset) {
  const isEditing = fieldset.classList.toggle("editing");
  const editButton = fieldset.querySelector(".edit-button");
  const inputs = fieldset.querySelectorAll(".form-input");
  const photo = document.querySelector(".user-photo");
  const photoInput = document.querySelector(".photo-input");

  editButton.textContent = isEditing ? "Зберегти" : "Редагувати";

  inputs.forEach(input => {
    input.readOnly = !isEditing;
    input.disabled = !isEditing;
    input.style.border = isEditing ? "1px solid black" : "none";
  });

  if (photo && photoInput) {
    photo.classList.toggle("editable", isEditing);
    photoInput.style.display = isEditing ? "block" : "none";
  }

  if (!isEditing) {
    // Коли натиснули "Зберегти" — збираємо всі дані
    const updatedData = {};

    // Пройти по всіх полях форми і додати всі значення
    inputs.forEach(input => {
      // Додаємо значення поля до updatedData
      updatedData[input.name] = formatData(input.value);  // Якщо порожнє або "Не заповнено", ставимо null
    });

    // Виведення об'єкта updatedData в консоль
    console.log("Дані, що будуть відправлені на сервер:", JSON.stringify(updatedData, null, 2));

    try {
      const token = localStorage.getItem("jwt-token");
      const userId = localStorage.getItem("userId");
      const response = await fetch(`http://localhost:8080/employees/${userId}/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`Помилка оновлення: ${response.statusText}`);
      }

      console.log("Дані успішно оновлено");
    } catch (error) {
      console.error("Помилка при оновленні:", error);
    }
  } else {
    // Запам'ятовуємо початкові значення
    inputs.forEach(input => {
      input.dataset.originalValue = input.value;
    });
  }
}

// Ініціалізація завантаження даних користувача при відкритті сторінки
loadUserPage();
