export type PageType = 'menu' | 'track' | 'project' | 'best' | 'mood' | 'notes' | 'time' | 'analysis' | 'shop' | 'dressup' | 'settings';

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

export type SceneLocationId =
  | 'zen_pond'
  | 'treehouse'
  | 'sakura_shrine'
  | 'rainy_meadow'
  | 'onsen'
  | 'night_camp'
  | 'tearoom'
  | 'cloud_palace'
  | 'bamboo_grove';

export type FrogActivityId =
  | 'relaxing'
  | 'reading'
  | 'tea'
  | 'eating'
  | 'meditating'
  | 'guitar'
  | 'sleeping'
  | 'coffee'
  | 'boba'
  | 'painting'
  | 'camera'
  | 'wand'
  | 'fishing';

export type FrogHatId =
  | 'none'
  | 'lotus'
  | 'straw'
  | 'sakura'
  | 'wizard'
  | 'bandana'
  | 'beanie'
  | 'chef'
  | 'crown'
  | 'beret'
  | 'flower'
  | 'samurai'
  | 'headphone'
  | 'detective';

export type FrogOutfitId =
  | 'none'
  | 'kimono'
  | 'raincoat'
  | 'sweater'
  | 'ninja'
  | 'sailor'
  | 'apron'
  | 'overalls'
  | 'scarf'
  | 'business'
  | 'hoodie';

export type FrogGlassesId =
  | 'none'
  | 'reading'
  | 'sunglasses'
  | 'monocle'
  | 'blush_stars'
  | 'sparkles'
  | 'eyepatch';

export type FrogSkinId =
  | 'classic'
  | 'golden'
  | 'sakura_pink'
  | 'twilight_blue'
  | 'matcha'
  | 'albino_white'
  | 'ember_orange';

export type FrogCompanionId =
  | 'none'
  | 'snail'
  | 'crab'
  | 'fireflies'
  | 'butterfly'
  | 'koi'
  | 'duckling'
  | 'cat'
  | 'turtle';

export type FrogWeatherId = 'auto' | 'sunny' | 'golden' | 'starry' | 'rainy' | 'petals';

export interface PixelSceneConfig {
  sceneId: SceneLocationId;
  activityId: FrogActivityId;
  hatId: FrogHatId;
  outfitId: FrogOutfitId;
  glassesId: FrogGlassesId;
  skinId: FrogSkinId;
  companionId: FrogCompanionId;
  weatherId: FrogWeatherId;
  isAnimated: boolean;
  syncWithMood: boolean;
}

export const DEFAULT_PIXEL_SCENE: PixelSceneConfig = {
  sceneId: 'zen_pond',
  activityId: 'relaxing',
  hatId: 'lotus',
  outfitId: 'none',
  glassesId: 'none',
  skinId: 'classic',
  companionId: 'snail',
  weatherId: 'auto',
  isAnimated: true,
  syncWithMood: true,
};

export interface SceneOptionInfo<T> {
  id: T;
  name: string;
  thaiName?: string;
  emoji: string;
  desc: string;
  tag: string;
}

