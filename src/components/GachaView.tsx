import React, { useState, useMemo, useEffect, useRef } from 'react';
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
import { LilyCoinIcon, PixelGachaTicketIcon } from './FrogIcons';
import { PixelItemThumbnail } from './PixelItemThumbnail';
import { PixelIcon } from './PixelIcon';
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
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { soundEngine, triggerHaptic } from '../utils/audioUtils';

interface GachaViewProps {
  config: PixelSceneConfig;
  onUpdateConfig: (patch: Partial<PixelSceneConfig>) => void;
  shopState: FrogShopState;
  onGachaPullResults: (
    results: GachaPullResult[],
    payment: { type: 'tickets'; amount: number } | { type: 'coins'; amount: number }
  ) => void;
  onToggleWishlist?: (itemId: string) => void;
  onOpenCoins?: () => void;
  onBack?: () => void;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
}

export const GachaView: React.FC<GachaViewProps> = ({
  config,
  onUpdateConfig,
  shopState,
  onGachaPullResults,
  onToggleWishlist,
  onOpenCoins,
  onBack,
  soundEnabled = true,
  hapticEnabled = true,
}) => {
  // Current active set index in carousel (0 to THEMED_FROG_SETS.length - 1, or last index for 'all')
  const [activeSetIndex, setActiveSetIndex] = useState<number>(0);

  // Live preview config for trying on items
  const [previewConfig, setPreviewConfig] = useState<PixelSceneConfig>(() => {
    const firstSet = THEMED_FROG_SETS[0];
    return firstSet
      ? {
          ...config,
          ...firstSet.items,
        }
      : { ...config };
  });

  // Touch swipe handling
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Summoning Animation state
  const [activeSummonResults, setActiveSummonResults] = useState<GachaPullResult[] | null>(null);
  const [lastSpinParams, setLastSpinParams] = useState<{ count: 1 | 10; useTicket: boolean } | null>(null);

  // Lineup Rates modal
  const [showLineupModal, setShowLineupModal] = useState(false);

  // Toast notification for equipping
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tickets state
  const tickets = shopState.gachaTickets || 0;

  const isItemOwned = (itemId: string) => {
    if (itemId.includes('none') || itemId.startsWith('weather_')) return true;
    const catItem = SHOP_CATALOG.find((i) => i.id === itemId);
    if (catItem?.defaultUnlocked) return true;
    return shopState.ownedItemIds.includes(itemId);
  };

  // Only rotate through the Limited Themed Sets
  const totalSets = THEMED_FROG_SETS.length;
  const currentSet = THEMED_FROG_SETS[activeSetIndex] || THEMED_FROG_SETS[0];

  // Pure Gacha pool: strictly exclude default starter items, none, and free basic items
  const gachaPoolItems = useMemo(() => {
    return SHOP_CATALOG.filter(
      (item) =>
        !item.defaultUnlocked &&
        !item.id.includes('none') &&
        item.id !== 'skin_classic' &&
        !item.id.startsWith('weather_')
    );
  }, []);

  // Items featured in the current limited banner
  const displayItems = useMemo(() => {
    if (!currentSet) return gachaPoolItems;
    return gachaPoolItems.filter((item) => {
      if (currentSet.itemIds.includes(item.id)) return true;
      const slotVal = currentSet.items[item.slot as keyof typeof currentSet.items];
      return slotVal === item.value;
    });
  }, [currentSet, gachaPoolItems]);

  // Change set with automatic live frog room preview
  const handleSelectSetIndex = (newIndex: number) => {
    const clampedIndex = (newIndex + totalSets) % totalSets;
    setActiveSetIndex(clampedIndex);

    if (soundEnabled) soundEngine.playEquipSound();
    if (hapticEnabled) triggerHaptic();

    const targetSet = THEMED_FROG_SETS[clampedIndex];
    if (targetSet) {
      setPreviewConfig((prev) => ({
        ...prev,
        ...targetSet.items,
      }));
    }
  };

  const handlePrevSet = () => {
    handleSelectSetIndex(activeSetIndex - 1);
  };

  const handleNextSet = () => {
    handleSelectSetIndex(activeSetIndex + 1);
  };

  // Touch Swipe Handlers for mobile & stage sliding (intentional banner swipe only)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Trigger swipe only when horizontal gesture is deliberate and > 90px (not accidental during item scrolling)
    if (Math.abs(deltaX) > 90 && Math.abs(deltaX) > Math.abs(deltaY) * 1.8) {
      if (deltaX < 0) {
        handleNextSet(); // Swipe Left -> Next
      } else {
        handlePrevSet(); // Swipe Right -> Prev
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

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

  const handleReapplySet = () => {
    if (currentSet) {
      if (soundEnabled) soundEngine.playEquipSound();
      if (hapticEnabled) triggerHaptic();
      setPreviewConfig((prev) => ({
        ...prev,
        ...currentSet.items,
      }));
    }
  };

  const handleApplyToMainFrog = () => {
    if (soundEnabled) soundEngine.playCompletionChime();
    if (hapticEnabled) triggerHaptic();
    onUpdateConfig(previewConfig);
    setToastMessage('Applied look to your Main Frog! 🐸✨');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleResetPreview = () => {
    if (soundEnabled) soundEngine.playTapSound();
    setPreviewConfig({ ...config });
  };

  // Gacha spin execution
  const executeGachaSpin = (count: 1 | 10, preferTicket: boolean = true) => {
    const useTicket = preferTicket && tickets >= count;
    const coinCost = count === 1 ? 50 : 450;

    if (useTicket) {
      if (tickets < count) {
        if (soundEnabled) soundEngine.playTapSound();
        return;
      }
    } else {
      if (shopState.coins < coinCost) {
        if (soundEnabled) soundEngine.playTapSound();
        return;
      }
    }

    if (hapticEnabled) triggerHaptic();

    // Gacha pool: weighted towards current featured set items + general gacha items (excluding defaults)
    const featuredIds = currentSet ? currentSet.itemIds : [];
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

      // Filter pool by target tier
      const tierItems = gachaPoolItems.filter((i) => getGachaGrade(i) === targetTier);
      
      // 50% rate-up chance to pull a featured banner item of this tier if available
      const featuredInTier = tierItems.filter((i) => featuredIds.includes(i.id));
      if (featuredInTier.length > 0 && Math.random() < 0.5) {
        return featuredInTier[Math.floor(Math.random() * featuredInTier.length)];
      }

      if (tierItems.length > 0) {
        return tierItems[Math.floor(Math.random() * tierItems.length)];
      }
      return gachaPoolItems[Math.floor(Math.random() * gachaPoolItems.length)] || gachaPoolItems[0];
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

    const payment = useTicket
      ? { type: 'tickets' as const, amount: count }
      : { type: 'coins' as const, amount: coinCost };

    onGachaPullResults(results, payment);
    setLastSpinParams({ count, useTicket });
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full bg-[#5f7a61] text-white text-xs font-black shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

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
              className="w-8 h-8 rounded-full bg-white/95 dark:bg-[#1a1613]/95 hover:bg-white dark:hover:bg-black/90 backdrop-blur-md border border-black/10 dark:border-white/15 flex items-center justify-center text-[#2d2823] dark:text-[#f4efe8] shadow-sm active:scale-95 transition-all"
              title="Back"
            >
              <ArrowLeft size={16} />
            </button>
          )}

          <div className="px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#1a1613]/95 backdrop-blur-md border border-black/10 dark:border-white/15 shadow-sm flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#5f7a61] dark:text-[#8cb88f]" />
            <h2 className="text-xs font-black tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
              Gacha
            </h2>
          </div>
        </div>

        {/* Right Side: Tickets & Coins */}
        <div className="flex items-center gap-1.5">
          {/* Tickets Badge */}
          <div
            className="px-2.5 py-1.5 rounded-full text-xs font-black bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border border-amber-500/40 flex items-center gap-1.5 shadow-sm"
            title="Summon Tickets"
          >
            <PixelGachaTicketIcon size={15} />
            <span>{tickets}</span>
          </div>

          <button
            id="gacha-coins-btn"
            type="button"
            onClick={() => {
              if (soundEnabled) soundEngine.playTapSound();
              if (onOpenCoins) onOpenCoins();
            }}
            className="px-3 py-1.5 rounded-full text-xs font-black bg-white/95 dark:bg-[#1a1613]/95 hover:bg-white dark:hover:bg-black/90 active:scale-95 text-[#2d2823] dark:text-[#f4efe8] backdrop-blur-md transition-all flex items-center gap-1.5 border border-amber-500/40 shadow-sm cursor-pointer"
          >
            <LilyCoinIcon size={14} />
            <span className="text-[#2d2823] dark:text-[#f4efe8]">{shopState.coins}</span>
          </button>
        </div>
      </header>

      {/* Floating Minimalist Set Switcher under header */}
      <div className="relative z-20 w-full flex flex-col items-center pt-2 pointer-events-auto">
        <div className="flex items-center gap-1 bg-white/95 dark:bg-[#1a1613]/95 backdrop-blur-md border border-black/10 dark:border-white/15 rounded-full px-2 py-1 shadow-sm">
          <button
            type="button"
            onClick={handlePrevSet}
            className="w-6 h-6 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-[#554b3f] dark:text-[#c4b5a5] active:scale-90 transition"
            title="Previous Set"
          >
            <ChevronLeft size={15} />
          </button>

          <div className="px-2 flex items-center gap-1.5 min-w-[140px] justify-center text-center">
            <PixelIcon name={currentSet.bannerEmoji} size={16} className="shrink-0" />
            <span className="text-xs font-black text-[#2d2823] dark:text-[#f4efe8] truncate max-w-[140px]">
              {currentSet.name}
            </span>
          </div>

          <button
            type="button"
            onClick={handleNextSet}
            className="w-6 h-6 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-[#554b3f] dark:text-[#c4b5a5] active:scale-90 transition"
            title="Next Set"
          >
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Subtle Dots Indicator */}
        <div className="flex items-center gap-1 mt-1.5">
          {Array.from({ length: totalSets }).map((_, idx) => (
            <button
              key={`gacha-set-dot-${idx}`}
              type="button"
              onClick={() => handleSelectSetIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                activeSetIndex === idx
                  ? 'w-3.5 bg-[#5f7a61]'
                  : 'w-1.5 bg-black/25 dark:bg-white/25 hover:bg-black/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Interactive Middle Area (Swiping on frog room changes banner) */}
      <div
        className="flex-1 w-full relative z-10 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />

      {/* 3. BOTTOM GACHA TRAY */}
      <div
        className="relative z-20 w-full bg-white/95 dark:bg-[#1a1613]/95 backdrop-blur-xl border-t border-black/10 dark:border-white/10 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.15)] px-4 pt-2.5 pb-24 flex flex-col gap-2.5 pointer-events-auto"
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="w-10 h-1 rounded-full bg-black/15 dark:bg-white/20 mx-auto" />

        {/* Set Information & Quick Actions Row */}
        <div className="flex items-center justify-between px-0.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-black text-xs text-[#2d2823] dark:text-[#f4efe8]">
              {currentSet.name.split('&')[0].trim()}
            </span>
            <span className="text-[11px] font-bold text-[#5f7a61] dark:text-[#8cb88f]">
              ({ownedCount}/{displayItems.length})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {currentSet && (
              <button
                type="button"
                onClick={handleReapplySet}
                className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#5f7a61]/15 text-[#5f7a61] dark:text-[#8cb88f] hover:bg-[#5f7a61]/25 active:scale-95 transition"
              >
                Try Look
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (soundEnabled) soundEngine.playTapSound();
                setShowLineupModal(true);
              }}
              className="px-2 py-0.5 rounded-full text-[11px] font-bold text-[#8c7e70] dark:text-[#a89b8d] hover:text-[#2d2823] dark:hover:text-[#f4efe8] flex items-center gap-1"
            >
              <List size={11} />
              <span>Rates</span>
            </button>
          </div>
        </div>

        {/* Lineup Items Grid / Tray with isolated horizontal scroll */}
        <div
          className="overflow-x-auto no-scrollbar py-1 overscroll-x-contain touch-pan-x"
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
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
          {tickets >= 1 ? (
            <button
              type="button"
              id="gacha-1pull-ticket-btn"
              onClick={() => executeGachaSpin(1, true)}
              className="py-2 px-3 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 active:scale-95 text-white flex flex-col items-center justify-center shadow-md border border-amber-300/40 transition cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <span>1x Summon</span>
                <span className="px-1 py-0.2 rounded-xs bg-amber-900/40 text-[9px] font-bold text-amber-200">
                  🎟️ 1
                </span>
              </div>
              <span className="text-[10px] text-amber-100 font-medium mt-0.5 flex items-center gap-1">
                Use 1 Ticket ({tickets} left)
              </span>
            </button>
          ) : (
            <button
              type="button"
              id="gacha-1pull-coin-btn"
              onClick={() => executeGachaSpin(1, false)}
              disabled={shopState.coins < 50}
              className={`py-2 px-3 rounded-2xl text-xs font-black flex flex-col items-center justify-center shadow-sm transition ${
                shopState.coins >= 50
                  ? 'bg-[#5f7a61] hover:bg-[#4d6650] active:scale-95 text-white cursor-pointer'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>1x Summon</span>
              <span className="text-[10px] opacity-85 font-normal mt-0.5 flex items-center gap-1">
                50 Coins
              </span>
            </button>
          )}

          {/* 10-Pull Multi Button */}
          {tickets >= 10 ? (
            <button
              type="button"
              id="gacha-10pull-ticket-btn"
              onClick={() => executeGachaSpin(10, true)}
              className="py-2 px-3 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 active:scale-95 text-white flex flex-col items-center justify-center shadow-md border border-amber-300/40 transition cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <span>10x Multi Summon</span>
                <span className="px-1 py-0.2 rounded-xs bg-amber-950/50 text-[9px] font-bold text-amber-200">
                  🎟️ 10
                </span>
              </div>
              <span className="text-[10px] text-amber-100 font-medium mt-0.5">
                Use 10 Tickets ({tickets} left)
              </span>
            </button>
          ) : (
            <button
              type="button"
              id="gacha-10pull-coin-btn"
              onClick={() => executeGachaSpin(10, false)}
              disabled={shopState.coins < 450}
              className={`py-2 px-3 rounded-2xl text-xs font-black flex flex-col items-center justify-center shadow-sm transition ${
                shopState.coins >= 450
                  ? 'bg-[#b86f52] hover:bg-[#9e5c43] active:scale-95 text-white cursor-pointer'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
              }`}
            >
              <span>10x Multi Summon</span>
              <span className="text-[10px] opacity-85 font-normal mt-0.5">
                450 Coins (10% OFF)
              </span>
            </button>
          )}
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
              const preferTicket = lastSpinParams.useTicket && tickets >= lastSpinParams.count;
              setActiveSummonResults(null);
              setTimeout(() => {
                executeGachaSpin(lastSpinParams.count, preferTicket);
              }, 150);
            }
          }}
          canSpinAgain={
            lastSpinParams
              ? lastSpinParams.useTicket
                ? tickets >= lastSpinParams.count
                : shopState.coins >= (lastSpinParams.count === 10 ? 450 : 50)
              : false
          }
          spinAgainLabel={
            lastSpinParams
              ? lastSpinParams.useTicket && tickets >= lastSpinParams.count
                ? `SPIN (${lastSpinParams.count} 🎟️)`
                : `SPIN (${lastSpinParams.count === 10 ? 450 : 50} 🪙)`
              : undefined
          }
          spinAgainCost={lastSpinParams?.count === 10 ? 450 : 50}
          soundEnabled={soundEnabled}
          hapticEnabled={hapticEnabled}
        />
      )}

      {/* Lineup Rates Modal */}
      {showLineupModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#faf8f5] dark:bg-[#201c18] border border-black/10 dark:border-white/10 rounded-3xl w-full max-w-md max-h-[85vh] p-5 space-y-3.5 shadow-xl text-[#2d2823] dark:text-[#f4efe8] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
              <h3 className="text-sm font-black flex items-center gap-1.5">
                <List size={16} />
                <span>Gacha Pool & Probabilities</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowLineupModal(false)}
                className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-xs"
              >
                <X size={14} />
              </button>
            </div>

            {/* Rates Overview Cards */}
            <div className="grid grid-cols-3 gap-2 text-xs shrink-0">
              <div className="p-2 rounded-xl bg-[#d4a373]/15 border border-[#d4a373]/30 flex flex-col items-center justify-center">
                <span className="font-extrabold text-[#8a5d2c] dark:text-[#d4a373] text-[11px]">Super Rare (SR)</span>
                <span className="font-black text-sm">2.5%</span>
              </div>
              <div className="p-2 rounded-xl bg-[#6b7b8c]/15 border border-[#6b7b8c]/30 flex flex-col items-center justify-center">
                <span className="font-extrabold text-[#405060] dark:text-[#9ab0c4] text-[11px]">Rare (R)</span>
                <span className="font-black text-sm">15.0%</span>
              </div>
              <div className="p-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] flex flex-col items-center justify-center">
                <span className="font-extrabold text-[#554b3f] dark:text-[#c4b5a5] text-[11px]">Normal (N)</span>
                <span className="font-black text-sm">82.5%</span>
              </div>
            </div>

            {/* Scrollable Item Pool Breakdown */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1 text-xs">
              <div>
                <h4 className="font-black text-xs text-[#8a5d2c] dark:text-[#d4a373] mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <PixelIcon name="star" size={13} />
                    <span>Super Rare (SR) - Habitats & Rare Pets</span>
                  </span>
                  <span className="text-[10px] font-normal opacity-75">
                    {gachaPoolItems.filter(i => getGachaGrade(i) === 'SR').length} Items
                  </span>
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                  {gachaPoolItems.filter(i => getGachaGrade(i) === 'SR').map(item => {
                    const owned = isItemOwned(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-1.5 rounded-xl border flex flex-col items-center text-center gap-1 relative ${
                          owned ? 'bg-[#5f7a61]/10 border-[#5f7a61]/40' : 'bg-black/[0.02] dark:bg-white/[0.03] border-black/5 dark:border-white/10'
                        }`}
                        title={item.name}
                      >
                        <PixelItemThumbnail id={item.id} category={item.category} size={24} />
                        <span className="text-[9px] font-bold leading-tight line-clamp-1 w-full">{item.name}</span>
                        {owned && (
                          <span className="text-[7.5px] font-black text-[#5f7a61] dark:text-[#8cb88f]">OWNED</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-black text-xs text-[#405060] dark:text-[#9ab0c4] mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <PixelIcon name="sparkle" size={13} />
                    <span>Rare (R) - Outfits, Skins & Pets</span>
                  </span>
                  <span className="text-[10px] font-normal opacity-75">
                    {gachaPoolItems.filter(i => getGachaGrade(i) === 'R').length} Items
                  </span>
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                  {gachaPoolItems.filter(i => getGachaGrade(i) === 'R').map(item => {
                    const owned = isItemOwned(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-1.5 rounded-xl border flex flex-col items-center text-center gap-1 relative ${
                          owned ? 'bg-[#5f7a61]/10 border-[#5f7a61]/40' : 'bg-black/[0.02] dark:bg-white/[0.03] border-black/5 dark:border-white/10'
                        }`}
                        title={item.name}
                      >
                        <PixelItemThumbnail id={item.id} category={item.category} size={24} />
                        <span className="text-[9px] font-bold leading-tight line-clamp-1 w-full">{item.name}</span>
                        {owned && (
                          <span className="text-[7.5px] font-black text-[#5f7a61] dark:text-[#8cb88f]">OWNED</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-black text-xs text-[#554b3f] dark:text-[#c4b5a5] mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <PixelIcon name="leaf" size={13} />
                    <span>Normal (N) - Hats, Props & Accessories</span>
                  </span>
                  <span className="text-[10px] font-normal opacity-75">
                    {gachaPoolItems.filter(i => getGachaGrade(i) === 'N').length} Items
                  </span>
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                  {gachaPoolItems.filter(i => getGachaGrade(i) === 'N').map(item => {
                    const owned = isItemOwned(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-1.5 rounded-xl border flex flex-col items-center text-center gap-1 relative ${
                          owned ? 'bg-[#5f7a61]/10 border-[#5f7a61]/40' : 'bg-black/[0.02] dark:bg-white/[0.03] border-black/5 dark:border-white/10'
                        }`}
                        title={item.name}
                      >
                        <PixelItemThumbnail id={item.id} category={item.category} size={24} />
                        <span className="text-[9px] font-bold leading-tight line-clamp-1 w-full">{item.name}</span>
                        {owned && (
                          <span className="text-[7.5px] font-black text-[#5f7a61] dark:text-[#8cb88f]">OWNED</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="text-[10.5px] text-[#8c7e70] dark:text-[#a89b8d] leading-relaxed shrink-0">
              * Duplicates automatically refund Lily Coins based on rarity grade. 10x multi-spins offer a 10% coin discount.
            </p>

            <button
              type="button"
              onClick={() => setShowLineupModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#5f7a61] text-white font-bold text-xs shrink-0 active:scale-98 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

