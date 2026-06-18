import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, ShieldCheck, ShoppingBag, AlertTriangle, Sparkles } from 'lucide-react';

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
  const [availabilityStatus, setAvailabilityStatus] = useState(null); // 'checking', 'available', 'not-available'
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Tính số ngày thuê
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
    setErrorMsg(null);
    if (!startDate || !endDate) {
      setErrorMsg('Vui lòng thiết lập đầy đủ Ngày nhận và Ngày trả.');
      return;
    }
    if (days <= 0) {
      setErrorMsg('Ngày thuê không hợp lệ. Ngày trả phải diễn ra sau ngày nhận.');
      return;
    }

    setIsCheckingAvailability(true);
    setAvailabilityStatus('checking');

    setTimeout(() => {
      setIsCheckingAvailability(false);
      // Giả sử kho có tối đa 3 chiếc cho mỗi mẫu thiết bị
      if (quantity > 3) {
        setAvailabilityStatus('not-available');
        setErrorMsg('Thiết bị không còn đủ số lượng khả dụng trong kho.');
      } else {
        setAvailabilityStatus('available');
      }
    }, 800);
  };

  const handleSendToCart = () => {
    setErrorMsg(null);

    if (!equipment) {
      setErrorMsg('Mẫu thiết bị không tồn tại.');
      return;
    }

    if (!startDate || !endDate) {
      setErrorMsg('Ngày thuê không hợp lệ. Vui lòng thiết lập đầy đủ Ngày nhận và Ngày trả.');
      return;
    }

    if (days <= 0) {
      setErrorMsg('Ngày thuê không hợp lệ. Ngày nhận phải diễn ra trước ngày trả.');
      return;
    }

    if (quantity <= 0) {
      setErrorMsg('Vui lòng chọn số lượng hợp lệ ít nhất là 1 sản phẩm.');
      return;
    }

    // Kiểm tra số lượng tối đa hỗ trợ trong kho demo (tối đa 3 chiếc khả dụng)
    if (quantity > 3) {
      setErrorMsg('Mẫu thiết bị này không còn đủ số lượng khả dụng trong kho đối với thời hạn được chọn.');
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
  };

  const costTotalRent = equipment.pricePerDay * days * quantity;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 animate-fade-in text-left font-sans" id="equipment-detail-screen">
      
      {/* Nút quay lại danh sách thiết bị */}
      <button
        onClick={onNavigateBack}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#00236f] hover:text-[#fea619] transition bg-white py-1.5 px-3 border border-slate-200 rounded-xl shadow-sm"
      >
        
        Quay lại Danh sách
      </button>

      {/* Grid container chính */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-[#c5c5d3] rounded-2xl p-6 md:p-8 shadow-sm">
        
        {/* Visual Block (Cột Trái - 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="aspect-square bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-4 relative overflow-hidden">
            <img
              src={equipment.image}
              alt={equipment.name}
              className="w-full h-full object-cover rounded-xl"
            />
            <span className="absolute top-4 left-4 bg-emerald-50 text-emerald-800 border border-emerald-250 text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider">
              Khả dụng trong kho
            </span>
          </div>

          {/* Bộ đi kèm (Required Field) */}
          <div className="border border-sky-100 bg-sky-50/50 p-4 rounded-xl text-xs text-sky-900 space-y-2">
            <h4 className="font-extrabold text-sky-950 uppercase text-[10px] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Bộ đi kèm gồm:
            </h4>
            <p className="leading-relaxed font-semibold">
              Bao gồm: 01 túi xách chống sốc chính hãng, 01 sạc nhanh, 01 pin, 01 dây quai đeo và nắp bảo quản thấu kính.
            </p>
          </div>
        </div>

        {/* Info & Booking calculations (Cột Phải - 7 col) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Hãng & Danh mục */}
            <div className="flex items-center gap-2 text-[10px]">
              <span className="font-extrabold text-slate-400 uppercase tracking-widest">{equipment.brand}</span>
              <span className="w-1 rounded-full h-1 bg-slate-350" />
              <span className="font-bold text-[#00236f] uppercase">
                {equipment.category === 'camera' ? 'Máy ảnh' : equipment.category === 'lens' ? 'Ống kính' : 'Thiết bị phụ trợ'}
              </span>
            </div>

            {/* Tên tiêu đề */}
            <h1 className="text-xl md:text-2xl font-black text-[#00236f] tracking-tight leading-tight">
              {equipment.name}
            </h1>

            {/* Mô tả */}
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              {equipment.description || 'Thiết bị cao cấp được nhập khẩu nguyên chiếc và bảo dưỡng định kỳ vô cùng nghiêm ngặt, sensor bóng loáng không hạt bụi, thấu kính không trầy xước, bàn giao sẵn sàng nâng niu từng bức hình tác nghiệp.'}
            </p>

            {/* Khối giá & cọc */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">Giá thuê một ngày</span>
                <strong className="text-base font-black text-[#00236f] font-mono">{equipment.pricePerDay.toLocaleString('vi-VN')}đ / ngày</strong>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">Tiền đặt cọc tối thiểu</span>
                <strong className="text-base font-black text-rose-800 font-mono">{equipment.deposit.toLocaleString('vi-VN')}đ</strong>
              </div>
            </div>

            {/* Phần chọn ngày thuê và số lượng */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-[#ba1a1a] text-xs rounded-lg flex items-center gap-2 font-bold animate-fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <h4 className="text-xs font-black uppercase text-[#00236f] tracking-wide">Cài đặt chu kỳ thuê & Kiểm tra lịch khả dụng</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 text-xs">
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#00236f]" />
                    Ngày nhận thiết bị:
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setAvailabilityStatus(null);
                    }}
                    className="h-10 px-3 bg-slate-50 border border-slate-200 focus:border-[#00236f] focus:outline-none rounded-xl text-xs font-semibold text-slate-800"
                  />
                </div>

                <div className="flex flex-col gap-1 text-xs">
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Ngày trả thiết bị:
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setAvailabilityStatus(null);
                    }}
                    className="h-10 px-3 bg-slate-50 border border-slate-200 focus:border-[#00236f] focus:outline-none rounded-xl text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Bộ chọn số lượng */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className="text-slate-500 font-bold">Số lượng yêu cầu:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                  <button
                    type="button"
                    onClick={() => { setQuantity(prev => Math.max(1, prev - 1)); setAvailabilityStatus(null); }}
                    className="w-8 h-8 flex items-center justify-center font-bold text-slate-500 hover:text-[#00236f] transition"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-black text-slate-800 select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setQuantity(prev => prev + 1); setAvailabilityStatus(null); }}
                    className="w-8 h-8 flex items-center justify-center font-bold text-slate-500 hover:text-[#00236f] transition"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCheckAvailability}
                  disabled={isCheckingAvailability}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-200 transition text-[11px]"
                >
                  {isCheckingAvailability ? 'Đang truy vấn kho...' : 'Kiểm tra phòng thiết bị'}
                </button>
              </div>

              {/* Kết quả kiểm tra trống lịch */}
              {availabilityStatus === 'available' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2 font-bold animate-fade-in">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>✓ Thiết bị này hoàn toàn còn ĐẦY ĐỦ số lượng trống trong suốt chu kỳ đã thiết lập!</span>
                </div>
              )}
              {availabilityStatus === 'not-available' && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-[#ba1a1a] text-xs rounded-lg flex items-center gap-2 font-bold animate-fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-550" />
                  <span>⚠️ Số lượng yêu cầu vượt quá định mức khả dụng trong kho của chu kỳ đã chọn.</span>
                </div>
              )}
            </div>

          </div>

          {/* Phần ước toán và nút CTA */}
          <div className="pt-4 border-t border-slate-150 flex flex-wrap items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">TỐNG TIỀN THUÊ ƯỚC TÍNH ({days} ngày):</span>
              <strong className="text-xl font-black text-[#fea619] font-mono leading-none">
                {days > 0 ? costTotalRent.toLocaleString('vi-VN') : '0_'} VNĐ
              </strong>
            </div>

            <button
              type="button"
              onClick={handleSendToCart}
              disabled={days <= 0 || availabilityStatus === 'not-available'}
              className={`px-6 py-3 bg-[#00236f] text-white rounded-xl text-xs font-black shadow transition flex items-center justify-center gap-1.5 ${
                days > 0 && availabilityStatus !== 'not-available' ? 'hover:bg-[#fea619] hover:text-[#2a1700] active:scale-95' : 'opacity-40 cursor-not-allowed'
              }`}
            >
              
              Thêm thiết bị vào giỏ hàng
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
