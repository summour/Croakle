import React, { useState, useEffect } from 'react';
import { GachaPullResult, GachaGrade } from '../types';
import { PixelItemThumbnail } from './PixelItemThumbnail';
import { getGachaGrade } from '../utils/gachaUtils';
import { Sparkles, ArrowRight, RotateCcw, Check, FastForward, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
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

export const GachaSummonAnimation: React.FC<GachaSummonAnimationProps> = ({
  results,
  onComplete,
  onSpinAgain,
  canSpinAgain = false,
  spinAgainCost = 50,
  soundEnabled = true,
  hapticEnabled = true,
}) => {
  // Stages: 'intro' (magical beanstalk/portal) -> 'reveal_cards' -> 'summary'
  const [stage, setStage] = useState<'intro' | 'reveal_cards' | 'summary'>('intro');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [animTick, setAnimTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimTick((prev) => (prev + 1) % 1000);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Intro transition to first card
  useEffect(() => {
    if (stage === 'intro') {
      if (soundEnabled) soundEngine.playGachaSpinSound();
      const t = setTimeout(() => {
        setStage('reveal_cards');
        triggerCardSound(results[0]);
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const triggerCardSound = (pull: GachaPullResult | undefined) => {
    if (!pull) return;
    const grade = getGachaGrade(pull.item);
    if (grade === 'SR') {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#ec4899', '#ffffff'],
      });
      if (soundEnabled) soundEngine.playCelebrationSound();
    } else if (grade === 'R') {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#6366f1', '#ffffff'],
      });
      if (soundEnabled) soundEngine.playSuccessSound();
    } else {
      if (soundEnabled) soundEngine.playTapSound();
    }
  };

  const handleNextCard = () => {
    if (hapticEnabled) triggerHaptic();
    if (currentCardIndex + 1 < results.length) {
      const nextIdx = currentCardIndex + 1;
      setCurrentCardIndex(nextIdx);
      triggerCardSound(results[nextIdx]);
    } else {
      setStage('summary');
      if (soundEnabled) soundEngine.playCelebrationSound();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#ec4899', '#5f7a61', '#f59e0b', '#ffffff'],
      });
    }
  };

  const handleSkip = () => {
    if (soundEnabled) soundEngine.playTapSound();
    if (hapticEnabled) triggerHaptic();
    setStage('summary');
  };

  const currentResult = results[currentCardIndex] || results[0];
  const currentGrade: GachaGrade = currentResult ? getGachaGrade(currentResult.item) : 'N';

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'hats':
        return '👒';
      case 'outfits':
        return '👘';
      case 'accessories':
        return '👓';
      case 'skins':
        return '🐸';
      case 'props':
        return '🧋';
      case 'companions':
        return '🐌';
      case 'scenes':
        return '🏞️';
      default:
        return '✨';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0f172a]/85 backdrop-blur-md animate-fade-in select-none">
      {/* ------------------------------------------------------------- */}
      {/* STAGE 1: INTRO BEANSTALK / SUMMONING GLOW                   */}
      {/* ------------------------------------------------------------- */}
      {stage === 'intro' && (
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Glowing Aura Rings */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500/40 via-purple-500/30 to-amber-400/40 animate-ping opacity-60" />
            <div className="absolute inset-2 rounded-full bg-white/10 blur-xl animate-pulse" />
            
            {/* Sprouting Magic Capsule */}
            <div className="relative z-10 w-24 h-24 rounded-[32px] bg-gradient-to-b from-white/90 to-pink-100 dark:from-white/80 dark:to-pink-200 border-2 border-white flex items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.6)] animate-bounce">
              <Sparkles size={44} className="text-pink-500 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-white tracking-wide">
              Summoning from Sanctuary...
            </h2>
            <p className="text-xs text-pink-200/80 font-medium">
              Harvesting lucky botanical drops
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STAGE 2: CARD REVEAL (Exact style inspired by IMG_2865.PNG)   */}
      {/* ------------------------------------------------------------- */}
      {stage === 'reveal_cards' && currentResult && (
        <div
          className="relative w-full max-w-sm h-[82vh] max-h-[640px] flex flex-col items-center justify-between p-6 rounded-[36px] overflow-hidden shadow-2xl cursor-pointer"
          onClick={handleNextCard}
          style={{
            background:
              currentGrade === 'SR'
                ? 'linear-gradient(180deg, #382548 0%, #4a284c 40%, #1e1b2e 100%)'
                : currentGrade === 'R'
                ? 'linear-gradient(180deg, #233b53 0%, #29486b 40%, #17212e 100%)'
                : 'linear-gradient(180deg, #2b333d 0%, #3a4552 40%, #1c2229 100%)',
          }}
        >
          {/* Subtle Ambient Starry Background */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Ornate Frame Border (White Filigree as in Pokecolo) */}
          <div className="absolute inset-3 border-2 border-white/40 rounded-[28px] pointer-events-none">
            {/* Top Left Sun/Star corner */}
            <div className="absolute top-2 left-2 text-white/60 text-xs font-serif">✦</div>
            {/* Top Right Sun/Star corner */}
            <div className="absolute top-2 right-2 text-white/60 text-xs font-serif">✦</div>
            {/* Bottom Left Corner */}
            <div className="absolute bottom-2 left-2 text-white/60 text-xs font-serif">✦</div>
            {/* Bottom Right Corner */}
            <div className="absolute bottom-2 right-2 text-white/60 text-xs font-serif">✦</div>
          </div>

          {/* Top Bar: Progress counter & Skip button */}
          <div className="relative z-10 w-full flex items-center justify-between pt-2 px-1">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-black/40 text-white/90 border border-white/20 backdrop-blur-sm">
              {currentCardIndex + 1} / {results.length}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSkip();
              }}
              className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 hover:bg-white/30 text-white flex items-center gap-1 backdrop-blur-sm transition active:scale-95"
            >
              <span>Skip</span>
              <FastForward size={12} />
            </button>
          </div>

          {/* Rarity Header (Big Glowing Title) */}
          <div className="relative z-10 text-center mt-2 space-y-1">
            {currentGrade === 'SR' && (
              <div className="animate-fade-in">
                <h1 className="text-3xl sm:text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-100 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]">
                  Super Rare
                </h1>
                <div className="flex items-center justify-center gap-1.5 text-amber-200/90 text-xs font-bold mt-0.5">
                  <Sparkles size={13} />
                  <span>★ ★ ★ ★ ★</span>
                  <Sparkles size={13} />
                </div>
              </div>
            )}

            {currentGrade === 'R' && (
              <div className="animate-fade-in">
                <h1 className="text-3xl sm:text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-cyan-300 to-blue-200 drop-shadow-[0_0_20px_rgba(56,189,248,0.8)]">
                  Rare
                </h1>
                <div className="flex items-center justify-center gap-1.5 text-cyan-200/90 text-xs font-bold mt-0.5">
                  <Sparkles size={13} />
                  <span>★ ★ ★ ★</span>
                  <Sparkles size={13} />
                </div>
              </div>
            )}

            {currentGrade === 'N' && (
              <div className="animate-fade-in">
                <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  Normal
                </h1>
                <div className="text-white/60 text-xs font-bold mt-0.5">
                  <span>★ ★ ★</span>
                </div>
              </div>
            )}
          </div>

          {/* Central Item Stage with Radiant Light Beam & Pedestal */}
          <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center my-auto">
            {/* Radiant Spotlight Beam */}
            <div
              className={`absolute w-56 h-56 rounded-full blur-2xl opacity-60 animate-pulse pointer-events-none ${
                currentGrade === 'SR'
                  ? 'bg-amber-400'
                  : currentGrade === 'R'
                  ? 'bg-cyan-400'
                  : 'bg-white/40'
              }`}
            />

            {/* Glowing Light Burst Effect */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="transform scale-[2.2] transition-transform duration-300 drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]">
                <PixelItemThumbnail
                  id={currentResult.item.id}
                  category={currentResult.item.category}
                  size={64}
                />
              </div>

              {/* Floating Status Badge (NEW or Duplicate Refund) */}
              <div className="mt-8 flex items-center justify-center">
                {currentResult.isNew ? (
                  <span className="px-3.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/50 border border-white/40 animate-bounce">
                    ✨ NEW UNLOCKED!
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-amber-200 border border-amber-300/40 backdrop-blur-sm">
                    Duplicate (+{currentResult.duplicateRefundCoins || 20} Coins Refund)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Frosted Pill Banner (Matching IMG_2865.PNG) */}
          <div className="relative z-10 w-full pb-2 space-y-3">
            <div className="w-full py-2.5 px-4 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center gap-2.5 shadow-lg">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                {getCategoryIcon(currentResult.item.category)}
              </span>
              <span className="font-black text-sm text-white truncate max-w-[200px]">
                {currentResult.item.name}
              </span>
            </div>

            <div className="text-center">
              <span className="text-[11px] text-white/70 font-semibold tracking-wide animate-pulse">
                Tap anywhere to continue ➔
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STAGE 3: ALL RESULTS SUMMARY MODAL                           */}
      {/* ------------------------------------------------------------- */}
      {stage === 'summary' && (
        <div
          className="bg-[#fcfaf5] dark:bg-[#1a1714] border border-[#e3dacf] dark:border-[#383028] rounded-[32px] max-w-sm w-full p-5 sm:p-6 shadow-2xl overflow-hidden animate-scale-up space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-pink-500/15 border border-pink-500/30 text-pink-600 dark:text-pink-400 mb-0.5">
              <Sparkles size={22} />
            </div>
            <h2 className="text-lg font-black text-[#2d2823] dark:text-[#f4efe8]">
              Capsule Results!
            </h2>
            <p className="text-xs text-[#8c7e70] dark:text-[#a89b8d] font-medium">
              {results.length === 1 ? '1 item unlocked' : `${results.length} items added to your wardrobe`}
            </p>
          </div>

          {/* SINGLE PULL SHOWCASE (When 1 item is pulled) */}
          {results.length === 1 ? (
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#f5efe4]/80 dark:bg-[#151210]/80 border border-black/[0.04] dark:border-white/[0.06] space-y-3">
              {(() => {
                const single = results[0];
                const grade = getGachaGrade(single.item);
                return (
                  <>
                    <div className="relative w-24 h-24 rounded-2xl bg-white dark:bg-[#221e1a] border border-black/[0.08] dark:border-white/[0.1] flex items-center justify-center shadow-sm">
                      {/* Grade Badge */}
                      <span
                        className={`absolute top-1.5 left-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center justify-center shadow-xs z-10 ${
                          grade === 'SR'
                            ? 'bg-amber-400 text-stone-900 ring-1 ring-amber-200'
                            : grade === 'R'
                            ? 'bg-purple-500 text-white'
                            : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        {grade === 'SR' ? '★ SR' : grade === 'R' ? '★ R' : 'N'}
                      </span>

                      {/* Thumbnail */}
                      <div className="transform scale-[1.7]">
                        <PixelItemThumbnail
                          id={single.item.id}
                          category={single.item.category}
                          size={40}
                        />
                      </div>
                    </div>

                    <div className="text-center space-y-1">
                      <h3 className="text-sm font-black text-[#2d2823] dark:text-[#f4efe8]">
                        {single.item.name}
                      </h3>
                      <div>
                        {single.isNew ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-pink-500 text-white shadow-xs">
                            ✨ NEW ITEM
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                            Duplicate (+{single.duplicateRefundCoins || 20} Coins Refund)
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            /* MULTI 10-PULL GRID (When 10 items are pulled) */
            <div className="grid grid-cols-5 gap-2 max-h-[38vh] overflow-y-auto p-2 bg-[#f5efe4]/70 dark:bg-[#151210]/70 rounded-2xl border border-black/[0.04] dark:border-white/[0.06]">
              {results.map((res, idx) => {
                const grade = getGachaGrade(res.item);
                return (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl bg-white dark:bg-[#221e1a] border border-black/[0.08] dark:border-white/[0.1] flex items-center justify-center p-1 shadow-2xs group"
                  >
                    {/* Grade Badge */}
                    <span
                      className={`absolute top-0.5 left-0.5 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs ${
                        grade === 'SR'
                          ? 'bg-amber-400 text-stone-900 ring-1 ring-amber-200'
                          : grade === 'R'
                          ? 'bg-purple-500 text-white'
                          : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      {grade}
                    </span>

                    {/* NEW / DUP Badge */}
                    {res.isNew ? (
                      <span className="absolute bottom-0.5 right-0.5 px-1 rounded-sm text-[7px] font-black bg-pink-500 text-white">
                        NEW
                      </span>
                    ) : (
                      <span className="absolute bottom-0.5 right-0.5 text-[7px] font-bold text-[#8c7e70]">
                        DUP
                      </span>
                    )}

                    {/* Thumbnail */}
                    <div className="transform scale-[1.1]">
                      <PixelItemThumbnail
                        id={res.item.id}
                        category={res.item.category}
                        size={32}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            {canSpinAgain && onSpinAgain && (
              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) soundEngine.playTapSound();
                  if (hapticEnabled) triggerHaptic();
                  onSpinAgain();
                }}
                className="flex-1 py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <RotateCcw size={14} />
                <span>Spin Again ({spinAgainCost} Coins)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (soundEnabled) soundEngine.playTapSound();
                if (hapticEnabled) triggerHaptic();
                onComplete();
              }}
              className="flex-1 py-3 rounded-2xl text-xs font-black bg-[#5f7a61] hover:bg-[#4d6650] text-white flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
            >
              <Check size={14} />
              <span>OK</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
