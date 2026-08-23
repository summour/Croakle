import React, { useState, useEffect } from 'react';
import {
  PixelSceneConfig,
  SceneLocationId,
  FrogActivityId,
  FrogHatId,
  FrogOutfitId,
  FrogGlassesId,
  FrogSkinId,
  FrogCompanionId,
  FrogWeatherId,
  SCENE_LOCATIONS,
  FROG_ACTIVITIES,
  FROG_HATS,
  FROG_OUTFITS,
  FROG_GLASSES,
  FROG_SKINS,
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
  ShoppingBag,
  Shirt,
  RotateCcw,
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
  PixelTabOutfitIcon,
  PixelTabGlassesIcon,
  PixelTabSkinIcon,
  PixelCheckIcon,
} from './FrogIcons';

export const getSkinColors = (skinId?: FrogSkinId | string) => {
  const cleanId = (skinId || '').replace(/^skin_/, '');
  switch (cleanId) {
    case 'golden':
      return {
        main: '#F59E0B',
        dark: '#B45309',
        outline: '#78350F',
        belly: '#FEF08A',
        cheeks: '#F97316',
        legs: '#D97706',
        eyeHighlight: '#FFFFFF',
      };
    case 'sakura_pink':
      return {
        main: '#F472B6',
        dark: '#DB2777',
        outline: '#831843',
        belly: '#FDF2F8',
        cheeks: '#FB7185',
        legs: '#EC4899',
        eyeHighlight: '#FFFFFF',
      };
    case 'twilight_blue':
      return {
        main: '#38BDF8',
        dark: '#0284C7',
        outline: '#0C4A6E',
        belly: '#E0F2FE',
        cheeks: '#818CF8',
        legs: '#0369A1',
        eyeHighlight: '#FFFFFF',
      };
    case 'matcha':
      return {
        main: '#84CC16',
        dark: '#65A30D',
        outline: '#365314',
        belly: '#ECFCCB',
        cheeks: '#F43F5E',
        legs: '#4D7C0F',
        eyeHighlight: '#FFFFFF',
      };
    case 'albino_white':
      return {
        main: '#F8FAFC',
        dark: '#CBD5E1',
        outline: '#475569',
        belly: '#FFFFFF',
        cheeks: '#FB7185',
        legs: '#E2E8F0',
        eyeHighlight: '#FFFFFF',
      };
    case 'ember_orange':
      return {
        main: '#FB923C',
        dark: '#EA580C',
        outline: '#7C2D12',
        belly: '#FFEDD5',
        cheeks: '#C2410C',
        legs: '#C2410C',
        eyeHighlight: '#FFFFFF',
      };
    case 'fairytale_rose':
      return {
        main: '#F43F5E',
        dark: '#BE123C',
        outline: '#881337',
        belly: '#FFF1F2',
        cheeks: '#E11D48',
        legs: '#BE123C',
        eyeHighlight: '#FFFFFF',
      };
    case 'timber_wolf_grey':
      return {
        main: '#64748B',
        dark: '#475569',
        outline: '#1E293B',
        belly: '#F1F5F9',
        cheeks: '#94A3B8',
        legs: '#334155',
        eyeHighlight: '#FFFFFF',
      };
    case 'wasabi_green':
      return {
        main: '#84CC16',
        dark: '#65A30D',
        outline: '#365314',
        belly: '#F7FEE7',
        cheeks: '#A3E635',
        legs: '#4D7C0F',
        eyeHighlight: '#FFFFFF',
      };
    case 'salmon_peach':
      return {
        main: '#FB923C',
        dark: '#F97316',
        outline: '#9A3412',
        belly: '#FFEDD5',
        cheeks: '#FB7185',
        legs: '#EA580C',
        eyeHighlight: '#FFFFFF',
      };
    case 'cyber_neon_violet':
      return {
        main: '#8B5CF6',
        dark: '#6D28D9',
        outline: '#4C1D95',
        belly: '#A7F3D0',
        cheeks: '#EC4899',
        legs: '#7C3AED',
        eyeHighlight: '#38BDF8',
      };
    case 'gameboy_monochrome':
      return {
        main: '#8BAC0F',
        dark: '#306230',
        outline: '#0F380F',
        belly: '#9BBC0F',
        cheeks: '#306230',
        legs: '#306230',
        eyeHighlight: '#9BBC0F',
      };
    case 'konbini_mint':
      return {
        main: '#34D399',
        dark: '#059669',
        outline: '#064E3B',
        belly: '#ECFDF5',
        cheeks: '#FB7185',
        legs: '#10B981',
        eyeHighlight: '#FFFFFF',
      };
    case 'classic':
    default:
      return {
        main: '#75A65A',
        dark: '#5F7A61',
        outline: '#2D3A20',
        belly: '#FEF9C3',
        cheeks: '#E88B8B',
        legs: '#5F9744',
        eyeHighlight: '#FFFFFF',
      };
  }
};

