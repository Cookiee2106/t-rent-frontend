import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";

import Home from "./pages/customer/HomeView";
import Register from "./pages/customer/RegisterView";
import Login from "./pages/customer/LoginView";
import Profile from "./pages/customer/ProfileView";
import PaymentResult from "./pages/customer/PaymentResultView";
import EquipmentList from "./pages/customer/EquipmentListView";
import EquipmentDetail from "./pages/customer/EquipmentDetailView";
import MyOrders from "./pages/customer/MyOrdersView";
import Cart from "./pages/customer/CartView";

import CustomerAccountList from "./pages/admin/AdminCustomerAccountListView";
import SettlementList from "./pages/admin/AdminSettlementListView";
import AdminOrderList from "./pages/admin/AdminOrderListView";
import EmployeeList from "./pages/admin/AdminEmployeeListView";
import AssetList from "./pages/admin/AdminAssetListView";
import MaintenanceList from "./pages/admin/AdminMaintenanceListView";
import AdminEquipmentModelList from "./pages/admin/AdminEquipmentModelListView";
import AdminEquipmentCategoryList from "./pages/admin/AdminEquipmentCategoryListView";
import AdminEquipmentBrandList from "./pages/admin/AdminEquipmentBrandListView";
import AdminWarehouseLocationList from "./pages/admin/AdminWarehouseLocationListView";
import AdminAccessoryList from "./pages/admin/AdminAccessoryListView";
import ReportAuditPage from "./pages/admin/AdminReportAuditView";

