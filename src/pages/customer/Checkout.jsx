import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Calendar, 
  FileText, 
  ChevronLeft, 
  AlertTriangle,
  Lock,
  CheckCircle2,
  X,
  CreditCard,
  QrCode,
  Wallet
} from 'lucide-react';

export default function Checkout({
  user,
  userVerified,
  checkoutData,
  onSubmitOrder,
  onCancelCheckout
}) {
  const [orderNote, setOrderNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // 'form' - Confirming order details
  // 'payment_gate' - Thanh toán cọc giữ chỗ screen
  const [checkoutStep, setCheckoutStep] = useState('form');

  // Popups/Modals state
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpCooldown, setOtpCooldown] = useState(119); // 1:59 countdown timer
  const [otpError, setOtpError] = useState(null);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('qr_code');
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Temporary generated single Order ID for this transaction (TR-XXXXX)
  const [tempOrderCode] = useState(() => 'TR-' + Math.floor(10000 + Math.random() * 90000));

  useEffect(() => {
    let timer;
    if (showOtpModal && otpCooldown > 0) {
      timer = setInterval(() => {
        setOtpCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showOtpModal, otpCooldown]);

  if (!checkoutData) return null;

  const { subtotal, depositTotal, finalTotalAmount, items } = checkoutData;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Nút Tạo đơn hàng (Bấm ở trang Checkout)
  const handleCreateOrderClick = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Kiểm tra giỏ hàng hợp lệ
    if (!items || items.length === 0) {
      setErrorMessage('Giỏ hàng rỗng. Không thể tiếp tục đặt đơn.');
      return;
    }

    // Kiểm tra khách hàng đã xác minh (KYC) chưa
    if (!userVerified) {
      setErrorMessage('Tài khoản của quý khách chưa hoàn thiện Xác minh hồ sơ (KYC). Vui lòng hoàn thành KYC trước khi tạo đơn hàng thuê.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Nếu hợp lệ thì hiển thị popup Đồng ý điều khoản
    setShowTermsModal(true);
  };

  // Đồng ý điều khoản -> Mở popup Xác thực OTP
  const handleAgreeTermsSubmit = () => {
    if (!termsAgreed) {
      alert('Vui lòng đọc kĩ và đánh dấu tích đồng ý với Điều khoản thuê thiết bị.');
      return;
    }
    setShowTermsModal(false);
    
    // Mở popup OTP
    setOtpValue('');
    setOtpCooldown(119);
    setOtpError(null);
    setShowOtpModal(true);
  };

  // Xác thực OTP
  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    setOtpError(null);

    if (otpCooldown <= 0) {
      setOtpError('Mã OTP xác thực đã hết hiệu lực. Vui lòng thử lại.');
      return;
    }

    // OTP demo mặc định là 123456
    if (otpValue === '123456') {
      setShowOtpModal(false);
      // Chuyển sang màn hình Thanh toán cọc giữ chỗ
      setCheckoutStep('payment_gate');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setOtpError('Mã OTP không chính xác. Thử lại với mã thử nghiệm: 123456.');
    }
  };

  // Thanh toán cọc giữ chỗ
  const handlePayDepositClick = () => {
    setPaymentError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setPaymentSuccess(true);
      
      // Tạo danh sách các đơn hàng để gửi về state trung tâm
      const createdOrders = items.map((it, idx) => {
        const rowCode = tempOrderCode + '-' + (idx + 1);
        return {
          id: rowCode,
          order_code: rowCode,
          equipment: it.equipment,
          startDate: it.startDate,
          endDate: it.endDate,
          deposit: it.equipment.deposit * it.quantity,
          totalPrice: it.equipment.pricePerDay * it.days * it.quantity,
          status: 'paid', // Trạng thái: Đã đặt cọc giữ chỗ
          payment_status: 'paid',
          createdAt: new Date().toISOString().split('T')[0],
          rental_days: it.days,
          quantity: it.quantity,
          note: orderNote || 'Không có ghi chú'
        };
      });

      // Gửi đơn hàng lên app và điều hướng tự động
      setTimeout(() => {
        onSubmitOrder(createdOrders);
      }, 1500);

    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 animate-fade-in text-left font-sans" id="checkout-container">
      
      <button
        onClick={onCancelCheckout}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#00236f] hover:text-[#fea619] transition bg-white py-1.5 px-3 border border-slate-200 rounded-xl shadow-sm"
      >
        
        Quay lại Giỏ hàng
      </button>

      {/* MÀN BƯỚC 1: XÁC THỰC THÔNG TIN & CLICK TẠO ĐƠN */}
      {checkoutStep === 'form' && (
        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h1 className="text-xl font-black text-[#00236f] uppercase tracking-wide">Xác Nhận Đơn Hàng</h1>
            <p className="text-xs text-slate-400 mt-1">Vui lòng rà soát danh sách trang thiết bị và thông tin chủ hồ sơ trước khi bấm Tạo đơn hàng</p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-[#ba1a1a] font-bold text-xs rounded-xl flex items-start gap-2 animate-fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-650" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Cột trái: Thông tin hiển thị (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Thẻ khách hàng */}
              <div className="bg-white border border-[#c5c5d3] rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center flex-wrap gap-2">
                  <h3 className="text-xs font-black uppercase text-[#00236f]">1. Thông tin khách thuê & KYC</h3>
                  {userVerified ? (
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] px-2.5 py-1 rounded-full border border-emerald-200 font-extrabold uppercase tracking-wider">Hồ sơ đã xác minh (KYC)</span>
                  ) : (
                    <span className="bg-amber-50 text-amber-800 text-[10px] px-2.5 py-1 rounded-full border border-amber-200 font-extrabold uppercase tracking-wider animate-pulse">Chưa KYC (Không được phép thuê)</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase mb-0.5">Họ và tên</span>
                    <strong className="text-slate-800 font-bold">{user?.name || 'Nguyễn Văn A'}</strong>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <span className="text-slate-400 font-bold block text-[10px] uppercase mb-0.5">Số điện thoại liên hệ</span>
                    <strong className="text-slate-800 font-mono font-bold">{user?.phone || '0901 234 567'}</strong>
                  </div>
                </div>
              </div>

              {/* Danh sách thiết bị */}
              <div className="bg-white border border-[#c5c5d3] rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-50 border-b border-slate-150">
                  <h3 className="text-xs font-black uppercase text-[#00236f]">
                    2. Thiết bị muốn thuê đặt giữ chỗ
                  </h3>
                </div>

                <div className="divide-y divide-slate-100">
                  {items.map((it, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap text-xs">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-slate-100 p-0.5">
                          <img src={it.equipment.image} alt={it.equipment.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-0.5 text-left">
                          <h4 className="font-bold text-slate-800 line-clamp-1">{it.equipment.name}</h4>
                          <span className="text-[10px] text-slate-450 block font-semibold">
                            Kỳ thuê: {it.days} ngày ({it.startDate} đến {it.endDate}) • Số lượng: {it.quantity}x
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <strong className="text-[#00236f] block font-mono">
                          {(it.equipment.pricePerDay * it.days * it.quantity).toLocaleString('vi-VN')}đ
                        </strong>
                        <span className="text-[9px] text-slate-400 font-bold block">
                          Cọc thế: {(it.equipment.deposit * it.quantity).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ghi chú */}
              <div className="bg-white border border-[#c5c5d3] rounded-2xl p-6 space-y-3 shadow-sm">
                <h3 className="text-xs font-black uppercase text-[#00236f] tracking-wide border-b border-slate-100 pb-2">
                  3. Ghi chú bổ sung
                </h3>
                <textarea
                  rows={2}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Điền ghi chú bàn giao hoặc các yêu cầu kỹ thuật đặc biệt (nếu có)"
                  className="w-full p-3 bg-slate-50 border border-slate-200 focus:outline-none rounded-xl text-xs font-semibold leading-relaxed"
                />
              </div>

            </div>

            {/* Cột phải: Phiếu ước phí & Nút Tạo đơn hàng (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-[#c5c5d3] rounded-2xl p-6 space-y-4 shadow-sm sticky top-24">
                <h3 className="text-xs font-black text-[#00236f] uppercase border-b border-slate-100 pb-2.5">
                  VẬN HÀNH BIỂU PHÍ ĐƠN
                </h3>

                <div className="space-y-3 text-xs font-bold text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Phí thuê thiết bị:</span>
                    <span className="text-slate-800 font-mono">{subtotal.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Đặt cọc bảo lãnh:</span>
                    <span className="text-slate-800 font-mono">{depositTotal.toLocaleString('vi-VN')} VNĐ</span>
                  </div>

                  <div className="border-t border-dashed border-slate-200 pt-3"></div>

                  <div className="flex justify-between items-center text-sm font-black text-[#00236f]">
                    <span>TIỀN CỌC GIỮ CHỖ:</span>
                    <span className="text-base text-amber-600 font-mono">{finalTotalAmount.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 text-[9px] text-amber-900 leading-relaxed font-semibold">
                  ⚠️ Lưu ý: Hệ thống yêu cầu đọc và chấp nhận thỏa thuận pháp lý thuê dân sự trước khi bắt đầu đặt thanh toán bảo cọc.
                </div>

                <button
                  type="button"
                  onClick={handleCreateOrderClick}
                  className="w-full py-3.5 bg-[#00236f] hover:bg-[#fea619] text-white hover:text-[#2a1700] text-xs font-black rounded-xl transition shadow-sm flex items-center justify-center"
                >
                  Tạo đơn hàng
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MÀN BƯỚC 4: CỔNG THANH TOÁN CỌC GIỮ CHỖ */}
      {checkoutStep === 'payment_gate' && (
        <div className="max-w-xl mx-auto bg-white border border-[#c5c5d3] rounded-2xl p-6 md:p-8 space-y-6 shadow-md text-center">
          
          <div className="border-b border-slate-100 pb-4">
            <span className="bg-red-50 text-red-800 border border-red-200 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded">CỔNG TIỀN CỌC</span>
            <h1 className="text-xl font-black text-[#00236f] mt-2 uppercase tracking-wide">Thanh toán cọc giữ chỗ</h1>
            <p className="text-xs text-slate-500 mt-1">Mã đơn hàng: <strong className="font-mono text-[#00236f] text-sm">{tempOrderCode}</strong></p>
          </div>

          {paymentError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-[#ba1a1a] font-bold text-xs rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{paymentError}</span>
            </div>
          )}

          {paymentSuccess ? (
            <div className="py-6 space-y-4 animate-fade-in text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="text-base font-black text-[#00236f] uppercase">Ưu đãi cọc máy đã được ghi nhận!</h3>
              <p className="text-xs text-slate-500 leading-normal max-w-sm mx-auto font-semibold">
                Đã đặt cọc thành công số tiền <strong className="text-amber-600 font-mono">{finalTotalAmount.toLocaleString('vi-VN')} VNĐ</strong>. Đại lý T-Rent đang tổ chức chuyển dãn tem và sắp đặt lịch nhận đồ cho bạn.
              </p>
              <div className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block font-black animate-pulse">
                ĐANG PHÂN BỔ KHO VÀ DI CHUYỂN...
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-left">
              
              {/* Box tóm tắt */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center text-xs text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase mb-0.5">Biểu tiền cọc giữ:</span>
                  <strong className="text-lg font-black text-amber-600 font-mono">{finalTotalAmount.toLocaleString('vi-VN')}đ</strong>
                </div>
                <div className="text-right font-semibold text-slate-400 text-[10px] space-y-0.5">
                  <div>Phí thuê máy: {subtotal.toLocaleString('vi-VN')}đ</div>
                  <div>Trị cọc bảo lãnh: {depositTotal.toLocaleString('vi-VN')}đ</div>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="space-y-2">
                <label className="text-slate-500 block font-bold text-[9px] uppercase tracking-wide">Chọn phương thức bảo lãnh:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  {/* QR */}
                  <div 
                    onClick={() => setPaymentMethod('qr_code')}
                    className={`border-2 rounded-xl p-3 flex gap-2.5 items-center cursor-pointer transition ${
                      paymentMethod === 'qr_code' ? 'border-[#00236f] bg-slate-50/50' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-6 h-6 text-[#00236f] shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 block">Quét QR VietQR</span>
                      <span className="text-[9px] text-slate-450 block font-medium">Báo cọc tự động ngay</span>
                    </div>
                  </div>

                  {/* Bank */}
                  <div 
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`border-2 rounded-xl p-3 flex gap-2.5 items-center cursor-pointer transition ${
                      paymentMethod === 'bank_transfer' ? 'border-[#00236f] bg-slate-50/50' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Wallet className="w-6 h-6 text-amber-500 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 block">Chuyển khoản Vietcombank</span>
                      <span className="text-[9px] text-slate-450 block font-medium">Duyệt tay thủ công</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Trực quan cổng */}
              {paymentMethod === 'qr_code' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-2 text-center">
                  <div className="w-32 h-32 bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-center relative">
                    <QrCode className="w-28 h-28 text-slate-800" />
                    <span className="absolute bottom-1 bg-[#00236f] text-white text-[6px] px-1 rounded">T-RENT PAY</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block">Quét mã QR để nhanh cọc</span>
                    <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed font-semibold">
                      Chờ ngân hàng tự hồi tín hiệu. Showroom T-Rent sẽ gửi tin bảo cọc đơn hàng ngay lắp lự!
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank_transfer' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs font-semibold text-slate-700">
                  <span className="font-black text-[#00236f] block text-[9px] uppercase">HƯỚNG DẪN BANK CHUYỂN KHOẢN:</span>
                  <div className="grid grid-cols-2 gap-y-1.5 border-t border-slate-200/50 pt-2 text-[10.5px]">
                    <div className="text-slate-400">Ngân hàng:</div>
                    <div className="text-slate-800 font-bold">Vietcombank (VCB)</div>
                    <div className="text-slate-400">Số tài khoản:</div>
                    <div className="text-slate-800 font-mono font-bold">1024345678901</div>
                    <div className="text-slate-400">Chủ tài khoản:</div>
                    <div className="text-slate-800 font-bold">CONG TY TRENT VIETNAM</div>
                    <div className="text-slate-400">Nội dung CK:</div>
                    <div className="text-rose-700 font-mono font-black bg-rose-50 px-1 border rounded">{tempOrderCode}</div>
                  </div>
                </div>
              )}

              {/* Nút hành động */}
              <div className="pt-4 border-t border-slate-100 flex justify-between gap-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setCheckoutStep('form');
                    setPaymentError(null);
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 rounded-xl text-xs transition"
                >
                  Sửa lại thông tin đơn
                </button>
                
                <button 
                  type="button" 
                  onClick={handlePayDepositClick}
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#00236f] hover:bg-[#fea619] text-white hover:text-[#2a1700] hover:border-amber-400 font-black rounded-xl text-xs transition"
                >
                  {isSubmitting ? 'Bảo lãnh thanh toán..' : 'Thanh toán cọc giữ chỗ'}
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* POPUP 1: ĐỒNG Ý ĐIỀU KHOẢN POPUP */}
      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#00113a]/40 backdrop-blur-xs text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-5 md:p-6 space-y-4 border border-slate-200"
              id="terms-contract-modal"
            >
              <div className="border-b border-slate-100 pb-2.5 flex justify-between items-center">
                <h3 className="text-xs font-black text-[#00236f] uppercase flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#fea619]" />
                  Thỏa thuận điều khoản thuê thiết bị
                </h3>
                <button 
                  type="button" 
                  onClick={() => setShowTermsModal(false)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nội dung điều khoản */}
              <div className="h-56 overflow-y-auto p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-3 leading-relaxed font-semibold">
                <div>
                  <h4 className="font-extrabold text-[#00236f] text-[11px] mb-1">1. Đối chiếu và kiểm tra bàn giao</h4>
                  <p>Khi trực tiếp tới đại lý showroom nhận bàn giao trang thiết bị camera, ống kính phụ kiện, quý khách vui lòng cùng nhân viên kỹ thuật đối chiếu kỹ lưỡng ngoại quan nấm, rễ tre, hạt bụi sensor và dán niêm phong tem bảo vệ trước khi rời quầy bàn giao.</p>
                </div>
                <div>
                  <h4 className="font-extrabold text-[#00236f] text-[11px] mb-1">2. Trách nhiệm bồi thường hư hỏng</h4>
                  <p>Trong suốt kỳ hạn thuê, nếu trang thiết bị dính cát bụi, nước đọng rạn nứt nổ sụt thấu thấu kính, nứt vỡ LCD hoặc đứt lỗi mạch cơ học, quý khách cam kết tự nguyện chịu 100% kinh phí sửa chữa chính hãng tại các trung tâm bảo hành ủy quyền của Sony/Canon.</p>
                </div>
                <div>
                  <h4 className="font-extrabold text-[#00236f] text-[11px] mb-1">3. Hoàn trả đúng thời hạn thỏa hiệp</h4>
                  <p>Hoàn trả thiết bị nguyên vẹn đúng thời hạn ghi nhận. Trường hợp phát sinh bàn giao trễ giờ mà không thỏa thuận trước sẽ bị thu phụ phí phạt 50.000đ cho mỗi giờ trễ quá hạn định.</p>
                </div>
                <div>
                  <h4 className="font-extrabold text-[#00236f] text-[11px] mb-1">4. Quy trình giải quyết tiền cọc thế chấp</h4>
                  <p>Sau khi hoàn trả máy ảnh hoàn toàn lành lặn không phát sinh hư hại bong tróc tem bảo hành, showroom T-Rent cam kết hoàn trả 100% tài sản tiền đặt cọc giữ chỗ của quý khách ngay lập tức.</p>
                </div>
              </div>

              {/* Checkbox bắt buộc */}
              <div className="flex items-start gap-2.5 bg-amber-50/50 p-2.5 rounded-xl border border-amber-250">
                <input 
                  type="checkbox"
                  id="agree-checkbox-block"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 cursor-pointer accent-[#00236f] rounded"
                />
                <label htmlFor="agree-checkbox-block" className="text-[10.5px] font-bold text-slate-700 cursor-pointer select-none">
                  Tôi đã đọc sâu sắc và cam kết chấp thuận hoàn toàn các điều khoản ràng buộc pháp lý nói trên của T-Rent.
                </label>
              </div>

              {/* Nút popups */}
              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2 text-xs">
                <button 
                  type="button" 
                  onClick={() => setShowTermsModal(false)}
                  className="px-3 py-1.5 border hover:bg-slate-50 font-bold rounded-lg text-slate-500 transition"
                >
                  Hủy
                </button>
                <button 
                  type="button" 
                  onClick={handleAgreeTermsSubmit}
                  disabled={!termsAgreed}
                  className={`px-4 py-1.5 rounded-lg font-black transition ${
                    termsAgreed ? 'bg-[#00236f] hover:bg-blue-900 text-white' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  Đồng ý điều khoản
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POPUP 2: XÁC THỰC OTP POPUP */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-[125] flex items-center justify-center p-4 bg-[#00113a]/40 backdrop-blur-xs text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-[360px] rounded-2xl shadow-xl p-5 md:p-6 space-y-4 border border-slate-200"
              id="otp-verification-modal"
            >
              <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-5 h-5 text-amber-600" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black text-[#00236f] uppercase">Xác thực OTP giao dịch</h3>
                <p className="text-[10.5px] text-slate-500 leading-normal font-semibold">
                  Mã OTP dùng xác thực đã chuyển tiếp đến Hotline đăng ký nhận tin <strong className="text-slate-800 font-mono">{user?.phone || '0901 234 567'}</strong> để xác nhận hành vi khởi tạo đơn hàng.
                </p>
                <div className="text-[9px] text-slate-400">Đơn dịch: <strong className="font-mono text-[#00236f]">{tempOrderCode}</strong></div>
              </div>

              {otpError && (
                <div className="p-2.5 bg-rose-50 border border-rose-150 text-[#ba1a1a] font-bold text-[10px] rounded-lg text-left">
                  ⚠️ {otpError}
                </div>
              )}

              {/* Demo assistant */}
              <div className="p-2.5 bg-blue-50/50 border border-blue-200 rounded-xl text-left">
                <span className="text-[8px] font-black text-[#00236f] block uppercase tracking-wide">Trợ giúp giả lập duyệt:</span>
                <p className="text-[9.5px] text-blue-800 leading-relaxed font-semibold mt-0.5">
                  • Nhập mã tiêu chuẩn: <strong className="text-[#00236f] bg-white px-1 border rounded">123456</strong> để đi tiếp.<br />
                  • Nhập số khác để kiểm định báo sai mã OTP.
                </p>
              </div>

              <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                <div className="space-y-1">
                  <input 
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Nhập mã OTP 6 chữ số"
                    value={otpValue}
                    onChange={(e) => {
                      setOtpError(null);
                      setOtpValue(e.target.value.replace(/\D/g, ''));
                    }}
                    className="w-full text-center h-10 bg-slate-50 border border-slate-200 focus:border-[#00236f] focus:outline-none rounded-xl text-lg font-black tracking-widest text-[#00236f]"
                  />
                  
                  <div className="text-[10px] text-slate-400 font-bold">
                    Mã xác thực hết hiệu lực trong: 
                    <span className="text-rose-600 font-bold ml-1 font-mono">{formatTime(otpCooldown)}</span>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-1 text-xs">
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowOtpModal(false);
                      setOtpError(null);
                    }}
                    className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-550 rounded-xl font-bold transition"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2 bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] rounded-xl font-black transition shadow-xs"
                  >
                    Xác thực OTP
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
