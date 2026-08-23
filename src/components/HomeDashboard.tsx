import React, { useState } from 'react';
import {
  PageType,
  PixelSceneConfig,
  FrogShopState,
} from '../types';
import {
  FrogMoodRad,
  LilyCoinIcon,
  WoodGearDockIcon,
  PixelGachaMachineIcon,
  PixelWardrobeClosetIcon,
  PixelDialogueBox,
  PixelHeartPetIcon,
  PixelMatchaCupIcon,
  PixelSparkleStarIcon,
  PixelWaterDropletIcon,
  PixelSproutLeafIcon,
  PixelSakuraBlossomIcon,
  PixelCampfireLogIcon,
  PixelHeartEmoteIcon,
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

const FROG_DIALOGUES: { text: string; icon: React.ReactNode }[] = [
  { text: 'Ribbit! Welcome home~', icon: <PixelMatchaCupIcon size={14} /> },
  { text: 'So warm & cozy in here', icon: <PixelSparkleStarIcon size={14} /> },
  { text: 'Did you drink water today?', icon: <PixelWaterDropletIcon size={14} /> },
  { text: 'Let’s relax and focus together', icon: <PixelSproutLeafIcon size={14} /> },
  { text: 'Feeling peaceful today~', icon: <PixelSakuraBlossomIcon size={14} /> },
  { text: 'Croak! Loving this room', icon: <PixelCampfireLogIcon size={14} /> },
  { text: 'Take a deep breath and smile', icon: <PixelHeartEmoteIcon size={14} /> },
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
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [speechVisible, setSpeechVisible] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

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

  const toggleZoom = () => {
    if (soundEnabled) soundEngine.playTapSound();
    if (hapticEnabled) triggerHaptic();
    setIsZoomed((prev) => !prev);
  };

  // Tap background/frog to pet & interact
  const handleStageTapAffection = (screenX?: number, screenY?: number) => {
    if (soundEnabled) soundEngine.playTapSound();
    if (hapticEnabled) triggerHaptic();

    const x = screenX ?? window.innerWidth * 0.5;
    const y = screenY ?? window.innerHeight * 0.45;

    setPetCount((prev) => prev + 1);
    const offsetX = (Math.random() - 0.5) * 28;
    const offsetY = (Math.random() - 0.5) * 16;
    const newHeart = { id: Date.now() + Math.random(), x: x + offsetX, y: y + offsetY };
    setHeartsFloat((prev) => [...prev, newHeart]);

    // Next speech bubble
    setDialogueIndex((prev) => (prev + 1) % FROG_DIALOGUES.length);
    setSpeechVisible(true);

    setTimeout(() => {
      setHeartsFloat((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1250);

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

  const handleStageTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleStageTapAffection(e.clientX - rect.left, e.clientY - rect.top);
  };

  const ticketsCount = shopState.gachaTickets || 0;

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
        isZoomed={isZoomed}
        onToggleZoom={toggleZoom}
        onTapStage={handleStageTapAffection}
      />

      {/* Floating Pet Hearts Particles (8-Bit Pixel Red, No Shadow, Cozy Minimal) */}
      {heartsFloat.map((heart) => (
        <div
          key={heart.id}
          style={{ left: `${heart.x}px`, top: `${heart.y}px` }}
          className="absolute z-50 pointer-events-none animate-pixel-heart select-none"
        >
          <PixelHeartPetIcon size={24} />
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
        <div className="flex items-center gap-2.5">
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
            text={FROG_DIALOGUES[dialogueIndex].text}
            icon={FROG_DIALOGUES[dialogueIndex].icon}
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

      {/* 4. PURE PIXEL ART FLOATING ACTIONS */}
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
              {ticketsCount > 0 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-md bg-amber-400 text-amber-950 text-[8px] font-black uppercase tracking-wider animate-bounce shadow-md border border-amber-300 z-10 whitespace-nowrap">
                  🎟️ {ticketsCount}
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
        </div>
      </div>
    </div>
  );
};
