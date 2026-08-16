# FEATURE DOC 05: FORUM & COMMUNITY (DIỄN ĐÀN THẢO LUẬN)

---

## 1. MỤC TIÊU VÀ PHẠM VI

- Tạo không gian trao đổi, giải đáp thắc mắc cởi mở và an toàn về giáo dục giới tính giữa học viên, phụ huynh và giảng viên/chuyên gia.
- Đảm bảo môi trường thảo luận chuẩn mực thông qua cơ chế kiểm duyệt chặt chẽ: **Chỉ có `ADMIN` mới có quyền Ẩn hoặc Xóa bài viết / bình luận**.

---

## 2. QUY TẮC NGHIỆP VỤ (BUSINESS LOGIC)

### 2.1. Quyền tương tác và Đăng tải

- Tất cả người dùng đã đăng nhập (`ADMIN`, `INSTRUCTOR`, `STUDENT_PARENT`, `STUDENT_CHILD`) đều có quyền:
  - Tạo bài viết thảo luận mới (`Posts`) theo từng chủ đề/danh mục cụ thể.
  - Viết bình luận (`Comments`) hoặc phản hồi bình luận của người khác trong bài viết.
  - Xem các bài viết và bình luận đang ở trạng thái công khai (`PUBLISHED`).

### 2.2. Quy tắc Kiểm duyệt Độc quyền của Admin (Admin Moderation Rule)

- **Quyền hạn duy nhất:** Chỉ duy nhất tài khoản có vai trò `ADMIN` mới có quyền thay đổi trạng thái bài viết/bình luận sang **Ẩn (`HIDDEN`)** hoặc **Xóa (`DELETED`)**.
- Giảng viên và Học viên không có quyền xóa/ẩn bình luận của người khác.
- Khi một bình luận/bài viết bị Admin chuyển sang `HIDDEN` hoặc `DELETED`:
  - Người dùng thông thường sẽ không thể nhìn thấy nội dung đó nữa.
  - Bản ghi trong Database vẫn được giữ lại (Cơ chế Xóa mềm - Soft Delete) để phục vụ việc đối soát hoặc thu thập dữ liệu nghiên cứu hành vi.

---

## 3. THIẾT KẾ DATABASE SCHEMA (PHASE 1)

### 3.1. Bảng `forum_categories` (Chủ đề / Chuyên mục thảo luận)

_Phân loại các chủ đề giáo dục giới tính (VD: Sức khỏe sinh sản, Tâm lý dậy thì, Kỹ năng an toàn...)._

| Tên trường (Field) | Kiểu dữ liệu (Data Type) | Ràng buộc (Constraints)         | Ý nghĩa / Ghi chú               |
| :----------------- | :----------------------- | :------------------------------ | :------------------------------ |
| `id`               | Integer                  | Primary Key, Auto Increment     | Khóa chính                      |
| `name`             | String (Varchar 100)     | Unique, Not Null                | Tên chuyên mục                  |
| `slug`             | String (Varchar 100)     | Unique, Not Null                | Đường dẫn tĩnh                  |
| `description`      | Text                     | Nullable                        | Mô tả định hướng của chuyên mục |
| `created_at`       | Timestamp                | Not Null, Default: Current Time | Thời gian tạo                   |

---

### 3.2. Bảng `forum_posts` (Bài viết thảo luận)

_Lưu các bài viết do người dùng đăng lên diễn đàn._

| Tên trường (Field) | Kiểu dữ liệu (Data Type) | Ràng buộc (Constraints)                         | Ý nghĩa / Ghi chú                            |
| :----------------- | :----------------------- | :---------------------------------------------- | :------------------------------------------- |
| `id`               | BigInteger / UUID        | Primary Key                                     | Khóa chính bài viết                          |
| `category_id`      | Integer                  | Foreign Key -> `forum_categories(id)`, Not Null | Thuộc chuyên mục nào                         |
| `author_id`        | BigInteger / UUID        | Foreign Key -> `users(id)`, Not Null            | Người đăng bài                               |
| `title`            | String (Varchar 255)     | Not Null                                        | Tiêu đề bài viết                             |
| `content`          | Text / LongText          | Not Null                                        | Nội dung câu hỏi/chia sẻ                     |
| `status`           | String (Varchar 20)      | Not Null, Default: `PUBLISHED`                  | Trạng thái: `PUBLISHED`, `HIDDEN`, `DELETED` |
| `moderated_by`     | BigInteger / UUID        | Foreign Key -> `users(id)`, Nullable            | Admin thực hiện ẩn/xóa bài                   |
| `created_at`       | Timestamp                | Not Null, Default: Current Time                 | Thời gian tạo                                |
| `updated_at`       | Timestamp                | Not Null, Default: Current Time                 | Thời gian sửa                                |

---

### 3.3. Bảng `forum_comments` (Bình luận & Phản hồi)

_Lưu các bình luận trao đổi trong từng bài viết._

| Tên trường (Field)  | Kiểu dữ liệu (Data Type) | Ràng buộc (Constraints)                                    | Ý nghĩa / Ghi chú                            |
| :------------------ | :----------------------- | :--------------------------------------------------------- | :------------------------------------------- |
| `id`                | BigInteger / UUID        | Primary Key                                                | Khóa chính bình luận                         |
| `post_id`           | BigInteger / UUID        | Foreign Key -> `forum_posts(id)`, Not Null, Cascade Delete | Thuộc bài viết nào                           |
| `author_id`         | BigInteger / UUID        | Foreign Key -> `users(id)`, Not Null                       | Người viết bình luận                         |
| `parent_comment_id` | BigInteger / UUID        | Foreign Key -> `forum_comments(id)`, Nullable              | Bình luận cha (nếu phản hồi lồng nhau)       |
| `content`           | Text                     | Not Null                                                   | Nội dung bình luận                           |
| `status`            | String (Varchar 20)      | Not Null, Default: `PUBLISHED`                             | Trạng thái: `PUBLISHED`, `HIDDEN`, `DELETED` |
| `moderated_by`      | BigInteger / UUID        | Foreign Key -> `users(id)`, Nullable                       | Admin thực hiện ẩn/xóa bình luận             |
| `created_at`        | Timestamp                | Not Null, Default: Current Time                            | Thời gian tạo                                |
| `updated_at`        | Timestamp                | Not Null, Default: Current Time                            | Thời gian cập nhật                           |

---

## 4. QUAN HỆ VÀ RÀNG BUỘC (RELATIONSHIPS)

1. **`forum_categories` - `forum_posts` (1 - N):** Một danh mục có nhiều bài viết.
2. **`users` - `forum_posts` (1 - N):** Một người dùng có thể tạo nhiều bài thảo luận.
3. **`forum_posts` - `forum_comments` (1 - N):** Một bài viết có thể có nhiều lượt bình luận.
4. **`forum_comments` - `forum_comments` (1 - N) [Tự quan hệ / Self-reference]:** Hỗ trợ trả lời trực tiếp một bình luận cụ thể qua `parent_comment_id`.
5. **`users(ADMIN)` - `moderated_by`:** Truy vết định danh tài khoản Admin đã thực hiện thao tác ẩn/xóa nội dung.
