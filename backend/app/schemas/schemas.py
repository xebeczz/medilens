from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
class UserCreate(BaseModel):
    full_name: str; email: EmailStr; password: str
class UserOut(BaseModel):
    id: int; full_name: str; email: EmailStr; created_at: datetime
    class Config: from_attributes = True
class Token(BaseModel):
    access_token: str; token_type: str = "bearer"
class ResultOut(BaseModel):
    id: int; test_name: str; measured_value: Optional[float]; unit: str
    reference_min: Optional[float]; reference_max: Optional[float]
    original_reference_text: str; result_status: str; extraction_confidence: float; source_page: int
    class Config: from_attributes = True
class ReportOut(BaseModel):
    id: int; original_filename: str; report_type: str; processing_status: str; uploaded_at: datetime
    results: List[ResultOut] = []
    class Config: from_attributes = True
class ExplanationOut(BaseModel):
    test_name: str; measured_value: Optional[float]; unit: str; reference_text: str
    status: str; explanation: str; factors: str; question: str
