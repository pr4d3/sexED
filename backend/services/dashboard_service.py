from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from repositories import dashboard_repository, course_repository
from uuid import UUID

async def get_instructor_overview_stats(db: AsyncSession, instructor_id: UUID, is_admin: bool = False):
    if is_admin:
        total_courses = await dashboard_repository.get_all_courses_count(db)
        total_enrolled = await dashboard_repository.get_all_enrollments_count(db)
        completed_students = await dashboard_repository.get_all_completed_enrollments_count(db)
        total_lessons = await dashboard_repository.get_all_lessons_count(db)
    else:
        total_courses = await dashboard_repository.get_instructor_courses_count(db, instructor_id)
        total_enrolled = await dashboard_repository.get_instructor_enrollments_count(db, instructor_id)
        completed_students = await dashboard_repository.get_instructor_completed_enrollments_count(db, instructor_id)
        total_lessons = await dashboard_repository.get_instructor_lessons_count(db, instructor_id)
        
    average_completion_rate = (completed_students / total_enrolled * 100) if total_enrolled > 0 else 0.0
    
    return {
        "total_courses": total_courses,
        "total_students_enrolled": total_enrolled,
        "total_completed_students": completed_students,
        "average_completion_rate": round(average_completion_rate, 2),
        "total_lessons_published": total_lessons
    }

async def get_instructor_courses(db: AsyncSession, instructor_id: UUID, is_admin: bool = False):
    return await dashboard_repository.get_instructor_courses_with_stats(db, None if is_admin else instructor_id)

async def get_course_students_progress(db: AsyncSession, instructor_id: UUID, course_id: UUID, status_filter: str = None, is_admin: bool = False):
    course = await course_repository.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Khóa học không tồn tại.")
        
    if not is_admin and course.instructor_id != instructor_id:
        raise HTTPException(status_code=403, detail="Giảng viên cố tình truy cập xem học viên của khóa học không do mình quản lý.")
        
    students = await dashboard_repository.get_course_students_progress(db, course_id, status_filter)
    
    return {
        "course_id": course.id,
        "course_title": course.title,
        "total_students": len(students),
        "students": students
    }
