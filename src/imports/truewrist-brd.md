Chào bạn, để bàn giao cho đội ngũ Development (Dev) và Technical Lead, bạn cần một tài liệu **BRD (Business Requirements Document - Tài liệu Yêu cầu Nghiệp vụ)** rõ ràng, phân chia theo từng Module (Phân hệ).

Dưới đây là bản phân tích nghiệp vụ chi tiết để đội Dev có thể hiểu kiến trúc và bắt tay vào thiết kế Database (Cơ sở dữ liệu) cũng như luồng UX/UI.

---

### TỔNG QUAN PHÂN QUYỀN HỆ THỐNG (USER ROLES)

Hệ thống TrueWrist sẽ có 4 nhóm người dùng chính:

1. **Guest (Khách vãng lai):** Vào web xem, thử AR, chưa đăng nhập.
2. **User (Người dùng cuối):** Đăng nhập để lưu lịch sử thử, thông số cổ tay, tự tạo mẫu (UGC).
3. **Vendor/B2B (Cửa hàng/Doanh nghiệp):** Quản lý gian hàng, upload sản phẩm, xem báo cáo, lấy mã nhúng (embed code).
4. **Super Admin (Quản trị viên hệ thống):** Quản lý toàn bộ hệ thống, duyệt mẫu UGC, quản lý tài khoản Vendor.

---

### MODULE 1: FRONT-END (TRANG KHÁCH HÀNG / END-USER PORTAL)

Đây là "mặt tiền" của hệ thống, yêu cầu tốc độ tải trang cực nhanh và UI/UX tối giản.

* **1.1. Trang chủ (Home Page):**
* Banner giới thiệu (Call-to-action mở thẳng vào Camera thử AR).
* Danh sách sản phẩm: Hot Trend (thử nhiều nhất), New Arrivals.


* **1.2. Tìm kiếm & Lọc thông minh (Search & Filter):**
* Lọc theo: Thương hiệu, Loại dây (Da/Kim loại/Cao su), Size mặt (36mm - 45mm), Khoảng giá.
* *Tính năng đặc biệt:* Lọc theo size cổ tay (Khách nhập chu vi cổ tay, hệ thống tự filter các mẫu đồng hồ có size phù hợp).


* **1.3. Chi tiết sản phẩm (Product Detail Page):**
* Trình chiếu 3D (3D Viewer): Cho phép dùng ngón tay xoay 360 độ, phóng to/thu nhỏ mô hình ngay trên web.
* Thông tin sản phẩm: Mô tả, thông số kỹ thuật, giá bán.
* **Nút CTA 1: "Try-on AR" (Thử trên tay)** -> Kích hoạt Module 2.
* **Nút CTA 2: "Buy Now" (Mua ngay)** -> Trỏ link Affiliate sang website/Shopee của Vendor.


* **1.4. Quản lý Tài khoản (User Profile):**
* My Wardrobe (Tủ đồ): Lưu các mẫu đã thử, đã thả tim.
* My Wrist: Lưu thông số chu vi cổ tay của cá nhân.
* My Creations: Các mẫu đồng hồ UGC người dùng tự tạo.



---

### MODULE 2: WEB-AR CORE ENGINE (NGHIỆP VỤ LÕI AR)

*Đây là trái tim của TrueWrist. Cần nhấn mạnh với đội Dev phải tối ưu hóa phần này để chạy mượt trên trình duyệt điện thoại (Safari/Chrome).*

* **2.1. Khởi tạo Camera & Phân quyền:**
* Popup xin quyền truy cập Camera/Micro.
* Kiểm tra tính tương thích của thiết bị (Báo lỗi nếu thiết bị quá cũ không hỗ trợ WebGL/WebXR).


* **2.2. Tracking & Occlusion (Nhận diện & Che khuất):**
* Phát hiện bàn tay/cổ tay (Hand Tracking).
* Hiển thị khung căn chỉnh ảo (Guide UI) để khách đặt tay đúng vị trí.
* Xử lý Occlusion: Phần dây đồng hồ nằm ở mặt dưới cổ tay phải bị ẩn đi (không hiển thị xuyên thấu).


* **2.3. PBR Rendering & True-to-size (Hiển thị & Kích thước):**
* Render vật liệu: Kính trong suốt có phản quang, kim loại bóng, dây da nhám.
* Tự động scale (phóng to/thu nhỏ) mô hình 3D dựa trên thuật toán ước lượng độ sâu để đảm bảo tỷ lệ 1:1.


* **2.4. Tương tác trong môi trường AR:**
* Vuốt trái/phải trên màn hình để đổi nhanh sang mẫu đồng hồ khác mà không cần tắt Camera.
* Nút "Chụp ảnh/Quay video" -> Lưu thẳng vào thư viện ảnh của điện thoại hoặc Share lên MXH.



