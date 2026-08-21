import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

// ----------------- CROAKLE MOOD ICONS (5-tier) -----------------

/** 5 - Rad / Excited (Yellow / Golden Theme): Frog happily eating meal with golden sparkles and warm bowl */
export const FrogMoodRad: React.FC<IconProps> = ({ size = 32, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Golden Glow / Sparkles */}
    <path d="M52 14L54 8L56 14L62 16L56 18L54 24L52 18L46 16L52 14Z" fill="#FACC15" />
    <path d="M12 20L13.5 16L15 20L19 21.5L15 23L13.5 27L12 23L8 21.5L12 20Z" fill="#EAB308" />

    {/* Frog Head & Body */}
    <path
      d="M16 36C16 22 22 14 34 14C46 14 52 22 52 36C52 44 48 50 34 50C20 50 16 44 16 36Z"
      fill="#88B868"
      stroke="#2D3A20"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* White Belly */}
    <path
      d="M24 38C24 30 28 26 34 26C40 26 44 30 44 38C44 44 40 48 34 48C28 48 24 44 24 38Z"
      fill="#FEF9C3"
    />

    {/* Eyes - Joyful determined squint */}
    <path d="M22 24L30 28" stroke="#2D3A20" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M46 24L38 28" stroke="#2D3A20" strokeWidth="2.5" strokeLinecap="round" />

    {/* Rosy Warm Cheeks */}
    <ellipse cx="21" cy="33" rx="3.5" ry="2.5" fill="#EAB308" fillOpacity="0.9" />
    <ellipse cx="47" cy="33" rx="3.5" ry="2.5" fill="#EAB308" fillOpacity="0.9" />

    {/* Smiling Mouth */}
    <path d="M30 35Q34 39 38 35" stroke="#2D3A20" strokeWidth="2" strokeLinecap="round" fill="none" />

    {/* Golden Yellow Bowl & Rice */}
    <ellipse cx="34" cy="52" rx="14" ry="6" fill="#EAB308" stroke="#854D0E" strokeWidth="2" />
    <ellipse cx="34" cy="49" rx="11" ry="4" fill="#FFFFFF" />
    {/* Side Dish Plate */}
    <ellipse cx="14" cy="54" rx="8" ry="3.5" fill="#FDE047" stroke="#854D0E" strokeWidth="1.5" />
    <ellipse cx="14" cy="53" rx="6" ry="2" fill="#CA8A04" />

    {/* Chopsticks */}
    <line x1="42" y1="42" x2="28" y2="48" stroke="#A16207" strokeWidth="2" strokeLinecap="round" />
    <line x1="44" y1="44" x2="30" y2="50" stroke="#A16207" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** 4 - Good / Content (Sakura Pink Theme): Frog sitting peacefully reading a bright sakura pink book */
export const FrogMoodGood: React.FC<IconProps> = ({ size = 32, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Sakura Pink sparkles */}
    <circle cx="10" cy="18" r="2" fill="#F472B6" />
    <circle cx="54" cy="16" r="2.5" fill="#EC4899" />

    {/* Frog Head & Body */}
    <path
      d="M16 34C16 20 23 13 33 13C43 13 50 20 50 34C50 44 45 49 33 49C21 49 16 44 16 34Z"
      fill="#88B868"
      stroke="#2D3A20"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* White Belly */}
    <path
      d="M23 35C23 27 27 24 33 24C39 24 43 27 43 35C43 43 39 46 33 46C27 46 23 43 23 35Z"
      fill="#FDF2F8"
    />

    {/* Cheeks - Sweet sakura pink */}
    <ellipse cx="20" cy="32" rx="3.5" ry="2" fill="#EC4899" fillOpacity="0.8" />
    <ellipse cx="46" cy="32" rx="3.5" ry="2" fill="#EC4899" fillOpacity="0.8" />

    {/* Eyes - Calm, peaceful curve */}
    <path d="M22 26Q27 23 29 27" stroke="#2D3A20" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M44 26Q39 23 37 27" stroke="#2D3A20" strokeWidth="2.5" strokeLinecap="round" fill="none" />

    {/* Soft smile */}
    <path d="M30 33Q33 36 36 33" stroke="#2D3A20" strokeWidth="2" strokeLinecap="round" fill="none" />

    {/* Bright Sakura Pink Book Opened in Hands */}
    <path
      d="M22 41L33 46L44 41L44 54L33 58L22 54Z"
      fill="#EC4899"
      stroke="#BE185D"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M24 43L33 47L42 43L42 53L33 56L24 53Z"
      fill="#FDF2F8"
    />
    {/* Spine line */}
    <line x1="33" y1="46" x2="33" y2="57" stroke="#DB2777" strokeWidth="1.5" />

    {/* Cute little green hands holding book */}
    <circle cx="21" cy="44" r="3.5" fill="#88B868" stroke="#2D3A20" strokeWidth="1.5" />
    <circle cx="45" cy="44" r="3.5" fill="#88B868" stroke="#2D3A20" strokeWidth="1.5" />
  </svg>
);

