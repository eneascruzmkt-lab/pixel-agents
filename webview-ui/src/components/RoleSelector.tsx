const ROLES = [
  { id: 'CODER', color: '#e94560' },
  { id: 'REVIEWER', color: '#00d2ff' },
  { id: 'TESTER', color: '#00ff88' },
  { id: 'PLANNER', color: '#ffa500' },
  { id: 'DEBUGGER', color: '#b366ff' },
];

interface Props {
  x: number;
  y: number;
  agentId: number;
  onSelect: (agentId: number, role: string) => void;
  onClose: () => void;
}

export function RoleSelector({ x, y, agentId, onSelect, onClose }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: 200,
        background: '#0f0f1e',
        border: '2px solid #2a2a4a',
        borderRadius: 0,
        padding: 4,
        boxShadow: '2px 2px 0px #0a0a14',
      }}
      onMouseLeave={onClose}
    >
      {ROLES.map((r) => (
        <div
          key={r.id}
          onClick={() => onSelect(agentId, r.id)}
          style={{
            padding: '4px 8px',
            cursor: 'pointer',
            color: r.color,
            fontFamily: 'monospace',
            fontSize: 10,
          }}
        >
          {r.id}
        </div>
      ))}
      <div
        onClick={() => onSelect(agentId, '')}
        style={{
          padding: '4px 8px',
          cursor: 'pointer',
          color: '#666',
          fontFamily: 'monospace',
          fontSize: 10,
        }}
      >
        AUTO
      </div>
    </div>
  );
}
