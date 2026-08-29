import os
from typing import List, AsyncGenerator
from google import genai
from google.genai import types
from schemas.roleplay_schema import GeminiRoleplayOutput

# Cache client instance
_client = None

def get_client() -> genai.Client:
    """Khởi tạo Client của Gemini lazily bằng AI_API_KEY"""
    global _client
    if _client is not None:
        return _client
    
    # Đọc khóa API
    api_key = os.getenv("AI_API_KEY")
    if not api_key:
        raise ValueError("AI_API_KEY chưa được cấu hình trong file .env!")
    
    _client = genai.Client(api_key=api_key)
    return _client

async def generate_embedding(text_content: str) -> List[float]:
    """Tạo vector nhúng 768 chiều sử dụng model text-embedding-004"""
    try:
        client = get_client()
        response = client.models.embed_content(
            model="text-embedding-004",
            contents=text_content
        )
        if response and response.embeddings:
            return response.embeddings[0].values
    except Exception as e:
        print(f"Error generating embedding: {e}")
        # Trả về vector mặc định nếu có lỗi
        return [0.0] * 768
    return [0.0] * 768

async def generate_chat_stream(
    system_prompt: str,
    history_messages: List[dict],
    context_chunks: List[str]
) -> AsyncGenerator[str, None]:
    """Gọi Gemini API và stream luồng phản hồi dưới dạng JSON"""
    client = get_client()
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    
    # Ráp ngữ cảnh tri thức RAG (nếu có) vào hệ thống
    rag_context = ""
    if context_chunks:
        rag_context = "\n[TRI THỨC Y KHOA & QUY TẮC AN TOÀN HỖ TRỢ - RAG]\n"
        for chunk in context_chunks:
            rag_context += f"- {chunk}\n"
        rag_context += "\nHãy dùng thông tin trên để hỗ trợ câu trả lời đúng đắn, khoa học nhất.\n"
        
    full_system_prompt = system_prompt + rag_context
    
    # Chuyển đổi lịch sử chat sang định dạng của Gemini SDK
    # Gemini nhận danh sách Content objects
    contents = []
    for msg in history_messages:
        role = "user" if msg["sender"] == "USER" else "model"
        # Với NPC, vì Gemini xuất ra JSON nên history cũng phải là chuỗi JSON để nó nhất quán ngữ cảnh
        contents.append(types.Content(
            role=role,
            parts=[types.Part.from_text(text=msg["text"])]
        ))
        
    # Cấu hình Structured Output JSON
    config = types.GenerateContentConfig(
        system_instruction=full_system_prompt,
        temperature=0.6,
        max_output_tokens=180,
        response_mime_type="application/json",
        response_schema=GeminiRoleplayOutput,
    )
    
    # Thực hiện gọi API bất đồng bộ và stream kết quả
    async for chunk in client.aio.models.generate_content_stream(
        model=model_name,
        contents=contents,
        config=config
    ):
        text = chunk.text or ""
        if text:
            yield text

async def summarize_session(history_messages: List[dict]) -> str:
    """Tạo tóm tắt ngắn gọn (recent_summary) về diễn biến hội thoại cũ"""
    try:
        client = get_client()
        model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        
        # Tạo chuỗi hội thoại
        chat_log = ""
        for m in history_messages:
            chat_log += f"{m['sender']}: {m['dialogue']}\n"
            
        prompt = f"""
Hãy tóm tắt diễn biến hội thoại sau đây trong tối đa 2 đến 3 câu ngắn gọn.
Tập trung vào phản ứng, thái độ của người chơi (đồng ý, từ chối, nghi ngờ) và mục tiêu hiện tại của NPC.

Hội thoại:
{chat_log}
"""
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.3,
                max_output_tokens=100
            )
        )
        return response.text.strip() if response.text else ""
    except Exception as e:
        print(f"Error summarizing session: {e}")
        return ""

async def evaluate_session(
    history_messages: List[dict],
    final_score: int,
    scenario_title: str
) -> str:
    """Đánh giá chi tiết phản xạ của người chơi ở cuối màn game để viết báo cáo khoa học"""
    try:
        client = get_client()
        model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        
        chat_log = ""
        for m in history_messages:
            action_text = f" ({m.get('action')})" if m.get('action') else ""
            chat_log += f"{m['sender']}: {m['dialogue']}{action_text}\n"
            
        prompt = f"""
Bạn là một chuyên gia tâm lý học đường và bác sĩ giáo dục giới tính tại Việt Nam.
Hãy viết nhận xét đánh giá chi tiết (khoảng 100-150 từ) về phản xạ và cách xử lý tình huống của người học trong trò chơi mô phỏng.

Kịch bản chơi: {scenario_title}
Điểm số đạt được: {final_score}/100
Lịch sử chat:
{chat_log}

Yêu cầu nhận xét:
1. Đánh giá khách quan điểm tích cực (Ví dụ: Từ chối khéo léo, cảnh giác cao, biết nhờ người lớn, lắng nghe tôn trọng).
2. Chỉ ra điểm chưa tốt hoặc nguy cơ (Ví dụ: Dễ bị dụ dỗ, giọng điệu tra khảo gây phòng thủ, khuyên tự trách bản thân).
3. Đưa ra 1 lời khuyên ngắn gọn áp dụng ngoài đời thực.
4. Trình bày trực tiếp, ấm áp, mang tính xây dựng giáo dục.
"""
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.5,
                max_output_tokens=300
            )
        )
        return response.text.strip() if response.text else "Chúc mừng bạn đã hoàn thành màn chơi mô phỏng!"
    except Exception as e:
        print(f"Error evaluating session: {e}")
        return "Hoàn thành màn chơi mô phỏng giáo dục giới tính thành công!"
