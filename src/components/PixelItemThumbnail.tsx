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
        {/* Frog Eyes Outlines */}
        <rect x="4" y="4" width="5" height="5" fill={pal.outline} />
        <rect x="15" y="4" width="5" height="5" fill={pal.outline} />
        <rect x="5" y="5" width="3" height="3" fill={pal.main} />
        <rect x="16" y="5" width="3" height="3" fill={pal.main} />
        <rect x="5" y="5" width="1" height="1" fill={pal.eyeHighlight} />
        <rect x="16" y="5" width="1" height="1" fill={pal.eyeHighlight} />

        {/* Head Main */}
        <rect x="3" y="8" width="18" height="12" fill={pal.main} />
        <rect x="2" y="9" width="1" height="10" fill={pal.outline} />
        <rect x="21" y="9" width="1" height="10" fill={pal.outline} />
        <rect x="4" y="20" width="16" height="1" fill={pal.outline} />
        <rect x="8" y="7" width="8" height="1" fill={pal.outline} />

        {/* Belly */}
        <rect x="7" y="13" width="10" height="7" fill={pal.belly} />

        {/* Cheeks */}
        <rect x="4" y="11" width="3" height="2" fill={pal.cheeks} />
        <rect x="17" y="11" width="3" height="2" fill={pal.cheeks} />

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
          <rect x="11" y="4" width="2" height="4" fill="#14532D" />
          <rect x="4" y="8" width="16" height="3" fill="#166534" />
          <rect x="2" y="11" width="20" height="4" fill="#22C55E" />
          <rect x="3" y="11" width="18" height="2" fill="#4ADE80" />
          <rect x="1" y="14" width="22" height="2" fill="#14532D" />
          {/* Dewdrop */}
          <rect x="7" y="12" width="2" height="2" fill="#E0F2FE" />
          <rect x="7" y="12" width="1" height="1" fill="#FFFFFF" />
        </svg>
      );

    case 'straw':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="8" y="5" width="8" height="4" fill="#78350F" />
          <rect x="9" y="6" width="6" height="3" fill="#FACC15" />
          {/* Red Ribbon */}
          <rect x="7" y="9" width="10" height="2" fill="#DC2626" />
          {/* Wide Brim */}
          <rect x="2" y="11" width="20" height="4" fill="#B45309" />
          <rect x="3" y="12" width="18" height="2" fill="#FDE047" />
        </svg>
      );

    case 'sakura':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* 5 Petals Pixel Flower */}
          <rect x="10" y="4" width="4" height="4" fill="#F472B6" />
          <rect x="4" y="9" width="4" height="4" fill="#F472B6" />
          <rect x="16" y="9" width="4" height="4" fill="#F472B6" />
          <rect x="6" y="15" width="4" height="4" fill="#F472B6" />
          <rect x="14" y="15" width="4" height="4" fill="#F472B6" />
          {/* Center */}
          <rect x="9" y="9" width="6" height="6" fill="#FDE047" />
          <rect x="11" y="11" width="2" height="2" fill="#EAB308" />
        </svg>
      );

    case 'wizard':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Pointed Cone */}
          <rect x="11" y="2" width="2" height="2" fill="#312E81" />
          <rect x="10" y="4" width="4" height="3" fill="#4338CA" />
          <rect x="8" y="7" width="8" height="4" fill="#4F46E5" />
          {/* Golden Star & Buckle */}
          <rect x="11" y="7" width="2" height="2" fill="#FACC15" />
          <rect x="6" y="11" width="12" height="2" fill="#FBBF24" />
          {/* Brim */}
          <rect x="2" y="13" width="20" height="3" fill="#312E81" />
          <rect x="3" y="14" width="18" height="1" fill="#6366F1" />
        </svg>
      );

    case 'bandana':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="8" width="16" height="5" fill="#991B1B" />
          <rect x="5" y="9" width="14" height="3" fill="#EF4444" />
          <rect x="7" y="10" width="2" height="1" fill="#FFFFFF" />
          <rect x="11" y="10" width="2" height="1" fill="#FFFFFF" />
          <rect x="15" y="10" width="2" height="1" fill="#FFFFFF" />
          <rect x="18" y="13" width="4" height="4" fill="#DC2626" />
        </svg>
      );

    case 'beanie':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Pompom */}
          <rect x="10" y="3" width="4" height="3" fill="#FACC15" />
          {/* Body */}
          <rect x="6" y="6" width="12" height="6" fill="#0369A1" />
          <rect x="7" y="7" width="10" height="4" fill="#0284C7" />
          {/* Folded Brim */}
          <rect x="4" y="12" width="16" height="4" fill="#0C4A6E" />
          <rect x="5" y="13" width="14" height="2" fill="#38BDF8" />
        </svg>
      );

    case 'chef':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="8" y="3" width="8" height="3" fill="#E2E8F0" />
          <rect x="5" y="6" width="14" height="7" fill="#FFFFFF" />
          <rect x="4" y="8" width="16" height="4" fill="#FFFFFF" />
          <rect x="6" y="13" width="12" height="3" fill="#CBD5E1" />
          <rect x="7" y="14" width="10" height="2" fill="#94A3B8" />
        </svg>
      );

    case 'crown':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="3" y="12" width="18" height="4" fill="#B45309" />
          <rect x="4" y="13" width="16" height="2" fill="#FACC15" />
          {/* Spikes */}
          <rect x="4" y="6" width="3" height="6" fill="#FDE047" />
          <rect x="10" y="4" width="4" height="8" fill="#FDE047" />
          <rect x="17" y="6" width="3" height="6" fill="#FDE047" />
          {/* Jewels */}
          <rect x="5" y="7" width="1" height="2" fill="#EF4444" />
          <rect x="11" y="5" width="2" height="2" fill="#3B82F6" />
          <rect x="18" y="7" width="1" height="2" fill="#EF4444" />
        </svg>
      );

    case 'beret':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="11" y="5" width="2" height="2" fill="#450A0A" />
          <rect x="4" y="7" width="16" height="5" fill="#881337" />
          <rect x="2" y="10" width="20" height="4" fill="#BE123C" />
          <rect x="5" y="14" width="14" height="2" fill="#450A0A" />
        </svg>
      );

    case 'flower':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="10" y="4" width="4" height="4" fill="#FFFFFF" />
          <rect x="4" y="9" width="4" height="4" fill="#FFFFFF" />
          <rect x="16" y="9" width="4" height="4" fill="#FFFFFF" />
          <rect x="7" y="15" width="4" height="4" fill="#FFFFFF" />
          <rect x="13" y="15" width="4" height="4" fill="#FFFFFF" />
          <rect x="9" y="8" width="6" height="6" fill="#F59E0B" />
          <rect x="10" y="9" width="4" height="4" fill="#FACC15" />
        </svg>
      );

    case 'headphone':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Headband */}
          <rect x="5" y="4" width="14" height="3" fill="#DC2626" />
          <rect x="4" y="6" width="3" height="7" fill="#18181B" />
          <rect x="17" y="6" width="3" height="7" fill="#18181B" />
          {/* Earcups */}
          <rect x="2" y="11" width="5" height="7" fill="#3B82F6" />
          <rect x="17" y="11" width="5" height="7" fill="#3B82F6" />
          <rect x="3" y="13" width="3" height="3" fill="#FFFFFF" />
          <rect x="18" y="13" width="3" height="3" fill="#FFFFFF" />
        </svg>
      );

    case 'detective':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="11" y="4" width="2" height="3" fill="#451A03" />
          <rect x="6" y="7" width="12" height="6" fill="#78350F" />
          <rect x="7" y="8" width="10" height="4" fill="#92400E" />
          <rect x="2" y="13" width="20" height="3" fill="#451A03" />
          <rect x="3" y="14" width="18" height="1" fill="#B45309" />
        </svg>
      );

    case 'samurai':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Gold Crest */}
          <rect x="11" y="2" width="2" height="4" fill="#FACC15" />
          <rect x="8" y="4" width="8" height="2" fill="#FACC15" />
          {/* Kabuto Helmet */}
          <rect x="5" y="6" width="14" height="6" fill="#18181B" />
          <rect x="6" y="7" width="12" height="4" fill="#27272A" />
          <rect x="2" y="12" width="20" height="3" fill="#991B1B" />
          <rect x="3" y="15" width="4" height="3" fill="#FACC15" />
          <rect x="17" y="15" width="4" height="3" fill="#FACC15" />
        </svg>
      );

    // -----------------------------------------------------------
    // B. OUTFITS
    // -----------------------------------------------------------
    case 'field_scout_parka':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Heavy Deep Pine Green Parka Body */}
          <rect x="4" y="6" width="16" height="13" fill="#14532D" />
          <rect x="5" y="7" width="14" height="11" fill="#166534" />
          {/* Sherpa Fur Hood Collar */}
          <rect x="7" y="5" width="10" height="3" fill="#FEF3C7" />
          <rect x="8" y="6" width="8" height="2" fill="#FDE68A" />
          {/* Center Zipper & Wind Flap */}
          <rect x="11" y="6" width="2" height="12" fill="#0F172A" />
          <rect x="11" y="8" width="1" height="9" fill="#FACC15" />
          {/* Utility Chest Pockets & Compass Badge */}
          <rect x="6" y="9" width="4" height="3" fill="#14532D" />
          <rect x="14" y="9" width="4" height="3" fill="#14532D" />
          <rect x="7" y="10" width="2" height="2" fill="#F59E0B" />
          {/* Heavy Hem */}
          <rect x="4" y="18" width="16" height="2" fill="#0F260C" />
        </svg>
      );

    case 'flannel_camp_vest':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Red & Black Buffalo Plaid Long Sleeves */}
          <rect x="2" y="7" width="4" height="9" fill="#DC2626" />
          <rect x="3" y="8" width="2" height="7" fill="#18181B" />
          <rect x="18" y="7" width="4" height="9" fill="#DC2626" />
          <rect x="19" y="8" width="2" height="7" fill="#18181B" />
          {/* Forest Sherpa Camp Vest (Tan/Olive) */}
          <rect x="5" y="6" width="14" height="13" fill="#78350F" />
          <rect x="6" y="7" width="12" height="11" fill="#B45309" />
          {/* Plaid Shirt Peeking in Center */}
          <rect x="10" y="6" width="4" height="12" fill="#DC2626" />
          <rect x="11" y="8" width="2" height="2" fill="#18181B" />
          <rect x="11" y="12" width="2" height="2" fill="#18181B" />
          {/* Brass Snaps */}
          <rect x="9" y="9" width="1" height="1" fill="#FACC15" />
          <rect x="9" y="13" width="1" height="1" fill="#FACC15" />
        </svg>
      );

    case 'cozy_sleeping_bag':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Deep Evergreen Insulated Sleeping Cocoon */}
          <rect x="4" y="5" width="16" height="15" fill="#064E3B" />
          <rect x="5" y="6" width="14" height="13" fill="#047857" />
          {/* Cozy Soft Inner Lining (Warm Ochre / Orange) */}
          <rect x="7" y="7" width="10" height="4" fill="#EA580C" />
          <rect x="8" y="8" width="8" height="3" fill="#F97316" />
          {/* Drawstring Hood Trim */}
          <rect x="6" y="5" width="12" height="2" fill="#022C22" />
          <rect x="9" y="11" width="6" height="1" fill="#022C22" />
          {/* Puffy Down Baffle Stitching */}
          <rect x="5" y="13" width="14" height="1" fill="#064E3B" />
          <rect x="5" y="16" width="14" height="1" fill="#064E3B" />
          {/* Mini Camp Patch */}
          <rect x="7" y="14" width="3" height="2" fill="#FBBF24" />
        </svg>
      );

    case 'arcade_gamer_bomber':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Satin Purple Bomber Jacket Body */}
          <rect x="4" y="6" width="16" height="12" fill="#581C87" />
          <rect x="5" y="7" width="14" height="10" fill="#7E22CE" />
          {/* Neon Cyan Sleeves */}
          <rect x="2" y="7" width="3" height="9" fill="#06B6D4" />
          <rect x="19" y="7" width="3" height="9" fill="#06B6D4" />
          {/* Gold Center Zipper */}
          <rect x="11" y="6" width="2" height="11" fill="#FACC15" />
          {/* Pixel Badges on Chest */}
          <rect x="7" y="9" width="3" height="3" fill="#EC4899" />
          <rect x="14" y="9" width="3" height="3" fill="#22D3EE" />
          {/* Dark Ribbed Hem */}
          <rect x="4" y="17" width="16" height="2" fill="#3B0764" />
        </svg>
      );

    case 'pixel_hero_armor':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Royal Purple Cape behind shoulders */}
          <rect x="3" y="6" width="18" height="13" fill="#6B21A8" />
          <rect x="2" y="8" width="20" height="11" fill="#7C3AED" />
          {/* Silver Steel Breastplate */}
          <rect x="5" y="7" width="14" height="10" fill="#94A3B8" />
          <rect x="6" y="8" width="12" height="8" fill="#CBD5E1" />
          {/* Golden Hero Sword / Crest */}
          <rect x="10" y="9" width="4" height="4" fill="#FACC15" />
          <rect x="11" y="8" width="2" height="6" fill="#FEF08A" />
          {/* Heavy Leather Belt */}
          <rect x="5" y="15" width="14" height="2" fill="#475569" />
          <rect x="10" y="15" width="4" height="2" fill="#FACC15" />
        </svg>
      );

    case 'retro_esports_jersey':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Dark Esports Jersey Body */}
          <rect x="4" y="6" width="16" height="12" fill="#0F172A" />
          <rect x="5" y="7" width="14" height="10" fill="#1E293B" />
          {/* Neon Cyan Shoulder Racing Stripes */}
          <rect x="3" y="7" width="3" height="10" fill="#06B6D4" />
          <rect x="18" y="7" width="3" height="10" fill="#06B6D4" />
          {/* Yellow Retro 88 Number Print */}
          <rect x="8" y="9" width="8" height="5" fill="#FACC15" />
          <rect x="10" y="10" width="4" height="3" fill="#0F172A" />
          {/* Neon Magenta Collar Trim */}
          <rect x="9" y="6" width="6" height="2" fill="#EC4899" />
        </svg>
      );

    case 'konbini_staff_uniform':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Green Store Shirt with Collar & Name Badge */}
          <rect x="4" y="6" width="16" height="12" fill="#047857" />
          <rect x="5" y="7" width="14" height="10" fill="#10B981" />
          {/* White Center Stripe */}
          <rect x="11" y="6" width="2" height="11" fill="#FFFFFF" />
          {/* Orange Collar Tips */}
          <rect x="8" y="6" width="3" height="3" fill="#EA580C" />
          <rect x="13" y="6" width="3" height="3" fill="#EA580C" />
          {/* Yellow Name Tag */}
          <rect x="6" y="10" width="3" height="2" fill="#FACC15" />
          {/* Dark Trousers */}
          <rect x="5" y="17" width="14" height="4" fill="#1E293B" />
          <rect x="11" y="18" width="2" height="3" fill="#0F172A" />
        </svg>
      );

    case 'shopper_cozy_sweatset':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Purple Relaxed Hoodie Body */}
          <rect x="4" y="6" width="16" height="11" fill="#581C87" />
          <rect x="5" y="7" width="14" height="9" fill="#7E22CE" />
          {/* White Drawstrings */}
          <rect x="9" y="7" width="1" height="4" fill="#FFFFFF" />
          <rect x="14" y="7" width="1" height="4" fill="#FFFFFF" />
          {/* Front Kangaroo Pouch */}
          <rect x="7" y="11" width="10" height="4" fill="#6B21A8" />
          <rect x="8" y="12" width="8" height="2" fill="#9333EA" />
          {/* Sweatpants */}
          <rect x="5" y="17" width="14" height="4" fill="#3B0764" />
          <rect x="11" y="18" width="2" height="3" fill="#1E1B4B" />
        </svg>
      );

    case 'red_riding_dress':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* White Frill Blouse */}
          <rect x="6" y="5" width="12" height="5" fill="#FFFFFF" />
          <rect x="8" y="6" width="8" height="2" fill="#FEE2E2" />
          {/* Brown Leather Corset */}
          <rect x="6" y="9" width="12" height="4" fill="#78350F" />
          <rect x="10" y="9" width="4" height="4" fill="#B45309" />
          <rect x="11" y="10" width="2" height="2" fill="#FDE047" />
          {/* Ruby Red Flared Skirt */}
          <rect x="4" y="13" width="16" height="6" fill="#991B1B" />
          <rect x="5" y="13" width="14" height="5" fill="#DC2626" />
          {/* White Lace Apron Over Skirt */}
          <rect x="8" y="13" width="8" height="4" fill="#FFFFFF" />
          <rect x="9" y="14" width="6" height="2" fill="#F8FAFC" />
          <rect x="5" y="18" width="14" height="1" fill="#FFFFFF" />
        </svg>
      );

    case 'wolf_fur_cloak':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Heavy Fur Mantle Collar */}
          <rect x="3" y="5" width="18" height="5" fill="#1E293B" />
          <rect x="4" y="6" width="16" height="3" fill="#475569" />
          {/* Fang Clasp */}
          <rect x="10" y="7" width="4" height="2" fill="#E2E8F0" />
          <rect x="11" y="8" width="2" height="2" fill="#FFFFFF" />
          {/* Charcoal Fur Body */}
          <rect x="4" y="10" width="16" height="9" fill="#0F172A" />
          <rect x="5" y="10" width="14" height="8" fill="#334155" />
          <rect x="7" y="11" width="10" height="5" fill="#475569" />
          {/* Jagged Fur Hem */}
          <rect x="5" y="18" width="3" height="2" fill="#1E293B" />
          <rect x="10" y="18" width="4" height="2" fill="#1E293B" />
          <rect x="16" y="18" width="3" height="2" fill="#1E293B" />
        </svg>
      );

    case 'hunter_woodsman':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Red/Black Buffalo Plaid Shirt */}
          <rect x="4" y="5" width="16" height="10" fill="#7F1D1D" />
          <rect x="5" y="6" width="14" height="8" fill="#DC2626" />
          <rect x="6" y="6" width="3" height="8" fill="#18181B" />
          <rect x="11" y="6" width="2" height="8" fill="#18181B" />
          <rect x="15" y="6" width="3" height="8" fill="#18181B" />
          {/* Leather Belt & Brass Buckle */}
          <rect x="4" y="14" width="16" height="3" fill="#451A03" />
          <rect x="10" y="14" width="4" height="3" fill="#CA8A04" />
          {/* Sturdy Boots/Pants */}
          <rect x="5" y="17" width="14" height="4" fill="#1E293B" />
          <rect x="11" y="17" width="2" height="4" fill="#0F172A" />
        </svg>
      );

    case 'sushi_chef_happi':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* White Traditional Happi Coat */}
          <rect x="4" y="5" width="16" height="12" fill="#CBD5E1" />
          <rect x="5" y="6" width="14" height="10" fill="#FFFFFF" />
          {/* Navy Blue Lapels */}
          <rect x="6" y="5" width="3" height="11" fill="#1E3A8A" />
          <rect x="15" y="5" width="3" height="11" fill="#1E3A8A" />
          {/* Red Chef Sash */}
          <rect x="4" y="13" width="16" height="2" fill="#DC2626" />
          <rect x="10" y="14" width="4" height="3" fill="#991B1B" />
          {/* Ocean Wave Motif at Hem */}
          <rect x="4" y="15" width="16" height="2" fill="#1E3A8A" />
          <rect x="6" y="15" width="2" height="1" fill="#60A5FA" />
          <rect x="11" y="15" width="2" height="1" fill="#60A5FA" />
          <rect x="16" y="15" width="2" height="1" fill="#60A5FA" />
          {/* Navy Trousers */}
          <rect x="5" y="17" width="14" height="4" fill="#0F172A" />
        </svg>
      );

    case 'sushi_kimono_waiter':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Indigo Kimono Body */}
          <rect x="4" y="5" width="16" height="14" fill="#1E3A8A" />
          <rect x="5" y="6" width="14" height="12" fill="#2563EB" />
          <rect x="8" y="5" width="8" height="5" fill="#E0F2FE" />
          {/* Beige Waiter Half Apron */}
          <rect x="5" y="12" width="14" height="7" fill="#D97706" />
          <rect x="6" y="13" width="12" height="5" fill="#FEF3C7" />
          <rect x="4" y="11" width="16" height="2" fill="#78350F" />
        </svg>
      );

    case 'kimono':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="5" width="16" height="14" fill="#166534" />
          <rect x="5" y="6" width="14" height="12" fill="#22C55E" />
          <rect x="8" y="5" width="8" height="5" fill="#FEF9C3" />
          {/* Golden Obi Sash */}
          <rect x="4" y="11" width="16" height="4" fill="#CA8A04" />
          <rect x="5" y="12" width="14" height="2" fill="#FDE047" />
        </svg>
      );

    case 'raincoat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="6" width="16" height="13" fill="#CA8A04" />
          <rect x="5" y="7" width="14" height="11" fill="#FACC15" />
          <rect x="11" y="8" width="2" height="2" fill="#1E293B" />
          <rect x="11" y="12" width="2" height="2" fill="#1E293B" />
          <rect x="11" y="15" width="2" height="2" fill="#1E293B" />
        </svg>
      );

    case 'sweater':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="6" width="16" height="12" fill="#9A3412" />
          <rect x="5" y="7" width="14" height="10" fill="#EA580C" />
          <rect x="7" y="7" width="2" height="10" fill="#FED7AA" />
          <rect x="15" y="7" width="2" height="10" fill="#FED7AA" />
          <rect x="4" y="16" width="16" height="2" fill="#7C2D12" />
        </svg>
      );

    case 'ninja':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="6" width="16" height="13" fill="#09090B" />
          <rect x="5" y="7" width="14" height="11" fill="#18181B" />
          <rect x="4" y="12" width="16" height="2" fill="#DC2626" />
          <rect x="11" y="13" width="2" height="3" fill="#DC2626" />
        </svg>
      );

    case 'sailor':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="6" width="16" height="12" fill="#E2E8F0" />
          <rect x="5" y="7" width="14" height="10" fill="#FFFFFF" />
          <rect x="4" y="6" width="16" height="4" fill="#1E3A8A" />
          <rect x="11" y="8" width="2" height="4" fill="#DC2626" />
          <rect x="4" y="15" width="16" height="4" fill="#1E3A8A" />
        </svg>
      );

    case 'apron':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="7" y="5" width="10" height="13" fill="#15803D" />
          <rect x="8" y="6" width="8" height="11" fill="#22C55E" />
          <rect x="8" y="11" width="8" height="5" fill="#78350F" />
          <rect x="9" y="12" width="6" height="3" fill="#D97706" />
        </svg>
      );

    case 'overalls':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="5" y="6" width="14" height="6" fill="#FFFFFF" />
          <rect x="6" y="8" width="2" height="8" fill="#1D4ED8" />
          <rect x="16" y="8" width="2" height="8" fill="#1D4ED8" />
          <rect x="4" y="12" width="16" height="7" fill="#1E40AF" />
          <rect x="5" y="13" width="14" height="5" fill="#2563EB" />
          <rect x="6" y="10" width="2" height="2" fill="#FACC15" />
          <rect x="16" y="10" width="2" height="2" fill="#FACC15" />
        </svg>
      );

    case 'scarf':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="9" width="16" height="5" fill="#991B1B" />
          <rect x="5" y="10" width="14" height="3" fill="#DC2626" />
          <rect x="14" y="13" width="4" height="6" fill="#DC2626" />
          <rect x="14" y="18" width="4" height="2" fill="#7F1D1D" />
        </svg>
      );

    case 'business':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="6" width="16" height="13" fill="#0F172A" />
          <rect x="5" y="7" width="14" height="11" fill="#1E293B" />
          <rect x="8" y="6" width="8" height="6" fill="#FFFFFF" />
          <rect x="11" y="7" width="2" height="6" fill="#DC2626" />
        </svg>
      );

    case 'hoodie':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="4" y="6" width="16" height="12" fill="#064E3B" />
          <rect x="5" y="7" width="14" height="10" fill="#059669" />
          <rect x="7" y="11" width="10" height="4" fill="#047857" />
        </svg>
      );

    // -----------------------------------------------------------
    // C. FACE ACCESSORIES & GLASSES
    // -----------------------------------------------------------
    case 'campfire_warm_glow':
      return renderAccessoryWithFrogFace(
        <>
          {/* Warm Flickering Campfire Blush on Cheeks */}
          <rect x="3" y="10" width="5" height="4" fill="#EA580C" opacity="0.9" />
          <rect x="4" y="11" width="3" height="2" fill="#F97316" />
          <rect x="16" y="10" width="5" height="4" fill="#EA580C" opacity="0.9" />
          <rect x="17" y="11" width="3" height="2" fill="#F97316" />
          {/* Floating Fire Ember Particles */}
          <rect x="4" y="7" width="2" height="2" fill="#FDE047" />
          <rect x="18" y="6" width="2" height="2" fill="#FDE047" />
          <rect x="11" y="4" width="2" height="2" fill="#F97316" />
          <rect x="2" y="12" width="1" height="1" fill="#FDE047" />
          <rect x="21" y="11" width="1" height="1" fill="#FDE047" />
        </>
      );

    case 'explorer_binoculars':
      return renderAccessoryWithFrogFace(
        <>
          {/* Field Scout Binoculars on Eyes */}
          <rect x="3" y="8" width="7" height="6" fill="#14532D" />
          <rect x="14" y="8" width="7" height="6" fill="#14532D" />
          <rect x="4" y="9" width="5" height="4" fill="#38BDF8" />
          <rect x="15" y="9" width="5" height="4" fill="#38BDF8" />
          <rect x="5" y="9" width="2" height="2" fill="#FFFFFF" />
          <rect x="16" y="9" width="2" height="2" fill="#FFFFFF" />
          {/* Center Bridge & Focus Wheel */}
          <rect x="10" y="9" width="4" height="3" fill="#0F172A" />
          <rect x="11" y="8" width="2" height="2" fill="#D4AF37" />
          {/* Hanging Neck Strap */}
          <rect x="2" y="13" width="2" height="4" fill="#78350F" />
          <rect x="20" y="13" width="2" height="4" fill="#78350F" />
        </>
      );

    case 'cyber_pixel_shades':
      return renderAccessoryWithFrogFace(
        <>
          {/* Stepped Thug/Meme Pixel Sunglasses with Neon Glint */}
          <rect x="3" y="9" width="7" height="3" fill="#09090B" />
          <rect x="4" y="12" width="5" height="3" fill="#09090B" />
          <rect x="14" y="9" width="7" height="3" fill="#09090B" />
          <rect x="15" y="12" width="5" height="3" fill="#09090B" />
          <rect x="10" y="10" width="4" height="2" fill="#09090B" />
          {/* White Stepped Specular Gleam */}
          <rect x="4" y="10" width="2" height="1" fill="#FFFFFF" />
          <rect x="5" y="11" width="2" height="1" fill="#FFFFFF" />
          <rect x="15" y="10" width="2" height="1" fill="#FFFFFF" />
          <rect x="16" y="11" width="2" height="1" fill="#FFFFFF" />
          <rect x="4" y="13" width="2" height="1" fill="#22D3EE" />
          <rect x="15" y="13" width="2" height="1" fill="#22D3EE" />
        </>
      );

    case 'game_over_dizzy':
      return renderAccessoryWithFrogFace(
        <>
          {/* Dizzy Spiral Swirls on Eyes */}
          <rect x="4" y="8" width="6" height="6" fill="#FACC15" />
          <rect x="5" y="9" width="4" height="4" fill="#0F172A" />
          <rect x="6" y="10" width="2" height="2" fill="#EC4899" />
          <rect x="14" y="8" width="6" height="6" fill="#FACC15" />
          <rect x="15" y="9" width="4" height="4" fill="#0F172A" />
          <rect x="16" y="10" width="2" height="2" fill="#EC4899" />
          {/* Floating Yellow Dizzy Sparkles */}
          <rect x="11" y="5" width="2" height="2" fill="#FDE047" />
          <rect x="2" y="6" width="2" height="2" fill="#FDE047" />
          <rect x="20" y="6" width="2" height="2" fill="#FDE047" />
        </>
      );

    case 'scanner_headset':
      return renderAccessoryWithFrogFace(
        <>
          {/* Black Headband Arc across forehead */}
          <rect x="5" y="6" width="14" height="2" fill="#0F172A" />
          {/* Left Earpiece Cushion */}
          <rect x="3" y="6" width="3" height="5" fill="#0284C7" />
          <rect x="4" y="7" width="1" height="3" fill="#38BDF8" />
          {/* Adjustable Boom Mic Arm */}
          <rect x="4" y="11" width="2" height="3" fill="#0F172A" />
          <rect x="5" y="13" width="5" height="2" fill="#0F172A" />
          {/* Red Glowing LED Mic Tip */}
          <rect x="10" y="13" width="2" height="2" fill="#EF4444" />
        </>
      );

    case 'konbini_blush':
      return renderAccessoryWithFrogFace(
        <>
          {/* Rosy Pink Pixel Cheeks */}
          <rect x="3" y="10" width="4" height="2" fill="#FDA4AF" />
          <rect x="4" y="11" width="2" height="2" fill="#FB7185" />
          <rect x="17" y="10" width="4" height="2" fill="#FDA4AF" />
          <rect x="18" y="11" width="2" height="2" fill="#FB7185" />
        </>
      );

    case 'forest_blush_freckles':
      return renderAccessoryWithFrogFace(
        <>
          {/* Freckle Pixels & Warm Golden Blush */}
          <rect x="3" y="11" width="4" height="2" fill="#FCA5A5" opacity="0.8" />
          <rect x="17" y="11" width="4" height="2" fill="#FCA5A5" opacity="0.8" />
          <rect x="4" y="10" width="1" height="1" fill="#78350F" />
          <rect x="6" y="11" width="1" height="1" fill="#78350F" />
          <rect x="17" y="11" width="1" height="1" fill="#78350F" />
          <rect x="19" y="10" width="1" height="1" fill="#78350F" />
        </>
      );

    case 'wolf_snarl_fangs':
      return renderAccessoryWithFrogFace(
        <>
          {/* Pair of White Canine Fangs */}
          <rect x="8" y="13" width="2" height="3" fill="#FFFFFF" />
          <rect x="9" y="15" width="1" height="1" fill="#FFFFFF" />
          <rect x="14" y="13" width="2" height="3" fill="#FFFFFF" />
          <rect x="14" y="15" width="1" height="1" fill="#FFFFFF" />
          {/* Snarl Mark */}
          <rect x="11" y="9" width="2" height="2" fill="#B91C1C" />
        </>
      );

    case 'wasabi_sparkle':
      return renderAccessoryWithFrogFace(
        <>
          {/* Wasabi Leaf & Sparkles */}
          <rect x="4" y="10" width="3" height="3" fill="#84CC16" />
          <rect x="17" y="10" width="3" height="3" fill="#84CC16" />
          <rect x="11" y="4" width="2" height="2" fill="#FEF08A" />
          <rect x="4" y="5" width="2" height="2" fill="#FACC15" />
          <rect x="18" y="5" width="2" height="2" fill="#FACC15" />
        </>
      );

    case 'reading':
      return renderAccessoryWithFrogFace(
        <>
          {/* Round Gold Wire Spectacles */}
          <rect x="4" y="8" width="6" height="5" fill="#E0F2FE" />
          <rect x="4" y="8" width="6" height="1" fill="#B45309" />
          <rect x="4" y="12" width="6" height="1" fill="#B45309" />
          <rect x="4" y="8" width="1" height="5" fill="#B45309" />
          <rect x="9" y="8" width="1" height="5" fill="#B45309" />
          {/* Bridge */}
          <rect x="10" y="9" width="4" height="1" fill="#B45309" />
          {/* Right Lens */}
          <rect x="14" y="8" width="6" height="5" fill="#E0F2FE" />
          <rect x="14" y="8" width="6" height="1" fill="#B45309" />
          <rect x="14" y="12" width="6" height="1" fill="#B45309" />
          <rect x="14" y="8" width="1" height="5" fill="#B45309" />
          <rect x="19" y="8" width="1" height="5" fill="#B45309" />
          {/* Highlights */}
          <rect x="5" y="9" width="1" height="1" fill="#FFFFFF" />
          <rect x="15" y="9" width="1" height="1" fill="#FFFFFF" />
        </>
      );

    case 'sunglasses':
      return renderAccessoryWithFrogFace(
        <>
          {/* Retro 8-Bit Cool Black Shades */}
          <rect x="3" y="8" width="8" height="5" fill="#18181B" />
          <rect x="13" y="8" width="8" height="5" fill="#18181B" />
          <rect x="11" y="9" width="2" height="2" fill="#18181B" />
          <rect x="4" y="9" width="2" height="1" fill="#FFFFFF" />
          <rect x="14" y="9" width="2" height="1" fill="#FFFFFF" />
        </>
      );

    case 'monocle':
      return renderAccessoryWithFrogFace(
        <>
          {/* Golden Monocle with Chain */}
          <rect x="13" y="7" width="7" height="7" fill="#E0F2FE" />
          <rect x="13" y="7" width="7" height="1" fill="#D97706" />
          <rect x="13" y="13" width="7" height="1" fill="#D97706" />
          <rect x="13" y="7" width="1" height="7" fill="#D97706" />
          <rect x="19" y="7" width="1" height="7" fill="#D97706" />
          <rect x="14" y="8" width="1" height="1" fill="#FFFFFF" />
          {/* Chain */}
          <rect x="20" y="12" width="1" height="2" fill="#B45309" />
          <rect x="21" y="14" width="1" height="3" fill="#B45309" />
          <rect x="20" y="17" width="1" height="2" fill="#B45309" />
        </>
      );

    case 'blush_stars':
      return renderAccessoryWithFrogFace(
        <>
          {/* Twinkle Star Cheek Decals */}
          <rect x="3" y="10" width="5" height="3" fill="#FB7185" />
          <rect x="16" y="10" width="5" height="3" fill="#FB7185" />
          <rect x="5" y="9" width="2" height="2" fill="#FDE047" />
          <rect x="17" y="9" width="2" height="2" fill="#FDE047" />
        </>
      );

    case 'sparkles':
      return renderAccessoryWithFrogFace(
        <>
          <rect x="11" y="2" width="2" height="4" fill="#FACC15" />
          <rect x="10" y="3" width="4" height="2" fill="#FACC15" />
          <rect x="3" y="9" width="2" height="3" fill="#FEF08A" />
          <rect x="19" y="9" width="2" height="3" fill="#FEF08A" />
        </>
      );

    case 'eyepatch':
      return renderAccessoryWithFrogFace(
        <>
          <rect x="2" y="7" width="20" height="2" fill="#18181B" />
          <rect x="4" y="8" width="7" height="6" fill="#18181B" />
          <rect x="6" y="10" width="2" height="2" fill="#FFFFFF" />
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
          <rect x="5" y="7" width="14" height="13" fill="#78350F" />
          <rect x="6" y="8" width="12" height="11" fill="#FEF3C7" />
          <rect x="7" y="9" width="10" height="4" fill="#16A34A" />
          {/* Steam */}
          <rect x="10" y="3" width="1" height="3" fill="#94A3B8" />
          <rect x="13" y="2" width="1" height="3" fill="#94A3B8" />
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
          {/* Fawn Long Ears */}
          <rect x="4" y="3" width="3" height="5" fill="#B45309" />
          <rect x="5" y="4" width="2" height="3" fill="#FEF3C7" />
          <rect x="15" y="3" width="3" height="5" fill="#B45309" />
          <rect x="16" y="4" width="2" height="3" fill="#FEF3C7" />
          {/* Fawn Head */}
          <rect x="6" y="6" width="11" height="8" fill="#D97706" />
          <rect x="7" y="7" width="9" height="6" fill="#F59E0B" />
          {/* Big Glossy Eyes */}
          <rect x="7" y="8" width="2" height="3" fill="#18181B" />
          <rect x="7" y="8" width="1" height="1" fill="#FFFFFF" />
          <rect x="13" y="8" width="2" height="3" fill="#18181B" />
          <rect x="13" y="8" width="1" height="1" fill="#FFFFFF" />
          {/* Muzzle & Nose */}
          <rect x="8" y="11" width="5" height="3" fill="#FEF3C7" />
          <rect x="10" y="11" width="2" height="1" fill="#18181B" />
          {/* Resting Body with White Dappled Spots */}
          <rect x="5" y="14" width="14" height="7" fill="#B45309" />
          <rect x="6" y="15" width="12" height="5" fill="#D97706" />
          <rect x="8" y="15" width="2" height="2" fill="#FFFFFF" />
          <rect x="12" y="15" width="2" height="2" fill="#FFFFFF" />
          <rect x="15" y="16" width="2" height="2" fill="#FFFFFF" />
          {/* Fluffy White Tail */}
          <rect x="18" y="15" width="3" height="3" fill="#FFFFFF" />
        </svg>
      );

    case 'campfire_raccoon':
    case 'raccoon':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Pointy Raccoon Ears with White Tips */}
          <rect x="4" y="2" width="4" height="4" fill="#374151" />
          <rect x="5" y="3" width="2" height="2" fill="#FFFFFF" />
          <rect x="16" y="2" width="4" height="4" fill="#374151" />
          <rect x="17" y="3" width="2" height="2" fill="#FFFFFF" />
          {/* Head & Mask */}
          <rect x="5" y="5" width="14" height="8" fill="#9CA3AF" />
          <rect x="4" y="7" width="16" height="4" fill="#111827" />
          {/* Sparkling Cute Eyes inside Mask */}
          <rect x="7" y="8" width="2" height="2" fill="#FFFFFF" />
          <rect x="8" y="8" width="1" height="1" fill="#18181B" />
          <rect x="15" y="8" width="2" height="2" fill="#FFFFFF" />
          <rect x="16" y="8" width="1" height="1" fill="#18181B" />
          {/* White Snout & Nose */}
          <rect x="10" y="9" width="4" height="3" fill="#F3F4F6" />
          <rect x="11" y="9" width="2" height="1" fill="#18181B" />
          {/* Body Holding Marshmallow */}
          <rect x="6" y="13" width="12" height="8" fill="#4B5563" />
          <rect x="9" y="14" width="6" height="4" fill="#FEF3C7" />
          {/* Striped Ringed Tail */}
          <rect x="17" y="15" width="5" height="3" fill="#111827" />
          <rect x="19" y="17" width="4" height="3" fill="#9CA3AF" />
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
          {/* Calico Ears */}
          <rect x="5" y="4" width="4" height="4" fill="#18181B" />
          <rect x="15" y="4" width="4" height="4" fill="#EA580C" />
          {/* Head */}
          <rect x="5" y="7" width="14" height="8" fill="#1E293B" />
          <rect x="6" y="8" width="12" height="6" fill="#FFFFFF" />
          {/* Green Store Visor */}
          <rect x="5" y="7" width="14" height="2" fill="#10B981" />
          {/* Face */}
          <rect x="8" y="10" width="2" height="2" fill="#18181B" />
          <rect x="14" y="10" width="2" height="2" fill="#18181B" />
          <rect x="11" y="11" width="2" height="1" fill="#FB7185" />
          {/* Green Apron & Gold Coin */}
          <rect x="6" y="14" width="12" height="7" fill="#047857" />
          <rect x="7" y="15" width="10" height="5" fill="#10B981" />
          <rect x="11" y="16" width="2" height="3" fill="#FACC15" />
        </svg>
      );

    case 'snack_shiba':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Shiba Ears */}
          <rect x="6" y="3" width="3" height="4" fill="#78350F" />
          <rect x="15" y="3" width="3" height="4" fill="#78350F" />
          {/* Shiba Head */}
          <rect x="6" y="6" width="12" height="7" fill="#B45309" />
          <rect x="7" y="7" width="10" height="5" fill="#D97706" />
          <rect x="8" y="8" width="2" height="2" fill="#18181B" />
          <rect x="14" y="8" width="2" height="2" fill="#18181B" />
          <rect x="9" y="10" width="6" height="3" fill="#FFFFFF" />
          <rect x="11" y="10" width="2" height="1" fill="#18181B" />
          {/* Red Shopping Basket */}
          <rect x="3" y="12" width="18" height="9" fill="#991B1B" />
          <rect x="4" y="13" width="16" height="7" fill="#DC2626" />
          <rect x="2" y="10" width="5" height="5" fill="#FACC15" />
        </svg>
      );

    case 'chibi_wolf_pup':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Wolf Ears */}
          <rect x="4" y="2" width="4" height="4" fill="#1F2937" />
          <rect x="16" y="2" width="4" height="4" fill="#1F2937" />
          {/* Head & Body */}
          <rect x="5" y="5" width="14" height="8" fill="#1F2937" />
          <rect x="6" y="6" width="12" height="6" fill="#6B7280" />
          {/* Amber Eyes */}
          <rect x="8" y="7" width="2" height="2" fill="#FACC15" />
          <rect x="14" y="7" width="2" height="2" fill="#FACC15" />
          <rect x="9" y="8" width="1" height="1" fill="#000000" />
          <rect x="15" y="8" width="1" height="1" fill="#000000" />
          {/* White Snout */}
          <rect x="10" y="9" width="4" height="3" fill="#F3F4F6" />
          <rect x="11" y="9" width="2" height="1" fill="#18181B" />
          {/* Red Neckerchief */}
          <rect x="6" y="13" width="12" height="3" fill="#DC2626" />
          <rect x="6" y="16" width="12" height="6" fill="#4B5563" />
        </svg>
      );

    case 'forest_hedgehog':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Spiky Hedgehog Quills */}
          <rect x="4" y="4" width="4" height="4" fill="#451A03" />
          <rect x="9" y="3" width="4" height="4" fill="#451A03" />
          <rect x="14" y="4" width="4" height="4" fill="#451A03" />
          {/* Body */}
          <rect x="5" y="7" width="14" height="11" fill="#78350F" />
          <rect x="6" y="8" width="12" height="9" fill="#92400E" />
          {/* Red Strawberry on Back */}
          <rect x="7" y="3" width="5" height="5" fill="#DC2626" />
          <rect x="8" y="2" width="3" height="2" fill="#16A34A" />
          {/* Snout & Eye */}
          <rect x="17" y="11" width="5" height="5" fill="#FED7AA" />
          <rect x="20" y="12" width="2" height="2" fill="#18181B" />
          {/* Feet */}
          <rect x="6" y="18" width="4" height="3" fill="#451A03" />
          <rect x="14" y="18" width="4" height="3" fill="#451A03" />
        </svg>
      );

    case 'sushi_apprentice_cat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Calico Cat Ears (Left Orange, Right Charcoal) */}
          <rect x="5" y="3" width="4" height="4" fill="#EA580C" />
          <rect x="15" y="3" width="4" height="4" fill="#18181B" />
          {/* Head */}
          <rect x="5" y="6" width="14" height="8" fill="#1E293B" />
          <rect x="6" y="7" width="12" height="6" fill="#FFFFFF" />
          {/* Red Chef Headband */}
          <rect x="5" y="6" width="14" height="2" fill="#DC2626" />
          {/* Sapphire Blue Eyes */}
          <rect x="8" y="9" width="2" height="2" fill="#1E3A8A" />
          <rect x="14" y="9" width="2" height="2" fill="#1E3A8A" />
          <rect x="11" y="10" width="2" height="1" fill="#FB7185" />
          {/* Calico Body */}
          <rect x="6" y="14" width="12" height="7" fill="#CBD5E1" />
          <rect x="7" y="14" width="10" height="6" fill="#FFFFFF" />
          <rect x="7" y="15" width="4" height="4" fill="#FB923C" />
          <rect x="13" y="16" width="4" height="3" fill="#1E293B" />
          {/* Wooden Platter with Salmon Nigiri Held */}
          <rect x="14" y="13" width="8" height="4" fill="#78350F" />
          <rect x="15" y="12" width="6" height="2" fill="#FB923C" />
          <rect x="17" y="12" width="2" height="4" fill="#15803D" />
        </svg>
      );

    case 'mini_ebi_shrimp':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Crispy Golden Tempura Prawn Body */}
          <rect x="5" y="8" width="14" height="9" fill="#C2410C" />
          <rect x="6" y="9" width="12" height="7" fill="#F97316" />
          <rect x="8" y="10" width="6" height="4" fill="#FED7AA" />
          {/* Crispy Tail */}
          <rect x="18" y="6" width="4" height="4" fill="#DC2626" />
          <rect x="18" y="13" width="4" height="4" fill="#DC2626" />
          {/* Face */}
          <rect x="7" y="11" width="2" height="2" fill="#18181B" />
          <rect x="7" y="13" width="2" height="1" fill="#FB7185" />
        </svg>
      );

    case 'snail':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Spiral Shell */}
          <rect x="5" y="7" width="10" height="10" fill="#78350F" />
          <rect x="6" y="8" width="8" height="8" fill="#D97706" />
          <rect x="8" y="10" width="4" height="4" fill="#FEF3C7" />
          {/* Snail Body & Foot */}
          <rect x="3" y="15" width="18" height="4" fill="#A3E635" />
          <rect x="16" y="10" width="4" height="6" fill="#A3E635" />
          {/* Eyestalks */}
          <rect x="17" y="6" width="2" height="4" fill="#15803D" />
          <rect x="17" y="5" width="2" height="2" fill="#18181B" />
        </svg>
      );

    case 'crab':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Big Snapping Claws */}
          <rect x="3" y="6" width="5" height="5" fill="#DC2626" />
          <rect x="16" y="6" width="5" height="5" fill="#DC2626" />
          {/* Body */}
          <rect x="6" y="9" width="12" height="9" fill="#7F1D1D" />
          <rect x="7" y="10" width="10" height="7" fill="#EF4444" />
          {/* Eyes */}
          <rect x="9" y="8" width="2" height="2" fill="#FFFFFF" />
          <rect x="13" y="8" width="2" height="2" fill="#FFFFFF" />
          <rect x="9" y="8" width="1" height="1" fill="#18181B" />
          <rect x="13" y="8" width="1" height="1" fill="#18181B" />
          {/* Walking Legs */}
          <rect x="4" y="17" width="3" height="3" fill="#7F1D1D" />
          <rect x="17" y="17" width="3" height="3" fill="#7F1D1D" />
        </svg>
      );

    case 'fireflies':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          <rect x="6" y="6" width="4" height="4" fill="#FACC15" />
          <rect x="7" y="7" width="2" height="2" fill="#FFFFFF" />
          <rect x="14" y="12" width="5" height="5" fill="#FACC15" />
          <rect x="15" y="13" width="3" height="3" fill="#FFFFFF" />
          <rect x="16" y="4" width="3" height="3" fill="#FEF08A" />
        </svg>
      );

    case 'butterfly':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Left Wing */}
          <rect x="4" y="5" width="7" height="7" fill="#0284C7" />
          <rect x="5" y="6" width="5" height="5" fill="#38BDF8" />
          <rect x="6" y="12" width="5" height="6" fill="#38BDF8" />
          {/* Right Wing */}
          <rect x="13" y="5" width="7" height="7" fill="#0284C7" />
          <rect x="14" y="6" width="5" height="5" fill="#38BDF8" />
          <rect x="13" y="12" width="5" height="6" fill="#38BDF8" />
          {/* Body */}
          <rect x="11" y="4" width="2" height="15" fill="#0F172A" />
        </svg>
      );

    case 'koi':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Koi Fish Body */}
          <rect x="4" y="8" width="14" height="8" fill="#FFFFFF" />
          <rect x="6" y="7" width="10" height="10" fill="#FFFFFF" />
          <rect x="8" y="8" width="6" height="5" fill="#DC2626" />
          <rect x="4" y="10" width="3" height="3" fill="#18181B" />
          {/* Tail Fin */}
          <rect x="17" y="6" width="4" height="4" fill="#DC2626" />
          <rect x="17" y="14" width="4" height="4" fill="#DC2626" />
        </svg>
      );

    case 'duckling':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Yellow Duck Head & Body */}
          <rect x="6" y="5" width="7" height="7" fill="#FACC15" />
          <rect x="10" y="10" width="9" height="8" fill="#FACC15" />
          <rect x="8" y="7" width="2" height="2" fill="#18181B" />
          {/* Orange Beak */}
          <rect x="2" y="7" width="4" height="3" fill="#EA580C" />
          {/* Wing & Feet */}
          <rect x="12" y="12" width="5" height="4" fill="#EAB308" />
          <rect x="12" y="18" width="3" height="2" fill="#EA580C" />
          <rect x="16" y="18" width="3" height="2" fill="#EA580C" />
        </svg>
      );

    case 'cat':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Black Cat Ears */}
          <rect x="5" y="4" width="4" height="4" fill="#18181B" />
          <rect x="15" y="4" width="4" height="4" fill="#18181B" />
          {/* Head & Body */}
          <rect x="6" y="7" width="12" height="11" fill="#18181B" />
          <rect x="8" y="9" width="2" height="2" fill="#FACC15" />
          <rect x="14" y="9" width="2" height="2" fill="#FACC15" />
          {/* Collar & Bell */}
          <rect x="7" y="14" width="10" height="2" fill="#DC2626" />
          <rect x="11" y="15" width="2" height="2" fill="#FACC15" />
        </svg>
      );

    case 'turtle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...pixelStyle} className={className}>
          {/* Mossy Shell */}
          <rect x="7" y="6" width="12" height="12" fill="#14532D" />
          <rect x="8" y="7" width="10" height="10" fill="#65A30D" />
          {/* Head */}
          <rect x="3" y="10" width="5" height="5" fill="#84CC16" />
          <rect x="4" y="11" width="1" height="1" fill="#18181B" />
          {/* Flippers */}
          <rect x="6" y="17" width="4" height="3" fill="#166534" />
          <rect x="16" y="17" width="4" height="3" fill="#166534" />
        </svg>
      );

    // -----------------------------------------------------------
    // F. HABITATS & SCENES (Mini Isometric Pixel Dioramas)
    // -----------------------------------------------------------
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
          <rect x="2" y="2" width="20" height="20" fill="#D4BE9C" />
          <rect x="6" y="6" width="12" height="12" fill="#85532A" />
          <rect x="8" y="8" width="8" height="8" fill="#FEF3C7" />
          <rect x="2" y="18" width="20" height="4" fill="#DFC09C" />
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
