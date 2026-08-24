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
  | 'coins'
  | 'gacha'
  | 'gift'
  | 'star'
  | 'sparkle'
  | 'sparkles'
  | 'leaf'
  | 'sprout'
  | 'none'
  | 'check'
  | 'heart'
  | 'love'
  | 'timer'
  | 'wardrobe'
  | 'shop'
  | 'pouch'
  | 'basket'
  | 'chest'
  | 'treasury'
  | 'crown'
  | 'lantern'
  | 'clover'
  | 'ticket'
  | 'sets'
  | 'arcade'
  | 'joystick'
  | 'camp'
  | 'tent'
  | 'store'
  | 'konbini'
  | 'sushi'
  | 'lotus'
  | 'zen'
  | 'coffee'
  | 'tea'
  | 'matcha'
  | 'trophy'
  | 'award'
  | 'gamepad'
  | 'music'
  | 'notes'
  | 'art'
  | 'palette'
  | 'cake'
  | 'onigiri'
  | 'paw'
  | 'crystal'
  | 'magic'
  | 'book'
  | 'reading'
  | 'target'
  | 'goal'
  | 'bell'
  | 'light'
  | 'fire'
  | 'campfire'
  | 'moon'
  | 'sakura';

interface PixelIconProps {
  name: PixelIconName | string;
  size?: number;
  className?: string;
}

