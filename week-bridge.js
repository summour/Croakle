const CroakleWeekBridgeSettingsKey = "CroakleHabitMoodSettingsV1";
const CroakleWeekBridgeOptions = ["monday", "sunday"];

function CroakleWeekBridgeGetSavedWeekStart() {
  try {
    const savedSettings = JSON.parse(localStorage.getItem(CroakleWeekBridgeSettingsKey) || "{}");
    return CroakleWeekBridgeOptions.includes(savedSettings.weekStart) ? savedSettings.weekStart : "monday";
  } catch {
    return "monday";
  }
}

function CroakleNormalizeWeekStartSettings() {
  const savedWeekStart = CroakleWeekBridgeGetSavedWeekStart();

  if (!CroakleWeekBridgeOptions.includes(CroakleSettings.weekStart)) {
    CroakleSettings.weekStart = savedWeekStart;
  }

  CroakleSaveSettings();
}

function CroakleGetWeekStartSetting() {
  return CroakleSettings.weekStart === "sunday" ? "sunday" : "monday";
}

function CroakleGetWeekStartDayIndex() {
  return CroakleGetWeekStartSetting() === "sunday" ? 0 : 1;
}

function CroakleGetOrderedWeekLabels() {
  return CroakleGetWeekStartSetting() === "sunday"
    ? ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
}

function CroakleGetWeekStartFromDate(date) {
  const weekStartIndex = CroakleGetWeekStartDayIndex();
  const dayOffset = -((date.getDay() - weekStartIndex + 7) % 7);
  return CroakleShiftDate(date, dayOffset);
}

function CroakleRenderWeekLabels() {
  const labels = CroakleGetOrderedWeekLabels().map((label) => `<span>${label}</span>`).join("");

  document
    .querySelectorAll('[data-page="track"] .CroakleWeekHeader, [data-page="project"] .CroakleWeekHeader, [data-page="mood"] .CroakleCalendarHeader')
    .forEach((header) => {
      header.innerHTML = labels;
    });
}

function CroaklePatchWeekDateHelpers() {
  CroakleGetWeekDates = function CroakleGetWeekDatesWithWeekStart(anchorDate) {
    const weekStart = CroakleGetWeekStartFromDate(anchorDate);
    return Array.from({ length: 7 }, (_, index) => CroakleShiftDate(weekStart, index));
  };

  CroakleGetWeeksInMonthForBest = function CroakleGetWeeksInMonthForBestWithWeekStart(year, month) {
    const daysInMonth = CroakleGetDaysInMonth(year, month);
    const weekStarts = new Set();

    for (let day = 1; day <= daysInMonth; day += 1) {
      weekStarts.add(CroakleFormatDate(CroakleGetWeekStartFromDate(new Date(year, month, day))));
    }

    return weekStarts.size;
  };

  CroakleProjectGetBaseMonday = function CroakleProjectGetBaseWeekStart() {
    const today = CroakleProjectGetToday();
    const weekStartIndex = CroakleGetWeekStartDayIndex();
    const dayOffset = -((today.getDay() - weekStartIndex + 7) % 7);
    return CroakleProjectShiftDate(today, dayOffset + CroakleProjectWeekOffset * 7);
  };
}

function CroakleCreateWeekStartSettingsPanel() {
  if (document.querySelector("[data-week-start-panel]")) {
    return;
  }

  const lockGroup = document.querySelector('[aria-label="Input lock settings"]');
  const settingsBody = document.querySelector(".CroakleSettingsBody");
  const panel = document.createElement("section");
  panel.className = "CroakleSettingsGroup";
  panel.dataset.weekStartPanel = "true";
  panel.setAttribute("aria-label", "Week start settings");
  panel.innerHTML = `
    <p class="CroakleSettingsGroupTitle">Week Start</p>
    <div class="CroakleExportOptionGroup" role="radiogroup" aria-label="Week first day">
      <p>เริ่มสัปดาห์</p>
      <label class="CroakleExportChoice">
        <input type="radio" name="CroakleWeekStart" value="monday" data-week-start ${CroakleGetWeekStartSetting() === "monday" ? "checked" : ""} />
        <span>
          <strong>Monday first</strong>
          <small>Mo Tu We Th Fr Sa Su</small>
        </span>
      </label>
      <label class="CroakleExportChoice">
        <input type="radio" name="CroakleWeekStart" value="sunday" data-week-start ${CroakleGetWeekStartSetting() === "sunday" ? "checked" : ""} />
        <span>
          <strong>Sunday first</strong>
          <small>Su Mo Tu We Th Fr Sa</small>
        </span>
      </label>
    </div>
  `;

  if (lockGroup) {
    lockGroup.insertAdjacentElement("afterend", panel);
  } else {
    settingsBody?.appendChild(panel);
  }

  CroakleBindWeekStartSettingsControls();
}

function CroakleBindWeekStartSettingsControls() {
  document.querySelectorAll("[data-week-start]").forEach((input) => {
    input.addEventListener("change", CroakleHandleWeekStartChange);
  });
}

function CroakleHandleWeekStartChange(event) {
  if (!CroakleWeekBridgeOptions.includes(event.currentTarget.value)) {
    return;
  }

  CroakleSettings.weekStart = event.currentTarget.value;
  CroakleSaveSettings();
  CroakleApplyWeekStartSystem();
}

function CroaklePatchSettingsPanelForWeekStart() {
  const originalRenderSettingsPanel = CroakleRenderSettingsPanel;

  CroakleRenderSettingsPanel = function CroakleRenderSettingsPanelWithWeekStart() {
    originalRenderSettingsPanel();
    CroakleCreateWeekStartSettingsPanel();
  };
}

function CroakleApplyWeekStartSystem() {
  CroakleRenderAll();
  CroakleRenderProjects();
  CroakleRenderWeekLabels();
}

CroakleNormalizeWeekStartSettings();
CroaklePatchWeekDateHelpers();
CroaklePatchSettingsPanelForWeekStart();
CroakleCreateWeekStartSettingsPanel();
CroakleApplyWeekStartSystem();
