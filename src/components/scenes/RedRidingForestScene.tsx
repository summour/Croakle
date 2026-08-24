import React from 'react';

interface SceneProps {
  animTick: number;
  fullscreen?: boolean;
}

export const RedRidingForestScene: React.FC<SceneProps> = ({ animTick, fullscreen }) => {
  return (
    <g id="scene-red-riding-forest">
      {/* Fairytale Sunset Sky with Rosy Amber Gradient */}
      {fullscreen ? (
        <g>
          <rect x="0" y="-80" width="160" height="136" fill="#831843" />
          <rect x="0" y="-20" width="160" height="40" fill="#9d174d" />
          <rect x="0" y="20" width="160" height="36" fill="#c026d3" />
          <rect x="0" y="44" width="160" height="20" fill="#f472b6" />
        </g>
      ) : (
        <g>
          <rect x="0" y="0" width="160" height="20" fill="#9d174d" />
          <rect x="0" y="20" width="160" height="20" fill="#c026d3" />
          <rect x="0" y="40" width="160" height="20" fill="#f472b6" />
        </g>
      )}

      {/* Layer 1: Ancient Enchanted Forest Trees with Hollow Knots */}
      <g id="fairytale-trees">
        {/* Left Ancient Oak */}
        <g transform="translate(6, 4)">
          <rect x="6" y="16" width="18" height="48" fill="#451a03" />
          <rect x="10" y="16" width="10" height="48" fill="#78350f" />
          {/* Tree Hollow */}
          <rect x="12" y="32" width="6" height="8" fill="#1c0a00" />
          <rect x="14" y="34" width="2" height="4" fill="#fef08a" /> {/* Forest critter eyes */}
          {/* Canopy */}
          <rect x="0" y="0" width="34" height="24" fill="#064e3b" />
          <rect x="4" y="2" width="26" height="20" fill="#065f46" />
          <rect x="8" y="4" width="18" height="14" fill="#047857" />
        </g>

        {/* Right Ancient Oak with Ivy Vines */}
        <g transform="translate(126, 6)">
          <rect x="8" y="14" width="18" height="48" fill="#451a03" />
          <rect x="10" y="14" width="10" height="48" fill="#78350f" />
          {/* Green Ivy Climbing Trunk */}
          <rect x="14" y="24" width="4" height="4" fill="#15803d" />
          <rect x="18" y="32" width="4" height="4" fill="#15803d" />
          <rect x="12" y="40" width="4" height="4" fill="#15803d" />
          {/* Canopy */}
          <rect x="0" y="0" width="34" height="24" fill="#064e3b" />
          <rect x="4" y="2" width="26" height="20" fill="#065f46" />
          <rect x="8" y="4" width="18" height="14" fill="#047857" />
        </g>
      </g>

      {/* Layer 2: Little Red Riding Hood's Picnic Basket & Goodies on Left */}
      <g id="red-riding-picnic-basket" transform="translate(18, 48)">
        {/* Wicker Basket Body */}
        <rect x="0" y="6" width="22" height="14" fill="#78350f" stroke="#b45309" strokeWidth="0.8" />
        <rect x="2" y="8" width="18" height="10" fill="#a16207" />
        {/* Woven Crosshatch */}
        <rect x="2" y="12" width="18" height="1" fill="#713f12" />
        <rect x="8" y="8" width="1" height="10" fill="#713f12" />
        <rect x="14" y="8" width="1" height="10" fill="#713f12" />
        {/* Wicker Handle */}
        <rect x="8" y="0" width="6" height="8" fill="none" stroke="#78350f" strokeWidth="1.5" />

        {/* Red & White Gingham Napkin Draped Over Basket */}
        <rect x="2" y="4" width="18" height="6" fill="#dc2626" />
        <rect x="4" y="4" width="4" height="4" fill="#ffffff" />
        <rect x="12" y="4" width="4" height="4" fill="#ffffff" />

        {/* Jar of Sweet Blackberry Jam & Fresh Bread */}
        <g transform="translate(18, -4)">
          <rect x="0" y="4" width="6" height="8" fill="#581c87" /> {/* Jam Jar */}
          <rect x="1" y="2" width="4" height="3" fill="#facc15" /> {/* Gold Lid */}
        </g>
      </g>

      {/* Layer 3: Wild Forest Berry Bushes & Fireflies on Right */}
      <g id="wild-berry-bushes" transform="translate(118, 44)">
        {/* Bush Leaves */}
        <rect x="0" y="6" width="26" height="18" fill="#14532d" />
        <rect x="2" y="4" width="22" height="16" fill="#15803d" />
        <rect x="6" y="2" width="14" height="12" fill="#22c55e" />

        {/* Sweet Red & Blue Wild Berries */}
        <rect x="4" y="8" width="3" height="3" fill="#dc2626" />
        <rect x="16" y="6" width="3" height="3" fill="#dc2626" />
        <rect x="10" y="12" width="3" height="3" fill="#3b82f6" />
        <rect x="20" y="14" width="3" height="3" fill="#dc2626" />

        {/* Animated Bioluminescent Fireflies */}
        <g transform={`translate(${animTick % 2 === 0 ? -4 : -2}, ${animTick % 2 === 0 ? -6 : -8})`}>
          <rect x="0" y="0" width="2" height="2" fill="#fef08a" />
          <rect x="0" y="0" width="2" height="2" fill="#facc15" opacity="0.6" />
        </g>
      </g>

      {/* Layer 4: Enchanted Forest Ground & Dappled Sunlight Path */}
      <rect x="0" y="58" width="160" height="42" fill="#14532d" />
      <rect x="0" y="64" width="160" height="36" fill="#166534" />
      <rect x="0" y="78" width="160" height="22" fill="#0f3c1f" />

      {/* Cobblestone Fairytale Trail in Center */}
      <g id="fairytale-path">
        <rect x="46" y="62" width="68" height="38" fill="#78350f" opacity="0.6" />
        <rect x="52" y="64" width="56" height="36" fill="#a16207" opacity="0.5" />
      </g>

      {/* CENTER FROG STAGE: Giant Fairy Ring Toadstool & Velvet Moss Mound */}
      <g id="red-riding-frog-stage">
        {/* Fairy Ring Toadstool Base */}
        <rect x="50" y="66" width="60" height="14" fill="#991b1b" />
        <rect x="52" y="64" width="56" height="16" fill="#b91c1c" />
        <rect x="56" y="63" width="48" height="16" fill="#dc2626" />
        <rect x="60" y="62" width="40" height="16" fill="#ef4444" />
        <rect x="64" y="62" width="32" height="14" fill="#f87171" />

        {/* Polka Dots on Toadstool Stage */}
        <rect x="54" y="67" width="5" height="4" fill="#ffffff" />
        <rect x="100" y="66" width="6" height="4" fill="#ffffff" />
        <rect x="74" y="63" width="6" height="3" fill="#ffffff" />
        <rect x="88" y="72" width="5" height="3" fill="#ffffff" />
        <rect x="62" y="73" width="4" height="2" fill="#ffffff" />
      </g>
    </g>
  );
};
