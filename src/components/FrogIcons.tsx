import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

// -------------------------------------------------------------
// PIXEL ART CROAKLE MOOD ICONS (Based on 16-Frog Pixel Sheet)
// -------------------------------------------------------------

/** 5 - Rad / Sparkle Eyes (Yellow / Neon Theme): Pixel Frog with electric yellow skin, sparkling star eyes & open laughing mouth */
export const FrogMoodRad: React.FC<IconProps> = ({ size = 32, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Floating Sparkles Top Left */}
    <rect x="1" y="1" width="1" height="2" fill="#0D226B" />
    <rect x="0" y="2" width="3" height="1" fill="#0D226B" />
    <rect x="1" y="2" width="1" height="1" fill="#FDE047" />
    <rect x="2" y="0" width="1" height="1" fill="#FEF08A" />

    {/* Floating Sparkles Top Right */}
    <rect x="18" y="1" width="1" height="2" fill="#0D226B" />
    <rect x="17" y="2" width="3" height="1" fill="#0D226B" />
    <rect x="18" y="2" width="1" height="1" fill="#FDE047" />
    <rect x="17" y="0" width="1" height="1" fill="#FEF08A" />

    {/* Dark Navy Outline */}
    <rect x="4" y="2" width="4" height="1" fill="#0D226B" />
    <rect x="3" y="3" width="1" height="2" fill="#0D226B" />
    <rect x="8" y="3" width="1" height="2" fill="#0D226B" />
    <rect x="8" y="4" width="4" height="1" fill="#0D226B" />
    <rect x="12" y="2" width="4" height="1" fill="#0D226B" />
    <rect x="11" y="3" width="1" height="2" fill="#0D226B" />
    <rect x="16" y="3" width="1" height="2" fill="#0D226B" />
    <rect x="2" y="5" width="1" height="7" fill="#0D226B" />
    <rect x="17" y="5" width="1" height="7" fill="#0D226B" />
    <rect x="3" y="13" width="14" height="1" fill="#0D226B" />
    <rect x="4" y="12" width="3" height="1" fill="#0D226B" />
    <rect x="13" y="12" width="3" height="1" fill="#0D226B" />

    {/* Electric Neon Yellow Main Body Fill (เหลือง) */}
    <rect x="4" y="3" width="4" height="2" fill="#FDE047" />
    <rect x="12" y="3" width="4" height="2" fill="#FDE047" />
    <rect x="3" y="5" width="14" height="7" fill="#FDE047" />
    <rect x="4" y="12" width="12" height="1" fill="#FDE047" />

    {/* Bottom-Right Warm Amber Shadow */}
    <rect x="13" y="8" width="4" height="4" fill="#EAB308" />
    <rect x="11" y="10" width="2" height="2" fill="#EAB308" />
    <rect x="13" y="12" width="3" height="1" fill="#CA8A04" />

    {/* Coral / Rose Blush Cheeks */}
    <rect x="3" y="7" width="2" height="1" fill="#FB7185" />
    <rect x="15" y="7" width="2" height="1" fill="#FB7185" />

    {/* Left Eye Sparkle Star */}
    <rect x="5" y="2" width="1" height="3" fill="#FFFFFF" />
    <rect x="4" y="3" width="3" height="1" fill="#FFFFFF" />
    <rect x="5" y="3" width="1" height="1" fill="#FEF08A" />
    <rect x="4" y="2" width="1" height="1" fill="#0D226B" />
    <rect x="6" y="2" width="1" height="1" fill="#0D226B" />
    <rect x="4" y="4" width="1" height="1" fill="#0D226B" />
    <rect x="6" y="4" width="1" height="1" fill="#0D226B" />

    {/* Right Eye Sparkle Star */}
    <rect x="13" y="2" width="1" height="3" fill="#FFFFFF" />
    <rect x="12" y="3" width="3" height="1" fill="#FFFFFF" />
    <rect x="13" y="3" width="1" height="1" fill="#FEF08A" />
    <rect x="12" y="2" width="1" height="1" fill="#0D226B" />
    <rect x="14" y="2" width="1" height="1" fill="#0D226B" />
    <rect x="12" y="4" width="1" height="1" fill="#0D226B" />
    <rect x="14" y="4" width="1" height="1" fill="#0D226B" />

    {/* Open Laughing Mouth */}
    <rect x="7" y="6" width="6" height="1" fill="#0D226B" />
    <rect x="7" y="7" width="6" height="2" fill="#0D226B" />
    <rect x="8" y="7" width="4" height="2" fill="#D92B54" />
    <rect x="8" y="8" width="4" height="1" fill="#FFA0B8" />
  </svg>
);

/** 4 - Good / Happy (Pink / Neon Theme): Pixel Frog with sweet sakura neon pink skin, joyful open smile & bright round eyes */
export const FrogMoodGood: React.FC<IconProps> = ({ size = 32, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Dark Navy Outline */}
    <rect x="4" y="2" width="4" height="1" fill="#0D226B" />
    <rect x="3" y="3" width="1" height="2" fill="#0D226B" />
    <rect x="8" y="3" width="1" height="2" fill="#0D226B" />
    <rect x="8" y="4" width="4" height="1" fill="#0D226B" />
    <rect x="12" y="2" width="4" height="1" fill="#0D226B" />
    <rect x="11" y="3" width="1" height="2" fill="#0D226B" />
    <rect x="16" y="3" width="1" height="2" fill="#0D226B" />
    <rect x="2" y="5" width="1" height="7" fill="#0D226B" />
    <rect x="17" y="5" width="1" height="7" fill="#0D226B" />
    <rect x="3" y="13" width="14" height="1" fill="#0D226B" />
    <rect x="4" y="12" width="3" height="1" fill="#0D226B" />
    <rect x="13" y="12" width="3" height="1" fill="#0D226B" />

    {/* Vibrant Sakura Neon Pink Main Body Fill (ชมพู) */}
    <rect x="4" y="3" width="4" height="2" fill="#F472B6" />
    <rect x="12" y="3" width="4" height="2" fill="#F472B6" />
    <rect x="3" y="5" width="14" height="7" fill="#F472B6" />
    <rect x="4" y="12" width="12" height="1" fill="#F472B6" />

    {/* Bottom-Right Raspberry Magenta Shadow */}
    <rect x="13" y="8" width="4" height="4" fill="#DB2777" />
    <rect x="11" y="10" width="2" height="2" fill="#DB2777" />
    <rect x="13" y="12" width="3" height="1" fill="#BE185D" />

    {/* Soft Rosy Blush Cheeks */}
    <rect x="3" y="7" width="2" height="1" fill="#FDA4AF" />
    <rect x="15" y="7" width="2" height="1" fill="#FDA4AF" />

    {/* Left Eye */}
    <rect x="4" y="3" width="3" height="2" fill="#0D226B" />
    <rect x="4" y="3" width="2" height="1" fill="#5076F2" />
    <rect x="4" y="3" width="1" height="1" fill="#FFFFFF" />

    {/* Right Eye */}
    <rect x="13" y="3" width="3" height="2" fill="#0D226B" />
    <rect x="13" y="3" width="2" height="1" fill="#5076F2" />
    <rect x="13" y="3" width="1" height="1" fill="#FFFFFF" />

    {/* Open Happy Laughing Smile Mouth */}
    <rect x="7" y="6" width="6" height="1" fill="#0D226B" />
    <rect x="7" y="7" width="6" height="2" fill="#0D226B" />
    <rect x="8" y="7" width="4" height="2" fill="#D92B54" />
    <rect x="8" y="8" width="4" height="1" fill="#FFA0B8" />
  </svg>
);

/** 3 - Meh / Chill (Green / Neon Theme): Pixel Frog with lime neon green skin, skeptical side-glance & tiny neutral mouth */
export const FrogMoodMeh: React.FC<IconProps> = ({ size = 32, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Dark Navy Outline */}
    <rect x="4" y="2" width="4" height="1" fill="#0D226B" />
    <rect x="3" y="3" width="1" height="2" fill="#0D226B" />
    <rect x="8" y="3" width="1" height="2" fill="#0D226B" />
    <rect x="8" y="4" width="4" height="1" fill="#0D226B" />
    <rect x="12" y="2" width="4" height="1" fill="#0D226B" />
    <rect x="11" y="3" width="1" height="2" fill="#0D226B" />
    <rect x="16" y="3" width="1" height="2" fill="#0D226B" />
    <rect x="2" y="5" width="1" height="7" fill="#0D226B" />
    <rect x="17" y="5" width="1" height="7" fill="#0D226B" />
    <rect x="3" y="13" width="14" height="1" fill="#0D226B" />
    <rect x="4" y="12" width="3" height="1" fill="#0D226B" />
    <rect x="13" y="12" width="3" height="1" fill="#0D226B" />

    {/* Vibrant Fresh Lime / Neon Green Main Body Fill (เขียว) */}
    <rect x="4" y="3" width="4" height="2" fill="#84E42B" />
    <rect x="12" y="3" width="4" height="2" fill="#84E42B" />
    <rect x="3" y="5" width="14" height="7" fill="#84E42B" />
    <rect x="4" y="12" width="12" height="1" fill="#84E42B" />

    {/* Bottom-Right Forest Emerald Shadow */}
    <rect x="13" y="8" width="4" height="4" fill="#16A34A" />
    <rect x="11" y="10" width="2" height="2" fill="#16A34A" />
    <rect x="13" y="12" width="3" height="1" fill="#15803D" />

    {/* Pink Blush Cheeks */}
    <rect x="3" y="7" width="2" height="1" fill="#FFA0B8" />
    <rect x="15" y="7" width="2" height="1" fill="#FFA0B8" />

    {/* Left Eye */}
    <rect x="4" y="3" width="3" height="2" fill="#0D226B" />
    <rect x="4" y="3" width="2" height="1" fill="#5076F2" />

    {/* Right Eye */}
    <rect x="13" y="3" width="3" height="2" fill="#0D226B" />
    <rect x="13" y="3" width="2" height="1" fill="#5076F2" />

    {/* Tiny Neutral Dot Mouth */}
    <rect x="9" y="7" width="2" height="1" fill="#0D226B" />
  </svg>
);

/** 2 - Bad / Sad (Blue / Sky Blue / Neon Theme): Pixel Frog with electric sky blue skin & sad downward frown */
export const FrogMoodBad: React.FC<IconProps> = ({ size = 32, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Dark Navy Outline */}
    <rect x="4" y="2" width="4" height="1" fill="#0D226B" />
    <rect x="3" y="3" width="1" height="2" fill="#0D226B" />
    <rect x="8" y="3" width="1" height="2" fill="#0D226B" />
    <rect x="8" y="4" width="4" height="1" fill="#0D226B" />
    <rect x="12" y="2" width="4" height="1" fill="#0D226B" />
    <rect x="11" y="3" width="1" height="2" fill="#0D226B" />
    <rect x="16" y="3" width="1" height="2" fill="#0D226B" />
    <rect x="2" y="5" width="1" height="7" fill="#0D226B" />
    <rect x="17" y="5" width="1" height="7" fill="#0D226B" />
    <rect x="3" y="13" width="14" height="1" fill="#0D226B" />
    <rect x="4" y="12" width="3" height="1" fill="#0D226B" />
    <rect x="13" y="12" width="3" height="1" fill="#0D226B" />

    {/* Electric Sky Blue / Neon Cyan Main Body Fill (ฟ้า) */}
    <rect x="4" y="3" width="4" height="2" fill="#38BDF8" />
    <rect x="12" y="3" width="4" height="2" fill="#38BDF8" />
    <rect x="3" y="5" width="14" height="7" fill="#38BDF8" />
    <rect x="4" y="12" width="12" height="1" fill="#38BDF8" />

    {/* Bottom-Right Cobalt Shadow */}
    <rect x="13" y="8" width="4" height="4" fill="#0284C7" />
    <rect x="11" y="10" width="2" height="2" fill="#0284C7" />
    <rect x="13" y="12" width="3" height="1" fill="#0369A1" />

    {/* Soft Blush Cheeks */}
    <rect x="3" y="7" width="2" height="1" fill="#BAE6FD" />
    <rect x="15" y="7" width="2" height="1" fill="#BAE6FD" />

    {/* Left Eye */}
    <rect x="4" y="3" width="3" height="2" fill="#0D226B" />
    <rect x="4" y="3" width="2" height="1" fill="#5076F2" />

    {/* Right Eye */}
    <rect x="13" y="3" width="3" height="2" fill="#0D226B" />
    <rect x="13" y="3" width="2" height="1" fill="#5076F2" />

    {/* Downward Sad Curved Frown Mouth */}
    <rect x="8" y="7" width="4" height="1" fill="#0D226B" />
    <rect x="7" y="8" width="1" height="2" fill="#0D226B" />
    <rect x="12" y="8" width="1" height="2" fill="#0D226B" />
  </svg>
);

