import React, { useState } from 'react';
import { 
  Download, 
  Search, 
  Filter, 
  UserCheck, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  User, 
  Badge, 
  History, 
  Slash, 
  AlertTriangle, 
  Check, 
  Eye, 
  Calendar,
  XCircle,
  FileText
} from 'lucide-react';

const INITIAL_PROFILES = [
  {
    id: '#VX-1002',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    cccd: '031092001234',
    dateOfBirth: '15/05/1992',
    address: '123 Đường ABC, Phường 4, Quận 5, TP. Hồ Chí Minh',
    issueDate: '10/01/2021',
    issuePlace: 'Cục Cảnh sát Quản lý hành chính về trật tự xã hội',
    submittedDate: '24/05/2024',
    status: 'pending',
    avatarInitials: 'NA',
    colorClass: 'bg-blue-100 text-blue-800',
    historyLogs: [
      { action: 'Hệ thống nhận hồ sơ', time: '24/05/2024 - 10:15', status: 'success' },
      { action: 'Đang chờ thẩm định', time: 'Hiện tại', status: 'warning' }
    ],
    frontImage: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400', // Mock representation of card front
    backImage: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=400', // Mock card back
    portraitImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400' // Face verification selfie
  },
  {
    id: '#VX-1001',
    name: 'Trần Thị Thu',
    phone: '0912345678',
    cccd: '045091008765',
    dateOfBirth: '20/09/1994',
    address: '789 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    issueDate: '15/03/2020',
    issuePlace: 'Cục Cảnh sát Quản lý hành chính về trật tự xã hội',
    submittedDate: '23/05/2024',
    status: 'approved',
    avatarInitials: 'TT',
    colorClass: 'bg-amber-100 text-amber-800',
    historyLogs: [
      { action: 'Hệ thống nhận hồ sơ', time: '23/05/2024 - 08:30', status: 'success' },
      { action: 'Khởi tạo tiến trình xác minh', time: '23/05/2024 - 08:40', status: 'success' },
      { action: 'Đã phê duyệt hồ sơ', time: '23/05/2024 - 10:00', status: 'success' }
    ],
    frontImage: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400',
    backImage: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=400',
    portraitImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'
  },
  {
    id: '#VX-1000',
    name: 'Lê Văn Bình',
    phone: '0987654321',
    cccd: '079094001290',
    dateOfBirth: '05/11/1989',
    address: '456 Đường CMT8, Phường 10, Quận 3, TP. Hồ Chí Minh',
    issueDate: '12/07/2019',
    issuePlace: 'Cục Cảnh sát Quản lý hành chính về trật tự xã hội',
    submittedDate: '22/05/2024',
    status: 'rejected',
    avatarInitials: 'LB',
    colorClass: 'bg-red-100 text-red-800',
    rejectionReason: 'Ảnh mặt trước CCCD bị mờ, không thể đọc rõ số định danh.',
    historyLogs: [
      { action: 'Hệ thống nhận hồ sơ', time: '22/05/2024 - 14:15', status: 'success' },
      { action: 'Đã từ chối do không hợp lệ', time: '22/05/2024 - 15:30', status: 'error' }
    ],
    frontImage: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400',
    backImage: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=400',
    portraitImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'
  }
];

