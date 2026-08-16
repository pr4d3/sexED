from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.dependencies import get_current_user, RoleGuard
from models.user import User
from models.role import Role
from schemas.dashboard_schema import OverviewStatsResponse, InstructorCoursesResponse, CourseStudentsProgressResponse
from services import dashboard_service
from uuid import UUID
from typing import Optional

router = APIRouter(prefix="/api/v1/instructor/dashboard", tags=["Instructor Dashboard"], dependencies=[Depends(RoleGuard(["INSTRUCTOR", "ADMIN"]))])

@router.get("/overview", response_model=OverviewStatsResponse, status_code=status.HTTP_200_OK)
async def get_overview(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    is_admin = False
    from sqlalchemy import select
    role_result = await db.execute(select(Role).where(Role.id == current_user.role_id))
    user_role = role_result.scalars().first()
    if user_role and user_role.role_code == "ADMIN":
        is_admin = True
        
    stats = await dashboard_service.get_instructor_overview_stats(db, current_user.id, is_admin)
    return OverviewStatsResponse(success=True, data=stats)

@router.get("/courses", response_model=InstructorCoursesResponse, status_code=status.HTTP_200_OK)
async def get_instructor_courses(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    is_admin = False
    from sqlalchemy import select
    role_result = await db.execute(select(Role).where(Role.id == current_user.role_id))
    user_role = role_result.scalars().first()
    if user_role and user_role.role_code == "ADMIN":
        is_admin = True
        
    courses = await dashboard_service.get_instructor_courses(db, current_user.id, is_admin)
    return InstructorCoursesResponse(success=True, data=courses)

@router.get("/courses/{course_id}/students", response_model=CourseStudentsProgressResponse, status_code=status.HTTP_200_OK)
async def get_course_students(course_id: UUID, status: Optional[str] = None, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    is_admin = False
    from sqlalchemy import select
    role_result = await db.execute(select(Role).where(Role.id == current_user.role_id))
    user_role = role_result.scalars().first()
    if user_role and user_role.role_code == "ADMIN":
        is_admin = True
        
    progress = await dashboard_service.get_course_students_progress(db, current_user.id, course_id, status, is_admin)
    return CourseStudentsProgressResponse(success=True, data=progress)
