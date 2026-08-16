# FEATURE 01: AUTHENTICATION & AUTHORIZATION (BACKEND SPECS)

---

## 1. MÔ TẢ TỔNG QUAN

- Chịu trách nhiệm toàn bộ về xác thực (Authentication) và phân quyền (Authorization) của hệ thống.
- Hỗ trợ đăng ký tài khoản Học viên phân loại (`STUDENT_PARENT` và `STUDENT_CHILD`).
- Quản lý phiên đăng nhập thông qua cơ chế JWT (Access Token) và Refresh Token lưu tại Database.
- Cung cấp Middleware/Dependency kiểm soát phân quyền (RBAC) cho 4 nhóm Role: `ADMIN`, `INSTRUCTOR`, `STUDENT_PARENT`, `STUDENT_CHILD`.

---

## 2. PHÂN TẦNG KIẾN TRÚC (LAYERED ARCHITECTURE DESIGN)

```
[HTTP Request from Client]
            ⬇
[1. Controller / Router Layer (auth_router.py)]
    - Tiếp nhận Request từ Client, kiểm tra định dạng dữ liệu (Schemas).
    - Áp dụng Authentication & Authorization Middleware.
    - Gọi xuống Service Layer và trả về HTTP Response chuẩn.
            ⬇
[2. Service Layer (auth_service.py)]
    - Xử lý nghiệp vụ: băm mật khẩu (bcrypt), so khớp mật khẩu.
    - Tạo và giải mã JWT Access Token.
    - Quản lý vòng đời Refresh Token trong `user_sessions`.
    - Kiểm tra logic phân quyền Role cho từng nghiệp vụ.
            ⬇
[3. Repository Layer (auth_repository.py / user_repository.py)]
    - Thực hiện các câu lệnh truy vấn dữ liệu (CRUD) thông qua ORM.
    - Thao tác trực tiếp với các bảng: `users`, `roles`, `user_sessions`.
            ⬇
[Database: Supabase PostgreSQL]
```

---

## 3. QUY TRÌNH BẢO MẬT & XÁC THỰC (SECURITY FLOW)

1. **Mã hóa mật khẩu:** Sử dụng thuật toán `bcrypt` để băm mật khẩu trước khi lưu trữ vào cột `password_hash` của bảng `users`.
2. **Cơ chế Token đôi (Dual-Token Flow):**
   - **Access Token:** Định dạng JWT, chứa `sub` (User ID) và `role` (Role Code). Hạn sử dụng: **60 phút**. Dùng kèm Header `Authorization: Bearer <access_token>`.
   - **Refresh Token:** Chuỗi UUID ngẫu nhiên, lưu trong bảng `user_sessions`. Hạn sử dụng: **30 ngày**. Dùng để cấp mới Access Token mà không bắt người dùng đăng nhập lại.
3. **Phân quyền Route (RBAC Middleware):**
   - Middleware giải mã Access Token, trích xuất `role`.
   - Đối chiếu với danh sách các Role được phép truy cập endpoint tương ứng. Nếu không khớp $\rightarrow$ trả về lỗi `403 Forbidden`.

---

## 4. DANH SÁCH API ENDPOINTS

| STT | Phương thức | Endpoint                          | Quyền truy cập | Mục đích                                                           |
| :-: | :---------- | :-------------------------------- | :------------- | :----------------------------------------------------------------- |
|  1  | `POST`      | `/api/v1/auth/register`           | Public         | Đăng ký tài khoản Học viên (`STUDENT_PARENT` hoặc `STUDENT_CHILD`) |
|  2  | `POST`      | `/api/v1/auth/login`              | Public         | Đăng nhập hệ thống, cấp Access Token & Refresh Token               |
|  3  | `POST`      | `/api/v1/auth/refresh-token`      | Public         | Cấp Access Token mới bằng Refresh Token hợp lệ                     |
|  4  | `POST`      | `/api/v1/auth/logout`             | Đã đăng nhập   | Đăng xuất và hủy phiên trong Database                              |
|  5  | `GET`       | `/api/v1/auth/me`                 | Đã đăng nhập   | Lấy thông tin tài khoản hiện tại                                   |
|  6  | `POST`      | `/api/v1/admin/users/assign-role` | **Chỉ ADMIN**  | Cấp quyền Giảng viên hoặc cập nhật Role cho tài khoản              |

---

## 5. ĐẶC TẢ CHI TIẾT REQUEST & RESPONSE

