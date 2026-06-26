import React, { useState, useRef, useEffect } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/customer/Home';
import Equipments from './pages/customer/Equipments';
import Orders from './pages/customer/Orders';
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import EquipmentDetail from './pages/customer/EquipmentDetail';
import Cart from './pages/customer/Cart';
import Verification from './pages/customer/Verification';
import Checkout from './pages/customer/Checkout';
import OrderDetail from './pages/customer/OrderDetail';
import PaymentResult from './pages/customer/PaymentResult';

// Admin Pages Imports
import Verifications from './pages/admin/Verifications';
import BookedOrders from './pages/admin/BookedOrders';
import PrepareEquipment from './pages/admin/PrepareEquipment';
import Inventory from './pages/admin/Inventory';
import Employees from './pages/admin/Employees';
import EquipmentModels from './pages/admin/EquipmentModels';
import Maintenance from './pages/admin/Maintenance';
import Reports from './pages/admin/Reports';
import HandoverInventory from './pages/admin/HandoverInventory';

import deviceApi from './api/deviceApi';
import orderApi from './api/orderApi';
import authApi from './api/authApi';
import cartApi from './api/cartApi';
import { 
  Shield, 
  UserCheck, 
  Grid, 
  FileCheck2, 
  PhoneCall, 
  Settings, 
  Bell, 
  HelpCircle, 
  Search,
  Eye,
  LogOut,
  RefreshCw,
  FolderDot,
  Wrench,
  Boxes,
  Users,
  Layers,
  History
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('customer'); // Default is 'customer'
  const [userVerified, setUserVerified] = useState(true); // Seeded as verified initially to let users test checkout seamlessly
  const [activePage, setActivePage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isInitializing, setIsInitializing] = useState(true);
  
  const [cartItems, setCartItems] = useState([]);

  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);

  // Scroll ref for "Quy trình thuê" section smooth scrolling
  const processSectionRef = useRef(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsInitializing(false);
        return;
      }

      // Restore user from localStorage if exists (useful for admin/staff who don't have getAccount API yet)
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setUserRole(parsedUser.role || 'customer');
        } catch (e) {
          console.error("Failed to parse stored user", e);
        }
      }

      // If customer, fetch latest profile from backend
      try {
        const res = await authApi.getAccount();
        if (res.data?.data) {
          const acc = res.data.data;
          const mappedRole = acc.vai_tro === 'QUAN_TRI' ? 'admin' 
                          : acc.vai_tro === 'NHAN_VIEN' ? 'staff' 
                          : 'customer';
          const updatedUser = {
            ...acc,
            id: acc.id,
            name: acc.ho_ten || acc.fullName || acc.name,
            email: acc.email,
            phone: acc.so_dien_thoai || acc.phone,
            role: mappedRole
          };
          setUser(updatedUser);
          setUserRole(mappedRole);
          localStorage.setItem("currentUser", JSON.stringify(updatedUser));
          await fetchCartItems(); // Fetch cart immediately
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err);
        // If 401, interceptor will clear token
        if (err.response?.status === 401) {
          setUser(null);
          setUserRole('customer');
        }
      } finally {
        setIsInitializing(false);
        // Handle VNPAY redirect
        if (window.location.pathname === '/payment-result') {
          setActivePage('payment-result');
          window.history.replaceState({}, document.title, "/");
        }
      }
    };

    initAuth();
  }, []);

  const scrollToProcess = () => {
    if (processSectionRef.current) {
      processSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = async (loggedInUser) => {
    // loggedInUser should contain: token, email, phone, name, role
    if (loggedInUser.token) {
      localStorage.setItem("accessToken", loggedInUser.token);
    }
    localStorage.setItem("currentUser", JSON.stringify(loggedInUser));

    setUser(loggedInUser);
    if (loggedInUser.role === 'admin') {
      setUserRole('admin');
      setActivePage('admin-verifications');
    } else if (loggedInUser.role === 'staff') {
      setUserRole('staff');
      setActivePage('admin-verifications');
    } else {
      setUserRole('customer');
      await fetchCartItems();
      setActivePage('home');
    }
  };

  const handleRegisterSuccess = () => {
    setActivePage('login');
  };

  const fetchCartItems = async () => {
    try {
      const res = await cartApi.getCart();
      const dbItems = res.data?.data?.items || [];
      const mappedItems = dbItems.map(item => {
        const start = new Date(item.startDate);
        const end = new Date(item.endDate);
        const diffMs = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        
        return {
          cartItemId: item.id,
          productModelId: item.productModel.id, // Needed for backend checkout
          productModel: item.productModel.name,
          brand: "Thiết bị", // Fallback
          category: "Sản phẩm", // Fallback 
          quantity: item.quantity,
          startDate: item.startDate.split('T')[0], // format to yyyy-mm-dd
          endDate: item.endDate.split('T')[0],
          rentalDays: diffDays > 0 ? diffDays : 0,
          dailyPriceSnapshot: item.dailyPriceSnapshot,
          rentalAmount: item.dailyPriceSnapshot * (diffDays > 0 ? diffDays : 0) * item.quantity,
          depositAmountSnapshot: item.depositAmountSnapshot * item.quantity,
          availableSnapshot: "Còn thiết bị",
          image: item.productModel.imageUrl || "https://placehold.co/600x400?text=No+Image",
          bundleText: "Sản phẩm cơ bản"
        };
      });
      setCartItems(mappedItems);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
    setUser(null);
    setCartItems([]);
    setUserRole('customer');
    setActivePage('home');
    alert('Đăng xuất hoàn tất thành công!');
  };

  const handleRemoveFromCart = async (indexOrId) => {
    // Determine if it's an index or an ID string
    const targetItem = typeof indexOrId === 'number' ? cartItems[indexOrId] : cartItems.find(i => i.cartItemId === indexOrId);
    if (!targetItem) return;
    try {
      await cartApi.removeCartItem(targetItem.cartItemId);
      await fetchCartItems();
      showSystemNotification('Đã xóa máy khỏi giỏ đồ');
    } catch (err) {
      alert("Lỗi khi xóa khỏi giỏ hàng");
    }
  };

  const handleAddToCart = async (payload) => {
    if (!user) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng');
      setActivePage('login');
      return;
    }
    // payload structure from Equipments.jsx needs to be converted
    try {
      await cartApi.addCartItem({
        productModelId: payload.productModelId || payload.equipment?.id || payload.id, 
        quantity: payload.quantity || 1,
        startDate: payload.startDate,
        endDate: payload.endDate
      });
      await fetchCartItems();
      setActivePage('cart');
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi thêm vào giỏ hàng");
    }
  };

  const handleProceedToCheckout = (data) => {
    if (!user) {
      alert('Vui lòng đăng nhập hệ thống để thực hiện đặt lịch giữ cọc máy!');
      setActivePage('login');
      return;
    }
    setCheckoutData(data);
    setActivePage('checkout');
  };

  const handleSubmitOrder = (newOrdersList) => {
    setCartItems([]); // Clear cart
    setCheckoutData(null);
    
    if (newOrdersList.length > 0) {
      setSelectedOrder(newOrdersList[0]);
      setActivePage('order-detail');
    } else {
      setActivePage('orders');
    }
  };

  const handlePaymentSuccess = (orderId) => {
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: 'active' });
    }
  };

  const handleCancelOrder = (orderId, reason = "Khách hàng hủy") => {
    if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.orderCode === orderId)) {
      setSelectedOrder(prev => ({
        ...prev,
        orderStatus: 'CANCELLED',
        depositPaymentStatus: 'REFUND_CANCELLED',
        cancelReason: reason,
        cancelledAt: new Date().toLocaleDateString('vi-VN') + " " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }));
    }
  };

  const handleReturnEquipment = (orderId) => {
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: 'completed' });
    }
  };

  const handleOpenEquipmentDetail = (eq) => {
    setSelectedEquipment(eq);
    setActivePage('equipment-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setActivePage('order-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch role and update active route to avoid mismatch state
  const handleRoleToggle = (role) => {
    setUserRole(role);
    if (role === 'admin') {
      setActivePage('admin-employees');
    } else if (role === 'staff') {
      setActivePage('admin-verifications');
    } else {
      setActivePage('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="flex flex-col items-center">
          <RefreshCw className="w-8 h-8 text-[#00236f] animate-spin mb-4" />
          <p className="text-[#00236f] font-bold">Đang tải dữ liệu phiên làm việc...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-[#191c1d]" id="app-root">

      {userRole === 'customer' ? (
        // CUSTOMER SITE VIEW
        <>
          {/* Universal Sticky Header Navigation */}
          <Header 
            activePage={activePage}
            setActivePage={setActivePage}
            cartCount={cartItems.length}
            user={user}
            userVerified={userVerified}
            onLogout={handleLogout}
            scrollToProcess={scrollToProcess}
          />

          {/* Main switch route content pages */}
          <main className="flex-grow pt-16">
            
            {activePage === 'home' && (
              <Home 
                setActivePage={setActivePage}
                setSelectedCategory={setSelectedCategory}
                onOpenEquipmentDetail={handleOpenEquipmentDetail}
                ref={processSectionRef}
              />
            )}

            {activePage === 'equipments' && (
              <Equipments 
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onOpenEquipmentDetail={handleOpenEquipmentDetail}
                onAddToCart={handleAddToCart}
                cartItems={cartItems}
                user={user}
              />
            )}

            {activePage === 'equipment-detail' && selectedEquipment && (
              <EquipmentDetail 
                equipment={selectedEquipment}
                onNavigateBack={() => setActivePage('equipments')}
                onAddToCart={handleAddToCart}
                user={user}
              />
            )}

            {activePage === 'cart' && (
              <Cart 
                cartItems={cartItems}
                onRemoveItem={handleRemoveFromCart}
                onProceedToCheckout={handleProceedToCheckout}
                setActivePage={setActivePage}
                user={user}
                userVerified={userVerified}
                setCartItems={setCartItems}
              />
            )}

            {activePage === 'checkout' && checkoutData && (
              <Checkout 
                user={user}
                userVerified={userVerified}
                checkoutData={checkoutData}
                onCancelCheckout={() => setActivePage('cart')}
                setActivePage={setActivePage}
              />
            )}

            {activePage === 'orders' && (
              <Orders 
                setActivePage={setActivePage}
              />
            )}

            {activePage === 'order-detail' && selectedOrder && (
              <OrderDetail 
                order={selectedOrder}
                onNavigateBack={() => setActivePage('orders')}
                onPaymentSuccess={handlePaymentSuccess}
                onCancelOrder={handleCancelOrder}
                onReturnEquipment={handleReturnEquipment}
              />
            )}

            {activePage === 'verification' && (
              <Verification 
                user={user}
                userVerified={userVerified}
                onVerifySubmit={() => setUserVerified(true)}
                setActivePage={setActivePage}
              />
            )}

            {activePage === 'login' && (
              <Login 
                onLoginSuccess={handleLoginSuccess}
                onNavigateToRegister={() => setActivePage('register')}
              />
            )}

            {activePage === 'register' && (
              <Register 
                onRegisterSuccess={handleRegisterSuccess}
                onNavigateToLogin={() => setActivePage('login')}
              />
            )}

            {activePage === 'admin-reports' && (
              <Reports userRole={userRole} />
            )}

            {activePage === 'payment-result' && (
              <PaymentResult setActivePage={setActivePage} />
            )}

          </main>

          {/* Universal Footer */}
          <Footer onNavToPage={(page) => setActivePage(page)} userRole={userRole} onRoleToggle={handleRoleToggle} />
        </>
      ) : (
        // ADMIN PORTAL VIEW (T-Rent Admin Suite)
        <div className="flex h-screen overflow-hidden font-sans">
          
          {/* Side Navigation Shell */}
          <aside className="bg-[#00236f] h-screen w-80 fixed left-0 top-0 shadow-2xl flex flex-col p-4.5 text-white z-50 shrink-0">
            <div className="mb-8 px-2 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#00236f] overflow-hidden shrink-0">
                  <span className="material-symbols-outlined font-black text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>camera_roll</span>
                </div>
                <div className="overflow-hidden">
                  <h1 className="text-lg font-serif font-black leading-tight text-white whitespace-nowrap">T-Rent Admin</h1>
                  <p className="text-[10px] text-blue-200 tracking-wider whitespace-nowrap">
                    {userRole === 'admin' ? 'HỆ THỐNG QUẢN TRỊ' : 'NGHIỆP VỤ NHÂN VIÊN'}
                  </p>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-1.5 overflow-y-auto">
              {/* Conditional Buttons based on exact Sidebar rules */}
              
              {userRole === 'admin' ? (
                <>
                  {/* Quản lý tài khoản */}
                  <button 
                    onClick={() => setActivePage('admin-verifications')}
                    className={`w-full flex items-center justify-start p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                      activePage === 'admin-verifications' 
                        ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                        : 'text-blue-150 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>Quản lý tài khoản</span>
                  </button>

                  {/* Quản lý nhân viên */}
                  <button 
                    onClick={() => setActivePage('admin-employees')}
                    className={`w-full flex items-center justify-start p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                      activePage === 'admin-employees' 
                        ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                        : 'text-blue-150 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>Quản lý nhân viên</span>
                  </button>

                  {/* Quản lý mẫu thiết bị */}
                  <button 
                    onClick={() => setActivePage('admin-models')}
                    className={`w-full flex items-center justify-start p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                      activePage === 'admin-models' 
                        ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                        : 'text-blue-150 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>Quản lý mẫu thiết bị</span>
                  </button>

                  {/* Quản lý thiết bị vật lý */}
                  <button 
                    onClick={() => setActivePage('admin-inventory-assets')}
                    className={`w-full flex items-center justify-start p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                      activePage === 'admin-inventory-assets' 
                        ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                        : 'text-blue-150 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>Quản lý thiết bị vật lý</span>
                  </button>

                  {/* Quản lý phụ kiện */}
                  <button 
                    onClick={() => setActivePage('admin-inventory-accessories')}
                    className={`w-full flex items-center justify-start p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                      activePage === 'admin-inventory-accessories' 
                        ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                        : 'text-blue-150 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>Quản lý phụ kiện</span>
                  </button>

                  {/* Quản lý đơn hàng */}
                  <button 
                    onClick={() => setActivePage('admin-orders')}
                    className={`w-full flex items-center justify-start p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                      activePage === 'admin-orders' || activePage === 'admin-prepare'
                        ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                        : 'text-blue-150 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>Quản lý đơn hàng</span>
                  </button>

                  {/* Thanh lý hợp đồng */}
                  <button 
                    onClick={() => setActivePage('admin-contracts')}
                    className={`w-full flex items-center justify-start p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                      activePage === 'admin-contracts' 
                        ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                        : 'text-blue-150 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>Thanh lý hợp đồng</span>
                  </button>

                  {/* Quản lý bảo trì */}
                  <button 
                    onClick={() => setActivePage('admin-maintenance')}
                    className={`w-full flex items-center justify-start p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                      activePage === 'admin-maintenance' 
                        ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                        : 'text-blue-150 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>Quản lý bảo trì</span>
                  </button>

                  {/* Báo cáo và nhật ký thao tác */}
                  <button 
                    onClick={() => setActivePage('admin-reports')}
                    className={`w-full flex items-center justify-start p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                      activePage === 'admin-reports' 
                        ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                        : 'text-blue-150 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>Báo cáo và nhật ký thao tác</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Quản lý tài khoản */}
                  <button 
                    onClick={() => setActivePage('admin-verifications')}
                    className={`w-full flex items-center justify-start p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                      activePage === 'admin-verifications' 
                        ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                        : 'text-blue-150 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>Quản lý tài khoản</span>
                  </button>

                  {/* Quản lý thiết bị vật lý */}
                  <button 
                    onClick={() => setActivePage('admin-inventory-assets')}
                    className={`w-full flex items-center justify-start p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                      activePage === 'admin-inventory-assets' 
                        ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                        : 'text-blue-150 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>Quản lý thiết bị vật lý</span>
                  </button>

                  {/* Quản lý phụ kiện */}
                  <button 
                    onClick={() => setActivePage('admin-inventory-accessories')}
                    className={`w-full flex items-center justify-start p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                      activePage === 'admin-inventory-accessories' 
                        ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                        : 'text-blue-150 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>Quản lý phụ kiện</span>
                  </button>

                  {/* Quản lý đơn hàng */}
                  <button 
                    onClick={() => setActivePage('admin-orders')}
                    className={`w-full flex items-center justify-start p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                      activePage === 'admin-orders' || activePage === 'admin-prepare'
                        ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                        : 'text-blue-150 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>Quản lý đơn hàng</span>
                  </button>

                  {/* Thanh lý hợp đồng */}
                  <button 
                    onClick={() => setActivePage('admin-contracts')}
                    className={`w-full flex items-center justify-start p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                      activePage === 'admin-contracts' 
                        ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                        : 'text-blue-150 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>Thanh lý hợp đồng</span>
                  </button>

                  {/* Quản lý bảo trì */}
                  <button 
                    onClick={() => setActivePage('admin-maintenance')}
                    className={`w-full flex items-center justify-start p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                      activePage === 'admin-maintenance' 
                        ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                        : 'text-blue-150 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>Quản lý bảo trì</span>
                  </button>
                </>
              )}

              {/* Switch back to customer view */}
              <button 
                onClick={() => handleRoleToggle('customer')}
                className="w-full flex items-center justify-start p-3 text-sm text-blue-200 hover:bg-white/10 hover:text-white rounded-lg transition-all font-semibold whitespace-nowrap flex-nowrap mt-2"
              >
                <span>Xem trang Khách hàng</span>
              </button>

              {/* Secure standard Logout inside Sidebar */}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-start p-3 text-sm text-red-300 hover:bg-red-950/40 hover:text-red-200 rounded-lg transition-all font-semibold whitespace-nowrap flex-nowrap mt-2"
              >
                <span>Đăng xuất</span>
              </button>
            </nav>

            <div className="mt-auto border-t border-white/10 pt-4 flex items-center gap-3 bg-[#0a1b55]/30 p-2 rounded-xl">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[#00236f] font-black shrink-0 font-serif">
                {userRole === 'admin' ? 'QLI' : 'NV'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{userRole === 'admin' ? 'Lê Hoàng (Admin)' : 'Trần Tú (Nhân viên)'}</p>
                <p className="text-[10px] text-blue-200 truncate">{userRole === 'admin' ? 'Quản trị hệ thống' : 'Vận hành dịch vụ'}</p>
              </div>
            </div>
          </aside>

          {/* Right Area content section containing Top AppBar */}
          <div className="ml-80 flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
            
            {/* Top AppBar */}
            <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-8 shrink-0 z-40">
              <div className="flex items-center gap-4 w-1/3">
                <div className="relative w-full">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Tìm kiếm mã đơn, khách hàng..." 
                    className="w-full bg-slate-100 border-none rounded-full pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <button className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 relative">
                    <Bell className="w-4 h-4 text-slate-600" />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
                    <Settings className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
                
                <div className="h-6 w-px bg-slate-200 mx-2"></div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-serif font-black text-[#00236f]">T-Rent CMS</span>
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-200 shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" 
                      alt="User Avatar" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </header>

            {/* Scrollable Main Admin Content panel */}
            <main className="flex-grow overflow-y-auto p-8 bg-slate-50 prose-none">
              {activePage === 'admin-employees' && userRole === 'admin' && (
                <Employees />
              )}

              {activePage === 'admin-verifications' && (
                <Verifications />
              )}

              {activePage === 'admin-models' && userRole === 'admin' && (
                <EquipmentModels />
              )}

              {activePage === 'admin-inventory-assets' && (
                <Inventory key="assets" defaultTab="assets" userRole={userRole} onSwitchPage={setActivePage} />
              )}

              {activePage === 'admin-inventory-accessories' && (
                <Inventory key="accessories" defaultTab="accessories" userRole={userRole} onSwitchPage={setActivePage} />
              )}

              {activePage === 'admin-orders' && (
                <BookedOrders 
                  userRole={userRole}
                  onPrepareEquipment={(code) => setActivePage('admin-prepare')}
                />
              )}

              {activePage === 'admin-prepare' && (
                <PrepareEquipment 
                  orderCode="#ORD-5001"
                  onGoBack={() => setActivePage('admin-orders')}
                />
              )}

              {activePage === 'admin-maintenance' && (
                <Maintenance />
              )}

              {activePage === 'admin-contracts' && (
                <HandoverInventory />
              )}

              {activePage === 'admin-reports' && (
                <Reports userRole={userRole} />
              )}
            </main>

          </div>

        </div>
      )}

    </div>
  );
}
