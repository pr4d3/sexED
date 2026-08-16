# FEATURE DOC 03: INSTRUCTOR DASHBOARD (BẢNG ĐIỀU KHIỂN GIẢNG VIÊN)

---

## 1. MỤC TIÊU VÀ PHẠM VI

- Cung cấp không gian làm việc tập trung dành riêng cho tài khoản có vai trò `INSTRUCTOR` (và `ADMIN`).
- Cho phép Giảng viên:
  - Xem danh sách và trạng thái các khóa học do mình phụ trách/tạo ra.
  - Theo dõi danh sách học viên đã tham gia từng khóa học.
  - Xem thống kê tiến độ học tập, tỷ lệ hoàn thành khóa học của học viên phục vụ cho việc nghiên cứu và đánh giá hiệu quả giáo dục giới tính.

---

## 2. QUY TẮC NGHIỆP VỤ (BUSINESS LOGIC)

### 2.1. Quyền xem dữ liệu

- **Giảng viên (`INSTRUCTOR`):** Chỉ xem được dữ liệu thống kê, danh sách khóa học và danh sách học viên thuộc các khóa học **do chính mình tạo/phụ trách**.
- **Quản trị viên (`ADMIN`):** Có quyền xem Dashboard của tất cả các Giảng viên và toàn bộ khóa học trong hệ thống.

### 2.2. Các chỉ số thống kê trên Dashboard (KPIs / Metrics)

1. **Tổng quan (Overview Metrics):**
   - Tổng số khóa học đang phụ trách.
   - Tổng số lượt học viên đăng ký (Total Enrollments).
   - Tỷ lệ hoàn thành khóa học trung bình (% Completion Rate).
2. **Chi tiết theo từng khóa học (Course-level Analytics):**
   - Danh sách học viên đang học (`IN_PROGRESS`).
   - Danh sách học viên đã hoàn thành (`COMPLETED`).
   - Thời gian học viên bắt đầu và hoàn thành khóa học.

---

## 3. THIẾT KẾ DATABASE SCHEMA (PHASE 1)

_Lưu ý: Phân hệ Dashboard chủ yếu thực hiện các truy vấn dữ liệu (Queries & Aggregations) từ các bảng `courses`, `course_enrollments`, `lesson_progress`, và `users`. Tuy nhiên, để hỗ trợ tốt nhất cho Dashboard, chúng ta cần đảm bảo liên kết dữ liệu sau:_

### 3.1. Mối quan hệ liên kết với Bảng `courses` (Được chi tiết hóa ở Doc 04)

Trong bảng `courses`, cần có trường định danh người tạo:

- Trường `instructor_id` (Foreign Key -> `users(id)`): Xác định Giảng viên phụ trách khóa học này.

### 3.2. Cấu trúc bảng phục vụ Báo cáo/Thống kê (Nếu cần mở rộng)

Nếu hệ thống chỉ cần tính toán động (On-the-fly aggregation) từ `course_enrollments`, không cần tạo thêm bảng phụ để tránh dư thừa dữ liệu.

Tuy nhiên, nếu bạn muốn lưu vết **Ghi chú/Nhận xét của Giảng viên về Học viên** phục vụ bài báo nghiên cứu khoa học, ta có thể bổ sung bảng `instructor_student_notes`:

| Tên trường (Field) | Kiểu dữ liệu (Data Type) | Ràng buộc (Constraints)                | Ý nghĩa / Ghi chú                     |
| :----------------- | :----------------------- | :------------------------------------- | :------------------------------------ |
| `id`               | BigInteger / UUID        | Primary Key                            | Khóa chính                            |
| `instructor_id`    | BigInteger / UUID        | Foreign Key -> `users(id)`, Not Null   | Giảng viên ghi nhận xét               |
| `student_id`       | BigInteger / UUID        | Foreign Key -> `users(id)`, Not Null   | Học viên được nhận xét                |
| `course_id`        | BigInteger / UUID        | Foreign Key -> `courses(id)`, Not Null | Khóa học liên quan                    |
| `note_content`     | Text                     | Not Null                               | Nội dung đánh giá/quan sát nghiên cứu |
| `created_at`       | Timestamp                | Not Null, Default: Current Time        | Thời gian tạo ghi chú                 |

---

## 4. TÓM TẮT CÁC LUỒNG TRUY VẤN CHÍNH CỦA DASHBOARD (QUERY MAPPING)

1. **Lấy danh sách khóa học của Giảng viên:**
   - Lọc bảng `courses` theo `instructor_id = current_user_id`.
2. **Lấy danh sách học viên của 1 khóa học:**
   - Kết hợp (Join) bảng `course_enrollments`, `users`, `user_profiles` theo `course_id`.
3. **Tính tỷ lệ % tiến độ của 1 học viên cụ thể:**
   - Đếm số bản ghi trong `lesson_progress` của học viên đó chia cho tổng số bài học trong khóa học.
