import { request } from './client';

function getUsers() {
  return request('/users');
}

function updateUser(id, payload) {
  return request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

function createUserForAdmin(payload) {
  return request('/users/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

function deleteUser(id) {
  return request(`/users/${id}`, {
    method: 'DELETE',
  });
}

export { getUsers, updateUser, createUserForAdmin, deleteUser };
