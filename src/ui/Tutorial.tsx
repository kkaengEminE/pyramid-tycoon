import { useState } from 'preact/hooks';

interface TutorialStep {
  title: string;
  text: string;
  icon: string;
}

const STEPS: TutorialStep[] = [
  {
    title: '피라미드 키우기에 오신 것을 환영합니다!',
    text: '당신은 고대 이집트의 파라오입니다.\n대피라미드를 완성하는 것이 당신의 목표입니다.',
    icon: '🏛️',
  },
  {
    title: '일꾼 배치',
    text: '하단의 일꾼 버튼을 눌러 일꾼을 생산하세요.\n일꾼을 드래그하여 채석장(왼쪽)에 배치하면 석재를 캐기 시작합니다.',
    icon: '👷',
  },
  {
    title: '물류 체인',
    text: '석재는 채석장 → 다리 → 기초 → 경사로를 통해 피라미드까지 운반됩니다.\n각 구역에 일꾼을 배치하세요.',
    icon: '🪨',
  },
  {
    title: '식량 관리',
    text: '밀밭과 양조장에 일꾼을 배치하면 빵과 맥주를 생산합니다.\n식량이 없으면 일꾼 속도가 50% 감소합니다!',
    icon: '🍞',
  },
  {
    title: '밤과 도굴꾼',
    text: '밤이 되면 도굴꾼이 피라미드에 침입합니다.\n병사를 배치하거나 미라의 보호를 받으세요.',
    icon: '🌙',
  },
  {
    title: '피라미드 내부',
    text: '층이 완성되면 내부에 방을 배치할 수 있습니다.\n피라미드 위에 마우스를 올려 내부를 확인하세요.',
    icon: '⚰️',
  },
  {
    title: '시작합시다!',
    text: '146개의 층을 쌓아 대피라미드를 완성하세요.\n파라오의 영광을 위하여!',
    icon: '⭐',
  },
];

interface TutorialProps {
  onComplete: () => void;
}

export function Tutorial({ onComplete }: TutorialProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      pointerEvents: 'auto',
    }}>
      <div style={{
        background: 'linear-gradient(180deg, rgba(42,31,14,0.98) 0%, rgba(25,18,8,0.98) 100%)',
        border: '2px solid #c9a84c',
        borderRadius: '8px',
        padding: '20px 24px',
        maxWidth: '380px',
        textAlign: 'center',
        color: '#f4e4c1',
      }}>
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>{current.icon}</div>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#c9a84c', marginBottom: '8px' }}>
          {current.title}
        </div>
        <div style={{ fontSize: '12px', lineHeight: '1.6', whiteSpace: 'pre-line', marginBottom: '16px' }}>
          {current.text}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} style={{
              background: 'rgba(201,168,76,0.15)',
              border: '1px solid #c9a84c',
              borderRadius: '4px',
              color: '#c9a84c',
              padding: '6px 16px',
              fontSize: '12px',
              cursor: 'pointer',
            }}>이전</button>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(step + 1)} style={{
              background: 'rgba(201,168,76,0.3)',
              border: '1px solid #c9a84c',
              borderRadius: '4px',
              color: '#ffd700',
              padding: '6px 16px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}>다음</button>
          ) : (
            <button onClick={onComplete} style={{
              background: 'rgba(56,161,105,0.3)',
              border: '1px solid #38a169',
              borderRadius: '4px',
              color: '#38a169',
              padding: '6px 16px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}>시작!</button>
          )}
        </div>
        <div style={{ marginTop: '10px', fontSize: '10px', color: '#666' }}>
          {step + 1} / {STEPS.length}
        </div>
        {step === 0 && (
          <button onClick={onComplete} style={{
            marginTop: '8px',
            background: 'none',
            border: 'none',
            color: '#666',
            fontSize: '10px',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}>건너뛰기</button>
        )}
      </div>
    </div>
  );
}
