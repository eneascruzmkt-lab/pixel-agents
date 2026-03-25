import type { TranscriptEventBus } from './transcriptEventBus.js';

export type AgentRole = 'CODER' | 'REVIEWER' | 'TESTER' | 'PLANNER' | 'DEBUGGER';

export const ROLE_COLORS: Record<AgentRole, string> = {
  CODER: '#e94560',
  REVIEWER: '#00d2ff',
  TESTER: '#00ff88',
  PLANNER: '#ffa500',
  DEBUGGER: '#b366ff',
};

const TESTER_PATTERNS = /\b(test|jest|pytest|vitest|mocha|karma|cypress|playwright)\b/i;
const DEBUG_PATTERNS = /\b(debug|inspect|--inspect|debugger|gdb|lldb)\b/i;

const TOOL_ROLE_MAP: Record<string, AgentRole> = {
  Write: 'CODER',
  Edit: 'CODER',
  Read: 'REVIEWER',
  Grep: 'REVIEWER',
  Glob: 'REVIEWER',
  WebFetch: 'REVIEWER',
  WebSearch: 'REVIEWER',
  EnterPlanMode: 'PLANNER',
  TaskCreate: 'PLANNER',
  TaskUpdate: 'PLANNER',
};

export function detectRole(toolName: string, bashCommand?: string): AgentRole | null {
  if (toolName === 'Bash' && bashCommand) {
    if (TESTER_PATTERNS.test(bashCommand)) return 'TESTER';
    if (DEBUG_PATTERNS.test(bashCommand)) return 'DEBUGGER';
    return 'CODER';
  }
  return TOOL_ROLE_MAP[toolName] ?? null;
}

export function subscribeRoleDetector(
  bus: TranscriptEventBus,
  agents: Map<number, { currentRole?: string | null; manualRoleOverride?: string | null }>,
  postMessage: (msg: unknown) => void,
): () => void {
  return bus.subscribe('toolStart', (event) => {
    const agent = agents.get(event.agentId);
    if (!agent || agent.manualRoleOverride) return;
    const role = detectRole(event.toolName as string, event.input?.command as string | undefined);
    if (role && role !== agent.currentRole) {
      agent.currentRole = role;
      postMessage({
        type: 'agentRoleChanged',
        agentId: event.agentId,
        role,
        color: ROLE_COLORS[role],
      });
    }
  });
}
