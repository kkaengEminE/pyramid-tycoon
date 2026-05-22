import { useEffect, useState } from 'preact/hooks';
import { ResourceBar } from './ResourceBar';
import { SpawnBar } from './SpawnBar';
import { DayNightIndicator } from './DayNightIndicator';
import { EgyptianFrame } from './EgyptianFrame';
import { MerchantPanel } from './MerchantPanel';
import { RoomPanel } from './RoomPanel';
import { Minimap } from './Minimap';
import { ToastContainer } from './ToastSystem';
import { MerchantItem } from '../data/MerchantModel';
import { Room, RoomType } from '../data/PyramidModel';
import { DynastyPanel } from './DynastyPanel';
import { EventPanel, ActiveEffect } from './EventPanel';
import { PharaohTrait } from '../data/DynastyModel';
import { TechPanel } from './TechPanel';
import { MercenaryPanel } from './MercenaryPanel';
import { EndingScreen } from './EndingScreen';
import { TechNode } from '../data/TechTreeModel';
import { MercenaryType } from '../data/MercenaryModel';
import { Tutorial } from './Tutorial';

export interface GameUIState {
  stone: number;
  bread: number;
  beer: number;
  gold: number;
  cedar: number;
  hide: number;
  papyrus: number;
  ancientTech: number;
  curses: number;
  energy: number;
  energyMax: number;
  currentLayer: number;
  totalLayers: number;
  timeOfDay: 'day' | 'night';
  phaseProgress: number;
  dayCount: number;
  workerCount: number;
  zoneBuffers: number[];
  zoneOvertime: boolean[];
  isStarving: boolean;
  pyramidProgress: number;
  merchantPresent: boolean;
  merchantStayTimer: number;
  merchantInventory: MerchantItem[];
  cameraX: number;
  cameraY: number;
  screenW: number;
  screenH: number;
  unitPositions: { x: number; y: number; type: string }[];
  hoveredLayer: number;
  hoveredLayerRooms: Room[];
  pharaohName: string;
  dynastyNumber: number;
  pharaohTraits: PharaohTrait[];
  pharaohReputation: number;
  pharaohReignStart: number;
  pharaohLayersBuilt: number;
  activeEffects: ActiveEffect[];
  techNodes: TechNode[];
  mercenaryAvailable: MercenaryType[];
  pyramidComplete: boolean;
  totalDynastyReputation: number;
}

interface AppProps {
  getState: () => GameUIState;
  onSpawnUnit: (type: 'worker' | 'soldier' | 'supervisor') => void;
  onToggleOvertime: (zoneIndex: number) => void;
  onMerchantPurchase: (itemId: string) => void;
  onSetRoomType: (layerIndex: number, roomId: string, type: RoomType) => void;
  onAddDecoration: (layerIndex: number, roomId: string, decorationId: string) => void;
  onResearchTech: (techId: string) => void;
  onHireMercenary: (mercId: string) => void;
  onRestart: () => void;
  onSave: () => void;
  showTutorial: boolean;
}

