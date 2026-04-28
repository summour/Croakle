const CroakleSettingsStoreKey = "CroakleHabitMoodSettingsV1";

const CroakleDefaultSettings = {
  lockTodayOnly: true,
  exportScope: "stats",
  exportFormat: "csv",
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
  cleanSettings.exportScope = ["stats", "backup"].includes(settings?.exportScope) ? settings.exportScope : cleanSettings.exportScope;
  cleanSettings.exportFormat = ["csv", "json"].includes(settings?.exportFormat) ? settings.exportFormat : cleanSettings.exportFormat;

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

    <section class="CroakleSettingsGroup" aria-label="Export and backup settings">
      <p class="CroakleSettingsGroupTitle">Export & Backup</p>

      <div class="CroakleExportPanel" aria-label="Export options">
        <div class="CroakleExportOptionGroup" role="radiogroup" aria-label="Export content">
          <p>เลือกข้อมูล</p>
          <label class="CroakleExportChoice">
            <input type="radio" name="CroakleExportScope" value="stats" data-export-scope ${CroakleSettings.exportScope === "stats" ? "checked" : ""} />
            <span>
              <strong>Statistics only</strong>
              <small>เฉพาะสถิติ Habit และ Mood</small>
            </span>
          </label>
          <label class="CroakleExportChoice">
            <input type="radio" name="CroakleExportScope" value="backup" data-export-scope ${CroakleSettings.exportScope === "backup" ? "checked" : ""} />
            <span>
              <strong>Full backup</strong>
              <small>ข้อมูลทั้งหมดในแอพสำหรับกู้คืน</small>
            </span>
          </label>
        </div>

        <div class="CroakleExportOptionGroup" role="radiogroup" aria-label="Export file format">
          <p>เลือกไฟล์</p>
          <label class="CroakleExportChoice">
            <input type="radio" name="CroakleExportFormat" value="csv" data-export-format ${CroakleSettings.exportFormat === "csv" ? "checked" : ""} />
            <span>
              <strong>CSV</strong>
              <small>เปิดกับ spreadsheet ได้ง่าย</small>
            </span>
          </label>
          <label class="CroakleExportChoice">
            <input type="radio" name="CroakleExportFormat" value="json" data-export-format ${CroakleSettings.exportFormat === "json" ? "checked" : ""} />
            <span>
              <strong>JSON</strong>
              <small>เหมาะสำหรับ backup / restore</small>
            </span>
          </label>
        </div>

        <button class="CroakleSettingsActionButton CroakleExportPrimaryButton" type="button" data-export-selected>
          <span class="CroakleSettingsText">
            <strong>Export selected file</strong>
            <span>ดาวน์โหลดตามตัวเลือกด้านบน</span>
          </span>
          <span class="CroakleSettingsValue" data-export-selected-label>${CroakleGetExportLabel()}</span>
        </button>
      </div>

      <button class="CroakleSettingsActionButton" type="button" data-import-backup>
        <span class="CroakleSettingsText">
          <strong>Import backup</strong>
          <span>นำเข้าไฟล์ backup CSV / JSON</span>
          <span class="CroakleImportStatus" data-import-status aria-live="polite"></span>
        </span>
        <span class="CroakleSettingsValue">Import</span>
      </button>
      <input class="CroakleImportFileInput" type="file" accept=".json,.csv,application/json,text/csv" data-import-backup-file aria-label="Import backup file" />
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
  document.querySelectorAll("[data-export-scope]").forEach((input) => input.addEventListener("change", CroakleHandleExportOptionChange));
  document.querySelectorAll("[data-export-format]").forEach((input) => input.addEventListener("change", CroakleHandleExportOptionChange));
  document.querySelector("[data-export-selected]")?.addEventListener("click", CroakleExportSelectedFile);
  document.querySelector("[data-import-backup]")?.addEventListener("click", CroakleOpenImportBackupFile);
  document.querySelector("[data-import-backup-file]")?.addEventListener("change", CroakleHandleImportBackupFile);
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

function CroakleHandleExportOptionChange(event) {
  if (event.currentTarget.dataset.exportScope !== undefined) {
    CroakleSettings.exportScope = event.currentTarget.value;
  }

  if (event.currentTarget.dataset.exportFormat !== undefined) {
    CroakleSettings.exportFormat = event.currentTarget.value;
  }

  CroakleSaveSettings();
  CroakleUpdateExportLabel();
}

function CroakleGetExportLabel() {
  return `${CroakleSettings.exportScope === "stats" ? "Stats" : "Backup"} ${CroakleSettings.exportFormat.toUpperCase()}`;
}

function CroakleUpdateExportLabel() {
  const label = document.querySelector("[data-export-selected-label]");

  if (label) {
    label.textContent = CroakleGetExportLabel();
  }
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

function CroakleCreateStatsJson() {
  const rows = CroakleCreateStatsRows();
  const headers = rows[0];

  return {
    app: "Croakle",
    type: "statistics",
    exportedAt: new Date().toISOString(),
    rows: rows.slice(1).map((row) => headers.reduce((item, header, index) => ({ ...item, [header]: row[index] }), {})),
  };
}

function CroakleCreateBackupJson() {
  return {
    app: "Croakle",
    type: "full_backup",
    exportedAt: new Date().toISOString(),
    state: CroakleState,
    settings: CroakleSettings,
  };
}

function CroakleCreateBackupCsv() {
  return [
    ["key", "value"],
    ["app", "Croakle"],
    ["type", "full_backup"],
    ["exportedAt", new Date().toISOString()],
    ["state", JSON.stringify(CroakleState)],
    ["settings", JSON.stringify(CroakleSettings)],
  ];
}

function CroakleExportSelectedFile() {
  const isStats = CroakleSettings.exportScope === "stats";
  const isCsv = CroakleSettings.exportFormat === "csv";

  if (isStats && isCsv) {
    CroakleExportRowsAsCsv("croakle-statistics.csv", CroakleCreateStatsRows());
    return;
  }

  if (isStats) {
    CroakleDownloadFile("croakle-statistics.json", JSON.stringify(CroakleCreateStatsJson(), null, 2), "application/json;charset=utf-8");
    return;
  }

  if (isCsv) {
    CroakleExportRowsAsCsv("croakle-backup.csv", CroakleCreateBackupCsv());
    return;
  }

  CroakleDownloadFile("croakle-backup.json", JSON.stringify(CroakleCreateBackupJson(), null, 2), "application/json;charset=utf-8");
}

function CroakleExportRowsAsCsv(fileName, rows) {
  const csv = rows.map((row) => row.map(CroakleCsvCell).join(",")).join("\n");
  CroakleDownloadFile(fileName, csv, "text/csv;charset=utf-8");
}

function CroakleOpenImportBackupFile() {
  document.querySelector("[data-import-backup-file]")?.click();
}

async function CroakleHandleImportBackupFile(event) {
  const input = event.currentTarget;
  const file = input.files?.[0];

  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const backup = CroakleParseBackupFile(text, file.name);

    CroakleRestoreBackup(backup);
    CroakleSetImportStatus("นำเข้า backup สำเร็จ");
    window.location.reload();
  } catch (error) {
    CroakleSetImportStatus(error.message || "นำเข้า backup ไม่สำเร็จ");
  } finally {
    input.value = "";
  }
}

function CroakleParseBackupFile(text, fileName) {
  const cleanText = text.trim();

  if (!cleanText) {
    throw new Error("ไฟล์ว่าง");
  }

  if (fileName.toLowerCase().endsWith(".csv")) {
    return CroakleParseBackupCsv(cleanText);
  }

  return CroakleParseBackupJson(cleanText);
}

function CroakleParseBackupJson(text) {
  const data = JSON.parse(text);

  if (data?.state) {
    return data;
  }

  if (data?.habitTemplates || data?.months) {
    return { state: data, settings: CroakleSettings };
  }

  throw new Error("ไฟล์ JSON นี้ไม่ใช่ backup ของ Croakle");
}

function CroakleParseBackupCsv(text) {
  const rows = text.split(/\r?\n/).map(CroakleSplitCsvRow).filter((row) => row.length >= 2);
  const backup = rows.reduce((data, row) => ({ ...data, [row[0]]: row[1] }), {});

  if (!backup.state) {
    throw new Error("ไฟล์ CSV นี้ไม่ใช่ backup ของ Croakle");
  }

  return {
    app: backup.app,
    type: backup.type,
    exportedAt: backup.exportedAt,
    state: JSON.parse(backup.state),
    settings: backup.settings ? JSON.parse(backup.settings) : CroakleSettings,
  };
}

function CroakleRestoreBackup(backup) {
  if (!backup?.state) {
    throw new Error("ไม่พบข้อมูล state ใน backup");
  }

  const nextState = CroakleNormalizeState(backup.state);
  const nextSettings = backup.settings ? CroakleNormalizeSettings(backup.settings) : CroakleSettings;

  localStorage.setItem(CroakleHabitStoreKey, JSON.stringify(nextState));
  localStorage.setItem(CroakleSettingsStoreKey, JSON.stringify(nextSettings));
}

function CroakleSetImportStatus(message) {
  const status = document.querySelector("[data-import-status]");

  if (status) {
    status.textContent = message;
  }
}

function CroakleCsvCell(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function CroakleSplitCsvRow(row) {
  const cells = [];
  let cell = "";
  let insideQuote = false;

  for (let index = 0; index < row.length; index += 1) {
    const char = row[index];
    const nextChar = row[index + 1];

    if (char === '"' && nextChar === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      insideQuote = !insideQuote;
      continue;
    }

    if (char === "," && !insideQuote) {
      cells.push(cell);
      cell = "";
      continue;
    }

    cell += char;
  }

  cells.push(cell);
  return cells;
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
