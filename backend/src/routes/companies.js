const express = require("express");
const router = express.Router();
const { getDb } = require("../db/database");
const { validateCompany } = require("../middleware/validate");

router.get("/", async (_req, res) => {
  const db = await getDb();
  const companies = db.prepare("SELECT * FROM companies ORDER BY created_at DESC").all();
  res.json(companies);
});

router.get("/:id", async (req, res) => {
  const db = await getDb();
  const company = db.prepare("SELECT * FROM companies WHERE id = ?").get(req.params.id);
  if (!company) return res.status(404).json({ error: "Company not found" });
  res.json(company);
});

router.post("/", validateCompany, async (req, res) => {
  const { name, sector, contact_email, phone, address } = req.body;
  const db = await getDb();
  const result = db.prepare(
    "INSERT INTO companies (name, sector, contact_email, phone, address) VALUES (?, ?, ?, ?, ?)"
  ).run(name, sector || "telecom", contact_email || null, phone || null, address || null);
  const company = db.prepare("SELECT * FROM companies WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(company);
});

router.patch("/:id", validateCompany, async (req, res) => {
  const { name, sector, contact_email, phone, address } = req.body;
  const db = await getDb();
  const existing = db.prepare("SELECT * FROM companies WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Company not found" });
  db.prepare(
    "UPDATE companies SET name = COALESCE(?, name), sector = COALESCE(?, sector), contact_email = COALESCE(?, contact_email), phone = COALESCE(?, phone), address = COALESCE(?, address) WHERE id = ?"
  ).run(name, sector, contact_email, phone, address, req.params.id);
  const updated = db.prepare("SELECT * FROM companies WHERE id = ?").get(req.params.id);
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const db = await getDb();
  const existing = db.prepare("SELECT * FROM companies WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Company not found" });
  db.prepare("DELETE FROM companies WHERE id = ?").run(req.params.id);
  res.status(204).send();
});

module.exports = router;