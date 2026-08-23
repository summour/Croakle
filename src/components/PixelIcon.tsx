import React from 'react';

export type PixelIconName =
  | 'all'
  | 'companions'
  | 'pets'
  | 'outfits'
  | 'hats'
  | 'accessories'
  | 'face'
  | 'skins'
  | 'frog'
  | 'props'
  | 'items'
  | 'scenes'
  | 'habitats'
  | 'weather'
  | 'sun'
  | 'coin'
  | 'gacha'
  | 'gift'
  | 'star'
  | 'sparkle'
  | 'leaf'
  | 'none'
  | 'check'
  | 'heart'
  | 'timer'
  | 'wardrobe'
  | 'shop'
  | 'sprout'
  | 'pouch'
  | 'basket'
  | 'chest'
  | 'treasury'
  | 'crown'
  | 'lantern'
  | 'clover'
  | 'ticket'
  | 'sets';

interface PixelIconProps {
  name: PixelIconName | string;
  size?: number;
  className?: string;
}

export const PixelIcon: React.FC<PixelIconProps> = ({ name, size = 16, className = '' }) => {
  const pixelStyle = { shapeRendering: 'crispEdges' as const };

  switch (name) {
    case 'sprout':
    case 'leaf':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Plant Leaf Sprout */}
          <rect x="6" y="2" width="4" height="2" fill="#22C55E" />
          <rect x="4" y="4" width="8" height="4" fill="#16A34A" />
          <rect x="5" y="8" width="6" height="3" fill="#15803D" />
          <rect x="7" y="11" width="2" height="4" fill="#14532D" />
          <rect x="6" y="5" width="2" height="2" fill="#86EFAC" />
        </svg>
      );

    case 'pouch':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Coin Pouch */}
          <rect x="6" y="2" width="4" height="2" fill="#B45309" />
          <rect x="5" y="4" width="6" height="2" fill="#DC2626" />
          <rect x="3" y="6" width="10" height="8" fill="#D97706" />
          <rect x="4" y="7" width="8" height="6" fill="#F59E0B" />
          <rect x="7" y="8" width="2" height="4" fill="#FEF08A" />
        </svg>
      );

    case 'basket':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Blossom Basket */}
          <rect x="4" y="2" width="8" height="2" fill="#EC4899" />
          <rect x="2" y="4" width="2" height="4" fill="#EC4899" />
          <rect x="12" y="4" width="2" height="4" fill="#EC4899" />
          <rect x="3" y="8" width="10" height="6" fill="#F472B6" />
          <rect x="4" y="9" width="8" height="4" fill="#FDF2F8" />
          <rect x="6" y="10" width="4" height="2" fill="#FB7185" />
        </svg>
      );

    case 'chest':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Treasure Chest */}
          <rect x="2" y="4" width="12" height="4" fill="#9333EA" />
          <rect x="1" y="8" width="14" height="6" fill="#7E22CE" />
          <rect x="2" y="5" width="12" height="1" fill="#C084FC" />
          <rect x="7" y="7" width="2" height="3" fill="#FACC15" />
          <rect x="1" y="8" width="14" height="1" fill="#FACC15" />
        </svg>
      );

    case 'treasury':
    case 'crown':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Royal Crown */}
          <rect x="2" y="5" width="2" height="3" fill="#FACC15" />
          <rect x="7" y="3" width="2" height="5" fill="#FACC15" />
          <rect x="12" y="5" width="2" height="3" fill="#FACC15" />
          <rect x="2" y="8" width="12" height="5" fill="#EAB308" />
          <rect x="4" y="10" width="2" height="2" fill="#EF4444" />
          <rect x="7" y="10" width="2" height="2" fill="#3B82F6" />
          <rect x="10" y="10" width="2" height="2" fill="#10B981" />
          <rect x="2" y="13" width="12" height="1" fill="#CA8A04" />
        </svg>
      );

    case 'lantern':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Red Lantern */}
          <rect x="6" y="1" width="4" height="2" fill="#18181B" />
          <rect x="4" y="3" width="8" height="9" fill="#DC2626" />
          <rect x="5" y="4" width="6" height="7" fill="#EF4444" />
          <rect x="7" y="5" width="2" height="5" fill="#FEF08A" />
          <rect x="6" y="12" width="4" height="2" fill="#18181B" />
          <rect x="7" y="14" width="2" height="2" fill="#DC2626" />
        </svg>
      );

    case 'clover':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          <rect x="4" y="3" width="3" height="3" fill="#22C55E" />
          <rect x="9" y="3" width="3" height="3" fill="#22C55E" />
          <rect x="4" y="8" width="3" height="3" fill="#22C55E" />
          <rect x="9" y="8" width="3" height="3" fill="#22C55E" />
          <rect x="6" y="5" width="4" height="4" fill="#16A34A" />
          <rect x="7" y="9" width="2" height="5" fill="#15803D" />
        </svg>
      );

    case 'sets':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          <rect x="3" y="3" width="10" height="10" fill="#8B5CF6" />
          <rect x="7" y="3" width="2" height="10" fill="#FACC15" />
          <rect x="3" y="7" width="10" height="2" fill="#FACC15" />
          <rect x="5" y="1" width="6" height="2" fill="#EC4899" />
        </svg>
      );
    case 'all':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          <rect x="2" y="2" width="5" height="5" fill="#5F7A61" />
          <rect x="9" y="2" width="5" height="5" fill="#75A65A" />
          <rect x="2" y="9" width="5" height="5" fill="#75A65A" />
          <rect x="9" y="9" width="5" height="5" fill="#5F7A61" />
          <rect x="3" y="3" width="3" height="3" fill="#D5E8C8" />
          <rect x="10" y="3" width="3" height="3" fill="#E8F3DF" />
          <rect x="3" y="10" width="3" height="3" fill="#E8F3DF" />
          <rect x="10" y="10" width="3" height="3" fill="#D5E8C8" />
        </svg>
      );

    case 'companions':
    case 'pets':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Snail / Companion */}
          <rect x="2" y="10" width="12" height="3" fill="#F2E6CA" />
          <rect x="1" y="11" width="1" height="2" fill="#4A3D2A" />
          <rect x="11" y="7" width="3" height="4" fill="#F2E6CA" />
          <rect x="11" y="5" width="1" height="2" fill="#4A3D2A" />
          <rect x="13" y="5" width="1" height="2" fill="#4A3D2A" />
          <rect x="11" y="4" width="1" height="1" fill="#18181B" />
          <rect x="13" y="4" width="1" height="1" fill="#18181B" />
          {/* Shell */}
          <rect x="4" y="5" width="6" height="6" fill="#D4A373" />
          <rect x="5" y="4" width="4" height="1" fill="#8C5E32" />
          <rect x="5" y="11" width="4" height="1" fill="#8C5E32" />
          <rect x="3" y="6" width="1" height="4" fill="#8C5E32" />
          <rect x="10" y="6" width="1" height="4" fill="#8C5E32" />
          <rect x="6" y="7" width="2" height="2" fill="#8C5E32" />
        </svg>
      );

    case 'outfits':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Kimono / Outfit */}
          <rect x="4" y="2" width="8" height="2" fill="#EA580C" />
          <rect x="2" y="4" width="12" height="8" fill="#F97316" />
          <rect x="1" y="4" width="2" height="5" fill="#EA580C" />
          <rect x="13" y="4" width="2" height="5" fill="#EA580C" />
          {/* Gold Belt / Obi */}
          <rect x="4" y="7" width="8" height="2" fill="#FACC15" />
          <rect x="7" y="7" width="2" height="2" fill="#CA8A04" />
          <rect x="3" y="12" width="10" height="2" fill="#EA580C" />
        </svg>
      );

    case 'hats':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Straw Kasa Hat */}
          <rect x="7" y="3" width="2" height="2" fill="#CA8A04" />
          <rect x="5" y="5" width="6" height="2" fill="#EAB308" />
          <rect x="3" y="7" width="10" height="2" fill="#FDE047" />
          <rect x="1" y="9" width="14" height="2" fill="#CA8A04" />
          <rect x="0" y="11" width="16" height="1" fill="#854D0E" />
          {/* Red Ribbon */}
          <rect x="6" y="8" width="4" height="1" fill="#DC2626" />
        </svg>
      );

    case 'accessories':
    case 'face':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Round Glasses */}
          <rect x="2" y="5" width="4" height="4" fill="#F8FAFC" />
          <rect x="1" y="4" width="6" height="1" fill="#D97706" />
          <rect x="1" y="9" width="6" height="1" fill="#D97706" />
          <rect x="1" y="5" width="1" height="4" fill="#D97706" />
          <rect x="6" y="5" width="1" height="4" fill="#D97706" />

          <rect x="7" y="6" width="2" height="1" fill="#D97706" />

          <rect x="10" y="5" width="4" height="4" fill="#F8FAFC" />
          <rect x="9" y="4" width="6" height="1" fill="#D97706" />
          <rect x="9" y="9" width="6" height="1" fill="#D97706" />
          <rect x="9" y="5" width="1" height="4" fill="#D97706" />
          <rect x="14" y="5" width="1" height="4" fill="#D97706" />

          <rect x="3" y="6" width="1" height="1" fill="#38BDF8" />
          <rect x="11" y="6" width="1" height="1" fill="#38BDF8" />
        </svg>
      );

    case 'skins':
    case 'frog':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Frog Head */}
          <rect x="2" y="2" width="4" height="4" fill="#75A65A" />
          <rect x="10" y="2" width="4" height="4" fill="#75A65A" />
          <rect x="3" y="3" width="2" height="2" fill="#18181B" />
          <rect x="11" y="3" width="2" height="2" fill="#18181B" />
          <rect x="3" y="3" width="1" height="1" fill="#FFFFFF" />
          <rect x="11" y="3" width="1" height="1" fill="#FFFFFF" />

          <rect x="1" y="5" width="14" height="7" fill="#75A65A" />
          <rect x="0" y="6" width="16" height="5" fill="#75A65A" />
          <rect x="4" y="9" width="8" height="3" fill="#D5E8C8" />
          <rect x="2" y="8" width="2" height="2" fill="#E88B8B" />
          <rect x="12" y="8" width="2" height="2" fill="#E88B8B" />
          <rect x="7" y="8" width="2" height="1" fill="#2D3A20" />
        </svg>
      );

    case 'props':
    case 'items':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Boba Tea Cup */}
          <rect x="7" y="1" width="2" height="5" fill="#9333EA" />
          <rect x="4" y="5" width="8" height="2" fill="#38BDF8" />
          <rect x="4" y="7" width="8" height="7" fill="#FDE047" />
          <rect x="5" y="8" width="6" height="5" fill="#D97706" />
          {/* Boba Pearls */}
          <rect x="6" y="11" width="1" height="1" fill="#18181B" />
          <rect x="8" y="11" width="1" height="1" fill="#18181B" />
          <rect x="7" y="12" width="1" height="1" fill="#18181B" />
          <rect x="9" y="12" width="1" height="1" fill="#18181B" />
        </svg>
      );

    case 'scenes':
    case 'habitats':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Shrine / House */}
          <rect x="7" y="2" width="2" height="1" fill="#DC2626" />
          <rect x="4" y="3" width="8" height="1" fill="#DC2626" />
          <rect x="2" y="4" width="12" height="2" fill="#B91C1C" />
          <rect x="4" y="6" width="8" height="7" fill="#F8FAFC" />
          <rect x="3" y="6" width="1" height="7" fill="#78350F" />
          <rect x="12" y="6" width="1" height="7" fill="#78350F" />
          <rect x="6" y="8" width="4" height="5" fill="#78350F" />
          <rect x="7" y="9" width="2" height="4" fill="#D97706" />
        </svg>
      );

    case 'weather':
    case 'sun':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Glowing Sun */}
          <rect x="7" y="1" width="2" height="2" fill="#F59E0B" />
          <rect x="7" y="13" width="2" height="2" fill="#F59E0B" />
          <rect x="1" y="7" width="2" height="2" fill="#F59E0B" />
          <rect x="13" y="7" width="2" height="2" fill="#F59E0B" />
          <rect x="3" y="3" width="2" height="2" fill="#FBBF24" />
          <rect x="11" y="3" width="2" height="2" fill="#FBBF24" />
          <rect x="3" y="11" width="2" height="2" fill="#FBBF24" />
          <rect x="11" y="11" width="2" height="2" fill="#FBBF24" />
          <rect x="5" y="5" width="6" height="6" fill="#FACC15" />
          <rect x="6" y="6" width="4" height="4" fill="#FEF08A" />
        </svg>
      );

    case 'coin':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Lily Coin */}
          <rect x="5" y="2" width="6" height="1" fill="#CA8A04" />
          <rect x="5" y="13" width="6" height="1" fill="#CA8A04" />
          <rect x="2" y="5" width="1" height="6" fill="#CA8A04" />
          <rect x="13" y="5" width="1" height="6" fill="#CA8A04" />
          <rect x="3" y="3" width="10" height="10" fill="#FACC15" />
          <rect x="4" y="4" width="8" height="8" fill="#FDE047" />
          {/* Inner Lily Leaf Emboss */}
          <rect x="6" y="6" width="4" height="4" fill="#15803D" />
          <rect x="7" y="7" width="2" height="2" fill="#22C55E" />
        </svg>
      );

    case 'gacha':
    case 'gift':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Mystery Capsule / Gift Box */}
          <rect x="3" y="2" width="10" height="6" fill="#EC4899" />
          <rect x="3" y="8" width="10" height="6" fill="#F8FAFC" />
          <rect x="2" y="7" width="12" height="2" fill="#18181B" />
          <rect x="7" y="7" width="2" height="2" fill="#FACC15" />
          <rect x="5" y="4" width="2" height="2" fill="#FDF2F8" />
        </svg>
      );

    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Golden Star */}
          <rect x="7" y="1" width="2" height="3" fill="#EAB308" />
          <rect x="6" y="4" width="4" height="2" fill="#FACC15" />
          <rect x="1" y="6" width="14" height="2" fill="#FACC15" />
          <rect x="3" y="8" width="10" height="2" fill="#FACC15" />
          <rect x="5" y="10" width="6" height="2" fill="#EAB308" />
          <rect x="4" y="12" width="2" height="3" fill="#CA8A04" />
          <rect x="10" y="12" width="2" height="3" fill="#CA8A04" />
          <rect x="7" y="6" width="2" height="2" fill="#FEF08A" />
        </svg>
      );

    case 'sparkle':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Sparkle Magic */}
          <rect x="7" y="2" width="2" height="12" fill="#60A5FA" />
          <rect x="2" y="7" width="12" height="2" fill="#60A5FA" />
          <rect x="6" y="6" width="4" height="4" fill="#93C5FD" />
          <rect x="7" y="7" width="2" height="2" fill="#FFFFFF" />
          <rect x="12" y="3" width="1" height="1" fill="#F472B6" />
          <rect x="3" y="12" width="1" height="1" fill="#F472B6" />
        </svg>
      );

    case 'leaf':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Plant Leaf Sprout */}
          <rect x="6" y="2" width="4" height="2" fill="#22C55E" />
          <rect x="4" y="4" width="8" height="4" fill="#16A34A" />
          <rect x="5" y="8" width="6" height="3" fill="#15803D" />
          <rect x="7" y="11" width="2" height="4" fill="#14532D" />
          <rect x="6" y="5" width="2" height="2" fill="#86EFAC" />
        </svg>
      );

    case 'none':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Prohibited / None */}
          <rect x="4" y="2" width="8" height="1" fill="#DC2626" />
          <rect x="4" y="13" width="8" height="1" fill="#DC2626" />
          <rect x="2" y="4" width="1" height="8" fill="#DC2626" />
          <rect x="13" y="4" width="1" height="8" fill="#DC2626" />
          <rect x="3" y="3" width="1" height="1" fill="#DC2626" />
          <rect x="12" y="3" width="1" height="1" fill="#DC2626" />
          <rect x="3" y="12" width="1" height="1" fill="#DC2626" />
          <rect x="12" y="12" width="1" height="1" fill="#DC2626" />
          {/* Slash */}
          <rect x="4" y="4" width="2" height="2" fill="#DC2626" />
          <rect x="6" y="6" width="2" height="2" fill="#DC2626" />
          <rect x="8" y="8" width="2" height="2" fill="#DC2626" />
          <rect x="10" y="10" width="2" height="2" fill="#DC2626" />
        </svg>
      );

    case 'heart':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          {/* Pixel Heart */}
          <rect x="3" y="3" width="4" height="2" fill="#F43F5E" />
          <rect x="9" y="3" width="4" height="2" fill="#F43F5E" />
          <rect x="2" y="5" width="12" height="4" fill="#E11D48" />
          <rect x="3" y="9" width="10" height="2" fill="#BE123C" />
          <rect x="5" y="11" width="6" height="2" fill="#BE123C" />
          <rect x="7" y="13" width="2" height="1" fill="#9F1239" />
          <rect x="4" y="4" width="1" height="1" fill="#FECDD3" />
        </svg>
      );

    case 'check':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          <rect x="3" y="8" width="2" height="2" fill="#16A34A" />
          <rect x="5" y="10" width="2" height="2" fill="#16A34A" />
          <rect x="7" y="8" width="2" height="2" fill="#22C55E" />
          <rect x="9" y="6" width="2" height="2" fill="#22C55E" />
          <rect x="11" y="4" width="2" height="2" fill="#22C55E" />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          <rect x="3" y="3" width="10" height="10" fill="#75A65A" />
          <rect x="5" y="5" width="6" height="6" fill="#D5E8C8" />
        </svg>
      );
  }
};
