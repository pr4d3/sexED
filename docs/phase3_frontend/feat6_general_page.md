# FEATURE 06: GENERAL PAGES (FRONTEND UI/UX SPECS)

---

## 1. MỤC TIÊU VÀ PHẠM VI

- Xây dựng giao diện công khai đón tiếp người dùng với phong cách thân thiện, chuẩn mực khoa học và xóa tan rào cản e ngại:
  1. **Trang Chủ (Home Page):** Truyền tải thông điệp sứ mệnh, phân loại khóa học trực quan theo 2 nhóm đối tượng (`Phụ huynh` và `Trẻ nhỏ`) và giới thiệu diễn đàn cộng đồng.
  2. **Trang Giới thiệu (About Us Page):** Trình bày chi tiết đề tài nghiên cứu khoa học, phương pháp tiếp cận, đội ngũ tác giả/chuyên gia và tiếp nhận đóng góp ý kiến.

---

## 2. CẤU TRÚC ĐỊNH TUYẾN (NEXT.JS APP ROUTER)

```text
frontend/src/app/
├── (main)/
│   ├── page.tsx                        # Trang Chủ (/ - Home Page)
│   ├── about/
│   │   └── page.tsx                    # Trang Giới thiệu nghiên cứu (/about)
│   └── components/
│       ├── Header.tsx                  # Thanh điều hướng chung (Navbar)
│       ├── Footer.tsx                  # Chân trang & Thông tin đề tài
│       ├── HeroBanner.tsx              # Banner mở đầu trang chủ
│       ├── AudienceCourseTabs.tsx      # Tab chuyển đổi khóa học Phụ huynh / Trẻ nhỏ
│       └── ResearchMissionCard.tsx     # Khối trình bày mục tiêu nghiên cứu khoa học
```

---

## 3. THIẾT KẾ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX DESIGN)

---

### 3.1. Trang Chủ — Home Page (`/`)

#### A. Khu vực Hero Banner (Khu vực mở đầu):

- **Bối cảnh hình ảnh/đồ họa:** Hình minh họa ấm áp, gắn kết gia đình và tuổi học trò (Tông màu Pastel: Xanh dương nhạt, Cam đào).
- **Khẩu hiệu chính (H1):** _"Giáo dục Giới tính Chuẩn Khoa học — Đồng hành An toàn cùng Bạn & Gia đình"_.
- **Mô tả phụ:** Nền tảng học tập trực tuyến chuẩn y khoa, giúp thanh thiếu niên tự tin hiểu rõ cơ thể và phụ huynh dễ dàng chia sẻ cùng con.
- **Nút Kêu gọi Hành động (CTA Buttons):**
  - Nút 1 (Primary): **"Khám phá Khóa học"** $\rightarrow$ Cuộn xuống khu vực Tab Khóa học.
  - Nút 2 (Outline): **"Tìm hiểu Đề tài Nghiên cứu"** $\rightarrow$ Chuyển sang trang `/about`.

#### B. Khu vực Giá trị Cốt lõi (3 Core Pillars Grid):

- **Cột 1: Chuẩn Y khoa & Khoa học** (Icon Khiên bảo vệ/Kính lúp) — Kiến thức chính xác, được kiểm duyệt bởi chuyên gia y tế.
- **Cột 2: Không Rào cản & Thân thiện** (Icon Trái tim/Nụ cười) — Ngôn ngữ cởi mở, hình ảnh sinh động, phù hợp từng lứa tuổi.
- **Cột 3: Cộng đồng Thảo luận An toàn** (Icon Bong bóng chat) — Nơi trao đổi câu hỏi tế nhị với sự kiểm duyệt chặt chẽ.

#### C. Khu vực Khóa học Nổi bật theo Đối tượng (Audience Course Tabs):

Sử dụng Shadcn `Tabs` lớn để phân loại rõ ràng:

- **Tab 1: "Dành cho Phụ huynh" 👨‍👩‍👧‍👦**
  - Hiển thị danh sách 3–4 thẻ khóa học có `target_audience IN ('PARENT', 'BOTH')`.
  - Tiêu đề ví dụ: _"Kỹ năng trò chuyện về giới tính cùng con", "Đồng hành qua giai đoạn dậy thì"_.
