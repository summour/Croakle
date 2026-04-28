const CroakleSettingsStoreKey = "CroakleHabitMoodSettingsV1";

const CroakleDefaultSettings = {
  lockTodayOnly: true,
  moods: {
    1: { label: "Terrible", color: "#f2f2f2" },
    2: { label: "Annoyed", color: "#e8e8e8" },
    3: { label: "Okay", color: "#dddddd" },
    4: { label: "Good", color: "#d2d2d2" },
    5: { label: "Excellent", color: "#c7c7c7" },
  },
};

let CroakleSettings = CroakleLoadSettings();

function CroakleLoadSettings() {
  const savedSettings = localStorage.getItem(CroakleSettingsStoreKey);

  if (!savedSettings) {
    return CroakleCloneSettings(CroakleDefaultSettings);
  }

  try {
    return CroakleNormalizeSettings(JSON.parse(savedSettings));
  } catch {
    return CroakleCloneSettings(CroakleDefaultSettings);
  }
}

function CroakleCloneSettings(settings) {
  return JSON.parse(JSON.stringify(settings));
}

function CroakleNormalizeSettings(settings) {
  const cleanSettings = CroakleCloneSettings(CroakleDefaultSettings);
  cleanSettings.lockTodayOnly = settings?.lockTodayOnly !== false;

  Object.keys(cleanSettings.moods).forEach((moodValue) => {
    cleanSettings.moods[moodValue] = {
      ...cleanSettings.moods[moodValue],
      ...(settings?.moods?.[moodValue] || {}),
    };
  });

  return cleanSettings;
}

function CroakleSaveSettings() {
  localStorage.setItem(CroakleSettingsStoreKey, JSON.stringify(CroakleSettings));
}

function CroakleApplyMoodSettings() {
  Object.entries(CroakleSettings.moods).forEach(([moodValue, mood]) => {
    document.documentElement.style.setProperty(`--CroakleMood${moodValue}Bg`, mood.color);
    document.documentElement.style.setProperty(`--CroakleMood${moodValue}Text`, CroakleGetReadableTextColor(mood.color));
  });
}

