export type EventType =
  | 'assistantMessage'
  | 'toolStart'
  | 'toolDone'
  | 'toolsClear'
  | 'userMessage'
  | 'turnEnd'
  | 'subagentToolStart'
  | 'subagentToolDone'
  | 'permissionNeeded'
  | 'agentWaiting';

export interface TranscriptEvent {
  agentId: number;
  [key: string]: any;
}

type Handler = (event: TranscriptEvent) => void;

export class TranscriptEventBus {
  private listeners = new Map<EventType, Set<Handler>>();

  subscribe(eventType: EventType, handler: Handler): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(handler);
    return () => {
      this.listeners.get(eventType)?.delete(handler);
    };
  }

  emit(eventType: EventType, event: TranscriptEvent): void {
    const handlers = this.listeners.get(eventType);
    if (!handlers) return;
    for (const handler of handlers) {
      try {
        handler(event);
      } catch (err) {
        console.error(`[TranscriptEventBus] Subscriber error on ${eventType}:`, err);
      }
    }
  }
}
