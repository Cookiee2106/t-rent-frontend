export const CATEGORIES = [
  { id: 'all', name: 'Tất cả', icon: 'layers' },
  { id: 'camera', name: 'Máy ảnh', icon: 'photo_camera' },
  { id: 'lens', name: 'Ống kính', icon: 'camera_rear' },
  { id: 'video', name: 'Máy quay', icon: 'videocam' },
  { id: 'gimbal', name: 'Gimbal', icon: 'gimbal' },
  { id: 'mic', name: 'Micro', icon: 'mic' },
  { id: 'light', name: 'Đèn quay', icon: 'lightbulb' },
  { id: 'accessory', name: 'Phụ kiện', icon: 'settings_input_component' },
];

export const EQUIPMENTS = [
  {
    id: 'f9b33a08-00a4-4cc4-9ea8-245780a4f5bd', // Real UUID representation for Sony Alpha A7 IV
    name: 'Sony Alpha A7 IV',
    category: 'camera',
    brand: 'Sony',
    pricePerDay: 800000,
    deposit: 5000000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2x-rGysk6oBRGSau_Xn3wReZ2aFj3Nr5QGn4kcyXOuozjk__rnOAmKXRskJCrTaEib5O0fC1K2yHW_eoYUFtzcTgN2w13xDMHVshUEmakVKletLA60hDHc2ur8twtZXKYF6G2dwbGWywjXUvkKVohX-l3Mg7wjZ4RMsK0jWMqgmmKqVcfBhmLQm4Amuo5FvPsrMipC4JzDkMzUn2GSKBNJAvGVv1QojN23RcSVF7dGAKcQO48gFWGMZMlytjYmHuilEpbi_Je8Lo',
    isAvailable: true,
    description: 'Cảm biến Full-frame Exmor R CMOS 33MP, Chip xử lý BIONZ XR, Quay video 4K 60p 10-bit 4:2:2, Hệ thống lấy nét Real-time Eye AF.',
    specs: ['Độ phân giải: 33 Megapixels', 'Cảm biến: Full-frame CMOS', 'Gắn kết ống kính: Sony E-mount', 'Quay phim: 4K 60fps, 10-bit'],
    daily_price: 800000,
    deposit_amount: 5000000,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2x-rGysk6oBRGSau_Xn3wReZ2aFj3Nr5QGn4kcyXOuozjk__rnOAmKXRskJCrTaEib5O0fC1K2yHW_eoYUFtzcTgN2w13xDMHVshUEmakVKletLA60hDHc2ur8twtZXKYF6G2dwbGWywjXUvkKVohX-l3Mg7wjZ4RMsK0jWMqgmmKqVcfBhmLQm4Amuo5FvPsrMipC4JzDkMzUn2GSKBNJAvGVv1QojN23RcSVF7dGAKcQO48gFWGMZMlytjYmHuilEpbi_Je8Lo',
    status: 'ACTIVE',
    category_id: 'e0d79d34-d021-4ea6-bc88-9fc81f7cf530',
    brand_id: 'bca7df79-eef7-47b7-bb08-468dd5cf8da2'
  },
  {
    id: 'a7c93608-aa42-45bb-b3ea-3298ec4110de', // Real UUID for Canon EOS R6 Mark II
    name: 'Canon EOS R6 Mark II',
    category: 'camera',
    brand: 'Canon',
    pricePerDay: 750000,
    deposit: 5000000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHIQ5l6yF8xAzIbVZa-PkSEdy5haA-p4-PK1cQPQxI2cjEXuUiyRqcdRyDI0n26tRe-9BUOX36ZwWhVn25LugCmVCKandL6mD1hAjeVK-vrZSzFn96nkiJJ3ooU3CS6Oc3oVkeVl6DCqoDscWupYESX04h0SX6lDqUUrlXOuSdYEFhxsUU02g-lFhHvJppRCSw6k6eo47hy1C8luyYyS-4Jm4_QEZ1mWHwVX4tPuFm9Qwz4jf8JQD9E0eBTqG47nYIGcB9swVBNG0',
    isAvailable: true,
    description: 'Cảm biến CMOS Full-frame 24.2MP, Dual Pixel CMOS AF II, Chụp liên tiếp 40fps màn trập điện tử, Quay video 4K 60p không crop.',
    specs: ['Độ phân giải: 24.2 Megapixels', 'Cảm biến: Full-frame CMOS', 'Gắn kết ống kính: Canon RF', 'Tốc độ chụp: Lên đến 40fps'],
    daily_price: 750000,
    deposit_amount: 5000000,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHIQ5l6yF8xAzIbVZa-PkSEdy5haA-p4-PK1cQPQxI2cjEXuUiyRqcdRyDI0n26tRe-9BUOX36ZwWhVn25LugCmVCKandL6mD1hAjeVK-vrZSzFn96nkiJJ3ooU3CS6Oc3oVkeVl6DCqoDscWupYESX04h0SX6lDqUUrlXOuSdYEFhxsUU02g-lFhHvJppRCSw6k6eo47hy1C8luyYyS-4Jm4_QEZ1mWHwVX4tPuFm9Qwz4jf8JQD9E0eBTqG47nYIGcB9swVBNG0',
    status: 'ACTIVE',
    category_id: 'e0d79d34-d021-4ea6-bc88-9fc81f7cf530',
    brand_id: 'cce23610-8fa4-46fd-bccb-4fc82fc9fff3'
  },
  {
    id: 'e86ee32d-20da-4541-b66a-11dcdb63fdfd', // Real UUID for DJI RS 3 Pro
    name: 'DJI RS 3 Pro Gimbal',
    category: 'gimbal',
    brand: 'DJI',
    pricePerDay: 400000,
    deposit: 2000000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaKoATUos3N9VEW5qIqC3bkT3EnTTbK0PgDOJgZYvzfS_C4tXYsp7ZxxG0UU4ywCSNvB1OmYepEA-RmyHs_sb-LWBh6qgl3ECUN1xQPTtgFUYwutiT-uHuBe4Jf15bcij6uHqL7xHRFT43YrcVvV6sjCMnm3yZVRxVXrQkN2jkoJuLQei00vcpYGiqDg1aKK0P28SOgPv-hG-HGSPQdV7YVdXxV7CLoi4iRH7kG7FueTcSqkKdMW19veNcvmWVBIPjMJb5MxpnMy4',
    isAvailable: true,
    description: 'Gimbal chống rung chuyên nghiệp cho máy quay lớn, Tải trọng lên đến 4.5kg, Cánh tay trục sợi carbon kéo dài, Công nghệ lấy nét LiDAR.',
    specs: ['Tải trọng tối đa: 4.5kg', 'Trọng lượng: 1.5kg', 'Thời lượng pin: 12 tiếng', 'Kết nối: Bluetooth 5.0'],
    daily_price: 400000,
    deposit_amount: 2000000,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaKoATUos3N9VEW5qIqC3bkT3EnTTbK0PgDOJgZYvzfS_C4tXYsp7ZxxG0UU4ywCSNvB1OmYepEA-RmyHs_sb-LWBh6qgl3ECUN1xQPTtgFUYwutiT-uHuBe4Jf15bcij6uHqL7xHRFT43YrcVvV6sjCMnm3yZVRxVXrQkN2jkoJuLQei00vcpYGiqDg1aKK0P28SOgPv-hG-HGSPQdV7YVdXxV7CLoi4iRH7kG7FueTcSqkKdMW19veNcvmWVBIPjMJb5MxpnMy4',
    status: 'ACTIVE',
    category_id: 'dbca1034-31b2-4d1a-8ccc-4a92cfa7fa90',
    brand_id: 'dca46a08-e042-455b-b9f1-a87f1ea5fc42'
  },
  {
    id: 'bbf2cfb6-15ff-48bb-a63e-9034ff90021e', // Real UUID for Sony FE 50mm f/1.2 GM
    name: 'Sony FE 50mm f/1.2 GM',
    category: 'lens',
    brand: 'Sony',
    pricePerDay: 350000,
    deposit: 3000000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1ZBLo9KyPsIhbQTys-hyfoDrV62_x_US2rwHhxceMVDxwJJGrkbLQkpaSmlH0adFIkZEYlbij0KOLyApzsLix0VOAW-R1Zc687J7knYSV3rTB_OcPJn2GyH-LnrnLL-OyKPUuZ8-YSi3SBygJcKtXmXKmTrkz92LEK_SpNOSAdlt01mtwBTvnSjbnFjDMqkvemDNyl9a2HDms0HRBH7WC8u_J_ejx3uRqUISv4JugbyvJalOhX9n-kQi1CKerPQexusznnApEUKc',
    isAvailable: true,
    description: 'Ống kính một tiêu cự khẩu độ lớn dòng G Master cao cấp, Độ phân giải vượt trội ngay tại khẩu f/1.2, Bokeh mượt mà, Lấy nét cực nhanh với 4 động cơ XD Linear.',
    specs: ['Tiêu cự: 50mm', 'Khẩu độ tối đa: f/1.2', 'Kích thước filter: 72mm', 'Khoảng cách lấy nét tối thiểu: 0.4m'],
    daily_price: 350000,
    deposit_amount: 3000000,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1ZBLo9KyPsIhbQTys-hyfoDrV62_x_US2rwHhxceMVDxwJJGrkbLQkpaSmlH0adFIkZEYlbij0KOLyApzsLix0VOAW-R1Zc687J7knYSV3rTB_OcPJn2GyH-LnrnLL-OyKPUuZ8-YSi3SBygJcKtXmXKmTrkz92LEK_SpNOSAdlt01mtwBTvnSjbnFjDMqkvemDNyl9a2HDms0HRBH7WC8u_J_ejx3uRqUISv4JugbyvJalOhX9n-kQi1CKerPQexusznnApEUKc',
    status: 'ACTIVE',
    category_id: '1ffeed34-fa21-4ea6-bc88-9fc81f7cf5bb',
    brand_id: 'bca7df79-eef7-47b7-bb08-468dd5cf8da2'
  },
  {
    id: 'cbfa3612-88ef-4efd-b940-10daeb936fcf',
    name: 'Sony FE 24-70mm f/2.8 GM II',
    category: 'lens',
    brand: 'Sony',
    pricePerDay: 450000,
    deposit: 4000000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1ZBLo9KyPsIhbQTys-hyfoDrV62_x_US2rwHhxceMVDxwJJGrkbLQkpaSmlH0adFIkZEYlbij0KOLyApzsLix0VOAW-R1Zc687J7knYSV3rTB_OcPJn2GyH-LnrnLL-OyKPUuZ8-YSi3SBygJcKtXmXKmTrkz92LEK_SpNOSAdlt01mtwBTvnSjbnFjDMqkvemDNyl9a2HDms0HRBH7WC8u_J_ejx3uRqUISv4JugbyvJalOhX9n-kQi1CKerPQexusznnApEUKc', // fallback
    isAvailable: true,
    description: 'Ống kính zoom tiêu chuẩn f/2.8 nhẹ nhất thế giới trong cùng phân khúc, dòng G Master thế hệ 2 cho hình ảnh nét căng, bokeh mịn.',
    specs: ['Tiêu cự: 24-70mm', 'Khẩu độ: f/2.8 hằng số', 'Trọng lượng: 695g'],
    daily_price: 450000,
    deposit_amount: 4000000,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1ZBLo9KyPsIhbQTys-hyfoDrV62_x_US2rwHhxceMVDxwJJGrkbLQkpaSmlH0adFIkZEYlbij0KOLyApzsLix0VOAW-R1Zc687J7knYSV3rTB_OcPJn2GyH-LnrnLL-OyKPUuZ8-YSi3SBygJcKtXmXKmTrkz92LEK_SpNOSAdlt01mtwBTvnSjbnFjDMqkvemDNyl9a2HDms0HRBH7WC8u_J_ejx3uRqUISv4JugbyvJalOhX9n-kQi1CKerPQexusznnApEUKc',
    status: 'ACTIVE',
    category_id: '1ffeed34-fa21-4ea6-bc88-9fc81f7cf5bb',
    brand_id: 'bca7df79-eef7-47b7-bb08-468dd5cf8da2'
  },
  {
    id: 'eef3d4ff-f6a2-475a-aeb4-32ffeb90efbd',
    name: 'Sony FX3 Cinema Camera',
    category: 'video',
    brand: 'Sony',
    pricePerDay: 1200000,
    deposit: 10000000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2x-rGysk6oBRGSau_Xn3wReZ2aFj3Nr5QGn4kcyXOuozjk__rnOAmKXRskJCrTaEib5O0fC1K2yHW_eoYUFtzcTgN2w13xDMHVshUEmakVKletLA60hDHc2ur8twtZXKYF6G2dwbGWywjXUvkKVohX-l3Mg7wjZ4RMsK0jWMqgmmKqVcfBhmLQm4Amuo5FvPsrMipC4JzDkMzUn2GSKBNJAvGVv1QojN23RcSVF7dGAKcQO48gFWGMZMlytjYmHuilEpbi_Je8Lo', // fallback
    isAvailable: true,
    description: 'Máy quay điện ảnh nhỏ gọn thuộc dòng Cinema Line của Sony, Tối ưu hóa cho hoạt động quay đơn độc với khả năng lấy nét tự động siêu đỉnh và chống rung bập bùng.',
    specs: ['Cảm biến: Full-frame 10.2MP Back-Illuminated', 'Dải động: 15+ stops', 'ISO: Lên đến 409600'],
    daily_price: 1200000,
    deposit_amount: 10000000,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2x-rGysk6oBRGSau_Xn3wReZ2aFj3Nr5QGn4kcyXOuozjk__rnOAmKXRskJCrTaEib5O0fC1K2yHW_eoYUFtzcTgN2w13xDMHVshUEmakVKletLA60hDHc2ur8twtZXKYF6G2dwbGWywjXUvkKVohX-l3Mg7wjZ4RMsK0jWMqgmmKqVcfBhmLQm4Amuo5FvPsrMipC4JzDkMzUn2GSKBNJAvGVv1QojN23RcSVF7dGAKcQO48gFWGMZMlytjYmHuilEpbi_Je8Lo',
    status: 'ACTIVE',
    category_id: '4ffecd21-8ff1-4aa6-bcc5-1fc82fbc9fcf',
    brand_id: 'bca7df79-eef7-47b7-bb08-468dd5cf8da2'
  },
  {
    id: 'fef43aa1-ff44-4e3b-b671-10dc9bf93ffd',
    name: 'DJI Mic 2 (2 Transmitters + 1 Receiver)',
    category: 'mic',
    brand: 'DJI',
    pricePerDay: 200000,
    deposit: 1500000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaKoATUos3N9VEW5qIqC3bkT3EnTTbK0PgDOJgZYvzfS_C4tXYsp7ZxxG0UU4ywCSNvB1OmYepEA-RmyHs_sb-LWBh6qgl3ECUN1xQPTtgFUYwutiT-uHuBe4Jf15bcij6uHqL7xHRFT43YrcVvV6sjCMnm3yZVRxVXrQkN2jkoJuLQei00vcpYGiqDg1aKK0P28SOgPv-hG-HGSPQdV7YVdXxV7CLoi4iRH7kG7FueTcSqkKdMW19veNcvmWVBIPjMJb5MxpnMy4', // fallback
    isAvailable: true,
    description: 'Hệ thống thu âm không dây cao cấp, tích hợp ghi âm nội bộ 32-bit float, chống ồn thông minh, khoảng cách truyền tải 250m.',
    specs: ['Kênh thu: 2 kênh đồng thời', 'Ghi âm nội bộ: 8GB (lên tới 14 giờ)', 'Bộ lọc gió: có đi kèm'],
    daily_price: 200000,
    deposit_amount: 1500000,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaKoATUos3N9VEW5qIqC3bkT3EnTTbK0PgDOJgZYvzfS_C4tXYsp7ZxxG0UU4ywCSNvB1OmYepEA-RmyHs_sb-LWBh6qgl3ECUN1xQPTtgFUYwutiT-uHuBe4Jf15bcij6uHqL7xHRFT43YrcVvV6sjCMnm3yZVRxVXrQkN2jkoJuLQei00vcpYGiqDg1aKK0P28SOgPv-hG-HGSPQdV7YVdXxV7CLoi4iRH7kG7FueTcSqkKdMW19veNcvmWVBIPjMJb5MxpnMy4',
    status: 'ACTIVE',
    category_id: '9ffecb12-9fa4-46fd-bccb-4fc82fc9fff4',
    brand_id: 'dca46a08-e042-455b-b9f1-a87f1ea5fc42'
  },
  {
    id: 'aec43fa1-be11-4fd2-88cd-e3ea6fba3fd1',
    name: 'Aputure Amaran 200d LED Light',
    category: 'light',
    brand: 'Aputure',
    pricePerDay: 250000,
    deposit: 1500000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaKoATUos3N9VEW5qIqC3bkT3EnTTbK0PgDOJgZYvzfS_C4tXYsp7ZxxG0UU4ywCSNvB1OmYepEA-RmyHs_sb-LWBh6qgl3ECUN1xQPTtgFUYwutiT-uHuBe4Jf15bcij6uHqL7xHRFT43YrcVvV6sjCMnm3yZVRxVXrQkN2jkoJuLQei00vcpYGiqDg1aKK0P28SOgPv-hG-HGSPQdV7YVdXxV7CLoi4iRH7kG7FueTcSqkKdMW19veNcvmWVBIPjMJb5MxpnMy4', // fallback
    isAvailable: true,
    description: 'Đèn LED công suất lớn 200W, ánh sáng ban ngày 5600K với độ hoàn màu CRI/TLCI 95+, ngàm Bowens phổ biến hỗ trợ nhiều softbox.',
    specs: ['Công suất: 200W', 'Nhiệt màu: 5600K (Daylight)', 'Ngàm: Bowens Mount'],
    daily_price: 250000,
    deposit_amount: 1500000,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaKoATUos3N9VEW5qIqC3bkT3EnTTbK0PgDOJgZYvzfS_C4tXYsp7ZxxG0UU4ywCSNvB1OmYepEA-RmyHs_sb-LWBh6qgl3ECUN1xQPTtgFUYwutiT-uHuBe4Jf15bcij6uHqL7xHRFT43YrcVvV6sjCMnm3yZVRxVXrQkN2jkoJuLQei00vcpYGiqDg1aKK0P28SOgPv-hG-HGSPQdV7YVdXxV7CLoi4iRH7kG7FueTcSqkKdMW19veNcvmWVBIPjMJb5MxpnMy4',
    status: 'ACTIVE',
    category_id: '7ffecb90-aa42-45fd-9fc8-4fc82fc9fff6',
    brand_id: 'fecb9a21-99ee-47b1-b99f-e390cba1ffff'
  },
  {
    id: 'dae42ca1-c11c-4e8c-b690-34da9ec22eff',
    name: 'SanDisk Extreme Pro 128GB SDXC V90',
    category: 'accessory',
    brand: 'SanDisk',
    pricePerDay: 50000,
    deposit: 500000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1ZBLo9KyPsIhbQTys-hyfoDrV62_x_US2rwHhxceMVDxwJJGrkbLQkpaSmlH0adFIkZEYlbij0KOLyApzsLix0VOAW-R1Zc687J7knYSV3rTB_OcPJn2GyH-LnrnLL-OyKPUuZ8-YSi3SBygJcKtXmXKmTrkz92LEK_SpNOSAdlt01mtwBTvnSjbnFjDMqkvemDNyl9a2HDms0HRBH7WC8u_J_ejx3uRqUISv4JugbyvJalOhX9n-kQi1CKerPQexusznnApEUKc', // fallback
    isAvailable: true,
    description: 'Thẻ nhớ chuyên dụng cho quay phim 4K/8K tốc độ cực cao, tốc độ đọc lên tới 300MB/s, ghi lên tới 260MB/s, đạt chuẩn V90 chân vàng.',
    specs: ['Dung lượng: 128GB', 'Hỗ trợ: V90 UHS-II', 'Tốc độ đọc: 300 MB/s'],
    daily_price: 50000,
    deposit_amount: 500000,
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1ZBLo9KyPsIhbQTys-hyfoDrV62_x_US2rwHhxceMVDxwJJGrkbLQkpaSmlH0adFIkZEYlbij0KOLyApzsLix0VOAW-R1Zc687J7knYSV3rTB_OcPJn2GyH-LnrnLL-OyKPUuZ8-YSi3SBygJcKtXmXKmTrkz92LEK_SpNOSAdlt01mtwBTvnSjbnFjDMqkvemDNyl9a2HDms0HRBH7WC8u_J_ejx3uRqUISv4JugbyvJalOhX9n-kQi1CKerPQexusznnApEUKc',
    status: 'ACTIVE',
    category_id: '6ffecb21-4fa2-4ea6-bc88-9fc81f7cfbcd',
    brand_id: 'eecb4a32-fa21-4dcb-bcc5-4ac82fb99fff'
  }
];

