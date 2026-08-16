# FEATURE DOC 04: COURSE & CONTENT MANAGEMENT (KHÓA HỌC & BÀI GIẢNG)

---

## 1. MỤC TIÊU VÀ PHẠM VI

- Quản lý cấu trúc nội dung giáo dục giới tính từ tổng quan đến chi tiết: **Khóa học (Course)** $\rightarrow$ **Bài học (Lesson)**.
- Hỗ trợ luồng trải nghiệm học tập chuẩn 3 trang: **Intro $\rightarrow$ Learning $\rightarrow$ Outro**.
- Quản lý cơ chế gắn nhãn đối tượng mục tiêu (**Target Audience**): `Dành cho Phụ huynh`, `Dành cho Trẻ nhỏ`, hoặc `Cả hai`.

---

## 2. QUY TẮC NGHIỆP VỤ (BUSINESS LOGIC)

### 2.1. Phân loại đối tượng học tập (Target Audience Filtering)

Khi Giảng viên tạo/sửa khóa học, bắt buộc phải chọn 1 trong 3 nhãn đối tượng (`target_audience`):

1. `PARENT`: Khóa học chỉ hiển thị và cho phép tài khoản `STUDENT_PARENT` tham gia.
2. `CHILD`: Khóa học chỉ hiển thị và cho phép tài khoản `STUDENT_CHILD` tham gia.
3. `BOTH`: Khóa học mở cho cả hai đối tượng.

_(Lưu ý: `ADMIN` và `INSTRUCTOR` luôn có quyền truy cập toàn bộ khóa học để kiểm duyệt)._

### 2.2. Luồng trải nghiệm 3 trang của Khóa học

1. **Trang 1: Giới thiệu khóa học (Course Intro Page)**
   - Hiển thị thông tin tổng quan: Tên khóa, ảnh bìa, mô tả, giảng viên phụ trách, đối tượng hướng đến, đề cương danh sách các bài học.
   - Nút hành động: "Bắt đầu học" (Tạo bản ghi vào `course_enrollments` nếu chưa tham gia $\rightarrow$ Điều hướng sang trang Learning).
2. **Trang 2: Học tập chính (Course Learning Page)**
   - Không gian học tập: Hiển thị thanh danh mục bài học (Sidebar) và khu vực nội dung bài học đang chọn (Video / Tài liệu đọc / Hình ảnh minh họa).
   - Nút hành động: "Đánh dấu hoàn thành bài học" (Cập nhật `lesson_progress`).
   - Điều hướng: Tự động chuyển tiếp sang bài học tiếp theo.
3. **Trang 3: Tổng kết khóa học (Course Outro Page)**
   - Điều kiện mở: Chỉ xuất hiện khi học viên đã hoàn thành 100% tất cả các bài học trong khóa.
   - Nội dung hiển thị: Lời chúc mừng, thông điệp cốt lõi/tổng kết kiến thức của khóa học, khảo sát/dặn dò nghiên cứu khoa học.
   - Nút hành động: "Quay về trang cá nhân" hoặc "Khám phá khóa học khác".

---

## 3. THIẾT KẾ DATABASE SCHEMA (PHASE 1)

### 3.1. Bảng `courses` (Danh mục Khóa học)

_Lưu thông tin tổng quan của khóa học và nội dung trang Intro/Outro._

| Tên trường (Field)  | Kiểu dữ liệu (Data Type) | Ràng buộc (Constraints)              | Ý nghĩa / Ghi chú                                            |
| :------------------ | :----------------------- | :----------------------------------- | :----------------------------------------------------------- |
| `id`                | BigInteger / UUID        | Primary Key                          | Khóa chính khóa học                                          |
| `instructor_id`     | BigInteger / UUID        | Foreign Key -> `users(id)`, Not Null | Giảng viên tạo/phụ trách                                     |
| `title`             | String (Varchar 255)     | Not Null                             | Tên khóa học                                                 |
| `slug`              | String (Varchar 255)     | Unique, Not Null                     | Đường dẫn thân thiện (VD: `giao-duc-gioi-tinh-tuoi-day-thi`) |
| `short_description` | String (Varchar 500)     | Nullable                             | Mô tả ngắn gọn (hiển thị thẻ preview)                        |
| `description`       | Text                     | Nullable                             | Mô tả chi tiết (Nội dung trang Intro)                        |
| `thumbnail_url`     | String (Varchar 500)     | Nullable                             | Ảnh đại diện của khóa học                                    |
| `target_audience`   | String (Varchar 20)      | Not Null, Default: `BOTH`            | Phân loại: `PARENT`, `CHILD`, `BOTH`                         |
| `outro_content`     | Text                     | Nullable                             | Nội dung tổng kết hiển thị ở trang Outro                     |
| `is_published`      | Boolean                  | Not Null, Default: `false`           | Trạng thái xuất bản khóa học                                 |
| `created_at`        | Timestamp                | Not Null, Default: Current Time      | Thời gian tạo                                                |
| `updated_at`        | Timestamp                | Not Null, Default: Current Time      | Thời gian cập nhật gần nhất                                  |

---

### 3.2. Bảng `lessons` (Danh mục Bài học chi tiết)

_Lưu nội dung bài học cụ thể cho trang Learning._

| Tên trường (Field) | Kiểu dữ liệu (Data Type) | Ràng buộc (Constraints)                                | Ý nghĩa / Ghi chú                        |
| :----------------- | :----------------------- | :----------------------------------------------------- | :--------------------------------------- |
| `id`               | BigInteger / UUID        | Primary Key                                            | Khóa chính bài học                       |
| `course_id`        | BigInteger / UUID        | Foreign Key -> `courses(id)`, Not Null, Cascade Delete | Thuộc khóa học nào                       |
| `title`            | String (Varchar 255)     | Not Null                                               | Tên bài học                              |
| `content_type`     | String (Varchar 20)      | Not Null, Default: `HYBRID`                            | Định dạng: `VIDEO`, `TEXT`, `HYBRID`     |
| `video_url`        | String (Varchar 500)     | Nullable                                               | Link video bài giảng (nếu có)            |
| `content_body`     | Text / LongText          | Nullable                                               | Nội dung văn bản/hình ảnh giáo dục       |
| `order_index`      | Integer                  | Not Null, Default: 1                                   | Thứ tự sắp xếp của bài học trong khóa    |
| `duration_minutes` | Integer                  | Nullable                                               | Thời lượng ước tính để hoàn thành (phút) |
| `created_at`       | Timestamp                | Not Null, Default: Current Time                        | Thời gian tạo                            |
| `updated_at`       | Timestamp                | Not Null, Default: Current Time                        | Thời gian cập nhật                       |

---

## 4. QUAN HỆ VÀ RÀNG BUỘC (RELATIONSHIPS)

1. **`users` (Instructor) - `courses` (1 - N):** Một giảng viên có thể tạo nhiều khóa học.
2. **`courses` - `lessons` (1 - N):** Một khóa học bao gồm nhiều bài học. Khi xóa khóa học, toàn bộ bài học thuộc khóa đó sẽ bị xóa (`Cascade Delete`).
3. **`lessons` - `lesson_progress` (1 - N):** Một bài học sẽ có nhiều lượt đánh dấu hoàn thành từ các học viên khác nhau.