/** 3 - Meh / Pensive (Green Theme): Frog with folded arms wearing green lotus leaf hat, thinking quietly */
export const FrogMoodMeh: React.FC<IconProps> = ({ size = 32, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Big Lotus Leaf Hat */}
    <path
      d="M10 20C18 8 46 8 54 20C46 22 36 21 32 24C28 21 18 22 10 20Z"
      fill="#6B9B52"
      stroke="#2D3A20"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Leaf Stem & Veins */}
    <path d="M32 9L30 4" stroke="#2D3A20" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M32 14L20 18" stroke="#4F793A" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M32 14L44 18" stroke="#4F793A" strokeWidth="1.5" strokeLinecap="round" />

    {/* Frog Head & Body */}
    <path
      d="M18 36C18 24 23 18 32 18C41 18 46 24 46 36C46 46 42 51 32 51C22 51 18 46 18 36Z"
      fill="#88B868"
      stroke="#2D3A20"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Belly */}
    <path
      d="M24 37C24 30 27 27 32 27C37 27 40 30 40 37C40 44 37 48 32 48C27 48 24 44 24 37Z"
      fill="#DCFCE7"
    />

    {/* Classic Straight-line squint eyes */}
    <line x1="22" y1="29" x2="28" y2="29" stroke="#2D3A20" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="36" y1="29" x2="42" y2="29" stroke="#2D3A20" strokeWidth="2.5" strokeLinecap="round" />

    {/* Neutral Mouth */}
    <line x1="29" y1="36" x2="35" y2="36" stroke="#2D3A20" strokeWidth="2" strokeLinecap="round" />

    {/* Folded Arms */}
    <path
      d="M20 42C24 45 40 45 44 42"
      stroke="#2D3A20"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="#88B868"
    />
    {/* Steaming Green Matcha Tea Cup beside */}
    <rect x="46" y="44" width="8" height="9" rx="2" fill="#BBF7D0" stroke="#166534" strokeWidth="1.5" />
    <path d="M49 41Q50 39 49 37" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** 2 - Bad / Weary (Blue Theme): Frog resting under cozy ocean blue blanket with ice pack */