export const SCENE_LOCATIONS: SceneOptionInfo<SceneLocationId>[] = [
  { id: 'zen_pond', name: 'Zen Lotus Pond', thaiName: 'สระบัวเซน', emoji: '🪷', desc: 'Lily pads, ripples & stone lantern', tag: 'Outdoor' },
  { id: 'treehouse', name: 'Cozy Treehouse', thaiName: 'บ้านต้นไม้อบอุ่น', emoji: '🏡', desc: 'Warm fireplace, books & herbal kettle', tag: 'Indoor' },
  { id: 'sakura_shrine', name: 'Sakura Shrine', thaiName: 'ศาลเจ้าซากุระ', emoji: '🌸', desc: 'Red torii gate & floating cherry petals', tag: 'Outdoor' },
  { id: 'rainy_meadow', name: 'Rainy Mushroom Meadow', thaiName: 'ทุ่งเห็ดสายฝน', emoji: '🍄', desc: 'Gentle raindrops & giant polka-dot mushrooms', tag: 'Nature' },
  { id: 'onsen', name: 'Mountain Hot Spring', thaiName: 'ออนเซ็นกลางขุนเขา', emoji: '♨️', desc: 'Steaming onsen baths & bamboo water spout', tag: 'Relax' },
  { id: 'night_camp', name: 'Starry Campfire Haven', thaiName: 'แคมป์ไฟใต้แสงดาว', emoji: '🌌', desc: 'Crackling campfire & glowing fireflies', tag: 'Night' },
  { id: 'tearoom', name: 'Washi Tearoom Loft', thaiName: 'ห้องน้ำชาทาทามิ', emoji: '🍵', desc: 'Tatami mats, bonsai & matcha tea set', tag: 'Indoor' },
  { id: 'cloud_palace', name: 'Celestial Cloud Palace', thaiName: 'วิมานเมฆบนฟ้า', emoji: '☁️', desc: 'Pastel clouds, rainbows & crescent star', tag: 'Fantasy' },
  { id: 'bamboo_grove', name: 'Misty Bamboo Grove', thaiName: 'ป่าไผ่หมอกสงบ', emoji: '🎋', desc: 'Emerald bamboo shoots & stone walkway', tag: 'Nature' },
];

export const FROG_ACTIVITIES: SceneOptionInfo<FrogActivityId>[] = [
  { id: 'relaxing', name: 'Peaceful Chilling', thaiName: 'นั่งชิลสบายๆ', emoji: '🐸', desc: 'Smiling cute with warm rosy cheeks', tag: 'Rest' },
  { id: 'reading', name: 'Reading Journal', thaiName: 'อ่านสมุดบันทึก', emoji: '📖', desc: 'Immersed in an aesthetic leather book', tag: 'Study' },
  { id: 'tea', name: 'Sipping Green Tea', thaiName: 'จิบมัทฉะอุ่นๆ', emoji: '🍵', desc: 'Warm ceramic cup of frothy matcha', tag: 'Zen' },
  { id: 'eating', name: 'Enjoying Treats', thaiName: 'กินข้าวปั้นโอนิกิริ', emoji: '🍙', desc: 'Feasting on fresh onigiri & baked scone', tag: 'Food' },
  { id: 'meditating', name: 'Mindful Meditation', thaiName: 'นั่งสมาธิเซน', emoji: '🧘', desc: 'Deep breathing with floating aura sparkles', tag: 'Focus' },
  { id: 'guitar', name: 'Plucking Lute', thaiName: 'ดีดพิณบรรเลง', emoji: '🎸', desc: 'Strumming soothing ambient melodies', tag: 'Music' },
  { id: 'sleeping', name: 'Cozy Napping', thaiName: 'นอนห่มผ้างีบหลับ', emoji: '💤', desc: 'Tucked in blanket with sweet Zzz dreams', tag: 'Sleep' },
  { id: 'coffee', name: 'Fresh Drip Coffee', thaiName: 'กาแฟดริปหอมกรุ่น', emoji: '☕', desc: 'Aromatic warm ceramic mug of coffee', tag: 'Focus' },
  { id: 'boba', name: 'Boba Milk Tea', thaiName: 'ชานมไข่มุก', emoji: '🧋', desc: 'Sweet iced bubble tea with thick straw', tag: 'Food' },
  { id: 'painting', name: 'Painting Canvas', thaiName: 'วาดภาพระบายสี', emoji: '🎨', desc: 'Wooden artist palette and fine paintbrush', tag: 'Art' },
  { id: 'camera', name: 'Vintage Camera', thaiName: 'กล้องถ่ายรูปวินเทจ', emoji: '📷', desc: 'Capturing peaceful moments in nature', tag: 'Hobby' },
  { id: 'wand', name: 'Magic Star Wand', thaiName: 'คทาดาววิเศษ', emoji: '🪄', desc: 'Casting soothing starlight magic', tag: 'Magic' },
  { id: 'fishing', name: 'Bamboo Fishing', thaiName: 'ตกปลาชิลๆ', emoji: '🎣', desc: 'Patiently waiting by the calm water', tag: 'Zen' },
];

