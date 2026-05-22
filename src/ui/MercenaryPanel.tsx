import { MercenaryType } from '../data/MercenaryModel';

interface MercenaryPanelProps {
  visible: boolean;
  available: MercenaryType[];
  gold: number;
  onHire: (mercId: string) => void;
  onClose: () => void;
}

export function MercenaryPanel({ visible, available, gold, onHire, onClose }: MercenaryPanelProps) {
  if (!visible) return null;

  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'linear-gradient(180deg, rgba(42,31,14,0.97) 0%, rgba(25,18,8,0.97) 100%)',
      border: '2px solid #c9a84c',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '11px',
      color: '#f4e4c1',
      zIndex: 50,
      pointerEvents: 'auto',
      minWidth: '280px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#c9a84c' }}>
          ⚔️ 용병 시장
        </div>
        <div style={{ fontSize: '10px', color: '#a89060' }}>
          🏆{gold}
        </div>
        <button onClick={onClose} style={{
          background: 'none',
          border: '1px solid #c9a84c',
          color: '#c9a84c',
          borderRadius: '3px',
          cursor: 'pointer',
          padding: '2px 8px',
          fontSize: '11px',
        }}>✕</button>
      </div>

      {available.map(merc => {
        const canAfford = gold >= merc.cost.gold;
        return (
          <div key={merc.id} style={{
            border: `1px solid ${canAfford ? '#c9a84c' : '#555'}`,
            borderRadius: '4px',
            padding: '6px 8px',
            marginBottom: '4px',
            background: canAfford ? 'rgba(201,168,76,0.1)' : 'rgba(30,22,10,0.5)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '13px' }}>{merc.icon}</span>
                <span style={{ fontWeight: 'bold', marginLeft: '4px' }}>{merc.name}</span>
              </div>
              <button
                onClick={() => canAfford && onHire(merc.id)}
                style={{
                  border: `1px solid ${canAfford ? '#c9a84c' : '#555'}`,
                  borderRadius: '3px',
                  background: canAfford ? 'rgba(201,168,76,0.3)' : 'transparent',
                  color: canAfford ? '#f4e4c1' : '#666',
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                  fontSize: '10px',
                  padding: '2px 8px',
                }}
              >
                🏆{merc.cost.gold} 고용
              </button>
            </div>
            <div style={{ fontSize: '10px', color: '#a89060', marginTop: '2px' }}>
              {merc.description}
            </div>
            <div style={{ fontSize: '9px', color: '#888', marginTop: '1px' }}>
              ⚔️{merc.stats.damage} ❤️{merc.stats.health} 🏃{merc.stats.speed}
            </div>
          </div>
        );
      })}
    </div>
  );
}
