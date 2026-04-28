function CroakleGetWeeksInMonth(year, month) {
  const daysInMonth = CroakleGetDaysInMonth(year, month);
  const weekStarts = new Set();

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const weekStart = CroakleShiftDate(date, -((date.getDay() + 6) % 7));
    weekStarts.add(CroakleFormatDate(weekStart));
  }

  return weekStarts.size;
}

function CroakleGetHabitLifetimeDone(habitIndex) {
  return Object.values(CroakleState.months).reduce((total, monthData) => {
    const habit = monthData.habits[habitIndex];
    return total + (habit ? CroakleCountDone(habit.days) : 0);
  }, 0);
}

function CroakleGetMonthlyGoalTotal(habit, year, month) {
  return CroakleGetWeeksInMonth(year, month) * CroakleClampGoal(habit.goal);
}

function CroakleCalculateMonthlyGoalPercent(doneCount, monthlyGoalTotal) {
  if (!monthlyGoalTotal) {
    return 0;
  }

  return Math.min(100, Math.round((doneCount / monthlyGoalTotal) * 100));
}

function CroakleRenderBestList() {
  const list = document.querySelector("#CroakleBestList");
  const year = CroakleState.bestYear;
  const month = CroakleState.bestMonth;
  const monthData = CroakleGetMonthData(year, month);
  const rows = monthData.habits
    .map((habit, habitIndex) => {
      const doneCount = CroakleCountDone(habit.days);
      const monthlyGoalTotal = CroakleGetMonthlyGoalTotal(habit, year, month);
      const percent = CroakleCalculateMonthlyGoalPercent(doneCount, monthlyGoalTotal);

      return {
        name: habit.name,
        percent,
        month: doneCount,
        lifetime: CroakleGetHabitLifetimeDone(habitIndex),
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

CroakleRenderBestList();
