import {
  HabitTemplate,
  MonthData,
  Project,
  NoteItem,
  TimeSession,
  AppSettings,
  DEFAULT_HABITS,
  DEFAULT_PROJECTS,
} from '../types';
import { getDaysInMonth, getMonthKey, formatIsoDate, getWeekKey } from './dateUtils';

export const HABIT_STORAGE_KEY = 'CroakleHabitMoodDataCleanV1';
export const PROJECT_STORAGE_KEY = 'CroakleProjectDataV1';
export const NOTES_STORAGE_KEY = 'CroakleDailyNotesLiteV1';
export const SESSIONS_STORAGE_KEY = 'CroakleSessionBlocksV1';
export const SETTINGS_STORAGE_KEY = 'CroakleSettingsV1';

export interface HabitStoreState {
  habitTemplates: HabitTemplate[];
  months: Record<string, MonthData>;
}

export function loadHabitsState(): HabitStoreState {
  try {
    const raw = localStorage.getItem(HABIT_STORAGE_KEY);
    if (!raw) {
      return {
        habitTemplates: [...DEFAULT_HABITS],
        months: {},
      };
    }
    const parsed = JSON.parse(raw);
    const templates: HabitTemplate[] = Array.isArray(parsed.habitTemplates) && parsed.habitTemplates.length > 0
      ? parsed.habitTemplates.map((h: any, idx: number) => ({
          id: h.id || `habit-${idx}-${Date.now()}`,
          name: h.name || 'Habit',
          goal: Math.max(1, Math.min(7, Number(h.goal) || 3)),
          description: h.description || '',
          priority: h.priority || 'medium',
          subHabits: Array.isArray(h.subHabits) ? h.subHabits : [],
          color: h.color || '#111111',
          completed: Boolean(h.completed),
        }))
      : [...DEFAULT_HABITS];

    return {
      habitTemplates: templates,
      months: parsed.months || {},
    };
  } catch (e) {
    console.error('Failed to load habits state', e);
    return { habitTemplates: [...DEFAULT_HABITS], months: {} };
  }
}

export function saveHabitsState(state: HabitStoreState) {
  try {
    localStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save habits state', e);
  }
}

export function getOrCreateMonthData(
  state: HabitStoreState,
  year: number,
  monthIndex: number
): MonthData {
  const key = getMonthKey(year, monthIndex);
  const daysCount = getDaysInMonth(year, monthIndex);

  if (!state.months[key]) {
    state.months[key] = {
      habits: state.habitTemplates.map((template) => ({
        id: template.id,
        name: template.name,
        goal: template.goal,
        description: template.description,
        priority: template.priority,
        days: new Array(daysCount).fill(false),
        lifetime: 0,
        subHabits: template.subHabits || [],
      })),
      moods: new Array(daysCount).fill(null),
    };
  } else {
    // Synchronize habits with current templates
    const existingHabits = state.months[key].habits || [];
    state.months[key].habits = state.habitTemplates.map((template) => {
      const found = existingHabits.find((h) => h.id === template.id || h.name === template.name);
      if (found) {
        // adjust days array size if needed
        const days = Array.isArray(found.days) ? [...found.days] : [];
        while (days.length < daysCount) days.push(false);
        return {
          ...template,
          days: days.slice(0, daysCount),
          lifetime: Number(found.lifetime) || 0,
        };
      }
      return {
        ...template,
        days: new Array(daysCount).fill(false),
        lifetime: 0,
      };
    });

    if (!Array.isArray(state.months[key].moods)) {
      state.months[key].moods = new Array(daysCount).fill(null);
    } else {
      while (state.months[key].moods.length < daysCount) {
        state.months[key].moods.push(null);
      }
    }
  }

  return state.months[key];
}

