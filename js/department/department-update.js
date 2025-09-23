export async function updateDepartment(id) {
    try {
        const token = localStorage.getItem("jwt-token");
        const response = await fetch(`http://localhost:8080/departments/${id}/edit`, {
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
        console.log("Update form data:", data);

        renderDepartmentUpdateForm(data.data); // 🔹 передаємо тільки data.data

    } catch (error) {
        console.error("Помилка при завантаженні форми:", error);
    }
}

async function renderDepartmentUpdateForm(serverData) {
    const updateDepartmentContainer = document.querySelector(".entity-update-block");
    updateDepartmentContainer.classList.add("visible");

    document.querySelector(".entity-update-block .close-btn").addEventListener(
        "click", () => {
            updateDepartmentContainer.classList.remove("visible");
        }
    );

    if (!serverData || !serverData.departmentDTO || Object.keys(serverData.departmentDTO).length === 0) {
        updateDepartmentContainer.innerHTML = "<p>Дані відсутні.</p>";
        return;
    }

    const departmentDTO = serverData.departmentDTO;
    const managers = serverData.managers || [];

    const form = document.querySelector (".entity-update-form form")
 form.innerHTML = ""; 


    const formData = {};
    formData.id = departmentDTO.id;

    const mappingModule = await import("../mapping/department-mapping.js");
    const fieldMapping = mappingModule.fieldNameMapping;

    for (const [key, value] of Object.entries(departmentDTO)) {
        if (key === "employees" || key === "positions" || key === "managerName" || key === "id") continue;

        const label = document.createElement("label");
        label.classList.add("title");
        label.textContent = `${(fieldMapping[key] || key).charAt(0).toUpperCase() + (fieldMapping[key] || key).slice(1)}:`;

        if (key === "managerId") {
            const select = document.createElement("select");
            select.name = key;

            const emptyOption = document.createElement("option");
            emptyOption.value = "";
            emptyOption.textContent = "— Не вибрано —";
            select.appendChild(emptyOption);

            managers.forEach(m => {
                const option = document.createElement("option");
                option.value = m.id;
                option.textContent = m.name;
                if (m.id === value) option.selected = true;
                select.appendChild(option);
            });

            form.appendChild(label);
            form.appendChild(select);

            formData[key] = value;

            select.addEventListener("change", () => {
                formData[key] = select.value || null;
            });
        } else if (key === "photo") {
            form.appendChild(label);

            if (value) {
                  let relativePath = departmentDTO.photo
      .replace(/^.*\\uploads\\/, "uploads\\")
      .replace(/\\/g, "/");
    relativePath = relativePath.replace(/(departments)([^/])/, "$1/$2");
                const imgPreview = document.createElement("img");
                imgPreview.src = "http://localhost:8080/" + relativePath;;
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
            const input = document.createElement("input");
            input.name = key;
            input.value = value || "";
            form.appendChild(label);
            form.appendChild(input);

            formData[key] = input.value;

            input.addEventListener("input", () => {
                formData[key] = input.value;
            });
        }
    }

   const saveButton = document.querySelector(".entity-update-block .btn-wrapper-dark a");

saveButton.addEventListener("click", async () => {
  try {
    const token = localStorage.getItem("jwt-token");
    const url = `http://localhost:8080/departments/${departmentDTO.id}/edit`;

    // 🔹 завжди multipart
    const jsonData = { ...formData };
    delete jsonData.photo; // фото додається окремо

    const multipartData = new FormData();
    multipartData.append(
      "departmentDTO",
      new Blob([JSON.stringify(jsonData)], { type: "application/json" })
    );

    // якщо користувач вибрав нове фото
    if (formData.photo instanceof File) {
      multipartData.append("photo", formData.photo);
    }

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        // ❌ Content-Type не вказуємо! браузер сам поставить boundary
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

    // спроба знайти точний збіг (name$=".ключ")
    let field = form.querySelector(`[name$=".${key}"]`);

    // якщо не знайшли — шукаємо без крапки, наприклад: name="firstName"
    if (!field) {
      field = form.querySelector(`[name="${key}"]`);
    }

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
