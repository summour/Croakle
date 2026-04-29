(() => {
  if (
    typeof CroakleProjectRowTemplate !== "function" ||
    typeof CroakleToggleProjectDay !== "function" ||
    typeof CroakleProjectGetWeekDates !== "function"
  ) {
    return;
  }

  function CroakleInjectProjectLockStyles() {
    if (document.querySelector("#CroakleProjectTodayLockStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "CroakleProjectTodayLockStyles";
    style.textContent = `
      .CroakleProjectList .CroakleProjectCheckLocked {
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleCanEditProjectDate(dateIso) {
    if (typeof CroakleIsTodayInputAllowed !== "function") {
      return true;
    }

    return CroakleIsTodayInputAllowed(dateIso);
  }

  function CroakleGetProjectDateIso(dayIndex) {
    const date = CroakleProjectGetWeekDates()[dayIndex];
    return typeof CroakleFormatDate === "function"
      ? CroakleFormatDate(date)
      : CroakleProjectFormatWeekKey(date);
  }

  const CroakleOriginalToggleProjectDay = CroakleToggleProjectDay;

  CroakleProjectRowTemplate = function CroakleProjectRowTemplateWithTodayLock(project, projectIndex) {
    const days = CroakleGetProjectDays(project);
    const doneCount = days.filter(Boolean).length;
    const archivedClass = project.completed ? " CroakleProjectRowArchived" : "";
    const statusText = project.completed ? `<span class="CroakleProjectStatus">Finished</span>` : "";
    const checks = days
      .map((done, dayIndex) => {
        const dateIso = CroakleGetProjectDateIso(dayIndex);
        const canEdit = CroakleCanEditProjectDate(dateIso);
        const lockedClass = canEdit ? "" : " CroakleProjectCheckLocked";

        return `
          <button
            class="CroakleProjectCheckButton ${done ? "CroakleProjectCheckDone" : "CroakleProjectCheckEmpty"}${lockedClass}"
            type="button"
            data-project-index="${projectIndex}"
            data-project-day="${dayIndex}"
            data-date-iso="${dateIso}"
            aria-label="${project.name} ${dateIso} ${done ? "done" : "not done"}"
            aria-pressed="${done}"
            aria-disabled="${canEdit ? "false" : "true"}"
            ${project.completed ? "disabled" : ""}
          >${done ? "✓" : ""}</button>
        `;
      })
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
  };

  CroakleToggleProjectDay = function CroakleToggleProjectDayWithTodayLock(event) {
    const dateIso = event.currentTarget.dataset.dateIso || CroakleGetProjectDateIso(Number(event.currentTarget.dataset.projectDay));

    if (!CroakleCanEditProjectDate(dateIso)) {
      if (typeof CroakleNotifyLockedInput === "function") {
        CroakleNotifyLockedInput();
      }
      return;
    }

    CroakleOriginalToggleProjectDay(event);
  };

  function CroakleBindProjectLockRefresh() {
    if (window.CroakleProjectLockRefreshBound) {
      return;
    }

    window.CroakleProjectLockRefreshBound = true;
    document.addEventListener("change", (event) => {
      if (!event.target.closest?.("[data-settings-lock]")) {
        return;
      }

      window.requestAnimationFrame(() => {
        CroakleRenderProjectList?.();
      });
    });
  }

  CroakleInjectProjectLockStyles();
  CroakleBindProjectLockRefresh();
  CroakleRenderProjectList?.();
})();
