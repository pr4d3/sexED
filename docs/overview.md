# PROJECT OVERVIEW: VIETNAMESE SEX EDUCATION WEB PLATFORM

_(Dự án Nghiên cứu Khoa học về Giáo dục Giới tính tại Việt Nam)_

---

## 1. GIỚI THIỆU TỔNG QUAN (PROJECT VISION)

- **Tên dự án (Tạm thời):** SexEd Platform (Nền tảng Giáo dục Giới tính Trực tuyến).
- **Mục tiêu:** Xây dựng một nền tảng học tập trực tuyến (e-learning) chuẩn mực, thân thiện, giúp phổ biến kiến thức giáo dục giới tính cho người Việt Nam.
- **Đối tượng thụ hưởng:**
  - Trẻ em / Trẻ vị thành niên (Nội dung trực quan, dễ hiểu, an toàn).
  - Phụ huynh (Nội dung đồng hành cùng con, tâm lý học lứa tuổi).
- **Điểm nhấn tương lai:** Phân hệ Chatbot Roleplay tương tác ngữ cảnh sử dụng kỹ thuật Prompting & RAG (phát triển độc lập ở nhánh riêng).

---

## 2. KIẾN TRÚC VAI TRÒ & PHÂN QUYỀN (ROLES & PERMISSIONS)

Hệ thống quản lý 4 nhóm vai trò độc lập (RBAC):

1. **`ADMIN`:** Quản trị hệ thống, cấp quyền giảng viên, cấu hình trang, **độc quyền kiểm duyệt (ẩn/xóa) nội dung trên diễn đàn**.
2. **`INSTRUCTOR`:** Giảng viên / Nhà nghiên cứu; tạo và quản lý khóa học, bài giảng, theo dõi tiến độ học viên trên Dashboard.
3. **`STUDENT_PARENT`:** Học viên đối tượng Phụ huynh; học các khóa học định hướng cho phụ huynh hoặc cộng đồng.
4. **`STUDENT_CHILD`:** Học viên đối tượng Trẻ nhỏ; tiếp cận bài học sinh động, phù hợp độ tuổi dậy thì.

---

## 3. CẤU TRÚC ĐIỀU HƯỚNG TRANG (SITEMAP)

- **Trang Công khai:**
  - `Trang Chủ (Home Page)`: Giới thiệu, phân loại khóa học theo tab Phụ huynh / Trẻ nhỏ, diễn đàn mới nhất.
  - `Trang Giới thiệu (About Us)`: Thông tin bài nghiên cứu khoa học, sứ mệnh và đội ngũ tác giả.
  - `Trang Xác thực (Auth)`: Đăng ký (chọn role Phụ huynh hoặc Trẻ nhỏ), Đăng nhập, Đăng xuất.
- **Trang Khóa học (Course Flow 3 trang chuẩn):**
  - `Course Intro`: Đề cương, mục tiêu khóa học, nút đăng ký học.
  - `Course Learning`: Không gian học tập chính (Video, tài liệu đọc, nút đánh dấu hoàn thành bài).
  - `Course Outro`: Trang hoàn thành 100% (Tổng kết kiến thức, thông điệp nghiên cứu).
- **Trang Cá nhân & Quản trị:**
  - `User Profile`: Thông tin cá nhân, theo dõi tiến độ học tập cá nhân.
  - `Instructor Dashboard`: Quản lý bài giảng và danh sách/tiến độ học viên của Giảng viên.
- **Trang Cộng đồng:**
  - `Forum Page`: Diễn đàn thảo luận, đặt câu hỏi (Kiểm duyệt độc quyền bởi Admin).

---

## 4. TECH STACK & HẠ TẦNG CÔNG NGHỆ

### 4.1. Application Stack & Architecture

- **Kiến trúc Backend:** **Layered Architecture (Kiến trúc phân tầng)**
  - _Controller/Router Layer_ $\rightarrow$ _Service Layer_ $\rightarrow$ _Repository Layer_ $\rightarrow$ _Database_.
- **Backend Framework:** `Python` với `FastAPI` (Hiệu năng cao, tự động sinh tài liệu Swagger/OpenAPI, tối ưu kết nối các module AI/RAG) hoặc `Django`.
- **Authentication:** `JWT (JSON Web Tokens)` kết hợp thuật toán mã hóa mật khẩu `bcrypt`.
- **Database ORM:** `SQLAlchemy` (với FastAPI) hoặc `Django ORM` để quản lý Schema và Migration.
- **Frontend Phase 2 (MVP & Vận hành):** `HTML5` + `CSS` (Giao diện cơ bản, tập trung tính năng và kết nối API/Backend).
- **Frontend Phase 3 (Hoàn thiện UI/UX):** `Next.js` + `TailwindCSS` + `Shadcn/ui` để xây dựng giao diện người dùng hoàn chỉnh, chuyên nghiệp và tối ưu trải nghiệm.

### 4.2. Database & Cloud Infrastructure (Chạy thực tế 24/7)

- **Backend Cloud Hosting:** `Koyeb (Serverless Container Platform)`
  - **Môi trường:** Đóng gói ứng dụng Backend thông qua **Docker (Containerization)**.
  - **Khả năng vận hành:** Chạy liên tục **24/7 không ngủ đông** ở gói miễn phí, tốc độ phản hồi tức thì (0s cold start).
  - **Vị trí Server:** Khu vực Singapore / Tokyo (tối ưu hóa độ trễ thấp nhất cho người dùng tại Việt Nam).
  - **CI/CD:** Tự động kết nối và triển khai từ kho lưu trữ GitHub mỗi khi đẩy mã nguồn mới.
  - **Bảo mật mạng:** Tích hợp sẵn chứng chỉ bảo mật HTTPS (SSL/TLS) tự động cho toàn bộ API Endpoints.
- **Database Engine & Cloud Hosting:** `Supabase (Managed PostgreSQL)`
  - Đảm bảo cơ sở dữ liệu hoạt động trực tuyến 24/7 trên Cloud.
  - Sử dụng **Transaction Pooler (Port 6543)** để tối ưu hóa kết nối, đảm bảo chịu tải 100–300 người dùng đồng thời.
  - Hỗ trợ sẵn extension `pgvector` phục vụ trực tiếp cho tính năng Chatbot Roleplay (RAG) ở phân hệ riêng.
  - Giao diện Table Editor trực quan hỗ trợ quản trị và theo dõi dữ liệu nghiên cứu khoa học.
- **Asset / Media Storage:** `Supabase Storage` hoặc `Cloudinary` (Lưu trữ ảnh đại diện, thumbnail khóa học, tài liệu học tập và video bài giảng).

---

## 5. LỘ TRÌNH PHÁT TRIỂN (ROADMAP)

- **Phase 1:** Thiết kế Database Schema (Đã đặc tả 12 bảng cốt lõi theo 6 Feature Docs).
- **Phase 2:** Xây dựng Core Backend (API, Auth, Logic phân quyền theo Layered Architecture) + Giao diện HTML/CSS thô cho tất cả các trang $\rightarrow$ Đóng gói và Deploy bản chạy thử nghiệm (MVP).
- **Phase 3:** Hoàn thiện UI/UX Frontend chuyên nghiệp (Next.js + TailwindCSS + Shadcn/ui) cho người dùng cuối.
- **Phân hệ độc lập:** Xây dựng Chatbot Roleplay (RAG + Prompt Engineering).
