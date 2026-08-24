import React from 'react';

interface SceneProps {
  animTick: number;
  fullscreen?: boolean;
}

export const RainyMeadowScene: React.FC<SceneProps> = ({ animTick, fullscreen }) => {
  return (
    <g id="scene-rainy-meadow">
      {/* Overcast Misty Forest Sky with Atmospheric Haze */}
      {fullscreen ? (
        <g>
          <rect x="0" y="-80" width="160" height="136" fill="#1e293b" />
          <rect x="0" y="-20" width="160" height="40" fill="#334155" />
          <rect x="0" y="20" width="160" height="36" fill="#475569" />
        </g>
      ) : (
        <g>
          <rect x="0" y="0" width="160" height="20" fill="#1e293b" />
          <rect x="0" y="20" width="160" height="20" fill="#334155" />
          <rect x="0" y="40" width="160" height="16" fill="#475569" />
        </g>
      )}

      {/* Layer 1: Distant Pine & Fir Tree Silhouettes in Rain Fog */}
      <g id="misty-pines" opacity="0.45">
        {/* Left Pines */}
        <rect x="8" y="26" width="20" height="30" fill="#064e3b" />
        <rect x="12" y="18" width="12" height="10" fill="#064e3b" />
        <rect x="15" y="12" width="6" height="8" fill="#064e3b" />

        <rect x="26" y="32" width="24" height="24" fill="#065f46" />
        <rect x="32" y="24" width="12" height="10" fill="#065f46" />
        <rect x="36" y="16" width="4" height="10" fill="#065f46" />

        {/* Right Pines */}
        <rect x="116" y="28" width="24" height="28" fill="#064e3b" />
        <rect x="122" y="20" width="12" height="10" fill="#064e3b" />
        <rect x="126" y="14" width="4" height="8" fill="#064e3b" />

        <rect x="138" y="34" width="20" height="22" fill="#065f46" />
        <rect x="144" y="24" width="10" height="12" fill="#065f46" />
      </g>

      {/* Layer 2: Animated Gentle Rain Streaks */}
      <g id="rain-streaks" opacity="0.6">
        <rect x={14 + (animTick * 3) % 40} y={10 + (animTick * 8) % 70} width="1" height="6" fill="#7dd3fc" />
        <rect x={44 + (animTick * 4) % 50} y={4 + (animTick * 9) % 75} width="1" height="7" fill="#7dd3fc" />
        <rect x={82 + (animTick * 3) % 40} y={12 + (animTick * 7) % 65} width="1" height="6" fill="#bae6fd" />
        <rect x={118 + (animTick * 4) % 40} y={6 + (animTick * 8) % 70} width="1" height="6" fill="#7dd3fc" />
        <rect x={148 + (animTick * 2) % 30} y={14 + (animTick * 9) % 75} width="1" height="7" fill="#bae6fd" />
      </g>

      {/* Layer 3: Left Giant Amanita Red Toadstool Canopy */}
      <g id="giant-red-mushroom" transform="translate(6, 18)">
        {/* Ivory Stalk with Moss & Annulus Collar */}
        <rect x="18" y="26" width="10" height="24" fill="#e7e5e4" />
        <rect x="20" y="26" width="6" height="24" fill="#f5f5f4" />
        <rect x="16" y="36" width="14" height="4" fill="#d6d3d1" /> {/* Ring collar */}
        <rect x="18" y="44" width="4" height="6" fill="#65a30d" /> {/* Moss at base */}

        {/* Stepped Mushroom Cap Underbelly Gills */}
        <rect x="6" y="24" width="34" height="4" fill="#fef3c7" />
        <rect x="8" y="26" width="30" height="2" fill="#e5e5e5" />

        {/* Giant Red Amanita Cap with Pure White Polka Dots */}
        <rect x="4" y="10" width="38" height="16" fill="#b91c1c" />
        <rect x="6" y="6" width="34" height="6" fill="#dc2626" />
        <rect x="10" y="2" width="26" height="6" fill="#ef4444" />
        <rect x="14" y="0" width="18" height="4" fill="#f87171" />

        {/* Crisp White Spots */}
        <rect x="12" y="6" width="5" height="4" fill="#ffffff" />
        <rect x="26" y="4" width="6" height="5" fill="#ffffff" />
        <rect x="8" y="14" width="4" height="4" fill="#ffffff" />
        <rect x="20" y="12" width="5" height="4" fill="#ffffff" />
        <rect x="32" y="14" width="5" height="4" fill="#ffffff" />

        {/* Dripping Rain Droplets from Cap Rim */}
        <rect x="5" y={animTick % 2 === 0 ? 27 : 29} width="2" height="3" fill="#38bdf8" />
        <rect x="38" y={animTick % 2 === 1 ? 26 : 28} width="2" height="3" fill="#38bdf8" />
      </g>

      {/* Layer 4: Right Glowing Spore Mushrooms & Hollow Log */}
      <g id="glowing-mushrooms-right" transform="translate(122, 38)">
        {/* Hollow Mossy Log */}
        <rect x="0" y="16" width="32" height="16" fill="#451a03" />
        <rect x="2" y="14" width="28" height="4" fill="#78350f" />
        <rect x="0" y="14" width="8" height="2" fill="#65a30d" />
        <rect x="22" y="14" width="8" height="2" fill="#65a30d" />

        {/* Bioluminescent Cyan & Gold Spore Mushrooms */}
        {/* Mushroom 1 (Cyan) */}
        <rect x="6" y="8" width="8" height="8" fill="#06b6d4" />
        <rect x="8" y="6" width="4" height="3" fill="#22d3ee" />
        <rect x="9" y="14" width="2" height="6" fill="#e0f2fe" />
        <rect x="7" y="9" width="2" height="2" fill="#ffffff" />

        {/* Mushroom 2 (Gold) */}
        <rect x="18" y="6" width="10" height="9" fill="#eab308" />
        <rect x="20" y="4" width="6" height="3" fill="#facc15" />
        <rect x="22" y="13" width="2" height="7" fill="#fef08a" />
        <rect x="20" y="7" width="2" height="2" fill="#ffffff" />

        {/* Snail Friend on Log */}
        <rect x="2" y="10" width="5" height="5" fill="#f97316" />
        <rect x="5" y="12" width="4" height="3" fill="#fdba74" />
      </g>

      {/* Layer 5: Lush Rolling Meadow Ground & Rain Puddles */}
      <rect x="0" y="54" width="160" height="46" fill="#14532d" />
      <rect x="0" y="60" width="160" height="40" fill="#15803d" />
      <rect x="0" y="72" width="160" height="28" fill="#166534" />
      <rect x="0" y="86" width="160" height="14" fill="#052e16" />

      {/* Clover Patches & Bluebells */}
      <g transform="translate(18, 64)">
        <rect x="0" y="2" width="3" height="3" fill="#4ade80" />
        <rect x="3" y="0" width="3" height="3" fill="#4ade80" />
        <rect x="6" y="2" width="3" height="3" fill="#4ade80" />
        <rect x="4" y="4" width="1" height="4" fill="#166534" />
      </g>
      <g transform="translate(138, 70)">
        <rect x="0" y="0" width="4" height="4" fill="#60a5fa" />
        <rect x="2" y="3" width="1" height="6" fill="#166534" />
      </g>

      {/* Reflective Rain Puddles with Expanding Ripple Rings */}
      <g transform="translate(32, 74)">
        <rect x="0" y="2" width="20" height="6" fill="#0284c7" opacity="0.8" />
        <rect x="2" y="1" width="16" height="8" fill="#0284c7" opacity="0.8" />
        <rect x="4" y="3" width="12" height="4" fill="#38bdf8" opacity="0.9" />
        {/* Ripple Rings */}
        <rect x={animTick % 2 === 0 ? 6 : 4} y="4" width={animTick % 2 === 0 ? 8 : 12} height="1" fill="#bae6fd" />
      </g>

      {/* CENTER FROG STAGE: Massive Mossy River Boulder with Dripping Droplets */}
      <g id="rainy-meadow-frog-stage">
        {/* Boulder Base Shadow */}
        <rect x="52" y="74" width="56" height="6" fill="#052e16" opacity="0.6" />

        {/* Dark Granite Boulder */}
        <rect x="52" y="66" width="56" height="14" fill="#27272a" />
        <rect x="54" y="64" width="52" height="16" fill="#3f3f46" />
        <rect x="58" y="62" width="44" height="18" fill="#52525b" />
        <rect x="62" y="61" width="36" height="18" fill="#71717a" />

        {/* Lush Green Velvet Moss Cushion Top */}
        <rect x="56" y="63" width="48" height="6" fill="#3f6212" />
        <rect x="58" y="62" width="44" height="6" fill="#4d7c0f" />
        <rect x="60" y="61" width="40" height="6" fill="#65a30d" />
        <rect x="64" y="60" width="32" height="5" fill="#84cc16" />
        <rect x="70" y="60" width="18" height="3" fill="#a3e635" />

        {/* Tiny Wild Daisy Flowers on Stage */}
        <g transform="translate(62, 60)">
          <rect x="1" y="0" width="2" height="2" fill="#ffffff" />
          <rect x="0" y="1" width="4" height="1" fill="#ffffff" />
          <rect x="1" y="1" width="2" height="1" fill="#facc15" />
        </g>
        <g transform="translate(90, 61)">
          <rect x="1" y="0" width="2" height="2" fill="#ffffff" />
          <rect x="0" y="1" width="4" height="1" fill="#ffffff" />
          <rect x="1" y="1" width="2" height="1" fill="#facc15" />
        </g>
      </g>
    </g>
  );
};
