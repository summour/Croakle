export type PageType = 'menu' | 'track' | 'project' | 'best' | 'mood' | 'notes' | 'time' | 'analysis' | 'shop' | 'dressup' | 'coins' | 'settings';

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
  | 'korean_bbq'
  | 'forest_camp'
  | 'retro_arcade'
  | 'convenience_store'
  | 'red_riding_forest'
  | 'sushi_bar'
  | 'sauna_bathhouse'
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
  | 'grilling_samgyeopsal'
  | 'eating_ssam_wrap'
  | 'holding_rice_and_chopsticks'
  | 'roasting_marshmallow'
  | 'holding_camp_lantern'
  | 'camp_kettle_coffee'
  | 'arcade_gamepad'
  | 'claw_machine_prize'
  | 'handheld_gaming'
  | 'konbini_scanner'
  | 'eating_onigiri'
  | 'holding_konbini_bag'
  | 'picnic_basket'
  | 'woodcutter_axe'
  | 'eating_sushi'
  | 'sushi_crafting'
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
  | 'kbbq_grill_master_headband'
  | 'kbbq_lettuce_wrap_hat'
  | 'kbbq_chef_visor'
  | 'ranger_safari_hat'
  | 'marshmallow_beanie'
  | 'scout_headlamp'
  | 'arcade_joystick_cap'
  | 'pixel_vr_visor'
  | 'retro_gameboy_beanie'
  | 'konbini_staff_visor'
  | 'shopper_bucket_hat'
  | 'onigiri_headband'
  | 'red_riding_hood'
  | 'wolf_ears_hood'
  | 'granny_nightcap'
  | 'sushi_salmon'
  | 'sushi_maguro'
  | 'sushi_ebi'
  | 'sushi_chef_headband'
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
  | 'kbbq_pitmaster_apron'
  | 'kbbq_retro_tracksuit'
  | 'kbbq_hanbok_vest'
  | 'field_scout_parka'
  | 'flannel_camp_vest'
  | 'cozy_sleeping_bag'
  | 'arcade_gamer_bomber'
  | 'pixel_hero_armor'
  | 'retro_esports_jersey'
  | 'konbini_staff_uniform'
  | 'shopper_cozy_sweatset'
  | 'red_riding_dress'
  | 'wolf_fur_cloak'
  | 'hunter_woodsman'
  | 'sushi_chef_happi'
  | 'sushi_kimono_waiter'
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
  | 'kbbq_tasty_blush_steam'
  | 'kbbq_smoke_goggles'
  | 'campfire_warm_glow'
  | 'explorer_binoculars'
  | 'cyber_pixel_shades'
  | 'game_over_dizzy'
  | 'scanner_headset'
  | 'konbini_blush'
  | 'forest_blush_freckles'
  | 'wolf_snarl_fangs'
  | 'wasabi_sparkle'
  | 'reading'
  | 'sunglasses'
  | 'monocle'
  | 'blush_stars'
  | 'sparkles'
  | 'eyepatch';

export type FrogSkinId =
  | 'classic'
  | 'kbbq_caramelized_amber'
  | 'kbbq_gochujang_crimson'
  | 'pine_forest_moss'
  | 'ember_glow_amber'
  | 'cyber_neon_violet'
  | 'gameboy_monochrome'
  | 'konbini_mint'
  | 'fairytale_rose'
  | 'timber_wolf_grey'
  | 'wasabi_green'
  | 'salmon_peach'
  | 'golden'
  | 'sakura_pink'
  | 'twilight_blue'
  | 'matcha'
  | 'albino_white'
  | 'ember_orange';

export type FrogCompanionId =
  | 'none'
  | 'kbbq_sizzle_piglet'
  | 'kbbq_kimchi_ferment_pot'
  | 'forest_camp_fawn'
  | 'campfire_raccoon'
  | 'pixel_arcade_ghost'
  | 'retro_tamagotchi'
  | 'konbini_cashier_cat'
  | 'snack_shiba'
  | 'chibi_wolf_pup'
  | 'forest_hedgehog'
  | 'sushi_apprentice_cat'
  | 'mini_ebi_shrimp'
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
  sceneId: 'sauna_bathhouse',
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
  emoji: string;
  desc: string;
  tag: string;
}

