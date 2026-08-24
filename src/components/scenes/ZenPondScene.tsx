import React from 'react';

interface SceneProps {
  animTick: number;
  fullscreen?: boolean;
}

export const ZenPondScene: React.FC<SceneProps> = ({ animTick, fullscreen }) => {
  return (
    <g id="scene-zen-pond">
      {/* Deep Atmosphere & Sky / Distant Fog */}
      {fullscreen ? (
        <rect x="0" y="-80" width="160" height="138" fill="#0f172a" />
      ) : (
        <rect x="0" y="0" width="160" height="58" fill="#0f172a" />
      )}

      {/* Layer 1: Distant Misty Pagoda Silhouettes & Mountain Ridge */}
      <g opacity="0.35">
        <rect x="18" y="24" width="8" height="12" fill="#334155" />
        <rect x="16" y="28" width="12" height="2" fill="#334155" />
        <rect x="14" y="32" width="16" height="2" fill="#334155" />
        <rect x="12" y="36" width="20" height="20" fill="#334155" />
        {/* Pagoda Spire */}
        <rect x="21" y="18" width="2" height="6" fill="#334155" />

        {/* Distant Mountain Silhouettes */}
        <rect x="40" y="34" width="40" height="24" fill="#1e293b" />
        <rect x="52" y="28" width="22" height="6" fill="#1e293b" />
        <rect x="90" y="36" width="70" height="22" fill="#1e293b" />
        <rect x="110" y="30" width="36" height="6" fill="#1e293b" />
      </g>

      {/* Layer 2: Traditional Bamboo Fence (Take-gaki) on Far Shore */}
      <g id="zen-bamboo-fence">
        <rect x="0" y="44" width="160" height="2" fill="#78350f" />
        <rect x="0" y="52" width="160" height="2" fill="#78350f" />
        {Array.from({ length: 20 }).map((_, i) => (
          <g key={i} transform={`translate(${i * 8 + 2}, 42)`}>
            <rect x="0" y="0" width="4" height="14" fill="#a16207" />
            <rect x="1" y="0" width="2" height="14" fill="#ca8a04" />
            <rect x="0" y="4" width="4" height="1" fill="#713f12" />
            <rect x="0" y="10" width="4" height="1" fill="#713f12" />
          </g>
        ))}
      </g>

      {/* Layer 3: Left Kasuga Stone Lantern (Toro) with Warm Glow */}
      <g id="kasuga-stone-lantern" transform="translate(12, 28)">
        {/* Roof Cap (Kasa) with Moss Accents */}
        <rect x="6" y="0" width="4" height="2" fill="#64748b" />
        <rect x="4" y="2" width="8" height="2" fill="#475569" />
        <rect x="1" y="4" width="14" height="3" fill="#334155" />
        <rect x="0" y="7" width="16" height="2" fill="#1e293b" />
        <rect x="2" y="4" width="4" height="1" fill="#65a30d" /> {/* Moss highlight */}
        
        {/* Firebox (Hibukuro) with Warm Paper Glow */}
        <rect x="3" y="9" width="10" height="9" fill="#1e293b" />
        <rect x="5" y="10" width="6" height="7" fill="#fef08a" />
        <rect x="6" y="11" width="4" height="5" fill="#facc15" />
        <rect x="7" y="12" width="2" height="3" fill="#ffffff" />
        <rect x="7" y="10" width="2" height="7" fill="#854d0e" opacity="0.7" /> {/* Lattice bar */}

        {/* Pedestal (Dai) & Base Stones */}
        <rect x="2" y="18" width="12" height="3" fill="#334155" />
        <rect x="5" y="21" width="6" height="8" fill="#475569" />
        <rect x="6" y="21" width="2" height="8" fill="#64748b" />
        <rect x="1" y="29" width="14" height="4" fill="#334155" />
        <rect x="0" y="32" width="16" height="3" fill="#1e293b" />
        <rect x="3" y="29" width="3" height="1" fill="#4d7c0f" />
      </g>

      {/* Layer 4: Shishi-Odoshi (Bamboo Rocker Water Spout) on Right */}
      <g id="shishi-odoshi" transform="translate(132, 34)">
        {/* Support Post */}
        <rect x="8" y="6" width="3" height="18" fill="#78350f" />
        <rect x="9" y="6" width="1" height="18" fill="#b45309" />
        
        {/* Tilting Bamboo Tube (Pivoted) */}
        {animTick % 4 < 2 ? (
          <g transform="rotate(12, 10, 10)">
            <rect x="0" y="8" width="16" height="3" fill="#65a30d" />
            <rect x="1" y="9" width="14" height="1" fill="#84cc16" />
            <rect x="0" y="8" width="2" height="3" fill="#14532d" />
            {/* Water Droplet */}
            <rect x="-1" y="12" width="2" height="3" fill="#38bdf8" />
          </g>
        ) : (
          <g transform="rotate(-6, 10, 10)">
            <rect x="0" y="8" width="16" height="3" fill="#65a30d" />
            <rect x="1" y="9" width="14" height="1" fill="#84cc16" />
            <rect x="0" y="8" width="2" height="3" fill="#14532d" />
          </g>
        )}

        {/* Tsukubai Stone Water Basin Underneath */}
        <rect x="2" y="20" width="16" height="8" fill="#334155" />
        <rect x="4" y="21" width="12" height="4" fill="#0284c7" />
        <rect x="6" y="22" width="8" height="2" fill="#38bdf8" opacity="0.7" />
        <rect x="1" y="26" width="18" height="3" fill="#1e293b" />
        <rect x="3" y="20" width="4" height="1" fill="#4d7c0f" />
      </g>

      {/* Layer 5: Calming Deep Pond Water & Depth Gradient */}
      <rect x="0" y="56" width="160" height="44" fill="#075985" />
      <rect x="0" y="64" width="160" height="36" fill="#0369a1" />
      <rect x="0" y="74" width="160" height="26" fill="#0c4a6e" />
      <rect x="0" y="86" width="160" height="14" fill="#082f49" />

      {/* Submerged Swimming Koi Fish Silhouettes */}
      <g opacity="0.45">
        <rect x={36 + ((animTick * 1.5) % 30)} y="74" width="8" height="3" fill="#ef4444" />
        <rect x={44 + ((animTick * 1.5) % 30)} y="75" width="3" height="1" fill="#f97316" />
        <rect x={110 - ((animTick * 1.2) % 30)} y="80" width="7" height="3" fill="#facc15" />
        <rect x={117 - ((animTick * 1.2) % 30)} y="81" width="3" height="1" fill="#ffffff" />
      </g>

      {/* Water Caustics & Shimmering Waves */}
      <rect x="24" y={animTick % 2 === 0 ? 62 : 63} width="18" height="1" fill="#7dd3fc" opacity="0.75" />
      <rect x="88" y={animTick % 2 === 0 ? 66 : 65} width="22" height="1" fill="#7dd3fc" opacity="0.75" />
      <rect x="42" y={animTick % 2 === 0 ? 82 : 83} width="24" height="1" fill="#38bdf8" opacity="0.5" />
      <rect x="120" y={animTick % 2 === 0 ? 76 : 77} width="16" height="1" fill="#38bdf8" opacity="0.6" />

      {/* Left Lilypad & Blooming Pink Lotus */}
      <g transform="translate(24, 66)">
        {/* Layered Leaf */}
        <rect x="0" y="3" width="22" height="7" fill="#3f6212" />
        <rect x="2" y="2" width="18" height="8" fill="#4d7c0f" />
        <rect x="4" y="3" width="14" height="5" fill="#65a30d" />
        <rect x="7" y="4" width="8" height="3" fill="#84cc16" />
        <rect x="14" y="4" width="4" height="2" fill="#3f6212" /> {/* Notch */}

        {/* Blooming Sacred Pink Lotus */}
        <g transform="translate(6, -6)">
          <rect x="4" y="5" width="6" height="4" fill="#be185d" />
          <rect x="2" y="2" width="10" height="6" fill="#ec4899" />
          <rect x="3" y="0" width="8" height="6" fill="#f472b6" />
          <rect x="5" y="-1" width="4" height="6" fill="#fbcfe8" />
          <rect x="6" y="2" width="2" height="2" fill="#facc15" /> {/* Golden Pistil */}
        </g>
      </g>

      {/* Right Water Reeds & Floating Water Flower */}
      <g transform="translate(122, 62)">
        {/* Iris & Water Reeds */}
        <rect x="18" y="-14" width="2" height="22" fill="#15803d" />
        <rect x="22" y="-18" width="2" height="26" fill="#166534" />
        <rect x="24" y="-8" width="2" height="16" fill="#15803d" />
        <rect x="16" y="-12" width="4" height="3" fill="#a855f7" />
        <rect x="21" y="-16" width="4" height="3" fill="#9333ea" />

        {/* Lilypad */}
        <rect x="0" y="4" width="18" height="6" fill="#3f6212" />
        <rect x="2" y="3" width="14" height="7" fill="#4d7c0f" />
        <rect x="4" y="4" width="10" height="4" fill="#65a30d" />
        {/* White Lotus Bud */}
        <rect x="6" y="0" width="4" height="5" fill="#f8fafc" />
        <rect x="7" y="1" width="2" height="3" fill="#fda4af" />
      </g>

      {/* CENTER FROG STAGE: Sacred Mossy Stone Platform & Grand Lotus Island */}
      <g id="zen-frog-stage">
        {/* Underwater Base Shadow */}
        <rect x="54" y="74" width="52" height="8" fill="#042f2e" opacity="0.6" />
        <rect x="58" y="72" width="44" height="12" fill="#042f2e" opacity="0.7" />

        {/* Stepped Giant Sacred Lily Pad Base */}
        <rect x="50" y="68" width="60" height="14" fill="#14532d" />
        <rect x="52" y="66" width="56" height="16" fill="#166534" />
        <rect x="56" y="64" width="48" height="18" fill="#15803d" />
        <rect x="60" y="63" width="40" height="18" fill="#22c55e" />
        <rect x="64" y="64" width="32" height="15" fill="#4ade80" />

        {/* Sacred Granite Stepping Stone Top with Moss Highlights */}
        <rect x="62" y="66" width="36" height="10" fill="#334155" />
        <rect x="64" y="65" width="32" height="11" fill="#475569" />
        <rect x="66" y="64" width="28" height="11" fill="#64748b" />
        <rect x="70" y="64" width="20" height="9" fill="#94a3b8" />
        {/* Moss Tufts on Stone */}
        <rect x="64" y="65" width="4" height="2" fill="#65a30d" />
        <rect x="90" y="65" width="5" height="2" fill="#65a30d" />
        <rect x="76" y="72" width="6" height="2" fill="#4d7c0f" />
      </g>
    </g>
  );
};
