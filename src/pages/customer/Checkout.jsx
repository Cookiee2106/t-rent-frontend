import React, { useState } from 'react';
import { ShieldCheck, Calendar, MapPin, DollarSign, Wallet, FileText, ChevronLeft, Sparkles } from 'lucide-react';

export default function Checkout({
  user,
  userVerified,
  checkoutData,
  onSubmitOrder,
  onCancelCheckout
}) {
  const [orderNote, setOrderNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!checkoutData) return null;

  const { subtotal, depositTotal, discountValue, finalTotalAmount, items } = checkoutData;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      
      // Creating booking array
      const codes = items.map(it => {
        const orderCode = 'TR-' + Math.floor(10000 + Math.random() * 90000);
        return {
          id: orderCode,
          order_code: orderCode,
          equipment: it.equipment,
          startDate: it.startDate,
          endDate: it.endDate,
          deposit: it.equipment.deposit * it.quantity,
          totalPrice: it.equipment.pricePerDay * it.days * it.quantity,
          status: 'pending',
          createdAt: new Date().toISOString().split('T')[0],
          rental_days: it.days,
          quantity: it.quantity,
          note: orderNote || 'Không có ghi chú thêm.'
        };
      });

      onSubmitOrder(codes);
      alert('Tạo đơn hàng thành công trực tuyến! Vui lòng chuyển khoản tiền cọc hiển thị hiển nhiên để showroom bảo chứng giữ giữ chỗ!');
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 animate-fade-in">
      <button
        onClick={onCancelCheckout}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#00236f] hover:text-[#fea619] transition bg-white py-1.5 px-3 border border-gray-200 rounded-lg shadow-inner select-none cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        Quay lại Giỏ hàng
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#00236f] font-sans">XÁC NHẬN ĐƠN THUÊ BIÊN NHẬN</h1>
        <p className="text-sm text-gray-400">Rà soát lại danh tính, địa chỉ, trang thiết bị và giá thỏa cọc trước khi kích hoạt ký kết hợp đồng.</p>
      </div>

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LHS Fields (Col 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Customer Identity details */}
          <div className="bg-white border border-[#c5c5d3] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase text-[#00236f] tracking-wider border-b border-gray-100 pb-2.5">
              1. Thông tin pháp nhân khách thuê
            </h3>

            <div className="flex flex-wrap items-center justify-between gap-2.5 bg-gray-50 p-4 rounded-xl border border-gray-150">
              <div className="space-y-1">
                <span className="text-[11px] text-gray-400 block font-bold">Trạng thái định danh khách hàng:</span>
                <span className="text-sm font-extrabold text-gray-800">{user?.name || 'Khách hàng Demo'} ({user?.email})</span>
              </div>
              
              {userVerified ? (
                <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-xs font-black px-3 py-1 rounded-full shadow-sm select-none">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  ĐÃ XÁC MINH CÔNG DÂN
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-extrabold px-3 py-1.5 rounded-full select-none text-right">
                  ⚠️ CHƯA XÁC MINH (CẦN UPDATE KYC)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-gray-650">
              <div className="space-y-1">
                <span className="text-gray-400 font-bold block">Địa điểm nhận máy trực tiếp:</span>
                <span className="text-slate-800 font-extrabold flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  Showroom T-Rent TR-Phú Nhuận, Hồ Chí Minh
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400 font-bold block">Dịch vụ bàn giao linh động tháp ráp:</span>
                <span className="text-slate-800 font-extrabold flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-[#fea619] shrink-0" />
                  Free lắp ráp test sensor & kỹ thuật hướng dẫn setup
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Booked list */}
          <div className="bg-white border border-[#c5c5d3] rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <h3 className="text-xs font-black uppercase text-[#00236f] tracking-wider select-none">
                2. Danh sách thiết bị quay chụp đề đặt giữ chỗ
              </h3>
            </div>

            <div className="divide-y divide-gray-100 text-xs font-medium">
              {items.map((it, i) => (
                <div key={i} className="p-4 flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1.5 border border-gray-200">
                      <img src={it.equipment.image} alt={it.equipment.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-[#111827]">{it.equipment.name}</h4>
                      <div className="text-[10px] text-gray-400 flex items-center gap-1 select-none font-bold">
                        <Calendar className="w-3.5 h-3.5 text-[#00236f]" />
                        Thuê {it.days} ngày ({it.startDate} đến {it.endDate}) • Số lượng: {it.quantity || 1}x
                      </div>
                    </div>
                  </div>
                  <div className="text-right whitespace-nowrap shrink-0">
                    <span className="font-black text-[#00236f] block">
                      {(it.equipment.pricePerDay * it.days * (it.quantity || 1)).toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-[10.5px] text-gray-400">
                      Cọc: {(it.equipment.deposit * (it.quantity || 1)).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Notes for rental */}
          <div className="bg-white border border-[#c5c5d3] rounded-2xl p-6 shadow-xs space-y-3.5 select-none">
            <h3 className="text-xs font-black uppercase text-[#00236f] tracking-wider border-b border-gray-100 pb-2.5">
              3. Ghi chú yêu cầu kỹ thuật & Hợp đồng thuê máy
            </h3>
            <p className="text-[10.5px] text-gray-400 leading-relaxed font-semibold">
              Quý khách vui lòng viết ghi chú nếu có nhu cầu lấy thêm jack chuyển đổi, chân máy ảnh rã ráp mượn free, hoặc lắp ráp thiết bị sẵn trước khi qua quầy showroom thu hồi.
            </p>
            <textarea
              rows={3}
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Ví dụ: Cần showroom pin sạc đầy đủ sạc sẵn 100% trước giờ lấy, hỗ trợ mượn thêm chân máy cơ ảnh chống rung bập bùng..."
              className="w-full p-3.5 bg-gray-50 border border-gray-300 focus:border-[#00236f] focus:outline-none rounded-xl text-xs font-semibold leading-relaxed"
            />
          </div>

        </div>

        {/* RHS Billing calculations panel (Col 4) */}
        <div className="lg:col-span-4 select-none">
          <div className="bg-white border border-[#c5c5d3] rounded-2xl p-6 shadow-xs space-y-5 sticky top-24">
            <h3 className="text-base font-black text-[#00236f] border-b border-gray-150 pb-3">
              CHI TIẾT THANH TOÁN
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-gray-500 font-semibold">
                <span>Tiền thuê máy ảnh:</span>
                <span className="font-bold text-[#111827]">{subtotal.toLocaleString('vi-VN')} VNĐ</span>
              </div>

              <div className="flex justify-between items-center text-gray-500 font-semibold">
                <span>Cọc thế chấp hoàn trả:</span>
                <span className="font-bold text-gray-600">{depositTotal.toLocaleString('vi-VN')} VNĐ</span>
              </div>

              {discountValue > 0 && (
                <div className="flex justify-between items-center text-green-700 font-bold">
                  <span>Khuyến mãi Voucher:</span>
                  <span>- {discountValue.toLocaleString('vi-VN')} VNĐ</span>
                </div>
              )}

              <div className="border-t border-dashed border-gray-200 my-4"></div>

              <div className="space-y-1 bg-[#dce1ff]/20 p-3.5 rounded-xl border border-dashed border-[#b6c4ff]/70 text-xs">
                <div className="flex justify-between items-center font-black text-[#00236f]">
                  <span>SỐ TIỀN CỌC GIỮ CHỖ:</span>
                  <span className="text-lg font-black text-amber-600">
                    {finalTotalAmount.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 block text-right">
                  (Tiền Thuê máy + Thế cọc máy)
                </span>
              </div>
            </div>

            {/* Contract alerts message */}
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-[10px] text-indigo-800 leading-relaxed font-semibold">
              <FileText className="w-4.5 h-4.5 text-indigo-600 shrink-0 inline mr-1 mb-0.5" />
              Bảo chứng an toàn: Khách hàng hoàn toán được nhận hoàn cọc tức tốc 100% tại quầy ngay khi showroom nhận bàn bàn bàn trả lại trang thiết bị lành lặn nguyên vẹn.
            </div>

            {/* Checkout Form submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] text-xs font-black rounded-xl shadow-md transition-all duration-2.5 shrink-0 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              🚀 TIẾN HÀNH DUYỆT TÙY CỌC
            </button>

            <div className="text-[9.5px] text-gray-400 text-center leading-relaxed font-medium">
              Nhấp Tạo đơn đồng nghĩa với việc bạn đồng ý với các Điều khoản & Quy chế thỏa ước dân sự bàn thuê máy tại T-Rent.
            </div>

          </div>
        </div>

      </form>
    </div>
  );
}
