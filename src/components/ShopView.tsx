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
  WEATHER_ITEMS,
  SCENE_LOCATIONS,
  FROG_ACTIVITIES,
  FROG_HATS,
  FROG_OUTFITS,
  FROG_GLASSES,
  FROG_SKINS,
  FROG_COMPANIONS,
} from '../types';
import { SHOP_CATALOG } from '../data/shopCatalog';
import { PixelFrogSolo } from './PixelFrogScene';
import {
  LilyCoinIcon,
  PixelCheckIcon,
} from './FrogIcons';
import { PixelItemThumbnail } from './PixelItemThumbnail';
import { PixelIcon } from './PixelIcon';
import {
  Sparkles,
  ShoppingBag,
  Gift,
  Check,
  RotateCcw,
  Search,
  CheckCircle2,
  Crown,
  ArrowLeft,
  Shuffle,
  Eye,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine, triggerHaptic } from '../utils/audioUtils';

interface ExtendedCategory {
  id: ShopCategory | 'weather' | 'all';
  label: string;
}

const CATEGORIES: ExtendedCategory[] = [
  { id: 'all', label: 'All Items' },
  { id: 'hats', label: 'Headwear' },
  { id: 'outfits', label: 'Outfits' },
  { id: 'accessories', label: 'Glasses & Face' },
  { id: 'skins', label: 'Skin Colors' },
  { id: 'props', label: 'Handheld & Poses' },
  { id: 'companions', label: 'Pets & Visitors' },
  { id: 'scenes', label: 'Habitats' },
  { id: 'weather', label: 'Sky & Weather' },
];

interface ShopViewProps {
  config: PixelSceneConfig;
  onUpdateConfig: (patch: Partial<PixelSceneConfig>) => void;
  shopState: FrogShopState;
  onBuyItem: (item: ShopItem) => boolean;
  onEquipItem: (item: ShopItem) => void;
  onClaimDailyReward: () => void;
  onBack?: () => void;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
}

