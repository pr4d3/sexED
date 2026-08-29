import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime, Text, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base

class AIGameEvaluation(Base):
    __tablename__ = "ai_game_evaluations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("ai_sessions.id", ondelete="CASCADE"), unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    scenario_id = Column(Integer, ForeignKey("ai_scenarios.id", ondelete="CASCADE"), nullable=False)
    final_score = Column(Integer, nullable=False)
    result_outcome = Column(String(50), nullable=False) # SAFE_EXIT, DANGER_ALERT, OPEN_HEART, CLOSE_HEART, etc.
    total_turns = Column(Integer, nullable=False)
    duration_seconds = Column(Integer, nullable=False)
    ai_feedback_summary = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    session = relationship("AISession", back_populates="evaluation")
    user = relationship("User", lazy="joined")
    scenario = relationship("AIScenario", lazy="joined")
