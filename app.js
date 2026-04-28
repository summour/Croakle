const CroakleHabitStoreKey = "CroakleHabitMoodDataCleanV1";
const CroakleOldStoreKeys = ["CroakleHabitMoodData"];
const CroakleMoodOptions = [1, 2, 3, 4, 5];
const CroakleMoodLabels = {
  1: "Terrible",
  2: "Annoyed",
  3: "Okay",
  4: "Good",
  5: "Excellent",
};
const CroakleMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const CroakleDefaultHabits = [
  { name: "Study with Study Bunny", goal: 5, description: "", priority: "medium" },
  { name: "Exercise", goal: 3, description: "", priority: "medium" },
  { name: "Go to bed before 11pm", goal: 5, description: "", priority: "medium" },
  { name: "Clean room", goal: 1, description: "", priority: "medium" },
  { name: "No fast food", goal: 6, description: "", priority: "medium" },
];

CroakleOldStoreKeys.forEach((key) => localStorage.removeItem(key));

let CroakleState = CroakleLoadState();

const CroaklePageButtons = document.querySelectorAll("[data-page-target]");
const CroakleMonthButtons = document.querySelectorAll("[data-month-target]");
const CroaklePages = document.querySelectorAll("[data-page]");
const CroakleBottomNav = document.querySelector(".CroakleBottomNav");

const CroakleOpenAddHabitButton = document.querySelector("#CroakleOpenAddHabit");
const CroakleAddHabitDialog = document.querySelector("#CroakleAddHabitDialog");
const CroakleAddHabitForm = document.querySelector("#CroakleAddHabitForm");
const CroakleCloseAddHabitButton = document.querySelector("#CroakleCloseAddHabit");

const CroakleOpenReorderHabitButton = document.querySelector("#CroakleOpenReorderHabit");
const CroakleReorderHabitDialog = document.querySelector("#CroakleReorderHabitDialog");
const CroakleCloseReorderHabitButton = document.querySelector("#CroakleCloseReorderHabit");
const CroakleCloseReorderHabitDoneButton = document.querySelector("#CroakleCloseReorderHabitDone");
const CroakleReorderList = document.querySelector("#CroakleReorderList");

const CroakleHabitDetailDialog = document.querySelector("#CroakleHabitDetailDialog");
const CroakleHabitDetailForm = document.querySelector("#CroakleHabitDetailForm");
const CroakleCloseHabitDetailButton = document.querySelector("#CroakleCloseHabitDetail");
const CroakleDeleteHabitButton = document.querySelector("#CroakleDeleteHabitButton");

function CroakleLoadState() {
  const savedData = localStorage.getItem(CroakleHabitStoreKey);

  if (!savedData) {
    return CroakleCreateDefaultState();
  }

  try {
    return CroakleNormalizeState(JSON.parse(savedData));
  } catch {
    return CroakleCreateDefaultState();
  }
}

function CroakleCreateDefaultState() {
  const today = CroakleGetToday();

  return {
    trackDate: CroakleFormatDate(today),
    trackMonth: today.getMonth(),
    trackYear: today.getFullYear(),
    bestMonth: today.getMonth(),
    bestYear: today.getFullYear(),
    moodMonth: today.getMonth(),
    moodYear: today.getFullYear(),
    habitTemplates: CroakleDefaultHabits.map((habit) => ({ ...habit })),
    months: {},
  };
}

function CroakleNormalizeState(state) {
  const cleanState = {
    ...CroakleCreateDefaultState(),
    ...state,
    habitTemplates: CroakleNormalizeHabitTemplates(state.habitTemplates),
    months: {},
  };

  Object.entries(state.months || {}).forEach(([monthKey, monthData]) => {
    cleanState.months[monthKey] = CroakleNormalizeMonthData(monthData, monthKey, cleanState.habitTemplates);
  });

  CroakleLockVisibleDatesToToday(cleanState);
  return cleanState;
}

function CroakleNormalizeHabitTemplates(templates) {
  const sourceTemplates = Array.isArray(templates) && templates.length ? templates : CroakleDefaultHabits;

  return sourceTemplates.map((habit, index) => ({
    id: habit.id || `CroakleHabit${Date.now()}${index}`,
    name: habit.name || "New Habit",
    goal: CroakleClampGoal(habit.goal),
    description: habit.description || "",
    priority: habit.priority || "medium",
  }));
}

