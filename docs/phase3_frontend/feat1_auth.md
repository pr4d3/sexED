# FEATURE 01: AUTHENTICATION & AUTHORIZATION (FRONTEND UI/UX SPECS)

---

## 1. MỤC TIÊU VÀ PHẠM VI

- Xây dựng giao diện Đăng ký, Đăng nhập thân thiện, an toàn và dễ tiếp cận cho cả đối tượng **Phụ huynh** và **Trẻ em/Vị thành niên**.
- Thiết kế trải nghiệm chọn loại tài khoản trực quan (Role Selection) ngay trong luồng đăng ký.
- Quản lý phiên đăng nhập (Session/Token) và bảo vệ các trang nhạy cảm thông qua **Next.js Middleware (Protected Routes)**.

---

## 2. CẤU TRÚC ĐỊNH TUYẾN (NEXT.JS APP ROUTER)

```text
frontend/src/app/
├── (auth)/
│   ├── layout.tsx              # Layout chia đôi màn hình (Split screen: Hình minh họa + Form)
│   ├── login/
│   │   └── page.tsx            # Trang Đăng nhập (/login)
│   └── register/
│       └── page.tsx            # Trang Đăng ký phân loại Role (/register)
├── middleware.ts               # Next.js Middleware kiểm tra Token và phân quyền Route
└── context/
    └── AuthContext.tsx         # React Context lưu trữ trạng thái đăng nhập và thông tin User
```

---

## 3. THIẾT KẾ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX DESIGN)

### 3.1. Bố cục chung nhóm trang Auth (`(auth)/layout.tsx`)

- **Desktop:** Chia đôi màn hình (50/50).
  - _Cột trái:_ Banner minh họa sinh động về đề tài giáo dục giới tính an toàn, trích dẫn thông điệp nghiên cứu khoa học.
  - _Cột phải:_ Khung Form trung tâm (Card) màu nền sáng, bo góc mềm mại, thiết kế tối giản.
- **Mobile:** Toàn màn hình tập trung vào Form đăng nhập/đăng ký.

---

### 3.2. Trang Đăng ký (`/register`)

#### A. Các phần tử trên giao diện:

1. **Tiêu đề:** "Tạo tài khoản học tập" kèm mô tả ngắn "Đồng hành cùng giáo dục giới tính chuẩn khoa học".
2. **Khu vực Chọn loại tài khoản (Role Selector Cards - Trọng tâm UI):**
   - Thay vì dùng dropdown khô khan, thiết kế 2 Thẻ tương tác lớn (Interactive Cards) để người dùng click chọn:
     - **Thẻ 1: "Tôi là Phụ huynh" (`STUDENT_PARENT`)**
       - Icon: Gia đình / Cha mẹ.
       - Mô tả ngắn: _Học kỹ năng đồng hành, hướng dẫn và tâm lý lứa tuổi con trẻ._
     - **Thẻ 2: "Tôi là Học sinh / Trẻ nhỏ" (`STUDENT_CHILD`)**
       - Icon: Bạn nhỏ / Cặp sách.
       - Mô tả ngắn: _Khám phá sự thay đổi cơ thể và kỹ năng tự bảo vệ an toàn._
   - Trạng thái khi click: Viền thẻ sáng lên (Highlight Border Primary), có dấu tích chọn.
3. **Khu vực Nhập liệu (Form Fields):**
   - Họ và tên (`full_name`)
   - Tên đăng nhập (`username`)
   - Email liên hệ (`email`)
   - Mật khẩu (`password`) kèm nút ẩn/hiện mật khẩu (Show/Hide Password).
4. **Nút bấm hành động:** Nút "Đăng ký ngay" (Trạng thái Loading spinner khi đang gửi API).
5. **Chuyển hướng:** "Đã có tài khoản? Đăng nhập ngay".

---

### 3.3. Trang Đăng nhập (`/login`)

#### A. Các phần tử trên giao diện:

1. **Tiêu đề:** "Chào mừng bạn quay trở lại!".
2. **Khu vực Nhập liệu:**
   - Tên đăng nhập hoặc Email.
   - Mật khẩu.
3. **Tùy chọn:** Checkbox "Ghi nhớ đăng nhập".
4. **Nút bấm:** "Đăng nhập".
5. **Chuyển hướng sau đăng nhập:**
   - Nếu là `INSTRUCTOR` hoặc `ADMIN` $\rightarrow$ Điều hướng tự động về `/dashboard`.
   - Nếu là `STUDENT_PARENT` hoặc `STUDENT_CHILD` $\rightarrow$ Điều hướng về `/profile` hoặc `/courses`.

---

## 4. DANH MỤC SHADCN/UI COMPONENTS SỬ DỤNG

| Component                           | Mục đích sử dụng                                                 |
| :---------------------------------- | :--------------------------------------------------------------- |
| `Card`, `CardHeader`, `CardContent` | Khung bao bọc form đăng nhập / đăng ký                           |
| `Input`                             | Ô nhập dữ liệu Text, Email, Password                             |
| `Button`                            | Nút bấm thao tác, hỗ trợ trạng thái `loading` và `disabled`      |
| `RadioGroup` / `Card`               | Thiết kế thẻ chọn Role Phụ huynh / Trẻ nhỏ                       |
| `Toast` / `Sonner`                  | Hiển thị thông báo khi đăng ký/đăng nhập thành công hoặc báo lỗi |
| `Alert`, `AlertDescription`         | Cảnh báo khi tài khoản bị khóa hoặc sai thông tin                |

---

## 5. QUẢN LÝ TRẠNG THÁI & PHÂN QUYỀN TRÊN FRONTEND (RBAC)

### 5.1. Quản lý Token & Session

- Sau khi gọi API `/api/v1/auth/login` thành công:
  - Lưu `access_token` vào Cookie (hoặc Secure LocalStorage).
  - Lưu thông tin User (`id`, `full_name`, `role`) vào `AuthContext`.

### 5.2. Next.js Middleware (Protected Routes Guard)

Middleware hoạt động tại tầng mạng trước khi tải trang:

```
[Người dùng truy cập URL]
           ⬇
[Next.js Middleware kiểm tra Cookie Token]
           │
           ├── Nếu CHƯA ĐĂNG NHẬP và vào trang bảo vệ (/profile, /learn, /dashboard)
           │     └── 🔄 Điều hướng về /login
           │
           └── Nếu ĐÃ ĐĂNG NHẬP:
                 ├── Vào trang /dashboard:
                 │     └── Nếu Role KHÔNG PHẢI "INSTRUCTOR"/"ADMIN"
                 │           └── 🚫 Chuyển hướng về /unauthorized hoặc /profile
                 └── Vào trang /login hoặc /register:
                       └── 🔄 Tự động chuyển hướng về Trang chủ
```

---

## 6. XỬ LÝ LỖI & PHẢN HỒI GIAO DIỆN (ERROR HANDLING)

- **Form Validation (Zod + React Hook Form):** Báo lỗi trực tiếp dưới từng ô input bằng chữ đỏ (VD: _"Email không hợp lệ"_, _"Mật khẩu tối thiểu 8 ký tự"_).
- **Lỗi từ Backend (Toast Notification):**
  - Trùng Email/Username $\rightarrow$ Toast đỏ: _"Tên đăng nhập hoặc Email này đã tồn tại trên hệ thống"_.
  - Sai mật khẩu $\rightarrow$ Toast đỏ: _"Thông tin đăng nhập không chính xác, vui lòng thử lại"_.