export const FROG_HATS: SceneOptionInfo<FrogHatId>[] = [
  { id: 'none', name: 'Natural (No Hat)', thaiName: 'ไม่ใส่หมวก', emoji: '✨', desc: 'Classic cute frog head', tag: 'Simple' },
  { id: 'lotus', name: 'Lotus Leaf Hat', thaiName: 'หมวกใบบัว', emoji: '🍃', desc: 'Fresh green lily leaf umbrella', tag: 'Nature' },
  { id: 'straw', name: 'Straw Travel Hat', thaiName: 'หมวกสานชาวสวน', emoji: '👒', desc: 'Traditional woven kasa sun hat', tag: 'Travel' },
  { id: 'sakura', name: 'Sakura Crown', thaiName: 'มงกุฎดอกซากุระ', emoji: '🌸', desc: 'Handcrafted cherry blossom garland', tag: 'Floral' },
  { id: 'wizard', name: 'Mystic Star Hat', thaiName: 'หมวกพ่อมดแห่งดวงดาว', emoji: '🧙‍♂️', desc: 'Deep navy hat with gold stars', tag: 'Magic' },
  { id: 'bandana', name: 'Red Bandana', thaiName: 'ผ้าโพกหัวสีแดง', emoji: '🧣', desc: 'Bold adventurer crimson scarf', tag: 'Adventure' },
  { id: 'beanie', name: 'Winter Beanie', thaiName: 'หมวกไหมพรมกันหนาว', emoji: '🧶', desc: 'Warm cozy woven bobble hat', tag: 'Cozy' },
  { id: 'chef', name: 'Master Chef Toque', thaiName: 'หมวกเชฟกระทะกบ', emoji: '👨‍🍳', desc: 'Puffy white gourmand kitchen hat', tag: 'Food' },
  { id: 'crown', name: 'Royal Golden Crown', thaiName: 'มงกุฎราชาสีทอง', emoji: '👑', desc: 'Shining gold crown with ruby gems', tag: 'Royal' },
  { id: 'beret', name: 'Parisian Beret', thaiName: 'หมวกเบเร่ต์ศิลปิน', emoji: '🎨', desc: 'Chic charcoal wool artist cap', tag: 'Chic' },
  { id: 'flower', name: 'Frangipani Blossom', thaiName: 'ดอกลั่นทมทัดหู', emoji: '🌺', desc: 'Tropical fresh blossom tucked in ear', tag: 'Floral' },
  { id: 'samurai', name: 'Samurai Kabuto', thaiName: 'หมวกซามูไรคาบูโตะ', emoji: '🥷', desc: 'Gilded horns warrior ceremonial helmet', tag: 'Warrior' },
  { id: 'headphone', name: 'Lo-Fi Headphones', thaiName: 'หูฟัง Lo-Fi', emoji: '🎧', desc: 'Comfy headphones playing chill beats', tag: 'Music' },
  { id: 'detective', name: 'Detective Deerstalker', thaiName: 'หมวกนักสืบเชอร์ล็อก', emoji: '🕵️‍♂️', desc: 'Tweed detective cap for curious minds', tag: 'Smart' },
];