/** Standalone SVG Frog Character Solo Renderer for Shop Previews */
export const PixelFrogSolo: React.FC<{
  config: Partial<PixelSceneConfig>;
  size?: number;
  className?: string;
  isAnimated?: boolean;
}> = ({ config, size = 120, className = '', isAnimated = true }) => {
  const [soloTick, setSoloTick] = useState(0);

  useEffect(() => {
    if (!isAnimated) return;
    const interval = setInterval(() => {
      setSoloTick((prev) => (prev + 1) % 60);
    }, 350);
    return () => clearInterval(interval);
  }, [isAnimated]);

  const skin = getSkinColors(config.skinId || 'classic');
  const frogX = 40;
  const frogY = 32;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={`inline-block shrink-0 ${className}`}
    >
      {/* Frog Shadow */}
      <rect x={frogX - 10} y={frogY + 26} width="36" height="4" fill="#000000" opacity="0.15" />
      <rect x={frogX - 6} y={frogY + 25} width="28" height="6" fill="#000000" opacity="0.1" />

      {/* COMPANION LAYER (SOLO PREVIEW - Full sized equal to frog, pure crisp pixel art) */}
      {(config.companionId === 'snail' || config.companionId === 'companion_snail') && (
        <g transform={`translate(${frogX + 22 + ((soloTick * 0.8) % 3)}, ${frogY + 4})`}>
          {/* Snail Body & Foot */}
          <rect x="0" y="16" width="20" height="4" fill="#F2E6CA" />
          <rect x="14" y="10" width="6" height="7" fill="#F2E6CA" />
          <rect x="15" y={soloTick % 2 === 0 ? 5 : 7} width="2" height="6" fill="#4A3D2A" />
          <rect x="19" y={soloTick % 2 === 0 ? 5 : 7} width="2" height="6" fill="#4A3D2A" />
          <rect x="14" y={soloTick % 2 === 0 ? 4 : 6} width="3" height="2" fill="#18181B" />
          <rect x="19" y={soloTick % 2 === 0 ? 4 : 6} width="3" height="2" fill="#18181B" />
          <rect x="15" y={soloTick % 2 === 0 ? 4 : 6} width="1" height="1" fill="#FFFFFF" />
          <rect x="20" y={soloTick % 2 === 0 ? 4 : 6} width="1" height="1" fill="#FFFFFF" />
          {/* Big Spiral Shell */}
          <rect x="2" y={4 + (soloTick % 2 === 0 ? 0 : 1)} width="13" height="13" fill="#D4A373" />
          <rect x="4" y={3 + (soloTick % 2 === 0 ? 0 : 1)} width="9" height="15" fill="#D4A373" />
          <rect x="4" y={5 + (soloTick % 2 === 0 ? 0 : 1)} width="9" height="11" fill="#E2CCAB" />
          <rect x="6" y={7 + (soloTick % 2 === 0 ? 0 : 1)} width="5" height="7" fill="#8C5E32" />
          <rect x="7" y={8 + (soloTick % 2 === 0 ? 0 : 1)} width="3" height="5" fill="#D4A373" />
          {/* Slime Trail Sparkle */}
          <rect x="-4" y="19" width="4" height="1" fill="#FDE047" opacity="0.8" />
        </g>
      )}

      {(config.companionId === 'crab' || config.companionId === 'companion_crab') && (
        <g transform={`translate(${frogX - 26 + ((soloTick % 4) < 2 ? 0 : 2)}, ${frogY + 4})`}>
          {/* Crab Body */}
          <rect x="4" y="10" width="16" height="9" fill="#DC2626" />
          <rect x="6" y="8" width="12" height="13" fill="#DC2626" />
          <rect x="7" y="11" width="10" height="7" fill="#EF4444" />
          {/* Snappy Big Claws */}
          <g transform={`translate(0, ${soloTick % 2 === 0 ? 0 : 2})`}>
            <rect x="0" y="3" width="5" height="6" fill="#DC2626" />
            <rect x="0" y="1" width="3" height="3" fill="#EF4444" />
            <rect x="3" y="1" width="2" height="3" fill="#B91C1C" />
          </g>
          <g transform={`translate(19, ${soloTick % 2 === 0 ? 2 : 0})`}>
            <rect x="0" y="3" width="5" height="6" fill="#DC2626" />
            <rect x="0" y="1" width="2" height="3" fill="#B91C1C" />
            <rect x="2" y="1" width="3" height="3" fill="#EF4444" />
          </g>
          {/* Big Eyestalks */}
          <rect x="7" y={soloTick % 2 === 0 ? 4 : 5} width="3" height="5" fill="#FFFFFF" />
          <rect x="14" y={soloTick % 2 === 0 ? 5 : 4} width="3" height="5" fill="#FFFFFF" />
          <rect x="8" y={soloTick % 2 === 0 ? 5 : 6} width="2" height="2" fill="#18181B" />
          <rect x="15" y={soloTick % 2 === 0 ? 6 : 5} width="2" height="2" fill="#18181B" />
          {/* Legs */}
          <rect x="3" y="18" width="3" height="2" fill="#991B1B" />
          <rect x="18" y="18" width="3" height="2" fill="#991B1B" />
        </g>
      )}

      {(config.companionId === 'fireflies' || config.companionId === 'companion_fireflies') && (
        <g>
          {/* Big Floating Firefly orbs with pulsing pixel cores */}
          <rect x={frogX - 22 + Math.sin(soloTick * 0.5) * 4} y={frogY + 2 + Math.cos(soloTick * 0.4) * 4} width="8" height="8" fill="#FEF08A" opacity="0.3" />
          <rect x={frogX - 21 + Math.sin(soloTick * 0.5) * 4} y={frogY + 3 + Math.cos(soloTick * 0.4) * 4} width="6" height="6" fill="#FACC15" />
          <rect x={frogX - 20 + Math.sin(soloTick * 0.5) * 4} y={frogY + 4 + Math.cos(soloTick * 0.4) * 4} width="4" height="4" fill="#FFFFFF" />

          <rect x={frogX + 24 + Math.cos(soloTick * 0.4) * 5} y={frogY + Math.sin(soloTick * 0.6) * 5} width="9" height="9" fill="#FEF08A" opacity="0.3" />
          <rect x={frogX + 25 + Math.cos(soloTick * 0.4) * 5} y={frogY + 1 + Math.sin(soloTick * 0.6) * 5} width="7" height="7" fill="#FACC15" />
          <rect x={frogX + 26 + Math.cos(soloTick * 0.4) * 5} y={frogY + 2 + Math.sin(soloTick * 0.6) * 5} width="4" height="4" fill="#FFFFFF" />
        </g>
      )}

      {(config.companionId === 'butterfly' || config.companionId === 'companion_butterfly') && (
        <g transform={`translate(${frogX + 22 + Math.sin(soloTick * 0.4) * 4}, ${frogY - 4 + Math.cos(soloTick * 0.5) * 3})`}>
          {/* Big Pixel Butterfly */}
          <rect x="8" y="4" width="3" height="14" fill="#0F172A" />
          {/* Left Wing */}
          <rect x={soloTick % 2 === 0 ? 0 : 3} y="2" width={soloTick % 2 === 0 ? 8 : 5} height="9" fill="#60A5FA" />
          <rect x={soloTick % 2 === 0 ? 2 : 4} y="11" width={soloTick % 2 === 0 ? 6 : 4} height="7" fill="#38BDF8" />
          <rect x={soloTick % 2 === 0 ? 2 : 4} y="4" width="3" height="4" fill="#BAE6FD" />
          {/* Right Wing */}
          <rect x="11" y="2" width={soloTick % 2 === 0 ? 8 : 5} height="9" fill="#60A5FA" />
          <rect x="11" y="11" width={soloTick % 2 === 0 ? 6 : 4} height="7" fill="#38BDF8" />
          <rect x="14" y="4" width="3" height="4" fill="#BAE6FD" />
          {/* Antennae */}
          <rect x="7" y="1" width="1" height="3" fill="#0F172A" />
          <rect x="11" y="1" width="1" height="3" fill="#0F172A" />
        </g>
      )}

      {(config.companionId === 'koi' || config.companionId === 'companion_koi') && (
        <g transform={`translate(${frogX - 26 + ((soloTick * 2) % 12)}, ${frogY + 8})`}>
          {/* Big Pixel Swimming Koi */}
          <rect x="4" y="6" width="16" height="8" fill="#F8FAFC" />
          <rect x="6" y="4" width="12" height="12" fill="#F8FAFC" />
          <rect x="8" y="5" width="8" height="5" fill="#EA580C" />
          <rect x="6" y="9" width="4" height="4" fill="#DC2626" />
          {/* Tail Fin Swish */}
          <rect x={soloTick % 2 === 0 ? 20 : 19} y="3" width="4" height="5" fill="#EA580C" />
          <rect x={soloTick % 2 === 0 ? 20 : 19} y="12" width="4" height="5" fill="#EA580C" />
          <rect x="2" y="8" width="3" height="3" fill="#18181B" />
          <rect x="2" y="8" width="1" height="1" fill="#FFFFFF" />
        </g>
      )}

      {(config.companionId === 'duckling' || config.companionId === 'companion_duckling') && (
        <g transform={`translate(${frogX + 22}, ${frogY + 4 + (soloTick % 2 === 0 ? 0 : 2)})`}>
          {/* Big Pixel Duckling */}
          <rect x="6" y="8" width="14" height="10" fill="#FACC15" />
          <rect x="4" y="10" width="16" height="7" fill="#FACC15" />
          {/* Duck Head */}
          <rect x="2" y="3" width="9" height="8" fill="#FACC15" />
          <rect x="4" y="4" width="2" height="2" fill="#18181B" />
          <rect x="4" y="4" width="1" height="1" fill="#FFFFFF" />
          {/* Beak */}
          <rect x="-2" y="6" width="5" height="3" fill="#EA580C" />
          {/* Flapping Wing */}
          <rect x="8" y={soloTick % 2 === 0 ? 10 : 8} width="7" height="5" fill="#EAB308" />
          {/* Feet */}
          <rect x="6" y="18" width="4" height="2" fill="#EA580C" />
          <rect x="13" y="18" width="4" height="2" fill="#EA580C" />
        </g>
      )}

      {(config.companionId === 'cat' || config.companionId === 'companion_cat') && (
        <g transform={`translate(${frogX - 26}, ${frogY + 4})`}>
          {/* Big Starry Black Cat */}
          <rect x="4" y="8" width="14" height="12" fill="#18181B" />
          <rect x="2" y="10" width="18" height="9" fill="#18181B" />
          {/* Head & Pointy Ears */}
          <rect x="6" y="2" width="11" height="9" fill="#18181B" />
          <rect x="5" y="0" width="4" height="3" fill="#18181B" />
          <rect x="14" y="0" width="4" height="3" fill="#18181B" />
          <rect x="6" y="1" width="2" height="2" fill="#FB7185" />
          <rect x="15" y="1" width="2" height="2" fill="#FB7185" />
          {/* Glowing Eyes */}
          <rect x="7" y="4" width="3" height="3" fill="#FACC15" />
          <rect x="13" y="4" width="3" height="3" fill="#FACC15" />
          <rect x="8" y="5" width="1" height="2" fill="#000000" />
          <rect x="14" y="5" width="1" height="2" fill="#000000" />
          {/* Collar & Bell */}
          <rect x="6" y="10" width="11" height="2" fill="#DC2626" />
          <rect x="10" y="11" width="3" height="3" fill="#FACC15" />
          {/* Tail */}
          <rect x="0" y={soloTick % 2 === 0 ? 8 : 12} width="4" height="8" fill="#18181B" />
          {/* Paws */}
          <rect x="5" y="20" width="3" height="2" fill="#27272A" />
          <rect x="14" y="20" width="3" height="2" fill="#27272A" />
        </g>
      )}

      {(config.companionId === 'turtle' || config.companionId === 'companion_turtle') && (
        <g transform={`translate(${frogX + 22}, ${frogY + 6})`}>
          {/* Big Mossy Turtle */}
          <rect x="4" y="6" width="16" height="12" fill="#78350F" />
          <rect x="6" y="4" width="12" height="15" fill="#78350F" />
          <rect x="6" y="6" width="12" height="11" fill="#15803D" />
          <rect x="8" y="8" width="8" height="7" fill="#22C55E" />
          {/* Flower on Shell */}
          <rect x="10" y="3" width="4" height="4" fill="#F472B6" />
          <rect x="11" y="4" width="2" height="2" fill="#FDE047" />
          {/* Head */}
          <rect x="-1" y={soloTick % 2 === 0 ? 7 : 8} width="6" height="6" fill="#166534" />
          <rect x="0" y={soloTick % 2 === 0 ? 8 : 9} width="2" height="2" fill="#18181B" />
          {/* Flippers */}
          <rect x="2" y="17" width="5" height="3" fill="#166534" />
          <rect x="16" y="17" width="5" height="3" fill="#166534" />
        </g>
      )}

      {(config.companionId === 'chibi_wolf_pup' || config.companionId === 'companion_chibi_wolf_pup') && (
        <g transform={`translate(${frogX + 22}, ${frogY + 4 + (soloTick % 2 === 0 ? 0 : -2)})`}>
          {/* Big Slate Grey Wolf Pup */}
          <rect x="4" y="8" width="15" height="12" fill="#475569" />
          <rect x="3" y="2" width="11" height="10" fill="#475569" />
          <rect x="2" y="0" width="4" height="4" fill="#334155" />
          <rect x="9" y="0" width="4" height="4" fill="#334155" />
          <rect x="4" y="4" width="3" height="3" fill="#FACC15" />
          <rect x="5" y="5" width="1" height="1" fill="#000000" />
          {/* White Snout & Tongue */}
          <rect x="0" y="6" width="6" height="5" fill="#F1F5F9" />
          <rect x="0" y="6" width="2" height="2" fill="#18181B" />
          {soloTick % 2 === 0 && <rect x="2" y="9" width="3" height="2" fill="#FB7185" />}
          {/* Wagging Tail */}
          <rect x="18" y={soloTick % 2 === 0 ? 6 : 10} width="5" height="5" fill="#475569" />
          {/* Paws */}
          <rect x="4" y="20" width="3" height="2" fill="#334155" />
          <rect x="14" y="20" width="3" height="2" fill="#334155" />
        </g>
      )}

      {(config.companionId === 'forest_hedgehog' || config.companionId === 'companion_forest_hedgehog') && (
        <g transform={`translate(${frogX - 26}, ${frogY + 6 + (soloTick % 2 === 0 ? 0 : 1)})`}>
          {/* Big Forest Hedgehog */}
          <rect x="4" y="4" width="16" height="14" fill="#78350F" />
          <rect x="2" y="2" width="4" height="4" fill="#451A03" />
          <rect x="8" y="1" width="4" height="4" fill="#451A03" />
          <rect x="14" y="2" width="4" height="4" fill="#451A03" />
          {/* Strawberry on back */}
          <rect x="7" y="0" width="5" height="5" fill="#DC2626" />
          <rect x="9" y="-2" width="2" height="2" fill="#16A34A" />
          {/* Snout */}
          <rect x="18" y="10" width="6" height="6" fill="#FBBF24" />
          <rect x="22" y="11" width="2" height="2" fill="#18181B" />
          {/* Trotting feet */}
          <rect x="6" y="18" width="4" height="2" fill="#451A03" />
          <rect x="15" y="18" width="4" height="2" fill="#451A03" />
        </g>
      )}

      {(config.companionId === 'sushi_apprentice_cat' || config.companionId === 'companion_sushi_apprentice_cat') && (
        <g transform={`translate(${frogX - 26}, ${frogY + 4 + (soloTick % 2 === 0 ? 0 : -1)})`}>
          {/* Big Sushi Apprentice Calico Cat */}
          <rect x="4" y="8" width="14" height="12" fill="#FFFFFF" />
          <rect x="5" y="10" width="5" height="5" fill="#FB923C" />
          <rect x="12" y="12" width="4" height="4" fill="#1E293B" />
          {/* Head & Ears */}
          <rect x="6" y="2" width="11" height="9" fill="#FFFFFF" />
          <rect x="5" y="0" width="4" height="3" fill="#FB923C" />
          <rect x="13" y="0" width="4" height="3" fill="#1E293B" />
          {/* Chef Headband */}
          <rect x="5" y="3" width="13" height="2" fill="#DC2626" />
          {/* Eyes */}
          <rect x="7" y="5" width="2" height="2" fill="#1E3A8A" />
          <rect x="13" y="5" width="2" height="2" fill="#1E3A8A" />
          {/* Nigiri Plate Held */}
          <g transform={`translate(16, ${soloTick % 2 === 0 ? 8 : 10})`}>
            <rect x="0" y="2" width="7" height="4" fill="#FFFFFF" />
            <rect x="0" y="0" width="7" height="3" fill="#FB923C" />
            <rect x="2" y="0" width="2" height="6" fill="#15803D" />
          </g>
          {/* Feet */}
          <rect x="5" y="20" width="4" height="2" fill="#E2E8F0" />
          <rect x="13" y="20" width="4" height="2" fill="#E2E8F0" />
        </g>
      )}

      {(config.companionId === 'mini_ebi_shrimp' || config.companionId === 'companion_mini_ebi_shrimp') && (
        <g transform={`translate(${frogX + 22}, ${frogY + 4 + (soloTick % 3 === 1 ? -4 : 0)})`}>
          {/* Big Crispy Tempura Prawn */}
          <rect x="4" y="6" width="14" height="10" fill="#EA580C" />
          <rect x="6" y="4" width="10" height="13" fill="#F97316" />
          <rect x="8" y="7" width="2" height="7" fill="#FED7AA" />
          {/* Crispy Tail */}
          <rect x="16" y="2" width="5" height="4" fill="#DC2626" />
          <rect x="16" y="12" width="5" height="4" fill="#EA580C" />
          {/* Face */}
          <rect x="2" y="8" width="3" height="3" fill="#18181B" />
          <rect x="2" y="8" width="1" height="1" fill="#FFFFFF" />
          <rect x="4" y="12" width="2" height="2" fill="#FB7185" />
          {/* Antennae */}
          <rect x="-2" y="4" width="4" height="2" fill="#EA580C" />
          <rect x="-2" y="12" width="4" height="2" fill="#EA580C" />
        </g>
      )}

      {(config.companionId === 'konbini_cashier_cat' || config.companionId === 'companion_konbini_cashier_cat') && (
        <g transform={`translate(${frogX + 22}, ${frogY + 2})`}>
          {/* Big Konbini Cashier Lucky Cat */}
          <rect x="4" y="10" width="14" height="12" fill="#FFFFFF" />
          <rect x="6" y="3" width="11" height="10" fill="#FFFFFF" />
          <rect x="5" y="1" width="4" height="3" fill="#FB7185" />
          <rect x="13" y="1" width="4" height="3" fill="#FB7185" />
          {/* Green Store Visor */}
          <rect x="4" y={soloTick % 2 === 0 ? 3 : 4} width="15" height="3" fill="#10B981" />
          {/* Face */}
          <rect x="7" y="7" width="2" height="2" fill="#1E293B" />
          <rect x="13" y="7" width="2" height="2" fill="#1E293B" />
          {/* Green Apron & Gold Coin */}
          <rect x="5" y="13" width="12" height="8" fill="#10B981" />
          <rect x="9" y="15" width="4" height="4" fill="#FACC15" />
          {/* Waving Paw */}
          <g transform={`translate(-2, ${soloTick % 2 === 0 ? 4 : 8})`}>
            <rect x="0" y="0" width="5" height="6" fill="#FFFFFF" />
            <rect x="1" y="1" width="3" height="3" fill="#FB7185" />
          </g>
          {/* Feet */}
          <rect x="5" y="22" width="4" height="2" fill="#E2E8F0" />
          <rect x="13" y="22" width="4" height="2" fill="#E2E8F0" />
        </g>
      )}

      {(config.companionId === 'snack_shiba' || config.companionId === 'companion_snack_shiba') && (
        <g transform={`translate(${frogX - 28}, ${frogY + 4})`}>
          {/* Big Basket Shiba */}
          <rect x="0" y="10" width="24" height="12" fill="#DC2626" />
          <rect x="2" y="12" width="20" height="9" fill="#B91C1C" />
          {/* Shiba in Basket */}
          <rect x="6" y="4" width="13" height="10" fill="#D97706" />
          <rect x="6" y="2" width="4" height="4" fill="#B45309" />
          <rect x="14" y="2" width="4" height="4" fill="#B45309" />
          <rect x="8" y="5" width="2" height="2" fill="#18181B" />
          <rect x="14" y="5" width="2" height="2" fill="#18181B" />
          <rect x="9" y="7" width="6" height="4" fill="#FFFFFF" />
          <rect x="11" y="8" width="2" height="2" fill="#18181B" />
          {soloTick % 2 === 0 && <rect x="11" y="10" width="2" height="2" fill="#FB7185" />}
          {/* Wagging Tail */}
          <rect x="20" y={soloTick % 2 === 0 ? 4 : 8} width="4" height="4" fill="#D97706" />
          {/* Chip Bag */}
          <rect x="1" y="6" width="5" height="7" fill="#FACC15" />
        </g>
      )}

      {(config.companionId === 'pixel_arcade_ghost' || config.companionId === 'companion_pixel_arcade_ghost') && (
        <g transform={`translate(${frogX + 22}, ${frogY + (soloTick % 2 === 0 ? 0 : 3)})`}>
          {/* 8-Bit Pixel Ghost (Blinky / Inky Style) */}
          <rect x="3" y="2" width="14" height="4" fill="#EC4899" />
          <rect x="1" y="5" width="18" height="11" fill="#EC4899" />
          {/* Animated Pixel Bottom Fringe */}
          {soloTick % 2 === 0 ? (
            <g fill="#EC4899">
              <rect x="1" y="16" width="4" height="3" />
              <rect x="8" y="16" width="4" height="3" />
              <rect x="15" y="16" width="4" height="3" />
            </g>
          ) : (
            <g fill="#EC4899">
              <rect x="4" y="16" width="4" height="3" />
              <rect x="12" y="16" width="4" height="3" />
            </g>
          )}
          {/* Big Expressive Pixel Eyes */}
          <rect x="3" y="6" width="5" height="5" fill="#FFFFFF" />
          <rect x="11" y="6" width="5" height="5" fill="#FFFFFF" />
          {/* Eye Pupils looking at frog */}
          <rect x="3" y="8" width="3" height="3" fill="#1E3A8A" />
          <rect x="11" y="8" width="3" height="3" fill="#1E3A8A" />
          {/* Glow Sparkles */}
          <rect x="16" y="1" width="2" height="2" fill="#FDE047" opacity="0.8" />
        </g>
      )}

      {(config.companionId === 'retro_tamagotchi' || config.companionId === 'companion_retro_tamagotchi') && (
        <g transform={`translate(${frogX - 26}, ${frogY + 4 + (soloTick % 2 === 0 ? 0 : 2)})`}>
          {/* Keychain Ring at top */}
          <rect x="8" y="0" width="4" height="3" fill="#94A3B8" stroke="#475569" strokeWidth="0.5" />
          <rect x="9" y="1" width="2" height="1" fill="#F8FAFC" />
          {/* Egg-shaped Tamagotchi Body */}
          <rect x="4" y="3" width="12" height="17" fill="#FACC15" />
          <rect x="2" y="5" width="16" height="13" fill="#FACC15" />
          <rect x="1" y="7" width="18" height="9" fill="#FACC15" />
          {/* Pixel Shell Border Highlight */}
          <rect x="3" y="5" width="2" height="12" fill="#FEF08A" />
          {/* LCD Screen Display */}
          <rect x="4" y="6" width="12" height="9" fill="#9BBC0F" stroke="#0F380F" strokeWidth="0.5" />
          {/* Animated Pixel Pet inside LCD */}
          <rect x="8" y={soloTick % 2 === 0 ? 9 : 8} width="4" height="4" fill="#0F380F" />
          <rect x="7" y={soloTick % 2 === 0 ? 11 : 10} width="6" height="2" fill="#0F380F" />
          {soloTick % 2 === 0 ? (
            <rect x="13" y="7" width="2" height="2" fill="#0F380F" />
          ) : (
            <rect x="5" y="7" width="2" height="2" fill="#0F380F" />
          )}
          {/* 3 Physical Push Buttons */}
          <rect x="5" y="16" width="2" height="2" fill="#EC4899" />
          <rect x="9" y="16" width="2" height="2" fill="#EC4899" />
          <rect x="13" y="16" width="2" height="2" fill="#EC4899" />
        </g>
      )}

      {/* Eyes Outlines & Color */}
      <rect x={frogX} y={frogY} width="5" height="5" fill={skin.outline} />
      <rect x={frogX + 11} y={frogY} width="5" height="5" fill={skin.outline} />
      <rect x={frogX + 1} y={frogY + 1} width="3" height="3" fill={skin.main} />
      <rect x={frogX + 12} y={frogY + 1} width="3" height="3" fill={skin.main} />
      <rect x={frogX + 2} y={frogY + 1} width="1" height="1" fill={skin.eyeHighlight} />
      <rect x={frogX + 13} y={frogY + 1} width="1" height="1" fill={skin.eyeHighlight} />

      {/* Body & Head */}
      <rect x={frogX - 2} y={frogY + 4} width="20" height="18" fill={skin.main} />
      <rect x={frogX - 3} y={frogY + 6} width="1" height="14" fill={skin.outline} />
      <rect x={frogX + 18} y={frogY + 6} width="1" height="14" fill={skin.outline} />
      <rect x={frogX} y={frogY + 22} width="16" height="1" fill={skin.outline} />

      {/* Belly */}
      <rect x={frogX + 3} y={frogY + 11} width="10" height="8" fill={skin.belly} />

      {/* Cheeks */}
      <rect x={frogX - 1} y={frogY + 10} width="3" height="2" fill={skin.cheeks} />
      <rect x={frogX + 14} y={frogY + 10} width="3" height="2" fill={skin.cheeks} />

      {/* Face Expression */}
      <rect x={frogX + 2} y={frogY + 7} width="3" height="2" fill={skin.outline} />
      <rect x={frogX + 2} y={frogY + 7} width="1" height="1" fill="#FFFFFF" />
      <rect x={frogX + 11} y={frogY + 7} width="3" height="2" fill={skin.outline} />
      <rect x={frogX + 11} y={frogY + 7} width="1" height="1" fill="#FFFFFF" />
      <rect x={frogX + 6} y={frogY + 11} width="4" height="1" fill={skin.outline} />
      <rect x={frogX + 5} y={frogY + 10} width="1" height="1" fill={skin.outline} />
      <rect x={frogX + 10} y={frogY + 10} width="1" height="1" fill={skin.outline} />

      {/* Feet */}
      <rect x={frogX - 4} y={frogY + 20} width="6" height="3" fill={skin.legs} />
      <rect x={frogX + 14} y={frogY + 20} width="6" height="3" fill={skin.legs} />

      {/* OUTFIT LAYER */}
      {config.outfitId === 'kimono' && (
        <g>
          <rect x={frogX - 2} y={frogY + 11} width="20" height="10" fill="#1E3A8A" />
          <rect x={frogX} y={frogY + 11} width="16" height="10" fill="#2563EB" />
          <rect x={frogX + 1} y={frogY + 14} width="14" height="3" fill="#FACC15" />
          <rect x={frogX + 6} y={frogY + 13} width="4" height="5" fill="#EAB308" />
        </g>
      )}

      {config.outfitId === 'raincoat' && (
        <g>
          <rect x={frogX - 2} y={frogY + 10} width="20" height="11" fill="#FACC15" />
          <rect x={frogX} y={frogY + 11} width="16" height="9" fill="#EAB308" />
          <rect x={frogX + 7} y={frogY + 12} width="2" height="2" fill="#713F12" />
          <rect x={frogX + 7} y={frogY + 16} width="2" height="2" fill="#713F12" />
        </g>
      )}

      {config.outfitId === 'sweater' && (
        <g>
          <rect x={frogX - 2} y={frogY + 10} width="20" height="11" fill="#EA580C" />
          <rect x={frogX} y={frogY + 11} width="16" height="9" fill="#F97316" />
          <rect x={frogX + 2} y={frogY + 13} width="12" height="1" fill="#C2410C" />
          <rect x={frogX + 2} y={frogY + 16} width="12" height="1" fill="#C2410C" />
        </g>
      )}

      {config.outfitId === 'ninja' && (
        <g>
          <rect x={frogX - 2} y={frogY + 9} width="20" height="12" fill="#18181B" />
          <rect x={frogX} y={frogY + 14} width="16" height="2" fill="#DC2626" />
        </g>
      )}

      {config.outfitId === 'sailor' && (
        <g>
          <rect x={frogX - 1} y={frogY + 11} width="18" height="10" fill="#FFFFFF" />
          <rect x={frogX + 1} y={frogY + 11} width="14" height="3" fill="#1E40AF" />
          <rect x={frogX + 6} y={frogY + 13} width="4" height="4" fill="#DC2626" />
        </g>
      )}

      {config.outfitId === 'apron' && (
        <g>
          <rect x={frogX + 1} y={frogY + 11} width="14" height="10" fill="#78350F" />
          <rect x={frogX + 4} y={frogY + 14} width="8" height="5" fill="#A16207" />
          <rect x={frogX + 6} y={frogY + 15} width="4" height="1" fill="#FEF08A" />
        </g>
      )}

      {config.outfitId === 'overalls' && (
        <g>
          <rect x={frogX} y={frogY + 13} width="16" height="8" fill="#2563EB" />
          <rect x={frogX + 2} y={frogY + 10} width="3" height="4" fill="#1D4ED8" />
          <rect x={frogX + 11} y={frogY + 10} width="3" height="4" fill="#1D4ED8" />
          <rect x={frogX + 2} y={frogY + 12} width="2" height="2" fill="#FACC15" />
          <rect x={frogX + 12} y={frogY + 12} width="2" height="2" fill="#FACC15" />
        </g>
      )}

      {config.outfitId === 'scarf' && (
        <g>
          <rect x={frogX - 2} y={frogY + 10} width="20" height="4" fill="#DC2626" />
          <rect x={frogX + 12} y={frogY + 13} width="4" height="7" fill="#B91C1C" />
          <rect x={frogX + 12} y={frogY + 19} width="4" height="1" fill="#FEF08A" />
        </g>
      )}

      {config.outfitId === 'business' && (
        <g>
          <rect x={frogX - 1} y={frogY + 11} width="18" height="9" fill="#334155" />
          <rect x={frogX + 4} y={frogY + 11} width="8" height="2" fill="#FFFFFF" />
          <rect x={frogX + 5} y={frogY + 13} width="6" height="2" fill="#FFFFFF" />
          <rect x={frogX + 6} y={frogY + 15} width="4" height="2" fill="#FFFFFF" />
          <rect x={frogX + 6} y={frogY + 12} width="4" height="2" fill="#DC2626" />
        </g>
      )}

      {config.outfitId === 'hoodie' && (
        <g>
          <rect x={frogX - 3} y={frogY + 7} width="22" height="13" fill="#10B981" />
          <rect x={frogX - 1} y={frogY + 5} width="4" height="3" fill="#059669" />
          <rect x={frogX + 13} y={frogY + 5} width="4" height="3" fill="#059669" />
          <rect x={frogX + 3} y={frogY + 14} width="10" height="5" fill="#059669" />
        </g>
      )}

      {config.outfitId === 'red_riding_dress' && (
        <g>
          <rect x={frogX - 2} y={frogY + 10} width="20" height="10" fill="#BE123C" />
          <rect x={frogX + 1} y={frogY + 10} width="14" height="9" fill="#991B1B" />
          <rect x={frogX + 3} y={frogY + 11} width="10" height="8" fill="#FFFFFF" />
          <rect x={frogX + 6} y={frogY + 12} width="4" height="1" fill="#18181B" />
          <rect x={frogX + 6} y={frogY + 14} width="4" height="1" fill="#18181B" />
        </g>
      )}

      {config.outfitId === 'wolf_fur_cloak' && (
        <g>
          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#334155" />
          <rect x={frogX - 2} y={frogY + 9} width="20" height="3" fill="#64748B" />
          <rect x={frogX + 2} y={frogY + 12} width="12" height="9" fill="#1E293B" />
          <rect x={frogX + 6} y={frogY + 10} width="4" height="3" fill="#FEF08A" />
          <rect x={frogX + 7} y={frogY + 10} width="2" height="2" fill="#DC2626" />
        </g>
      )}

      {config.outfitId === 'hunter_woodsman' && (
        <g>
          <rect x={frogX - 1} y={frogY + 10} width="18" height="10" fill="#15803D" />
          <rect x={frogX + 1} y={frogY + 10} width="14" height="10" fill="#166534" />
          <rect x={frogX - 1} y={frogY + 14} width="18" height="2" fill="#78350F" />
          <rect x={frogX + 6} y={frogY + 13} width="4" height="4" fill="#FACC15" />
          <rect x={frogX + 7} y={frogY + 14} width="2" height="2" fill="#78350F" />
        </g>
      )}

      {config.outfitId === 'sushi_chef_happi' && (
        <g>
          <rect x={frogX - 2} y={frogY + 10} width="20" height="10" fill="#FFFFFF" />
          <rect x={frogX} y={frogY + 10} width="16" height="10" fill="#F8FAFC" />
          <rect x={frogX - 2} y={frogY + 10} width="3" height="10" fill="#1E3A8A" />
          <rect x={frogX + 15} y={frogY + 10} width="3" height="10" fill="#1E3A8A" />
          <rect x={frogX + 1} y={frogY + 15} width="14" height="2" fill="#1E3A8A" />
          <rect x={frogX + 6} y={frogY + 12} width="4" height="4" fill="#2563EB" />
        </g>
      )}

      {config.outfitId === 'sushi_kimono_waiter' && (
        <g>
          <rect x={frogX - 2} y={frogY + 10} width="20" height="10" fill="#312E81" />
          <rect x={frogX} y={frogY + 10} width="16" height="10" fill="#3730A3" />
          <rect x={frogX - 1} y={frogY + 13} width="18" height="3" fill="#DC2626" />
          <rect x={frogX + 6} y={frogY + 12} width="4" height="5" fill="#FACC15" />
        </g>
      )}

      {config.outfitId === 'konbini_staff_uniform' && (
        <g>
          <rect x={frogX - 2} y={frogY + 10} width="20" height="10" fill="#FFFFFF" />
          <rect x={frogX} y={frogY + 10} width="16" height="10" fill="#F8FAFC" />
          <rect x={frogX - 2} y={frogY + 10} width="20" height="3" fill="#10B981" />
          <rect x={frogX + 6} y={frogY + 10} width="4" height="3" fill="#059669" />
          <rect x={frogX - 2} y={frogY + 13} width="20" height="1.5" fill="#EA580C" />
          <rect x={frogX + 11} y={frogY + 14} width="4" height="3" fill="#FEF08A" stroke="#78350F" strokeWidth="0.5" />
          <rect x={frogX + 12} y={frogY + 15} width="2" height="1" fill="#1E293B" />
        </g>
      )}

      {config.outfitId === 'shopper_cozy_sweatset' && (
        <g>
          <rect x={frogX - 3} y={frogY + 8} width="22" height="13" fill="#8B5CF6" />
          <rect x={frogX - 1} y={frogY + 7} width="18" height="12" fill="#A78BFA" />
          <rect x={frogX + 3} y={frogY + 14} width="10" height="5" fill="#7C3AED" />
          <rect x={frogX + 5} y={frogY + 10} width="6" height="2" fill="#DDD6FE" />
        </g>
      )}

      {config.outfitId === 'arcade_gamer_bomber' && (
        <g>
          <rect x={frogX - 3} y={frogY + 8} width="22" height="13" fill="#581C87" />
          <rect x={frogX - 1} y={frogY + 7} width="18" height="12" fill="#7E22CE" />
          <rect x={frogX - 3} y={frogY + 9} width="4" height="10" fill="#06B6D4" />
          <rect x={frogX + 15} y={frogY + 9} width="4" height="10" fill="#06B6D4" />
          <rect x={frogX + 7} y={frogY + 8} width="2" height="11" fill="#FACC15" />
          <rect x={frogX + 2} y={frogY + 11} width="3" height="3" fill="#EC4899" />
          <rect x={frogX + 11} y={frogY + 11} width="3" height="3" fill="#22D3EE" />
        </g>
      )}

      {config.outfitId === 'pixel_hero_armor' && (
        <g>
          <rect x={frogX - 3} y={frogY + 8} width="22" height="13" fill="#7C3AED" />
          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#94A3B8" />
          <rect x={frogX} y={frogY + 9} width="16" height="10" fill="#CBD5E1" />
          <rect x={frogX + 6} y={frogY + 11} width="4" height="4" fill="#FACC15" />
          <rect x={frogX + 7} y={frogY + 10} width="2" height="6" fill="#FEF08A" />
          <rect x={frogX - 1} y={frogY + 15} width="18" height="2" fill="#475569" />
        </g>
      )}

      {config.outfitId === 'retro_esports_jersey' && (
        <g>
          <rect x={frogX - 3} y={frogY + 8} width="22" height="13" fill="#0F172A" />
          <rect x={frogX - 1} y={frogY + 7} width="18" height="12" fill="#1E293B" />
          <rect x={frogX - 3} y={frogY + 8} width="3" height="12" fill="#06B6D4" />
          <rect x={frogX + 16} y={frogY + 8} width="3" height="12" fill="#06B6D4" />
          <rect x={frogX + 4} y={frogY + 11} width="8" height="5" fill="#FACC15" />
          <rect x={frogX + 6} y={frogY + 12} width="4" height="3" fill="#0F172A" />
        </g>
      )}

      {/* GLASSES / FACE ACCESSORY */}
      {config.glassesId === 'reading' && (
        <g>
          <rect x={frogX} y={frogY + 6} width="6" height="5" fill="#D97706" />
          <rect x={frogX + 1} y={frogY + 7} width="4" height="3" fill="#E0F2FE" />
          <rect x={frogX + 1} y={frogY + 7} width="1" height="1" fill="#FFFFFF" />
          <rect x={frogX + 10} y={frogY + 6} width="6" height="5" fill="#D97706" />
          <rect x={frogX + 11} y={frogY + 7} width="4" height="3" fill="#E0F2FE" />
          <rect x={frogX + 11} y={frogY + 7} width="1" height="1" fill="#FFFFFF" />
          <rect x={frogX + 6} y={frogY + 8} width="4" height="1" fill="#D97706" />
        </g>
      )}

      {config.glassesId === 'sunglasses' && (
        <g>
          <rect x={frogX - 1} y={frogY + 6} width="8" height="5" fill="#18181B" />
          <rect x={frogX + 9} y={frogY + 6} width="8" height="5" fill="#18181B" />
          <rect x={frogX + 7} y={frogY + 7} width="2" height="2" fill="#18181B" />
          <rect x={frogX} y={frogY + 7} width="2" height="1" fill="#FFFFFF" />
          <rect x={frogX + 10} y={frogY + 7} width="2" height="1" fill="#FFFFFF" />
        </g>
      )}

      {config.glassesId === 'monocle' && (
        <g>
          <rect x={frogX + 10} y={frogY + 6} width="6" height="5" fill="#EAB308" />
          <rect x={frogX + 11} y={frogY + 7} width="4" height="3" fill="#E0F2FE" />
          <rect x={frogX + 11} y={frogY + 7} width="1" height="1" fill="#FFFFFF" />
          <rect x={frogX + 16} y={frogY + 8} width="1" height="8" fill="#CA8A04" />
        </g>
      )}

      {config.glassesId === 'blush_stars' && (
        <g>
          <rect x={frogX - 1} y={frogY + 9} width="2" height="2" fill="#FACC15" />
          <rect x={frogX + 15} y={frogY + 9} width="2" height="2" fill="#FACC15" />
        </g>
      )}

      {config.glassesId === 'sparkles' && (
        <g>
          <rect x={frogX - 5} y={frogY + 2} width="2" height="2" fill="#FEF08A" />
          <rect x={frogX + 19} y={frogY + 3} width="2" height="2" fill="#FEF08A" />
          <rect x={frogX + 7} y={frogY - 4} width="2" height="2" fill="#FACC15" />
        </g>
      )}

      {config.glassesId === 'eyepatch' && (
        <g>
          <rect x={frogX} y={frogY + 6} width="6" height="5" fill="#1C1917" />
          <rect x={frogX - 2} y={frogY + 5} width="3" height="2" fill="#1C1917" />
          <rect x={frogX + 5} y={frogY + 7} width="7" height="2" fill="#1C1917" />
          <rect x={frogX + 12} y={frogY + 9} width="6" height="2" fill="#1C1917" />
        </g>
      )}

      {config.glassesId === 'forest_blush_freckles' && (
        <g>
          <rect x={frogX - 1} y={frogY + 9} width="2" height="2" fill="#DC2626" opacity="0.6" />
          <rect x={frogX + 2} y={frogY + 10} width="2" height="2" fill="#78350F" />
          <rect x={frogX + 14} y={frogY + 10} width="2" height="2" fill="#78350F" />
          <rect x={frogX + 16} y={frogY + 9} width="2" height="2" fill="#DC2626" opacity="0.6" />
        </g>
      )}

      {config.glassesId === 'wolf_snarl_fangs' && (
        <g>
          <rect x={frogX + 5} y={frogY + 10} width="2" height="3" fill="#FFFFFF" />
          <rect x={frogX + 9} y={frogY + 10} width="2" height="3" fill="#FFFFFF" />
        </g>
      )}

      {config.glassesId === 'wasabi_sparkle' && (
        <g>
          <rect x={frogX - 1} y={frogY + 9} width="2" height="2" fill="#84CC16" />
          <rect x={frogX + 15} y={frogY + 9} width="2" height="2" fill="#84CC16" />
          <rect x={frogX + 7} y={frogY - 3} width="2" height="2" fill="#A3E635" />
        </g>
      )}

      {config.glassesId === 'scanner_headset' && (
        <g>
          <rect x={frogX - 3} y={frogY + 6} width="3" height="6" fill="#1E293B" />
          <rect x={frogX - 1} y={frogY + 4} width="2" height="2" fill="#334155" />
          <rect x={frogX + 1} y={frogY + 2} width="2" height="2" fill="#334155" />
          <rect x={frogX + 3} y={frogY} width="3" height="2" fill="#334155" />
          <rect x={frogX - 2} y={frogY + 10} width="3" height="2" fill="#334155" />
          <rect x={frogX + 1} y={frogY + 11} width="3" height="2" fill="#334155" />
          <rect x={frogX + 3} y={frogY + 11} width="2" height="2" fill="#10B981" />
          <rect x={frogX - 3} y={frogY + 7} width="2" height="2" fill="#38BDF8" />
        </g>
      )}

      {config.glassesId === 'konbini_blush' && (
        <g>
          <rect x={frogX - 2} y={frogY + 9} width="3" height="2" fill="#FB7185" />
          <rect x={frogX + 15} y={frogY + 9} width="3" height="2" fill="#FB7185" />
          <rect x={frogX} y={frogY + 8} width="2" height="1" fill="#FDE047" />
          <rect x={frogX + 16} y={frogY + 8} width="2" height="1" fill="#FDE047" />
        </g>
      )}

      {config.glassesId === 'cyber_pixel_shades' && (
        <g>
          {/* Stepped Thug/Meme Pixel Sunglasses with Neon Reflection */}
          <rect x={frogX - 2} y={frogY + 5} width="8" height="3" fill="#09090B" />
          <rect x={frogX - 1} y={frogY + 8} width="6" height="3" fill="#09090B" />
          <rect x={frogX + 10} y={frogY + 5} width="8" height="3" fill="#09090B" />
          <rect x={frogX + 11} y={frogY + 8} width="6" height="3" fill="#09090B" />
          <rect x={frogX + 6} y={frogY + 6} width="4" height="2" fill="#09090B" />
          {/* White Stepped Specular Gleam */}
          <rect x={frogX - 1} y={frogY + 6} width="2" height="1" fill="#FFFFFF" />
          <rect x={frogX} y={frogY + 7} width="2" height="1" fill="#FFFFFF" />
          <rect x={frogX + 11} y={frogY + 6} width="2" height="1" fill="#FFFFFF" />
          <rect x={frogX + 12} y={frogY + 7} width="2" height="1" fill="#FFFFFF" />
          <rect x={frogX - 1} y={frogY + 9} width="2" height="1" fill="#22D3EE" opacity="0.8" />
          <rect x={frogX + 11} y={frogY + 9} width="2" height="1" fill="#22D3EE" opacity="0.8" />
        </g>
      )}

      {config.glassesId === 'game_over_dizzy' && (
        <g>
          {/* Pixel Dizzy Spiral Swirls */}
          <rect x={frogX} y={frogY + 5} width="6" height="6" fill="#FACC15" />
          <rect x={frogX + 1} y={frogY + 6} width="4" height="4" fill="#0F172A" />
          <rect x={frogX + 2} y={frogY + 7} width="2" height="2" fill="#EC4899" />
          <rect x={frogX + 10} y={frogY + 5} width="6" height="6" fill="#FACC15" />
          <rect x={frogX + 11} y={frogY + 6} width="4" height="4" fill="#0F172A" />
          <rect x={frogX + 12} y={frogY + 7} width="2" height="2" fill="#EC4899" />
          {soloTick % 2 === 0 ? (
            <rect x={frogX + 7} y={frogY + 3} width="2" height="2" fill="#FDE047" />
          ) : (
            <rect x={frogX + 7} y={frogY + 1} width="2" height="2" fill="#FDE047" />
          )}
        </g>
      )}

      {/* HAT LAYER */}
      {config.hatId === 'arcade_joystick_cap' && (
        <g>
          <rect x={frogX - 2} y={frogY - 4} width="20" height="7" fill="#18181B" />
          <rect x={frogX} y={frogY - 5} width="16" height="2" fill="#27272A" />
          <rect x={frogX - 5} y={frogY + 1} width="12" height="2" fill="#09090B" />
          {/* Embroidered Joystick & Button on Cap */}
          <rect x={frogX + 6} y={frogY - 3} width="1" height="3" fill="#71717A" />
          <rect x={frogX + 5} y={frogY - 4} width="3" height="2" fill="#EF4444" />
          <rect x={frogX + 10} y={frogY - 2} width="2" height="2" fill="#3B82F6" />
        </g>
      )}

      {config.hatId === 'pixel_vr_visor' && (
        <g>
          <rect x={frogX - 3} y={frogY - 3} width="22" height="9" fill="#0F172A" stroke="#334155" strokeWidth="0.5" />
          {/* Glowing Animated Cyber Visor Glass */}
          <rect x={frogX - 2} y={frogY - 1} width="20" height="5" fill="#06B6D4" />
          <rect x={frogX + 1} y={frogY} width="14" height="2" fill="#67E8F9" />
          {soloTick % 2 === 0 && <rect x={frogX + 5} y={frogY} width="6" height="2" fill="#EC4899" />}
          {/* Head Strap */}
          <rect x={frogX - 4} y={frogY} width="2" height="3" fill="#475569" />
          <rect x={frogX + 18} y={frogY} width="2" height="3" fill="#475569" />
        </g>
      )}

      {config.hatId === 'retro_gameboy_beanie' && (
        <g>
          <rect x={frogX - 2} y={frogY - 7} width="20" height="10" fill="#94A3B8" />
          <rect x={frogX} y={frogY - 8} width="16" height="2" fill="#CBD5E1" />
          <rect x={frogX - 3} y={frogY + 1} width="22" height="2" fill="#64748B" />
          {/* Handheld Mini Controls on Front */}
          <rect x={frogX + 2} y={frogY - 4} width="5" height="4" fill="#8BAC0F" stroke="#0F380F" strokeWidth="0.5" />
          <rect x={frogX + 10} y={frogY - 3} width="2" height="2" fill="#18181B" />
          <rect x={frogX + 14} y={frogY - 4} width="2" height="2" fill="#BE123C" />
          <rect x={frogX + 13} y={frogY - 2} width="2" height="2" fill="#BE123C" />
        </g>
      )}

      {config.hatId === 'red_riding_hood' && (
        <g>
          <rect x={frogX - 3} y={frogY - 4} width="22" height="16" fill="#DC2626" />
          <rect x={frogX - 1} y={frogY - 6} width="18" height="3" fill="#B91C1C" />
          <rect x={frogX + 1} y={frogY - 2} width="14" height="2" fill="#FEF2F2" />
          <rect x={frogX + 6} y={frogY + 12} width="4" height="2" fill="#991B1B" />
          <rect x={frogX + 7} y={frogY + 12} width="2" height="2" fill="#EF4444" />
        </g>
      )}

      {config.hatId === 'wolf_ears_hood' && (
        <g>
          <rect x={frogX - 2} y={frogY - 6} width="6" height="8" fill="#334155" />
          <rect x={frogX} y={frogY - 4} width="3" height="5" fill="#F472B6" />
          <rect x={frogX + 12} y={frogY - 6} width="6" height="8" fill="#334155" />
          <rect x={frogX + 13} y={frogY - 4} width="3" height="5" fill="#F472B6" />
          <rect x={frogX + 2} y={frogY - 1} width="12" height="3" fill="#475569" />
          <rect x={frogX + 6} y={frogY - 3} width="4" height="2" fill="#F1F5F9" />
        </g>
      )}

      {config.hatId === 'granny_nightcap' && (
        <g>
          <rect x={frogX - 2} y={frogY - 6} width="20" height="9" fill="#F8FAFC" />
          <rect x={frogX} y={frogY - 5} width="16" height="7" fill="#F1F5F9" />
          <rect x={frogX - 3} y={frogY + 2} width="22" height="2" fill="#FBCFE8" />
          <rect x={frogX + 7} y={frogY + 2} width="2" height="2" fill="#EC4899" />
        </g>
      )}

      {config.hatId === 'sushi_salmon' && (
        <g>
          <rect x={frogX} y={frogY - 2} width="16" height="4" fill="#FFFFFF" />
          <rect x={frogX - 2} y={frogY - 6} width="20" height="5" fill="#FB923C" />
          <rect x={frogX} y={frogY - 6} width="4" height="1" fill="#FFF7ED" />
          <rect x={frogX + 6} y={frogY - 6} width="4" height="1" fill="#FFF7ED" />
          <rect x={frogX + 12} y={frogY - 6} width="4" height="1" fill="#FFF7ED" />
          <rect x={frogX + 2} y={frogY - 4} width="4" height="1" fill="#FFF7ED" />
          <rect x={frogX + 8} y={frogY - 4} width="4" height="1" fill="#FFF7ED" />
          <rect x={frogX + 14} y={frogY - 4} width="3" height="1" fill="#FFF7ED" />
          <rect x={frogX + 7} y={frogY - 6} width="2" height="8" fill="#14532D" />
        </g>
      )}

      {config.hatId === 'sushi_maguro' && (
        <g>
          <rect x={frogX} y={frogY - 2} width="16" height="4" fill="#FFFFFF" />
          <rect x={frogX - 2} y={frogY - 6} width="20" height="5" fill="#BE123C" />
          <rect x={frogX} y={frogY - 5} width="16" height="2" fill="#E11D48" />
          <rect x={frogX + 2} y={frogY - 5} width="4" height="1" fill="#FFFFFF" opacity="0.6" />
          <rect x={frogX + 7} y={frogY - 3} width="2" height="2" fill="#84CC16" />
        </g>
      )}

      {config.hatId === 'sushi_ebi' && (
        <g>
          <rect x={frogX} y={frogY - 2} width="16" height="4" fill="#FFFFFF" />
          <rect x={frogX - 2} y={frogY - 6} width="18" height="5" fill="#EA580C" />
          <rect x={frogX + 1} y={frogY - 6} width="2" height="5" fill="#FFFFFF" />
          <rect x={frogX + 5} y={frogY - 6} width="2" height="5" fill="#FFFFFF" />
          <rect x={frogX + 9} y={frogY - 6} width="2" height="5" fill="#FFFFFF" />
          <rect x={frogX + 16} y={frogY - 6} width="5" height="4" fill="#DC2626" />
          <rect x={frogX + 16} y={frogY - 2} width="5" height="3" fill="#EA580C" />
        </g>
      )}

      {config.hatId === 'sushi_chef_headband' && (
        <g>
          <rect x={frogX - 2} y={frogY + 2} width="20" height="3" fill="#FFFFFF" />
          <rect x={frogX - 1} y={frogY + 2} width="3" height="3" fill="#1E3A8A" />
          <rect x={frogX + 4} y={frogY + 2} width="3" height="3" fill="#1E3A8A" />
          <rect x={frogX + 9} y={frogY + 2} width="3" height="3" fill="#1E3A8A" />
          <rect x={frogX + 14} y={frogY + 2} width="3" height="3" fill="#1E3A8A" />
          <rect x={frogX + 6} y={frogY + 2} width="4" height="3" fill="#DC2626" />
        </g>
      )}

      {config.hatId === 'konbini_staff_visor' && (
        <g>
          <rect x={frogX - 3} y={frogY + 1} width="22" height="3" fill="#10B981" />
          <rect x={frogX - 1} y={frogY + 1} width="18" height="1" fill="#34D399" />
          <rect x={frogX - 3} y={frogY - 1} width="22" height="2" fill="#059669" />
          <rect x={frogX + 7} y={frogY + 1} width="2" height="2" fill="#FFFFFF" />
          <rect x={frogX + 8} y={frogY + 2} width="1" height="1" fill="#EA580C" />
        </g>
      )}

      {config.hatId === 'shopper_bucket_hat' && (
        <g>
          <rect x={frogX - 1} y={frogY - 6} width="18" height="7" fill="#7C3AED" />
          <rect x={frogX + 1} y={frogY - 5} width="14" height="2" fill="#8B5CF6" />
          <rect x={frogX - 4} y={frogY + 1} width="24" height="2" fill="#6D28D9" />
          <rect x={frogX + 7} y={frogY - 3} width="2" height="2" fill="#FDE047" />
        </g>
      )}

      {config.hatId === 'onigiri_headband' && (
        <g>
          <rect x={frogX - 2} y={frogY + 2} width="20" height="1.5" fill="#18181B" />
          <rect x={frogX + 6} y={frogY - 8} width="4" height="2" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
          <rect x={frogX + 5} y={frogY - 6} width="6" height="3" fill="#FFFFFF" />
          <rect x={frogX + 4} y={frogY - 3} width="8" height="3" fill="#FFFFFF" />
          <rect x={frogX + 6} y={frogY - 3} width="4" height="2" fill="#18181B" />
          <rect x={frogX + 7} y={frogY - 5} width="2" height="2" fill="#DC2626" />
        </g>
      )}

      {config.hatId === 'lotus' && (
        <g>
          <rect x={frogX + 7} y={frogY - 4} width="2" height="2" fill="#1E3A14" />
          <rect x={frogX + 2} y={frogY - 2} width="12" height="2" fill="#4D7C0F" />
          <rect x={frogX - 1} y={frogY} width="18" height="2" fill="#65A30D" />
          <rect x={frogX - 2} y={frogY + 1} width="20" height="1" fill="#1E3A14" />
          <rect x={frogX + 12} y={frogY - 1} width="1" height="1" fill="#FFFFFF" />
        </g>
      )}

      {config.hatId === 'straw' && (
        <g>
          <rect x={frogX + 5} y={frogY - 5} width="6" height="4" fill="#FDE68A" />
          <rect x={frogX + 2} y={frogY - 2} width="12" height="4" fill="#FDE68A" />
          <rect x={frogX - 4} y={frogY + 2} width="24" height="2" fill="#D97706" />
          <rect x={frogX + 4} y={frogY} width="8" height="1" fill="#92400E" />
        </g>
      )}

      {config.hatId === 'sakura' && (
        <g>
          <rect x={frogX} y={frogY - 1} width="4" height="3" fill="#F472B6" />
          <rect x={frogX + 6} y={frogY - 2} width="4" height="3" fill="#FBCFE8" />
          <rect x={frogX + 12} y={frogY - 1} width="4" height="3" fill="#F472B6" />
          <rect x={frogX + 7} y={frogY - 1} width="2" height="1" fill="#FDE047" />
        </g>
      )}

      {config.hatId === 'wizard' && (
        <g>
          <rect x={frogX + 6} y={frogY - 10} width="4" height="5" fill="#1E1B4B" />
          <rect x={frogX + 4} y={frogY - 5} width="8" height="4" fill="#1E1B4B" />
          <rect x={frogX + 1} y={frogY - 1} width="14" height="3" fill="#1E1B4B" />
          <rect x={frogX - 2} y={frogY + 2} width="20" height="2" fill="#4338CA" />
          <rect x={frogX + 7} y={frogY - 4} width="2" height="2" fill="#FACC15" />
        </g>
      )}

      {config.hatId === 'bandana' && (
        <g>
          <rect x={frogX - 1} y={frogY + 4} width="18" height="3" fill="#DC2626" />
          <rect x={frogX + 14} y={frogY + 6} width="3" height="4" fill="#B91C1C" />
        </g>
      )}

      {config.hatId === 'beanie' && (
        <g>
          <rect x={frogX + 6} y={frogY - 6} width="4" height="3" fill="#FFFFFF" />
          <rect x={frogX} y={frogY - 3} width="16" height="5" fill="#DC2626" />
          <rect x={frogX - 1} y={frogY + 1} width="18" height="3" fill="#F87171" />
        </g>
      )}

      {config.hatId === 'chef' && (
        <g>
          <rect x={frogX + 1} y={frogY - 10} width="14" height="10" fill="#FFFFFF" />
          <rect x={frogX} y={frogY - 8} width="16" height="8" fill="#FFFFFF" />
          <rect x={frogX - 1} y={frogY} width="18" height="2" fill="#E2E8F0" />
        </g>
      )}

      {config.hatId === 'crown' && (
        <g>
          <rect x={frogX} y={frogY - 3} width="4" height="5" fill="#FACC15" />
          <rect x={frogX + 6} y={frogY - 5} width="4" height="7" fill="#FACC15" />
          <rect x={frogX + 12} y={frogY - 3} width="4" height="5" fill="#FACC15" />
          <rect x={frogX} y={frogY + 1} width="16" height="2" fill="#EAB308" />
          <rect x={frogX + 7} y={frogY} width="2" height="2" fill="#DC2626" />
        </g>
      )}

      {config.hatId === 'beret' && (
        <g>
          <rect x={frogX - 2} y={frogY - 2} width="20" height="5" fill="#78350F" />
          <rect x={frogX + 7} y={frogY - 4} width="2" height="2" fill="#451A03" />
        </g>
      )}

      {config.hatId === 'flower' && (
        <g>
          <rect x={frogX + 14} y={frogY} width="5" height="5" fill="#FEF08A" />
          <rect x={frogX + 15} y={frogY + 1} width="3" height="3" fill="#EA580C" />
        </g>
      )}

      {config.hatId === 'headphone' && (
        <g>
          <rect x={frogX - 1} y={frogY - 3} width="18" height="2" fill="#18181B" />
          <rect x={frogX - 3} y={frogY + 3} width="3" height="7" fill="#3B82F6" />
          <rect x={frogX + 16} y={frogY + 3} width="3" height="7" fill="#3B82F6" />
        </g>
      )}

      {config.hatId === 'detective' && (
        <g>
          <rect x={frogX - 2} y={frogY - 1} width="20" height="4" fill="#78350F" />
          <rect x={frogX + 2} y={frogY - 4} width="12" height="4" fill="#92400E" />
          <rect x={frogX - 3} y={frogY + 1} width="22" height="1.5" fill="#451A03" />
        </g>
      )}

      {config.hatId === 'samurai' && (
        <g>
          <rect x={frogX} y={frogY - 2} width="16" height="4" fill="#18181B" />
          <rect x={frogX + 6} y={frogY - 7} width="4" height="6" fill="#CA8A04" />
          <rect x={frogX + 2} y={frogY - 4} width="12" height="3" fill="#CA8A04" />
          <rect x={frogX + 7} y={frogY - 3} width="2" height="2" fill="#DC2626" />
        </g>
      )}

      {/* PROPS / HANDHELD ITEM */}
      {config.activityId === 'tea' && (
        <g>
          <rect x={frogX + 5} y={frogY + 12} width="6" height="6" fill="#BBF7D0" />
          <rect x={frogX + 6} y={frogY + 11} width="4" height="2" fill="#15803D" />
          <rect x={frogX + 7} y={frogY + 8} width="2" height="2" fill="#FFFFFF" opacity="0.8" />
        </g>
      )}

      {config.activityId === 'coffee' && (
        <g>
          <rect x={frogX + 5} y={frogY + 12} width="6" height="6" fill="#FFFFFF" />
          <rect x={frogX + 6} y={frogY + 11} width="4" height="2" fill="#78350F" />
          <rect x={frogX + 10} y={frogY + 13} width="2" height="3" fill="#E2E8F0" />
        </g>
      )}

      {config.activityId === 'boba' && (
        <g>
          <rect x={frogX + 5} y={frogY + 12} width="6" height="7" fill="#FED7AA" />
          <rect x={frogX + 7} y={frogY + 9} width="2" height="4" fill="#F43F5E" />
          <rect x={frogX + 6} y={frogY + 17} width="1" height="1" fill="#18181B" />
          <rect x={frogX + 8} y={frogY + 17} width="1" height="1" fill="#18181B" />
        </g>
      )}

      {config.activityId === 'reading' && (
        <g>
          <rect x={frogX + 2} y={frogY + 12} width="12" height="8" fill="#FDF2F8" />
          <rect x={frogX + 1} y={frogY + 12} width="1" height="8" fill="#DB2777" />
          <rect x={frogX + 14} y={frogY + 12} width="1" height="8" fill="#DB2777" />
          <rect x={frogX + 7} y={frogY + 12} width="2" height="8" fill="#DB2777" />
        </g>
      )}

      {config.activityId === 'eating' && (
        <g>
          <rect x={frogX + 6} y={frogY + 10} width="4" height="2" fill="#FFFFFF" />
          <rect x={frogX + 5} y={frogY + 12} width="6" height="2" fill="#FFFFFF" />
          <rect x={frogX + 4} y={frogY + 14} width="8" height="3" fill="#FFFFFF" />
          <rect x={frogX + 6} y={frogY + 14} width="4" height="2" fill="#18181B" />
        </g>
      )}

      {config.activityId === 'guitar' && (
        <g>
          <rect x={frogX + 6} y={frogY + 12} width="8" height="8" fill="#D97706" />
          <rect x={frogX + 9} y={frogY + 14} width="2" height="3" fill="#451A03" />
          <rect x={frogX + 13} y={frogY + 8} width="6" height="3" fill="#B45309" />
        </g>
      )}

      {config.activityId === 'painting' && (
        <g>
          <rect x={frogX + 5} y={frogY + 13} width="10" height="6" fill="#D97706" />
          <rect x={frogX + 7} y={frogY + 14} width="2" height="2" fill="#EF4444" />
          <rect x={frogX + 9} y={frogY + 13} width="2" height="2" fill="#3B82F6" />
          <rect x={frogX + 11} y={frogY + 14} width="2" height="2" fill="#EAB308" />
        </g>
      )}

      {config.activityId === 'camera' && (
        <g>
          <rect x={frogX + 4} y={frogY + 13} width="8" height="6" fill="#78350F" />
          <rect x={frogX + 6} y={frogY + 14} width="4" height="4" fill="#1E293B" />
        </g>
      )}

      {config.activityId === 'wand' && (
        <g>
          <rect x={frogX + 12} y={frogY + 15} width="2" height="2" fill="#CA8A04" />
          <rect x={frogX + 14} y={frogY + 13} width="2" height="2" fill="#CA8A04" />
          <rect x={frogX + 16} y={frogY + 11} width="2" height="2" fill="#CA8A04" />
          <rect x={frogX + 17} y={frogY + 6} width="4" height="4" fill="#FACC15" />
          <rect x={frogX + 18} y={frogY + 5} width="2" height="6" fill="#FEF08A" />
        </g>
      )}

      {config.activityId === 'fishing' && (
        <g>
          <rect x={frogX + 10} y={frogY + 16} width="2" height="2" fill="#78350F" />
          <rect x={frogX + 12} y={frogY + 13} width="2" height="3" fill="#78350F" />
          <rect x={frogX + 15} y={frogY + 10} width="2" height="3" fill="#78350F" />
          <rect x={frogX + 18} y={frogY + 7} width="2" height="3" fill="#78350F" />
          <rect x={frogX + 21} y={frogY + 4} width="2" height="3" fill="#78350F" />
          <rect x={frogX + 23} y={frogY + 2} width="2" height="2" fill="#78350F" />
          <rect x={frogX + 24} y={frogY + 3} width="1" height="14" fill="#94A3B8" />
          <rect x={frogX + 23} y={frogY + 17} width="3" height="3" fill="#EF4444" />
        </g>
      )}

      {config.activityId === 'picnic_basket' && (
        <g>
          <rect x={frogX + 5} y={frogY + 13} width="10" height="7" fill="#D97706" />
          <rect x={frogX + 6} y={frogY + 12} width="4" height="2" fill="#EF4444" />
          <rect x={frogX + 5} y={frogY + 12} width="2" height="2" fill="#FFFFFF" />
        </g>
      )}

      {config.activityId === 'woodcutter_axe' && (
        <g>
          <rect x={frogX + 11} y={frogY + 16} width="2" height="3" fill="#78350F" />
          <rect x={frogX + 13} y={frogY + 13} width="2" height="3" fill="#78350F" />
          <rect x={frogX + 15} y={frogY + 9} width="2" height="4" fill="#78350F" />
          <rect x={frogX + 17} y={frogY + 5} width="2" height="4" fill="#78350F" />
          <rect x={frogX + 17} y={frogY + 4} width="5" height="5" fill="#94A3B8" />
        </g>
      )}

      {(config.activityId === 'sushi_platter' || config.activityId === 'eating_sushi') && (
        <g>
          <rect x={frogX + 4} y={frogY + 14} width="12" height="5" fill="#D97706" />
          <rect x={frogX + 5} y={frogY + 13} width="4" height="2" fill="#FB923C" />
          <rect x={frogX + 10} y={frogY + 13} width="4" height="2" fill="#BE123C" />
        </g>
      )}

      {(config.activityId === 'tea_whisk' || config.activityId === 'sushi_crafting') && (
        <g>
          <rect x={frogX + 4} y={frogY + 13} width="8" height="6" fill="#1E293B" />
          <rect x={frogX + 5} y={frogY + 14} width="6" height="3" fill="#84CC16" />
          <rect x={frogX + 11} y={frogY + 10} width="2" height="2" fill="#FDE68A" />
          <rect x={frogX + 9} y={frogY + 12} width="2" height="2" fill="#FDE68A" />
        </g>
      )}

      {config.activityId === 'konbini_scanner' && (
        <g>
          <rect x={frogX + 10} y={frogY + 13} width="6" height="4" fill="#1E293B" />
          <rect x={frogX + 14} y={frogY + 11} width="3" height="6" fill="#0F172A" />
          <rect x={frogX + 16} y={frogY + 14} width="10" height="1" fill="#EF4444" />
          <rect x={frogX + 25} y={frogY + 13} width="2" height="2" fill="#F87171" />
        </g>
      )}

      {config.activityId === 'eating_onigiri' && (
        <g>
          <rect x={frogX + 6} y={frogY + 11} width="4" height="2" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
          <rect x={frogX + 5} y={frogY + 13} width="6" height="2" fill="#FFFFFF" />
          <rect x={frogX + 4} y={frogY + 15} width="8" height="3" fill="#FFFFFF" />
          <rect x={frogX + 6} y={frogY + 15} width="4" height="2" fill="#18181B" />
          <rect x={frogX + 7} y={frogY + 13} width="2" height="2" fill="#DC2626" />
        </g>
      )}

      {config.activityId === 'holding_konbini_bag' && (
        <g>
          <rect x={frogX + 8} y={frogY + 12} width="10" height="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.5" />
          <rect x={frogX + 9} y={frogY + 16} width="8" height="2" fill="#10B981" />
          <rect x={frogX + 9} y={frogY + 18} width="8" height="1" fill="#EA580C" />
          <rect x={frogX + 10} y={frogY + 10} width="3" height="4" fill="#FACC15" />
          <rect x={frogX + 13} y={frogY + 11} width="2" height="3" fill="#EF4444" />
        </g>
      )}

      {config.activityId === 'arcade_gamepad' && (
        <g>
          {/* Turbo 8-Bit Game Controller */}
          <rect x={frogX + 4} y={frogY + 12} width="14" height="8" fill="#18181B" stroke="#3F3F46" strokeWidth="0.5" />
          <rect x={frogX + 5} y={frogY + 13} width="12" height="6" fill="#27272A" />
          {/* Red D-Pad */}
          <rect x={frogX + 6} y={frogY + 14} width="3" height="1" fill="#DC2626" />
          <rect x={frogX + 7} y={frogY + 13} width="1" height="3" fill="#DC2626" />
          {/* AB Action Buttons */}
          <rect x={frogX + 13} y={frogY + 14} width="2" height="2" fill="#EF4444" />
          <rect x={frogX + 11} y={frogY + 16} width="2" height="2" fill="#FACC15" />
          {/* Controller Cable */}
          <rect x={frogX + 10} y={frogY + 10} width="1" height="2" fill="#71717A" />
        </g>
      )}

      {config.activityId === 'claw_machine_prize' && (
        <g>
          {/* Big Hugged UFO Crane Frog Plush */}
          <rect x={frogX + 3} y={frogY + 11} width="12" height="10" fill="#4ADE80" stroke="#15803D" strokeWidth="0.5" />
          <rect x={frogX + 5} y={frogY + 14} width="8" height="5" fill="#FEF08A" />
          {/* Big Plush Eyes */}
          <rect x={frogX + 4} y={frogY + 10} width="3" height="3" fill="#15803D" />
          <rect x={frogX + 11} y={frogY + 10} width="3" height="3" fill="#15803D" />
          <rect x={frogX + 5} y={frogY + 11} width="1" height="1" fill="#FFFFFF" />
          <rect x={frogX + 12} y={frogY + 11} width="1" height="1" fill="#FFFFFF" />
          {/* Heart Badge on Chest */}
          <rect x={frogX + 8} y={frogY + 15} width="2" height="2" fill="#EC4899" />
        </g>
      )}

      {config.activityId === 'handheld_gaming' && (
        <g>
          {/* Retro Pocket Handheld Console */}
          <rect x={frogX + 6} y={frogY + 11} width="10" height="11" fill="#94A3B8" stroke="#475569" strokeWidth="0.5" />
          <rect x={frogX + 7} y={frogY + 12} width="8" height="5" fill="#8BAC0F" stroke="#0F380F" strokeWidth="0.5" />
          {/* Pixel Frog character on handheld screen */}
          <rect x={frogX + 10} y={frogY + 14} width="2" height="2" fill="#0F380F" />
          {/* D-Pad & Red Buttons */}
          <rect x={frogX + 7} y={frogY + 18} width="2" height="2" fill="#1E293B" />
          <rect x={frogX + 12} y={frogY + 18} width="2" height="2" fill="#BE123C" />
          <rect x={frogX + 14} y={frogY + 17} width="1.5" height="1.5" fill="#BE123C" />
        </g>
      )}
    </svg>
  );
};

