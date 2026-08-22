import React, { useState, useMemo, useEffect } from 'react';
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
import { ItemDetailModal } from './ItemDetailModal';
import { getGachaGrade } from '../utils/gachaUtils';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Shirt,
  Sparkles,
  Heart,
  List,
  Gift,
  Check,
  X,
} from 'lucide-react';
import { soundEngine, triggerHaptic } from '../utils/audioUtils';

interface GachaViewProps {
  config: PixelSceneConfig;
  onUpdateConfig: (patch: Partial<PixelSceneConfig>) => void;
  shopState: FrogShopState;
  onGachaPullResults: (results: GachaPullResult[], totalCost: number, isDailyFree?: boolean) => void;
  onToggleWishlist?: (itemId: string) => void;
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
  onBack,
  soundEnabled = true,
  hapticEnabled = true,
}) => {
  // Gacha View Mode: 'lobby' (Banners list) vs 'room' (Summon Stage)
  const [gachaViewMode, setGachaViewMode] = useState<'lobby' | 'room'>('lobby');

  // Gacha Lobby Category Filter
  const [lobbyFilter, setLobbyFilter] = useState<'all' | 'happy' | 'collection' | 'special'>('all');

  // Selected Banner Set
  const [selectedSetIndex, setSelectedSetIndex] = useState(0);
  const selectedSet: ThemedFrogSet = THEMED_FROG_SETS[selectedSetIndex] || THEMED_FROG_SETS[0];

  // Live fitting diorama config
  const [previewConfig, setPreviewConfig] = useState<PixelSceneConfig>({ ...config });
  const [isFittingSet, setIsFittingSet] = useState(false);

  // Item Detail Modal
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<ShopItem | null>(null);

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

  // Sync banner preview when set changes or fitting is toggled
  useEffect(() => {
    if (gachaViewMode === 'room') {
      if (isFittingSet) {
        setPreviewConfig({
          ...config,
          sceneId: selectedSet.items.sceneId,
          outfitId: selectedSet.items.outfitId,
          hatId: selectedSet.items.hatId,
          glassesId: selectedSet.items.glassesId,
          activityId: selectedSet.items.activityId,
          companionId: selectedSet.items.companionId,
          skinId: selectedSet.items.skinId,
          weatherId: selectedSet.items.weatherId || 'auto',
        });
      } else {
        setPreviewConfig({ ...config });
      }
    }
  }, [selectedSetIndex, isFittingSet, gachaViewMode]);

  // Items in the active banner set
  const setItemsList = useMemo(() => {
    return selectedSet.itemIds
      .map((id) => SHOP_CATALOG.find((item) => item.id === id))
      .filter((item): item is ShopItem => !!item);
  }, [selectedSet]);

  const ownedCountInSet = useMemo(() => {
    return setItemsList.filter((item) => isItemOwned(item.id)).length;
  }, [setItemsList, shopState.ownedItemIds]);

  // Filtered themed sets in lobby
  const filteredSets = useMemo(() => {
    if (lobbyFilter === 'happy') {
      return THEMED_FROG_SETS.filter((s) => s.rarity === 'legendary');
    }
    if (lobbyFilter === 'collection') {
      return THEMED_FROG_SETS.filter((s) => s.rarity === 'epic' || s.rarity === 'rare');
    }
    if (lobbyFilter === 'special') {
      return THEMED_FROG_SETS.filter((s) => s.id.includes('sakura') || s.id.includes('emperor') || s.id.includes('ivory'));
    }
    return THEMED_FROG_SETS;
  }, [lobbyFilter]);

  // Gacha spin execution
  const executeGachaSpin = (count: 1 | 10, isFreeDaily: boolean = false) => {
    const cost = isFreeDaily ? 0 : count === 1 ? 50 : 450;
    if (!isFreeDaily && shopState.coins < cost) {
      if (soundEnabled) soundEngine.playTapSound();
      return;
    }

    if (hapticEnabled) triggerHaptic();

    const bannerItems = setItemsList.length > 0 ? setItemsList : SHOP_CATALOG;
    const results: GachaPullResult[] = [];

    // Check for jackpot full set
    const jackpotChance = count === 10 ? 0.04 : 0.015;
    if (!isFreeDaily && Math.random() < jackpotChance) {
      bannerItems.forEach((item) => {
        const alreadyOwned = isItemOwned(item.id);
        results.push({
          item,
          isNew: !alreadyOwned,
          isJackpotFullSet: true,
          setName: selectedSet.name,
          duplicateRefundCoins: alreadyOwned ? 25 : undefined,
        });
      });
    } else {
      for (let i = 0; i < count; i++) {
        const item = bannerItems[Math.floor(Math.random() * bannerItems.length)] || SHOP_CATALOG[0];
        const alreadyOwned = isItemOwned(item.id) || results.some((r) => r.item.id === item.id);
        const grade = getGachaGrade(item);
        const refund = alreadyOwned ? (grade === 'SR' ? 45 : grade === 'R' ? 30 : 15) : undefined;

        results.push({
          item,
          isNew: !alreadyOwned,
          duplicateRefundCoins: refund,
        });
      }
    }

    onGachaPullResults(results, cost, isFreeDaily);
    setLastSpinParams({ count, isFree: isFreeDaily });
    setActiveSummonResults(results);
  };

  const openBannerRoom = (index: number) => {
    if (soundEnabled) soundEngine.playTapSound();
    if (hapticEnabled) triggerHaptic();
    setSelectedSetIndex(index);
    setGachaViewMode('room');
    setIsFittingSet(true);
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
              <span>🎁</span>
              <span>Gacha Sanctuary</span>
            </h2>
            <p className="text-[11px] text-[#8c7e70] dark:text-[#a89b8d] font-medium">
              Collect seasonal outfits & habitat themes
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

      {/* ========================================================================= */}
      {/* 2. GACHA BANNER LOBBY OR SUMMON ROOM                                      */}
      {/* ========================================================================= */}
      {gachaViewMode === 'lobby' ? (
        <div className="space-y-3">
          {/* Filter Pills (All, Happy Gacha, Collection, Special) in Cozy Palette */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) soundEngine.playTapSound();
                setLobbyFilter('all');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                lobbyFilter === 'all'
                  ? 'bg-[#5f7a61] text-white shadow-xs'
                  : 'bg-white/80 dark:bg-white/[0.08] text-[#554b3f] dark:text-[#c4b5a5] border border-black/[0.06] dark:border-white/[0.08]'
              }`}
            >
              All Banners
            </button>

            <button
              type="button"
              onClick={() => {
                if (soundEnabled) soundEngine.playTapSound();
                setLobbyFilter('happy');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                lobbyFilter === 'happy'
                  ? 'bg-[#c47069] text-white shadow-xs'
                  : 'bg-white/80 dark:bg-white/[0.08] text-[#554b3f] dark:text-[#c4b5a5] border border-black/[0.06] dark:border-white/[0.08]'
              }`}
            >
              <span>🌸</span>
              <span>Happy Gacha</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (soundEnabled) soundEngine.playTapSound();
                setLobbyFilter('collection');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                lobbyFilter === 'collection'
                  ? 'bg-[#6b7b8c] text-white shadow-xs'
                  : 'bg-white/80 dark:bg-white/[0.08] text-[#554b3f] dark:text-[#c4b5a5] border border-black/[0.06] dark:border-white/[0.08]'
              }`}
            >
              <span>🍀</span>
              <span>Collection</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (soundEnabled) soundEngine.playTapSound();
                setLobbyFilter('special');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                lobbyFilter === 'special'
                  ? 'bg-[#b8860b] text-white shadow-xs'
                  : 'bg-white/80 dark:bg-white/[0.08] text-[#554b3f] dark:text-[#c4b5a5] border border-black/[0.06] dark:border-white/[0.08]'
              }`}
            >
              <span>👑</span>
              <span>Special</span>
            </button>
          </div>

          {/* Daily Free Pull Notification Banner */}
          {isDailyFreeAvailable && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-[#5f7a61]/12 via-[#c47069]/10 to-[#d4a373]/12 border border-[#5f7a61]/25 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#5f7a61] text-white flex items-center justify-center text-sm shadow-xs">
                  🎁
                </span>
                <div>
                  <p className="text-xs font-extrabold text-[#2d2823] dark:text-[#f4efe8]">
                    1 Free Spin Available Today!
                  </p>
                  <p className="text-[10.5px] text-[#8c7e70] dark:text-[#a89b8d]">
                    Tap any gacha theme below to summon
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#5f7a61] text-white shadow-xs">
                READY
              </span>
            </div>
          )}

          {/* Banners Vertical List - Full Cards without cutoff */}
          <div className="space-y-3.5 pt-0.5">
            {filteredSets.map((set) => {
              const setIndex = THEMED_FROG_SETS.findIndex((s) => s.id === set.id);
              const itemsInSet = set.itemIds
                .map((id) => SHOP_CATALOG.find((i) => i.id === id))
                .filter((i): i is ShopItem => !!i);
              const ownedInSet = itemsInSet.filter((i) => isItemOwned(i.id)).length;
              const progressPct = Math.round((ownedInSet / (itemsInSet.length || 1)) * 100);

              return (
                <div
                  key={set.id}
                  onClick={() => openBannerRoom(setIndex)}
                  className="w-full rounded-[24px] overflow-hidden border border-black/[0.08] dark:border-white/[0.1] shadow-sm bg-white dark:bg-[#1f1a16] cursor-pointer group active:scale-[0.98] transition-all duration-200"
                >
                  {/* Banner Visual Art Canvas Area */}
                  <div className="relative w-full h-40 sm:h-44 overflow-hidden bg-gradient-to-br from-[#2a2420] via-[#38302b] to-[#1c1815] flex items-center justify-center">
                    {/* Themed Scene Mini Diorama in background */}
                    <div className="absolute inset-0 opacity-85 group-hover:scale-105 transition-transform duration-500">
                      <PixelFrogScene
                        config={{
                          sceneId: set.items.sceneId,
                          outfitId: set.items.outfitId,
                          hatId: set.items.hatId,
                          glassesId: set.items.glassesId,
                          activityId: set.items.activityId,
                          companionId: set.items.companionId,
                          skinId: set.items.skinId,
                          weatherId: set.items.weatherId || 'auto',
                        }}
                        size="compact"
                        showInfoBar={false}
                        soundEnabled={false}
                      />
                    </div>

                    {/* Soft Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Scalloped Discount Stamp (Cozy Terracotta / Rose Gold) */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#c47069] to-[#a85852] shadow-md border border-dashed border-white/80 flex items-center justify-center transform group-hover:rotate-6 transition-transform" />
                        <div className="relative text-center leading-none text-white drop-shadow-xs">
                          <span className="text-[7px] block font-black uppercase tracking-tighter opacity-90">
                            1st TIME
                          </span>
                          <span className="text-[11px] block font-black leading-tight">
                            {isDailyFreeAvailable ? 'FREE' : '70%'}
                          </span>
                          <span className="text-[6px] block font-black tracking-tighter opacity-90">
                            {isDailyFreeAvailable ? 'GIFT' : 'OFF'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Top Left Tag (NEW / Super Rare) */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#5f7a61] text-white shadow-xs">
                        NEW
                      </span>
                      {set.rarity === 'legendary' && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#d4a373] text-[#2d2823] shadow-xs">
                          ✨ Super Rare
                        </span>
                      )}
                    </div>

                    {/* Bottom Banner Title & Tagline */}
                    <div className="absolute bottom-2.5 left-3.5 right-3.5 z-10 flex items-end justify-between">
                      <div>
                        <h3 className="text-base font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
                          {set.name}
                        </h3>
                        <p className="text-[11px] text-[#f2e6d8] font-medium drop-shadow-xs">
                          {set.tagline}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Banner Bottom Footer Bar with GET progress & Quick Thumbnails */}
                  <div className="px-3.5 py-2.5 bg-[#fcfaf7] dark:bg-[#1a1613] flex items-center justify-between border-t border-black/[0.04] dark:border-white/[0.06]">
                    {/* GET Count & Progress */}
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10.5px] font-black bg-[#5f7a61]/15 text-[#4d6650] dark:text-[#8cb88f] border border-[#5f7a61]/30">
                        GET {ownedInSet}/{itemsInSet.length}
                      </span>

                      <div className="w-16 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-[#5f7a61] dark:bg-[#7d9d80] rounded-full transition-all"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Mini Item Icons Preview */}
                    <div className="flex items-center -space-x-1">
                      {itemsInSet.slice(0, 4).map((item, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full bg-white dark:bg-[#2a2420] border border-black/10 dark:border-white/10 flex items-center justify-center overflow-hidden shadow-2xs"
                        >
                          <div className="transform scale-[0.6]">
                            <PixelItemThumbnail id={item.id} category={item.category} size={24} />
                          </div>
                        </div>
                      ))}
                      {itemsInSet.length > 4 && (
                        <div className="w-6 h-6 rounded-full bg-[#ebe4d8] dark:bg-stone-700 text-[#554b3f] dark:text-stone-300 text-[8px] font-black flex items-center justify-center border border-white dark:border-black shadow-2xs">
                          +{itemsInSet.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 3. DEDICATED GACHA SUMMON & FITTING ROOM                                   */
        /* ========================================================================= */
        <div className="space-y-3">
          {/* Top Navigation Bar inside Gacha Room */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) soundEngine.playTapSound();
                setGachaViewMode('lobby');
              }}
              className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-white/[0.08] border border-black/10 dark:border-white/10 flex items-center gap-1.5 text-xs font-bold text-[#4a4036] dark:text-[#e0d6cb] shadow-xs active:scale-95 transition ios-tap"
            >
              <ArrowLeft size={14} />
              <span>All Banners</span>
            </button>

            <div className="text-center px-2 min-w-0">
              <span className="text-xs font-black truncate max-w-[160px] block text-[#2d2823] dark:text-[#f4efe8]">
                {selectedSet.name}
              </span>
            </div>

            {/* Try Full Set Toggle */}
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) soundEngine.playTapSound();
                setIsFittingSet(!isFittingSet);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border shadow-xs transition active:scale-95 ${
                isFittingSet
                  ? 'bg-[#5f7a61] text-white border-[#5f7a61]'
                  : 'bg-white/85 dark:bg-white/[0.08] text-[#4a4036] dark:text-[#e0d6cb] border-black/10 dark:border-white/10'
              }`}
            >
              <Shirt size={12} />
              <span>{isFittingSet ? 'Fitting Set' : 'Try Set'}</span>
            </button>
          </div>

          {/* Full Diorama Stage Preview */}
          <div className="relative h-[250px] sm:h-[280px] rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm bg-gradient-to-b from-[#e8eff0] via-[#f5f1eb] to-[#ede4d8] dark:from-[#202528] dark:via-[#1c1816] dark:to-[#171412]">
            <div className="absolute inset-0">
              <PixelFrogScene
                config={previewConfig}
                size="large"
                showInfoBar={false}
                soundEnabled={soundEnabled}
              />
            </div>

            {/* Left & Right Switcher Buttons to cycle sets */}
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) soundEngine.playTapSound();
                setSelectedSetIndex((prev) => (prev - 1 + THEMED_FROG_SETS.length) % THEMED_FROG_SETS.length);
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 dark:bg-black/60 hover:bg-white text-[#2d2823] dark:text-white border border-black/10 flex items-center justify-center shadow-xs active:scale-90 transition"
              title="Previous Banner"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => {
                if (soundEnabled) soundEngine.playTapSound();
                setSelectedSetIndex((prev) => (prev + 1) % THEMED_FROG_SETS.length);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 dark:bg-black/60 hover:bg-white text-[#2d2823] dark:text-white border border-black/10 flex items-center justify-center shadow-xs active:scale-90 transition"
              title="Next Banner"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Lineup Collection Progress & Rates */}
          <div className="flex items-center justify-between px-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#5f7a61]/15 text-[#4d6650] dark:text-[#8cb88f] border border-[#5f7a61]/30">
              GET {ownedCountInSet}/{setItemsList.length} Items
            </span>

            <button
              type="button"
              onClick={() => setShowLineupModal(true)}
              className="text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] hover:text-[#2d2823] dark:hover:text-[#f4efe8] flex items-center gap-1"
            >
              <List size={13} />
              <span>Lineup Rates</span>
            </button>
          </div>

          {/* Lineup Items Tray (PICTURES ONLY) */}
          <div className="overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center gap-2">
              {setItemsList.map((item) => {
                const grade = getGachaGrade(item);
                const owned = isItemOwned(item.id);
                const isHearted = shopState.wishlistIds?.includes(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (soundEnabled) soundEngine.playTapSound();
                      if (hapticEnabled) triggerHaptic();
                      setSelectedItemForDetail(item);
                    }}
                    className="relative w-14 h-14 rounded-2xl bg-white dark:bg-[#201c18] border border-black/[0.08] dark:border-white/[0.1] hover:border-[#5f7a61] flex items-center justify-center shrink-0 shadow-2xs active:scale-95 transition-all overflow-hidden group"
                  >
                    {/* Grade Badge */}
                    <span
                      className={`absolute top-1 left-1 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs z-10 ${
                        grade === 'SR'
                          ? 'bg-[#d4a373] text-[#2d2823]'
                          : grade === 'R'
                          ? 'bg-[#6b7b8c] text-white'
                          : 'bg-[#ebe4d8] dark:bg-stone-700 text-[#554b3f] dark:text-stone-300'
                      }`}
                    >
                      {grade}
                    </span>

                    {/* Heart indicator */}
                    {isHearted && (
                      <span className="absolute top-1 right-1 z-10 text-[#c47069]">
                        <Heart size={10} className="fill-current" />
                      </span>
                    )}

                    {/* GET Ribbon */}
                    {owned && (
                      <span className="absolute bottom-0 left-0 px-1.5 py-0.2 rounded-tr-md text-[7px] font-black bg-[#5f7a61] text-white z-10 tracking-tighter shadow-2xs">
                        GET
                      </span>
                    )}

                    {/* Pixel Art Thumbnail */}
                    <div className="transform scale-[1.2] group-hover:scale-[1.3] transition-transform">
                      <PixelItemThumbnail id={item.id} category={item.category} size={32} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Gacha Pull Controls (1x & 10x) */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {/* 1-Pull Button */}
            <button
              type="button"
              onClick={() => executeGachaSpin(1, isDailyFreeAvailable)}
              className="py-3 px-3 rounded-2xl text-xs font-black bg-[#5f7a61] hover:bg-[#4d6650] active:scale-95 text-white flex flex-col items-center justify-center shadow-sm transition"
            >
              <div className="flex items-center gap-1.5">
                <span>🎁</span>
                <span>{isDailyFreeAvailable ? 'Free 1-Pull' : '1x Pull'}</span>
              </div>
              <span className="text-[10px] opacity-85 font-medium mt-0.5">
                {isDailyFreeAvailable ? 'Daily Gift' : '50 Coins'}
              </span>
            </button>

            {/* 10-Pull Multi Button */}
            <button
              type="button"
              onClick={() => executeGachaSpin(10, false)}
              disabled={shopState.coins < 450}
              className={`py-3 px-3 rounded-2xl text-xs font-black flex flex-col items-center justify-center shadow-sm transition ${
                shopState.coins >= 450
                  ? 'bg-[#b86f52] hover:bg-[#9e5c43] active:scale-95 text-white'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>✨</span>
                <span>10x Multi Spin</span>
              </div>
              <span className="text-[10px] opacity-90 font-medium mt-0.5">
                450 Coins (10% OFF)
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODALS: ITEM DETAIL, SUMMON ANIMATION & RATES LINEUP                   */}
      {/* ========================================================================= */}
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
                <span className="font-extrabold text-[#8a5d2c] dark:text-[#d4a373]">✨ Super Rare (SR)</span>
                <span className="font-black">6.0%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#6b7b8c]/15 border border-[#6b7b8c]/30 flex items-center justify-between">
                <span className="font-extrabold text-[#405060] dark:text-[#9ab0c4]">💎 Rare (R)</span>
                <span className="font-black">24.0%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between">
                <span className="font-extrabold text-[#554b3f] dark:text-[#c4b5a5]">🍃 Normal (N)</span>
                <span className="font-black">70.0%</span>
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
