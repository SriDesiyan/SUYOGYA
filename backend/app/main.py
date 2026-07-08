import logging
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional

from . import models, schemas, crud, auth
from .database import engine, get_db, Base
from .ai.orchestrator import AIOrchestrator

# Configure standard logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("suyogya-backend")

# Initialize SQLite/Postgres DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SUYOGYA Wealth Advisory Backend",
    description="Core API services for HNI signals, explainable AI reasoning, recommendations, and audit logs.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend accessibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_seeding():
    logger.info("Initializing database schemas and running seeds...")
    db = next(get_db())
    try:
        crud.seed_database(db)
        logger.info("Database seeding completed successfully.")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
    finally:
        db.close()

# ----------------------------------------------------
# Authentication Endpoints
# ----------------------------------------------------
@app.post("/auth/signup", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/auth/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=form_data.username)
    if not db_user or not auth.verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": db_user.email, "role": db_user.role})
    return {"access_token": access_token, "token_type": "bearer"}

# ----------------------------------------------------
# Customer Endpoints
# ----------------------------------------------------
@app.get("/customers", response_model=List[schemas.CustomerResponse])
def read_customers(
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: schemas.TokenData = Depends(auth.get_current_user)
):
    return crud.get_customers(db, search=search, skip=skip, limit=limit)

@app.get("/customers/{customer_id}", response_model=schemas.CustomerResponse)
def read_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.TokenData = Depends(auth.get_current_user)
):
    db_customer = crud.get_customer(db, customer_id=customer_id)
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db_customer

@app.post("/customers", response_model=schemas.CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(
    customer: schemas.CustomerCreate,
    db: Session = Depends(get_db),
    current_user: schemas.TokenData = Depends(auth.get_current_user)
):
    return crud.create_customer(db=db, customer=customer)

# ----------------------------------------------------
# Recommendation Endpoints
# ----------------------------------------------------
@app.get("/recommendations", response_model=List[schemas.RecommendationResponse])
def read_recommendations(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: schemas.TokenData = Depends(auth.get_current_user)
):
    return crud.get_recommendations(db, status=status, skip=skip, limit=limit)

@app.patch("/recommendations/{rec_id}", response_model=schemas.RecommendationResponse)
def modify_recommendation(
    rec_id: int,
    rec_update: schemas.RecommendationUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.TokenData = Depends(auth.get_current_user)
):
    updated = crud.update_recommendation(db, rec_id=rec_id, rec_update=rec_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    return updated

# ----------------------------------------------------
# Audit Log Endpoints
# ----------------------------------------------------
@app.get("/audit", response_model=List[schemas.AuditLogResponse])
def read_audit_logs(
    search: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: schemas.TokenData = Depends(auth.get_current_user)
):
    return crud.get_audit_logs(db, search=search, category=category, status=status, skip=skip, limit=limit)

@app.post("/audit", response_model=schemas.AuditLogResponse, status_code=status.HTTP_201_CREATED)
def create_audit_log(
    log: schemas.AuditLogCreate,
    db: Session = Depends(get_db),
    current_user: schemas.TokenData = Depends(auth.get_current_user)
):
    return crud.create_audit_log(db=db, log=log)

# ----------------------------------------------------
# AI Orchestration & Evaluation Engine Pipeline
# ----------------------------------------------------
@app.post("/ai/evaluate", status_code=status.HTTP_200_OK)
def evaluate_inflow_pipeline(
    customer_id: int,
    inflow_lakhs: float,
    db: Session = Depends(get_db),
    current_user: schemas.TokenData = Depends(auth.get_current_user)
):
    # Retrieve target customer
    customer = crud.get_customer(db, customer_id=customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Target client not found")

    # Process AI rules & generate briefing
    result = AIOrchestrator.process_inflow_pipeline(
        customer_name=customer.name,
        risk_profile=customer.risk_profile,
        inflow_amount_lakhs=inflow_lakhs
    )

    # If eligible, auto-insert Recommendation to the database
    if result["is_eligible"]:
        new_rec = models.Recommendation(
            client_id=customer.id,
            title=result["title"],
            target_allocation=result["target_allocation"],
            expected_roi=result["expected_roi"],
            confidence=result["confidence"],
            readiness_score=result["readiness_score"],
            status="Pending Approval"
        )
        db.add(new_rec)
        db.commit()
        db.refresh(new_rec)

        # Log to audit trail
        audit_entry = models.AuditLog(
            action=f"AI Advisor recommendation auto-created: {result['title']}",
            category="ingestion",
            status="pass",
            hash="0e7a8f4b931e9c2c6d7a8e5f1b0a3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
            auditor=current_user.email,
            evidence_summary=result["notes"]
        )
        db.add(audit_entry)
        db.commit()

        result["recommendation_id"] = new_rec.id

    return result
