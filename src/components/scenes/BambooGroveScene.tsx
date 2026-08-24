import React from 'react';

interface SceneProps {
  animTick: number;
  fullscreen?: boolean;
}

export const BambooGroveScene: React.FC<SceneProps> = ({ animTick, fullscreen }) => {
  return (
    <g id="scene-bamboo-grove">
      {/* Deep Misty Emerald Bamboo Atmosphere */}
      {fullscreen ? (
        <g>
          <rect x="0" y="-80" width="160" height="136" fill="#052e16" />
          <rect x="0" y="-20" width="160" height="40" fill="#064e3b" />
          <rect x="0" y="20" width="160" height="36" fill="#047857" />
        </g>
      ) : (
        <g>
          <rect x="0" y="0" width="160" height="20" fill="#052e16" />
          <rect x="0" y="20" width="160" height="20" fill="#064e3b" />
          <rect x="0" y="40" width="160" height="16" fill="#047857" />
        </g>
      )}

      {/* Layer 1: Sunbeams Filtering Through Mist (Stepped Pixel Komorebi Light Shafts) */}
      <g id="bamboo-sunbeams" opacity="0.18" fill="#fef08a">
        {/* Beam 1 */}
        <g transform="translate(16, 0)">
          <rect x="0" y="0" width="16" height="12" />
          <rect x="4" y="12" width="16" height="14" />
          <rect x="8" y="26" width="18" height="16" />
          <rect x="14" y="42" width="20" height="18" />
        </g>
        {/* Beam 2 */}
        <g transform="translate(68, 0)">
          <rect x="0" y="0" width="16" height="12" />
          <rect x="4" y="12" width="16" height="14" />
          <rect x="8" y="26" width="18" height="16" />
          <rect x="14" y="42" width="20" height="18" />
        </g>
        {/* Beam 3 */}
        <g transform="translate(112, 0)">
          <rect x="0" y="0" width="16" height="12" />
          <rect x="4" y="12" width="16" height="14" />
          <rect x="8" y="26" width="18" height="16" />
          <rect x="14" y="42" width="18" height="18" />
        </g>
      </g>

      {/* Layer 2: Deep Background Segmented Bamboo Stalks */}
      <g id="background-bamboo" opacity="0.65">
        {/* Bamboo Stalk 1 */}
        <g transform="translate(14, 0)">
          <rect x="0" y="0" width="6" height="66" fill="#065f46" />
          <rect x="0" y="16" width="6" height="2" fill="#064e3b" />
          <rect x="0" y="32" width="6" height="2" fill="#064e3b" />
          <rect x="0" y="48" width="6" height="2" fill="#064e3b" />
          {/* Leaves */}
          <rect x="-6" y="20" width="8" height="3" fill="#10b981" />
          <rect x="4" y="36" width="8" height="3" fill="#10b981" />
        </g>

        {/* Bamboo Stalk 2 */}
        <g transform="translate(36, 0)">
          <rect x="0" y="0" width="5" height="66" fill="#047857" />
          <rect x="0" y="14" width="5" height="2" fill="#064e3b" />
          <rect x="0" y="28" width="5" height="2" fill="#064e3b" />
          <rect x="0" y="44" width="5" height="2" fill="#064e3b" />
          {/* Leaves */}
          <rect x="4" y="18" width="8" height="3" fill="#10b981" />
        </g>

        {/* Bamboo Stalk 3 */}
        <g transform="translate(120, 0)">
          <rect x="0" y="0" width="6" height="66" fill="#047857" />
          <rect x="0" y="18" width="6" height="2" fill="#064e3b" />
          <rect x="0" y="34" width="6" height="2" fill="#064e3b" />
          <rect x="0" y="50" width="6" height="2" fill="#064e3b" />
          <rect x="-6" y="24" width="8" height="3" fill="#10b981" />
        </g>

        {/* Bamboo Stalk 4 */}
        <g transform="translate(142, 0)">
          <rect x="0" y="0" width="5" height="66" fill="#065f46" />
          <rect x="0" y="16" width="5" height="2" fill="#064e3b" />
          <rect x="0" y="32" width="5" height="2" fill="#064e3b" />
          <rect x="0" y="48" width="5" height="2" fill="#064e3b" />
          <rect x="4" y="38" width="8" height="3" fill="#10b981" />
        </g>
      </g>

      {/* Layer 3: Foreground Emerald Bamboo Stalks with High Shading */}
      <g id="foreground-bamboo">
        {/* Giant Stalk Left */}
        <g transform="translate(24, 0)">
          <rect x="0" y="0" width="8" height="66" fill="#15803d" />
          <rect x="2" y="0" width="4" height="66" fill="#22c55e" />
          <rect x="6" y="0" width="2" height="66" fill="#166534" />
          {/* Culm Nodes (Rings) */}
          <rect x="-1" y="14" width="10" height="3" fill="#14532d" />
          <rect x="-1" y="15" width="10" height="1" fill="#86efac" />
          <rect x="-1" y="32" width="10" height="3" fill="#14532d" />
          <rect x="-1" y="33" width="10" height="1" fill="#86efac" />
          <rect x="-1" y="50" width="10" height="3" fill="#14532d" />
          <rect x="-1" y="51" width="10" height="1" fill="#86efac" />
          {/* Detailed Leaf Clusters */}
          <g transform="translate(-10, 24)">
            <rect x="0" y="2" width="12" height="3" fill="#16a34a" />
            <rect x="2" y="0" width="8" height="3" fill="#4ade80" />
          </g>
        </g>

        {/* Giant Stalk Right */}
        <g transform="translate(130, 0)">
          <rect x="0" y="0" width="8" height="66" fill="#15803d" />
          <rect x="2" y="0" width="4" height="66" fill="#22c55e" />
          <rect x="6" y="0" width="2" height="66" fill="#166534" />
          {/* Culm Nodes */}
          <rect x="-1" y="16" width="10" height="3" fill="#14532d" />
          <rect x="-1" y="17" width="10" height="1" fill="#86efac" />
          <rect x="-1" y="36" width="10" height="3" fill="#14532d" />
          <rect x="-1" y="37" width="10" height="1" fill="#86efac" />
          {/* Detailed Leaf Clusters */}
          <g transform="translate(8, 28)">
            <rect x="0" y="2" width="12" height="3" fill="#16a34a" />
            <rect x="2" y="0" width="8" height="3" fill="#4ade80" />
          </g>
        </g>

        {/* Traditional Hanging Red Paper Lantern on Bamboo Branch */}
        <g transform="translate(30, 26)">
          <rect x="2" y="0" width="1" height="8" fill="#78350f" />
          <rect x="0" y="8" width="5" height="2" fill="#18181b" />
          <rect x="-1" y="10" width="7" height="10" fill="#dc2626" />
          <rect x="0" y="12" width="5" height="6" fill="#fef08a" />
          <rect x="1" y="13" width="3" height="4" fill="#ffffff" />
          <rect x="0" y="20" width="5" height="2" fill="#18181b" />
          <rect x="2" y="22" width="1" height="4" fill="#facc15" /> {/* Tassel */}
        </g>
      </g>

      {/* Layer 4: Granite Pagoda Lantern & Stone Bridge Stream on Far Right */}
      <g id="stone-pagoda-lantern" transform="translate(108, 38)">
        {/* Tiered Stone Pagoda Roof */}
        <rect x="4" y="0" width="12" height="3" fill="#475569" />
        <rect x="2" y="3" width="16" height="2" fill="#334155" />
        <rect x="0" y="5" width="20" height="2" fill="#1e293b" />
        {/* Firebox */}
        <rect x="4" y="7" width="12" height="6" fill="#1e293b" />
        <rect x="6" y="8" width="8" height="4" fill="#fef08a" />
        <rect x="8" y="9" width="4" height="2" fill="#ffffff" />
        {/* Base */}
        <rect x="2" y="13" width="16" height="3" fill="#334155" />
        <rect x="5" y="16" width="10" height="8" fill="#475569" />
      </g>

      {/* Layer 5: Mossy Forest Floor & Stepping Stone Path */}
      <rect x="0" y="56" width="160" height="44" fill="#14532d" />
      <rect x="0" y="62" width="160" height="38" fill="#166534" />
      <rect x="0" y="76" width="160" height="24" fill="#143e24" />

      {/* Left & Right Moss Highlights */}
      <rect x="10" y="64" width="16" height="4" fill="#4ade80" />
      <rect x="136" y="66" width="18" height="4" fill="#4ade80" />

      {/* CENTER FROG STAGE: Granite Stepping Stone Dais & River Pebble Border */}
      <g id="bamboo-grove-frog-stage">
        {/* River Pebble Ring */}
        <rect x="48" y="68" width="64" height="16" fill="#334155" />
        <rect x="50" y="67" width="60" height="17" fill="#475569" />

        {/* Polished Granite Stepping Platform */}
        <rect x="52" y="66" width="56" height="14" fill="#64748b" />
        <rect x="56" y="64" width="48" height="16" fill="#94a3b8" />
        <rect x="60" y="63" width="40" height="16" fill="#cbd5e1" />
        <rect x="64" y="63" width="32" height="13" fill="#e2e8f0" />

        {/* Velvet Moss Clusters on Edge */}
        <rect x="54" y="65" width="6" height="2" fill="#65a30d" />
        <rect x="98" y="64" width="8" height="3" fill="#65a30d" />
        <rect x="74" y="74" width="8" height="2" fill="#4d7c0f" />
      </g>
    </g>
  );
};