export const FrogMoodBad: React.FC<IconProps> = ({ size = 32, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Pillow */}
    <rect x="14" y="24" width="36" height="18" rx="8" fill="#E0F2FE" stroke="#0369A1" strokeWidth="2" />

    {/* Frog Head on Pillow */}
    <ellipse cx="32" cy="29" rx="14" ry="11" fill="#88B868" stroke="#2D3A20" strokeWidth="2.5" />

    {/* Ice pack or cloth on head */}
    <path
      d="M26 21C28 17 36 17 38 21C35 22 29 22 26 21Z"
      fill="#38BDF8"
      stroke="#0284C7"
      strokeWidth="1.5"
    />
    {/* Ribbon tie */}
    <circle cx="32" cy="18" r="1.5" fill="#0284C7" />

    {/* Tired sleepy eyes */}
    <path d="M24 28Q27 30 29 28" stroke="#2D3A20" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M35 28Q37 30 40 28" stroke="#2D3A20" strokeWidth="2.5" strokeLinecap="round" fill="none" />

    {/* Subtle weary mouth */}
    <path d="M30 34Q32 32 34 34" stroke="#2D3A20" strokeWidth="1.5" strokeLinecap="round" fill="none" />

    {/* Bright Blue Quilt Blanket */}
    <path
      d="M10 36C18 34 46 34 54 36L56 55C56 57 54 59 52 59H12C10 59 8 57 8 55L10 36Z"
      fill="#0284C7"
      stroke="#0369A1"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Quilt Pattern Lines */}
    <line x1="12" y1="46" x2="52" y2="46" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
    <path d="M22 36L20 59" stroke="#38BDF8" strokeWidth="1.5" />
    <path d="M42 36L44 59" stroke="#38BDF8" strokeWidth="1.5" />
  </svg>
);

/** 1 - Awful / Overwhelmed (Black / Charcoal Theme): Frog sheltering under dark obsidian umbrella with dark stormy rain drops */
export const FrogMoodAwful: React.FC<IconProps> = ({ size = 32, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Rain drops */}
    <path d="M12 12L10 17" stroke="#52525B" strokeWidth="2" strokeLinecap="round" />
    <path d="M52 10L50 16" stroke="#52525B" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 6L18 11" stroke="#52525B" strokeWidth="2" strokeLinecap="round" />
    <path d="M46 22L44 27" stroke="#52525B" strokeWidth="2" strokeLinecap="round" />

    {/* Dark Obsidian / Charcoal Umbrella Leaf */}
    <path
      d="M8 24C16 14 42 16 56 26C44 28 20 28 8 24Z"
      fill="#27272A"
      stroke="#09090B"
      strokeWidth="2"
    />
    <path d="M30 18L32 50" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />

    {/* Little Frog Crouched */}
    <ellipse cx="28" cy="44" rx="12" ry="9" fill="#88B868" stroke="#2D3A20" strokeWidth="2.5" />
    <ellipse cx="26" cy="45" rx="7" ry="5" fill="#E4E4E7" />

    {/* Sad / gentle drooping eyes */}
    <path d="M22 41L26 43" stroke="#2D3A20" strokeWidth="2" strokeLinecap="round" />
    <path d="M30 43L34 41" stroke="#2D3A20" strokeWidth="2" strokeLinecap="round" />

    {/* Small tear / droplet */}
    <circle cx="21" cy="46" r="1.5" fill="#71717A" />

    {/* Charcoal Puddle */}
    <ellipse cx="32" cy="56" rx="20" ry="4" fill="#71717A" fillOpacity="0.5" />
  </svg>
);

// ----------------- CROAKLE YARD & ITEMS ICONS -----------------

/** Authentic Four-leaf clover */
export const CloverIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Stem */}
    <path
      d="M24 24C24 35 20 44 14 46"
      stroke="#3E6B2C"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    {/* Top Leaf */}
    <path
      d="M24 24C20 16 12 12 18 6C24 0 24 16 24 24Z"
      fill="#6DA84C"
      stroke="#2D4C20"
      strokeWidth="2"
    />
    {/* Right Leaf */}
    <path
      d="M24 24C32 20 36 12 42 18C48 24 32 24 24 24Z"
      fill="#7EBE59"
      stroke="#2D4C20"
      strokeWidth="2"
    />
    {/* Bottom Leaf */}
    <path
      d="M24 24C28 32 36 36 30 42C24 48 24 32 24 24Z"
      fill="#6DA84C"
      stroke="#2D4C20"
      strokeWidth="2"
    />
    {/* Left Leaf */}
    <path
      d="M24 24C16 28 12 36 6 30C0 24 16 24 24 24Z"
      fill="#85C760"
      stroke="#2D4C20"
      strokeWidth="2"
    />
    {/* Center highlight star */}
    <circle cx="24" cy="24" r="2.5" fill="#D6F0A8" />
  </svg>
);

