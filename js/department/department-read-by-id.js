import { deleteDepartment } from "./department-delete.js";
import { updateDepartment } from "./department-update.js";

const departmentContainer = document.querySelector(
  ".department-card-container"
);
export async function readDepartmentById(id) {
  console.log("try to read id: " + id);
  try {
    const token = localStorage.getItem("jwt-token");
    const response = await fetch(`http://localhost:8080/departments/${id}`, {
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
    console.log(data);
    departmentContainer.classList.add("visible");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    document.querySelector(".department-list").style.display = "none";
    renderDepartmentById(data);
  } catch (error) {
    console.error(error);
  }
}

export function renderDepartmentById(department) {
  const containerWrapper = document.querySelector(
    ".department-card-container.wrapper"
  );

  if (!department || !department.id) {
    containerWrapper.innerHTML = "<p>Дані відсутні.</p>";
    return;
  }
  // PHOTO
  const photoContainer = document.querySelector(
    ".department-card__photo-container img"
  );
  if (department.photo) {
    let relativePath = department.photo
      .replace(/^.*\\uploads\\/, "uploads\\")
      .replace(/\\/g, "/");
    relativePath = relativePath.replace(/(departments)([^/])/, "$1/$2");
    photoContainer.src = "http://localhost:8080/" + relativePath;
  } else {
    photoContainer.src = "/img/team/default.jpg";
  }

  //NAME
  const nameContainer = document.querySelector(".department-card__name");
  department.name
    ? (nameContainer.innerHTML = department.name)
    : (nameContainer.innerHTML = "<p>Дані відсутні.</p>");

  //MANAGER
  const managerContainer = document.querySelector(
    ".department-card__manager a"
  );
  if (department.managerName) {
    managerContainer.innerHTML = `
  <a href="${department.managerId}">
    <span>${department.managerName}</span>
  </a>`;
  } else {
    managerContainer.innerHTML = `
    <p>не визначено</p>
`;
  }

  //MISSION
  const missionContainer = document.querySelector(
    ".department-card__mission p"
  );
  department.mission
    ? (missionContainer.innerHTML = department.mission)
    : (missionContainer.innerHTML = "<p>Дані відсутні.</p>");

  //GOALS
  const goalsContainer = document.getElementById("department-goals");
  department.goals
    ? (goalsContainer.innerHTML = department.goals)
    : (goalsContainer.innerHTML = "<p>Дані відсутні.</p>");

  //mainTasks
const mainTasksContainer = document.getElementById("department-mainTasks");
if (department.mainTasks) {
    const formattedText = department.mainTasks.replace(/\. /g, '.<br>');
    mainTasksContainer.innerHTML = formattedText;
} else {
    mainTasksContainer.innerHTML = "<p>Дані відсутні.</p>";
}


// workPrinciples
const workPrinciplesContainer = document.getElementById("department-workPrinciples");

if (department.workPrinciples) {
    const formattedText = department.workPrinciples.replace(/\.(\s|$)/g, '.<br>');
    workPrinciplesContainer.innerHTML = formattedText;
} else {
    workPrinciplesContainer.innerHTML = "<p>Дані відсутні.</p>";
}


    //team
  const departmentTeam = department.employees;
  const departmentTeamContainer = document.querySelector("#department-team ul");
  departmentTeamContainer.innerHTML = "";
  if (!departmentTeam || Object.keys(departmentTeam).length === 0) {
    departmentTeamContainer.innerHTML = "<li>Дані відсутні.</li>";
  } else {
    Object.entries(departmentTeam).forEach(([id, name]) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="employee/${id}"><span>${name}</span></a>`; // HTML вставляємо через innerHTML
      departmentTeamContainer.appendChild(li);
    });
  }

  //admin
  document.querySelector(".department-card__admin-panel .department-card__delete")
  .addEventListener("click", () => {
    const result = confirm("Ви впевнені, що хочете видалити департамент?");
if (result) {
    deleteDepartment(department.id);
} else {
    console.log("Видалення скасовано");
}
  })
  
  document.querySelector(".department-card__admin-panel .department-card__edit")
  .addEventListener("click",()=>{
    updateDepartment(department.id);
  })

  //closeBtn
  document
    .querySelector(".department-card-container .close-btn")
    .addEventListener("click", () => {
      departmentContainer.classList.remove("visible");
      document.querySelector(".department-list").style.display = "flex";
    });

    
}