/** 1 - Awful / Crying Waterfall Tears (Black / Dark Obsidian & Neon Cyan Tears Theme): Pixel Frog with sleek black skin & streaming neon tears */
export const FrogMoodAwful: React.FC<IconProps> = ({ size = 32, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Dark Midnight Outline */}
    <rect x="4" y="2" width="4" height="1" fill="#09090B" />
    <rect x="3" y="3" width="1" height="2" fill="#09090B" />
    <rect x="8" y="3" width="1" height="2" fill="#09090B" />
    <rect x="8" y="4" width="4" height="1" fill="#09090B" />
    <rect x="12" y="2" width="4" height="1" fill="#09090B" />
    <rect x="11" y="3" width="1" height="2" fill="#09090B" />
    <rect x="16" y="3" width="1" height="2" fill="#09090B" />
    <rect x="2" y="5" width="1" height="7" fill="#09090B" />
    <rect x="17" y="5" width="1" height="7" fill="#09090B" />
    <rect x="3" y="13" width="14" height="1" fill="#09090B" />
    <rect x="4" y="12" width="3" height="1" fill="#09090B" />
    <rect x="13" y="12" width="3" height="1" fill="#09090B" />

    {/* Sleek Dark Obsidian / Charcoal Black Main Body Fill (ดำ) */}
    <rect x="4" y="3" width="4" height="2" fill="#3F3F46" />
    <rect x="12" y="3" width="4" height="2" fill="#3F3F46" />
    <rect x="3" y="5" width="14" height="7" fill="#3F3F46" />
    <rect x="4" y="12" width="12" height="1" fill="#3F3F46" />

    {/* Bottom-Right Jet Black Shadow */}
    <rect x="13" y="8" width="4" height="4" fill="#18181B" />
    <rect x="11" y="10" width="2" height="2" fill="#18181B" />
    <rect x="13" y="12" width="3" height="1" fill="#09090B" />

    {/* Muted Slate Mauve Blush */}
    <rect x="3" y="7" width="2" height="1" fill="#71717A" />
    <rect x="15" y="7" width="2" height="1" fill="#71717A" />

    {/* Left Eye */}
    <rect x="4" y="3" width="3" height="2" fill="#09090B" />
    <rect x="4" y="3" width="2" height="1" fill="#60A5FA" />

    {/* Right Eye */}
    <rect x="13" y="3" width="3" height="2" fill="#09090B" />
    <rect x="13" y="3" width="2" height="1" fill="#60A5FA" />

    {/* Radiant Neon Cyan Waterfall Tears Stream Left */}
    <rect x="4" y="5" width="2" height="8" fill="#00F0FF" />
    <rect x="4" y="5" width="1" height="7" fill="#BAE6FD" />

    {/* Radiant Neon Cyan Waterfall Tears Stream Right */}
    <rect x="14" y="5" width="2" height="8" fill="#00F0FF" />
    <rect x="14" y="5" width="1" height="7" fill="#BAE6FD" />

    {/* Downward Sad Curved Frown Mouth */}
    <rect x="8" y="7" width="4" height="1" fill="#09090B" />
    <rect x="7" y="8" width="1" height="2" fill="#09090B" />
    <rect x="12" y="8" width="1" height="2" fill="#09090B" />
  </svg>
);

// -------------------------------------------------------------
// PIXEL ART CROAKLE YARD & ITEMS ICONS (24x24 / 32x32 Grid)
// -------------------------------------------------------------

/** Pixel 4-Leaf Clover */
export const CloverIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Top Leaf */}
    <rect x="10" y="3" width="4" height="2" fill="#2D5A1E" />
    <rect x="9" y="5" width="6" height="4" fill="#75AC56" />
    <rect x="10" y="5" width="2" height="2" fill="#A3E635" />

    {/* Bottom Leaf */}
    <rect x="9" y="13" width="6" height="4" fill="#659B49" />
    <rect x="10" y="17" width="4" height="2" fill="#2D5A1E" />

    {/* Left Leaf */}
    <rect x="3" y="10" width="2" height="4" fill="#2D5A1E" />
    <rect x="5" y="9" width="4" height="6" fill="#88C464" />
    <rect x="5" y="10" width="2" height="2" fill="#A3E635" />

    {/* Right Leaf */}
    <rect x="13" y="9" width="4" height="6" fill="#75AC56" />
    <rect x="17" y="10" width="2" height="4" fill="#2D5A1E" />

    {/* Center Glow */}
    <rect x="11" y="11" width="2" height="2" fill="#FEF08A" />

    {/* Stem */}
    <rect x="11" y="15" width="2" height="6" fill="#3E6B2C" />
    <rect x="9" y="21" width="3" height="2" fill="#2D4C20" />
  </svg>
);

/** Pixel 3-Leaf Clover */
export const ThreeLeafCloverIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Top Leaf */}
    <rect x="10" y="4" width="4" height="2" fill="#2D5A1E" />
    <rect x="9" y="6" width="6" height="4" fill="#75AC56" />
    {/* Left Leaf */}
    <rect x="4" y="11" width="2" height="4" fill="#2D5A1E" />
    <rect x="6" y="10" width="4" height="5" fill="#88C464" />
    {/* Right Leaf */}
    <rect x="14" y="10" width="4" height="5" fill="#75AC56" />
    <rect x="18" y="11" width="2" height="4" fill="#2D5A1E" />
    {/* Center */}
    <rect x="11" y="11" width="2" height="2" fill="#88C464" />
    {/* Stem */}
    <rect x="11" y="13" width="2" height="7" fill="#3E6B2C" />
    <rect x="9" y="20" width="3" height="2" fill="#2D4C20" />
  </svg>
);

/** Pixel Frog Backpack / Furoshiki Bindle */
export const FrogBackpackIcon: React.FC<IconProps> = ({ size = 28, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Top Knot */}
    <rect x="10" y="3" width="4" height="3" fill="#2E506D" />
    <rect x="8" y="5" width="8" height="2" fill="#1F364A" />

    {/* Blue Spotted Furoshiki Body */}
    <rect x="5" y="7" width="14" height="12" fill="#4B779E" />
    <rect x="4" y="9" width="1" height="8" fill="#1F364A" />
    <rect x="19" y="9" width="1" height="8" fill="#1F364A" />
    <rect x="7" y="19" width="10" height="2" fill="#1F364A" />

    {/* White Polka Dots */}
    <rect x="7" y="9" width="2" height="2" fill="#E8F1F8" />
    <rect x="14" y="9" width="2" height="2" fill="#E8F1F8" />
    <rect x="10" y="13" width="2" height="2" fill="#E8F1F8" />
    <rect x="7" y="16" width="2" height="2" fill="#E8F1F8" />
    <rect x="15" y="16" width="2" height="2" fill="#E8F1F8" />

    {/* Hanging Wooden Charm */}
    <rect x="17" y="13" width="2" height="1" fill="#A86B32" />
    <rect x="17" y="14" width="4" height="5" fill="#DDB27C" />
    <rect x="18" y="15" width="2" height="3" fill="#854D0E" />
  </svg>
);

/** Pixel Maimai Snail Friend */
export const SnailFriendIcon: React.FC<IconProps> = ({ size = 32, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Eyestalks */}
    <rect x="17" y="5" width="2" height="2" fill="#4A3D2A" />
    <rect x="20" y="7" width="2" height="2" fill="#4A3D2A" />
    <rect x="18" y="7" width="1" height="4" fill="#4A3D2A" />
    <rect x="20" y="9" width="1" height="3" fill="#4A3D2A" />

    {/* Snail Shell */}
    <rect x="6" y="7" width="10" height="9" fill="#E2CCAB" />
    <rect x="5" y="8" width="1" height="7" fill="#4A3D2A" />
    <rect x="16" y="8" width="1" height="7" fill="#4A3D2A" />
    <rect x="8" y="6" width="6" height="1" fill="#4A3D2A" />
    {/* Swirl */}
    <rect x="8" y="9" width="6" height="2" fill="#7D6242" />
    <rect x="12" y="11" width="2" height="3" fill="#7D6242" />
    <rect x="9" y="12" width="3" height="1" fill="#7D6242" />

    {/* Snail Soft Body */}
    <rect x="3" y="16" width="19" height="3" fill="#F2E6CA" />
    <rect x="2" y="17" width="20" height="1" fill="#4A3D2A" />
    <rect x="18" y="11" width="3" height="5" fill="#F2E6CA" />
  </svg>
);

/** Pixel Kani Crab Friend */
export const CrabFriendIcon: React.FC<IconProps> = ({ size = 32, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Claws */}
    <rect x="3" y="5" width="4" height="4" fill="#D95C3C" />
    <rect x="4" y="6" width="2" height="2" fill="#EAA187" />
    <rect x="17" y="5" width="4" height="4" fill="#D95C3C" />
    <rect x="18" y="6" width="2" height="2" fill="#EAA187" />

    {/* Eyes */}
    <rect x="8" y="7" width="2" height="2" fill="#FFFFFF" />
    <rect x="8" y="8" width="1" height="1" fill="#18181B" />
    <rect x="14" y="7" width="2" height="2" fill="#FFFFFF" />
    <rect x="14" y="8" width="1" height="1" fill="#18181B" />

    {/* Shell Body */}
    <rect x="5" y="9" width="14" height="7" fill="#D95C3C" />
    <rect x="4" y="10" width="1" height="5" fill="#3A2218" />
    <rect x="19" y="10" width="1" height="5" fill="#3A2218" />
    <rect x="7" y="11" width="10" height="3" fill="#EAA187" />

    {/* Legs */}
    <rect x="3" y="16" width="2" height="3" fill="#3A2218" />
    <rect x="6" y="16" width="2" height="3" fill="#3A2218" />
    <rect x="16" y="16" width="2" height="3" fill="#3A2218" />
    <rect x="19" y="16" width="2" height="3" fill="#3A2218" />
  </svg>
);

/** Pixel Scone Item */
export const SconeItemIcon: React.FC<IconProps> = ({ size = 28, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Baked Scone */}
    <rect x="7" y="7" width="10" height="5" fill="#E8C488" />
    <rect x="9" y="5" width="6" height="2" fill="#E8C488" />
    {/* Blueberries / Raisins */}
    <rect x="9" y="8" width="2" height="2" fill="#4B3454" />
    <rect x="14" y="7" width="2" height="2" fill="#4B3454" />

    {/* Checkered Pink Cloth */}
    <rect x="5" y="12" width="14" height="2" fill="#F0B6BA" />
    <rect x="7" y="12" width="2" height="2" fill="#FFFFFF" />
    <rect x="13" y="12" width="2" height="2" fill="#FFFFFF" />

    {/* Basket Tray */}
    <rect x="4" y="14" width="16" height="6" fill="#B3804D" />
    <rect x="3" y="14" width="1" height="5" fill="#4A3016" />
    <rect x="20" y="14" width="1" height="5" fill="#4A3016" />
    <rect x="5" y="20" width="14" height="1" fill="#4A3016" />
    {/* Weave Slats */}
    <rect x="8" y="14" width="1" height="6" fill="#8C5C2D" />
    <rect x="12" y="14" width="1" height="6" fill="#8C5C2D" />
    <rect x="16" y="14" width="1" height="6" fill="#8C5C2D" />
  </svg>
);

/** Pixel Sandwich Item */
export const SandwichItemIcon: React.FC<IconProps> = ({ size = 28, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Triangle Sandwich Bread */}
    <rect x="11" y="4" width="2" height="2" fill="#F0DEC0" />
    <rect x="9" y="6" width="6" height="2" fill="#F0DEC0" />
    <rect x="7" y="8" width="10" height="2" fill="#F0DEC0" />
    <rect x="6" y="10" width="12" height="2" fill="#68A34A" /> {/* Lettuce */}
    <rect x="6" y="12" width="12" height="1" fill="#D95C3C" /> {/* Tomato */}
    <rect x="6" y="13" width="12" height="1" fill="#EDB23C" /> {/* Cheese */}
    <rect x="5" y="14" width="14" height="3" fill="#F0DEC0" /> {/* Bottom bread */}
    <rect x="4" y="17" width="16" height="3" fill="#B3804D" /> {/* Basket */}
  </svg>
);

