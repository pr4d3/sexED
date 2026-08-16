# FEATURE DOC 01: AUTHENTICATION & AUTHORIZATION (XÁC THỰC & PHÂN QUYỀN)

---

## 1. MỤC TIÊU VÀ PHẠM VI

- Quản lý định danh tài khoản, thông tin cơ bản của người dùng.
- Thực hiện xác thực (Đăng ký, Đăng nhập, Đăng xuất, Lưu phiên làm việc).
- Cung cấp cơ chế phân quyền (Role-Based Access Control - RBAC) làm nền tảng kiểm soát truy cập cho toàn bộ hệ thống gồm 4 vai trò:
  1. `ADMIN` (Quản trị viên)
  2. `INSTRUCTOR` (Giảng viên)
  3. `STUDENT_PARENT` (Học viên - Phụ huynh)
  4. `STUDENT_CHILD` (Học viên - Trẻ nhỏ)

---

## 2. QUY TẮC NGHIỆP VỤ (BUSINESS LOGIC)

### 2.1. Đăng ký & Tạo tài khoản

- **Đăng ký công khai:** Người dùng tự do đăng ký tài khoản học viên và bắt buộc phải chọn 1 trong 2 loại tài khoản:
  - `Học viên - Phụ huynh` (`STUDENT_PARENT`)
  - `Học viên - Trẻ nhỏ` (`STUDENT_CHILD`)
- **Tài khoản Giảng viên & Admin:** Không mở đăng ký tự do; chỉ được tạo bởi `ADMIN` hoặc được cấp quyền từ hệ thống quản trị.

### 2.2. Đăng nhập & Quản lý phiên

- Đăng nhập bằng Email/Tên đăng nhập và Mật khẩu (mật khẩu bắt buộc được mã hóa 1 chiều).
- Trạng thái tài khoản: `ACTIVE` (Hoạt động), `INACTIVE` (Chưa kích hoạt), `BANNED` (Bị khóa).

### 2.3. Ma trận phân quyền cốt lõi (RBAC Matrix)

| Chức năng / Quyền hạn                        |  ADMIN  | INSTRUCTOR | STUDENT_PARENT | STUDENT_CHILD |
| :------------------------------------------- | :-----: | :--------: | :------------: | :-----------: |
| Quản lý người dùng, cấp quyền Giảng viên     |   Có    |   Không    |     Không      |     Không     |
| Xem nội dung dành riêng cho Phụ huynh        |   Có    |     Có     |       Có       |     Không     |
| Xem nội dung dành riêng cho Trẻ nhỏ          |   Có    |     Có     |     Không      |      Có       |
| Xem nội dung công khai (Cả hai)              |   Có    |     Có     |       Có       |      Có       |
| Tạo, sửa, quản lý Khóa học & Bài giảng       |   Có    |     Có     |     Không      |     Không     |
| Xem Bảng điều khiển Giảng viên (Dashboard)   |   Có    |     Có     |     Không      |     Không     |
| Xem Hồ sơ cá nhân (Profile) & Tiến độ học    |   Có    |     Có     |       Có       |      Có       |
| Đăng bài, bình luận trên Diễn đàn (Forum)    |   Có    |     Có     |       Có       |      Có       |
| **Ẩn / Xóa bài viết & bình luận trên Forum** | ** Có** | ** Không** |   ** Không**   |  ** Không**   |

---

## 3. THIẾT KẾ DATABASE SCHEMA (PHASE 1)

### 3.1. Bảng `roles` (Bảng danh mục vai trò)

_Lưu trữ định nghĩa các vai trò trong hệ thống để quản trị linh hoạt._

