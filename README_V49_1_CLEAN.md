# ExamLab V49.1 Clean — Full Source

Đây là bộ mã nguồn đầy đủ, ghép từ repository V41 và bản nâng cấp tích lũy V49.1. Không cần cài thêm các bản vá V42–V49.1.

## Cài đặt / nâng cấp
1. Sao lưu repository hiện tại (commit hoặc tạo nhánh backup) và giữ nguyên project Supabase đang sử dụng.
2. Giải nén ZIP. Trong GitHub Desktop, mở repository ExamLab-Main đã clone. Thay nội dung source của repo bằng bộ full source này; giữ nguyên thư mục `.git` và mọi cấu hình triển khai riêng của bạn (ví dụ `.env`, `netlify.toml` nếu đã tự tạo). Nếu có tùy chỉnh riêng chưa nằm trong source V41, so sánh và giữ lại trước khi thay thế.
3. Đảm bảo `index.html`, `css/`, `js/`, `assets/` nằm ngay thư mục gốc repo, không bị lồng thêm một thư mục ngoài. Commit và Push origin. Nếu Netlify đã liên kết đúng repository và branch, Netlify sẽ triển khai tự động. Nếu triển khai mới, chọn thư mục publish là thư mục gốc (`.`), không cần build command.
4. Mở website, Ctrl+F5. Kiểm tra đăng nhập, quản lý đề, làm bài, hồ sơ, kho giao diện và trang tài liệu. Cần dùng đúng tên miền đã cấu hình redirect trong Supabase nếu sử dụng đăng nhập hoặc đặt lại mật khẩu.

## Supabase
- Giữ nguyên `supabase-config.js` của source gốc (URL và publishable key). Không đưa service_role key, secret key hoặc mật khẩu database vào mã frontend.
- Không cần chạy lại các SQL cũ trên project đang hoạt động. Bản này không thay đổi schema các bảng hiện có.
- Muốn đồng bộ tùy chọn giao diện cá nhân qua tài khoản, chạy `docs/SETUP_THEME_PREFERENCES_V49.sql` một lần nếu chưa cài. Nếu không chạy, kho 20 chủ đề vẫn hoạt động với localStorage.
- Bản ZIP là source web, không phải bản sao dữ liệu database và không phải APK.

## Tinh gọn
- Gộp 6 stylesheet thành 3 file: `home-art-v491.css`, `theme-decor-v491.css`, `theme-store-v491.css`; duy trì thứ tự CSS cần thiết. Nạp kho giao diện bằng script rõ ràng ở 9 trang chính; bỏ cơ chế nạp lặp CSS/script từ theme-v28.js.
- Loại 3 bộ CSS/JS phiếu trả lời V25 cũ không được trang hiện tại dùng; giữ V25.4 đang hoạt động.
- Dùng một bản JSZip, chỉnh liên kết ở công cụ bảo trì cũ.
- Loại 133 SVG giống hệt nhau; cập nhật đường dẫn và giữ đầy đủ 40 preview sáng/tối.
- Giữ các module nghiệp vụ, nhạc, GIF, SQL, và tài liệu cũ. Các tài liệu hướng dẫn V16–V49 là lịch sử; nếu khác với hướng dẫn này, ưu tiên README này.

## Kiểm tra
- Kiểm tra cú pháp 42 file JS; parse XML 1.577 file SVG; kiểm tra tham chiếu nội bộ của 9 trang chính và CSS; xác nhận các ảnh preview tồn tại.
- Smoke test Chromium trên trang chủ: kho 20 chủ đề, áp dụng Mưa đêm tối và trở về giao diện chung bằng mã thật với Supabase giả lập.
- Chưa xác nhận đầy đủ runtime trên 8 trang còn lại do môi trường Chromium bị timeout. Chưa kiểm thử trên Netlify/Supabase thật hay APK. Các báo cáo test của V49/V49.1 là kết quả trước lần tinh gọn này.
- Chi tiết file loại bỏ và đường dẫn thay thế: `docs/CLEANUP_V49_1.json`.