export const SCENE_LOCATIONS: SceneOptionInfo<SceneLocationId>[] = [
  { id: 'korean_bbq', name: 'Sizzling Korean BBQ Grill', emoji: '🥩', desc: 'Glowing tabletop grill, sizzling bacon pork belly, full banchan array, chopsticks & fluffy rice', tag: 'K-BBQ' },
  { id: 'forest_camp', name: 'Wilderness Pine Forest Camp', emoji: '⛺', desc: 'Cozy A-frame tent, crackling bonfire, lantern glow & starry pine woods', tag: 'Camping' },
  { id: 'retro_arcade', name: '8-Bit Retro Arcade Game Center', emoji: '🕹️', desc: 'Neon CRT cabinets, prize claw machine, dance mat & pixel high scores', tag: 'Retro' },
  { id: 'convenience_store', name: '24h Neon Konbini Store', emoji: '🏪', desc: 'Glowing drink fridges, snack shelves & checkout counter', tag: 'Neon' },
  { id: 'red_riding_forest', name: 'Fairytale Red Riding Forest', emoji: '🧺', desc: 'Misty red ribbon woods, granny cottage & autumn trails', tag: 'Fairytale' },
  { id: 'sushi_bar', name: 'Edomae Sushi Counter', emoji: '🍣', desc: 'Polished hinoki bar, noren curtains & red lanterns', tag: 'Gourmet' },
  { id: 'sauna_bathhouse', name: 'Cozy Bathhouse Room', emoji: '🪵', desc: 'Warm stone bricks, arched sauna door & tea lounge', tag: 'Room' },
  { id: 'zen_pond', name: 'Zen Lotus Pond', emoji: '🪷', desc: 'Lily pads, ripples & stone lantern', tag: 'Outdoor' },
  { id: 'treehouse', name: 'Cozy Treehouse', emoji: '🏡', desc: 'Warm fireplace, books & herbal kettle', tag: 'Indoor' },
  { id: 'sakura_shrine', name: 'Sakura Shrine', emoji: '🌸', desc: 'Red torii gate & floating cherry petals', tag: 'Outdoor' },
  { id: 'rainy_meadow', name: 'Rainy Mushroom Meadow', emoji: '🍄', desc: 'Gentle raindrops & giant polka-dot mushrooms', tag: 'Nature' },
  { id: 'onsen', name: 'Mountain Hot Spring', emoji: '♨️', desc: 'Steaming onsen baths & bamboo water spout', tag: 'Relax' },
  { id: 'night_camp', name: 'Starry Campfire Haven', emoji: '🌌', desc: 'Crackling campfire & glowing fireflies', tag: 'Night' },
  { id: 'tearoom', name: 'Washi Tearoom Loft', emoji: '🍵', desc: 'Tatami mats, bonsai & matcha tea set', tag: 'Indoor' },
  { id: 'cloud_palace', name: 'Celestial Cloud Palace', emoji: '☁️', desc: 'Pastel clouds, rainbows & crescent star', tag: 'Fantasy' },
  { id: 'bamboo_grove', name: 'Misty Bamboo Grove', emoji: '🎋', desc: 'Emerald bamboo shoots & stone walkway', tag: 'Nature' },
];