/** Pixel Onigiri Item */
export const OnigiriItemIcon: React.FC<IconProps> = ({ size = 28, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Bamboo leaf base */}
    <rect x="4" y="17" width="16" height="3" fill="#75A65A" />
    {/* Triangular White Rice */}
    <rect x="11" y="4" width="2" height="2" fill="#FFFFFF" />
    <rect x="9" y="6" width="6" height="2" fill="#FFFFFF" />
    <rect x="7" y="8" width="10" height="2" fill="#FFFFFF" />
    <rect x="6" y="10" width="12" height="7" fill="#FFFFFF" />
    {/* Red Umeboshi Plum dot */}
    <rect x="11" y="9" width="2" height="2" fill="#C43D43" />
    {/* Nori Seaweed Wrap */}
    <rect x="9" y="13" width="6" height="4" fill="#252F2B" />
  </svg>
);

/** Pixel Bell Charm */
export const BellCharmIcon: React.FC<IconProps> = ({ size = 28, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Cord Loop */}
    <rect x="11" y="2" width="2" height="4" fill="#4AA4A8" />
    <rect x="10" y="6" width="4" height="2" fill="#D98A3C" />
    {/* Wooden Bell Cylinder */}
    <rect x="8" y="8" width="8" height="9" fill="#C99863" />
    <rect x="7" y="9" width="1" height="7" fill="#4A3016" />
    <rect x="16" y="9" width="1" height="7" fill="#4A3016" />
    <rect x="10" y="12" width="4" height="1" fill="#4A3016" />
    <rect x="11" y="15" width="2" height="2" fill="#4A3016" />
    {/* Hanging Tassel */}
    <rect x="11" y="17" width="2" height="5" fill="#4AA4A8" />
  </svg>
);

/** Pixel Lantern Tool */
export const LanternToolIcon: React.FC<IconProps> = ({ size = 28, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Handle */}
    <rect x="9" y="2" width="6" height="2" fill="#4A3016" />
    <rect x="7" y="4" width="10" height="2" fill="#3D3025" />
    {/* Glowing Paper Body */}
    <rect x="6" y="6" width="12" height="11" fill="#FCE59F" />
    <rect x="5" y="8" width="1" height="7" fill="#4A3016" />
    <rect x="18" y="8" width="1" height="7" fill="#4A3016" />
    {/* Flame inside */}
    <rect x="11" y="10" width="2" height="3" fill="#E86E3C" />
    <rect x="11" y="11" width="2" height="2" fill="#FFF3B0" />
    {/* Bottom Cap & Tassel */}
    <rect x="7" y="17" width="10" height="2" fill="#3D3025" />
    <rect x="11" y="19" width="2" height="3" fill="#C43D43" />
  </svg>
);

/** Pixel Postcard Stamp */
export const PostcardStampIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Stamp Scalloped Border */}
    <rect x="3" y="3" width="18" height="18" fill="#FAF5ED" />
    <rect x="5" y="5" width="14" height="14" fill="#E6D3BA" />
    {/* Mini Pixel Frog in Stamp */}
    <rect x="9" y="8" width="6" height="4" fill="#6B9B52" />
    <rect x="8" y="9" width="1" height="1" fill="#2D3A20" />
    <rect x="15" y="9" width="1" height="1" fill="#2D3A20" />
    <rect x="8" y="12" width="8" height="3" fill="#6B9B52" />
  </svg>
);

// -------------------------------------------------------------
// DYNAMIC PIXEL ART HABITAT & CHARACTER ICONS (24x24 Pixel Grid)
// -------------------------------------------------------------

/** 1. Scenes */
export const PixelZenPondIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Water Background */}
    <rect x="2" y="16" width="20" height="6" fill="#6EA8C2" />
    <rect x="4" y="15" width="16" height="1" fill="#88C2DC" />
    <rect x="3" y="18" width="5" height="1" fill="#A4D8EE" />
    <rect x="15" y="19" width="6" height="1" fill="#A4D8EE" />
    {/* Lily Pad */}
    <rect x="4" y="14" width="10" height="4" fill="#4B773E" />
    <rect x="5" y="13" width="8" height="1" fill="#69A255" />
    <rect x="9" y="14" width="2" height="3" fill="#2E4C24" />
    {/* Pink Lotus Flower */}
    <rect x="7" y="9" width="4" height="4" fill="#F472B6" />
    <rect x="6" y="10" width="6" height="3" fill="#FB7185" />
    <rect x="8" y="7" width="2" height="2" fill="#FDA4AF" />
    <rect x="7" y="10" width="4" height="2" fill="#FFE4E6" />
    <rect x="8" y="9" width="2" height="2" fill="#FDE047" />
    {/* Stone Lantern on Top Right */}
    <rect x="17" y="7" width="4" height="2" fill="#71717A" />
    <rect x="16" y="9" width="6" height="1" fill="#52525B" />
    <rect x="18" y="10" width="2" height="3" fill="#FEF08A" />
    <rect x="17" y="13" width="4" height="3" fill="#71717A" />
  </svg>
);

export const PixelTreehouseIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Tree Foliage */}
    <rect x="4" y="3" width="16" height="8" fill="#5F8C4A" />
    <rect x="2" y="5" width="20" height="5" fill="#4B773E" />
    <rect x="6" y="2" width="12" height="2" fill="#7DB364" />
    <rect x="5" y="4" width="3" height="3" fill="#88C464" />
    {/* Chimney & Smoke */}
    <rect x="16" y="2" width="2" height="3" fill="#854D0E" />
    <rect x="17" y="1" width="1" height="1" fill="#E2E8F0" />
    {/* Red Roof */}
    <rect x="7" y="7" width="10" height="3" fill="#C43D43" />
    <rect x="9" y="5" width="6" height="2" fill="#E15B64" />
    {/* Wood Cabin */}
    <rect x="8" y="10" width="8" height="7" fill="#C59B63" />
    <rect x="7" y="11" width="1" height="6" fill="#854D0E" />
    <rect x="16" y="11" width="1" height="6" fill="#854D0E" />
    {/* Window */}
    <rect x="9" y="11" width="2" height="2" fill="#FEF08A" />
    {/* Door */}
    <rect x="13" y="12" width="2" height="5" fill="#854D0E" />
    {/* Tree Trunk */}
    <rect x="10" y="17" width="4" height="6" fill="#6E4424" />
  </svg>
);

export const PixelSakuraShrineIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Cherry Petals Falling */}
    <rect x="3" y="4" width="2" height="2" fill="#F472B6" />
    <rect x="19" y="3" width="2" height="2" fill="#FB7185" />
    <rect x="20" y="16" width="2" height="2" fill="#F472B6" />
    <rect x="4" y="18" width="2" height="2" fill="#FB7185" />
    {/* Torii Gate Top Lintels */}
    <rect x="4" y="5" width="16" height="2" fill="#C43D43" />
    <rect x="3" y="4" width="18" height="1" fill="#991B1B" />
    <rect x="5" y="8" width="14" height="2" fill="#C43D43" />
    {/* Torii Pillars */}
    <rect x="6" y="7" width="2" height="13" fill="#DC2626" />
    <rect x="16" y="7" width="2" height="13" fill="#DC2626" />
    {/* Black Base Stones */}
    <rect x="5" y="20" width="4" height="2" fill="#27272A" />
    <rect x="15" y="20" width="4" height="2" fill="#27272A" />
    {/* Sakura Blossom Bloom Center */}
    <rect x="11" y="12" width="2" height="2" fill="#FDE047" />
    <rect x="10" y="11" width="4" height="1" fill="#FDA4AF" />
    <rect x="10" y="14" width="4" height="1" fill="#FDA4AF" />
  </svg>
);

export const PixelRainyMeadowIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Falling Raindrops */}
    <rect x="3" y="3" width="1" height="2" fill="#38BDF8" />
    <rect x="19" y="2" width="1" height="2" fill="#38BDF8" />
    <rect x="21" y="10" width="1" height="2" fill="#38BDF8" />
    <rect x="2" y="12" width="1" height="2" fill="#38BDF8" />
    {/* Giant Red Toadstool Cap */}
    <rect x="6" y="6" width="12" height="8" fill="#DC2626" />
    <rect x="8" y="5" width="8" height="1" fill="#EF4444" />
    <rect x="5" y="8" width="14" height="5" fill="#DC2626" />
    {/* White Polka Dots on Mushroom */}
    <rect x="8" y="7" width="2" height="2" fill="#FFFFFF" />
    <rect x="14" y="7" width="2" height="2" fill="#FFFFFF" />
    <rect x="11" y="10" width="2" height="2" fill="#FFFFFF" />
    {/* Stem */}
    <rect x="9" y="14" width="6" height="7" fill="#F4EADB" />
    <rect x="9" y="15" width="1" height="5" fill="#E2CCAB" />
    {/* Green Grass Ground */}
    <rect x="3" y="21" width="18" height="2" fill="#4B773E" />
    <rect x="5" y="19" width="2" height="2" fill="#75AC56" />
    <rect x="17" y="19" width="2" height="2" fill="#75AC56" />
  </svg>
);

export const PixelOnsenIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Steam Plumes */}
    <rect x="7" y="3" width="2" height="2" fill="#E2E8F0" />
    <rect x="8" y="5" width="2" height="2" fill="#CBD5E1" />
    <rect x="12" y="2" width="2" height="3" fill="#E2E8F0" />
    <rect x="11" y="5" width="2" height="2" fill="#CBD5E1" />
    <rect x="16" y="4" width="2" height="2" fill="#E2E8F0" />
    {/* Thermal Rock Bath Edge */}
    <rect x="3" y="11" width="18" height="10" fill="#71717A" />
    <rect x="4" y="10" width="16" height="1" fill="#52525B" />
    {/* Mineral Blue Water */}
    <rect x="5" y="12" width="14" height="6" fill="#38BDF8" />
    <rect x="7" y="13" width="10" height="2" fill="#BAE6FD" />
    {/* Wooden Tub Bucket with Towel */}
    <rect x="14" y="8" width="5" height="3" fill="#C59B63" />
    <rect x="15" y="7" width="3" height="1" fill="#FFFFFF" />
    {/* Bamboo Spout */}
    <rect x="3" y="8" width="4" height="2" fill="#84CC16" />
    <rect x="6" y="10" width="1" height="2" fill="#67E8F9" />
  </svg>
);

export const PixelNightCampIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Night Sky & Stars */}
    <rect x="4" y="2" width="1" height="1" fill="#FEF08A" />
    <rect x="18" y="3" width="1" height="1" fill="#FEF08A" />
    <rect x="20" y="7" width="2" height="2" fill="#FACC15" />
    <rect x="8" y="5" width="1" height="1" fill="#FEF08A" />
    {/* A-Frame Tent */}
    <rect x="3" y="11" width="10" height="9" fill="#E2CCAB" />
    <rect x="7" y="8" width="2" height="3" fill="#C59B63" />
    <rect x="4" y="14" width="4" height="6" fill="#6E4424" />
    {/* Crackling Campfire */}
    <rect x="15" y="14" width="5" height="5" fill="#EF4444" />
    <rect x="16" y="13" width="3" height="4" fill="#F97316" />
    <rect x="17" y="15" width="1" height="2" fill="#FEF08A" />
    {/* Wood Logs */}
    <rect x="14" y="19" width="7" height="2" fill="#854D0E" />
    {/* Pine Tree Silhouette */}
    <rect x="19" y="8" width="3" height="4" fill="#14532D" />
  </svg>
);

export const PixelTearoomIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Tatami Mat Floor */}
    <rect x="2" y="16" width="20" height="6" fill="#D9BA8B" />
    <rect x="2" y="15" width="20" height="1" fill="#4B773E" />
    <rect x="11" y="16" width="1" height="6" fill="#4B773E" />
    {/* Low Tea Table */}
    <rect x="5" y="13" width="14" height="2" fill="#6E4424" />
    <rect x="6" y="15" width="2" height="2" fill="#4A3016" />
    <rect x="16" y="15" width="2" height="2" fill="#4A3016" />
    {/* Frothy Green Matcha Bowl */}
    <rect x="7" y="10" width="4" height="3" fill="#2E4C24" />
    <rect x="8" y="9" width="2" height="1" fill="#84CC16" />
    {/* Bamboo Whisk Chasen */}
    <rect x="12" y="10" width="2" height="3" fill="#FDE047" />
    {/* Potted Bonsai Tree */}
    <rect x="16" y="6" width="5" height="4" fill="#4B773E" />
    <rect x="18" y="10" width="1" height="2" fill="#6E4424" />
    <rect x="17" y="11" width="3" height="2" fill="#A16207" />
  </svg>
);

