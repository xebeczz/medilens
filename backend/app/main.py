import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.database import Base, engine
from .api import auth, reports
Base.metadata.create_all(bind=engine)
app = FastAPI(title="MediLens AI — Clinical Intelligence Engine", version="2.4.0")
# CORS: localhost for local dev, plus the live Render frontend origin.
# Set FRONTEND_URL on Render (comma-separated for extra origins) — do NOT
# leave this localhost-only or the live site will be blocked by the browser.
_extra_origins = [o.strip() for o in os.environ.get("FRONTEND_URL", "").split(",") if o.strip()]
_origins = ["http://localhost:5173", "http://127.0.0.1:5173", "https://medilens-ai.onrender.com"] + _extra_origins
ALLOWED_ORIGINS = list(dict.fromkeys(_origins))
app.add_middleware(CORSMiddleware, allow_origins=ALLOWED_ORIGINS, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(auth.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
@app.get("/api/health")
def health(): return {"status": "ok", "service": "medilens-ai", "version": "2.4.0"}
@app.get("/")
def root(): return {"service": "MediLens AI", "docs": "/docs", "health": "/api/health"}
