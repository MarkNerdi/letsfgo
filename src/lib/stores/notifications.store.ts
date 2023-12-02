import { writable } from 'svelte/store';

const TIMEOUT = 3000;

export enum NotificationType {
    Error = 'error',
    Success = 'success'
}

export type Notification = {
    id: string,
    type: NotificationType,
    message: string,
}

export const notifications = writable<Notification[]>([]);

export function removeDisplayNotification(id: string): void {
    notifications.update((_currentNotifications) => {
        const idx = _currentNotifications.findIndex((n) => n.id === id);
        if (idx >= 0) {
            _currentNotifications.splice(idx, 1);
        }
        return _currentNotifications;
    });
}

export function showNotification(notificationType: NotificationType, message: string): void {
    const id = Math.random().toString(36).substring(2, 9);
    const notificationData = { id, type: notificationType, message };
    notifications.update((_currentNotifications) => [..._currentNotifications, notificationData]);

    setTimeout(() => removeDisplayNotification(notificationData.id), TIMEOUT);
}
