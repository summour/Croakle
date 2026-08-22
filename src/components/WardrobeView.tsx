import React, { useState, useMemo } from 'react';
import {
  PixelSceneConfig,
  FrogShopState,
  ShopCategory,
  ShopItem,
  FrogOutfitId,
  FrogHatId,
  FrogGlassesId,
  FrogSkinId,
  FrogActivityId,
  SceneLocationId,
  FrogCompanionId,
  FROG_WEATHERS,
} from '../types';
import { SHOP_CATALOG } from '../data/shopCatalog';
import { THEMED_FROG_SETS } from '../data/themedSets';
import { PixelFrogScene } from './PixelFrogScene';
import { LilyCoinIcon } from './FrogIcons';
import { PixelItemThumbnail } from './PixelItemThumbnail';
import { ItemDetailModal } from './ItemDetailModal';
import { getGachaGrade } from '../utils/gachaUtils';
import {
  ArrowLeft,
  Shirt,
  Sparkles,
  Shuffle,
  RotateCcw,
  Check,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine, triggerHaptic } from '../utils/audioUtils';

interface WardrobeCategoryOption {
  id: ShopCategory | 'sets' | 'weather' | 'all';
  label: string;
  icon: string;
}

const WARDROBE_CATEGORIES: WardrobeCategoryOption[] = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'hats', label: 'Headwear', icon: '👒' },
  { id: 'outfits', label: 'Outfits', icon: '👘' },
  { id: 'accessories', label: 'Glasses', icon: '👓' },
  { id: 'skins', label: 'Skin', icon: '🐸' },
  { id: 'props', label: 'Props', icon: '🧋' },
  { id: 'companions', label: 'Pets', icon: '🐌' },
  { id: 'scenes', label: 'Habitats', icon: '🏞️' },
  { id: 'weather', label: 'Weather', icon: '☀️' },
  { id: 'sets', label: 'Full Sets', icon: '🎁' },
];

const WEATHER_ITEMS: ShopItem[] = FROG_WEATHERS.map((w) => ({
  id: `weather_${w.id}`,
  slot: 'activityId' as any,
  value: w.id,
  category: 'scenes',
  name: w.name,
  desc: w.desc,
  price: 0,
  emoji: w.emoji,
  rarity: 'common',
  defaultUnlocked: true,
}));

interface WardrobeViewProps {
  config: PixelSceneConfig;
  onUpdateConfig: (patch: Partial<PixelSceneConfig>) => void;
  shopState: FrogShopState;
  onToggleWishlist?: (itemId: string) => void;
  onBack?: () => void;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
}

