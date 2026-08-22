import React from 'react';
import { getSkinColors } from './PixelFrogScene';

interface PixelItemThumbnailProps {
  id: string;
  category?: string;
  size?: number;
  className?: string;
}

export const PixelItemThumbnail: React.FC<PixelItemThumbnailProps> = ({
  id,
  category,
  size = 36,
  className = '',
}) => {
  const pixelStyle = { shapeRendering: 'crispEdges' as const };

  // -------------------------------------------------------------
  // 1. FROG SKINS (Face with unique skin palette)
  // -------------------------------------------------------------
  if (
    category === 'skins' ||
    ['classic', 'golden', 'sakura_pink', 'twilight_blue', 'matcha', 'albino_white', 'ember_orange', 'wasabi_green', 'salmon_peach', 'fairytale_rose', 'timber_wolf_grey'].includes(id)
  ) {
    const pal = getSkinColors(id as any);
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...pixelStyle}
        className={`inline-block ${className}`}
      >
        {/* Frog Eyes */}
        <rect x="4" y="5" width="4" height="4" fill={pal.dark} />
        <rect x="16" y="5" width="4" height="4" fill={pal.dark} />
        <rect x="5" y="6" width="2" height="2" fill="#18181B" />
        <rect x="17" y="6" width="2" height="2" fill="#18181B" />
        <rect x="5" y="6" width="1" height="1" fill={pal.eyeHighlight} />
        <rect x="17" y="6" width="1" height="1" fill={pal.eyeHighlight} />

        {/* Head Main */}
        <rect x="3" y="9" width="18" height="10" fill={pal.main} />
        <rect x="2" y="10" width="1" height="8" fill={pal.outline} />
        <rect x="21" y="10" width="1" height="8" fill={pal.outline} />
        <rect x="4" y="19" width="16" height="1" fill={pal.outline} />
        <rect x="8" y="8" width="8" height="1" fill={pal.outline} />

        {/* Belly */}
        <rect x="7" y="14" width="10" height="5" fill={pal.belly} />

        {/* Cheeks */}
        <rect x="4" y="12" width="2" height="2" fill={pal.cheeks} />
        <rect x="18" y="12" width="2" height="2" fill={pal.cheeks} />

        {/* Cute Smile */}
        <rect x="10" y="13" width="4" height="1" fill={pal.outline} />
        <rect x="9" y="12" width="1" height="1" fill={pal.outline} />
        <rect x="14" y="12" width="1" height="1" fill={pal.outline} />
      </svg>
    );
  }

  // -------------------------------------------------------------
  // 2. HATS & HEADWEAR
  // -------------------------------------------------------------
  switch (id) {
    case 'none':
    case 'hat_none':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="9" y="4" width="2" height="2" fill="#A3E635" />
          <rect x="13" y="4" width="2" height="2" fill="#A3E635" />
          <rect x="7" y="8" width="10" height="8" fill="#75A65A" />
          <rect x="6" y="9" width="1" height="6" fill="#2D3A20" />
          <rect x="17" y="9" width="1" height="6" fill="#2D3A20" />
          <rect x="8" y="10" width="2" height="2" fill="#2D3A20" />
          <rect x="14" y="10" width="2" height="2" fill="#2D3A20" />
          <rect x="10" y="13" width="4" height="1" fill="#2D3A20" />
        </svg>
      );

    case 'lotus':
    case 'hat_lotus':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Stem & Dewdrop */}
          <rect x="11" y="4" width="2" height="3" fill="#15803D" />
          <rect x="9" y="7" width="2" height="2" fill="#38BDF8" />
          {/* Lotus Leaf Parasol */}
          <rect x="6" y="8" width="12" height="3" fill="#22C55E" />
          <rect x="3" y="11" width="18" height="4" fill="#16A34A" />
          <rect x="2" y="15" width="20" height="2" fill="#15803D" />
          <rect x="5" y="17" width="3" height="1" fill="#14532D" />
          <rect x="16" y="17" width="3" height="1" fill="#14532D" />
        </svg>
      );

    case 'straw':
    case 'hat_straw':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="10" y="5" width="4" height="2" fill="#A16207" />
          <rect x="8" y="7" width="8" height="3" fill="#D97706" />
          <rect x="6" y="10" width="12" height="3" fill="#F59E0B" />
          <rect x="3" y="13" width="18" height="3" fill="#FBBF24" />
          <rect x="2" y="16" width="20" height="2" fill="#D97706" />
          {/* Red Tie Cord */}
          <rect x="9" y="18" width="2" height="3" fill="#DC2626" />
          <rect x="13" y="18" width="2" height="3" fill="#DC2626" />
        </svg>
      );

    case 'sakura':
    case 'hat_sakura':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Cherry Blossom Flowers Crown */}
          <rect x="4" y="11" width="16" height="2" fill="#15803D" />
          {/* Left Flower */}
          <rect x="4" y="7" width="4" height="4" fill="#F472B6" />
          <rect x="5" y="8" width="2" height="2" fill="#FEF08A" />
          {/* Center Flower */}
          <rect x="10" y="5" width="4" height="4" fill="#FB7185" />
          <rect x="11" y="6" width="2" height="2" fill="#FEF08A" />
          {/* Right Flower */}
          <rect x="16" y="7" width="4" height="4" fill="#F472B6" />
          <rect x="17" y="8" width="2" height="2" fill="#FEF08A" />
          {/* Petals drift */}
          <rect x="2" y="13" width="2" height="2" fill="#FDA4AF" />
          <rect x="20" y="14" width="2" height="2" fill="#FDA4AF" />
        </svg>
      );

    case 'wizard':
    case 'hat_wizard':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Star on tip */}
          <rect x="11" y="2" width="2" height="2" fill="#FACC15" />
          {/* Cone Hat */}
          <rect x="10" y="4" width="4" height="3" fill="#312E81" />
          <rect x="8" y="7" width="8" height="4" fill="#3730A3" />
          <rect x="6" y="11" width="12" height="3" fill="#4338CA" />
          {/* Golden star badge */}
          <rect x="11" y="9" width="2" height="2" fill="#FDE047" />
          {/* Wide Brim */}
          <rect x="3" y="14" width="18" height="3" fill="#1E1B4B" />
          <rect x="2" y="17" width="20" height="2" fill="#312E81" />
        </svg>
      );

    case 'bandana':
    case 'hat_bandana':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Red adventurer headband with tie */}
          <rect x="4" y="8" width="16" height="5" fill="#DC2626" />
          <rect x="5" y="9" width="14" height="3" fill="#EF4444" />
          {/* White pattern dots */}
          <rect x="7" y="10" width="2" height="1" fill="#FFFFFF" />
          <rect x="11" y="10" width="2" height="1" fill="#FFFFFF" />
          <rect x="15" y="10" width="2" height="1" fill="#FFFFFF" />
          {/* Knotted Tails Right */}
          <rect x="18" y="13" width="3" height="4" fill="#B91C1C" />
          <rect x="19" y="17" width="2" height="3" fill="#991B1B" />
        </svg>
      );

    case 'beanie':
    case 'hat_beanie':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* White Fluffy Pom-pom */}
          <rect x="10" y="3" width="4" height="4" fill="#FFFFFF" />
          <rect x="11" y="4" width="2" height="2" fill="#E2E8F0" />
          {/* Beanie Knit Body */}
          <rect x="7" y="7" width="10" height="5" fill="#DC2626" />
          <rect x="5" y="12" width="14" height="4" fill="#B91C1C" />
          {/* Folded Brim */}
          <rect x="4" y="16" width="16" height="3" fill="#F87171" />
          <rect x="6" y="17" width="12" height="1" fill="#FFFFFF" />
        </svg>
      );

    case 'chef':
    case 'hat_chef':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* White Puffy Chef Toque */}
          <rect x="7" y="4" width="10" height="3" fill="#FFFFFF" />
          <rect x="5" y="7" width="14" height="6" fill="#FFFFFF" />
          <rect x="4" y="8" width="2" height="4" fill="#E2E8F0" />
          <rect x="18" y="8" width="2" height="4" fill="#E2E8F0" />
          <rect x="8" y="6" width="2" height="6" fill="#F1F5F9" />
          <rect x="14" y="6" width="2" height="6" fill="#F1F5F9" />
          {/* Band */}
          <rect x="5" y="13" width="14" height="4" fill="#CBD5E1" />
          <rect x="6" y="14" width="12" height="2" fill="#FFFFFF" />
        </svg>
      );

    case 'crown':
    case 'hat_crown':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Crown Peaks */}
          <rect x="4" y="8" width="3" height="3" fill="#FACC15" />
          <rect x="10" y="5" width="4" height="4" fill="#FACC15" />
          <rect x="17" y="8" width="3" height="3" fill="#FACC15" />
          {/* Jewels */}
          <rect x="5" y="9" width="1" height="1" fill="#3B82F6" />
          <rect x="11" y="6" width="2" height="2" fill="#EF4444" />
          <rect x="18" y="9" width="1" height="1" fill="#3B82F6" />
          {/* Crown Body & Base */}
          <rect x="4" y="11" width="16" height="4" fill="#FACC15" />
          <rect x="3" y="15" width="18" height="3" fill="#EAB308" />
          <rect x="6" y="16" width="2" height="1" fill="#EF4444" />
          <rect x="11" y="16" width="2" height="1" fill="#22C55E" />
          <rect x="16" y="16" width="2" height="1" fill="#EF4444" />
        </svg>
      );

    case 'beret':
    case 'hat_beret':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Stem tip */}
          <rect x="11" y="6" width="2" height="2" fill="#374151" />
          {/* Charcoal French Beret */}
          <rect x="7" y="8" width="10" height="3" fill="#4B5563" />
          <rect x="4" y="11" width="16" height="4" fill="#374151" />
          <rect x="3" y="13" width="18" height="2" fill="#1F2937" />
          <rect x="6" y="15" width="12" height="2" fill="#111827" />
        </svg>
      );

    case 'flower':
    case 'hat_flower':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="10" y="5" width="4" height="4" fill="#FEF08A" />
          <rect x="6" y="9" width="4" height="4" fill="#FEF08A" />
          <rect x="14" y="9" width="4" height="4" fill="#FEF08A" />
          <rect x="8" y="13" width="4" height="4" fill="#FEF08A" />
          <rect x="12" y="13" width="4" height="4" fill="#FEF08A" />
          {/* Flower Center */}
          <rect x="10" y="9" width="4" height="4" fill="#EA580C" />
          <rect x="11" y="10" width="2" height="2" fill="#F97316" />
        </svg>
      );

    case 'samurai':
    case 'hat_samurai':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Gold Crest Antlers */}
          <rect x="7" y="4" width="2" height="4" fill="#FACC15" />
          <rect x="15" y="4" width="2" height="4" fill="#FACC15" />
          <rect x="10" y="6" width="4" height="3" fill="#CA8A04" />
          <rect x="11" y="7" width="2" height="2" fill="#DC2626" />
          {/* Black Kabuto Helmet */}
          <rect x="5" y="9" width="14" height="5" fill="#18181B" />
          <rect x="3" y="14" width="18" height="3" fill="#27272A" />
          <rect x="6" y="17" width="12" height="2" fill="#DC2626" />
        </svg>
      );

    case 'headphone':
    case 'hat_headphone':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Headband */}
          <rect x="7" y="5" width="10" height="2" fill="#18181B" />
          <rect x="5" y="7" width="2" height="4" fill="#18181B" />
          <rect x="17" y="7" width="2" height="4" fill="#18181B" />
          {/* Earcups (Cyan & Blue) */}
          <rect x="4" y="11" width="4" height="7" fill="#0284C7" />
          <rect x="5" y="12" width="2" height="5" fill="#38BDF8" />
          <rect x="16" y="11" width="4" height="7" fill="#0284C7" />
          <rect x="17" y="12" width="2" height="5" fill="#38BDF8" />
        </svg>
      );

    case 'detective':
    case 'hat_detective':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Sherlock Tweed Hat */}
          <rect x="11" y="6" width="2" height="2" fill="#451A03" />
          <rect x="8" y="8" width="8" height="4" fill="#92400E" />
          <rect x="5" y="12" width="14" height="3" fill="#B45309" />
          {/* Double Brim Visors */}
          <rect x="2" y="15" width="20" height="2" fill="#78350F" />
          {/* Ear flaps cord */}
          <rect x="11" y="10" width="2" height="6" fill="#451A03" />
        </svg>
      );

    case 'sushi_salmon':
    case 'hat_sushi_salmon':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Salmon Nigiri Hat with Nori Belt */}
          {/* Fresh Salmon Slab with Marbling */}
          <rect x="4" y="6" width="16" height="5" fill="#FB923C" />
          <rect x="5" y="5" width="14" height="2" fill="#F97316" />
          <rect x="7" y="7" width="2" height="3" fill="#FED7AA" />
          <rect x="12" y="6" width="2" height="4" fill="#FED7AA" />
          <rect x="17" y="7" width="2" height="3" fill="#FED7AA" />
          {/* Rice Ball Bed */}
          <rect x="5" y="11" width="14" height="5" fill="#FFFFFF" />
          <rect x="6" y="16" width="12" height="2" fill="#F1F5F9" />
          {/* Dark Nori Seaweed Ribbon */}
          <rect x="11" y="5" width="3" height="13" fill="#18181B" />
          <rect x="12" y="6" width="1" height="11" fill="#27272A" />
        </svg>
      );

    case 'sushi_maguro':
    case 'hat_sushi_maguro':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Maguro Otoro Tuna Nigiri Hat */}
          <rect x="4" y="6" width="16" height="5" fill="#E11D48" />
          <rect x="5" y="5" width="14" height="2" fill="#BE123C" />
          <rect x="7" y="7" width="2" height="3" fill="#FDA4AF" />
          <rect x="13" y="6" width="2" height="4" fill="#FDA4AF" />
          {/* Rice Ball Bed */}
          <rect x="5" y="11" width="14" height="5" fill="#FFFFFF" />
          <rect x="6" y="16" width="12" height="2" fill="#F1F5F9" />
        </svg>
      );

    case 'sushi_ebi':
    case 'hat_sushi_ebi':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Ebi Shrimp Nigiri with Tail */}
          <rect x="4" y="6" width="14" height="5" fill="#F43F5E" />
          <rect x="6" y="7" width="2" height="3" fill="#FFFFFF" />
          <rect x="10" y="6" width="2" height="4" fill="#FFFFFF" />
          <rect x="14" y="7" width="2" height="3" fill="#FFFFFF" />
          {/* Red Shrimp Tail fan */}
          <polygon points="18,5 22,3 20,8" fill="#E11D48" />
          <polygon points="18,9 22,11 19,7" fill="#E11D48" />
          {/* Rice */}
          <rect x="5" y="11" width="13" height="5" fill="#FFFFFF" />
          <rect x="6" y="16" width="11" height="2" fill="#F1F5F9" />
        </svg>
      );

    case 'sushi_chef_headband':
    case 'hat_sushi_chef_headband':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Traditional Edo Chef Twisted Headband (Hachimaki) */}
          <rect x="3" y="9" width="18" height="5" fill="#FFFFFF" />
          <rect x="2" y="10" width="20" height="3" fill="#F8FAFC" />
          {/* Crimson Sun Rising Crest in Center */}
          <circle cx="12" cy="11.5" r="2" fill="#DC2626" />
          {/* Tied tails hanging at back */}
          <rect x="18" y="14" width="3" height="6" fill="#FFFFFF" />
          <rect x="20" y="16" width="2" height="5" fill="#E2E8F0" />
        </svg>
      );

    case 'red_riding_hood':
    case 'hat_red_riding_hood':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Crimson Velvet Hood Capelet & Ribbon Bow */}
          <rect x="6" y="3" width="12" height="4" fill="#991B1B" />
          <rect x="4" y="6" width="16" height="8" fill="#DC2626" />
          <rect x="3" y="10" width="18" height="6" fill="#EF4444" />
          {/* Hood peak curve */}
          <rect x="10" y="2" width="4" height="2" fill="#7F1D1D" />
          {/* Inner Hood Shadow */}
          <rect x="7" y="9" width="10" height="5" fill="#991B1B" />
          {/* Golden/White Lace Trim Edge */}
          <rect x="3" y="15" width="18" height="1" fill="#FEF08A" />
          {/* Crimson Satin Ribbon Bow */}
          <rect x="10" y="16" width="4" height="3" fill="#B91C1C" />
          <rect x="9" y="18" width="2" height="4" fill="#DC2626" />
          <rect x="13" y="18" width="2" height="4" fill="#DC2626" />
        </svg>
      );

    case 'wolf_ears_hood':
    case 'hat_wolf_ears_hood':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Big Bad Wolf Fur Hood & Pointy Ears */}
          <polygon points="5,2 9,7 5,7" fill="#4B5563" />
          <polygon points="6,3 8,6 6,6" fill="#FCA5A5" />
          <polygon points="19,2 15,7 19,7" fill="#4B5563" />
          <polygon points="18,3 16,6 18,6" fill="#FCA5A5" />
          {/* Shaggy Head Pelt */}
          <rect x="5" y="6" width="14" height="8" fill="#374151" />
          <rect x="4" y="9" width="16" height="6" fill="#4B5563" />
          {/* Tuft highlights */}
          <rect x="9" y="5" width="6" height="2" fill="#6B7280" />
        </svg>
      );

    case 'granny_nightcap':
    case 'hat_granny_nightcap':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Fairytale Grandma Frilled Nightcap with Rosette */}
          <ellipse cx="12" cy="9" rx="8" ry="6" fill="#F1F5F9" />
          <rect x="4" y="11" width="16" height="5" fill="#E2E8F0" />
          {/* Frilled Ruffled Rim */}
          <rect x="2" y="15" width="20" height="2" fill="#FFFFFF" />
          <rect x="1" y="16" width="22" height="2" fill="#CBD5E1" />
          {/* Pink Ribbon Rosette */}
          <circle cx="6" cy="14" r="2" fill="#F472B6" />
        </svg>
      );

    // -------------------------------------------------------------
    // 3. OUTFITS
    // -------------------------------------------------------------
    case 'none_outfit':
    case 'outfit_none':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="8" y="6" width="8" height="2" fill="#A3E635" />
          <rect x="6" y="8" width="12" height="10" fill="#75A65A" />
          <rect x="8" y="11" width="8" height="6" fill="#FEF9C3" />
        </svg>
      );

    case 'red_riding_dress':
    case 'outfit_red_riding_dress':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Little Red Folk Dirndl Dress + White Lace Apron + Black Corset */}
          {/* White Blouse Puff Shoulders */}
          <rect x="4" y="6" width="4" height="4" fill="#FFFFFF" />
          <rect x="16" y="6" width="4" height="4" fill="#FFFFFF" />
          {/* Black Ribbon Corset Vest */}
          <rect x="7" y="7" width="10" height="7" fill="#18181B" />
          <rect x="10" y="8" width="4" height="5" fill="#EF4444" />
          <line x1="9" y1="9" x2="15" y2="12" stroke="#DC2626" strokeWidth="1" />
          <line x1="15" y1="9" x2="9" y2="12" stroke="#DC2626" strokeWidth="1" />
          {/* Flared Crimson Skirt */}
          <rect x="3" y="14" width="18" height="7" fill="#DC2626" />
          {/* White Embroidered Apron */}
          <rect x="8" y="13" width="8" height="7" fill="#FFFFFF" />
          <rect x="9" y="19" width="6" height="1" fill="#E2E8F0" />
        </svg>
      );

    case 'wolf_fur_cloak':
    case 'outfit_wolf_fur_cloak':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Shaggy Charcoal Wolf Pelt Cloak & Buckles */}
          <rect x="6" y="5" width="12" height="4" fill="#1F2937" />
          <rect x="4" y="8" width="16" height="13" fill="#374151" />
          <rect x="2" y="9" width="4" height="8" fill="#4B5563" />
          <rect x="18" y="9" width="4" height="8" fill="#4B5563" />
          {/* Leather Belt & Brass Buckle */}
          <rect x="6" y="13" width="12" height="2" fill="#78350F" />
          <rect x="11" y="13" width="2" height="2" fill="#FACC15" />
          {/* Shaggy Trim */}
          <rect x="5" y="19" width="14" height="2" fill="#1F2937" />
        </svg>
      );

    case 'hunter_woodsman':
    case 'outfit_hunter_woodsman':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Forest Green Woodsman Jacket with Plaid & Belt */}
          <rect x="7" y="5" width="10" height="3" fill="#14532D" />
          <rect x="4" y="8" width="16" height="12" fill="#166534" />
          {/* Plaid lapels */}
          <rect x="8" y="7" width="2" height="6" fill="#DC2626" />
          <rect x="14" y="7" width="2" height="6" fill="#DC2626" />
          {/* Brown Cross-chest Quiver Strap & Belt */}
          <line x1="5" y1="8" x2="17" y2="15" stroke="#78350F" strokeWidth="2" />
          <rect x="5" y="14" width="14" height="2" fill="#78350F" />
          <rect x="11" y="14" width="2" height="2" fill="#FACC15" />
        </svg>
      );

    case 'kimono':
    case 'outfit_kimono':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Indigo Kimono Robe */}
          <rect x="7" y="5" width="10" height="3" fill="#1E3A8A" />
          <rect x="4" y="8" width="16" height="12" fill="#2563EB" />
          <rect x="2" y="9" width="4" height="7" fill="#1D4ED8" />
          <rect x="18" y="9" width="4" height="7" fill="#1D4ED8" />
          {/* Gold Obi Sash */}
          <rect x="6" y="12" width="12" height="3" fill="#FACC15" />
          <rect x="10" y="11" width="4" height="5" fill="#EAB308" />
        </svg>
      );

    case 'raincoat':
    case 'outfit_raincoat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Yellow Slicker */}
          <rect x="8" y="5" width="8" height="3" fill="#EAB308" />
          <rect x="5" y="8" width="14" height="12" fill="#FACC15" />
          <rect x="3" y="9" width="3" height="7" fill="#EAB308" />
          <rect x="18" y="9" width="3" height="7" fill="#EAB308" />
          {/* Black buttons */}
          <rect x="11" y="10" width="2" height="2" fill="#18181B" />
          <rect x="11" y="14" width="2" height="2" fill="#18181B" />
          <rect x="11" y="18" width="2" height="2" fill="#18181B" />
        </svg>
      );

    case 'sweater':
    case 'outfit_sweater':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Cozy Amber Sweater */}
          <rect x="8" y="5" width="8" height="3" fill="#9A3412" />
          <rect x="5" y="8" width="14" height="12" fill="#EA580C" />
          <rect x="3" y="9" width="3" height="8" fill="#C2410C" />
          <rect x="18" y="9" width="3" height="8" fill="#C2410C" />
          {/* Cable stripes */}
          <rect x="8" y="9" width="2" height="10" fill="#FED7AA" />
          <rect x="14" y="9" width="2" height="10" fill="#FED7AA" />
        </svg>
      );

    case 'ninja':
    case 'outfit_ninja':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Stealth Black Shinobi */}
          <rect x="7" y="5" width="10" height="3" fill="#18181B" />
          <rect x="4" y="8" width="16" height="12" fill="#27272A" />
          <rect x="2" y="9" width="4" height="8" fill="#18181B" />
          <rect x="18" y="9" width="4" height="8" fill="#18181B" />
          {/* Red Shinobi Belt */}
          <rect x="6" y="13" width="12" height="2" fill="#DC2626" />
          <rect x="10" y="15" width="2" height="4" fill="#B91C1C" />
        </svg>
      );

    case 'sailor':
    case 'outfit_sailor':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* White Uniform with Blue Collar */}
          <rect x="8" y="5" width="8" height="3" fill="#1E3A8A" />
          <rect x="5" y="8" width="14" height="12" fill="#F8FAFC" />
          {/* Navy Sailor Flap */}
          <rect x="6" y="8" width="12" height="4" fill="#2563EB" />
          {/* Red Neckerchief Bow */}
          <rect x="10" y="11" width="4" height="3" fill="#EF4444" />
          <rect x="11" y="14" width="2" height="3" fill="#DC2626" />
        </svg>
      );

    case 'apron':
    case 'outfit_apron':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Garden Brown Apron */}
          <rect x="9" y="5" width="6" height="3" fill="#78350F" />
          <rect x="6" y="8" width="12" height="12" fill="#92400E" />
          {/* Tool pocket */}
          <rect x="8" y="13" width="8" height="5" fill="#B45309" />
          {/* Tiny tool handles */}
          <rect x="9" y="11" width="2" height="3" fill="#22C55E" />
          <rect x="13" y="11" width="2" height="3" fill="#F59E0B" />
        </svg>
      );

    case 'overalls':
    case 'outfit_overalls':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Denim Dungarees */}
          <rect x="7" y="6" width="3" height="6" fill="#0284C7" />
          <rect x="14" y="6" width="3" height="6" fill="#0284C7" />
          {/* Brass buckles */}
          <rect x="7" y="11" width="3" height="2" fill="#FACC15" />
          <rect x="14" y="11" width="3" height="2" fill="#FACC15" />
          {/* Overalls Bib & Pants */}
          <rect x="6" y="12" width="12" height="8" fill="#0369A1" />
          <rect x="9" y="13" width="6" height="4" fill="#0284C7" />
        </svg>
      );

    case 'scarf':
    case 'outfit_scarf':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Cozy Red Scarf wrapped around neck */}
          <rect x="5" y="8" width="14" height="6" fill="#DC2626" />
          <rect x="6" y="9" width="12" height="4" fill="#EF4444" />
          {/* Hanging tail */}
          <rect x="13" y="14" width="4" height="7" fill="#DC2626" />
          <rect x="13" y="21" width="4" height="1" fill="#FDE047" />
        </svg>
      );

    case 'business':
    case 'outfit_business':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Tuxedo Suit & Crimson Tie */}
          <rect x="7" y="5" width="10" height="3" fill="#18181B" />
          <rect x="4" y="8" width="16" height="12" fill="#27272A" />
          {/* White shirt triangle */}
          <polygon points="12,14 8,8 16,8" fill="#FFFFFF" />
          {/* Red Tie */}
          <rect x="11" y="9" width="2" height="6" fill="#DC2626" />
          <rect x="10" y="15" width="4" height="2" fill="#DC2626" />
        </svg>
      );

    case 'hoodie':
    case 'outfit_hoodie':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Froggy Green Hoodie with Pocket */}
          <rect x="7" y="5" width="10" height="4" fill="#65A30D" />
          <rect x="4" y="9" width="16" height="11" fill="#84CC16" />
          <rect x="2" y="10" width="3" height="7" fill="#65A30D" />
          <rect x="19" y="10" width="3" height="7" fill="#65A30D" />
          {/* Front pouch pocket */}
          <rect x="7" y="14" width="10" height="5" fill="#4D7C0F" />
        </svg>
      );

    case 'sushi_chef_happi':
    case 'outfit_sushi_chef_happi':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Edo Navy Blue Sushi Happi Coat */}
          <rect x="7" y="5" width="10" height="3" fill="#1E293B" />
          <rect x="4" y="8" width="16" height="12" fill="#0F172A" />
          <rect x="2" y="9" width="4" height="7" fill="#1E293B" />
          <rect x="18" y="9" width="4" height="7" fill="#1E293B" />
          {/* White Lapel & Collar (Eri) */}
          <rect x="8" y="7" width="2" height="13" fill="#FFFFFF" />
          <rect x="14" y="7" width="2" height="13" fill="#FFFFFF" />
          {/* Crimson Waist Rope Sash */}
          <rect x="5" y="13" width="14" height="2" fill="#DC2626" />
          <rect x="10" y="14" width="4" height="4" fill="#B91C1C" />
          {/* Back Crest Mini */}
          <rect x="11" y="9" width="2" height="3" fill="#FFFFFF" />
        </svg>
      );

    case 'sushi_kimono_waiter':
    case 'outfit_sushi_kimono_waiter':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Elegant Matcha-green & Cream Waiter Kimono */}
          <rect x="7" y="5" width="10" height="3" fill="#15803D" />
          <rect x="4" y="8" width="16" height="12" fill="#16A34A" />
          <rect x="2" y="9" width="4" height="7" fill="#15803D" />
          <rect x="18" y="9" width="4" height="7" fill="#15803D" />
          {/* Gold & Cream Obi Sash */}
          <rect x="6" y="12" width="12" height="3" fill="#FACC15" />
          <rect x="9" y="11" width="6" height="5" fill="#FEF08A" />
        </svg>
      );

    // -------------------------------------------------------------
    // 4. GLASSES & ACCESSORIES
    // -------------------------------------------------------------
    case 'reading':
    case 'glasses_reading':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Golden round frames */}
          <rect x="3" y="9" width="8" height="7" fill="#F59E0B" />
          <rect x="5" y="11" width="4" height="3" fill="#E0F2FE" />
          <rect x="5" y="11" width="1" height="1" fill="#FFFFFF" />
          <rect x="11" y="11" width="2" height="2" fill="#D97706" />
          <rect x="13" y="9" width="8" height="7" fill="#F59E0B" />
          <rect x="15" y="11" width="4" height="3" fill="#E0F2FE" />
          <rect x="15" y="11" width="1" height="1" fill="#FFFFFF" />
        </svg>
      );

    case 'sunglasses':
    case 'glasses_sunglasses':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Retro Pixel Shades */}
          <rect x="3" y="10" width="18" height="2" fill="#18181B" />
          <rect x="4" y="12" width="7" height="4" fill="#27272A" />
          <rect x="13" y="12" width="7" height="4" fill="#27272A" />
          <rect x="5" y="12" width="1" height="2" fill="#FFFFFF" />
          <rect x="14" y="12" width="1" height="2" fill="#FFFFFF" />
        </svg>
      );

    case 'monocle':
    case 'glasses_monocle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Gold Monocle on right eye */}
          <rect x="11" y="8" width="9" height="8" fill="#F59E0B" />
          <rect x="13" y="10" width="5" height="4" fill="#E0F2FE" />
          <rect x="13" y="10" width="1" height="1" fill="#FFFFFF" />
          {/* Fine gold chain hanging */}
          <rect x="19" y="13" width="1" height="3" fill="#D97706" />
          <rect x="20" y="16" width="1" height="3" fill="#D97706" />
        </svg>
      );

    case 'blush_stars':
    case 'glasses_blush_stars':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Rosy Cheeks with Stars */}
          <rect x="3" y="11" width="6" height="5" fill="#FB7185" />
          <rect x="5" y="12" width="2" height="2" fill="#FDE047" />
          <rect x="15" y="11" width="6" height="5" fill="#FB7185" />
          <rect x="17" y="12" width="2" height="2" fill="#FDE047" />
        </svg>
      );

    case 'sparkles':
    case 'glasses_sparkles':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Golden Magical Sparkles */}
          <rect x="11" y="4" width="2" height="6" fill="#FACC15" />
          <rect x="9" y="6" width="6" height="2" fill="#FACC15" />
          <rect x="11" y="6" width="2" height="2" fill="#FFFFFF" />

          <rect x="4" y="13" width="2" height="4" fill="#FDE047" />
          <rect x="3" y="14" width="4" height="2" fill="#FDE047" />

          <rect x="18" y="13" width="2" height="4" fill="#FDE047" />
          <rect x="17" y="14" width="4" height="2" fill="#FDE047" />
        </svg>
      );

    case 'eyepatch':
    case 'glasses_eyepatch':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Pirate Strap & Eyepatch */}
          <line x1="3" y1="7" x2="21" y2="15" stroke="#18181B" strokeWidth="2" />
          <rect x="4" y="9" width="7" height="6" fill="#18181B" />
          <rect x="6" y="11" width="3" height="2" fill="#FFFFFF" />
        </svg>
      );

    case 'wasabi_sparkle':
    case 'glasses_wasabi_sparkle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Wasabi Green Sparkling Star & Spicy Cheek Blush */}
          <rect x="3" y="12" width="5" height="4" fill="#84CC16" />
          <rect x="16" y="12" width="5" height="4" fill="#84CC16" />
          {/* Green Sparkles */}
          <rect x="11" y="4" width="2" height="6" fill="#A3E635" />
          <rect x="9" y="6" width="6" height="2" fill="#A3E635" />
          <rect x="11" y="6" width="2" height="2" fill="#FEF08A" />
          <rect x="4" y="8" width="2" height="2" fill="#BEF264" />
          <rect x="18" y="8" width="2" height="2" fill="#BEF264" />
        </svg>
      );

    case 'forest_blush_freckles':
    case 'glasses_forest_blush_freckles':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Fairytale Rosy Blush with Golden Sun Freckles */}
          <rect x="3" y="11" width="6" height="5" fill="#F43F5E" opacity="0.8" />
          <rect x="15" y="11" width="6" height="5" fill="#F43F5E" opacity="0.8" />
          {/* Freckle dots */}
          <rect x="5" y="12" width="1" height="1" fill="#78350F" />
          <rect x="7" y="13" width="1" height="1" fill="#78350F" />
          <rect x="4" y="14" width="1" height="1" fill="#78350F" />
          <rect x="16" y="12" width="1" height="1" fill="#78350F" />
          <rect x="18" y="13" width="1" height="1" fill="#78350F" />
          <rect x="17" y="14" width="1" height="1" fill="#78350F" />
          {/* Golden berry sparkle */}
          <rect x="11" y="7" width="2" height="2" fill="#FDE047" />
        </svg>
      );

    case 'wolf_snarl_fangs':
    case 'glasses_wolf_snarl_fangs':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Playful Wolf Snarl & White Fangs */}
          <rect x="8" y="11" width="8" height="4" fill="#18181B" />
          {/* White Fangs */}
          <polygon points="9,11 11,11 10,14" fill="#FFFFFF" />
          <polygon points="13,11 15,11 14,14" fill="#FFFFFF" />
          {/* Pink Tongue */}
          <rect x="11" y="13" width="2" height="2" fill="#FB7185" />
          {/* Whisker dots */}
          <rect x="4" y="12" width="1" height="1" fill="#4B5563" />
          <rect x="5" y="14" width="1" height="1" fill="#4B5563" />
          <rect x="19" y="12" width="1" height="1" fill="#4B5563" />
          <rect x="18" y="14" width="1" height="1" fill="#4B5563" />
        </svg>
      );

    // -------------------------------------------------------------
    // 5. PROPS & ACTIVITIES
    // -------------------------------------------------------------
    case 'picnic_basket':
    case 'prop_picnic_basket':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Fairytale Woven Picnic Basket + Red Gingham Cloth & Warm Pie */}
          {/* Basket Handle */}
          <path d="M7 11 C7 4, 17 4, 17 11" stroke="#92400E" strokeWidth="2" fill="none" />
          {/* Woven Basket Base */}
          <rect x="4" y="11" width="16" height="10" fill="#B45309" />
          <rect x="5" y="12" width="14" height="2" fill="#D97706" />
          <rect x="5" y="16" width="14" height="2" fill="#D97706" />
          {/* Red Gingham Napkin / Cloth hanging out */}
          <polygon points="4,11 11,11 7,16" fill="#DC2626" />
          <polygon points="6,11 9,11 7,14" fill="#FFFFFF" />
          {/* Apple / Jam pot top */}
          <circle cx="15" cy="10" r="2.5" fill="#EF4444" />
          <rect x="15" y="7" width="1" height="2" fill="#15803D" />
        </svg>
      );

    case 'woodcutter_axe':
    case 'prop_woodcutter_axe':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Huntsman Timber Axe & Forest Flower Bouquet */}
          {/* Wooden Shaft */}
          <line x1="6" y1="20" x2="16" y2="5" stroke="#78350F" strokeWidth="2.5" />
          {/* Iron Axe Blade */}
          <polygon points="14,4 20,2 18,10 13,8" fill="#94A3B8" />
          <polygon points="15,5 19,3 17,9 14,8" fill="#E2E8F0" />
          {/* Bluebell & Daisy Wildflowers */}
          <circle cx="7" cy="14" r="2" fill="#3B82F6" />
          <circle cx="9" cy="16" r="2" fill="#FEF08A" />
          <circle cx="5" cy="17" r="1.5" fill="#FFFFFF" />
        </svg>
      );

    case 'tea':
    case 'prop_tea':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Ceramic Cup with Green Tea */}
          <rect x="6" y="8" width="12" height="11" fill="#FEF3C7" />
          <rect x="7" y="9" width="10" height="4" fill="#16A34A" />
          <rect x="9" y="10" width="6" height="2" fill="#22C55E" />
          <rect x="8" y="19" width="8" height="2" fill="#D97706" />
          {/* Steam */}
          <rect x="9" y="4" width="2" height="3" fill="#E2E8F0" />
          <rect x="13" y="3" width="2" height="4" fill="#E2E8F0" />
        </svg>
      );

    case 'coffee':
    case 'prop_coffee':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* White Mug & Handle */}
          <rect x="6" y="8" width="10" height="11" fill="#FFFFFF" />
          <rect x="7" y="9" width="8" height="3" fill="#78350F" />
          {/* Mug Handle */}
          <rect x="16" y="10" width="3" height="6" fill="#FFFFFF" />
          <rect x="17" y="11" width="1" height="4" fill="#CBD5E1" />
          {/* Steam */}
          <rect x="9" y="4" width="2" height="3" fill="#E2E8F0" />
        </svg>
      );

    case 'boba':
    case 'prop_boba':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Boba Cup */}
          <rect x="11" y="2" width="2" height="6" fill="#F43F5E" />
          <rect x="7" y="7" width="10" height="14" fill="#FED7AA" />
          <rect x="6" y="7" width="12" height="2" fill="#F97316" />
          {/* Boba Pearls */}
          <rect x="9" y="16" width="2" height="2" fill="#18181B" />
          <rect x="13" y="16" width="2" height="2" fill="#18181B" />
          <rect x="11" y="18" width="2" height="2" fill="#18181B" />
        </svg>
      );

    case 'reading':
    case 'prop_reading':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Open Journal Book */}
          <rect x="4" y="8" width="7" height="10" fill="#F8FAFC" />
          <rect x="13" y="8" width="7" height="10" fill="#F8FAFC" />
          <rect x="11" y="7" width="2" height="12" fill="#DC2626" />
          {/* Text lines */}
          <rect x="5" y="10" width="5" height="1" fill="#64748B" />
          <rect x="5" y="13" width="5" height="1" fill="#64748B" />
          <rect x="14" y="10" width="5" height="1" fill="#64748B" />
          <rect x="14" y="13" width="5" height="1" fill="#64748B" />
        </svg>
      );

    case 'eating':
    case 'prop_eating':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Onigiri Rice Ball with Nori */}
          <polygon points="12,6 5,18 19,18" fill="#FFFFFF" />
          <rect x="9" y="13" width="6" height="5" fill="#18181B" />
        </svg>
      );

    case 'guitar':
    case 'prop_guitar':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Wooden Ukulele / Guitar */}
          <rect x="6" y="11" width="9" height="9" fill="#D97706" />
          <rect x="9" y="14" width="3" height="3" fill="#451A03" />
          {/* Neck & Fret */}
          <rect x="14" y="6" width="5" height="3" fill="#92400E" />
          <rect x="18" y="4" width="3" height="3" fill="#CA8A04" />
        </svg>
      );

    case 'painting':
    case 'prop_painting':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Artist Palette & Brush */}
          <rect x="5" y="7" width="13" height="11" fill="#F59E0B" />
          <circle cx="8" cy="10" r="1.5" fill="#EF4444" />
          <circle cx="12" cy="9" r="1.5" fill="#3B82F6" />
          <circle cx="15" cy="12" r="1.5" fill="#22C55E" />
          <rect x="14" y="15" width="6" height="3" fill="#78350F" />
        </svg>
      );

    case 'camera':
    case 'prop_camera':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Vintage Camera */}
          <rect x="9" y="6" width="4" height="2" fill="#78350F" />
          <rect x="5" y="8" width="14" height="10" fill="#92400E" />
          <rect x="6" y="9" width="12" height="3" fill="#D97706" />
          {/* Lens */}
          <circle cx="12" cy="14" r="3" fill="#18181B" />
          <circle cx="12" cy="14" r="1.5" fill="#38BDF8" />
        </svg>
      );

    case 'wand':
    case 'prop_wand':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Magic Wand with Star */}
          <line x1="5" y1="19" x2="15" y2="9" stroke="#92400E" strokeWidth="2" />
          <rect x="15" y="5" width="5" height="5" fill="#FACC15" />
          <rect x="17" y="7" width="1" height="1" fill="#FFFFFF" />
        </svg>
      );

    case 'fishing':
    case 'prop_fishing':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Fishing Rod & Bobber */}
          <line x1="4" y1="20" x2="18" y2="4" stroke="#92400E" strokeWidth="2" />
          <line x1="18" y1="4" x2="20" y2="16" stroke="#94A3B8" strokeWidth="1" />
          <circle cx="20" cy="16" r="2.5" fill="#EF4444" />
          <circle cx="20" cy="17" r="1" fill="#FFFFFF" />
        </svg>
      );

    case 'eating_sushi':
    case 'prop_eating_sushi':
    case 'sushi_platter':
    case 'prop_sushi_platter':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Wooden Geta Sushi Board with 3 Nigiri (Salmon, Tuna, Tamago) + Chopsticks */}
          {/* Wooden Geta Platter */}
          <rect x="2" y="14" width="20" height="4" fill="#D97706" />
          <rect x="4" y="18" width="3" height="2" fill="#92400E" />
          <rect x="17" y="18" width="3" height="2" fill="#92400E" />
          {/* Salmon Nigiri */}
          <rect x="3" y="11" width="5" height="2" fill="#FB923C" />
          <rect x="3" y="13" width="5" height="2" fill="#FFFFFF" />
          {/* Tuna Nigiri */}
          <rect x="9" y="11" width="5" height="2" fill="#E11D48" />
          <rect x="9" y="13" width="5" height="2" fill="#FFFFFF" />
          {/* Tamago Egg Nigiri */}
          <rect x="15" y="11" width="5" height="2" fill="#FACC15" />
          <rect x="17" y="11" width="1" height="4" fill="#18181B" />
          <rect x="15" y="13" width="5" height="2" fill="#FFFFFF" />
          {/* Wasabi dollop */}
          <rect x="20" y="13" width="2" height="2" fill="#84CC16" />
          {/* Chopsticks */}
          <line x1="2" y1="8" x2="16" y2="5" stroke="#78350F" strokeWidth="1.2" />
        </svg>
      );

    case 'tea_whisk':
    case 'prop_tea_whisk':
    case 'matcha_whisk':
    case 'prop_matcha_whisk':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Bamboo Chasen Matcha Whisk & Black Tea Bowl */}
          <rect x="4" y="13" width="16" height="8" fill="#1E293B" rx="1" />
          <rect x="6" y="14" width="12" height="4" fill="#84CC16" />
          <line x1="15" y1="6" x2="10" y2="14" stroke="#FDE68A" strokeWidth="2.5" />
          <polygon points="9,14 13,14 11,18" fill="#FDE68A" />
        </svg>
      );

    case 'sushi_crafting':
    case 'prop_sushi_crafting':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Bamboo Rolling Mat & Master Yanagiba Knife */}
          {/* Green Bamboo Mat */}
          <rect x="3" y="9" width="18" height="10" fill="#65A30D" />
          <rect x="3" y="11" width="18" height="1" fill="#365314" />
          <rect x="3" y="14" width="18" height="1" fill="#365314" />
          <rect x="3" y="17" width="18" height="1" fill="#365314" />
          {/* Half-rolled Nori Maki */}
          <rect x="5" y="12" width="14" height="4" fill="#18181B" />
          <circle cx="7" cy="14" r="1" fill="#FB923C" />
          <circle cx="17" cy="14" r="1" fill="#22C55E" />
          {/* Steel Sashimi Knife (Yanagiba) */}
          <line x1="2" y1="4" x2="15" y2="7" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="14" y1="7" x2="21" y2="8" stroke="#78350F" strokeWidth="2.5" />
        </svg>
      );

    // -------------------------------------------------------------
    // 6. PETS & COMPANIONS
    // -------------------------------------------------------------
    case 'snail':
    case 'comp_snail':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Spiral Shell */}
          <circle cx="13" cy="11" r="5" fill="#D97706" />
          <circle cx="13" cy="11" r="3" fill="#F59E0B" />
          <circle cx="13" cy="11" r="1.5" fill="#FEF08A" />
          {/* Snail Body & Eyestalks */}
          <rect x="4" y="15" width="14" height="3" fill="#A3E635" />
          <rect x="6" y="11" width="2" height="4" fill="#A3E635" />
          <rect x="5" y="10" width="2" height="1" fill="#15803D" />
          <rect x="8" y="10" width="2" height="1" fill="#15803D" />
        </svg>
      );

    case 'crab':
    case 'comp_crab':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Red Crab with Pinchers */}
          <rect x="6" y="10" width="12" height="7" fill="#EF4444" />
          {/* Pinchers */}
          <rect x="3" y="7" width="4" height="4" fill="#DC2626" />
          <rect x="17" y="7" width="4" height="4" fill="#DC2626" />
          {/* Eyes */}
          <rect x="8" y="7" width="2" height="3" fill="#FFFFFF" />
          <rect x="14" y="7" width="2" height="3" fill="#FFFFFF" />
          <rect x="9" y="8" width="1" height="1" fill="#18181B" />
          <rect x="15" y="8" width="1" height="1" fill="#18181B" />
        </svg>
      );

    case 'fireflies':
    case 'comp_fireflies':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Glowing Firefly orbs */}
          <circle cx="8" cy="8" r="3" fill="#FACC15" />
          <circle cx="8" cy="8" r="1.5" fill="#FEF08A" />
          <circle cx="16" cy="14" r="3.5" fill="#FACC15" />
          <circle cx="16" cy="14" r="2" fill="#FEF08A" />
          <circle cx="17" cy="6" r="2" fill="#FDE047" />
        </svg>
      );

    case 'butterfly':
    case 'comp_butterfly':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Cyan/Blue Butterfly */}
          <rect x="11" y="7" width="2" height="10" fill="#1E293B" />
          <rect x="4" y="7" width="6" height="6" fill="#38BDF8" />
          <rect x="14" y="7" width="6" height="6" fill="#38BDF8" />
          <rect x="6" y="13" width="4" height="4" fill="#0284C7" />
          <rect x="14" y="13" width="4" height="4" fill="#0284C7" />
        </svg>
      );

    case 'koi':
    case 'comp_koi':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Lucky Red & White Koi Fish */}
          <ellipse cx="12" cy="12" rx="7" ry="4" fill="#FFFFFF" />
          <rect x="10" y="9" width="4" height="4" fill="#EF4444" />
          <rect x="14" y="11" width="3" height="3" fill="#EA580C" />
          <polygon points="4,12 1,8 1,16" fill="#FCA5A5" />
        </svg>
      );

    case 'duckling':
    case 'comp_duckling':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Yellow Duckling */}
          <circle cx="9" cy="9" r="4" fill="#FACC15" />
          <rect x="7" y="12" width="11" height="6" fill="#FACC15" />
          <rect x="12" y="9" width="4" height="2" fill="#EA580C" />
          <rect x="8" y="8" width="1" height="1" fill="#18181B" />
        </svg>
      );

    case 'cat':
    case 'comp_cat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Black Starry Cat with Ears */}
          <polygon points="6,6 9,10 6,10" fill="#18181B" />
          <polygon points="18,6 15,10 18,10" fill="#18181B" />
          <circle cx="12" cy="11" r="5" fill="#18181B" />
          <circle cx="10" cy="11" r="1" fill="#FACC15" />
          <circle cx="14" cy="11" r="1" fill="#FACC15" />
          <rect x="8" y="15" width="8" height="5" fill="#27272A" />
        </svg>
      );

    case 'turtle':
    case 'comp_turtle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Mossy Green Turtle */}
          <ellipse cx="13" cy="12" rx="6" ry="5" fill="#65A30D" />
          <ellipse cx="13" cy="12" rx="4" ry="3" fill="#84CC16" />
          <circle cx="6" cy="12" r="2.5" fill="#4D7C0F" />
          <rect x="5" y="11" width="1" height="1" fill="#18181B" />
        </svg>
      );

    case 'sushi_apprentice_cat':
    case 'companion_sushi_apprentice_cat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Cute Calico Cat with miniature Sushi Chef Headband holding salmon roll */}
          {/* Cat Ears */}
          <polygon points="6,5 9,9 6,9" fill="#EA580C" />
          <polygon points="18,5 15,9 18,9" fill="#18181B" />
          {/* Head */}
          <circle cx="12" cy="10" r="5" fill="#FFFFFF" />
          {/* Headband */}
          <rect x="8" y="7" width="8" height="2" fill="#FFFFFF" />
          <rect x="11" y="7" width="2" height="2" fill="#DC2626" />
          {/* Eyes & Whiskers */}
          <circle cx="10" cy="10" r="1" fill="#18181B" />
          <circle cx="14" cy="10" r="1" fill="#18181B" />
          <rect x="11" y="11" width="2" height="1" fill="#FB7185" />
          {/* Body */}
          <rect x="8" y="14" width="8" height="6" fill="#F8FAFC" />
          <rect x="7" y="15" width="2" height="3" fill="#EA580C" />
          {/* Tiny Salmon Maki roll held in paws */}
          <rect x="10" y="15" width="4" height="4" fill="#18181B" />
          <circle cx="12" cy="17" r="1" fill="#FB923C" />
        </svg>
      );

    case 'mini_ebi_shrimp':
    case 'companion_mini_ebi_shrimp':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Cute Mini Tempura / Ebi Shrimp Mascot with blushing eyes */}
          <ellipse cx="12" cy="13" rx="6" ry="4" fill="#F97316" />
          <ellipse cx="11" cy="12" rx="4" ry="3" fill="#FED7AA" />
          <polygon points="17,12 22,8 21,15" fill="#EF4444" />
          {/* Eyes & blush */}
          <circle cx="9" cy="12" r="1" fill="#18181B" />
          <rect x="8" y="14" width="2" height="1" fill="#FB7185" />
          {/* Tiny sparkles */}
          <rect x="5" y="6" width="2" height="2" fill="#FDE047" />
          <rect x="18" y="5" width="2" height="2" fill="#FDE047" />
        </svg>
      );

    case 'chibi_wolf_pup':
    case 'companion_chibi_wolf_pup':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Lupo the Baby Wolf Pup with Red Scarf & Fluffy Tail */}
          {/* Pointy Ears */}
          <polygon points="5,4 8,8 5,8" fill="#4B5563" />
          <polygon points="6,5 7,7 6,7" fill="#FCA5A5" />
          <polygon points="19,4 16,8 19,8" fill="#4B5563" />
          <polygon points="18,5 17,7 18,7" fill="#FCA5A5" />
          {/* Head */}
          <circle cx="12" cy="9" r="5" fill="#6B7280" />
          <ellipse cx="12" cy="11" rx="3.5" ry="2.5" fill="#E5E7EB" />
          {/* Glossy Amber Eyes */}
          <circle cx="9" cy="9" r="1.5" fill="#D97706" />
          <circle cx="9" cy="9" r="0.5" fill="#FFFFFF" />
          <circle cx="15" cy="9" r="1.5" fill="#D97706" />
          <circle cx="15" cy="9" r="0.5" fill="#FFFFFF" />
          {/* Cute Nose */}
          <rect x="11" y="10" width="2" height="1" fill="#18181B" />
          {/* Red Bandana Scarf */}
          <rect x="8" y="13" width="8" height="2" fill="#DC2626" />
          <polygon points="11,15 13,15 12,17" fill="#DC2626" />
          {/* Fluffy Body & Tail */}
          <rect x="7" y="14" width="10" height="6" fill="#4B5563" />
          <rect x="16" y="15" width="4" height="4" fill="#9CA3AF" />
        </svg>
      );

    case 'forest_hedgehog':
    case 'companion_forest_hedgehog':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Pippin the Apple Hedgehog */}
          {/* Spiky Quills */}
          <polygon points="4,10 8,14 4,16" fill="#78350F" />
          <polygon points="6,6 10,12 8,15" fill="#92400E" />
          <polygon points="11,4 14,10 12,14" fill="#78350F" />
          <rect x="7" y="11" width="11" height="8" fill="#92400E" />
          {/* Soft Beige Face & Snout */}
          <ellipse cx="18" cy="15" rx="3.5" ry="2.5" fill="#FED7AA" />
          <circle cx="21" cy="14" r="1" fill="#18181B" />
          <circle cx="18" cy="14" r="1" fill="#18181B" />
          <rect x="17" y="16" width="1" height="1" fill="#FB7185" />
          {/* Shiny Red Forest Apple on Back */}
          <circle cx="11" cy="9" r="3.5" fill="#DC2626" />
          <circle cx="10" cy="8" r="1" fill="#FEF08A" />
          <rect x="11" y="5" width="1" height="2" fill="#15803D" />
        </svg>
      );

    // -------------------------------------------------------------
    // 7. HABITATS & SCENES
    // -------------------------------------------------------------
    case 'red_riding_forest':
    case 'scene_red_riding_forest':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Fairytale Granny's Forest Cottage Scene */}
          {/* Deep Forest Pine Canopy */}
          <rect x="2" y="2" width="20" height="20" fill="#064E3B" />
          {/* Pine Trees */}
          <polygon points="5,2 2,7 8,7" fill="#047857" />
          <polygon points="19,2 16,7 22,7" fill="#047857" />
          {/* Cottage Roof & Stone Wall */}
          <polygon points="12,6 6,12 18,12" fill="#991B1B" />
          <rect x="7" y="12" width="10" height="8" fill="#78350F" />
          {/* Stone Chimney with Smoke */}
          <rect x="14" y="5" width="3" height="4" fill="#64748B" />
          <circle cx="16" cy="3" r="1" fill="#E2E8F0" opacity="0.8" />
          {/* Glowing Window */}
          <rect x="9" y="14" width="3" height="3" fill="#FEF08A" />
          {/* Cobblestone Path */}
          <path d="M12 20 Q11 16 13 12" stroke="#CBD5E1" strokeWidth="2" fill="none" />
          {/* Red Amanita Mushroom */}
          <circle cx="5" cy="18" r="2" fill="#EF4444" />
          <rect x="5" y="18" width="1" height="3" fill="#FFFFFF" />
        </svg>
      );

    case 'sushi_bar':
    case 'scene_sushi_bar':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Edo Sushi Restaurant: Wooden Cypress Bar, Red Lanterns & Noren Curtain */}
          {/* Dark wooden interior wall */}
          <rect x="2" y="2" width="20" height="20" fill="#3E2723" />
          {/* Top Wooden Beam & Noren Curtains */}
          <rect x="2" y="2" width="20" height="3" fill="#5D4037" />
          <rect x="4" y="5" width="4" height="4" fill="#1E293B" />
          <rect x="10" y="5" width="4" height="4" fill="#1E293B" />
          <rect x="16" y="5" width="4" height="4" fill="#1E293B" />
          {/* Red Lantern on Right */}
          <rect x="18" y="9" width="4" height="5" fill="#DC2626" />
          <rect x="19" y="10" width="2" height="3" fill="#FEF08A" />
          {/* Cypress Sushi Counter */}
          <rect x="2" y="14" width="20" height="4" fill="#D97706" />
          <rect x="2" y="17" width="20" height="5" fill="#92400E" />
          {/* Glass Display Case with Salmon & Maguro */}
          <rect x="5" y="12" width="10" height="3" fill="#38BDF8" opacity="0.8" />
          <rect x="6" y="13" width="3" height="1.5" fill="#FB923C" />
          <rect x="10" y="13" width="3" height="1.5" fill="#E11D48" />
        </svg>
      );
    case 'zen_pond':
    case 'scene_zen_pond':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Water & Lily Pad & Stone Lantern */}
          <rect x="3" y="12" width="18" height="9" fill="#0284C7" />
          <ellipse cx="9" cy="15" rx="5" ry="2.5" fill="#22C55E" />
          <rect x="15" y="8" width="4" height="6" fill="#64748B" />
          <rect x="14" y="6" width="6" height="2" fill="#475569" />
          <rect x="16" y="9" width="2" height="2" fill="#FEF08A" />
        </svg>
      );

    case 'treehouse':
    case 'scene_treehouse':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Wooden House & Foliage */}
          <rect x="6" y="9" width="12" height="10" fill="#92400E" />
          <polygon points="12,3 4,9 20,9" fill="#15803D" />
          <rect x="10" y="13" width="4" height="6" fill="#78350F" />
          <rect x="7" y="11" width="3" height="3" fill="#FEF08A" />
        </svg>
      );

    case 'sakura_shrine':
    case 'scene_sakura_shrine':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Red Torii Gate */}
          <rect x="4" y="5" width="16" height="3" fill="#DC2626" />
          <rect x="6" y="8" width="2" height="12" fill="#DC2626" />
          <rect x="16" y="8" width="2" height="12" fill="#DC2626" />
          <circle cx="4" cy="14" r="2" fill="#F472B6" />
          <circle cx="20" cy="12" r="2" fill="#F472B6" />
        </svg>
      );

    case 'rainy_meadow':
    case 'scene_rainy_meadow':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Rain Mushroom */}
          <rect x="3" y="16" width="18" height="5" fill="#15803D" />
          <path d="M7 13 Q12 7 17 13 Z" fill="#EF4444" />
          <circle cx="10" cy="10" r="1" fill="#FFFFFF" />
          <circle cx="14" cy="10" r="1" fill="#FFFFFF" />
          <rect x="11" y="13" width="2" height="4" fill="#FFFFFF" />
          <line x1="5" y1="4" x2="4" y2="7" stroke="#38BDF8" strokeWidth="1" />
          <line x1="18" y1="3" x2="17" y2="6" stroke="#38BDF8" strokeWidth="1" />
        </svg>
      );

    case 'onsen':
    case 'scene_onsen':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Hot Spring Water & Steam */}
          <rect x="4" y="11" width="16" height="9" fill="#0284C7" />
          <rect x="3" y="11" width="2" height="9" fill="#78716C" />
          <rect x="19" y="11" width="2" height="9" fill="#78716C" />
          <path d="M8 8 Q9 5 8 3" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
          <path d="M12 7 Q13 4 12 2" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
          <path d="M16 8 Q17 5 16 3" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
        </svg>
      );

    case 'night_camp':
    case 'scene_night_camp':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Campfire & Starry Sky */}
          <rect x="3" y="3" width="18" height="18" fill="#0F172A" />
          <circle cx="7" cy="6" r="1" fill="#FACC15" />
          <circle cx="17" cy="5" r="1" fill="#FACC15" />
          {/* Fire */}
          <polygon points="12,11 9,18 15,18" fill="#EA580C" />
          <polygon points="12,13 10,18 14,18" fill="#FACC15" />
        </svg>
      );

    case 'tearoom':
    case 'scene_tearoom':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Tatami Mats & Bonsai */}
          <rect x="3" y="14" width="18" height="7" fill="#C59B63" />
          <rect x="3" y="14" width="18" height="1" fill="#6E4424" />
          <rect x="12" y="14" width="1" height="7" fill="#6E4424" />
          {/* Bonsai */}
          <rect x="8" y="11" width="8" height="3" fill="#78350F" />
          <circle cx="12" cy="8" r="3" fill="#15803D" />
        </svg>
      );

    case 'cloud_palace':
    case 'scene_cloud_palace':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Pastel Clouds & Gold Star */}
          <rect x="3" y="3" width="18" height="18" fill="#38BDF8" />
          <circle cx="12" cy="14" r="5" fill="#FFFFFF" />
          <circle cx="8" cy="15" r="4" fill="#FFFFFF" />
          <circle cx="16" cy="15" r="4" fill="#FFFFFF" />
          <rect x="11" y="6" width="3" height="3" fill="#FACC15" />
        </svg>
      );

    case 'bamboo_grove':
    case 'scene_bamboo_grove':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Green Bamboo Shoots */}
          <rect x="6" y="4" width="3" height="16" fill="#15803D" />
          <rect x="6" y="8" width="3" height="1" fill="#14532D" />
          <rect x="6" y="13" width="3" height="1" fill="#14532D" />
          <rect x="14" y="3" width="3" height="17" fill="#22C55E" />
          <rect x="14" y="7" width="3" height="1" fill="#16A34A" />
          <rect x="14" y="12" width="3" height="1" fill="#16A34A" />
        </svg>
      );

    // -------------------------------------------------------------
    // 8. WEATHER
    // -------------------------------------------------------------
    case 'auto':
    case 'weather_auto':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <circle cx="12" cy="12" r="8" fill="#64748B" />
          <rect x="11" y="7" width="2" height="5" fill="#FFFFFF" />
          <rect x="11" y="11" width="5" height="2" fill="#FFFFFF" />
        </svg>
      );

    case 'sunny':
    case 'weather_sunny':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <circle cx="12" cy="12" r="5" fill="#F59E0B" />
          <rect x="11" y="3" width="2" height="3" fill="#F59E0B" />
          <rect x="11" y="18" width="2" height="3" fill="#F59E0B" />
          <rect x="3" y="11" width="3" height="2" fill="#F59E0B" />
          <rect x="18" y="11" width="3" height="2" fill="#F59E0B" />
        </svg>
      );

    case 'golden':
    case 'weather_golden':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="13" width="16" height="7" fill="#EA580C" />
          <circle cx="12" cy="13" r="5" fill="#FACC15" />
        </svg>
      );

    case 'starry':
    case 'weather_starry':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <path d="M15 6 A 7 7 0 0 0 10 17 A 7 7 0 1 1 15 6 Z" fill="#FACC15" />
          <circle cx="18" cy="8" r="1" fill="#FFFFFF" />
          <circle cx="6" cy="14" r="1" fill="#FFFFFF" />
        </svg>
      );

    case 'rainy':
    case 'weather_rainy':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <ellipse cx="12" cy="9" rx="7" ry="4" fill="#94A3B8" />
          <line x1="8" y1="15" x2="7" y2="19" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="12" y1="15" x2="11" y2="19" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="16" y1="15" x2="15" y2="19" stroke="#38BDF8" strokeWidth="1.5" />
        </svg>
      );

    case 'petals':
    case 'weather_petals':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <circle cx="7" cy="7" r="2" fill="#F472B6" />
          <circle cx="16" cy="9" r="2.5" fill="#FB7185" />
          <circle cx="11" cy="15" r="2" fill="#FDA4AF" />
          <circle cx="18" cy="18" r="1.5" fill="#F472B6" />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <circle cx="12" cy="12" r="6" fill="#75A65A" />
          <circle cx="12" cy="12" r="3" fill="#FEF9C3" />
        </svg>
      );
  }
};
