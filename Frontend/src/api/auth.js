import { request } from './client';

function loginUser(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

function registerUser(userData) {
  return request('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

function logoutUser() {
  return request('/auth/logout', {
    method: 'POST',
  });
}

function fetchProfile() {
  return request('/users/profile');
}

export { fetchProfile, loginUser, logoutUser, registerUser };
