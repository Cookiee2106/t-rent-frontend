import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';

export default function Login({ onLoginSuccess, onNavigateToRegister }) {
  const [loginInput, setLoginInput] = useState(''); // Email hoặc Số điện thoại
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sơ đồ tài khoản thử nghiệm theo Use Case
  const MOCK_ACCOUNTS = [
    {
      login: 'khach@t-rent.vn',
      phone: '0901234567',
      password: 'password123',
      role: 'customer',
      status: 'active',
      name: 'Nguyễn Văn Tiến',
    },
    {
      login: 'nhanvien@t-rent.vn',
      phone: '0912345678',
      password: 'password123',
      role: 'staff',
      status: 'active',
      name: 'Trần Tú (Nhân viên)',
    },
    {
      login: 'admin@t-rent.vn',
      phone: '0987654321',
      password: 'password123',
      role: 'admin',
      status: 'active',
      name: 'Lê Hoàng (Admin)',
    },
    {
      login: 'lock@t-rent.vn',
      phone: '0333444555',
      password: 'password123',
      role: 'customer',
      status: 'blocked',
      name: 'Khách Hàng Bị Khóa',
    }
  ];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginInput.trim() || !password.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin đăng nhập');
      return;
    }

    // Tìm tài khoản khớp email hoặc số điện thoại
    const account = MOCK_ACCOUNTS.find(
      (acc) =>
        (acc.login.toLowerCase() === loginInput.trim().toLowerCase() || acc.phone === loginInput.trim()) &&
        acc.password === password
    );

    if (!account) {
      setErrorMessage('Thông tin đăng nhập không chính xác');
      return;
    }

    // Kiểm tra trạng thái tài khoản lẻ
    if (account.status === 'blocked') {
      setErrorMessage('Tài khoản của bạn đã bị khóa');
      return;
    }

    // Đăng nhập thành công -> Trả về thông tin đầy đủ gồm cả vai trò
    onLoginSuccess({
      email: account.login,
      phone: account.phone,
      name: account.name,
      role: account.role
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f8f9fa] text-left">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[450px] bg-white rounded-xl border border-[#c5c5d3] shadow-md overflow-hidden p-8 md:p-10"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="text-3xl font-black text-[#00236f] mb-3 select-none tracking-tight font-serif flex items-center gap-1">
            T-Rent
          </div>
          <h1 className="text-xl font-black text-[#00236f] text-center mb-1 uppercase tracking-wide">Đăng nhập</h1>
          <p className="text-xs text-slate-500 text-center font-medium">
            Sử dụng email/SĐT thử nghiệm bên dưới để chạy đầy đủ vai trò
          </p>
        </div>

        {/* Demo trigger helper - Rất hữu ích cho GV phản biện & Test nghiệp vụ */}
        <div className="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
          <p className="text-[10px] text-[#00236f] font-black mb-1.5 uppercase tracking-wide">Sổ tài khoản test nhanh:</p>
          <div className="flex flex-col gap-1.5 text-[9.5px] font-bold">
            <button 
              type="button"
              onClick={() => {
                setLoginInput('khach@t-rent.vn');
                setPassword('password123');
              }}
              className="bg-blue-50 text-[#00236f] py-1 border border-blue-200 rounded text-left px-2 hover:bg-blue-105"
            >
              🙋 Khách hàng: khach@t-rent.vn
            </button>
            <button 
              type="button"
              onClick={() => {
                setLoginInput('nhanvien@t-rent.vn');
                setPassword('password123');
              }}
              className="bg-purple-50 text-purple-800 py-1 border border-purple-200 rounded text-left px-2 hover:bg-purple-105"
            >
              💼 Nhân viên: nhanvien@t-rent.vn
            </button>
            <button 
              type="button"
              onClick={() => {
                setLoginInput('admin@t-rent.vn');
                setPassword('password123');
              }}
              className="bg-rose-50 text-rose-800 py-1 border border-rose-200 rounded text-left px-2 hover:bg-rose-105"
            >
              👑 Quản trị viên: admin@t-rent.vn
            </button>
            <button 
              type="button"
              onClick={() => {
                setLoginInput('lock@t-rent.vn');
                setPassword('password123');
              }}
              className="bg-red-50 text-red-700 py-1 border border-red-200 rounded text-left px-2 hover:bg-red-105"
            >
              🔒 Máy Bị Khóa: lock@t-rent.vn
            </button>
          </div>
        </div>

        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-rose-50 border border-rose-250 text-[#ba1a1a] text-xs rounded-lg flex items-start gap-2 font-bold"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          {/* Email hoặc Điện thoại */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500" htmlFor="login-input">
              E-mail hoặc Số điện thoại
            </label>
            <input 
              id="login-input"
              type="text"
              required
              placeholder="nhap@t-rent.vn hoặc SĐT..."
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-[#c5c5d3] outline-none focus:border-[#00236f] text-xs text-[#111827] font-semibold transition-all bg-gray-50/50"
            />
          </div>
        </div>

          {/* Mật khẩu */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500" htmlFor="password-field">
              Mật khẩu
            </label>
            <div className="relative">
              <input 
                id="password-field"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-[#c5c5d3] outline-none focus:border-[#00236f] text-xs text-[#111827] font-semibold transition-all bg-gray-50/50 pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00236f]"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#fea619] text-[#2a1700] hover:bg-[#fea619]/90 font-black h-12 rounded-lg transition-all active:scale-[0.98] shadow-sm text-xs uppercase tracking-wider pt-0.5"
            id="login-submit-button"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-xs text-slate-500 font-semibold">
            Nếu bạn là khách hàng chưa có tài khoản?{' '}
            <button 
              type="button"
              onClick={onNavigateToRegister}
              className="text-[#00236f] font-black hover:underline ml-1"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
