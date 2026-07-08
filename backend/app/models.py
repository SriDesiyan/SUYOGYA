from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="rm")

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    segment = Column(String, default="HNW")
    risk_profile = Column(String, default="Moderate")
    behavior_score = Column(Float, default=8.5)
    financial_timeline = Column(JSON, nullable=True) # Alternate investments app sessions,Gov checks

    # Relationships
    recommendations = relationship("Recommendation", back_populates="customer")

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    title = Column(String, nullable=False)
    target_allocation = Column(Float, default=50.0)
    expected_roi = Column(Float, default=9.5)
    confidence = Column(Float, default=90.0)
    readiness_score = Column(Float, default=85.0)
    status = Column(String, default="Pending Approval") # Pending Approval, Approved, Rejected, Scheduled

    # Relationships
    customer = relationship("Customer", back_populates="recommendations")
    evidences = relationship("Evidence", back_populates="recommendation")

class Evidence(Base):
    __tablename__ = "evidences"

    id = Column(Integer, primary_key=True, index=True)
    recommendation_id = Column(Integer, ForeignKey("recommendations.id"), nullable=False)
    source = Column(String, nullable=False)
    validation_status = Column(String, default="verified")
    confidence_weight = Column(Float, default=95.0)
    sha_hash = Column(String, nullable=False)

    # Relationships
    recommendation = relationship("Recommendation", back_populates="evidences")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String, nullable=False)
    category = Column(String, nullable=False) # ingestion, compliance, approval, delivery
    status = Column(String, default="pass") # pass, pending, warning
    hash = Column(String, nullable=False)
    auditor = Column(String, nullable=True)
    evidence_summary = Column(String, nullable=True)
