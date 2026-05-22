import { Room, RoomType, ROOM_CONFIGS } from '../data/PyramidModel';
import { getDecorationsForRoom, Decoration } from '../data/DecorationModel';

interface RoomPanelProps {
  visible: boolean;
  layerIndex: number;
  rooms: Room[];
  onSetRoomType: (layerIndex: number, roomId: string, type: RoomType) => void;
  onAddDecoration: (layerIndex: number, roomId: string, decorationId: string) => void;
  cedar: number;
  hide: number;
  papyrus: number;
  gold: number;
}

const ROOM_COSTS: Record<RoomType, { cedar: number; hide: number; papyrus: number }> = {
  empty: { cedar: 0, hide: 0, papyrus: 0 },
  burial: { cedar: 3, hide: 2, papyrus: 1 },
  treasure: { cedar: 2, hide: 0, papyrus: 2 },
  trap: { cedar: 0, hide: 1, papyrus: 1 },
  storage: { cedar: 2, hide: 0, papyrus: 0 },
  shrine: { cedar: 5, hide: 3, papyrus: 3 },
};

function canAffordDecoration(d: Decoration, cedar: number, hide: number, papyrus: number, gold: number): boolean {
  return cedar >= d.cost.cedar && hide >= d.cost.hide && papyrus >= d.cost.papyrus && gold >= d.cost.gold;
}

const rarityColors: Record<string, string> = {
  common: '#f4e4c1',
  uncommon: '#38a169',
  rare: '#d69e2e',
};

export function RoomPanel({ visible, layerIndex, rooms, onSetRoomType, onAddDecoration, cedar, hide, papyrus, gold }: RoomPanelProps) {
  if (!visible || rooms.length === 0) return null;

  const roomTypes: RoomType[] = ['burial', 'treasure', 'trap', 'storage', 'shrine'];

  return (
    <div style={{
      position: 'absolute',
      left: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'linear-gradient(180deg, rgba(42,31,14,0.95) 0%, rgba(30,22,10,0.95) 100%)',
      border: '2px solid #c9a84c',
      borderRadius: '6px',
      padding: '10px',
      fontSize: '12px',
      color: '#f4e4c1',
      maxHeight: '60vh',
      overflowY: 'auto',
      zIndex: 30,
      pointerEvents: 'auto',
      minWidth: '220px',
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#c9a84c', marginBottom: '8px' }}>
        🏛️ {layerIndex + 1}층 내부 설계
      </div>
      <div style={{ fontSize: '10px', color: '#a89060', marginBottom: '8px' }}>
        🪵{cedar} 🐊{hide} 🪢{papyrus} 🏆{gold}
      </div>
      {rooms.map(room => {
        const config = ROOM_CONFIGS[room.type];
        const availableDecorations = room.type !== 'empty' ? getDecorationsForRoom(room.type) : [];
        const unplacedDecorations = availableDecorations.filter(d => !room.decorations.includes(d.id));

        return (
          <div key={room.id} style={{
            border: '1px solid #c9a84c44',
            borderRadius: '4px',
            padding: '6px',
            marginBottom: '4px',
            background: 'rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {config.icon} {config.label}
            </div>
            {room.type === 'empty' ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                {roomTypes.map(rt => {
                  const cost = ROOM_COSTS[rt];
                  const afford = cedar >= cost.cedar && hide >= cost.hide && papyrus >= cost.papyrus;
                  const rc = ROOM_CONFIGS[rt];
                  return (
                    <button
                      key={rt}
                      onClick={() => afford && onSetRoomType(layerIndex, room.id, rt)}
                      style={{
                        border: `1px solid ${afford ? '#c9a84c' : '#555'}`,
                        borderRadius: '3px',
                        background: afford ? 'rgba(201,168,76,0.2)' : 'rgba(40,30,15,0.5)',
                        color: afford ? '#f4e4c1' : '#666',
                        cursor: afford ? 'pointer' : 'not-allowed',
                        fontSize: '10px',
                        padding: '3px 6px',
                      }}
                      title={`${rc.label}: 🪵${cost.cedar} 🐊${cost.hide} 🪢${cost.papyrus}`}
                    >
                      {rc.icon}
                    </button>
                  );
                })}
              </div>
            ) : (
              <>
                <div style={{ fontSize: '10px', color: '#a89060', marginBottom: '3px' }}>{config.description}</div>
                {room.decorations.length > 0 && (
                  <div style={{ fontSize: '10px', marginBottom: '3px' }}>
                    장식: {room.decorations.map(dId => {
                      const d = availableDecorations.find(dd => dd.id === dId) ||
                                getDecorationsForRoom(room.type).find(dd => dd.id === dId);
                      return d ? d.icon : '?';
                    }).join(' ')}
                  </div>
                )}
                {unplacedDecorations.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', marginTop: '3px' }}>
                    {unplacedDecorations.map(d => {
                      const afford = canAffordDecoration(d, cedar, hide, papyrus, gold);
                      return (
                        <button
                          key={d.id}
                          onClick={() => afford && onAddDecoration(layerIndex, room.id, d.id)}
                          style={{
                            border: `1px solid ${afford ? rarityColors[d.rarity] : '#555'}`,
                            borderRadius: '3px',
                            background: afford ? 'rgba(201,168,76,0.15)' : 'rgba(40,30,15,0.5)',
                            color: afford ? rarityColors[d.rarity] : '#666',
                            cursor: afford ? 'pointer' : 'not-allowed',
                            fontSize: '9px',
                            padding: '2px 5px',
                          }}
                          title={`${d.label}: ${d.description}\n🪵${d.cost.cedar} 🐊${d.cost.hide} 🪢${d.cost.papyrus} 🏆${d.cost.gold}`}
                        >
                          {d.icon}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export { ROOM_COSTS };
