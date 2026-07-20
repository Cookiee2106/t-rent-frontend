import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DUONG_DAN_API } from "../api/api";

function Header() {
  const dieuHuong = useNavigate();
  const token = localStorage.getItem("token");
  const menuTaiKhoanRef = useRef(null);

  // Đếm số mẫu khác nhau trong giỏ hàng
  const [tongSoMauTrongGio, setTongSoMauTrongGio] = useState(0);
  const [hienMenuTaiKhoan, setHienMenuTaiKhoan] = useState(false);

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
        const danhSachItem = duLieu.data?.items || [];

        /*
          Đếm số mẫu khác nhau trong giỏ.
          Mỗi item là 1 mẫu thiết bị trong giỏ.

          Ví dụ:
          Sony A7 IV số lượng 3 => vẫn tính là 1 mẫu.
          Sony FX3 số lượng 2 => tính thêm 1 mẫu.
          Tổng hiển thị trên icon = 2.
        */
        setTongSoMauTrongGio(danhSachItem.length);
      } else {
        setTongSoMauTrongGio(0);
      }
    } catch {
      setTongSoMauTrongGio(0);
    }
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

    window.addEventListener("cap-nhat-gio-hang", layTongSoMauTrongGio);
    window.addEventListener("focus", layTongSoMauTrongGio);

    return () => {
      window.removeEventListener("cap-nhat-gio-hang", layTongSoMauTrongGio);
      window.removeEventListener("focus", layTongSoMauTrongGio);
    };
  }, [token]);

  useEffect(() => {
    function dongMenuKhiBamNgoai(e) {
      if (menuTaiKhoanRef.current && !menuTaiKhoanRef.current.contains(e.target)) {
        setHienMenuTaiKhoan(false);
      }
    }

    document.addEventListener("mousedown", dongMenuKhiBamNgoai);

    return () => {
      document.removeEventListener("mousedown", dongMenuKhiBamNgoai);
    };
  }, []);

  return (
    <div className="dau-trang">
      <div className="header-noi-dung">
        <div className="header-trai">
          <Link to="/">
            <h2 className="logo">T-Rent</h2>
          </Link>
        </div>

        <div className="menu-giua">
          <Link to="/equipments">Mẫu thiết bị</Link>
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
    </div>
  );
}

export default Header;