export function App({ getState, onSpawnUnit, onToggleOvertime, onMerchantPurchase, onSetRoomType, onAddDecoration, onResearchTech, onHireMercenary, onRestart, onSave, showTutorial: initialTutorial }: AppProps) {
  const [state, setState] = useState<GameUIState>(getState);
  const [techOpen, setTechOpen] = useState(false);
  const [mercOpen, setMercOpen] = useState(false);
  const [tutorialDone, setTutorialDone] = useState(!initialTutorial);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(getState());
    }, 100);
    return () => clearInterval(interval);
  }, [getState]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {!tutorialDone && <Tutorial onComplete={() => setTutorialDone(true)} />}
      <EgyptianFrame />
      <ToastContainer />
      <EventPanel effects={state.activeEffects} />
      <TechPanel
        visible={techOpen}
        nodes={state.techNodes}
        ancientTech={state.ancientTech}
        gold={state.gold}
        onResearch={onResearchTech}
        onClose={() => setTechOpen(false)}
      />
      <MercenaryPanel
        visible={mercOpen}
        available={state.mercenaryAvailable}
        gold={state.gold}
        onHire={onHireMercenary}
        onClose={() => setMercOpen(false)}
      />
      <EndingScreen
        visible={state.pyramidComplete}
        dayCount={state.dayCount}
        dynastyNumber={state.dynastyNumber}
        pharaohName={state.pharaohName}
        totalReputation={state.totalDynastyReputation}
        onRestart={onRestart}
      />
      <ResourceBar
        stone={state.stone}
        bread={state.bread}
        beer={state.beer}
        gold={state.gold}
        cedar={state.cedar}
        hide={state.hide}
        papyrus={state.papyrus}
        ancientTech={state.ancientTech}
        curses={state.curses}
        currentLayer={state.currentLayer}
        totalLayers={state.totalLayers}
        pyramidProgress={state.pyramidProgress}
        isStarving={state.isStarving}
      />
      <DayNightIndicator
        timeOfDay={state.timeOfDay}
        phaseProgress={state.phaseProgress}
        dayCount={state.dayCount}
      />
      <MerchantPanel
        present={state.merchantPresent}
        stayTimer={state.merchantStayTimer}
        inventory={state.merchantInventory}
        gold={state.gold}
        onPurchase={onMerchantPurchase}
      />
      <DynastyPanel
        pharaohName={state.pharaohName}
        dynastyNumber={state.dynastyNumber}
        traits={state.pharaohTraits}
        reputation={state.pharaohReputation}
        reignStart={state.pharaohReignStart}
        currentDay={state.dayCount}
        layersBuilt={state.pharaohLayersBuilt}
      />
      <RoomPanel
        visible={state.hoveredLayer >= 0}
        layerIndex={state.hoveredLayer}
        rooms={state.hoveredLayerRooms}
        onSetRoomType={onSetRoomType}
        onAddDecoration={onAddDecoration}
        cedar={state.cedar}
        hide={state.hide}
        papyrus={state.papyrus}
        gold={state.gold}
      />
      <Minimap
        cameraX={state.cameraX}
        cameraY={state.cameraY}
        screenW={state.screenW}
        screenH={state.screenH}
        unitPositions={state.unitPositions}
      />
      <div style={{
        position: 'absolute',
        right: '10px',
        bottom: '110px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        zIndex: 25,
        pointerEvents: 'auto',
      }}>
        {state.ancientTech > 0 && !techOpen && (
          <button onClick={() => setTechOpen(true)} style={{
            background: 'rgba(42,31,14,0.9)',
            border: '2px solid #9b59b6',
            borderRadius: '6px',
            color: '#f4e4c1',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer',
          }}>
            📜 기술 연구 ({state.ancientTech})
          </button>
        )}
        {state.gold >= 10 && !mercOpen && (
          <button onClick={() => setMercOpen(true)} style={{
            background: 'rgba(42,31,14,0.9)',
            border: '2px solid #e53e3e',
            borderRadius: '6px',
            color: '#f4e4c1',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer',
          }}>
            ⚔️ 용병 시장
          </button>
        )}
      </div>
      <SpawnBar
        energy={state.energy}
        energyMax={state.energyMax}
        onSpawn={onSpawnUnit}
        zoneBuffers={state.zoneBuffers}
        zoneOvertime={state.zoneOvertime}
        onToggleOvertime={onToggleOvertime}
      />
      <button onClick={onSave} style={{
        position: 'absolute',
        left: '10px',
        bottom: '110px',
        background: 'rgba(42,31,14,0.9)',
        border: '1px solid #c9a84c',
        borderRadius: '4px',
        color: '#c9a84c',
        padding: '4px 10px',
        fontSize: '11px',
        cursor: 'pointer',
        zIndex: 25,
        pointerEvents: 'auto',
      }}>💾 저장</button>
      {state.isStarving && (
        <div style={{
          position: 'absolute', bottom: '110px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(229, 62, 62, 0.9)', padding: '8px 20px', borderRadius: '4px',
          fontSize: '14px', fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap',
        }}>
          식량이 고갈되었습니다! 일꾼 속도 50% 감소
        </div>
      )}
    </div>
  );
}
