import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function AdminLayout({ children }) {
  const dieuHuong = useNavigate();

  const [thuGonSidebar, setThuGonSidebar] = useState(false);

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

  function chuanHoaVaiTro(vaiTro) {
    return String(vaiTro || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/Đ/g, "D")
      .replace(/đ/g, "d")
      .toUpperCase();
  }

  function laQuanTriVien() {
    const vaiTro = chuanHoaVaiTro(
      nguoiDung?.vai_tro ||
        nguoiDung?.ma_vai_tro ||
        nguoiDung?.role ||
        nguoiDung?.ten_vai_tro
    );

    return (
      vaiTro === "QUAN_TRI" ||
      vaiTro === "QUAN_TRI_VIEN" ||
      vaiTro === "ADMIN"
    );
  }

  function dangXuat() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dieuHuong("/login");
  }

  return (
    <div
      className={
        thuGonSidebar
          ? "admin-layout admin-layout-thu-gon"
          : "admin-layout"
      }
    >
      <div
        className={
          thuGonSidebar
            ? "admin-sidebar admin-sidebar-thu-gon"
            : "admin-sidebar"
        }
      >
        <div className="admin-sidebar-dong-tren">
          {!thuGonSidebar && <h2 className="admin-logo">T-Rent</h2>}

          <button
            type="button"
            className="nut-thu-gon-sidebar"
            onClick={() => setThuGonSidebar(!thuGonSidebar)}
            title={thuGonSidebar ? "Mở sidebar" : "Thu gọn sidebar"}
          >
            {thuGonSidebar ? "›" : "‹"}
          </button>
        </div>

        {!thuGonSidebar && (
          <>
            {nguoiDung && (
              <p className="admin-user">Xin chào: {nguoiDung.ho_ten}</p>
            )}

            <div className="admin-menu">
              <Link to="/admin/customers">
                Quản lý tài khoản khách hàng
              </Link>

              {laQuanTriVien() && (
                <Link to="/admin/employees">
                  Quản lý nhân viên
                </Link>
              )}

              {laQuanTriVien() && (
                <Link to="/admin/warehouse-locations">
                  Quản lý vị trí kho
                </Link>
              )}

              {laQuanTriVien() && (
                <Link to="/admin/equipment-categories">
                  Quản lý danh mục thiết bị
                </Link>
              )}

              {laQuanTriVien() && (
                <Link to="/admin/equipment-brands">
                  Quản lý hãng thiết bị
                </Link>
              )}

              {laQuanTriVien() && (
                <Link to="/admin/equipment-models">
                  Quản lý mẫu thiết bị
                </Link>
              )}

              <Link to="/admin/assets">
                Quản lý thiết bị vật lý
              </Link>

              <Link to="/admin/accessories">
                Quản lý phụ kiện
              </Link>

              <Link to="/admin/orders">
                Quản lý đơn hàng
              </Link>

              <Link to="/admin/settlements">
                Thanh lý hợp đồng
              </Link>

              <Link to="/admin/maintenances">
                Quản lý bảo trì
              </Link>

              {laQuanTriVien() && (
                <Link to="/admin/reports-logs">
                  Báo cáo nhật kí và thao tác
                </Link>
              )}

              <button onClick={dangXuat}>
                Đăng xuất
              </button>
            </div>
          </>
        )}
      </div>

      <div className="admin-content">{children}</div>
    </div>
  );
}

export default AdminLayout;
