# FEATURE 04: COURSE & CONTENT MANAGEMENT (FRONTEND UI/UX SPECS)

---

## 1. MỤC TIÊU VÀ PHẠM VI

- Xây dựng trải nghiệm học tập giáo dục giới tính trực quan, khoa học và không gây ngại ngùng theo chuẩn LMS (Coursera/Udemy).
- Hiện thực hóa luồng trải nghiệm 3 trang chuẩn mực:
  1. **Trang 1: Course Intro** — Khám phá mục tiêu, đề cương và đăng ký khóa học.
  2. **Trang 2: Course Learning** — Không gian học tập tập trung (Player video, tài liệu đọc, sidebar danh sách bài học có tích xanh).
  3. **Trang 3: Course Outro** — Không gian chúc mừng, tổng kết kiến thức và thu thập khảo sát nghiên cứu khoa học.
- Hỗ trợ bộ lọc đối tượng học tập (**Target Audience**): `Dành cho Phụ huynh` và `Dành cho Trẻ nhỏ`.

---

## 2. CẤU TRÚC ĐỊNH TUYẾN (NEXT.JS APP ROUTER)

```text
frontend/src/app/
├── (main)/
│   └── courses/
│       ├── page.tsx                        # Trang Danh mục Khóa học công khai (/courses)
│       └── [courseId]/
│           ├── intro/
│           │   └── page.tsx                # Trang 1: Giới thiệu khóa học (/courses/[id]/intro)
│           ├── outro/
│           │   └── page.tsx                # Trang 3: Tổng kết hoàn thành (/courses/[id]/outro)
├── (learning)/                             # Layout riêng biệt không có Header/Footer làm xao nhãng
│   └── courses/
│       └── [courseId]/
│           └── learn/
│               └── page.tsx                # Trang 2: Không gian học chính (/courses/[id]/learn)
└── components/courses/
    ├── CourseCard.tsx                      # Thẻ khóa học ở danh mục
    ├── LessonSidebar.tsx                   # Sidebar danh sách bài học có checkmark
    ├── VideoPlayer.tsx                     # Khung phát video bài giảng
    └── OutroCelebration.tsx                # Hiệu ứng chúc mừng hoàn thành
```

---

## 3. THIẾT KẾ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (3-PAGE COURSE FLOW)

---

### 3.1. Trang 1: Giới thiệu Khóa học — Course Intro (`/courses/[id]/intro`)

#### A. Cột chính bên trái (Nội dung giới thiệu):

- **Huy hiệu đối tượng (Badge):** `Dành cho Phụ huynh` hoặc `Dành cho Trẻ nhỏ`.
- **Tiêu đề Khóa học:** Cỡ chữ lớn (H1), đậm nét.
- **Mô tả chi tiết:** Trình bày mục đích khóa học, kiến thức thu được dưới dạng danh sách gạch đầu dòng có icon tích xanh.
- **Đề cương khóa học (Syllabus Accordion):** Sử dụng Shadcn `Accordion` hiển thị danh sách các bài học (Tên bài, loại bài: Video/Bài đọc, thời lượng ước tính).
- **Thông tin Giảng viên:** Card nhỏ gồm Avatar, Tên giảng viên/chuyên gia, Học vị.

#### B. Cột cố định bên phải (Enrollment Sticky Card):

- Ảnh bìa Thumbnail khóa học.
- Tổng số bài học (VD: `10 bài giảng`).
- **Nút hành động chính (Primary CTA Button):**
  - Nếu chưa đăng ký: Nút to màu xanh/cam **"Bắt đầu học ngay"** (Gọi API `POST /enroll` $\rightarrow$ Chuyển thẳng sang trang Learning).
  - Nếu đã đăng ký: Nút **"Tiếp tục học"** (Chuyển sang trang Learning).

---

### 3.2. Trang 2: Không gian Học chính — Course Learning (`/courses/[id]/learn`)

_Layout được thiết kế tối giản, loại bỏ thanh điều hướng chung để người học hoàn toàn tập trung._

#### A. Thanh Header học tập (Top Bar):

- Nút mũi tên "Quay lại" $\rightarrow$ Về trang Profile hoặc Danh mục khóa học.
- Tên khóa học đang học.
- Thanh hiển thị tiến độ tổng thể (%): Ví dụ `60% Hoàn thành`.

#### B. Khu vực Nội dung bài học (Khu vực chính - Main Content):

