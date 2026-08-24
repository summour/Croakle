import React from 'react';

interface SceneProps {
  animTick: number;
  fullscreen?: boolean;
}

export const TreehouseScene: React.FC<SceneProps> = ({ animTick, fullscreen }) => {
  return (
    <g id="scene-treehouse">
      {/* Background Wooden Walls with Grain & Fullscreen Support */}
      {fullscreen ? (
        <g>
          <rect x="0" y="-80" width="160" height="148" fill="#451a03" />
          <rect x="0" y="-40" width="160" height="1" fill="#271003" />
          <rect x="0" y="0" width="160" height="1" fill="#271003" />
        </g>
      ) : (
        <rect x="0" y="0" width="160" height="68" fill="#451a03" />
      )}

      {/* Horizontal Oak Wood Planks with Highlights */}
      <rect x="0" y="16" width="160" height="1" fill="#271003" />
      <rect x="0" y="32" width="160" height="1" fill="#271003" />
      <rect x="0" y="48" width="160" height="1" fill="#271003" />
      <rect x="0" y="64" width="160" height="1" fill="#271003" />
      {/* Planks Texture Highlights */}
      <rect x="0" y="17" width="160" height="1" fill="#78350f" opacity="0.3" />
      <rect x="0" y="33" width="160" height="1" fill="#78350f" opacity="0.3" />
      <rect x="0" y="49" width="160" height="1" fill="#78350f" opacity="0.3" />

      {/* Ceiling Timber Beam with Hanging Herb Bundles & Brass Lantern */}
      <rect x="0" y="0" width="160" height="6" fill="#271003" />
      <rect x="0" y="6" width="160" height="2" fill="#522304" />
      
      {/* Hanging Dried Lavender & Sage Bundles */}
      <g transform="translate(48, 6)">
        <rect x="0" y="0" width="1" height="4" fill="#78350f" />
        <rect x="-2" y="4" width="5" height="7" fill="#8b5cf6" />
        <rect x="-1" y="9" width="3" height="3" fill="#a78bfa" />
      </g>
      <g transform="translate(60, 6)">
        <rect x="0" y="0" width="1" height="5" fill="#78350f" />
        <rect x="-2" y="5" width="5" height="8" fill="#15803d" />
        <rect x="-1" y="11" width="3" height="3" fill="#22c55e" />
      </g>
      <g transform="translate(72, 6)">
        <rect x="0" y="0" width="1" height="3" fill="#78350f" />
        <rect x="-2" y="3" width="5" height="7" fill="#f59e0b" />
        <rect x="-1" y="8" width="3" height="3" fill="#fde047" />
      </g>

      {/* Hanging Brass Storm Lantern */}
      <g transform="translate(86, 6)">
        <rect x="3" y="0" width="1" height="8" fill="#78350f" />
        <rect x="1" y="8" width="5" height="2" fill="#d97706" />
        <rect x="0" y="10" width="7" height="9" fill="#fef08a" />
        <rect x="2" y="12" width="3" height="5" fill="#ffffff" />
        <rect x="0" y="19" width="7" height="2" fill="#b45309" />
        <rect x="0" y="10" width="7" height="9" fill="#d97706" opacity="0.25" />
      </g>

      {/* RIGHT SIDE: Cozy Arched Bay Window with Forest View & Velvet Curtains */}
      <g id="treehouse-window" transform="translate(100, 10)">
        {/* Deep Wood Frame */}
        <rect x="0" y="0" width="54" height="48" fill="#271003" />
        <rect x="2" y="2" width="50" height="44" fill="#382110" />

        {/* Sunny Sky & Swaying Forest Treetops View */}
        <rect x="4" y="4" width="46" height="40" fill="#60a5fa" />
        <rect x="4" y="4" width="46" height="14" fill="#93c5fd" />
        <rect x="32" y="6" width="12" height="12" fill="#fef08a" opacity="0.6" /> {/* Sun Glow */}
        
        {/* Distant Rolling Hills & Lush Green Forest Canopy */}
        <rect x="4" y="20" width="46" height="24" fill="#15803d" />
        <rect x="8" y="18" width="18" height="6" fill="#16a34a" />
        <rect x="28" y="16" width="22" height="8" fill="#22c55e" />
        <rect x="4" y="30" width="46" height="14" fill="#14532d" />

        {/* Window Pane Grid Bars */}
        <rect x="26" y="4" width="2" height="40" fill="#271003" />
        <rect x="4" y="24" width="46" height="2" fill="#271003" />

        {/* Hanging Velvet Curtains on Sides */}
        <rect x="2" y="2" width="8" height="44" fill="#991b1b" />
        <rect x="4" y="4" width="4" height="40" fill="#dc2626" />
        <rect x="44" y="2" width="8" height="44" fill="#991b1b" />
        <rect x="46" y="4" width="4" height="40" fill="#dc2626" />
        {/* Curtain Ties */}
        <rect x="2" y="26" width="8" height="3" fill="#facc15" />
        <rect x="44" y="26" width="8" height="3" fill="#facc15" />

        {/* Window Sill with Succulent in Clay Pot */}
        <rect x="0" y="46" width="54" height="4" fill="#522304" />
        <rect x="20" y="40" width="8" height="6" fill="#b45309" />
        <rect x="19" y="40" width="10" height="2" fill="#d97706" />
        <rect x="22" y="34" width="4" height="6" fill="#15803d" />
        <rect x="20" y="36" width="8" height="3" fill="#22c55e" />
      </g>

      {/* LEFT SIDE: Rustic Multi-Tier Oak Bookshelf with Items */}
      <g id="treehouse-bookshelf" transform="translate(8, 12)">
        {/* Outer Frame */}
        <rect x="0" y="0" width="34" height="48" fill="#271003" />
        <rect x="2" y="2" width="30" height="44" fill="#3b1d06" />

        {/* Shelf 1 - Top: Telescope & Crystal Jar */}
        <rect x="2" y="14" width="30" height="2" fill="#522304" />
        {/* Brass Telescope on Mini Tripod */}
        <rect x="6" y="6" width="10" height="3" fill="#facc15" />
        <rect x="5" y="5" width="4" height="5" fill="#eab308" />
        <rect x="10" y="9" width="2" height="5" fill="#78350f" />
        <rect x="8" y="11" width="6" height="3" fill="#78350f" />
        {/* Glowing Crystal Orb */}
        <rect x="22" y="6" width="6" height="8" fill="#38bdf8" opacity="0.8" />
        <rect x="24" y="8" width="2" height="4" fill="#ffffff" />
        <rect x="21" y="12" width="8" height="2" fill="#d97706" />

        {/* Shelf 2 - Middle: Colorful Hardcover Books */}
        <rect x="2" y="28" width="30" height="2" fill="#522304" />
        <rect x="4" y="17" width="4" height="11" fill="#dc2626" />
        <rect x="5" y="19" width="2" height="2" fill="#facc15" />
        <rect x="9" y="18" width="3" height="10" fill="#2563eb" />
        <rect x="13" y="16" width="4" height="12" fill="#16a34a" />
        <rect x="18" y="19" width="3" height="9" fill="#d97706" />
        <rect x="22" y="17" width="4" height="11" fill="#7c3aed" />
        <rect x="27" y="20" width="3" height="8" fill="#db2777" />

        {/* Shelf 3 - Bottom: Old Scroll Map & Vintage Clock */}
        <rect x="2" y="42" width="30" height="2" fill="#522304" />
        {/* Rolled Parchment Scroll */}
        <rect x="4" y="34" width="10" height="8" fill="#fef3c7" />
        <rect x="8" y="34" width="2" height="8" fill="#b45309" />
        {/* Antique Brass Clock */}
        <rect x="18" y="32" width="10" height="10" fill="#d97706" />
        <rect x="20" y="34" width="6" height="6" fill="#fef08a" />
        <rect x="22" y="36" width="2" height="2" fill="#1e293b" />
      </g>

      {/* Polished Warm Chestnut Floorboards */}
      <rect x="0" y="66" width="160" height="34" fill="#522304" />
      <rect x="0" y="74" width="160" height="1" fill="#271003" />
      <rect x="0" y="84" width="160" height="1" fill="#271003" />
      <rect x="0" y="94" width="160" height="1" fill="#271003" />
      {/* Wood Highlights */}
      <rect x="0" y="67" width="160" height="1" fill="#78350f" opacity="0.4" />
      <rect x="0" y="75" width="160" height="1" fill="#78350f" opacity="0.4" />
      <rect x="0" y="85" width="160" height="1" fill="#78350f" opacity="0.4" />

      {/* CENTER FROG STAGE: Handwoven Mandala Rug, Cushions & Hot Cocoa */}
      <g id="treehouse-frog-stage">
        {/* Rug Shadow */}
        <rect x="46" y="72" width="68" height="16" fill="#1c0a00" opacity="0.45" />

        {/* Outer Fringe Ivory Edge */}
        <rect x="44" y="68" width="72" height="16" fill="#fef3c7" />
        <rect x="48" y="66" width="64" height="20" fill="#fef3c7" />

        {/* Terracotta Outer Ring */}
        <rect x="48" y="69" width="64" height="14" fill="#ea580c" />
        <rect x="52" y="67" width="56" height="18" fill="#ea580c" />

        {/* Mustard Gold Geometric Pattern Ring */}
        <rect x="54" y="70" width="52" height="12" fill="#facc15" />
        <rect x="58" y="68" width="44" height="16" fill="#facc15" />

        {/* Deep Forest Teal Inner Core */}
        <rect x="62" y="71" width="36" height="10" fill="#0d9488" />
        <rect x="66" y="69" width="28" height="14" fill="#0d9488" />
        <rect x="72" y="71" width="16" height="10" fill="#5eead4" />

        {/* Cozy Plaid Floor Cushion on Left */}
        <g transform="translate(38, 70)">
          <rect x="0" y="4" width="16" height="10" fill="#b91c1c" />
          <rect x="2" y="2" width="12" height="12" fill="#dc2626" />
          <rect x="4" y="4" width="8" height="8" fill="#f87171" />
          <rect x="7" y="2" width="2" height="12" fill="#facc15" opacity="0.8" />
        </g>

        {/* Mini Timber Slice Table with Steaming Cocoa Mug on Right */}
        <g transform="translate(108, 68)">
          {/* Wood Stump Pedestal */}
          <rect x="2" y="6" width="16" height="10" fill="#522304" />
          <rect x="0" y="4" width="20" height="4" fill="#78350f" />
          <rect x="2" y="4" width="16" height="2" fill="#b45309" />

          {/* Steaming Ceramic Mug */}
          <rect x="6" y="-1" width="8" height="6" fill="#0284c7" />
          <rect x="8" y="0" width="4" height="4" fill="#78350f" /> {/* Cocoa */}
          <rect x="14" y="1" width="2" height="3" fill="#0284c7" /> {/* Handle */}
          {/* Steam Wisp */}
          <rect x="9" y={animTick % 2 === 0 ? -4 : -3} width="2" height="2" fill="#ffffff" opacity="0.6" />
        </g>
      </g>
    </g>
  );
};
