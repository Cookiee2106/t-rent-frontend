// Cấu hình dùng chung cho trang chủ và trang danh sách mẫu thiết bị.
//
// Muốn thêm một danh mục mới:
// 1. Thêm một object mới vào CAU_HINH_DANH_MUC.
// 2. Đặt hienTrangChu = true nếu muốn hiện ở phần Sản phẩm nổi bật.
// 3. Đặt hienTrongBoLoc = true nếu muốn hiện trong combobox Danh mục.
// 4. tenDanhMuc phải trùng hoặc gần giống tên danh mục Backend trả về.
export const CAU_HINH_DANH_MUC = [
  {
    slug: "may-anh",
    ten: "Máy ảnh",
    tenDanhMuc: "Máy ảnh",
    hienTrangChu: true,
    hienTrongBoLoc: true,

    // 0 nghĩa là lấy tất cả sản phẩm của danh mục ở trang chủ.
    soSanPhamMuonLayTrangChu: 4,
    soSanPhamMoiDongTrangChu: 4,

    // 0 nghĩa là lấy tất cả sản phẩm ở trang danh mục.
    soSanPhamMuonLayTrangDanhSach: 0,
    soSanPhamMoiDongTrangDanhSach: 4,
  },
  {
    slug: "ong-kinh",
    ten: "Ống kính",
    tenDanhMuc: "Ống kính",
    hienTrangChu: true,
    hienTrongBoLoc: true,

    soSanPhamMuonLayTrangChu: 4,
    soSanPhamMoiDongTrangChu: 4,

    soSanPhamMuonLayTrangDanhSach: 0,
    soSanPhamMoiDongTrangDanhSach: 4,
  },
];

// Cấu hình các combobox lọc ở trang mẫu thiết bị.
//
// layTatCa = true:
// - Combobox tự lấy tất cả dữ liệu đang có trong danh sách mẫu thiết bị.
//
// layTatCa = false:
// - Combobox chỉ lấy các tên được khai báo trong danhSachTen.
// - Tên phải trùng hoặc gần giống dữ liệu Backend trả về.
export const CAU_HINH_BO_LOC_MAU_THIET_BI = {
  hang: {
    // Mặc định chỉ hiện 4 hãng đang cho thuê.
    layTatCa: false,
    danhSachTen: ["Fujifilm", "Canon", "Sony", "Nikon"],

    // MUỐN LẤY TẤT CẢ HÃNG:
    // 1. Đổi layTatCa thành true.
    // 2. Có thể giữ nguyên hoặc để danhSachTen: [].
    //
    // layTatCa: true,
    // danhSachTen: [],
  },

  danhMuc: {
    // Mặc định chỉ hiện 2 danh mục đang cho thuê.
    layTatCa: false,
    danhSachTen: ["Máy ảnh", "Ống kính"],

    // MUỐN LẤY TẤT CẢ DANH MỤC:
    // 1. Đổi layTatCa thành true.
    // 2. Có thể giữ nguyên hoặc để danhSachTen: [].
    //
    // layTatCa: true,
    // danhSachTen: [],
  },

  mucGia: [
    {
      giaTri: "duoi-500000",
      ten: "Dưới 500.000đ / ngày",
      tu: 0,
      den: 499999,
    },
    {
      giaTri: "500000-1000000",
      ten: "Từ 500.000đ - 1.000.000đ / ngày",
      tu: 500000,
      den: 1000000,
    },
    {
      giaTri: "tren-1000000",
      ten: "Trên 1.000.000đ / ngày",
      tu: 1000001,
      den: null,
    },
  ],
};

// Cấu hình riêng cho trang xem tất cả mẫu thiết bị.
export const CAU_HINH_TRANG_MAU_THIET_BI = {
  // 0 nghĩa là lấy tất cả sản phẩm.
  soSanPhamMuonLay: 0,
  soSanPhamMoiDong: 4,
};

export function chuanHoaChuoi(giaTri) {
  return String(giaTri || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ");
}

export function timCauHinhDanhMucTheoSlug(slug) {
  return (
    CAU_HINH_DANH_MUC.find(
      (item) => chuanHoaChuoi(item.slug) === chuanHoaChuoi(slug)
    ) || null
  );
}

export function mauThuocDanhMuc(mau, cauHinhDanhMuc) {
  if (!cauHinhDanhMuc) {
    return true;
  }

  const tenDanhMucMau = chuanHoaChuoi(mau.ten_danh_muc);
  const tenDanhMucCauHinh = chuanHoaChuoi(cauHinhDanhMuc.tenDanhMuc);

  return tenDanhMucMau.includes(tenDanhMucCauHinh);
}

export function layTheoSoLuong(danhSach, soLuongMuonLay) {
  return Number(soLuongMuonLay) === 0
    ? danhSach
    : danhSach.slice(0, Number(soLuongMuonLay));
}
