const CroakleHabitStoreKey = "CroakleHabitMoodData";
const CroakleMoodOptions = ["🙂", "😐", "😎", "😴", "😡", "😢", "😰", "😬", "😵‍💫", "🤢", "😊", "😄"];

const CroakleDefaultHabits = [
  {
    name: "Study with Study Bunny",
    goal: 5,
    days: [false, true, true, true, true, true, true],
  },
  {
    name: "Exercise",
    goal: 3,
    days: [false, true, false, true, false, true, false],
  },
  {
    name: "Go to bed before 11pm",
    goal: 5,
    days: [false, false, true, true, true, false, false],
  },
  {
    name: "Clean room",
    goal: 1,
    days: [true, false, false, false, false, false, false],
  },
  {
    name: "No fast food",
    goal: 6,
    days: [false, false, true, false, true, false, true],
  },
];

const CroakleBestHabits = [
  { name: "Chores", percent: 100, month: 12, lifetime: 46 },
  { name: "Study", percent: 80, month: 26, lifetime: 202 },
  { name: "Drink water", percent: 60, month: 2, lifetime: 34 },
  { name: "Exercise", percent: 40, month: 3, lifetime: 74 },
  { name: "Meditate", percent: 34, month: 12, lifetime: 464 },
  { name: "Eat healthy", percent: 30, month: 6, lifetime: 368 },
  { name: "Go to bed early", percent: 25, month: 8, lifetime: 254 },
  { name: "Wash dishes", percent: 20, month: 2, lifetime: 82 },
  { name: "Avoid sweets", percent: 11, month: 4, lifetime: 96 },
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
const CroaklePages = document.querySelectorAll("[data-page]");
const CroakleBottomNav = document.querySelector(".CroakleBottomNav");

function CroakleLoadState() {
  const savedData = localStorage.getItem(CroakleHabitStoreKey);

  if (!savedData) {
    return CroakleCreateDefaultState();
  }

  try {
    return JSON.parse(savedData);
  } catch {
    return CroakleCreateDefaultState();
  }
}

function CroakleCreateDefaultState() {
  return {
    habits: CroakleDefaultHabits.map((habit) => ({ ...habit, days: [...habit.days] })),
    moods: [...CroakleDefaultMoodDays],
  };
}

function CroakleSaveState() {
  localStorage.setItem(CroakleHabitStoreKey, JSON.stringify(CroakleState));
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

function CroakleRenderTrackList() {
  const list = document.querySelector("#CroakleTrackList");

  list.innerHTML = CroakleState.habits.map((habit, habitIndex) => {
    const current = CroakleCountDone(habit.days);
    const checks = habit.days
      .map((done, dayIndex) => `
        <button
          class="CroakleCheckButton ${done ? "CroakleCheckDone" : "CroakleCheckEmpty"}"
          type="button"
          data-habit-index="${habitIndex}"
          data-day-index="${dayIndex}"
          aria-label="${habit.name} day ${dayIndex + 1} ${done ? "done" : "not done"}"
          aria-pressed="${done}"
        >${done ? "✓" : ""}</button>
      `)
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
  const habit = CroakleState.habits[habitIndex];

  habit.days[dayIndex] = !habit.days[dayIndex];
  CroakleSaveState();
  CroakleRenderTrackList();
}

function CroakleRenderBestList() {
  const list = document.querySelector("#CroakleBestList");

  list.innerHTML = CroakleBestHabits.map((habit) => `
    <section class="CroakleBestRow">
      <strong>${habit.name}</strong>
      <div class="CroaklePercentBar CroaklePercent${habit.percent}" aria-label="${habit.percent} percent">
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

  calendar.innerHTML = CroakleState.moods.map((mood, index) => `
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
  const currentMood = CroakleState.moods[moodIndex];
  const nextMoodIndex = (CroakleMoodOptions.indexOf(currentMood) + 1) % CroakleMoodOptions.length;

  CroakleState.moods[moodIndex] = CroakleMoodOptions[nextMoodIndex];
  CroakleSaveState();
  CroakleRenderMoodCalendar();
}

function CroakleRenderTopMoods() {
  const topMoodArea = document.querySelector(".CroakleTopMoodRow div");
  const moodCounts = CroakleState.moods.reduce((counts, mood) => {
    counts[mood] = (counts[mood] || 0) + 1;
    return counts;
  }, {});

  const topMoods = Object.entries(moodCounts)
    .sort((firstMood, secondMood) => secondMood[1] - firstMood[1])
    .slice(0, 3)
    .map(([mood]) => mood);

  topMoodArea.innerHTML = topMoods.map((mood) => `<span>${mood}</span>`).join("");
}

CroaklePageButtons.forEach((button) => {
  button.addEventListener("click", () => CroakleSetPage(button.dataset.pageTarget));
});

CroakleRenderTrackList();
CroakleRenderBestList();
CroakleRenderMoodCalendar();
CroakleSetPage("menu");
