const CroakleBackupProjectStoreKey = "CroakleProjectDataV1";

function CroakleGetBackupLocalStorage() {
  return Object.fromEntries(
    Object.keys(localStorage)
      .filter((key) => key.startsWith("Croakle"))
      .map((key) => [key, localStorage.getItem(key)])
  );
}

function CroakleGetProjectBackupState() {
  try {
    return JSON.parse(localStorage.getItem(CroakleBackupProjectStoreKey) || "null");
  } catch {
    return null;
  }
}

function CroakleCreateFullBackupData() {
  const projectState = typeof CroakleProjectState !== "undefined" ? CroakleProjectState : CroakleGetProjectBackupState();
  const settings = {
    ...CroakleSettings,
    weekStart: CroakleSettings.weekStart === "sunday" ? "sunday" : "monday",
  };

  return {
    app: "Croakle",
    type: "full_backup",
    version: 2,
    exportedAt: new Date().toISOString(),
    state: CroakleState,
    projectState,
    settings,
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
    localStorage: backup.localStorage ? JSON.parse(backup.localStorage) : {},
  };
}

function CroakleRestoreBackup(backup) {
  if (!backup?.state && !backup?.localStorage) {
    throw new Error("ไม่พบข้อมูล backup ของ Croakle");
  }

  Object.entries(backup.localStorage || {}).forEach(([key, value]) => {
    if (key.startsWith("Croakle") && value !== null && value !== undefined) {
      localStorage.setItem(key, String(value));
    }
  });

  if (backup.state) {
    localStorage.setItem(CroakleHabitStoreKey, JSON.stringify(CroakleNormalizeState(backup.state)));
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
