import { TechNode } from '../data/TechTreeModel';

interface TechPanelProps {
  visible: boolean;
  nodes: TechNode[];
  ancientTech: number;
  gold: number;
  onResearch: (techId: string) => void;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  construction: { label: '건축', color: '#c9a84c' },
  military: { label: '군사', color: '#e53e3e' },
  economy: { label: '경제', color: '#38a169' },
  mystical: { label: '신비', color: '#9b59b6' },
};

export function TechPanel({ visible, nodes, ancientTech, gold, onResearch, onClose }: TechPanelProps) {
  if (!visible) return null;

  const categories = ['construction', 'economy', 'military', 'mystical'];

  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'linear-gradient(180deg, rgba(42,31,14,0.97) 0%, rgba(25,18,8,0.97) 100%)',
      border: '2px solid #c9a84c',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '11px',
      color: '#f4e4c1',
      zIndex: 50,
      pointerEvents: 'auto',
      maxWidth: '600px',
      maxHeight: '70vh',
      overflowY: 'auto',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#c9a84c' }}>
          📜 기술 연구
        </div>
        <div style={{ fontSize: '10px', color: '#a89060' }}>
          🔬{ancientTech} 🏆{gold}
        </div>
        <button onClick={onClose} style={{
          background: 'none',
          border: '1px solid #c9a84c',
          color: '#c9a84c',
          borderRadius: '3px',
          cursor: 'pointer',
          padding: '2px 8px',
          fontSize: '11px',
        }}>✕</button>
      </div>

      {categories.map(cat => {
        const catNodes = nodes.filter(n => n.category === cat);
        if (catNodes.length === 0) return null;
        const catInfo = CATEGORY_LABELS[cat];

        return (
          <div key={cat} style={{ marginBottom: '8px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 'bold',
              color: catInfo.color,
              marginBottom: '4px',
              borderBottom: `1px solid ${catInfo.color}44`,
              paddingBottom: '2px',
            }}>
              {catInfo.label}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {catNodes.map(node => {
                const canAfford = ancientTech >= node.cost.ancientTech && gold >= node.cost.gold;
                const reqsMet = node.requires.every(reqId => {
                  const req = nodes.find(n => n.id === reqId);
                  return req?.researched ?? false;
                });
                const available = !node.researched && node.unlocked && canAfford && reqsMet;

                return (
                  <button
                    key={node.id}
                    onClick={() => available && onResearch(node.id)}
                    style={{
                      border: `1px solid ${node.researched ? '#38a169' : available ? '#c9a84c' : node.unlocked ? '#666' : '#333'}`,
                      borderRadius: '4px',
                      background: node.researched ? 'rgba(56,161,105,0.2)'
                        : available ? 'rgba(201,168,76,0.15)'
                        : 'rgba(30,22,10,0.5)',
                      color: node.researched ? '#38a169' : available ? '#f4e4c1' : '#666',
                      cursor: available ? 'pointer' : 'default',
                      padding: '4px 6px',
                      fontSize: '10px',
                      textAlign: 'left',
                      minWidth: '120px',
                      opacity: node.unlocked ? 1 : 0.4,
                    }}
                    title={`${node.description}\n비용: 🔬${node.cost.ancientTech} 🏆${node.cost.gold}`}
                  >
                    <div style={{ fontWeight: 'bold' }}>
                      {node.icon} {node.name}
                      {node.researched && ' ✓'}
                    </div>
                    <div style={{ fontSize: '9px', color: '#a89060', marginTop: '1px' }}>
                      {node.researched ? '연구 완료' : `🔬${node.cost.ancientTech} 🏆${node.cost.gold}`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