/** 2. Activities */
export const PixelFrogRelaxIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    <rect x="5" y="5" width="4" height="4" fill="#699B52" />
    <rect x="15" y="5" width="4" height="4" fill="#699B52" />
    <rect x="6" y="6" width="2" height="2" fill="#18181B" />
    <rect x="16" y="6" width="2" height="2" fill="#18181B" />
    <rect x="4" y="9" width="16" height="9" fill="#75AC56" />
    <rect x="5" y="13" width="2" height="2" fill="#FDA4AF" />
    <rect x="17" y="13" width="2" height="2" fill="#FDA4AF" />
    <rect x="10" y="14" width="4" height="1" fill="#2E4C24" />
    <rect x="9" y="13" width="1" height="1" fill="#2E4C24" />
    <rect x="14" y="13" width="1" height="1" fill="#2E4C24" />
    <rect x="7" y="17" width="10" height="2" fill="#D9F99D" />
  </svg>
);

export const PixelFrogReadingIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Frog Eyes & Head */}
    <rect x="6" y="4" width="3" height="3" fill="#699B52" />
    <rect x="15" y="4" width="3" height="3" fill="#699B52" />
    <rect x="5" y="7" width="14" height="6" fill="#75AC56" />
    <rect x="7" y="8" width="2" height="1" fill="#2E4C24" />
    <rect x="15" y="8" width="2" height="1" fill="#2E4C24" />
    {/* Open Brown Leather Book */}
    <rect x="4" y="13" width="16" height="7" fill="#FDFBF7" />
    <rect x="3" y="14" width="1" height="6" fill="#854D0E" />
    <rect x="20" y="14" width="1" height="6" fill="#854D0E" />
    <rect x="11" y="13" width="2" height="7" fill="#854D0E" />
    <rect x="4" y="20" width="16" height="1" fill="#854D0E" />
    {/* Bookmark Ribbon */}
    <rect x="11" y="11" width="2" height="3" fill="#DC2626" />
  </svg>
);

export const PixelFrogTeaIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    <rect x="6" y="4" width="3" height="3" fill="#699B52" />
    <rect x="15" y="4" width="3" height="3" fill="#699B52" />
    <rect x="5" y="7" width="14" height="6" fill="#75AC56" />
    {/* Ceramic Matcha Cup & Steam */}
    <rect x="11" y="11" width="1" height="2" fill="#E2E8F0" />
    <rect x="8" y="14" width="8" height="6" fill="#365314" />
    <rect x="9" y="13" width="6" height="2" fill="#84CC16" />
    <rect x="9" y="20" width="6" height="1" fill="#1A2E05" />
    {/* Frog hands holding cup */}
    <rect x="6" y="15" width="2" height="3" fill="#75AC56" />
    <rect x="16" y="15" width="2" height="3" fill="#75AC56" />
  </svg>
);

export const PixelFrogEatingIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    <rect x="6" y="4" width="3" height="3" fill="#699B52" />
    <rect x="15" y="4" width="3" height="3" fill="#699B52" />
    <rect x="5" y="7" width="14" height="6" fill="#75AC56" />
    {/* Triangular Onigiri with Nori */}
    <rect x="10" y="13" width="4" height="2" fill="#FFFFFF" />
    <rect x="8" y="15" width="8" height="5" fill="#FFFFFF" />
    <rect x="10" y="17" width="4" height="3" fill="#18181B" />
    {/* Crumbs & Rosy Cheeks */}
    <rect x="6" y="10" width="2" height="2" fill="#FDA4AF" />
    <rect x="16" y="10" width="2" height="2" fill="#FDA4AF" />
  </svg>
);

export const PixelFrogMeditatingIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Golden Aura Sparkles */}
    <rect x="3" y="4" width="2" height="2" fill="#FDE047" />
    <rect x="19" y="4" width="2" height="2" fill="#FDE047" />
    <rect x="11" y="2" width="2" height="2" fill="#FACC15" />
    {/* Frog Eyes in Meditation Squint */}
    <rect x="6" y="6" width="3" height="3" fill="#699B52" />
    <rect x="15" y="6" width="3" height="3" fill="#699B52" />
    <rect x="5" y="9" width="14" height="6" fill="#75AC56" />
    <rect x="7" y="10" width="3" height="1" fill="#2E4C24" />
    <rect x="14" y="10" width="3" height="1" fill="#2E4C24" />
    {/* Lotus Sitting Pose */}
    <rect x="4" y="15" width="16" height="4" fill="#75AC56" />
    <rect x="6" y="19" width="12" height="2" fill="#5F8C4A" />
  </svg>
);

export const PixelFrogGuitarIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    <rect x="6" y="4" width="3" height="3" fill="#699B52" />
    <rect x="15" y="4" width="3" height="3" fill="#699B52" />
    <rect x="5" y="7" width="14" height="6" fill="#75AC56" />
    {/* Acoustic Lute Body */}
    <rect x="12" y="13" width="8" height="7" fill="#D97706" />
    <rect x="14" y="15" width="3" height="3" fill="#78350F" />
    {/* Lute Neck */}
    <rect x="6" y="11" width="7" height="2" fill="#B45309" />
    <rect x="4" y="10" width="3" height="4" fill="#78350F" />
    {/* Music Note Sparkle */}
    <rect x="19" y="6" width="2" height="3" fill="#F59E0B" />
  </svg>
);

export const PixelFrogSleepingIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Floating Zzz */}
    <rect x="18" y="2" width="3" height="1" fill="#38BDF8" />
    <rect x="19" y="3" width="1" height="1" fill="#38BDF8" />
    <rect x="18" y="4" width="3" height="1" fill="#38BDF8" />
    {/* Sleepy Head on Pillow */}
    <rect x="4" y="6" width="16" height="6" fill="#75AC56" />
    <rect x="7" y="8" width="3" height="1" fill="#2E4C24" />
    <rect x="14" y="8" width="3" height="1" fill="#2E4C24" />
    {/* Cozy Quilt Blanket */}
    <rect x="3" y="12" width="18" height="9" fill="#0284C7" />
    <rect x="5" y="14" width="14" height="2" fill="#38BDF8" />
    <rect x="5" y="18" width="14" height="2" fill="#38BDF8" />
  </svg>
);

/** 3. Headwear */
export const PixelHatNaturalIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    <rect x="5" y="6" width="4" height="4" fill="#699B52" />
    <rect x="15" y="6" width="4" height="4" fill="#699B52" />
    <rect x="6" y="7" width="2" height="2" fill="#18181B" />
    <rect x="16" y="7" width="2" height="2" fill="#18181B" />
    <rect x="4" y="10" width="16" height="8" fill="#75AC56" />
    <rect x="11" y="3" width="2" height="2" fill="#FDE047" />
    <rect x="10" y="4" width="4" height="1" fill="#FDE047" />
  </svg>
);

export const PixelHatLotusIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Stem at Top */}
    <rect x="11" y="3" width="2" height="3" fill="#2E4C24" />
    {/* Green Lily Leaf Dome */}
    <rect x="8" y="6" width="8" height="3" fill="#4B773E" />
    <rect x="5" y="9" width="14" height="4" fill="#69A255" />
    <rect x="3" y="13" width="18" height="3" fill="#75AC56" />
    <rect x="2" y="15" width="20" height="2" fill="#2E4C24" />
    {/* Dewdrop */}
    <rect x="14" y="11" width="2" height="2" fill="#BAE6FD" />
  </svg>
);

export const PixelHatStrawIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Conical Straw Hat Top */}
    <rect x="11" y="4" width="2" height="2" fill="#B45309" />
    <rect x="9" y="6" width="6" height="3" fill="#D97706" />
    <rect x="6" y="9" width="12" height="4" fill="#F59E0B" />
    <rect x="3" y="13" width="18" height="3" fill="#FBBF24" />
    <rect x="2" y="16" width="20" height="2" fill="#78350F" />
    {/* Red Ribbon Band */}
    <rect x="5" y="14" width="14" height="2" fill="#DC2626" />
  </svg>
);

export const PixelHatSakuraIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Blossom Flowers Garland */}
    <rect x="4" y="10" width="5" height="5" fill="#F472B6" />
    <rect x="6" y="12" width="1" height="1" fill="#FDE047" />
    <rect x="10" y="7" width="5" height="5" fill="#FB7185" />
    <rect x="12" y="9" width="1" height="1" fill="#FDE047" />
    <rect x="16" y="10" width="5" height="5" fill="#F472B6" />
    <rect x="18" y="12" width="1" height="1" fill="#FDE047" />
    {/* Vine Base */}
    <rect x="3" y="14" width="18" height="2" fill="#4B773E" />
  </svg>
);

export const PixelHatWizardIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Wizard Hat Tip */}
    <rect x="11" y="2" width="2" height="3" fill="#1E3A8A" />
    <rect x="9" y="5" width="6" height="4" fill="#1D4ED8" />
    <rect x="7" y="9" width="10" height="5" fill="#2563EB" />
    <rect x="3" y="14" width="18" height="3" fill="#1E3A8A" />
    {/* Gold Stars */}
    <rect x="10" y="8" width="2" height="2" fill="#FDE047" />
    <rect x="13" y="11" width="2" height="2" fill="#FDE047" />
  </svg>
);

export const PixelHatBandanaIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Crimson Scarf Band */}
    <rect x="4" y="9" width="16" height="5" fill="#DC2626" />
    <rect x="3" y="10" width="1" height="3" fill="#991B1B" />
    <rect x="20" y="10" width="1" height="3" fill="#991B1B" />
    {/* Knot & Hanging Tails */}
    <rect x="16" y="14" width="4" height="6" fill="#B91C1C" />
    <rect x="18" y="17" width="3" height="4" fill="#DC2626" />
  </svg>
);

export const PixelHatBeanieIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Pom-Pom on Top */}
    <rect x="10" y="2" width="4" height="4" fill="#FDE047" />
    {/* Woven Beanie Body */}
    <rect x="7" y="6" width="10" height="5" fill="#0D9488" />
    <rect x="5" y="10" width="14" height="4" fill="#14B8A6" />
    {/* Folded Brim */}
    <rect x="4" y="14" width="16" height="3" fill="#042F2E" />
    <rect x="6" y="14" width="12" height="2" fill="#5EEAD4" />
  </svg>
);

/** 4. Companions */
export const PixelCompanionSoloIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Sprout Leaf in Soil */}
    <rect x="7" y="6" width="4" height="3" fill="#84CC16" />
    <rect x="13" y="4" width="4" height="4" fill="#4D7C0F" />
    <rect x="11" y="8" width="2" height="7" fill="#65A30D" />
    {/* Soil Mound */}
    <rect x="5" y="15" width="14" height="5" fill="#78350F" />
    <rect x="7" y="14" width="10" height="1" fill="#92400E" />
  </svg>
);

export const PixelCompanionSnailIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Snail Antennae */}
    <rect x="18" y="4" width="2" height="2" fill="#4A3D2A" />
    <rect x="21" y="6" width="2" height="2" fill="#4A3D2A" />
    <rect x="19" y="6" width="1" height="4" fill="#4A3D2A" />
    <rect x="21" y="8" width="1" height="3" fill="#4A3D2A" />
    {/* Shell Swirl */}
    <rect x="5" y="7" width="11" height="10" fill="#E2CCAB" />
    <rect x="8" y="9" width="6" height="3" fill="#854D0E" />
    <rect x="11" y="12" width="2" height="3" fill="#854D0E" />
    {/* Body */}
    <rect x="3" y="17" width="19" height="3" fill="#F5ECD8" />
  </svg>
);

export const PixelCompanionCrabIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Claws */}
    <rect x="3" y="5" width="4" height="4" fill="#EA580C" />
    <rect x="17" y="5" width="4" height="4" fill="#EA580C" />
    {/* Eyes */}
    <rect x="8" y="7" width="2" height="2" fill="#FFFFFF" />
    <rect x="8" y="8" width="1" height="1" fill="#18181B" />
    <rect x="14" y="7" width="2" height="2" fill="#FFFFFF" />
    <rect x="14" y="8" width="1" height="1" fill="#18181B" />
    {/* Body */}
    <rect x="5" y="9" width="14" height="7" fill="#F97316" />
    {/* Legs */}
    <rect x="3" y="16" width="2" height="3" fill="#C2410C" />
    <rect x="6" y="16" width="2" height="3" fill="#C2410C" />
    <rect x="16" y="16" width="2" height="3" fill="#C2410C" />
    <rect x="19" y="16" width="2" height="3" fill="#C2410C" />
  </svg>
);

export const PixelCompanionFirefliesIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Glowing Light Orbs */}
    <rect x="4" y="6" width="4" height="4" fill="#FEF08A" />
    <rect x="5" y="7" width="2" height="2" fill="#FACC15" />
    <rect x="16" y="4" width="4" height="4" fill="#FEF08A" />
    <rect x="17" y="5" width="2" height="2" fill="#FACC15" />
    <rect x="10" y="13" width="5" height="5" fill="#FEF08A" />
    <rect x="11" y="14" width="3" height="3" fill="#EAB308" />
    <rect x="12" y="15" width="1" height="1" fill="#FFFFFF" />
    {/* Sparkle trails */}
    <rect x="2" y="17" width="2" height="2" fill="#FDE047" />
    <rect x="19" y="15" width="2" height="2" fill="#FDE047" />
  </svg>
);

export const PixelCompanionButterflyIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Left Wing */}
    <rect x="3" y="4" width="7" height="7" fill="#38BDF8" />
    <rect x="4" y="11" width="6" height="6" fill="#0284C7" />
    <rect x="5" y="6" width="3" height="3" fill="#BAE6FD" />
    {/* Right Wing */}
    <rect x="14" y="4" width="7" height="7" fill="#38BDF8" />
    <rect x="14" y="11" width="6" height="6" fill="#0284C7" />
    <rect x="16" y="6" width="3" height="3" fill="#BAE6FD" />
    {/* Body & Antennae */}
    <rect x="11" y="6" width="2" height="12" fill="#1E293B" />
    <rect x="10" y="4" width="1" height="2" fill="#1E293B" />
    <rect x="13" y="4" width="1" height="2" fill="#1E293B" />
  </svg>
);

export const PixelCompanionKoiIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Fish Body */}
    <rect x="6" y="8" width="11" height="7" fill="#FFFFFF" />
    <rect x="4" y="10" width="3" height="3" fill="#DC2626" />
    <rect x="8" y="9" width="4" height="4" fill="#DC2626" />
    <rect x="13" y="11" width="3" height="3" fill="#EA580C" />
    {/* Eye */}
    <rect x="5" y="11" width="1" height="1" fill="#18181B" />
    {/* Tail Fin */}
    <rect x="17" y="7" width="4" height="3" fill="#FB7185" />
    <rect x="17" y="13" width="4" height="3" fill="#FB7185" />
    {/* Ripples */}
    <rect x="2" y="17" width="20" height="2" fill="#7DD3FC" />
  </svg>
);

/** 5. Weathers */
export const PixelWeatherAutoIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Pocket Clock */}
    <rect x="6" y="5" width="12" height="14" fill="#F59E0B" />
    <rect x="8" y="7" width="8" height="10" fill="#FFFDF8" />
    <rect x="11" y="9" width="2" height="4" fill="#18181B" />
    <rect x="11" y="12" width="4" height="1" fill="#DC2626" />
    {/* Sparkle */}
    <rect x="17" y="3" width="3" height="3" fill="#FDE047" />
  </svg>
);

export const PixelWeatherSunnyIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Central Sun */}
    <rect x="7" y="7" width="10" height="10" fill="#FACC15" />
    <rect x="9" y="9" width="6" height="6" fill="#F59E0B" />
    {/* Rays */}
    <rect x="11" y="2" width="2" height="3" fill="#F59E0B" />
    <rect x="11" y="19" width="2" height="3" fill="#F59E0B" />
    <rect x="2" y="11" width="3" height="2" fill="#F59E0B" />
    <rect x="19" y="11" width="3" height="2" fill="#F59E0B" />
    <rect x="4" y="4" width="2" height="2" fill="#FACC15" />
    <rect x="18" y="4" width="2" height="2" fill="#FACC15" />
    <rect x="4" y="18" width="2" height="2" fill="#FACC15" />
    <rect x="18" y="18" width="2" height="2" fill="#FACC15" />
  </svg>
);

export const PixelWeatherGoldenIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Sunset Sun */}
    <rect x="8" y="6" width="8" height="6" fill="#F97316" />
    <rect x="9" y="7" width="6" height="4" fill="#FDE047" />
    {/* Mountains & Horizon */}
    <rect x="3" y="12" width="18" height="3" fill="#EA580C" />
    <rect x="2" y="15" width="20" height="6" fill="#7C2D12" />
  </svg>
);

export const PixelWeatherStarryIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Crescent Moon */}
    <rect x="6" y="5" width="8" height="12" fill="#FDE047" />
    <rect x="9" y="5" width="7" height="12" fill="#0F172A" />
    {/* Stars */}
    <rect x="17" y="4" width="2" height="2" fill="#FACC15" />
    <rect x="19" y="12" width="2" height="2" fill="#FDE047" />
    <rect x="5" y="18" width="2" height="2" fill="#FDE047" />
  </svg>
);

export const PixelWeatherRainyIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Rain Cloud */}
    <rect x="5" y="5" width="14" height="7" fill="#64748B" />
    <rect x="7" y="4" width="10" height="2" fill="#94A3B8" />
    {/* Rain Drops */}
    <rect x="6" y="14" width="2" height="3" fill="#38BDF8" />
    <rect x="11" y="15" width="2" height="4" fill="#0284C7" />
    <rect x="16" y="14" width="2" height="3" fill="#38BDF8" />
  </svg>
);

export const PixelWeatherPetalsIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" className={`inline-block shrink-0 ${className}`} {...props}>
    {/* Floating Sakura Petals with wind breeze */}
    <rect x="4" y="6" width="3" height="3" fill="#F472B6" />
    <rect x="11" y="4" width="4" height="4" fill="#FB7185" />
    <rect x="17" y="7" width="3" height="3" fill="#FDA4AF" />
    <rect x="7" y="13" width="4" height="4" fill="#FB7185" />
    <rect x="15" y="14" width="4" height="4" fill="#F472B6" />
    <rect x="10" y="18" width="3" height="3" fill="#FDA4AF" />
  </svg>
);

/** Tab Pixel Icons */
export const PixelTabSceneIcon: React.FC<IconProps> = (props) => <PixelTreehouseIcon {...props} />;
export const PixelTabActivityIcon: React.FC<IconProps> = (props) => <PixelFrogRelaxIcon {...props} />;
export const PixelTabHeadwearIcon: React.FC<IconProps> = (props) => <PixelHatStrawIcon {...props} />;
export const PixelTabCompanionIcon: React.FC<IconProps> = (props) => <PixelCompanionSnailIcon {...props} />;
export const PixelTabWeatherIcon: React.FC<IconProps> = (props) => <PixelWeatherSunnyIcon {...props} />;

/** Master Pixel Option Icon Renderer */
export const PixelOptionIcon: React.FC<{ id: string; category?: string; size?: number; className?: string }> = ({
  size = 24,
  className = '',
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`inline-flex items-center justify-center rounded bg-emerald-500/10 text-emerald-600 ${className}`}
    >
      <span className="text-xs font-mono">🐸</span>
    </div>
  );
};

/** Pixel Checkmark Icon */
export const PixelCheckIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Pixel checkmark glyph */}
    <rect x="2" y="7" width="2" height="2" />
    <rect x="3" y="8" width="2" height="2" />
    <rect x="4" y="9" width="2" height="2" />
    <rect x="5" y="10" width="2" height="3" />
    <rect x="6" y="11" width="2" height="3" />
    <rect x="7" y="10" width="2" height="3" />
    <rect x="8" y="9" width="2" height="2" />
    <rect x="9" y="8" width="2" height="2" />
    <rect x="10" y="7" width="2" height="2" />
    <rect x="11" y="6" width="2" height="2" />
    <rect x="12" y="5" width="2" height="2" />
    <rect x="13" y="4" width="2" height="2" />
    <rect x="14" y="3" width="2" height="2" />
  </svg>
);

/** Pixel Check Circle Icon */
export const PixelCheckCircleIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Circle outline */}
    <rect x="5" y="1" width="6" height="1" fill="currentColor" />
    <rect x="3" y="2" width="2" height="2" fill="currentColor" />
    <rect x="11" y="2" width="2" height="2" fill="currentColor" />
    <rect x="1" y="4" width="2" height="8" fill="currentColor" />
    <rect x="13" y="4" width="2" height="8" fill="currentColor" />
    <rect x="3" y="12" width="2" height="2" fill="currentColor" />
    <rect x="11" y="12" width="2" height="2" fill="currentColor" />
    <rect x="5" y="14" width="6" height="1" fill="currentColor" />
    {/* Checkmark inside */}
    <rect x="4" y="8" width="1" height="2" fill="currentColor" />
    <rect x="5" y="9" width="2" height="2" fill="currentColor" />
    <rect x="7" y="8" width="2" height="2" fill="currentColor" />
    <rect x="9" y="6" width="2" height="2" fill="currentColor" />
    <rect x="11" y="4" width="2" height="2" fill="currentColor" />
  </svg>
);

/** Pixel Sparkle / Star Icon */
export const PixelSparkleIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    <rect x="7" y="1" width="2" height="2" fill="#EAB308" />
    <rect x="7" y="13" width="2" height="2" fill="#EAB308" />
    <rect x="1" y="7" width="2" height="2" fill="#EAB308" />
    <rect x="13" y="7" width="2" height="2" fill="#EAB308" />
    <rect x="6" y="4" width="4" height="8" fill="#FACC15" />
    <rect x="4" y="6" width="8" height="4" fill="#FACC15" />
    <rect x="7" y="7" width="2" height="2" fill="#FFFFFF" />
  </svg>
);

/** Pixel Party Popper Celebration Icon */
export const PixelPartyPopperIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Cone Body */}
    <rect x="2" y="12" width="2" height="2" fill="#B86F52" />
    <rect x="3" y="10" width="3" height="3" fill="#D98A3C" />
    <rect x="5" y="8" width="4" height="4" fill="#E8B86D" />
    <rect x="8" y="6" width="3" height="3" fill="#D98A3C" />
    {/* Streamers & Confetti Bits */}
    <rect x="11" y="2" width="2" height="2" fill="#EC4899" />
    <rect x="13" y="5" width="2" height="2" fill="#3B82F6" />
    <rect x="9" y="1" width="2" height="2" fill="#10B981" />
    <rect x="6" y="3" width="2" height="2" fill="#F59E0B" />
    <rect x="12" y="9" width="2" height="2" fill="#8B5CF6" />
  </svg>
);

/** Pixel Lightbulb Tip Icon */
export const PixelLightbulbIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Top Spark Ray */}
    <rect x="7" y="0" width="2" height="1" fill="#FACC15" />
    <rect x="1" y="4" width="1" height="2" fill="#FACC15" />
    <rect x="14" y="4" width="1" height="2" fill="#FACC15" />
    {/* Bulb Body */}
    <rect x="5" y="2" width="6" height="2" fill="#FEF08A" />
    <rect x="4" y="4" width="8" height="5" fill="#FEF08A" />
    <rect x="6" y="5" width="4" height="3" fill="#FFFFFF" />
    <rect x="5" y="9" width="6" height="2" fill="#FACC15" />
    {/* Metal Screw Base */}
    <rect x="6" y="11" width="4" height="2" fill="#9CA3AF" />
    <rect x="7" y="13" width="2" height="1" fill="#6B7280" />
  </svg>
);

/** 1. Pixel Treehouse Home Icon */
export const FrogHouseDockIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Chimney */}
    <rect x="17" y="3" width="2" height="3" fill="#5E381C" />
    <rect x="17" y="2" width="1" height="1" fill="#C9BDAA" />

    {/* Thatched Roof */}
    <rect x="11" y="3" width="2" height="2" fill="#8C5832" />
    <rect x="8" y="5" width="8" height="2" fill="#8C5832" />
    <rect x="5" y="7" width="14" height="2" fill="#8C5832" />
    <rect x="3" y="9" width="18" height="2" fill="#6E4424" />

    {/* Wooden Wall */}
    <rect x="5" y="11" width="14" height="9" fill="#D9BA8B" />
    <rect x="4" y="11" width="1" height="9" fill="#6E4424" />
    <rect x="19" y="11" width="1" height="9" fill="#6E4424" />
    <rect x="5" y="20" width="14" height="1" fill="#6E4424" />

    {/* Round Window */}
    <rect x="7" y="13" width="3" height="3" fill="#FFF3CD" />
    <rect x="8" y="13" width="1" height="3" fill="#6E4424" />

    {/* Wooden Door */}
    <rect x="13" y="13" width="4" height="7" fill="#6E4424" />
  </svg>
);