function CroakleNormalizeMonthData(monthData, monthKey, habitTemplates = CroakleState?.habitTemplates || CroakleDefaultHabits) {
  const defaultMonthData = CroakleCreateMonthData(monthKey, habitTemplates);
  const daysInMonth = CroakleGetDaysInMonthFromKey(monthKey);

  return {
    habits: habitTemplates.map((template, habitIndex) => {
      const savedHabit = monthData?.habits?.[habitIndex];

      return {
        ...defaultMonthData.habits[habitIndex],
        ...savedHabit,
        ...template,
        days: Array.from({ length: daysInMonth }, (_, dayIndex) => Boolean(savedHabit?.days?.[dayIndex])),
        lifetime: Number(savedHabit?.lifetime || 0),
      };
    }),
    moods: Array.from({ length: daysInMonth }, (_, dayIndex) => CroakleNormalizeMoodValue(monthData?.moods?.[dayIndex])),
  };
}

function CroakleNormalizeMoodValue(value) {
  const moodValue = Number(value);
  return CroakleMoodOptions.includes(moodValue) ? moodValue : null;
}

function CroakleLockVisibleDatesToToday(state) {
  const today = CroakleGetToday();

  state.trackDate = CroakleFormatDate(today);
  state.trackMonth = today.getMonth();
  state.trackYear = today.getFullYear();
  state.bestMonth = today.getMonth();
  state.bestYear = today.getFullYear();
  state.moodMonth = today.getMonth();
  state.moodYear = today.getFullYear();
}

function CroakleSaveState() {
  localStorage.setItem(CroakleHabitStoreKey, JSON.stringify(CroakleState));
}

function CroakleGetToday() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function CroakleParseDate(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function CroakleFormatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function CroakleShiftDate(date, dayAmount) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + dayAmount);
  return nextDate;
}

