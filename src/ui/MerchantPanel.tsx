import { MerchantItem } from '../data/MerchantModel';

interface MerchantPanelProps {
  present: boolean;
  stayTimer: number;
  inventory: MerchantItem[];
  gold: number;
  onPurchase: (itemId: string) => void;
}

const panelStyle: Record<string, string | number> = {
  position: 'absolute',
  top: '80px',
  right: '16px',
  width: '240px',
  background: 'linear-gradient(180deg, rgba(42,31,14,0.97) 0%, rgba(30,22,10,0.97) 100%)',
  border: '2px solid #c9a84c',
  borderRadius: '8px',
  padding: '12px',
  zIndex: 25,
  pointerEvents: 'auto' as const,
};

const rarityColors: Record<string, string> = {
  common: '#f4e4c1',
  uncommon: '#38a169',
  rare: '#d69e2e',
};

export function MerchantPanel({ present, stayTimer, inventory, gold, onPurchase }: MerchantPanelProps) {
  if (!present) return null;

  const secondsLeft = Math.ceil(stayTimer / 20);

  return (
    <div style={panelStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffd700' }}>🐪 상인</span>
        <span style={{ fontSize: '11px', color: '#a89060' }}>{secondsLeft}초 남음</span>
      </div>

      <div style={{ fontSize: '11px', color: '#a89060', marginBottom: '8px' }}>
        보유 골드: {Math.floor(gold)}
      </div>

      {inventory.map(item => {
        const canBuy = gold >= item.goldCost && item.stock > 0;
        const soldOut = item.stock <= 0;

        return (
          <button
            key={item.id}
            onClick={() => canBuy && onPurchase(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '6px 8px',
              marginBottom: '4px',
              background: soldOut ? 'rgba(40,30,15,0.3)' : canBuy ? 'rgba(201,168,76,0.15)' : 'rgba(40,30,15,0.5)',
              border: `1px solid ${soldOut ? '#333' : canBuy ? '#c9a84c' : '#555'}`,
              borderRadius: '4px',
              cursor: canBuy ? 'pointer' : 'default',
              opacity: soldOut ? 0.4 : canBuy ? 1 : 0.6,
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: rarityColors[item.rarity], fontWeight: item.rarity === 'rare' ? 'bold' : 'normal' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '9px', color: '#888' }}>{item.description}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#ffd700' }}>🏆{item.goldCost}</div>
              {!soldOut && <div style={{ fontSize: '9px', color: '#888' }}>x{item.stock}</div>}
              {soldOut && <div style={{ fontSize: '9px', color: '#e53e3e' }}>매진</div>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
