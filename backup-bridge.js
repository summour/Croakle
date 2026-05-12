const CroakleBackupProjectStoreKey = "CroakleProjectDataV1";
const CroakleBackupHabitStoreKey = "CroakleHabitMoodDataCleanV1";
const CroakleBackupSubHabitStoreKey = "CroakleSubHabitDataV1";
const CroakleBackupHabitExtraKeys = ["subHabits", "subHabitWins", "subHabitNotes"];

function CroakleIsPlainBackupObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function CroakleCloneBackupValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function CroakleParseBackupLocalStorageJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function CroakleHabitHasBackupExtras(habit) {
  return CroakleBackupHabitExtraKeys.some((key) => {
    const value = habit?.[key];
    if (Array.isArray(value)) return value.length > 0;
    return CroakleIsPlainBackupObject(value) && Object.keys(value).length > 0;
  });
}

function CroakleGetHabitBackupKey(habit, index) {
  return String(habit?.id || habit?.name || `habit-${index}`);
}

function CroakleCopyHabitExtras(targetHabit, sourceHabit) {
  if (!targetHabit || !sourceHabit) return targetHabit;

  CroakleBackupHabitExtraKeys.forEach((key) => {
    const value = sourceHabit[key];
    if (Array.isArray(value) || CroakleIsPlainBackupObject(value)) {
      targetHabit[key] = CroakleCloneBackupValue(value);
    }
  });

  return targetHabit;
}

function CroakleCollectHabitExtras(habits) {
  if (!Array.isArray(habits)) return [];

  return habits
    .map((habit, index) => ({
      id: habit?.id || "",
      name: habit?.name || "",
      key: CroakleGetHabitBackupKey(habit, index),
      subHabits: Array.isArray(habit?.subHabits) ? CroakleCloneBackupValue(habit.subHabits) : [],
      subHabitWins: CroakleIsPlainBackupObject(habit?.subHabitWins) ? CroakleCloneBackupValue(habit.subHabitWins) : {},
      subHabitNotes: CroakleIsPlainBackupObject(habit?.subHabitNotes) ? CroakleCloneBackupValue(habit.subHabitNotes) : {},
    }))
    .filter(CroakleHabitHasBackupExtras);
}

function CroakleFindHabitBackupSource(sourceHabits, targetHabit, index) {
  if (!Array.isArray(sourceHabits)) return null;

  const targetId = targetHabit?.id ? String(targetHabit.id) : "";
  const targetName = targetHabit?.name ? String(targetHabit.name).trim().toLowerCase() : "";

  return sourceHabits.find((habit) => targetId && String(habit?.id || "") === targetId)
    || sourceHabits.find((habit) => targetName && String(habit?.name || "").trim().toLowerCase() === targetName)
    || sourceHabits[index]
    || null;
}

function CroakleCollectSubHabitBackupState() {
  const savedHabitState = CroakleGetHabitBackupState();
  const liveHabits = typeof CroakleState !== "undefined" ? CroakleState?.habitTemplates : [];
  const savedSubHabitState = CroakleParseBackupLocalStorageJson(CroakleBackupSubHabitStoreKey);
  const merged = new Map();

  [
    ...CroakleCollectHabitExtras(savedHabitState?.habitTemplates),
    ...(Array.isArray(savedSubHabitState?.habits) ? savedSubHabitState.habits : []),
    ...CroakleCollectHabitExtras(liveHabits),
  ].forEach((habit, index) => {
    merged.set(habit.key || CroakleGetHabitBackupKey(habit, index), habit);
  });

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    habits: [...merged.values()].filter(CroakleHabitHasBackupExtras),
  };
}

function CroakleSaveSubHabitBackupMirror() {
  const subHabitState = CroakleCollectSubHabitBackupState();
  localStorage.setItem(CroakleBackupSubHabitStoreKey, JSON.stringify(subHabitState));
  return subHabitState;
}

