import { request } from './client';

function submitAgencyRequest(payload) {
  return request('/agency-requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

function getMyAgencyRequest() {
  return request('/agency-requests/mine');
}

function getAllAgencyRequests() {
  return request('/agency-requests');
}

function handleAgencyRequest(id, payload) {
  return request(`/agency-requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export { submitAgencyRequest, getMyAgencyRequest, getAllAgencyRequests, handleAgencyRequest };
