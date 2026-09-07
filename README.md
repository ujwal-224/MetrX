# MetrX — Legal Metrology Digital Verification System

MetrX is a digital platform for the Department of Legal Metrology that streamlines merchant registration, statutory document verification, inspector scheduling, on-site physical calibration auditing, and tamper-evident Form XVII digital certificate issuance.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, PostgreSQL, Prisma ORM
- **Frontend**: React 18, Vite, Tailwind CSS, Material Symbols
- **Database**: PostgreSQL (`metrx-postgres` via Docker)
- **Deployment & Containers**: Docker Compose

---

## 🚀 Quick Start

### 1. Start PostgreSQL
```bash
docker compose up -d
```
Or ensure PostgreSQL is running on `localhost:5432` with database `metrx`.

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npx prisma db push
npm run dev
```
Backend runs at `http://127.0.0.1:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://127.0.0.1:5173`.

---

## 🔄 End-to-End Workflow

1. **Merchant Registration**: Shop owner registers an establishment with trade license and scale details.
2. **Admin Allocation**: Department Admin reviews newly registered shops and allocates an accredited Legal Metrology Officer.
3. **Statutory Document Submission**: Merchant uploads the 5 mandatory statutory documents (Trade license, ID, scale invoice, serial nameplate, installation photo).
4. **Officer Scrutiny**: Assigned Inspector reviews and marks the documents **Verified**.
5. **Visit Scheduling**: Merchant chooses an on-site inspection window.
6. **Inspector Terminal**: Assigned inspection appears in the Inspector Schedule. Officer clicks **Start Inspection**.
7. **Physical Audit & Stamping**: Inspector verifies leveling, MPE accuracy, uploads photo evidence, and clicks **Inspection Successful • Issue Form XVII Certificate**.
8. **Statutory Certificate**: Shop dashboard reflects **Verified & Compliant (365 Days)** status with the official **Form XVII** certificate ready to view, share, or print.
