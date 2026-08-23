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

  // Normalize key by stripping item prefixes (hat_, outfit_, glasses_, skin_, prop_, activity_, companion_, comp_, scene_, weather_)
  const key = id.replace(/^(hat_|outfit_|glasses_|skin_|prop_|activity_|companion_|comp_|scene_|weather_)/, '');

  // -------------------------------------------------------------
  // 1. FROG SKINS (Face preview with palette)
  // -------------------------------------------------------------
  if (
    category === 'skins' ||
    id.startsWith('skin_') ||
    [
      'classic',
      'golden',
      'sakura_pink',
      'twilight_blue',
      'matcha',
      'albino_white',
      'ember_orange',
      'wasabi_green',
      'salmon_peach',
      'fairytale_rose',
      'timber_wolf_grey',
      'konbini_mint',
    ].includes(key)
  ) {
    const pal = getSkinColors(key as any);
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
  // 2. ITEM SWITCH (Hats, Outfits, Glasses, Props, Companions, Scenes, Weather)
  // -------------------------------------------------------------
  switch (key) {
    // -----------------------------------------------------------
    // A. HATS
    // -----------------------------------------------------------
    case 'none':
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
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="11" y="4" width="2" height="3" fill="#15803D" />
          <rect x="9" y="7" width="2" height="2" fill="#38BDF8" />
          <rect x="6" y="8" width="12" height="3" fill="#22C55E" />
          <rect x="3" y="11" width="18" height="4" fill="#16A34A" />
          <rect x="2" y="15" width="20" height="2" fill="#15803D" />
          <rect x="5" y="17" width="3" height="1" fill="#14532D" />
          <rect x="16" y="17" width="3" height="1" fill="#14532D" />
        </svg>
      );

    case 'straw':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="10" y="5" width="4" height="2" fill="#A16207" />
          <rect x="8" y="7" width="8" height="3" fill="#D97706" />
          <rect x="6" y="10" width="12" height="3" fill="#F59E0B" />
          <rect x="3" y="13" width="18" height="3" fill="#FBBF24" />
          <rect x="2" y="16" width="20" height="2" fill="#D97706" />
          <rect x="9" y="18" width="2" height="3" fill="#DC2626" />
          <rect x="13" y="18" width="2" height="3" fill="#DC2626" />
        </svg>
      );

    case 'sakura':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="11" width="16" height="2" fill="#15803D" />
          <rect x="4" y="7" width="4" height="4" fill="#F472B6" />
          <rect x="5" y="8" width="2" height="2" fill="#FEF08A" />
          <rect x="10" y="5" width="4" height="4" fill="#FB7185" />
          <rect x="11" y="6" width="2" height="2" fill="#FEF08A" />
          <rect x="16" y="7" width="4" height="4" fill="#F472B6" />
          <rect x="17" y="8" width="2" height="2" fill="#FEF08A" />
          <rect x="2" y="13" width="2" height="2" fill="#FDA4AF" />
          <rect x="20" y="14" width="2" height="2" fill="#FDA4AF" />
        </svg>
      );

    case 'wizard':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="11" y="2" width="2" height="2" fill="#FACC15" />
          <rect x="10" y="4" width="4" height="3" fill="#312E81" />
          <rect x="8" y="7" width="8" height="4" fill="#3730A3" />
          <rect x="6" y="11" width="12" height="3" fill="#4338CA" />
          <rect x="11" y="9" width="2" height="2" fill="#FDE047" />
          <rect x="3" y="14" width="18" height="3" fill="#312E81" />
          <rect x="2" y="17" width="20" height="2" fill="#1E1B4B" />
        </svg>
      );

    case 'bandana':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="8" width="16" height="6" fill="#DC2626" />
          <rect x="6" y="10" width="2" height="2" fill="#FFFFFF" />
          <rect x="11" y="9" width="2" height="2" fill="#FFFFFF" />
          <rect x="16" y="10" width="2" height="2" fill="#FFFFFF" />
          <rect x="18" y="13" width="3" height="5" fill="#B91C1C" />
          <rect x="19" y="14" width="2" height="4" fill="#DC2626" />
        </svg>
      );

    case 'beanie':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <circle cx="12" cy="5" r="2.5" fill="#EA580C" />
          <rect x="7" y="7" width="10" height="4" fill="#F97316" />
          <rect x="5" y="10" width="14" height="4" fill="#FB923C" />
          <rect x="4" y="14" width="16" height="4" fill="#EA580C" />
          <rect x="4" y="17" width="16" height="1" fill="#C2410C" />
        </svg>
      );

    case 'chef':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="7" y="4" width="10" height="3" fill="#FFFFFF" />
          <rect x="5" y="7" width="14" height="6" fill="#FFFFFF" />
          <rect x="4" y="8" width="2" height="4" fill="#E2E8F0" />
          <rect x="18" y="8" width="2" height="4" fill="#E2E8F0" />
          <rect x="5" y="13" width="14" height="4" fill="#CBD5E1" />
          <rect x="6" y="14" width="12" height="2" fill="#FFFFFF" />
        </svg>
      );

    case 'crown':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="8" width="3" height="3" fill="#FACC15" />
          <rect x="10" y="5" width="4" height="4" fill="#FACC15" />
          <rect x="17" y="8" width="3" height="3" fill="#FACC15" />
          <rect x="5" y="9" width="1" height="1" fill="#3B82F6" />
          <rect x="11" y="6" width="2" height="2" fill="#EF4444" />
          <rect x="18" y="9" width="1" height="1" fill="#3B82F6" />
          <rect x="4" y="11" width="16" height="4" fill="#FACC15" />
          <rect x="3" y="15" width="18" height="3" fill="#EAB308" />
        </svg>
      );

    case 'beret':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="11" y="6" width="2" height="2" fill="#374151" />
          <rect x="7" y="8" width="10" height="3" fill="#4B5563" />
          <rect x="4" y="11" width="16" height="4" fill="#374151" />
          <rect x="3" y="13" width="18" height="2" fill="#1F2937" />
          <rect x="6" y="15" width="12" height="2" fill="#111827" />
        </svg>
      );

    case 'flower':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="10" y="5" width="4" height="4" fill="#FEF08A" />
          <rect x="6" y="9" width="4" height="4" fill="#FEF08A" />
          <rect x="14" y="9" width="4" height="4" fill="#FEF08A" />
          <rect x="8" y="13" width="4" height="4" fill="#FEF08A" />
          <rect x="12" y="13" width="4" height="4" fill="#FEF08A" />
          <rect x="10" y="9" width="4" height="4" fill="#EA580C" />
          <rect x="11" y="10" width="2" height="2" fill="#F97316" />
        </svg>
      );

    case 'samurai':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="7" y="4" width="2" height="4" fill="#FACC15" />
          <rect x="15" y="4" width="2" height="4" fill="#FACC15" />
          <rect x="10" y="6" width="4" height="3" fill="#CA8A04" />
          <rect x="11" y="7" width="2" height="2" fill="#DC2626" />
          <rect x="5" y="9" width="14" height="5" fill="#18181B" />
          <rect x="3" y="14" width="18" height="3" fill="#27272A" />
          <rect x="6" y="17" width="12" height="2" fill="#DC2626" />
        </svg>
      );

    case 'headphone':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="7" y="5" width="10" height="2" fill="#18181B" />
          <rect x="5" y="7" width="2" height="4" fill="#18181B" />
          <rect x="17" y="7" width="2" height="4" fill="#18181B" />
          <rect x="4" y="11" width="4" height="7" fill="#0284C7" />
          <rect x="5" y="12" width="2" height="5" fill="#38BDF8" />
          <rect x="16" y="11" width="4" height="7" fill="#0284C7" />
          <rect x="17" y="12" width="2" height="5" fill="#38BDF8" />
        </svg>
      );

    case 'detective':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="11" y="6" width="2" height="2" fill="#451A03" />
          <rect x="8" y="8" width="8" height="4" fill="#92400E" />
          <rect x="5" y="12" width="14" height="3" fill="#B45309" />
          <rect x="2" y="15" width="20" height="2" fill="#78350F" />
        </svg>
      );

    case 'sushi_salmon':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="6" width="16" height="5" fill="#FB923C" />
          <rect x="5" y="5" width="14" height="2" fill="#F97316" />
          <rect x="7" y="7" width="2" height="3" fill="#FED7AA" />
          <rect x="12" y="6" width="2" height="4" fill="#FED7AA" />
          <rect x="17" y="7" width="2" height="3" fill="#FED7AA" />
          <rect x="5" y="11" width="14" height="5" fill="#FFFFFF" />
          <rect x="11" y="5" width="3" height="13" fill="#18181B" />
        </svg>
      );

    case 'sushi_maguro':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="6" width="16" height="5" fill="#E11D48" />
          <rect x="5" y="5" width="14" height="2" fill="#BE123C" />
          <rect x="7" y="7" width="2" height="3" fill="#FDA4AF" />
          <rect x="13" y="6" width="2" height="4" fill="#FDA4AF" />
          <rect x="5" y="11" width="14" height="5" fill="#FFFFFF" />
        </svg>
      );

    case 'sushi_ebi':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="6" width="14" height="5" fill="#F43F5E" />
          <rect x="6" y="7" width="2" height="3" fill="#FFFFFF" />
          <rect x="10" y="6" width="2" height="4" fill="#FFFFFF" />
          <rect x="14" y="7" width="2" height="3" fill="#FFFFFF" />
          <polygon points="18,5 22,3 20,8" fill="#E11D48" />
          <polygon points="18,9 22,11 19,7" fill="#E11D48" />
          <rect x="5" y="11" width="13" height="5" fill="#FFFFFF" />
        </svg>
      );

    case 'sushi_chef_headband':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="3" y="9" width="18" height="5" fill="#FFFFFF" />
          <circle cx="12" cy="11.5" r="2" fill="#DC2626" />
          <rect x="18" y="14" width="3" height="6" fill="#FFFFFF" />
        </svg>
      );

    case 'red_riding_hood':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="6" y="3" width="12" height="4" fill="#991B1B" />
          <rect x="4" y="6" width="16" height="8" fill="#DC2626" />
          <rect x="3" y="10" width="18" height="6" fill="#EF4444" />
          <rect x="7" y="9" width="10" height="5" fill="#991B1B" />
          <rect x="3" y="15" width="18" height="1" fill="#FEF08A" />
          <rect x="10" y="16" width="4" height="3" fill="#B91C1C" />
        </svg>
      );

    case 'wolf_ears_hood':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <polygon points="5,2 9,7 5,7" fill="#4B5563" />
          <polygon points="6,3 8,6 6,6" fill="#FCA5A5" />
          <polygon points="19,2 15,7 19,7" fill="#4B5563" />
          <polygon points="18,3 16,6 18,6" fill="#FCA5A5" />
          <rect x="5" y="6" width="14" height="8" fill="#374151" />
          <rect x="4" y="9" width="16" height="6" fill="#4B5563" />
        </svg>
      );

    case 'granny_nightcap':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <circle cx="19" cy="6" r="2.5" fill="#F8FAFC" />
          <polygon points="8,5 18,5 15,10 6,10" fill="#E2E8F0" />
          <rect x="5" y="9" width="14" height="6" fill="#F1F5F9" />
          <rect x="3" y="15" width="18" height="3" fill="#E2E8F0" />
        </svg>
      );

    case 'konbini_staff_visor':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Green & Orange Convenience Store Sun Visor */}
          <rect x="4" y="8" width="16" height="4" fill="#16A34A" />
          <rect x="4" y="12" width="16" height="2" fill="#EA580C" />
          <rect x="2" y="14" width="20" height="3" fill="#22C55E" />
          <circle cx="12" cy="10" r="1.5" fill="#FEF08A" />
        </svg>
      );

    case 'shopper_bucket_hat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Pastel Lilac Bucket Hat with Smiley Badge */}
          <rect x="7" y="6" width="10" height="5" fill="#C084FC" />
          <rect x="5" y="11" width="14" height="3" fill="#A855F7" />
          <rect x="3" y="14" width="18" height="3" fill="#C084FC" />
          <circle cx="12" cy="9" r="1.5" fill="#FEF08A" />
        </svg>
      );

    case 'onigiri_headband':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Cute Little Mini Onigiri on Headband */}
          <rect x="4" y="12" width="16" height="2" fill="#18181B" />
          <polygon points="12,3 7,11 17,11" fill="#FFFFFF" />
          <rect x="10" y="8" width="4" height="3" fill="#18181B" />
          <circle cx="10" cy="6" r="0.5" fill="#FB7185" />
          <circle cx="14" cy="6" r="0.5" fill="#FB7185" />
        </svg>
      );

    // -----------------------------------------------------------
    // B. OUTFITS
    // -----------------------------------------------------------
    case 'kimono':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="7" y="5" width="10" height="3" fill="#1E3A8A" />
          <rect x="4" y="8" width="16" height="12" fill="#1E40AF" />
          <rect x="6" y="12" width="12" height="3" fill="#FACC15" />
          <rect x="9" y="11" width="6" height="5" fill="#CA8A04" />
        </svg>
      );

    case 'raincoat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="7" y="5" width="10" height="3" fill="#EAB308" />
          <rect x="4" y="8" width="16" height="12" fill="#FACC15" />
          <rect x="11" y="10" width="2" height="2" fill="#18181B" />
          <rect x="11" y="14" width="2" height="2" fill="#18181B" />
        </svg>
      );

    case 'sweater':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="7" y="5" width="10" height="3" fill="#EA580C" />
          <rect x="4" y="8" width="16" height="12" fill="#F97316" />
          <line x1="8" y1="8" x2="8" y2="19" stroke="#C2410C" strokeWidth="1" />
          <line x1="12" y1="8" x2="12" y2="19" stroke="#C2410C" strokeWidth="1" />
          <line x1="16" y1="8" x2="16" y2="19" stroke="#C2410C" strokeWidth="1" />
        </svg>
      );

    case 'ninja':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="7" y="5" width="10" height="3" fill="#09090B" />
          <rect x="4" y="8" width="16" height="12" fill="#18181B" />
          <rect x="5" y="13" width="14" height="2" fill="#DC2626" />
          <rect x="10" y="14" width="4" height="4" fill="#B91C1C" />
        </svg>
      );

    case 'sailor':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="7" y="5" width="10" height="3" fill="#0284C7" />
          <rect x="4" y="8" width="16" height="12" fill="#F8FAFC" />
          <polygon points="12,13 7,8 17,8" fill="#0284C7" />
          <circle cx="12" cy="14" r="1.5" fill="#EF4444" />
        </svg>
      );

    case 'apron':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="7" y="5" width="10" height="3" fill="#15803D" />
          <rect x="5" y="8" width="14" height="12" fill="#16A34A" />
          <rect x="8" y="13" width="8" height="5" fill="#15803D" />
        </svg>
      );

    case 'overalls':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="7" y="7" width="2" height="7" fill="#1D4ED8" />
          <rect x="15" y="7" width="2" height="7" fill="#1D4ED8" />
          <rect x="5" y="12" width="14" height="8" fill="#2563EB" />
          <rect x="7" y="13" width="1" height="1" fill="#FACC15" />
          <rect x="16" y="13" width="1" height="1" fill="#FACC15" />
        </svg>
      );

    case 'scarf':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="5" y="8" width="14" height="6" fill="#DC2626" />
          <rect x="6" y="9" width="12" height="4" fill="#EF4444" />
          <rect x="13" y="14" width="4" height="7" fill="#DC2626" />
          <rect x="13" y="21" width="4" height="1" fill="#FDE047" />
        </svg>
      );

    case 'business':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="7" y="5" width="10" height="3" fill="#18181B" />
          <rect x="4" y="8" width="16" height="12" fill="#27272A" />
          <polygon points="12,14 8,8 16,8" fill="#FFFFFF" />
          <rect x="11" y="9" width="2" height="6" fill="#DC2626" />
          <rect x="10" y="15" width="4" height="2" fill="#DC2626" />
        </svg>
      );

    case 'hoodie':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="7" y="5" width="10" height="4" fill="#65A30D" />
          <rect x="4" y="9" width="16" height="11" fill="#84CC16" />
          <rect x="7" y="14" width="10" height="5" fill="#4D7C0F" />
        </svg>
      );

    case 'sushi_chef_happi':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="7" y="5" width="10" height="3" fill="#1E293B" />
          <rect x="4" y="8" width="16" height="12" fill="#0F172A" />
          <rect x="8" y="7" width="2" height="13" fill="#FFFFFF" />
          <rect x="14" y="7" width="2" height="13" fill="#FFFFFF" />
          <rect x="5" y="13" width="14" height="2" fill="#DC2626" />
          <rect x="10" y="14" width="4" height="4" fill="#B91C1C" />
        </svg>
      );

    case 'sushi_kimono_waiter':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="7" y="5" width="10" height="3" fill="#15803D" />
          <rect x="4" y="8" width="16" height="12" fill="#16A34A" />
          <rect x="6" y="12" width="12" height="3" fill="#FACC15" />
          <rect x="9" y="11" width="6" height="5" fill="#FEF08A" />
        </svg>
      );

    case 'red_riding_dress':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="6" y="6" width="12" height="4" fill="#991B1B" />
          <rect x="4" y="10" width="16" height="10" fill="#DC2626" />
          <rect x="8" y="10" width="8" height="10" fill="#FFFFFF" />
          <rect x="9" y="11" width="6" height="2" fill="#B91C1C" />
          <rect x="9" y="14" width="6" height="2" fill="#B91C1C" />
          <rect x="7" y="19" width="10" height="1" fill="#FEF08A" />
        </svg>
      );

    case 'wolf_fur_cloak':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="6" y="5" width="12" height="4" fill="#374151" />
          <rect x="4" y="9" width="16" height="11" fill="#4B5563" />
          <polygon points="4,9 2,15 6,15" fill="#6B7280" />
          <polygon points="20,9 18,15 22,15" fill="#6B7280" />
          <rect x="6" y="13" width="12" height="2" fill="#78350F" />
          <rect x="11" y="12" width="2" height="4" fill="#FACC15" />
        </svg>
      );

    case 'hunter_woodsman':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="7" y="5" width="10" height="3" fill="#14532D" />
          <rect x="4" y="8" width="16" height="12" fill="#166534" />
          <rect x="5" y="13" width="14" height="2" fill="#78350F" />
          <rect x="11" y="12" width="2" height="4" fill="#FACC15" />
          <rect x="8" y="9" width="4" height="3" fill="#DC2626" />
        </svg>
      );

    case 'konbini_staff_uniform':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Green & Orange Clerk Polo & Apron with Badge */}
          <rect x="6" y="5" width="12" height="3" fill="#15803D" />
          <rect x="4" y="8" width="16" height="12" fill="#16A34A" />
          <rect x="8" y="8" width="8" height="12" fill="#EA580C" />
          <rect x="10" y="8" width="4" height="12" fill="#FFFFFF" />
          <rect x="6" y="11" width="3" height="2" fill="#FFFFFF" />
          <rect x="7" y="11" width="1" height="2" fill="#3B82F6" />
        </svg>
      );

    case 'shopper_cozy_sweatset':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Lilac Fleece Hoodie & Sweats */}
          <rect x="6" y="5" width="12" height="4" fill="#A855F7" />
          <rect x="4" y="9" width="16" height="11" fill="#C084FC" />
          <rect x="7" y="13" width="10" height="5" fill="#E9D5FF" />
          <rect x="18" y="12" width="4" height="5" fill="#DC2626" />
        </svg>
      );

    // -----------------------------------------------------------
    // C. ACCESSORIES & GLASSES
    // -----------------------------------------------------------
    case 'reading':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="3" y="9" width="8" height="7" fill="#F59E0B" />
          <rect x="5" y="11" width="4" height="3" fill="#E0F2FE" />
          <rect x="11" y="11" width="2" height="2" fill="#D97706" />
          <rect x="13" y="9" width="8" height="7" fill="#F59E0B" />
          <rect x="15" y="11" width="4" height="3" fill="#E0F2FE" />
        </svg>
      );

    case 'sunglasses':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="3" y="10" width="18" height="2" fill="#18181B" />
          <rect x="4" y="12" width="7" height="4" fill="#27272A" />
          <rect x="13" y="12" width="7" height="4" fill="#27272A" />
          <rect x="5" y="12" width="1" height="2" fill="#FFFFFF" />
          <rect x="14" y="12" width="1" height="2" fill="#FFFFFF" />
        </svg>
      );

    case 'monocle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="11" y="8" width="9" height="8" fill="#F59E0B" />
          <rect x="13" y="10" width="5" height="4" fill="#E0F2FE" />
          <rect x="19" y="13" width="1" height="3" fill="#D97706" />
          <rect x="20" y="16" width="1" height="3" fill="#D97706" />
        </svg>
      );

    case 'blush_stars':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="3" y="11" width="6" height="5" fill="#FB7185" />
          <rect x="5" y="12" width="2" height="2" fill="#FDE047" />
          <rect x="15" y="11" width="6" height="5" fill="#FB7185" />
          <rect x="17" y="12" width="2" height="2" fill="#FDE047" />
        </svg>
      );

    case 'sparkles':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="11" y="4" width="2" height="6" fill="#FACC15" />
          <rect x="9" y="6" width="6" height="2" fill="#FACC15" />
          <rect x="11" y="6" width="2" height="2" fill="#FFFFFF" />
          <rect x="4" y="13" width="2" height="4" fill="#FDE047" />
          <rect x="18" y="13" width="2" height="4" fill="#FDE047" />
        </svg>
      );

    case 'eyepatch':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <line x1="3" y1="7" x2="21" y2="15" stroke="#18181B" strokeWidth="2" />
          <rect x="4" y="9" width="7" height="6" fill="#18181B" />
          <rect x="6" y="11" width="3" height="2" fill="#FFFFFF" />
        </svg>
      );

    case 'wasabi_sparkle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="3" y="12" width="5" height="4" fill="#84CC16" />
          <rect x="16" y="12" width="5" height="4" fill="#84CC16" />
          <rect x="11" y="4" width="2" height="6" fill="#A3E635" />
          <rect x="9" y="6" width="6" height="2" fill="#A3E635" />
          <rect x="11" y="6" width="2" height="2" fill="#FEF08A" />
        </svg>
      );

    case 'forest_blush_freckles':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="3" y="11" width="6" height="5" fill="#F43F5E" opacity="0.8" />
          <rect x="15" y="11" width="6" height="5" fill="#F43F5E" opacity="0.8" />
          <rect x="5" y="12" width="1" height="1" fill="#78350F" />
          <rect x="7" y="13" width="1" height="1" fill="#78350F" />
          <rect x="16" y="12" width="1" height="1" fill="#78350F" />
          <rect x="18" y="13" width="1" height="1" fill="#78350F" />
        </svg>
      );

    case 'wolf_snarl_fangs':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="8" y="11" width="8" height="4" fill="#18181B" />
          <polygon points="9,11 11,11 10,14" fill="#FFFFFF" />
          <polygon points="13,11 15,11 14,14" fill="#FFFFFF" />
          <rect x="11" y="13" width="2" height="2" fill="#FB7185" />
        </svg>
      );

    case 'scanner_headset':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Smart Clerk Headset & Cashier Mic */}
          <path d="M4 14 C4 6, 20 6, 20 14" stroke="#1E293B" strokeWidth="2" fill="none" />
          <rect x="3" y="12" width="3" height="6" fill="#3B82F6" />
          <rect x="18" y="12" width="3" height="6" fill="#3B82F6" />
          <path d="M5 16 Q8 21 13 20" stroke="#0F172A" strokeWidth="1.5" fill="none" />
          <circle cx="14" cy="20" r="1.5" fill="#EF4444" />
        </svg>
      );

    case 'konbini_blush':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Rosy Snack Cheerful Blush with heart sparkles */}
          <rect x="3" y="11" width="6" height="5" fill="#F43F5E" />
          <rect x="15" y="11" width="6" height="5" fill="#F43F5E" />
          <circle cx="6" cy="13" r="1" fill="#FFFFFF" />
          <circle cx="18" cy="13" r="1" fill="#FFFFFF" />
          <rect x="11" y="5" width="2" height="2" fill="#FB7185" />
        </svg>
      );

    // -----------------------------------------------------------
    // D. PROPS & ACTIVITIES
    // -----------------------------------------------------------
    case 'relaxing':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <circle cx="12" cy="12" r="7" fill="#75A65A" />
          <circle cx="9" cy="10" r="1" fill="#18181B" />
          <circle cx="15" cy="10" r="1" fill="#18181B" />
          <path d="M9 13 Q12 16 15 13" stroke="#18181B" strokeWidth="1" fill="none" />
          <circle cx="7" cy="13" r="1.5" fill="#FB7185" />
          <circle cx="17" cy="13" r="1.5" fill="#FB7185" />
        </svg>
      );

    case 'konbini_scanner':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Digital Register & Beeping Laser Scanner */}
          <rect x="4" y="8" width="16" height="12" fill="#334155" />
          <rect x="6" y="10" width="12" height="5" fill="#38BDF8" />
          <line x1="7" y1="12" x2="17" y2="12" stroke="#EF4444" strokeWidth="1.5" />
          <rect x="6" y="16" width="12" height="3" fill="#64748B" />
        </svg>
      );

    case 'eating_onigiri':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Steaming Nikuman Bun & Onigiri */}
          <polygon points="12,5 6,15 18,15" fill="#FFFFFF" />
          <rect x="9" y="11" width="6" height="4" fill="#18181B" />
          <circle cx="17" cy="17" r="4" fill="#FEF3C7" />
          <path d="M11 2 Q12 0 13 2" stroke="#CBD5E1" strokeWidth="1" fill="none" />
        </svg>
      );

    case 'holding_konbini_bag':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Striped Convenience Shopping Bag & Iced Coffee */}
          <rect x="5" y="8" width="14" height="13" fill="#F8FAFC" />
          <rect x="5" y="12" width="14" height="2" fill="#16A34A" />
          <rect x="5" y="15" width="14" height="2" fill="#EA580C" />
          <path d="M8 8 C8 4, 16 4, 16 8" stroke="#CBD5E1" strokeWidth="2" fill="none" />
        </svg>
      );

    case 'picnic_basket':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <path d="M7 11 C7 4, 17 4, 17 11" stroke="#92400E" strokeWidth="2" fill="none" />
          <rect x="4" y="11" width="16" height="10" fill="#B45309" />
          <polygon points="4,11 11,11 7,16" fill="#DC2626" />
          <circle cx="15" cy="10" r="2.5" fill="#EF4444" />
        </svg>
      );

    case 'woodcutter_axe':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <line x1="6" y1="20" x2="16" y2="5" stroke="#78350F" strokeWidth="2.5" />
          <polygon points="14,4 20,2 18,10 13,8" fill="#94A3B8" />
          <circle cx="7" cy="14" r="2" fill="#3B82F6" />
        </svg>
      );

    case 'eating_sushi':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Wooden Geta Platter with Sushi */}
          <rect x="3" y="12" width="18" height="6" fill="#D97706" />
          <rect x="5" y="18" width="3" height="3" fill="#78350F" />
          <rect x="16" y="18" width="3" height="3" fill="#78350F" />
          <rect x="6" y="9" width="4" height="3" fill="#FB923C" />
          <rect x="11" y="9" width="4" height="3" fill="#E11D48" />
          <circle cx="17" cy="10.5" r="1.5" fill="#84CC16" />
        </svg>
      );

    case 'sushi_crafting':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Itamae Hand-Shaping Shari & Neta */}
          <ellipse cx="12" cy="13" rx="6" ry="4" fill="#FFFFFF" />
          <rect x="8" y="11" width="8" height="2" fill="#FB923C" />
          <circle cx="8" cy="9" r="2" fill="#75A65A" />
          <circle cx="16" cy="9" r="2" fill="#75A65A" />
        </svg>
      );

    case 'tea':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="6" y="8" width="12" height="11" fill="#FEF3C7" />
          <rect x="7" y="9" width="10" height="4" fill="#16A34A" />
          <rect x="9" y="10" width="6" height="2" fill="#22C55E" />
          <rect x="8" y="19" width="8" height="2" fill="#D97706" />
          <rect x="9" y="4" width="2" height="3" fill="#E2E8F0" />
          <rect x="13" y="3" width="2" height="4" fill="#E2E8F0" />
        </svg>
      );

    case 'coffee':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="6" y="8" width="10" height="11" fill="#FFFFFF" />
          <rect x="7" y="9" width="8" height="3" fill="#78350F" />
          <rect x="16" y="10" width="3" height="6" fill="#FFFFFF" />
          <rect x="9" y="4" width="2" height="3" fill="#E2E8F0" />
        </svg>
      );

    case 'boba':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="11" y="2" width="2" height="6" fill="#F43F5E" />
          <rect x="7" y="7" width="10" height="14" fill="#FED7AA" />
          <rect x="6" y="7" width="12" height="2" fill="#F97316" />
          <rect x="9" y="16" width="2" height="2" fill="#18181B" />
          <rect x="13" y="16" width="2" height="2" fill="#18181B" />
        </svg>
      );

    case 'reading_prop':
    case 'reading':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="8" width="7" height="10" fill="#F8FAFC" />
          <rect x="13" y="8" width="7" height="10" fill="#F8FAFC" />
          <rect x="11" y="7" width="2" height="12" fill="#DC2626" />
          <rect x="5" y="10" width="5" height="1" fill="#64748B" />
          <rect x="14" y="10" width="5" height="1" fill="#64748B" />
        </svg>
      );

    case 'eating':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <polygon points="12,6 5,18 19,18" fill="#FFFFFF" />
          <rect x="9" y="13" width="6" height="5" fill="#18181B" />
        </svg>
      );

    case 'guitar':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="6" y="11" width="9" height="9" fill="#D97706" />
          <rect x="9" y="14" width="3" height="3" fill="#451A03" />
          <rect x="14" y="6" width="5" height="3" fill="#92400E" />
          <rect x="18" y="4" width="3" height="3" fill="#CA8A04" />
        </svg>
      );

    case 'painting':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="5" y="7" width="13" height="11" fill="#F59E0B" />
          <circle cx="8" cy="10" r="1.5" fill="#EF4444" />
          <circle cx="12" cy="9" r="1.5" fill="#3B82F6" />
          <circle cx="15" cy="12" r="1.5" fill="#22C55E" />
          <rect x="14" y="15" width="6" height="3" fill="#78350F" />
        </svg>
      );

    case 'camera':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="8" width="16" height="11" fill="#451A03" />
          <rect x="7" y="6" width="5" height="2" fill="#78350F" />
          <circle cx="12" cy="13.5" r="3.5" fill="#94A3B8" />
          <circle cx="12" cy="13.5" r="2" fill="#0F172A" />
          <rect x="16" y="9" width="2" height="2" fill="#FACC15" />
        </svg>
      );

    case 'wand':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <line x1="5" y1="19" x2="15" y2="9" stroke="#78350F" strokeWidth="2" />
          <polygon points="17,5 19,8 15,9 18,12 14,11 12,14 11,10 8,9 11,7 9,4 13,6" fill="#FACC15" />
          <circle cx="15" cy="8" r="1" fill="#FFFFFF" />
        </svg>
      );

    case 'meditating':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <circle cx="12" cy="11" r="5" fill="#75A65A" />
          <path d="M6 18 Q12 13 18 18" stroke="#15803D" strokeWidth="2" fill="none" />
          <circle cx="12" cy="4" r="1.5" fill="#FACC15" />
        </svg>
      );

    case 'sleeping':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="10" width="16" height="10" fill="#3B82F6" />
          <rect x="4" y="8" width="6" height="5" fill="#FEF3C7" />
          <text x="16" y="8" fill="#FDE047" fontSize="6" fontFamily="monospace" fontWeight="bold">Z</text>
        </svg>
      );

    case 'fishing':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <line x1="4" y1="20" x2="16" y2="4" stroke="#78350F" strokeWidth="2" />
          <line x1="16" y1="4" x2="19" y2="15" stroke="#CBD5E1" strokeWidth="1" />
          <circle cx="19" cy="15" r="1.5" fill="#EF4444" />
        </svg>
      );

    // -----------------------------------------------------------
    // E. COMPANIONS & PETS
    // -----------------------------------------------------------
    case 'companion_none':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="11" y="8" width="2" height="8" fill="#22C55E" />
          <circle cx="10" cy="8" r="2" fill="#84CC16" />
          <circle cx="14" cy="10" r="2" fill="#84CC16" />
        </svg>
      );

    case 'konbini_cashier_cat':
    case 'cashier_cat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Maneki Neko Cashier Cat waving paw */}
          <polygon points="6,5 9,9 6,9" fill="#18181B" />
          <polygon points="18,5 15,9 18,9" fill="#EA580C" />
          <circle cx="12" cy="10" r="5" fill="#FFFFFF" />
          <rect x="8" y="7" width="8" height="2" fill="#16A34A" />
          <rect x="11" y="7" width="2" height="2" fill="#EA580C" />
          <circle cx="10" cy="10" r="1" fill="#18181B" />
          <circle cx="14" cy="10" r="1" fill="#18181B" />
          <rect x="8" y="14" width="8" height="6" fill="#F8FAFC" />
          <circle cx="17" cy="13" r="2" fill="#FFFFFF" />
        </svg>
      );

    case 'snack_shiba':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Shiba in Red Shopping Basket */}
          <rect x="4" y="12" width="16" height="8" fill="#DC2626" />
          <circle cx="12" cy="10" r="4.5" fill="#D97706" />
          <polygon points="8,6 10,9 7,9" fill="#B45309" />
          <polygon points="16,6 14,9 17,9" fill="#B45309" />
          <ellipse cx="12" cy="11" rx="2" ry="1.5" fill="#FFFFFF" />
          <circle cx="12" cy="11" r="0.8" fill="#18181B" />
        </svg>
      );

    case 'chibi_wolf_pup':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <polygon points="5,4 8,8 5,8" fill="#4B5563" />
          <polygon points="19,4 16,8 19,8" fill="#4B5563" />
          <circle cx="12" cy="9" r="5" fill="#6B7280" />
          <circle cx="9" cy="9" r="1.5" fill="#D97706" />
          <circle cx="15" cy="9" r="1.5" fill="#D97706" />
          <rect x="8" y="13" width="8" height="2" fill="#DC2626" />
          <rect x="7" y="14" width="10" height="6" fill="#4B5563" />
        </svg>
      );

    case 'forest_hedgehog':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <polygon points="6,6 10,12 8,15" fill="#92400E" />
          <polygon points="11,4 14,10 12,14" fill="#78350F" />
          <rect x="7" y="11" width="11" height="8" fill="#92400E" />
          <ellipse cx="18" cy="15" rx="3.5" ry="2.5" fill="#FED7AA" />
          <circle cx="11" cy="9" r="3.5" fill="#DC2626" />
        </svg>
      );

    case 'sushi_apprentice_cat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <polygon points="6,5 9,9 6,9" fill="#EA580C" />
          <polygon points="18,5 15,9 18,9" fill="#18181B" />
          <circle cx="12" cy="10" r="5" fill="#FFFFFF" />
          <rect x="8" y="7" width="8" height="2" fill="#FFFFFF" />
          <rect x="11" y="7" width="2" height="2" fill="#DC2626" />
          <circle cx="10" cy="10" r="1" fill="#18181B" />
          <circle cx="14" cy="10" r="1" fill="#18181B" />
          <rect x="8" y="14" width="8" height="6" fill="#F8FAFC" />
          <rect x="10" y="15" width="4" height="4" fill="#18181B" />
        </svg>
      );

    case 'mini_ebi_shrimp':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <ellipse cx="12" cy="13" rx="6" ry="4" fill="#F97316" />
          <ellipse cx="11" cy="12" rx="4" ry="3" fill="#FED7AA" />
          <polygon points="17,12 22,8 21,15" fill="#EF4444" />
          <circle cx="9" cy="12" r="1" fill="#18181B" />
          <rect x="8" y="14" width="2" height="1" fill="#FB7185" />
        </svg>
      );

    case 'snail':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <circle cx="10" cy="12" r="5" fill="#B45309" />
          <circle cx="10" cy="12" r="3" fill="#D97706" />
          <ellipse cx="16" cy="14" rx="4" ry="2.5" fill="#A3E635" />
          <rect x="18" y="9" width="1" height="4" fill="#A3E635" />
          <circle cx="18" cy="8" r="1" fill="#18181B" />
        </svg>
      );

    case 'crab':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <ellipse cx="12" cy="13" rx="5" ry="4" fill="#DC2626" />
          <circle cx="10" cy="10" r="1.5" fill="#FFFFFF" />
          <circle cx="14" cy="10" r="1.5" fill="#FFFFFF" />
          <circle cx="10" cy="10" r="0.8" fill="#18181B" />
          <circle cx="14" cy="10" r="0.8" fill="#18181B" />
          <circle cx="6" cy="10" r="2" fill="#EF4444" />
          <circle cx="18" cy="10" r="2" fill="#EF4444" />
        </svg>
      );

    case 'fireflies':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <circle cx="8" cy="8" r="3" fill="#FEF08A" />
          <circle cx="8" cy="8" r="1.5" fill="#FFFFFF" />
          <circle cx="16" cy="14" r="3.5" fill="#FEF08A" />
          <circle cx="16" cy="14" r="2" fill="#FFFFFF" />
          <circle cx="17" cy="7" r="2" fill="#FDE047" />
        </svg>
      );

    case 'butterfly':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <ellipse cx="8" cy="10" rx="4" ry="5" fill="#38BDF8" />
          <ellipse cx="16" cy="10" rx="4" ry="5" fill="#38BDF8" />
          <ellipse cx="9" cy="15" rx="3" ry="3.5" fill="#0284C7" />
          <ellipse cx="15" cy="15" rx="3" ry="3.5" fill="#0284C7" />
          <rect x="11.5" y="7" width="1" height="10" fill="#0F172A" />
        </svg>
      );

    case 'koi':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <ellipse cx="12" cy="12" rx="7" ry="3.5" fill="#FFFFFF" />
          <ellipse cx="10" cy="11" rx="3" ry="2" fill="#DC2626" />
          <polygon points="19,12 23,8 23,16" fill="#FFFFFF" />
        </svg>
      );

    case 'duckling':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <circle cx="10" cy="10" r="4" fill="#FACC15" />
          <ellipse cx="14" cy="14" rx="5" ry="3.5" fill="#EAB308" />
          <polygon points="6,10 3,11 6,12" fill="#F97316" />
          <circle cx="10" cy="9" r="0.8" fill="#18181B" />
        </svg>
      );

    case 'cat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <polygon points="7,5 10,9 7,9" fill="#18181B" />
          <polygon points="17,5 14,9 17,9" fill="#18181B" />
          <circle cx="12" cy="10" r="5" fill="#27272A" />
          <circle cx="10" cy="10" r="1.5" fill="#FACC15" />
          <circle cx="14" cy="10" r="1.5" fill="#FACC15" />
        </svg>
      );

    case 'turtle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <ellipse cx="13" cy="12" rx="6" ry="5" fill="#65A30D" />
          <ellipse cx="13" cy="12" rx="4" ry="3" fill="#84CC16" />
          <circle cx="6" cy="12" r="2.5" fill="#4D7C0F" />
          <rect x="5" y="11" width="1" height="1" fill="#18181B" />
        </svg>
      );

    // -----------------------------------------------------------
    // F. HABITATS & SCENES
    // -----------------------------------------------------------
    case 'convenience_store':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* 24h Neon Konbini Store */}
          <rect x="2" y="2" width="20" height="20" fill="#0F172A" />
          <rect x="2" y="2" width="20" height="4" fill="#16A34A" />
          <rect x="2" y="6" width="20" height="1.5" fill="#EA580C" />
          <rect x="4" y="9" width="6" height="8" fill="#38BDF8" opacity="0.8" />
          <rect x="12" y="9" width="8" height="8" fill="#FACC15" opacity="0.8" />
          <rect x="2" y="17" width="20" height="5" fill="#E2E8F0" />
        </svg>
      );

    case 'red_riding_forest':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#064E3B" />
          <polygon points="12,6 6,12 18,12" fill="#991B1B" />
          <rect x="7" y="12" width="10" height="8" fill="#78350F" />
          <circle cx="5" cy="18" r="2" fill="#EF4444" />
        </svg>
      );

    case 'sushi_bar':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#3E2723" />
          <rect x="2" y="2" width="20" height="3" fill="#5D4037" />
          <rect x="18" y="9" width="4" height="5" fill="#DC2626" />
          <rect x="2" y="14" width="20" height="4" fill="#D97706" />
          <rect x="5" y="12" width="10" height="3" fill="#38BDF8" opacity="0.8" />
        </svg>
      );

    case 'sauna_bathhouse':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Bathhouse Stone Wall & Arched Door */}
          <rect x="2" y="2" width="20" height="20" fill="#D4BE9C" />
          <path d="M7 18 L7 9 A5 5 0 0 1 17 9 L17 18 Z" fill="#85532A" />
          <path d="M9 16 L9 10 A3 3 0 0 1 15 10 L15 16 Z" fill="#FEF3C7" />
          <rect x="2" y="18" width="20" height="4" fill="#DFC09C" />
        </svg>
      );

    case 'zen_pond':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#0C4A6E" />
          <rect x="2" y="10" width="20" height="12" fill="#0284C7" />
          <ellipse cx="9" cy="15" rx="5" ry="2.5" fill="#22C55E" />
          <rect x="15" y="8" width="4" height="6" fill="#64748B" />
          <rect x="16" y="9" width="2" height="2" fill="#FEF08A" />
        </svg>
      );

    case 'treehouse':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#523218" />
          <polygon points="12,3 4,9 20,9" fill="#15803D" />
          <rect x="6" y="9" width="12" height="10" fill="#92400E" />
          <rect x="10" y="13" width="4" height="6" fill="#78350F" />
        </svg>
      );

    case 'sakura_shrine':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#FCE7F3" />
          <rect x="4" y="5" width="16" height="3" fill="#DC2626" />
          <rect x="6" y="8" width="2" height="12" fill="#DC2626" />
          <rect x="16" y="8" width="2" height="12" fill="#DC2626" />
        </svg>
      );

    case 'rainy_meadow':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#0F172A" />
          <rect x="2" y="14" width="20" height="8" fill="#15803D" />
          <path d="M7 13 Q12 7 17 13 Z" fill="#EF4444" />
          <rect x="11" y="13" width="2" height="4" fill="#FFFFFF" />
          <line x1="5" y1="4" x2="4" y2="7" stroke="#38BDF8" strokeWidth="1" />
        </svg>
      );

    case 'onsen':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#27272A" />
          <rect x="4" y="11" width="16" height="9" fill="#0284C7" />
          <path d="M8 8 Q9 5 8 3" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
          <path d="M12 7 Q13 4 12 2" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />
        </svg>
      );

    case 'night_camp':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#0F172A" />
          <circle cx="7" cy="6" r="1" fill="#FACC15" />
          <polygon points="12,11 9,18 15,18" fill="#EA580C" />
          <polygon points="12,13 10,18 14,18" fill="#FACC15" />
        </svg>
      );

    case 'tearoom':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#FEF3C7" />
          <rect x="2" y="14" width="20" height="8" fill="#C59B63" />
          <rect x="8" y="11" width="8" height="3" fill="#78350F" />
          <circle cx="12" cy="8" r="3" fill="#15803D" />
        </svg>
      );

    case 'cloud_palace':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#38BDF8" />
          <circle cx="12" cy="14" r="5" fill="#FFFFFF" />
          <circle cx="8" cy="15" r="4" fill="#FFFFFF" />
          <circle cx="16" cy="15" r="4" fill="#FFFFFF" />
          <rect x="11" y="6" width="3" height="3" fill="#FACC15" />
        </svg>
      );

    case 'bamboo_grove':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#052E16" />
          <rect x="6" y="4" width="3" height="16" fill="#15803D" />
          <rect x="14" y="3" width="3" height="17" fill="#22C55E" />
        </svg>
      );

    // -----------------------------------------------------------
    // G. WEATHER
    // -----------------------------------------------------------
    case 'auto':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <circle cx="12" cy="12" r="8" fill="#64748B" />
          <rect x="11" y="7" width="2" height="5" fill="#FFFFFF" />
          <rect x="11" y="11" width="5" height="2" fill="#FFFFFF" />
        </svg>
      );

    case 'sunny':
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
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="13" width="16" height="7" fill="#EA580C" />
          <circle cx="12" cy="13" r="5" fill="#FACC15" />
        </svg>
      );

    case 'starry':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <path d="M15 6 A 7 7 0 0 0 10 17 A 7 7 0 1 1 15 6 Z" fill="#FACC15" />
          <circle cx="18" cy="8" r="1" fill="#FFFFFF" />
          <circle cx="6" cy="14" r="1" fill="#FFFFFF" />
        </svg>
      );

    case 'rainy':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <ellipse cx="12" cy="9" rx="7" ry="4" fill="#94A3B8" />
          <line x1="8" y1="15" x2="7" y2="19" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="12" y1="15" x2="11" y2="19" stroke="#38BDF8" strokeWidth="1.5" />
        </svg>
      );

    case 'petals':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <circle cx="7" cy="7" r="2" fill="#F472B6" />
          <circle cx="16" cy="9" r="2.5" fill="#FB7185" />
          <circle cx="11" cy="15" r="2" fill="#FDA4AF" />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <circle cx="12" cy="12" r="7" fill="#75A65A" />
          <circle cx="12" cy="12" r="4" fill="#FEF9C3" />
        </svg>
      );
  }
};