function CroakleGetReadableTextColor(hexColor) {
  const cleanColor = String(hexColor || "").replace("#", "");

  if (!/^[0-9a-fA-F]{6}$/.test(cleanColor)) {
    return "#111111";
  }

  const red = parseInt(cleanColor.slice(0, 2), 16);
  const green = parseInt(cleanColor.slice(2, 4), 16);
  const blue = parseInt(cleanColor.slice(4, 6), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness < 145 ? "#ffffff" : "#111111";
}

function CroaklePatchMoodBadgeRenderer() {
  CroakleCreateMoodBadge = function CroakleCreateMoodBadgeWithSettings(mood, extraClass = "", dateIso = "") {
    const levelClass = mood ? `CroakleMoodLevel${mood}` : "CroakleMoodEmpty";
    const moodValueAttr = mood ? ` data-mood-value="${mood}"` : "";

    return `<span class="CroakleMoodBadge ${levelClass}${extraClass}" data-date-iso="${dateIso}"${moodValueAttr} title="${CroakleGetMoodLabel(mood)}">${mood || ""}</span>`;
  };
}

function CroakleRenderSettingsPanel() {
  const settingsBody = document.querySelector(".CroakleSettingsBody");

  if (!settingsBody) {
    return;
  }

  settingsBody.innerHTML = `
    <section class="CroakleSettingsGroup" aria-label="Mood settings">
      <p class="CroakleSettingsGroupTitle">Custom Mood</p>
      <div class="CroakleMoodSettingsList">
        ${Object.entries(CroakleSettings.moods).map(([moodValue, mood]) => `
          <label class="CroakleMoodSettingRow">
            <span class="CroakleMoodNumber CroakleMoodLevel${moodValue}" data-mood-value="${moodValue}">${moodValue}</span>
            <input class="CroakleMoodNameInput" type="text" value="${CroakleEscapeHtml(mood.label)}" data-mood-label="${moodValue}" aria-label="Mood ${moodValue} name" />
            <input class="CroakleMoodColorInput" type="color" value="${mood.color}" data-mood-color="${moodValue}" aria-label="Mood ${moodValue} background color" />
          </label>
        `).join("")}
      </div>
    </section>

    <section class="CroakleSettingsGroup" aria-label="Input lock settings">
      <p class="CroakleSettingsGroupTitle">Lock</p>
      <label class="CroakleSettingsToggleRow">
        <span class="CroakleSettingsText">
          <strong>Today only</strong>
          <span>เปิด = ใส่/แก้ข้อมูลได้เฉพาะวันนี้, ปิด = แก้วันอื่นได้</span>
        </span>
        <input class="CroakleSettingsSwitch" type="checkbox" data-settings-lock ${CroakleSettings.lockTodayOnly ? "checked" : ""} />
      </label>
    </section>

    <section class="CroakleSettingsGroup" aria-label="Export settings">
      <p class="CroakleSettingsGroupTitle">Export & Backup</p>
      <button class="CroakleSettingsActionButton" type="button" data-export-csv>
        <span class="CroakleSettingsText">
          <strong>Export CSV</strong>
          <span>ดาวน์โหลดค่าสถิติ Habit และ Mood</span>
        </span>
        <span class="CroakleSettingsValue">CSV</span>
      </button>

      <button class="CroakleSettingsActionButton" type="button" data-export-json>
        <span class="CroakleSettingsText">
          <strong>Backup JSON</strong>
          <span>สำรองข้อมูลทั้งหมดสำหรับกู้คืนภายหลัง</span>
        </span>
        <span class="CroakleSettingsValue">JSON</span>
      </button>
    </section>
  `;

  CroakleBindSettingsControls();
}

function CroakleBindSettingsControls() {
  document.querySelectorAll("[data-mood-label]").forEach((input) => {
    input.addEventListener("change", CroakleHandleMoodLabelChange);
  });

  document.querySelectorAll("[data-mood-color]").forEach((input) => {
    input.addEventListener("input", CroakleHandleMoodColorChange);
    input.addEventListener("change", CroakleHandleMoodColorChange);
  });

  document.querySelector("[data-settings-lock]")?.addEventListener("change", CroakleHandleLockChange);
  document.querySelector("[data-export-csv]")?.addEventListener("click", CroakleExportStatsCsv);
  document.querySelector("[data-export-json]")?.addEventListener("click", CroakleExportBackupJson);
}

function CroakleHandleMoodLabelChange(event) {
  const moodValue = event.currentTarget.dataset.moodLabel;
  const nextLabel = event.currentTarget.value.trim() || CroakleDefaultSettings.moods[moodValue].label;

  CroakleSettings.moods[moodValue].label = nextLabel;
  CroakleSaveSettings();
  CroakleRenderAll();
}

function CroakleHandleMoodColorChange(event) {
  const moodValue = event.currentTarget.dataset.moodColor;

  CroakleSettings.moods[moodValue].color = event.currentTarget.value;
  CroakleSaveSettings();
  CroakleApplyMoodSettings();
}

function CroakleHandleLockChange(event) {
  CroakleSettings.lockTodayOnly = event.currentTarget.checked;
  CroakleSaveSettings();
}

function CroakleEscapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function CroakleIsTodayInputAllowed(dateIso) {
  if (!CroakleSettings.lockTodayOnly) {
    return true;
  }

  return dateIso === CroakleFormatDate(CroakleGetToday());
}

function CroakleNotifyLockedInput() {
  window.alert("ล็อกไว้ให้แก้ได้เฉพาะวันนี้ ปิด Lock ใน Settings หากต้องการแก้วันอื่น");
}

function CroaklePatchMoodLabels() {
  const originalGetMoodLabel = CroakleGetMoodLabel;

  CroakleGetMoodLabel = function CroakleGetCustomMoodLabel(value) {
    return CroakleSettings.moods[value]?.label || originalGetMoodLabel(value);
  };
}

function CroaklePatchInputLock() {
  const originalToggleHabitDay = CroakleToggleHabitDay;
  const originalCycleMood = CroakleCycleMood;

  CroakleToggleHabitDay = function CroakleToggleHabitDayWithLock(event) {
    if (!CroakleIsTodayInputAllowed(event.currentTarget.dataset.dateIso)) {
      CroakleNotifyLockedInput();
      return;
    }

    originalToggleHabitDay(event);
  };

  CroakleCycleMood = function CroakleCycleMoodWithLock(event) {
    if (!CroakleIsTodayInputAllowed(event.currentTarget.dataset.dateIso)) {
      CroakleNotifyLockedInput();
      return;
    }

    originalCycleMood(event);
  };
}

function CroakleApplySettingsNavigation() {
  const originalSetPage = CroakleSetPage;
  const settingsButton = document.querySelector(".CroakleRoundButton");
  const bottomNav = document.querySelector(".CroakleBottomNav");

  CroakleSetPage = function CroakleSetPageWithSettings(pageName) {
    originalSetPage(pageName);

    if (bottomNav) {
      bottomNav.hidden = pageName === "menu" || pageName === "settings";
    }
  };

  if (settingsButton) {
    settingsButton.setAttribute("aria-label", "เปิด Settings");
    settingsButton.addEventListener("click", () => CroakleSetPage("settings"));
  }
}

function CroakleCreateStatsRows() {
  const rows = [[
    "type",
    "month",
    "date",
    "habit",
    "goal_per_week",
    "done_count",
    "monthly_goal_total",
    "monthly_goal_percent",
    "lifetime_done",
    "mood_value",
    "mood_label",
  ]];

  Object.entries(CroakleState.months).forEach(([monthKey, monthData]) => {
    const [year, monthNumber] = monthKey.split("-").map(Number);
    const monthIndex = monthNumber - 1;

    monthData.habits.forEach((habit, habitIndex) => {
      const doneCount = CroakleCountDone(habit.days);
      const monthlyGoalTotal = typeof CroakleGetMonthlyGoalTotal === "function"
        ? CroakleGetMonthlyGoalTotal(habit, year, monthIndex)
        : habit.days.length;
      const percent = typeof CroakleCalculateMonthlyGoalPercent === "function"
        ? CroakleCalculateMonthlyGoalPercent(doneCount, monthlyGoalTotal)
        : Math.round((doneCount / habit.days.length) * 100);
      const lifetimeDone = typeof CroakleGetHabitLifetimeDone === "function"
        ? CroakleGetHabitLifetimeDone(habitIndex)
        : habit.lifetime + doneCount;

      rows.push([
        "habit_summary",
        monthKey,
        "",
        habit.name,
        habit.goal,
        doneCount,
        monthlyGoalTotal,
        percent,
        lifetimeDone,
        "",
        "",
      ]);
    });

    monthData.moods.forEach((moodValue, dayIndex) => {
      const date = `${monthKey}-${String(dayIndex + 1).padStart(2, "0")}`;

      rows.push([
        "mood_day",
        monthKey,
        date,
        "",
        "",
        "",
        "",
        "",
        "",
        moodValue || "",
        moodValue ? CroakleGetMoodLabel(moodValue) : "",
      ]);
    });
  });

  return rows;
}

function CroakleExportStatsCsv() {
  const csv = CroakleCreateStatsRows()
    .map((row) => row.map(CroakleCsvCell).join(","))
    .join("\n");

  CroakleDownloadFile("croakle-statistics.csv", csv, "text/csv;charset=utf-8");
}

function CroakleExportBackupJson() {
  const backup = {
    app: "Croakle",
    exportedAt: new Date().toISOString(),
    state: CroakleState,
    settings: CroakleSettings,
  };

  CroakleDownloadFile("croakle-backup.json", JSON.stringify(backup, null, 2), "application/json;charset=utf-8");
}

function CroakleCsvCell(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function CroakleDownloadFile(fileName, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

CroakleApplyMoodSettings();
CroaklePatchMoodBadgeRenderer();
CroaklePatchMoodLabels();
CroaklePatchInputLock();
CroakleApplySettingsNavigation();
CroakleRenderSettingsPanel();
CroakleRenderAll();
