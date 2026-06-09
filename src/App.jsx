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
import Profile from './pages/customer/Profile';
import Checkout from './pages/customer/Checkout';
import OrderDetail from './pages/customer/OrderDetail';
import { EQUIPMENTS, MOCK_ORDERS } from './data';

export default function App() {
  const [user, setUser] = useState({
    name: 'Khách hàng Demo',
    email: 'contact@t-rent.vn'
  });
  
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
    setActivePage('home');
    alert('Đăng xuất hoàn tất thành công!');
  };

  const handleRemoveFromCart = (index) => {
    setCartItems(cartItems.filter((_, idx) => idx !== index));
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
    // Append standard orders to states
    setOrders([...newOrdersList, ...orders]);
    setCartItems([]); // Clear cart
    setCheckoutData(null);
    
    // Choose first order created to redirect straight to custom order-detail mockup step 1!
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
    // sync selected order status
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

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-[#191c1d]" id="app-root">
      
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

        {activePage === 'profile' && (
          <Profile 
            user={user}
            userVerified={userVerified}
            onSave={(updated) => setUser({ ...user, ...updated })}
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

    </div>
  );
}
