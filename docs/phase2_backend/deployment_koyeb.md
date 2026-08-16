# KẾ HOẠCH TRIỂN KHAI BACKEND LÊN CLOUD KOYEB (DEPLOYMENT PLAN)

---

## 1. MỤC TIÊU VÀ YÊU CẦU

- Đóng gói ứng dụng Backend Python (FastAPI/SQLAlchemy) và triển khai tự động lên nền tảng **Koyeb**.
- Kết nối an toàn với cơ sở dữ liệu **Supabase PostgreSQL** trên Cloud qua cơ chế Connection Pooler.
- Đảm bảo Backend hoạt động liên tục 24/7, có chứng chỉ bảo mật HTTPS và sẵn sàng tiếp nhận request từ Internet.

---

## 2. QUY TRÌNH TRIỂN KHAI TỔNG THỂ (DEPLOYMENT WORKFLOW)

```
[Mã nguồn Backend trên Git]
           ⬇ (Push code to GitHub: main branch)
[GitHub Repository]
           ⬇ (Webhook Trigger)
[Koyeb Build Engine]
    ├── 1. Đọc Dockerfile
    ├── 2. Cài đặt thư viện Python (requirements.txt)
    ├── 3. Nạp biến môi trường (.env từ Koyeb Secrets)
    └── 4. Khởi chạy Uvicorn Server
           ⬇
[Koyeb Global Edge (Singapore Region)]
    ├── Tự động cấp phát HTTPS / SSL
    └── Kết nối an toàn tới Supabase PostgreSQL Cloud (Port 6543)
```

---

## 3. DANH SÁCH BIẾN MÔI TRƯỜNG CẦN THIẾT (ENVIRONMENT VARIABLES)

_Các biến này sẽ được cấu hình trực tiếp trên giao diện Settings của Koyeb (Secret Variables):_

| Tên biến (Key)                | Mục đích                                             | Ví dụ giá trị                                                                                 |
| :---------------------------- | :--------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| `ENVIRONMENT`                 | Chế độ chạy ứng dụng                                 | `production`                                                                                  |
| `PORT`                        | Cổng ứng dụng lắng nghe                              | `8000`                                                                                        |
| `DATABASE_URL`                | Chuỗi kết nối Supabase (Transaction Pooler)          | `postgresql://postgres.xxx:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres` |
| `JWT_SECRET_KEY`              | Khóa bí mật ký mã hóa JWT Token                      | `chuoi_bi_mat_ngau_nhien_64_ky_tu_cuc_kho_doan`                                               |
| `JWT_ALGORITHM`               | Thuật toán ký JWT                                    | `HS256`                                                                                       |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Thời hạn của Access Token                            | `60`                                                                                          |
| `ALLOWED_ORIGINS`             | Danh sách tên miền Frontend được phép gọi API (CORS) | `*` (Giai đoạn test) hoặc `https://your-frontend.vercel.app`                                  |

---

## 4. CÁC THÀNH PHẦN KỸ THUẬT CẦN CHUẨN BỊ TRONG MÃ NGUỒN

### 4.1. File `Dockerfile` (Đóng gói ứng dụng)

- Sử dụng base image nhẹ và bảo mật: `python:3.11-slim`.
- Cài đặt các thư viện hệ thống cần thiết (nếu có cho PostgreSQL client).
- Copy mã nguồn vào thư mục `/app`.
- Cài đặt các dependencies từ `requirements.txt`.
- Khởi chạy ứng dụng qua lệnh: `uvicorn main:app --host 0.0.0.0 --port 8000`.

### 4.2. File `requirements.txt` (Danh sách thư viện tối thiểu)

- `fastapi`: Web framework.
- `uvicorn[standard]`: ASGI Web server hiệu năng cao.
- `sqlalchemy`: ORM làm việc với Database.
- `psycopg2-binary` hoặc `asyncpg`: Thư viện driver kết nối PostgreSQL.
- `pydantic` & `pydantic-settings`: Kiểm tra kiểu dữ liệu và đọc biến môi trường.
- `python-jose[cryptography]`: Tạo và xác thực JWT Token.
- `passlib[bcrypt]`: Băm mật khẩu người dùng.
- `python-multipart`: Hỗ trợ nhận dữ liệu Form/File upload.

### 4.3. Endpoint kiểm tra trạng thái máy chủ (Health Check Endpoint)

- Koyeb cần 1 đường dẫn để kiểm tra xem ứng dụng có sống khỏe không:
  - **Endpoint:** `GET /health` hoặc `GET /api/v1/health`
  - **Response mong đợi:** `{"status": "healthy", "database": "connected"}` (HTTP Status `200 OK`).

---

## 5. CÁC BƯỚC THỰC HIỆN TRÊN GIAO DIỆN KOYEB (STEP-BY-STEP)

1. **Bước 1: Tạo tài khoản & Kết nối GitHub**
   - Đăng nhập vào `koyeb.com` bằng tài khoản GitHub.
2. **Bước 2: Tạo App mới (Create Service)**
   - Chọn nguồn triển khai: **GitHub**.
   - Chọn Repository của dự án và chọn nhánh `main`.
   - Chọn thư mục gốc (Root Directory) là `/backend` (theo cấu trúc thư mục của bạn).
3. **Bước 3: Cấu hình Vùng máy chủ & Tài nguyên**
   - **Region:** Chọn `Singapore (sin)` (gần Việt Nam nhất, ping cực thấp).
   - **Instance Type:** Chọn `Nano` hoặc `Eco` (Gói Free Tier).
4. **Bước 4: Thiết lập Biến môi trường (Environment Variables)**
   - Nhập toàn bộ danh sách biến đã chuẩn bị ở **Mục 3** vào phần _Environment variables_.
5. **Bước 5: Thiết lập Cổng mạng (Ports & Routes)**
   - Port: `8000` (Protocol: HTTP).
   - Route: `/` $\rightarrow$ Map trực tiếp vào cổng 8000.
6. **Bước 6: Bấm Deploy**
   - Koyeb sẽ tự động build Docker image và phát hành URL công khai có dạng: `https://[ten-app-cua-ban].koyeb.app`.

---

## 6. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA)

- [ ] Truy cập đường dẫn `https://[ten-app-cua-ban].koyeb.app/docs` hiển thị đầy đủ giao diện **Swagger UI / OpenAPI Documentation**.
- [ ] Endpoint `GET /health` trả về trạng thái `200 OK`.
- [ ] Thử gọi API `POST /api/v1/auth/register` tạo được tài khoản thành công và dữ liệu lập tức xuất hiện trong bảng `users` trên trang quản trị **Supabase**.