/** Three-leaf yard clover */
export const ThreeLeafCloverIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    <path d="M24 24C24 34 20 42 16 44" stroke="#3E6B2C" strokeWidth="3" strokeLinecap="round" />
    {/* Top */}
    <path d="M24 24C18 16 12 10 20 5C27 1 27 16 24 24Z" fill="#6DA84C" stroke="#2D4C20" strokeWidth="2" />
    {/* Right */}
    <path d="M24 24C32 18 40 16 41 25C42 33 29 27 24 24Z" fill="#7EBE59" stroke="#2D4C20" strokeWidth="2" />
    {/* Left */}
    <path d="M24 24C16 29 8 33 7 25C6 17 19 21 24 24Z" fill="#85C760" stroke="#2D4C20" strokeWidth="2" />
  </svg>
);

/** Frog Backpack / Bindle */
export const FrogBackpackIcon: React.FC<IconProps> = ({ size = 28, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Blue spotted bundle cloth (Furoshiki) */}
    <circle cx="24" cy="24" r="16" fill="#4B779E" stroke="#1F364A" strokeWidth="2.5" />
    <circle cx="16" cy="18" r="2" fill="#E8F1F8" />
    <circle cx="26" cy="16" r="2" fill="#E8F1F8" />
    <circle cx="20" cy="28" r="2" fill="#E8F1F8" />
    <circle cx="32" cy="26" r="2" fill="#E8F1F8" />
    {/* Top Knot */}
    <path
      d="M18 12C20 6 28 6 30 12C26 14 22 14 18 12Z"
      fill="#375D7D"
      stroke="#1F364A"
      strokeWidth="2"
    />
    <circle cx="24" cy="12" r="3" fill="#2E506D" stroke="#1F364A" strokeWidth="1.5" />
    {/* Hanging wooden charm */}
    <line x1="34" y1="28" x2="38" y2="36" stroke="#A86B32" strokeWidth="2" />
    <rect x="35" y="34" width="7" height="9" rx="1.5" fill="#DDB27C" stroke="#7A4B1E" strokeWidth="1.5" />
  </svg>
);

