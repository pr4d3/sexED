# FEATURE 03: INSTRUCTOR DASHBOARD (BACKEND SPECS)

---

## 1. MÔ TẢ TỔNG QUAN

- Cung cấp toàn bộ hệ thống API phục vụ Bảng điều khiển dành riêng cho Giảng viên (`INSTRUCTOR`) và Quản trị viên (`ADMIN`).
- Giúp giảng viên/nhà nghiên cứu:
  - Xem các chỉ số tổng quan (KPIs/Metrics): Tổng số khóa học đang phụ trách, tổng số học viên đăng ký, tỷ lệ hoàn thành trung bình.
  - Quản lý danh sách các khóa học do chính mình tạo.
  - Xem danh sách chi tiết học viên trong từng khóa học, theo dõi % tiến độ và thời gian hoàn thành phục vụ công tác đánh giá và nghiên cứu khoa học.

---

## 2. PHÂN TẦNG KIẾN TRÚC (LAYERED ARCHITECTURE DESIGN)

```
[HTTP Request from Client (Giảng viên / Admin)]
            ⬇
[1. Controller / Router Layer (dashboard_router.py)]
    - Tiếp nhận Request từ Client, trích xuất `current_user_id` và `role_code` từ JWT.
    - Áp dụng RBAC Guard: Bắt buộc Role thuộc danh sách `["INSTRUCTOR", "ADMIN"]`.
    - Validate query params (phân trang, lọc theo khóa học).
    - Gọi xuống Service Layer và trả về HTTP Response chuẩn.
            ⬇
[2. Service Layer (dashboard_service.py)]
    - `get_instructor_overview_stats(instructor_id, is_admin)`:
        + Tính toán tổng số khóa học do giảng viên phụ trách.
        + Đếm tổng lượt học viên đã đăng ký (`course_enrollments`).
        + Tính tỷ lệ hoàn thành trung bình (%) trên toàn bộ các khóa học.
    - `get_instructor_courses(instructor_id, is_admin)`:
        + Lấy danh sách khóa học kèm số lượng học viên đang học và đã hoàn thành của từng khóa.
    - `get_course_students_progress(instructor_id, course_id, is_admin)`:
        + Kiểm tra quyền sở hữu khóa học (Giảng viên chỉ xem được học viên của khóa mình tạo, Admin xem được tất cả).
        + Lấy danh sách học viên kèm % tiến độ, ngày bắt đầu và ngày hoàn thành.
            ⬇
[3. Repository Layer (dashboard_repository.py)]
    - Thực hiện các câu truy vấn phức hợp (JOIN, COUNT, AVG, GROUP BY) thông qua ORM.
    - Tương tác với các bảng: `courses`, `course_enrollments`, `lesson_progress`, `users`, `user_profiles`.
            ⬇
[Database: Supabase PostgreSQL]
```

---

## 3. QUY TẮC PHÂN QUYỀN & NGHIỆP VỤ (RBAC & BUSINESS RULES)

1. **Giới hạn phạm vi dữ liệu theo Role:**
   - **`INSTRUCTOR`:** Hệ thống tự động gắn điều kiện lọc `instructor_id = current_user_id` vào mọi câu truy vấn. Giảng viên tuyệt đối không xem được dữ liệu khóa học của giảng viên khác.
   - **`ADMIN`:** Có thể xem toàn bộ số liệu của tất cả giảng viên hoặc truyền `instructor_id` trên Query Params để xem dữ liệu của một giảng viên cụ thể.
2. **Công thức tính tỷ lệ hoàn thành trung bình của Giảng viên:**
   $$\text{Tỷ lệ hoàn thành TB (\%)} = \left( \frac{\text{Tổng số lượt enrollments đạt status = 'COMPLETED'}}{\text{Tổng số lượt enrollments}} \right) \times 100$$

---

## 4. DANH SÁCH API ENDPOINTS

