interface ResourceBarProps {
  stone: number;
  bread: number;
  beer: number;
  gold: number;
  cedar: number;
  hide: number;
  papyrus: number;
  ancientTech: number;
  curses: number;
  currentLayer: number;
  totalLayers: number;
  pyramidProgress: number;
  isStarving: boolean;
}

const barStyle: Record<string, string | number> = {
  position: 'absolute',
  top: '12px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  background: 'linear-gradient(180deg, rgba(42,31,14,0.95) 0%, rgba(30,22,10,0.95) 100%)',
  border: '2px solid #c9a84c',
  borderRadius: '6px',
  padding: '6px 14px',
  fontSize: '13px',
  zIndex: 20,
  pointerEvents: 'auto' as const,
  flexWrap: 'wrap',
  justifyContent: 'center',
  maxWidth: '90vw',
};

const itemStyle: Record<string, string | number> = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  whiteSpace: 'nowrap',
};

const sep = <div style={{ width: '1px', height: '18px', background: '#c9a84c33' }} />;

function ResItem({ icon, value, color }: { icon: string; value: number; color?: string }) {
  return (
    <div style={{ ...itemStyle, color: color || '#f4e4c1' }}>
      <span style={{ fontSize: '15px' }}>{icon}</span>
      <span>{Math.floor(value)}</span>
    </div>
  );
}

export function ResourceBar({
  stone, bread, beer, gold, cedar, hide, papyrus, ancientTech, curses,
  currentLayer, totalLayers, pyramidProgress, isStarving,
}: ResourceBarProps) {
  const foodColor = isStarving ? '#e53e3e' : '#f4e4c1';
  const hasSpecial = cedar > 0 || hide > 0 || papyrus > 0 || ancientTech > 0 || curses > 0;

  return (
    <div style={barStyle}>
      <ResItem icon="🪨" value={stone} />
      {sep}
      <ResItem icon="🍞" value={bread} color={foodColor} />
      {sep}
      <ResItem icon="🍺" value={beer} color={foodColor} />
      {sep}
      <ResItem icon="🏆" value={gold} />
      {hasSpecial && (
        <>
          {sep}
          {cedar > 0 && <ResItem icon="🪵" value={cedar} />}
          {hide > 0 && <ResItem icon="🐊" value={hide} />}
          {papyrus > 0 && <ResItem icon="🪢" value={papyrus} />}
          {ancientTech > 0 && <ResItem icon="🔮" value={ancientTech} />}
          {curses > 0 && <ResItem icon="💀" value={curses} />}
        </>
      )}
      {sep}
      <div style={itemStyle}>
        <span style={{ fontSize: '14px' }}>🔺</span>
        <span>층 {currentLayer}/{totalLayers}</span>
        <div style={{
          width: '50px', height: '6px',
          background: '#1a1206', borderRadius: '3px', overflow: 'hidden',
        }}>
          <div style={{
            width: `${pyramidProgress * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #c9a84c, #ffd700)',
            borderRadius: '3px',
          }} />
        </div>
      </div>
    </div>
  );
}
