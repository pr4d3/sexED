# PROJECT OVERVIEW: VIETNAMESE SEX EDUCATION WEB PLATFORM

_(Dự án Nghiên cứu Khoa học về Giáo dục Giới tính tại Việt Nam)_

---

## 1. GIỚI THIỆU TỔNG QUAN (PROJECT VISION)

- **Tên dự án (Tạm thời):** SexEd Platform (Nền tảng Giáo dục Giới tính Trực tuyến).
- **Mục tiêu:** Xây dựng một nền tảng học tập trực tuyến (e-learning) chuẩn mực, thân thiện, khoa học, giúp phổ biến kiến thức giáo dục giới tính cho người Việt Nam và xóa bỏ rào cản e ngại.
- **Đối tượng thụ hưởng:**
  - **Trẻ em / Vị thành niên (`STUDENT_CHILD`):** Nội dung trực quan, sinh động, an toàn, dễ hiểu về tâm sinh lý lứa tuổi dậy thì và kỹ năng tự bảo vệ bản thân.
  - **Phụ huynh (`STUDENT_PARENT`):** Nội dung trang bị kỹ năng đồng hành, thấu hiểu và phương pháp trò chuyện về giới tính cùng con trẻ.
- **Điểm nhấn tương lai:** Phân hệ Chatbot Roleplay tương tác ngữ cảnh sử dụng kỹ thuật Prompting & RAG (được tách thành nhánh nghiên cứu và phát triển độc lập).

---

## 2. KIẾN TRÚC VAI TRÒ & PHÂN QUYỀN (ROLES & PERMISSIONS)

Hệ thống quản lý 4 nhóm vai trò độc lập (Role-Based Access Control - RBAC):

1. **`ADMIN` (Quản trị viên):**
   - Quản lý người dùng, cấp quyền Giảng viên.
   - Cấu hình nội dung hệ thống.
   - **Độc quyền kiểm duyệt:** Là vai trò **duy nhất** có quyền Ẩn (`HIDDEN`) hoặc Xóa (`DELETED`) các bài viết và bình luận trên Diễn đàn.
2. **`INSTRUCTOR` (Giảng viên / Nhà nghiên cứu):**
   - Tạo và quản lý khóa học, bài giảng; chỉ định đối tượng học (`PARENT`, `CHILD`, `BOTH`).
   - Theo dõi tiến độ học tập và danh sách học viên trên Dashboard phục vụ nghiên cứu khoa học.
3. **`STUDENT_PARENT` (Học viên - Phụ huynh):**
   - Tham gia các khóa học định hướng cho phụ huynh hoặc cộng đồng.
   - Tham gia thảo luận và hỏi đáp trên Diễn đàn.
4. **`STUDENT_CHILD` (Học viên - Trẻ nhỏ):**
   - Tiếp cận các khóa học được thiết kế riêng cho độ tuổi học sinh.
   - Tham gia học tập và thảo luận an toàn trên Diễn đàn.

---

## 3. CẤU TRÚC ĐIỀU HƯỚNG TRANG (SITEMAP)

- **Trang Công khai (Public Pages):**
  - `Trang Chủ (Home Page - /)`: Giới thiệu thông điệp, chuyển đổi khóa học theo tab Phụ huynh / Trẻ nhỏ, diễn đàn mới nhất.
  - `Trang Giới thiệu (About Us - /about)`: Trình bày chi tiết đề tài nghiên cứu khoa học, sứ mệnh y khoa và đội ngũ tác giả.
  - `Trang Xác thực (Auth - /login, /register)`: Đăng ký (chọn role Phụ huynh hoặc Trẻ nhỏ), Đăng nhập, Đăng xuất.
- **Trang Khóa học (3-Page Course Flow):**
  - `Course Intro (/courses/[id]/intro)`: Đề cương, mục tiêu khóa học, thông tin giảng viên và nút đăng ký bắt đầu học.
  - `Course Learning (/courses/[id]/learn)`: Không gian học tập tập trung (Video player, tài liệu đọc, checklist hoàn thành bài học).
  - `Course Outro (/courses/[id]/outro)`: Trang chúc mừng hoàn thành 100% (Tổng kết kiến thức cốt lõi, link khảo sát nghiên cứu).
