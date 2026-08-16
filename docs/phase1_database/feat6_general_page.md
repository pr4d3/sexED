# FEATURE DOC 06: GENERAL PAGES (TRANG CHỦ & GIỚI THIỆU)

---

## 1. MỤC TIÊU VÀ PHẠM VI

- **Trang chủ (Home Page):** Cửa sổ đón tiếp người dùng, giới thiệu thông điệp giáo dục giới tính, điều hướng nhanh tới các khóa học theo từng nhóm đối tượng (`Phụ huynh` hoặc `Trẻ nhỏ`).
- **Trang Giới thiệu (About Us):** Trình bày mục đích khoa học của bài nghiên cứu, sứ mệnh xóa bỏ rào cản ngại ngùng trong giáo dục giới tính tại Việt Nam, thông tin đội ngũ nghiên cứu và giảng viên/chuyên gia.

---

## 2. QUY TẮC NGHIỆP VỤ (BUSINESS LOGIC)

### 2.1. Trang Chủ (Home Page Flow)

- **Khu vực Hero Banner:** Khẩu hiệu chính (Slogan) và nút Kêu gọi hành động (Call To Action - CTA: "Bắt đầu học ngay" / "Đăng ký").
- **Khu vực Khóa học nổi bật theo Đối tượng (Target Audience Sections):**
  - Tab 1: _Khóa học dành cho Phụ huynh_ (Lọc từ `courses` có `target_audience IN ('PARENT', 'BOTH')` và `is_published = true`).
  - Tab 2: _Khóa học dành cho Trẻ nhỏ_ (Lọc từ `courses` có `target_audience IN ('CHILD', 'BOTH')` và `is_published = true`).
- **Khu vực Diễn đàn sôi nổi:** Hiển thị 3–5 bài viết mới nhất từ Diễn đàn (`forum_posts`).

### 2.2. Trang Giới thiệu (About Us Flow)

- Trình bày thông tin bài nghiên cứu khoa học: Đề tài, mục tiêu nghiên cứu, phương pháp tiếp cận.
- Danh sách đội ngũ phát triển / Giảng viên / Chuyên gia cố vấn nội dung.
- Thông tin liên hệ / Đóng góp ý kiến cho đề tài nghiên cứu.

---

## 3. THIẾT KẾ DATABASE SCHEMA (PHASE 1)

_Hầu hết nội dung Trang Chủ được tổng hợp động từ bảng `courses`, `users`, `forum_posts`. Để quản lý các nội dung tĩnh (như bài giới thiệu nghiên cứu, thông tin liên hệ, banner) mà không cần can thiệp vào mã nguồn sau này, ta thiết kế thêm bảng `site_settings`:_

### 3.1. Bảng `site_settings` (Cấu hình & Nội dung trang tĩnh)

_Lưu các đoạn nội dung tùy biến của hệ thống dạng Key-Value._

| Tên trường (Field) | Kiểu dữ liệu (Data Type) | Ràng buộc (Constraints)         | Ý nghĩa / Ghi chú                                                                    |
| :----------------- | :----------------------- | :------------------------------ | :----------------------------------------------------------------------------------- |
| `id`               | Integer                  | Primary Key, Auto Increment     | Khóa chính                                                                           |
| `key_name`         | String (Varchar 100)     | Unique, Not Null                | Khóa định danh (VD: `about_us_research_purpose`, `home_hero_title`, `contact_email`) |
| `value_content`    | Text / LongText          | Not Null                        | Nội dung chi tiết (văn bản/HTML)                                                     |
| `description`      | String (Varchar 255)     | Nullable                        | Ghi chú vị trí hiển thị để Admin dễ quản lý                                          |
| `updated_at`       | Timestamp                | Not Null, Default: Current Time | Thời gian cập nhật gần nhất                                                          |

---

## 4. TỔNG KẾT TOÀN BỘ DATABASE SCHEMA (PHASE 1)

Chúng ta đã hoàn thành đặc tả Schema cho toàn bộ 6 phân hệ gồm **9 bảng dữ liệu cốt lõi**:

1. `roles` (Vai trò người dùng)
2. `users` (Tài khoản người dùng)
3. `user_sessions` (Phiên làm việc & Token)
4. `user_profiles` (Hồ sơ cá nhân)
5. `courses` (Khóa học & Nội dung Intro/Outro)
6. `lessons` (Bài học chi tiết)
7. `course_enrollments` (Học viên tham gia khóa học)
8. `lesson_progress` (Tiến độ hoàn thành bài học)
9. `forum_categories` (Chuyên mục thảo luận)
10. `forum_posts` (Bài viết thảo luận)
11. `forum_comments` (Bình luận & phản hồi - Kiểm duyệt bởi Admin)
12. `site_settings` (Cấu hình nội dung tĩnh / Nghiên cứu)
