const initSqlJs = require("sql.js");
const { readFileSync, writeFileSync, existsSync } = require("fs");
const { join } = require("path");

const DB_PATH = join(__dirname, "../../../data/intermediary.db");

let db;

function getDb() {
  if (db) return Promise.resolve(db);
  return initDb();
}

async function initDb() {
  const SQL = await initSqlJs();
  let data;
  if (existsSync(DB_PATH)) {
    data = readFileSync(DB_PATH);
  }
  db = new SQL.Database(data);
  db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sector TEXT DEFAULT 'telecom',
      contact_email TEXT,
      phone TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
      company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'resolved')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  saveDb();
  return db;
}

function saveDb() {
  const data = db.export();
  writeFileSync(DB_PATH, Buffer.from(data));
}

module.exports = { getDb, saveDb };
