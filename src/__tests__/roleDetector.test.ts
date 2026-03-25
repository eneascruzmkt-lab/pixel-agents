import { describe, expect, it } from 'vitest';

import { detectRole } from '../roleDetector.js';

describe('detectRole', () => {
  it('returns CODER for Write tool', () => {
    expect(detectRole('Write')).toBe('CODER');
  });
  it('returns CODER for Edit tool', () => {
    expect(detectRole('Edit')).toBe('CODER');
  });
  it('returns REVIEWER for Read tool', () => {
    expect(detectRole('Read')).toBe('REVIEWER');
  });
  it('returns REVIEWER for Grep tool', () => {
    expect(detectRole('Grep')).toBe('REVIEWER');
  });
  it('returns TESTER for Bash with test command', () => {
    expect(detectRole('Bash', 'npm test')).toBe('TESTER');
  });
  it('returns TESTER for Bash with jest', () => {
    expect(detectRole('Bash', 'npx jest')).toBe('TESTER');
  });
  it('returns PLANNER for EnterPlanMode', () => {
    expect(detectRole('EnterPlanMode')).toBe('PLANNER');
  });
  it('returns PLANNER for TaskCreate', () => {
    expect(detectRole('TaskCreate')).toBe('PLANNER');
  });
  it('returns DEBUGGER for Bash with debug pattern', () => {
    expect(detectRole('Bash', 'node --inspect')).toBe('DEBUGGER');
  });
  it('returns null for unknown tool', () => {
    expect(detectRole('Unknown')).toBeNull();
  });
});
