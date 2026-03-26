import { request } from './client';

function getPackages() {
  return request('/packages');
}

function getPackageById(id) {
  return request(`/packages/${id}`);
}

function createPackage(payload) {
  return request('/packages', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

function updatePackage(id, payload) {
  return request(`/packages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

function deletePackage(id) {
  return request(`/packages/${id}`, {
    method: 'DELETE',
  });
}

export { getPackageById, getPackages, createPackage, updatePackage, deletePackage };
