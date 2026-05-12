(() => {
  const HabitStoreKey = "CroakleHabitMoodDataCleanV1";
  const SubHabitStoreKey = "CroakleSubHabitDataV1";
  const ExtraKeys = ["subHabits", "subHabitWins", "subHabitNotes"];

  function parseJson(value, fallback = null) {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function isPlainObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function hasExtraData(habit) {
    return ExtraKeys.some((key) => {
      const value = habit?.[key];
      return Array.isArray(value) ? value.length : isPlainObject(value) && Object.keys(value).length;
    });
  }

  function copyExtras(target, source) {
    if (!target || !source) return;

    ExtraKeys.forEach((key) => {
      const value = source[key];
      if (Array.isArray(value) || isPlainObject(value)) {
        target[key] = clone(value);
      }
    });
  }

  function getHabitKey(habit, index) {
    return String(habit?.id || habit?.name || `habit-${index}`);
  }

  function findExtraSource(sources, habit, index) {
    if (!Array.isArray(sources)) return null;

    const id = habit?.id ? String(habit.id) : "";
    const name = habit?.name ? String(habit.name).trim().toLowerCase() : "";

    return sources.find((source) => id && String(source.id || "") === id)
      || sources.find((source) => name && String(source.name || "").trim().toLowerCase() === name)
      || sources[index]
      || null;
  }

  function collectFromHabitList(habits) {
    if (!Array.isArray(habits)) return [];

    return habits
      .map((habit, index) => ({
        id: habit?.id || "",
        name: habit?.name || "",
        key: getHabitKey(habit, index),
        subHabits: Array.isArray(habit?.subHabits) ? clone(habit.subHabits) : [],
        subHabitWins: isPlainObject(habit?.subHabitWins) ? clone(habit.subHabitWins) : {},
        subHabitNotes: isPlainObject(habit?.subHabitNotes) ? clone(habit.subHabitNotes) : {},
      }))
      .filter(hasExtraData);
  }

  function collectSubHabitState() {
    const liveHabits = typeof CroakleState !== "undefined" ? CroakleState?.habitTemplates : [];
    const savedState = parseJson(localStorage.getItem(HabitStoreKey), {});
    const merged = new Map();

    collectFromHabitList(savedState?.habitTemplates).forEach((item) => {
      merged.set(item.key, item);
    });

    collectFromHabitList(liveHabits).forEach((item) => {
      merged.set(item.key, item);
    });

    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      habits: [...merged.values()],
    };
  }

  function saveSubHabitMirror() {
    const subHabitState = collectSubHabitState();
    localStorage.setItem(SubHabitStoreKey, JSON.stringify(subHabitState));
    return subHabitState;
  }

  function getBackupSources(backup = {}) {
    const direct = Array.isArray(backup.subHabitState?.habits) ? backup.subHabitState.habits : [];
    const localStorageMirror = parseJson(backup.localStorage?.[SubHabitStoreKey], {});
    const localStorageHabitState = parseJson(backup.localStorage?.[HabitStoreKey], {});
    const state = backup.state || {};

    return [
      ...collectFromHabitList(state.habitTemplates),
      ...collectFromHabitList(localStorageHabitState.habitTemplates),
      ...direct,
      ...(Array.isArray(localStorageMirror?.habits) ? localStorageMirror.habits : []),
    ].filter(hasExtraData);
  }

  function applyExtrasToState(state, sources) {
    if (!state || !Array.isArray(sources) || !sources.length) return state;

    if (Array.isArray(state.habitTemplates)) {
      state.habitTemplates.forEach((habit, index) => {
        copyExtras(habit, findExtraSource(sources, habit, index));
      });
    }

    Object.values(state.months || {}).forEach((monthData) => {
      if (!Array.isArray(monthData?.habits)) return;

      monthData.habits.forEach((habit, index) => {
        const source = findExtraSource(sources, habit, index)
          || findExtraSource(state.habitTemplates, habit, index);
        copyExtras(habit, source);
      });
    });

    return state;
  }

  function restoreSubHabitData(backup = {}) {
    const sources = getBackupSources(backup);
    if (!sources.length) return;

    const savedState = parseJson(localStorage.getItem(HabitStoreKey), {});
    applyExtrasToState(savedState, sources);
    localStorage.setItem(HabitStoreKey, JSON.stringify(savedState));

    if (typeof CroakleState !== "undefined") {
      applyExtrasToState(CroakleState, sources);
    }

    localStorage.setItem(SubHabitStoreKey, JSON.stringify({
      version: 1,
      importedAt: new Date().toISOString(),
      habits: sources,
    }));
  }

  function patchBackupCreation() {
    if (window.CroakleSubHabitBackupCreationPatched || typeof window.CroakleCreateFullBackupData !== "function") return;

    window.CroakleSubHabitBackupCreationPatched = true;
    const originalCreateFullBackupData = window.CroakleCreateFullBackupData;

    window.CroakleCreateFullBackupData = function CroakleCreateFullBackupDataWithSubHabits(...args) {
      const backup = originalCreateFullBackupData.apply(this, args);
      const subHabitState = saveSubHabitMirror();

      backup.subHabitState = subHabitState;
      backup.version = Math.max(Number(backup.version || 1), 4);
      backup.localStorage = {
        ...(backup.localStorage || {}),
        [SubHabitStoreKey]: JSON.stringify(subHabitState),
      };

      if (backup.state) {
        applyExtrasToState(backup.state, subHabitState.habits);
      }

      return backup;
    };
  }

  function patchBackupRestore() {
    if (window.CroakleSubHabitBackupRestorePatched || typeof window.CroakleRestoreBackup !== "function") return;

    window.CroakleSubHabitBackupRestorePatched = true;
    const originalRestoreBackup = window.CroakleRestoreBackup;

    window.CroakleRestoreBackup = function CroakleRestoreBackupWithSubHabits(backup) {
      const sources = getBackupSources(backup);

      if (backup?.state && sources.length) {
        applyExtrasToState(backup.state, sources);
      }

      if (backup?.localStorage?.[HabitStoreKey] && sources.length) {
        const localStorageHabitState = parseJson(backup.localStorage[HabitStoreKey], {});
        applyExtrasToState(localStorageHabitState, sources);
        backup.localStorage[HabitStoreKey] = JSON.stringify(localStorageHabitState);
      }

      const result = originalRestoreBackup.apply(this, arguments);
      restoreSubHabitData(backup);
      return result;
    };
  }

  function patchSaveState() {
    if (window.CroakleSubHabitSavePatched || typeof window.CroakleSaveState !== "function") return;

    window.CroakleSubHabitSavePatched = true;
    const originalSaveState = window.CroakleSaveState;

    window.CroakleSaveState = function CroakleSaveStateWithSubHabitMirror(...args) {
      const result = originalSaveState.apply(this, args);
      saveSubHabitMirror();
      return result;
    };
  }

  function init() {
    saveSubHabitMirror();
    patchSaveState();
    patchBackupCreation();
    patchBackupRestore();
  }

  document.addEventListener("click", () => {
    window.requestAnimationFrame(init);
  });
  window.addEventListener("storage", init);
  window.requestAnimationFrame(init);
})();
