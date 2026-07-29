# TelLink

A platform acting as an intermediary between telecom-adjacent companies and their customers. Enables companies to manage customer interactions and lets customers provide feedback, check service status, and report issues.

## Structure

| Folder    | Description                                     |
|-----------|-------------------------------------------------|
| `backend/`| Node.js + Express API with sql.js (SQLite in WASM)|
| `web/`    | React + Vite + Tailwind CSS web application    |
| `mobile/` | React Native + Expo mobile app                  |

## Quick Start

### 1. Backend (terminal 1)
```bash
export PATH="/usr/share/nodejs/corepack/shims:$PATH"
cd backend
npm install
npm run dev
```

### 2. Web (terminal 2)
```bash
cd web
npm install
npm run dev
```
Then open http://localhost:3000 in your browser. Vite provides live reload — save a file and it auto-refreshes.

### 3. Mobile (terminal 3)
```bash
cd mobile
npm install
npm start
```

## Key Features

- **Sidebar navigation** with Dashboard, Companies, Customers, and Feedback pages
- **Dashboard** with stats overview
- **CRUD operations** for companies, customers, and feedback
- **Tailwind CSS v4** for professional styling
- **Responsive design** with Tailwind utility classes
- **Live reload** via Vite dev server

## API Endpoints

- `GET /api/health` — health check
- `GET /api/companies` — list companies
- `POST /api/companies` — add a company
- `GET /api/customers` — list customers
- `POST /api/customers` — add a customer
- `GET /api/feedback` — list feedback
- `POST /api/feedback` — add feedback

## Tech Stack

- **Backend:** Express + sql.js (SQLite via WebAssembly, no native builds)
- **Web:** React + Vite + Tailwind CSS v4 + React Router
- **Mobile:** React Native + Expo
- **Database:** SQLite (WASM mode, zero native dependencies)