export function loadProjectsState(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECT_STORAGE_KEY);
    if (!raw) return [...DEFAULT_PROJECTS];
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_PROJECTS);
    return list.map((p: any, idx: number) => ({
      id: p.id || `project-${idx}-${Date.now()}`,
      name: p.name || 'Project',
      goal: Math.max(1, Math.min(7, Number(p.goal) || 3)),
      description: p.description || '',
      priority: p.priority || 'medium',
      completed: Boolean(p.completed),
      completedWeekKey: p.completedWeekKey || '',
      weeklyDays: p.weeklyDays || {},
    }));
  } catch (e) {
    return [...DEFAULT_PROJECTS];
  }
}

export function saveProjectsState(projects: Project[]) {
  try {
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify({ projects }));
  } catch (e) {
    console.error('Failed to save projects', e);
  }
}

export function loadNotesState(): NoteItem[] {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    // Map if stored as object { [id]: note } or { [date]: notes }
    if (typeof parsed === 'object') {
      const result: NoteItem[] = [];
      Object.entries(parsed).forEach(([key, val]: [string, any]) => {
        if (Array.isArray(val)) {
          val.forEach((item: any) => {
            result.push({
              id: item.id || `note-${Math.random()}`,
              date: item.date || key || formatIsoDate(new Date()),
              type: item.type || 'habit',
              title: item.title || '',
              text: item.text || item.content || String(item),
              sourceId: item.sourceId || '',
              sourceName: item.sourceName || '',
              moodValue: item.moodValue,
              createdAt: item.createdAt || Date.now(),
            });
          });
        } else if (typeof val === 'object' && val !== null) {
          result.push({
            id: val.id || key,
            date: val.date || formatIsoDate(new Date()),
            type: val.type || 'habit',
            title: val.title || '',
            text: val.text || val.content || '',
            sourceId: val.sourceId || '',
            sourceName: val.sourceName || '',
            moodValue: val.moodValue,
            createdAt: val.createdAt || Date.now(),
          });
        }
      });
      return result.sort((a, b) => b.createdAt - a.createdAt);
    }
    return [];
  } catch {
    return [];
  }
}

export function saveNotesState(notes: NoteItem[]) {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save notes', e);
  }
}

export function loadSessionsState(): TimeSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.blocks) ? parsed.blocks : []);
    return list.map((s: any, idx: number) => ({
      id: s.id || `session-${idx}-${Date.now()}`,
      subject: s.subject || s.title || 'Session',
      date: s.date || formatIsoDate(new Date()),
      startMinute: Number(s.startMinute) || 540, // 9:00 AM
      duration: Math.max(5, Number(s.duration) || 30),
      type: s.type || 'focus',
      color: s.color || '#3b82f6',
      sourceType: s.sourceType || '',
      sourceId: s.sourceId || '',
      sourceName: s.sourceName || '',
      notes: s.notes || '',
    }));
  } catch {
    return [];
  }
}

export function saveSessionsState(sessions: TimeSession[]) {
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify({ blocks: sessions }));
  } catch (e) {
    console.error('Failed to save sessions', e);
  }
}

export function loadSettingsState(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return { theme: 'light', soundEnabled: true, hapticEnabled: true };
    return JSON.parse(raw);
  } catch {
    return { theme: 'light', soundEnabled: true, hapticEnabled: true };
  }
}

export function saveSettingsState(settings: AppSettings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function exportFullBackup(): string {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    habits: loadHabitsState(),
    projects: loadProjectsState(),
    notes: loadNotesState(),
    sessions: loadSessionsState(),
    settings: loadSettingsState(),
  };
  return JSON.stringify(data, null, 2);
}

export function importFullBackup(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.habits) saveHabitsState(parsed.habits);
    if (parsed.projects) saveProjectsState(parsed.projects);
    if (parsed.notes) saveNotesState(parsed.notes);
    if (parsed.sessions) saveSessionsState(parsed.sessions);
    if (parsed.settings) saveSettingsState(parsed.settings);
    return true;
  } catch (e) {
    console.error('Import failed', e);
    return false;
  }
}
