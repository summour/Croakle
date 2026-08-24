import React from 'react';

interface SceneProps {
  animTick: number;
  fullscreen?: boolean;
}

export const SushiBarScene: React.FC<SceneProps> = ({ animTick, fullscreen }) => {
  return (
    <g id="scene-sushi-bar">
      {/* Background Hinoki Wood Paneling & Wall Slats */}
      {fullscreen ? (
        <g>
          <rect x="0" y="-80" width="160" height="144" fill="#fef3c7" />
          <rect x="0" y="-40" width="160" height="2" fill="#b45309" />
          <rect x="0" y="0" width="160" height="2" fill="#b45309" />
        </g>
      ) : (
        <rect x="0" y="0" width="160" height="64" fill="#fef3c7" />
      )}

      {/* Vertical Cedar Slat Feature Wall */}
      {Array.from({ length: 20 }).map((_, i) => (
        <rect key={i} x={i * 8 + 4} y="0" width="2" height="64" fill="#d97706" opacity="0.25" />
      ))}

      {/* Traditional Indigo Noren Door Curtains across Top */}
      <g id="sushi-noren" transform="translate(0, 0)">
        <rect x="0" y="0" width="160" height="4" fill="#78350f" />
        {/* Slit Curtain Panels */}
        {Array.from({ length: 4 }).map((_, i) => (
          <g key={i} transform={`translate(${i * 40 + 4}, 4)`}>
            <rect x="0" y="0" width="32" height="22" fill="#1e3a8a" />
            <rect x="2" y="2" width="28" height="18" fill="#1d4ed8" />
            {/* White Japanese Mon Crest (Stepped Pixel Round Emblem) */}
            <rect x="14" y="6" width="4" height="10" fill="#ffffff" />
            <rect x="11" y="8" width="10" height="6" fill="#ffffff" />
            <rect x="12" y="7" width="8" height="8" fill="#ffffff" />
            <rect x="14" y="9" width="4" height="4" fill="#1d4ed8" />
          </g>
        ))}
      </g>

      {/* Wooden Sushi Menu Plaque Strips (Kizara) on Left */}
      <g id="sushi-menu-plaques" transform="translate(8, 30)">
        <rect x="0" y="0" width="6" height="18" fill="#fde68a" stroke="#b45309" strokeWidth="0.5" />
        <rect x="2" y="2" width="2" height="14" fill="#78350f" />

        <rect x="8" y="0" width="6" height="18" fill="#fde68a" stroke="#b45309" strokeWidth="0.5" />
        <rect x="10" y="2" width="2" height="14" fill="#78350f" />

        <rect x="16" y="0" width="6" height="18" fill="#fde68a" stroke="#b45309" strokeWidth="0.5" />
        <rect x="18" y="2" width="2" height="14" fill="#78350f" />
      </g>

      {/* Glass Refrigerated Neta Case (Fish Display) on Right */}
      <g id="sushi-neta-case" transform="translate(108, 28)">
        {/* Stainless Base */}
        <rect x="0" y="16" width="46" height="6" fill="#334155" />
        {/* Glass Dome */}
        <rect x="0" y="0" width="46" height="16" fill="#38bdf8" opacity="0.3" stroke="#94a3b8" strokeWidth="0.8" />
        <rect x="2" y="2" width="42" height="2" fill="#ffffff" opacity="0.6" /> {/* Glass glare */}

        {/* Fresh Sashimi Cuts on Crushed Ice */}
        <rect x="4" y="12" width="38" height="4" fill="#e0f2fe" /> {/* Ice */}
        {/* Tuna Block (Maguro) */}
        <rect x="6" y="8" width="10" height="5" fill="#be123c" />
        <rect x="8" y="9" width="6" height="2" fill="#e11d48" />
        {/* Salmon Block (Sake) */}
        <rect x="18" y="8" width="10" height="5" fill="#ea580c" />
        <rect x="20" y="9" width="6" height="1" fill="#fed7aa" />
        {/* Tamagoyaki Block */}
        <rect x="30" y="8" width="10" height="5" fill="#facc15" />
      </g>

      {/* Main Hinoki Wood Sushi Counter Top */}
      <rect x="0" y="52" width="160" height="48" fill="#b45309" />
      <rect x="0" y="54" width="160" height="6" fill="#fde68a" />
      <rect x="0" y="60" width="160" height="40" fill="#d97706" />
      {/* Wood Grain Lines */}
      <rect x="0" y="68" width="160" height="1" fill="#b45309" />
      <rect x="0" y="78" width="160" height="1" fill="#b45309" />
      <rect x="0" y="88" width="160" height="1" fill="#b45309" />

      {/* Ceramic Soy Sauce Bottle & Wasabi Dish on Left */}
      <g id="sushi-condiments" transform="translate(18, 56)">
        {/* Tokkuri Soy Dispenser */}
        <rect x="2" y="4" width="8" height="10" fill="#1e293b" />
        <rect x="4" y="2" width="4" height="4" fill="#334155" />
        <rect x="1" y="3" width="3" height="2" fill="#ef4444" /> {/* Spout cap */}

        {/* Little Plate with Green Wasabi & Pink Ginger (Gari) */}
        <rect x="14" y="8" width="12" height="6" fill="#ffffff" />
        <rect x="16" y="7" width="4" height="4" fill="#65a30d" /> {/* Wasabi */}
        <rect x="21" y="8" width="3" height="3" fill="#f472b6" /> {/* Ginger */}
      </g>

      {/* Steaming Green Tea (Agari) Yunomi Mug on Right */}
      <g id="sushi-tea" transform="translate(126, 56)">
        <rect x="2" y="2" width="12" height="12" fill="#1e293b" />
        <rect x="4" y="3" width="8" height="2" fill="#22c55e" />
        {/* Kanji on Cup */}
        <rect x="5" y="6" width="6" height="5" fill="#ffffff" opacity="0.7" />
        {/* Steam */}
        <rect x="7" y={animTick % 2 === 0 ? -1 : 0} width="2" height="2" fill="#ffffff" opacity="0.6" />
      </g>

      {/* CENTER FROG STAGE: Jet-Black Lacquer Geta Sushi Serving Board */}
      <g id="sushi-bar-frog-stage">
        {/* Shadow */}
        <rect x="46" y="66" width="68" height="16" fill="#78350f" opacity="0.7" />

        {/* Black Lacquered Serving Board (Sushi Geta) */}
        <rect x="48" y="64" width="64" height="16" fill="#09090b" />
        <rect x="50" y="62" width="60" height="16" fill="#18181b" />
        <rect x="52" y="62" width="56" height="4" fill="#27272a" />
        {/* Geta Feet Wooden Rests */}
        <rect x="54" y="74" width="6" height="4" fill="#09090b" />
        <rect x="100" y="74" width="6" height="4" fill="#09090b" />

        {/* Fresh Delicacy Nigiri Sushi Pieces on Board Corners */}
        {/* Maguro Nigiri on Left */}
        <g transform="translate(48, 60)">
          <rect x="2" y="2" width="8" height="4" fill="#ffffff" /> {/* Rice */}
          <rect x="1" y="0" width="10" height="4" fill="#dc2626" /> {/* Tuna Slice */}
        </g>
        {/* Salmon Nigiri on Right */}
        <g transform="translate(102, 60)">
          <rect x="2" y="2" width="8" height="4" fill="#ffffff" /> {/* Rice */}
          <rect x="1" y="0" width="10" height="4" fill="#ea580c" /> {/* Salmon Slice */}
          <rect x="3" y="1" width="6" height="1" fill="#fed7aa" />
        </g>
      </g>
    </g>
  );
};