export const FROG_ACTIVITIES: SceneOptionInfo<FrogActivityId>[] = [
  { id: 'relaxing', name: 'Peaceful Chilling', emoji: '🐸', desc: 'Smiling cute with warm rosy cheeks', tag: 'Rest' },
  { id: 'grilling_samgyeopsal', name: 'Grilling Sizzling Pork Belly', emoji: '🥩', desc: 'Flipping crisp samgyeopsal bacon over charcoal grill with long silver tongs', tag: 'K-BBQ' },
  { id: 'eating_ssam_wrap', name: 'Crisp Lettuce Ssam Wrap', emoji: '🥬', desc: 'Munching a fresh perilla & lettuce parcel packed with pork, rice & red ssamjang', tag: 'K-BBQ' },
  { id: 'holding_rice_and_chopsticks', name: 'Steaming Rice & Silver Chopsticks', emoji: '🍚', desc: 'Holding stainless steel bowl of hot fluffy white rice & slim metal chopsticks', tag: 'K-BBQ' },
  { id: 'roasting_marshmallow', name: 'Roasting Marshmallows', emoji: '🍢', desc: 'Toasting golden fluffy marshmallows over glowing embers', tag: 'Camp' },
  { id: 'holding_camp_lantern', name: 'Brass Campfire Lantern', emoji: '🏮', desc: 'Guiding the trail with a warm glowing storm lantern', tag: 'Camp' },
  { id: 'camp_kettle_coffee', name: 'Campfire Drip Kettle', emoji: '☕', desc: 'Brewing steaming aromatic forest drip coffee', tag: 'Camp' },
  { id: 'arcade_gamepad', name: 'Turbo Arcade Gamepad', emoji: '🎮', desc: 'Smashing button combos on a retro 8-bit controller', tag: 'Retro' },
  { id: 'claw_machine_prize', name: 'Claw Machine Frog Plush', emoji: '🧸', desc: 'Hugging fluffy 8-bit prize plush won from crane game', tag: 'Retro' },
  { id: 'handheld_gaming', name: 'Retro Pocket Console', emoji: '🕹️', desc: 'Playing portable 8-bit chiptune pocket console', tag: 'Retro' },
  { id: 'konbini_scanner', name: 'Scanning Konbini Barcodes', emoji: '📟', desc: 'Beeping cash register with red laser scanner', tag: 'Konbini' },
  { id: 'eating_onigiri', name: 'Steamed Bun & Onigiri', emoji: '🍙', desc: 'Munching hot nikuman bun and seaweed onigiri', tag: 'Food' },
  { id: 'holding_konbini_bag', name: 'Midnight Shopping Bag', emoji: '🛍️', desc: 'Striped konbini plastic bag & chilled canned drink', tag: 'Konbini' },
  { id: 'picnic_basket', name: 'Pastry Picnic Basket', emoji: '🧺', desc: 'Woven wicker basket with warm fresh baked pies', tag: 'Tale' },
  { id: 'woodcutter_axe', name: 'Woodland Ax & Firewood', emoji: '🪓', desc: 'Cozy timber axe ready for forest hearth logs', tag: 'Tale' },
  { id: 'eating_sushi', name: 'Fresh Sushi Nigiri Platter', emoji: '🍣', desc: 'Gourmet salmon, tuna & tamago nigiri with wasabi', tag: 'Gourmet' },
  { id: 'sushi_crafting', name: 'Master Itamae Knife', emoji: '🔪', desc: 'Crafting fine cuts of sashimi with artisan knife', tag: 'Gourmet' },
  { id: 'reading', name: 'Reading Journal', emoji: '📖', desc: 'Immersed in an aesthetic leather book', tag: 'Study' },
  { id: 'tea', name: 'Sipping Green Tea', emoji: '🍵', desc: 'Warm ceramic cup of frothy matcha', tag: 'Zen' },
  { id: 'eating', name: 'Enjoying Treats', emoji: '🍙', desc: 'Feasting on fresh onigiri & baked scone', tag: 'Food' },
  { id: 'meditating', name: 'Mindful Meditation', emoji: '🧘', desc: 'Deep breathing with floating aura sparkles', tag: 'Focus' },
  { id: 'guitar', name: 'Plucking Lute', emoji: '🎸', desc: 'Strumming soothing ambient melodies', tag: 'Music' },
  { id: 'sleeping', name: 'Cozy Napping', emoji: '💤', desc: 'Tucked in blanket with sweet Zzz dreams', tag: 'Sleep' },
  { id: 'coffee', name: 'Fresh Drip Coffee', emoji: '☕', desc: 'Aromatic warm ceramic mug of coffee', tag: 'Focus' },
  { id: 'boba', name: 'Boba Milk Tea', emoji: '🧋', desc: 'Sweet iced bubble tea with thick straw', tag: 'Food' },
  { id: 'painting', name: 'Painting Canvas', emoji: '🎨', desc: 'Wooden artist palette and fine paintbrush', tag: 'Art' },
  { id: 'camera', name: 'Vintage Camera', emoji: '📷', desc: 'Capturing peaceful moments in nature', tag: 'Hobby' },
  { id: 'wand', name: 'Magic Star Wand', emoji: '🪄', desc: 'Casting soothing starlight magic', tag: 'Magic' },
  { id: 'fishing', name: 'Bamboo Fishing', emoji: '🎣', desc: 'Patiently waiting by the calm water', tag: 'Zen' },
];

