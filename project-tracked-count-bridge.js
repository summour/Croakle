function CroakleProjectTrackedParseDateKey(dateKey) {
  const parts = String(dateKey || "").split("-").map(Number);

  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    return null;
  }

  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function CroakleProjectTrackedFormatDate(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function CroakleProjectTrackedShiftDate(date, amount) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

function CroakleGetProjectUniqueTrackedDates(project) {
  const trackedDates = new Set();
  const weeklyDays = project?.weeklyDays || {};

  Object.entries(weeklyDays).forEach(([weekKey, days]) => {
    const weekStart = CroakleProjectTrackedParseDateKey(weekKey);

    if (!weekStart || !Array.isArray(days)) {
      return;
    }

    days.slice(0, 7).forEach((done, dayIndex) => {
      if (!done) {
        return;
      }

      trackedDates.add(CroakleProjectTrackedFormatDate(CroakleProjectTrackedShiftDate(weekStart, dayIndex)));
    });
  });

  return trackedDates;
}

function CroakleGetProjectTrackedTotal(project) {
  return CroakleGetProjectUniqueTrackedDates(project).size;
}

function CroakleGetProjectArchiveTrackedCount(project) {
  return CroakleGetProjectTrackedTotal(project);
}

CroakleRenderProjectArchiveList?.();