interface PixelFrogSceneProps {
  config: PixelSceneConfig;
  onUpdateConfig?: (patch: Partial<PixelSceneConfig>) => void;
  currentMoodValue?: number | null;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
  className?: string;
  showCustomizerButton?: boolean;
  showInfoBar?: boolean;
  size?: 'compact' | 'medium' | 'large';
  onOpenShop?: () => void;
  fullscreen?: boolean;
  isZoomed?: boolean;
  onToggleZoom?: () => void;
  onTapStage?: (screenX: number, screenY: number) => void;
}

export const PixelFrogScene: React.FC<PixelFrogSceneProps> = ({
  config,
  onUpdateConfig,
  currentMoodValue,
  soundEnabled = true,
  hapticEnabled = true,
  className = '',
  showCustomizerButton = true,
  showInfoBar,
  size = 'medium',
  onOpenShop,
  fullscreen = false,
  isZoomed = false,
  onToggleZoom,
  onTapStage,
}) => {
  // Animation frame ticker for pixel effects
  const [animTick, setAnimTick] = useState(0);

  // -------------------------------------------------------------
  // FREE PAN & PINCH-TO-ZOOM GESTURE ENGINE (STRICT BACKGROUND BOUNDS)
  // -------------------------------------------------------------
  const [zoomScale, setZoomScale] = useState<number>(isZoomed ? 1.85 : 1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const dragStartRef = React.useRef<{ x: number; y: number; panX: number; panY: number; time: number }>({
    x: 0,
    y: 0,
    panX: 0,
    panY: 0,
    time: 0,
  });
  const lastTapTimeRef = React.useRef<number>(0);
  const touchDistanceRef = React.useRef<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Helper to clamp pan offset strictly within the scaled background image boundaries
  const clampPanToBounds = (x: number, y: number, scale: number) => {
    if (scale <= 1.001) return { x: 0, y: 0 };
    const container = containerRef.current;
    const width = container ? container.clientWidth : 400;
    const height = container ? container.clientHeight : 600;
    // Exactly half the overflow dimensions
    const maxPanX = Math.max(0, (width * (scale - 1)) / 2);
    const maxPanY = Math.max(0, (height * (scale - 1)) / 2);
    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, y)),
    };
  };

  // Sync zoomScale if isZoomed changes from parent
  useEffect(() => {
    if (isZoomed) {
      setZoomScale((prev) => {
        const next = prev < 1.35 ? 1.85 : prev;
        setPanOffset((curr) => clampPanToBounds(curr.x, curr.y, next));
        return next;
      });
    } else {
      setZoomScale(1.0);
      setPanOffset({ x: 0, y: 0 });
    }
  }, [isZoomed]);

  // -------------------------------------------------------------
  // AUTONOMOUS BACKGROUND FROG ACTION & ROAMING ENGINE (ALL 13 SCENES)
  // -------------------------------------------------------------
  const [roamEnabled] = useState(true);
  const [frogPos, setFrogPos] = useState<{ x: number; y: number }>({ x: 72, y: 56 });
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(null);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [isHopping, setIsHopping] = useState(false);
  const [hopProgress, setHopProgress] = useState(0);
  const [actionState, setActionState] = useState<'idle' | 'inspect' | 'wave' | 'happy_jump'>('idle');
  const [actionBubble, setActionBubble] = useState<string | null>(null);

  // Thematic walkable floor & prop destinations for all 13 scenes
  const getSceneDestinations = (sceneId?: string): { x: number; y: number }[] => {
    switch (sceneId) {
      case 'retro_arcade':
        return [
          { x: 34, y: 58 }, // CRT Arcade Cabinet 1
          { x: 72, y: 56 }, // Central Dance / Rhythm Stage
          { x: 116, y: 58 }, // UFO Claw Crane Machine
          { x: 50, y: 72 }, // Checkerboard Floor
          { x: 92, y: 70 }, // Coin Exchange Station
          { x: 80, y: 60 }, // High Score Leaderboard
        ];
      case 'convenience_store':
        return [
          { x: 36, y: 58 }, // Drinks Cooler
          { x: 72, y: 56 }, // Register Counter
          { x: 118, y: 58 }, // Snack Shelves
          { x: 50, y: 72 }, // Shopping Basket
          { x: 92, y: 70 }, // Front Checkout Aisle
          { x: 80, y: 60 }, // Onigiri Warmer
        ];
      case 'red_riding_forest':
        return [
          { x: 32, y: 68 }, // Flower Meadow
          { x: 58, y: 60 }, // Cottage Porch
          { x: 82, y: 72 }, // Grassy Trail
          { x: 112, y: 64 }, // Mushroom Trunk
          { x: 130, y: 70 }, // Wild Berry Bush
        ];
      case 'sauna_bathhouse':
        return [
          { x: 38, y: 62 }, // Wooden Tub Ledge
          { x: 70, y: 58 }, // Stone Floor Hearth
          { x: 104, y: 56 }, // Cedar Sauna Bench
          { x: 52, y: 72 }, // Towel Mat
          { x: 122, y: 70 }, // Steaming Bucket
        ];
      case 'sushi_bar':
        return [
          { x: 36, y: 58 }, // Customer Stool
          { x: 72, y: 56 }, // Itamae Sushi Board
          { x: 108, y: 58 }, // Matcha Cup Corner
          { x: 54, y: 72 }, // Floor Mat
          { x: 90, y: 68 }, // Wooden Geta Table
        ];
      case 'zen_pond':
        return [
          { x: 35, y: 62 }, // Giant Lily Pad
          { x: 72, y: 58 }, // Pond Stepping Stone
          { x: 110, y: 64 }, // Stone Lantern Base
          { x: 56, y: 74 }, // Water Edge
          { x: 95, y: 68 }, // Reed Shore
        ];
      case 'treehouse':
        return [
          { x: 38, y: 60 }, // Wooden Balcony
          { x: 72, y: 56 }, // Cozy Tree Table
          { x: 108, y: 62 }, // Rope Ladder Top
          { x: 54, y: 72 }, // Plank Floor
          { x: 88, y: 70 }, // Lantern Perch
        ];
      case 'sakura_shrine':
        return [
          { x: 34, y: 64 }, // Petal Lawn
          { x: 72, y: 58 }, // Torii Gate Pathway
          { x: 112, y: 62 }, // Shrine Bell Step
          { x: 58, y: 72 }, // Stone Lantern
          { x: 92, y: 68 }, // Cherry Blossom Shade
        ];
      case 'rainy_meadow':
        return [
          { x: 36, y: 64 }, // Mushroom Cap
          { x: 70, y: 58 }, // Rain Puddle
          { x: 108, y: 62 }, // Clover Patch
          { x: 52, y: 72 }, // Meadow Grass
          { x: 92, y: 68 }, // Snail Rock
        ];
      case 'onsen':
        return [
          { x: 36, y: 62 }, // Hot Spring Edge
          { x: 72, y: 58 }, // Steaming Stone
          { x: 110, y: 60 }, // Bamboo Spout
          { x: 54, y: 72 }, // Cedar Deck
          { x: 90, y: 68 }, // Bath Towel Bench
        ];
      case 'night_camp':
        return [
          { x: 38, y: 62 }, // Campfire Glow
          { x: 72, y: 58 }, // Log Seat
          { x: 110, y: 64 }, // Tent Doorway
          { x: 56, y: 72 }, // Picnic Blanket
          { x: 88, y: 68 }, // Starry Clearing
        ];
      case 'tearoom':
        return [
          { x: 38, y: 62 }, // Tatami Corner
          { x: 72, y: 58 }, // Chasen Tea Table
          { x: 108, y: 60 }, // Bonsai Stand
          { x: 54, y: 72 }, // Zabuton Cushion
          { x: 92, y: 68 }, // Tokonoma Step
        ];
      case 'cloud_palace':
        return [
          { x: 36, y: 62 }, // Pastel Cloud Cushion
          { x: 72, y: 56 }, // Star Dais
          { x: 112, y: 62 }, // Rainbow Cloud Step
          { x: 54, y: 72 }, // Fluffy Pillow
          { x: 90, y: 68 }, // Sky Platform
        ];
      case 'bamboo_grove':
        return [
          { x: 36, y: 64 }, // Bamboo Shoot Patch
          { x: 72, y: 58 }, // Mossy Path
          { x: 112, y: 62 }, // Stone Lantern Walk
          { x: 52, y: 72 }, // Green Bamboo Grove
          { x: 90, y: 68 }, // Creek Crossing
        ];
      default:
        return [
          { x: 35, y: 62 },
          { x: 72, y: 56 },
          { x: 110, y: 64 },
          { x: 56, y: 72 },
          { x: 88, y: 68 },
        ];
    }
  };

  const getSceneBubbles = (sceneId?: string): string[] => {
    switch (sceneId) {
      case 'retro_arcade':
        return ['★', '♥', '⚡', '✦', '♪', '!'];
      case 'convenience_store':
        return ['♪', '♥', '★', '♫', '✦', '!'];
      case 'red_riding_forest':
        return ['✿', '♥', '★', '❀', '✦', '♪'];
      case 'sauna_bathhouse':
        return ['♨', '♥', '✦', '♪', '~', '★'];
      case 'sushi_bar':
        return ['♪', '♥', '★', '♫', '✦', '!'];
      case 'sakura_shrine':
        return ['✿', '♥', '❀', '✦', '★', '♪'];
      case 'onsen':
        return ['♨', '♥', '✦', '♪', '~', '★'];
      case 'tearoom':
        return ['✿', '♥', '♪', '✦', '★', '❀'];
      case 'night_camp':
        return ['★', '♥', '✦', '♪', '✧', '♫'];
      case 'cloud_palace':
        return ['★', '♥', '✦', '✧', '♪', '✿'];
      case 'bamboo_grove':
        return ['✿', '♥', '♪', '✦', '❀', '★'];
      case 'rainy_meadow':
        return ['♥', '♪', '✦', '✿', '★', '♫'];
      default:
        return ['♪', '♥', '★', '✿', '✦', '♫'];
    }
  };

  // Frog hopping motion controller
  useEffect(() => {
    if (!targetPos) return;

    const startX = frogPos.x;
    const startY = frogPos.y;
    const destX = targetPos.x;
    const destY = targetPos.y;
    const dist = Math.hypot(destX - startX, destY - startY);

    if (dist < 1.5) {
      setFrogPos(targetPos);
      setTargetPos(null);
      setIsHopping(false);
      setHopProgress(0);
      return;
    }

    setFacing(destX < startX ? 'left' : 'right');
    setIsHopping(true);

    const hopDuration = Math.min(600, Math.max(300, dist * 14));
    const startTime = performance.now();

    let animationFrameId: number;
    const animateHop = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / hopDuration);
      setHopProgress(progress);

      const currentX = startX + (destX - startX) * progress;
      const currentY = startY + (destY - startY) * progress;
      setFrogPos({ x: currentX, y: currentY });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateHop);
      } else {
        setIsHopping(false);
        setHopProgress(0);
        setFrogPos({ x: destX, y: destY });
        setTargetPos(null);

        // Pick a cute post-arrival action
        const postActions: ('idle' | 'inspect' | 'wave' | 'happy_jump')[] = ['inspect', 'wave', 'happy_jump', 'idle'];
        const chosen = postActions[Math.floor(Math.random() * postActions.length)];
        setActionState(chosen);

        const bubbles = getSceneBubbles(config.sceneId);
        const chosenBubble = bubbles[Math.floor(Math.random() * bubbles.length)];
        setActionBubble(chosenBubble);

        setTimeout(() => {
          setActionBubble(null);
          setActionState('idle');
        }, 2000);
      }
    };

    animationFrameId = requestAnimationFrame(animateHop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetPos, frogPos.x, frogPos.y, config.sceneId]);

  // Autonomous Roaming AI for all scenes
  useEffect(() => {
    if (!roamEnabled || isHopping || targetPos) return;

    const interval = setInterval(() => {
      const roll = Math.random();
      if (roll < 0.7) {
        const safeDestinations = getSceneDestinations(config.sceneId);
        const candidates = safeDestinations.filter(
          (d) => Math.hypot(d.x - frogPos.x, d.y - frogPos.y) > 10
        );
        const dest = candidates[Math.floor(Math.random() * candidates.length)] || {
          x: 40 + Math.random() * 80,
          y: 56 + Math.random() * 18,
        };

        if (soundEnabled && Math.random() < 0.3) soundEngine.playTapSound();
        setTargetPos(dest);
      } else {
        setActionState('happy_jump');
        setActionBubble('✨');
        setTimeout(() => {
          setActionBubble(null);
          setActionState('idle');
        }, 1600);
      }
    }, 5000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, [roamEnabled, isHopping, targetPos, frogPos.x, frogPos.y, config.sceneId, soundEnabled]);

  // Pointer Down (Mouse or single touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsPointerDown(true);
    setHasMoved(false);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: panOffset.x,
      panY: panOffset.y,
      time: Date.now(),
    };
  };

  // Pointer Move (Drag to pan strictly within background dimensions)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.hypot(dx, dy) > 4) {
      setHasMoved(true);
      const targetPanX = dragStartRef.current.panX + dx;
      const targetPanY = dragStartRef.current.panY + dy;
      const clamped = clampPanToBounds(targetPanX, targetPanY, zoomScale);
      setPanOffset(clamped);
    }
  };

  // Pointer Up (Tap to call frog / Double-tap to zoom or reset)
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown) return;
    setIsPointerDown(false);

    const now = Date.now();
    const isQuickTap = !hasMoved && (now - dragStartRef.current.time < 320);

    if (isQuickTap) {
      const timeSinceLastTap = now - lastTapTimeRef.current;
      lastTapTimeRef.current = now;

      // Double-Tap detected: Zoom in or reset to 100%
      if (timeSinceLastTap < 300) {
        if (soundEnabled) soundEngine.playTapSound();
        if (hapticEnabled) triggerHaptic();

        if (zoomScale > 1.2) {
          // Reset zoom
          setZoomScale(1.0);
          setPanOffset({ x: 0, y: 0 });
        } else {
          // Zoom in smoothly towards center
          const targetZoom = 2.2;
          setZoomScale(targetZoom);
          setPanOffset((prev) => clampPanToBounds(prev.x, prev.y, targetZoom));
        }
        return;
      }

      // Single Tap: Call frog to point on stage
      if (soundEnabled) soundEngine.playTapSound();
      if (hapticEnabled) triggerHaptic();

      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const svgW = 160;
        const svgH = fullscreen ? (rect.height / rect.width) * 160 : 100;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const normalizedX = (clickX - centerX - panOffset.x) / zoomScale + centerX;
        const normalizedY = (clickY - centerY - panOffset.y) / zoomScale + centerY;

        const targetSvgX = Math.max(24, Math.min(136, (normalizedX / rect.width) * svgW));
        const targetSvgY = Math.max(54, Math.min(84, (normalizedY / rect.height) * svgH));

        setTargetPos({ x: targetSvgX, y: targetSvgY });
      }

      if (onTapStage) {
        onTapStage(e.clientX, e.clientY);
      }
    }
  };

  // Multi-touch pinch-to-zoom (strictly clamped)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      touchDistanceRef.current = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const ratio = dist / touchDistanceRef.current;

      setZoomScale((prev) => {
        const next = Math.min(3.5, Math.max(1.0, prev * ratio));
        setPanOffset((curr) => clampPanToBounds(curr.x, curr.y, next));
        return next;
      });
      touchDistanceRef.current = dist;
    }
  };

  const handleTouchEnd = () => {
    touchDistanceRef.current = null;
  };

  // Mouse wheel zoom (strictly clamped within background dimensions)
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    setZoomScale((prev) => {
      const delta = -e.deltaY * 0.0018;
      const next = Math.min(3.5, Math.max(1.0, prev + delta));
      setPanOffset((curr) => clampPanToBounds(curr.x, curr.y, next));
      return next;
    });
  };

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

    if (onUpdateConfig) {
      onUpdateConfig({
        sceneId: randomScene,
        activityId: randomActivity,
        hatId: randomHat,
        companionId: randomCompanion,
        weatherId: randomWeather,
      });
    }

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#75A65A', '#EAB308', '#EC4899', '#38BDF8', '#D98236'],
    });
  };

  // -------------------------------------------------------------
  // PIXEL ART RENDERERS (Crisp SVG 160x100 Grid - Cozy Minimal Style)
  // -------------------------------------------------------------

  // Sky & Lighting colors based on weather
  const getSkyGradient = () => {
    switch (effectiveWeather) {
      case 'starry':
        return {
          top: '#0b132b',
          mid: '#1c2541',
          bottom: '#223052',
          ambient: 'rgba(11, 19, 43, 0.4)',
        };
      case 'golden':
        return {
          top: '#431407',
          mid: '#7c2d12',
          bottom: '#d97706',
          ambient: 'rgba(217, 119, 6, 0.15)',
        };
      case 'rainy':
        return {
          top: '#1e293b',
          mid: '#334155',
          bottom: '#475569',
          ambient: 'rgba(30, 41, 59, 0.3)',
        };
      case 'petals':
        return {
          top: '#fdf2f8',
          mid: '#fce7f3',
          bottom: '#fbcfe8',
          ambient: 'rgba(244, 114, 182, 0.12)',
        };
      case 'sunny':
      default:
        return {
          top: '#7dd3fc',
          mid: '#bae6fd',
          bottom: '#e0f2fe',
          ambient: 'rgba(125, 211, 252, 0.1)',
        };
    }
  };

  const sky = getSkyGradient();
  const viewBoxHeight = fullscreen ? 280 : 100;
  const yShift = fullscreen ? 48 : 0;

  // Ground base color to fill lower canvas in fullscreen
  const getGroundColor = () => {
    switch (config.sceneId) {
      case 'sauna_bathhouse':
        return '#dfc09c';
      case 'treehouse':
        return '#784a28';
      case 'sakura_shrine':
        return '#475569';
      case 'rainy_meadow':
        return '#166534';
      case 'onsen':
        return '#3f3f46';
      case 'night_camp':
        return '#0f172a';
      case 'tearoom':
        return '#d9f99d';
      case 'cloud_palace':
        return '#ede9fe';
      case 'bamboo_grove':
        return '#14532d';
      case 'zen_pond':
      default:
        return '#0c4a6e';
    }
  };

  const svgContent = (
    <>
      <defs>
        <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky.top} />
          {sky.mid && <stop offset="60%" stopColor={sky.mid} />}
          <stop offset="100%" stopColor={sky.bottom} />
        </linearGradient>
      </defs>

      {/* 1. SKY BACKGROUND (Cozy Minimal Gradient) */}
      <rect x="0" y="0" width="160" height={viewBoxHeight} fill="url(#skyGradient)" />

      {/* Fullscreen Ground Extension */}
      {fullscreen && (
        <rect x="0" y="210" width="160" height="50" fill={getGroundColor()} />
      )}

      {/* Weather Elements: Sun, Moon, Clouds, Stars (Minimalist & Clean) */}
      {effectiveWeather === 'sunny' && (
        <g transform={fullscreen ? 'translate(0, 20)' : undefined}>
          {/* Minimalist Warm Sun */}
          <rect x="134" y="14" width="10" height="10" fill="#fde047" />
          <rect x="136" y="12" width="6" height="14" fill="#fde047" />
          <rect x="132" y="16" width="14" height="6" fill="#fde047" />
          <rect x="136" y="16" width="6" height="6" fill="#fef08a" />
          
          {/* Authentic Crisp Pixel Cloud 1 */}
          <g opacity="0.85">
            <rect x="24" y="28" width="28" height="6" fill="#ffffff" />
            <rect x="28" y="24" width="18" height="4" fill="#ffffff" />
            <rect x="32" y="22" width="10" height="2" fill="#ffffff" />
            <rect x="26" y="34" width="22" height="1" fill="#e0f2fe" />
          </g>

          {/* Authentic Crisp Pixel Cloud 2 */}
          <g opacity="0.75">
            <rect x="100" y="38" width="22" height="5" fill="#ffffff" />
            <rect x="104" y="35" width="14" height="3" fill="#ffffff" />
            <rect x="102" y="43" width="18" height="1" fill="#e0f2fe" />
          </g>
        </g>
      )}

      {effectiveWeather === 'golden' && (
        <g transform={fullscreen ? 'translate(0, 30)' : undefined}>
          {/* Cozy Amber Horizon Pixel Sun */}
          <rect x="72" y="30" width="16" height="16" fill="#fb923c" opacity="0.4" />
          <rect x="74" y="28" width="12" height="20" fill="#fb923c" opacity="0.4" />
          <rect x="70" y="32" width="20" height="12" fill="#fb923c" opacity="0.4" />
          <rect x="74" y="32" width="12" height="12" fill="#fef08a" />
          <rect x="76" y="30" width="8" height="16" fill="#fef08a" />
          <rect x="72" y="34" width="16" height="8" fill="#fef08a" />
          {/* Minimalist Dusk Cloud Streaks */}
          <rect x="15" y="32" width="35" height="2" fill="#fb923c" opacity="0.6" />
          <rect x="110" y="28" width="38" height="2" fill="#fb923c" opacity="0.6" />
        </g>
      )}

      {effectiveWeather === 'starry' && (
        <g transform={fullscreen ? 'translate(0, 15)' : undefined}>
          {/* Cozy Golden Crescent Moon */}
          <rect x="132" y="10" width="10" height="10" fill="#fef08a" />
          <rect x="135" y="8" width="6" height="2" fill="#fef08a" />
          <rect x="135" y="20" width="6" height="2" fill="#fef08a" />
          <rect x="129" y="10" width="7" height="10" fill={sky.top} />
          {/* Soft Minimalist Stars */}
          <rect x="18" y="12" width="1" height="1" fill="#ffffff" opacity="0.9" />
          <rect x="45" y="8" width="2" height="2" fill="#fef08a" opacity="0.8" />
          <rect x="75" y="14" width="1" height="1" fill="#ffffff" opacity="0.9" />
          <rect x="108" y="10" width="2" height="2" fill="#fef08a" opacity="0.8" />
          <rect x="28" y="24" width="1" height="1" fill="#ffffff" opacity="0.7" />
          <rect x="118" y="22" width="1" height="1" fill="#ffffff" opacity="0.8" />
          <rect x="60" y="20" width="1" height="1" fill="#fef08a" opacity="0.7" />
          {fullscreen && (
            <>
              <rect x="22" y="60" width="1" height="1" fill="#ffffff" opacity="0.8" />
              <rect x="85" y="55" width="2" height="2" fill="#fef08a" opacity="0.7" />
              <rect x="140" y="70" width="1" height="1" fill="#ffffff" opacity="0.8" />
            </>
          )}
        </g>
      )}

      {effectiveWeather === 'rainy' && (
        <g opacity="0.7">
          {/* Gentle Pixel Rain Streaks */}
          <rect x="20" y="10" width="1" height="8" fill="#93c5fd" opacity="0.5" />
          <rect x="50" y="8" width="1" height="8" fill="#93c5fd" opacity="0.5" />
          <rect x="90" y="12" width="1" height="8" fill="#93c5fd" opacity="0.5" />
          <rect x="130" y="6" width="1" height="8" fill="#93c5fd" opacity="0.5" />
          <rect x="35" y="28" width="1" height="8" fill="#93c5fd" opacity="0.5" />
          <rect x="110" y="26" width="1" height="8" fill="#93c5fd" opacity="0.5" />
        </g>
      )}

      {/* 2. SCENE LOCATION BACKGROUND LAYERS & FROG CHARACTER */}
      <g transform={yShift ? `translate(0, ${yShift})` : undefined}>
      {/* 0. COZY BATHHOUSE & SAUNA ROOM (Pokecolo 3D Architecture) */}
      {config.sceneId === 'sauna_bathhouse' && (
        <g>
          {/* Ceiling with 3D Perspective Tiles & Recessed Lighting (Fullscreen) */}
          {fullscreen ? (
            <g>
              <rect x="0" y="-48" width="160" height="68" fill="#e7d7c1" />
              {/* Perspective Ceiling Beams */}
              <rect x="0" y="-48" width="25" height="2" fill="#cbb497" />
              <rect x="135" y="-48" width="25" height="2" fill="#cbb497" />
              <rect x="45" y="-48" width="10" height="68" fill="#cbb497" opacity="0.6" />
              <rect x="105" y="-48" width="10" height="68" fill="#cbb497" opacity="0.6" />
              <rect x="15" y="-25" width="130" height="1" fill="#cbb497" opacity="0.8" />
              <rect x="20" y="-2" width="120" height="1" fill="#cbb497" opacity="0.8" />

              {/* Glowing Pixel Recessed Lights */}
              <rect x="41" y="-20" width="8" height="8" fill="#fde047" opacity="0.35" />
              <rect x="43" y="-18" width="4" height="4" fill="#fef08a" opacity="0.9" />
              <rect x="111" y="-20" width="8" height="8" fill="#fde047" opacity="0.35" />
              <rect x="113" y="-18" width="4" height="4" fill="#fef08a" opacity="0.9" />
              <rect x="51" y="4" width="8" height="8" fill="#fde047" opacity="0.35" />
              <rect x="53" y="6" width="4" height="4" fill="#fef08a" opacity="0.9" />
              <rect x="101" y="4" width="8" height="8" fill="#fde047" opacity="0.35" />
              <rect x="103" y="6" width="4" height="4" fill="#fef08a" opacity="0.9" />
            </g>
          ) : (
            <rect x="0" y="0" width="160" height="20" fill="#e7d7c1" />
          )}

          {/* Crown Molding Trim */}
          <rect x="0" y="18" width="160" height="4" fill="#8c6a48" />
          <rect x="0" y="20" width="160" height="1.5" fill="#b08b64" />

          {/* Back Wall with Warm Stone Bricks */}
          <rect x="0" y="22" width="160" height="48" fill="#d4be9c" />
          <rect x="0" y="30" width="160" height="1" fill="#bfa682" />
          <rect x="0" y="38" width="160" height="1" fill="#bfa682" />
          <rect x="0" y="46" width="160" height="1" fill="#bfa682" />
          <rect x="0" y="54" width="160" height="1" fill="#bfa682" />
          <rect x="0" y="62" width="160" height="1" fill="#bfa682" />

          <rect x="20" y="22" width="1" height="8" fill="#bfa682" />
          <rect x="40" y="30" width="1" height="8" fill="#bfa682" />
          <rect x="25" y="38" width="1" height="8" fill="#bfa682" />
          <rect x="140" y="22" width="1" height="8" fill="#bfa682" />
          <rect x="125" y="30" width="1" height="8" fill="#bfa682" />
          <rect x="135" y="38" width="1" height="8" fill="#bfa682" />

          {/* Perspective Side Walls */}
          <rect x="0" y="20" width="20" height="50" fill="#c4ad8a" />
          <rect x="140" y="20" width="20" height="50" fill="#bfa682" />

          {/* Right Wall Decor: Framed Anime Art & Vending Machine */}
          <rect x="143" y="28" width="14" height="18" fill="#fdf2f8" stroke="#78350f" strokeWidth="0.8" />
          <rect x="147" y="34" width="6" height="6" fill="#f472b6" opacity="0.6" />

          <rect x="118" y="34" width="18" height="34" fill="#f8fafc" stroke="#64748b" strokeWidth="0.7" />
          <rect x="120" y="37" width="14" height="14" fill="#0284c7" opacity="0.8" />
          <rect x="122" y="41" width="3" height="3" fill="#22c55e" />
          <rect x="126" y="41" width="3" height="3" fill="#ef4444" />
          <rect x="130" y="41" width="3" height="3" fill="#f59e0b" />
          <rect x="122" y="46" width="3" height="3" fill="#38bdf8" />
          <rect x="126" y="46" width="3" height="3" fill="#eab308" />
          <rect x="130" y="46" width="3" height="3" fill="#ec4899" />
          <rect x="122" y="56" width="10" height="4" fill="#334155" />

          {/* Trash Bin */}
          <rect x="137" y="56" width="6" height="11" fill="#71717a" />

          {/* Left Wall Decor: Potted Green Plant */}
          <rect x="12" y="56" width="6" height="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
          <rect x="11" y="42" width="8" height="14" fill="#15803d" />
          <rect x="9" y="46" width="6" height="8" fill="#16a34a" />
          <rect x="15" y="46" width="6" height="8" fill="#22c55e" />

          {/* Center Sauna Doorway & View */}
          <rect x="52" y="34" width="56" height="36" fill="#85532a" stroke="#542e12" strokeWidth="1.5" />
          <rect x="58" y="38" width="44" height="28" fill="#693b16" />
          <rect x="62" y="40" width="36" height="16" fill="#fef3c7" opacity="0.95" />
          <rect x="65" y="46" width="30" height="4" fill="#b45309" />
          <rect x="68" y="42" width="8" height="4" fill="#d97706" />
          <rect x="85" y="44" width="7" height="4" fill="#475569" />

          {/* Digital LED Sign: 38.0°C */}
          <rect x="70" y="24" width="20" height="6" fill="#18181b" stroke="#3f3f46" strokeWidth="0.5" />
          <text x="80" y="28.5" fill="#ef4444" fontSize="4" fontFamily="monospace" textAnchor="middle" fontWeight="bold">38.0°C</text>

          {/* Wooden Door Panels & Details */}
          <rect x="64" y="55" width="32" height="12" fill="#522a0e" />
          <rect x="68" y="57" width="24" height="1" fill="#fef08a" opacity="0.8" />
          <rect x="68" y="60" width="20" height="1" fill="#fef08a" opacity="0.6" />
          <rect x="68" y="63" width="16" height="1" fill="#fef08a" opacity="0.6" />

          {/* 3D Perspective Warm Tiled Floor */}
          <rect x="0" y="70" width="160" height="30" fill="#dfc09c" />
          {/* Radial Floor Lines */}
          <rect x="20" y="70" width="1" height="30" fill="#c9a780" opacity="0.7" />
          <rect x="50" y="70" width="1" height="30" fill="#c9a780" opacity="0.7" />
          <rect x="80" y="70" width="1" height="30" fill="#c9a780" opacity="0.7" />
          <rect x="110" y="70" width="1" height="30" fill="#c9a780" opacity="0.7" />
          <rect x="140" y="70" width="1" height="30" fill="#c9a780" opacity="0.7" />
          {/* Horizontal Floor Tile Lines */}
          <rect x="0" y="78" width="160" height="1" fill="#c9a780" />
          <rect x="0" y="90" width="160" height="1" fill="#c9a780" />

          {/* Midground Furniture: Sleeping Mats */}
          <g>
            {/* Orange Futon Mat 1 */}
            <rect x="28" y="78" width="30" height="10" fill="#fb923c" />
            <rect x="28" y="88" width="30" height="2" fill="#c2410c" />
            <rect x="49" y="77" width="7" height="3" fill="#78350f" />

            {/* Orange Futon Mat 2 */}
            <rect x="56" y="80" width="30" height="10" fill="#fb923c" />
            <rect x="56" y="90" width="30" height="2" fill="#c2410c" />
            <rect x="77" y="79" width="7" height="3" fill="#78350f" />
          </g>

          {/* Foreground Tea Table on Right */}
          <g transform="translate(102, 78)">
            <rect x="2" y="8" width="26" height="10" fill="#78350f" />
            <rect x="2" y="18" width="26" height="3" fill="#451a03" />
            {/* Green Floor Cushion */}
            <rect x="20" y="14" width="14" height="8" fill="#15803d" />
            <rect x="25" y="16" width="4" height="4" fill="#ca8a04" opacity="0.8" />
            {/* Steaming Bowl of Ramen / Matcha */}
            <rect x="10" y="10" width="8" height="5" fill="#f8fafc" />
            <rect x="12" y="11" width="4" height="3" fill="#eab308" />
          </g>

          {/* Mini Pedestal Table with Succulent in Center */}
          <rect x="72" y="96" width="16" height="4" fill="#a16207" />
          <rect x="79" y="94" width="2" height="4" fill="#78350f" />
          <rect x="77" y="91" width="6" height="3" fill="#ffffff" />
          <rect x="78" y="89" width="4" height="3" fill="#16a34a" />
        </g>
      )}

      {/* A. ZEN LOTUS POND SCENE */}
      {config.sceneId === 'zen_pond' && (
        <g>
          {/* Distant Soft Mountain Silhouette Pixel Blocks */}
          <rect x="0" y="44" width="35" height="10" fill="#1e293b" opacity="0.45" />
          <rect x="15" y="38" width="25" height="6" fill="#1e293b" opacity="0.45" />
          <rect x="25" y="34" width="15" height="4" fill="#1e293b" opacity="0.45" />
          <rect x="65" y="44" width="95" height="10" fill="#1e293b" opacity="0.45" />
          <rect x="85" y="38" width="40" height="6" fill="#1e293b" opacity="0.45" />
          <rect x="98" y="32" width="20" height="6" fill="#1e293b" opacity="0.45" />

          {/* Minimalist Stone Lantern on Left */}
          <rect x="20" y="44" width="8" height="2" fill="#475569" />
          <rect x="22" y="46" width="4" height="6" fill="#64748b" />
          <rect x="23" y="48" width="2" height="2" fill="#fef08a" /> {/* Warm lantern glow */}
          <rect x="19" y="52" width="10" height="2" fill="#334155" />
          <rect x="22" y="54" width="4" height="8" fill="#64748b" />
          <rect x="20" y="62" width="8" height="3" fill="#334155" />

          {/* Minimalist Bamboo Reeds on Right */}
          <rect x="138" y="32" width="2" height="28" fill="#4d7c36" />
          <rect x="144" y="26" width="2" height="34" fill="#5f9744" />
          <rect x="135" y="38" width="5" height="2" fill="#5f9744" />
          <rect x="146" y="34" width="5" height="2" fill="#5f9744" />

          {/* Calming Water Basin */}
          <rect x="0" y="58" width="160" height="42" fill="#0369a1" />
          <rect x="0" y="64" width="160" height="36" fill="#075985" />
          <rect x="0" y="76" width="160" height="24" fill="#0c4a6e" />

          {/* Gentle Water Shimmers */}
          <rect x="40" y={animTick % 2 === 0 ? 68 : 69} width="16" height="1" fill="#7dd3fc" opacity="0.6" />
          <rect x="105" y={animTick % 2 === 0 ? 74 : 73} width="20" height="1" fill="#7dd3fc" opacity="0.6" />

          {/* Minimalist Accent Lily Pad & Tiny Lotus */}
          <rect x="30" y="70" width="14" height="5" fill="#4d7c0f" />
          <rect x="32" y="69" width="10" height="1" fill="#65a30d" />
          <rect x="116" y="68" width="16" height="5" fill="#4d7c0f" />
          <rect x="122" y="64" width="4" height="4" fill="#f472b6" />
          <rect x="123" y="63" width="2" height="1" fill="#fdf2f8" />

          {/* Central Island Lily Pad (Frog's Stage) */}
          <rect x="62" y="70" width="36" height="13" fill="#3f6212" />
          <rect x="64" y="68" width="32" height="15" fill="#4d7c0f" />
          <rect x="68" y="66" width="24" height="17" fill="#65a30d" />
          <rect x="74" y="68" width="12" height="13" fill="#84cc16" />
        </g>
      )}

      {/* B. COZY TREEHOUSE SCENE */}
      {config.sceneId === 'treehouse' && (
        <g>
          {/* Warm Wood Wall */}
          <rect x="0" y="0" width="160" height="68" fill="#523218" />
          <rect x="0" y="22" width="160" height="1" fill="#382110" opacity="0.5" />
          <rect x="0" y="44" width="160" height="1" fill="#382110" opacity="0.5" />

          {/* Cozy Window Looking Out to Nature */}
          <rect x="106" y="12" width="40" height="34" fill="#382110" />
          <rect x="108" y="14" width="36" height="30" fill="#60a5fa" />
          <rect x="108" y="30" width="36" height="14" fill="#4b6e38" />
          <rect x="125" y="14" width="2" height="30" fill="#382110" />

          {/* Minimalist Bookshelf on Left */}
          <rect x="16" y="18" width="28" height="36" fill="#382110" />
          <rect x="18" y="20" width="24" height="8" fill="#29180c" />
          <rect x="18" y="32" width="24" height="10" fill="#29180c" />
          {/* Books & Succulent */}
          <rect x="20" y="22" width="4" height="6" fill="#dc2626" />
          <rect x="25" y="23" width="3" height="5" fill="#2563eb" />
          <rect x="29" y="21" width="4" height="7" fill="#16a34a" />
          <rect x="22" y="34" width="6" height="6" fill="#d97706" />
          <rect x="30" y="34" width="5" height="4" fill="#84cc16" />

          {/* Polished Warm Wood Floor */}
          <rect x="0" y="68" width="160" height="32" fill="#784a28" />
          <rect x="0" y="78" width="160" height="1" fill="#523218" />
          <rect x="0" y="88" width="160" height="1" fill="#523218" />

          {/* Minimalist Pixel Round Rug (Frog Stage) */}
          <rect x="56" y="72" width="48" height="12" fill="#d97706" />
          <rect x="52" y="74" width="56" height="8" fill="#d97706" />
          <rect x="58" y="74" width="44" height="8" fill="#fde68a" />
          <rect x="62" y="72" width="36" height="12" fill="#fde68a" />
        </g>
      )}

      {/* C. SAKURA BLOSSOM SHRINE SCENE */}
      {config.sceneId === 'sakura_shrine' && (
        <g>
          {/* Mount Fuji Pixel Silhouette */}
          <rect x="52" y="44" width="56" height="6" fill="#475569" opacity="0.6" />
          <rect x="60" y="38" width="40" height="6" fill="#475569" opacity="0.6" />
          <rect x="68" y="32" width="24" height="6" fill="#475569" opacity="0.6" />
          <rect x="74" y="26" width="12" height="6" fill="#475569" opacity="0.6" />
          <rect x="74" y="26" width="12" height="4" fill="#f8fafc" />
          <rect x="72" y="30" width="16" height="2" fill="#f8fafc" />

          {/* Minimalist Soft Sakura Canopy */}
          <rect x="0" y="30" width="48" height="24" fill="#f472b6" opacity="0.75" />
          <rect x="4" y="26" width="40" height="4" fill="#f472b6" opacity="0.75" />
          <rect x="112" y="28" width="48" height="26" fill="#f472b6" opacity="0.75" />
          <rect x="116" y="24" width="40" height="4" fill="#f472b6" opacity="0.75" />

          {/* Minimalist Vermillion Torii Silhouette */}
          <rect x="50" y="24" width="60" height="4" fill="#dc2626" />
          <rect x="48" y="22" width="64" height="2" fill="#18181b" />
          <rect x="56" y="28" width="4" height="38" fill="#dc2626" />
          <rect x="100" y="28" width="4" height="38" fill="#dc2626" />

          {/* Stone Pathway & Courtyard */}
          <rect x="0" y="60" width="160" height="40" fill="#475569" />
          <rect x="0" y="66" width="160" height="34" fill="#64748b" />
          <rect x="56" y="64" width="48" height="36" fill="#cbd5e1" />
        </g>
      )}

      {/* D. RAINY MUSHROOM MEADOW SCENE */}
      {config.sceneId === 'rainy_meadow' && (
        <g>
          {/* Misty Evergreen Trees Pixel Blocks */}
          <rect x="10" y="44" width="30" height="6" fill="#14532d" opacity="0.5" />
          <rect x="16" y="36" width="18" height="8" fill="#14532d" opacity="0.5" />
          <rect x="22" y="28" width="6" height="8" fill="#14532d" opacity="0.5" />

          <rect x="120" y="44" width="30" height="6" fill="#14532d" opacity="0.5" />
          <rect x="126" y="34" width="18" height="10" fill="#14532d" opacity="0.5" />
          <rect x="132" y="26" width="6" height="8" fill="#14532d" opacity="0.5" />

          {/* Meadow Ground */}
          <rect x="0" y="52" width="160" height="48" fill="#15803d" />
          <rect x="0" y="62" width="160" height="38" fill="#166534" />

          {/* Minimalist Red Polka-Dot Mushroom on Left */}
          <rect x="22" y="48" width="6" height="22" fill="#f5f5f4" />
          <rect x="12" y="36" width="26" height="14" fill="#dc2626" />
          <rect x="14" y="34" width="22" height="2" fill="#dc2626" />
          <rect x="16" y="40" width="4" height="4" fill="#ffffff" />
          <rect x="26" y="38" width="4" height="4" fill="#ffffff" />

          {/* Small Mushroom on Right */}
          <rect x="132" y="56" width="4" height="12" fill="#f5f5f4" />
          <rect x="126" y="50" width="16" height="8" fill="#ea580c" />
          <rect x="133" y="52" width="3" height="3" fill="#ffffff" />

          {/* Cozy Mossy Stone Platform (Frog Stage) */}
          <rect x="58" y="66" width="44" height="16" fill="#3f3f46" />
          <rect x="62" y="64" width="36" height="6" fill="#65a30d" />
        </g>
      )}

      {/* E. MOUNTAIN HOT SPRING (ONSEN) */}
      {config.sceneId === 'onsen' && (
        <g>
          {/* Distant Mountain Peak Pixel Blocks */}
          <rect x="20" y="44" width="80" height="6" fill="#334155" opacity="0.4" />
          <rect x="40" y="34" width="40" height="10" fill="#334155" opacity="0.4" />
          <rect x="55" y="26" width="12" height="8" fill="#334155" opacity="0.4" />

          <rect x="80" y="44" width="80" height="6" fill="#334155" opacity="0.4" />
          <rect x="100" y="32" width="40" height="12" fill="#334155" opacity="0.4" />
          <rect x="114" y="24" width="12" height="8" fill="#334155" opacity="0.4" />

          {/* Steaming Mineral Water Basin */}
          <rect x="0" y="56" width="160" height="44" fill="#3f3f46" />
          <rect x="16" y="62" width="128" height="34" fill="#06b6d4" />
          <rect x="20" y="66" width="120" height="28" fill="#0891b2" />

          {/* Soothing Steam Puffs Pixel Blocks */}
          <rect x="37" y={animTick % 2 === 0 ? 52 : 50} width="16" height="4" fill="#ffffff" opacity="0.4" />
          <rect x="41" y={animTick % 2 === 0 ? 50 : 48} width="8" height="2" fill="#ffffff" opacity="0.4" />
          <rect x="105" y={animTick % 2 === 0 ? 50 : 48} width="20" height="4" fill="#ffffff" opacity="0.4" />
          <rect x="110" y={animTick % 2 === 0 ? 48 : 46} width="10" height="2" fill="#ffffff" opacity="0.4" />

          {/* Wooden Bucket on Right */}
          <rect x="124" y="60" width="12" height="8" fill="#d97706" />
          <rect x="126" y="58" width="6" height="3" fill="#ffffff" />

          {/* Smooth Warm River Rock (Frog Stage) */}
          <rect x="62" y="70" width="36" height="12" fill="#71717a" />
          <rect x="58" y="74" width="44" height="6" fill="#71717a" />
          <rect x="66" y="72" width="28" height="8" fill="#a1a1aa" />
        </g>
      )}

      {/* F. STARRY CAMPFIRE HAVEN */}
      {config.sceneId === 'night_camp' && (
        <g>
          {/* Distant Pine Trees in Night */}
          <rect x="10" y="44" width="30" height="6" fill="#0f172a" />
          <rect x="16" y="36" width="18" height="8" fill="#0f172a" />
          <rect x="22" y="28" width="6" height="8" fill="#0f172a" />

          <rect x="120" y="44" width="30" height="6" fill="#0f172a" />
          <rect x="126" y="34" width="18" height="10" fill="#0f172a" />
          <rect x="132" y="26" width="6" height="8" fill="#0f172a" />

          {/* Forest Ground */}
          <rect x="0" y="52" width="160" height="48" fill="#1e293b" />
          <rect x="0" y="62" width="160" height="38" fill="#0f172a" />

          {/* Minimalist A-Frame Tent on Right Pixel Blocks */}
          <rect x="112" y="66" width="40" height="12" fill="#0284c7" />
          <rect x="120" y="54" width="24" height="12" fill="#0284c7" />
          <rect x="128" y="46" width="8" height="8" fill="#0284c7" />
          <rect x="124" y="64" width="16" height="14" fill="#0f172a" />
          <rect x="128" y="58" width="8" height="6" fill="#0f172a" />

          {/* Minimalist Crackling Campfire on Left */}
          <rect x="22" y="74" width="16" height="3" fill="#78350f" />
          <rect x="26" y="68" width="8" height="6" fill="#ea580c" />
          <rect x="28" y="60" width="4" height="8" fill="#ea580c" />
          <rect x="28" y="64" width="4" height="8" fill="#facc15" />

          {/* Cozy Camp Mat (Frog Stage) */}
          <rect x="60" y="68" width="40" height="16" fill="#dc2626" />
          <rect x="64" y="70" width="32" height="12" fill="#f87171" />
        </g>
      )}

      {/* G. WASHI TEAROOM LOFT */}
      {config.sceneId === 'tearoom' && (
        <g>
          {/* Shoji Paper Wall */}
          <rect x="0" y="0" width="160" height="62" fill="#fef3c7" />
          <rect x="0" y="0" width="160" height="3" fill="#523218" />
          <rect x="0" y="20" width="160" height="1" fill="#523218" opacity="0.6" />
          <rect x="0" y="40" width="160" height="1" fill="#523218" opacity="0.6" />
          <rect x="0" y="60" width="160" height="3" fill="#523218" />
          <rect x="40" y="0" width="1" height="62" fill="#523218" opacity="0.6" />
          <rect x="80" y="0" width="1" height="62" fill="#523218" opacity="0.6" />
          <rect x="120" y="0" width="1" height="62" fill="#523218" opacity="0.6" />

          {/* Bonsai Plant on Right */}
          <rect x="130" y="40" width="12" height="6" fill="#1c1917" />
          <rect x="134" y="32" width="3" height="8" fill="#78350f" />
          <rect x="128" y="24" width="14" height="10" fill="#15803d" />
          <rect x="131" y="21" width="8" height="3" fill="#15803d" />

          {/* Tatami Mats */}
          <rect x="0" y="62" width="160" height="38" fill="#d9f99d" />
          <rect x="0" y="76" width="160" height="2" fill="#365314" />

          {/* Low Wooden Table (Frog Stage) */}
          <rect x="58" y="66" width="44" height="14" fill="#78350f" />
          <rect x="62" y="64" width="36" height="3" fill="#b45309" />
        </g>
      )}

      {/* H. CELESTIAL CLOUD PALACE */}
      {config.sceneId === 'cloud_palace' && (
        <g>
          {/* Golden Starlight Particles */}
          <rect x="27" y="23" width="3" height="3" fill="#fef08a" />
          <rect x="131" y="19" width="3" height="3" fill="#fef08a" />
          <rect x="78" y="14" width="4" height="4" fill="#facc15" />

          {/* Dreamy Cloud Platform */}
          <rect x="0" y="66" width="160" height="34" fill="#ede9fe" />
          {/* Cloud Puffs (Crisp Pixel Blocks) */}
          <rect x="21" y="52" width="28" height="20" fill="#ffffff" />
          <rect x="25" y="48" width="20" height="4" fill="#ffffff" />
          <rect x="49" y="48" width="32" height="24" fill="#ffffff" />
          <rect x="55" y="44" width="20" height="4" fill="#ffffff" />
          <rect x="79" y="48" width="32" height="24" fill="#ffffff" />
          <rect x="85" y="44" width="20" height="4" fill="#ffffff" />
          <rect x="111" y="52" width="28" height="20" fill="#ffffff" />
          <rect x="115" y="48" width="20" height="4" fill="#ffffff" />
        </g>
      )}

      {/* I. MISTY EMERALD BAMBOO GROVE */}
      {config.sceneId === 'bamboo_grove' && (
        <g>
          {/* Bamboo Stalks */}
          <rect x="20" y="0" width="6" height="74" fill="#15803d" />
          <rect x="35" y="0" width="4" height="74" fill="#166534" opacity="0.6" />
          <rect x="125" y="0" width="6" height="74" fill="#15803d" />
          <rect x="140" y="0" width="4" height="74" fill="#166534" opacity="0.6" />

          {/* Soft Paper Lantern */}
          <rect x="26" y="20" width="2" height="2" fill="#78350f" />
          <rect x="28" y="22" width="2" height="2" fill="#78350f" />
          <rect x="30" y="24" width="2" height="2" fill="#78350f" />
          <rect x="32" y="26" width="2" height="2" fill="#78350f" />
          <rect x="34" y="28" width="2" height="2" fill="#78350f" />
          <rect x="35" y="30" width="8" height="10" fill="#dc2626" />
          <rect x="37" y="33" width="4" height="4" fill="#fef08a" />

          {/* Mossy Stepping Stone Pathway */}
          <rect x="0" y="66" width="160" height="34" fill="#14532d" />
          <rect x="54" y="72" width="52" height="14" fill="#475569" />
          <rect x="58" y="70" width="44" height="18" fill="#475569" />
          <rect x="58" y="73" width="44" height="12" fill="#64748b" />
          <rect x="62" y="71" width="36" height="16" fill="#64748b" />
        </g>
      )}

      {/* J. FAIRYTALE RED RIDING FOREST */}
      {config.sceneId === 'red_riding_forest' && (
        <g>
          {/* Deep Evergreen Forest Trees Pixel Blocks */}
          <rect x="10" y="44" width="36" height="10" fill="#064e3b" />
          <rect x="18" y="32" width="20" height="12" fill="#064e3b" />
          <rect x="24" y="18" width="8" height="14" fill="#064e3b" />

          <rect x="26" y="42" width="32" height="8" fill="#065f46" opacity="0.8" />
          <rect x="34" y="32" width="16" height="10" fill="#065f46" opacity="0.8" />
          <rect x="38" y="22" width="8" height="10" fill="#065f46" opacity="0.8" />

          <rect x="114" y="42" width="36" height="10" fill="#064e3b" />
          <rect x="122" y="30" width="20" height="12" fill="#064e3b" />
          <rect x="128" y="20" width="8" height="10" fill="#064e3b" />

          {/* Cozy Thatched Cottage in Deep Background */}
          <rect x="70" y="30" width="30" height="6" fill="#78350f" />
          <rect x="76" y="24" width="18" height="6" fill="#78350f" />
          <rect x="73" y="36" width="24" height="18" fill="#fde68a" />
          <rect x="78" y="42" width="6" height="12" fill="#92400e" />
          <rect x="88" y="39" width="6" height="6" fill="#f59e0b" />
          {/* Stone Chimney & Smoke Puff */}
          <rect x="91" y="24" width="4" height="8" fill="#64748b" />
          <rect x="91" y={animTick % 2 === 0 ? 18 : 16} width="5" height="5" fill="#ffffff" opacity="0.5" />

          {/* Forest Moss Ground & Trail */}
          <rect x="0" y="54" width="160" height="46" fill="#14532d" />
          <rect x="0" y="66" width="160" height="34" fill="#166534" />
          {/* Winding Cobblestone Trail */}
          <rect x="40" y="54" width="80" height="46" fill="#78716c" opacity="0.5" />

          {/* Fairytale Red Toadstool Mushrooms */}
          <rect x="24" y="66" width="4" height="12" fill="#f5f5f4" />
          <rect x="18" y="58" width="16" height="9" fill="#dc2626" />
          <rect x="21" y="61" width="3" height="3" fill="#ffffff" />
          <rect x="29" y="60" width="3" height="3" fill="#ffffff" />

          {/* Mossy Wood Log Bench (Frog Stage) */}
          <rect x="58" y="68" width="44" height="14" fill="#523218" />
          <rect x="60" y="66" width="40" height="4" fill="#784a28" />
          <rect x="64" y="65" width="8" height="2" fill="#84cc16" />
          <rect x="88" y="65" width="6" height="2" fill="#84cc16" />
        </g>
      )}

      {/* K. EDOMAE SUSHI BAR */}
      {config.sceneId === 'sushi_bar' && (
        <g>
          {/* Dark Navy Izakaya Wall with Noren Curtains */}
          <rect x="0" y="0" width="160" height="58" fill="#0f172a" />
          {/* Wooden Beam Ceiling */}
          <rect x="0" y="0" width="160" height="6" fill="#78350f" />
          <rect x="0" y="16" width="160" height="2" fill="#451a03" opacity="0.6" />

          {/* Indigo Noren Curtain with Split */}
          <rect x="12" y="6" width="40" height="22" fill="#1e3a8a" />
          <rect x="56" y="6" width="48" height="22" fill="#1e3a8a" />
          <rect x="108" y="6" width="40" height="22" fill="#1e3a8a" />
          {/* White Emblem Pattern on Noren */}
          <rect x="28" y="13" width="8" height="8" fill="#ffffff" opacity="0.9" />
          <rect x="76" y="13" width="8" height="8" fill="#ffffff" opacity="0.9" />
          <rect x="124" y="13" width="8" height="8" fill="#ffffff" opacity="0.9" />

          {/* Warm Red Paper Izakaya Lanterns */}
          <rect x="18" y="30" width="10" height="14" fill="#dc2626" />
          <rect x="21" y="33" width="4" height="8" fill="#fef08a" />
          <rect x="132" y="30" width="10" height="14" fill="#dc2626" />
          <rect x="135" y="33" width="4" height="8" fill="#fef08a" />

          {/* Polished Hinoki Wood Counter (Frog Stage) */}
          <rect x="0" y="58" width="160" height="42" fill="#78350f" />
          <rect x="0" y="58" width="160" height="10" fill="#d97706" />
          <rect x="0" y="68" width="160" height="2" fill="#92400e" />

          {/* Wooden Nigiri Cutting Board Platform */}
          <rect x="56" y="64" width="48" height="16" fill="#fde68a" />
          <rect x="58" y="66" width="44" height="12" fill="#fef3c7" />
          <rect x="60" y="78" width="4" height="3" fill="#b45309" />
          <rect x="96" y="78" width="4" height="3" fill="#b45309" />
        </g>
      )}

      {/* RETRO 8-BIT GAME STORE & ARCADE CENTER */}
      {config.sceneId === 'retro_arcade' && (
        <g id="scene-retro-arcade">
          {/* Dark Synthwave Purple Wall */}
          <rect x="0" y="0" width="160" height="60" fill="#130924" />

          {/* Synthwave Neon Grid Wall Lines */}
          <line x1="0" y1="16" x2="160" y2="16" stroke="#4c1d95" strokeWidth="0.5" opacity="0.6" />
          <line x1="0" y1="32" x2="160" y2="32" stroke="#4c1d95" strokeWidth="0.5" opacity="0.6" />
          <line x1="0" y1="48" x2="160" y2="48" stroke="#4c1d95" strokeWidth="0.5" opacity="0.6" />
          <line x1="40" y1="0" x2="40" y2="60" stroke="#4c1d95" strokeWidth="0.5" opacity="0.4" />
          <line x1="80" y1="0" x2="80" y2="60" stroke="#4c1d95" strokeWidth="0.5" opacity="0.4" />
          <line x1="120" y1="0" x2="120" y2="60" stroke="#4c1d95" strokeWidth="0.5" opacity="0.4" />

          {/* Top Arcade Fascia Marquee Header */}
          <rect x="0" y="0" width="160" height="14" fill="#090414" />
          <rect x="0" y="0" width="160" height="2" fill="#ec4899" />
          <rect x="0" y="12" width="160" height="2" fill="#06b6d4" />

          {/* Neon Signboard: 8-BIT RETRO ARCADE */}
          <rect x="36" y="2" width="88" height="9" fill="#1e1035" stroke="#ec4899" strokeWidth="0.6" />
          <text x="80" y="8" fill="#facc15" fontSize="4.8" fontFamily="monospace" textAnchor="middle" fontWeight="bold" letterSpacing="1">
            🕹️ 8-BIT ARCADE 👾
          </text>
          {/* Flashing Neon Dots */}
          <circle cx="39" cy="6.5" r="1" fill="#06b6d4" className="animate-ping" />
          <circle cx="121" cy="6.5" r="1" fill="#ec4899" className="animate-ping" />

          {/* Wall Pixel Art Poster 1: Space Invader Alien */}
          <g transform="translate(56, 17)">
            <rect x="0" y="0" width="16" height="15" fill="#1e1035" stroke="#3b82f6" strokeWidth="0.5" />
            <rect x="4" y="2" width="8" height="2" fill="#22d3ee" />
            <rect x="2" y="4" width="12" height="5" fill="#22d3ee" />
            <rect x="4" y="5" width="2" height="2" fill="#1e1035" />
            <rect x="10" y="5" width="2" height="2" fill="#1e1035" />
            <rect x="1" y="9" width="3" height="3" fill="#22d3ee" />
            <rect x="12" y="9" width="3" height="3" fill="#22d3ee" />
            <rect x="3" y="11" width="3" height="2" fill="#22d3ee" />
            <rect x="10" y="11" width="3" height="2" fill="#22d3ee" />
          </g>

          {/* Wall Pixel Art Poster 2: High Score Leaderboard CRT */}
          <g transform="translate(88, 17)">
            <rect x="0" y="0" width="22" height="15" fill="#09090b" stroke="#a855f7" strokeWidth="0.6" />
            <rect x="1" y="1" width="20" height="13" fill="#1e1b4b" />
            <text x="11" y="5.5" fill="#facc15" fontSize="2.2" fontFamily="monospace" textAnchor="middle" fontWeight="bold">HI-SCORE</text>
            <text x="11" y="9.5" fill="#38bdf8" fontSize="2" fontFamily="monospace" textAnchor="middle">1.FROG 99K</text>
            <text x="11" y="12.5" fill="#ec4899" fontSize="1.8" fontFamily="monospace" textAnchor="middle">2.BLIP 85K</text>
          </g>

          {/* LEFT SIDE: CLASSIC CRT ARCADE CABINET (Space Frog Fighter) */}
          <g id="arcade-cabinet-left">
            {/* Cabinet Outer Frame */}
            <path d="M 4 20 L 32 20 L 32 64 L 4 64 Z" fill="#2e1065" stroke="#7e22ce" strokeWidth="0.8" />
            {/* Side Cyan Bevel Accent */}
            <path d="M 4 20 L 8 22 L 8 62 L 4 64 Z" fill="#06b6d4" opacity="0.85" />

            {/* Cabinet Marquee Lightbox */}
            <rect x="8" y="21" width="23" height="7" fill="#09090b" stroke="#ec4899" strokeWidth="0.5" />
            <text x="19.5" y="26" fill="#facc15" fontSize="2.8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">FROG-X</text>

            {/* Curved CRT Screen Bezel */}
            <rect x="9" y="30" width="21" height="15" fill="#030712" stroke="#1f2937" strokeWidth="0.6" />
            {/* CRT Screen Glow */}
            <rect x="10.5" y="31.5" width="18" height="12" fill="#0c4a6e" />
            {/* Retro Game Graphics on Screen: Stars & Spaceship */}
            <rect x="12" y="33" width="1" height="1" fill="#ffffff" />
            <rect x="25" y="34" width="1" height="1" fill="#ffffff" />
            <rect x="18" y="39" width="3" height="3" fill="#4ade80" />
            <rect x="19" y="36" width="1" height="3" fill="#ef4444" className="animate-pulse" />
            <rect x="17" y="33" width="5" height="2" fill="#facc15" />

            {/* Angled Control Deck Platform */}
            <rect x="6" y="46" width="26" height="7" fill="#18181b" stroke="#374151" strokeWidth="0.5" />
            {/* Joystick Stick & Red Ball */}
            <rect x="11" y="47.5" width="1" height="3" fill="#9ca3af" />
            <circle cx="11.5" cy="47" r="1.5" fill="#ef4444" />
            {/* 4 Colored Action Buttons */}
            <circle cx="18" cy="48.5" r="1" fill="#3b82f6" />
            <circle cx="21" cy="48" r="1" fill="#eab308" />
            <circle cx="24" cy="48.5" r="1" fill="#22c55e" />
            <circle cx="21" cy="51" r="1" fill="#ec4899" />

            {/* Lower Coin Door & 100-Yen Slots */}
            <rect x="10" y="54" width="18" height="9" fill="#09090b" stroke="#475569" strokeWidth="0.5" />
            <rect x="13" y="56" width="4" height="2" fill="#dc2626" />
            <rect x="14.5" y="56.5" width="1" height="1" fill="#09090b" />
            <rect x="20" y="56" width="4" height="2" fill="#dc2626" />
            <rect x="21.5" y="56.5" width="1" height="1" fill="#09090b" />
            <text x="19" y="61.5" fill="#94a3b8" fontSize="1.8" fontFamily="monospace" textAnchor="middle">100¥ COIN</text>
          </g>

          {/* RIGHT SIDE: JAPANESE NEON UFO CLAW CRANE MACHINE */}
          <g id="arcade-claw-machine-right">
            {/* Crane Cabinet Frame */}
            <rect x="126" y="16" width="30" height="48" fill="#831843" stroke="#f43f5e" strokeWidth="0.8" />
            <rect x="127" y="17" width="28" height="7" fill="#09090b" stroke="#ec4899" strokeWidth="0.5" />
            <text x="141" y="22" fill="#f43f5e" fontSize="3" fontFamily="monospace" textAnchor="middle" fontWeight="bold">UFO CLAW</text>

            {/* Clear Glass Prize Chamber */}
            <rect x="128" y="25" width="26" height="23" fill="#082f49" opacity="0.85" stroke="#38bdf8" strokeWidth="0.6" />
            <rect x="129" y="26" width="24" height="21" fill="#0369a1" opacity="0.25" />

            {/* Hanging Mechanical Crane Claw */}
            <rect x="139" y="25" width="1" height="8" fill="#94a3b8" />
            <rect x="137" y="32" width="5" height="2" fill="#cbd5e1" />
            <path d="M 136 34 L 138 37 M 143 34 L 141 37" stroke="#e2e8f0" strokeWidth="0.8" />

            {/* Pixel Plush Toys Inside Prize Bin */}
            {/* Green Frog Plush */}
            <rect x="130" y="40" width="7" height="6" fill="#4ade80" stroke="#15803d" strokeWidth="0.4" />
            <rect x="131" y="39" width="2" height="2" fill="#15803d" />
            <rect x="134" y="39" width="2" height="2" fill="#15803d" />
            {/* Pink Bunny Plush */}
            <rect x="138" y="41" width="6" height="5" fill="#f472b6" />
            <rect x="138" y="38" width="2" height="4" fill="#f472b6" />
            <rect x="142" y="38" width="2" height="4" fill="#f472b6" />
            {/* Golden Star Plush */}
            <rect x="145" y="39" width="6" height="6" fill="#facc15" stroke="#ca8a04" strokeWidth="0.4" />
            <rect x="147" y="41" width="2" height="2" fill="#ffffff" />

            {/* Front Claw Control Panel & Prize Drop Tray */}
            <rect x="128" y="49" width="26" height="6" fill="#18181b" stroke="#475569" strokeWidth="0.5" />
            <circle cx="134" cy="52" r="1.5" fill="#ef4444" />
            <rect x="142" y="50.5" width="4" height="3" fill="#22c55e" />
            <rect x="148" y="50.5" width="4" height="3" fill="#3b82f6" />

            {/* Prize Chute Flap at Bottom */}
            <rect x="132" y="56" width="18" height="7" fill="#09090b" stroke="#334155" strokeWidth="0.5" />
            <text x="141" y="61" fill="#facc15" fontSize="2" fontFamily="monospace" textAnchor="middle">PRIZE WIN</text>
          </g>

          {/* CHECKERED SYNTHWAVE DANCE & ARCADE FLOOR */}
          <rect x="0" y="60" width="160" height="40" fill="#0f0728" />

          {/* Isometric Perspective Checkerboard Grid */}
          <rect x="0" y="60" width="160" height="1" fill="#7e22ce" />
          <rect x="0" y="70" width="160" height="1" fill="#7e22ce" />
          <rect x="0" y="82" width="160" height="1" fill="#7e22ce" />
          <rect x="0" y="96" width="160" height="1" fill="#7e22ce" />

          {/* Checkerboard Pattern Tiles (Purple & Cyan Glow) */}
          <rect x="0" y="60" width="20" height="10" fill="#2e1065" opacity="0.6" />
          <rect x="40" y="60" width="20" height="10" fill="#2e1065" opacity="0.6" />
          <rect x="80" y="60" width="20" height="10" fill="#2e1065" opacity="0.6" />
          <rect x="120" y="60" width="20" height="10" fill="#2e1065" opacity="0.6" />

          <rect x="20" y="70" width="24" height="12" fill="#3b0764" opacity="0.7" />
          <rect x="68" y="70" width="24" height="12" fill="#3b0764" opacity="0.7" />
          <rect x="116" y="70" width="24" height="12" fill="#3b0764" opacity="0.7" />

          <rect x="0" y="82" width="30" height="18" fill="#2e1065" opacity="0.6" />
          <rect x="60" y="82" width="32" height="18" fill="#2e1065" opacity="0.6" />
          <rect x="124" y="82" width="36" height="18" fill="#2e1065" opacity="0.6" />

          {/* CENTER RHYTHM DANCE STAGE / FROG PLATFORM (DDR Style Stage) */}
          <g id="arcade-dance-stage">
            <rect x="48" y="62" width="48" height="18" fill="#18181b" stroke="#06b6d4" strokeWidth="0.8" />
            <rect x="50" y="64" width="44" height="14" fill="#09090b" />

            {/* 4 Illuminated Neon Arrow Pads */}
            {/* UP Arrow (Cyan) */}
            <rect x="68" y="65" width="8" height="4" fill="#06b6d4" stroke="#67e8f9" strokeWidth="0.4" />
            <path d="M 72 65.5 L 70 68 L 74 68 Z" fill="#ffffff" />

            {/* DOWN Arrow (Magenta) */}
            <rect x="68" y="73" width="8" height="4" fill="#ec4899" stroke="#f472b6" strokeWidth="0.4" />
            <path d="M 72 76.5 L 70 74 L 74 74 Z" fill="#ffffff" />

            {/* LEFT Arrow (Yellow) */}
            <rect x="52" y="69" width="8" height="4" fill="#eab308" stroke="#fef08a" strokeWidth="0.4" />
            <path d="M 53 71 L 56 69.5 L 56 72.5 Z" fill="#ffffff" />

            {/* RIGHT Arrow (Lime Green) */}
            <rect x="84" y="69" width="8" height="4" fill="#22c55e" stroke="#86efac" strokeWidth="0.4" />
            <path d="M 91 71 L 88 69.5 L 88 72.5 Z" fill="#ffffff" />

            {/* Center Dance Pad Hub */}
            <rect x="68" y="69.5" width="8" height="3" fill="#3f3f46" />
            <circle cx="72" cy="71" r="1" fill="#facc15" />
          </g>

          {/* Gacha Capsule Toy Dispenser on Right Floor Corner */}
          <g transform="translate(108, 54)">
            {/* Base Stand */}
            <rect x="2" y="14" width="12" height="14" fill="#ef4444" stroke="#991b1b" strokeWidth="0.5" />
            <rect x="5" y="20" width="6" height="4" fill="#09090b" />
            {/* Turn Crank Knob */}
            <circle cx="8" cy="17" r="2" fill="#e5e7eb" stroke="#4b5563" strokeWidth="0.4" />
            <rect x="7" y="16" width="2" height="2" fill="#ef4444" />
            {/* Clear Transparent Bubble Globe */}
            <rect x="1" y="2" width="14" height="12" fill="#38bdf8" opacity="0.5" stroke="#0284c7" strokeWidth="0.5" />
            {/* Colorful Capsules Inside */}
            <circle cx="5" cy="6" r="2" fill="#eab308" />
            <circle cx="10" cy="7" r="2" fill="#ec4899" />
            <circle cx="6" cy="11" r="2" fill="#22c55e" />
            <circle cx="11" cy="11" r="2" fill="#3b82f6" />
          </g>
        </g>
      )}

      {/* L. 24H NEON KONBINI CONVENIENCE STORE */}
      {config.sceneId === 'convenience_store' && (
        <g id="scene-convenience-store">
          {/* Top Neon Storefront Fascia Canopy */}
          <rect x="0" y="0" width="160" height="14" fill="#18181b" />
          <rect x="0" y="2" width="160" height="3" fill="#10b981" />
          <rect x="0" y="5" width="160" height="2" fill="#ffffff" />
          <rect x="0" y="7" width="160" height="3" fill="#ea580c" />
          <rect x="0" y="10" width="160" height="2" fill="#0284c7" />

          {/* Glowing 24h Digital LED Sign */}
          <rect x="60" y="1" width="40" height="11" fill="#09090b" stroke="#27272a" strokeWidth="0.5" />
          <text x="80" y="8" fill="#10b981" fontSize="5" fontFamily="monospace" textAnchor="middle" fontWeight="bold" letterSpacing="0.5">
            24h MART
          </text>
          <rect x="63" y="5" width="2" height="2" fill="#ef4444" className="animate-pulse" />
          <rect x="95" y="5" width="2" height="2" fill="#22c55e" />

          {/* Recessed Ceiling Neon Tube Lights */}
          <rect x="15" y="14" width="40" height="2" fill="#ffffff" opacity="0.85" />
          <rect x="105" y="14" width="40" height="2" fill="#ffffff" opacity="0.85" />
          <rect x="18" y="16" width="34" height="1" fill="#38bdf8" opacity="0.4" />
          <rect x="108" y="16" width="34" height="1" fill="#38bdf8" opacity="0.4" />

          {/* Back Store Wall Interior */}
          <rect x="0" y="14" width="160" height="46" fill="#f1f5f9" />
          <rect x="0" y="28" width="160" height="1" fill="#e2e8f0" />
          <rect x="0" y="42" width="160" height="1" fill="#e2e8f0" />

          {/* LEFT SIDE: Illuminated Glass Drink Cooler Display Case */}
          <rect x="4" y="18" width="48" height="42" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.8" />
          <rect x="6" y="20" width="44" height="38" fill="#0369a1" opacity="0.9" />
          {/* Frosty Glass Backlight */}
          <rect x="8" y="22" width="40" height="34" fill="#0284c7" opacity="0.6" />

          {/* Cooler Shelves & Colorful Canned Drinks */}
          {/* Shelf 1 - Top: Green Melon Sodas & Canned Coffees */}
          <rect x="6" y="28" width="44" height="1" fill="#e0f2fe" />
          <rect x="9" y="23" width="4" height="5" fill="#22c55e" />
          <rect x="15" y="23" width="4" height="5" fill="#22c55e" />
          <rect x="21" y="23" width="4" height="5" fill="#f59e0b" />
          <rect x="27" y="23" width="4" height="5" fill="#ef4444" />
          <rect x="33" y="23" width="4" height="5" fill="#3b82f6" />
          <rect x="39" y="23" width="4" height="5" fill="#78350f" />

          {/* Shelf 2 - Middle: Strawberry Milk & Bottled Teas */}
          <rect x="6" y="38" width="44" height="1" fill="#e0f2fe" />
          <rect x="9" y="31" width="4" height="7" fill="#f472b6" />
          <rect x="15" y="31" width="4" height="7" fill="#f472b6" />
          <rect x="21" y="31" width="4" height="7" fill="#84cc16" />
          <rect x="27" y="31" width="4" height="7" fill="#84cc16" />
          <rect x="33" y="31" width="4" height="7" fill="#38bdf8" />
          <rect x="39" y="31" width="4" height="7" fill="#ffffff" />

          {/* Shelf 3 - Bottom: Giant Beverage Cartons */}
          <rect x="6" y="48" width="44" height="1" fill="#e0f2fe" />
          <rect x="10" y="40" width="5" height="8" fill="#fb923c" />
          <rect x="18" y="40" width="5" height="8" fill="#38bdf8" />
          <rect x="26" y="40" width="5" height="8" fill="#a855f7" />
          <rect x="34" y="40" width="5" height="8" fill="#10b981" />

          {/* Cooler Digital Temp & Glass Glare */}
          <rect x="34" y="19" width="12" height="3" fill="#09090b" />
          <text x="40" y="21.2" fill="#38bdf8" fontSize="2.2" fontFamily="monospace" textAnchor="middle">3.2°C</text>
          <rect x="12" y="22" width="2" height="6" fill="#ffffff" opacity="0.3" />
          <rect x="18" y="30" width="2" height="6" fill="#ffffff" opacity="0.3" />

          {/* RIGHT SIDE: Snack Aisle Racks & Hot Food Warmer Case */}
          {/* Multi-tier Snack Shelves */}
          <rect x="110" y="22" width="46" height="38" fill="#334155" />
          {/* Shelf 1: Potato Chip Bags (Red, Blue, Yellow) */}
          <rect x="110" y="31" width="46" height="1" fill="#64748b" />
          <rect x="113" y="24" width="6" height="7" fill="#ef4444" />
          <rect x="121" y="24" width="6" height="7" fill="#3b82f6" />
          <rect x="129" y="24" width="6" height="7" fill="#eab308" />
          <rect x="137" y="24" width="6" height="7" fill="#10b981" />
          <rect x="145" y="24" width="6" height="7" fill="#ec4899" />

          {/* Shelf 2: Ramen Cup Noodles & Pocky Boxes */}
          <rect x="110" y="41" width="46" height="1" fill="#64748b" />
          <rect x="114" y="34" width="5" height="6" fill="#dc2626" />
          <rect x="122" y="34" width="5" height="6" fill="#ea580c" />
          <rect x="129" y="33" width="4" height="8" fill="#dc2626" />
          <rect x="135" y="33" width="4" height="8" fill="#78350f" />
          <rect x="141" y="33" width="4" height="8" fill="#ec4899" />
          <rect x="147" y="33" width="4" height="8" fill="#84cc16" />

          {/* Shelf 3 / Hot Warmer Case on Counter Base */}
          <rect x="110" y="44" width="46" height="16" fill="#78350f" stroke="#d97706" strokeWidth="0.8" />
          <rect x="112" y="46" width="42" height="12" fill="#fef3c7" opacity="0.95" />
          {/* Steamy Buns / Karaage Golden Glow */}
          <rect x="115" y="48" width="6" height="6" fill="#f59e0b" />
          <rect x="123" y="48" width="6" height="6" fill="#f97316" />
          <rect x="131" y="48" width="6" height="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
          <rect x="139" y="48" width="6" height="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
          <text x="133" y="48" fill="#dc2626" fontSize="2.5" fontFamily="monospace" fontWeight="bold">HOT</text>

          {/* 3D Checkered Convenience Store Tiled Floor */}
          <rect x="0" y="60" width="160" height="40" fill="#f8fafc" />
          {/* Floor Tile Grid Lines */}
          <rect x="0" y="60" width="160" height="1" fill="#cbd5e1" />
          <rect x="0" y="72" width="160" height="1" fill="#cbd5e1" />
          <rect x="0" y="88" width="160" height="1" fill="#cbd5e1" />

          {/* Alternating Soft Pastel Checker Accents */}
          <rect x="45" y="60" width="32" height="12" fill="#ecfdf5" opacity="0.7" />
          <rect x="112" y="60" width="32" height="12" fill="#ecfdf5" opacity="0.7" />
          <rect x="8" y="72" width="36" height="16" fill="#eff6ff" opacity="0.7" />
          <rect x="78" y="72" width="38" height="16" fill="#eff6ff" opacity="0.7" />
          <rect x="32" y="88" width="48" height="22" fill="#ecfdf5" opacity="0.7" />
          <rect x="120" y="88" width="40" height="22" fill="#ecfdf5" opacity="0.7" />

          {/* Red Plastic Shopping Basket on Floor on Left (Hidden if animated Snack Shiba companion is active) */}
          {config.companionId !== 'snack_shiba' && config.companionId !== 'companion_snack_shiba' && (
            <g transform="translate(14, 68)">
              <rect x="2" y="4" width="18" height="10" fill="#dc2626" />
              <rect x="4" y="6" width="14" height="6" fill="#b91c1c" />
              <rect x="5" y="1" width="12" height="2" fill="#78350f" />
              {/* Bag of Chips & Drink inside basket */}
              <rect x="5" y="2" width="4" height="6" fill="#facc15" />
              <rect x="11" y="1" width="3" height="6" fill="#22c55e" />
            </g>
          )}

          {/* CENTER CASHIER CHECKOUT REGISTER COUNTER (Frog Stage) */}
          <g id="konbini-checkout-counter">
            {/* Front Counter Panel */}
            <rect x="52" y="62" width="56" height="20" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
            <rect x="54" y="64" width="52" height="4" fill="#10b981" />
            <rect x="54" y="70" width="52" height="1.5" fill="#ea580c" />
            <rect x="54" y="74" width="52" height="6" fill="#f8fafc" />

            {/* Counter Surface / Platform */}
            <rect x="48" y="58" width="64" height="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />

            {/* Digital POS Cash Register Terminal */}
            <rect x="92" y="48" width="14" height="12" fill="#1e293b" stroke="#475569" strokeWidth="0.6" />
            {/* Glowing Screen Display */}
            <rect x="94" y="50" width="10" height="6" fill="#0284c7" />
            <text x="99" y="54.5" fill="#ffffff" fontSize="2.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">¥850</text>
            <rect x="94" y="57" width="10" height="2" fill="#334155" />
            {/* Scanner Stand Cradle */}
            <rect x="88" y="56" width="2" height="3" fill="#64748b" />
            <rect x="89" y="53" width="2" height="3" fill="#64748b" />
            <rect x="89" y="51" width="2" height="2" fill="#ef4444" />

            {/* Fresh Onigiri & Bento Staging Tray on Counter */}
            <rect x="46" y="58" width="12" height="4" fill="#fef3c7" stroke="#d97706" strokeWidth="0.5" />
            <rect x="48" y="59" width="3" height="2" fill="#ffffff" />
            <rect x="53" y="59" width="3" height="2" fill="#ffffff" />
          </g>
        </g>
      )}

            {/* 3. COMPANION VISITOR LAYER (ALL PETS ANIMATED - FULL SIZE EQUAL TO FROG & PURE CRISP PIXEL ART) */}

            {/* A. Snail Friend (Crawling on right, equal size to frog, pixel shell, slime trail & hearts) */}
            {(config.companionId === 'snail' || config.companionId === 'companion_snail') && (() => {
              const crawlX = 104 + ((animTick * 0.8) % 8);
              const eyeStalkY = animTick % 2 === 0 ? 52 : 54;
              return (
                <g id="companion-snail" transform={`translate(${crawlX}, 0)`}>
                  {/* Glistening Slime Trail */}
                  <rect x="-12" y="78" width="12" height="2" fill="#FEF08A" opacity={0.6} />
                  {animTick % 2 === 0 && <rect x="-6" y="76" width="2" height="2" fill="#FACC15" />}
                  {/* Snail Body Foot */}
                  <rect x="0" y="74" width="24" height="6" fill="#F2E6CA" />
                  <rect x="18" y="64" width="7" height="12" fill="#F2E6CA" />
                  {/* Eyestalks */}
                  <rect x="19" y={eyeStalkY} width="2" height="11" fill="#4A3D2A" />
                  <rect x="23" y={eyeStalkY + (animTick % 2 === 0 ? 0 : 2)} width="2" height="11" fill="#4A3D2A" />
                  <rect x="18" y={eyeStalkY - 2} width="4" height="3" fill="#18181B" />
                  <rect x="23" y={eyeStalkY + (animTick % 2 === 0 ? -2 : 0)} width="4" height="3" fill="#18181B" />
                  <rect x="19" y={eyeStalkY - 2} width="1" height="1" fill="#FFFFFF" />
                  <rect x="24" y={eyeStalkY + (animTick % 2 === 0 ? -2 : 0)} width="1" height="1" fill="#FFFFFF" />
                  {/* Big Spiral Shell (Width ~18, Height ~18) */}
                  <rect x="2" y={58 + (animTick % 2 === 0 ? 0 : 1)} width="18" height="18" fill="#D4A373" />
                  <rect x="4" y={56 + (animTick % 2 === 0 ? 0 : 1)} width="14" height="22" fill="#D4A373" />
                  <rect x="4" y={59 + (animTick % 2 === 0 ? 0 : 1)} width="14" height="16" fill="#E2CCAB" />
                  <rect x="7" y={62 + (animTick % 2 === 0 ? 0 : 1)} width="8" height="10" fill="#8C5E32" />
                  <rect x="9" y={64 + (animTick % 2 === 0 ? 0 : 1)} width="4" height="6" fill="#D4A373" />
                  {/* Heart emote */}
                  {animTick % 4 === 0 && (
                    <g transform="translate(18, 48)">
                      <rect x="1" y="0" width="2" height="1" fill="#F43F5E" />
                      <rect x="4" y="0" width="2" height="1" fill="#F43F5E" />
                      <rect x="0" y="1" width="7" height="2" fill="#F43F5E" />
                      <rect x="1" y="3" width="5" height="1" fill="#F43F5E" />
                      <rect x="2" y="4" width="3" height="1" fill="#F43F5E" />
                      <rect x="3" y="5" width="1" height="1" fill="#F43F5E" />
                    </g>
                  )}
                </g>
              );
            })()}

            {/* B. Crab Friend (Sideways on left floor, equal size to frog, snapping big claws) */}
            {(config.companionId === 'crab' || config.companionId === 'companion_crab') && (() => {
              const crabX = 26 + ((animTick % 4) < 2 ? 0 : 3);
              const leftClawY = animTick % 2 === 0 ? 54 : 58;
              const rightClawY = animTick % 2 === 0 ? 58 : 54;
              return (
                <g id="companion-crab" transform={`translate(${crabX}, 0)`}>
                  {/* Crab Body (Width 22, Height 14) */}
                  <rect x="4" y="66" width="22" height="12" fill="#DC2626" />
                  <rect x="6" y="63" width="18" height="17" fill="#DC2626" />
                  <rect x="8" y="67" width="14" height="9" fill="#EF4444" />
                  {/* Left Big Claw */}
                  <g transform={`translate(0, ${leftClawY})`}>
                    <rect x="0" y="4" width="7" height="8" fill="#DC2626" />
                    <rect x="0" y="1" width="4" height="4" fill="#EF4444" />
                    <rect x="4" y="1" width="3" height="4" fill="#B91C1C" />
                  </g>
                  {/* Right Big Claw */}
                  <g transform={`translate(23, ${rightClawY})`}>
                    <rect x="0" y="4" width="7" height="8" fill="#DC2626" />
                    <rect x="0" y="1" width="3" height="4" fill="#B91C1C" />
                    <rect x="3" y="1" width="4" height="4" fill="#EF4444" />
                  </g>
                  {/* Eyestalks & Big Eyes */}
                  <rect x="9" y={animTick % 2 === 0 ? 57 : 59} width="4" height="7" fill="#FFFFFF" />
                  <rect x="17" y={animTick % 2 === 0 ? 59 : 57} width="4" height="7" fill="#FFFFFF" />
                  <rect x="10" y={animTick % 2 === 0 ? 58 : 60} width="3" height="3" fill="#18181B" />
                  <rect x="18" y={animTick % 2 === 0 ? 60 : 58} width="3" height="3" fill="#18181B" />
                  <rect x="10" y={animTick % 2 === 0 ? 58 : 60} width="1" height="1" fill="#FFFFFF" />
                  <rect x="18" y={animTick % 2 === 0 ? 60 : 58} width="1" height="1" fill="#FFFFFF" />
                  {/* Walking Legs */}
                  <rect x="3" y="77" width="4" height="3" fill="#991B1B" />
                  <rect x="23" y="77" width="4" height="3" fill="#991B1B" />
                  {/* Pixel Bubble */}
                  <rect x="14" y={52 - ((animTick * 2) % 10)} width="3" height="3" fill="#38BDF8" opacity={0.8} />
                </g>
              );
            })()}

            {/* C. Hotaru Fireflies Swarm (Large glowing pixel lanterns & sparkling aura) */}
            {(config.companionId === 'fireflies' || config.companionId === 'companion_fireflies') && (() => {
              const f1x = 24 + Math.sin(animTick * 0.4) * 8;
              const f1y = 44 + Math.cos(animTick * 0.3) * 6;
              const f2x = 126 + Math.cos(animTick * 0.35) * 8;
              const f2y = 40 + Math.sin(animTick * 0.5) * 6;
              const f3x = 34 + Math.sin(animTick * 0.6) * 6;
              const f3y = 30 + Math.cos(animTick * 0.4) * 5;
              const f4x = 132 + Math.cos(animTick * 0.45) * 6;
              const f4y = 62 + Math.sin(animTick * 0.3) * 5;

              return (
                <g id="companion-fireflies">
                  {/* Firefly 1 */}
                  <rect x={f1x - 3} y={f1y - 3} width="12" height="12" fill="#FEF08A" opacity={0.25 + (animTick % 2) * 0.15} />
                  <rect x={f1x - 1} y={f1y - 1} width="8" height="8" fill="#FACC15" />
                  <rect x={f1x + 1} y={f1y + 1} width="4" height="4" fill="#FFFFFF" />

                  {/* Firefly 2 */}
                  <rect x={f2x - 4} y={f2y - 4} width="14" height="14" fill="#FEF08A" opacity={0.3 - (animTick % 2) * 0.1} />
                  <rect x={f2x - 1} y={f2y - 1} width="8" height="8" fill="#FACC15" />
                  <rect x={f2x + 1} y={f2y + 1} width="4" height="4" fill="#FFFFFF" />

                  {/* Firefly 3 */}
                  <rect x={f3x - 2} y={f3y - 2} width="10" height="10" fill="#FDE047" opacity={0.25} />
                  <rect x={f3x} y={f3y} width="6" height="6" fill="#FACC15" />
                  <rect x={f3x + 1} y={f3y + 1} width="3" height="3" fill="#FFFFFF" />

                  {/* Firefly 4 */}
                  <rect x={f4x - 3} y={f4y - 3} width="10" height="10" fill="#FEF08A" opacity={0.25} />
                  <rect x={f4x - 1} y={f4y - 1} width="6" height="6" fill="#EAB308" />
                  <rect x={f4x} y={f4y} width="3" height="3" fill="#FFFFFF" />
                </g>
              );
            })()}

            {/* D. Flutter Butterfly (Flapping big wings in sky, equal presence) */}
            {(config.companionId === 'butterfly' || config.companionId === 'companion_butterfly') && (() => {
              const bX = 118 + Math.sin(animTick * 0.35) * 8;
              const bY = 36 + Math.cos(animTick * 0.45) * 6;
              const flap = animTick % 2 === 0;

              return (
                <g id="companion-butterfly" transform={`translate(${bX}, ${bY})`}>
                  {/* Trailing sparkle dust */}
                  <rect x="-6" y="6" width="2" height="2" fill="#93C5FD" opacity={0.8} />
                  <rect x="-10" y="2" width="2" height="2" fill="#FBCFE8" opacity={0.7} />
                  {/* Butterfly Body & Antennae */}
                  <rect x="10" y="4" width="4" height="18" fill="#0F172A" />
                  <rect x="9" y="0" width="2" height="4" fill="#0F172A" />
                  <rect x="13" y="0" width="2" height="4" fill="#0F172A" />
                  {/* Left Big Wing */}
                  <rect x={flap ? 0 : 4} y="2" width={flap ? 10 : 6} height="12" fill="#60A5FA" />
                  <rect x={flap ? 2 : 5} y="14" width={flap ? 8 : 5} height="10" fill="#38BDF8" />
                  <rect x={flap ? 3 : 6} y="5" width="4" height="5" fill="#BAE6FD" />
                  {/* Right Big Wing */}
                  <rect x="14" y="2" width={flap ? 10 : 6} height="12" fill="#60A5FA" />
                  <rect x="14" y="14" width={flap ? 8 : 5} height="10" fill="#38BDF8" />
                  <rect x="17" y="5" width="4" height="5" fill="#BAE6FD" />
                </g>
              );
            })()}

            {/* E. Koi Fish Swimming (Grand swimming koi on lower floor/water) */}
            {(config.companionId === 'koi' || config.companionId === 'companion_koi') && (() => {
              const koiX = 22 + ((animTick * 1.5) % 24);
              const koiY = 62 + Math.sin(animTick * 0.6) * 1.5;
              const tailFlip = animTick % 2 === 0;

              return (
                <g id="companion-koi" transform={`translate(${koiX}, ${koiY})`}>
                  {/* Water ripple rects */}
                  <rect x="-6" y="8" width="6" height="2" fill="#67E8F9" opacity={0.6} />
                  {/* Grand Fish Body (Width ~28, Height ~16) */}
                  <rect x="6" y="4" width="20" height="12" fill="#F8FAFC" />
                  <rect x="8" y="2" width="16" height="16" fill="#F8FAFC" />
                  <rect x="10" y="3" width="12" height="8" fill="#EA580C" />
                  <rect x="8" y="8" width="6" height="6" fill="#DC2626" />
                  {/* Big Tail Fin */}
                  <rect x={tailFlip ? 26 : 24} y="1" width="6" height="7" fill="#EA580C" />
                  <rect x={tailFlip ? 26 : 24} y="12" width="6" height="7" fill="#EA580C" />
                  {/* Eyes & Gills */}
                  <rect x="2" y="7" width="4" height="4" fill="#18181B" />
                  <rect x="2" y="7" width="2" height="2" fill="#FFFFFF" />
                  {/* Air Bubble */}
                  <rect x="0" y="2" width="3" height="3" fill="#E0F2FE" opacity={0.85} />
                </g>
              );
            })()}

            {/* F. Duckling Companion (Chunky cute yellow duck, equal size to frog) */}
            {(config.companionId === 'duckling' || config.companionId === 'companion_duckling') && (() => {
              const duckBob = animTick % 2 === 0 ? 0 : 2;
              const beakOpen = animTick % 4 === 0;

              return (
                <g id="companion-duckling" transform={`translate(108, ${54 + duckBob})`}>
                  {/* Chunky Yellow Body (Width 22, Height 16) */}
                  <rect x="8" y="10" width="18" height="14" fill="#FACC15" />
                  <rect x="6" y="12" width="20" height="10" fill="#FACC15" />
                  {/* Duck Head */}
                  <rect x="2" y="4" width="12" height="12" fill="#FACC15" />
                  <rect x="4" y="6" width="3" height="3" fill="#18181B" />
                  <rect x="4" y="6" width="1" height="1" fill="#FFFFFF" />
                  {/* Beak */}
                  <rect x="-3" y="8" width="6" height="4" fill="#EA580C" />
                  {beakOpen && (
                    <g transform="translate(-4, -6)">
                      <rect x="0" y="2" width="2" height="4" fill="#F59E0B" />
                      <rect x="2" y="0" width="4" height="2" fill="#F59E0B" />
                      <rect x="4" y="2" width="2" height="4" fill="#F59E0B" />
                    </g>
                  )}
                  {/* Wing */}
                  <rect x="10" y={animTick % 2 === 0 ? 12 : 10} width="10" height="7" fill="#EAB308" />
                  {/* Webbed Feet */}
                  <rect x="8" y="24" width="6" height="3" fill="#EA580C" />
                  <rect x="18" y="24" width="6" height="3" fill="#EA580C" />
                </g>
              );
            })()}

            {/* G. Cat Companion (Full-sized Starry Black Cat beside frog on left) */}
            {(config.companionId === 'cat' || config.companionId === 'companion_cat') && (() => {
              const tailWag = animTick % 2 === 0 ? 4 : 8;

              return (
                <g id="companion-cat" transform="translate(26, 52)">
                  {/* Black Cat Body (Width 22, Height 18) */}
                  <rect x="6" y="10" width="18" height="16" fill="#18181B" />
                  <rect x="4" y="12" width="22" height="12" fill="#18181B" />
                  {/* Head & Pointy Ears */}
                  <rect x="8" y="2" width="14" height="12" fill="#18181B" />
                  <rect x="6" y="0" width="5" height="4" fill="#18181B" />
                  <rect x="18" y="0" width="5" height="4" fill="#18181B" />
                  <rect x="7" y="1" width="3" height="3" fill="#FB7185" />
                  <rect x="19" y="1" width="3" height="3" fill="#FB7185" />
                  {/* Golden Glowing Eyes */}
                  <rect x="9" y="5" width="4" height="4" fill="#FACC15" />
                  <rect x="17" y="5" width="4" height="4" fill="#FACC15" />
                  <rect x="10" y="6" width="2" height="3" fill="#000000" />
                  <rect x="18" y="6" width="2" height="3" fill="#000000" />
                  {/* Collar & Bell */}
                  <rect x="8" y="13" width="14" height="2" fill="#DC2626" />
                  <rect x="13" y="14" width="4" height="4" fill="#FACC15" />
                  {/* Swaying Tail */}
                  <rect x="0" y={tailWag} width="6" height="10" fill="#18181B" />
                  {/* Paws */}
                  <rect x="8" y="26" width="4" height="3" fill="#27272A" />
                  <rect x="18" y="26" width="4" height="3" fill="#27272A" />
                </g>
              );
            })()}

            {/* H. Mossy Turtle (Chunky Mossy Turtle beside frog on right) */}
            {(config.companionId === 'turtle' || config.companionId === 'companion_turtle') && (() => {
              const headShift = animTick % 2 === 0 ? 0 : 2;

              return (
                <g id="companion-turtle" transform="translate(106, 56)">
                  {/* Big Mossy Shell (Width 24, Height 16) */}
                  <rect x="6" y="8" width="20" height="16" fill="#78350F" />
                  <rect x="8" y="6" width="16" height="20" fill="#78350F" />
                  <rect x="8" y="8" width="16" height="14" fill="#15803D" />
                  <rect x="10" y="10" width="12" height="10" fill="#22C55E" />
                  {/* Blossoming Flower on Shell */}
                  <rect x="14" y="4" width="5" height="5" fill="#F472B6" />
                  <rect x="15" y="5" width="3" height="3" fill="#FDE047" />
                  {/* Cute Turtle Head */}
                  <rect x={-headShift} y="10" width="8" height="8" fill="#166534" />
                  <rect x={1 - headShift} y="11" width="3" height="3" fill="#18181B" />
                  <rect x={1 - headShift} y="11" width="1" height="1" fill="#FFFFFF" />
                  {/* Flippers */}
                  <rect x="4" y="24" width="6" height="4" fill="#166534" />
                  <rect x="20" y="24" width="6" height="4" fill="#166534" />
                </g>
              );
            })()}

            {/* I. Chibi Wolf Pup (Full-sized Slate Grey Wolf beside frog) */}
            {(config.companionId === 'chibi_wolf_pup' || config.companionId === 'companion_chibi_wolf_pup') && (() => {
              const pupHop = animTick % 2 === 0 ? 0 : -2;

              return (
                <g id="companion-wolf-pup" transform={`translate(106, ${52 + pupHop})`}>
                  {/* Slate Grey Body (Width 22, Height 18) */}
                  <rect x="6" y="10" width="18" height="16" fill="#475569" />
                  <rect x="4" y="2" width="14" height="14" fill="#475569" />
                  <rect x="3" y="0" width="5" height="5" fill="#334155" />
                  <rect x="12" y="0" width="5" height="5" fill="#334155" />
                  {/* Golden Sparkly Eyes */}
                  <rect x="5" y="5" width="4" height="4" fill="#FACC15" />
                  <rect x="6" y="6" width="2" height="2" fill="#000000" />
                  {/* White Snout & Cute Pink Tongue */}
                  <rect x="0" y="8" width="8" height="6" fill="#F1F5F9" />
                  <rect x="0" y="8" width="3" height="3" fill="#18181B" />
                  {animTick % 2 === 0 && <rect x="2" y="12" width="4" height="3" fill="#FB7185" />}
                  {/* Fluffy Wagging Tail */}
                  <rect x="22" y={animTick % 2 === 0 ? 8 : 12} width="6" height="7" fill="#475569" />
                  {/* Paws */}
                  <rect x="5" y="26" width="4" height="3" fill="#334155" />
                  <rect x="18" y="26" width="4" height="3" fill="#334155" />
                </g>
              );
            })()}

            {/* J. Forest Hedgehog (Chunky Forest Hedgehog beside frog on left) */}
            {(config.companionId === 'forest_hedgehog' || config.companionId === 'companion_forest_hedgehog') && (() => {
              const trot = animTick % 2 === 0 ? 0 : 1;

              return (
                <g id="companion-hedgehog" transform={`translate(26, ${56 + trot})`}>
                  {/* Prickly Quills Body (Width 24, Height 18) */}
                  <rect x="4" y="6" width="20" height="16" fill="#78350F" />
                  <rect x="2" y="2" width="5" height="5" fill="#451A03" />
                  <rect x="9" y="1" width="5" height="5" fill="#451A03" />
                  <rect x="16" y="2" width="5" height="5" fill="#451A03" />
                  {/* Big Strawberry on Back */}
                  <rect x="8" y="-1" width="6" height="6" fill="#DC2626" />
                  <rect x="10" y="-3" width="3" height="3" fill="#16A34A" />
                  {/* Cute Snout & Blushing Cheeks */}
                  <rect x="22" y="12" width="7" height="8" fill="#FBBF24" />
                  <rect x="26" y="13" width="3" height="3" fill="#18181B" />
                  {/* Trotting Feet */}
                  <rect x="6" y="22" width="5" height="3" fill="#451A03" />
                  <rect x="18" y="22" width="5" height="3" fill="#451A03" />
                </g>
              );
            })()}

            {/* K. Sushi Apprentice Cat (Full-sized Chef Tama Calico beside frog) */}
            {(config.companionId === 'sushi_apprentice_cat' || config.companionId === 'companion_sushi_apprentice_cat') && (() => {
              const chefHop = animTick % 2 === 0 ? 0 : -2;

              return (
                <g id="companion-sushi-cat" transform={`translate(26, ${52 + chefHop})`}>
                  {/* White Calico Body & Head (Width 22, Height 18) */}
                  <rect x="6" y="10" width="18" height="16" fill="#FFFFFF" />
                  <rect x="7" y="13" width="6" height="6" fill="#FB923C" />
                  <rect x="16" y="15" width="5" height="5" fill="#1E293B" />
                  {/* Head & Ears */}
                  <rect x="8" y="2" width="14" height="12" fill="#FFFFFF" />
                  <rect x="7" y="0" width="5" height="4" fill="#FB923C" />
                  <rect x="17" y="0" width="5" height="4" fill="#1E293B" />
                  {/* Chef Headband */}
                  <rect x="7" y="4" width="16" height="2" fill="#DC2626" />
                  {/* Sparkling Blue Eyes */}
                  <rect x="9" y="6" width="3" height="3" fill="#1E3A8A" />
                  <rect x="17" y="6" width="3" height="3" fill="#1E3A8A" />
                  {/* Nigiri Plate Held */}
                  <g transform={`translate(20, ${animTick % 2 === 0 ? 10 : 12})`}>
                    <rect x="0" y="3" width="9" height="5" fill="#FFFFFF" />
                    <rect x="0" y="0" width="9" height="4" fill="#FB923C" />
                    <rect x="3" y="0" width="3" height="8" fill="#15803D" />
                  </g>
                  {/* Feet */}
                  <rect x="7" y="26" width="5" height="3" fill="#E2E8F0" />
                  <rect x="17" y="26" width="5" height="3" fill="#E2E8F0" />
                </g>
              );
            })()}

            {/* L. Mini Ebi Shrimp (Bouncy Golden Tempura Shrimp beside frog) */}
            {(config.companionId === 'mini_ebi_shrimp' || config.companionId === 'companion_mini_ebi_shrimp') && (() => {
              const shrimpHop = animTick % 3 === 1 ? -4 : 0;

              return (
                <g id="companion-ebi-shrimp" transform={`translate(108, ${54 + shrimpHop})`}>
                  {/* Tempura Body (Width 22, Height 16) */}
                  <rect x="6" y="8" width="18" height="13" fill="#EA580C" />
                  <rect x="8" y="6" width="14" height="17" fill="#F97316" />
                  <rect x="11" y="10" width="3" height="9" fill="#FED7AA" />
                  {/* Crispy Tail */}
                  <rect x="22" y="3" width="7" height="5" fill="#DC2626" />
                  <rect x="22" y="16" width="7" height="5" fill="#EA580C" />
                  {/* Face */}
                  <rect x="3" y="11" width="4" height="4" fill="#18181B" />
                  <rect x="3" y="11" width="1" height="1" fill="#FFFFFF" />
                  <rect x="6" y="16" width="3" height="3" fill="#FB7185" />
                  {/* Antennae */}
                  <rect x="-2" y="5" width="5" height="3" fill="#EA580C" />
                  <rect x="-2" y="16" width="5" height="3" fill="#EA580C" />
                </g>
              );
            })()}

            {/* M. Konbini Cashier Lucky Cat (Full-sized Lucky Cat beside frog on right) */}
            {(config.companionId === 'konbini_cashier_cat' || config.companionId === 'companion_konbini_cashier_cat') && (() => {
              const waveY = animTick % 2 === 0 ? 2 : 6;

              return (
                <g id="companion-konbini-cat" transform="translate(106, 50)">
                  {/* White Cat Body & Head (Width 22, Height 22) */}
                  <rect x="6" y="12" width="18" height="16" fill="#FFFFFF" />
                  <rect x="8" y="4" width="14" height="12" fill="#FFFFFF" />
                  <rect x="7" y="1" width="5" height="4" fill="#FB7185" />
                  <rect x="17" y="1" width="5" height="4" fill="#FB7185" />
                  {/* Green Store Visor */}
                  <rect x="6" y={animTick % 2 === 0 ? 3 : 5} width="18" height="4" fill="#10B981" />
                  {/* Cat Eyes */}
                  <rect x="9" y="8" width="3" height="3" fill="#1E293B" />
                  <rect x="17" y="8" width="3" height="3" fill="#1E293B" />
                  {/* Green Staff Apron with Shiny ¥ Gold Coin */}
                  <rect x="7" y="16" width="16" height="10" fill="#10B981" />
                  <rect x="12" y="18" width="6" height="6" fill="#FACC15" />
                  {/* Beckoning Waving Paw */}
                  <g transform={`translate(-2, ${waveY})`}>
                    <rect x="0" y="0" width="7" height="8" fill="#FFFFFF" />
                    <rect x="2" y="2" width="3" height="3" fill="#FB7185" />
                  </g>
                  {/* Feet */}
                  <rect x="7" y="28" width="5" height="3" fill="#E2E8F0" />
                  <rect x="17" y="28" width="5" height="3" fill="#E2E8F0" />
                </g>
              );
            })()}

            {/* N. Snack Basket Shiba Inu (Full-sized Shiba in Red Shopping Basket on left) */}
            {(config.companionId === 'snack_shiba' || config.companionId === 'companion_snack_shiba') && (() => {
              const headBob = animTick % 2 === 0 ? 0 : -2;

              return (
                <g id="companion-snack-shiba" transform="translate(24, 52)">
                  {/* Red Konbini Basket Container (Width 28, Height 16) */}
                  <rect x="0" y="12" width="28" height="16" fill="#DC2626" />
                  <rect x="2" y="14" width="24" height="12" fill="#B91C1C" />
                  {/* Shiba Inu Body & Head */}
                  <g transform={`translate(0, ${headBob})`}>
                    <rect x="8" y="4" width="16" height="13" fill="#D97706" />
                    <rect x="8" y="1" width="5" height="5" fill="#B45309" />
                    <rect x="18" y="1" width="5" height="5" fill="#B45309" />
                    <rect x="10" y="5" width="3" height="3" fill="#18181B" />
                    <rect x="18" y="5" width="3" height="3" fill="#18181B" />
                    <rect x="11" y="8" width="8" height="6" fill="#FFFFFF" />
                    <rect x="14" y="9" width="3" height="3" fill="#18181B" />
                    {animTick % 2 === 0 && <rect x="14" y="12" width="3" height="3" fill="#FB7185" />}
                  </g>
                  {/* Fluffy Curly Tail */}
                  <rect x="24" y={animTick % 2 === 0 ? 6 : 10} width="5" height="5" fill="#D97706" />
                  {/* Chip Bag */}
                  <rect x="2" y="8" width="6" height="8" fill="#FACC15" />
                </g>
              );
            })()}

            {/* O. 8-Bit Pixel Ghost Companion (Blinky floating near arcade machine) */}
            {(config.companionId === 'pixel_arcade_ghost' || config.companionId === 'companion_pixel_arcade_ghost') && (() => {
              const ghostFloat = Math.sin(animTick * 0.8) * 3;
              const fringeAlt = animTick % 2 === 0;

              return (
                <g id="companion-pixel-ghost" transform={`translate(108, ${48 + ghostFloat})`}>
                  {/* Neon Glow Circle underneath */}
                  <ellipse cx="11" cy="24" rx="10" ry="3" fill="#EC4899" opacity="0.25" />

                  {/* 8-Bit Ghost Body (Width 22, Height 20) */}
                  <rect x="4" y="2" width="14" height="4" fill="#EC4899" />
                  <rect x="2" y="6" width="18" height="12" fill="#EC4899" />

                  {/* Animated Pixel Bottom Fringe */}
                  {fringeAlt ? (
                    <g fill="#EC4899">
                      <rect x="2" y="18" width="4" height="4" />
                      <rect x="9" y="18" width="4" height="4" />
                      <rect x="16" y="18" width="4" height="4" />
                    </g>
                  ) : (
                    <g fill="#EC4899">
                      <rect x="5" y="18" width="4" height="4" />
                      <rect x="13" y="18" width="4" height="4" />
                    </g>
                  )}

                  {/* Big Expressive Pixel Eyes */}
                  <rect x="4" y="7" width="5" height="5" fill="#FFFFFF" />
                  <rect x="13" y="7" width="5" height="5" fill="#FFFFFF" />
                  {/* Eye Pupils looking at frog */}
                  <rect x="4" y="9" width="3" height="3" fill="#1E3A8A" />
                  <rect x="13" y="9" width="3" height="3" fill="#1E3A8A" />

                  {/* Floating Pixel Sparkles */}
                  <rect x="19" y="0" width="2" height="2" fill="#FDE047" opacity="0.9" />
                  <rect x="-1" y="12" width="2" height="2" fill="#38BDF8" opacity="0.8" />
                </g>
              );
            })()}

            {/* P. Retro Tamagotchi Virtual Pet Companion */}
            {(config.companionId === 'retro_tamagotchi' || config.companionId === 'companion_retro_tamagotchi') && (() => {
              const tamaBounce = animTick % 2 === 0 ? 0 : -2;

              return (
                <g id="companion-retro-tamagotchi" transform={`translate(26, ${50 + tamaBounce})`}>
                  {/* Pedestal Stand / Glow Shadow */}
                  <ellipse cx="12" cy="24" rx="10" ry="3" fill="#000000" opacity="0.25" />

                  {/* Keychain Ring at top */}
                  <rect x="10" y="0" width="4" height="3" fill="#94A3B8" stroke="#475569" strokeWidth="0.5" />
                  <rect x="11" y="1" width="2" height="1" fill="#F8FAFC" />

                  {/* Egg-shaped Shell */}
                  <rect x="5" y="3" width="14" height="19" fill="#FACC15" />
                  <rect x="3" y="5" width="18" height="15" fill="#FACC15" />
                  <rect x="2" y="7" width="20" height="11" fill="#FACC15" />
                  <rect x="4" y="5" width="2" height="14" fill="#FEF08A" />

                  {/* LCD Screen */}
                  <rect x="5" y="6" width="14" height="10" fill="#9BBC0F" stroke="#0F380F" strokeWidth="0.6" />

                  {/* Pixel Creature bouncing inside LCD */}
                  <rect x="9" y={animTick % 2 === 0 ? 9 : 8} width="5" height="4" fill="#0F380F" />
                  <rect x="8" y={animTick % 2 === 0 ? 11 : 10} width="7" height="2" fill="#0F380F" />
                  {animTick % 2 === 0 ? (
                    <rect x="15" y="7" width="2" height="2" fill="#0F380F" />
                  ) : (
                    <rect x="6" y="7" width="2" height="2" fill="#0F380F" />
                  )}

                  {/* 3 Push Buttons */}
                  <rect x="6" y="18" width="2" height="2" fill="#EC4899" />
                  <rect x="11" y="18" width="2" height="2" fill="#EC4899" />
                  <rect x="16" y="18" width="2" height="2" fill="#EC4899" />
                </g>
              );
            })()}

            {/* 4. FROG CHARACTER (DYNAMICALLY MOVING, HOPPING & INTERACTING ACROSS SCENE) */}
            {(() => {
              const frogY = config.isAnimated && animTick % 2 === 0 ? 56 : 57;
              const frogX = 72;
              const skin = getSkinColors(config.skinId);

              // Dynamic offsets from autonomous roaming & jumping
              const dx = frogPos.x - 72;
              const dy = frogPos.y - 56;
              const hopArc = isHopping
                ? -Math.sin(hopProgress * Math.PI) * 13
                : actionState === 'happy_jump'
                ? -Math.abs(Math.sin(animTick * 1.5)) * 8
                : 0;
              const shadowScale = isHopping ? Math.max(0.35, 1 - Math.abs(hopArc) / 16) : 1;

              return (
                <g
                  id="pixel-frog-hero"
                  transform={`translate(${dx}, ${dy + hopArc}) ${facing === 'left' ? 'translate(160, 0) scale(-1, 1)' : ''}`}
                >
                  {/* Dynamic Frog Pixel Shadow */}
                  <rect
                    x={frogX + 8 - 14 * shadowScale}
                    y={frogY + 24 - hopArc}
                    width={28 * shadowScale}
                    height={4 * shadowScale}
                    fill="#000000"
                    opacity={0.35 * shadowScale}
                  />
                  <rect
                    x={frogX + 8 - 10 * shadowScale}
                    y={frogY + 23 - hopArc}
                    width={20 * shadowScale}
                    height={6 * shadowScale}
                    fill="#000000"
                    opacity={0.35 * shadowScale}
                  />

                  {/* Cute Action / Emotion Speech Bubble */}
                  {actionBubble && (
                    <g transform={`translate(${frogX + 8}, ${frogY - 6})`} className="animate-bounce">
                      <rect x="-8" y="-12" width="16" height="11" fill="#FFFFFF" stroke="#18181B" strokeWidth="0.8" />
                      <rect x="-2" y="-1" width="4" height="2" fill="#FFFFFF" stroke="#18181B" strokeWidth="0.8" />
                      <rect x="-1" y="1" width="2" height="2" fill="#FFFFFF" stroke="#18181B" strokeWidth="0.8" />
                      <rect x="-1" y="-1.5" width="2" height="1" fill="#FFFFFF" />
                      <text x="0" y="-4.5" fontSize="6.5" textAnchor="middle" dominantBaseline="middle">
                        {actionBubble}
                      </text>
                    </g>
                  )}

                  {/* Sleeping Pose special handling */}
                  {config.activityId === 'sleeping' ? (
                    <g>
                      {/* Cozy Quilt Blanket */}
                      <rect x={frogX - 6} y={frogY + 6} width="28" height="18" fill="#0284C7" />
                      <rect x={frogX - 4} y={frogY + 8} width="24" height="3" fill="#38BDF8" />
                      <rect x={frogX - 4} y={frogY + 14} width="24" height="3" fill="#38BDF8" />

                      {/* Frog Head on White Pillow */}
                      <rect x={frogX - 10} y={frogY + 2} width="16" height="14" fill="#F8FAFC" />
                      <rect x={frogX - 6} y={frogY + 2} width="16" height="10" fill={skin.main} />
                      <rect x={frogX - 8} y={frogY} width="6" height="4" fill={skin.main} />

                      {/* Closed Sleepy Eyes (- -) */}
                      <rect x={frogX - 2} y={frogY + 5} width="4" height="1" fill={skin.outline} />
                      <rect x={frogX + 4} y={frogY + 5} width="4" height="1" fill={skin.outline} />

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
                      <rect x={frogX} y={frogY} width="5" height="5" fill={skin.outline} />
                      <rect x={frogX + 11} y={frogY} width="5" height="5" fill={skin.outline} />
                      <rect x={frogX + 1} y={frogY + 1} width="3" height="3" fill={skin.main} />
                      <rect x={frogX + 12} y={frogY + 1} width="3" height="3" fill={skin.main} />
                      <rect x={frogX + 2} y={frogY + 1} width="1" height="1" fill={skin.eyeHighlight} />
                      <rect x={frogX + 13} y={frogY + 1} width="1" height="1" fill={skin.eyeHighlight} />

                      {/* Frog Body / Head Main */}
                      <rect x={frogX - 2} y={frogY + 4} width="20" height="16" fill={skin.main} />
                      <rect x={frogX - 3} y={frogY + 6} width="1" height="12" fill={skin.outline} />
                      <rect x={frogX + 18} y={frogY + 6} width="1" height="12" fill={skin.outline} />
                      <rect x={frogX} y={frogY + 20} width="16" height="1" fill={skin.outline} />

                      {/* Cream Belly */}
                      <rect x={frogX + 3} y={frogY + 11} width="10" height="7" fill={skin.belly} />

                      {/* Rosy Cheeks */}
                      <rect x={frogX - 1} y={frogY + 10} width="3" height="2" fill={skin.cheeks} />
                      <rect x={frogX + 14} y={frogY + 10} width="3" height="2" fill={skin.cheeks} />

                      {/* Frog Face Expression (Mood & Activity Adapted) */}
                      {config.activityId === 'meditating' ? (
                        /* Zen Meditating Closed Eyes */
                        <g>
                          <rect x={frogX + 2} y={frogY + 7} width="4" height="1" fill={skin.outline} />
                          <rect x={frogX + 10} y={frogY + 7} width="4" height="1" fill={skin.outline} />
                          <rect x={frogX + 6} y={frogY + 11} width="4" height="1" fill={skin.outline} />
                          {/* Floating Aura Sparkles */}
                          <rect x={frogX - 6} y={frogY - 4} width="2" height="2" fill="#FACC15" />
                          <rect x={frogX + 20} y={frogY - 2} width="2" height="2" fill="#FACC15" />
                          <rect x={frogX + 7} y={frogY - 8} width="2" height="2" fill="#FEF08A" />
                        </g>
                      ) : (
                        /* Happy Eyes & Smile */
                        <g>
                          <rect x={frogX + 2} y={frogY + 7} width="3" height="2" fill={skin.outline} />
                          <rect x={frogX + 2} y={frogY + 7} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 11} y={frogY + 7} width="3" height="2" fill={skin.outline} />
                          <rect x={frogX + 11} y={frogY + 7} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 6} y={frogY + 11} width="4" height="1" fill={skin.outline} />
                          <rect x={frogX + 5} y={frogY + 10} width="1" height="1" fill={skin.outline} />
                          <rect x={frogX + 10} y={frogY + 10} width="1" height="1" fill={skin.outline} />
                        </g>
                      )}

                      {/* Frog Legs / Feet */}
                      <rect x={frogX - 4} y={frogY + 18} width="6" height="3" fill={skin.legs} />
                      <rect x={frogX + 14} y={frogY + 18} width="6" height="3" fill={skin.legs} />

                      {/* OUTFIT CLOTHING LAYER */}
                      {config.outfitId === 'kimono' && (
                        <g>
                          <rect x={frogX - 2} y={frogY + 11} width="20" height="9" fill="#1E3A8A" />
                          <rect x={frogX} y={frogY + 11} width="16" height="9" fill="#2563EB" />
                          <rect x={frogX + 1} y={frogY + 14} width="14" height="3" fill="#FACC15" />
                          <rect x={frogX + 6} y={frogY + 13} width="4" height="5" fill="#EAB308" />
                        </g>
                      )}

                      {config.outfitId === 'raincoat' && (
                        <g>
                          <rect x={frogX - 2} y={frogY + 10} width="20" height="10" fill="#FACC15" />
                          <rect x={frogX} y={frogY + 11} width="16" height="8" fill="#EAB308" />
                          <rect x={frogX + 7} y={frogY + 12} width="2" height="2" fill="#713F12" />
                          <rect x={frogX + 7} y={frogY + 16} width="2" height="2" fill="#713F12" />
                        </g>
                      )}

                      {config.outfitId === 'sweater' && (
                        <g>
                          <rect x={frogX - 2} y={frogY + 10} width="20" height="10" fill="#EA580C" />
                          <rect x={frogX} y={frogY + 11} width="16" height="8" fill="#F97316" />
                          <rect x={frogX + 2} y={frogY + 13} width="12" height="1" fill="#C2410C" />
                          <rect x={frogX + 2} y={frogY + 16} width="12" height="1" fill="#C2410C" />
                        </g>
                      )}

                      {config.outfitId === 'ninja' && (
                        <g>
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#18181B" />
                          <rect x={frogX} y={frogY + 14} width="16" height="2" fill="#DC2626" />
                        </g>
                      )}

                      {config.outfitId === 'sailor' && (
                        <g>
                          <rect x={frogX - 1} y={frogY + 11} width="18" height="9" fill="#FFFFFF" />
                          <rect x={frogX + 1} y={frogY + 11} width="14" height="3" fill="#1E40AF" />
                          <rect x={frogX + 6} y={frogY + 13} width="4" height="4" fill="#DC2626" />
                        </g>
                      )}

                      {config.outfitId === 'apron' && (
                        <g>
                          <rect x={frogX + 1} y={frogY + 11} width="14" height="9" fill="#78350F" />
                          <rect x={frogX + 4} y={frogY + 14} width="8" height="5" fill="#A16207" />
                          <rect x={frogX + 6} y={frogY + 15} width="4" height="1" fill="#FEF08A" />
                        </g>
                      )}

                      {config.outfitId === 'overalls' && (
                        <g>
                          <rect x={frogX} y={frogY + 13} width="16" height="7" fill="#2563EB" />
                          <rect x={frogX + 2} y={frogY + 10} width="3" height="4" fill="#1D4ED8" />
                          <rect x={frogX + 11} y={frogY + 10} width="3" height="4" fill="#1D4ED8" />
                          <rect x={frogX + 2} y={frogY + 12} width="2" height="2" fill="#FACC15" />
                          <rect x={frogX + 12} y={frogY + 12} width="2" height="2" fill="#FACC15" />
                        </g>
                      )}

                      {config.outfitId === 'scarf' && (
                        <g>
                          <rect x={frogX - 2} y={frogY + 10} width="20" height="4" fill="#DC2626" />
                          <rect x={frogX + 12} y={frogY + 13} width="4" height="7" fill="#B91C1C" />
                          <rect x={frogX + 12} y={frogY + 19} width="4" height="1" fill="#FEF08A" />
                        </g>
                      )}

                      {config.outfitId === 'business' && (
                        <g>
                          <rect x={frogX - 1} y={frogY + 11} width="18" height="9" fill="#334155" />
                          <rect x={frogX + 4} y={frogY + 11} width="8" height="2" fill="#FFFFFF" />
                          <rect x={frogX + 5} y={frogY + 13} width="6" height="2" fill="#FFFFFF" />
                          <rect x={frogX + 6} y={frogY + 15} width="4" height="2" fill="#FFFFFF" />
                          <rect x={frogX + 6} y={frogY + 12} width="4" height="2" fill="#DC2626" />
                        </g>
                      )}

                      {config.outfitId === 'hoodie' && (
                        <g>
                          <rect x={frogX - 3} y={frogY + 7} width="22" height="13" fill="#10B981" />
                          <rect x={frogX - 1} y={frogY + 5} width="4" height="3" fill="#059669" />
                          <rect x={frogX + 13} y={frogY + 5} width="4" height="3" fill="#059669" />
                          <rect x={frogX + 3} y={frogY + 14} width="10" height="5" fill="#059669" />
                        </g>
                      )}

                      {config.outfitId === 'red_riding_dress' && (
                        <g>
                          <rect x={frogX - 2} y={frogY + 10} width="20" height="10" fill="#BE123C" />
                          <rect x={frogX + 1} y={frogY + 10} width="14" height="9" fill="#991B1B" />
                          <rect x={frogX + 3} y={frogY + 11} width="10" height="8" fill="#FFFFFF" />
                          <rect x={frogX + 6} y={frogY + 12} width="4" height="1" fill="#18181B" />
                          <rect x={frogX + 6} y={frogY + 14} width="4" height="1" fill="#18181B" />
                        </g>
                      )}

                      {config.outfitId === 'wolf_fur_cloak' && (
                        <g>
                          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#334155" />
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="3" fill="#64748B" />
                          <rect x={frogX + 2} y={frogY + 12} width="12" height="9" fill="#1E293B" />
                          <rect x={frogX + 6} y={frogY + 10} width="4" height="3" fill="#FEF08A" />
                          <rect x={frogX + 7} y={frogY + 10} width="2" height="2" fill="#DC2626" />
                        </g>
                      )}

                      {config.outfitId === 'hunter_woodsman' && (
                        <g>
                          <rect x={frogX - 1} y={frogY + 10} width="18" height="10" fill="#15803D" />
                          <rect x={frogX + 1} y={frogY + 10} width="14" height="10" fill="#166534" />
                          <rect x={frogX - 1} y={frogY + 14} width="18" height="2" fill="#78350F" />
                          <rect x={frogX + 6} y={frogY + 13} width="4" height="4" fill="#FACC15" />
                          <rect x={frogX + 7} y={frogY + 14} width="2" height="2" fill="#78350F" />
                        </g>
                      )}

                      {config.outfitId === 'sushi_chef_happi' && (
                        <g>
                          <rect x={frogX - 2} y={frogY + 10} width="20" height="10" fill="#FFFFFF" />
                          <rect x={frogX} y={frogY + 10} width="16" height="10" fill="#F8FAFC" />
                          <rect x={frogX - 2} y={frogY + 10} width="3" height="10" fill="#1E3A8A" />
                          <rect x={frogX + 15} y={frogY + 10} width="3" height="10" fill="#1E3A8A" />
                          <rect x={frogX + 1} y={frogY + 15} width="14" height="2" fill="#1E3A8A" />
                          <rect x={frogX + 6} y={frogY + 12} width="4" height="4" fill="#2563EB" />
                        </g>
                      )}

                      {config.outfitId === 'sushi_kimono_waiter' && (
                        <g>
                          <rect x={frogX - 2} y={frogY + 10} width="20" height="10" fill="#312E81" />
                          <rect x={frogX} y={frogY + 10} width="16" height="10" fill="#3730A3" />
                          <rect x={frogX - 1} y={frogY + 13} width="18" height="3" fill="#DC2626" />
                          <rect x={frogX + 6} y={frogY + 12} width="4" height="5" fill="#FACC15" />
                        </g>
                      )}

                      {config.outfitId === 'konbini_staff_uniform' && (
                        <g id="scene-outfit-konbini-staff">
                          <rect x={frogX - 2} y={frogY + 10} width="20" height="10" fill="#FFFFFF" />
                          <rect x={frogX} y={frogY + 10} width="16" height="10" fill="#F8FAFC" />
                          <rect x={frogX - 2} y={frogY + 10} width="20" height="3" fill="#10B981" />
                          <rect x={frogX + 6} y={frogY + 10} width="4" height="3" fill="#059669" />
                          <rect x={frogX - 2} y={frogY + 13} width="20" height="1.5" fill="#EA580C" />
                          <rect x={frogX + 11} y={frogY + 14} width="4" height="3" fill="#FEF08A" stroke="#78350F" strokeWidth="0.5" />
                          <rect x={frogX + 12} y={frogY + 15} width="2" height="1" fill="#1E293B" />
                        </g>
                      )}

                      {config.outfitId === 'shopper_cozy_sweatset' && (
                        <g id="scene-outfit-shopper">
                          <rect x={frogX - 3} y={frogY + 8} width="22" height="13" fill="#8B5CF6" />
                          <rect x={frogX - 1} y={frogY + 7} width="18" height="12" fill="#A78BFA" />
                          <rect x={frogX + 3} y={frogY + 14} width="10" height="5" fill="#7C3AED" />
                          <rect x={frogX + 5} y={frogY + 10} width="6" height="2" fill="#DDD6FE" />
                        </g>
                      )}

                      {config.outfitId === 'arcade_gamer_bomber' && (
                        <g id="scene-outfit-arcade-bomber">
                          <rect x={frogX - 3} y={frogY + 8} width="22" height="13" fill="#581C87" />
                          <rect x={frogX - 1} y={frogY + 7} width="18" height="12" fill="#7E22CE" />
                          <rect x={frogX - 3} y={frogY + 9} width="4" height="10" fill="#06B6D4" />
                          <rect x={frogX + 15} y={frogY + 9} width="4" height="10" fill="#06B6D4" />
                          <rect x={frogX + 7} y={frogY + 8} width="2" height="11" fill="#FACC15" />
                          <rect x={frogX + 2} y={frogY + 11} width="3" height="3" fill="#EC4899" />
                          <rect x={frogX + 11} y={frogY + 11} width="3" height="3" fill="#22D3EE" />
                        </g>
                      )}

                      {config.outfitId === 'pixel_hero_armor' && (
                        <g id="scene-outfit-hero-armor">
                          <rect x={frogX - 3} y={frogY + 8} width="22" height="13" fill="#7C3AED" />
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#94A3B8" />
                          <rect x={frogX} y={frogY + 9} width="16" height="10" fill="#CBD5E1" />
                          <rect x={frogX + 6} y={frogY + 11} width="4" height="4" fill="#FACC15" />
                          <rect x={frogX + 7} y={frogY + 10} width="2" height="6" fill="#FEF08A" />
                          <rect x={frogX - 1} y={frogY + 15} width="18" height="2" fill="#475569" />
                        </g>
                      )}

                      {config.outfitId === 'retro_esports_jersey' && (
                        <g id="scene-outfit-esports-jersey">
                          <rect x={frogX - 3} y={frogY + 8} width="22" height="13" fill="#0F172A" />
                          <rect x={frogX - 1} y={frogY + 7} width="18" height="12" fill="#1E293B" />
                          <rect x={frogX - 3} y={frogY + 8} width="3" height="12" fill="#06B6D4" />
                          <rect x={frogX + 16} y={frogY + 8} width="3" height="12" fill="#06B6D4" />
                          <rect x={frogX + 4} y={frogY + 11} width="8" height="5" fill="#FACC15" />
                          <rect x={frogX + 6} y={frogY + 12} width="4" height="3" fill="#0F172A" />
                        </g>
                      )}

                      {/* GLASSES / FACE ACCESSORY LAYER */}
                      {config.glassesId === 'reading' && (
                        <g>
                          <rect x={frogX} y={frogY + 6} width="6" height="5" fill="#D97706" />
                          <rect x={frogX + 1} y={frogY + 7} width="4" height="3" fill="#E0F2FE" />
                          <rect x={frogX + 1} y={frogY + 7} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 10} y={frogY + 6} width="6" height="5" fill="#D97706" />
                          <rect x={frogX + 11} y={frogY + 7} width="4" height="3" fill="#E0F2FE" />
                          <rect x={frogX + 11} y={frogY + 7} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 6} y={frogY + 8} width="4" height="1" fill="#D97706" />
                        </g>
                      )}

                      {config.glassesId === 'sunglasses' && (
                        <g>
                          <rect x={frogX - 1} y={frogY + 6} width="8" height="5" fill="#18181B" />
                          <rect x={frogX + 9} y={frogY + 6} width="8" height="5" fill="#18181B" />
                          <rect x={frogX + 7} y={frogY + 7} width="2" height="2" fill="#18181B" />
                          <rect x={frogX} y={frogY + 7} width="2" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 10} y={frogY + 7} width="2" height="1" fill="#FFFFFF" />
                        </g>
                      )}

                      {config.glassesId === 'monocle' && (
                        <g>
                          <rect x={frogX + 10} y={frogY + 6} width="6" height="5" fill="#EAB308" />
                          <rect x={frogX + 11} y={frogY + 7} width="4" height="3" fill="#E0F2FE" />
                          <rect x={frogX + 11} y={frogY + 7} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 16} y={frogY + 8} width="1" height="8" fill="#CA8A04" />
                        </g>
                      )}

                      {config.glassesId === 'blush_stars' && (
                        <g>
                          <rect x={frogX - 1} y={frogY + 9} width="2" height="2" fill="#FACC15" />
                          <rect x={frogX + 15} y={frogY + 9} width="2" height="2" fill="#FACC15" />
                        </g>
                      )}

                      {config.glassesId === 'sparkles' && (
                        <g>
                          <rect x={frogX - 5} y={frogY + 2} width="2" height="2" fill="#FEF08A" />
                          <rect x={frogX + 19} y={frogY + 3} width="2" height="2" fill="#FEF08A" />
                          <rect x={frogX + 7} y={frogY - 4} width="2" height="2" fill="#FACC15" />
                        </g>
                      )}

                      {config.glassesId === 'eyepatch' && (
                        <g>
                          <rect x={frogX} y={frogY + 6} width="6" height="5" fill="#1C1917" />
                          <rect x={frogX - 2} y={frogY + 5} width="3" height="2" fill="#1C1917" />
                          <rect x={frogX + 5} y={frogY + 7} width="7" height="2" fill="#1C1917" />
                          <rect x={frogX + 12} y={frogY + 9} width="6" height="2" fill="#1C1917" />
                        </g>
                      )}

                      {config.glassesId === 'forest_blush_freckles' && (
                        <g>
                          <rect x={frogX - 1} y={frogY + 9} width="2" height="2" fill="#DC2626" opacity="0.6" />
                          <rect x={frogX + 2} y={frogY + 10} width="2" height="2" fill="#78350F" />
                          <rect x={frogX + 14} y={frogY + 10} width="2" height="2" fill="#78350F" />
                          <rect x={frogX + 16} y={frogY + 9} width="2" height="2" fill="#DC2626" opacity="0.6" />
                        </g>
                      )}

                      {config.glassesId === 'wolf_snarl_fangs' && (
                        <g>
                          <rect x={frogX + 5} y={frogY + 10} width="2" height="3" fill="#FFFFFF" />
                          <rect x={frogX + 9} y={frogY + 10} width="2" height="3" fill="#FFFFFF" />
                        </g>
                      )}

                      {config.glassesId === 'wasabi_sparkle' && (
                        <g>
                          <rect x={frogX - 1} y={frogY + 9} width="2" height="2" fill="#84CC16" />
                          <rect x={frogX + 15} y={frogY + 9} width="2" height="2" fill="#84CC16" />
                          <rect x={frogX + 7} y={frogY - 3} width="2" height="2" fill="#A3E635" />
                        </g>
                      )}

                      {config.glassesId === 'scanner_headset' && (
                        <g id="scene-glasses-headset">
                          <rect x={frogX - 3} y={frogY + 6} width="3" height="6" fill="#1E293B" />
                          <rect x={frogX - 1} y={frogY + 4} width="2" height="2" fill="#334155" />
                          <rect x={frogX + 1} y={frogY + 2} width="2" height="2" fill="#334155" />
                          <rect x={frogX + 3} y={frogY} width="3" height="2" fill="#334155" />
                          <rect x={frogX - 2} y={frogY + 10} width="3" height="2" fill="#334155" />
                          <rect x={frogX + 1} y={frogY + 11} width="3" height="2" fill="#334155" />
                          <rect x={frogX + 3} y={frogY + 11} width="2" height="2" fill="#10B981" />
                          <rect x={frogX - 3} y={frogY + 7} width="2" height="2" fill="#38BDF8" />
                        </g>
                      )}

                      {config.glassesId === 'konbini_blush' && (
                        <g id="scene-glasses-blush">
                          <rect x={frogX - 2} y={frogY + 9} width="3" height="2" fill="#FB7185" />
                          <rect x={frogX + 15} y={frogY + 9} width="3" height="2" fill="#FB7185" />
                          <rect x={frogX} y={frogY + 8} width="2" height="1" fill="#FDE047" />
                          <rect x={frogX + 16} y={frogY + 8} width="2" height="1" fill="#FDE047" />
                        </g>
                      )}

                      {config.glassesId === 'cyber_pixel_shades' && (
                        <g id="scene-glasses-cyber-shades">
                          <rect x={frogX - 2} y={frogY + 5} width="8" height="3" fill="#09090B" />
                          <rect x={frogX - 1} y={frogY + 8} width="6" height="3" fill="#09090B" />
                          <rect x={frogX + 10} y={frogY + 5} width="8" height="3" fill="#09090B" />
                          <rect x={frogX + 11} y={frogY + 8} width="6" height="3" fill="#09090B" />
                          <rect x={frogX + 6} y={frogY + 6} width="4" height="2" fill="#09090B" />
                          <rect x={frogX - 1} y={frogY + 6} width="2" height="1" fill="#FFFFFF" />
                          <rect x={frogX} y={frogY + 7} width="2" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 11} y={frogY + 6} width="2" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 12} y={frogY + 7} width="2" height="1" fill="#FFFFFF" />
                          <rect x={frogX - 1} y={frogY + 9} width="2" height="1" fill="#22D3EE" opacity="0.8" />
                          <rect x={frogX + 11} y={frogY + 9} width="2" height="1" fill="#22D3EE" opacity="0.8" />
                        </g>
                      )}

                      {config.glassesId === 'game_over_dizzy' && (
                        <g id="scene-glasses-dizzy">
                          <rect x={frogX} y={frogY + 5} width="6" height="6" fill="#FACC15" />
                          <rect x={frogX + 1} y={frogY + 6} width="4" height="4" fill="#0F172A" />
                          <rect x={frogX + 2} y={frogY + 7} width="2" height="2" fill="#EC4899" />
                          <rect x={frogX + 10} y={frogY + 5} width="6" height="6" fill="#FACC15" />
                          <rect x={frogX + 11} y={frogY + 6} width="4" height="4" fill="#0F172A" />
                          <rect x={frogX + 12} y={frogY + 7} width="2" height="2" fill="#EC4899" />
                          {animTick % 2 === 0 ? (
                            <rect x={frogX + 7} y={frogY + 3} width="2" height="2" fill="#FDE047" />
                          ) : (
                            <rect x={frogX + 7} y={frogY + 1} width="2" height="2" fill="#FDE047" />
                          )}
                        </g>
                      )}

                      {/* ACTIVITY PROPS */}

                      {/* 1. Reading Journal */}
                      {config.activityId === 'reading' && (
                        <g>
                          <rect x={frogX + 2} y={frogY + 12} width="12" height="8" fill="#FDF2F8" />
                          <rect x={frogX + 1} y={frogY + 12} width="1" height="8" fill="#DB2777" />
                          <rect x={frogX + 14} y={frogY + 12} width="1" height="8" fill="#DB2777" />
                          <rect x={frogX + 7} y={frogY + 12} width="2" height="8" fill="#DB2777" />
                          {/* Mini Paws holding book */}
                          <rect x={frogX} y={frogY + 14} width="2" height="3" fill={skin.main} />
                          <rect x={frogX + 14} y={frogY + 14} width="2" height="3" fill={skin.main} />
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
                          <rect x={frogX + 3} y={frogY + 14} width="2" height="3" fill={skin.main} />
                          <rect x={frogX + 11} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 3. Hot Coffee */}
                      {config.activityId === 'coffee' && (
                        <g>
                          <rect x={frogX + 5} y={frogY + 12} width="6" height="6" fill="#FFFFFF" />
                          <rect x={frogX + 6} y={frogY + 11} width="4" height="2" fill="#78350F" />
                          <rect x={frogX + 10} y={frogY + 13} width="2" height="3" fill="#E2E8F0" />
                          <rect x={frogX + 3} y={frogY + 14} width="2" height="3" fill={skin.main} />
                          <rect x={frogX + 11} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 4. Boba Milk Tea */}
                      {config.activityId === 'boba' && (
                        <g>
                          <rect x={frogX + 5} y={frogY + 12} width="6" height="7" fill="#FED7AA" />
                          <rect x={frogX + 7} y={frogY + 9} width="2" height="4" fill="#F43F5E" />
                          <rect x={frogX + 6} y={frogY + 17} width="1" height="1" fill="#18181B" />
                          <rect x={frogX + 8} y={frogY + 17} width="1" height="1" fill="#18181B" />
                          <rect x={frogX + 3} y={frogY + 14} width="2" height="3" fill={skin.main} />
                          <rect x={frogX + 11} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 5. Eating Treats (Onigiri / Rice bowl) */}
                      {config.activityId === 'eating' && (
                        <g>
                          <rect x={frogX + 6} y={frogY + 10} width="4" height="2" fill="#FFFFFF" />
                          <rect x={frogX + 5} y={frogY + 12} width="6" height="2" fill="#FFFFFF" />
                          <rect x={frogX + 4} y={frogY + 14} width="8" height="3" fill="#FFFFFF" />
                          <rect x={frogX + 6} y={frogY + 14} width="4" height="2" fill="#18181B" />
                          <rect x={frogX + 2} y={frogY + 13} width="3" height="3" fill={skin.main} />
                          <rect x={frogX + 11} y={frogY + 13} width="3" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 6. Plucking Guitar / Lute */}
                      {config.activityId === 'guitar' && (
                        <g>
                          <rect x={frogX + 6} y={frogY + 12} width="8" height="8" fill="#D97706" />
                          <rect x={frogX + 9} y={frogY + 14} width="2" height="3" fill="#451A03" />
                          <rect x={frogX + 13} y={frogY + 8} width="6" height="3" fill="#B45309" />
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

                      {/* 7. Painting Art */}
                      {config.activityId === 'painting' && (
                        <g>
                          <rect x={frogX + 5} y={frogY + 13} width="10" height="6" fill="#D97706" />
                          <rect x={frogX + 7} y={frogY + 14} width="2" height="2" fill="#EF4444" />
                          <rect x={frogX + 9} y={frogY + 13} width="2" height="2" fill="#3B82F6" />
                          <rect x={frogX + 11} y={frogY + 14} width="2" height="2" fill="#EAB308" />
                          <rect x={frogX + 3} y={frogY + 14} width="2" height="3" fill={skin.main} />
                          <rect x={frogX + 11} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 8. Retro Camera */}
                      {config.activityId === 'camera' && (
                        <g>
                          <rect x={frogX + 4} y={frogY + 13} width="8" height="6" fill="#78350F" />
                          <rect x={frogX + 6} y={frogY + 14} width="4" height="4" fill="#1E293B" />
                          <rect x={frogX + 3} y={frogY + 14} width="2" height="3" fill={skin.main} />
                          <rect x={frogX + 11} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 9. Magic Starlight Wand */}
                      {config.activityId === 'wand' && (
                        <g>
                          <rect x={frogX + 13} y={frogY + 15} width="2" height="2" fill="#CA8A04" />
                          <rect x={frogX + 15} y={frogY + 12} width="2" height="3" fill="#CA8A04" />
                          <rect x={frogX + 17} y={frogY + 9} width="2" height="3" fill="#CA8A04" />
                          <rect x={frogX + 17} y={frogY + 6} width="4" height="4" fill="#FACC15" />
                          <rect x={frogX + 18} y={frogY + 5} width="2" height="6" fill="#FEF08A" />
                          <rect x={frogX + 11} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 10. Bamboo Fishing Rod */}
                      {config.activityId === 'fishing' && (
                        <g>
                          <rect x={frogX + 10} y={frogY + 15} width="3" height="2" fill="#78350F" />
                          <rect x={frogX + 13} y={frogY + 12} width="3" height="3" fill="#78350F" />
                          <rect x={frogX + 16} y={frogY + 9} width="3" height="3" fill="#78350F" />
                          <rect x={frogX + 19} y={frogY + 6} width="3" height="3" fill="#78350F" />
                          <rect x={frogX + 22} y={frogY + 3} width="3" height="3" fill="#78350F" />
                          <rect x={frogX + 25} y={frogY + 3} width="1" height="20" fill="#94A3B8" />
                          <rect x={frogX + 24} y={frogY + 17} width="3" height="3" fill="#EF4444" />
                          <rect x={frogX + 9} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 11. Picnic Basket */}
                      {config.activityId === 'picnic_basket' && (
                        <g>
                          <rect x={frogX + 5} y={frogY + 13} width="10" height="7" fill="#D97706" />
                          <rect x={frogX + 6} y={frogY + 12} width="4" height="2" fill="#EF4444" />
                          <rect x={frogX + 5} y={frogY + 12} width="2" height="2" fill="#FFFFFF" />
                          <rect x={frogX + 3} y={frogY + 14} width="2" height="3" fill={skin.main} />
                          <rect x={frogX + 13} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 12. Woodcutter Axe */}
                      {config.activityId === 'woodcutter_axe' && (
                        <g>
                          <rect x={frogX + 11} y={frogY + 16} width="2" height="3" fill="#78350F" />
                          <rect x={frogX + 13} y={frogY + 12} width="2" height="4" fill="#78350F" />
                          <rect x={frogX + 15} y={frogY + 8} width="2" height="4" fill="#78350F" />
                          <rect x={frogX + 17} y={frogY + 5} width="2" height="3" fill="#78350F" />
                          <rect x={frogX + 17} y={frogY + 4} width="5" height="5" fill="#94A3B8" />
                          <rect x={frogX + 10} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 13. Sushi Platter */}
                      {(config.activityId === 'sushi_platter' || config.activityId === 'eating_sushi') && (
                        <g>
                          <rect x={frogX + 4} y={frogY + 14} width="12" height="5" fill="#D97706" />
                          <rect x={frogX + 5} y={frogY + 13} width="4" height="2" fill="#FB923C" />
                          <rect x={frogX + 10} y={frogY + 13} width="4" height="2" fill="#BE123C" />
                          <rect x={frogX + 3} y={frogY + 15} width="2" height="3" fill={skin.main} />
                          <rect x={frogX + 13} y={frogY + 15} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 14. Matcha Tea Whisk */}
                      {(config.activityId === 'tea_whisk' || config.activityId === 'sushi_crafting') && (
                        <g>
                          <rect x={frogX + 4} y={frogY + 13} width="8" height="6" fill="#1E293B" />
                          <rect x={frogX + 5} y={frogY + 14} width="6" height="3" fill="#84CC16" />
                          <rect x={frogX + 12} y={frogY + 10} width="2" height="2" fill="#FDE68A" />
                          <rect x={frogX + 10} y={frogY + 12} width="2" height="2" fill="#FDE68A" />
                          <rect x={frogX + 8} y={frogY + 14} width="2" height="2" fill="#FDE68A" />
                          <rect x={frogX + 3} y={frogY + 14} width="2" height="3" fill={skin.main} />
                          <rect x={frogX + 11} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 15. Konbini Barcode Scanner */}
                      {config.activityId === 'konbini_scanner' && (
                        <g id="scene-prop-scanner">
                          <rect x={frogX + 10} y={frogY + 13} width="6" height="4" fill="#1E293B" />
                          <rect x={frogX + 14} y={frogY + 11} width="3" height="6" fill="#0F172A" />
                          {/* Animated Laser Beam */}
                          <rect x={frogX + 16} y={frogY + 14} width="10" height="1" fill="#EF4444" className="animate-pulse" />
                          <rect x={frogX + 25} y={frogY + 13} width="2" height="2" fill="#F87171" />
                          <rect x={frogX + 9} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 16. Eating Delicious Onigiri */}
                      {config.activityId === 'eating_onigiri' && (
                        <g id="scene-prop-eating-onigiri">
                          <rect x={frogX + 6} y={frogY + 11} width="4" height="2" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
                          <rect x={frogX + 5} y={frogY + 13} width="6" height="2" fill="#FFFFFF" />
                          <rect x={frogX + 4} y={frogY + 15} width="8" height="3" fill="#FFFFFF" />
                          <rect x={frogX + 6} y={frogY + 15} width="4" height="2" fill="#18181B" />
                          <rect x={frogX + 7} y={frogY + 13} width="2" height="2" fill="#DC2626" />
                          <rect x={frogX + 2} y={frogY + 14} width="2" height="3" fill={skin.main} />
                          <rect x={frogX + 12} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 17. Holding Konbini Shopping Bag */}
                      {config.activityId === 'holding_konbini_bag' && (
                        <g id="scene-prop-bag">
                          <rect x={frogX + 8} y={frogY + 12} width="10" height="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.5" />
                          <rect x={frogX + 9} y={frogY + 16} width="8" height="2" fill="#10B981" />
                          <rect x={frogX + 9} y={frogY + 18} width="8" height="1" fill="#EA580C" />
                          <rect x={frogX + 10} y={frogY + 10} width="3" height="4" fill="#FACC15" />
                          <rect x={frogX + 13} y={frogY + 11} width="2" height="3" fill="#EF4444" />
                          <rect x={frogX + 8} y={frogY + 13} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 18. Arcade Gamepad */}
                      {config.activityId === 'arcade_gamepad' && (
                        <g id="scene-prop-gamepad">
                          <rect x={frogX + 4} y={frogY + 12} width="14" height="8" fill="#18181B" stroke="#3F3F46" strokeWidth="0.5" />
                          <rect x={frogX + 5} y={frogY + 13} width="12" height="6" fill="#27272A" />
                          <rect x={frogX + 6} y={frogY + 14} width="3" height="1" fill="#DC2626" />
                          <rect x={frogX + 7} y={frogY + 13} width="1" height="3" fill="#DC2626" />
                          <rect x={frogX + 13} y={frogY + 14} width="2" height="2" fill="#EF4444" />
                          <rect x={frogX + 11} y={frogY + 16} width="2" height="2" fill="#FACC15" />
                          <rect x={frogX + 10} y={frogY + 10} width="1" height="2" fill="#71717A" />
                          <rect x={frogX + 2} y={frogY + 14} width="2" height="3" fill={skin.main} />
                          <rect x={frogX + 14} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 19. Claw Machine Prize Plush */}
                      {config.activityId === 'claw_machine_prize' && (
                        <g id="scene-prop-claw-prize">
                          <rect x={frogX + 3} y={frogY + 11} width="12" height="10" fill="#4ADE80" stroke="#15803D" strokeWidth="0.5" />
                          <rect x={frogX + 5} y={frogY + 14} width="8" height="5" fill="#FEF08A" />
                          <rect x={frogX + 4} y={frogY + 10} width="3" height="3" fill="#15803D" />
                          <rect x={frogX + 11} y={frogY + 10} width="3" height="3" fill="#15803D" />
                          <rect x={frogX + 5} y={frogY + 11} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 12} y={frogY + 11} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 8} y={frogY + 15} width="2" height="2" fill="#EC4899" />
                          <rect x={frogX + 1} y={frogY + 13} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 13} y={frogY + 13} width="3" height="4" fill={skin.main} />
                        </g>
                      )}

                      {/* 20. Retro Handheld Gaming */}
                      {config.activityId === 'handheld_gaming' && (
                        <g id="scene-prop-handheld">
                          <rect x={frogX + 5} y={frogY + 11} width="11" height="11" fill="#94A3B8" stroke="#475569" strokeWidth="0.5" />
                          <rect x={frogX + 6} y={frogY + 12} width="9" height="5" fill="#8BAC0F" stroke="#0F380F" strokeWidth="0.5" />
                          <rect x={frogX + 10} y={frogY + 14} width="2" height="2" fill="#0F380F" />
                          <rect x={frogX + 7} y={frogY + 18} width="2" height="2" fill="#1E293B" />
                          <rect x={frogX + 12} y={frogY + 18} width="2" height="2" fill="#BE123C" />
                          <rect x={frogX + 14} y={frogY + 17} width="1.5" height="1.5" fill="#BE123C" />
                          <rect x={frogX + 3} y={frogY + 14} width="2" height="3" fill={skin.main} />
                          <rect x={frogX + 14} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 4. HATS & ACCESSORIES (HEAD LAYER) */}

                      {/* Arcade Joystick Cap */}
                      {config.hatId === 'arcade_joystick_cap' && (
                        <g id="scene-hat-joystick-cap">
                          <rect x={frogX - 2} y={frogY - 4} width="20" height="7" fill="#18181B" />
                          <rect x={frogX} y={frogY - 5} width="16" height="2" fill="#27272A" />
                          <rect x={frogX - 5} y={frogY + 1} width="12" height="2" fill="#09090B" />
                          <rect x={frogX + 6} y={frogY - 3} width="1" height="3" fill="#71717A" />
                          <rect x={frogX + 5} y={frogY - 4} width="3" height="2" fill="#EF4444" />
                          <rect x={frogX + 10} y={frogY - 2} width="2" height="2" fill="#3B82F6" />
                        </g>
                      )}

                      {/* Pixel VR Visor */}
                      {config.hatId === 'pixel_vr_visor' && (
                        <g id="scene-hat-vr-visor">
                          <rect x={frogX - 3} y={frogY - 3} width="22" height="9" fill="#0F172A" stroke="#334155" strokeWidth="0.5" />
                          <rect x={frogX - 2} y={frogY - 1} width="20" height="5" fill="#06B6D4" />
                          <rect x={frogX + 1} y={frogY} width="14" height="2" fill="#67E8F9" />
                          {animTick % 2 === 0 && <rect x={frogX + 5} y={frogY} width="6" height="2" fill="#EC4899" />}
                          <rect x={frogX - 4} y={frogY} width="2" height="3" fill="#475569" />
                          <rect x={frogX + 18} y={frogY} width="2" height="3" fill="#475569" />
                        </g>
                      )}

                      {/* Retro Game Boy Beanie */}
                      {config.hatId === 'retro_gameboy_beanie' && (
                        <g id="scene-hat-gameboy-beanie">
                          <rect x={frogX - 2} y={frogY - 7} width="20" height="10" fill="#94A3B8" />
                          <rect x={frogX} y={frogY - 8} width="16" height="2" fill="#CBD5E1" />
                          <rect x={frogX - 3} y={frogY + 1} width="22" height="2" fill="#64748B" />
                          <rect x={frogX + 2} y={frogY - 4} width="5" height="4" fill="#8BAC0F" stroke="#0F380F" strokeWidth="0.5" />
                          <rect x={frogX + 10} y={frogY - 3} width="2" height="2" fill="#18181B" />
                          <rect x={frogX + 14} y={frogY - 4} width="2" height="2" fill="#BE123C" />
                          <rect x={frogX + 13} y={frogY - 2} width="2" height="2" fill="#BE123C" />
                        </g>
                      )}

                      {/* Red Riding Hood */}
                      {config.hatId === 'red_riding_hood' && (
                        <g>
                          <rect x={frogX - 3} y={frogY - 4} width="22" height="16" fill="#DC2626" />
                          <rect x={frogX - 1} y={frogY - 6} width="18" height="3" fill="#B91C1C" />
                          <rect x={frogX + 1} y={frogY - 2} width="14" height="2" fill="#FEF2F2" />
                          <rect x={frogX + 6} y={frogY + 12} width="4" height="2" fill="#991B1B" />
                          <rect x={frogX + 7} y={frogY + 12} width="2" height="2" fill="#EF4444" />
                        </g>
                      )}

                      {/* Wolf Ears Hood */}
                      {config.hatId === 'wolf_ears_hood' && (
                        <g>
                          <rect x={frogX - 2} y={frogY - 6} width="6" height="8" fill="#334155" />
                          <rect x={frogX} y={frogY - 4} width="3" height="5" fill="#F472B6" />
                          <rect x={frogX + 12} y={frogY - 6} width="6" height="8" fill="#334155" />
                          <rect x={frogX + 13} y={frogY - 4} width="3" height="5" fill="#F472B6" />
                          <rect x={frogX + 2} y={frogY - 1} width="12" height="3" fill="#475569" />
                          <rect x={frogX + 6} y={frogY - 3} width="4" height="2" fill="#F1F5F9" />
                        </g>
                      )}

                      {/* Granny Nightcap */}
                      {config.hatId === 'granny_nightcap' && (
                        <g>
                          <rect x={frogX - 2} y={frogY - 6} width="20" height="9" fill="#F8FAFC" />
                          <rect x={frogX} y={frogY - 5} width="16" height="7" fill="#F1F5F9" />
                          <rect x={frogX - 3} y={frogY + 2} width="22" height="2" fill="#FBCFE8" />
                          <rect x={frogX + 7} y={frogY + 2} width="2" height="2" fill="#EC4899" />
                        </g>
                      )}

                      {/* Sushi Salmon Nigiri */}
                      {config.hatId === 'sushi_salmon' && (
                        <g>
                          <rect x={frogX} y={frogY - 2} width="16" height="4" fill="#FFFFFF" />
                          <rect x={frogX - 2} y={frogY - 6} width="20" height="5" fill="#FB923C" />
                          <rect x={frogX} y={frogY - 6} width="4" height="1" fill="#FFF7ED" />
                          <rect x={frogX + 6} y={frogY - 6} width="4" height="1" fill="#FFF7ED" />
                          <rect x={frogX + 12} y={frogY - 6} width="4" height="1" fill="#FFF7ED" />
                          <rect x={frogX + 2} y={frogY - 4} width="4" height="1" fill="#FFF7ED" />
                          <rect x={frogX + 8} y={frogY - 4} width="4" height="1" fill="#FFF7ED" />
                          <rect x={frogX + 14} y={frogY - 4} width="3" height="1" fill="#FFF7ED" />
                          <rect x={frogX + 7} y={frogY - 6} width="2" height="8" fill="#14532D" />
                        </g>
                      )}

                      {/* Sushi Maguro */}
                      {config.hatId === 'sushi_maguro' && (
                        <g>
                          <rect x={frogX} y={frogY - 2} width="16" height="4" fill="#FFFFFF" />
                          <rect x={frogX - 2} y={frogY - 6} width="20" height="5" fill="#BE123C" />
                          <rect x={frogX} y={frogY - 5} width="16" height="2" fill="#E11D48" />
                          <rect x={frogX + 2} y={frogY - 5} width="4" height="1" fill="#FFFFFF" opacity="0.6" />
                          <rect x={frogX + 7} y={frogY - 3} width="2" height="2" fill="#84CC16" />
                        </g>
                      )}

                      {/* Sushi Ebi */}
                      {config.hatId === 'sushi_ebi' && (
                        <g>
                          <rect x={frogX} y={frogY - 2} width="16" height="4" fill="#FFFFFF" />
                          <rect x={frogX - 2} y={frogY - 6} width="18" height="5" fill="#EA580C" />
                          <rect x={frogX + 1} y={frogY - 6} width="2" height="5" fill="#FFFFFF" />
                          <rect x={frogX + 5} y={frogY - 6} width="2" height="5" fill="#FFFFFF" />
                          <rect x={frogX + 9} y={frogY - 6} width="2" height="5" fill="#FFFFFF" />
                          <rect x={frogX + 16} y={frogY - 6} width="5" height="4" fill="#DC2626" />
                          <rect x={frogX + 16} y={frogY - 2} width="5" height="3" fill="#EA580C" />
                        </g>
                      )}

                      {/* Sushi Chef Headband */}
                      {config.hatId === 'sushi_chef_headband' && (
                        <g>
                          <rect x={frogX - 2} y={frogY + 2} width="20" height="3" fill="#FFFFFF" />
                          <rect x={frogX - 1} y={frogY + 2} width="3" height="3" fill="#1E3A8A" />
                          <rect x={frogX + 4} y={frogY + 2} width="3" height="3" fill="#1E3A8A" />
                          <rect x={frogX + 9} y={frogY + 2} width="3" height="3" fill="#1E3A8A" />
                          <rect x={frogX + 14} y={frogY + 2} width="3" height="3" fill="#1E3A8A" />
                          <rect x={frogX + 6} y={frogY + 2} width="4" height="3" fill="#DC2626" />
                        </g>
                      )}

                      {/* Konbini Staff Visor */}
                      {config.hatId === 'konbini_staff_visor' && (
                        <g id="scene-hat-visor">
                          <rect x={frogX - 3} y={frogY + 1} width="22" height="3" fill="#10B981" />
                          <rect x={frogX - 1} y={frogY + 1} width="18" height="1" fill="#34D399" />
                          <rect x={frogX - 3} y={frogY - 1} width="22" height="2" fill="#059669" />
                          <rect x={frogX + 7} y={frogY + 1} width="2" height="2" fill="#FFFFFF" />
                          <rect x={frogX + 8} y={frogY + 2} width="1" height="1" fill="#EA580C" />
                        </g>
                      )}

                      {/* Shopper Bucket Hat */}
                      {config.hatId === 'shopper_bucket_hat' && (
                        <g id="scene-hat-bucket">
                          <rect x={frogX - 1} y={frogY - 6} width="18" height="7" fill="#7C3AED" />
                          <rect x={frogX + 1} y={frogY - 5} width="14" height="2" fill="#8B5CF6" />
                          <rect x={frogX - 4} y={frogY + 1} width="24" height="2" fill="#6D28D9" />
                          <rect x={frogX + 7} y={frogY - 3} width="2" height="2" fill="#FDE047" />
                        </g>
                      )}

                      {/* Onigiri Headband */}
                      {config.hatId === 'onigiri_headband' && (
                        <g id="scene-hat-onigiri">
                          <rect x={frogX - 2} y={frogY + 2} width="20" height="1.5" fill="#18181B" />
                          <rect x={frogX + 6} y={frogY - 8} width="4" height="2" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
                          <rect x={frogX + 5} y={frogY - 6} width="6" height="3" fill="#FFFFFF" />
                          <rect x={frogX + 4} y={frogY - 3} width="8" height="3" fill="#FFFFFF" />
                          <rect x={frogX + 6} y={frogY - 3} width="4" height="2" fill="#18181B" />
                          <rect x={frogX + 7} y={frogY - 5} width="2" height="2" fill="#DC2626" />
                        </g>
                      )}

                      {/* A. Lotus Leaf Hat */}
                      {config.hatId === 'lotus' && (
                        <g>
                          <rect x={frogX + 7} y={frogY - 4} width="2" height="2" fill="#1E3A14" />
                          <rect x={frogX + 2} y={frogY - 2} width="12" height="2" fill="#4D7C0F" />
                          <rect x={frogX - 1} y={frogY} width="18" height="2" fill="#65A30D" />
                          <rect x={frogX - 2} y={frogY + 1} width="20" height="1" fill="#1E3A14" />
                          <rect x={frogX + 12} y={frogY - 1} width="1" height="1" fill="#FFFFFF" />
                        </g>
                      )}

                      {/* B. Straw Travel Hat */}
                      {config.hatId === 'straw' && (
                        <g>
                          <rect x={frogX + 5} y={frogY - 5} width="6" height="4" fill="#FDE68A" />
                          <rect x={frogX + 2} y={frogY - 2} width="12" height="4" fill="#FDE68A" />
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
                          <rect x={frogX + 6} y={frogY - 10} width="4" height="5" fill="#1E1B4B" />
                          <rect x={frogX + 4} y={frogY - 5} width="8" height="4" fill="#1E1B4B" />
                          <rect x={frogX + 1} y={frogY - 1} width="14" height="3" fill="#1E1B4B" />
                          <rect x={frogX - 2} y={frogY + 2} width="20" height="2" fill="#4338CA" />
                          <rect x={frogX + 7} y={frogY - 4} width="2" height="2" fill="#FACC15" />
                        </g>
                      )}

                      {/* E. Red Bandana */}
                      {config.hatId === 'bandana' && (
                        <g>
                          <rect x={frogX - 1} y={frogY + 4} width="18" height="3" fill="#DC2626" />
                          <rect x={frogX + 14} y={frogY + 6} width="3" height="4" fill="#B91C1C" />
                        </g>
                      )}

                      {/* F. Winter Knit Beanie */}
                      {config.hatId === 'beanie' && (
                        <g>
                          <rect x={frogX + 6} y={frogY - 6} width="4" height="3" fill="#FFFFFF" />
                          <rect x={frogX} y={frogY - 3} width="16" height="5" fill="#DC2626" />
                          <rect x={frogX - 1} y={frogY + 1} width="18" height="3" fill="#F87171" />
                        </g>
                      )}

                      {/* G. Chef Toque */}
                      {config.hatId === 'chef' && (
                        <g>
                          <rect x={frogX + 1} y={frogY - 10} width="14" height="10" fill="#FFFFFF" />
                          <rect x={frogX} y={frogY - 8} width="16" height="8" fill="#FFFFFF" />
                          <rect x={frogX - 1} y={frogY} width="18" height="2" fill="#E2E8F0" />
                        </g>
                      )}

                      {/* H. Royal Golden Crown */}
                      {config.hatId === 'crown' && (
                        <g>
                          <rect x={frogX} y={frogY - 3} width="4" height="5" fill="#FACC15" />
                          <rect x={frogX + 6} y={frogY - 5} width="4" height="7" fill="#FACC15" />
                          <rect x={frogX + 12} y={frogY - 3} width="4" height="5" fill="#FACC15" />
                          <rect x={frogX} y={frogY + 1} width="16" height="2" fill="#EAB308" />
                          <rect x={frogX + 7} y={frogY} width="2" height="2" fill="#DC2626" />
                        </g>
                      )}

                      {/* I. Artist Beret */}
                      {config.hatId === 'beret' && (
                        <g>
                          <rect x={frogX - 2} y={frogY - 2} width="20" height="5" fill="#78350F" />
                          <rect x={frogX + 7} y={frogY - 4} width="2" height="2" fill="#451A03" />
                        </g>
                      )}

                      {/* J. Tropical Flower */}
                      {config.hatId === 'flower' && (
                        <g>
                          <rect x={frogX + 14} y={frogY} width="5" height="5" fill="#FEF08A" />
                          <rect x={frogX + 15} y={frogY + 1} width="3" height="3" fill="#EA580C" />
                        </g>
                      )}

                      {/* K. Lo-Fi Headphones */}
                      {config.hatId === 'headphone' && (
                        <g>
                          <rect x={frogX - 1} y={frogY - 3} width="18" height="2" fill="#18181B" />
                          <rect x={frogX - 3} y={frogY + 3} width="3" height="7" fill="#3B82F6" />
                          <rect x={frogX + 16} y={frogY + 3} width="3" height="7" fill="#3B82F6" />
                        </g>
                      )}

                      {/* L. Detective Cap */}
                      {config.hatId === 'detective' && (
                        <g>
                          <rect x={frogX - 2} y={frogY - 1} width="20" height="4" fill="#78350F" />
                          <rect x={frogX + 2} y={frogY - 4} width="12" height="4" fill="#92400E" />
                          <rect x={frogX - 3} y={frogY + 1} width="22" height="1.5" fill="#451A03" />
                        </g>
                      )}

                      {/* M. Samurai Kabuto */}
                      {config.hatId === 'samurai' && (
                        <g>
                          <rect x={frogX} y={frogY - 2} width="16" height="4" fill="#18181B" />
                          <rect x={frogX + 6} y={frogY - 7} width="4" height="6" fill="#CA8A04" />
                          <rect x={frogX + 2} y={frogY - 4} width="12" height="3" fill="#CA8A04" />
                          <rect x={frogX + 7} y={frogY - 3} width="2" height="2" fill="#DC2626" />
                        </g>
                      )}
                    </g>
                  )}
                </g>
              );
            })()}
      </g>

      {/* 5. WEATHER PARTICLES OVERLAY */}

      {/* Raindrops Falling */}
      {effectiveWeather === 'rainy' && (
        <g id="rain-layer" opacity="0.75">
          {Array.from({ length: fullscreen ? 50 : 24 }).map((_, i) => {
            const rx = (i * 19 + (animTick * 7)) % 160;
            const ry = (i * 13 + (animTick * 11)) % viewBoxHeight;
            return (
              <g key={i}>
                <rect x={rx} y={ry} width="1" height="4" fill="#93C5FD" />
                <rect x={rx - 1} y={ry + 3} width="1" height="2" fill="#93C5FD" opacity="0.6" />
              </g>
            );
          })}
        </g>
      )}

      {/* Sakura Petals Drifting */}
      {effectiveWeather === 'petals' && (
        <g id="petals-layer">
          {Array.from({ length: fullscreen ? 28 : 14 }).map((_, i) => {
            const px = (i * 27 + (animTick * 4)) % 160;
            const py = (i * 17 + (animTick * 3)) % viewBoxHeight;
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
    </>
  );

  if (fullscreen) {
    return (
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        className={`absolute inset-0 w-full h-full overflow-hidden select-none touch-none ${
          isPointerDown && hasMoved ? 'cursor-grabbing' : 'cursor-grab'
        } ${className}`}
        style={{
          background: `linear-gradient(to bottom, ${sky.top} 0%, ${sky.bottom} 100%)`,
        }}
      >
        {/* Scalable & Pannable SVG Scene Layer */}
        <div
          className="w-full h-full transform-gpu origin-center will-change-transform transition-transform duration-75 pointer-events-none"
          style={{
            transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoomScale})`,
          }}
        >
          <svg
            viewBox={`0 0 160 ${viewBoxHeight}`}
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full object-cover block"
            shapeRendering="crispEdges"
          >
            {svgContent}
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Diorama Display Card */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        className="relative rounded-[26px] overflow-hidden border border-black/[0.08] dark:border-white/[0.12] bg-[#f8f5ee] dark:bg-[#191613] shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
      >
        {/* Main Pixel Canvas (160x100 viewBox) */}
        <div className="relative w-full aspect-[16/10] max-h-[300px] select-none overflow-hidden bg-black touch-none">
          <div
            className="w-full h-full transform-gpu origin-center will-change-transform transition-transform duration-75"
            style={{
              transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoomScale})`,
            }}
          >
            <svg
              viewBox="0 0 160 100"
              className="w-full h-full object-cover block"
              shapeRendering="crispEdges"
            >
              {svgContent}
            </svg>
          </div>
        </div>

        {/* Info & Quick Settings Bottom Bar inside Diorama */}
        {size !== 'compact' && showInfoBar !== false && (
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
              {onUpdateConfig && (
                <button
                  type="button"
                  onClick={handleRandomize}
                  className="px-2.5 py-1.5 rounded-full text-xs font-bold bg-[#f2ebe0] hover:bg-[#e7dec7] dark:bg-white/[0.08] dark:hover:bg-white/[0.14] text-[#4a4036] dark:text-[#e0d6cb] flex items-center gap-1 transition ios-tap shadow-2xs"
                  title="Surprise Mix"
                >
                  <Shuffle size={12} className="text-[#b86f52]" />
                  <span className="hidden sm:inline">Shuffle</span>
                </button>
              )}

              {/* Wardrobe Button */}
              {showCustomizerButton && onOpenShop && (
                <button
                  id="frog-scene-dressup-btn"
                  type="button"
                  onClick={() => {
                    if (soundEnabled) soundEngine.playTapSound();
                    if (hapticEnabled) triggerHaptic();
                    onOpenShop();
                  }}
                  className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#5f7a61] hover:bg-[#4d6650] active:scale-95 text-white flex items-center gap-1.5 shadow-xs transition ios-tap"
                  title="Frog Wardrobe"
                >
                  <Shirt size={13} />
                  <span>Wardrobe</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
