# ShadowTrace – Integrated Modules 1 + 2

**Course:** SE331 · **Lab:** C2 · **Semester:** Fall 2026 · **Group:** 05

This package combines your supplied working Module 1 project with the Module 2 exposure-monitoring feature set.

## What is preserved

- Module 1 registration, login, JWT cookie sessions and logout
- Module 1 profile page and profile update endpoint
- Module 1 admin-only user management and role controls
- Existing API ports and MongoDB database configuration pattern
- Existing authentication rate limit from the supplied Module 1 source

## What is added

- Add and remove monitored email identifiers
- Match monitored email hashes against a local synthetic academic dataset
- Calculate a 0–100 exposure risk score and risk level
- Display risk factors and security recommendations
- Record monitoring actions in an activity log

## Important configuration steps

1. Stop any running ShadowTrace backend and frontend terminals before testing this copy.
2. Extract this ZIP into a NEW folder. Do not overwrite your original Module 1 project.
3. Copy your existing local `backend/.env` into this extracted project's `backend/` folder.
4. If your frontend uses a local `frontend/.env`, copy that too. The supplied `.env.example` files show the expected configuration.
5. Do not create a new admin account if you want to keep using the existing one. Keep the same `MONGODB_URI` so the existing users remain available.
6. Never upload `.env` files to GitHub or share them in chat.

## Run the integrated application

Make sure MongoDB is running.

### Backend terminal

```bash
cd backend
npm install
npm run seed-demo-data
npm run dev
```

Run `npm run seed-demo-data` once to add the synthetic demo records. It is safe to rerun because the script uses upserts.

### Frontend terminal

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Module 2 demonstration

Sign in using your existing Module 1 account, then open **Exposure monitoring** in the sidebar.

Try these synthetic academic demo addresses:

- `demo.user@shadowtrace.test` — expected two matches
- `student@shadowtrace.test` — expected one match
- A different email — expected no match in this small local dataset

These are expected outcomes based on the included seed data, not a claim that the project has been tested on your computer.

## API routes added

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/monitoring/accounts` | List the signed-in user's monitored accounts |
| POST | `/monitoring/accounts` | Add an email identifier for monitoring |
| DELETE | `/monitoring/accounts/:id` | Remove an account owned by the signed-in user |
| POST | `/monitoring/accounts/:id/scan` | Match local demo records and calculate risk/recommendations |

All monitoring routes require the existing Module 1 authentication cookie. A user can access only their own monitored accounts.

## Scope note

The scanner checks only the local synthetic academic dataset. It does not crawl the dark web, access external breach services, or collect account passwords. A zero-match result is not proof that an account has never been exposed.

## Troubleshooting

- If port 5000 is already in use, stop the other backend process before starting this one.
- If the frontend cannot reach the API, check `frontend/.env` and ensure `VITE_API_URL=http://localhost:5000/api`.
- If login fails after copying, confirm that `backend/.env` points to the same MongoDB database used by your Module 1 project and that `CLIENT_ORIGIN=http://localhost:5173`.
- Do not run `npm run create-admin` unless you intentionally need to create a new administrator.
