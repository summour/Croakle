const CroakleProjectStoreKey = "CroakleProjectDataV1";
const CroakleDefaultProjects = [
  { id: "CroakleProjectGitHub", name: "GitHub", goal: 5, description: "push code, fix bugs", priority: "medium", completed: false },
  { id: "CroakleProjectUI", name: "UI Polish", goal: 3, description: "clean layouts and spacing", priority: "high", completed: false },
  { id: "CroakleProjectExport", name: "Export Data", goal: 2, description: "CSV and JSON backup", priority: "low", completed: false },
];

let CroakleProjectWeekOffset = 0;
let CroakleProjectState = CroakleLoadProjectState();

const CroakleProjectPage = document.querySelector('[data-page="project"]');
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
const CroakleProjectWeekButtons = CroakleProjectPage?.querySelectorAll(".CroakleMonthHeader button") || [];

let CroakleAddProjectDialog = null;
let CroakleAddProjectForm = null;
let CroakleCloseAddProjectButton = null;
let CroakleProjectArchiveButton = null;
let CroakleProjectArchiveDialog = null;
let CroakleProjectArchiveList = null;
let CroakleProjectCloseArchiveButton = null;
let CroakleProjectArchiveDoneButton = null;
let CroakleProjectReorderDialog = null;
let CroakleProjectReorderList = null;
let CroakleProjectCloseReorderButton = null;
let CroakleProjectReorderDoneButton = null;

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
  const weekKey = project.completedWeekKey || CroakleProjectGetSelectedWeekKey();
  const weeklyDays = CroakleCreateProjectWeeklyDays(project, weekKey);

  return {
    id: project.id || `CroakleProject${Date.now()}${index}`,
    name: project.name || "New Project",
    goal: CroakleProjectClampGoal(project.goal),
    description: project.description || "",
    priority: project.priority || "medium",
    completed: Boolean(project.completed),
    completedWeekKey: project.completedWeekKey || "",
    weeklyDays,
  };
}

function CroakleCreateProjectWeeklyDays(project, weekKey) {
  if (project.weeklyDays && typeof project.weeklyDays === "object") {
    return Object.fromEntries(
      Object.entries(project.weeklyDays).map(([key, days]) => [key, CroakleNormalizeProjectDays(days)])
    );
  }

  return {
    [weekKey]: CroakleNormalizeProjectDays(project.days),
  };
}

