interface DayNightIndicatorProps {
  timeOfDay: 'day' | 'night';
  phaseProgress: number;
  dayCount: number;
}

export function DayNightIndicator({ timeOfDay, phaseProgress, dayCount }: DayNightIndicatorProps) {
  const isDay = timeOfDay === 'day';
  const icon = isDay ? '☀️' : '🌙';
  const label = isDay ? '낮' : '밤';
  const bgColor = isDay
    ? 'linear-gradient(180deg, rgba(201,168,76,0.9), rgba(160,125,46,0.9))'
    : 'linear-gradient(180deg, rgba(10,22,40,0.9), rgba(20,30,60,0.9))';

  return (
    <div style={{
      position: 'absolute',
      top: '12px',
      right: '20px',
      background: bgColor,
      border: '2px solid #c9a84c',
      borderRadius: '6px',
      padding: '8px 14px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      zIndex: 20,
      minWidth: '80px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        <span style={{ fontWeight: 'bold' }}>{label}</span>
      </div>
      <div style={{ fontSize: '10px', color: '#a89060' }}>Day {dayCount}</div>
      <div style={{
        width: '60px', height: '4px',
        background: '#1a1206', borderRadius: '2px', overflow: 'hidden',
      }}>
        <div style={{
          width: `${phaseProgress * 100}%`,
          height: '100%',
          background: isDay ? '#ffd700' : '#4299e1',
          borderRadius: '2px',
          transition: 'width 0.1s',
        }} />
      </div>
    </div>
  );
}
