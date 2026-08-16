# FEATURE 03: INSTRUCTOR DASHBOARD (FRONTEND UI/UX SPECS)

---

## 1. MỤC TIÊU VÀ PHẠM VI

- Xây dựng giao diện **Bảng điều khiển Giảng viên / Nghiên cứu viên (Instructor Dashboard)** chuyên nghiệp, trực quan và hiện đại.
- Cung cấp cái nhìn toàn diện về hiệu quả giảng dạy thông qua các thẻ chỉ số (KPIs Cards).
- Hỗ trợ Giảng viên:
  - Quản lý danh sách các khóa học do mình phụ trách.
  - Theo dõi danh sách học viên, tiến độ hoàn thành bài học chi tiết của từng người phục vụ việc thu thập số liệu nghiên cứu khoa học.
- **Bảo vệ quyền truy cập:** Chỉ tài khoản có vai trò `INSTRUCTOR` hoặc `ADMIN` mới được phép truy cập.

---

## 2. CẤU TRÚC ĐỊNH TUYẾN (NEXT.JS APP ROUTER)

```text
frontend/src/app/
├── (dashboard)/
│   ├── layout.tsx                      # Dashboard Layout (Sidebar cố định bên trái + Header + Main Area)
│   └── dashboard/
│       ├── page.tsx                    # Trang Tổng quan số liệu & Quản lý khóa học (/dashboard)
│       └── students/
│           └── page.tsx                # Trang Theo dõi chi tiết học viên theo khóa (/dashboard/students)
└── components/dashboard/
    ├── MetricCard.tsx                  # Thẻ thống kê chỉ số KPI
    ├── CourseTable.tsx                 # Bảng danh sách khóa học của Giảng viên
    └── StudentProgressTable.tsx        # Bảng theo dõi tiến độ chi tiết của học viên
```

---

## 3. THIẾT KẾ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX DESIGN)

### 3.1. Bố cục chung Dashboard (`(dashboard)/layout.tsx`)

- **Sidebar bên trái (Thanh điều hướng):**
  - Logo nền tảng.
  - Menu điều hướng:
    - 📊 _Tổng quan (Overview)_ $\rightarrow$ `/dashboard`
    - 📚 _Khóa học của tôi (My Courses)_ $\rightarrow$ `/dashboard#courses`
    - 👥 _Theo dõi Học viên (Students)_ $\rightarrow$ `/dashboard/students`
    - ➕ _Tạo khóa học mới_ (Nút nổi bật) $\rightarrow$ Mở modal tạo khóa học
- **Header phía trên:**
  - Thông tin Giảng viên: Tên, Avatar, Badge `Giảng viên`.
  - Nút quay lại "Giao diện Học viên" hoặc "Trang chủ".

---

### 3.2. Trang Tổng quan (`/dashboard`)

#### A. Hàng Thẻ chỉ số thống kê (KPIs Metric Cards Grid - 4 Thẻ):

1. **Tổng số Khóa học:** Con số lớn (VD: `5`), Icon cuốn sách, màu nền xanh dương nhạt.
2. **Tổng lượt Học viên:** Con số lớn (VD: `142`), Icon nhóm người, màu nền xanh lá nhạt.
3. **Học viên đã Hoàn thành:** Con số lớn (VD: `68`), Icon huy hiệu/tốt nghiệp.
4. **Tỷ lệ Hoàn thành TB:** Con số lớn (VD: `47.9%`), Icon biểu đồ tiến độ.

#### B. Bảng Quản lý Khóa học (Course Management Table):

Bảng hiển thị các khóa học do Giảng viên phụ trách với các cột:

- **Tên khóa học:** Tên in đậm kèm đường link xem nhanh trang Intro.
- **Đối tượng:** Badge màu sắc: `Phụ huynh` hoặc `Trẻ nhỏ` hoặc `Cả hai`.
- **Số bài học:** (VD: `10 bài`).
- **Lượt học viên:** (VD: `85 học viên`).
- **Trạng thái:** Badge `Đã xuất bản` (Xanh lá) hoặc `Bản nháp` (Xám).
- **Thao tác (Action Dropdown):**
  - _Xem chi tiết học viên_ (Chuyển sang trang Students).
  - _Chỉnh sửa khóa học / Quản lý bài giảng_.
  - _Xóa khóa học_.

---

### 3.3. Trang Theo dõi Học viên (`/dashboard/students`)

#### A. Bộ chọn Khóa học (Course Selector):

- Dropdown (Shadcn `Select`): Chọn khóa học cần xem danh sách học viên (Mặc định chọn khóa học đầu tiên).

#### B. Bảng Theo dõi Tiến độ Học viên (Student Progress Table):

Bảng chi tiết phục vụ việc phân tích dữ liệu nghiên cứu khoa học:

- **Học viên:** Avatar nhỏ + Họ tên + Email.
- **Vai trò:** Badge `Học viên - Phụ huynh` hoặc `Học viên - Trẻ nhỏ`.
- **Ngày tham gia:** Ngày bắt đầu học (VD: `10/01/2025`).
- **Tiến độ (%):** Thanh Mini Progress Bar trực quan kèm con số (VD: `60% - 6/10 bài`).
- **Trạng thái:**
  - `Đang học` (Badge vàng nhạt).
  - `Đã hoàn thành` (Badge xanh lá kèm ngày hoàn tất).

---

## 4. DANH MỤC SHADCN/UI COMPONENTS SỬ DỤNG

| Component                                                | Mục đích sử dụng                                                                        |
| :------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| `Card`, `CardHeader`, `CardTitle`, `CardContent`         | Thiết kế các thẻ thống kê chỉ số KPIs                                                   |
| `Table`, `TableHeader`, `TableRow`, `TableCell`          | Bảng hiển thị danh sách khóa học và danh sách học viên                                  |
| `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` | Dropdown chọn khóa học để lọc danh sách học viên                                        |
| `Badge`                                                  | Hiển thị đối tượng mục tiêu (`PARENT`/`CHILD`) và trạng thái (`PUBLISHED`, `COMPLETED`) |
| `Progress`                                               | Mini progress bar hiển thị tiến độ % của học viên ngay trong bảng                       |
| `DropdownMenu`                                           | Menu thao tác 3 chấm (Sửa, Xóa, Xem) cho từng hàng trong bảng                           |
| `Button`                                                 | Nút "Tạo khóa học mới", "Xuất báo cáo dữ liệu"                                          |

---

## 5. LUỒNG DỮ LIỆU & TƯƠNG TÁC API (FRONTEND DATA FLOW)

```
[Giảng viên truy cập /dashboard]
        ⬇
[Middleware xác thực Role = 'INSTRUCTOR' hoặc 'ADMIN']
        ⬇
[Gọi song song các API Dashboard]
    ├── 1. GET /api/v1/instructor/dashboard/overview (Đổ vào 4 Card KPI)
    ├── 2. GET /api/v1/instructor/dashboard/courses (Đổ vào Bảng Khóa học)
    └── 3. GET /api/v1/instructor/dashboard/courses/{id}/students (Đổ vào Bảng Học viên)
```