export default function Verifications() {
  const [profiles, setProfiles] = useState(INITIAL_PROFILES);
  const [selectedProfile, setSelectedProfile] = useState(INITIAL_PROFILES[0]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  // Modals visibility states
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  
  // Rejection logic input
  const [rejectionInput, setRejectionInput] = useState('');
  const [rejectionError, setRejectionError] = useState(false);

  // Success Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenProfile = (profile) => {
    setSelectedProfile(profile);
    setIsDrawerOpen(true);
  };

  const triggerApprove = () => {
    setIsApproveModalOpen(true);
  };

  const handleConfirmApproval = () => {
    const updatedProfiles = profiles.map(p => {
      if (p.id === selectedProfile.id) {
        return {
          ...p,
          status: 'approved',
          historyLogs: [
            ...p.historyLogs,
            { action: 'Đã phê duyệt hồ sơ', time: 'Vừa xong', status: 'success' }
          ]
        };
      }
      return p;
    });

    setProfiles(updatedProfiles);
    // Sync current selected
    setSelectedProfile({
      ...selectedProfile,
      status: 'approved',
      historyLogs: [
        ...selectedProfile.historyLogs,
        { action: 'Đã phê duyệt hồ sơ', time: 'Vừa xong', status: 'success' }
      ]
    });

    setIsApproveModalOpen(false);
    showToast(`Đã duyệt thành công hồ sơ ${selectedProfile.id} của khách hàng ${selectedProfile.name}!`);
  };

  const triggerReject = () => {
    setRejectionInput('');
    setRejectionError(false);
    setIsRejectModalOpen(true);
  };

  const handleConfirmRejection = () => {
    if (!rejectionInput.trim()) {
      setRejectionError(true);
      return;
    }

    const updatedProfiles = profiles.map(p => {
      if (p.id === selectedProfile.id) {
        return {
          ...p,
          status: 'rejected',
          rejectionReason: rejectionInput,
          historyLogs: [
            ...p.historyLogs,
            { action: `Từ chối: ${rejectionInput}`, time: 'Vừa xong', status: 'error' }
          ]
        };
      }
      return p;
    });

    setProfiles(updatedProfiles);
    setSelectedProfile({
      ...selectedProfile,
      status: 'rejected',
      rejectionReason: rejectionInput,
      historyLogs: [
        ...selectedProfile.historyLogs,
        { action: `Từ chối: ${rejectionInput}`, time: 'Vừa xong', status: 'error' }
      ]
    });

    setIsRejectModalOpen(false);
    showToast(`Đã từ chối hồ sơ ${selectedProfile.id} và gửi email giải trình đến khách hàng.`);
  };

  // Filter calculations
  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.phone.includes(searchQuery) ||
                          p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' || p.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter) {
      const parts = dateFilter.split('-');
      if (parts.length === 3) {
        const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
        matchesDate = p.submittedDate === formattedDate;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-6 relative">
      
      {/* Toast Announcement */}
      {toastMessage && (
        <div className="fixed top-20 right-4 bg-emerald-600 text-white px-6 py-3.5 rounded-lg shadow-xl z-[100] flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#00236f]">Hồ sơ xác minh khách hàng</h2>
          <p className="text-sm text-slate-500 mt-1">Quản lý và phê duyệt thông tin định danh của người dùng đăng ký.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 shadow-sm">
          
          Xuất báo cáo
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full font-sans">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo Tên khách hàng, SĐT hoặc Mã hồ sơ..."
            className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-blue-500/50 outline-none font-medium"
          />
        </div>
        
        {/* Status Filter */}
        <div className="w-full md:w-52 font-sans">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:ring-1 focus:ring-blue-500/50 outline-none cursor-pointer text-slate-800 hover:bg-slate-50 font-medium"
          >
            <option value="">Trạng thái: Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="w-full md:w-52 font-sans flex items-center gap-1.5">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-blue-500/50 outline-none cursor-pointer text-slate-800 hover:bg-slate-50 font-medium font-mono"
            placeholder="Ngày nộp"
          />
          {dateFilter && (
            <button 
              onClick={() => setDateFilter('')}
              className="text-xs text-red-500 hover:text-red-700 font-bold shrink-0 px-2 py-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100"
              title="Xóa ngày"
            >
              X
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[900px] text-left border-collapse font-sans">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs font-bold uppercase">
                <th className="px-6 py-4 whitespace-nowrap">Mã hồ sơ</th>
                <th className="px-6 py-4 min-w-[150px]">Tên khách hàng</th>
                <th className="px-6 py-4 whitespace-nowrap">Email/Số điện thoại</th>
                <th className="px-6 py-4 whitespace-nowrap">Số giấy tờ</th>
                <th className="px-6 py-4 text-center whitespace-nowrap">Ngày gửi</th>
                <th className="px-6 py-4 text-center whitespace-nowrap">Trạng thái</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Xem chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400 text-sm italic font-medium">
                    Không tìm thấy hồ sơ nào trùng khớp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((p) => {
                  const isCurrentSelected = selectedProfile && selectedProfile.id === p.id && isDrawerOpen;
                  return (
                    <tr 
                      key={p.id} 
                      className={`hover:bg-slate-50/50 transition-colors ${isCurrentSelected ? 'bg-blue-50/40 font-semibold' : ''}`}
                    >
                      <td className="px-6 py-4 font-mono text-sm text-[#00236f] font-bold whitespace-nowrap">{p.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-serif font-bold text-xs shrink-0 ${p.colorClass}`}>
                            {p.avatarInitials}
                          </div>
                          <span className="text-sm font-semibold text-slate-800 block">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">{p.phone}</span>
                          <span className="text-[11px] text-slate-400 font-normal">{p.email || `${p.id.replace('#', '').toLowerCase()}@trent.vn`}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-mono font-semibold whitespace-nowrap">{p.cccd}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-semibold text-center whitespace-nowrap">{p.submittedDate}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {p.status === 'pending' && (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
                            Chờ duyệt
                          </span>
                        )}
                        {p.status === 'approved' && (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                            Đã duyệt
                          </span>
                        )}
                        {p.status === 'rejected' && (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 whitespace-nowrap">
                            Từ chối
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button 
                          onClick={() => handleOpenProfile(p)}
                          className="px-4 py-1.5 border border-[#00236f] text-[#00236f] scroll-smooth hover:bg-blue-50 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer"
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar mockup */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <p>Hiển thị {filteredProfiles.length} trong tổng số {profiles.length} hồ sơ thẩm định</p>
          <div className="flex gap-1">
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-30" disabled>Quay l?i
              
            </button>
            <button className="min-w-[32px] h-8 bg-[#00236f] text-white rounded-lg font-bold">1</button>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-white">Ti?p
              
            </button>
          </div>
        </div>
      </div>

      {/* Side Slide-out Drawer */}
      {isDrawerOpen && selectedProfile && (
        <>
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 z-[50] transition-opacity duration-350"
          />
          <div className="fixed top-0 right-0 h-screen w-full max-w-xl bg-white z-[60] shadow-2xl flex flex-col transition-transform duration-300">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-200 transition-all"
                >??ng
                  
                </button>
                <div>
                  <h3 className="text-base font-serif font-bold text-[#00236f]">Chi tiết hồ sơ {selectedProfile.id}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Ngày gửi: {selectedProfile.submittedDate} • {selectedProfile.name}</p>
                </div>
              </div>
              <div>
                {selectedProfile.status === 'pending' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Chờ duyệt
                  </span>
                )}
                {selectedProfile.status === 'approved' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Đã duyệt
                  </span>
                )}
                {selectedProfile.status === 'rejected' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                    Từ chối
                  </span>
                )}
              </div>
            </div>

            {/* Scrollable Content inside Drawer */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
              
              {/* Personal Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#00236f] pb-1.5 border-b border-slate-100">
                  <User className="w-5 h-5 text-[#00236f]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider font-serif">Thông tin cá nhân</h4>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Họ và tên</span>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{selectedProfile.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ngày sinh</span>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{selectedProfile.dateOfBirth}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Địa chỉ thường trú</span>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5 leading-relaxed">{selectedProfile.address}</p>
                  </div>
                </div>
              </div>

              {/* ID Documents Specifications */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#00236f] pb-1.5 border-b border-slate-100">
                  <FileText className="w-5 h-5 text-[#00236f]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider font-serif">Thông tin giấy tờ định danh</h4>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Số CCCD</span>
                    <p className="text-sm font-mono font-bold text-slate-800 mt-0.5">{selectedProfile.cccd}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ngày cấp</span>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{selectedProfile.issueDate}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nơi cấp</span>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">{selectedProfile.issuePlace}</p>
                  </div>
                </div>

                {/* Displaying images placeholder representation from mockup */}
                <div className="pt-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-500">Mặt trước CCCD</p>
                      <div className="aspect-[3/2] rounded-lg overflow-hidden border border-slate-200 shadow-sm relative group cursor-zoom-in bg-slate-50">
                        <img 
                          src="https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400" 
                          alt="ID Front representation"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="text-white w-5 h-5" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-500">Mặt sau CCCD</p>
                      <div className="aspect-[3/2] rounded-lg overflow-hidden border border-slate-200 shadow-sm relative group cursor-zoom-in bg-slate-50">
                        <img 
                          src="https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=400" 
                          alt="ID Back representation"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="text-white w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-500">Ảnh chân dung cầm CCCD</p>
                    <div className="aspect-video rounded-lg overflow-hidden border-2 border-dashed border-slate-200 hover:border-[#00236f] transition-colors flex flex-col items-center justify-center group relative cursor-zoom-in bg-slate-50">
                      <img 
                        src={selectedProfile.portraitImage} 
                        alt="Portrait holding ID" 
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-90 grayscale-[0.2]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/30 transition-all flex flex-col items-center justify-center">
                        <Eye className="text-white w-7 h-7 filter drop-shadow" />
                        <span className="text-[11px] text-white font-bold tracking-wider uppercase mt-1.5 filter drop-shadow">Xem ảnh chân dung sắc nét</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* If Rejected details */}
              {selectedProfile.status === 'rejected' && selectedProfile.rejectionReason && (
                <div className="p-4 bg-red-50 border border-red-150 rounded-lg text-red-800 text-sm">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    Lý do đã từ chối hồ sơ:
                  </p>
                  <p className="mt-1 text-slate-700 italic">{selectedProfile.rejectionReason}</p>
                </div>
              )}

              {/* Audit history logs timeline */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-[#00236f] pb-1.5 border-b border-slate-100">
                  <History className="w-5 h-5 text-[#00236f]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider font-serif">Nhật ký xử lý</h4>
                </div>
                <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                  {selectedProfile.historyLogs.map((log, index) => (
                    <div key={index} className="relative">
                      <div className={`absolute left-[-21px] top-1 w-3.5 h-3.5 rounded-full border-4 border-white shadow-sm ${
                        log.status === 'success' ? 'bg-emerald-500' : log.status === 'error' ? 'bg-red-500' : 'bg-amber-500'
                      }`} />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{log.action}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{log.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Sticky Footer inside Drawer */}
            {selectedProfile.status === 'pending' && (
              <div className="p-5 border-t border-slate-200 bg-slate-50 flex gap-4">
                <button 
                  onClick={triggerReject}
                  className="flex-1 border-2 border-red-600 hover:bg-red-50 text-red-600 py-3 rounded-lg text-sm font-bold active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  
                  Từ chối hồ sơ
                </button>
                <button 
                  onClick={triggerApprove}
                  className="flex-1 bg-[#00236f] hover:bg-blue-950 text-white py-3 rounded-lg text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  
                  Duyệt hồ sơ
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Reject Profile Reason Modals */}
      {isRejectModalOpen && selectedProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div onClick={() => setIsRejectModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col scale-100 transition-all font-sans">
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h3 className="text-xl font-serif font-bold text-slate-800">Từ chối hồ sơ</h3>
              <button onClick={() => setIsRejectModalOpen(false)} className="text-slate-400 hover:bg-slate-100 rounded-full p-1.5 transition-all">??ng
                
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex gap-3.5 p-4 bg-red-50 rounded-lg border border-red-100">
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                <p className="text-sm text-slate-600 leading-relaxed">
                  Vui lòng nhập lý do từ chối hồ sơ <span className="font-bold text-slate-900">{selectedProfile.id}</span>.
                  Thông tin từ chối chi tiết này sẽ được gửi trực tiếp đến hộp thư email của khách hàng.
                </p>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="rekey" className="text-xs font-bold text-slate-700 uppercase tracking-wider">Lý do từ chối cụ thể</label>
                <textarea 
                  id="rekey"
                  rows="4"
                  value={rejectionInput}
                  onChange={(e) => {
                    setRejectionInput(e.target.value);
                    if (e.target.value.trim()) setRejectionError(false);
                  }}
                  placeholder="Ví dụ: Ảnh mặt sau của CCCD bị mất góc, không trùng khớp với số ID hoặc mặt trước có hiện tượng làm giả bằng PTS..."
                  className={`w-full px-4 py-3 text-sm bg-slate-50 border rounded-lg focus:ring-1 focus:ring-blue-500/50 outline-none transition-all resize-none placeholder:text-slate-400/80 ${
                    rejectionError ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'
                  }`}
                />
                {rejectionError && (
                  <p className="text-xs text-red-600 font-semibold">Cảnh báo: Bạn phải điền lý do chi tiết để hỗ trợ người dùng chỉnh sửa lại!</p>
                )}
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                  <Badge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Mô tả chi tiết và lịch sự để hỗ trợ trải nghiệm người dùng tối ưu hơn.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsRejectModalOpen(false)}
                className="px-5 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold font-serif"
              >
                Hủy
              </button>
              <button 
                onClick={handleConfirmRejection}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all font-serif"
              >
                
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Approve Verification Profiles Modals */}
      {isApproveModalOpen && selectedProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div onClick={() => setIsApproveModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative bg-white w-full max-w-sm rounded-xl shadow-2xl overflow-hidden flex flex-col scale-100 transition-all font-sans">
            <div className="p-6 pb-4 flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900">Xác nhận duyệt hồ sơ</h3>
              </div>
              <button onClick={() => setIsApproveModalOpen(false)} className="text-slate-400 hover:bg-slate-100 rounded-full p-1 transition-all">??ng
                
              </button>
            </div>

            <div className="px-6 py-2 pb-5 space-y-3">
              <p className="text-sm text-slate-600 leading-relaxed">
                Bạn có chắc chắn muốn phê duyệt hồ sơ thẩm định <span className="font-bold text-slate-900">{selectedProfile.id}</span> của khách hàng <span className="font-bold text-slate-950">{selectedProfile.name}</span>?
              </p>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100/65">
                <p className="text-xs text-emerald-800 leading-relaxed italic">
                  Sau khi duyệt thành công, khách hàng này sẽ được nâng cấp trạng thái thành <b>TIN CẬY (Verified)</b>, được quyền tự do đặt cược thuê thiết bị và thực hiện ký hợp đồng tự động.
                </p>
              </div>
            </div>

            <div className="p-5 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => setIsApproveModalOpen(false)}
                className="flex-1 py-2 text-center border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-bold font-serif"
              >
                Hủy
              </button>
              <button 
                onClick={handleConfirmApproval}
                className="flex-1 py-2 text-center bg-[#00236f] hover:bg-blue-900 text-white rounded-lg text-xs font-bold shadow-sm font-serif"
              >
                Xác nhận duyệt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