export const FROG_OUTFITS: SceneOptionInfo<FrogOutfitId>[] = [
  { id: 'none', name: 'No Outfit (Natural)', thaiName: 'ไม่ใส่ชุด (ธรรมชาติ)', emoji: '🌱', desc: 'Pure classic frog appearance', tag: 'Simple' },
  { id: 'kimono', name: 'Ceremonial Kimono', thaiName: 'ชุดกิโมโนญี่ปุ่น', emoji: '👘', desc: 'Traditional indigo yukata with gold obi sash', tag: 'Zen' },
  { id: 'raincoat', name: 'Yellow Raincoat', thaiName: 'ชุดกันฝนสีเหลืองสดใส', emoji: '🧥', desc: 'Bright waterproof slicker with toggle buttons', tag: 'Cute' },
  { id: 'sweater', name: 'Cozy Knit Sweater', thaiName: 'เสื้อไหมพรมถักอุ่น', emoji: '🧶', desc: 'Warm autumn sweater with cable knit pattern', tag: 'Cozy' },
  { id: 'ninja', name: 'Shadow Shinobi Garb', thaiName: 'ชุดนินจาเงาพรางตัว', emoji: '🥷', desc: 'Sleek stealth black robes with red trim', tag: 'Stealth' },
  { id: 'sailor', name: 'Sailor Suit', thaiName: 'ชุดกะลาสีเรือ', emoji: '⚓', desc: 'Navy blue striped collar uniform', tag: 'Cute' },
  { id: 'apron', name: 'Craft & Garden Apron', thaiName: 'ผ้ากันเปื้อนช่างฝีมือ', emoji: '🪴', desc: 'Earthy canvas apron with front tool pockets', tag: 'Work' },
  { id: 'overalls', name: 'Denim Overalls', thaiName: 'เอี๊ยมยีนส์น่ารัก', emoji: '👖', desc: 'Vintage blue dungarees with brass buckles', tag: 'Casual' },
  { id: 'scarf', name: 'Fluffy Wool Scarf', thaiName: 'ผ้าพันคอขนฟูนุ่ม', emoji: '🧣', desc: 'Long crimson scarf dancing in the breeze', tag: 'Cozy' },
  { id: 'business', name: 'Gentleman Suit & Tie', thaiName: 'สูทผูกเนคไทสุภาพบุรุษ', emoji: '👔', desc: 'Sharp black waistcoat and crimson bowtie', tag: 'Fancy' },
  { id: 'hoodie', name: 'Croakle Oversized Hoodie', thaiName: 'เสื้อฮู้ดดี้โอเวอร์ไซส์', emoji: '🐸', desc: 'Ultra-soft pastel green frog ear hoodie', tag: 'Casual' },
];

export const FROG_GLASSES: SceneOptionInfo<FrogGlassesId>[] = [
  { id: 'none', name: 'No Glasses', thaiName: 'ไม่ใส่แว่น', emoji: '✨', desc: 'Clear natural eyes', tag: 'Simple' },
  { id: 'reading', name: 'Round Scholar Spectacles', thaiName: 'แว่นตากลมเด็กเรียน', emoji: '👓', desc: 'Gold wire round reading frames', tag: 'Smart' },
  { id: 'sunglasses', name: 'Pixel Cool Shades', thaiName: 'แว่นกันแดดสุดคูล', emoji: '🕶️', desc: 'Retro 8-bit black tinted sunglasses', tag: 'Cool' },
  { id: 'monocle', name: 'Aristocrat Monocle', thaiName: 'แว่นตาข้างเดียวไฮโซ', emoji: '🧐', desc: 'Gold rimmed monocle on a fine chain', tag: 'Fancy' },
  { id: 'blush_stars', name: 'Starry Rosy Cheeks', thaiName: 'แก้มแดงประกายดาว', emoji: '⭐', desc: 'Golden twinkle stars on rosy cheeks', tag: 'Cute' },
  { id: 'sparkles', name: 'Shining Aura Sparkles', thaiName: 'ประกายแสงวิบวับ', emoji: '✨', desc: 'Floating magical luminescence', tag: 'Magic' },
  { id: 'eyepatch', name: 'Pirate Captain Eyepatch', thaiName: 'ผ้าปิดตากัปตันโจรสลัด', emoji: '🏴‍☠️', desc: 'Leather eyepatch with tiny skull decal', tag: 'Adventure' },
];

