import React, { useState, useMemo, useEffect } from 'react';
import {
  PixelSceneConfig,
  FrogShopState,
  ShopCategory,
  ShopItem,
  GachaPullResult,
  GachaGrade,
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
import { ItemDetailModal } from './ItemDetailModal';
import { GachaSummonAnimation } from './GachaSummonAnimation';
import {
  Sparkles,
  ArrowLeft,
  Shirt,
  Check,
  Heart,
  List,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  ChevronDown,
  Gift,
  Calendar,
  Layers,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine, triggerHaptic } from '../utils/audioUtils';

interface ExtendedCategory {
  id: ShopCategory | 'sets' | 'weather' | 'all';
  label: string;
  icon: string;
}

const WARDROBE_CATEGORIES: ExtendedCategory[] = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'hats', label: 'Hats', icon: '👒' },
  { id: 'outfits', label: 'Outfits', icon: '👘' },
  { id: 'accessories', label: 'Face', icon: '👓' },
  { id: 'skins', label: 'Skins', icon: '🐸' },
  { id: 'props', label: 'Items', icon: '🧋' },
  { id: 'companions', label: 'Pets', icon: '🐌' },
  { id: 'scenes', label: 'Rooms', icon: '🏞️' },
  { id: 'weather', label: 'Sky', icon: '☀️' },
  { id: 'sets', label: 'Sets', icon: '🎁' },
];

