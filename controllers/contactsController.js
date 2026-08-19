const contacts = require("../data/contacts");

const getContacts = (req, res) => {
  res.status(200).json(contacts);
};

const getContactById = (req, res) => {
  const contact = contacts.find(
    (contact) => String(contact.id) === String(req.params.id),
  );

  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  res.status(200).json(contact);
};

const createContact = (req, res) => {
  const newContact = {
    id: String(
      contacts.length
        ? Math.max(...contacts.map((contact) => Number(contact.id))) + 1
        : 1,
    ),
    ...req.body,
  };

  contacts.push(newContact);
  res.status(201).json(newContact);
};

const updateContact = (req, res) => {
  const index = contacts.findIndex(
    (contact) => String(contact.id) === String(req.params.id),
  );

  if (index === -1) {
    return res.status(404).json({ message: "Contact not found" });
  }

  contacts[index] = {
    ...contacts[index],
    ...req.body,
    id: contacts[index].id,
  };

  res.status(200).json(contacts[index]);
};

const deleteContact = (req, res) => {
  const index = contacts.findIndex(
    (contact) => String(contact.id) === String(req.params.id),
  );

  if (index === -1) {
    return res.status(404).json({ message: "Contact not found" });
  }

  const deletedContact = contacts.splice(index, 1)[0];

  res.status(200).json(deletedContact);
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
