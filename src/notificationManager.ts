import type { TranscriptEventBus } from './transcriptEventBus.js';

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  type: NotificationType;
  icon: string;
  text: string;
  color: string;
}

const TYPE_CONFIG: Record<NotificationType, { icon: string; color: string }> = {
  info: { icon: '[W]', color: '#00d2ff' },
  warning: { icon: '[!]', color: '#ffa500' },
  success: { icon: '[OK]', color: '#00ff88' },
  error: { icon: '[X]', color: '#ff4444' },
};

export function classifyNotification(
  toolName: string,
  status: string,
  isError = false,
): Notification {
  let type: NotificationType = 'info';

  if (toolName === '__permission__') {
    type = 'warning';
  } else if (isError) {
    type = 'error';
  } else if (toolName === '__done__') {
    type = 'success';
  }

  const config = TYPE_CONFIG[type];
  const truncated = status.length > 30 ? status.slice(0, 30) + '...' : status;

  return {
    type,
    icon: config.icon,
    text: truncated,
    color: config.color,
  };
}

export function subscribeNotificationManager(
  bus: TranscriptEventBus,
  postMessage: (msg: unknown) => void,
): () => void {
  const unsub1 = bus.subscribe('toolStart', (event) => {
    const notif = classifyNotification(event.toolName, event.status || event.toolName);
    postMessage({
      type: 'agentNotification',
      agentId: event.agentId,
      notification: notif,
    });
  });

  const unsub2 = bus.subscribe('permissionNeeded', (event) => {
    const notif = classifyNotification('__permission__', 'Needs permission');
    postMessage({
      type: 'agentNotification',
      agentId: event.agentId,
      notification: notif,
    });
  });

  const unsub3 = bus.subscribe('turnEnd', (event) => {
    const notif = classifyNotification('__done__', 'Turn complete');
    postMessage({
      type: 'agentNotification',
      agentId: event.agentId,
      notification: notif,
    });
  });

  return () => {
    unsub1();
    unsub2();
    unsub3();
  };
}
