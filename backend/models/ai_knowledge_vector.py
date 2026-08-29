import uuid
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.types import UserDefinedType
from core.database import Base

class PGVectorType(UserDefinedType):
    def get_col_spec(self, **kw):
        return "vector(768)"

    def bind_processor(self, dialect):
        def process(value):
            if isinstance(value, list):
                return str(value)
            return value
        return process

    def result_processor(self, dialect, coltype):
        def process(value):
            if isinstance(value, str):
                # Chuyển '[0.1,0.2,...]' thành list float
                clean_val = value.strip("[]")
                if clean_val:
                    return [float(x) for x in clean_val.split(",")]
                return []
            return value
        return process

class AIKnowledgeVector(Base):
    __tablename__ = "ai_knowledge_vectors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category = Column(String(50), nullable=False) # ONLINE_SAFETY, PUBERTY_ANATOMY, COMMUNICATION_SKILLS
    topic = Column(String(150), nullable=False)
    content_chunk = Column(Text, nullable=False)
    embedding = Column(PGVectorType, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
