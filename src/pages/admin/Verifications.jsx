import React, { useState } from 'react';
import { 
  Search, 
  X, 
  UserCheck, 
  AlertTriangle, 
  Check, 
  Eye, 
  Info, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert,
  Image as ImageIcon
} from 'lucide-react';

// ========================================================
// MOCK DATA: REQUIRED 4 INITIAL CLIENT RECORDS AS REQUESTED
// ========================================================
const INITIAL_CUSTOMERS = [
  {
    id: 'CUST001',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    accountStatus: 'ACTIVE',       // 'ACTIVE', 'LOCKED', 'INACTIVE'
    verificationStatus: 'PENDING',  // 'UNVERIFIED', 'PENDING', 'APPROVED', 'REJECTED'
    address: '123 Nguyễn Trãi, Quận 1, TP.HCM',
    identityNumber: '079204000001',
    submittedDate: '18/06/2026',
    reviewedBy: '-',
    reviewedAt: '-',
    rejectReason: '-',
    frontImageFilename: 'front_nguyenvana.jpg',
    backImageFilename: 'back_nguyenvana.jpg',
    frontImageUrl: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=600',
    backImageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=600'
  },
  {
    id: 'CUST002',
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0902345678',
    accountStatus: 'ACTIVE',
    verificationStatus: 'APPROVED',
    address: '45 Lê Lợi, Quận 3, TP.HCM',
    identityNumber: '079204000002',
    submittedDate: '15/06/2026',
    reviewedBy: 'Nhân viên A',
    reviewedAt: '16/06/2026',
    rejectReason: '-',
    frontImageFilename: 'front_tranthib.jpg',
    backImageFilename: 'back_tranthib.jpg',
    frontImageUrl: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=600',
    backImageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=600'
  },
  {
    id: 'CUST003',
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    phone: '0903456789',
    accountStatus: 'ACTIVE',
    verificationStatus: 'REJECTED',
    address: '88 Cách Mạng Tháng 8, Quận 10, TP.HCM',
    identityNumber: '079204000003',
    submittedDate: '10/06/2026',
    reviewedBy: 'Nhân viên B',
    reviewedAt: '11/06/2026',
    rejectReason: 'Ảnh giấy tờ bị mờ, không đọc rõ thông tin',
    frontImageFilename: 'front_levanc.jpg',
    backImageFilename: 'back_levanc.jpg',
    frontImageUrl: '', // Empty to simulate fallback error testing
    backImageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=600'
  },
  {
    id: 'CUST004',
    name: 'Phạm Minh D',
    email: 'phamminhd@example.com',
    phone: '0904567890',
    accountStatus: 'ACTIVE',
    verificationStatus: 'UNVERIFIED',
    address: 'Chưa cập nhật',
    identityNumber: 'Chưa có',
    submittedDate: '-',
    reviewedBy: '-',
    reviewedAt: '-',
    rejectReason: '-',
    frontImageFilename: null,
    backImageFilename: null,
    frontImageUrl: null,
    backImageUrl: null
  }
];

