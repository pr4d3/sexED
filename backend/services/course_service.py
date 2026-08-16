from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from repositories import course_repository, user_repository
from models.course import Course
from models.lesson import Lesson
from models.course_enrollment import CourseEnrollment
from schemas.course_schema import CourseCreate, LessonCreate
from uuid import UUID
from datetime import datetime, timezone

async def get_public_courses(db: AsyncSession, target_audience: str = None):
    courses = await course_repository.get_courses(db, target_audience)
    
    results = []
    for c in courses:
        results.append({
            "id": c.id,
            "title": c.title,
            "slug": c.slug,
            "short_description": c.short_description,
            "thumbnail_url": c.thumbnail_url,
            "target_audience": c.target_audience,
            "total_lessons": len(c.lessons) if c.lessons else 0,
            "instructor_name": c.instructor.full_name if c.instructor else "Unknown"
        })
    return results

async def get_course_intro(db: AsyncSession, course_id: UUID, current_user = None):
    course = await course_repository.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Khóa học không tồn tại.")
        
    is_enrolled = False
    if current_user:
        enrollment = await course_repository.get_enrollment(db, current_user.id, course_id)
        if enrollment:
            is_enrolled = True
            
    syllabus = []
    for lesson in course.lessons:
        syllabus.append({
            "id": lesson.id,
            "order_index": lesson.order_index,
            "title": lesson.title,
            "duration_minutes": lesson.duration_minutes
        })
        
    return {
        "course_id": course.id,
        "title": course.title,
        "slug": course.slug,
        "short_description": course.short_description,
        "description": course.description,
        "thumbnail_url": course.thumbnail_url,
        "target_audience": course.target_audience,
        "instructor": {
            "id": course.instructor_id,
            "full_name": course.instructor.full_name if course.instructor else "Unknown",
            "avatar_url": course.instructor.profile.avatar_url if course.instructor and course.instructor.profile else None
        },
        "total_lessons": len(course.lessons),
        "is_enrolled": is_enrolled,
        "syllabus": syllabus
    }

async def enroll_course(db: AsyncSession, user_id: UUID, course_id: UUID):
    existing = await course_repository.get_enrollment(db, user_id, course_id)
    if existing:
        return {
            "course_id": course_id,
            "status": existing.status,
            "enrolled_at": existing.enrolled_at
        }
        
    course = await course_repository.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Khóa học không tồn tại.")
        
    enrollment = CourseEnrollment(user_id=user_id, course_id=course_id, status="IN_PROGRESS")
    created = await course_repository.create_enrollment(db, enrollment)
    return {
        "course_id": created.course_id,
        "status": created.status,
        "enrolled_at": created.enrolled_at
    }

