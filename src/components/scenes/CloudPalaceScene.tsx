import React from 'react';

interface SceneProps {
  animTick: number;
  fullscreen?: boolean;
}

export const CloudPalaceScene: React.FC<SceneProps> = ({ animTick, fullscreen }) => {
  return (
    <g id="scene-cloud-palace">
      {/* Dreamy Dawn Sky with Soft Pastel Gradient */}
      {fullscreen ? (
        <g>
          <rect x="0" y="-80" width="160" height="136" fill="#4338ca" />
          <rect x="0" y="-20" width="160" height="40" fill="#6366f1" />
          <rect x="0" y="20" width="160" height="36" fill="#a855f7" />
          <rect x="0" y="44" width="160" height="22" fill="#ec4899" />
        </g>
      ) : (
        <g>
          <rect x="0" y="0" width="160" height="20" fill="#6366f1" />
          <rect x="0" y="20" width="160" height="20" fill="#a855f7" />
          <rect x="0" y="40" width="160" height="26" fill="#ec4899" />
        </g>
      )}

      {/* Layer 1: Sparkling Golden Stardust Particles & Constellations */}
      <g id="cloud-stars">
        <g transform="translate(18, 14)" opacity={animTick % 2 === 0 ? 0.95 : 0.4}>
          <rect x="2" y="0" width="1" height="5" fill="#fef08a" />
          <rect x="0" y="2" width="5" height="1" fill="#fef08a" />
          <rect x="1" y="1" width="3" height="3" fill="#ffffff" />
        </g>
        <g transform="translate(76, 8)" opacity={animTick % 3 === 0 ? 0.95 : 0.35}>
          <rect x="2" y="0" width="1" height="5" fill="#fde047" />
          <rect x="0" y="2" width="5" height="1" fill="#fde047" />
        </g>
        <g transform="translate(136, 12)" opacity={animTick % 2 === 1 ? 0.95 : 0.4}>
          <rect x="2" y="0" width="1" height="5" fill="#fef08a" />
          <rect x="0" y="2" width="5" height="1" fill="#fef08a" />
          <rect x="1" y="1" width="3" height="3" fill="#ffffff" />
        </g>
        {/* Floating Stardust Dots */}
        <rect x="42" y="22" width="2" height="2" fill="#fef08a" />
        <rect x="108" y="18" width="2" height="2" fill="#ffffff" />
        <rect x="62" y="32" width="1" height="1" fill="#fde047" />
        <rect x="122" y="28" width="2" height="2" fill="#fef08a" />
      </g>

      {/* Layer 2: Celestial Marble Palace Pillars on Left & Right */}
      <g id="palace-pillar-left" transform="translate(12, 16)">
        {/* Capital Arch & Golden Finial */}
        <rect x="2" y="-4" width="14" height="4" fill="#facc15" />
        <rect x="6" y="-8" width="6" height="4" fill="#fde047" />
        <rect x="8" y="-12" width="2" height="4" fill="#ffffff" />
        {/* Pearlescent Pillar Column */}
        <rect x="4" y="0" width="10" height="48" fill="#e0e7ff" />
        <rect x="6" y="0" width="6" height="48" fill="#ffffff" />
        <rect x="8" y="0" width="2" height="48" fill="#c7d2fe" />
        {/* Base */}
        <rect x="2" y="48" width="14" height="4" fill="#facc15" />
      </g>

      <g id="palace-pillar-right" transform="translate(130, 16)">
        {/* Capital Arch & Golden Finial */}
        <rect x="2" y="-4" width="14" height="4" fill="#facc15" />
        <rect x="6" y="-8" width="6" height="4" fill="#fde047" />
        <rect x="8" y="-12" width="2" height="4" fill="#ffffff" />
        {/* Pearlescent Pillar Column */}
        <rect x="4" y="0" width="10" height="48" fill="#e0e7ff" />
        <rect x="6" y="0" width="6" height="48" fill="#ffffff" />
        <rect x="8" y="0" width="2" height="48" fill="#c7d2fe" />
        {/* Base */}
        <rect x="2" y="48" width="14" height="4" fill="#facc15" />
      </g>

      {/* Layer 3: Fluffy Tiered Cumulus Cloud Banks with Pastel Highlights */}
      <rect x="0" y="58" width="160" height="42" fill="#c4b5fd" />
      <rect x="0" y="66" width="160" height="34" fill="#ddd6fe" />
      <rect x="0" y="74" width="160" height="26" fill="#ede9fe" />
      <rect x="0" y="84" width="160" height="16" fill="#f5f3ff" />

      {/* Cloud Puffs (Stepped Pixel Arches) */}
      <g id="cloud-puffs" fill="#ffffff">
        <rect x="4" y="46" width="28" height="20" />
        <rect x="8" y="42" width="20" height="6" />
        <rect x="26" y="44" width="34" height="22" />
        <rect x="32" y="40" width="22" height="6" />
        <rect x="56" y="48" width="48" height="20" />
        <rect x="64" y="44" width="32" height="6" />
        <rect x="100" y="44" width="34" height="22" />
        <rect x="106" y="40" width="22" height="6" />
        <rect x="128" y="46" width="28" height="20" />
        <rect x="132" y="42" width="20" height="6" />
      </g>

      {/* Layer 4: Floating Celestial Crescent Moon Throne Platform */}
      <g id="crescent-moon-platform" transform="translate(108, 38)">
        <rect x="6" y="0" width="12" height="4" fill="#facc15" />
        <rect x="2" y="4" width="18" height="6" fill="#fde047" />
        <rect x="0" y="10" width="20" height="8" fill="#fef08a" />
        <rect x="2" y="18" width="16" height="4" fill="#facc15" />
        {/* Inner Moon Arc */}
        <rect x="8" y="4" width="14" height="6" fill="#a855f7" />
        <rect x="6" y="10" width="14" height="6" fill="#a855f7" />
      </g>

      {/* CENTER FROG STAGE: Iridescent Starlight Dais & Rainbow Ribbon Arch */}
      <g id="cloud-palace-frog-stage">
        {/* Golden Base Ring */}
        <rect x="50" y="66" width="60" height="14" fill="#ca8a04" />
        <rect x="52" y="65" width="56" height="14" fill="#eab308" />
        <rect x="54" y="64" width="52" height="14" fill="#facc15" />
        <rect x="58" y="64" width="44" height="12" fill="#fef08a" />

        {/* Radiant Crystal Starlight Floor */}
        <rect x="62" y="65" width="36" height="10" fill="#ffffff" />
        <rect x="66" y="66" width="28" height="8" fill="#e0f2fe" />

        {/* 4 Corner Floating Star Gems */}
        <g transform="translate(48, 64)">
          <rect x="1" y="0" width="2" height="4" fill="#facc15" />
          <rect x="0" y="1" width="4" height="2" fill="#facc15" />
          <rect x="1" y="1" width="2" height="2" fill="#ffffff" />
        </g>
        <g transform="translate(108, 64)">
          <rect x="1" y="0" width="2" height="4" fill="#facc15" />
          <rect x="0" y="1" width="4" height="2" fill="#facc15" />
          <rect x="1" y="1" width="2" height="2" fill="#ffffff" />
        </g>
      </g>
    </g>
  );
};
