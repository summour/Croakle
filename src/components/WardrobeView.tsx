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
  FrogWeatherId,
  ThemedFrogSet,
  WEATHER_ITEMS,
} from '../types';
import { SHOP_CATALOG } from '../data/shopCatalog';
import { THEMED_FROG_SETS } from '../data/themedSets';
import { PixelFrogScene } from './PixelFrogScene';
import { LilyCoinIcon } from './FrogIcons';
import { PixelItemThumbnail } from './PixelItemThumbnail';
import { PixelIcon } from './PixelIcon';
import {
  ArrowLeft,
  Shirt,
  Shuffle,
  RotateCcw,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine, triggerHaptic } from '../utils/audioUtils';
import { getGachaGrade } from '../utils/gachaUtils';

type WardrobeMainTab = 'equipped' | 'all' | 'theme';

interface WardrobeCategoryOption {
  id: ShopCategory | 'weather' | 'all';
  label: string;
}

const WARDROBE_CATEGORIES: WardrobeCategoryOption[] = [
  { id: 'all', label: 'All' },
  { id: 'companions', label: 'Pets' },
  { id: 'outfits', label: 'Outfits' },
  { id: 'hats', label: 'Hats' },
  { id: 'accessories', label: 'Face' },
  { id: 'skins', label: 'Skins' },
  { id: 'props', label: 'Props' },
  { id: 'scenes', label: 'Habitats' },
  { id: 'weather', label: 'Weather' },
];

interface WardrobeViewProps {
  config: PixelSceneConfig;
  onUpdateConfig: (patch: Partial<PixelSceneConfig>) => void;
  shopState: FrogShopState;
  onToggleWishlist?: (itemId: string) => void;
  onOpenCoins?: () => void;
  onNavigateGacha?: () => void;
  onBack?: () => void;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
}

