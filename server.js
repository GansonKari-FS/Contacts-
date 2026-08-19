const express = require("express");
const cors = require("cors");

const contactsRoutes = require("./routes/contactsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/v1/contacts", contactsRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
