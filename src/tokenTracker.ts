import type { TranscriptEventBus } from './transcriptEventBus.js';

export interface UsageData {
  input_tokens: number;
  output_tokens: number;
}

interface AgentTokenState {
  latestInputTokens: number;
  latestOutputTokens: number;
  lastUpdated: number;
}

export class TokenTracker {
  private agents = new Map<number, AgentTokenState>();
  private contextLimit: number;

  constructor(contextLimit = 200000) {
    this.contextLimit = contextLimit;
  }

  update(agentId: number, usage: UsageData): void {
    this.agents.set(agentId, {
      latestInputTokens: usage.input_tokens,
      latestOutputTokens: usage.output_tokens,
      lastUpdated: Date.now(),
    });
  }

  getPercentageRemaining(agentId: number): number | null {
    const state = this.agents.get(agentId);
    if (!state) return null;
    const used = state.latestInputTokens;
    const remaining = Math.max(0, this.contextLimit - used);
    return Math.round((remaining / this.contextLimit) * 100);
  }

  getColor(agentId: number): string | null {
    const pct = this.getPercentageRemaining(agentId);
    if (pct === null) return null;
    if (pct > 60) return '#00ff88';
    if (pct > 30) return '#ffa500';
    return '#ff4444';
  }

  getAbsoluteUsage(agentId: number): { used: number; limit: number } | null {
    const state = this.agents.get(agentId);
    if (!state) return null;
    return { used: state.latestInputTokens, limit: this.contextLimit };
  }

  isStale(agentId: number, stalenessMs: number): boolean {
    const state = this.agents.get(agentId);
    if (!state) return true;
    return Date.now() - state.lastUpdated > stalenessMs;
  }

  remove(agentId: number): void {
    this.agents.delete(agentId);
  }

  setContextLimit(limit: number): void {
    this.contextLimit = limit;
  }
}

export function subscribeTokenTracker(
  bus: TranscriptEventBus,
  tracker: TokenTracker,
  postMessage: (msg: unknown) => void,
): () => void {
  return bus.subscribe('assistantMessage', (event) => {
    if (!event.usage) return;
    tracker.update(event.agentId, event.usage);
    const pct = tracker.getPercentageRemaining(event.agentId);
    const color = tracker.getColor(event.agentId);
    const abs = tracker.getAbsoluteUsage(event.agentId);
    const stale = tracker.isStale(event.agentId, 60000);
    postMessage({
      type: 'agentTokenUpdate',
      agentId: event.agentId,
      percentage: pct,
      color,
      used: abs?.used,
      limit: abs?.limit,
      stale,
    });
  });
}
