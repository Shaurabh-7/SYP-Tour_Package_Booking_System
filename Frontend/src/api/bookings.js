import { request } from './client';

function getBookings() {
  return request('/bookings');
}

function getBookingById(id) {
  return request(`/bookings/${id}`);
}

function createBooking(payload) {
  return request('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

function updateBooking(id, payload) {
  return request(`/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

function deleteBooking(id) {
  return request(`/bookings/${id}`, {
    method: 'DELETE',
  });
}

export { createBooking, deleteBooking, getBookingById, getBookings, updateBooking };
