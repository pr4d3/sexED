from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func
from sqlalchemy.orm import selectinload, joinedload
from models.course import Course
from models.lesson import Lesson
from models.course_enrollment import CourseEnrollment
from models.lesson_progress import LessonProgress
from models.user import User
from uuid import UUID

async def get_courses(db: AsyncSession, audience_filter: str = None) -> list[Course]:
    query = select(Course).options(joinedload(Course.instructor)).where(Course.is_published == True)
    if audience_filter:
        query = query.where(Course.target_audience.in_([audience_filter, "BOTH"]))
    result = await db.execute(query)
    return result.scalars().all()

async def get_course_by_id(db: AsyncSession, course_id: UUID) -> Course:
    result = await db.execute(
        select(Course)
        .options(selectinload(Course.lessons), joinedload(Course.instructor))
        .where(Course.id == course_id)
    )
    return result.scalars().first()

async def get_course_by_slug(db: AsyncSession, slug: str) -> Course:
    result = await db.execute(select(Course).where(Course.slug == slug))
    return result.scalars().first()

async def create_course(db: AsyncSession, course: Course) -> Course:
    db.add(course)
    await db.commit()
    await db.refresh(course)
    return course

async def update_course(db: AsyncSession, course: Course) -> Course:
    await db.commit()
    await db.refresh(course)
    return course

async def delete_course(db: AsyncSession, course: Course) -> None:
    await db.delete(course)
    await db.commit()

# Enrollments & Progress
async def get_enrollment(db: AsyncSession, user_id: UUID, course_id: UUID) -> CourseEnrollment:
    result = await db.execute(
        select(CourseEnrollment).where(
            and_(CourseEnrollment.user_id == user_id, CourseEnrollment.course_id == course_id)
        )
    )
    return result.scalars().first()

async def create_enrollment(db: AsyncSession, enrollment: CourseEnrollment) -> CourseEnrollment:
    db.add(enrollment)
    await db.commit()
    await db.refresh(enrollment)
    return enrollment

async def get_user_enrollments(db: AsyncSession, user_id: UUID) -> list[CourseEnrollment]:
    result = await db.execute(
        select(CourseEnrollment)
        .options(joinedload(CourseEnrollment.course).joinedload(Course.instructor))
        .where(CourseEnrollment.user_id == user_id)
    )
    return result.scalars().all()

async def get_completed_lessons_count(db: AsyncSession, user_id: UUID, course_id: UUID) -> int:
    result = await db.execute(
        select(func.count(LessonProgress.id))
        .join(Lesson, Lesson.id == LessonProgress.lesson_id)
        .where(
            and_(
                LessonProgress.user_id == user_id,
                LessonProgress.is_completed == True,
                Lesson.course_id == course_id
            )
        )
    )
    return result.scalar() or 0

async def get_lesson_progress(db: AsyncSession, user_id: UUID, lesson_id: UUID) -> LessonProgress:
    result = await db.execute(
        select(LessonProgress).where(
            and_(LessonProgress.user_id == user_id, LessonProgress.lesson_id == lesson_id)
        )
    )
    return result.scalars().first()

async def save_lesson_progress(db: AsyncSession, progress: LessonProgress) -> LessonProgress:
    existing = await get_lesson_progress(db, progress.user_id, progress.lesson_id)
    if existing:
        existing.is_completed = progress.is_completed
        existing.completed_at = func.now()
        db.add(existing)
        progress = existing
    else:
        db.add(progress)
    await db.flush()
    return progress

# Lesson management
async def get_lesson_by_id(db: AsyncSession, lesson_id: UUID) -> Lesson:
    result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    return result.scalars().first()

async def create_lesson(db: AsyncSession, lesson: Lesson) -> Lesson:
    db.add(lesson)
    await db.commit()
    await db.refresh(lesson)
    return lesson

async def update_lesson(db: AsyncSession, lesson: Lesson) -> Lesson:
    await db.commit()
    await db.refresh(lesson)
    return lesson

async def delete_lesson(db: AsyncSession, lesson: Lesson) -> None:
    await db.delete(lesson)
    await db.commit()
