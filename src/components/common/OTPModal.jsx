import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Lock, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export default function OTPModal({ isOpen, onClose, phone = '0987 *** 321', onVerified }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(59);
  const [isLoading, setIsLoading] = useState(false);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (resendTimer > 0 && isOpen) {
      const interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer, isOpen]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    if (isNaN(Number(value))) return; // only digits
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1); // only last character
    setDigits(newDigits);
    setErrorMsg('');

    // Shift focus to next input
    if (value && index < 5) {
      refs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs[index - 1].current.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = digits.join('');
    if (fullCode.length < 6) {
      setErrorMsg('Vui lòng nhập đầy đủ mã OTP gồm 6 chữ số!');
      return;
    }

    setIsLoading(true);
    // Simulate API checking
    setTimeout(() => {
      setIsLoading(false);
      // For demo, if code is '888888', let it fail. If anything else, succeed, or vice-versa
      if (fullCode === '000000') {
        setErrorMsg('Mã OTP không hợp lệ hoặc đã hết hiệu lực. Quý khách vui lòng kiểm tra lại!');
      } else {
        // success!
        onVerified();
      }
    }, 1200);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(59);
    setDigits(['', '', '', '', '', '']);
    setErrorMsg('');
    refs[0].current.focus();
    alert('Một mã OTP mới đã được gửi lại tới thiết bị di động đăng ký của bạn.');
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-gray-100 p-6 md:p-8 flex flex-col relative text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-extrabold text-[#00236f] font-sans mb-2">XÁC THỰC MÃ OTP</h3>
        <p className="text-xs text-[#444651] max-w-xs mx-auto mb-6">
          Chúng tôi đã gửi một tin nhắn SMS chứa mã OTP 6 chữ số bảo mật tới số điện thoại liên kết của quý khách: <strong className="text-[#00236f]">{phone}</strong>
        </p>

        {/* Digit boxes */}
        <div className="flex justify-center gap-2 mb-6">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={refs[idx]}
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-12 text-center text-lg font-extrabold border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00236f] focus:border-[#00236f] border-gray-300 rounded-xl"
            />
          ))}
        </div>

        {/* Error alerting */}
        {errorMsg && (
          <div className="flex items-center gap-1.5 justify-center py-2 px-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs text-left mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* Demo Tip */}
        <div className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 rounded-lg p-2.5 mb-6">
          <span className="font-bold text-[#00236f] block mb-0.5">Demo:</span>
          Nhập bất kỳ mã nào để Xác thực thành công. Nhập <strong className="font-bold text-red-600">000000</strong> để hiển thị thông báo lỗi.
        </div>

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={isLoading}
          className="w-full h-11 bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] text-xs font-black rounded-lg transition-all shadow-md flex items-center justify-center gap-2 mb-4"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Đang xác minh...
            </>
          ) : (
            'HOÀN TẤT XÁC THỰC'
          )}
        </button>

        {/* Resend link */}
        <div className="text-xs text-[#757682]">
          Không nhận được tin nhắn mã OTP?{' '}
          {resendTimer > 0 ? (
            <span className="font-bold text-gray-500">Gửi lại mã khả dụng sau {resendTimer}s</span>
          ) : (
            <button
              onClick={handleResend}
              className="font-extrabold text-[#00236f] hover:underline hover:text-[#fea619] transition"
            >
              Gửi lại mã ngay
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
