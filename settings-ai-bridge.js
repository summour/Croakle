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

      .CroakleAiSettingsField span {
        color: var(--CroakleMuted);
        font-size: 13px;
        font-weight: 850;
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
          <input class="CroakleAiSettingsInput" type="password" autocomplete="off" placeholder="Paste Gemini API key" value="${CroakleEscapeAiSetting(settings.apiKey)}" data-croakle-ai-api-key />
        </label>

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
    document.querySelector("[data-croakle-ai-api-key]")?.addEventListener("change", CroakleHandleAiSettingChange);
    document.querySelector("[data-croakle-ai-clear-key]")?.addEventListener("click", CroakleClearAiKey);
  }

  function CroakleHandleAiSettingChange() {
    CroakleSaveAiSettings({
      provider: document.querySelector("[data-croakle-ai-provider]")?.value || "gemini",
      model: document.querySelector("[data-croakle-ai-model]")?.value || "gemini-2.5-flash",
      apiKey: document.querySelector("[data-croakle-ai-api-key]")?.value.trim() || "",
    });
  }

  function CroakleClearAiKey() {
    const settings = CroakleLoadAiSettings();
    settings.apiKey = "";
    CroakleSaveAiSettings(settings);

    const input = document.querySelector("[data-croakle-ai-api-key]");
    if (input) {
      input.value = "";
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
