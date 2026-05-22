interface ActiveEffect {
  icon: string;
  name: string;
  remaining: number;
  total: number;
  type: 'plague' | 'blessing';
  severity?: string;
}

interface EventPanelProps {
  effects: ActiveEffect[];
}

export function EventPanel({ effects }: EventPanelProps) {
  if (!effects || effects.length === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      top: '40px',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '4px',
      zIndex: 25,
      pointerEvents: 'none',
    }}>
      {effects.map((eff, i) => {
        const progress = eff.remaining / eff.total;
        const bgColor = eff.type === 'plague'
          ? (eff.severity === 'catastrophic' ? 'rgba(139,0,0,0.9)'
             : eff.severity === 'major' ? 'rgba(180,60,30,0.9)'
             : 'rgba(160,100,30,0.9)')
          : 'rgba(30,100,60,0.9)';
        const borderColor = eff.type === 'plague' ? '#e53e3e' : '#38a169';

        return (
          <div key={i} style={{
            background: bgColor,
            border: `1px solid ${borderColor}`,
            borderRadius: '4px',
            padding: '3px 8px',
            fontSize: '11px',
            color: '#f4e4c1',
            position: 'relative',
            overflow: 'hidden',
            minWidth: '80px',
            textAlign: 'center',
          }}>
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: `${progress * 100}%`,
              height: '2px',
              background: borderColor,
            }} />
            <span>{eff.icon} {eff.name}</span>
          </div>
        );
      })}
    </div>
  );
}

export type { ActiveEffect };
