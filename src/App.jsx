import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />

        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

        <Route
          path="/payment-result"
          element={
            <Layout>
              <PaymentResult />
            </Layout>
          }
        />

        <Route
          path="/equipments"
          element={
            <Layout>
              <EquipmentList />
            </Layout>
          }
        />

        <Route
          path="/equipments/:id"
          element={
            <Layout>
              <EquipmentDetail />
            </Layout>
          }
        />

        <Route
          path="/orders"
          element={
            <Layout>
              <MyOrders />
            </Layout>
          }
        />

        <Route 
          path="/cart" 
          element={
            <Layout>
              <Cart />
            </Layout>
          } 
        />


        <Route
          path="/admin/customers"
          element={
            <AdminLayout>
              <CustomerAccountList />
            </AdminLayout>
          }
        />

        <Route 
          path="/admin/settlements" 
          element={
            <AdminLayout>
              <SettlementList />
            </AdminLayout>
          } 
        />

        <Route 
          path="/admin/orders" 
          element={
            <AdminLayout>
              <AdminOrderList />
            </AdminLayout>
          } 
        />

        <Route
          path="/admin/employees"
          element={
            <AdminLayout>
              <EmployeeList />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/assets"
          element={
            <AdminLayout>
              <AssetList />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/maintenances"
          element={
            <AdminLayout>
              <MaintenanceList />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/equipment-models"
          element={
            <AdminLayout>
              <AdminEquipmentModelList />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/equipment-categories"
          element={
            <AdminLayout>
              <AdminEquipmentCategoryList />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/equipment-brands"
          element={
            <AdminLayout>
              <AdminEquipmentBrandList />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/warehouse-locations"
          element={
            <AdminLayout>
              <AdminWarehouseLocationList />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/accessories"
          element={
            <AdminLayout>
              <AdminAccessoryList />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/reports-logs"
          element={
            <AdminLayout>
              <ReportAuditPage />
            </AdminLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;