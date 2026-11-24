import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
os.environ["MEDILENS_DATABASE_URL"] = "sqlite:///./test_medilens.db"
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import Base, engine
Base.metadata.drop_all(bind=engine); Base.metadata.create_all(bind=engine)
client = TestClient(app)

def test_health():
    assert client.get("/api/health").json()["status"] == "ok"

def test_register_login_upload_flow():
    r = client.post("/api/auth/register", json={"full_name": "Test User", "email": "test@medilens.ai", "password": "test1234"})
    assert r.status_code in (200, 201), r.text
    r = client.post("/api/auth/login", data={"username": "test@medilens.ai", "password": "test1234"})
    assert r.status_code == 200, r.text
    token = r.json()["access_token"]; h = {"Authorization": f"Bearer {token}"}
    assert client.get("/api/auth/me", headers=h).json()["email"] == "test@medilens.ai"
    # upload a minimal PDF containing CBC values
    import fitz
    doc = fitz.open(); page = doc.new_page(); page.insert_text((72, 72), "Complete Blood Count\nHemoglobin 14.4\nPlatelet Count 138\nFasting Glucose 104")
    pdf = doc.tobytes(); doc.close()
    r = client.post("/api/reports/upload", files={"file": ("cbc.pdf", pdf, "application/pdf")}, headers=h)
    assert r.status_code == 201, r.text
    data = r.json(); assert data["report_type"] == "Complete Blood Count"
    by_name = {x["test_name"]: x for x in data["results"]}
    assert by_name["Hemoglobin"]["measured_value"] == 14.4
    assert by_name["Hemoglobin"]["result_status"] == "Within Range"
    assert by_name["Platelet Count"]["result_status"] == "Below Range"
    assert by_name["Fasting Glucose"]["result_status"] == "Above Range"
    rid = data["id"]
    assert client.get(f"/api/reports/{rid}", headers=h).status_code == 200
    assert len(client.get(f"/api/reports/{rid}/explanations", headers=h).json()) >= 7
    assert client.get(f"/api/reports/{rid}/summary", headers=h).status_code == 200
    assert client.get("/api/reports", headers=h).json()[0]["id"] == rid
    assert client.delete(f"/api/reports/{rid}", headers=h).json()["deleted"] is True
    # unauthenticated access is rejected
    assert client.get("/api/reports").status_code == 401
