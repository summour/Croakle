import React from 'react';
import { SceneLocationId } from '../../types';
import { ZenPondScene } from './ZenPondScene';
import { TreehouseScene } from './TreehouseScene';
import { SakuraShrineScene } from './SakuraShrineScene';
import { RainyMeadowScene } from './RainyMeadowScene';
import { OnsenScene } from './OnsenScene';
import { NightCampScene } from './NightCampScene';
import { TearoomScene } from './TearoomScene';
import { CloudPalaceScene } from './CloudPalaceScene';
import { BambooGroveScene } from './BambooGroveScene';
import { RedRidingForestScene } from './RedRidingForestScene';
import { SushiBarScene } from './SushiBarScene';
import { SaunaBathhouseScene } from './SaunaBathhouseScene';
import { RetroArcadeScene } from './RetroArcadeScene';
import { ConvenienceStoreScene } from './ConvenienceStoreScene';
import { ForestCampScene } from './ForestCampScene';

interface PixelSceneBackgroundProps {
  sceneId: SceneLocationId | string;
  animTick: number;
  fullscreen?: boolean;
}

export const PixelSceneBackgroundRenderer: React.FC<PixelSceneBackgroundProps> = ({
  sceneId,
  animTick,
  fullscreen,
}) => {
  switch (sceneId) {
    case 'zen_pond':
      return <ZenPondScene animTick={animTick} fullscreen={fullscreen} />;
    case 'treehouse':
      return <TreehouseScene animTick={animTick} fullscreen={fullscreen} />;
    case 'sakura_shrine':
      return <SakuraShrineScene animTick={animTick} fullscreen={fullscreen} />;
    case 'rainy_meadow':
      return <RainyMeadowScene animTick={animTick} fullscreen={fullscreen} />;
    case 'onsen':
      return <OnsenScene animTick={animTick} fullscreen={fullscreen} />;
    case 'night_camp':
      return <NightCampScene animTick={animTick} fullscreen={fullscreen} />;
    case 'tearoom':
      return <TearoomScene animTick={animTick} fullscreen={fullscreen} />;
    case 'cloud_palace':
      return <CloudPalaceScene animTick={animTick} fullscreen={fullscreen} />;
    case 'bamboo_grove':
      return <BambooGroveScene animTick={animTick} fullscreen={fullscreen} />;
    case 'red_riding_forest':
      return <RedRidingForestScene animTick={animTick} fullscreen={fullscreen} />;
    case 'sushi_bar':
      return <SushiBarScene animTick={animTick} fullscreen={fullscreen} />;
    case 'sauna_bathhouse':
      return <SaunaBathhouseScene animTick={animTick} fullscreen={fullscreen} />;
    case 'retro_arcade':
      return <RetroArcadeScene animTick={animTick} fullscreen={fullscreen} />;
    case 'convenience_store':
      return <ConvenienceStoreScene animTick={animTick} fullscreen={fullscreen} />;
    case 'forest_camp':
    default:
      return <ForestCampScene animTick={animTick} fullscreen={fullscreen} />;
  }
};
