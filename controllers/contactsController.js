const contacts = require("../data/contacts");

const getContacts = (req, res) => {
  let results = [...contacts];

  // Filtering
  const filterBy = req.headers["x-filter-by"];
  const filterOperator = req.headers["x-filter-operator"];
  const filterValue = req.headers["x-filter-value"];

  if (filterBy && filterOperator && filterValue !== undefined) {
    results = results.filter((contact) => {
      const contactValue = contact[filterBy];

      if (contactValue === undefined) {
        return false;
      }

      switch (filterOperator) {
        case "eq":
          return String(contactValue) === String(filterValue);

        case "gt":
          return contactValue > filterValue;

        case "gte":
          return contactValue >= filterValue;

        case "lt":
          return contactValue < filterValue;

        case "lte":
          return contactValue <= filterValue;

        default:
          return true;
      }
    });
  }

  // Sorting
  const sort = req.query.sort;
  const direction = req.query.direction || "asc";

  // Sorting
  const sort = req.query.sort;
  const direction = req.query.direction || "asc";

  if (sort) {
    results.sort((a, b) => {
      const aValue = String(a[sort]).toLowerCase();
      const bValue = String(b[sort]).toLowerCase();

      if (aValue < bValue) {
        return direction === "asc" ? 1 : -1;
      }

      if (aValue > bValue) {
        return direction === "asc" ? -1 : 1;
      }

      return 0;
    });
  }

  // Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const start = (page - 1) * limit;
  const end = start + limit;

  results = results.slice(start, end);

  res.status(200).json(results);
};

const getContactById = (req, res) => {
  const contact = contacts.find(
    (contact) => String(contact.id) === String(req.params.id),
  );

  if (!contact) {
    return res.status(404).json({
      message: "Contact not found",
    });
  }

  res.status(200).json(contact);
};

const createContact = (req, res) => {
  const newId = contacts.length
    ? Math.max(...contacts.map((contact) => Number(contact.id))) + 1
    : 1;

  const newContact = {
    id: newId,
    ...req.body,
  };

  contacts.push(newContact);

  res.status(303).location(`/v1/contacts/${newContact.id}`).end();
};

const updateContact = (req, res) => {
  const index = contacts.findIndex(
    (contact) => String(contact.id) === String(req.params.id),
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Contact not found",
    });
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
    return res.status(404).json({
      message: "Contact not found",
    });
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
