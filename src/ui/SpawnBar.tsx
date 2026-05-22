import { WORKER_SPAWN_COST, SOLDIER_SPAWN_COST, SUPERVISOR_SPAWN_COST } from '../config';

interface SpawnBarProps {
  energy: number;
  energyMax: number;
  onSpawn: (type: 'worker' | 'soldier' | 'supervisor') => void;
  zoneBuffers: number[];
  zoneOvertime: boolean[];
  onToggleOvertime: (zoneIndex: number) => void;
}

const containerStyle: Record<string, string | number> = {
  position: 'absolute',
  bottom: '12px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '12px',
  alignItems: 'flex-end',
  zIndex: 20,
  pointerEvents: 'auto' as const,
};

const panelStyle: Record<string, string | number> = {
  background: 'linear-gradient(180deg, rgba(42,31,14,0.95) 0%, rgba(30,22,10,0.95) 100%)',
  border: '2px solid #c9a84c',
  borderRadius: '6px',
  padding: '10px 16px',
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
};

const btnStyle = (canAfford: boolean): Record<string, string | number> => ({
  width: '60px',
  height: '60px',
  border: `2px solid ${canAfford ? '#c9a84c' : '#555'}`,
  borderRadius: '6px',
  background: canAfford ? 'rgba(201,168,76,0.2)' : 'rgba(40,30,15,0.5)',
  cursor: canAfford ? 'pointer' : 'not-allowed',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '10px',
  color: canAfford ? '#f4e4c1' : '#666',
  opacity: canAfford ? 1 : 0.5,
  transition: 'all 0.15s',
});

const zoneNames = ['채석장', '다리', '기단', '경사로', '밀밭', '양조장'];

export function SpawnBar({ energy, energyMax, onSpawn, zoneBuffers, zoneOvertime, onToggleOvertime }: SpawnBarProps) {
  const units = [
    { type: 'worker' as const, label: '일꾼', icon: '👷', cost: WORKER_SPAWN_COST },
    { type: 'soldier' as const, label: '병사', icon: '⚔️', cost: SOLDIER_SPAWN_COST },
    { type: 'supervisor' as const, label: '감독관', icon: '👑', cost: SUPERVISOR_SPAWN_COST },
  ];

  return (
    <div style={containerStyle}>
      {/* Zone status */}
      <div style={{ ...panelStyle, flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#c9a84c', marginBottom: '2px' }}>물류 현황</div>
        {zoneNames.map((name, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '140px' }}>
            <span style={{ width: '40px' }}>{name}</span>
            <div style={{
              flex: 1, height: '6px', background: '#1a1206',
              borderRadius: '3px', overflow: 'hidden',
            }}>
              <div style={{
                width: `${(zoneBuffers[i] / 50) * 100}%`,
                height: '100%',
                background: zoneBuffers[i] >= 45 ? '#e53e3e' : '#c9a84c',
                borderRadius: '3px',
                transition: 'width 0.2s',
              }} />
            </div>
            <span style={{ width: '20px', textAlign: 'right' }}>{zoneBuffers[i]}</span>
            <button
              onClick={() => onToggleOvertime(i)}
              style={{
                width: '28px', height: '18px',
                borderRadius: '9px',
                border: 'none',
                background: zoneOvertime[i] ? '#ffd700' : '#555',
                cursor: 'pointer',
                fontSize: '8px',
                position: 'relative',
                transition: 'background 0.2s',
              }}
              title="야근 모드"
            >
              <div style={{
                width: '14px', height: '14px',
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: '2px',
                left: zoneOvertime[i] ? '12px' : '2px',
                transition: 'left 0.2s',
              }} />
            </button>
          </div>
        ))}
      </div>

      {/* Spawn buttons */}
      <div style={panelStyle}>
        {/* Energy gauge */}
        <div style={{
          width: '8px', height: '60px', background: '#1a1206',
          borderRadius: '4px', overflow: 'hidden', position: 'relative',
        }}>
          <div style={{
            position: 'absolute', bottom: 0, width: '100%',
            height: `${(energy / energyMax) * 100}%`,
            background: 'linear-gradient(0deg, #3182ce, #63b3ed)',
            borderRadius: '4px',
            transition: 'height 0.1s',
          }} />
        </div>

        {units.map(unit => {
          const canAfford = energy >= unit.cost;
          return (
            <button
              key={unit.type}
              style={btnStyle(canAfford)}
              onClick={() => canAfford && onSpawn(unit.type)}
              title={`${unit.label} (에너지 ${unit.cost})`}
            >
              <span style={{ fontSize: '22px' }}>{unit.icon}</span>
              <span>{unit.label}</span>
              <span style={{ fontSize: '9px', color: '#a89060' }}>⚡{unit.cost}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