/** 2. Pixel Habit Clover Check Icon */
export const HabitCloverDockIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* 4 Clover Pixel Nodes */}
    <rect x="10" y="3" width="4" height="3" fill="#75AC56" />
    <rect x="3" y="10" width="3" height="4" fill="#88C464" />
    <rect x="18" y="10" width="3" height="4" fill="#75AC56" />
    <rect x="10" y="18" width="4" height="3" fill="#75AC56" />

    {/* Center Plate */}
    <rect x="7" y="7" width="10" height="10" fill="#FFFDF8" />
    <rect x="6" y="8" width="1" height="8" fill="#2D5A1E" />
    <rect x="17" y="8" width="1" height="8" fill="#2D5A1E" />
    <rect x="8" y="6" width="8" height="1" fill="#2D5A1E" />
    <rect x="8" y="17" width="8" height="1" fill="#2D5A1E" />

    {/* Pixel Checkmark */}
    <rect x="9" y="12" width="2" height="2" fill="#2D5A1E" />
    <rect x="11" y="13" width="2" height="2" fill="#2D5A1E" />
    <rect x="13" y="10" width="2" height="2" fill="#2D5A1E" />
    <rect x="14" y="9" width="2" height="2" fill="#2D5A1E" />
  </svg>
);

/** 3. Pixel Bamboo Scroll Icon */
export const BambooScrollDockIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Bamboo Slat Body */}
    <rect x="4" y="4" width="16" height="16" fill="#C59B63" />
    <rect x="3" y="4" width="1" height="16" fill="#6E4424" />
    <rect x="20" y="4" width="1" height="16" fill="#6E4424" />
    <rect x="8" y="4" width="1" height="16" fill="#9E7440" />
    <rect x="12" y="4" width="1" height="16" fill="#9E7440" />
    <rect x="16" y="4" width="1" height="16" fill="#9E7440" />

    {/* Red Cord & Green Leaf Seal */}
    <rect x="4" y="11" width="16" height="2" fill="#B84B3A" />
    <rect x="10" y="10" width="4" height="4" fill="#699B52" />
    <rect x="11" y="11" width="2" height="2" fill="#A3E635" />
  </svg>
);

/** 4. Pixel Frog Face Mood Icon */
export const FrogFaceDockIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Big Eyes */}
    <rect x="5" y="4" width="4" height="4" fill="#88B868" />
    <rect x="6" y="5" width="2" height="2" fill="#18181B" />
    <rect x="6" y="5" width="1" height="1" fill="#FFFFFF" />

    <rect x="15" y="4" width="4" height="4" fill="#88B868" />
    <rect x="16" y="5" width="2" height="2" fill="#18181B" />
    <rect x="16" y="5" width="1" height="1" fill="#FFFFFF" />

    {/* Frog Head */}
    <rect x="4" y="8" width="16" height="10" fill="#88B868" />
    <rect x="3" y="9" width="1" height="8" fill="#2D3A20" />
    <rect x="20" y="9" width="1" height="8" fill="#2D3A20" />
    <rect x="5" y="18" width="14" height="1" fill="#2D3A20" />

    {/* Rosy Cheeks */}
    <rect x="5" y="12" width="2" height="2" fill="#E88B8B" />
    <rect x="17" y="12" width="2" height="2" fill="#E88B8B" />

    {/* Wide Smile */}
    <rect x="9" y="14" width="6" height="1" fill="#2D3A20" />
    <rect x="8" y="13" width="1" height="1" fill="#2D3A20" />
    <rect x="15" y="13" width="1" height="1" fill="#2D3A20" />
  </svg>
);

/** 5. Pixel Washi Journal Book Icon */
export const WashiJournalDockIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Cover */}
    <rect x="5" y="4" width="14" height="16" fill="#C45A46" />
    <rect x="4" y="4" width="1" height="16" fill="#6E4424" />
    <rect x="19" y="4" width="1" height="16" fill="#6E4424" />

    {/* Washi Japanese String Binding */}
    <rect x="8" y="4" width="1" height="16" fill="#F5ECD8" />
    <rect x="5" y="7" width="3" height="1" fill="#F5ECD8" />
    <rect x="5" y="12" width="3" height="1" fill="#F5ECD8" />
    <rect x="5" y="17" width="3" height="1" fill="#F5ECD8" />

    {/* Title Label Tag */}
    <rect x="12" y="7" width="4" height="8" fill="#FFFDF8" />
    <rect x="13" y="9" width="2" height="4" fill="#C45A46" />
  </svg>
);

/** 6. Pixel Pocket Timer Stopwatch Icon */
export const PocketTimerDockIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Crown & Ring */}
    <rect x="10" y="2" width="4" height="2" fill="#C59B63" />
    <rect x="11" y="4" width="2" height="2" fill="#854D0E" />

    {/* Body */}
    <rect x="5" y="6" width="14" height="14" fill="#E8D5B5" />
    <rect x="4" y="8" width="1" height="10" fill="#6E4424" />
    <rect x="19" y="8" width="1" height="10" fill="#6E4424" />
    <rect x="7" y="20" width="10" height="1" fill="#6E4424" />

    {/* Dial */}
    <rect x="7" y="8" width="10" height="10" fill="#FFFDF8" />
    <rect x="11" y="9" width="2" height="1" fill="#6E4424" />
    <rect x="11" y="16" width="2" height="1" fill="#6E4424" />
    <rect x="8" y="12" width="1" height="2" fill="#6E4424" />
    <rect x="15" y="12" width="1" height="2" fill="#6E4424" />

    {/* Hands (10:10) */}
    <rect x="11" y="11" width="2" height="2" fill="#C45A46" />
    <rect x="9" y="10" width="2" height="1" fill="#C45A46" />
    <rect x="13" y="11" width="2" height="1" fill="#18181B" />
  </svg>
);

/** 7. Pixel Torii Shrine Steps / Growth Chart Icon */
export const ToriiStatsDockIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Stepped Pixel Growth Bars */}
    <rect x="4" y="15" width="4" height="6" fill="#88B868" />
    <rect x="10" y="10" width="4" height="11" fill="#5F7A61" />
    <rect x="16" y="5" width="4" height="16" fill="#D98236" />

    {/* Sprout atop highest bar */}
    <rect x="17" y="3" width="2" height="2" fill="#A3E635" />
    <rect x="16" y="2" width="1" height="1" fill="#65A30D" />
    <rect x="19" y="2" width="1" height="1" fill="#65A30D" />
  </svg>
);

/** 8. Pixel Wooden Gear / Waterwheel Icon */
export const WoodGearDockIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Gear Teeth / Spokes */}
    <rect x="11" y="3" width="2" height="3" fill="#854D0E" />
    <rect x="11" y="18" width="2" height="3" fill="#854D0E" />
    <rect x="3" y="11" width="3" height="2" fill="#854D0E" />
    <rect x="18" y="11" width="3" height="2" fill="#854D0E" />

    {/* Wheel Hub */}
    <rect x="6" y="6" width="12" height="12" fill="#E2CCAB" />
    <rect x="9" y="9" width="6" height="6" fill="#D98A3C" />
    <rect x="11" y="11" width="2" height="2" fill="#FFFDF8" />
  </svg>
);

/** Project Bamboo Scroll Alias */
export const BambooProjectDockIcon = BambooScrollDockIcon;

/** Pixel Wooden Ema Plaque */
export const EmaTabIcon: React.FC<IconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Roof Peak of Ema */}
    <rect x="11" y="3" width="2" height="2" fill="#C45A46" />
    <rect x="8" y="5" width="8" height="2" fill="#E8D5B5" />
    <rect x="5" y="7" width="14" height="13" fill="#E8D5B5" />
    <rect x="4" y="8" width="1" height="12" fill="#6E4424" />
    <rect x="19" y="8" width="1" height="12" fill="#6E4424" />
    <rect x="5" y="20" width="14" height="1" fill="#6E4424" />
    {/* Inscription Lines */}
    <rect x="8" y="11" width="8" height="1" fill="#6E4424" />
    <rect x="8" y="14" width="5" height="1" fill="#6E4424" />
  </svg>
);

/** Dynamic Mood Icon mapping */
export const FrogMoodIcon: React.FC<{ value: number | null | undefined; size?: number; className?: string }> = ({
  value,
  size = 28,
  className = '',
}) => {
  switch (value) {
    case 5:
      return <FrogMoodRad size={size} className={className} />;
    case 4:
      return <FrogMoodGood size={size} className={className} />;
    case 3:
      return <FrogMoodMeh size={size} className={className} />;
    case 2:
      return <FrogMoodBad size={size} className={className} />;
    case 1:
      return <FrogMoodAwful size={size} className={className} />;
    default:
      return <ThreeLeafCloverIcon size={size} className={className} />;
  }
};

/** Dynamic Item Icon mapping */
export const FrogItemIcon: React.FC<{ itemId: string; size?: number; className?: string }> = ({
  itemId,
  size = 28,
  className = '',
}) => {
  switch (itemId) {
    case 'bento_scone':
      return <SconeItemIcon size={size} className={className} />;
    case 'bento_sandwich':
      return <SandwichItemIcon size={size} className={className} />;
    case 'bento_pie':
      return <SconeItemIcon size={size} className={className} />;
    case 'bento_onigiri':
      return <OnigiriItemIcon size={size} className={className} />;
    case 'charm_fourleaf':
      return <CloverIcon size={size} className={className} />;
    case 'charm_bell':
      return <BellCharmIcon size={size} className={className} />;
    case 'tool_lantern':
      return <LanternToolIcon size={size} className={className} />;
    default:
      return <CloverIcon size={size} className={className} />;
  }
};

/** Pixel Golden Lily Coin Icon */
export const LilyCoinIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Sparkle top right */}
    <rect x="18" y="1" width="1" height="1" fill="#FEF08A" />
    <rect x="17" y="2" width="3" height="1" fill="#FEF08A" />
    <rect x="18" y="3" width="1" height="1" fill="#FEF08A" />

    {/* Coin Outer Ring */}
    <rect x="8" y="3" width="8" height="1" fill="#CA8A04" />
    <rect x="5" y="4" width="3" height="2" fill="#CA8A04" />
    <rect x="16" y="4" width="3" height="2" fill="#CA8A04" />
    <rect x="4" y="6" width="1" height="12" fill="#CA8A04" />
    <rect x="19" y="6" width="1" height="12" fill="#CA8A04" />
    <rect x="5" y="18" width="3" height="2" fill="#CA8A04" />
    <rect x="16" y="18" width="3" height="2" fill="#CA8A04" />
    <rect x="8" y="20" width="8" height="1" fill="#CA8A04" />

    {/* Coin Main Face */}
    <rect x="8" y="4" width="8" height="1" fill="#FACC15" />
    <rect x="5" y="6" width="14" height="12" fill="#FACC15" />
    <rect x="8" y="19" width="8" height="1" fill="#EAB308" />

    {/* Coin Highlights (Top Left) */}
    <rect x="7" y="5" width="4" height="2" fill="#FEF08A" />
    <rect x="5" y="7" width="2" height="4" fill="#FEF08A" />

    {/* Center Frog Face / Lily Emblem on Coin */}
    <rect x="8" y="9" width="2" height="2" fill="#854D0E" />
    <rect x="14" y="9" width="2" height="2" fill="#854D0E" />
    <rect x="9" y="13" width="6" height="2" fill="#854D0E" />
    <rect x="10" y="14" width="4" height="1" fill="#CA8A04" />
    {/* Frog cheeks */}
    <rect x="7" y="12" width="2" height="1" fill="#EAB308" />
    <rect x="15" y="12" width="2" height="1" fill="#EAB308" />
  </svg>
);

/** Frog Shop Dock / Wardrobe Icon */
export const FrogShopDockIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Shopping Bag Handles */}
    <rect x="8" y="2" width="8" height="2" fill="#A16207" />
    <rect x="7" y="4" width="2" height="4" fill="#A16207" />
    <rect x="15" y="4" width="2" height="4" fill="#A16207" />

    {/* Bag Body Outline */}
    <rect x="4" y="7" width="16" height="15" fill="#D97706" />
    <rect x="5" y="8" width="14" height="13" fill="#F59E0B" />
    <rect x="6" y="9" width="12" height="11" fill="#FDE68A" />

    {/* Frog Face Emblem on Front of Bag */}
    <rect x="8" y="11" width="2" height="2" fill="#5F7A61" />
    <rect x="14" y="11" width="2" height="2" fill="#5F7A61" />
    <rect x="8" y="13" width="8" height="4" fill="#5F7A61" />
    <rect x="9" y="14" width="6" height="2" fill="#FEF9C3" />
    <rect x="11" y="15" width="2" height="1" fill="#2D3A20" />
    {/* Rosy cheeks */}
    <rect x="8" y="15" width="1" height="1" fill="#E88B8B" />
    <rect x="15" y="15" width="1" height="1" fill="#E88B8B" />
  </svg>
);