export const WardrobeView: React.FC<WardrobeViewProps> = ({
  config,
  onUpdateConfig,
  shopState,
  onToggleWishlist,
  onBack,
  soundEnabled = true,
  hapticEnabled = true,
}) => {
  // Live fitting config
  const [previewConfig, setPreviewConfig] = useState<PixelSceneConfig>({ ...config });

  // Category filter
  const [wardrobeCategory, setWardrobeCategory] = useState<ShopCategory | 'sets' | 'weather' | 'all'>('all');

  // Item Detail Modal
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<ShopItem | null>(null);

  const isItemOwned = (itemId: string) => {
    if (itemId.includes('none') || itemId === 'skin_classic' || itemId.startsWith('weather_')) return true;
    return shopState.ownedItemIds.includes(itemId);
  };

  // Owned items list
  const ownedWardrobeItems = useMemo(() => {
    let list: ShopItem[] = [];
    if (wardrobeCategory === 'all') {
      list = [...SHOP_CATALOG, ...WEATHER_ITEMS];
    } else if (wardrobeCategory === 'weather') {
      list = WEATHER_ITEMS;
    } else if (wardrobeCategory !== 'sets') {
      list = SHOP_CATALOG.filter((i) => i.category === wardrobeCategory);
    }
    return list.filter((i) => isItemOwned(i.id));
  }, [wardrobeCategory, shopState.ownedItemIds]);

  const isItemEquippedInPreview = (item: ShopItem) => {
    if (item.category === 'hats') return previewConfig.hatId === item.value;
    if (item.category === 'outfits') return previewConfig.outfitId === item.value;
    if (item.category === 'accessories') return previewConfig.glassesId === item.value;
    if (item.category === 'skins') return previewConfig.skinId === item.value;
    if (item.category === 'props') return previewConfig.activityId === item.value;
    if (item.category === 'companions') return previewConfig.companionId === item.value;
    if (item.category === 'scenes') return previewConfig.sceneId === item.value;
    return false;
  };

  const handleWardrobeEquip = (item: ShopItem) => {
    if (soundEnabled) soundEngine.playEquipSound();
    if (hapticEnabled) triggerHaptic();

    const patch: Partial<PixelSceneConfig> = {};
    if (item.category === 'hats' || item.slot === 'hatId') patch.hatId = item.value as FrogHatId;
    if (item.category === 'outfits' || item.slot === 'outfitId') patch.outfitId = item.value as FrogOutfitId;
    if (item.category === 'accessories' || item.slot === 'glassesId') patch.glassesId = item.value as FrogGlassesId;
    if (item.category === 'skins' || item.slot === 'skinId') patch.skinId = item.value as FrogSkinId;
    if (item.category === 'props' || item.slot === 'activityId') patch.activityId = item.value as FrogActivityId;
    if (item.category === 'companions' || item.slot === 'companionId') patch.companionId = item.value as FrogCompanionId;
    if (item.category === 'scenes' || item.slot === 'sceneId') patch.sceneId = item.value as SceneLocationId;

    setPreviewConfig((prev) => ({ ...prev, ...patch }));
  };

  const handleSaveLook = () => {
    if (soundEnabled) soundEngine.playCompleteSound();
    if (hapticEnabled) triggerHaptic();

    onUpdateConfig(previewConfig);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.45 },
      colors: ['#5f7a61', '#b86f52', '#d4a373', '#e8ded1'],
    });
  };

  const handleResetLook = () => {
    if (soundEnabled) soundEngine.playTapSound();
    setPreviewConfig({ ...config });
  };

  const handleSurpriseMix = () => {
    if (soundEnabled) soundEngine.playTapSound();
    if (hapticEnabled) triggerHaptic();

    const ownedHats = SHOP_CATALOG.filter((i) => (i.category === 'hats' || i.slot === 'hatId') && isItemOwned(i.id));
    const ownedOutfits = SHOP_CATALOG.filter((i) => (i.category === 'outfits' || i.slot === 'outfitId') && isItemOwned(i.id));
    const ownedGlasses = SHOP_CATALOG.filter((i) => (i.category === 'accessories' || i.slot === 'glassesId') && isItemOwned(i.id));
    const ownedSkins = SHOP_CATALOG.filter((i) => (i.category === 'skins' || i.slot === 'skinId') && isItemOwned(i.id));
    const ownedProps = SHOP_CATALOG.filter((i) => (i.category === 'props' || i.slot === 'activityId') && isItemOwned(i.id));
    const ownedComps = SHOP_CATALOG.filter((i) => (i.category === 'companions' || i.slot === 'companionId') && isItemOwned(i.id));
    const ownedScenes = SHOP_CATALOG.filter((i) => (i.category === 'scenes' || i.slot === 'sceneId') && isItemOwned(i.id));

    const pickRandom = (arr: any[]) => (arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)].value : undefined);

    setPreviewConfig((prev) => ({
      ...prev,
      hatId: (pickRandom(ownedHats) as FrogHatId) || prev.hatId,
      outfitId: (pickRandom(ownedOutfits) as FrogOutfitId) || prev.outfitId,
      glassesId: (pickRandom(ownedGlasses) as FrogGlassesId) || prev.glassesId,
      skinId: (pickRandom(ownedSkins) as FrogSkinId) || prev.skinId,
      activityId: (pickRandom(ownedProps) as FrogActivityId) || prev.activityId,
      companionId: (pickRandom(ownedComps) as FrogCompanionId) || prev.companionId,
      sceneId: (pickRandom(ownedScenes) as SceneLocationId) || prev.sceneId,
    }));
  };

  return (
    <div className="space-y-3 pb-28">
      {/* 1. TOP HEADER */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-white/90 dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.1] flex items-center justify-center text-[#4a4036] dark:text-[#e0d6cb] shadow-xs active:scale-95 transition ios-tap"
              title="Back to Home"
            >
              <ArrowLeft size={17} />
            </button>
          )}
          <div>
            <h2 className="text-lg font-black tracking-tight text-[#2d2823] dark:text-[#f4efe8] flex items-center gap-1.5">
              <span>👗</span>
              <span>Frog Wardrobe</span>
            </h2>
            <p className="text-[11px] text-[#8c7e70] dark:text-[#a89b8d] font-medium">
              Dress up your sanctuary frog & change habitats
            </p>
          </div>
        </div>

        {/* Lily Coin Balance */}
        <div className="h-8 pl-2.5 pr-3 rounded-full bg-white/90 dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.1] flex items-center gap-1.5 shadow-xs shrink-0">
          <LilyCoinIcon size={18} />
          <span className="text-xs font-black text-[#2d2823] dark:text-[#f4efe8] tracking-tight">
            {shopState.coins}
          </span>
        </div>
      </div>

      {/* 2. FULL SCENE BACKGROUND DIORAMA PREVIEW */}
      <div className="relative h-[250px] sm:h-[280px] rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm bg-gradient-to-b from-[#e8eff0] via-[#f5f1eb] to-[#ede4d8] dark:from-[#202528] dark:via-[#1c1816] dark:to-[#171412]">
        <div className="absolute inset-0">
          <PixelFrogScene
            config={previewConfig}
            size="large"
            showInfoBar={false}
            soundEnabled={soundEnabled}
          />
        </div>

        {/* Top Floating Actions: Surprise Mix, Reset */}
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleSurpriseMix}
            className="w-8 h-8 rounded-full bg-white/85 dark:bg-black/60 hover:bg-white text-[#4a4036] dark:text-[#e0d6cb] border border-black/10 flex items-center justify-center shadow-xs active:scale-90 transition"
            title="Surprise Mix"
          >
            <Shuffle size={14} />
          </button>

          <button
            type="button"
            onClick={handleResetLook}
            className="w-8 h-8 rounded-full bg-white/85 dark:bg-black/60 hover:bg-white text-[#4a4036] dark:text-[#e0d6cb] border border-black/10 flex items-center justify-center shadow-xs active:scale-90 transition"
            title="Reset"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Wear This Look Button (Floating bottom center) */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20">
          <button
            type="button"
            onClick={handleSaveLook}
            className="px-4 py-1.5 rounded-full text-xs font-black bg-[#5f7a61] hover:bg-[#4d6650] active:scale-95 text-white flex items-center gap-1.5 shadow-md transition"
          >
            <Check size={13} />
            <span>Wear This Look</span>
          </button>
        </div>
      </div>

      {/* 3. CATEGORY SELECTOR TABS */}
      <div className="overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center gap-1.5">
          {WARDROBE_CATEGORIES.map((cat) => {
            const isActive = wardrobeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  if (soundEnabled) soundEngine.playTapSound();
                  setWardrobeCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                  isActive
                    ? 'bg-[#5f7a61] text-white shadow-xs'
                    : 'bg-white/80 dark:bg-white/[0.08] text-[#554b3f] dark:text-[#c4b5a5] border border-black/[0.06] dark:border-white/[0.08]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. WARDROBE ITEMS GRID */}
      <div>
        {wardrobeCategory === 'sets' ? (
          /* Themed Sets Direct Equip */
          <div className="grid grid-cols-2 gap-2">
            {THEMED_FROG_SETS.map((set) => (
              <button
                key={set.id}
                type="button"
                onClick={() => {
                  if (soundEnabled) soundEngine.playTapSound();
                  if (hapticEnabled) triggerHaptic();
                  setPreviewConfig((prev) => ({
                    ...prev,
                    sceneId: set.items.sceneId,
                    outfitId: set.items.outfitId,
                    hatId: set.items.hatId,
                    glassesId: set.items.glassesId,
                    activityId: set.items.activityId,
                    companionId: set.items.companionId,
                    skinId: set.items.skinId,
                    weatherId: set.items.weatherId || 'auto',
                  }));
                }}
                className="p-2.5 rounded-2xl bg-white dark:bg-[#1f1a16] border border-black/[0.06] dark:border-white/[0.08] text-left flex items-center gap-2.5 hover:border-[#5f7a61] transition active:scale-98"
              >
                <span className="text-xl">{set.bannerEmoji}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-black text-[#2d2823] dark:text-[#f4efe8] truncate">
                    {set.name}
                  </h4>
                  <p className="text-[10px] text-[#8c7e70] dark:text-[#a89b8d] truncate">
                    {set.tagline}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Clean Item Thumbnails Grid (PICTURES ONLY) */
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
            {ownedWardrobeItems.map((item) => {
              const isEquipped = isItemEquippedInPreview(item);
              const grade = getGachaGrade(item);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleWardrobeEquip(item)}
                  className={`relative aspect-square rounded-2xl bg-white dark:bg-[#1f1a16] border flex items-center justify-center p-1 transition-all active:scale-95 shadow-2xs group overflow-hidden ${
                    isEquipped
                      ? 'border-[#5f7a61] ring-2 ring-[#5f7a61]/30 bg-[#5f7a61]/5'
                      : 'border-black/[0.06] dark:border-white/[0.08] hover:border-[#5f7a61]/50'
                  }`}
                  title={item.name}
                >
                  {/* Equipped Checkmark (Top Right) */}
                  {isEquipped && (
                    <div className="absolute top-1 right-1 z-10 w-4 h-4 rounded-full bg-[#5f7a61] text-white flex items-center justify-center shadow-xs">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}

                  {/* Grade Badge (Top Left) */}
                  <span
                    className={`absolute top-1 left-1 text-[7.5px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs z-10 ${
                      grade === 'SR'
                        ? 'bg-[#d4a373] text-[#2d2823]'
                        : grade === 'R'
                        ? 'bg-[#6b7b8c] text-white'
                        : 'bg-[#ebe4d8] dark:bg-stone-700 text-[#554b3f] dark:text-stone-300'
                    }`}
                  >
                    {grade}
                  </span>

                  {/* Pixel Art Thumbnail */}
                  <div className="transform scale-[1.1] group-hover:scale-[1.2] transition-transform">
                    <PixelItemThumbnail id={item.id} category={item.category} size={30} />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItemForDetail}
        isOpen={Boolean(selectedItemForDetail)}
        onClose={() => setSelectedItemForDetail(null)}
        isOwned={selectedItemForDetail ? isItemOwned(selectedItemForDetail.id) : false}
        isWishlisted={selectedItemForDetail ? shopState.wishlistIds?.includes(selectedItemForDetail.id) : false}
        onToggleWishlist={onToggleWishlist}
        soundEnabled={soundEnabled}
        hapticEnabled={hapticEnabled}
      />
    </div>
  );
};
