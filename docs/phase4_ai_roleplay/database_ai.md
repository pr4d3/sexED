# DATABASE SCHEMA FOR AI ROLEPLAY & RAG SERVICE (DATA SPECS)

---

## 1. MỤC TIÊU VÀ PHẠM VI

- Lưu trữ cấu hình 4 phòng chơi kịch bản giáo dục giới tính (`ai_scenarios`).
- Quản lý phiên hội thoại thời gian thực, lưu trữ `recent_summary`, điểm số tâm lý/an toàn (`ai_sessions`).
- Lưu lịch sử tin nhắn chi tiết (Lời thoại, Hành động, Cảm xúc) để phân tích hành vi (`ai_messages`).
- Triển khai **Vector Store (`pgvector`)** để lưu trữ tri thức y khoa và quy tắc an toàn phục vụ RAG (`ai_knowledge_vectors`).
- Bảng tổng kết kết quả (`ai_game_evaluations`) phục vụ trích xuất số liệu cho bài báo nghiên cứu khoa học.

---

## 2. DANH SÁCH CÁC BẢNG DỮ LIỆU

[ai_scenarios] (4 Kịch bản phòng chơi cố định)
│ (1 - N)
▼
[ai_sessions] (Lưu phiên chơi, điểm số hiện tại, recent_summary)
│
├── (1 - N) ──► [ai_messages] (Lưu từng lượt chat, cảm xúc, lời thoại)
│
└── (1 - 1) ──► [ai_game_evaluations] (Tổng kết điểm, kết quả cuối cùng)
[ai_knowledge_vectors] (Kho tri thức RAG y khoa & an toàn - pgvector)

---

## 3. ĐẶC TẢ CHI TIẾT CÁC BẢNG DỮ LIỆU

### 3.1. Bảng `ai_scenarios` (Danh mục Kịch bản Phòng chơi)

_Lưu trữ cấu hình tĩnh của 4 phòng chơi roleplay._

| Tên trường (Field) | Kiểu dữ liệu         | Ràng buộc               | Ý nghĩa / Ghi chú                                                  |
| :----------------- | :------------------- | :---------------------- | :----------------------------------------------------------------- |
| `id`               | Integer              | Primary Key, Auto Inc   | Khóa chính kịch bản                                                |
| `room_code`        | String (Varchar 50)  | Unique, Not Null        | `ROOM_STRANGER`, `ROOM_DOCTOR`, `ROOM_TEEN_CHILD`, `ROOM_BULLYING` |
| `title`            | String (Varchar 255) | Not Null                | Tên phòng chơi hiển thị                                            |
| `npc_name`         | String (Varchar 100) | Not Null                | Tên nhân vật AI (VD: "Quân Kool", "BS. Minh Trang")                |
| `npc_avatar_url`   | String (Varchar 500) | Nullable                | Link ảnh minh họa nhân vật                                         |
| `initial_score`    | Integer              | Not Null, Default: 50   | Điểm an toàn / tin tưởng ban đầu                                   |
| `target_audience`  | String (Varchar 20)  | Not Null                | `CHILD`, `PARENT`, hoặc `BOTH`                                     |
| `is_active`        | Boolean              | Not Null, Default: true | Trạng thái kích hoạt phòng chơi                                    |

---

### 3.2. Bảng `ai_sessions` (Quản lý Phiên chơi & Trí nhớ tóm tắt)

_Lưu vết phiên chơi, điểm số biến thiên và `recent_summary`._

| Tên trường (Field) | Kiểu dữ liệu        | Ràng buộc                                   | Ý nghĩa / Ghi chú                                |
| :----------------- | :------------------ | :------------------------------------------ | :----------------------------------------------- |
| `id`               | BigInteger / UUID   | Primary Key                                 | Khóa chính phiên chơi                            |
| `user_id`          | BigInteger / UUID   | Not Null                                    | Khóa ngoại đồng bộ từ JWT (`users.id`)           |
| `scenario_id`      | Integer             | Foreign Key -> `ai_scenarios(id)`, Not Null | Kịch bản phòng chơi đang tham gia                |
| `current_score`    | Integer             | Not Null                                    | Điểm số hiện tại (0 - 100)                       |
| `current_emotion`  | String (Varchar 30) | Not Null, Default: `neutral`                | Biểu cảm hiện tại của NPC                        |
| `recent_summary`   | Text                | Nullable                                    | Tóm tắt các sự kiện cũ để làm Context cho LLM    |
| `status`           | String (Varchar 20) | Not Null, Default: `ACTIVE`                 | Trạng thái: `ACTIVE`, `WON`, `LOST`, `ABANDONED` |
| `created_at`       | Timestamp           | Not Null, Default: Current Time             | Thời gian bắt đầu chơi                           |
| `updated_at`       | Timestamp           | Not Null, Default: Current Time             | Thời gian cập nhật gần nhất                      |

---

