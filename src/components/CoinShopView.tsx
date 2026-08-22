import React, { useState } from 'react';
import { FrogShopState } from '../types';
import { LilyCoinIcon } from './FrogIcons';
import {
  ArrowLeft,
  Sparkles,
  Gift,
  Coins,
  History,
  CheckCircle2,
  Heart,
  Droplets,
  Award,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine, triggerHaptic } from '../utils/audioUtils';

interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  bonusCoins?: number;
  tag?: string;
  priceDisplay: string;
  icon: string;
  color: string;
}

const COIN_PACKAGES: CoinPackage[] = [
  {
    id: 'bundle_sprout',
    name: 'Handful of Lilies',
    coins: 200,
    priceDisplay: '$0.99',
    icon: '🌿',
    color: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300',
  },
  {
    id: 'bundle_pouch',
    name: 'Pouch of Lily Coins',
    coins: 600,
    bonusCoins: 50,
    tag: 'Popular',
    priceDisplay: '$2.99',
    icon: '🪷',
    color: 'from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-800 dark:text-amber-300',
  },
  {
    id: 'bundle_basket',
    name: 'Lotus Blossom Basket',
    coins: 1500,
    bonusCoins: 250,
    tag: 'Best Value',
    priceDisplay: '$6.99',
    icon: '🌸',
    color: 'from-rose-500/10 to-rose-500/5 border-rose-500/20 text-rose-800 dark:text-rose-300',
  },
  {
    id: 'bundle_chest',
    name: 'Lantern Treasure Chest',
    coins: 4000,
    bonusCoins: 800,
    tag: 'Collector',
    priceDisplay: '$14.99',
    icon: '🏮',
    color: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-800 dark:text-purple-300',
  },
  {
    id: 'bundle_treasury',
    name: 'Emperor Royal Treasury',
    coins: 10000,
    bonusCoins: 3000,
    tag: 'Grand',
    priceDisplay: '$29.99',
    icon: '👑',
    color: 'from-yellow-500/15 to-amber-500/10 border-yellow-500/30 text-yellow-900 dark:text-yellow-200',
  },
];

interface CoinShopViewProps {
  shopState: FrogShopState;
  onEarnCoins: (amount: number, reason: string) => void;
  onClaimDailyReward: () => void;
  onBack: () => void;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
}

