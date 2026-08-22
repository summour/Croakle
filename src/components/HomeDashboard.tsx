import React, { useState } from 'react';
import {
  PageType,
  PixelSceneConfig,
  FrogShopState,
  SCENE_LOCATIONS,
  FROG_ACTIVITIES,
  FROG_HATS,
  FROG_COMPANIONS,
  FROG_WEATHERS,
} from '../types';
import {
  FrogMoodRad,
  LilyCoinIcon,
  WoodGearDockIcon,
  PixelGachaMachineIcon,
  PixelWardrobeClosetIcon,
  PixelMagicMixIcon,
  PixelHeartPetIcon,
  PixelSnackDangoIcon,
  PixelFurinChimeIcon,
  PixelDialogueBox,
} from './FrogIcons';
import { PixelFrogScene } from './PixelFrogScene';
import {
  Sun,
  Coffee,
  Sparkles,
  Moon,
  Plus,
  Volume2,
  VolumeX,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine, triggerHaptic } from '../utils/audioUtils';

interface HomeDashboardProps {
  onNavigate: (page: PageType) => void;
  pixelScene: PixelSceneConfig;
  onUpdatePixelScene: (patch: Partial<PixelSceneConfig>) => void;
  shopState: FrogShopState;
  onEarnCoins: (amount: number, reason: string) => void;
  todayDate?: Date;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
  onGachaPullResults?: (results: any[]) => void;
  onToggleWishlist?: (itemId: string) => void;
}

