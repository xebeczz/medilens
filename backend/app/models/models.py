from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    reports = relationship("MedicalReport", back_populates="owner")
class MedicalReport(Base):
    __tablename__ = "medical_reports"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    original_filename = Column(String, nullable=False)
    stored_filename = Column(String, nullable=False)
    report_type = Column(String, default="Unknown")
    processing_status = Column(String, default="completed")
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    owner = relationship("User", back_populates="reports")
    results = relationship("ExtractedResult", back_populates="report", cascade="all, delete-orphan")
    summary = relationship("ReportSummary", back_populates="report", uselist=False, cascade="all, delete-orphan")
class ExtractedResult(Base):
    __tablename__ = "extracted_results"
    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("medical_reports.id"), nullable=False)
    test_name = Column(String, nullable=False)
    measured_value = Column(Float, nullable=True)
    unit = Column(String, default="")
    reference_min = Column(Float, nullable=True)
    reference_max = Column(Float, nullable=True)
    original_reference_text = Column(String, default="")
    result_status = Column(String, default="Needs Review")
    extraction_confidence = Column(Float, default=0.0)
    source_page = Column(Integer, default=1)
    report = relationship("MedicalReport", back_populates="results")
class ReportSummary(Base):
    __tablename__ = "report_summaries"
    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("medical_reports.id"), nullable=False)
    summary_text = Column(Text, default="")
    generated_at = Column(DateTime, default=datetime.utcnow)
    report = relationship("MedicalReport", back_populates="summary")
