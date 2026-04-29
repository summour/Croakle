(() => {
  const CroakleAiSettingsStoreKey = "CroakleAiSettingsV1";
  const CroakleDefaultAiSettings = {
    provider: "gemini",
    model: "gemini-2.5-flash",
    apiKey: "",
  };

  let CroakleAiKeyEditMode = false;

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
      .CroakleAiSettingsStatus {
        color: var(--CroakleMuted);
        font-size: 13px;
        font-weight: 850;
        line-height: 1.35;
      }

      .CroakleAiSettingsNote {
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

  function CroakleRenderAiSettingsPanel() {
    const settingsBody = document.querySelector(".CroakleSettingsBody");

    if (!settingsBody) {
      return;
    }

    document.querySelector("#CroakleAiSettingsGroup")?.remove();

    const settings = CroakleLoadAiSettings();
    CroakleInjectAiSettingsStyles();

    settingsBody.insertAdjacentHTML("beforeend", `
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
    CroakleSaveAiSettings({
      ...settings,
      ...CroakleGetSelectedAiMeta(),
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
    };
  }

  CroaklePatchSettingsRender();
  window.requestAnimationFrame(CroakleRenderAiSettingsPanel);
})();
