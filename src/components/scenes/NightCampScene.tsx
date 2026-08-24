import React from 'react';

interface SceneProps {
  animTick: number;
  fullscreen?: boolean;
}

export const NightCampScene: React.FC<SceneProps> = ({ animTick, fullscreen }) => {
  return (
    <g id="scene-night-camp">
      {/* Deep Celestial Night Sky with Stepped Gradient Bands */}
      {fullscreen ? (
        <g>
          <rect x="0" y="-80" width="160" height="136" fill="#020617" />
          <rect x="0" y="-20" width="160" height="40" fill="#0f172a" />
          <rect x="0" y="20" width="160" height="36" fill="#1e1b4b" />
        </g>
      ) : (
        <g>
          <rect x="0" y="0" width="160" height="20" fill="#020617" />
          <rect x="0" y="20" width="160" height="20" fill="#0f172a" />
          <rect x="0" y="40" width="160" height="16" fill="#1e1b4b" />
        </g>
      )}

      {/* Layer 1: Twinkling 4-Point Stars, Crescent Moon & Shooting Star */}
      <g id="night-stars">
        {/* Glowing Crescent Moon */}
        <g transform="translate(130, 8)">
          <rect x="4" y="0" width="6" height="2" fill="#fef08a" />
          <rect x="2" y="2" width="8" height="2" fill="#fef08a" />
          <rect x="0" y="4" width="8" height="6" fill="#fef08a" />
          <rect x="2" y="10" width="8" height="2" fill="#fef08a" />
          <rect x="4" y="12" width="6" height="2" fill="#fef08a" />
          {/* Inner cutout */}
          <rect x="5" y="2" width="5" height="2" fill="#020617" />
          <rect x="4" y="4" width="6" height="6" fill="#020617" />
          <rect x="5" y="10" width="5" height="2" fill="#020617" />
          <rect x="2" y="5" width="2" height="4" fill="#ffffff" />
        </g>

        {/* Twinkling 4-Point Pixel Stars */}
        <g transform="translate(24, 10)" opacity={animTick % 2 === 0 ? 0.95 : 0.4}>
          <rect x="1" y="0" width="1" height="3" fill="#fef08a" />
          <rect x="0" y="1" width="3" height="1" fill="#fef08a" />
        </g>
        <g transform="translate(68, 8)" opacity={animTick % 3 === 0 ? 0.95 : 0.35}>
          <rect x="1" y="0" width="1" height="3" fill="#ffffff" />
          <rect x="0" y="1" width="3" height="1" fill="#ffffff" />
        </g>
        <g transform="translate(104, 14)" opacity={animTick % 2 === 1 ? 0.9 : 0.4}>
          <rect x="1" y="0" width="1" height="3" fill="#38bdf8" />
          <rect x="0" y="1" width="3" height="1" fill="#38bdf8" />
        </g>
        {/* Shooting Star Streak */}
        <rect x="80" y="4" width="8" height="1" fill="#ffffff" opacity="0.6" />
        <rect x="88" y="5" width="6" height="1" fill="#bae6fd" opacity="0.4" />
      </g>

      {/* Layer 2: Distant Pine Silhouettes & Mountains */}
      <g id="night-pines" opacity="0.7">
        <rect x="4" y="30" width="22" height="26" fill="#030712" />
        <rect x="8" y="22" width="14" height="10" fill="#030712" />
        <rect x="12" y="16" width="6" height="8" fill="#030712" />

        <rect x="134" y="28" width="22" height="28" fill="#030712" />
        <rect x="138" y="20" width="14" height="10" fill="#030712" />
        <rect x="142" y="14" width="6" height="8" fill="#030712" />
      </g>

      {/* Layer 3: Festive String Lights & Bunting Flags */}
      <g id="camp-string-lights">
        {/* Rope Wire */}
        <rect x="16" y="26" width="128" height="1" fill="#78350f" />
        {/* Bulbs & Flags */}
        <rect x="28" y="27" width="3" height="3" fill="#fef08a" />
        <rect x="46" y="27" width="4" height="4" fill="#ef4444" />
        <rect x="64" y="27" width="3" height="3" fill="#38bdf8" />
        <rect x="82" y="27" width="4" height="4" fill="#facc15" />
        <rect x="100" y="27" width="3" height="3" fill="#22c55e" />
        <rect x="118" y="27" width="4" height="4" fill="#ec4899" />
      </g>

      {/* Layer 4: Left Cozy A-Frame Canvas Tent with Lantern Light */}
      <g id="night-camp-tent" transform="translate(6, 26)">
        {/* Tent Body */}
        <rect x="4" y="6" width="38" height="26" fill="#0369a1" />
        <rect x="8" y="2" width="30" height="6" fill="#0284c7" />
        <rect x="14" y="0" width="18" height="3" fill="#38bdf8" />

        {/* Warm Glowing Tent Opening */}
        <rect x="12" y="10" width="22" height="22" fill="#fef08a" />
        <rect x="14" y="12" width="18" height="20" fill="#fef3c7" />
        {/* Rolled Canvas Flaps */}
        <rect x="8" y="10" width="4" height="22" fill="#075985" />
        <rect x="34" y="10" width="4" height="22" fill="#075985" />

        {/* Sleeping Bag Inside Tent */}
        <rect x="16" y="24" width="14" height="6" fill="#dc2626" />
        <rect x="18" y="25" width="10" height="4" fill="#ef4444" />
      </g>

      {/* Layer 5: Right Riverstone Campfire with Cast Iron Dutch Oven Kettle */}
      <g id="night-bonfire" transform="translate(112, 38)">
        {/* Stone Fire Ring */}
        <rect x="0" y="18" width="34" height="8" fill="#334155" />
        <rect x="2" y="19" width="30" height="6" fill="#475569" />
        <rect x="6" y="16" width="22" height="4" fill="#78350f" /> {/* Firewood */}

        {/* Crackling Pixel Flames */}
        {animTick % 2 === 0 ? (
          <g>
            <rect x="12" y="6" width="8" height="12" fill="#ea580c" />
            <rect x="14" y="4" width="4" height="12" fill="#facc15" />
            <rect x="15" y="8" width="2" height="6" fill="#ffffff" />
            <rect x="18" y="2" width="2" height="2" fill="#fde047" /> {/* Spark */}
          </g>
        ) : (
          <g>
            <rect x="10" y="4" width="10" height="14" fill="#ea580c" />
            <rect x="13" y="2" width="6" height="12" fill="#facc15" />
            <rect x="14" y="6" width="3" height="7" fill="#ffffff" />
            <rect x="11" y="1" width="2" height="2" fill="#fde047" /> {/* Spark */}
          </g>
        )}

        {/* Iron Tripod & Dutch Oven Pot */}
        <rect x="4" y="4" width="2" height="18" fill="#18181b" />
        <rect x="26" y="4" width="2" height="18" fill="#18181b" />
        <rect x="4" y="4" width="24" height="2" fill="#18181b" />
        {/* Kettle Pot */}
        <rect x="11" y="8" width="10" height="8" fill="#09090b" />
        <rect x="13" y="6" width="6" height="2" fill="#3f3f46" />
        <rect x="14" y={animTick % 2 === 0 ? 3 : 4} width="2" height="2" fill="#ffffff" opacity="0.6" />
      </g>

      {/* Layer 6: Forest Floor & Timber Decking */}
      <rect x="0" y="56" width="160" height="44" fill="#0f172a" />
      <rect x="0" y="62" width="160" height="38" fill="#020617" />

      {/* CENTER FROG STAGE: Cozy Plaid Camp Mat & Acoustic Guitar */}
      <g id="night-camp-frog-stage">
        {/* Red Tartan Plaid Ground Blanket */}
        <rect x="48" y="66" width="64" height="18" fill="#991b1b" />
        <rect x="50" y="65" width="60" height="18" fill="#b91c1c" />
        <rect x="52" y="64" width="56" height="18" fill="#dc2626" />
        {/* Yellow Plaid Stripe Accents */}
        <rect x="52" y="70" width="56" height="2" fill="#facc15" opacity="0.8" />
        <rect x="74" y="64" width="2" height="18" fill="#facc15" opacity="0.8" />

        {/* Acoustic Wooden Guitar Resting on Left */}
        <g transform="translate(42, 62) rotate(-18)">
          <rect x="0" y="6" width="10" height="12" fill="#b45309" />
          <rect x="1" y="7" width="8" height="10" fill="#d97706" />
          <rect x="3" y="10" width="4" height="4" fill="#451a03" /> {/* Soundhole */}
          <rect x="3" y="-6" width="4" height="13" fill="#78350f" /> {/* Neck */}
          <rect x="2" y="-9" width="6" height="4" fill="#b45309" /> {/* Headstock */}
        </g>
      </g>
    </g>
  );
};
