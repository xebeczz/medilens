import os, uuid, csv, io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse, FileResponse
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.config import UPLOAD_DIR, MAX_UPLOAD_MB, ALLOWED_EXTENSIONS
from ..models.models import User, MedicalReport, ExtractedResult, ReportSummary
from ..schemas.schemas import ReportOut, ExplanationOut
from .deps import get_current_user
from ..services.extraction import extract_text, extract_results, classify_document
from ..services.explanations import explain
from ..ml.classifier import classify_text
router = APIRouter(prefix="/reports", tags=["reports"])
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=ReportOut, status_code=201)
async def upload(file: UploadFile = File(...), db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS: raise HTTPException(400, "Only PDF, JPG and PNG are accepted.")
    content = await file.read()
    if len(content) > MAX_UPLOAD_MB * 1024 * 1024: raise HTTPException(400, "File exceeds 10 MB.")
    stored = f"{uuid.uuid4().hex}{ext}"; path = os.path.join(UPLOAD_DIR, stored)
    with open(path, "wb") as f: f.write(content)
    text = extract_text(path)
    rtype = classify_document(text)
    if rtype == "Unknown": rtype = classify_text(text) if text else "Unknown"
    rep = MedicalReport(user_id=user.id, original_filename=file.filename, stored_filename=stored, report_type=rtype, processing_status="completed")
    db.add(rep); db.commit(); db.refresh(rep)
    results = extract_results(text)
    for r in results: db.add(ExtractedResult(report_id=rep.id, **r))
    lines = [f"{r['test_name']}: {r['measured_value']} {r['unit']} (Ref {r['original_reference_text']}) — {r['result_status']}" for r in results]
    db.add(ReportSummary(report_id=rep.id, summary_text="MediLens AI summary (educational only).\n" + "\n".join(lines)))
    db.commit(); db.refresh(rep); return rep

@router.get("", response_model=list[ReportOut])
def list_reports(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(MedicalReport).filter(MedicalReport.user_id == user.id).order_by(MedicalReport.uploaded_at.desc()).all()

@router.get("/{report_id}", response_model=ReportOut)
def get_report(report_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rep = db.query(MedicalReport).filter(MedicalReport.id == report_id, MedicalReport.user_id == user.id).first()
    if not rep: raise HTTPException(404, "Report not found")
    return rep

@router.get("/{report_id}/explanations", response_model=list[ExplanationOut])
def explanations(report_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rep = db.query(MedicalReport).filter(MedicalReport.id == report_id, MedicalReport.user_id == user.id).first()
    if not rep: raise HTTPException(404, "Report not found")
    return [explain(r) for r in rep.results]

@router.get("/{report_id}/summary")
def summary(report_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rep = db.query(MedicalReport).filter(MedicalReport.id == report_id, MedicalReport.user_id == user.id).first()
    if not rep: raise HTTPException(404, "Report not found")
    text = rep.summary.summary_text if rep.summary else "No summary yet."
    return StreamingResponse(io.BytesIO(text.encode()), media_type="text/plain", headers={"Content-Disposition": f"attachment; filename=summary-{report_id}.txt"})

@router.get("/{report_id}/download")
def download(report_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rep = db.query(MedicalReport).filter(MedicalReport.id == report_id, MedicalReport.user_id == user.id).first()
    if not rep: raise HTTPException(404, "Report not found")
    path = os.path.join(UPLOAD_DIR, rep.stored_filename)
    if not os.path.exists(path): raise HTTPException(404, "Stored file not found")
    return FileResponse(path, filename=rep.original_filename)

@router.delete("/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rep = db.query(MedicalReport).filter(MedicalReport.id == report_id, MedicalReport.user_id == user.id).first()
    if not rep: raise HTTPException(404, "Report not found")
    path = os.path.join(UPLOAD_DIR, rep.stored_filename)
    db.delete(rep); db.commit()
    if os.path.exists(path):
        try: os.remove(path)
        except OSError: pass
    return {"deleted": True}
