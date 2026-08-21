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
  completed?: boolean;
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
  completed?: boolean;
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

export interface ActiveTimerState {
  isRunning: boolean;
  subject: string;
  type: 'focus' | 'study' | 'break' | 'work';
  startedAt: number | null; // Date.now() timestamp when resumed/started
  accumulatedSeconds: number; // seconds elapsed prior to current run
  targetDurationMinutes?: number; // optional target duration e.g. 25
  sourceType?: 'habit' | 'project' | '';
  sourceId?: string;
}

export const DEFAULT_ACTIVE_TIMER: ActiveTimerState = {
  isRunning: false,
  subject: 'Deep Work',
  type: 'focus',
  startedAt: null,
  accumulatedSeconds: 0,
  targetDurationMinutes: 25,
  sourceType: '',
  sourceId: '',
};

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

// -------------------------------------------------------------
// DYNAMIC PIXEL ART SCENE & FROG HABITAT TYPES
// -------------------------------------------------------------

export type SceneLocationId = 'zen_pond' | 'treehouse' | 'sakura_shrine' | 'rainy_meadow' | 'onsen' | 'night_camp' | 'tearoom';

export type FrogActivityId = 'relaxing' | 'reading' | 'tea' | 'eating' | 'meditating' | 'guitar' | 'sleeping';

export type FrogHatId = 'none' | 'lotus' | 'straw' | 'sakura' | 'wizard' | 'bandana' | 'beanie';

export type FrogCompanionId = 'none' | 'snail' | 'crab' | 'fireflies' | 'butterfly' | 'koi';

export type FrogWeatherId = 'auto' | 'sunny' | 'golden' | 'starry' | 'rainy' | 'petals';

export interface PixelSceneConfig {
  sceneId: SceneLocationId;
  activityId: FrogActivityId;
  hatId: FrogHatId;
  companionId: FrogCompanionId;
  weatherId: FrogWeatherId;
  isAnimated: boolean;
  syncWithMood: boolean;
}

export const DEFAULT_PIXEL_SCENE: PixelSceneConfig = {
  sceneId: 'zen_pond',
  activityId: 'relaxing',
  hatId: 'lotus',
  companionId: 'snail',
  weatherId: 'auto',
  isAnimated: true,
  syncWithMood: true,
};

export interface SceneOptionInfo<T> {
  id: T;
  name: string;
  emoji: string;
  desc: string;
  tag: string;
}

export const SCENE_LOCATIONS: SceneOptionInfo<SceneLocationId>[] = [
  { id: 'zen_pond', name: 'Zen Lotus Pond', emoji: '🪷', desc: 'Lily pads, ripples & stone lantern', tag: 'Outdoor' },
  { id: 'treehouse', name: 'Cozy Treehouse', emoji: '🏡', desc: 'Warm fireplace, books & herbal kettle', tag: 'Indoor' },
  { id: 'sakura_shrine', name: 'Sakura Shrine', emoji: '🌸', desc: 'Red torii gate & floating cherry petals', tag: 'Outdoor' },
  { id: 'rainy_meadow', name: 'Rainy Mushroom Meadow', emoji: '🍄', desc: 'Gentle raindrops & giant polka-dot mushrooms', tag: 'Nature' },
  { id: 'onsen', name: 'Mountain Hot Spring', emoji: '♨️', desc: 'Steaming onsen baths & bamboo water spout', tag: 'Relax' },
  { id: 'night_camp', name: 'Starry Campfire Haven', emoji: '🌌', desc: 'Crackling campfire & glowing fireflies', tag: 'Night' },
  { id: 'tearoom', name: 'Washi Tearoom Loft', emoji: '🍵', desc: 'Tatami mats, bonsai & matcha tea set', tag: 'Indoor' },
];

