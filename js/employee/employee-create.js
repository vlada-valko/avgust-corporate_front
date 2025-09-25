/*export async function createEmployee() {
  try {
    const token = localStorage.getItem("jwt-token");
    const response = await fetch("http://185.25.119.99:8080/employees/new", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Помилка завантаження: ${response.statusText}`);

    const data = await response.json();
    renderEmployeeCreateForm(data.data); // передаємо тільки data.data
  } catch (error) {
    console.error("Помилка при завантаженні форми:", error);
  }
}

async function renderEmployeeCreateForm(serverData) {
  const container = document.querySelector(".entity-create-block");
  container.classList.add("visible");

  container.querySelector(".close-btn").addEventListener("click", () => {
    container.classList.remove("visible");
  });

  if (!serverData?.employeeDTO) {
    container.innerHTML = "<p>Дані відсутні.</p>";
    return;
  }

  // беремо DTO співробітника
  const { employeeDTO } = serverData;
  const form = document.querySelector(".entity-create-form form");
  form.innerHTML = "";

  const formData = {};

  // динамічне завантаження мапінгу
  const mappingModule = await import("../mapping/employee-mapping.js");
  const fieldMapping = mappingModule.fieldNameMapping;

  for (const [key, value] of Object.entries(employeeDTO)) {
    if (!fieldMapping[key]) continue;

    const label = document.createElement("label");
    label.classList.add("title");
    label.textContent = `${(fieldMapping[key] || key).replace(/^./, c => c.toUpperCase())}:`;
    form.appendChild(label);

    if (key === "departmentId") {
      // select для департаментів
      const select = document.createElement("select");
      select.name = key;

      const emptyOption = document.createElement("option");
      emptyOption.value = "";
      emptyOption.textContent = "— Не вибрано —";
      select.appendChild(emptyOption);

      serverData.departments.forEach(dep => {
        const option = document.createElement("option");
        option.value = dep.id;
        option.textContent = dep.name;
        select.appendChild(option);
      });

      form.appendChild(select);
      select.addEventListener("change", () => {
  if (select.value) {
    formData["gender"] = select.value;
  } else {
    delete formData["gender"];
  }
});
      formData[key] = null;

      select.addEventListener("change", () => (formData[key] = select.value || null));

    } else if (key === "managerId") {
      // select для менеджера
      const select = document.createElement("select");
      select.name = key;

      const emptyOption = document.createElement("option");
      emptyOption.value = "";
      emptyOption.textContent = "— Не вибрано —";
      select.appendChild(emptyOption);

      serverData.users.forEach(u => {
        const option = document.createElement("option");
        option.value = u.id;
        option.textContent = u.name;
        select.appendChild(option);
      });

      form.appendChild(select);
      formData[key] = null;

      select.addEventListener("change", () => (formData[key] = select.value || null));

    } else if (key === "photo") {
      const input = document.createElement("input");
      input.type = "file";
      input.name = key;
      input.accept = "image/*";
      form.appendChild(input);

      input.addEventListener("change", () => (formData[key] = input.files[0] || null));

    } else {
      const input = document.createElement("input");
      input.name = key;
      input.value = value || "";
      form.appendChild(input);

      formData[key] = input.value;
      input.addEventListener("input", () => (formData[key] = input.value));
    }
  }

  const createButton = container.querySelector(".btn-wrapper-dark a");
  createButton.addEventListener("click", async () => {
    try {
      const token = localStorage.getItem("jwt-token");
      const url = "http://185.25.119.99:8080/employees/new";

      const jsonData = { ...formData };
      delete jsonData.photo;

      const multipartData = new FormData();
      multipartData.append(
        "employeeDTO",
        new Blob([JSON.stringify(jsonData)], { type: "application/json" })
      );

      if (formData.photo instanceof File) {
        multipartData.append("photo", formData.photo);
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: multipartData,
      });

      if (!response.ok) {
        const errorJson = await response.json();
        displayErrors(errorJson.data);
        return;
      }

      alert("Департамент успішно створено!");
      window.location.reload();
    } catch (error) {
      console.error("Помилка відправки:", error);
    }
  });

  function displayErrors(errors) {
    form.querySelectorAll(".error-message").forEach(el => el.remove());
    if (!errors || typeof errors !== "object") return;

    Object.entries(errors).forEach(([key, message]) => {
      let field = form.querySelector(`[name$=".${key}"]`) || form.querySelector(`[name="${key}"]`);
      if (!field) return;

      const span = document.createElement("span");
      span.classList.add("error-message");
      span.style.color = "red";
      span.style.fontSize = "0.9em";
      span.textContent = message;

      field.insertAdjacentElement("afterend", span);
    });
  }
}
*/