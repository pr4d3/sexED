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

```
[ai_scenarios] (4 Kịch bản phòng chơi)
      │ (1 - N)
      ▼
[ai_sessions] (Phiên chơi của Học viên/Phụ huynh)
      │
      ├── (1 - N) ──► [ai_messages] (Từng lượt chat & điểm số)
      │
      └── (1 - 1) ──► [ai_game_evaluations] (Tổng kết kết quả nghiên cứu)

[ai_knowledge_vectors] (Kho tri thức Vector RAG độc lập)
```

---

## 3. ĐẶC TẢ CHI TIẾT CÁC BẢNG DỮ LIỆU (PHASE 1 FOCUS)

### 3.1. Bảng `ai_scenarios` (Danh mục Kịch bản Phòng chơi)

_Lưu trữ cấu hình tĩnh của 4 phòng chơi roleplay._

| Tên trường (Field) | Kiểu dữ liệu         | Ràng buộc               | Ý nghĩa / Ghi chú                                                            |
| :----------------- | :------------------- | :---------------------- | :--------------------------------------------------------------------------- |
| `id`               | Integer              | Primary Key, Auto Inc   | Khóa chính                                                                   |
| `room_code`        | String (Varchar 50)  | Unique, Not Null        | Mã phòng: `ROOM_STRANGER`, `ROOM_DOCTOR`, `ROOM_TEEN_CHILD`, `ROOM_BULLYING` |
| `title`            | String (Varchar 255) | Not Null                | Tên hiển thị (VD: "Kẻ ẩn danh & Ranh giới an toàn")                          |
| `npc_name`         | String (Varchar 100) | Not Null                | Tên nhân vật AI (VD: "Quân Kool", "BS. Minh Trang")                          |
| `npc_avatar_url`   | String (Varchar 500) | Nullable                | Link ảnh minh họa nhân vật                                                   |
| `initial_score`    | Integer              | Not Null, Default: 50   | Điểm an toàn / tin tưởng ban đầu                                             |
| `target_audience`  | String (Varchar 20)  | Not Null                | `CHILD`, `PARENT`, hoặc `BOTH`                                               |
| `is_active`        | Boolean              | Not Null, Default: true | Trạng thái kích hoạt phòng chơi                                              |

---

### 3.2. Bảng `ai_sessions` (Quản lý Phiên chơi của Người dùng)

_Quản lý ngữ cảnh động và tiến trình của một lượt chơi._

| Tên trường (Field) | Kiểu dữ liệu        | Ràng buộc                                   | Ý nghĩa / Ghi chú                                       |
| :----------------- | :------------------ | :------------------------------------------ | :------------------------------------------------------ |
| `id`               | BigInteger / UUID   | Primary Key                                 | Khóa chính phiên chơi                                   |
| `user_id`          | BigInteger / UUID   | Not Null                                    | Khóa ngoại đồng bộ từ JWT (`users.id`)                  |
| `scenario_id`      | Integer             | Foreign Key -> `ai_scenarios(id)`, Not Null | Thuộc kịch bản phòng chơi nào                           |
| `current_score`    | Integer             | Not Null                                    | Điểm số hiện tại (0 - 100)                              |
| `current_emotion`  | String (Varchar 30) | Not Null, Default: `neutral`                | Trạng thái cảm xúc NPC (`friendly`, `suspicious`...)    |
| `recent_summary`   | Text                | Nullable                                    | Tóm tắt các sự kiện cũ trong hội thoại (Memory Summary) |
| `status`           | String (Varchar 20) | Not Null, Default: `ACTIVE`                 | Trạng thái: `ACTIVE`, `WON`, `LOST`, `ABANDONED`        |
| `created_at`       | Timestamp           | Not Null, Default: Current Time             | Thời gian bắt đầu chơi                                  |
| `updated_at`       | Timestamp           | Not Null, Default: Current Time             | Thời gian cập nhật gần nhất                             |

---

### 3.3. Bảng `ai_messages` (Chi tiết Từng Lượt Chat & State)

_Lưu trữ toàn bộ nội dung tin nhắn phục vụ Dynamic Context Engine và phân tích._