export const FROG_SKINS: SceneOptionInfo<FrogSkinId>[] = [
  { id: 'classic', name: 'Classic Moss Green', thaiName: 'เขียวมอสธรรมชาติ', emoji: '🐸', desc: 'Original peaceful woodland green hue', tag: 'Classic' },
  { id: 'golden', name: 'Golden Sun Treefrog', thaiName: 'กบทองคำเปล่งประกาย', emoji: '✨', desc: 'Luminous warm golden honey tone', tag: 'Rare' },
  { id: 'sakura_pink', name: 'Sakura Pastel Pink', thaiName: 'ชมพูกลีบซากุระ', emoji: '🌸', desc: 'Soft blushing petal pink skin', tag: 'Cute' },
  { id: 'twilight_blue', name: 'Twilight Deep Blue', thaiName: 'น้ำเงินครามราตรี', emoji: '🌌', desc: 'Mystical midnight blue with cyan undertones', tag: 'Mystic' },
  { id: 'matcha', name: 'Matcha Cream Green', thaiName: 'เขียวชาเขียวมัทฉะ', emoji: '🍵', desc: 'Gentle pastel matcha cream shade', tag: 'Pastel' },
  { id: 'albino_white', name: 'Snow Albino Pearl', thaiName: 'ขาวไข่มุกหิมะ', emoji: '❄️', desc: 'Pure glistening snow white with soft pinks', tag: 'Epic' },
  { id: 'ember_orange', name: 'Ember Flame Orange', thaiName: 'ส้มเพลิงอบอุ่น', emoji: '🔥', desc: 'Vibrant autumn fiery orange warmth', tag: 'Fiery' },
];

export const FROG_COMPANIONS: SceneOptionInfo<FrogCompanionId>[] = [
  { id: 'none', name: 'Solo Time', thaiName: 'อยู่คนเดียวสงบๆ', emoji: '🌱', desc: 'Quiet peaceful sanctuary alone', tag: 'Solitude' },
  { id: 'snail', name: 'Maimai the Snail', thaiName: 'น้องหอยทาก ไมไม', emoji: '🐌', desc: 'Whimsical slow traveler with spiral shell', tag: 'Friend' },
  { id: 'crab', name: 'Kani the Crab', thaiName: 'น้องปู คานิ', emoji: '🦀', desc: 'Cheerful little crab with waving pinchers', tag: 'Friend' },
  { id: 'fireflies', name: 'Hotaru Fireflies', thaiName: 'ฝูงหิ่งห้อย โฮตารุ', emoji: '✨', desc: 'Dancing glowing light particles', tag: 'Atmosphere' },
  { id: 'butterfly', name: 'Flutter Butterfly', thaiName: 'ผีเสื้อสีฟ้าแสนสวย', emoji: '🦋', desc: 'Delicate pastel blue winged visitor', tag: 'Wildlife' },
  { id: 'koi', name: 'Nishikigoi Carp', thaiName: 'ปลาคราฟนำโชค', emoji: '🎏', desc: 'Swimming red & white lucky carp', tag: 'Water' },
  { id: 'duckling', name: 'Piyo the Yellow Duckling', thaiName: 'ลูกเป็ดเหลือง ปิโย๊ะ', emoji: '🐤', desc: 'Adorable fluffy duck paddling gently', tag: 'Cute' },
  { id: 'cat', name: 'Luna the Starry Kitten', thaiName: 'น้องแมวดาว ลูน่า', emoji: '🐱', desc: 'Sleepy black cat with starlight collar', tag: 'Pet' },
  { id: 'turtle', name: 'Kame the Mossy Turtle', thaiName: 'เต่ามอสตัวจิ๋ว คาเมะ', emoji: '🐢', desc: 'Ancient wise turtle resting peacefully', tag: 'Friend' },
];

