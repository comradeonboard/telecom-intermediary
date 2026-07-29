const express = require("express");
const router = express.Router();
const { getDb } = require("../db/database");

router.get("/", async (_req, res) => {
  const db = await getDb();
  const feedback = db.prepare(`
    SELECT f.*, c.name as customer_name, co.name as company_name
    FROM feedback f
    LEFT JOIN customers c ON f.customer_id = c.id
    LEFT JOIN companies co ON f.company_id = co.id
    ORDER BY f.created_at DESC
  `).all();
  res.json(feedback);
});

router.get("/:id", async (req, res) => {
  const db = await getDb();
  const item = db.prepare(`
    SELECT f.*, c.name as customer_name, co.name as company_name
    FROM feedback f
    LEFT JOIN customers c ON f.customer_id = c.id
    LEFT JOIN companies co ON f.company_id = co.id
    WHERE f.id = ?
  `).get(req.params.id);
  if (!item) return res.status(404).json({ error: "Feedback not found" });
  res.json(item);
});

router.post("/", async (req, res) => {
  const { customer_id, company_id, subject, message } = req.body;
  if (!message) return res.status(400).json({ error: "message is required" });
  const db = await getDb();
  const result = db.prepare(
    "INSERT INTO feedback (customer_id, company_id, subject, message) VALUES (?, ?, ?, ?)"
  ).run(customer_id || null, company_id || null, subject || null, message);
  const feedback = db.prepare(`
    SELECT f.*, c.name as customer_name, co.name as company_name
    FROM feedback f
    LEFT JOIN customers c ON f.customer_id = c.id
    LEFT JOIN companies co ON f.company_id = co.id
    WHERE f.id = ?
  `).get(result.lastInsertRowid);
  res.status(201).json(feedback);
});

router.patch("/:id", async (req, res) => {
  const { subject, message, status } = req.body;
  const db = await getDb();
  const existing = db.prepare("SELECT * FROM feedback WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Feedback not found" });
  db.prepare(
    "UPDATE feedback SET subject = COALESCE(?, subject), message = COALESCE(?, message), status = COALESCE(?, status) WHERE id = ?"
  ).run(subject, message, status, req.params.id);
  const updated = db.prepare(`
    SELECT f.*, c.name as customer_name, co.name as company_name
    FROM feedback f
    LEFT JOIN customers c ON f.customer_id = c.id
    LEFT JOIN companies co ON f.company_id = co.id
    WHERE f.id = ?
  `).get(req.params.id);
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const db = await getDb();
  const existing = db.prepare("SELECT * FROM feedback WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Feedback not found" });
  db.prepare("DELETE FROM feedback WHERE id = ?").run(req.params.id);
  res.status(204).send();
});

module.exports = router;