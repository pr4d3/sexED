from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, case
from sqlalchemy.orm import selectinload, joinedload
from models.course import Course
from models.lesson import Lesson
from models.course_enrollment import CourseEnrollment
from models.lesson_progress import LessonProgress
from models.user import User
from uuid import UUID

async def get_instructor_courses_count(db: AsyncSession, instructor_id: UUID) -> int:
    result = await db.execute(
        select(func.count(Course.id)).where(Course.instructor_id == instructor_id)
    )
    return result.scalar() or 0

async def get_all_courses_count(db: AsyncSession) -> int:
    result = await db.execute(select(func.count(Course.id)))
    return result.scalar() or 0

async def get_instructor_enrollments_count(db: AsyncSession, instructor_id: UUID) -> int:
    result = await db.execute(
        select(func.count(CourseEnrollment.id))
        .join(Course, Course.id == CourseEnrollment.course_id)
        .where(Course.instructor_id == instructor_id)
    )
    return result.scalar() or 0

async def get_all_enrollments_count(db: AsyncSession) -> int:
    result = await db.execute(select(func.count(CourseEnrollment.id)))
    return result.scalar() or 0

async def get_instructor_completed_enrollments_count(db: AsyncSession, instructor_id: UUID) -> int:
    result = await db.execute(
        select(func.count(CourseEnrollment.id))
        .join(Course, Course.id == CourseEnrollment.course_id)
        .where(
            and_(
                Course.instructor_id == instructor_id,
                CourseEnrollment.status == "COMPLETED"
            )
        )
    )
    return result.scalar() or 0

async def get_all_completed_enrollments_count(db: AsyncSession) -> int:
    result = await db.execute(
        select(func.count(CourseEnrollment.id)).where(CourseEnrollment.status == "COMPLETED")
    )
    return result.scalar() or 0

async def get_instructor_lessons_count(db: AsyncSession, instructor_id: UUID) -> int:
    result = await db.execute(
        select(func.count(Lesson.id))
        .join(Course, Course.id == Lesson.course_id)
        .where(Course.instructor_id == instructor_id)
    )
    return result.scalar() or 0

async def get_all_lessons_count(db: AsyncSession) -> int:
    result = await db.execute(select(func.count(Lesson.id)))
    return result.scalar() or 0

async def get_instructor_courses_with_stats(db: AsyncSession, instructor_id: UUID = None) -> list[dict]:
    query = select(Course).options(selectinload(Course.lessons))
    if instructor_id:
        query = query.where(Course.instructor_id == instructor_id)
    result = await db.execute(query)
    courses = result.scalars().all()
    
    stats_list = []
    for course in courses:
        enroll_res = await db.execute(
            select(
                func.count(CourseEnrollment.id),
                func.sum(case((CourseEnrollment.status == "COMPLETED", 1), else_=0))
            )
            .where(CourseEnrollment.course_id == course.id)
        )
        row = enroll_res.first()
        total_enrolled = row[0] if row else 0
        completed_count = row[1] if row and row[1] else 0
        total_enrolled = total_enrolled or 0
        completed_count = completed_count or 0
        in_progress_count = total_enrolled - completed_count
        
        stats_list.append({
            "course_id": course.id,
            "title": course.title,
            "target_audience": course.target_audience,
            "is_published": course.is_published,
            "total_lessons": len(course.lessons),
            "total_enrolled": total_enrolled,
            "completed_count": completed_count,
            "in_progress_count": in_progress_count,
            "created_at": course.created_at
        })
    return stats_list

async def get_course_students_progress(db: AsyncSession, course_id: UUID, status_filter: str = None) -> list[dict]:
    query = (
        select(CourseEnrollment)
        .join(User, User.id == CourseEnrollment.user_id)
        .options(joinedload(CourseEnrollment.user).joinedload(User.role))
        .where(CourseEnrollment.course_id == course_id)
    )
    if status_filter:
        query = query.where(CourseEnrollment.status == status_filter)
        
    result = await db.execute(query)
    enrollments = result.scalars().all()
    
    lessons_res = await db.execute(
        select(func.count(Lesson.id)).where(Lesson.course_id == course_id)
    )
    total_lessons = lessons_res.scalar() or 0
    
    students_stats = []
    for enroll in enrollments:
        comp_res = await db.execute(
            select(func.count(LessonProgress.id))
            .join(Lesson, Lesson.id == LessonProgress.lesson_id)
            .where(
                and_(
                    LessonProgress.user_id == enroll.user_id,
                    LessonProgress.is_completed == True,
                    Lesson.course_id == course_id
                )
            )
        )
        completed_count = comp_res.scalar() or 0
        progress_pct = (completed_count / total_lessons * 100) if total_lessons > 0 else 0
        
        students_stats.append({
            "student_id": enroll.user_id,
            "full_name": enroll.user.full_name,
            "email": enroll.user.email,
            "role": enroll.user.role.role_code,
            "enrolled_at": enroll.enrolled_at,
            "completed_at": enroll.completed_at,
            "status": enroll.status,
            "progress_percentage": round(progress_pct, 2),
            "completed_lessons_count": completed_count
        })
    return students_stats
