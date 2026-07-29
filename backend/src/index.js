const express = require("express");
const cors = require("cors");
const { getDb } = require("./db/database");
const companiesRouter = require("./routes/companies");
const customersRouter = require("./routes/customers");
const feedbackRouter = require("./routes/feedback");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/companies", companiesRouter);
app.use("/api/customers", customersRouter);
app.use("/api/feedback", feedbackRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3001;

getDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
