function CroakleEnhanceTrackMoodButtons() {
  document.querySelectorAll("#CroakleTrackMoodPreview .CroakleMoodBadge").forEach((moodBadge) => {
    const dateIso = moodBadge.dataset.dateIso;

    if (!dateIso) {
      return;
    }

    moodBadge.setAttribute("role", "button");
    moodBadge.setAttribute("tabindex", "0");
    moodBadge.setAttribute("aria-label", `Open mood for ${dateIso}`);
    moodBadge.classList.add("CroakleTrackMoodLink");
  });
}

function CroakleOpenTrackMoodDate(dateIso) {
  const date = CroakleParseDate(dateIso);

  CroakleState.moodMonth = date.getMonth();
  CroakleState.moodYear = date.getFullYear();

  CroakleSaveState();
  CroakleRenderAll();
  CroakleSetPage("mood");

  window.requestAnimationFrame(() => {
    document
      .querySelector(`[data-page="mood"] [data-date-iso="${dateIso}"]`)
      ?.scrollIntoView({ block: "center", inline: "center" });
  });
}

function CroakleHandleTrackMoodOpen(event) {
  const moodBadge = event.target.closest("#CroakleTrackMoodPreview .CroakleMoodBadge");

  if (!moodBadge?.dataset.dateIso) {
    return;
  }

  CroakleOpenTrackMoodDate(moodBadge.dataset.dateIso);
}

function CroakleHandleTrackMoodKeyboard(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const moodBadge = event.target.closest("#CroakleTrackMoodPreview .CroakleMoodBadge");

  if (!moodBadge?.dataset.dateIso) {
    return;
  }

  event.preventDefault();
  CroakleOpenTrackMoodDate(moodBadge.dataset.dateIso);
}

function CroaklePatchMoodBridgeRenderers() {
  const originalRenderTrackHeader = CroakleRenderTrackHeader;
  const originalCycleMood = CroakleCycleMood;

  CroakleRenderTrackHeader = function CroakleRenderTrackHeaderWithMoodLinks() {
    originalRenderTrackHeader();
    CroakleEnhanceTrackMoodButtons();
  };

  CroakleCycleMood = function CroakleCycleMoodWithTrackSync(event) {
    originalCycleMood(event);
    CroakleRenderTrackHeader();
  };
}

CroaklePatchMoodBridgeRenderers();
CroakleEnhanceTrackMoodButtons();

document.addEventListener("click", CroakleHandleTrackMoodOpen);
document.addEventListener("keydown", CroakleHandleTrackMoodKeyboard);
