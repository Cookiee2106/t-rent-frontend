import { Link, useNavigate } from "react-router-dom";

function Header() {
  const dieuHuong = useNavigate();
  const token = localStorage.getItem("token");

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

  function dangXuat() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dieuHuong("/login");
  }

  return (
    <div className="dau-trang">
      <div className="header-noi-dung">
        <div className="header-trai">
          <Link to="/">
            <h2 className="logo">T-Rent</h2>
          </Link>
        </div>

        {/* Khu vực giữa header.
            Sau này mục nào cần nằm giữa header thì thêm vào đây. */}
        <div className="menu-giua">
          <Link to="/">Trang chủ</Link>
          <Link to="/equipments">Mẫu thiết bị</Link>
        </div>

        <div className="menu-phai">
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