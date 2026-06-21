import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  FileText, 
  CheckCircle2, 
  Clock, 
  X, 
  QrCode, 
  Wallet, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

export default function OrderDetail({
  order,
  onNavigateBack,
  onPaymentSuccess,
  onCancelOrder,
  onReturnEquipment
}) {
  const [showTerms, setShowTerms] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showPaymentQR, setShowPaymentQR] = useState(false);
  
  // Terms & OTP state
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState(null);
  const [otpCooldown, setOtpCooldown] = useState(119);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('qr_code');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tiền thuê, Tiền cọc, Tổng cộng
  const totalRent = order.totalRentalAmount || order.totalPrice || 0;
  const totalDeposit = order.totalDepositAmount || order.deposit || 0;
  const finalTotalAmount = totalRent + totalDeposit;
  const currentStatus = order.orderStatus || order.status;

  // Lấy text trạng thái
  const getStatusNode = (statusVal) => {
    const status = statusVal || currentStatus;
    switch (status) {
      case 'pending':
      case 'PENDING':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-800 text-xs font-black rounded-full select-none animate-pulse">
            <Clock className="w-4 h-4 shrink-0" />
            CHỜ THANH TOÁN CỌC
          </span>
        );
      case 'paid':
      case 'active':
      case 'DEPOSIT_PAID':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black rounded-full select-none">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            ĐÃ ĐẶT CỌC GIỮ CHỖ
          </span>
        );
      case 'renting':
      case 'RENTING':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e0f2fe] border border-sky-305 text-[#0369a1] text-xs font-black rounded-full select-none">
            <Clock className="w-4 h-4 text-[#0284c7] shrink-0" />
            ĐANG THUÊ MÁY
          </span>
        );
      case 'completed':
      case 'COMPLETED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 border border-sky-300 text-sky-800 text-xs font-black rounded-full select-none">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
            ĐÃ HOÀN TẤT THUÊ
          </span>
        );
      case 'cancelled':
      case 'CANCELLED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-black rounded-full select-none">
            <X className="w-4 h-4 text-rose-600 shrink-0" />
            ĐƠN ĐÃ HỦY
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-300 text-slate-800 text-xs font-black rounded-full select-none">
            CHỜ XỬ LÝ
          </span>
        );
    }
  };

  const handleStartPaymentFlow = () => {
    if (order.status !== 'pending') {
      alert('Đơn hàng đã được thanh toán cọc bảo lãnh từ trước!');
      return;
    }
    setTermsAgreed(false);
    setShowTerms(true);
  };

  const handleTermsAccepted = () => {
    setShowTerms(false);
    setOtpValue('');
    setOtpError(null);
    setOtpCooldown(119);
    setShowOTP(true);
  };

  const handleOTPVerified = (e) => {
    e.preventDefault();
    if (otpValue === '123456') {
      setShowOTP(false);
      setShowPaymentQR(true);
    } else {
      setOtpError('Mã OTP không chính xác. Sử dụng mã thử nghiệm: 123456.');
    }
  };

  const handleQRTransferSuccess = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowPaymentQR(false);
      onPaymentSuccess(order.id);
      alert('Đặt cọc giữ chỗ thành công! Đơn hàng đã chuyển sang trạng thái "Đã cọc giữ chỗ".');
    }, 1000);
  };

  const handleCancelClick = () => {
    if (window.confirm('Quý khách muốn Hủy đơn hàng này? Thao tác này sẽ tự động hoàn trả số lượng thiết bị khả dụng lắp rạp về kho.')) {
      onCancelOrder(order.id);
      alert('Đã hủy đơn hàng và hoàn thiết bị về kho thành công.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 animate-fade-in text-left font-sans" id="order-detail-screen">
      
      <button
        type="button"
        onClick={onNavigateBack}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#00236f] hover:text-[#fea619] transition bg-white py-1.5 px-3 border border-slate-200 rounded-xl shadow-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Quay lại đơn hàng đặt thuê
      </button>

      {/* Main Header Info Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white border border-[#c5c5d3] p-5 rounded-2xl shadow-sm select-none">
        <div>
          <span className="text-[9px] text-slate-400 font-extrabold uppercase block tracking-wider mb-0.5">Mã tham chiếu đơn hàng:</span>
          <h1 className="text-xl font-black text-[#00236f] uppercase font-mono">Đơn thuê: #{order.order_code || order.id}</h1>
          <span className="text-xs text-slate-450 block mt-0.5 font-bold">Khởi tạo ngày: {order.createdAt || '2026-06-12'}</span>
        </div>

        <div className="flex items-center gap-2">
          {getStatusNode(order.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cột trái: Thông tin & Danh sách thiết bị (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Trực quan tiến độ quy trình */}
          <div className="bg-white border border-[#c5c5d3] p-5 rounded-2xl shadow-sm">
            <h3 className="text-xs font-black text-[#00236f] uppercase tracking-wide border-b border-slate-100 pb-3 mb-5">
              📊 Quy trình hoàn chỉnh thủ tục nhận thiết bị
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 text-center text-[10px] font-bold">
              {[
                { name: 'Khởi tạo đơn', active: true, desc: 'Đã hoàn tất' },
                { name: 'Đóng tiền cọc', active: order.status !== 'pending' && order.status !== 'cancelled', desc: order.status === 'pending' ? 'Chờ thanh toán' : order.status === 'cancelled' ? 'Bị hủy bỏ' : 'Đã bảo lãnh' },
                { name: 'Xếp dán tem', active: order.status === 'completed', desc: 'Kho chuẩn bị' },
                { name: 'Ký nhận giấy', active: order.status === 'completed', desc: 'Tại showroom' },
                { name: 'Bàn giao máy', active: order.status === 'completed', desc: 'Nhả thiết bị' }
              ].map((step, idx) => (
                <div key={idx} className="space-y-2 relative flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-black ${
                    step.active 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm' 
                      : 'bg-slate-50 text-slate-300 border-slate-200'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 block tracking-tight leading-none text-[10.5px]">{step.name}</h4>
                    <span className="text-[9px] block mt-0.5 text-slate-400 font-semibold">{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danh sách trang thiết bị kén chọn */}
          <div className="bg-white border border-[#c5c5d3] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-150">
              <h3 className="text-xs font-black uppercase text-[#00236f] tracking-wide">
                🎥 DANH SÁCH THIẾT BI ĐÃ LÊN ĐƠN
              </h3>
            </div>

            <div className="p-5 space-y-4 divide-y divide-slate-150">
              
              {/* Row camera */}
              <div className="flex gap-4 items-center flex-wrap sm:flex-nowrap pt-3 first:pt-0">
                <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1 border border-slate-200 shadow-inner">
                  <img src={order.equipment?.image} alt="equipment cover" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 text-xs font-semibold text-left flex-grow">
                  <span className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.2 border rounded font-black tracking-wide uppercase">{order.equipment?.brand || 'Premium'}</span>
                  <h3 className="text-xs font-extrabold text-slate-800 leading-snug">{order.equipment?.name || 'Mẫu thiết bị camera'}</h3>
                  <p className="text-[10px] text-slate-400">{order.equipment?.description || 'Thiết bị cho chất lượng quay chụp đẳng cấp thế giới, đầy đủ bộ đi kèm.'}</p>
                </div>
              </div>

              {/* Thông tin chu kỳ nhận và trả */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-100 rounded-xl text-xs pt-4">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tight block">Kỳ hạn nhận bàn giao:</span>
                  <strong className="text-slate-800 font-extrabold block">
                    Từ 08:30 ngày {order.startDate} (Hỗ trợ nhận quầy)
                  </strong>
                </div>

                <div className="space-y-0.5 text-left sm:text-right">
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tight block">Hạn trả thiết bị:</span>
                  <strong className="text-slate-800 font-extrabold block">
                    Trước 20:00 ngày {order.endDate} ({order.rental_days || 1} ngày thuê)
                  </strong>
                </div>
              </div>

            </div>
          </div>

          {/* Quy chế và điều khoản hợp đồng bàn giao */}
          <div className="bg-white border border-[#c5c5d3] p-5 rounded-2xl shadow-sm space-y-3.5 text-xs text-left">
            <h3 className="text-xs font-black uppercase text-[#00236f] tracking-wide border-b border-slate-150 pb-2">
              📑 HỢP ĐỒNG ĐÃ ĐỒNG Ý
            </h3>

            <p className="text-slate-500 leading-relaxed font-semibold">
              Khách hàng tự nguyện đồng ý 100% với các chính sách, thỏa thuận trách nhiệm thuê dân sự bảo trì máy của T-Rent. Biên nhận có giá trị đối chiếu để cấp phát thiết bị dã ngoại không cần giữ giấy tờ căn cước gốc.
            </p>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1 block leading-relaxed font-bold text-slate-600">
              <span className="block text-[#00236f] font-black uppercase text-[10px] mb-1">Ghi chú bàn giao:</span>
              <span>{order.note || 'Không có ghi chú thêm.'}</span>
            </div>
          </div>

        </div>

        {/* Cột phải: Phiếu ước phí đặt cọc bảo lãnh & Hành động hủy (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-[#c5c5d3] rounded-2xl p-6 shadow-sm space-y-4 sticky top-24">
            <h3 className="text-xs font-black text-[#00236f] uppercase border-b border-slate-100 pb-3">
              Chi tiết biểu phí đặt cọc
            </h3>

            <div className="space-y-3 text-xs font-bold text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-450 font-semibold">Giá phí thuê máy:</span>
                <span className="text-slate-800 font-mono">{totalRent.toLocaleString('vi-VN')} VNĐ</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-450 font-semibold">Tiền cọc giữ showroom:</span>
                <span className="text-slate-800 font-mono">{totalDeposit.toLocaleString('vi-VN')} VNĐ</span>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-3"></div>

              <div className="space-y-1 p-3 bg-[#dce1ff]/30 text-xs border border-dashed border-[#b6c4ff] rounded-xl text-left">
                <div className="flex justify-between items-center font-black text-[#00236f]">
                  <span>ĐÃ THANH TOÁN CỌC:</span>
                  <span className="text-base font-black text-amber-600 font-mono">
                    {finalTotalAmount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <span className="text-[9px] text-[#00236f]/60 block text-right font-black">
                  (Hoàn cọc 100% khi bàn trả thiết bị đầy đủ)
                </span>
              </div>
            </div>

            {/* Lưu ý KYC */}
            {order.status === 'pending' ? (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 flex gap-2 text-[9px] text-rose-800 leading-normal font-semibold text-left">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>Kho chưa dán tem giữ chỗ. Quý khách vui lòng đặt cọc trực tuyến để kịch hoạt dán tem bảo lãnh ngay lập tức.</span>
              </div>
            ) : order.status === 'cancelled' ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex gap-2 text-[9px] text-slate-500 leading-normal font-semibold text-left">
                <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Đơn hàng đã hủy bỏ. Số lượng thiết bị kén chọn đã được cập nhật trả về kho khả dụng của showroom.</span>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-250 flex gap-2 text-[9px] text-emerald-800 leading-normal font-semibold text-left-0">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Trạng thái bảo lãnh thành công! Showroom cam kết giữ máy trống sẵn sàng 100% phục vụ bạn.</span>
              </div>
            )}

            {/* Nút hành vụ tùy trạng thái */}
            <div className="space-y-2.5 pt-2">
              {order.status === 'pending' && (
                <>
                  <button
                    type="button"
                    onClick={handleStartPaymentFlow}
                    className="w-full py-3 bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] text-xs font-black rounded-xl shadow transition duration-150 flex items-center justify-center gap-1.5"
                  >
                    Thanh toán đặt cọc giữ chỗ
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-[#ba1a1a] border border-rose-200 text-xs font-bold rounded-xl transition-colors shadow-sm"
                  >
                    Hủy đơn hàng
                  </button>
                </>
              )}

              {(order.status === 'paid' || order.status === 'active') && (
                <>
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-[#ba1a1a] border border-rose-200 text-xs font-bold rounded-xl transition-colors shadow-sm"
                  >
                    Hủy đơn hàng (Hoàn cọc)
                  </button>
                  <div className="text-[10px] text-slate-400 font-extrabold text-center uppercase tracking-wide">
                    Đơn hàng đang chờ phát máy
                  </div>
                </>
              )}

              {order.status === 'completed' && (
                <button
                  type="button"
                  disabled
                  className="w-full py-3 bg-sky-50 text-sky-700 text-xs font-black rounded-xl border border-sky-200 cursor-not-allowed text-center"
                >
                  Bàn giao nghiệm thu hoàn tất
                </button>
              )}

              {order.status === 'cancelled' && (
                <button
                  type="button"
                  disabled
                  className="w-full py-3 bg-slate-50 text-slate-400 text-xs font-black rounded-xl border border-slate-200 cursor-not-allowed text-center"
                >
                  Đơn hàng đã được hủy bỏ
                </button>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* POPUP THANH TOÁN CẮT LẺ Ở ĐÂY CHO GỌN GÀNG VÀ BỀN VỮNG */}
      {/* 1. Terms Popup Overlay */}
      <AnimatePresence>
        {showTerms && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#00113a]/50 backdrop-blur-xs select-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 text-left border border-slate-200 space-y-4"
            >
              <div className="border-b pb-2 flex justify-between items-center">
                <h3 className="text-xs font-black text-[#00236f] uppercase">Chính sách bảo chứng thuê</h3>
                <button type="button" onClick={() => setShowTerms(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="h-44 overflow-y-auto p-3 bg-slate-50 border rounded-lg text-[11px] text-slate-600 font-semibold space-y-2 leading-relaxed">
                <p>Khách hàng cam kết đồng ý đối chiếu kỹ lưỡng ngoại quan bụi sensor trước khi xuất xưởng khỏi showroom Phú Nhuận.</p>
                <p>Mọi hư hỏng móp méo rơi rớt rạn kính dính cát nước xảy ra trong kỳ hạn thuê dã ngoại sẽ do quý khách chịu 100% kinh phí bảo hành thực tế.</p>
                <p>Trả máy trễ hẹn mà không thỏa hiệp từ trước sẽ chịu bồi thường ròng phạt 50.000đ/giờ trễ định kỳ.</p>
              </div>

              <div className="flex items-start gap-2 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                <input 
                  type="checkbox" 
                  id="dt-terms-check" 
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded cursor-pointer accent-[#00236f]"
                />
                <label htmlFor="dt-terms-check" className="text-[10px] font-bold text-slate-705 cursor-pointer">
                  Tôi đồng ý hoàn toàn với các điều khoản bảo quản thuê máy dã quầy.
                </label>
              </div>

              <div className="flex justify-end gap-2 text-xs pt-2">
                <button type="button" onClick={() => setShowTerms(false)} className="px-3 py-1.5 border hover:bg-slate-50 font-bold rounded-lg text-slate-500">
                  Hủy
                </button>
                <button 
                  type="button" 
                  onClick={handleTermsAccepted}
                  disabled={!termsAgreed}
                  className={`px-4 py-1.5 rounded-lg font-black text-white transition ${
                    termsAgreed ? 'bg-[#00236f] hover:bg-blue-900' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  Đồng ý điều khoản
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. OTP Popup Overlay */}
      <AnimatePresence>
        {showOTP && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#00113a]/50 backdrop-blur-xs select-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-[340px] rounded-2xl shadow-xl p-5 text-center border border-slate-200 space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-sm font-black text-[#00236f] uppercase">Xác thực OTP nạp cọc</h3>
                <p className="text-[10px] text-slate-450 leading-normal font-semibold">
                  Mã OTP để dán nhãn bảo lưu đã được bắn gửi qua số điện thoại của tài khoản thuê dã ngoại.
                </p>
              </div>

              {otpError && (
                <div className="p-2 bg-rose-50 border border-rose-250 text-[#ba1a1a] text-[10px] rounded font-bold text-left">
                  ⚠️ {otpError}
                </div>
              )}

              <div className="p-2.5 bg-blue-50 border border-blue-205 rounded-xl text-left">
                <span className="text-[8px] font-black text-[#00236f] block uppercase mb-0.5">Mã thử nghiệm duyệt:</span>
                <p className="text-[9.5px] text-blue-800 leading-none font-bold">👉 Nhập mã: <strong className="text-[#00236f]">123456</strong></p>
              </div>

              <form onSubmit={handleOTPVerified} className="space-y-4">
                <input 
                  type="text"
                  required
                  maxLength={6}
                  placeholder="Mã OTP 6 số"
                  value={otpValue}
                  onChange={(e) => {
                    setOtpError(null);
                    setOtpValue(e.target.value.replace(/\D/g, ''));
                  }}
                  className="w-full text-center h-10 border border-slate-300 focus:outline-none rounded-lg text-lg font-black tracking-widest text-[#00236f]"
                />

                <div className="flex gap-2 text-xs">
                  <button type="button" onClick={() => setShowOTP(false)} className="flex-1 py-2 border rounded-xl text-slate-500 font-bold hover:bg-slate-50">
                    Hủy
                  </button>
                  <button type="submit" className="flex-1 py-2 bg-[#00236f] text-white hover:bg-[#fea619] rounded-xl font-black transition">
                    Xác thực OTP
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. QR Payment Popup Overlay */}
      <AnimatePresence>
        {showPaymentQR && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-[#00113a]/50 backdrop-blur-xs text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-[360px] rounded-2xl shadow-xl p-5 border border-slate-205 space-y-4 text-left"
            >
              <div className="border-b border-slate-100 pb-2.5 text-center">
                <h3 className="text-xs font-black text-[#00236f] uppercase">Cổng thanh toán bảo cọc</h3>
                <span className="text-[10px] text-slate-400">Đóng cọc máy: <strong className="font-mono text-amber-600">{finalTotalAmount.toLocaleString('vi-VN')} VNĐ</strong></span>
              </div>

              <div className="flex justify-center flex-col items-center space-y-2 p-3 bg-slate-50 rounded-xl">
                <div className="w-28 h-28 bg-white border p-1 rounded flex items-center justify-center relative shadow-sm">
                  <QrCode className="w-26 h-26 text-slate-800" />
                  <span className="absolute bottom-0.5 bg-[#00236f] text-white text-[5px] px-1 rounded font-black">VCB AUTO</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold leading-tight">Hướng dẫn: Sử dụng app Bank quét QR nạp bảo cọc nhanh</span>
              </div>

              <div className="flex justify-between gap-2.5 pt-2 text-xs">
                <button type="button" onClick={() => setShowPaymentQR(false)} className="flex-1 py-2 border rounded-xl text-slate-500 font-bold hover:bg-slate-50 text-center">
                  Hủy / Sửa lỗi
                </button>
                <button 
                  type="button" 
                  onClick={handleQRTransferSuccess}
                  disabled={isSubmitting}
                  className="flex-1 py-2 bg-[#00236f] hover:bg-emerald-600 text-white rounded-xl font-black transition text-center"
                >
                  {isSubmitting ? 'Đang duyệt chuyển...' : 'Tôi đã chuyển đặt cọc'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
