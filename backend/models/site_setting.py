from sqlalchemy import Column, Integer, String, DateTime
from core.database import Base
from sqlalchemy.sql import func

class SiteSetting(Base):
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)
    key_name = Column(String(100), unique=True, nullable=False)
    value_content = Column(String, nullable=False)
    description = Column(String(255))
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
