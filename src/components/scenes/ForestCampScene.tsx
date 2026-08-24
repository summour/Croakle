import React from 'react';

interface SceneProps {
  animTick: number;
  fullscreen?: boolean;
}

export const ForestCampScene: React.FC<SceneProps> = ({ animTick, fullscreen }) => {
  return (
    <g id="scene-forest-camp-stardew">
      {/* ========================================================================= */}
      {/* 1. NIGHT SKY & STARLIGHT (DEEP INDIGO & TWINKLING PIXEL STARS)            */}
      {/* ========================================================================= */}
      {fullscreen ? (
        <g id="camp-sky-fullscreen">
          <rect x="0" y="-80" width="160" height="40" fill="#030712" />
          <rect x="0" y="-40" width="160" height="30" fill="#090d1a" />
          <rect x="0" y="-10" width="160" height="24" fill="#0f172a" />
          <rect x="0" y="14" width="160" height="18" fill="#131d36" />
          <rect x="0" y="32" width="160" height="14" fill="#18233f" />
        </g>
      ) : (
        <g id="camp-sky-compact">
          <rect x="0" y="0" width="160" height="14" fill="#090d1a" />
          <rect x="0" y="14" width="160" height="16" fill="#0f172a" />
          <rect x="0" y="30" width="160" height="16" fill="#18233f" />
        </g>
      )}

      {/* Moonlit Milky Way Nebula Dust */}
      <g id="camp-sky-nebula" opacity="0.3">
        <rect x="15" y={fullscreen ? -55 : 4} width="25" height="8" fill="#6366f1" />
        <rect x="40" y={fullscreen ? -40 : 12} width="35" height="10" fill="#818cf8" />
        <rect x="75" y={fullscreen ? -25 : 20} width="40" height="8" fill="#38bdf8" />
      </g>

      {/* Stardew-style Crescent Moon */}
      <g id="camp-sky-moon" transform={fullscreen ? 'translate(122, -45)' : 'translate(122, 6)'}>
        {/* Glow */}
        <rect x="-2" y="-1" width="16" height="16" fill="#fef08a" opacity="0.2" />
        <rect x="0" y="1" width="12" height="12" fill="#fef08a" opacity="0.3" />
        {/* Moon body */}
        <rect x="3" y="0" width="6" height="2" fill="#fef08a" />
        <rect x="1" y="2" width="9" height="2" fill="#fef08a" />
        <rect x="0" y="4" width="9" height="4" fill="#fef08a" />
        <rect x="1" y="8" width="9" height="2" fill="#fef08a" />
        <rect x="3" y="10" width="6" height="2" fill="#fef08a" />
        {/* Inner cutout shadow */}
        <rect x="4" y="2" width="6" height="2" fill="#090d1a" />
        <rect x="3" y="4" width="7" height="4" fill="#090d1a" />
        <rect x="4" y="8" width="6" height="2" fill="#090d1a" />
        {/* White highlight rim */}
        <rect x="0" y="4" width="2" height="4" fill="#ffffff" />
        <rect x="1" y="2" width="2" height="2" fill="#ffffff" />
      </g>

      {/* Twinkling 4-Point Pixel Stars */}
      <g id="camp-sky-stars">
        <g transform={fullscreen ? 'translate(22, -35)' : 'translate(22, 8)'}>
          <rect x="1" y="0" width="1" height="3" fill={animTick % 2 === 0 ? '#ffffff' : '#fef08a'} />
          <rect x="0" y="1" width="3" height="1" fill={animTick % 2 === 0 ? '#ffffff' : '#fef08a'} />
        </g>
        <g transform={fullscreen ? 'translate(68, -25)' : 'translate(68, 14)'}>
          <rect x="1" y="0" width="1" height="3" fill={animTick % 2 === 1 ? '#ffffff' : '#38bdf8'} />
          <rect x="0" y="1" width="3" height="1" fill={animTick % 2 === 1 ? '#ffffff' : '#38bdf8'} />
        </g>
        <g transform={fullscreen ? 'translate(98, -40)' : 'translate(98, 7)'}>
          <rect x="1" y="0" width="1" height="3" fill={animTick % 2 === 0 ? '#fde047' : '#ffffff'} />
          <rect x="0" y="1" width="3" height="1" fill={animTick % 2 === 0 ? '#fde047' : '#ffffff'} />
        </g>
        {/* Stardust dots */}
        <rect x="12" y={fullscreen ? -55 : 5} width="1" height="1" fill="#ffffff" opacity="0.8" />
        <rect x="44" y={fullscreen ? -45 : 12} width="1" height="1" fill="#fde047" opacity="0.9" />
        <rect x="84" y={fullscreen ? -50 : 16} width="1" height="1" fill="#ffffff" opacity="0.6" />
        <rect x="144" y={fullscreen ? -30 : 18} width="1" height="1" fill="#38bdf8" opacity="0.9" />
      </g>

      {/* ========================================================================= */}
      {/* 2. DISTANT SILHOUETTE MOUNTAIN RIDGES & BACKGROUND PINES                  */}
      {/* ========================================================================= */}
      <g id="camp-distant-ridges" opacity="0.75">
        {/* Mountain Peak Left */}
        <polygon points="0,46 22,24 44,46" fill="#111c33" />
        <polygon points="22,24 22,46 44,46" fill="#0d1527" />
        <polygon points="20,24 22,24 24,28 18,28" fill="#60a5fa" opacity="0.6" />

        {/* Mountain Peak Center */}
        <polygon points="36,46 72,18 108,46" fill="#14213d" />
        <polygon points="72,18 72,46 108,46" fill="#0f192e" />
        <polygon points="69,18 72,18 76,23 66,23" fill="#93c5fd" opacity="0.7" />

        {/* Mountain Peak Right */}
        <polygon points="98,46 128,26 160,46" fill="#111c33" />
        <polygon points="128,26 128,46 160,46" fill="#0d1527" />
        <polygon points="126,26 128,26 131,30 123,30" fill="#60a5fa" opacity="0.6" />
      </g>

      {/* Layer of Distant Pine Tree Silhouettes */}
      <g id="camp-mid-pines" opacity="0.85">
        {/* Cluster 1 */}
        <rect x="6" y="38" width="6" height="8" fill="#06281e" />
        <rect x="7" y="34" width="4" height="6" fill="#06281e" />
        <rect x="8" y="30" width="2" height="6" fill="#06281e" />
        {/* Cluster 2 */}
        <rect x="24" y="36" width="7" height="10" fill="#06281e" />
        <rect x="25" y="31" width="5" height="7" fill="#06281e" />
        <rect x="26" y="27" width="3" height="6" fill="#06281e" />
        {/* Cluster 3 (Behind center) */}
        <rect x="70" y="37" width="8" height="9" fill="#06281e" />
        <rect x="72" y="32" width="4" height="7" fill="#06281e" />
        <rect x="73" y="28" width="2" height="6" fill="#06281e" />
        {/* Cluster 4 */}
        <rect x="130" y="35" width="7" height="11" fill="#06281e" />
        <rect x="131" y="30" width="5" height="7" fill="#06281e" />
        <rect x="132" y="26" width="3" height="6" fill="#06281e" />
      </g>

      {/* ========================================================================= */}
      {/* 3. WIDE NATURAL STARDEW VALLEY FOREST CLEARING (GROUND LAYERS)            */}
      {/* ========================================================================= */}
      {/* Deep Forest Soil & Pine Needles */}
      <rect x="0" y="44" width="160" height="56" fill="#072317" />
      {/* Rich Grass Transition Layer */}
      <rect x="0" y="48" width="160" height="52" fill="#0a3321" />
      <rect x="0" y="56" width="160" height="44" fill="#0e402a" />
      {/* Stardew-style Stepped Pixel Grass Tops */}
      <rect x="4" y="46" width="12" height="3" fill="#14532d" />
      <rect x="22" y="46" width="16" height="3" fill="#14532d" />
      <rect x="48" y="46" width="20" height="3" fill="#14532d" />
      <rect x="78" y="46" width="24" height="3" fill="#14532d" />
      <rect x="112" y="46" width="18" height="3" fill="#14532d" />
      <rect x="138" y="46" width="18" height="3" fill="#14532d" />

      {/* Earthy Campsite Clearing Pathway (Warm Dirt Dirt / Sandstone Clearing) */}
      <g id="camp-clearing-pathway">
        {/* Base Dirt Clearing */}
        <rect x="20" y="58" width="120" height="36" fill="#1c130c" />
        <rect x="24" y="60" width="112" height="32" fill="#2d1c10" />
        <rect x="30" y="62" width="100" height="28" fill="#3f2716" />
        {/* Textured Dirt Patches & Stepping Stones */}
        <rect x="34" y="64" width="14" height="4" fill="#54351e" />
        <rect x="68" y="65" width="24" height="5" fill="#54351e" />
        <rect x="110" y="66" width="18" height="4" fill="#54351e" />
        <rect x="52" y="78" width="20" height="4" fill="#54351e" />
        <rect x="88" y="80" width="22" height="4" fill="#54351e" />
        {/* River Stepping Pebbles */}
        <rect x="44" y="68" width="5" height="3" fill="#64748b" />
        <rect x="45" y="68" width="3" height="1" fill="#94a3b8" />
        <rect x="104" y="72" width="6" height="3" fill="#64748b" />
        <rect x="105" y="72" width="4" height="1" fill="#94a3b8" />
        <rect x="38" y="82" width="6" height="3" fill="#64748b" />
      </g>

      {/* ========================================================================= */}
      {/* 4. FESTOON WARM FAIRY STRING LIGHTS (HANGING ACROSS CAMP CLEARING)        */}
      {/* ========================================================================= */}
      <g id="camp-hanging-lights">
        {/* Slack Hanging Catenary Wire */}
        <path
          d="M 12 18 Q 45 28 80 28 Q 115 28 148 18"
          stroke="#1c1917"
          strokeWidth="1"
          fill="none"
        />
        {/* Warm Amber Glowing Bulbs with Pixel Glow Halos */}
        {[
          { x: 26, y: 22 },
          { x: 50, y: 27 },
          { x: 80, y: 28 },
          { x: 110, y: 27 },
          { x: 134, y: 22 },
        ].map((bulb, i) => (
          <g key={i} transform={`translate(${bulb.x}, ${bulb.y})`}>
            {/* Glow Aura */}
            <rect
              x="-3"
              y="-1"
              width="10"
              height="10"
              fill="#fde047"
              opacity={(animTick + i) % 2 === 0 ? 0.35 : 0.18}
            />
            {/* Socket */}
            <rect x="1" y="0" width="2" height="1" fill="#78350f" />
            {/* Bulb Glass */}
            <rect x="0" y="1" width="4" height="4" fill="#fef08a" />
            <rect x="1" y="2" width="2" height="2" fill="#ffffff" />
          </g>
        ))}
      </g>

      {/* ========================================================================= */}
      {/* 5. TOWERING PINE TREES (FRAME LEFT & RIGHT)                                */}
      {/* ========================================================================= */}
      {/* Left Mighty Pine */}
      <g id="camp-pine-left" transform="translate(-4, 6)">
        {/* Trunk */}
        <rect x="14" y="44" width="8" height="28" fill="#1c0d02" />
        <rect x="16" y="44" width="4" height="28" fill="#381a05" />
        {/* Foliage Tiers */}
        {/* Top */}
        <polygon points="18,0 12,12 24,12" fill="#15803d" />
        <polygon points="18,0 18,12 24,12" fill="#0f532b" />
        {/* Mid Top */}
        <polygon points="18,8 9,22 27,22" fill="#16a34a" />
        <polygon points="18,8 18,22 27,22" fill="#14532d" />
        {/* Mid Bot */}
        <polygon points="18,18 6,34 30,34" fill="#15803d" />
        <polygon points="18,18 18,34 30,34" fill="#0f532b" />
        {/* Bottom */}
        <polygon points="18,28 3,46 33,46" fill="#14532d" />
        <polygon points="18,28 18,46 33,46" fill="#052e16" />
        {/* Moonlight Rim */}
        <line x1="18" y1="0" x2="12" y2="12" stroke="#67e8f9" strokeWidth="0.8" opacity="0.6" />
        <line x1="18" y1="8" x2="9" y2="22" stroke="#67e8f9" strokeWidth="0.8" opacity="0.6" />
      </g>

      {/* Right Mighty Pine (Illuminated by Bonfire Warmth on Inner Edge) */}
      <g id="camp-pine-right" transform="translate(132, 6)">
        {/* Trunk */}
        <rect x="14" y="44" width="8" height="28" fill="#1c0d02" />
        <rect x="16" y="44" width="4" height="28" fill="#381a05" />
        {/* Foliage Tiers */}
        <polygon points="18,0 12,12 24,12" fill="#15803d" />
        <polygon points="18,0 18,12 24,12" fill="#0f532b" />
        <polygon points="18,8 9,22 27,22" fill="#16a34a" />
        <polygon points="18,8 18,22 27,22" fill="#14532d" />
        <polygon points="18,18 6,34 30,34" fill="#15803d" />
        <polygon points="18,18 18,34 30,34" fill="#0f532b" />
        <polygon points="18,28 3,46 33,46" fill="#14532d" />
        <polygon points="18,28 18,46 33,46" fill="#052e16" />
        {/* Warm Bonfire Reflection on Left Edge */}
        <line x1="18" y1="0" x2="12" y2="12" stroke="#f59e0b" strokeWidth="0.8" opacity="0.7" />
        <line x1="18" y1="8" x2="9" y2="22" stroke="#f59e0b" strokeWidth="0.8" opacity="0.7" />
        <line x1="18" y1="18" x2="6" y2="34" stroke="#ea580c" strokeWidth="0.8" opacity="0.7" />
      </g>

      {/* ========================================================================= */}
      {/* 6. ICONIC STARDEW-STYLE CAMPING TENT (LEFT SIDE - HIGH CONTRAST & CLEAR)  */}
      {/* Warm Golden-Orange & Red Trim Canvas, Bold Dark Outlines, Glowing Entry   */}
      {/* ========================================================================= */}
      <g id="camp-stardew-tent" transform="translate(6, 28)">
        {/* Ground Shadow underneath Tent */}
        <rect x="0" y="38" width="46" height="6" fill="#051f14" opacity="0.8" />

        {/* Tent Guy-Ropes and Pegs */}
        <rect x="0" y="38" width="3" height="3" fill="#451a03" /> {/* Left Peg */}
        <rect x="42" y="38" width="3" height="3" fill="#451a03" /> {/* Right Peg */}
        <line x1="22" y1="4" x2="1" y2="39" stroke="#e2e8f0" strokeWidth="0.8" opacity="0.75" />
        <line x1="22" y1="4" x2="43" y2="39" stroke="#e2e8f0" strokeWidth="0.8" opacity="0.75" />

        {/* Outer Dark Silhouette Outline (Prevents Blending with Pine Trees) */}
        <polygon points="22,2 1,39 43,39" fill="#18181b" />

        {/* Main Canvas Roof - Vibrant Warm Autumn Canvas (Orange/Amber with Red Trim) */}
        {/* Left Slope (Highlighted by Lantern) */}
        <polygon points="22,4 3,38 22,38" fill="#f97316" />
        <polygon points="22,4 8,38 22,38" fill="#fb923c" />
        {/* Right Slope (Shaded Side) */}
        <polygon points="22,4 22,38 41,38" fill="#c2410c" />
        <polygon points="22,4 22,38 36,38" fill="#ea580c" />

        {/* A-Frame Ridge Pole Cap & Front Canopy Valence */}
        <polygon points="22,2 20,6 24,6" fill="#78350f" />
        <rect x="3" y="36" width="38" height="2" fill="#991b1b" />
        <rect x="5" y="37" width="34" height="1" fill="#dc2626" />

        {/* Glowing Cozy Tent Doorway / Interior Flaps (Stardew Style) */}
        {/* Deep Black Inner Flap opening */}
        <polygon points="22,12 11,36 33,36" fill="#1c1917" />
        {/* Radiant Warm Amber Interior Light */}
        <polygon points="22,14 13,36 31,36" fill="#fef08a" />
        <polygon points="22,17 15,36 29,36" fill="#ffffff" />

        {/* Rolled Canvas Door Flaps (Tied Back with Straps) */}
        <rect x="9" y="18" width="4" height="18" fill="#ea580c" stroke="#7c2d12" strokeWidth="0.5" />
        <rect x="10" y="24" width="2" height="2" fill="#78350f" /> {/* Tie Strap */}
        <rect x="31" y="18" width="4" height="18" fill="#9a3412" stroke="#7c2d12" strokeWidth="0.5" />
        <rect x="32" y="24" width="2" height="2" fill="#78350f" />

        {/* Cozy Plaid Rolled Sleeping Bag at Door Threshold */}
        <g transform="translate(15, 30)">
          <rect x="0" y="2" width="14" height="6" fill="#991b1b" stroke="#450a0a" strokeWidth="0.5" />
          <rect x="2" y="3" width="10" height="4" fill="#dc2626" />
          {/* Tartan lines */}
          <rect x="0" y="4" width="14" height="1" fill="#facc15" />
          <rect x="4" y="2" width="1" height="6" fill="#facc15" />
          <rect x="9" y="2" width="1" height="6" fill="#facc15" />
          {/* Leather Roll Straps & Brass Buckles */}
          <rect x="3" y="1" width="2" height="8" fill="#451a03" />
          <rect x="3" y="3" width="2" height="2" fill="#fef08a" />
          <rect x="9" y="1" width="2" height="8" fill="#451a03" />
          <rect x="9" y="3" width="2" height="2" fill="#fef08a" />
        </g>

        {/* Brass Hurricane Storm Lantern Hanging from Tent Apex */}
        <g transform="translate(20, 5)">
          {/* Hanging Loop & Cap */}
          <rect x="1" y="0" width="2" height="2" fill="#451a03" />
          <rect x="0" y="2" width="4" height="2" fill="#b45309" />
          {/* Glowing Glass Globe */}
          <rect x="0" y="4" width="4" height="4" fill="#fef08a" stroke="#78350f" strokeWidth="0.4" />
          <rect x="1" y="5" width="2" height="2" fill="#ffffff" />
          {/* Brass Base */}
          <rect x="0" y="8" width="4" height="2" fill="#92400e" />
          {/* Pulsing Lantern Glow Cast */}
          <rect
            x="-4"
            y="1"
            width="12"
            height="12"
            fill="#fde047"
            opacity={animTick % 2 === 0 ? 0.4 : 0.22}
          />
        </g>

        {/* Vintage Steel Red Camping Cooler Box (Beside Tent) */}
        <g transform="translate(38, 28)">
          <rect x="0" y="3" width="13" height="9" fill="#991b1b" stroke="#18181b" strokeWidth="0.5" />
          <rect x="1" y="4" width="11" height="7" fill="#dc2626" />
          <rect x="0" y="1" width="13" height="3" fill="#f8fafc" stroke="#18181b" strokeWidth="0.5" />
          <rect x="1" y="2" width="11" height="1" fill="#e2e8f0" />
          {/* Front Chrome Latch & Side Handles */}
          <rect x="5" y="4" width="3" height="3" fill="#cbd5e1" />
          <rect x="-1" y="5" width="2" height="4" fill="#64748b" />
          <rect x="12" y="5" width="2" height="4" fill="#64748b" />
        </g>
      </g>

      {/* Wooden Trail Signpost ("◀ CAMP") */}
      <g transform="translate(3, 44)">
        <rect x="3" y="4" width="2" height="18" fill="#451a03" />
        <rect x="0" y="0" width="12" height="6" fill="#78350f" stroke="#271003" strokeWidth="0.5" />
        <rect x="1" y="1" width="10" height="4" fill="#b45309" />
        <rect x="2" y="2.5" width="2" height="1.5" fill="#fef08a" /> {/* Arrow */}
        <rect x="5" y="2.5" width="5" height="1.5" fill="#fde68a" /> {/* Text */}
      </g>

      {/* ========================================================================= */}
      {/* 7. CRACKLING STARDEW BONFIRE & COOKING POT (RIGHT SIDE - LIVELY & VIVID)  */}
      {/* ========================================================================= */}
      <g id="camp-stardew-bonfire" transform="translate(112, 38)">
        {/* River Stone Ring Pit */}
        <ellipse cx="20" cy="24" rx="18" ry="7" fill="#0f172a" />
        <ellipse cx="20" cy="23" rx="16" ry="6" fill="#334155" stroke="#1e293b" strokeWidth="0.5" />
        {/* Individual Round Boulder Highlights */}
        <circle cx="6" cy="23" r="3" fill="#475569" />
        <circle cx="13" cy="26" r="3" fill="#64748b" />
        <circle cx="20" cy="27" r="3" fill="#475569" />
        <circle cx="28" cy="26" r="3" fill="#64748b" />
        <circle cx="34" cy="23" r="3" fill="#475569" />
        <circle cx="27" cy="20" r="2.5" fill="#334155" />
        <circle cx="12" cy="20" r="2.5" fill="#334155" />

        {/* Glowing Charcoal Fire Bed */}
        <ellipse cx="20" cy="22" rx="12" ry="4" fill="#7c2d12" />
        <ellipse cx="20" cy="22" rx="9" ry="3" fill="#ea580c" />
        <ellipse cx="20" cy="22" rx="6" ry="2" fill="#facc15" />

        {/* Criss-Cross Birch Wood Fire Logs */}
        <line x1="8" y1="23" x2="32" y2="19" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="8" y1="19" x2="32" y2="23" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="12" y1="21" x2="28" y2="21" stroke="#b45309" strokeWidth="2" />

        {/* Animated Dancing Pixel Flames */}
        {animTick % 2 === 0 ? (
          <g id="bonfire-flame-a">
            {/* Outer Orange Body */}
            <polygon points="20,0 12,12 28,12" fill="#ea580c" />
            <polygon points="15,6 9,18 21,18" fill="#f97316" />
            <polygon points="25,5 19,18 31,18" fill="#ea580c" />
            {/* Yellow Inner Core */}
            <polygon points="20,4 14,14 26,14" fill="#facc15" />
            <polygon points="20,8 16,17 24,17" fill="#fef08a" />
            {/* White-Hot Center */}
            <polygon points="20,11 18,17 22,17" fill="#ffffff" />
            {/* Floating Sparks */}
            <rect x="21" y="-5" width="1.5" height="1.5" fill="#fef08a" />
            <rect x="15" y="-2" width="1.5" height="1.5" fill="#f97316" />
            <rect x="28" y="2" width="1.5" height="1.5" fill="#ea580c" />
          </g>
        ) : (
          <g id="bonfire-flame-b">
            {/* Taller Dynamic Flame */}
            <polygon points="19,-3 11,12 29,12" fill="#ea580c" />
            <polygon points="23,3 17,16 31,16" fill="#f97316" />
            <polygon points="14,4 8,16 22,16" fill="#ea580c" />
            {/* Yellow Core */}
            <polygon points="20,2 14,13 26,13" fill="#facc15" />
            <polygon points="19,6 15,16 25,16" fill="#fef08a" />
            {/* White-Hot Core */}
            <polygon points="19,9 17,16 22,16" fill="#ffffff" />
            {/* Floating Sparks */}
            <rect x="19" y="-6" width="1.5" height="1.5" fill="#ffffff" />
            <rect x="26" y="-3" width="1.5" height="1.5" fill="#fef08a" />
            <rect x="12" y="0" width="1.5" height="1.5" fill="#f97316" />
          </g>
        )}

        {/* Ambient Ground Glow from Fire */}
        <ellipse cx="20" cy="24" rx="26" ry="10" fill="#f97316" opacity="0.2" />

        {/* Roasting Marshmallow on Whittled Stick */}
        <g transform="translate(18, 6)">
          <line x1="22" y1="-2" x2="2" y2="12" stroke="#78350f" strokeWidth="1.2" strokeLinecap="round" />
          {/* Puffy Toasted Marshmallow */}
          <rect x="4" y="8" width="5" height="4" fill="#fef08a" stroke="#b45309" strokeWidth="0.4" rx="0.5" />
          <rect x="5" y="9" width="3" height="2" fill="#ea580c" />
          <rect x="5" y="8" width="1" height="1" fill="#ffffff" />
        </g>

        {/* Cast Iron Tripod & Camp Stew Dutch Oven */}
        <g transform="translate(6, 4)">
          {/* Tripod Legs */}
          <line x1="14" y1="2" x2="6" y2="20" stroke="#18181b" strokeWidth="1" />
          <line x1="14" y1="2" x2="22" y2="20" stroke="#18181b" strokeWidth="1" />
          <line x1="14" y1="2" x2="14" y2="9" stroke="#52525b" strokeWidth="0.8" /> {/* Chain */}
          {/* Black Iron Kettle Pot */}
          <rect x="10" y="9" width="8" height="7" fill="#18181b" rx="1" />
          <rect x="11" y="10" width="6" height="5" fill="#27272a" />
          <rect x="9" y="9" width="10" height="2" fill="#3f3f46" />
          {/* Rising Steam */}
          <rect
            x="13"
            y={5 - (animTick % 2 === 0 ? 0 : 2)}
            width="2"
            height="2"
            fill="#ffffff"
            opacity="0.75"
          />
        </g>

        {/* Stack of Chopped Firewood & Axe */}
        <g transform="translate(36, 16)">
          <rect x="0" y="4" width="8" height="4" fill="#f8fafc" stroke="#334155" strokeWidth="0.5" />
          <circle cx="0" cy="6" r="2" fill="#b45309" />
          <rect x="6" y="6" width="8" height="4" fill="#f8fafc" stroke="#334155" strokeWidth="0.5" />
          <circle cx="6" cy="8" r="2" fill="#b45309" />
          {/* Hand Axe in Stump */}
          <rect x="3" y="-2" width="2" height="8" fill="#78350f" />
          <polygon points="1,-4 6,-4 5,-1 2,-1" fill="#94a3b8" />
        </g>
      </g>

      {/* ========================================================================= */}
      {/* 8. CENTER STAGE: RUSTIC WOODEN PICNIC DECK & WOOL BLANKET (CLEAR MAT)     */}
      {/* Designed to clearly look like a cozy campsite wooden platform + woven mat  */}
      {/* ========================================================================= */}
      <g id="camp-stardew-mat-stage">
        {/* Soft Warm Hearth Firelight Reflection */}
        <ellipse cx="80" cy="71" rx="38" ry="12" fill="#ea580c" opacity="0.18" />

        {/* 1. Stardew-Style Rustic Pine Timber Plank Deck (Natural Wood Foundation) */}
        <g id="deck-foundation">
          {/* Base Deck Drop Shadow on Ground */}
          <rect x="46" y="68" width="68" height="9" fill="#0c1810" opacity="0.75" rx="1" />
          {/* Wood Deck Frame */}
          <rect x="48" y="65" width="64" height="11" fill="#2e1405" stroke="#1c0d02" strokeWidth="0.5" />
          {/* Planks Top (Horizontal Stardew Timber Lines) */}
          <rect x="49" y="66" width="62" height="3" fill="#603414" />
          <rect x="50" y="66" width="60" height="2" fill="#7c461d" />
          <rect x="49" y="70" width="62" height="3" fill="#502b0f" />
          <rect x="50" y="70" width="60" height="2" fill="#693b16" />
          <rect x="49" y="73" width="62" height="2" fill="#3d1f0a" />
          {/* Timber Seam Lines & Iron Nails */}
          <line x1="49" y1="69.5" x2="111" y2="69.5" stroke="#1c0d02" strokeWidth="0.6" />
          <line x1="49" y1="73" x2="111" y2="73" stroke="#1c0d02" strokeWidth="0.6" />
          <rect x="52" y="67" width="1" height="1" fill="#18181b" />
          <rect x="107" y="67" width="1" height="1" fill="#18181b" />
          <rect x="52" y="71" width="1" height="1" fill="#18181b" />
          <rect x="107" y="71" width="1" height="1" fill="#18181b" />
        </g>

        {/* 2. Cozy Wool Picnic Blanket (ชัดเจนว่าเป็นผืนพรมปิกนิก/เสื่อ ลายสก็อต พร้อมชายครุย) */}
        <g id="picnic-blanket" transform="translate(54, 66)">
          {/* Blanket Drop Shadow on Wood Deck */}
          <rect x="1" y="1" width="51" height="8" fill="#1c0d02" opacity="0.6" />
          {/* Blanket Main Body - Warm Stardew Crimson / Burgundy Wool */}
          <rect x="0" y="0" width="52" height="7" fill="#881337" stroke="#4c0519" strokeWidth="0.5" />
          <rect x="1" y="1" width="50" height="5" fill="#be123c" />
          <rect x="2" y="1" width="48" height="2" fill="#e11d48" />

          {/* Tartan Plaid Pattern Lines (Gold & Emerald) */}
          {/* Horizontal Lines */}
          <line x1="1" y1="2.5" x2="51" y2="2.5" stroke="#facc15" strokeWidth="0.6" />
          <line x1="1" y1="4.5" x2="51" y2="4.5" stroke="#10b981" strokeWidth="0.6" />
          {/* Vertical Lines */}
          <line x1="10" y1="0.5" x2="10" y2="6.5" stroke="#facc15" strokeWidth="0.8" />
          <line x1="22" y1="0.5" x2="22" y2="6.5" stroke="#10b981" strokeWidth="0.8" />
          <line x1="34" y1="0.5" x2="34" y2="6.5" stroke="#facc15" strokeWidth="0.8" />
          <line x1="44" y1="0.5" x2="44" y2="6.5" stroke="#10b981" strokeWidth="0.8" />

          {/* Golden Corner Fringe Tassels on Left & Right Ends */}
          <rect x="-2" y="1" width="2" height="1" fill="#fef08a" />
          <rect x="-2" y="3" width="2" height="1" fill="#fef08a" />
          <rect x="-2" y="5" width="2" height="1" fill="#fef08a" />
          <rect x="52" y="1" width="2" height="1" fill="#fef08a" />
          <rect x="52" y="3" width="2" height="1" fill="#fef08a" />
          <rect x="52" y="5" width="2" height="1" fill="#fef08a" />
        </g>

        {/* Small Decorative Camping Detail beside Blanket: Enameled Coffee Mug & Scented Candle */}
        <g transform="translate(48, 64)">
          {/* Blue Enamel Mug */}
          <rect x="0" y="1" width="4" height="4" fill="#0284c7" stroke="#082f49" strokeWidth="0.3" />
          <rect x="1" y="2" width="2" height="2" fill="#38bdf8" />
          <rect x="4" y="2" width="1.5" height="2" fill="#0284c7" /> {/* Handle */}
          <rect x="1" y="1" width="2" height="1" fill="#451a03" /> {/* Coffee */}
        </g>
        <g transform="translate(108, 64)">
          {/* Small Mason Jar Tea Candle */}
          <rect x="0" y="1" width="3" height="4" fill="#bae6fd" opacity="0.8" stroke="#0369a1" strokeWidth="0.3" />
          <rect x="1" y="2" width="1" height="2" fill="#fef08a" />
          <rect x="1" y="0.5" width="1" height="1" fill="#ffffff" />
        </g>
      </g>

      {/* ========================================================================= */}
      {/* 9. NATURE TOUCHES: MUSHROOMS, FERNS & GLOWING FOREST FIREFLIES            */}
      {/* ========================================================================= */}
      {/* Stardew Red Spotted Fly Agaric Mushrooms */}
      <g id="camp-mushrooms-left" transform="translate(18, 66)">
        <ellipse cx="5" cy="2" rx="5" ry="3" fill="#dc2626" stroke="#7f1d1d" strokeWidth="0.4" />
        <circle cx="3" cy="1.5" r="0.8" fill="#ffffff" />
        <circle cx="7" cy="1.5" r="0.8" fill="#ffffff" />
        <rect x="3.5" y="3" width="3" height="4" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.3" />
      </g>

      {/* Luminescent Blue Stardew Fairy Mushrooms */}
      <g id="camp-mushrooms-right" transform="translate(138, 66)">
        <ellipse cx="4" cy="2" rx="4" ry="2.5" fill="#38bdf8" stroke="#0369a1" strokeWidth="0.4" />
        <circle cx="3" cy="1.5" r="0.7" fill="#ffffff" />
        <rect x="2.5" y="3" width="3" height="3" fill="#e0f2fe" stroke="#60a5fa" strokeWidth="0.3" />
        {/* Glow halo */}
        <circle cx="4" cy="2" r="6" fill="#38bdf8" opacity={animTick % 2 === 0 ? 0.3 : 0.1} />
      </g>

      {/* Forest Fern Bush */}
      <g transform="translate(2, 60)" fill="#15803d">
        <polygon points="0,8 6,2 8,8" />
        <polygon points="5,8 11,0 13,8" />
        <polygon points="10,8 15,3 17,8" />
        <polygon points="6,6 11,1 12,6" fill="#22c55e" />
      </g>
      <g transform="translate(142, 60)" fill="#15803d">
        <polygon points="0,8 3,3 7,8" />
        <polygon points="4,8 7,0 12,8" />
        <polygon points="9,8 13,2 17,8" />
        <polygon points="5,6 8,1 11,6" fill="#22c55e" />
      </g>

      {/* Glowing Animated Stardew Fireflies (Blinking Yellow & Green) */}
      <g id="camp-fireflies">
        {/* Firefly 1 */}
        <g transform="translate(28, 48)">
          <rect x="0" y="0" width="2" height="2" fill="#a3e635" />
          <rect
            x="-1"
            y="-1"
            width="4"
            height="4"
            fill="#84cc16"
            opacity={animTick % 2 === 0 ? 0.6 : 0.2}
          />
        </g>
        {/* Firefly 2 */}
        <g transform="translate(62, 52)">
          <rect x="0" y="0" width="2" height="2" fill="#fde047" />
          <rect
            x="-1"
            y="-1"
            width="4"
            height="4"
            fill="#facc15"
            opacity={animTick % 2 === 1 ? 0.6 : 0.2}
          />
        </g>
        {/* Firefly 3 */}
        <g transform="translate(98, 44)">
          <rect x="0" y="0" width="2" height="2" fill="#a3e635" />
          <rect
            x="-1"
            y="-1"
            width="4"
            height="4"
            fill="#84cc16"
            opacity={animTick % 2 === 0 ? 0.6 : 0.2}
          />
        </g>
        {/* Firefly 4 */}
        <g transform="translate(144, 52)">
          <rect x="0" y="0" width="2" height="2" fill="#fde047" />
          <rect
            x="-1"
            y="-1"
            width="4"
            height="4"
            fill="#facc15"
            opacity={animTick % 2 === 1 ? 0.6 : 0.2}
          />
        </g>
      </g>
    </g>
  );
};