export const FROG_HATS: SceneOptionInfo<FrogHatId>[] = [
  { id: 'none', name: 'Natural (No Hat)', emoji: '✨', desc: 'Classic cute frog head', tag: 'Simple' },
  { id: 'kbbq_grill_master_headband', name: 'K-BBQ Pitmaster Headband', emoji: '🔥', desc: 'Flame-embroidered tied head wrap for true grill masters', tag: 'K-BBQ' },
  { id: 'kbbq_lettuce_wrap_hat', name: 'Fresh Lettuce Ssam Crown', emoji: '🥬', desc: 'Crisp perilla & lettuce leaf perched on head with pork belly & ssamjang', tag: 'K-BBQ' },
  { id: 'kbbq_chef_visor', name: 'Smoky Grill Chef Visor', emoji: '🧢', desc: 'Charcoal translucent sun visor with neon BBQ flame badge', tag: 'K-BBQ' },
  { id: 'ranger_safari_hat', name: 'Wilderness Ranger Hat', emoji: '🤠', desc: 'Olive canvas safari brim with pinecone badge & cord', tag: 'Camp' },
  { id: 'marshmallow_beanie', name: 'Campfire Waffle Beanie', emoji: '🧶', desc: 'Warm mustard knit beanie with toasted marshmallow patch', tag: 'Camp' },
  { id: 'scout_headlamp', name: 'Explorer LED Headlamp', emoji: '🔦', desc: 'High-power night scout headlamp with elastic band', tag: 'Camp' },
  { id: 'arcade_joystick_cap', name: 'Arcade Snapback Cap', emoji: '🧢', desc: 'Black 8-bit gamer cap with embroidered joystick', tag: 'Retro' },
  { id: 'pixel_vr_visor', name: 'Cyber Pixel VR Visor', emoji: '🥽', desc: 'Glowing neon 8-bit cyber visor headset', tag: 'Retro' },
  { id: 'retro_gameboy_beanie', name: 'Handheld Console Beanie', emoji: '🎮', desc: 'Classic retro 8-bit handheld console knit hat', tag: 'Retro' },
  { id: 'konbini_staff_visor', name: 'Konbini Staff Visor', emoji: '🧢', desc: 'Vibrant green & orange stripe clerk sun visor', tag: 'Konbini' },
  { id: 'shopper_bucket_hat', name: 'Cozy Shopper Bucket Hat', emoji: '👒', desc: 'Cream pastel bucket hat for midnight grocery runs', tag: 'Casual' },
  { id: 'onigiri_headband', name: 'Plush Onigiri Headband', emoji: '🍙', desc: 'Cute nori triangle rice ball perched on head', tag: 'Cute' },
  { id: 'red_riding_hood', name: 'Crimson Hooded Cape', emoji: '🧺', desc: 'Velvet fairytale hood with deep ruby silk ribbons', tag: 'Fairytale' },
  { id: 'wolf_ears_hood', name: 'Wolf Ears Hunter Hood', emoji: '🐺', desc: 'Fluffy wolf ears with pink inner lining', tag: 'Fairytale' },
  { id: 'granny_nightcap', name: 'Granny Lace Nightcap', emoji: '👵', desc: 'Ruffled vintage bonnet for cozy bedtime stories', tag: 'Fairytale' },
  { id: 'sushi_salmon', name: 'Salmon Nigiri Hat', emoji: '🍣', desc: 'Glossy fresh salmon nigiri with nori seaweed belt', tag: 'Gourmet' },
  { id: 'sushi_maguro', name: 'Otoro Maguro Nigiri', emoji: '🍣', desc: 'Deep crimson ruby tuna sashimi on rice bed', tag: 'Gourmet' },
  { id: 'sushi_ebi', name: 'Sweet Ebi Prawn Hat', emoji: '🍤', desc: 'Crispy butterflied prawn tail hat with wasabi', tag: 'Gourmet' },
  { id: 'sushi_chef_headband', name: 'Rising Sun Hachimaki', emoji: '🎌', desc: 'Artisan master sushi itamae tied headband', tag: 'Gourmet' },
  { id: 'lotus', name: 'Lotus Leaf Hat', emoji: '🍃', desc: 'Fresh green lily leaf umbrella', tag: 'Nature' },
  { id: 'straw', name: 'Straw Travel Hat', emoji: '👒', desc: 'Traditional woven kasa sun hat', tag: 'Travel' },
  { id: 'sakura', name: 'Sakura Crown', emoji: '🌸', desc: 'Handcrafted cherry blossom garland', tag: 'Floral' },
  { id: 'wizard', name: 'Mystic Star Hat', emoji: '🧙‍♂️', desc: 'Deep navy hat with gold stars', tag: 'Magic' },
  { id: 'bandana', name: 'Red Bandana', emoji: '🧣', desc: 'Bold adventurer crimson scarf', tag: 'Adventure' },
  { id: 'beanie', name: 'Winter Beanie', emoji: '🧶', desc: 'Warm cozy woven bobble hat', tag: 'Cozy' },
  { id: 'chef', name: 'Master Chef Toque', emoji: '👨‍🍳', desc: 'Puffy white gourmand kitchen hat', tag: 'Food' },
  { id: 'crown', name: 'Royal Golden Crown', emoji: '👑', desc: 'Shining gold crown with ruby gems', tag: 'Royal' },
  { id: 'beret', name: 'Parisian Beret', emoji: '🎨', desc: 'Chic charcoal wool artist cap', tag: 'Chic' },
  { id: 'flower', name: 'Frangipani Blossom', emoji: '🌺', desc: 'Tropical fresh blossom tucked in ear', tag: 'Floral' },
  { id: 'samurai', name: 'Samurai Kabuto', emoji: '🥷', desc: 'Gilded horns warrior ceremonial helmet', tag: 'Warrior' },
  { id: 'headphone', name: 'Lo-Fi Headphones', emoji: '🎧', desc: 'Comfy headphones playing chill beats', tag: 'Music' },
  { id: 'detective', name: 'Detective Deerstalker', emoji: '🕵️‍♂️', desc: 'Tweed detective cap for curious minds', tag: 'Smart' },
];