### 5.1. Đăng ký tài khoản (`POST /api/v1/auth/register`)

- **Tầng xử lý:** `auth_router.py` $\rightarrow$ `auth_service.register_user()` $\rightarrow$ `user_repository.create_user()`
- **Request Body (JSON):**

```json
{
  "username": "phuhuynh_an",
  "email": "an.nguyen@example.com",
  "password": "SecurePassword123@",
  "full_name": "Nguyễn Văn An",
  "role_code": "STUDENT_PARENT" // Bắt buộc là "STUDENT_PARENT" hoặc "STUDENT_CHILD"
}
```

- **Response Thành công (201 Created):**

```json
{
  "success": true,
  "message": "Đăng ký tài khoản thành công",
  "data": {
    "user_id": "usr_uuid_001",
    "username": "phuhuynh_an",
    "email": "an.nguyen@example.com",
    "role": "STUDENT_PARENT"
  }
}
```

- **Mã lỗi thường gặp:**
  - `400 Bad Request`: Email hoặc Username đã tồn tại; hoặc `role_code` không hợp lệ (không được tự ý đăng ký role `ADMIN`/`INSTRUCTOR`).

---

### 5.2. Đăng nhập (`POST /api/v1/auth/login`)

- **Tầng xử lý:** `auth_router.py` $\rightarrow$ `auth_service.authenticate_user()` $\rightarrow$ `user_repository.get_by_email_or_username()`, `auth_repository.create_session()`
- **Request Body (JSON):**

```json
{
  "username_or_email": "an.nguyen@example.com",
  "password": "SecurePassword123@"
}
```

- **Response Thành công (200 OK):**

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "ref_uuid_token_123",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": "usr_uuid_001",
      "full_name": "Nguyễn Văn An",
      "role": "STUDENT_PARENT"
    }
  }
}
```

- **Mã lỗi thường gặp:**
  - `401 Unauthorized`: Sai tên đăng nhập hoặc mật khẩu.
  - `403 Forbidden`: Tài khoản bị khóa (`status = BANNED`).

---

### 5.3. Làm mới Access Token (`POST /api/v1/auth/refresh-token`)

- **Tầng xử lý:** `auth_router.py` $\rightarrow$ `auth_service.refresh_access_token()` $\rightarrow$ `auth_repository.get_session_by_refresh_token()`
- **Request Body (JSON):**

```json
{
  "refresh_token": "ref_uuid_token_123"
}
```

- **Response Thành công (200 OK):**

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_new...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

- **Mã lỗi thường gặp:**
  - `401 Unauthorized`: Refresh Token không tồn tại hoặc đã hết hạn.

---

### 5.4. Đăng xuất (`POST /api/v1/auth/logout`)

- **Header:** `Authorization: Bearer <access_token>`
- **Request Body (JSON):**

```json
{
  "refresh_token": "ref_uuid_token_123"
}
```

- **Tầng xử lý:** `auth_router.py` $\rightarrow$ `auth_service.logout_user()` $\rightarrow$ `auth_repository.delete_session()`
- **Response Thành công (200 OK):**

```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

---

### 5.5. Lấy thông tin tài khoản hiện tại (`GET /api/v1/auth/me`)

- **Header:** `Authorization: Bearer <access_token>`
- **Tầng xử lý:** `auth_router.py` $\rightarrow$ `auth_service.get_current_user()` $\rightarrow$ `user_repository.get_by_id()`
- **Response Thành công (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "usr_uuid_001",
    "username": "phuhuynh_an",
    "email": "an.nguyen@example.com",
    "full_name": "Nguyễn Văn An",
    "role": "STUDENT_PARENT",
    "status": "ACTIVE"
  }
}
```

---

### 5.6. Phân quyền người dùng (`POST /api/v1/admin/users/assign-role`)

- **Quyền truy cập:** **Chỉ ADMIN** (Kiểm tra qua `RoleGuard(["ADMIN"])`)
- **Tầng xử lý:** `auth_router.py` $\rightarrow$ `auth_service.assign_role()` $\rightarrow$ `user_repository.update_user_role()`
- **Request Body (JSON):**

```json
{
  "target_user_id": "usr_uuid_002",
  "new_role_code": "INSTRUCTOR"
}
```

- **Response Thành công (200 OK):**

```json
{
  "success": true,
  "message": "Cập nhật vai trò người dùng thành công"
}
```
