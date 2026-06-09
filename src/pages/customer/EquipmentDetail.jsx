import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, ShieldCheck, Heart, ShoppingBag, Star, AlertTriangle, MessageSquare, Sparkles } from 'lucide-react';

export default function EquipmentDetail({
  equipment,
  onNavigateBack,
  onAddToCart,
  user
}) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(null); // 'checking', 'available', 'not-available'

  // Calculate rental duration
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffMs = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setDays(diffDays);
      } else {
        setDays(0);
      }
    } else {
      setDays(0);
    }
  }, [startDate, endDate]);

  const handleCheckAvailability = () => {
    if (!startDate || !endDate) {
      alert('Vui lòng nhập Ngày nhận & Ngày trả máy trước để tra cứu lịch khả dụng!');
      return;
    }
    setIsCheckingAvailability(true);
    setAvailabilityStatus('checking');

    setTimeout(() => {
      setIsCheckingAvailability(false);
      // Let's randomize availability for ultra-authentic realism
      if (equipment.category === 'accessory' || Math.random() > 0.15) {
        setAvailabilityStatus('available');
      } else {
        setAvailabilityStatus('not-available');
      }
    }, 1000);
  };

  const handleSendToCart = () => {
    if (days <= 0) {
      alert('Vui lòng cấu hình kỳ hạn thuê hợp lệ sấp sỉ từ 1 ngày trở lên!');
      return;
    }

    const payload = {
      equipment: equipment,
      startDate: startDate,
      endDate: endDate,
      days: days,
      quantity: quantity
    };

    onAddToCart(payload);
    alert(`Đã xếp ${quantity}x ${equipment.name} vào giỏ hàng thành công!`);
  };

  const costTotalRent = equipment.pricePerDay * days * quantity;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
      {/* Back button link */}
      <button
        onClick={onNavigateBack}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#00236f] hover:text-[#fea619] transition cursor-pointer select-none bg-white py-1.5 px-3 border border-gray-200 rounded-lg shadow-xs"
      >
        <ChevronLeft className="w-4 h-4" />
        Quay lại Danh sách
      </button>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-[#c5c5d3] rounded-2xl p-6 md:p-8 shadow-xs">
        
        {/* Left Column: Visuals & Spec Blocks (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="aspect-square bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center p-6 relative overflow-hidden group shadow-inner">
            <img
              src={equipment.image}
              alt={equipment.name}
              className="w-full h-full object-cover rounded-lg group-hover:scale-[1.02] transition"
            />
            
            {/* Status indicators */}
            <span className="absolute top-4 left-4 bg-green-100 text-green-800 border border-green-300 text-[10px] font-black px-2.5 py-1 rounded uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
              Sẵn sàng bàn giao
            </span>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-4 right-4 w-9 h-9 bg-white border border-gray-200 text-gray-500 rounded-full flex items-center justify-center shadow-md active:scale-90 transition hover:text-red-500 cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>

          {/* Sub Gallery mock placeholder icons */}
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`aspect-square bg-gray-50 border rounded-lg p-1 overflow-hidden cursor-pointer hover:border-[#00236f] transition ${
                  num === 1 ? 'border-[#00236f] ring-2 ring-[#00236f]/10' : 'border-gray-200'
                }`}
              >
                <img
                  src={equipment.image}
                  alt="thumbnail"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ))}
          </div>

          {/* Kit included description block */}
          <div className="border border-sky-100 bg-sky-50/40 p-4 rounded-xl text-xs text-sky-800 space-y-2">
            <h4 className="font-extrabold text-sky-950 uppercase text-[10.5px] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Bộ thiết bị bàn giao kèm theo mặc định:
            </h4>
            <p className="leading-relaxed">
              Sản phẩm bàn giao nguyên trạng bao gồm: 01 pin chính hãng, 01 đốc sạc nhanh, 01 dây đeo chịu lực, 01 túi xách chống shock, và toàn bộ nắp đậy (cap) bảo quản thấu kính/ngàm sensor.
            </p>
          </div>
        </div>

        {/* Right Column: Parameters and Booking Calculations (Span 7) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Breadcrumb info */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-extrabold text-gray-500 uppercase tracking-widest">{equipment.brand}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <span className="font-bold text-[#00236f] uppercase tracking-wide">
                🎨 Category: {equipment.category === 'camera' ? 'Máy ảnh' : equipment.category === 'lens' ? 'Ống kính' : 'Phụ trợ ghi hình'}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-[#111827] leading-tight">
              {equipment.name}
            </h1>

            {/* Rating Stars mock */}
            <div className="flex items-center gap-1 select-none">
              <div className="flex text-[#fea619]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs text-gray-400 font-bold ml-1.5">(4.9/5 • 48 lượt thuê trước đó)</span>
            </div>

            <p className="text-xs text-[#444651] leading-relaxed">
              {equipment.description || 'Dòng thiết bị cao cấp nhất được bảo dưỡng kỹ càng định kỳ hàng tuần tại T-Rent. Sensor sạch sẽ không điểm chết, kính lens không mốc xước, đem lại sự an tâm tuyệt đối khi bấm máy tại hiện trường dã ngoại.'}
            </p>

            {/* Price Box */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">Mức giá thuê ngày</span>
                <strong className="text-xl font-black text-[#00236f]">{equipment.pricePerDay.toLocaleString('vi-VN')} VNĐ / ngày</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">Cọc bảo lãnh thu thế</span>
                <strong className="text-lg font-bold text-gray-700">{equipment.deposit.toLocaleString('vi-VN')}đ</strong>
              </div>
            </div>

            {/* Specifications Details */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-[#00236f] tracking-wider mb-2">Thông tin kỹ thuật cấu tạo</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(equipment.specs || ['Độ ổn định cao', 'Nhỏ gọn chuyên nghiệp', 'Chuẩn chân nắp cắm lắp rạp']).map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 py-1 border-b border-gray-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-[#444651]">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Date picking Selection */}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <h4 className="text-xs font-black uppercase text-[#00236f] tracking-wider">Cài đặt chu kỳ thuê & Kiểm tra lịch trống</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-bold text-[#444651] uppercase flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#00236f]" />
                    Nhận thiết bị từ ngày:
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setAvailabilityStatus(null);
                    }}
                    className="w-full h-11 px-3 bg-gray-50 border border-gray-300 focus:border-[#00236f] focus:outline-none rounded-lg text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-bold text-[#444651] uppercase flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#fea619]" />
                    Trả thiết bị từ ngày:
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setAvailabilityStatus(null);
                    }}
                    className="w-full h-11 px-3 bg-gray-50 border border-gray-300 focus:border-[#00236f] focus:outline-none rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-600">Số lượng máy:</span>
                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 flex items-center justify-center font-bold text-gray-500 hover:text-[#00236f] transition"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-gray-800 select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="w-8 h-8 flex items-center justify-center font-bold text-gray-500 hover:text-[#00236f] transition"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCheckAvailability}
                  disabled={isCheckingAvailability}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg border border-gray-300 transition"
                >
                  {isCheckingAvailability ? 'Đang truy suất...' : 'Check trống lịch thiết lập'}
                </button>
              </div>

              {/* Availability response block */}
              {availabilityStatus === 'available' && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-lg flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="font-bold">✓ Thiết bị này hoàn toàn còn ĐẦY ĐỦ số lượng trống trong suốt chu kỳ kén chọn!</span>
                </div>
              )}
              {availabilityStatus === 'not-available' && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="font-bold">⚠️ Có lịch booking khác chen lấn vào thời gian này. Vui lòng dời ngày hoặc chọn thiết bị đổi thế!</span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing calculations total check out panel & CTA */}
          <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] text-gray-500 block font-bold uppercase">ƯỚC LƯỢNG TIỀN THUÊ ({days} ngày):</span>
              <strong className="text-2xl font-black text-amber-600">
                {days > 0 ? costTotalRent.toLocaleString('vi-VN') : '0_'} VNĐ
              </strong>
            </div>

            <div className="flex gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={handleSendToCart}
                disabled={days <= 0}
                className={`flex-1 md:flex-none px-6 py-3 bg-[#00236f] text-white rounded-xl text-xs font-black shadow transition flex items-center justify-center gap-1.5 ${
                  days > 0 ? 'hover:bg-[#fea619] hover:text-[#2a1700] active:scale-95' : 'opacity-40 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                THUÊ NGAY & XẾP GIỎ HÀNG
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