/** Maimai the Snail Friend */
export const SnailFriendIcon: React.FC<IconProps> = ({ size = 32, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Snail Body */}
    <path
      d="M10 38C10 34 16 32 26 32C36 32 44 34 44 38C44 40 38 42 26 42C14 42 10 40 10 38Z"
      fill="#F2E6CA"
      stroke="#4A3D2A"
      strokeWidth="2"
    />
    {/* Snail Head & Eyestalks */}
    <path d="M38 34C40 28 42 22 43 16" stroke="#4A3D2A" strokeWidth="2" strokeLinecap="round" />
    <circle cx="43" cy="15" r="2" fill="#4A3D2A" />
    <path d="M35 34C36 28 37 20 37 14" stroke="#4A3D2A" strokeWidth="2" strokeLinecap="round" />
    <circle cx="37" cy="13" r="2" fill="#4A3D2A" />

    {/* Swirl Shell */}
    <circle cx="22" cy="26" r="12" fill="#E2CCAB" stroke="#4A3D2A" strokeWidth="2.5" />
    <path
      d="M22 18C26 18 29 21 29 25C29 28 26 30 23 30C20 30 19 28 19 26C19 24 21 23 23 23"
      stroke="#7D6242"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

/** Kani the Crab Friend */
export const CrabFriendIcon: React.FC<IconProps> = ({ size = 32, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Legs */}
    <path d="M8 28L4 34" stroke="#3A2218" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 34L8 42" stroke="#3A2218" strokeWidth="2" strokeLinecap="round" />
    <path d="M40 28L44 34" stroke="#3A2218" strokeWidth="2" strokeLinecap="round" />
    <path d="M36 34L40 42" stroke="#3A2218" strokeWidth="2" strokeLinecap="round" />

    {/* Claws */}
    <path d="M12 20L6 14C4 18 10 24 14 24" fill="#D95C3C" stroke="#3A2218" strokeWidth="2" strokeLinejoin="round" />
    <path d="M36 20L42 14C44 18 38 24 34 24" fill="#D95C3C" stroke="#3A2218" strokeWidth="2" strokeLinejoin="round" />

    {/* Shell Body */}
    <ellipse cx="24" cy="28" rx="14" ry="9" fill="#D95C3C" stroke="#3A2218" strokeWidth="2.5" />
    <ellipse cx="24" cy="29" rx="9" ry="5" fill="#EAA187" />

    {/* Eyes */}
    <circle cx="19" cy="18" r="3" fill="#FFFFFF" stroke="#3A2218" strokeWidth="1.5" />
    <circle cx="19" cy="18" r="1.5" fill="#3A2218" />
    <circle cx="29" cy="18" r="3" fill="#FFFFFF" stroke="#3A2218" strokeWidth="1.5" />
    <circle cx="29" cy="18" r="1.5" fill="#3A2218" />
  </svg>
);

/** Bento Basket with Grape Scone */
export const SconeItemIcon: React.FC<IconProps> = ({ size = 28, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Wicker basket tray */}
    <rect x="6" y="24" width="36" height="18" rx="5" fill="#B3804D" stroke="#4A3016" strokeWidth="2" />
    <line x1="12" y1="24" x2="12" y2="42" stroke="#8C5C2D" strokeWidth="1.5" />
    <line x1="24" y1="24" x2="24" y2="42" stroke="#8C5C2D" strokeWidth="1.5" />
    <line x1="36" y1="24" x2="36" y2="42" stroke="#8C5C2D" strokeWidth="1.5" />

    {/* Checkered Pink Cloth */}
    <path d="M10 22L24 16L38 22L36 30H12L10 22Z" fill="#F0B6BA" />

    {/* Fresh Baked Scone */}
    <ellipse cx="24" cy="20" rx="12" ry="7" fill="#E8C488" stroke="#4A3016" strokeWidth="2" />
    {/* Raisins / Blueberries */}
    <circle cx="18" cy="19" r="1.8" fill="#4B3454" />
    <circle cx="24" cy="22" r="1.8" fill="#4B3454" />
    <circle cx="29" cy="18" r="1.8" fill="#4B3454" />
  </svg>
);

/** Fresh Garden Veggie Sandwich */
export const SandwichItemIcon: React.FC<IconProps> = ({ size = 28, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    <rect x="6" y="24" width="36" height="18" rx="5" fill="#B3804D" stroke="#4A3016" strokeWidth="2" />
    {/* Green cloth */}
    <path d="M10 22L24 16L38 22L36 30H12L10 22Z" fill="#B5D6A7" />

    {/* Triangle Sandwich */}
    <path d="M14 26L24 12L34 26Z" fill="#F0DEC0" stroke="#4A3016" strokeWidth="2" strokeLinejoin="round" />
    {/* Filling layers (lettuce, tomato, cheese) */}
    <path d="M16 23L32 23" stroke="#68A34A" strokeWidth="3" strokeLinecap="round" />
    <path d="M18 20L30 20" stroke="#D95C3C" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M20 17L28 17" stroke="#EDB23C" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Plum Onigiri Bento */
export const OnigiriItemIcon: React.FC<IconProps> = ({ size = 28, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    <rect x="6" y="24" width="36" height="18" rx="5" fill="#B3804D" stroke="#4A3016" strokeWidth="2" />
    {/* Bamboo leaf base */}
    <ellipse cx="24" cy="24" rx="16" ry="6" fill="#75A65A" />

    {/* Triangular Rice Ball */}
    <path
      d="M24 10C21 10 13 22 14 26C15 29 33 29 34 26C35 22 27 10 24 10Z"
      fill="#FFFFFF"
      stroke="#2D3A20"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Nori Seaweed wrap */}
    <path d="M20 22H28V28H20V22Z" fill="#252F2B" />
    {/* Red Umeboshi Plum dot */}
    <circle cx="24" cy="18" r="2" fill="#C43D43" />
  </svg>
);

/** Wooden Bell Charm */
export const BellCharmIcon: React.FC<IconProps> = ({ size = 28, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Cord */}
    <path d="M24 6V14" stroke="#4AA4A8" strokeWidth="3" strokeLinecap="round" />
    <circle cx="24" cy="14" r="3" fill="#D98A3C" stroke="#4A3016" strokeWidth="1.5" />
    {/* Wooden Bell Cylinder */}
    <rect x="18" y="16" width="12" height="20" rx="6" fill="#C99863" stroke="#4A3016" strokeWidth="2" />
    <line x1="20" y1="28" x2="28" y2="28" stroke="#4A3016" strokeWidth="1.5" />
    {/* Slit hole */}
    <circle cx="24" cy="31" r="2" fill="#4A3016" />
    {/* Hanging Tassel */}
    <line x1="24" y1="36" x2="24" y2="44" stroke="#4AA4A8" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/** Paper Lantern Tool */
export const LanternToolIcon: React.FC<IconProps> = ({ size = 28, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Hanging handle */}
    <path d="M16 14C16 8 32 8 32 14" stroke="#4A3016" strokeWidth="2" fill="none" />
    {/* Top Cap */}
    <rect x="16" y="14" width="16" height="4" rx="1.5" fill="#3D3025" />
    {/* Glowing Paper Body */}
    <path
      d="M16 18C13 26 13 32 16 36H32C35 32 35 26 32 18H16Z"
      fill="#FCE59F"
      stroke="#4A3016"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Candle flame glow inside */}
    <ellipse cx="24" cy="27" rx="3.5" ry="5" fill="#E86E3C" />
    <ellipse cx="24" cy="28" rx="2" ry="3" fill="#FFF3B0" />
    {/* Bottom Cap */}
    <rect x="16" y="36" width="16" height="4" rx="1.5" fill="#3D3025" />
    {/* Red Tassel */}
    <path d="M24 40V46" stroke="#C43D43" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/** Postcard Stamp Badge */
export const PostcardStampIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Stamp Scalloped Edge */}
    <rect x="4" y="4" width="32" height="32" rx="3" fill="#FAF5ED" stroke="#8C7356" strokeWidth="2" strokeDasharray="3 3" />
    <rect x="8" y="8" width="24" height="24" fill="#E6D3BA" stroke="#A88B69" strokeWidth="1" />
    {/* Mini Frog Silhouette in Stamp */}
    <circle cx="20" cy="18" r="5" fill="#6B9B52" />
    <path d="M16 26C16 22 24 22 24 26" stroke="#6B9B52" strokeWidth="2" />
  </svg>
);

/** Dynamic Mood Icon mapping to replace raw emojis */
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

/** Dynamic Item Icon mapping to replace item emojis */
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

// ----------------- CRAFTED DOCK & PAGE NAVIGATION ICONS -----------------

/** 1. Home Treehouse Cottage Icon */
export const FrogHouseDockIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Thatched Roof */}
    <path
      d="M16 4L3 14H29L16 4Z"
      fill="#8C5832"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M16 4V13" stroke="#5E381C" strokeWidth="1.2" />
    {/* Chimney / Chimney puff */}
    <path d="M23 7V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="23" cy="5" r="1" fill="#C9BDAA" />
    {/* Wooden Wall */}
    <rect x="6" y="14" width="20" height="13" rx="2" fill="#D9BA8B" stroke="currentColor" strokeWidth="1.8" />
    {/* Round Window with Cross */}
    <circle cx="11" cy="20" r="3" fill="#FFF3CD" stroke="currentColor" strokeWidth="1.2" />
    <line x1="11" y1="17" x2="11" y2="23" stroke="currentColor" strokeWidth="1" />
    <line x1="8" y1="20" x2="14" y2="20" stroke="currentColor" strokeWidth="1" />
    {/* Wooden Arch Door */}
    <path
      d="M18 27V19C18 17.5 22 17.5 22 19V27"
      fill="#6E4424"
      stroke="currentColor"
      strokeWidth="1.2"
    />
  </svg>
);

