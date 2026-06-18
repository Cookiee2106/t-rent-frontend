import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  User, 
  CreditCard, 
  UploadCloud, 
  AlertCircle, 
  FileText, 
  ArrowLeft, 
  Check, 
  RefreshCw 
} from 'lucide-react';

export default function Verification({
  user,
  userVerified,
  onVerifySubmit,
  setActivePage
}) {
  // Trạng thái hồ sơ: 'Chưa gửi', 'Chờ duyệt', 'Đã duyệt', 'Bị từ chối'
  const [kycStatus, setKycStatus] = useState(userVerified ? 'Đã duyệt' : 'Chưa gửi');
  
  // Chế độ màn hình: 'view' (Xem hồ sơ), 'submit' (Gửi hồ sơ), 'edit_profile' (Cập nhật hồ sơ cá nhân)
  const [currentMode, setCurrentMode] = useState('view');
  
  // Thông tin cá nhân
  const [fullName, setFullName] = useState(user?.name || 'Nguyễn Văn A');
  const [phone, setPhone] = useState(user?.phone || '0901 234 567');
  const [cccdNumber, setCccdNumber] = useState('021094002934');
  const [address, setAddress] = useState('125 Hai Bà Trưng, Quận 1, TP. Hồ Chí Minh');
  
  // Lý do từ chối nếu có
  const [rejectionReason, setRejectionReason] = useState('Ảnh chụp mặt sau của thẻ CCCD bị nhòe mờ, hiển thị không rõ số ID.');

  // Form gửi hồ sơ xác minh
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [submitCccdNumber, setSubmitCccdNumber] = useState('021094002934');
  const [uploadError, setUploadError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form cập nhật hồ sơ cá nhân
  const [editFullName, setEditFullName] = useState(fullName);
  const [editPhone, setEditPhone] = useState(phone);
  const [editAddress, setEditAddress] = useState(address);
  const [editCccdNumber, setEditCccdNumber] = useState(cccdNumber);

  // Bộ điều chỉnh trạng thái nhanh phục vụ chạy thử nghiệm
  const changeMockKycStatus = (status) => {
    setKycStatus(status);
    setCurrentMode('view');
    setSuccessMsg(null);
    setUploadError(null);
    if (status === 'Đã duyệt') {
      onVerifySubmit(); 
    }
  };

  // Giả lập tải ảnh
  const handleUploadSimulate = (side) => {
    setUploadError(null);
    if (side === 'front') {
      setFrontImage('cccd_front_preview.jpg');
    } else if (side === 'back') {
      setBackImage('cccd_back_preview.jpg');
    }
  };

  // Gửi hồ sơ xác minh
  const handleKycSubmissionSubmit = (e) => {
    e.preventDefault();
    setUploadError(null);
    setSuccessMsg(null);

    if (!submitCccdNumber || submitCccdNumber.length !== 12) {
      setUploadError('Số định danh căn cước công dân sai định dạng (yêu cầu 12 chữ số).');
      return;
    }

    if (!frontImage || !backImage) {
      setUploadError('Vui lòng tải lên ảnh mặt trước và mặt sau của giấy tờ định danh.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setKycStatus('Chờ duyệt');
      setCccdNumber(submitCccdNumber);
      setCurrentMode('view');
      setSuccessMsg('Gửi hồ sơ xác minh thành công! Hồ sơ của bạn đang được chờ kiểm duyệt.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

  // Lưu cập nhật hồ sơ cá nhân
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editFullName.trim() || !editPhone.trim() || !editAddress.trim() || !editCccdNumber.trim()) {
      alert('Vui lòng điền đầy đủ thông tin hồ sơ.');
      return;
    }
    if (editCccdNumber.length !== 12) {
      alert('Số định danh CCCD phải đủ 12 chữ số.');
      return;
    }

    setFullName(editFullName);
    setPhone(editPhone);
    setAddress(editAddress);
    setCccdNumber(editCccdNumber);
    setCurrentMode('view');
    setSuccessMsg('Đã lưu thông tin hồ sơ cá nhân thành công.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 animate-fade-in font-sans" id="verification-screen">
      
      {/* Simulation Helper Banner */}
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-xs font-bold text-[#00236f] mb-2 flex items-center gap-1 leading-none">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          Khu vực thử nghiệm trạng thái hồ sơ của người dùng:
        </p>
        <div className="flex flex-wrap gap-2 text-xs pt-1">
          <button 
            type="button" 
            onClick={() => changeMockKycStatus('Chưa gửi')} 
            className={`px-3 py-1.5 rounded-lg border font-bold transition-all duration-150 ${kycStatus === 'Chưa gửi' ? 'bg-[#00236f] text-white border-[#00236f]' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            Chưa gửi
          </button>
          <button 
            type="button" 
            onClick={() => changeMockKycStatus('Chờ duyệt')} 
            className={`px-3 py-1.5 rounded-lg border font-bold transition-all duration-150 ${kycStatus === 'Chờ duyệt' ? 'bg-amber-550 text-amber-900 bg-amber-100 border-amber-300' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            Chờ duyệt
          </button>
          <button 
            type="button" 
            onClick={() => changeMockKycStatus('Đã duyệt')} 
            className={`px-3 py-1.5 rounded-lg border font-bold transition-all duration-150 ${kycStatus === 'Đã duyệt' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            Đã duyệt
          </button>
          <button 
            type="button" 
            onClick={() => changeMockKycStatus('Bị từ chối')} 
            className={`px-3 py-1.5 rounded-lg border font-bold transition-all duration-150 ${kycStatus === 'Bị từ chối' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            Bị từ chối
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* MODE: VIEW PROFILE & KYC STATUS */}
        {currentMode === 'view' && (
          <motion.div 
            key="view-kyc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-[#c5c5d3] rounded-2xl p-6 md:p-8 space-y-6 text-left shadow-sm"
          >
            <div className="border-b border-slate-100 pb-5 flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#00236f]">Hồ sơ xác minh thông tin</h2>
                <p className="text-xs text-slate-400 mt-1 font-semibold">Theo dõi trạng thái xác minh danh tính tài khoản tại T-Rent</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Trạng thái xác minh:</span>
                {kycStatus === 'Chưa gửi' && (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-600 uppercase tracking-wider border border-slate-200">Chưa gửi</span>
                )}
                {kycStatus === 'Chờ duyệt' && (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-800 uppercase tracking-wider animate-pulse border border-amber-200">Chờ duyệt</span>
                )}
                {kycStatus === 'Đã duyệt' && (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 uppercase tracking-wider border border-emerald-250 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Đã duyệt
                  </span>
                )}
                {kycStatus === 'Bị từ chối' && (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-800 uppercase tracking-wider border border-rose-250">Bị từ chối</span>
                )}
              </div>
            </div>

            {/* Thông báo thành công */}
            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Lý do từ chối nếu có */}
            {kycStatus === 'Bị từ chối' && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex gap-3 text-xs text-rose-800 font-semibold leading-relaxed">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-rose-950 font-bold mb-1 uppercase tracking-wider text-[10px]">Lý do từ chối hồ sơ:</strong>
                  <span>{rejectionReason}</span>
                </div>
              </div>
            )}

            {/* Thông tin hồ sơ hiển thị */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-[#00236f] uppercase tracking-wider">Thông tin cá nhân</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl space-y-1 border border-slate-100">
                  <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">Họ và tên</span>
                  <strong className="text-slate-800 text-sm font-bold">{fullName}</strong>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl space-y-1 border border-slate-100">
                  <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">Số điện thoại</span>
                  <strong className="text-slate-800 text-sm font-bold font-mono">{phone}</strong>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl space-y-1 md:col-span-2 border border-slate-100">
                  <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">Địa chỉ</span>
                  <strong className="text-slate-800 text-sm font-bold">{address}</strong>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl space-y-1 border border-slate-100">
                  <span className="text-slate-400 font-bold block text-[9px] uppercase tracking-wider">Số giấy tờ định danh (CCCD)</span>
                  <strong className="text-slate-800 text-sm font-bold font-mono">{cccdNumber || 'Chưa cung cấp'}</strong>
                </div>
              </div>
            </div>

            {/* Tài liệu định danh đã gửi */}
            {(kycStatus === 'Đã duyệt' || kycStatus === 'Chờ duyệt') && (
              <div className="space-y-4 pt-5 border-t border-slate-100">
                <h3 className="text-xs font-extrabold text-[#00236f] uppercase tracking-wider">Ảnh giấy tờ đã gửi</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[120px] text-center">
                    <FileText className="w-8 h-8 text-[#00236f] mb-2" />
                    <span className="text-xs font-bold text-slate-700">Mặt trước CCCD</span>
                    <span className="text-[10px] text-slate-400 mt-1 font-mono">{cccdNumber}_front.jpg</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[120px] text-center">
                    <FileText className="w-8 h-8 text-[#00236f] mb-2" />
                    <span className="text-xs font-bold text-slate-700">Mặt sau CCCD</span>
                    <span className="text-[10px] text-slate-400 mt-1 font-mono">{cccdNumber}_back.jpg</span>
                  </div>
                </div>
              </div>
            )}

            {/* Nhóm nút hành động */}
            <div className="pt-6 border-t border-slate-150 flex flex-wrap justify-between items-center gap-4">
              <button 
                type="button"
                onClick={() => {
                  setEditFullName(fullName);
                  setEditPhone(phone);
                  setEditAddress(address);
                  setEditCccdNumber(cccdNumber);
                  setCurrentMode('edit_profile');
                }}
                className="px-5 py-2.5 border border-slate-200 text-[#00236f] hover:bg-slate-50 font-bold rounded-lg text-xs transition-all"
              >
                Cập nhật hồ sơ cá nhân
              </button>

              {(kycStatus === 'Chưa gửi' || kycStatus === 'Bị từ chối') && (
                <button 
                  type="button"
                  onClick={() => {
                    setFrontImage(null);
                    setBackImage(null);
                    setSubmitCccdNumber(cccdNumber);
                    setUploadError(null);
                    setCurrentMode('submit');
                  }}
                  className="px-5 py-2.5 bg-[#00236f] hover:bg-blue-900 text-white font-extrabold rounded-lg text-xs transition shadow-sm"
                >
                  Gửi hồ sơ xác minh
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* MODE: EDIT PROFILE */}
        {currentMode === 'edit_profile' && (
          <motion.div 
            key="edit-profile"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white border border-[#c5c5d3] rounded-2xl p-6 md:p-8 space-y-6 text-left shadow-sm"
          >
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-[#00236f]">Cập nhật hồ sơ cá nhân</h2>
                <p className="text-xs text-slate-400 mt-1 font-semibold">Chỉnh sửa thông tin liên hệ và lý lịch pháp lý cá nhân</p>
              </div>
              <button 
                type="button" 
                onClick={() => setCurrentMode('view')}
                className="p-1 text-slate-400 hover:text-slate-800 rounded-lg"
              >Quay l?i
                
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-500 font-bold uppercase text-[10px]">Họ và tên</label>
                  <input 
                    type="text"
                    required
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#00236f] font-semibold text-slate-800"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-500 font-bold uppercase text-[10px]">Số điện thoại</label>
                  <input 
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#00236f] font-mono font-semibold text-slate-800"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-slate-500 font-bold uppercase text-[10px]">Địa chỉ liên lạc</label>
                  <input 
                    type="text"
                    required
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#00236f] font-semibold text-slate-800"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-500 font-bold uppercase text-[10px]">Số định danh cá nhân (CCCD 12 số)</label>
                  <input 
                    type="text"
                    required
                    maxLength={12}
                    value={editCccdNumber}
                    onChange={(e) => setEditCccdNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#00236f] font-mono font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setCurrentMode('view')}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 rounded-lg text-xs transition"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-[#fea619] hover:bg-[#fea619]/90 text-[#2a1700] font-black rounded-lg text-xs transition"
                >
                  Lưu cập nhật
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* MODE: SUBMIT DOCUMENTS */}
        {currentMode === 'submit' && (
          <motion.div 
            key="submit-kyc"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white border border-[#c5c5d3] rounded-2xl p-6 md:p-8 space-y-6 text-left shadow-sm"
          >
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-[#00236f]">Gửi hồ sơ xác minh</h2>
                <p className="text-xs text-slate-400 mt-1 font-semibold">Tải lên CCCD hợp lệ để showroom T-Rent kích hoạt quyền thuê thiết bị</p>
              </div>
              <button 
                type="button" 
                onClick={() => setCurrentMode('view')}
                className="p-1 text-slate-400 hover:text-slate-800 rounded-lg"
              >Quay l?i
                
              </button>
            </div>

            {uploadError && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 font-semibold text-xs rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <span className="text-[10px] font-black uppercase text-slate-400 block mb-2">Thông tin hồ sơ đăng ký đối chiếu</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                <div>
                  <span className="text-slate-400 block font-bold text-[10px]">Họ tên:</span>
                  <strong className="text-slate-800">{fullName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold text-[10px]">Số điện thoại:</span>
                  <strong className="text-slate-800 font-mono">{phone}</strong>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block font-bold text-[10px]">Địa chỉ:</span>
                  <strong className="text-slate-800">{address}</strong>
                </div>
              </div>
            </div>

            <form onSubmit={handleKycSubmissionSubmit} className="space-y-6">
              
              <div className="space-y-1.5 text-xs">
                <label className="text-slate-500 block font-bold text-[10px] uppercase">Số định danh CCCD (Yêu cầu chính xác 12 chữ số):</label>
                <input 
                  type="text"
                  required
                  maxLength={12}
                  placeholder="Nhập 12 số CCCD"
                  value={submitCccdNumber}
                  onChange={(e) => setSubmitCccdNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white border border-slate-200 text-[#111827] font-semibold rounded-lg py-2.5 px-3 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-slate-500 block font-bold text-[10px] uppercase">Hình ảnh giấy tờ tùy thân (Mặt trước & Mặt sau):</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Front Card Upload */}
                  <div 
                    onClick={() => handleUploadSimulate('front')}
                    className={`border-2 border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center min-h-[140px] cursor-pointer transition-all ${
                      frontImage ? 'border-emerald-250 bg-emerald-50/15' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <UploadCloud className={`w-8 h-8 mb-2 ${frontImage ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span className="text-xs font-extrabold text-slate-700">Mặt trước CCCD</span>
                    <span className="text-[10px] text-slate-400 mt-1">Hỗ trợ JPG, PNG</span>
                    {frontImage && (
                      <span className="mt-2 inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-250 font-bold px-2 py-0.5 rounded text-[10px]">
                        <Check className="w-3.5 h-3.5" /> Đã chọn
                      </span>
                    )}
                  </div>

                  {/* Back Card Upload */}
                  <div 
                    onClick={() => handleUploadSimulate('back')}
                    className={`border-2 border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center min-h-[140px] cursor-pointer transition-all ${
                      backImage ? 'border-emerald-250 bg-emerald-50/15' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <UploadCloud className={`w-8 h-8 mb-2 ${backImage ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span className="text-xs font-extrabold text-slate-700">Mặt sau CCCD</span>
                    <span className="text-[10px] text-slate-400 mt-1">Hỗ trợ JPG, PNG</span>
                    {backImage && (
                      <span className="mt-2 inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-250 font-bold px-2 py-0.5 rounded text-[10px]">
                        <Check className="w-3.5 h-3.5" /> Đã chọn
                      </span>
                    )}
                  </div>

                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3.5">
                <button 
                  type="button" 
                  onClick={() => {
                    setUploadError(null);
                    setCurrentMode('view');
                  }}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 rounded-lg text-xs transition"
                >
                  Hủy
                </button>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#fea619] hover:bg-[#fea619]/90 text-[#2a1700] font-black rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang gửi hồ sơ...' : 'Gửi hồ sơ xác minh'}
                </button>
              </div>

            </form>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
