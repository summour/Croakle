(() => {
  const CroakleImportStoreKey = "CroakleHabitMoodDataCleanV1";
  const CroakleImportSelectors = {
    exportJsonButton: "[data-export-json]",
    importButton: "#CroakleOpenImportHabit",
    fileInput: "#CroakleImportHabitFile",
    status: "#CroakleImportStatus",
  };

  function CroakleImportInit() {
    const exportJsonButton = document.querySelector(CroakleImportSelectors.exportJsonButton);

    if (!exportJsonButton || document.querySelector(CroakleImportSelectors.importButton)) {
      return;
    }

    exportJsonButton.insertAdjacentHTML(
      "afterend",
      `
        <button class="CroakleSettingsActionButton CroakleImportSettingsButton" id="CroakleOpenImportHabit" type="button">
          <span class="CroakleSettingsText">
            <strong>Import JSON / CSV</strong>
            <span>กู้คืนหรือเพิ่มรายการ Habit จากไฟล์</span>
            <span class="CroakleImportStatus" id="CroakleImportStatus" aria-live="polite"></span>
          </span>
          <span class="CroakleSettingsValue">Import</span>
        </button>
        <input class="CroakleImportFileInput" id="CroakleImportHabitFile" type="file" accept=".json,.csv,application/json,text/csv" aria-label="Import habit file" />
      `
    );

    document.querySelector(CroakleImportSelectors.importButton)?.addEventListener("click", CroakleImportOpenFilePicker);
    document.querySelector(CroakleImportSelectors.fileInput)?.addEventListener("change", CroakleImportHandleFileChange);
  }

  function CroakleImportOpenFilePicker() {
    document.querySelector(CroakleImportSelectors.fileInput)?.click();
  }

  async function CroakleImportHandleFileChange(event) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const habits = CroakleImportParseFile(text, file.name);

      if (!habits.length) {
        CroakleImportSetStatus("ไม่พบ habit ในไฟล์");
        return;
      }

      CroakleImportSaveHabits(habits);
      CroakleImportSetStatus(`Imported ${habits.length} habit${habits.length > 1 ? "s" : ""}`);
      window.location.reload();
    } catch (error) {
      CroakleImportSetStatus(error.message || "Import ไม่สำเร็จ");
    } finally {
      input.value = "";
    }
  }

  function CroakleImportParseFile(text, fileName) {
    const cleanText = text.trim();

    if (!cleanText) {
      return [];
    }

    if (fileName.toLowerCase().endsWith(".csv")) {
      return CroakleImportParseCsv(cleanText);
    }

    return CroakleImportParseJson(cleanText);
  }

  function CroakleImportParseJson(text) {
    const data = JSON.parse(text);
    const backupState = data?.state?.habitTemplates ? data.state.habitTemplates : null;
    const source = Array.isArray(data) ? data : backupState || data.habitTemplates || data.habits || [];

    return source.map(CroakleImportNormalizeHabit).filter(Boolean);
  }

  function CroakleImportParseCsv(text) {
    const rows = text.split(/\r?\n/).map((row) => row.trim()).filter(Boolean);

    if (!rows.length) {
      return [];
    }

    const headers = CroakleImportSplitCsvRow(rows[0]).map((header) => header.trim().toLowerCase());
    const hasHeader = headers.some((header) => ["name", "habit", "habit name", "goal", "description", "priority"].includes(header));
    const dataRows = hasHeader ? rows.slice(1) : rows;

    return dataRows
      .map((row) => CroakleImportCsvRowToHabit(row, hasHeader ? headers : []))
      .map(CroakleImportNormalizeHabit)
      .filter(Boolean);
  }

  function CroakleImportCsvRowToHabit(row, headers) {
    const cells = CroakleImportSplitCsvRow(row);

    if (!headers.length) {
      return {
        name: cells[0],
        goal: cells[1],
        description: cells[2],
        priority: cells[3],
      };
    }

    return headers.reduce((habit, header, index) => {
      const key = header === "habit" || header === "habit name" ? "name" : header;
      habit[key] = cells[index];
      return habit;
    }, {});
  }

  function CroakleImportSplitCsvRow(row) {
    const cells = [];
    let cell = "";
    let insideQuote = false;

    for (const char of row) {
      if (char === '"') {
        insideQuote = !insideQuote;
        continue;
      }

      if (char === "," && !insideQuote) {
        cells.push(cell.trim());
        cell = "";
        continue;
      }

      cell += char;
    }

    cells.push(cell.trim());
    return cells;
  }

  function CroakleImportNormalizeHabit(habit) {
    const name = String(habit?.name || "").trim();

    if (!name) {
      return null;
    }

    return {
      id: habit.id || `CroakleHabit${Date.now()}${Math.random().toString(16).slice(2)}`,
      name,
      goal: CroakleImportClampGoal(habit.goal),
      description: String(habit.description || "").trim(),
      priority: ["high", "medium", "low"].includes(habit.priority) ? habit.priority : "medium",
    };
  }

  function CroakleImportClampGoal(goal) {
    const cleanGoal = Number(goal);

    if (!Number.isFinite(cleanGoal)) {
      return 1;
    }

    return Math.min(7, Math.max(1, Math.round(cleanGoal)));
  }

  function CroakleImportSaveHabits(habits) {
    const savedData = localStorage.getItem(CroakleImportStoreKey);
    const state = savedData ? JSON.parse(savedData) : {};

    localStorage.setItem(
      CroakleImportStoreKey,
      JSON.stringify({
        ...state,
        habitTemplates: habits,
        months: {},
      })
    );
  }

  function CroakleImportSetStatus(message) {
    const status = document.querySelector(CroakleImportSelectors.status);

    if (status) {
      status.textContent = message;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", CroakleImportInit);
  } else {
    CroakleImportInit();
  }
})();