export const FROG_ACTIVITIES: SceneOptionInfo<FrogActivityId>[] = [
  { id: 'relaxing', name: 'Peaceful Chilling', emoji: '🐸', desc: 'Smiling cute with warm rosy cheeks', tag: 'Rest' },
  { id: 'reading', name: 'Reading Journal', emoji: '📖', desc: 'Immersed in an aesthetic leather book', tag: 'Study' },
  { id: 'tea', name: 'Sipping Green Tea', emoji: '🍵', desc: 'Warm ceramic cup of frothy matcha', tag: 'Zen' },
  { id: 'eating', name: 'Enjoying Treats', emoji: '🍙', desc: 'Feasting on fresh onigiri & baked scone', tag: 'Food' },
  { id: 'meditating', name: 'Mindful Meditation', emoji: '🧘', desc: 'Deep breathing with floating aura sparkles', tag: 'Focus' },
  { id: 'guitar', name: 'Plucking Lute', emoji: '🎸', desc: 'Strumming soothing ambient melodies', tag: 'Music' },
  { id: 'sleeping', name: 'Cozy Napping', emoji: '💤', desc: 'Tucked in blanket with sweet Zzz dreams', tag: 'Sleep' },
];

export const FROG_HATS: SceneOptionInfo<FrogHatId>[] = [
  { id: 'none', name: 'Natural (No Hat)', emoji: '✨', desc: 'Classic cute frog head', tag: 'Simple' },
  { id: 'lotus', name: 'Lotus Leaf Hat', emoji: '🍃', desc: 'Fresh green lily leaf umbrella', tag: 'Nature' },
  { id: 'straw', name: 'Straw Travel Hat', emoji: '👒', desc: 'Traditional woven kasa sun hat', tag: 'Travel' },
  { id: 'sakura', name: 'Sakura Crown', emoji: '🌸', desc: 'Handcrafted cherry blossom garland', tag: 'Floral' },
  { id: 'wizard', name: 'Mystic Star Hat', emoji: '🧙‍♂️', desc: 'Deep navy hat with gold stars', tag: 'Magic' },
  { id: 'bandana', name: 'Red Bandana', emoji: '🧣', desc: 'Bold adventurer crimson scarf', tag: 'Adventure' },
  { id: 'beanie', name: 'Winter Beanie', emoji: '🧶', desc: 'Warm cozy woven bobble hat', tag: 'Cozy' },
];

export const FROG_COMPANIONS: SceneOptionInfo<FrogCompanionId>[] = [
  { id: 'none', name: 'Solo Time', emoji: '🌱', desc: 'Quiet peaceful sanctuary alone', tag: 'Solitude' },
  { id: 'snail', name: 'Maimai the Snail', emoji: '🐌', desc: 'Whimsical slow traveler with spiral shell', tag: 'Friend' },
  { id: 'crab', name: 'Kani the Crab', emoji: '🦀', desc: 'Cheerful little crab with waving pinchers', tag: 'Friend' },
  { id: 'fireflies', name: 'Hotaru Fireflies', emoji: '✨', desc: 'Dancing glowing light particles', tag: 'Atmosphere' },
  { id: 'butterfly', name: 'Flutter Butterfly', emoji: '🦋', desc: 'Delicate pastel blue winged visitor', tag: 'Wildlife' },
  { id: 'koi', name: 'Nishikigoi Carp', emoji: '🎏', desc: 'Swimming red & white lucky carp', tag: 'Water' },
];

export const FROG_WEATHERS: SceneOptionInfo<FrogWeatherId>[] = [
  { id: 'auto', name: 'Auto Real-Time', emoji: '⏰', desc: 'Syncs with real clock & your mood', tag: 'Smart' },
  { id: 'sunny', name: 'Sunny Morning', emoji: '☀️', desc: 'Clear vibrant daylight with sun rays', tag: 'Day' },
  { id: 'golden', name: 'Golden Hour Dusk', emoji: '🌅', desc: 'Warm amber sunset glow', tag: 'Evening' },
  { id: 'starry', name: 'Starry Midnight', emoji: '🌙', desc: 'Deep indigo night sky & twinkling stars', tag: 'Night' },
  { id: 'rainy', name: 'Gentle Rain', emoji: '🌧️', desc: 'Calming pixel rainfall ripples', tag: 'Calm' },
  { id: 'petals', name: 'Petal Shower', emoji: '🌸', desc: 'Drifting sakura petals breeze', tag: 'Peaceful' },
];



