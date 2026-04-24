# smartseason
Live App	https://smartseason-hq29spgit-sheilawuors-projects.vercel.app
Backend API	https://smartseason-backend-4325.onrender.com

# SmartSeason Field Monitoring System

Built for Shamba Records — a web application to track crop progress across multiple fields during a growing season.

---

## Demo Credentials

| Role  | Email                  | Password |
| ----- | ---------------------- | -------- |
| Admin | admin@smartseason.com  | admin123 |
| Agent | agent1@smartseason.com | agent123 |
| Agent | agent2@smartseason.com | agent123 |

---

## Tech Stack

| Layer    | Technology                   |
| -------- | ---------------------------- |
| Backend  | Node.js + Express            |
| Frontend | React + Vite                 |
| Database | PostgreSQL + Prisma          |
| Auth     | JWT                          |
| Styling  | Tailwind CSS + Inline Styles |

---

## Setup Instructions

### Prerequisites

- Node.js v18+
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd smartseason
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/smartseason"
JWT_SECRET="smartseason_secret_key_2024"
PORT=5000
```

Run migrations:

```bash
npx prisma migrate dev
```

Seed the database:

```bash
node prisma/seed.js
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

### 4. Open the app

Visit `http://localhost:5173` in your browser.

---

## Design Decisions

### Why Node.js + Express?

Fast to set up, lightweight, and great for REST APIs. Fits the scope of this project perfectly.

### Why Prisma?

Prisma provides type-safe database access, automatic migrations, and a clean schema definition. It significantly speeds up development compared to raw SQL.

### Why JWT?

Stateless authentication that works well for role-based access. Tokens are stored in localStorage and attached to every API request via an Axios interceptor.

### Role Separation

- Admins can create fields, assign agents, and view all fields across the system
- Agents can only view and update their assigned fields
- All routes are protected by middleware that checks the JWT token and user role

---

## Field Status Logic

Each field has a computed status based on its data. The logic lives in `backend/src/utils/statusHelper.js`:

- **Completed** — the field stage is `HARVESTED`
- **At Risk** — no update has been made in 7+ days, OR the field has been in `GROWING` stage for more than 90 days
- **Active** — everything else

This logic is computed on every API response and never stored in the database, keeping the data model simple and the status always accurate.

---

## Assumptions Made

- Admins assign fields to agents at creation time
- Field stage can only be updated by the assigned agent or an admin
- Status is computed dynamically and not stored in the database
- Demo users are created via the seed script
- No email verification is required for this assessment

---

## Project Structure

```
smartseason/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── fieldController.js
│   │   │   └── updateController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── fields.js
│   │   │   └── updates.js
│   │   ├── utils/
│   │   │   └── statusHelper.js
│   │   └── app.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── components/
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   └── AgentDashboard.jsx
    │   └── App.jsx
    └── package.json
```
