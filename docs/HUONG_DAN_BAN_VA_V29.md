# ExamLab V29 — Nâng cấp Bạn bè và nhắn tin

## Cập nhật

Đây là bản vá tích lũy trên V27/V28, không phải full source. Các file sửa tài khoản, sáng/tối và ghi chú của V28 được kèm sẵn để không thiếu phụ thuộc. Dựa trên mã nguồn ExamLab-Main `08bb6fe8f97329dc8968919d5cd415a19df5f9f9` và bản vá V28 đã gửi.

1. Giải nén `ExamLab_V29_Ban_Va_Ban_Be.zip`, upload các file/thư mục bên trong lên gốc repo ExamLab-Main, ghi đè đúng đường dẫn. Không xóa các file khác, không upload nguyên ZIP lên repo.
2. Trong Supabase → SQL Editor: nếu chưa cài ghi chú/chia sẻ V28, chạy `docs/SETUP_FRIENDS_WORKSPACE_V28.sql` trước. Nếu đã chạy thành công rồi thì bỏ qua bước này.
3. Chạy `docs/SETUP_FRIEND_CHAT_V29.sql`. Script yêu cầu Friends Beta hiện có và có thể chạy lại; không xóa bảng hay dữ liệu cũ.
4. Đợi GitHub Pages triển khai xong, nhấn Ctrl+F5. Vào **Bạn bè → Tin nhắn**.

Không đổi `supabase-config.js`, không tải lại đề/tài liệu, không cài thêm thư viện frontend. Bản vá chưa được đẩy trực tiếp lên GitHub và SQL chưa được chạy trên Supabase thật của bạn.

## Tính năng mới

- **Trò chuyện riêng 1–1** giữa những người đang là bạn bè, tối đa 3.000 ký tự/tin.
- **Chưa đọc / Đã gửi / Đã đọc.** Đã đọc là khi người nhận chủ động bấm nút đánh dấu các tin đã tải, không suy đoán từ việc mở trang.
- **Thu hồi tin của mình:** xóa nội dung gốc trên máy chủ, để lại dòng “Tin nhắn đã được thu hồi”. Không thể xóa nội dung người nhận đã sao chép/chụp lại.
- **Ghim bạn thường liên hệ**, tìm theo tên, ưu tiên cuộc trò chuyện chưa đọc. Ghim lưu theo tài khoản trên thiết bị đang dùng.
- **Giữ nháp khi đổi người trò chuyện** trong cùng lần mở trang. Không lưu nội dung nháp vào localStorage; nháp mất khi tải lại/đóng trang/đăng xuất.
- **Chuyển nhanh sang chia sẻ tài liệu/ghi chú** cho người đang chat hoặc gửi lời thách đấu bằng chức năng Beta có sẵn.
- **Tải tin cũ theo từng 40 tin**; tự cập nhật 30 giây khi trang đang hiển thị. Khi đang xem tin cũ, bấm Làm mới để về tin mới nhất. Chưa có thông báo đẩy hoặc trạng thái online.
- Enter để gửi, Shift+Enter xuống dòng; không gửi giữa lúc đang ghép ký tự bằng bộ gõ.
- Máy chủ giới hạn 10 tin/phút/tài khoản; dùng mã gửi để thử lại sau lỗi mạng mà không tạo tin trùng.

Đây là chat văn bản; chia sẻ tài liệu tiếp tục dùng chức năng đường dẫn/tài liệu công khai của V28. Không tải file nhị phân trực tiếp vào cuộc trò chuyện.

## Quyền dữ liệu

Bảng `examlab_friend_messages` bật RLS và không cấp đọc/ghi trực tiếp cho trình duyệt. Các RPC xác minh tài khoản, quan hệ bạn bè và quyền của từng thao tác. Người ngoài không đọc được cuộc trò chuyện; chỉ người nhận đánh dấu đã đọc và người gửi thu hồi. Khi hủy kết bạn, không mở/gửi tin trong cuộc trò chuyện đó nữa; lịch sử được giữ trên máy chủ, xuất hiện lại nếu kết bạn lại.

Tin nhắn được lưu trên Supabase của chủ website; tính năng này **không mã hóa đầu cuối**. Không có thao tác gửi tin thực tế cho người dùng trong quá trình phát triển/kiểm thử.

## Kiểm thử

- 5/5 vòng frontend trong jsdom: tìm/ghim bạn, gửi và thử lại không trùng, hiển thị nội dung HTML dưới dạng văn bản, giữ nháp khi đổi bạn hoặc lỗi mạng, chưa đọc/đã đọc/thu hồi, nút chia sẻ/thách đấu, phản hồi tải về sai thứ tự, hủy kết bạn và đăng xuất.
- 5/5 vòng PostgreSQL cục bộ (PGlite): quyền tài khoản/người ngoài/ẩn danh, chặn đọc bảng trực tiếp, từ chối gửi cho người chưa kết bạn, gửi lại cùng mã không nhân đôi, không cho sửa nội dung của mã đã dùng, giới hạn độ dài/tốc độ, quyền đọc/thu hồi và phân trang khi nhiều tin cùng thời điểm. Migration chạy lại thành công.
- Chạy lại 5/5 vòng kiểm tra logic V28 và 5/5 vòng kiểm tra CSS hai theme trên 9 trang.
- JavaScript qua kiểm tra cú pháp; ZIP qua kiểm tra tính toàn vẹn.

Giới hạn: frontend và hàm quan hệ bạn bè dùng dữ liệu kiểm thử; chưa chạy tích hợp với Supabase/tài khoản thật. Kiểm tra CSS không thay thế kiểm tra bố cục pixel trên điện thoại/trình duyệt thật. Không khẳng định đã kiểm thử mọi tính năng cũ của toàn website.
