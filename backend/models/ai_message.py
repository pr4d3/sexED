import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime, Text, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base

class AIMessage(Base):
    __tablename__ = "ai_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("ai_sessions.id", ondelete="CASCADE"), nullable=False)
    sender = Column(String(10), nullable=False) # USER, NPC
    dialogue = Column(Text, nullable=False)
    action = Column(String(255), nullable=True)
    emotion = Column(String(30), nullable=True)
    score_change = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    session = relationship("AISession", back_populates="messages")
