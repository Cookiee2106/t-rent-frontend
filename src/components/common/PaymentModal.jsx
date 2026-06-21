import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Copy, CreditCard, Smartphone, Landmark, ShieldCheck, Clock, ExternalLink } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, orderCode = 'TR-10042', amount = 1600000, onPaymentSuccess }) {
  const [activeTab, setActiveTab] = useState('bank');
  const [copiedField, setCopiedField] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const bankDetails = {
    bankName: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)',
    accountNumber: '1023948576',
    accountHolder: 'CONG TY TNHH T-RENT VIETNAM',
    amount: amount,
    memo: `T-RENT DEPOSIT ${orderCode}`
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmTransfer = () => {
    setIsVerifying(true);
    // Simulate payment webhook check
    setTimeout(() => {
      setIsVerifying(false);
      alert('Hệ thống ngân hàng ghi nhận: Giao dịch nộp tiền đặt cọc giữ chỗ thành công chuyển khoản! Đơn hàng của bạn hiện đã được cập nhật trạng thái "ĐÃ GIỮ CHỖ" trực tuyến!');
      onPaymentSuccess();
    }, 1500);
  };

  // Vietcombank QR mock generator url
  const qrUrl = `https://api.vietqr.io/image/970436-1023948576-8u2P2yX.jpg?accountName=CONG%20TY%20TNHH%20T-RENT%20VIETNAM&amount=${amount}&addInfo=${encodeURIComponent(bankDetails.memo)}`;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col relative max-h-[90vh]"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header banner */}
        <div className="bg-[#00236f] text-white p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#fea619] rounded-xl flex items-center justify-center text-[#2a1700]">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black font-sans tracking-wide">THANH TOÁN ĐẶT CỌC GIỮ CHỖ</h3>
              <p className="text-[11px] text-[#fea619] font-bold">Mã số đơn: {orderCode} • Nhận bàn giao thiết bị nguyên vẹn</p>
            </div>
          </div>
        </div>

        {/* Outer Grid wrap */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          {/* Billing value reminder banner */}
          <div className="flex justify-between items-center bg-[#dce1ff]/30 p-4 rounded-xl border border-[#c5c5d3]/30">
            <div className="text-xs text-[#444651] space-y-1">
              <span className="font-semibold block text-gray-500">Mức đóng đặt tiền bảo hành (ký cọc):</span>
              <strong className="text-xs font-black text-[#05267b]">{bankDetails.accountHolder}</strong>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-500 block uppercase font-bold">Số tiền cọc:</span>
              <strong className="text-xl font-black text-amber-600">{amount.toLocaleString('vi-VN')} VNĐ</strong>
            </div>
          </div>

          {/* Payment Method Selection Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('bank')}
              className={`flex-1 py-3 text-center text-xs font-extrabold flex items-center justify-center gap-2 border-b-2 transition ${
                activeTab === 'bank'
                  ? 'border-[#00236f] text-[#00236f]'
                  : 'border-transparent text-gray-400 hover:text-[#444651]'
              }`}
            >
              <Landmark className="w-4 h-4" />
              Chuyển khoản trực tiếp
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex-1 py-3 text-center text-xs font-extrabold flex items-center justify-center gap-2 border-b-2 transition ${
                activeTab === 'wallet'
                  ? 'border-[#00236f] text-[#00236f]'
                  : 'border-transparent text-gray-400 hover:text-[#444651]'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Ví Momo / ZaloPay
            </button>
            <button
              onClick={() => setActiveTab('card')}
              className={`flex-1 py-3 text-center text-xs font-extrabold flex items-center justify-center gap-2 border-b-2 transition ${
                activeTab === 'card'
                  ? 'border-[#00236f] text-[#00236f]'
                  : 'border-transparent text-gray-400 hover:text-[#444651]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Thẻ quốc tế visa
            </button>
          </div>

          {/* Tab Panel contents */}
          <div className="min-h-[180px]">
            {activeTab === 'bank' && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* QR Left (Col 2) */}
                <div className="md:col-span-2 flex flex-col items-center justify-center border border-gray-200 rounded-xl p-3 bg-gray-50">
                  <div className="relative w-40 h-40 bg-white rounded-lg flex items-center justify-center border border-gray-100 p-2 shadow-inner overflow-hidden">
                    <img
                      src={qrUrl}
                      alt="VietQR T-Rent Transfer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 mt-2 font-semibold text-center select-none flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                    Quét QR chuyển nhanh 24/7
                  </span>
                </div>

                {/* Account Details right (Col 3) */}
                <div className="md:col-span-3 space-y-3.5 text-xs">
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold block mb-0.5">Tên Ngân hàng nguồn thụ hưởng:</label>
                    <span className="font-extrabold text-[#111827]">{bankDetails.bankName}</span>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 font-bold block mb-0.5">Số tài khoản đại diện:</label>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-100 p-2 rounded-lg border border-gray-200 mt-0.5">
                      <span className="font-mono font-black text-sm text-[#00236f]">{bankDetails.accountNumber}</span>
                      <button
                        onClick={() => copyToClipboard(bankDetails.accountNumber, 'account')}
                        className="text-xs text-[#00236f] hover:text-[#fea619] font-bold flex items-center gap-1 transition"
                      >
                        {copiedField === 'account' ? (
                          <><Check className="w-3.5 h-3.5 text-green-600" /> Đã sao chép</>
                        ) : (
                          <><Copy className="w-3.5 h-3.5" /> Copy</>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 font-bold block mb-0.5 font-sans">Chủ tài khoản ngân hàng:</label>
                    <span className="font-extrabold text-gray-800 uppercase text-[11px] block">{bankDetails.accountHolder}</span>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 font-bold block mb-0.5">Cột nội dung chuyển khoản:</label>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-100 p-2 rounded-lg border border-gray-200 mt-0.5">
                      <span className="font-mono font-black text-[#00236f] tracking-wide">{bankDetails.memo}</span>
                      <button
                        onClick={() => copyToClipboard(bankDetails.memo, 'memo')}
                        className="text-xs text-[#00236f] hover:text-[#fea619] font-bold flex items-center gap-1 transition"
                      >
                        {copiedField === 'memo' ? (
                          <><Check className="w-3.5 h-3.5 text-green-600" /> Đã sao chép</>
                        ) : (
                          <><Copy className="w-3.5 h-3.5" /> Copy</>
                        )}
                      </button>
                    </div>
                    <span className="text-[10px] text-red-500 font-bold block mt-1">
                      ⚠️ Khách hàng chú ý điền CHÍNH XÁC nội dung chuyển khoản ở trên để đảm bảo AI Auto-approve cọc lập tức!
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wallet' && (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-fuchsia-50 text-fuchsia-600 rounded-full flex items-center justify-center mx-auto">
                  <Smartphone className="w-8 h-8" />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h4 className="text-sm font-extrabold text-[#00236f]">Thanh toán qua Ví Momo / ZaloPay App</h4>
                  <p className="text-xs text-[#757682]">
                    Mã quét thanh toán sẽ tự động liên kết app của bạn. Nhấn vào nút phía dưới để chuyển tiếp app ví hoặc nhận QR code.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Đang kết nối API Momo/Zalopay... Trại nghiệm demo thành công!')}
                  className="px-5 py-2.5 bg-fuchsia-600 text-white font-bold text-xs rounded-lg hover:bg-fuchsia-700 transition duration-200 inline-flex items-center gap-1.5"
                >
                  Kết nối ví di động
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {activeTab === 'card' && (
              <div className="space-y-4 max-w-md mx-auto py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold block">Tên hiển thị trên thẻ:</label>
                    <input
                      type="text"
                      placeholder="NGUYEN VAN A"
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold block">Số thẻ Visa/Mastercard:</label>
                    <input
                      type="text"
                      placeholder="xxxx xxxx xxxx xxxx"
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono font-semibold focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold block">Hạn dung:</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full h-10 px-2 bg-gray-50 border border-gray-200 rounded-lg text-center text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold block">CVV:</label>
                      <input
                        type="password"
                        placeholder="***"
                        className="w-full h-10 px-2 bg-gray-50 border border-gray-200 rounded-lg text-center text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 flex items-center gap-1.5 justify-center mt-2 font-medium">
                  <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                  Kết nối mã hóa bảo mật PCI-DSS 256-bit an toàn bởi Visa.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="flex items-center gap-1 text-[10px] text-gray-400 select-none">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            Bảo chứng dòng tiền cọc bởi Vietcombank
          </div>

          <div className="flex gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-bold transition text-center"
            >
              Hủy thanh toán / Trả sau
            </button>
            <button
              disabled={isVerifying}
              onClick={handleConfirmTransfer}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-[#fea619] hover:bg-[#fea619]/90 text-[#2a1700] hover:scale-[1.01] active:scale-[0.98] rounded-lg text-xs font-black transition duration-200 flex items-center justify-center gap-1.5 shadow-md"
            >
              {isVerifying ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Đang ghi nhận...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Xác nhận đã chuyển khoản
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
