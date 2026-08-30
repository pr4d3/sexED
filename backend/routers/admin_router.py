from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.dependencies import get_current_user, RoleGuard
from models.user import User
from schemas.admin_schema import (
    AdminUserListResponse,
    AdminRoleListResponse,
    AdminUserStatusUpdate,
    AdminUserUpdate,
    AdminUserUpdateResponse
)
from services import admin_service
from uuid import UUID
from typing import Optional

router = APIRouter(
    prefix="/api/v1/admin",
    tags=["Admin System & User Management"],
    dependencies=[Depends(RoleGuard(["ADMIN"]))]
)

@router.get("/roles", response_model=AdminRoleListResponse, status_code=status.HTTP_200_OK)
async def get_all_roles(
    db: AsyncSession = Depends(get_db)
):
    roles = await admin_service.get_roles(db)
    return AdminRoleListResponse(success=True, data=roles)

@router.get("/users", response_model=AdminUserListResponse, status_code=status.HTTP_200_OK)
async def get_users(
    search: Optional[str] = Query(None, description="Tìm theo họ tên, email hoặc username"),
    role_code: Optional[str] = Query(None, description="Lọc theo mã vai trò (ADMIN, INSTRUCTOR, STUDENT_PARENT, STUDENT_CHILD)"),
    status_filter: Optional[str] = Query(None, alias="status", pattern="^(ACTIVE|INACTIVE)$", description="Lọc theo trạng thái"),
    page: int = Query(1, ge=1, description="Số trang"),
    limit: int = Query(15, ge=1, le=100, description="Số lượng bản ghi trên một trang"),
    db: AsyncSession = Depends(get_db)
):
    result = await admin_service.get_users_page(
        db=db,
        search=search,
        role_code=role_code,
        status=status_filter,
        page=page,
        limit=limit
    )
    return AdminUserListResponse(success=True, data=result)

@router.put("/users/{user_id}/status", response_model=AdminUserUpdateResponse, status_code=status.HTTP_200_OK)
async def update_user_status(
    user_id: UUID,
    status_data: AdminUserStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await admin_service.update_user_status(
        db=db,
        admin_id=current_user.id,
        target_user_id=user_id,
        new_status=status_data.status
    )
    action_text = "kích hoạt" if status_data.status == "ACTIVE" else "vô hiệu hóa"
    return AdminUserUpdateResponse(
        success=True,
        message=f"Đã {action_text} tài khoản thành công",
        data=result
    )

@router.put("/users/{user_id}", response_model=AdminUserUpdateResponse, status_code=status.HTTP_200_OK)
async def update_user_details(
    user_id: UUID,
    user_data: AdminUserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await admin_service.update_user_details(
        db=db,
        admin_id=current_user.id,
        target_user_id=user_id,
        data=user_data
    )
    return AdminUserUpdateResponse(
        success=True,
        message="Cập nhật thông tin người dùng thành công",
        data=result
    )
