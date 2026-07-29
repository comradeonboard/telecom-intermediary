function requireFields(...fields) {
  return (req, res, next) => {
    const missing = fields.filter((f) => !req.body[f]);
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });
    }
    next();
  };
}

function validateCompany(req, res, next) {
  const { name, sector, contact_email, phone, address } = req.body;
  const errors = [];
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("name is required and must be a non-empty string");
  }
  if (contact_email && !contact_email.includes("@")) {
    errors.push("contact_email must be a valid email");
  }
  if (sector && typeof sector !== "string") {
    errors.push("sector must be a string");
  }
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join("; ") });
  }
  next();
}

function validateCustomer(req, res, next) {
  const { name, email, phone, company_id } = req.body;
  const errors = [];
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("name is required and must be a non-empty string");
  }
  if (email && !email.includes("@")) {
    errors.push("email must be a valid email address");
  }
  if (company_id != null && isNaN(Number(company_id))) {
    errors.push("company_id must be a number");
  }
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join("; ") });
  }
  next();
}

function validateFeedback(req, res, next) {
  const { customer_id, company_id, subject, message } = req.body;
  const errors = [];
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    errors.push("message is required and must be a non-empty string");
  }
  if (customer_id != null && isNaN(Number(customer_id))) {
    errors.push("customer_id must be a number");
  }
  if (company_id != null && isNaN(Number(company_id))) {
    errors.push("company_id must be a number");
  }
  if (subject && typeof subject !== "string") {
    errors.push("subject must be a string");
  }
  if (req.params.id && isNaN(Number(req.params.id))) {
    errors.push("id must be a valid number");
  }
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join("; ") });
  }
  next();
}

module.exports = {
  requireFields,
  validateCompany,
  validateCustomer,
  validateFeedback,
};