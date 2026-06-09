import React, { useState } from 'react';
import { ShoppingBag, Trash2, Calendar, FileText, AlertCircle, Sparkles, Check, Gift, ArrowRight } from 'lucide-react';

export default function Cart({
  cartItems,
  onRemoveItem,
  onProceedToCheckout,
  setActivePage
}) {
  const [couponCode, setCouponCode] = useState('');
  const [discountValue, setDiscountValue] = useState(0);
  const [couponAppliedMsg, setCouponAppliedMsg] = useState('');
  const [cartQuantities, setCartQuantities] = useState(
    cartItems.reduce((acc, _, idx) => ({ ...acc, [idx]: 1 }), {})
  );

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'TRENTNEW') {
      setDiscountValue(100000);
      setCouponAppliedMsg('✅ Áp dụng thành công Voucher mã giảm giá TRENTNEW (Trừ ngay 100K)!');
    } else if (couponCode.trim() !== '') {
      setCouponAppliedMsg('❌ Mã khuyến mãi không hợp lệ hoặc đã qua hạn bảo hành sử dụng.');
      setDiscountValue(0);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item, idx) => {
      const q = cartQuantities[idx] || 1;
      return sum + (item.equipment.pricePerDay * item.days * q);
    }, 0);
  };

  const calculateDepositSum = () => {
    return cartItems.reduce((sum, item, idx) => {
      const q = cartQuantities[idx] || 1;
      return sum + (item.equipment.deposit * q);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const depositTotal = calculateDepositSum();
  const finalTotalAmount = subtotal + depositTotal - discountValue;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#00236f] mb-1 font-sans">GIỎ HÀNG CỦA BẠN</h1>
        <p className="text-sm text-gray-500">Xem xét thời lượng nhận máy, thế cọc giữ chỗ và tính toán hóa đơn trước khi lập biên nhận.</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#c5c5d3] rounded-2xl shadow-xs">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-bold text-gray-800">Giỏ hàng của quý khách đang trống rỗng</p>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto mb-6">
            Mời quý khách xem qua danh sách trang thiết bị ngành quay chụp đa dạng để tuyển thích và đặt giữ dịch vụ.
          </p>
          <button
            onClick={() => setActivePage('equipments')}
            className="px-6 py-2.5 bg-[#00236f] text-white font-extrabold text-xs rounded-xl hover:bg-[#fea619] hover:text-[#2a1700] transition-colors"
          >
            KHÁM PHÁ THIẾT BỊ NGAY
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LHS: Items table (Col 8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#c5c5d3] rounded-2xl overflow-hidden shadow-xs">
              
              {/* Header row desktop */}
              <div className="hidden sm:grid grid-cols-12 gap-4 bg-gray-50 p-4 border-b border-gray-100 text-[10px] font-black uppercase tracking-wider text-gray-500 select-none">
                <div className="col-span-5">Thiết bị quay chụp</div>
                <div className="col-span-3 text-center">Chu kỳ kén chọn</div>
                <div className="col-span-2 text-center">Số tiền thuê / Cọc</div>
                <div className="col-span-2 text-right">Thao tác</div>
              </div>

              {/* Grid rows */}
              <div className="divide-y divide-gray-100">
                {cartItems.map((item, idx) => {
                  const qty = cartQuantities[idx] || 1;
                  const itemRentalCost = item.equipment.pricePerDay * item.days * qty;
                  const itemDepositAmount = item.equipment.deposit * qty;

                  // Let's force row 2 to simulate availability error like the mockup!
                  const hasStockWarning = idx === 1;

                  return (
                    <div key={idx} className="p-4 sm:grid sm:grid-cols-12 gap-4 items-center">
                      {/* Product details */}
                      <div className="col-span-5 flex gap-3.5 mb-4 sm:mb-0">
                        <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-2 shadow-inner">
                          <img
                            src={item.equipment.image}
                            alt={item.equipment.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] bg-[#dce1ff] text-[#00236f] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                            {item.equipment.brand}
                          </span>
                          <h3 className="text-xs font-bold text-[#111827] line-clamp-2">
                            {item.equipment.name}
                          </h3>
                          {/* Ready or Warning Status */}
                          {hasStockWarning ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-red-600 font-extrabold bg-red-50 border border-red-100 rounded px-1.5 py-0.5 animate-pulse">
                              <AlertCircle className="w-3 h-3 shrink-0" />
                              Thiết bị không còn đủ số lượng trống trong thời gian này
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-green-600 font-bold bg-green-50 rounded px-1.5 py-0.5">
                              ✓ Đủ điều kiện sẵn bàn giao
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Dates duration calendar */}
                      <div className="col-span-3 text-center space-y-1 mb-3 sm:mb-0 text-xs">
                        <div className="flex items-center justify-center gap-1.5 text-gray-500 font-bold">
                          <Calendar className="w-3.5 h-3.5 text-[#00236f]" />
                          {item.days} ngày thuê
                        </div>
                        <div className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                          Nhận: {item.startDate}<br />
                          Trả: {item.endDate}
                        </div>
                      </div>

                      {/* Financial info */}
                      <div className="col-span-2 text-center text-xs mb-3 sm:mb-0 space-y-0.5">
                        <div className="font-extrabold text-[#00236f]">
                          {itemRentalCost.toLocaleString('vi-VN')} VNĐ
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Ký cọc: {itemDepositAmount.toLocaleString('vi-VN')} VNĐ
                        </div>
                      </div>

                      {/* Quantity & Delete button */}
                      <div className="col-span-2 flex items-center justify-end gap-3">
                        <div className="flex items-center border border-gray-200 rounded bg-gray-50 scale-90">
                          <button
                            type="button"
                            onClick={() => {
                              setCartQuantities({
                                ...cartQuantities,
                                [idx]: Math.max(1, qty - 1)
                              });
                            }}
                            className="w-6 h-6 flex items-center justify-center font-bold text-gray-500 hover:text-[#00236f]"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-[11px] font-bold">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setCartQuantities({
                                ...cartQuantities,
                                [idx]: qty + 1
                              });
                            }}
                            className="w-6 h-6 flex items-center justify-center font-bold text-gray-500 hover:text-[#00236f]"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition border border-red-150 self-end sm:self-auto cursor-pointer"
                          title="Gỡ khỏi giỏ hàng"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

            {/* Voucher inputs code wrapper */}
            <form onSubmit={handleApplyCoupon} className="bg-white border border-[#c5c5d3] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row gap-3.5 select-none">
              <div className="flex-grow space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#00236f] flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-[#fea619]" />
                  Áp dụng Voucher khuyến mãi (Mã giảm giá):
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: TRENTNEW (Giảm 100k cho thành viên mới)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full h-11 px-3 bg-gray-50 border border-gray-300 focus:border-[#00236f] focus:outline-none rounded-lg text-xs font-semibold"
                />
              </div>
              <button
                type="submit"
                className="h-11 px-6 bg-[#00236f] hover:bg-[#fea619] text-white hover:text-[#2a1700] text-xs font-black rounded-lg transition shrink-0 self-end w-full sm:w-auto"
              >
                Kích hoạt mã
              </button>
            </form>

            {couponAppliedMsg && (
              <div className={`p-3.5 rounded-lg border text-xs font-bold leading-relaxed ${
                couponAppliedMsg.startsWith('✅')
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {couponAppliedMsg}
              </div>
            )}
          </div>

          {/* RHS: Check summary & checkout CTA (Col 4) */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-[#c5c5d3] rounded-2xl p-6 shadow-xs space-y-5 sticky top-24">
              <h3 className="text-base font-black text-[#00236f] border-b border-gray-150 pb-3 flex items-center justify-between">
                TÓM TẮT ĐƠN HÀNG
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">
                  {cartItems.length} hàng
                </span>
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>Tiền thuê thiết bị:</span>
                  <span className="font-bold text-[#111827]">{subtotal.toLocaleString('vi-VN')} VNĐ</span>
                </div>

                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>Thế chấp ký cọc hoàn trả:</span>
                  <span className="font-bold text-gray-600">{depositTotal.toLocaleString('vi-VN')} VNĐ</span>
                </div>

                {discountValue > 0 && (
                  <div className="flex justify-between items-center text-green-700 font-medium">
                    <span>Mức chiết khấu giảm giá:</span>
                    <span className="font-bold">- {discountValue.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}

                <div className="border-t border-dashed border-gray-200 my-4"></div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-sm font-black text-[#00236f]">
                    <span>TỔNG TIỀN ĐẶT CỌC:</span>
                    <span className="text-xl font-black text-amber-600">
                      {finalTotalAmount.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 block text-right font-medium">
                    (Đã bao gồm tiền Thuê máy + Cọc máy thế thế)
                  </span>
                </div>
              </div>

              {/* Rules check visual */}
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/50 flex gap-2 text-[10.5px] text-amber-900 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Để tạo hóa đơn hợp lệ trực tuyến bảo hộ 100%, khách hàng vui lòng hoàn trả thiết bị nguyên khối đúng ngày hẹn tại quầy showroom.</span>
              </div>

              {/* Proceed checkout CTA */}
              <button
                onClick={() => {
                  // Pass final values
                  onProceedToCheckout({
                    subtotal,
                    depositTotal,
                    discountValue,
                    finalTotalAmount,
                    items: cartItems.map((item, idx) => ({
                      ...item,
                      quantity: cartQuantities[idx] || 1
                    }))
                  });
                }}
                className="w-full py-4 bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] text-xs font-black rounded-xl duration-200 flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] cursor-pointer"
              >
                XÁC NHẬN ĐƠN THUÊ KHỞI TẠO
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <div className="text-[9.5px] text-gray-400 text-center select-none font-medium">
                T-Rent cam kết hoàn 100% tài sản thế chấp hoàn cọc tức khắc sau khi nghiệm thu dọn dẹp tại đại lý.
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}