/** Pixel Tab Outfit / Clothes Icon */
export const PixelTabOutfitIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Hanger / Collar */}
    <rect x="10" y="3" width="4" height="2" fill="#D97706" />
    <rect x="7" y="5" width="10" height="2" fill="#2563EB" />
    {/* Kimono Sleeves & Robe */}
    <rect x="4" y="7" width="16" height="13" fill="#3B82F6" />
    <rect x="2" y="7" width="4" height="6" fill="#1D4ED8" />
    <rect x="18" y="7" width="4" height="6" fill="#1D4ED8" />
    {/* Golden Obi Sash */}
    <rect x="6" y="13" width="12" height="3" fill="#FACC15" />
    <rect x="10" y="12" width="4" height="5" fill="#EAB308" />
  </svg>
);

/** Pixel Tab Glasses / Face Accessory Icon */
export const PixelTabGlassesIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Spectacles Bridge */}
    <rect x="11" y="10" width="2" height="2" fill="#D97706" />
    {/* Left Rim */}
    <rect x="3" y="7" width="7" height="8" fill="#F59E0B" />
    <rect x="5" y="9" width="3" height="4" fill="#38BDF8" />
    <rect x="5" y="9" width="1" height="1" fill="#FFFFFF" />
    {/* Right Rim */}
    <rect x="14" y="7" width="7" height="8" fill="#F59E0B" />
    <rect x="16" y="9" width="3" height="4" fill="#38BDF8" />
    <rect x="16" y="9" width="1" height="1" fill="#FFFFFF" />
  </svg>
);

/** Pixel Tab Frog Skin Icon */
export const PixelTabSkinIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Frog Palette */}
    <rect x="6" y="4" width="4" height="4" fill="#75A65A" />
    <rect x="14" y="4" width="4" height="4" fill="#75A65A" />
    <rect x="4" y="8" width="16" height="10" fill="#75A65A" />
    <rect x="8" y="12" width="8" height="5" fill="#FEF9C3" />
    <rect x="5" y="11" width="2" height="2" fill="#E88B8B" />
    <rect x="17" y="11" width="2" height="2" fill="#E88B8B" />
    <rect x="10" y="11" width="4" height="2" fill="#2D3A20" />
  </svg>
);

/** Pixel Tab Handheld Prop Icon */
export const PixelTabPropIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Boba Tea / Wand */}
    <rect x="14" y="2" width="2" height="7" fill="#F43F5E" />
    <rect x="7" y="8" width="10" height="13" fill="#FB923C" />
    <rect x="8" y="9" width="8" height="10" fill="#FED7AA" />
    {/* Boba pearls */}
    <rect x="9" y="16" width="2" height="2" fill="#18181B" />
    <rect x="12" y="17" width="2" height="2" fill="#18181B" />
    <rect x="14" y="15" width="2" height="2" fill="#18181B" />
    <rect x="10" y="14" width="2" height="2" fill="#18181B" />
  </svg>
);

// -------------------------------------------------------------
// HOME SCREEN PIXEL ART ACTION ICONS
// -------------------------------------------------------------

/** Pixel Gacha Machine / Capsule Button */
export const PixelGachaMachineIcon: React.FC<IconProps> = ({ size = 36, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] ${className}`}
    {...props}
  >
    {/* Red Top Dome */}
    <rect x="7" y="2" width="10" height="2" fill="#E11D48" />
    <rect x="5" y="4" width="14" height="2" fill="#E11D48" />
    <rect x="7" y="3" width="3" height="1" fill="#FDA4AF" />
    <rect x="5" y="4" width="2" height="1" fill="#FDA4AF" />
    {/* Glass Chamber with Colored Capsules */}
    <rect x="4" y="6" width="16" height="8" fill="#BAE6FD" />
    <rect x="3" y="7" width="1" height="6" fill="#0284C7" />
    <rect x="20" y="7" width="1" height="6" fill="#0284C7" />
    <rect x="5" y="7" width="2" height="4" fill="#FFFFFF" />
    {/* Capsules inside */}
    <rect x="7" y="10" width="3" height="3" fill="#F43F5E" />
    <rect x="14" y="10" width="3" height="3" fill="#FBBF24" />
    <rect x="11" y="8" width="3" height="3" fill="#10B981" />
    <rect x="8" y="7" width="3" height="3" fill="#A855F7" />
    {/* Gacha Machine Body Base */}
    <rect x="4" y="14" width="16" height="2" fill="#BE123C" />
    <rect x="5" y="16" width="14" height="6" fill="#E11D48" />
    {/* Turn Dial */}
    <rect x="10" y="16" width="4" height="3" fill="#FDE047" />
    <rect x="11" y="15" width="2" height="5" fill="#EAB308" />
    {/* Drop Slot */}
    <rect x="9" y="20" width="6" height="2" fill="#4C0519" />
    <rect x="11" y="19" width="2" height="1" fill="#38BDF8" />
  </svg>
);

/** Pixel Wardrobe / Kimono Clothes Hanger */
export const PixelWardrobeClosetIcon: React.FC<IconProps> = ({ size = 36, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] ${className}`}
    {...props}
  >
    {/* Golden Hanger Hook */}
    <rect x="11" y="2" width="3" height="2" fill="#F59E0B" />
    <rect x="13" y="4" width="1" height="2" fill="#F59E0B" />
    <rect x="11" y="5" width="2" height="1" fill="#F59E0B" />
    {/* Wooden Hanger Bar */}
    <rect x="10" y="6" width="4" height="2" fill="#B45309" />
    <rect x="6" y="8" width="12" height="2" fill="#D97706" />
    <rect x="4" y="10" width="16" height="1" fill="#B45309" />
    {/* Cute Green Frog Kimono / Shirt */}
    <rect x="6" y="10" width="12" height="11" fill="#10B981" />
    <rect x="4" y="11" width="3" height="5" fill="#059669" />
    <rect x="17" y="11" width="3" height="5" fill="#059669" />
    {/* White Collar & Gold Obi Belt */}
    <rect x="10" y="10" width="4" height="4" fill="#FFFFFF" />
    <rect x="6" y="15" width="12" height="3" fill="#FBBF24" />
    <rect x="10" y="15" width="4" height="3" fill="#D97706" />
    {/* Bottom Hem & Sparkle */}
    <rect x="7" y="21" width="10" height="1" fill="#047857" />
    <rect x="18" y="4" width="2" height="2" fill="#FDE047" />
  </svg>
);

/** Pixel Magic Shuffle / Surprise Mix Dice & Sparkles */
export const PixelMagicMixIcon: React.FC<IconProps> = ({ size = 36, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] ${className}`}
    {...props}
  >
    {/* Golden Magic Sparkles Top Left */}
    <rect x="3" y="3" width="1" height="3" fill="#FDE047" />
    <rect x="2" y="4" width="3" height="1" fill="#FDE047" />
    {/* Golden Magic Sparkles Top Right */}
    <rect x="19" y="4" width="1" height="3" fill="#FDE047" />
    <rect x="18" y="5" width="3" height="1" fill="#FDE047" />
    {/* Pixel Die 1 (Amber / Gold) */}
    <rect x="4" y="8" width="10" height="10" fill="#F59E0B" />
    <rect x="4" y="8" width="10" height="1" fill="#FDE047" />
    <rect x="4" y="8" width="1" height="10" fill="#FDE047" />
    <rect x="13" y="8" width="1" height="10" fill="#B45309" />
    <rect x="4" y="17" width="10" height="1" fill="#B45309" />
    {/* Die 1 Pips */}
    <rect x="6" y="10" width="2" height="2" fill="#78350F" />
    <rect x="10" y="14" width="2" height="2" fill="#78350F" />
    <rect x="8" y="12" width="2" height="2" fill="#FEF08A" />
    {/* Pixel Die 2 (Emerald / Violet Magic) */}
    <rect x="11" y="11" width="10" height="10" fill="#8B5CF6" />
    <rect x="11" y="11" width="10" height="1" fill="#C4B5FD" />
    <rect x="11" y="11" width="1" height="10" fill="#C4B5FD" />
    <rect x="20" y="11" width="1" height="10" fill="#5B21B6" />
    <rect x="11" y="20" width="10" height="1" fill="#5B21B6" />
    {/* Die 2 Pips */}
    <rect x="13" y="13" width="2" height="2" fill="#EDE9FE" />
    <rect x="17" y="13" width="2" height="2" fill="#EDE9FE" />
    <rect x="15" y="15" width="2" height="2" fill="#EDE9FE" />
    <rect x="13" y="17" width="2" height="2" fill="#EDE9FE" />
    <rect x="17" y="17" width="2" height="2" fill="#EDE9FE" />
  </svg>
);

/** Pixel Heart (Pet Interaction & Affection) - 8-Bit Cozy Minimal Red, No Shadow */
export const PixelHeartPetIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* 8-Bit Minimal Cozy Red Heart (No shadow, Flat Pixel) */}
    <rect x="2" y="2" width="4" height="2" fill="#E53935" />
    <rect x="10" y="2" width="4" height="2" fill="#E53935" />
    <rect x="1" y="4" width="14" height="4" fill="#E53935" />
    <rect x="2" y="8" width="12" height="2" fill="#E53935" />
    <rect x="3" y="10" width="10" height="2" fill="#E53935" />
    <rect x="4" y="12" width="8" height="1" fill="#E53935" />
    <rect x="5" y="13" width="6" height="1" fill="#E53935" />
    <rect x="6" y="14" width="4" height="1" fill="#E53935" />
    <rect x="7" y="15" width="2" height="1" fill="#E53935" />
  </svg>
);

/** Pixel Snack Dango Treat (Feed Interaction) */
export const PixelSnackDangoIcon: React.FC<IconProps> = ({ size = 28, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.25)] ${className}`}
    {...props}
  >
    {/* Bamboo Skewer */}
    <rect x="19" y="3" width="2" height="2" fill="#D97706" />
    <rect x="17" y="5" width="2" height="2" fill="#D97706" />
    <rect x="5" y="17" width="2" height="2" fill="#B45309" />
    <rect x="3" y="19" width="2" height="2" fill="#78350F" />
    {/* Pink Dango (Top) */}
    <rect x="13" y="5" width="6" height="6" fill="#F472B6" />
    <rect x="14" y="6" width="2" height="2" fill="#FFFFFF" />
    <rect x="13" y="5" width="6" height="1" fill="#DB2777" />
    {/* White Dango (Middle) */}
    <rect x="9" y="9" width="6" height="6" fill="#F8FAFC" />
    <rect x="10" y="10" width="2" height="2" fill="#FFFFFF" />
    <rect x="9" y="14" width="6" height="1" fill="#CBD5E1" />
    {/* Green Matcha Dango (Bottom) */}
    <rect x="5" y="13" width="6" height="6" fill="#84CC16" />
    <rect x="6" y="14" width="2" height="2" fill="#BEF264" />
    <rect x="5" y="18" width="6" height="1" fill="#4D7C0F" />
  </svg>
);

