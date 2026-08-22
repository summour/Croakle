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

export const getSkinColors = (skinId?: FrogSkinId) => {
  switch (skinId) {
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
      <ellipse cx={frogX + 8} cy={frogY + 28} rx="18" ry="4" fill="#000000" opacity="0.18" />

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
          <rect x={frogX - 1} y={frogY + 11} width="18" height="10" fill="#334155" />
          <polygon points={`${frogX + 4},${frogY + 11} ${frogX + 12},${frogY + 11} ${frogX + 8},${frogY + 18}`} fill="#FFFFFF" />
          <rect x={frogX + 6} y={frogY + 12} width="4" height="2" fill="#DC2626" />
        </g>
      )}

      {config.outfitId === 'hoodie' && (
        <g>
          <rect x={frogX - 3} y={frogY + 7} width="22" height="14" fill="#10B981" />
          <rect x={frogX - 1} y={frogY + 5} width="4" height="3" fill="#059669" />
          <rect x={frogX + 13} y={frogY + 5} width="4" height="3" fill="#059669" />
          <rect x={frogX + 3} y={frogY + 14} width="10" height="5" fill="#059669" />
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
          <line x1={frogX - 2} y1={frogY + 5} x2={frogX + 18} y2={frogY + 11} stroke="#1C1917" strokeWidth="1" />
        </g>
      )}

      {/* HAT LAYER */}
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
          <polygon points={`${frogX + 8},${frogY - 5} ${frogX - 3},${frogY + 2} ${frogX + 19},${frogY + 2}`} fill="#FDE68A" />
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
          <polygon points={`${frogX + 8},${frogY - 10} ${frogX},${frogY + 2} ${frogX + 16},${frogY + 2}`} fill="#1E1B4B" />
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
          <circle cx={frogX + 8} cy={frogY - 5} r="2.5" fill="#FFFFFF" />
          <rect x={frogX} y={frogY - 3} width="16" height="5" fill="#DC2626" />
          <rect x={frogX - 1} y={frogY + 1} width="18" height="3" fill="#F87171" />
        </g>
      )}

      {config.hatId === 'chef' && (
        <g>
          <rect x={frogX} y={frogY - 8} width="16" height="8" fill="#FFFFFF" />
          <circle cx={frogX + 3} cy={frogY - 8} r="3" fill="#FFFFFF" />
          <circle cx={frogX + 8} cy={frogY - 9} r="3.5" fill="#FFFFFF" />
          <circle cx={frogX + 13} cy={frogY - 8} r="3" fill="#FFFFFF" />
          <rect x={frogX - 1} y={frogY} width="18" height="2" fill="#E2E8F0" />
        </g>
      )}

      {config.hatId === 'crown' && (
        <g>
          <polygon points={`${frogX},${frogY - 4} ${frogX + 3},${frogY} ${frogX + 8},${frogY - 6} ${frogX + 13},${frogY} ${frogX + 16},${frogY - 4} ${frogX + 16},${frogY + 2} ${frogX},${frogY + 2}`} fill="#FACC15" />
          <rect x={frogX} y={frogY + 1} width="16" height="2" fill="#EAB308" />
          <rect x={frogX + 7} y={frogY} width="2" height="2" fill="#DC2626" />
        </g>
      )}

      {config.hatId === 'beret' && (
        <g>
          <ellipse cx={frogX + 8} cy={frogY} rx="11" ry="3.5" fill="#78350F" />
          <rect x={frogX + 7} y={frogY - 4} width="2" height="2" fill="#451A03" />
        </g>
      )}

      {config.hatId === 'flower' && (
        <g>
          <circle cx={frogX + 16} cy={frogY + 2} r="3" fill="#FEF08A" />
          <circle cx={frogX + 16} cy={frogY + 2} r="1.5" fill="#EA580C" />
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
          <ellipse cx={frogX + 8} cy={frogY} rx="12" ry="3" fill="#78350F" />
          <rect x={frogX + 2} y={frogY - 4} width="12" height="4" fill="#92400E" />
          <rect x={frogX - 3} y={frogY + 1} width="22" height="1.5" fill="#451A03" />
        </g>
      )}

      {config.hatId === 'samurai' && (
        <g>
          <rect x={frogX} y={frogY - 2} width="16" height="4" fill="#18181B" />
          <polygon points={`${frogX + 8},${frogY - 8} ${frogX + 2},${frogY - 1} ${frogX + 14},${frogY - 1}`} fill="#CA8A04" />
          <rect x={frogX + 7} y={frogY - 3} width="2" height="2" fill="#DC2626" />
        </g>
      )}

      {/* PROPS / HANDHELD ITEM */}
      {config.activityId === 'tea' && (
        <g>
          <rect x={frogX + 5} y={frogY + 14} width="6" height="5" fill="#BBF7D0" />
          <rect x={frogX + 6} y={frogY + 13} width="4" height="2" fill="#15803D" />
        </g>
      )}

      {config.activityId === 'coffee' && (
        <g>
          <rect x={frogX + 5} y={frogY + 14} width="6" height="5" fill="#FFFFFF" />
          <rect x={frogX + 6} y={frogY + 13} width="4" height="2" fill="#78350F" />
          <rect x={frogX + 10} y={frogY + 15} width="2" height="3" fill="#E2E8F0" />
        </g>
      )}

      {config.activityId === 'boba' && (
        <g>
          <rect x={frogX + 5} y={frogY + 13} width="6" height="7" fill="#FED7AA" />
          <rect x={frogX + 7} y={frogY + 10} width="2" height="4" fill="#F43F5E" />
          <rect x={frogX + 6} y={frogY + 18} width="1" height="1" fill="#18181B" />
          <rect x={frogX + 8} y={frogY + 18} width="1" height="1" fill="#18181B" />
        </g>
      )}

      {config.activityId === 'reading' && (
        <g>
          <rect x={frogX + 2} y={frogY + 13} width="12" height="7" fill="#FDF2F8" />
          <rect x={frogX + 7} y={frogY + 13} width="2" height="7" fill="#DB2777" />
        </g>
      )}

      {config.activityId === 'eating' && (
        <g>
          <polygon points={`${frogX + 8},${frogY + 11} ${frogX + 4},${frogY + 17} ${frogX + 12},${frogY + 17}`} fill="#FFFFFF" />
          <rect x={frogX + 6} y={frogY + 15} width="4" height="2" fill="#18181B" />
        </g>
      )}

      {config.activityId === 'guitar' && (
        <g>
          <rect x={frogX + 6} y={frogY + 13} width="8" height="7" fill="#D97706" />
          <rect x={frogX + 9} y={frogY + 15} width="2" height="3" fill="#451A03" />
          <rect x={frogX + 13} y={frogY + 10} width="5" height="3" fill="#B45309" />
        </g>
      )}

      {config.activityId === 'painting' && (
        <g>
          <ellipse cx={frogX + 9} cy={frogY + 16} rx="6" ry="4" fill="#D97706" />
          <circle cx={frogX + 7} cy={frogY + 15} r="1" fill="#EF4444" />
          <circle cx={frogX + 9} cy={frogY + 14} r="1" fill="#3B82F6" />
          <circle cx={frogX + 11} cy={frogY + 15} r="1" fill="#EAB308" />
        </g>
      )}

      {config.activityId === 'camera' && (
        <g>
          <rect x={frogX + 4} y={frogY + 13} width="8" height="6" fill="#78350F" />
          <circle cx={frogX + 8} cy={frogY + 16} r="2" fill="#1E293B" />
        </g>
      )}

      {config.activityId === 'wand' && (
        <g>
          <line x1={frogX + 12} y1={frogY + 18} x2={frogX + 18} y2={frogY + 8} stroke="#CA8A04" strokeWidth="1.5" />
          <polygon points={`${frogX + 18},${frogY + 5} ${frogX + 16},${frogY + 10} ${frogX + 21},${frogY + 8}`} fill="#FACC15" />
        </g>
      )}

      {config.activityId === 'fishing' && (
        <g>
          <line x1={frogX + 10} y1={frogY + 18} x2={frogX + 24} y2={frogY + 2} stroke="#78350F" strokeWidth="1.5" />
          <line x1={frogX + 24} y1={frogY + 2} x2={frogX + 26} y2={frogY + 24} stroke="#94A3B8" strokeWidth="0.5" />
          <circle cx={frogX + 26} cy={frogY + 18} r="1.5" fill="#EF4444" />
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
}) => {
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

            {/* H. CELESTIAL CLOUD PALACE */}
            {config.sceneId === 'cloud_palace' && (
              <g>
                {/* Rainbow Arch */}
                <path d="M 10 70 Q 80 5 150 70" stroke="#F472B6" strokeWidth="3" fill="none" opacity="0.8" />
                <path d="M 14 70 Q 80 11 146 70" stroke="#FBBF24" strokeWidth="3" fill="none" opacity="0.8" />
                <path d="M 18 70 Q 80 17 142 70" stroke="#60A5FA" strokeWidth="3" fill="none" opacity="0.8" />

                {/* Floating Starlight Particles */}
                <circle cx="25" cy="25" r="2" fill="#FEF08A" className="animate-pulse" />
                <circle cx="135" cy="22" r="2" fill="#FEF08A" className="animate-pulse" />
                <circle cx="80" cy="18" r="2.5" fill="#FACC15" className="animate-pulse" />

                {/* Fluffy Pastel Clouds Platform */}
                <rect x="0" y="68" width="160" height="32" fill="#EDE9FE" />
                {/* Cloud Puffs */}
                <circle cx="30" cy="68" r="16" fill="#F5F3FF" />
                <circle cx="60" cy="65" r="18" fill="#FFFFFF" />
                <circle cx="80" cy="64" r="20" fill="#FFFFFF" />
                <circle cx="100" cy="65" r="18" fill="#FFFFFF" />
                <circle cx="130" cy="68" r="16" fill="#F5F3FF" />
                {/* Golden Cloud Trim */}
                <rect x="0" y="78" width="160" height="2" fill="#FDE047" opacity="0.6" />
              </g>
            )}

            {/* I. MISTY EMERALD BAMBOO GROVE */}
            {config.sceneId === 'bamboo_grove' && (
              <g>
                {/* Background Stalks */}
                <rect x="15" y="0" width="8" height="75" fill="#14532D" opacity="0.6" />
                <rect x="35" y="0" width="7" height="75" fill="#166534" opacity="0.6" />
                <rect x="120" y="0" width="8" height="75" fill="#14532D" opacity="0.6" />
                <rect x="140" y="0" width="7" height="75" fill="#166534" opacity="0.6" />

                {/* Foreground Bamboo Stalks */}
                <rect x="25" y="0" width="10" height="78" fill="#15803D" />
                <rect x="25" y="20" width="10" height="2" fill="#14532D" />
                <rect x="25" y="45" width="10" height="2" fill="#14532D" />

                <rect x="130" y="0" width="10" height="78" fill="#15803D" />
                <rect x="130" y="25" width="10" height="2" fill="#14532D" />
                <rect x="130" y="50" width="10" height="2" fill="#14532D" />

                {/* Hanging Paper Lantern */}
                <line x1="30" y1="20" x2="45" y2="35" stroke="#78350F" strokeWidth="1" />
                <rect x="42" y="35" width="8" height="12" fill="#DC2626" />
                <rect x="44" y="38" width="4" height="6" fill="#FEF08A" />
                <rect x="45" y="47" width="2" height="3" fill="#D97706" />

                {/* Mossy Forest Stone Pathway Floor */}
                <rect x="0" y="68" width="160" height="32" fill="#14532D" />
                <rect x="0" y="74" width="160" height="26" fill="#166534" />
                <ellipse cx="80" cy="80" rx="30" ry="10" fill="#475569" />
                <ellipse cx="80" cy="80" rx="26" ry="8" fill="#64748B" />
              </g>
            )}

            {/* 3. FROG CHARACTER (CENTERED AT X=70..90, Y=56..80) */}
            {/* Dynamic gentle breathing offset */}
            {(() => {
              const frogY = config.isAnimated && animTick % 2 === 0 ? 56 : 57;
              const frogX = 72;
              const skin = getSkinColors(config.skinId);

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
                          <polygon points={`${frogX + 4},${frogY + 11} ${frogX + 12},${frogY + 11} ${frogX + 8},${frogY + 17}`} fill="#FFFFFF" />
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
                          <line x1={frogX - 2} y1={frogY + 5} x2={frogX + 18} y2={frogY + 11} stroke="#1C1917" strokeWidth="1" />
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
                          <polygon
                            points={`${frogX + 8},${frogY + 10} ${frogX + 4},${frogY + 16} ${frogX + 12},${frogY + 16}`}
                            fill="#FFFFFF"
                          />
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
                          <ellipse cx={frogX + 9} cy={frogY + 15} rx="6" ry="4" fill="#D97706" />
                          <circle cx={frogX + 7} cy={frogY + 14} r="1" fill="#EF4444" />
                          <circle cx={frogX + 9} cy={frogY + 13} r="1" fill="#3B82F6" />
                          <circle cx={frogX + 11} cy={frogY + 14} r="1" fill="#EAB308" />
                          <rect x={frogX + 3} y={frogY + 14} width="2" height="3" fill={skin.main} />
                          <rect x={frogX + 11} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 8. Retro Camera */}
                      {config.activityId === 'camera' && (
                        <g>
                          <rect x={frogX + 4} y={frogY + 13} width="8" height="6" fill="#78350F" />
                          <circle cx={frogX + 8} cy={frogY + 16} r="2" fill="#1E293B" />
                          <rect x={frogX + 3} y={frogY + 14} width="2" height="3" fill={skin.main} />
                          <rect x={frogX + 11} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 9. Magic Starlight Wand */}
                      {config.activityId === 'wand' && (
                        <g>
                          <line x1={frogX + 12} y1={frogY + 16} x2={frogX + 18} y2={frogY + 8} stroke="#CA8A04" strokeWidth="1.5" />
                          <polygon points={`${frogX + 18},${frogY + 5} ${frogX + 16},${frogY + 10} ${frogX + 21},${frogY + 8}`} fill="#FACC15" />
                          <rect x={frogX + 11} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 10. Bamboo Fishing Rod */}
                      {config.activityId === 'fishing' && (
                        <g>
                          <line x1={frogX + 10} y1={frogY + 16} x2={frogX + 24} y2={frogY + 2} stroke="#78350F" strokeWidth="1.5" />
                          <line x1={frogX + 24} y1={frogY + 2} x2={frogX + 26} y2={frogY + 24} stroke="#94A3B8" strokeWidth="0.5" />
                          <circle cx={frogX + 26} cy={frogY + 18} r="1.5" fill="#EF4444" />
                          <rect x={frogX + 9} y={frogY + 14} width="2" height="3" fill={skin.main} />
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
                          <rect x={frogX + 12} y={frogY - 1} width="1" height="1" fill="#FFFFFF" />
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
                          <circle cx={frogX + 8} cy={frogY - 5} r="2.5" fill="#FFFFFF" />
                          <rect x={frogX} y={frogY - 3} width="16" height="5" fill="#DC2626" />
                          <rect x={frogX - 1} y={frogY + 1} width="18" height="3" fill="#F87171" />
                        </g>
                      )}

                      {/* G. Chef Toque */}
                      {config.hatId === 'chef' && (
                        <g>
                          <rect x={frogX} y={frogY - 8} width="16" height="8" fill="#FFFFFF" />
                          <circle cx={frogX + 3} cy={frogY - 8} r="3" fill="#FFFFFF" />
                          <circle cx={frogX + 8} cy={frogY - 9} r="3.5" fill="#FFFFFF" />
                          <circle cx={frogX + 13} cy={frogY - 8} r="3" fill="#FFFFFF" />
                          <rect x={frogX - 1} y={frogY} width="18" height="2" fill="#E2E8F0" />
                        </g>
                      )}

                      {/* H. Royal Golden Crown */}
                      {config.hatId === 'crown' && (
                        <g>
                          <polygon points={`${frogX},${frogY - 4} ${frogX + 3},${frogY} ${frogX + 8},${frogY - 6} ${frogX + 13},${frogY} ${frogX + 16},${frogY - 4} ${frogX + 16},${frogY + 2} ${frogX},${frogY + 2}`} fill="#FACC15" />
                          <rect x={frogX} y={frogY + 1} width="16" height="2" fill="#EAB308" />
                          <rect x={frogX + 7} y={frogY} width="2" height="2" fill="#DC2626" />
                        </g>
                      )}

                      {/* I. Artist Beret */}
                      {config.hatId === 'beret' && (
                        <g>
                          <ellipse cx={frogX + 8} cy={frogY} rx="11" ry="3.5" fill="#78350F" />
                          <rect x={frogX + 7} y={frogY - 4} width="2" height="2" fill="#451A03" />
                        </g>
                      )}

                      {/* J. Tropical Flower */}
                      {config.hatId === 'flower' && (
                        <g>
                          <circle cx={frogX + 16} cy={frogY + 2} r="3" fill="#FEF08A" />
                          <circle cx={frogX + 16} cy={frogY + 2} r="1.5" fill="#EA580C" />
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
                          <ellipse cx={frogX + 8} cy={frogY} rx="12" ry="3" fill="#78350F" />
                          <rect x={frogX + 2} y={frogY - 4} width="12" height="4" fill="#92400E" />
                          <rect x={frogX - 3} y={frogY + 1} width="22" height="1.5" fill="#451A03" />
                        </g>
                      )}

                      {/* M. Samurai Kabuto */}
                      {config.hatId === 'samurai' && (
                        <g>
                          <rect x={frogX} y={frogY - 2} width="16" height="4" fill="#18181B" />
                          <polygon points={`${frogX + 8},${frogY - 8} ${frogX + 2},${frogY - 1} ${frogX + 14},${frogY - 1}`} fill="#CA8A04" />
                          <rect x={frogX + 7} y={frogY - 3} width="2" height="2" fill="#DC2626" />
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
                <rect x="38" y={(animTick % 2 === 0 ? 70 : 72)} width="3" height="3" fill="#D95C3C" />
                <rect x="51" y={(animTick % 2 === 0 ? 72 : 70)} width="3" height="3" fill="#D95C3C" />
                <rect x="44" y="72" width="2" height="2" fill="#FFFFFF" />
                <rect x="48" y="72" width="2" height="2" fill="#FFFFFF" />
                <rect x="40" y="80" width="2" height="2" fill="#3A2218" />
                <rect x="50" y="80" width="2" height="2" fill="#3A2218" />
              </g>
            )}

            {/* C. Hotaru Fireflies Swarm */}
            {config.companionId === 'fireflies' && (
              <g id="companion-fireflies">
                <circle cx={35 + (animTick % 4) * 2} cy={45 + (animTick % 3)} r="1.5" fill="#FEF08A" className="animate-pulse" />
                <circle cx={125 - (animTick % 3) * 2} cy={38 + (animTick % 2)} r="2" fill="#FACC15" className="animate-pulse" />
                <circle cx={60 + (animTick % 5)} cy={30 - (animTick % 2)} r="1.5" fill="#FEF08A" className="animate-pulse" />
                <circle cx={100 + (animTick % 3)} cy={55 + (animTick % 4)} r="1.5" fill="#FACC15" className="animate-pulse" />
              </g>
            )}

            {/* D. Flutter Butterfly */}
            {config.companionId === 'butterfly' && (
              <g id="companion-butterfly" transform={`translate(${115 + (animTick % 4)}, ${42 + ((animTick * 2) % 6)})`}>
                <rect x="0" y="0" width="4" height="4" fill="#60A5FA" />
                <rect x="6" y="0" width="4" height="4" fill="#60A5FA" />
                <rect x="4" y="1" width="2" height="5" fill="#1E293B" />
              </g>
            )}

            {/* E. Koi Fish Swimming */}
            {config.companionId === 'koi' && (
              <g id="companion-koi" transform={`translate(${45 + ((animTick * 3) % 40)}, 82)`}>
                <ellipse cx="6" cy="3" rx="7" ry="3" fill="#EA580C" />
                <ellipse cx="4" cy="3" rx="3" ry="2" fill="#FFFFFF" />
                <polygon points="12,3 16,0 16,6" fill="#EA580C" />
              </g>
            )}

            {/* F. Duckling Companion */}
            {config.companionId === 'duckling' && (
              <g id="companion-duckling" transform={`translate(112, 74)`}>
                <ellipse cx="6" cy="5" rx="6" ry="4" fill="#FACC15" />
                <circle cx="3" cy="2" r="3" fill="#FACC15" />
                <rect x="0" y="2" width="2" height="2" fill="#EA580C" />
                <circle cx="3" cy="1" r="0.8" fill="#1E293B" />
              </g>
            )}

            {/* G. Cat Companion */}
            {config.companionId === 'cat' && (
              <g id="companion-cat" transform={`translate(42, 74)`}>
                <ellipse cx="6" cy="6" rx="6" ry="4" fill="#18181B" />
                <circle cx="10" cy="4" r="3" fill="#18181B" />
                <polygon points="9,1 11,1 10,0" fill="#18181B" />
                <polygon points="11,1 13,1 12,0" fill="#18181B" />
                <circle cx="11" cy="4" r="0.8" fill="#FDE047" />
                <rect x="8" y="5" width="4" height="1" fill="#DC2626" />
              </g>
            )}

            {/* H. Mossy Turtle */}
            {config.companionId === 'turtle' && (
              <g id="companion-turtle" transform={`translate(108, 76)`}>
                <ellipse cx="8" cy="4" rx="8" ry="4" fill="#78350F" />
                <ellipse cx="8" cy="3" rx="6" ry="3" fill="#15803D" />
                <circle cx="1" cy="4" r="2" fill="#166534" />
                <rect x="5" y="7" width="2" height="2" fill="#166534" />
                <rect x="11" y="7" width="2" height="2" fill="#166534" />
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
