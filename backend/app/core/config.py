import os
SECRET_KEY = os.environ.get("MEDILENS_SECRET_KEY", "dev-secret-change-me-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 12
DATABASE_URL = os.environ.get("MEDILENS_DATABASE_URL", "sqlite:///./medilens.db")
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
MAX_UPLOAD_MB = 10
ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
