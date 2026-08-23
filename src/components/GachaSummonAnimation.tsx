import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GachaPullResult, GachaGrade } from '../types';
import { PixelItemThumbnail } from './PixelItemThumbnail';
import { getGachaGrade } from '../utils/gachaUtils';
import { soundEngine, triggerHaptic } from '../utils/audioUtils';

interface GachaSummonAnimationProps {
  results: GachaPullResult[];
  onComplete: () => void;
  onSpinAgain?: () => void;
  canSpinAgain?: boolean;
  spinAgainCost?: number;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
}

/** Pixel Art Sparkle Star SVG */
const PixelStar: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 16,
  color = '#FBBF24',
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
  >
    <rect x="5" y="0" width="2" height="12" fill={color} />
    <rect x="0" y="5" width="12" height="2" fill={color} />
    <rect x="3" y="3" width="6" height="6" fill={color} />
    <rect x="5" y="5" width="2" height="2" fill="#FFFFFF" />
  </svg>
);

/** 16-bit Pixel Gacha Capsule SVG */
const PixelCapsuleGraphic: React.FC<{
  grade?: GachaGrade;
  isOpen?: boolean;
  size?: number;
}> = ({ grade = 'N', isOpen = false, size = 140 }) => {
  // Top and bottom shell colors based on rarity
  const topColor = grade === 'SR' ? '#F59E0B' : grade === 'R' ? '#10B981' : '#E11D48';
  const topLight = grade === 'SR' ? '#FDE68A' : grade === 'R' ? '#A7F3D0' : '#FDA4AF';
  const topDark = grade === 'SR' ? '#B45309' : grade === 'R' ? '#047857' : '#9F1239';

  const bottomColor = grade === 'SR' ? '#FEF3C7' : grade === 'R' ? '#ECFDF5' : '#FFFFFF';
  const bottomDark = grade === 'SR' ? '#FDE68A' : grade === 'R' ? '#D1FAE5' : '#E2E8F0';

  return (
    <div className="relative inline-block select-none" style={{ width: size, height: size }}>
      {/* Top Half */}
      <motion.div
        animate={
          isOpen
            ? { y: -45, rotate: -15, opacity: 0 }
            : { y: 0, rotate: 0, opacity: 1 }
        }
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="absolute top-0 left-0 right-0 h-1/2 flex items-end justify-center"
      >
        <svg
          width={size}
          height={size / 2}
          viewBox="0 0 32 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
        >
          {/* Black Outer Pixel Border */}
          <rect x="10" y="0" width="12" height="2" fill="#181410" />
          <rect x="6" y="2" width="20" height="2" fill="#181410" />
          <rect x="4" y="4" width="24" height="2" fill="#181410" />
          <rect x="2" y="6" width="28" height="2" fill="#181410" />
          <rect x="0" y="8" width="32" height="6" fill="#181410" />
          <rect x="0" y="14" width="32" height="2" fill="#181410" />

          {/* Top Colored Shell Base */}
          <rect x="10" y="2" width="12" height="2" fill={topColor} />
          <rect x="6" y="4" width="20" height="2" fill={topColor} />
          <rect x="4" y="6" width="24" height="2" fill={topColor} />
          <rect x="2" y="8" width="28" height="6" fill={topColor} />

          {/* Highlights & Specular Pixel Glint */}
          <rect x="10" y="2" width="6" height="2" fill={topLight} />
          <rect x="6" y="4" width="8" height="2" fill={topLight} />
          <rect x="4" y="6" width="4" height="2" fill={topLight} />
          <rect x="4" y="8" width="2" height="4" fill={topLight} />
          <rect x="8" y="4" width="2" height="2" fill="#FFFFFF" />

          {/* Shading */}
          <rect x="26" y="8" width="4" height="6" fill={topDark} />
          <rect x="24" y="6" width="4" height="2" fill={topDark} />

          {/* Middle Silver Lip Rim */}
          <rect x="2" y="13" width="28" height="2" fill="#E2E8F0" />
          <rect x="4" y="13" width="6" height="1" fill="#FFFFFF" />
        </svg>
      </motion.div>

      {/* Bottom Half */}
      <motion.div
        animate={
          isOpen
            ? { y: 45, rotate: 15, opacity: 0 }
            : { y: 0, rotate: 0, opacity: 1 }
        }
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 right-0 h-1/2 flex items-start justify-center"
      >
        <svg
          width={size}
          height={size / 2}
          viewBox="0 0 32 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
        >
          {/* Black Outer Pixel Border */}
          <rect x="0" y="0" width="32" height="2" fill="#181410" />
          <rect x="0" y="2" width="32" height="6" fill="#181410" />
          <rect x="2" y="8" width="28" height="2" fill="#181410" />
          <rect x="4" y="10" width="24" height="2" fill="#181410" />
          <rect x="6" y="12" width="20" height="2" fill="#181410" />
          <rect x="10" y="14" width="12" height="2" fill="#181410" />

          {/* Bottom White/Cream Shell Base */}
          <rect x="2" y="2" width="28" height="6" fill={bottomColor} />
          <rect x="4" y="8" width="24" height="2" fill={bottomColor} />
          <rect x="6" y="10" width="20" height="2" fill={bottomColor} />
          <rect x="10" y="12" width="12" height="2" fill={bottomColor} />

          {/* Shading */}
          <rect x="24" y="2" width="6" height="6" fill={bottomDark} />
          <rect x="20" y="8" width="8" height="2" fill={bottomDark} />
          <rect x="18" y="10" width="8" height="2" fill={bottomDark} />

          {/* Center Pixel Star Badge Lock */}
          <rect x="12" y="0" width="8" height="4" fill="#FBBF24" />
          <rect x="14" y="1" width="4" height="2" fill="#FFFFFF" />
        </svg>
      </motion.div>

      {/* Burst Particles on open */}
      {isOpen && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {[-40, 0, 40].map((x, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1.5, 0],
                x: x * 1.5,
                y: (i % 2 === 0 ? -1 : 1) * 50,
              }}
              transition={{ duration: 0.4 }}
              className="w-3 h-3 bg-amber-300 pixel-box-shadow"
            />
          ))}
        </div>
      )}
    </div>
  );
};

