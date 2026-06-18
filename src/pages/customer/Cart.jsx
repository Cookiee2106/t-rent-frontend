import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Calendar, 
  AlertCircle, 
  Check, 
  ArrowRight,
  ChevronLeft
} from 'lucide-react';

export default function Cart({
  cartItems,
  onRemoveItem,
  onProceedToCheckout,
  setActivePage
}) {
  const [localItems, setLocalItems] = useState([]);
  const [validationError, setValidationError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Đồng bộ hóa với cartItems từ App.jsx
  useEffect(() => {
    setLocalItems(cartItems.map(item => ({
      ...item,
      quantity: item.quantity || 1
    })));
  }, [cartItems]);

  const handleQtyChange = (idx, newQty) => {
    setValidationError(null);
    setUpdateSuccess(false);
    if (newQty < 1) return;

    const updated = [...localItems];
    updated[idx].quantity = Number(newQty);
    setLocalItems(updated);
  };

  const handleDateChange = (idx, field, val) => {
    setValidationError(null);
    setUpdateSuccess(false);
    const updated = [...localItems];
    updated[idx][field] = val;

    if (updated[idx].startDate && updated[idx].endDate) {
      const start = new Date(updated[idx].startDate);
      const end = new Date(updated[idx].endDate);
      const diffMs = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      updated[idx].days = diffDays > 0 ? diffDays : 0;
    } else {
      updated[idx].days = 0;
    }

    setLocalItems(updated);
  };

  // Nút Cập nhật giỏ hàng
  const handleUpdateCart = () => {
    setValidationError(null);
    setUpdateSuccess(false);

    for (let i = 0; i < localItems.length; i++) {
      const item = localItems[i];
      
      if (!item.startDate || !item.endDate) {
        setValidationError(`Vui lòng nhập đầy đủ Ngày nhận và Ngày trả cho thiết bị "${item.equipment.name}".`);
        return;
      }

      if (item.days <= 0) {
        setValidationError(`Ngày thuê không hợp lệ ở thiết bị "${item.equipment.name}". Ngày nhận phải diễn ra trước ngày trả.`);
        return;
      }

      if (item.quantity <= 0) {
        setValidationError(`Số lượng thuê không hợp lệ ở thiết bị "${item.equipment.name}". Vui lòng chọn ít nhất 1 sản phẩm.`);
        return;
      }

      // Giới hạn max 3 chiếc khả dụng trong kho để đồng bộ với page Detail
      if (item.quantity > 3) {
        setValidationError(`Rất tiếc, thiết bị "${item.equipment.name}" không còn đủ số lượng khả dụng trong kho (tối đa 3 chiếc).`);
        return;
      }
    }

    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 2000);
  };

  // Tính tổng tiền thuê
  const totalRentPrice = localItems.reduce((sum, item) => {
    return sum + (item.equipment.pricePerDay * item.days * item.quantity);
  }, 0);

  // Tính tổng tiền cọc
  const totalDepositPrice = localItems.reduce((sum, item) => {
    return sum + (item.equipment.deposit * item.quantity);
  }, 0);

  // Tổng cộng = tổng tiền thuê + tổng tiền cọc
  const finalTotalAmount = totalRentPrice + totalDepositPrice;

  // Nút Tạo đơn hàng
  const handleProceedClick = () => {
    setValidationError(null);

    if (localItems.length === 0) {
      setValidationError('Giỏ hàng trống. Vui lòng thêm thiết bị để tạo đơn.');
      return;
    }

    // Xác minh hợp lệ
    for (let i = 0; i < localItems.length; i++) {
      const item = localItems[i];
      if (!item.startDate || !item.endDate || item.days <= 0) {
        setValidationError(`Ngày thuê không hợp lệ ở thiết bị "${item.equipment.name}". Hãy nhấn Cập nhật giỏ hàng.`);
        return;
      }
      if (item.quantity <= 0 || item.quantity > 3) {
        setValidationError(`Số lượng không hợp lệ ở thiết bị "${item.equipment.name}". Hãy nhấn Cập nhật giỏ hàng.`);
        return;
      }
    }

    onProceedToCheckout({
      subtotal: totalRentPrice,
      depositTotal: totalDepositPrice,
      finalTotalAmount: finalTotalAmount,
      items: localItems
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 animate-fade-in text-left font-sans" id="cart-screen">
      
      <div className="mb-8 flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl font-black text-[#00236f] uppercase tracking-wide">Giỏ Hàng Của Bạn</h1>
          <p className="text-xs text-slate-400 mt-1">Lập kế hoạch chu kỳ thuê, quy chỉnh số lượng và ước toán chi phí tạm tính</p>
        </div>
        
        <button
          type="button"
          onClick={() => setActivePage('equipments')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00236f] hover:text-[#fea619] transition bg-white py-2 px-4 border border-slate-200 rounded-xl shadow-sm"
        >
          
          Tiếp tục chọn thiết bị
        </button>
      </div>

      {localItems.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#c5c5d3] rounded-2xl shadow-sm">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-800">Giỏ hàng của quý khách đang trống</p>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Hãy khám phá kho thiết bị máy ảnh và phụ kiện để chọn lựa sản phẩm ưng ý.
          </p>
          <button
            type="button"
            onClick={() => setActivePage('equipments')}
            className="px-5 py-2.5 bg-[#00236f] text-white font-extrabold text-xs rounded-xl hover:bg-[#fea619] hover:text-[#2a1700] transition shadow-sm"
          >
            Xem danh sách mẫu thiết bị
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cột trái: Bảng giỏ hàng (Col 8) */}
          <div className="lg:col-span-8 space-y-4">
            
            {validationError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-[#ba1a1a] font-bold text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-650" />
                <span>{validationError}</span>
              </div>
            )}

            {updateSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Đã cập nhật giỏ hàng và đồng bộ định mức chi phí thành công!</span>
              </div>
            )}

            <div className="bg-white border border-[#c5c5d3] rounded-2xl overflow-hidden shadow-sm">
              
              {/* Desktop Header */}
              <div className="hidden md:grid grid-cols-12 gap-2 bg-slate-50 p-4 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-[#00236f]">
                <div className="col-span-4">Mẫu thiết bị</div>
                <div className="col-span-3 text-center">Ngày nhận / Ngày trả</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-right">Giá thuê & Cọc</div>
                <div className="col-span-1 text-center">Xóa</div>
              </div>

              {/* Items Rows */}
              <div className="divide-y divide-slate-100">
                {localItems.map((item, idx) => {
                  const lineRent = item.equipment.pricePerDay * item.days * item.quantity;
                  const lineDeposit = item.equipment.deposit * item.quantity;
                  const lineTotal = lineRent + lineDeposit;

                  return (
                    <div key={idx} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      
                      {/* Ảnh, Tên mẫu thiết bị */}
                      <div className="col-span-12 md:col-span-4 flex gap-3 text-left">
                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1">
                          <img
                            src={item.equipment.image}
                            alt={item.equipment.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[8px] bg-slate-100 border border-slate-200 text-slate-500 px-1.5 py-0.2 rounded font-black uppercase tracking-wider">
                            {item.equipment.brand}
                          </span>
                          <h3 className="text-xs font-bold text-slate-800 line-clamp-1 leading-snug">
                            {item.equipment.name}
                          </h3>
                          <span className="text-[9px] text-slate-400 block font-semibold">
                            Cọc gốc: {item.equipment.deposit.toLocaleString('vi-VN')}đ • Thuê: {item.equipment.pricePerDay.toLocaleString('vi-VN')}đ/ngày
                          </span>
                        </div>
                      </div>

                      {/* Ngày nhận, Ngày trả */}
                      <div className="col-span-12 md:col-span-3 p-2 bg-slate-50 rounded-xl space-y-1.5 text-xs text-left">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[9px] uppercase font-bold text-slate-400">Nhận:</span>
                          <input 
                            type="date"
                            value={item.startDate}
                            onChange={(e) => handleDateChange(idx, 'startDate', e.target.value)}
                            className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-semibold w-24 focus:outline-none"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[9px] uppercase font-bold text-slate-400">Trả:</span>
                          <input 
                            type="date"
                            value={item.endDate}
                            onChange={(e) => handleDateChange(idx, 'endDate', e.target.value)}
                            className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-semibold w-24 focus:outline-none"
                          />
                        </div>
                        <div className="text-right text-[9px] text-[#00236f] font-black flex items-center justify-end gap-0.5 select-none pt-0.5 border-t border-slate-200/50">
                          <Calendar className="w-2.5 h-2.5" />
                          Thuê {item.days} ngày
                        </div>
                      </div>

                      {/* Số lượng */}
                      <div className="col-span-12 md:col-span-2 flex justify-center">
                        <div className="flex items-center border border-slate-250 rounded bg-white overflow-hidden">
                          <button
                            type="button"
                            onClick={() => handleQtyChange(idx, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center font-bold text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition"
                          >
                            -
                          </button>
                          <span className="w-7 text-center text-xs font-black text-slate-700">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQtyChange(idx, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center font-bold text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Giá thuê, Tiền cọc, Thành tiền */}
                      <div className="col-span-12 md:col-span-2 text-right text-xs">
                        <div className="font-semibold text-slate-500 text-[10px]">
                          Thuê: <span className="font-bold text-slate-700 font-mono">{lineRent.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="font-semibold text-slate-500 text-[10px]">
                          Cọc thế: <span className="font-bold text-slate-700 font-mono">{lineDeposit.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="font-black text-[#00236f] text-xs pt-1 border-t border-slate-100 mt-1 font-mono">
                          T.Tiền: {lineTotal.toLocaleString('vi-VN')}đ
                        </div>
                      </div>

                      {/* Xóa dòng sản phẩm */}
                      <div className="col-span-12 md:col-span-1 flex justify-center">
                        <button
                          type="button"
                          onClick={() => onRemoveItem(idx)}
                          className="p-1.5 text-rose-500 hover:text-white bg-rose-50 hover:bg-rose-500 rounded-lg transition border border-rose-100"
                          title="Xóa sản phẩm"
                        >X?a
                          
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Khối nút Cập nhật giỏ hàng */}
              <div className="bg-slate-50 p-4 border-t border-slate-150 flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Nhấn cập nhật để tính toán lại biểu phí chính xác</span>
                <button
                  type="button"
                  onClick={handleUpdateCart}
                  className="px-4 py-2 bg-white border border-[#00236f] text-[#00236f] hover:bg-[#00236f] hover:text-white text-xs font-black rounded-xl transition"
                >
                  Cập nhật giỏ hàng
                </button>
              </div>

            </div>
          </div>

          {/* Cột phải: Ước lượng hóa đơn (Col 4) */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-[#c5c5d3] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-[#00236f] uppercase border-b border-slate-100 pb-3 flex justify-between items-center">
                Ước tính biểu phí
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                  {localItems.length} mục
                </span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-500 font-bold">
                  <span>Tiền thuê thiết bị:</span>
                  <span className="font-black text-slate-800 font-mono">{totalRentPrice.toLocaleString('vi-VN')} VNĐ</span>
                </div>

                <div className="flex justify-between items-center text-slate-500 font-bold">
                  <span>Tiền đặt cọc thế chấp:</span>
                  <span className="font-black text-slate-800 font-mono">{totalDepositPrice.toLocaleString('vi-VN')} VNĐ</span>
                </div>

                <div className="border-t border-dashed border-slate-200 pt-3"></div>

                <div className="space-y-0.5">
                  <div className="flex justify-between items-center text-sm font-black text-[#00236f]">
                    <span>TỔNG CỘNG:</span>
                    <span className="text-lg font-black text-[#fea619] font-mono">
                      {finalTotalAmount.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 block text-right font-semibold">
                    (Đã bao gồm tiền thuê và cọc giữ giữ bóng showroom)
                  </span>
                </div>
              </div>

              {/* Nút Tạo đơn hàng */}
              <button
                type="button"
                onClick={handleProceedClick}
                className="w-full py-3.5 bg-[#00236f] hover:bg-[#fea619] text-white hover:text-[#2a1700] text-xs font-black rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
              >
                Tạo đơn hàng
                
              </button>

              <p className="text-[9px] text-slate-400 text-center leading-normal font-semibold">
                Khách thuê cần có hồ sơ xác minh được duyệt để nhận các quyền lợi thuê không cần giữ căn cước gốc.
              </p>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
