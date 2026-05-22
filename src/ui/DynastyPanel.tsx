import { PharaohTrait } from '../data/DynastyModel';

interface DynastyPanelProps {
  pharaohName: string;
  dynastyNumber: number;
  traits: PharaohTrait[];
  reputation: number;
  reignStart: number;
  currentDay: number;
  layersBuilt: number;
}

export function DynastyPanel({ pharaohName, dynastyNumber, traits, reputation, reignStart, currentDay, layersBuilt }: DynastyPanelProps) {
  const reignDays = currentDay - reignStart;

  return (
    <div style={{
      position: 'absolute',
      right: '10px',
      top: '50px',
      background: 'linear-gradient(180deg, rgba(42,31,14,0.93) 0%, rgba(30,22,10,0.93) 100%)',
      border: '2px solid #c9a84c',
      borderRadius: '6px',
      padding: '8px 10px',
      fontSize: '11px',
      color: '#f4e4c1',
      zIndex: 25,
      pointerEvents: 'auto',
      minWidth: '160px',
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#c9a84c', marginBottom: '4px' }}>
        👑 제{dynastyNumber}왕조
      </div>
      <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>
        {pharaohName}
      </div>
      <div style={{ fontSize: '10px', color: '#a89060', marginBottom: '6px' }}>
        재위 {reignDays}일 | 🏗️{layersBuilt}층 | ⭐{Math.floor(reputation)}
      </div>
      {(traits ?? []).map(trait => (
        <div key={trait.id} style={{
          background: 'rgba(201,168,76,0.1)',
          border: '1px solid #c9a84c33',
          borderRadius: '3px',
          padding: '3px 6px',
          marginBottom: '2px',
          fontSize: '10px',
        }}>
          <span style={{ marginRight: '4px' }}>{trait.icon}</span>
          <span style={{ color: '#c9a84c', fontWeight: 'bold' }}>{trait.label}</span>
          <div style={{ color: '#a89060', marginTop: '1px' }}>{trait.description}</div>
        </div>
      ))}
    </div>
  );
}