/** 2. Habits Clover Check Icon */
export const HabitCloverDockIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Clover leaves */}
    <path d="M16 16C13 10 7 8 11 4C15 0 16 10 16 16Z" fill="#75AC56" stroke="currentColor" strokeWidth="1.6" />
    <path d="M16 16C22 13 24 7 28 11C32 15 22 16 16 16Z" fill="#88C464" stroke="currentColor" strokeWidth="1.6" />
    <path d="M16 16C19 22 25 24 21 28C17 32 16 22 16 16Z" fill="#75AC56" stroke="currentColor" strokeWidth="1.6" />
    <path d="M16 16C10 19 8 25 4 21C0 17 10 16 16 16Z" fill="#97D672" stroke="currentColor" strokeWidth="1.6" />
    {/* Checkmark inside */}
    <circle cx="16" cy="16" r="6" fill="#FFFDF8" stroke="currentColor" strokeWidth="1.4" />
    <path d="M13 16L15 18.5L19 13.5" stroke="#2D5A1E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 3. Projects Bamboo Folder / Scroll Icon */
export const BambooScrollDockIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Bamboo Slat Folder */}
    <rect x="5" y="6" width="22" height="20" rx="3" fill="#C59B63" stroke="currentColor" strokeWidth="1.8" />
    {/* Bamboo vertical slats */}
    <line x1="10" y1="6" x2="10" y2="26" stroke="#9E7440" strokeWidth="1.2" />
    <line x1="16" y1="6" x2="16" y2="26" stroke="#9E7440" strokeWidth="1.2" />
    <line x1="22" y1="6" x2="22" y2="26" stroke="#9E7440" strokeWidth="1.2" />
    {/* Cord tie & Leaf Seal */}
    <line x1="5" y1="16" x2="27" y2="16" stroke="#B84B3A" strokeWidth="1.8" />
    <circle cx="16" cy="16" r="3.5" fill="#699B52" stroke="currentColor" strokeWidth="1.2" />
    <path d="M15 14.5L17 17.5" stroke="#FFF" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