export const FROG_OUTFITS: SceneOptionInfo<FrogOutfitId>[] = [
  { id: 'none', name: 'No Outfit (Natural)', emoji: '🌱', desc: 'Pure classic frog appearance', tag: 'Simple' },
  { id: 'kbbq_pitmaster_apron', name: 'K-BBQ Pitmaster Apron', emoji: '🦺', desc: 'Heavy black canvas grillmaster apron with brass clips, towel loop & flame patch', tag: 'K-BBQ' },
  { id: 'kbbq_retro_tracksuit', name: 'Retro Diner Tracksuit', emoji: '🥋', desc: 'Vintage emerald green tracksuit with crisp white racing stripes', tag: 'Retro' },
  { id: 'kbbq_hanbok_vest', name: 'Modern Hanbok Vest', emoji: '👘', desc: 'Midnight navy silk jeogori vest with golden embroidery & tassel knots', tag: 'Tradition' },
  { id: 'field_scout_parka', name: 'Wilderness Scout Parka', emoji: '🧥', desc: 'Earthy green mountain parka with compass badge & utility cargo pockets', tag: 'Camp' },
  { id: 'flannel_camp_vest', name: 'Lumberjack Fleece Vest', emoji: '🦺', desc: 'Buffalo red-black plaid flannel shirt with sherpa fleece vest', tag: 'Camp' },
  { id: 'cozy_sleeping_bag', name: 'Snug Mummy Sleeping Bag', emoji: '🏕️', desc: 'Toasty insulated forest green down sleeping cocoon', tag: 'Camp' },
  { id: 'arcade_gamer_bomber', name: 'Synthwave Arcade Bomber', emoji: '🧥', desc: 'Purple satin jacket with neon cyan 8-bit patches', tag: 'Retro' },
  { id: 'pixel_hero_armor', name: '8-Bit Knight Armor', emoji: '🛡️', desc: 'Pixel RPG silver breastplate with heroic royal cape', tag: 'Retro' },
  { id: 'retro_esports_jersey', name: 'Arcade Champion Jersey', emoji: '👕', desc: 'Neon esports gamer tee with pixel lightning bolt', tag: 'Retro' },
  { id: 'konbini_staff_uniform', name: 'Konbini Clerk Uniform', emoji: '🏪', desc: 'Striped staff polo vest with name badge & pen pocket', tag: 'Konbini' },
  { id: 'shopper_cozy_sweatset', name: 'Midnight Shopper Hoodie', emoji: '🛍️', desc: 'Oversized fleece lounge hoodie & comfy lounge pants', tag: 'Cozy' },
  { id: 'red_riding_dress', name: 'Fairytale Dirndl Dress', emoji: '👗', desc: 'Crimson embroidered folk corset with white frills', tag: 'Fairytale' },
  { id: 'wolf_fur_cloak', name: 'Timber Wolf Fur Cloak', emoji: '🐺', desc: 'Warm charcoal pelt cloak with bone toggle clasp', tag: 'Fairytale' },
  { id: 'hunter_woodsman', name: 'Woodcutter Leather Tunic', emoji: '🪓', desc: 'Earthy forest tunic with brass buckles & pouch', tag: 'Fairytale' },
  { id: 'sushi_chef_happi', name: 'Itamae Chef Happi Coat', emoji: '🥋', desc: 'Navy & white ocean wave patterned sushi coat', tag: 'Gourmet' },
  { id: 'sushi_kimono_waiter', name: 'Izakaya Server Kimono', emoji: '🏮', desc: 'Indigo dining robe with vermillion belt sash', tag: 'Gourmet' },
  { id: 'kimono', name: 'Ceremonial Kimono', emoji: '👘', desc: 'Traditional indigo yukata with gold obi sash', tag: 'Zen' },
  { id: 'raincoat', name: 'Yellow Raincoat', emoji: '🧥', desc: 'Bright waterproof slicker with toggle buttons', tag: 'Cute' },
  { id: 'sweater', name: 'Cozy Knit Sweater', emoji: '🧶', desc: 'Warm autumn sweater with cable knit pattern', tag: 'Cozy' },
  { id: 'ninja', name: 'Shadow Shinobi Garb', emoji: '🥷', desc: 'Sleek stealth black robes with red trim', tag: 'Stealth' },
  { id: 'sailor', name: 'Sailor Suit', emoji: '⚓', desc: 'Navy blue striped collar uniform', tag: 'Cute' },
  { id: 'apron', name: 'Craft & Garden Apron', emoji: '🪴', desc: 'Earthy canvas apron with front tool pockets', tag: 'Work' },
  { id: 'overalls', name: 'Denim Overalls', emoji: '👖', desc: 'Vintage blue dungarees with brass buckles', tag: 'Casual' },
  { id: 'scarf', name: 'Fluffy Wool Scarf', emoji: '🧣', desc: 'Long crimson scarf dancing in the breeze', tag: 'Cozy' },
  { id: 'business', name: 'Gentleman Suit & Tie', emoji: '👔', desc: 'Sharp black waistcoat and crimson bowtie', tag: 'Fancy' },
  { id: 'hoodie', name: 'Croakle Oversized Hoodie', emoji: '🐸', desc: 'Ultra-soft pastel green frog ear hoodie', tag: 'Casual' },
];

