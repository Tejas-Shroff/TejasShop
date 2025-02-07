import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from './model';
import { NOTIFICATION_MESSAGES } from '../constants/messages';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private notifications: Notification[] = [];
  constructor() {}

  private addNotification(notification: Notification) {
    this.notifications.push(notification);
    this.notificationsSubject.next(this.notifications);

    if (notification.duration) {
      setTimeout(
        () => this.removeNotification(notification),
        notification.duration
      );
    }
  }

  removeNotification(notification: Notification) {
    this.notifications = this.notifications.filter((n) => n !== notification);
    this.notificationsSubject.next(this.notifications);
  }

  clearNotifications() {
    this.notifications = [];
    this.notificationsSubject.next(this.notifications);
  }

  Success(message: string = NOTIFICATION_MESSAGES.SUCCESS, duration: number = 2000) {
    this.addNotification({
      message,
      type: 'success',
      duration,
    });
  }

  Error(message: string = NOTIFICATION_MESSAGES.ERROR, duration: number = 3000) {
    this.addNotification({
      message,
      type: 'error',
      duration,
    });
  }

  Warning(message: string = NOTIFICATION_MESSAGES.WARNING, duration: number = 3000) {
    this.addNotification({
      message,
      type: 'warning',
      duration,
    });
  }
  Info(message: string = NOTIFICATION_MESSAGES.WARNING, duration: number = 3000) {
    this.addNotification({
      message,
      type: 'info',
      duration,
    });
  }
}
