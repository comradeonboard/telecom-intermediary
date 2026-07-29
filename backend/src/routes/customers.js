const express = require("express");
const router = express.Router();
const { getDb } = require("../db/database");

router.get("/", async (_req, res) => {
  const db = await getDb();
  const customers = db.prepare(`
    SELECT c.*, co.name as company_name
    FROM customers c
    LEFT JOIN companies co ON c.company_id = co.id
    ORDER BY c.created_at DESC
  `).all();
  res.json(customers);
});

router.get("/:id", async (req, res) => {
  const db = await getDb();
  const customer = db.prepare(`
    SELECT c.*, co.name as company_name
    FROM customers c
    LEFT JOIN companies co ON c.company_id = co.id
    WHERE c.id = ?
  `).get(req.params.id);
  if (!customer) return res.status(404).json({ error: "Customer not found" });
  res.json(customer);
});

router.post("/", async (req, res) => {
  const { name, email, phone, company_id } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  const db = await getDb();
  const result = db.prepare(
    "INSERT INTO customers (name, email, phone, company_id) VALUES (?, ?, ?, ?)"
  ).run(name, email || null, phone || null, company_id || null);
  const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(customer);
});

router.patch("/:id", async (req, res) => {
  const { name, email, phone, company_id } = req.body;
  const db = await getDb();
  const existing = db.prepare("SELECT * FROM customers WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Customer not found" });
  db.prepare(
    "UPDATE customers SET name = COALESCE(?, name), email = COALESCE(?, email), phone = COALESCE(?, phone), company_id = COALESCE(?, company_id) WHERE id = ?"
  ).run(name, email, phone, company_id, req.params.id);
  const updated = db.prepare("SELECT * FROM customers WHERE id = ?").get(req.params.id);
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const db = await getDb();
  const existing = db.prepare("SELECT * FROM customers WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Customer not found" });
  db.prepare("DELETE FROM customers WHERE id = ?").run(req.params.id);
  res.status(204).send();
});

module.exports = router;