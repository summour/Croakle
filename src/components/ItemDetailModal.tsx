import React from 'react';
import { ShopItem, PixelSceneConfig, GachaGrade } from '../types';
import { PixelItemThumbnail } from './PixelItemThumbnail';
import { getGachaGrade } from '../utils/gachaUtils';
import { X, Heart, Sparkles, Check, Shirt, Eye } from 'lucide-react';
import { soundEngine, triggerHaptic } from '../utils/audioUtils';

interface ItemDetailModalProps {
  item: ShopItem | null;
  isOpen: boolean;
  onClose: () => void;
  isOwned: boolean;
  isEquipped?: boolean;
  onEquip?: (item: ShopItem) => void;
  onTryOn?: (item: ShopItem) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (itemId: string) => void;
  wishlistCount?: number;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  isOwned,
  isEquipped = false,
  onEquip,
  onTryOn,
  isWishlisted = false,
  onToggleWishlist,
  wishlistCount = 12,
  soundEnabled = true,
  hapticEnabled = true,
}) => {
  if (!isOpen || !item) return null;

  const grade = getGachaGrade(item);

  const getCategoryName = (cat: string) => {
    switch (cat) {
      case 'hats':
        return { label: 'Headwear', icon: '👒' };
      case 'outfits':
        return { label: 'Outfit', icon: '👘' };
      case 'accessories':
        return { label: 'Face Item', icon: '👓' };
      case 'skins':
        return { label: 'Frog Skin', icon: '🐸' };
      case 'props':
        return { label: 'Item & Activity', icon: '🧋' };
      case 'companions':
        return { label: 'Companion Pet', icon: '🐌' };
      case 'scenes':
        return { label: 'Sanctuary Room', icon: '🏞️' };
      default:
        return { label: 'Item', icon: '✨' };
    }
  };

  const catInfo = getCategoryName(item.category);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#fcfaf5] dark:bg-[#1a1714] border border-[#e3dacf] dark:border-[#383028] rounded-[32px] max-w-sm w-full shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">{catInfo.icon}</span>
            <span className="text-xs font-black text-[#8c7e70] dark:text-[#a89b8d] tracking-wider uppercase">
              {catInfo.label}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 flex items-center justify-center text-[#6e6052] dark:text-[#d6cbbe] transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Large Item Stage Preview (Inspired by Pokecolo Cocone screenshot) */}
        <div className="px-5 pt-2 pb-4">
          <div className="relative w-full aspect-square max-h-56 rounded-[24px] bg-gradient-to-b from-[#fce7f3]/60 via-[#fdf2f8]/40 to-[#fdf4ff]/80 dark:from-[#2e1c2b]/60 dark:via-[#201524]/40 dark:to-[#2b182e]/80 border border-pink-200/50 dark:border-pink-900/30 flex items-center justify-center overflow-hidden shadow-inner">
            {/* Subtle Diamond / Soft Background Pattern */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#ec4899 1.5px, transparent 1.5px)`,
                backgroundSize: '16px 16px',
              }}
            />

            {/* Rarity Star Pill Badge */}
            <div className="absolute top-3 left-3 z-10">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs ${
                  grade === 'SR'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-amber-500/20'
                    : grade === 'R'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-purple-500/20'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                {grade === 'SR' ? '✨ Super Rare' : grade === 'R' ? '💜 Rare' : 'Normal'}
              </span>
            </div>

            {/* Big Pixel Item Graphic */}
            <div className="relative z-10 flex flex-col items-center justify-center transform scale-[1.7] transition-transform">
              <PixelItemThumbnail id={item.id} category={item.category} size={72} />
              {/* Soft Ground Shadow */}
              <div className="w-16 h-3 bg-black/10 dark:bg-black/30 rounded-full blur-[2px] mt-1" />
            </div>

            {/* Category Sub-badge on Bottom Left */}
            <div className="absolute bottom-3 left-3 z-10 w-7 h-7 rounded-full bg-white/90 dark:bg-[#201c18]/90 border border-black/5 dark:border-white/10 shadow-xs flex items-center justify-center text-xs">
              {catInfo.icon}
            </div>

            {/* Wishlist Heart on Bottom Right */}
            {onToggleWishlist && (
              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) soundEngine.playTapSound();
                  if (hapticEnabled) triggerHaptic();
                  onToggleWishlist(item.id);
                }}
                className={`absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm transition-all active:scale-90 ${
                  isWishlisted
                    ? 'bg-[#ec4899] text-white ring-2 ring-pink-300'
                    : 'bg-white/90 dark:bg-[#201c18]/90 text-[#8c7e70] dark:text-[#d6cbbe] border border-black/5'
                }`}
              >
                <Heart size={13} className={isWishlisted ? 'fill-current' : ''} />
                <span className="text-[11px] font-bold">{wishlistCount + (isWishlisted ? 1 : 0)}</span>
              </button>
            )}
          </div>

          {/* Item Meta Details */}
          <div className="mt-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#2d2823] dark:text-[#f4efe8]">
                {item.name}
              </h3>
              {isOwned && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/30">
                  OWNED
                </span>
              )}
            </div>

            {/* Lore / Description Box */}
            <div className="p-3 rounded-2xl bg-[#f5efe4]/80 dark:bg-[#151210]/80 border border-black/[0.04] dark:border-white/[0.06]">
              <p className="text-xs text-[#6e6052] dark:text-[#c4b5a5] leading-relaxed">
                {item.desc || 'A delightful cosmetic item crafted for your peaceful frog sanctuary.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-1 flex items-center gap-2">
            {isOwned ? (
              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) soundEngine.playEquipSound();
                  if (hapticEnabled) triggerHaptic();
                  if (onEquip) onEquip(item);
                  onClose();
                }}
                className={`flex-1 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition active:scale-95 ${
                  isEquipped
                    ? 'bg-[#5f7a61]/15 border border-[#5f7a61]/30 text-[#5f7a61] dark:text-[#8fc493]'
                    : 'bg-[#5f7a61] hover:bg-[#4d6650] text-white'
                }`}
              >
                {isEquipped ? (
                  <>
                    <Check size={14} />
                    <span>Currently Wearing</span>
                  </>
                ) : (
                  <>
                    <Shirt size={14} />
                    <span>Wear Now</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) soundEngine.playTapSound();
                  if (hapticEnabled) triggerHaptic();
                  if (onTryOn) onTryOn(item);
                  onClose();
                }}
                className="flex-1 py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-95 text-white flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
              >
                <Eye size={14} />
                <span>Try On Preview</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-2xl text-xs font-black bg-white dark:bg-white/[0.08] text-[#4a4036] dark:text-[#e0d6cb] border border-black/[0.06] dark:border-white/[0.1] transition active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