---

### MODULE 3: CREATOR STUDIO (NGHIỆP VỤ SÁNG TẠO - UGC)

*Cho phép User tự thiết kế mẫu.*

* **3.1. Upload Ảnh 2D:**
* Cho phép người dùng tải lên ảnh mặt đồng hồ (Dial).
* Tích hợp công cụ "Cắt khung tròn/vuông" cơ bản.


* **3.2. Cấu hình 3D (3D Configurator):**
* Chọn "Vỏ đồng hồ" (Case Template) từ thư viện có sẵn do Admin cung cấp.
* Chọn "Dây đeo" (Strap Template) từ thư viện.
* Hệ thống tự động map bức ảnh 2D dán lên mặt số của khối 3D.


* **3.3. Xem trước & Gửi duyệt:**
* Preview khối 3D vừa tạo.
* Nhập tên, mô tả -> Bấm "Publish" (Gửi cho Admin duyệt để tránh vi phạm bản quyền/hình ảnh phản cảm).



---

### MODULE 4: VENDOR PORTAL (HỆ THỐNG B2B CHO CỬA HÀNG)

*Giao diện dành cho các đối tác trả phí.*

* **4.1. Dashboard (Báo cáo Thống kê):**
* Tổng lượt mở AR (AR Try-on views).
* Lượt Click chuyển đổi (Click to Buy).
* Sản phẩm nào đang được thử nhiều nhất (Top Products).


* **4.2. Quản lý Sản phẩm (PIM):**
* Thêm/Sửa/Xóa sản phẩm.
* Upload mô hình 3D (Dev cần quy định rõ định dạng: chỉ nhận file `.glb` hoặc `.gltf`, dung lượng < 5MB/file để đảm bảo tốc độ).
* Nhập đường link Affiliate mua hàng.


* **4.3. Công cụ Nhúng (Embed/Integration Hub):**
* Hệ thống tự động sinh (generate) một đoạn mã HTML dạng `<iframe src="...">` hoặc `<script>`.
* Vendor copy đoạn mã này dán vào website (WordPress, Shopify, Haravan...) của họ để hiện nút "Thử 3D bằng TrueWrist".



---

### MODULE 5: SUPER ADMIN (QUẢN TRỊ VIÊN)

* **5.1. Quản lý Nội dung (CMS):** Cấu hình banner, danh mục, bài viết chuẩn SEO.
* **Quản lý Thư viện 3D (Templates):** Upload sẵn các khung vỏ/dây để phục vụ cho Module Creator Studio.


* **5.2. Quản lý Người dùng & Vendor:** Kích hoạt tài khoản, khóa tài khoản, nâng cấp gói SaaS cho Vendor (Starter/Pro).
* **5.3. Kiểm duyệt (Moderation):** Duyệt các mẫu do người dùng tạo (Approve/Reject).

---

### GỢI Ý YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL) ĐỂ BÀN GIAO CHO DEV:

*(Bạn hãy copy nguyên phần này gửi cho Tech Lead/CTO của bạn, họ sẽ rất thích)*

1. **Tech Stack đề xuất:**
* **Frontend:** ReactJS hoặc Next.js (tốt cho SEO).
* **3D/AR Engine:** Three.js + MindAR (hoặc 8th Wall nếu ngân sách lớn).
* **Backend:** Node.js hoặc Python (Python tốt hơn cho các tác vụ AI xử lý hình ảnh).
* **Database:** PostgreSQL (dữ liệu User/Vendor) + AWS S3/Google Cloud Storage (để lưu file mô hình 3D siêu nhẹ).


2. **Performance (Hiệu năng):**
* Mô hình 3D phải được nén bằng Draco Compression, dung lượng tối đa một mẫu đồng hồ không vượt quá **3MB - 5MB** để load dưới 3 giây trên mạng 4G.
* FPS (Khung hình/giây) khi mở AR phải đạt tối thiểu **30 FPS** để không gây chóng mặt.


3. **Cross-platform:** Hoạt động ổn định trên Safari (iOS 14+) và Chrome (Android 10+).

---

**💡 Lời khuyên cho bước tiếp theo:**
Tài liệu trên là kiến trúc tổng thể (Epic). Để đội Dev có thể code được, họ sẽ cần chia nhỏ tài liệu này thành các màn hình (Wireframes). Bạn có muốn tôi giúp bạn lên **Sơ đồ trang (Sitemap)** hoặc danh sách chi tiết các **Luồng thao tác màn hình (User Flow)** để bạn vẽ UI/UX trên Figma không?