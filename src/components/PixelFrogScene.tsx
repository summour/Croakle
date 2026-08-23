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

      {config.outfitId === 'red_riding_dress' && (
        <g>
          <rect x={frogX - 2} y={frogY + 10} width="20" height="10" fill="#BE123C" />
          <rect x={frogX + 1} y={frogY + 10} width="14" height="9" fill="#991B1B" />
          <rect x={frogX + 3} y={frogY + 11} width="10" height="8" fill="#FFFFFF" />
          <line x1={frogX + 6} y1={frogY + 12} x2={frogX + 10} y2={frogY + 14} stroke="#18181B" strokeWidth="1" />
          <line x1={frogX + 10} y1={frogY + 12} x2={frogX + 6} y2={frogY + 14} stroke="#18181B" strokeWidth="1" />
          <line x1={frogX + 6} y1={frogY + 14} x2={frogX + 10} y2={frogY + 16} stroke="#18181B" strokeWidth="1" />
          <line x1={frogX + 10} y1={frogY + 14} x2={frogX + 6} y2={frogY + 16} stroke="#18181B" strokeWidth="1" />
        </g>
      )}

      {config.outfitId === 'wolf_fur_cloak' && (
        <g>
          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#334155" rx="2" />
          <rect x={frogX - 2} y={frogY + 9} width="20" height="3" fill="#64748B" />
          <rect x={frogX + 2} y={frogY + 12} width="12" height="9" fill="#1E293B" />
          <polygon points={`${frogX + 6},${frogY + 10} ${frogX + 8},${frogY + 13} ${frogX + 10},${frogY + 10}`} fill="#FEF08A" />
          <circle cx={frogX + 8} cy={frogY + 10} r="1" fill="#DC2626" />
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
          <circle cx={frogX + 8} cy={frogY + 13} r="2" fill="#2563EB" />
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
          {/* White Polo Shirt Base */}
          <rect x={frogX - 2} y={frogY + 10} width="20" height="10" fill="#FFFFFF" />
          <rect x={frogX} y={frogY + 10} width="16" height="10" fill="#F8FAFC" />
          {/* Konbini Green Stripes & Collar */}
          <rect x={frogX - 2} y={frogY + 10} width="20" height="3" fill="#10B981" />
          <rect x={frogX + 6} y={frogY + 10} width="4" height="3" fill="#059669" />
          {/* Orange Accent Stripe */}
          <rect x={frogX - 2} y={frogY + 13} width="20" height="1.5" fill="#EA580C" />
          {/* Staff ID Name Badge */}
          <rect x={frogX + 11} y={frogY + 14} width="4" height="3" fill="#FEF08A" rx="0.5" stroke="#78350F" strokeWidth="0.5" />
          <rect x={frogX + 12} y={frogY + 15} width="2" height="1" fill="#1E293B" />
        </g>
      )}

      {config.outfitId === 'shopper_cozy_sweatset' && (
        <g>
          {/* Cozy Lavender/Heather Oversized Hoodie */}
          <rect x={frogX - 3} y={frogY + 8} width="22" height="13" fill="#8B5CF6" rx="1.5" />
          <rect x={frogX - 1} y={frogY + 7} width="18" height="12" fill="#A78BFA" rx="1" />
          {/* Kangaroo Pocket */}
          <rect x={frogX + 3} y={frogY + 14} width="10" height="5" fill="#7C3AED" rx="0.5" />
          <rect x={frogX + 5} y={frogY + 10} width="6" height="2" fill="#DDD6FE" />
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

      {config.glassesId === 'forest_blush_freckles' && (
        <g>
          <circle cx={frogX} cy={frogY + 10} r="1" fill="#DC2626" opacity="0.6" />
          <circle cx={frogX + 2} cy={frogY + 11} r="0.8" fill="#78350F" />
          <circle cx={frogX + 14} cy={frogY + 11} r="0.8" fill="#78350F" />
          <circle cx={frogX + 16} cy={frogY + 10} r="1" fill="#DC2626" opacity="0.6" />
        </g>
      )}

      {config.glassesId === 'wolf_snarl_fangs' && (
        <g>
          <polygon points={`${frogX + 5},${frogY + 10} ${frogX + 6},${frogY + 13} ${frogX + 7},${frogY + 10}`} fill="#FFFFFF" />
          <polygon points={`${frogX + 9},${frogY + 10} ${frogX + 10},${frogY + 13} ${frogX + 11},${frogY + 10}`} fill="#FFFFFF" />
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
          {/* Clerk Earpiece & Mic Boom */}
          <rect x={frogX - 3} y={frogY + 6} width="3" height="6" fill="#1E293B" rx="1" />
          <line x1={frogX - 1} y1={frogY + 4} x2={frogX + 6} y2={frogY - 1} stroke="#334155" strokeWidth="1" />
          <line x1={frogX - 2} y1={frogY + 10} x2={frogX + 4} y2={frogY + 12} stroke="#334155" strokeWidth="1" />
          <circle cx={frogX + 4} cy={frogY + 12} r="1" fill="#10B981" />
          <circle cx={frogX - 2} cy={frogY + 8} r="1" fill="#38BDF8" />
        </g>
      )}

      {config.glassesId === 'konbini_blush' && (
        <g>
          <rect x={frogX - 2} y={frogY + 9} width="3" height="2" fill="#FB7185" />
          <rect x={frogX + 15} y={frogY + 9} width="3" height="2" fill="#FB7185" />
          <circle cx={frogX} cy={frogY + 8} r="0.8" fill="#FDE047" />
          <circle cx={frogX + 16} cy={frogY + 8} r="0.8" fill="#FDE047" />
        </g>
      )}

      {/* HAT LAYER */}
      {config.hatId === 'red_riding_hood' && (
        <g>
          <rect x={frogX - 3} y={frogY - 4} width="22" height="16" fill="#DC2626" rx="2" />
          <rect x={frogX - 1} y={frogY - 6} width="18" height="3" fill="#B91C1C" />
          <rect x={frogX + 1} y={frogY - 2} width="14" height="2" fill="#FEF2F2" />
          <polygon points={`${frogX + 5},${frogY + 11} ${frogX + 8},${frogY + 13} ${frogX + 5},${frogY + 15}`} fill="#991B1B" />
          <polygon points={`${frogX + 11},${frogY + 11} ${frogX + 8},${frogY + 13} ${frogX + 11},${frogY + 15}`} fill="#991B1B" />
          <circle cx={frogX + 8} cy={frogY + 13} r="1.5" fill="#EF4444" />
        </g>
      )}

      {config.hatId === 'wolf_ears_hood' && (
        <g>
          <polygon points={`${frogX - 2},${frogY + 2} ${frogX + 2},${frogY - 8} ${frogX + 6},${frogY + 2}`} fill="#334155" />
          <polygon points={`${frogX},${frogY + 1} ${frogX + 2},${frogY - 6} ${frogX + 4},${frogY + 1}`} fill="#F472B6" />
          <polygon points={`${frogX + 10},${frogY + 2} ${frogX + 14},${frogY - 8} ${frogX + 18},${frogY + 2}`} fill="#334155" />
          <polygon points={`${frogX + 12},${frogY + 1} ${frogX + 14},${frogY - 6} ${frogX + 16},${frogY + 1}`} fill="#F472B6" />
          <rect x={frogX + 2} y={frogY - 1} width="12" height="3" fill="#475569" />
          <rect x={frogX + 6} y={frogY - 3} width="4" height="2" fill="#F1F5F9" />
        </g>
      )}

      {config.hatId === 'granny_nightcap' && (
        <g>
          <ellipse cx={frogX + 8} cy={frogY - 2} rx="12" ry="7" fill="#F8FAFC" />
          <ellipse cx={frogX + 8} cy={frogY - 2} rx="10" ry="5" fill="#F1F5F9" />
          <rect x={frogX - 3} y={frogY + 2} width="22" height="2" fill="#FBCFE8" />
          <circle cx={frogX + 8} cy={frogY + 3} r="1.5" fill="#EC4899" />
        </g>
      )}

      {config.hatId === 'sushi_salmon' && (
        <g>
          <rect x={frogX} y={frogY - 2} width="16" height="4" fill="#FFFFFF" rx="1" />
          <rect x={frogX - 2} y={frogY - 6} width="20" height="5" fill="#FB923C" rx="2" />
          <line x1={frogX} y1={frogY - 6} x2={frogX + 4} y2={frogY - 1} stroke="#FFF7ED" strokeWidth="1" />
          <line x1={frogX + 6} y1={frogY - 6} x2={frogX + 10} y2={frogY - 1} stroke="#FFF7ED" strokeWidth="1" />
          <line x1={frogX + 12} y1={frogY - 6} x2={frogX + 16} y2={frogY - 1} stroke="#FFF7ED" strokeWidth="1" />
          <rect x={frogX + 7} y={frogY - 6} width="2" height="8" fill="#14532D" />
        </g>
      )}

      {config.hatId === 'sushi_maguro' && (
        <g>
          <rect x={frogX} y={frogY - 2} width="16" height="4" fill="#FFFFFF" rx="1" />
          <rect x={frogX - 2} y={frogY - 6} width="20" height="5" fill="#BE123C" rx="2" />
          <rect x={frogX} y={frogY - 5} width="16" height="2" fill="#E11D48" />
          <rect x={frogX + 2} y={frogY - 5} width="4" height="1" fill="#FFFFFF" opacity="0.6" />
          <circle cx={frogX + 8} cy={frogY - 2} r="1" fill="#84CC16" />
        </g>
      )}

      {config.hatId === 'sushi_ebi' && (
        <g>
          <rect x={frogX} y={frogY - 2} width="16" height="4" fill="#FFFFFF" rx="1" />
          <rect x={frogX - 2} y={frogY - 6} width="18" height="5" fill="#EA580C" rx="2" />
          <rect x={frogX + 1} y={frogY - 6} width="2" height="5" fill="#FFFFFF" />
          <rect x={frogX + 5} y={frogY - 6} width="2" height="5" fill="#FFFFFF" />
          <rect x={frogX + 9} y={frogY - 6} width="2" height="5" fill="#FFFFFF" />
          <polygon points={`${frogX + 16},${frogY - 3} ${frogX + 21},${frogY - 7} ${frogX + 20},${frogY - 1}`} fill="#DC2626" />
          <polygon points={`${frogX + 16},${frogY - 3} ${frogX + 21},${frogY + 1} ${frogX + 20},${frogY - 1}`} fill="#EA580C" />
        </g>
      )}

      {config.hatId === 'sushi_chef_headband' && (
        <g>
          <rect x={frogX - 2} y={frogY + 2} width="20" height="3" fill="#FFFFFF" />
          <rect x={frogX - 1} y={frogY + 2} width="3" height="3" fill="#1E3A8A" />
          <rect x={frogX + 4} y={frogY + 2} width="3" height="3" fill="#1E3A8A" />
          <rect x={frogX + 9} y={frogY + 2} width="3" height="3" fill="#1E3A8A" />
          <rect x={frogX + 14} y={frogY + 2} width="3" height="3" fill="#1E3A8A" />
          <circle cx={frogX + 8} cy={frogY + 3.5} r="2" fill="#DC2626" />
        </g>
      )}

      {config.hatId === 'konbini_staff_visor' && (
        <g>
          {/* Clerk Visor Band */}
          <rect x={frogX - 3} y={frogY + 1} width="22" height="3" fill="#10B981" rx="0.5" />
          <rect x={frogX - 1} y={frogY + 1} width="18" height="1" fill="#34D399" />
          {/* Visor Peak Brim */}
          <polygon points={`${frogX - 5},${frogY + 2} ${frogX + 21},${frogY + 2} ${frogX + 18},${frogY - 2} ${frogX - 2},${frogY - 2}`} fill="#059669" />
          {/* Store Logo Emblem */}
          <circle cx={frogX + 8} cy={frogY + 2.5} r="1.2" fill="#FFFFFF" />
          <circle cx={frogX + 8} cy={frogY + 2.5} r="0.6" fill="#EA580C" />
        </g>
      )}

      {config.hatId === 'shopper_bucket_hat' && (
        <g>
          {/* Streetwear Bucket Hat Crown */}
          <polygon points={`${frogX - 2},${frogY + 1} ${frogX + 18},${frogY + 1} ${frogX + 16},${frogY - 6} ${frogX},${frogY - 6}`} fill="#7C3AED" />
          <rect x={frogX + 1} y={frogY - 5} width="14" height="2" fill="#8B5CF6" />
          {/* Down-angled Bucket Hat Brim */}
          <polygon points={`${frogX - 5},${frogY + 3} ${frogX + 21},${frogY + 3} ${frogX + 18},${frogY + 1} ${frogX - 2},${frogY + 1}`} fill="#6D28D9" />
          <circle cx={frogX + 8} cy={frogY - 2} r="1" fill="#FDE047" />
        </g>
      )}

      {config.hatId === 'onigiri_headband' && (
        <g>
          {/* Thin Black Headband */}
          <rect x={frogX - 2} y={frogY + 2} width="20" height="1.5" fill="#18181B" />
          {/* Triangle Onigiri on top of head */}
          <polygon points={`${frogX + 8},${frogY - 8} ${frogX + 3},${frogY - 1} ${frogX + 13},${frogY - 1}`} fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
          {/* Nori Seaweed Wrap */}
          <rect x={frogX + 6} y={frogY - 3} width="4" height="2.5" fill="#18181B" rx="0.5" />
          {/* Red Umeboshi Plum dot */}
          <circle cx={frogX + 8} cy={frogY - 4.5} r="0.8" fill="#DC2626" />
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

      {config.activityId === 'picnic_basket' && (
        <g>
          <rect x={frogX + 5} y={frogY + 13} width="10" height="7" fill="#D97706" rx="1" />
          <polygon points={`${frogX + 4},${frogY + 13} ${frogX + 10},${frogY + 11} ${frogX + 8},${frogY + 16}`} fill="#EF4444" />
          <rect x={frogX + 5} y={frogY + 12} width="2" height="2" fill="#FFFFFF" />
        </g>
      )}

      {config.activityId === 'woodcutter_axe' && (
        <g>
          <line x1={frogX + 11} y1={frogY + 18} x2={frogX + 18} y2={frogY + 5} stroke="#78350F" strokeWidth="1.5" />
          <polygon points={`${frogX + 16},${frogY + 5} ${frogX + 22},${frogY + 3} ${frogX + 20},${frogY + 9}`} fill="#94A3B8" />
        </g>
      )}

      {config.activityId === 'sushi_platter' && (
        <g>
          <rect x={frogX + 4} y={frogY + 14} width="12" height="5" fill="#D97706" rx="1" />
          <rect x={frogX + 5} y={frogY + 13} width="4" height="2" fill="#FB923C" />
          <rect x={frogX + 10} y={frogY + 13} width="4" height="2" fill="#BE123C" />
        </g>
      )}

      {config.activityId === 'tea_whisk' && (
        <g>
          <rect x={frogX + 4} y={frogY + 13} width="8" height="6" fill="#1E293B" rx="1" />
          <rect x={frogX + 5} y={frogY + 14} width="6" height="3" fill="#84CC16" />
          <line x1={frogX + 12} y1={frogY + 10} x2={frogX + 8} y2={frogY + 14} stroke="#FDE68A" strokeWidth="1.5" />
        </g>
      )}

      {config.activityId === 'konbini_scanner' && (
        <g>
          {/* Handheld Barcode Scanner Pistol */}
          <rect x={frogX + 10} y={frogY + 13} width="6" height="4" fill="#1E293B" rx="1" />
          <rect x={frogX + 14} y={frogY + 11} width="3" height="6" fill="#0F172A" rx="0.5" />
          <line x1={frogX + 16} y1={frogY + 14} x2={frogX + 24} y2={frogY + 14} stroke="#EF4444" strokeWidth="1" />
          <circle cx={frogX + 24} cy={frogY + 14} r="1" fill="#F87171" />
        </g>
      )}

      {config.activityId === 'eating_onigiri' && (
        <g>
          {/* Triangle Onigiri with bite mark */}
          <polygon points={`${frogX + 8},${frogY + 11} ${frogX + 3},${frogY + 17} ${frogX + 13},${frogY + 17}`} fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
          <rect x={frogX + 6} y={frogY + 15} width="4" height="2.5" fill="#18181B" rx="0.5" />
          <circle cx={frogX + 8} cy={frogY + 13} r="1" fill="#DC2626" />
        </g>
      )}

      {config.activityId === 'holding_konbini_bag' && (
        <g>
          {/* White Plastic Konbini Bag with Stripes */}
          <polygon points={`${frogX + 9},${frogY + 12} ${frogX + 17},${frogY + 12} ${frogX + 19},${frogY + 22} ${frogX + 7},${frogY + 22}`} fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.5" />
          <rect x={frogX + 9} y={frogY + 16} width="8" height="2" fill="#10B981" />
          <rect x={frogX + 9} y={frogY + 18} width="8" height="1" fill="#EA580C" />
          {/* Snacks peeking out */}
          <rect x={frogX + 10} y={frogY + 10} width="3" height="4" fill="#FACC15" />
          <rect x={frogX + 13} y={frogY + 11} width="2" height="3" fill="#EF4444" />
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
      case 'convenience_store':
        return ['🥤', '🍙', '✨', '💖', '🍡', '🍵', '🐾', '🛒', '🥟'];
      case 'red_riding_forest':
        return ['🍎', '🍄', '🐺', '🧺', '🌸', '✨', '🌲', '🐾'];
      case 'sauna_bathhouse':
        return ['♨️', '🪵', '🧼', '💧', '✨', '🧖', '🌿'];
      case 'sushi_bar':
        return ['🍣', '🍱', '🍵', '🍙', '🥢', '✨', '🐱'];
      case 'sakura_shrine':
        return ['🌸', '⛩️', '🏮', '🎐', '✨', '💖', '🍃'];
      case 'onsen':
        return ['♨️', '🍶', '🧖', '✨', '🌿', '🪵'];
      case 'tearoom':
        return ['🍵', '🍡', '🎋', '✨', '🌸', '🫖'];
      case 'night_camp':
        return ['🔥', '⛺', '⭐', '✨', '🪵', '🍢', '🌙'];
      case 'cloud_palace':
        return ['⭐', '☁️', '🌈', '✨', '👑', '🕊️'];
      case 'bamboo_grove':
        return ['🎋', '🍃', '🎍', '✨', '🐸', '💧'];
      case 'rainy_meadow':
        return ['🌧️', '🍄', '🐌', '🍀', '✨', '💧'];
      default:
        return ['🌸', '🍃', '✨', '🍵', '🐸', '💖', '☀️'];
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
          {/* Cozy Amber Horizon Sun */}
          <circle cx="80" cy="38" r="10" fill="#fef08a" />
          <circle cx="80" cy="38" r="14" fill="#fb923c" opacity="0.4" />
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
          <line x1="20" y1="10" x2="16" y2="22" stroke="#93c5fd" strokeWidth="1" opacity="0.5" />
          <line x1="50" y1="8" x2="46" y2="20" stroke="#93c5fd" strokeWidth="1" opacity="0.5" />
          <line x1="90" y1="12" x2="86" y2="24" stroke="#93c5fd" strokeWidth="1" opacity="0.5" />
          <line x1="130" y1="6" x2="126" y2="18" stroke="#93c5fd" strokeWidth="1" opacity="0.5" />
          <line x1="35" y1="28" x2="31" y2="40" stroke="#93c5fd" strokeWidth="1" opacity="0.5" />
          <line x1="110" y1="26" x2="106" y2="38" stroke="#93c5fd" strokeWidth="1" opacity="0.5" />
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
              <line x1="0" y1="-48" x2="25" y2="20" stroke="#cbb497" strokeWidth="1" />
              <line x1="160" y1="-48" x2="135" y2="20" stroke="#cbb497" strokeWidth="1" />
              <line x1="45" y1="-48" x2="55" y2="20" stroke="#cbb497" strokeWidth="0.8" />
              <line x1="115" y1="-48" x2="105" y2="20" stroke="#cbb497" strokeWidth="0.8" />
              <line x1="15" y1="-25" x2="145" y2="-25" stroke="#cbb497" strokeWidth="0.8" />
              <line x1="20" y1="-2" x2="140" y2="-2" stroke="#cbb497" strokeWidth="0.8" />

              {/* Glowing Circular Recessed Lights */}
              <circle cx="45" cy="-16" r="4" fill="#fef08a" opacity="0.9" />
              <circle cx="45" cy="-16" r="7" fill="#fde047" opacity="0.35" />
              <circle cx="115" cy="-16" r="4" fill="#fef08a" opacity="0.9" />
              <circle cx="115" cy="-16" r="7" fill="#fde047" opacity="0.35" />
              <circle cx="55" cy="8" r="4" fill="#fef08a" opacity="0.9" />
              <circle cx="55" cy="8" r="6.5" fill="#fde047" opacity="0.35" />
              <circle cx="105" cy="8" r="4" fill="#fef08a" opacity="0.9" />
              <circle cx="105" cy="8" r="6.5" fill="#fde047" opacity="0.35" />
            </g>
          ) : (
            <rect x="0" y="0" width="160" height="20" fill="#e7d7c1" />
          )}

          {/* Crown Molding Trim */}
          <rect x="0" y="18" width="160" height="4" fill="#8c6a48" />
          <rect x="0" y="20" width="160" height="1.5" fill="#b08b64" />

          {/* Back Wall with Warm Stone Bricks */}
          <rect x="0" y="22" width="160" height="48" fill="#d4be9c" />
          <line x1="0" y1="30" x2="160" y2="30" stroke="#bfa682" strokeWidth="0.75" />
          <line x1="0" y1="38" x2="160" y2="38" stroke="#bfa682" strokeWidth="0.75" />
          <line x1="0" y1="46" x2="160" y2="46" stroke="#bfa682" strokeWidth="0.75" />
          <line x1="0" y1="54" x2="160" y2="54" stroke="#bfa682" strokeWidth="0.75" />
          <line x1="0" y1="62" x2="160" y2="62" stroke="#bfa682" strokeWidth="0.75" />

          <line x1="20" y1="22" x2="20" y2="30" stroke="#bfa682" strokeWidth="0.6" />
          <line x1="40" y1="30" x2="40" y2="38" stroke="#bfa682" strokeWidth="0.6" />
          <line x1="25" y1="38" x2="25" y2="46" stroke="#bfa682" strokeWidth="0.6" />
          <line x1="140" y1="22" x2="140" y2="30" stroke="#bfa682" strokeWidth="0.6" />
          <line x1="125" y1="30" x2="125" y2="38" stroke="#bfa682" strokeWidth="0.6" />
          <line x1="135" y1="38" x2="135" y2="46" stroke="#bfa682" strokeWidth="0.6" />

          {/* Perspective Side Walls */}
          <polygon points="0,18 20,22 20,70 0,90" fill="#c4ad8a" />
          <polygon points="160,18 140,22 140,70 160,90" fill="#bfa682" />

          {/* Right Wall Decor: Framed Anime Art & Vending Machine */}
          <rect x="143" y="28" width="14" height="18" fill="#fdf2f8" stroke="#78350f" strokeWidth="0.8" />
          <circle cx="150" cy="37" r="4" fill="#f472b6" opacity="0.6" />

          <rect x="118" y="34" width="18" height="34" fill="#f8fafc" rx="1.5" stroke="#64748b" strokeWidth="0.7" />
          <rect x="120" y="37" width="14" height="14" fill="#0284c7" opacity="0.8" rx="1" />
          <circle cx="123" cy="42" r="1.5" fill="#22c55e" />
          <circle cx="127" cy="42" r="1.5" fill="#ef4444" />
          <circle cx="131" cy="42" r="1.5" fill="#f59e0b" />
          <circle cx="123" cy="47" r="1.5" fill="#38bdf8" />
          <circle cx="127" cy="47" r="1.5" fill="#eab308" />
          <circle cx="131" cy="47" r="1.5" fill="#ec4899" />
          <rect x="122" y="56" width="10" height="4" fill="#334155" rx="0.5" />

          {/* Trash Bin */}
          <polygon points="137,56 143,56 142,67 138,67" fill="#71717a" />

          {/* Left Wall Decor: Potted Green Plant */}
          <polygon points="12,56 18,56 17,66 13,66" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
          <ellipse cx="15" cy="48" rx="6" ry="8" fill="#15803d" />
          <ellipse cx="12" cy="51" rx="4" ry="5" fill="#16a34a" />
          <ellipse cx="18" cy="51" rx="4" ry="5" fill="#22c55e" />

          {/* Center Grand Romanesque Arched Sauna Doorway */}
          <path d="M 52 70 L 52 38 A 28 28 0 0 1 108 38 L 108 70 Z" fill="#85532a" stroke="#542e12" strokeWidth="1.5" />
          {/* Inner Arch Window / Sauna View */}
          <path d="M 58 66 L 58 40 A 22 22 0 0 1 102 40 L 102 66 Z" fill="#693b16" />
          {/* Warm Interior Glow & Sauna Benches */}
          <path d="M 62 52 L 62 42 A 18 18 0 0 1 98 42 L 98 52 Z" fill="#fef3c7" opacity="0.95" />
          <rect x="65" y="46" width="30" height="4" fill="#b45309" rx="0.5" />
          <rect x="68" y="42" width="8" height="4" fill="#d97706" rx="0.5" />
          <rect x="85" y="44" width="7" height="4" fill="#475569" rx="0.5" />

          {/* Digital LED Sign: 38.0°C */}
          <rect x="70" y="24" width="20" height="6" fill="#18181b" rx="1" stroke="#3f3f46" strokeWidth="0.5" />
          <text x="80" y="28.5" fill="#ef4444" fontSize="4" fontFamily="monospace" textAnchor="middle" fontWeight="bold">38.0°C</text>

          {/* Wooden Door Panels & Details */}
          <rect x="64" y="55" width="32" height="12" fill="#522a0e" rx="1" />
          <line x1="68" y1="57" x2="92" y2="57" stroke="#fef08a" strokeWidth="0.8" opacity="0.8" />
          <line x1="68" y1="60" x2="88" y2="60" stroke="#fef08a" strokeWidth="0.6" opacity="0.6" />
          <line x1="68" y1="63" x2="84" y2="63" stroke="#fef08a" strokeWidth="0.6" opacity="0.6" />

          {/* 3D Perspective Warm Tiled Floor */}
          <polygon points="0,70 160,70 160,280 0,280" fill="#dfc09c" />
          {/* Radial Floor Lines */}
          <line x1="20" y1="70" x2="-10" y2="280" stroke="#c9a780" strokeWidth="1" />
          <line x1="50" y1="70" x2="30" y2="280" stroke="#c9a780" strokeWidth="1" />
          <line x1="80" y1="70" x2="80" y2="280" stroke="#c9a780" strokeWidth="1" />
          <line x1="110" y1="70" x2="130" y2="280" stroke="#c9a780" strokeWidth="1" />
          <line x1="140" y1="70" x2="170" y2="280" stroke="#c9a780" strokeWidth="1" />
          {/* Horizontal Floor Tile Lines */}
          <line x1="0" y1="78" x2="160" y2="78" stroke="#c9a780" strokeWidth="0.8" />
          <line x1="0" y1="90" x2="160" y2="90" stroke="#c9a780" strokeWidth="1" />
          <line x1="0" y1="108" x2="160" y2="108" stroke="#c9a780" strokeWidth="1.2" />
          <line x1="0" y1="135" x2="160" y2="135" stroke="#c9a780" strokeWidth="1.4" />
          <line x1="0" y1="175" x2="160" y2="175" stroke="#c9a780" strokeWidth="1.6" />

          {/* Midground Furniture: Sleeping Mats */}
          <g>
            {/* Orange Futon Mat 1 */}
            <polygon points="36,78 58,78 50,88 28,88" fill="#fb923c" />
            <polygon points="28,88 50,88 49,90 27,90" fill="#c2410c" />
            <rect x="49" y="77" width="7" height="3" fill="#78350f" rx="1" />

            {/* Orange Futon Mat 2 */}
            <polygon points="64,80 86,80 78,90 56,90" fill="#fb923c" />
            <polygon points="56,90 78,90 77,92 55,92" fill="#c2410c" />
            <rect x="77" y="79" width="7" height="3" fill="#78350f" rx="1" />
          </g>

          {/* Foreground Tea Table on Right */}
          <g transform="translate(102, 78)">
            <polygon points="8,8 30,8 24,18 2,18" fill="#78350f" />
            <polygon points="2,18 24,18 23,21 1,21" fill="#451a03" />
            {/* Green Floor Cushion */}
            <polygon points="24,14 34,14 30,22 20,22" fill="#15803d" />
            <circle cx="27" cy="18" r="2.5" fill="#ca8a04" opacity="0.8" />
            {/* Steaming Bowl of Ramen / Matcha */}
            <ellipse cx="14" cy="12" rx="4" ry="2.5" fill="#f8fafc" />
            <circle cx="14" cy="11.5" r="2" fill="#eab308" />
          </g>

          {/* Mini Pedestal Table with Succulent in Center */}
          <ellipse cx="80" cy="98" rx="8" ry="3" fill="#93c5fd" opacity="0.4" />
          <ellipse cx="80" cy="96" rx="6" ry="2" fill="#a16207" />
          <rect x="79" y="96" width="2" height="4" fill="#78350f" />
          <ellipse cx="80" cy="93" rx="2.5" ry="1.5" fill="#ffffff" />
          <circle cx="80" cy="91" r="1.8" fill="#16a34a" />
        </g>
      )}

      {/* A. ZEN LOTUS POND SCENE */}
      {config.sceneId === 'zen_pond' && (
        <g>
          {/* Distant Soft Mountain Silhouette */}
          <polygon points="0,50 35,36 80,52" fill="#1e293b" opacity="0.45" />
          <polygon points="65,52 110,34 160,50" fill="#1e293b" opacity="0.45" />

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
          <rect x="106" y="12" width="40" height="34" fill="#382110" rx="4" />
          <rect x="108" y="14" width="36" height="30" fill="#60a5fa" rx="2" />
          <rect x="108" y="30" width="36" height="14" fill="#4b6e38" />
          <rect x="125" y="14" width="2" height="30" fill="#382110" />

          {/* Minimalist Bookshelf on Left */}
          <rect x="16" y="18" width="28" height="36" fill="#382110" rx="2" />
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

          {/* Minimalist Round Rug (Frog Stage) */}
          <ellipse cx="80" cy="78" rx="26" ry="10" fill="#d97706" />
          <ellipse cx="80" cy="78" rx="22" ry="8" fill="#fde68a" />
        </g>
      )}

      {/* C. SAKURA BLOSSOM SHRINE SCENE */}
      {config.sceneId === 'sakura_shrine' && (
        <g>
          {/* Mount Fuji Silhouette */}
          <polygon points="52,46 80,26 108,46" fill="#475569" opacity="0.6" />
          <polygon points="72,32 80,26 88,32" fill="#f8fafc" />

          {/* Minimalist Soft Sakura Canopy */}
          <rect x="0" y="30" width="48" height="24" fill="#f472b6" opacity="0.75" rx="6" />
          <rect x="112" y="28" width="48" height="26" fill="#f472b6" opacity="0.75" rx="6" />

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
          {/* Misty Evergreen Trees */}
          <polygon points="10,50 25,28 40,50" fill="#14532d" opacity="0.5" />
          <polygon points="120,50 135,26 150,50" fill="#14532d" opacity="0.5" />

          {/* Meadow Ground */}
          <rect x="0" y="52" width="160" height="48" fill="#15803d" />
          <rect x="0" y="62" width="160" height="38" fill="#166534" />

          {/* Minimalist Red Polka-Dot Mushroom on Left */}
          <rect x="22" y="48" width="6" height="22" fill="#f5f5f4" />
          <rect x="12" y="36" width="26" height="14" fill="#dc2626" rx="4" />
          <circle cx="18" cy="42" r="2" fill="#ffffff" />
          <circle cx="28" cy="40" r="2" fill="#ffffff" />

          {/* Small Mushroom on Right */}
          <rect x="132" y="56" width="4" height="12" fill="#f5f5f4" />
          <rect x="126" y="50" width="16" height="8" fill="#ea580c" rx="2" />
          <circle cx="134" cy="53" r="1.5" fill="#ffffff" />

          {/* Cozy Mossy Stone Platform (Frog Stage) */}
          <rect x="58" y="66" width="44" height="16" fill="#3f3f46" rx="4" />
          <rect x="62" y="64" width="36" height="6" fill="#65a30d" rx="2" />
        </g>
      )}

      {/* E. MOUNTAIN HOT SPRING (ONSEN) */}
      {config.sceneId === 'onsen' && (
        <g>
          {/* Distant Mountain Peak */}
          <polygon points="20,50 60,26 100,50" fill="#334155" opacity="0.4" />
          <polygon points="80,50 120,24 160,50" fill="#334155" opacity="0.4" />

          {/* Steaming Mineral Water Basin */}
          <rect x="0" y="56" width="160" height="44" fill="#3f3f46" />
          <rect x="16" y="62" width="128" height="34" fill="#06b6d4" rx="4" />
          <rect x="20" y="66" width="120" height="28" fill="#0891b2" rx="2" />

          {/* Soothing Steam Puffs */}
          <ellipse cx="45" cy={animTick % 2 === 0 ? 52 : 50} rx="8" ry="3" fill="#ffffff" opacity="0.4" />
          <ellipse cx="115" cy={animTick % 2 === 0 ? 50 : 48} rx="10" ry="3" fill="#ffffff" opacity="0.4" />

          {/* Wooden Bucket on Right */}
          <rect x="124" y="60" width="12" height="8" fill="#d97706" rx="1" />
          <rect x="126" y="58" width="6" height="3" fill="#ffffff" />

          {/* Smooth Warm River Rock (Frog Stage) */}
          <ellipse cx="80" cy="76" rx="20" ry="8" fill="#71717a" />
          <ellipse cx="80" cy="74" rx="16" ry="6" fill="#a1a1aa" />
        </g>
      )}

      {/* F. STARRY CAMPFIRE HAVEN */}
      {config.sceneId === 'night_camp' && (
        <g>
          {/* Distant Pine Trees in Night */}
          <polygon points="10,50 25,28 40,50" fill="#0f172a" />
          <polygon points="120,50 135,26 150,50" fill="#0f172a" />

          {/* Forest Ground */}
          <rect x="0" y="52" width="160" height="48" fill="#1e293b" />
          <rect x="0" y="62" width="160" height="38" fill="#0f172a" />

          {/* Minimalist A-Frame Tent on Right */}
          <polygon points="112,78 132,46 152,78" fill="#0284c7" />
          <polygon points="124,78 132,58 140,78" fill="#0f172a" />

          {/* Minimalist Crackling Campfire on Left */}
          <rect x="22" y="74" width="16" height="3" fill="#78350f" />
          <polygon points="26,74 30,60 34,74" fill="#ea580c" />
          <polygon points="28,74 30,64 32,74" fill="#facc15" />

          {/* Cozy Camp Mat (Frog Stage) */}
          <rect x="60" y="68" width="40" height="16" fill="#dc2626" rx="3" />
          <rect x="64" y="70" width="32" height="12" fill="#f87171" rx="2" />
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
          <rect x="130" y="40" width="12" height="6" fill="#1c1917" rx="1" />
          <rect x="134" y="32" width="3" height="8" fill="#78350f" />
          <circle cx="135" cy="28" r="7" fill="#15803d" />

          {/* Tatami Mats */}
          <rect x="0" y="62" width="160" height="38" fill="#d9f99d" />
          <rect x="0" y="76" width="160" height="2" fill="#365314" />

          {/* Low Wooden Table (Frog Stage) */}
          <rect x="58" y="66" width="44" height="14" fill="#78350f" rx="2" />
          <rect x="62" y="64" width="36" height="3" fill="#b45309" rx="1" />
        </g>
      )}

      {/* H. CELESTIAL CLOUD PALACE */}
      {config.sceneId === 'cloud_palace' && (
        <g>
          {/* Golden Starlight Particles */}
          <circle cx="28" cy="24" r="1.5" fill="#fef08a" />
          <circle cx="132" cy="20" r="1.5" fill="#fef08a" />
          <circle cx="80" cy="16" r="2" fill="#facc15" />

          {/* Dreamy Cloud Platform */}
          <rect x="0" y="66" width="160" height="34" fill="#ede9fe" />
          <circle cx="35" cy="66" r="14" fill="#ffffff" />
          <circle cx="65" cy="64" r="16" fill="#ffffff" />
          <circle cx="95" cy="64" r="16" fill="#ffffff" />
          <circle cx="125" cy="66" r="14" fill="#ffffff" />
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
          <line x1="26" y1="20" x2="38" y2="30" stroke="#78350f" strokeWidth="1" />
          <rect x="35" y="30" width="8" height="10" fill="#dc2626" rx="2" />
          <rect x="37" y="33" width="4" height="4" fill="#fef08a" />

          {/* Mossy Stepping Stone Pathway */}
          <rect x="0" y="66" width="160" height="34" fill="#14532d" />
          <ellipse cx="80" cy="78" rx="26" ry="9" fill="#475569" />
          <ellipse cx="80" cy="78" rx="22" ry="7" fill="#64748b" />
        </g>
      )}

      {/* J. FAIRYTALE RED RIDING FOREST */}
      {config.sceneId === 'red_riding_forest' && (
        <g>
          {/* Deep Evergreen Forest Trees */}
          <polygon points="10,54 28,18 46,54" fill="#064e3b" />
          <polygon points="26,50 42,22 58,50" fill="#065f46" opacity="0.8" />
          <polygon points="114,52 132,20 150,52" fill="#064e3b" />
          <polygon points="100,54 116,24 132,54" fill="#065f46" opacity="0.8" />

          {/* Cozy Thatched Cottage in Deep Background */}
          <polygon points="70,36 85,22 100,36" fill="#78350f" />
          <rect x="73" y="36" width="24" height="18" fill="#fde68a" />
          <rect x="78" y="42" width="6" height="12" fill="#92400e" />
          <rect x="88" y="39" width="6" height="6" fill="#f59e0b" />
          {/* Stone Chimney & Smoke Puff */}
          <rect x="91" y="24" width="4" height="8" fill="#64748b" />
          <circle cx="93" cy={animTick % 2 === 0 ? 18 : 16} r="2.5" fill="#ffffff" opacity="0.5" />

          {/* Forest Moss Ground & Trail */}
          <rect x="0" y="54" width="160" height="46" fill="#14532d" />
          <rect x="0" y="66" width="160" height="34" fill="#166534" />
          {/* Winding Cobblestone Trail */}
          <polygon points="40,100 68,54 92,54 120,100" fill="#78716c" opacity="0.5" />

          {/* Fairytale Red Toadstool Mushrooms */}
          <rect x="24" y="66" width="4" height="12" fill="#f5f5f4" />
          <rect x="18" y="58" width="16" height="9" fill="#dc2626" rx="3" />
          <circle cx="22" cy="62" r="1.5" fill="#ffffff" />
          <circle cx="30" cy="61" r="1.5" fill="#ffffff" />

          {/* Mossy Wood Log Bench (Frog Stage) */}
          <rect x="58" y="68" width="44" height="14" fill="#523218" rx="3" />
          <rect x="60" y="66" width="40" height="4" fill="#784a28" rx="2" />
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
          <rect x="12" y="6" width="40" height="22" fill="#1e3a8a" rx="1" />
          <rect x="56" y="6" width="48" height="22" fill="#1e3a8a" rx="1" />
          <rect x="108" y="6" width="40" height="22" fill="#1e3a8a" rx="1" />
          {/* White Emblem Pattern on Noren */}
          <circle cx="32" cy="17" r="4" fill="#ffffff" opacity="0.9" />
          <circle cx="80" cy="17" r="4" fill="#ffffff" opacity="0.9" />
          <circle cx="128" cy="17" r="4" fill="#ffffff" opacity="0.9" />

          {/* Warm Red Paper Izakaya Lanterns */}
          <rect x="18" y="30" width="10" height="14" fill="#dc2626" rx="3" />
          <rect x="21" y="33" width="4" height="8" fill="#fef08a" />
          <rect x="132" y="30" width="10" height="14" fill="#dc2626" rx="3" />
          <rect x="135" y="33" width="4" height="8" fill="#fef08a" />

          {/* Polished Hinoki Wood Counter (Frog Stage) */}
          <rect x="0" y="58" width="160" height="42" fill="#78350f" />
          <rect x="0" y="58" width="160" height="10" fill="#d97706" />
          <rect x="0" y="68" width="160" height="2" fill="#92400e" />

          {/* Wooden Nigiri Cutting Board Platform */}
          <rect x="56" y="64" width="48" height="16" fill="#fde68a" rx="2" />
          <rect x="58" y="66" width="44" height="12" fill="#fef3c7" rx="1" />
          <rect x="60" y="78" width="4" height="3" fill="#b45309" />
          <rect x="96" y="78" width="4" height="3" fill="#b45309" />
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
          <rect x="60" y="1" width="40" height="11" fill="#09090b" rx="1" stroke="#27272a" strokeWidth="0.5" />
          <text x="80" y="8" fill="#10b981" fontSize="5" fontFamily="monospace" textAnchor="middle" fontWeight="bold" letterSpacing="0.5">
            24h MART
          </text>
          <circle cx="64" cy="6.5" r="1.2" fill="#ef4444" className="animate-pulse" />
          <circle cx="96" cy="6.5" r="1.2" fill="#22c55e" />

          {/* Recessed Ceiling Neon Tube Lights */}
          <rect x="15" y="14" width="40" height="2" fill="#ffffff" opacity="0.85" />
          <rect x="105" y="14" width="40" height="2" fill="#ffffff" opacity="0.85" />
          <rect x="18" y="16" width="34" height="1" fill="#38bdf8" opacity="0.4" />
          <rect x="108" y="16" width="34" height="1" fill="#38bdf8" opacity="0.4" />

          {/* Back Store Wall Interior */}
          <rect x="0" y="14" width="160" height="46" fill="#f1f5f9" />
          <line x1="0" y1="28" x2="160" y2="28" stroke="#e2e8f0" strokeWidth="0.5" />
          <line x1="0" y1="42" x2="160" y2="42" stroke="#e2e8f0" strokeWidth="0.5" />

          {/* LEFT SIDE: Illuminated Glass Drink Cooler Display Case */}
          <rect x="4" y="18" width="48" height="42" fill="#0f172a" rx="1.5" stroke="#38bdf8" strokeWidth="0.8" />
          <rect x="6" y="20" width="44" height="38" fill="#0369a1" opacity="0.9" rx="1" />
          {/* Frosty Glass Backlight */}
          <rect x="8" y="22" width="40" height="34" fill="#0284c7" opacity="0.6" />

          {/* Cooler Shelves & Colorful Canned Drinks */}
          {/* Shelf 1 - Top: Green Melon Sodas & Canned Coffees */}
          <line x1="6" y1="28" x2="50" y2="28" stroke="#e0f2fe" strokeWidth="1" />
          <rect x="9" y="23" width="4" height="5" fill="#22c55e" rx="0.5" />
          <rect x="15" y="23" width="4" height="5" fill="#22c55e" rx="0.5" />
          <rect x="21" y="23" width="4" height="5" fill="#f59e0b" rx="0.5" />
          <rect x="27" y="23" width="4" height="5" fill="#ef4444" rx="0.5" />
          <rect x="33" y="23" width="4" height="5" fill="#3b82f6" rx="0.5" />
          <rect x="39" y="23" width="4" height="5" fill="#78350f" rx="0.5" />

          {/* Shelf 2 - Middle: Strawberry Milk & Bottled Teas */}
          <line x1="6" y1="38" x2="50" y2="38" stroke="#e0f2fe" strokeWidth="1" />
          <rect x="9" y="31" width="4" height="7" fill="#f472b6" rx="0.5" />
          <rect x="15" y="31" width="4" height="7" fill="#f472b6" rx="0.5" />
          <rect x="21" y="31" width="4" height="7" fill="#84cc16" rx="0.5" />
          <rect x="27" y="31" width="4" height="7" fill="#84cc16" rx="0.5" />
          <rect x="33" y="31" width="4" height="7" fill="#38bdf8" rx="0.5" />
          <rect x="39" y="31" width="4" height="7" fill="#ffffff" rx="0.5" />

          {/* Shelf 3 - Bottom: Giant Beverage Cartons */}
          <line x1="6" y1="48" x2="50" y2="48" stroke="#e0f2fe" strokeWidth="1" />
          <rect x="10" y="40" width="5" height="8" fill="#fb923c" rx="0.5" />
          <rect x="18" y="40" width="5" height="8" fill="#38bdf8" rx="0.5" />
          <rect x="26" y="40" width="5" height="8" fill="#a855f7" rx="0.5" />
          <rect x="34" y="40" width="5" height="8" fill="#10b981" rx="0.5" />

          {/* Cooler Digital Temp & Glass Glare */}
          <rect x="34" y="19" width="12" height="3" fill="#09090b" rx="0.5" />
          <text x="40" y="21.2" fill="#38bdf8" fontSize="2.2" fontFamily="monospace" textAnchor="middle">3.2°C</text>
          <line x1="12" y1="21" x2="44" y2="55" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />

          {/* RIGHT SIDE: Snack Aisle Racks & Hot Food Warmer Case */}
          {/* Multi-tier Snack Shelves */}
          <rect x="110" y="22" width="46" height="38" fill="#334155" rx="1" />
          {/* Shelf 1: Potato Chip Bags (Red, Blue, Yellow) */}
          <line x1="110" y1="31" x2="156" y2="31" stroke="#64748b" strokeWidth="1" />
          <rect x="113" y="24" width="6" height="7" fill="#ef4444" rx="1" />
          <rect x="121" y="24" width="6" height="7" fill="#3b82f6" rx="1" />
          <rect x="129" y="24" width="6" height="7" fill="#eab308" rx="1" />
          <rect x="137" y="24" width="6" height="7" fill="#10b981" rx="1" />
          <rect x="145" y="24" width="6" height="7" fill="#ec4899" rx="1" />

          {/* Shelf 2: Ramen Cup Noodles & Pocky Boxes */}
          <line x1="110" y1="41" x2="156" y2="41" stroke="#64748b" strokeWidth="1" />
          <polygon points="113,34 119,34 118,40 114,40" fill="#dc2626" />
          <polygon points="121,34 127,34 126,40 122,40" fill="#ea580c" />
          <rect x="129" y="33" width="4" height="8" fill="#dc2626" rx="0.5" />
          <rect x="135" y="33" width="4" height="8" fill="#78350f" rx="0.5" />
          <rect x="141" y="33" width="4" height="8" fill="#ec4899" rx="0.5" />
          <rect x="147" y="33" width="4" height="8" fill="#84cc16" rx="0.5" />

          {/* Shelf 3 / Hot Warmer Case on Counter Base */}
          <rect x="110" y="44" width="46" height="16" fill="#78350f" rx="1" stroke="#d97706" strokeWidth="0.8" />
          <rect x="112" y="46" width="42" height="12" fill="#fef3c7" opacity="0.95" rx="0.5" />
          {/* Steamy Buns / Karaage Golden Glow */}
          <circle cx="118" cy="51" r="3" fill="#f59e0b" />
          <circle cx="126" cy="51" r="3" fill="#f97316" />
          <circle cx="134" cy="51" r="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
          <circle cx="142" cy="51" r="3" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
          <text x="133" y="48" fill="#dc2626" fontSize="2.5" fontFamily="monospace" fontWeight="bold">HOT</text>

          {/* 3D Checkered Convenience Store Tiled Floor */}
          <polygon points="0,60 160,60 160,280 0,280" fill="#f8fafc" />
          {/* Floor Tile Grid Lines */}
          <line x1="0" y1="60" x2="160" y2="60" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="0" y1="72" x2="160" y2="72" stroke="#cbd5e1" strokeWidth="0.8" />
          <line x1="0" y1="88" x2="160" y2="88" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="0" y1="110" x2="160" y2="110" stroke="#cbd5e1" strokeWidth="1.2" />
          <line x1="0" y1="140" x2="160" y2="140" stroke="#cbd5e1" strokeWidth="1.4" />
          <line x1="0" y1="180" x2="160" y2="180" stroke="#cbd5e1" strokeWidth="1.6" />

          {/* Radial Perspective Tile Lines */}
          <line x1="20" y1="60" x2="-15" y2="280" stroke="#cbd5e1" strokeWidth="0.8" />
          <line x1="50" y1="60" x2="25" y2="280" stroke="#cbd5e1" strokeWidth="0.8" />
          <line x1="80" y1="60" x2="80" y2="280" stroke="#cbd5e1" strokeWidth="0.8" />
          <line x1="110" y1="60" x2="135" y2="280" stroke="#cbd5e1" strokeWidth="0.8" />
          <line x1="140" y1="60" x2="175" y2="280" stroke="#cbd5e1" strokeWidth="0.8" />

          {/* Alternating Soft Pastel Checker Accents */}
          <polygon points="50,60 80,60 76,72 45,72" fill="#ecfdf5" opacity="0.7" />
          <polygon points="110,60 140,60 144,72 113,72" fill="#ecfdf5" opacity="0.7" />
          <polygon points="15,72 45,72 38,88 5,88" fill="#eff6ff" opacity="0.7" />
          <polygon points="76,72 113,72 118,88 80,88" fill="#eff6ff" opacity="0.7" />
          <polygon points="38,88 80,88 80,110 30,110" fill="#ecfdf5" opacity="0.7" />
          <polygon points="118,88 160,88 160,110 126,110" fill="#ecfdf5" opacity="0.7" />

          {/* Red Plastic Shopping Basket on Floor on Left */}
          <g transform="translate(18, 68)">
            <polygon points="0,4 20,4 17,14 3,14" fill="#dc2626" />
            <polygon points="2,6 18,6 16,12 4,12" fill="#b91c1c" />
            <path d="M 4 4 Q 10 -2 16 4" stroke="#78350f" strokeWidth="1" fill="none" />
            {/* Bag of Chips & Drink inside basket */}
            <rect x="5" y="2" width="4" height="6" fill="#facc15" rx="0.5" />
            <rect x="11" y="1" width="3" height="6" fill="#22c55e" rx="0.5" />
          </g>

          {/* CENTER CASHIER CHECKOUT REGISTER COUNTER (Frog Stage) */}
          <g id="konbini-checkout-counter">
            {/* Front Counter Panel */}
            <rect x="52" y="62" width="56" height="20" fill="#ffffff" rx="2" stroke="#cbd5e1" strokeWidth="0.8" />
            <rect x="54" y="64" width="52" height="4" fill="#10b981" rx="1" />
            <rect x="54" y="70" width="52" height="1.5" fill="#ea580c" />
            <rect x="54" y="74" width="52" height="6" fill="#f8fafc" rx="0.5" />

            {/* Counter Surface / Platform */}
            <polygon points="48,62 112,62 110,58 50,58" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />

            {/* Digital POS Cash Register Terminal */}
            <rect x="92" y="48" width="14" height="12" fill="#1e293b" rx="1.5" stroke="#475569" strokeWidth="0.6" />
            {/* Glowing Screen Display */}
            <rect x="94" y="50" width="10" height="6" fill="#0284c7" rx="0.5" />
            <text x="99" y="54.5" fill="#ffffff" fontSize="2.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">¥850</text>
            <rect x="94" y="57" width="10" height="2" fill="#334155" />
            {/* Scanner Stand Cradle */}
            <line x1="88" y1="58" x2="90" y2="52" stroke="#64748b" strokeWidth="1" />
            <circle cx="90" cy="52" r="1.5" fill="#ef4444" />

            {/* Fresh Onigiri & Bento Staging Tray on Counter */}
            <rect x="54" y="58" width="14" height="4" fill="#fef3c7" rx="0.5" stroke="#d97706" strokeWidth="0.5" />
            <polygon points="57,59 61,59 60,61 58,61" fill="#ffffff" />
            <polygon points="63,59 67,59 66,61 64,61" fill="#ffffff" />
          </g>
        </g>
      )}

            {/* 3. FROG CHARACTER (DYNAMICALLY MOVING, HOPPING & INTERACTING ACROSS SCENE) */}
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
                  {/* Dynamic Frog Shadow */}
                  <ellipse
                    cx={frogX + 8}
                    cy={frogY + 25 - hopArc}
                    rx={14 * shadowScale}
                    ry={3 * shadowScale}
                    fill="#000000"
                    opacity={0.35 * shadowScale}
                  />

                  {/* Cute Action / Emotion Speech Bubble */}
                  {actionBubble && (
                    <g transform={`translate(${frogX + 8}, ${frogY - 6})`} className="animate-bounce">
                      <rect x="-8" y="-12" width="16" height="11" fill="#FFFFFF" rx="2" stroke="#18181B" strokeWidth="0.8" />
                      <polygon points="-2,-1 2,-1 0,2" fill="#FFFFFF" stroke="#18181B" strokeWidth="0.8" />
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

                      {config.outfitId === 'red_riding_dress' && (
                        <g>
                          <rect x={frogX - 2} y={frogY + 10} width="20" height="10" fill="#BE123C" />
                          <rect x={frogX + 1} y={frogY + 10} width="14" height="9" fill="#991B1B" />
                          <rect x={frogX + 3} y={frogY + 11} width="10" height="8" fill="#FFFFFF" />
                          <line x1={frogX + 6} y1={frogY + 12} x2={frogX + 10} y2={frogY + 14} stroke="#18181B" strokeWidth="1" />
                          <line x1={frogX + 10} y1={frogY + 12} x2={frogX + 6} y2={frogY + 14} stroke="#18181B" strokeWidth="1" />
                          <line x1={frogX + 6} y1={frogY + 14} x2={frogX + 10} y2={frogY + 16} stroke="#18181B" strokeWidth="1" />
                          <line x1={frogX + 10} y1={frogY + 14} x2={frogX + 6} y2={frogY + 16} stroke="#18181B" strokeWidth="1" />
                        </g>
                      )}

                      {config.outfitId === 'wolf_fur_cloak' && (
                        <g>
                          <rect x={frogX - 3} y={frogY + 9} width="22" height="12" fill="#334155" rx="2" />
                          <rect x={frogX - 2} y={frogY + 9} width="20" height="3" fill="#64748B" />
                          <rect x={frogX + 2} y={frogY + 12} width="12" height="9" fill="#1E293B" />
                          <polygon points={`${frogX + 6},${frogY + 10} ${frogX + 8},${frogY + 13} ${frogX + 10},${frogY + 10}`} fill="#FEF08A" />
                          <circle cx={frogX + 8} cy={frogY + 10} r="1" fill="#DC2626" />
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
                          <circle cx={frogX + 8} cy={frogY + 13} r="2" fill="#2563EB" />
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
                          <rect x={frogX + 11} y={frogY + 14} width="4" height="3" fill="#FEF08A" rx="0.5" stroke="#78350F" strokeWidth="0.5" />
                          <rect x={frogX + 12} y={frogY + 15} width="2" height="1" fill="#1E293B" />
                        </g>
                      )}

                      {config.outfitId === 'shopper_cozy_sweatset' && (
                        <g id="scene-outfit-shopper">
                          <rect x={frogX - 3} y={frogY + 8} width="22" height="13" fill="#8B5CF6" rx="1.5" />
                          <rect x={frogX - 1} y={frogY + 7} width="18" height="12" fill="#A78BFA" rx="1" />
                          <rect x={frogX + 3} y={frogY + 14} width="10" height="5" fill="#7C3AED" rx="0.5" />
                          <rect x={frogX + 5} y={frogY + 10} width="6" height="2" fill="#DDD6FE" />
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

                      {config.glassesId === 'forest_blush_freckles' && (
                        <g>
                          <circle cx={frogX} cy={frogY + 10} r="1" fill="#DC2626" opacity="0.6" />
                          <circle cx={frogX + 2} cy={frogY + 11} r="0.8" fill="#78350F" />
                          <circle cx={frogX + 14} cy={frogY + 11} r="0.8" fill="#78350F" />
                          <circle cx={frogX + 16} cy={frogY + 10} r="1" fill="#DC2626" opacity="0.6" />
                        </g>
                      )}

                      {config.glassesId === 'wolf_snarl_fangs' && (
                        <g>
                          <polygon points={`${frogX + 5},${frogY + 10} ${frogX + 6},${frogY + 13} ${frogX + 7},${frogY + 10}`} fill="#FFFFFF" />
                          <polygon points={`${frogX + 9},${frogY + 10} ${frogX + 10},${frogY + 13} ${frogX + 11},${frogY + 10}`} fill="#FFFFFF" />
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
                          <rect x={frogX - 3} y={frogY + 6} width="3" height="6" fill="#1E293B" rx="1" />
                          <line x1={frogX - 1} y1={frogY + 4} x2={frogX + 6} y2={frogY - 1} stroke="#334155" strokeWidth="1" />
                          <line x1={frogX - 2} y1={frogY + 10} x2={frogX + 4} y2={frogY + 12} stroke="#334155" strokeWidth="1" />
                          <circle cx={frogX + 4} cy={frogY + 12} r="1" fill="#10B981" />
                          <circle cx={frogX - 2} cy={frogY + 8} r="1" fill="#38BDF8" />
                        </g>
                      )}

                      {config.glassesId === 'konbini_blush' && (
                        <g id="scene-glasses-blush">
                          <rect x={frogX - 2} y={frogY + 9} width="3" height="2" fill="#FB7185" />
                          <rect x={frogX + 15} y={frogY + 9} width="3" height="2" fill="#FB7185" />
                          <circle cx={frogX} cy={frogY + 8} r="0.8" fill="#FDE047" />
                          <circle cx={frogX + 16} cy={frogY + 8} r="0.8" fill="#FDE047" />
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

                      {/* 11. Picnic Basket */}
                      {config.activityId === 'picnic_basket' && (
                        <g>
                          <rect x={frogX + 5} y={frogY + 13} width="10" height="7" fill="#D97706" rx="1" />
                          <polygon points={`${frogX + 4},${frogY + 13} ${frogX + 10},${frogY + 11} ${frogX + 8},${frogY + 16}`} fill="#EF4444" />
                          <rect x={frogX + 5} y={frogY + 12} width="2" height="2" fill="#FFFFFF" />
                          <rect x={frogX + 3} y={frogY + 14} width="2" height="3" fill={skin.main} />
                          <rect x={frogX + 13} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 12. Woodcutter Axe */}
                      {config.activityId === 'woodcutter_axe' && (
                        <g>
                          <line x1={frogX + 11} y1={frogY + 18} x2={frogX + 18} y2={frogY + 5} stroke="#78350F" strokeWidth="1.5" />
                          <polygon points={`${frogX + 16},${frogY + 5} ${frogX + 22},${frogY + 3} ${frogX + 20},${frogY + 9}`} fill="#94A3B8" />
                          <rect x={frogX + 10} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 13. Sushi Platter */}
                      {config.activityId === 'sushi_platter' && (
                        <g>
                          <rect x={frogX + 4} y={frogY + 14} width="12" height="5" fill="#D97706" rx="1" />
                          <rect x={frogX + 5} y={frogY + 13} width="4" height="2" fill="#FB923C" />
                          <rect x={frogX + 10} y={frogY + 13} width="4" height="2" fill="#BE123C" />
                          <rect x={frogX + 3} y={frogY + 15} width="2" height="3" fill={skin.main} />
                          <rect x={frogX + 13} y={frogY + 15} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 14. Matcha Tea Whisk */}
                      {config.activityId === 'tea_whisk' && (
                        <g>
                          <rect x={frogX + 4} y={frogY + 13} width="8" height="6" fill="#1E293B" rx="1" />
                          <rect x={frogX + 5} y={frogY + 14} width="6" height="3" fill="#84CC16" />
                          <line x1={frogX + 12} y1={frogY + 10} x2={frogX + 8} y2={frogY + 14} stroke="#FDE68A" strokeWidth="1.5" />
                          <rect x={frogX + 3} y={frogY + 14} width="2" height="3" fill={skin.main} />
                          <rect x={frogX + 11} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 15. Konbini Barcode Scanner */}
                      {config.activityId === 'konbini_scanner' && (
                        <g id="scene-prop-scanner">
                          <rect x={frogX + 10} y={frogY + 13} width="6" height="4" fill="#1E293B" rx="1" />
                          <rect x={frogX + 14} y={frogY + 11} width="3" height="6" fill="#0F172A" rx="0.5" />
                          {/* Animated Laser Beam */}
                          <line x1={frogX + 16} y1={frogY + 14} x2={frogX + 26} y2={frogY + 14} stroke="#EF4444" strokeWidth="1" className="animate-pulse" />
                          <circle cx={frogX + 26} cy={frogY + 14} r="1.2" fill="#F87171" />
                          <rect x={frogX + 9} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 16. Eating Delicious Onigiri */}
                      {config.activityId === 'eating_onigiri' && (
                        <g id="scene-prop-eating-onigiri">
                          <polygon points={`${frogX + 8},${frogY + 11} ${frogX + 3},${frogY + 17} ${frogX + 13},${frogY + 17}`} fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
                          <rect x={frogX + 6} y={frogY + 15} width="4" height="2.5" fill="#18181B" rx="0.5" />
                          <circle cx={frogX + 8} cy={frogY + 13} r="1" fill="#DC2626" />
                          <rect x={frogX + 2} y={frogY + 14} width="2" height="3" fill={skin.main} />
                          <rect x={frogX + 12} y={frogY + 14} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 17. Holding Konbini Shopping Bag */}
                      {config.activityId === 'holding_konbini_bag' && (
                        <g id="scene-prop-bag">
                          <polygon points={`${frogX + 9},${frogY + 12} ${frogX + 17},${frogY + 12} ${frogX + 19},${frogY + 22} ${frogX + 7},${frogY + 22}`} fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.5" />
                          <rect x={frogX + 9} y={frogY + 16} width="8" height="2" fill="#10B981" />
                          <rect x={frogX + 9} y={frogY + 18} width="8" height="1" fill="#EA580C" />
                          <rect x={frogX + 10} y={frogY + 10} width="3" height="4" fill="#FACC15" />
                          <rect x={frogX + 13} y={frogY + 11} width="2" height="3" fill="#EF4444" />
                          <rect x={frogX + 8} y={frogY + 13} width="2" height="3" fill={skin.main} />
                        </g>
                      )}

                      {/* 4. HATS & ACCESSORIES (HEAD LAYER) */}

                      {/* Red Riding Hood */}
                      {config.hatId === 'red_riding_hood' && (
                        <g>
                          <rect x={frogX - 3} y={frogY - 4} width="22" height="16" fill="#DC2626" rx="2" />
                          <rect x={frogX - 1} y={frogY - 6} width="18" height="3" fill="#B91C1C" />
                          <rect x={frogX + 1} y={frogY - 2} width="14" height="2" fill="#FEF2F2" />
                          <polygon points={`${frogX + 5},${frogY + 11} ${frogX + 8},${frogY + 13} ${frogX + 5},${frogY + 15}`} fill="#991B1B" />
                          <polygon points={`${frogX + 11},${frogY + 11} ${frogX + 8},${frogY + 13} ${frogX + 11},${frogY + 15}`} fill="#991B1B" />
                          <circle cx={frogX + 8} cy={frogY + 13} r="1.5" fill="#EF4444" />
                        </g>
                      )}

                      {/* Wolf Ears Hood */}
                      {config.hatId === 'wolf_ears_hood' && (
                        <g>
                          <polygon points={`${frogX - 2},${frogY + 2} ${frogX + 2},${frogY - 8} ${frogX + 6},${frogY + 2}`} fill="#334155" />
                          <polygon points={`${frogX},${frogY + 1} ${frogX + 2},${frogY - 6} ${frogX + 4},${frogY + 1}`} fill="#F472B6" />
                          <polygon points={`${frogX + 10},${frogY + 2} ${frogX + 14},${frogY - 8} ${frogX + 18},${frogY + 2}`} fill="#334155" />
                          <polygon points={`${frogX + 12},${frogY + 1} ${frogX + 14},${frogY - 6} ${frogX + 16},${frogY + 1}`} fill="#F472B6" />
                          <rect x={frogX + 2} y={frogY - 1} width="12" height="3" fill="#475569" />
                          <rect x={frogX + 6} y={frogY - 3} width="4" height="2" fill="#F1F5F9" />
                        </g>
                      )}

                      {/* Granny Nightcap */}
                      {config.hatId === 'granny_nightcap' && (
                        <g>
                          <ellipse cx={frogX + 8} cy={frogY - 2} rx="12" ry="7" fill="#F8FAFC" />
                          <ellipse cx={frogX + 8} cy={frogY - 2} rx="10" ry="5" fill="#F1F5F9" />
                          <rect x={frogX - 3} y={frogY + 2} width="22" height="2" fill="#FBCFE8" />
                          <circle cx={frogX + 8} cy={frogY + 3} r="1.5" fill="#EC4899" />
                        </g>
                      )}

                      {/* Sushi Salmon Nigiri */}
                      {config.hatId === 'sushi_salmon' && (
                        <g>
                          <rect x={frogX} y={frogY - 2} width="16" height="4" fill="#FFFFFF" rx="1" />
                          <rect x={frogX - 2} y={frogY - 6} width="20" height="5" fill="#FB923C" rx="2" />
                          <line x1={frogX} y1={frogY - 6} x2={frogX + 4} y2={frogY - 1} stroke="#FFF7ED" strokeWidth="1" />
                          <line x1={frogX + 6} y1={frogY - 6} x2={frogX + 10} y2={frogY - 1} stroke="#FFF7ED" strokeWidth="1" />
                          <line x1={frogX + 12} y1={frogY - 6} x2={frogX + 16} y2={frogY - 1} stroke="#FFF7ED" strokeWidth="1" />
                          <rect x={frogX + 7} y={frogY - 6} width="2" height="8" fill="#14532D" />
                        </g>
                      )}

                      {/* Sushi Maguro */}
                      {config.hatId === 'sushi_maguro' && (
                        <g>
                          <rect x={frogX} y={frogY - 2} width="16" height="4" fill="#FFFFFF" rx="1" />
                          <rect x={frogX - 2} y={frogY - 6} width="20" height="5" fill="#BE123C" rx="2" />
                          <rect x={frogX} y={frogY - 5} width="16" height="2" fill="#E11D48" />
                          <rect x={frogX + 2} y={frogY - 5} width="4" height="1" fill="#FFFFFF" opacity="0.6" />
                          <circle cx={frogX + 8} cy={frogY - 2} r="1" fill="#84CC16" />
                        </g>
                      )}

                      {/* Sushi Ebi */}
                      {config.hatId === 'sushi_ebi' && (
                        <g>
                          <rect x={frogX} y={frogY - 2} width="16" height="4" fill="#FFFFFF" rx="1" />
                          <rect x={frogX - 2} y={frogY - 6} width="18" height="5" fill="#EA580C" rx="2" />
                          <rect x={frogX + 1} y={frogY - 6} width="2" height="5" fill="#FFFFFF" />
                          <rect x={frogX + 5} y={frogY - 6} width="2" height="5" fill="#FFFFFF" />
                          <rect x={frogX + 9} y={frogY - 6} width="2" height="5" fill="#FFFFFF" />
                          <polygon points={`${frogX + 16},${frogY - 3} ${frogX + 21},${frogY - 7} ${frogX + 20},${frogY - 1}`} fill="#DC2626" />
                          <polygon points={`${frogX + 16},${frogY - 3} ${frogX + 21},${frogY + 1} ${frogX + 20},${frogY - 1}`} fill="#EA580C" />
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
                          <circle cx={frogX + 8} cy={frogY + 3.5} r="2" fill="#DC2626" />
                        </g>
                      )}

                      {/* Konbini Staff Visor */}
                      {config.hatId === 'konbini_staff_visor' && (
                        <g id="scene-hat-visor">
                          <rect x={frogX - 3} y={frogY + 1} width="22" height="3" fill="#10B981" rx="0.5" />
                          <rect x={frogX - 1} y={frogY + 1} width="18" height="1" fill="#34D399" />
                          <polygon points={`${frogX - 5},${frogY + 2} ${frogX + 21},${frogY + 2} ${frogX + 18},${frogY - 2} ${frogX - 2},${frogY - 2}`} fill="#059669" />
                          <circle cx={frogX + 8} cy={frogY + 2.5} r="1.2" fill="#FFFFFF" />
                          <circle cx={frogX + 8} cy={frogY + 2.5} r="0.6" fill="#EA580C" />
                        </g>
                      )}

                      {/* Shopper Bucket Hat */}
                      {config.hatId === 'shopper_bucket_hat' && (
                        <g id="scene-hat-bucket">
                          <polygon points={`${frogX - 2},${frogY + 1} ${frogX + 18},${frogY + 1} ${frogX + 16},${frogY - 6} ${frogX},${frogY - 6}`} fill="#7C3AED" />
                          <rect x={frogX + 1} y={frogY - 5} width="14" height="2" fill="#8B5CF6" />
                          <polygon points={`${frogX - 5},${frogY + 3} ${frogX + 21},${frogY + 3} ${frogX + 18},${frogY + 1} ${frogX - 2},${frogY + 1}`} fill="#6D28D9" />
                          <circle cx={frogX + 8} cy={frogY - 2} r="1" fill="#FDE047" />
                        </g>
                      )}

                      {/* Onigiri Headband */}
                      {config.hatId === 'onigiri_headband' && (
                        <g id="scene-hat-onigiri">
                          <rect x={frogX - 2} y={frogY + 2} width="20" height="1.5" fill="#18181B" />
                          <polygon points={`${frogX + 8},${frogY - 8} ${frogX + 3},${frogY - 1} ${frogX + 13},${frogY - 1}`} fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
                          <rect x={frogX + 6} y={frogY - 3} width="4" height="2.5" fill="#18181B" rx="0.5" />
                          <circle cx={frogX + 8} cy={frogY - 4.5} r="0.8" fill="#DC2626" />
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

            {/* I. Chibi Wolf Pup */}
            {config.companionId === 'chibi_wolf_pup' && (
              <g id="companion-wolf-pup" transform={`translate(112, 72)`}>
                <ellipse cx="7" cy="6" rx="6" ry="4" fill="#475569" />
                <circle cx="4" cy="4" r="3" fill="#475569" />
                <polygon points="2,1 4,4 1,4" fill="#334155" />
                <polygon points="5,1 6,4 4,4" fill="#334155" />
                <circle cx="3" cy="4" r="0.8" fill="#FACC15" />
                <ellipse cx="12" cy={animTick % 2 === 0 ? 4 : 2} rx="2" ry="1" fill="#475569" />
                <rect x="3" y="9" width="2" height="2" fill="#334155" />
                <rect x="8" y="9" width="2" height="2" fill="#334155" />
              </g>
            )}

            {/* J. Forest Hedgehog */}
            {config.companionId === 'forest_hedgehog' && (
              <g id="companion-hedgehog" transform={`translate(38, 76)`}>
                <ellipse cx="7" cy="4" rx="7" ry="4" fill="#78350F" />
                <polygon points="3,1 5,3 4,4" fill="#451A03" />
                <polygon points="6,0 8,3 7,4" fill="#451A03" />
                <polygon points="9,1 11,3 10,4" fill="#451A03" />
                <circle cx="12" cy="5" r="2" fill="#FBBF24" />
                <circle cx="13" cy="4.5" r="0.6" fill="#18181B" />
                <rect x="4" y="7" width="2" height="1.5" fill="#451A03" />
                <rect x="9" y="7" width="2" height="1.5" fill="#451A03" />
              </g>
            )}

            {/* K. Sushi Apprentice Cat */}
            {config.companionId === 'sushi_apprentice_cat' && (
              <g id="companion-sushi-cat" transform={`translate(40, 72)`}>
                <ellipse cx="7" cy="7" rx="6" ry="4" fill="#FFFFFF" />
                <circle cx="11" cy="4" r="3.5" fill="#FFFFFF" />
                <polygon points="10,1 12,2 10,0" fill="#FB923C" />
                <polygon points="12,1 14,2 13,0" fill="#FB923C" />
                <circle cx="12" cy="4" r="0.8" fill="#1E3A8A" />
                {/* Mini Headband */}
                <rect x="9" y="3" width="6" height="1" fill="#DC2626" />
                {/* Calico Spot */}
                <circle cx="5" cy="6" r="2" fill="#FB923C" />
                <rect x="4" y="10" width="2" height="2" fill="#E2E8F0" />
                <rect x="8" y="10" width="2" height="2" fill="#E2E8F0" />
              </g>
            )}

            {/* L. Mini Ebi Shrimp */}
            {config.companionId === 'mini_ebi_shrimp' && (
              <g id="companion-ebi-shrimp" transform={`translate(115, ${animTick % 2 === 0 ? 74 : 73})`}>
                <ellipse cx="6" cy="4" rx="5" ry="3" fill="#EA580C" />
                <rect x="3" y="2" width="1.5" height="4" fill="#FFFFFF" />
                <rect x="6" y="2" width="1.5" height="4" fill="#FFFFFF" />
                <polygon points="10,4 14,1 13,4" fill="#DC2626" />
                <polygon points="10,4 14,7 13,4" fill="#EA580C" />
                <line x1="2" y1="3" x2="0" y2="1" stroke="#EA580C" strokeWidth="0.8" />
                <circle cx="3" cy="3" r="0.6" fill="#18181B" />
              </g>
            )}

            {/* M. Konbini Cashier Lucky Cat (Waving Maneki Neko with Clerk Visor) */}
            {(config.companionId === 'konbini_cashier_cat' || config.companionId === 'companion_konbini_cashier_cat') && (
              <g id="companion-konbini-cat" transform="translate(108, 62)">
                {/* White Cat Body & Head */}
                <ellipse cx="7" cy="9" rx="6" ry="5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
                <circle cx="7" cy="4" r="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
                {/* Cat Ears */}
                <polygon points="4,1 6,3 3,3" fill="#FB7185" />
                <polygon points="8,3 10,1 11,3" fill="#FB7185" />
                {/* Mini Clerk Green Visor */}
                <rect x="3" y="2" width="8" height="1.5" fill="#10B981" rx="0.5" />
                {/* Cat Face: Eyes & Happy Whiskers */}
                <circle cx="5.5" cy="4" r="0.6" fill="#1E293B" />
                <circle cx="8.5" cy="4" r="0.6" fill="#1E293B" />
                <circle cx="7" cy="5" r="0.4" fill="#FB7185" />
                {/* Mini Green Staff Apron with Gold Coin */}
                <rect x="3.5" y="8" width="7" height="4" fill="#10B981" rx="0.5" />
                <circle cx="7" cy="10" r="1.2" fill="#FACC15" />
                {/* Waving Paw (Animated Up and Down) */}
                <rect x="1" y={animTick % 2 === 0 ? 3 : 5} width="2.5" height="3" fill="#FFFFFF" rx="1" stroke="#E2E8F0" strokeWidth="0.4" />
                <circle cx="2.2" cy={animTick % 2 === 0 ? 3.5 : 5.5} r="0.8" fill="#FB7185" />
              </g>
            )}

            {/* N. Snack Basket Shiba Inu (Curled up inside shopping basket) */}
            {(config.companionId === 'snack_shiba' || config.companionId === 'companion_snack_shiba') && (
              <g id="companion-snack-shiba" transform="translate(36, 70)">
                {/* Red Konbini Basket Container */}
                <polygon points="0,6 22,6 19,16 3,16" fill="#DC2626" />
                <polygon points="2,8 20,8 18,14 4,14" fill="#B91C1C" />
                {/* Shiba Inu Body */}
                <ellipse cx="11" cy="9" rx="7" ry="4" fill="#D97706" />
                <circle cx="15" cy="6" r="3.5" fill="#D97706" />
                {/* White Muzzle & Cheeks */}
                <ellipse cx="16" cy="7" rx="2" ry="1.5" fill="#FFFFFF" />
                <circle cx="16.5" cy="6.5" r="0.5" fill="#18181B" />
                {/* Shiba Pointy Ears */}
                <polygon points="13,3 15,1 15,4" fill="#B45309" />
                <polygon points="16,3 18,1 18,4" fill="#B45309" />
                {/* Sleeping/Happy Curved Eye */}
                <line x1="14" y1="5.5" x2="16" y2="5.5" stroke="#18181B" strokeWidth="0.6" />
                {/* Cute Tail Wag */}
                <ellipse cx="5" cy={animTick % 2 === 0 ? 7 : 8} rx="2" ry="1.5" fill="#D97706" />
                {/* Bag of Chips beside Shiba */}
                <rect x="3" y="4" width="4" height="6" fill="#FACC15" rx="0.5" />
              </g>
            )}
      </g>

      {/* 5. WEATHER PARTICLES OVERLAY */}

      {/* Raindrops Falling */}
      {effectiveWeather === 'rainy' && (
        <g id="rain-layer" stroke="#93C5FD" strokeWidth="1" opacity="0.75">
          {Array.from({ length: fullscreen ? 50 : 24 }).map((_, i) => {
            const rx = (i * 19 + (animTick * 7)) % 160;
            const ry = (i * 13 + (animTick * 11)) % viewBoxHeight;
            return <line key={i} x1={rx} y1={ry} x2={rx - 2} y2={ry + 5} />;
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
