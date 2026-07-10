import { Link, useNavigate } from "react-router-dom";

function AdminLayout({ children }) {
  const dieuHuong = useNavigate();

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

  const nguoiDung = layNguoiDungLocal();

  function dangXuat() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dieuHuong("/login");
  }

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <h2 className="admin-logo">T-Rent</h2>
        {nguoiDung && (
          <p className="admin-user">Xin chào: {nguoiDung.ho_ten}</p>
        )}
        <div className="admin-menu">
          <Link to="/admin/customers">Quản lý tài khoản khách hàng</Link>
          <button onClick={dangXuat}>Đăng xuất</button>
        </div>
      </div>
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;