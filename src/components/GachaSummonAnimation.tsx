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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 dark:bg-black/75 backdrop-blur-md select-none overflow-hidden"
      onClick={() => {
        if (phase === 'capsule') handleOpenCapsule();
        else if (phase === 'reveal') handleNextCard();
      }}
    >
      {/* Cozy Minimal Backdrop Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft Warm Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-200/10 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        {/* Gentle Soft Star Accents */}
        <div className="absolute top-12 left-14 opacity-30">
          <PixelStar size={10} color="#D4AF37" />
        </div>
        <div className="absolute top-24 right-16 opacity-30">
          <PixelStar size={12} color="#5F7A61" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-30">
          <PixelStar size={10} color="#D4AF37" />
        </div>
        <div className="absolute bottom-28 right-20 opacity-30">
          <PixelStar size={12} color="#B86F52" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ========================================================================= */}
        {/* 1. COZY CAPSULE DROP STAGE                                                */}
        {/* ========================================================================= */}
        {phase === 'capsule' && (
          <motion.div
            key="cozy-capsule-stage"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center text-center max-w-xs w-full cursor-pointer z-10 space-y-4"
          >
            {/* Top Cozy Minimal Header */}
            <div className="bg-[#FAF7F2] dark:bg-[#23201D] border border-[#E8E2D9] dark:border-[#38332E] px-4 py-2 rounded-2xl shadow-sm">
              <h2 className="font-pixel text-xs text-[#5F5244] dark:text-[#E7E2DA] tracking-wider uppercase">
                ✦ GASHAPON SUMMON ✦
              </h2>
            </div>

            {/* Gacha Machine & Capsule Area */}
            <div className="relative py-2 flex flex-col items-center justify-center">
              {/* Pixel Machine at Top */}
              <PixelGachaCrankMachine isCranking={isCranking} />

              {/* Pixel Capsule Dropped */}
              <motion.div
                initial={{ y: -20, scale: 0.8 }}
                animate={{
                  y: isOpeningCapsule ? [0, -8, 16] : [0, -4, 0],
                  scale: isOpeningCapsule ? 1.1 : 1,
                }}
                transition={
                  isOpeningCapsule
                    ? { duration: 0.35 }
                    : { repeat: Infinity, duration: 1.6, ease: 'easeInOut' }
                }
                className="mt-2 relative z-10"
              >
                <PixelCapsuleGraphic
                  grade={topGrade}
                  isOpen={isOpeningCapsule}
                  size={110}
                />
              </motion.div>
            </div>

            {/* Action Prompt */}
            <div className="space-y-1.5 pt-1">
              <div className="bg-[#5F7A61] hover:bg-[#526B54] active:scale-95 text-white font-pixel text-xs px-5 py-2.5 rounded-xl shadow-md border-b-2 border-[#435945] tracking-wider uppercase transition">
                TAP TO OPEN ({results.length}x)
              </div>
              <p className="font-silkscreen text-[9.5px] text-[#A8A29E] tracking-widest uppercase">
                [ SPACE / ENTER / TAP ]
              </p>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* 2. COZY REVEAL STAGE (ITEM SHOWCASE CARD)                                */}
        {/* ========================================================================= */}
        {phase === 'reveal' && currentResult && (
          <motion.div
            key={`cozy-card-${currentIndex}`}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xs flex flex-col justify-between p-5 bg-[#FAF7F2] dark:bg-[#23201D] border border-[#E8E2D9] dark:border-[#38332E] rounded-3xl shadow-xl z-10 cursor-pointer"
          >
            {/* Top Control Bar: Progress & Skip */}
            <div className="flex items-center justify-between border-b border-[#E8E2D9] dark:border-[#38332E] pb-2.5 mb-3">
              {/* Pull Counter */}
              <div className="flex items-center gap-1.5 bg-[#F0ECE4] dark:bg-[#1C1A17] px-2.5 py-0.5 rounded-lg border border-[#E0D9CE] dark:border-[#332E29]">
                <span className="font-pixel text-[8.5px] text-[#786E64] dark:text-[#C5BEB5]">
                  PULL {String(currentIndex + 1).padStart(2, '0')}/{String(results.length).padStart(2, '0')}
                </span>
              </div>

              {/* Progress Dots */}
              {results.length > 1 && (
                <div className="flex items-center gap-1 bg-[#F0ECE4] dark:bg-[#1C1A17] px-2 py-1 rounded-md">
                  {results.slice(0, 10).map((r, idx) => {
                    const g = getGachaGrade(r.item);
                    const isCur = idx === currentIndex;
                    const isPast = idx < currentIndex;
                    return (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-xs transition-all ${
                          isCur
                            ? g === 'SR'
                              ? 'bg-amber-400 scale-125'
                              : g === 'R'
                              ? 'bg-emerald-500 scale-125'
                              : 'bg-stone-400 scale-125'
                            : isPast
                            ? 'bg-stone-300 dark:bg-stone-600'
                            : 'bg-stone-200 dark:bg-stone-800'
                        }`}
                      />
                    );
                  })}
                </div>
              )}

              {/* Skip Button */}
              <button
                type="button"
                id="cozy-skip-btn"
                onClick={handleSkip}
                className="bg-[#F0ECE4] dark:bg-[#1C1A17] hover:bg-[#E5DFD4] dark:hover:bg-[#2B2723] text-[#786E64] dark:text-[#C5BEB5] px-2 py-0.5 rounded-lg font-pixel text-[8px] uppercase tracking-wider transition border border-[#E0D9CE] dark:border-[#332E29] cursor-pointer"
              >
                SKIP ▶
              </button>
            </div>

            {/* Rarity Tag */}
            <div className="text-center my-0.5">
              {currentGrade === 'SR' && (
                <div className="inline-flex items-center gap-1 bg-[#FEF3C7] dark:bg-amber-950/40 border border-[#FDE68A] dark:border-amber-800/50 px-3 py-0.5 rounded-full text-[#92400E] dark:text-amber-300 font-pixel text-[9.5px]">
                  <span>★</span>
                  <span>SUPER RARE</span>
                  <span>★</span>
                </div>
              )}
              {currentGrade === 'R' && (
                <div className="inline-flex items-center gap-1 bg-[#ECFDF5] dark:bg-emerald-950/40 border border-[#A7F3D0] dark:border-emerald-800/50 px-3 py-0.5 rounded-full text-[#065F46] dark:text-emerald-300 font-pixel text-[9.5px]">
                  <span>★</span>
                  <span>RARE</span>
                  <span>★</span>
                </div>
              )}
              {currentGrade === 'N' && (
                <div className="inline-flex items-center gap-1 bg-[#F5F5F4] dark:bg-stone-800/50 border border-[#E7E5E4] dark:border-stone-700/50 px-3 py-0.5 rounded-full text-[#57534E] dark:text-stone-300 font-pixel text-[9px]">
                  <span>★</span>
                  <span>NORMAL</span>
                  <span>★</span>
                </div>
              )}
            </div>

            {/* Central Pedestal & Thumbnail */}
            <div className="relative my-3 flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center bg-[#F3EFEA] dark:bg-[#1E1B18] border border-[#E2DBD1] dark:border-[#36302A] rounded-2xl shadow-inner">
                {/* Floating Item Thumbnail */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="transform scale-[2.2] pixel-art-rendering drop-shadow-xs"
                >
                  <PixelItemThumbnail
                    id={currentResult.item.id}
                    category={currentResult.item.category}
                    size={52}
                  />
                </motion.div>
              </div>

              {/* Status Tag: NEW vs DUP */}
              <div className="mt-2.5">
                {currentResult.isNew ? (
                  <div className="bg-[#5F7A61] text-white px-3 py-0.5 rounded-full font-pixel text-[8.5px] tracking-wider uppercase shadow-xs">
                    NEW UNLOCKED
                  </div>
                ) : (
                  <div className="bg-[#EAE4DC] dark:bg-[#2C2723] text-[#786E64] dark:text-[#B5ADA3] border border-[#DBD2C5] dark:border-[#3E3832] px-2.5 py-0.5 rounded-full font-pixel text-[8px] tracking-wider uppercase">
                    DUP (+{currentResult.duplicateRefundCoins || 20} COINS)
                  </div>
                )}
              </div>
            </div>

            {/* Item Info Box */}
            <div className="bg-[#F3EFEA] dark:bg-[#1E1B18] border border-[#E2DBD1] dark:border-[#36302A] rounded-xl p-3 space-y-1 text-left">
              <div className="flex items-center justify-between">
                <span className="font-silkscreen text-[8.5px] text-[#A89F91] tracking-widest uppercase">
                  [{getCategoryLabel(currentResult.item.category)}]
                </span>
                <span className="font-pixel text-[8.5px] text-amber-500 dark:text-amber-400">
                  {currentGrade === 'SR' ? '★★★' : currentGrade === 'R' ? '★★☆' : '★☆☆'}
                </span>
              </div>
              <h3 className="font-pixel text-xs text-[#292524] dark:text-[#F5F5F4]">
                {currentResult.item.name}
              </h3>
              <p className="font-silkscreen text-[9.5px] text-[#78716C] dark:text-[#A8A29E] line-clamp-2 leading-relaxed">
                {currentResult.item.desc}
              </p>
            </div>

            {/* Footer Prompt */}
            <div className="mt-3 text-center">
              <span className="font-silkscreen text-[9px] text-[#A89F91] tracking-widest uppercase animate-pulse">
                TAP TO CONTINUE
              </span>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* 3. COZY SUMMARY STAGE (REWARDS OVERVIEW)                                 */}
        {/* ========================================================================= */}
        {phase === 'summary' && (
          <motion.div
            key="cozy-summary-stage"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-[#FAF7F2] dark:bg-[#23201D] border border-[#E8E2D9] dark:border-[#38332E] max-w-xs w-full p-4 sm:p-5 rounded-3xl shadow-xl z-10 space-y-3.5 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Banner */}
            <div className="pb-1 border-b border-[#E8E2D9] dark:border-[#38332E]">
              <h2 className="font-pixel text-xs text-[#5F5244] dark:text-[#E7E2DA] tracking-wider uppercase">
                ✦ SUMMON REWARDS ✦
              </h2>
              <p className="font-silkscreen text-[8.5px] text-[#A89F91] mt-0.5 tracking-wider uppercase">
                {results.length === 1
                  ? '1 ITEM ACQUIRED'
                  : `${results.length} ITEMS OBTAINED`}
              </p>
            </div>

            {/* SINGLE RESULT VIEW */}
            {results.length === 1 ? (
              <div className="bg-[#F3EFEA] dark:bg-[#1E1B18] border border-[#E2DBD1] dark:border-[#36302A] rounded-2xl p-3.5 flex flex-col items-center justify-center space-y-2">
                {(() => {
                  const single = results[0];
                  const grade = getGachaGrade(single.item);
                  return (
                    <>
                      <div className="relative w-20 h-20 rounded-xl flex items-center justify-center bg-white dark:bg-[#292522] border border-[#E0D9CE] dark:border-[#3A342E] shadow-xs">
                        <span
                          className={`absolute top-1 left-1 font-pixel text-[7.5px] px-1 rounded-sm ${
                            grade === 'SR'
                              ? 'bg-amber-100 text-amber-900'
                              : grade === 'R'
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {grade}
                        </span>
                        <div className="transform scale-[1.5] pixel-art-rendering">
                          <PixelItemThumbnail
                            id={single.item.id}
                            category={single.item.category}
                            size={36}
                          />
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <span className="font-silkscreen text-[8px] text-[#A89F91] tracking-wider uppercase">
                          [{getCategoryLabel(single.item.category)}]
                        </span>
                        <h4 className="font-pixel text-[11px] text-[#292524] dark:text-[#F5F5F4]">
                          {single.item.name}
                        </h4>
                        <div>
                          {single.isNew ? (
                            <span className="inline-block bg-[#5F7A61] text-white px-2 py-0.5 rounded-full font-pixel text-[7.5px] uppercase">
                              NEW ITEM
                            </span>
                          ) : (
                            <span className="inline-block bg-[#EAE4DC] dark:bg-[#2C2723] text-[#786E64] dark:text-[#B5ADA3] px-2 py-0.5 rounded-full font-pixel text-[7px] uppercase">
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
              <div className="grid grid-cols-5 gap-1.5 p-2 bg-[#F3EFEA] dark:bg-[#1E1B18] border border-[#E2DBD1] dark:border-[#36302A] rounded-2xl max-h-[38vh] overflow-y-auto">
                {results.map((res, idx) => {
                  const grade = getGachaGrade(res.item);
                  return (
                    <div
                      key={idx}
                      className={`relative aspect-square rounded-xl border flex items-center justify-center p-1 bg-white dark:bg-[#292522] ${
                        grade === 'SR'
                          ? 'border-amber-300 dark:border-amber-700'
                          : grade === 'R'
                          ? 'border-emerald-300 dark:border-emerald-700'
                          : 'border-[#E0D9CE] dark:border-[#3A342E]'
                      }`}
                    >
                      {/* Grade Badge */}
                      <span
                        className={`absolute top-0.5 left-0.5 font-pixel text-[5.5px] px-0.5 rounded-xs ${
                          grade === 'SR'
                            ? 'bg-amber-100 text-amber-900'
                            : grade === 'R'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {grade}
                      </span>

                      {/* NEW Badge */}
                      {res.isNew && (
                        <span className="absolute bottom-0.5 right-0.5 font-pixel text-[5px] bg-[#5F7A61] text-white px-0.5 rounded-xs">
                          NEW
                        </span>
                      )}

                      {/* Thumbnail */}
                      <div className="transform scale-[1.05] pixel-art-rendering">
                        <PixelItemThumbnail
                          id={res.item.id}
                          category={res.item.category}
                          size={26}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              {canSpinAgain && onSpinAgain && (
                <button
                  type="button"
                  id="cozy-spin-again-btn"
                  onClick={() => {
                    if (soundEnabled) soundEngine.playTapSound();
                    if (hapticEnabled) triggerHaptic();
                    onSpinAgain();
                  }}
                  className="flex-1 py-2 bg-[#B86F52] hover:bg-[#A35E43] text-white font-pixel text-[9px] rounded-xl shadow-sm uppercase transition cursor-pointer"
                >
                  ↺ SPIN ({spinAgainCost})
                </button>
              )}

              <button
                type="button"
                id="cozy-done-btn"
                onClick={() => {
                  if (soundEnabled) soundEngine.playTapSound();
                  if (hapticEnabled) triggerHaptic();
                  onComplete();
                }}
                className="flex-1 py-2 bg-[#5F7A61] hover:bg-[#526B54] text-white font-pixel text-[9px] rounded-xl shadow-sm uppercase transition cursor-pointer"
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
