import React, { useState, useEffect } from 'react';
import {
  PixelSceneConfig,
  SceneLocationId,
  FrogActivityId,
  FrogHatId,
  FrogCompanionId,
  FrogWeatherId,
  SCENE_LOCATIONS,
  FROG_ACTIVITIES,
  FROG_HATS,
  FROG_COMPANIONS,
  FROG_WEATHERS,
} from '../types';
import {
  Sparkles,
  Sliders,
  Shuffle,
  X,
  Sun,
  Moon,
  CloudRain,
  Heart,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine, triggerHaptic } from '../utils/audioUtils';
import {
  PixelOptionIcon,
  PixelTabSceneIcon,
  PixelTabActivityIcon,
  PixelTabHeadwearIcon,
  PixelTabCompanionIcon,
  PixelTabWeatherIcon,
  PixelCheckIcon,
} from './FrogIcons';

interface PixelFrogSceneProps {
  config: PixelSceneConfig;
  onUpdateConfig: (patch: Partial<PixelSceneConfig>) => void;
  currentMoodValue?: number | null;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
  className?: string;
  showCustomizerButton?: boolean;
}

export const PixelFrogScene: React.FC<PixelFrogSceneProps> = ({
  config,
  onUpdateConfig,
  currentMoodValue,
  soundEnabled = true,
  hapticEnabled = true,
  className = '',
  showCustomizerButton = true,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCustomizerTab, setActiveCustomizerTab] = useState<
    'scene' | 'activity' | 'hat' | 'companion' | 'weather'
  >('scene');

  // Animation frame ticker for pixel effects
  const [animTick, setAnimTick] = useState(0);

  useEffect(() => {
    if (!config.isAnimated) return;
    const timer = setInterval(() => {
      setAnimTick((prev) => (prev + 1) % 60);
    }, 350);
    return () => clearInterval(timer);
  }, [config.isAnimated]);

  // Determine effective weather
  const getEffectiveWeather = (): FrogWeatherId => {
    if (config.weatherId !== 'auto') {
      return config.weatherId;
    }
    const hour = new Date().getHours();
    if (currentMoodValue === 1) return 'rainy';
    if (currentMoodValue === 4) return 'petals';
    if (hour >= 20 || hour < 5) return 'starry';
    if (hour >= 17 && hour < 20) return 'golden';
    return 'sunny';
  };

  const effectiveWeather = getEffectiveWeather();

  // Randomize full setup with joyful sound & confetti
  const handleRandomize = () => {
    if (soundEnabled) soundEngine.playTapSound();
    if (hapticEnabled) triggerHaptic();

    const randomScene = SCENE_LOCATIONS[Math.floor(Math.random() * SCENE_LOCATIONS.length)].id;
    const randomActivity = FROG_ACTIVITIES[Math.floor(Math.random() * FROG_ACTIVITIES.length)].id;
    const randomHat = FROG_HATS[Math.floor(Math.random() * FROG_HATS.length)].id;
    const randomCompanion = FROG_COMPANIONS[Math.floor(Math.random() * FROG_COMPANIONS.length)].id;
    const randomWeather = FROG_WEATHERS[Math.floor(Math.random() * FROG_WEATHERS.length)].id;

    onUpdateConfig({
      sceneId: randomScene,
      activityId: randomActivity,
      hatId: randomHat,
      companionId: randomCompanion,
      weatherId: randomWeather,
    });

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#75A65A', '#EAB308', '#EC4899', '#38BDF8', '#D98236'],
    });
  };

  // -------------------------------------------------------------
  // PIXEL ART RENDERERS (Crisp SVG 160x100 Grid)
  // -------------------------------------------------------------

  // Sky & Lighting colors based on weather
  const getSkyGradient = () => {
    switch (effectiveWeather) {
      case 'starry':
        return {
          top: '#0F172A',
          bottom: '#1E293B',
          ambient: 'rgba(15, 23, 42, 0.35)',
        };
      case 'golden':
        return {
          top: '#7C2D12',
          mid: '#C2410C',
          bottom: '#FDBA74',
          ambient: 'rgba(251, 146, 60, 0.15)',
        };
      case 'rainy':
        return {
          top: '#334155',
          bottom: '#64748B',
          ambient: 'rgba(51, 65, 85, 0.25)',
        };
      case 'petals':
        return {
          top: '#FCE7F3',
          bottom: '#FBCFE8',
          ambient: 'rgba(244, 114, 182, 0.12)',
        };
      case 'sunny':
      default:
        return {
          top: '#7DD3FC',
          bottom: '#BAE6FD',
          ambient: 'rgba(125, 211, 252, 0.1)',
        };
    }
  };

  const sky = getSkyGradient();

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Diorama Display Card */}
      <div className="relative rounded-[26px] overflow-hidden border border-black/[0.08] dark:border-white/[0.12] bg-[#f8f5ee] dark:bg-[#191613] shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
        {/* Main Pixel Canvas (160x100 viewBox) */}
        <div className="relative w-full aspect-[16/10] max-h-[300px] select-none overflow-hidden bg-black">
          <svg
            viewBox="0 0 160 100"
            className="w-full h-full object-cover"
            shapeRendering="crispEdges"
          >
            <defs>
              <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sky.top} />
                <stop offset="100%" stopColor={sky.bottom} />
              </linearGradient>
            </defs>

            {/* 1. SKY BACKGROUND */}
            <rect x="0" y="0" width="160" height="100" fill="url(#skyGradient)" />

            {/* Weather Elements: Sun, Moon, Clouds, Stars */}
            {effectiveWeather === 'sunny' && (
              <g>
                <rect x="130" y="10" width="16" height="16" fill="#FDE047" />
                <rect x="132" y="8" width="12" height="2" fill="#FACC15" />
                <rect x="132" y="26" width="12" height="2" fill="#FACC15" />
                <rect x="128" y="12" width="2" height="12" fill="#FACC15" />
                <rect x="146" y="12" width="2" height="12" fill="#FACC15" />
                <rect x="134" y="12" width="8" height="8" fill="#FEF08A" />
                {/* Fluffy Pixel Cloud */}
                <rect x="16" y="18" width="30" height="8" fill="#FFFFFF" opacity="0.9" />
                <rect x="22" y="14" width="18" height="4" fill="#FFFFFF" opacity="0.9" />
              </g>
            )}

            {effectiveWeather === 'golden' && (
              <g>
                <rect x="70" y="22" width="20" height="18" fill="#FB923C" />
                <rect x="74" y="18" width="12" height="4" fill="#FDE047" />
                <rect x="72" y="22" width="16" height="10" fill="#FEF08A" />
                {/* Warm Sunset Horizon Clouds */}
                <rect x="0" y="38" width="160" height="6" fill="#EA580C" opacity="0.6" />
                <rect x="20" y="32" width="45" height="4" fill="#F97316" opacity="0.7" />
                <rect x="95" y="28" width="50" height="4" fill="#F97316" opacity="0.7" />
              </g>
            )}

            {effectiveWeather === 'starry' && (
              <g>
                {/* Crescent Golden Moon */}
                <rect x="132" y="10" width="12" height="12" fill="#FEF08A" />
                <rect x="136" y="8" width="8" height="2" fill="#FEF08A" />
                <rect x="136" y="22" width="8" height="2" fill="#FEF08A" />
                <rect x="128" y="10" width="8" height="12" fill={sky.top} />
                {/* Twinkling Pixel Stars */}
                <rect x="14" y="12" width="2" height="2" fill="#FFFFFF" />
                <rect x="42" y="8" width="1" height="1" fill="#FEF08A" />
                <rect x="75" y="16" width="2" height="2" fill="#FFFFFF" />
                <rect x="105" y="10" width="1" height="1" fill="#FEF08A" />
                <rect x="28" y="28" width="2" height="2" fill="#FFFFFF" />
                <rect x="118" y="24" width="1" height="1" fill="#FFFFFF" />
                <rect x="58" y="22" width="1" height="1" fill="#FEF08A" />
              </g>
            )}

            {/* 2. SCENE LOCATION BACKGROUND LAYERS */}

            {/* A. ZEN LOTUS POND SCENE */}
            {config.sceneId === 'zen_pond' && (
              <g>
                {/* Distant Hills */}
                <rect x="0" y="44" width="160" height="20" fill="#2E4A28" />
                <rect x="10" y="38" width="60" height="8" fill="#3D5F34" />
                <rect x="90" y="36" width="70" height="10" fill="#3D5F34" />

                {/* Stone Lantern on Left Bank */}
                <rect x="16" y="38" width="8" height="2" fill="#52525B" />
                <rect x="18" y="40" width="4" height="6" fill="#71717A" />
                <rect x="19" y="42" width="2" height="2" fill="#FEF08A" />
                <rect x="15" y="46" width="10" height="2" fill="#3F3F46" />
                <rect x="18" y="48" width="4" height="10" fill="#71717A" />
                <rect x="16" y="58" width="8" height="4" fill="#3F3F46" />

                {/* Bamboo Reeds */}
                <rect x="138" y="30" width="2" height="30" fill="#4D7C36" />
                <rect x="144" y="34" width="2" height="26" fill="#5F9744" />
                <rect x="150" y="28" width="2" height="32" fill="#3E652B" />
                <rect x="135" y="36" width="6" height="2" fill="#5F9744" />
                <rect x="146" y="40" width="6" height="2" fill="#5F9744" />

                {/* River Grass Banks */}
                <rect x="0" y="54" width="45" height="46" fill="#4B6E38" />
                <rect x="120" y="52" width="40" height="48" fill="#4B6E38" />
                <rect x="35" y="60" width="15" height="40" fill="#3A562A" />
                <rect x="110" y="58" width="15" height="42" fill="#3A562A" />

                {/* Pond Water Basin */}
                <rect x="25" y="62" width="110" height="38" fill="#0284C7" />
                <rect x="30" y="66" width="100" height="34" fill="#0369A1" />
                <rect x="40" y="74" width="80" height="26" fill="#075985" />

                {/* Water Shimmer Waves */}
                <rect x="45" y={(animTick % 2 === 0 ? 68 : 69)} width="16" height="1" fill="#7DD3FC" opacity="0.8" />
                <rect x="95" y={(animTick % 2 === 0 ? 76 : 75)} width="18" height="1" fill="#7DD3FC" opacity="0.8" />
                <rect x="65" y={(animTick % 2 === 0 ? 84 : 85)} width="24" height="1" fill="#BAE6FD" opacity="0.7" />

                {/* Floating Lily Pads */}
                <rect x="34" y="72" width="18" height="6" fill="#65A30D" />
                <rect x="38" y="70" width="10" height="2" fill="#4D7C0F" />
                <rect x="44" y="72" width="2" height="6" fill="#0369A1" /> {/* Notch */}
                
                <rect x="108" y="70" width="18" height="6" fill="#65A30D" />
                <rect x="112" y="68" width="10" height="2" fill="#4D7C0F" />
                {/* Blooming Pink Lotus */}
                <rect x="115" y="64" width="6" height="4" fill="#F472B6" />
                <rect x="117" y="62" width="2" height="2" fill="#FDF2F8" />

                {/* Big Central Island Lily Pad (Frog's Stage) */}
                <rect x="62" y="70" width="36" height="14" fill="#4D7C0F" />
                <rect x="64" y="68" width="32" height="16" fill="#65A30D" />
                <rect x="68" y="66" width="24" height="18" fill="#84CC16" />
                <rect x="74" y="68" width="12" height="14" fill="#A3E635" />
              </g>
            )}

            {/* B. COZY TREEHOUSE SCENE */}
            {config.sceneId === 'treehouse' && (
              <g>
                {/* Wooden Plank Wall */}
                <rect x="0" y="0" width="160" height="70" fill="#784A28" />
                <rect x="0" y="16" width="160" height="2" fill="#523218" />
                <rect x="0" y="34" width="160" height="2" fill="#523218" />
                <rect x="0" y="52" width="160" height="2" fill="#523218" />

                {/* Treehouse Window Looking Outside */}
                <rect x="102" y="10" width="46" height="36" fill="#382110" />
                <rect x="104" y="12" width="42" height="32" fill="#60A5FA" />
                <rect x="104" y="28" width="42" height="16" fill="#4B6E38" /> {/* Tree canopy view */}
                <rect x="124" y="12" width="2" height="32" fill="#382110" />
                <rect x="104" y="26" width="42" height="2" fill="#382110" />

                {/* Bookshelf with Colorful Books */}
                <rect x="12" y="14" width="34" height="42" fill="#523218" />
                <rect x="14" y="16" width="30" height="10" fill="#382110" />
                <rect x="14" y="28" width="30" height="10" fill="#382110" />
                <rect x="14" y="40" width="30" height="14" fill="#382110" />
                {/* Books on shelf */}
                <rect x="16" y="18" width="4" height="8" fill="#DC2626" />
                <rect x="21" y="19" width="3" height="7" fill="#2563EB" />
                <rect x="25" y="17" width="5" height="9" fill="#16A34A" />
                <rect x="31" y="20" width="4" height="6" fill="#EAB308" />
                <rect x="36" y="18" width="5" height="8" fill="#9333EA" />

                <rect x="16" y="30" width="6" height="8" fill="#EA580C" />
                <rect x="23" y="32" width="4" height="6" fill="#0891B2" />
                <rect x="28" y="29" width="6" height="9" fill="#CA8A04" />
                <rect x="35" y="31" width="7" height="7" fill="#4F46E5" />

                {/* Cozy Stone Fireplace on Left */}
                <rect x="10" y="56" width="38" height="32" fill="#4B5563" />
                <rect x="16" y="64" width="26" height="22" fill="#1F2937" />
                {/* Animated Fire Flame */}
                <rect x="22" y={(animTick % 2 === 0 ? 70 : 72)} width="14" height="12" fill="#EA580C" />
                <rect x="25" y={(animTick % 2 === 0 ? 68 : 69)} width="8" height="10" fill="#FACC15" />
                <rect x="27" y={(animTick % 2 === 0 ? 66 : 67)} width="4" height="6" fill="#FEF08A" />

                {/* Polished Hardwood Floor */}
                <rect x="0" y="70" width="160" height="30" fill="#A16207" />
                <rect x="0" y="78" width="160" height="2" fill="#713F12" />
                <rect x="0" y="88" width="160" height="2" fill="#713F12" />
                <rect x="0" y="96" width="160" height="2" fill="#713F12" />

                {/* Woven Round Rug (Frog Stage) */}
                <rect x="58" y="72" width="46" height="20" fill="#D97706" />
                <rect x="62" y="74" width="38" height="16" fill="#FDE68A" />
                <rect x="66" y="76" width="30" height="12" fill="#F59E0B" />
              </g>
            )}

            {/* C. SAKURA BLOSSOM SHRINE SCENE */}
            {config.sceneId === 'sakura_shrine' && (
              <g>
                {/* Mount Fuji Silhouette */}
                <polygon points="50,48 80,24 110,48" fill="#475569" />
                <polygon points="72,30 80,24 88,30" fill="#F8FAFC" /> {/* Snowcap */}

                {/* Distant Cherry Blossom Trees */}
                <rect x="0" y="36" width="50" height="20" fill="#F472B6" />
                <rect x="110" y="34" width="50" height="22" fill="#F472B6" />
                <rect x="5" y="32" width="40" height="10" fill="#FBCFE8" />
                <rect x="115" y="30" width="40" height="10" fill="#FBCFE8" />

                {/* Shrine Stone Steps & Ground */}
                <rect x="0" y="56" width="160" height="44" fill="#4D7C36" />
                <rect x="52" y="56" width="56" height="44" fill="#94A3B8" />
                <rect x="56" y="56" width="48" height="44" fill="#CBD5E1" />
                <rect x="60" y="60" width="40" height="4" fill="#64748B" />
                <rect x="60" y="72" width="40" height="4" fill="#64748B" />
                <rect x="60" y="84" width="40" height="4" fill="#64748B" />

                {/* Vermillion Red Torii Gate */}
                <rect x="42" y="24" width="76" height="6" fill="#DC2626" />
                <rect x="40" y="22" width="80" height="3" fill="#18181B" /> {/* Black roof top */}
                <rect x="48" y="34" width="64" height="4" fill="#DC2626" />
                {/* Torii Pillars */}
                <rect x="50" y="24" width="8" height="44" fill="#DC2626" />
                <rect x="102" y="24" width="8" height="44" fill="#DC2626" />
                <rect x="49" y="64" width="10" height="4" fill="#18181B" />
                <rect x="101" y="64" width="10" height="4" fill="#18181B" />

                {/* Stone Lanterns */}
                <rect x="28" y="52" width="8" height="18" fill="#64748B" />
                <rect x="30" y="56" width="4" height="4" fill="#FEF08A" />
                <rect x="124" y="52" width="8" height="18" fill="#64748B" />
                <rect x="126" y="56" width="4" height="4" fill="#FEF08A" />
              </g>
            )}

            {/* D. RAINY MUSHROOM MEADOW SCENE */}
            {config.sceneId === 'rainy_meadow' && (
              <g>
                {/* Deep Forest Background Trees */}
                <rect x="0" y="28" width="160" height="30" fill="#14532D" />
                <rect x="10" y="22" width="28" height="16" fill="#166534" />
                <rect x="60" y="20" width="34" height="18" fill="#166534" />
                <rect x="120" y="24" width="30" height="16" fill="#166534" />

                {/* Meadow Ground */}
                <rect x="0" y="50" width="160" height="50" fill="#15803D" />
                <rect x="0" y="60" width="160" height="40" fill="#166534" />

                {/* Giant Red Polka-Dot Mushroom on Left */}
                <rect x="18" y="44" width="8" height="26" fill="#F5F5F4" />
                <rect x="6" y="32" width="32" height="16" fill="#DC2626" />
                <rect x="10" y="28" width="24" height="8" fill="#B91C1C" />
                <rect x="10" y="34" width="4" height="4" fill="#FFFFFF" />
                <rect x="22" y="32" width="6" height="5" fill="#FFFFFF" />
                <rect x="16" y="40" width="4" height="4" fill="#FFFFFF" />
                <rect x="28" y="38" width="4" height="4" fill="#FFFFFF" />

                {/* Small Mushrooms on Right */}
                <rect x="128" y="54" width="4" height="14" fill="#F5F5F4" />
                <rect x="122" y="48" width="16" height="8" fill="#EA580C" />
                <rect x="126" y="50" width="3" height="3" fill="#FFFFFF" />

                <rect x="140" y="60" width="4" height="12" fill="#F5F5F4" />
                <rect x="136" y="54" width="12" height="8" fill="#FACC15" />

                {/* Mossy Log / Stone Frog Stage */}
                <rect x="56" y="66" width="48" height="18" fill="#523218" />
                <rect x="58" y="64" width="44" height="6" fill="#65A30D" /> {/* Moss top */}
                <rect x="62" y="62" width="36" height="4" fill="#84CC16" />
              </g>
            )}

            {/* E. MOUNTAIN HOT SPRING (ONSEN) */}
            {config.sceneId === 'onsen' && (
              <g>
                {/* Pine Mountains & Mist */}
                <polygon points="10,50 45,26 80,50" fill="#334155" />
                <polygon points="75,50 110,22 145,50" fill="#334155" />
                <rect x="0" y="44" width="160" height="8" fill="#CBD5E1" opacity="0.6" />

                {/* Bamboo Water Spout */}
                <rect x="20" y="48" width="6" height="24" fill="#65A30D" />
                <rect x="20" y="54" width="22" height="4" fill="#84CC16" />
                <rect x="38" y="58" width="2" height="18" fill="#38BDF8" /> {/* Stream */}

                {/* Volcanic Rock Onsen Wall */}
                <rect x="0" y="58" width="160" height="42" fill="#3F3F46" />
                <rect x="10" y="54" width="140" height="6" fill="#52525B" />

                {/* Steaming Thermal Turquoise Water Basin */}
                <rect x="16" y="62" width="128" height="34" fill="#06B6D4" />
                <rect x="20" y="66" width="120" height="28" fill="#0891B2" />

                {/* Steam Clouds Rising */}
                <rect x="40" y={(animTick % 2 === 0 ? 50 : 48)} width="18" height="4" fill="#FFFFFF" opacity="0.5" />
                <rect x="85" y={(animTick % 2 === 0 ? 46 : 44)} width="24" height="5" fill="#FFFFFF" opacity="0.5" />
                <rect x="115" y={(animTick % 2 === 0 ? 52 : 50)} width="16" height="4" fill="#FFFFFF" opacity="0.5" />

                {/* Onsen Bath Wooden Bucket */}
                <rect x="124" y="60" width="14" height="10" fill="#D97706" />
                <rect x="128" y="56" width="6" height="4" fill="#FFFFFF" /> {/* Wash towel */}

                {/* Onsen Flat Warm Rock (Frog Stage) */}
                <rect x="60" y="66" width="40" height="18" fill="#71717A" />
                <rect x="64" y="64" width="32" height="4" fill="#A1A1AA" />
              </g>
            )}

            {/* F. STARRY CAMPFIRE HAVEN */}
            {config.sceneId === 'night_camp' && (
              <g>
                {/* Distant Pine Trees in Moonlight */}
                <polygon points="0,52 14,28 28,52" fill="#0F172A" />
                <polygon points="20,54 36,32 52,54" fill="#0F172A" />
                <polygon points="110,54 126,30 142,54" fill="#0F172A" />
                <polygon points="130,52 145,34 160,52" fill="#0F172A" />

                {/* Forest Ground */}
                <rect x="0" y="52" width="160" height="48" fill="#1E293B" />
                <rect x="0" y="62" width="160" height="38" fill="#0F172A" />

                {/* Cozy Canvas A-Frame Tent on Right */}
                <polygon points="106,80 130,42 154,80" fill="#0284C7" />
                <polygon points="120,80 130,54 140,80" fill="#0F172A" /> {/* Tent door */}
                <polygon points="106,80 130,42 118,80" fill="#0369A1" />

                {/* Crackling Campfire on Left */}
                {/* Firewood */}
                <rect x="22" y="76" width="22" height="4" fill="#78350F" />
                <rect x="26" y="74" width="14" height="4" fill="#92400E" />
                {/* Glowing Embers and Flames */}
                <rect x="26" y={(animTick % 2 === 0 ? 62 : 64)} width="14" height="12" fill="#EA580C" />
                <rect x="29" y={(animTick % 2 === 0 ? 58 : 60)} width="8" height="10" fill="#FACC15" />
                <rect x="31" y={(animTick % 2 === 0 ? 56 : 58)} width="4" height="6" fill="#FEF08A" />
                {/* Rising Sparks */}
                <rect x="30" y={(animTick % 2 === 0 ? 50 : 48)} width="2" height="2" fill="#FDE047" />
                <rect x="36" y={(animTick % 2 === 0 ? 44 : 46)} width="1" height="1" fill="#F97316" />

                {/* Camp Blanket / Mat (Frog Stage) */}
                <rect x="58" y="66" width="44" height="20" fill="#B91C1C" />
                <rect x="62" y="68" width="36" height="16" fill="#DC2626" />
                <rect x="66" y="70" width="28" height="12" fill="#F87171" />
              </g>
            )}

            {/* G. WASHI TEAROOM LOFT */}
            {config.sceneId === 'tearoom' && (
              <g>
                {/* Shoji Washi Paper Grid Screen Wall */}
                <rect x="0" y="0" width="160" height="62" fill="#FEF3C7" />
                <rect x="0" y="0" width="160" height="4" fill="#523218" />
                <rect x="0" y="20" width="160" height="2" fill="#523218" />
                <rect x="0" y="40" width="160" height="2" fill="#523218" />
                <rect x="0" y="60" width="160" height="4" fill="#523218" />
                {/* Vertical wood struts */}
                <rect x="20" y="0" width="2" height="62" fill="#523218" />
                <rect x="40" y="0" width="2" height="62" fill="#523218" />
                <rect x="60" y="0" width="2" height="62" fill="#523218" />
                <rect x="80" y="0" width="2" height="62" fill="#523218" />
                <rect x="100" y="0" width="2" height="62" fill="#523218" />
                <rect x="120" y="0" width="2" height="62" fill="#523218" />
                <rect x="140" y="0" width="2" height="62" fill="#523218" />

                {/* Mini Bonsai Tree on Stand on Right */}
                <rect x="124" y="42" width="24" height="4" fill="#451A03" />
                <rect x="128" y="46" width="16" height="16" fill="#78350F" />
                <rect x="130" y="38" width="12" height="6" fill="#1C1917" /> {/* Pot */}
                <rect x="132" y="28" width="4" height="10" fill="#78350F" /> {/* Trunk */}
                <rect x="124" y="20" width="18" height="10" fill="#15803D" /> {/* Foliage */}
                <rect x="126" y="16" width="12" height="6" fill="#22C55E" />

                {/* Traditional Tatami Straw Mat Flooring */}
                <rect x="0" y="62" width="160" height="38" fill="#D9F99D" />
                <rect x="0" y="74" width="160" height="4" fill="#365314" /> {/* Dark borders */}
                <rect x="0" y="88" width="160" height="4" fill="#365314" />

                {/* Low Chabudai Wooden Table (Frog Stage) */}
                <rect x="56" y="66" width="48" height="16" fill="#78350F" />
                <rect x="60" y="64" width="40" height="4" fill="#B45309" />
                <rect x="62" y="80" width="4" height="8" fill="#451A03" />
                <rect x="94" y="80" width="4" height="8" fill="#451A03" />

                {/* Matcha Whisk and Ceramic Bowl on Table */}
                <rect x="90" y="60" width="6" height="4" fill="#14532D" />
                <rect x="91" y="58" width="4" height="2" fill="#86EFAC" />
              </g>
            )}

            {/* 3. FROG CHARACTER (CENTERED AT X=70..90, Y=56..80) */}
            {/* Dynamic gentle breathing offset */}
            {(() => {
              const frogY = config.isAnimated && animTick % 2 === 0 ? 56 : 57;
              const frogX = 72;

              return (
                <g id="pixel-frog-hero">
                  {/* Frog Shadow */}
                  <ellipse cx={frogX + 8} cy="81" rx="14" ry="3" fill="#000000" opacity="0.35" />

                  {/* Sleeping Pose special handling */}
                  {config.activityId === 'sleeping' ? (
                    <g>
                      {/* Cozy Quilt Blanket */}
                      <rect x={frogX - 6} y={frogY + 6} width="28" height="18" fill="#0284C7" />
                      <rect x={frogX - 4} y={frogY + 8} width="24" height="3" fill="#38BDF8" />
                      <rect x={frogX - 4} y={frogY + 14} width="24" height="3" fill="#38BDF8" />

                      {/* Frog Head on White Pillow */}
                      <rect x={frogX - 10} y={frogY + 2} width="16" height="14" fill="#F8FAFC" />
                      <rect x={frogX - 6} y={frogY + 2} width="16" height="10" fill="#75A65A" />
                      <rect x={frogX - 8} y={frogY} width="6" height="4" fill="#75A65A" />

                      {/* Closed Sleepy Eyes (- -) */}
                      <rect x={frogX - 2} y={frogY + 5} width="4" height="1" fill="#2D3A20" />
                      <rect x={frogX + 4} y={frogY + 5} width="4" height="1" fill="#2D3A20" />

                      {/* Floating Zzz bubbles */}
                      <g fill="#38BDF8" className="font-mono text-[6px]">
                        <text x={frogX + 8} y={frogY - (animTick % 3) * 2}>
                          Z
                        </text>
                        <text x={frogX + 13} y={frogY - 4 - (animTick % 3) * 2} fontSize="5">
                          z
                        </text>
                        <text x={frogX + 17} y={frogY - 8 - (animTick % 3) * 2} fontSize="4">
                          z
                        </text>
                      </g>
                    </g>
                  ) : (
                    /* Standard / Relaxing / Reading / Tea / Eating / Meditating / Guitar Poses */
                    <g>
                      {/* Frog Eyes Top Outlines */}
                      <rect x={frogX} y={frogY} width="5" height="5" fill="#2D3A20" />
                      <rect x={frogX + 11} y={frogY} width="5" height="5" fill="#2D3A20" />
                      <rect x={frogX + 1} y={frogY + 1} width="3" height="3" fill="#75A65A" />
                      <rect x={frogX + 12} y={frogY + 1} width="3" height="3" fill="#75A65A" />
                      <rect x={frogX + 2} y={frogY + 1} width="1" height="1" fill="#FFFFFF" />
                      <rect x={frogX + 13} y={frogY + 1} width="1" height="1" fill="#FFFFFF" />

                      {/* Frog Body / Head Main */}
                      <rect x={frogX - 2} y={frogY + 4} width="20" height="16" fill="#75A65A" />
                      <rect x={frogX - 3} y={frogY + 6} width="1" height="12" fill="#2D3A20" />
                      <rect x={frogX + 18} y={frogY + 6} width="1" height="12" fill="#2D3A20" />
                      <rect x={frogX} y={frogY + 20} width="16" height="1" fill="#2D3A20" />

                      {/* Cream Belly */}
                      <rect x={frogX + 3} y={frogY + 11} width="10" height="7" fill="#FEF9C3" />

                      {/* Rosy Cheeks */}
                      <rect x={frogX - 1} y={frogY + 10} width="3" height="2" fill="#E88B8B" />
                      <rect x={frogX + 14} y={frogY + 10} width="3" height="2" fill="#E88B8B" />

                      {/* Frog Face Expression (Mood & Activity Adapted) */}
                      {config.activityId === 'meditating' ? (
                        /* Zen Meditating Closed Eyes */
                        <g>
                          <rect x={frogX + 2} y={frogY + 7} width="4" height="1" fill="#2D3A20" />
                          <rect x={frogX + 10} y={frogY + 7} width="4" height="1" fill="#2D3A20" />
                          <rect x={frogX + 6} y={frogY + 11} width="4" height="1" fill="#2D3A20" />
                          {/* Floating Aura Sparkles */}
                          <rect x={frogX - 6} y={frogY - 4} width="2" height="2" fill="#FACC15" />
                          <rect x={frogX + 20} y={frogY - 2} width="2" height="2" fill="#FACC15" />
                          <rect x={frogX + 7} y={frogY - 8} width="2" height="2" fill="#FEF08A" />
                        </g>
                      ) : (
                        /* Happy Eyes & Smile */
                        <g>
                          <rect x={frogX + 2} y={frogY + 7} width="3" height="2" fill="#2D3A20" />
                          <rect x={frogX + 2} y={frogY + 7} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 11} y={frogY + 7} width="3" height="2" fill="#2D3A20" />
                          <rect x={frogX + 11} y={frogY + 7} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 6} y={frogY + 11} width="4" height="1" fill="#2D3A20" />
                          <rect x={frogX + 5} y={frogY + 10} width="1" height="1" fill="#2D3A20" />
                          <rect x={frogX + 10} y={frogY + 10} width="1" height="1" fill="#2D3A20" />
                        </g>
                      )}

                      {/* Frog Legs / Feet */}
                      <rect x={frogX - 4} y={frogY + 18} width="6" height="3" fill="#5F9744" />
                      <rect x={frogX + 14} y={frogY + 18} width="6" height="3" fill="#5F9744" />

                      {/* ACTIVITY PROPS */}

                      {/* 1. Reading Journal */}
                      {config.activityId === 'reading' && (
                        <g>
                          <rect x={frogX + 2} y={frogY + 12} width="12" height="8" fill="#FDF2F8" />
                          <rect x={frogX + 1} y={frogY + 12} width="1" height="8" fill="#DB2777" />
                          <rect x={frogX + 14} y={frogY + 12} width="1" height="8" fill="#DB2777" />
                          <rect x={frogX + 7} y={frogY + 12} width="2" height="8" fill="#DB2777" />
                          {/* Mini Paws holding book */}
                          <rect x={frogX} y={frogY + 14} width="2" height="3" fill="#75A65A" />
                          <rect x={frogX + 14} y={frogY + 14} width="2" height="3" fill="#75A65A" />
                        </g>
                      )}

                      {/* 2. Sipping Green Tea */}
                      {config.activityId === 'tea' && (
                        <g>
                          <rect x={frogX + 5} y={frogY + 12} width="6" height="6" fill="#BBF7D0" />
                          <rect x={frogX + 6} y={frogY + 11} width="4" height="2" fill="#15803D" />
                          {/* Steam Wisp */}
                          <rect
                            x={frogX + 7}
                            y={frogY + 8 - (animTick % 2)}
                            width="2"
                            height="2"
                            fill="#FFFFFF"
                            opacity="0.8"
                          />
                          {/* Hands Holding Cup */}
                          <rect x={frogX + 3} y={frogY + 14} width="2" height="3" fill="#75A65A" />
                          <rect x={frogX + 11} y={frogY + 14} width="2" height="3" fill="#75A65A" />
                        </g>
                      )}

                      {/* 3. Eating Treats (Onigiri / Rice bowl) */}
                      {config.activityId === 'eating' && (
                        <g>
                          {/* Onigiri */}
                          <polygon
                            points={`${frogX + 8},${frogY + 10} ${frogX + 4},${frogY + 16} ${frogX + 12},${frogY + 16}`}
                            fill="#FFFFFF"
                          />
                          <rect x={frogX + 6} y={frogY + 14} width="4" height="2" fill="#18181B" /> {/* Nori */}
                          {/* Hands */}
                          <rect x={frogX + 2} y={frogY + 13} width="3" height="3" fill="#75A65A" />
                          <rect x={frogX + 11} y={frogY + 13} width="3" height="3" fill="#75A65A" />
                        </g>
                      )}

                      {/* 4. Plucking Guitar / Lute */}
                      {config.activityId === 'guitar' && (
                        <g>
                          {/* Wooden Lute Body & Neck */}
                          <rect x={frogX + 6} y={frogY + 12} width="8" height="8" fill="#D97706" />
                          <rect x={frogX + 9} y={frogY + 14} width="2" height="3" fill="#451A03" />
                          <rect x={frogX + 13} y={frogY + 8} width="6" height="3" fill="#B45309" />
                          {/* Floating Pixel Music Notes */}
                          <g fill="#F59E0B">
                            <g transform={`translate(${frogX + 16}, ${frogY + 2 - (animTick % 3) * 2})`}>
                              <rect x="0" y="2" width="2" height="2" />
                              <rect x="1" y="0" width="1" height="3" />
                              <rect x="2" y="0" width="1" height="1" />
                            </g>
                            <g transform={`translate(${frogX + 1}, ${frogY - ((animTick + 1) % 3) * 2})`}>
                              <rect x="0" y="2" width="2" height="2" />
                              <rect x="3" y="2" width="2" height="2" />
                              <rect x="1" y="0" width="1" height="3" />
                              <rect x="4" y="0" width="1" height="3" />
                              <rect x="1" y="0" width="4" height="1" />
                            </g>
                          </g>
                        </g>
                      )}

                      {/* 4. HATS & ACCESSORIES (HEAD LAYER) */}

                      {/* A. Lotus Leaf Hat */}
                      {config.hatId === 'lotus' && (
                        <g>
                          <rect x={frogX + 7} y={frogY - 4} width="2" height="2" fill="#1E3A14" />
                          <rect x={frogX + 2} y={frogY - 2} width="12" height="2" fill="#4D7C0F" />
                          <rect x={frogX - 1} y={frogY} width="18" height="2" fill="#65A30D" />
                          <rect x={frogX - 2} y={frogY + 1} width="20" height="1" fill="#1E3A14" />
                          <rect x={frogX + 12} y={frogY - 1} width="1" height="1" fill="#FFFFFF" /> {/* Dew drop */}
                        </g>
                      )}

                      {/* B. Straw Travel Hat */}
                      {config.hatId === 'straw' && (
                        <g>
                          <polygon
                            points={`${frogX + 8},${frogY - 5} ${frogX - 3},${frogY + 2} ${frogX + 19},${frogY + 2}`}
                            fill="#FDE68A"
                          />
                          <rect x={frogX - 4} y={frogY + 2} width="24" height="2" fill="#D97706" />
                          <rect x={frogX + 4} y={frogY} width="8" height="1" fill="#92400E" />
                        </g>
                      )}

                      {/* C. Sakura Blossom Flower Crown */}
                      {config.hatId === 'sakura' && (
                        <g>
                          <rect x={frogX} y={frogY - 1} width="4" height="3" fill="#F472B6" />
                          <rect x={frogX + 6} y={frogY - 2} width="4" height="3" fill="#FBCFE8" />
                          <rect x={frogX + 12} y={frogY - 1} width="4" height="3" fill="#F472B6" />
                          <rect x={frogX + 7} y={frogY - 1} width="2" height="1" fill="#FDE047" />
                        </g>
                      )}

                      {/* D. Mystic Star Wizard Hat */}
                      {config.hatId === 'wizard' && (
                        <g>
                          <polygon
                            points={`${frogX + 8},${frogY - 10} ${frogX},${frogY + 2} ${frogX + 16},${frogY + 2}`}
                            fill="#1E1B4B"
                          />
                          <rect x={frogX - 2} y={frogY + 2} width="20" height="2" fill="#4338CA" />
                          <rect x={frogX + 7} y={frogY - 4} width="2" height="2" fill="#FACC15" /> {/* Gold star */}
                        </g>
                      )}

                      {/* E. Red Bandana / Scarf */}
                      {config.hatId === 'bandana' && (
                        <g>
                          <rect x={frogX - 1} y={frogY + 10} width="18" height="3" fill="#DC2626" />
                          <rect x={frogX + 14} y={frogY + 12} width="3" height="5" fill="#B91C1C" />
                        </g>
                      )}

                      {/* F. Winter Knit Beanie */}
                      {config.hatId === 'beanie' && (
                        <g>
                          <circle cx={frogX + 8} cy={frogY - 5} r="2.5" fill="#FFFFFF" />
                          <rect x={frogX} y={frogY - 3} width="16" height="5" fill="#DC2626" />
                          <rect x={frogX - 1} y={frogY + 1} width="18" height="3" fill="#F87171" />
                        </g>
                      )}
                    </g>
                  )}
                </g>
              );
            })()}

            {/* 4. COMPANION VISITOR LAYER */}

            {/* A. Snail Friend */}
            {config.companionId === 'snail' && (
              <g id="companion-snail">
                <rect x="110" y="74" width="10" height="8" fill="#E2CCAB" />
                <rect x="112" y="76" width="6" height="4" fill="#7D6242" />
                <rect x="106" y="80" width="16" height="3" fill="#F2E6CA" />
                <rect x="108" y="72" width="1" height="4" fill="#4A3D2A" />
                <rect x="107" y="71" width="2" height="2" fill="#4A3D2A" />
              </g>
            )}

            {/* B. Crab Friend */}
            {config.companionId === 'crab' && (
              <g id="companion-crab">
                <rect x="42" y="74" width="10" height="6" fill="#D95C3C" />
                {/* Waving Claws */}
                <rect x="38" y={(animTick % 2 === 0 ? 70 : 72)} width="3" height="3" fill="#D95C3C" />
                <rect x="51" y={(animTick % 2 === 0 ? 72 : 70)} width="3" height="3" fill="#D95C3C" />
                {/* Eyes */}
                <rect x="44" y="72" width="2" height="2" fill="#FFFFFF" />
                <rect x="48" y="72" width="2" height="2" fill="#FFFFFF" />
                {/* Legs */}
                <rect x="40" y="80" width="2" height="2" fill="#3A2218" />
                <rect x="50" y="80" width="2" height="2" fill="#3A2218" />
              </g>
            )}

            {/* C. Hotaru Fireflies Swarm */}
            {config.companionId === 'fireflies' && (
              <g id="companion-fireflies">
                <circle
                  cx={35 + (animTick % 4) * 2}
                  cy={45 + (animTick % 3)}
                  r="1.5"
                  fill="#FEF08A"
                  className="animate-pulse"
                />
                <circle
                  cx={125 - (animTick % 3) * 2}
                  cy={38 + (animTick % 2)}
                  r="2"
                  fill="#FACC15"
                  className="animate-pulse"
                />
                <circle
                  cx={60 + (animTick % 5)}
                  cy={30 - (animTick % 2)}
                  r="1.5"
                  fill="#FEF08A"
                  className="animate-pulse"
                />
                <circle
                  cx={100 + (animTick % 3)}
                  cy={55 + (animTick % 4)}
                  r="1.5"
                  fill="#FACC15"
                  className="animate-pulse"
                />
              </g>
            )}

            {/* D. Flutter Butterfly */}
            {config.companionId === 'butterfly' && (
              <g
                id="companion-butterfly"
                transform={`translate(${115 + (animTick % 4)}, ${42 + ((animTick * 2) % 6)})`}
              >
                {/* Wings */}
                <rect x="0" y="0" width="4" height="4" fill="#60A5FA" />
                <rect x="6" y="0" width="4" height="4" fill="#60A5FA" />
                <rect x="4" y="1" width="2" height="5" fill="#1E293B" />
              </g>
            )}

            {/* E. Koi Fish Swimming in Water */}
            {config.companionId === 'koi' && (
              <g id="companion-koi" transform={`translate(${45 + ((animTick * 3) % 40)}, 82)`}>
                <ellipse cx="6" cy="3" rx="7" ry="3" fill="#EA580C" />
                <ellipse cx="4" cy="3" rx="3" ry="2" fill="#FFFFFF" />
                <polygon points="12,3 16,0 16,6" fill="#EA580C" /> {/* Tail */}
              </g>
            )}

            {/* 5. WEATHER PARTICLES OVERLAY */}

            {/* Raindrops Falling */}
            {effectiveWeather === 'rainy' && (
              <g id="rain-layer" stroke="#93C5FD" strokeWidth="1" opacity="0.75">
                {Array.from({ length: 24 }).map((_, i) => {
                  const rx = (i * 19 + (animTick * 7)) % 160;
                  const ry = (i * 13 + (animTick * 11)) % 100;
                  return <line key={i} x1={rx} y1={ry} x2={rx - 2} y2={ry + 5} />;
                })}
              </g>
            )}

            {/* Sakura Petals Drifting */}
            {effectiveWeather === 'petals' && (
              <g id="petals-layer">
                {Array.from({ length: 14 }).map((_, i) => {
                  const px = (i * 27 + (animTick * 4)) % 160;
                  const py = (i * 17 + (animTick * 3)) % 100;
                  return (
                    <rect
                      key={i}
                      x={px}
                      y={py}
                      width="2"
                      height="2"
                      fill={i % 2 === 0 ? '#F472B6' : '#FBCFE8'}
                      opacity="0.9"
                    />
                  );
                })}
              </g>
            )}
          </svg>
        </div>

        {/* Info & Quick Settings Bottom Bar inside Diorama */}
        <div className="p-3.5 bg-white/90 dark:bg-[#1f1b17]/90 backdrop-blur-md flex items-center justify-between gap-2 border-t border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#5f7a61]/10 dark:bg-[#7d9d80]/15 border border-[#5f7a61]/20 flex items-center justify-center shrink-0 shadow-2xs">
              <PixelOptionIcon id={config.sceneId} size={20} />
            </div>
            <div className="min-w-0">
              <h4 className="font-extrabold text-xs text-[#2d2823] dark:text-[#f4efe8] truncate">
                {SCENE_LOCATIONS.find((s) => s.id === config.sceneId)?.name}
              </h4>
              <p className="text-[10.5px] text-[#8c7e70] dark:text-[#a89b8d] font-medium truncate">
                {FROG_ACTIVITIES.find((a) => a.id === config.activityId)?.name} •{' '}
                {FROG_HATS.find((h) => h.id === config.hatId)?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Surprise Shuffle Button */}
            <button
              type="button"
              onClick={handleRandomize}
              className="px-2.5 py-1.5 rounded-full text-xs font-bold bg-[#f2ebe0] hover:bg-[#e7dec7] dark:bg-white/[0.08] dark:hover:bg-white/[0.14] text-[#4a4036] dark:text-[#e0d6cb] flex items-center gap-1 transition ios-tap shadow-2xs"
              title="Surprise Randomize"
            >
              <Shuffle size={12} className="text-[#b86f52]" />
              <span className="hidden sm:inline">Shuffle</span>
            </button>

            {/* Customize Button */}
            {showCustomizerButton && (
              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) soundEngine.playTapSound();
                  if (hapticEnabled) triggerHaptic();
                  setIsModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#5f7a61] hover:bg-[#4d6650] text-white flex items-center gap-1.5 shadow-xs transition ios-tap"
              >
                <Sliders size={12} />
                <span>Customize</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* CUSTOMIZE FROG & HABITAT MODAL (100% UNLOCKED BOXES)     */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div
            className="bg-[#fcfaf5] dark:bg-[#1a1714] border border-[#e3dacf] dark:border-[#383028] rounded-[28px] max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#5f7a61]/15 border border-[#5f7a61]/30 flex items-center justify-center text-[#5f7a61] dark:text-[#8fc493]">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-black text-base text-[#2d2823] dark:text-[#f4efe8]">
                    Pixel Sanctuary Studio
                  </h3>
                  <p className="text-xs text-[#8c7e70] dark:text-[#a89b8d] font-medium">
                    All scenes, outfits & companions are 100% unlocked
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 flex items-center justify-center text-[#6e6052] dark:text-[#d6cbbe] transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Customizer Tabs */}
            <div className="flex border-b border-black/[0.06] dark:border-white/[0.08] px-3 bg-[#f5efe4]/60 dark:bg-[#151210]/60 overflow-x-auto no-scrollbar">
              {[
                { id: 'scene', label: 'Scene', icon: <PixelTabSceneIcon size={18} /> },
                { id: 'activity', label: 'Activity', icon: <PixelTabActivityIcon size={18} /> },
                { id: 'hat', label: 'Headwear', icon: <PixelTabHeadwearIcon size={18} /> },
                { id: 'companion', label: 'Companion', icon: <PixelTabCompanionIcon size={18} /> },
                { id: 'weather', label: 'Sky & Weather', icon: <PixelTabWeatherIcon size={18} /> },
              ].map((tab) => {
                const isActive = activeCustomizerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      if (soundEnabled) soundEngine.playTapSound();
                      setActiveCustomizerTab(tab.id as any);
                    }}
                    className={`py-3 px-3.5 text-xs font-black flex items-center gap-1.5 border-b-2 transition whitespace-nowrap ${
                      isActive
                        ? 'border-[#5f7a61] text-[#5f7a61] dark:text-[#8fc493]'
                        : 'border-transparent text-[#8c7e70] dark:text-[#a89b8d] hover:text-[#2d2823] dark:hover:text-[#f4efe8]'
                    }`}
                  >
                    <span className="shrink-0">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Body Options List (Scrollable) */}
            <div className="p-4 sm:p-5 overflow-y-auto max-h-[50vh] space-y-2.5">
              {/* 1. SCENE SELECTION */}
              {activeCustomizerTab === 'scene' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SCENE_LOCATIONS.map((loc) => {
                    const isSelected = config.sceneId === loc.id;
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => {
                          if (soundEnabled) soundEngine.playTapSound();
                          if (hapticEnabled) triggerHaptic();
                          onUpdateConfig({ sceneId: loc.id });
                        }}
                        className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ios-tap ${
                          isSelected
                            ? 'bg-[#5f7a61]/10 dark:bg-[#7d9d80]/15 border-[#5f7a61] shadow-xs'
                            : 'bg-white dark:bg-[#201c18] border-black/[0.06] dark:border-white/[0.08] hover:border-[#5f7a61]/50'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#5f7a61]/5 dark:bg-black/30 border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center shrink-0 shadow-2xs">
                          <PixelOptionIcon id={loc.id} size={28} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-black text-xs text-[#2d2823] dark:text-[#f4efe8] truncate">
                              {loc.name}
                            </h4>
                            {isSelected && <PixelCheckIcon size={14} className="text-[#5f7a61] dark:text-[#8fc493] shrink-0" />}
                          </div>
                          <p className="text-[11px] text-[#8c7e70] dark:text-[#a89b8d] line-clamp-2 mt-0.5">
                            {loc.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 2. ACTIVITY SELECTION */}
              {activeCustomizerTab === 'activity' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {FROG_ACTIVITIES.map((act) => {
                    const isSelected = config.activityId === act.id;
                    return (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => {
                          if (soundEnabled) soundEngine.playTapSound();
                          if (hapticEnabled) triggerHaptic();
                          onUpdateConfig({ activityId: act.id });
                        }}
                        className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ios-tap ${
                          isSelected
                            ? 'bg-[#5f7a61]/10 dark:bg-[#7d9d80]/15 border-[#5f7a61] shadow-xs'
                            : 'bg-white dark:bg-[#201c18] border-black/[0.06] dark:border-white/[0.08] hover:border-[#5f7a61]/50'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#5f7a61]/5 dark:bg-black/30 border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center shrink-0 shadow-2xs">
                          <PixelOptionIcon id={act.id} size={28} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-black text-xs text-[#2d2823] dark:text-[#f4efe8] truncate">
                              {act.name}
                            </h4>
                            {isSelected && <PixelCheckIcon size={14} className="text-[#5f7a61] dark:text-[#8fc493] shrink-0" />}
                          </div>
                          <p className="text-[11px] text-[#8c7e70] dark:text-[#a89b8d] line-clamp-2 mt-0.5">
                            {act.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 3. HEADWEAR SELECTION */}
              {activeCustomizerTab === 'hat' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {FROG_HATS.map((hat) => {
                    const isSelected = config.hatId === hat.id;
                    return (
                      <button
                        key={hat.id}
                        type="button"
                        onClick={() => {
                          if (soundEnabled) soundEngine.playTapSound();
                          if (hapticEnabled) triggerHaptic();
                          onUpdateConfig({ hatId: hat.id });
                        }}
                        className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ios-tap ${
                          isSelected
                            ? 'bg-[#5f7a61]/10 dark:bg-[#7d9d80]/15 border-[#5f7a61] shadow-xs'
                            : 'bg-white dark:bg-[#201c18] border-black/[0.06] dark:border-white/[0.08] hover:border-[#5f7a61]/50'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#5f7a61]/5 dark:bg-black/30 border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center shrink-0 shadow-2xs">
                          <PixelOptionIcon id={hat.id} size={28} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-black text-xs text-[#2d2823] dark:text-[#f4efe8] truncate">
                              {hat.name}
                            </h4>
                            {isSelected && <PixelCheckIcon size={14} className="text-[#5f7a61] dark:text-[#8fc493] shrink-0" />}
                          </div>
                          <p className="text-[11px] text-[#8c7e70] dark:text-[#a89b8d] line-clamp-2 mt-0.5">
                            {hat.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 4. COMPANION SELECTION */}
              {activeCustomizerTab === 'companion' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {FROG_COMPANIONS.map((comp) => {
                    const isSelected = config.companionId === comp.id;
                    return (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => {
                          if (soundEnabled) soundEngine.playTapSound();
                          if (hapticEnabled) triggerHaptic();
                          onUpdateConfig({ companionId: comp.id });
                        }}
                        className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ios-tap ${
                          isSelected
                            ? 'bg-[#5f7a61]/10 dark:bg-[#7d9d80]/15 border-[#5f7a61] shadow-xs'
                            : 'bg-white dark:bg-[#201c18] border-black/[0.06] dark:border-white/[0.08] hover:border-[#5f7a61]/50'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#5f7a61]/5 dark:bg-black/30 border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center shrink-0 shadow-2xs">
                          <PixelOptionIcon id={comp.id} size={28} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-black text-xs text-[#2d2823] dark:text-[#f4efe8] truncate">
                              {comp.name}
                            </h4>
                            {isSelected && <PixelCheckIcon size={14} className="text-[#5f7a61] dark:text-[#8fc493] shrink-0" />}
                          </div>
                          <p className="text-[11px] text-[#8c7e70] dark:text-[#a89b8d] line-clamp-2 mt-0.5">
                            {comp.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 5. WEATHER & ATMOSPHERE SELECTION */}
              {activeCustomizerTab === 'weather' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {FROG_WEATHERS.map((weath) => {
                    const isSelected = config.weatherId === weath.id;
                    return (
                      <button
                        key={weath.id}
                        type="button"
                        onClick={() => {
                          if (soundEnabled) soundEngine.playTapSound();
                          if (hapticEnabled) triggerHaptic();
                          onUpdateConfig({ weatherId: weath.id });
                        }}
                        className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ios-tap ${
                          isSelected
                            ? 'bg-[#5f7a61]/10 dark:bg-[#7d9d80]/15 border-[#5f7a61] shadow-xs'
                            : 'bg-white dark:bg-[#201c18] border-black/[0.06] dark:border-white/[0.08] hover:border-[#5f7a61]/50'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#5f7a61]/5 dark:bg-black/30 border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center shrink-0 shadow-2xs">
                          <PixelOptionIcon id={weath.id} size={28} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-black text-xs text-[#2d2823] dark:text-[#f4efe8] truncate">
                              {weath.name}
                            </h4>
                            {isSelected && <PixelCheckIcon size={14} className="text-[#5f7a61] dark:text-[#8fc493] shrink-0" />}
                          </div>
                          <p className="text-[11px] text-[#8c7e70] dark:text-[#a89b8d] line-clamp-2 mt-0.5">
                            {weath.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 bg-[#f5efe4]/60 dark:bg-[#151210]/60 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleRandomize}
                className="px-3.5 py-2 rounded-xl text-xs font-black bg-white dark:bg-white/[0.08] text-[#4a4036] dark:text-[#e0d6cb] flex items-center gap-1.5 border border-black/[0.06] dark:border-white/[0.1] shadow-2xs transition ios-tap"
              >
                <Shuffle size={13} className="text-[#b86f52]" />
                <span>Surprise Mix</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) soundEngine.playTapSound();
                  setIsModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-black bg-[#5f7a61] hover:bg-[#4d6650] text-white shadow-xs transition ios-tap"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
