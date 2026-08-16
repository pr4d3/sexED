# FEATURE 05: FORUM & COMMUNITY (FRONTEND UI/UX SPECS)

---

## 1. MỤC TIÊU VÀ PHẠM VI

- Xây dựng giao diện Diễn đàn thảo luận cộng đồng an toàn, văn minh và cởi mở về các vấn đề giáo dục giới tính.
- Cho phép người dùng:
  - Duyệt bài viết theo chuyên mục/chủ đề và tìm kiếm câu hỏi.
  - Đăng bài viết chia sẻ thắc mắc.
  - Viết bình luận và trả lời bình luận lồng nhau (Nested Comment Thread).
- **Giao diện Kiểm duyệt Độc quyền (Admin Moderation UI):**
  - Chỉ tài khoản có Role `ADMIN` mới nhìn thấy menu thao tác **Ẩn (`Hide`)** hoặc **Xóa (`Delete`)** bài viết/bình luận.
  - Người dùng bình thường và Giảng viên hoàn toàn không nhìn thấy các nút kiểm duyệt này.

---

## 2. CẤU TRÚC ĐỊNH TUYẾN (NEXT.JS APP ROUTER)

```text
frontend/src/app/
├── (main)/
│   └── forum/
│       ├── page.tsx                        # Trang Danh sách bài viết Diễn đàn (/forum)
│       └── [postId]/
│           └── page.tsx                    # Trang Chi tiết bài viết & Thảo luận (/forum/[postId])
└── components/forum/
    ├── CategoryFilterChips.tsx             # Thanh chọn chuyên mục dạng viên thuốc (Pill Chips)
    ├── PostFeedCard.tsx                    # Thẻ hiển thị tóm tắt bài viết trên Feed
    ├── CreatePostModal.tsx                 # Modal tạo bài viết thảo luận mới
    ├── CommentThread.tsx                   # Khung bình luận và trả lời lồng nhau
    └── AdminModerationActions.tsx          # Menu Ẩn/Xóa ĐỘC QUYỀN cho Admin
```

---

## 3. THIẾT KẾ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX DESIGN)

### 3.1. Trang Danh sách Diễn đàn (`/forum`)

#### A. Thanh công cụ đầu trang (Header & Actions):

- **Tiêu đề:** "Diễn đàn Hỏi đáp & Chia sẻ Kiến thức Giới tính".
- **Thanh tìm kiếm (Search Input):** Tìm kiếm bài viết theo từ khóa.
- **Nút hành động nổi bật:** Nút Primary **"+ Đặt câu hỏi / Đăng bài"** (Chỉ hiển thị khi đã đăng nhập $\rightarrow$ Mở `CreatePostModal`).
- **Thanh lọc chuyên mục (Category Chips):**
  - Dạng nút bấm bo tròn: `Tất cả` | `Sức khỏe sinh sản` | `Tâm lý tuổi dậy thì` | `Kỹ năng an toàn & Phòng chống xâm hại` | `Góc Phụ huynh`.

#### B. Danh sách Bài viết (Post Feed Cards):

Mỗi bài viết là một Card trang nhã với:

- **Thông tin tác giả:** Avatar + Tên tác giả + Badge vai trò (`Phụ huynh`, `Học sinh`, `Giảng viên`, `Admin`) + Thời gian đăng (VD: _2 giờ trước_).
- **Chuyên mục:** Badge nhỏ (VD: _Tâm lý tuổi dậy thì_).
- **Tiêu đề bài viết:** In đậm, cỡ chữ vừa phải.
- **Nội dung tóm tắt:** 2 dòng ngắn gọn.
- **Chân thẻ:** Icon bình luận kèm số lượng (VD: `💬 8 bình luận`).
- **Nút kiểm duyệt Admin (Chỉ Admin nhìn thấy):** Icon 3 chấm góc trên bên phải chứa nút _Ẩn bài viết_ và _Xóa bài viết_.

---

