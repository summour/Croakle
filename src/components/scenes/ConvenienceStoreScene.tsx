import React from 'react';

interface SceneProps {
  animTick: number;
  fullscreen?: boolean;
}

export const ConvenienceStoreScene: React.FC<SceneProps> = ({ animTick, fullscreen }) => {
  return (
    <g id="scene-convenience-store">
      {/* 24-Hour Bright Japanese Konbini Interior Walls with Clean Tiles */}
      {fullscreen ? (
        <g>
          <rect x="0" y="-80" width="160" height="142" fill="#f8fafc" />
          <rect x="0" y="-40" width="160" height="1" fill="#e2e8f0" />
          <rect x="0" y="0" width="160" height="1" fill="#e2e8f0" />
        </g>
      ) : (
        <rect x="0" y="0" width="160" height="62" fill="#f8fafc" />
      )}

      {/* Ceiling Fluorescent Light Troffers (Bright Crisp Lighting) */}
      <g id="konbini-lights">
        <rect x="18" y="0" width="36" height="4" fill="#ffffff" />
        <rect x="18" y="0" width="36" height="1" fill="#cbd5e1" />
        <rect x="18" y="3" width="36" height="1" fill="#cbd5e1" />
        <rect x="20" y="1" width="32" height="2" fill="#38bdf8" opacity="0.4" />

        <rect x="62" y="0" width="36" height="4" fill="#ffffff" />
        <rect x="62" y="0" width="36" height="1" fill="#cbd5e1" />
        <rect x="62" y="3" width="36" height="1" fill="#cbd5e1" />
        <rect x="64" y="1" width="32" height="2" fill="#38bdf8" opacity="0.4" />

        <rect x="106" y="0" width="36" height="4" fill="#ffffff" />
        <rect x="106" y="0" width="36" height="1" fill="#cbd5e1" />
        <rect x="106" y="3" width="36" height="1" fill="#cbd5e1" />
        <rect x="108" y="1" width="32" height="2" fill="#38bdf8" opacity="0.4" />
      </g>

      {/* Modern Japanese Konbini Sign Header (7-Mart Stripe Motif) */}
      <g id="konbini-stripe-header" transform="translate(0, 4)">
        <rect x="0" y="0" width="160" height="3" fill="#ea580c" />
        <rect x="0" y="3" width="160" height="3" fill="#16a34a" />
        <rect x="0" y="6" width="160" height="2" fill="#dc2626" />
      </g>

      {/* LEFT SIDE: Glass Chilled Drink Refrigerator (Rows of Sodas, Milks, Teas) */}
      <g id="drink-refrigerator" transform="translate(6, 14)">
        {/* Refrigerator Stainless Outer Frame */}
        <rect x="0" y="0" width="42" height="50" fill="#334155" />
        <rect x="2" y="2" width="38" height="46" fill="#0f172a" />
        {/* Interior LED Backlight */}
        <rect x="3" y="3" width="36" height="44" fill="#0284c7" opacity="0.3" />

        {/* Shelf 1 (Top): Japanese Bottled Teas & Canned Coffees */}
        <rect x="3" y="14" width="36" height="2" fill="#64748b" />
        <rect x="6" y="6" width="4" height="8" fill="#16a34a" /> {/* Green Tea */}
        <rect x="12" y="6" width="4" height="8" fill="#d97706" /> {/* Barley Tea */}
        <rect x="18" y="6" width="4" height="8" fill="#b91c1c" /> {/* Boss Coffee */}
        <rect x="24" y="6" width="4" height="8" fill="#3b82f6" /> {/* Calpis Soda */}
        <rect x="30" y="6" width="4" height="8" fill="#ec4899" /> {/* Strawberry Milk */}

        {/* Shelf 2 (Middle): Melon Soda & Ramune */}
        <rect x="3" y="28" width="36" height="2" fill="#64748b" />
        <rect x="6" y="18" width="4" height="10" fill="#22c55e" /> {/* Melon Soda */}
        <rect x="12" y="18" width="4" height="10" fill="#06b6d4" /> {/* Ramune */}
        <rect x="18" y="18" width="4" height="10" fill="#eab308" /> {/* Lemon Tea */}
        <rect x="24" y="18" width="4" height="10" fill="#a855f7" /> {/* Grape Fanta */}
        <rect x="30" y="18" width="4" height="10" fill="#f97316" /> {/* Orange Juice */}

        {/* Shelf 3 (Bottom): Milk Cartons & Energy Drinks */}
        <rect x="3" y="42" width="36" height="2" fill="#64748b" />
        <rect x="6" y="32" width="5" height="10" fill="#ffffff" /> {/* Milk Carton */}
        <rect x="13" y="32" width="5" height="10" fill="#f43f5e" /> {/* Choco Milk */}
        <rect x="20" y="32" width="5" height="10" fill="#10b981" /> {/* Matcha Milk */}
        <rect x="27" y="32" width="4" height="10" fill="#0284c7" /> {/* Pocari Sweat */}

        {/* Stepped Pixel Glass Reflection Highlights */}
        <g opacity="0.35" fill="#ffffff">
          <rect x="6" y="4" width="4" height="2" />
          <rect x="10" y="8" width="4" height="2" />
          <rect x="14" y="12" width="4" height="2" />
          <rect x="18" y="18" width="4" height="2" />
          <rect x="22" y="24" width="4" height="2" />
          <rect x="26" y="30" width="4" height="2" />
          <rect x="30" y="36" width="4" height="2" />
          <rect x="34" y="42" width="4" height="2" />
        </g>
      </g>

      {/* RIGHT SIDE: Steaming Hot Oden Broth Warmer & Steamed Bun (Nikuman) Display */}
      <g id="hot-food-warmer" transform="translate(114, 16)">
        {/* Stainless Steel Oden Unit */}
        <rect x="0" y="0" width="40" height="48" fill="#475569" />
        <rect x="2" y="2" width="36" height="44" fill="#64748b" />

        {/* Top: Steamed Bun Warmer (Nikuman / Anman) */}
        <rect x="2" y="2" width="36" height="18" fill="#38bdf8" opacity="0.25" />
        <rect x="2" y="2" width="36" height="1" fill="#ffffff" opacity="0.6" />
        {/* Fluffy White Steamed Buns on Metal Grates (Stepped Pixel Buns) */}
        {/* Nikuman (White) */}
        <g transform="translate(6, 8)">
          <rect x="2" y="0" width="4" height="2" fill="#ffffff" />
          <rect x="0" y="2" width="8" height="6" fill="#ffffff" />
          <rect x="1" y="8" width="6" height="1" fill="#e2e8f0" />
        </g>
        {/* Curryman (Yellow) */}
        <g transform="translate(16, 8)">
          <rect x="2" y="0" width="4" height="2" fill="#fef08a" />
          <rect x="0" y="2" width="8" height="6" fill="#fef08a" />
          <rect x="1" y="8" width="6" height="1" fill="#fde047" />
        </g>
        {/* Peach Bun (Pink) */}
        <g transform="translate(26, 8)">
          <rect x="2" y="0" width="4" height="2" fill="#fbcfe8" />
          <rect x="0" y="2" width="8" height="6" fill="#fbcfe8" />
          <rect x="1" y="8" width="6" height="1" fill="#f472b6" />
        </g>

        {/* Bottom: 6-Compartment Simmering Oden Broth Pot */}
        <rect x="2" y="22" width="36" height="24" fill="#334155" />
        <rect x="4" y="24" width="32" height="20" fill="#b45309" /> {/* Dashi Broth */}
        {/* Compartment Metal Dividers */}
        <rect x="14" y="24" width="1" height="20" fill="#94a3b8" />
        <rect x="25" y="24" width="1" height="20" fill="#94a3b8" />
        <rect x="4" y="34" width="32" height="1" fill="#94a3b8" />

        {/* Oden Ingredients Floating in Broth (Pure Pixel Shapes) */}
        {/* Daikon Radish (Stepped Round Cut) */}
        <g transform="translate(6, 26)">
          <rect x="1" y="0" width="6" height="1" fill="#fef08a" />
          <rect x="0" y="1" width="8" height="5" fill="#fef08a" />
          <rect x="1" y="6" width="6" height="1" fill="#fde047" />
        </g>
        {/* Konjac Triangle (Stepped Pixel Triangle) */}
        <g transform="translate(17, 26)">
          <rect x="0" y="0" width="2" height="7" fill="#78350f" />
          <rect x="2" y="1" width="2" height="5" fill="#78350f" />
          <rect x="4" y="2" width="2" height="3" fill="#78350f" />
        </g>
        {/* Tamago Boiled Egg (Stepped Pixel Egg) */}
        <g transform="translate(27, 26)">
          <rect x="1" y="0" width="5" height="1" fill="#fde047" />
          <rect x="0" y="1" width="7" height="5" fill="#fde047" />
          <rect x="1" y="6" width="5" height="1" fill="#ca8a04" />
        </g>

        {/* Chikuwa Tube & Tofu & Hanpen */}
        <rect x="6" y="37" width="6" height="4" fill="#ea580c" />
        <rect x="8" y="38" width="2" height="2" fill="#78350f" />
        <rect x="17" y="37" width="5" height="5" fill="#ca8a04" />
        <rect x="27" y="36" width="6" height="6" fill="#f97316" />

        {/* Steaming Vapor Wisp */}
        <rect x="18" y={animTick % 2 === 0 ? 20 : 19} width="2" height="2" fill="#ffffff" opacity="0.7" />
      </g>

      {/* Spotless Pristine Linoleum Tile Floor */}
      <rect x="0" y="60" width="160" height="40" fill="#e2e8f0" />
      <rect x="0" y="62" width="160" height="38" fill="#f1f5f9" />
      {/* Tile Grid Lines */}
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={i * 20} y="62" width="1" height="38" fill="#cbd5e1" />
      ))}
      <rect x="0" y="74" width="160" height="1" fill="#cbd5e1" />
      <rect x="0" y="86" width="160" height="1" fill="#cbd5e1" />

      {/* CENTER FROG STAGE: Konbini Checkout Counter with Fresh Onigiri & Bento */}
      <g id="konbini-frog-stage">
        {/* Cashier Counter Top Platform */}
        <rect x="46" y="64" width="68" height="16" fill="#cbd5e1" />
        <rect x="48" y="62" width="64" height="16" fill="#e2e8f0" />
        <rect x="50" y="62" width="60" height="4" fill="#ffffff" />

        {/* Classic Triangular Salmon Onigiri Rice Ball (Stepped Pixel Triangle) */}
        <g transform="translate(48, 54)">
          {/* White Rice Steps */}
          <rect x="4" y="0" width="4" height="2" fill="#ffffff" />
          <rect x="2" y="2" width="8" height="3" fill="#ffffff" />
          <rect x="0" y="5" width="12" height="5" fill="#ffffff" />
          {/* Black Nori Seaweed Wrap */}
          <rect x="3" y="6" width="6" height="4" fill="#18181b" />
          {/* Salmon Fleck on Top */}
          <rect x="5" y="1" width="2" height="1" fill="#f43f5e" />
        </g>

        {/* Japanese Makunouchi Bento Box on Right */}
        <g transform="translate(100, 56)">
          <rect x="0" y="0" width="14" height="12" fill="#18181b" />
          <rect x="1" y="1" width="12" height="10" fill="#dc2626" /> {/* Red lacquer tray */}
          {/* Rice Section with Pickled Umeboshi Plum */}
          <rect x="2" y="2" width="5" height="8" fill="#ffffff" />
          <rect x="4" y="4" width="2" height="2" fill="#be123c" />
          {/* Karaage Crispy Chicken */}
          <rect x="8" y="2" width="4" height="4" fill="#b45309" />
          {/* Tamagoyaki Rolled Omelette */}
          <rect x="8" y="7" width="4" height="3" fill="#facc15" />
        </g>
      </g>
    </g>
  );
};