function CroakleGetSubHabitBackupSources(backup = {}) {
  const localSubHabitState = CroakleParseBackupDataJson(backup.localStorage?.[CroakleBackupSubHabitStoreKey]);
  const localHabitState = CroakleParseBackupDataJson(backup.localStorage?.[CroakleBackupHabitStoreKey]);

  return [
    ...CroakleCollectHabitExtras(backup.state?.habitTemplates),
    ...CroakleCollectHabitExtras(localHabitState?.habitTemplates),
    ...(Array.isArray(backup.subHabitState?.habits) ? backup.subHabitState.habits : []),
    ...(Array.isArray(localSubHabitState?.habits) ? localSubHabitState.habits : []),
  ].filter(CroakleHabitHasBackupExtras);
}

function CroakleApplyHabitExtrasToState(state, sources) {
  if (!state || !Array.isArray(sources) || !sources.length) return state;

  if (Array.isArray(state.habitTemplates)) {
    state.habitTemplates.forEach((habit, index) => {
      CroakleCopyHabitExtras(habit, CroakleFindHabitBackupSource(sources, habit, index));
    });
  }

  Object.entries(state.months || {}).forEach(([monthKey, monthData]) => {
    if (!Array.isArray(monthData?.habits)) return;

    const sourceMonthHabits = state.months?.[monthKey]?.habits || state.habitTemplates;
    monthData.habits.forEach((habit, index) => {
      const sourceHabit = CroakleFindHabitBackupSource(sources, habit, index)
        || CroakleFindHabitBackupSource(sourceMonthHabits, habit, index)
        || CroakleFindHabitBackupSource(state.habitTemplates, habit, index);
      CroakleCopyHabitExtras(habit, sourceHabit);
    });
  });

  return state;
}

function CroakleGetBackupLocalStorage() {
  return Object.fromEntries(
    Object.keys(localStorage)
      .filter((key) => key.startsWith("Croakle"))
      .map((key) => [key, localStorage.getItem(key)])
  );
}

