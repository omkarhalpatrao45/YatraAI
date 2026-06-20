# YatraAI

YatraAI is a full-stack travel planning application with:

- **Frontend (React + Vite)**: UI for authentication, trip planning, dashboards, trip details, expenses tracking, weather display, and map views.
- **Backend (FastAPI)**: REST API with JWT auth, trip creation and retrieval, expenses CRUD, and weather fetching.
- **AI Trip Planner**: Generates structured itineraries using an LLM (JSON output).
- **Weather**: Fetches current weather and forecast data.
- **PDF Export**: Generates a travel PDF summary for a trip.

## Repository Structure (High Level)

- `apps/api/` — FastAPI backend
- `apps/web/` — React frontend (Vite)
- `backend/` / `frontend/` — additional/example code that exists in this repo (see below)
- `TODO.md` — task checklist for current development
- `doc.txt` — running notes / documentation

> Note: The repo currently contains both `apps/*` and `backend/` / `frontend/` directories. Use the `apps/api` + `apps/web` scripts in `package.json` to run the primary stack.

## Prerequisites

- **Node.js** (for frontend)
- **Python** (3.9+ recommended)
- **Pip** / virtual environment
- Environment variables (exact keys depend on `apps/api/app/core/config.py` and related modules), typically including:
  - OpenAI API key
  - OpenWeatherMap API key
  - JWT secret and algorithm

## Quick Start

### 1) Backend (FastAPI)

```bash
cd apps/api
## python -m venv .venv
.
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2) Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

The frontend should connect to the backend API based on the configured API base URL.

## Available NPM Scripts

At the repo root, `package.json` includes helper scripts such as:

- `npm run dev:web`
- `npm run build:web`
- `npm run dev:api`

## Key Features

### Authentication
- Register/Login
- JWT-based protected routes

### Trips
- Create trip (AI-generated itinerary JSON)
- List user trips
- Get trip details
- Delete trip

### Expenses
- Add/list/update/delete expenses per trip

### Weather
- Get weather for a city (current + forecast)

### PDF Export
- Generate a PDF summary containing itinerary, hotels/flights placeholders, weather summary, and budget breakdown

## Docs / Notes

- `doc.txt` contains project notes, architecture walkthrough, and inferred issues.
- `TODO.md` tracks implementation progress.

## License

Add your license information here.   