export const PixelIcon: React.FC<PixelIconProps> = ({ name, size = 16, className = '' }) => {
  const pixelStyle = { shapeRendering: 'crispEdges' as const };
  const rawKey = typeof name === 'string' ? name.trim().toLowerCase() : '';

  // 1. RETRO ARCADE JOYSTICK (🕹️ / arcade / joystick)
  if (name === '🕹️' || rawKey === 'arcade' || rawKey === 'joystick' || rawKey === 'set_retro_arcade') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        {/* Joystick Red Ball Top with glint */}
        <rect x="6" y="1" width="4" height="4" fill="#EF4444" />
        <rect x="7" y="1" width="2" height="1" fill="#F87171" />
        <rect x="7" y="2" width="1" height="1" fill="#FFFFFF" />
        <rect x="6" y="4" width="4" height="1" fill="#B91C1C" />

        {/* Metal Shaft */}
        <rect x="7" y="5" width="2" height="4" fill="#CBD5E1" />
        <rect x="8" y="5" width="1" height="4" fill="#94A3B8" />

        {/* Base Bevel Chassis */}
        <rect x="2" y="9" width="12" height="6" fill="#1E293B" />
        <rect x="1" y="10" width="14" height="4" fill="#334155" />
        <rect x="3" y="10" width="10" height="4" fill="#1E293B" />
        <rect x="2" y="14" width="12" height="1" fill="#0F172A" />

        {/* Action Fire Buttons */}
        <rect x="11" y="11" width="2" height="2" fill="#FACC15" />
        <rect x="11" y="11" width="1" height="1" fill="#FEF08A" />
      </svg>
    );
  }

  // 2. WILDERNESS CAMP TENT & PINE (⛺ / camp / tent / set_wilderness_camp)
  if (name === '⛺' || rawKey === 'camp' || rawKey === 'tent' || rawKey === 'set_wilderness_camp') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        {/* Sky / Pine Ridge background */}
        <rect x="1" y="2" width="2" height="3" fill="#15803D" />
        <rect x="13" y="2" width="2" height="3" fill="#15803D" />

        {/* Outer Canvas Tent Khaki/Gold */}
        <polygon points="8,2 1,13 15,13" fill="#D97706" />
        <polygon points="8,2 2,13 8,13" fill="#B45309" />

        {/* Ridge Pole Stakes */}
        <rect x="7" y="1" width="2" height="2" fill="#78350F" />
        <rect x="0" y="13" width="1" height="1" fill="#94A3B8" />
        <rect x="15" y="13" width="1" height="1" fill="#94A3B8" />

        {/* Glowing Cozy Interior Doorway */}
        <polygon points="8,6 4,13 12,13" fill="#FEF08A" />
        <polygon points="8,8 5,13 11,13" fill="#F59E0B" />

        {/* Forest Grass Floor */}
        <rect x="0" y="14" width="16" height="2" fill="#14532D" />
        <rect x="2" y="14" width="3" height="1" fill="#22C55E" />
        <rect x="11" y="14" width="3" height="1" fill="#22C55E" />
      </svg>
    );
  }

  // 3. 24H NEON CONVENIENCE STORE (🏪 / store / konbini / set_convenience_store)
  if (name === '🏪' || rawKey === 'store' || rawKey === 'konbini' || rawKey === 'convenience' || rawKey === 'set_convenience_store') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        {/* Green & Orange Konbini Canopy Roof Stripes */}
        <rect x="1" y="2" width="14" height="2" fill="#10B981" />
        <rect x="1" y="4" width="14" height="1" fill="#FFFFFF" />
        <rect x="1" y="5" width="14" height="1" fill="#F97316" />

        {/* Storefront Building */}
        <rect x="2" y="6" width="12" height="8" fill="#F8FAFC" />
        {/* Glowing Window Display */}
        <rect x="3" y="7" width="5" height="4" fill="#FEF08A" />
        <rect x="4" y="8" width="3" height="2" fill="#FDE047" />
        <rect x="3" y="11" width="5" height="2" fill="#0284C7" />

        {/* Automatic Sliding Glass Door */}
        <rect x="9" y="7" width="4" height="7" fill="#38BDF8" />
        <rect x="10" y="8" width="2" height="5" fill="#E0F2FE" />
        <rect x="9" y="10" width="4" height="1" fill="#0284C7" />

        {/* Pavement Ground */}
        <rect x="0" y="14" width="16" height="2" fill="#475569" />
      </svg>
    );
  }

  // 4. PICNIC BASKET (🧺 / basket / red_riding / set_red_riding_hood)
  if (name === '🧺' || rawKey === 'basket' || rawKey === 'red_riding' || rawKey === 'set_red_riding_hood') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        {/* Basket Arch Handle */}
        <rect x="5" y="1" width="6" height="1" fill="#78350F" />
        <rect x="4" y="2" width="1" height="4" fill="#78350F" />
        <rect x="11" y="2" width="1" height="4" fill="#78350F" />

        {/* Red & White Gingham Checkered Cloth Flap */}
        <rect x="3" y="5" width="10" height="3" fill="#DC2626" />
        <rect x="4" y="5" width="2" height="1" fill="#FFFFFF" />
        <rect x="8" y="5" width="2" height="1" fill="#FFFFFF" />
        <rect x="5" y="6" width="2" height="1" fill="#FFFFFF" />
        <rect x="9" y="6" width="2" height="1" fill="#FFFFFF" />
        <rect x="2" y="7" width="3" height="3" fill="#DC2626" />
        <rect x="3" y="8" width="1" height="1" fill="#FFFFFF" />

        {/* Wicker Woven Basket Body */}
        <rect x="3" y="8" width="10" height="6" fill="#D97706" />
        <rect x="4" y="9" width="8" height="4" fill="#F59E0B" />
        <rect x="5" y="9" width="1" height="4" fill="#B45309" />
        <rect x="8" y="9" width="1" height="4" fill="#B45309" />
        <rect x="11" y="9" width="1" height="4" fill="#B45309" />
        <rect x="4" y="11" width="8" height="1" fill="#B45309" />
        <rect x="4" y="14" width="8" height="1" fill="#78350F" />
      </svg>
    );
  }

  // 5. EDOMAE SUSHI NIGIRI (🍣 / sushi / set_edomae_sushi)
  if (name === '🍣' || rawKey === 'sushi' || rawKey === 'set_edomae_sushi') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        {/* Fresh Salmon Sashimi Topping */}
        <rect x="2" y="3" width="12" height="5" fill="#F97316" />
        <rect x="1" y="4" width="14" height="3" fill="#EA580C" />
        <rect x="3" y="3" width="10" height="1" fill="#FB923C" />
        {/* White Fatty Marbling Streaks */}
        <rect x="4" y="4" width="2" height="3" fill="#FED7AA" />
        <rect x="8" y="4" width="2" height="3" fill="#FED7AA" />
        <rect x="12" y="4" width="1" height="3" fill="#FED7AA" />

        {/* Sushi Rice Pillow Base */}
        <rect x="2" y="8" width="12" height="5" fill="#FFFFFF" />
        <rect x="1" y="9" width="14" height="3" fill="#F8FAFC" />
        <rect x="3" y="12" width="10" height="1" fill="#E2E8F0" />
        <rect x="4" y="10" width="1" height="1" fill="#CBD5E1" />
        <rect x="10" y="10" width="1" height="1" fill="#CBD5E1" />

        {/* Deep Green Nori Seaweed Ribbon Wrap */}
        <rect x="7" y="3" width="2" height="10" fill="#064E3B" />
        <rect x="8" y="3" width="1" height="10" fill="#047857" />
      </svg>
    );
  }

  // 6. SERENE LOTUS BLOSSOM (🪷 / lotus / zen / set_classic_zen)
  if (name === '🪷' || rawKey === 'lotus' || rawKey === 'zen' || rawKey === 'set_classic_zen') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        {/* Emerald Lily Pad Floating Leaf Base */}
        <rect x="1" y="12" width="14" height="2" fill="#15803D" />
        <rect x="2" y="11" width="12" height="1" fill="#16A34A" />
        <rect x="6" y="13" width="4" height="1" fill="#14532D" />

        {/* Outer Pink Lotus Petals */}
        <rect x="2" y="6" width="3" height="5" fill="#EC4899" />
        <rect x="11" y="6" width="3" height="5" fill="#EC4899" />
        <rect x="3" y="5" width="2" height="2" fill="#F472B6" />
        <rect x="11" y="5" width="2" height="2" fill="#F472B6" />

        {/* Center Main Lotus Blossom Petals */}
        <rect x="5" y="4" width="6" height="7" fill="#F472B6" />
        <rect x="6" y="3" width="4" height="6" fill="#FDF2F8" />
        <rect x="7" y="2" width="2" height="4" fill="#FFFFFF" />

        {/* Golden Pistil Pollen Core */}
        <rect x="7" y="6" width="2" height="3" fill="#FACC15" />
        <rect x="7" y="7" width="2" height="1" fill="#CA8A04" />
      </svg>
    );
  }

  // 7. CUTE FROG HEAD (🐸 / frog / skins)
  if (name === '🐸' || rawKey === 'frog' || rawKey === 'skins') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        {/* Eye Bumps */}
        <rect x="2" y="2" width="4" height="4" fill="#75A65A" />
        <rect x="10" y="2" width="4" height="4" fill="#75A65A" />
        <rect x="3" y="3" width="2" height="2" fill="#18181B" />
        <rect x="11" y="3" width="2" height="2" fill="#18181B" />
        <rect x="3" y="3" width="1" height="1" fill="#FFFFFF" />
        <rect x="11" y="3" width="1" height="1" fill="#FFFFFF" />

        {/* Head Main */}
        <rect x="1" y="5" width="14" height="7" fill="#75A65A" />
        <rect x="0" y="6" width="16" height="5" fill="#75A65A" />
        <rect x="4" y="9" width="8" height="3" fill="#D5E8C8" />
        <rect x="2" y="8" width="2" height="2" fill="#FB7185" />
        <rect x="12" y="8" width="2" height="2" fill="#FB7185" />
        <rect x="7" y="8" width="2" height="1" fill="#2D3A20" />
      </svg>
    );
  }

  // 8. STEAMING COFFEE / TEA MUG (☕ / coffee)
  if (name === '☕' || rawKey === 'coffee') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        {/* Rising Steam Puffs */}
        <rect x="5" y="1" width="1" height="2" fill="#CBD5E1" />
        <rect x="6" y="2" width="1" height="2" fill="#E2E8F0" />
        <rect x="9" y="1" width="1" height="2" fill="#CBD5E1" />
        <rect x="10" y="2" width="1" height="2" fill="#E2E8F0" />

        {/* Ceramic Mug Body */}
        <rect x="3" y="5" width="8" height="9" fill="#0284C7" />
        <rect x="4" y="6" width="6" height="7" fill="#0369A1" />
        {/* Hot Brew */}
        <rect x="4" y="6" width="6" height="2" fill="#451A03" />

        {/* Mug Handle */}
        <rect x="11" y="7" width="3" height="5" fill="#0284C7" />
        <rect x="12" y="8" width="1" height="3" fill="#F8FAFC" />

        {/* Saucer */}
        <rect x="1" y="14" width="12" height="1" fill="#0369A1" />
      </svg>
    );
  }

  // 9. JAPANESE MATCHA TEA BOWL (🍵 / tea / matcha)
  if (name === '🍵' || rawKey === 'tea' || rawKey === 'matcha') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        {/* Ceramic Chawan Bowl */}
        <rect x="3" y="6" width="10" height="7" fill="#292524" />
        <rect x="2" y="7" width="12" height="5" fill="#44403C" />
        <rect x="4" y="13" width="8" height="1" fill="#1C1917" />

        {/* Frothy Green Matcha */}
        <rect x="3" y="6" width="10" height="3" fill="#16A34A" />
        <rect x="4" y="6" width="8" height="2" fill="#22C55E" />
        <rect x="6" y="6" width="3" height="1" fill="#86EFAC" />
      </svg>
    );
  }

  // 10. CRACKLING CAMPFIRE (🔥 / fire / campfire)
  if (name === '🔥' || rawKey === 'fire' || rawKey === 'campfire') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        {/* Crossed Wood Logs */}
        <rect x="2" y="12" width="12" height="2" fill="#78350F" />
        <rect x="3" y="11" width="10" height="1" fill="#451A03" />

        {/* Outer Red/Orange Flame */}
        <polygon points="8,1 3,12 13,12" fill="#EF4444" />
        {/* Inner Yellow Core */}
        <polygon points="8,4 5,12 11,12" fill="#F97316" />
        <polygon points="8,7 6,12 10,12" fill="#FACC15" />
        <polygon points="8,9 7,12 9,12" fill="#FFFFFF" />
      </svg>
    );
  }

  // 11. GOLDEN STAR (⭐ / star)
  if (name === '⭐' || rawKey === 'star') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
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
  }

  // 12. GLITTERING SPARKLES (✨ / sparkle / sparkles)
  if (name === '✨' || rawKey === 'sparkle' || rawKey === 'sparkles') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        {/* Main Sparkle */}
        <rect x="7" y="1" width="2" height="11" fill="#38BDF8" />
        <rect x="2" y="6" width="11" height="2" fill="#38BDF8" />
        <rect x="6" y="5" width="4" height="4" fill="#93C5FD" />
        <rect x="7" y="6" width="2" height="2" fill="#FFFFFF" />
        {/* Mini Side Sparkle */}
        <rect x="12" y="2" width="2" height="2" fill="#FACC15" />
        <rect x="3" y="12" width="2" height="2" fill="#F472B6" />
      </svg>
    );
  }

  // 13. WARM 8-BIT HEART (💖 / heart / love)
  if (name === '💖' || rawKey === 'heart' || rawKey === 'love') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        <rect x="2" y="2" width="4" height="2" fill="#E53935" />
        <rect x="10" y="2" width="4" height="2" fill="#E53935" />
        <rect x="1" y="4" width="14" height="4" fill="#E53935" />
        <rect x="2" y="8" width="12" height="2" fill="#E53935" />
        <rect x="3" y="10" width="10" height="2" fill="#E53935" />
        <rect x="4" y="12" width="8" height="1" fill="#E53935" />
        <rect x="5" y="13" width="6" height="1" fill="#E53935" />
        <rect x="6" y="14" width="4" height="1" fill="#E53935" />
        <rect x="7" y="15" width="2" height="1" fill="#E53935" />
        <rect x="3" y="4" width="2" height="2" fill="#FFFFFF" opacity="0.8" />
      </svg>
    );
  }

  // 14. CHAMPION TROPHY (🏆 / trophy / award)
  if (name === '🏆' || rawKey === 'trophy' || rawKey === 'award') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        {/* Golden Cup */}
        <rect x="4" y="2" width="8" height="6" fill="#FACC15" />
        <rect x="5" y="3" width="6" height="5" fill="#FEF08A" />
        <rect x="5" y="8" width="6" height="2" fill="#EAB308" />
        <rect x="6" y="10" width="4" height="2" fill="#CA8A04" />
        {/* Handles */}
        <rect x="2" y="3" width="2" height="4" fill="#FACC15" />
        <rect x="12" y="3" width="2" height="4" fill="#FACC15" />
        {/* Stand Base */}
        <rect x="5" y="12" width="6" height="1" fill="#EAB308" />
        <rect x="4" y="13" width="8" height="2" fill="#78350F" />
      </svg>
    );
  }

  // 15. RETRO GAME CONTROLLER (🎮 / gamepad)
  if (name === '🎮' || rawKey === 'gamepad') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        <rect x="2" y="4" width="12" height="8" fill="#64748B" />
        <rect x="1" y="5" width="14" height="6" fill="#475569" />
        {/* D-Pad */}
        <rect x="3" y="7" width="3" height="1" fill="#1E293B" />
        <rect x="4" y="6" width="1" height="3" fill="#1E293B" />
        {/* Action Buttons */}
        <rect x="10" y="7" width="2" height="2" fill="#EF4444" />
        <rect x="12" y="6" width="2" height="2" fill="#FACC15" />
      </svg>
    );
  }

  // 16. CHERRY BLOSSOM FLOWER (🌸 / sakura)
  if (name === '🌸' || rawKey === 'sakura') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        <rect x="6" y="2" width="4" height="3" fill="#F472B6" />
        <rect x="2" y="6" width="3" height="4" fill="#F472B6" />
        <rect x="11" y="6" width="3" height="4" fill="#F472B6" />
        <rect x="4" y="11" width="3" height="3" fill="#F472B6" />
        <rect x="9" y="11" width="3" height="3" fill="#F472B6" />
        {/* Center */}
        <rect x="6" y="6" width="4" height="4" fill="#EC4899" />
        <rect x="7" y="7" width="2" height="2" fill="#BE185D" />
      </svg>
    );
  }

  // 17. CRESCENT MOON (🌙 / moon)
  if (name === '🌙' || rawKey === 'moon') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        <rect x="7" y="2" width="4" height="2" fill="#FDE047" />
        <rect x="11" y="3" width="2" height="2" fill="#FDE047" />
        <rect x="5" y="4" width="4" height="2" fill="#FDE047" />
        <rect x="4" y="6" width="3" height="4" fill="#FDE047" />
        <rect x="5" y="10" width="4" height="2" fill="#FDE047" />
        <rect x="7" y="12" width="4" height="2" fill="#FDE047" />
        <rect x="11" y="11" width="2" height="2" fill="#FDE047" />
      </svg>
    );
  }

  // 18. SUN / WEATHER (☀️ / sun / weather)
  if (name === '☀️' || rawKey === 'sun' || rawKey === 'weather') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
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
  }

  // 19. STRAWBERRY CAKE (🍰 / cake)
  if (name === '🍰' || rawKey === 'cake') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        {/* Berry on Top */}
        <rect x="7" y="2" width="2" height="2" fill="#EF4444" />
        <rect x="8" y="1" width="1" height="1" fill="#22C55E" />

        {/* Triangle Slice */}
        <polygon points="8,4 2,13 14,13" fill="#FEF3C7" />
        <rect x="3" y="9" width="10" height="2" fill="#FFFFFF" />
        <rect x="2" y="13" width="12" height="1" fill="#B45309" />
      </svg>
    );
  }

  // 20. ONIGIRI RICE BALL (🍙 / onigiri)
  if (name === '🍙' || rawKey === 'onigiri') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        <polygon points="8,2 2,13 14,13" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
        {/* Nori Wrap Band */}
        <rect x="5" y="9" width="6" height="4" fill="#18181B" />
        <rect x="6" y="9" width="4" height="1" fill="#27272A" />
      </svg>
    );
  }

  // 21. PET PAW PRINT (🐾 / paw)
  if (name === '🐾' || rawKey === 'paw') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        {/* Main Pad */}
        <rect x="4" y="8" width="8" height="5" fill="#FB7185" />
        <rect x="5" y="7" width="6" height="7" fill="#F43F5E" />
        {/* 4 Toe Beans */}
        <rect x="3" y="4" width="2" height="3" fill="#FB7185" />
        <rect x="6" y="2" width="2" height="3" fill="#FB7185" />
        <rect x="9" y="2" width="2" height="3" fill="#FB7185" />
        <rect x="12" y="4" width="2" height="3" fill="#FB7185" />
      </svg>
    );
  }

  // 22. MUSICAL NOTES (🎵 / music / notes)
  if (name === '🎵' || rawKey === 'music' || rawKey === 'notes') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        {/* Top Connecting Bar */}
        <rect x="4" y="3" width="8" height="2" fill="#8B5CF6" />
        {/* Stems */}
        <rect x="4" y="3" width="2" height="8" fill="#8B5CF6" />
        <rect x="10" y="3" width="2" height="8" fill="#8B5CF6" />
        {/* Note Heads */}
        <rect x="2" y="9" width="4" height="3" fill="#7C3AED" />
        <rect x="8" y="9" width="4" height="3" fill="#7C3AED" />
      </svg>
    );
  }

  // 23. ART PALETTE (🎨 / art / palette)
  if (name === '🎨' || rawKey === 'art' || rawKey === 'palette') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        {/* Palette Body */}
        <rect x="2" y="2" width="12" height="11" fill="#D97706" />
        <rect x="3" y="1" width="10" height="13" fill="#F59E0B" />
        {/* Paint Drops */}
        <rect x="4" y="3" width="2" height="2" fill="#EF4444" />
        <rect x="8" y="3" width="2" height="2" fill="#3B82F6" />
        <rect x="11" y="6" width="2" height="2" fill="#10B981" />
        <rect x="11" y="9" width="2" height="2" fill="#FACC15" />
        {/* Thumb Hole */}
        <rect x="4" y="9" width="3" height="3" fill="#18181B" opacity="0.3" />
      </svg>
    );
  }

  // 24. TARGET / BULLSEYE (🎯 / target / goal)
  if (name === '🎯' || rawKey === 'target' || rawKey === 'goal') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        <rect x="2" y="2" width="12" height="12" fill="#EF4444" />
        <rect x="4" y="4" width="8" height="8" fill="#FFFFFF" />
        <rect x="6" y="6" width="4" height="4" fill="#EF4444" />
        <rect x="7" y="7" width="2" height="2" fill="#FEF08A" />
      </svg>
    );
  }

  // 25. BOOK / READING (📚 / book / reading)
  if (name === '📚' || rawKey === 'book' || rawKey === 'reading') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        <rect x="2" y="3" width="12" height="10" fill="#78350F" />
        <rect x="3" y="4" width="10" height="8" fill="#FEF3C7" />
        <rect x="7" y="4" width="2" height="8" fill="#D97706" />
        <rect x="7" y="12" width="2" height="3" fill="#DC2626" />
      </svg>
    );
  }

  // 26. GACHA / ADMISSION TICKET (🎟️ / ticket)
  if (name === '🎟️' || rawKey === 'ticket') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        {/* Ticket Base Body Gold / Amber */}
        <rect x="2" y="3" width="12" height="10" fill="#F59E0B" />
        <rect x="3" y="4" width="10" height="8" fill="#FEF08A" />
        {/* Perforated side notches */}
        <rect x="2" y="7" width="2" height="2" fill="#18181B" opacity="0.3" />
        <rect x="12" y="7" width="2" height="2" fill="#18181B" opacity="0.3" />
        {/* Center Star Stamp */}
        <rect x="7" y="6" width="2" height="4" fill="#D97706" />
        <rect x="6" y="7" width="4" height="2" fill="#D97706" />
        <rect x="7" y="7" width="2" height="2" fill="#FFFFFF" />
      </svg>
    );
  }

  // 27. CRYSTAL MAGIC ORB (🔮 / crystal / magic)
  if (name === '🔮' || rawKey === 'crystal' || rawKey === 'magic') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        {/* Glowing Orb */}
        <rect x="4" y="2" width="8" height="8" fill="#A855F7" />
        <rect x="3" y="3" width="10" height="6" fill="#C084FC" />
        <rect x="5" y="3" width="4" height="4" fill="#F3E8FF" />
        <rect x="5" y="3" width="2" height="2" fill="#FFFFFF" />
        {/* Stand Base */}
        <rect x="5" y="10" width="6" height="2" fill="#CA8A04" />
        <rect x="4" y="12" width="8" height="2" fill="#FACC15" />
      </svg>
    );
  }

  // 28. GOLDEN CHIME BELL (🔔 / bell)
  if (name === '🔔' || rawKey === 'bell') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        {/* Top Loop */}
        <rect x="7" y="1" width="2" height="2" fill="#EAB308" />
        {/* Bell Body */}
        <rect x="5" y="3" width="6" height="6" fill="#FACC15" />
        <rect x="4" y="6" width="8" height="4" fill="#FACC15" />
        <rect x="2" y="10" width="12" height="2" fill="#EAB308" />
        <rect x="6" y="4" width="2" height="4" fill="#FEF08A" />
        {/* Clapper */}
        <rect x="7" y="12" width="2" height="2" fill="#78350F" />
      </svg>
    );
  }

  // 29. GLOWING LIGHTBULB (💡 / light / idea)
  if (name === '💡' || rawKey === 'light' || rawKey === 'idea') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
        <rect x="5" y="2" width="6" height="6" fill="#FACC15" />
        <rect x="4" y="3" width="8" height="4" fill="#FACC15" />
        <rect x="6" y="3" width="3" height="3" fill="#FFFFFF" />
        {/* Base Screw */}
        <rect x="6" y="8" width="4" height="2" fill="#EAB308" />
        <rect x="6" y="10" width="4" height="2" fill="#94A3B8" />
        <rect x="7" y="12" width="2" height="2" fill="#64748B" />
      </svg>
    );
  }

  // STANDARD CATEGORIES & SHOP / REWARD ICONS
  switch (rawKey) {
    case 'sprout':
    case 'leaf':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
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
          <rect x="6" y="2" width="4" height="2" fill="#B45309" />
          <rect x="5" y="4" width="6" height="2" fill="#DC2626" />
          <rect x="3" y="6" width="10" height="8" fill="#D97706" />
          <rect x="4" y="7" width="8" height="6" fill="#F59E0B" />
          <rect x="7" y="8" width="2" height="4" fill="#FEF08A" />
        </svg>
      );

    case 'chest':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
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
          <rect x="2" y="10" width="12" height="3" fill="#F2E6CA" />
          <rect x="1" y="11" width="1" height="2" fill="#4A3D2A" />
          <rect x="11" y="7" width="3" height="4" fill="#F2E6CA" />
          <rect x="11" y="5" width="1" height="2" fill="#4A3D2A" />
          <rect x="13" y="5" width="1" height="2" fill="#4A3D2A" />
          <rect x="11" y="4" width="1" height="1" fill="#18181B" />
          <rect x="13" y="4" width="1" height="1" fill="#18181B" />
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
          <rect x="4" y="2" width="8" height="2" fill="#EA580C" />
          <rect x="2" y="4" width="12" height="8" fill="#F97316" />
          <rect x="1" y="4" width="2" height="5" fill="#EA580C" />
          <rect x="13" y="4" width="2" height="5" fill="#EA580C" />
          <rect x="4" y="7" width="8" height="2" fill="#FACC15" />
          <rect x="7" y="7" width="2" height="2" fill="#CA8A04" />
          <rect x="3" y="12" width="10" height="2" fill="#EA580C" />
        </svg>
      );

    case 'hats':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          <rect x="7" y="3" width="2" height="2" fill="#CA8A04" />
          <rect x="5" y="5" width="6" height="2" fill="#EAB308" />
          <rect x="3" y="7" width="10" height="2" fill="#FDE047" />
          <rect x="1" y="9" width="14" height="2" fill="#CA8A04" />
          <rect x="0" y="11" width="16" height="1" fill="#854D0E" />
          <rect x="6" y="8" width="4" height="1" fill="#DC2626" />
        </svg>
      );

    case 'accessories':
    case 'face':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
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

    case 'props':
    case 'items':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          <rect x="7" y="1" width="2" height="5" fill="#9333EA" />
          <rect x="4" y="5" width="8" height="2" fill="#38BDF8" />
          <rect x="4" y="7" width="8" height="7" fill="#FDE047" />
          <rect x="5" y="8" width="6" height="5" fill="#D97706" />
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

    case 'coin':
    case 'coins':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          <rect x="5" y="2" width="6" height="1" fill="#CA8A04" />
          <rect x="5" y="13" width="6" height="1" fill="#CA8A04" />
          <rect x="2" y="5" width="1" height="6" fill="#CA8A04" />
          <rect x="13" y="5" width="1" height="6" fill="#CA8A04" />
          <rect x="3" y="3" width="10" height="10" fill="#FACC15" />
          <rect x="4" y="4" width="8" height="8" fill="#FDE047" />
          <rect x="6" y="6" width="4" height="4" fill="#15803D" />
          <rect x="7" y="7" width="2" height="2" fill="#22C55E" />
        </svg>
      );

    case 'gacha':
    case 'gift':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          <rect x="3" y="2" width="10" height="6" fill="#EC4899" />
          <rect x="3" y="8" width="10" height="6" fill="#F8FAFC" />
          <rect x="2" y="7" width="12" height="2" fill="#18181B" />
          <rect x="7" y="7" width="2" height="2" fill="#FACC15" />
          <rect x="5" y="4" width="2" height="2" fill="#FDF2F8" />
        </svg>
      );

    case 'none':
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...pixelStyle} className={`inline-block shrink-0 ${className}`}>
          <rect x="4" y="2" width="8" height="1" fill="#DC2626" />
          <rect x="4" y="13" width="8" height="1" fill="#DC2626" />
          <rect x="2" y="4" width="1" height="8" fill="#DC2626" />
          <rect x="13" y="4" width="1" height="8" fill="#DC2626" />
          <rect x="3" y="3" width="1" height="1" fill="#DC2626" />
          <rect x="12" y="3" width="1" height="1" fill="#DC2626" />
          <rect x="3" y="12" width="1" height="1" fill="#DC2626" />
          <rect x="12" y="12" width="1" height="1" fill="#DC2626" />
          <rect x="4" y="4" width="2" height="2" fill="#DC2626" />
          <rect x="6" y="6" width="2" height="2" fill="#DC2626" />
          <rect x="8" y="8" width="2" height="2" fill="#DC2626" />
          <rect x="10" y="10" width="2" height="2" fill="#DC2626" />
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
