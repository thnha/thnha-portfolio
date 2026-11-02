# Portfolio content — Tran Hoang Nha

Nguồn nội dung cho portfolio. Phần đã điền lấy từ CV (`Tran_Hoang_Nha_CV.pdf`).
Chỗ `TODO` là thông tin cần bổ sung. Ghi tiếng Việt cũng được, mình sẽ viết lại sang tiếng Anh.

Mục tiêu: người tuyển dụng đọc trong **30 giây** phải trả lời được:
1. Người này làm được gì? (Capabilities)
2. Bằng chứng ở đâu? (Projects / apps thật, link store, số liệu)
3. Đã làm bao lâu, ở mức nào? (Experience, scope, team size, ownership)

---

## 1. Thông tin chung

- Tên hiển thị: Tran Hoang Nha (Nha Tran)
- Chức danh: Senior React Native Engineer
- Kinh nghiệm: 14+ năm phát triển phần mềm, 6+ năm React Native production
- Địa điểm: Ho Chi Minh City · Open to remote / hybrid · Available immediately
- Email: thediffest@gmail.com
- LinkedIn: linkedin.com/in/nhatran1990
- GitHub: github.com/thnha
- Số điện thoại có đưa lên web không? TODO (mặc định: không)
- Link tải CV PDF trên web: TODO (có / không)
- Vị trí đang tìm: TODO (Senior / Lead / Staff? product company / outsource? thị trường nào?)

## 2. Capabilities: "những gì tôi làm được"

Mỗi capability cần **1 bằng chứng cụ thể** (dự án + kết quả). Có số liệu thì tốt nhất.

| # | Capability | Bằng chứng từ CV | Số liệu / chi tiết cần bổ sung |
|---|---|---|---|
| 1 | Multi-app ecosystem architecture | 5 app NailSoft dùng chung codebase / module | TODO: monorepo? bao nhiêu % code dùng chung? cấu trúc package? |
| 2 | Native modules & hardware | Swift/Kotlin: Dejavoo, Star Micronics, Sunmi qua BLE/USB/Wi-Fi, chung một JS API | TODO: số model thiết bị hỗ trợ, số salon dùng thực tế, lỗi khó nhất |
| 3 | Payments | Clover, Dejavoo, PAX, Sunmi, Tap to Pay | TODO: cái nào đã chạy production? luồng refund/tip/split? |
| 4 | New Architecture migration | 2 app chuyển sang Fabric + TurboModules, viết lại bridge modules | TODO: RN version từ → tới, thời gian, có crash/regression gì? |
| 5 | Performance | Profile startup, list rendering, re-render trên 5 app | TODO: số trước/sau (startup, FPS, crash-free %) |
| 6 | Offline-first & sync | Có trong CV skills | TODO: app nào? cách xử lý conflict? (Couchbase?) |
| 7 | Real-time multi-app sync | Jollibee: GraphQL + push đồng bộ order giữa Consumer / Driver / Merchant | TODO: số đơn/ngày, số user, rating store |
| 8 | Release ownership | Plan → build → release App Store / Google Play, Fastlane | TODO: tần suất release, CI/CD dùng gì, có OTA (CodePush/EAS) không? |
| 9 | Full-stack | Node.js, .NET, GraphQL, Socket.IO, SignalR, Postgres, Mongo | TODO: có làm backend ở NailSoft không? |

## Số liệu (điền dần khi có)

Nguyên tắc: chỉ đưa lên web số **đã xác nhận** (cột "Đã xác nhận" = ✅).
Ô "Giá trị" còn trống thì trang tự ẩn, không hiện chỗ trống.

