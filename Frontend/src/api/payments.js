import { request } from './client';

export function initiatePayment(bookingId) {
  return request('/payments/initiate', {
    method: 'POST',
    body: JSON.stringify({ bookingId }),
  });
}

export function verifyPayment(encodedResponse) {
  return request('/payments/verify', {
    method: 'POST',
    body: JSON.stringify({ encodedResponse }),
  });
}