function CroakleGetWeekDates(anchorDate) {
  const weekStart = CroakleShiftDate(anchorDate, -((anchorDate.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, index) => CroakleShiftDate(weekStart, index));
}

function CroakleGetMonthKey(year, month) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function CroakleGetMonthKeyFromDate(date) {
  return CroakleGetMonthKey(date.getFullYear(), date.getMonth());
}

function CroakleGetDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function CroakleGetDaysInMonthFromKey(monthKey) {
  const [yearText, monthText] = monthKey.split("-");
  return CroakleGetDaysInMonth(Number(yearText), Number(monthText) - 1);
}

function CroakleGetMonthLabel(year, month) {
  return `${CroakleMonthNames[month]} ${year}`;
}

function CroakleGetWeekLabel(weekDates) {
  const firstDate = weekDates[0];
  const lastDate = weekDates[6];

  if (firstDate.getMonth() === lastDate.getMonth() && firstDate.getFullYear() === lastDate.getFullYear()) {
    return CroakleGetMonthLabel(firstDate.getFullYear(), firstDate.getMonth());
  }

  const firstLabel = `${CroakleMonthNames[firstDate.getMonth()]} ${firstDate.getFullYear()}`;
  const lastLabel = `${CroakleMonthNames[lastDate.getMonth()]} ${lastDate.getFullYear()}`;
  return `${firstLabel} - ${lastLabel}`;
}

function CroakleGetMoodLabel(value) {
  return CroakleMoodLabels[value] || "No mood";
}

function CroakleIsToday(date) {
  return CroakleFormatDate(date) === CroakleFormatDate(CroakleGetToday());
}

function CroakleGetCurrentDayClass(date) {
  return CroakleIsToday(date) ? " CroakleCurrentDay" : "";
}

function CroakleGetMonthData(year, month) {
  const monthKey = CroakleGetMonthKey(year, month);

  if (!CroakleState.months[monthKey]) {
    CroakleState.months[monthKey] = CroakleCreateMonthData(monthKey, CroakleState.habitTemplates);
  }

  CroakleSyncMonthHabits(CroakleState.months[monthKey], monthKey);
  return CroakleState.months[monthKey];
}

function CroakleGetMonthDataFromDate(date) {
  return CroakleGetMonthData(date.getFullYear(), date.getMonth());
}

function CroakleCreateMonthData(monthKey, habitTemplates = CroakleState?.habitTemplates || CroakleDefaultHabits) {
  const daysInMonth = CroakleGetDaysInMonthFromKey(monthKey);

  return {
    habits: habitTemplates.map((habit) => ({
      ...habit,
      days: Array.from({ length: daysInMonth }, () => false),
      lifetime: 0,
    })),
    moods: Array.from({ length: daysInMonth }, () => null),
  };
}

function CroakleSyncMonthHabits(monthData, monthKey) {
  const daysInMonth = CroakleGetDaysInMonthFromKey(monthKey);

  CroakleState.habitTemplates.forEach((template, habitIndex) => {
    const savedHabit = monthData.habits[habitIndex];

    monthData.habits[habitIndex] = {
      ...template,
      days: Array.from({ length: daysInMonth }, (_, dayIndex) => Boolean(savedHabit?.days?.[dayIndex])),
      lifetime: Number(savedHabit?.lifetime || 0),
    };
  });

  monthData.habits = monthData.habits.slice(0, CroakleState.habitTemplates.length);
}

function CroakleShiftMonth(target, direction) {
  if (target === "track") {
    CroakleShiftTrackWeek(direction);
    return;
  }

  const monthKey = `${target}Month`;
  const yearKey = `${target}Year`;
  const nextDate = new Date(CroakleState[yearKey], CroakleState[monthKey] + direction, 1);

  CroakleState[monthKey] = nextDate.getMonth();
  CroakleState[yearKey] = nextDate.getFullYear();
  CroakleSaveState();
  CroakleRenderAll();
}

function CroakleShiftTrackWeek(direction) {
  const nextDate = CroakleShiftDate(CroakleParseDate(CroakleState.trackDate), direction * 7);

  CroakleState.trackDate = CroakleFormatDate(nextDate);
  CroakleState.trackMonth = nextDate.getMonth();
  CroakleState.trackYear = nextDate.getFullYear();
  CroakleSaveState();
  CroakleRenderAll();
}

function CroakleSetPage(pageName) {
  CroaklePages.forEach((page) => {
    page.classList.toggle("CroaklePageActive", page.dataset.page === pageName);
  });

  CroaklePageButtons.forEach((button) => {
    button.classList.toggle("CroakleActiveNav", button.dataset.pageTarget === pageName);
  });

  CroakleBottomNav.hidden = pageName === "menu";
  CroakleScrollCurrentDateIntoView();
}

function CroakleCountDone(days) {
  return days.filter(Boolean).length;
}

function CroakleClampGoal(goal) {
  const cleanGoal = Number(goal);

  if (!Number.isFinite(cleanGoal)) {
    return 1;
  }

  return Math.min(7, Math.max(1, Math.round(cleanGoal)));
}

function CroakleGetWeeklyHabitCount(habitIndex, weekDates) {
  return weekDates.filter((date) => {
    const monthData = CroakleGetMonthDataFromDate(date);
    return Boolean(monthData.habits[habitIndex]?.days[date.getDate() - 1]);
  }).length;
}

function CroakleRenderTrackHeader() {
  const weekDates = CroakleGetWeekDates(CroakleParseDate(CroakleState.trackDate));

  document.querySelector("#CroakleTrackMonth").textContent = CroakleGetWeekLabel(weekDates);
  document.querySelector("#CroakleTrackDates").className = "CroakleSevenGrid CroakleDateRow CroakleWeekGrid";
  document.querySelector("#CroakleTrackMoodPreview").className = "CroakleSevenGrid CroakleMoodPreview CroakleWeekGrid";
  document.querySelector("#CroakleTrackDates").innerHTML = weekDates
    .map((date) => {
      const dateIso = CroakleFormatDate(date);
      const currentDayClass = CroakleGetCurrentDayClass(date);

      return `<span class="CroakleDateCell${currentDayClass}" data-date-iso="${dateIso}" data-current-date="${currentDayClass ? "true" : "false"}">${date.getDate()}</span>`;
    })
    .join("");
  document.querySelector("#CroakleTrackMoodPreview").innerHTML = weekDates
    .map((date) => {
      const monthData = CroakleGetMonthDataFromDate(date);
      return CroakleCreateMoodBadge(monthData.moods[date.getDate() - 1], CroakleGetCurrentDayClass(date), CroakleFormatDate(date));
    })
    .join("");
}

function CroakleRenderTrackList() {
  const list = document.querySelector("#CroakleTrackList");
  const weekDates = CroakleGetWeekDates(CroakleParseDate(CroakleState.trackDate));
  const trackData = CroakleGetMonthDataFromDate(CroakleParseDate(CroakleState.trackDate));

  list.innerHTML = CroakleState.habitTemplates.map((habit, habitIndex) => {
    const current = CroakleGetWeeklyHabitCount(habitIndex, weekDates);
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
          <button class="CroakleHabitNameButton" type="button" data-detail-index="${habitIndex}" title="${habit.description || ""}">${trackData.habits[habitIndex]?.name || habit.name}</button>
          <span class="CroakleGoal">${current}/${habit.goal}</span>
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

function CroakleToggleHabitDay(event) {
  const habitIndex = Number(event.currentTarget.dataset.habitIndex);
  const date = CroakleParseDate(event.currentTarget.dataset.dateIso);
  const trackData = CroakleGetMonthDataFromDate(date);
  const dayIndex = date.getDate() - 1;
  const habit = trackData.habits[habitIndex];

  habit.days[dayIndex] = !habit.days[dayIndex];
  CroakleSaveState();
  CroakleRenderTrackList();
}

function CroakleRenderBestList() {
  const list = document.querySelector("#CroakleBestList");
  const monthData = CroakleGetMonthData(CroakleState.bestYear, CroakleState.bestMonth);
  const rows = monthData.habits
    .map((habit) => {
      const doneCount = CroakleCountDone(habit.days);
      const percent = Math.round((doneCount / habit.days.length) * 100);

      return {
        name: habit.name.replace(" with Study Bunny", ""),
        percent,
        month: doneCount,
        lifetime: habit.lifetime + doneCount,
      };
    })
    .sort((firstHabit, secondHabit) => secondHabit.percent - firstHabit.percent);

  document.querySelector("#CroakleBestMonth").textContent = CroakleGetMonthLabel(CroakleState.bestYear, CroakleState.bestMonth);
  list.innerHTML = rows.map((habit) => `
    <section class="CroakleBestRow">
      <strong>${habit.name}</strong>
      <div class="CroaklePercentBar" aria-label="${habit.percent} percent">
        <span></span>
        <em>${habit.percent}%</em>
      </div>
      <span>${habit.month}</span>
      <span>${habit.lifetime}</span>
    </section>
  `).join("");
}

function CroakleRenderMoodCalendar() {
  const calendar = document.querySelector("#CroakleMoodCalendar");
  const year = CroakleState.moodYear;
  const month = CroakleState.moodMonth;
  const moodData = CroakleGetMonthData(year, month);

  document.querySelector("#CroakleMoodMonth").textContent = CroakleGetMonthLabel(year, month);
  calendar.innerHTML = moodData.moods.map((mood, index) => {
    const day = index + 1;
    const date = new Date(year, month, day);
    const currentDayClass = CroakleGetCurrentDayClass(date);

    return `
      <button
        class="CroakleMoodButton${currentDayClass}"
        type="button"
        data-mood-index="${index}"
        data-current-date="${currentDayClass ? "true" : "false"}"
        data-date-iso="${CroakleFormatDate(date)}"
        aria-label="Day ${day}, mood ${CroakleGetMoodLabel(mood)}"
      >
        <small>${day}</small>
        ${CroakleCreateMoodBadge(mood, currentDayClass, CroakleFormatDate(date))}
      </button>
    `;
  }).join("");

  document.querySelectorAll(".CroakleMoodButton").forEach((button) => {
    button.addEventListener("click", CroakleCycleMood);
  });

  CroakleRenderTopMoods();
}

function CroakleCreateMoodBadge(mood, extraClass = "", dateIso = "") {
  const levelClass = mood ? `CroakleMoodLevel${mood}` : "CroakleMoodEmpty";
  return `<span class="CroakleMoodBadge ${levelClass}${extraClass}" data-date-iso="${dateIso}" title="${CroakleGetMoodLabel(mood)}">${mood || ""}</span>`;
}

function CroakleCycleMood(event) {
  const moodIndex = Number(event.currentTarget.dataset.moodIndex);
  const moodData = CroakleGetMonthData(CroakleState.moodYear, CroakleState.moodMonth);
  const currentMood = moodData.moods[moodIndex];
  const currentMoodIndex = CroakleMoodOptions.indexOf(currentMood);
  const nextMoodIndex = (currentMoodIndex + 1) % CroakleMoodOptions.length;

  moodData.moods[moodIndex] = CroakleMoodOptions[nextMoodIndex];
  CroakleSaveState();
  CroakleRenderMoodCalendar();
}

function CroakleRenderTopMoods() {
  const topMoodArea = document.querySelector(".CroakleTopMoodRow div");
  const moodData = CroakleGetMonthData(CroakleState.moodYear, CroakleState.moodMonth);
  const moodCounts = moodData.moods.reduce((counts, mood) => {
    if (mood) {
      counts[mood] = (counts[mood] || 0) + 1;
    }
    return counts;
  }, {});

  const topMoods = Object.entries(moodCounts)
    .sort((firstMood, secondMood) => secondMood[1] - firstMood[1])
    .slice(0, 3)
    .map(([mood]) => Number(mood));

  topMoodArea.innerHTML = topMoods.map((mood) => CroakleCreateMoodBadge(mood)).join("");
}

function CroakleOpenAddHabitDialog() {
  CroakleAddHabitForm.reset();
  CroakleAddHabitDialog.showModal();
  document.querySelector("#CroakleHabitNameInput").focus();
}

function CroakleCloseAddHabitDialog() {
  CroakleAddHabitDialog.close();
}

function CroakleHandleAddHabit(event) {
  event.preventDefault();

  const formData = new FormData(CroakleAddHabitForm);
  const habit = {
    id: `CroakleHabit${Date.now()}`,
    name: String(formData.get("habitName") || "").trim(),
    goal: CroakleClampGoal(formData.get("habitGoal")),
    description: String(formData.get("habitDescription") || "").trim(),
    priority: String(formData.get("habitPriority") || "medium"),
  };

  if (!habit.name) {
    return;
  }

  CroakleState.habitTemplates.push(habit);
  Object.entries(CroakleState.months).forEach(([monthKey, monthData]) => {
    const daysInMonth = CroakleGetDaysInMonthFromKey(monthKey);
    monthData.habits.push({
      ...habit,
      days: Array.from({ length: daysInMonth }, () => false),
      lifetime: 0,
    });
  });

  CroakleSaveState();
  CroakleCloseAddHabitDialog();
  CroakleRenderAll();
  CroakleRenderReorderList();
}

function CroakleOpenHabitDetailDialog(event) {
  const habitIndex = Number(event.currentTarget.dataset.detailIndex);
  const habit = CroakleState.habitTemplates[habitIndex];

  if (!habit || !CroakleHabitDetailDialog) {
    return;
  }

  CroakleHabitDetailForm.reset();
  CroakleHabitDetailForm.elements.habitIndex.value = String(habitIndex);
  CroakleHabitDetailForm.elements.habitName.value = habit.name;
  CroakleHabitDetailForm.elements.habitGoal.value = String(habit.goal);
  CroakleHabitDetailForm.elements.habitDescription.value = habit.description || "";
  CroakleHabitDetailForm.elements.habitPriority.value = habit.priority || "medium";
  CroakleHabitDetailDialog.showModal();
  CroakleHabitDetailForm.elements.habitName.focus();
}

function CroakleCloseHabitDetailDialog() {
  CroakleHabitDetailDialog?.close();
}

function CroakleHandleUpdateHabit(event) {
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
    goal: CroakleClampGoal(formData.get("habitGoal")),
    description: String(formData.get("habitDescription") || "").trim(),
    priority: String(formData.get("habitPriority") || "medium"),
  };

  CroakleState.habitTemplates[habitIndex] = updatedHabit;
  Object.values(CroakleState.months).forEach((monthData) => {
    const savedHabit = monthData.habits[habitIndex];

    if (savedHabit) {
      monthData.habits[habitIndex] = {
        ...savedHabit,
        ...updatedHabit,
      };
    }
  });

  CroakleSaveState();
  CroakleCloseHabitDetailDialog();
  CroakleRenderAll();
  CroakleRenderReorderList();
}

function CroakleHandleDeleteHabit() {
  const habitIndex = Number(CroakleHabitDetailForm.elements.habitIndex.value);

  if (!CroakleState.habitTemplates[habitIndex]) {
    return;
  }

  CroakleState.habitTemplates.splice(habitIndex, 1);
  Object.values(CroakleState.months).forEach((monthData) => {
    monthData.habits.splice(habitIndex, 1);
  });

  CroakleSaveState();
  CroakleCloseHabitDetailDialog();
  CroakleRenderAll();
  CroakleRenderReorderList();
}

function CroakleSwapArrayItems(list, fromIndex, toIndex) {
  const nextList = [...list];
  const [movedItem] = nextList.splice(fromIndex, 1);
  nextList.splice(toIndex, 0, movedItem);
  return nextList;
}

function CroakleOpenReorderHabitDialog() {
  if (!CroakleReorderHabitDialog) {
    return;
  }

  CroakleRenderReorderList();
  CroakleReorderHabitDialog.showModal();
}

function CroakleCloseReorderHabitDialog() {
  CroakleReorderHabitDialog?.close();
}

function CroakleRenderReorderList() {
  if (!CroakleReorderList) {
    return;
  }

  CroakleReorderList.innerHTML = CroakleState.habitTemplates
    .map((habit, index) => {
      const isFirst = index === 0;
      const isLast = index === CroakleState.habitTemplates.length - 1;

      return `
        <div class="CroakleReorderRow">
          <div class="CroakleReorderName">${habit.name}</div>
          <div class="CroakleReorderActions">
            <button class="CroakleReorderMoveButton" type="button" data-reorder-index="${index}" data-reorder-direction="up" aria-label="Move ${habit.name} up" ${isFirst ? "disabled" : ""}>↑</button>
            <button class="CroakleReorderMoveButton" type="button" data-reorder-index="${index}" data-reorder-direction="down" aria-label="Move ${habit.name} down" ${isLast ? "disabled" : ""}>↓</button>
          </div>
        </div>
      `;
    })
    .join("");

  document.querySelectorAll(".CroakleReorderMoveButton").forEach((button) => {
    button.addEventListener("click", CroakleHandleReorderHabit);
  });
}

function CroakleHandleReorderHabit(event) {
  const fromIndex = Number(event.currentTarget.dataset.reorderIndex);
  const direction = event.currentTarget.dataset.reorderDirection === "down" ? 1 : -1;
  const toIndex = fromIndex + direction;

  if (toIndex < 0 || toIndex >= CroakleState.habitTemplates.length) {
    return;
  }

  CroakleState.habitTemplates = CroakleSwapArrayItems(CroakleState.habitTemplates, fromIndex, toIndex);

  Object.values(CroakleState.months).forEach((monthData) => {
    monthData.habits = CroakleSwapArrayItems(monthData.habits, fromIndex, toIndex);
  });

  CroakleSaveState();
  CroakleRenderAll();
  CroakleRenderReorderList();
}

function CroakleScrollCurrentDateIntoView() {
  window.requestAnimationFrame(() => {
    const activePage = document.querySelector(".CroaklePageActive");
    const currentDateTarget = activePage?.querySelector('[data-current-date="true"]');

    currentDateTarget?.scrollIntoView({
      block: "center",
      inline: "center",
    });
  });
}

function CroakleRenderAll() {
  CroakleRenderTrackHeader();
  CroakleRenderTrackList();
  CroakleRenderBestList();
  CroakleRenderMoodCalendar();
  CroakleScrollCurrentDateIntoView();
}

CroaklePageButtons.forEach((button) => {
  button.addEventListener("click", () => CroakleSetPage(button.dataset.pageTarget));
});

CroakleMonthButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.monthAction === "next" ? 1 : -1;
    CroakleShiftMonth(button.dataset.monthTarget, direction);
  });
});

