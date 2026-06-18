import React, { useState, useRef } from 'react';
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

// Admin Pages Imports
import Verifications from './pages/admin/Verifications';
import BookedOrders from './pages/admin/BookedOrders';
import PrepareEquipment from './pages/admin/PrepareEquipment';
import Inventory from './pages/admin/Inventory';
import Employees from './pages/admin/Employees';
import EquipmentModels from './pages/admin/EquipmentModels';
import Maintenance from './pages/admin/Maintenance';
import Reports from './pages/admin/Reports';
import SystemLogs from './pages/admin/SystemLogs';

import { EQUIPMENTS, MOCK_ORDERS } from './data';
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
  const [user, setUser] = useState({
    name: 'Nguyễn Văn A',
    email: 'contact@t-rent.vn'
  });
  
  // State to manage toggle between 'customer' and 'admin' mode
  const [userRole, setUserRole] = useState('customer'); // Default is 'customer'
  const [userVerified, setUserVerified] = useState(true); // Seeded as verified initially to let users test checkout seamlessly
  const [activePage, setActivePage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Seed cart with standard elements representing Mockup 4
  const [cartItems, setCartItems] = useState([
    {
      equipment: EQUIPMENTS[0], // Sony A7 IV
      startDate: '2026-06-12',
      endDate: '2026-06-14',
      days: 2,
      quantity: 1
    },
    {
      equipment: EQUIPMENTS[4], // Sony 24-70 GM II
      startDate: '2026-06-12',
      endDate: '2026-06-14',
      days: 2,
      quantity: 1
    }
  ]);

  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);

  // Scroll ref for "Quy trình thuê" section smooth scrolling
  const processSectionRef = useRef(null);

  const scrollToProcess = () => {
    if (processSectionRef.current) {
      processSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setActivePage('home');
  };

  const handleRegisterSuccess = () => {
    setActivePage('login');
  };

  const handleLogout = () => {
    setUser(null);
    setCartItems([]);
    setUserRole('customer');
    setActivePage('home');
    alert('Đăng xuất hoàn tất thành công!');
  };

  const handleRemoveFromCart = (index) => {
    setCartItems(cartItems.filter((_, idx) => idx !== index));
    showSystemNotification('Đã xóa máy khỏi giỏ đồ');
  };

  const handleAddToCart = (payload) => {
    setCartItems([payload, ...cartItems]);
    setActivePage('cart');
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
    setOrders([...newOrdersList, ...orders]);
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
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: 'active' } : o
    ));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: 'active' });
    }
  };

  const handleCancelOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const handleReturnEquipment = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'completed' } : order
    ));
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

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-[#191c1d]" id="app-root">
      
      {/* FLOATING ACTION ROLE SWITCHER BUTTONS - Extremely smart for testing purposes */}
      <div className="fixed bottom-6 right-6 z-[999] bg-white border border-slate-200 shadow-2xl rounded-2xl p-2.5 flex flex-col gap-2 font-sans select-none max-w-[280px]">
        <div className="text-[10px] font-black text-[#00236f] uppercase tracking-wider text-center border-b border-slate-100 pb-1.5 flex items-center justify-center gap-1">
          <RefreshCw className="w-3 h-3 text-[#fea619] animate-spin-slow" />
          Vai trò chạy thử nghiệm:
        </div>
        <div className="grid grid-cols-3 gap-1">
          <button 
            type="button" 
            onClick={() => handleRoleToggle('customer')}
            className={`px-2 py-2 text-[10px] font-black rounded-lg transition-all ${
              userRole === 'customer' 
                ? 'bg-[#00236f] text-white' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Khách
          </button>
          <button 
            type="button" 
            onClick={() => handleRoleToggle('staff')}
            className={`px-2 py-2 text-[10px] font-black rounded-lg transition-all ${
              userRole === 'staff' 
                ? 'bg-[#1e3a8a] text-white' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            N.Viên
          </button>
          <button 
            type="button" 
            onClick={() => handleRoleToggle('admin')}
            className={`px-2 py-2 text-[10px] font-black rounded-lg transition-all ${
              userRole === 'admin' 
                ? 'bg-rose-700 text-white' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Quản lý
          </button>
        </div>
      </div>

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
              />
            )}

            {activePage === 'checkout' && checkoutData && (
              <Checkout 
                user={user}
                userVerified={userVerified}
                checkoutData={checkoutData}
                onCancelCheckout={() => setActivePage('cart')}
                onSubmitOrder={handleSubmitOrder}
              />
            )}

            {activePage === 'orders' && (
              <Orders 
                orders={orders}
                onCancelOrder={handleCancelOrder}
                onReturnEquipment={handleReturnEquipment}
                setActivePage={setActivePage}
                onSelectOrder={handleSelectOrder}
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

          </main>

          {/* Universal Footer */}
          <Footer onNavToPage={(page) => setActivePage(page)} />
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
              
              {userRole === 'admin' && (
                <button 
                  onClick={() => setActivePage('admin-employees')}
                  className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                    activePage === 'admin-employees' 
                      ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                      : 'text-blue-150 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0 text-[#fea619]" />
                  <span>Nhân viên</span>
                </button>
              )}

              <button 
                onClick={() => setActivePage('admin-verifications')}
                className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                  activePage === 'admin-verifications' 
                    ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                    : 'text-blue-150 hover:bg-white/10 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4 shrink-0 text-[#fea619]" />
                <span>Hồ sơ xác minh</span>
              </button>

              {userRole === 'admin' && (
                <button 
                  onClick={() => setActivePage('admin-models')}
                  className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                    activePage === 'admin-models' 
                      ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                      : 'text-blue-150 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4 shrink-0 text-[#fea619]" />
                  <span>Mẫu thiết bị</span>
                </button>
              )}

              <button 
                onClick={() => setActivePage('admin-inventory-assets')}
                className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                  activePage === 'admin-inventory-assets' 
                    ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                    : 'text-blue-150 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Boxes className="w-4 h-4 shrink-0 text-[#fea619]" />
                <span>Thiết bị vật lý</span>
              </button>

              <button 
                onClick={() => setActivePage('admin-inventory-accessories')}
                className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                  activePage === 'admin-inventory-accessories' 
                    ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                    : 'text-blue-150 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4 shrink-0 text-[#fea619]" />
                <span>Phụ kiện</span>
              </button>

              <button 
                onClick={() => setActivePage('admin-orders')}
                className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                  activePage === 'admin-orders' || activePage === 'admin-prepare'
                    ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                    : 'text-blue-150 hover:bg-white/10 hover:text-white'
                }`}
              >
                <FileCheck2 className="w-4 h-4 shrink-0 text-[#fea619]" />
                <span>Đơn hàng</span>
              </button>

              <button 
                onClick={() => setActivePage('admin-maintenance')}
                className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                  activePage === 'admin-maintenance' 
                    ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                    : 'text-blue-150 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Wrench className="w-4 h-4 shrink-0 text-[#fea619]" />
                <span>Bảo trì</span>
              </button>

              {userRole === 'admin' && (
                <>
                  <button 
                    onClick={() => setActivePage('admin-reports')}
                    className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                      activePage === 'admin-reports' 
                        ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                        : 'text-blue-150 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Grid className="w-4 h-4 shrink-0 text-[#fea619]" />
                    <span>Báo cáo</span>
                  </button>

                  <button 
                    onClick={() => setActivePage('admin-systemlogs')}
                    className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg transition-all duration-150 font-semibold whitespace-nowrap flex-nowrap ${
                      activePage === 'admin-systemlogs' 
                        ? 'bg-[#1e3a8a] text-white shadow-inner border border-blue-900' 
                        : 'text-blue-150 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <History className="w-4 h-4 shrink-0 text-[#fea619]" />
                    <span>Nhật ký thao tác</span>
                  </button>
                </>
              )}

              {/* Secure standard Logout inside Sidebar */}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 text-sm text-red-300 hover:bg-red-950/40 hover:text-red-200 rounded-lg transition-all font-semibold whitespace-nowrap flex-nowrap mt-4"
              >
                <LogOut className="w-4 h-4 shrink-0" />
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

              {activePage === 'admin-reports' && userRole === 'admin' && (
                <Reports />
              )}

              {activePage === 'admin-systemlogs' && userRole === 'admin' && (
                <SystemLogs />
              )}
            </main>

          </div>

        </div>
      )}

    </div>
  );
}