async def get_course_learning_room(db: AsyncSession, user_id: UUID, course_id: UUID):
    enrollment = await course_repository.get_enrollment(db, user_id, course_id)
    if not enrollment:
        raise HTTPException(status_code=400, detail="Học viên chưa đăng ký tham gia khóa học này.")
        
    course = await course_repository.get_course_by_id(db, course_id)
    total_lessons = len(course.lessons)
    completed_lessons = await course_repository.get_completed_lessons_count(db, user_id, course_id)
    
    progress_pct = (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0
    
    lessons_data = []
    for lesson in course.lessons:
        prog = await course_repository.get_lesson_progress(db, user_id, lesson.id)
        is_completed = prog.is_completed if prog else False
        
        lessons_data.append({
            "lesson_id": lesson.id,
            "order_index": lesson.order_index,
            "title": lesson.title,
            "content_type": lesson.content_type,
            "video_url": lesson.video_url,
            "content_body": lesson.content_body,
            "is_completed": is_completed
        })
        
    return {
        "course_id": course.id,
        "course_title": course.title,
        "progress_percentage": round(progress_pct, 2),
        "lessons": lessons_data
    }

async def get_course_outro(db: AsyncSession, user_id: UUID, course_id: UUID):
    enrollment = await course_repository.get_enrollment(db, user_id, course_id)
    if not enrollment or enrollment.status != "COMPLETED":
        raise HTTPException(status_code=403, detail="Bạn chưa hoàn thành tất cả các bài học trong khóa học này.")
        
    course = await course_repository.get_course_by_id(db, course_id)
    return {
        "course_id": course.id,
        "course_title": course.title,
        "completed_at": enrollment.completed_at,
        "outro_content": course.outro_content or "Chúc mừng bạn đã hoàn thành khóa học!",
        "research_survey_url": "https://forms.gle/research_feedback_sexed"
    }

# Course Management
async def create_new_course(db: AsyncSession, instructor_id: UUID, course_data: CourseCreate):
    course = Course(
        instructor_id=instructor_id,
        title=course_data.title,
        slug=course_data.slug,
        short_description=course_data.short_description,
        description=course_data.description,
        thumbnail_url=course_data.thumbnail_url,
        target_audience=course_data.target_audience,
        outro_content=course_data.outro_content,
        is_published=False
    )
    created = await course_repository.create_course(db, course)
    return {
        "course_id": created.id,
        "slug": created.slug
    }

async def update_existing_course(db: AsyncSession, instructor_id: UUID, course_id: UUID, course_data: CourseCreate, is_admin: bool = False):
    course = await course_repository.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Khóa học không tồn tại.")
        
    if not is_admin and course.instructor_id != instructor_id:
        raise HTTPException(status_code=403, detail="Bạn không sở hữu khóa học này.")
        
    course.title = course_data.title
    course.slug = course_data.slug
    course.short_description = course_data.short_description
    course.description = course_data.description
    course.thumbnail_url = course_data.thumbnail_url
    course.target_audience = course_data.target_audience
    course.outro_content = course_data.outro_content
    
    updated = await course_repository.update_course(db, course)
    return {
        "course_id": updated.id,
        "slug": updated.slug
    }

async def delete_existing_course(db: AsyncSession, instructor_id: UUID, course_id: UUID, is_admin: bool = False):
    course = await course_repository.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Khóa học không tồn tại.")
        
    if not is_admin and course.instructor_id != instructor_id:
        raise HTTPException(status_code=403, detail="Bạn không sở hữu khóa học này.")
        
    await course_repository.delete_course(db, course)

# Lessons
async def add_lesson_to_course(db: AsyncSession, instructor_id: UUID, course_id: UUID, lesson_data: LessonCreate, is_admin: bool = False):
    course = await course_repository.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Khóa học không tồn tại.")
        
    if not is_admin and course.instructor_id != instructor_id:
        raise HTTPException(status_code=403, detail="Bạn không sở hữu khóa học này.")
        
    lesson = Lesson(
        course_id=course_id,
        title=lesson_data.title,
        content_type=lesson_data.content_type,
        video_url=lesson_data.video_url,
        content_body=lesson_data.content_body,
        order_index=lesson_data.order_index,
        duration_minutes=lesson_data.duration_minutes
    )
    
    created = await course_repository.create_lesson(db, lesson)
    return {
        "lesson_id": created.id,
        "title": created.title
    }

async def update_lesson_in_course(db: AsyncSession, instructor_id: UUID, course_id: UUID, lesson_id: UUID, lesson_data: LessonCreate, is_admin: bool = False):
    course = await course_repository.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Khóa học không tồn tại.")
        
    if not is_admin and course.instructor_id != instructor_id:
        raise HTTPException(status_code=403, detail="Bạn không sở hữu khóa học này.")
        
    lesson = await course_repository.get_lesson_by_id(db, lesson_id)
    if not lesson or lesson.course_id != course_id:
        raise HTTPException(status_code=404, detail="Không tìm thấy bài học.")
        
    lesson.title = lesson_data.title
    lesson.content_type = lesson_data.content_type
    lesson.video_url = lesson_data.video_url
    lesson.content_body = lesson_data.content_body
    lesson.order_index = lesson_data.order_index
    lesson.duration_minutes = lesson_data.duration_minutes
    
    await course_repository.update_lesson(db, lesson)
    return {
        "lesson_id": lesson.id,
        "title": lesson.title
    }

async def delete_lesson_from_course(db: AsyncSession, instructor_id: UUID, course_id: UUID, lesson_id: UUID, is_admin: bool = False):
    course = await course_repository.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Khóa học không tồn tại.")
        
    if not is_admin and course.instructor_id != instructor_id:
        raise HTTPException(status_code=403, detail="Bạn không sở hữu khóa học này.")
        
    lesson = await course_repository.get_lesson_by_id(db, lesson_id)
    if not lesson or lesson.course_id != course_id:
        raise HTTPException(status_code=404, detail="Không tìm thấy bài học.")
        
    await course_repository.delete_lesson(db, lesson)
