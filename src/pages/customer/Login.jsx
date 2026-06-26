import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import authApi from '../../api/authApi';

export default function Login({ onLoginSuccess, onNavigateToRegister }) {
  const [loginInput, setLoginInput] = useState(''); // Email
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginInput.trim() || !password.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.login(loginInput.trim(), password);
      
      const token = res.data?.data?.token;
      const rawUser = res.data?.data?.nguoi_dung || res.data?.data?.user;

      if (!token || !rawUser) {
        throw new Error('Dữ liệu trả về không hợp lệ');
      }

      // Chuẩn hóa thông tin người dùng từ backend sang frontend
      const mappedRole = rawUser.vai_tro === 'QUAN_TRI' ? 'admin' 
                      : rawUser.vai_tro === 'NHAN_VIEN' ? 'staff' 
                      : 'customer';

      const user = {
        id: rawUser.id,
        fullName: rawUser.ho_ten || rawUser.fullName || rawUser.name,
        email: rawUser.email,
        phone: rawUser.so_dien_thoai || rawUser.phone,
        role: mappedRole
      };

      // Đăng nhập thành công -> Trả về thông tin đầy đủ gồm cả vai trò
      onLoginSuccess({
        token,
        email: user.email,
        phone: user.phone,
        name: user.fullName,
        role: user.role
      });
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Thông tin đăng nhập không chính xác');
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
            className="w-full bg-[#fea619] text-[#2a1700] hover:bg-[#fea619]/90 font-black h-12 rounded-lg transition-all active:scale-[0.98] shadow-sm text-xs uppercase tracking-wider pt-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            id="login-submit-button"
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
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