| STT | Method | Endpoint                                                    | Quyền truy cập        | Mục đích                                                  |
| :-: | :----- | :---------------------------------------------------------- | :-------------------- | :-------------------------------------------------------- |
|  1  | `GET`  | `/api/v1/instructor/dashboard/overview`                     | `INSTRUCTOR`, `ADMIN` | Lấy các chỉ số thống kê tổng quan (Metrics)               |
|  2  | `GET`  | `/api/v1/instructor/dashboard/courses`                      | `INSTRUCTOR`, `ADMIN` | Lấy danh sách các khóa học do giảng viên phụ trách        |
|  3  | `GET`  | `/api/v1/instructor/dashboard/courses/{course_id}/students` | `INSTRUCTOR`, `ADMIN` | Lấy danh sách chi tiết học viên và tiến độ của 1 khóa học |

---

## 5. ĐẶC TẢ CHI TIẾT REQUEST & RESPONSE

### 5.1. Lấy chỉ số thống kê tổng quan (`GET /api/v1/instructor/dashboard/overview`)

- **Header:** `Authorization: Bearer <access_token>`
- **Tầng xử lý:** `dashboard_router.py` $\rightarrow$ `dashboard_service.get_instructor_overview_stats()` $\rightarrow$ `dashboard_repository.aggregate_instructor_metrics()`
- **Response Thành công (200 OK):**

```json
{
  "success": true,
  "data": {
    "total_courses": 5,
    "total_students_enrolled": 142,
    "total_completed_students": 68,
    "average_completion_rate": 47.88,
    "total_lessons_published": 38
  }
}
```

---

### 5.2. Lấy danh sách khóa học của Giảng viên (`GET /api/v1/instructor/dashboard/courses`)

- **Header:** `Authorization: Bearer <access_token>`
- **Tầng xử lý:** `dashboard_router.py` $\rightarrow$ `dashboard_service.get_instructor_courses()` $\rightarrow$ `dashboard_repository.get_courses_with_enrollment_counts()`
- **Response Thành công (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "course_id": "crs_uuid_101",
      "title": "Giáo dục giới tính tuổi dậy thì toàn diện",
      "target_audience": "CHILD",
      "is_published": true,
      "total_lessons": 10,
      "total_enrolled": 85,
      "completed_count": 45,
      "in_progress_count": 40,
      "created_at": "2025-01-05T10:00:00Z"
    },
    {
      "course_id": "crs_uuid_102",
      "title": "Đồng hành cùng con vượt qua khủng hoảng tuổi mới lớn",
      "target_audience": "PARENT",
      "is_published": true,
      "total_lessons": 8,
      "total_enrolled": 57,
      "completed_count": 23,
      "in_progress_count": 34,
      "created_at": "2025-01-12T14:30:00Z"
    }
  ]
}
```

---

### 5.3. Xem danh sách chi tiết học viên trong 1 khóa học (`GET /api/v1/instructor/dashboard/courses/{course_id}/students`)

- **Header:** `Authorization: Bearer <access_token>`
- **Query Params (Tùy chọn):** `?status=IN_PROGRESS` (hoặc `COMPLETED`)
- **Tầng xử lý:** `dashboard_router.py` $\rightarrow$ `dashboard_service.get_course_students_progress()` $\rightarrow$ `dashboard_repository.get_students_by_course_id()`
- **Response Thành công (200 OK):**

```json
{
  "success": true,
  "data": {
    "course_id": "crs_uuid_101",
    "course_title": "Giáo dục giới tính tuổi dậy thì toàn diện",
    "total_students": 2,
    "students": [
      {
        "student_id": "usr_uuid_001",
        "full_name": "Nguyễn Văn An",
        "email": "an.nguyen@example.com",
        "role": "STUDENT_PARENT",
        "enrolled_at": "2025-01-10T08:30:00Z",
        "completed_at": "2025-01-15T16:20:00Z",
        "status": "COMPLETED",
        "progress_percentage": 100.0,
        "completed_lessons_count": 10
      },
      {
        "student_id": "usr_uuid_005",
        "full_name": "Trần Bé Bi",
        "email": "bebi@example.com",
        "role": "STUDENT_CHILD",
        "enrolled_at": "2025-01-14T09:00:00Z",
        "completed_at": null,
        "status": "IN_PROGRESS",
        "progress_percentage": 60.0,
        "completed_lessons_count": 6
      }
    ]
  }
}
```

- **Mã lỗi thường gặp:**
  - `403 Forbidden`: Giảng viên cố tình truy cập xem học viên của khóa học không do mình quản lý.
  - `404 Not Found`: Khóa học không tồn tại.
