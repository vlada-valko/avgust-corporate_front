export async function updateEmployee(id) {
  try {
    const token = localStorage.getItem("jwt-token");
    const response = await fetch(`http://185.25.119.99:8080/employees/${id}/edit`, {
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
    console.log("Update form data:", data);

    renderEmployeeUpdateForm(data.data);
  } catch (error) {
    console.error("Помилка при завантаженні форми:", error);
  }
}

async function renderEmployeeUpdateForm(serverData) {
  const updateEmployeeContainer = document.querySelector(".entity-update-block");
  updateEmployeeContainer.classList.add("visible");

  document
    .querySelector(".entity-update-block .close-btn")
    .addEventListener("click", () => {
      updateEmployeeContainer.classList.remove("visible");
    });

  if (
    !serverData ||
    !serverData.createEmployeeForm ||
    Object.keys(serverData.createEmployeeForm).length === 0
  ) {
    updateEmployeeContainer.innerHTML = "<p>Дані відсутні.</p>";
    return;
  }

  const createEmployeeForm = serverData.createEmployeeForm;
  const form = document.querySelector(".entity-update-form form");
  form.innerHTML = "";

  const mappingModule = await import("../mapping/employee-mapping.js");
  const fieldMapping = mappingModule.fieldNameMapping;

  const selectsData = {
    department: serverData.departments || [],
    gender: serverData.genders || [],
    position: serverData.positions || [],
    role: serverData.roles || [],
    user: serverData.users || [],
    workplaceType: serverData.workplaceTypes || [],
    manager: serverData.managers || [],
  };

  const formData = { id: createEmployeeForm.id };

  for (const [key, value] of Object.entries(createEmployeeForm)) {
    if (key === "id") continue;

    // 🔹 ігнор без мапінгу
    if (!fieldMapping[key]) continue;

    const label = document.createElement("label");
    label.classList.add("title");
    label.textContent = (fieldMapping[key] || key) + ":";

    let keyForSelect = key.toLowerCase();
    if (keyForSelect.endsWith("id")) {
      keyForSelect = keyForSelect.slice(0, -2);
    }

   if (selectsData[keyForSelect] && selectsData[keyForSelect].length > 0) {
  const select = document.createElement("select");
  select.name = key;

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "— Не вибрано —";
  select.appendChild(emptyOption);

  selectsData[keyForSelect].forEach((optionValue) => {
    const option = document.createElement("option");

    if (typeof optionValue === "object") {
      // 🔹 статі відправляємо значення як є
      if (keyForSelect === "gender") {
        option.value = optionValue;
        option.textContent = optionValue;
      } else {
        // 🔹 для всіх інших селектів відправляємо id
        option.value = optionValue.id;
        option.textContent = optionValue.name || optionValue.toString();
      }
    } else {
      option.value = optionValue;
      option.textContent = optionValue;
    }

    if (option.value == value) option.selected = true;
    select.appendChild(option);
  });

  form.appendChild(label);
  form.appendChild(select);

  formData[key] = value;

  select.addEventListener("change", () => {
    formData[key] = select.value || null;
  });

  setTimeout(() => {
    new Choices(select, {
      searchEnabled: true,
      itemSelectText: "",
      shouldSort: false,
    });
  }, 0);
}
 else if (key === "photo") {
      // фото
      form.appendChild(label);

      if (value) {
        let relativePath = createEmployeeForm.photo
          .replace(/^.*\\uploads\\/, "uploads\\")
          .replace(/\\/g, "/");
        relativePath = relativePath.replace(/(employees)([^/])/, "$1/$2");
        const imgPreview = document.createElement("img");
        imgPreview.src = "http://185.25.119.99:8080/" + relativePath;
        imgPreview.alt = "Прев’ю";
        imgPreview.style.maxWidth = "150px";
        imgPreview.style.display = "block";
        form.appendChild(imgPreview);
      }

      const input = document.createElement("input");
      input.type = "file";
      input.name = key;
      input.accept = "image/*";
      form.appendChild(input);

      input.addEventListener("change", () => {
        formData[key] = input.files[0] || null;
      });
    } else {
      // текст/дата
      const input = document.createElement("input");
      input.name = key;

      if (key.toLowerCase().includes("date")) {
        input.type = "date";
        if (value) {
          input.value = value.split("T")[0]; // тільки yyyy-MM-dd
        }
      } else {
        input.type = "text";
        input.value = value || "";
      }

      form.appendChild(label);
      form.appendChild(input);

      formData[key] = input.value;

      input.addEventListener("input", () => {
        formData[key] = input.value;
      });
    }
  }

  const saveButton = document.querySelector(
    ".entity-update-block .btn-wrapper-dark a"
  );

saveButton.addEventListener("click", async () => {
  try {
    const token = localStorage.getItem("jwt-token");
    const url = `http://185.25.119.99:8080/employees/${createEmployeeForm.id}/edit`;

    // 🔹 завжди multipart
    const jsonData = { ...formData };
    delete jsonData.photo; // фото окремо

    const multipartData = new FormData();
    multipartData.append(
      "employeeDTO",
      new Blob([JSON.stringify(jsonData)], { type: "application/json" })
    );

    if (formData.photo instanceof File) {
      multipartData.append("photo", formData.photo);
    }

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: multipartData,
    });

    if (!response.ok) {
      const errorJson = await response.json();
      displayErrors(errorJson.data, fieldMapping);
      return;
    }

    alert("Успішно оновлено");
    window.location.reload();
  } catch (error) {
    console.error("Помилка відправки:", error);
  }
});


  function displayErrors(errors) {
    const oldErrors = form.querySelectorAll(".error-message");
    oldErrors.forEach((el) => el.remove());

    if (!errors || typeof errors !== "object") {
      console.warn("Очікувались помилки у форматі обʼєкта:", errors);
      return;
    }

    for (const key in errors) {
      const message = errors[key];
      let field = form.querySelector(`[name="${key}"]`);
      if (field) {
        const errorSpan = document.createElement("span");
        errorSpan.classList.add("error-message");
        errorSpan.style.color = "red";
        errorSpan.style.fontSize = "0.9em";
        errorSpan.textContent = message;
        field.insertAdjacentElement("afterend", errorSpan);
      }
    }
  }
}

