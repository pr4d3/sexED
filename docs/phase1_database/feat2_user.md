# FEATURE DOC 02: USER PROFILE & PROGRESS TRACKING (HỒ SƠ CÁ NHÂN & TIẾN ĐỘ HỌC)

---

## 1. MỤC TIÊU VÀ PHẠM VI

- **Hồ sơ cá nhân (User Profile):** Cung cấp nơi hiển thị và cập nhật thông tin bổ sung của tài khoản (ảnh đại diện, ngày sinh, giới tính, tiểu sử...).
- **Theo dõi tiến độ học tập (Progress Tracking):** Lưu vết hành trình học tập của học viên (Phụ huynh & Trẻ nhỏ) bao gồm: danh sách khóa học đang tham gia, danh sách bài học đã hoàn thành, tỷ lệ % hoàn thành và trạng thái khóa học.

---

## 2. QUY TẮC NGHIỆP VỤ (BUSINESS LOGIC)

### 2.1. Quản lý Hồ sơ cá nhân (Profile)

- Mỗi tài khoản người dùng (`users`) sẽ có duy nhất 1 bản ghi hồ sơ tương ứng (`user_profiles`).
- Cho phép người dùng chỉnh sửa: Tên hiển thị, Ảnh đại diện (URL), Ngày sinh/Độ tuổi, Giới tính, Giới thiệu bản thân (Bio).

### 2.2. Ghi nhận và Theo dõi Tiến độ học tập

- **Đăng ký khóa học (Enrollment):** Khi học viên bắt đầu học một khóa học, hệ thống tạo bản ghi tham gia khóa học (`course_enrollments`).
- **Ghi nhận bài học hoàn thành:** Mỗi khi học viên học xong 1 bài học (Lesson), hệ thống lưu trạng thái hoàn thành vào `lesson_progress`.
- **Tính toán tiến độ (% Progress):**
  $$\text{Tiến độ (\%)} = \left( \frac{\text{Số bài học đã hoàn thành trong khóa}}{\text{Tổng số bài học của khóa}} \right) \times 100$$
- **Trạng thái khóa học của học viên:**
  - `IN_PROGRESS` (Đang học): Khi tiến độ > 0% và < 100%.
  - `COMPLETED` (Đã hoàn thành): Khi tiến độ đạt 100% (đủ điều kiện chuyển sang trang Outro để tổng kết).

---

## 3. THIẾT KẾ DATABASE SCHEMA (PHASE 1)

### 3.1. Bảng `user_profiles` (Thông tin chi tiết người dùng)

_Mở rộng thông tin cá nhân tách biệt với bảng xác thực `users` để tối ưu bảo mật và hiệu năng._

| Tên trường (Field) | Kiểu dữ liệu (Data Type) | Ràng buộc (Constraints)                                      | Ý nghĩa / Ghi chú                         |
| :----------------- | :----------------------- | :----------------------------------------------------------- | :---------------------------------------- |
| `id`               | BigInteger / UUID        | Primary Key                                                  | Khóa chính hồ sơ                          |
| `user_id`          | BigInteger / UUID        | Foreign Key -> `users(id)`, Unique, Not Null, Cascade Delete | Khóa ngoại 1 - 1 với bảng `users`         |
| `avatar_url`       | String (Varchar 500)     | Nullable                                                     | Đường dẫn ảnh đại diện                    |
| `gender`           | String (Varchar 20)      | Nullable                                                     | Giới tính (VD: `MALE`, `FEMALE`, `OTHER`) |
| `date_of_birth`    | Date                     | Nullable                                                     | Ngày sinh (để xác định độ tuổi phù hợp)   |
| `phone_number`     | String (Varchar 20)      | Nullable                                                     | Số điện thoại liên hệ                     |
| `bio`              | Text                     | Nullable                                                     | Giới thiệu ngắn về bản thân               |
| `updated_at`       | Timestamp                | Not Null, Default: Current Time                              | Thời gian cập nhật thông tin              |

---

### 3.2. Bảng `course_enrollments` (Đăng ký & Tiến độ khóa học)

_Ghi nhận các khóa học mà học viên đã tham gia và trạng thái tổng quan._

| Tên trường (Field)    | Kiểu dữ liệu (Data Type) | Ràng buộc (Constraints)                                | Ý nghĩa / Ghi chú                            |
| :-------------------- | :----------------------- | :----------------------------------------------------- | :------------------------------------------- |
| `id`                  | BigInteger / UUID        | Primary Key                                            | Khóa chính bản ghi tham gia                  |
| `user_id`             | BigInteger / UUID        | Foreign Key -> `users(id)`, Not Null, Cascade Delete   | Học viên tham gia khóa học                   |
| `course_id`           | BigInteger / UUID        | Foreign Key -> `courses(id)`, Not Null, Cascade Delete | Khóa học được tham gia                       |
| `enrolled_at`         | Timestamp                | Not Null, Default: Current Time                        | Ngày bắt đầu tham gia khóa học               |
| `completed_at`        | Timestamp                | Nullable                                               | Thời điểm hoàn thành khóa học (100%)         |
| `status`              | String (Varchar 20)      | Not Null, Default: `IN_PROGRESS`                       | Trạng thái: `IN_PROGRESS`, `COMPLETED`       |
| **Unique Constraint** | Composite Unique         | `UNIQUE(user_id, course_id)`                           | Mỗi học viên chỉ có 1 bản ghi cho 1 khóa học |

---

### 3.3. Bảng `lesson_progress` (Chi tiết tiến độ từng bài học)

_Lưu vết trạng thái từng bài học cụ thể mà học viên đã hoàn thành._

| Tên trường (Field)    | Kiểu dữ liệu (Data Type) | Ràng buộc (Constraints)                                | Ý nghĩa / Ghi chú                         |
| :-------------------- | :----------------------- | :----------------------------------------------------- | :---------------------------------------- |
| `id`                  | BigInteger / UUID        | Primary Key                                            | Khóa chính                                |
| `user_id`             | BigInteger / UUID        | Foreign Key -> `users(id)`, Not Null, Cascade Delete   | Học viên                                  |
| `lesson_id`           | BigInteger / UUID        | Foreign Key -> `lessons(id)`, Not Null, Cascade Delete | Bài học thuộc khóa học                    |
| `is_completed`        | Boolean                  | Not Null, Default: `true`                              | Đánh dấu đã hoàn thành bài học            |
| `completed_at`        | Timestamp                | Not Null, Default: Current Time                        | Thời điểm đánh dấu hoàn thành             |
| **Unique Constraint** | Composite Unique         | `UNIQUE(user_id, lesson_id)`                           | Tránh ghi trùng lặp một bài học nhiều lần |

---

## 4. QUAN HỆ VÀ RÀNG BUỘC (RELATIONSHIPS)

1. **`users` - `user_profiles` (1 - 1):** Mỗi người dùng có đúng 1 hồ sơ cá nhân.
2. **`users` - `course_enrollments` (1 - N):** Một học viên có thể đăng ký nhiều khóa học.
3. **`users` - `lesson_progress` (1 - N):** Một học viên có nhiều lượt hoàn thành bài học khác nhau.