export const FROG_GLASSES: SceneOptionInfo<FrogGlassesId>[] = [
  { id: 'none', name: 'No Glasses', emoji: '✨', desc: 'Clear natural eyes', tag: 'Simple' },
  { id: 'kbbq_tasty_blush_steam', name: 'Sizzling Feast Blush & Steam', emoji: '♨️', desc: 'Rosy blushing cheeks with hot sizzling smoke wisps & sparkle stars', tag: 'K-BBQ' },
  { id: 'kbbq_smoke_goggles', name: 'Grillmaster Smoke Goggles', emoji: '🥽', desc: 'Protective tinted grillmaster visor goggles with metallic frame', tag: 'K-BBQ' },
  { id: 'campfire_warm_glow', name: 'Campfire Rosy Glow', emoji: '🔥', desc: 'Warm bonfire embers reflecting on cute rosy cheeks', tag: 'Camp' },
  { id: 'explorer_binoculars', name: 'Field Scout Binoculars', emoji: '🔭', desc: 'Compact wilderness birdwatching binoculars around neck', tag: 'Camp' },
  { id: 'cyber_pixel_shades', name: 'Deal-With-It Pixel Shades', emoji: '🕶️', desc: 'Legendary 8-bit stepped pixel sunglasses with cyan gleam', tag: 'Retro' },
  { id: 'game_over_dizzy', name: 'Game Over Spiral Eyes', emoji: '💫', desc: 'Cute animated cartoon pixel spiral swirl eyes', tag: 'Retro' },
  { id: 'scanner_headset', name: 'Clerk Headset & Mic', emoji: '🎧', desc: 'Smart communication headset with cashier mic', tag: 'Konbini' },
  { id: 'konbini_blush', name: 'Midnight Shopping Blush', emoji: '💖', desc: 'Warm rosy cheeks with cute snack sparkle', tag: 'Cute' },
  { id: 'forest_blush_freckles', name: 'Forest Rosy Freckles', emoji: '🍓', desc: 'Whimsical storybook freckles with sweet rosy glow', tag: 'Fairytale' },
  { id: 'wolf_snarl_fangs', name: 'Wolf Mischief Fangs', emoji: '🦷', desc: 'Playful cute sharp wolf fangs grin', tag: 'Fairytale' },
  { id: 'wasabi_sparkle', name: 'Wasabi Twinkle Glint', emoji: '✨', desc: 'Zesty wasabi sparkle eye gleam', tag: 'Gourmet' },
  { id: 'reading', name: 'Round Scholar Spectacles', emoji: '👓', desc: 'Gold wire round reading frames', tag: 'Smart' },
  { id: 'sunglasses', name: 'Pixel Cool Shades', emoji: '🕶️', desc: 'Retro 8-bit black tinted sunglasses', tag: 'Cool' },
  { id: 'monocle', name: 'Aristocrat Monocle', emoji: '🧐', desc: 'Gold rimmed monocle on a fine chain', tag: 'Fancy' },
  { id: 'blush_stars', name: 'Starry Rosy Cheeks', emoji: '⭐', desc: 'Golden twinkle stars on rosy cheeks', tag: 'Cute' },
  { id: 'sparkles', name: 'Shining Aura Sparkles', emoji: '✨', desc: 'Floating magical luminescence', tag: 'Magic' },
  { id: 'eyepatch', name: 'Pirate Captain Eyepatch', emoji: '🏴‍☠️', desc: 'Leather eyepatch with tiny skull decal', tag: 'Adventure' },
];

