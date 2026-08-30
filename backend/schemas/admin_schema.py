from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime, date

class AdminRoleItem(BaseModel):
    id: int
    role_code: str
    role_name: str
    description: Optional[str] = None

class AdminRoleListResponse(BaseModel):
    success: bool
    data: List[AdminRoleItem]

class AdminUserListItem(BaseModel):
    id: UUID
    username: str
    email: str
    full_name: str
    role_id: int
    role_code: str
    role_name: str
    status: str
    avatar_url: Optional[str] = None
    phone_number: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    bio: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class AdminUserPagination(BaseModel):
    total: int
    page: int
    limit: int
    total_pages: int

class AdminUserStats(BaseModel):
    total_users: int
    active_users: int
    inactive_users: int
    admin_count: int
    instructor_count: int
    parent_count: int
    student_count: int

class AdminUserListResponseData(BaseModel):
    users: List[AdminUserListItem]
    pagination: AdminUserPagination
    stats: AdminUserStats

class AdminUserListResponse(BaseModel):
    success: bool
    data: AdminUserListResponseData

class AdminUserStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(ACTIVE|INACTIVE)$")

class AdminUserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=150)
    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    role_id: Optional[int] = None
    status: Optional[str] = Field(None, pattern="^(ACTIVE|INACTIVE)$")
    phone_number: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    bio: Optional[str] = None
    new_password: Optional[str] = Field(None, min_length=6)

class AdminUserUpdateResponse(BaseModel):
    success: bool
    message: str
    data: AdminUserListItem
