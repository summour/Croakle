const CroakleHabitStoreKey = "CroakleHabitMoodData";
const CroakleMoodOptions = ["🙂", "😐", "😎", "😴", "😡", "😢", "😰", "😬", "😵‍💫", "🤢", "😊", "😄"];
const CroakleMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const CroakleDefaultHabits = [
  { name: "Study with Study Bunny", goal: 5 },
  { name: "Exercise", goal: 3 },
  { name: "Go to bed before 11pm", goal: 5 },
  { name: "Clean room", goal: 1 },
  { name: "No fast food", goal: 6 },
];

const CroakleDefaultWeek = [
  [false, true, true, true, true, true, true],
  [false, true, false, true, false, true, false],
  [false, false, true, true, true, false, false],
  [true, false, false, false, false, false, false],
  [false, false, true, false, true, false, true],
];

const CroakleDefaultMoodDays = [
  "😐", "🙂", "😄", "🙂", "😎", "🤢", "🤢",
  "😴", "🙂", "😰", "😎", "😎", "😎", "😴",
  "😎", "😬", "😵‍💫", "😢", "😴", "😎", "🙂",
  "😰", "😐", "😐", "😎", "😎", "😡", "😢",
  "😊", "😎", "😴", "😐", "😎", "🙂", "😄",
];

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

function CroakleCreateDefaultState() {
  return {
    trackMonth: 5,
    trackYear: 2024,
    bestMonth: 4,
    bestYear: 2024,
    moodMonth: 4,
    moodYear: 2024,
    months: {},
  };
}

function CroakleNormalizeState(state) {
  const cleanState = {
    ...CroakleCreateDefaultState(),
    ...state,
    months: state.months || {},
  };

  if (state.habits || state.moods) {
    const legacyKey = CroakleGetMonthKey(cleanState.trackYear, cleanState.trackMonth);
    cleanState.months[legacyKey] = {
      habits: state.habits || CroakleCreateMonthData(legacyKey).habits,
      moods: state.moods || CroakleCreateMonthData(legacyKey).moods,
    };
  }

  return cleanState;
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
    habits: CroakleDefaultHabits.map((habit, habitIndex) => ({
      ...habit,
      days: Array.from({ length: daysInMonth }, (_, dayIndex) => CroakleDefaultWeek[habitIndex][dayIndex % 7]),
      lifetime: 40 + habitIndex * 37 + month * 4,
    })),
    moods: Array.from({ length: daysInMonth }, (_, index) => CroakleDefaultMoodDays[index % CroakleDefaultMoodDays.length]),
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
}

function CroakleCountDone(days) {
  return days.filter(Boolean).length;
}

function CroakleRenderTrackHeader() {
  const year = CroakleState.trackYear;
  const month = CroakleState.trackMonth;
  const trackData = CroakleGetMonthData(year, month);
  const firstMondayDate = 1 + ((8 - new Date(year, month, 1).getDay()) % 7);
  const previewDates = Array.from({ length: 7 }, (_, index) => firstMondayDate + index);

  document.querySelector("#CroakleTrackMonth").textContent = CroakleGetMonthLabel(year, month);
  document.querySelector("#CroakleTrackDates").innerHTML = previewDates.map((date) => `<span>${date}</span>`).join("");
  document.querySelector("#CroakleTrackMoodPreview").innerHTML = previewDates
    .map((date) => `<span>${trackData.moods[date - 1] || "🙂"}</span>`)
    .join("");
}

function CroakleRenderTrackList() {
  const list = document.querySelector("#CroakleTrackList");
  const trackData = CroakleGetMonthData(CroakleState.trackYear, CroakleState.trackMonth);
  const previewDays = Array.from({ length: 7 }, (_, index) => index);

  list.innerHTML = trackData.habits.map((habit, habitIndex) => {
    const current = CroakleCountDone(habit.days);
    const checks = previewDays
      .map((dayIndex) => {
        const done = habit.days[dayIndex];

        return `
          <button
            class="CroakleCheckButton ${done ? "CroakleCheckDone" : "CroakleCheckEmpty"}"
            type="button"
            data-habit-index="${habitIndex}"
            data-day-index="${dayIndex}"
            aria-label="${habit.name} day ${dayIndex + 1} ${done ? "done" : "not done"}"
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
        <div class="CroakleCheckGrid">${checks}</div>
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
        <span style="width: ${habit.percent}%"></span>
        <em>${habit.percent}%</em>
      </div>
      <span>${habit.month}</span>
      <span>${habit.lifetime}</span>
    </section>
  `).join("");
}

function CroakleRenderMoodCalendar() {
  const calendar = document.querySelector("#CroakleMoodCalendar");
  const moodData = CroakleGetMonthData(CroakleState.moodYear, CroakleState.moodMonth);

  document.querySelector("#CroakleMoodMonth").textContent = CroakleGetMonthLabel(CroakleState.moodYear, CroakleState.moodMonth);
  calendar.innerHTML = moodData.moods.map((mood, index) => `
    <button class="CroakleMoodButton" type="button" data-mood-index="${index}" aria-label="Day ${index + 1}, mood ${mood}">
      <small>${index + 1}</small>
      <span>${mood}</span>
    </button>
  `).join("");

  document.querySelectorAll(".CroakleMoodButton").forEach((button) => {
    button.addEventListener("click", CroakleCycleMood);
  });

  CroakleRenderTopMoods();
}

function CroakleCycleMood(event) {
  const moodIndex = Number(event.currentTarget.dataset.moodIndex);
  const moodData = CroakleGetMonthData(CroakleState.moodYear, CroakleState.moodMonth);
  const currentMood = moodData.moods[moodIndex];
  const nextMoodIndex = (CroakleMoodOptions.indexOf(currentMood) + 1) % CroakleMoodOptions.length;

  moodData.moods[moodIndex] = CroakleMoodOptions[nextMoodIndex];
  CroakleSaveState();
  CroakleRenderMoodCalendar();
}

function CroakleRenderTopMoods() {
  const topMoodArea = document.querySelector(".CroakleTopMoodRow div");
  const moodData = CroakleGetMonthData(CroakleState.moodYear, CroakleState.moodMonth);
  const moodCounts = moodData.moods.reduce((counts, mood) => {
    counts[mood] = (counts[mood] || 0) + 1;
    return counts;
  }, {});

  const topMoods = Object.entries(moodCounts)
    .sort((firstMood, secondMood) => secondMood[1] - firstMood[1])
    .slice(0, 3)
    .map(([mood]) => mood);

  topMoodArea.innerHTML = topMoods.map((mood) => `<span>${mood}</span>`).join("");
}

function CroakleRenderAll() {
  CroakleRenderTrackHeader();
  CroakleRenderTrackList();
  CroakleRenderBestList();
  CroakleRenderMoodCalendar();
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
