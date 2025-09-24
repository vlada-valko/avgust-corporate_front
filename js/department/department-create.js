export async function getCreateFormData() {
  try {
    const token = localStorage.getItem("jwt-token");
    const response = await fetch(`http://localhost:8080/departments/new`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
    }

    const data = await response.json();
    console.log(data);
         const mappingModule = await import(
        `../mapping/department-mapping.js`
      );
      const fieldNameMapping = mappingModule.fieldNameMapping;
    renderCreateForm(data, fieldNameMapping);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function renderCreateForm(formData, fieldNameMapping = {}) {
  const form = document.querySelector(".entity-create-form form");
  form.innerHTML = "";

  function toSingular(plural) {
    if (plural.endsWith("ies")) return plural.slice(0, -3) + "y";
    if (plural.endsWith("s")) return plural.slice(0, -1);
    return plural;
  }

  const selectsData = {};
  for (const key in formData) {
    if (Array.isArray(formData[key])) {
      const singularKey = toSingular(key.toLowerCase());
      selectsData[singularKey] = formData[key];
    }
  }

  function renderObject(obj, parentKey = "") {
    for (const field in obj) {
      const value = obj[field];

      if (value === null || value === undefined) continue;
      if (!parentKey && !field.endsWith("DTO")) continue;
      if (!fieldNameMapping[field] && !field.endsWith("DTO")) continue;

      const fullKey = parentKey ? `${parentKey}.${field}` : field;
      const fieldLower = field.toLowerCase();

      if (typeof value === "object" && !Array.isArray(value)) {
        if (field.endsWith("DTO")) {
          const sectionTitle = document.createElement("h3");
          sectionTitle.classList.add("entity-create-title");
          sectionTitle.textContent = fieldNameMapping[field] || field;
          form.appendChild(sectionTitle);

          for (const subField in value) {
            if (subField === "id" || !fieldNameMapping[subField]) continue;

            const subValue = value[subField];
            const subFullKey = `${fullKey}.${subField}`;
            const subFieldLower = subField.toLowerCase();

            const wrapper = document.createElement("div");
            wrapper.classList.add("form-field");

            const label = document.createElement("label");
            label.classList.add("main-text");
            label.setAttribute("for", subFullKey);
            label.textContent = fieldNameMapping[subField] || subField;

            let keyForSelect = subFieldLower;
            if (keyForSelect.endsWith("id")) {
              keyForSelect = keyForSelect.slice(0, -2);
            }

            if (selectsData[keyForSelect]) {
              const select = document.createElement("select");
              select.name = subFullKey;
              select.id = subFullKey;

              selectsData[keyForSelect].forEach((optionValue) => {
                const option = document.createElement("option");
                if (typeof optionValue === "object") {
                  option.value = optionValue.id || optionValue.name || optionValue;
                  option.textContent = optionValue.name || optionValue.toString();
                } else {
                  option.value = optionValue;
                  option.textContent = optionValue;
                }
                if (option.value == subValue) option.selected = true;
                select.appendChild(option);
              });

              wrapper.appendChild(label);
              wrapper.appendChild(select);
              form.appendChild(wrapper);

              // ✅ Підключення Choices.js з пошуком
              setTimeout(() => {
                new Choices(select, {
                  searchEnabled: true,
                  itemSelectText: '',
                  shouldSort: false
                });
              }, 0);
            } else {
              let inputType = "text";
              if (subFieldLower.includes("date")) inputType = "date";
              else if (subFieldLower.includes("photo")) inputType = "file";
              else if (subFieldLower.includes("mobile")) inputType = "tel";
              else if (subFieldLower.includes("email")) inputType = "email";
              else if (subFieldLower.includes("password")) inputType = "password";

              const input = document.createElement("input");
              input.type = inputType;
              input.name = subFullKey;
              input.id = subFullKey;

              if (inputType === "date" && subValue) {
                const date = new Date(subValue);
                input.value = !isNaN(date) ? date.toISOString().slice(0, 10) : "";
              } else if (inputType === "file") {
                input.accept = "image/*";
              } else {
                input.value = subValue ?? "";
              }

              if (input.type === "tel") {
                const mask = new Inputmask("(999)-999-99-99");
                mask.mask(input);
              }

              if (input.type === "email") {
                const mask = new Inputmask("email");
                mask.mask(input);
              }

              wrapper.appendChild(label);
              wrapper.appendChild(input);
              form.appendChild(wrapper);
            }
          }
        } else {
          continue;
        }
      } else if (Array.isArray(value)) {
        continue;
      } else {
        if (!fieldNameMapping[field]) continue;

        const wrapper = document.createElement("div");
        wrapper.classList.add("form-field");

        const label = document.createElement("label");
        label.setAttribute("for", fullKey);
        label.textContent = fieldNameMapping[field] || field;

        let inputType = "text";
        if (fieldLower.includes("date")) inputType = "date";
        else if (fieldLower.includes("photo")) inputType = "file";
        else if (fieldLower.includes("mobile")) inputType = "tel";
        else if (fieldLower.includes("email")) inputType = "email";

        const input = document.createElement("input");
        input.type = inputType;
        input.name = fullKey;
        input.id = fullKey;

        if (inputType === "date" && value) {
          const date = new Date(value);
          input.value = !isNaN(date) ? date.toISOString().slice(0, 10) : "";
        } else if (inputType === "file") {
          input.accept = "image/*";
        } else {
          input.value = value;
        }

        if (input.type === "tel") {
          input.pattern = "\\(\\d{3}\\)-\\d{3}-\\d{2}-\\d{2}";
          const mask = new Inputmask("(999)-999-99-99");
          mask.mask(input);
        }

        if (input.type === "email") {
          const mask = new Inputmask("email");
          mask.mask(input);
        }

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        form.appendChild(wrapper);
      }
    }
  }

  renderObject(formData);

  const submitWrapper = document.createElement("div");
  submitWrapper.classList.add("btn-wrapper-dark", "submit");

  const submitLink = document.createElement("a");
  submitLink.href = "javascript:void(0)";

  const submitSpan = document.createElement("span");
  submitSpan.textContent = "Створити";

  submitLink.appendChild(submitSpan);
  submitWrapper.appendChild(submitLink);
  form.appendChild(submitWrapper);
}


async function collectFormData(formElement) {
  const formData = new FormData(formElement);
  const data = {};
  let photoFile = null;

  for (const [key, value] of formData.entries()) {
    if (
      key.toLowerCase().includes("photo") &&
      value instanceof File &&
      value.size > 0
    ) {
      photoFile = await resizeImage(value);
    } else if (
      key.toLowerCase().includes("mobile") ||
      key.toLowerCase().includes("phone")
    ) {
      // 🔧 Очищення телефону — тільки цифри
      data[key] = value.replace(/\D/g, "");
    } else {
      data[key] = value;
    }
  }

  return { data, photoFile };
}


export async function sendDataFromForm(data, photoFile, entityName) {
  const token = localStorage.getItem("jwt-token");
  const userRole = localStorage.getItem("userRole");

  if (userRole !== "ROLE_ADMIN" && userRole !== "ROLE_MANAGER") {
    renderError403();
    return null;
  }

  try {
    const url = ` http://localhost:8080/${entityName}/new`;
    // const url = `https://avgust-corporate-server.fly.dev/${entityName}/new`;

    const hasPhotoField = Object.keys(data).some((key) =>
      key.toLowerCase().includes("photo")
    );
    const hasPhotoFile = !!photoFile;

    if (!hasPhotoField && !hasPhotoFile) {
      // Якщо фото нема — відправляємо чистий JSON (плоска структура)
      const dataToSend = flattenData(data);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorJson = await response.json();
        renderErrorFields(errorJson.data);
        return null;
      }

      alert("Успішно створено");
      return (await response.json()).data;
    }

    // Якщо поле фото є (навіть якщо файл не вибрано) — формуємо multipart/form-data

    // Вибираємо з data всі поля, крім тих, що містять "photo"
    const jsonData = {};
    for (const key in data) {
      if (key.toLowerCase().includes("photo")) continue; // пропускаємо фото поле
      if (key.includes(".")) {
        const parts = key.split(".");
        jsonData[parts[1]] = data[key];
      } else {
        jsonData[key] = data[key];
      }
      console.log("jsonData " + jsonData);
    }

    // Створюємо FormData
    const multipartData = new FormData();
    // Замість Blob робимо File із правильним Content-Type
    const dtoFile = new File(
      [JSON.stringify(jsonData)],
      toSingular(entityName) + "DTO.json",
      {
        type: "application/json",
      }
    );
    multipartData.append(toSingular(entityName) + "DTO", dtoFile);
    console.log("multipartData " + multipartData);

    // Додаємо фото файл, якщо він є
    if (photoFile) {
      console.log("if (photoFile) { ");
      multipartData.append("photo", photoFile);
    }

    console.log("multipart/form-data для відправки:");
    for (const [key, val] of multipartData.entries()) {
      console.log(key, val instanceof File ? val.name : val);
    }

    // Відправляємо multipart/form-data
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // НЕ вказуємо Content-Type — браузер сам поставить його з коректним boundary
      },
      body: multipartData,
    });

    if (!response.ok) {
      const errorJson = await response.json();
      renderErrorFields(errorJson.data);
      return null;
    }
