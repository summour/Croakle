import React from 'react';

interface SceneProps {
  animTick: number;
  fullscreen?: boolean;
}

export const SaunaBathhouseScene: React.FC<SceneProps> = ({ animTick, fullscreen }) => {
  return (
    <g id="scene-sauna-bathhouse">
      {/* Warm Western Red Cedar Wood Slat Walls with 3D Depth */}
      {fullscreen ? (
        <g>
          <rect x="0" y="-80" width="160" height="142" fill="#78350f" />
          <rect x="0" y="-40" width="160" height="2" fill="#451a03" />
          <rect x="0" y="0" width="160" height="2" fill="#451a03" />
        </g>
      ) : (
        <rect x="0" y="0" width="160" height="62" fill="#78350f" />
      )}

      {/* Horizontal Cedar Slats with Beveled Edge Lighting */}
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={i} transform={`translate(0, ${i * 8})`}>
          <rect x="0" y="0" width="160" height="7" fill="#92400e" />
          <rect x="0" y="0" width="160" height="1" fill="#b45309" />
          <rect x="0" y="7" width="160" height="1" fill="#451a03" />
        </g>
      ))}

      {/* Modern Wall Sconce Ambient Warm Lighting with Glass Shade */}
      <g transform="translate(18, 16)">
        <rect x="0" y="0" width="12" height="18" fill="#fde68a" stroke="#78350f" strokeWidth="0.8" />
        <rect x="2" y="2" width="8" height="14" fill="#fef08a" />
        <rect x="4" y="4" width="4" height="10" fill="#ffffff" />
        {/* Slanted Wooden Diffuser Grille */}
        <rect x="0" y="4" width="12" height="1" fill="#78350f" />
        <rect x="0" y="9" width="12" height="1" fill="#78350f" />
        <rect x="0" y="14" width="12" height="1" fill="#78350f" />
      </g>

      {/* Sauna Sand Timer (Hourglass) & Brass Thermo-Hygrometer on Left */}
      <g id="sauna-gauges" transform="translate(36, 18)">
        {/* Wooden Hourglass Wall Mount */}
        <rect x="0" y="0" width="8" height="16" fill="#451a03" />
        <rect x="2" y="2" width="4" height="5" fill="#fef08a" />
        <rect x="3" y="7" width="2" height="2" fill="#ffffff" />
        <rect x="2" y="9" width="4" height="5" fill="#fef08a" />

        {/* Brass Thermo-Hygrometer Dial (Stepped Pixel Round Gauge) */}
        <g transform="translate(13, 1)">
          {/* Brass outer rim */}
          <rect x="3" y="0" width="8" height="14" fill="#78350f" />
          <rect x="0" y="3" width="14" height="8" fill="#78350f" />
          <rect x="1" y="1" width="12" height="12" fill="#78350f" />
          {/* Golden bezel */}
          <rect x="3" y="1" width="8" height="12" fill="#facc15" />
          <rect x="1" y="3" width="12" height="8" fill="#facc15" />
          <rect x="2" y="2" width="10" height="10" fill="#facc15" />
          {/* White dial face */}
          <rect x="4" y="2" width="6" height="10" fill="#ffffff" />
          <rect x="2" y="4" width="10" height="6" fill="#ffffff" />
          <rect x="3" y="3" width="8" height="8" fill="#ffffff" />
          {/* Indicator Needle & Center Pivot */}
          <rect x="6" y="3" width="2" height="5" fill="#dc2626" />
          <rect x="6" y="6" width="2" height="2" fill="#18181b" />
        </g>
      </g>

      {/* Scandinavian Birch Vihta Whisk Hanging on Wall */}
      <g transform="translate(56, 16)">
        <rect x="3" y="0" width="2" height="4" fill="#78350f" /> {/* Twine */}
        <rect x="0" y="4" width="8" height="14" fill="#15803d" />
        <rect x="2" y="6" width="4" height="10" fill="#22c55e" />
      </g>

      {/* RIGHT SIDE: Heavy Volcanic Stone Kiukaat Stove with Glowing Coals */}
      <g id="sauna-heater-stove" transform="translate(112, 18)">
        {/* Stainless Steel Outer Basket Frame */}
        <rect x="0" y="12" width="38" height="34" fill="#18181b" />
        <rect x="2" y="14" width="34" height="30" fill="#27272a" />
        {/* Wire Grille Lines */}
        <rect x="2" y="20" width="34" height="1" fill="#52525b" />
        <rect x="2" y="28" width="34" height="1" fill="#52525b" />
        <rect x="2" y="36" width="34" height="1" fill="#52525b" />
        <rect x="10" y="14" width="1" height="30" fill="#52525b" />
        <rect x="20" y="14" width="1" height="30" fill="#52525b" />
        <rect x="30" y="14" width="1" height="30" fill="#52525b" />

        {/* Volcanic Basalt Stones Piled High on Stove */}
        <rect x="4" y="4" width="30" height="12" fill="#3f3f46" />
        <rect x="6" y="2" width="26" height="8" fill="#52525b" />
        <rect x="10" y="0" width="18" height="6" fill="#71717a" />

        {/* Glowing Ember Core Between Stones */}
        <rect x="12" y="6" width="6" height="3" fill="#ea580c" />
        <rect x="22" y="5" width="5" height="3" fill="#ea580c" />
        <rect x="14" y="7" width="2" height="1" fill="#fef08a" />

        {/* Steaming Löyly Vapor Waves */}
        <g transform={`translate(8, ${animTick % 2 === 0 ? -10 : -8})`} opacity="0.65">
          <rect x="4" y="0" width="16" height="6" fill="#ffffff" />
          <rect x="0" y="4" width="24" height="6" fill="#ffffff" />
          <rect x="6" y="8" width="12" height="4" fill="#ffffff" />
        </g>
      </g>

      {/* Tiered Solid Aspen Wood Sauna Benches */}
      <rect x="0" y="52" width="160" height="48" fill="#b45309" />
      <rect x="0" y="54" width="160" height="8" fill="#fde68a" />
      <rect x="0" y="62" width="160" height="38" fill="#d97706" />

      {/* Lower Step Tier */}
      <rect x="0" y="78" width="160" height="2" fill="#78350f" />
      <rect x="0" y="80" width="160" height="20" fill="#b45309" />

      {/* Copper Water Bucket & Wooden Ladle on Left Bench */}
      <g id="sauna-bucket-ladle" transform="translate(16, 48)">
        {/* Copper Kiulu Bucket */}
        <rect x="2" y="8" width="18" height="14" fill="#b45309" />
        <rect x="4" y="10" width="14" height="10" fill="#d97706" />
        <rect x="2" y="12" width="18" height="2" fill="#facc15" /> {/* Copper Sheen */}
        {/* Ladle Handle Sticking Out */}
        <rect x="14" y="0" width="3" height="12" fill="#451a03" />
        <rect x="13" y="10" width="6" height="4" fill="#78350f" />
      </g>

      {/* CENTER FROG STAGE: Plush Woven Waffle Towel on Upper Cedar Bench */}
      <g id="sauna-frog-stage">
        {/* Shadow */}
        <rect x="46" y="62" width="68" height="16" fill="#78350f" opacity="0.6" />

        {/* Folded Cream White Waffle Cotton Towel */}
        <rect x="48" y="60" width="64" height="14" fill="#d6d3d1" />
        <rect x="50" y="58" width="60" height="14" fill="#e7e5e4" />
        <rect x="52" y="58" width="56" height="12" fill="#fafaf9" />

        {/* Waffle Weave Texture Dots */}
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x={56 + i * 6} y="62" width="2" height="4" fill="#d6d3d1" />
        ))}
      </g>
    </g>
  );
};