| Tên trường (Field) | Kiểu dữ liệu         | Ràng buộc                                                  | Ý nghĩa / Ghi chú                |
| :----------------- | :------------------- | :--------------------------------------------------------- | :------------------------------- |
| `id`               | BigInteger / UUID    | Primary Key                                                | Khóa chính tin nhắn              |
| `session_id`       | BigInteger / UUID    | Foreign Key -> `ai_sessions(id)`, Not Null, Cascade Delete | Thuộc phiên chơi nào             |
| `sender`           | String (Varchar 10)  | Not Null                                                   | Người gửi: `USER` hoặc `NPC`     |
| `dialogue`         | Text                 | Not Null                                                   | Lời thoại chính                  |
| `action`           | String (Varchar 255) | Nullable                                                   | Hành động/Cử chỉ (nếu là NPC)    |
| `emotion`          | String (Varchar 30)  | Nullable                                                   | Cảm xúc tại thời điểm nói        |
| `score_change`     | Integer              | Not Null, Default: 0                                       | Điểm thay đổi tại lượt này (+/-) |
| `created_at`       | Timestamp            | Not Null, Default: Current Time                            | Thời gian gửi                    |

---

### 3.4. Bảng `ai_knowledge_vectors` (Kho Tri thức Vector RAG - pgvector)

_Lưu trữ các đoạn văn bản chuẩn y khoa & kỹ năng phòng vệ đã được Vector hóa._

| Tên trường (Field) | Kiểu dữ liệu               | Ràng buộc                       | Ý nghĩa / Ghi chú                                                |
| :----------------- | :------------------------- | :------------------------------ | :--------------------------------------------------------------- |
| `id`               | BigInteger / UUID          | Primary Key                     | Khóa chính                                                       |
| `category`         | String (Varchar 50)        | Not Null                        | Nhóm: `ONLINE_SAFETY`, `PUBERTY_ANATOMY`, `COMMUNICATION_SKILLS` |
| `topic`            | String (Varchar 150)       | Not Null                        | Chủ đề (VD: "Quy tắc 5 ngón tay", "Hiện tượng mộng tinh")        |
| `content_chunk`    | Text                       | Not Null                        | Đoạn văn bản kiến thức chuẩn y khoa                              |
| `embedding`        | Vector(1536) / Vector(768) | Not Null                        | Vector Embeddings (Hỗ trợ tìm kiếm tương đồng Cosine Similarity) |
| `created_at`       | Timestamp                  | Not Null, Default: Current Time | Thời gian tạo                                                    |

---

### 3.5. Bảng `ai_game_evaluations` (Báo cáo Đánh giá & Dữ liệu Nghiên cứu)

_Tổng kết số liệu định lượng sau khi người chơi hoàn thành/kết thúc màn chơi._

| Tên trường (Field)    | Kiểu dữ liệu        | Ràng buộc                                          | Ý nghĩa / Ghi chú                                                 |
| :-------------------- | :------------------ | :------------------------------------------------- | :---------------------------------------------------------------- |
| `id`                  | BigInteger / UUID   | Primary Key                                        | Khóa chính bản đánh giá                                           |
| `session_id`          | BigInteger / UUID   | Unique, Foreign Key -> `ai_sessions(id)`, Not Null | Phiên chơi                                                        |
| `user_id`             | BigInteger / UUID   | Not Null                                           | Người chơi                                                        |
| `scenario_id`         | Integer             | Not Null                                           | Kịch bản                                                          |
| `final_score`         | Integer             | Not Null                                           | Điểm số cuối cùng đạt được                                        |
| `result_outcome`      | String (Varchar 50) | Not Null                                           | Kết quả: `SAFE_EXIT`, `DANGER_ALERT`, `OPEN_HEART`, `CLOSE_HEART` |
| `total_turns`         | Integer             | Not Null                                           | Tổng số lượt tin nhắn đã đối đáp                                  |
| `duration_seconds`    | Integer             | Not Null                                           | Tổng thời gian chơi (giây)                                        |
| `ai_feedback_summary` | Text                | Nullable                                           | Nhận xét tự động của AI về phản xạ của người chơi                 |
| `created_at`          | Timestamp           | Not Null, Default: Current Time                    | Thời gian hoàn thành                                              |

---

## 4. TỐI ƯU HÓA TRUY VẤN VECTO (INDEXING)

- Tạo chỉ mục **HNSW (Hierarchical Navigable Small World)** hoặc **IVFFlat** trên cột `embedding` của bảng `ai_knowledge_vectors` để tốc độ truy xuất RAG đạt dưới **15ms**:
  - Tiêu chuẩn khoảng cách: `vector_cosine_ops`.