export const MOCK_ORDERS = [
  {
    id: 'f9bcf012-9fa4-469a-bcc3-4fc82fc9ffff', // UUID
    order_code: 'TR-10042',
    customer_id: '86ae940c-0da5-46fd-bcc5-74889c19bfff',
    equipment: EQUIPMENTS[0],
    startDate: '2026-06-10',
    endDate: '2026-06-12',
    totalPrice: 1600000,
    deposit: 5000000,
    status: 'pending',
    createdAt: '2026-06-09',
    rental_days: 2,
    total_rental_amount: 1600000,
    total_deposit_amount: 5000000
  },
  {
    id: '3fecd04c-fa24-4ea6-bccb-4fc82fc9dff3', // UUID
    order_code: 'TR-09923',
    customer_id: '86ae940c-0da5-46fd-bcc5-74889c19bfff',
    equipment: EQUIPMENTS[2],
    startDate: '2026-06-01',
    endDate: '2026-06-05',
    totalPrice: 1600000,
    deposit: 2000000,
    status: 'active',
    createdAt: '2026-05-30',
    rental_days: 4,
    total_rental_amount: 1600000,
    total_deposit_amount: 2000000
  },
  {
    id: '8fecd012-4fa2-4ea6-bccb-4fc82fc92222', // UUID
    order_code: 'TR-09811',
    customer_id: '86ae940c-0da5-46fd-bcc5-74889c19bfff',
    equipment: EQUIPMENTS[3],
    startDate: '2026-05-20',
    endDate: '2026-05-22',
    totalPrice: 700000,
    deposit: 3000000,
    status: 'completed',
    createdAt: '2026-05-19',
    rental_days: 2,
    total_rental_amount: 700000,
    total_deposit_amount: 3000000
  }
];
