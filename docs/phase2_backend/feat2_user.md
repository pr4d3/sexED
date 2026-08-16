# FEATURE 02: USER PROFILE & PROGRESS TRACKING (BACKEND SPECS)

---

## 1. MÔ TẢ TỔNG QUAN

- Cung cấp API quản lý thông tin hồ sơ cá nhân (User Profile) cho mọi người dùng trong hệ thống.
- Quản lý và theo dõi tiến độ học tập (Progress Tracking) của Học viên (`STUDENT_PARENT` và `STUDENT_CHILD`):
  - Lấy danh sách các khóa học đã đăng ký kèm % tiến độ.
  - Ghi nhận trạng thái hoàn thành từng bài học cụ thể.
  - Tự động tính toán tiến độ và cập nhật trạng thái khóa học sang `COMPLETED` khi học viên hoàn thành 100% số bài học.

---

## 2. PHÂN TẦNG KIẾN TRÚC (LAYERED ARCHITECTURE DESIGN)

```
[HTTP Request from Client]
            ⬇
[1. Controller / Router Layer (user_router.py)]
    - Tiếp nhận Request xem/sửa Profile, xem tiến độ, đánh dấu bài học.
    - Trích xuất `current_user_id` từ JWT qua Auth Middleware.
    - Validate dữ liệu đầu vào bằng Pydantic Schemas.
    - Chuyển tiếp tới Service Layer và trả về HTTP Response.
            ⬇
[2. Service Layer (user_service.py & progress_service.py)]
    - `get_profile(user_id)`: Tổng hợp thông tin từ bảng `users` và `user_profiles`.
    - `update_profile(user_id, data)`: Xử lý logic cập nhật dữ liệu hồ sơ cá nhân.
    - `get_user_progress_list(user_id)`: Tính toán % tiến độ cho từng khóa học mà học viên đã đăng ký.
    - `mark_lesson_as_completed(user_id, course_id, lesson_id)`:
        + Lưu vết bài học hoàn thành vào `lesson_progress`.
        + Tính toán tỷ lệ: (Số bài học đã xong / Tổng bài học của khóa) * 100.
        + Nếu đạt 100%, cập nhật `course_enrollments.status = 'COMPLETED'` và gán `completed_at`.
            ⬇
[3. Repository Layer (user_repository.py & progress_repository.py)]
    - Thực hiện các thao tác CRUD dữ liệu với Database qua SQLAlchemy ORM.
    - Thao tác trên các bảng: `users`, `user_profiles`, `course_enrollments`, `lesson_progress`, `lessons`.
            ⬇
[Database: Supabase PostgreSQL]
```

---

## 3. QUY TRÌNH NGHIỆP VỤ & TÍNH TOÁN TIẾN ĐỘ (BUSINESS LOGIC)

1. **Khởi tạo Profile tự động:** Khi người dùng vừa đăng ký ở Feature 01, hệ thống tự động tạo 1 bản ghi rỗng trong bảng `user_profiles` liên kết với `user_id`.
2. **Công thức tính tiến độ học tập (%):**
   $$\text{Progress (\%)} = \left( \frac{\text{Count}(\text{lesson\_progress với is\_completed = true})}{\text{Count}(\text{lessons thuộc course\_id})} \right) \times 100$$
3. **Cờ báo hoàn thành (Course Just Completed Flag):** Khi bài học cuối cùng được đánh dấu hoàn tất đưa tiến độ lên 100%, API sẽ trả về `is_course_just_completed: true` để Frontend kích hoạt hiệu ứng chuyển hướng sang trang **Course Outro**.

---

## 4. DANH SÁCH API ENDPOINTS

| STT | Phương thức | Endpoint                                                         | Quyền truy cập                | Mục đích                                           |
| :-: | :---------- | :--------------------------------------------------------------- | :---------------------------- | :------------------------------------------------- |
|  1  | `GET`       | `/api/v1/users/profile`                                          | Đã đăng nhập                  | Lấy thông tin hồ sơ cá nhân của tài khoản hiện tại |
|  2  | `PUT`       | `/api/v1/users/profile`                                          | Đã đăng nhập                  | Cập nhật thông tin hồ sơ cá nhân                   |
|  3  | `GET`       | `/api/v1/users/my-courses`                                       | Học viên (`PARENT` / `CHILD`) | Lấy danh sách khóa học và tiến độ học tập cá nhân  |
|  4  | `POST`      | `/api/v1/users/courses/{course_id}/lessons/{lesson_id}/complete` | Học viên (`PARENT` / `CHILD`) | Đánh dấu hoàn thành bài học & cập nhật tiến độ     |

