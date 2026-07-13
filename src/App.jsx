import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";

import Home from "./pages/customer/Home";
import Register from "./pages/customer/Register";
import Login from "./pages/customer/Login";
import Profile from "./pages/customer/Profile";
import PaymentResult from "./pages/customer/PaymentResult";
import EquipmentList from "./pages/customer/EquipmentList";
import EquipmentDetail from "./pages/customer/EquipmentDetail";
import MyOrders from "./pages/customer/MyOrders";
import Cart from "./pages/customer/Cart";

import CustomerAccountList from "./pages/admin/CustomerAccountList";
import SettlementList from "./pages/admin/SettlementList";
import AdminOrderList from "./pages/admin/AdminOrderList";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;