export const ShopView: React.FC<ShopViewProps> = ({
  config,
  onUpdateConfig,
  shopState,
  onBuyItem,
  onEquipItem,
  onClaimDailyReward,
  onBack,
  soundEnabled = true,
  hapticEnabled = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | 'weather' | 'all'>('all');
  const [filterOwnership, setFilterOwnership] = useState<'all' | 'owned' | 'shop'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewConfig, setPreviewConfig] = useState<PixelSceneConfig>({ ...config });
  const [notification, setNotification] = useState<string | null>(null);

  // Sync preview config when actual config changes externally
  const isPreviewModified =
    previewConfig.outfitId !== config.outfitId ||
    previewConfig.hatId !== config.hatId ||
    previewConfig.glassesId !== config.glassesId ||
    previewConfig.skinId !== config.skinId ||
    previewConfig.activityId !== config.activityId ||
    previewConfig.sceneId !== config.sceneId ||
    previewConfig.companionId !== config.companionId ||
    previewConfig.weatherId !== config.weatherId;

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3200);
  };

  const handleClaimReward = () => {
    if (soundEnabled) soundEngine.playCompleteSound();
    if (hapticEnabled) triggerHaptic();

    onClaimDailyReward();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.3 },
      colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#FBBF24'],
    });
    showNotification('Claimed +50 Daily Lily Coins!');
  };

  // Check if an item is owned
  const isItemOwned = (item: ShopItem) => {
    return item.price === 0 || item.defaultUnlocked || shopState.ownedItemIds.includes(item.id);
  };

  // Check if an item is currently equipped on the frog
  const isItemEquipped = (item: ShopItem) => {
    if (item.category === 'hats' || item.slot === 'hatId') return config.hatId === item.value;
    if (item.category === 'outfits' || item.slot === 'outfitId') return config.outfitId === item.value;
    if (item.category === 'accessories' || item.slot === 'glassesId') return config.glassesId === item.value;
    if (item.category === 'skins' || item.slot === 'skinId') return config.skinId === item.value;
    if (item.category === 'props' || item.slot === 'activityId') return config.activityId === item.value;
    if (item.category === 'companions' || item.slot === 'companionId') return config.companionId === item.value;
    if (item.category === 'scenes' || item.slot === 'sceneId') return config.sceneId === item.value;
    return false;
  };

  // Check if an item is in the current live preview
  const isItemInPreview = (item: ShopItem) => {
    if (item.category === 'hats' || item.slot === 'hatId') return previewConfig.hatId === item.value;
    if (item.category === 'outfits' || item.slot === 'outfitId') return previewConfig.outfitId === item.value;
    if (item.category === 'accessories' || item.slot === 'glassesId') return previewConfig.glassesId === item.value;
    if (item.category === 'skins' || item.slot === 'skinId') return previewConfig.skinId === item.value;
    if (item.category === 'props' || item.slot === 'activityId') return previewConfig.activityId === item.value;
    if (item.category === 'companions' || item.slot === 'companionId') return previewConfig.companionId === item.value;
    if (item.category === 'scenes' || item.slot === 'sceneId') return previewConfig.sceneId === item.value;
    return false;
  };

  // Live Try On Preview
  const handleTryOn = (item: ShopItem) => {
    if (soundEnabled) soundEngine.playTapSound();
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

  // Direct Equip
  const handleDirectEquip = (item: ShopItem) => {
    if (soundEnabled) soundEngine.playTapSound();
    if (hapticEnabled) triggerHaptic();

    handleTryOn(item);
    onEquipItem(item);
    showNotification(`Equipped ${item.name}!`);
  };

  // Buy Item & Auto Equip
  const handleBuy = (item: ShopItem) => {
    const success = onBuyItem(item);
    if (success) {
      if (soundEnabled) soundEngine.playCompleteSound();
      if (hapticEnabled) triggerHaptic();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#38BDF8'],
      });
      showNotification(`Unlocked & equipped ${item.name}!`);
      handleTryOn(item);
      onEquipItem(item);
    } else {
      if (soundEnabled) soundEngine.playTapSound();
      showNotification('Not enough Lily Coins! Complete daily entries to earn more.');
    }
  };

  // Reset Preview
  const handleResetPreview = () => {
    if (soundEnabled) soundEngine.playTapSound();
    setPreviewConfig({ ...config });
    showNotification('Fitting room preview reset.');
  };

  // Save Preview to Current Frog
  const handleSavePreview = () => {
    if (soundEnabled) soundEngine.playCompleteSound();
    if (hapticEnabled) triggerHaptic();

    onUpdateConfig({
      outfitId: previewConfig.outfitId,
      hatId: previewConfig.hatId,
      glassesId: previewConfig.glassesId,
      skinId: previewConfig.skinId,
      activityId: previewConfig.activityId,
      sceneId: previewConfig.sceneId,
      companionId: previewConfig.companionId,
      weatherId: previewConfig.weatherId,
    });

    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#75A65A', '#EAB308', '#38BDF8'],
    });
    showNotification('Frog style and habitat saved!');
  };

  // Surprise Randomize Mix from Owned items
  const handleRandomMix = () => {
    if (soundEnabled) soundEngine.playTapSound();
    if (hapticEnabled) triggerHaptic();

    const ownedHats = SHOP_CATALOG.filter((i) => (i.category === 'hats' || i.slot === 'hatId') && isItemOwned(i));
    const ownedOutfits = SHOP_CATALOG.filter((i) => (i.category === 'outfits' || i.slot === 'outfitId') && isItemOwned(i));
    const ownedGlasses = SHOP_CATALOG.filter((i) => (i.category === 'accessories' || i.slot === 'glassesId') && isItemOwned(i));
    const ownedSkins = SHOP_CATALOG.filter((i) => (i.category === 'skins' || i.slot === 'skinId') && isItemOwned(i));
    const ownedProps = SHOP_CATALOG.filter((i) => (i.category === 'props' || i.slot === 'activityId') && isItemOwned(i));
    const ownedComps = SHOP_CATALOG.filter((i) => (i.category === 'companions' || i.slot === 'companionId') && isItemOwned(i));
    const ownedScenes = SHOP_CATALOG.filter((i) => (i.category === 'scenes' || i.slot === 'sceneId') && isItemOwned(i));

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

    showNotification('Surprise mix applied in fitting room!');
  };

  // Filter Catalog Items
  const filteredItems = useMemo(() => {
    let items: ShopItem[] = [];

    if (selectedCategory === 'all') {
      items = [...SHOP_CATALOG, ...WEATHER_ITEMS];
    } else if (selectedCategory === 'weather') {
      items = WEATHER_ITEMS;
    } else {
      items = SHOP_CATALOG.filter((i) => i.category === selectedCategory);
    }

    // Filter Ownership
    if (filterOwnership === 'owned') {
      items = items.filter((i) => isItemOwned(i));
    } else if (filterOwnership === 'shop') {
      items = items.filter((i) => !isItemOwned(i));
    }

    // Filter Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (i) => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)
      );
    }

    return items;
  }, [selectedCategory, filterOwnership, searchQuery, shopState.ownedItemIds]);

  // Rarity styling badge
  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
            <Crown size={10} /> Legendary
          </span>
        );
      case 'epic':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30">
            Epic
          </span>
        );
      case 'rare':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/30">
            Rare
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/10 text-[#8c7e70] dark:text-[#a89b8d]">
            Common
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 pb-24 animate-fade-in max-w-6xl mx-auto">
      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#2d2823] dark:bg-[#f4efe8] text-[#f4efe8] dark:text-[#2d2823] text-xs font-black shadow-xl flex items-center gap-2 border border-black/10 animate-bounce">
          <Sparkles size={14} className="text-amber-400 dark:text-amber-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navigation & Wallet Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1a1714] p-4 sm:p-5 rounded-[28px] border border-[#e3dacf] dark:border-[#383028] shadow-xs">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              id="shop-back-btn"
              type="button"
              onClick={onBack}
              className="p-2 rounded-2xl bg-[#f5efe4] hover:bg-[#eae0d0] dark:bg-white/[0.08] dark:hover:bg-white/[0.14] text-[#4a4036] dark:text-[#e0d6cb] transition ios-tap shrink-0"
              title="Back to Home"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#5f7a61] dark:text-[#8fc493]" />
              <h1 className="text-xl sm:text-2xl font-black text-[#2d2823] dark:text-[#f4efe8] tracking-tight">
                Frog Wardrobe & Boutique
              </h1>
            </div>
            <p className="text-xs text-[#8c7e70] dark:text-[#a89b8d] font-medium mt-0.5">
              Mix and match pixel outfits, discover habitats, and style your frog companion!
            </p>
          </div>
        </div>

        {/* Coins Wallet & Daily Reward */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <div className="px-3.5 py-2 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center gap-2 shadow-2xs">
            <LilyCoinIcon size={22} className="animate-bounce" />
            <div>
              <p className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300 leading-none">
                Lily Coins
              </p>
              <p className="text-sm font-black text-amber-900 dark:text-amber-100 leading-tight">
                {shopState.coins}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClaimReward}
            className="px-3.5 py-2 rounded-2xl bg-[#5f7a61] hover:bg-[#4d6650] active:scale-95 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition ios-tap shrink-0"
          >
            <Gift size={15} />
            <span>Daily +50</span>
          </button>
        </div>
      </div>

      {/* Main Wardrobe Grid: Fitting Room Preview + Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT / TOP: Live Interactive Fitting Room */}
        <div className="lg:col-span-4 space-y-4">
          <div className="sticky top-4 rounded-[28px] p-4 bg-white dark:bg-[#1a1714] border border-[#e3dacf] dark:border-[#383028] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-black text-sm text-[#2d2823] dark:text-[#f4efe8]">
                  Fitting Room
                </h3>
              </div>
              {isPreviewModified ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Eye size={11} /> Previewing
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Equipped
                </span>
              )}
            </div>

            {/* Live Frog Preview Display */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#e8f2e6] to-[#d6e6d3] dark:from-[#253322] dark:to-[#1a2318] p-4 flex flex-col items-center justify-center border border-black/[0.06] dark:border-white/[0.08] min-h-[170px] overflow-hidden">
              <div className="w-32 h-32 flex items-center justify-center">
                <PixelFrogSolo config={previewConfig} size={120} />
              </div>

              {/* Current Outfit Tags */}
              <div className="mt-2 flex flex-wrap items-center justify-center gap-1 max-w-full">
                {previewConfig.outfitId && previewConfig.outfitId !== 'none' && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/85 dark:bg-black/50 text-[#2d2823] dark:text-[#f4efe8] border border-black/5 shadow-2xs flex items-center gap-1">
                    <PixelIcon name="outfits" size={12} /> {FROG_OUTFITS.find((i) => i.id === previewConfig.outfitId)?.name}
                  </span>
                )}
                {previewConfig.hatId && previewConfig.hatId !== 'none' && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/85 dark:bg-black/50 text-[#2d2823] dark:text-[#f4efe8] border border-black/5 shadow-2xs flex items-center gap-1">
                    <PixelIcon name="hats" size={12} /> {FROG_HATS.find((i) => i.id === previewConfig.hatId)?.name}
                  </span>
                )}
                {previewConfig.glassesId && previewConfig.glassesId !== 'none' && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/85 dark:bg-black/50 text-[#2d2823] dark:text-[#f4efe8] border border-black/5 shadow-2xs flex items-center gap-1">
                    <PixelIcon name="accessories" size={12} /> {FROG_GLASSES.find((i) => i.id === previewConfig.glassesId)?.name}
                  </span>
                )}
                {previewConfig.skinId && previewConfig.skinId !== 'classic' && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/85 dark:bg-black/50 text-[#2d2823] dark:text-[#f4efe8] border border-black/5 shadow-2xs flex items-center gap-1">
                    <PixelIcon name="skins" size={12} /> {FROG_SKINS.find((i) => i.id === previewConfig.skinId)?.name}
                  </span>
                )}
              </div>
            </div>

            {/* Fitting Room Actions: Shuffle, Reset, Save Look */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRandomMix}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#f5efe4] dark:bg-white/[0.08] text-[#6e6052] dark:text-[#d6cbbe] hover:bg-[#e8decb] transition flex items-center justify-center gap-1.5 ios-tap"
                  title="Random mix from owned wardrobe"
                >
                  <Shuffle size={13} className="text-[#b86f52]" />
                  <span>Surprise Mix</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetPreview}
                  disabled={!isPreviewModified}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#f5efe4] dark:bg-white/[0.08] text-[#6e6052] dark:text-[#d6cbbe] hover:bg-[#e8decb] disabled:opacity-40 disabled:pointer-events-none transition flex items-center justify-center gap-1.5 ios-tap"
                >
                  <RotateCcw size={13} />
                  <span>Reset</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleSavePreview}
                disabled={!isPreviewModified}
                className="w-full py-2.5 rounded-xl text-xs font-black bg-[#5f7a61] hover:bg-[#4d6650] active:scale-98 disabled:opacity-40 disabled:pointer-events-none text-white transition flex items-center justify-center gap-1.5 shadow-xs ios-tap"
              >
                <Check size={15} />
                <span>Save & Equip Look</span>
              </button>
            </div>

            {/* Ways to Earn Lily Coins Tip Box */}
            <div className="p-3 rounded-2xl bg-[#f8f5ee] dark:bg-[#14120f] border border-black/[0.05] dark:border-white/[0.05] space-y-1.5">
              <h4 className="text-xs font-bold text-[#4a4036] dark:text-[#e0d6cb] flex items-center gap-1.5">
                <LilyCoinIcon size={16} />
                <span>How to Earn Lily Coins</span>
              </h4>
              <ul className="text-[11px] text-[#8c7e70] dark:text-[#a89b8d] space-y-1 list-disc pl-4 font-medium">
                <li>Log daily mood entry: <b className="text-amber-600">+10 coins</b></li>
                <li>Write a journal note: <b className="text-amber-600">+15 coins</b></li>
                <li>3-Day mood streak: <b className="text-amber-600">+30 coins</b></li>
                <li>Daily Boutique Gift: <b className="text-amber-600">+50 coins</b></li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT / MAIN: Catalog Tabs & Item Grid */}
        <div className="lg:col-span-8 space-y-4">
          {/* Search Bar & Ownership Filter */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7e70]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hats, outfits, skins, habitats..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#1a1714] border border-[#e3dacf] dark:border-[#383028] text-xs font-medium text-[#2d2823] dark:text-[#f4efe8] placeholder-[#8c7e70] focus:outline-none focus:border-[#5f7a61]"
                />
              </div>

              {/* Ownership Filter Pills */}
              <div className="flex items-center gap-1 bg-white dark:bg-[#1a1714] p-1 rounded-2xl border border-[#e3dacf] dark:border-[#383028] shrink-0">
                {(['all', 'owned', 'shop'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setFilterOwnership(mode)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ios-tap ${
                      filterOwnership === mode
                        ? 'bg-[#5f7a61] text-white shadow-2xs'
                        : 'text-[#8c7e70] dark:text-[#a89b8d] hover:text-[#2d2823]'
                    }`}
                  >
                    {mode === 'shop' ? 'To Buy' : mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Horizontal Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      if (soundEnabled) soundEngine.playTapSound();
                      setSelectedCategory(cat.id);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition ios-tap ${
                      isSelected
                        ? 'bg-[#5f7a61] text-white shadow-2xs'
                        : 'bg-white dark:bg-[#1a1714] border border-black/[0.06] dark:border-white/[0.08] text-[#6e6052] dark:text-[#d6cbbe] hover:border-[#5f7a61]/50'
                    }`}
                  >
                    <PixelIcon name={cat.id} size={14} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Item Grid */}
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#1a1714] rounded-2xl border border-black/[0.06] dark:border-white/[0.08] space-y-2">
              <p className="text-sm font-bold text-[#8c7e70] dark:text-[#a89b8d]">
                No items found matching your filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setFilterOwnership('all');
                  setSearchQuery('');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-black bg-[#5f7a61] text-white"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredItems.map((item) => {
                const owned = isItemOwned(item);
                const equipped = isItemEquipped(item);
                const previewed = isItemInPreview(item);
                const canAfford = shopState.coins >= item.price;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl p-3.5 bg-white dark:bg-[#1a1714] border transition-all flex flex-col justify-between gap-3 shadow-2xs ${
                      equipped
                        ? 'border-[#5f7a61] ring-2 ring-[#5f7a61]/30 bg-[#5f7a61]/[0.03]'
                        : previewed
                        ? 'border-amber-400 ring-2 ring-amber-400/30'
                        : 'border-black/[0.06] dark:border-white/[0.08] hover:border-[#5f7a61]/40'
                    }`}
                  >
                    {/* Item Card Header */}
                    <div className="flex items-start gap-3">
                      {/* Pixel Art Icon Preview Box */}
                      <div className="w-12 h-12 rounded-xl bg-[#f8f5ee] dark:bg-[#201c18] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center shrink-0 shadow-2xs">
                        <PixelItemThumbnail
                          id={item.value}
                          category={item.category}
                          size={36}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-black text-xs text-[#2d2823] dark:text-[#f4efe8] truncate">
                            {item.name}
                          </h4>
                          {getRarityBadge(item.rarity)}
                        </div>
                        <p className="text-[11px] text-[#8c7e70] dark:text-[#a89b8d] line-clamp-2 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Price & Actions */}
                    <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between gap-2">
                      {/* Price / Status Tag */}
                      <div>
                        {item.price === 0 || item.defaultUnlocked ? (
                          <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                            Free Starter
                          </span>
                        ) : owned ? (
                          <span className="text-[11px] font-bold text-[#8c7e70] dark:text-[#a89b8d] flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-emerald-500" /> Owned
                          </span>
                        ) : (
                          <div className="flex items-center gap-1 text-xs font-black text-amber-800 dark:text-amber-300">
                            <LilyCoinIcon size={16} />
                            <span>{item.price} Coins</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        {/* Try On Button */}
                        <button
                          type="button"
                          onClick={() => handleTryOn(item)}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition ios-tap ${
                            previewed
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                              : 'bg-[#f5efe4] dark:bg-white/[0.06] text-[#6e6052] dark:text-[#d6cbbe] hover:bg-[#e8decb]'
                          }`}
                          title="Preview in fitting room"
                        >
                          {previewed ? 'Previewing' : 'Try On'}
                        </button>

                        {/* Equip or Buy Button */}
                        {owned ? (
                          <button
                            type="button"
                            onClick={() => handleDirectEquip(item)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition flex items-center gap-1 ios-tap ${
                              equipped
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-[#5f7a61] hover:bg-[#4d6650] text-white shadow-2xs'
                            }`}
                          >
                            {equipped && <PixelCheckIcon size={12} />}
                            <span>{equipped ? 'Equipped' : 'Equip'}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleBuy(item)}
                            disabled={!canAfford}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition flex items-center gap-1 ios-tap ${
                              canAfford
                                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-2xs'
                                : 'bg-black/10 dark:bg-white/10 text-[#8c7e70] cursor-not-allowed opacity-60'
                            }`}
                            title={canAfford ? `Buy for ${item.price} coins` : 'Not enough coins'}
                          >
                            {!canAfford && <Lock size={11} />}
                            <span>Buy ({item.price})</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
