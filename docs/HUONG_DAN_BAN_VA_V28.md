# Bản vá ExamLab V28 — Hồ sơ, sáng/tối, Bạn bè

Đây là **bản vá**, chỉ chứa các file đã sửa hoặc thêm mới. Áp dụng trên ExamLab-Main đã cập nhật V27 (mã nguồn nền: `08bb6fe8f97329dc8968919d5cd415a19df5f9f9`). Không dùng ZIP này để tạo một website mới từ đầu.

## Cập nhật nhanh

1. Giải nén `ExamLab_V28_Ban_Va.zip`.
2. Mở repo **ExamLab-Main → Add file → Upload files**. Kéo các file và thư mục **bên trong ZIP** vào thư mục gốc repo, giữ nguyên cấu trúc `js/`, `css/`, `friends-beta/`, `docs/`. Ghi đè file trùng tên; không xóa các file khác và không tải nguyên ZIP lên repo.
3. Commit thay đổi, đợi GitHub Pages triển khai xong.
4. Trong Supabase dự án đang dùng → **SQL Editor → New query**, dán toàn bộ `docs/SETUP_FRIENDS_WORKSPACE_V28.sql` rồi **Run** một lần. Cần chức năng Friends Beta cũ đã được cài đặt; script sẽ báo rõ nếu thiếu hàm nền. Script không xóa dữ liệu cũ, có thể chạy lại.
5. Mở web, nhấn **Ctrl + F5**. Trên điện thoại đóng/mở lại trang hoặc xóa bộ nhớ đệm trang nếu vẫn thấy giao diện cũ.

Sửa nút tài khoản và màu giao diện hoạt động ngay sau cập nhật file. Ghi chú và chia sẻ cần hoàn thành bước SQL. Không cần thay `supabase-config.js`, tải lại đề, tải lại tài liệu hoặc cài thêm thư viện trên website.

## Nội dung sửa

- Một bộ xử lý tài khoản dùng chung: hiển thị đúng tên, chữ đại diện, link Hồ sơ/Đăng nhập trên các trang, kể cả đường dẫn lồng `friends-beta/`. Đồng bộ khi đăng nhập, đăng xuất, cập nhật tên và quay lại tab.
- Loại bỏ hai bộ cập nhật nút tài khoản cạnh tranh nhau. Không để kết quả tải phiên cũ ghi đè trạng thái đăng xuất mới.
- Đồng bộ sáng/tối và trạng thái nút; ghi nhớ trên thiết bị và đồng bộ giữa các tab đang mở.
- Sửa nền/chữ trang Bạn bè, tiêu đề, ô nhập, thách đấu, bảng điểm, thành tích và câu hỏi. Trang đặt lại mật khẩu cũng có nút chuyển sáng/tối.
- Phạm vi giao diện: trang chủ, tài liệu, bấm giờ, hồ sơ, đăng nhập, đặt lại mật khẩu, quản lý đề, duyệt tài liệu, Bạn bè. Các tiện ích nâng cấp nguồn cũ như NANG_CAP_V16 không thuộc giao diện vận hành.

## Ghi chú và chia sẻ

Vào **Bạn bè → Góc chia sẻ & ghi chú**:

- **Ghi chú của tôi:** thêm, sửa, tìm, ghim, xóa và tải bản `.txt`; mặc định chỉ chủ tài khoản xem được. Bấm **Lưu riêng tư** để lưu; nội dung chưa lưu chưa được đồng bộ.
- **Chia sẻ mới:** chọn tài liệu/đường dẫn HTTPS hoặc ghi chú, chọn một bạn hoặc tất cả bạn bè hiện tại (tối đa 100), xác nhận rồi gửi.
- **Được chia sẻ:** đọc nội dung nhận, tìm nội dung, lưu bản sao vào sổ ghi chú riêng.
- **Đã gửi:** xem và thu hồi chia sẻ. Thu hồi không xóa bản sao người nhận đã lưu/tải.
- Ghi chú đã gửi là bản chụp tại thời điểm gửi. Sửa ghi chú gốc không tự sửa nội dung người nhận.
- Có **Tìm nhanh tên bạn bè** trong danh sách bạn bè.
- Danh sách tải 30 mục mỗi lượt; dùng **Xem thêm** để tải tiếp. Tìm kiếm áp dụng trên các mục đã tải. Dùng **Làm mới** để cập nhật, chưa có thông báo đẩy hay cập nhật tức thời.

Trong **Thư viện tài liệu**, tài liệu công khai đã được duyệt có nút **Chia sẻ với bạn bè** và **Sao chép liên kết**. Link mở thẳng thông tin tài liệu. Không chia sẻ file riêng tư bằng cách tự đổi quyền; với tài liệu ngoài ExamLab, người nhận vẫn cần quyền tại nơi lưu gốc.

## Quyền dữ liệu

SQL tạo hai bảng mới: `examlab_friend_notes` và `examlab_friend_shares`, bật RLS. Ghi chú chỉ chủ sở hữu được đọc/sửa. Chia sẻ chỉ người gửi và người nhận đang còn kết bạn được đọc. Sau khi hủy kết bạn, người nhận mất quyền đọc bản chia sẻ gốc, nhưng bản sao đã lưu vẫn còn. Chỉ người gửi được thu hồi. Danh sách bạn bè được xác minh bằng hàm `examlab_beta_overview` hiện có.

## Kết quả kiểm thử

Đã chạy và đạt:

- **5/5 vòng** kiểm tra DOM/logic: tài khoản và chuyển theme trên 9 trang; cập nhật tên, đăng xuất, đường dẫn trang lồng, chống phản hồi phiên cũ ghi đè; tạo/sửa/ghim ghi chú; gửi/nhận/thu hồi; lưu bản sao; chặn URL javascript; giữ nội dung đang soạn khi lưu lỗi; liên kết tài liệu công khai.
- **5/5 vòng** kiểm tra CSS trong jsdom: bảng màu sáng/tối, màu nền/chữ ô nhập trên 9 trang, nền và tiêu đề Bạn bè đổi đúng chế độ.
- **5/5 vòng** kiểm tra chính sách SQL trong PostgreSQL cục bộ (PGlite): chủ sở hữu/người nhận/người thứ ba, giả mạo người gửi, gửi cho người chưa kết bạn, cấm sửa bản đã gửi, mất quyền khi hủy kết bạn, thu hồi và tài khoản ẩn danh. Migration chạy lặp hai lần thành công.
- Kiểm tra cú pháp JavaScript và lỗi định dạng diff.

**Giới hạn:** kiểm thử frontend dùng Supabase giả lập; kiểm thử SQL dùng hàm quan hệ bạn bè giả lập cùng dạng dữ liệu với app hiện tại. Chưa chạy SQL trên Supabase thật của Minh, chưa kiểm tra tích hợp với tài khoản thật. Trình duyệt preview bị chặn nên chưa xác nhận bố cục pixel/hiển thị trên thiết bị thật. Không khẳng định đã test mọi chức năng của toàn website 5 lần. Các luồng 2FA, chấm bài, tải file và thách đấu cũ không được kiểm thử end-to-end trong bản vá này.

Bản vá chưa được đẩy lên GitHub; hãy áp dụng các bước cập nhật ở đầu tài liệu.
