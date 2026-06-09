import React, { useState } from 'react';
import { Camera, Calendar, ClipboardList, LogIn, LogOut, ShoppingBag, ShieldCheck, User, Menu, X } from 'lucide-react';

export default function Header({
  activePage,
  setActivePage,
  cartCount,
  user,
  userVerified,
  onLogout,
  scrollToProcess
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page, e) => {
    e.preventDefault();
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProcessClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (activePage !== 'home') {
      setActivePage('home');
      setTimeout(() => {
        scrollToProcess();
      }, 150);
    } else {
      scrollToProcess();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#00236f]/95 text-white shadow-lg z-[100] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        
        {/* Logo Brand */}
        <a 
          href="#" 
          onClick={(e) => handleNavClick('home', e)}
          className="flex items-center gap-2 group shrink-0"
        >
          <div className="w-10 h-10 bg-[#fea619] rounded-xl flex items-center justify-center shadow-md group-hover:rotate-6 transition-all duration-300">
            <Camera className="w-6 h-6 text-[#2a1700]" />
          </div>
          <span className="text-xl font-black tracking-wider text-white select-none">
            T-Rent<span className="text-[#fea619]">.</span>
          </span>
        </a>

        {/* Mid Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 select-none text-xs font-black uppercase">
          <a 
            href="#" 
            onClick={(e) => handleNavClick('home', e)}
            className={`transition mr-1 ${
              activePage === 'home' ? 'text-[#fea619]' : 'text-gray-200 hover:text-white'
            }`}
          >
            Trang chủ
          </a>
          <a 
            href="#" 
            onClick={(e) => handleNavClick('equipments', e)}
            className={`transition ${
              activePage === 'equipments' ? 'text-[#fea619]' : 'text-gray-200 hover:text-white'
            }`}
          >
            Lục tìm thiết bị
          </a>
          
          <a 
            href="#" 
            onClick={handleProcessClick}
            className="text-gray-250 hover:text-white transition"
          >
            Quy trình thuê
          </a>

          {user && (
            <>
              <a 
                href="#" 
                onClick={(e) => handleNavClick('orders', e)}
                className={`transition ${
                  activePage === 'orders' || activePage === 'order-detail' ? 'text-[#fea619]' : 'text-gray-200 hover:text-white'
                }`}
              >
                Đơn thuê của tôi
              </a>
              <a 
                href="#" 
                onClick={(e) => handleNavClick('verification', e)}
                className={`transition ${
                  activePage === 'verification' ? 'text-[#fea619]' : 'text-gray-200 hover:text-white'
                }`}
              >
                Hồ sơ xác minh (KYC)
              </a>
              <a 
                href="#" 
                onClick={(e) => handleNavClick('profile', e)}
                className={`transition ${
                  activePage === 'profile' ? 'text-[#fea619]' : 'text-gray-200 hover:text-white'
                }`}
              >
                Tài khoản cá nhân
              </a>
            </>
          )}
        </nav>

        {/* Right side controls action elements */}
        <div className="flex items-center gap-4">
          
          {/* Basket cart direct route trigger icon */}
          <button 
            onClick={(e) => handleNavClick('cart', e)}
            className="w-10 h-10 bg-white/15 hover:bg-white/20 hover:scale-105 active:scale-95 duration-200 transition rounded-xl flex items-center justify-center relative cursor-pointer"
            id="cart-trigger-btn"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#fea619] border-2 border-[#00236f] text-[#2a1700] text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Login actions or Avatar menu */}
          <div className="flex items-center gap-2 border-l border-white/20 pl-4 select-none">
            {user ? (
              <div className="flex items-center gap-2">
                <div onClick={(e) => handleNavClick('profile', e)} className="hidden sm:flex flex-col text-right cursor-pointer group">
                  <span className="text-xs font-black text-[#fea619] max-w-[120px] truncate flex items-center gap-1">
                    {user.name}
                    {userVerified && <ShieldCheck className="w-3.5 h-3.5 text-green-400 shrink-0" />}
                  </span>
                  <span className="text-[9px] text-[#e0e2ee] max-w-[124px] truncate">
                    {user.email}
                  </span>
                </div>
                <button 
                  onClick={onLogout}
                  className="w-8 h-8 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-300 hover:text-red-200 transition flex items-center justify-center"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={(e) => handleNavClick('login', e)}
                className="h-9 px-4 bg-[#fea619] hover:bg-[#fea619]/90 text-[#2a1700] text-xs font-black rounded-lg duration-200 active:scale-95 transition flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                Đăng nhập
              </button>
            )}
          </div>

          {/* Toggle Mobile Menu (smaller screens) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/15 rounded-xl border border-white/20"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Links block */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#00174c] border-b border-[#00236f] py-4 px-6 flex flex-col gap-3 font-semibold text-xs uppercase lg:hidden select-none">
          <a href="#" onClick={(e) => handleNavClick('home', e)} className="py-2 border-b border-white/5">Trang chủ</a>
          <a href="#" onClick={(e) => handleNavClick('equipments', e)} className="py-2 border-b border-white/5">Lục tìm thiết bị</a>
          <a href="#" onClick={handleProcessClick} className="py-2 border-b border-white/5">Quy trình thuê</a>
          {user && (
            <>
              <a href="#" onClick={(e) => handleNavClick('orders', e)} className="py-2 border-b border-white/5">Đơn thuê của tôi</a>
              <a href="#" onClick={(e) => handleNavClick('verification', e)} className="py-2 border-b border-white/5">Hồ sơ xác minh (KYC)</a>
              <a href="#" onClick={(e) => handleNavClick('profile', e)} className="py-2 border-b border-white/5">Tài khoản cá nhân</a>
            </>
          )}
        </div>
      )}
    </header>
  );
}