console.log("1window.location.href = window.location.href")
    alert("Успішно створено !!!!!");
window.location.href = window.location.href;
console.log("window.location.href = window.location.href")
    return (await response.json()).data;
  
  } catch (error) {
    console.error(error);
    renderError500();
    return null;
  }
}

function flattenData(data) {
  const result = {};
  for (const key in data) {
    if (key.toLowerCase().includes("photo")) {
      // Ігноруємо ключі, що містять photo
      continue;
    }

    if (key.includes(".")) {
      // Якщо ключ типу employeeDTO.firstName — беремо останню частину
      const parts = key.split(".");
      result[parts[1]] = data[key];
    } else {
      // Простий ключ без крапки
      result[key] = data[key];
    }
  }
  return result;
}

function renderErrorFields(errors) {
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

function pluralize(endpoint) {
  const baseName = endpoint.replace("create-", "");
  if (
    baseName.endsWith("y") &&
    !"aeiou".includes(baseName[baseName.length - 2])
  ) {
    return baseName.slice(0, -1) + "ies"; // city → cities
  }
  if (
    baseName.endsWith("s") ||
    baseName.endsWith("x") ||
    baseName.endsWith("z") ||
    baseName.endsWith("sh") ||
    baseName.endsWith("ch")
  ) {
    return baseName + "es";
  }
  return baseName + "s";
}
function toSingular(entityName) {
  if (entityName.endsWith("ies")) return entityName.slice(0, -3) + "y";
  if (entityName.endsWith("s")) return entityName.slice(0, -1);
  return entityName;
}
function toggleEntityCreateBlock(open = true) {
  const block = document.querySelector(".entity-create-block");
  const closeBtn = block.querySelector(".close-btn button");

  if (open) {
    block.classList.add("visible");

    if (!closeBtn.dataset.listenerAttached) {
      closeBtn.addEventListener("click", () => {
        toggleEntityCreateBlock(false);
      });
      closeBtn.dataset.listenerAttached = "true";
    }
  } else {
    block.classList.remove("visible");
  }
}

async function resizeImage(file, maxWidth = 800, maxHeight = 800, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Пропорційне зменшення
        if (width > maxWidth || height > maxHeight) {
          const scale = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Не вдалося створити файл"));
            // 🔹 Повертаємо одразу файл
            resolve(new File([blob], file.name, { type: file.type }));
          },
          file.type,
          quality
        );
      };
      img.onerror = reject;
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}