const FROG_DIALOGUES = [
  'Ribbit! Welcome home~ 🍵',
  'So warm & cozy in here ✨',
  'Did you drink water today? 💧',
  'Let’s relax and focus together 🌿',
  'Feeling peaceful today~ 🌸',
  'Croak! Loving this room 🪵',
  'Take a deep breath and smile 💚',
];

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  pixelScene,
  onUpdatePixelScene,
  shopState,
  onEarnCoins,
  todayDate = new Date(),
  soundEnabled = true,
  hapticEnabled = true,
}) => {
  const [petCount, setPetCount] = useState(0);
  const [heartsFloat, setHeartsFloat] = useState<{ id: number; x: number; y: number }[]>([]);
  const [treatFedRecently, setTreatFedRecently] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [speechVisible, setSpeechVisible] = useState(true);

  // Time greeting
  const hours = todayDate.getHours();
  let timeGreeting = 'Good morning';
  let GreetingIcon = Sun;
  if (hours >= 12 && hours < 17) {
    timeGreeting = 'Good afternoon';
    GreetingIcon = Coffee;
  } else if (hours >= 17 && hours < 21) {
    timeGreeting = 'Peaceful evening';
    GreetingIcon = Sparkles;
  } else if (hours >= 21 || hours < 5) {
    timeGreeting = 'Restful night';
    GreetingIcon = Moon;
  }

  // Tap background/frog to pet & interact
  const handleStageTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;

    if (soundEnabled) soundEngine.playTapSound();
    if (hapticEnabled) triggerHaptic();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPetCount((prev) => prev + 1);
    const newHeart = { id: Date.now(), x, y };
    setHeartsFloat((prev) => [...prev, newHeart]);

    // Next speech bubble
    setDialogueIndex((prev) => (prev + 1) % FROG_DIALOGUES.length);
    setSpeechVisible(true);

    setTimeout(() => {
      setHeartsFloat((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1400);

    if ((petCount + 1) % 5 === 0) {
      onEarnCoins(15, 'Affection bonus');
      confetti({
        particleCount: 24,
        spread: 55,
        origin: { y: 0.45 },
        colors: ['#f43f5e', '#ec4899', '#5f7a61', '#facc15'],
      });
    }
  };

  const handlePetBtnClick = () => {
    if (soundEnabled) soundEngine.playTapSound();
    if (hapticEnabled) triggerHaptic();

    setPetCount((prev) => prev + 1);
    const newHeart = {
      id: Date.now(),
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.42,
    };
    setHeartsFloat((prev) => [...prev, newHeart]);
    setDialogueIndex((prev) => (prev + 1) % FROG_DIALOGUES.length);

    setTimeout(() => {
      setHeartsFloat((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1400);

    if ((petCount + 1) % 5 === 0) {
      onEarnCoins(15, 'Affection bonus');
      confetti({
        particleCount: 20,
        spread: 45,
        origin: { y: 0.42 },
        colors: ['#f43f5e', '#ec4899', '#5f7a61', '#facc15'],
      });
    }
  };

  // Feed treat
  const handleFeedTreat = () => {
    if (treatFedRecently) return;
    if (soundEnabled) soundEngine.playCompleteSound();
    if (hapticEnabled) triggerHaptic();

    setTreatFedRecently(true);
    onEarnCoins(10, 'Fed snack');

    confetti({
      particleCount: 20,
      spread: 45,
      origin: { y: 0.42 },
      colors: ['#5f7a61', '#d4af37', '#b86f52'],
    });

    setTimeout(() => {
      setTreatFedRecently(false);
    }, 12000);
  };

  // Play chime
  const handlePlayMusic = () => {
    if (soundEnabled) soundEngine.playTapSound();
    if (hapticEnabled) triggerHaptic();
    confetti({
      particleCount: 16,
      spread: 40,
      origin: { y: 0.42 },
      colors: ['#a855f7', '#ec4899', '#38bdf8'],
    });
  };

  // Surprise mix look
  const handleSurpriseMix = () => {
    if (soundEnabled) soundEngine.playTapSound();
    if (hapticEnabled) triggerHaptic();

    const randomScene = SCENE_LOCATIONS[Math.floor(Math.random() * SCENE_LOCATIONS.length)].id;
    const randomActivity = FROG_ACTIVITIES[Math.floor(Math.random() * FROG_ACTIVITIES.length)].id;
    const randomHat = FROG_HATS[Math.floor(Math.random() * FROG_HATS.length)].id;
    const randomCompanion = FROG_COMPANIONS[Math.floor(Math.random() * FROG_COMPANIONS.length)].id;
    const randomWeather = FROG_WEATHERS[Math.floor(Math.random() * FROG_WEATHERS.length)].id;

    onUpdatePixelScene({
      sceneId: randomScene,
      activityId: randomActivity,
      hatId: randomHat,
      companionId: randomCompanion,
      weatherId: randomWeather,
    });
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const isDailyFreeAvailable = shopState.lastFreeGachaDate !== todayStr;

  return (
    <div
      id="pokecolo-home-stage"
      onClick={handleStageTap}
      className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none px-4 pt-3.5 pb-24 cursor-pointer"
    >
      {/* 1. FULLSCREEN 3D POKECOLO ROOM HABITAT BACKGROUND */}
      <PixelFrogScene
        config={pixelScene}
        onUpdateConfig={onUpdatePixelScene}
        soundEnabled={soundEnabled}
        hapticEnabled={hapticEnabled}
        fullscreen={true}
      />

      {/* Floating Pet Hearts Particles */}
      {heartsFloat.map((heart) => (
        <div
          key={heart.id}
          style={{ left: `${heart.x}px`, top: `${heart.y}px` }}
          className="absolute z-50 -translate-x-1/2 -translate-y-1/2 text-rose-500 animate-bounce pointer-events-none text-2xl font-black drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
        >
          ♥
        </div>
      ))}

      {/* 2. TOP FLOATING PIXEL HUD (NO CLUNKY BOXES) */}
      <header className="relative z-20 w-full flex items-center justify-between pointer-events-auto px-1">
        {/* Left Profile: Pixel Frog Face + Pixel Name/Greeting */}
        <div className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 flex items-center justify-center filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] active:scale-95 transition-transform">
            <FrogMoodRad size={28} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-[10.5px] font-black text-amber-200 dark:text-amber-300 drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)]">
              <GreetingIcon size={11} className="text-amber-300 dark:text-amber-200" />
              <span>{timeGreeting}</span>
            </div>
            <h1 className="text-sm font-black tracking-wide text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)] leading-tight">
              Croakle
            </h1>
          </div>
        </div>

        {/* Right Action: Pixel Coin Counter & Pixel Settings */}
        <div className="flex items-center gap-3">
          <button
            id="home-coins-btn"
            type="button"
            onClick={() => onNavigate('coins')}
            className="group flex items-center gap-1.5 active:scale-90 hover:scale-105 transition-all ios-tap cursor-pointer"
            title="Coins Store"
          >
            <LilyCoinIcon size={20} className="filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform" />
            <span className="text-sm font-black text-amber-300 drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)] tracking-wider">
              {shopState.coins.toLocaleString()}
            </span>
            <span className="w-4 h-4 bg-amber-400 hover:bg-amber-300 text-amber-950 text-[10px] font-black flex items-center justify-center rounded-xs shadow-[0_1.5px_0_#92400e] border border-amber-300 leading-none">
              +
            </span>
          </button>

          <button
            id="home-settings-btn"
            type="button"
            onClick={() => onNavigate('settings')}
            className="text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)] active:scale-90 hover:scale-110 transition-transform duration-150 ios-tap"
            title="Settings"
          >
            <WoodGearDockIcon size={22} />
          </button>
        </div>
      </header>

      {/* 3. CENTER RETRO PIXEL SPEECH BUBBLE (Unobstructed in Upper-Middle) */}
      <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none mt-4">
        {speechVisible && (
          <PixelDialogueBox
            text={FROG_DIALOGUES[dialogueIndex]}
            onClick={(e) => {
              e.stopPropagation();
              setDialogueIndex((prev) => (prev + 1) % FROG_DIALOGUES.length);
              if (soundEnabled) soundEngine.playTapSound();
            }}
            className="pointer-events-auto animate-fade-in"
          />
        )}
      </div>

      {/* Spacer pushing controls down without blocking midground floor */}
      <div className="flex-1 w-full" />

      {/* 4. PURE PIXEL ART FLOATING ACTIONS (NO CLUNKY BOXES) */}
      <div className="relative z-20 w-full space-y-3.5 pb-2 pointer-events-auto">
        {/* Top Row: Gacha Capsule, Wardrobe Closet, Magic Mix */}
        <div className="flex items-end justify-between px-2">
          {/* Left: Gacha Machine & Wardrobe Closet */}
          <div className="flex items-center gap-4">
            {/* Theme Gacha Capsule Button */}
            <button
              id="home-floating-gacha-btn"
              type="button"
              onClick={() => {
                if (soundEnabled) soundEngine.playTapSound();
                if (hapticEnabled) triggerHaptic();
                onNavigate('shop');
              }}
              className="group relative flex flex-col items-center gap-0.5 active:scale-90 hover:scale-110 transition-transform duration-150 ios-tap"
              title="Gacha Summon"
            >
              {isDailyFreeAvailable && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-md bg-amber-400 text-amber-950 text-[8px] font-black uppercase tracking-wider animate-bounce shadow-md border border-amber-300 z-10">
                  FREE
                </span>
              )}
              <PixelGachaMachineIcon size={42} className="group-hover:-translate-y-1 transition-transform" />
              <span className="text-[10px] font-black text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)] tracking-wide">
                Gacha
              </span>
            </button>

            {/* Wardrobe Customization Button */}
            <button
              id="home-floating-wardrobe-btn"
              type="button"
              onClick={() => {
                if (soundEnabled) soundEngine.playTapSound();
                if (hapticEnabled) triggerHaptic();
                onNavigate('dressup');
              }}
              className="group flex flex-col items-center gap-0.5 active:scale-90 hover:scale-110 transition-transform duration-150 ios-tap"
              title="Wardrobe Dress-Up"
            >
              <PixelWardrobeClosetIcon size={40} className="group-hover:-translate-y-1 transition-transform" />
              <span className="text-[10px] font-black text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)] tracking-wide">
                Custom
              </span>
            </button>
          </div>

          {/* Right: Magic Surprise Mix */}
          <button
            id="home-floating-mix-btn"
            type="button"
            onClick={handleSurpriseMix}
            title="Surprise Mix Outfit"
            className="group flex flex-col items-center gap-0.5 active:scale-90 hover:scale-110 transition-transform duration-150 ios-tap"
          >
            <PixelMagicMixIcon size={40} className="group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-black text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)] tracking-wide">
              Mix
            </span>
          </button>
        </div>

        {/* Bottom Row: Pure Pixel Interactive Items (Pet, Snack, Chime - No Container Boxes) */}
        <div className="flex items-center justify-around px-4">
          {/* Pet Heart Interaction */}
          <button
            id="home-interactive-pet-btn"
            type="button"
            onClick={handlePetBtnClick}
            className="group flex flex-col items-center gap-0.5 active:scale-85 hover:scale-110 transition-transform duration-150 ios-tap"
            title="Pet Frog"
          >
            <PixelHeartPetIcon size={30} className="group-hover:scale-115 transition-transform" />
            <span className="text-[10px] font-black text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)]">
              Pet
            </span>
          </button>

          {/* Feed Snack Dango Interaction */}
          <button
            id="home-interactive-snack-btn"
            type="button"
            onClick={handleFeedTreat}
            disabled={treatFedRecently}
            className={`group flex flex-col items-center gap-0.5 transition-all duration-150 ios-tap ${
              treatFedRecently
                ? 'opacity-40 grayscale cursor-not-allowed'
                : 'active:scale-85 hover:scale-110'
            }`}
            title="Feed Treat"
          >
            <PixelSnackDangoIcon size={30} className="group-hover:scale-115 transition-transform" />
            <span className="text-[10px] font-black text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)]">
              {treatFedRecently ? 'Full' : 'Snack'}
            </span>
          </button>

          {/* Wind Chime / Furin Bell Music Interaction */}
          <button
            id="home-interactive-chime-btn"
            type="button"
            onClick={handlePlayMusic}
            className="group flex flex-col items-center gap-0.5 active:scale-85 hover:scale-110 transition-transform duration-150 ios-tap"
            title="Ring Wind Chime"
          >
            <PixelFurinChimeIcon size={30} className="group-hover:scale-115 transition-transform" />
            <span className="text-[10px] font-black text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)]">
              Chime
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
