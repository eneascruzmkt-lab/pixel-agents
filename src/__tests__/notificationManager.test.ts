import { describe, expect, it } from 'vitest';

import { classifyNotification } from '../notificationManager.js';

describe('classifyNotification', () => {
  it('classifies Write as info', () => {
    const n = classifyNotification('Write', 'src/index.ts');
    expect(n.type).toBe('info');
    expect(n.icon).toBe('[W]');
  });

  it('classifies permission as warning', () => {
    const n = classifyNotification('__permission__', 'Bash');
    expect(n.type).toBe('warning');
    expect(n.icon).toBe('[!]');
  });

  it('classifies done as success', () => {
    const n = classifyNotification('__done__', 'Turn complete');
    expect(n.type).toBe('success');
    expect(n.icon).toBe('[OK]');
  });

  it('classifies error as error', () => {
    const n = classifyNotification('Bash', 'npm test', true);
    expect(n.type).toBe('error');
    expect(n.icon).toBe('[X]');
  });

  it('truncates long text to 30 chars', () => {
    const n = classifyNotification('Read', 'a'.repeat(50));
    expect(n.text.length).toBeLessThanOrEqual(33); // 30 + "..."
  });
});
