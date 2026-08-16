from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.dependencies import get_current_user, RoleGuard
from models.user import User
from models.role import Role
from schemas.forum_schema import (
    CategoryListResponse, PostListResponse, PostDetailResponse, PostCreate, PostCreateResponse,
    CommentCreate, CommentCreateResponse, ModerationAction, PostModerationResponse, CommentModerationResponse
)
from services import forum_service
from uuid import UUID
from typing import Optional

router = APIRouter(tags=["Forum & Community"])

@router.get("/api/v1/forum/categories", response_model=CategoryListResponse, status_code=status.HTTP_200_OK)
async def get_categories(db: AsyncSession = Depends(get_db)):
    categories = await forum_service.get_forum_categories(db)
    return CategoryListResponse(success=True, data=categories)

@router.get("/api/v1/forum/posts", response_model=PostListResponse, status_code=status.HTTP_200_OK)
async def get_posts(category_id: Optional[int] = None, search: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    posts = await forum_service.get_forum_feed(db, category_id, search, include_hidden_deleted=False)
    return PostListResponse(success=True, data=posts)

@router.get("/api/v1/forum/posts/{post_id}", response_model=PostDetailResponse, status_code=status.HTTP_200_OK)
async def get_post_detail(post_id: UUID, db: AsyncSession = Depends(get_db)):
    detail = await forum_service.get_post_detail_with_comments(db, post_id, include_hidden_deleted=False)
    return PostDetailResponse(success=True, data=detail)

@router.post("/api/v1/forum/posts", response_model=PostCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_post(post_data: PostCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await forum_service.create_new_post(db, current_user.id, post_data)
    return PostCreateResponse(
        success=True,
        message="Đăng bài thảo luận thành công",
        data=result
    )

@router.post("/api/v1/forum/posts/{post_id}/comments", response_model=CommentCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(post_id: UUID, comment_data: CommentCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await forum_service.create_new_comment(db, current_user.id, post_id, comment_data)
    return CommentCreateResponse(
        success=True,
        message="Gửi bình luận thành công",
        data=result
    )

@router.put("/api/v1/admin/forum/posts/{post_id}/moderate", response_model=PostModerationResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(RoleGuard(["ADMIN"]))])
async def moderate_post(post_id: UUID, mod_data: ModerationAction, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    target_status = "HIDDEN" if mod_data.action == "HIDE" else "DELETED" if mod_data.action == "DELETE" else "PUBLISHED"
    result = await forum_service.moderate_post_status(db, current_user.id, post_id, target_status)
    return PostModerationResponse(
        success=True,
        message=f"Đã ẩn/xóa bài viết vi phạm thành công",
        data=result
    )

@router.put("/api/v1/admin/forum/comments/{comment_id}/moderate", response_model=CommentModerationResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(RoleGuard(["ADMIN"]))])
async def moderate_comment(comment_id: UUID, mod_data: ModerationAction, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    target_status = "HIDDEN" if mod_data.action == "HIDE" else "DELETED" if mod_data.action == "DELETE" else "PUBLISHED"
    result = await forum_service.moderate_comment_status(db, current_user.id, comment_id, target_status)
    return CommentModerationResponse(
        success=True,
        message=f"Đã cập nhật trạng thái bình luận thành công",
        data=result
    )