export function getGachaGrade(item: ShopItem): GachaGrade {
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

interface ShopGachaViewProps {
  config: PixelSceneConfig;
  onUpdateConfig: (patch: Partial<PixelSceneConfig>) => void;
  shopState: FrogShopState;
  onGachaPullResults: (results: GachaPullResult[], totalCost: number, isDailyFree?: boolean) => void;
  onToggleWishlist?: (itemId: string) => void;
  onClaimSetCompletionBonus?: (setId: string, rewardCoins: number) => void;
  initialTab?: 'gacha' | 'wardrobe';
  onBack?: () => void;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
}

export const ShopGachaView: React.FC<ShopGachaViewProps> = ({
  config,
  onUpdateConfig,
  shopState,
  onGachaPullResults,
  onToggleWishlist,
  initialTab = 'gacha',
  onBack,
  soundEnabled = true,
  hapticEnabled = true,
}) => {
  // Main Tab: Gacha vs Wardrobe
  const [activeTab, setActiveTab] = useState<'gacha' | 'wardrobe'>(initialTab);

  // Inside Gacha tab: 'lobby' (Banners list matching Pokecolo IMG_2866.PNG) vs 'room' (Summon Stage)
  const [gachaViewMode, setGachaViewMode] = useState<'lobby' | 'room'>('lobby');

  // Gacha Lobby Category Filter
  const [lobbyFilter, setLobbyFilter] = useState<'all' | 'happy' | 'collection' | 'special'>('all');

  // Gacha Banner Selection
  const [selectedSetIndex, setSelectedSetIndex] = useState(0);
  const selectedSet: ThemedFrogSet = THEMED_FROG_SETS[selectedSetIndex] || THEMED_FROG_SETS[0];

  // Live fitting diorama config
  const [previewConfig, setPreviewConfig] = useState<PixelSceneConfig>({ ...config });
  const [isFittingSet, setIsFittingSet] = useState(false);

  // Wardrobe Category filter
  const [wardrobeCategory, setWardrobeCategory] = useState<ShopCategory | 'sets' | 'weather' | 'all'>('all');

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
    if (activeTab === 'gacha' && gachaViewMode === 'room') {
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
  }, [selectedSetIndex, isFittingSet, activeTab, gachaViewMode]);

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

  // Wardrobe Items list
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

  // Live try-on an item in wardrobe
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
      colors: ['#5f7a61', '#EAB308', '#EC4899'],
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

  const openBannerRoom = (index: number) => {
    if (soundEnabled) soundEngine.playTapSound();
    if (hapticEnabled) triggerHaptic();
    setSelectedSetIndex(index);
    setGachaViewMode('room');
    setIsFittingSet(true);
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto relative bg-[#faf8f5] dark:bg-[#151311] text-[#2d2823] dark:text-[#f4efe8] select-none overflow-hidden pb-16">
      {/* 1. TOP HEADER & MAIN TAB SWITCHER */}
      <div className="px-3 pt-2 pb-1.5 flex items-center justify-between z-20 gap-2 shrink-0">
        <div className="flex items-center gap-1.5 shrink-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-8 h-8 rounded-full bg-white/90 dark:bg-black/40 border border-black/10 dark:border-white/10 flex items-center justify-center text-[#554b3f] dark:text-[#e0d6cb] shadow-xs active:scale-90 transition ios-tap"
            >
              <ArrowLeft size={16} />
            </button>
          )}
        </div>

        {/* Segmented Control: Gacha vs Wardrobe */}
        <div className="flex-1 max-w-[210px] bg-black/5 dark:bg-white/10 p-0.5 rounded-full flex items-center shadow-inner">
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) soundEngine.playTapSound();
              setActiveTab('gacha');
            }}
            className={`flex-1 py-1 px-2 rounded-full text-xs font-black flex items-center justify-center gap-1 transition ${
              activeTab === 'gacha'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xs'
                : 'text-[#8c7e70] dark:text-[#a89b8d] hover:text-[#2d2823]'
            }`}
          >
            <span>🎁</span>
            <span>Gacha</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (soundEnabled) soundEngine.playTapSound();
              setActiveTab('wardrobe');
            }}
            className={`flex-1 py-1 px-2 rounded-full text-xs font-black flex items-center justify-center gap-1 transition ${
              activeTab === 'wardrobe'
                ? 'bg-[#5f7a61] text-white shadow-xs'
                : 'text-[#8c7e70] dark:text-[#a89b8d] hover:text-[#2d2823]'
            }`}
          >
            <Shirt size={12} />
            <span>Wardrobe</span>
          </button>
        </div>

        {/* Lily Coin Balance */}
        <div className="h-8 pl-2 pr-2.5 rounded-full bg-white/90 dark:bg-black/40 border border-black/10 dark:border-white/10 flex items-center gap-1.5 shadow-xs shrink-0">
          <LilyCoinIcon size={17} />
          <span className="text-xs font-black tracking-tight">{shopState.coins}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAB A: GACHA SYSTEM                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'gacha' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* ------------------------------------------------------------- */}
          {/* VIEW MODE 1: GACHA BANNER LOBBY (POKECOLO IMG_2866.PNG STYLE) */}
          {/* ------------------------------------------------------------- */}
          {gachaViewMode === 'lobby' ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Filter Pills (Happy Gacha, Collection, Special, All) */}
              <div className="px-3 pt-1 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) soundEngine.playTapSound();
                    setLobbyFilter('all');
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-black transition whitespace-nowrap ${
                    lobbyFilter === 'all'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xs'
                      : 'bg-black/5 dark:bg-white/10 text-[#8c7e70] dark:text-[#a89b8d]'
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
                  className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 transition whitespace-nowrap ${
                    lobbyFilter === 'happy'
                      ? 'bg-pink-500 text-white shadow-xs'
                      : 'bg-black/5 dark:bg-white/10 text-[#8c7e70] dark:text-[#a89b8d]'
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
                  className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 transition whitespace-nowrap ${
                    lobbyFilter === 'collection'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-black/5 dark:bg-white/10 text-[#8c7e70] dark:text-[#a89b8d]'
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
                  className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 transition whitespace-nowrap ${
                    lobbyFilter === 'special'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-black/5 dark:bg-white/10 text-[#8c7e70] dark:text-[#a89b8d]'
                  }`}
                >
                  <span>👑</span>
                  <span>Special</span>
                </button>
              </div>

              {/* Free daily banner notification pill */}
              {isDailyFreeAvailable && (
                <div className="mx-3 mb-2 p-2 rounded-2xl bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-amber-500/15 border border-pink-500/30 flex items-center justify-between shadow-2xs shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-pink-500 text-white flex items-center justify-center text-xs shadow-xs">
                      🎁
                    </span>
                    <div>
                      <p className="text-xs font-black text-pink-700 dark:text-pink-300">
                        1 Free Spin Available Today!
                      </p>
                      <p className="text-[10px] text-[#8c7e70] dark:text-[#a89b8d]">
                        Pick any gacha banner below to claim
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-pink-500 text-white animate-pulse">
                    READY
                  </span>
                </div>
              )}

              {/* Banners Vertical Scroll List (Matching Pokecolo IMG_2866.PNG) */}
              <div className="flex-1 px-3 space-y-3.5 overflow-y-auto no-scrollbar pb-6">
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
                      className="relative w-full rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 shadow-md bg-white dark:bg-[#1f1a16] cursor-pointer group active:scale-[0.98] transition-all duration-200"
                    >
                      {/* Banner Visual Art Canvas Area */}
                      <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-gradient-to-br from-[#2a2438] via-[#3d2b45] to-[#1c1824] flex items-center justify-center">
                        {/* Themed Scene Mini Diorama in background */}
                        <div className="absolute inset-0 opacity-80 group-hover:scale-105 transition-transform duration-500">
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
                            soundEnabled={false}
                          />
                        </div>

                        {/* Soft Vignette Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                        {/* Pokecolo Pink Scalloped Discount Stamp (Top Right) */}
                        <div className="absolute top-2 right-2 z-10">
                          <div className="relative w-12 h-12 flex items-center justify-center">
                            {/* Scalloped Badge Flower Background */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 shadow-md border-2 border-dashed border-white flex items-center justify-center transform group-hover:rotate-12 transition-transform" />
                            <div className="relative text-center leading-none text-white">
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

                        {/* Top Left Tag (NEW / EVENT) */}
                        <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-cyan-500 text-white shadow-xs">
                            NEW
                          </span>
                          {set.rarity === 'legendary' && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-xs">
                              ✨ Super Rare
                            </span>
                          )}
                        </div>

                        {/* Bottom Banner Title & Expiry Tag (Pokecolo style) */}
                        <div className="absolute bottom-2 left-3 right-3 z-10 flex items-end justify-between">
                          <div>
                            <h3 className="text-base font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
                              {set.name}
                            </h3>
                            <p className="text-[10px] text-pink-200/90 font-medium drop-shadow-xs">
                              {set.tagline}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Banner Bottom Footer Bar with GET progress & Quick Thumbnails */}
                      <div className="px-3 py-2 bg-[#fcfaf7] dark:bg-[#1a1613] flex items-center justify-between border-t border-black/[0.04] dark:border-white/[0.06]">
                        {/* GET Count & Progress */}
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                            GET {ownedInSet}/{itemsInSet.length}
                          </span>

                          <div className="w-16 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>

                        {/* Mini Item Icons Preview */}
                        <div className="flex items-center -space-x-1.5">
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
                            <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 text-[8px] font-black flex items-center justify-center border border-white dark:border-black shadow-2xs">
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
            /* ------------------------------------------------------------- */
            /* VIEW MODE 2: DEDICATED GACHA SUMMON & FITTING ROOM            */
            /* ------------------------------------------------------------- */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Top Navigation Bar inside Gacha Room */}
              <div className="px-2 pt-0.5 pb-1.5 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) soundEngine.playTapSound();
                    setGachaViewMode('lobby');
                  }}
                  className="px-2.5 py-1 rounded-full bg-white/90 dark:bg-black/40 border border-black/10 dark:border-white/10 flex items-center gap-1 text-xs font-black text-[#554b3f] dark:text-[#e0d6cb] shadow-xs active:scale-90 transition"
                >
                  <ArrowLeft size={13} />
                  <span>All Banners</span>
                </button>

                <div className="text-center px-2">
                  <span className="text-xs font-black truncate max-w-[170px] block">
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
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 border shadow-xs transition active:scale-90 ${
                    isFittingSet
                      ? 'bg-pink-500 text-white border-pink-400'
                      : 'bg-white/85 dark:bg-black/60 text-[#4a4036] dark:text-[#e0d6cb] border-black/10'
                  }`}
                >
                  <Shirt size={11} />
                  <span>{isFittingSet ? 'Fitting' : 'Try Full'}</span>
                </button>
              </div>

              {/* Full Diorama Stage Preview */}
              <div className="relative flex-1 min-h-[260px] sm:min-h-[290px] mx-2 rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm bg-gradient-to-b from-[#e8eff0] via-[#f5f1eb] to-[#ede4d8] dark:from-[#202528] dark:via-[#1c1816] dark:to-[#171412]">
                <div className="absolute inset-0">
                  <PixelFrogScene
                    config={previewConfig}
                    size="large"
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
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white text-[#2d2823] dark:text-white border border-black/10 flex items-center justify-center shadow-xs active:scale-90 transition"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) soundEngine.playTapSound();
                    setSelectedSetIndex((prev) => (prev + 1) % THEMED_FROG_SETS.length);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white text-[#2d2823] dark:text-white border border-black/10 flex items-center justify-center shadow-xs active:scale-90 transition"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Lineup Collection Progress & Rates */}
              <div className="px-3 pt-2 pb-1 flex items-center justify-between shrink-0">
                {/* Pokecolo GET X/Y Pill */}
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                    GET {ownedCountInSet}/{setItemsList.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLineupModal(true)}
                  className="text-[11px] font-bold text-[#8c7e70] dark:text-[#a89b8d] hover:text-[#2d2823] flex items-center gap-1"
                >
                  <List size={12} />
                  <span>Lineup Rates</span>
                </button>
              </div>

              {/* Lineup Items Tray (PICTURES ONLY - CLEAN POKECOLO STYLE) */}
              <div className="px-3 py-1 overflow-x-auto no-scrollbar shrink-0">
                <div className="flex items-center gap-2 pb-1">
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
                        className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-[#201c18] border border-black/[0.08] dark:border-white/[0.1] hover:border-pink-400/80 flex items-center justify-center shrink-0 shadow-2xs active:scale-95 transition-all overflow-hidden group"
                      >
                        {/* Grade Badge (Top Left) */}
                        <span
                          className={`absolute top-1 left-1 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs z-10 ${
                            grade === 'SR'
                              ? 'bg-amber-400 text-stone-900'
                              : grade === 'R'
                              ? 'bg-purple-500 text-white'
                              : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                          }`}
                        >
                          {grade}
                        </span>

                        {/* Heart indicator (Top Right) */}
                        {isHearted && (
                          <span className="absolute top-1 right-1 z-10 text-pink-500">
                            <Heart size={9} className="fill-current" />
                          </span>
                        )}

                        {/* Pink GET Ribbon Sash (Bottom Left) */}
                        {owned && (
                          <span className="absolute bottom-0 left-0 px-1 py-0.2 rounded-tr-md text-[7px] font-black bg-pink-500 text-white z-10 tracking-tighter shadow-2xs">
                            GET
                          </span>
                        )}

                        {/* Pixel Art Thumbnail (Clean Graphic Only) */}
                        <div className="transform scale-[1.2] group-hover:scale-[1.3] transition-transform">
                          <PixelItemThumbnail
                            id={item.id}
                            category={item.category}
                            size={32}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Gacha Pull Controls */}
              <div className="p-3 pt-1 flex items-center gap-2 shrink-0">
                {/* 1-Pull Button */}
                <button
                  type="button"
                  onClick={() => executeGachaSpin(1, isDailyFreeAvailable)}
                  className="flex-1 py-2.5 px-3 rounded-2xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 active:scale-95 text-white flex flex-col items-center justify-center shadow-sm transition"
                >
                  <div className="flex items-center gap-1">
                    <span>🎁</span>
                    <span>{isDailyFreeAvailable ? 'Free 1-Pull' : '1x Pull'}</span>
                  </div>
                  <span className="text-[10px] opacity-80 font-semibold">
                    {isDailyFreeAvailable ? 'Daily Gift' : '50 Coins'}
                  </span>
                </button>

                {/* 10-Pull Multi Button */}
                <button
                  type="button"
                  onClick={() => executeGachaSpin(10, false)}
                  disabled={shopState.coins < 450}
                  className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-black flex flex-col items-center justify-center shadow-sm transition ${
                    shopState.coins >= 450
                      ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:opacity-90 active:scale-95 text-white'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>✨</span>
                    <span>10x Multi Spin</span>
                  </div>
                  <span className="text-[10px] opacity-90 font-semibold">
                    450 Coins (10% OFF)
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB B: WARDROBE & DRESS UP (FULL SCENE BACKGROUND + PIXELS ONLY GRID)   */}
      {/* ========================================================================= */}
      {activeTab === 'wardrobe' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Full Scene Background Diorama Preview */}
          <div className="relative flex-1 min-h-[250px] sm:min-h-[280px] mx-2 rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm bg-gradient-to-b from-[#e8eff0] via-[#f5f1eb] to-[#ede4d8] dark:from-[#202528] dark:via-[#1c1816] dark:to-[#171412]">
            <div className="absolute inset-0">
              <PixelFrogScene
                config={previewConfig}
                size="large"
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

            {/* Wear This Look Button (Floating on bottom center of diorama) */}
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

          {/* Category Selector Tabs */}
          <div className="px-2 pt-2 pb-1 overflow-x-auto no-scrollbar shrink-0">
            <div className="flex items-center gap-1 pb-1">
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
                    className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 transition whitespace-nowrap ${
                      isActive
                        ? 'bg-[#5f7a61] text-white shadow-xs'
                        : 'bg-black/5 dark:bg-white/10 text-[#8c7e70] dark:text-[#a89b8d] hover:text-[#2d2823]'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wardrobe Items Grid (PICTURES ONLY - CLEAN POKECOLO STYLE) */}
          <div className="flex-1 px-3 py-1 overflow-y-auto max-h-[220px]">
            {wardrobeCategory === 'sets' ? (
              /* Themed Sets Direct Equip */
              <div className="grid grid-cols-2 gap-2 pb-2">
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
                    className="p-2 rounded-2xl bg-white dark:bg-[#201c18] border border-black/[0.06] dark:border-white/[0.08] text-left flex items-center gap-2 hover:border-[#5f7a61] transition"
                  >
                    <span className="text-xl">{set.bannerEmoji}</span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-black truncate">{set.name}</h4>
                      <p className="text-[10px] text-[#8c7e70] dark:text-[#a89b8d] truncate">
                        {set.tagline}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              /* Clean Item Thumbnails Grid */
              <div className="grid grid-cols-5 gap-2 pb-2">
                {ownedWardrobeItems.map((item) => {
                  const isEquipped = isItemEquippedInPreview(item);
                  const grade = getGachaGrade(item);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleWardrobeEquip(item)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setSelectedItemForDetail(item);
                      }}
                      className={`relative aspect-square rounded-2xl bg-white dark:bg-[#201c18] border flex items-center justify-center p-1 shadow-2xs active:scale-95 transition-all overflow-hidden group ${
                        isEquipped
                          ? 'border-[#5f7a61] ring-2 ring-[#5f7a61]/30 bg-[#5f7a61]/5'
                          : 'border-black/[0.08] dark:border-white/[0.1] hover:border-[#5f7a61]/60'
                      }`}
                    >
                      {/* Grade Badge */}
                      <span
                        className={`absolute top-1 left-1 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs z-10 ${
                          grade === 'SR'
                            ? 'bg-amber-400 text-stone-900'
                            : grade === 'R'
                            ? 'bg-purple-500 text-white'
                            : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        {grade}
                      </span>

                      {/* Equipped Checkmark (Top Right) */}
                      {isEquipped && (
                        <span className="absolute top-1 right-1 z-10 w-4 h-4 rounded-full bg-[#5f7a61] text-white flex items-center justify-center shadow-xs">
                          <Check size={10} />
                        </span>
                      )}

                      {/* Pixel Art Thumbnail (Clean Graphic Only) */}
                      <div className="transform scale-[1.2] group-hover:scale-[1.3] transition-transform">
                        <PixelItemThumbnail
                          id={item.id}
                          category={item.category}
                          size={32}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. POKECOLO ITEM DETAIL MODAL (IMG_2863.PNG STYLE)                       */}
      {/* ========================================================================= */}
      <ItemDetailModal
        item={selectedItemForDetail}
        isOpen={!!selectedItemForDetail}
        onClose={() => setSelectedItemForDetail(null)}
        isOwned={selectedItemForDetail ? isItemOwned(selectedItemForDetail.id) : false}
        isEquipped={selectedItemForDetail ? isItemEquippedInPreview(selectedItemForDetail) : false}
        onEquip={(item) => {
          handleWardrobeEquip(item);
          onUpdateConfig(previewConfig);
        }}
        onTryOn={(item) => {
          handleWardrobeEquip(item);
        }}
        isWishlisted={
          selectedItemForDetail ? shopState.wishlistIds?.includes(selectedItemForDetail.id) : false
        }
        onToggleWishlist={onToggleWishlist}
        soundEnabled={soundEnabled}
        hapticEnabled={hapticEnabled}
      />

      {/* ========================================================================= */}
      {/* 5. GACHA SUMMON ANIMATION (IMG_2865.PNG STYLE)                            */}
      {/* ========================================================================= */}
      {activeSummonResults && (
        <GachaSummonAnimation
          results={activeSummonResults}
          onComplete={() => setActiveSummonResults(null)}
          onSpinAgain={() => {
            if (lastSpinParams) {
              setActiveSummonResults(null);
              executeGachaSpin(lastSpinParams.count, false);
            }
          }}
          canSpinAgain={lastSpinParams ? shopState.coins >= (lastSpinParams.count === 1 ? 50 : 450) : false}
          spinAgainCost={lastSpinParams?.count === 10 ? 450 : 50}
          soundEnabled={soundEnabled}
          hapticEnabled={hapticEnabled}
        />
      )}

      {/* ========================================================================= */}
      {/* 6. LINEUP RATES MODAL                                                     */}
      {/* ========================================================================= */}
      {showLineupModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowLineupModal(false)}
        >
          <div
            className="bg-[#fcfaf5] dark:bg-[#1a1714] border border-[#e3dacf] dark:border-[#383028] rounded-[28px] max-w-sm w-full p-5 shadow-2xl overflow-hidden animate-scale-up space-y-3.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <h3 className="font-black text-sm text-[#2d2823] dark:text-[#f4efe8]">
                {selectedSet.name} Rates
              </h3>
              <button
                type="button"
                onClick={() => setShowLineupModal(false)}
                className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-[#6e6052] dark:text-[#d6cbbe]"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="font-bold text-amber-600 dark:text-amber-400">✨ Super Rare (SR)</span>
                <span className="font-black">8.0%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <span className="font-bold text-purple-600 dark:text-purple-400">💜 Rare (R)</span>
                <span className="font-black">27.0%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-stone-500/10 border border-stone-500/20">
                <span className="font-bold text-stone-600 dark:text-stone-400">🤍 Normal (N)</span>
                <span className="font-black">65.0%</span>
              </div>
            </div>

            <div className="text-[11px] text-[#8c7e70] dark:text-[#a89b8d]">
              Duplicate items automatically convert into refund coins. Every 10x spin includes 1 guaranteed Rare or higher!
            </div>

            <button
              type="button"
              onClick={() => setShowLineupModal(false)}
              className="w-full py-2.5 rounded-2xl text-xs font-black bg-[#5f7a61] text-white transition active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