### 3.2. Trang Chi tiết Bài viết & Bình luận (`/forum/[postId]`)

#### A. Khu vực Bài viết chính:

- Nút "← Quay lại Diễn đàn".
- Tiêu đề bài viết đầy đủ.
- Thông tin tác giả chi tiết.
- Nội dung văn bản chia sẻ đầy đủ.
- Menu kiểm duyệt dành riêng cho Admin (Ẩn/Xóa).

#### B. Khung Gửi Bình luận (Comment Input Box):

- Nếu đã đăng nhập: Khung Textarea nhập nội dung + Nút "Gửi bình luận".
- Nếu chưa đăng nhập: Banner nhỏ _"Vui lòng đăng nhập để tham gia thảo luận"_ kèm nút bấm chuyển sang trang Login.

#### C. Cây Danh sách Bình luận (Nested Comments Thread):

- **Bình luận cấp 1:**
  - Avatar + Tên người bình luận + Badge Role + Thời gian.
  - Nội dung bình luận.
  - Nút "Trả lời" (Reply) $\rightarrow$ Mở ô nhập liệu nhỏ ngay bên dưới.
  - **Menu kiểm duyệt của Admin (Chỉ Admin nhìn thấy):** Nút _Ẩn bình luận_ / _Xóa bình luận_.
- **Bình luận cấp 2 (Phản hồi thụt đầu dòng):**
  - Hiển thị lùi vào 1 khoảng (Indented `pl-6 border-l-2`) để phân biệt rõ câu trả lời cho bình luận nào.

---

### 3.3. Thiết kế Kiểm duyệt Admin (Admin Moderation UI Modal)

- Khi Admin click chọn "Ẩn bài viết" hoặc "Xóa bình luận":
- Hiển thị một **AlertDialog (Hộp thoại xác nhận)** của Shadcn:
  - _Tiêu đề:_ "Xác nhận kiểm duyệt nội dung"
  - _Nội dung:_ "Bạn có chắc chắn muốn ẩn/xóa bài viết này khỏi diễn đàn công khai?"
  - _Nút bấm:_ "Hủy" và Nút đỏ nguy hiểm: "Xác nhận Ẩn/Xóa".
- Sau khi bấm xác nhận: Gọi API kiểm duyệt $\rightarrow$ Ẩn nội dung ngay lập tức trên UI và bắn Toast thông báo.

---

## 4. DANH MỤC SHADCN/UI COMPONENTS SỬ DỤNG

| Component                                 | Mục đích sử dụng                                      |
| :---------------------------------------- | :---------------------------------------------------- |
| `Card`, `CardHeader`, `CardContent`       | Khung hiển thị các bài viết trên Feed                 |
| `Dialog`, `DialogContent`, `DialogHeader` | Modal tạo bài viết thảo luận mới                      |
| `AlertDialog`, `AlertDialogAction`        | Hộp thoại xác nhận Ẩn / Xóa dành riêng cho Admin      |
| `DropdownMenu`, `DropdownMenuItem`        | Menu tùy chọn 3 chấm kiểm duyệt của Admin             |
| `Badge`                                   | Đánh dấu Role của tác giả và nhãn Chuyên mục bài viết |
| `Avatar`, `AvatarImage`, `AvatarFallback` | Ảnh đại diện của người đăng bài và người bình luận    |
| `Textarea`, `Input`                       | Ô nhập nội dung bài viết và bình luận                 |
| `Button`                                  | Nút "Đăng bài", "Gửi bình luận", "Trả lời"            |

---

## 5. ĐIỀU KIỆN ẨN/HIỆN GIAO DIỆN KIỂM DUYỆT (ROLE GUARD LOGIC)

```tsx
// Logic hiển thị nút kiểm duyệt trên React Component
{
  currentUser?.role === "ADMIN" && (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleModerate("HIDE")}>
          Ẩn bài viết
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleModerate("DELETE")}
          className="text-red-600"
        >
          Xóa bài viết
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```
