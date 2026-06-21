import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  CreditCard, 
  UploadCloud, 
  AlertCircle, 
  FileText, 
  Check, 
  Info,
  Edit2,
  Send,
  Eye,
  Trash2,
  X,
  ShieldCheck
} from 'lucide-react';

export default function Verification({
  user,
  userVerified,
  onVerifySubmit,
  setActivePage
}) {
  // -------------------------------------------------------------
  // MOCK SYSTEM DATA & LOCAL STATE
  // Mặc định Khách hàng là Nguyễn Văn A, trạng thái là BỊ TỪ CHỐI
  // đúng theo đặc tả yêu cầu của đề bài.
  // -------------------------------------------------------------
  const [profile, setProfile] = useState({
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    address: '123 Nguyễn Trãi, Quận 1, TP.HCM',
    identityNumber: '079204000001',
    accountStatus: 'ACTIVE',       // Hoạt động, Bị khóa, Không hoạt động
    verificationStatus: 'REJECTED', // Chưa xác minh, Chờ duyệt, Đã duyệt, Bị từ chối
    rejectReason: 'Ảnh giấy tờ bị mờ, không đọc rõ thông tin',
    reviewedAt: '18/06/2026'
  });

  // Modal / Drawer Control States
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // Form Cập nhật hồ sơ
  const [updateForm, setUpdateForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    identityNumber: ''
  });

  // Form Gửi hồ sơ xác minh
  const [frontImage, setFrontImage] = useState(null); // { name, previewUrl }
  const [backImage, setBackImage] = useState(null);   // { name, previewUrl }

  // Notification States
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Trigger temporary success notification
  const triggerSuccessMsg = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  // -------------------------------------------------------------
  // 1. NGHIỆP VỤ CẬP NHẬT HỒ SƠ CÁ NHÂN
  // -------------------------------------------------------------
  const handleOpenUpdateModal = () => {
    setUpdateForm({
      fullName: profile.fullName,
      phone: profile.phone,
      address: profile.address,
      identityNumber: profile.identityNumber
    });
    setErrorMsg(null);
    setShowUpdateModal(true);
  };

  const handleSaveUpdate = (e) => {
    e.preventDefault();
    setErrorMsg(null);

    const { fullName, phone, address, identityNumber } = updateForm;

    // Validate bắt buộc
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // Validate định dạng số điện thoại (ví dụ: chỉ chứa số, có độ dài từ 10 chữ số)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone.trim())) {
      setErrorMsg('Số điện thoại không hợp lệ');
      return;
    }

    // Validate số giấy tờ định danh độ dài (nếu có nhập)
    const idRegex = /^[0-9a-zA-Z]{9,12}$/;
    if (identityNumber.trim() && !idRegex.test(identityNumber.trim())) {
      setErrorMsg('Số giấy tờ định danh không hợp lệ');
      return;
    }

    // Giả tạo kiểm tra trùng số giấy tờ định danh của khách hàng khác
    // Để chứng minh kiểm tra, nếu nhập "079204000002" (số của Trần Thị B) thì báo lỗi
    if (identityNumber.trim() === '079204000002') {
      setErrorMsg('Số giấy tờ định danh đã được sử dụng');
      return;
    }

    // Cập nhật state cục bộ
    setProfile(prev => ({
      ...prev,
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      identityNumber: identityNumber.trim()
    }));

    setShowUpdateModal(false);
    triggerSuccessMsg('Cập nhật hồ sơ cá nhân thành công');
  };

  // -------------------------------------------------------------
  // 2. NGHIỆP VỤ GỬI HỒ SƠ XÁC MINH
  // -------------------------------------------------------------
  const handleOpenVerifyModal = () => {
    setErrorMsg(null);

    // Kiểm tra thông tin cá nhân bắt buộc của khách hàng trước khi mở form
    if (
      !profile.fullName.trim() ||
      !profile.phone.trim() ||
      !profile.address.trim() ||
      !profile.identityNumber.trim()
    ) {
      setErrorMsg('Vui lòng cập nhật đầy đủ hồ sơ cá nhân trước khi gửi xác minh');
      return;
    }

    // Nếu đang chờ duyệt, không cho phép mở
    if (profile.verificationStatus === 'PENDING') {
      onVerifySubmit(); // fallback
      alert('Hồ sơ của bạn đang chờ xử lý');
      return;
    }

    // Reset temporary file uploads
    setFrontImage(null);
    setBackImage(null);
    setShowVerifyModal(true);
  };

  // Simulated upload clicks / drop triggers
  const handleSimulateUpload = (side) => {
    setErrorMsg(null);
    const mockFilename = side === 'front' 
      ? `front_${profile.fullName.toLowerCase().replace(/\s/g, '')}.jpg` 
      : `back_${profile.fullName.toLowerCase().replace(/\s/g, '')}.jpg`;
    
    const mockPreview = side === 'front'
      ? 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=600'
      : 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=600';

    if (side === 'front') {
      setFrontImage({ name: mockFilename, previewUrl: mockPreview });
    } else {
      setBackImage({ name: mockFilename, previewUrl: mockPreview });
    }
  };

  const handleRemoveImage = (side, e) => {
    e.stopPropagation(); // Stop click bubble back to simulate upload trigger
    if (side === 'front') setFrontImage(null);
    else setBackImage(null);
  };

  const handleSubmitVerification = (e) => {
    e.preventDefault();
    setErrorMsg(null);

    // Khách hàng chưa đăng nhập kiểm tra (luôn thỏa mãn vì đây là màn hình Khách hàng)
    if (!profile.email) {
      setErrorMsg('Vui lòng đăng nhập để thực hiện');
      return;
    }

    // Kiểm tra hồ sơ cá nhân đầy đủ
    if (
      !profile.fullName.trim() ||
      !profile.phone.trim() ||
      !profile.address.trim() ||
      !profile.identityNumber.trim()
    ) {
      setErrorMsg('Vui lòng cập nhật đầy đủ hồ sơ cá nhân trước khi gửi xác minh');
      return;
    }

    // Kiểm tra ảnh mặt trước
    if (!frontImage) {
      setErrorMsg('Vui lòng upload ảnh mặt trước giấy tờ');
      return;
    }

    // Kiểm tra ảnh mặt sau
    if (!backImage) {
      setErrorMsg('Vui lòng upload ảnh mặt sau giấy tờ');
      return;
    }

    // Đổi trạng thái xác minh thành Chờ duyệt
    setProfile(prev => ({
      ...prev,
      verificationStatus: 'PENDING',
      rejectReason: null,
      reviewedAt: null
    }));

    // Gửi thông báo lên App chính (nếu cần)
    if (onVerifySubmit) {
      // Gọi callback để App đồng bộ
    }

    setShowVerifyModal(false);
    triggerSuccessMsg('Gửi hồ sơ xác minh thành công');
  };

  // Helper colors for statuses
  const getVerifyBadgeColor = (status) => {
    switch (status) {
      case 'UNVERIFIED': return 'bg-slate-100 text-slate-700 border-slate-350';
      case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'APPROVED': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'REJECTED': return 'bg-rose-100 text-rose-800 border-rose-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-350';
    }
  };

  const getVerifyBadgeText = (status) => {
    switch (status) {
      case 'UNVERIFIED': return 'Chưa xác minh';
      case 'PENDING': return 'Chờ duyệt';
      case 'APPROVED': return 'Đã duyệt';
      case 'REJECTED': return 'Bị từ chối';
      default: return 'Chưa xác minh';
    }
  };

  const getAccountBadgeColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'LOCKED': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'INACTIVE': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-250';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-6 text-left font-sans" id="customer-verification-container">
      
      {/* Toast Alert Success */}
      {successMsg && (
        <div className="fixed top-5 right-5 z-[2000] bg-slate-900 text-white border border-slate-800 px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fadeIn">
          <div className="bg-emerald-500 p-1 rounded-full text-white">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-black">{successMsg}</p>
          </div>
        </div>
      )}

      {/* TOP HEADER BREADCRUMB */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
            <span>Trang chủ</span>
            <span>/</span>
            <span className="text-[#00236f] font-black">Quản lý tài khoản</span>
          </div>
          <h2 className="text-lg font-black text-[#00236f] uppercase tracking-wide flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            Quản lý tài khoản
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Xem thông tin tài khoản của bạn, hồ sơ cá nhân và trạng thái xác minh bảo chứng thuê máy.
          </p>
        </div>
      </div>

      {/* ERROR MSG BANNER AT HEAD ON LAYOUT */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-start gap-2 animate-fadeIn mb-2">
          <AlertCircle className="w-4.5 h-4.5 text-rose-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <span>{errorMsg}</span>
            {errorMsg.includes('cập nhật đầy đủ') && (
              <button 
                type="button" 
                onClick={handleOpenUpdateModal} 
                className="block text-[#00236f] hover:underline text-[11px] font-black uppercase mt-1"
              >
                Nhấp vào đây để cập nhật hồ sơ ngay
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3 CARDS LAYOUT FOR CUSTOMER SYSTEM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: THÔNG TIN TÀI KHOẢN */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between" id="account-info-card">
          <div className="p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <div className="bg-indigo-50 text-indigo-700 p-2 rounded-xl">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Thông tin tài khoản</h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Họ tên chủ tài khoản</span>
                <p className="text-slate-900 font-extrabold text-sm mt-0.5">{profile.fullName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Địa chỉ email</span>
                  <p className="text-slate-700 font-bold font-mono mt-0.5 truncate" title={profile.email}>{profile.email}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Số điện thoại</span>
                  <p className="text-slate-800 font-bold font-mono mt-0.5">{profile.phone}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Trạng thái tài khoản</span>
                <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-black border uppercase tracking-wider ${getAccountBadgeColor(profile.accountStatus)}`}>
                  {profile.accountStatus === 'ACTIVE' && 'Hoạt động'}
                  {profile.accountStatus === 'LOCKED' && 'Bị khóa'}
                  {profile.accountStatus === 'INACTIVE' && 'Không hoạt động'}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-slate-50/50 px-5 py-3 border-t border-slate-100 text-[10.5px] text-slate-400 font-semibold italic">
            Tài khoản khách hàng chính danh T-Rent
          </div>
        </div>

        {/* CARD 2: HỒ SƠ CÁ NHÂN */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between" id="personal-profile-card">
          <div className="p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-50 text-indigo-700 p-2 rounded-xl">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Hồ sơ cá nhân</h3>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Họ tên khách hàng</span>
                  <p className="text-slate-900 font-black mt-0.5">{profile.fullName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Số điện thoại</span>
                  <p className="text-slate-850 font-bold font-mono mt-0.5">{profile.phone}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Địa chỉ thường trú</span>
                <p className="text-slate-700 font-bold mt-0.5 leading-relaxed truncate-2-lines">{profile.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Số giấy tờ định danh (CCCD)</span>
                  <p className="text-slate-950 font-mono font-black text-sm mt-0.5">{profile.identityNumber || 'Chưa cung cấp'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Trạng thái xác minh</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${getVerifyBadgeColor(profile.verificationStatus)}`}>
                    {getVerifyBadgeText(profile.verificationStatus)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50/50 px-5 py-3 border-t border-slate-100 text-[10.5px] text-slate-400 font-semibold italic">
            Thông tin dùng đối chứng trong hợp đồng thuê máy ảnh
          </div>
        </div>

        {/* CARD 3: TRẠNG THÁI XÁC MINH (Hiển thị riêng biệt cực trực quan) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-5 md:col-span-2 space-y-4" id="verification-status-card">
          <div className="border-b border-slate-100 pb-3 flex flex-wrap justify-between items-center gap-2">
            <h3 className="text-sm font-black text-[#00236f] uppercase tracking-wide">Trạng thái xác minh bảo chứng</h3>
            <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-black border uppercase tracking-wide ${getVerifyBadgeColor(profile.verificationStatus)}`}>
              Badge: {getVerifyBadgeText(profile.verificationStatus)}
            </span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-4">
            
            {/* Conditional explanations details */}
            {profile.verificationStatus === 'UNVERIFIED' && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700 leading-relaxed">
                  Bạn chưa gửi hồ sơ xác minh. Vui lòng cập nhật đầy đủ hồ sơ cá nhân và gửi ảnh giấy tờ để được xét duyệt.
                </p>
                <div className="text-[10px] text-indigo-700 font-bold flex items-center gap-1.5 bg-indigo-50/50 px-3 py-2 rounded-lg border border-indigo-100">
                  <Info className="w-4 h-4 shrink-0" />
                  Bạn cần hoàn thiện đầy đủ Họ tên, Số điện thoại, Địa chỉ, Số CCCD trước khi chụp hình đối chiếu.
                </div>
              </div>
            )}

            {profile.verificationStatus === 'PENDING' && (
              <div className="space-y-2">
                <p className="text-xs font-black text-amber-800 leading-relaxed flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  Hồ sơ của bạn đang chờ nhân viên xử lý.
                </p>
                <p className="text-[11px] text-slate-505 font-medium leading-relaxed">
                  Yêu cầu bảo chứng đã được gửi thành công lên ban nhân sự T-Rent. Quá trình kiểm nghiệm hồ sơ thường diễn ra trong vòng 15-30 phút sau khi nộp.
                </p>
              </div>
            )}

            {profile.verificationStatus === 'APPROVED' && (
              <div className="space-y-2">
                <p className="text-xs font-black text-emerald-800 leading-relaxed flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  Hồ sơ của bạn đã được xác minh. Bạn có thể thực hiện thuê thiết bị theo quy định.
                </p>
                <p className="text-[11px] text-slate-505 font-medium leading-relaxed">
                  Bạn đã được cấp quyền miễn trừ đặt cọc tài sản vật lý có giá trị cao. Tự do đặt hàng trên hệ thống của T-Rent.
                </p>
              </div>
            )}

            {profile.verificationStatus === 'REJECTED' && (
              <div className="space-y-2">
                <p className="text-xs font-black text-rose-800 leading-relaxed flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  Hồ sơ xác minh bị từ chối phê duyệt!
                </p>
                {profile.rejectReason && (
                  <div className="p-3 bg-rose-50 border border-rose-250 rounded-lg text-[11px] text-rose-950 font-bold">
                    <span className="text-rose-600 font-extrabold uppercase text-[9px] block mb-0.5">Lý do từ chối:</span>
                    “ {profile.rejectReason} ”
                    {profile.reviewedAt && (
                      <span className="block mt-1 text-[10px] text-slate-400 font-mono font-medium">Thời gian từ chối xử lý: {profile.reviewedAt}</span>
                    )}
                  </div>
                )}
                <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed pt-1">
                  Vui lòng kiểm tra lại ảnh chụp hoặc các thông tin cá nhân cơ bản và nhấn nút <strong>[Gửi hồ sơ xác minh]</strong> bên dưới để làm lại thủ tục gửi duyệt mới.
                </p>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* DIRECT ACTION FIELD ON SCREEN (KHU VỰC THAO TÁC TRỰC TIẾP TRÊN TRANG CHÍNH) */}
      <div className="bg-[#00236f]/5 border border-[#00236f]/10 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
        
        <div className="text-left">
          <p className="text-xs font-black text-slate-800 uppercase tracking-wide">Thao tác tài khoản</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
            {profile.verificationStatus === 'PENDING' && 'Hồ sơ của bạn đang chờ xử lý.'}
            {profile.verificationStatus === 'APPROVED' && 'Hồ sơ đã được xác minh.'}
            {(profile.verificationStatus === 'UNVERIFIED' || profile.verificationStatus === 'REJECTED') && 'Thực hiện cập nhật bổ sung hồ sơ định danh cá nhân.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Button Cập nhật hồ sơ cá nhân - LUÔN HIỂN THỊ */}
          <button
            type="button"
            onClick={handleOpenUpdateModal}
            className="px-5 py-3 bg-[#fea619] hover:bg-amber-500 text-[#2a1700] text-xs font-black uppercase rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Cập nhật hồ sơ cá nhân
          </button>

          {/* Button Gửi hồ sơ xác minh - KIỂM SOÁT THEO ĐIỀU KIỆN TRẠNG THÁI */}
          {profile.verificationStatus === 'PENDING' ? (
            <button
              type="button"
              disabled
              title="Hồ sơ của bạn đang chờ xử lý."
              className="px-5 py-3 bg-slate-300 text-slate-500 text-xs font-black uppercase rounded-xl cursor-not-allowed opacity-70 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Gửi hồ sơ xác minh (Đang chờ xử lý)
            </button>
          ) : profile.verificationStatus === 'APPROVED' ? (
            <button
              type="button"
              disabled
              className="px-5 py-3 bg-emerald-100 text-emerald-600 border border-emerald-200 text-xs font-black uppercase rounded-xl cursor-not-allowed flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Đã xác minh thành công
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenVerifyModal}
              className="px-5 py-3 bg-[#00236f] hover:bg-slate-800 text-white text-xs font-black uppercase rounded-xl transition shadow-md cursor-pointer flex items-center gap-1.5 animate-pulse"
            >
              <Send className="w-3.5 h-3.5" />
              Gửi hồ sơ xác minh
            </button>
          )}
        </div>

      </div>

      {/* ============================================================= */}
      {/* MODAL / DRAWER CẬP NHẬT HỒ SƠ CÁ NHÂN */}
      {/* ============================================================= */}
      <AnimatePresence>
        {showUpdateModal && (
          <div className="fixed inset-0 z-[1400] flex items-center justify-center p-4">
            {/* Mask layer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpdateModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            
            {/* Dialog panel */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-xs text-slate-800 font-semibold text-left"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-150 bg-slate-50 flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-[#00236f] uppercase text-sm">Cập nhật hồ sơ cá nhân</h3>
                  <p className="text-[10.5px] text-slate-400 font-bold mt-0.5">
                    Cập nhật thông tin cá nhân dùng cho quá trình thuê thiết bị và xác minh tài khoản.
                  </p>
                </div>
                <button 
                  onClick={() => setShowUpdateModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Form container */}
              <form onSubmit={handleSaveUpdate}>
                <div className="p-5 space-y-4">
                  
                  {/* Informational Toast Error within modal popup only */}
                  {errorMsg && (
                    <div className="p-3 bg-rose-50 border border-rose-250 text-rose-800 font-bold rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Fields list */}
                  <div className="space-y-4">
                    
                    {/* Read-only email input field */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-450 font-bold uppercase block">Địa chỉ email (Chỉ xem)</label>
                      <input 
                        type="email"
                        disabled
                        value={profile.email}
                        className="w-full text-xs bg-slate-100 border border-slate-200 text-slate-400 font-mono font-bold px-3 py-2.5 rounded-xl cursor-not-allowed outline-none"
                      />
                    </div>

                    {/* Full Name field */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-500 font-extrabold uppercase block">Họ và tên khách hàng <span className="text-rose-550">*</span></label>
                      <input 
                        type="text"
                        required
                        value={updateForm.fullName}
                        onChange={(e) => setUpdateForm({ ...updateForm, fullName: e.target.value })}
                        placeholder="Ví dụ: Nguyễn Văn A"
                        className="w-full text-xs bg-slate-50 border border-slate-205 text-slate-800 font-bold px-3 py-2.5 rounded-xl focus:bg-white focus:ring-1 focus:ring-[#00236f] focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Phone field */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-500 font-extrabold uppercase block font-sans">Số điện thoại liên lạc <span className="text-rose-550">*</span></label>
                      <input 
                        type="text"
                        required
                        value={updateForm.phone}
                        onChange={(e) => setUpdateForm({ ...updateForm, phone: e.target.value.replace(/\D/g, '') })}
                        placeholder="Nhập 10 chữ số..."
                        className="w-full text-xs bg-slate-50 border border-slate-205 text-slate-850 font-mono font-bold px-3 py-2.5 rounded-xl focus:bg-white focus:ring-1 focus:ring-[#00236f] focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Address field */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-500 font-extrabold uppercase block">Địa chỉ liên hệ thường trú <span className="text-rose-550">*</span></label>
                      <textarea 
                        rows="2.5"
                        required
                        value={updateForm.address}
                        onChange={(e) => setUpdateForm({ ...updateForm, address: e.target.value })}
                        placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố..."
                        className="w-full text-xs bg-slate-50 border border-slate-205 text-slate-800 font-bold px-3 py-2.5 rounded-xl focus:bg-white focus:ring-1 focus:ring-[#00236f] focus:border-transparent outline-none resize-none"
                      />
                    </div>

                    {/* Identity Paper Number (CCCD) */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-500 font-extrabold uppercase block">Số giấy tờ định danh (CCCD/CMND) <span className="text-slate-400">(Bắt buộc nếu muốn xác minh)</span></label>
                      <input 
                        type="text"
                        value={updateForm.identityNumber}
                        onChange={(e) => setUpdateForm({ ...updateForm, identityNumber: e.target.value.replace(/[^0-9a-zA-Z]/g, '') })}
                        placeholder="Mã định danh 9 hoặc 12 số..."
                        className="w-full text-xs bg-slate-50 border border-slate-205 text-slate-800 font-mono font-black px-3 py-2.5 rounded-xl focus:bg-white focus:ring-1 focus:ring-[#00236f] focus:border-transparent outline-none"
                      />
                    </div>

                  </div>
                </div>

                {/* Footer buttons of forms */}
                <div className="px-5 py-4 border-t border-slate-150 bg-slate-50 flex justify-end gap-2 text-xs select-none">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#fea619] hover:bg-amber-500 text-[#2a1700] font-black rounded-xl transition shadow-xs cursor-pointer"
                  >
                    Lưu cập nhật
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================= */}
      {/* MODAL / DRAWER GỬI HỒ SƠ XÁC MINH */}
      {/* ============================================================= */}
      <AnimatePresence>
        {showVerifyModal && (
          <div className="fixed inset-0 z-[1400] flex items-center justify-center p-4">
            {/* Mask layer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVerifyModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            
            {/* Scrollable Dialog panel */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden text-xs text-slate-800 font-semibold text-left flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-150 bg-slate-50 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="font-extrabold text-[#00236f] uppercase text-sm">Gửi hồ sơ xác minh định danh</h3>
                  <p className="text-[10.5px] text-slate-400 font-bold mt-0.5">
                    Upload ảnh mặt trước và mặt sau giấy tờ định danh để nhân viên kiểm tra hồ sơ.
                  </p>
                </div>
                <button 
                  onClick={() => setShowVerifyModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scroll Content fields */}
              <form onSubmit={handleSubmitVerification} className="flex-1 overflow-y-auto p-5 space-y-5">
                
                {/* Error Banner deep form */}
                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-250 text-rose-800 font-bold rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* SECTION A. THÔNG TIN CÁ NHÂN CẦN KIỂM TRA */}
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3.5">
                  <h4 className="text-[10.5px] text-[#00236f] uppercase font-black tracking-wider border-b border-slate-150 pb-1 flex items-center gap-1">
                    <span className="w-1 h-3.5 bg-[#00236f] inline-block rounded-xs"></span>
                    A. Thông tin cá nhân cần kiểm tra
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase tracking-wide block">Họ tên khách hàng:</span>
                      <strong className="text-slate-800 font-extrabold">{profile.fullName}</strong>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-400 uppercase tracking-wide block">Số điện thoại liên lạc:</span>
                      <strong className="text-slate-800 font-mono font-bold">{profile.phone}</strong>
                    </div>

                    <div className="col-span-2">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wide block">Địa chỉ đăng ký liên lạc:</span>
                      <span className="text-slate-700 font-semibold">{profile.address}</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-400 uppercase tracking-wide block">Số định danh giấy tờ (CCCD):</span>
                      <strong className="text-slate-900 font-mono font-black">{profile.identityNumber}</strong>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-400 uppercase tracking-wide block">Trạng thái xác minh hiện tại:</span>
                      <span className={`inline-block px-2 py-0.5 mt-0.5 rounded text-[9.5px] font-black border uppercase ${getVerifyBadgeColor(profile.verificationStatus)}`}>
                        {getVerifyBadgeText(profile.verificationStatus)}
                      </span>
                    </div>
                  </div>

                  {/* Previous Reject reason display MUST if state is REFUSED */}
                  {profile.verificationStatus === 'REJECTED' && profile.rejectReason && (
                    <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
                      <span className="text-[9.5px] text-rose-600 font-extrabold uppercase block mb-0.5">Lý do từ chối xử lý gần nhất:</span>
                      <p className="text-[11px] text-rose-950 italic font-bold">“ {profile.rejectReason} ”</p>
                    </div>
                  )}

                </div>

                {/* SECTION B. UPLOAD HÌNH ẢNH GIẤY TỜ */}
                <div className="space-y-3.5">
                  <h4 className="text-[10.5px] text-[#00236f] uppercase font-black tracking-wider border-b border-slate-150 pb-1 flex items-center gap-1">
                    <span className="w-1 h-3.5 bg-indigo-600 inline-block rounded-xs"></span>
                    B. Upload ảnh tài liệu tùy thân
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* MAT TRUOC */}
                    <div className="space-y-1.5">
                      <span className="text-[10.5px] text-slate-500 font-extrabold block">Ảnh mặt trước giấy tờ <span className="text-rose-500">*</span></span>
                      
                      <div 
                        onClick={() => handleSimulateUpload('front')}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer flex flex-col items-center justify-center min-h-[140px] relative transition-all ${
                          frontImage ? 'border-emerald-500 bg-emerald-50/5' : 'border-slate-205 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        {frontImage ? (
                          <div className="w-full text-center space-y-2">
                            <div className="w-full h-16 rounded overflow-hidden border border-slate-200 relative group">
                              <img src={frontImage.previewUrl} alt="Mặt trước preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[11px] bg-emerald-100/60 p-2 rounded border border-emerald-200 text-emerald-900 font-bold">
                              <span className="truncate max-w-[124px] font-mono">{frontImage.name}</span>
                              <button 
                                type="button" 
                                onClick={(e) => handleRemoveImage('front', e)}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded-full" 
                                title="Xóa ảnh này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <UploadCloud className="w-7 h-7 text-slate-400 mb-1" />
                            <span className="text-[11px] font-black text-slate-650">Bấm để tải ảnh mặt trước</span>
                            <span className="text-[9.5px] text-slate-400 mt-0.5">Tải lên ảnh mặt trước giấy tờ</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* MAT SAU */}
                    <div className="space-y-1.5">
                      <span className="text-[10.5px] text-slate-500 font-extrabold block">Ảnh mặt sau giấy tờ <span className="text-rose-500">*</span></span>
                      
                      <div 
                        onClick={() => handleSimulateUpload('back')}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer flex flex-col items-center justify-center min-h-[140px] relative transition-all ${
                          backImage ? 'border-emerald-500 bg-emerald-50/5' : 'border-slate-205 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        {backImage ? (
                          <div className="w-full text-center space-y-2">
                            <div className="w-full h-16 rounded overflow-hidden border border-slate-200 relative group">
                              <img src={backImage.previewUrl} alt="Mặt sau preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[11px] bg-emerald-100/60 p-2 rounded border border-emerald-200 text-emerald-900 font-bold">
                              <span className="truncate max-w-[124px] font-mono">{backImage.name}</span>
                              <button 
                                type="button" 
                                onClick={(e) => handleRemoveImage('back', e)}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded-full" 
                                title="Xóa ảnh này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <UploadCloud className="w-7 h-7 text-slate-400 mb-1" />
                            <span className="text-[11px] font-black text-slate-650">Bấm để tải ảnh mặt sau</span>
                            <span className="text-[9.5px] text-slate-400 mt-0.5">Tải lên ảnh mặt sau giấy tờ</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* STICK ACTIONS BAR BOTTOM */}
                <div className="pt-4 border-t border-slate-150 flex justify-end gap-2.5 select-none shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowVerifyModal(false)}
                    className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 font-bold rounded-xl transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#00236f] hover:bg-slate-800 text-white font-extrabold rounded-xl transition shadow-sm cursor-pointer"
                  >
                    Gửi hồ sơ xác minh
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
