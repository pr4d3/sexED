from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from core.dependencies import get_current_user, RoleGuard, get_optional_user
from models.user import User
from models.role import Role
from repositories import course_repository
from schemas.course_schema import (
    CourseListResponse, CourseIntroResponse, CourseEnrollResponse, CourseLearningResponse,
    CourseOutroResponse, CourseCreate, CourseCreateResponse, LessonCreate, LessonReorder
)
from schemas.auth_schema import StandardResponse
from services import course_service
from uuid import UUID
from typing import Optional
from sqlalchemy import select

router = APIRouter(prefix="/api/v1/courses", tags=["Courses & Content"])

@router.get("", response_model=CourseListResponse, status_code=status.HTTP_200_OK)
async def get_courses(
    target_audience: Optional[str] = None,
    current_user: Optional[User] = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user:
        role_result = await db.execute(select(Role).where(Role.id == current_user.role_id))
        user_role = role_result.scalars().first()
        if user_role and user_role.role_code == "STUDENT_PARENT":
            if target_audience == "CHILD":
                return CourseListResponse(success=True, data=[])
            if not target_audience:
                target_audience = "PARENT"
        elif user_role and (user_role.role_code == "STUDENT_CHILD" or user_role.role_code == "STUDENT"):
            if target_audience == "PARENT":
                return CourseListResponse(success=True, data=[])
            if not target_audience:
                target_audience = "CHILD"

    courses = await course_service.get_public_courses(db, target_audience)
    return CourseListResponse(success=True, data=courses)

@router.get("/{course_id}/intro", response_model=CourseIntroResponse, status_code=status.HTTP_200_OK)
async def get_course_intro(course_id: UUID, current_user: Optional[User] = Depends(get_optional_user), db: AsyncSession = Depends(get_db)):
    intro_data = await course_service.get_course_intro(db, course_id, current_user)
    
    if current_user:
        role_result = await db.execute(select(Role).where(Role.id == current_user.role_id))
        user_role = role_result.scalars().first()
        # Phụ huynh không xem được khóa học của Trẻ em
        if user_role and user_role.role_code == "STUDENT_PARENT" and intro_data["target_audience"] == "CHILD":
            raise HTTPException(status_code=403, detail="Khóa học này chỉ dành riêng cho học sinh / trẻ em, phụ huynh không thể xem hoặc tham gia.")
        # Trẻ em không xem được khóa học của Người lớn / Phụ huynh
        if user_role and (user_role.role_code == "STUDENT_CHILD" or user_role.role_code == "STUDENT") and intro_data["target_audience"] == "PARENT":
            raise HTTPException(status_code=403, detail="Khóa học này chỉ dành riêng cho phụ huynh / người lớn, học sinh không thể xem hoặc tham gia.")
            
    return CourseIntroResponse(success=True, data=intro_data)

@router.post("/{course_id}/enroll", response_model=CourseEnrollResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(RoleGuard(["STUDENT_PARENT", "STUDENT_CHILD"]))])
async def enroll_course(course_id: UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    role_result = await db.execute(select(Role).where(Role.id == current_user.role_id))
    user_role = role_result.scalars().first()
    course = await course_repository.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Khóa học không tồn tại.")
        
    if user_role and user_role.role_code == "STUDENT_PARENT" and course.target_audience == "CHILD":
        raise HTTPException(status_code=403, detail="Khóa học này chỉ dành riêng cho học sinh / trẻ em, phụ huynh không thể đăng ký.")
    if user_role and (user_role.role_code == "STUDENT_CHILD" or user_role.role_code == "STUDENT") and course.target_audience == "PARENT":
        raise HTTPException(status_code=403, detail="Khóa học này chỉ dành riêng cho phụ huynh / người lớn, học sinh không thể đăng ký.")

    result = await course_service.enroll_course(db, current_user.id, course_id)
    return CourseEnrollResponse(
        success=True,
        message="Đăng ký khóa học thành công! Bạn có thể bắt đầu học ngay bây giờ.",
        data=result
    )

@router.get("/{course_id}/learn", response_model=CourseLearningResponse, status_code=status.HTTP_200_OK)
async def get_course_learning(course_id: UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    role_result = await db.execute(select(Role).where(Role.id == current_user.role_id))
    user_role = role_result.scalars().first()
    course = await course_repository.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Khóa học không tồn tại.")
        
    if user_role and user_role.role_code == "STUDENT_PARENT" and course.target_audience == "CHILD":
        raise HTTPException(status_code=403, detail="Khóa học này chỉ dành riêng cho học sinh / trẻ em, phụ huynh không thể truy cập phòng học.")
    if user_role and (user_role.role_code == "STUDENT_CHILD" or user_role.role_code == "STUDENT") and course.target_audience == "PARENT":
        raise HTTPException(status_code=403, detail="Khóa học này chỉ dành riêng cho phụ huynh / người lớn, học sinh không thể truy cập phòng học.")

    result = await course_service.get_course_learning_room(db, current_user.id, course_id)
    return CourseLearningResponse(success=True, data=result)

@router.get("/{course_id}/lessons/{lesson_id}", status_code=status.HTTP_200_OK)
async def get_lesson_detail(course_id: UUID, lesson_id: UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    role_result = await db.execute(select(Role).where(Role.id == current_user.role_id))
    user_role = role_result.scalars().first()
    is_admin = user_role and user_role.role_code == "ADMIN"
    is_instructor = user_role and user_role.role_code == "INSTRUCTOR"
    
    course = await course_repository.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Khóa học không tồn tại.")
        
    is_owner = is_admin or (is_instructor and course.instructor_id == current_user.id)
    
    if not is_owner:
        enrollment = await course_repository.get_enrollment(db, current_user.id, course_id)
        if not enrollment:
            raise HTTPException(status_code=400, detail="Học viên chưa đăng ký tham gia khóa học này.")
        
    lesson = await course_repository.get_lesson_by_id(db, lesson_id)
    if not lesson or lesson.course_id != course_id:
        raise HTTPException(status_code=404, detail="Không tìm thấy bài học.")
        
    return {
        "success": True,
        "data": {
            "lesson_id": lesson.id,
            "title": lesson.title,
            "content_type": lesson.content_type,
            "video_url": lesson.video_url,
            "content_body": lesson.content_body,
            "duration_minutes": lesson.duration_minutes,
            "order_index": lesson.order_index
        }
    }

@router.get("/{course_id}/outro", response_model=CourseOutroResponse, status_code=status.HTTP_200_OK)
async def get_course_outro(course_id: UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await course_service.get_course_outro(db, current_user.id, course_id)
    return CourseOutroResponse(success=True, data=result)

# Management Flow (Instructor / Admin)
@router.post("", response_model=CourseCreateResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(RoleGuard(["INSTRUCTOR", "ADMIN"]))])
async def create_course(course_data: CourseCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await course_service.create_new_course(db, current_user.id, course_data)
    return CourseCreateResponse(
        success=True,
        message="Tạo khóa học thành công",
        data=result
    )

@router.put("/{course_id}", response_model=CourseCreateResponse, status_code=status.HTTP_200_OK)
async def update_course(course_id: UUID, course_data: CourseCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    is_admin = False
    from sqlalchemy import select
    role_result = await db.execute(select(Role).where(Role.id == current_user.role_id))
    user_role = role_result.scalars().first()
    if user_role and user_role.role_code == "ADMIN":
        is_admin = True
    elif not user_role or user_role.role_code != "INSTRUCTOR":
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    result = await course_service.update_existing_course(db, current_user.id, course_id, course_data, is_admin)
    return CourseCreateResponse(
        success=True,
        message="Cập nhật khóa học thành công",
        data=result
    )

@router.delete("/{course_id}", response_model=StandardResponse, status_code=status.HTTP_200_OK)
async def delete_course(course_id: UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    is_admin = False
    from sqlalchemy import select
    role_result = await db.execute(select(Role).where(Role.id == current_user.role_id))
    user_role = role_result.scalars().first()
    if user_role and user_role.role_code == "ADMIN":
        is_admin = True
    elif not user_role or user_role.role_code != "INSTRUCTOR":
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    await course_service.delete_existing_course(db, current_user.id, course_id, is_admin)
    return StandardResponse(success=True, message="Xóa khóa học thành công")

@router.post("/{course_id}/lessons", response_model=StandardResponse, status_code=status.HTTP_201_CREATED)
async def add_lesson(course_id: UUID, lesson_data: LessonCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    is_admin = False
    from sqlalchemy import select
    role_result = await db.execute(select(Role).where(Role.id == current_user.role_id))
    user_role = role_result.scalars().first()
    if user_role and user_role.role_code == "ADMIN":
        is_admin = True
    elif not user_role or user_role.role_code != "INSTRUCTOR":
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    result = await course_service.add_lesson_to_course(db, current_user.id, course_id, lesson_data, is_admin)
    return StandardResponse(success=True, message="Thêm bài học mới thành công", data=result)

@router.put("/{course_id}/lessons/reorder", response_model=StandardResponse, status_code=status.HTTP_200_OK)
async def reorder_lessons(course_id: UUID, reorder_data: LessonReorder, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    is_admin = False
    from sqlalchemy import select
    role_result = await db.execute(select(Role).where(Role.id == current_user.role_id))
    user_role = role_result.scalars().first()
    if user_role and user_role.role_code == "ADMIN":
        is_admin = True
    elif not user_role or user_role.role_code != "INSTRUCTOR":
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    await course_service.reorder_lessons_in_course(db, current_user.id, course_id, reorder_data.lesson_ids, is_admin)
    return StandardResponse(success=True, message="Sắp xếp thứ tự bài học thành công")

@router.put("/{course_id}/lessons/{lesson_id}", response_model=StandardResponse, status_code=status.HTTP_200_OK)
async def update_lesson(course_id: UUID, lesson_id: UUID, lesson_data: LessonCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    is_admin = False
    from sqlalchemy import select
    role_result = await db.execute(select(Role).where(Role.id == current_user.role_id))
    user_role = role_result.scalars().first()
    if user_role and user_role.role_code == "ADMIN":
        is_admin = True
    elif not user_role or user_role.role_code != "INSTRUCTOR":
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    result = await course_service.update_lesson_in_course(db, current_user.id, course_id, lesson_id, lesson_data, is_admin)
    return StandardResponse(success=True, message="Cập nhật bài học thành công", data=result)

@router.delete("/{course_id}/lessons/{lesson_id}", response_model=StandardResponse, status_code=status.HTTP_200_OK)
async def delete_lesson(course_id: UUID, lesson_id: UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    is_admin = False
    from sqlalchemy import select
    role_result = await db.execute(select(Role).where(Role.id == current_user.role_id))
    user_role = role_result.scalars().first()
    if user_role and user_role.role_code == "ADMIN":
        is_admin = True
    elif not user_role or user_role.role_code != "INSTRUCTOR":
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    await course_service.delete_lesson_from_course(db, current_user.id, course_id, lesson_id, is_admin)
    return StandardResponse(success=True, message="Xóa bài học thành công")

@router.put("/{course_id}/publish", response_model=StandardResponse, status_code=status.HTTP_200_OK)
async def publish_course(course_id: UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    role_result = await db.execute(select(Role).where(Role.id == current_user.role_id))
    user_role = role_result.scalars().first()
    is_admin = user_role and user_role.role_code == "ADMIN"
    is_instructor = user_role and user_role.role_code == "INSTRUCTOR"
    if not is_admin and not is_instructor:
        raise HTTPException(status_code=403, detail="Không đủ quyền thực hiện thao tác này.")
        
    course = await course_repository.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Khóa học không tồn tại.")
        
    if not is_admin and course.instructor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bạn không sở hữu khóa học này.")
        
    course.is_published = not course.is_published
    await course_repository.update_course(db, course)
    
    status_text = "Xuất bản" if course.is_published else "Hạ xuống bản nháp"
    return StandardResponse(
        success=True,
        message=f"{status_text} khóa học thành công."
    )
