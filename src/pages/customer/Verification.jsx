import React, { useState } from 'react';
import { ShieldCheck, User, Eye, Lock, ClipboardList, CreditCard, UploadCloud, Info, AlertCircle, FileText } from 'lucide-react';

export default function Verification({
  user,
  userVerified,
  onVerifySubmit,
  setActivePage
}) {
  const [cccdNumber, setCccdNumber] = useState('021094002934');
  const [fullName, setFullName] = useState(user?.name || 'Khách hàng Demo');
  const [permanentAddress, setPermanentAddress] = useState('125 Hai Bà Trưng, Quận 1, TP. Hồ Chí Minh');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ front: false, back: false, portrait: false });

  const handleSimulatedUpload = (field) => {
    setUploadProgress(prev => ({ ...prev, [field]: 'uploading' }));
    setTimeout(() => {
      setUploadProgress(prev => ({ ...prev, [field]: 'done' }));
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      alert('Quý khách vui lòng tích chọn đồng ý cam kết tính chính xác trước!');
      return;
    }
    if (!uploadProgress.front || !uploadProgress.back || !uploadProgress.portrait) {
      alert('Vui lòng đính kèm đầy đủ hình ảnh 2 mặt CCCD và chân dung để hoàn tất duyệt tự động!');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onVerifySubmit();
      alert('Gửi hồ sơ thành công! Hệ thống AI đã thẩm định: Hồ sơ của quý khách đã được DUYỆT ĐÃ XÁC MINH tự động lập tức!');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LHS Side Tab links (Col 3.5) */}
        <div className="lg:col-span-3 space-y-3.5 select-none font-sans">
          <div className="bg-white border border-[#c5c5d3] rounded-2xl p-5 shadow-xs text-center space-y-4">
            {/* User profile avatar info layout */}
            <div className="w-20 h-20 bg-[#00236f]/10 border-2 border-[#00236f] text-[#00236f] rounded-full flex items-center justify-center font-black mx-auto text-2xl relative">
              {fullName.charAt(0)}
              {userVerified && (
                <span className="absolute bottom-0 right-0 bg-[#fea619] text-[#2a1700] rounded-full p-1 border-2 border-white shadow-md">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </span>
              )}
            </div>
            <div>
              <h3 className="text-base font-black text-[#00236f] leading-snug">{fullName}</h3>
              <p className="text-[10px] text-gray-500 font-medium">{user?.email || 'guest@t-rent.vn'}</p>
            </div>
            {/* Verified Status Banner */}
            {userVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 text-green-700 text-[10.5px] font-black rounded-full shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                ĐÃ XÁC MINH HỒ SƠ
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10.5px] font-bold rounded-full">
                ⚠️ CHƯA XÁC MINH DANH TÍNH
              </span>
            )}
          </div>

          <div className="bg-white border border-[#c5c5d3] rounded-2xl overflow-hidden shadow-xs">
            <div className="flex flex-col text-xs font-bold divide-y divide-gray-100 text-gray-650">
              <button
                onClick={() => setActivePage('profile')}
                className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 text-left transition text-gray-700"
              >
                <User className="w-4 h-4 text-[#00236f]" />
                Thông tin cá nhân tài khoản
              </button>
              <button
                onClick={() => setActivePage('verification')}
                className="flex items-center gap-3 px-5 py-4 bg-[#00236f]/5 text-[#00236f] font-black text-left border-l-4 border-[#00236f]"
              >
                <CreditCard className="w-4 h-4 text-[#00236f]" />
                Hồ sơ pháp lý xác minh 
              </button>
              <button
                onClick={() => setActivePage('orders')}
                className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 text-left transition text-gray-700"
              >
                <ClipboardList className="w-4 h-4 text-[#00236f]" />
                Đơn hàng thuê của tôi
              </button>
              <button
                onClick={() => alert('Chức năng Lịch sử giao dịch ví thanh toán đang được đồng hành xây dựng!')}
                className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 text-left transition text-gray-700"
              >
                <FileText className="w-4 h-4 text-[#00236f]" />
                Lịch sử thanh toán & Hợp đồng
              </button>
            </div>
          </div>
        </div>

        {/* RHS Form panel Details (Col 8.5) */}
        <div className="lg:col-span-9 bg-white border border-[#c5c5d3] rounded-2xl p-6 md:p-8 shadow-xs">
          <div className="border-b border-gray-150 pb-4 mb-6">
            <h2 className="text-xl font-black text-[#00236f] font-display flex items-center gap-2">
              <CreditCard className="text-[#fea619] w-6 h-6" />
              NÂNG CẤP HỒ SƠ PHÁP LÝ XÁC MINH 
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Kê khai danh tính giúp tối giản hóa thủ tục thế cọc giữ chỗ, hỗ trợ nhận trang bị nhanh chóng không cầm cố giấy tờ gốc.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Direct Warning banner */}
            {!userVerified && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex gap-3 text-xs text-amber-900 leading-relaxed font-medium">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="font-extrabold block text-amber-950 mb-0.5">⚠️ Quy chế bảo mật nghiêm ngặt</span>
                  T-Rent cam kết 100% hình ảnh căn cước công dân cung cấp chỉ phục vụ lập hợp đồng dân sự đối chiếu nhận máy chụp ảnh dã nghiệp, hoàn toàn được an ninh số hóa bảo mật tối tân.
                </div>
              </div>
            )}

            {/* Inputs block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold text-gray-500 uppercase block">Số Căn cước công dân (CMND / CCCD):</label>
                <input
                  type="text"
                  required
                  value={cccdNumber}
                  onChange={(e) => setCccdNumber(e.target.value)}
                  placeholder="Nhập 12 chữ số trên thẻ CCCD chính thống"
                  className="w-full h-11 px-3 bg-gray-50 border border-gray-300 focus:border-[#00236f] focus:outline-none rounded-lg text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold text-gray-500 uppercase block">Họ và tên ghi trên thẻ căn cước:</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Họ tên viết hoa có dấu chính chủ"
                  className="w-full h-11 px-3 bg-gray-50 border border-gray-300 focus:border-[#00236f] focus:outline-none rounded-lg text-xs font-semibold"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10.5px] font-bold text-gray-500 uppercase block">Địa chỉ thường trú thiết lập trên hộ khẩu:</label>
                <input
                  type="text"
                  required
                  value={permanentAddress}
                  onChange={(e) => setPermanentAddress(e.target.value)}
                  placeholder="Ghi chi tiết số nhà, phố phường, quận huyện, tỉnh thành phố"
                  className="w-full h-11 px-3 bg-gray-50 border border-gray-300 focus:border-[#00236f] focus:outline-none rounded-lg text-xs font-semibold"
                />
              </div>
            </div>

            {/* Upload fields layout */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-black text-[#00236f] uppercase tracking-wider block mb-3">Hình ảnh pháp lý CMND/CCCD</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs select-none">
                
                {/* Front Upload */}
                <div className="border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-xl p-4 text-center space-y-2 cursor-pointer transition flex flex-col items-center justify-center min-h-[140px]" onClick={() => handleSimulatedUpload('front')}>
                  <UploadCloud className="w-8 h-8 text-gray-400 shrink-0" />
                  <span className="font-extrabold text-[10.5px] text-gray-700 block">Mặt trước CCCD/CMND</span>
                  <span className="text-[9.5px] text-gray-400 block">Chọn file ảnh chụp rõ nét</span>

                  {uploadProgress.front === 'uploading' && (
                    <span className="text-[10px] text-blue-500 font-bold animate-pulse">Đang nạp file...</span>
                  )}
                  {uploadProgress.front === 'done' && (
                    <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 inline-flex items-center gap-1 font-bold">
                       Đã tệp lên ✓
                    </span>
                  )}
                </div>

                {/* Back Upload */}
                <div className="border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-xl p-4 text-center space-y-2 cursor-pointer transition flex flex-col items-center justify-center min-h-[140px]" onClick={() => handleSimulatedUpload('back')}>
                  <UploadCloud className="w-8 h-8 text-gray-400 shrink-0" />
                  <span className="font-extrabold text-[10.5px] text-gray-700 block">Mặt sau CCCD/CMND</span>
                  <span className="text-[9.5px] text-gray-400 block">Chọn file ảnh chụp rõ nét</span>

                  {uploadProgress.back === 'uploading' && (
                    <span className="text-[10px] text-blue-500 font-bold animate-pulse">Đang nạp file...</span>
                  )}
                  {uploadProgress.back === 'done' && (
                    <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 inline-flex items-center gap-1 font-bold">
                       Đã tệp lên ✓
                    </span>
                  )}
                </div>

                {/* Portrait CMND */}
                <div className="border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-xl p-4 text-center space-y-2 cursor-pointer transition flex flex-col items-center justify-center min-h-[140px]" onClick={() => handleSimulatedUpload('portrait')}>
                  <UploadCloud className="w-8 h-8 text-gray-400 shrink-0" />
                  <span className="font-extrabold text-[10.5px] text-gray-700 block">Ảnh chân dung kề mặt</span>
                  <span className="text-[9.5px] text-gray-400 block">Chân dung rõ nét cầm CCCD</span>

                  {uploadProgress.portrait === 'uploading' && (
                    <span className="text-[10px] text-blue-500 font-bold animate-pulse">Đang nạp file...</span>
                  )}
                  {uploadProgress.portrait === 'done' && (
                    <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 inline-flex items-center gap-1 font-bold">
                       Đã tệp lên ✓
                    </span>
                  )}
                </div>

              </div>
            </div>

            {/* Checkbox */}
            <div className="pt-4 border-t border-gray-100">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4.5 h-4.5 accent-[#00236f] rounded"
                />
                <span className="text-xs text-[#444651] leading-snug font-medium select-none">
                  Tôi long trọng cam kết toàn bộ các dữ liệu, thông tin và tệp đính kèm trên hoàn toàn do chính tôi đăng ký pháp lý sử dụng, hoàn trả đầy đủ trách nhiệm trước quy trình giao kết dân sự của T-Rent.
                </span>
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3.5 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] text-xs font-black rounded-lg transition duration-200 flex items-center justify-center gap-1.5 shadow"
              >
                Gửi hồ sơ xác minh nhận máy
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