### 3.3. Bảng `ai_messages` (Lịch sử Tin nhắn & Phân tích Hành vi)

_Lưu chi tiết từng câu thoại, cử chỉ, cảm xúc và điểm số thay đổi phục vụ nghiên cứu._

| Tên trường (Field) | Kiểu dữ liệu         | Ràng buộc                                                  | Ý nghĩa / Ghi chú                           |
| :----------------- | :------------------- | :--------------------------------------------------------- | :------------------------------------------ |
| `id`               | BigInteger / UUID    | Primary Key                                                | Khóa chính tin nhắn                         |
| `session_id`       | BigInteger / UUID    | Foreign Key -> `ai_sessions(id)`, Not Null, Cascade Delete | Thuộc phiên chơi nào                        |
| `sender`           | String (Varchar 10)  | Not Null                                                   | Người gửi: `USER` hoặc `NPC`                |
| `dialogue`         | Text                 | Not Null                                                   | Nội dung lời thoại                          |
| `action`           | String (Varchar 255) | Nullable                                                   | Hành động/cử chỉ trong dấu sao (nếu là NPC) |
| `emotion`          | String (Varchar 30)  | Nullable                                                   | Cảm xúc tại thời điểm nói                   |
| `score_change`     | Integer              | Not Null, Default: 0                                       | Điểm thay đổi tại lượt này (+/-)            |
| `created_at`       | Timestamp            | Not Null, Default: Current Time                            | Thời gian gửi tin nhắn                      |

---

### 3.4. Bảng `ai_knowledge_vectors` (Kho Tri thức RAG - pgvector)

_Lưu các đoạn tri thức y khoa và quy tắc an toàn đã được nhúng vector._

| Tên trường (Field) | Kiểu dữ liệu               | Ràng buộc                       | Ý nghĩa / Ghi chú                                          |
| :----------------- | :------------------------- | :------------------------------ | :--------------------------------------------------------- |
| `id`               | BigInteger / UUID          | Primary Key                     | Khóa chính đoạn tri thức                                   |
| `category`         | String (Varchar 50)        | Not Null                        | `ONLINE_SAFETY`, `PUBERTY_ANATOMY`, `COMMUNICATION_SKILLS` |
| `topic`            | String (Varchar 150)       | Not Null                        | Chủ đề (VD: "Quy tắc 5 ngón tay", "Hiện tượng mộng tinh")  |
| `content_chunk`    | Text                       | Not Null                        | Đoạn văn bản kiến thức chuẩn y khoa                        |
| `embedding`        | Vector(1536) / Vector(768) | Not Null                        | Vector Embeddings (Chỉ mục HNSW/IVFFlat)                   |
| `created_at`       | Timestamp                  | Not Null, Default: Current Time | Thời gian tạo                                              |

---

### 3.5. Bảng `ai_game_evaluations` (Báo cáo Tổng kết Nghiên cứu Khoa học)

_Dữ liệu định lượng phục vụ xuất file Excel/CSV làm số liệu cho bài báo khoa học._

| Tên trường (Field)    | Kiểu dữ liệu        | Ràng buộc                                          | Ý nghĩa / Ghi chú                                        |
| :-------------------- | :------------------ | :------------------------------------------------- | :------------------------------------------------------- |
| `id`                  | BigInteger / UUID   | Primary Key                                        | Khóa chính bản đánh giá                                  |
| `session_id`          | BigInteger / UUID   | Unique, Foreign Key -> `ai_sessions(id)`, Not Null | Phiên chơi tương ứng                                     |
| `user_id`             | BigInteger / UUID   | Not Null                                           | Người chơi                                               |
| `scenario_id`         | Integer             | Not Null                                           | Kịch bản phòng chơi                                      |
| `final_score`         | Integer             | Not Null                                           | Điểm số cuối cùng                                        |
| `result_outcome`      | String (Varchar 50) | Not Null                                           | `SAFE_EXIT`, `DANGER_ALERT`, `OPEN_HEART`, `CLOSE_HEART` |
| `total_turns`         | Integer             | Not Null                                           | Tổng số lượt đối đáp                                     |
| `duration_seconds`    | Integer             | Not Null                                           | Tổng thời gian hoàn thành (giây)                         |
| `ai_feedback_summary` | Text                | Nullable                                           | Nhận xét tự động của AI về phản xạ của người chơi        |
| `created_at`          | Timestamp           | Not Null, Default: Current Time                    | Thời gian hoàn thành                                     |

---

## 4. CHIẾN LƯỢC ĐÁNH INDEX (TỐI ƯU HÓA TRUY VẤN)

### 4.1. Vector Indexing (Phục vụ truy xuất RAG siêu tốc)

- **Thuật toán chỉ mục:** Sử dụng **HNSW (Hierarchical Navigable Small World)** trên cột `embedding` của bảng `ai_knowledge_vectors`:
  - Khoảng cách đo: `vector_cosine_ops` (Cosine Similarity).
  - Tham số cấu hình: `m = 16`, `ef_construction = 64`.
  - **Mục tiêu:** Tốc độ tìm kiếm đoạn văn bản chuẩn y khoa liên quan đạt dưới **15ms**.

