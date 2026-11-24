# MediLens AI — Clinical Intelligence Engine v2.4

AI-powered medical report analysis and document intelligence platform.
Built from the 4 supplied screenshots in `design-references/` — use those 4 pages for the UI, nothing redesigned.

**All demo medical values are synthetic demonstration data. Educational analysis only — not a certified diagnostic medical device. Corroborate outputs with primary lab records. No HIPAA / regulatory compliance is claimed.**

## Pages (all working)
- `/login` — split login, demo login `demo@medilens.ai` / `demo1234`
- `/dashboard` — stats, category tabs that filter, searchable/paginated repository, category distribution, pipeline, biomarker spotlight
- `/upload` — drag-drop / browse, PDF/JPG/PNG + 10 MB validation, 6-stage pipeline, recent history (view/retry/delete)
- `/analysis/:id` — document viewer (page, zoom, rotate, OCR-box toggle), extraction matrix with filters/search, click-a-row explanation, CSV + summary export, share dialog (demo)
- `/reports`, `/explanations/:id`, `/analytics`, `/profile`, `/settings`, `/register`, `/forgot-password`

## Run
Frontend: `cd frontend && npm install && npm run dev` → http://localhost:5173
Backend: `cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000` → http://localhost:8000/docs

## Backend API
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `POST /api/reports/upload`, `GET /api/reports`, `GET /api/reports/{id}`, `GET /api/reports/{id}/explanations`, `GET /api/reports/{id}/summary`, `GET /api/reports/{id}/download`, `DELETE /api/reports/{id}`
- `GET /api/health`
SQLite (`medilens.db`), JWT auth, per-user ownership enforced. Extraction: PyMuPDF + deterministic reference-range engine + TF-IDF/Logistic Regression classifier. Tesseract OCR is optional — image uploads without OCR return Needs Review rather than fake values.

## Tests
Backend: `cd backend && python -m pytest tests/ -v`
Frontend build: `cd frontend && npm run build`
