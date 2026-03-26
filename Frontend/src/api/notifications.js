import { request } from './client';

function getNotifications() {
  return request('/notifications');
}

function markNotificationRead(id) {
  return request(`/notifications/${id}/read`, {
    method: 'PUT',
  });
}

function markAllNotificationsRead() {
  return request('/notifications/read-all', {
    method: 'PUT',
  });
}

export { getNotifications, markNotificationRead, markAllNotificationsRead };