export const FROG_SKINS: SceneOptionInfo<FrogSkinId>[] = [
  { id: 'classic', name: 'Classic Moss Green', emoji: '🐸', desc: 'Original peaceful woodland green hue', tag: 'Classic' },
  { id: 'kbbq_caramelized_amber', name: 'Caramelized Honey Amber', emoji: '🍯', desc: 'Glistening honey caramelized glazed BBQ glaze tone', tag: 'K-BBQ' },
  { id: 'kbbq_gochujang_crimson', name: 'Sweet Gochujang Crimson', emoji: '🌶️', desc: 'Vibrant sweet & spicy Korean chili pepper red glow', tag: 'K-BBQ' },
  { id: 'pine_forest_moss', name: 'Deep Pine Needle Green', emoji: '🌲', desc: 'Rich evergreen pine forest moss tone with golden speckles', tag: 'Camp' },
  { id: 'ember_glow_amber', name: 'Campfire Ember Warmth', emoji: '🔥', desc: 'Luminous warm honey flame amber glow', tag: 'Camp' },
  { id: 'cyber_neon_violet', name: 'Synthwave Cyber Violet', emoji: '🟣', desc: 'Electric neon purple frog with glowing mint belly', tag: 'Retro' },
  { id: 'gameboy_monochrome', name: 'Dot Matrix LCD Green', emoji: '🟩', desc: 'Authentic 4-shade nostalgic olive green Gameboy skin', tag: 'Retro' },
  { id: 'konbini_mint', name: 'Neon Konbini Mint', emoji: '🟢', desc: 'Vivid mint neon green with lime accents', tag: 'Neon' },
  { id: 'fairytale_rose', name: 'Fairytale Rosy Blush', emoji: '🌹', desc: 'Soft enchanted storybook blossom petal skin', tag: 'Fairytale' },
  { id: 'timber_wolf_grey', name: 'Timber Wolf Slate', emoji: '🐺', desc: 'Mysterious moonlit slate grey forest coat', tag: 'Fairytale' },
  { id: 'wasabi_green', name: 'Fresh Wasabi Zest', emoji: '🌱', desc: 'Bright zesty lime green itamae tone', tag: 'Gourmet' },
  { id: 'salmon_peach', name: 'Salmon Roe Peach', emoji: '🍣', desc: 'Warm glowing salmon peach skin', tag: 'Gourmet' },
  { id: 'golden', name: 'Golden Sun Treefrog', emoji: '✨', desc: 'Luminous warm golden honey tone', tag: 'Rare' },
  { id: 'sakura_pink', name: 'Sakura Pastel Pink', emoji: '🌸', desc: 'Soft blushing petal pink skin', tag: 'Cute' },
  { id: 'twilight_blue', name: 'Twilight Deep Blue', emoji: '🌌', desc: 'Mystical midnight blue with cyan undertones', tag: 'Mystic' },
  { id: 'matcha', name: 'Matcha Cream Green', emoji: '🍵', desc: 'Gentle pastel matcha cream shade', tag: 'Pastel' },
  { id: 'albino_white', name: 'Snow Albino Pearl', emoji: '❄️', desc: 'Pure glistening snow white with soft pinks', tag: 'Epic' },
  { id: 'ember_orange', name: 'Ember Flame Orange', emoji: '🔥', desc: 'Vibrant autumn fiery orange warmth', tag: 'Fiery' },
];

export const FROG_COMPANIONS: SceneOptionInfo<FrogCompanionId>[] = [
  { id: 'none', name: 'Solo Time', emoji: '🌱', desc: 'Quiet peaceful sanctuary alone', tag: 'Solitude' },
  { id: 'kbbq_sizzle_piglet', name: 'Sizzle the Chef Piglet', emoji: '🐷', desc: 'Cute rosy chibi piglet wearing a chef bandana & cheering with mini tongs', tag: 'K-BBQ' },
  { id: 'kbbq_kimchi_ferment_pot', name: 'Onggi the Ferment Pot', emoji: '🏺', desc: 'Traditional earthenware clay kimchi pot with cute smiling face & steam', tag: 'K-BBQ' },
  { id: 'forest_camp_fawn', name: 'Maple the Camping Fawn', emoji: '🦌', desc: 'Gentle baby deer curled beside the tent with white spots', tag: 'Camp' },
  { id: 'campfire_raccoon', name: 'Bandit the Camp Raccoon', emoji: '🦝', desc: 'Cheeky masked raccoon nibbling toasted campfire bread', tag: 'Camp' },
  { id: 'pixel_arcade_ghost', name: 'Blinky the 8-Bit Ghost', emoji: '👻', desc: 'Playful floating pixel maze ghost with bobbing animation', tag: 'Retro' },
  { id: 'retro_tamagotchi', name: 'Tama the Virtual Pet', emoji: '📟', desc: 'Egg-shaped keychain pixel virtual pet companion', tag: 'Retro' },
  { id: 'konbini_cashier_cat', name: 'Lucky Konbini Cashier Cat', emoji: '🐱', desc: 'Waving lucky maneki-neko in konbini uniform', tag: 'Konbini' },
  { id: 'snack_shiba', name: 'Snack Basket Shiba', emoji: '🐕', desc: 'Adorable shiba inu curled in a shopping basket', tag: 'Konbini' },
  { id: 'chibi_wolf_pup', name: 'Lupo the Chibi Wolf Pup', emoji: '🐺', desc: 'Playful baby wolf with gold eyes & wagging tail', tag: 'Fairytale' },
  { id: 'forest_hedgehog', name: 'Spike the Forest Hedgehog', emoji: '🦔', desc: 'Cozy prickly friend carrying fresh strawberries', tag: 'Fairytale' },
  { id: 'sushi_apprentice_cat', name: 'Chef Tama the Calico', emoji: '🐱', desc: 'Apprentice sushi cat wearing a mini headband', tag: 'Gourmet' },
  { id: 'mini_ebi_shrimp', name: 'Panko the Mini Shrimp', emoji: '🍤', desc: 'Tiny dancing tempura prawn with crispy tail', tag: 'Gourmet' },
  { id: 'snail', name: 'Maimai the Snail', emoji: '🐌', desc: 'Whimsical slow traveler with spiral shell', tag: 'Friend' },
  { id: 'crab', name: 'Kani the Crab', emoji: '🦀', desc: 'Cheerful little crab with waving pinchers', tag: 'Friend' },
  { id: 'fireflies', name: 'Hotaru Fireflies', emoji: '✨', desc: 'Dancing glowing light particles', tag: 'Atmosphere' },
  { id: 'butterfly', name: 'Flutter Butterfly', emoji: '🦋', desc: 'Delicate pastel blue winged visitor', tag: 'Wildlife' },
  { id: 'koi', name: 'Nishikigoi Carp', emoji: '🎏', desc: 'Swimming red & white lucky carp', tag: 'Water' },
  { id: 'duckling', name: 'Piyo the Yellow Duckling', emoji: '🐤', desc: 'Adorable fluffy duck paddling gently', tag: 'Cute' },
  { id: 'cat', name: 'Luna the Starry Kitten', emoji: '🐱', desc: 'Sleepy black cat with starlight collar', tag: 'Pet' },
  { id: 'turtle', name: 'Kame the Mossy Turtle', emoji: '🐢', desc: 'Ancient wise turtle resting peacefully', tag: 'Friend' },
];

