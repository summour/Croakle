const CroakleHabits = [
  {
    name: "Study with Study Bunny",
    current: 6,
    goal: 5,
    days: [false, true, true, true, true, true, true],
  },
  {
    name: "Exercise",
    current: 3,
    goal: 3,
    days: [false, true, false, true, false, true, false],
  },
  {
    name: "Go to bed before 11pm",
    current: 3,
    goal: 5,
    days: [false, false, true, true, true, false, false],
  },
  {
    name: "Clean room",
    current: 1,
    goal: 1,
    days: [true, false, false, false, false, false, false],
  },
  {
    name: "No fast food",
    current: 3,
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

const CroakleMoodDays = [
  "😐", "🙂", "😄", "🙂", "😎", "🤢", "🤢",
  "😴", "🙂", "😰", "😎", "😎", "😎", "😴",
  "😎", "😬", "😵‍💫", "😢", "😴", "😎", "🙂",
  "😰", "😐", "😐", "😎", "😎", "😡", "😢",
  "😊", "😎", "😴", "😐", "😎", "🙂", "😄",
];

const CroaklePageButtons = document.querySelectorAll("[data-page-target]");
const CroaklePages = document.querySelectorAll("[data-page]");
const CroakleBottomNav = document.querySelector(".CroakleBottomNav");

function CroakleSetPage(pageName) {
  CroaklePages.forEach((page) => {
    page.classList.toggle("CroaklePageActive", page.dataset.page === pageName);
  });

  CroaklePageButtons.forEach((button) => {
    button.classList.toggle("CroakleActiveNav", button.dataset.pageTarget === pageName);
  });

  CroakleBottomNav.hidden = pageName === "menu";
}

function CroakleRenderTrackList() {
  const list = document.querySelector("#CroakleTrackList");

  list.innerHTML = CroakleHabits.map((habit) => {
    const checks = habit.days
      .map((done) => `<span class="${done ? "CroakleCheckDone" : "CroakleCheckEmpty"}">${done ? "✓" : ""}</span>`)
      .join("");

    return `
      <section class="CroakleHabitRow">
        <div class="CroakleHabitTop">
          <span class="CroakleDot" aria-hidden="true"></span>
          <strong>${habit.name}</strong>
          <span class="CroakleGoal">${habit.current}/${habit.goal}</span>
        </div>
        <div class="CroakleCheckGrid">${checks}</div>
      </section>
    `;
  }).join("");
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

  calendar.innerHTML = CroakleMoodDays.map((mood, index) => `
    <button type="button" aria-label="Day ${index + 1}, mood ${mood}">
      <small>${index + 1}</small>
      <span>${mood}</span>
    </button>
  `).join("");
}

CroaklePageButtons.forEach((button) => {
  button.addEventListener("click", () => CroakleSetPage(button.dataset.pageTarget));
});

CroakleRenderTrackList();
CroakleRenderBestList();
CroakleRenderMoodCalendar();
CroakleSetPage("menu");
