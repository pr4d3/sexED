from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from uuid import UUID
from datetime import datetime

class CategoryResponseData(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    name: str
    slug: str
    description: Optional[str] = None

class CategoryListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    success: bool
    data: list[CategoryResponseData]

class PostAuthorInfo(BaseModel):
    id: UUID
    full_name: str
    role: str
    avatar_url: Optional[str] = None

class PostListData(BaseModel):
    id: UUID
    category_id: int
    category_name: str
    title: str
    short_content: str
    author: PostAuthorInfo
    comment_count: int
    status: str
    created_at: datetime

class PostListResponse(BaseModel):
    success: bool
    data: list[PostListData]

class CommentAuthorInfo(BaseModel):
    id: UUID
    full_name: str
    role: str
    avatar_url: Optional[str] = None

class CommentNode(BaseModel):
    id: UUID
    parent_comment_id: Optional[UUID] = None
    content: str
    status: str
    created_at: datetime
    author: CommentAuthorInfo
    replies: list['CommentNode'] = []

class PostDetailData(BaseModel):
    id: UUID
    category_id: int
    category_name: str
    title: str
    content: str
    status: str
    created_at: datetime
    author: PostAuthorInfo
    comments: list[CommentNode]

class PostDetailResponse(BaseModel):
    success: bool
    data: PostDetailData

class PostCreate(BaseModel):
    category_id: int
    title: str = Field(..., max_length=255, min_length=5)
    content: str = Field(..., min_length=10)

class PostCreateResponseData(BaseModel):
    post_id: UUID
    title: str
    status: str
    created_at: datetime

class PostCreateResponse(BaseModel):
    success: bool
    message: str
    data: PostCreateResponseData

class CommentCreate(BaseModel):
    content: str = Field(..., min_length=2)
    parent_comment_id: Optional[UUID] = None

class CommentCreateResponseData(BaseModel):
    comment_id: UUID
    post_id: UUID
    content: str
    created_at: datetime
    author: PostAuthorInfo

class CommentCreateResponse(BaseModel):
    success: bool
    message: str
    data: CommentCreateResponseData

class ModerationAction(BaseModel):
    action: str = Field(..., pattern="^(HIDE|DELETE|PUBLISH)$")

class PostModerationResponseData(BaseModel):
    post_id: UUID
    status: str
    moderated_by: UUID

class PostModerationResponse(BaseModel):
    success: bool
    message: str
    data: PostModerationResponseData

class CommentModerationResponseData(BaseModel):
    comment_id: UUID
    status: str
    moderated_by: UUID

class CommentModerationResponse(BaseModel):
    success: bool
    message: str
    data: CommentModerationResponseData