/** 4. Mood Frog Face Icon */
export const FrogFaceDockIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Eyes on top */}
    <circle cx="9" cy="9" r="4.5" fill="#88B868" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="23" cy="9" r="4.5" fill="#88B868" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="9" cy="9" r="2" fill="#241F1A" />
    <circle cx="23" cy="9" r="2" fill="#241F1A" />
    {/* White eye reflections */}
    <circle cx="8" cy="8" r="0.8" fill="#FFFFFF" />
    <circle cx="22" cy="8" r="0.8" fill="#FFFFFF" />
    {/* Head */}
    <ellipse cx="16" cy="18" rx="12" ry="9" fill="#88B868" stroke="currentColor" strokeWidth="1.8" />
    {/* Cheeks */}
    <circle cx="8" cy="19" r="1.8" fill="#E88B8B" fillOpacity="0.8" />
    <circle cx="24" cy="19" r="1.8" fill="#E88B8B" fillOpacity="0.8" />
    {/* Happy Wide Smile */}
    <path d="M12 18Q16 23 20 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
  </svg>
);

/** 5. Journal / Notes Washi Book Icon */
export const WashiJournalDockIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Book Cover */}
    <rect x="6" y="5" width="20" height="22" rx="2.5" fill="#C45A46" stroke="currentColor" strokeWidth="1.8" />
    {/* Paper Edge */}
    <path d="M23 7V25" stroke="#FFFBF2" strokeWidth="2.5" strokeLinecap="round" />
    {/* Japanese String Binding (Watoji) */}
    <line x1="10" y1="5" x2="10" y2="27" stroke="#F5ECD8" strokeWidth="1.2" />
    <line x1="6" y1="9" x2="10" y2="9" stroke="#F5ECD8" strokeWidth="1.5" />
    <line x1="6" y1="16" x2="10" y2="16" stroke="#F5ECD8" strokeWidth="1.5" />
    <line x1="6" y1="23" x2="10" y2="23" stroke="#F5ECD8" strokeWidth="1.5" />
    {/* Gold Title Tag */}
    <rect x="14" y="9" width="6" height="12" rx="1" fill="#FFFDF8" stroke="currentColor" strokeWidth="1" />
    <line x1="17" y1="11" x2="17" y2="19" stroke="#C45A46" strokeWidth="1" strokeLinecap="round" strokeDasharray="1.5 1.5" />
  </svg>
);

