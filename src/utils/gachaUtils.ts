import { ShopItem, GachaGrade } from '../types';

export function getGachaGrade(item: ShopItem): GachaGrade {
  if (!item) return 'N';
  if (
    item.rarity === 'legendary' ||
    item.category === 'scenes' ||
    item.id.includes('skin_golden') ||
    item.id.includes('skin_sakura') ||
    item.id.includes('skin_albino')
  ) {
    return 'SR';
  }
  if (
    item.rarity === 'epic' ||
    item.category === 'companions' ||
    item.category === 'hats' ||
    item.id.includes('samurai') ||
    item.id.includes('crown') ||
    item.id.includes('kimono')
  ) {
    return 'R';
  }
  return 'N';
}
