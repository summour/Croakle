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
