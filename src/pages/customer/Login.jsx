import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';

export default function Login({ onLoginSuccess, onNavigateToRegister }) {
  const [loginInput, setLoginInput] = useState(''); // Email hoặc Số điện thoại
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Tập dữ liệu thử nghiệm
  const MOCK_ACCOUNTS = [
    {
      login: 'client@t-rent.vn',
      phone: '0901234567',
      password: 'password123',
      role: 'customer',
      status: 'active',
      name: 'Nguyễn Văn Tiến',
    },
    {
      login: 'blocked@t-rent.vn',
      phone: '0987654321',
      password: 'password123',
      role: 'customer',
      status: 'blocked',
      name: 'Tài Khoản Bị Khóa',
    },
    {
      login: 'admin@t-rent.vn',
      phone: '0912345678',
      password: 'password123',
      role: 'admin',
      status: 'active',
      name: 'Lê Hoàng (Admin)',
    }
  ];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginInput.trim() || !password.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin đăng nhập.');
      return;
    }

    // Tìm tài khoản khớp
    const account = MOCK_ACCOUNTS.find(
      (acc) =>
        (acc.login.toLowerCase() === loginInput.trim().toLowerCase() || acc.phone === loginInput.trim()) &&
        acc.password === password
    );

    if (!account) {
      setErrorMessage('Thông tin đăng nhập không chính xác (sai email/số điện thoại hoặc mật khẩu).');
      return;
    }

    // Kiểm tra trạng thái tài khoản
    if (account.status === 'blocked') {
      setErrorMessage('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ để biết thêm chi tiết.');
      return;
    }

    // Kiểm tra vai trò khách hàng
    if (account.role !== 'customer') {
      setErrorMessage('Tài khoản này không có quyền truy cập giao diện khách thuê.');
      return;
    }

    // Hợp lệ -> Đăng nhập thành công
    onLoginSuccess({
      email: account.login,
      phone: account.phone,
      name: account.name,
      role: account.role
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f8f9fa]">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[450px] bg-white rounded-xl border border-[#c5c5d3] shadow-md overflow-hidden p-8 md:p-10"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="text-3xl font-black text-[#00236f] mb-3 select-none tracking-tight font-serif">T-Rent</div>
          <h1 className="text-xl font-black text-[#00236f] text-center mb-1 uppercase tracking-wide">Đăng nhập</h1>
          <p className="text-xs text-slate-500 text-center">
            Đăng nhập hệ thống để quản lý và đặt thuê thiết bị
          </p>
        </div>

        {/* Demo trigger helper */}
        <div className="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center">
          <p className="text-[10px] text-slate-500 font-bold mb-1.5">Bộ dữ liệu giả lập trạng thái đăng nhập:</p>
          <div className="flex flex-col gap-1 text-[9px] font-bold">
            <div className="flex justify-center gap-1">
              <button 
                type="button"
                onClick={() => {
                  setLoginInput('client@t-rent.vn');
                  setPassword('password123');
                }}
                className="bg-blue-50 text-[#00236f] px-2 py-1 rounded border border-blue-200 hover:bg-blue-100"
              >
                TK Khách Hàng Thường
              </button>
              <button 
                type="button"
                onClick={() => {
                  setLoginInput('blocked@t-rent.vn');
                  setPassword('password123');
                }}
                className="bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200 hover:bg-red-100"
              >
                TK Khách Bị Khóa
              </button>
            </div>
            <div className="flex justify-center gap-1">
              <button 
                type="button"
                onClick={() => {
                  setLoginInput('admin@t-rent.vn');
                  setPassword('password123');
                }}
                className="bg-amber-50 text-amber-800 px-2 py-1 rounded border border-amber-200 hover:bg-amber-100"
              >
                TK Admin (Không được vào Khách)
              </button>
              <button 
                type="button"
                onClick={() => {
                  setLoginInput('wrong@t-rent.vn');
                  setPassword('123456');
                }}
                className="bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200 hover:bg-slate-250"
              >
                Sai mật khẩu / Email sai
              </button>
            </div>
          </div>
        </div>

        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-rose-50 border border-rose-200 text-[#ba1a1a] text-xs rounded-lg flex items-start gap-2 font-bold"
          >
            <AlertTriangle className="w-4 h-4 text-rose-550 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Email / SĐT */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500" htmlFor="login-input">
              E-mail hoặc Số điện thoại
            </label>
            <input 
              id="login-input"
              type="text"
              required
              placeholder="example@t-rent.vn hoặc 090123... "
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-[#c5c5d3] bg-gray-50 focus:outline-none focus:border-[#00236f] text-sm text-[#111827] font-semibold transition-all"
            />
          </div>

          {/* Mật khẩu */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500" htmlFor="password">
              Mật khẩu
            </label>
            <div className="relative">
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-[#c5c5d3] bg-gray-50 focus:outline-none focus:border-[#00236f] text-sm text-[#111827] font-semibold transition-all pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00236f]"
                tabIndex={-1}
              >Hi?n
                
              </button>
            </div>
          </div>

          {/* Submit action */}
          <button 
            type="submit"
            className="w-full bg-[#fea619] text-[#2a1700] hover:bg-[#fea619]/90 font-extrabold h-12 rounded-lg transition-all active:scale-[0.98] shadow-sm text-sm uppercase tracking-wide mt-4"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-xs text-slate-500">
            Chưa có tài khoản?{' '}
            <button 
              type="button"
              onClick={onNavigateToRegister}
              className="text-[#00236f] font-black hover:underline"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
