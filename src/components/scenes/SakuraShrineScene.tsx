import React from 'react';

interface SceneProps {
  animTick: number;
  fullscreen?: boolean;
}

export const SakuraShrineScene: React.FC<SceneProps> = ({ animTick, fullscreen }) => {
  return (
    <g id="scene-sakura-shrine">
      {/* Twilight Sunrise Sky with Gradient */}
      {fullscreen ? (
        <g>
          <rect x="0" y="-80" width="160" height="138" fill="#4a154b" />
          <rect x="0" y="-30" width="160" height="40" fill="#701a75" />
          <rect x="0" y="10" width="160" height="30" fill="#a21caf" />
          <rect x="0" y="40" width="160" height="20" fill="#f472b6" />
        </g>
      ) : (
        <g>
          <rect x="0" y="0" width="160" height="20" fill="#701a75" />
          <rect x="0" y="20" width="160" height="20" fill="#a21caf" />
          <rect x="0" y="40" width="160" height="20" fill="#f472b6" />
        </g>
      )}

      {/* Layer 1: Mount Fuji Silhouette with Pure White Snowcap */}
      <g id="mount-fuji" transform="translate(48, 14)" opacity="0.85">
        {/* Snowcap Peak */}
        <rect x="28" y="0" width="8" height="4" fill="#ffffff" />
        <rect x="24" y="4" width="16" height="4" fill="#ffffff" />
        <rect x="20" y="8" width="24" height="4" fill="#ffffff" />
        <rect x="18" y="12" width="28" height="3" fill="#f1f5f9" />
        {/* Deep Indigo Mountain Slopes */}
        <rect x="14" y="15" width="36" height="5" fill="#312e81" />
        <rect x="8" y="20" width="48" height="6" fill="#312e81" />
        <rect x="0" y="26" width="64" height="12" fill="#1e1b4b" />
        <rect x="-8" y="38" width="80" height="10" fill="#1e1b4b" />
      </g>

      {/* Layer 2: Massive Sakura Blossom Canopy on Left & Right */}
      <g id="sakura-canopy-left">
        {/* Dark Bark Branches */}
        <rect x="0" y="18" width="14" height="5" fill="#3f1d1d" />
        <rect x="10" y="12" width="6" height="12" fill="#3f1d1d" />
        {/* Multi-layered Blossom Clouds */}
        <rect x="0" y="0" width="48" height="32" fill="#db2777" opacity="0.85" />
        <rect x="2" y="4" width="42" height="28" fill="#ec4899" />
        <rect x="6" y="8" width="34" height="22" fill="#f472b6" />
        <rect x="10" y="10" width="26" height="16" fill="#fbcfe8" />
        <rect x="14" y="12" width="16" height="10" fill="#ffffff" opacity="0.8" />
      </g>

      <g id="sakura-canopy-right">
        {/* Dark Bark Branches */}
        <rect x="146" y="16" width="14" height="6" fill="#3f1d1d" />
        <rect x="138" y="10" width="10" height="12" fill="#3f1d1d" />
        {/* Multi-layered Blossom Clouds */}
        <rect x="112" y="0" width="48" height="32" fill="#db2777" opacity="0.85" />
        <rect x="116" y="4" width="42" height="28" fill="#ec4899" />
        <rect x="120" y="8" width="34" height="22" fill="#f472b6" />
        <rect x="124" y="10" width="26" height="16" fill="#fbcfe8" />
        <rect x="130" y="12" width="16" height="10" fill="#ffffff" opacity="0.8" />
      </g>

      {/* Layer 3: Animated Floating Sakura Petal Snow */}
      <g id="falling-sakura-petals">
        <rect x={24 + (animTick * 2) % 40} y={16 + (animTick * 3) % 60} width="2" height="2" fill="#fbcfe8" />
        <rect x={70 + (animTick * 3) % 50} y={10 + (animTick * 4) % 65} width="2" height="1" fill="#f472b6" />
        <rect x={110 + (animTick * 2) % 40} y={20 + (animTick * 3) % 55} width="2" height="2" fill="#fda4af" />
        <rect x={48 + (animTick * 2.5) % 45} y={32 + (animTick * 3.5) % 50} width="1" height="2" fill="#ffffff" />
        <rect x={96 + (animTick * 1.8) % 40} y={26 + (animTick * 2.8) % 55} width="2" height="2" fill="#fbcfe8" />
      </g>

      {/* Layer 4: Grand Vermillion Torii Gate in Center Foreground */}
      <g id="grand-torii-gate" transform="translate(38, 14)">
        {/* Black Curved Top Kasagi Beam */}
        <rect x="2" y="0" width="80" height="4" fill="#18181b" />
        <rect x="0" y="1" width="84" height="2" fill="#18181b" />
        <rect x="4" y="1" width="76" height="1" fill="#71717a" /> {/* Highlight */}

        {/* Vermillion Main Beam (Shimaki) with Gold Fittings */}
        <rect x="6" y="4" width="72" height="4" fill="#b91c1c" />
        <rect x="8" y="5" width="68" height="2" fill="#dc2626" />
        {/* Gold Corner Caps */}
        <rect x="6" y="4" width="4" height="4" fill="#facc15" />
        <rect x="74" y="4" width="4" height="4" fill="#facc15" />

        {/* Gakuzuka Center Plaque ("Peace / Harmony") */}
        <rect x="39" y="8" width="6" height="8" fill="#18181b" stroke="#facc15" strokeWidth="0.5" />
        <rect x="41" y="10" width="2" height="4" fill="#facc15" />

        {/* Secondary Lower Crossbar (Nuki) */}
        <rect x="8" y="16" width="68" height="3" fill="#b91c1c" />
        <rect x="10" y="17" width="64" height="1" fill="#dc2626" />

        {/* Left Giant Column (Hashira) */}
        <rect x="16" y="4" width="8" height="52" fill="#991b1b" />
        <rect x="18" y="4" width="4" height="52" fill="#dc2626" />
        <rect x="19" y="4" width="2" height="52" fill="#ef4444" />
        {/* Black Stone Base (Kamebara) */}
        <rect x="14" y="52" width="12" height="6" fill="#18181b" />
        <rect x="15" y="53" width="10" height="4" fill="#3f3f46" />

        {/* Right Giant Column (Hashira) */}
        <rect x="60" y="4" width="8" height="52" fill="#991b1b" />
        <rect x="62" y="4" width="4" height="52" fill="#dc2626" />
        <rect x="63" y="4" width="2" height="52" fill="#ef4444" />
        {/* Black Stone Base (Kamebara) */}
        <rect x="58" y="52" width="12" height="6" fill="#18181b" />
        <rect x="59" y="53" width="10" height="4" fill="#3f3f46" />

        {/* Sacred Twisted Shimenawa Straw Rope & Paper Shide Pendants */}
        <rect x="16" y="18" width="52" height="2" fill="#ca8a04" />
        <rect x="18" y="19" width="48" height="1" fill="#fde047" />
        {/* Zigzag Paper Pendants (Shide) */}
        <g transform="translate(26, 20)">
          <rect x="0" y="0" width="3" height="4" fill="#ffffff" />
          <rect x="1" y="4" width="3" height="4" fill="#ffffff" />
        </g>
        <g transform="translate(41, 20)">
          <rect x="0" y="0" width="3" height="4" fill="#ffffff" />
          <rect x="1" y="4" width="3" height="4" fill="#ffffff" />
        </g>
        <g transform="translate(56, 20)">
          <rect x="0" y="0" width="3" height="4" fill="#ffffff" />
          <rect x="1" y="4" width="3" height="4" fill="#ffffff" />
        </g>
      </g>

      {/* Layer 5: Sacred Stone Kitsune Guardian on Left & Right */}
      <g id="kitsune-statue-left" transform="translate(10, 42)">
        {/* Stone Pedestal */}
        <rect x="0" y="14" width="16" height="8" fill="#334155" />
        <rect x="2" y="15" width="12" height="6" fill="#475569" />
        {/* Fox Body & Tail */}
        <rect x="4" y="6" width="8" height="9" fill="#64748b" />
        <rect x="10" y="4" width="4" height="8" fill="#64748b" />
        {/* Fox Head & Pointed Ears */}
        <rect x="3" y="1" width="6" height="6" fill="#94a3b8" />
        <rect x="3" y="-2" width="2" height="3" fill="#94a3b8" />
        <rect x="7" y="-2" width="2" height="3" fill="#94a3b8" />
        {/* Red Offering Bib (Maekake) */}
        <rect x="3" y="6" width="7" height="4" fill="#dc2626" />
      </g>

      <g id="kitsune-statue-right" transform="translate(134, 42)">
        {/* Stone Pedestal */}
        <rect x="0" y="14" width="16" height="8" fill="#334155" />
        <rect x="2" y="15" width="12" height="6" fill="#475569" />
        {/* Fox Body & Tail */}
        <rect x="4" y="6" width="8" height="9" fill="#64748b" />
        <rect x="2" y="4" width="4" height="8" fill="#64748b" />
        {/* Fox Head & Pointed Ears */}
        <rect x="7" y="1" width="6" height="6" fill="#94a3b8" />
        <rect x="7" y="-2" width="2" height="3" fill="#94a3b8" />
        <rect x="11" y="-2" width="2" height="3" fill="#94a3b8" />
        {/* Red Offering Bib (Maekake) */}
        <rect x="6" y="6" width="7" height="4" fill="#dc2626" />
      </g>

      {/* Layer 6: Stone Flagstone Pavement & Raked Zen Sand Courtyard */}
      <rect x="0" y="60" width="160" height="40" fill="#334155" />
      <rect x="0" y="64" width="160" height="36" fill="#475569" />
      
      {/* Central Sandstone Shrine Path */}
      <rect x="46" y="60" width="68" height="40" fill="#94a3b8" />
      <rect x="52" y="62" width="56" height="38" fill="#cbd5e1" />
      {/* Flagstone Tile Grid Lines */}
      <rect x="52" y="70" width="56" height="1" fill="#94a3b8" />
      <rect x="52" y="80" width="56" height="1" fill="#94a3b8" />
      <rect x="52" y="90" width="56" height="1" fill="#94a3b8" />
      <rect x="70" y="62" width="1" height="38" fill="#94a3b8" />
      <rect x="90" y="62" width="1" height="38" fill="#94a3b8" />

      {/* Saisenbako (Wooden Shrine Coin Offering Box) on Right */}
      <g id="saisenbako" transform="translate(108, 62)">
        <rect x="0" y="4" width="18" height="12" fill="#78350f" stroke="#b45309" strokeWidth="0.8" />
        <rect x="2" y="2" width="14" height="4" fill="#92400e" />
        {/* Slats with Brass Highlights */}
        <rect x="4" y="3" width="10" height="1" fill="#facc15" />
        <rect x="4" y="7" width="10" height="1" fill="#ca8a04" />
        {/* Sacred Rope Tassel */}
        <rect x="8" y="16" width="2" height="4" fill="#ef4444" />
      </g>

      {/* CENTER FROG STAGE: Sacred Granite Courtyard Dais with Fallen Petals */}
      <g id="sakura-frog-stage">
        {/* Elevated Polished Granite Platform */}
        <rect x="54" y="66" width="52" height="14" fill="#475569" />
        <rect x="56" y="65" width="48" height="14" fill="#64748b" />
        <rect x="58" y="64" width="44" height="14" fill="#94a3b8" />
        <rect x="62" y="64" width="36" height="12" fill="#e2e8f0" />

        {/* Scattered Pink Petals on Frog Platform */}
        <rect x="60" y="67" width="2" height="1" fill="#f472b6" />
        <rect x="92" y="66" width="3" height="2" fill="#fbcfe8" />
        <rect x="68" y="73" width="2" height="2" fill="#f472b6" />
        <rect x="86" y="72" width="2" height="1" fill="#fda4af" />
        <rect x="74" y="65" width="3" height="1" fill="#fbcfe8" />
      </g>
    </g>
  );
};
