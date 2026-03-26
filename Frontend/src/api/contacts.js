import { request } from './client';

export const submitContact = (data) => {
  return request('/contacts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getAllContacts = () => {
  return request('/contacts');
};

export const deleteContact = (id) => {
  return request(`/contacts/${id}`, {
    method: 'DELETE',
  });
};
