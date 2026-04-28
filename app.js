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
  { name: "Study with Study Bunny", goal: 5 },
  { name: "Exercise", goal: 3 },
  { name: "Go to bed before 11pm", goal: 5 },
  { name: "Clean room", goal: 1 },
  { name: "No fast food", goal: 6 },
];

CroakleOldStoreKeys.forEach((key) => localStorage.removeItem(key));

let CroakleState = CroakleLoadState();

const CroaklePageButtons = document.querySelectorAll("[data-page-target]");
const CroakleMonthButtons = document.querySelectorAll("[data-month-target]");
const CroaklePages = document.querySelectorAll("[data-page]");
const CroakleBottomNav = document.querySelector(".CroakleBottomNav");

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

function CroakleGetCurrentDateCursor() {
  const today = new Date();

  return {
    date: today.getDate(),
    month: today.getMonth(),
    year: today.getFullYear(),
  };
}

function CroakleCreateDefaultState() {
  const currentDate = CroakleGetCurrentDateCursor();

  return {
    trackMonth: currentDate.month,
    trackYear: currentDate.year,
    bestMonth: currentDate.month,
    bestYear: currentDate.year,
    moodMonth: currentDate.month,
    moodYear: currentDate.year,
    months: {},
  };
}

function CroakleNormalizeState(state) {
  const cleanState = {
    ...CroakleCreateDefaultState(),
    ...state,
    months: {},
  };

  Object.entries(state.months || {}).forEach(([monthKey, monthData]) => {
    cleanState.months[monthKey] = CroakleNormalizeMonthData(monthData, monthKey);
  });

  CroakleLockVisibleMonthsToCurrent(cleanState);

  return cleanState;
}

function CroakleNormalizeMonthData(monthData, monthKey) {
  const defaultMonthData = CroakleCreateMonthData(monthKey);
  const [yearText, monthText] = monthKey.split("-");
  const daysInMonth = CroakleGetDaysInMonth(Number(yearText), Number(monthText) - 1);

  return {
    habits: defaultMonthData.habits.map((defaultHabit, habitIndex) => {
      const savedHabit = monthData?.habits?.[habitIndex];

      return {
        ...defaultHabit,
        ...savedHabit,
        days: Array.from({ length: daysInMonth }, (_, dayIndex) => Boolean(savedHabit?.days?.[dayIndex])),
        lifetime: Number(savedHabit?.lifetime || 0),
      };
    }),
    moods: Array.from({ length: daysInMonth }, (_, dayIndex) => CroakleNormalizeMoodValue(monthData?.moods?.[dayIndex])),
  };
}

function CroakleNormalizeMoodValue(value) {
  const moodValue = Number(value);

  if (CroakleMoodOptions.includes(moodValue)) {
    return moodValue;
  }

  return null;
}

function CroakleLockVisibleMonthsToCurrent(state) {
  const currentDate = CroakleGetCurrentDateCursor();
  const pageNames = ["track", "best", "mood"];

  pageNames.forEach((pageName) => {
    state[`${pageName}Month`] = currentDate.month;
    state[`${pageName}Year`] = currentDate.year;
  });
}

function CroakleSaveState() {
  localStorage.setItem(CroakleHabitStoreKey, JSON.stringify(CroakleState));
}

function CroakleGetMonthKey(year, month) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function CroakleGetDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function CroakleGetMonthLabel(year, month) {
  return `${CroakleMonthNames[month]} ${year}`;
}

function CroakleGetMonthGridClass(daysInMonth) {
  return `CroakleDays${daysInMonth}`;
}

function CroakleGetMoodLabel(value) {
  return CroakleMoodLabels[value] || "No mood";
}

function CroakleIsCurrentMonth(year, month) {
  const currentDate = CroakleGetCurrentDateCursor();
  return year === currentDate.year && month === currentDate.month;
}

function CroakleGetCurrentDayClass(year, month, day) {
  if (!CroakleIsCurrentMonth(year, month)) {
    return "";
  }

  return day === CroakleGetCurrentDateCursor().date ? " CroakleCurrentDay" : "";
}

function CroakleGetMonthData(year, month) {
  const monthKey = CroakleGetMonthKey(year, month);

  if (!CroakleState.months[monthKey]) {
    CroakleState.months[monthKey] = CroakleCreateMonthData(monthKey);
  }

  return CroakleState.months[monthKey];
}

function CroakleCreateMonthData(monthKey) {
  const [yearText, monthText] = monthKey.split("-");
  const year = Number(yearText);
  const month = Number(monthText) - 1;
  const daysInMonth = CroakleGetDaysInMonth(year, month);

  return {
    habits: CroakleDefaultHabits.map((habit) => ({
      ...habit,
      days: Array.from({ length: daysInMonth }, () => false),
      lifetime: 0,
    })),
    moods: Array.from({ length: daysInMonth }, () => null),
  };
}