/** 6. Focus Timer / Pocket Lantern Icon */
export const PocketTimerDockIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Top Loop */}
    <circle cx="16" cy="6" r="3" stroke="currentColor" strokeWidth="1.6" fill="none" />
    {/* Watch Crown */}
    <rect x="14.5" y="8" width="3" height="2.5" rx="0.5" fill="#C59B63" stroke="currentColor" strokeWidth="1.2" />
    {/* Body */}
    <circle cx="16" cy="19" r="10" fill="#E8D5B5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="16" cy="19" r="7.5" fill="#FFFDF8" stroke="currentColor" strokeWidth="1" />
    {/* Dial Markers */}
    <circle cx="16" cy="13.5" r="0.8" fill="#6E4424" />
    <circle cx="21.5" cy="19" r="0.8" fill="#6E4424" />
    <circle cx="16" cy="24.5" r="0.8" fill="#6E4424" />
    <circle cx="10.5" cy="19" r="0.8" fill="#6E4424" />
    {/* Clock Hands pointing to 10:10 */}
    <line x1="16" y1="19" x2="14" y2="15" stroke="#C45A46" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="16" y1="19" x2="19.5" y2="17" stroke="#241F1A" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="16" cy="19" r="1" fill="#C45A46" />
  </svg>
);

/** 7. Stats / Torii Stone Path Icon */
export const ToriiStatsDockIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Stepped Wooden Bar Charts styled as Japanese shrine steps */}
    <rect x="5" y="19" width="5" height="8" rx="1.5" fill="#88B868" stroke="currentColor" strokeWidth="1.6" />
    <rect x="13.5" y="13" width="5" height="14" rx="1.5" fill="#5F7A61" stroke="currentColor" strokeWidth="1.6" />
    <rect x="22" y="7" width="5" height="20" rx="1.5" fill="#D98236" stroke="currentColor" strokeWidth="1.6" />
    {/* Upward Growth Sprout */}
    <path d="M24.5 4L26 2L27.5 4" stroke="#6DA84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 8. Settings Carved Wooden Wheel / Windmill Icon */
export const WoodGearDockIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Traditional Pinwheel / Waterwheel Flower Gear */}
    <circle cx="16" cy="16" r="10" fill="#E2CCAB" stroke="currentColor" strokeWidth="1.8" />
    {/* Petals / Teeth */}
    <path d="M16 6V10M16 22V26M6 16H10M22 16H26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M9 9L12 12M20 20L23 23M9 23L12 20M20 12L23 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    {/* Center brass hub */}
    <circle cx="16" cy="16" r="4.5" fill="#D98A3C" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="16" cy="16" r="1.5" fill="#FFFDF8" />
  </svg>
);

/** Project Bamboo Scroll Alias */
export const BambooProjectDockIcon = BambooScrollDockIcon;

/** Wooden Ema Plaque Icon for Habits Breakdown */
export const EmaTabIcon: React.FC<IconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    <path
      d="M12 3L21 8V20C21 20.6 20.6 21 20 21H4C3.4 21 3 20.6 3 20V8L12 3Z"
      fill="#E8D5B5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="7" r="1.5" fill="#C45A46" />
    <path d="M7 14H17M7 17H13" stroke="#6E4424" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);



