import React, { useState, useMemo } from 'react';
import {
  PixelSceneConfig,
  FrogShopState,
  ShopItem,
  GachaPullResult,
  ThemedFrogSet,
} from '../types';
import { SHOP_CATALOG } from '../data/shopCatalog';
import { THEMED_FROG_SETS } from '../data/themedSets';
import { PixelFrogScene } from './PixelFrogScene';
import { LilyCoinIcon } from './FrogIcons';
import { PixelItemThumbnail } from './PixelItemThumbnail';
import { GachaSummonAnimation } from './GachaSummonAnimation';
import { getGachaGrade } from '../utils/gachaUtils';
import {
  ArrowLeft,
  Sparkles,
  Heart,
  List,
  X,
  RotateCcw,
  Check,
  Lock,
} from 'lucide-react';
import { soundEngine, triggerHaptic } from '../utils/audioUtils';

interface GachaViewProps {
  config: PixelSceneConfig;
  onUpdateConfig: (patch: Partial<PixelSceneConfig>) => void;
  shopState: FrogShopState;
  onGachaPullResults: (results: GachaPullResult[], totalCost: number, isDailyFree?: boolean) => void;
  onToggleWishlist?: (itemId: string) => void;
  onOpenCoins?: () => void;
  onBack?: () => void;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
}

