# ExamLab V50.2 — Màu chủ đề & thông báo chạy liên tục

Bản vá trên V50.1 Admin Merged (commit dd23cc9). Không thay mã xử lý đề thi, admin, Supabase hay ảnh.
- 40 bảng màu sáng/tối, nền đọc rõ, header đồng nhất, nút chọn có tương phản.
- Trang chủ không còn ảnh chìm sau chữ, tranh thư phòng giữ riêng ở khung phải.
- Thông báo chạy liền mạch; nội dung do admin đặt giữ nguyên (kể cả chỉ có emoji). Có nút tạm dừng, hỗ trợ reduced motion.
- Cả 9 trang đổi cache version 50.2. Không cần SQL mới; nếu chưa cài SQL V50 thì vẫn cần chạy bản V50.

Giải nén đè vào root repo ExamLab, commit và push main. Đợi Pages triển khai rồi Ctrl+F5.

Kiểm thử: 720 cấu hình HTML/CSS tĩnh Chromium, 40 bảng màu, ticker chạy/dừng. Không chạy Supabase thật. Chi tiết docs/BROWSER_TEST_V502.json.
