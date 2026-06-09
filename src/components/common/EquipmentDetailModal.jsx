import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Wallet, ShoppingCart, HelpCircle, ShieldAlert, CheckCircle } from 'lucide-react';

export default function EquipmentDetailModal({
  equipment,
  onClose,
  user,
  onBookingCreated,
  setActivePage
}) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState(0);
  const [showOrderSuccessOverlay, setShowOrderSuccessOverlay] = useState(false);
  const [successOrderDetails, setSuccessOrderDetails] = useState(null);

  // Calculate rental days based on dates selection
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const differenceInMs = end.getTime() - start.getTime();
      const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
      
      if (differenceInDays > 0) {
        setDays(differenceInDays);
      } else {
        setDays(0);
      }
    } else {
      setDays(0);
    }
  }, [startDate, endDate]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Vui lòng đăng nhập hệ thống để thực hiện đặt lịch thuê thiết bị!');
      setActivePage('login');
      onClose();
      return;
    }

    if (days <= 0) {
      alert('Vui lòng cấu hình ngày nhận máy và ngày trả máy hợp lệ (ngày trả tối thiểu sau ngày nhận 1 ngày).');
      return;
    }

    const priceSum = equipment.pricePerDay * days;
    const depositSum = equipment.deposit;
    const generatedOrderCode = 'TR-' + Math.floor(10000 + Math.random() * 90000);

    const newOrder = {
      id: generatedOrderCode,
      order_code: generatedOrderCode,
      customer_id: '86ae940c-0da5-46fd-bcc5-74889c19bfff',
      startDate: startDate,
      endDate: endDate,
      totalPrice: priceSum,
      deposit: depositSum,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      equipment: equipment,
      rental_days: days,
      total_rental_amount: priceSum,
      total_deposit_amount: depositSum
    };

    onBookingCreated(newOrder);
    setSuccessOrderDetails(newOrder);
    setShowOrderSuccessOverlay(true);
  };

  const handleSuccessOverlayProceed = () => {
    setShowOrderSuccessOverlay(false);
    onClose();
    setActivePage('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentTotalRental = equipment.pricePerDay * days;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-[#c5c5d3] max-h-[90vh] flex flex-col relative"
        id="detailModal"
      >
        {/* Main Header Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-gray-100 hover:bg-red-50 text-[#444651] hover:text-red-600 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-grow overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Visual media preview block left (Column Span 5) */}
            <div className="md:col-span-5 space-y-6">
              <div className="aspect-square bg-gray-50 border border-[#c5c5d3] rounded-xl flex items-center justify-center p-6 shadow-inner relative overflow-hidden">
                <img alt={equipment.name} src={equipment.image} className="w-full h-full object-cover rounded-lg" />
                <span className="absolute bottom-3 left-3 bg-[#00236f]/90 text-white text-[10px] font-extrabold px-2.5 py-1 rounded uppercase">
                  {equipment.brand}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#00236f] mb-3">Thông số kỹ thuật</h4>
                <ul className="text-xs text-[#444651] space-y-2">
                  {equipment.specs && equipment.specs.map((val, key) => (
                    <li key={key} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#fea619] shrink-0" />
                      {val}
                    </li>
                  ))}
                  {!equipment.specs && (
                    <>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#fea619] shrink-0" />
                        Trọng lượng gọn nhẹ, hiệu suất vượt trội.
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#fea619] shrink-0" />
                        Độ tương thích cao với hệ thống T-Rent.
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Core detail logic description and booking form right (Column Span 7) */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                {/* Brand and category status info */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-extrabold text-[#757682] uppercase tracking-wider">{equipment.brand}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="text-xs font-bold text-[#00236f] capitalize">{equipment.category === 'camera' ? 'Máy ảnh' : equipment.category === 'lens' ? 'Ống kính' : 'Thiết bị phụ sản xuất'}</span>
                </div>

                <h2 className="text-xl md:text-2xl font-black text-[#111827] leading-tight mb-4">
                  {equipment.name}
                </h2>

                <p className="text-xs text-[#444651] leading-relaxed mb-6">
                  {equipment.description || 'Sản phẩm cao cấp tại hệ thống của chúng tôi, luôn được vệ sinh kiểm định sensor và thấu kính kỹ định kỳ để đem lại chất lượng quay tuyệt mật cho dự án.'}
                </p>

                {/* Base pricing highlight rates card */}
                <div className="grid grid-cols-2 gap-4 bg-[#dce1ff]/30 border border-[#c5c5d3]/40 rounded-xl p-4 mb-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#444651] block mb-1">Giá thuê ngày</span>
                    <strong className="text-lg font-black text-[#00236f]">{equipment.pricePerDay.toLocaleString('vi-VN')}đ / ngày</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#444651] block mb-1">Mức thế cọc giữ máy</span>
                    <strong className="text-lg font-bold text-[#444651]">{equipment.deposit.toLocaleString('vi-VN')}đ</strong>
                  </div>
                </div>

                {/* Booking Interactive dates Selector Form */}
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#00236f] block border-b border-gray-100 pb-2">Lập phiếu yêu cầu thuê máy</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#444651] uppercase flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#00236f]" />
                        Ngày nhận máy:
                      </label>
                      <input 
                        type="date" 
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full h-11 px-3 bg-gray-50 border border-[#c5c5d3] focus:border-[#00236f] focus:outline-none rounded-lg text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#444651] uppercase flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#fea619]" />
                        Ngày trả máy:
                      </label>
                      <input 
                        type="date" 
                        required
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        className="w-full h-11 px-3 bg-gray-50 border border-[#c5c5d3] focus:border-[#00236f] focus:outline-none rounded-lg text-xs font-semibold"
                      />
                    </div>
                  </div>

                  {/* Temporary math calculations summary breakdown */}
                  {days > 0 && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="bg-gray-100 p-4 rounded-xl border border-gray-200 mt-4 text-xs text-[#444651] space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span>Số ngày thuê dự kiến:</span>
                        <span className="font-extrabold text-[#00236f]">{days} ngày</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tổng chi phí thuê ({days} ngày):</span>
                        <span className="font-bold text-[#111827]">{currentTotalRental.toLocaleString('vi-VN')}đ</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Giá thế chấp đặt cọc hoàn trả:</span>
                        <span className="font-semibold text-gray-500">{equipment.deposit.toLocaleString('vi-VN')}đ</span>
                      </div>
                      
                      <div className="border-t border-dashed border-gray-300 my-2"></div>
                      
                      <div className="flex justify-between items-center text-sm font-black text-[#00236f]">
                        <span>Tổng hóa đơn đặt cọc dự kiến:</span>
                        <span>{(currentTotalRental + equipment.deposit).toLocaleString('vi-VN')}đ</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Submit actions */}
                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <button 
                      type="submit"
                      className="flex-grow py-3 px-6 bg-[#fea619] hover:bg-[#fea619]/90 text-[#2a1700] hover:scale-[1.01] active:scale-[0.98] text-xs font-black rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Gửi bảo chứng & Book thuê ngay
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => {
                        if (days <= 0) {
                          alert('Vui lòng chọn ngày nhận và trả máy để tính thời lượng cọc!');
                          return;
                        }
                        // Fire a custom alert indicating the equipment has been configured inside standard applet props
                        alert('Đã thêm sản phẩm tạm đặt vào giỏ tạm tính phía trên cùng!');
                        onClose();
                      }}
                      className="px-6 py-3 border border-[#00236f] text-[#00236f] hover:bg-[#00236f] hover:text-white text-xs font-bold rounded-lg transition active:scale-[0.98]"
                    >
                      Đặt vào giỏ hàng
                    </button>
                  </div>
                </form>
              </div>

              {/* Bottom security assurance memo rules */}
              <div className="flex items-start gap-2.5 text-[10px] text-[#757682] select-none leading-relaxed bg-[#f8f9fa] p-3 rounded-lg border border-gray-100">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Số tiền đặt thế cọc máy được cam kết bảo lưu an toàn 100% trong suốt kỳ hạn thuê. Hệ thống showroom cam kết hoàn tiền thế cọc tức tốc trong 5 phút ngay khi nghiệm thu thiết bị bàn trả nguyên trạng.</span>
              </div>
            </div>

          </div>
        </div>

        {/* Order booking Success Modal inside detail modal (Exact Mock Template visualization) */}
        <AnimatePresence>
          {showOrderSuccessOverlay && successOrderDetails && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#00113a]/90 flex items-center justify-center z-50 p-6 backdrop-blur-sm"
              id="orderSuccessOverlay"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white w-full max-w-md rounded-2xl p-6 md:p-8 text-center shadow-2xl space-y-6 text-[#111827]"
              >
                <div className="w-16 h-16 bg-blue-100 text-[#00236f] rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <CheckCircle className="w-9 h-9" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-[#00236f] font-display">Tạo đơn thuê thành công</h3>
                  <p className="text-xs text-[#444651]">
                    Đơn hàng thuê máy ảnh của bạn đã được đăng ký và lưu trữ trực tuyến thành công với trạng thái <strong className="text-amber-600 bg-amber-50 rounded px-1.5 py-0.5 border border-amber-200">Chờ duyệt cọc</strong>
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs text-left space-y-2 text-[#444651]">
                  <div className="flex justify-between font-bold text-gray-500">
                    <span>Mã Đơn Code:</span>
                    <span className="text-[#00236f] font-black">{successOrderDetails.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thiết bị đã thuê:</span>
                    <span className="font-extrabold max-w-[200px] truncate">{successOrderDetails.equipment.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kỳ hạn đặt lịch:</span>
                    <span>Từ {successOrderDetails.startDate} đến {successOrderDetails.endDate} ({successOrderDetails.rental_days} ngày)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hình thức cọc đề nghị:</span>
                    <span className="font-bold text-[#00236f]">{successOrderDetails.deposit.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-[#00236f] pt-1.5 border-t border-dashed border-gray-200">
                    <span>Cộng thanh toán thuê máy:</span>
                    <span>{successOrderDetails.totalPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>

                <div className="text-[10px] text-gray-400 select-none text-center">
                  Vui lòng chuẩn bị tiền cọc hoặc giấy tờ sở hữu hợp lệ tương thích để mang tới showroom bàn giao nhận lắp ráp thiết bị.
                </div>

                <button 
                  type="button"
                  onClick={handleSuccessOverlayProceed}
                  className="w-full py-3.5 bg-[#fea619] hover:bg-[#fea619]/90 text-[#2a1700] font-black rounded-lg transition active:scale-[0.98] shadow-md text-xs"
                >
                  Xác nhận & Đi tới Đơn hàng của tôi
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
