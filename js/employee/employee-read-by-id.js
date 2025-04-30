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
        window.scrollTo({
            top: 0, // прокручуємо до самого верху
            behavior: 'smooth' // плавний ефект прокручування
        });
        
        const data = await response.json();
        document.querySelector(".our-team__read-by-id-container").classList.add("visible");
        renderEmployeeById(data);
    } catch (error) {
        console.error(error);
    }
}

function renderEmployeeById(employee) {
    // const container = document.querySelector(".our-team__read-by-id-container");
    container.innerHTML = "";

    // Create and add the close button (X)
    const closeButton = document.createElement("button");
    closeButton.classList.add("close-button");
    closeButton.innerHTML = "&times;";  // This will display a "×" as a close button.
    closeButton.addEventListener("click", () => {
        document.querySelector(".our-team__read-by-id-container").classList.remove("visible");
        document.querySelector(".overlay").classList.remove("visible");
    });
    container.appendChild(closeButton);

    if (!employee || Object.keys(employee).length === 0) {
        container.innerHTML += "<p>Дані відсутні.</p>";
        return;
    }

    // Photo Wrapper
    const photoWrapper = document.createElement("div");
    photoWrapper.classList.add("our-team__person-photo");

    const photoForm = document.createElement("form");
    const photoInput = document.createElement("input");
    photoInput.type = "image";
    photoInput.id = "image";
    photoInput.alt = "photo";
    const base64Data = employee.photo;
    photoInput.src = base64Data !== null ? 
      `data:image/jpeg;base64,${base64Data}` 
      :  "/img/team/default.jpg"; 
    photoInput.style = "pointer-events: none; cursor: default";
    photoForm.appendChild(photoInput);
    photoWrapper.appendChild(photoForm);

    // Info Wrapper
    const infoWrapper = document.createElement("div");
    infoWrapper.classList.add("our-team__person-info");
    
    const infoForm = document.createElement("form");

    const nameGroup = document.createElement("div");
    nameGroup.classList.add("form-group");

    const lastNameInput = document.createElement("input");
    lastNameInput.type = "text";
    lastNameInput.id = "lastName";
    lastNameInput.value = employee.lastName || "Без прізвища";
    lastNameInput.classList.add("title");
    lastNameInput.readOnly = true;

    const firstNameInput = document.createElement("input");
    firstNameInput.type = "text";
    firstNameInput.id = "firstName";
    firstNameInput.value = employee.firstName || "Без імені";
    firstNameInput.classList.add("title");
    firstNameInput.readOnly = true;

    const middleNameInput = document.createElement("input");
    middleNameInput.type = "text";
    middleNameInput.id = "middleName";
    middleNameInput.value = employee.middleName || "Без по батькові";
    middleNameInput.classList.add("title");
    middleNameInput.readOnly = true;

    nameGroup.appendChild(lastNameInput);
    nameGroup.appendChild(firstNameInput);
    nameGroup.appendChild(middleNameInput);

    const positionGroup = document.createElement("div");
    positionGroup.classList.add("form-group");

    const positionInput = document.createElement("input");
    positionInput.type = "text";
    positionInput.id = "position";
    positionInput.value = employee.position || "Не вказано";
    positionInput.classList.add("main-text");
    positionInput.readOnly = true;

    const experienceInput = document.createElement("input");
    experienceInput.type = "text";
    experienceInput.id = "experience";

    let experienceValue = "Не вказано";
    if (employee.employmentStartDate) {
        const startDate = new Date(employee.employmentStartDate);
        if (!isNaN(startDate)) {
            const experience = Date.now() - startDate.getTime();
            const yearsExperience = experience / (1000 * 60 * 60 * 24 * 365.25);
            experienceValue = `${Math.floor(yearsExperience)} роки досвіду`;
        }
    }
    experienceInput.value = experienceValue;
    experienceInput.classList.add("main-text");
    experienceInput.readOnly = true;

    positionGroup.appendChild(positionInput);
    positionGroup.appendChild(experienceInput);

    infoForm.appendChild(nameGroup);
    infoForm.appendChild(positionGroup);
    infoWrapper.appendChild(infoForm);

    // Contact Wrapper
    const contactWrapper = document.createElement("div");
    contactWrapper.classList.add("our-team__person-contacts");

    // Phone Icon
    const callIcon = document.createElement("div");
    callIcon.classList.add("contact-icon");
    const callLink = document.createElement("a");
    callLink.href = "tel:" + (employee.personalMobile || "");
    const callImg = document.createElement("img");
    callImg.src = "/img/call.png";
    callImg.alt = "call";
    callLink.title = `Телефон: ${employee.personalMobile || "не вказано"}`;
    callLink.appendChild(callImg);
    const callText = document.createElement("span");
    callText.innerText = employee.personalMobile || "Телефон не вказано";
    callIcon.appendChild(callLink);
    callIcon.appendChild(callText);

    // Email Icon
    const emailIcon = document.createElement("div");
    emailIcon.classList.add("contact-icon");
    const emailLink = document.createElement("a");
    emailLink.href = `mailto:${employee.personalEmail || ""}`;
    const emailImg = document.createElement("img");
    emailImg.src = "/img/email.png";
    emailImg.alt = "email";
    emailLink.appendChild(emailImg);
    const emailText = document.createElement("span");
    emailText.innerText = employee.personalEmail || "Email не вказано";
    emailText.title = `Пошта: ${employee.personalEmail || "не вказано"}`;
    emailIcon.appendChild(emailLink);
    emailIcon.appendChild(emailText);

    contactWrapper.appendChild(callIcon);
    contactWrapper.appendChild(emailIcon);

    // Button Wrapper
    const btnWrapperEdit = document.createElement("div");
    btnWrapperEdit.classList.add("btn-wrapper-dark");
    const btnLinkEdit = document.createElement("a");
    btnLinkEdit.href = `javascript:void(0)`;
    btnLinkEdit.innerHTML = `<span>Змінити</span>`;
    btnWrapperEdit.appendChild(btnLinkEdit);

    const btnWrapperDelete = document.createElement("div");
    btnWrapperDelete.classList.add("btn-wrapper-dark");
    const btnLinkDelete = document.createElement("a");
    btnLinkDelete.href = `javascript:void(0)`;
    btnLinkDelete.innerHTML = `<span>Видалити</span>`;
    btnWrapperDelete.appendChild(btnLinkDelete);

    // Add everything to the main container
    container.appendChild(photoWrapper);
    container.appendChild(infoWrapper);
    container.appendChild(contactWrapper);
    container.appendChild(btnLinkDelete);
    container.appendChild(btnWrapperEdit);

}

function saveToJSON() {
    const editableText = document.getElementById('editableText').innerText; // отримуємо редагований текст
    const jsonData = {
      content: editableText
    };
  
    // Для демонстрації виведемо в консоль
    console.log(JSON.stringify(jsonData));
  
    // Тепер можна зберегти jsonData в локальному сховищі, на сервері, чи куди необхідно
  }
  document.getElementById("saveToJSON").addEventListener("click", () => {
    saveToJSON();
  })
  