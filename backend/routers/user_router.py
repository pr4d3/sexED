from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.dependencies import get_current_user, RoleGuard
from models.user import User
from schemas.user_schema import UserProfileResponse, UserProfileUpdate, UserProfileUpdateResponse, MyCoursesResponse, LessonCompleteResponse
from services import user_service, progress_service
from uuid import UUID

router = APIRouter(prefix="/api/v1/users", tags=["Users & Progress"])

@router.get("/profile", response_model=UserProfileResponse, status_code=status.HTTP_200_OK)
async def get_profile(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    profile = await user_service.get_profile(db, current_user.id)
    return UserProfileResponse(success=True, data=profile)

@router.put("/profile", response_model=UserProfileUpdateResponse, status_code=status.HTTP_200_OK)
async def update_profile(profile_data: UserProfileUpdate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    updated = await user_service.update_profile(db, current_user.id, profile_data)
    return UserProfileUpdateResponse(
        success=True,
        message="Cập nhật hồ sơ thành công",
        data=updated
    )

@router.get("/my-courses", response_model=MyCoursesResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(RoleGuard(["STUDENT_PARENT", "STUDENT_CHILD"]))])
async def get_my_courses(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    progress_list = await progress_service.get_user_progress_list(db, current_user.id)
    return MyCoursesResponse(success=True, data=progress_list)

@router.post("/courses/{course_id}/lessons/{lesson_id}/complete", response_model=LessonCompleteResponse, status_code=status.HTTP_200_OK, dependencies=[Depends(RoleGuard(["STUDENT_PARENT", "STUDENT_CHILD"]))])
async def complete_lesson(course_id: UUID, lesson_id: UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await progress_service.mark_lesson_as_completed(db, current_user.id, course_id, lesson_id)
    return LessonCompleteResponse(
        success=True,
        message="Ghi nhận tiến độ bài học thành công",
        data=result
    )
