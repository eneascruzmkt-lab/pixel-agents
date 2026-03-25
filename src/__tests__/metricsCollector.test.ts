import { describe, expect, it } from 'vitest';

import { MetricsCollector } from '../metricsCollector';

describe('MetricsCollector', () => {
  it('should count tool usage', () => {
    const mc = new MetricsCollector();
    mc.recordToolUse(1, 'Read');
    mc.recordToolUse(1, 'Read');
    mc.recordToolUse(1, 'Write');
    const breakdown = mc.getToolBreakdown();
    expect(breakdown).toEqual([
      { tool: 'Read', count: 2 },
      { tool: 'Write', count: 1 },
    ]);
  });

  it('should track active agent count', () => {
    const mc = new MetricsCollector();
    mc.addAgent(1);
    mc.addAgent(2);
    expect(mc.getActiveAgentCount()).toBe(2);
    mc.removeAgent(1);
    expect(mc.getActiveAgentCount()).toBe(1);
  });

  it('should track total tokens', () => {
    const mc = new MetricsCollector();
    mc.updateTokens(1, 50000);
    mc.updateTokens(2, 30000);
    expect(mc.getTotalTokens()).toBe(80000);
  });

  it('should return session duration', () => {
    const mc = new MetricsCollector();
    expect(mc.getSessionDurationMs()).toBeGreaterThanOrEqual(0);
  });
});
