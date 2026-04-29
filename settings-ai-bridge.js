(() => {
  const CroakleAiSettingsStoreKey = "CroakleAiSettingsV1";
  const CroakleDefaultAiSettings = {
    provider: "gemini",
    model: "gemini-2.5-flash",
    apiKey: "",
  };

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

  function CroakleEscapeAiSetting(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
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
      .CroakleAiSettingsSelect {
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
        pointer-events: auto;
        -webkit-text-fill-color: var(--CroakleText);
      }

      .CroakleAiSettingsInput:focus,
      .CroakleAiSettingsSelect:focus {
        box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
      }
    `;
    document.head.appendChild(style);
  }

  function CroakleRenderAiSettingsPanel() {
    const settingsBody = document.querySelector(".CroakleSettingsBody");

    if (!settingsBody || document.querySelector("#CroakleAiSettingsGroup")) {
      return;
    }

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

        <label class="CroakleAiSettingsField">
          <span>Gemini API Key</span>
          <input class="CroakleAiSettingsInput" type="text" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Paste Gemini API key" value="${CroakleEscapeAiSetting(settings.apiKey)}" data-croakle-ai-api-key />
        </label>

        <p class="CroakleAiSettingsStatus" data-croakle-ai-status>${settings.apiKey ? "API key saved on this device." : "No API key saved yet."}</p>

        <button class="CroakleSettingsActionButton" type="button" data-croakle-ai-clear-key>
          <span class="CroakleSettingsText">
            <strong>Clear AI key</strong>
            <span>ลบ Gemini API key ออกจากเครื่องนี้</span>
          </span>
          <span class="CroakleSettingsValue">Clear</span>
        </button>
      </section>
    `);

    CroakleBindAiSettingsControls();
  }

  function CroakleBindAiSettingsControls() {
    document.querySelector("[data-croakle-ai-provider]")?.addEventListener("change", CroakleHandleAiSettingChange);
    document.querySelector("[data-croakle-ai-model]")?.addEventListener("change", CroakleHandleAiSettingChange);
    document.querySelector("[data-croakle-ai-api-key]")?.addEventListener("input", CroakleHandleAiSettingChange);
    document.querySelector("[data-croakle-ai-api-key]")?.addEventListener("change", CroakleHandleAiSettingChange);
    document.querySelector("[data-croakle-ai-clear-key]")?.addEventListener("click", CroakleClearAiKey);
  }

  function CroakleHandleAiSettingChange() {
    const settings = {
      provider: document.querySelector("[data-croakle-ai-provider]")?.value || "gemini",
      model: document.querySelector("[data-croakle-ai-model]")?.value || "gemini-2.5-flash",
      apiKey: document.querySelector("[data-croakle-ai-api-key]")?.value.trim() || "",
    };

    CroakleSaveAiSettings(settings);
    CroakleUpdateAiStatus(settings.apiKey);
  }

  function CroakleUpdateAiStatus(apiKey) {
    const status = document.querySelector("[data-croakle-ai-status]");

    if (status) {
      status.textContent = apiKey ? "API key saved on this device." : "No API key saved yet.";
    }
  }

  function CroakleClearAiKey() {
    const settings = CroakleLoadAiSettings();
    settings.apiKey = "";
    CroakleSaveAiSettings(settings);

    const input = document.querySelector("[data-croakle-ai-api-key]");
    if (input) {
      input.value = "";
      input.focus();
    }

    CroakleUpdateAiStatus("");
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
