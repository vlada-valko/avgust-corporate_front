import {renderError500} from "./errors.js";
import {renderError403} from "./errors.js";
import {renderError401} from "./errors.js";


console.log("Скрипт підключено");
const form = document.querySelector(".entity-create-form form");

document.querySelectorAll(".btn-wrapper-dark[id^='create-']").forEach((btn) => {
  btn.addEventListener("click", async () => {
    toggleEntityCreateBlock(true);
    const data = await getCreateFormData(pluralize(btn.id));
    if (data) {
      const mappingModule = await import(
        `./mapping/${btn.id.replace("create-", "")}-mapping.js`
      );
      const fieldNameMapping = mappingModule.fieldNameMapping;
      renderCreateForm(data, fieldNameMapping);

      document
        .querySelector(".entity-create-block .submit")
        .addEventListener("click", async () => {
          const { data, photoFile } = await collectFormData(form);
          sendDataFromForm(data, photoFile, pluralize(btn.id));
        });
    }
  });
});


export async function getCreateFormData(entityName) {
  try {
    const token = localStorage.getItem("jwt-token");
    const response = await fetch(`http://localhost:8080/${entityName}/new`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      renderError500();
    }

    const data = await response.json();
    console.log(data);
    // renderCreateForm(data.data, fieldNameMapping);
    return data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function renderCreateForm(formData, fieldNameMapping = {}) {
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

      const fullKey = parentKey ? `${parentKey}.${field}` : field;
      const fieldLower = field.toLowerCase();

      if (typeof value === "object" && !Array.isArray(value)) {
        if (field.endsWith("DTO")) {
          const sectionTitle = document.createElement("h3");
          sectionTitle.textContent = fieldNameMapping[field] || field;
          form.appendChild(sectionTitle);

          for (const subField in value) {
            if (!(subField === "id")) {
              const subValue = value[subField];
              const subFullKey = `${fullKey}.${subField}`;
              const subFieldLower = subField.toLowerCase();

              const wrapper = document.createElement("div");
              wrapper.classList.add("form-field");

              const label = document.createElement("label");
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
                    option.value =
                      optionValue.id || optionValue.name || optionValue;
                    option.textContent =
                      optionValue.name || optionValue.toString();
                  } else {
                    option.value = optionValue;
                    option.textContent = optionValue;
                  }
                  if (option.value == subValue) option.selected = true;
                  select.appendChild(option);
                });

                wrapper.appendChild(label);
                wrapper.appendChild(select);
              } else {
                let inputType = "text";
                if (subFieldLower.includes("date")) {
                  inputType = "date";
                } else if (subFieldLower.includes("photo")) {
                  inputType = "file";
                } else if (subFieldLower.includes("mobile")) {
                  inputType = "tel";
                } else if (subFieldLower.includes("email")) {
                  inputType = "email";
                }

                const input = document.createElement("input");
                input.type = inputType;
                input.name = subFullKey;
                input.id = subFullKey;

                if (inputType === "date" && subValue) {
                  const date = new Date(subValue);
                  input.value = !isNaN(date)
                    ? date.toISOString().slice(0, 10)
                    : "";
                } else if (inputType === "file") {
                  input.accept = "image/*";
                } else {
                  input.value = subValue ?? "";
                }

                // Маска для телефонів
                if (input.type === "tel") {
                  input.pattern = "\\(\\d{3}\\)-\\d{3}-\\d{2}-\\d{2}";
                  const mask = new Inputmask("(999)-999-99-99");
                  mask.mask(input);
                }

                // Маска для email
                if (input.type === "email") {
                  const mask = new Inputmask("email");
                  mask.mask(input);
                }

                wrapper.appendChild(label);
                wrapper.appendChild(input);
              }

              form.appendChild(wrapper);
            }
          }
        } else {
          // інша логіка для звичайних об'єктів
        }
      } else if (Array.isArray(value)) {
        // логіка для масивів, якщо потрібно
      } else {
        const wrapper = document.createElement("div");
        wrapper.classList.add("form-field");

        const label = document.createElement("label");
        label.setAttribute("for", fullKey);
        label.textContent = fieldNameMapping[field] || field;

        let inputType = "text";
        if (fieldLower.includes("date")) {
          inputType = "date";
        } else if (fieldLower.includes("photo")) {
          inputType = "file";
        } else if (fieldLower.includes("mobile")) {
          inputType = "tel";
        } else if (fieldLower.includes("email")) {
          inputType = "email";
        }

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

        // Маска для телефонів
        if (input.type === "tel") {
          input.pattern = "\\(\\d{3}\\)-\\d{3}-\\d{2}-\\d{2}";
          const mask = new Inputmask("(999)-999-99-99");
          mask.mask(input);
        }

        // Маска для email
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
  submitWrapper.classList.add("btn-wrapper-dark");
  submitWrapper.classList.add("submit");
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
      photoFile = await  resizeImage(value) ;
      
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
    const url = `http://localhost:8080/${entityName}/new`;

    if (photoFile) {
      // При multipart треба прибрати крапки з ключів
      const jsonData = {};
      for (const key in data) {
        if (key.includes(".")) {
          const parts = key.split(".");
          jsonData[parts[1]] = data[key];
        } else {
          jsonData[key] = data[key];
        }
      }

      const multipartData = new FormData();
      const jsonBlob = new Blob([JSON.stringify(jsonData)], {
        type: "application/json",
      });

      multipartData.append(toSingular(entityName) + "DTO", jsonBlob);
      multipartData.append("photo", photoFile);

      console.log("multipart/form-data для відправки:");
      for (const [key, val] of multipartData.entries()) {
        console.log(key, val);
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
        renderErrorFields(errorJson.data);
        return null;
      }

      alert("Успішно створено");
      return (await response.json()).data;
    } else {
      // JSON без фото — flattenData для ключів без крапок
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
  } catch (error) {
    console.error(error);
    renderError500();
    return null;
  }
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
function flattenData(data) {
  const result = {};
  for (const key in data) {
    if (key.includes(".")) {
      // "userDTO.username" → "username"
      const parts = key.split(".");
      result[parts[1]] = data[key];
    } else {
      result[key] = data[key];
    }
  }
  return result;
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
            if (blob) resolve(blob);
            else reject(new Error("Не вдалося створити зображення"));
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


