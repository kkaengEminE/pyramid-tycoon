import { useState } from 'preact/hooks';

interface MainMenuProps {
  hasSaveData: boolean;
  onStart: () => void;
}

export function MainMenu({ hasSaveData, onStart }: MainMenuProps) {
  const [showAbout, setShowAbout] = useState(false);

  if (showAbout) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'linear-gradient(180deg, #0d0906 0%, #1a1206 30%, #2a1f0e 60%, #1a1206 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Segoe UI', sans-serif",
      }}>
        {/* Stars */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {Array.from({ length: 40 }, (_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 40}%`,
              width: '2px', height: '2px',
              background: '#fff',
              borderRadius: '50%',
              opacity: 0.3 + Math.random() * 0.5,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }} />
          ))}
        </div>

        <div style={{
          background: 'rgba(26,18,6,0.95)',
          border: '2px solid #c9a84c',
          borderRadius: '12px',
          padding: '40px 48px',
          maxWidth: '640px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          color: '#f4e4c1',
          position: 'relative',
        }}>
          <h2 style={{
            fontSize: '24px', color: '#c9a84c', textAlign: 'center',
            marginBottom: '24px', fontWeight: 'bold',
          }}>
            📜 피라미드 키우기란?
          </h2>

          <section style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', color: '#c9a84c', marginBottom: '8px' }}>🏛️ 게임 소개</h3>
            <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#d4c4a0' }}>
              기원전 2560년, 당신은 위대한 파라오가 되어 역사상 가장 거대한 건축물 — 쿠푸의 대피라미드를 완성해야 합니다.
              일꾼을 고용하고, 자원을 관리하며, 146층에 달하는 피라미드를 한 층씩 쌓아올리세요.
              밤이 되면 도굴꾼이 침입하고, 신들의 축복과 재앙이 당신의 왕조를 시험할 것입니다.
            </p>
          </section>

          <section style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', color: '#c9a84c', marginBottom: '8px' }}>⚙️ 핵심 시스템</h3>
            <ul style={{ fontSize: '13px', lineHeight: '1.8', color: '#d4c4a0', paddingLeft: '20px' }}>
              <li><b style={{ color: '#f4e4c1' }}>체인 릴레이 물류</b> — 채석장에서 캐낸 돌을 나일강 다리, 기지, 경사로를 거쳐 피라미드까지 릴레이 방식으로 운반</li>
              <li><b style={{ color: '#f4e4c1' }}>낮/밤 주기</b> — 낮에는 건설, 밤에는 도굴꾼 방어. 야근을 시킬 수도 있지만 식량 소비 2배!</li>
              <li><b style={{ color: '#f4e4c1' }}>왕조 시스템</b> — 파라오마다 고유한 특성을 가지며, 대를 이어 피라미드를 완성</li>
              <li><b style={{ color: '#f4e4c1' }}>피라미드 내부</b> — 매장실, 보물실, 함정실, 신전 등을 꾸미고 장식으로 보너스 획득</li>
              <li><b style={{ color: '#f4e4c1' }}>고대 기술</b> — 덴데라 전구, 사자의 서 등 잃어버린 기술을 연구하여 강력한 효과를 발동</li>
            </ul>
          </section>

          <section style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', color: '#c9a84c', marginBottom: '8px' }}>🔺 대피라미드의 비밀</h3>
            <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#d4c4a0' }}>
              실제 쿠푸의 대피라미드는 높이 146.6m, 밑변 230m로 약 230만 개의 석회암 블록으로 이루어져 있습니다.
              건설에 약 20년이 걸렸으며, 완공 당시 세계에서 가장 높은 인공 구조물이었습니다.
              피라미드 내부에는 왕의 방, 여왕의 방, 대회랑 등 정교한 통로와 방이 숨겨져 있으며,
              완성 시 세 꼭짓점이 오리온자리의 세 별과 정렬된다는 전설이 있습니다.
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', color: '#c9a84c', marginBottom: '8px' }}>🎮 조작법</h3>
            <ul style={{ fontSize: '13px', lineHeight: '1.8', color: '#d4c4a0', paddingLeft: '20px' }}>
              <li><b style={{ color: '#f4e4c1' }}>카메라 이동</b> — WASD / 방향키 / 화면 가장자리 마우스 / Shift+드래그</li>
              <li><b style={{ color: '#f4e4c1' }}>유닛 배치</b> — 유닛을 클릭하여 드래그 후 구역에 놓기</li>
              <li><b style={{ color: '#f4e4c1' }}>피라미드 내부</b> — 피라미드 위에 마우스를 올리면 단면도 표시</li>
            </ul>
          </section>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setShowAbout(false)}
              style={{
                background: 'linear-gradient(180deg, #c9a84c 0%, #a08030 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 40px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#1a1206',
                cursor: 'pointer',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              돌아가기
            </button>
          </div>
        </div>

        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.9; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(180deg, #0d0906 0%, #1a1206 20%, #2a1f0e 50%, #c9a060 85%, #e8c86a 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif",
      overflow: 'hidden',
    }}>
      {/* Stars */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {Array.from({ length: 60 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 45}%`,
            width: '2px', height: '2px',
            background: '#fff',
            borderRadius: '50%',
            opacity: 0.2 + Math.random() * 0.6,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }} />
        ))}
      </div>

      {/* Pyramid silhouette */}
      <svg
        viewBox="0 0 800 400"
        style={{
          position: 'absolute',
          bottom: '0',
          width: '100%',
          maxWidth: '900px',
          opacity: 0.7,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <linearGradient id="pyrGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#c9a84c" />
            <stop offset="60%" stop-color="#a08030" />
            <stop offset="100%" stop-color="#8b6914" />
          </linearGradient>
          <linearGradient id="pyrShadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#9a7828" />
            <stop offset="100%" stop-color="#6b4f10" />
          </linearGradient>
        </defs>
        {/* Main pyramid */}
        <polygon points="400,40 180,360 620,360" fill="url(#pyrGrad)" />
        {/* Shadow side */}
        <polygon points="400,40 400,360 620,360" fill="url(#pyrShadow)" opacity="0.6" />
        {/* Horizontal layer lines */}
        {Array.from({ length: 12 }, (_, i) => {
          const y = 80 + i * 24;
          const halfW = ((y - 40) / 320) * 220;
          return (
            <line
              key={i}
              x1={400 - halfW} y1={y}
              x2={400 + halfW} y2={y}
              stroke="#1a120688" strokeWidth="1"
            />
          );
        })}
        {/* Small pyramid left */}
        <polygon points="120,280 50,360 190,360" fill="#a08030" opacity="0.5" />
        {/* Small pyramid right */}
        <polygon points="680,300 630,360 730,360" fill="#a08030" opacity="0.4" />
        {/* Sand ground */}
        <rect x="0" y="355" width="800" height="45" fill="#c9a060" />
      </svg>

      {/* Moon */}
      <div style={{
        position: 'absolute',
        top: '8%',
        right: '15%',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 40%, #fffde8, #f0e6a0)',
        boxShadow: '0 0 40px rgba(255,253,200,0.4)',
        pointerEvents: 'none',
      }} />

      {/* Title */}
      <div style={{
        position: 'relative',
        textAlign: 'center',
        marginBottom: '50px',
        zIndex: 1,
      }}>
        <div style={{
          fontSize: '18px',
          color: '#c9a84c',
          letterSpacing: '8px',
          marginBottom: '8px',
          textTransform: 'uppercase',
          opacity: 0.8,
        }}>
          Pyramid Tycoon
        </div>
        <h1 style={{
          fontSize: '52px',
          fontWeight: 'bold',
          color: '#f4e4c1',
          textShadow: '0 2px 20px rgba(201,168,76,0.5), 0 4px 40px rgba(0,0,0,0.5)',
          margin: '0 0 12px 0',
          letterSpacing: '6px',
        }}>
          🔺 피라미드 키우기
        </h1>
        <div style={{
          fontSize: '14px',
          color: '#a89060',
          letterSpacing: '2px',
        }}>
          위대한 파라오가 되어 쿠푸의 대피라미드를 완성하라
        </div>
      </div>

      {/* Buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <button
          onClick={onStart}
          style={{
            background: 'linear-gradient(180deg, #c9a84c 0%, #a08030 100%)',
            border: '2px solid #e8c86a',
            borderRadius: '8px',
            padding: '16px 64px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1a1206',
            cursor: 'pointer',
            letterSpacing: '4px',
            transition: 'transform 0.15s, box-shadow 0.15s',
            boxShadow: '0 4px 20px rgba(201,168,76,0.3)',
            minWidth: '280px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 30px rgba(201,168,76,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,168,76,0.3)';
          }}
        >
          {hasSaveData ? '⚡ 이어하기' : '▶ 시작하기'}
        </button>

        <button
          onClick={() => setShowAbout(true)}
          style={{
            background: 'rgba(42,31,14,0.8)',
            border: '2px solid #c9a84c',
            borderRadius: '8px',
            padding: '14px 48px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#c9a84c',
            cursor: 'pointer',
            letterSpacing: '2px',
            transition: 'transform 0.15s, background 0.15s',
            minWidth: '280px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.background = 'rgba(42,31,14,0.95)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'rgba(42,31,14,0.8)';
          }}
        >
          📜 피라미드 키우기란
        </button>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        fontSize: '11px',
        color: '#6b5a30',
        letterSpacing: '1px',
        zIndex: 1,
      }}>
        B.C. 2560 — 기자 고원
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}
