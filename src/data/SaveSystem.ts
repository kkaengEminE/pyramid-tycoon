import { ResourceStore } from './ResourceStore';
import { PyramidModel } from './PyramidModel';
import { Dynasty } from './DynastyModel';
import { TechNode } from './TechTreeModel';

const SAVE_KEY = 'pyramid_tycoon_save';
const SAVE_VERSION = 1;

export interface SaveData {
  version: number;
  timestamp: number;
  resources: {
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
  };
  pyramid: {
    currentLayer: number;
    layers: {
      stonesPlaced: number;
      complete: boolean;
      rooms: {
        id: string;
        type: string;
        gridX: number;
        gridY: number;
        decorations: string[];
      }[];
    }[];
  };
  dynasty: {
    dynastyNumber: number;
    totalReputation: number;
    currentPharaoh: {
      id: string;
      name: string;
      dynastyNumber: number;
      traitIds: string[];
      reignStart: number;
      layersBuilt: number;
      reputation: number;
    };
  };
  tech: string[];
  dayCount: number;
}

export function saveGame(
  resources: ResourceStore,
  pyramidModel: PyramidModel,
  dynasty: Dynasty,
  techTree: TechNode[],
  dayCount: number,
): boolean {
  try {
    const data: SaveData = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      resources: {
        stone: resources.stone,
        bread: resources.bread,
        beer: resources.beer,
        gold: resources.gold,
        cedar: resources.cedar,
        hide: resources.hide,
        papyrus: resources.papyrus,
        ancientTech: resources.ancientTech,
        curses: resources.curses,
        energy: resources.energy,
      },
      pyramid: {
        currentLayer: pyramidModel.currentLayer,
        layers: pyramidModel.layers.map(l => ({
          stonesPlaced: l.stonesPlaced,
          complete: l.complete,
          rooms: l.rooms.map(r => ({
            id: r.id,
            type: r.type,
            gridX: r.gridX,
            gridY: r.gridY,
            decorations: [...r.decorations],
          })),
        })),
      },
      dynasty: {
        dynastyNumber: dynasty.dynastyNumber,
        totalReputation: dynasty.totalReputation,
        currentPharaoh: {
          id: dynasty.currentPharaoh.id,
          name: dynasty.currentPharaoh.name,
          dynastyNumber: dynasty.currentPharaoh.dynastyNumber,
          traitIds: dynasty.currentPharaoh.traits.map(t => t.id),
          reignStart: dynasty.currentPharaoh.reignStart,
          layersBuilt: dynasty.currentPharaoh.layersBuilt,
          reputation: dynasty.currentPharaoh.reputation,
        },
      },
      tech: techTree.filter(t => t.researched).map(t => t.id),
      dayCount,
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function loadGame(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SaveData;
    if (data.version !== SAVE_VERSION) return null;
    return data;
  } catch {
    return null;
  }
}

export function hasSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}