| Số liệu | Giá trị | Nguồn | Đã xác nhận |
|---|---|---|---|
| Năm làm phần mềm | 14+ | CV | ✅ |
| Năm React Native production | 6+ | CV | ✅ |
| Số app đã ship | 8 (NailSoft 5 + Jollibee 3) | CV | ✅ |
| Team NailSoft | ~20 người | CV | ✅ |
| App migrate sang New Architecture | 2 | CV | ✅ |
| Hãng thiết bị / giao thức kết nối | 3 / 3 (BLE, USB, Wi-Fi) | CV | ✅ |
| Rating App Store / Google Play (từng app) | | trang store | |
| Lượt tải / người dùng | | App Store Connect / Play Console | |
| Số salon đang dùng | | admin dashboard / PM | |
| Crash-free sessions % | | Crashlytics / Sentry / Play vitals | |
| Startup time trước → sau tối ưu | | profiling, PR, ticket | |
| Số đơn Jollibee / ngày | | PM / dashboard | |

Khi có số mới: thêm vào bảng trên, rồi gửi mình hoặc tự sửa `metrics` trong
`docs/preview/pocket-universe.html` (sau này là `app/data/projects.ts`).

## 3. Apps & projects (mỗi app một "hành tinh" trên hero + một case study)

Với mỗi app, điền theo mẫu. Ảnh: 3–6 screenshot dọc (PNG, ≥1170px chiều cao) hoặc video 10–20s quay màn hình.

### Mẫu

```
Tên app:
Công ty / thời gian:
Link App Store / Google Play:
Dành cho ai, giải quyết việc gì (1–2 câu):
Vai trò của tôi (làm toàn bộ / phụ trách phần nào / team mấy người):
Tính năng chính tôi làm (3–5 gạch đầu dòng):
Bài toán kỹ thuật khó nhất + cách giải:
Kết quả (số user, salon, đơn hàng, rating, crash-free, performance…):
Tech stack:
Màu nhận diện app (hex, nếu có):
Ảnh / video: (đường dẫn file)
NDA: được show ảnh thật không? cần làm mờ dữ liệu không?
```

### Thông tin công khai từ nailsoft.com/smart-pos (đọc ngày 02/11/2026)

Trang không có số liệu nào về app (người dùng, số salon, rating…). Con số duy nhất trên trang chủ,
"Increase income $30,000 – $80,000 in 6 months", là của dịch vụ Marketing 360, không liên quan
tới phần mobile nên **không dùng**.

Mô tả sản phẩm dùng được làm phần "bối cảnh":
- **Smart POS:** hệ thống all-in-one gồm tablet POS, terminal thanh toán, máy in và kiosk check-in.
- **SalonSoft:** POS bỏ túi cho chủ salon. Xem doanh thu, lịch hẹn, chấm công nhân viên 24/7 trên điện
  thoại. Nhân viên xem được việc và thu nhập của mình nếu được cấp quyền.
- **Booked By NailSoft:** app cho khách. Đặt lịch, thanh toán, mua gift card, nhận ưu đãi, tìm salon gần đó.
- **Check-in:** khách chọn dịch vụ trước và biết khi nào tới lượt.
- Văn phòng: Duluth GA, Las Vegas NV, Tempe AZ (thị trường Mỹ).

Ảnh trên trang (wp-content/uploads), **chưa tải về**:
| Ảnh | Kích thước | Nội dung | Dùng được? |
|---|---|---|---|
| 2024/03/nailsoft-pos.png | 1395×946 | Tablet POS, màn lịch hẹn theo thợ | Tốt, đủ nét |
| 2024/03/mkt-pos-nailsoft.png | 1217×851 | Tablet POS, màn Promotions / SMS | Tốt |
| 2024/01/check-in.png | 883×611 | Kiosk check-in trên giá đỡ | Được |
| 2024/10/Smart-pos-white.png | 1629×803 | Sơ đồ hệ sinh thái phần cứng | Hợp làm minh họa hardware |
| 2024/01/Asset-4.png | 757×690 | Người cầm điện thoại, màn đặt lịch | Ảnh marketing, không phải screenshot |
| 2024/01/phone-nailsoft-*.png | ~220×467 | Màn hình Booked By | Quá nhỏ, mờ trên màn hình retina |

Lưu ý: đây là tài sản của NailSoft. Nên hỏi công ty trước khi dùng, hoặc tự chụp screenshot app
(App Store / Google Play cũng có ảnh độ phân giải cao).

