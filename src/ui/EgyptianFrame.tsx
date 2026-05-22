export function EgyptianFrame() {
  const borderWidth = 10;
  const color = '#c9a84c';
  const bgPattern = `repeating-linear-gradient(
    90deg,
    transparent,
    transparent 18px,
    rgba(201,168,76,0.15) 18px,
    rgba(201,168,76,0.15) 20px
  )`;

  const baseStyle: Record<string, string | number> = {
    position: 'absolute',
    background: `linear-gradient(180deg, rgba(42,31,14,0.95), rgba(30,22,10,0.95))`,
    zIndex: 15,
    pointerEvents: 'none',
  };

  return (
    <>
      {/* Top border */}
      <div style={{
        ...baseStyle,
        top: 0, left: 0, right: 0, height: `${borderWidth}px`,
        borderBottom: `2px solid ${color}`,
        backgroundImage: bgPattern,
      }}>
        {/* Hieroglyph dots */}
        <div style={{
          position: 'absolute', bottom: '3px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '30px',
        }}>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} style={{
              width: '4px', height: '4px', borderRadius: '50%',
              background: color, opacity: 0.5,
            }} />
          ))}
        </div>
      </div>

      {/* Bottom border */}
      <div style={{
        ...baseStyle,
        bottom: 0, left: 0, right: 0, height: `${borderWidth}px`,
        borderTop: `2px solid ${color}`,
        backgroundImage: bgPattern,
      }} />

      {/* Left border */}
      <div style={{
        ...baseStyle,
        top: 0, left: 0, bottom: 0, width: `${borderWidth}px`,
        borderRight: `2px solid ${color}`,
      }} />

      {/* Right border */}
      <div style={{
        ...baseStyle,
        top: 0, right: 0, bottom: 0, width: `${borderWidth}px`,
        borderLeft: `2px solid ${color}`,
      }} />

      {/* Corner ornaments */}
      {(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const).map(corner => {
        const isTop = corner.includes('top');
        const isLeft = corner.includes('Left');
        return (
          <div key={corner} style={{
            position: 'absolute',
            [isTop ? 'top' : 'bottom']: '0',
            [isLeft ? 'left' : 'right']: '0',
            width: '20px', height: '20px',
            zIndex: 16,
            pointerEvents: 'none',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20">
              <polygon
                points={
                  isTop && isLeft ? '0,0 20,0 0,20' :
                  isTop && !isLeft ? '0,0 20,0 20,20' :
                  !isTop && isLeft ? '0,0 0,20 20,20' :
                  '20,0 20,20 0,20'
                }
                fill={color}
                opacity="0.3"
              />
              <circle cx={isLeft ? 6 : 14} cy={isTop ? 6 : 14} r="2" fill={color} opacity="0.6" />
            </svg>
          </div>
        );
      })}
    </>
  );
}
