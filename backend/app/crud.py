from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
from . import models, schemas
from .auth import get_password_hash

# ----------------------------------------------------
# Users
# ----------------------------------------------------
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_pwd = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_pwd, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ----------------------------------------------------
# Customers
# ----------------------------------------------------
def get_customer(db: Session, customer_id: int):
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()

def get_customers(db: Session, search: Optional[str] = None, skip: int = 0, limit: int = 100):
    query = db.query(models.Customer)
    if search:
        query = query.filter(
            or_(
                models.Customer.name.ilike(f"%{search}%"),
                models.Customer.segment.ilike(f"%{search}%")
            )
        )
    return query.offset(skip).limit(limit).all()

def create_customer(db: Session, customer: schemas.CustomerCreate):
    db_customer = models.Customer(**customer.model_dump())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

# ----------------------------------------------------
# Recommendations
# ----------------------------------------------------
def get_recommendation(db: Session, rec_id: int):
    return db.query(models.Recommendation).filter(models.Recommendation.id == rec_id).first()

def get_recommendations(db: Session, status: Optional[str] = None, skip: int = 0, limit: int = 100):
    query = db.query(models.Recommendation)
    if status:
        query = query.filter(models.Recommendation.status == status)
    return query.offset(skip).limit(limit).all()

def create_recommendation(db: Session, rec: schemas.RecommendationCreate):
    db_rec = models.Recommendation(**rec.model_dump())
    db.add(db_rec)
    db.commit()
    db.refresh(db_rec)
    return db_rec

def update_recommendation(db: Session, rec_id: int, rec_update: schemas.RecommendationUpdate):
    db_rec = get_recommendation(db, rec_id)
    if not db_rec:
        return None
    for key, value in rec_update.model_dump(exclude_unset=True).items():
        setattr(db_rec, key, value)
    db.commit()
    db.refresh(db_rec)
    return db_rec

# ----------------------------------------------------
# Evidence
# ----------------------------------------------------
def create_evidence(db: Session, evidence: schemas.EvidenceCreate, recommendation_id: int):
    db_evidence = models.Evidence(**evidence.model_dump(), recommendation_id=recommendation_id)
    db.add(db_evidence)
    db.commit()
    db.refresh(db_evidence)
    return db_evidence

# ----------------------------------------------------
# Audit Logs
# ----------------------------------------------------
def get_audit_logs(
    db: Session,
    search: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    query = db.query(models.AuditLog)
    if search:
        query = query.filter(
            or_(
                models.AuditLog.action.ilike(f"%{search}%"),
                models.AuditLog.id.ilike(f"%{search}%")
            )
        )
    if category:
        query = query.filter(models.AuditLog.category == category)
    if status:
        query = query.filter(models.AuditLog.status == status)
    return query.order_by(models.AuditLog.id.desc()).offset(skip).limit(limit).all()

def create_audit_log(db: Session, log: schemas.AuditLogCreate):
    db_log = models.AuditLog(**log.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

# ----------------------------------------------------
# DB Seed Helper
# ----------------------------------------------------
def seed_database(db: Session):
    # Check if seeds already run
    if db.query(models.User).count() > 0:
        return

    # Seed Admin RM User
    hashed_pwd = get_password_hash("sbi-admin-9042")
    admin_user = models.User(email="rm@sbi.co.in", hashed_password=hashed_pwd, role="rm")
    db.add(admin_user)

    # Seed Customers
    cust1 = models.Customer(
        name="Kabir Rao",
        segment="Ultra HNW",
        risk_profile="Conservative Balanced",
        behavior_score=9.4,
        financial_timeline={"ingestion_source": "Savings Ledger Credit", "kyc_status": "Cleared"}
    )
    cust2 = models.Customer(
        name="Aarav Mehta",
        segment="HNW Core",
        risk_profile="Aggressive Growth",
        behavior_score=8.8,
        financial_timeline={"ingestion_source": "Venture Capital Exit", "kyc_status": "Cleared"}
    )
    db.add(cust1)
    db.add(cust2)
    db.commit()
    db.refresh(cust1)
    db.refresh(cust2)

    # Seed Recommendations
    rec1 = models.Recommendation(
        client_id=cust1.id,
        title="Sovereign Gold Bonds & Yield Deposits",
        target_allocation=85.0,
        expected_roi=8.2,
        confidence=95.0,
        readiness_score=92.0,
        status="Pending Approval"
    )
    rec2 = models.Recommendation(
        client_id=cust2.id,
        title="Bluechip Portfolio Management Services (PMS)",
        target_allocation=120.0,
        expected_roi=14.5,
        confidence=90.0,
        readiness_score=85.0,
        status="Pending Approval"
    )
    db.add(rec1)
    db.add(rec2)
    db.commit()
    db.refresh(rec1)
    db.refresh(rec2)

    # Seed Evidence
    ev1 = models.Evidence(
        recommendation_id=rec1.id,
        source="KYC Central Government Registry Database",
        validation_status="verified",
        confidence_weight=98.0,
        sha_hash="0e7a8f4b931e9c2c6d7a8e5f1b0a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b"
    )
    ev2 = models.Evidence(
        recommendation_id=rec2.id,
        source="Risk Engine Profile Questionnaire",
        validation_status="verified",
        confidence_weight=92.0,
        sha_hash="c8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9"
    )
    db.add(ev1)
    db.add(ev2)

    # Seed Audit Logs
    log1 = models.AuditLog(
        action="Target Advisory Campaign Formulated",
        category="approval",
        status="pass",
        hash="0e7a8f4b931e9c2c6d7a8e5f1b0a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
        auditor="Sri Desiyan (Relationship Manager)",
        evidence_summary="RM formulated Gold bonds advisory for Kabir Rao."
    )
    log2 = models.AuditLog(
        action="Compliance KYC Verification check",
        category="compliance",
        status="pass",
        hash="c8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
        evidence_summary="Central Government registry checks cleared status."
    )
    db.add(log1)
    db.add(log2)
    db.commit()