export const WardrobeView: React.FC<WardrobeViewProps> = ({
  config,
  onUpdateConfig,
  shopState,
  onOpenCoins,
  onNavigateGacha,
  onBack,
  soundEnabled = true,
  hapticEnabled = true,
}) => {
  // Live preview config
  const [previewConfig, setPreviewConfig] = useState<PixelSceneConfig>({ ...config });

  // Main View Mode: 'equipped' | 'all' | 'theme'
  const [mainTab, setMainTab] = useState<WardrobeMainTab>('equipped');

  // Sub-category filter for 'all' tab
  const [subCategory, setSubCategory] = useState<ShopCategory | 'weather' | 'all'>('all');

  // Selected Theme Set Filter (or 'all_sets')
  const [selectedThemeId, setSelectedThemeId] = useState<string>('all_sets');

  const isItemOwned = (itemId: string) => {
    if (itemId.includes('none') || itemId.startsWith('weather_')) return true;
    const catItem = SHOP_CATALOG.find((i) => i.id === itemId);
    if (catItem?.defaultUnlocked) return true;
    return shopState.ownedItemIds.includes(itemId);
  };

  const fullCatalogWithWeather = useMemo(() => {
    return [...SHOP_CATALOG, ...WEATHER_ITEMS];
  }, []);

  // ALL OWNED items for the "All" tab (pure owned items)
  const ownedItems = useMemo(() => {
    return fullCatalogWithWeather.filter((item) => {
      if (
        item.id.endsWith('_none') ||
        item.id === 'hat_none' ||
        item.id === 'outfit_none' ||
        item.id === 'glasses_none' ||
        item.id === 'companion_none'
      ) {
        return false;
      }
      return isItemOwned(item.id);
    });
  }, [fullCatalogWithWeather, shopState.ownedItemIds]);

  // Display items for "All" tab filtered by subCategory
  const displayAllOwnedItems = useMemo(() => {
    if (subCategory === 'all') {
      return ownedItems;
    } else if (subCategory === 'weather') {
      return WEATHER_ITEMS;
    } else {
      return ownedItems.filter((i) => i.category === subCategory);
    }
  }, [ownedItems, subCategory]);

  const isItemEquippedInPreview = (item: ShopItem) => {
    if (item.category === 'hats' || item.slot === 'hatId') return previewConfig.hatId === item.value;
    if (item.category === 'outfits' || item.slot === 'outfitId') return previewConfig.outfitId === item.value;
    if (item.category === 'accessories' || item.slot === 'glassesId') return previewConfig.glassesId === item.value;
    if (item.category === 'skins' || item.slot === 'skinId') return previewConfig.skinId === item.value;
    if (item.category === 'props' || item.slot === 'activityId') return previewConfig.activityId === item.value;
    if (item.category === 'companions' || item.slot === 'companionId') return previewConfig.companionId === item.value;
    if (item.category === 'scenes' || item.slot === 'sceneId') return previewConfig.sceneId === item.value;
    if (item.id.startsWith('weather_')) return previewConfig.weatherId === item.value;
    return false;
  };

  // Currently equipped items list (same item objects as in catalog)
  const equippedItems = useMemo(() => {
    const items: ShopItem[] = [];
    const seenIds = new Set<string>();

    const addItem = (it: ShopItem | undefined) => {
      if (it && !seenIds.has(it.id)) {
        seenIds.add(it.id);
        items.push(it);
      }
    };

    if (previewConfig.hatId && previewConfig.hatId !== 'none') {
      addItem(SHOP_CATALOG.find((i) => i.category === 'hats' && i.value === previewConfig.hatId));
    }
    if (previewConfig.outfitId && previewConfig.outfitId !== 'none') {
      addItem(SHOP_CATALOG.find((i) => i.category === 'outfits' && i.value === previewConfig.outfitId));
    }
    if (previewConfig.glassesId && previewConfig.glassesId !== 'none') {
      addItem(SHOP_CATALOG.find((i) => i.category === 'accessories' && i.value === previewConfig.glassesId));
    }
    if (previewConfig.skinId && previewConfig.skinId !== 'classic') {
      addItem(SHOP_CATALOG.find((i) => i.category === 'skins' && i.value === previewConfig.skinId));
    }
    if (previewConfig.activityId && previewConfig.activityId !== 'relaxing') {
      addItem(SHOP_CATALOG.find((i) => i.category === 'props' && i.value === previewConfig.activityId));
    }
    if (previewConfig.companionId && previewConfig.companionId !== 'none') {
      addItem(SHOP_CATALOG.find((i) => i.category === 'companions' && i.value === previewConfig.companionId));
    }
    if (previewConfig.sceneId && previewConfig.sceneId !== 'indoor') {
      addItem(SHOP_CATALOG.find((i) => i.category === 'scenes' && i.value === previewConfig.sceneId));
    }
    if (previewConfig.weatherId && previewConfig.weatherId !== 'auto') {
      addItem(WEATHER_ITEMS.find((w) => w.value === previewConfig.weatherId));
    }

    return items;
  }, [previewConfig]);

  // Handle toggling equip / unequip for any item
  const handleWardrobeEquip = (item: ShopItem) => {
    if (soundEnabled) soundEngine.playEquipSound();
    if (hapticEnabled) triggerHaptic();

    const isAlreadyEquipped = isItemEquippedInPreview(item);

    const patch: Partial<PixelSceneConfig> = {};
    if (item.category === 'hats' || item.slot === 'hatId') {
      patch.hatId = isAlreadyEquipped ? 'none' : (item.value as FrogHatId);
    }
    if (item.category === 'outfits' || item.slot === 'outfitId') {
      patch.outfitId = isAlreadyEquipped ? 'none' : (item.value as FrogOutfitId);
    }
    if (item.category === 'accessories' || item.slot === 'glassesId') {
      patch.glassesId = isAlreadyEquipped ? 'none' : (item.value as FrogGlassesId);
    }
    if (item.category === 'skins' || item.slot === 'skinId') {
      patch.skinId = isAlreadyEquipped ? 'classic' : (item.value as FrogSkinId);
    }
    if (item.category === 'props' || item.slot === 'activityId') {
      patch.activityId = isAlreadyEquipped ? 'relaxing' : (item.value as FrogActivityId);
    }
    if (item.category === 'companions' || item.slot === 'companionId') {
      patch.companionId = isAlreadyEquipped ? 'none' : (item.value as FrogCompanionId);
    }
    if (item.category === 'scenes' || item.slot === 'sceneId') {
      patch.sceneId = isAlreadyEquipped ? 'indoor' : (item.value as SceneLocationId);
    }
    if (item.id.startsWith('weather_')) {
      patch.weatherId = isAlreadyEquipped ? 'auto' : (item.value as any);
    }

    setPreviewConfig((prev) => ({ ...prev, ...patch }));
  };

  // Wear all owned pieces of a theme set
  const handleWearOwnedThemeSet = (set: ThemedFrogSet) => {
    if (soundEnabled) soundEngine.playEquipSound();
    if (hapticEnabled) triggerHaptic();

    const patch: Partial<PixelSceneConfig> = {};

    const ownedSetItems = SHOP_CATALOG.filter(
      (item) => set.itemIds.includes(item.id) && isItemOwned(item.id)
    );

    ownedSetItems.forEach((item) => {
      if (item.category === 'hats' || item.slot === 'hatId') patch.hatId = item.value as FrogHatId;
      if (item.category === 'outfits' || item.slot === 'outfitId') patch.outfitId = item.value as FrogOutfitId;
      if (item.category === 'accessories' || item.slot === 'glassesId') patch.glassesId = item.value as FrogGlassesId;
      if (item.category === 'skins' || item.slot === 'skinId') patch.skinId = item.value as FrogSkinId;
      if (item.category === 'props' || item.slot === 'activityId') patch.activityId = item.value as FrogActivityId;
      if (item.category === 'companions' || item.slot === 'companionId') patch.companionId = item.value as FrogCompanionId;
      if (item.category === 'scenes' || item.slot === 'sceneId') patch.sceneId = item.value as SceneLocationId;
    });

    if (set.items.weatherId) {
      patch.weatherId = set.items.weatherId;
    }

    setPreviewConfig((prev) => ({ ...prev, ...patch }));
  };

  // Save current preview look to persistent app state
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

  // Surprise random combination of owned items
  const handleSurpriseMix = () => {
    if (soundEnabled) soundEngine.playTapSound();
    if (hapticEnabled) triggerHaptic();

    const ownedHats = ownedItems.filter((i) => i.category === 'hats' || i.slot === 'hatId');
    const ownedOutfits = ownedItems.filter((i) => i.category === 'outfits' || i.slot === 'outfitId');
    const ownedGlasses = ownedItems.filter((i) => i.category === 'accessories' || i.slot === 'glassesId');
    const ownedSkins = ownedItems.filter((i) => i.category === 'skins' || i.slot === 'skinId');
    const ownedProps = ownedItems.filter((i) => i.category === 'props' || i.slot === 'activityId');
    const ownedComps = ownedItems.filter((i) => i.category === 'companions' || i.slot === 'companionId');
    const ownedScenes = ownedItems.filter((i) => i.category === 'scenes' || i.slot === 'sceneId');

    const pickRandom = (arr: any[]) => (arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)].value : undefined);

    setPreviewConfig((prev) => ({
      ...prev,
      hatId: (pickRandom(ownedHats) as FrogHatId) || 'none',
      outfitId: (pickRandom(ownedOutfits) as FrogOutfitId) || 'none',
      glassesId: (pickRandom(ownedGlasses) as FrogGlassesId) || 'none',
      skinId: (pickRandom(ownedSkins) as FrogSkinId) || prev.skinId,
      activityId: (pickRandom(ownedProps) as FrogActivityId) || 'relaxing',
      companionId: (pickRandom(ownedComps) as FrogCompanionId) || 'none',
      sceneId: (pickRandom(ownedScenes) as SceneLocationId) || prev.sceneId,
    }));
  };

  const filteredThemeSets = useMemo(() => {
    if (selectedThemeId === 'all_sets') {
      return THEMED_FROG_SETS;
    }
    return THEMED_FROG_SETS.filter((s) => s.id === selectedThemeId);
  }, [selectedThemeId]);

  return (
    <div
      id="pokecolo-wardrobe-stage"
      className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none"
    >
      {/* 1. FULLSCREEN 3D ROOM & FROG BACKGROUND */}
      <PixelFrogScene
        config={previewConfig}
        fullscreen={true}
        showInfoBar={false}
        soundEnabled={soundEnabled}
        hapticEnabled={hapticEnabled}
      />

      {/* 2. TOP FLOATING HEADER BAR */}
      <header className="relative z-20 w-full flex items-center justify-between px-4 pt-3.5 pointer-events-auto">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              id="wardrobe-back-btn"
              type="button"
              onClick={() => {
                if (soundEnabled) soundEngine.playTapSound();
                onBack();
              }}
              className="w-8 h-8 rounded-full bg-white/95 dark:bg-[#1a1613]/95 hover:bg-white dark:hover:bg-black/90 backdrop-blur-md border border-black/10 dark:border-white/15 flex items-center justify-center text-[#2d2823] dark:text-[#f4efe8] shadow-sm active:scale-95 transition-all"
              title="Back"
            >
              <ArrowLeft size={16} />
            </button>
          )}

          <div className="px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#1a1613]/95 backdrop-blur-md border border-black/10 dark:border-white/15 shadow-sm flex items-center gap-1.5">
            <Shirt size={14} className="text-[#5f7a61] dark:text-[#8cb88f]" />
            <h2 className="text-xs font-black tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
              Wardrobe
            </h2>
          </div>
        </div>

        {/* Coins Counter Pill */}
        <button
          id="wardrobe-coins-btn"
          type="button"
          onClick={() => {
            if (soundEnabled) soundEngine.playTapSound();
            if (onOpenCoins) onOpenCoins();
          }}
          className="px-3 py-1.5 rounded-full text-xs font-black bg-white/95 dark:bg-[#1a1613]/95 hover:bg-white dark:hover:bg-black/90 active:scale-95 text-[#2d2823] dark:text-[#f4efe8] backdrop-blur-md transition-all flex items-center gap-1.5 border border-amber-500/40 shadow-sm"
        >
          <LilyCoinIcon size={14} />
          <span className="text-[#2d2823] dark:text-[#f4efe8]">{shopState.coins}</span>
        </button>
      </header>

      {/* 3. FLOATING UPPER RIGHT STAGE ACTIONS (Mix, Reset) */}
      <div className="relative z-20 flex items-center justify-end px-4 gap-1.5 mt-1 pointer-events-auto">
        <button
          type="button"
          onClick={handleSurpriseMix}
          className="w-8 h-8 rounded-full bg-white/95 dark:bg-[#1a1613]/95 hover:bg-white dark:hover:bg-black/90 backdrop-blur-md text-[#2d2823] dark:text-[#f4efe8] border border-black/10 dark:border-white/15 flex items-center justify-center shadow-sm active:scale-90 transition"
          title="Random Mix"
        >
          <Shuffle size={14} />
        </button>

        <button
          type="button"
          onClick={handleResetLook}
          className="w-8 h-8 rounded-full bg-white/95 dark:bg-[#1a1613]/95 hover:bg-white dark:hover:bg-black/90 backdrop-blur-md text-[#2d2823] dark:text-[#f4efe8] border border-black/10 dark:border-white/15 flex items-center justify-center shadow-sm active:scale-90 transition"
          title="Reset"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <div className="flex-1 w-full" />

      {/* 4. FLOATING SAVE BUTTON */}
      <div className="relative z-20 flex justify-center mb-2 px-4 pointer-events-auto">
        <button
          id="wardrobe-wear-look-btn"
          type="button"
          onClick={handleSaveLook}
          className="px-5 py-2 rounded-full text-xs font-black flex items-center gap-1.5 shadow-lg border transition-all bg-[#5f7a61] hover:bg-[#4d6650] active:scale-95 text-white border-white/40 dark:border-white/20"
        >
          <Check size={14} strokeWidth={3} />
          <span>Save Look</span>
        </button>
      </div>

      {/* 5. BOTTOM DRAWER WITH 3 PRIMARY TABS: EQUIPPED, ALL, THEME */}
      <div className="relative z-20 w-full bg-white/85 dark:bg-[#1a1613]/90 backdrop-blur-xl border-t border-white/60 dark:border-white/10 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.15)] px-4 pt-2.5 pb-24 flex flex-col gap-2 pointer-events-auto max-h-[48vh]">
        <div className="w-10 h-1 rounded-full bg-black/15 dark:bg-white/20 mx-auto" />

        {/* PRIMARY 3 NAVIGATION TABS (Equipped, All, Theme) */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-black/[0.05] dark:bg-white/[0.08]">
          <button
            id="tab-wardrobe-equipped"
            type="button"
            onClick={() => {
              if (soundEnabled) soundEngine.playTapSound();
              setMainTab('equipped');
            }}
            className={`py-1.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center ${
              mainTab === 'equipped'
                ? 'bg-white dark:bg-[#201c18] text-[#5f7a61] dark:text-[#8cb88f] shadow-xs'
                : 'text-[#554b3f] dark:text-[#c4b5a5] hover:text-[#2d2823]'
            }`}
          >
            <span>Equipped ({equippedItems.length})</span>
          </button>

          <button
            id="tab-wardrobe-all"
            type="button"
            onClick={() => {
              if (soundEnabled) soundEngine.playTapSound();
              setMainTab('all');
            }}
            className={`py-1.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center ${
              mainTab === 'all'
                ? 'bg-white dark:bg-[#201c18] text-[#5f7a61] dark:text-[#8cb88f] shadow-xs'
                : 'text-[#554b3f] dark:text-[#c4b5a5] hover:text-[#2d2823]'
            }`}
          >
            <span>All ({ownedItems.length})</span>
          </button>

          <button
            id="tab-wardrobe-theme"
            type="button"
            onClick={() => {
              if (soundEnabled) soundEngine.playTapSound();
              setMainTab('theme');
            }}
            className={`py-1.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center ${
              mainTab === 'theme'
                ? 'bg-white dark:bg-[#201c18] text-[#5f7a61] dark:text-[#8cb88f] shadow-xs'
                : 'text-[#554b3f] dark:text-[#c4b5a5] hover:text-[#2d2823]'
            }`}
          >
            <span>Theme</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: EQUIPPED (Same visual grid as other tabs)                         */}
        {/* ========================================================================= */}
        {mainTab === 'equipped' && (
          <div className="flex-1 overflow-y-auto no-scrollbar pr-0.5">
            {equippedItems.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d]">
                  No items currently equipped
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 pb-2">
                {equippedItems.map((item) => {
                  const grade = getGachaGrade(item);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleWardrobeEquip(item)}
                      className="relative aspect-square rounded-2xl bg-white dark:bg-[#1f1a16] border flex items-center justify-center p-1 transition-all active:scale-95 shadow-2xs group overflow-hidden border-[#5f7a61] ring-2 ring-[#5f7a61]/40 bg-[#5f7a61]/10"
                      title={`${item.name} [${grade}]`}
                    >
                      {/* Grade Badge */}
                      <span
                        className={`absolute top-1 left-1 font-pixel text-[7px] font-black px-1 py-[0.5px] rounded-[4px] leading-tight z-10 shadow-2xs pointer-events-none select-none ${
                          grade === 'SR'
                            ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] dark:bg-amber-950/90 dark:text-amber-200 dark:border-amber-700/80'
                            : grade === 'R'
                            ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] dark:bg-emerald-950/90 dark:text-emerald-200 dark:border-emerald-700/80'
                            : 'bg-[#F5F5F4] text-[#57534E] border border-[#E7E5E4] dark:bg-stone-800/90 dark:text-stone-300 dark:border-stone-700/70'
                        }`}
                      >
                        {grade}
                      </span>

                      <div className="absolute top-1 right-1 z-10 w-4 h-4 rounded-full bg-[#5f7a61] text-white flex items-center justify-center shadow-xs">
                        <Check size={10} strokeWidth={3} />
                      </div>

                      <div className="transform scale-[1.1] group-hover:scale-[1.2] transition-transform">
                        <PixelItemThumbnail id={item.id} category={item.category} size={30} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: ALL (Pure item icon grid)                                         */}
        {/* ========================================================================= */}
        {mainTab === 'all' && (
          <>
            {/* Sub-category Filter Tabs */}
            <div className="overflow-x-auto no-scrollbar py-0.5">
              <div className="flex items-center gap-1.5">
                {WARDROBE_CATEGORIES.map((cat) => {
                  const isActive = subCategory === cat.id;
                  const count =
                    cat.id === 'all'
                      ? ownedItems.length
                      : cat.id === 'weather'
                      ? WEATHER_ITEMS.length
                      : ownedItems.filter((i) => i.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        if (soundEnabled) soundEngine.playTapSound();
                        setSubCategory(cat.id);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#5f7a61] text-white shadow-xs'
                          : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#554b3f] dark:text-[#c4b5a5]'
                      }`}
                    >
                      <PixelIcon name={cat.id} size={12} />
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? 'bg-black/20 text-white' : 'bg-black/5 dark:bg-white/10'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Owned Items Grid - Pure Visual Thumbnails */}
            <div className="flex-1 overflow-y-auto no-scrollbar pr-0.5">
              {displayAllOwnedItems.length === 0 && subCategory === 'all' ? (
                <div className="py-8 text-center space-y-2">
                  <p className="text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d]">
                    No items collected yet
                  </p>
                  {onNavigateGacha && (
                    <button
                      type="button"
                      onClick={onNavigateGacha}
                      className="px-4 py-1.5 rounded-full text-xs font-black bg-[#5f7a61] hover:bg-[#4d6650] text-white shadow-xs inline-flex items-center gap-1.5"
                    >
                      <PixelIcon name="gacha" size={13} />
                      <span>Spin Gacha</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 pb-2">
                  {/* Unequip tile for specific removable slots */}
                  {subCategory !== 'all' && subCategory !== 'weather' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (soundEnabled) soundEngine.playTapSound();
                        if (hapticEnabled) triggerHaptic();
                        const patch: Partial<PixelSceneConfig> = {};
                        if (subCategory === 'hats') patch.hatId = 'none';
                        if (subCategory === 'outfits') patch.outfitId = 'none';
                        if (subCategory === 'accessories') patch.glassesId = 'none';
                        if (subCategory === 'props') patch.activityId = 'relaxing';
                        if (subCategory === 'companions') patch.companionId = 'none';
                        if (subCategory === 'skins') patch.skinId = 'classic';
                        if (subCategory === 'scenes') patch.sceneId = 'indoor';
                        setPreviewConfig((prev) => ({ ...prev, ...patch }));
                      }}
                      className={`relative aspect-square rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border flex flex-col items-center justify-center p-1 transition-all active:scale-95 shadow-2xs group overflow-hidden ${
                        (subCategory === 'hats' && previewConfig.hatId === 'none') ||
                        (subCategory === 'outfits' && previewConfig.outfitId === 'none') ||
                        (subCategory === 'accessories' && previewConfig.glassesId === 'none') ||
                        (subCategory === 'props' && previewConfig.activityId === 'relaxing') ||
                        (subCategory === 'companions' && previewConfig.companionId === 'none') ||
                        (subCategory === 'skins' && previewConfig.skinId === 'classic') ||
                        (subCategory === 'scenes' && previewConfig.sceneId === 'indoor')
                          ? 'border-[#5f7a61] ring-2 ring-[#5f7a61]/40 bg-[#5f7a61]/10'
                          : 'border-black/[0.08] dark:border-white/[0.1] hover:border-black/20'
                      }`}
                      title="Unequip / Reset to default"
                    >
                      <PixelIcon name="none" size={16} />
                      <span className="text-[8px] font-bold text-[#8c7e70] dark:text-[#a89b8d] mt-0.5">None</span>
                    </button>
                  )}

                  {displayAllOwnedItems.map((item) => {
                    const isEquipped = isItemEquippedInPreview(item);
                    const grade = getGachaGrade(item);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleWardrobeEquip(item)}
                        className={`relative aspect-square rounded-2xl bg-white dark:bg-[#1f1a16] border flex items-center justify-center p-1 transition-all active:scale-95 shadow-2xs group overflow-hidden ${
                          isEquipped
                            ? 'border-[#5f7a61] ring-2 ring-[#5f7a61]/40 bg-[#5f7a61]/10'
                            : 'border-black/[0.06] dark:border-white/[0.08] hover:border-[#5f7a61]/50'
                        }`}
                        title={`${item.name} [${grade}]`}
                      >
                        {/* Grade Badge */}
                        <span
                          className={`absolute top-1 left-1 font-pixel text-[7px] font-black px-1 py-[0.5px] rounded-[4px] leading-tight z-10 shadow-2xs pointer-events-none select-none ${
                            grade === 'SR'
                              ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] dark:bg-amber-950/90 dark:text-amber-200 dark:border-amber-700/80'
                              : grade === 'R'
                              ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] dark:bg-emerald-950/90 dark:text-emerald-200 dark:border-emerald-700/80'
                              : 'bg-[#F5F5F4] text-[#57534E] border border-[#E7E5E4] dark:bg-stone-800/90 dark:text-stone-300 dark:border-stone-700/70'
                          }`}
                        >
                          {grade}
                        </span>

                        {isEquipped && (
                          <div className="absolute top-1 right-1 z-10 w-4 h-4 rounded-full bg-[#5f7a61] text-white flex items-center justify-center shadow-xs">
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}

                        <div className="transform scale-[1.1] group-hover:scale-[1.2] transition-transform">
                          <PixelItemThumbnail id={item.id} category={item.category} size={30} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: THEME (Pure visual sets of owned items)                           */}
        {/* ========================================================================= */}
        {mainTab === 'theme' && (
          <>
            {/* Theme Set Tabs */}
            <div className="overflow-x-auto no-scrollbar py-0.5">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) soundEngine.playTapSound();
                    setSelectedThemeId('all_sets');
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    selectedThemeId === 'all_sets'
                      ? 'bg-[#5f7a61] text-white shadow-xs'
                      : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#554b3f] dark:text-[#c4b5a5]'
                  }`}
                >
                  All
                </button>

                {THEMED_FROG_SETS.map((set) => {
                  const isActive = selectedThemeId === set.id;
                  const setOwnedCount = SHOP_CATALOG.filter(
                    (item) => set.itemIds.includes(item.id) && isItemOwned(item.id)
                  ).length;

                  return (
                    <button
                      key={set.id}
                      type="button"
                      onClick={() => {
                        if (soundEnabled) soundEngine.playTapSound();
                        setSelectedThemeId(set.id);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#5f7a61] text-white shadow-xs'
                          : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#554b3f] dark:text-[#c4b5a5]'
                      }`}
                    >
                      <PixelIcon name="sets" size={12} />
                      <span>{set.name.split('&')[0]}</span>
                      <span className="opacity-75 text-[10px]">({setOwnedCount})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme Sections (Pure Item Grids) */}
            <div className="flex-1 overflow-y-auto no-scrollbar pr-0.5 space-y-3 pb-2">
              {filteredThemeSets.map((set) => {
                const ownedSetItems = SHOP_CATALOG.filter(
                  (item) => set.itemIds.includes(item.id) && isItemOwned(item.id)
                );

                const totalSetCount = set.itemIds.length;

                return (
                  <div
                    key={set.id}
                    className="p-3 rounded-2xl bg-white dark:bg-[#1f1a16] border border-black/[0.08] dark:border-white/[0.08] shadow-2xs space-y-2"
                  >
                    {/* Minimal Theme Header & Quick Wear Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <PixelIcon name="sets" size={14} />
                        <span className="text-xs font-black text-[#2d2823] dark:text-[#f4efe8]">
                          {set.name.split('&')[0]} ({ownedSetItems.length}/{totalSetCount})
                        </span>
                      </div>

                      {ownedSetItems.length > 0 && (
                        <button
                          type="button"
                          onClick={() => handleWearOwnedThemeSet(set)}
                          className="px-2.5 py-1 rounded-full text-[11px] font-black bg-[#5f7a61] hover:bg-[#4d6650] active:scale-95 text-white shadow-2xs transition whitespace-nowrap"
                        >
                          Wear Set
                        </button>
                      )}
                    </div>

                    {/* Pure Item Thumbnails in Theme */}
                    {ownedSetItems.length > 0 && (
                      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                        {ownedSetItems.map((item) => {
                          const isEquipped = isItemEquippedInPreview(item);
                          const grade = getGachaGrade(item);

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleWardrobeEquip(item)}
                              className={`relative aspect-square rounded-2xl bg-[#faf8f5] dark:bg-[#28221c] border flex items-center justify-center p-1 transition-all active:scale-95 shadow-2xs group overflow-hidden ${
                                isEquipped
                                  ? 'border-[#5f7a61] ring-2 ring-[#5f7a61]/40 bg-[#5f7a61]/10'
                                  : 'border-black/[0.06] dark:border-white/[0.08] hover:border-[#5f7a61]/50'
                              }`}
                              title={`${item.name} [${grade}]`}
                            >
                              {/* Grade Badge */}
                              <span
                                className={`absolute top-1 left-1 font-pixel text-[7px] font-black px-1 py-[0.5px] rounded-[4px] leading-tight z-10 shadow-2xs pointer-events-none select-none ${
                                  grade === 'SR'
                                    ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] dark:bg-amber-950/90 dark:text-amber-200 dark:border-amber-700/80'
                                    : grade === 'R'
                                    ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] dark:bg-emerald-950/90 dark:text-emerald-200 dark:border-emerald-700/80'
                                    : 'bg-[#F5F5F4] text-[#57534E] border border-[#E7E5E4] dark:bg-stone-800/90 dark:text-stone-300 dark:border-stone-700/70'
                                }`}
                              >
                                {grade}
                              </span>

                              {isEquipped && (
                                <div className="absolute top-1 right-1 z-10 w-4 h-4 rounded-full bg-[#5f7a61] text-white flex items-center justify-center shadow-xs">
                                  <Check size={10} strokeWidth={3} />
                                </div>
                              )}

                              <div className="transform scale-[1.1] group-hover:scale-[1.2] transition-transform">
                                <PixelItemThumbnail id={item.id} category={item.category} size={28} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
