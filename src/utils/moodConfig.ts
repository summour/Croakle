export interface MoodThemeConfig {
  value: number;
  label: string;
  abbr: string;
  letter: string;
  hexColor: string;
  cellBg: string;
  cellTextColor: string;
  badgeBg: string;
  cardBgClass: string;
  cardTextClass: string;
}

export const MOOD_THEMES: MoodThemeConfig[] = [
  {
    value: 5,
    label: 'Rad',
    abbr: 'RAD',
    letter: 'R',
    hexColor: '#F59E0B', // Vibrant Amber Gold
    cellBg: 'bg-[#F59E0B]',
    cellTextColor: 'text-[#1F1B1A]',
    badgeBg: '',
    cardBgClass: 'bg-[#F59E0B]',
    cardTextClass: 'text-[#1F1B1A]',
  },
  {
    value: 4,
    label: 'Good',
    abbr: 'GOOD',
    letter: 'G',
    hexColor: '#EC4899', // Pink
    cellBg: 'bg-[#EC4899]',
    cellTextColor: 'text-white',
    badgeBg: '',
    cardBgClass: 'bg-[#EC4899]',
    cardTextClass: 'text-white',
  },
  {
    value: 3,
    label: 'Meh',
    abbr: 'MEH',
    letter: 'M',
    hexColor: '#10B981', // Emerald Green
    cellBg: 'bg-[#10B981]',
    cellTextColor: 'text-white',
    badgeBg: '',
    cardBgClass: 'bg-[#10B981]',
    cardTextClass: 'text-white',
  },
  {
    value: 2,
    label: 'Bad',
    abbr: 'BAD',
    letter: 'B',
    hexColor: '#0284C7', // Sky Blue
    cellBg: 'bg-[#0284C7]',
    cellTextColor: 'text-white',
    badgeBg: '',
    cardBgClass: 'bg-[#0284C7]',
    cardTextClass: 'text-white',
  },
  {
    value: 1,
    label: 'Awful',
    abbr: 'AWF',
    letter: 'A',
    hexColor: '#8B5CF6', // Purple
    cellBg: 'bg-[#8B5CF6]',
    cellTextColor: 'text-white',
    badgeBg: '',
    cardBgClass: 'bg-[#8B5CF6]',
    cardTextClass: 'text-white',
  },
];

export function getMoodTheme(value: number | null | undefined): MoodThemeConfig | undefined {
  if (value === null || value === undefined) return undefined;
  return MOOD_THEMES.find((m) => m.value === value);
}
