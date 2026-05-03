(() => {
  const CroakleAiSettingsStoreKey = "CroakleAiSettingsV1";
  const CroakleActivityLogStoreKey = "CroakleActivityLogV1";
  const CroakleActivityLogLimit = 250;
  const CroakleDefaultAiSettings = {
    provider: "gemini",
    model: "gemini-2.5-flash",
    apiKey: "",
  };

  let CroakleAiKeyEditMode = false;
  let CroakleActivityLogOpen = false;

  function CroakleLoadAiSettings() {
    try {
      return {
        ...CroakleDefaultAiSettings,
        ...JSON.parse(localStorage.getItem(CroakleAiSettingsStoreKey) || "{}"),
      };
    } catch {
      return { ...CroakleDefaultAiSettings };
    }
  }

  function CroakleSaveAiSettings(settings) {
    localStorage.setItem(CroakleAiSettingsStoreKey, JSON.stringify(settings));
  }

  function CroakleLoadActivityLogs() {
    try {
      const logs = JSON.parse(localStorage.getItem(CroakleActivityLogStoreKey) || "[]");
      return Array.isArray(logs) ? logs : [];
    } catch {
      return [];
    }
  }

  function CroakleSaveActivityLogs(logs) {
    localStorage.setItem(CroakleActivityLogStoreKey, JSON.stringify(logs.slice(0, CroakleActivityLogLimit)));
  }

  function CroakleAddActivityLog(entry) {
    if (!entry?.type || !entry?.targetType) {
      return;
    }

    const logs = CroakleLoadActivityLogs();
    const nextLog = {
      id: entry.id || `CroakleActivity${Date.now()}${Math.random().toString(16).slice(2)}`,
      type: entry.type,
      targetType: entry.targetType,
      targetId: entry.targetId || "",
      targetName: entry.targetName || "Untitled",
      message: entry.message || "",
      createdAt: entry.createdAt || new Date().toISOString(),
      meta: entry.meta || {},
    };

    CroakleSaveActivityLogs([nextLog, ...logs]);
    CroakleRenderActivityLogPanel();
  }

  function CroakleReadJsonStore(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  }

  function CroaklePatchStateLoggers() {
    CroaklePatchHabitStateLogger();
    CroaklePatchProjectStateLogger();
  }

  function CroaklePatchHabitStateLogger() {
    if (window.CroakleHabitActivityLogPatched || typeof CroakleSaveState !== "function") {
      return;
    }

    window.CroakleHabitActivityLogPatched = true;
    const originalSaveState = CroakleSaveState;

    CroakleSaveState = function CroakleSaveStateWithActivityLog() {
      const beforeState = CroakleReadJsonStore(CroakleHabitStoreKey, null);
      originalSaveState();
      CroakleRecordHabitChanges(beforeState, CroakleState);
    };
  }

  function CroaklePatchProjectStateLogger() {
    if (window.CroakleProjectActivityLogPatched || typeof CroakleSaveProjectState !== "function") {
      return;
    }

    window.CroakleProjectActivityLogPatched = true;
    const originalSaveProjectState = CroakleSaveProjectState;

    CroakleSaveProjectState = function CroakleSaveProjectStateWithActivityLog() {
      const beforeState = CroakleReadJsonStore(CroakleProjectStoreKey, null);
      originalSaveProjectState();
      CroakleRecordProjectChanges(beforeState, CroakleProjectState);
    };
  }

  function CroakleRecordHabitChanges(beforeState, afterState) {
    if (!beforeState || !afterState) {
      return;
    }

    CroakleRecordTemplateChanges("habit", beforeState.habitTemplates || [], afterState.habitTemplates || []);
    CroakleRecordHabitDayChanges(beforeState, afterState);
    CroakleRecordMoodChanges(beforeState, afterState);
  }

  function CroakleRecordTemplateChanges(targetType, beforeItems, afterItems) {
    const beforeById = new Map(beforeItems.map((item) => [item.id, item]));
    const afterById = new Map(afterItems.map((item) => [item.id, item]));

    afterItems.forEach((item) => {
      const beforeItem = beforeById.get(item.id);

      if (!beforeItem) {
        CroakleAddActivityLog({
          type: "create",
          targetType,
          targetId: item.id,
          targetName: item.name,
          message: `Added ${targetType}: ${item.name}`,
        });
        return;
      }

      if (CroakleIsMeaningfulItemUpdate(beforeItem, item)) {
        CroakleAddActivityLog({
          type: "update",
          targetType,
          targetId: item.id,
          targetName: item.name,
          message: `Updated ${targetType}: ${item.name}`,
          meta: { before: CroaklePickLogFields(beforeItem), after: CroaklePickLogFields(item) },
        });
      }
    });

    beforeItems.forEach((item) => {
      if (!afterById.has(item.id)) {
        CroakleAddActivityLog({
          type: "delete",
          targetType,
          targetId: item.id,
          targetName: item.name,
          message: `Deleted ${targetType}: ${item.name}`,
        });
      }
    });
  }

  function CroakleIsMeaningfulItemUpdate(beforeItem, afterItem) {
    return beforeItem.name !== afterItem.name
      || Number(beforeItem.goal) !== Number(afterItem.goal)
      || String(beforeItem.description || "") !== String(afterItem.description || "")
      || String(beforeItem.priority || "") !== String(afterItem.priority || "");
  }

  function CroaklePickLogFields(item) {
    return {
      name: item.name,
      goal: item.goal,
      description: item.description || "",
      priority: item.priority || "",
    };
  }

  function CroakleRecordHabitDayChanges(beforeState, afterState) {
    Object.entries(afterState.months || {}).forEach(([monthKey, afterMonth]) => {
      const beforeMonth = beforeState.months?.[monthKey];

      if (!beforeMonth) {
        return;
      }

      afterMonth.habits?.forEach((afterHabit, habitIndex) => {
        const beforeHabit = beforeMonth.habits?.[habitIndex];

        if (!beforeHabit) {
          return;
        }

        afterHabit.days?.forEach((afterDone, dayIndex) => {
          const beforeDone = Boolean(beforeHabit.days?.[dayIndex]);

          if (Boolean(afterDone) === beforeDone) {
            return;
          }

          const dateIso = `${monthKey}-${String(dayIndex + 1).padStart(2, "0")}`;
          CroakleAddActivityLog({
            type: afterDone ? "complete" : "update",
            targetType: "habit",
            targetId: afterHabit.id,
            targetName: afterHabit.name,
            message: `${afterDone ? "Checked" : "Unchecked"} habit: ${afterHabit.name}`,
            meta: { dateIso, done: Boolean(afterDone) },
          });
        });
      });
    });
  }

  function CroakleRecordMoodChanges(beforeState, afterState) {
    Object.entries(afterState.months || {}).forEach(([monthKey, afterMonth]) => {
      const beforeMonth = beforeState.months?.[monthKey];

      if (!beforeMonth) {
        return;
      }

      afterMonth.moods?.forEach((afterMood, dayIndex) => {
        const beforeMood = beforeMonth.moods?.[dayIndex] || null;

        if ((afterMood || null) === beforeMood) {
          return;
        }

        const dateIso = `${monthKey}-${String(dayIndex + 1).padStart(2, "0")}`;
        CroakleAddActivityLog({
          type: "update",
          targetType: "mood",
          targetId: dateIso,
          targetName: dateIso,
          message: `Updated mood: ${dateIso}`,
          meta: { dateIso, before: beforeMood, after: afterMood || null },
        });
      });
    });
  }

  function CroakleRecordProjectChanges(beforeState, afterState) {
    if (!beforeState || !afterState) {
      return;
    }

    CroakleRecordTemplateChanges("project", beforeState.projects || [], afterState.projects || []);
    CroakleRecordProjectStatusChanges(beforeState.projects || [], afterState.projects || []);
    CroakleRecordProjectDayChanges(beforeState.projects || [], afterState.projects || []);
  }

  function CroakleRecordProjectStatusChanges(beforeProjects, afterProjects) {
    const beforeById = new Map(beforeProjects.map((project) => [project.id, project]));

    afterProjects.forEach((project) => {
      const beforeProject = beforeById.get(project.id);

      if (!beforeProject || Boolean(beforeProject.completed) === Boolean(project.completed)) {
        return;
      }

      CroakleAddActivityLog({
        type: project.completed ? "complete" : "update",
        targetType: "project",
        targetId: project.id,
        targetName: project.name,
        message: `${project.completed ? "Completed" : "Reopened"} project: ${project.name}`,
        meta: { completedWeekKey: project.completedWeekKey || "" },
      });
    });
  }

  function CroakleRecordProjectDayChanges(beforeProjects, afterProjects) {
    const beforeById = new Map(beforeProjects.map((project) => [project.id, project]));

    afterProjects.forEach((project) => {
      const beforeProject = beforeById.get(project.id);

      if (!beforeProject) {
        return;
      }

      Object.entries(project.weeklyDays || {}).forEach(([weekKey, afterDays]) => {
        const beforeDays = beforeProject.weeklyDays?.[weekKey] || [];

        afterDays.forEach((afterDone, dayIndex) => {
          const beforeDone = Boolean(beforeDays[dayIndex]);

          if (Boolean(afterDone) === beforeDone) {
            return;
          }

          CroakleAddActivityLog({
            type: afterDone ? "complete" : "update",
            targetType: "project",
            targetId: project.id,
            targetName: project.name,
            message: `${afterDone ? "Checked" : "Unchecked"} project: ${project.name}`,
            meta: { weekKey, dayIndex, done: Boolean(afterDone) },
          });
        });
      });
    });
  }

  function CroakleInjectAiSettingsStyles() {
    if (document.querySelector("#CroakleAiSettingsStyles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "CroakleAiSettingsStyles";
    style.textContent = `
      .CroakleAiSettingsField {
        display: grid;
        gap: 8px;
      }

      .CroakleAiSettingsField span,
      .CroakleAiSettingsNote,
      .CroakleAiSettingsStatus,
      .CroakleActivityLogMeta,
      .CroakleActivityLogEmpty {
        color: var(--CroakleMuted);
        font-size: 13px;
        font-weight: 850;
        line-height: 1.35;
      }

      .CroakleAiSettingsNote,
      .CroakleActivityLogPanel {
        margin: 0;
        border: 2px solid var(--CroakleSoftLine, #e7e7e7);
        border-radius: 16px;
        background: var(--CroakleSoftSurface, #f6f6f6);
        padding: 12px;
      }

      .CroakleAiSettingsStatus {
        margin: -2px 0 0;
      }

      .CroakleAiSettingsInput,
      .CroakleAiSettingsSelect,
      .CroakleAiSettingsLockedKey {
        width: 100%;
        min-height: 48px;
        border: 2px solid var(--CroakleLine);
        border-radius: 16px;
        background: var(--CroakleSurface);
        color: var(--CroakleText);
        font: inherit;
        font-size: 15px;
        font-weight: 800;
        padding: 0 12px;
        outline: none;
        opacity: 1;
        -webkit-text-fill-color: var(--CroakleText);
      }

      .CroakleAiSettingsInput,
      .CroakleAiSettingsSelect {
        pointer-events: auto;
      }

      .CroakleAiSettingsInput:focus,
      .CroakleAiSettingsSelect:focus {
        box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
      }

      .CroakleAiSettingsLockedKey {
        display: flex;
        align-items: center;
        background: var(--CroakleSoftSurface, #f6f6f6);
        color: var(--CroakleMuted);
        user-select: none;
        -webkit-user-select: none;
        pointer-events: none;
      }

      .CroakleAiSettingsActions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .CroakleActivityLogPanel,
      .CroakleActivityLogList,
      .CroakleActivityLogDateGroup {
        display: grid;
        gap: 10px;
      }

      .CroakleActivityLogSummary {
        margin: 0;
        color: var(--CroakleMuted);
        font-size: 13px;
        font-weight: 800;
        line-height: 1.35;
      }

      .CroakleActivityLogEntryButton,
      .CroakleActivityLogBackButton {
        width: 100%;
        border: 2px solid var(--CroakleLine);
        border-radius: 16px;
        background: var(--CroakleSurface);
        color: var(--CroakleText);
        font: inherit;
        text-align: left;
        cursor: pointer;
        touch-action: manipulation;
      }

      .CroakleActivityLogEntryButton {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 10px;
        align-items: center;
        padding: 12px;
      }

      .CroakleActivityLogEntryText,
      .CroakleActivityLogEntryMeta {
        display: grid;
        gap: 3px;
        min-width: 0;
      }

      .CroakleActivityLogEntryText strong {
        color: var(--CroakleText);
        font-size: 15px;
        font-weight: 900;
        line-height: 1.2;
      }

      .CroakleActivityLogEntryText span,
      .CroakleActivityLogEntryMeta span {
        color: var(--CroakleMuted);
        font-size: 12px;
        font-weight: 850;
        line-height: 1.25;
      }

      .CroakleActivityLogEntryArrow {
        color: var(--CroakleText);
        font-size: 22px;
        font-weight: 900;
        line-height: 1;
      }

      .CroakleActivityLogHeader {
        display: grid;
        gap: 10px;
      }

      .CroakleActivityLogBackButton {
        min-height: 44px;
        padding: 0 12px;
        font-size: 14px;
        font-weight: 900;
      }

      .CroakleActivityLogDateTitle {
        margin: 4px 0 0;
        color: var(--CroakleMuted);
        font-size: 12px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .CroakleActivityLogItem {
        border: 2px solid var(--CroakleLine);
        border-radius: 16px;
        background: var(--CroakleSurface);
        padding: 11px 12px;
      }

      .CroakleActivityLogMessage {
        margin: 0;
        color: var(--CroakleText);
        font-size: 15px;
        font-weight: 900;
        line-height: 1.25;
      }

      .CroakleActivityLogMeta,
      .CroakleActivityLogEmpty {
        margin: 4px 0 0;
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleGetAiKeyMarkup(settings) {
    if (!settings.apiKey || CroakleAiKeyEditMode) {
      return `
        <label class="CroakleAiSettingsField">
          <span>Gemini API Key</span>
          <input class="CroakleAiSettingsInput" type="password" inputmode="text" autocomplete="new-password" autocapitalize="off" spellcheck="false" placeholder="Paste Gemini API key" value="" data-croakle-ai-api-key />
        </label>
        <p class="CroakleAiSettingsStatus" data-croakle-ai-status>${settings.apiKey && CroakleAiKeyEditMode ? "Paste a new key, then press Save key. The old key stays until saved." : "No API key saved yet."}</p>
        <div class="CroakleAiSettingsActions">
          <button class="CroakleSettingsActionButton" type="button" data-croakle-ai-save-key>
            <span class="CroakleSettingsText"><strong>Save key</strong><span>บันทึก key ใหม่</span></span>
            <span class="CroakleSettingsValue">Save</span>
          </button>
          <button class="CroakleSettingsActionButton" type="button" data-croakle-ai-cancel-edit>
            <span class="CroakleSettingsText"><strong>Cancel</strong><span>ยกเลิกการแก้ไข</span></span>
            <span class="CroakleSettingsValue">Cancel</span>
          </button>
        </div>
      `;
    }

    return `
      <label class="CroakleAiSettingsField">
        <span>Gemini API Key</span>
        <div class="CroakleAiSettingsLockedKey" aria-label="Gemini API key saved and hidden">API key saved</div>
      </label>
      <p class="CroakleAiSettingsStatus" data-croakle-ai-status>API key is hidden. It cannot be copied from this screen.</p>
      <div class="CroakleAiSettingsActions">
        <button class="CroakleSettingsActionButton" type="button" data-croakle-ai-replace-key>
          <span class="CroakleSettingsText"><strong>Replace key</strong><span>ใส่ API key ใหม่</span></span>
          <span class="CroakleSettingsValue">Replace</span>
        </button>
        <button class="CroakleSettingsActionButton" type="button" data-croakle-ai-clear-key>
          <span class="CroakleSettingsText"><strong>Clear key</strong><span>ลบ key ออกจากเครื่องนี้</span></span>
          <span class="CroakleSettingsValue">Clear</span>
        </button>
      </div>
    `;
  }

  function CroakleInsertAiSettingsGroup(settingsBody, markup) {
    const exportBackupGroup = settingsBody.querySelector('[aria-label="Export and backup settings"]');

    if (exportBackupGroup) {
      exportBackupGroup.insertAdjacentHTML("beforebegin", markup);
      return;
    }

    settingsBody.insertAdjacentHTML("beforeend", markup);
  }

  function CroakleRenderAiSettingsPanel() {
    const settingsBody = document.querySelector(".CroakleSettingsBody");

    if (!settingsBody) {
      return;
    }

    document.querySelector("#CroakleAiSettingsGroup")?.remove();

    const settings = CroakleLoadAiSettings();
    CroakleInjectAiSettingsStyles();

    CroakleInsertAiSettingsGroup(settingsBody, `
      <section class="CroakleSettingsGroup" id="CroakleAiSettingsGroup" aria-label="Croakle AI settings">
        <p class="CroakleSettingsGroupTitle">Croakle Recap AI</p>
        <p class="CroakleAiSettingsNote">API key จะถูกเก็บเฉพาะในเครื่องนี้ และจะไม่ถูกรวมในไฟล์ backup หากย้ายเครื่องหรือนำเข้า backup ต้องใส่ API key ใหม่</p>

        <label class="CroakleAiSettingsField">
          <span>Provider</span>
          <select class="CroakleAiSettingsSelect" data-croakle-ai-provider>
            <option value="gemini" ${settings.provider === "gemini" ? "selected" : ""}>Gemini</option>
          </select>
        </label>

        <label class="CroakleAiSettingsField">
          <span>Model</span>
          <select class="CroakleAiSettingsSelect" data-croakle-ai-model>
            <option value="gemini-2.5-flash" ${settings.model === "gemini-2.5-flash" ? "selected" : ""}>gemini-2.5-flash</option>
            <option value="gemini-2.0-flash" ${settings.model === "gemini-2.0-flash" ? "selected" : ""}>gemini-2.0-flash</option>
            <option value="gemini-2.0-flash-lite" ${settings.model === "gemini-2.0-flash-lite" ? "selected" : ""}>gemini-2.0-flash-lite</option>
          </select>
        </label>

        ${CroakleGetAiKeyMarkup(settings)}
      </section>
    `);

    CroakleBindAiSettingsControls();
  }

  function CroakleRenderActivityLogPanel() {
    const settingsBody = document.querySelector(".CroakleSettingsBody");

    if (!settingsBody) {
      return;
    }

    document.querySelector("#CroakleActivityLogGroup")?.remove();
    CroakleInjectAiSettingsStyles();

    const logs = CroakleLoadActivityLogs();
    const markup = `
      <section class="CroakleSettingsGroup" id="CroakleActivityLogGroup" aria-label="Activity log">
        <p class="CroakleSettingsGroupTitle">Activity Log</p>
        <div class="CroakleActivityLogPanel">
          ${CroakleActivityLogOpen ? CroakleCreateActivityLogDetailMarkup(logs) : CroakleCreateActivityLogEntryMarkup(logs)}
        </div>
      </section>
    `;
    const exportBackupGroup = settingsBody.querySelector('[aria-label="Export and backup settings"]');

    if (exportBackupGroup) {
      exportBackupGroup.insertAdjacentHTML("afterend", markup);
    } else {
      settingsBody.insertAdjacentHTML("beforeend", markup);
    }

    CroakleBindActivityLogControls();
  }

  function CroakleCreateActivityLogEntryMarkup(logs) {
    const latestLog = logs[0] || null;
    const countLabel = `${logs.length} recent ${logs.length === 1 ? "change" : "changes"}`;
    const latestLabel = latestLog
      ? `${CroakleFormatActivityTime(latestLog.createdAt)} · ${CroakleEscapeActivityText(latestLog.targetType)}`
      : "No activity yet";

    return `
      <button class="CroakleActivityLogEntryButton" type="button" data-croakle-open-activity-log aria-label="Open activity log">
        <span class="CroakleActivityLogEntryText">
          <strong>Activity Log</strong>
          <span>Read-only history of app changes</span>
        </span>
        <span class="CroakleActivityLogEntryMeta" aria-hidden="true">
          <span>${CroakleEscapeActivityText(countLabel)}</span>
          <span>${latestLabel}</span>
        </span>
        <span class="CroakleActivityLogEntryArrow" aria-hidden="true">›</span>
      </button>
    `;
  }

  function CroakleCreateActivityLogDetailMarkup(logs) {
    const visibleLogs = logs.slice(0, 30);

    return `
      <div class="CroakleActivityLogHeader">
        <button class="CroakleActivityLogBackButton" type="button" data-croakle-close-activity-log>‹ Back to Settings</button>
        <p class="CroakleActivityLogSummary">Read-only history of recent create, update, delete, complete, mood, and project changes.</p>
      </div>
      ${visibleLogs.length ? CroakleCreateActivityLogListMarkup(visibleLogs) : "<p class=\"CroakleActivityLogEmpty\">No activity yet.</p>"}
    `;
  }

  function CroakleBindActivityLogControls() {
    document.querySelector("[data-croakle-open-activity-log]")?.addEventListener("click", () => {
      CroakleActivityLogOpen = true;
      CroakleRenderActivityLogPanel();
    });

    document.querySelector("[data-croakle-close-activity-log]")?.addEventListener("click", () => {
      CroakleActivityLogOpen = false;
      CroakleRenderActivityLogPanel();
    });
  }

  function CroakleCreateActivityLogListMarkup(logs) {
    const groups = logs.reduce((items, log) => {
      const dateLabel = CroakleFormatActivityDate(log.createdAt);
      items[dateLabel] = items[dateLabel] || [];
      items[dateLabel].push(log);
      return items;
    }, {});

    return `<div class="CroakleActivityLogList">
      ${Object.entries(groups).map(([dateLabel, items]) => `
        <div class="CroakleActivityLogDateGroup">
          <p class="CroakleActivityLogDateTitle">${dateLabel}</p>
          ${items.map(CroakleCreateActivityLogItemMarkup).join("")}
        </div>
      `).join("")}
    </div>`;
  }

  function CroakleCreateActivityLogItemMarkup(log) {
    return `
      <article class="CroakleActivityLogItem">
        <p class="CroakleActivityLogMessage">${CroakleEscapeActivityText(log.message || CroakleGetActivityFallbackMessage(log))}</p>
        <p class="CroakleActivityLogMeta">${CroakleFormatActivityTime(log.createdAt)} · ${CroakleEscapeActivityText(log.targetType)}</p>
      </article>
    `;
  }

  function CroakleGetActivityFallbackMessage(log) {
    const verb = {
      create: "Added",
      update: "Updated",
      delete: "Deleted",
      complete: "Completed",
    }[log.type] || "Changed";

    return `${verb} ${log.targetType}: ${log.targetName}`;
  }

  function CroakleFormatActivityDate(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function CroakleFormatActivityTime(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Unknown time";
    }

    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }

  function CroakleEscapeActivityText(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function CroakleBindAiSettingsControls() {
    document.querySelector("[data-croakle-ai-provider]")?.addEventListener("change", CroakleHandleAiMetaChange);
    document.querySelector("[data-croakle-ai-model]")?.addEventListener("change", CroakleHandleAiMetaChange);
    document.querySelector("[data-croakle-ai-save-key]")?.addEventListener("click", CroakleSaveNewAiKey);
    document.querySelector("[data-croakle-ai-replace-key]")?.addEventListener("click", CroakleStartAiKeyReplace);
    document.querySelector("[data-croakle-ai-cancel-edit]")?.addEventListener("click", CroakleCancelAiKeyEdit);
    document.querySelector("[data-croakle-ai-clear-key]")?.addEventListener("click", CroakleClearAiKey);
  }

  function CroakleGetSelectedAiMeta() {
    const currentSettings = CroakleLoadAiSettings();

    return {
      provider: document.querySelector("[data-croakle-ai-provider]")?.value || currentSettings.provider,
      model: document.querySelector("[data-croakle-ai-model]")?.value || currentSettings.model,
    };
  }

  function CroakleHandleAiMetaChange() {
    const settings = CroakleLoadAiSettings();
    const nextSettings = {
      ...settings,
      ...CroakleGetSelectedAiMeta(),
    };

    CroakleSaveAiSettings(nextSettings);
    CroakleAddActivityLog({
      type: "update",
      targetType: "settings",
      targetId: "ai-settings",
      targetName: "Croakle Recap AI",
      message: "Updated AI settings",
    });
  }

  function CroakleSaveNewAiKey() {
    const input = document.querySelector("[data-croakle-ai-api-key]");
    const nextKey = input?.value.trim() || "";
    const currentSettings = CroakleLoadAiSettings();

    if (!nextKey) {
      CroakleUpdateAiStatus("Paste an API key before saving.");
      input?.focus();
      return;
    }

    CroakleSaveAiSettings({
      ...currentSettings,
      ...CroakleGetSelectedAiMeta(),
      apiKey: nextKey,
    });

    CroakleAddActivityLog({
      type: "update",
      targetType: "settings",
      targetId: "ai-key",
      targetName: "Gemini API Key",
      message: "Updated AI API key",
    });
    CroakleAiKeyEditMode = false;
    CroakleRenderAiSettingsPanel();
  }

  function CroakleStartAiKeyReplace() {
    CroakleAiKeyEditMode = true;
    CroakleRenderAiSettingsPanel();
    document.querySelector("[data-croakle-ai-api-key]")?.focus();
  }

  function CroakleCancelAiKeyEdit() {
    CroakleAiKeyEditMode = false;
    CroakleRenderAiSettingsPanel();
  }

  function CroakleClearAiKey() {
    const settings = CroakleLoadAiSettings();
    CroakleSaveAiSettings({
      ...settings,
      ...CroakleGetSelectedAiMeta(),
      apiKey: "",
    });

    CroakleAddActivityLog({
      type: "delete",
      targetType: "settings",
      targetId: "ai-key",
      targetName: "Gemini API Key",
      message: "Cleared AI API key",
    });
    CroakleAiKeyEditMode = false;
    CroakleRenderAiSettingsPanel();
  }

  function CroakleUpdateAiStatus(message) {
    const status = document.querySelector("[data-croakle-ai-status]");

    if (status) {
      status.textContent = message;
    }
  }

  function CroaklePatchSettingsRender() {
    if (window.CroakleAiSettingsPatched || typeof CroakleRenderSettingsPanel !== "function") {
      return;
    }

    window.CroakleAiSettingsPatched = true;
    const originalRenderSettingsPanel = CroakleRenderSettingsPanel;

    CroakleRenderSettingsPanel = function CroakleRenderSettingsPanelWithAi() {
      originalRenderSettingsPanel();
      CroakleRenderAiSettingsPanel();
      CroakleRenderActivityLogPanel();
    };
  }

  window.CroakleAddActivityLog = CroakleAddActivityLog;
  window.CroakleLoadActivityLogs = CroakleLoadActivityLogs;
  CroaklePatchStateLoggers();
  CroaklePatchSettingsRender();
  window.requestAnimationFrame(() => {
    CroakleRenderAiSettingsPanel();
    CroakleRenderActivityLogPanel();
  });
})();
