import { PYRAMID_LAYERS, STONES_PER_LAYER } from '../config';
import { DECORATIONS as ALL_DECORATIONS } from './DecorationModel';

export type RoomType = 'empty' | 'burial' | 'treasure' | 'trap' | 'storage' | 'shrine';

export interface Room {
  id: string;
  type: RoomType;
  gridX: number;
  gridY: number;
  width: number;
  height: number;
  layer: number;
  decorations: string[];
  treasureValue: number;
  trapPower: number;
}

export const ROOM_CONFIGS: Record<RoomType, { label: string; icon: string; description: string; color: number }> = {
  empty: { label: '빈 방', icon: '⬜', description: '아직 꾸미지 않은 방', color: 0xd4a853 },
  burial: { label: '매장실', icon: '⚰️', description: '파라오의 안식처. 미라 유닛 생산 가능', color: 0x4a3728 },
  treasure: { label: '보물실', icon: '💎', description: '보물을 보관하여 골드 생산', color: 0xffd700 },
  trap: { label: '함정실', icon: '⚠️', description: '도굴꾼에게 자동 피해', color: 0xe53e3e },
  storage: { label: '창고', icon: '📦', description: '자원 저장 한도 증가', color: 0x8b6914 },
  shrine: { label: '신전', icon: '🏛️', description: '신의 축복 효과 증가', color: 0x6b5bff },
};

export interface PyramidLayer {
  index: number;
  stonesRequired: number;
  stonesPlaced: number;
  complete: boolean;
  rooms: Room[];
}

export interface MazeCell {
  x: number;
  y: number;
  walkable: boolean;
  hasTrap: boolean;
  hasTreasure: boolean;
  isEntrance: boolean;
  isExit: boolean;
}

export class PyramidModel {
  layers: PyramidLayer[] = [];
  currentLayer = 0;
  maze: MazeCell[][] = [];
  mazeWidth = 10;
  mazeHeight = 8;

  constructor() {
    for (let i = 0; i < PYRAMID_LAYERS; i++) {
      this.layers.push({
        index: i,
        stonesRequired: STONES_PER_LAYER(i),
        stonesPlaced: 0,
        complete: false,
        rooms: [],
      });
    }
    this.generateMaze();
  }

  addStone(): boolean {
    const layer = this.layers[this.currentLayer];
    if (!layer) return false;
    layer.stonesPlaced++;
    if (layer.stonesPlaced >= layer.stonesRequired) {
      layer.complete = true;
      this.generateRoomSlots(this.currentLayer);
      this.currentLayer++;
      return true;
    }
    return false;
  }

  private generateRoomSlots(layerIndex: number): void {
    const layer = this.layers[layerIndex];
    if (!layer) return;

    const gridSize = Math.max(2, 6 - Math.floor(layerIndex / 5));
    const roomCount = Math.max(1, Math.floor(gridSize * gridSize * 0.4));

    const positions: { x: number; y: number }[] = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        positions.push({ x, y });
      }
    }

    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    for (let i = 0; i < roomCount; i++) {
      const pos = positions[i];
      layer.rooms.push({
        id: `room_${layerIndex}_${i}`,
        type: 'empty',
        gridX: pos.x,
        gridY: pos.y,
        width: 1,
        height: 1,
        layer: layerIndex,
        decorations: [],
        treasureValue: 0,
        trapPower: 0,
      });
    }
  }

  setRoomType(layerIndex: number, roomId: string, type: RoomType): boolean {
    const layer = this.layers[layerIndex];
    if (!layer) return false;
    const room = layer.rooms.find(r => r.id === roomId);
    if (!room) return false;
    room.type = type;
    return true;
  }

  getRooms(layerIndex: number): Room[] {
    return this.layers[layerIndex]?.rooms ?? [];
  }

  getAllRoomsByType(type: RoomType): Room[] {
    const result: Room[] = [];
    for (const layer of this.layers) {
      for (const room of layer.rooms) {
        if (room.type === type) result.push(room);
      }
    }
    return result;
  }

  addDecoration(layerIndex: number, roomId: string, decorationId: string): boolean {
    const layer = this.layers[layerIndex];
    if (!layer) return false;
    const room = layer.rooms.find(r => r.id === roomId);
    if (!room) return false;
    if (room.decorations.includes(decorationId)) return false;
    room.decorations.push(decorationId);
    return true;
  }

  getTotalEffect(effectType: string): number {
    let total = 0;
    for (const layer of this.layers) {
      for (const room of layer.rooms) {
        for (const decId of room.decorations) {
          const dec = ALL_DECORATIONS.find(d => d.id === decId);
          if (dec && dec.effect.type === effectType) {
            total += dec.effect.value;
          }
        }
      }
    }
    return total;
  }

  getProgress(): number {
    return this.currentLayer / this.layers.length;
  }

  getCurrentLayer(): PyramidLayer | null {
    return this.layers[this.currentLayer] ?? null;
  }

  private generateMaze(): void {
    this.maze = [];
    for (let y = 0; y < this.mazeHeight; y++) {
      const row: MazeCell[] = [];
      for (let x = 0; x < this.mazeWidth; x++) {
        const isWall = (x % 2 === 0 && y % 2 === 0) ||
                       (Math.random() < 0.25 && x > 0 && x < this.mazeWidth - 1 && y > 0 && y < this.mazeHeight - 1);
        row.push({
          x, y,
          walkable: !isWall,
          hasTrap: false,
          hasTreasure: false,
          isEntrance: x === this.mazeWidth - 1 && y === Math.floor(this.mazeHeight / 2),
          isExit: x === this.mazeWidth - 1 && y === Math.floor(this.mazeHeight / 2),
        });
      }
      this.maze.push(row);
    }
    const centerX = Math.floor(this.mazeWidth / 2);
    const centerY = Math.floor(this.mazeHeight / 2);
    this.maze[centerY][centerX].hasTreasure = true;
    this.maze[centerY][centerX].walkable = true;

    const entrance = this.maze[Math.floor(this.mazeHeight / 2)][this.mazeWidth - 1];
    entrance.walkable = true;
    entrance.isEntrance = true;
    entrance.isExit = true;
  }

  getMazeCell(x: number, y: number): MazeCell | null {
    return this.maze[y]?.[x] ?? null;
  }

  getWalkableNeighbors(x: number, y: number): MazeCell[] {
    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    const result: MazeCell[] = [];
    for (const [dx, dy] of dirs) {
      const cell = this.getMazeCell(x + dx, y + dy);
      if (cell?.walkable) result.push(cell);
    }
    return result;
  }
}