- **Trang Cá nhân & Quản trị:**
  - `User Profile (/profile)`: Quản lý thông tin cá nhân và theo dõi % tiến độ các khóa học đang tham gia.
  - `Instructor Dashboard (/dashboard)`: Bảng điều khiển dành riêng cho Giảng viên (Thống kê KPIs, Bảng khóa học, Danh sách học viên).
- **Trang Diễn đàn Cộng đồng:**
  - `Forum Page (/forum, /forum/[postId])`: Đăng bài thảo luận, bình luận phân cấp (Tích hợp menu kiểm duyệt Ẩn/Xóa độc quyền cho Admin).

---

## 4. TECH STACK & HẠ TẦNG CLOUD (CHẠY THỰC TẾ 24/7)

### 4.1. Application Stack & Kiến trúc

- **Kiến trúc Backend:** **Layered Architecture (Kiến trúc phân tầng)**
  - _Controller/Router Layer_ $\rightarrow$ _Service Layer_ $\rightarrow$ _Repository Layer_ $\rightarrow$ _Database_.
- **Backend Framework:** `Python` với `FastAPI` (Hiệu năng cao, tự động sinh tài liệu Swagger/OpenAPI, tối ưu kết nối các module AI/RAG).
- **Authentication:** `JWT (JSON Web Tokens)` kết hợp thuật toán băm mật khẩu `bcrypt`.
- **Database ORM:** `SQLAlchemy` quản lý Schema và kết nối Database.
- **Frontend Phase 2 (MVP Vận hành):** `HTML5` + `CSS` (Giao diện cơ bản, ưu tiên kết nối thông suốt API).
- **Frontend Phase 3 (Hoàn thiện UI/UX):** `Next.js (App Router)` + `TailwindCSS` + `Shadcn/ui` (Giao diện hiện đại, tối ưu SEO và trải nghiệm người dùng).

### 4.2. Hạ tầng Đám mây (Cloud Infrastructure)

- **Backend Cloud Hosting:** `Render (render.com Web Service)`
  - Kết nối tự động qua GitHub Repository (Root Directory: `backend/`).
  - Cung cấp sẵn chứng chỉ bảo mật HTTPS tự động: `https://[ten-service].onrender.com`.
- **Frontend Cloud Hosting (Phase 3):** `Vercel (vercel.com)`
  - Nền tảng tối ưu nhất thế giới cho Next.js, tự động CI/CD từ GitHub.
- **Database Cloud Engine:** `Supabase (Managed PostgreSQL)`
  - Hoạt động 24/7 trên Cloud, sử dụng cổng **Transaction Pooler (Port 6543)** chịu tải 100–300 người dùng đồng thời.
  - Tích hợp sẵn extension `pgvector` phục vụ mở rộng RAG Chatbot.
- **Asset / Media Storage:** `Supabase Storage` hoặc `Cloudinary` (Lưu trữ ảnh đại diện, thumbnail khóa học, tài liệu và video bài giảng).

---

## 5. LỘ TRÌNH PHÁT TRIỂN (ROADMAP)

- **Phase 1 (Hoàn thành):** Thiết kế toàn bộ Database Schema (12 bảng dữ liệu chia theo 6 Feature Docs).
- **Phase 2 (Hoàn thành Docs):** Xây dựng Core Backend (FastAPI theo Layered Architecture) + Deploy Render + HTML/CSS cơ bản kiểm thử toàn hệ thống.
- **Phase 3 (Hoàn thành Docs):** Xây dựng giao diện Frontend hoàn chỉnh (Next.js + TailwindCSS + Shadcn/ui) + Deploy Vercel.
- **Phân hệ Độc lập:** Phát triển Chatbot Roleplay (RAG + Prompt Engineering).