function CroakleParseBackupDataJson(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function CroakleGetProjectBackupState() {
  return CroakleParseBackupLocalStorageJson(CroakleBackupProjectStoreKey);
}

function CroakleGetHabitBackupState() {
  return CroakleParseBackupLocalStorageJson(CroakleBackupHabitStoreKey);
}

function CroaklePreserveHabitExtras(normalizedState, sourceState) {
  if (!normalizedState || !sourceState) return normalizedState;

  const sources = [
    ...CroakleCollectHabitExtras(sourceState.habitTemplates),
    ...Object.values(sourceState.months || {}).flatMap((monthData) => CroakleCollectHabitExtras(monthData?.habits)),
  ];

  return CroakleApplyHabitExtrasToState(normalizedState, sources);
}

function CroakleNormalizeBackupHabitState(state) {
  const sources = [
    ...CroakleCollectHabitExtras(state?.habitTemplates),
    ...Object.values(state?.months || {}).flatMap((monthData) => CroakleCollectHabitExtras(monthData?.habits)),
  ];
  const normalizedState = CroakleNormalizeState(state);
  CroaklePreserveHabitExtras(normalizedState, state);
  return CroakleApplyHabitExtrasToState(normalizedState, sources);
}

function CroakleCreateFullBackupData() {
  const subHabitState = CroakleSaveSubHabitBackupMirror();
  const projectState = typeof CroakleProjectState !== "undefined" ? CroakleProjectState : CroakleGetProjectBackupState();
  const savedHabitState = CroakleGetHabitBackupState();
  const state = savedHabitState ? CroaklePreserveHabitExtras(CroakleState, savedHabitState) : CroakleState;
  const settings = {
    ...CroakleSettings,
    weekStart: CroakleSettings.weekStart === "sunday" ? "sunday" : "monday",
  };

  CroakleApplyHabitExtrasToState(state, subHabitState.habits);

  return {
    app: "Croakle",
    type: "full_backup",
    version: 4,
    exportedAt: new Date().toISOString(),
    state,
    projectState,
    settings,
    subHabitState,
    localStorage: CroakleGetBackupLocalStorage(),
  };
}

function CroakleCreateBackupJson() {
  return CroakleCreateFullBackupData();
}

function CroakleCreateBackupCsv() {
  const backup = CroakleCreateFullBackupData();

  return [
    ["key", "value"],
    ["app", backup.app],
    ["type", backup.type],
    ["version", backup.version],
    ["exportedAt", backup.exportedAt],
    ["state", JSON.stringify(backup.state)],
    ["projectState", JSON.stringify(backup.projectState)],
    ["settings", JSON.stringify(backup.settings)],
    ["subHabitState", JSON.stringify(backup.subHabitState)],
    ["localStorage", JSON.stringify(backup.localStorage)],
  ];
}

function CroakleParseBackupJson(text) {
  const data = JSON.parse(text);

  if (data?.state || data?.localStorage) {
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

  if (!backup.state && !backup.localStorage) {
    throw new Error("ไฟล์ CSV นี้ไม่ใช่ backup ของ Croakle");
  }

  return {
    app: backup.app,
    type: backup.type,
    version: Number(backup.version || 1),
    exportedAt: backup.exportedAt,
    state: backup.state ? JSON.parse(backup.state) : null,
    projectState: backup.projectState ? JSON.parse(backup.projectState) : null,
    settings: backup.settings ? JSON.parse(backup.settings) : CroakleSettings,
    subHabitState: backup.subHabitState ? JSON.parse(backup.subHabitState) : null,
    localStorage: backup.localStorage ? JSON.parse(backup.localStorage) : {},
  };
}

function CroakleRestoreBackup(backup) {
  if (!backup?.state && !backup?.localStorage) {
    throw new Error("ไม่พบข้อมูล backup ของ Croakle");
  }

  const subHabitSources = CroakleGetSubHabitBackupSources(backup);

  Object.entries(backup.localStorage || {}).forEach(([key, value]) => {
    if (key.startsWith("Croakle") && value !== null && value !== undefined) {
      localStorage.setItem(key, String(value));
    }
  });

  if (backup.state) {
    CroakleApplyHabitExtrasToState(backup.state, subHabitSources);
    localStorage.setItem(CroakleHabitStoreKey, JSON.stringify(CroakleNormalizeBackupHabitState(backup.state)));
  }

  if (subHabitSources.length) {
    const restoredHabitState = CroakleParseBackupLocalStorageJson(CroakleHabitStoreKey);
    CroakleApplyHabitExtrasToState(restoredHabitState, subHabitSources);
    localStorage.setItem(CroakleHabitStoreKey, JSON.stringify(restoredHabitState));
    localStorage.setItem(CroakleBackupSubHabitStoreKey, JSON.stringify({
      version: 1,
      importedAt: new Date().toISOString(),
      habits: subHabitSources,
    }));
  }

  if (backup.projectState) {
    localStorage.setItem(CroakleBackupProjectStoreKey, JSON.stringify(backup.projectState));
  }

  if (backup.settings) {
    localStorage.setItem(CroakleSettingsStoreKey, JSON.stringify({
      ...CroakleNormalizeSettings(backup.settings),
      weekStart: backup.settings.weekStart === "sunday" ? "sunday" : "monday",
    }));
  }
}

function CroakleExportSelectedFileWithFullBackup(event) {
  if (CroakleSettings.exportScope !== "backup") {
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();

  if (CroakleSettings.exportFormat === "csv") {
    CroakleExportRowsAsCsv("croakle-full-backup.csv", CroakleCreateBackupCsv());
    return;
  }

  CroakleDownloadFile("croakle-full-backup.json", JSON.stringify(CroakleCreateBackupJson(), null, 2), "application/json;charset=utf-8");
}

function CroakleOpenImportBackupFileWithFullBackup(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
  CroakleOpenImportBackupFile();
}

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-export-selected]")) {
    CroakleExportSelectedFileWithFullBackup(event);
  }

  if (event.target.closest("[data-import-backup]")) {
    CroakleOpenImportBackupFileWithFullBackup(event);
  }
}, true);

window.addEventListener("beforeunload", CroakleSaveSubHabitBackupMirror);
window.requestAnimationFrame(CroakleSaveSubHabitBackupMirror);