function CroakleNormalizeProjectDays(days) {
  return Array.from({ length: 7 }, (_, dayIndex) => Boolean(days?.[dayIndex]));
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

function CroakleProjectGetBaseMonday() {
  const today = CroakleProjectGetToday();
  const mondayOffset = -((today.getDay() + 6) % 7);
  return CroakleProjectShiftDate(today, mondayOffset + CroakleProjectWeekOffset * 7);
}

function CroakleProjectGetWeekDates() {
  const monday = CroakleProjectGetBaseMonday();
  return Array.from({ length: 7 }, (_, index) => CroakleProjectShiftDate(monday, index));
}

function CroakleProjectFormatWeekKey(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function CroakleProjectGetSelectedWeekKey() {
  return CroakleProjectFormatWeekKey(CroakleProjectGetWeekDates()[0]);
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
  CroakleProjectDates.className = "CroakleSevenGrid CroakleDateRow CroakleWeekGrid";
  CroakleProjectMoodPreview.className = "CroakleSevenGrid CroakleMoodPreview CroakleWeekGrid";
  CroakleProjectDates.innerHTML = weekDates.map((date) => {
    const dateIso = CroakleFormatDate(date);
    const currentDayClass = CroakleGetCurrentDayClass(date);

    return `<span class="CroakleDateCell${currentDayClass}" data-date-iso="${dateIso}" data-current-date="${currentDayClass ? "true" : "false"}">${date.getDate()}</span>`;
  }).join("");
  CroakleProjectMoodPreview.innerHTML = weekDates.map((date) => CroakleCreateProjectMoodBadge(date)).join("");
  CroakleEnhanceProjectMoodButtons();
}

function CroakleCreateProjectMoodBadge(date) {
  const dateIso = CroakleFormatDate(date);
  const monthData = CroakleGetMonthDataFromDate(date);
  return CroakleCreateMoodBadge(monthData.moods[date.getDate() - 1], CroakleGetCurrentDayClass(date), dateIso);
}

function CroakleEnhanceProjectMoodButtons() {
  document.querySelectorAll("#CroakleProjectMoodPreview .CroakleMoodBadge").forEach((moodBadge) => {
    const dateIso = moodBadge.dataset.dateIso;

    if (!dateIso) {
      return;
    }

    moodBadge.setAttribute("role", "button");
    moodBadge.setAttribute("tabindex", "0");
    moodBadge.setAttribute("aria-label", `Open mood for ${dateIso}`);
    moodBadge.classList.add("CroakleTrackMoodLink");
  });
}

function CroakleOpenProjectMoodDate(dateIso) {
  const date = CroakleParseDate(dateIso);

  CroakleState.moodMonth = date.getMonth();
  CroakleState.moodYear = date.getFullYear();
  CroakleSaveState();
  CroakleRenderAll();
  CroakleRenderProjectHeader();
  CroakleSetPage("mood");

  window.requestAnimationFrame(() => {
    document
      .querySelector(`[data-page="mood"] [data-date-iso="${dateIso}"]`)
      ?.scrollIntoView({ block: "center", inline: "center" });
  });
}

function CroakleHandleProjectMoodOpen(event) {
  const moodBadge = event.target.closest("#CroakleProjectMoodPreview .CroakleMoodBadge");

  if (!moodBadge?.dataset.dateIso) {
    return;
  }

  CroakleOpenProjectMoodDate(moodBadge.dataset.dateIso);
}

function CroakleHandleProjectMoodKeyboard(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const moodBadge = event.target.closest("#CroakleProjectMoodPreview .CroakleMoodBadge");

  if (!moodBadge?.dataset.dateIso) {
    return;
  }

  event.preventDefault();
  CroakleOpenProjectMoodDate(moodBadge.dataset.dateIso);
}

function CroaklePatchProjectMoodSync() {
  const originalCycleMood = CroakleCycleMood;

  CroakleCycleMood = function CroakleCycleMoodWithProjectSync(event) {
    originalCycleMood(event);
    CroakleRenderProjectHeader();
  };
}

function CroakleGetProjectDays(project, weekKey = CroakleProjectGetSelectedWeekKey()) {
  if (!project.weeklyDays) {
    project.weeklyDays = {};
  }

  if (!project.weeklyDays[weekKey]) {
    project.weeklyDays[weekKey] = CroakleNormalizeProjectDays();
  }

  return project.weeklyDays[weekKey];
}

function CroakleProjectHasTrackedWeek(project, weekKey = CroakleProjectGetSelectedWeekKey()) {
  return Array.isArray(project.weeklyDays?.[weekKey]) && project.weeklyDays[weekKey].some(Boolean);
}

function CroakleGetProjectTrackedTotal(project) {
  return Object.values(project.weeklyDays || {})
    .flat()
    .filter(Boolean).length;
}

function CroakleShouldShowProjectInSelectedWeek(project) {
  return !project.completed || CroakleProjectHasTrackedWeek(project);
}

function CroakleGetVisibleProjects() {
  return CroakleProjectState.projects
    .map((project, projectIndex) => ({ project, projectIndex }))
    .filter(({ project }) => CroakleShouldShowProjectInSelectedWeek(project));
}

function CroakleGetActiveProjects() {
  return CroakleProjectState.projects
    .map((project, projectIndex) => ({ project, projectIndex }))
    .filter(({ project }) => !project.completed);
}

function CroakleGetArchivedProjects() {
  return CroakleProjectState.projects
    .map((project, projectIndex) => ({ project, projectIndex }))
    .filter(({ project }) => project.completed);
}

function CroakleRenderProjectList() {
  if (!CroakleProjectList) {
    return;
  }

  const visibleProjects = CroakleGetVisibleProjects();

  CroakleProjectList.innerHTML = visibleProjects.length
    ? visibleProjects.map(({ project, projectIndex }) => CroakleProjectRowTemplate(project, projectIndex)).join("")
    : `<p class="CroakleProjectEmptyText">No projects this week. Restore from Archive or add a new project.</p>`;

  document.querySelectorAll(".CroakleProjectCheckButton").forEach((button) => {
    button.addEventListener("click", CroakleToggleProjectDay);
  });

  document.querySelectorAll(".CroakleProjectNameButton").forEach((button) => {
    button.addEventListener("click", CroakleOpenProjectDetailDialog);
  });
}

function CroakleProjectRowTemplate(project, projectIndex) {
  const days = CroakleGetProjectDays(project);
  const doneCount = days.filter(Boolean).length;
  const archivedClass = project.completed ? " CroakleProjectRowArchived" : "";
  const statusText = project.completed ? `<span class="CroakleProjectStatus">Archived</span>` : "";
  const checks = days
    .map((done, dayIndex) => `
      <button
        class="CroakleProjectCheckButton ${done ? "CroakleProjectCheckDone" : "CroakleProjectCheckEmpty"}"
        type="button"
        data-project-index="${projectIndex}"
        data-project-day="${dayIndex}"
        aria-label="${project.name} day ${dayIndex + 1} ${done ? "done" : "not done"}"
        aria-pressed="${done}"
        ${project.completed ? "disabled" : ""}
      >${done ? "✓" : ""}</button>
    `)
    .join("");

  return `
    <section class="CroakleProjectRow${archivedClass}">
      <div class="CroakleProjectTop">
        <span class="CroakleProjectDot" aria-hidden="true"></span>
        <button class="CroakleProjectNameButton" type="button" data-project-detail-index="${projectIndex}" ${project.completed ? "disabled" : ""}>${project.name}</button>
        <span class="CroakleProjectGoal">${doneCount}/${project.goal}</span>
      </div>
      ${statusText}
      <div class="CroakleProjectCheckGrid">${checks}</div>
    </section>
  `;
}

function CroakleToggleProjectDay(event) {
  const projectIndex = Number(event.currentTarget.dataset.projectIndex);
  const dayIndex = Number(event.currentTarget.dataset.projectDay);
  const project = CroakleProjectState.projects[projectIndex];

  if (!project || project.completed) {
    return;
  }

  const days = CroakleGetProjectDays(project);
  days[dayIndex] = !days[dayIndex];
  CroakleSaveProjectState();
  CroakleRenderProjectList();
}

function CroakleChangeProjectWeek(direction) {
  CroakleProjectWeekOffset += direction;
  CroakleRenderProjectHeader();
  CroakleRenderProjectList();
}

function CroakleCreateAddProjectDialog() {
  const appShell = document.querySelector(".CroakleHabitMoodShell");

  if (!appShell || document.querySelector("#CroakleAddProjectDialog")) {
    return;
  }

  appShell.insertAdjacentHTML("beforeend", `
    <dialog class="CroakleAddHabitDialog" id="CroakleAddProjectDialog" aria-labelledby="CroakleAddProjectTitle">
      <form class="CroakleAddHabitForm" id="CroakleAddProjectForm" method="dialog">
        <header class="CroakleAddHabitHeader">
          <h2 id="CroakleAddProjectTitle">Add Project</h2>
          <button type="button" id="CroakleCloseAddProject" aria-label="ปิด">×</button>
        </header>

        <label class="CroakleField">
          <span>New Project</span>
          <input id="CroakleProjectNameInput" name="projectName" type="text" placeholder="e.g., GitHub" autocomplete="off" required />
        </label>

        <label class="CroakleField">
          <span>Goal Per Week</span>
          <input id="CroakleProjectGoalInput" name="projectGoal" type="number" min="1" max="7" inputmode="numeric" placeholder="e.g., 5" required />
        </label>

        <label class="CroakleField">
          <span>Description</span>
          <textarea id="CroakleProjectDescriptionInput" name="projectDescription" rows="3" placeholder="e.g., push code, fix bugs"></textarea>
        </label>

        <fieldset class="CroaklePriorityField">
          <legend>Priority</legend>
          <label><input type="radio" name="projectPriority" value="high" /><span>High</span></label>
          <label><input type="radio" name="projectPriority" value="medium" checked /><span>Medium</span></label>
          <label><input type="radio" name="projectPriority" value="low" /><span>Low</span></label>
        </fieldset>

        <button class="CroakleConfirmHabitButton" type="submit">Confirm</button>
      </form>
    </dialog>
  `);
}

function CroakleCreateProjectArchiveButton() {
  if (!CroakleProjectAddButton || !CroakleProjectReorderButton || document.querySelector("#CroakleOpenProjectArchive")) {
    return;
  }

  CroakleProjectArchiveButton = document.createElement("button");
  CroakleProjectArchiveButton.className = "CroakleSecondaryActionButton CroakleProjectArchiveButton";
  CroakleProjectArchiveButton.id = "CroakleOpenProjectArchive";
  CroakleProjectArchiveButton.type = "button";
  CroakleProjectArchiveButton.textContent = "Archive";
  CroakleProjectReorderButton.parentNode.insertBefore(CroakleProjectArchiveButton, CroakleProjectReorderButton);
}

function CroakleCreateProjectArchiveDialog() {
  const appShell = document.querySelector(".CroakleHabitMoodShell");

  if (!appShell || document.querySelector("#CroakleProjectArchiveDialog")) {
    return;
  }

  appShell.insertAdjacentHTML("beforeend", `
    <dialog class="CroakleAddHabitDialog" id="CroakleProjectArchiveDialog" aria-labelledby="CroakleProjectArchiveTitle">
      <div class="CroakleAddHabitForm">
        <header class="CroakleAddHabitHeader">
          <h2 id="CroakleProjectArchiveTitle">Archive</h2>
          <button type="button" id="CroakleCloseProjectArchive" aria-label="ปิด">×</button>
        </header>

        <div class="CroakleProjectArchiveList" id="CroakleProjectArchiveList"></div>

        <button class="CroakleConfirmHabitButton" id="CroakleProjectArchiveDone" type="button">Done</button>
      </div>
    </dialog>
  `);
}

function CroakleCreateProjectReorderDialog() {
  const appShell = document.querySelector(".CroakleHabitMoodShell");

  if (!appShell || document.querySelector("#CroakleProjectReorderDialog")) {
    return;
  }

  appShell.insertAdjacentHTML("beforeend", `
    <dialog class="CroakleAddHabitDialog" id="CroakleProjectReorderDialog" aria-labelledby="CroakleProjectReorderTitle">
      <div class="CroakleAddHabitForm">
        <header class="CroakleAddHabitHeader">
          <h2 id="CroakleProjectReorderTitle">Reorder Projects</h2>
          <button type="button" id="CroakleCloseProjectReorder" aria-label="ปิด">×</button>
        </header>

        <div class="CroakleReorderList" id="CroakleProjectReorderList"></div>

        <button class="CroakleConfirmHabitButton" id="CroakleProjectReorderDone" type="button">Done</button>
      </div>
    </dialog>
  `);
}

function CroakleBindAddProjectDialog() {
  CroakleCreateAddProjectDialog();
  CroakleAddProjectDialog = document.querySelector("#CroakleAddProjectDialog");
  CroakleAddProjectForm = document.querySelector("#CroakleAddProjectForm");
  CroakleCloseAddProjectButton = document.querySelector("#CroakleCloseAddProject");

  CroakleAddProjectForm?.addEventListener("submit", CroakleHandleAddProject);
  CroakleCloseAddProjectButton?.addEventListener("click", CroakleCloseAddProjectDialog);
}

function CroakleBindProjectArchiveDialog() {
  CroakleCreateProjectArchiveButton();
  CroakleCreateProjectArchiveDialog();

  CroakleProjectArchiveButton = document.querySelector("#CroakleOpenProjectArchive");
  CroakleProjectArchiveDialog = document.querySelector("#CroakleProjectArchiveDialog");
  CroakleProjectArchiveList = document.querySelector("#CroakleProjectArchiveList");
  CroakleProjectCloseArchiveButton = document.querySelector("#CroakleCloseProjectArchive");
  CroakleProjectArchiveDoneButton = document.querySelector("#CroakleProjectArchiveDone");

  CroakleProjectArchiveButton?.addEventListener("click", CroakleOpenProjectArchiveDialog);
  CroakleProjectCloseArchiveButton?.addEventListener("click", CroakleCloseProjectArchiveDialog);
  CroakleProjectArchiveDoneButton?.addEventListener("click", CroakleCloseProjectArchiveDialog);
}

function CroakleBindProjectReorderDialog() {
  CroakleCreateProjectReorderDialog();

  CroakleProjectReorderDialog = document.querySelector("#CroakleProjectReorderDialog");
  CroakleProjectReorderList = document.querySelector("#CroakleProjectReorderList");
  CroakleProjectCloseReorderButton = document.querySelector("#CroakleCloseProjectReorder");
  CroakleProjectReorderDoneButton = document.querySelector("#CroakleProjectReorderDone");

  CroakleProjectCloseReorderButton?.addEventListener("click", CroakleCloseProjectReorderDialog);
  CroakleProjectReorderDoneButton?.addEventListener("click", CroakleCloseProjectReorderDialog);
}

function CroakleOpenAddProjectDialog() {
  if (!CroakleAddProjectDialog || !CroakleAddProjectForm) {
    return;
  }

  CroakleAddProjectForm.reset();
  CroakleAddProjectForm.elements.projectPriority.value = "medium";
  CroakleAddProjectDialog.showModal();
  CroakleAddProjectForm.elements.projectName.focus();
}

function CroakleCloseAddProjectDialog() {
  CroakleAddProjectDialog?.close();
}

function CroakleHandleAddProject(event) {
  event.preventDefault();

  const formData = new FormData(CroakleAddProjectForm);
  const name = String(formData.get("projectName") || "").trim();

  if (!name) {
    return;
  }

  CroakleProjectState.projects.push(CroakleCreateProject({
    id: `CroakleProject${Date.now()}`,
    name,
    goal: CroakleProjectClampGoal(formData.get("projectGoal")),
    description: String(formData.get("projectDescription") || "").trim(),
    priority: String(formData.get("projectPriority") || "medium"),
    completed: false,
  }));

  CroakleSaveProjectState();
  CroakleCloseAddProjectDialog();
  CroakleRenderProjectList();
  CroakleRenderProjectReorderList();
}

function CroakleOpenProjectDetailDialog(event) {
  const projectIndex = Number(event.currentTarget.dataset.projectDetailIndex);
  const project = CroakleProjectState.projects[projectIndex];

  if (!project || project.completed || !CroakleProjectDetailDialog || !CroakleProjectDetailForm) {
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

  if (!project || project.completed || !name) {
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
  CroakleRenderProjectReorderList();
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
  CroakleRenderProjectReorderList();
}

function CroakleHandleProjectComplete() {
  const projectIndex = Number(CroakleProjectDetailForm.elements.projectIndex.value);
  const project = CroakleProjectState.projects[projectIndex];

  if (!project) {
    return;
  }

  project.completed = true;
  project.completedWeekKey = CroakleProjectGetSelectedWeekKey();
  CroakleSaveProjectState();
  CroakleCloseProjectDetailDialog();
  CroakleRenderProjectList();
  CroakleRenderProjectArchiveList();
  CroakleRenderProjectReorderList();
}

function CroakleRenderProjectArchiveList() {
  if (!CroakleProjectArchiveList) {
    return;
  }

  const archivedProjects = CroakleGetArchivedProjects();

  CroakleProjectArchiveList.innerHTML = archivedProjects.length
    ? archivedProjects.map(({ project, projectIndex }) => `
      <section class="CroakleProjectArchiveRow">
        <div class="CroakleProjectArchiveInfo">
          <strong>${project.name}</strong>
          <span>${CroakleGetProjectTrackedTotal(project)} tracked</span>
        </div>
        <button class="CroakleProjectRestoreButton" type="button" data-project-restore-index="${projectIndex}">Restore</button>
      </section>
    `).join("")
    : `<p class="CroakleProjectEmptyText">No archived projects yet.</p>`;

  document.querySelectorAll(".CroakleProjectRestoreButton").forEach((button) => {
    button.addEventListener("click", CroakleRestoreProjectFromArchive);
  });
}

function CroakleOpenProjectArchiveDialog() {
  if (!CroakleProjectArchiveDialog) {
    return;
  }

  CroakleRenderProjectArchiveList();
  CroakleProjectArchiveDialog.showModal();
}

function CroakleCloseProjectArchiveDialog() {
  CroakleProjectArchiveDialog?.close();
}

function CroakleRestoreProjectFromArchive(event) {
  const projectIndex = Number(event.currentTarget.dataset.projectRestoreIndex);
  const project = CroakleProjectState.projects[projectIndex];

  if (!project) {
    return;
  }

  project.completed = false;
  project.completedWeekKey = "";
  CroakleSaveProjectState();
  CroakleRenderProjectList();
  CroakleRenderProjectArchiveList();
  CroakleRenderProjectReorderList();
}

function CroakleOpenProjectReorderDialog() {
  if (!CroakleProjectReorderDialog) {
    return;
  }

  CroakleRenderProjectReorderList();
  CroakleProjectReorderDialog.showModal();
}

function CroakleCloseProjectReorderDialog() {
  CroakleProjectReorderDialog?.close();
}

function CroakleRenderProjectReorderList() {
  if (!CroakleProjectReorderList) {
    return;
  }

  const activeProjects = CroakleGetActiveProjects();

  CroakleProjectReorderList.innerHTML = activeProjects.length
    ? activeProjects.map(({ project }, activeIndex) => {
      const isFirst = activeIndex === 0;
      const isLast = activeIndex === activeProjects.length - 1;

      return `
        <div class="CroakleReorderRow">
          <div class="CroakleReorderName">${project.name}</div>
          <div class="CroakleReorderActions">
            <button class="CroakleReorderMoveButton" type="button" data-project-active-index="${activeIndex}" data-project-reorder-direction="up" aria-label="Move ${project.name} up" ${isFirst ? "disabled" : ""}>↑</button>
            <button class="CroakleReorderMoveButton" type="button" data-project-active-index="${activeIndex}" data-project-reorder-direction="down" aria-label="Move ${project.name} down" ${isLast ? "disabled" : ""}>↓</button>
          </div>
        </div>
      `;
    }).join("")
    : `<p class="CroakleProjectEmptyText">No active projects to reorder.</p>`;

  document.querySelectorAll("#CroakleProjectReorderList .CroakleReorderMoveButton").forEach((button) => {
    button.addEventListener("click", CroakleHandleProjectReorderMove);
  });
}

function CroakleHandleProjectReorderMove(event) {
  const fromIndex = Number(event.currentTarget.dataset.projectActiveIndex);
  const direction = event.currentTarget.dataset.projectReorderDirection === "down" ? 1 : -1;
  const toIndex = fromIndex + direction;
  const activeProjects = CroakleGetActiveProjects().map(({ project }) => project);

  if (toIndex < 0 || toIndex >= activeProjects.length) {
    return;
  }

  const archivedProjects = CroakleGetArchivedProjects().map(({ project }) => project);
  const reorderedProjects = CroakleSwapArrayItems(activeProjects, fromIndex, toIndex);

  CroakleProjectState.projects = [...reorderedProjects, ...archivedProjects];
  CroakleSaveProjectState();
  CroakleRenderProjectList();
  CroakleRenderProjectReorderList();
}

function CroakleRenderProjects() {
  CroakleBindAddProjectDialog();
  CroakleBindProjectArchiveDialog();
  CroakleBindProjectReorderDialog();
  CroakleRenderProjectHeader();
  CroakleRenderProjectList();
}

CroaklePatchProjectMoodSync();
CroakleProjectWeekButtons[0]?.addEventListener("click", () => CroakleChangeProjectWeek(-1));
CroakleProjectWeekButtons[1]?.addEventListener("click", () => CroakleChangeProjectWeek(1));
CroakleProjectAddButton?.addEventListener("click", CroakleOpenAddProjectDialog);
CroakleProjectReorderButton?.addEventListener("click", CroakleOpenProjectReorderDialog);
CroakleProjectDetailForm?.addEventListener("submit", CroakleHandleProjectUpdate);
CroakleProjectDeleteButton?.addEventListener("click", CroakleHandleProjectDelete);
CroakleProjectCloseButton?.addEventListener("click", CroakleCloseProjectDetailDialog);
CroakleProjectCompleteButton?.addEventListener("click", CroakleHandleProjectComplete);
document.addEventListener("click", CroakleHandleProjectMoodOpen);
document.addEventListener("keydown", CroakleHandleProjectMoodKeyboard);

CroakleRenderProjects();
