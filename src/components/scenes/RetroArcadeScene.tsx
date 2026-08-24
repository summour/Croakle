import React from 'react';

interface SceneProps {
  animTick: number;
  fullscreen?: boolean;
}

export const RetroArcadeScene: React.FC<SceneProps> = ({ animTick, fullscreen }) => {
  return (
    <g id="scene-retro-arcade">
      {/* 80s/90s Dark Arcade Interior Wall with Neon Wireframe Grid */}
      {fullscreen ? (
        <g>
          <rect x="0" y="-80" width="160" height="142" fill="#09090b" />
          <rect x="0" y="-40" width="160" height="1" fill="#4c1d95" opacity="0.5" />
          <rect x="0" y="0" width="160" height="1" fill="#4c1d95" opacity="0.5" />
        </g>
      ) : (
        <rect x="0" y="0" width="160" height="62" fill="#09090b" />
      )}

      {/* Cyber Neon Horizon Grid on Back Wall */}
      <rect x="0" y="20" width="160" height="1" fill="#ec4899" opacity="0.4" />
      <rect x="0" y="36" width="160" height="1" fill="#a855f7" opacity="0.5" />
      <rect x="0" y="50" width="160" height="1" fill="#06b6d4" opacity="0.6" />

      {/* Glowing Neon Sign across Top Wall (Pure 8-Bit Pixel Font "ARCADE") */}
      <g id="neon-arcade-sign" transform="translate(46, 6)">
        <rect x="0" y="0" width="68" height="16" fill="#18181b" />
        <rect x="0" y="0" width="68" height="1" fill="#ec4899" />
        <rect x="0" y="15" width="68" height="1" fill="#ec4899" />
        <rect x="0" y="0" width="1" height="16" fill="#ec4899" />
        <rect x="67" y="0" width="1" height="16" fill="#ec4899" />

        {/* 8-Bit Pixel Art Letters: ARCADE */}
        <g transform="translate(6, 4)" fill="#f43f5e">
          {/* A */}
          <g transform="translate(0, 0)">
            <rect x="1" y="0" width="4" height="1" />
            <rect x="0" y="1" width="2" height="7" />
            <rect x="4" y="1" width="2" height="7" />
            <rect x="1" y="4" width="4" height="1" />
          </g>
          {/* R */}
          <g transform="translate(9, 0)">
            <rect x="0" y="0" width="2" height="8" />
            <rect x="2" y="0" width="3" height="1" />
            <rect x="4" y="1" width="2" height="3" />
            <rect x="2" y="4" width="3" height="1" />
            <rect x="4" y="5" width="2" height="3" />
          </g>
          {/* C */}
          <g transform="translate(18, 0)">
            <rect x="1" y="0" width="5" height="1" />
            <rect x="0" y="1" width="2" height="6" />
            <rect x="1" y="7" width="5" height="1" />
          </g>
          {/* A */}
          <g transform="translate(27, 0)">
            <rect x="1" y="0" width="4" height="1" />
            <rect x="0" y="1" width="2" height="7" />
            <rect x="4" y="1" width="2" height="7" />
            <rect x="1" y="4" width="4" height="1" />
          </g>
          {/* D */}
          <g transform="translate(36, 0)">
            <rect x="0" y="0" width="2" height="8" />
            <rect x="2" y="0" width="3" height="1" />
            <rect x="4" y="1" width="2" height="6" />
            <rect x="2" y="7" width="3" height="1" />
          </g>
          {/* E */}
          <g transform="translate(45, 0)">
            <rect x="0" y="0" width="2" height="8" />
            <rect x="2" y="0" width="4" height="1" />
            <rect x="2" y="3" width="3" height="1" />
            <rect x="2" y="7" width="4" height="1" />
          </g>
        </g>

        {/* Neon Flickering Underline */}
        <rect x="8" y="13" width="52" height="1" fill="#22d3ee" opacity={animTick % 2 === 0 ? 0.9 : 0.4} />
      </g>

      {/* LEFT SIDE: Vintage "SPACE FROG" Upright Arcade Cabinet */}
      <g id="arcade-cabinet-left" transform="translate(6, 12)">
        {/* Cabinet Shell with Stepped Pixel Profile */}
        <rect x="4" y="0" width="28" height="48" fill="#1e1b4b" />
        <rect x="2" y="4" width="32" height="44" fill="#1e1b4b" />
        <rect x="0" y="24" width="36" height="24" fill="#1e1b4b" />

        {/* Glowing Marquee Top Header */}
        <rect x="4" y="2" width="28" height="8" fill="#ec4899" />
        <rect x="6" y="4" width="24" height="4" fill="#fef08a" />
        {/* 8-bit FROG marquee logo */}
        <g transform="translate(8, 5)" fill="#18181b">
          <rect x="0" y="0" width="1" height="2" />
          <rect x="1" y="0" width="2" height="1" />
          <rect x="4" y="0" width="1" height="2" />
          <rect x="5" y="0" width="2" height="1" />
          <rect x="8" y="0" width="3" height="2" />
          <rect x="9" y="1" width="1" height="1" fill="#fef08a" />
          <rect x="12" y="0" width="3" height="2" />
        </g>

        {/* CRT Bezel & Glowing CRT Screen (Scanlines & Pixel Invaders) */}
        <rect x="4" y="12" width="28" height="20" fill="#020617" />
        <rect x="6" y="14" width="24" height="16" fill="#064e3b" />
        {/* CRT Scanlines */}
        <rect x="6" y="14" width="24" height="1" fill="#10b981" opacity="0.5" />
        <rect x="6" y="19" width="24" height="1" fill="#10b981" opacity="0.5" />
        <rect x="6" y="24" width="24" height="1" fill="#10b981" opacity="0.5" />

        {/* Pixel Space Invader Alien on Screen */}
        <g transform={`translate(${animTick % 2 === 0 ? 14 : 16}, 17)`} fill="#34d399">
          <rect x="2" y="0" width="4" height="1" />
          <rect x="1" y="1" width="6" height="1" />
          <rect x="0" y="2" width="8" height="2" />
          <rect x="0" y="4" width="2" height="2" />
          <rect x="6" y="4" width="2" height="2" />
          <rect x="2" y="2" width="1" height="1" fill="#064e3b" />
          <rect x="5" y="2" width="1" height="1" fill="#064e3b" />
        </g>

        {/* Control Panel Deck */}
        <rect x="2" y="34" width="32" height="8" fill="#312e81" />
        <rect x="0" y="38" width="36" height="4" fill="#1e1b4b" />

        {/* Red Ball-Top Joystick (Stepped Pixel Ball) */}
        <rect x="8" y="33" width="2" height="5" fill="#94a3b8" />
        <g transform="translate(7, 30)">
          <rect x="1" y="0" width="2" height="1" fill="#ef4444" />
          <rect x="0" y="1" width="4" height="2" fill="#ef4444" />
          <rect x="1" y="1" width="1" height="1" fill="#ffffff" />
        </g>

        {/* Colorful Action Buttons (Stepped Pixel Round Buttons) */}
        <g transform="translate(18, 35)">
          <rect x="0" y="0" width="3" height="3" fill="#3b82f6" />
          <rect x="5" y="1" width="3" height="3" fill="#eab308" />
          <rect x="10" y="0" width="3" height="3" fill="#22c55e" />
        </g>

        {/* Coin Door with Glowing 25¢ Insert Slots */}
        <rect x="6" y="44" width="24" height="10" fill="#0f172a" />
        <rect x="10" y="46" width="4" height="2" fill="#ea580c" />
        <rect x="22" y="46" width="4" height="2" fill="#ea580c" />
      </g>

      {/* RIGHT SIDE: Prize Claw Crane Machine with Plushies & Joysticks */}
      <g id="claw-machine-right" transform="translate(118, 10)">
        {/* Metal Frame */}
        <rect x="0" y="0" width="36" height="52" fill="#18181b" />
        <rect x="0" y="0" width="36" height="1" fill="#facc15" />
        <rect x="0" y="51" width="36" height="1" fill="#facc15" />
        <rect x="0" y="0" width="1" height="52" fill="#facc15" />
        <rect x="35" y="0" width="1" height="52" fill="#facc15" />

        {/* Marquee Top */}
        <rect x="2" y="2" width="32" height="8" fill="#eab308" />
        <rect x="4" y="4" width="28" height="4" fill="#fef08a" />

        {/* Glass Showcase Window */}
        <rect x="2" y="11" width="32" height="26" fill="#38bdf8" opacity="0.25" />
        <rect x="3" y="12" width="30" height="2" fill="#ffffff" opacity="0.6" /> {/* Glare */}

        {/* Metal Claw Mechanism Suspended from Gantry */}
        <g transform={`translate(${14 + (animTick % 2 === 0 ? 2 : -2)}, 12)`}>
          <rect x="3" y="0" width="2" height="8" fill="#94a3b8" />
          <rect x="0" y="8" width="8" height="3" fill="#e2e8f0" />
          {/* Prongs */}
          <rect x="0" y="11" width="2" height="4" fill="#cbd5e1" />
          <rect x="6" y="11" width="2" height="4" fill="#cbd5e1" />
        </g>

        {/* Pile of Colorful Mini Pixel Plush Dolls Inside */}
        <g transform="translate(4, 26)">
          {/* Pink Bunny */}
          <g transform="translate(2, 2)">
            <rect x="1" y="0" width="1" height="2" fill="#ec4899" />
            <rect x="4" y="0" width="1" height="2" fill="#ec4899" />
            <rect x="0" y="2" width="6" height="5" fill="#f472b6" />
            <rect x="2" y="3" width="1" height="1" fill="#18181b" />
            <rect x="4" y="3" width="1" height="1" fill="#18181b" />
          </g>
          {/* Blue Bear */}
          <g transform="translate(11, 1)">
            <rect x="0" y="0" width="2" height="2" fill="#1d4ed8" />
            <rect x="5" y="0" width="2" height="2" fill="#1d4ed8" />
            <rect x="1" y="1" width="5" height="6" fill="#3b82f6" />
            <rect x="2" y="3" width="1" height="1" fill="#18181b" />
            <rect x="4" y="3" width="1" height="1" fill="#18181b" />
          </g>
          {/* Yellow Duck */}
          <g transform="translate(20, 2)">
            <rect x="1" y="0" width="5" height="5" fill="#facc15" />
            <rect x="5" y="2" width="2" height="2" fill="#ea580c" /> {/* Beak */}
            <rect x="2" y="1" width="1" height="1" fill="#18181b" />
          </g>
        </g>

        {/* Prize Drop Chute & Control Panel */}
        <rect x="2" y="38" width="32" height="12" fill="#ca8a04" />
        <rect x="6" y="40" width="10" height="8" fill="#09090b" />
        {/* Joystick */}
        <rect x="24" y="39" width="2" height="4" fill="#e2e8f0" />
        <rect x="23" y="37" width="4" height="3" fill="#ef4444" />
      </g>

      {/* 90s Geometric Arcade Carpet (Fluor Glow Planets & Triangles) */}
      <rect x="0" y="58" width="160" height="42" fill="#1e1b4b" />
      <rect x="0" y="62" width="160" height="38" fill="#0f0e2b" />

      {/* Fluor Geometric Shapes Scattered Across Floor (Pure Stepped Pixel Shapes) */}
      {/* Pink Triangle */}
      <g transform="translate(18, 68)" fill="#ec4899">
        <rect x="2" y="0" width="4" height="2" />
        <rect x="1" y="2" width="6" height="2" />
        <rect x="0" y="4" width="8" height="2" />
      </g>
      {/* Cyan Triangle */}
      <g transform="translate(42, 80)" fill="#06b6d4">
        <rect x="2" y="0" width="4" height="2" />
        <rect x="1" y="2" width="6" height="2" />
        <rect x="0" y="4" width="8" height="2" />
      </g>
      {/* Yellow Triangle */}
      <g transform="translate(120, 72)" fill="#eab308">
        <rect x="2" y="0" width="4" height="2" />
        <rect x="1" y="2" width="6" height="2" />
        <rect x="0" y="4" width="8" height="2" />
      </g>
      {/* Purple Triangle */}
      <g transform="translate(140, 84)" fill="#a855f7">
        <rect x="2" y="0" width="4" height="2" />
        <rect x="1" y="2" width="6" height="2" />
        <rect x="0" y="4" width="8" height="2" />
      </g>

      {/* Crosshairs & Pixel Dots */}
      <rect x="30" y="70" width="4" height="1" fill="#22c55e" />
      <rect x="31" y="69" width="2" height="3" fill="#22c55e" />
      <rect x="132" y="82" width="4" height="1" fill="#f43f5e" />
      <rect x="133" y="81" width="2" height="3" fill="#f43f5e" />

      {/* CENTER FROG STAGE: DDR Dance Dance Revolution Stage Platform (Stepped Pixel Neon Arrows) */}
      <g id="arcade-frog-stage">
        {/* Metal Base Frame */}
        <rect x="46" y="64" width="68" height="18" fill="#334155" />
        <rect x="48" y="62" width="64" height="18" fill="#475569" />
        <rect x="50" y="62" width="60" height="16" fill="#1e293b" />

        {/* Left Dance Arrow Pad (Pink Stepped Pixel Arrow) */}
        <g transform="translate(52, 66)">
          <rect x="0" y="0" width="14" height="10" fill="#831843" />
          <g transform="translate(2, 1)" fill="#f43f5e" opacity={animTick % 2 === 0 ? 0.95 : 0.4}>
            <rect x="0" y="3" width="2" height="2" />
            <rect x="2" y="2" width="2" height="4" />
            <rect x="4" y="1" width="2" height="6" />
            <rect x="6" y="0" width="4" height="8" />
          </g>
        </g>

        {/* Center Metal Rest Stage */}
        <g transform="translate(68, 64)">
          <rect x="0" y="0" width="24" height="14" fill="#0f172a" />
          <rect x="0" y="0" width="24" height="1" fill="#64748b" />
          <rect x="0" y="13" width="24" height="1" fill="#64748b" />
          <rect x="2" y="2" width="20" height="10" fill="#1e293b" />
          <rect x="4" y="4" width="16" height="6" fill="#334155" />
        </g>

        {/* Right Dance Arrow Pad (Cyan Stepped Pixel Arrow) */}
        <g transform="translate(94, 66)">
          <rect x="0" y="0" width="14" height="10" fill="#164e63" />
          <g transform="translate(2, 1)" fill="#06b6d4" opacity={animTick % 2 === 1 ? 0.95 : 0.4}>
            <rect x="8" y="3" width="2" height="2" />
            <rect x="6" y="2" width="2" height="4" />
            <rect x="4" y="1" width="2" height="6" />
            <rect x="0" y="0" width="4" height="8" />
          </g>
        </g>
      </g>
    </g>
  );
};