export default function Verifications({ userRole = 'staff' }) {
  // Safe validation check if somehow user gets here but behaves like a customer
  if (userRole === 'customer') {
    return (
      <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-center space-y-4 max-w-2xl mx-auto my-12" id="unauthorized-message">
        <div className="bg-rose-50 w-16 h-16 rounded-full flex items-center justify-center text-rose-600 mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-slate-800 uppercase">Không có quyền truy cập</h3>
        <p className="text-xs text-slate-500 font-bold leading-relaxed">
          Bạn không có quyền truy cập chức năng này. Trang này chỉ dành cho Quản trị viên hoặc Nhân viên.
        </p>
      </div>
    );
  }

  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [toast, setToast] = useState(null);

  // Filters State
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterVerification, setFilterVerification] = useState('');

  // Modals / Drawer Control State
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showConfirmApprove, setShowConfirmApprove] = useState(false);
  const [showConfirmReject, setShowConfirmReject] = useState(false);
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [rejectError, setRejectError] = useState(false);

  // View full size image light box
  const [lightboxImage, setLightboxImage] = useState(null);

  // Success toast helper
  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Image component helper that elegantly detects errors and falls back
  const ImageWithFallback = ({ src, alt, label, filename }) => {
    const [isError, setIsError] = useState(false);

    const handleClick = () => {
      if (src && !isError) {
        setLightboxImage({ src, label, filename });
      }
    };

    if (isError || !src) {
      return (
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center h-28 select-none">
          <span className="text-[11px] font-bold text-slate-400">Không thể tải ảnh giấy tờ</span>
          {filename && <span className="text-[9px] text-slate-350 font-mono mt-1">{filename}</span>}
        </div>
      );
    }

    return (
      <div 
        onClick={handleClick}
        className="aspect-[3/2] rounded-xl overflow-hidden border border-slate-200 shadow-xs relative group cursor-zoom-in bg-slate-50"
      >
        <img 
          src={src} 
          alt={alt}
          onError={() => setIsError(true)}
          className="w-full h-full object-cover transition duration-150 group-hover:scale-102"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition duration-150 flex items-center justify-center">
          <div className="bg-white/90 px-3 py-1.5 rounded-lg text-[10px] font-black text-slate-800 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            Xem kích thước lớn
          </div>
        </div>
      </div>
    );
  };

  // Handle open details modal drawer
  const handleOpenDetail = (cust) => {
    setSelectedCustomer(cust);
    setShowDetail(true);
  };

  // 1. DUYỆT HỒ SƠ XÁC MINH - Trigger
  const handleOpenApprove = () => {
    setShowConfirmApprove(true);
  };

  const handleConfirmApprove = () => {
    if (!selectedCustomer) {
      alert('Không tìm thấy hồ sơ xác minh');
      return;
    }

    if (selectedCustomer.verificationStatus !== 'PENDING') {
      alert('Hồ sơ đã được xử lý');
      return;
    }

    // Update main states
    const updated = customers.map(cust => {
      if (cust.id === selectedCustomer.id) {
        return {
          ...cust,
          verificationStatus: 'APPROVED',
          reviewedBy: userRole === 'admin' ? 'Quản trị viên' : 'Nhân viên A',
          reviewedAt: '2026-06-21 11:30',
          rejectReason: '-'
        };
      }
      return cust;
    });

    setCustomers(updated);
    
    // Sync active drawer view
    setSelectedCustomer({
      ...selectedCustomer,
      verificationStatus: 'APPROVED',
      reviewedBy: userRole === 'admin' ? 'Quản trị viên' : 'Nhân viên A',
      reviewedAt: '2026-06-21 11:30',
      rejectReason: '-'
    });

    setShowConfirmApprove(false);
    triggerToast('Duyệt hồ sơ xác minh thành công');
  };

  // 2. TỪ CHỐI HỒ SƠ XÁC MINH - Trigger
  const handleOpenReject = () => {
    setRejectReasonInput('');
    setRejectError(false);
    setShowConfirmReject(true);
  };

  const handleConfirmReject = () => {
    if (!selectedCustomer) {
      alert('Không tìm thấy hồ sơ xác minh');
      return;
    }

    if (selectedCustomer.verificationStatus !== 'PENDING') {
      alert('Hồ sơ đã được xử lý');
      return;
    }

    if (!rejectReasonInput.trim()) {
      setRejectError(true);
      return;
    }

    // Update main states
    const updated = customers.map(cust => {
      if (cust.id === selectedCustomer.id) {
        return {
          ...cust,
          verificationStatus: 'REJECTED',
          rejectReason: rejectReasonInput.trim(),
          reviewedBy: userRole === 'admin' ? 'Quản trị viên' : 'Nhân viên A',
          reviewedAt: '2026-06-21 11:32'
        };
      }
      return cust;
    });

    setCustomers(updated);

    // Sync active drawer view
    setSelectedCustomer({
      ...selectedCustomer,
      verificationStatus: 'REJECTED',
      rejectReason: rejectReasonInput.trim(),
      reviewedBy: userRole === 'admin' ? 'Quản trị viên' : 'Nhân viên A',
      reviewedAt: '2026-06-21 11:32'
    });

    setShowConfirmReject(false);
    triggerToast('Từ chối hồ sơ xác minh thành công');
  };

  // Filter application calculation
  const filteredCustomers = customers.filter(cust => {
    const matchesName = cust.name.toLowerCase().includes(filterName.toLowerCase());
    const matchesEmail = cust.email.toLowerCase().includes(filterEmail.toLowerCase());
    const matchesPhone = cust.phone.includes(filterPhone);
    const matchesVerification = filterVerification === '' ? true : cust.verificationStatus === filterVerification;

    return matchesName && matchesEmail && matchesPhone && matchesVerification;
  });

  return (
    <div className="space-y-6 text-left selection:bg-indigo-100 font-sans" id="verifications-management">
      
      {/* Toast alert banner popup */}
      {toast && (
        <div className="fixed top-5 right-5 z-[2100] bg-slate-900 border border-slate-800 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fadeIn">
          <div className="bg-emerald-500 p-1 rounded-full text-white">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold">{toast}</p>
          </div>
        </div>
      )}

      {/* HEADER SECTION WITH BREADCRUMB */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
            <span>Trang chủ</span>
            <span>/</span>
            <span className="text-[#00236f] font-black">Quản lý tài khoản</span>
          </div>
          <h2 className="text-lg font-black text-[#00236f] uppercase tracking-wide flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Quản lý tài khoản
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Voir danh sách tài khoản khách hàng và xử lý hồ sơ xác minh.</p>
        </div>
      </div>

      {/* FILTER SEARCH FORM BAR */}
      <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">
          Bộ lọc thông tin
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Filter Họ tên */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">Họ tên</label>
            <input 
              type="text"
              placeholder="Lọc theo họ tên..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-[#00236f]"
            />
          </div>

          {/* Filter Email */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Email khách hàng</label>
            <input 
              type="text"
              placeholder="Lọc theo email..."
              value={filterEmail}
              onChange={(e) => setFilterEmail(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-mono font-bold text-slate-850 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-[#00236f]"
            />
          </div>

          {/* Filter Số điện thoại */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">Số điện thoại</label>
            <input 
              type="text"
              placeholder="Lọc theo số điện thoại..."
              value={filterPhone}
              onChange={(e) => setFilterPhone(e.target.value.replace(/\D/g,''))}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-mono font-bold text-slate-850 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-[#00236f]"
            />
          </div>

          {/* Filter Trạng thái xác minh */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">Trạng thái xác minh</label>
            <select
              value={filterVerification}
              onChange={(e) => setFilterVerification(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-black text-slate-750 cursor-pointer focus:bg-white focus:ring-1 focus:ring-[#00236f]"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="UNVERIFIED">Chưa xác minh</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Bị từ chối</option>
            </select>
          </div>
        </div>
      </div>

      {/* DATA CUSTOMERS LIST TABULATOR VIEW */}
      <div className="table-wrapper border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="w-full">
          <table className="data-table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[13px] font-semibold text-[#0f172a]">
                <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[110px]">Mã tài khoản</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[150px]">Họ tên</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[170px]">Email</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[130px]">Số điện thoại</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[150px]">Xác minh</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[155px]">Trạng thái</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-right font-semibold min-w-[120px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-705">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 italic font-medium">
                    Không tìm thấy tài khoản khách hàng nào trùng khớp với bộ lọc dữ liệu.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(cust => (
                  <tr key={cust.id} className="hover:bg-slate-50/50 transition">
                    
                    {/* ID Column */}
                    <td className="px-6 py-4 font-mono font-bold text-indigo-700 cell-code">
                      {cust.id}
                    </td>

                    {/* Name column */}
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-slate-900 block">{cust.name}</span>
                    </td>

                    {/* Email column */}
                    <td className="px-6 py-4 font-mono text-slate-600 font-medium">
                      {cust.email}
                    </td>

                    {/* Phone Column */}
                    <td className="px-6 py-4 font-mono text-slate-800">
                      {cust.phone}
                    </td>

                    {/* Target Verification state color codes */}
                    <td className="px-6 py-4 text-center">
                      <span className={`status-badge border ${
                        cust.verificationStatus === 'UNVERIFIED' 
                          ? 'bg-slate-50 text-slate-500 border-slate-205' 
                          : cust.verificationStatus === 'PENDING'
                          ? 'bg-amber-50 text-amber-705 border-amber-200'
                          : cust.verificationStatus === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-708 border-emerald-250'
                          : 'bg-rose-50 text-rose-700 border-rose-250'
                      }`}>
                        {cust.verificationStatus === 'UNVERIFIED' && 'Chưa xác minh'}
                        {cust.verificationStatus === 'PENDING' && 'Chờ duyệt'}
                        {cust.verificationStatus === 'APPROVED' && 'Đã duyệt'}
                        {cust.verificationStatus === 'REJECTED' && 'Bị từ chối'}
                      </span>
                    </td>

                    {/* Account status badge */}
                    <td className="px-6 py-4 text-center">
                      <span className={`status-badge border ${
                        cust.accountStatus === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-708 border-emerald-200'
                          : cust.accountStatus === 'LOCKED'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {cust.accountStatus === 'ACTIVE' && 'Hoạt động'}
                        {cust.accountStatus === 'LOCKED' && 'Bị khóa'}
                        {cust.accountStatus === 'INACTIVE' && 'Không hoạt động'}
                      </span>
                    </td>

                    {/* Thao tác column with EXACTLY only [Xem chi tiết] button */}
                    <td className="px-6 py-4 text-right">
                      <div className="table-action-group justify-end animate-scaleIn">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(cust)}
                          className="table-action-button text-[#00236f] bg-[#00236f]/5 hover:bg-[#00236f]/10 cursor-pointer"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mock pagination bar to matching layout design flow */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-semibold font-sans">
          <p>Hiển thị {filteredCustomers.length} trong tổng số {customers.length} tài khoản khách hàng</p>
          <div className="flex gap-1">
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-30 cursor-not-allowed" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="min-w-[32px] h-8 bg-[#00236f] text-white rounded-lg font-bold">1</button>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-30 cursor-not-allowed" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* DRAWER / MODAL DRAWER OVERLAY DETAIL DETAIL */}
      {/* ======================================================== */}
      {showDetail && selectedCustomer && (
        <div className="fixed inset-0 z-[1200] flex justify-end font-sans">
          
          {/* Backdrop mask backdrop-blur-xs */}
          <div 
            onClick={() => setShowDetail(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          {/* Slider Panel right side */}
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 animate-slideOver">
            
            {/* Header top drawer bar */}
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
              <div>
                <h3 className="text-sm font-black text-[#00236f] uppercase">Chi tiết tài khoản khách hàng</h3>
                <p className="text-[10.5px] text-slate-400 font-mono font-bold mt-0.5">Khách hàng ID: {selectedCustomer.id}</p>
              </div>
              <button 
                onClick={() => setShowDetail(false)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Container Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700 font-semibold text-left">
              
              {/* SECTION A. THÔNG TIN TÀI KHOẢN */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <h4 className="text-[#00236f] uppercase text-[10.5px] tracking-wider font-extrabold border-b border-slate-150 pb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-[#00236f] rounded-xs inline-block"></span>
                  A. Thông tin tài khoản
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase tracking-wide block">Họ tên khách hàng</span>
                    <p className="text-slate-950 font-extrabold text-sm mt-0.5">{selectedCustomer.name}</p>
                  </div>

                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase tracking-wide block">Trạng thái tài khoản</span>
                    <span className={`inline-block px-2.5 py-0.5 mt-1 rounded text-[10px] font-black border ${
                      selectedCustomer.accountStatus === 'ACTIVE' 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-250' 
                        : 'bg-rose-100 text-rose-800 border-rose-250'
                    }`}>
                      {selectedCustomer.accountStatus === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </div>

                  <div className="font-mono">
                    <span className="text-[9.5px] text-slate-400 uppercase tracking-wide block font-sans">Địa chỉ email</span>
                    <p className="text-slate-800 font-bold mt-0.5">{selectedCustomer.email}</p>
                  </div>

                  <div className="font-mono">
                    <span className="text-[9.5px] text-slate-400 uppercase tracking-wide block font-sans">Số điện thoại</span>
                    <p className="text-slate-800 font-bold mt-0.5">{selectedCustomer.phone}</p>
                  </div>
                </div>
              </div>

              {/* SECTION B. HỒ SƠ CÁ NHÂN */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <h4 className="text-[#00236f] uppercase text-[10.5px] tracking-wider font-extrabold border-b border-slate-150 pb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-[#00236f] rounded-xs inline-block"></span>
                  B. Hồ sơ cá nhân
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <span className="text-[9.5px] text-slate-400 uppercase tracking-wide block">Địa chỉ liên lạc thường trú</span>
                    <p className="text-slate-800 mt-0.5 text-xs font-bold leading-relaxed">{selectedCustomer.address}</p>
                  </div>

                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase tracking-wide block">Số giấy tờ định danh (CCCD/Passport)</span>
                    <p className="text-slate-900 font-mono font-black text-sm mt-0.5">{selectedCustomer.identityNumber}</p>
                  </div>

                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase tracking-wide block">Trạng thái xác minh hiện hành</span>
                    <span className={`inline-block px-2.5 py-0.5 mt-1 rounded text-[10px] font-black border ${
                      selectedCustomer.verificationStatus === 'UNVERIFIED' 
                        ? 'bg-slate-150 text-slate-600 border-slate-250' 
                        : selectedCustomer.verificationStatus === 'PENDING'
                        ? 'bg-amber-100 text-amber-800 border-amber-250'
                        : selectedCustomer.verificationStatus === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-250'
                        : 'bg-rose-100 text-rose-800 border-rose-250'
                    }`}>
                      {selectedCustomer.verificationStatus === 'UNVERIFIED' && 'Chưa xác minh'}
                      {selectedCustomer.verificationStatus === 'PENDING' && 'Chờ duyệt'}
                      {selectedCustomer.verificationStatus === 'APPROVED' && 'Đã duyệt'}
                      {selectedCustomer.verificationStatus === 'REJECTED' && 'Bị từ chối'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION C. HỒ SƠ XÁC MINH */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                <h4 className="text-[#00236f] uppercase text-[10.5px] tracking-wider font-extrabold border-b border-slate-150 pb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-indigo-600 rounded-xs inline-block"></span>
                  C. Hồ sơ gửi xác minh định danh (CCCD)
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase tracking-wide block">Số giấy tờ định danh trong hồ sơ</span>
                    <p className="text-slate-900 font-mono font-black text-xs mt-0.5">{selectedCustomer.identityNumber}</p>
                  </div>

                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase tracking-wide block">Ngày gửi hồ sơ báo cáo</span>
                    <p className="text-slate-800 font-mono text-xs mt-0.5">{selectedCustomer.submittedDate}</p>
                  </div>

                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase tracking-wide block">Người phê duyệt</span>
                    <p className="text-slate-800 text-xs mt-0.5">{selectedCustomer.reviewedBy}</p>
                  </div>

                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase tracking-wide block">Ngày phê duyệt</span>
                    <p className="text-slate-800 font-mono text-xs mt-0.5">{selectedCustomer.reviewedAt}</p>
                  </div>

                  <div className="col-span-2">
                    <span className="text-[9.5px] text-slate-400 uppercase tracking-wide block">Lý do từ chối (nếu có)</span>
                    <p className={`mt-0.5 p-2 bg-slate-50 border rounded-lg italic text-[11px] ${selectedCustomer.verificationStatus === 'REJECTED' ? 'text-rose-800 border-rose-100 bg-rose-50/40 font-bold' : 'text-slate-500'}`}>
                      {selectedCustomer.rejectReason}
                    </p>
                  </div>

                  {/* Attachment Filenames displays inside specs as requested */}
                  {selectedCustomer.frontImageFilename && (
                    <div className="col-span-2 space-y-1 bg-slate-50/70 p-3.5 border rounded-xl font-mono text-[10.5px]">
                      <div className="text-slate-500 font-sans font-bold flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 inline text-indigo-700" />
                        Danh sách tài liệu đính kèm:
                      </div>
                      <div className="pt-1.5 space-y-1">
                        <p>• Ảnh mặt trước giấy tờ: <strong className="text-indigo-850">{selectedCustomer.frontImageFilename}</strong></p>
                        <p>• Ảnh mặt sau giấy tờ: <strong className="text-indigo-850">{selectedCustomer.backImageFilename}</strong></p>
                      </div>
                    </div>
                  )}

                  {/* Visual ID Card Thumbnails with Falls backs */}
                  {selectedCustomer.verificationStatus !== 'UNVERIFIED' && (
                    <div className="col-span-2 space-y-2">
                      <span className="text-[9.5px] text-slate-400 uppercase block font-bold">Hình ảnh đối chiếu giấy tờ thực tế</span>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {/* Front Image Thumb container */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-500 font-extrabold block">Ảnh mặt trước</span>
                          <ImageWithFallback 
                            src={selectedCustomer.frontImageUrl} 
                            alt={`${selectedCustomer.name} - Front`} 
                            label="Mặt trước CCCD" 
                            filename={selectedCustomer.frontImageFilename}
                          />
                        </div>

                        {/* Back Image Thumb container */}
                        <div className="space-y-1 flex flex-col justify-end">
                          <span className="text-[10px] text-slate-500 font-extrabold block">Ảnh mặt sau</span>
                          <ImageWithFallback 
                            src={selectedCustomer.backImageUrl} 
                            alt={`${selectedCustomer.name} - Back`} 
                            label="Mặt sau CCCD" 
                            filename={selectedCustomer.backImageFilename}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* SECTION D. KHU VỰC THAO TÁC XỬ LÝ HỒ SƠ */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <h4 className="text-[#00236f] uppercase text-[10.5px] tracking-wider font-extrabold border-b border-slate-150 pb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-slate-800 rounded-xs inline-block"></span>
                  D. Thao tác xử lý hồ sơ xác minh
                </h4>

                {/* If Pending (Chờ duyệt): Show the exact co-level buttons inside the drawers */}
                {selectedCustomer.verificationStatus === 'PENDING' && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-1 select-none">
                    <button
                      type="button"
                      onClick={handleOpenReject}
                      className="flex-1 py-3 bg-rose-50 hover:bg-rose-100 border border-rose-250 text-rose-700 hover:text-rose-800 text-[11px] font-black uppercase rounded-xl tracking-wide transition cursor-pointer"
                    >
                      Từ chối hồ sơ xác minh
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenApprove}
                      className="flex-1 py-3 bg-[#00236f] hover:bg-slate-800 text-white text-[11px] font-black uppercase rounded-xl tracking-wide transition shadow-sm cursor-pointer"
                    >
                      Duyệt hồ sơ xác minh
                    </button>
                  </div>
                )}

                {/* If Approved (Đã duyệt): Displays text: "Hồ sơ đã được duyệt" */}
                {selectedCustomer.verificationStatus === 'APPROVED' && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 font-extrabold flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-emerald-700" />
                    Hồ sơ đã được duyệt bởi {selectedCustomer.reviewedBy} ngày {selectedCustomer.reviewedAt}
                  </div>
                )}

                {/* If Rejected (Bị từ chối): Displays rejection reason */}
                {selectedCustomer.verificationStatus === 'REJECTED' && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-800 font-extrabold space-y-1">
                    <p className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-700" />
                      Lý do hồ sơ bị từ chối phê duyệt:
                    </p>
                    <p className="text-slate-700 italic pl-6 font-semibold">“ {selectedCustomer.rejectReason} ”</p>
                  </div>
                )}

                {/* If Unverified (Chưa xác minh): Displays text: "Khách hàng chưa gửi hồ sơ xác minh" */}
                {selectedCustomer.verificationStatus === 'UNVERIFIED' && (
                  <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-[11px] text-slate-500 font-extrabold flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0 text-slate-400" />
                    Khách hàng chưa gửi hồ sơ xác minh định danh (CCCD)
                  </div>
                )}
              </div>

            </div>

            {/* Bottom stick dismiss actions inside Drawer */}
            <div className="px-6 py-4.5 border-t border-slate-150 bg-slate-50 shrink-0 text-right">
              <button
                type="button"
                onClick={() => setShowDetail(false)}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl uppercase transition cursor-pointer text-xs font-black select-none"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DUYỆT HỒ SƠ XÁC MINH - CONFIRM MODAL OVERLAY */}
      {/* ======================================================== */}
      {showConfirmApprove && selectedCustomer && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
          <div onClick={() => setShowConfirmApprove(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />
          
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-xs text-slate-800 font-semibold text-left">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center select-none">
              <span className="font-extrabold text-[#00236f] uppercase">
                Duyệt hồ sơ xác minh
              </span>
              <button 
                onClick={() => setShowConfirmApprove(false)}
                className="p-1 text-slate-400 hover:text-slate-950 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <p className="text-slate-650 text-xs font-medium leading-relaxed">
                Bạn có chắc chắn muốn duyệt hồ sơ xác minh của khách hàng này không?
              </p>

              {/* Informational Customer metadata matching specs requirements */}
              <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl space-y-2">
                <div>
                  <span className="text-[9.5px] text-slate-400 block uppercase font-bold">Họ tên khách hàng:</span>
                  <strong className="text-slate-850 font-extrabold text-sm">{selectedCustomer.name}</strong>
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-400 block uppercase font-bold">Email tài khoản:</span>
                  <span className="font-mono text-[#00236f] font-bold">{selectedCustomer.email}</span>
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-400 block uppercase font-bold">Số điện thoại liên hệ:</span>
                  <span className="font-mono text-slate-700 font-bold">{selectedCustomer.phone}</span>
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-400 block uppercase font-bold">Số giấy tờ định danh (CCCD):</span>
                  <span className="font-mono text-slate-800 font-bold">{selectedCustomer.identityNumber}</span>
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-400 block uppercase font-bold">Trạng thái hiện tại:</span>
                  <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-800">
                    Chờ duyệt
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-5 py-4 border-t border-slate-150 bg-slate-50 flex justify-end gap-2 text-xs select-none">
              <button
                type="button"
                onClick={() => setShowConfirmApprove(false)}
                className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-250 border border-slate-200 text-slate-700 font-bold rounded-xl transition"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmApprove}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition shadow-xs cursor-pointer"
              >
                Xác nhận duyệt
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TỪ CHỐI HỒ SƠ XÁC MINH - CONFIRM MODAL OVERLAY */}
      {/* ======================================================== */}
      {showConfirmReject && selectedCustomer && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
          <div onClick={() => setShowConfirmReject(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />
          
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-xs text-slate-800 font-semibold text-left">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center select-none">
              <span className="font-extrabold text-rose-700 uppercase">
                Từ chối hồ sơ xác minh
              </span>
              <button 
                onClick={() => setShowConfirmReject(false)}
                className="p-1 text-slate-400 hover:text-slate-950 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              
              {/* Informational Customer metadata matching specs requirements */}
              <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl space-y-2">
                <div>
                  <span className="text-[9.5px] text-slate-400 block uppercase font-bold">Họ tên khách hàng:</span>
                  <strong className="text-slate-850 font-extrabold text-sm">{selectedCustomer.name}</strong>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[9.5px] text-slate-400 block uppercase font-bold">Email:</span>
                    <span className="font-mono text-slate-700 font-bold">{selectedCustomer.email}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 block uppercase font-bold">Số điện thoại:</span>
                    <span className="font-mono text-slate-700 font-bold">{selectedCustomer.phone}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-400 block uppercase font-bold">Số định danh cccd:</span>
                  <span className="font-mono text-slate-800 font-bold">{selectedCustomer.identityNumber}</span>
                </div>
              </div>

              {/* Textarea Reason (MANDATORY VALIDATION) */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-extrabold uppercase block block mb-1">
                  Lý do từ chối cụ thể <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="3.5"
                  required
                  value={rejectReasonInput}
                  onChange={(e) => {
                    setRejectReasonInput(e.target.value);
                    if (e.target.value.trim()) setRejectError(false);
                  }}
                  placeholder="Ví dụ: Ảnh mặt sau của CCCD bị mất góc, không trùng khớp với số ID hoặc mặt trước có hiện tượng làm giả..."
                  className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl outline-none text-xs font-bold font-sans resize-none placeholder:text-slate-400 focus:bg-white focus:ring-1 focus:ring-rose-500 ${
                    rejectError ? 'border-rose-500 bg-rose-50/50' : 'border-slate-205'
                  }`}
                />
                {rejectError && (
                  <p className="text-[10.5px] text-rose-600 font-black">
                    Vui lòng nhập lý do từ chối
                  </p>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-5 py-4 border-t border-slate-150 bg-slate-50 flex justify-end gap-2 text-xs select-none">
              <button
                type="button"
                onClick={() => setShowConfirmReject(false)}
                className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-250 border border-slate-200 text-slate-700 font-bold rounded-xl transition"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl transition shadow-xs cursor-pointer"
              >
                Xác nhận từ chối
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FULLSIZE GALLERY LIGHTBOX MODAL OVERLAY */}
      {/* ======================================================== */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[1600] flex flex-col items-center justify-center p-4">
          <div onClick={() => setLightboxImage(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs" />
          
          <div className="relative max-w-3xl w-full flex flex-col items-center">
            {/* Top Close */}
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white hover:text-white p-2 rounded-full transition cursor-pointer"
              title="Đóng ảnh"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image display */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative max-h-[75vh] w-full flex items-center justify-center">
              <img 
                src={lightboxImage.src} 
                alt="Lightbox Full Size view" 
                className="max-h-[75vh] max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Label detail block */}
            <p className="text-white text-xs font-bold font-sans mt-3 text-center filter drop-shadow">
              {lightboxImage.label} {lightboxImage.filename && <span className="text-slate-400 ml-1.5 font-mono font-normal">({lightboxImage.filename})</span>}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
