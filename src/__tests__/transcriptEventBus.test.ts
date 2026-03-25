import { describe, expect, it, vi } from 'vitest';

import { TranscriptEventBus } from '../transcriptEventBus.js';

describe('TranscriptEventBus', () => {
  it('should deliver events to subscribers', () => {
    const bus = new TranscriptEventBus();
    const handler = vi.fn();
    bus.subscribe('toolStart', handler);
    bus.emit('toolStart', { agentId: 1, toolName: 'Read' });
    expect(handler).toHaveBeenCalledWith({ agentId: 1, toolName: 'Read' });
  });

  it('should not throw if subscriber throws', () => {
    const bus = new TranscriptEventBus();
    bus.subscribe('toolStart', () => {
      throw new Error('boom');
    });
    const spy = vi.fn();
    bus.subscribe('toolStart', spy);
    expect(() => bus.emit('toolStart', { agentId: 1 })).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  it('should allow unsubscribe', () => {
    const bus = new TranscriptEventBus();
    const handler = vi.fn();
    const unsub = bus.subscribe('toolStart', handler);
    unsub();
    bus.emit('toolStart', { agentId: 1 });
    expect(handler).not.toHaveBeenCalled();
  });
});