export const CoinShopView: React.FC<CoinShopViewProps> = ({
  shopState,
  onEarnCoins,
  onClaimDailyReward,
  onBack,
  soundEnabled = true,
  hapticEnabled = true,
}) => {
  const today = new Date().toISOString().slice(0, 10);
  const isDailyClaimed = shopState.lastDailyClaimDate === today;

  const [purchasedPackageId, setPurchasedPackageId] = useState<string | null>(null);
  const [wellTossedToday, setWellTossedToday] = useState(false);
  const [wellFortune, setWellFortune] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const FORTUNES = [
    'A peaceful pond brings calm thoughts today.',
    'Your frog feels warm and grateful for your care.',
    'Good fortune will ripple through your day.',
    'Patience is the lily pad of true wisdom.',
    'Every small step makes a gentle splash.',
  ];

  const handlePurchase = (pkg: CoinPackage) => {
    if (soundEnabled) soundEngine.playCompleteSound();
    if (hapticEnabled) triggerHaptic();

    const totalCoins = pkg.coins + (pkg.bonusCoins || 0);
    onEarnCoins(totalCoins, `Purchased ${pkg.name}`);

    setPurchasedPackageId(pkg.id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#5f7a61', '#d4af37', '#b86f52', '#f3eed9'],
    });

    setTimeout(() => {
      setPurchasedPackageId(null);
    }, 2000);
  };

  const handleTossWishingWell = () => {
    if (wellTossedToday) return;
    if (soundEnabled) soundEngine.playTapSound();
    if (hapticEnabled) triggerHaptic();

    const bonus = 35;
    const randomFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    onEarnCoins(bonus, 'Wishing Well Blessing 🪷');
    setWellTossedToday(true);
    setWellFortune(randomFortune);

    confetti({
      particleCount: 30,
      spread: 45,
      origin: { y: 0.6 },
      colors: ['#75a65a', '#facc15', '#38bdf8'],
    });
  };

  return (
    <div className="space-y-4 pb-28">
      {/* 1. Header */}
      <div className="flex items-center justify-between gap-2 px-1 pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) soundEngine.playTapSound();
              onBack();
            }}
            className="w-9 h-9 rounded-full bg-white/90 dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.1] flex items-center justify-center text-[#4a4036] dark:text-[#e0d6cb] shadow-xs active:scale-95 transition ios-tap"
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-lg font-black tracking-tight text-[#2d2823] dark:text-[#f4efe8]">
              Lily Coin Bank
            </h2>
            <p className="text-[11px] text-[#8c7e70] dark:text-[#a89b8d] font-medium">
              Acquire coins for boutique outfits & gacha summons
            </p>
          </div>
        </div>

        {/* Current Balance Badge */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/25 shadow-2xs">
          <LilyCoinIcon size={16} />
          <span className="text-sm font-black text-amber-900 dark:text-amber-200">
            {shopState.coins.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 2. Free Daily Sanctuary Bonus Card */}
      <div className="ios-glass-card p-4 rounded-3xl border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-3 bg-gradient-to-r from-emerald-500/5 via-amber-500/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#5f7a61]/15 text-[#425744] dark:text-[#9bc29e] flex items-center justify-center text-2xl shadow-2xs shrink-0">
            🎁
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-[#2d2823] dark:text-[#f4efe8]">
                Daily Lotus Fountain
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#5f7a61]/15 text-[#425744] dark:text-[#9bc29e]">
                Free
              </span>
            </div>
            <p className="text-[11px] text-[#8c7e70] dark:text-[#a89b8d]">
              Claim +50 Lily Coins once every day
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isDailyClaimed}
          onClick={() => {
            if (!isDailyClaimed) {
              if (soundEnabled) soundEngine.playCompleteSound();
              if (hapticEnabled) triggerHaptic();
              onClaimDailyReward();
              confetti({
                particleCount: 35,
                spread: 50,
                origin: { y: 0.5 },
                colors: ['#5f7a61', '#d4af37'],
              });
            }
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all active:scale-95 shadow-xs shrink-0 ${
            isDailyClaimed
              ? 'bg-black/[0.06] dark:bg-white/[0.08] text-[#8c7e70] dark:text-[#a89b8d] cursor-not-allowed'
              : 'bg-[#5f7a61] hover:bg-[#526b54] text-white'
          }`}
        >
          {isDailyClaimed ? 'Claimed' : 'Claim +50'}
        </button>
      </div>

      {/* 3. Coin Packages / Bundles */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase tracking-wider text-[#8c7e70] dark:text-[#a89b8d]">
            Coin Packages
          </span>
          <span className="text-[11px] text-[#8c7e70] dark:text-[#a89b8d]">
            Instant delivery
          </span>
        </div>

        <div className="space-y-2.5">
          {COIN_PACKAGES.map((pkg) => {
            const isJustPurchased = purchasedPackageId === pkg.id;
            const totalCoins = pkg.coins + (pkg.bonusCoins || 0);

            return (
              <div
                key={pkg.id}
                className={`ios-glass-card p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 bg-gradient-to-r ${pkg.color}`}
              >
                {/* Icon & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-white/80 dark:bg-white/[0.1] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center text-xl shadow-2xs shrink-0">
                    {pkg.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-[#2d2823] dark:text-[#f4efe8] truncate">
                        {pkg.name}
                      </span>
                      {pkg.tag && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-200">
                          {pkg.tag}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 dark:text-amber-300">
                      <LilyCoinIcon size={13} />
                      <span>{totalCoins.toLocaleString()} Coins</span>
                      {pkg.bonusCoins && (
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">
                          (+{pkg.bonusCoins} Bonus)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Purchase Button */}
                <button
                  type="button"
                  onClick={() => handlePurchase(pkg)}
                  className={`px-4 py-2 rounded-2xl text-xs font-black transition-all active:scale-95 shadow-xs shrink-0 ${
                    isJustPurchased
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-[#201c18] hover:bg-[#faf6f0] dark:hover:bg-[#2a241f] text-[#2d2823] dark:text-[#f4efe8] border border-black/[0.08] dark:border-white/[0.1]'
                  }`}
                >
                  {isJustPurchased ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={13} />
                      <span>Added!</span>
                    </span>
                  ) : (
                    <span>{pkg.priceDisplay}</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Interactive Cozy Wishing Well */}
      <div className="ios-glass-card p-4 rounded-3xl border border-black/[0.06] dark:border-white/[0.08] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🪷</span>
            <div>
              <h3 className="text-xs font-black text-[#2d2823] dark:text-[#f4efe8]">
                Peaceful Wishing Pond
              </h3>
              <p className="text-[10.5px] text-[#8c7e70] dark:text-[#a89b8d]">
                Make a daily wish for quiet blessings & bonus coins
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={wellTossedToday}
            onClick={handleTossWishingWell}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all active:scale-95 shadow-xs ${
              wellTossedToday
                ? 'bg-black/[0.06] dark:bg-white/[0.08] text-[#8c7e70] dark:text-[#a89b8d] cursor-not-allowed'
                : 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30 hover:bg-amber-500/30'
            }`}
          >
            {wellTossedToday ? 'Blessed Today' : 'Make a Wish ✨'}
          </button>
        </div>

        {wellFortune && (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-[#4a4036] dark:text-[#e0d6cb] text-center italic">
            "{wellFortune}"
          </div>
        )}
      </div>

      {/* 5. Transaction History Toggle */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] text-xs font-bold text-[#8c7e70] dark:text-[#a89b8d] hover:bg-black/[0.05] transition"
        >
          <div className="flex items-center gap-2">
            <History size={14} />
            <span>Transaction Ledger</span>
          </div>
          <span>{showHistory ? 'Hide' : 'View'}</span>
        </button>

        {showHistory && (
          <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto [scrollbar-width:none]">
            {(!shopState.transactions || shopState.transactions.length === 0) ? (
              <p className="text-xs text-[#8c7e70] dark:text-[#a89b8d] text-center py-3 italic">
                No coin activity recorded yet.
              </p>
            ) : (
              shopState.transactions.slice(0, 15).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/60 dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-[#2d2823] dark:text-[#f4efe8] block truncate">
                      {tx.title}
                    </span>
                    <span className="text-[10px] text-[#8c7e70] dark:text-[#a89b8d]">
                      {tx.date}
                    </span>
                  </div>
                  <span
                    className={`font-black shrink-0 ${
                      tx.type === 'earn'
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {tx.type === 'earn' ? `+${tx.amount}` : `-${tx.amount}`}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