export const FROG_WEATHERS: SceneOptionInfo<FrogWeatherId>[] = [
  { id: 'auto', name: 'Auto Real-Time', thaiName: 'ปรับตามเวลาจริง & อารมณ์', emoji: '⏰', desc: 'Syncs with real clock & your mood', tag: 'Smart' },
  { id: 'sunny', name: 'Sunny Morning', thaiName: 'แดดยามเช้าแจ่มใส', emoji: '☀️', desc: 'Clear vibrant daylight with sun rays', tag: 'Day' },
  { id: 'golden', name: 'Golden Hour Dusk', thaiName: 'แสงอาทิตย์อัสดง', emoji: '🌅', desc: 'Warm amber sunset glow', tag: 'Evening' },
  { id: 'starry', name: 'Starry Midnight', thaiName: 'คืนดาวพร่างพราย', emoji: '🌙', desc: 'Deep indigo night sky & twinkling stars', tag: 'Night' },
  { id: 'rainy', name: 'Gentle Rain', thaiName: 'สายฝนโปรยปราย', emoji: '🌧️', desc: 'Calming pixel rainfall ripples', tag: 'Calm' },
  { id: 'petals', name: 'Petal Shower', thaiName: 'ละอองซากุระปลิวไหว', emoji: '🌸', desc: 'Drifting sakura petals breeze', tag: 'Peaceful' },
];

// -------------------------------------------------------------
// FROG SHOP & WARDROBE DATA TYPES
// -------------------------------------------------------------

export type ShopCategory =
  | 'hats'
  | 'outfits'
  | 'accessories'
  | 'skins'
  | 'props'
  | 'companions'
  | 'scenes';

export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ShopItem {
  id: string;
  slot: 'hatId' | 'outfitId' | 'glassesId' | 'skinId' | 'activityId' | 'companionId' | 'sceneId';
  value: string;
  category: ShopCategory;
  name: string;
  thaiName: string;
  desc: string;
  thaiDesc: string;
  price: number;
  emoji: string;
  rarity: ItemRarity;
  defaultUnlocked?: boolean;
}

export interface CoinTransaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: 'earn' | 'spend';
}

export interface ThemedFrogSet {
  id: string;
  name: string;
  thaiName: string;
  desc: string;
  tagline: string;
  themeColor: string;
  gradient: string;
  bannerEmoji: string;
  rarity: ItemRarity;
  items: {
    sceneId: SceneLocationId;
    outfitId: FrogOutfitId;
    hatId: FrogHatId;
    glassesId: FrogGlassesId;
    activityId: FrogActivityId;
    companionId: FrogCompanionId;
    skinId: FrogSkinId;
    weatherId?: FrogWeatherId;
  };
  itemIds: string[]; // List of ShopItem IDs in this set
  bonusCoinsReward?: number;
}

export interface GachaPullResult {
  item: ShopItem;
  isNew: boolean;
  isJackpotFullSet?: boolean;
  setName?: string;
  duplicateRefundCoins?: number;
}


export type GachaGrade = 'SR' | 'R' | 'N';

export interface FrogShopState {
  coins: number;
  ownedItemIds: string[];
  lastDailyClaimDate?: string;
  lastFreeGachaDate?: string; // Daily free 1-pull timestamp
  transactions?: CoinTransaction[];
  gachaPityCounter?: number; // Pity pull count towards guaranteed SR
  wishlistIds?: string[]; // Hearted items in gacha lineups
  completedSetClaimedIds?: string[]; // Set IDs where completion reward has been claimed
}

export const DEFAULT_FROG_SHOP_STATE: FrogShopState = {
  coins: 180, // Welcome gift so user can buy something right away!
  ownedItemIds: [
    // Base starter essentials
    'hat_none',
    'hat_lotus',
    'hat_straw',
    'outfit_none',
    'glasses_none',
    'skin_classic',
    'prop_relaxing',
    'prop_tea',
    'companion_none',
    'companion_snail',
    'scene_zen_pond',
    'scene_treehouse',
  ],
  transactions: [
    {
      id: 'tx_welcome',
      title: 'Welcome to Croakle Gift 🎁',
      amount: 180,
      date: new Date().toISOString().slice(0, 10),
      type: 'earn',
    },
  ],
};




