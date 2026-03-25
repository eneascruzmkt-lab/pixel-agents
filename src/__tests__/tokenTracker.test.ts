import { describe, expect, it } from 'vitest';

import { TokenTracker } from '../tokenTracker';

describe('TokenTracker', () => {
  it('should calculate percentage from latest input_tokens', () => {
    const tracker = new TokenTracker(200000);
    tracker.update(1, { input_tokens: 50000, output_tokens: 1000 });
    expect(tracker.getPercentageRemaining(1)).toBe(75);
  });

  it('should use latest value, not sum', () => {
    const tracker = new TokenTracker(200000);
    tracker.update(1, { input_tokens: 50000, output_tokens: 500 });
    tracker.update(1, { input_tokens: 100000, output_tokens: 500 });
    expect(tracker.getPercentageRemaining(1)).toBe(50);
  });

  it('should return null for unknown agent', () => {
    const tracker = new TokenTracker(200000);
    expect(tracker.getPercentageRemaining(999)).toBeNull();
  });

  it('should return color based on percentage', () => {
    const tracker = new TokenTracker(200000);
    tracker.update(1, { input_tokens: 50000, output_tokens: 0 });
    expect(tracker.getColor(1)).toBe('#00ff88'); // 75% = green

    tracker.update(2, { input_tokens: 120000, output_tokens: 0 });
    expect(tracker.getColor(2)).toBe('#ffa500'); // 40% = yellow

    tracker.update(3, { input_tokens: 170000, output_tokens: 0 });
    expect(tracker.getColor(3)).toBe('#ff4444'); // 15% = red
  });

  it('should track staleness', () => {
    const tracker = new TokenTracker(200000);
    tracker.update(1, { input_tokens: 50000, output_tokens: 0 });
    expect(tracker.isStale(1, 60000)).toBe(false);
  });
});
