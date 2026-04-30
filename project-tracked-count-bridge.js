function CroakleProjectTrackedParseDateKey(dateKey) {
  const parts = String(dateKey || "").split("-").map(Number);

  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    return null;
  }

  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function CroakleProjectTrackedFormatDate(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function CroakleProjectTrackedShiftDate(date, amount) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

function CroakleGetProjectUniqueTrackedDates(project) {
  const trackedDates = new Set();
  const weeklyDays = project?.weeklyDays || {};

  Object.entries(weeklyDays).forEach(([weekKey, days]) => {
    const weekStart = CroakleProjectTrackedParseDateKey(weekKey);

    if (!weekStart || !Array.isArray(days)) {
      return;
    }

    days.slice(0, 7).forEach((done, dayIndex) => {
      if (!done) {
        return;
      }

      trackedDates.add(CroakleProjectTrackedFormatDate(CroakleProjectTrackedShiftDate(weekStart, dayIndex)));
    });
  });

  return trackedDates;
}

function CroakleGetProjectTrackedTotal(project) {
  return CroakleGetProjectUniqueTrackedDates(project).size;
}

function CroakleGetProjectArchiveTrackedCount(project) {
  return CroakleGetProjectTrackedTotal(project);
}

function CroakleSafeSwipeDeleteInit() {
  if (window.CroakleSafeSwipeDeleteBound) {
    return;
  }

  window.CroakleSafeSwipeDeleteBound = true;

  const swipeState = {
    row: null,
    startX: 0,
    startY: 0,
    moved: false,
    rowType: "",
    rowIndex: -1,
  };

  function injectStyles() {
    if (document.querySelector("#CroakleSafeSwipeDeleteStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "CroakleSafeSwipeDeleteStyles";
    style.textContent = `
      .CroakleHabitRow,
      .CroakleProjectRow {
        position: relative;
        overflow: hidden;
        touch-action: pan-y;
        transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1), opacity 160ms ease;
      }

      .CroakleHabitRow::after,
      .CroakleProjectRow::after {
        content: "Delete";
        position: absolute;
        inset: 0 0 0 auto;
        width: 104px;
        display: grid;
        place-items: center;
        background: #111111;
        color: #ffffff;
        font-size: 14px;
        font-weight: 950;
        letter-spacing: -0.02em;
        transform: translateX(100%);
        transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none;
      }

      .CroakleSwipeDeleteActive::after {
        transform: translateX(0);
      }

      .CroakleSwipeDeleteRemoving {
        transform: translateX(-120%) scale(0.98);
        opacity: 0;
      }
    `;
    document.head.appendChild(style);
  }

  function haptic(pattern = 8) {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(pattern);
    }
  }

  function getRowInfo(row) {
    const habitButton = row.querySelector("[data-detail-index], [data-habit-index]");
    const projectButton = row.querySelector("[data-project-detail-index], [data-project-index]");

    if (row.classList.contains("CroakleHabitRow") && habitButton) {
      return {
        rowType: "habit",
        rowIndex: Number(habitButton.dataset.detailIndex ?? habitButton.dataset.habitIndex),
      };
    }

    if (row.classList.contains("CroakleProjectRow") && projectButton) {
      return {
        rowType: "project",
        rowIndex: Number(projectButton.dataset.projectDetailIndex ?? projectButton.dataset.projectIndex),
      };
    }

    return { rowType: "", rowIndex: -1 };
  }

  function resetRow(row) {
    if (!row) {
      return;
    }

    row.classList.remove("CroakleSwipeDeleteActive");
    row.style.transform = "";
  }

  function removeHabit(index) {
    if (!Array.isArray(CroakleState?.habitTemplates) || !CroakleState.habitTemplates[index]) {
      return false;
    }

    CroakleState.habitTemplates.splice(index, 1);
    Object.values(CroakleState.months || {}).forEach((monthData) => {
      monthData.habits?.splice(index, 1);
    });

    CroakleSaveState?.();
    CroakleRenderAll?.();
    CroakleRenderReorderList?.();
    return true;
  }

  function removeProject(index) {
    if (!Array.isArray(CroakleProjectState?.projects) || !CroakleProjectState.projects[index]) {
      return false;
    }

    CroakleProjectState.projects.splice(index, 1);
    CroakleSaveProjectState?.();
    CroakleRenderProjectList?.();
    CroakleRenderProjectReorderList?.();
    CroakleRenderProjectArchiveList?.();
    return true;
  }

  function confirmDelete(rowType, rowIndex) {
    const itemName = rowType === "habit"
      ? CroakleState?.habitTemplates?.[rowIndex]?.name
      : CroakleProjectState?.projects?.[rowIndex]?.name;

    return window.confirm(`Delete ${itemName || rowType}?`);
  }

  function deleteRow(row, rowType, rowIndex) {
    if (!confirmDelete(rowType, rowIndex)) {
      resetRow(row);
      return;
    }

    row.classList.add("CroakleSwipeDeleteRemoving");
    haptic(12);

    window.setTimeout(() => {
      const deleted = rowType === "habit" ? removeHabit(rowIndex) : removeProject(rowIndex);

      if (!deleted) {
        resetRow(row);
        row.classList.remove("CroakleSwipeDeleteRemoving");
      }
    }, 150);
  }

  function handlePointerDown(event) {
    const row = event.target.closest(".CroakleHabitRow, .CroakleProjectRow");

    if (!row || event.target.closest(".CroakleCheckButton, .CroakleProjectCheckButton")) {
      return;
    }

    const { rowType, rowIndex } = getRowInfo(row);

    if (!rowType || rowIndex < 0) {
      return;
    }

    swipeState.row = row;
    swipeState.startX = event.clientX;
    swipeState.startY = event.clientY;
    swipeState.moved = false;
    swipeState.rowType = rowType;
    swipeState.rowIndex = rowIndex;
    row.style.transition = "none";
  }

  function handlePointerMove(event) {
    if (!swipeState.row) {
      return;
    }

    const deltaX = event.clientX - swipeState.startX;
    const deltaY = Math.abs(event.clientY - swipeState.startY);

    if (deltaY > 36) {
      resetRow(swipeState.row);
      swipeState.row = null;
      return;
    }

    if (deltaX >= -8) {
      return;
    }

    const dragX = Math.max(-112, deltaX);
    swipeState.moved = true;
    swipeState.row.classList.add("CroakleSwipeDeleteActive");
    swipeState.row.style.transform = `translateX(${dragX}px)`;
  }

  function handlePointerEnd() {
    if (!swipeState.row) {
      return;
    }

    const row = swipeState.row;
    const matrix = new DOMMatrixReadOnly(window.getComputedStyle(row).transform);
    const currentX = matrix.m41;

    row.style.transition = "";

    if (swipeState.moved && currentX < -74) {
      deleteRow(row, swipeState.rowType, swipeState.rowIndex);
    } else {
      resetRow(row);
    }

    swipeState.row = null;
  }

  injectStyles();
  document.addEventListener("pointerdown", handlePointerDown, true);
  document.addEventListener("pointermove", handlePointerMove, true);
  document.addEventListener("pointerup", handlePointerEnd, true);
  document.addEventListener("pointercancel", handlePointerEnd, true);
}

CroakleSafeSwipeDeleteInit();
CroakleRenderProjectArchiveList?.();
