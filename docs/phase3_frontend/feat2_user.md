# FEATURE 02: USER PROFILE & PROGRESS TRACKING (FRONTEND UI/UX SPECS)

---

## 1. MỤC TIÊU VÀ PHẠM VI

- Xây dựng giao diện **Trang cá nhân (User Profile)** trực quan, thân thiện cho mọi tài khoản.
- Cung cấp không gian theo dõi **Tiến độ học tập (Learning Progress)** chuyên nghiệp cho Học viên:
  - Hiển thị danh sách khóa học đang theo học kèm thanh % tiến độ trực quan.
  - Phân loại rõ ràng các khóa học `Đang học` và `Đã hoàn thành`.
  - Cung cấp nút điều hướng nhanh: "Tiếp tục học" (quay lại đúng bài đang dang dở) hoặc "Xem tổng kết" (nếu đã xong 100%).

---

## 2. CẤU TRÚC ĐỊNH TUYẾN (NEXT.JS APP ROUTER)

```text
frontend/src/app/
├── (main)/
│   └── profile/
│       ├── page.tsx                    # Trang Profile tổng thể (/profile)
│       └── components/
│           ├── ProfileInfoCard.tsx     # Thẻ hiển thị & chỉnh sửa thông tin cá nhân
│           ├── CourseProgressList.tsx  # Danh sách khóa học và thanh tiến độ
│           └── EditProfileModal.tsx    # Modal/Dialog cập nhật hồ sơ
```

---

## 3. THIẾT KẾ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX DESIGN)

### 3.1. Bố cục tổng thể trang Profile (`/profile`)

Trang được chia thành 2 phần chính:

1. **Header cá nhân (Profile Hero):**
   - Ảnh đại diện lớn (Avatar) kèm nút icon máy ảnh để đổi ảnh.
   - Họ và tên, Email.
   - **Huy hiệu vai trò (Role Badge):**
     - `Phụ huynh` (Badge màu xanh dương/Pastel Blue).
     - `Học sinh` (Badge màu xanh lá/Pastel Green).
     - `Giảng viên` (Badge màu cam/Pastel Orange).
     - `Quản trị viên` (Badge màu tím/Pastel Purple).
2. **Khu vực Nội dung chính (Sử dụng Shadcn `Tabs`):**
   - **Tab 1: "Khóa học của tôi" (Mặc định cho Học viên)**.
   - **Tab 2: "Thông tin tài khoản" (Chỉnh sửa hồ sơ)**.

---

### 3.2. Tab 1: "Khóa học của tôi" (My Learning Progress)

#### A. Bộ lọc trạng thái (Filter Buttons):

- `Tất cả` | `Đang học` (`IN_PROGRESS`) | `Đã hoàn thành` (`COMPLETED`).

#### B. Thẻ Khóa học Tiến độ (Course Progress Card Item):

Mỗi khóa học được hiển thị dưới dạng một Card ngang hoặc lưới (Grid Card):

- **Ảnh Thumbnail:** Bo góc mềm mại.
- **Tiêu đề khóa học:** In đậm, dễ đọc.
- **Thanh tiến độ (Progress Bar):**
  - Thanh đo màu gradient xanh lá/xanh dương.
  - Con số hiển thị: `40%` kèm thông số chi tiết: `Đã hoàn thành 4/10 bài học`.
- **Huy hiệu trạng thái (Status Badge):**
  - Màu vàng nhạt: `Đang học`.
  - Màu xanh lá: `Đã hoàn thành`.
- **Nút hành động (Action CTA Button):**
  - Nếu `status = IN_PROGRESS` $\rightarrow$ Nút Primary: **"Tiếp tục học"** (Click vào sẽ tự động điều hướng đến trang `/courses/[id]/learn`).
  - Nếu `status = COMPLETED` $\rightarrow$ Nút Outline: **"Xem tổng kết & Đánh giá"** (Click vào để mở trang Outro `/courses/[id]/outro`).

#### C. Trạng thái chưa có khóa học (Empty State):

- Nếu học viên chưa đăng ký khóa nào: Hiển thị hình minh họa dễ thương kèm thông điệp _"Bạn chưa tham gia khóa học nào"_ và nút kêu gọi _"Khám phá khóa học ngay"_ (Dẫn về trang chủ).

---

### 3.3. Tab 2: "Thông tin tài khoản" (Account Settings)

- Hiển thị danh sách thông tin dạng form rõ ràng:
  - Họ và tên (`full_name`)
  - Tên đăng nhập (`username` - chỉ đọc/disabled)
  - Email (`email` - chỉ đọc/disabled)
  - Giới tính (Dropdown chọn `Nam`, `Nữ`, `Khác`)
  - Ngày sinh (Date Picker)
  - Số điện thoại (`phone_number`)
  - Giới thiệu bản thân (`bio` - Textarea)
- **Nút bấm:** "Lưu thay đổi" (Có Toast thông báo thành công sau khi cập nhật qua API `PUT /api/v1/users/profile`).

---

## 4. DANH MỤC SHADCN/UI COMPONENTS SỬ DỤNG

| Component                                        | Mục đích sử dụng                                            |
| :----------------------------------------------- | :---------------------------------------------------------- |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | Chuyển đổi mượt mà giữa Tab Tiến độ học và Tab Thông tin    |
| `Avatar`, `AvatarImage`, `AvatarFallback`        | Hiển thị ảnh đại diện và chữ cái viết tắt nếu chưa có ảnh   |
| `Progress`                                       | Thanh hiển thị % tiến độ học tập của từng khóa học          |
| `Badge`                                          | Đánh dấu Role người dùng và trạng thái khóa học             |
| `Card`, `CardContent`                            | Khung hiển thị các khóa học đã đăng ký                      |
| `Button`                                         | Nút bấm "Tiếp tục học", "Lưu thay đổi", "Khám phá khóa học" |
| `Skeleton`                                       | Hiệu ứng tải trang lung linh trong lúc chờ dữ liệu API      |

---

## 5. LUỒNG DỮ LIỆU & TƯƠNG TÁC API (FRONTEND DATA FLOW)

```
[Truy cập /profile]
        ⬇
[Gọi song song 2 API bằng TanStack Query]
    ├── 1. GET /api/v1/users/profile (Lấy info user)
    └── 2. GET /api/v1/users/my-courses (Lấy danh sách khóa & % tiến độ)
        ⬇
[Render dữ liệu lên giao diện]
    ├── Đổ dữ liệu vào Hero Section & Tab Thông tin
    └── Duyệt mảng `my-courses` đổ vào các thẻ Progress Card
```
