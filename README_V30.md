# ExamLab V30 — Full source · Bạn bè & Chuỗi học

Bản này chứa **toàn bộ mã nguồn website**, gồm các sửa lỗi V28, nhắn tin V29 và chuỗi học V30. Không cần chép lần lượt các ZIP bản vá cũ. Mã nguồn nền: `minh20090701/ExamLab-Main`, commit `08bb6fe8f97329dc8968919d5cd415a19df5f9f9`.

## Cài lên ExamLab đang dùng

1. Giải nén ZIP. Upload **các file/thư mục bên trong `ExamLab-Main-V30`** vào gốc repo `ExamLab-Main`, ghi đè đúng đường dẫn. `index.html` phải ở gốc repo, không nằm thêm trong một thư mục V30. Không upload nguyên ZIP lên GitHub Pages.
2. Giữ cấu hình Supabase của website đang dùng trong `supabase-config.js` nếu bạn đã thay đổi nó sau bản trên GitHub. Bản full source này dùng hệ thống Supabase hiện có; không chứa bản sao tài khoản, tin nhắn, đề, tài liệu hay dữ liệu cá nhân trên máy chủ.
3. Vào **Supabase → SQL Editor** của đúng dự án, chạy theo thứ tự:
   - Chưa cài ghi chú/chia sẻ V28: `docs/SETUP_FRIENDS_WORKSPACE_V28.sql`.
   - Chưa cài nhắn tin V29: `docs/SETUP_FRIEND_CHAT_V29.sql`.
   - Nếu Bấm giờ đang báo thiếu bảng đồng bộ: `docs/SETUP_STUDY_SYNC_V15.sql`. File này chỉ tạo bảng khi chưa tồn tại, giữ nguyên bảng/chính sách cũ nếu đã có.
   - **Cài chuỗi học:** `docs/SETUP_STREAK_V30.sql`.
4. Đợi GitHub Pages triển khai xong, nhấn **Ctrl+F5**. Vào **Bạn bè → 🔥 Chuỗi học**. Trang Bấm giờ cũng có thẻ tiến độ chuỗi cá nhân.
5. Muốn chuỗi chung: hai tài khoản đã kết bạn đều bật **Cho bạn bè xem chuỗi và tham gia chuỗi chung**, rồi học và đồng bộ đủ mục tiêu trong ngày.

Các SQL trên có thể chạy lại. Không cần xóa bảng hay tải lại dữ liệu. Nếu tạo bảng Bấm giờ sau khi đã cài V30, chạy lại SQL V30 để gắn bộ ghi nhận chuỗi vào bảng mới.

Đây là full source của **website hiện có**, không phải bộ khởi tạo một dự án Supabase trắng. Hệ thống tài khoản, đề thi, tài liệu và Friends Beta ban đầu cần tồn tại trong dự án đang sử dụng. Không chuyển sang dự án Supabase mới chỉ để cài bản này.

## Mới trong V30

- **🔥 Chuỗi học cá nhân:** số ngày hiện tại, kỷ lục, số ngày học trong tuần, tổng số ngày đã đạt mục tiêu.
- **Lịch 28 ngày**, đánh dấu hôm nay và những ngày đã học; mốc thành tích **3 / 7 / 30 / 100 ngày** theo kỷ lục cá nhân.
- **Chuỗi học cùng bạn:** tăng khi cả hai đạt mục tiêu trong cùng ngày, tính từ ngày cả hai bật chia sẻ. Có trạng thái người đã học/người còn mục tiêu.
- **Danh sách bạn theo chuỗi:** ưu tiên chuỗi chung dài, tìm theo tên, lọc cặp đã hoàn thành hoặc còn mục tiêu hôm nay.
- **Rủ học:** mở cuộc trò chuyện và soạn lời rủ; bạn xem rồi tự bấm Gửi. Không gửi tự động, không ghi đè bản nháp đang viết.
- **Chia sẻ tài liệu nhanh** ngay trên thẻ chuỗi của bạn bè, dùng hệ thống chia sẻ ghi chú/đường dẫn hiện có.
- **Tiến độ trên trang Bấm giờ:** cập nhật sau khi đồng bộ thành công; dùng chung dữ liệu giữa các thiết bị đăng nhập.
- Giao diện cùng tông cổ kính, hỗ trợ sáng/tối và bố cục màn hình nhỏ.

Đã kèm V28/V29: hồ sơ/header, đồng bộ theme, ghi chú riêng, chia sẻ tài liệu bằng đường dẫn, chat 1–1, ghim/tìm bạn, tin chưa đọc, đánh dấu đã đọc, thu hồi tin và thách đấu. Chia sẻ tài liệu không phải tải file nhị phân trực tiếp trong chat.

## Cách tính chuỗi

Một ngày được tính khi có một trong hai điều kiện:

- Lưu và đồng bộ **tổng cộng ít nhất 10 phút** Bấm giờ/Pomodoro trong ngày.
- Nộp một bài ở **Tủ đề ôn tập** có **ít nhất 5 câu đã trả lời** và **thời gian làm từ 1 phút**; bài làm phải được lưu lên máy chủ.