- **Nếu bài giảng dạng Video:** Khung phát Video chuẩn 16:9 sắc nét, có nút Play/Pause, điều chỉnh tốc độ (0.75x, 1x, 1.25x, 1.5x).
- **Nếu bài giảng dạng Văn bản/Hình ảnh (Text/Hybrid):** Định dạng nội dung bài đọc chuẩn y khoa, minh họa thân thiện, dễ hiểu, cỡ chữ tối ưu cho mắt.
- **Thanh công cụ chân trang (Bottom Action Bar):**
  - Nút "Bài trước" (Previous Lesson).
  - Nút Primary nổi bật: **"Đánh dấu Hoàn thành & Tiếp tục"** $\rightarrow$ Kích hoạt API cập nhật `lesson_progress`, đổi biểu tượng bài học sang Tích xanh và tự động chuyển tiếp sang bài học tiếp theo.
  - **Tự động chuyển trang:** Nếu đây là bài học cuối cùng (100%) $\rightarrow$ Kích hoạt hiệu ứng chuyển hướng sang trang **Course Outro**.

#### C. Sidebar danh mục bài học (Bên phải):

- Danh sách toàn bộ các bài học trong khóa học:
  - Bài đã học xong: **Icon tích xanh (Checkmark)**.
  - Bài đang học: **Được highlight viền nổi bật (Active State)**.
  - Bài chưa học: **Icon vòng tròn xám**.
- Người dùng có thể click vào bất kỳ bài nào để chuyển nhanh đến bài đó.

---

### 3.3. Trang 3: Tổng kết & Chứng nhận — Course Outro (`/courses/[id]/outro`)

_Trang chỉ mở khi học viên đã hoàn thành 100% tất cả các bài học._

#### A. Các phần tử trên giao diện:

1. **Hiệu ứng Chúc mừng (Celebration):** Hiệu ứng pháo hoa giấy (Confetti) nhẹ nhàng khi vừa tải trang.
2. **Huy hiệu Thành tựu:** Biểu tượng Cup / Huy hiệu hoàn thành khóa học giáo dục giới tính xuất sắc.
3. **Tiêu đề:** "Chúc mừng bạn đã hoàn thành khóa học [Tên Khóa Học]!".
4. **Nội dung đọng lại (Key Takeaways):** Hộp tóm tắt ngắn gọn các thông điệp khoa học cốt lõi nhất cần ghi nhớ.
5. **Khu vực Đóng góp Nghiên cứu Khoa học (Research Contribution):**
   - Hộp khảo sát ngắn: _"Hãy giúp nhóm nghiên cứu đánh giá hiệu quả bài giảng bằng cách điền form khảo sát 1 phút"_ kèm nút bấm mở Form.
6. **Nút điều hướng tiếp theo:**
   - Nút 1: _"Về trang cá nhân xem thành tích"_ $\rightarrow$ Điều hướng về `/profile`.
   - Nút 2: _"Khám phá các khóa học khác"_ $\rightarrow$ Điều hướng về `/courses`.

---

## 4. DANH MỤC SHADCN/UI COMPONENTS SỬ DỤNG

| Component                                        | Mục đích sử dụng                                            |
| :----------------------------------------------- | :---------------------------------------------------------- |
| `Accordion`, `AccordionItem`, `AccordionTrigger` | Hiển thị đề cương danh sách bài học ở trang Intro           |
| `Progress`                                       | Hiển thị thanh % tiến độ trên Top Bar của trang Learning    |
| `Button`                                         | Nút "Bắt đầu học", "Đánh dấu hoàn thành", "Bài tiếp theo"   |
| `Badge`                                          | Nhãn phân loại đối tượng (`Dành cho Phụ huynh` / `Trẻ nhỏ`) |
| `Card`, `CardContent`                            | Khung cố định đăng ký học và khung nội dung tổng kết Outro  |
| `Separator`                                      | Đường kẻ phân tách giữa video, nội dung và các bài giảng    |

---

## 5. LUỒNG DỮ LIỆU & TƯƠNG TÁC API (FRONTEND DATA FLOW)

```
[Bấm Bắt đầu học tại /intro]
           ⬇
[POST /api/v1/courses/{id}/enroll]
           ⬇
[Chuyển hướng sang /courses/{id}/learn]
           ⬇
[Học viên bấm 'Đánh dấu Hoàn thành']
           ⬇
[POST /api/v1/users/courses/{id}/lessons/{lesson_id}/complete]
           │
           ├── Nếu progress < 100%:
           │     └── Cập nhật tích xanh Sidebar -> Tự chuyển sang bài tiếp theo
           │
           └── Nếu progress == 100% (is_course_just_completed = true):
                 └── 🚀 Tự động điều hướng sang /courses/{id}/outro
```
