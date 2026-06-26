import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, AlertTriangle, CheckCircle2 } from 'lucide-react';
import authApi from '../../api/authApi';

export default function Register({ onRegisterSuccess, onNavigateToLogin }) {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Custom error state
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. Kiểm tra thiếu thông tin
    if (!fullname.trim() || !email.trim() || !phone.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ tất cả các trường thông tin.');
      return;
    }

    // 2. Kiểm tra mật khẩu không khớp
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    try {
      setLoading(true);
      await authApi.register({
        fullName: fullname.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password
      });

      // Đạt điều kiện hợp lệ
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Có lỗi xảy ra khi đăng ký tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const handleModalProceed = () => {
    setShowSuccessModal(false);
    onRegisterSuccess({
      name: fullname,
      email: email,
      phone: phone
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f8f9fa]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[480px] bg-white rounded-xl border border-[#c5c5d3] shadow-md overflow-hidden p-8 md:p-10"
      >
        {/* Brand identity */}
        <div className="flex flex-col items-center mb-6">
          <div className="text-3xl font-black text-[#00236f] mb-3 select-none tracking-tight font-serif">T-Rent</div>
          <h1 className="text-xl font-black text-[#00236f] text-center mb-1 uppercase tracking-wide">Đăng ký tài khoản</h1>
          <p className="text-xs text-[#757682] text-center">
            Trải nghiệm nền tảng thuê máy chụp hình & thiết bị chất lượng số 1
          </p>
        </div>

        {/* Demo trigger helper */}
        <div className="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center">
          <p className="text-[10px] text-slate-500 font-bold mb-1.5">Bộ dữ liệu giả lập lỗi khi đăng ký thử nghiệm:</p>
          <div className="flex flex-wrap justify-center gap-1.5 text-[9px] font-bold">
            <button 
              type="button"
              onClick={() => {
                setFullname('Lê Minh');
                setEmail('test@gmail.com');
                setPhone('0999999999');
                setPassword('123456');
                setConfirmPassword('123456');
              }}
              className="bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200 hover:bg-red-100"
            >
              Email đã tồn tại
            </button>
            <button 
              type="button"
              onClick={() => {
                setFullname('Phan Hải');
                setEmail('phan@gmail.com');
                setPhone('0901234567');
                setPassword('123456');
                setConfirmPassword('123456');
              }}
              className="bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200 hover:bg-red-100"
            >
              SĐT đã tồn tại
            </button>
            <button 
              type="button"
              onClick={() => {
                setFullname('Nguyễn Văn A');
                setEmail('nv@gmail.com');
                setPhone('0988111222');
                setPassword('123');
                setConfirmPassword('456');
              }}
              className="bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200 hover:bg-red-100"
            >
              Mật khẩu không khớp
            </button>
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

        {/* Register form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full name */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500" htmlFor="fullname">
              Họ và tên
            </label>
            <input 
              id="fullname"
              type="text"
              required
              placeholder="Nhập họ và tên"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-[#c5c5d3] bg-gray-50 focus:outline-none focus:border-[#00236f] text-sm text-[#111827] font-semibold transition-all"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500" htmlFor="email">
              Địa chỉ Email
            </label>
            <input 
              id="email"
              type="email"
              required
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-[#c5c5d3] bg-gray-50 focus:outline-none focus:border-[#00236f] text-sm text-[#111827] font-semibold transition-all"
            />
          </div>

          {/* Phone number */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500" htmlFor="phone">
              Số điện thoại
            </label>
            <input 
              id="phone"
              type="tel"
              required
              placeholder="VD: 0901234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-[#c5c5d3] bg-gray-50 focus:outline-none focus:border-[#00236f] text-sm text-[#111827] font-semibold font-mono transition-all"
            />
          </div>

          {/* Password */}
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

          {/* Confirm password */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500" htmlFor="confirm-password">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input 
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-[#c5c5d3] bg-gray-50 focus:outline-none focus:border-[#00236f] text-sm text-[#111827] font-semibold transition-all pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00236f]"
                tabIndex={-1}
              >Hi?n
                
              </button>
            </div>
          </div>

          {/* Submit action */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#fea619] text-[#2a1700] hover:bg-[#fea619]/90 font-extrabold h-12 rounded-lg transition-all active:scale-[0.98] shadow-sm text-sm uppercase tracking-wide mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
          </button>
        </form>

        {/* Login redirector */}
        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-xs text-slate-500">
            Đã có tài khoản?{' '}
            <button 
              type="button"
              onClick={onNavigateToLogin}
              className="text-[#00236f] font-black hover:underline"
            >
              Đăng nhập ngay
            </button>
          </p>
        </div>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#00113a]/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-[400px] rounded-2xl shadow-xl p-8 text-center border border-[#c5c5d3]"
            >
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-green-100">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-black text-[#00236f] mb-2 uppercase">Đăng ký thành công</h2>
              <p className="text-xs text-slate-550 mb-6 leading-relaxed font-medium">
                Tài khoản của bạn đã được khởi tạo thành công trên hệ thống T-Rent.
              </p>
              <button 
                type="button"
                onClick={handleModalProceed}
                className="w-full bg-[#fea619] hover:bg-[#fea619]/90 text-[#2a1700] font-black h-12 rounded-lg transition-all active:scale-[0.98] uppercase text-xs"
              >
                Tiến sang Đăng nhập
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