TODO, cần bạn xác nhận: app tablet POS (màn lịch hẹn, checkout) là **Merchant** đúng không?

### Đã biết từ CV (cần bổ sung theo mẫu trên)

**NailSoft (Levinci Group, 03/2021 – 06/2026):** SaaS POS & booking cho nail salon ở Mỹ, team ~20 người
- Merchant: TODO
- SalonSoft: TODO
- Booked By: TODO
- Check-in: TODO
- Retailer: TODO
- Native hardware/payment layer (dùng chung): TODO

**Jollibee Vietnam (Levinci Group, 2020 – 2021)**
- Jollibee Consumer: maps / address search, chat real-time, voucher, đặt và theo dõi đơn. TODO
- Jollibee Driver: TODO
- Jollibee Merchant: TODO

**Trước 2020** (chỉ hiện ở timeline, không làm case study, trừ khi bạn muốn)
- Spa Diva: React Native + Node.js (2018–2020)
- Battle for Rolephia: Unity / C# (2018–2020)
- News reader app: React Native (Creants, 2015–2018)
- MU OF HEROES backend: Java / Spring (2015–2018)
- Ola: iOS Objective-C (Microgame, 2012–2015)

### Side projects (phần "Lab" trên trang)

Không bị NDA nên đây là nơi khoe được ảnh, video và số liệu thoải mái nhất.

Điền cho mỗi dự án:
```
Tên:
Loại: game / app
Trạng thái: live / AI-assisted / đang phát triển
Là gì, cho ai (1–2 câu):
Stack / engine:
Công cụ AI dùng (nếu có):
Phần tôi tự quyết / tự làm (gameplay, kiến trúc, UI, backend, release…):
Số liệu (lượt tải, rating, DAU, doanh thu, thời gian từ ý tưởng tới chơi được…):
Link (store / web / TestFlight / video demo):
Ảnh / video:
```

1. **Game đang chạy (live):** TODO
2. **Game làm bằng AI:** TODO
3. **App làm bằng AI, chưa release:** TODO (có TestFlight, APK hoặc video demo không?)

## 4. How I build (quy trình / cách làm việc)

Trả lời ngắn mỗi ý (1–3 câu, có ví dụ thật càng tốt):
- Khi nhận một tính năng mới, bạn bắt đầu thế nào? TODO
- Bạn tổ chức code nhiều app dùng chung ra sao? TODO
- Testing: test gì, bằng gì, coverage? TODO
- Theo dõi production: Sentry / Crashlytics / Pendo? TODO
- Làm việc với product / backend / QA: TODO
- Có mentor / review code cho người khác không? TODO

## 5. Điểm nhấn: cần bạn cung cấp

- **Ảnh chân dung:** vuông, ≥400px, nền gọn. Gán vào `profile.photo`. TODO
- **Giới thiệu 2 câu** (thẻ recruiter): viết lại `profile.intro` bằng giọng của bạn. TODO
- **Video màn hình** cho từng app: dọc, 5–10s, mp4/webm, < 3MB. Gán vào `video` của app. TODO
- **Open source:** repo đã có hoặc sẽ tách ra (vd. wrapper máy in, không vi phạm NDA). Cần
  tên, mô tả, link; số star tự cập nhật sau. TODO
- **Hardware Lab:** demo giả lập. Kiểm tra lại các bước trong log có đúng với cách bạn đã làm
  (tên module, cách retry khi rớt kết nối). TODO
- **Lighthouse:** chạy trên trang thật sau khi deploy, rồi thay số mẫu 98. TODO

## 6. Khác

- Testimonial / lời nhận xét từ sếp hoặc đồng nghiệp (kèm tên + chức danh, được phép công khai): TODO
- Chứng chỉ, giải thưởng, talk, bài viết: TODO
- Ngôn ngữ: English: working proficiency (reading, writing, text-based)
- Học vấn: University of Science, VNU-HCM · B.Sc. IT · 2008–2012
