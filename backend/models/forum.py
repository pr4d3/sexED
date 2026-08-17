from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from core.database import Base
from sqlalchemy.sql import func
import uuid

class ForumCategory(Base):
    __tablename__ = "forum_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class ForumPost(Base):
    __tablename__ = "forum_posts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category_id = Column(Integer, ForeignKey("forum_categories.id"), nullable=False)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(String, nullable=False)
    status = Column(String(20), nullable=False, default="PUBLISHED")
    moderated_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    category = relationship("ForumCategory", lazy="joined")
    author = relationship("User", foreign_keys=[author_id], lazy="joined")
    moderator = relationship("User", foreign_keys=[moderated_by], lazy="joined")
    comments = relationship("ForumComment", back_populates="post", cascade="all, delete-orphan", lazy="selectin")

class ForumComment(Base):
    __tablename__ = "forum_comments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    post_id = Column(UUID(as_uuid=True), ForeignKey("forum_posts.id", ondelete="CASCADE"), nullable=False)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    parent_comment_id = Column(UUID(as_uuid=True), ForeignKey("forum_comments.id"))
    content = Column(String, nullable=False)
    status = Column(String(20), nullable=False, default="PUBLISHED")
    moderated_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    post = relationship("ForumPost", back_populates="comments", lazy="joined")
    author = relationship("User", foreign_keys=[author_id], lazy="joined")
    moderator = relationship("User", foreign_keys=[moderated_by], lazy="joined")
    
    parent = relationship("ForumComment", remote_side=[id], back_populates="replies", lazy="joined")
    replies = relationship("ForumComment", back_populates="parent", cascade="all, delete-orphan", lazy="selectin")
