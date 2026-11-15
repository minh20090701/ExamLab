# ExamLab V50 — 20 chủ đề chung, không còn giao diện cá nhân

Cơ sở: V49.1 Clean, commit 1a5ce6002b8be8f181d410b6e5cb7de56be35db5.

1. Supabase → SQL Editor → chạy `docs/SETUP_GLOBAL_THEMES_V50.sql` một lần trên dự án hiện tại (đã có V32). Giữ nguyên dữ liệu, quyền admin, revision và nhạc cũ.
2. Upload ZIP bản vá vào gốc Codespaces, giải nén ghi đè rồi commit/push. Không thay `supabase-config.js` hoặc tài nguyên ảnh.
3. Netlify deploy. Ctrl+F5. Admin mở Hồ sơ hoặc Quản trị, chọn 1/20 chủ đề → Xem thử → Áp dụng cho toàn website. Thành viên chỉ có sáng/tối và điều khiển nhạc.

13 chủ đề mới dùng nhạc tắt khi chọn Auto (không có MP3 tương ứng); chọn một trong 6 bản nhạc cũ hoặc upload nhạc chung. Các file preference V49 cũ trong Supabase/localStorage được giữ nhưng không còn đọc/ghi. Không cần xóa bảng.

Cập nhật trang web đang mở trong khoảng 60 giây hoặc khi mở lại. Thanh thông báo giữ nguyên nội dung quản trị. 8 trang có thanh thông báo; trang reset vốn không có.
