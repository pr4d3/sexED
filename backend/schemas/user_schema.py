from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from uuid import UUID
from datetime import date, datetime

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(None, max_length=150)
    avatar_url: Optional[str] = Field(None, max_length=500)
    gender: Optional[str] = Field(None, max_length=20)
    date_of_birth: Optional[date] = None
    phone_number: Optional[str] = Field(None, max_length=20)
    bio: Optional[str] = None

class UserProfileResponseData(BaseModel):
    user_id: UUID
    username: str
    email: EmailStr
    full_name: str
    role: str
    avatar_url: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    phone_number: Optional[str] = None
    bio: Optional[str] = None

class UserProfileResponse(BaseModel):
    success: bool
    data: UserProfileResponseData

class UserProfileUpdateResponseData(BaseModel):
    user_id: UUID
    full_name: str
    avatar_url: Optional[str] = None

class UserProfileUpdateResponse(BaseModel):
    success: bool
    message: str
    data: UserProfileUpdateResponseData

class MyCourseProgressData(BaseModel):
    course_id: UUID
    course_title: str
    thumbnail_url: Optional[str] = None
    status: str
    total_lessons: int
    completed_lessons: int
    progress_percentage: float
    enrolled_at: datetime
    completed_at: Optional[datetime] = None

class MyCoursesResponse(BaseModel):
    success: bool
    data: list[MyCourseProgressData]

class LessonCompleteResponseData(BaseModel):
    course_id: UUID
    lesson_id: UUID
    progress_percentage: float
    course_status: str
    is_course_just_completed: bool

class LessonCompleteResponse(BaseModel):
    success: bool
    message: str
    data: LessonCompleteResponseData
