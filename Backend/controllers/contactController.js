import { Contact } from '../models/index.js';

export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({ message: 'Contact message saved successfully.', data: contact });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({ message: 'Failed to process contact submission.' });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      order: [['id', 'DESC']],
    });
    return res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return res.status(500).json({ success: false, message: 'Error fetching contacts' });
  }
};

export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    return res.status(200).json({ success: true, data: contact });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return res.status(500).json({ success: false, message: 'Error fetching contact' });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    await contact.destroy();
    return res.status(200).json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return res.status(500).json({ success: false, message: 'Error deleting contact' });
  }
};
