import './MetricsDashboard.css';

interface MetricsData {
  activeAgents: number;
  totalTokens: number;
  toolBreakdown: { tool: string; count: number }[];
  perAgentTokens: { agentId: number; tokens: number }[];
  sessionDurationMs: number;
}

interface Props {
  data: MetricsData;
  onClose: () => void;
}

function formatDuration(ms: number): string {
  const min = Math.floor(ms / 60000);
  return `${min}min`;
}

function formatTokens(n: number): string {
  return n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`;
}

export type { MetricsData };

export function MetricsDashboard({ data, onClose }: Props) {
  const maxCount = data.toolBreakdown[0]?.count ?? 1;

  return (
    <div className="metrics-panel">
      <div className="metrics-header">
        <span className="metrics-title">Metrics</span>
        <span className="metrics-duration">{formatDuration(data.sessionDurationMs)}</span>
        <button className="metrics-close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="metrics-cards">
        <div className="metrics-card">
          <div className="metrics-card-value" style={{ color: '#e94560' }}>
            {data.activeAgents}
          </div>
          <div className="metrics-card-label">ACTIVE AGENTS</div>
        </div>
        <div className="metrics-card">
          <div className="metrics-card-value" style={{ color: '#00d2ff' }}>
            {formatTokens(data.totalTokens)}
          </div>
          <div className="metrics-card-label">TOTAL TOKENS</div>
        </div>
      </div>

      <div className="metrics-section">
        <div className="metrics-label">MOST USED TOOLS</div>
        {data.toolBreakdown.slice(0, 6).map((entry) => (
          <div key={entry.tool} className="metrics-tool-row">
            <div className="metrics-tool-header">
              <span>{entry.tool}</span>
              <span>{entry.count}x</span>
            </div>
            <div className="metrics-tool-bar">
              <div
                className="metrics-tool-fill"
                style={{ width: `${(entry.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="metrics-section">
        <div className="metrics-label">TOKENS PER AGENT</div>
        {data.perAgentTokens.map((entry) => (
          <div key={entry.agentId} className="metrics-agent-row">
            <span>Agent-{entry.agentId}</span>
            <span>{formatTokens(entry.tokens)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
