# ExamLab V50.3 — Banner phủ kín và thông báo trôi

Áp dụng lên V50.2 (commit 35af4f0). Không cần SQL mới. Giữ nguyên admin.js, các chức năng tài khoản/đề thi, 20 chủ đề chung và cài đặt sáng/tối.

- Ảnh phong cảnh phủ toàn bộ banner Giao diện chung trên desktop/mobile (cover, không kéo méo); chữ nằm trên khung nền theo theme. Mobile dành vùng ảnh riêng phía trên nội dung; không ép ảnh vào cột nhỏ. Không chồng thêm ribbon/ảnh GIF cũ lên banner; trang trí góc và hiệu ứng vẫn giữ nguyên.
- Thông báo: 1 dòng từ phải sang trái, lặp lại; không nhân bản chữ, không có nút dừng, không dừng khi hover. Giữ dữ liệu admin và tôn trọng cài đặt giảm chuyển động của hệ điều hành.
- Nạp lại cache các file sửa trên 9 trang.

Upload ZIP vào gốc Codespaces, chạy: `unzip -o ExamLab_V50_3_Full_Patch.zip && rm ExamLab_V50_3_Full_Patch.zip && git add -A && git commit -m "Fix V50.3 banner and announcement" && git push origin main`.
