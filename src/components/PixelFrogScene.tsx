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
        highlight: '#FDE047',
        main: '#F59E0B',
        dark: '#D97706',
        deep: '#B45309',
        outline: '#78350F',
        belly: '#FEF9C3',
        bellyShadow: '#FDE68A',
        cheeks: '#FDBA74',
        cheeksCore: '#F97316',
        legs: '#D97706',
        legsHighlight: '#F59E0B',
        eyeHighlight: '#FFFFFF',
        eyePupil: '#0F172A',
      };
    case 'sakura_pink':
      return {
        highlight: '#FCE7F3',
        main: '#F472B6',
        dark: '#DB2777',
        deep: '#BE123C',
        outline: '#831843',
        belly: '#FFF1F2',
        bellyShadow: '#FFE4E6',
        cheeks: '#FDA4AF',
        cheeksCore: '#FB7185',
        legs: '#EC4899',
        legsHighlight: '#F472B6',
        eyeHighlight: '#FFFFFF',
        eyePupil: '#0F172A',
      };
    case 'twilight_blue':
      return {
        highlight: '#BAE6FD',
        main: '#38BDF8',
        dark: '#0284C7',
        deep: '#0369A1',
        outline: '#0C4A6E',
        belly: '#F0F9FF',
        bellyShadow: '#E0F2FE',
        cheeks: '#C7D2FE',
        cheeksCore: '#818CF8',
        legs: '#0369A1',
        legsHighlight: '#38BDF8',
        eyeHighlight: '#FFFFFF',
        eyePupil: '#0F172A',
      };
    case 'matcha':
      return {
        highlight: '#BEF264',
        main: '#84CC16',
        dark: '#65A30D',
        deep: '#4D7C0F',
        outline: '#365314',
        belly: '#F7FEE7',
        bellyShadow: '#ECFCCB',
        cheeks: '#FDA4AF',
        cheeksCore: '#F43F5E',
        legs: '#4D7C0F',
        legsHighlight: '#84CC16',
        eyeHighlight: '#FFFFFF',
        eyePupil: '#0F172A',
      };
    case 'albino_white':
      return {
        highlight: '#FFFFFF',
        main: '#F8FAFC',
        dark: '#E2E8F0',
        deep: '#CBD5E1',
        outline: '#475569',
        belly: '#FFFFFF',
        bellyShadow: '#F1F5F9',
        cheeks: '#FECDD3',
        cheeksCore: '#FB7185',
        legs: '#E2E8F0',
        legsHighlight: '#F8FAFC',
        eyeHighlight: '#FFFFFF',
        eyePupil: '#BE123C',
      };
    case 'ember_orange':
      return {
        highlight: '#FED7AA',
        main: '#FB923C',
        dark: '#EA580C',
        deep: '#C2410C',
        outline: '#7C2D12',
        belly: '#FFF7ED',
        bellyShadow: '#FFEDD5',
        cheeks: '#FDBA74',
        cheeksCore: '#EA580C',
        legs: '#C2410C',
        legsHighlight: '#FB923C',
        eyeHighlight: '#FFFFFF',
        eyePupil: '#0F172A',
      };
    case 'fairytale_rose':
      return {
        highlight: '#FECDD3',
        main: '#F43F5E',
        dark: '#E11D48',
        deep: '#BE123C',
        outline: '#881337',
        belly: '#FFF1F2',
        bellyShadow: '#FFE4E6',
        cheeks: '#FDA4AF',
        cheeksCore: '#E11D48',
        legs: '#BE123C',
        legsHighlight: '#F43F5E',
        eyeHighlight: '#FFFFFF',
        eyePupil: '#0F172A',
      };
    case 'timber_wolf_grey':
      return {
        highlight: '#CBD5E1',
        main: '#64748B',
        dark: '#475569',
        deep: '#334155',
        outline: '#1E293B',
        belly: '#F8FAFC',
        bellyShadow: '#F1F5F9',
        cheeks: '#CBD5E1',
        cheeksCore: '#94A3B8',
        legs: '#334155',
        legsHighlight: '#64748B',
        eyeHighlight: '#FFFFFF',
        eyePupil: '#0F172A',
      };
    case 'wasabi_green':
      return {
        highlight: '#D9F99D',
        main: '#84CC16',
        dark: '#65A30D',
        deep: '#4D7C0F',
        outline: '#365314',
        belly: '#F7FEE7',
        bellyShadow: '#ECFCCB',
        cheeks: '#BEF264',
        cheeksCore: '#A3E635',
        legs: '#4D7C0F',
        legsHighlight: '#84CC16',
        eyeHighlight: '#FFFFFF',
        eyePupil: '#0F172A',
      };
    case 'salmon_peach':
      return {
        highlight: '#FFEDD5',
        main: '#FB923C',
        dark: '#F97316',
        deep: '#EA580C',
        outline: '#9A3412',
        belly: '#FFF7ED',
        bellyShadow: '#FFEDD5',
        cheeks: '#FECDD3',
        cheeksCore: '#FB7185',
        legs: '#EA580C',
        legsHighlight: '#FB923C',
        eyeHighlight: '#FFFFFF',
        eyePupil: '#0F172A',
      };
    case 'cyber_neon_violet':
      return {
        highlight: '#C4B5FD',
        main: '#8B5CF6',
        dark: '#7C3AED',
        deep: '#6D28D9',
        outline: '#4C1D95',
        belly: '#D1FAE5',
        bellyShadow: '#A7F3D0',
        cheeks: '#F472B6',
        cheeksCore: '#EC4899',
        legs: '#7C3AED',
        legsHighlight: '#8B5CF6',
        eyeHighlight: '#38BDF8',
        eyePupil: '#0F172A',
      };
    case 'gameboy_monochrome':
      return {
        highlight: '#9BBC0F',
        main: '#8BAC0F',
        dark: '#306230',
        deep: '#1E401E',
        outline: '#0F380F',
        belly: '#9BBC0F',
        bellyShadow: '#8BAC0F',
        cheeks: '#306230',
        cheeksCore: '#306230',
        legs: '#306230',
        legsHighlight: '#8BAC0F',
        eyeHighlight: '#9BBC0F',
        eyePupil: '#0F380F',
      };
    case 'konbini_mint':
      return {
        highlight: '#A7F3D0',
        main: '#34D399',
        dark: '#10B981',
        deep: '#059669',
        outline: '#064E3B',
        belly: '#F0FDF4',
        bellyShadow: '#DCFCE7',
        cheeks: '#FECDD3',
        cheeksCore: '#FB7185',
        legs: '#10B981',
        legsHighlight: '#34D399',
        eyeHighlight: '#FFFFFF',
        eyePupil: '#0F172A',
      };
    case 'pine_forest_moss':
      return {
        highlight: '#4D7C0F',
        main: '#2D5A27',
        dark: '#1E3F1A',
        deep: '#142E11',
        outline: '#0F260C',
        belly: '#FEF3C7',
        bellyShadow: '#E9D8A6',
        cheeks: '#F87171',
        cheeksCore: '#E76F51',
        legs: '#22441E',
        legsHighlight: '#2D5A27',
        eyeHighlight: '#FFFFFF',
        eyePupil: '#0F172A',
      };
    case 'ember_glow_amber':
      return {
        highlight: '#FDE047',
        main: '#D97706',
        dark: '#B45309',
        deep: '#92400E',
        outline: '#78350F',
        belly: '#FFFBEB',
        bellyShadow: '#FEF3C7',
        cheeks: '#FCA5A5',
        cheeksCore: '#EF4444',
        legs: '#92400E',
        legsHighlight: '#D97706',
        eyeHighlight: '#FDE047',
        eyePupil: '#0F172A',
      };
    case 'classic':
    default:
      return {
        highlight: '#86EFAC',
        main: '#65A30D',
        dark: '#4D7C0F',
        deep: '#365314',
        outline: '#1E3A10',
        belly: '#FEF9C3',
        bellyShadow: '#FDE68A',
        cheeks: '#FECDD3',
        cheeksCore: '#FB7185',
        legs: '#4D7C0F',
        legsHighlight: '#65A30D',
        eyeHighlight: '#FFFFFF',
        eyePupil: '#0F172A',
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
          {/* Glistening Slime Trail */}
          <rect x="-6" y="19" width="8" height="1" fill="#FEF08A" opacity="0.6" />
          <rect x="-3" y="18" width="2" height="1" fill="#FFFFFF" opacity="0.8" />
          {/* Snail Body & Translucent Foot */}
          <rect x="0" y="15" width="22" height="5" fill="#EADBC8" />
          <rect x="1" y="14" width="20" height="2" fill="#F7EFE5" />
          <rect x="2" y="19" width="18" height="1" fill="#CBB69D" />
          <rect x="15" y="9" width="7" height="9" fill="#EADBC8" />
          <rect x="16" y="9" width="5" height="4" fill="#F7EFE5" />
          {/* Eyestalks with cute motion & specular shine */}
          <rect x="16" y={soloTick % 2 === 0 ? 4 : 6} width="2" height="7" fill="#8C7A6B" />
          <rect x="21" y={soloTick % 2 === 0 ? 5 : 7} width="2" height="6" fill="#8C7A6B" />
          <rect x="15" y={soloTick % 2 === 0 ? 3 : 5} width="4" height="3" fill="#18181B" />
          <rect x="20" y={soloTick % 2 === 0 ? 4 : 6} width="4" height="3" fill="#18181B" />
          <rect x="16" y={soloTick % 2 === 0 ? 3 : 5} width="1" height="1" fill="#FFFFFF" />
          <rect x="21" y={soloTick % 2 === 0 ? 4 : 6} width="1" height="1" fill="#FFFFFF" />
          {/* Soft Snail Smile & Blush */}
          <rect x="19" y="14" width="2" height="1" fill="#A37081" />
          <rect x="16" y="13" width="2" height="1" fill="#FDA4AF" opacity="0.7" />
          {/* 5-Tone Stardew Spiral Shell */}
          <rect x="1" y={3 + (soloTick % 2 === 0 ? 0 : 1)} width="15" height="15" fill="#8B4513" />
          <rect x="3" y={2 + (soloTick % 2 === 0 ? 0 : 1)} width="11" height="17" fill="#8B4513" />
          <rect x="2" y={4 + (soloTick % 2 === 0 ? 0 : 1)} width="13" height="13" fill="#D97706" />
          <rect x="3" y={4 + (soloTick % 2 === 0 ? 0 : 1)} width="11" height="3" fill="#FDE68A" />
          <rect x="4" y={6 + (soloTick % 2 === 0 ? 0 : 1)} width="9" height="9" fill="#B45309" />
          <rect x="5" y={7 + (soloTick % 2 === 0 ? 0 : 1)} width="7" height="7" fill="#F59E0B" />
          <rect x="6" y={8 + (soloTick % 2 === 0 ? 0 : 1)} width="4" height="4" fill="#78350F" />
          <rect x="7" y={9 + (soloTick % 2 === 0 ? 0 : 1)} width="2" height="2" fill="#FEF3C7" />
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

      {/* Camping Set: Maple the Baby Fawn */}
      {(config.companionId === 'forest_camp_fawn' || config.companionId === 'companion_forest_camp_fawn') && (
        <g transform={`translate(${frogX - 28}, ${frogY + 4 + (soloTick % 2 === 0 ? 0 : -1)})`}>
          {/* Fawn Body & Chestnut Fur */}
          <rect x="4" y="8" width="18" height="12" fill="#B45309" />
          <rect x="6" y="10" width="14" height="9" fill="#D97706" />
          {/* White Dappled Spots */}
          <rect x="8" y="10" width="2" height="2" fill="#FEF3C7" />
          <rect x="14" y="11" width="2" height="2" fill="#FEF3C7" />
          <rect x="11" y="14" width="2" height="2" fill="#FEF3C7" />
          <rect x="16" y="15" width="2" height="2" fill="#FEF3C7" />
          {/* Gentle Head & Cute Ears */}
          <rect x="12" y="2" width="11" height="9" fill="#D97706" />
          <rect x="11" y={soloTick % 2 === 0 ? 0 : 1} width="4" height="4" fill="#B45309" />
          <rect x="12" y={soloTick % 2 === 0 ? 1 : 2} width="2" height="2" fill="#FEF3C7" />
          <rect x="19" y="0" width="4" height="4" fill="#B45309" />
          <rect x="20" y="1" width="2" height="2" fill="#FEF3C7" />
          {/* Sweet Face */}
          <rect x="18" y="5" width="3" height="3" fill="#1C1917" />
          <rect x="19" y="5" width="1" height="1" fill="#FFFFFF" />
          <rect x="21" y="8" width="3" height="3" fill="#FEF3C7" />
          <rect x="22" y="8" width="2" height="1" fill="#1C1917" />
          {/* Rosy Cheek */}
          <rect x="16" y="8" width="2" height="2" fill="#FB7185" />
          {/* Fluffy Tail */}
          <rect x="2" y={soloTick % 2 === 0 ? 9 : 11} width="4" height="5" fill="#FEF3C7" />
          {/* Legs */}
          <rect x="5" y="19" width="4" height="3" fill="#92400E" />
          <rect x="15" y="19" width="4" height="3" fill="#92400E" />
        </g>
      )}

      {/* Camping Set: Bandit the Camp Raccoon */}
      {(config.companionId === 'campfire_raccoon' || config.companionId === 'companion_campfire_raccoon') && (
        <g transform={`translate(${frogX + 22}, ${frogY + 3 + (soloTick % 2 === 0 ? 0 : 1)})`}>
          {/* Raccoon Body */}
          <rect x="2" y="8" width="16" height="13" fill="#64748B" />
          <rect x="5" y="10" width="10" height="9" fill="#94A3B8" />
          {/* Head & Round Ears */}
          <rect x="3" y="1" width="14" height="10" fill="#64748B" />
          <rect x="2" y="0" width="4" height="3" fill="#334155" />
          <rect x="3" y="1" width="2" height="2" fill="#CBD5E1" />
          <rect x="13" y="0" width="4" height="3" fill="#334155" />
          <rect x="14" y="1" width="2" height="2" fill="#CBD5E1" />
          {/* Bandit Black Eye Mask */}
          <rect x="2" y="4" width="16" height="4" fill="#0F172A" />
          <rect x="4" y="5" width="3" height="3" fill="#FFFFFF" />
          <rect x="5" y="5" width="2" height="2" fill="#0F172A" />
          <rect x="12" y="5" width="3" height="3" fill="#FFFFFF" />
          <rect x="12" y="5" width="2" height="2" fill="#0F172A" />
          {/* White Snout & Nose */}
          <rect x="7" y="7" width="5" height="4" fill="#F8FAFC" />
          <rect x="8.5" y="7.5" width="2" height="2" fill="#0F172A" />
          {/* Munching Toasted Marshmallow on Stick */}
          <g transform={`translate(14, ${soloTick % 2 === 0 ? 7 : 9})`}>
            <rect x="0" y="2" width="6" height="1" fill="#78350F" />
            <rect x="4" y="0" width="4" height="5" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.5" />
            <rect x="5" y="1" width="2" height="1" fill="#78350F" />
          </g>
          {/* Striped Ringed Tail */}
          <g transform={`translate(-6, ${soloTick % 2 === 0 ? 10 : 8})`}>
            <rect x="0" y="0" width="7" height="4" fill="#475569" />
            <rect x="2" y="0" width="2" height="4" fill="#0F172A" />
            <rect x="5" y="0" width="2" height="4" fill="#0F172A" />
          </g>
          {/* Paws */}
          <rect x="4" y="20" width="4" height="2" fill="#334155" />
          <rect x="11" y="20" width="4" height="2" fill="#334155" />
        </g>
      )}

      {/* 5-TONE STARDEW COZY FROG BODY & EYE SOCKETS */}
      {/* Eye Domes with Highlights & Depth */}
      <rect x={frogX} y={frogY} width="5" height="5" fill={skin.outline} />
      <rect x={frogX + 11} y={frogY} width="5" height="5" fill={skin.outline} />
      {/* Eye Top Highlight Ridge */}
      <rect x={frogX + 1} y={frogY} width="3" height="1" fill={skin.highlight || '#86EFAC'} />
      <rect x={frogX + 12} y={frogY} width="3" height="1" fill={skin.highlight || '#86EFAC'} />
      <rect x={frogX + 1} y={frogY + 1} width="3" height="3" fill={skin.main} />
      <rect x={frogX + 12} y={frogY + 1} width="3" height="3" fill={skin.main} />
      {/* Deep Socket Shadow */}
      <rect x={frogX + 1} y={frogY + 3} width="3" height="1" fill={skin.dark} />
      <rect x={frogX + 12} y={frogY + 3} width="3" height="1" fill={skin.dark} />

      {/* Head Crown Highlight & Main Body */}
      <rect x={frogX - 2} y={frogY + 4} width="20" height="18" fill={skin.main} />
      {/* Forehead Golden Dappled Light */}
      <rect x={frogX + 4} y={frogY + 4} width="8" height="2" fill={skin.highlight || '#86EFAC'} />
      <rect x={frogX + 6} y={frogY + 3} width="4" height="1" fill={skin.highlight || '#86EFAC'} />
      
      {/* Flank Shading & Deep Contours */}
      <rect x={frogX - 2} y={frogY + 6} width="2" height="14" fill={skin.dark} />
      <rect x={frogX + 16} y={frogY + 6} width="2" height="14" fill={skin.dark} />
      <rect x={frogX - 3} y={frogY + 6} width="1" height="14" fill={skin.outline} />
      <rect x={frogX + 18} y={frogY + 6} width="1" height="14" fill={skin.outline} />
      <rect x={frogX} y={frogY + 22} width="16" height="1" fill={skin.outline} />
      {/* Ambient Under-body Shadow */}
      <rect x={frogX - 1} y={frogY + 21} width="18" height="1" fill={skin.deep || '#365314'} />

      {/* 3-Tone Cream Belly with Soft Under-Shadow */}
      <rect x={frogX + 3} y={frogY + 11} width="10" height="8" fill={skin.belly} />
      <rect x={frogX + 4} y={frogY + 10} width="8" height="2" fill={skin.belly} />
      <rect x={frogX + 3} y={frogY + 17} width="10" height="2" fill={skin.bellyShadow || '#FDE68A'} />

      {/* Two-Tone Rosy Cheeks (Soft Outer Blush + Core Pink) */}
      <rect x={frogX - 1} y={frogY + 10} width="4" height="3" fill={skin.cheeks} opacity="0.85" />
      <rect x={frogX} y={frogY + 11} width="2" height="1" fill={skin.cheeksCore || '#FB7185'} />
      <rect x={frogX + 13} y={frogY + 10} width="4" height="3" fill={skin.cheeks} opacity="0.85" />
      <rect x={frogX + 14} y={frogY + 11} width="2" height="1" fill={skin.cheeksCore || '#FB7185'} />

      {/* Expressive Glossy Eyes with 1px Pure White Specular Sparkle */}
      <rect x={frogX + 2} y={frogY + 6} width="4" height="3" fill={skin.outline} />
      <rect x={frogX + 2} y={frogY + 6} width="2" height="2" fill={skin.eyePupil || '#0F172A'} />
      <rect x={frogX + 2} y={frogY + 6} width="1" height="1" fill="#FFFFFF" />
      <rect x={frogX + 10} y={frogY + 6} width="4" height="3" fill={skin.outline} />
      <rect x={frogX + 12} y={frogY + 6} width="2" height="2" fill={skin.eyePupil || '#0F172A'} />
      <rect x={frogX + 12} y={frogY + 6} width="1" height="1" fill="#FFFFFF" />

      {/* Gentle Cute Smile */}
      <rect x={frogX + 6} y={frogY + 11} width="4" height="1" fill={skin.outline} />
      <rect x={frogX + 5} y={frogY + 10} width="1" height="1" fill={skin.outline} />
      <rect x={frogX + 10} y={frogY + 10} width="1" height="1" fill={skin.outline} />

      {/* 3-Tone Shaded Webbed Feet */}
      <rect x={frogX - 4} y={frogY + 20} width="6" height="3" fill={skin.legs} />
      <rect x={frogX - 4} y={frogY + 20} width="5" height="1" fill={skin.legsHighlight || skin.main} />
      <rect x={frogX - 4} y={frogY + 22} width="6" height="1" fill={skin.dark} />
      <rect x={frogX + 14} y={frogY + 20} width="6" height="3" fill={skin.legs} />
      <rect x={frogX + 15} y={frogY + 20} width="5" height="1" fill={skin.legsHighlight || skin.main} />
      <rect x={frogX + 14} y={frogY + 22} width="6" height="1" fill={skin.dark} />

      {/* OUTFIT LAYER */}

      {/* 1. Traditional Master Kimono / Yukata */}
      {config.outfitId === 'kimono' && (
        <g id="preview-outfit-kimono">
          {/* Deep Royal Indigo Silk Robe Body */}
          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#0F172A" />
          <rect x={frogX - 2} y={frogY + 10} width="20" height="10" fill="#1E3A8A" />
          <rect x={frogX - 1} y={frogY + 10} width="18" height="9" fill="#2563EB" />
          <rect x={frogX} y={frogY + 11} width="16" height="7" fill="#3B82F6" />
          {/* Layered White/Ivory Crossover Inner Collar (Nagajuban) */}
          <rect x={frogX + 5} y={frogY + 9} width="6" height="4" fill="#FFFFFF" />
          <rect x={frogX + 6} y={frogY + 10} width="4" height="2" fill="#E2E8F0" />
          <rect x={frogX + 7} y={frogY + 11} width="2" height="2" fill="#CBD5E1" />
          {/* 4-Tone Gilded Gold Obi Sash */}
          <rect x={frogX - 2} y={frogY + 13} width="20" height="4" fill="#78350F" />
          <rect x={frogX - 1} y={frogY + 13} width="18" height="3" fill="#D97706" />
          <rect x={frogX} y={frogY + 14} width="16" height="2" fill="#FACC15" />
          <rect x={frogX + 2} y={frogY + 14} width="12" height="1" fill="#FEF08A" />
          {/* Crimson Obi-jime Cord & Floral Knot */}
          <rect x={frogX - 1} y={frogY + 15} width="18" height="1" fill="#991B1B" />
          <rect x={frogX + 6} y={frogY + 13} width="4" height="4" fill="#DC2626" />
          <rect x={frogX + 7} y={frogY + 14} width="2" height="2" fill="#EF4444" />
          <rect x={frogX + 7} y={frogY + 14} width="1" height="1" fill="#FEF08A" />
          {/* Gold Leaf Hem Accent Motifs */}
          <rect x={frogX - 1} y={frogY + 18} width="3" height="1" fill="#FDE047" />
          <rect x={frogX + 14} y={frogY + 18} width="3" height="1" fill="#FDE047" />
        </g>
      )}

      {/* 2. Yellow Slicker Fisher Raincoat */}
      {config.outfitId === 'raincoat' && (
        <g id="preview-outfit-raincoat">
          {/* 5-Tone Vibrant Sun Yellow Vinyl Body */}
          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#713F12" />
          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#CA8A04" />
          <rect x={frogX - 1} y={frogY + 10} width="18" height="10" fill="#EAB308" />
          <rect x={frogX} y={frogY + 10} width="16" height="9" fill="#FACC15" />
          {/* High-Gloss Specular Shine Highlights on Vinyl */}
          <rect x={frogX - 1} y={frogY + 11} width="3" height="2" fill="#FEF08A" />
          <rect x={frogX - 1} y={frogY + 11} width="2" height="1" fill="#FFFFFF" />
          <rect x={frogX + 13} y={frogY + 11} width="3" height="2" fill="#FEF08A" />
          <rect x={frogX + 14} y={frogY + 11} width="2" height="1" fill="#FFFFFF" />
          {/* Folded Storm Collar with Depth */}
          <rect x={frogX + 2} y={frogY + 8} width="12" height="3" fill="#CA8A04" />
          <rect x={frogX + 3} y={frogY + 8} width="10" height="2" fill="#FACC15" />
          {/* Center Wind Placket & Horn Toggle Buttons */}
          <rect x={frogX + 7} y={frogY + 9} width="2" height="11" fill="#CA8A04" />
          <rect x={frogX + 7} y={frogY + 11} width="2" height="2" fill="#451A03" />
          <rect x={frogX + 7} y={frogY + 11} width="1" height="1" fill="#78350F" />
          <rect x={frogX + 7} y={frogY + 14} width="2" height="2" fill="#451A03" />
          <rect x={frogX + 7} y={frogY + 14} width="1" height="1" fill="#78350F" />
          <rect x={frogX + 7} y={frogY + 17} width="2" height="2" fill="#451A03" />
          <rect x={frogX + 7} y={frogY + 17} width="1" height="1" fill="#78350F" />
          {/* Lower Flap Pockets */}
          <rect x={frogX - 1} y={frogY + 15} width="4" height="3" fill="#A16207" />
          <rect x={frogX - 1} y={frogY + 15} width="4" height="1" fill="#713F12" />
          <rect x={frogX + 13} y={frogY + 15} width="4" height="3" fill="#A16207" />
          <rect x={frogX + 13} y={frogY + 15} width="4" height="1" fill="#713F12" />
        </g>
      )}

      {/* 3. Autumn Chunky Cable-Knit Sweater */}
      {config.outfitId === 'sweater' && (
        <g id="preview-outfit-sweater">
          {/* 5-Tone Terracotta/Amber Chunky Wool Body */}
          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#431407" />
          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#7C2D12" />
          <rect x={frogX - 1} y={frogY + 10} width="18" height="10" fill="#C2410C" />
          <rect x={frogX} y={frogY + 10} width="16" height="9" fill="#EA580C" />
          {/* Chunky Ribbed Waffle Turtle Neck */}
          <rect x={frogX + 2} y={frogY + 8} width="12" height="3" fill="#7C2D12" />
          <rect x={frogX + 3} y={frogY + 8} width="10" height="2" fill="#F97316" />
          <rect x={frogX + 4} y={frogY + 8} width="1" height="2" fill="#7C2D12" />
          <rect x={frogX + 7} y={frogY + 8} width="1" height="2" fill="#7C2D12" />
          <rect x={frogX + 10} y={frogY + 8} width="1" height="2" fill="#7C2D12" />
          {/* Vertical Braided Cable-Knit Patterns */}
          <rect x={frogX + 2} y={frogY + 11} width="3" height="7" fill="#F97316" />
          <rect x={frogX + 3} y={frogY + 12} width="1" height="5" fill="#FDBA74" />
          <rect x={frogX + 1} y={frogY + 11} width="1" height="7" fill="#7C2D12" />
          <rect x={frogX + 6} y={frogY + 11} width="4" height="7" fill="#F97316" />
          <rect x={frogX + 7} y={frogY + 11} width="2" height="6" fill="#FDBA74" />
          <rect x={frogX + 11} y={frogY + 11} width="3" height="7" fill="#F97316" />
          <rect x={frogX + 12} y={frogY + 12} width="1" height="5" fill="#FDBA74" />
          <rect x={frogX + 14} y={frogY + 11} width="1" height="7" fill="#7C2D12" />
          {/* Chunky Folded Hem Ribbing */}
          <rect x={frogX - 1} y={frogY + 18} width="18" height="2" fill="#7C2D12" />
          <rect x={frogX} y={frogY + 18} width="16" height="1" fill="#F97316" />
        </g>
      )}

      {/* 4. Shinobi Shadow Shōzoku Outfit */}
      {config.outfitId === 'ninja' && (
        <g id="preview-outfit-ninja">
          {/* 5-Tone Midnight Obsidian & Charcoal Gi Body */}
          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#09090B" />
          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#18181B" />
          <rect x={frogX - 1} y={frogY + 10} width="18" height="9" fill="#27272A" />
          <rect x={frogX} y={frogY + 10} width="16" height="8" fill="#3F3F46" />
          {/* Crossed Wrapping Lapels (Kasa) with Shadows */}
          <rect x={frogX + 4} y={frogY + 9} width="8" height="4" fill="#18181B" />
          <rect x={frogX + 5} y={frogY + 10} width="6" height="2" fill="#27272A" />
          {/* Crimson Silk Sash Obi with Draping Tails */}
          <rect x={frogX - 2} y={frogY + 13} width="20" height="3" fill="#7F1D1D" />
          <rect x={frogX - 1} y={frogY + 13} width="18" height="2" fill="#DC2626" />
          <rect x={frogX} y={frogY + 13} width="16" height="1" fill="#EF4444" />
          {/* Trailing Knot on Right */}
          <rect x={frogX + 12} y={frogY + 15} width="3" height="5" fill="#7F1D1D" />
          <rect x={frogX + 13} y={frogY + 15} width="2" height="4" fill="#DC2626" />
          {/* Silver Shuriken Emblem / Throwing Star Tucked in Sash */}
          <rect x={frogX + 6} y={frogY + 12} width="4" height="4" fill="#E2E8F0" />
          <rect x={frogX + 7} y={frogY + 13} width="2" height="2" fill="#09090B" />
          <rect x={frogX + 7} y={frogY + 11} width="2" height="1" fill="#FFFFFF" />
          <rect x={frogX + 7} y={frogY + 16} width="2" height="1" fill="#FFFFFF" />
          {/* Dark Wrapped Arm Guards */}
          <rect x={frogX - 3} y={frogY + 12} width="2" height="4" fill="#09090B" />
          <rect x={frogX + 17} y={frogY + 12} width="2" height="4" fill="#09090B" />
        </g>
      )}

      {/* 5. Classic Seifuku Sailor Uniform */}
      {config.outfitId === 'sailor' && (
        <g id="preview-outfit-sailor">
          {/* Crisp Pure White Cotton Shirt with Soft Shading */}
          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#64748B" />
          <rect x={frogX - 2} y={frogY + 10} width="20" height="10" fill="#CBD5E1" />
          <rect x={frogX - 1} y={frogY + 10} width="18" height="9" fill="#F8FAFC" />
          <rect x={frogX} y={frogY + 11} width="16" height="8" fill="#FFFFFF" />
          {/* Deep Navy Blue Sailor Flap Collar */}
          <rect x={frogX - 2} y={frogY + 9} width="20" height="4" fill="#172554" />
          <rect x={frogX - 1} y={frogY + 9} width="18" height="3" fill="#1E3A8A" />
          <rect x={frogX} y={frogY + 9} width="16" height="2" fill="#2563EB" />
          {/* Twin White Sailor Accent Stripes on Collar */}
          <rect x={frogX - 1} y={frogY + 11} width="18" height="1" fill="#FFFFFF" />
          {/* Crimson Silk Ribbon Bow Tie */}
          <rect x={frogX + 6} y={frogY + 11} width="4" height="4" fill="#7F1D1D" />
          <rect x={frogX + 6} y={frogY + 12} width="4" height="3" fill="#DC2626" />
          <rect x={frogX + 7} y={frogY + 12} width="2" height="2" fill="#F87171" />
          {/* Draping Ribbon Tails */}
          <rect x={frogX + 5} y={frogY + 14} width="2" height="4" fill="#DC2626" />
          <rect x={frogX + 9} y={frogY + 14} width="2" height="4" fill="#DC2626" />
          {/* Navy Blue Pleated Waistband */}
          <rect x={frogX - 2} y={frogY + 18} width="20" height="3" fill="#172554" />
          <rect x={frogX - 1} y={frogY + 18} width="18" height="2" fill="#1E3A8A" />
        </g>
      )}

      {/* 6. Artisan Crafting & Gardening Apron */}
      {config.outfitId === 'apron' && (
        <g id="preview-outfit-apron">
          {/* Deep Forest Green Sturdy Canvas Bib Apron */}
          <rect x={frogX} y={frogY + 9} width="16" height="12" fill="#0F260C" />
          <rect x={frogX + 1} y={frogY + 9} width="14" height="11" fill="#14532D" />
          <rect x={frogX + 2} y={frogY + 10} width="12" height="10" fill="#166534" />
          <rect x={frogX + 3} y={frogY + 10} width="10" height="9" fill="#15803D" />
          {/* Leather Cross-Back Straps with Brass Rivets */}
          <rect x={frogX + 2} y={frogY + 8} width="2" height="4" fill="#78350F" />
          <rect x={frogX + 12} y={frogY + 8} width="2" height="4" fill="#78350F" />
          <rect x={frogX + 2} y={frogY + 10} width="1" height="1" fill="#FACC15" />
          <rect x={frogX + 13} y={frogY + 10} width="1" height="1" fill="#FACC15" />
          {/* Large Split Artisan Pocket with Tools */}
          <rect x={frogX + 3} y={frogY + 13} width="10" height="6" fill="#78350F" />
          <rect x={frogX + 4} y={frogY + 14} width="8" height="4" fill="#B45309" />
          <rect x={frogX + 7} y={frogY + 13} width="2" height="5" fill="#78350F" />
          {/* Crafting Tools Peeking Out (Wooden Ruler & Paintbrush) */}
          <rect x={frogX + 5} y={frogY + 12} width="1" height="3" fill="#FDE047" />
          <rect x={frogX + 9} y={frogY + 11} width="2" height="3" fill="#CA8A04" />
          <rect x={frogX + 9} y={frogY + 11} width="2" height="1" fill="#3B82F6" />
        </g>
      )}

      {/* 7. Classic Denim Dungarees / Overalls */}
      {config.outfitId === 'overalls' && (
        <g id="preview-outfit-overalls">
          {/* White Under-Tee */}
          <rect x={frogX - 2} y={frogY + 9} width="20" height="6" fill="#CBD5E1" />
          <rect x={frogX - 1} y={frogY + 10} width="18" height="4" fill="#FFFFFF" />
          {/* 5-Tone Stonewash Denim Dungaree Pants */}
          <rect x={frogX - 2} y={frogY + 12} width="20" height="9" fill="#172554" />
          <rect x={frogX - 1} y={frogY + 12} width="18" height="8" fill="#1E40AF" />
          <rect x={frogX} y={frogY + 13} width="16" height="7" fill="#2563EB" />
          <rect x={frogX + 1} y={frogY + 13} width="14" height="6" fill="#3B82F6" />
          {/* Denim Bib & Center Chest Pocket */}
          <rect x={frogX + 3} y={frogY + 10} width="10" height="7" fill="#1E40AF" />
          <rect x={frogX + 4} y={frogY + 11} width="8" height="5" fill="#2563EB" />
          <rect x={frogX + 5} y={frogY + 13} width="6" height="3" fill="#1D4ED8" />
          {/* Heavy Denim Suspender Straps with Brass Buckles */}
          <rect x={frogX + 2} y={frogY + 9} width="2" height="5" fill="#1D4ED8" />
          <rect x={frogX + 12} y={frogY + 9} width="2" height="5" fill="#1D4ED8" />
          <rect x={frogX + 2} y={frogY + 11} width="2" height="2" fill="#FACC15" />
          <rect x={frogX + 2} y={frogY + 11} width="1" height="1" fill="#FEF08A" />
          <rect x={frogX + 12} y={frogY + 11} width="2" height="2" fill="#FACC15" />
          <rect x={frogX + 12} y={frogY + 11} width="1" height="1" fill="#FEF08A" />
          {/* Copper Rivets on Waist */}
          <rect x={frogX - 1} y={frogY + 14} width="1" height="1" fill="#F59E0B" />
          <rect x={frogX + 16} y={frogY + 14} width="1" height="1" fill="#F59E0B" />
        </g>
      )}

      {/* 8. Chunky Hand-Knit Crimson Winter Scarf */}
      {config.outfitId === 'scarf' && (
        <g id="preview-outfit-scarf">
          {/* Multi-Layered Plump Wool Scarf Wraps */}
          <rect x={frogX - 4} y={frogY + 8} width="24" height="6" fill="#450A0A" />
          <rect x={frogX - 3} y={frogY + 8} width="22" height="5" fill="#7F1D1D" />
          <rect x={frogX - 2} y={frogY + 9} width="20" height="4" fill="#991B1B" />
          <rect x={frogX - 1} y={frogY + 9} width="18" height="3" fill="#DC2626" />
          <rect x={frogX} y={frogY + 9} width="16" height="2" fill="#EF4444" />
          <rect x={frogX + 2} y={frogY + 9} width="12" height="1" fill="#FCA5A5" />
          {/* Draping Ribbed Scarf Tail with Fringe Tassels */}
          <rect x={frogX + 11} y={frogY + 12} width="5" height="9" fill="#450A0A" />
          <rect x={frogX + 12} y={frogY + 12} width="4" height="8" fill="#991B1B" />
          <rect x={frogX + 12} y={frogY + 13} width="3" height="7" fill="#DC2626" />
          <rect x={frogX + 13} y={frogY + 13} width="1" height="6" fill="#FCA5A5" />
          {/* Golden Yarn Fringe Tassels */}
          <rect x={frogX + 11} y={frogY + 20} width="1" height="2" fill="#FEF08A" />
          <rect x={frogX + 13} y={frogY + 20} width="1" height="2" fill="#FEF08A" />
          <rect x={frogX + 15} y={frogY + 20} width="1" height="2" fill="#FEF08A" />
        </g>
      )}

      {/* 9. Executive Detective Tailored Suit */}
      {config.outfitId === 'business' && (
        <g id="preview-outfit-business">
          {/* Tailored Charcoal / Midnight Navy Blazer Body */}
          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#020617" />
          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#0F172A" />
          <rect x={frogX - 1} y={frogY + 10} width="18" height="10" fill="#1E293B" />
          <rect x={frogX} y={frogY + 10} width="16" height="9" fill="#334155" />
          {/* Crisp White Shirt Collar & V-Opening */}
          <rect x={frogX + 4} y={frogY + 9} width="8" height="7" fill="#E2E8F0" />
          <rect x={frogX + 5} y={frogY + 9} width="6" height="6" fill="#FFFFFF" />
          {/* Ruby Red Silk Tie with Golden Tie Clip */}
          <rect x={frogX + 7} y={frogY + 10} width="2" height="7" fill="#991B1B" />
          <rect x={frogX + 7} y={frogY + 11} width="2" height="5" fill="#DC2626" />
          <rect x={frogX + 7} y={frogY + 13} width="3" height="1" fill="#FACC15" />
          {/* Breast Pocket with White Silk Pocket Square */}
          <rect x={frogX + 2} y={frogY + 13} width="3" height="1" fill="#0F172A" />
          <rect x={frogX + 2} y={frogY + 12} width="2" height="1" fill="#FFFFFF" />
          {/* Golden Cuff Buttons */}
          <rect x={frogX - 2} y={frogY + 16} width="1" height="2" fill="#FACC15" />
          <rect x={frogX + 17} y={frogY + 16} width="1" height="2" fill="#FACC15" />
        </g>
      )}

      {/* 10. Relaxed Evergreen Streetwear Hoodie */}
      {config.outfitId === 'hoodie' && (
        <g id="preview-outfit-hoodie">
          {/* 5-Tone Cozy Forest Emerald Fleece Body */}
          <rect x={frogX - 4} y={frogY + 8} width="24" height="13" fill="#064E3B" />
          <rect x={frogX - 3} y={frogY + 8} width="22" height="12" fill="#047857" />
          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#059669" />
          <rect x={frogX - 1} y={frogY + 9} width="18" height="10" fill="#10B981" />
          <rect x={frogX} y={frogY + 10} width="16" height="8" fill="#34D399" />
          {/* Slouchy Hood Collar Folds */}
          <rect x={frogX - 2} y={frogY + 7} width="6" height="4" fill="#047857" />
          <rect x={frogX + 12} y={frogY + 7} width="6" height="4" fill="#047857" />
          {/* White Woven Drawstrings with Golden Aglets */}
          <rect x={frogX + 5} y={frogY + 10} width="1" height="5" fill="#FFFFFF" />
          <rect x={frogX + 5} y={frogY + 15} width="1" height="1" fill="#FACC15" />
          <rect x={frogX + 10} y={frogY + 10} width="1" height="5" fill="#FFFFFF" />
          <rect x={frogX + 10} y={frogY + 15} width="1" height="1" fill="#FACC15" />
          {/* Roomy Kangaroo Pouch Pocket */}
          <rect x={frogX + 2} y={frogY + 13} width="12" height="6" fill="#047857" />
          <rect x={frogX + 3} y={frogY + 14} width="10" height="4" fill="#059669" />
          <rect x={frogX + 4} y={frogY + 14} width="8" height="3" fill="#10B981" />
          {/* Bottom Hem & Sleeve Cuffs */}
          <rect x={frogX - 2} y={frogY + 19} width="20" height="2" fill="#064E3B" />
        </g>
      )}

      {/* 11. Fairytale Folk Dirndl Dress */}
      {config.outfitId === 'red_riding_dress' && (
        <g id="preview-outfit-red-riding-dress">
          {/* Frilled Peasant Blouse */}
          <rect x={frogX - 2} y={frogY + 9} width="20" height="5" fill="#CBD5E1" />
          <rect x={frogX - 1} y={frogY + 9} width="18" height="4" fill="#F8FAFC" />
          <rect x={frogX} y={frogY + 10} width="16" height="3" fill="#FFFFFF" />
          {/* Rich Mahogany Leather Corset with Gold Lacing */}
          <rect x={frogX} y={frogY + 11} width="16" height="5" fill="#451A03" />
          <rect x={frogX + 1} y={frogY + 11} width="14" height="4" fill="#78350F" />
          <rect x={frogX + 2} y={frogY + 12} width="12" height="3" fill="#B45309" />
          <rect x={frogX + 6} y={frogY + 12} width="4" height="1" fill="#FACC15" />
          <rect x={frogX + 6} y={frogY + 14} width="4" height="1" fill="#FACC15" />
          {/* Flared Ruby Red Velvet Skirt */}
          <rect x={frogX - 3} y={frogY + 15} width="22" height="7" fill="#7F1D1D" />
          <rect x={frogX - 2} y={frogY + 15} width="20" height="6" fill="#991B1B" />
          <rect x={frogX - 1} y={frogY + 16} width="18" height="5" fill="#DC2626" />
          <rect x={frogX} y={frogY + 16} width="16" height="4" fill="#EF4444" />
          {/* Delicate Scalloped White Lace Apron Overlay */}
          <rect x={frogX + 4} y={frogY + 15} width="8" height="6" fill="#E2E8F0" />
          <rect x={frogX + 5} y={frogY + 15} width="6" height="5" fill="#FFFFFF" />
          <rect x={frogX + 4} y={frogY + 20} width="8" height="1" fill="#F8FAFC" />
        </g>
      )}

      {/* 12. Primal Timber Wolf Pelt Mantle */}
      {config.outfitId === 'wolf_fur_cloak' && (
        <g id="preview-outfit-wolf-cloak">
          {/* Thick Layered Wolf Fur Collar across Shoulders */}
          <rect x={frogX - 4} y={frogY + 8} width="24" height="6" fill="#0F172A" />
          <rect x={frogX - 3} y={frogY + 8} width="22" height="5" fill="#1E293B" />
          <rect x={frogX - 2} y={frogY + 9} width="20" height="4" fill="#334155" />
          <rect x={frogX - 1} y={frogY + 9} width="18" height="3" fill="#475569" />
          <rect x={frogX} y={frogY + 9} width="16" height="2" fill="#64748B" />
          {/* Carved Beast Fang Clasp */}
          <rect x={frogX + 6} y={frogY + 10} width="4" height="3" fill="#0F172A" />
          <rect x={frogX + 7} y={frogY + 10} width="2" height="3" fill="#E2E8F0" />
          <rect x={frogX + 7} y={frogY + 10} width="1" height="2" fill="#FFFFFF" />
          {/* Heavy Weathered Charcoal Fur Cloak Body */}
          <rect x={frogX - 3} y={frogY + 13} width="22" height="9" fill="#0F172A" />
          <rect x={frogX - 2} y={frogY + 13} width="20" height="8" fill="#1E293B" />
          <rect x={frogX - 1} y={frogY + 14} width="18" height="7" fill="#334155" />
          <rect x={frogX + 2} y={frogY + 14} width="12" height="5" fill="#475569" />
          {/* Stepped Jagged Fur Fringe Edges */}
          <rect x={frogX - 2} y={frogY + 20} width="3" height="2" fill="#0F172A" />
          <rect x={frogX + 6} y={frogY + 20} width="4" height="2" fill="#0F172A" />
          <rect x={frogX + 15} y={frogY + 20} width="3" height="2" fill="#0F172A" />
        </g>
      )}

      {/* 13. Lumberjack Woodsman Flannel & Tool Rig */}
      {config.outfitId === 'hunter_woodsman' && (
        <g id="preview-outfit-hunter">
          {/* Red & Black Buffalo Plaid Heavy Shirt */}
          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#450A0A" />
          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#7F1D1D" />
          <rect x={frogX - 1} y={frogY + 10} width="18" height="10" fill="#DC2626" />
          <rect x={frogX} y={frogY + 10} width="16" height="9" fill="#EF4444" />
          {/* Plaid Grid Pattern */}
          <rect x={frogX - 1} y={frogY + 10} width="3" height="10" fill="#18181B" />
          <rect x={frogX + 6} y={frogY + 10} width="3" height="10" fill="#18181B" />
          <rect x={frogX + 14} y={frogY + 10} width="3" height="10" fill="#18181B" />
          <rect x={frogX - 2} y={frogY + 13} width="20" height="2" fill="#18181B" />
          {/* Heavy Leather Harness & Belt with Brass Buckle */}
          <rect x={frogX - 2} y={frogY + 15} width="20" height="3" fill="#451A03" />
          <rect x={frogX - 1} y={frogY + 15} width="18" height="2" fill="#78350F" />
          <rect x={frogX + 6} y={frogY + 14} width="4" height="4" fill="#CA8A04" />
          <rect x={frogX + 7} y={frogY + 15} width="2" height="2" fill="#FEF08A" />
          {/* Diagonal Leather Shoulder Strap */}
          <rect x={frogX + 2} y={frogY + 9} width="3" height="6" fill="#78350F" />
        </g>
      )}

      {/* 14. Master Itamae Traditional Happi Coat */}
      {config.outfitId === 'sushi_chef_happi' && (
        <g id="preview-outfit-sushi-happi">
          {/* Crisp Starched White Happi Body */}
          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#64748B" />
          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#CBD5E1" />
          <rect x={frogX - 1} y={frogY + 10} width="18" height="10" fill="#F8FAFC" />
          <rect x={frogX} y={frogY + 10} width="16" height="9" fill="#FFFFFF" />
          {/* Deep Navy Blue Lapel Trims with Wave Mon */}
          <rect x={frogX - 2} y={frogY + 9} width="3" height="11" fill="#172554" />
          <rect x={frogX - 1} y={frogY + 10} width="2" height="9" fill="#1E3A8A" />
          <rect x={frogX + 15} y={frogY + 9} width="3" height="11" fill="#172554" />
          <rect x={frogX + 15} y={frogY + 10} width="2" height="9" fill="#1E3A8A" />
          {/* Traditional Navy Hem Wave Pattern */}
          <rect x={frogX - 1} y={frogY + 18} width="18" height="2" fill="#1E3A8A" />
          <rect x={frogX + 3} y={frogY + 18} width="2" height="1" fill="#60A5FA" />
          <rect x={frogX + 8} y={frogY + 18} width="2" height="1" fill="#60A5FA" />
          <rect x={frogX + 13} y={frogY + 18} width="2" height="1" fill="#60A5FA" />
          {/* Crimson Chef Sash Obi with Front Knot */}
          <rect x={frogX - 1} y={frogY + 14} width="18" height="3" fill="#7F1D1D" />
          <rect x={frogX} y={frogY + 14} width="16" height="2" fill="#DC2626" />
          <rect x={frogX + 6} y={frogY + 13} width="4" height="4" fill="#EF4444" />
          <rect x={frogX + 7} y={frogY + 14} width="2" height="2" fill="#991B1B" />
        </g>
      )}

      {/* 15. Traditional Ryokan Waiter Kimono & Maekake */}
      {config.outfitId === 'sushi_kimono_waiter' && (
        <g id="preview-outfit-sushi-waiter">
          {/* Dark Midnight Indigo Kimono Body */}
          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#0F172A" />
          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#1E1B4B" />
          <rect x={frogX - 1} y={frogY + 10} width="18" height="10" fill="#312E81" />
          <rect x={frogX} y={frogY + 10} width="16" height="9" fill="#3730A3" />
          {/* Ivory Crossover Collar */}
          <rect x={frogX + 5} y={frogY + 9} width="6" height="3" fill="#FEF3C7" />
          <rect x={frogX + 6} y={frogY + 10} width="4" height="2" fill="#FDE68A" />
          {/* Traditional Tan Canvas Half-Apron (Maekake) */}
          <rect x={frogX - 1} y={frogY + 13} width="18" height="8" fill="#78350F" />
          <rect x={frogX} y={frogY + 13} width="16" height="7" fill="#B45309" />
          <rect x={frogX + 1} y={frogY + 14} width="14" height="6" fill="#D97706" />
          <rect x={frogX + 2} y={frogY + 14} width="12" height="5" fill="#FEF3C7" />
          {/* Braided Rope Waist Cord & Knot */}
          <rect x={frogX - 2} y={frogY + 12} width="20" height="2" fill="#78350F" />
          <rect x={frogX - 1} y={frogY + 12} width="18" height="1" fill="#FDE68A" />
          <rect x={frogX + 6} y={frogY + 12} width="4" height="3" fill="#DC2626" />
        </g>
      )}

      {/* 16. Japanese Convenience Store Staff Uniform */}
      {config.outfitId === 'konbini_staff_uniform' && (
        <g id="preview-outfit-konbini-staff">
          {/* Two-Tone Signature Green Store Smock */}
          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#064E3B" />
          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#047857" />
          <rect x={frogX - 1} y={frogY + 10} width="18" height="10" fill="#059669" />
          <rect x={frogX} y={frogY + 10} width="16" height="9" fill="#10B981" />
          {/* White Center Stripe & Crisp Collar */}
          <rect x={frogX + 6} y={frogY + 9} width="4" height="11" fill="#FFFFFF" />
          <rect x={frogX + 7} y={frogY + 10} width="2" height="10" fill="#F8FAFC" />
          {/* Orange Accent Collar Tips */}
          <rect x={frogX + 3} y={frogY + 9} width="3" height="2" fill="#EA580C" />
          <rect x={frogX + 10} y={frogY + 9} width="3" height="2" fill="#EA580C" />
          {/* Official Konbini Name Tag Badge with Clip */}
          <rect x={frogX + 2} y={frogY + 12} width="4" height="3" fill="#0F172A" />
          <rect x={frogX + 2} y={frogY + 12} width="4" height="2.5" fill="#FEF08A" />
          <rect x={frogX + 3} y={frogY + 13} width="2" height="1" fill="#1E293B" />
          {/* Front Pocket with Dual Pens (Red & Blue) */}
          <rect x={frogX + 11} y={frogY + 13} width="3" height="4" fill="#047857" />
          <rect x={frogX + 11} y={frogY + 11} width="1" height="3" fill="#DC2626" />
          <rect x={frogX + 13} y={frogY + 11} width="1" height="3" fill="#2563EB" />
        </g>
      )}

      {/* 17. Lavender Soft-Fleece Loungewear */}
      {config.outfitId === 'shopper_cozy_sweatset' && (
        <g id="preview-outfit-shopper">
          {/* 5-Tone Muted Pastel Lilac Loungewear */}
          <rect x={frogX - 4} y={frogY + 8} width="24" height="13" fill="#3B0764" />
          <rect x={frogX - 3} y={frogY + 8} width="22" height="12" fill="#581C87" />
          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#7C3AED" />
          <rect x={frogX - 1} y={frogY + 9} width="18" height="10" fill="#8B5CF6" />
          <rect x={frogX} y={frogY + 10} width="16" height="8" fill="#A78BFA" />
          {/* Soft Ribbed Collar & White Woven Drawstrings */}
          <rect x={frogX + 3} y={frogY + 8} width="10" height="2" fill="#DDD6FE" />
          <rect x={frogX + 5} y={frogY + 10} width="1" height="4" fill="#FFFFFF" />
          <rect x={frogX + 10} y={frogY + 10} width="1" height="4" fill="#FFFFFF" />
          {/* Front Kangaroo Pocket with Subtle Depth */}
          <rect x={frogX + 2} y={frogY + 13} width="12" height="6" fill="#6B21A8" />
          <rect x={frogX + 3} y={frogY + 14} width="10" height="4" fill="#7C3AED" />
          <rect x={frogX + 4} y={frogY + 14} width="8" height="3" fill="#9333EA" />
          {/* Soft Lavender Sweatpants Hem */}
          <rect x={frogX - 2} y={frogY + 19} width="20" height="2" fill="#4C1D95" />
        </g>
      )}

      {/* 18. Retro Cyberpunk Gamer Bomber Jacket */}
      {config.outfitId === 'arcade_gamer_bomber' && (
        <g id="preview-outfit-arcade-bomber">
          {/* Royal Purple Satin Body */}
          <rect x={frogX - 3} y={frogY + 8} width="22" height="13" fill="#3B0764" />
          <rect x={frogX - 2} y={frogY + 8} width="20" height="12" fill="#581C87" />
          <rect x={frogX - 1} y={frogY + 9} width="18" height="11" fill="#7E22CE" />
          <rect x={frogX} y={frogY + 9} width="16" height="9" fill="#9333EA" />
          {/* Neon Cyan Raglan Sleeves */}
          <rect x={frogX - 4} y={frogY + 9} width="4" height="10" fill="#0891B2" />
          <rect x={frogX - 3} y={frogY + 10} width="3" height="8" fill="#06B6D4" />
          <rect x={frogX - 2} y={frogY + 10} width="1" height="6" fill="#22D3EE" />
          <rect x={frogX + 16} y={frogY + 9} width="4" height="10" fill="#0891B2" />
          <rect x={frogX + 16} y={frogY + 10} width="3" height="8" fill="#06B6D4" />
          <rect x={frogX + 17} y={frogY + 10} width="1" height="6" fill="#22D3EE" />
          {/* Heavy Golden Brass Zipper */}
          <rect x={frogX + 7} y={frogY + 8} width="2" height="12" fill="#78350F" />
          <rect x={frogX + 7} y={frogY + 9} width="2" height="11" fill="#FACC15" />
          <rect x={frogX + 7} y={frogY + 9} width="1" height="10" fill="#FEF08A" />
          {/* Embroidered Pixel Badges (8-Bit Heart & Star) */}
          <rect x={frogX + 2} y={frogY + 11} width="3" height="3" fill="#EC4899" />
          <rect x={frogX + 3} y={frogY + 12} width="1" height="1" fill="#FFFFFF" />
          <rect x={frogX + 11} y={frogY + 11} width="3" height="3" fill="#22D3EE" />
          <rect x={frogX + 12} y={frogY + 12} width="1" height="1" fill="#FFFFFF" />
          {/* Striped Ribbed Waistband */}
          <rect x={frogX - 2} y={frogY + 19} width="20" height="2" fill="#1E1B4B" />
          <rect x={frogX} y={frogY + 19} width="16" height="1" fill="#FACC15" />
        </g>
      )}

      {/* 19. Legendary Knight Steel Cuirass & Velvet Cape */}
      {config.outfitId === 'pixel_hero_armor' && (
        <g id="preview-outfit-hero-armor">
          {/* Royal Violet Cape Draped Behind Shoulders */}
          <rect x={frogX - 4} y={frogY + 8} width="24" height="14" fill="#3B0764" />
          <rect x={frogX - 3} y={frogY + 8} width="22" height="13" fill="#6B21A8" />
          <rect x={frogX - 2} y={frogY + 9} width="20" height="12" fill="#7C3AED" />
          {/* 5-Tone Polished Steel Breastplate */}
          <rect x={frogX - 1} y={frogY + 9} width="18" height="11" fill="#334155" />
          <rect x={frogX} y={frogY + 9} width="16" height="10" fill="#475569" />
          <rect x={frogX + 1} y={frogY + 10} width="14" height="8" fill="#94A3B8" />
          <rect x={frogX + 2} y={frogY + 10} width="12" height="7" fill="#CBD5E1" />
          {/* Metallic Specular Glint */}
          <rect x={frogX + 2} y={frogY + 10} width="3" height="2" fill="#F8FAFC" />
          <rect x={frogX + 2} y={frogY + 10} width="1" height="1" fill="#FFFFFF" />
          {/* Golden Hero Crest Emblazoned on Chest */}
          <rect x={frogX + 6} y={frogY + 11} width="4" height="4" fill="#78350F" />
          <rect x={frogX + 6} y={frogY + 11} width="4" height="3" fill="#FACC15" />
          <rect x={frogX + 7} y={frogY + 10} width="2" height="6" fill="#FEF08A" />
          {/* Heavy Riveted Leather Belt with Gold Ring Buckle */}
          <rect x={frogX - 1} y={frogY + 16} width="18" height="3" fill="#451A03" />
          <rect x={frogX} y={frogY + 16} width="16" height="2" fill="#78350F" />
          <rect x={frogX + 6} y={frogY + 15} width="4" height="4" fill="#FACC15" />
          <rect x={frogX + 7} y={frogY + 16} width="2" height="2" fill="#78350F" />
        </g>
      )}

      {/* 20. Pro Gamer Retro 88 Jersey */}
      {config.outfitId === 'retro_esports_jersey' && (
        <g id="preview-outfit-esports-jersey">
          {/* Midnight Obsidian Athletic Mesh Body */}
          <rect x={frogX - 3} y={frogY + 8} width="22" height="13" fill="#020617" />
          <rect x={frogX - 2} y={frogY + 8} width="20" height="12" fill="#0F172A" />
          <rect x={frogX - 1} y={frogY + 9} width="18" height="11" fill="#1E293B" />
          <rect x={frogX} y={frogY + 9} width="16" height="9" fill="#334155" />
          {/* High-Visibility Neon Cyan Racing Shoulder Stripes */}
          <rect x={frogX - 4} y={frogY + 8} width="3" height="12" fill="#0891B2" />
          <rect x={frogX - 3} y={frogY + 8} width="2" height="11" fill="#06B6D4" />
          <rect x={frogX + 17} y={frogY + 8} width="3" height="12" fill="#0891B2" />
          <rect x={frogX + 17} y={frogY + 8} width="2" height="11" fill="#06B6D4" />
          {/* Magenta Ribbed V-Neck Collar */}
          <rect x={frogX + 4} y={frogY + 8} width="8" height="2" fill="#BE123C" />
          <rect x={frogX + 6} y={frogY + 9} width="4" height="2" fill="#EC4899" />
          {/* Golden Varsity '88' Print on Chest with Drop Shadow */}
          <rect x={frogX + 3} y={frogY + 11} width="10" height="6" fill="#09090B" />
          <rect x={frogX + 4} y={frogY + 11} width="8" height="5" fill="#FACC15" />
          <rect x={frogX + 5} y={frogY + 11} width="6" height="1" fill="#FEF08A" />
          <rect x={frogX + 6} y={frogY + 12} width="4" height="3" fill="#0F172A" />
          <rect x={frogX + 7} y={frogY + 13} width="2" height="1" fill="#FACC15" />
        </g>
      )}

      {/* 21. Mountain Ranger Scout Parka */}
      {config.outfitId === 'field_scout_parka' && (
        <g id="preview-outfit-scout-parka">
          {/* Heavy Forest Pine Green Canvas Shell */}
          <rect x={frogX - 4} y={frogY + 8} width="24" height="13" fill="#0F260C" />
          <rect x={frogX - 3} y={frogY + 8} width="22" height="13" fill="#14532D" />
          <rect x={frogX - 2} y={frogY + 9} width="20" height="12" fill="#166534" />
          <rect x={frogX - 1} y={frogY + 9} width="18" height="11" fill="#15803D" />
          <rect x={frogX} y={frogY + 10} width="16" height="9" fill="#22C55E" />
          {/* Khaki / Tan Sherpa Storm Collar */}
          <rect x={frogX - 2} y={frogY + 7} width="20" height="3" fill="#78350F" />
          <rect x={frogX - 1} y={frogY + 7} width="18" height="2" fill="#B45309" />
          <rect x={frogX} y={frogY + 8} width="16" height="2" fill="#FEF3C7" />
          {/* Front Storm Flap with Metal Zipper & Brass Snaps */}
          <rect x={frogX + 7} y={frogY + 9} width="2" height="11" fill="#0F172A" />
          <rect x={frogX + 7} y={frogY + 10} width="1" height="9" fill="#FACC15" />
          {/* Embroidered Scout Badges (Campfire & Mountain Peak) */}
          <rect x={frogX + 2} y={frogY + 11} width="4" height="4" fill="#78350F" />
          <rect x={frogX + 2} y={frogY + 11} width="3" height="3" fill="#FEF08A" />
          <rect x={frogX + 3} y={frogY + 12} width="2" height="2" fill="#F59E0B" />
          <rect x={frogX + 10} y={frogY + 11} width="4" height="4" fill="#1E293B" />
          <rect x={frogX + 11} y={frogY + 11} width="3" height="3" fill="#38BDF8" />
          <rect x={frogX + 12} y={frogY + 11} width="2" height="1" fill="#FFFFFF" />
          {/* Bellows Cargo Pockets with Flaps */}
          <rect x={frogX - 1} y={frogY + 15} width="5" height="4" fill="#0F260C" />
          <rect x={frogX - 1} y={frogY + 15} width="5" height="1" fill="#14532D" />
          <rect x={frogX + 12} y={frogY + 15} width="5" height="4" fill="#0F260C" />
          <rect x={frogX + 12} y={frogY + 15} width="5" height="1" fill="#14532D" />
        </g>
      )}

      {/* 22. Buffalo Plaid & Sherpa Camp Vest */}
      {config.outfitId === 'flannel_camp_vest' && (
        <g id="preview-outfit-flannel-vest">
          {/* Red & Black Buffalo Plaid Long Sleeves */}
          <rect x={frogX - 4} y={frogY + 8} width="4" height="12" fill="#7F1D1D" />
          <rect x={frogX - 3} y={frogY + 8} width="3" height="11" fill="#DC2626" />
          <rect x={frogX - 4} y={frogY + 9} width="4" height="3" fill="#18181B" />
          <rect x={frogX - 4} y={frogY + 14} width="4" height="3" fill="#18181B" />
          <rect x={frogX + 16} y={frogY + 8} width="4" height="12" fill="#7F1D1D" />
          <rect x={frogX + 16} y={frogY + 8} width="3" height="11" fill="#DC2626" />
          <rect x={frogX + 16} y={frogY + 9} width="4" height="3" fill="#18181B" />
          <rect x={frogX + 16} y={frogY + 14} width="4" height="3" fill="#18181B" />
          {/* Puffy Tan / Chestnut Sherpa Camp Vest Body */}
          <rect x={frogX - 2} y={frogY + 8} width="20" height="12" fill="#451A03" />
          <rect x={frogX - 1} y={frogY + 8} width="18" height="12" fill="#78350F" />
          <rect x={frogX} y={frogY + 9} width="16" height="11" fill="#B45309" />
          <rect x={frogX + 1} y={frogY + 9} width="14" height="10" fill="#D97706" />
          {/* Fluffy Warm Sherpa Fleece Collar */}
          <rect x={frogX + 1} y={frogY + 7} width="14" height="3" fill="#FEF3C7" />
          <rect x={frogX + 2} y={frogY + 8} width="12" height="2" fill="#FFFFFF" />
          {/* Three Heavy Brass Snap Buttons */}
          <rect x={frogX + 7} y={frogY + 10} width="2" height="2" fill="#78350F" />
          <rect x={frogX + 7} y={frogY + 10} width="2" height="1" fill="#FACC15" />
          <rect x={frogX + 7} y={frogY + 13} width="2" height="2" fill="#78350F" />
          <rect x={frogX + 7} y={frogY + 13} width="2" height="1" fill="#FACC15" />
          <rect x={frogX + 7} y={frogY + 16} width="2" height="2" fill="#78350F" />
          <rect x={frogX + 7} y={frogY + 16} width="2" height="1" fill="#FACC15" />
        </g>
      )}

      {/* 23. Down Mummy Sleeping Bag Cocoon */}
      {config.outfitId === 'cozy_sleeping_bag' && (
        <g id="preview-outfit-sleeping-bag">
          {/* Snug Quilted Mummy Sleeping Bag Cocoon */}
          <rect x={frogX - 5} y={frogY + 8} width="26" height="15" fill="#0C4A6E" />
          <rect x={frogX - 4} y={frogY + 8} width="24" height="15" fill="#0369A1" />
          <rect x={frogX - 3} y={frogY + 9} width="22" height="14" fill="#0284C7" />
          <rect x={frogX - 2} y={frogY + 9} width="20" height="13" fill="#38BDF8" />
          {/* Drawstring Neck Collar with Cord Toggle */}
          <rect x={frogX - 3} y={frogY + 7} width="22" height="3" fill="#075985" />
          <rect x={frogX - 2} y={frogY + 7} width="20" height="2" fill="#38BDF8" />
          <rect x={frogX + 7} y={frogY + 7} width="2" height="3" fill="#FACC15" />
          <rect x={frogX + 7} y={frogY + 7} width="1" height="1" fill="#FEF08A" />
          {/* Quilted Down Baffle Stitch Lines */}
          <rect x={frogX - 3} y={frogY + 11} width="22" height="1" fill="#075985" />
          <rect x={frogX - 3} y={frogY + 14} width="22" height="1" fill="#075985" />
          <rect x={frogX - 3} y={frogY + 17} width="22" height="1" fill="#075985" />
          <rect x={frogX - 3} y={frogY + 20} width="22" height="1" fill="#075985" />
          {/* Cozy Tangerine Interior Flap Folded Over */}
          <rect x={frogX + 3} y={frogY + 9} width="10" height="3" fill="#C2410C" />
          <rect x={frogX + 4} y={frogY + 9} width="8" height="2" fill="#EA580C" />
          <rect x={frogX + 5} y={frogY + 10} width="6" height="1" fill="#FB923C" />
          {/* Embroidered Campfire Patch on Lower Baffle */}
          <rect x={frogX - 1} y={frogY + 12} width="3" height="2" fill="#FBBF24" />
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

      {/* Camping Set: Campfire Warm Amber Glow & Ember Sparkles */}
      {config.glassesId === 'campfire_warm_glow' && (
        <g>
          {/* Warm Rosy Bonfire Cheeks */}
          <rect x={frogX - 2} y={frogY + 9} width="4" height="3" fill="#F97316" opacity="0.85" />
          <rect x={frogX + 14} y={frogY + 9} width="4" height="3" fill="#F97316" opacity="0.85" />
          <rect x={frogX - 1} y={frogY + 10} width="2" height="1" fill="#FDE047" />
          <rect x={frogX + 15} y={frogY + 10} width="2" height="1" fill="#FDE047" />
          {/* Animated Warm Embers Drifting Up */}
          <rect x={frogX + 7} y={frogY - (soloTick % 2 === 0 ? 3 : 5)} width="2" height="2" fill="#F59E0B" />
          <rect x={frogX - 4} y={frogY + 2 - (soloTick % 2 === 0 ? 2 : 0)} width="1" height="1" fill="#EF4444" />
          <rect x={frogX + 19} y={frogY + 1 - (soloTick % 2 === 0 ? 0 : 2)} width="1" height="1" fill="#FACC15" />
        </g>
      )}

      {/* Camping Set: Explorer Field Binoculars */}
      {config.glassesId === 'explorer_binoculars' && (
        <g>
          {/* Neck Strap */}
          <rect x={frogX + 1} y={frogY + 6} width="14" height="1" fill="#78350F" />
          <rect x={frogX + 3} y={frogY + 7} width="1" height="3" fill="#78350F" />
          <rect x={frogX + 12} y={frogY + 7} width="1" height="3" fill="#78350F" />
          {/* Dual Brass Binoculars Hanging on Chest */}
          <rect x={frogX + 2} y={frogY + 10} width="5" height="7" fill="#B45309" stroke="#78350F" strokeWidth="0.5" />
          <rect x={frogX + 9} y={frogY + 10} width="5" height="7" fill="#B45309" stroke="#78350F" strokeWidth="0.5" />
          <rect x={frogX + 6} y={frogY + 12} width="4" height="2" fill="#78350F" />
          {/* Glass Lens Highlights */}
          <rect x={frogX + 3} y={frogY + 14} width="3" height="2" fill="#38BDF8" />
          <rect x={frogX + 4} y={frogY + 14} width="1" height="1" fill="#FFFFFF" />
          <rect x={frogX + 10} y={frogY + 14} width="3" height="2" fill="#38BDF8" />
          <rect x={frogX + 11} y={frogY + 14} width="1" height="1" fill="#FFFFFF" />
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
          {/* Deep Green Stem Base */}
          <rect x={frogX + 7} y={frogY - 6} width="2" height="3" fill="#14532D" />
          <rect x={frogX + 8} y={frogY - 7} width="1" height="2" fill="#166534" />
          {/* 4-Tone Water Lily Pad */}
          <rect x={frogX - 2} y={frogY} width="20" height="2" fill="#14532D" />
          <rect x={frogX - 1} y={frogY - 1} width="18" height="2" fill="#15803D" />
          <rect x={frogX} y={frogY - 2} width="16" height="2" fill="#22C55E" />
          <rect x={frogX + 2} y={frogY - 3} width="12" height="2" fill="#4ADE80" />
          <rect x={frogX + 4} y={frogY - 4} width="8" height="2" fill="#86EFAC" />
          {/* Delicate Water Lily Blossom on Side */}
          <rect x={frogX + 11} y={frogY - 5} width="4" height="4" fill="#F472B6" />
          <rect x={frogX + 12} y={frogY - 6} width="2" height="2" fill="#FBCFE8" />
          <rect x={frogX + 12} y={frogY - 4} width="2" height="2" fill="#FDE047" />
          {/* Glistening Specular Dewdrop */}
          <rect x={frogX + 3} y={frogY - 2} width="2" height="2" fill="#E0F2FE" />
          <rect x={frogX + 3} y={frogY - 2} width="1" height="1" fill="#FFFFFF" />
        </g>
      )}

      {config.hatId === 'straw' && (
        <g>
          {/* 4-Tone Woven Wicker Crown */}
          <rect x={frogX + 4} y={frogY - 6} width="8" height="5" fill="#78350F" />
          <rect x={frogX + 5} y={frogY - 6} width="6" height="4" fill="#D97706" />
          <rect x={frogX + 5} y={frogY - 5} width="6" height="3" fill="#F59E0B" />
          <rect x={frogX + 6} y={frogY - 5} width="4" height="2" fill="#FDE68A" />
          {/* Woven Cross-hatch Texture Pixels */}
          <rect x={frogX + 6} y={frogY - 4} width="1" height="1" fill="#78350F" />
          <rect x={frogX + 9} y={frogY - 4} width="1" height="1" fill="#78350F" />
          {/* Rich Crimson Fabric Ribbon Band with Stitch Lines */}
          <rect x={frogX + 3} y={frogY - 2} width="10" height="2" fill="#991B1B" />
          <rect x={frogX + 4} y={frogY - 2} width="8" height="1" fill="#EF4444" />
          {/* Wide Woven Brim with Cast Shadow on Frog Forehead */}
          <rect x={frogX - 4} y={frogY} width="24" height="3" fill="#78350F" />
          <rect x={frogX - 3} y={frogY} width="22" height="2" fill="#D97706" />
          <rect x={frogX - 2} y={frogY} width="20" height="1" fill="#FDE68A" />
          <rect x={frogX - 2} y={frogY + 3} width="20" height="1" fill="#000000" opacity="0.25" />
        </g>
      )}

      {/* Sakura Blossom Flower Crown */}
      {config.hatId === 'sakura' && (
        <g>
          {/* Entwined Forest Vine Circlet */}
          <rect x={frogX - 1} y={frogY + 2} width="18" height="2" fill="#14532D" />
          <rect x={frogX} y={frogY + 2} width="16" height="1" fill="#22C55E" />
          {/* 3 Delicate Sakura Blossoms with Shaded Petals & Golden Stamens */}
          {/* Left Blossom */}
          <rect x={frogX - 1} y={frogY - 2} width="4" height="4" fill="#DB2777" />
          <rect x={frogX} y={frogY - 1} width="3" height="3" fill="#F472B6" />
          <rect x={frogX + 1} y={frogY} width="2" height="2" fill="#FBCFE8" />
          <rect x={frogX + 1} y={frogY} width="1" height="1" fill="#FDE047" />
          {/* Center Blossom (Elevated) */}
          <rect x={frogX + 5} y={frogY - 4} width="6" height="5" fill="#DB2777" />
          <rect x={frogX + 6} y={frogY - 3} width="4" height="4" fill="#F472B6" />
          <rect x={frogX + 7} y={frogY - 2} width="2" height="2" fill="#FCE7F3" />
          <rect x={frogX + 7} y={frogY - 2} width="1" height="1" fill="#FACC15" />
          {/* Right Blossom */}
          <rect x={frogX + 13} y={frogY - 2} width="4" height="4" fill="#DB2777" />
          <rect x={frogX + 13} y={frogY - 1} width="3" height="3" fill="#F472B6" />
          <rect x={frogX + 13} y={frogY} width="2" height="2" fill="#FBCFE8" />
          <rect x={frogX + 14} y={frogY} width="1" height="1" fill="#FDE047" />
          {/* Floating Cherry Petals */}
          <rect x={frogX + 3} y={frogY - 3} width="2" height="1" fill="#F472B6" />
          <rect x={frogX + 11} y={frogY - 3} width="2" height="1" fill="#F472B6" />
        </g>
      )}

      {/* Mystic Star Wizard Hat */}
      {config.hatId === 'wizard' && (
        <g>
          {/* 5-Tone Midnight Indigo Wizard Conical Hat */}
          <rect x={frogX + 7} y={frogY - 13} width="2" height="3" fill="#0F172A" />
          <rect x={frogX + 8} y={frogY - 12} width="1" height="2" fill="#312E81" />
          <rect x={frogX + 6} y={frogY - 10} width="4" height="4" fill="#1E1B4B" />
          <rect x={frogX + 7} y={frogY - 9} width="3" height="3" fill="#3730A3" />
          <rect x={frogX + 5} y={frogY - 6} width="6" height="4" fill="#1E1B4B" />
          <rect x={frogX + 6} y={frogY - 5} width="5" height="3" fill="#4338CA" />
          <rect x={frogX + 4} y={frogY - 2} width="8" height="3" fill="#1E1B4B" />
          <rect x={frogX + 5} y={frogY - 2} width="7" height="2" fill="#4F46E5" />
          {/* Glowing Golden Celestial Star */}
          <rect x={frogX + 7} y={frogY - 7} width="3" height="3" fill="#FACC15" />
          <rect x={frogX + 8} y={frogY - 8} width="1" height="5" fill="#FDE047" />
          <rect x={frogX + 6} y={frogY - 6} width="5" height="1" fill="#FDE047" />
          <rect x={frogX + 8} y={frogY - 6} width="1" height="1" fill="#FFFFFF" />
          {/* Golden Runed Hat Band */}
          <rect x={frogX + 3} y={frogY} width="10" height="2" fill="#B45309" />
          <rect x={frogX + 4} y={frogY} width="8" height="1" fill="#F59E0B" />
          <rect x={frogX + 7} y={frogY} width="2" height="1" fill="#FEF08A" />
          {/* Wide Indigo Brim with Cast Shadow */}
          <rect x={frogX - 3} y={frogY + 2} width="22" height="3" fill="#0F172A" />
          <rect x={frogX - 2} y={frogY + 2} width="20" height="2" fill="#312E81" />
          <rect x={frogX - 1} y={frogY + 2} width="18" height="1" fill="#6366F1" />
        </g>
      )}

      {/* Red Bandana */}
      {config.hatId === 'bandana' && (
        <g>
          {/* Crimson Fabric Wrap with Fold Shading */}
          <rect x={frogX - 2} y={frogY + 2} width="20" height="4" fill="#7F1D1D" />
          <rect x={frogX - 1} y={frogY + 2} width="18" height="3" fill="#B91C1C" />
          <rect x={frogX} y={frogY + 3} width="16" height="2" fill="#DC2626" />
          <rect x={frogX + 1} y={frogY + 3} width="14" height="1" fill="#EF4444" />
          {/* Paisley / Polka Pattern Dots */}
          <rect x={frogX + 2} y={frogY + 3} width="1" height="1" fill="#FFFFFF" />
          <rect x={frogX + 6} y={frogY + 4} width="1" height="1" fill="#FFFFFF" />
          <rect x={frogX + 10} y={frogY + 3} width="1" height="1" fill="#FFFFFF" />
          <rect x={frogX + 14} y={frogY + 4} width="1" height="1" fill="#FFFFFF" />
          {/* Tied Ribbon Knot on Right */}
          <rect x={frogX + 15} y={frogY + 4} width="4" height="5" fill="#7F1D1D" />
          <rect x={frogX + 16} y={frogY + 4} width="3" height="4" fill="#DC2626" />
          <rect x={frogX + 17} y={frogY + 5} width="2" height="2" fill="#EF4444" />
        </g>
      )}

      {/* Winter Knit Beanie */}
      {config.hatId === 'beanie' && (
        <g>
          {/* Fluffy Snow Pom-Pom */}
          <rect x={frogX + 6} y={frogY - 9} width="4" height="4" fill="#E2E8F0" />
          <rect x={frogX + 7} y={frogY - 9} width="2" height="2" fill="#FFFFFF" />
          {/* 4-Tone Crimson Wool Beanie Dome */}
          <rect x={frogX - 1} y={frogY - 6} width="18" height="8" fill="#7F1D1D" />
          <rect x={frogX} y={frogY - 6} width="16" height="7" fill="#B91C1C" />
          <rect x={frogX + 1} y={frogY - 5} width="14" height="5" fill="#DC2626" />
          <rect x={frogX + 3} y={frogY - 4} width="10" height="3" fill="#EF4444" />
          {/* Ribbed Knit Stripes */}
          <rect x={frogX + 3} y={frogY - 5} width="1" height="6" fill="#991B1B" />
          <rect x={frogX + 7} y={frogY - 5} width="1" height="6" fill="#991B1B" />
          <rect x={frogX + 11} y={frogY - 5} width="1" height="6" fill="#991B1B" />
          {/* Folded Waffle Cuff */}
          <rect x={frogX - 2} y={frogY} width="20" height="3" fill="#991B1B" />
          <rect x={frogX - 1} y={frogY} width="18" height="2" fill="#F87171" />
          <rect x={frogX} y={frogY} width="16" height="1" fill="#FECACA" />
        </g>
      )}

      {/* Chef Toque */}
      {config.hatId === 'chef' && (
        <g>
          {/* Puffy Chef Toque Folds with Soft Shading */}
          <rect x={frogX} y={frogY - 11} width="16" height="11" fill="#94A3B8" />
          <rect x={frogX + 1} y={frogY - 11} width="14" height="10" fill="#CBD5E1" />
          <rect x={frogX + 2} y={frogY - 10} width="12" height="9" fill="#F8FAFC" />
          <rect x={frogX + 3} y={frogY - 9} width="10" height="7" fill="#FFFFFF" />
          {/* Vertical Pleats */}
          <rect x={frogX + 4} y={frogY - 9} width="1" height="6" fill="#E2E8F0" />
          <rect x={frogX + 8} y={frogY - 10} width="1" height="7" fill="#E2E8F0" />
          <rect x={frogX + 12} y={frogY - 9} width="1" height="6" fill="#E2E8F0" />
          {/* Stiff Starched Hatband */}
          <rect x={frogX - 2} y={frogY} width="20" height="3" fill="#64748B" />
          <rect x={frogX - 1} y={frogY} width="18" height="2" fill="#E2E8F0" />
          <rect x={frogX} y={frogY} width="16" height="1" fill="#FFFFFF" />
        </g>
      )}

      {/* Royal Golden Crown */}
      {config.hatId === 'crown' && (
        <g>
          {/* 5-Tone Gilded Gold Crown Spikes with Gemstones */}
          <rect x={frogX - 1} y={frogY - 5} width="18" height="8" fill="#78350F" />
          {/* Left Spike */}
          <rect x={frogX} y={frogY - 4} width="4" height="6" fill="#D97706" />
          <rect x={frogX + 1} y={frogY - 3} width="2" height="4" fill="#FACC15" />
          <rect x={frogX + 1} y={frogY - 3} width="1" height="1" fill="#FEF08A" />
          <rect x={frogX + 1} y={frogY - 1} width="2" height="2" fill="#DC2626" />
          <rect x={frogX + 1} y={frogY - 1} width="1" height="1" fill="#FFFFFF" />
          {/* Center Tall Spike */}
          <rect x={frogX + 6} y={frogY - 6} width="4" height="8" fill="#D97706" />
          <rect x={frogX + 7} y={frogY - 5} width="2" height="6" fill="#FACC15" />
          <rect x={frogX + 7} y={frogY - 5} width="1" height="1" fill="#FEF08A" />
          <rect x={frogX + 7} y={frogY - 2} width="2" height="2" fill="#2563EB" />
          <rect x={frogX + 7} y={frogY - 2} width="1" height="1" fill="#FFFFFF" />
          {/* Right Spike */}
          <rect x={frogX + 12} y={frogY - 4} width="4" height="6" fill="#D97706" />
          <rect x={frogX + 13} y={frogY - 3} width="2" height="4" fill="#FACC15" />
          <rect x={frogX + 13} y={frogY - 3} width="1" height="1" fill="#FEF08A" />
          <rect x={frogX + 13} y={frogY - 1} width="2" height="2" fill="#16A34A" />
          <rect x={frogX + 13} y={frogY - 1} width="1" height="1" fill="#FFFFFF" />
          {/* Crown Circlet Base */}
          <rect x={frogX - 2} y={frogY + 1} width="20" height="3" fill="#78350F" />
          <rect x={frogX - 1} y={frogY + 1} width="18" height="2" fill="#F59E0B" />
          <rect x={frogX} y={frogY + 1} width="16" height="1" fill="#FEF08A" />
        </g>
      )}

      {/* Artist Beret */}
      {config.hatId === 'beret' && (
        <g>
          {/* Stalk / Tab */}
          <rect x={frogX + 7} y={frogY - 5} width="2" height="3" fill="#450A0A" />
          {/* 4-Tone Parisian Burgundy Wool Beret */}
          <rect x={frogX - 3} y={frogY - 3} width="22" height="6" fill="#450A0A" />
          <rect x={frogX - 2} y={frogY - 3} width="20" height="5" fill="#881337" />
          <rect x={frogX - 1} y={frogY - 2} width="18" height="4" fill="#BE123C" />
          <rect x={frogX} y={frogY - 2} width="14" height="2" fill="#FB7185" />
          {/* Slanted Side Fold Shading */}
          <rect x={frogX - 3} y={frogY} width="4" height="3" fill="#450A0A" />
          <rect x={frogX - 1} y={frogY + 2} width="18" height="1" fill="#450A0A" />
        </g>
      )}

      {/* Tropical Plumeria / Hibiscus Flower */}
      {config.hatId === 'flower' && (
        <g>
          {/* 5-Tone Radiant Sunlight Plumeria Blossom Behind Right Ear */}
          <rect x={frogX + 13} y={frogY - 2} width="6" height="6" fill="#B45309" />
          <rect x={frogX + 14} y={frogY - 1} width="5" height="5" fill="#FDE047" />
          <rect x={frogX + 15} y={frogY} width="3" height="3" fill="#FEF08A" />
          {/* Petal Highlights */}
          <rect x={frogX + 15} y={frogY - 2} width="2" height="2" fill="#FFFFFF" />
          <rect x={frogX + 18} y={frogY + 1} width="2" height="2" fill="#FFFFFF" />
          <rect x={frogX + 13} y={frogY + 1} width="2" height="2" fill="#FFFFFF" />
          {/* Warm Amber Center */}
          <rect x={frogX + 15} y={frogY + 1} width="2" height="2" fill="#EA580C" />
          <rect x={frogX + 16} y={frogY + 1} width="1" height="1" fill="#DC2626" />
        </g>
      )}

      {/* Lo-Fi Studio Headphones */}
      {config.hatId === 'headphone' && (
        <g>
          {/* Cushioned Top Headband Arch */}
          <rect x={frogX - 2} y={frogY - 4} width="20" height="3" fill="#0F172A" />
          <rect x={frogX - 1} y={frogY - 4} width="18" height="2" fill="#1E293B" />
          <rect x={frogX} y={frogY - 4} width="16" height="1" fill="#475569" />
          {/* Metal Adjustable Sliders */}
          <rect x={frogX - 3} y={frogY - 1} width="2" height="4" fill="#94A3B8" />
          <rect x={frogX + 17} y={frogY - 1} width="2" height="4" fill="#94A3B8" />
          {/* Left Earcup with Soft Blue Velvet Cushion */}
          <rect x={frogX - 4} y={frogY + 2} width="4" height="9" fill="#0F172A" />
          <rect x={frogX - 3} y={frogY + 3} width="3" height="7" fill="#2563EB" />
          <rect x={frogX - 2} y={frogY + 4} width="2" height="5" fill="#60A5FA" />
          <rect x={frogX - 2} y={frogY + 5} width="1" height="2" fill="#FFFFFF" />
          {/* Right Earcup with Soft Blue Velvet Cushion */}
          <rect x={frogX + 16} y={frogY + 2} width="4" height="9" fill="#0F172A" />
          <rect x={frogX + 16} y={frogY + 3} width="3" height="7" fill="#2563EB" />
          <rect x={frogX + 16} y={frogY + 4} width="2" height="5" fill="#60A5FA" />
          <rect x={frogX + 17} y={frogY + 5} width="1" height="2" fill="#FFFFFF" />
        </g>
      )}

      {/* Detective Houndstooth Cap */}
      {config.hatId === 'detective' && (
        <g>
          {/* Crown of Cap with Houndstooth Tone */}
          <rect x={frogX - 1} y={frogY - 6} width="18" height="8" fill="#451A03" />
          <rect x={frogX} y={frogY - 5} width="16" height="6" fill="#78350F" />
          <rect x={frogX + 1} y={frogY - 5} width="14" height="4" fill="#92400E" />
          <rect x={frogX + 2} y={frogY - 4} width="12" height="2" fill="#B45309" />
          {/* Center Button on Crown */}
          <rect x={frogX + 7} y={frogY - 7} width="2" height="2" fill="#451A03" />
          {/* Dual Visor Peaks (Front & Back) */}
          <rect x={frogX - 4} y={frogY} width="24" height="3" fill="#451A03" />
          <rect x={frogX - 3} y={frogY} width="22" height="2" fill="#78350F" />
          <rect x={frogX - 2} y={frogY} width="20" height="1" fill="#D97706" />
          {/* Ear Flap Ribbon Tied on Top */}
          <rect x={frogX + 6} y={frogY - 6} width="4" height="2" fill="#18181B" />
        </g>
      )}

      {/* Samurai Kabuto */}
      {config.hatId === 'samurai' && (
        <g>
          {/* Golden Crescent Maedate Crest */}
          <rect x={frogX + 7} y={frogY - 9} width="2" height="5" fill="#78350F" />
          <rect x={frogX + 7} y={frogY - 9} width="2" height="4" fill="#FACC15" />
          <rect x={frogX + 3} y={frogY - 7} width="10" height="3" fill="#78350F" />
          <rect x={frogX + 4} y={frogY - 7} width="8" height="2" fill="#FACC15" />
          <rect x={frogX + 5} y={frogY - 6} width="6" height="1" fill="#FEF08A" />
          <rect x={frogX + 7} y={frogY - 5} width="2" height="2" fill="#DC2626" />
          {/* Lacquered Steel Bowl (Hachi) */}
          <rect x={frogX - 2} y={frogY - 3} width="20" height="5" fill="#09090B" />
          <rect x={frogX - 1} y={frogY - 3} width="18" height="4" fill="#18181B" />
          <rect x={frogX} y={frogY - 2} width="16" height="2" fill="#3F3F46" />
          {/* Shikoro Neck Guard Flaps */}
          <rect x={frogX - 4} y={frogY + 1} width="24" height="3" fill="#7F1D1D" />
          <rect x={frogX - 3} y={frogY + 1} width="22" height="2" fill="#DC2626" />
          <rect x={frogX - 2} y={frogY + 1} width="20" height="1" fill="#FCA5A5" />
          {/* Golden Corner Rivets */}
          <rect x={frogX - 3} y={frogY + 2} width="2" height="2" fill="#FACC15" />
          <rect x={frogX + 17} y={frogY + 2} width="2" height="2" fill="#FACC15" />
        </g>
      )}

      {/* Camping Set: Ranger Safari Hat */}
      {config.hatId === 'ranger_safari_hat' && (
        <g>
          {/* Wide Canvas Brim */}
          <rect x={frogX - 4} y={frogY + 1} width="24" height="3" fill="#4D7C0F" />
          <rect x={frogX - 2} y={frogY + 1} width="20" height="1" fill="#65A30D" />
          {/* Crown of Hat */}
          <rect x={frogX} y={frogY - 6} width="16" height="7" fill="#4D7C0F" />
          <rect x={frogX + 2} y={frogY - 7} width="12" height="2" fill="#365314" />
          {/* Leather Hatband & Pine Needle Badge */}
          <rect x={frogX} y={frogY - 1} width="16" height="2" fill="#78350F" />
          <rect x={frogX + 6} y={frogY - 3} width="4" height="3" fill="#FACC15" stroke="#92400E" strokeWidth="0.4" />
          <rect x={frogX + 7} y={frogY - 2} width="2" height="1" fill="#15803D" />
          {/* Chin Cord Loop */}
          <rect x={frogX - 2} y={frogY + 4} width="1" height="4" fill="#78350F" />
          <rect x={frogX + 17} y={frogY + 4} width="1" height="4" fill="#78350F" />
          <rect x={frogX + 7} y={frogY + 8} width="2" height="1" fill="#FDE047" />
        </g>
      )}

      {/* Camping Set: Marshmallow Beanie */}
      {config.hatId === 'marshmallow_beanie' && (
        <g>
          {/* Fluffy Pom-Pom at top */}
          <rect x={frogX + 6} y={frogY - 9} width="4" height="3" fill="#FEF3C7" />
          <rect x={frogX + 7} y={frogY - 10} width="2" height="1" fill="#FEF3C7" />
          {/* Mustard Knit Beanie Crown */}
          <rect x={frogX - 1} y={frogY - 6} width="18" height="8" fill="#D97706" />
          <rect x={frogX + 1} y={frogY - 7} width="14" height="2" fill="#B45309" />
          {/* Folded Waffle Cuff */}
          <rect x={frogX - 2} y={frogY} width="20" height="3" fill="#B45309" />
          {/* Toasted Marshmallow Patch */}
          <rect x={frogX + 6} y={frogY - 3} width="4" height="4" fill="#FEF3C7" stroke="#78350F" strokeWidth="0.4" />
          <rect x={frogX + 7} y={frogY - 2} width="2" height="1" fill="#78350F" />
        </g>
      )}

      {/* Camping Set: Night Scout Headlamp */}
      {config.hatId === 'scout_headlamp' && (
        <g>
          {/* Camo Elastic Headband */}
          <rect x={frogX - 2} y={frogY + 1} width="20" height="2.5" fill="#365314" />
          <rect x={frogX + 2} y={frogY + 1} width="3" height="2.5" fill="#4D7C0F" />
          <rect x={frogX + 11} y={frogY + 1} width="3" height="2.5" fill="#4D7C0F" />
          {/* LED Lamp Body */}
          <rect x={frogX + 5} y={frogY - 2} width="6" height="5" fill="#18181B" stroke="#374151" strokeWidth="0.4" />
          {/* Bright Glowing LED Lens */}
          <rect x={frogX + 6} y={frogY - 1} width="4" height="3" fill="#38BDF8" />
          <rect x={frogX + 7} y={frogY} width="2" height="1" fill="#FFFFFF" />
          {/* Illuminated Forward Beam Fan - Stepped Pixel Beam */}
          <g opacity="0.35" fill="#FEF08A">
            <rect x={frogX + 12} y={frogY - 1} width="4" height="4" />
            <rect x={frogX + 16} y={frogY - 3} width="4" height="8" />
            <rect x={frogX + 20} y={frogY - 5} width="4" height="12" />
            <rect x={frogX + 24} y={frogY - 7} width="4" height="16" />
          </g>
        </g>
      )}

      {/* PROPS / HANDHELD ITEM */}
      {config.activityId === 'tea' && (
        <g>
          {/* Authentic Japanese Ceramic Matcha Chawan (Stoneware Clay Base) */}
          <rect x={frogX + 4} y={frogY + 12} width="8" height="6" fill="#4B382A" />
          <rect x={frogX + 5} y={frogY + 13} width="6" height="4" fill="#6E503B" />
          <rect x={frogX + 5} y={frogY + 17} width="6" height="1" fill="#382415" />
          {/* Frothy Emerald Matcha Green Tea with Highlight */}
          <rect x={frogX + 5} y={frogY + 12} width="6" height="2" fill="#15803D" />
          <rect x={frogX + 6} y={frogY + 12} width="4" height="1" fill="#22C55E" />
          <rect x={frogX + 8} y={frogY + 12} width="1" height="1" fill="#86EFAC" />
          {/* Rising Warm Pixel Steam Wisps */}
          <rect x={frogX + 6 + (soloTick % 2 === 0 ? 0 : 1)} y={frogY + 9 - ((soloTick * 0.5) % 3)} width="2" height="2" fill="#FFFFFF" opacity={0.7} />
          <rect x={frogX + 8 - (soloTick % 2 === 0 ? 0 : 1)} y={frogY + 7 - ((soloTick * 0.5) % 3)} width="1" height="2" fill="#E0F2FE" opacity={0.5} />
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

      {/* Camping Set: Roasting Marshmallows over Campfire Skewer */}
      {config.activityId === 'roasting_marshmallow' && (
        <g>
          {/* Rustic Wood Branch Skewer */}
          <rect x={frogX + 3} y={frogY + 14} width="2" height="3" fill={skin.main} />
          <rect x={frogX + 5} y={frogY + 14} width="15" height="1" fill="#78350F" />
          <rect x={frogX + 18} y={frogY + 11} width="1" height="6" fill="#78350F" />
          {/* Golden Toasted Marshmallows */}
          <rect x={frogX + 13} y={frogY + 12} width="4" height="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.4" />
          <rect x={frogX + 14} y={frogY + 13} width="2" height="2" fill="#B45309" />
          <rect x={frogX + 18} y={frogY + 9} width="4" height="4" fill="#FFFFFF" stroke="#D97706" strokeWidth="0.4" />
          <rect x={frogX + 19} y={frogY + 10} width="2" height="1" fill="#FEF3C7" />
          {/* Steam Wisp */}
          <rect x={frogX + 16} y={frogY + 7 - (soloTick % 2 === 0 ? 0 : 2)} width="2" height="2" fill="#FFFFFF" opacity="0.75" />
        </g>
      )}

      {/* Camping Set: Holding Brass Camp Lantern */}
      {config.activityId === 'holding_camp_lantern' && (
        <g>
          {/* Frog Arm Holding Top Bail */}
          <rect x={frogX + 8} y={frogY + 13} width="3" height="3" fill={skin.main} />
          {/* Wire Handle Loop */}
          <rect x={frogX + 10} y={frogY + 10} width="6" height="1" fill="#64748B" />
          <rect x={frogX + 10} y={frogY + 11} width="1" height="2" fill="#64748B" />
          <rect x={frogX + 15} y={frogY + 11} width="1" height="2" fill="#64748B" />
          {/* Brass Cap & Base */}
          <rect x={frogX + 9} y={frogY + 12} width="8" height="2" fill="#CA8A04" />
          <rect x={frogX + 9} y={frogY + 19} width="8" height="2" fill="#CA8A04" />
          {/* Glowing Glass Globe */}
          <rect x={frogX + 10} y={frogY + 14} width="6" height="5" fill="#FDE047" stroke="#EAB308" strokeWidth="0.4" />
          <rect x={frogX + 12} y={frogY + 15} width="2" height="3" fill="#FFFFFF" />
          {/* Protective Metal Grille */}
          <rect x={frogX + 12} y={frogY + 14} width="1" height="5" fill="#78350F" opacity="0.6" />
        </g>
      )}

      {/* Camping Set: Camp Kettle & Enamel Coffee Mug */}
      {config.activityId === 'camp_kettle_coffee' && (
        <g>
          {/* Frog Paw */}
          <rect x={frogX + 4} y={frogY + 14} width="3" height="3" fill={skin.main} />
          {/* Speckled Enamel Camp Mug */}
          <rect x={frogX + 6} y={frogY + 13} width="6" height="6" fill="#0369A1" stroke="#0284C7" strokeWidth="0.4" />
          <rect x={frogX + 12} y={frogY + 14} width="2" height="3" fill="#0284C7" />
          <rect x={frogX + 7} y={frogY + 12} width="4" height="2" fill="#451A03" />
          {/* Steam puffs */}
          <rect x={frogX + 8} y={frogY + 8 - (soloTick % 2 === 0 ? 0 : 2)} width="2" height="2" fill="#FFFFFF" opacity="0.8" />
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
      case 'retro_arcade':
        return '#0f0728';
      case 'convenience_store':
        return '#f8fafc';
      case 'sushi_bar':
        return '#78350f';
      case 'forest_camp':
        return '#0f291e';
      case 'red_riding_forest':
        return '#14532d';
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

          {/* Digital LED Sign: 38.0°C (Pure Stepped Pixel 7-Segment Display) */}
          <rect x="68" y="24" width="24" height="7" fill="#18181b" stroke="#3f3f46" strokeWidth="0.5" />
          <g transform="translate(71, 26)" fill="#ef4444">
            {/* '3' */}
            <rect x="0" y="0" width="3" height="1" />
            <rect x="2" y="0" width="1" height="3" />
            <rect x="0" y="1.5" width="3" height="1" />
            <rect x="2" y="1.5" width="1" height="2.5" />
            <rect x="0" y="3" width="3" height="1" />
            {/* '8' */}
            <rect x="4" y="0" width="3" height="4" />
            <rect x="5" y="1" width="1" height="0.6" fill="#18181b" />
            <rect x="5" y="2.4" width="1" height="0.6" fill="#18181b" />
            {/* '.' */}
            <rect x="8" y="3" width="1" height="1" />
            {/* '0' */}
            <rect x="10" y="0" width="3" height="4" />
            <rect x="11" y="1" width="1" height="2" fill="#18181b" />
            {/* '°C' */}
            <rect x="14" y="0" width="1" height="1" />
            <rect x="15.5" y="0" width="2.5" height="4" />
            <rect x="16.5" y="1" width="1.5" height="2" fill="#18181b" />
          </g>

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

      {/* RETRO 8-BIT GAME STORE & ARCADE CENTER (100% PURE PIXEL ART) */}
      {config.sceneId === 'retro_arcade' && (
        <g id="scene-retro-arcade">
          {/* Dark Synthwave Purple Wall (Extended for fullscreen) */}
          <rect x="0" y="-80" width="160" height="140" fill="#130924" />

          {/* Synthwave Neon Grid Wall Lines (Pure Stepped 1px Rects) */}
          <rect x="0" y="-48" width="160" height="1" fill="#4c1d95" opacity="0.6" />
          <rect x="0" y="-16" width="160" height="1" fill="#4c1d95" opacity="0.6" />
          <rect x="0" y="16" width="160" height="1" fill="#4c1d95" opacity="0.6" />
          <rect x="0" y="32" width="160" height="1" fill="#4c1d95" opacity="0.6" />
          <rect x="0" y="48" width="160" height="1" fill="#4c1d95" opacity="0.6" />
          <rect x="40" y="-80" width="1" height="140" fill="#4c1d95" opacity="0.4" />
          <rect x="80" y="-80" width="1" height="140" fill="#4c1d95" opacity="0.4" />
          <rect x="120" y="-80" width="1" height="140" fill="#4c1d95" opacity="0.4" />

          {/* Top Arcade Fascia Marquee Header */}
          <rect x="0" y="-80" width="160" height="94" fill="#090414" />
          <rect x="0" y="0" width="160" height="2" fill="#ec4899" />
          <rect x="0" y="12" width="160" height="2" fill="#06b6d4" />

          {/* Neon Signboard: 8-BIT ARCADE (Pure Pixel Art Sign) */}
          <rect x="26" y="1.5" width="108" height="10" fill="#1e1035" stroke="#ec4899" strokeWidth="0.6" />

          {/* Flashing Neon Pixel Bulbs along top & bottom edges */}
          <g>
            <rect x="28" y="2" width="2" height="1" fill={animTick % 2 === 0 ? "#facc15" : "#06b6d4"} />
            <rect x="42" y="2" width="2" height="1" fill={animTick % 2 === 1 ? "#ec4899" : "#facc15"} />
            <rect x="56" y="2" width="2" height="1" fill={animTick % 2 === 0 ? "#06b6d4" : "#ec4899"} />
            <rect x="70" y="2" width="2" height="1" fill={animTick % 2 === 1 ? "#facc15" : "#06b6d4"} />
            <rect x="84" y="2" width="2" height="1" fill={animTick % 2 === 0 ? "#ec4899" : "#facc15"} />
            <rect x="98" y="2" width="2" height="1" fill={animTick % 2 === 1 ? "#06b6d4" : "#ec4899"} />
            <rect x="112" y="2" width="2" height="1" fill={animTick % 2 === 0 ? "#facc15" : "#06b6d4"} />
            <rect x="126" y="2" width="2" height="1" fill={animTick % 2 === 1 ? "#ec4899" : "#facc15"} />

            <rect x="28" y="10" width="2" height="1" fill={animTick % 2 === 1 ? "#06b6d4" : "#facc15"} />
            <rect x="42" y="10" width="2" height="1" fill={animTick % 2 === 0 ? "#facc15" : "#ec4899"} />
            <rect x="56" y="10" width="2" height="1" fill={animTick % 2 === 1 ? "#ec4899" : "#06b6d4"} />
            <rect x="70" y="10" width="2" height="1" fill={animTick % 2 === 0 ? "#06b6d4" : "#facc15"} />
            <rect x="84" y="10" width="2" height="1" fill={animTick % 2 === 1 ? "#facc15" : "#ec4899"} />
            <rect x="98" y="10" width="2" height="1" fill={animTick % 2 === 0 ? "#ec4899" : "#06b6d4"} />
            <rect x="112" y="10" width="2" height="1" fill={animTick % 2 === 1 ? "#06b6d4" : "#facc15"} />
            <rect x="126" y="10" width="2" height="1" fill={animTick % 2 === 0 ? "#facc15" : "#ec4899"} />
          </g>

          {/* Left Sign Icon: Pixel Arcade Joystick */}
          <g transform="translate(29, 3)">
            {/* Red Ball */}
            <rect x="2" y="0" width="3" height="3" fill="#ef4444" />
            <rect x="2" y="0" width="1" height="1" fill="#fca5a5" />
            {/* Stick */}
            <rect x="3" y="3" width="1" height="2" fill="#cbd5e1" />
            {/* Console Base */}
            <rect x="1" y="5" width="5" height="2" fill="#334155" />
            <rect x="5" y="5" width="1" height="1" fill="#eab308" />
          </g>

          {/* Center Sign: Pure Pixel Art Block Letters for "8-BIT ARCADE" */}
          <g transform="translate(38, 4)" fill="#facc15">
            {/* 8 */}
            <rect x="0" y="0" width="3" height="5" />
            <rect x="1" y="1" width="1" height="1" fill="#1e1035" />
            <rect x="1" y="3" width="1" height="1" fill="#1e1035" />

            {/* - */}
            <rect x="4" y="2" width="2" height="1" />

            {/* B */}
            <rect x="7" y="0" width="3" height="5" />
            <rect x="8" y="1" width="1" height="1" fill="#1e1035" />
            <rect x="8" y="3" width="1" height="1" fill="#1e1035" />

            {/* I */}
            <rect x="11" y="0" width="3" height="1" />
            <rect x="12" y="1" width="1" height="3" />
            <rect x="11" y="4" width="3" height="1" />

            {/* T */}
            <rect x="15" y="0" width="3" height="1" />
            <rect x="16" y="1" width="1" height="4" />

            {/* Space - */}
            <rect x="20" y="0" width="1" height="5" opacity="0" />

            {/* A */}
            <rect x="22" y="0" width="3" height="5" />
            <rect x="23" y="1" width="1" height="1" fill="#1e1035" />
            <rect x="23" y="3" width="1" height="2" fill="#1e1035" />

            {/* R */}
            <rect x="26" y="0" width="3" height="5" />
            <rect x="27" y="1" width="1" height="1" fill="#1e1035" />
            <rect x="27" y="3" width="1" height="1" fill="#1e1035" />

            {/* C */}
            <rect x="30" y="0" width="3" height="5" />
            <rect x="31" y="1" width="2" height="3" fill="#1e1035" />

            {/* A */}
            <rect x="34" y="0" width="3" height="5" />
            <rect x="35" y="1" width="1" height="1" fill="#1e1035" />
            <rect x="35" y="3" width="1" height="2" fill="#1e1035" />

            {/* D */}
            <rect x="38" y="0" width="3" height="5" />
            <rect x="39" y="1" width="1" height="3" fill="#1e1035" />

            {/* E */}
            <rect x="42" y="0" width="3" height="5" />
            <rect x="43" y="1" width="2" height="1" fill="#1e1035" />
            <rect x="43" y="3" width="2" height="1" fill="#1e1035" />

            {/* Glowing Accent Dots */}
            <rect x="47" y="2" width="1" height="1" fill="#06b6d4" />
            <rect x="49" y="1" width="1" height="1" fill="#ec4899" />
            <rect x="51" y="3" width="1" height="1" fill="#22c55e" />
          </g>

          {/* Right Sign Icon: Pixel Space Invader Alien */}
          <g transform="translate(119, 3)" fill="#38bdf8">
            <rect x="1" y="0" width="1" height="1" />
            <rect x="5" y="0" width="1" height="1" />
            <rect x="2" y="1" width="3" height="1" />
            <rect x="1" y="2" width="5" height="2" />
            <rect x="2" y="3" width="1" height="1" fill="#1e1035" />
            <rect x="4" y="3" width="1" height="1" fill="#1e1035" />
            <rect x="0" y="4" width="1" height="2" />
            <rect x="6" y="4" width="1" height="2" />
            <rect x="2" y="5" width="1" height="1" />
            <rect x="4" y="5" width="1" height="1" />
          </g>

          {/* Wall Pixel Art Poster 1: Space Invader Alien Poster */}
          <g transform="translate(54, 16)">
            <rect x="0" y="0" width="18" height="16" fill="#1e1035" stroke="#3b82f6" strokeWidth="0.5" />
            <rect x="1" y="1" width="16" height="14" fill="#090514" />
            {/* 8-bit Invader in Cyan */}
            <rect x="5" y="3" width="8" height="2" fill="#22d3ee" />
            <rect x="3" y="5" width="12" height="5" fill="#22d3ee" />
            <rect x="5" y="6" width="2" height="2" fill="#090514" />
            <rect x="11" y="6" width="2" height="2" fill="#090514" />
            <rect x="2" y="10" width="3" height="3" fill="#22d3ee" />
            <rect x="13" y="10" width="3" height="3" fill="#22d3ee" />
            <rect x="4" y="12" width="3" height="2" fill="#22d3ee" />
            <rect x="11" y="12" width="3" height="2" fill="#22d3ee" />
          </g>

          {/* Wall Pixel Art Poster 2: High Score Leaderboard CRT Monitor (100% Pixel Art) */}
          <g transform="translate(88, 16)">
            <rect x="0" y="0" width="24" height="16" fill="#09090b" stroke="#a855f7" strokeWidth="0.6" />
            <rect x="1" y="1" width="22" height="14" fill="#1e1b4b" />
            {/* Top Pixel Trophy */}
            <rect x="10" y="2" width="4" height="3" fill="#facc15" />
            <rect x="9" y="2" width="1" height="2" fill="#ca8a04" />
            <rect x="14" y="2" width="1" height="2" fill="#ca8a04" />
            <rect x="11" y="5" width="2" height="1" fill="#ca8a04" />
            <rect x="10" y="6" width="4" height="1" fill="#facc15" />
            {/* Rank 1: Gold Bar + Pixel Frog Icon */}
            <rect x="3" y="8" width="18" height="2" fill="#facc15" />
            <rect x="3" y="8" width="2" height="2" fill="#16a34a" />
            <rect x="6" y="8.5" width="12" height="1" fill="#713f12" />
            {/* Rank 2: Cyan Bar */}
            <rect x="3" y="11" width="15" height="2" fill="#38bdf8" />
            <rect x="3" y="11" width="2" height="2" fill="#0369a1" />
            <rect x="6" y="11.5" width="10" height="1" fill="#0c4a6e" />
            {/* Rank 3: Magenta Bar */}
            <rect x="3" y="14" width="12" height="1.5" fill="#ec4899" />
          </g>

          {/* LEFT SIDE: CLASSIC CRT ARCADE CABINET (Space Frog Fighter) */}
          <g id="arcade-cabinet-left">
            {/* Cabinet Outer Frame (Stepped Pixel Rects) */}
            <rect x="4" y="20" width="28" height="44" fill="#2e1065" />
            <rect x="4" y="20" width="28" height="2" fill="#7e22ce" />
            <rect x="4" y="20" width="2" height="44" fill="#7e22ce" />
            <rect x="30" y="20" width="2" height="44" fill="#7e22ce" />
            {/* Side Cyan Bevel Accent (Stepped Pixels) */}
            <rect x="4" y="20" width="4" height="42" fill="#06b6d4" opacity="0.85" />

            {/* Cabinet Marquee Lightbox (Pixel Art Frog-X) */}
            <rect x="8" y="21" width="23" height="7" fill="#09090b" stroke="#ec4899" strokeWidth="0.5" />
            {/* Pixel Frog Face on Marquee */}
            <g transform="translate(10, 22)">
              <rect x="1" y="0" width="2" height="2" fill="#22c55e" />
              <rect x="5" y="0" width="2" height="2" fill="#22c55e" />
              <rect x="0" y="1" width="8" height="4" fill="#22c55e" />
              <rect x="1" y="2" width="1" height="1" fill="#ffffff" />
              <rect x="6" y="2" width="1" height="1" fill="#ffffff" />
              <rect x="2" y="4" width="4" height="1" fill="#15803d" />
            </g>
            {/* Pixel "FX" Logo */}
            <g transform="translate(20, 22)" fill="#facc15">
              <rect x="0" y="0" width="3" height="5" />
              <rect x="1" y="1" width="2" height="1" fill="#09090b" />
              <rect x="1" y="3" width="2" height="2" fill="#09090b" />
              <rect x="4" y="0" width="1" height="2" />
              <rect x="6" y="0" width="1" height="2" />
              <rect x="5" y="2" width="1" height="1" />
              <rect x="4" y="3" width="1" height="2" />
              <rect x="6" y="3" width="1" height="2" />
            </g>

            {/* Curved CRT Screen Bezel (Stepped Pixel Frame) */}
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
            {/* Joystick Stick & Red Pixel Ball */}
            <rect x="11" y="47.5" width="1" height="3" fill="#9ca3af" />
            <rect x="10" y="46" width="3" height="3" fill="#ef4444" />
            {/* 4 Colored Action Pixel Buttons */}
            <rect x="17" y="47.5" width="2" height="2" fill="#3b82f6" />
            <rect x="20" y="47" width="2" height="2" fill="#eab308" />
            <rect x="23" y="47.5" width="2" height="2" fill="#22c55e" />
            <rect x="20" y="50" width="2" height="2" fill="#ec4899" />

            {/* Lower Coin Door & 100-Yen Slots (Stepped Pixel Art) */}
            <rect x="10" y="54" width="18" height="9" fill="#09090b" stroke="#475569" strokeWidth="0.5" />
            <rect x="13" y="56" width="4" height="2" fill="#dc2626" />
            <rect x="14.5" y="56.5" width="1" height="1" fill="#09090b" />
            <rect x="20" y="56" width="4" height="2" fill="#dc2626" />
            <rect x="21.5" y="56.5" width="1" height="1" fill="#09090b" />
            {/* Coin Return Pocket in Pixel Art */}
            <rect x="15" y="59" width="8" height="3" fill="#18181b" />
            <rect x="17" y="60" width="4" height="1" fill="#475569" />
          </g>

          {/* RIGHT SIDE: JAPANESE NEON UFO CLAW CRANE MACHINE (100% PIXEL ART) */}
          <g id="arcade-claw-machine-right">
            {/* Crane Cabinet Frame */}
            <rect x="126" y="16" width="30" height="48" fill="#831843" stroke="#f43f5e" strokeWidth="0.8" />
            <rect x="127" y="17" width="28" height="7" fill="#09090b" stroke="#ec4899" strokeWidth="0.5" />

            {/* Pixel UFO Flying Saucer & "UFO" Marquee Letters */}
            <g transform="translate(131, 18)">
              {/* Pixel Saucer */}
              <rect x="2" y="0" width="4" height="1" fill="#38bdf8" />
              <rect x="1" y="1" width="6" height="2" fill="#e2e8f0" />
              <rect x="0" y="3" width="8" height="1" fill="#f43f5e" />
              <rect x="2" y="4" width="4" height="1" fill="#fef08a" opacity="0.6" />
              {/* Pixel "UFO" Letters */}
              <g transform="translate(10, 0)" fill="#f43f5e">
                {/* U */}
                <rect x="0" y="0" width="3" height="5" />
                <rect x="1" y="0" width="1" height="4" fill="#09090b" />
                {/* F */}
                <rect x="4" y="0" width="3" height="5" />
                <rect x="5" y="1" width="2" height="1" fill="#09090b" />
                <rect x="5" y="3" width="2" height="2" fill="#09090b" />
                {/* O */}
                <rect x="8" y="0" width="3" height="5" />
                <rect x="9" y="1" width="1" height="3" fill="#09090b" />
              </g>
            </g>

            {/* Clear Glass Prize Chamber */}
            <rect x="128" y="25" width="26" height="23" fill="#082f49" opacity="0.85" stroke="#38bdf8" strokeWidth="0.6" />
            <rect x="129" y="26" width="24" height="21" fill="#0369a1" opacity="0.25" />

            {/* Hanging Mechanical Crane Claw (Stepped Pixel Arm & 3-Prong Claw) */}
            <rect x="139" y="25" width="2" height="7" fill="#94a3b8" />
            <rect x="137" y="32" width="6" height="2" fill="#cbd5e1" />
            {/* Left Prong */}
            <rect x="136" y="34" width="1" height="2" fill="#e2e8f0" />
            <rect x="137" y="36" width="1" height="2" fill="#e2e8f0" />
            {/* Right Prong */}
            <rect x="143" y="34" width="1" height="2" fill="#e2e8f0" />
            <rect x="142" y="36" width="1" height="2" fill="#e2e8f0" />
            {/* Center Prong */}
            <rect x="139.5" y="34" width="1" height="3" fill="#cbd5e1" />

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
            <rect x="133" y="51" width="3" height="3" fill="#ef4444" />
            <rect x="142" y="50.5" width="4" height="3" fill="#22c55e" />
            <rect x="148" y="50.5" width="4" height="3" fill="#3b82f6" />

            {/* Prize Chute Flap at Bottom (Pixel Art) */}
            <rect x="132" y="56" width="18" height="7" fill="#09090b" stroke="#334155" strokeWidth="0.5" />
            <rect x="135" y="58" width="12" height="3" fill="#1e1035" />
            <rect x="139" y="59" width="4" height="1" fill="#facc15" />
          </g>

          {/* CHECKERED SYNTHWAVE DANCE & ARCADE FLOOR (Extended for Fullscreen) */}
          <rect x="0" y="60" width="160" height="220" fill="#0f0728" />

          {/* Isometric Perspective Checkerboard Grid (Crisp 1px Pixel Rects) */}
          <rect x="0" y="60" width="160" height="1" fill="#7e22ce" />
          <rect x="0" y="70" width="160" height="1" fill="#7e22ce" />
          <rect x="0" y="82" width="160" height="1" fill="#7e22ce" />
          <rect x="0" y="96" width="160" height="1" fill="#7e22ce" />
          <rect x="0" y="112" width="160" height="1" fill="#7e22ce" />
          <rect x="0" y="132" width="160" height="1" fill="#7e22ce" />
          <rect x="0" y="156" width="160" height="1" fill="#7e22ce" />
          <rect x="0" y="186" width="160" height="1" fill="#7e22ce" />
          <rect x="0" y="220" width="160" height="1" fill="#7e22ce" />

          {/* Checkerboard Pattern Tiles (Purple & Cyan Glow) */}
          <rect x="0" y="60" width="20" height="10" fill="#2e1065" opacity="0.6" />
          <rect x="40" y="60" width="20" height="10" fill="#2e1065" opacity="0.6" />
          <rect x="80" y="60" width="20" height="10" fill="#2e1065" opacity="0.6" />
          <rect x="120" y="60" width="20" height="10" fill="#2e1065" opacity="0.6" />

          <rect x="20" y="70" width="24" height="12" fill="#3b0764" opacity="0.7" />
          <rect x="68" y="70" width="24" height="12" fill="#3b0764" opacity="0.7" />
          <rect x="116" y="70" width="24" height="12" fill="#3b0764" opacity="0.7" />

          <rect x="0" y="82" width="30" height="14" fill="#2e1065" opacity="0.6" />
          <rect x="60" y="82" width="32" height="14" fill="#2e1065" opacity="0.6" />
          <rect x="124" y="82" width="36" height="14" fill="#2e1065" opacity="0.6" />

          <rect x="24" y="96" width="36" height="16" fill="#3b0764" opacity="0.7" />
          <rect x="92" y="96" width="36" height="16" fill="#3b0764" opacity="0.7" />

          <rect x="0" y="112" width="40" height="20" fill="#2e1065" opacity="0.6" />
          <rect x="80" y="112" width="40" height="20" fill="#2e1065" opacity="0.6" />

          <rect x="36" y="132" width="50" height="24" fill="#3b0764" opacity="0.7" />
          <rect x="126" y="132" width="34" height="24" fill="#3b0764" opacity="0.7" />

          {/* CENTER RHYTHM DANCE STAGE / FROG PLATFORM (DDR Style Stage) */}
          <g id="arcade-dance-stage">
            <rect x="48" y="62" width="48" height="18" fill="#18181b" stroke="#06b6d4" strokeWidth="0.8" />
            <rect x="50" y="64" width="44" height="14" fill="#09090b" />

            {/* 4 Illuminated Neon Arrow Pads (Pure Pixel Steps) */}
            {/* UP Arrow (Cyan) */}
            <rect x="68" y="65" width="8" height="4" fill="#06b6d4" stroke="#67e8f9" strokeWidth="0.4" />
            <rect x="71.5" y="66" width="1" height="1" fill="#ffffff" />
            <rect x="70.5" y="67" width="3" height="1" fill="#ffffff" />

            {/* DOWN Arrow (Magenta) */}
            <rect x="68" y="73" width="8" height="4" fill="#ec4899" stroke="#f472b6" strokeWidth="0.4" />
            <rect x="70.5" y="74" width="3" height="1" fill="#ffffff" />
            <rect x="71.5" y="75" width="1" height="1" fill="#ffffff" />

            {/* LEFT Arrow (Yellow) */}
            <rect x="52" y="69" width="8" height="4" fill="#eab308" stroke="#fef08a" strokeWidth="0.4" />
            <rect x="54" y="70.5" width="1" height="1" fill="#ffffff" />
            <rect x="55" y="69.5" width="1" height="3" fill="#ffffff" />

            {/* RIGHT Arrow (Lime Green) */}
            <rect x="84" y="69" width="8" height="4" fill="#22c55e" stroke="#86efac" strokeWidth="0.4" />
            <rect x="89" y="70.5" width="1" height="1" fill="#ffffff" />
            <rect x="88" y="69.5" width="1" height="3" fill="#ffffff" />

            {/* Center Dance Pad Hub */}
            <rect x="68" y="69.5" width="8" height="3" fill="#3f3f46" />
            <rect x="71" y="70" width="2" height="2" fill="#facc15" />
          </g>

          {/* Gacha Capsule Toy Dispenser on Right Floor Corner */}
          <g transform="translate(108, 54)">
            {/* Base Stand */}
            <rect x="2" y="14" width="12" height="14" fill="#ef4444" stroke="#991b1b" strokeWidth="0.5" />
            <rect x="5" y="20" width="6" height="4" fill="#09090b" />
            {/* Turn Crank Knob */}
            <rect x="6" y="15" width="4" height="4" fill="#e5e7eb" stroke="#4b5563" strokeWidth="0.4" />
            <rect x="7" y="16" width="2" height="2" fill="#ef4444" />
            {/* Clear Transparent Bubble Globe */}
            <rect x="1" y="2" width="14" height="12" fill="#38bdf8" opacity="0.5" stroke="#0284c7" strokeWidth="0.5" />
            {/* Colorful Capsules Inside (Pixel Blocks) */}
            <rect x="4" y="5" width="3" height="3" fill="#eab308" />
            <rect x="9" y="6" width="3" height="3" fill="#ec4899" />
            <rect x="5" y="10" width="3" height="3" fill="#22c55e" />
            <rect x="10" y="10" width="3" height="3" fill="#3b82f6" />
          </g>
        </g>
      )}

      {/* L. 24H NEON KONBINI CONVENIENCE STORE (100% PURE PIXEL ART) */}
      {config.sceneId === 'convenience_store' && (
        <g id="scene-convenience-store">
          {/* Top Neon Storefront Fascia Canopy (Extended for fullscreen) */}
          <rect x="0" y="-80" width="160" height="94" fill="#18181b" />
          <rect x="0" y="2" width="160" height="3" fill="#10b981" />
          <rect x="0" y="5" width="160" height="2" fill="#ffffff" />
          <rect x="0" y="7" width="160" height="3" fill="#ea580c" />
          <rect x="0" y="10" width="160" height="2" fill="#0284c7" />

          {/* Glowing 24h Digital LED Sign (Pure Pixel Art) */}
          <rect x="56" y="1" width="48" height="11" fill="#09090b" stroke="#27272a" strokeWidth="0.5" />
          {/* Pixel '24h MART' */}
          <g transform="translate(60, 3)" fill="#10b981">
            {/* '2' */}
            <rect x="0" y="0" width="4" height="1" />
            <rect x="3" y="0" width="1" height="3" />
            <rect x="0" y="3" width="4" height="1" />
            <rect x="0" y="3" width="1" height="3" />
            <rect x="0" y="6" width="4" height="1" />
            {/* '4' */}
            <rect x="6" y="0" width="1" height="4" />
            <rect x="6" y="3" width="4" height="1" />
            <rect x="9" y="0" width="1" height="7" />
            {/* 'h' */}
            <rect x="12" y="0" width="1" height="7" />
            <rect x="12" y="3" width="3" height="1" />
            <rect x="14" y="4" width="1" height="3" />
            {/* Dot indicator */}
            <rect x="17" y="5" width="1" height="1" fill="#ef4444" className="animate-pulse" />
            {/* 'M' */}
            <rect x="20" y="1" width="1" height="6" fill="#ffffff" />
            <rect x="21" y="2" width="1" height="2" fill="#ffffff" />
            <rect x="22" y="1" width="1" height="6" fill="#ffffff" />
            {/* 'A' */}
            <rect x="24" y="1" width="3" height="6" fill="#ffffff" />
            <rect x="25" y="2" width="1" height="1" fill="#09090b" />
            <rect x="25" y="4" width="1" height="3" fill="#09090b" />
            {/* 'R' */}
            <rect x="28" y="1" width="3" height="6" fill="#ffffff" />
            <rect x="29" y="2" width="1" height="1" fill="#09090b" />
            <rect x="29" y="4" width="1" height="1" fill="#09090b" />
            {/* 'T' */}
            <rect x="32" y="1" width="3" height="1" fill="#ffffff" />
            <rect x="33" y="2" width="1" height="5" fill="#ffffff" />
            {/* Right Green Status LED */}
            <rect x="37" y="3" width="2" height="2" fill="#22c55e" />
          </g>

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

          {/* Cooler Digital Temp & Glass Glare (Pixel 7-Segment LED) */}
          <rect x="34" y="19" width="14" height="3.5" fill="#09090b" />
          <g transform="translate(36, 20)" fill="#38bdf8">
            {/* 3 */}
            <rect x="0" y="0" width="2" height="0.5" />
            <rect x="1.5" y="0" width="0.5" height="1.5" />
            <rect x="0" y="0.8" width="2" height="0.4" />
            <rect x="1.5" y="1" width="0.5" height="1" />
            <rect x="0" y="1.5" width="2" height="0.5" />
            {/* . */}
            <rect x="2.5" y="1.5" width="0.5" height="0.5" />
            {/* 2 */}
            <rect x="3.5" y="0" width="2" height="0.5" />
            <rect x="5" y="0" width="0.5" height="1" />
            <rect x="3.5" y="0.8" width="2" height="0.4" />
            <rect x="3.5" y="1" width="0.5" height="1" />
            <rect x="3.5" y="1.5" width="2" height="0.5" />
            {/* °C */}
            <rect x="6.5" y="0" width="0.6" height="0.6" />
            <rect x="7.5" y="0" width="1.5" height="2" />
            <rect x="8" y="0.5" width="1" height="1" fill="#09090b" />
          </g>
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
          {/* Pixel "HOT" Badge */}
          <g transform="translate(133, 46)" fill="#dc2626">
            <rect x="0" y="0" width="10" height="4" fill="#fee2e2" stroke="#dc2626" strokeWidth="0.3" />
            <rect x="1" y="1" width="1" height="2" />
            <rect x="2" y="1.5" width="1" height="1" />
            <rect x="3" y="1" width="1" height="2" />
            <rect x="5" y="1" width="2" height="2" />
            <rect x="5.5" y="1.5" width="1" height="1" fill="#fee2e2" />
            <rect x="8" y="1" width="2" height="0.5" />
            <rect x="8.5" y="1.5" width="1" height="1.5" />
          </g>

          {/* 3D Checkered Convenience Store Tiled Floor (Extended for fullscreen) */}
          <rect x="0" y="60" width="160" height="220" fill="#f8fafc" />
          {/* Floor Tile Grid Lines */}
          <rect x="0" y="60" width="160" height="1" fill="#cbd5e1" />
          <rect x="0" y="72" width="160" height="1" fill="#cbd5e1" />
          <rect x="0" y="88" width="160" height="1" fill="#cbd5e1" />
          <rect x="0" y="108" width="160" height="1" fill="#cbd5e1" />
          <rect x="0" y="132" width="160" height="1" fill="#cbd5e1" />
          <rect x="0" y="160" width="160" height="1" fill="#cbd5e1" />
          <rect x="0" y="200" width="160" height="1" fill="#cbd5e1" />

          {/* Alternating Soft Pastel Checker Accents */}
          <rect x="45" y="60" width="32" height="12" fill="#ecfdf5" opacity="0.7" />
          <rect x="112" y="60" width="32" height="12" fill="#ecfdf5" opacity="0.7" />
          <rect x="8" y="72" width="36" height="16" fill="#eff6ff" opacity="0.7" />
          <rect x="78" y="72" width="38" height="16" fill="#eff6ff" opacity="0.7" />
          <rect x="32" y="88" width="48" height="20" fill="#ecfdf5" opacity="0.7" />
          <rect x="120" y="88" width="40" height="20" fill="#ecfdf5" opacity="0.7" />
          <rect x="0" y="108" width="50" height="24" fill="#eff6ff" opacity="0.7" />
          <rect x="90" y="108" width="50" height="24" fill="#eff6ff" opacity="0.7" />

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
            {/* Glowing Screen Display (Pixel Art ¥850 Display) */}
            <rect x="94" y="50" width="10" height="6" fill="#0284c7" />
            <g transform="translate(95, 51.5)" fill="#ffffff">
              {/* '¥' */}
              <rect x="0" y="0" width="1" height="1" />
              <rect x="2" y="0" width="1" height="1" />
              <rect x="1" y="1" width="1" height="2" />
              <rect x="0" y="2" width="3" height="0.5" />
              {/* '8' */}
              <rect x="3.5" y="0" width="1.5" height="3" />
              <rect x="4" y="0.8" width="0.5" height="0.5" fill="#0284c7" />
              <rect x="4" y="1.7" width="0.5" height="0.5" fill="#0284c7" />
              {/* '5' */}
              <rect x="5.5" y="0" width="1.5" height="0.5" />
              <rect x="5.5" y="0" width="0.5" height="1.5" />
              <rect x="5.5" y="1.2" width="1.5" height="0.5" />
              <rect x="6.5" y="1.5" width="0.5" height="1.5" />
              <rect x="5.5" y="2.5" width="1.5" height="0.5" />
              {/* '0' */}
              <rect x="7.5" y="0" width="1.5" height="3" />
              <rect x="8" y="0.8" width="0.5" height="1.4" fill="#0284c7" />
            </g>
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

      {/* M. WILDERNESS FOREST CAMPGROUND SCENE (100% PURE 8-BIT/16-BIT CRISP PIXEL ART) */}
      {config.sceneId === 'forest_camp' && (
        <g id="scene-wilderness-camp">
          {/* Deep Twilight Evening Sky with Stepped Gradient Bands */}
          <rect x="0" y="0" width="160" height="18" fill="#09111e" />
          <rect x="0" y="18" width="160" height="18" fill="#0f1f33" />
          <rect x="0" y="36" width="160" height="14" fill="#162e4a" />
          <rect x="0" y="50" width="160" height="10" fill="#1c3e60" />

          {/* Stepped Pixel Stars in Sky */}
          <rect x="12" y="6" width="2" height="2" fill="#fef08a" opacity={animTick % 2 === 0 ? 0.9 : 0.4} />
          <rect x="38" y="10" width="1" height="1" fill="#ffffff" opacity={animTick % 3 === 0 ? 0.8 : 0.3} />
          {/* 4-pointed Cross Star */}
          <g transform="translate(68, 6)" opacity={animTick % 2 === 1 ? 0.95 : 0.5}>
            <rect x="1" y="0" width="1" height="3" fill="#fde047" />
            <rect x="0" y="1" width="3" height="1" fill="#fde047" />
          </g>
          <rect x="96" y="8" width="2" height="2" fill="#ffffff" opacity={animTick % 4 === 0 ? 0.9 : 0.4} />
          <rect x="118" y="12" width="1" height="1" fill="#fef08a" opacity={animTick % 2 === 0 ? 0.85 : 0.4} />
          <g transform="translate(150, 10)" opacity={animTick % 3 === 1 ? 0.9 : 0.4}>
            <rect x="1" y="0" width="1" height="3" fill="#ffffff" />
            <rect x="0" y="1" width="3" height="1" fill="#ffffff" />
          </g>

          {/* Stepped 8-Bit Pixel Crescent Moon */}
          <g id="pixel-crescent-moon" transform="translate(132, 5)">
            <rect x="5" y="0" width="5" height="2" fill="#fef08a" />
            <rect x="3" y="2" width="7" height="2" fill="#fef08a" />
            <rect x="2" y="4" width="7" height="6" fill="#fef08a" />
            <rect x="3" y="10" width="7" height="2" fill="#fef08a" />
            <rect x="5" y="12" width="5" height="2" fill="#fef08a" />
            {/* Cutout using sky color to form clean pixel crescent */}
            <rect x="7" y="2" width="4" height="2" fill="#09111e" />
            <rect x="5" y="4" width="5" height="6" fill="#09111e" />
            <rect x="7" y="10" width="4" height="2" fill="#09111e" />
            {/* Pixel Highlight & Glow */}
            <rect x="4" y="1" width="3" height="1" fill="#ffffff" />
            <rect x="2" y="5" width="1" height="4" fill="#ffffff" />
          </g>

          {/* Far Mountain Ridge (Stepped Pixel Silhouettes) */}
          {/* Mountain 1 (Left Ridge) */}
          <rect x="0" y="46" width="16" height="14" fill="#071b1e" />
          <rect x="4" y="42" width="16" height="18" fill="#071b1e" />
          <rect x="8" y="38" width="14" height="22" fill="#071b1e" />
          <rect x="12" y="34" width="10" height="26" fill="#071b1e" />
          <rect x="15" y="31" width="4" height="29" fill="#071b1e" />
          <rect x="15" y="31" width="4" height="2" fill="#1b4540" />

          {/* Mountain 2 (Center-Left) */}
          <rect x="28" y="44" width="32" height="16" fill="#0c2925" />
          <rect x="36" y="40" width="22" height="20" fill="#0c2925" />
          <rect x="44" y="36" width="12" height="24" fill="#0c2925" />
          <rect x="48" y="33" width="5" height="27" fill="#0c2925" />
          <rect x="48" y="33" width="5" height="2" fill="#2a6358" />

          {/* Mountain 3 (Center-Right Tall Peak) */}
          <rect x="68" y="46" width="44" height="14" fill="#071b1e" />
          <rect x="76" y="40" width="32" height="20" fill="#071b1e" />
          <rect x="84" y="34" width="20" height="26" fill="#071b1e" />
          <rect x="90" y="28" width="10" height="32" fill="#071b1e" />
          <rect x="93" y="25" width="4" height="35" fill="#071b1e" />
          <rect x="93" y="25" width="4" height="2" fill="#22534a" />

          {/* Mountain 4 (Right Peak) */}
          <rect x="120" y="42" width="40" height="18" fill="#0c2925" />
          <rect x="130" y="36" width="26" height="24" fill="#0c2925" />
          <rect x="140" y="30" width="16" height="30" fill="#0c2925" />
          <rect x="146" y="26" width="6" height="34" fill="#0c2925" />
          <rect x="146" y="26" width="6" height="2" fill="#2a6358" />

          {/* Midground Stepped Pine Trees (Left Group) */}
          <g id="pixel-pine-trees-left">
            {/* Tree 2 (Deep Background Left) */}
            <rect x="22" y="36" width="4" height="24" fill="#291204" />
            <rect x="22" y="16" width="4" height="4" fill="#0e3f22" />
            <rect x="19" y="20" width="10" height="4" fill="#0e3f22" />
            <rect x="16" y="24" width="16" height="4" fill="#0e3f22" />
            <rect x="14" y="28" width="20" height="5" fill="#0e3f22" />
            <rect x="11" y="33" width="26" height="6" fill="#0e3f22" />

            {/* Tree 1 (Foreground Tall Pine Tree) */}
            {/* Trunk */}
            <rect x="8" y="32" width="5" height="28" fill="#451a03" />
            <rect x="9" y="34" width="2" height="24" fill="#78350f" />
            {/* Stepped Tier 1 (Top) */}
            <rect x="9" y="10" width="3" height="3" fill="#22c55e" />
            <rect x="8" y="13" width="5" height="3" fill="#16a34a" />
            <rect x="6" y="16" width="9" height="4" fill="#15803d" />
            <rect x="4" y="19" width="13" height="3" fill="#14532d" />
            {/* Stepped Tier 2 */}
            <rect x="8" y="21" width="5" height="2" fill="#16a34a" />
            <rect x="5" y="23" width="11" height="4" fill="#15803d" />
            <rect x="2" y="27" width="17" height="4" fill="#14532d" />
            <rect x="0" y="30" width="21" height="3" fill="#052e16" />
            {/* Stepped Tier 3 */}
            <rect x="6" y="32" width="9" height="2" fill="#15803d" />
            <rect x="3" y="34" width="15" height="4" fill="#14532d" />
            <rect x="-1" y="38" width="23" height="5" fill="#052e16" />
          </g>

          {/* Midground Stepped Pine Trees (Right Group) */}
          <g id="pixel-pine-trees-right">
            {/* Tree 2 (Deep Background Right) */}
            <rect x="126" y="36" width="4" height="24" fill="#291204" />
            <rect x="126" y="18" width="4" height="4" fill="#0e3f22" />
            <rect x="123" y="22" width="10" height="4" fill="#0e3f22" />
            <rect x="120" y="26" width="16" height="4" fill="#0e3f22" />
            <rect x="117" y="30" width="22" height="5" fill="#0e3f22" />
            <rect x="114" y="35" width="28" height="6" fill="#0e3f22" />

            {/* Tree 1 (Foreground Tall Pine Tree Right) */}
            {/* Trunk */}
            <rect x="144" y="30" width="5" height="30" fill="#451a03" />
            <rect x="145" y="32" width="2" height="26" fill="#78350f" />
            {/* Stepped Tier 1 (Top) */}
            <rect x="145" y="8" width="3" height="3" fill="#22c55e" />
            <rect x="144" y="11" width="5" height="3" fill="#16a34a" />
            <rect x="142" y="14" width="9" height="4" fill="#15803d" />
            <rect x="140" y="17" width="13" height="3" fill="#14532d" />
            {/* Stepped Tier 2 */}
            <rect x="144" y="19" width="5" height="2" fill="#16a34a" />
            <rect x="141" y="21" width="11" height="4" fill="#15803d" />
            <rect x="138" y="25" width="17" height="4" fill="#14532d" />
            <rect x="136" y="28" width="21" height="3" fill="#052e16" />
            {/* Stepped Tier 3 */}
            <rect x="142" y="30" width="9" height="2" fill="#15803d" />
            <rect x="139" y="32" width="15" height="4" fill="#14532d" />
            <rect x="135" y="36" width="23" height="5" fill="#052e16" />
          </g>

          {/* Stepped Pixel String Lights & Festive Bunting Flags */}
          <g id="pixel-camp-string-lights">
            {/* Stepped Brown Wire Rope */}
            <rect x="18" y="25" width="6" height="1" fill="#78350f" />
            <rect x="24" y="26" width="8" height="1" fill="#78350f" />
            <rect x="32" y="27" width="10" height="1" fill="#78350f" />
            <rect x="42" y="28" width="12" height="1" fill="#78350f" />
            <rect x="54" y="29" width="16" height="1" fill="#78350f" />
            <rect x="70" y="30" width="20" height="1" fill="#78350f" />
            <rect x="90" y="29" width="16" height="1" fill="#78350f" />
            <rect x="106" y="28" width="12" height="1" fill="#78350f" />
            <rect x="118" y="27" width="10" height="1" fill="#78350f" />
            <rect x="128" y="26" width="8" height="1" fill="#78350f" />
            <rect x="136" y="25" width="4" height="1" fill="#78350f" />

            {/* Pixel Lantern 1 (Warm Glow at x=32) */}
            <rect x="31" y="28" width="4" height="4" fill="#fef08a" />
            <rect x="32" y="29" width="2" height="2" fill="#ffffff" />
            <rect x="30" y="27" width="6" height="6" fill="#facc15" opacity="0.25" />

            {/* Pixel Red Bunting Flag (x=46) */}
            <rect x="45" y="29" width="5" height="1" fill="#ef4444" />
            <rect x="46" y="30" width="3" height="2" fill="#ef4444" />
            <rect x="47" y="32" width="1" height="2" fill="#ef4444" />

            {/* Pixel Lantern 2 (Warm Glow at x=62) */}
            <rect x="61" y="30" width="4" height="4" fill="#fde047" />
            <rect x="62" y="31" width="2" height="2" fill="#ffffff" />
            <rect x="60" y="29" width="6" height="6" fill="#f59e0b" opacity="0.25" />

            {/* Pixel Blue Bunting Flag (x=77) */}
            <rect x="76" y="31" width="5" height="1" fill="#3b82f6" />
            <rect x="77" y="32" width="3" height="2" fill="#3b82f6" />
            <rect x="78" y="34" width="1" height="2" fill="#3b82f6" />

            {/* Pixel Lantern 3 (Warm Glow at x=94) */}
            <rect x="93" y="30" width="4" height="4" fill="#fef08a" />
            <rect x="94" y="31" width="2" height="2" fill="#ffffff" />
            <rect x="92" y="29" width="6" height="6" fill="#facc15" opacity="0.25" />

            {/* Pixel Green Bunting Flag (x=109) */}
            <rect x="108" y="29" width="5" height="1" fill="#10b981" />
            <rect x="109" y="30" width="3" height="2" fill="#10b981" />
            <rect x="110" y="32" width="1" height="2" fill="#10b981" />

            {/* Pixel Lantern 4 (Warm Glow at x=124) */}
            <rect x="123" y="28" width="4" height="4" fill="#fde047" />
            <rect x="124" y="29" width="2" height="2" fill="#ffffff" />
            <rect x="122" y="27" width="6" height="6" fill="#f59e0b" opacity="0.25" />
          </g>

          {/* LEFT SIDE: 8-BIT COZY A-FRAME CANVAS TENT */}
          <g id="pixel-camp-tent" transform="translate(6, 28)">
            {/* Stepped Pixel Ground Shadow */}
            <rect x="0" y="32" width="46" height="3" fill="#091b10" opacity="0.6" />
            <rect x="4" y="31" width="38" height="5" fill="#091b10" opacity="0.5" />

            {/* Tent Ridge Pole & Support Stakes */}
            <rect x="21" y="2" width="2" height="32" fill="#451a03" />
            <rect x="20" y="0" width="4" height="2" fill="#78350f" />

            {/* Outer Stepped Ochre/Khaki Canvas Roof */}
            <rect x="20" y="4" width="4" height="2" fill="#78350f" />
            <rect x="18" y="6" width="8" height="2" fill="#a16207" />
            <rect x="16" y="8" width="12" height="2" fill="#ca8a04" />
            <rect x="14" y="10" width="16" height="2" fill="#ca8a04" />
            <rect x="12" y="12" width="20" height="2" fill="#ca8a04" />
            <rect x="10" y="14" width="24" height="2" fill="#ca8a04" />
            <rect x="8" y="16" width="28" height="2" fill="#ca8a04" />
            <rect x="6" y="18" width="32" height="2" fill="#ca8a04" />
            <rect x="4" y="20" width="36" height="2" fill="#ca8a04" />
            <rect x="2" y="22" width="40" height="2" fill="#ca8a04" />
            <rect x="0" y="24" width="44" height="8" fill="#a16207" />
            <rect x="0" y="31" width="44" height="2" fill="#78350f" />

            {/* Roof Highlight Line on Left Edge */}
            <rect x="19" y="5" width="2" height="2" fill="#eab308" />
            <rect x="17" y="7" width="2" height="2" fill="#eab308" />
            <rect x="15" y="9" width="2" height="2" fill="#eab308" />
            <rect x="13" y="11" width="2" height="2" fill="#eab308" />
            <rect x="11" y="13" width="2" height="2" fill="#eab308" />
            <rect x="9" y="15" width="2" height="2" fill="#eab308" />
            <rect x="7" y="17" width="2" height="2" fill="#eab308" />
            <rect x="5" y="19" width="2" height="2" fill="#eab308" />
            <rect x="3" y="21" width="2" height="2" fill="#eab308" />
            <rect x="1" y="23" width="2" height="8" fill="#eab308" />

            {/* Front Stepped Triangle Opening (Glowing Warm Amber Interior) */}
            <rect x="20" y="8" width="4" height="2" fill="#f59e0b" />
            <rect x="18" y="10" width="8" height="2" fill="#f59e0b" />
            <rect x="16" y="12" width="12" height="2" fill="#f59e0b" />
            <rect x="14" y="14" width="16" height="2" fill="#facc15" />
            <rect x="12" y="16" width="20" height="2" fill="#facc15" />
            <rect x="10" y="18" width="24" height="2" fill="#fef08a" />
            <rect x="8" y="20" width="28" height="2" fill="#fef08a" />
            <rect x="7" y="22" width="30" height="10" fill="#fef3c7" />

            {/* Rolled Canvas Flaps with Dark Stitching */}
            <rect x="8" y="18" width="4" height="14" fill="#854d0e" />
            <rect x="7" y="20" width="2" height="12" fill="#713f12" />
            <rect x="32" y="18" width="4" height="14" fill="#854d0e" />
            <rect x="35" y="20" width="2" height="12" fill="#713f12" />

            {/* Blue Sleeping Pad Roll Inside */}
            <rect x="17" y="26" width="10" height="5" fill="#0284c7" />
            <rect x="18" y="27" width="8" height="3" fill="#38bdf8" />

            {/* Hanging Pixel Lantern in Tent */}
            <rect x="21" y="12" width="2" height="3" fill="#451a03" />
            <rect x="20" y="15" width="4" height="4" fill="#fef08a" />
            <rect x="21" y="16" width="2" height="2" fill="#f97316" />

            {/* Stepped Guy-lines & Ground Pegs */}
            <rect x="-2" y="32" width="2" height="2" fill="#cbd5e1" />
            <rect x="44" y="32" width="2" height="2" fill="#cbd5e1" />
          </g>

          {/* MOSSY WILDERNESS FOREST GROUND FLOOR (Stepped Pixel Earth) */}
          <rect x="0" y="58" width="160" height="4" fill="#14532d" />
          <rect x="0" y="62" width="160" height="8" fill="#15803d" />
          <rect x="0" y="70" width="160" height="12" fill="#166534" />
          <rect x="0" y="82" width="160" height="18" fill="#143e24" />

          {/* Stepped Pixel Grass Tufts & Highlights */}
          <rect x="8" y="60" width="6" height="2" fill="#4ade80" />
          <rect x="10" y="58" width="2" height="2" fill="#4ade80" />
          <rect x="26" y="68" width="8" height="2" fill="#22c55e" />
          <rect x="52" y="62" width="8" height="2" fill="#4ade80" />
          <rect x="54" y="60" width="4" height="2" fill="#4ade80" />
          <rect x="96" y="64" width="10" height="2" fill="#22c55e" />
          <rect x="136" y="62" width="8" height="2" fill="#4ade80" />
          <rect x="116" y="76" width="8" height="2" fill="#22c55e" />
          <rect x="144" y="72" width="6" height="2" fill="#4ade80" />

          {/* 8-Bit Pixel Wild Mushrooms */}
          {/* Red Toadstool 1 (Left) */}
          <rect x="50" y="66" width="6" height="4" fill="#ef4444" />
          <rect x="51" y="65" width="4" height="1" fill="#ef4444" />
          <rect x="51" y="66" width="1" height="1" fill="#ffffff" />
          <rect x="54" y="67" width="1" height="1" fill="#ffffff" />
          <rect x="52" y="70" width="2" height="3" fill="#fef3c7" />

          {/* Golden Mushroom 2 (Right) */}
          <rect x="142" y="70" width="5" height="3" fill="#f59e0b" />
          <rect x="143" y="69" width="3" height="1" fill="#f59e0b" />
          <rect x="144" y="73" width="1" height="3" fill="#fef3c7" />

          {/* RIGHT SIDE: 8-BIT CRACKLING BONFIRE / CAMPFIRE WITH PIXEL RIVER STONES */}
          <g id="pixel-camp-bonfire" transform="translate(108, 48)">
            {/* Stepped Pixel Amber Ground Glow */}
            <rect x="-4" y="20" width="36" height="4" fill="#f59e0b" opacity="0.25" />
            <rect x="0" y="18" width="28" height="8" fill="#f59e0b" opacity="0.2" />
            <rect x="4" y="16" width="20" height="12" fill="#fde047" opacity="0.15" />

            {/* Stepped Pixel River Stone Fire Ring */}
            <rect x="0" y="20" width="5" height="4" fill="#64748b" />
            <rect x="1" y="21" width="3" height="2" fill="#94a3b8" />
            <rect x="5" y="22" width="6" height="4" fill="#475569" />
            <rect x="12" y="23" width="6" height="4" fill="#64748b" />
            <rect x="13" y="24" width="4" height="2" fill="#94a3b8" />
            <rect x="19" y="22" width="6" height="4" fill="#475569" />
            <rect x="25" y="20" width="5" height="4" fill="#64748b" />
            <rect x="22" y="17" width="5" height="4" fill="#334155" />
            <rect x="1" y="17" width="5" height="4" fill="#334155" />

            {/* Crossed Stepped Firewood Logs */}
            <rect x="3" y="20" width="22" height="3" fill="#451a03" />
            <rect x="4" y="21" width="20" height="1" fill="#78350f" />
            <rect x="6" y="17" width="16" height="3" fill="#78350f" />
            <rect x="8" y="18" width="12" height="1" fill="#92400e" />

            {/* Glowing Red-Hot Charcoal Embers */}
            <rect x="8" y="18" width="12" height="4" fill="#dc2626" />
            <rect x="10" y="17" width="8" height="3" fill="#ea580c" />
            <rect x="12" y="18" width="4" height="2" fill="#facc15" />

            {/* Animated Stepped 8-Bit Pixel Flames */}
            {animTick % 2 === 0 ? (
              <g id="pixel-flame-frame-a">
                {/* Outer Orange Flame */}
                <rect x="12" y="2" width="4" height="4" fill="#f97316" />
                <rect x="10" y="6" width="8" height="4" fill="#f97316" />
                <rect x="8" y="10" width="12" height="4" fill="#f97316" />
                <rect x="6" y="14" width="16" height="4" fill="#f97316" />
                {/* Mid Yellow Flame */}
                <rect x="13" y="6" width="2" height="3" fill="#facc15" />
                <rect x="11" y="9" width="6" height="4" fill="#facc15" />
                <rect x="9" y="13" width="10" height="4" fill="#facc15" />
                {/* Inner Bright Core */}
                <rect x="12" y="12" width="4" height="4" fill="#ffffff" />
                {/* Rising Sparks */}
                <rect x="11" y="0" width="2" height="2" fill="#fde047" />
                <rect x="16" y="3" width="1" height="1" fill="#ef4444" />
                <rect x="7" y="5" width="1" height="1" fill="#f59e0b" />
              </g>
            ) : (
              <g id="pixel-flame-frame-b">
                {/* Outer Orange Flame Shifted */}
                <rect x="13" y="0" width="3" height="4" fill="#f97316" />
                <rect x="11" y="4" width="7" height="4" fill="#f97316" />
                <rect x="9" y="8" width="11" height="4" fill="#f97316" />
                <rect x="7" y="12" width="15" height="5" fill="#f97316" />
                {/* Mid Yellow Flame */}
                <rect x="13" y="4" width="3" height="3" fill="#facc15" />
                <rect x="11" y="7" width="7" height="4" fill="#facc15" />
                <rect x="10" y="11" width="9" height="5" fill="#facc15" />
                {/* Inner Bright Core */}
                <rect x="12" y="10" width="4" height="5" fill="#ffffff" />
                {/* Rising Sparks */}
                <rect x="15" y="-2" width="2" height="2" fill="#fde047" />
                <rect x="9" y="2" width="1" height="1" fill="#f97316" />
                <rect x="18" y="5" width="1" height="1" fill="#fde047" />
              </g>
            )}
          </g>

          {/* RUSTIC WOOD PICNIC TABLE & LOG STOOLS (Center-Left Staging Area) */}
          <g id="pixel-camp-picnic-table" transform="translate(62, 54)">
            {/* Stepped Pixel Table Shadow */}
            <rect x="-2" y="18" width="40" height="3" fill="#091b10" opacity="0.6" />
            <rect x="2" y="17" width="32" height="5" fill="#091b10" opacity="0.5" />

            {/* Wooden Log Table Legs */}
            <rect x="4" y="8" width="4" height="10" fill="#451a03" />
            <rect x="5" y="8" width="2" height="9" fill="#78350f" />
            <rect x="28" y="8" width="4" height="10" fill="#451a03" />
            <rect x="29" y="8" width="2" height="9" fill="#78350f" />

            {/* Stepped Log Tabletop Plank */}
            <rect x="0" y="4" width="36" height="5" fill="#78350f" />
            <rect x="1" y="5" width="34" height="2" fill="#92400e" />
            <rect x="2" y="5" width="32" height="1" fill="#b45309" />
            <rect x="0" y="8" width="36" height="1" fill="#451a03" />

            {/* Vintage Camp Drip Coffee Kettle on Table */}
            <rect x="6" y="-1" width="8" height="6" fill="#0284c7" />
            <rect x="7" y="0" width="6" height="4" fill="#38bdf8" />
            <rect x="8" y="-3" width="4" height="2" fill="#0369a1" />
            <rect x="14" y="1" width="2" height="2" fill="#0369a1" />
            {/* Pixel Steam Puff */}
            <rect x="15" y={animTick % 2 === 0 ? -4 : -3} width="2" height="2" fill="#ffffff" opacity="0.7" />

            {/* Speckled Enamel Tin Mug */}
            <rect x="22" y="0" width="5" height="5" fill="#dc2626" />
            <rect x="23" y="1" width="3" height="3" fill="#ef4444" />
            <rect x="27" y="1" width="1" height="3" fill="#991b1b" />
            <rect x="23" y="0" width="3" height="1" fill="#451a03" />

            {/* Left Tree Stump Stool */}
            <rect x="-10" y="10" width="10" height="9" fill="#78350f" />
            <rect x="-9" y="11" width="8" height="7" fill="#92400e" />
            <rect x="-10" y="9" width="10" height="2" fill="#b45309" />
            <rect x="-8" y="9" width="6" height="1" fill="#fde68a" />

            {/* Right Tree Stump Stool */}
            <rect x="36" y="10" width="10" height="9" fill="#78350f" />
            <rect x="37" y="11" width="8" height="7" fill="#92400e" />
            <rect x="36" y="9" width="10" height="2" fill="#b45309" />
            <rect x="38" y="9" width="6" height="1" fill="#fde68a" />
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
                  {/* Glistening Slime Trail with Sparkles */}
                  <rect x="-14" y="78" width="14" height="2" fill="#FEF08A" opacity={0.6} />
                  <rect x="-8" y="77" width="4" height="1" fill="#FFFFFF" opacity={0.8} />
                  {animTick % 2 === 0 && <rect x="-6" y="76" width="2" height="2" fill="#FACC15" />}
                  {/* Snail Body & Translucent Foot */}
                  <rect x="0" y="74" width="26" height="6" fill="#EADBC8" />
                  <rect x="1" y="73" width="24" height="2" fill="#F7EFE5" />
                  <rect x="2" y="79" width="22" height="1" fill="#CBB69D" />
                  <rect x="18" y="64" width="8" height="12" fill="#EADBC8" />
                  <rect x="19" y="64" width="6" height="5" fill="#F7EFE5" />
                  {/* Cute Snail Blush & Smile */}
                  <rect x="22" y="70" width="3" height="1" fill="#A37081" />
                  <rect x="19" y="69" width="3" height="2" fill="#FDA4AF" opacity="0.8" />
                  {/* Eyestalks with Specular Glints */}
                  <rect x="19" y={eyeStalkY} width="2" height="11" fill="#8C7A6B" />
                  <rect x="24" y={eyeStalkY + (animTick % 2 === 0 ? 0 : 2)} width="2" height="11" fill="#8C7A6B" />
                  <rect x="18" y={eyeStalkY - 2} width="4" height="3" fill="#18181B" />
                  <rect x="23" y={eyeStalkY + (animTick % 2 === 0 ? -2 : 0)} width="4" height="3" fill="#18181B" />
                  <rect x="19" y={eyeStalkY - 2} width="1" height="1" fill="#FFFFFF" />
                  <rect x="24" y={eyeStalkY + (animTick % 2 === 0 ? -2 : 0)} width="1" height="1" fill="#FFFFFF" />
                  {/* 5-Tone Stardew Valley Spiral Shell */}
                  <rect x="1" y={57 + (animTick % 2 === 0 ? 0 : 1)} width="20" height="20" fill="#8B4513" />
                  <rect x="3" y={55 + (animTick % 2 === 0 ? 0 : 1)} width="16" height="24" fill="#8B4513" />
                  <rect x="2" y={58 + (animTick % 2 === 0 ? 0 : 1)} width="18" height="18" fill="#D97706" />
                  <rect x="4" y={56 + (animTick % 2 === 0 ? 0 : 1)} width="14" height="22" fill="#D97706" />
                  <rect x="4" y={57 + (animTick % 2 === 0 ? 0 : 1)} width="14" height="4" fill="#FDE68A" />
                  <rect x="5" y={60 + (animTick % 2 === 0 ? 0 : 1)} width="12" height="12" fill="#B45309" />
                  <rect x="6" y={61 + (animTick % 2 === 0 ? 0 : 1)} width="10" height="10" fill="#F59E0B" />
                  <rect x="7" y={63 + (animTick % 2 === 0 ? 0 : 1)} width="6" height="6" fill="#78350F" />
                  <rect x="8" y={64 + (animTick % 2 === 0 ? 0 : 1)} width="4" height="4" fill="#FEF3C7" />
                  {/* Heart emote */}
                  {animTick % 4 === 0 && (
                    <g transform="translate(20, 46)">
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
                  {/* Neon Glow Pixel Shadow underneath */}
                  <rect x="3" y="24" width="16" height="2" fill="#EC4899" opacity="0.25" />
                  <rect x="6" y="23" width="10" height="4" fill="#EC4899" opacity="0.3" />

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
                  {/* Pedestal Stand / Stepped Glow Shadow */}
                  <rect x="4" y="24" width="16" height="2" fill="#000000" opacity="0.25" />
                  <rect x="7" y="23" width="10" height="4" fill="#000000" opacity="0.3" />

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

            {/* Q. Maple the Baby Fawn Companion (Gentle deer fawn resting peacefully in the forest camp) */}
            {(config.companionId === 'forest_camp_fawn' || config.companionId === 'companion_forest_camp_fawn') && (() => {
              const fawnBreathe = animTick % 2 === 0 ? 0 : -1;
              const earTwitch = animTick % 3 === 0;

              return (
                <g id="companion-forest-fawn" transform={`translate(22, ${50 + fawnBreathe})`}>
                  {/* Stepped Pixel Shadow underneath */}
                  <rect x="2" y="24" width="24" height="2" fill="#0f291e" opacity="0.4" />
                  <rect x="6" y="23" width="16" height="4" fill="#0f291e" opacity="0.6" />

                  {/* Body & Warm Chestnut Fur (Width 26, Height 18) */}
                  <rect x="4" y="10" width="22" height="13" fill="#B45309" />
                  <rect x="6" y="12" width="18" height="10" fill="#D97706" />

                  {/* White Dappled Camo Spots */}
                  <rect x="9" y="13" width="2.5" height="2.5" fill="#FEF3C7" />
                  <rect x="16" y="14" width="2.5" height="2.5" fill="#FEF3C7" />
                  <rect x="12" y="18" width="2" height="2" fill="#FEF3C7" />
                  <rect x="19" y="19" width="2.5" height="2.5" fill="#FEF3C7" />

                  {/* Gentle Head & Ears */}
                  <rect x="14" y="3" width="13" height="11" fill="#D97706" />
                  {/* Left & Right Ears with Twitches */}
                  <rect x="13" y={earTwitch ? 0 : 1} width="5" height="5" fill="#B45309" />
                  <rect x="14" y={earTwitch ? 1 : 2} width="3" height="3" fill="#FEF3C7" />
                  <rect x="23" y={earTwitch ? 1 : 0} width="5" height="5" fill="#B45309" />
                  <rect x="24" y={earTwitch ? 2 : 1} width="3" height="3" fill="#FEF3C7" />

                  {/* Gentle Dark Eye with Star Catchlight */}
                  <rect x="21" y="6" width="4" height="4" fill="#1C1917" />
                  <rect x="22" y="6" width="1.5" height="1.5" fill="#FFFFFF" />

                  {/* Cute White Snout & Black Button Nose */}
                  <rect x="24" y="9" width="4" height="4" fill="#FEF3C7" />
                  <rect x="26" y="9" width="2" height="2" fill="#1C1917" />

                  {/* Soft Rosy Blush Cheek */}
                  <rect x="18" y="9" width="3" height="2" fill="#FB7185" opacity="0.8" />

                  {/* Fluffy White Tail with Wag */}
                  <rect x="1" y={animTick % 2 === 0 ? 11 : 13} width="5" height="6" fill="#FEF3C7" />

                  {/* Folded Resting Legs */}
                  <rect x="5" y="22" width="6" height="3" fill="#92400E" />
                  <rect x="17" y="22" width="7" height="3" fill="#92400E" />
                </g>
              );
            })()}

            {/* R. Bandit the Camp Raccoon Companion (Sitting near the campfire munching marshmallow) */}
            {(config.companionId === 'campfire_raccoon' || config.companionId === 'companion_campfire_raccoon') && (() => {
              const munchY = animTick % 2 === 0 ? 0 : 1;
              const tailWag = animTick % 2 === 0 ? 0 : -2;

              return (
                <g id="companion-camp-raccoon" transform={`translate(104, 52)`}>
                  {/* Stepped Pixel Ground Shadow */}
                  <rect x="2" y="24" width="24" height="2" fill="#0f291e" opacity="0.4" />
                  <rect x="6" y="23" width="16" height="4" fill="#0f291e" opacity="0.6" />

                  {/* Fluffy Striped Ringed Tail on Left */}
                  <g transform={`translate(-6, ${8 + tailWag})`}>
                    <rect x="0" y="0" width="8" height="6" fill="#475569" />
                    <rect x="2" y="0" width="2.5" height="6" fill="#0F172A" />
                    <rect x="6" y="0" width="2.5" height="6" fill="#0F172A" />
                  </g>

                  {/* Chubby Raccoon Body (Width 20, Height 16) */}
                  <rect x="4" y="9" width="18" height="15" fill="#64748B" />
                  <rect x="7" y="11" width="12" height="11" fill="#94A3B8" />

                  {/* Round Head & Ears */}
                  <rect x="5" y="2" width="16" height="11" fill="#64748B" />
                  <rect x="4" y="0" width="5" height="4" fill="#334155" />
                  <rect x="5" y="1" width="2.5" height="2.5" fill="#CBD5E1" />
                  <rect x="17" y="0" width="5" height="4" fill="#334155" />
                  <rect x="18" y="1" width="2.5" height="2.5" fill="#CBD5E1" />

                  {/* Bandit Black Eye Mask */}
                  <rect x="4" y="5" width="18" height="5" fill="#0F172A" />
                  {/* Expressive Curious Eyes */}
                  <rect x="6" y="6" width="3.5" height="3.5" fill="#FFFFFF" />
                  <rect x="7.5" y="6.5" width="2" height="2" fill="#0F172A" />
                  <rect x="15" y="6" width="3.5" height="3.5" fill="#FFFFFF" />
                  <rect x="15.5" y="6.5" width="2" height="2" fill="#0F172A" />

                  {/* White Snout & Nose */}
                  <rect x="10" y="9" width="6" height="4" fill="#F8FAFC" />
                  <rect x="12" y="9.5" width="2.5" height="2" fill="#0F172A" />

                  {/* Munching Toasted Marshmallow on Branch Stick */}
                  <g transform={`translate(16, ${7 + munchY})`}>
                    <rect x="0" y="3" width="9" height="1.5" fill="#78350F" />
                    <rect x="5" y="0" width="5" height="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.5" />
                    <rect x="6.5" y="1.5" width="2.5" height="2" fill="#78350F" />
                    {/* Steam / Crumb */}
                    <rect x="10" y="-1" width="1.5" height="1.5" fill="#FFFFFF" opacity={animTick % 2 === 0 ? 0.8 : 0.2} />
                  </g>

                  {/* Paws */}
                  <rect x="5" y="23" width="5" height="3" fill="#334155" />
                  <rect x="14" y="23" width="5" height="3" fill="#334155" />
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
                      {/* Frog Eyes Top Outlines & 5-Tone Eye Sockets */}
                      <rect x={frogX} y={frogY} width="5" height="5" fill={skin.outline} />
                      <rect x={frogX + 11} y={frogY} width="5" height="5" fill={skin.outline} />
                      {/* Eye Top Highlight Ridge */}
                      <rect x={frogX + 1} y={frogY} width="3" height="1" fill={skin.highlight || '#86EFAC'} />
                      <rect x={frogX + 12} y={frogY} width="3" height="1" fill={skin.highlight || '#86EFAC'} />
                      <rect x={frogX + 1} y={frogY + 1} width="3" height="3" fill={skin.main} />
                      <rect x={frogX + 12} y={frogY + 1} width="3" height="3" fill={skin.main} />
                      {/* Deep Socket Shadow */}
                      <rect x={frogX + 1} y={frogY + 3} width="3" height="1" fill={skin.dark} />
                      <rect x={frogX + 12} y={frogY + 3} width="3" height="1" fill={skin.dark} />

                      {/* Frog Body / Head Main with Forehead Dappled Highlight */}
                      <rect x={frogX - 2} y={frogY + 4} width="20" height="16" fill={skin.main} />
                      <rect x={frogX + 4} y={frogY + 4} width="8" height="2" fill={skin.highlight || '#86EFAC'} />
                      <rect x={frogX + 6} y={frogY + 3} width="4" height="1" fill={skin.highlight || '#86EFAC'} />

                      {/* Flank Shading & Deep Contours */}
                      <rect x={frogX - 2} y={frogY + 6} width="2" height="12" fill={skin.dark} />
                      <rect x={frogX + 16} y={frogY + 6} width="2" height="12" fill={skin.dark} />
                      <rect x={frogX - 3} y={frogY + 6} width="1" height="12" fill={skin.outline} />
                      <rect x={frogX + 18} y={frogY + 6} width="1" height="12" fill={skin.outline} />
                      <rect x={frogX} y={frogY + 20} width="16" height="1" fill={skin.outline} />
                      {/* Ambient Under-body Shadow */}
                      <rect x={frogX - 1} y={frogY + 19} width="18" height="1" fill={skin.deep || '#365314'} />

                      {/* 3-Tone Cream Belly with Soft Under-Shadow */}
                      <rect x={frogX + 3} y={frogY + 11} width="10" height="7" fill={skin.belly} />
                      <rect x={frogX + 4} y={frogY + 10} width="8" height="2" fill={skin.belly} />
                      <rect x={frogX + 3} y={frogY + 16} width="10" height="2" fill={skin.bellyShadow || '#FDE68A'} />

                      {/* Two-Tone Rosy Cheeks (Soft Outer Blush + Core Pink) */}
                      <rect x={frogX - 1} y={frogY + 10} width="4" height="3" fill={skin.cheeks} opacity="0.85" />
                      <rect x={frogX} y={frogY + 11} width="2" height="1" fill={skin.cheeksCore || '#FB7185'} />
                      <rect x={frogX + 13} y={frogY + 10} width="4" height="3" fill={skin.cheeks} opacity="0.85" />
                      <rect x={frogX + 14} y={frogY + 11} width="2" height="1" fill={skin.cheeksCore || '#FB7185'} />

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
                        /* Expressive Glossy Eyes with 1px Pure White Specular Sparkle & Smile */
                        <g>
                          <rect x={frogX + 2} y={frogY + 6} width="4" height="3" fill={skin.outline} />
                          <rect x={frogX + 2} y={frogY + 6} width="2" height="2" fill={skin.eyePupil || '#0F172A'} />
                          <rect x={frogX + 2} y={frogY + 6} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 10} y={frogY + 6} width="4" height="3" fill={skin.outline} />
                          <rect x={frogX + 12} y={frogY + 6} width="2" height="2" fill={skin.eyePupil || '#0F172A'} />
                          <rect x={frogX + 12} y={frogY + 6} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 6} y={frogY + 11} width="4" height="1" fill={skin.outline} />
                          <rect x={frogX + 5} y={frogY + 10} width="1" height="1" fill={skin.outline} />
                          <rect x={frogX + 10} y={frogY + 10} width="1" height="1" fill={skin.outline} />
                        </g>
                      )}

                      {/* 3-Tone Shaded Frog Legs / Feet */}
                      <rect x={frogX - 4} y={frogY + 18} width="6" height="3" fill={skin.legs} />
                      <rect x={frogX - 4} y={frogY + 18} width="5" height="1" fill={skin.legsHighlight || skin.main} />
                      <rect x={frogX - 4} y={frogY + 20} width="6" height="1" fill={skin.dark} />
                      <rect x={frogX + 14} y={frogY + 18} width="6" height="3" fill={skin.legs} />
                      <rect x={frogX + 15} y={frogY + 18} width="5" height="1" fill={skin.legsHighlight || skin.main} />
                      <rect x={frogX + 14} y={frogY + 20} width="6" height="1" fill={skin.dark} />

                      {/* OUTFIT CLOTHING LAYER */}

                      {/* 1. Traditional Master Kimono / Yukata */}
                      {config.outfitId === 'kimono' && (
                        <g id="scene-outfit-kimono">
                          {/* Deep Royal Indigo Silk Robe Body */}
                          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#0F172A" />
                          <rect x={frogX - 2} y={frogY + 10} width="20" height="10" fill="#1E3A8A" />
                          <rect x={frogX - 1} y={frogY + 10} width="18" height="9" fill="#2563EB" />
                          <rect x={frogX} y={frogY + 11} width="16" height="7" fill="#3B82F6" />
                          {/* Layered White/Ivory Crossover Inner Collar (Nagajuban) */}
                          <rect x={frogX + 5} y={frogY + 9} width="6" height="4" fill="#FFFFFF" />
                          <rect x={frogX + 6} y={frogY + 10} width="4" height="2" fill="#E2E8F0" />
                          <rect x={frogX + 7} y={frogY + 11} width="2" height="2" fill="#CBD5E1" />
                          {/* 4-Tone Gilded Gold Obi Sash */}
                          <rect x={frogX - 2} y={frogY + 13} width="20" height="4" fill="#78350F" />
                          <rect x={frogX - 1} y={frogY + 13} width="18" height="3" fill="#D97706" />
                          <rect x={frogX} y={frogY + 14} width="16" height="2" fill="#FACC15" />
                          <rect x={frogX + 2} y={frogY + 14} width="12" height="1" fill="#FEF08A" />
                          {/* Crimson Obi-jime Cord & Floral Knot */}
                          <rect x={frogX - 1} y={frogY + 15} width="18" height="1" fill="#991B1B" />
                          <rect x={frogX + 6} y={frogY + 13} width="4" height="4" fill="#DC2626" />
                          <rect x={frogX + 7} y={frogY + 14} width="2" height="2" fill="#EF4444" />
                          <rect x={frogX + 7} y={frogY + 14} width="1" height="1" fill="#FEF08A" />
                          {/* Gold Leaf Hem Accent Motifs */}
                          <rect x={frogX - 1} y={frogY + 18} width="3" height="1" fill="#FDE047" />
                          <rect x={frogX + 14} y={frogY + 18} width="3" height="1" fill="#FDE047" />
                        </g>
                      )}

                      {/* 2. Yellow Slicker Fisher Raincoat */}
                      {config.outfitId === 'raincoat' && (
                        <g id="scene-outfit-raincoat">
                          {/* 5-Tone Vibrant Sun Yellow Vinyl Body */}
                          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#713F12" />
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#CA8A04" />
                          <rect x={frogX - 1} y={frogY + 10} width="18" height="10" fill="#EAB308" />
                          <rect x={frogX} y={frogY + 10} width="16" height="9" fill="#FACC15" />
                          {/* High-Gloss Specular Shine Highlights on Vinyl */}
                          <rect x={frogX - 1} y={frogY + 11} width="3" height="2" fill="#FEF08A" />
                          <rect x={frogX - 1} y={frogY + 11} width="2" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 13} y={frogY + 11} width="3" height="2" fill="#FEF08A" />
                          <rect x={frogX + 14} y={frogY + 11} width="2" height="1" fill="#FFFFFF" />
                          {/* Folded Storm Collar with Depth */}
                          <rect x={frogX + 2} y={frogY + 8} width="12" height="3" fill="#CA8A04" />
                          <rect x={frogX + 3} y={frogY + 8} width="10" height="2" fill="#FACC15" />
                          {/* Center Wind Placket & Horn Toggle Buttons */}
                          <rect x={frogX + 7} y={frogY + 9} width="2" height="11" fill="#CA8A04" />
                          <rect x={frogX + 7} y={frogY + 11} width="2" height="2" fill="#451A03" />
                          <rect x={frogX + 7} y={frogY + 11} width="1" height="1" fill="#78350F" />
                          <rect x={frogX + 7} y={frogY + 14} width="2" height="2" fill="#451A03" />
                          <rect x={frogX + 7} y={frogY + 14} width="1" height="1" fill="#78350F" />
                          <rect x={frogX + 7} y={frogY + 17} width="2" height="2" fill="#451A03" />
                          <rect x={frogX + 7} y={frogY + 17} width="1" height="1" fill="#78350F" />
                          {/* Lower Flap Pockets */}
                          <rect x={frogX - 1} y={frogY + 15} width="4" height="3" fill="#A16207" />
                          <rect x={frogX - 1} y={frogY + 15} width="4" height="1" fill="#713F12" />
                          <rect x={frogX + 13} y={frogY + 15} width="4" height="3" fill="#A16207" />
                          <rect x={frogX + 13} y={frogY + 15} width="4" height="1" fill="#713F12" />
                        </g>
                      )}

                      {/* 3. Autumn Chunky Cable-Knit Sweater */}
                      {config.outfitId === 'sweater' && (
                        <g id="scene-outfit-sweater">
                          {/* 5-Tone Terracotta/Amber Chunky Wool Body */}
                          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#431407" />
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#7C2D12" />
                          <rect x={frogX - 1} y={frogY + 10} width="18" height="10" fill="#C2410C" />
                          <rect x={frogX} y={frogY + 10} width="16" height="9" fill="#EA580C" />
                          {/* Chunky Ribbed Waffle Turtle Neck */}
                          <rect x={frogX + 2} y={frogY + 8} width="12" height="3" fill="#7C2D12" />
                          <rect x={frogX + 3} y={frogY + 8} width="10" height="2" fill="#F97316" />
                          <rect x={frogX + 4} y={frogY + 8} width="1" height="2" fill="#7C2D12" />
                          <rect x={frogX + 7} y={frogY + 8} width="1" height="2" fill="#7C2D12" />
                          <rect x={frogX + 10} y={frogY + 8} width="1" height="2" fill="#7C2D12" />
                          {/* Vertical Braided Cable-Knit Patterns */}
                          <rect x={frogX + 2} y={frogY + 11} width="3" height="7" fill="#F97316" />
                          <rect x={frogX + 3} y={frogY + 12} width="1" height="5" fill="#FDBA74" />
                          <rect x={frogX + 1} y={frogY + 11} width="1" height="7" fill="#7C2D12" />
                          <rect x={frogX + 6} y={frogY + 11} width="4" height="7" fill="#F97316" />
                          <rect x={frogX + 7} y={frogY + 11} width="2" height="6" fill="#FDBA74" />
                          <rect x={frogX + 11} y={frogY + 11} width="3" height="7" fill="#F97316" />
                          <rect x={frogX + 12} y={frogY + 12} width="1" height="5" fill="#FDBA74" />
                          <rect x={frogX + 14} y={frogY + 11} width="1" height="7" fill="#7C2D12" />
                          {/* Chunky Folded Hem Ribbing */}
                          <rect x={frogX - 1} y={frogY + 18} width="18" height="2" fill="#7C2D12" />
                          <rect x={frogX} y={frogY + 18} width="16" height="1" fill="#F97316" />
                        </g>
                      )}

                      {/* 4. Shinobi Shadow Shōzoku Outfit */}
                      {config.outfitId === 'ninja' && (
                        <g id="scene-outfit-ninja">
                          {/* 5-Tone Midnight Obsidian & Charcoal Gi Body */}
                          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#09090B" />
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#18181B" />
                          <rect x={frogX - 1} y={frogY + 10} width="18" height="9" fill="#27272A" />
                          <rect x={frogX} y={frogY + 10} width="16" height="8" fill="#3F3F46" />
                          {/* Crossed Wrapping Lapels (Kasa) with Shadows */}
                          <rect x={frogX + 4} y={frogY + 9} width="8" height="4" fill="#18181B" />
                          <rect x={frogX + 5} y={frogY + 10} width="6" height="2" fill="#27272A" />
                          {/* Crimson Silk Sash Obi with Draping Tails */}
                          <rect x={frogX - 2} y={frogY + 13} width="20" height="3" fill="#7F1D1D" />
                          <rect x={frogX - 1} y={frogY + 13} width="18" height="2" fill="#DC2626" />
                          <rect x={frogX} y={frogY + 13} width="16" height="1" fill="#EF4444" />
                          {/* Trailing Knot on Right */}
                          <rect x={frogX + 12} y={frogY + 15} width="3" height="5" fill="#7F1D1D" />
                          <rect x={frogX + 13} y={frogY + 15} width="2" height="4" fill="#DC2626" />
                          {/* Silver Shuriken Emblem / Throwing Star Tucked in Sash */}
                          <rect x={frogX + 6} y={frogY + 12} width="4" height="4" fill="#E2E8F0" />
                          <rect x={frogX + 7} y={frogY + 13} width="2" height="2" fill="#09090B" />
                          <rect x={frogX + 7} y={frogY + 11} width="2" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 7} y={frogY + 16} width="2" height="1" fill="#FFFFFF" />
                          {/* Dark Wrapped Arm Guards */}
                          <rect x={frogX - 3} y={frogY + 12} width="2" height="4" fill="#09090B" />
                          <rect x={frogX + 17} y={frogY + 12} width="2" height="4" fill="#09090B" />
                        </g>
                      )}

                      {/* 5. Classic Seifuku Sailor Uniform */}
                      {config.outfitId === 'sailor' && (
                        <g id="scene-outfit-sailor">
                          {/* Crisp Pure White Cotton Shirt with Soft Shading */}
                          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#64748B" />
                          <rect x={frogX - 2} y={frogY + 10} width="20" height="10" fill="#CBD5E1" />
                          <rect x={frogX - 1} y={frogY + 10} width="18" height="9" fill="#F8FAFC" />
                          <rect x={frogX} y={frogY + 11} width="16" height="8" fill="#FFFFFF" />
                          {/* Deep Navy Blue Sailor Flap Collar */}
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="4" fill="#172554" />
                          <rect x={frogX - 1} y={frogY + 9} width="18" height="3" fill="#1E3A8A" />
                          <rect x={frogX} y={frogY + 9} width="16" height="2" fill="#2563EB" />
                          {/* Twin White Sailor Accent Stripes on Collar */}
                          <rect x={frogX - 1} y={frogY + 11} width="18" height="1" fill="#FFFFFF" />
                          {/* Crimson Silk Ribbon Bow Tie */}
                          <rect x={frogX + 6} y={frogY + 11} width="4" height="4" fill="#7F1D1D" />
                          <rect x={frogX + 6} y={frogY + 12} width="4" height="3" fill="#DC2626" />
                          <rect x={frogX + 7} y={frogY + 12} width="2" height="2" fill="#F87171" />
                          {/* Draping Ribbon Tails */}
                          <rect x={frogX + 5} y={frogY + 14} width="2" height="4" fill="#DC2626" />
                          <rect x={frogX + 9} y={frogY + 14} width="2" height="4" fill="#DC2626" />
                          {/* Navy Blue Pleated Waistband */}
                          <rect x={frogX - 2} y={frogY + 18} width="20" height="3" fill="#172554" />
                          <rect x={frogX - 1} y={frogY + 18} width="18" height="2" fill="#1E3A8A" />
                        </g>
                      )}

                      {/* 6. Artisan Crafting & Gardening Apron */}
                      {config.outfitId === 'apron' && (
                        <g id="scene-outfit-apron">
                          {/* Deep Forest Green Sturdy Canvas Bib Apron */}
                          <rect x={frogX} y={frogY + 9} width="16" height="12" fill="#0F260C" />
                          <rect x={frogX + 1} y={frogY + 9} width="14" height="11" fill="#14532D" />
                          <rect x={frogX + 2} y={frogY + 10} width="12" height="10" fill="#166534" />
                          <rect x={frogX + 3} y={frogY + 10} width="10" height="9" fill="#15803D" />
                          {/* Leather Cross-Back Straps with Brass Rivets */}
                          <rect x={frogX + 2} y={frogY + 8} width="2" height="4" fill="#78350F" />
                          <rect x={frogX + 12} y={frogY + 8} width="2" height="4" fill="#78350F" />
                          <rect x={frogX + 2} y={frogY + 10} width="1" height="1" fill="#FACC15" />
                          <rect x={frogX + 13} y={frogY + 10} width="1" height="1" fill="#FACC15" />
                          {/* Large Split Artisan Pocket with Tools */}
                          <rect x={frogX + 3} y={frogY + 13} width="10" height="6" fill="#78350F" />
                          <rect x={frogX + 4} y={frogY + 14} width="8" height="4" fill="#B45309" />
                          <rect x={frogX + 7} y={frogY + 13} width="2" height="5" fill="#78350F" />
                          {/* Crafting Tools Peeking Out (Wooden Ruler & Paintbrush) */}
                          <rect x={frogX + 5} y={frogY + 12} width="1" height="3" fill="#FDE047" />
                          <rect x={frogX + 9} y={frogY + 11} width="2" height="3" fill="#CA8A04" />
                          <rect x={frogX + 9} y={frogY + 11} width="2" height="1" fill="#3B82F6" />
                        </g>
                      )}

                      {/* 7. Classic Denim Dungarees / Overalls */}
                      {config.outfitId === 'overalls' && (
                        <g id="scene-outfit-overalls">
                          {/* White Under-Tee */}
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="6" fill="#CBD5E1" />
                          <rect x={frogX - 1} y={frogY + 10} width="18" height="4" fill="#FFFFFF" />
                          {/* 5-Tone Stonewash Denim Dungaree Pants */}
                          <rect x={frogX - 2} y={frogY + 12} width="20" height="9" fill="#172554" />
                          <rect x={frogX - 1} y={frogY + 12} width="18" height="8" fill="#1E40AF" />
                          <rect x={frogX} y={frogY + 13} width="16" height="7" fill="#2563EB" />
                          <rect x={frogX + 1} y={frogY + 13} width="14" height="6" fill="#3B82F6" />
                          {/* Denim Bib & Center Chest Pocket */}
                          <rect x={frogX + 3} y={frogY + 10} width="10" height="7" fill="#1E40AF" />
                          <rect x={frogX + 4} y={frogY + 11} width="8" height="5" fill="#2563EB" />
                          <rect x={frogX + 5} y={frogY + 13} width="6" height="3" fill="#1D4ED8" />
                          {/* Heavy Denim Suspender Straps with Brass Buckles */}
                          <rect x={frogX + 2} y={frogY + 9} width="2" height="5" fill="#1D4ED8" />
                          <rect x={frogX + 12} y={frogY + 9} width="2" height="5" fill="#1D4ED8" />
                          <rect x={frogX + 2} y={frogY + 11} width="2" height="2" fill="#FACC15" />
                          <rect x={frogX + 2} y={frogY + 11} width="1" height="1" fill="#FEF08A" />
                          <rect x={frogX + 12} y={frogY + 11} width="2" height="2" fill="#FACC15" />
                          <rect x={frogX + 12} y={frogY + 11} width="1" height="1" fill="#FEF08A" />
                          {/* Copper Rivets on Waist */}
                          <rect x={frogX - 1} y={frogY + 14} width="1" height="1" fill="#F59E0B" />
                          <rect x={frogX + 16} y={frogY + 14} width="1" height="1" fill="#F59E0B" />
                        </g>
                      )}

                      {/* 8. Chunky Hand-Knit Crimson Winter Scarf */}
                      {config.outfitId === 'scarf' && (
                        <g id="scene-outfit-scarf">
                          {/* Multi-Layered Plump Wool Scarf Wraps */}
                          <rect x={frogX - 4} y={frogY + 8} width="24" height="6" fill="#450A0A" />
                          <rect x={frogX - 3} y={frogY + 8} width="22" height="5" fill="#7F1D1D" />
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="4" fill="#991B1B" />
                          <rect x={frogX - 1} y={frogY + 9} width="18" height="3" fill="#DC2626" />
                          <rect x={frogX} y={frogY + 9} width="16" height="2" fill="#EF4444" />
                          <rect x={frogX + 2} y={frogY + 9} width="12" height="1" fill="#FCA5A5" />
                          {/* Draping Ribbed Scarf Tail with Fringe Tassels */}
                          <rect x={frogX + 11} y={frogY + 12} width="5" height="9" fill="#450A0A" />
                          <rect x={frogX + 12} y={frogY + 12} width="4" height="8" fill="#991B1B" />
                          <rect x={frogX + 12} y={frogY + 13} width="3" height="7" fill="#DC2626" />
                          <rect x={frogX + 13} y={frogY + 13} width="1" height="6" fill="#FCA5A5" />
                          {/* Golden Yarn Fringe Tassels */}
                          <rect x={frogX + 11} y={frogY + 20} width="1" height="2" fill="#FEF08A" />
                          <rect x={frogX + 13} y={frogY + 20} width="1" height="2" fill="#FEF08A" />
                          <rect x={frogX + 15} y={frogY + 20} width="1" height="2" fill="#FEF08A" />
                        </g>
                      )}

                      {/* 9. Executive Detective Tailored Suit */}
                      {config.outfitId === 'business' && (
                        <g id="scene-outfit-business">
                          {/* Tailored Charcoal / Midnight Navy Blazer Body */}
                          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#020617" />
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#0F172A" />
                          <rect x={frogX - 1} y={frogY + 10} width="18" height="10" fill="#1E293B" />
                          <rect x={frogX} y={frogY + 10} width="16" height="9" fill="#334155" />
                          {/* Crisp White Shirt Collar & V-Opening */}
                          <rect x={frogX + 4} y={frogY + 9} width="8" height="7" fill="#E2E8F0" />
                          <rect x={frogX + 5} y={frogY + 9} width="6" height="6" fill="#FFFFFF" />
                          {/* Ruby Red Silk Tie with Golden Tie Clip */}
                          <rect x={frogX + 7} y={frogY + 10} width="2" height="7" fill="#991B1B" />
                          <rect x={frogX + 7} y={frogY + 11} width="2" height="5" fill="#DC2626" />
                          <rect x={frogX + 7} y={frogY + 13} width="3" height="1" fill="#FACC15" />
                          {/* Breast Pocket with White Silk Pocket Square */}
                          <rect x={frogX + 2} y={frogY + 13} width="3" height="1" fill="#0F172A" />
                          <rect x={frogX + 2} y={frogY + 12} width="2" height="1" fill="#FFFFFF" />
                          {/* Golden Cuff Buttons */}
                          <rect x={frogX - 2} y={frogY + 16} width="1" height="2" fill="#FACC15" />
                          <rect x={frogX + 17} y={frogY + 16} width="1" height="2" fill="#FACC15" />
                        </g>
                      )}

                      {/* 10. Relaxed Evergreen Streetwear Hoodie */}
                      {config.outfitId === 'hoodie' && (
                        <g id="scene-outfit-hoodie">
                          {/* 5-Tone Cozy Forest Emerald Fleece Body */}
                          <rect x={frogX - 4} y={frogY + 8} width="24" height="13" fill="#064E3B" />
                          <rect x={frogX - 3} y={frogY + 8} width="22" height="12" fill="#047857" />
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#059669" />
                          <rect x={frogX - 1} y={frogY + 9} width="18" height="10" fill="#10B981" />
                          <rect x={frogX} y={frogY + 10} width="16" height="8" fill="#34D399" />
                          {/* Slouchy Hood Collar Folds */}
                          <rect x={frogX - 2} y={frogY + 7} width="6" height="4" fill="#047857" />
                          <rect x={frogX + 12} y={frogY + 7} width="6" height="4" fill="#047857" />
                          {/* White Woven Drawstrings with Golden Aglets */}
                          <rect x={frogX + 5} y={frogY + 10} width="1" height="5" fill="#FFFFFF" />
                          <rect x={frogX + 5} y={frogY + 15} width="1" height="1" fill="#FACC15" />
                          <rect x={frogX + 10} y={frogY + 10} width="1" height="5" fill="#FFFFFF" />
                          <rect x={frogX + 10} y={frogY + 15} width="1" height="1" fill="#FACC15" />
                          {/* Roomy Kangaroo Pouch Pocket */}
                          <rect x={frogX + 2} y={frogY + 13} width="12" height="6" fill="#047857" />
                          <rect x={frogX + 3} y={frogY + 14} width="10" height="4" fill="#059669" />
                          <rect x={frogX + 4} y={frogY + 14} width="8" height="3" fill="#10B981" />
                          {/* Bottom Hem & Sleeve Cuffs */}
                          <rect x={frogX - 2} y={frogY + 19} width="20" height="2" fill="#064E3B" />
                        </g>
                      )}

                      {/* 11. Fairytale Folk Dirndl Dress */}
                      {config.outfitId === 'red_riding_dress' && (
                        <g id="scene-outfit-red-riding-dress">
                          {/* Frilled Peasant Blouse */}
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="5" fill="#CBD5E1" />
                          <rect x={frogX - 1} y={frogY + 9} width="18" height="4" fill="#F8FAFC" />
                          <rect x={frogX} y={frogY + 10} width="16" height="3" fill="#FFFFFF" />
                          {/* Rich Mahogany Leather Corset with Gold Lacing */}
                          <rect x={frogX} y={frogY + 11} width="16" height="5" fill="#451A03" />
                          <rect x={frogX + 1} y={frogY + 11} width="14" height="4" fill="#78350F" />
                          <rect x={frogX + 2} y={frogY + 12} width="12" height="3" fill="#B45309" />
                          <rect x={frogX + 6} y={frogY + 12} width="4" height="1" fill="#FACC15" />
                          <rect x={frogX + 6} y={frogY + 14} width="4" height="1" fill="#FACC15" />
                          {/* Flared Ruby Red Velvet Skirt */}
                          <rect x={frogX - 3} y={frogY + 15} width="22" height="7" fill="#7F1D1D" />
                          <rect x={frogX - 2} y={frogY + 15} width="20" height="6" fill="#991B1B" />
                          <rect x={frogX - 1} y={frogY + 16} width="18" height="5" fill="#DC2626" />
                          <rect x={frogX} y={frogY + 16} width="16" height="4" fill="#EF4444" />
                          {/* Delicate Scalloped White Lace Apron Overlay */}
                          <rect x={frogX + 4} y={frogY + 15} width="8" height="6" fill="#E2E8F0" />
                          <rect x={frogX + 5} y={frogY + 15} width="6" height="5" fill="#FFFFFF" />
                          <rect x={frogX + 4} y={frogY + 20} width="8" height="1" fill="#F8FAFC" />
                        </g>
                      )}

                      {/* 12. Primal Timber Wolf Pelt Mantle */}
                      {config.outfitId === 'wolf_fur_cloak' && (
                        <g id="scene-outfit-wolf-cloak">
                          {/* Thick Layered Wolf Fur Collar across Shoulders */}
                          <rect x={frogX - 4} y={frogY + 8} width="24" height="6" fill="#0F172A" />
                          <rect x={frogX - 3} y={frogY + 8} width="22" height="5" fill="#1E293B" />
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="4" fill="#334155" />
                          <rect x={frogX - 1} y={frogY + 9} width="18" height="3" fill="#475569" />
                          <rect x={frogX} y={frogY + 9} width="16" height="2" fill="#64748B" />
                          {/* Carved Beast Fang Clasp */}
                          <rect x={frogX + 6} y={frogY + 10} width="4" height="3" fill="#0F172A" />
                          <rect x={frogX + 7} y={frogY + 10} width="2" height="3" fill="#E2E8F0" />
                          <rect x={frogX + 7} y={frogY + 10} width="1" height="2" fill="#FFFFFF" />
                          {/* Heavy Weathered Charcoal Fur Cloak Body */}
                          <rect x={frogX - 3} y={frogY + 13} width="22" height="9" fill="#0F172A" />
                          <rect x={frogX - 2} y={frogY + 13} width="20" height="8" fill="#1E293B" />
                          <rect x={frogX - 1} y={frogY + 14} width="18" height="7" fill="#334155" />
                          <rect x={frogX + 2} y={frogY + 14} width="12" height="5" fill="#475569" />
                          {/* Stepped Jagged Fur Fringe Edges */}
                          <rect x={frogX - 2} y={frogY + 20} width="3" height="2" fill="#0F172A" />
                          <rect x={frogX + 6} y={frogY + 20} width="4" height="2" fill="#0F172A" />
                          <rect x={frogX + 15} y={frogY + 20} width="3" height="2" fill="#0F172A" />
                        </g>
                      )}

                      {/* 13. Lumberjack Woodsman Flannel & Tool Rig */}
                      {config.outfitId === 'hunter_woodsman' && (
                        <g id="scene-outfit-hunter">
                          {/* Red & Black Buffalo Plaid Heavy Shirt */}
                          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#450A0A" />
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#7F1D1D" />
                          <rect x={frogX - 1} y={frogY + 10} width="18" height="10" fill="#DC2626" />
                          <rect x={frogX} y={frogY + 10} width="16" height="9" fill="#EF4444" />
                          {/* Plaid Grid Pattern */}
                          <rect x={frogX - 1} y={frogY + 10} width="3" height="10" fill="#18181B" />
                          <rect x={frogX + 6} y={frogY + 10} width="3" height="10" fill="#18181B" />
                          <rect x={frogX + 14} y={frogY + 10} width="3" height="10" fill="#18181B" />
                          <rect x={frogX - 2} y={frogY + 13} width="20" height="2" fill="#18181B" />
                          {/* Heavy Leather Harness & Belt with Brass Buckle */}
                          <rect x={frogX - 2} y={frogY + 15} width="20" height="3" fill="#451A03" />
                          <rect x={frogX - 1} y={frogY + 15} width="18" height="2" fill="#78350F" />
                          <rect x={frogX + 6} y={frogY + 14} width="4" height="4" fill="#CA8A04" />
                          <rect x={frogX + 7} y={frogY + 15} width="2" height="2" fill="#FEF08A" />
                          {/* Diagonal Leather Shoulder Strap */}
                          <rect x={frogX + 2} y={frogY + 9} width="3" height="6" fill="#78350F" />
                        </g>
                      )}

                      {/* 14. Master Itamae Traditional Happi Coat */}
                      {config.outfitId === 'sushi_chef_happi' && (
                        <g id="scene-outfit-sushi-happi">
                          {/* Crisp Starched White Happi Body */}
                          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#64748B" />
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#CBD5E1" />
                          <rect x={frogX - 1} y={frogY + 10} width="18" height="10" fill="#F8FAFC" />
                          <rect x={frogX} y={frogY + 10} width="16" height="9" fill="#FFFFFF" />
                          {/* Deep Navy Blue Lapel Trims with Wave Mon */}
                          <rect x={frogX - 2} y={frogY + 9} width="3" height="11" fill="#172554" />
                          <rect x={frogX - 1} y={frogY + 10} width="2" height="9" fill="#1E3A8A" />
                          <rect x={frogX + 15} y={frogY + 9} width="3" height="11" fill="#172554" />
                          <rect x={frogX + 15} y={frogY + 10} width="2" height="9" fill="#1E3A8A" />
                          {/* Traditional Navy Hem Wave Pattern */}
                          <rect x={frogX - 1} y={frogY + 18} width="18" height="2" fill="#1E3A8A" />
                          <rect x={frogX + 3} y={frogY + 18} width="2" height="1" fill="#60A5FA" />
                          <rect x={frogX + 8} y={frogY + 18} width="2" height="1" fill="#60A5FA" />
                          <rect x={frogX + 13} y={frogY + 18} width="2" height="1" fill="#60A5FA" />
                          {/* Crimson Chef Sash Obi with Front Knot */}
                          <rect x={frogX - 1} y={frogY + 14} width="18" height="3" fill="#7F1D1D" />
                          <rect x={frogX} y={frogY + 14} width="16" height="2" fill="#DC2626" />
                          <rect x={frogX + 6} y={frogY + 13} width="4" height="4" fill="#EF4444" />
                          <rect x={frogX + 7} y={frogY + 14} width="2" height="2" fill="#991B1B" />
                        </g>
                      )}

                      {/* 15. Traditional Ryokan Waiter Kimono & Maekake */}
                      {config.outfitId === 'sushi_kimono_waiter' && (
                        <g id="scene-outfit-sushi-waiter">
                          {/* Dark Midnight Indigo Kimono Body */}
                          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#0F172A" />
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#1E1B4B" />
                          <rect x={frogX - 1} y={frogY + 10} width="18" height="10" fill="#312E81" />
                          <rect x={frogX} y={frogY + 10} width="16" height="9" fill="#3730A3" />
                          {/* Ivory Crossover Collar */}
                          <rect x={frogX + 5} y={frogY + 9} width="6" height="3" fill="#FEF3C7" />
                          <rect x={frogX + 6} y={frogY + 10} width="4" height="2" fill="#FDE68A" />
                          {/* Traditional Tan Canvas Half-Apron (Maekake) */}
                          <rect x={frogX - 1} y={frogY + 13} width="18" height="8" fill="#78350F" />
                          <rect x={frogX} y={frogY + 13} width="16" height="7" fill="#B45309" />
                          <rect x={frogX + 1} y={frogY + 14} width="14" height="6" fill="#D97706" />
                          <rect x={frogX + 2} y={frogY + 14} width="12" height="5" fill="#FEF3C7" />
                          {/* Braided Rope Waist Cord & Knot */}
                          <rect x={frogX - 2} y={frogY + 12} width="20" height="2" fill="#78350F" />
                          <rect x={frogX - 1} y={frogY + 12} width="18" height="1" fill="#FDE68A" />
                          <rect x={frogX + 6} y={frogY + 12} width="4" height="3" fill="#DC2626" />
                        </g>
                      )}

                      {/* 16. Japanese Convenience Store Staff Uniform */}
                      {config.outfitId === 'konbini_staff_uniform' && (
                        <g id="scene-outfit-konbini-staff">
                          {/* Two-Tone Signature Green Store Smock */}
                          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#064E3B" />
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#047857" />
                          <rect x={frogX - 1} y={frogY + 10} width="18" height="10" fill="#059669" />
                          <rect x={frogX} y={frogY + 10} width="16" height="9" fill="#10B981" />
                          {/* White Center Stripe & Crisp Collar */}
                          <rect x={frogX + 6} y={frogY + 9} width="4" height="11" fill="#FFFFFF" />
                          <rect x={frogX + 7} y={frogY + 10} width="2" height="10" fill="#F8FAFC" />
                          {/* Orange Accent Collar Tips */}
                          <rect x={frogX + 3} y={frogY + 9} width="3" height="2" fill="#EA580C" />
                          <rect x={frogX + 10} y={frogY + 9} width="3" height="2" fill="#EA580C" />
                          {/* Official Konbini Name Tag Badge with Clip */}
                          <rect x={frogX + 2} y={frogY + 12} width="4" height="3" fill="#0F172A" />
                          <rect x={frogX + 2} y={frogY + 12} width="4" height="2.5" fill="#FEF08A" />
                          <rect x={frogX + 3} y={frogY + 13} width="2" height="1" fill="#1E293B" />
                          {/* Front Pocket with Dual Pens (Red & Blue) */}
                          <rect x={frogX + 11} y={frogY + 13} width="3" height="4" fill="#047857" />
                          <rect x={frogX + 11} y={frogY + 11} width="1" height="3" fill="#DC2626" />
                          <rect x={frogX + 13} y={frogY + 11} width="1" height="3" fill="#2563EB" />
                        </g>
                      )}

                      {/* 17. Lavender Soft-Fleece Loungewear */}
                      {config.outfitId === 'shopper_cozy_sweatset' && (
                        <g id="scene-outfit-shopper">
                          {/* 5-Tone Muted Pastel Lilac Loungewear */}
                          <rect x={frogX - 4} y={frogY + 8} width="24" height="13" fill="#3B0764" />
                          <rect x={frogX - 3} y={frogY + 8} width="22" height="12" fill="#581C87" />
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="11" fill="#7C3AED" />
                          <rect x={frogX - 1} y={frogY + 9} width="18" height="10" fill="#8B5CF6" />
                          <rect x={frogX} y={frogY + 10} width="16" height="8" fill="#A78BFA" />
                          {/* Soft Ribbed Collar & White Woven Drawstrings */}
                          <rect x={frogX + 3} y={frogY + 8} width="10" height="2" fill="#DDD6FE" />
                          <rect x={frogX + 5} y={frogY + 10} width="1" height="4" fill="#FFFFFF" />
                          <rect x={frogX + 10} y={frogY + 10} width="1" height="4" fill="#FFFFFF" />
                          {/* Front Kangaroo Pocket with Subtle Depth */}
                          <rect x={frogX + 2} y={frogY + 13} width="12" height="6" fill="#6B21A8" />
                          <rect x={frogX + 3} y={frogY + 14} width="10" height="4" fill="#7C3AED" />
                          <rect x={frogX + 4} y={frogY + 14} width="8" height="3" fill="#9333EA" />
                          {/* Soft Lavender Sweatpants Hem */}
                          <rect x={frogX - 2} y={frogY + 19} width="20" height="2" fill="#4C1D95" />
                        </g>
                      )}

                      {/* 18. Retro Cyberpunk Gamer Bomber Jacket */}
                      {config.outfitId === 'arcade_gamer_bomber' && (
                        <g id="scene-outfit-arcade-bomber">
                          {/* Royal Purple Satin Body */}
                          <rect x={frogX - 3} y={frogY + 8} width="22" height="13" fill="#3B0764" />
                          <rect x={frogX - 2} y={frogY + 8} width="20" height="12" fill="#581C87" />
                          <rect x={frogX - 1} y={frogY + 9} width="18" height="11" fill="#7E22CE" />
                          <rect x={frogX} y={frogY + 9} width="16" height="9" fill="#9333EA" />
                          {/* Neon Cyan Raglan Sleeves */}
                          <rect x={frogX - 4} y={frogY + 9} width="4" height="10" fill="#0891B2" />
                          <rect x={frogX - 3} y={frogY + 10} width="3" height="8" fill="#06B6D4" />
                          <rect x={frogX - 2} y={frogY + 10} width="1" height="6" fill="#22D3EE" />
                          <rect x={frogX + 16} y={frogY + 9} width="4" height="10" fill="#0891B2" />
                          <rect x={frogX + 16} y={frogY + 10} width="3" height="8" fill="#06B6D4" />
                          <rect x={frogX + 17} y={frogY + 10} width="1" height="6" fill="#22D3EE" />
                          {/* Heavy Golden Brass Zipper */}
                          <rect x={frogX + 7} y={frogY + 8} width="2" height="12" fill="#78350F" />
                          <rect x={frogX + 7} y={frogY + 9} width="2" height="11" fill="#FACC15" />
                          <rect x={frogX + 7} y={frogY + 9} width="1" height="10" fill="#FEF08A" />
                          {/* Embroidered Pixel Badges (8-Bit Heart & Star) */}
                          <rect x={frogX + 2} y={frogY + 11} width="3" height="3" fill="#EC4899" />
                          <rect x={frogX + 3} y={frogY + 12} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 11} y={frogY + 11} width="3" height="3" fill="#22D3EE" />
                          <rect x={frogX + 12} y={frogY + 12} width="1" height="1" fill="#FFFFFF" />
                          {/* Striped Ribbed Waistband */}
                          <rect x={frogX - 2} y={frogY + 19} width="20" height="2" fill="#1E1B4B" />
                          <rect x={frogX} y={frogY + 19} width="16" height="1" fill="#FACC15" />
                        </g>
                      )}

                      {/* 19. Legendary Knight Steel Cuirass & Velvet Cape */}
                      {config.outfitId === 'pixel_hero_armor' && (
                        <g id="scene-outfit-hero-armor">
                          {/* Royal Violet Cape Draped Behind Shoulders */}
                          <rect x={frogX - 4} y={frogY + 8} width="24" height="14" fill="#3B0764" />
                          <rect x={frogX - 3} y={frogY + 8} width="22" height="13" fill="#6B21A8" />
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="12" fill="#7C3AED" />
                          {/* 5-Tone Polished Steel Breastplate */}
                          <rect x={frogX - 1} y={frogY + 9} width="18" height="11" fill="#334155" />
                          <rect x={frogX} y={frogY + 9} width="16" height="10" fill="#475569" />
                          <rect x={frogX + 1} y={frogY + 10} width="14" height="8" fill="#94A3B8" />
                          <rect x={frogX + 2} y={frogY + 10} width="12" height="7" fill="#CBD5E1" />
                          {/* Metallic Specular Glint */}
                          <rect x={frogX + 2} y={frogY + 10} width="3" height="2" fill="#F8FAFC" />
                          <rect x={frogX + 2} y={frogY + 10} width="1" height="1" fill="#FFFFFF" />
                          {/* Golden Hero Crest Emblazoned on Chest */}
                          <rect x={frogX + 6} y={frogY + 11} width="4" height="4" fill="#78350F" />
                          <rect x={frogX + 6} y={frogY + 11} width="4" height="3" fill="#FACC15" />
                          <rect x={frogX + 7} y={frogY + 10} width="2" height="6" fill="#FEF08A" />
                          {/* Heavy Riveted Leather Belt with Gold Ring Buckle */}
                          <rect x={frogX - 1} y={frogY + 16} width="18" height="3" fill="#451A03" />
                          <rect x={frogX} y={frogY + 16} width="16" height="2" fill="#78350F" />
                          <rect x={frogX + 6} y={frogY + 15} width="4" height="4" fill="#FACC15" />
                          <rect x={frogX + 7} y={frogY + 16} width="2" height="2" fill="#78350F" />
                        </g>
                      )}

                      {/* 20. Pro Gamer Retro 88 Jersey */}
                      {config.outfitId === 'retro_esports_jersey' && (
                        <g id="scene-outfit-esports-jersey">
                          {/* Midnight Obsidian Athletic Mesh Body */}
                          <rect x={frogX - 3} y={frogY + 8} width="22" height="13" fill="#020617" />
                          <rect x={frogX - 2} y={frogY + 8} width="20" height="12" fill="#0F172A" />
                          <rect x={frogX - 1} y={frogY + 9} width="18" height="11" fill="#1E293B" />
                          <rect x={frogX} y={frogY + 9} width="16" height="9" fill="#334155" />
                          {/* High-Visibility Neon Cyan Racing Shoulder Stripes */}
                          <rect x={frogX - 4} y={frogY + 8} width="3" height="12" fill="#0891B2" />
                          <rect x={frogX - 3} y={frogY + 8} width="2" height="11" fill="#06B6D4" />
                          <rect x={frogX + 17} y={frogY + 8} width="3" height="12" fill="#0891B2" />
                          <rect x={frogX + 17} y={frogY + 8} width="2" height="11" fill="#06B6D4" />
                          {/* Magenta Ribbed V-Neck Collar */}
                          <rect x={frogX + 4} y={frogY + 8} width="8" height="2" fill="#BE123C" />
                          <rect x={frogX + 6} y={frogY + 9} width="4" height="2" fill="#EC4899" />
                          {/* Golden Varsity '88' Print on Chest with Drop Shadow */}
                          <rect x={frogX + 3} y={frogY + 11} width="10" height="6" fill="#09090B" />
                          <rect x={frogX + 4} y={frogY + 11} width="8" height="5" fill="#FACC15" />
                          <rect x={frogX + 5} y={frogY + 11} width="6" height="1" fill="#FEF08A" />
                          <rect x={frogX + 6} y={frogY + 12} width="4" height="3" fill="#0F172A" />
                          <rect x={frogX + 7} y={frogY + 13} width="2" height="1" fill="#FACC15" />
                        </g>
                      )}

                      {/* 21. Mountain Ranger Scout Parka */}
                      {config.outfitId === 'field_scout_parka' && (
                        <g id="scene-outfit-scout-parka">
                          {/* Heavy Forest Pine Green Canvas Shell */}
                          <rect x={frogX - 4} y={frogY + 8} width="24" height="13" fill="#0F260C" />
                          <rect x={frogX - 3} y={frogY + 8} width="22" height="13" fill="#14532D" />
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="12" fill="#166534" />
                          <rect x={frogX - 1} y={frogY + 9} width="18" height="11" fill="#15803D" />
                          <rect x={frogX} y={frogY + 10} width="16" height="9" fill="#22C55E" />
                          {/* Khaki / Tan Sherpa Storm Collar */}
                          <rect x={frogX - 2} y={frogY + 7} width="20" height="3" fill="#78350F" />
                          <rect x={frogX - 1} y={frogY + 7} width="18" height="2" fill="#B45309" />
                          <rect x={frogX} y={frogY + 8} width="16" height="2" fill="#FEF3C7" />
                          {/* Front Storm Flap with Metal Zipper & Brass Snaps */}
                          <rect x={frogX + 7} y={frogY + 9} width="2" height="11" fill="#0F172A" />
                          <rect x={frogX + 7} y={frogY + 10} width="1" height="9" fill="#FACC15" />
                          {/* Embroidered Scout Badges (Campfire & Mountain Peak) */}
                          <rect x={frogX + 2} y={frogY + 11} width="4" height="4" fill="#78350F" />
                          <rect x={frogX + 2} y={frogY + 11} width="3" height="3" fill="#FEF08A" />
                          <rect x={frogX + 3} y={frogY + 12} width="2" height="2" fill="#F59E0B" />
                          <rect x={frogX + 10} y={frogY + 11} width="4" height="4" fill="#1E293B" />
                          <rect x={frogX + 11} y={frogY + 11} width="3" height="3" fill="#38BDF8" />
                          <rect x={frogX + 12} y={frogY + 11} width="2" height="1" fill="#FFFFFF" />
                          {/* Bellows Cargo Pockets with Flaps */}
                          <rect x={frogX - 1} y={frogY + 15} width="5" height="4" fill="#0F260C" />
                          <rect x={frogX - 1} y={frogY + 15} width="5" height="1" fill="#14532D" />
                          <rect x={frogX + 12} y={frogY + 15} width="5" height="4" fill="#0F260C" />
                          <rect x={frogX + 12} y={frogY + 15} width="5" height="1" fill="#14532D" />
                        </g>
                      )}

                      {/* 22. Buffalo Plaid & Sherpa Camp Vest */}
                      {config.outfitId === 'flannel_camp_vest' && (
                        <g id="scene-outfit-flannel-vest">
                          {/* Red & Black Buffalo Plaid Long Sleeves */}
                          <rect x={frogX - 4} y={frogY + 8} width="4" height="12" fill="#7F1D1D" />
                          <rect x={frogX - 3} y={frogY + 8} width="3" height="11" fill="#DC2626" />
                          <rect x={frogX - 4} y={frogY + 9} width="4" height="3" fill="#18181B" />
                          <rect x={frogX - 4} y={frogY + 14} width="4" height="3" fill="#18181B" />
                          <rect x={frogX + 16} y={frogY + 8} width="4" height="12" fill="#7F1D1D" />
                          <rect x={frogX + 16} y={frogY + 8} width="3" height="11" fill="#DC2626" />
                          <rect x={frogX + 16} y={frogY + 9} width="4" height="3" fill="#18181B" />
                          <rect x={frogX + 16} y={frogY + 14} width="4" height="3" fill="#18181B" />
                          {/* Puffy Tan / Chestnut Sherpa Camp Vest Body */}
                          <rect x={frogX - 2} y={frogY + 8} width="20" height="12" fill="#451A03" />
                          <rect x={frogX - 1} y={frogY + 8} width="18" height="12" fill="#78350F" />
                          <rect x={frogX} y={frogY + 9} width="16" height="11" fill="#B45309" />
                          <rect x={frogX + 1} y={frogY + 9} width="14" height="10" fill="#D97706" />
                          {/* Fluffy Warm Sherpa Fleece Collar */}
                          <rect x={frogX + 1} y={frogY + 7} width="14" height="3" fill="#FEF3C7" />
                          <rect x={frogX + 2} y={frogY + 8} width="12" height="2" fill="#FFFFFF" />
                          {/* Three Heavy Brass Snap Buttons */}
                          <rect x={frogX + 7} y={frogY + 10} width="2" height="2" fill="#78350F" />
                          <rect x={frogX + 7} y={frogY + 10} width="2" height="1" fill="#FACC15" />
                          <rect x={frogX + 7} y={frogY + 13} width="2" height="2" fill="#78350F" />
                          <rect x={frogX + 7} y={frogY + 13} width="2" height="1" fill="#FACC15" />
                          <rect x={frogX + 7} y={frogY + 16} width="2" height="2" fill="#78350F" />
                          <rect x={frogX + 7} y={frogY + 16} width="2" height="1" fill="#FACC15" />
                        </g>
                      )}

                      {/* 23. Down Mummy Sleeping Bag Cocoon */}
                      {config.outfitId === 'cozy_sleeping_bag' && (
                        <g id="scene-outfit-sleeping-bag">
                          {/* Snug Quilted Mummy Sleeping Bag Cocoon */}
                          <rect x={frogX - 5} y={frogY + 8} width="26" height="15" fill="#0C4A6E" />
                          <rect x={frogX - 4} y={frogY + 8} width="24" height="15" fill="#0369A1" />
                          <rect x={frogX - 3} y={frogY + 9} width="22" height="14" fill="#0284C7" />
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="13" fill="#38BDF8" />
                          {/* Drawstring Neck Collar with Cord Toggle */}
                          <rect x={frogX - 3} y={frogY + 7} width="22" height="3" fill="#075985" />
                          <rect x={frogX - 2} y={frogY + 7} width="20" height="2" fill="#38BDF8" />
                          <rect x={frogX + 7} y={frogY + 7} width="2" height="3" fill="#FACC15" />
                          <rect x={frogX + 7} y={frogY + 7} width="1" height="1" fill="#FEF08A" />
                          {/* Quilted Down Baffle Stitch Lines */}
                          <rect x={frogX - 3} y={frogY + 11} width="22" height="1" fill="#075985" />
                          <rect x={frogX - 3} y={frogY + 14} width="22" height="1" fill="#075985" />
                          <rect x={frogX - 3} y={frogY + 17} width="22" height="1" fill="#075985" />
                          <rect x={frogX - 3} y={frogY + 20} width="22" height="1" fill="#075985" />
                          {/* Cozy Tangerine Interior Flap Folded Over */}
                          <rect x={frogX + 3} y={frogY + 9} width="10" height="3" fill="#C2410C" />
                          <rect x={frogX + 4} y={frogY + 9} width="8" height="2" fill="#EA580C" />
                          <rect x={frogX + 5} y={frogY + 10} width="6" height="1" fill="#FB923C" />
                          {/* Embroidered Campfire Patch on Lower Baffle */}
                          <rect x={frogX - 1} y={frogY + 12} width="3" height="2" fill="#FBBF24" />
                        </g>
                      )}

                      {/* GLASSES / FACE ACCESSORY LAYER (Cozy 16-bit / 32-bit Pixel Art) */}

                      {/* 1. Vintage Wire-Rimmed Reading Spectacles */}
                      {config.glassesId === 'reading' && (
                        <g id="scene-glasses-reading">
                          {/* Tortoiseshell / Brass Temples */}
                          <rect x={frogX - 2} y={frogY + 6} width="3" height="1" fill="#78350F" />
                          <rect x={frogX + 15} y={frogY + 6} width="3" height="1" fill="#78350F" />
                          {/* Left Round Spectacle Frame */}
                          <rect x={frogX} y={frogY + 5} width="7" height="6" fill="#78350F" />
                          <rect x={frogX + 1} y={frogY + 5} width="5" height="6" fill="#B45309" />
                          <rect x={frogX + 1} y={frogY + 6} width="5" height="4" fill="#FDE68A" />
                          <rect x={frogX + 2} y={frogY + 6} width="3" height="4" fill="#BAE6FD" />
                          <rect x={frogX + 2} y={frogY + 6} width="2" height="2" fill="#E0F2FE" />
                          <rect x={frogX + 2} y={frogY + 6} width="1" height="1" fill="#FFFFFF" />
                          {/* Curved Bridge */}
                          <rect x={frogX + 7} y={frogY + 6} width="2" height="2" fill="#78350F" />
                          <rect x={frogX + 7} y={frogY + 6} width="2" height="1" fill="#FACC15" />
                          {/* Right Round Spectacle Frame */}
                          <rect x={frogX + 9} y={frogY + 5} width="7" height="6" fill="#78350F" />
                          <rect x={frogX + 10} y={frogY + 5} width="5" height="6" fill="#B45309" />
                          <rect x={frogX + 10} y={frogY + 6} width="5" height="4" fill="#FDE68A" />
                          <rect x={frogX + 11} y={frogY + 6} width="3" height="4" fill="#BAE6FD" />
                          <rect x={frogX + 11} y={frogY + 6} width="2" height="2" fill="#E0F2FE" />
                          <rect x={frogX + 11} y={frogY + 6} width="1" height="1" fill="#FFFFFF" />
                        </g>
                      )}

                      {/* 2. Cool Wayfarer Sunglasses */}
                      {config.glassesId === 'sunglasses' && (
                        <g id="scene-glasses-sunglasses">
                          {/* Pitch Black Acetate Frame with Shadow */}
                          <rect x={frogX - 2} y={frogY + 5} width="9" height="6" fill="#09090B" />
                          <rect x={frogX + 9} y={frogY + 5} width="9" height="6" fill="#09090B" />
                          <rect x={frogX + 7} y={frogY + 5} width="2" height="3" fill="#09090B" />
                          {/* Lens Rim Highlights */}
                          <rect x={frogX - 1} y={frogY + 6} width="7" height="4" fill="#18181B" />
                          <rect x={frogX + 10} y={frogY + 6} width="7" height="4" fill="#18181B" />
                          {/* Silver Corner Rivet Studs */}
                          <rect x={frogX - 2} y={frogY + 5} width="1" height="1" fill="#E2E8F0" />
                          <rect x={frogX + 17} y={frogY + 5} width="1" height="1" fill="#E2E8F0" />
                          {/* Bold Diagonal White Glare Stripes */}
                          <rect x={frogX} y={frogY + 6} width="2" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 1} y={frogY + 7} width="2" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 11} y={frogY + 6} width="2" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 12} y={frogY + 7} width="2" height="1" fill="#FFFFFF" />
                        </g>
                      )}

                      {/* 3. Gilded Aristocrat Monocle & Hanging Chain */}
                      {config.glassesId === 'monocle' && (
                        <g id="scene-glasses-monocle">
                          {/* Right Eye Gold-Rimmed Monocle */}
                          <rect x={frogX + 9} y={frogY + 5} width="7" height="6" fill="#78350F" />
                          <rect x={frogX + 10} y={frogY + 5} width="5" height="6" fill="#CA8A04" />
                          <rect x={frogX + 10} y={frogY + 6} width="5" height="4" fill="#FACC15" />
                          <rect x={frogX + 11} y={frogY + 6} width="3" height="4" fill="#BAE6FD" />
                          <rect x={frogX + 11} y={frogY + 6} width="2" height="2" fill="#E0F2FE" />
                          <rect x={frogX + 11} y={frogY + 6} width="1" height="1" fill="#FFFFFF" />
                          {/* Golden Monocle Side Hasp */}
                          <rect x={frogX + 16} y={frogY + 7} width="1" height="2" fill="#FACC15" />
                          {/* Draping Golden Link Chain */}
                          <rect x={frogX + 16} y={frogY + 9} width="1" height="1" fill="#CA8A04" />
                          <rect x={frogX + 17} y={frogY + 10} width="1" height="2" fill="#FACC15" />
                          <rect x={frogX + 16} y={frogY + 12} width="1" height="2" fill="#CA8A04" />
                          <rect x={frogX + 15} y={frogY + 14} width="1" height="2" fill="#FACC15" />
                          <rect x={frogX + 14} y={frogY + 16} width="2" height="2" fill="#FACC15" />
                          <rect x={frogX + 14} y={frogY + 16} width="1" height="1" fill="#FEF08A" />
                        </g>
                      )}

                      {/* 4. Twinkle Star Cheek Decals & Stardust */}
                      {config.glassesId === 'blush_stars' && (
                        <g id="scene-glasses-blush-stars">
                          {/* Radiant Rosy Cheek Patches */}
                          <rect x={frogX - 2} y={frogY + 9} width="4" height="3" fill="#FB7185" opacity="0.85" />
                          <rect x={frogX - 1} y={frogY + 10} width="2" height="1" fill="#F43F5E" />
                          <rect x={frogX + 14} y={frogY + 9} width="4" height="3" fill="#FB7185" opacity="0.85" />
                          <rect x={frogX + 15} y={frogY + 10} width="2" height="1" fill="#F43F5E" />
                          {/* Left Golden 4-Point Star Decal */}
                          <rect x={frogX - 1} y={frogY + 9} width="2" height="2" fill="#FACC15" />
                          <rect x={frogX - 1} y={frogY + 8} width="2" height="1" fill="#FEF08A" />
                          <rect x={frogX - 1} y={frogY + 11} width="2" height="1" fill="#FEF08A" />
                          <rect x={frogX - 2} y={frogY + 9} width="1" height="2" fill="#FEF08A" />
                          <rect x={frogX + 1} y={frogY + 9} width="1" height="2" fill="#FEF08A" />
                          <rect x={frogX} y={frogY + 9} width="1" height="1" fill="#FFFFFF" />
                          {/* Right Golden 4-Point Star Decal */}
                          <rect x={frogX + 15} y={frogY + 9} width="2" height="2" fill="#FACC15" />
                          <rect x={frogX + 15} y={frogY + 8} width="2" height="1" fill="#FEF08A" />
                          <rect x={frogX + 15} y={frogY + 11} width="2" height="1" fill="#FEF08A" />
                          <rect x={frogX + 14} y={frogY + 9} width="1" height="2" fill="#FEF08A" />
                          <rect x={frogX + 17} y={frogY + 9} width="1" height="2" fill="#FEF08A" />
                          <rect x={frogX + 15} y={frogY + 9} width="1" height="1" fill="#FFFFFF" />
                          {/* Drifting Stardust Specks */}
                          <rect x={frogX + 7} y={frogY + 3 - (animTick % 2)} width="2" height="2" fill="#FEF08A" />
                        </g>
                      )}

                      {/* 5. Shōjo Anime Diamond Sparkles */}
                      {config.glassesId === 'sparkles' && (
                        <g id="scene-glasses-sparkles">
                          {/* Left Eye Floating Diamond Sparkle */}
                          <rect x={frogX - 4} y={frogY + 2 - (animTick % 2)} width="3" height="3" fill="#FACC15" />
                          <rect x={frogX - 3} y={frogY + 1 - (animTick % 2)} width="1" height="5" fill="#FEF08A" />
                          <rect x={frogX - 5} y={frogY + 3 - (animTick % 2)} width="5" height="1" fill="#FEF08A" />
                          <rect x={frogX - 3} y={frogY + 3 - (animTick % 2)} width="1" height="1" fill="#FFFFFF" />
                          {/* Right Eye Floating Diamond Sparkle */}
                          <rect x={frogX + 17} y={frogY + 3 + (animTick % 2)} width="3" height="3" fill="#FACC15" />
                          <rect x={frogX + 18} y={frogY + 2 + (animTick % 2)} width="1" height="5" fill="#FEF08A" />
                          <rect x={frogX + 16} y={frogY + 4 + (animTick % 2)} width="5" height="1" fill="#FEF08A" />
                          <rect x={frogX + 18} y={frogY + 4 + (animTick % 2)} width="1" height="1" fill="#FFFFFF" />
                          {/* Overhead Crown Sparkle */}
                          <rect x={frogX + 7} y={frogY - 4} width="2" height="2" fill="#FACC15" />
                          <rect x={frogX + 7} y={frogY - 5} width="2" height="4" fill="#FEF08A" />
                          <rect x={frogX + 6} y={frogY - 4} width="4" height="2" fill="#FEF08A" />
                          <rect x={frogX + 7} y={frogY - 4} width="1" height="1" fill="#FFFFFF" />
                        </g>
                      )}

                      {/* 6. Pirate Swashbuckler Stitched Leather Eyepatch */}
                      {config.glassesId === 'eyepatch' && (
                        <g id="scene-glasses-eyepatch">
                          {/* Diagonal Leather Strap with Buckle */}
                          <rect x={frogX - 3} y={frogY + 4} width="22" height="1" fill="#292524" />
                          <rect x={frogX - 2} y={frogY + 5} width="20" height="1" fill="#451A03" />
                          <rect x={frogX + 14} y={frogY + 4} width="2" height="2" fill="#FACC15" />
                          {/* Heavy Black Leather Patch over Left Eye */}
                          <rect x={frogX - 1} y={frogY + 5} width="8" height="6" fill="#09090B" />
                          <rect x={frogX} y={frogY + 5} width="6" height="6" fill="#1C1917" />
                          <rect x={frogX} y={frogY + 6} width="6" height="4" fill="#292524" />
                          {/* Silver Cross Stitches on Patch */}
                          <rect x={frogX + 2} y={frogY + 7} width="2" height="2" fill="#E2E8F0" />
                          <rect x={frogX + 2} y={frogY + 6} width="2" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 2} y={frogY + 9} width="2" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 1} y={frogY + 7} width="1" height="2" fill="#FFFFFF" />
                          <rect x={frogX + 4} y={frogY + 7} width="1" height="2" fill="#FFFFFF" />
                        </g>
                      )}

                      {/* 7. Forest Country Freckles & Peachy Sun-Kissed Blush */}
                      {config.glassesId === 'forest_blush_freckles' && (
                        <g id="scene-glasses-freckles">
                          {/* Sun-Kissed Peachy Cheeks */}
                          <rect x={frogX - 2} y={frogY + 9} width="4" height="3" fill="#F87171" opacity="0.65" />
                          <rect x={frogX - 1} y={frogY + 10} width="3" height="2" fill="#FCA5A5" opacity="0.8" />
                          <rect x={frogX + 14} y={frogY + 9} width="4" height="3" fill="#F87171" opacity="0.65" />
                          <rect x={frogX + 14} y={frogY + 10} width="3" height="2" fill="#FCA5A5" opacity="0.8" />
                          {/* Left Freckle Constellation */}
                          <rect x={frogX} y={frogY + 9} width="1" height="1" fill="#78350F" />
                          <rect x={frogX - 1} y={frogY + 11} width="1" height="1" fill="#451A03" />
                          <rect x={frogX + 2} y={frogY + 10} width="1" height="1" fill="#78350F" />
                          {/* Nose Bridge Freckles */}
                          <rect x={frogX + 6} y={frogY + 10} width="1" height="1" fill="#78350F" />
                          <rect x={frogX + 9} y={frogY + 10} width="1" height="1" fill="#78350F" />
                          {/* Right Freckle Constellation */}
                          <rect x={frogX + 14} y={frogY + 10} width="1" height="1" fill="#78350F" />
                          <rect x={frogX + 16} y={frogY + 9} width="1" height="1" fill="#451A03" />
                          <rect x={frogX + 17} y={frogY + 11} width="1" height="1" fill="#78350F" />
                        </g>
                      )}

                      {/* 8. Timber Wolf Snarl & Beast Fangs */}
                      {config.glassesId === 'wolf_snarl_fangs' && (
                        <g id="scene-glasses-fangs">
                          {/* Fierce Snarl Lip Crease */}
                          <rect x={frogX + 6} y={frogY + 9} width="4" height="1" fill="#0F172A" />
                          <rect x={frogX + 5} y={frogY + 10} width="1" height="1" fill="#0F172A" />
                          <rect x={frogX + 10} y={frogY + 10} width="1" height="1" fill="#0F172A" />
                          {/* Left Sharp Ivory Fang */}
                          <rect x={frogX + 4} y={frogY + 10} width="2" height="4" fill="#0F172A" />
                          <rect x={frogX + 4} y={frogY + 10} width="2" height="3" fill="#FFFFFF" />
                          <rect x={frogX + 5} y={frogY + 13} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 4} y={frogY + 11} width="1" height="2" fill="#E2E8F0" />
                          {/* Right Sharp Ivory Fang */}
                          <rect x={frogX + 10} y={frogY + 10} width="2" height="4" fill="#0F172A" />
                          <rect x={frogX + 10} y={frogY + 10} width="2" height="3" fill="#FFFFFF" />
                          <rect x={frogX + 10} y={frogY + 13} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 11} y={frogY + 11} width="1" height="2" fill="#E2E8F0" />
                          {/* Warrior Crimson Battle Scratches on Cheek */}
                          <rect x={frogX - 2} y={frogY + 9} width="3" height="1" fill="#DC2626" />
                          <rect x={frogX - 3} y={frogY + 11} width="4" height="1" fill="#DC2626" />
                          <rect x={frogX + 15} y={frogY + 9} width="3" height="1" fill="#DC2626" />
                          <rect x={frogX + 15} y={frogY + 11} width="4" height="1" fill="#DC2626" />
                        </g>
                      )}

                      {/* 9. Spicy Wasabi Sparkle & Shimmering Glints */}
                      {config.glassesId === 'wasabi_sparkle' && (
                        <g id="scene-glasses-wasabi">
                          {/* Glowing Wasabi Lime Eye Glints */}
                          <rect x={frogX + 2} y={frogY + 6} width="2" height="2" fill="#84CC16" />
                          <rect x={frogX + 2} y={frogY + 6} width="1" height="1" fill="#BEF264" />
                          <rect x={frogX + 11} y={frogY + 6} width="2" height="2" fill="#84CC16" />
                          <rect x={frogX + 11} y={frogY + 6} width="1" height="1" fill="#BEF264" />
                          {/* Zesty Wasabi Cheeks */}
                          <rect x={frogX - 2} y={frogY + 9} width="4" height="3" fill="#65A30D" opacity="0.8" />
                          <rect x={frogX - 1} y={frogY + 10} width="2" height="1" fill="#A3E635" />
                          <rect x={frogX + 14} y={frogY + 9} width="4" height="3" fill="#65A30D" opacity="0.8" />
                          <rect x={frogX + 15} y={frogY + 10} width="2" height="1" fill="#A3E635" />
                          {/* Floating Spicy Lime Sparkles */}
                          <rect x={frogX + 7} y={frogY - (animTick % 2 === 0 ? 3 : 5)} width="2" height="2" fill="#BEF264" />
                          <rect x={frogX - 4} y={frogY + 3} width="2" height="2" fill="#A3E635" />
                          <rect x={frogX + 18} y={frogY + 2} width="2" height="2" fill="#A3E635" />
                        </g>
                      )}

                      {/* 10. Konbini Cashier & Esports Headset */}
                      {config.glassesId === 'scanner_headset' && (
                        <g id="scene-glasses-headset">
                          {/* Padded Obsidian Headband Arc */}
                          <rect x={frogX - 2} y={frogY + 2} width="2" height="5" fill="#0F172A" />
                          <rect x={frogX} y={frogY} width="16" height="2" fill="#0F172A" />
                          <rect x={frogX + 1} y={frogY} width="14" height="1" fill="#334155" />
                          {/* Left Earphone Cushion & Cyan Outer Plate */}
                          <rect x={frogX - 4} y={frogY + 5} width="4" height="6" fill="#0F172A" />
                          <rect x={frogX - 3} y={frogY + 6} width="3" height="4" fill="#0284C7" />
                          <rect x={frogX - 3} y={frogY + 6} width="1" height="2" fill="#38BDF8" />
                          {/* Articulated Boom Mic Arm */}
                          <rect x={frogX - 3} y={frogY + 11} width="2" height="2" fill="#0F172A" />
                          <rect x={frogX - 1} y={frogY + 12} width="4" height="2" fill="#1E293B" />
                          <rect x={frogX + 3} y={frogY + 13} width="3" height="2" fill="#334155" />
                          {/* Glowing Dual-State LED Mic Tip */}
                          {animTick % 2 === 0 ? (
                            <>
                              <rect x={frogX + 6} y={frogY + 13} width="2" height="2" fill="#10B981" />
                              <rect x={frogX + 6} y={frogY + 13} width="1" height="1" fill="#A7F3D0" />
                            </>
                          ) : (
                            <>
                              <rect x={frogX + 6} y={frogY + 13} width="2" height="2" fill="#EF4444" />
                              <rect x={frogX + 6} y={frogY + 13} width="1" height="1" fill="#FECACA" />
                            </>
                          )}
                        </g>
                      )}

                      {/* 11. Konbini Kawaii Strawberry Blush & Bandage Sticker */}
                      {config.glassesId === 'konbini_blush' && (
                        <g id="scene-glasses-blush">
                          {/* Sweet Strawberry Rosy Cheeks */}
                          <rect x={frogX - 3} y={frogY + 9} width="5" height="4" fill="#F43F5E" opacity="0.85" />
                          <rect x={frogX - 2} y={frogY + 10} width="3" height="2" fill="#FB7185" />
                          <rect x={frogX + 14} y={frogY + 9} width="5" height="4" fill="#F43F5E" opacity="0.85" />
                          <rect x={frogX + 15} y={frogY + 10} width="3" height="2" fill="#FB7185" />
                          {/* Left Pastel Bandage Sticker with Heart */}
                          <rect x={frogX - 2} y={frogY + 8} width="3" height="2" fill="#FEF08A" />
                          <rect x={frogX - 1} y={frogY + 8} width="1" height="2" fill="#F472B6" />
                          {/* Right Sparkle Accent */}
                          <rect x={frogX + 16} y={frogY + 8} width="2" height="2" fill="#FEF08A" />
                          <rect x={frogX + 16} y={frogY + 8} width="1" height="1" fill="#FFFFFF" />
                        </g>
                      )}

                      {/* 12. Cyberpunk 8-Bit Stepped Pixel Sunglasses */}
                      {config.glassesId === 'cyber_pixel_shades' && (
                        <g id="scene-glasses-cyber-shades">
                          {/* Stepped Black Pixel Frames */}
                          <rect x={frogX - 3} y={frogY + 5} width="9" height="3" fill="#09090B" />
                          <rect x={frogX - 2} y={frogY + 8} width="7" height="3" fill="#09090B" />
                          <rect x={frogX + 10} y={frogY + 5} width="9" height="3" fill="#09090B" />
                          <rect x={frogX + 11} y={frogY + 8} width="7" height="3" fill="#09090B" />
                          <rect x={frogX + 6} y={frogY + 5} width="4" height="2" fill="#09090B" />
                          {/* White Stepped Specular Glare */}
                          <rect x={frogX - 2} y={frogY + 6} width="2" height="1" fill="#FFFFFF" />
                          <rect x={frogX - 1} y={frogY + 7} width="2" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 11} y={frogY + 6} width="2" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 12} y={frogY + 7} width="2" height="1" fill="#FFFFFF" />
                          {/* Neon Cyan Cyber Underglow Edge */}
                          <rect x={frogX - 2} y={frogY + 10} width="3" height="1" fill="#06B6D4" />
                          <rect x={frogX + 13} y={frogY + 10} width="3" height="1" fill="#06B6D4" />
                          <rect x={frogX - 1} y={frogY + 10} width="1" height="1" fill="#22D3EE" />
                          <rect x={frogX + 14} y={frogY + 10} width="1" height="1" fill="#22D3EE" />
                        </g>
                      )}

                      {/* 13. Retro Arcade Hypno-Dizzy Spiral Eyes & Stars */}
                      {config.glassesId === 'game_over_dizzy' && (
                        <g id="scene-glasses-dizzy">
                          {/* Left Hypnotic Swirl Eye */}
                          <rect x={frogX} y={frogY + 4} width="7" height="7" fill="#CA8A04" />
                          <rect x={frogX + 1} y={frogY + 5} width="5" height="5" fill="#FACC15" />
                          <rect x={frogX + 2} y={frogY + 5} width="3" height="4" fill="#0F172A" />
                          <rect x={frogX + 3} y={frogY + 6} width="2" height="2" fill="#EC4899" />
                          <rect x={frogX + 2} y={frogY + 6} width="1" height="1" fill="#FDE047" />
                          {/* Right Hypnotic Swirl Eye */}
                          <rect x={frogX + 9} y={frogY + 4} width="7" height="7" fill="#CA8A04" />
                          <rect x={frogX + 10} y={frogY + 5} width="5" height="5" fill="#FACC15" />
                          <rect x={frogX + 11} y={frogY + 5} width="3" height="4" fill="#0F172A" />
                          <rect x={frogX + 12} y={frogY + 6} width="2" height="2" fill="#EC4899" />
                          <rect x={frogX + 11} y={frogY + 6} width="1" height="1" fill="#FDE047" />
                          {/* Orbiting Cartoon Dizzy Stars Overhead */}
                          {animTick % 2 === 0 ? (
                            <>
                              <rect x={frogX + 6} y={frogY + 1} width="3" height="3" fill="#FACC15" />
                              <rect x={frogX + 7} y={frogY + 1} width="1" height="3" fill="#FEF08A" />
                              <rect x={frogX - 4} y={frogY + 3} width="2" height="2" fill="#FDE047" />
                              <rect x={frogX + 18} y={frogY + 2} width="2" height="2" fill="#FDE047" />
                            </>
                          ) : (
                            <>
                              <rect x={frogX + 8} y={frogY - 1} width="3" height="3" fill="#FACC15" />
                              <rect x={frogX + 9} y={frogY - 1} width="1" height="3" fill="#FEF08A" />
                              <rect x={frogX - 3} y={frogY + 1} width="2" height="2" fill="#FDE047" />
                              <rect x={frogX + 17} y={frogY + 4} width="2" height="2" fill="#FDE047" />
                            </>
                          )}
                        </g>
                      )}

                      {/* 14. Campfire Warm Ember Glow & Floating Sparks */}
                      {config.glassesId === 'campfire_warm_glow' && (
                        <g id="scene-glasses-campfire-glow">
                          {/* 4-Tone Radiating Campfire Cheeks */}
                          <rect x={frogX - 3} y={frogY + 8} width="6" height="5" fill="#C2410C" opacity="0.65" />
                          <rect x={frogX - 2} y={frogY + 9} width="5" height="4" fill="#EA580C" opacity="0.85" />
                          <rect x={frogX - 1} y={frogY + 10} width="3" height="2" fill="#F97316" />
                          <rect x={frogX} y={frogY + 10} width="1" height="1" fill="#FDE047" />
                          <rect x={frogX + 13} y={frogY + 8} width="6" height="5" fill="#C2410C" opacity="0.65" />
                          <rect x={frogX + 13} y={frogY + 9} width="5" height="4" fill="#EA580C" opacity="0.85" />
                          <rect x={frogX + 14} y={frogY + 10} width="3" height="2" fill="#F97316" />
                          <rect x={frogX + 15} y={frogY + 10} width="1" height="1" fill="#FDE047" />
                          {/* Animated Drifting Fire Embers & Twinkles */}
                          <rect x={frogX + 7} y={frogY - (animTick % 2 === 0 ? 3 : 5)} width="2" height="2" fill="#F59E0B" />
                          <rect x={frogX + 7} y={frogY - (animTick % 2 === 0 ? 3 : 5)} width="1" height="1" fill="#FEF08A" />
                          <rect x={frogX - 4} y={frogY + 2 - (animTick % 2 === 0 ? 2 : 0)} width="2" height="2" fill="#EF4444" />
                          <rect x={frogX - 4} y={frogY + 2 - (animTick % 2 === 0 ? 2 : 0)} width="1" height="1" fill="#FDE047" />
                          <rect x={frogX + 19} y={frogY + 1 - (animTick % 2 === 0 ? 0 : 2)} width="2" height="2" fill="#FACC15" />
                        </g>
                      )}

                      {/* 15. Field Scout Brass & Olive Binoculars with Leather Strap */}
                      {config.glassesId === 'explorer_binoculars' && (
                        <g id="scene-glasses-binoculars">
                          {/* Braided Leather Neck Strap */}
                          <rect x={frogX} y={frogY + 5} width="16" height="1" fill="#451A03" />
                          <rect x={frogX + 2} y={frogY + 6} width="1" height="4" fill="#78350F" />
                          <rect x={frogX + 13} y={frogY + 6} width="1" height="4" fill="#78350F" />
                          {/* Dual Forest Canvas / Brass Binoculars Body */}
                          <rect x={frogX + 1} y={frogY + 9} width="6" height="8" fill="#14532D" />
                          <rect x={frogX + 2} y={frogY + 9} width="4" height="7" fill="#166534" />
                          <rect x={frogX + 9} y={frogY + 9} width="6" height="8" fill="#14532D" />
                          <rect x={frogX + 10} y={frogY + 9} width="4" height="7" fill="#166534" />
                          {/* Heavy Brass Objective Rims & Focus Wheel */}
                          <rect x={frogX + 1} y={frogY + 16} width="6" height="2" fill="#78350F" />
                          <rect x={frogX + 2} y={frogY + 16} width="4" height="1" fill="#FACC15" />
                          <rect x={frogX + 9} y={frogY + 16} width="6" height="2" fill="#78350F" />
                          <rect x={frogX + 10} y={frogY + 16} width="4" height="1" fill="#FACC15" />
                          <rect x={frogX + 7} y={frogY + 11} width="2" height="3" fill="#78350F" />
                          <rect x={frogX + 7} y={frogY + 11} width="2" height="1" fill="#FACC15" />
                          {/* Crystalline Glass Objective Lens with White Glare */}
                          <rect x={frogX + 2} y={frogY + 12} width="4" height="3" fill="#0284C7" />
                          <rect x={frogX + 3} y={frogY + 12} width="2" height="2" fill="#38BDF8" />
                          <rect x={frogX + 3} y={frogY + 12} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 10} y={frogY + 12} width="4" height="3" fill="#0284C7" />
                          <rect x={frogX + 11} y={frogY + 12} width="2" height="2" fill="#38BDF8" />
                          <rect x={frogX + 11} y={frogY + 12} width="1" height="1" fill="#FFFFFF" />
                        </g>
                      )}

                      {/* ACTIVITY PROPS (16-BIT / 32-BIT COZY PIXEL ART) */}

                      {/* 1. Reading Journal / Adventure Tome */}
                      {config.activityId === 'reading' && (
                        <g id="scene-prop-reading">
                          {/* Rich Burgundy & Gold Filigree Leather Cover */}
                          <rect x={frogX + 1} y={frogY + 11} width="16" height="10" fill="#4C0519" />
                          <rect x={frogX + 2} y={frogY + 12} width="14" height="8" fill="#881337" />
                          {/* Aged Cream Parchment Pages (Left & Right Spreads) */}
                          <rect x={frogX + 2} y={frogY + 12} width="6" height="7" fill="#FEF3C7" />
                          <rect x={frogX + 10} y={frogY + 12} width="6" height="7" fill="#FEF3C7" />
                          {/* Inner Spine Shadow */}
                          <rect x={frogX + 8} y={frogY + 11} width="2" height="9" fill="#4C0519" />
                          <rect x={frogX + 8} y={frogY + 12} width="2" height="8" fill="#9F1239" />
                          {/* Miniature Script Runes / Text Lines */}
                          <rect x={frogX + 3} y={frogY + 14} width="4" height="1" fill="#78350F" opacity="0.7" />
                          <rect x={frogX + 3} y={frogY + 16} width="3" height="1" fill="#78350F" opacity="0.7" />
                          <rect x={frogX + 11} y={frogY + 14} width="4" height="1" fill="#78350F" opacity="0.7" />
                          <rect x={frogX + 11} y={frogY + 16} width="4" height="1" fill="#78350F" opacity="0.7" />
                          {/* Hanging Crimson Silk Ribbon Bookmark */}
                          <rect x={frogX + 8} y={frogY + 19} width="2" height="3" fill="#DC2626" />
                          <rect x={frogX + 9} y={frogY + 21} width="1" height="2" fill="#FACC15" />
                          {/* Gold Corner Bosses */}
                          <rect x={frogX + 1} y={frogY + 11} width="1" height="1" fill="#FACC15" />
                          <rect x={frogX + 16} y={frogY + 11} width="1" height="1" fill="#FACC15" />
                          {/* Frog Paws Holding Book */}
                          <rect x={frogX - 1} y={frogY + 14} width="3" height="4" fill={skin.main} />
                          <rect x={frogX} y={frogY + 14} width="1" height="3" fill={skin.highlight || '#86EFAC'} />
                          <rect x={frogX + 15} y={frogY + 14} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 16} y={frogY + 14} width="1" height="3" fill={skin.highlight || '#86EFAC'} />
                        </g>
                      )}

                      {/* 2. Sipping Artisanal Matcha Chawan Tea */}
                      {config.activityId === 'tea' && (
                        <g id="scene-prop-tea">
                          {/* Stoneware Ceramic Chawan Bowl */}
                          <rect x={frogX + 4} y={frogY + 12} width="10" height="8" fill="#451A03" />
                          <rect x={frogX + 4} y={frogY + 13} width="10" height="6" fill="#78350F" />
                          <rect x={frogX + 5} y={frogY + 13} width="8" height="5" fill="#92400E" />
                          <rect x={frogX + 5} y={frogY + 18} width="8" height="2" fill="#292524" />
                          {/* Freshly Whisked Jade Matcha Froth */}
                          <rect x={frogX + 5} y={frogY + 12} width="8" height="3" fill="#14532D" />
                          <rect x={frogX + 6} y={frogY + 12} width="6" height="2" fill="#16A34A" />
                          <rect x={frogX + 7} y={frogY + 12} width="3" height="1" fill="#4ADE80" />
                          {/* Floating Aromatic Steam Wisps (Animated) */}
                          <rect x={frogX + 7} y={frogY + 8 - (animTick % 3)} width="2" height="2" fill="#E2E8F0" opacity="0.8" />
                          <rect x={frogX + 8} y={frogY + 6 - (animTick % 3)} width="1" height="2" fill="#CBD5E1" opacity="0.6" />
                          <rect x={frogX + 10} y={frogY + 7 - ((animTick + 1) % 3)} width="1" height="2" fill="#E2E8F0" opacity="0.7" />
                          {/* Frog Paws Clasping Bowl */}
                          <rect x={frogX + 2} y={frogY + 14} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 3} y={frogY + 14} width="1" height="3" fill={skin.highlight || '#86EFAC'} />
                          <rect x={frogX + 13} y={frogY + 14} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 14} y={frogY + 14} width="1" height="3" fill={skin.highlight || '#86EFAC'} />
                        </g>
                      )}

                      {/* 3. Hot Cafe Mug & Foam Heart Latte */}
                      {config.activityId === 'coffee' && (
                        <g id="scene-prop-coffee">
                          {/* Ceramic Bistro Mug Body */}
                          <rect x={frogX + 4} y={frogY + 12} width="9" height="8" fill="#1E293B" />
                          <rect x={frogX + 5} y={frogY + 13} width="7" height="6" fill="#F8FAFC" />
                          <rect x={frogX + 5} y={frogY + 13} width="2" height="5" fill="#FFFFFF" />
                          {/* Glossy Side Handle */}
                          <rect x={frogX + 12} y={frogY + 14} width="3" height="5" fill="#1E293B" />
                          <rect x={frogX + 13} y={frogY + 15} width="1" height="3" fill="#FFFFFF" />
                          {/* Rich Espresso & Creamy Foam Heart */}
                          <rect x={frogX + 5} y={frogY + 12} width="7" height="3" fill="#451A03" />
                          <rect x={frogX + 6} y={frogY + 12} width="5" height="2" fill="#78350F" />
                          <rect x={frogX + 7} y={frogY + 12} width="3" height="2" fill="#FEF3C7" />
                          <rect x={frogX + 8} y={frogY + 13} width="1" height="1" fill="#FEF3C7" />
                          {/* Steam Wisp (Animated) */}
                          <rect x={frogX + 7} y={frogY + 8 - (animTick % 3)} width="2" height="2" fill="#E2E8F0" opacity="0.8" />
                          <rect x={frogX + 8} y={frogY + 6 - (animTick % 3)} width="1" height="2" fill="#CBD5E1" opacity="0.6" />
                          {/* Frog Paws Holding Mug */}
                          <rect x={frogX + 2} y={frogY + 14} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 3} y={frogY + 14} width="1" height="3" fill={skin.highlight || '#86EFAC'} />
                        </g>
                      )}

                      {/* 4. Layered Boba Milk Tea */}
                      {config.activityId === 'boba' && (
                        <g id="scene-prop-boba">
                          {/* Translucent Cup Body with Brown Sugar Milk Tea */}
                          <rect x={frogX + 5} y={frogY + 11} width="8" height="9" fill="#78350F" />
                          <rect x={frogX + 6} y={frogY + 11} width="6" height="8" fill="#FDBA74" />
                          <rect x={frogX + 6} y={frogY + 11} width="6" height="3" fill="#FED7AA" />
                          <rect x={frogX + 6} y={frogY + 11} width="2" height="6" fill="#FFFFFF" opacity="0.4" />
                          {/* Domed Clear Lid */}
                          <rect x={frogX + 4} y={frogY + 10} width="10" height="2" fill="#BAE6FD" opacity="0.8" />
                          <rect x={frogX + 5} y={frogY + 9} width="8" height="2" fill="#E0F2FE" opacity="0.9" />
                          {/* Wide Coral Pink Boba Straw */}
                          <rect x={frogX + 8} y={frogY + 6} width="2" height="9" fill="#FB7185" />
                          <rect x={frogX + 8} y={frogY + 6} width="1" height="9" fill="#FDA4AF" />
                          {/* Chewy Black Tapioca Pearls at Bottom */}
                          <rect x={frogX + 6} y={frogY + 17} width="2" height="2" fill="#09090B" />
                          <rect x={frogX + 9} y={frogY + 17} width="2" height="2" fill="#09090B" />
                          <rect x={frogX + 7} y={frogY + 15} width="2" height="2" fill="#18181B" />
                          <rect x={frogX + 10} y={frogY + 15} width="1" height="2" fill="#18181B" />
                          {/* Frog Paws Clasping Boba */}
                          <rect x={frogX + 3} y={frogY + 14} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 12} y={frogY + 14} width="3" height="4" fill={skin.main} />
                        </g>
                      )}

                      {/* 5. Japanese Bento Tray with Onigiri & Miso Soup */}
                      {config.activityId === 'eating' && (
                        <g id="scene-prop-eating">
                          {/* Cedar Bento Tray */}
                          <rect x={frogX + 1} y={frogY + 13} width="16" height="8" fill="#78350F" />
                          <rect x={frogX + 2} y={frogY + 14} width="14" height="6" fill="#B45309" />
                          {/* Onigiri Rice Ball on Left */}
                          <rect x={frogX + 3} y={frogY + 12} width="5" height="5" fill="#1E293B" />
                          <rect x={frogX + 4} y={frogY + 12} width="3" height="4" fill="#FFFFFF" />
                          <rect x={frogX + 4} y={frogY + 15} width="3" height="2" fill="#0F172A" />
                          {/* Hot Miso Soup Bowl with Scallions on Right */}
                          <rect x={frogX + 10} y={frogY + 13} width="5" height="5" fill="#451A03" />
                          <rect x={frogX + 11} y={frogY + 14} width="3" height="3" fill="#D97706" />
                          <rect x={frogX + 11} y={frogY + 14} width="1" height="1" fill="#4ADE80" />
                          <rect x={frogX + 13} y={frogY + 15} width="1" height="1" fill="#FEF3C7" />
                          {/* Rising Soup Steam */}
                          <rect x={frogX + 12} y={frogY + 10 - (animTick % 2)} width="1" height="2" fill="#E2E8F0" opacity="0.8" />
                          {/* Frog Paws Holding Tray */}
                          <rect x={frogX - 1} y={frogY + 14} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 15} y={frogY + 14} width="3" height="4" fill={skin.main} />
                        </g>
                      )}

                      {/* 6. Sunburst Acoustic Folk Guitar / Lute */}
                      {config.activityId === 'guitar' && (
                        <g id="scene-prop-guitar">
                          {/* Mahogany Body with Sunburst Amber Top */}
                          <rect x={frogX + 5} y={frogY + 12} width="10" height="9" fill="#451A03" />
                          <rect x={frogX + 6} y={frogY + 13} width="8" height="7" fill="#B45309" />
                          <rect x={frogX + 7} y={frogY + 14} width="6" height="5" fill="#F59E0B" />
                          <rect x={frogX + 8} y={frogY + 15} width="4" height="3" fill="#FDE047" />
                          {/* Acoustic Soundhole Rosette & Bridge */}
                          <rect x={frogX + 9} y={frogY + 15} width="2" height="2" fill="#18181B" />
                          <rect x={frogX + 7} y={frogY + 18} width="5" height="1" fill="#451A03" />
                          {/* Slanted Fretboard Neck & Headstock */}
                          <rect x={frogX + 13} y={frogY + 7} width="7" height="3" fill="#78350F" />
                          <rect x={frogX + 14} y={frogY + 8} width="5" height="1" fill="#E2E8F0" />
                          <rect x={frogX + 19} y={frogY + 5} width="3" height="4" fill="#B45309" />
                          <rect x={frogX + 19} y={frogY + 4} width="1" height="1" fill="#FACC15" />
                          <rect x={frogX + 21} y={frogY + 4} width="1" height="1" fill="#FACC15" />
                          {/* Frog Paws Strumming */}
                          <rect x={frogX + 4} y={frogY + 14} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 11} y={frogY + 13} width="3" height="3" fill={skin.main} />
                          {/* Floating Melodic Notes (Animated) */}
                          <g fill="#F59E0B">
                            <g transform={`translate(${frogX + 17}, ${frogY + 1 - (animTick % 3) * 2})`}>
                              <rect x="0" y="2" width="2" height="2" fill="#FACC15" />
                              <rect x="1" y="0" width="1" height="3" fill="#FACC15" />
                              <rect x="2" y="0" width="2" height="1" fill="#FEF08A" />
                            </g>
                            <g transform={`translate(${frogX + 2}, ${frogY - 2 - ((animTick + 1) % 3) * 2})`}>
                              <rect x="0" y="2" width="2" height="2" fill="#FB7185" />
                              <rect x="3" y="2" width="2" height="2" fill="#FB7185" />
                              <rect x="1" y="0" width="1" height="3" fill="#FB7185" />
                              <rect x="4" y="0" width="1" height="3" fill="#FB7185" />
                              <rect x="1" y="0" width="4" height="1" fill="#FDA4AF" />
                            </g>
                          </g>
                        </g>
                      )}

                      {/* 7. Master Artist Palette & Detail Paintbrush */}
                      {config.activityId === 'painting' && (
                        <g id="scene-prop-painting">
                          {/* Birchwood Kidney Artist Palette */}
                          <rect x={frogX + 4} y={frogY + 12} width="11" height="8" fill="#78350F" />
                          <rect x={frogX + 5} y={frogY + 13} width="9" height="6" fill="#D97706" />
                          <rect x={frogX + 6} y={frogY + 13} width="7" height="4" fill="#FDE68A" />
                          {/* Curved Thumb Hole */}
                          <rect x={frogX + 12} y={frogY + 16} width="2" height="2" fill="#18181B" opacity="0.6" />
                          {/* Vibrant 3D Oil Paint Blobs */}
                          <rect x={frogX + 6} y={frogY + 14} width="2" height="2" fill="#DC2626" />
                          <rect x={frogX + 6} y={frogY + 14} width="1" height="1" fill="#F87171" />
                          <rect x={frogX + 8} y={frogY + 13} width="2" height="2" fill="#2563EB" />
                          <rect x={frogX + 8} y={frogY + 13} width="1" height="1" fill="#60A5FA" />
                          <rect x={frogX + 10} y={frogY + 14} width="2" height="2" fill="#FACC15" />
                          <rect x={frogX + 10} y={frogY + 14} width="1" height="1" fill="#FEF08A" />
                          <rect x={frogX + 7} y={frogY + 16} width="2" height="2" fill="#16A34A" />
                          {/* Wooden Paintbrush with Silver Ferrule */}
                          <rect x={frogX + 14} y={frogY + 7} width="2" height="7" fill="#78350F" />
                          <rect x={frogX + 14} y={frogY + 6} width="2" height="2" fill="#E2E8F0" />
                          <rect x={frogX + 14} y={frogY + 5} width="2" height="2" fill="#DC2626" />
                          {/* Frog Paws Holding Tools */}
                          <rect x={frogX + 2} y={frogY + 14} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 13} y={frogY + 11} width="3" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 8. Vintage 35mm Rangefinder Camera */}
                      {config.activityId === 'camera' && (
                        <g id="scene-prop-camera">
                          {/* Obsidian Textured Body & Brushed Chrome Top */}
                          <rect x={frogX + 3} y={frogY + 12} width="12" height="8" fill="#09090B" />
                          <rect x={frogX + 4} y={frogY + 12} width="10" height="2" fill="#CBD5E1" />
                          <rect x={frogX + 4} y={frogY + 14} width="10" height="5" fill="#18181B" />
                          {/* Shutter Button, Dial & Viewfinder */}
                          <rect x={frogX + 5} y={frogY + 11} width="2" height="2" fill="#E2E8F0" />
                          <rect x={frogX + 11} y={frogY + 11} width="2" height="1" fill="#E2E8F0" />
                          <rect x={frogX + 4} y={frogY + 13} width="2" height="1" fill="#38BDF8" />
                          {/* Multi-Coated Optical Glass Lens with Cyan Flare */}
                          <rect x={frogX + 7} y={frogY + 14} width="5" height="5" fill="#0F172A" />
                          <rect x={frogX + 8} y={frogY + 14} width="3" height="4" fill="#0284C7" />
                          <rect x={frogX + 8} y={frogY + 15} width="2" height="2" fill="#38BDF8" />
                          <rect x={frogX + 8} y={frogY + 15} width="1" height="1" fill="#FFFFFF" />
                          {/* Red Dot Accent */}
                          <rect x={frogX + 12} y={frogY + 14} width="1" height="1" fill="#EF4444" />
                          {/* Frog Paws Holding Camera */}
                          <rect x={frogX + 1} y={frogY + 14} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 14} y={frogY + 14} width="3" height="4" fill={skin.main} />
                        </g>
                      )}

                      {/* 9. Celestial Starlight Magic Wand */}
                      {config.activityId === 'wand' && (
                        <g id="scene-prop-wand">
                          {/* Carved Amber Wood Shaft with Brass Collar */}
                          <rect x={frogX + 13} y={frogY + 16} width="2" height="3" fill="#78350F" />
                          <rect x={frogX + 14} y={frogY + 13} width="2" height="4" fill="#B45309" />
                          <rect x={frogX + 16} y={frogY + 10} width="2" height="4" fill="#D97706" />
                          <rect x={frogX + 17} y={frogY + 9} width="2" height="2" fill="#FACC15" />
                          {/* Faceted 8-Point Starlight Crystal Tip */}
                          <rect x={frogX + 16} y={frogY + 4} width="6" height="6" fill="#FACC15" />
                          <rect x={frogX + 17} y={frogY + 3} width="4" height="8" fill="#FDE047" />
                          <rect x={frogX + 15} y={frogY + 5} width="8" height="4" fill="#FDE047" />
                          <rect x={frogX + 18} y={frogY + 5} width="2" height="2" fill="#FFFFFF" />
                          {/* Orbiting Stardust Sparkles (Animated) */}
                          <rect x={frogX + 22} y={frogY + 2 - (animTick % 3)} width="2" height="2" fill="#FEF08A" />
                          <rect x={frogX + 14} y={frogY + 3 - ((animTick + 1) % 3)} width="2" height="2" fill="#FDE047" />
                          <rect x={frogX + 21} y={frogY + 9} width="1" height="1" fill="#FFFFFF" />
                          {/* Frog Paw Holding Wand */}
                          <rect x={frogX + 12} y={frogY + 14} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 13} y={frogY + 14} width="1" height="3" fill={skin.highlight || '#86EFAC'} />
                        </g>
                      )}

                      {/* 10. Hand-Jointed Bamboo Fishing Rod */}
                      {config.activityId === 'fishing' && (
                        <g id="scene-prop-fishing">
                          {/* Bamboo Rod with Node Joints */}
                          <rect x={frogX + 9} y={frogY + 16} width="3" height="2" fill="#78350F" />
                          <rect x={frogX + 11} y={frogY + 13} width="3" height="3" fill="#A16207" />
                          <rect x={frogX + 13} y={frogY + 10} width="3" height="3" fill="#CA8A04" />
                          <rect x={frogX + 16} y={frogY + 7} width="3" height="3" fill="#D97706" />
                          <rect x={frogX + 19} y={frogY + 4} width="3" height="3" fill="#EAB308" />
                          <rect x={frogX + 22} y={frogY + 2} width="3" height="2" fill="#FACC15" />
                          {/* Golden Guide Rings */}
                          <rect x={frogX + 12} y={frogY + 13} width="1" height="1" fill="#FEF08A" />
                          <rect x={frogX + 17} y={frogY + 7} width="1" height="1" fill="#FEF08A" />
                          {/* Monofilament Line & 2-Tone Red/White Bobber */}
                          <rect x={frogX + 24} y={frogY + 3} width="1" height="17" fill="#BAE6FD" opacity="0.8" />
                          <rect x={frogX + 23} y={frogY + 18} width="3" height="2" fill="#EF4444" />
                          <rect x={frogX + 23} y={frogY + 20} width="3" height="2" fill="#FFFFFF" />
                          {/* Water Ripples at Bottom (Animated) */}
                          <rect x={frogX + 21} y={frogY + 22} width="7" height="1" fill="#38BDF8" opacity="0.6" />
                          <rect x={frogX + 22} y={frogY + 21} width="5" height="1" fill="#BAE6FD" opacity="0.8" />
                          {/* Frog Paw Holding Rod */}
                          <rect x={frogX + 8} y={frogY + 14} width="3" height="4" fill={skin.main} />
                        </g>
                      )}

                      {/* 11. Honey Wicker Picnic Hamper with Treats */}
                      {config.activityId === 'picnic_basket' && (
                        <g id="scene-prop-picnic">
                          {/* Handwoven Rattan Basket Body */}
                          <rect x={frogX + 3} y={frogY + 12} width="13" height="9" fill="#78350F" />
                          <rect x={frogX + 4} y={frogY + 13} width="11" height="7" fill="#D97706" />
                          <rect x={frogX + 4} y={frogY + 15} width="11" height="1" fill="#92400E" />
                          <rect x={frogX + 4} y={frogY + 18} width="11" height="1" fill="#92400E" />
                          {/* Red & White Gingham Checkered Napkin */}
                          <rect x={frogX + 4} y={frogY + 12} width="6" height="4" fill="#DC2626" />
                          <rect x={frogX + 5} y={frogY + 13} width="2" height="2" fill="#FFFFFF" />
                          <rect x={frogX + 8} y={frogY + 13} width="2" height="2" fill="#FFFFFF" />
                          {/* Shiny Red Apple & Baguette */}
                          <rect x={frogX + 11} y={frogY + 10} width="4" height="4" fill="#EF4444" />
                          <rect x={frogX + 12} y={frogY + 9} width="1" height="1" fill="#15803D" />
                          <rect x={frogX + 12} y={frogY + 10} width="1" height="1" fill="#FFFFFF" />
                          {/* Frog Paws Clasping Basket */}
                          <rect x={frogX + 1} y={frogY + 14} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 14} y={frogY + 14} width="3" height="4" fill={skin.main} />
                        </g>
                      )}

                      {/* 12. Heavy Forged Woodsman Felling Axe */}
                      {config.activityId === 'woodcutter_axe' && (
                        <g id="scene-prop-axe">
                          {/* Weathered Ash Wood Haft with Leather Grips */}
                          <rect x={frogX + 10} y={frogY + 18} width="2" height="3" fill="#451A03" />
                          <rect x={frogX + 12} y={frogY + 14} width="2" height="5" fill="#78350F" />
                          <rect x={frogX + 14} y={frogY + 10} width="2" height="5" fill="#92400E" />
                          <rect x={frogX + 16} y={frogY + 6} width="2" height="5" fill="#B45309" />
                          <rect x={frogX + 18} y={frogY + 3} width="2" height="4" fill="#D97706" />
                          {/* Forged Steel Bearded Head & Razor Blade Edge */}
                          <rect x={frogX + 16} y={frogY + 3} width="6" height="6" fill="#334155" />
                          <rect x={frogX + 17} y={frogY + 4} width="4" height="4" fill="#64748B" />
                          <rect x={frogX + 21} y={frogY + 3} width="2" height="6" fill="#CBD5E1" />
                          <rect x={frogX + 22} y={frogY + 4} width="1" height="4" fill="#FFFFFF" />
                          {/* Frog Paw Gripping Axe */}
                          <rect x={frogX + 9} y={frogY + 14} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 10} y={frogY + 14} width="1" height="3" fill={skin.highlight || '#86EFAC'} />
                        </g>
                      )}

                      {/* 13. Artisanal Hinoki Geta Sushi Platter */}
                      {(config.activityId === 'sushi_platter' || config.activityId === 'eating_sushi') && (
                        <g id="scene-prop-sushi">
                          {/* Hinoki Cypress Wooden Board & Geta Legs */}
                          <rect x={frogX + 2} y={frogY + 13} width="15" height="7" fill="#78350F" />
                          <rect x={frogX + 3} y={frogY + 14} width="13" height="5" fill="#D97706" />
                          <rect x={frogX + 4} y={frogY + 19} width="2" height="2" fill="#451A03" />
                          <rect x={frogX + 13} y={frogY + 19} width="2" height="2" fill="#451A03" />
                          {/* Salmon Nigiri (Orange + White Fat Lines) */}
                          <rect x={frogX + 4} y={frogY + 12} width="5" height="3" fill="#FB923C" />
                          <rect x={frogX + 5} y={frogY + 13} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 7} y={frogY + 13} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 4} y={frogY + 14} width="5" height="2" fill="#FFFFFF" />
                          {/* Maguro Tuna Nigiri (Ruby Red) */}
                          <rect x={frogX + 10} y={frogY + 12} width="5" height="3" fill="#BE123C" />
                          <rect x={frogX + 11} y={frogY + 12} width="3" height="1" fill="#E11D48" />
                          <rect x={frogX + 10} y={frogY + 14} width="5" height="2" fill="#FFFFFF" />
                          {/* Wasabi Rosette */}
                          <rect x={frogX + 8} y={frogY + 15} width="2" height="2" fill="#84CC16" />
                          {/* Frog Paws Holding Platter */}
                          <rect x={frogX} y={frogY + 14} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 15} y={frogY + 14} width="3" height="4" fill={skin.main} />
                        </g>
                      )}

                      {/* 14. Master Itamae Sashimi Prep Station */}
                      {(config.activityId === 'tea_whisk' || config.activityId === 'sushi_crafting') && (
                        <g id="scene-prop-crafting">
                          {/* Cutting Board & Green Bamboo Rolling Mat */}
                          <rect x={frogX + 2} y={frogY + 13} width="15" height="7" fill="#78350F" />
                          <rect x={frogX + 3} y={frogY + 14} width="13" height="5" fill="#D97706" />
                          <rect x={frogX + 4} y={frogY + 14} width="8" height="4" fill="#65A30D" />
                          {/* Fresh Nori Sheet & Seasoned Sushi Rice */}
                          <rect x={frogX + 5} y={frogY + 14} width="6" height="3" fill="#0F172A" />
                          <rect x={frogX + 6} y={frogY + 14} width="4" height="2" fill="#FFFFFF" />
                          <rect x={frogX + 7} y={frogY + 14} width="2" height="1" fill="#FB923C" />
                          {/* Yanagiba Sashimi Knife */}
                          <rect x={frogX + 12} y={frogY + 9} width="2" height="7" fill="#E2E8F0" />
                          <rect x={frogX + 12} y={frogY + 9} width="1" height="7" fill="#FFFFFF" />
                          <rect x={frogX + 12} y={frogY + 15} width="2" height="3" fill="#78350F" />
                          {/* Frog Paws Working */}
                          <rect x={frogX} y={frogY + 14} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 11} y={frogY + 13} width="3" height="4" fill={skin.main} />
                        </g>
                      )}

                      {/* 15. Konbini Laser Barcode Scanner Pistol */}
                      {config.activityId === 'konbini_scanner' && (
                        <g id="scene-prop-scanner">
                          {/* Ergonomic Scanner Pistol Body & Rubber Bumper */}
                          <rect x={frogX + 8} y={frogY + 12} width="8" height="5" fill="#0F172A" />
                          <rect x={frogX + 9} y={frogY + 13} width="6" height="3" fill="#1E293B" />
                          <rect x={frogX + 13} y={frogY + 10} width="4" height="7" fill="#0284C7" />
                          <rect x={frogX + 14} y={frogY + 11} width="2" height="5" fill="#38BDF8" />
                          {/* Optical Front Lens & Trigger */}
                          <rect x={frogX + 16} y={frogY + 12} width="2" height="3" fill="#09090B" />
                          <rect x={frogX + 11} y={frogY + 15} width="2" height="2" fill="#EF4444" />
                          {/* Bright Red Scanning Laser Beam (Animated Pulse) */}
                          <rect x={frogX + 18} y={frogY + 13} width="9" height="1" fill="#EF4444" className="animate-pulse" />
                          <rect x={frogX + 26} y={frogY + 12} width="2" height="3" fill="#F87171" />
                          {/* Green Beeper Status LED */}
                          <rect x={frogX + 10} y={frogY + 12} width="1" height="1" fill="#22C55E" />
                          {/* Frog Paw Gripping Scanner */}
                          <rect x={frogX + 7} y={frogY + 14} width="3" height="4" fill={skin.main} />
                        </g>
                      )}

                      {/* 16. Plump Japanese Triangle Onigiri with Nori */}
                      {config.activityId === 'eating_onigiri' && (
                        <g id="scene-prop-eating-onigiri">
                          {/* Fluffy White Sushi Rice Triangle */}
                          <rect x={frogX + 7} y={frogY + 9} width="4" height="2" fill="#FFFFFF" />
                          <rect x={frogX + 6} y={frogY + 11} width="6" height="2" fill="#FFFFFF" />
                          <rect x={frogX + 5} y={frogY + 13} width="8" height="3" fill="#FFFFFF" />
                          <rect x={frogX + 4} y={frogY + 16} width="10" height="3" fill="#FFFFFF" />
                          <rect x={frogX + 5} y={frogY + 18} width="8" height="1" fill="#CBD5E1" />
                          {/* Crimson Pickled Umeboshi Plum Core */}
                          <rect x={frogX + 8} y={frogY + 12} width="2" height="2" fill="#DC2626" />
                          <rect x={frogX + 8} y={frogY + 12} width="1" height="1" fill="#EF4444" />
                          {/* Crisp Dark Nori Seaweed Wrap */}
                          <rect x={frogX + 7} y={frogY + 15} width="4" height="4" fill="#09090B" />
                          <rect x={frogX + 8} y={frogY + 15} width="2" height="3" fill="#18181B" />
                          {/* Cute Steam Wisp */}
                          <rect x={frogX + 8} y={frogY + 6 - (animTick % 2)} width="2" height="2" fill="#E2E8F0" opacity="0.8" />
                          {/* Frog Paws Holding Onigiri */}
                          <rect x={frogX + 2} y={frogY + 14} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 13} y={frogY + 14} width="3" height="4" fill={skin.main} />
                        </g>
                      )}

                      {/* 17. Crinkled Konbini Shopping Bag with Goodies */}
                      {config.activityId === 'holding_konbini_bag' && (
                        <g id="scene-prop-bag">
                          {/* Bag Straps & Handles */}
                          <rect x={frogX + 10} y={frogY + 9} width="2" height="4" fill="#94A3B8" />
                          <rect x={frogX + 14} y={frogY + 9} width="2" height="4" fill="#94A3B8" />
                          {/* Translucent Crinkled White Plastic Bag */}
                          <rect x={frogX + 8} y={frogY + 12} width="10" height="10" fill="#0F172A" />
                          <rect x={frogX + 9} y={frogY + 12} width="8" height="9" fill="#F8FAFC" />
                          {/* Iconic Emerald Green & Bright Orange Stripes */}
                          <rect x={frogX + 9} y={frogY + 16} width="8" height="2" fill="#10B981" />
                          <rect x={frogX + 9} y={frogY + 18} width="8" height="1" fill="#EA580C" />
                          {/* Peeking Milk Drink Carton & Snack Box Silhouettes */}
                          <rect x={frogX + 10} y={frogY + 9} width="3" height="4" fill="#FACC15" />
                          <rect x={frogX + 14} y={frogY + 10} width="2" height="3" fill="#EF4444" />
                          {/* Frog Paw Holding Bag Handles */}
                          <rect x={frogX + 8} y={frogY + 13} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 9} y={frogY + 13} width="1" height="3" fill={skin.highlight || '#86EFAC'} />
                        </g>
                      )}

                      {/* 18. Retro 8-Bit Gamepad Controller */}
                      {config.activityId === 'arcade_gamepad' && (
                        <g id="scene-prop-gamepad">
                          {/* Matte Obsidian Controller Body */}
                          <rect x={frogX + 3} y={frogY + 12} width="13" height="8" fill="#09090B" />
                          <rect x={frogX + 4} y={frogY + 13} width="11" height="6" fill="#18181B" />
                          <rect x={frogX + 5} y={frogY + 13} width="9" height="5" fill="#27272A" />
                          {/* Crimson Directional D-Pad */}
                          <rect x={frogX + 5} y={frogY + 15} width="4" height="2" fill="#DC2626" />
                          <rect x={frogX + 6} y={frogY + 14} width="2" height="4" fill="#DC2626" />
                          <rect x={frogX + 6} y={frogY + 15} width="1" height="1" fill="#EF4444" />
                          {/* Ruby Red & Amber Action Buttons */}
                          <rect x={frogX + 12} y={frogY + 15} width="2" height="2" fill="#EF4444" />
                          <rect x={frogX + 10} y={frogY + 16} width="2" height="2" fill="#FACC15" />
                          {/* Start/Select Buttons & Top Cable */}
                          <rect x={frogX + 8} y={frogY + 16} width="2" height="1" fill="#71717A" />
                          <rect x={frogX + 9} y={frogY + 10} width="1" height="3" fill="#52525B" />
                          {/* Frog Paws Clasping Controller */}
                          <rect x={frogX + 1} y={frogY + 14} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 14} y={frogY + 14} width="3" height="4" fill={skin.main} />
                        </g>
                      )}

                      {/* 19. Huggable Chibi Frog Plushie Prize */}
                      {config.activityId === 'claw_machine_prize' && (
                        <g id="scene-prop-claw-prize">
                          {/* Fluffy Green Frog Body */}
                          <rect x={frogX + 3} y={frogY + 11} width="12" height="10" fill="#15803D" />
                          <rect x={frogX + 4} y={frogY + 12} width="10" height="8" fill="#4ADE80" />
                          {/* Big Sparkly Eyes */}
                          <rect x={frogX + 4} y={frogY + 10} width="3" height="3" fill="#166534" />
                          <rect x={frogX + 11} y={frogY + 10} width="3" height="3" fill="#166534" />
                          <rect x={frogX + 5} y={frogY + 10} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 12} y={frogY + 10} width="1" height="1" fill="#FFFFFF" />
                          {/* Cream Tummy & Embroidered Pink Heart */}
                          <rect x={frogX + 6} y={frogY + 14} width="6" height="5" fill="#FEF08A" />
                          <rect x={frogX + 8} y={frogY + 15} width="2" height="2" fill="#EC4899" />
                          {/* Frog Paws Hugging Plushie */}
                          <rect x={frogX + 1} y={frogY + 13} width="3" height="5" fill={skin.main} />
                          <rect x={frogX + 2} y={frogY + 13} width="1" height="4" fill={skin.highlight || '#86EFAC'} />
                          <rect x={frogX + 14} y={frogY + 13} width="3" height="5" fill={skin.main} />
                          <rect x={frogX + 15} y={frogY + 13} width="1" height="4" fill={skin.highlight || '#86EFAC'} />
                        </g>
                      )}

                      {/* 20. Retro DMG Handheld Video Game Console */}
                      {config.activityId === 'handheld_gaming' && (
                        <g id="scene-prop-handheld">
                          {/* Light Grey Console Body */}
                          <rect x={frogX + 4} y={frogY + 10} width="11" height="12" fill="#334155" />
                          <rect x={frogX + 5} y={frogY + 11} width="9" height="10" fill="#94A3B8" />
                          <rect x={frogX + 5} y={frogY + 11} width="9" height="1" fill="#CBD5E1" />
                          {/* Pea-Soup Dot-Matrix Screen Bezel & LCD */}
                          <rect x={frogX + 6} y={frogY + 12} width="7" height="5" fill="#1E293B" />
                          <rect x={frogX + 7} y={frogY + 13} width="5" height="3" fill="#8BAC0F" />
                          <rect x={frogX + 9} y={frogY + 14} width="1" height="1" fill="#0F380F" />
                          {/* D-Pad & Slanted Magenta A/B Buttons */}
                          <rect x={frogX + 6} y={frogY + 18} width="3" height="2" fill="#0F172A" />
                          <rect x={frogX + 11} y={frogY + 18} width="2" height="2" fill="#BE123C" />
                          <rect x={frogX + 12} y={frogY + 17} width="1" height="1" fill="#E11D48" />
                          {/* Frog Paws Holding Console */}
                          <rect x={frogX + 2} y={frogY + 14} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 13} y={frogY + 14} width="3" height="4" fill={skin.main} />
                        </g>
                      )}

                      {/* 21. Sizzling Golden Roasted Marshmallows */}
                      {config.activityId === 'roasting_marshmallow' && (
                        <g id="scene-prop-marshmallow">
                          {/* Hand-Whittled Pine Branch Skewer */}
                          <rect x={frogX + 3} y={frogY + 15} width="17" height="2" fill="#78350F" />
                          <rect x={frogX + 4} y={frogY + 15} width="15" height="1" fill="#B45309" />
                          <rect x={frogX + 19} y={frogY + 12} width="1" height="6" fill="#78350F" />
                          {/* Puffy Toasted Golden Marshmallows with Gooey Caramel Crust */}
                          <rect x={frogX + 13} y={frogY + 12} width="5" height="5" fill="#78350F" />
                          <rect x={frogX + 14} y={frogY + 13} width="3" height="3" fill="#FEF3C7" />
                          <rect x={frogX + 15} y={frogY + 13} width="2" height="2" fill="#D97706" />
                          <rect x={frogX + 18} y={frogY + 9} width="5" height="5" fill="#78350F" />
                          <rect x={frogX + 19} y={frogY + 10} width="3" height="3" fill="#FFFFFF" />
                          <rect x={frogX + 20} y={frogY + 10} width="2" height="2" fill="#B45309" />
                          {/* Sweet Rising Steam (Animated) */}
                          <rect x={frogX + 17} y={frogY + 7 - (animTick % 2 === 0 ? 0 : 2)} width="2" height="2" fill="#FFFFFF" opacity="0.8" />
                          {/* Frog Paws Gripping Skewer */}
                          <rect x={frogX + 2} y={frogY + 14} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 3} y={frogY + 14} width="1" height="3" fill={skin.highlight || '#86EFAC'} />
                        </g>
                      )}

                      {/* 22. Vintage Heavy Brass Hurricane Camp Lantern */}
                      {config.activityId === 'holding_camp_lantern' && (
                        <g id="scene-prop-camp-lantern">
                          {/* Sturdy Wire Bail Handle */}
                          <rect x={frogX + 9} y={frogY + 9} width="7" height="1" fill="#475569" />
                          <rect x={frogX + 9} y={frogY + 10} width="1" height="3" fill="#64748B" />
                          <rect x={frogX + 15} y={frogY + 10} width="1" height="3" fill="#64748B" />
                          {/* Polished Brass Chimney Cap & Base */}
                          <rect x={frogX + 8} y={frogY + 12} width="9" height="2" fill="#78350F" />
                          <rect x={frogX + 9} y={frogY + 12} width="7" height="2" fill="#D97706" />
                          <rect x={frogX + 10} y={frogY + 12} width="5" height="1" fill="#FACC15" />
                          <rect x={frogX + 8} y={frogY + 19} width="9" height="2" fill="#78350F" />
                          <rect x={frogX + 9} y={frogY + 19} width="7" height="1" fill="#D97706" />
                          {/* Glowing Warm Amber Glass Globe & Inner Wick Flame */}
                          <rect x={frogX + 9} y={frogY + 14} width="7" height="5" fill="#B45309" />
                          <rect x={frogX + 10} y={frogY + 14} width="5" height="5" fill="#F59E0B" />
                          <rect x={frogX + 11} y={frogY + 15} width="3" height="3" fill="#FEF08A" />
                          <rect x={frogX + 12} y={frogY + 16} width="1" height="1" fill="#FFFFFF" />
                          {/* Protective Cage Wire Grid */}
                          <rect x={frogX + 12} y={frogY + 14} width="1" height="5" fill="#78350F" opacity="0.6" />
                          {/* Soft Ambient Radiance Stepped Pixel Halo (Animated) */}
                          <rect x={frogX + 6} y={frogY + 9} width="13" height="13" fill="#FEF08A" opacity={animTick % 2 === 0 ? 0.22 : 0.14} />
                          <rect x={frogX + 8} y={frogY + 7} width="9" height="17" fill="#FEF08A" opacity={animTick % 2 === 0 ? 0.18 : 0.1} />
                          {/* Frog Paw Holding Lantern Bail */}
                          <rect x={frogX + 8} y={frogY + 13} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 9} y={frogY + 13} width="1" height="3" fill={skin.highlight || '#86EFAC'} />
                        </g>
                      )}

                      {/* 23. Midnight Speckled Enamel Camp Kettle & Mug */}
                      {config.activityId === 'camp_kettle_coffee' && (
                        <g id="scene-prop-kettle-coffee">
                          {/* Cobalt Blue Speckled Enamel Camp Mug */}
                          <rect x={frogX + 4} y={frogY + 12} width="8" height="8" fill="#0C4A6E" />
                          <rect x={frogX + 5} y={frogY + 13} width="6" height="6" fill="#0284C7" />
                          <rect x={frogX + 5} y={frogY + 13} width="2" height="5" fill="#38BDF8" />
                          {/* Ivory Speckles & Rim */}
                          <rect x={frogX + 4} y={frogY + 12} width="8" height="1" fill="#F8FAFC" />
                          <rect x={frogX + 6} y={frogY + 15} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 8} y={frogY + 17} width="1" height="1" fill="#FFFFFF" />
                          {/* Mug Side Handle */}
                          <rect x={frogX + 11} y={frogY + 14} width="3" height="4" fill="#0C4A6E" />
                          <rect x={frogX + 12} y={frogY + 15} width="1" height="2" fill="#0284C7" />
                          {/* Fresh Dark Roast Coffee & Rising Steam (Animated) */}
                          <rect x={frogX + 5} y={frogY + 12} width="6" height="2" fill="#451A03" />
                          <rect x={frogX + 7} y={frogY + 7 - (animTick % 2 === 0 ? 0 : 2)} width="2" height="2" fill="#FFFFFF" opacity="0.8" />
                          <rect x={frogX + 8} y={frogY + 5 - (animTick % 2 === 0 ? 0 : 2)} width="1" height="2" fill="#CBD5E1" opacity="0.6" />
                          {/* Frog Paws Holding Mug */}
                          <rect x={frogX + 2} y={frogY + 14} width="3" height="4" fill={skin.main} />
                          <rect x={frogX + 3} y={frogY + 14} width="1" height="3" fill={skin.highlight || '#86EFAC'} />
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
                          {/* Deep Green Stem Base */}
                          <rect x={frogX + 7} y={frogY - 6} width="2" height="3" fill="#14532D" />
                          <rect x={frogX + 8} y={frogY - 7} width="1" height="2" fill="#166534" />
                          {/* 4-Tone Water Lily Pad */}
                          <rect x={frogX - 2} y={frogY} width="20" height="2" fill="#14532D" />
                          <rect x={frogX - 1} y={frogY - 1} width="18" height="2" fill="#15803D" />
                          <rect x={frogX} y={frogY - 2} width="16" height="2" fill="#22C55E" />
                          <rect x={frogX + 2} y={frogY - 3} width="12" height="2" fill="#4ADE80" />
                          <rect x={frogX + 4} y={frogY - 4} width="8" height="2" fill="#86EFAC" />
                          {/* Delicate Water Lily Blossom on Side */}
                          <rect x={frogX + 11} y={frogY - 5} width="4" height="4" fill="#F472B6" />
                          <rect x={frogX + 12} y={frogY - 6} width="2" height="2" fill="#FBCFE8" />
                          <rect x={frogX + 12} y={frogY - 4} width="2" height="2" fill="#FDE047" />
                          {/* Glistening Specular Dewdrop */}
                          <rect x={frogX + 3} y={frogY - 2} width="2" height="2" fill="#E0F2FE" />
                          <rect x={frogX + 3} y={frogY - 2} width="1" height="1" fill="#FFFFFF" />
                        </g>
                      )}

                      {/* B. Straw Travel Hat */}
                      {config.hatId === 'straw' && (
                        <g>
                          {/* 4-Tone Woven Wicker Crown */}
                          <rect x={frogX + 4} y={frogY - 6} width="8" height="5" fill="#78350F" />
                          <rect x={frogX + 5} y={frogY - 6} width="6" height="4" fill="#D97706" />
                          <rect x={frogX + 5} y={frogY - 5} width="6" height="3" fill="#F59E0B" />
                          <rect x={frogX + 6} y={frogY - 5} width="4" height="2" fill="#FDE68A" />
                          {/* Woven Cross-hatch Texture Pixels */}
                          <rect x={frogX + 6} y={frogY - 4} width="1" height="1" fill="#78350F" />
                          <rect x={frogX + 9} y={frogY - 4} width="1" height="1" fill="#78350F" />
                          {/* Rich Crimson Fabric Ribbon Band with Stitch Lines */}
                          <rect x={frogX + 3} y={frogY - 2} width="10" height="2" fill="#991B1B" />
                          <rect x={frogX + 4} y={frogY - 2} width="8" height="1" fill="#EF4444" />
                          {/* Wide Woven Brim with Cast Shadow on Frog Forehead */}
                          <rect x={frogX - 4} y={frogY} width="24" height="3" fill="#78350F" />
                          <rect x={frogX - 3} y={frogY} width="22" height="2" fill="#D97706" />
                          <rect x={frogX - 2} y={frogY} width="20" height="1" fill="#FDE68A" />
                          <rect x={frogX - 2} y={frogY + 3} width="20" height="1" fill="#000000" opacity="0.25" />
                        </g>
                      )}

                      {/* C. Sakura Blossom Flower Crown */}
                      {config.hatId === 'sakura' && (
                        <g>
                          {/* Entwined Forest Vine Circlet */}
                          <rect x={frogX - 1} y={frogY + 2} width="18" height="2" fill="#14532D" />
                          <rect x={frogX} y={frogY + 2} width="16" height="1" fill="#22C55E" />
                          {/* 3 Delicate Sakura Blossoms with Shaded Petals & Golden Stamens */}
                          {/* Left Blossom */}
                          <rect x={frogX - 1} y={frogY - 2} width="4" height="4" fill="#DB2777" />
                          <rect x={frogX} y={frogY - 1} width="3" height="3" fill="#F472B6" />
                          <rect x={frogX + 1} y={frogY} width="2" height="2" fill="#FBCFE8" />
                          <rect x={frogX + 1} y={frogY} width="1" height="1" fill="#FDE047" />
                          {/* Center Blossom (Elevated) */}
                          <rect x={frogX + 5} y={frogY - 4} width="6" height="5" fill="#DB2777" />
                          <rect x={frogX + 6} y={frogY - 3} width="4" height="4" fill="#F472B6" />
                          <rect x={frogX + 7} y={frogY - 2} width="2" height="2" fill="#FCE7F3" />
                          <rect x={frogX + 7} y={frogY - 2} width="1" height="1" fill="#FACC15" />
                          {/* Right Blossom */}
                          <rect x={frogX + 13} y={frogY - 2} width="4" height="4" fill="#DB2777" />
                          <rect x={frogX + 13} y={frogY - 1} width="3" height="3" fill="#F472B6" />
                          <rect x={frogX + 13} y={frogY} width="2" height="2" fill="#FBCFE8" />
                          <rect x={frogX + 14} y={frogY} width="1" height="1" fill="#FDE047" />
                          {/* Floating Cherry Petals */}
                          <rect x={frogX + 3} y={frogY - 3} width="2" height="1" fill="#F472B6" />
                          <rect x={frogX + 11} y={frogY - 3} width="2" height="1" fill="#F472B6" />
                        </g>
                      )}

                      {/* D. Mystic Star Wizard Hat */}
                      {config.hatId === 'wizard' && (
                        <g>
                          {/* 5-Tone Midnight Indigo Wizard Conical Hat */}
                          <rect x={frogX + 7} y={frogY - 13} width="2" height="3" fill="#0F172A" />
                          <rect x={frogX + 8} y={frogY - 12} width="1" height="2" fill="#312E81" />
                          <rect x={frogX + 6} y={frogY - 10} width="4" height="4" fill="#1E1B4B" />
                          <rect x={frogX + 7} y={frogY - 9} width="3" height="3" fill="#3730A3" />
                          <rect x={frogX + 5} y={frogY - 6} width="6" height="4" fill="#1E1B4B" />
                          <rect x={frogX + 6} y={frogY - 5} width="5" height="3" fill="#4338CA" />
                          <rect x={frogX + 4} y={frogY - 2} width="8" height="3" fill="#1E1B4B" />
                          <rect x={frogX + 5} y={frogY - 2} width="7" height="2" fill="#4F46E5" />
                          {/* Glowing Golden Celestial Star */}
                          <rect x={frogX + 7} y={frogY - 7} width="3" height="3" fill="#FACC15" />
                          <rect x={frogX + 8} y={frogY - 8} width="1" height="5" fill="#FDE047" />
                          <rect x={frogX + 6} y={frogY - 6} width="5" height="1" fill="#FDE047" />
                          <rect x={frogX + 8} y={frogY - 6} width="1" height="1" fill="#FFFFFF" />
                          {/* Golden Runed Hat Band */}
                          <rect x={frogX + 3} y={frogY} width="10" height="2" fill="#B45309" />
                          <rect x={frogX + 4} y={frogY} width="8" height="1" fill="#F59E0B" />
                          <rect x={frogX + 7} y={frogY} width="2" height="1" fill="#FEF08A" />
                          {/* Wide Indigo Brim with Cast Shadow */}
                          <rect x={frogX - 3} y={frogY + 2} width="22" height="3" fill="#0F172A" />
                          <rect x={frogX - 2} y={frogY + 2} width="20" height="2" fill="#312E81" />
                          <rect x={frogX - 1} y={frogY + 2} width="18" height="1" fill="#6366F1" />
                        </g>
                      )}

                      {/* E. Red Bandana */}
                      {config.hatId === 'bandana' && (
                        <g>
                          {/* Crimson Fabric Wrap with Fold Shading */}
                          <rect x={frogX - 2} y={frogY + 2} width="20" height="4" fill="#7F1D1D" />
                          <rect x={frogX - 1} y={frogY + 2} width="18" height="3" fill="#B91C1C" />
                          <rect x={frogX} y={frogY + 3} width="16" height="2" fill="#DC2626" />
                          <rect x={frogX + 1} y={frogY + 3} width="14" height="1" fill="#EF4444" />
                          {/* Paisley / Polka Pattern Dots */}
                          <rect x={frogX + 2} y={frogY + 3} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 6} y={frogY + 4} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 10} y={frogY + 3} width="1" height="1" fill="#FFFFFF" />
                          <rect x={frogX + 14} y={frogY + 4} width="1" height="1" fill="#FFFFFF" />
                          {/* Tied Ribbon Knot on Right */}
                          <rect x={frogX + 15} y={frogY + 4} width="4" height="5" fill="#7F1D1D" />
                          <rect x={frogX + 16} y={frogY + 4} width="3" height="4" fill="#DC2626" />
                          <rect x={frogX + 17} y={frogY + 5} width="2" height="2" fill="#EF4444" />
                        </g>
                      )}

                      {/* F. Winter Knit Beanie */}
                      {config.hatId === 'beanie' && (
                        <g>
                          {/* Fluffy Snow Pom-Pom */}
                          <rect x={frogX + 6} y={frogY - 9} width="4" height="4" fill="#E2E8F0" />
                          <rect x={frogX + 7} y={frogY - 9} width="2" height="2" fill="#FFFFFF" />
                          {/* 4-Tone Crimson Wool Beanie Dome */}
                          <rect x={frogX - 1} y={frogY - 6} width="18" height="8" fill="#7F1D1D" />
                          <rect x={frogX} y={frogY - 6} width="16" height="7" fill="#B91C1C" />
                          <rect x={frogX + 1} y={frogY - 5} width="14" height="5" fill="#DC2626" />
                          <rect x={frogX + 3} y={frogY - 4} width="10" height="3" fill="#EF4444" />
                          {/* Ribbed Knit Stripes */}
                          <rect x={frogX + 3} y={frogY - 5} width="1" height="6" fill="#991B1B" />
                          <rect x={frogX + 7} y={frogY - 5} width="1" height="6" fill="#991B1B" />
                          <rect x={frogX + 11} y={frogY - 5} width="1" height="6" fill="#991B1B" />
                          {/* Folded Waffle Cuff */}
                          <rect x={frogX - 2} y={frogY} width="20" height="3" fill="#991B1B" />
                          <rect x={frogX - 1} y={frogY} width="18" height="2" fill="#F87171" />
                          <rect x={frogX} y={frogY} width="16" height="1" fill="#FECACA" />
                        </g>
                      )}

                      {/* G. Chef Toque */}
                      {config.hatId === 'chef' && (
                        <g>
                          {/* Puffy Chef Toque Folds with Soft Shading */}
                          <rect x={frogX} y={frogY - 11} width="16" height="11" fill="#94A3B8" />
                          <rect x={frogX + 1} y={frogY - 11} width="14" height="10" fill="#CBD5E1" />
                          <rect x={frogX + 2} y={frogY - 10} width="12" height="9" fill="#F8FAFC" />
                          <rect x={frogX + 3} y={frogY - 9} width="10" height="7" fill="#FFFFFF" />
                          {/* Vertical Pleats */}
                          <rect x={frogX + 4} y={frogY - 9} width="1" height="6" fill="#E2E8F0" />
                          <rect x={frogX + 8} y={frogY - 10} width="1" height="7" fill="#E2E8F0" />
                          <rect x={frogX + 12} y={frogY - 9} width="1" height="6" fill="#E2E8F0" />
                          {/* Stiff Starched Hatband */}
                          <rect x={frogX - 2} y={frogY} width="20" height="3" fill="#64748B" />
                          <rect x={frogX - 1} y={frogY} width="18" height="2" fill="#E2E8F0" />
                          <rect x={frogX} y={frogY} width="16" height="1" fill="#FFFFFF" />
                        </g>
                      )}

                      {/* H. Royal Golden Crown */}
                      {config.hatId === 'crown' && (
                        <g>
                          {/* 5-Tone Gilded Gold Crown Spikes with Gemstones */}
                          <rect x={frogX - 1} y={frogY - 5} width="18" height="8" fill="#78350F" />
                          {/* Left Spike */}
                          <rect x={frogX} y={frogY - 4} width="4" height="6" fill="#D97706" />
                          <rect x={frogX + 1} y={frogY - 3} width="2" height="4" fill="#FACC15" />
                          <rect x={frogX + 1} y={frogY - 3} width="1" height="1" fill="#FEF08A" />
                          <rect x={frogX + 1} y={frogY - 1} width="2" height="2" fill="#DC2626" />
                          <rect x={frogX + 1} y={frogY - 1} width="1" height="1" fill="#FFFFFF" />
                          {/* Center Tall Spike */}
                          <rect x={frogX + 6} y={frogY - 6} width="4" height="8" fill="#D97706" />
                          <rect x={frogX + 7} y={frogY - 5} width="2" height="6" fill="#FACC15" />
                          <rect x={frogX + 7} y={frogY - 5} width="1" height="1" fill="#FEF08A" />
                          <rect x={frogX + 7} y={frogY - 2} width="2" height="2" fill="#2563EB" />
                          <rect x={frogX + 7} y={frogY - 2} width="1" height="1" fill="#FFFFFF" />
                          {/* Right Spike */}
                          <rect x={frogX + 12} y={frogY - 4} width="4" height="6" fill="#D97706" />
                          <rect x={frogX + 13} y={frogY - 3} width="2" height="4" fill="#FACC15" />
                          <rect x={frogX + 13} y={frogY - 3} width="1" height="1" fill="#FEF08A" />
                          <rect x={frogX + 13} y={frogY - 1} width="2" height="2" fill="#16A34A" />
                          <rect x={frogX + 13} y={frogY - 1} width="1" height="1" fill="#FFFFFF" />
                          {/* Crown Circlet Base */}
                          <rect x={frogX - 2} y={frogY + 1} width="20" height="3" fill="#78350F" />
                          <rect x={frogX - 1} y={frogY + 1} width="18" height="2" fill="#F59E0B" />
                          <rect x={frogX} y={frogY + 1} width="16" height="1" fill="#FEF08A" />
                        </g>
                      )}

                      {/* I. Artist Beret */}
                      {config.hatId === 'beret' && (
                        <g>
                          {/* Stalk / Tab */}
                          <rect x={frogX + 7} y={frogY - 5} width="2" height="3" fill="#450A0A" />
                          {/* 4-Tone Parisian Burgundy Wool Beret */}
                          <rect x={frogX - 3} y={frogY - 3} width="22" height="6" fill="#450A0A" />
                          <rect x={frogX - 2} y={frogY - 3} width="20" height="5" fill="#881337" />
                          <rect x={frogX - 1} y={frogY - 2} width="18" height="4" fill="#BE123C" />
                          <rect x={frogX} y={frogY - 2} width="14" height="2" fill="#FB7185" />
                          {/* Slanted Side Fold Shading */}
                          <rect x={frogX - 3} y={frogY} width="4" height="3" fill="#450A0A" />
                          <rect x={frogX - 1} y={frogY + 2} width="18" height="1" fill="#450A0A" />
                        </g>
                      )}

                      {/* J. Tropical Flower */}
                      {config.hatId === 'flower' && (
                        <g>
                          {/* 5-Tone Radiant Sunlight Plumeria Blossom Behind Right Ear */}
                          <rect x={frogX + 13} y={frogY - 2} width="6" height="6" fill="#B45309" />
                          <rect x={frogX + 14} y={frogY - 1} width="5" height="5" fill="#FDE047" />
                          <rect x={frogX + 15} y={frogY} width="3" height="3" fill="#FEF08A" />
                          {/* Petal Highlights */}
                          <rect x={frogX + 15} y={frogY - 2} width="2" height="2" fill="#FFFFFF" />
                          <rect x={frogX + 18} y={frogY + 1} width="2" height="2" fill="#FFFFFF" />
                          <rect x={frogX + 13} y={frogY + 1} width="2" height="2" fill="#FFFFFF" />
                          {/* Warm Amber Center */}
                          <rect x={frogX + 15} y={frogY + 1} width="2" height="2" fill="#EA580C" />
                          <rect x={frogX + 16} y={frogY + 1} width="1" height="1" fill="#DC2626" />
                        </g>
                      )}

                      {/* K. Lo-Fi Headphones */}
                      {config.hatId === 'headphone' && (
                        <g>
                          {/* Cushioned Top Headband Arch */}
                          <rect x={frogX - 2} y={frogY - 4} width="20" height="3" fill="#0F172A" />
                          <rect x={frogX - 1} y={frogY - 4} width="18" height="2" fill="#1E293B" />
                          <rect x={frogX} y={frogY - 4} width="16" height="1" fill="#475569" />
                          {/* Metal Adjustable Sliders */}
                          <rect x={frogX - 3} y={frogY - 1} width="2" height="4" fill="#94A3B8" />
                          <rect x={frogX + 17} y={frogY - 1} width="2" height="4" fill="#94A3B8" />
                          {/* Left Earcup with Soft Blue Velvet Cushion */}
                          <rect x={frogX - 4} y={frogY + 2} width="4" height="9" fill="#0F172A" />
                          <rect x={frogX - 3} y={frogY + 3} width="3" height="7" fill="#2563EB" />
                          <rect x={frogX - 2} y={frogY + 4} width="2" height="5" fill="#60A5FA" />
                          <rect x={frogX - 2} y={frogY + 5} width="1" height="2" fill="#FFFFFF" />
                          {/* Right Earcup with Soft Blue Velvet Cushion */}
                          <rect x={frogX + 16} y={frogY + 2} width="4" height="9" fill="#0F172A" />
                          <rect x={frogX + 16} y={frogY + 3} width="3" height="7" fill="#2563EB" />
                          <rect x={frogX + 16} y={frogY + 4} width="2" height="5" fill="#60A5FA" />
                          <rect x={frogX + 17} y={frogY + 5} width="1" height="2" fill="#FFFFFF" />
                        </g>
                      )}

                      {/* L. Detective Cap */}
                      {config.hatId === 'detective' && (
                        <g>
                          {/* Crown of Cap with Houndstooth Tone */}
                          <rect x={frogX - 1} y={frogY - 6} width="18" height="8" fill="#451A03" />
                          <rect x={frogX} y={frogY - 5} width="16" height="6" fill="#78350F" />
                          <rect x={frogX + 1} y={frogY - 5} width="14" height="4" fill="#92400E" />
                          <rect x={frogX + 2} y={frogY - 4} width="12" height="2" fill="#B45309" />
                          {/* Center Button on Crown */}
                          <rect x={frogX + 7} y={frogY - 7} width="2" height="2" fill="#451A03" />
                          {/* Dual Visor Peaks (Front & Back) */}
                          <rect x={frogX - 4} y={frogY} width="24" height="3" fill="#451A03" />
                          <rect x={frogX - 3} y={frogY} width="22" height="2" fill="#78350F" />
                          <rect x={frogX - 2} y={frogY} width="20" height="1" fill="#D97706" />
                          {/* Ear Flap Ribbon Tied on Top */}
                          <rect x={frogX + 6} y={frogY - 6} width="4" height="2" fill="#18181B" />
                        </g>
                      )}

                      {/* M. Samurai Kabuto */}
                      {config.hatId === 'samurai' && (
                        <g>
                          {/* Golden Crescent Maedate Crest */}
                          <rect x={frogX + 7} y={frogY - 9} width="2" height="5" fill="#78350F" />
                          <rect x={frogX + 7} y={frogY - 9} width="2" height="4" fill="#FACC15" />
                          <rect x={frogX + 3} y={frogY - 7} width="10" height="3" fill="#78350F" />
                          <rect x={frogX + 4} y={frogY - 7} width="8" height="2" fill="#FACC15" />
                          <rect x={frogX + 5} y={frogY - 6} width="6" height="1" fill="#FEF08A" />
                          <rect x={frogX + 7} y={frogY - 5} width="2" height="2" fill="#DC2626" />
                          {/* Lacquered Steel Bowl (Hachi) */}
                          <rect x={frogX - 2} y={frogY - 3} width="20" height="5" fill="#09090B" />
                          <rect x={frogX - 1} y={frogY - 3} width="18" height="4" fill="#18181B" />
                          <rect x={frogX} y={frogY - 2} width="16" height="2" fill="#3F3F46" />
                          {/* Shikoro Neck Guard Flaps */}
                          <rect x={frogX - 4} y={frogY + 1} width="24" height="3" fill="#7F1D1D" />
                          <rect x={frogX - 3} y={frogY + 1} width="22" height="2" fill="#DC2626" />
                          <rect x={frogX - 2} y={frogY + 1} width="20" height="1" fill="#FCA5A5" />
                          {/* Golden Corner Rivets */}
                          <rect x={frogX - 3} y={frogY + 2} width="2" height="2" fill="#FACC15" />
                          <rect x={frogX + 17} y={frogY + 2} width="2" height="2" fill="#FACC15" />
                        </g>
                      )}

                      {/* Camping Set: Ranger Safari Hat */}
                      {config.hatId === 'ranger_safari_hat' && (
                        <g id="scene-hat-ranger-safari">
                          {/* Wide Canvas Brim */}
                          <rect x={frogX - 4} y={frogY + 1} width="24" height="3" fill="#4D7C0F" />
                          <rect x={frogX - 2} y={frogY + 1} width="20" height="1" fill="#65A30D" />
                          {/* Crown of Hat */}
                          <rect x={frogX} y={frogY - 6} width="16" height="7" fill="#4D7C0F" />
                          <rect x={frogX + 2} y={frogY - 7} width="12" height="2" fill="#365314" />
                          {/* Leather Hatband & Pine Tree Badge */}
                          <rect x={frogX} y={frogY - 1} width="16" height="2" fill="#78350F" />
                          <rect x={frogX + 6} y={frogY - 3} width="4" height="3" fill="#FACC15" stroke="#92400E" strokeWidth="0.4" />
                          <rect x={frogX + 7} y={frogY - 2} width="2" height="1" fill="#15803D" />
                          {/* Chin Cord Loop */}
                          <rect x={frogX - 2} y={frogY + 4} width="1" height="4" fill="#78350F" />
                          <rect x={frogX + 17} y={frogY + 4} width="1" height="4" fill="#78350F" />
                          <rect x={frogX + 7} y={frogY + 8} width="2" height="1" fill="#FDE047" />
                        </g>
                      )}

                      {/* Camping Set: Marshmallow Beanie */}
                      {config.hatId === 'marshmallow_beanie' && (
                        <g id="scene-hat-marshmallow-beanie">
                          {/* Fluffy Pom-Pom at top */}
                          <rect x={frogX + 6} y={frogY - 9} width="4" height="3" fill="#FEF3C7" />
                          <rect x={frogX + 7} y={frogY - 10} width="2" height="1" fill="#FEF3C7" />
                          {/* Mustard Knit Beanie Crown */}
                          <rect x={frogX - 1} y={frogY - 6} width="18" height="8" fill="#D97706" />
                          <rect x={frogX + 1} y={frogY - 7} width="14" height="2" fill="#B45309" />
                          {/* Folded Waffle Cuff */}
                          <rect x={frogX - 2} y={frogY} width="20" height="3" fill="#B45309" />
                          {/* Toasted Marshmallow Patch */}
                          <rect x={frogX + 6} y={frogY - 3} width="4" height="4" fill="#FEF3C7" stroke="#78350F" strokeWidth="0.4" />
                          <rect x={frogX + 7} y={frogY - 2} width="2" height="1" fill="#78350F" />
                        </g>
                      )}

                      {/* Camping Set: Night Scout Headlamp */}
                      {config.hatId === 'scout_headlamp' && (
                        <g id="scene-hat-scout-headlamp">
                          {/* Camo Elastic Headband */}
                          <rect x={frogX - 2} y={frogY + 1} width="20" height="2.5" fill="#365314" />
                          <rect x={frogX + 2} y={frogY + 1} width="3" height="2.5" fill="#4D7C0F" />
                          <rect x={frogX + 11} y={frogY + 1} width="3" height="2.5" fill="#4D7C0F" />
                          {/* LED Lamp Body */}
                          <rect x={frogX + 5} y={frogY - 2} width="6" height="5" fill="#18181B" stroke="#374151" strokeWidth="0.4" />
                          {/* Bright Glowing LED Lens */}
                          <rect x={frogX + 6} y={frogY - 1} width="4" height="3" fill="#38BDF8" />
                          <rect x={frogX + 7} y={frogY} width="2" height="1" fill="#FFFFFF" />
                          {/* Illuminated Forward Night Beam Fan - Stepped Pixel Beam */}
                          <g opacity="0.35" fill="#FEF08A">
                            <rect x={frogX + 12} y={frogY - 1} width="5" height="4" />
                            <rect x={frogX + 17} y={frogY - 4} width="5" height="10" />
                            <rect x={frogX + 22} y={frogY - 7} width="5" height="16" />
                            <rect x={frogX + 27} y={frogY - 10} width="5" height="22" />
                          </g>
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