function CroakleShiftMonth(target, direction) {
  const monthKey = `${target}Month`;
  const yearKey = `${target}Year`;
  const nextDate = new Date(CroakleState[yearKey], CroakleState[monthKey] + direction, 1);

  CroakleState[monthKey] = nextDate.getMonth();
  CroakleState[yearKey] = nextDate.getFullYear();
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

function CroakleRenderTrackHeader() {
  const year = CroakleState.trackYear;
  const month = CroakleState.trackMonth;
  const trackData = CroakleGetMonthData(year, month);
  const daysInMonth = CroakleGetDaysInMonth(year, month);
  const dayIndexes = Array.from({ length: daysInMonth }, (_, index) => index);
  const monthGridClass = CroakleGetMonthGridClass(daysInMonth);

  document.querySelector("#CroakleTrackMonth").textContent = CroakleGetMonthLabel(year, month);
  document.querySelector("#CroakleTrackDates").className = `CroakleSevenGrid CroakleDateRow CroakleMonthGrid ${monthGridClass}`;
  document.querySelector("#CroakleTrackMoodPreview").className = `CroakleSevenGrid CroakleMoodPreview CroakleMonthGrid ${monthGridClass}`;
  document.querySelector("#CroakleTrackDates").innerHTML = dayIndexes
    .map((dayIndex) => {
      const day = dayIndex + 1;
      const currentDayClass = CroakleGetCurrentDayClass(year, month, day);

      return `<span class="CroakleDateCell${currentDayClass}" data-current-date="${currentDayClass ? "true" : "false"}">${day}</span>`;
    })
    .join("");
  document.querySelector("#CroakleTrackMoodPreview").innerHTML = dayIndexes
    .map((dayIndex) => CroakleCreateMoodBadge(trackData.moods[dayIndex], CroakleGetCurrentDayClass(year, month, dayIndex + 1)))
    .join("");
}

function CroakleRenderTrackList() {
  const list = document.querySelector("#CroakleTrackList");
  const year = CroakleState.trackYear;
  const month = CroakleState.trackMonth;
  const trackData = CroakleGetMonthData(year, month);
  const daysInMonth = CroakleGetDaysInMonth(year, month);
  const dayIndexes = Array.from({ length: daysInMonth }, (_, index) => index);
  const monthGridClass = CroakleGetMonthGridClass(daysInMonth);

  list.innerHTML = trackData.habits.map((habit, habitIndex) => {
    const current = CroakleCountDone(habit.days);
    const checks = dayIndexes
      .map((dayIndex) => {
        const done = habit.days[dayIndex];
        const day = dayIndex + 1;
        const currentDayClass = CroakleGetCurrentDayClass(year, month, day);

        return `
          <button
            class="CroakleCheckButton ${done ? "CroakleCheckDone" : "CroakleCheckEmpty"}${currentDayClass}"
            type="button"
            data-habit-index="${habitIndex}"
            data-day-index="${dayIndex}"
            data-current-date="${currentDayClass ? "true" : "false"}"
            aria-label="${habit.name} day ${day} ${done ? "done" : "not done"}"
            aria-pressed="${done}"
          >${done ? "✓" : ""}</button>
        `;
      })
      .join("");

    return `
      <section class="CroakleHabitRow">
        <div class="CroakleHabitTop">
          <span class="CroakleDot" aria-hidden="true"></span>
          <strong>${habit.name}</strong>
          <span class="CroakleGoal">${current}/${habit.goal}</span>
        </div>
        <div class="CroakleCheckGrid CroakleMonthGrid ${monthGridClass}">${checks}</div>
      </section>
    `;
  }).join("");

  document.querySelectorAll(".CroakleCheckButton").forEach((button) => {
    button.addEventListener("click", CroakleToggleHabitDay);
  });
}

function CroakleToggleHabitDay(event) {
  const habitIndex = Number(event.currentTarget.dataset.habitIndex);
  const dayIndex = Number(event.currentTarget.dataset.dayIndex);
  const trackData = CroakleGetMonthData(CroakleState.trackYear, CroakleState.trackMonth);
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
    const currentDayClass = CroakleGetCurrentDayClass(year, month, day);

    return `
      <button
        class="CroakleMoodButton${currentDayClass}"
        type="button"
        data-mood-index="${index}"
        data-current-date="${currentDayClass ? "true" : "false"}"
        aria-label="Day ${day}, mood ${CroakleGetMoodLabel(mood)}"
      >
        <small>${day}</small>
        ${CroakleCreateMoodBadge(mood, currentDayClass)}
      </button>
    `;
  }).join("");

  document.querySelectorAll(".CroakleMoodButton").forEach((button) => {
    button.addEventListener("click", CroakleCycleMood);
  });

  CroakleRenderTopMoods();
}

function CroakleCreateMoodBadge(mood, extraClass = "") {
  const levelClass = mood ? `CroakleMoodLevel${mood}` : "CroakleMoodEmpty";

  return `<span class="CroakleMoodBadge ${levelClass}${extraClass}" title="${CroakleGetMoodLabel(mood)}">${mood || ""}</span>`;
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

CroakleRenderAll();
CroakleSetPage("menu");