---

## 5. ĐẶC TẢ CHI TIẾT REQUEST & RESPONSE

### 5.1. Xem Hồ sơ cá nhân (`GET /api/v1/users/profile`)

- **Header:** `Authorization: Bearer <access_token>`
- **Tầng xử lý:** `user_router.py` $\rightarrow$ `user_service.get_profile()` $\rightarrow$ `user_repository.get_user_with_profile()`
- **Response Thành công (200 OK):**

```json
{
  "success": true,
  "data": {
    "user_id": "usr_uuid_001",
    "username": "phuhuynh_an",
    "email": "an.nguyen@example.com",
    "full_name": "Nguyễn Văn An",
    "role": "STUDENT_PARENT",
    "avatar_url": "https://supabase-storage-url/avatar.png",
    "gender": "MALE",
    "date_of_birth": "1988-05-20",
    "phone_number": "0901234567",
    "bio": "Phụ huynh muốn đồng hành cùng con trong độ tuổi dậy thì."
  }
}
```

---

### 5.2. Cập nhật Hồ sơ cá nhân (`PUT /api/v1/users/profile`)

- **Header:** `Authorization: Bearer <access_token>`
- **Tầng xử lý:** `user_router.py` $\rightarrow$ `user_service.update_profile()` $\rightarrow$ `user_repository.update_profile_data()`
- **Request Body (JSON):**

```json
{
  "full_name": "Nguyễn Văn An",
  "avatar_url": "https://supabase-storage-url/new_avatar.png",
  "gender": "MALE",
  "date_of_birth": "1988-05-20",
  "phone_number": "0912345678",
  "bio": "Đã cập nhật tiểu sử mới."
}
```

- **Response Thành công (200 OK):**

```json
{
  "success": true,
  "message": "Cập nhật hồ sơ thành công",
  "data": {
    "user_id": "usr_uuid_001",
    "full_name": "Nguyễn Văn An",
    "avatar_url": "https://supabase-storage-url/new_avatar.png"
  }
}
```

---

### 5.3. Xem danh sách khóa học & Tiến độ của tôi (`GET /api/v1/users/my-courses`)

- **Header:** `Authorization: Bearer <access_token>` (Role: `STUDENT_PARENT` hoặc `STUDENT_CHILD`)
- **Tầng xử lý:** `user_router.py` $\rightarrow$ `progress_service.get_user_progress_list()` $\rightarrow$ `progress_repository.get_enrolled_courses_with_stats()`
- **Response Thành công (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "course_id": "crs_uuid_101",
      "course_title": "Giáo dục giới tính tuổi dậy thì toàn diện",
      "thumbnail_url": "https://img-url/thumb1.png",
      "status": "IN_PROGRESS",
      "total_lessons": 10,
      "completed_lessons": 4,
      "progress_percentage": 40.0,
      "enrolled_at": "2025-01-10T08:30:00Z",
      "completed_at": null
    }
  ]
}
```

---

### 5.4. Đánh dấu hoàn thành bài học (`POST /api/v1/users/courses/{course_id}/lessons/{lesson_id}/complete`)

- **Header:** `Authorization: Bearer <access_token>`
- **Tầng xử lý:** `user_router.py` $\rightarrow$ `progress_service.mark_lesson_as_completed()` $\rightarrow$ `progress_repository.upsert_lesson_progress()`, `progress_repository.update_enrollment_status()`
- **Response Thành công (200 OK):**

```json
{
  "success": true,
  "message": "Ghi nhận tiến độ bài học thành công",
  "data": {
    "course_id": "crs_uuid_101",
    "lesson_id": "lsn_uuid_202",
    "progress_percentage": 100.0,
    "course_status": "COMPLETED",
    "is_course_just_completed": true
  }
}
```

- **Mã lỗi thường gặp:**
  - `404 Not Found`: Không tìm thấy bài học hoặc khóa học tương ứng.
  - `400 Bad Request`: Học viên chưa đăng ký tham gia khóa học này.
