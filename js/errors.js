export function renderError500() {
  form.innerHTML = "";
  const errorText = document.createElement("p");
  errorText.textContent = "Щось зламалось";
  errorText.style.color = "red";
  errorText.style.fontWeight = "bold";
  errorText.style.textAlign = "center";
  errorText.style.marginBottom = "15px";
  form.appendChild(errorText);

  const errorImg = document.createElement("img");
  errorImg.src = "/img/errors/500.jpg";
  errorImg.alt = "Error image";
  errorImg.style.width = "100%";
  errorImg.style.marginBottom = "10px";

  form.appendChild(errorImg);
}

export function renderError403() {
  const modal = document.createElement("div");
  modal.classList.add("error-modal");

  // Контейнер для контенту
  const content = document.createElement("div");
  content.classList.add("error-content");

  const img = document.createElement("img");
  img.src = "/img/errors/403.jpg";
  img.alt = "403 error";
  img.style.maxWidth = "300px";
  img.style.borderRadius = "10px";

  const text = document.createElement("p");
  text.textContent = "На жаль, у Вас немає доступу до даної сторінки або даної дії";

  const closeModal = document.createElement("div");
  closeModal.classList.add("btn-wrapper-light");
  closeModal.classList.add("submit");
  const submitLink = document.createElement("a");
  submitLink.href = "javascript:void(0)";
  const submitSpan = document.createElement("span");
  submitSpan.textContent = "Закрити";
  submitLink.appendChild(submitSpan);
  closeModal.appendChild(submitLink);

  closeModal.addEventListener("click", () => {
    modal.remove();
  });
modal.addEventListener("click", (e) => {
  if (!content.contains(e.target)) {
    modal.remove(); 
  }
});
  content.appendChild(text);
  content.appendChild(img);
  content.appendChild(closeModal);
  modal.appendChild(content);
  document.body.appendChild(modal);
  
}

export function renderError401() {
  const modal = document.createElement("div");
  modal.classList.add("error-modal");

  // Контейнер для контенту
  const content = document.createElement("div");
  content.classList.add("error-content");

  const img = document.createElement("img");
  img.src = "/img/errors/401.jpg";
  img.alt = "401 error cat";
  img.style.maxWidth = "300px";
  img.style.borderRadius = "10px";

  const text = document.createElement("p");
  text.textContent = "Сервер тебе не впізнає. Авторизуйся, будь ласка, ще раз.";

  const closeModal = document.createElement("div");
  closeModal.classList.add("btn-wrapper-light");
  closeModal.classList.add("submit");
  const submitLink = document.createElement("a");
  submitLink.href = "javascript:void(0)";
  const submitSpan = document.createElement("span");
  submitSpan.textContent = "Закрити";
  submitLink.appendChild(submitSpan);
  closeModal.appendChild(submitLink);

  closeModal.addEventListener("click", () => {
    modal.remove();
  });
modal.addEventListener("click", (e) => {
  if (!content.contains(e.target)) {
    modal.remove(); 
  }
});
  content.appendChild(text);
  content.appendChild(img);
  content.appendChild(closeModal);
  modal.appendChild(content);
  document.body.appendChild(modal);
  
}

