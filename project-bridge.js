const CroakleProjectStoreKey = "CroakleProjectDataV1";
const CroakleDefaultProjects = [
  { id: "CroakleProjectGitHub", name: "GitHub", goal: 5, description: "push code, fix bugs", priority: "medium", completed: false },
  { id: "CroakleProjectUI", name: "UI Polish", goal: 3, description: "clean layouts and spacing", priority: "high", completed: false },
  { id: "CroakleProjectExport", name: "Export Data", goal: 2, description: "CSV and JSON backup", priority: "low", completed: false },
];

let CroakleProjectState = CroakleLoadProjectState();

const CroakleProjectList = document.querySelector("#CroakleProjectList");
const CroakleProjectDates = document.querySelector("#CroakleProjectDates");
const CroakleProjectMoodPreview = document.querySelector("#CroakleProjectMoodPreview");
const CroakleProjectMonth = document.querySelector("#CroakleProjectMonth");
const CroakleProjectAddButton = document.querySelector("#CroakleOpenAddProject");
const CroakleProjectReorderButton = document.querySelector("#CroakleOpenReorderProject");
const CroakleProjectDetailDialog = document.querySelector("#CroakleProjectDetailDialog");
const CroakleProjectDetailForm = document.querySelector("#CroakleProjectDetailForm");
const CroakleProjectDeleteButton = document.querySelector("#CroakleDeleteProjectButton");
const CroakleProjectCloseButton = document.querySelector("#CroakleCloseProjectDetail");
const CroakleProjectCompleteButton = document.querySelector("#CroakleCompleteProjectButton");

function CroakleLoadProjectState() {
  const saved = localStorage.getItem(CroakleProjectStoreKey);

  if (!saved) {
    return CroakleCreateDefaultProjectState();
  }

  try {
    return CroakleNormalizeProjectState(JSON.parse(saved));
  } catch {
    return CroakleCreateDefaultProjectState();
  }
}

function CroakleCreateDefaultProjectState() {
  return {
    projects: CroakleDefaultProjects.map((project) => CroakleCreateProject(project)),
  };
}

function CroakleNormalizeProjectState(state) {
  const projects = Array.isArray(state?.projects) && state.projects.length ? state.projects : CroakleDefaultProjects;

  return {
    projects: projects.map((project, index) => CroakleCreateProject(project, index)),
  };
}

function CroakleCreateProject(project, index = 0) {
  return {
    id: project.id || `CroakleProject${Date.now()}${index}`,
    name: project.name || "New Project",
    goal: CroakleProjectClampGoal(project.goal),
    description: project.description || "",
    priority: project.priority || "medium",
    completed: Boolean(project.completed),
    days: Array.from({ length: 7 }, (_, dayIndex) => Boolean(project.days?.[dayIndex])),
  };
}

function CroakleSaveProjectState() {
  localStorage.setItem(CroakleProjectStoreKey, JSON.stringify(CroakleProjectState));
}

function CroakleProjectClampGoal(goal) {
  const cleanGoal = Number(goal);
  if (!Number.isFinite(cleanGoal)) {
    return 1;
  }
  return Math.min(7, Math.max(1, Math.round(cleanGoal)));
}

function CroakleProjectGetToday() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function CroakleProjectShiftDate(date, amount) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

function CroakleProjectGetWeekDates() {
  const today = CroakleProjectGetToday();
  const mondayOffset = -((today.getDay() + 6) % 7);
  const monday = CroakleProjectShiftDate(today, mondayOffset);
  return Array.from({ length: 7 }, (_, index) => CroakleProjectShiftDate(monday, index));
}

function CroakleProjectGetMonthLabel(date) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function CroakleRenderProjectHeader() {
  const weekDates = CroakleProjectGetWeekDates();
  if (!CroakleProjectDates || !CroakleProjectMoodPreview || !CroakleProjectMonth) {
    return;
  }

  CroakleProjectMonth.textContent = CroakleProjectGetMonthLabel(weekDates[0]);
  CroakleProjectDates.innerHTML = weekDates.map((date) => `<span>${date.getDate()}</span>`).join("");
  CroakleProjectMoodPreview.innerHTML = weekDates
    .map((date, index) => `<span class="CroakleProjectWeekBadge">${index + 1}</span>`)
    .join("");
}