- **Tab 2: "Dành cho Học sinh / Trẻ nhỏ" 🎒**
  - Hiển thị danh sách 3–4 thẻ khóa học có `target_audience IN ('CHILD', 'BOTH')`.
  - Tiêu đề ví dụ: _"Cơ thể tôi đang thay đổi như thế nào?", "Kỹ năng nhận biết và phòng tránh xâm hại"_.
- Nút bấm dưới cùng: **"Xem toàn bộ khóa học →"** $\rightarrow$ Dẫn sang `/courses`.

#### D. Khu vực Thảo luận Diễn đàn Mới nhất (Recent Forum Feed):

- Hiển thị 3 thẻ bài viết câu hỏi/chia sẻ mới nhất trên Diễn đàn.
- Nút bấm: **"Tham gia Diễn đàn Cộng đồng"** $\rightarrow$ Dẫn sang `/forum`.

---

### 3.2. Trang Giới thiệu — About Us (`/about`)

#### A. Tiêu đề & Bối cảnh Đề tài (Research Header):

- **Tiêu đề đề tài (H1):** _"Đề tài Nghiên cứu Khoa học: Nền tảng E-learning trong Phổ cập Giáo dục Giới tính tại Việt Nam"_.
- **Thông điệp sứ mệnh:** Xóa bỏ sự e ngại, mang đến nguồn kiến thức giáo dục giới tính bình đẳng, dễ tiếp cận cho mọi trẻ em và cha mẹ trên khắp cả nước.

#### B. Các nội dung chính được trình bày theo dạng Khối (Cards):

1. **Mục tiêu Nghiên cứu:** Cung cấp giải pháp công nghệ nhằm nâng cao nhận thức giới tính, giảm thiểu nguy cơ xâm hại và định hướng sức khỏe sinh sản tuổi vị thành niên.
2. **Phương pháp Tiếp cận:** Phân loại nội dung học tập theo đúng tâm lý đối tượng (Phụ huynh vs Học sinh), kết hợp diễn đàn hỏi đáp an toàn.
3. **Đội ngũ Nghiên cứu & Giảng viên Cố vấn:**
   - Thẻ thông tin thành viên nghiên cứu: Ảnh, Họ tên, Đơn vị/Trường nghiên cứu, Vai trò dự án.
   - Thẻ thông tin Chuyên gia/Bác sĩ cố vấn chuyên môn.

#### C. Khung Đóng góp Ý kiến Nghiên cứu (Academic Feedback Section):

- Hộp thông tin liên hệ gửi thư điện tử tiếp nhận phản hồi từ các nhà khoa học, nhà giáo dục và người dùng quan tâm đến đề tài.

---

## 4. DANH MỤC SHADCN/UI COMPONENTS SỬ DỤNG

| Component                                        | Mục đích sử dụng                                                          |
| :----------------------------------------------- | :------------------------------------------------------------------------ |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | Chuyển đổi giữa 2 nhóm khóa học Phụ huynh và Trẻ nhỏ trên trang chủ       |
| `Card`, `CardHeader`, `CardTitle`, `CardContent` | Khung hiển thị các khóa học, trụ cột giá trị và thông tin nhóm nghiên cứu |
| `Badge`                                          | Gắn nhãn đối tượng (`PARENT` / `CHILD`)                                   |
| `Avatar`, `AvatarImage`, `AvatarFallback`        | Ảnh đại diện của đội ngũ nghiên cứu và giảng viên cố vấn                  |
| `Button`                                         | Nút kêu gọi hành động CTA ("Khám phá khóa học", "Đăng ký ngay")           |
| `Separator`                                      | Đường phân chia thẩm mỹ giữa các phân đoạn nội dung trên trang            |

---

## 5. TỐI ƯU HÓA TỐC ĐỘ & SEO (NEXT.JS SERVER COMPONENTS)

- Toàn bộ trang Home (`/`) và trang About (`/about`) được render dưới dạng **Server Components (SSR)**.
- Dữ liệu khóa học nổi bật và thông tin nghiên cứu được nạp trước từ Backend $\rightarrow$ Tốc độ tải trang đạt mức tức thì (dưới 1 giây) và tối ưu hóa SEO hoàn hảo cho bài báo khoa học.
