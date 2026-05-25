# YatraAI Project Architecture

AI travel planner architecture using React.js, Tailwind CSS, FastAPI, Firebase Firestore, Firebase Authentication, Gemini AI, Leaflet, and OpenStreetMap.

## Folder Structure

```text
YatraAI/
├── README.md
├── package.json
├── .gitignore
├── apps/
│   ├── web/
│   │   ├── .env.example
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   └── src/
│   │       ├── App.jsx
│   │       ├── main.jsx
│   │       ├── components/
│   │       │   └── .gitkeep
│   │       ├── config/
│   │       │   ├── firebase.js
│   │       │   └── map.js
│   │       ├── hooks/
│   │       │   └── .gitkeep
│   │       ├── lib/
│   │       │   └── api/
│   │       │       └── client.js
│   │       ├── pages/
│   │       │   └── .gitkeep
│   │       ├── routes/
│   │       │   └── .gitkeep
│   │       └── styles/
│   │           └── index.css
│   └── api/
│       ├── .env.example
│       ├── requirements.txt
│       └── app/
│           ├── __init__.py
│           ├── main.py
│           ├── api/
│           │   ├── __init__.py
│           │   └── v1/
│           │       ├── __init__.py
│           │       ├── router.py
│           │       └── endpoints/
│           │           ├── __init__.py
│           │           └── health.py
│           ├── core/
│           │   ├── __init__.py
│           │   ├── config.py
│           │   ├── firebase.py
│           │   └── gemini.py
│           ├── db/
│           │   ├── __init__.py
│           │   └── firestore.py
│           ├── dependencies/
│           │   ├── __init__.py
│           │   └── firebase_auth.py
│           ├── middleware/
│           │   ├── __init__.py
│           │   └── .gitkeep
│           ├── models/
│           │   ├── __init__.py
│           │   └── .gitkeep
│           ├── repositories/
│           │   ├── __init__.py
│           │   └── .gitkeep
│           ├── schemas/
│           │   ├── __init__.py
│           │   └── .gitkeep
│           ├── services/
│           │   ├── __init__.py
│           │   └── .gitkeep
│           └── utils/
│               ├── __init__.py
│               └── .gitkeep
└── tests/
    └── .gitkeep
```

## Installation Commands

```bash
# Frontend
cd apps/web
npm install
npm run dev
```

```bash
# Backend
cd apps/api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

```bash
# Optional root scripts
npm run dev:web
npm run dev:api
```

## Base React Setup

- React app lives in `apps/web`.
- Vite entrypoint: `apps/web/src/main.jsx`.
- Root component: `apps/web/src/App.jsx`.
- Shared API client: `apps/web/src/lib/api/client.js`.
- Frontend config files live in `apps/web/src/config`.

## Base FastAPI Setup

- FastAPI app lives in `apps/api/app`.
- App entrypoint: `apps/api/app/main.py`.
- API v1 router: `apps/api/app/api/v1/router.py`.
- Core configuration: `apps/api/app/core/config.py`.

## Tailwind Setup

Tailwind CSS is configured through the official Vite plugin:

```bash
cd apps/web
npm install tailwindcss @tailwindcss/vite
```

- Vite plugin registration: `apps/web/vite.config.js`.
- Tailwind import: `apps/web/src/styles/index.css`.

## Firebase Initialization

Frontend Firebase initialization:

- `apps/web/src/config/firebase.js`
- Exports `firebaseApp`, `auth`, and `db`.
- Uses `VITE_FIREBASE_*` variables from `apps/web/.env`.

Backend Firebase Admin initialization:

- `apps/api/app/core/firebase.py`
- Firestore client access: `apps/api/app/db/firestore.py`.
- Firebase Authentication token verification: `apps/api/app/dependencies/firebase_auth.py`.
- Uses `FIREBASE_SERVICE_ACCOUNT_JSON`, `FIREBASE_SERVICE_ACCOUNT_PATH`, or Google Application Default Credentials.

## Environment Variable Setup

```bash
# Frontend
copy apps\web\.env.example apps\web\.env

# Backend
copy apps\api\.env.example apps\api\.env
```

Frontend variables:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Backend variables:

```env
APP_NAME=YatraAI API
ENVIRONMENT=local
API_V1_PREFIX=/api/v1
BACKEND_CORS_ORIGINS=http://localhost:5173
FIREBASE_PROJECT_ID=
FIREBASE_SERVICE_ACCOUNT_PATH=
FIREBASE_SERVICE_ACCOUNT_JSON=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

## API Folder Structure

- `api/v1/endpoints`: HTTP route modules.
- `core`: app settings and external SDK initialization.
- `db`: database clients and Firestore access.
- `dependencies`: shared FastAPI dependencies.
- `models`: internal domain models.
- `schemas`: request and response schemas.
- `repositories`: data access layer.
- `services`: business logic layer.
- `middleware`: request/response middleware.
- `utils`: shared utility functions.
