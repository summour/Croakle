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

  // Normalize key by stripping item prefixes
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
      'cyber_neon_violet',
      'gameboy_monochrome',
      'pine_forest_moss',
      'ember_glow_amber',
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
        {/* Frog Eyes Outlines & 5-Tone Eye Sockets */}
        <rect x="4" y="3" width="5" height="5" fill={pal.outline} />
        <rect x="15" y="3" width="5" height="5" fill={pal.outline} />
        <rect x="5" y="3" width="3" height="1" fill={pal.highlight || '#86EFAC'} />
        <rect x="16" y="3" width="3" height="1" fill={pal.highlight || '#86EFAC'} />
        <rect x="5" y="4" width="3" height="3" fill={pal.main} />
        <rect x="16" y="4" width="3" height="3" fill={pal.main} />
        <rect x="5" y="6" width="3" height="1" fill={pal.dark} />
        <rect x="16" y="6" width="3" height="1" fill={pal.dark} />

        {/* Head Main with Forehead Dappled Highlight */}
        <rect x="3" y="7" width="18" height="13" fill={pal.main} />
        <rect x="8" y="7" width="8" height="2" fill={pal.highlight || '#86EFAC'} />
        <rect x="2" y="8" width="1" height="11" fill={pal.outline} />
        <rect x="21" y="8" width="1" height="11" fill={pal.outline} />
        <rect x="3" y="9" width="1" height="10" fill={pal.dark} />
        <rect x="20" y="9" width="1" height="10" fill={pal.dark} />
        <rect x="4" y="20" width="16" height="1" fill={pal.outline} />
        <rect x="4" y="19" width="16" height="1" fill={pal.deep || '#365314'} />

        {/* 3-Tone Cream Belly */}
        <rect x="7" y="12" width="10" height="7" fill={pal.belly} />
        <rect x="8" y="11" width="8" height="2" fill={pal.belly} />
        <rect x="7" y="17" width="10" height="2" fill={pal.bellyShadow || '#FDE68A'} />

        {/* Two-Tone Rosy Cheeks */}
        <rect x="4" y="11" width="3" height="2" fill={pal.cheeks} opacity="0.85" />
        <rect x="5" y="11" width="1" height="1" fill={pal.cheeksCore || '#FB7185'} />
        <rect x="17" y="11" width="3" height="2" fill={pal.cheeks} opacity="0.85" />
        <rect x="18" y="11" width="1" height="1" fill={pal.cheeksCore || '#FB7185'} />

        {/* Glossy Eyes with Specular Sparkle */}
        <rect x="6" y="5" width="2" height="2" fill={pal.eyePupil || '#0F172A'} />
        <rect x="6" y="5" width="1" height="1" fill="#FFFFFF" />
        <rect x="17" y="5" width="2" height="2" fill={pal.eyePupil || '#0F172A'} />
        <rect x="17" y="5" width="1" height="1" fill="#FFFFFF" />

        {/* Cute Smile */}
        <rect x="10" y="12" width="4" height="1" fill={pal.outline} />
        <rect x="9" y="11" width="1" height="1" fill={pal.outline} />
        <rect x="14" y="11" width="1" height="1" fill={pal.outline} />
      </svg>
    );
  }

  // -------------------------------------------------------------
  // 2. FACE ACCESSORIES & GLASSES HELPER SILHOUETTE
  // Render accessory on a soft miniature frog face silhouette
  // -------------------------------------------------------------
  const renderAccessoryWithFrogFace = (children: React.ReactNode) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
      {/* Frog Silhouette Background */}
      <rect x="5" y="4" width="4" height="4" fill="#5F7A61" opacity="0.35" />
      <rect x="15" y="4" width="4" height="4" fill="#5F7A61" opacity="0.35" />
      <rect x="6" y="5" width="2" height="2" fill="#2D3A20" opacity="0.4" />
      <rect x="16" y="5" width="2" height="2" fill="#2D3A20" opacity="0.4" />
      <rect x="4" y="7" width="16" height="13" fill="#75A65A" opacity="0.3" />
      <rect x="7" y="13" width="10" height="7" fill="#FEF9C3" opacity="0.35" />
      <rect x="10" y="12" width="4" height="1" fill="#2D3A20" opacity="0.4" />
      {/* Accessory Content */}
      {children}
    </svg>
  );

  // -------------------------------------------------------------
  // 3. ITEM SWITCH (100% PURE CRISP PIXEL ART RECTANGLES)
  // -------------------------------------------------------------
  switch (key) {
    // -----------------------------------------------------------
    // A. HATS
    // -----------------------------------------------------------
    case 'none':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="6" y="6" width="12" height="12" fill="#F1F5F9" />
          <rect x="7" y="7" width="10" height="10" fill="#FFFFFF" />
          <rect x="9" y="9" width="6" height="6" fill="#CBD5E1" />
          <rect x="11" y="11" width="2" height="2" fill="#94A3B8" />
        </svg>
      );

    case 'ranger_safari_hat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Safari Hat Crown */}
          <rect x="6" y="6" width="12" height="6" fill="#4B5320" />
          <rect x="7" y="5" width="10" height="2" fill="#5F6B28" />
          {/* Dark Leather Hatband */}
          <rect x="6" y="11" width="12" height="2" fill="#2E1C0C" />
          {/* Pine / Forest Emblem Pin */}
          <rect x="11" y="9" width="2" height="3" fill="#D4AF37" />
          {/* Wide Safari Brim */}
          <rect x="2" y="12" width="20" height="3" fill="#4B5320" />
          <rect x="3" y="13" width="18" height="1" fill="#6B7830" />
          {/* Hanging Chin Cord Loops */}
          <rect x="4" y="15" width="1" height="4" fill="#D97706" />
          <rect x="19" y="15" width="1" height="4" fill="#D97706" />
          <rect x="5" y="18" width="14" height="1" fill="#D97706" />
        </svg>
      );

    case 'marshmallow_beanie':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Warm Mustard Yellow Beanie Crown */}
          <rect x="5" y="5" width="14" height="9" fill="#D97706" />
          <rect x="7" y="4" width="10" height="2" fill="#F59E0B" />
          {/* Ribbed Folded Brim */}
          <rect x="4" y="13" width="16" height="4" fill="#B45309" />
          <rect x="5" y="14" width="14" height="2" fill="#D97706" />
          {/* Roasted Marshmallow Patch on Front */}
          <rect x="9" y="8" width="6" height="4" fill="#FEF3C7" />
          <rect x="10" y="7" width="4" height="2" fill="#D97706" />
          <rect x="10" y="9" width="2" height="1" fill="#78350F" />
          {/* Mini Skewer Stick */}
          <rect x="12" y="6" width="1" height="6" fill="#92400E" />
        </svg>
      );

    case 'scout_headlamp':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Forest Camo Elastic Headband */}
          <rect x="2" y="9" width="20" height="4" fill="#3F6212" />
          <rect x="5" y="10" width="3" height="2" fill="#65A30D" />
          <rect x="12" y="10" width="4" height="2" fill="#1E293B" />
          <rect x="17" y="10" width="3" height="2" fill="#65A30D" />
          {/* Central Powerful LED Headlamp Housing */}
          <rect x="8" y="7" width="8" height="7" fill="#0F172A" />
          <rect x="9" y="8" width="6" height="5" fill="#38BDF8" />
          <rect x="10" y="9" width="4" height="3" fill="#FFFFFF" />
          {/* Glowing Light Beam Sparks */}
          <rect x="11" y="4" width="2" height="2" fill="#FDE047" />
        </svg>
      );

    case 'arcade_joystick_cap':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Black Snapback Cap Crown */}
          <rect x="5" y="7" width="14" height="6" fill="#18181B" />
          <rect x="6" y="6" width="12" height="2" fill="#27272A" />
          {/* Flat Visor Bill */}
          <rect x="2" y="12" width="20" height="2" fill="#09090B" />
          <rect x="3" y="13" width="18" height="1" fill="#18181B" />
          {/* Embroidered Joystick & Red Ball on Front */}
          <rect x="11" y="8" width="2" height="3" fill="#71717A" />
          <rect x="10" y="7" width="4" height="2" fill="#EF4444" />
          {/* Blue Button Accent */}
          <rect x="15" y="9" width="2" height="2" fill="#3B82F6" />
        </svg>
      );

    case 'pixel_vr_visor':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Dark VR Visor Body */}
          <rect x="3" y="7" width="18" height="9" fill="#0F172A" />
          <rect x="2" y="8" width="20" height="7" fill="#1E293B" />
          {/* Glowing Animated Visor Glass */}
          <rect x="4" y="9" width="16" height="5" fill="#06B6D4" />
          <rect x="6" y="10" width="12" height="2" fill="#67E8F9" />
          <rect x="12" y="10" width="4" height="2" fill="#EC4899" />
          {/* Side Head Straps */}
          <rect x="2" y="10" width="2" height="3" fill="#475569" />
          <rect x="20" y="10" width="2" height="3" fill="#475569" />
          <rect x="10" y="6" width="4" height="2" fill="#334155" />
        </svg>
      );

    case 'retro_gameboy_beanie':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Grey Knit Beanie Body */}
          <rect x="5" y="5" width="14" height="10" fill="#94A3B8" />
          <rect x="7" y="4" width="10" height="2" fill="#CBD5E1" />
          {/* Folded Beanie Rim */}
          <rect x="4" y="13" width="16" height="3" fill="#64748B" />
          {/* Mini Handheld Screen & Buttons on Front */}
          <rect x="7" y="7" width="5" height="4" fill="#8BAC0F" />
          <rect x="8" y="8" width="3" height="2" fill="#0F380F" />
          <rect x="14" y="8" width="2" height="2" fill="#18181B" />
          <rect x="16" y="7" width="2" height="2" fill="#BE123C" />
          <rect x="15" y="9" width="2" height="2" fill="#BE123C" />
        </svg>
      );

    case 'konbini_staff_visor':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Emerald Green Visor Crown & Brim */}
          <rect x="3" y="10" width="18" height="3" fill="#047857" />
          <rect x="4" y="11" width="16" height="2" fill="#10B981" />
          <rect x="1" y="13" width="22" height="2" fill="#047857" />
          <rect x="2" y="13" width="20" height="1" fill="#34D399" />
          <rect x="1" y="15" width="22" height="1" fill="#064E3B" />
          {/* White & Orange Logo Emblem */}
          <rect x="10" y="9" width="4" height="3" fill="#FFFFFF" />
          <rect x="11" y="10" width="2" height="1" fill="#EA580C" />
        </svg>
      );

    case 'shopper_bucket_hat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Midnight Purple Bucket Hat Top */}
          <rect x="6" y="5" width="12" height="2" fill="#4C1D95" />
          <rect x="5" y="7" width="14" height="6" fill="#6D28D9" />
          <rect x="6" y="7" width="12" height="5" fill="#7C3AED" />
          {/* Lavender Band */}
          <rect x="5" y="11" width="14" height="2" fill="#A78BFA" />
          <rect x="11" y="11" width="2" height="2" fill="#FACC15" />
          {/* Downward Slanted Brim */}
          <rect x="2" y="13" width="20" height="3" fill="#5B21B6" />
          <rect x="3" y="14" width="18" height="1" fill="#7C3AED" />
          <rect x="2" y="16" width="20" height="1" fill="#3B0764" />
        </svg>
      );

    case 'onigiri_headband':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Headband Base */}
          <rect x="3" y="15" width="18" height="2" fill="#78350F" />
          <rect x="4" y="15" width="16" height="1" fill="#D97706" />
          {/* Rice Triangle (Stepped Pixel Rectangles) */}
          <rect x="11" y="4" width="2" height="2" fill="#1E293B" />
          <rect x="9" y="6" width="6" height="2" fill="#1E293B" />
          <rect x="7" y="8" width="10" height="2" fill="#1E293B" />
          <rect x="6" y="10" width="12" height="5" fill="#1E293B" />
          {/* Rice Fill */}
          <rect x="11" y="5" width="2" height="1" fill="#FFFFFF" />
          <rect x="10" y="6" width="4" height="2" fill="#FFFFFF" />
          <rect x="8" y="8" width="8" height="2" fill="#FFFFFF" />
          <rect x="7" y="10" width="10" height="4" fill="#FFFFFF" />
          {/* Seaweed Nori Wrap */}
          <rect x="9" y="11" width="6" height="3" fill="#0F172A" />
          {/* Pickled Plum Umeboshi Center */}
          <rect x="11" y="8" width="2" height="2" fill="#DC2626" />
        </svg>
      );

    case 'red_riding_hood':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Crimson Hood Dome */}
          <rect x="6" y="3" width="12" height="2" fill="#991B1B" />
          <rect x="4" y="5" width="16" height="9" fill="#B91C1C" />
          <rect x="5" y="5" width="14" height="8" fill="#DC2626" />
          <rect x="6" y="6" width="4" height="3" fill="#EF4444" />
          {/* White Frill Trim */}
          <rect x="3" y="13" width="18" height="2" fill="#FFFFFF" />
          <rect x="4" y="13" width="2" height="1" fill="#FCA5A5" />
          <rect x="8" y="13" width="2" height="1" fill="#FCA5A5" />
          <rect x="14" y="13" width="2" height="1" fill="#FCA5A5" />
          <rect x="18" y="13" width="2" height="1" fill="#FCA5A5" />
          {/* Front Tied Knot Ribbon */}
          <rect x="10" y="15" width="4" height="2" fill="#991B1B" />
          <rect x="8" y="17" width="3" height="4" fill="#DC2626" />
          <rect x="13" y="17" width="3" height="4" fill="#DC2626" />
        </svg>
      );

    case 'wolf_ears_hood':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Left Wolf Ear */}
          <rect x="4" y="2" width="4" height="2" fill="#1E293B" />
          <rect x="3" y="4" width="6" height="4" fill="#334155" />
          <rect x="4" y="4" width="3" height="3" fill="#F472B6" />
          {/* Right Wolf Ear */}
          <rect x="16" y="2" width="4" height="2" fill="#1E293B" />
          <rect x="15" y="4" width="6" height="4" fill="#334155" />
          <rect x="17" y="4" width="3" height="3" fill="#F472B6" />
          {/* Furry Hood Base */}
          <rect x="4" y="8" width="16" height="6" fill="#1E293B" />
          <rect x="5" y="9" width="14" height="4" fill="#475569" />
          <rect x="2" y="13" width="20" height="3" fill="#64748B" />
          <rect x="3" y="15" width="18" height="2" fill="#1E293B" />
        </svg>
      );

    case 'granny_nightcap':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Puffy White Sleeping Cap */}
          <rect x="6" y="4" width="12" height="3" fill="#E2E8F0" />
          <rect x="4" y="7" width="16" height="7" fill="#F8FAFC" />
          <rect x="6" y="6" width="12" height="6" fill="#FFFFFF" />
          {/* Ruffled Lace Edge */}
          <rect x="2" y="13" width="20" height="3" fill="#E2E8F0" />
          <rect x="3" y="13" width="3" height="2" fill="#FFFFFF" />
          <rect x="7" y="13" width="3" height="2" fill="#FFFFFF" />
          <rect x="11" y="13" width="3" height="2" fill="#FFFFFF" />
          <rect x="15" y="13" width="3" height="2" fill="#FFFFFF" />
          <rect x="19" y="13" width="2" height="2" fill="#FFFFFF" />
          {/* Pink Ribbon Bow */}
          <rect x="10" y="15" width="4" height="2" fill="#F472B6" />
          <rect x="9" y="17" width="2" height="3" fill="#EC4899" />
          <rect x="13" y="17" width="2" height="3" fill="#EC4899" />
        </svg>
      );

    case 'sushi_salmon':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Rice Base */}
          <rect x="3" y="12" width="18" height="6" fill="#1E293B" />
          <rect x="4" y="13" width="16" height="4" fill="#FFFFFF" />
          {/* Salmon Sashimi Slab */}
          <rect x="2" y="6" width="20" height="7" fill="#9A3412" />
          <rect x="3" y="7" width="18" height="5" fill="#FB923C" />
          <rect x="3" y="7" width="18" height="1" fill="#FED7AA" />
          {/* White Marbling Stripes */}
          <rect x="6" y="8" width="1" height="4" fill="#FFFFFF" opacity="0.9" />
          <rect x="10" y="8" width="1" height="4" fill="#FFFFFF" opacity="0.9" />
          <rect x="14" y="8" width="1" height="4" fill="#FFFFFF" opacity="0.9" />
          <rect x="18" y="8" width="1" height="4" fill="#FFFFFF" opacity="0.9" />
          {/* Dark Nori Band */}
          <rect x="10" y="6" width="4" height="12" fill="#0F172A" />
        </svg>
      );

    case 'sushi_maguro':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Rice Base */}
          <rect x="3" y="12" width="18" height="6" fill="#1E293B" />
          <rect x="4" y="13" width="16" height="4" fill="#FFFFFF" />
          {/* Ruby Tuna Slab */}
          <rect x="2" y="6" width="20" height="7" fill="#881337" />
          <rect x="3" y="7" width="18" height="5" fill="#BE123C" />
          <rect x="4" y="7" width="16" height="2" fill="#E11D48" />
          <rect x="5" y="8" width="6" height="1" fill="#FDA4AF" />
          {/* Nori Band */}
          <rect x="10" y="6" width="4" height="12" fill="#0F172A" />
        </svg>
      );

    case 'sushi_ebi':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Rice Base */}
          <rect x="3" y="12" width="18" height="6" fill="#1E293B" />
          <rect x="4" y="13" width="16" height="4" fill="#FFFFFF" />
          {/* Butterfly Cut Prawn */}
          <rect x="3" y="7" width="15" height="6" fill="#C2410C" />
          <rect x="4" y="8" width="13" height="4" fill="#EA580C" />
          <rect x="4" y="8" width="13" height="1" fill="#FED7AA" />
          <rect x="7" y="8" width="2" height="4" fill="#FFFFFF" />
          <rect x="12" y="8" width="2" height="4" fill="#FFFFFF" />
          {/* Split Tail Fins */}
          <rect x="17" y="5" width="4" height="3" fill="#DC2626" />
          <rect x="17" y="9" width="4" height="3" fill="#DC2626" />
          {/* Nori Wrap */}
          <rect x="9" y="7" width="3" height="11" fill="#0F172A" />
        </svg>
      );

    case 'sushi_chef_headband':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Red Twisted Headband */}
          <rect x="2" y="10" width="20" height="4" fill="#991B1B" />
          <rect x="3" y="11" width="18" height="2" fill="#DC2626" />
          {/* White Kanji Emblem in Center */}
          <rect x="10" y="9" width="4" height="4" fill="#FFFFFF" />
          <rect x="11" y="10" width="2" height="2" fill="#DC2626" />
          {/* Side Ties */}
          <rect x="20" y="12" width="3" height="5" fill="#DC2626" />
          <rect x="18" y="14" width="2" height="4" fill="#991B1B" />
        </svg>
      );

    case 'lotus':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Deep Green Stem Base */}
          <rect x="11" y="2" width="2" height="3" fill="#14532D" />
          <rect x="12" y="1" width="1" height="2" fill="#166534" />
          {/* 4-Tone Water Lily Pad */}
          <rect x="2" y="11" width="20" height="2" fill="#14532D" />
          <rect x="3" y="9" width="18" height="3" fill="#15803D" />
          <rect x="4" y="8" width="16" height="3" fill="#22C55E" />
          <rect x="6" y="6" width="12" height="3" fill="#4ADE80" />
          <rect x="8" y="5" width="8" height="2" fill="#86EFAC" />
          {/* Water Lily Blossom */}
          <rect x="15" y="4" width="4" height="4" fill="#F472B6" />
          <rect x="16" y="3" width="2" height="2" fill="#FBCFE8" />
          <rect x="16" y="5" width="2" height="2" fill="#FDE047" />
          {/* Glistening Specular Dewdrop */}
          <rect x="6" y="8" width="2" height="2" fill="#E0F2FE" />
          <rect x="6" y="8" width="1" height="1" fill="#FFFFFF" />
        </svg>
      );

    case 'straw':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* 4-Tone Woven Wicker Crown */}
          <rect x="7" y="4" width="10" height="6" fill="#78350F" />
          <rect x="8" y="4" width="8" height="5" fill="#D97706" />
          <rect x="8" y="5" width="8" height="4" fill="#F59E0B" />
          <rect x="9" y="5" width="6" height="3" fill="#FDE68A" />
          {/* Cross-hatch Texture */}
          <rect x="9" y="6" width="1" height="1" fill="#78350F" />
          <rect x="13" y="6" width="1" height="1" fill="#78350F" />
          {/* Crimson Ribbon with Stitch Line */}
          <rect x="6" y="9" width="12" height="3" fill="#991B1B" />
          <rect x="7" y="9" width="10" height="1" fill="#EF4444" />
          {/* Wide Shaded Brim */}
          <rect x="2" y="12" width="20" height="4" fill="#78350F" />
          <rect x="3" y="12" width="18" height="3" fill="#D97706" />
          <rect x="4" y="12" width="16" height="1" fill="#FDE68A" />
        </svg>
      );

    case 'sakura':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Entwined Forest Vine Circlet */}
          <rect x="2" y="14" width="20" height="3" fill="#14532D" />
          <rect x="3" y="14" width="18" height="1" fill="#22C55E" />
          {/* Center Cherry Blossom */}
          <rect x="8" y="6" width="8" height="8" fill="#DB2777" />
          <rect x="9" y="7" width="6" height="6" fill="#F472B6" />
          <rect x="10" y="8" width="4" height="4" fill="#FBCFE8" />
          <rect x="11" y="9" width="2" height="2" fill="#FDE047" />
          <rect x="11" y="9" width="1" height="1" fill="#FFFFFF" />
          {/* Left Blossom */}
          <rect x="2" y="10" width="6" height="6" fill="#DB2777" />
          <rect x="3" y="11" width="4" height="4" fill="#F472B6" />
          <rect x="4" y="12" width="2" height="2" fill="#FBCFE8" />
          <rect x="4" y="12" width="1" height="1" fill="#FDE047" />
          {/* Right Blossom */}
          <rect x="16" y="10" width="6" height="6" fill="#DB2777" />
          <rect x="17" y="11" width="4" height="4" fill="#F472B6" />
          <rect x="18" y="12" width="2" height="2" fill="#FBCFE8" />
          <rect x="18" y="12" width="1" height="1" fill="#FDE047" />
          {/* Floating Petal Flurries */}
          <rect x="7" y="4" width="2" height="2" fill="#F472B6" />
          <rect x="15" y="4" width="2" height="2" fill="#F472B6" />
        </svg>
      );

    case 'wizard':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* 5-Tone Midnight Indigo Wizard Conical Hat */}
          <rect x="11" y="1" width="2" height="3" fill="#0F172A" />
          <rect x="11" y="2" width="2" height="2" fill="#312E81" />
          <rect x="10" y="4" width="4" height="3" fill="#1E1B4B" />
          <rect x="11" y="4" width="3" height="3" fill="#3730A3" />
          <rect x="9" y="7" width="6" height="4" fill="#1E1B4B" />
          <rect x="10" y="7" width="5" height="3" fill="#4338CA" />
          <rect x="7" y="11" width="10" height="3" fill="#1E1B4B" />
          <rect x="8" y="11" width="8" height="2" fill="#4F46E5" />
          {/* Glowing Golden Celestial Star */}
          <rect x="11" y="6" width="3" height="3" fill="#FACC15" />
          <rect x="12" y="5" width="1" height="5" fill="#FDE047" />
          <rect x="10" y="7" width="5" height="1" fill="#FDE047" />
          <rect x="12" y="7" width="1" height="1" fill="#FFFFFF" />
          {/* Golden Runed Hat Band */}
          <rect x="6" y="14" width="12" height="2" fill="#B45309" />
          <rect x="7" y="14" width="10" height="1" fill="#F59E0B" />
          <rect x="11" y="14" width="2" height="1" fill="#FEF08A" />
          {/* Wide Indigo Brim with Cast Shadow */}
          <rect x="2" y="16" width="20" height="4" fill="#0F172A" />
          <rect x="3" y="16" width="18" height="3" fill="#312E81" />
          <rect x="4" y="16" width="16" height="1" fill="#6366F1" />
        </svg>
      );

    case 'bandana':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Crimson Fabric Wrap with Fold Shading */}
          <rect x="3" y="8" width="18" height="6" fill="#7F1D1D" />
          <rect x="4" y="8" width="16" height="5" fill="#B91C1C" />
          <rect x="5" y="9" width="14" height="3" fill="#DC2626" />
          <rect x="6" y="9" width="12" height="1" fill="#EF4444" />
          {/* Paisley / Polka Pattern Dots */}
          <rect x="7" y="10" width="2" height="1" fill="#FFFFFF" />
          <rect x="11" y="11" width="2" height="1" fill="#FFFFFF" />
          <rect x="15" y="10" width="2" height="1" fill="#FFFFFF" />
          {/* Tied Ribbon Knot on Right */}
          <rect x="18" y="12" width="4" height="6" fill="#7F1D1D" />
          <rect x="18" y="13" width="3" height="4" fill="#DC2626" />
          <rect x="19" y="14" width="2" height="2" fill="#EF4444" />
        </svg>
      );

    case 'beanie':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Fluffy Snow Pom-Pom */}
          <rect x="10" y="2" width="4" height="4" fill="#E2E8F0" />
          <rect x="11" y="2" width="2" height="2" fill="#FFFFFF" />
          {/* 4-Tone Crimson Wool Beanie Dome */}
          <rect x="5" y="6" width="14" height="9" fill="#7F1D1D" />
          <rect x="6" y="6" width="12" height="8" fill="#B91C1C" />
          <rect x="7" y="7" width="10" height="6" fill="#DC2626" />
          <rect x="8" y="7" width="8" height="4" fill="#EF4444" />
          {/* Ribbed Knit Stripes */}
          <rect x="8" y="7" width="1" height="6" fill="#991B1B" />
          <rect x="12" y="7" width="1" height="6" fill="#991B1B" />
          <rect x="15" y="7" width="1" height="6" fill="#991B1B" />
          {/* Folded Waffle Cuff */}
          <rect x="3" y="15" width="18" height="4" fill="#991B1B" />
          <rect x="4" y="15" width="16" height="3" fill="#F87171" />
          <rect x="5" y="15" width="14" height="1" fill="#FECACA" />
        </svg>
      );

    case 'chef':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Puffy Chef Toque Folds with Soft Shading */}
          <rect x="5" y="3" width="14" height="12" fill="#94A3B8" />
          <rect x="6" y="3" width="12" height="11" fill="#CBD5E1" />
          <rect x="7" y="4" width="10" height="9" fill="#F8FAFC" />
          <rect x="8" y="5" width="8" height="7" fill="#FFFFFF" />
          {/* Vertical Pleats */}
          <rect x="8" y="5" width="1" height="7" fill="#E2E8F0" />
          <rect x="12" y="4" width="1" height="8" fill="#E2E8F0" />
          <rect x="15" y="5" width="1" height="7" fill="#E2E8F0" />
          {/* Stiff Starched Hatband */}
          <rect x="4" y="15" width="16" height="4" fill="#64748B" />
          <rect x="5" y="15" width="14" height="3" fill="#E2E8F0" />
          <rect x="6" y="15" width="12" height="1" fill="#FFFFFF" />
        </svg>
      );

    case 'crown':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* 5-Tone Gilded Gold Crown Spikes with Gemstones */}
          <rect x="3" y="6" width="18" height="10" fill="#78350F" />
          {/* Left Spike */}
          <rect x="4" y="7" width="4" height="7" fill="#D97706" />
          <rect x="5" y="8" width="2" height="5" fill="#FACC15" />
          <rect x="5" y="8" width="1" height="1" fill="#FEF08A" />
          <rect x="5" y="10" width="2" height="2" fill="#DC2626" />
          <rect x="5" y="10" width="1" height="1" fill="#FFFFFF" />
          {/* Center Tall Spike */}
          <rect x="10" y="4" width="4" height="10" fill="#D97706" />
          <rect x="11" y="5" width="2" height="8" fill="#FACC15" />
          <rect x="11" y="5" width="1" height="1" fill="#FEF08A" />
          <rect x="11" y="8" width="2" height="2" fill="#2563EB" />
          <rect x="11" y="8" width="1" height="1" fill="#FFFFFF" />
          {/* Right Spike */}
          <rect x="16" y="7" width="4" height="7" fill="#D97706" />
          <rect x="17" y="8" width="2" height="5" fill="#FACC15" />
          <rect x="17" y="8" width="1" height="1" fill="#FEF08A" />
          <rect x="17" y="10" width="2" height="2" fill="#16A34A" />
          <rect x="17" y="10" width="1" height="1" fill="#FFFFFF" />
          {/* Crown Circlet Base */}
          <rect x="2" y="15" width="20" height="4" fill="#78350F" />
          <rect x="3" y="15" width="18" height="3" fill="#F59E0B" />
          <rect x="4" y="15" width="16" height="1" fill="#FEF08A" />
        </svg>
      );

    case 'beret':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Stalk / Tab */}
          <rect x="11" y="3" width="2" height="3" fill="#450A0A" />
          {/* 4-Tone Parisian Burgundy Wool Beret */}
          <rect x="2" y="6" width="20" height="9" fill="#450A0A" />
          <rect x="3" y="6" width="18" height="8" fill="#881337" />
          <rect x="4" y="7" width="16" height="6" fill="#BE123C" />
          <rect x="5" y="7" width="12" height="3" fill="#FB7185" />
          {/* Slanted Side Fold Shading */}
          <rect x="2" y="11" width="4" height="4" fill="#450A0A" />
          <rect x="4" y="14" width="16" height="2" fill="#450A0A" />
        </svg>
      );

    case 'flower':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* 5-Tone Radiant Sunlight Plumeria Blossom */}
          <rect x="4" y="4" width="16" height="16" fill="#B45309" />
          <rect x="5" y="5" width="14" height="14" fill="#FDE047" />
          <rect x="7" y="7" width="10" height="10" fill="#FEF08A" />
          {/* Petal Highlights */}
          <rect x="9" y="3" width="6" height="4" fill="#FFFFFF" />
          <rect x="3" y="9" width="4" height="6" fill="#FFFFFF" />
          <rect x="17" y="9" width="4" height="6" fill="#FFFFFF" />
          <rect x="9" y="17" width="6" height="4" fill="#FFFFFF" />
          {/* Warm Amber Center */}
          <rect x="9" y="9" width="6" height="6" fill="#EA580C" />
          <rect x="10" y="10" width="4" height="4" fill="#DC2626" />
          <rect x="11" y="11" width="2" height="2" fill="#FEF08A" />
        </svg>
      );

    case 'headphone':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Cushioned Top Headband Arch */}
          <rect x="4" y="3" width="16" height="4" fill="#0F172A" />
          <rect x="5" y="3" width="14" height="3" fill="#1E293B" />
          <rect x="6" y="3" width="12" height="1" fill="#475569" />
          {/* Metal Adjustable Sliders */}
          <rect x="3" y="7" width="2" height="4" fill="#94A3B8" />
          <rect x="19" y="7" width="2" height="4" fill="#94A3B8" />
          {/* Left Earcup with Soft Blue Velvet Cushion */}
          <rect x="2" y="11" width="5" height="9" fill="#0F172A" />
          <rect x="3" y="12" width="3" height="7" fill="#2563EB" />
          <rect x="4" y="13" width="2" height="5" fill="#60A5FA" />
          <rect x="4" y="14" width="1" height="2" fill="#FFFFFF" />
          {/* Right Earcup with Soft Blue Velvet Cushion */}
          <rect x="17" y="11" width="5" height="9" fill="#0F172A" />
          <rect x="18" y="12" width="3" height="7" fill="#2563EB" />
          <rect x="18" y="13" width="2" height="5" fill="#60A5FA" />
          <rect x="19" y="14" width="1" height="2" fill="#FFFFFF" />
        </svg>
      );

    case 'detective':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Crown of Cap with Houndstooth Tone */}
          <rect x="5" y="5" width="14" height="10" fill="#451A03" />
          <rect x="6" y="6" width="12" height="8" fill="#78350F" />
          <rect x="7" y="6" width="10" height="6" fill="#92400E" />
          <rect x="8" y="7" width="8" height="4" fill="#B45309" />
          {/* Center Button on Crown */}
          <rect x="11" y="4" width="2" height="2" fill="#451A03" />
          {/* Dual Visor Peaks (Front & Back) */}
          <rect x="2" y="14" width="20" height="4" fill="#451A03" />
          <rect x="3" y="14" width="18" height="3" fill="#78350F" />
          <rect x="4" y="14" width="16" height="1" fill="#D97706" />
          {/* Ear Flap Ribbon Tied on Top */}
          <rect x="10" y="5" width="4" height="2" fill="#18181B" />
        </svg>
      );

    case 'samurai':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Golden Crescent Maedate Crest */}
          <rect x="11" y="1" width="2" height="5" fill="#78350F" />
          <rect x="11" y="1" width="2" height="4" fill="#FACC15" />
          <rect x="7" y="3" width="10" height="3" fill="#78350F" />
          <rect x="8" y="3" width="8" height="2" fill="#FACC15" />
          <rect x="9" y="4" width="6" height="1" fill="#FEF08A" />
          <rect x="11" y="5" width="2" height="2" fill="#DC2626" />
          {/* Lacquered Steel Bowl (Hachi) */}
          <rect x="4" y="7" width="16" height="7" fill="#09090B" />
          <rect x="5" y="7" width="14" height="6" fill="#18181B" />
          <rect x="6" y="8" width="12" height="3" fill="#3F3F46" />
          {/* Shikoro Neck Guard Flaps */}
          <rect x="2" y="14" width="20" height="4" fill="#7F1D1D" />
          <rect x="3" y="14" width="18" height="3" fill="#DC2626" />
          <rect x="4" y="14" width="16" height="1" fill="#FCA5A5" />
          {/* Golden Corner Rivets */}
          <rect x="3" y="15" width="2" height="2" fill="#FACC15" />
          <rect x="19" y="15" width="2" height="2" fill="#FACC15" />
        </svg>
      );

    // -----------------------------------------------------------
    // B. OUTFITS & COSTUMES (Cozy 16-bit / 32-bit Pixel Art)
    // -----------------------------------------------------------
    case 'field_scout_parka':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Heavy Forest Canvas Shell with 5-tone depth */}
          <rect x="3" y="5" width="18" height="15" fill="#0F260C" />
          <rect x="4" y="6" width="16" height="13" fill="#14532D" />
          <rect x="5" y="7" width="14" height="11" fill="#166534" />
          <rect x="6" y="8" width="12" height="9" fill="#15803D" />
          {/* Khaki / Tan Sherpa Storm Collar */}
          <rect x="6" y="4" width="12" height="3" fill="#78350F" />
          <rect x="7" y="5" width="10" height="2" fill="#B45309" />
          <rect x="8" y="5" width="8" height="1" fill="#FEF3C7" />
          {/* Center Zipper & Metal Storm Placket */}
          <rect x="11" y="6" width="2" height="12" fill="#0F172A" />
          <rect x="11" y="7" width="1" height="10" fill="#FACC15" />
          {/* Merit Badges on Chest (Orange Campfire & Cyan Peak) */}
          <rect x="6" y="9" width="3" height="3" fill="#78350F" />
          <rect x="6" y="9" width="2" height="2" fill="#FEF08A" />
          <rect x="7" y="10" width="1" height="1" fill="#F59E0B" />
          <rect x="15" y="9" width="3" height="3" fill="#1E293B" />
          <rect x="16" y="9" width="2" height="2" fill="#38BDF8" />
          {/* Flap Cargo Pockets */}
          <rect x="5" y="14" width="4" height="4" fill="#0F260C" />
          <rect x="5" y="14" width="4" height="1" fill="#14532D" />
          <rect x="15" y="14" width="4" height="4" fill="#0F260C" />
          <rect x="15" y="14" width="4" height="1" fill="#14532D" />
        </svg>
      );

    case 'flannel_camp_vest':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Buffalo Plaid Red & Black Checked Long Sleeves */}
          <rect x="2" y="6" width="4" height="11" fill="#7F1D1D" />
          <rect x="3" y="6" width="3" height="10" fill="#DC2626" />
          <rect x="2" y="7" width="4" height="3" fill="#18181B" />
          <rect x="2" y="12" width="4" height="3" fill="#18181B" />
          <rect x="18" y="6" width="4" height="11" fill="#7F1D1D" />
          <rect x="18" y="6" width="3" height="10" fill="#DC2626" />
          <rect x="18" y="7" width="4" height="3" fill="#18181B" />
          <rect x="18" y="12" width="4" height="3" fill="#18181B" />
          {/* Puffy Tan/Chestnut Sherpa Camp Vest Body */}
          <rect x="5" y="5" width="14" height="14" fill="#451A03" />
          <rect x="6" y="6" width="12" height="12" fill="#78350F" />
          <rect x="7" y="7" width="10" height="10" fill="#B45309" />
          <rect x="8" y="7" width="8" height="9" fill="#D97706" />
          {/* Fluffy Warm Sherpa Fleece Collar */}
          <rect x="7" y="4" width="10" height="3" fill="#FEF3C7" />
          <rect x="8" y="5" width="8" height="2" fill="#FFFFFF" />
          {/* Heavy Brass Snap Buttons */}
          <rect x="11" y="8" width="2" height="2" fill="#78350F" />
          <rect x="11" y="8" width="2" height="1" fill="#FACC15" />
          <rect x="11" y="11" width="2" height="2" fill="#78350F" />
          <rect x="11" y="11" width="2" height="1" fill="#FACC15" />
          <rect x="11" y="14" width="2" height="2" fill="#78350F" />
          <rect x="11" y="14" width="2" height="1" fill="#FACC15" />
        </svg>
      );

    case 'cozy_sleeping_bag':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Snug Quilted Mummy Sleeping Bag Cocoon */}
          <rect x="3" y="4" width="18" height="17" fill="#0C4A6E" />
          <rect x="4" y="4" width="16" height="16" fill="#0369A1" />
          <rect x="5" y="5" width="14" height="14" fill="#0284C7" />
          <rect x="6" y="5" width="12" height="13" fill="#38BDF8" />
          {/* Drawstring Neck Collar with Golden Cord Toggle */}
          <rect x="5" y="3" width="14" height="3" fill="#075985" />
          <rect x="6" y="4" width="12" height="2" fill="#38BDF8" />
          <rect x="11" y="4" width="2" height="3" fill="#FACC15" />
          <rect x="11" y="4" width="1" height="1" fill="#FEF08A" />
          {/* Quilted Down Baffle Stitch Lines */}
          <rect x="4" y="8" width="16" height="1" fill="#075985" />
          <rect x="4" y="12" width="16" height="1" fill="#075985" />
          <rect x="4" y="16" width="16" height="1" fill="#075985" />
          {/* Cozy Tangerine Interior Flap Folded Over */}
          <rect x="7" y="6" width="10" height="3" fill="#C2410C" />
          <rect x="8" y="6" width="8" height="2" fill="#EA580C" />
          <rect x="9" y="7" width="6" height="1" fill="#FB923C" />
          {/* Embroidered Campfire Patch on Lower Baffle */}
          <rect x="7" y="10" width="3" height="2" fill="#FBBF24" />
        </svg>
      );

    case 'arcade_gamer_bomber':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Royal Purple Satin Body */}
          <rect x="4" y="5" width="16" height="14" fill="#3B0764" />
          <rect x="5" y="5" width="14" height="13" fill="#581C87" />
          <rect x="6" y="6" width="12" height="11" fill="#7E22CE" />
          <rect x="7" y="6" width="10" height="9" fill="#9333EA" />
          {/* Neon Cyan Raglan Sleeves */}
          <rect x="2" y="6" width="4" height="11" fill="#0891B2" />
          <rect x="3" y="7" width="3" height="9" fill="#06B6D4" />
          <rect x="4" y="7" width="1" height="7" fill="#22D3EE" />
          <rect x="18" y="6" width="4" height="11" fill="#0891B2" />
          <rect x="18" y="7" width="3" height="9" fill="#06B6D4" />
          <rect x="19" y="7" width="1" height="7" fill="#22D3EE" />
          {/* Heavy Golden Brass Zipper */}
          <rect x="11" y="5" width="2" height="13" fill="#78350F" />
          <rect x="11" y="6" width="2" height="11" fill="#FACC15" />
          <rect x="11" y="6" width="1" height="10" fill="#FEF08A" />
          {/* Embroidered Pixel Badges (8-Bit Heart & Star) */}
          <rect x="7" y="8" width="3" height="3" fill="#EC4899" />
          <rect x="8" y="9" width="1" height="1" fill="#FFFFFF" />
          <rect x="14" y="8" width="3" height="3" fill="#22D3EE" />
          <rect x="15" y="9" width="1" height="1" fill="#FFFFFF" />
          {/* Striped Ribbed Waistband */}
          <rect x="5" y="17" width="14" height="2" fill="#1E1B4B" />
          <rect x="6" y="17" width="12" height="1" fill="#FACC15" />
        </svg>
      );

    case 'pixel_hero_armor':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Royal Violet Cape Draped Behind Shoulders */}
          <rect x="3" y="5" width="18" height="14" fill="#3B0764" />
          <rect x="4" y="5" width="16" height="13" fill="#6B21A8" />
          <rect x="5" y="6" width="14" height="12" fill="#7C3AED" />
          {/* 5-Tone Polished Steel Breastplate */}
          <rect x="5" y="6" width="14" height="11" fill="#334155" />
          <rect x="6" y="6" width="12" height="10" fill="#475569" />
          <rect x="7" y="7" width="10" height="8" fill="#94A3B8" />
          <rect x="8" y="7" width="8" height="7" fill="#CBD5E1" />
          {/* Metallic Specular Glint */}
          <rect x="8" y="7" width="3" height="2" fill="#F8FAFC" />
          <rect x="8" y="7" width="1" height="1" fill="#FFFFFF" />
          {/* Golden Hero Crest on Chest */}
          <rect x="10" y="8" width="4" height="4" fill="#78350F" />
          <rect x="10" y="8" width="4" height="3" fill="#FACC15" />
          <rect x="11" y="7" width="2" height="6" fill="#FEF08A" />
          {/* Heavy Riveted Leather Belt with Gold Buckle */}
          <rect x="5" y="14" width="14" height="3" fill="#451A03" />
          <rect x="6" y="14" width="12" height="2" fill="#78350F" />
          <rect x="10" y="13" width="4" height="4" fill="#FACC15" />
          <rect x="11" y="14" width="2" height="2" fill="#78350F" />
        </svg>
      );

    case 'retro_esports_jersey':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Midnight Obsidian Athletic Mesh Body */}
          <rect x="4" y="5" width="16" height="14" fill="#020617" />
          <rect x="5" y="5" width="14" height="13" fill="#0F172A" />
          <rect x="6" y="6" width="12" height="11" fill="#1E293B" />
          <rect x="7" y="6" width="10" height="9" fill="#334155" />
          {/* Neon Cyan Racing Shoulder Stripes */}
          <rect x="3" y="6" width="3" height="12" fill="#0891B2" />
          <rect x="4" y="6" width="2" height="11" fill="#06B6D4" />
          <rect x="18" y="6" width="3" height="12" fill="#0891B2" />
          <rect x="18" y="6" width="2" height="11" fill="#06B6D4" />
          {/* Magenta Ribbed V-Neck Collar */}
          <rect x="8" y="5" width="8" height="2" fill="#BE123C" />
          <rect x="10" y="6" width="4" height="2" fill="#EC4899" />
          {/* Golden Varsity '88' Print on Chest with Drop Shadow */}
          <rect x="7" y="8" width="10" height="6" fill="#09090B" />
          <rect x="8" y="8" width="8" height="5" fill="#FACC15" />
          <rect x="9" y="8" width="6" height="1" fill="#FEF08A" />
          <rect x="10" y="9" width="4" height="3" fill="#0F172A" />
          <rect x="11" y="10" width="2" height="1" fill="#FACC15" />
        </svg>
      );

    case 'konbini_staff_uniform':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Two-Tone Signature Green Store Smock */}
          <rect x="4" y="5" width="16" height="14" fill="#064E3B" />
          <rect x="5" y="5" width="14" height="13" fill="#047857" />
          <rect x="6" y="6" width="12" height="11" fill="#059669" />
          <rect x="7" y="6" width="10" height="9" fill="#10B981" />
          {/* White Center Stripe & Crisp Collar */}
          <rect x="10" y="5" width="4" height="13" fill="#FFFFFF" />
          <rect x="11" y="6" width="2" height="12" fill="#F8FAFC" />
          {/* Orange Accent Collar Tips */}
          <rect x="7" y="5" width="3" height="2" fill="#EA580C" />
          <rect x="14" y="5" width="3" height="2" fill="#EA580C" />
          {/* Official Konbini Name Tag Badge with Clip */}
          <rect x="6" y="8" width="4" height="3" fill="#0F172A" />
          <rect x="6" y="8" width="4" height="2.5" fill="#FEF08A" />
          <rect x="7" y="9" width="2" height="1" fill="#1E293B" />
          {/* Front Pocket with Dual Pens (Red & Blue) */}
          <rect x="14" y="9" width="3" height="4" fill="#047857" />
          <rect x="14" y="7" width="1" height="3" fill="#DC2626" />
          <rect x="16" y="7" width="1" height="3" fill="#2563EB" />
          {/* Dark Charcoal Trousers */}
          <rect x="5" y="17" width="14" height="3" fill="#1E293B" />
          <rect x="11" y="17" width="2" height="3" fill="#0F172A" />
        </svg>
      );

    case 'shopper_cozy_sweatset':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* 5-Tone Muted Pastel Lilac Loungewear */}
          <rect x="3" y="5" width="18" height="14" fill="#3B0764" />
          <rect x="4" y="5" width="16" height="13" fill="#581C87" />
          <rect x="5" y="6" width="14" height="12" fill="#7C3AED" />
          <rect x="6" y="6" width="12" height="11" fill="#8B5CF6" />
          <rect x="7" y="7" width="10" height="9" fill="#A78BFA" />
          {/* Soft Ribbed Collar & White Woven Drawstrings */}
          <rect x="8" y="5" width="8" height="2" fill="#DDD6FE" />
          <rect x="9" y="7" width="1" height="4" fill="#FFFFFF" />
          <rect x="14" y="7" width="1" height="4" fill="#FFFFFF" />
          {/* Front Kangaroo Pocket with Depth */}
          <rect x="6" y="10" width="12" height="6" fill="#6B21A8" />
          <rect x="7" y="11" width="10" height="4" fill="#7C3AED" />
          <rect x="8" y="11" width="8" height="3" fill="#9333EA" />
          {/* Soft Lavender Sweatpants Hem */}
          <rect x="5" y="17" width="14" height="3" fill="#4C1D95" />
          <rect x="11" y="17" width="2" height="3" fill="#2E1065" />
        </svg>
      );

    case 'red_riding_dress':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Frilled Peasant Blouse */}
          <rect x="5" y="4" width="14" height="5" fill="#CBD5E1" />
          <rect x="6" y="4" width="12" height="4" fill="#F8FAFC" />
          <rect x="7" y="5" width="10" height="3" fill="#FFFFFF" />
          {/* Rich Mahogany Leather Corset with Gold Lacing */}
          <rect x="6" y="7" width="12" height="5" fill="#451A03" />
          <rect x="7" y="7" width="10" height="4" fill="#78350F" />
          <rect x="8" y="8" width="8" height="3" fill="#B45309" />
          <rect x="10" y="8" width="4" height="1" fill="#FACC15" />
          <rect x="10" y="10" width="4" height="1" fill="#FACC15" />
          {/* Flared Ruby Red Velvet Skirt */}
          <rect x="3" y="11" width="18" height="8" fill="#7F1D1D" />
          <rect x="4" y="11" width="16" height="7" fill="#991B1B" />
          <rect x="5" y="12" width="14" height="6" fill="#DC2626" />
          <rect x="6" y="12" width="12" height="5" fill="#EF4444" />
          {/* Delicate Scalloped White Lace Apron Overlay */}
          <rect x="8" y="11" width="8" height="6" fill="#E2E8F0" />
          <rect x="9" y="11" width="6" height="5" fill="#FFFFFF" />
          <rect x="8" y="16" width="8" height="1" fill="#F8FAFC" />
        </svg>
      );

    case 'wolf_fur_cloak':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Thick Layered Wolf Fur Collar across Shoulders */}
          <rect x="3" y="4" width="18" height="6" fill="#0F172A" />
          <rect x="4" y="4" width="16" height="5" fill="#1E293B" />
          <rect x="5" y="5" width="14" height="4" fill="#334155" />
          <rect x="6" y="5" width="12" height="3" fill="#475569" />
          <rect x="7" y="5" width="10" height="2" fill="#64748B" />
          {/* Carved Beast Fang Clasp */}
          <rect x="10" y="6" width="4" height="3" fill="#0F172A" />
          <rect x="11" y="6" width="2" height="3" fill="#E2E8F0" />
          <rect x="11" y="6" width="1" height="2" fill="#FFFFFF" />
          {/* Heavy Weathered Charcoal Fur Cloak Body */}
          <rect x="4" y="9" width="16" height="10" fill="#0F172A" />
          <rect x="5" y="9" width="14" height="9" fill="#1E293B" />
          <rect x="6" y="10" width="12" height="8" fill="#334155" />
          <rect x="8" y="10" width="8" height="6" fill="#475569" />
          {/* Stepped Jagged Fur Fringe Edges */}
          <rect x="5" y="18" width="3" height="2" fill="#0F172A" />
          <rect x="10" y="18" width="4" height="2" fill="#0F172A" />
          <rect x="16" y="18" width="3" height="2" fill="#0F172A" />
        </svg>
      );

    case 'hunter_woodsman':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Red & Black Buffalo Plaid Heavy Shirt */}
          <rect x="4" y="5" width="16" height="12" fill="#450A0A" />
          <rect x="5" y="5" width="14" height="11" fill="#7F1D1D" />
          <rect x="6" y="6" width="12" height="10" fill="#DC2626" />
          <rect x="7" y="6" width="10" height="9" fill="#EF4444" />
          {/* Plaid Grid Pattern */}
          <rect x="5" y="6" width="2" height="10" fill="#18181B" />
          <rect x="11" y="6" width="2" height="10" fill="#18181B" />
          <rect x="17" y="6" width="2" height="10" fill="#18181B" />
          <rect x="4" y="9" width="16" height="2" fill="#18181B" />
          {/* Heavy Leather Harness & Belt with Brass Buckle */}
          <rect x="4" y="13" width="16" height="3" fill="#451A03" />
          <rect x="5" y="13" width="14" height="2" fill="#78350F" />
          <rect x="10" y="12" width="4" height="4" fill="#CA8A04" />
          <rect x="11" y="13" width="2" height="2" fill="#FEF08A" />
          {/* Diagonal Leather Shoulder Strap */}
          <rect x="7" y="5" width="2" height="6" fill="#78350F" />
          {/* Sturdy Boots / Utility Pants Hem */}
          <rect x="5" y="17" width="14" height="3" fill="#1E293B" />
          <rect x="11" y="17" width="2" height="3" fill="#0F172A" />
        </svg>
      );

    case 'sushi_chef_happi':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Crisp Starched White Happi Body */}
          <rect x="4" y="5" width="16" height="13" fill="#64748B" />
          <rect x="5" y="5" width="14" height="12" fill="#CBD5E1" />
          <rect x="6" y="6" width="12" height="11" fill="#F8FAFC" />
          <rect x="7" y="6" width="10" height="10" fill="#FFFFFF" />
          {/* Deep Navy Blue Lapel Trims */}
          <rect x="5" y="5" width="3" height="12" fill="#172554" />
          <rect x="6" y="6" width="2" height="10" fill="#1E3A8A" />
          <rect x="16" y="5" width="3" height="12" fill="#172554" />
          <rect x="16" y="6" width="2" height="10" fill="#1E3A8A" />
          {/* Traditional Navy Hem Wave Pattern */}
          <rect x="5" y="15" width="14" height="2" fill="#1E3A8A" />
          <rect x="7" y="15" width="2" height="1" fill="#60A5FA" />
          <rect x="11" y="15" width="2" height="1" fill="#60A5FA" />
          <rect x="15" y="15" width="2" height="1" fill="#60A5FA" />
          {/* Crimson Chef Sash Obi with Front Knot */}
          <rect x="5" y="12" width="14" height="3" fill="#7F1D1D" />
          <rect x="6" y="12" width="12" height="2" fill="#DC2626" />
          <rect x="10" y="11" width="4" height="4" fill="#EF4444" />
          <rect x="11" y="12" width="2" height="2" fill="#991B1B" />
          {/* Dark Navy Trousers */}
          <rect x="5" y="17" width="14" height="3" fill="#0F172A" />
        </svg>
      );

    case 'sushi_kimono_waiter':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Dark Midnight Indigo Kimono Body */}
          <rect x="4" y="5" width="16" height="14" fill="#0F172A" />
          <rect x="5" y="5" width="14" height="13" fill="#1E1B4B" />
          <rect x="6" y="6" width="12" height="12" fill="#312E81" />
          <rect x="7" y="6" width="10" height="11" fill="#3730A3" />
          {/* Ivory Crossover Collar */}
          <rect x="9" y="5" width="6" height="3" fill="#FEF3C7" />
          <rect x="10" y="6" width="4" height="2" fill="#FDE68A" />
          {/* Traditional Tan Canvas Half-Apron (Maekake) */}
          <rect x="5" y="11" width="14" height="8" fill="#78350F" />
          <rect x="6" y="11" width="12" height="7" fill="#B45309" />
          <rect x="7" y="12" width="10" height="6" fill="#D97706" />
          <rect x="8" y="12" width="8" height="5" fill="#FEF3C7" />
          {/* Braided Rope Waist Cord & Knot */}
          <rect x="4" y="10" width="16" height="2" fill="#78350F" />
          <rect x="5" y="10" width="14" height="1" fill="#FDE68A" />
          <rect x="10" y="10" width="4" height="3" fill="#DC2626" />
        </svg>
      );

    case 'kimono':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Deep Royal Indigo Silk Robe Body */}
          <rect x="4" y="5" width="16" height="14" fill="#0F172A" />
          <rect x="5" y="5" width="14" height="13" fill="#1E3A8A" />
          <rect x="6" y="6" width="12" height="12" fill="#2563EB" />
          <rect x="7" y="6" width="10" height="11" fill="#3B82F6" />
          {/* Layered White/Ivory Crossover Inner Collar */}
          <rect x="9" y="5" width="6" height="4" fill="#FFFFFF" />
          <rect x="10" y="6" width="4" height="2" fill="#E2E8F0" />
          <rect x="11" y="7" width="2" height="2" fill="#CBD5E1" />
          {/* 4-Tone Gilded Gold Obi Sash */}
          <rect x="4" y="11" width="16" height="4" fill="#78350F" />
          <rect x="5" y="11" width="14" height="3" fill="#D97706" />
          <rect x="6" y="12" width="12" height="2" fill="#FACC15" />
          <rect x="8" y="12" width="8" height="1" fill="#FEF08A" />
          {/* Crimson Obi-jime Cord & Knot */}
          <rect x="5" y="13" width="14" height="1" fill="#991B1B" />
          <rect x="10" y="11" width="4" height="4" fill="#DC2626" />
          <rect x="11" y="12" width="2" height="2" fill="#EF4444" />
          {/* Gold Leaf Hem Accents */}
          <rect x="6" y="18" width="3" height="1" fill="#FDE047" />
          <rect x="15" y="18" width="3" height="1" fill="#FDE047" />
        </svg>
      );

    case 'raincoat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* 5-Tone Vibrant Sun Yellow Vinyl Body */}
          <rect x="4" y="5" width="16" height="14" fill="#713F12" />
          <rect x="5" y="5" width="14" height="13" fill="#CA8A04" />
          <rect x="6" y="6" width="12" height="12" fill="#EAB308" />
          <rect x="7" y="6" width="10" height="11" fill="#FACC15" />
          {/* High-Gloss Specular Shine Highlights on Vinyl */}
          <rect x="6" y="7" width="2" height="2" fill="#FEF08A" />
          <rect x="6" y="7" width="1" height="1" fill="#FFFFFF" />
          <rect x="16" y="7" width="2" height="2" fill="#FEF08A" />
          <rect x="17" y="7" width="1" height="1" fill="#FFFFFF" />
          {/* Folded Storm Collar */}
          <rect x="8" y="4" width="8" height="3" fill="#CA8A04" />
          <rect x="9" y="4" width="6" height="2" fill="#FACC15" />
          {/* Center Wind Placket & Horn Toggle Buttons */}
          <rect x="11" y="5" width="2" height="13" fill="#CA8A04" />
          <rect x="11" y="7" width="2" height="2" fill="#451A03" />
          <rect x="11" y="7" width="1" height="1" fill="#78350F" />
          <rect x="11" y="11" width="2" height="2" fill="#451A03" />
          <rect x="11" y="11" width="1" height="1" fill="#78350F" />
          <rect x="11" y="15" width="2" height="2" fill="#451A03" />
          <rect x="11" y="15" width="1" height="1" fill="#78350F" />
          {/* Lower Flap Pockets */}
          <rect x="6" y="13" width="3" height="3" fill="#A16207" />
          <rect x="6" y="13" width="3" height="1" fill="#713F12" />
          <rect x="15" y="13" width="3" height="3" fill="#A16207" />
          <rect x="15" y="13" width="3" height="1" fill="#713F12" />
        </svg>
      );

    case 'sweater':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* 5-Tone Terracotta/Amber Chunky Wool Body */}
          <rect x="4" y="5" width="16" height="14" fill="#431407" />
          <rect x="5" y="5" width="14" height="13" fill="#7C2D12" />
          <rect x="6" y="6" width="12" height="12" fill="#C2410C" />
          <rect x="7" y="6" width="10" height="11" fill="#EA580C" />
          {/* Chunky Ribbed Waffle Turtle Neck */}
          <rect x="8" y="4" width="8" height="3" fill="#7C2D12" />
          <rect x="9" y="4" width="6" height="2" fill="#F97316" />
          <rect x="10" y="4" width="1" height="2" fill="#7C2D12" />
          <rect x="13" y="4" width="1" height="2" fill="#7C2D12" />
          {/* Vertical Braided Cable-Knit Patterns */}
          <rect x="7" y="7" width="2" height="9" fill="#F97316" />
          <rect x="8" y="8" width="1" height="7" fill="#FDBA74" />
          <rect x="11" y="7" width="2" height="9" fill="#F97316" />
          <rect x="12" y="7" width="1" height="8" fill="#FDBA74" />
          <rect x="15" y="7" width="2" height="9" fill="#F97316" />
          <rect x="16" y="8" width="1" height="7" fill="#FDBA74" />
          {/* Chunky Folded Hem Ribbing */}
          <rect x="5" y="17" width="14" height="2" fill="#7C2D12" />
          <rect x="6" y="17" width="12" height="1" fill="#F97316" />
        </svg>
      );

    case 'ninja':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* 5-Tone Midnight Obsidian & Charcoal Gi Body */}
          <rect x="4" y="5" width="16" height="14" fill="#09090B" />
          <rect x="5" y="5" width="14" height="13" fill="#18181B" />
          <rect x="6" y="6" width="12" height="12" fill="#27272A" />
          <rect x="7" y="6" width="10" height="11" fill="#3F3F46" />
          {/* Crossed Wrapping Lapels with Shadows */}
          <rect x="8" y="5" width="8" height="4" fill="#18181B" />
          <rect x="9" y="6" width="6" height="2" fill="#27272A" />
          {/* Crimson Silk Sash Obi with Draping Knot */}
          <rect x="4" y="11" width="16" height="3" fill="#7F1D1D" />
          <rect x="5" y="11" width="14" height="2" fill="#DC2626" />
          <rect x="6" y="11" width="12" height="1" fill="#EF4444" />
          <rect x="14" y="13" width="3" height="5" fill="#7F1D1D" />
          <rect x="15" y="13" width="2" height="4" fill="#DC2626" />
          {/* Silver Shuriken Emblem Tucked in Sash */}
          <rect x="10" y="10" width="4" height="4" fill="#E2E8F0" />
          <rect x="11" y="11" width="2" height="2" fill="#09090B" />
          <rect x="11" y="9" width="2" height="1" fill="#FFFFFF" />
          <rect x="11" y="14" width="2" height="1" fill="#FFFFFF" />
        </svg>
      );

    case 'sailor':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Crisp Pure White Cotton Shirt with Soft Shading */}
          <rect x="4" y="5" width="16" height="14" fill="#64748B" />
          <rect x="5" y="5" width="14" height="13" fill="#CBD5E1" />
          <rect x="6" y="6" width="12" height="12" fill="#F8FAFC" />
          <rect x="7" y="6" width="10" height="11" fill="#FFFFFF" />
          {/* Deep Navy Blue Sailor Flap Collar */}
          <rect x="5" y="5" width="14" height="4" fill="#172554" />
          <rect x="6" y="5" width="12" height="3" fill="#1E3A8A" />
          <rect x="7" y="5" width="10" height="2" fill="#2563EB" />
          {/* Twin White Sailor Accent Stripes on Collar */}
          <rect x="6" y="7" width="12" height="1" fill="#FFFFFF" />
          {/* Crimson Silk Ribbon Bow Tie */}
          <rect x="10" y="7" width="4" height="4" fill="#7F1D1D" />
          <rect x="10" y="8" width="4" height="3" fill="#DC2626" />
          <rect x="11" y="8" width="2" height="2" fill="#F87171" />
          {/* Draping Ribbon Tails */}
          <rect x="9" y="10" width="2" height="4" fill="#DC2626" />
          <rect x="13" y="10" width="2" height="4" fill="#DC2626" />
          {/* Navy Blue Pleated Waistband */}
          <rect x="5" y="16" width="14" height="3" fill="#172554" />
          <rect x="6" y="16" width="12" height="2" fill="#1E3A8A" />
        </svg>
      );

    case 'apron':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Deep Forest Green Sturdy Canvas Bib Apron */}
          <rect x="6" y="5" width="12" height="14" fill="#0F260C" />
          <rect x="7" y="5" width="10" height="13" fill="#14532D" />
          <rect x="8" y="6" width="8" height="12" fill="#166534" />
          <rect x="9" y="6" width="6" height="11" fill="#15803D" />
          {/* Leather Cross-Back Straps with Brass Rivets */}
          <rect x="7" y="4" width="2" height="4" fill="#78350F" />
          <rect x="15" y="4" width="2" height="4" fill="#78350F" />
          <rect x="7" y="6" width="1" height="1" fill="#FACC15" />
          <rect x="16" y="6" width="1" height="1" fill="#FACC15" />
          {/* Large Split Artisan Pocket with Tools */}
          <rect x="8" y="11" width="8" height="6" fill="#78350F" />
          <rect x="9" y="12" width="6" height="4" fill="#B45309" />
          <rect x="11" y="11" width="2" height="5" fill="#78350F" />
          {/* Crafting Tools Peeking Out (Wooden Ruler & Paintbrush) */}
          <rect x="9" y="9" width="1" height="3" fill="#FDE047" />
          <rect x="13" y="8" width="2" height="3" fill="#CA8A04" />
          <rect x="13" y="8" width="2" height="1" fill="#3B82F6" />
        </svg>
      );

    case 'overalls':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* White Under-Tee */}
          <rect x="5" y="5" width="14" height="6" fill="#CBD5E1" />
          <rect x="6" y="6" width="12" height="4" fill="#FFFFFF" />
          {/* 5-Tone Stonewash Denim Dungaree Pants */}
          <rect x="4" y="10" width="16" height="10" fill="#172554" />
          <rect x="5" y="10" width="14" height="9" fill="#1E40AF" />
          <rect x="6" y="11" width="12" height="8" fill="#2563EB" />
          <rect x="7" y="11" width="10" height="7" fill="#3B82F6" />
          {/* Denim Bib & Center Chest Pocket */}
          <rect x="7" y="7" width="10" height="7" fill="#1E40AF" />
          <rect x="8" y="8" width="8" height="5" fill="#2563EB" />
          <rect x="9" y="10" width="6" height="3" fill="#1D4ED8" />
          {/* Heavy Denim Suspender Straps with Brass Buckles */}
          <rect x="6" y="6" width="2" height="5" fill="#1D4ED8" />
          <rect x="16" y="6" width="2" height="5" fill="#1D4ED8" />
          <rect x="6" y="8" width="2" height="2" fill="#FACC15" />
          <rect x="6" y="8" width="1" height="1" fill="#FEF08A" />
          <rect x="16" y="8" width="2" height="2" fill="#FACC15" />
          <rect x="16" y="8" width="1" height="1" fill="#FEF08A" />
          {/* Copper Rivets on Waist */}
          <rect x="5" y="12" width="1" height="1" fill="#F59E0B" />
          <rect x="18" y="12" width="1" height="1" fill="#F59E0B" />
        </svg>
      );

    case 'scarf':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Multi-Layered Plump Wool Scarf Wraps */}
          <rect x="3" y="6" width="18" height="7" fill="#450A0A" />
          <rect x="4" y="6" width="16" height="6" fill="#7F1D1D" />
          <rect x="5" y="7" width="14" height="5" fill="#991B1B" />
          <rect x="6" y="7" width="12" height="4" fill="#DC2626" />
          <rect x="7" y="7" width="10" height="3" fill="#EF4444" />
          <rect x="9" y="7" width="6" height="1" fill="#FCA5A5" />
          {/* Draping Ribbed Scarf Tail with Golden Fringe Tassels */}
          <rect x="13" y="11" width="6" height="9" fill="#450A0A" />
          <rect x="14" y="11" width="4" height="8" fill="#991B1B" />
          <rect x="14" y="12" width="3" height="7" fill="#DC2626" />
          <rect x="15" y="12" width="1" height="6" fill="#FCA5A5" />
          {/* Golden Yarn Fringe Tassels */}
          <rect x="13" y="19" width="1" height="2" fill="#FEF08A" />
          <rect x="15" y="19" width="1" height="2" fill="#FEF08A" />
          <rect x="17" y="19" width="1" height="2" fill="#FEF08A" />
        </svg>
      );

    case 'business':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Tailored Charcoal / Midnight Navy Blazer Body */}
          <rect x="4" y="5" width="16" height="14" fill="#020617" />
          <rect x="5" y="5" width="14" height="13" fill="#0F172A" />
          <rect x="6" y="6" width="12" height="12" fill="#1E293B" />
          <rect x="7" y="6" width="10" height="11" fill="#334155" />
          {/* Crisp White Shirt Collar & V-Opening */}
          <rect x="9" y="5" width="6" height="7" fill="#E2E8F0" />
          <rect x="10" y="5" width="4" height="6" fill="#FFFFFF" />
          {/* Ruby Red Silk Tie with Golden Tie Clip */}
          <rect x="11" y="6" width="2" height="8" fill="#991B1B" />
          <rect x="11" y="7" width="2" height="6" fill="#DC2626" />
          <rect x="11" y="9" width="3" height="1" fill="#FACC15" />
          {/* Breast Pocket with White Silk Pocket Square */}
          <rect x="6" y="9" width="3" height="1" fill="#0F172A" />
          <rect x="6" y="8" width="2" height="1" fill="#FFFFFF" />
          {/* Golden Cuff Buttons */}
          <rect x="5" y="15" width="1" height="2" fill="#FACC15" />
          <rect x="18" y="15" width="1" height="2" fill="#FACC15" />
        </svg>
      );

    case 'hoodie':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* 5-Tone Cozy Forest Emerald Fleece Body */}
          <rect x="3" y="5" width="18" height="14" fill="#064E3B" />
          <rect x="4" y="5" width="16" height="13" fill="#047857" />
          <rect x="5" y="6" width="14" height="12" fill="#059669" />
          <rect x="6" y="6" width="12" height="11" fill="#10B981" />
          <rect x="7" y="7" width="10" height="9" fill="#34D399" />
          {/* Slouchy Hood Collar Folds */}
          <rect x="5" y="4" width="4" height="4" fill="#047857" />
          <rect x="15" y="4" width="4" height="4" fill="#047857" />
          {/* White Woven Drawstrings with Golden Aglets */}
          <rect x="9" y="7" width="1" height="5" fill="#FFFFFF" />
          <rect x="9" y="12" width="1" height="1" fill="#FACC15" />
          <rect x="14" y="7" width="1" height="5" fill="#FFFFFF" />
          <rect x="14" y="12" width="1" height="1" fill="#FACC15" />
          {/* Roomy Kangaroo Pouch Pocket */}
          <rect x="6" y="10" width="12" height="6" fill="#047857" />
          <rect x="7" y="11" width="10" height="4" fill="#059669" />
          <rect x="8" y="11" width="8" height="3" fill="#10B981" />
          {/* Bottom Hem */}
          <rect x="5" y="17" width="14" height="2" fill="#064E3B" />
        </svg>
      );

    // -----------------------------------------------------------
    // C. FACE ACCESSORIES & GLASSES (Cozy 16-bit / 32-bit Pixel Art)
    // -----------------------------------------------------------
    case 'campfire_warm_glow':
      return renderAccessoryWithFrogFace(
        <>
          {/* 4-Tone Warm Campfire Cheeks */}
          <rect x="2" y="9" width="6" height="5" fill="#C2410C" opacity="0.65" />
          <rect x="3" y="10" width="5" height="4" fill="#EA580C" opacity="0.9" />
          <rect x="4" y="11" width="3" height="2" fill="#F97316" />
          <rect x="5" y="11" width="1" height="1" fill="#FDE047" />
          <rect x="16" y="9" width="6" height="5" fill="#C2410C" opacity="0.65" />
          <rect x="16" y="10" width="5" height="4" fill="#EA580C" opacity="0.9" />
          <rect x="17" y="11" width="3" height="2" fill="#F97316" />
          <rect x="18" y="11" width="1" height="1" fill="#FDE047" />
          {/* Floating Fire Ember & Sparkle Particles */}
          <rect x="4" y="6" width="2" height="2" fill="#FDE047" />
          <rect x="5" y="6" width="1" height="1" fill="#FFFFFF" />
          <rect x="18" y="5" width="2" height="2" fill="#FDE047" />
          <rect x="18" y="5" width="1" height="1" fill="#FFFFFF" />
          <rect x="11" y="3" width="2" height="2" fill="#F97316" />
          <rect x="2" y="12" width="1" height="1" fill="#F59E0B" />
          <rect x="21" y="10" width="1" height="1" fill="#EF4444" />
        </>
      );

    case 'explorer_binoculars':
      return renderAccessoryWithFrogFace(
        <>
          {/* Hanging Braided Leather Neck Strap */}
          <rect x="4" y="6" width="16" height="1" fill="#451A03" />
          <rect x="5" y="7" width="1" height="3" fill="#78350F" />
          <rect x="18" y="7" width="1" height="3" fill="#78350F" />
          {/* Dual Forest Green & Brass Binoculars Body */}
          <rect x="3" y="8" width="7" height="8" fill="#14532D" />
          <rect x="4" y="9" width="5" height="6" fill="#166534" />
          <rect x="14" y="8" width="7" height="8" fill="#14532D" />
          <rect x="15" y="9" width="5" height="6" fill="#166534" />
          {/* Knurled Brass Focus Adjustment Bridge */}
          <rect x="10" y="9" width="4" height="4" fill="#78350F" />
          <rect x="11" y="8" width="2" height="3" fill="#FACC15" />
          <rect x="11" y="9" width="2" height="1" fill="#FEF08A" />
          {/* Objective Lens Rims */}
          <rect x="3" y="15" width="7" height="1" fill="#CA8A04" />
          <rect x="14" y="15" width="7" height="1" fill="#CA8A04" />
          {/* Crystalline Glass Lens Reflections */}
          <rect x="4" y="10" width="5" height="4" fill="#0284C7" />
          <rect x="5" y="10" width="3" height="3" fill="#38BDF8" />
          <rect x="5" y="10" width="1" height="1" fill="#FFFFFF" />
          <rect x="15" y="10" width="5" height="4" fill="#0284C7" />
          <rect x="16" y="10" width="3" height="3" fill="#38BDF8" />
          <rect x="16" y="10" width="1" height="1" fill="#FFFFFF" />
        </>
      );

    case 'cyber_pixel_shades':
      return renderAccessoryWithFrogFace(
        <>
          {/* 5-Tone Stepped 8-Bit Obsidian Frames */}
          <rect x="2" y="8" width="9" height="3" fill="#09090B" />
          <rect x="3" y="11" width="7" height="3" fill="#09090B" />
          <rect x="13" y="8" width="9" height="3" fill="#09090B" />
          <rect x="14" y="11" width="7" height="3" fill="#09090B" />
          <rect x="10" y="9" width="4" height="2" fill="#09090B" />
          {/* White Specular Glare Staircase */}
          <rect x="3" y="9" width="2" height="1" fill="#FFFFFF" />
          <rect x="4" y="10" width="2" height="1" fill="#FFFFFF" />
          <rect x="14" y="9" width="2" height="1" fill="#FFFFFF" />
          <rect x="15" y="10" width="2" height="1" fill="#FFFFFF" />
          {/* Neon Cyan Cyber Bottom Glow Edge */}
          <rect x="3" y="13" width="3" height="1" fill="#06B6D4" />
          <rect x="16" y="13" width="3" height="1" fill="#06B6D4" />
          <rect x="4" y="13" width="1" height="1" fill="#22D3EE" />
          <rect x="17" y="13" width="1" height="1" fill="#22D3EE" />
        </>
      );

    case 'game_over_dizzy':
      return renderAccessoryWithFrogFace(
        <>
          {/* Left Golden Rimmed Hypno-Spiral Eye */}
          <rect x="3" y="7" width="8" height="8" fill="#CA8A04" />
          <rect x="4" y="8" width="6" height="6" fill="#FACC15" />
          <rect x="5" y="9" width="4" height="4" fill="#0F172A" />
          <rect x="6" y="10" width="2" height="2" fill="#EC4899" />
          <rect x="5" y="10" width="1" height="1" fill="#FDE047" />
          {/* Right Golden Rimmed Hypno-Spiral Eye */}
          <rect x="13" y="7" width="8" height="8" fill="#CA8A04" />
          <rect x="14" y="8" width="6" height="6" fill="#FACC15" />
          <rect x="15" y="9" width="4" height="4" fill="#0F172A" />
          <rect x="16" y="10" width="2" height="2" fill="#EC4899" />
          <rect x="15" y="10" width="1" height="1" fill="#FDE047" />
          {/* Orbiting Yellow Dizzy Stars */}
          <rect x="11" y="4" width="2" height="2" fill="#FACC15" />
          <rect x="11" y="3" width="2" height="4" fill="#FEF08A" />
          <rect x="2" y="5" width="2" height="2" fill="#FDE047" />
          <rect x="20" y="5" width="2" height="2" fill="#FDE047" />
        </>
      );

    case 'scanner_headset':
      return renderAccessoryWithFrogFace(
        <>
          {/* Padded Obsidian Headband Arc */}
          <rect x="4" y="4" width="16" height="2" fill="#0F172A" />
          <rect x="5" y="4" width="14" height="1" fill="#334155" />
          <rect x="3" y="6" width="2" height="4" fill="#0F172A" />
          {/* Left Ear Cushion Plate */}
          <rect x="2" y="6" width="3" height="6" fill="#0F172A" />
          <rect x="3" y="7" width="2" height="4" fill="#0284C7" />
          <rect x="3" y="7" width="1" height="2" fill="#38BDF8" />
          {/* Articulated Boom Mic Arm */}
          <rect x="3" y="12" width="2" height="2" fill="#0F172A" />
          <rect x="5" y="13" width="5" height="2" fill="#1E293B" />
          <rect x="9" y="14" width="3" height="2" fill="#334155" />
          {/* Glowing Green Activity LED Tip */}
          <rect x="12" y="14" width="2" height="2" fill="#10B981" />
          <rect x="12" y="14" width="1" height="1" fill="#A7F3D0" />
        </>
      );

    case 'konbini_blush':
      return renderAccessoryWithFrogFace(
        <>
          {/* Kawaii Strawberry Rosy Cheeks */}
          <rect x="2" y="9" width="6" height="5" fill="#F43F5E" opacity="0.85" />
          <rect x="3" y="10" width="4" height="3" fill="#FB7185" />
          <rect x="16" y="9" width="6" height="5" fill="#F43F5E" opacity="0.85" />
          <rect x="17" y="10" width="4" height="3" fill="#FB7185" />
          {/* Left Pastel Heart Bandage Sticker */}
          <rect x="3" y="9" width="4" height="2" fill="#FEF08A" />
          <rect x="4" y="9" width="2" height="2" fill="#F472B6" />
          {/* Right Sparkle Glint */}
          <rect x="18" y="8" width="2" height="2" fill="#FEF08A" />
          <rect x="18" y="8" width="1" height="1" fill="#FFFFFF" />
        </>
      );

    case 'forest_blush_freckles':
      return renderAccessoryWithFrogFace(
        <>
          {/* Sun-Kissed Peachy Golden Blush */}
          <rect x="2" y="9" width="5" height="4" fill="#F87171" opacity="0.65" />
          <rect x="3" y="10" width="4" height="2" fill="#FCA5A5" opacity="0.8" />
          <rect x="17" y="9" width="5" height="4" fill="#F87171" opacity="0.65" />
          <rect x="17" y="10" width="4" height="2" fill="#FCA5A5" opacity="0.8" />
          {/* Scattered Freckle Pixels across Nose & Cheeks */}
          <rect x="4" y="9" width="1" height="1" fill="#78350F" />
          <rect x="3" y="11" width="1" height="1" fill="#451A03" />
          <rect x="6" y="10" width="1" height="1" fill="#78350F" />
          <rect x="9" y="10" width="1" height="1" fill="#78350F" />
          <rect x="14" y="10" width="1" height="1" fill="#78350F" />
          <rect x="17" y="10" width="1" height="1" fill="#78350F" />
          <rect x="19" y="9" width="1" height="1" fill="#451A03" />
          <rect x="20" y="11" width="1" height="1" fill="#78350F" />
        </>
      );

    case 'wolf_snarl_fangs':
      return renderAccessoryWithFrogFace(
        <>
          {/* Fierce Snarl Lip Crease */}
          <rect x="9" y="11" width="6" height="1" fill="#0F172A" />
          <rect x="8" y="12" width="1" height="1" fill="#0F172A" />
          <rect x="15" y="12" width="1" height="1" fill="#0F172A" />
          {/* Left Sharp Ivory Fang */}
          <rect x="7" y="12" width="3" height="4" fill="#0F172A" />
          <rect x="7" y="12" width="2" height="3" fill="#FFFFFF" />
          <rect x="8" y="15" width="1" height="1" fill="#FFFFFF" />
          <rect x="7" y="13" width="1" height="2" fill="#E2E8F0" />
          {/* Right Sharp Ivory Fang */}
          <rect x="14" y="12" width="3" height="4" fill="#0F172A" />
          <rect x="15" y="12" width="2" height="3" fill="#FFFFFF" />
          <rect x="15" y="15" width="1" height="1" fill="#FFFFFF" />
          <rect x="16" y="13" width="1" height="2" fill="#E2E8F0" />
          {/* Warrior Crimson Battle Scratches on Cheek */}
          <rect x="2" y="9" width="3" height="1" fill="#DC2626" />
          <rect x="1" y="11" width="4" height="1" fill="#DC2626" />
          <rect x="19" y="9" width="3" height="1" fill="#DC2626" />
          <rect x="19" y="11" width="4" height="1" fill="#DC2626" />
        </>
      );

    case 'wasabi_sparkle':
      return renderAccessoryWithFrogFace(
        <>
          {/* Fresh Wasabi Lime Cheeks */}
          <rect x="2" y="9" width="5" height="4" fill="#65A30D" opacity="0.85" />
          <rect x="3" y="10" width="3" height="2" fill="#A3E635" />
          <rect x="17" y="9" width="5" height="4" fill="#65A30D" opacity="0.85" />
          <rect x="18" y="10" width="3" height="2" fill="#A3E635" />
          {/* Eye Sparkles */}
          <rect x="6" y="5" width="2" height="2" fill="#84CC16" />
          <rect x="6" y="5" width="1" height="1" fill="#BEF264" />
          <rect x="16" y="5" width="2" height="2" fill="#84CC16" />
          <rect x="16" y="5" width="1" height="1" fill="#BEF264" />
          {/* Floating Wasabi Starbursts */}
          <rect x="11" y="3" width="2" height="2" fill="#BEF264" />
          <rect x="11" y="2" width="2" height="4" fill="#A3E635" />
          <rect x="3" y="5" width="2" height="2" fill="#FACC15" />
          <rect x="19" y="5" width="2" height="2" fill="#FACC15" />
        </>
      );

    case 'reading':
      return renderAccessoryWithFrogFace(
        <>
          {/* Vintage Tortoiseshell & Brass Temples */}
          <rect x="2" y="9" width="3" height="1" fill="#78350F" />
          <rect x="19" y="9" width="3" height="1" fill="#78350F" />
          {/* Left Round Wireframe Spectacle */}
          <rect x="3" y="7" width="8" height="7" fill="#78350F" />
          <rect x="4" y="7" width="6" height="7" fill="#B45309" />
          <rect x="4" y="8" width="6" height="5" fill="#FDE68A" />
          <rect x="5" y="8" width="4" height="5" fill="#BAE6FD" />
          <rect x="5" y="8" width="2" height="2" fill="#E0F2FE" />
          <rect x="5" y="8" width="1" height="1" fill="#FFFFFF" />
          {/* Curved Bridge */}
          <rect x="10" y="8" width="4" height="2" fill="#78350F" />
          <rect x="11" y="8" width="2" height="1" fill="#FACC15" />
          {/* Right Round Wireframe Spectacle */}
          <rect x="13" y="7" width="8" height="7" fill="#78350F" />
          <rect x="14" y="7" width="6" height="7" fill="#B45309" />
          <rect x="14" y="8" width="6" height="5" fill="#FDE68A" />
          <rect x="15" y="8" width="4" height="5" fill="#BAE6FD" />
          <rect x="15" y="8" width="2" height="2" fill="#E0F2FE" />
          <rect x="15" y="8" width="1" height="1" fill="#FFFFFF" />
        </>
      );

    case 'sunglasses':
      return renderAccessoryWithFrogFace(
        <>
          {/* Pitch Black Wayfarer Frame */}
          <rect x="2" y="7" width="10" height="7" fill="#09090B" />
          <rect x="12" y="7" width="10" height="7" fill="#09090B" />
          <rect x="10" y="7" width="4" height="3" fill="#09090B" />
          {/* Lens Rim Depth */}
          <rect x="3" y="8" width="8" height="5" fill="#18181B" />
          <rect x="13" y="8" width="8" height="5" fill="#18181B" />
          {/* Silver Corner Rivet Studs */}
          <rect x="2" y="7" width="1" height="1" fill="#E2E8F0" />
          <rect x="21" y="7" width="1" height="1" fill="#E2E8F0" />
          {/* Crisp Diagonal Glare Lines */}
          <rect x="4" y="8" width="2" height="1" fill="#FFFFFF" />
          <rect x="5" y="9" width="2" height="1" fill="#FFFFFF" />
          <rect x="14" y="8" width="2" height="1" fill="#FFFFFF" />
          <rect x="15" y="9" width="2" height="1" fill="#FFFFFF" />
        </>
      );

    case 'monocle':
      return renderAccessoryWithFrogFace(
        <>
          {/* Ornate Gilded Gold Monocle Rim on Right Eye */}
          <rect x="12" y="6" width="9" height="8" fill="#78350F" />
          <rect x="13" y="6" width="7" height="8" fill="#CA8A04" />
          <rect x="13" y="7" width="7" height="6" fill="#FACC15" />
          <rect x="14" y="7" width="5" height="6" fill="#BAE6FD" />
          <rect x="14" y="7" width="3" height="3" fill="#E0F2FE" />
          <rect x="14" y="7" width="1" height="1" fill="#FFFFFF" />
          {/* Side Hasp & Hanging Golden Link Chain */}
          <rect x="20" y="9" width="2" height="2" fill="#FACC15" />
          <rect x="21" y="11" width="1" height="2" fill="#CA8A04" />
          <rect x="20" y="13" width="1" height="2" fill="#FACC15" />
          <rect x="19" y="15" width="1" height="2" fill="#CA8A04" />
          <rect x="18" y="17" width="2" height="2" fill="#FACC15" />
          <rect x="18" y="17" width="1" height="1" fill="#FEF08A" />
        </>
      );

    case 'blush_stars':
      return renderAccessoryWithFrogFace(
        <>
          {/* Vivid Rosy Cheek Patches */}
          <rect x="2" y="9" width="6" height="4" fill="#FB7185" opacity="0.85" />
          <rect x="3" y="10" width="4" height="2" fill="#F43F5E" />
          <rect x="16" y="9" width="6" height="4" fill="#FB7185" opacity="0.85" />
          <rect x="17" y="10" width="4" height="2" fill="#F43F5E" />
          {/* Left Golden 4-Point Star Decal */}
          <rect x="4" y="9" width="2" height="2" fill="#FACC15" />
          <rect x="4" y="8" width="2" height="1" fill="#FEF08A" />
          <rect x="4" y="11" width="2" height="1" fill="#FEF08A" />
          <rect x="3" y="9" width="1" height="2" fill="#FEF08A" />
          <rect x="6" y="9" width="1" height="2" fill="#FEF08A" />
          <rect x="4" y="9" width="1" height="1" fill="#FFFFFF" />
          {/* Right Golden 4-Point Star Decal */}
          <rect x="18" y="9" width="2" height="2" fill="#FACC15" />
          <rect x="18" y="8" width="2" height="1" fill="#FEF08A" />
          <rect x="18" y="11" width="2" height="1" fill="#FEF08A" />
          <rect x="17" y="9" width="1" height="2" fill="#FEF08A" />
          <rect x="20" y="9" width="1" height="2" fill="#FEF08A" />
          <rect x="18" y="9" width="1" height="1" fill="#FFFFFF" />
        </>
      );

    case 'sparkles':
      return renderAccessoryWithFrogFace(
        <>
          {/* Overhead 8-Point Diamond Starburst */}
          <rect x="11" y="2" width="2" height="2" fill="#FACC15" />
          <rect x="11" y="1" width="2" height="4" fill="#FEF08A" />
          <rect x="10" y="2" width="4" height="2" fill="#FEF08A" />
          <rect x="11" y="2" width="1" height="1" fill="#FFFFFF" />
          {/* Left Eye Diamond Sparkle */}
          <rect x="2" y="7" width="3" height="3" fill="#FACC15" />
          <rect x="3" y="6" width="1" height="5" fill="#FEF08A" />
          <rect x="1" y="8" width="5" height="1" fill="#FEF08A" />
          <rect x="3" y="8" width="1" height="1" fill="#FFFFFF" />
          {/* Right Eye Diamond Sparkle */}
          <rect x="19" y="8" width="3" height="3" fill="#FACC15" />
          <rect x="20" y="7" width="1" height="5" fill="#FEF08A" />
          <rect x="18" y="9" width="5" height="1" fill="#FEF08A" />
          <rect x="20" y="9" width="1" height="1" fill="#FFFFFF" />
        </>
      );

    case 'eyepatch':
      return renderAccessoryWithFrogFace(
        <>
          {/* Diagonal Leather Strap & Brass Buckle */}
          <rect x="1" y="5" width="22" height="2" fill="#292524" />
          <rect x="2" y="6" width="20" height="1" fill="#451A03" />
          <rect x="18" y="5" width="2" height="2" fill="#FACC15" />
          {/* Heavy Black Leather Patch over Left Eye */}
          <rect x="2" y="7" width="9" height="7" fill="#09090B" />
          <rect x="3" y="7" width="7" height="7" fill="#1C1917" />
          <rect x="4" y="8" width="5" height="5" fill="#292524" />
          {/* Silver Cross Stitches on Patch */}
          <rect x="5" y="9" width="3" height="3" fill="#E2E8F0" />
          <rect x="6" y="8" width="1" height="5" fill="#FFFFFF" />
          <rect x="4" y="10" width="5" height="1" fill="#FFFFFF" />
        </>
      );

    // -----------------------------------------------------------
    // D. PROPS & ACTIVITIES
    // -----------------------------------------------------------
    case 'roasting_marshmallow':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Long Wooden Campfire Skewer Stick */}
          <rect x="2" y="18" width="4" height="4" fill="#78350F" />
          <rect x="6" y="14" width="4" height="4" fill="#92400E" />
          <rect x="10" y="10" width="4" height="4" fill="#B45309" />
          <rect x="14" y="6" width="6" height="4" fill="#D97706" />
          {/* Two Golden Roasted Marshmallows */}
          <rect x="12" y="7" width="5" height="5" fill="#FEF3C7" />
          <rect x="13" y="6" width="3" height="2" fill="#B45309" />
          <rect x="16" y="4" width="5" height="5" fill="#FEF3C7" />
          <rect x="17" y="3" width="3" height="2" fill="#78350F" />
          {/* Flickering Campfire Flame Tips below */}
          <rect x="4" y="20" width="16" height="3" fill="#EA580C" />
          <rect x="8" y="18" width="8" height="3" fill="#FBBF24" />
        </svg>
      );

    case 'holding_camp_lantern':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Brass Lantern Handle */}
          <rect x="9" y="3" width="6" height="2" fill="#78350F" />
          <rect x="7" y="4" width="2" height="4" fill="#92400E" />
          <rect x="15" y="4" width="2" height="4" fill="#92400E" />
          {/* Lantern Top Cap & Chimney */}
          <rect x="7" y="7" width="10" height="3" fill="#1E293B" />
          <rect x="8" y="6" width="8" height="2" fill="#B45309" />
          {/* Glowing Amber Glass Globe with Warm Flame */}
          <rect x="6" y="10" width="12" height="8" fill="#F59E0B" />
          <rect x="8" y="11" width="8" height="6" fill="#FEF08A" />
          <rect x="10" y="12" width="4" height="4" fill="#FFFFFF" />
          {/* Sturdy Metal Base */}
          <rect x="5" y="18" width="14" height="3" fill="#1E293B" />
          <rect x="6" y="19" width="12" height="2" fill="#0F172A" />
        </svg>
      );

    case 'camp_kettle_coffee':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Vintage Blue Enamel Camp Kettle */}
          <rect x="5" y="8" width="10" height="10" fill="#0284C7" />
          <rect x="6" y="9" width="8" height="8" fill="#38BDF8" />
          {/* Kettle Spout & Steaming Pour */}
          <rect x="14" y="9" width="4" height="3" fill="#0284C7" />
          <rect x="17" y="12" width="2" height="6" fill="#78350F" />
          {/* Coffee Mug receiving drip */}
          <rect x="15" y="17" width="7" height="5" fill="#475569" />
          <rect x="16" y="18" width="5" height="3" fill="#78350F" />
          {/* Kettle Handle & Lid */}
          <rect x="3" y="9" width="2" height="8" fill="#0F172A" />
          <rect x="7" y="6" width="6" height="2" fill="#0F172A" />
          {/* Steam Swirls */}
          <rect x="18" y="6" width="2" height="3" fill="#E2E8F0" />
        </svg>
      );

    case 'relaxing':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="5" y="5" width="14" height="14" fill="#75A65A" />
          <rect x="4" y="6" width="16" height="12" fill="#75A65A" />
          <rect x="8" y="9" width="2" height="2" fill="#18181B" />
          <rect x="14" y="9" width="2" height="2" fill="#18181B" />
          <rect x="10" y="13" width="4" height="1" fill="#18181B" />
          <rect x="6" y="12" width="2" height="2" fill="#FB7185" />
          <rect x="16" y="12" width="2" height="2" fill="#FB7185" />
        </svg>
      );

    case 'konbini_scanner':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Register Base + Laser Scanner */}
          <rect x="3" y="5" width="18" height="14" fill="#0F172A" />
          <rect x="4" y="6" width="16" height="7" fill="#0284C7" />
          <rect x="5" y="9" width="14" height="2" fill="#EF4444" />
          <rect x="5" y="14" width="3" height="3" fill="#64748B" />
          <rect x="10" y="14" width="3" height="3" fill="#64748B" />
          <rect x="15" y="14" width="4" height="3" fill="#22C55E" />
        </svg>
      );

    case 'eating_onigiri':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Triangle Onigiri with Nori & Steam */}
          <rect x="11" y="4" width="2" height="2" fill="#18181B" />
          <rect x="9" y="6" width="6" height="2" fill="#18181B" />
          <rect x="7" y="8" width="10" height="2" fill="#18181B" />
          <rect x="5" y="10" width="14" height="7" fill="#18181B" />
          <rect x="11" y="5" width="2" height="1" fill="#FFFFFF" />
          <rect x="10" y="6" width="4" height="2" fill="#FFFFFF" />
          <rect x="8" y="8" width="8" height="2" fill="#FFFFFF" />
          <rect x="6" y="10" width="12" height="6" fill="#FFFFFF" />
          <rect x="9" y="12" width="6" height="4" fill="#0F172A" />
          {/* Tea Cup */}
          <rect x="17" y="15" width="5" height="5" fill="#FEF3C7" />
          <rect x="18" y="14" width="3" height="1" fill="#16A34A" />
        </svg>
      );

    case 'eating':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Ceramic Dish */}
          <rect x="2" y="15" width="20" height="4" fill="#CBD5E1" />
          <rect x="4" y="16" width="16" height="2" fill="#F8FAFC" />
          {/* Onigiri Rice Ball with Nori */}
          <rect x="5" y="8" width="7" height="7" fill="#1E293B" />
          <rect x="6" y="9" width="5" height="5" fill="#FFFFFF" />
          <rect x="7" y="11" width="3" height="3" fill="#0F172A" />
          {/* Strawberry Pastry Scone */}
          <rect x="13" y="10" width="7" height="5" fill="#D97706" />
          <rect x="15" y="8" width="3" height="3" fill="#EF4444" />
        </svg>
      );

    case 'holding_konbini_bag':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Plastic Bag Handles & Stripes */}
          <rect x="8" y="3" width="2" height="5" fill="#94A3B8" />
          <rect x="14" y="3" width="2" height="5" fill="#94A3B8" />
          <rect x="5" y="7" width="14" height="14" fill="#1E293B" />
          <rect x="6" y="8" width="12" height="12" fill="#F8FAFC" />
          <rect x="6" y="11" width="12" height="2" fill="#10B981" />
          <rect x="6" y="14" width="12" height="2" fill="#EA580C" />
        </svg>
      );

    case 'picnic_basket':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Wicker Handle */}
          <rect x="6" y="3" width="2" height="7" fill="#78350F" />
          <rect x="16" y="3" width="2" height="7" fill="#78350F" />
          <rect x="7" y="3" width="10" height="2" fill="#78350F" />
          {/* Basket Body */}
          <rect x="3" y="10" width="18" height="11" fill="#78350F" />
          <rect x="4" y="11" width="16" height="9" fill="#D97706" />
          {/* Red Checkered Napkin */}
          <rect x="4" y="11" width="8" height="5" fill="#DC2626" />
          <rect x="5" y="12" width="2" height="2" fill="#FFFFFF" />
          <rect x="8" y="12" width="2" height="2" fill="#FFFFFF" />
          {/* Red Apple */}
          <rect x="14" y="9" width="4" height="4" fill="#EF4444" />
          <rect x="15" y="8" width="1" height="1" fill="#15803D" />
        </svg>
      );

    case 'woodcutter_axe':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Wooden Haft */}
          <rect x="5" y="18" width="3" height="3" fill="#78350F" />
          <rect x="8" y="15" width="3" height="3" fill="#78350F" />
          <rect x="11" y="12" width="3" height="3" fill="#78350F" />
          <rect x="14" y="9" width="3" height="3" fill="#78350F" />
          <rect x="17" y="6" width="3" height="3" fill="#78350F" />
          {/* Steel Axe Blade */}
          <rect x="14" y="2" width="7" height="6" fill="#64748B" />
          <rect x="15" y="3" width="5" height="4" fill="#CBD5E1" />
          <rect x="19" y="3" width="2" height="4" fill="#F8FAFC" />
        </svg>
      );

    case 'arcade_gamepad':
    case 'gamepad':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Controller Body */}
          <rect x="3" y="7" width="18" height="11" fill="#18181B" />
          <rect x="4" y="8" width="16" height="9" fill="#27272A" />
          {/* Red D-Pad on Left */}
          <rect x="6" y="11" width="5" height="3" fill="#DC2626" />
          <rect x="7" y="10" width="3" height="5" fill="#DC2626" />
          <rect x="8" y="11" width="1" height="3" fill="#EF4444" />
          {/* Red & Yellow AB Buttons on Right */}
          <rect x="14" y="12" width="2" height="2" fill="#EF4444" />
          <rect x="17" y="10" width="2" height="2" fill="#FACC15" />
          {/* Start/Select Middle */}
          <rect x="10" y="14" width="2" height="1" fill="#71717A" />
          <rect x="13" y="14" width="2" height="1" fill="#71717A" />
          {/* Controller Cord Top */}
          <rect x="11" y="4" width="2" height="4" fill="#52525B" />
        </svg>
      );

    case 'claw_machine_prize':
    case 'ufo_claw_prize':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* UFO Metal Crane Claw Clamping Top */}
          <rect x="11" y="1" width="2" height="3" fill="#94A3B8" />
          <rect x="8" y="2" width="3" height="2" fill="#64748B" />
          <rect x="13" y="2" width="3" height="2" fill="#64748B" />
          {/* Frog Plush Eyes */}
          <rect x="4" y="4" width="5" height="5" fill="#15803D" />
          <rect x="15" y="4" width="5" height="5" fill="#15803D" />
          <rect x="5" y="5" width="3" height="3" fill="#4ADE80" />
          <rect x="16" y="5" width="3" height="3" fill="#4ADE80" />
          <rect x="6" y="5" width="1" height="1" fill="#FFFFFF" />
          <rect x="17" y="5" width="1" height="1" fill="#FFFFFF" />
          {/* Plush Body */}
          <rect x="4" y="8" width="16" height="12" fill="#16A34A" />
          <rect x="5" y="9" width="14" height="10" fill="#4ADE80" />
          {/* Yellow Belly */}
          <rect x="7" y="12" width="10" height="6" fill="#FEF08A" />
          {/* Pink Heart Badge */}
          <rect x="10" y="14" width="4" height="3" fill="#EC4899" />
          <rect x="11" y="13" width="2" height="1" fill="#EC4899" />
        </svg>
      );

    case 'handheld_gaming':
    case 'gameboy':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Grey Handheld Console Body */}
          <rect x="4" y="2" width="16" height="20" fill="#64748B" />
          <rect x="5" y="3" width="14" height="18" fill="#94A3B8" />
          <rect x="4" y="19" width="16" height="3" fill="#475569" />
          {/* Olive Green Screen Bezel & LCD Screen */}
          <rect x="6" y="4" width="12" height="9" fill="#334155" />
          <rect x="7" y="5" width="10" height="7" fill="#8BAC0F" />
          {/* Pixel Sprite on Screen */}
          <rect x="10" y="7" width="4" height="3" fill="#0F380F" />
          <rect x="11" y="6" width="2" height="1" fill="#0F380F" />
          {/* D-Pad on Left */}
          <rect x="6" y="15" width="4" height="2" fill="#1E293B" />
          <rect x="7" y="14" width="2" height="4" fill="#1E293B" />
          {/* Slanted Red Action Buttons on Right */}
          <rect x="14" y="16" width="2" height="2" fill="#BE123C" />
          <rect x="16" y="14" width="2" height="2" fill="#BE123C" />
        </svg>
      );

    case 'eating_sushi':
    case 'sushi_platter':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Wooden Geta Platter */}
          <rect x="2" y="11" width="20" height="7" fill="#78350F" />
          <rect x="3" y="12" width="18" height="5" fill="#D97706" />
          <rect x="5" y="17" width="3" height="3" fill="#451A03" />
          <rect x="16" y="17" width="3" height="3" fill="#451A03" />
          {/* Salmon & Tuna Nigiri */}
          <rect x="4" y="8" width="6" height="4" fill="#FB923C" />
          <rect x="4" y="10" width="6" height="2" fill="#FFFFFF" />
          <rect x="11" y="8" width="6" height="4" fill="#E11D48" />
          <rect x="11" y="10" width="6" height="2" fill="#FFFFFF" />
          {/* Wasabi */}
          <rect x="18" y="9" width="3" height="3" fill="#84CC16" />
        </svg>
      );

    case 'sushi_crafting':
    case 'tea_whisk':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Wooden Board */}
          <rect x="2" y="11" width="20" height="8" fill="#78350F" />
          <rect x="3" y="12" width="18" height="6" fill="#D97706" />
          {/* Rice Ball / Matcha Scoop */}
          <rect x="5" y="8" width="8" height="5" fill="#FFFFFF" />
          <rect x="6" y="7" width="6" height="2" fill="#FB923C" />
          {/* Chef Knife */}
          <rect x="13" y="9" width="8" height="3" fill="#E2E8F0" />
          <rect x="19" y="8" width="3" height="5" fill="#78350F" />
        </svg>
      );

    case 'tea':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Ceramic Stoneware Chawan (Matcha Bowl) */}
          <rect x="4" y="8" width="16" height="12" fill="#78350F" />
          <rect x="5" y="7" width="14" height="2" fill="#F8FAFC" />
          <rect x="5" y="9" width="14" height="10" fill="#92400E" />
          <rect x="6" y="10" width="12" height="8" fill="#B45309" />
          <rect x="6" y="17" width="12" height="2" fill="#451A03" />
          {/* Whisked Fresh Green Matcha Froth with Highlights */}
          <rect x="6" y="8" width="12" height="4" fill="#14532D" />
          <rect x="7" y="8" width="10" height="3" fill="#16A34A" />
          <rect x="8" y="8" width="8" height="2" fill="#4ADE80" />
          <rect x="9" y="8" width="4" height="1" fill="#86EFAC" />
          {/* Wisps of Rising Aromatic Steam */}
          <rect x="8" y="4" width="2" height="2" fill="#94A3B8" opacity="0.8" />
          <rect x="9" y="2" width="2" height="2" fill="#94A3B8" opacity="0.6" />
          <rect x="13" y="3" width="2" height="2" fill="#94A3B8" opacity="0.8" />
          <rect x="14" y="1" width="2" height="2" fill="#94A3B8" opacity="0.6" />
        </svg>
      );

    case 'coffee':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="5" y="7" width="11" height="13" fill="#334155" />
          <rect x="6" y="8" width="9" height="11" fill="#FFFFFF" />
          <rect x="7" y="9" width="7" height="4" fill="#78350F" />
          {/* Handle */}
          <rect x="16" y="9" width="3" height="7" fill="#334155" />
          <rect x="16" y="11" width="1" height="3" fill="#FFFFFF" />
        </svg>
      );

    case 'boba':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="11" y="2" width="2" height="6" fill="#F43F5E" />
          <rect x="6" y="6" width="12" height="16" fill="#78350F" />
          <rect x="7" y="7" width="10" height="14" fill="#FED7AA" />
          <rect x="9" y="16" width="2" height="2" fill="#18181B" />
          <rect x="13" y="16" width="2" height="2" fill="#18181B" />
          <rect x="11" y="18" width="2" height="2" fill="#18181B" />
        </svg>
      );

    case 'reading_prop':
    case 'reading':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="3" y="7" width="18" height="13" fill="#1E293B" />
          <rect x="4" y="8" width="7" height="10" fill="#FFFFFF" />
          <rect x="13" y="8" width="7" height="10" fill="#FFFFFF" />
          <rect x="11" y="7" width="2" height="12" fill="#DC2626" />
          <rect x="5" y="10" width="5" height="1" fill="#64748B" />
          <rect x="14" y="10" width="5" height="1" fill="#64748B" />
        </svg>
      );

    case 'guitar':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="9" width="11" height="12" fill="#78350F" />
          <rect x="5" y="10" width="9" height="10" fill="#D97706" />
          <rect x="8" y="13" width="3" height="3" fill="#451A03" />
          {/* Neck & Head */}
          <rect x="12" y="4" width="8" height="3" fill="#78350F" />
          <rect x="18" y="2" width="4" height="4" fill="#CA8A04" />
        </svg>
      );

    case 'painting':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Wooden Artist Palette */}
          <rect x="4" y="8" width="16" height="12" fill="#78350F" />
          <rect x="5" y="9" width="14" height="10" fill="#D97706" />
          {/* Paint Colors */}
          <rect x="7" y="11" width="3" height="3" fill="#EF4444" />
          <rect x="11" y="10" width="3" height="3" fill="#3B82F6" />
          <rect x="14" y="13" width="3" height="3" fill="#FACC15" />
          {/* Paintbrush */}
          <rect x="16" y="3" width="2" height="6" fill="#78350F" />
          <rect x="16" y="2" width="2" height="2" fill="#18181B" />
        </svg>
      );

    case 'camera':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="3" y="7" width="18" height="13" fill="#18181B" />
          <rect x="4" y="8" width="16" height="11" fill="#475569" />
          <rect x="6" y="5" width="5" height="3" fill="#18181B" />
          {/* Lens */}
          <rect x="9" y="10" width="6" height="6" fill="#0F172A" />
          <rect x="10" y="11" width="4" height="4" fill="#38BDF8" />
          <rect x="11" y="12" width="2" height="2" fill="#FFFFFF" />
          <rect x="16" y="9" width="2" height="2" fill="#FACC15" />
        </svg>
      );

    case 'wand':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Wand Shaft */}
          <rect x="5" y="17" width="3" height="3" fill="#B45309" />
          <rect x="8" y="14" width="3" height="3" fill="#B45309" />
          <rect x="11" y="11" width="3" height="3" fill="#B45309" />
          <rect x="13" y="9" width="3" height="3" fill="#D97706" />
          {/* Star Top */}
          <rect x="14" y="4" width="6" height="6" fill="#FACC15" />
          <rect x="16" y="2" width="2" height="10" fill="#FDE047" />
          <rect x="12" y="6" width="10" height="2" fill="#FDE047" />
        </svg>
      );

    case 'meditating':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Peaceful Meditating Frog Face with Closed Eyes */}
          <rect x="4" y="6" width="16" height="13" fill="#75A65A" />
          <rect x="5" y="5" width="4" height="3" fill="#75A65A" />
          <rect x="15" y="5" width="4" height="3" fill="#75A65A" />
          {/* Closed Serene Eyes */}
          <rect x="6" y="11" width="4" height="1" fill="#18181B" />
          <rect x="14" y="11" width="4" height="1" fill="#18181B" />
          <rect x="10" y="14" width="4" height="1" fill="#18181B" />
          {/* Rosy Cheeks */}
          <rect x="5" y="13" width="2" height="2" fill="#FB7185" />
          <rect x="17" y="13" width="2" height="2" fill="#FB7185" />
          {/* Golden Sparkles */}
          <rect x="2" y="4" width="2" height="2" fill="#FACC15" />
          <rect x="20" y="4" width="2" height="2" fill="#FACC15" />
          <rect x="11" y="2" width="2" height="2" fill="#FEF08A" />
        </svg>
      );

    case 'sleeping':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Pillow */}
          <rect x="3" y="7" width="18" height="14" fill="#F8FAFC" />
          <rect x="2" y="6" width="20" height="1" fill="#E2E8F0" />
          {/* Blue Cozy Quilt Blanket */}
          <rect x="3" y="12" width="18" height="9" fill="#0284C7" />
          <rect x="4" y="14" width="16" height="2" fill="#38BDF8" />
          {/* Sleeping Closed Eyes */}
          <rect x="7" y="9" width="3" height="1" fill="#18181B" />
          <rect x="14" y="9" width="3" height="1" fill="#18181B" />
          {/* Zzz floating */}
          <rect x="18" y="3" width="3" height="1" fill="#38BDF8" />
          <rect x="19" y="4" width="2" height="1" fill="#38BDF8" />
          <rect x="18" y="5" width="3" height="1" fill="#38BDF8" />
        </svg>
      );

    case 'fishing':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Rod */}
          <rect x="4" y="18" width="2" height="2" fill="#78350F" />
          <rect x="7" y="14" width="2" height="2" fill="#78350F" />
          <rect x="10" y="10" width="2" height="2" fill="#78350F" />
          <rect x="13" y="6" width="2" height="2" fill="#78350F" />
          <rect x="16" y="2" width="2" height="2" fill="#78350F" />
          {/* Line & Bobber */}
          <rect x="18" y="4" width="1" height="12" fill="#38BDF8" />
          <rect x="17" y="15" width="3" height="3" fill="#EF4444" />
          <rect x="17" y="17" width="3" height="1" fill="#FFFFFF" />
        </svg>
      );

    // -----------------------------------------------------------
    // E. COMPANIONS & PETS (100% PURE CRISP PIXEL ART)
    // -----------------------------------------------------------
    case 'forest_camp_fawn':
    case 'fawn':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Ground Soft Shadow */}
          <rect x="3" y="20" width="18" height="2" fill="#000000" opacity="0.2" />
          {/* Long Velvety Ears */}
          <rect x="4" y="2" width="3" height="6" fill="#78350F" />
          <rect x="5" y="3" width="2" height="4" fill="#FEF3C7" />
          <rect x="16" y="2" width="3" height="6" fill="#78350F" />
          <rect x="16" y="3" width="2" height="4" fill="#FEF3C7" />
          {/* Fawn Head & Brow */}
          <rect x="6" y="5" width="12" height="9" fill="#92400E" />
          <rect x="7" y="6" width="10" height="7" fill="#D97706" />
          <rect x="8" y="6" width="8" height="3" fill="#F59E0B" />
          {/* Big Glossy Eyes with Catchlights */}
          <rect x="6" y="8" width="3" height="4" fill="#1C1917" />
          <rect x="7" y="8" width="1" height="1" fill="#FFFFFF" />
          <rect x="14" y="8" width="3" height="4" fill="#1C1917" />
          <rect x="15" y="8" width="1" height="1" fill="#FFFFFF" />
          {/* Soft Cream Muzzle & Dark Button Nose */}
          <rect x="8" y="11" width="7" height="4" fill="#FEF3C7" />
          <rect x="10" y="11" width="3" height="2" fill="#1C1917" />
          {/* Rosy Cheek Blush */}
          <rect x="6" y="12" width="2" height="1" fill="#FDA4AF" />
          <rect x="15" y="12" width="2" height="1" fill="#FDA4AF" />
          {/* Dappled Spotted Body */}
          <rect x="4" y="14" width="16" height="7" fill="#92400E" />
          <rect x="5" y="14" width="14" height="6" fill="#D97706" />
          <rect x="6" y="15" width="12" height="4" fill="#F59E0B" />
          {/* White Dappled Camo Spots */}
          <rect x="7" y="15" width="2" height="2" fill="#FEF3C7" />
          <rect x="12" y="15" width="2" height="2" fill="#FEF3C7" />
          <rect x="9" y="18" width="2" height="1" fill="#FEF3C7" />
          <rect x="15" y="17" width="2" height="2" fill="#FEF3C7" />
          {/* Fluffy White Tail Tip */}
          <rect x="18" y="15" width="3" height="4" fill="#FEF3C7" />
          <rect x="19" y="16" width="2" height="2" fill="#FFFFFF" />
        </svg>
      );

    case 'campfire_raccoon':
    case 'raccoon':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Ground Soft Shadow */}
          <rect x="3" y="20" width="18" height="2" fill="#000000" opacity="0.2" />
          {/* Pointy Raccoon Ears with White Fluff */}
          <rect x="4" y="1" width="4" height="5" fill="#1E293B" />
          <rect x="5" y="2" width="2" height="3" fill="#F8FAFC" />
          <rect x="16" y="1" width="4" height="5" fill="#1E293B" />
          <rect x="17" y="2" width="2" height="3" fill="#F8FAFC" />
          {/* Head & Silver Fur */}
          <rect x="5" y="4" width="14" height="9" fill="#475569" />
          <rect x="6" y="5" width="12" height="7" fill="#64748B" />
          <rect x="7" y="5" width="10" height="2" fill="#94A3B8" />
          {/* Iconic Bandit Black Eye Mask */}
          <rect x="4" y="6" width="16" height="5" fill="#0F172A" />
          {/* Sparkling Cute Eyes */}
          <rect x="6" y="7" width="3" height="3" fill="#FFFFFF" />
          <rect x="7" y="7" width="2" height="2" fill="#0F172A" />
          <rect x="7" y="7" width="1" height="1" fill="#FFFFFF" />
          <rect x="14" y="7" width="3" height="3" fill="#FFFFFF" />
          <rect x="14" y="7" width="2" height="2" fill="#0F172A" />
          <rect x="15" y="7" width="1" height="1" fill="#FFFFFF" />
          {/* White Snout & Nose */}
          <rect x="9" y="9" width="6" height="4" fill="#F8FAFC" />
          <rect x="10" y="9" width="4" height="2" fill="#0F172A" />
          {/* Body */}
          <rect x="5" y="13" width="14" height="7" fill="#334155" />
          <rect x="6" y="13" width="12" height="6" fill="#475569" />
          <rect x="8" y="14" width="8" height="4" fill="#94A3B8" />
          {/* Fluffy Ringed Tail */}
          <rect x="16" y="14" width="6" height="4" fill="#0F172A" />
          <rect x="18" y="14" width="2" height="4" fill="#94A3B8" />
          {/* Golden Toasted Marshmallow on Stick */}
          <rect x="3" y="15" width="6" height="1" fill="#78350F" />
          <rect x="7" y="12" width="4" height="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.5" />
          <rect x="8" y="13" width="2" height="2" fill="#78350F" />
        </svg>
      );

    case 'companion_none':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="11" y="7" width="2" height="10" fill="#15803D" />
          <rect x="8" y="7" width="3" height="3" fill="#22C55E" />
          <rect x="13" y="9" width="3" height="3" fill="#22C55E" />
        </svg>
      );

    case 'konbini_cashier_cat':
    case 'cashier_cat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Calico Cat Ears (Left Charcoal, Right Orange) */}
          <rect x="4" y="2" width="5" height="5" fill="#18181B" />
          <rect x="5" y="3" width="2" height="3" fill="#FB7185" />
          <rect x="15" y="2" width="5" height="5" fill="#EA580C" />
          <rect x="17" y="3" width="2" height="3" fill="#FB7185" />
          {/* Head */}
          <rect x="5" y="5" width="14" height="9" fill="#E2E8F0" />
          <rect x="6" y="5" width="12" height="8" fill="#FFFFFF" />
          {/* Green Store Visor */}
          <rect x="4" y="5" width="16" height="3" fill="#047857" />
          <rect x="5" y="5" width="14" height="2" fill="#10B981" />
          <rect x="6" y="5" width="12" height="1" fill="#34D399" />
          <rect x="11" y="6" width="2" height="1" fill="#FFFFFF" />
          {/* Eyes & Blushing Face */}
          <rect x="7" y="9" width="2" height="2" fill="#1E293B" />
          <rect x="15" y="9" width="2" height="2" fill="#1E293B" />
          <rect x="11" y="10" width="2" height="1" fill="#FB7185" />
          <rect x="6" y="11" width="2" height="1" fill="#FDA4AF" />
          <rect x="16" y="11" width="2" height="1" fill="#FDA4AF" />
          {/* Green Konbini Apron & Shiny Gold ¥ Coin */}
          <rect x="5" y="13" width="14" height="8" fill="#047857" />
          <rect x="6" y="13" width="12" height="7" fill="#10B981" />
          <rect x="8" y="14" width="8" height="5" fill="#059669" />
          <rect x="10" y="15" width="4" height="4" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.5" />
          <rect x="11" y="16" width="2" height="2" fill="#FEF08A" />
          {/* Waving Paw on Left */}
          <rect x="2" y="11" width="4" height="4" fill="#FFFFFF" />
          <rect x="3" y="12" width="2" height="2" fill="#FB7185" />
        </svg>
      );

    case 'snack_shiba':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Pointy Shiba Ears */}
          <rect x="5" y="2" width="4" height="5" fill="#78350F" />
          <rect x="6" y="3" width="2" height="3" fill="#FED7AA" />
          <rect x="15" y="2" width="4" height="5" fill="#78350F" />
          <rect x="16" y="3" width="2" height="3" fill="#FED7AA" />
          {/* Shiba Head & Warm Amber Fur */}
          <rect x="5" y="5" width="14" height="9" fill="#92400E" />
          <rect x="6" y="5" width="12" height="8" fill="#D97706" />
          <rect x="7" y="5" width="10" height="3" fill="#F59E0B" />
          {/* White Eyebrow Dots & Urajiro Cheeks */}
          <rect x="7" y="6" width="2" height="1" fill="#FFFFFF" />
          <rect x="15" y="6" width="2" height="1" fill="#FFFFFF" />
          <rect x="6" y="8" width="12" height="5" fill="#FFFFFF" />
          {/* Dark Eyes & Nose */}
          <rect x="7" y="8" width="2" height="2" fill="#18181B" />
          <rect x="15" y="8" width="2" height="2" fill="#18181B" />
          <rect x="11" y="9" width="2" height="2" fill="#18181B" />
          <rect x="11" y="11" width="2" height="1" fill="#FB7185" />
          {/* Red Shopping Basket */}
          <rect x="2" y="13" width="20" height="9" fill="#7F1D1D" />
          <rect x="3" y="13" width="18" height="8" fill="#DC2626" />
          <rect x="4" y="14" width="16" height="6" fill="#EF4444" />
          <rect x="4" y="16" width="16" height="1" fill="#B91C1C" />
          {/* Yellow Potato Chips Snack Bag */}
          <rect x="2" y="9" width="5" height="7" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.5" />
          <rect x="3" y="11" width="3" height="2" fill="#DC2626" />
        </svg>
      );

    case 'chibi_wolf_pup':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Pointy Wolf Ears */}
          <rect x="4" y="1" width="5" height="5" fill="#1E293B" />
          <rect x="5" y="2" width="2" height="3" fill="#F472B6" />
          <rect x="15" y="1" width="5" height="5" fill="#1E293B" />
          <rect x="17" y="2" width="2" height="3" fill="#F472B6" />
          {/* Slate Grey Head */}
          <rect x="5" y="4" width="14" height="9" fill="#334155" />
          <rect x="6" y="5" width="12" height="7" fill="#475569" />
          <rect x="7" y="5" width="10" height="2" fill="#64748B" />
          {/* Amber Glowing Eyes */}
          <rect x="6" y="7" width="3" height="3" fill="#FACC15" />
          <rect x="7" y="7" width="1" height="2" fill="#000000" />
          <rect x="15" y="7" width="3" height="3" fill="#FACC15" />
          <rect x="16" y="7" width="1" height="2" fill="#000000" />
          {/* White Snout & Cute Panting Tongue */}
          <rect x="9" y="8" width="6" height="4" fill="#F8FAFC" />
          <rect x="11" y="8" width="2" height="2" fill="#0F172A" />
          <rect x="11" y="11" width="2" height="2" fill="#FB7185" />
          {/* Crimson Neckerchief Bandana */}
          <rect x="5" y="13" width="14" height="3" fill="#991B1B" />
          <rect x="6" y="13" width="12" height="2" fill="#DC2626" />
          <rect x="11" y="15" width="2" height="2" fill="#EF4444" />
          {/* Body & Paws */}
          <rect x="5" y="15" width="14" height="6" fill="#334155" />
          <rect x="6" y="15" width="12" height="5" fill="#475569" />
          <rect x="8" y="16" width="8" height="3" fill="#94A3B8" />
          {/* Fluffy Wagging Tail */}
          <rect x="18" y="14" width="4" height="4" fill="#475569" />
          <rect x="19" y="14" width="3" height="2" fill="#94A3B8" />
        </svg>
      );

    case 'forest_hedgehog':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Spiky Hedgehog Quills Body */}
          <rect x="3" y="4" width="4" height="4" fill="#451A03" />
          <rect x="8" y="3" width="4" height="4" fill="#451A03" />
          <rect x="13" y="4" width="4" height="4" fill="#451A03" />
          <rect x="4" y="6" width="15" height="12" fill="#451A03" />
          <rect x="5" y="7" width="13" height="10" fill="#78350F" />
          <rect x="6" y="8" width="11" height="8" fill="#92400E" />
          {/* Plump Forest Red Strawberry on Back */}
          <rect x="6" y="2" width="6" height="6" fill="#DC2626" />
          <rect x="7" y="3" width="4" height="4" fill="#EF4444" />
          <rect x="8" y="1" width="3" height="2" fill="#16A34A" />
          <rect x="8" y="4" width="1" height="1" fill="#FEF08A" />
          <rect x="10" y="5" width="1" height="1" fill="#FEF08A" />
          {/* Peachy Snout & Big Dark Eye */}
          <rect x="16" y="10" width="6" height="6" fill="#FED7AA" />
          <rect x="17" y="11" width="4" height="4" fill="#FDE68A" />
          <rect x="17" y="11" width="2" height="2" fill="#18181B" />
          <rect x="17" y="11" width="1" height="1" fill="#FFFFFF" />
          <rect x="21" y="12" width="2" height="2" fill="#18181B" />
          <rect x="16" y="14" width="2" height="1" fill="#FB7185" />
          {/* Trotting Feet */}
          <rect x="6" y="18" width="4" height="3" fill="#451A03" />
          <rect x="14" y="18" width="4" height="3" fill="#451A03" />
        </svg>
      );

    case 'sushi_apprentice_cat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Calico Cat Ears (Left Ginger, Right Dark Charcoal) */}
          <rect x="4" y="2" width="5" height="5" fill="#D97706" />
          <rect x="5" y="3" width="2" height="3" fill="#FDE68A" />
          <rect x="15" y="2" width="5" height="5" fill="#18181B" />
          <rect x="17" y="3" width="2" height="3" fill="#FB7185" />
          {/* Head */}
          <rect x="5" y="5" width="14" height="9" fill="#E2E8F0" />
          <rect x="6" y="5" width="12" height="8" fill="#FFFFFF" />
          <rect x="6" y="5" width="4" height="4" fill="#FB923C" />
          {/* Red Itamae Chef Headband with Blue Emblem */}
          <rect x="4" y="5" width="16" height="3" fill="#991B1B" />
          <rect x="5" y="5" width="14" height="2" fill="#DC2626" />
          <rect x="11" y="5" width="2" height="2" fill="#1E3A8A" />
          {/* Sapphire Blue Eyes */}
          <rect x="7" y="9" width="3" height="3" fill="#1E3A8A" />
          <rect x="7" y="9" width="1" height="1" fill="#60A5FA" />
          <rect x="14" y="9" width="3" height="3" fill="#1E3A8A" />
          <rect x="14" y="9" width="1" height="1" fill="#60A5FA" />
          <rect x="11" y="10" width="2" height="1" fill="#FB7185" />
          {/* Body with Calico Patches */}
          <rect x="5" y="13" width="14" height="8" fill="#E2E8F0" />
          <rect x="6" y="13" width="12" height="7" fill="#FFFFFF" />
          <rect x="6" y="14" width="4" height="5" fill="#FB923C" />
          <rect x="14" y="15" width="4" height="4" fill="#1E293B" />
          {/* Hinoki Platter with Salmon Nigiri Held */}
          <rect x="13" y="12" width="9" height="4" fill="#78350F" />
          <rect x="14" y="11" width="7" height="3" fill="#FB923C" />
          <rect x="15" y="11" width="5" height="1" fill="#FFF7ED" />
          <rect x="16" y="11" width="2" height="4" fill="#15803D" />
        </svg>
      );

    case 'mini_ebi_shrimp':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Golden Crispy Tempura Body with 4-Tone Depth */}
          <rect x="4" y="7" width="16" height="11" fill="#9A3412" />
          <rect x="5" y="7" width="14" height="10" fill="#C2410C" />
          <rect x="6" y="8" width="12" height="8" fill="#EA580C" />
          <rect x="7" y="8" width="10" height="6" fill="#F97316" />
          <rect x="8" y="9" width="8" height="4" fill="#FED7AA" />
          {/* Crispy Tail Fin */}
          <rect x="18" y="5" width="5" height="5" fill="#991B1B" />
          <rect x="18" y="6" width="4" height="3" fill="#DC2626" />
          <rect x="18" y="13" width="5" height="5" fill="#991B1B" />
          <rect x="18" y="14" width="4" height="3" fill="#DC2626" />
          {/* Cute Kawaii Face */}
          <rect x="6" y="10" width="2" height="3" fill="#18181B" />
          <rect x="6" y="10" width="1" height="1" fill="#FFFFFF" />
          <rect x="12" y="10" width="2" height="3" fill="#18181B" />
          <rect x="12" y="10" width="1" height="1" fill="#FFFFFF" />
          <rect x="5" y="12" width="2" height="1" fill="#FB7185" />
          <rect x="13" y="12" width="2" height="1" fill="#FB7185" />
          {/* Cute Antennae */}
          <rect x="1" y="6" width="4" height="2" fill="#EA580C" />
          <rect x="1" y="14" width="4" height="2" fill="#EA580C" />
        </svg>
      );

    case 'snail':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Glistening Slime Trail on Ground */}
          <rect x="2" y="19" width="16" height="2" fill="#BAE6FD" opacity="0.6" />
          <rect x="4" y="20" width="12" height="1" fill="#FFFFFF" opacity="0.8" />
          {/* 5-Tone Amber Spiral Shell */}
          <rect x="3" y="6" width="12" height="11" fill="#451A03" />
          <rect x="4" y="5" width="10" height="12" fill="#78350F" />
          <rect x="5" y="6" width="8" height="10" fill="#B45309" />
          <rect x="6" y="7" width="6" height="8" fill="#D97706" />
          <rect x="7" y="8" width="4" height="6" fill="#F59E0B" />
          <rect x="8" y="9" width="2" height="3" fill="#FEF3C7" />
          {/* Specular Highlight on Shell */}
          <rect x="6" y="6" width="2" height="1" fill="#FEF08A" />
          {/* Snail Slime Foot & Body */}
          <rect x="3" y="16" width="17" height="3" fill="#65A30D" />
          <rect x="4" y="15" width="16" height="3" fill="#84CC16" />
          <rect x="5" y="15" width="14" height="1" fill="#BEF264" />
          {/* Snail Head */}
          <rect x="15" y="10" width="5" height="7" fill="#65A30D" />
          <rect x="16" y="11" width="4" height="6" fill="#84CC16" />
          <rect x="17" y="11" width="3" height="4" fill="#BEF264" />
          {/* Cute Rosy Blush */}
          <rect x="18" y="14" width="2" height="1" fill="#FB7185" />
          {/* Eyestalks with Specular Gloss Dots */}
          <rect x="16" y="6" width="2" height="5" fill="#65A30D" />
          <rect x="19" y="5" width="2" height="6" fill="#65A30D" />
          <rect x="15" y="5" width="3" height="3" fill="#18181B" />
          <rect x="19" y="4" width="3" height="3" fill="#18181B" />
          <rect x="15" y="5" width="1" height="1" fill="#FFFFFF" />
          <rect x="19" y="4" width="1" height="1" fill="#FFFFFF" />
        </svg>
      );

    case 'crab':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Big Snapping Claws (Left & Right) */}
          <rect x="2" y="4" width="6" height="7" fill="#7F1D1D" />
          <rect x="3" y="5" width="4" height="5" fill="#DC2626" />
          <rect x="4" y="6" width="2" height="3" fill="#EF4444" />
          <rect x="16" y="4" width="6" height="7" fill="#7F1D1D" />
          <rect x="17" y="5" width="4" height="5" fill="#DC2626" />
          <rect x="18" y="6" width="2" height="3" fill="#EF4444" />
          {/* Carapace Body */}
          <rect x="5" y="8" width="14" height="10" fill="#7F1D1D" />
          <rect x="6" y="9" width="12" height="8" fill="#DC2626" />
          <rect x="7" y="9" width="10" height="6" fill="#EF4444" />
          <rect x="8" y="10" width="8" height="3" fill="#F87171" />
          {/* Big Stalk Eyes with Glare */}
          <rect x="8" y="6" width="3" height="3" fill="#FFFFFF" />
          <rect x="9" y="6" width="2" height="2" fill="#18181B" />
          <rect x="9" y="6" width="1" height="1" fill="#FFFFFF" />
          <rect x="13" y="6" width="3" height="3" fill="#FFFFFF" />
          <rect x="14" y="6" width="2" height="2" fill="#18181B" />
          <rect x="14" y="6" width="1" height="1" fill="#FFFFFF" />
          {/* Walking Legs */}
          <rect x="3" y="17" width="3" height="3" fill="#7F1D1D" />
          <rect x="6" y="18" width="2" height="3" fill="#7F1D1D" />
          <rect x="16" y="18" width="2" height="3" fill="#7F1D1D" />
          <rect x="18" y="17" width="3" height="3" fill="#7F1D1D" />
        </svg>
      );

    case 'fireflies':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Deep Night Atmosphere Glow */}
          <rect x="2" y="2" width="20" height="20" fill="#0B132B" opacity="0.4" />
          {/* Firefly 1 - Main Big Glowing Lantern */}
          <rect x="4" y="4" width="8" height="8" fill="#FACC15" opacity="0.25" />
          <rect x="5" y="5" width="6" height="6" fill="#FDE047" opacity="0.6" />
          <rect x="6" y="6" width="4" height="4" fill="#FACC15" />
          <rect x="7" y="7" width="2" height="2" fill="#FFFFFF" />
          {/* Firefly 2 */}
          <rect x="13" y="11" width="9" height="9" fill="#FACC15" opacity="0.25" />
          <rect x="14" y="12" width="7" height="7" fill="#FDE047" opacity="0.6" />
          <rect x="15" y="13" width="5" height="5" fill="#FACC15" />
          <rect x="16" y="14" width="3" height="3" fill="#FFFFFF" />
          {/* Firefly 3 */}
          <rect x="15" y="3" width="5" height="5" fill="#FEF08A" opacity="0.4" />
          <rect x="16" y="4" width="3" height="3" fill="#FACC15" />
          <rect x="17" y="5" width="1" height="1" fill="#FFFFFF" />
        </svg>
      );

    case 'butterfly':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Morpho Cyan & Sapphire Wings */}
          {/* Left Wing Top */}
          <rect x="3" y="4" width="8" height="8" fill="#0369A1" />
          <rect x="4" y="5" width="6" height="6" fill="#0284C7" />
          <rect x="5" y="6" width="4" height="4" fill="#38BDF8" />
          <rect x="6" y="7" width="2" height="2" fill="#BAE6FD" />
          {/* Left Wing Bottom */}
          <rect x="5" y="11" width="6" height="7" fill="#0369A1" />
          <rect x="6" y="12" width="4" height="5" fill="#0284C7" />
          <rect x="7" y="13" width="2" height="3" fill="#38BDF8" />
          {/* Right Wing Top */}
          <rect x="13" y="4" width="8" height="8" fill="#0369A1" />
          <rect x="14" y="5" width="6" height="6" fill="#0284C7" />
          <rect x="15" y="6" width="4" height="4" fill="#38BDF8" />
          <rect x="16" y="7" width="2" height="2" fill="#BAE6FD" />
          {/* Right Wing Bottom */}
          <rect x="13" y="11" width="6" height="7" fill="#0369A1" />
          <rect x="14" y="12" width="4" height="5" fill="#0284C7" />
          <rect x="15" y="13" width="2" height="3" fill="#38BDF8" />
          {/* Slender Butterfly Body & Antennae */}
          <rect x="11" y="4" width="2" height="15" fill="#0F172A" />
          <rect x="9" y="1" width="2" height="3" fill="#0F172A" />
          <rect x="13" y="1" width="2" height="3" fill="#0F172A" />
        </svg>
      );

    case 'koi':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Water Swirl Background Hint */}
          <rect x="3" y="16" width="6" height="2" fill="#38BDF8" opacity="0.6" />
          {/* Nishikigoi Fish Body */}
          <rect x="3" y="8" width="16" height="8" fill="#CBD5E1" />
          <rect x="4" y="7" width="14" height="10" fill="#F8FAFC" />
          <rect x="5" y="8" width="12" height="8" fill="#FFFFFF" />
          {/* Scarlet & Amber Calico Kohaku Spots */}
          <rect x="6" y="8" width="6" height="6" fill="#C2410C" />
          <rect x="7" y="8" width="5" height="4" fill="#EA580C" />
          <rect x="13" y="9" width="4" height="4" fill="#DC2626" />
          {/* Glossy Eye */}
          <rect x="4" y="9" width="3" height="3" fill="#18181B" />
          <rect x="4" y="9" width="1" height="1" fill="#FFFFFF" />
          {/* Flowing Tail Fin with Rims */}
          <rect x="17" y="5" width="5" height="5" fill="#EA580C" />
          <rect x="18" y="6" width="3" height="3" fill="#F97316" />
          <rect x="17" y="14" width="5" height="5" fill="#EA580C" />
          <rect x="18" y="15" width="3" height="3" fill="#F97316" />
        </svg>
      );

    case 'duckling':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Yellow Duck Head */}
          <rect x="5" y="3" width="9" height="9" fill="#CA8A04" />
          <rect x="6" y="4" width="7" height="7" fill="#FACC15" />
          <rect x="7" y="4" width="5" height="4" fill="#FEF08A" />
          {/* Glossy Eye */}
          <rect x="7" y="6" width="3" height="3" fill="#18181B" />
          <rect x="7" y="6" width="1" height="1" fill="#FFFFFF" />
          {/* Orange Quacking Beak */}
          <rect x="1" y="6" width="5" height="4" fill="#C2410C" />
          <rect x="2" y="7" width="4" height="2" fill="#EA580C" />
          {/* Chunky Fluffy Body */}
          <rect x="8" y="10" width="12" height="9" fill="#CA8A04" />
          <rect x="9" y="10" width="10" height="8" fill="#FACC15" />
          <rect x="10" y="11" width="8" height="5" fill="#FEF08A" />
          {/* Wing */}
          <rect x="11" y="12" width="6" height="5" fill="#EAB308" />
          <rect x="12" y="13" width="4" height="3" fill="#FDE047" />
          {/* Webbed Paddle Feet */}
          <rect x="10" y="19" width="4" height="2" fill="#EA580C" />
          <rect x="16" y="19" width="4" height="2" fill="#EA580C" />
        </svg>
      );

    case 'cat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Midnight Black Cat Pointy Ears */}
          <rect x="4" y="2" width="5" height="5" fill="#09090B" />
          <rect x="5" y="3" width="2" height="3" fill="#FB7185" />
          <rect x="15" y="2" width="5" height="5" fill="#09090B" />
          <rect x="17" y="3" width="2" height="3" fill="#FB7185" />
          {/* Head & Rim Lighting */}
          <rect x="5" y="5" width="14" height="9" fill="#09090B" />
          <rect x="6" y="5" width="12" height="8" fill="#18181B" />
          <rect x="7" y="6" width="10" height="2" fill="#27272A" />
          {/* Radiant Golden Eyes with Slits */}
          <rect x="7" y="8" width="3" height="3" fill="#FACC15" />
          <rect x="8" y="8" width="1" height="3" fill="#000000" />
          <rect x="14" y="8" width="3" height="3" fill="#FACC15" />
          <rect x="15" y="8" width="1" height="3" fill="#000000" />
          {/* Crimson Velvet Collar & Gold Bell */}
          <rect x="6" y="13" width="12" height="2" fill="#DC2626" />
          <rect x="10" y="14" width="4" height="4" fill="#FACC15" stroke="#B45309" strokeWidth="0.5" />
          <rect x="11" y="15" width="2" height="2" fill="#FEF08A" />
          {/* Body & Paws */}
          <rect x="5" y="15" width="14" height="7" fill="#09090B" />
          <rect x="6" y="15" width="12" height="6" fill="#18181B" />
        </svg>
      );

    case 'turtle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Mossy Ancient Shell */}
          <rect x="6" y="5" width="14" height="13" fill="#14532D" />
          <rect x="7" y="5" width="12" height="12" fill="#166534" />
          <rect x="8" y="6" width="10" height="10" fill="#15803D" />
          <rect x="9" y="7" width="8" height="8" fill="#22C55E" />
          {/* Scute Patterns on Shell */}
          <rect x="11" y="9" width="4" height="4" fill="#86EFAC" />
          {/* Lotus Blossom on Back */}
          <rect x="12" y="3" width="4" height="4" fill="#F472B6" />
          <rect x="13" y="4" width="2" height="2" fill="#FDE047" />
          {/* Head & Wrinkled Eye */}
          <rect x="2" y="9" width="6" height="6" fill="#166534" />
          <rect x="3" y="10" width="4" height="4" fill="#84CC16" />
          <rect x="3" y="11" width="2" height="2" fill="#18181B" />
          <rect x="3" y="11" width="1" height="1" fill="#FFFFFF" />
          {/* Paddle Flippers */}
          <rect x="5" y="17" width="5" height="4" fill="#166534" />
          <rect x="15" y="17" width="5" height="4" fill="#166534" />
        </svg>
      );

    case 'pixel_arcade_ghost':
    case 'arcade_ghost':
    case 'ghost':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Neon Underglow Shadow */}
          <rect x="4" y="21" width="16" height="2" fill="#EC4899" opacity="0.3" />
          {/* 8-bit Pixel Ghost Dome Head */}
          <rect x="6" y="3" width="12" height="4" fill="#BE185D" />
          <rect x="5" y="4" width="14" height="3" fill="#DB2777" />
          <rect x="4" y="7" width="16" height="11" fill="#EC4899" />
          <rect x="5" y="6" width="14" height="11" fill="#F472B6" />
          {/* Ghost Bottom Stepped Waves */}
          <rect x="4" y="17" width="3" height="4" fill="#EC4899" />
          <rect x="9" y="17" width="3" height="4" fill="#EC4899" />
          <rect x="14" y="17" width="3" height="4" fill="#EC4899" />
          <rect x="17" y="17" width="3" height="4" fill="#EC4899" />
          {/* Retro Pixel Eyes */}
          <rect x="6" y="8" width="4" height="5" fill="#FFFFFF" />
          <rect x="6" y="9" width="3" height="3" fill="#1E3A8A" />
          <rect x="6" y="9" width="1" height="1" fill="#60A5FA" />
          <rect x="13" y="8" width="4" height="5" fill="#FFFFFF" />
          <rect x="13" y="9" width="3" height="3" fill="#1E3A8A" />
          <rect x="13" y="9" width="1" height="1" fill="#60A5FA" />
        </svg>
      );

    case 'retro_tamagotchi':
    case 'tamagotchi':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Keychain Ring at Top */}
          <rect x="10" y="1" width="4" height="3" fill="#64748B" />
          <rect x="11" y="2" width="2" height="1" fill="#F8FAFC" />
          {/* Egg-Shaped Shell with Gilded Bevels */}
          <rect x="5" y="4" width="14" height="18" fill="#A16207" />
          <rect x="4" y="6" width="16" height="14" fill="#CA8A04" />
          <rect x="5" y="5" width="14" height="16" fill="#FACC15" />
          <rect x="6" y="5" width="2" height="15" fill="#FEF08A" />
          {/* LCD Screen Display */}
          <rect x="6" y="7" width="12" height="9" fill="#0F380F" />
          <rect x="7" y="8" width="10" height="7" fill="#8BAC0F" />
          <rect x="8" y="9" width="8" height="5" fill="#9BBC0F" />
          {/* Pixel Creature on LCD */}
          <rect x="10" y="10" width="4" height="3" fill="#0F380F" />
          <rect x="9" y="11" width="6" height="1" fill="#0F380F" />
          {/* 3 Hot Pink Physical Buttons */}
          <rect x="7" y="17" width="2" height="2" fill="#BE185D" />
          <rect x="7" y="17" width="2" height="1" fill="#F472B6" />
          <rect x="11" y="18" width="2" height="2" fill="#BE185D" />
          <rect x="11" y="18" width="2" height="1" fill="#F472B6" />
          <rect x="15" y="17" width="2" height="2" fill="#BE185D" />
          <rect x="15" y="17" width="2" height="1" fill="#F472B6" />
        </svg>
      );

    // -----------------------------------------------------------
    // F. HABITATS & SCENES (Mini Isometric Pixel Dioramas)
    // -----------------------------------------------------------
    case 'retro_arcade':
    case 'arcade':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Dark Neon Cyber Arcade Background */}
          <rect x="2" y="2" width="20" height="20" fill="#0F0C20" />
          {/* Neon Grid Lines */}
          <rect x="2" y="10" width="20" height="1" fill="#9333EA" opacity="0.6" />
          <rect x="2" y="15" width="20" height="1" fill="#06B6D4" opacity="0.7" />
          {/* CRT Arcade Cabinet on Left */}
          <rect x="3" y="5" width="7" height="15" fill="#1E1B4B" />
          <rect x="4" y="6" width="5" height="2" fill="#EF4444" />
          <rect x="4" y="9" width="5" height="5" fill="#0284C7" />
          <rect x="5" y="10" width="3" height="3" fill="#22D3EE" />
          <rect x="4" y="15" width="5" height="2" fill="#EC4899" />
          {/* UFO Claw Crane Machine on Right */}
          <rect x="14" y="5" width="7" height="15" fill="#3B0764" />
          <rect x="15" y="6" width="5" height="2" fill="#FACC15" />
          <rect x="15" y="9" width="5" height="5" fill="#1E293B" />
          <rect x="17" y="9" width="1" height="2" fill="#CBD5E1" />
          <rect x="16" y="12" width="3" height="2" fill="#EC4899" />
          {/* Neon Floor */}
          <rect x="2" y="19" width="20" height="3" fill="#18181B" />
          <rect x="2" y="19" width="20" height="1" fill="#C084FC" />
        </svg>
      );

    case 'forest_camp':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Deep Twilight Night Forest Sky */}
          <rect x="2" y="2" width="20" height="20" fill="#0B191E" />
          {/* Distant Mountain Ridge & Moon */}
          <rect x="2" y="6" width="20" height="6" fill="#162D2D" />
          <rect x="16" y="4" width="3" height="3" fill="#FEF08A" />
          {/* Pine Trees Silhouettes */}
          <rect x="3" y="8" width="4" height="9" fill="#0F3D24" />
          <rect x="18" y="7" width="4" height="10" fill="#0F3D24" />
          {/* Cozy Canvas A-Frame Camp Tent */}
          <rect x="5" y="11" width="8" height="8" fill="#065F46" />
          <rect x="6" y="12" width="6" height="6" fill="#D97706" />
          <rect x="7" y="13" width="4" height="5" fill="#FEF3C7" />
          {/* Crackling Campfire & Timber Logs */}
          <rect x="14" y="15" width="5" height="4" fill="#EA580C" />
          <rect x="15" y="14" width="3" height="3" fill="#FBBF24" />
          <rect x="13" y="18" width="7" height="2" fill="#78350F" />
          {/* Forest Ground */}
          <rect x="2" y="19" width="20" height="3" fill="#1E3A2F" />
        </svg>
      );

    case 'convenience_store':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Canopy */}
          <rect x="2" y="2" width="20" height="20" fill="#0F172A" />
          <rect x="2" y="2" width="20" height="4" fill="#10B981" />
          <rect x="2" y="6" width="20" height="2" fill="#EA580C" />
          {/* Glass Windows */}
          <rect x="4" y="9" width="7" height="8" fill="#38BDF8" />
          <rect x="13" y="9" width="7" height="8" fill="#FACC15" />
          <rect x="2" y="18" width="20" height="4" fill="#E2E8F0" />
        </svg>
      );

    case 'red_riding_forest':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#064E3B" />
          {/* Pine Roof */}
          <rect x="8" y="5" width="8" height="3" fill="#991B1B" />
          <rect x="6" y="8" width="12" height="4" fill="#991B1B" />
          <rect x="7" y="12" width="10" height="6" fill="#78350F" />
          {/* Mushroom */}
          <rect x="4" y="15" width="4" height="3" fill="#EF4444" />
          <rect x="5" y="18" width="2" height="2" fill="#FFFFFF" />
          <rect x="2" y="19" width="20" height="3" fill="#14532D" />
        </svg>
      );

    case 'sushi_bar':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#0F172A" />
          <rect x="2" y="2" width="20" height="4" fill="#78350F" />
          {/* Indigo Noren */}
          <rect x="4" y="6" width="4" height="5" fill="#1E3A8A" />
          <rect x="9" y="6" width="4" height="5" fill="#1E3A8A" />
          <rect x="14" y="6" width="4" height="5" fill="#1E3A8A" />
          {/* Red Lantern */}
          <rect x="18" y="8" width="4" height="5" fill="#DC2626" />
          {/* Hinoki Counter */}
          <rect x="2" y="14" width="20" height="6" fill="#D97706" />
          <rect x="6" y="15" width="12" height="4" fill="#FEF3C7" />
        </svg>
      );

    case 'sauna_bathhouse':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Warm Hinoki Wood Plank Wall */}
          <rect x="2" y="2" width="20" height="20" fill="#D4BE9C" />
          <rect x="2" y="6" width="20" height="1" fill="#BFA682" />
          <rect x="2" y="11" width="20" height="1" fill="#BFA682" />
          <rect x="2" y="16" width="20" height="1" fill="#BFA682" />
          {/* Cedar Sauna Doorway Frame */}
          <rect x="5" y="4" width="14" height="14" fill="#542E12" />
          <rect x="6" y="5" width="12" height="12" fill="#85532A" />
          {/* Glowing Amber Sauna Interior View */}
          <rect x="7" y="6" width="10" height="10" fill="#FEF3C7" />
          <rect x="8" y="9" width="8" height="4" fill="#D97706" />
          {/* Digital 38.0°C LED Temperature Gauge above Door */}
          <rect x="8" y="2" width="8" height="3" fill="#18181B" />
          <rect x="9" y="3" width="6" height="1" fill="#EF4444" />
          {/* Steamed Sauna Bathhouse Tile Floor */}
          <rect x="2" y="18" width="20" height="4" fill="#DFC09C" />
          <rect x="2" y="18" width="20" height="1" fill="#8C6A48" />
        </svg>
      );

    case 'zen_pond':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#0C4A6E" />
          <rect x="2" y="10" width="20" height="12" fill="#0284C7" />
          {/* Lilypad */}
          <rect x="5" y="13" width="8" height="4" fill="#22C55E" />
          {/* Stone Lantern */}
          <rect x="15" y="8" width="5" height="7" fill="#64748B" />
          <rect x="16" y="10" width="3" height="2" fill="#FEF08A" />
        </svg>
      );

    case 'treehouse':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#523218" />
          <rect x="5" y="4" width="14" height="6" fill="#15803D" />
          <rect x="6" y="10" width="12" height="9" fill="#92400E" />
          <rect x="10" y="13" width="4" height="6" fill="#78350F" />
        </svg>
      );

    case 'sakura_shrine':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#FCE7F3" />
          {/* Torii Gate */}
          <rect x="3" y="5" width="18" height="3" fill="#DC2626" />
          <rect x="5" y="8" width="3" height="12" fill="#DC2626" />
          <rect x="16" y="8" width="3" height="12" fill="#DC2626" />
        </svg>
      );

    case 'rainy_meadow':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#0F172A" />
          <rect x="2" y="13" width="20" height="9" fill="#15803D" />
          {/* Toadstool */}
          <rect x="7" y="8" width="10" height="5" fill="#EF4444" />
          <rect x="11" y="13" width="2" height="5" fill="#FFFFFF" />
          {/* Rain lines */}
          <rect x="5" y="4" width="1" height="4" fill="#38BDF8" />
          <rect x="17" y="3" width="1" height="4" fill="#38BDF8" />
        </svg>
      );

    case 'onsen':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#27272A" />
          <rect x="4" y="11" width="16" height="9" fill="#0284C7" />
          {/* Steam */}
          <rect x="7" y="5" width="2" height="4" fill="#E2E8F0" />
          <rect x="12" y="4" width="2" height="5" fill="#E2E8F0" />
          <rect x="16" y="6" width="2" height="3" fill="#E2E8F0" />
        </svg>
      );

    case 'night_camp':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#0F172A" />
          <rect x="6" y="5" width="2" height="2" fill="#FACC15" />
          {/* Campfire */}
          <rect x="10" y="13" width="4" height="4" fill="#EA580C" />
          <rect x="11" y="14" width="2" height="2" fill="#FACC15" />
          <rect x="9" y="17" width="6" height="2" fill="#78350F" />
        </svg>
      );

    case 'tearoom':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#FEF3C7" />
          <rect x="2" y="14" width="20" height="8" fill="#C59B63" />
          <rect x="7" y="11" width="10" height="4" fill="#78350F" />
          <rect x="10" y="8" width="4" height="3" fill="#15803D" />
        </svg>
      );

    case 'cloud_palace':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#38BDF8" />
          {/* Cloud Blocks */}
          <rect x="4" y="13" width="16" height="6" fill="#FFFFFF" />
          <rect x="7" y="10" width="10" height="8" fill="#FFFFFF" />
          <rect x="11" y="5" width="3" height="3" fill="#FACC15" />
        </svg>
      );

    case 'bamboo_grove':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="2" y="2" width="20" height="20" fill="#052E16" />
          <rect x="5" y="3" width="4" height="18" fill="#15803D" />
          <rect x="13" y="3" width="4" height="18" fill="#22C55E" />
          <rect x="7" y="7" width="6" height="6" fill="#DC2626" />
          <rect x="9" y="9" width="2" height="2" fill="#FEF08A" />
        </svg>
      );

    // -----------------------------------------------------------
    // G. WEATHER
    // -----------------------------------------------------------
    case 'auto':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="5" y="5" width="14" height="14" fill="#64748B" />
          <rect x="11" y="7" width="2" height="5" fill="#FFFFFF" />
          <rect x="11" y="11" width="5" height="2" fill="#FFFFFF" />
        </svg>
      );

    case 'sunny':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="8" y="8" width="8" height="8" fill="#F59E0B" />
          <rect x="9" y="9" width="6" height="6" fill="#FDE047" />
          {/* Sun Rays */}
          <rect x="11" y="3" width="2" height="3" fill="#F59E0B" />
          <rect x="11" y="18" width="2" height="3" fill="#F59E0B" />
          <rect x="3" y="11" width="3" height="2" fill="#F59E0B" />
          <rect x="18" y="11" width="3" height="2" fill="#F59E0B" />
        </svg>
      );

    case 'golden':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="3" y="12" width="18" height="8" fill="#EA580C" />
          <rect x="8" y="8" width="8" height="8" fill="#FACC15" />
          <rect x="9" y="9" width="6" height="6" fill="#FEF08A" />
        </svg>
      );

    case 'starry':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Crescent Moon */}
          <rect x="8" y="5" width="9" height="12" fill="#FACC15" />
          <rect x="12" y="7" width="7" height="8" fill="#0B132B" />
          {/* Stars */}
          <rect x="5" y="7" width="2" height="2" fill="#FFFFFF" />
          <rect x="17" y="17" width="2" height="2" fill="#FFFFFF" />
        </svg>
      );

    case 'rainy':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="5" y="6" width="14" height="8" fill="#94A3B8" />
          <rect x="7" y="5" width="10" height="9" fill="#94A3B8" />
          {/* Rain streaks */}
          <rect x="7" y="15" width="2" height="4" fill="#38BDF8" />
          <rect x="12" y="16" width="2" height="4" fill="#38BDF8" />
          <rect x="16" y="14" width="2" height="4" fill="#38BDF8" />
        </svg>
      );

    case 'petals':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="5" y="6" width="4" height="4" fill="#F472B6" />
          <rect x="15" y="8" width="5" height="5" fill="#FB7185" />
          <rect x="10" y="14" width="4" height="4" fill="#FDA4AF" />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="5" y="5" width="14" height="14" fill="#75A65A" />
          <rect x="8" y="8" width="8" height="8" fill="#FEF9C3" />
        </svg>
      );
  }
};
