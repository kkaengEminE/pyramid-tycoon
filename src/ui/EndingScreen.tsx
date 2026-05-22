interface EndingScreenProps {
  visible: boolean;
  dayCount: number;
  dynastyNumber: number;
  pharaohName: string;
  totalReputation: number;
  onRestart: () => void;
}

export function EndingScreen({ visible, dayCount, dynastyNumber, pharaohName, totalReputation, onRestart }: EndingScreenProps) {
  if (!visible) return null;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(ellipse at center, rgba(10,5,30,0.95) 0%, rgba(0,0,0,0.98) 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      pointerEvents: 'auto',
      color: '#f4e4c1',
    }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>⭐ ⭐ ⭐</div>
      <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffd700', marginBottom: '10px' }}>
        대피라미드 완성!
      </div>
      <div style={{ fontSize: '14px', color: '#c9a84c', marginBottom: '20px', textAlign: 'center' }}>
        오리온 벨트와 피라미드가 정렬되었습니다
      </div>

      <div style={{
        background: 'rgba(42,31,14,0.8)',
        border: '2px solid #c9a84c',
        borderRadius: '8px',
        padding: '16px 24px',
        marginBottom: '20px',
        textAlign: 'center',
        minWidth: '250px',
      }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
          👑 {pharaohName}
        </div>
        <div style={{ fontSize: '12px', color: '#a89060', lineHeight: '1.8' }}>
          제{dynastyNumber}왕조<br />
          건설 기간: {dayCount}일<br />
          총 명성: ⭐{Math.floor(totalReputation)}<br />
        </div>
      </div>

      <div style={{
        fontSize: '11px',
        color: '#888',
        marginBottom: '20px',
        textAlign: 'center',
        maxWidth: '400px',
        lineHeight: '1.6',
      }}>
        146개의 석회암 층이 하늘을 향해 솟아올랐습니다.<br />
        파라오의 영혼은 영원한 안식을 찾았습니다.
      </div>

      <button onClick={onRestart} style={{
        background: 'rgba(201,168,76,0.3)',
        border: '2px solid #c9a84c',
        borderRadius: '6px',
        color: '#ffd700',
        padding: '10px 24px',
        fontSize: '14px',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}>
        새 왕조 시작
      </button>
    </div>
  );
}
