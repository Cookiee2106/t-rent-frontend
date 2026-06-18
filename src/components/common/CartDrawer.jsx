import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Calendar, ClipboardCheck, ShoppingBag, ShieldCheck, Info } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onRemoveFromCart,
  onCheckoutAll,
  setActivePage
}) {
  if (!isOpen) return null;

  const totalRentalCost = cartItems.reduce((acc, curr) => acc + (curr.equipment.pricePerDay * curr.days), 0);
  const totalDepositCost = cartItems.reduce((acc, curr) => acc + curr.equipment.deposit, 0);

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      ></div>

      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10"
      >
        {/* Header container */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#00236f]">
            <ShoppingBag className="w-5 h-5 text-[#fea619]" />
            <h2 className="text-lg font-extrabold font-display">Giỏ thiết bị tạm tính</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-red-50 text-[#444651] hover:text-red-600 rounded-full transition-colors"
          >??ng
            
          </button>
        </div>

        {/* Content list body */}
        <div className="flex-grow p-6 overflow-y-auto space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm font-semibold text-gray-500 mb-1">Giỏ thiết bị rỗng</p>
              <p className="text-xs text-gray-400 max-w-xs mx-auto mb-6">
                Bạn chưa thêm thiết bị máy ảnh nào vào giỏ. Khám phá danh mục của chúng tôi để chọn thiết bị tối ưu.
              </p>
              <button 
                onClick={() => { setActivePage('equipments'); onClose(); }}
                className="px-5 py-2.5 bg-[#00236f] text-white font-bold text-xs rounded-lg hover:bg-[#fea619] hover:text-[#2a1700]"
              >
                Khám phá ngay
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative group flex gap-3 align-top"
                >
                  <div className="w-16 h-16 bg-white border border-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-sm">
                    <img alt={item.equipment.name} src={item.equipment.image} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-grow min-w-0 pr-6">
                    <h4 className="text-xs font-bold text-[#111827] truncate mb-1">
                      {item.equipment.name}
                    </h4>
                    
                    <div className="text-[10px] text-gray-400 space-y-0.5 mb-2">
                      <p className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#fea619]" />
                        Từ {item.startDate} đến {item.endDate}
                      </p>
                      <p>Số ngày thuê: {item.days} ngày</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#00236f] font-bold">
                        {(item.equipment.pricePerDay * item.days).toLocaleString('vi-VN')}đ
                      </span>
                      <span className="text-gray-400">
                        Cọc: {item.equipment.deposit.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => onRemoveFromCart(idx)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Xóa khỏi giỏ hàng"
                  >X?a
                    
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Billing Breakdown */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
            <div className="text-xs text-gray-500 space-y-2">
              <div className="flex justify-between">
                <span>Cộng tiền thuê máy:</span>
                <span className="font-bold text-[#111827]">{totalRentalCost.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between">
                <span>Cộng tiền thế chấp cọc máy:</span>
                <span className="font-bold text-[#444651]">{totalDepositCost.toLocaleString('vi-VN')}đ</span>
              </div>
              
              <div className="border-t border-dashed border-gray-200 my-2"></div>
              
              <div className="flex justify-between text-sm text-[#00236f] font-black">
                <span>Tổng cộng tạm tính:</span>
                <span>{(totalRentalCost + totalDepositCost).toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <button 
              onClick={onCheckoutAll}
              className="w-full py-3.5 bg-[#fea619] hover:bg-[#fea619]/90 text-[#2a1700] hover:scale-[1.01] font-extrabold rounded-xl transition duration-200 active:scale-95 shadow-md flex items-center justify-center gap-2 text-xs"
            >
              
              Gửi yêu cầu thuê toàn bộ
            </button>

            <div className="flex justify-center gap-1.5 text-[10px] text-[#444651] select-none text-center leading-relaxed">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-green-600" />
              Cam kết giá cọc và quy chế trả hàng minh bạch 100%.
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