export const FROG_WEATHERS: SceneOptionInfo<FrogWeatherId>[] = [
  { id: 'auto', name: 'Auto Real-Time', emoji: '⏰', desc: 'Syncs with real clock & your mood', tag: 'Smart' },
  { id: 'sunny', name: 'Sunny Morning', emoji: '☀️', desc: 'Clear vibrant daylight with sun rays', tag: 'Day' },
  { id: 'golden', name: 'Golden Hour Dusk', emoji: '🌅', desc: 'Warm amber sunset glow', tag: 'Evening' },
  { id: 'starry', name: 'Starry Midnight', emoji: '🌙', desc: 'Deep indigo night sky & twinkling stars', tag: 'Night' },
  { id: 'rainy', name: 'Gentle Rain', emoji: '🌧️', desc: 'Calming pixel rainfall ripples', tag: 'Calm' },
  { id: 'petals', name: 'Petal Shower', emoji: '🌸', desc: 'Drifting sakura petals breeze', tag: 'Peaceful' },
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
  | 'scenes'
  | 'weather';

export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ShopItem {
  id: string;
  slot: 'hatId' | 'outfitId' | 'glassesId' | 'skinId' | 'activityId' | 'companionId' | 'sceneId' | 'weatherId';
  value: string;
  category: ShopCategory;
  name: string;
  desc: string;
  price: number;
  emoji: string;
  rarity: ItemRarity;
  defaultUnlocked?: boolean;
  previewBg?: string;
}

export const WEATHER_ITEMS: ShopItem[] = FROG_WEATHERS.map((w) => ({
  id: `weather_${w.id}`,
  slot: 'weatherId',
  value: w.id,
  category: 'weather',
  name: w.name,
  desc: w.desc,
  price: 0,
  emoji: w.emoji,
  rarity: 'common',
  defaultUnlocked: true,
}));

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
  gachaTickets: number; // Gacha summon tickets
  ownedItemIds: string[];
  lastDailyClaimDate?: string;
  transactions?: CoinTransaction[];
  gachaPityCounter?: number; // Pity pull count towards guaranteed SR
  wishlistIds?: string[]; // Hearted items in gacha lineups
  completedSetClaimedIds?: string[]; // Set IDs where completion reward has been claimed
}

export const DEFAULT_FROG_SHOP_STATE: FrogShopState = {
  coins: 200, // Welcome coins so user can try their first Gacha summon right away!
  gachaTickets: 1, // 1 Free starter Gacha Ticket
  ownedItemIds: [
    // Base starter essentials only (all other items are locked to be pulled from Gacha)
    'hat_none',
    'outfit_none',
    'glasses_none',
    'skin_classic',
    'prop_relaxing',
    'companion_none',
    'scene_sauna_bathhouse',
  ],
  transactions: [
    {
      id: 'tx_welcome',
      title: 'Welcome to Croakle Gift 🎁 (+200 Coins, +1 Ticket)',
      amount: 200,
      date: new Date().toISOString().slice(0, 10),
      type: 'earn',
    },
  ],
};




