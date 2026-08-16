# FEATURE 05: FORUM & COMMUNITY (BACKEND SPECS)

---

## 1. MÔ TẢ TỔNG QUAN

- Cung cấp nền tảng diễn đàn hỏi đáp, chia sẻ cởi mở và văn minh về các chủ đề giáo dục giới tính.
- Cho phép tất cả các tài khoản đã đăng nhập (`ADMIN`, `INSTRUCTOR`, `STUDENT_PARENT`, `STUDENT_CHILD`) đăng bài viết thảo luận và gửi bình luận/phản hồi.
- **Quy tắc Kiểm duyệt Cốt lõi:** Thiết lập hệ thống kiểm duyệt độc quyền — **Chỉ có tài khoản có Role `ADMIN` mới có quyền Ẩn (`HIDDEN`) hoặc Xóa mềm (`DELETED`) bài viết và bình luận vi phạm**.

---

## 2. PHÂN TẦNG KIẾN TRÚC (LAYERED ARCHITECTURE DESIGN)

```
[HTTP Request from Client]
            ⬇
[1. Controller / Router Layer (forum_router.py & admin_forum_router.py)]
    - Tiếp nhận Request duyệt chuyên mục, xem bài viết, tạo bài, gửi bình luận và kiểm duyệt.
    - Validate dữ liệu đầu vào qua Schemas.
    - Áp dụng Middleware:
        + Public: Xem bài viết, xem danh mục.
        + Authenticated (All Roles): Đăng bài, bình luận.
        + RoleGuard(["ADMIN"]): Các endpoint Ẩn/Xóa kiểm duyệt.
    - Chuyển tiếp tới Service Layer và trả về HTTP Response.
            ⬇
[2. Service Layer (forum_service.py & moderation_service.py)]
    - `get_forum_feed(category_id, search)`: Lấy danh sách bài viết đang công khai (`status = 'PUBLISHED'`).
    - `get_post_detail_with_comments(post_id)`: Trả về chi tiết bài viết và dựng cây cấu trúc bình luận (Nested Comments) loại trừ các bình luận bị ẩn/xóa.
    - `create_post(author_id, post_data)`: Tạo bài viết mới với trạng thái mặc định `PUBLISHED`.
    - `add_comment(author_id, post_id, comment_data)`: Thêm bình luận hoặc phản hồi bình luận cha (`parent_comment_id`).
    - `moderate_post_status(admin_id, post_id, target_status)`: **Chỉ Admin** - Chuyển trạng thái sang `HIDDEN` hoặc `DELETED`, ghi nhận `moderated_by = admin_id`.
    - `moderate_comment_status(admin_id, comment_id, target_status)`: **Chỉ Admin** - Chuyển trạng thái bình luận sang `HIDDEN` hoặc `DELETED`, ghi nhận `moderated_by = admin_id`.
            ⬇
[3. Repository Layer (forum_repository.py & moderation_repository.py)]
    - Thao tác trực tiếp với Database qua SQLAlchemy ORM trên các bảng: `forum_categories`, `forum_posts`, `forum_comments`, `users`.
            ⬇
[Database: Supabase PostgreSQL]
```

---

## 3. QUY TRÌNH NGHIỆP VỤ & KIỂM DUYỆT (BUSINESS LOGIC)

1. **Hiển thị nội dung công khai:**
   - Đối với người dùng thông thường (`STUDENT_PARENT`, `STUDENT_CHILD`, `INSTRUCTOR`): Hệ thống tự động lọc `WHERE status = 'PUBLISHED'`.
   - Đối với `ADMIN`: Có thể truyền cờ xem toàn bộ các bài viết/bình luận đã bị `HIDDEN` hoặc `DELETED` để phục vụ đối soát.
2. **Cơ chế Xóa mềm (Soft Delete & Moderation):**
   - Khi bài viết hoặc bình luận bị xóa/ẩn bởi Admin, bản ghi không bị xóa vĩnh viễn khỏi Database mà chỉ đổi cột `status` thành `HIDDEN` hoặc `DELETED` và gán mã Admin vào cột `moderated_by`.
3. **Cấu trúc Bình luận Phản hồi (Nested Comments):**
   - Bình luận cấp 1: `parent_comment_id = null`.
   - Phản hồi bình luận cấp 2: `parent_comment_id = id_của_bình_luận_cấp_1`.

---

## 4. DANH SÁCH API ENDPOINTS

### 4.1. Dành cho Người dùng (Community Interaction Flow)