| Tên trường (Field) | Kiểu dữ liệu (Data Type) | Ràng buộc (Constraints)     | Ý nghĩa / Ghi chú                                                    |
| :----------------- | :----------------------- | :-------------------------- | :------------------------------------------------------------------- |
| `id`               | Integer                  | Primary Key, Auto Increment | Khóa chính                                                           |
| `role_code`        | String (Varchar 50)      | Unique, Not Null            | Mã vai trò: `ADMIN`, `INSTRUCTOR`, `STUDENT_PARENT`, `STUDENT_CHILD` |
| `role_name`        | String (Varchar 100)     | Not Null                    | Tên hiển thị (VD: "Học viên - Phụ huynh")                            |
| `description`      | Text                     | Nullable                    | Mô tả chi tiết quyền hạn của vai trò                                 |

---

### 3.2. Bảng `users` (Bảng thông tin tài khoản cốt lõi)

_Lưu trữ thông tin xác thực và định danh người dùng._

| Tên trường (Field) | Kiểu dữ liệu (Data Type) | Ràng buộc (Constraints)              | Ý nghĩa / Ghi chú                          |
| :----------------- | :----------------------- | :----------------------------------- | :----------------------------------------- |
| `id`               | BigInteger / UUID        | Primary Key                          | Khóa chính định danh tài khoản             |
| `role_id`          | Integer                  | Foreign Key -> `roles(id)`, Not Null | Liên kết tới bảng `roles`                  |
| `username`         | String (Varchar 50)      | Unique, Not Null                     | Tên tài khoản                              |
| `email`            | String (Varchar 255)     | Unique, Not Null                     | Email liên lạc/đăng nhập                   |
| `password_hash`    | String (Varchar 255)     | Not Null                             | Mật khẩu đã băm (Hash)                     |
| `full_name`        | String (Varchar 150)     | Not Null                             | Họ và tên hiển thị                         |
| `status`           | String (Varchar 20)      | Not Null, Default: `ACTIVE`          | Trạng thái: `ACTIVE`, `INACTIVE`, `BANNED` |
| `created_at`       | Timestamp                | Not Null, Default: Current Time      | Thời gian tạo tài khoản                    |
| `updated_at`       | Timestamp                | Not Null, Default: Current Time      | Thời gian cập nhật gần nhất                |

---

### 3.3. Bảng `user_sessions` (Quản lý phiên đăng nhập)

_Dùng để kiểm soát token/phiên làm việc của người dùng, hỗ trợ cơ chế đăng xuất hoặc thu hồi phiên khi cần._

| Tên trường (Field) | Kiểu dữ liệu (Data Type) | Ràng buộc (Constraints)                              | Ý nghĩa / Ghi chú                     |
| :----------------- | :----------------------- | :--------------------------------------------------- | :------------------------------------ |
| `id`               | BigInteger / UUID        | Primary Key                                          | Khóa chính phiên                      |
| `user_id`          | BigInteger / UUID        | Foreign Key -> `users(id)`, Not Null, Cascade Delete | Khóa ngoại trỏ đến người dùng         |
| `refresh_token`    | Text                     | Unique, Not Null                                     | Lưu trữ Refresh Token hoặc Session ID |
| `user_agent`       | String (Varchar 255)     | Nullable                                             | Thiết bị/Trình duyệt đăng nhập        |
| `ip_address`       | String (Varchar 45)      | Nullable                                             | Địa chỉ IP đăng nhập                  |
| `expires_at`       | Timestamp                | Not Null                                             | Thời điểm hết hạn phiên               |
| `created_at`       | Timestamp                | Not Null, Default: Current Time                      | Thời điểm tạo phiên                   |

---

## 4. QUAN HỆ VÀ RÀNG BUỘC (RELATIONSHIPS)

1. **`roles` - `users` (1 - N):** Một vai trò có thể thuộc về nhiều người dùng. Một người dùng chỉ thuộc 1 vai trò chính trong hệ thống.
2. **`users` - `user_sessions` (1 - N):** Một người dùng có thể đăng nhập trên nhiều thiết bị (nhiều phiên làm việc cùng lúc). Khi xóa user, tất cả session liên quan sẽ bị xóa theo (`Cascade Delete`).