function CroakleRenderProjectList() {
  if (!CroakleProjectList) {
    return;
  }

  CroakleProjectList.innerHTML = CroakleProjectState.projects
    .filter((project) => !project.completed)
    .map((project, projectIndex) => {
      const doneCount = project.days.filter(Boolean).length;
      const checks = project.days
        .map((done, dayIndex) => `
          <button
            class="CroakleProjectCheckButton ${done ? "CroakleProjectCheckDone" : "CroakleProjectCheckEmpty"}"
            type="button"
            data-project-index="${projectIndex}"
            data-project-day="${dayIndex}"
            aria-label="${project.name} day ${dayIndex + 1} ${done ? "done" : "not done"}"
            aria-pressed="${done}"
          >${done ? "✓" : ""}</button>
        `)
        .join("");

      return `
        <section class="CroakleProjectRow">
          <div class="CroakleProjectTop">
            <span class="CroakleProjectDot" aria-hidden="true"></span>
            <button class="CroakleProjectNameButton" type="button" data-project-detail-index="${projectIndex}">${project.name}</button>
            <span class="CroakleProjectGoal">${doneCount}/${project.goal}</span>
          </div>
          <div class="CroakleProjectCheckGrid">${checks}</div>
        </section>
      `;
    })
    .join("");

  document.querySelectorAll(".CroakleProjectCheckButton").forEach((button) => {
    button.addEventListener("click", CroakleToggleProjectDay);
  });

  document.querySelectorAll(".CroakleProjectNameButton").forEach((button) => {
    button.addEventListener("click", CroakleOpenProjectDetailDialog);
  });
}

function CroakleToggleProjectDay(event) {
  const projectIndex = Number(event.currentTarget.dataset.projectIndex);
  const dayIndex = Number(event.currentTarget.dataset.projectDay);
  const project = CroakleProjectState.projects[projectIndex];

  if (!project) {
    return;
  }

  project.days[dayIndex] = !project.days[dayIndex];
  CroakleSaveProjectState();
  CroakleRenderProjectList();
}

function CroakleOpenProjectDetailDialog(event) {
  const projectIndex = Number(event.currentTarget.dataset.projectDetailIndex);
  const project = CroakleProjectState.projects[projectIndex];

  if (!project || !CroakleProjectDetailDialog || !CroakleProjectDetailForm) {
    return;
  }

  CroakleProjectDetailForm.reset();
  CroakleProjectDetailForm.elements.projectIndex.value = String(projectIndex);
  CroakleProjectDetailForm.elements.projectName.value = project.name;
  CroakleProjectDetailForm.elements.projectGoal.value = String(project.goal);
  CroakleProjectDetailForm.elements.projectDescription.value = project.description || "";
  CroakleProjectDetailForm.elements.projectPriority.value = project.priority || "medium";
  CroakleProjectDetailDialog.showModal();
  CroakleProjectDetailForm.elements.projectName.focus();
}

function CroakleCloseProjectDetailDialog() {
  CroakleProjectDetailDialog?.close();
}

function CroakleHandleProjectUpdate(event) {
  event.preventDefault();

  const formData = new FormData(CroakleProjectDetailForm);
  const projectIndex = Number(formData.get("projectIndex"));
  const project = CroakleProjectState.projects[projectIndex];
  const name = String(formData.get("projectName") || "").trim();

  if (!project || !name) {
    return;
  }

  CroakleProjectState.projects[projectIndex] = {
    ...project,
    name,
    goal: CroakleProjectClampGoal(formData.get("projectGoal")),
    description: String(formData.get("projectDescription") || "").trim(),
    priority: String(formData.get("projectPriority") || "medium"),
  };

  CroakleSaveProjectState();
  CroakleCloseProjectDetailDialog();
  CroakleRenderProjectList();
}

function CroakleHandleProjectDelete() {
  const projectIndex = Number(CroakleProjectDetailForm.elements.projectIndex.value);

  if (!CroakleProjectState.projects[projectIndex]) {
    return;
  }

  CroakleProjectState.projects.splice(projectIndex, 1);
  CroakleSaveProjectState();
  CroakleCloseProjectDetailDialog();
  CroakleRenderProjectList();
}

function CroakleHandleProjectComplete() {
  const projectIndex = Number(CroakleProjectDetailForm.elements.projectIndex.value);
  const project = CroakleProjectState.projects[projectIndex];

  if (!project) {
    return;
  }

  project.completed = true;
  CroakleSaveProjectState();
  CroakleCloseProjectDetailDialog();
  CroakleRenderProjectList();
}

function CroakleAddProject() {
  CroakleProjectState.projects.push(CroakleCreateProject({ name: "New Project", goal: 3, priority: "medium" }));
  CroakleSaveProjectState();
  CroakleRenderProjectList();
}

function CroakleReorderProjects() {
  CroakleProjectState.projects.reverse();
  CroakleSaveProjectState();
  CroakleRenderProjectList();
}

function CroakleRenderProjects() {
  CroakleRenderProjectHeader();
  CroakleRenderProjectList();
}

CroakleProjectAddButton?.addEventListener("click", CroakleAddProject);
CroakleProjectReorderButton?.addEventListener("click", CroakleReorderProjects);
CroakleProjectDetailForm?.addEventListener("submit", CroakleHandleProjectUpdate);
CroakleProjectDeleteButton?.addEventListener("click", CroakleHandleProjectDelete);
CroakleProjectCloseButton?.addEventListener("click", CroakleCloseProjectDetailDialog);
CroakleProjectCompleteButton?.addEventListener("click", CroakleHandleProjectComplete);

CroakleRenderProjects();
