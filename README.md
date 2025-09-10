# Zomato (Mini food-sharing app)

Overview
--------
This repository contains a small full-stack project inspired by short-video food sharing apps. It has a Node.js + Express backend and a React (Vite) frontend. Food partners (restaurants) can upload short food videos, and regular users can view reels, like, and save them.

Key features
------------
- Food partner registration & login
- User registration & login
- Upload short food videos (video file uploaded by food partners)
- Browse feed of food videos (reels)
- Like and save functionality for users
- Protected routes using JWT stored in cookies

Repository layout
-----------------
- `backend/` — Express API server
  - `src/controllers/` — request handlers (auth, food)
  - `src/models/` — Mongoose models (user, foodpartner, food, likes, saves)
  - `src/middlewares/` — auth middleware that reads JWT from cookie
  - `src/services/` — third-party services (ImageKit upload)
  - `server.js` — backend entry point

- `frontend/` — Vite + React app
  - `src/pages/` — page-level components (Home, Auth flows, Partner pages)
  - `src/components/` — shared UI components (ReelFeed, BottomNav)
  - `src/styles/` — CSS files

Important implementation notes
------------------------------
- File uploads (food videos) are handled by `multer` in memory and uploaded to ImageKit via `src/services/storage.service.js`. The file field name expected by the backend is `video`.
- Authentication uses JWT. Tokens are expected to be set as an HTTP-only cookie named `token`.
- The backend protects routes for food partners (upload) and regular users (browse/like/save) using middleware in `src/middlewares/auth.middleware.js`.

Running locally (Windows PowerShell)
-----------------------------------
1. Backend

```powershell
cd backend
npm install
# run the server (or use your npm start script if configured)
node server.js
```

2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the frontend URL printed by Vite (commonly `http://localhost:5173`) and the backend at `http://localhost:3000`.

API highlights
--------------
- Auth routes (examples):
  - `POST /api/auth/user/register` — register user
  - `POST /api/auth/user/login` — login user (sets `token` cookie)
  - `POST /api/auth/partner/register` — register food partner
  - `POST /api/auth/partner/login` — login partner

- Food routes (examples):
  - `GET /api/food` — list food reels (requires user auth)
  - `POST /api/food` — create/upload food video (requires partner auth, multipart/form-data with `video` field)
  - `POST /api/food/like` — like/unlike a food item (requires user auth)
  - `POST /api/food/save` — save/unsave a food item (requires user auth)

UX / Frontend behavior
-----------------------
- The `Home` page fetches `/api/food` and will redirect an unauthenticated user to `/user/login` when the API returns 401/403. Like/save actions do the same.
- The upload endpoint expects a `video` file field (multer memory storage used) and a few metadata fields (name, description).

Suggested improvements / next steps
----------------------------------
- Add axios interceptors on the frontend to centrally handle 401/403 and refresh tokens if you add refresh-token flows.
- Add request validation and better error messages on the backend.
- Add unit/integration tests for key controllers and middleware.
- Persist uploaded files to a dedicated storage service (S3, ImageKit) and store stable URLs in food documents.

Contact / Notes
----------------
If you need help wiring CI, adding tests, or centralizing auth handling on the frontend, I can implement those next.
