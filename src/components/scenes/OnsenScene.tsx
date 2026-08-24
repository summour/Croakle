import React from 'react';

interface SceneProps {
  animTick: number;
  fullscreen?: boolean;
}

export const OnsenScene: React.FC<SceneProps> = ({ animTick, fullscreen }) => {
  return (
    <g id="scene-onsen">
      {/* Alpine Mountain Dusk Sky */}
      {fullscreen ? (
        <g>
          <rect x="0" y="-80" width="160" height="136" fill="#0f172a" />
          <rect x="0" y="-20" width="160" height="40" fill="#1e293b" />
          <rect x="0" y="20" width="160" height="36" fill="#334155" />
        </g>
      ) : (
        <g>
          <rect x="0" y="0" width="160" height="20" fill="#0f172a" />
          <rect x="0" y="20" width="160" height="20" fill="#1e293b" />
          <rect x="0" y="40" width="160" height="16" fill="#334155" />
        </g>
      )}

      {/* Layer 1: Distant Snowy Mountain Peaks & Alpine Pine Trees */}
      <g id="snowy-mountains" opacity="0.6">
        {/* Mountain 1 Peak */}
        <rect x="18" y="22" width="12" height="4" fill="#ffffff" />
        <rect x="12" y="26" width="24" height="6" fill="#ffffff" />
        <rect x="8" y="32" width="32" height="24" fill="#1e293b" />

        {/* Mountain 2 Peak */}
        <rect x="84" y="14" width="16" height="5" fill="#ffffff" />
        <rect x="76" y="19" width="32" height="8" fill="#ffffff" />
        <rect x="66" y="27" width="52" height="28" fill="#1e293b" />

        {/* Snowy Evergreen Pines */}
        <rect x="4" y="32" width="16" height="24" fill="#064e3b" />
        <rect x="6" y="30" width="12" height="4" fill="#f8fafc" />
        <rect x="136" y="30" width="20" height="26" fill="#064e3b" />
        <rect x="138" y="28" width="16" height="4" fill="#f8fafc" />
      </g>

      {/* Layer 2: Traditional Hinoki Bamboo Flume Spout on Left */}
      <g id="onsen-bamboo-flume" transform="translate(10, 36)">
        {/* Support Timber Stand */}
        <rect x="10" y="8" width="4" height="22" fill="#78350f" />
        <rect x="11" y="8" width="2" height="22" fill="#a16207" />

        {/* Slanted Bamboo Channel Pouring Steaming Spring Water */}
        <rect x="0" y="10" width="24" height="4" fill="#4d7c0f" />
        <rect x="2" y="11" width="20" height="2" fill="#65a30d" />
        <rect x="20" y="12" width="4" height="2" fill="#38bdf8" />
        {/* Flowing Water Stream */}
        <rect x="22" y="14" width="2" height="12" fill="#38bdf8" opacity="0.8" />
        <rect x="23" y="14" width="1" height="12" fill="#ffffff" opacity="0.9" />
      </g>

      {/* Layer 3: Hinoki Cedar Wood Deck on Right with Wash Bucket & Sake Tray */}
      <g id="onsen-deck-accessories" transform="translate(118, 44)">
        {/* Cedar Plank Deck Corner */}
        <rect x="0" y="12" width="42" height="16" fill="#92400e" />
        <rect x="0" y="14" width="42" height="14" fill="#b45309" />
        <rect x="0" y="20" width="42" height="1" fill="#78350f" />

        {/* Traditional Wooden Oke Bath Bucket with Brass Hoops */}
        <rect x="6" y="6" width="14" height="10" fill="#d97706" />
        <rect x="8" y="7" width="10" height="8" fill="#f59e0b" />
        <rect x="6" y="8" width="14" height="1" fill="#facc15" /> {/* Brass Hoop */}
        <rect x="6" y="13" width="14" height="1" fill="#facc15" /> {/* Brass Hoop */}
        {/* White Folded Towel on Bucket */}
        <rect x="8" y="4" width="10" height="4" fill="#ffffff" />
        <rect x="9" y="5" width="8" height="2" fill="#e2e8f0" />

        {/* Floating Cedar Tray with Ceramic Tokkuri Sake Flask & Cup */}
        <rect x="22" y="8" width="14" height="4" fill="#78350f" />
        <rect x="24" y="2" width="5" height="8" fill="#f8fafc" /> {/* Flask */}
        <rect x="25" y="0" width="3" height="3" fill="#0284c7" /> {/* Flask Neck */}
        <rect x="31" y="5" width="4" height="4" fill="#f8fafc" /> {/* Ochoko Cup */}
        <rect x="32" y="6" width="2" height="2" fill="#38bdf8" />
      </g>

      {/* Layer 4: Natural Volcanic Basalt Rock Basin & Mineral Waters */}
      <rect x="0" y="52" width="160" height="48" fill="#18181b" />
      {/* Surrounding Natural Basalt Stones */}
      <rect x="0" y="52" width="160" height="8" fill="#27272a" />
      <rect x="12" y="56" width="136" height="44" fill="#0e7490" />
      <rect x="16" y="60" width="128" height="38" fill="#0891b2" />
      <rect x="20" y="66" width="120" height="30" fill="#06b6d4" />
      <rect x="24" y="74" width="112" height="20" fill="#22d3ee" opacity="0.8" />

      {/* Steaming Geothermal Water Shimmers */}
      <rect x="28" y={animTick % 2 === 0 ? 64 : 65} width="24" height="1" fill="#cffafe" opacity="0.85" />
      <rect x="88" y={animTick % 2 === 0 ? 68 : 67} width="32" height="1" fill="#cffafe" opacity="0.85" />
      <rect x="42" y={animTick % 2 === 0 ? 80 : 81} width="28" height="1" fill="#e0f2fe" opacity="0.75" />

      {/* Layer 5: Layered Floating Mineral Steam Clouds */}
      <g id="onsen-steam-vapor">
        {/* Steam Cloud 1 (Left) */}
        <g transform={`translate(28, ${animTick % 2 === 0 ? 44 : 42})`} opacity="0.55">
          <rect x="4" y="0" width="14" height="6" fill="#ffffff" />
          <rect x="0" y="4" width="22" height="6" fill="#ffffff" />
          <rect x="6" y="8" width="12" height="4" fill="#ffffff" />
        </g>
        {/* Steam Cloud 2 (Center-Right) */}
        <g transform={`translate(96, ${animTick % 2 === 0 ? 40 : 38})`} opacity="0.55">
          <rect x="6" y="0" width="18" height="6" fill="#ffffff" />
          <rect x="0" y="4" width="28" height="8" fill="#ffffff" />
          <rect x="8" y="10" width="14" height="4" fill="#ffffff" />
        </g>
      </g>

      {/* CENTER FROG STAGE: Smooth Heated River Rock Dais with White Onsen Towel */}
      <g id="onsen-frog-stage">
        {/* Underwater Rock Shadow */}
        <rect x="52" y="72" width="56" height="8" fill="#083344" opacity="0.7" />

        {/* Smooth Dark Basalt River Rock */}
        <rect x="50" y="66" width="60" height="14" fill="#3f3f46" />
        <rect x="52" y="64" width="56" height="16" fill="#52525b" />
        <rect x="56" y="62" width="48" height="18" fill="#71717a" />
        <rect x="60" y="61" width="40" height="18" fill="#a1a1aa" />
        <rect x="66" y="61" width="28" height="14" fill="#d4d4d8" />

        {/* Warm Mineral Water Edge Highlights */}
        <rect x="54" y="70" width="6" height="2" fill="#67e8f9" />
        <rect x="100" y="70" width="6" height="2" fill="#67e8f9" />

        {/* Folded Japanese Tenugui Towel on Rock Stage */}
        <g transform="translate(90, 62)">
          <rect x="0" y="2" width="10" height="5" fill="#ffffff" />
          <rect x="1" y="3" width="8" height="3" fill="#e2e8f0" />
          <rect x="3" y="2" width="4" height="1" fill="#f43f5e" /> {/* Red Crest */}
        </g>
      </g>
    </g>
  );
};
