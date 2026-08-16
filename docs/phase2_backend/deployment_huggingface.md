# KẾ HOẠCH TRIỂN KHAI BACKEND LÊN HUGGING FACE SPACES (DOCKER SDK)

---

## 1. MỤC TIÊU VÀ LỢI THẾ

- Triển khai Backend Python (FastAPI/SQLAlchemy) dưới dạng một **Docker Space** trên Hugging Face.
- Tận dụng hạ tầng miễn phí **16 GB RAM + 2 vCPU** chạy liên tục 24/7, không bao giờ bị tắt hay ngủ đông.
- Kết nối trực tiếp với cơ sở dữ liệu **Supabase PostgreSQL** trên Cloud.

---

## 2. QUY TẮC ĐẶC THÙ CỦA HUGGING FACE SPACES DOCKER

1. **Cổng lắng nghe (Port Requirement):**
   - Hugging Face Spaces mặc định ánh xạ cổng **`7860`**.
   - Lệnh khởi chạy Uvicorn trong Dockerfile bắt buộc phải là:
     `uvicorn main:app --host 0.0.0.0 --port 7860`
2. **Quyền người dùng (User Permission):**
   - Hugging Face chạy container dưới tài khoản người dùng không có quyền root (User ID: `1000`). Dockerfile cần thiết lập thư mục làm việc và cấp quyền phù hợp cho user `1000`.
3. **Quản lý biến bí mật (Repository Secrets):**
   - Toàn bộ biến nhạy cảm (`DATABASE_URL`, `JWT_SECRET_KEY`...) được lưu trong phần **Settings $\rightarrow$ Variables and secrets** của Space (được bảo mật tuyệt đối, không bị lộ ra ngoài).

---

## 3. DANH SÁCH BIẾN MÔI TRƯỜNG CẦN THIẾT (SPACE SECRETS)

Cấu hình các biến sau trong mục **Settings $\rightarrow$ Secrets** trên Hugging Face Space:

| Tên biến (Secret Key)         | Mục đích                                    | Ví dụ giá trị                                                                                 |
| :---------------------------- | :------------------------------------------ | :-------------------------------------------------------------------------------------------- |
| `ENVIRONMENT`                 | Môi trường chạy                             | `production`                                                                                  |
| `PORT`                        | Cổng ứng dụng                               | `7860`                                                                                        |
| `DATABASE_URL`                | Chuỗi kết nối Supabase (Transaction Pooler) | `postgresql://postgres.xxx:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres` |
| `JWT_SECRET_KEY`              | Khóa bí mật ký mã hóa JWT Token             | `chuoi_bi_mat_ngau_nhien_64_ky_tu_cuc_kho_doan`                                               |
| `JWT_ALGORITHM`               | Thuật toán ký JWT                           | `HS256`                                                                                       |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Thời hạn của Access Token                   | `60`                                                                                          |
| `ALLOWED_ORIGINS`             | Cấu hình CORS cho Frontend                  | `*` (hoặc domain Vercel sau này)                                                              |

---

## 4. QUY TRÌNH TRIỂN KHAI TỪNG BƯỚC (STEP-BY-STEP)

### Bước 1: Tạo Space trên Hugging Face

1. Truy cập `huggingface.co/spaces` và bấm **"Create new Space"**.
2. Đặt tên cho Space: ví dụ `sex-education-backend`.
3. **License:** Chọn `MIT` hoặc `Apache 2.0`.
4. **Select the Space SDK:** Chọn **Docker** $\rightarrow$ Chọn **Blank**.
5. **Space Hardware:** Chọn **CPU Basic (2 vCPU - 16 GB RAM - Free)**.
6. **Visibility:** Chọn **Public** (để Frontend có thể gọi API từ bên ngoài).
7. Bấm **"Create Space"**.

### Bước 2: Cài đặt Biến môi trường (Secrets)

1. Vào tab **Settings** của Space vừa tạo.
2. Cuộn xuống phần **Variables and secrets**.
3. Bấm **New secret** và thêm đầy đủ các biến đã liệt kê ở **Mục 3**.

### Bước 3: Đẩy mã nguồn lên Space (Có 2 cách linh hoạt)

- **Cách 1: Đồng bộ tự động từ GitHub qua GitHub Actions (Khuyên dùng)**
  - Cấu hình một GitHub Action tự động đẩy code từ thư mục `backend/` sang repo Git của Hugging Face mỗi khi bạn push code lên GitHub.
- **Cách 2: Đẩy trực tiếp qua Hugging Face Git Remote**
  - Thêm remote của Hugging Face vào máy:
    ```bash
    git remote add hf https://huggingface.co/spaces/[username]/[ten-space]
    git push hf main
    ```

---

## 5. CÁCH LẤY ĐƯỜNG DẪN API DIRECT URL CHO FRONTEND

Sau khi Space build thành công (Trạng thái chuyển sang **Running**):

- **Giao diện Docs trực tiếp:** `https://[username]-[ten-space].hf.space/docs`
- **Gốc API Endpoint (Base URL):** `https://[username]-[ten-space].hf.space`

Tất cả các lệnh gọi API từ Frontend (hoặc Postman) chỉ cần trỏ tới Base URL này (ví dụ: `https://[username]-[ten-space].hf.space/api/v1/auth/login`).

---

## 6. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA)

- [ ] Trạng thái Space trên Hugging Face hiển thị **Running (Xanh lá)**.
- [ ] Mở đường link `https://[username]-[ten-space].hf.space/docs` thấy đầy đủ tài liệu tương tác Swagger UI.
- [ ] Gọi API `POST /api/v1/auth/register` từ Swagger UI thành công và kiểm tra bản ghi đã được lưu vào Supabase Cloud.
