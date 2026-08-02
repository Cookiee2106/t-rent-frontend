import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DUONG_DAN_API } from "../api/api";

// Hiện tại thanh tìm kiếm chỉ hiển thị các danh mục này.
// Tên được viết không dấu vì hàm chuanHoaChuoi sẽ bỏ dấu khi so sánh.
const DANH_MUC_DUOC_TIM_KIEM = [
  "may anh",
  "ong kinh",
];


function Header() {
  const dieuHuong = useNavigate();
  const token = localStorage.getItem("token");

  const menuTaiKhoanRef = useRef(null);
  const khungTimKiemRef = useRef(null);

  const [tongSoMauTrongGio, setTongSoMauTrongGio] = useState(0);
  const [hienMenuTaiKhoan, setHienMenuTaiKhoan] = useState(false);

  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState("");
  const [danhSachMau, setDanhSachMau] = useState([]);
  const [hienGoiYTimKiem, setHienGoiYTimKiem] = useState(false);

  function layNguoiDungLocal() {
    try {
      const userText = localStorage.getItem("user");

      if (!userText || userText === "undefined") {
        return null;
      }

      return JSON.parse(userText);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  }

  const nguoiDung = token ? layNguoiDungLocal() : null;

  function taoHeaderCoToken() {
    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  function layTenTaiKhoan() {
    return nguoiDung?.ho_ten || nguoiDung?.email || "Tài khoản";
  }

  function dinhDangTien(giaTri) {
    return Number(giaTri || 0).toLocaleString("vi-VN") + " đ";
  }

  function chuanHoaChuoi(giaTri) {
    return String(giaTri || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");
  }

  // Kiểm tra mẫu có thuộc danh mục được phép xuất hiện trong tìm kiếm không.
  function laDanhMucDuocTimKiem(mau) {
    const tenDanhMuc = chuanHoaChuoi(mau?.ten_danh_muc);

    return DANH_MUC_DUOC_TIM_KIEM.includes(tenDanhMuc);
  }

  async function layTongSoMauTrongGio() {
    try {
      if (!token) {
        setTongSoMauTrongGio(0);
        return;
      }

      const phanHoi = await fetch(`${DUONG_DAN_API}/api/cart`, {
        headers: {
          ...taoHeaderCoToken(),
        },
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setTongSoMauTrongGio((duLieu.data?.items || []).length);
      } else {
        setTongSoMauTrongGio(0);
      }
    } catch {
      setTongSoMauTrongGio(0);
    }
  }

  async function layDanhSachMauTimKiem() {
    try {
      const phanHoi = await fetch(`${DUONG_DAN_API}/api/equipment-models`);
      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        const danhSachTatCa = duLieu.data || [];

        // CÁCH LẤY TẤT CẢ DANH MỤC:
        // Bỏ comment dòng dưới và comment phần lọc hiện tại.
        // setDanhSachMau(danhSachTatCa);

        // CÁCH HIỆN TẠI:
        // Chỉ lấy các danh mục có trong DANH_MUC_DUOC_TIM_KIEM.
        const danhSachTheoDanhMuc = danhSachTatCa.filter(
          laDanhMucDuocTimKiem
        );

        setDanhSachMau(danhSachTheoDanhMuc);
      } else {
        setDanhSachMau([]);
      }
    } catch {
      setDanhSachMau([]);
    }
  }

  const danhSachGoiY = useMemo(() => {
    const tuKhoa = chuanHoaChuoi(tuKhoaTimKiem);

    if (!tuKhoa) {
      return [];
    }

    return danhSachMau
      .filter((mau) => {
        const noiDung = chuanHoaChuoi(
          `${mau.ten_mau || ""} ${mau.ten_hang || ""} ${
            mau.ten_danh_muc || ""
          }`
        );

        return noiDung.includes(tuKhoa);
      })
      .slice(0, 6);
  }, [tuKhoaTimKiem, danhSachMau]);

  function chonSanPham(mau) {
    setTuKhoaTimKiem("");
    setHienGoiYTimKiem(false);
    dieuHuong(`/equipments/${mau.id}`);
  }

  function dangXuat() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setTongSoMauTrongGio(0);
    setHienMenuTaiKhoan(false);
    dieuHuong("/login");
  }

  useEffect(() => {
    layTongSoMauTrongGio();
    layDanhSachMauTimKiem();

    window.addEventListener("cap-nhat-gio-hang", layTongSoMauTrongGio);
    window.addEventListener("focus", layTongSoMauTrongGio);

    return () => {
      window.removeEventListener("cap-nhat-gio-hang", layTongSoMauTrongGio);
      window.removeEventListener("focus", layTongSoMauTrongGio);
    };
  }, [token]);

  useEffect(() => {
    function dongKhiBamNgoai(e) {
      if (
        menuTaiKhoanRef.current &&
        !menuTaiKhoanRef.current.contains(e.target)
      ) {
        setHienMenuTaiKhoan(false);
      }

      if (
        khungTimKiemRef.current &&
        !khungTimKiemRef.current.contains(e.target)
      ) {
        setHienGoiYTimKiem(false);
      }
    }

    document.addEventListener("mousedown", dongKhiBamNgoai);

    return () => {
      document.removeEventListener("mousedown", dongKhiBamNgoai);
    };
  }, []);

  return (
    <div className="dau-trang">
      {/* Giữ nguyên hàng header cũ */}
      <div className="header-noi-dung header-noi-dung-co-tim-kiem">
        <div className="header-trai">
          <Link to="/">
            <h2 className="logo">T-Rent</h2>
          </Link>
        </div>

        <div className="menu-giua menu-giua-tim-kiem">
          <div className="khung-header-tim-kiem" ref={khungTimKiemRef}>
            <div className="o-tim-kiem-header">
              <input
                type="text"
                value={tuKhoaTimKiem}
                placeholder="Bạn muốn thuê gì hôm nay?"
                onChange={(e) => {
                  setTuKhoaTimKiem(e.target.value);
                  setHienGoiYTimKiem(true);
                }}
                onFocus={() => setHienGoiYTimKiem(true)}
              />
          
              <button
                type="button"
                className="nut-icon-tim-kiem-header"
                aria-label="Tìm kiếm"
                onClick={() => dieuHuong("/equipments")}
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M16.5 16.5L21 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          
            {hienGoiYTimKiem && tuKhoaTimKiem.trim() && (
              <div className="hop-goi-y-tim-kiem">
                {danhSachGoiY.length === 0 ? (
                  <div className="dong-goi-y-rong">
                    Không tìm thấy mẫu thiết bị phù hợp
                  </div>
                ) : (
                  danhSachGoiY.map((mau) => (
                    <button
                      type="button"
                      className="dong-goi-y-tim-kiem"
                      key={mau.id}
                      onMouseDown={() => chonSanPham(mau)}
                    >
                      <div className="anh-goi-y-tim-kiem">
                        {mau.anh_url ? (
                          <img src={mau.anh_url} alt={mau.ten_mau} />
                        ) : (
                          <div className="khung-khong-anh-nho">Không ảnh</div>
                        )}
                      </div>
          
                      <div className="noi-dung-goi-y-tim-kiem">
                        <div className="ten-goi-y-tim-kiem">{mau.ten_mau}</div>
                        <div className="gia-coc-goi-y-tim-kiem">
                          Tiền cọc: {dinhDangTien(mau.tien_coc)}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="menu-phai">
          <Link to="/cart" className="nut-gio-hang-header">
            <svg
              className="icon-gio-hang-svg"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 4h2l2.2 11.2c.2 1 1 1.8 2.1 1.8h7.8c1 0 1.9-.7 2.1-1.7L21 8H7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="20" r="1.5" fill="currentColor" />
              <circle cx="17" cy="20" r="1.5" fill="currentColor" />
            </svg>

            <span className="so-luong-gio-hang-header">
              {tongSoMauTrongGio}
            </span>
          </Link>

          {!token && <Link to="/register">Đăng ký</Link>}
          {!token && <Link to="/login">Đăng nhập</Link>}

          {token && nguoiDung && (
            <div className="tai-khoan-header" ref={menuTaiKhoanRef}>
              <button
                type="button"
                className="nut-tai-khoan-header"
                onClick={() => setHienMenuTaiKhoan(!hienMenuTaiKhoan)}
              >
                <span className="ten-tai-khoan-header">{layTenTaiKhoan()}</span>

                <span className="avatar-header">
                  <svg
                    className="icon-avatar-header"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="8"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M4 21c1.7-4.2 4.4-6.2 8-6.2s6.3 2 8 6.2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>

              {hienMenuTaiKhoan && (
                <div className="menu-tai-khoan-dropdown">
                  <Link to="/orders" onClick={() => setHienMenuTaiKhoan(false)}>
                    Đơn thuê
                  </Link>

                  <Link to="/profile" onClick={() => setHienMenuTaiKhoan(false)}>
                    Tài khoản
                  </Link>

                  <button type="button" onClick={dangXuat}>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Ba mục nằm dưới thanh tìm kiếm */}
      <div className="menu-danh-muc-header-moi">
        <Link to="/equipments">Mẫu thiết bị</Link>
        <Link to="/equipments?nhom=may-anh">Máy ảnh</Link>
        <Link to="/equipments?nhom=ong-kinh">Ống kính</Link>
      </div>
    </div>
  );
}

export default Header;