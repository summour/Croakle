export type PageType = 'menu' | 'track' | 'project' | 'best' | 'mood' | 'notes' | 'time' | 'analysis' | 'settings';

export type PriorityType = 'high' | 'medium' | 'low';

export interface HabitTemplate {
  id: string;
  name: string;
  goal: number; // 1-7 per week
  description: string;
  priority: PriorityType;
  subHabits?: string[];
  color?: string;
}

export interface HabitMonthData {
  id: string;
  name: string;
  goal: number;
  description: string;
  priority: PriorityType;
  days: boolean[]; // 1..daysInMonth
  lifetime: number;
  subHabits?: string[];
}

export interface MonthData {
  habits: HabitMonthData[];
  moods: (number | null)[]; // 1-5 or null
}

export interface Project {
  id: string;
  name: string;
  goal: number;
  description: string;
  priority: PriorityType;
  completed: boolean;
  completedWeekKey?: string;
  weeklyDays: Record<string, boolean[]>; // weekKey (e.g. "2026-W34") -> 7 booleans
}

export interface NoteItem {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'habit' | 'project' | 'mood' | 'general';
  title?: string;
  text: string;
  sourceId?: string;
  sourceName?: string;
  moodValue?: number;
  createdAt: number;
}

export interface TimeSession {
  id: string;
  subject: string;
  date: string; // YYYY-MM-DD
  startMinute: number; // minutes from midnight (0-1439)
  duration: number; // in minutes
  type: 'focus' | 'study' | 'break' | 'work';
  color?: string;
  sourceType?: 'habit' | 'project' | '';
  sourceId?: string;
  sourceName?: string;
  notes?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'dim';
  soundEnabled: boolean;
  hapticEnabled: boolean;
  aiKey?: string;
}

export const DEFAULT_HABITS: HabitTemplate[] = [
  { id: 'h1', name: 'Read & Learn', goal: 5, description: 'Mindful reading in the cozy loft for 30 minutes', priority: 'high' },
  { id: 'h2', name: 'Nature Walk & Stretch', goal: 4, description: 'Gentle walk outdoors and morning stretches', priority: 'medium' },
  { id: 'h3', name: 'Sleep by 11:00 PM', goal: 6, description: 'Wind down, dim lights, and rest well', priority: 'high' },
  { id: 'h4', name: 'Hydrate (8 Glasses)', goal: 7, description: 'Fresh water throughout the day', priority: 'medium' },
  { id: 'h5', name: 'Organize Workspace', goal: 3, description: 'Keep the desk and books tidy', priority: 'low' },
];

export const DEFAULT_PROJECTS: Project[] = [
  { id: 'p1', name: 'Mindful Reading List', goal: 4, description: 'Explore books on mindfulness, craft, and reflection', priority: 'high', completed: false, weeklyDays: {} },
  { id: 'p2', name: 'Workspace & Studio Setup', goal: 3, description: 'Design an ergonomic and peaceful creative workspace', priority: 'medium', completed: false, weeklyDays: {} },
  { id: 'p3', name: 'Daily Reflection Journal', goal: 5, description: 'Write gratitude and evening thoughts every night', priority: 'low', completed: false, weeklyDays: {} },
];

export interface MoodConfig {
  value: number;
  label: string;
  emoji: string;
  color: string;
  bgLight: string;
  bgDark: string;
  borderLight: string;
  borderDark: string;
  iconBgLight: string;
  iconBgDark: string;
  textColorLight: string;
  textColorDark: string;
}

export const MOOD_LEVELS: MoodConfig[] = [
  {
    value: 5,
    label: 'Rad',
    emoji: '✨',
    color: '#eab308',
    bgLight: 'bg-[#fef9c3]',
    bgDark: 'dark:bg-[#342a0a]',
    borderLight: 'border-[#facc15]',
    borderDark: 'dark:border-[#a16207]',
    iconBgLight: 'bg-[#fef08a]',
    iconBgDark: 'dark:bg-[#4a3b0e]',
    textColorLight: 'text-[#a16207]',
    textColorDark: 'dark:text-[#fde047]',
  },
  {
    value: 4,
    label: 'Good',
    emoji: '🌸',
    color: '#ec4899',
    bgLight: 'bg-[#fce7f3]',
    bgDark: 'dark:bg-[#381024]',
    borderLight: 'border-[#f472b6]',
    borderDark: 'dark:border-[#be185d]',
    iconBgLight: 'bg-[#fbcfe8]',
    iconBgDark: 'dark:bg-[#5b1444]',
    textColorLight: 'text-[#db2777]',
    textColorDark: 'dark:text-[#f472b6]',
  },
  {
    value: 3,
    label: 'Meh',
    emoji: '🍀',
    color: '#16a34a',
    bgLight: 'bg-[#dcfce7]',
    bgDark: 'dark:bg-[#0f2e1b]',
    borderLight: 'border-[#86efac]',
    borderDark: 'dark:border-[#166534]',
    iconBgLight: 'bg-[#bbf7d0]',
    iconBgDark: 'dark:bg-[#144626]',
    textColorLight: 'text-[#15803d]',
    textColorDark: 'dark:text-[#86efac]',
  },
  {
    value: 2,
    label: 'Bad',
    emoji: '🌊',
    color: '#0284c7',
    bgLight: 'bg-[#e0f2fe]',
    bgDark: 'dark:bg-[#0c2438]',
    borderLight: 'border-[#7dd3fc]',
    borderDark: 'dark:border-[#0369a1]',
    iconBgLight: 'bg-[#bae6fd]',
    iconBgDark: 'dark:bg-[#0e3552]',
    textColorLight: 'text-[#0369a1]',
    textColorDark: 'dark:text-[#7dd3fc]',
  },
  {
    value: 1,
    label: 'Awful',
    emoji: '🖤',
    color: '#18181b',
    bgLight: 'bg-[#e4e4e7]',
    bgDark: 'dark:bg-[#18181b]',
    borderLight: 'border-[#71717a]',
    borderDark: 'dark:border-[#52525b]',
    iconBgLight: 'bg-[#d4d4d8]',
    iconBgDark: 'dark:bg-[#27272a]',
    textColorLight: 'text-[#18181b]',
    textColorDark: 'dark:text-[#f4f4f5]',
  },
];

export function getMoodConfig(value: number | null | undefined): MoodConfig | undefined {
  if (!value) return undefined;
  return MOOD_LEVELS.find((m) => m.value === value);
}


