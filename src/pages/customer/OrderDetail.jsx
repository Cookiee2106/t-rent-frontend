import React, { useState } from 'react';
import { ChevronLeft, Landmark, FileText, CheckCircle2, Clock, MapPin, Download, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import TermsModal from '../../components/common/TermsModal';
import OTPModal from '../../components/common/OTPModal';
import PaymentModal from '../../components/common/PaymentModal';

export default function OrderDetail({
  order,
  onNavigateBack,
  onPaymentSuccess
}) {
  const [showTerms, setShowTerms] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showPaymentQR, setShowPaymentQR] = useState(false);

  // Flow step routing
  const handleStartPaymentFlow = () => {
    if (order.status !== 'pending') {
      alert('Đơn hàng của bạn đã được cọc bảo lãnh thành công và đang chuyển giao giữ chỗ!');
      return;
    }
    setShowTerms(true);
  };

  const handleTermsAccepted = () => {
    setShowTerms(false);
    setShowOTP(true);
  };

  const handleOTPVerified = () => {
    setShowOTP(false);
    setShowPaymentQR(true);
  };

  const handleQRTransferSuccess = () => {
    setShowPaymentQR(false);
    onPaymentSuccess(order.id); // set status to 'active' or 'paid'
  };

  const getStepStatus = (stepIndex, status) => {
    // pending -> steps: 0 done, 1 active, 2,3,4 pending
    // active/paid -> steps: 0, 1 done, 2 active, 3,4 pending
    // completed -> steps: 0,1,2,3,4 done
    const isPaid = status === 'active' || status === 'completed';
    const isDone = status === 'completed';

    if (isDone) return 'done';
    if (isPaid) {
      if (stepIndex <= 1) return 'done';
      if (stepIndex === 2) return 'active';
      return 'pending';
    } else {
      if (stepIndex === 0) return 'done';
      if (stepIndex === 1) return 'active';
      return 'pending';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fade-in font-sans">
      <button
        onClick={onNavigateBack}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#00236f] hover:text-[#fea619] transition bg-white py-1.5 px-3 border border-gray-200 rounded-lg shadow-sm select-none cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        Quay lại đơn hàng đặt thuê
      </button>

      {/* Header code info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white border border-[#c5c5d3] p-5 rounded-2xl shadow-xs select-none">
        <div>
          <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider mb-1">Mã tham chiếu thanh toán:</span>
          <h1 className="text-2xl font-black text-[#00236f] tracking-tight">Chi tiết đơn thuê #{order.order_code || order.id}</h1>
          <span className="text-xs text-gray-450 block mt-0.5">Khởi tạo ngày: {order.createdAt || '2026-06-09'}</span>
        </div>

        <div className="flex items-center gap-2">
          {order.status === 'pending' ? (
            <span className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 border border-amber-300 text-amber-700 text-xs font-black rounded-full select-none animate-pulse">
              <Clock className="w-4 h-4 shrink-0" />
              CHỜ THANH TOÁN CỌC
            </span>
          ) : order.status === 'active' ? (
            <span className="flex items-center gap-1.5 px-4 py-2 bg-green-50 border border-green-300 text-green-700 text-xs font-black rounded-full select-none">
              <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
              ĐÃ CỌC GIỮ CHỖ
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 border border-blue-300 text-blue-700 text-xs font-black rounded-full select-none">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              ĐÃ HOÀN TẤT THUÊ
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LHS Side contents (Col 8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Stepper block */}
          <div className="bg-white border border-[#c5c5d3] p-6 rounded-2xl shadow-xs select-none">
            <h3 className="text-xs font-extrabold text-[#00236f] uppercase tracking-wider block border-b border-gray-100 pb-3.5 mb-6">
              Quy trình hoàn chỉnh thủ tục biên nhận máy
            </h3>

            {/* Stepper graphic rendering */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 text-center text-[10.5px] font-bold">
              {[
                { name: 'Tạo đơn hàng', desc: '✓ Thành công' },
                { name: 'Thanh toán cọc', desc: 'Duyệt chỗ' },
                { name: 'Chuẩn bị máy', desc: 'Kho kỹ thuật' },
                { name: 'Ký hợp đồng', desc: 'Showroom quầy' },
                { name: 'Khởi bàn bàn giao', desc: 'Nhận máy ảnh' }
              ].map((step, idx) => {
                const s = getStepStatus(idx, order.status);
                let bgCircle = 'bg-gray-100 text-gray-400 border-gray-200';
                let activeBar = 'bg-gray-200';

                if (s === 'done') {
                  bgCircle = 'bg-green-100 text-green-800 border-green-300 ring-4 ring-green-50';
                  activeBar = 'bg-green-550';
                } else if (s === 'active') {
                  bgCircle = 'bg-[#00236f] text-white border-[#00236f] ring-4 ring-[#00236f]/10';
                  activeBar = 'bg-indigo-300 animate-pulse';
                }

                return (
                  <div key={idx} className="space-y-2.5 relative flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full border flex items-center justify-center font-black ${bgCircle}`}>
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#111827] block tracking-tight leading-none">{step.name}</h4>
                      <span className={`text-[9.5px] block mt-0.5 ${s === 'done' ? 'text-green-700 font-bold' : 'text-gray-400'}`}>{step.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Equipment details list */}
          <div className="bg-white border border-[#c5c5d3] rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 bg-gray-50 border-b border-gray-100 select-none">
              <h3 className="text-xs font-black uppercase text-[#00236f] tracking-wider">
                DANH SÁCH THIẾT BỊ ĐÃ KHỚP LỆCH
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2.5 border border-gray-100 shadow-inner">
                  <img src={order.equipment.image} alt={order.equipment.id} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1.5 text-xs font-semibold">
                  <span className="text-[9px] bg-[#dce1ff] text-[#00236f] px-1.5 py-0.5 rounded font-black tracking-wide uppercase">{order.equipment.brand}</span>
                  <h3 className="text-sm font-black text-[#111827] leading-snug">{order.equipment.name}</h3>
                  <p className="text-[10px] text-gray-550">{order.equipment.description || 'Thiết bị chuyên dùng chụp ngoại cảnh, cho chất lượng file ảnh tối tân sắc sảo.'}</p>
                </div>
              </div>

              {/* Date times block bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 border border-gray-150 rounded-xl text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-400 uppercase font-black tracking-tight block">Kỳ hạn nhận bàn giao:</span>
                  <strong className="text-gray-800 font-extrabold flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                    Từ {order.startDate} (Nhận quầy Phú Nhuận)
                  </strong>
                </div>

                <div className="space-y-0.5 text-left sm:text-right">
                  <span className="text-[10px] text-gray-400 uppercase font-black tracking-tight block">Thời hạn thanh hoàn:</span>
                  <strong className="text-gray-800 font-extrabold block">
                    Đến trước 21:00 ngày {order.endDate} ({order.rental_days || 2} ngày thuê)
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Legal doc rules & terms contract */}
          <div className="bg-white border border-[#c5c5d3] p-6 rounded-2xl shadow-xs space-y-3.5 select-none text-xs">
            <h3 className="text-xs font-black uppercase text-[#00236f] tracking-wider border-b border-gray-100 pb-2.5 flex justify-between items-center">
              HỢP ĐỒNG QUY CHẾ KÝ KẾT DÂN SỰ
              <button onClick={() => alert('Đang tải bản nháp PDF hợp đồng dịch vụ... Sẵn sàng!')} className="text-[10.5px] font-extrabold text-[#00236f] hover:text-[#fea619] transition flex items-center gap-1 cursor-pointer">
                <Download className="w-4 h-4 shrink-0" />
                Bản nháp PDF
              </button>
            </h3>

            <p className="text-gray-500 leading-relaxed font-semibold">
              Khách hàng sau khi chuyển tiền đóng cọc giữ chỗ sẽ được kích hoạt Lệnh giữ máy an toàn 100%. Khi qua đại lý, hai bên tiến hành kiểm định kỹ thuật (Test Sensor, thấu kính camera), kí kết phiên hợp đồng giấy in sẵn tiện lợi của T-Rent trong 2 phút.
            </p>

            <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl space-y-1 block leading-relaxed font-bold text-[#444651]">
              <span className="block text-[#00236f] font-black uppercase text-[10px] mb-1">Ghi chú lập phiếu hợp đồng:</span>
              <span>{order.note || 'Không có ghi chú đặc thù.'}</span>
            </div>
          </div>
        </div>

        {/* RHS payment summary block (Col 4) */}
        <div className="lg:col-span-4 select-none">
          <div className="bg-white border border-[#c5c5d3] rounded-2xl p-6 shadow-xs space-y-5 sticky top-24">
            <h3 className="text-base font-black text-[#00236f] border-b border-gray-150 pb-3">
              TIỀN ĐẶT HOÀN CỌC
            </h3>

            <div className="space-y-3.5 text-xs font-semibold">
              <div className="flex justify-between items-center text-gray-500">
                <span>Giá chi phí thuê máy:</span>
                <span className="font-bold text-[#111827]">{order.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
              </div>

              <div className="flex justify-between items-center text-gray-500">
                <span>Giá cọc bảo lãnh máy:</span>
                <span className="font-bold text-[#111827]">{order.deposit.toLocaleString('vi-VN')} VNĐ</span>
              </div>

              <div className="border-t border-dashed border-gray-150 my-3"></div>

              <div className="space-y-1.5 p-3.5 bg-[#dce1ff]/30 text-xs border border-dashed border-[#b6c4ff] rounded-xl">
                <div className="flex justify-between items-center font-black text-[#00236f]">
                  <span>TỔNG TIỀN CỌC GIỮ CHỖ:</span>
                  <span className="text-lg font-black text-amber-600">
                    {(order.totalPrice + order.deposit).toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
                <span className="text-[9.5px] text-gray-400 block text-right">
                  (Hoàn trả 100% khi bàn trả thiết bị đầy đủ)
                </span>
              </div>
            </div>

            {/* Instruction banner pending */}
            {order.status === 'pending' ? (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-205 flex gap-2 text-[10px] text-amber-900 leading-relaxed font-bold">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Cọc giữ máy của quý khách CHƯA ĐƯỢC KÍ HOẠT. Vui lòng đóng cọc trực tuyến để showroom giữ chỗ 100%.</span>
              </div>
            ) : (
              <div className="p-3 bg-green-50 rounded-xl border border-green-205 flex gap-2 text-[10px] text-green-900 leading-relaxed font-bold">
                <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                <span>✓ Hợp đồng giữ máy ĐÃ BẢO LƯU THÀNH CÔNG. Vui lòng mang CCCD qua showroom nhận bàn giao theo lịch hẹn.</span>
              </div>
            )}

            {/* Interactive Payment CTAs */}
            {order.status === 'pending' ? (
              <button
                onClick={handleStartPaymentFlow}
                className="w-full py-4 bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] text-xs font-black rounded-xl shadow transition duration-200 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                THANH TOÁN ĐẶT CỌC GIỮ CHỖ
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            ) : (
              <button
                disabled
                className="w-full py-4 bg-green-150 text-green-800 text-xs font-black rounded-xl border border-green-200 cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                ĐÃ HOÀN TẤT THANH TOÁN
              </button>
            )}

            <div className="text-[9.5px] text-gray-400 text-center select-none leading-relaxed font-medium">
              Bạn có thắc mắc kỹ thuật? Hãy gọi ngay Hotline <strong className="text-[#00236f]">090.1234.567</strong> hỗ trợ nhanh 24/7.
            </div>

          </div>
        </div>

      </div>

      {/* Verification terms flow modals overlays popup */}
      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={handleTermsAccepted}
      />

      <OTPModal
        isOpen={showOTP}
        onClose={() => setShowOTP(false)}
        onVerified={handleOTPVerified}
      />

      <PaymentModal
        isOpen={showPaymentQR}
        onClose={() => setShowPaymentQR(false)}
        orderCode={order.order_code || order.id}
        amount={order.totalPrice + order.deposit}
        onPaymentSuccess={handleQRTransferSuccess}
      />
    </div>
  );
}
