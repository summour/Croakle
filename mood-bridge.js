function CroakleEnhanceTrackMoodButtons() {
  document.querySelectorAll("#CroakleTrackMoodPreview .CroakleMoodBadge").forEach((moodBadge) => {
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

function CroakleOpenTrackMoodDate(dateIso) {
  const date = CroakleParseDate(dateIso);

  CroakleState.moodMonth = date.getMonth();
  CroakleState.moodYear = date.getFullYear();

  CroakleSaveState();
  CroakleRenderAll();
  CroakleSetPage("mood");

  window.requestAnimationFrame(() => {
    document
      .querySelector(`[data-page="mood"] [data-date-iso="${dateIso}"]`)
      ?.scrollIntoView({ block: "center", inline: "center" });
  });
}

function CroakleHandleTrackMoodOpen(event) {
  const moodBadge = event.target.closest("#CroakleTrackMoodPreview .CroakleMoodBadge");

  if (!moodBadge?.dataset.dateIso) {
    return;
  }

  CroakleOpenTrackMoodDate(moodBadge.dataset.dateIso);
}

function CroakleHandleTrackMoodKeyboard(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const moodBadge = event.target.closest("#CroakleTrackMoodPreview .CroakleMoodBadge");

  if (!moodBadge?.dataset.dateIso) {
    return;
  }

  event.preventDefault();
  CroakleOpenTrackMoodDate(moodBadge.dataset.dateIso);
}

function CroakleGetWeeksInMonthForBest(year, month) {
  const daysInMonth = CroakleGetDaysInMonth(year, month);
  const weekStarts = new Set();

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const weekStart = CroakleShiftDate(date, -((date.getDay() + 6) % 7));
    weekStarts.add(CroakleFormatDate(weekStart));
  }

  return weekStarts.size;
}

function CroakleGetHabitLifetimeDoneForBest(habitIndex) {
  return Object.values(CroakleState.months).reduce((total, monthData) => {
    const habit = monthData.habits[habitIndex];
    return total + (habit ? CroakleCountDone(habit.days) : 0);
  }, 0);
}

function CroakleGetBestPercent(doneCount, habit, year, month) {
  const monthGoal = CroakleGetWeeksInMonthForBest(year, month) * CroakleClampGoal(habit.goal);

  if (!monthGoal) {
    return 0;
  }

  return Math.min(100, Math.round((doneCount / monthGoal) * 100));
}

function CroakleRenderBestListFromTrack() {
  const list = document.querySelector("#CroakleBestList");

  if (!list) {
    return;
  }

  const year = CroakleState.bestYear;
  const month = CroakleState.bestMonth;
  const monthData = CroakleGetMonthData(year, month);
  const rows = monthData.habits
    .map((habit, habitIndex) => {
      const doneCount = CroakleCountDone(habit.days);

      return {
        name: habit.name,
        percent: CroakleGetBestPercent(doneCount, habit, year, month),
        month: doneCount,
        lifetime: CroakleGetHabitLifetimeDoneForBest(habitIndex),
      };
    })
    .sort((firstHabit, secondHabit) => {
      if (secondHabit.percent !== firstHabit.percent) {
        return secondHabit.percent - firstHabit.percent;
      }

      return secondHabit.month - firstHabit.month;
    });

  document.querySelector("#CroakleBestMonth").textContent = CroakleGetMonthLabel(year, month);
  list.innerHTML = rows.map((habit) => `
    <section class="CroakleBestRow">
      <strong>${habit.name}</strong>
      <div class="CroaklePercentBar" aria-label="${habit.percent} percent">
        <span style="width: ${habit.percent}%"></span>
        <em>${habit.percent}%</em>
      </div>
      <span>${habit.month}</span>
      <span>${habit.lifetime}</span>
    </section>
  `).join("");
}

function CroakleLockMoodCircleLayout() {
  if (document.querySelector("#CroakleMoodLockedLayout")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "CroakleMoodLockedLayout";
  style.textContent = `
    [data-page="mood"] .CroakleCard {
      overflow: hidden;
    }

    [data-page="mood"] .CroakleMoodCalendar {
      flex: 0 0 auto;
      overflow: hidden;
      overscroll-behavior: none;
      touch-action: none;
      -webkit-overflow-scrolling: auto;
    }

    [data-page="mood"] .CroakleMoodCalendar button,
    [data-page="mood"] .CroakleMoodCalendar .CroakleMoodBadge {
      touch-action: manipulation;
    }

    [data-page="mood"] .CroakleTopMoodRow {
      flex: 0 0 auto;
    }
  `;
  document.head.appendChild(style);
}

function CroaklePatchMoodBridgeRenderers() {
  const originalRenderTrackHeader = CroakleRenderTrackHeader;
  const originalCycleMood = CroakleCycleMood;
  const originalRenderBestList = CroakleRenderBestList;

  CroakleRenderTrackHeader = function CroakleRenderTrackHeaderWithMoodLinks() {
    originalRenderTrackHeader();
    CroakleEnhanceTrackMoodButtons();
  };

  CroakleCycleMood = function CroakleCycleMoodWithTrackSync(event) {
    originalCycleMood(event);
    CroakleRenderTrackHeader();
  };

  CroakleRenderBestList = function CroakleRenderBestListWithMonthlyGoals() {
    originalRenderBestList();
    CroakleRenderBestListFromTrack();
  };
}

CroakleLockMoodCircleLayout();
CroaklePatchMoodBridgeRenderers();
CroakleEnhanceTrackMoodButtons();
CroakleRenderBestListFromTrack();

document.addEventListener("click", CroakleHandleTrackMoodOpen);
document.addEventListener("keydown", CroakleHandleTrackMoodKeyboard);

const CroakleMonthlyHabitGoalStoreKey = "CroakleHabitMonthlyGoalsV1";
let CroakleMonthlyHabitGoals = CroakleLoadMonthlyHabitGoals();

function CroakleLoadMonthlyHabitGoals() {
  try {
    return JSON.parse(localStorage.getItem(CroakleMonthlyHabitGoalStoreKey)) || {};
  } catch {
    return {};
  }
}

function CroakleSaveMonthlyHabitGoals() {
  localStorage.setItem(CroakleMonthlyHabitGoalStoreKey, JSON.stringify(CroakleMonthlyHabitGoals));
}

function CroakleGetTrackMonthKey() {
  return CroakleGetMonthKeyFromDate(CroakleParseDate(CroakleState.trackDate));
}

function CroakleGetHabitGoalKey(habit, monthKey) {
  return `${monthKey}:${habit.id || habit.name}`;
}

function CroakleGetHabitGoalForMonth(habit, monthKey) {
  const savedGoal = CroakleMonthlyHabitGoals[CroakleGetHabitGoalKey(habit, monthKey)];
  return savedGoal ? CroakleClampGoal(savedGoal) : CroakleClampGoal(habit.goal);
}

function CroakleSetHabitGoalForMonth(habit, monthKey, goal) {
  CroakleMonthlyHabitGoals[CroakleGetHabitGoalKey(habit, monthKey)] = CroakleClampGoal(goal);
  CroakleSaveMonthlyHabitGoals();
}

function CroakleSyncHabitMetaAcrossMonths(habitIndex, updatedHabit) {
  Object.values(CroakleState.months).forEach((monthData) => {
    const savedHabit = monthData.habits[habitIndex];

    if (!savedHabit) {
      return;
    }

    monthData.habits[habitIndex] = {
      ...savedHabit,
      name: updatedHabit.name,
      description: updatedHabit.description,
      priority: updatedHabit.priority,
    };
  });
}

function CroakleRenderTrackListWithMonthlyGoals() {
  const list = document.querySelector("#CroakleTrackList");

  if (!list) {
    return;
  }

  const trackDate = CroakleParseDate(CroakleState.trackDate);
  const monthKey = CroakleGetMonthKeyFromDate(trackDate);
  const weekDates = CroakleGetWeekDates(trackDate);
  const trackData = CroakleGetMonthDataFromDate(trackDate);

  list.innerHTML = CroakleState.habitTemplates.map((habit, habitIndex) => {
    const current = CroakleGetWeeklyHabitCount(habitIndex, weekDates);
    const monthGoal = CroakleGetHabitGoalForMonth(habit, monthKey);
    const monthHabit = trackData.habits[habitIndex] || habit;
    const checks = weekDates
      .map((date) => {
        const dateIso = CroakleFormatDate(date);
        const dayIndex = date.getDate() - 1;
        const monthData = CroakleGetMonthDataFromDate(date);
        const done = Boolean(monthData.habits[habitIndex]?.days[dayIndex]);
        const currentDayClass = CroakleGetCurrentDayClass(date);

        return `
          <button
            class="CroakleCheckButton ${done ? "CroakleCheckDone" : "CroakleCheckEmpty"}${currentDayClass}"
            type="button"
            data-habit-index="${habitIndex}"
            data-date-iso="${dateIso}"
            data-current-date="${currentDayClass ? "true" : "false"}"
            aria-label="${habit.name} ${dateIso} ${done ? "done" : "not done"}"
            aria-pressed="${done}"
          >${done ? "✓" : ""}</button>
        `;
      })
      .join("");

    return `
      <section class="CroakleHabitRow">
        <div class="CroakleHabitTop">
          <span class="CroakleDot" aria-hidden="true"></span>
          <button class="CroakleHabitNameButton" type="button" data-detail-index="${habitIndex}" title="${monthHabit.description || ""}">${monthHabit.name || habit.name}</button>
          <span class="CroakleGoal">${current}/${monthGoal}</span>
        </div>
        <div class="CroakleCheckGrid CroakleWeekGrid">${checks}</div>
      </section>
    `;
  }).join("");

  document.querySelectorAll(".CroakleCheckButton").forEach((button) => {
    button.addEventListener("click", CroakleToggleHabitDay);
  });

  document.querySelectorAll(".CroakleHabitNameButton").forEach((button) => {
    button.addEventListener("click", CroakleOpenHabitDetailDialog);
  });
}

function CroakleOpenHabitDetailDialogWithMonthlyGoal(event) {
  const habitIndex = Number(event.currentTarget.dataset.detailIndex);
  const habit = CroakleState.habitTemplates[habitIndex];

  if (!habit || !CroakleHabitDetailDialog) {
    return;
  }

  const monthKey = CroakleGetTrackMonthKey();

  CroakleHabitDetailForm.reset();
  CroakleHabitDetailForm.elements.habitIndex.value = String(habitIndex);
  CroakleHabitDetailForm.elements.habitName.value = habit.name;
  CroakleHabitDetailForm.elements.habitGoal.value = String(CroakleGetHabitGoalForMonth(habit, monthKey));
  CroakleHabitDetailForm.elements.habitDescription.value = habit.description || "";
  CroakleHabitDetailForm.elements.habitPriority.value = habit.priority || "medium";
  CroakleHabitDetailDialog.showModal();
  CroakleHabitDetailForm.elements.habitName.focus();
}

function CroakleHandleUpdateHabitWithMonthlyGoal(event) {
  event.preventDefault();

  const formData = new FormData(CroakleHabitDetailForm);
  const habitIndex = Number(formData.get("habitIndex"));
  const habit = CroakleState.habitTemplates[habitIndex];
  const name = String(formData.get("habitName") || "").trim();

  if (!habit || !name) {
    return;
  }

  const updatedHabit = {
    ...habit,
    name,
    description: String(formData.get("habitDescription") || "").trim(),
    priority: String(formData.get("habitPriority") || "medium"),
  };

  CroakleState.habitTemplates[habitIndex] = updatedHabit;
  CroakleSyncHabitMetaAcrossMonths(habitIndex, updatedHabit);
  CroakleSetHabitGoalForMonth(updatedHabit, CroakleGetTrackMonthKey(), formData.get("habitGoal"));

  CroakleSaveState();
  CroakleCloseHabitDetailDialog();
  CroakleRenderAll();
  CroakleRenderReorderList();
}

CroakleRenderTrackList = CroakleRenderTrackListWithMonthlyGoals;
CroakleOpenHabitDetailDialog = CroakleOpenHabitDetailDialogWithMonthlyGoal;
CroakleHabitDetailForm?.removeEventListener("submit", CroakleHandleUpdateHabit);
CroakleHandleUpdateHabit = CroakleHandleUpdateHabitWithMonthlyGoal;
CroakleHabitDetailForm?.addEventListener("submit", CroakleHandleUpdateHabit);
CroakleRenderBestListFromTrack = function CroakleRenderBestListFromMonthlyGoals() {
  const list = document.querySelector("#CroakleBestList");

  if (!list) {
    return;
  }

  const year = CroakleState.bestYear;
  const month = CroakleState.bestMonth;
  const monthKey = CroakleGetMonthKey(year, month);
  const monthData = CroakleGetMonthData(year, month);
  const rows = monthData.habits
    .map((habit, habitIndex) => {
      const doneCount = CroakleCountDone(habit.days);
      const template = CroakleState.habitTemplates[habitIndex] || habit;
      const habitWithMonthlyGoal = {
        ...habit,
        goal: CroakleGetHabitGoalForMonth(template, monthKey),
      };

      return {
        name: habit.name,
        percent: CroakleGetBestPercent(doneCount, habitWithMonthlyGoal, year, month),
        month: doneCount,
        lifetime: CroakleGetHabitLifetimeDoneForBest(habitIndex),
      };
    })
    .sort((firstHabit, secondHabit) => {
      if (secondHabit.percent !== firstHabit.percent) {
        return secondHabit.percent - firstHabit.percent;
      }

      return secondHabit.month - firstHabit.month;
    });

  document.querySelector("#CroakleBestMonth").textContent = CroakleGetMonthLabel(year, month);
  list.innerHTML = rows.map((habit) => `
    <section class="CroakleBestRow">
      <strong>${habit.name}</strong>
      <div class="CroaklePercentBar" aria-label="${habit.percent} percent">
        <span style="width: ${habit.percent}%"></span>
        <em>${habit.percent}%</em>
      </div>
      <span>${habit.month}</span>
      <span>${habit.lifetime}</span>
    </section>
  `).join("");
};

CroakleRenderAll();
