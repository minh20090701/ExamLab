# ExamLab V50.1 — Sửa màu chữ toàn site

Bản cộng dồn V50 + V50.1, áp dụng trên V49.1 hoặc V50.
- Giữ 20 chủ đề toàn site do admin đặt; bỏ chọn giao diện cá nhân.
- Sửa nền/chữ/icon của thanh điều hướng, nút sáng/tối, cài đặt, tài khoản.
- Thanh thông báo hiển thị ngay, chỉ cuộn khi văn bản dài hơn vùng chứa.
- Tăng độ tương phản các bảng màu, giữ dữ liệu Supabase và nội dung thông báo.

Nếu chưa chạy SQL V50, chạy docs/SETUP_GLOBAL_THEMES_V50.sql một lần. Nếu đã chạy thành công, không cần chạy lại.

Kiểm tra: Node syntax cho 3 JS bản vá; Chromium kiểm tra tương phản tĩnh 9 trang x 20 chủ đề x 2 chế độ, desktop 1366px/mobile 390px; chi tiết trong docs/CONTRAST_TEST_V501.json. Không phải kiểm thử đăng nhập, dữ liệu Supabase thật hay toàn bộ tương tác.