| STT | Method | Endpoint                                 | Quyền truy cập          | Mục đích                                                    |
| :-: | :----- | :--------------------------------------- | :---------------------- | :---------------------------------------------------------- |
|  1  | `GET`  | `/api/v1/forum/categories`               | Public                  | Lấy danh sách các chuyên mục chủ đề diễn đàn                |
|  2  | `GET`  | `/api/v1/forum/posts`                    | Public                  | Lấy danh sách bài viết (Hỗ trợ lọc theo category, tìm kiếm) |
|  3  | `GET`  | `/api/v1/forum/posts/{post_id}`          | Public                  | Lấy chi tiết bài viết kèm danh sách bình luận               |
|  4  | `POST` | `/api/v1/forum/posts`                    | Đã đăng nhập (Mọi Role) | Tạo bài viết thảo luận mới                                  |
|  5  | `POST` | `/api/v1/forum/posts/{post_id}/comments` | Đã đăng nhập (Mọi Role) | Viết bình luận hoặc trả lời bình luận khác                  |

### 4.2. Dành riêng cho Quản trị viên (Admin Moderation Flow)

| STT | Method | Endpoint                                             | Quyền truy cập | Mục đích                                             |
| :-: | :----- | :--------------------------------------------------- | :------------- | :--------------------------------------------------- |
|  6  | `PUT`  | `/api/v1/admin/forum/posts/{post_id}/moderate`       | **Chỉ ADMIN**  | Ẩn (`HIDDEN`) hoặc Xóa (`DELETED`) bài viết vi phạm  |
|  7  | `PUT`  | `/api/v1/admin/forum/comments/{comment_id}/moderate` | **Chỉ ADMIN**  | Ẩn (`HIDDEN`) hoặc Xóa (`DELETED`) bình luận vi phạm |

---

## 5. ĐẶC TẢ CHI TIẾT REQUEST & RESPONSE

### 5.1. Tạo bài viết mới (`POST /api/v1/forum/posts`)

- **Header:** `Authorization: Bearer <access_token>`
- **Request Body (JSON):**

```json
{
  "category_id": 1,
  "title": "Làm thế nào để nói chuyện cởi mở với con về tuổi dậy thì?",
  "content": "Tôi có con trai năm nay 13 tuổi, dạo gần đây cháu có nhiều thay đổi tâm lý..."
}
```

- **Response Thành công (201 Created):**

```json
{
  "success": true,
  "message": "Đăng bài thảo luận thành công",
  "data": {
    "post_id": "post_uuid_301",
    "title": "Làm thế nào để nói chuyện cởi mở với con về tuổi dậy thì?",
    "status": "PUBLISHED",
    "created_at": "2025-01-25T14:20:00Z"
  }
}
```

---

### 5.2. Viết bình luận / Phản hồi (`POST /api/v1/forum/posts/{post_id}/comments`)

- **Header:** `Authorization: Bearer <access_token>`
- **Request Body (JSON):**

```json
{
  "content": "Bác sĩ khuyên phụ huynh nên lắng nghe thay vì phán xét ở giai đoạn này...",
  "parent_comment_id": null // Hoặc UUID của bình luận cha nếu là câu trả lời
}
```

- **Response Thành công (201 Created):**

```json
{
  "success": true,
  "message": "Gửi bình luận thành công",
  "data": {
    "comment_id": "cmt_uuid_501",
    "post_id": "post_uuid_301",
    "author": {
      "id": "usr_uuid_ins_01",
      "full_name": "TS. Bác sĩ Trần Thị Mai",
      "role": "INSTRUCTOR"
    },
    "content": "Bác sĩ khuyên phụ huynh nên lắng nghe thay vì phán xét ở giai đoạn này...",
    "created_at": "2025-01-25T14:35:00Z"
  }
}
```

---

### 5.3. Admin kiểm duyệt Ẩn / Xóa bài viết (`PUT /api/v1/admin/forum/posts/{post_id}/moderate`)

- **Header:** `Authorization: Bearer <access_token>` (**Chỉ ADMIN**)
- **Request Body (JSON):**

```json
{
  "action": "HIDE" // Chấp nhận: "HIDE" (chuyển HIDDEN) hoặc "DELETE" (chuyển DELETED)
}
```

- **Response Thành công (200 OK):**

```json
{
  "success": true,
  "message": "Đã ẩn bài viết vi phạm thành công",
  "data": {
    "post_id": "post_uuid_301",
    "status": "HIDDEN",
    "moderated_by": "usr_uuid_admin_01"
  }
}
```

- **Mã lỗi thường gặp:**
  - `403 Forbidden`: Người dùng không phải là `ADMIN`.
  - `404 Not Found`: Không tìm thấy bài viết.

---

### 5.4. Admin kiểm duyệt Ẩn / Xóa bình luận (`PUT /api/v1/admin/forum/comments/{comment_id}/moderate`)

- **Header:** `Authorization: Bearer <access_token>` (**Chỉ ADMIN**)
- **Request Body (JSON):**

```json
{
  "action": "DELETE" // Chấp nhận: "HIDE" hoặc "DELETE"
}
```

- **Response Thành công (200 OK):**

```json
{
  "success": true,
  "message": "Đã xóa bình luận vi phạm thành công",
  "data": {
    "comment_id": "cmt_uuid_501",
    "status": "DELETED",
    "moderated_by": "usr_uuid_admin_01"
  }
}
```