if (CroakleOpenAddHabitButton) {
  CroakleOpenAddHabitButton.addEventListener("click", CroakleOpenAddHabitDialog);
}

if (CroakleCloseAddHabitButton) {
  CroakleCloseAddHabitButton.addEventListener("click", CroakleCloseAddHabitDialog);
}

if (CroakleAddHabitForm) {
  CroakleAddHabitForm.addEventListener("submit", CroakleHandleAddHabit);
}

if (CroakleOpenReorderHabitButton) {
  CroakleOpenReorderHabitButton.addEventListener("click", CroakleOpenReorderHabitDialog);
}

if (CroakleCloseReorderHabitButton) {
  CroakleCloseReorderHabitButton.addEventListener("click", CroakleCloseReorderHabitDialog);
}

if (CroakleCloseReorderHabitDoneButton) {
  CroakleCloseReorderHabitDoneButton.addEventListener("click", CroakleCloseReorderHabitDialog);
}

if (CroakleCloseHabitDetailButton) {
  CroakleCloseHabitDetailButton.addEventListener("click", CroakleCloseHabitDetailDialog);
}

if (CroakleHabitDetailForm) {
  CroakleHabitDetailForm.addEventListener("submit", CroakleHandleUpdateHabit);
}

if (CroakleDeleteHabitButton) {
  CroakleDeleteHabitButton.addEventListener("click", CroakleHandleDeleteHabit);
}

CroakleRenderAll();
CroakleSetPage("menu");