/** Pixel Furin Wind Chime / Bell (Music Interaction) */
export const PixelFurinChimeIcon: React.FC<IconProps> = ({ size = 28, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.25)] ${className}`}
    {...props}
  >
    {/* Top Hanging String */}
    <rect x="11" y="2" width="2" height="3" fill="#A855F7" />
    {/* Glass Bell Dome (Sky Blue & Lavender) */}
    <rect x="8" y="5" width="8" height="2" fill="#A855F7" />
    <rect x="6" y="7" width="12" height="6" fill="#C084FC" />
    <rect x="7" y="8" width="2" height="2" fill="#FFFFFF" />
    <rect x="6" y="12" width="12" height="1" fill="#9333EA" />
    {/* Clapper Cord & Clapper */}
    <rect x="11" y="13" width="2" height="2" fill="#7E22CE" />
    <rect x="10" y="14" width="4" height="2" fill="#FDE047" />
    {/* Hanging Tanzaku Paper Strip */}
    <rect x="11" y="16" width="2" height="6" fill="#38BDF8" />
    <rect x="11" y="18" width="2" height="2" fill="#FFFFFF" />
    {/* Sound Music Note Sparkles */}
    <rect x="19" y="8" width="1" height="3" fill="#F43F5E" />
    <rect x="18" y="8" width="3" height="1" fill="#F43F5E" />
    <rect x="2" y="10" width="1" height="2" fill="#F59E0B" />
  </svg>
);

/** Pixel Art RPG Dialogue Box with tail */
export const PixelDialogueBox: React.FC<{
  text: string;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}> = ({ text, icon, onClick, className = '' }) => (
  <div
    onClick={onClick}
    className={`relative inline-flex flex-col items-center cursor-pointer select-none transition-transform active:scale-95 ${className}`}
  >
    {/* Retro RPG Dialogue Container (Crisp pixel stepped border) */}
    <div className="relative px-3.5 py-1.5 bg-[#FFFDF7] dark:bg-[#1E1915] text-[#332219] dark:text-[#F3EFE6] text-xs font-black tracking-wide border-2 border-[#3D2C22] shadow-[0_3px_0_#271911] rounded-none">
      {/* 4 Corner Pixel Cutouts / Highlights */}
      <span className="absolute -top-[2px] -left-[2px] w-[3px] h-[3px] bg-[#3D2C22]" />
      <span className="absolute -top-[2px] -right-[2px] w-[3px] h-[3px] bg-[#3D2C22]" />
      <span className="absolute -bottom-[2px] -left-[2px] w-[3px] h-[3px] bg-[#3D2C22]" />
      <span className="absolute -bottom-[2px] -right-[2px] w-[3px] h-[3px] bg-[#3D2C22]" />
      
      {/* Inner Highlight line */}
      <span className="absolute inset-[1px] border border-white/50 dark:border-white/10 pointer-events-none" />
      
      <div className="relative flex items-center gap-1.5 drop-shadow-xs">
        <span>{text}</span>
        {icon && <span className="inline-flex items-center shrink-0">{icon}</span>}
      </div>
    </div>
    
    {/* Downward Pixel Tail */}
    <div className="flex flex-col items-center -mt-[1px]">
      <span className="w-2.5 h-1 bg-[#3D2C22]" />
      <span className="w-1.5 h-1 bg-[#3D2C22]" />
    </div>
  </div>
);

/** 8-Bit Pixel Matcha Tea Cup Icon */
export const PixelMatchaCupIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Steam wisps */}
    <rect x="5" y="1" width="1" height="2" fill="#E2E8F0" opacity="0.8" />
    <rect x="6" y="2" width="1" height="2" fill="#CBD5E1" opacity="0.8" />
    <rect x="9" y="1" width="1" height="2" fill="#E2E8F0" opacity="0.8" />
    <rect x="10" y="2" width="1" height="2" fill="#CBD5E1" opacity="0.8" />
    {/* Wooden saucer coaster */}
    <rect x="3" y="13" width="10" height="2" fill="#78350F" />
    <rect x="4" y="13" width="8" height="1" fill="#92400E" />
    {/* Ceramic Bowl Outer Border */}
    <rect x="4" y="5" width="8" height="8" fill="#1C1917" />
    <rect x="3" y="6" width="10" height="6" fill="#1C1917" />
    {/* Ceramic Bowl Body (Off-white ceramic) */}
    <rect x="4" y="6" width="8" height="6" fill="#F8FAFC" />
    <rect x="3" y="7" width="10" height="4" fill="#F8FAFC" />
    {/* Bowl Shading */}
    <rect x="4" y="11" width="8" height="1" fill="#E2E8F0" />
    <rect x="11" y="7" width="1" height="4" fill="#CBD5E1" />
    {/* Matcha Green Tea Surface */}
    <rect x="5" y="6" width="6" height="3" fill="#15803D" />
    <rect x="5" y="6" width="5" height="1" fill="#22C55E" />
    <rect x="6" y="7" width="2" height="1" fill="#86EFAC" />
  </svg>
);

/** 8-Bit Pixel Sparkle Star Icon */
export const PixelSparkleStarIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Big Gold Star */}
    <rect x="7" y="1" width="2" height="12" fill="#F59E0B" />
    <rect x="2" y="6" width="12" height="2" fill="#F59E0B" />
    <rect x="6" y="3" width="4" height="8" fill="#FBBF24" />
    <rect x="4" y="5" width="8" height="4" fill="#FBBF24" />
    <rect x="7" y="5" width="2" height="4" fill="#FEF08A" />
    <rect x="6" y="6" width="4" height="2" fill="#FEF08A" />
    <rect x="7" y="6" width="2" height="2" fill="#FFFFFF" />
    {/* Small Side Sparkle */}
    <rect x="13" y="2" width="1" height="3" fill="#FDE047" />
    <rect x="12" y="3" width="3" height="1" fill="#FDE047" />
  </svg>
);

/** 8-Bit Pixel Water Droplet Icon */
export const PixelWaterDropletIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Dark Outline */}
    <rect x="7" y="2" width="2" height="2" fill="#0C4A6E" />
    <rect x="6" y="4" width="4" height="2" fill="#0C4A6E" />
    <rect x="5" y="6" width="6" height="2" fill="#0C4A6E" />
    <rect x="4" y="8" width="8" height="5" fill="#0C4A6E" />
    <rect x="5" y="13" width="6" height="1" fill="#0C4A6E" />
    {/* Water Body */}
    <rect x="7" y="3" width="2" height="1" fill="#0284C7" />
    <rect x="6" y="4" width="4" height="2" fill="#0284C7" />
    <rect x="5" y="6" width="6" height="2" fill="#0284C7" />
    <rect x="5" y="8" width="6" height="4" fill="#0284C7" />
    {/* Highlight & Light blue reflections */}
    <rect x="6" y="5" width="2" height="2" fill="#38BDF8" />
    <rect x="6" y="7" width="2" height="4" fill="#38BDF8" />
    <rect x="6" y="6" width="1" height="3" fill="#BAE6FD" />
    <rect x="6" y="6" width="2" height="1" fill="#FFFFFF" />
  </svg>
);

/** 8-Bit Pixel Sprout Leaf Icon */
export const PixelSproutLeafIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Stem */}
    <rect x="7" y="8" width="2" height="6" fill="#14532D" />
    <rect x="7" y="9" width="1" height="4" fill="#16A34A" />
    {/* Left Leaf */}
    <rect x="2" y="4" width="5" height="4" fill="#14532D" />
    <rect x="3" y="3" width="4" height="5" fill="#14532D" />
    <rect x="3" y="4" width="4" height="3" fill="#22C55E" />
    <rect x="4" y="4" width="2" height="2" fill="#86EFAC" />
    {/* Right Leaf */}
    <rect x="9" y="5" width="5" height="4" fill="#14532D" />
    <rect x="9" y="4" width="4" height="5" fill="#14532D" />
    <rect x="9" y="5" width="4" height="3" fill="#16A34A" />
    <rect x="10" y="5" width="2" height="2" fill="#4ADE80" />
  </svg>
);

/** 8-Bit Pixel Sakura Blossom Flower Icon */
export const PixelSakuraBlossomIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Dark Pink outline */}
    <rect x="6" y="2" width="4" height="2" fill="#9D174D" />
    <rect x="2" y="6" width="2" height="4" fill="#9D174D" />
    <rect x="12" y="6" width="2" height="4" fill="#9D174D" />
    <rect x="4" y="11" width="3" height="3" fill="#9D174D" />
    <rect x="9" y="11" width="3" height="3" fill="#9D174D" />
    {/* Petal Body (Soft Pink) */}
    <rect x="5" y="3" width="6" height="4" fill="#F472B6" />
    <rect x="3" y="6" width="10" height="4" fill="#F472B6" />
    <rect x="4" y="10" width="3" height="3" fill="#F472B6" />
    <rect x="9" y="10" width="3" height="3" fill="#F472B6" />
    {/* Highlights */}
    <rect x="6" y="4" width="4" height="2" fill="#FBCFE8" />
    <rect x="4" y="7" width="2" height="2" fill="#FBCFE8" />
    <rect x="10" y="7" width="2" height="2" fill="#FBCFE8" />
    {/* Golden Center Pistil */}
    <rect x="7" y="7" width="2" height="2" fill="#F59E0B" />
    <rect x="7" y="7" width="1" height="1" fill="#FEF08A" />
  </svg>
);

/** 8-Bit Pixel Wood Log / Cottage Icon */
export const PixelCampfireLogIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Log Bark Dark */}
    <rect x="2" y="6" width="12" height="6" fill="#451A03" />
    <rect x="3" y="5" width="10" height="8" fill="#451A03" />
    {/* Log Bark Medium */}
    <rect x="3" y="6" width="10" height="6" fill="#78350F" />
    <rect x="4" y="6" width="8" height="2" fill="#92400E" />
    {/* Cut Ring on Left */}
    <rect x="3" y="7" width="3" height="4" fill="#D97706" />
    <rect x="4" y="8" width="1" height="2" fill="#FDE68A" />
    {/* Wood grain line */}
    <rect x="7" y="8" width="4" height="1" fill="#451A03" />
    <rect x="9" y="10" width="3" height="1" fill="#451A03" />
  </svg>
);

/** 8-Bit Pixel Heart Emote Icon */
export const PixelHeartEmoteIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Dark Border */}
    <rect x="3" y="3" width="4" height="2" fill="#881337" />
    <rect x="9" y="3" width="4" height="2" fill="#881337" />
    <rect x="2" y="4" width="12" height="5" fill="#881337" />
    <rect x="3" y="9" width="10" height="2" fill="#881337" />
    <rect x="5" y="11" width="6" height="2" fill="#881337" />
    <rect x="7" y="13" width="2" height="2" fill="#881337" />
    {/* Heart Body (Vibrant Emerald / Rose Green or Red) */}
    <rect x="3" y="4" width="4" height="4" fill="#10B981" />
    <rect x="9" y="4" width="4" height="4" fill="#10B981" />
    <rect x="3" y="7" width="10" height="2" fill="#10B981" />
    <rect x="4" y="9" width="8" height="2" fill="#10B981" />
    <rect x="6" y="11" width="4" height="2" fill="#10B981" />
    <rect x="7" y="13" width="2" height="1" fill="#10B981" />
    {/* Highlights */}
    <rect x="4" y="4" width="2" height="2" fill="#A7F3D0" />
    <rect x="4" y="4" width="1" height="1" fill="#FFFFFF" />
    <rect x="10" y="4" width="2" height="2" fill="#34D399" />
  </svg>
);

/** 8-Bit Pixel Gacha Ticket Icon (Cozy Amber Golden Ticket with Notched Perforations) */
export const PixelGachaTicketIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="crispEdges"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Ticket Dark Border */}
    <rect x="3" y="4" width="14" height="12" fill="#78350F" />
    {/* Notched cutouts on left and right */}
    <rect x="2" y="8" width="2" height="4" fill="none" />
    <rect x="16" y="8" width="2" height="4" fill="none" />
    
    {/* Ticket Golden Body */}
    <rect x="4" y="5" width="12" height="10" fill="#FBBF24" />
    {/* Ticket Inner Shading & Highlight */}
    <rect x="4" y="5" width="12" height="1" fill="#FDE68A" />
    <rect x="4" y="6" width="1" height="8" fill="#FDE68A" />
    <rect x="4" y="14" width="12" height="1" fill="#D97706" />
    <rect x="15" y="6" width="1" height="8" fill="#D97706" />

    {/* Center Perforated Ticket Notches */}
    <rect x="2" y="8" width="2" height="4" fill="#000000" fillOpacity="0" />
    <rect x="3" y="8" width="1" height="4" fill="#78350F" />
    <rect x="16" y="8" width="1" height="4" fill="#78350F" />
    <rect x="4" y="9" width="1" height="2" fill="#78350F" />
    <rect x="15" y="9" width="1" height="2" fill="#78350F" />

    {/* Center Clover / Star Motif (Pixel Emerald Green) */}
    <rect x="9" y="8" width="2" height="4" fill="#15803D" />
    <rect x="8" y="9" width="4" height="2" fill="#15803D" />
    <rect x="9" y="9" width="2" height="2" fill="#4ADE80" />
    {/* Gold Sparkle accents */}
    <rect x="6" y="7" width="1" height="1" fill="#FEF3C7" />
    <rect x="13" y="12" width="1" height="1" fill="#FEF3C7" />
  </svg>
);


