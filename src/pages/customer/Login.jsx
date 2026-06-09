import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, AlertTriangle, ArrowRight, Check } from 'lucide-react';

export default function Login({ onLoginSuccess, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [inputWarning, setInputWarning] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setInputWarning(false);

    // Demonstration validation logic
    if (email === 'wrongemail@t-rent.vn') {
      setErrorMsg('Email hoặc mật khẩu không chính xác');
      setInputWarning(true);
    } else if (!email || !password) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin đăng nhập');
    } else {
      // Simulate successful login
      const name = email.split('@')[0];
      const normalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      onLoginSuccess({
        name: normalizedName || 'Khách hàng',
        email: email
      });
    }
  };

  const loadDemoErrorState = () => {
    setEmail('wrongemail@t-rent.vn');
    setPassword('demopass123');
    setErrorMsg('Email hoặc mật khẩu không chính xác');
    setInputWarning(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f8f9fa]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[440px] bg-white border border-[#c5c5d3] p-8 md:p-10 shadow-md rounded-xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="text-2xl font-black text-[#00236f] mb-4 select-none">T-Rent</div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#00236f] text-center mb-2">Đăng nhập</h1>
          <p className="text-sm text-[#444651] text-center">
            Đăng nhập để đặt thuê thiết bị và theo dõi đơn thuê trực tuyến.
          </p>
        </div>

        {/* Demo Helper Button to easily view the error mockup screenshot */}
        <div className="mb-4 text-center">
          <button 
            type="button"
            onClick={loadDemoErrorState}
            className="text-xs text-[#00236f] hover:underline bg-[#dce1ff] px-3 py-1.5 rounded-full font-semibold transition"
          >
            Tải dữ liệu mẫu lỗi (để xem giao diện lỗi giống ảnh mẫu)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Main Error Alert block */}
          {errorMsg && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-[#ffdad6] text-[#93000a] p-4 rounded-lg flex items-start gap-3 border border-red-200"
            >
              <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
              <div className="text-sm font-semibold">{errorMsg}</div>
            </motion.div>
          )}

          {/* Email input group */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#444651] block" htmlFor="email">
              Email hoặc số điện thoại
            </label>
            <div className="relative">
              <input 
                id="email"
                type="text"
                required
                placeholder="VD: contact@t-rent.vn"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (inputWarning) {
                    setInputWarning(false);
                    setErrorMsg(null);
                  }
                }}
                className={`w-full h-12 px-4 bg-gray-50 border ${
                  inputWarning ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#c5c5d3] focus:border-[#1e3a8a]'
                } rounded-lg text-sm text-[#111827] focus:outline-none transition-all`}
              />
            </div>
            {inputWarning && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 text-xs font-medium mt-1 select-none"
              >
                Thông tin này không khớp với dữ liệu hệ thống.
              </motion.p>
            )}
          </div>

          {/* Password input group */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[#444651] block" htmlFor="password">
                Mật khẩu
              </label>
            </div>
            <div className="relative">
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Nhập mật khẩu của bạn"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-4 pr-12 bg-gray-50 border border-[#c5c5d3] rounded-lg text-sm text-[#111827] focus:border-[#1e3a8a] focus:outline-none transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444651] hover:text-[#00236f] transition-all"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember and Reset link */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2.5 cursor-pointer group select-none">
              <input 
                type="checkbox" 
                className="w-4 h-4 border-[#c5c5d3] rounded text-[#00236f] focus:ring-[#00236f]"
              />
              <span className="text-sm text-[#444651] group-hover:text-[#00236f] transition-colors">
                Ghi nhớ đăng nhập
              </span>
            </label>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); alert('Chức năng khôi phục mật khẩu: Vui lòng liên hệ quản trị viên qua email contact@t-rent.vn hoặc hotline 1900-XXXX để nhận lại mật khẩu.'); }}
              className="text-sm text-[#00236f] font-bold hover:underline"
            >
              Quên mật khẩu?
            </a>
          </div>

          {/* Submit Action */}
          <button 
            type="submit"
            className="w-full h-12 bg-[#fea619] hover:bg-[#fea619]/90 text-[#2a1700] font-extrabold text-sm rounded-lg active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2"
          >
            Đăng nhập
          </button>

          {/* Navigation link to register */}
          <div className="pt-4 text-center border-t border-gray-100">
            <p className="text-sm text-[#444651]">
              Chưa có tài khoản?{' '}
              <button 
                type="button"
                onClick={onNavigateToRegister}
                className="text-[#00236f] font-bold hover:underline focus:outline-none"
              >
                Đăng ký ngay
              </button>
            </p>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
