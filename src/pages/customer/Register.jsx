import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, AlertTriangle, CheckCircle2, User, Mail, Phone, Lock } from 'lucide-react';

export default function Register({ onRegisterSuccess, onNavigateToLogin }) {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Custom mock error state to match the exact image design
  const [mockErrorActive, setMockErrorActive] = useState(false);

  const isPasswordMismatch = confirmPassword !== '' && password !== confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPasswordMismatch) {
      setMockErrorActive(true);
      return;
    }
    if (!termsAccepted) {
      alert('Vui lòng đồng ý với điều khoản sử dụng và chính sách bảo mật để tiếp tục.');
      return;
    }

    setMockErrorActive(false);
    // Open the success modal first as in the mock design
    setShowSuccessModal(true);
  };

  const handleModalProceed = () => {
    setShowSuccessModal(false);
    onRegisterSuccess({
      name: fullname,
      email: email,
      phone: phone
    });
  };

  const loadDemoMismatchState = () => {
    setFullname('Nguyễn Văn A');
    setEmail('nguyenvana@gmail.com');
    setPhone('0912345678');
    setPassword('demopassword123');
    setConfirmPassword('differingpassword');
    setMockErrorActive(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f8f9fa]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[480px] bg-white rounded-xl border border-[#c5c5d3] shadow-md overflow-hidden p-8 md:p-10"
      >
        {/* Brand identity */}
        <div className="flex flex-col items-center mb-8">
          <div className="text-2xl font-black text-[#00236f] mb-4 select-none">T-Rent</div>
          <h1 className="text-2xl font-extrabold text-[#00236f] text-center mb-2">Đăng ký tài khoản</h1>
          <p className="text-sm text-[#444651] text-center">
            Tạo tài khoản để thuê máy ảnh và thiết bị quay chụp dễ dàng hơn.
          </p>
        </div>

        {/* Mismatch error state trigger */}
        <div className="mb-4 text-center">
          <button 
            type="button"
            onClick={loadDemoMismatchState}
            className="text-xs text-[#00236f] hover:underline bg-[#dce1ff] px-3 py-1.5 rounded-full font-semibold transition"
          >
            Tải mẫu lỗi xác nhận mật khẩu (giống ảnh mẫu)
          </button>
        </div>

        {/* Register form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#444651]" htmlFor="fullname">
              Họ và tên
            </label>
            <input 
              id="fullname"
              type="text"
              required
              placeholder="Nhập họ và tên"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#c5c5d3] bg-gray-50 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] text-sm text-[#111827] transition-all"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#444651]" htmlFor="email">
              Email
            </label>
            <input 
              id="email"
              type="email"
              required
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#c5c5d3] bg-gray-50 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] text-sm text-[#111827] transition-all"
            />
          </div>

          {/* Phone number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#444651]" htmlFor="phone">
              Số điện thoại
            </label>
            <input 
              id="phone"
              type="tel"
              required
              placeholder="09xx xxx xxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#c5c5d3] bg-gray-50 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] text-sm text-[#111827] transition-all"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#444651]" htmlFor="password">
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
                className="w-full h-11 px-4 rounded-lg border border-[#c5c5d3] bg-gray-50 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] text-sm text-[#111827] transition-all pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#757682] hover:text-[#00236f] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#444651]" htmlFor="confirm-password">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input 
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (mockErrorActive) setMockErrorActive(false);
                }}
                className={`w-full h-11 px-4 rounded-lg border ${
                  mockErrorActive || isPasswordMismatch ? 'border-red-500 bg-red-50/10' : 'border-[#c5c5d3]'
                } bg-gray-50 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] text-sm text-[#111827] transition-all pr-12`}
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#757682] hover:text-[#00236f] transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Password Mismatch Warning State directly mimicking the image layout */}
            {(mockErrorActive || isPasswordMismatch) && (
              <motion.span 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 text-xs font-medium flex items-center gap-1 mt-1"
                id="password-match-error-msg"
              >
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                Mật khẩu xác nhận không khớp
              </motion.span>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-3 py-2 select-none">
            <input 
              id="terms"
              type="checkbox"
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-[#c5c5d3] text-[#00236f] focus:ring-[#1e3a8a] cursor-pointer"
            />
            <label className="text-xs text-[#444651] leading-relaxed cursor-pointer" htmlFor="terms">
              Tôi đồng ý với <a href="#" onClick={(e) => { e.preventDefault(); alert('Điều khoản sử dụng của T-Rent bao gồm trách nhiệm bồi thường nếu có hư hỏng vật lý hoặc rơi vỡ thiết bị.'); }} className="text-[#00236f] font-bold hover:underline">điều khoản sử dụng</a> và chính sách bảo mật của T-Rent.
            </label>
          </div>

          {/* Submit action */}
          <button 
            type="submit"
            className="w-full bg-[#fea619] text-[#2a1700] hover:bg-[#fea619]/90 font-extrabold py-3.5 rounded-lg transition-all active:scale-[0.98] shadow-sm text-sm"
          >
            Đăng ký
          </button>
        </form>

        {/* Login Link redirector */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-[#444651]">
            Đã có tài khoản?{' '}
            <button 
              type="button"
              onClick={onNavigateToLogin}
              className="text-[#00236f] font-bold hover:underline focus:outline-none"
            >
              Đăng nhập ngay
            </button>
          </p>
        </div>
      </motion.div>

      {/* Success Modal Overlay (Mimics the exact markup screenshot design) */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#00113a]/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-[400px] rounded-xl shadow-2xl p-8 text-center border border-[#c5c5d3]"
              id="successModal"
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-extrabold text-[#00236f] mb-3">Đăng ký thành công</h2>
              <p className="text-sm text-[#444651] mb-8 leading-relaxed">
                Tài khoản của bạn đã được tạo thành công. Chào mừng bạn đến với cộng đồng T-Rent!
              </p>
              <button 
                type="button"
                onClick={handleModalProceed}
                className="w-full bg-[#fea619] hover:bg-[#fea619]/90 text-[#2a1700] font-extrabold py-3.5 rounded-lg transition-all active:scale-[0.98]"
              >
                Đăng nhập ngay
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