### 4.2. B-Tree Indexing truyền thống (Phục vụ truy vấn Lịch sử Chat & Phiên chơi)

Để đảm bảo Backend tải 4–6 tin nhắn gần nhất tức thì:

- `idx_ai_messages_session_created`: Đánh Composite Index trên `(session_id, created_at DESC)` của bảng `ai_messages`.
- `idx_ai_sessions_user_status`: Đánh Composite Index trên `(user_id, status)` của bảng `ai_sessions`.
- `idx_ai_evaluations_scenario`: Đánh Index trên `(scenario_id, result_outcome)` phục vụ việc lọc và tổng hợp báo cáo.

---

## 5. DATABASE VIEWS PHỤC VỤ NGHIÊN CỨU KHOA HỌC (ANALYTICS VIEWS)

Để phục vụ việc trích xuất số liệu viết bài báo khoa học mà không cần viết câu truy vấn phức tạp:

### 5.1. View: `view_research_scenario_metrics` (Hiệu quả theo từng phòng chơi)

Tổng hợp tự động:

- Tổng số lượt chơi theo từng kịch bản phòng chơi.
- Tỷ lệ chiến thắng / an toàn (`WIN_RATE` = Tổng số `SAFE_EXIT` + `OPEN_HEART` / Tổng lượt chơi \* 100).
- Điểm số an toàn trung bình của người học (`AVG_FINAL_SCORE`).
- Số lượt tin nhắn trung bình để giải quyết một tình huống (`AVG_TURNS`).

### 5.2. View: `view_research_user_growth` (Đo lường sự tiến bộ của người học)

- So sánh điểm số an toàn giữa **lượt chơi đầu tiên** và **các lượt chơi tiếp theo** của cùng một người dùng để chứng minh hiệu quả giáo dục của nền tảng.

---

## 6. CHÍNH SÁCH BẢO MẬT & QUYỀN RIÊNG TƯ (ROW LEVEL SECURITY - RLS)

- **Học viên (`STUDENT_PARENT`, `STUDENT_CHILD`):** Chỉ có quyền đọc và gửi tin nhắn trong các `ai_sessions` do chính mình tạo ra (`user_id = auth.uid()`).
- **Giảng viên & Admin (`INSTRUCTOR`, `ADMIN`):** Có quyền đọc toàn bộ dữ liệu ẩn danh từ `ai_game_evaluations` và `ai_sessions` để phục vụ công tác nghiên cứu và thống kê.

---

## 7. CHIẾN LƯỢC HẠ TẦNG & TỐI ƯU HÓA SUPABASE DÙNG CHUNG (INFRASTRUCTURE STRATEGY)

### 7.1. Mô hình Hợp nhất Database (Single-Database Multi-Service Architecture)

- **Quyết định:** Cả **Web Platform chính** và **AI Roleplay Microservice** cùng kết nối chung vào **01 Database PostgreSQL trên Supabase (Gói Free Tier)**.
- **Lợi ích:**
  - Tiết kiệm thời gian quản trị, giảm thiểu độ trễ mạng giữa các dịch vụ.
  - Cho phép liên kết trực tiếp (Foreign Key / JOIN) giữa bảng người dùng `users` của Web chính và kết quả đánh giá `ai_game_evaluations` của game mà không cần gọi API trung gian.

### 7.2. Nguyên tắc Tối ưu hóa Vận hành (Production Rules)

1. **Kiểm soát dung lượng 500 MB (Storage Discipline):**
   - Tuyệt đối **không lưu trữ file media (ảnh, video, audio) trực tiếp trong Database**.
   - Toàn bộ ảnh avatar NPC, thumbnail kịch bản và tài liệu phải được tải lên **Supabase Storage Bucket** (Gói Free cung cấp riêng 1 GB Storage độc lập).
2. **Quản lý kết nối đồng thời (Connection Pooling):**
   - Cả 2 dịch vụ (Web Backend và AI Backend) bắt buộc phải cấu hình `DATABASE_URL` trỏ vào **Transaction Pooler (Port: 6543)** của Supabase.
   - Tránh cạn kiệt số lượng kết nối (Connection Exhaustion) khi có nhiều người dùng cùng chat với bot cùng lúc.
3. **Phương án mở rộng khi vượt ngưỡng (Fallback Scaling Strategy):**
   - Khi dung lượng đạt mức cảnh báo 85% (khoảng 420 MB), kích hoạt cơ chế tự động nén và xuất các bản ghi tin nhắn cũ (`ai_messages`) sang định dạng file JSON/CSV lưu trữ trên Supabase Storage để giải phóng bộ nhớ DB mà vẫn bảo toàn 100% dữ liệu nghiên cứu khoa học.
