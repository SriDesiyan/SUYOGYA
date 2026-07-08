from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    role: Optional[str] = "rm"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

# Evidence schemas
class EvidenceBase(BaseModel):
    source: str
    validation_status: Optional[str] = "verified"
    confidence_weight: Optional[float] = 95.0
    sha_hash: str

class EvidenceCreate(EvidenceBase):
    pass

class EvidenceResponse(EvidenceBase):
    id: int
    recommendation_id: int

    class Config:
        from_attributes = True

# Recommendation schemas
class RecommendationBase(BaseModel):
    title: str
    target_allocation: Optional[float] = 50.0
    expected_roi: Optional[float] = 9.5
    confidence: Optional[float] = 90.0
    readiness_score: Optional[float] = 85.0
    status: Optional[str] = "Pending Approval"

class RecommendationCreate(RecommendationBase):
    client_id: int

class RecommendationUpdate(BaseModel):
    target_allocation: Optional[float] = None
    expected_roi: Optional[float] = None
    status: Optional[str] = None

class RecommendationResponse(RecommendationBase):
    id: int
    client_id: int
    evidences: List[EvidenceResponse] = []

    class Config:
        from_attributes = True

# Customer schemas
class CustomerBase(BaseModel):
    name: str
    segment: Optional[str] = "HNW"
    risk_profile: Optional[str] = "Moderate"
    behavior_score: Optional[float] = 8.5
    financial_timeline: Optional[Any] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: int
    recommendations: List[RecommendationResponse] = []

    class Config:
        from_attributes = True

# Audit Log schemas
class AuditLogBase(BaseModel):
    action: str
    category: str # ingestion, compliance, approval, delivery
    status: Optional[str] = "pass"
    hash: str
    auditor: Optional[str] = None
    evidence_summary: Optional[str] = None

class AuditLogCreate(AuditLogBase):
    pass

class AuditLogResponse(AuditLogBase):
    id: int

    class Config:
        from_attributes = True