// Đọc người dùng đang được lưu sau khi đăng nhập.
function layNguoiDungLocal() {
  try {
    const userText = localStorage.getItem("user");

    if (
      !userText ||
      userText === "undefined" ||
      userText === "null"
    ) {
      return null;
    }

    return JSON.parse(userText);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

// Chuẩn hóa vai trò để chấp nhận cả chữ có dấu và không dấu.
function chuanHoaVaiTro(vaiTro) {
  return String(vaiTro || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/Đ/g, "D")
    .replace(/đ/g, "d")
    .replace(/\s+/g, "_")
    .toUpperCase();
}

// Lấy vai trò từ các tên trường có thể được Backend trả về.
function layVaiTroNguoiDung(nguoiDung) {
  return chuanHoaVaiTro(
    nguoiDung?.vai_tro ||
      nguoiDung?.ma_vai_tro ||
      nguoiDung?.role ||
      nguoiDung?.ten_vai_tro
  );
}

// Nhân viên và quản trị đều được xem là tài khoản nội bộ.
function laTaiKhoanNoiBo(vaiTro) {
  return [
    "NHAN_VIEN",
    "QUAN_TRI",
    "QUAN_TRI_VIEN",
    "ADMIN",
  ].includes(vaiTro);
}

// Trang gốc tự chuyển tài khoản nội bộ về trang quản trị.
// Khách hàng và người chưa đăng nhập vẫn xem Trang chủ.
function TrangGoc() {
  const token = localStorage.getItem("token");
  const nguoiDung = layNguoiDungLocal();
  const vaiTro = layVaiTroNguoiDung(nguoiDung);

  if (token && nguoiDung && laTaiKhoanNoiBo(vaiTro)) {
    return <Navigate to="/admin/customers" replace />;
  }

  return (
    <Layout>
      <Home />
    </Layout>
  );
}

// Không cho tài khoản nội bộ đi vào giao diện khách hàng.
// Nhờ đó quản trị bấm lại "/" hoặc tải lại trang cũng trở về admin.
function RouteKhachHang({ children }) {
  const token = localStorage.getItem("token");
  const nguoiDung = layNguoiDungLocal();
  const vaiTro = layVaiTroNguoiDung(nguoiDung);

  if (token && nguoiDung && laTaiKhoanNoiBo(vaiTro)) {
    return <Navigate to="/admin/customers" replace />;
  }

  return children;
}

// Chặn người chưa đăng nhập và khách hàng truy cập route nội bộ.
function RouteNoiBo({ children }) {
  const token = localStorage.getItem("token");
  const nguoiDung = layNguoiDungLocal();
  const vaiTro = layVaiTroNguoiDung(nguoiDung);

  if (!token || !nguoiDung) {
    return <Navigate to="/login" replace />;
  }

  if (!laTaiKhoanNoiBo(vaiTro)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Chỉ quản trị viên được truy cập các màn hình quản trị riêng.
function RouteQuanTri({ children }) {
  const token = localStorage.getItem("token");
  const nguoiDung = layNguoiDungLocal();
  const vaiTro = layVaiTroNguoiDung(nguoiDung);

  if (!token || !nguoiDung) {
    return <Navigate to="/login" replace />;
  }

  if (
    !["QUAN_TRI", "QUAN_TRI_VIEN", "ADMIN"].includes(vaiTro)
  ) {
    return <Navigate to="/admin/customers" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang gốc tự điều hướng theo vai trò */}
        <Route path="/" element={<TrangGoc />} />

        {/* Các route dành cho khách hàng */}
        <Route
          path="/register"
          element={
            <RouteKhachHang>
              <Layout>
                <Register />
              </Layout>
            </RouteKhachHang>
          }
        />

        <Route
          path="/login"
          element={
            <RouteKhachHang>
              <Layout>
                <Login />
              </Layout>
            </RouteKhachHang>
          }
        />

        <Route
          path="/profile"
          element={
            <RouteKhachHang>
              <Layout>
                <Profile />
              </Layout>
            </RouteKhachHang>
          }
        />

        <Route
          path="/payment-result"
          element={
            <RouteKhachHang>
              <Layout>
                <PaymentResult />
              </Layout>
            </RouteKhachHang>
          }
        />

        <Route
          path="/equipments"
          element={
            <RouteKhachHang>
              <Layout>
                <EquipmentList />
              </Layout>
            </RouteKhachHang>
          }
        />

        <Route
          path="/equipments/:id"
          element={
            <RouteKhachHang>
              <Layout>
                <EquipmentDetail />
              </Layout>
            </RouteKhachHang>
          }
        />

        <Route
          path="/orders"
          element={
            <RouteKhachHang>
              <Layout>
                <MyOrders />
              </Layout>
            </RouteKhachHang>
          }
        />

        <Route
          path="/cart"
          element={
            <RouteKhachHang>
              <Layout>
                <Cart />
              </Layout>
            </RouteKhachHang>
          }
        />

        {/* Các route dùng chung cho nhân viên và quản trị */}
        <Route
          path="/admin/customers"
          element={
            <RouteNoiBo>
              <AdminLayout>
                <CustomerAccountList />
              </AdminLayout>
            </RouteNoiBo>
          }
        />

        <Route
          path="/admin/settlements"
          element={
            <RouteNoiBo>
              <AdminLayout>
                <SettlementList />
              </AdminLayout>
            </RouteNoiBo>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <RouteNoiBo>
              <AdminLayout>
                <AdminOrderList />
              </AdminLayout>
            </RouteNoiBo>
          }
        />

        <Route
          path="/admin/assets"
          element={
            <RouteNoiBo>
              <AdminLayout>
                <AssetList />
              </AdminLayout>
            </RouteNoiBo>
          }
        />

        <Route
          path="/admin/maintenances"
          element={
            <RouteNoiBo>
              <AdminLayout>
                <MaintenanceList />
              </AdminLayout>
            </RouteNoiBo>
          }
        />

        <Route
          path="/admin/accessories"
          element={
            <RouteNoiBo>
              <AdminLayout>
                <AdminAccessoryList />
              </AdminLayout>
            </RouteNoiBo>
          }
        />

        {/* Các route chỉ dành cho quản trị viên */}
        <Route
          path="/admin/employees"
          element={
            <RouteQuanTri>
              <AdminLayout>
                <EmployeeList />
              </AdminLayout>
            </RouteQuanTri>
          }
        />

        <Route
          path="/admin/equipment-models"
          element={
            <RouteQuanTri>
              <AdminLayout>
                <AdminEquipmentModelList />
              </AdminLayout>
            </RouteQuanTri>
          }
        />

        <Route
          path="/admin/equipment-categories"
          element={
            <RouteQuanTri>
              <AdminLayout>
                <AdminEquipmentCategoryList />
              </AdminLayout>
            </RouteQuanTri>
          }
        />

        <Route
          path="/admin/equipment-brands"
          element={
            <RouteQuanTri>
              <AdminLayout>
                <AdminEquipmentBrandList />
              </AdminLayout>
            </RouteQuanTri>
          }
        />

        <Route
          path="/admin/warehouse-locations"
          element={
            <RouteQuanTri>
              <AdminLayout>
                <AdminWarehouseLocationList />
              </AdminLayout>
            </RouteQuanTri>
          }
        />

        <Route
          path="/admin/reports-logs"
          element={
            <RouteQuanTri>
              <AdminLayout>
                <ReportAuditPage />
              </AdminLayout>
            </RouteQuanTri>
          }
        />

        {/* URL không tồn tại cũng quay về trang gốc theo vai trò */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;