export const GachaView: React.FC<GachaViewProps> = ({
  config,
  shopState,
  onGachaPullResults,
  onOpenCoins,
  onBack,
  soundEnabled = true,
  hapticEnabled = true,
}) => {
  // Live preview config for trying on items
  const [previewConfig, setPreviewConfig] = useState<PixelSceneConfig>({ ...config });

  // Selected Set Tab ('all' or set.id)
  const [selectedSetId, setSelectedSetId] = useState<string>(THEMED_FROG_SETS[0]?.id || 'all');

  // Summoning Animation state
  const [activeSummonResults, setActiveSummonResults] = useState<GachaPullResult[] | null>(null);
  const [lastSpinParams, setLastSpinParams] = useState<{ count: 1 | 10; isFree: boolean } | null>(null);

  // Lineup Rates modal
  const [showLineupModal, setShowLineupModal] = useState(false);

  // Daily free pull
  const todayStr = new Date().toISOString().slice(0, 10);
  const isDailyFreeAvailable = shopState.lastFreeGachaDate !== todayStr;

  const isItemOwned = (itemId: string) => {
    if (itemId.includes('none') || itemId === 'skin_classic' || itemId.startsWith('weather_')) return true;
    return shopState.ownedItemIds.includes(itemId);
  };

  // Standard items in the catalog (excluding bare 'none' items)
  const allGachaItems = useMemo(() => {
    return SHOP_CATALOG.filter((item) => !item.id.includes('none') && item.id !== 'skin_classic');
  }, []);

  const currentSet = useMemo(() => {
    return THEMED_FROG_SETS.find((s) => s.id === selectedSetId);
  }, [selectedSetId]);

  // Display items filtered by selected set or all
  const displayItems = useMemo(() => {
    if (selectedSetId === 'all') {
      return allGachaItems;
    }
    const foundSet = THEMED_FROG_SETS.find((s) => s.id === selectedSetId);
    if (!foundSet) return allGachaItems;

    return allGachaItems.filter((item) => {
      // Check if item.id is in foundSet.itemIds, or item value matches any item in foundSet.items
      if (foundSet.itemIds.includes(item.id)) return true;
      const slotVal = foundSet.items[item.slot as keyof typeof foundSet.items];
      return slotVal === item.value;
    });
  }, [selectedSetId, allGachaItems]);

  const ownedCount = useMemo(() => {
    return displayItems.filter((item) => isItemOwned(item.id)).length;
  }, [displayItems, shopState.ownedItemIds]);

  const isItemEquipped = (item: ShopItem) => {
    if (item.category === 'hats' || item.slot === 'hatId') return previewConfig.hatId === item.value;
    if (item.category === 'outfits' || item.slot === 'outfitId') return previewConfig.outfitId === item.value;
    if (item.category === 'accessories' || item.slot === 'glassesId') return previewConfig.glassesId === item.value;
    if (item.category === 'skins' || item.slot === 'skinId') return previewConfig.skinId === item.value;
    if (item.category === 'props' || item.slot === 'activityId') return previewConfig.activityId === item.value;
    if (item.category === 'companions' || item.slot === 'companionId') return previewConfig.companionId === item.value;
    if (item.category === 'scenes' || item.slot === 'sceneId') return previewConfig.sceneId === item.value;
    return false;
  };

  const handleTogglePreview = (item: ShopItem) => {
    if (soundEnabled) soundEngine.playTapSound();
    if (hapticEnabled) triggerHaptic();

    const isEquipped = isItemEquipped(item);

    const patch: Partial<PixelSceneConfig> = {};
    if (item.category === 'hats' || item.slot === 'hatId') {
      patch.hatId = isEquipped ? (config.hatId === item.value ? 'none' : config.hatId) : (item.value as any);
    } else if (item.category === 'outfits' || item.slot === 'outfitId') {
      patch.outfitId = isEquipped ? (config.outfitId === item.value ? 'none' : config.outfitId) : (item.value as any);
    } else if (item.category === 'accessories' || item.slot === 'glassesId') {
      patch.glassesId = isEquipped ? (config.glassesId === item.value ? 'none' : config.glassesId) : (item.value as any);
    } else if (item.category === 'skins' || item.slot === 'skinId') {
      patch.skinId = isEquipped ? (config.skinId === item.value ? 'classic' : config.skinId) : (item.value as any);
    } else if (item.category === 'props' || item.slot === 'activityId') {
      patch.activityId = isEquipped ? (config.activityId === item.value ? 'relaxing' : config.activityId) : (item.value as any);
    } else if (item.category === 'companions' || item.slot === 'companionId') {
      patch.companionId = isEquipped ? (config.companionId === item.value ? 'none' : config.companionId) : (item.value as any);
    } else if (item.category === 'scenes' || item.slot === 'sceneId') {
      patch.sceneId = isEquipped ? (config.sceneId === item.value ? 'indoor' : config.sceneId) : (item.value as any);
    }

    setPreviewConfig((prev) => ({ ...prev, ...patch }));
  };

  const handleTryOnSet = (set: ThemedFrogSet) => {
    if (soundEnabled) soundEngine.playEquipSound();
    if (hapticEnabled) triggerHaptic();
    setPreviewConfig((prev) => ({
      ...prev,
      ...set.items,
    }));
  };

  const handleResetPreview = () => {
    if (soundEnabled) soundEngine.playTapSound();
    setPreviewConfig({ ...config });
  };

  // Gacha spin execution
  const executeGachaSpin = (count: 1 | 10, isFreeDaily: boolean = false) => {
    const cost = isFreeDaily ? 0 : count === 1 ? 50 : 450;
    if (!isFreeDaily && shopState.coins < cost) {
      if (soundEnabled) soundEngine.playTapSound();
      return;
    }

    if (hapticEnabled) triggerHaptic();

    // Pool can be weighted towards the current set if in a set tab, or all items
    const pool = displayItems.length > 0 ? displayItems : allGachaItems;
    const results: GachaPullResult[] = [];

    const rollItemWeighted = (): ShopItem => {
      const rand = Math.random() * 100;
      let targetTier: 'SR' | 'R' | 'N' = 'N';
      if (rand < 2.5) {
        targetTier = 'SR';
      } else if (rand < 17.5) {
        targetTier = 'R';
      } else {
        targetTier = 'N';
      }

      let candidates = pool.filter((i) => getGachaGrade(i) === targetTier);
      if (candidates.length === 0) {
        candidates = allGachaItems.filter((i) => getGachaGrade(i) === targetTier);
      }
      if (candidates.length === 0) {
        candidates = pool;
      }
      return candidates[Math.floor(Math.random() * candidates.length)] || SHOP_CATALOG[0];
    };

    for (let i = 0; i < count; i++) {
      const item = rollItemWeighted();
      const alreadyOwned = isItemOwned(item.id) || results.some((r) => r.item.id === item.id);
      const grade = getGachaGrade(item);
      const refund = alreadyOwned ? (grade === 'SR' ? 50 : grade === 'R' ? 25 : 10) : undefined;

      results.push({
        item,
        isNew: !alreadyOwned,
        duplicateRefundCoins: refund,
      });
    }

    onGachaPullResults(results, cost, isFreeDaily);
    setLastSpinParams({ count, isFree: isFreeDaily });
    setActiveSummonResults(results);
  };

  return (
    <div
      id="pokecolo-gacha-stage"
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
              id="gacha-back-btn"
              type="button"
              onClick={() => {
                if (soundEnabled) soundEngine.playTapSound();
                onBack();
              }}
              className="w-8 h-8 rounded-full bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black/80 backdrop-blur-md border border-white/60 dark:border-white/15 flex items-center justify-center text-[#2d2823] dark:text-[#f4efe8] shadow-sm active:scale-95 transition-all"
              title="Back"
            >
              <ArrowLeft size={16} />
            </button>
          )}

          <div className="px-3 py-1.5 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md border border-white/60 dark:border-white/15 shadow-sm flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#5f7a61] dark:text-[#8cb88f]" />
            <h2 className="text-xs font-black tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
              Gacha & Sets
            </h2>
          </div>
        </div>

        {/* Right Side: Coins & Reset Preview */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleResetPreview}
            className="w-8 h-8 rounded-full bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black/80 backdrop-blur-md text-[#4a4036] dark:text-[#e0d6cb] border border-white/60 dark:border-white/15 flex items-center justify-center shadow-sm active:scale-90 transition"
            title="Reset Preview"
          >
            <RotateCcw size={14} />
          </button>

          <button
            id="gacha-coins-btn"
            type="button"
            onClick={() => {
              if (soundEnabled) soundEngine.playTapSound();
              if (onOpenCoins) onOpenCoins();
            }}
            className="px-3 py-1.5 rounded-full text-xs font-black bg-amber-500/20 hover:bg-amber-500/30 active:scale-95 text-amber-950 dark:text-amber-200 backdrop-blur-md transition-all flex items-center gap-1.5 border border-amber-500/30 shadow-sm"
          >
            <LilyCoinIcon size={14} />
            <span>{shopState.coins}</span>
          </button>
        </div>
      </header>

      {/* Spacer */}
      <div className="flex-1 w-full" />

      {/* 3. BOTTOM GACHA TRAY */}
      <div className="relative z-20 w-full bg-white/85 dark:bg-[#1a1613]/90 backdrop-blur-xl border-t border-white/60 dark:border-white/10 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.15)] px-4 pt-2.5 pb-24 flex flex-col gap-2 pointer-events-auto max-h-[48vh]">
        {/* Drag Handle */}
        <div className="w-10 h-1 rounded-full bg-black/15 dark:bg-white/20 mx-auto" />

        {/* Set Selector Tabs */}
        <div className="overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5">
            {THEMED_FROG_SETS.map((set) => {
              const isActive = selectedSetId === set.id;
              return (
                <button
                  key={set.id}
                  type="button"
                  onClick={() => {
                    if (soundEnabled) soundEngine.playTapSound();
                    setSelectedSetId(set.id);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#5f7a61] text-white shadow-xs'
                      : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#554b3f] dark:text-[#c4b5a5]'
                  }`}
                >
                  <span>{set.bannerEmoji}</span>
                  <span>{set.name.split('&')[0]}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                if (soundEnabled) soundEngine.playTapSound();
                setSelectedSetId('all');
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
                selectedSetId === 'all'
                  ? 'bg-[#5f7a61] text-white shadow-xs'
                  : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#554b3f] dark:text-[#c4b5a5]'
              }`}
            >
              All Items
            </button>
          </div>
        </div>

        {/* Sub-bar: Set Try-on & Progress & Rates */}
        <div className="flex items-center justify-between px-0.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-black text-[#5f7a61] dark:text-[#8cb88f]">
              {ownedCount}/{displayItems.length} Unlocked
            </span>

            {currentSet && (
              <button
                type="button"
                onClick={() => handleTryOnSet(currentSet)}
                className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#5f7a61]/15 text-[#5f7a61] dark:text-[#8cb88f] hover:bg-[#5f7a61]/25 active:scale-95 transition"
              >
                Try Full Set
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (soundEnabled) soundEngine.playTapSound();
              setShowLineupModal(true);
            }}
            className="font-bold text-[#8c7e70] dark:text-[#a89b8d] hover:text-[#2d2823] dark:hover:text-[#f4efe8] flex items-center gap-1"
          >
            <List size={12} />
            <span>Rates</span>
          </button>
        </div>

        {/* Lineup Items Grid / Tray */}
        <div className="overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-2">
            {displayItems.map((item) => {
              const grade = getGachaGrade(item);
              const owned = isItemOwned(item.id);
              const isHearted = shopState.wishlistIds?.includes(item.id);
              const isEquipped = isItemEquipped(item);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTogglePreview(item)}
                  className={`relative w-13 h-13 rounded-2xl bg-white dark:bg-[#201c18] border flex items-center justify-center shrink-0 shadow-2xs active:scale-95 transition-all overflow-hidden group ${
                    isEquipped
                      ? 'border-[#5f7a61] ring-2 ring-[#5f7a61]/40 bg-[#5f7a61]/10'
                      : 'border-black/[0.08] dark:border-white/[0.1] hover:border-[#5f7a61]'
                  }`}
                  title={item.name}
                >
                  {/* Grade Badge */}
                  <span
                    className={`absolute top-1 left-1 text-[7.5px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-2xs z-10 ${
                      grade === 'SR'
                        ? 'bg-[#d4a373] text-[#2d2823]'
                        : grade === 'R'
                        ? 'bg-[#6b7b8c] text-white'
                        : 'bg-[#ebe4d8] dark:bg-stone-700 text-[#554b3f] dark:text-stone-300'
                    }`}
                  >
                    {grade}
                  </span>

                  {/* Heart Indicator */}
                  {isHearted && (
                    <span className="absolute top-1 right-1 z-10 text-[#c47069]">
                      <Heart size={9} className="fill-current" />
                    </span>
                  )}

                  {/* Equipped Check or Lock Badge */}
                  {isEquipped ? (
                    <div className="absolute top-1 right-1 z-10 w-3.5 h-3.5 rounded-full bg-[#5f7a61] text-white flex items-center justify-center">
                      <Check size={8} strokeWidth={3} />
                    </div>
                  ) : !owned ? (
                    <div className="absolute top-1 right-1 z-10 text-black/40 dark:text-white/40">
                      <Lock size={9} />
                    </div>
                  ) : (
                    <span className="absolute bottom-0 left-0 px-1 py-0.2 rounded-tr-md text-[6.5px] font-black bg-[#5f7a61] text-white z-10 tracking-tighter shadow-2xs">
                      GET
                    </span>
                  )}

                  {/* Pixel Art Thumbnail */}
                  <div className="transform scale-[1.05] group-hover:scale-[1.15] transition-transform">
                    <PixelItemThumbnail id={item.id} category={item.category} size={28} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Gacha Pull Controls (1x & 10x) */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          {/* 1-Pull Button */}
          <button
            type="button"
            onClick={() => executeGachaSpin(1, isDailyFreeAvailable)}
            className="py-2 px-3 rounded-2xl text-xs font-black bg-[#5f7a61] hover:bg-[#4d6650] active:scale-95 text-white flex flex-col items-center justify-center shadow-sm transition"
          >
            <span>{isDailyFreeAvailable ? 'Free 1-Spin' : '1x Spin'}</span>
            <span className="text-[10px] opacity-85 font-normal mt-0.5">
              {isDailyFreeAvailable ? 'Daily Gift' : '50 Coins'}
            </span>
          </button>

          {/* 10-Pull Multi Button */}
          <button
            type="button"
            onClick={() => executeGachaSpin(10, false)}
            disabled={shopState.coins < 450}
            className={`py-2 px-3 rounded-2xl text-xs font-black flex flex-col items-center justify-center shadow-sm transition ${
              shopState.coins >= 450
                ? 'bg-[#b86f52] hover:bg-[#9e5c43] active:scale-95 text-white'
                : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>10x Multi Spin</span>
            <span className="text-[10px] opacity-85 font-normal mt-0.5">
              450 Coins
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODALS: SUMMON ANIMATION & RATES LINEUP                                   */}
      {/* ========================================================================= */}

      {/* Gacha Summon Animation Result Modal */}
      {activeSummonResults && (
        <GachaSummonAnimation
          results={activeSummonResults}
          onComplete={() => setActiveSummonResults(null)}
          onSpinAgain={() => {
            if (lastSpinParams) {
              setActiveSummonResults(null);
              setTimeout(() => {
                executeGachaSpin(lastSpinParams.count, false);
              }, 150);
            }
          }}
          canSpinAgain={lastSpinParams ? shopState.coins >= (lastSpinParams.count === 10 ? 450 : 50) : false}
          spinAgainCost={lastSpinParams?.count === 10 ? 450 : 50}
          soundEnabled={soundEnabled}
          hapticEnabled={hapticEnabled}
        />
      )}

      {/* Lineup Rates Modal */}
      {showLineupModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#faf8f5] dark:bg-[#201c18] border border-black/10 dark:border-white/10 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-xl text-[#2d2823] dark:text-[#f4efe8]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-1.5">
                <List size={16} />
                <span>Lineup & Probabilities</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowLineupModal(false)}
                className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-xs"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#d4a373]/15 border border-[#d4a373]/30 flex items-center justify-between">
                <span className="font-extrabold text-[#8a5d2c] dark:text-[#d4a373]">Super Rare (SR)</span>
                <span className="font-black">2.5%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#6b7b8c]/15 border border-[#6b7b8c]/30 flex items-center justify-between">
                <span className="font-extrabold text-[#405060] dark:text-[#9ab0c4]">Rare (R)</span>
                <span className="font-black">15.0%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between">
                <span className="font-extrabold text-[#554b3f] dark:text-[#c4b5a5]">Normal (N)</span>
                <span className="font-black">82.5%</span>
              </div>
            </div>

            <p className="text-[11px] text-[#8c7e70] dark:text-[#a89b8d] leading-relaxed">
              * Duplicates automatically refund Lily Coins based on rarity grade. 10x spins give 10% coin discount.
            </p>

            <button
              type="button"
              onClick={() => setShowLineupModal(false)}
              className="w-full py-2 rounded-xl bg-[#5f7a61] text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
