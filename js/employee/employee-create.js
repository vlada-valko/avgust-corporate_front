// import { employeeFieldMapping } from "./employee-mapping.js";
// import { getCreateUserForms } from "../user/user-create.js";

// async function resizeImage(file, maxWidth = 800, maxHeight = 800, quality = 0.7) {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.onload = () => {
//       let { width, height } = img;
//       const scale = Math.min(maxWidth / width, maxHeight / height, 1);
//       width *= scale;
//       height *= scale;

//       const canvas = document.createElement("canvas");
//       canvas.width = width;
//       canvas.height = height;
//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(img, 0, 0, width, height);
//       canvas.toBlob(blob => {
//         if (blob) resolve(blob);
//         else reject(new Error("Не вдалося стиснути зображення"));
//       }, "image/jpeg", quality);
//     };
//     img.onerror = () => reject(new Error("Помилка при завантаженні зображення"));
//     img.src = URL.createObjectURL(file);
//   });
// }

// // Отримання форми
// export async function getCreateEmployeeForms() {
//   try {
//     const token = localStorage.getItem("jwt-token");
//     const res = await fetch("http://localhost:8080/employees/new", {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     if (!res.ok) throw new Error("Не вдалося завантажити форму");
//     const json = await res.json();
//     console.log(json)
//     createEmployeeForm(json.data);
//   } catch (err) {
//     console.error("Помилка завантаження:", err);
//   }
// }

// // Створення форми
// function createEmployeeForm(data) {
//   const container = document.querySelector(".create-new-employee__create-employee");
//   container.innerHTML = "";
//   container.style.display = "flex";
//   // 🔧 Виправлені ключі: вони тепер відповідають createEmployeeForm
//   const selectFields = {
//     departmentId: data.departments,
//     positionId: data.positions,
//    workplaceTypeId: data.workplaceTypes,
//     gender: data.genders,
//     role: data.roles,
//   };

//   container.innerHTML += `
//     <div class="close-btn"><button><img src="/img/close.png" alt="close-cross"></button></div>
//     <p class="title">Дані нового співробітника</p>
//     <div class="form-field">
//       <label for="userId" class="main-text">Користувач</label>
//       <select id="userId" name="userId">
//         ${data.users.map(u => `<option value="${u.id}">${u.username}</option>`).join("")}
//       </select>
//       <div class="error-message" id="userId-error"></div>
//     </div>
//   `;

//   document.querySelector(".close-btn").addEventListener("click", () => {
//     document.querySelector(".create-new-employee__container").classList.remove("visible");
//   });

//   for (const field in data.createEmployeeForm) {
//     if (!employeeFieldMapping[field]) continue;

//     if (field === "residentialAddress") {
//       const addressFields = ["country", "city", "street", "houseNumber", "apartmentNumber"];
//       const addressHTML = addressFields.map(
//         id =>
//           `<input id="${id}" name="${id}" type="text" placeholder="${id[0].toUpperCase() + id.slice(1)}">`
//       ).join("");
//       container.innerHTML += `
//         <div class="form-field address-field">
//           <label class="main-text">Адреса:</label>
//           ${addressHTML}
//         </div>
//       `;
//       continue;
//     }

//     const label = `<label for="${field}" class="main-text">${employeeFieldMapping[field]}</label>`;
//     let input;

//     if (selectFields[field]) {
//       input = `<select id="${field}" name="${field}">
//         ${selectFields[field]
//           .map(
//             item =>
//               `<option value="${item.id ?? item}">${item.name ?? item}</option>`
//           )
//           .join("")}
//       </select>`;
//     } else {
//       let type = "text";
//       if (field === "dateOfBirth") type = "date";
//       else if (field === "photo") type = "file";
//       else if (field.includes("Email")) type = "email";
//       else if (["personalMobile", "corporateMobile", "internalPhone"].includes(field)) type = "tel";

//       input = `<input id="${field}" name="${field}" type="${type}">`;
//     }