Ngày tính theo **Việt Nam, UTC+7**, đổi ngày lúc **00:00**. Một ngày chỉ tăng chuỗi một lần. Một phiên được tính vào ngày lưu/kết thúc; muốn chia thời gian trước/sau nửa đêm, hãy lưu thành hai phiên. Đồng bộ trước 00:00: dữ liệu cũ đẩy lên ngày khác không cộng mới vào chuỗi. Khách chưa đăng nhập chỉ có lịch sử trên máy, chưa có chuỗi trên tài khoản.

Nếu hôm nay chưa học, chuỗi hôm qua vẫn giữ đến cuối ngày. Bỏ trọn một ngày thì chuỗi hiện tại về 0; kỷ lục và mốc thành tích vẫn giữ. Không có nút điểm danh để tăng chuỗi. Mở trang, trò chuyện, bài thi ở khu vực Beta và thách đấu Beta chưa được tính.

Khi cài/rerun SQL, hệ thống nhập lịch sử hợp lệ đã có trên máy chủ trong **365 ngày gần nhất**, chống tính trùng theo mã bản ghi. Từ lúc cài, các thành tích được ghi nhận tiếp tục được giữ. Xóa lịch sử học/bài làm không xóa thành tích đã ghi nhận. Chuỗi phục vụ theo dõi thói quen; thời lượng và câu trả lời lấy từ các bản ghi ứng dụng, không phải cơ chế chống gian lận hay điểm thi chính thức.

## Chia sẻ và quyền riêng tư

- Mặc định chuỗi cá nhân **riêng tư**. Chỉ bạn xem được dữ liệu của mình.
- Khi cả hai bật chia sẻ và vẫn là bạn bè, có thể xem thống kê chuỗi của nhau và chuỗi chung. Không chia sẻ nội dung bài làm, môn học hay nội dung ghi chú qua thẻ chuỗi.
- Tắt chia sẻ ẩn thống kê khỏi bạn bè. Bật lại bắt đầu giai đoạn chuỗi chung mới từ ngày bật lại; chuỗi cá nhân không đổi.
- Hủy kết bạn chặn xem chuỗi của nhau. Nếu kết bạn lại, hệ thống tính giao các ngày đủ điều kiện trong giai đoạn hai người đang cho phép chia sẻ; không duy trì lịch sử từng lần hủy/kết bạn.
- Nút Rủ học chỉ tạo bản nháp. Không gửi email, thông báo đẩy hoặc tin nhắn tự động.
- Bảng chuỗi bật RLS và không cấp đọc/ghi trực tiếp cho trình duyệt. RPC lấy danh tính từ phiên đăng nhập; các hàm nội bộ tính ngày/nhập dữ liệu không cho tài khoản thường gọi.

## Đã kiểm thử

Các bộ sau đã qua **5 vòng mỗi bộ**, bằng dữ liệu thử cục bộ:

| Bộ kiểm thử | Nội dung |
| --- | --- |
| V30 SQL / PostgreSQL (PGlite) | Ngưỡng học/làm bài, cộng nhiều phiên, chống trùng, lịch sử nhập lại, giờ Việt Nam, đứt chuỗi/kỷ lục, chuỗi chung, quyền riêng tư, bật/tắt chia sẻ, hủy kết bạn, người lạ/ẩn danh và chặn truy cập bảng/hàm nội bộ |
| V30 giao diện (jsdom) | Tiến độ, lịch/mốc thành tích, tìm/lọc bạn, biến màu sáng/tối, rủ học chỉ soạn nháp, giữ nháp cũ, chia sẻ tài liệu, lỗi mạng/thử lại, phản hồi cũ sau đăng xuất, thẻ Bấm giờ và khách |
| V29 chat giao diện + SQL | Gửi/thử lại không trùng, nháp, ghim, chưa đọc/đã đọc, thu hồi, phân trang, quyền bạn bè, hủy kết bạn, giới hạn gửi và phản hồi sai thứ tự |
| V28 chức năng + SQL | Hồ sơ/header/theme trên 9 trang, ghi chú, chia sẻ, quyền người nhận, nội dung an toàn, đăng xuất |
| V28 CSS | Hai theme trên 9 trang, màu nền/chữ và ô nhập |

SQL V30 và file tạo bảng Bấm giờ cũng được kiểm tra khả năng chạy lại. JavaScript kiểm tra cú pháp; ZIP kiểm tra tính toàn vẹn và đường dẫn tài nguyên cục bộ của các trang chính.

**Giới hạn kiểm thử:** jsdom không kiểm tra bố cục pixel như trình duyệt thật. Chưa chạy tích hợp với Supabase/tài khoản thật hoặc kiểm thử thủ công trên điện thoại. Không khẳng định đã thử mọi chức năng cũ của toàn website. Source chưa được đẩy lên GitHub và SQL chưa được chạy trên dự án thật của bạn.

## Chạy lại bộ kiểm thử cho người phát triển

Website tĩnh không cần npm để chạy. Chỉ khi muốn chạy các test: dùng Node.js tương thích jsdom 31, chạy `npm install --prefix tests`, rồi `npm test --prefix tests`. Thư mục `tests` không cần upload khi chỉ triển khai website. Các test không kết nối hay thay đổi Supabase thật.

Xem thêm `docs/HUONG_DAN_BAN_VA_V28.md`, `docs/HUONG_DAN_BAN_VA_V29.md` cho chi tiết các chức năng đã tích hợp.
