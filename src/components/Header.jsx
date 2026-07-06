import { Link, useNavigate } from "react-router-dom";

function Header() {
  const dieuHuong = useNavigate();

  const token = localStorage.getItem("token");
  const nguoiDung = token
    ? JSON.parse(localStorage.getItem("user") || "null")
    : null;

  function dangXuat() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dieuHuong("/login");
  }

  return (
    <div className="dau-trang">
      <div className="header-noi-dung">
        <h2 className="logo">T-Rent</h2>

        <div className="menu">
          <Link to="/">Trang chủ</Link>

          {!token && <Link to="/register">Đăng ký</Link>}
          {!token && <Link to="/login">Đăng nhập</Link>}

          {token && <Link to="/profile">Tài khoản</Link>}
          {token && <button onClick={dangXuat}>Đăng xuất</button>}
        </div>
      </div>

      {token && nguoiDung && (
        <p className="thong-tin-user">Xin chào: {nguoiDung.ho_ten}</p>
      )}
    </div>
  );
}

export default Header;