//     container.innerHTML += `
//       <div class="form-field">
//         ${label}
//         ${input}
//         <div class="error-message" id="${field}-error"></div>
//       </div>
//     `;
//   }

//   const saveBtnWrapper = document.createElement("div");
//   saveBtnWrapper.className = "btn-wrapper-dark";
//   saveBtnWrapper.innerHTML = `<button class="submit-btn" type="submit"><span>Зберегти</span></button>`;
//   saveBtnWrapper.addEventListener("click", e => {
//     e.preventDefault();
//     createEmployee();
//   });
//   container.appendChild(saveBtnWrapper);

//   const addUserBtnWrapper = document.createElement("div");
//   addUserBtnWrapper.className = "btn-wrapper-dark";
//   addUserBtnWrapper.innerHTML = `<button class="add-user-btn" type="button"><span>Додати користувача</span></button>`;
//   addUserBtnWrapper.addEventListener("click", () => {
//     container.style.display = "none";
//     addUserBtnWrapper.style.display = "none";
//     getCreateUserForms();
//   });
//   document.querySelector(".create-new-employee__container").appendChild(addUserBtnWrapper);
// }

// export async function createEmployee() {
//   try {
//     const token = localStorage.getItem("jwt-token");
//     const form = document.querySelector(".create-new-employee__create-employee");
//     const inputs = form.querySelectorAll("input, select, textarea");

//     const data = {};
//     const formData = new FormData();
//     const addressParts = [];

//     // Очистка старих помилок
//     document.querySelectorAll(".error-message").forEach(el => (el.textContent = ""));

//     for (const input of inputs) {
//       const key = input.name || input.id;
//       if (!key) continue;

//       // Адреса
//       if (["country", "city", "street", "houseNumber", "apartmentNumber"].includes(key)) {
//         addressParts.push(input.value.trim());
//         continue;
//       }

//       // Фото
//       if (input.type === "file") {
//         const file = input.files[0];
//         if (file) {
//           if (!file.type.startsWith("image/")) {
//             const error = document.getElementById("photo-error");
//             if (error) error.textContent = "Некоректний формат фото. Завантажте зображення.";
//             return;
//           }
//           try {
//             const resized = await resizeImage(file);
//             formData.append("photo", resized, file.name);
//           } catch {
//             const error = document.getElementById("photo-error");
//             if (error) error.textContent = "Не вдалося обробити зображення.";
//             return;
//           }
//         }
//       } else {
//         let value = input.value.trim();

//         // Телефони — тільки цифри
//         if (["personalMobile", "corporateMobile"].includes(key)) {
//           value = value.replace(/\D/g, "");
//         }

//         // gender — залишаємо як рядок, решта select — число
//         if (input.tagName.toLowerCase() === "select") {
//           if (key === "gender") {
//             data[key] = value; // "Ч" або "Ж"
//           } else {
//             data[key] = Number(value); // Прокидаємо id
//           }
//         } else {
//           data[key] = value;
//         }
//       }
//     }

//     const filtered = addressParts.filter(Boolean);
// const len = filtered.length;

// if (len >= 2) {
//   filtered[len - 2] = "буд " + filtered[len - 2];
//   filtered[len - 1] = "кв " + filtered[len - 1];
// }

// data.residentialAddress = filtered.join(", ");
//     formData.append("employeeDTO", new Blob([JSON.stringify(data)], { type: "application/json" }));

//     const res = await fetch("http://localhost:8080/employees/new", {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//       body: formData,
//     });

//     if (!res.ok) {
//       const errorData = await res.json();
//       const errors = errorData.data || {};
//       for (const field in errors) {
//         const el = document.getElementById(`${field}-error`);
//         if (el) el.textContent = errors[field];
//       }
//       return;
//     }
//     console.log(formData)
//     alert("Працівник успішно створений");
//     window.location.reload();
//   } catch (err) {
//     console.error("Помилка відправки запиту:", err);
//   }
// }
