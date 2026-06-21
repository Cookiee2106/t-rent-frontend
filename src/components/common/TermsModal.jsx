import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, CheckCircle, FileText } from 'lucide-react';

export default function TermsModal({ isOpen, onClose, onAccept }) {
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col relative max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00236f]/10 text-[#00236f] rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#00236f] font-sans">ĐIỀU KHOẢN & QUY CHẾ THUÊ THIẾT BỊ</h3>
              <p className="text-[11px] text-gray-500 font-medium">Vui lòng đọc kỹ trước khi đóng cọc giữ chỗ và ký kết bàn giao</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200/50 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contents scrollable */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#444651] leading-relaxed">
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200/60 rounded-xl p-3 text-amber-800">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-semibold text-[11px]">
              T-Rent cam kết hoàn 100% tài sản thế chấp đặt giữ chỗ ngay lập tức khi khách hàng hoàn tất bàn trả thiết bị đầy đủ phụ kiện nguyên trạng.
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-extrabold text-[#00236f] uppercase text-[11px] mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fea619]" />
                1. GIỜ NHẬN & TRẢ TRANG THIẾT BỊ
              </h4>
              <p className="pl-3">
                Thời gian thuê máy được tính theo chu kỳ 24h kể từ thời khắc bàn giao. Khách hàng vui lòng hoàn trả đúng hạn. Việc hoàn trả chậm trễ quá 2 giờ bắt buộc tính thêm 50% đơn giá ngày; trễ quá 4 giờ tính tròn thêm 1 ngày thuê tiếp theo.
              </p>
            </div>

            <div>
              <h4 className="font-extrabold text-[#00236f] uppercase text-[11px] mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fea619]" />
                2. KIỂM KÊ VÀ BẢO BẢO THIẾT BỊ
              </h4>
              <p className="pl-3">
                Showroom T-Rent có trách nhiệm cùng khách hàng Test kỹ lưỡng sensor cảm biến máy ảnh, mặt kính ống kính lens, pin và khả năng chống rung gimbal trước khi rời cửa hàng. Khách hàng tự chịu trách nhiệm bảo quản trang bị tránh khỏi bụi bặm, cát nước mặn, va chạm trầy xước bên ngoài trong suốt kỳ hạn thuê.
              </p>
            </div>

            <div>
              <h4 className="font-extrabold text-[#00236f] uppercase text-[11px] mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fea619]" />
                3. CHI PHÍ ĐỀN BÙ VÀ HƯ HỎNG PHÁT SINH
              </h4>
              <ul className="pl-3 space-y-1 list-disc list-inside">
                <li>Bụi bặm sensor / mốc rễ mức nhẹ: Phụ thu 200.000đ chi phí vệ sinh chuyên sâu.</li>
                <li>Va đập trầy xước vỏ ngoài: Khấu hao 10% - 25% giá trị trang bị tùy theo mức độ thẩm mỹ thiệt hại thực tế.</li>
                <li>Nứt vỡ thấu kính hữu cơ hoặc hỏng cảm biến do phơi nắng/laser: Bồi thường toàn bộ linh kiện thay thế chính hãng theo báo giá trung tâm ủy quyền Sony/Canon.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-[#00236f] uppercase text-[11px] mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fea619]" />
                4. QUY TRÌNH BAO LƯU BAO TRẢ CỌC
              </h4>
              <p className="pl-3">
                Mức tiền bảo thế đặt cọc giữ chỗ sẽ được T-Rent phong tỏa an toàn. Hoàn trả đúng tài khoản ngân hàng thụ hưởng của khách thuê trong vòng tối đa 05 phút sau thời điểm nhân viên kiểm định kỹ thuật thu hồi thiết bị trọn vẹn tại quầy.
              </p>
            </div>
          </div>
        </div>

        {/* Agree tickbox & buttons */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col gap-4">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4.5 h-4.5 accent-[#00236f] rounded"
            />
            <span className="text-xs text-[#444651] font-medium leading-tight">
              Tôi đã xem xét, hiểu rõ và hoàn toàn đồng tình tự nguyện tuân thủ nghiêm ngặt các quy định bàn kỹ thuật bảo quản thiết bị và chi phí đền bù tổn thất ở trên.
            </span>
          </label>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg text-xs font-bold transition"
            >
              Hủy bỏ
            </button>
            <button
              disabled={!agreed}
              onClick={() => {
                if (agreed) {
                  onAccept();
                }
              }}
              className={`px-6 py-2.5 rounded-lg text-xs font-extrabold transition duration-200.5 flex items-center gap-1.5 ${
                agreed
                  ? 'bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] shadow'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Tiếp tục
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
