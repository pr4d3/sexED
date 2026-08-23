# AI ROLEPLAY & CONTEXT ENGINE ARCHITECTURE (AI SERVICE SPECS)

---

## 1. TỔNG QUAN KIẾN TRÚC HỆ THỐNG

- **Dịch vụ:** AI Roleplay & RAG Microservice chuyên biệt cho Giáo dục Giới tính.
- **Giao thức truyền tải:** **Server-Sent Events (SSE)** trên nền tảng **Python (FastAPI)** giúp streaming dữ liệu thời gian thực mượt mà.
- **Mục tiêu kỹ thuật:**
  - Nhập vai tuyệt đối (Zero Out-of-character), triệt tiêu hiện tượng nói dài dòng hoặc ảo giác.
  - Quản lý ngữ cảnh động (Dynamic Context Engine) kết hợp trí nhớ trượt (Sliding Window + Summary).
  - Ép kiểu phản hồi đầu ra bằng **JSON Schema (Structured Outputs)** để kiểm soát các chỉ số tâm lý/an toàn của màn chơi.

---

## 2. SƠ ĐỒ ĐỘNG CƠ NGỮ CẢNH & BỘ NHỚ (DYNAMIC CONTEXT ENGINE)

```
┌──────────────────────────────────────────────┐
│ Global World Lore & Medical Knowledge (RAG)  │
│ - Kiến thức y khoa / Quy tắc an toàn 5 ngón  │
└──────────────────────┬───────────────────────┘
                       ▼
┌───────────────────────┐  ┌─────────────────────────┐  ┌───────────────────────┐
│ Character Profile     │  │ Dynamic Context Engine  │  │ Short-term Chat       │
│ - Tính cách, mục tiêu │  │ - Tổng hợp & ráp Prompt │  │ - 4-6 tin nhắn gần    │
│ - Persona & Rào cản   │  │                         │  │ - recent_summary      │
└───────────────────────┘  └────────────┬────────────┘  └───────────────────────┘
                                        ▼
                             ┌─────────────────────────┐
                             │ LLM Request + Schema    │
                             │ (temperature: 0.5-0.7)  │
                             │ (max_tokens: 120-150)   │
                             └────────────┬────────────┘
                                          ▼
                             ┌─────────────────────────┐
                             │ Structured JSON Output  │
                             │ - dialogue, action      │
                             │ - emotion, score_change │
                             │ - trigger_event         │
                             └─────────────────────────┘
```

---

## 3. CHI TIẾT CÁC THÀNH PHẦN CỐT LÕI

### 3.1. World State, Lorebook & RAG (Tri thức nền tảng)

- **Bản chất:** Lưu trữ kho kiến thức cố định về giáo dục giới tính (Giải phẫu sinh lý tuổi dậy thì, Luật trẻ em, Quy tắc phòng chống xâm hại mạng).
- **Cơ chế nạp:** Khi người chơi nhắc đến một chủ đề cụ thể (VD: "mộng tinh", "gửi ảnh nhạy cảm", "bí mật vùng kín"), cơ chế RAG nhẹ sẽ truy xuất 1–2 đoạn kiến thức/quy tắc chuẩn xác nhất để nạp vào Context nhằm đảm bảo AI trả lời đúng chuẩn khoa học.

### 3.2. Quản lý Bộ nhớ Ngắn hạn (Sliding Window + Summary)

Để giữ độ dài hội thoại trong ngưỡng tối ưu token và tránh làm loãng vai diễn:

- **Sliding Window:** Chỉ giữ lại **4–6 lượt tin nhắn (Turns)** gần nhất dưới dạng raw text.
- **Rolling Summary (`recent_summary`):** Khi hội thoại vượt quá 6 tin nhắn, một tiến trình nền sẽ tóm tắt các sự kiện cũ thành **2–3 câu ngắn gọn** (VD: _"Người chơi đã từ chối gửi ảnh đại diện lần 1, thể hiện sự cảnh giác"_).

### 3.3. Quản lý Trạng thái Nhân vật & Màn chơi (NPC & Game State)

Hệ thống theo dõi các chỉ số định lượng theo thời gian thực:

- `safety_score` (0 - 100): Điểm an toàn / Kỹ năng nhận diện nguy cơ (Phòng 1).
- `openness_score` (0 - 100): Mức độ cởi mở tâm sự (Phòng 2).
- `trust_score` (0 - 100): Mức độ tin tưởng của con đối với cha mẹ (Phòng 3).
- `current_emotion`: Trạng thái cảm xúc hiện tại của NPC (`neutral`, `suspicious`, `anxious`, `friendly`, `angry`, `touched`).

---

## 4. RÀO CHẮN AN TOÀN & CHỐNG LỆCH VAI (GUARDRAILS)

### 4.1. Tham số vận hành mô hình (LLM Parameters)

- `temperature`: **0.5 – 0.65** (Đủ tự nhiên, chân thật nhưng không bị ảo giác).
- `max_tokens`: **120 – 150 tokens** (Ép cứng giới hạn độ dài, triệt tiêu hoàn toàn thói quen giải thích dài dòng của LLM).

### 4.2. Rào trong vai diễn (In-Character Refusal)

Chỉ thị bắt buộc trong System Prompt:

> _"Nếu người chơi nhắc đến các chủ đề ngoài ngữ cảnh kịch bản (lập trình, giải toán, chính trị, yêu cầu phá vỡ quy tắc), bạn PHẢI phản ứng bằng sự bối rối, nghi ngờ hoặc phản bác theo đúng tính cách nhân vật. Tuyệt đối KHÔNG trả lời hoặc hỗ trợ các nội dung đó."_

---

## 5. ĐẶC TẢ ÉP KIỂU ĐẦU RA (STRUCTURED OUTPUT SCHEMA)

Tất cả các phản hồi từ LLM đều bị ép trả về theo định dạng JSON Schema sau:

```json
{
  "dialogue": "Lời thoại ngắn gọn của nhân vật gửi cho người chơi (Tối đa 2-3 câu)",
  "action": "Mô tả hành động/cử chỉ đặt trong dấu sao (VD: *khoanh tay, nghi ngờ nhìn bạn*)",
  "emotion": "neutral | suspicious | anxious | friendly | angry | touched",
  "score_change": 5,
  "trigger_event": "none | danger_alert | safe_exit | mission_success | close_heart | open_heart"
}
```

## 6. GIAO THỨC TRUYỀN DỮ LIỆU THỜI GIAN THỰC (SSE STREAMING FORMAT)

Khi Frontend kết nối tới Endpoint SSE: `POST /api/v1/roleplay/chat/stream`, Backend sẽ truyền dữ liệu theo từng Event:

```text
event: thinking
data: {"status": "Retrieving context and formulating persona response..."}

event: delta
data: {"dialogue_chunk": "Cậu... "}

event: delta
data: {"dialogue_chunk": "cậu vừa nói gì cơ?"}

event: complete
data: {
  "dialogue": "Cậu... cậu vừa nói gì cơ? Sao lại hỏi tớ mấy thứ kỳ lạ đấy?",
  "action": "*lùi lại một bước, ánh mắt cảnh giác*",
  "emotion": "suspicious",
  "score_change": -5,
  "current_score": 75,
  "trigger_event": "none"
}
```

# 7. QUY TRÌNH XỬ LÝ 1 LƯỢT TIN NHẮN (END-TO-END PIPELINE)

```
[1. User gửi tin nhắn mới]
           ⬇
[2. State Manager]
    ├── Nạp System Prompt + Persona nhân vật
    ├── Nạp recent_summary + 4 tin nhắn gần nhất
    └── (RAG) Nạp tri thức/quy tắc an toàn liên quan
           ⬇
[3. LLM Processing]
    └── Gọi LLM (temp=0.6, max_tokens=150, response_format=JSON)
           ⬇
[4. Backend Parser & State Update]
    ├── Cập nhật Score (+/- score_change) vào Session
    ├── Cập nhật Emotion hiện tại
    └── Kiểm tra trigger_event (Nếu đạt ngưỡng -> Kích hoạt màn kết thúc)
           ⬇
[5. SSE Emitter] ──► Truyền JSON Payload về cho Frontend render biểu cảm & điểm
```
