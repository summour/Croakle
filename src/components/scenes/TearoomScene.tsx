import React from 'react';

interface SceneProps {
  animTick: number;
  fullscreen?: boolean;
}

export const TearoomScene: React.FC<SceneProps> = ({ animTick, fullscreen }) => {
  return (
    <g id="scene-tearoom">
      {/* Background Japanese Washi & Shoji Architecture */}
      {fullscreen ? (
        <g>
          <rect x="0" y="-80" width="160" height="142" fill="#fef3c7" />
          <rect x="0" y="-40" width="160" height="2" fill="#522e11" />
          <rect x="0" y="0" width="160" height="2" fill="#522e11" />
        </g>
      ) : (
        <rect x="0" y="0" width="160" height="62" fill="#fef3c7" />
      )}

      {/* Shoji Lattice Grid Woodwork (Kumiko) */}
      <rect x="0" y="0" width="160" height="4" fill="#522e11" />
      <rect x="0" y="20" width="160" height="2" fill="#78350f" opacity="0.7" />
      <rect x="0" y="40" width="160" height="2" fill="#78350f" opacity="0.7" />
      <rect x="0" y="60" width="160" height="4" fill="#522e11" />

      <rect x="36" y="0" width="2" height="60" fill="#78350f" opacity="0.7" />
      <rect x="76" y="0" width="2" height="60" fill="#78350f" opacity="0.7" />
      <rect x="116" y="0" width="2" height="60" fill="#78350f" opacity="0.7" />

      {/* LEFT SIDE: Tokonoma Display Alcove with Calligraphy Scroll */}
      <g id="tokonoma-alcove" transform="translate(8, 8)">
        {/* Alcove Pillar & Frame */}
        <rect x="0" y="0" width="26" height="52" fill="#fef9c3" />
        <rect x="0" y="0" width="2" height="52" fill="#522e11" />
        <rect x="24" y="0" width="2" height="52" fill="#522e11" />

        {/* Hanging Calligraphy Scroll (Kakejiku) */}
        <rect x="6" y="4" width="14" height="36" fill="#fef3c7" stroke="#78350f" strokeWidth="0.6" />
        <rect x="8" y="10" width="10" height="24" fill="#ffffff" />
        {/* Japanese Kanji Brush Strokes ("Wa" - Harmony / Peace) */}
        <g transform="translate(10, 14)" fill="#18181b">
          <rect x="1" y="0" width="4" height="1" />
          <rect x="2" y="1" width="2" height="4" />
          <rect x="0" y="5" width="6" height="1" />
          <rect x="1" y="7" width="4" height="6" />
          <rect x="2" y="9" width="2" height="2" fill="#ffffff" />
        </g>
        {/* Red Artist Seal Stamp */}
        <rect x="14" y="28" width="2" height="2" fill="#dc2626" />
        {/* Scroll Weight Roller at Bottom */}
        <rect x="4" y="39" width="18" height="2" fill="#451a03" />

        {/* Incense Burner (Koro) with Curling Smoke Wisp */}
        <rect x="10" y="46" width="6" height="4" fill="#d97706" />
        <rect x="11" y="44" width="4" height="2" fill="#b45309" />
        {/* Smoke Wisp */}
        <rect x="12" y={animTick % 2 === 0 ? 41 : 40} width="2" height="3" fill="#94a3b8" opacity="0.6" />
      </g>

      {/* RIGHT SIDE: Potted Juniper Bonsai Tree in Ceramic Dish */}
      <g id="bonsai-display" transform="translate(126, 26)">
        {/* Ceramic Bonsai Pot */}
        <rect x="4" y="26" width="22" height="6" fill="#1e293b" />
        <rect x="2" y="25" width="26" height="2" fill="#334155" />
        <rect x="5" y="32" width="4" height="2" fill="#0f172a" />
        <rect x="21" y="32" width="4" height="2" fill="#0f172a" />

        {/* Gnarled Wood Trunk */}
        <rect x="12" y="18" width="4" height="8" fill="#451a03" />
        <rect x="14" y="12" width="4" height="8" fill="#78350f" />
        <rect x="8" y="10" width="8" height="3" fill="#78350f" />

        {/* Dense Green Needle Foliage Clouds */}
        <rect x="2" y="4" width="14" height="8" fill="#14532d" />
        <rect x="4" y="2" width="10" height="8" fill="#15803d" />
        <rect x="6" y="3" width="6" height="4" fill="#22c55e" />

        <rect x="16" y="6" width="14" height="8" fill="#14532d" />
        <rect x="18" y="4" width="10" height="8" fill="#15803d" />
        <rect x="20" y="5" width="6" height="4" fill="#22c55e" />
      </g>

      {/* Authentic Tatami Mat Flooring with Silk Borders (Heri) */}
      <rect x="0" y="62" width="160" height="38" fill="#bef264" />
      <rect x="0" y="64" width="160" height="36" fill="#d9f99d" />
      {/* Woven Texture Lines */}
      <rect x="0" y="70" width="160" height="1" fill="#a3e635" opacity="0.6" />
      <rect x="0" y="78" width="160" height="1" fill="#a3e635" opacity="0.6" />
      <rect x="0" y="86" width="160" height="1" fill="#a3e635" opacity="0.6" />
      <rect x="0" y="94" width="160" height="1" fill="#a3e635" opacity="0.6" />

      {/* Dark Silk Tatami Edge Borders (Heri) */}
      <rect x="0" y="62" width="160" height="2" fill="#1e293b" />
      <rect x="0" y="76" width="160" height="2" fill="#1e293b" />
      <rect x="0" y="90" width="160" height="2" fill="#1e293b" />
      <rect x="52" y="62" width="2" height="38" fill="#1e293b" />
      <rect x="108" y="62" width="2" height="38" fill="#1e293b" />

      {/* CENTER FROG STAGE: Low Lacquered Chado Table with Matcha & Wagashi */}
      <g id="tearoom-frog-stage">
        {/* Polished Low Black & Vermillion Lacquer Table */}
        <rect x="50" y="66" width="60" height="14" fill="#451a03" />
        <rect x="52" y="64" width="56" height="14" fill="#78350f" />
        <rect x="54" y="64" width="52" height="3" fill="#b45309" />
        {/* Table Legs */}
        <rect x="52" y="74" width="4" height="6" fill="#451a03" />
        <rect x="104" y="74" width="4" height="6" fill="#451a03" />

        {/* Handcrafted Ceramic Matcha Bowl (Chawan) with Frothy Green Tea on Left */}
        <g transform="translate(44, 62)">
          <rect x="2" y="4" width="12" height="8" fill="#1e293b" />
          <rect x="0" y="2" width="16" height="5" fill="#334155" />
          <rect x="2" y="3" width="12" height="3" fill="#22c55e" /> {/* Frothy Matcha */}
          <rect x="4" y="3" width="8" height="1" fill="#4ade80" />
        </g>

        {/* Bamboo Whisk (Chasen) */}
        <g transform="translate(62, 63)">
          <rect x="2" y="0" width="3" height="4" fill="#fef08a" />
          <rect x="0" y="4" width="7" height="4" fill="#fde047" />
        </g>

        {/* Sweet Sakura Blossom Wagashi Confection on Right */}
        <g transform="translate(104, 63)">
          {/* White Paper Napkin */}
          <rect x="0" y="3" width="10" height="6" fill="#ffffff" />
          {/* Pink Lotus Sweet */}
          <rect x="2" y="1" width="6" height="5" fill="#f472b6" />
          <rect x="4" y="2" width="2" height="2" fill="#facc15" />
        </g>
      </g>
    </g>
  );
};