/** 16-bit Gacha Machine Crank Illustration */
const PixelGachaCrankMachine: React.FC<{ isCranking: boolean }> = ({ isCranking }) => (
  <div className="relative flex flex-col items-center">
    <svg
      width={120}
      height={120}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className="filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
    >
      {/* Red Roof Dome */}
      <rect x="10" y="2" width="12" height="2" fill="#E11D48" />
      <rect x="8" y="4" width="16" height="2" fill="#E11D48" />
      <rect x="10" y="3" width="4" height="1" fill="#FDA4AF" />

      {/* Glass Jar */}
      <rect x="6" y="6" width="20" height="12" fill="#BAE6FD" />
      <rect x="5" y="7" width="1" height="10" fill="#0284C7" />
      <rect x="26" y="7" width="1" height="10" fill="#0284C7" />
      <rect x="7" y="7" width="3" height="5" fill="#FFFFFF" />

      {/* Pixel Mini Capsules Inside */}
      <rect x="10" y="12" width="4" height="4" fill="#F43F5E" />
      <rect x="18" y="12" width="4" height="4" fill="#FBBF24" />
      <rect x="14" y="9" width="4" height="4" fill="#10B981" />
      <rect x="10" y="8" width="4" height="4" fill="#A855F7" />

      {/* Machine Base */}
      <rect x="6" y="18" width="20" height="2" fill="#9F1239" />
      <rect x="7" y="20" width="18" height="10" fill="#E11D48" />

      {/* Metal Chute */}
      <rect x="12" y="25" width="8" height="4" fill="#181410" />
      <rect x="14" y="26" width="4" height="2" fill="#38BDF8" />
    </svg>

    {/* Turning Crank Handle */}
    <motion.div
      animate={isCranking ? { rotate: [0, 90, 180, 270, 360, 450, 720] } : { rotate: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="absolute top-[68px] w-8 h-8 flex items-center justify-center pointer-events-none"
    >
      <svg
        width={24}
        height={24}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        <rect x="6" y="6" width="4" height="4" fill="#FBBF24" />
        <rect x="7" y="7" width="2" height="2" fill="#FFFFFF" />
        <rect x="7" y="2" width="2" height="5" fill="#D97706" />
        <rect x="6" y="1" width="4" height="2" fill="#FEF08A" />
      </svg>
    </motion.div>
  </div>
);

export const GachaSummonAnimation: React.FC<GachaSummonAnimationProps> = ({
  results,
  onComplete,
  onSpinAgain,
  canSpinAgain = false,
  spinAgainCost = 50,
  soundEnabled = true,
  hapticEnabled = true,
}) => {
  // Phase: 'capsule' -> 'reveal' -> 'summary'
  const [phase, setPhase] = useState<'capsule' | 'reveal' | 'summary'>('capsule');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpeningCapsule, setIsOpeningCapsule] = useState(false);
  const [isCranking, setIsCranking] = useState(false);

  const currentResult = results[currentIndex] || results[0];
  const currentGrade: GachaGrade = currentResult ? getGachaGrade(currentResult.item) : 'N';

  // Has highest rarity in pool
  const hasSR = results.some((r) => getGachaGrade(r.item) === 'SR');
  const hasR = results.some((r) => getGachaGrade(r.item) === 'R');
  const topGrade: GachaGrade = hasSR ? 'SR' : hasR ? 'R' : 'N';

  // Trigger sound & celebration based on grade
  const triggerItemCelebration = useCallback(
    (pull: GachaPullResult | undefined) => {
      if (!pull) return;
      const grade = getGachaGrade(pull.item);
      if (grade === 'SR') {
        if (soundEnabled) soundEngine.play8BitFanfareSR();
      } else if (grade === 'R') {
        if (soundEnabled) soundEngine.play8BitChimeR();
      } else {
        if (soundEnabled) soundEngine.playCardFlipSound();
      }
    },
    [soundEnabled]
  );

  // Initial sound on mount
  useEffect(() => {
    if (soundEnabled) soundEngine.play8BitCrankSound();
  }, [soundEnabled]);

  // Open capsule action
  const handleOpenCapsule = () => {
    if (isOpeningCapsule) return;
    setIsCranking(true);
    setIsOpeningCapsule(true);
    if (hapticEnabled) triggerHaptic();
    if (soundEnabled) soundEngine.playCapsulePopSound();

    setTimeout(() => {
      setPhase('reveal');
      triggerItemCelebration(results[0]);
    }, 450);
  };

  // Next card in reveal
  const handleNextCard = () => {
    if (hapticEnabled) triggerHaptic();
    if (currentIndex + 1 < results.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      triggerItemCelebration(results[nextIdx]);
    } else {
      setPhase('summary');
      if (soundEnabled) soundEngine.play8BitFanfareSR();
    }
  };

  // Skip to summary
  const handleSkip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (soundEnabled) soundEngine.playTapSound();
    if (hapticEnabled) triggerHaptic();
    setPhase('summary');
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (phase === 'capsule') {
          handleOpenCapsule();
        } else if (phase === 'reveal') {
          handleNextCard();
        }
      } else if (e.key === 'Escape' || e.key === 's' || e.key === 'S') {
        if (phase !== 'summary') {
          handleSkip();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, currentIndex, isOpeningCapsule]);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'hats':
        return 'HAT';
      case 'outfits':
        return 'OUTFIT';
      case 'accessories':
        return 'ACCESSORY';
      case 'skins':
        return 'SKIN COLOR';
      case 'props':
        return 'PROP & POSE';
      case 'companions':
        return 'COMPANION';
      case 'scenes':
        return 'SCENE';
      case 'weather':
        return 'WEATHER';
      default:
        return 'ITEM';
    }
  };

  return (
    <div
      id="gacha-summon-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-gradient-to-b from-indigo-950/85 via-purple-900/80 to-slate-950/85 backdrop-blur-md pixel-art-rendering select-none overflow-hidden"
      onClick={() => {
        if (phase === 'capsule') handleOpenCapsule();
        else if (phase === 'reveal') handleNextCard();
      }}
    >
      {/* Retro Colorful Pixel Starfield & Radiant Backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Colorful Radiant Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-pink-500/20 via-amber-400/25 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-emerald-400/15 via-teal-400/20 to-indigo-400/15 rounded-full blur-2xl" />

        {/* Pixel Scanline Grid Overlay */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.05) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.02), rgba(255, 255, 255, 0.03))',
            backgroundSize: '100% 4px, 6px 100%',
          }}
        />

        {/* Twinkling Vibrant Pixel Stars & Sparks */}
        <div className="absolute top-10 left-12 animate-pulse">
          <PixelStar size={14} color="#FEF08A" />
        </div>
        <div className="absolute top-20 right-16 animate-pulse" style={{ animationDelay: '0.4s' }}>
          <PixelStar size={18} color="#67E8F9" />
        </div>
        <div className="absolute top-1/3 left-6 animate-pulse" style={{ animationDelay: '0.8s' }}>
          <PixelStar size={12} color="#F472B6" />
        </div>
        <div className="absolute bottom-24 left-16 animate-pulse" style={{ animationDelay: '1.2s' }}>
          <PixelStar size={16} color="#A7F3D0" />
        </div>
        <div className="absolute bottom-16 right-14 animate-pulse" style={{ animationDelay: '0.6s' }}>
          <PixelStar size={14} color="#FBBF24" />
        </div>
        <div className="absolute top-2/3 right-8 animate-pulse" style={{ animationDelay: '1.5s' }}>
          <PixelStar size={12} color="#C084FC" />
        </div>
        <div className="absolute top-8 right-1/3 animate-pulse" style={{ animationDelay: '0.9s' }}>
          <PixelStar size={10} color="#FFFFFF" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ========================================================================= */}
        {/* 1. PIXEL GACHA MACHINE & CAPSULE DROP STAGE                              */}
        {/* ========================================================================= */}
        {phase === 'capsule' && (
          <motion.div
            key="pixel-capsule-stage"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center text-center max-w-sm w-full cursor-pointer z-10 space-y-4"
          >
            {/* Top Cheerful Radiant Pixel Header */}
            <div className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 border-4 border-[#78350f] px-5 py-2.5 shadow-[0_4px_0_#451a03,0_0_20px_rgba(251,191,36,0.5)]">
              <h2 className="font-pixel text-xs sm:text-sm text-[#78350f] font-black tracking-wider uppercase drop-shadow-xs">
                ✦ GASHAPON SUMMON ✦
              </h2>
            </div>

            {/* Gacha Machine & Capsule Area with Radiant Glow Aura */}
            <div className="relative py-3 flex flex-col items-center justify-center">
              {/* Backlight Halo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 bg-gradient-to-r from-amber-300/35 via-pink-400/30 to-cyan-300/35 rounded-full blur-xl" />
              </div>

              {/* Pixel Machine at Top */}
              <PixelGachaCrankMachine isCranking={isCranking} />

              {/* Pixel Capsule Dropped */}
              <motion.div
                initial={{ y: -30, scale: 0.6 }}
                animate={{
                  y: isOpeningCapsule ? [0, -10, 20] : [0, -6, 0],
                  scale: isOpeningCapsule ? 1.15 : 1,
                }}
                transition={
                  isOpeningCapsule
                    ? { duration: 0.35 }
                    : { repeat: Infinity, duration: 1.2, ease: 'easeInOut' }
                }
                className="mt-2 relative z-10"
              >
                <PixelCapsuleGraphic
                  grade={topGrade}
                  isOpen={isOpeningCapsule}
                  size={120}
                />
              </motion.div>
            </div>

            {/* Pixel Action Button Prompt */}
            <div className="space-y-2 pt-1">
              <div className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 border-4 border-[#064e3b] px-6 py-3 shadow-[0_5px_0_#064e3b,0_0_20px_rgba(16,185,129,0.6)] text-white font-pixel text-xs tracking-wider uppercase animate-bounce">
                ▶ TAP TO OPEN ({results.length}x)
              </div>
              <p className="font-silkscreen text-[10px] text-amber-200 font-bold tracking-widest uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                [ SPACE / ENTER / TAP SCREEN ]
              </p>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* 2. PIXEL REVEAL STAGE (ITEM SHOWCASE CARD)                               */}
        {/* ========================================================================= */}
        {phase === 'reveal' && currentResult && (
          <motion.div
            key={`pixel-card-${currentIndex}`}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -15 }}
            transition={{ duration: 0.18 }}
            className={`relative w-full max-w-sm flex flex-col justify-between p-4 sm:p-5 border-4 z-10 cursor-pointer ${
              currentGrade === 'SR'
                ? 'bg-gradient-to-b from-[#fffdf5] via-[#fef3c7] to-[#fde68a] border-[#92400e] shadow-[0_8px_0_#78350f,0_0_35px_rgba(245,158,11,0.6)]'
                : currentGrade === 'R'
                ? 'bg-gradient-to-b from-[#f0fdf4] via-[#dcfce7] to-[#bbf7d0] border-[#166534] shadow-[0_8px_0_#14532d,0_0_30px_rgba(34,197,94,0.5)]'
                : 'bg-gradient-to-b from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd] border-[#0369a1] shadow-[0_8px_0_#075985,0_0_25px_rgba(14,165,233,0.45)]'
            }`}
          >
            {/* Top Control Bar: Progress & Skip */}
            <div className="flex items-center justify-between border-b-2 border-black/20 pb-2 mb-3">
              {/* Pixel Pull Counter */}
              <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1 border-2 border-black/70 shadow-xs">
                <span className="font-pixel text-[9px] text-[#78350f] font-black">
                  PULL {String(currentIndex + 1).padStart(2, '0')}/{String(results.length).padStart(2, '0')}
                </span>
              </div>

              {/* Progress Pixel Dots */}
              {results.length > 1 && (
                <div className="flex items-center gap-1 bg-black/10 px-2 py-1 rounded-xs">
                  {results.slice(0, 10).map((r, idx) => {
                    const g = getGachaGrade(r.item);
                    const isCur = idx === currentIndex;
                    const isPast = idx < currentIndex;
                    return (
                      <div
                        key={idx}
                        className={`w-2.5 h-2.5 border border-black ${
                          isCur
                            ? g === 'SR'
                              ? 'bg-amber-400 scale-110 ring-1 ring-amber-600'
                              : g === 'R'
                              ? 'bg-emerald-400 scale-110 ring-1 ring-emerald-600'
                              : 'bg-sky-400 scale-110 ring-1 ring-sky-600'
                            : isPast
                            ? 'bg-stone-400 opacity-60'
                            : 'bg-white/80'
                        }`}
                      />
                    );
                  })}
                </div>
              )}

              {/* Pixel Skip Button */}
              <button
                type="button"
                id="pixel-skip-btn"
                onClick={handleSkip}
                className="bg-amber-100 hover:bg-amber-200 active:bg-amber-300 text-amber-950 border-2 border-[#78350f] px-2.5 py-0.5 font-pixel text-[8.5px] uppercase tracking-wider shadow-xs cursor-pointer"
              >
                SKIP ▶▶
              </button>
            </div>

            {/* Pixel Rarity Header Banner */}
            <div className="text-center my-1">
              {currentGrade === 'SR' && (
                <div className="inline-block bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-2 border-[#78350f] px-4 py-1 shadow-md">
                  <span className="font-pixel text-[10px] sm:text-[11px] text-amber-950 font-black tracking-widest uppercase">
                    ★ SUPER RARE ★
                  </span>
                </div>
              )}
              {currentGrade === 'R' && (
                <div className="inline-block bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 border-2 border-[#064e3b] px-4 py-1 shadow-md">
                  <span className="font-pixel text-[10px] sm:text-[11px] text-white font-black tracking-widest uppercase">
                    ★ RARE ★
                  </span>
                </div>
              )}
              {currentGrade === 'N' && (
                <div className="inline-block bg-gradient-to-r from-sky-600 via-cyan-500 to-sky-600 border-2 border-[#075985] px-4 py-1 shadow-md">
                  <span className="font-pixel text-[9px] text-white font-black tracking-widest uppercase">
                    ★ NORMAL ★
                  </span>
                </div>
              )}
            </div>

            {/* Central Pixel Spotlight & Thumbnail Display */}
            <div className="relative my-3 flex flex-col items-center justify-center">
              {/* Radiant Light Behind Pedestal */}
              <div className="absolute w-44 h-44 bg-white/60 rounded-full blur-lg pointer-events-none" />

              {/* Stepped Cheerful Pixel Pedestal */}
              <div
                className={`relative w-40 h-40 flex items-center justify-center border-4 shadow-inner ${
                  currentGrade === 'SR'
                    ? 'bg-gradient-to-b from-white via-amber-50 to-amber-100 border-[#92400e]'
                    : currentGrade === 'R'
                    ? 'bg-gradient-to-b from-white via-emerald-50 to-emerald-100 border-[#166534]'
                    : 'bg-gradient-to-b from-white via-sky-50 to-sky-100 border-[#0369a1]'
                }`}
              >
                {/* 4 Corner Pixel Gems */}
                <div className="absolute top-1 left-1 w-2 h-2 bg-amber-400 border border-black/40" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-amber-400 border border-black/40" />
                <div className="absolute bottom-1 left-1 w-2 h-2 bg-amber-400 border border-black/40" />
                <div className="absolute bottom-1 right-1 w-2 h-2 bg-amber-400 border border-black/40" />

                {/* Floating Pixel Item Thumbnail */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                  className="transform scale-[2.3] pixel-art-rendering drop-shadow-md"
                >
                  <PixelItemThumbnail
                    id={currentResult.item.id}
                    category={currentResult.item.category}
                    size={56}
                  />
                </motion.div>
              </div>

              {/* Status Banner: NEW vs DUP */}
              <div className="mt-3">
                {currentResult.isNew ? (
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 border-2 border-[#064e3b] px-3.5 py-1 font-pixel text-[9px] text-white font-black tracking-widest uppercase shadow-md animate-pulse">
                    ★ NEW UNLOCKED! ★
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-amber-400 to-yellow-400 border-2 border-[#78350f] px-3 py-0.5 font-pixel text-[8px] text-amber-950 font-bold tracking-wider uppercase shadow-xs">
                    DUP (+{currentResult.duplicateRefundCoins || 20} COINS)
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Pixel Item Info Box */}
            <div
              className={`border-2 p-3 space-y-1 text-left bg-white/95 ${
                currentGrade === 'SR'
                  ? 'border-[#92400e]'
                  : currentGrade === 'R'
                  ? 'border-[#166534]'
                  : 'border-[#0369a1]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-silkscreen text-[9px] text-stone-500 font-bold tracking-widest uppercase">
                  [{getCategoryLabel(currentResult.item.category)}]
                </span>
                <span className="font-pixel text-[9px] text-amber-500 font-black">
                  {currentGrade === 'SR' ? '★★★★★' : currentGrade === 'R' ? '★★★★☆' : '★★★☆☆'}
                </span>
              </div>
              <h3 className="font-pixel text-xs sm:text-sm text-stone-900 font-black tracking-wider">
                {currentResult.item.name}
              </h3>
              <p className="font-silkscreen text-[10px] text-stone-600 line-clamp-2 leading-relaxed">
                {currentResult.item.desc}
              </p>
            </div>

            {/* Footer Prompt */}
            <div className="mt-3 text-center">
              <span className="font-silkscreen text-[9.5px] text-stone-700 font-bold tracking-widest uppercase animate-pulse">
                ▶ TAP ANYWHERE TO CONTINUE ▶
              </span>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* 3. PIXEL SUMMARY STAGE (REWARDS OVERVIEW)                                */}
        {/* ========================================================================= */}
        {phase === 'summary' && (
          <motion.div
            key="pixel-summary-stage"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-b from-[#fffdf5] via-[#fef3c7] to-[#fde68a] border-4 border-[#78350f] max-w-sm w-full p-4 sm:p-5 shadow-[0_8px_0_#451a03,0_0_35px_rgba(245,158,11,0.55)] z-10 space-y-3.5 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 border-2 border-[#78350f] py-2 px-3 shadow-xs">
              <h2 className="font-pixel text-xs sm:text-sm text-amber-950 font-black tracking-wider uppercase">
                ✦ SUMMON REWARDS ✦
              </h2>
              <p className="font-silkscreen text-[9px] text-[#78350f] font-bold mt-0.5 tracking-wider uppercase">
                {results.length === 1
                  ? '1 ITEM ACQUIRED'
                  : `${results.length} ITEMS OBTAINED`}
              </p>
            </div>

            {/* SINGLE RESULT VIEW */}
            {results.length === 1 ? (
              <div className="bg-white/95 border-2 border-[#78350f] p-4 flex flex-col items-center justify-center space-y-2 shadow-xs">
                {(() => {
                  const single = results[0];
                  const grade = getGachaGrade(single.item);
                  return (
                    <>
                      <div
                        className={`relative w-24 h-24 border-4 flex items-center justify-center ${
                          grade === 'SR'
                            ? 'bg-amber-50 border-amber-500 shadow-md'
                            : grade === 'R'
                            ? 'bg-emerald-50 border-emerald-500 shadow-md'
                            : 'bg-sky-50 border-sky-400 shadow-md'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 font-pixel text-[8px] px-1 border border-black/40 font-bold ${
                            grade === 'SR'
                              ? 'bg-amber-400 text-amber-950'
                              : grade === 'R'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-sky-500 text-white'
                          }`}
                        >
                          {grade}
                        </span>
                        <div className="transform scale-[1.7] pixel-art-rendering drop-shadow-xs">
                          <PixelItemThumbnail
                            id={single.item.id}
                            category={single.item.category}
                            size={40}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="font-silkscreen text-[9px] text-stone-500 font-bold tracking-wider uppercase">
                          [{getCategoryLabel(single.item.category)}]
                        </span>
                        <h4 className="font-pixel text-xs text-stone-900 font-bold">
                          {single.item.name}
                        </h4>
                        <div>
                          {single.isNew ? (
                            <span className="inline-block bg-emerald-500 border border-emerald-700 px-2.5 py-0.5 font-pixel text-[8px] text-white uppercase font-bold shadow-xs">
                              ★ NEW ITEM ★
                            </span>
                          ) : (
                            <span className="inline-block bg-amber-400 border border-amber-700 px-2 py-0.5 font-pixel text-[7.5px] text-amber-950 uppercase font-bold">
                              DUP (+{single.duplicateRefundCoins || 20} COINS)
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              /* MULTI 10X GRID VIEW */
              <div className="grid grid-cols-5 gap-1.5 p-2 bg-amber-900/10 border-2 border-[#78350f] max-h-[38vh] overflow-y-auto">
                {results.map((res, idx) => {
                  const grade = getGachaGrade(res.item);
                  return (
                    <div
                      key={idx}
                      className={`relative aspect-square border-2 flex items-center justify-center p-1 shadow-xs ${
                        grade === 'SR'
                          ? 'bg-gradient-to-b from-amber-50 to-amber-100 border-amber-500'
                          : grade === 'R'
                          ? 'bg-gradient-to-b from-emerald-50 to-emerald-100 border-emerald-500'
                          : 'bg-gradient-to-b from-sky-50 to-sky-100 border-sky-400'
                      }`}
                    >
                      {/* Grade Badge */}
                      <span
                        className={`absolute top-0.5 left-0.5 font-pixel text-[6px] px-0.5 border border-black/30 font-bold ${
                          grade === 'SR'
                            ? 'bg-amber-400 text-amber-950'
                            : grade === 'R'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-sky-500 text-white'
                        }`}
                      >
                        {grade}
                      </span>

                      {/* NEW / DUP Badge */}
                      {res.isNew && (
                        <span className="absolute bottom-0.5 right-0.5 font-pixel text-[5px] bg-emerald-500 text-white px-0.5 font-bold">
                          NEW
                        </span>
                      )}

                      {/* Thumbnail */}
                      <div className="transform scale-[1.15] pixel-art-rendering drop-shadow-xs">
                        <PixelItemThumbnail
                          id={res.item.id}
                          category={res.item.category}
                          size={28}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pixel Bottom Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              {canSpinAgain && onSpinAgain && (
                <button
                  type="button"
                  id="pixel-spin-again-btn"
                  onClick={() => {
                    if (soundEnabled) soundEngine.playTapSound();
                    if (hapticEnabled) triggerHaptic();
                    onSpinAgain();
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:brightness-110 active:brightness-90 border-4 border-[#78350f] shadow-[0_4px_0_#451a03] text-white font-pixel text-[9px] sm:text-[10px] tracking-wider uppercase cursor-pointer"
                >
                  ↺ SPIN ({spinAgainCost})
                </button>
              )}

              <button
                type="button"
                id="pixel-done-btn"
                onClick={() => {
                  if (soundEnabled) soundEngine.playTapSound();
                  if (hapticEnabled) triggerHaptic();
                  onComplete();
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 hover:brightness-110 active:brightness-90 border-4 border-[#064e3b] shadow-[0_4px_0_#064e3b] text-white font-pixel text-[9px] sm:text-[10px] tracking-wider uppercase cursor-pointer"
              >
                ✓ DONE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
