import type { TranscriptEventBus } from './transcriptEventBus.js';

export class MetricsCollector {
  private toolCounts = new Map<string, number>();
  private activeAgents = new Set<number>();
  private agentTokens = new Map<number, number>();
  private sessionStart = Date.now();

  recordToolUse(_agentId: number, toolName: string): void {
    this.toolCounts.set(toolName, (this.toolCounts.get(toolName) ?? 0) + 1);
  }

  addAgent(agentId: number): void {
    this.activeAgents.add(agentId);
  }

  removeAgent(agentId: number): void {
    this.activeAgents.delete(agentId);
  }

  updateTokens(agentId: number, inputTokens: number): void {
    this.agentTokens.set(agentId, inputTokens);
  }

  getActiveAgentCount(): number {
    return this.activeAgents.size;
  }

  getTotalTokens(): number {
    let total = 0;
    for (const tokens of this.agentTokens.values()) {
      total += tokens;
    }
    return total;
  }

  getToolBreakdown(): { tool: string; count: number }[] {
    return Array.from(this.toolCounts.entries())
      .map(([tool, count]) => ({ tool, count }))
      .sort((a, b) => b.count - a.count);
  }

  getPerAgentTokens(): { agentId: number; tokens: number }[] {
    return Array.from(this.agentTokens.entries()).map(([agentId, tokens]) => ({ agentId, tokens }));
  }

  getSessionDurationMs(): number {
    return Date.now() - this.sessionStart;
  }

  getSnapshot() {
    return {
      activeAgents: this.getActiveAgentCount(),
      totalTokens: this.getTotalTokens(),
      toolBreakdown: this.getToolBreakdown(),
      perAgentTokens: this.getPerAgentTokens(),
      sessionDurationMs: this.getSessionDurationMs(),
    };
  }
}

export function subscribeMetricsCollector(
  bus: TranscriptEventBus,
  collector: MetricsCollector,
): () => void {
  const unsub1 = bus.subscribe('toolStart', (event) => {
    collector.recordToolUse(event.agentId, event.toolName);
  });

  const unsub2 = bus.subscribe('assistantMessage', (event) => {
    if (event.usage) {
      collector.updateTokens(event.agentId, event.usage.input_tokens);
    }
  });

  return () => {
    unsub1();
    unsub2();
  };
}
