import './InspectionPanel.css';

interface ToolHistoryEntry {
  toolName: string;
  status: string;
  timestamp: number;
}

export interface InspectData {
  agentId: number;
  role: string | null;
  roleColor: string | null;
  tokenUsed: number | null;
  tokenLimit: number | null;
  tokenPercentage: number | null;
  tokenColor: string | null;
  toolHistory: ToolHistoryEntry[];
  activeTools: string[];
}

interface Props {
  data: InspectData;
  onClose: () => void;
}

function formatTokens(n: number): string {
  return n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`;
}

export function InspectionPanel({ data, onClose }: Props) {
  return (
    <div className="inspection-panel">
      <div className="inspection-header">
        <span className="inspection-agent-name">Agent-{data.agentId}</span>
        {data.role && (
          <span className="inspection-role-badge" style={{ background: data.roleColor || '#666' }}>
            {data.role}
          </span>
        )}
        <button className="inspection-close" onClick={onClose}>
          ✕
        </button>
      </div>

      {data.tokenPercentage !== null && (
        <div className="inspection-section">
          <div className="inspection-label">TOKENS</div>
          <div className="inspection-token-bar">
            <div
              className="inspection-token-fill"
              style={{
                width: `${data.tokenPercentage}%`,
                background: data.tokenColor || '#888',
              }}
            />
          </div>
          <span className="inspection-token-text">
            {formatTokens(data.tokenUsed!)} / {formatTokens(data.tokenLimit!)}
          </span>
        </div>
      )}

      {data.activeTools.length > 0 && (
        <div className="inspection-section">
          <div className="inspection-label">CURRENT ACTIVITY</div>
          {data.activeTools.map((tool, i) => (
            <div key={i} className="inspection-active-tool">
              {tool}
            </div>
          ))}
        </div>
      )}

      <div className="inspection-section">
        <div className="inspection-label">RECENT ACTIONS</div>
        {data.toolHistory.map((entry, i) => (
          <div key={i} className="inspection-history-entry">
            <span className="inspection-tool-name">{entry.toolName}</span>
            <span className="inspection-tool-status">{entry.status}</span>
          </div>
        ))}
        {data.toolHistory.length === 0 && (
          <div className="inspection-empty">No actions recorded</div>
        )}
      </div>
    </div>
  );
}
