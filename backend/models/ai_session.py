import uuid
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base

class AISession(Base):
    __tablename__ = "ai_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    scenario_id = Column(Integer, ForeignKey("ai_scenarios.id", ondelete="CASCADE"), nullable=False)
    current_score = Column(Integer, nullable=False, default=50)
    current_emotion = Column(String(30), nullable=False, default="neutral")
    recent_summary = Column(Text, nullable=True)
    status = Column(String(20), nullable=False, default="ACTIVE") # ACTIVE, WON, LOST, ABANDONED
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", lazy="joined")
    scenario = relationship("AIScenario", lazy="joined")
    messages = relationship("AIMessage", back_populates="session", cascade="all, delete-orphan", lazy="selectin")
    evaluation = relationship("AIGameEvaluation", back_populates="session", uselist=False, cascade="all, delete-orphan", lazy="selectin")
