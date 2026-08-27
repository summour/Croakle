export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DAY_SHORT_NAMES = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
export const CALENDAR_HEADER_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function formatIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getTodayIso(): string {
  return formatIsoDate(new Date());
}

export function getMonthKey(year: number, monthIndex: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
}

export function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function formatFriendlyDate(iso: string): string {
  try {
    const [y, m, d] = iso.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const todayIso = getTodayIso();
    
    // Check yesterday
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);
    const yestIso = formatIsoDate(yest);

    const monthShort = MONTH_NAMES[m - 1]?.slice(0, 3) || '';
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });

    if (iso === todayIso) {
      return `Today · ${dayOfWeek}, ${d} ${monthShort}`;
    }
    if (iso === yestIso) {
      return `Yesterday · ${dayOfWeek}, ${d} ${monthShort}`;
    }
    return `${dayOfWeek}, ${d} ${monthShort} ${y}`;
  } catch {
    return iso;
  }
}

/**
 * Returns 7 dates (Monday to Sunday) containing target date
 */
export function getWeekDates(targetDate: Date): { date: Date; iso: string; dayIndex: number; isCurrentDay: boolean }[] {
  const day = targetDate.getDay(); // 0 is Sunday, 1 is Monday...
  // Calculate distance from Monday (Monday = 0, Sunday = 6)
  const diffToMonday = (day + 6) % 7;
  
  const monday = new Date(targetDate);
  monday.setDate(targetDate.getDate() - diffToMonday);

  const todayIso = getTodayIso();
  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = formatIsoDate(d);
    weekDays.push({
      date: d,
      iso,
      dayIndex: i,
      isCurrentDay: iso === todayIso,
    });
  }

  return weekDays;
}

export function getWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

export function addDaysIso(iso: string, days: number): string {
  try {
    const [y, m, d] = iso.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    return formatIsoDate(date);
  } catch {
    return iso;
  }
}

export function formatTimeMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatTimeWithSeconds(dateOrTimestamp: Date | number): string {
  const d = typeof dateOrTimestamp === 'number' ? new Date(dateOrTimestamp) : dateOrTimestamp;
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export function formatDateTimeWithSeconds(dateOrTimestamp: Date | number): string {
  const d = typeof dateOrTimestamp === 'number' ? new Date(dateOrTimestamp) : dateOrTimestamp;
  const day = d.getDate();
  const month = MONTH_NAMES[d.getMonth()]?.slice(0, 3) || '';
  const year = d.getFullYear();
  const timeStr = formatTimeWithSeconds(d);
  return `${day} ${month} ${year}, ${timeStr}`;
}

export function formatThaiDateTime(dateOrTimestamp: Date | number): string {
  const d = typeof dateOrTimestamp === 'number' ? new Date(dateOrTimestamp) : dateOrTimestamp;
  const thaiMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  const day = d.getDate();
  const month = thaiMonths[d.getMonth()] || '';
  const year = d.getFullYear() + 543;
  const timeStr = formatTimeWithSeconds(d);
  return `${day} ${month} ${year} เวลา ${timeStr} น.`;
}

export interface MonthWeekDay {
  date: Date;
  iso: string;
  dayIndex: number;
  isCurrentDay: boolean;
  inMonth: boolean;
  dayOfMonth: number;
}

export interface MonthWeek {
  weekNumber: number;
  label: string;
  rangeLabel: string;
  startDate: Date;
  endDate: Date;
  days: MonthWeekDay[];
  weekKey: string;
}

/**
 * Returns all weeks spanning the given month (Monday-to-Sunday weeks)
 */
export function getMonthWeeks(year: number, monthIndex: number): MonthWeek[] {
  const daysCount = getDaysInMonth(year, monthIndex);
  const weeks: MonthWeek[] = [];
  const processedIso = new Set<string>();

  for (let day = 1; day <= daysCount; day++) {
    const d = new Date(year, monthIndex, day);
    
    // Find the Monday of this date's week
    const dayOfWeek = d.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(year, monthIndex, day);
    monday.setDate(d.getDate() - diffToMonday);
    const mondayIso = formatIsoDate(monday);

    if (processedIso.has(mondayIso)) {
      continue;
    }
    processedIso.add(mondayIso);

    const todayIso = getTodayIso();
    const weekDays: MonthWeekDay[] = [];
    for (let i = 0; i < 7; i++) {
      const current = new Date(monday);
      current.setDate(monday.getDate() + i);
      const currentIso = formatIsoDate(current);
      weekDays.push({
        date: current,
        iso: currentIso,
        dayIndex: i,
        isCurrentDay: currentIso === todayIso,
        inMonth: current.getMonth() === monthIndex && current.getFullYear() === year,
        dayOfMonth: current.getDate(),
      });
    }

    const weekNum = weeks.length + 1;
    const monthDaysInWeek = weekDays.filter((w) => w.inMonth);
    const firstInMonth = monthDaysInWeek[0]?.dayOfMonth ?? weekDays[0].dayOfMonth;
    const lastInMonth = monthDaysInWeek[monthDaysInWeek.length - 1]?.dayOfMonth ?? weekDays[6].dayOfMonth;
    const rangeLabel = `${firstInMonth}-${lastInMonth}`;

    weeks.push({
      weekNumber: weekNum,
      label: `W${weekNum}`,
      rangeLabel,
      startDate: weekDays[0].date,
      endDate: weekDays[6].date,
      days: weekDays,
      weekKey: getWeekKey(weekDays[0].date),
    });
  }

  return weeks;
}
