import React, { useState } from 'react';
import { 
  Database, 
  Wrench, 
  Search, 
  PlusCircle, 
  Trash2, 
  Camera, 
  FileText, 
  SlidersHorizontal, 
  ArrowLeft, 
  Check, 
  CheckCircle, 
  CheckCircle2,
  Lock, 
  ShieldAlert, 
  Clock, 
  ArrowUpRight, 
  Download, 
  AlertCircle, 
  ThumbsUp, 
  ThumbsDown,
  X,
  Plus,
  HelpCircle,
  TrendingDown,
  CheckSquare,
  AlertTriangle,
  FileCheck2,
  User,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

const formatVND = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Seeding standard mock dossier files (Screen 6)
const INITIAL_DOSSIERS = [
  {
    id: 'PS-001',
    orderId: 'ORD-552190',
    customerName: 'Nguyễn Minh Hoàng',
    customerPhone: '0908 488 291',
    customerType: 'VIP',
    issueType: 'Hư hỏng thiết bị',
    totalFee: 3200000,
    status: 'Chờ xử lý',
    date: '24/10/2023',
    assetName: 'Sony Alpha A7 IV',
    serialNum: 'SONY-7488-2910',
    assetValuation: 45000000,
    techNotes: 'Nhân viên kỹ thuật báo cáo: Thiết bị được trả lại trong tình trạng nứt thấu kính phía trước của ống kính Lens Sony FE 24-70mm f/2.8 GM II dính kèm. Có dấu hiệu va đập cơ học rõ rệt trên vòng lấy nét. Đánh giá sơ bộ: Cần thay thới thấu kính ngoài và hiệu chỉnh cơ học vòng AF.',
    customerStatement: 'Tôi khẳng định lúc nhận máy tại quầy đã có một vết rạn chân chim rất mờ phần viền ngoài kính. Tôi chỉ sử dụng chụp chân dung tĩnh trong Studio máy lạnh, hoàn toàn không xảy ra va chạm hay rơi rớt. Đề nghị camera cửa hàng đối soát thời điểm bàn giao.',
    proofPhotos: [
      'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=200',
      'https://images.unsplash.com/photo-1620510629702-92149b10003e?w=200'
    ]
  },
  {
    id: 'PS-002',
    orderId: 'ORD-552195',
    customerName: 'Trần Thị Bích',
    customerPhone: '0912 345 678',
    customerType: 'Thường',
    issueType: 'Trả muộn',
    totalFee: 500000,
    status: 'Đã giải quyết',
    date: '22/10/2023',
    assetName: 'Canon EOS R5',
    serialNum: 'CANON-1022-9908',
    assetValuation: 82000000,
    techNotes: 'Khách hàng trả trễ 12 tiếng không thông báo trước. Đã áp dụng mức phạt trả muộn 500,000đ theo hợp đồng.',
    customerStatement: 'Do sự cố bão lớn tại địa điểm chụp ngoại cảnh Quảng Ninh khiến xe di chuyển về Hà Nội bị chậm trễ, tôi đã gọi điện thông báo cho tổng đài nhưng bận máy.',
    proofPhotos: []
  },
  {
    id: 'PS-003',
    orderId: 'ORD-552202',
    customerName: 'Lê Hoàng Cường',
    customerPhone: '0987 654 321',
    customerType: 'VIP',
    issueType: 'Mất mát phụ kiện',
    totalFee: 12000000,
    status: 'Đang giải quyết',
    date: '21/10/2023',
    assetName: 'DJI Ronin RS 3 Pro',
    serialNum: 'DJI-RON-9921',
    assetValuation: 21000000,
    techNotes: 'Thiếu bộ thu phát hình ảnh không dây RavenEye dính kèm trong hộp lúc trả. Đã lập biên bản hao hụt.',
    customerStatement: 'Tôi để quên RavenEye tại lán nghỉ ở Tam Đảo. Đã nhờ người chuyển phát nhanh trả lại cửa hàng trong hôm nay.',
    proofPhotos: []
  },
  {
    id: 'PS-004',
    orderId: 'ORD-552209',
    customerName: 'Phạm Minh Danh',
    customerPhone: '0944 555 666',
    customerType: 'Thường',
    issueType: 'Đóng cọc bồi thường',
    totalFee: 1800000,
    status: 'Chờ xử lý',
    date: '20/10/2023',
    assetName: 'Sony FE 70-200mm f/2.8 GM',
    serialNum: 'SONY-LENS-8401',
    assetValuation: 52000000,
    techNotes: 'Nắp loa thấu kính ngoài bị trầy xước sâu mất thẩm mỹ cần bồi thường linh kiện.',
    customerStatement: 'Tôi đồng ý hỗ trợ bồi hoàn 50% giá trị nắp loa kính do sơ suất dựng dựng chân máy nghiêng.',
    proofPhotos: []
  }
];

// Seeded active maintenance assets (Tab 2)
const INITIAL_MAINTENANCE_ASSETS = [
  {
    id: 'ASSET-2900',
    name: 'Sony Alpha A7 IV (Body)',
    serial: 'SN-4022-A74',
    status: 'maintenance',
    statusLabel: 'Đang bảo trì',
    reason: 'Vệ sinh cảm biến CCD & Hiệu chỉnh chống rung thân máy (IBIS)',
    cost: '850.000đ',
    startDate: '12/10/2023',
    endDate: '15/10/2023',
    reporter: 'Kỹ thuật viên Phạm Minh',
    priority: 'Cao',
    note: 'Cảm biến bám bụi hạt mịn nhiều sau sê-ri chụp ngoại cảnh cát Phan Thiết.'
  },
  {
    id: 'ASSET-7105',
    name: 'Lens Sony 24-70mm f/2.8 GM II',
    serial: 'SN-GM2-9921',
    status: 'ready',
    statusLabel: 'Sẵn sàng',
    reason: 'Đánh bóng thấu kính & Sửa lẫy khẩu rít cơ học',
    cost: '1.200.000đ',
    startDate: '10/10/2023',
    endDate: '13/10/2523',
    reporter: 'Kỹ thuật viên Lê Hoàng',
    priority: 'Trung bình',
    note: 'Đã hoàn tất lau mốc rễ tre thấu kính nhóm trung gian đạt chuẩn quang sai gốc.'
  }
];

export default function Disputes() {
  const [activeTab, setActiveTab] = useState('tab1'); // tab1: Phát sinh & Tranh chấp, tab2: Bảo trì thiết bị
  
  // Tab 1 (Disputes list & details) state
  const [dossiers, setDossiers] = useState(INITIAL_DOSSIERS);
  const [selectedDossier, setSelectedDossier] = useState(null);
  
  // Search and filter criteria
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIssueType, setFilterIssueType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Interactive profile decision block state (Screen 2)
  const [resolutionDecision, setResolutionDecision] = useState('Phát sinh hợp lệ');
  const [resolutionNotes, setResolutionNotes] = useState('Kê khai bổ sung lỗi vỡ nứt thấu kính do rơi từ độ cao tầm tay. Phê duyệt trừ 3.200.000đ từ tổng tiền cọc thế chấp của khách hàng để gửi trung tâm bảo hành Sony.');
  
  // Tab 2 (Maintenance) state
  const [maintenanceAssets, setMaintenanceAssets] = useState(INITIAL_MAINTENANCE_ASSETS);
  const [selectedMaintIndex, setSelectedMaintIndex] = useState(null);
  const [showMaintModal, setShowMaintModal] = useState(false);
  const [maintResultText, setMaintResultText] = useState('Hoàn tất tháo rã thấu kính, làm sạch bụi bẩn và điểm dầu thừa bám tụ trên cảm biến chính hãng.');
  
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Switch dossier resolution state
  const handleApplyResolution = () => {
    if (!selectedDossier) return;
    
    const updated = dossiers.map(d => {
      if (d.id === selectedDossier.id) {
        return {
          ...d,
          status: 'Đã giải quyết',
          techNotes: `${d.techNotes}\n\n[QUYẾT ĐỊNH XỬ LÝ]: ${resolutionDecision}\n[GHI CHÚ GIẢI QUYẾT]: ${resolutionNotes}`
        };
      }
      return d;
    });

    setDossiers(updated);
    triggerToast(`Đã lưu quyết định giải quyết cho hồ sơ phát sinh ${selectedDossier.id}.`);
    setSelectedDossier(null);
  };

  const handleNotifyCustomerClaim = () => {
    triggerToast(`Biên bản tranh chấp & khấu trừ cọc đã được gửi tự động tới Email: ${selectedDossier?.customerName}@gmail.com.`);
  };

  // Add custom photo to proof checklist
  const handleAddCustomProofPhoto = () => {
    if (!selectedDossier) return;
    const crackMockUrl = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500';
    
    const updated = dossiers.map(d => {
      if (d.id === selectedDossier.id) {
        return { ...d, proofPhotos: [...d.proofPhotos, crackMockUrl] };
      }
      return d;
    });
    setDossiers(updated);
    
    // Update active visual model too
    setSelectedDossier({
      ...selectedDossier,
      proofPhotos: [...selectedDossier.proofPhotos, crackMockUrl]
    });
    triggerToast('Đặt tải hình ảnh giám định thiết bị ngoài thực tế thành công.');
  };

  // Filter dossiers
  const filteredDossiers = dossiers.filter(d => {
    const matchesSearch = d.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIssue = filterIssueType === 'all' ? true : d.issueType === filterIssueType;
    const matchesStatus = filterStatus === 'all' ? true : d.status === filterStatus;
    return matchesSearch && matchesIssue && matchesStatus;
  });

  // Unique issues list for headers
  const issueTypes = ['all', ...new Set(dossiers.map(d => d.issueType))];

  // Tab 2 Action
  const handleSaveMaint = () => {
    if (selectedMaintIndex === null) return;
    const updated = maintenanceAssets.map((m, idx) => {
      if (idx === selectedMaintIndex) {
        return {
          ...m,
          status: 'ready',
          statusLabel: 'Sẵn sàng',
          note: `${m.note}\n\n[SỬA XONG]: ${maintResultText}`
        };
      }
      return m;
    });
    setMaintenanceAssets(updated);
    setShowMaintModal(false);
    triggerToast('Đã lưu dữ liệu bảo trì thiết bị lưu kho bãi thành công.');
  };

  return (
    <div className="space-y-6 relative font-sans antialiased text-slate-800">
      
      {/* Dynamic Toast System notifications */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-[100] transform transition duration-300">
          <div className="bg-slate-900 border border-slate-800 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="font-semibold text-xs text-white">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-serif font-black text-[#00236f]">Sự cố phát sinh & Tranh chấp</h2>
          <p className="text-xs text-slate-500 mt-1">Xử lý các tình huống bất khả kháng, hư hại bồi hoàn thiết bị và đàm phán khấu hao tiền cọc thế chấp của khách.</p>
        </div>
        
        {/* Top Summary Badges */}
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => alert('Xuất tệp báo cáo tranh chấp ERP hoàn tất vào bộ nhớ tạm.')}
            className="border border-slate-250 bg-white hover:bg-slate-55 px-4 h-10 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-2 hover:border-slate-300 transition-colors shadow-xs"
          >
            
            <span>Xuất biên bản tổng</span>
          </button>
        </div>
      </div>

      {/* Primary tab switcher */}
      <div className="flex border-b border-slate-200 bg-slate-50/50 rounded-lg p-1 max-w-sm">
        <button 
          type="button"
          onClick={() => {
            setActiveTab('tab1');
            setSelectedDossier(null);
          }}
          className={`flex-1 py-2 text-center rounded-md font-bold text-xs transition-all ${
            activeTab === 'tab1' 
              ? 'bg-white text-[#00236f] shadow-xs' 
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Phát sinh & tranh chấp
        </button>
        <button 
          type="button"
          onClick={() => {
            setActiveTab('tab2');
            setSelectedMaintIndex(null);
          }}
          className={`flex-1 py-2 text-center rounded-md font-bold text-xs transition-all ${
            activeTab === 'tab2' 
              ? 'bg-white text-[#00236f] shadow-xs' 
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Yêu cầu bảo trì ({maintenanceAssets.filter(m => m.status === 'maintenance').length})
        </button>
      </div>

      {/* ==================== TAB 1 Content ==================== */}
      {activeTab === 'tab1' && (
        <div className="space-y-6">
          
          {/* Default List View (Screen 6 Style design) */}
          {selectedDossier === null ? (
            <div className="space-y-6">
              
              {/* Filter inputs header row */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="relative md:col-span-2">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Tìm theo Mã hồ sơ, Khách hàng, Mã đơn..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 font-semibold transition"
                  />
                </div>

                <div>
                  <select 
                    value={filterIssueType}
                    onChange={(e) => setFilterIssueType(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 bg-white rounded-lg outline-none font-bold text-slate-800"
                  >
                    <option value="all">Tất cả sự vụ</option>
                    <option value="Hư hỏng thiết bị">Hư hỏng thiết bị</option>
                    <option value="Trả muộn">Trả muộn</option>
                    <option value="Mất mát phụ kiện">Mất mát phụ kiện</option>
                  </select>
                </div>

                <div>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 bg-white rounded-lg outline-none font-bold text-slate-800"
                  >
                    <option value="all">Trạng thái xử lý</option>
                    <option value="Chờ xử lý">Chờ xử lý</option>
                    <option value="Đang giải quyết">Đang giải quyết</option>
                    <option value="Đã giải quyết">Đã xử lý</option>
                  </select>
                </div>
              </div>

              {/* Dossiers table card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-6 py-4 w-32">Mã hồ sơ</th>
                        <th className="px-6 py-4 w-32">Mã đơn thuê</th>
                        <th className="px-6 py-4 min-w-[180px]">Khách hàng</th>
                        <th className="px-6 py-4 whitespace-nowrap">Loại sự cố</th>
                        <th className="px-6 py-4 whitespace-nowrap text-right">Chi phí ước tính</th>
                        <th className="px-6 py-4 text-center whitespace-nowrap w-36">Xử lý</th>
                        <th className="px-6 py-4 whitespace-nowrap">Ngày lập</th>
                        <th className="px-6 py-4 text-right whitespace-nowrap w-28">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-650">
                      {filteredDossiers.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="px-6 py-12 text-center text-slate-400 font-bold italic">
                            Không tìm thấy hồ sơ phát sinh nào phù hợp bộ lọc tìm kiếm.
                          </td>
                        </tr>
                      ) : (
                        filteredDossiers.map((dossier) => (
                          <tr key={dossier.id} className="hover:bg-slate-50/40 transition">
                            <td className="px-6 py-4.5 font-bold font-mono text-[#00236f]">{dossier.id}</td>
                            <td className="px-6 py-4.5 font-mono text-slate-500">{dossier.orderId}</td>
                            <td className="px-6 py-4.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                                  {dossier.customerName[0]}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800">{dossier.customerName}</p>
                                  <p className="text-[10px] text-slate-400">{dossier.customerPhone}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4.5 whitespace-nowrap">
                              <span className="px-2.5 py-0.5 border border-slate-150 rounded bg-slate-50 text-slate-600 font-bold">
                                {dossier.issueType}
                              </span>
                            </td>
                            <td className="px-6 py-4.5 whitespace-nowrap text-right font-black text-rose-600">
                              {formatVND(dossier.totalFee)}
                            </td>
                            <td className="px-6 py-4.5 text-center whitespace-nowrap">
                              {dossier.status === 'Chờ xử lý' ? (
                                <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-rose-50 border border-rose-200 text-rose-700 rounded-full">
                                  Chờ xử lý
                                </span>
                              ) : dossier.status === 'Đang giải quyết' ? (
                                <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-amber-50 border border-amber-250 text-amber-800 rounded-full">
                                  Đang giải quyết
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full">
                                  Đã giải quyết
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4.5 whitespace-nowrap text-slate-450 font-semibold">{dossier.date}</td>
                            <td className="px-6 py-4.5 text-right whitespace-nowrap">
                              <button 
                                type="button"
                                onClick={() => {
                                  setSelectedDossier(dossier);
                                  // Default pre-filled notes setup
                                  setResolutionDecision('Phát sinh hợp lệ');
                                  setResolutionNotes(`Xác thực hư tổn ống kính đối chiếu thực tế. Đề xuất khấu hồi phí sửa chữa thay thấu kính ngoài dự tính từ hạn mức deposit khách: ${formatVND(dossier.totalFee)}.`);
                                }}
                                className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-[11px] font-bold transition shadow-xs active:scale-95 cursor-pointer"
                              >
                                Xem chi tiết
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bento panels info row at bottom (Screen 6 stats) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-rose-50/20 border border-rose-100 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 capitalize font-extrabold block">Hồ sơ chờ tiếp nhận</span>
                    <p className="text-2xl font-serif font-black text-rose-750 mt-1">12 sự vụ mới</p>
                  </div>
                  <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-6 bg-amber-50/20 border border-amber-100 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 capitalize font-extrabold block">Đang đấu tranh giải quyết</span>
                    <p className="text-2xl font-serif font-black text-amber-700 mt-1">08 sự vụ</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-6 bg-emerald-50/20 border border-emerald-100 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 capitalize font-extrabold block">Thành công tháng này</span>
                    <p className="text-2xl font-serif font-black text-emerald-800 mt-1">45 biên bản bồi hoàn</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>

            </div>
          ) : (
            
            // Detailed dispute View (Screen 2: PS-001 Layout Style)
            <div className="space-y-6 animate-fade-in block">
              
              {/* Back button Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <button 
                  type="button"
                  onClick={() => setSelectedDossier(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-lg text-xs font-bold text-slate-700 transition cursor-pointer"
                >
                  
                  <span>Quay lại danh sách</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-450 font-semibold">Tình trạng hồ sơ:</span>
                  <span className={`px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    selectedDossier.status === 'Chờ xử lý' 
                      ? 'bg-rose-50 border border-rose-200 text-rose-700' 
                      : 'bg-emerald-50 border border-emerald-150 text-emerald-800'
                  }`}>
                    {selectedDossier.status}
                  </span>
                </div>
              </div>

              {/* Multi-column complex layout matching Screen 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Columns (Basic details, claims visual photos, statements) */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Basic order info card */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                      <FileText className="w-4.5 h-4.5 text-[#00236f]" />
                      <h3 className="font-bold text-slate-800 text-sm">Thông tin hồ sơ phát sinh: {selectedDossier.id}</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block font-semibold">Mã đơn đặt thuê</span>
                        <strong className="text-slate-800 text-sm font-mono mt-0.5 inline-block">{selectedDossier.orderId}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold">Khách hàng yêu cầu</span>
                        <strong className="text-slate-800 text-sm block mt-0.5">{selectedDossier.customerName}</strong>
                        <span className="inline-block px-1.5 py-0.2 bg-purple-50 border border-purple-100 text-purple-700 text-[9px] font-bold rounded">
                          VIP Member
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold">Hình phạt hư hao</span>
                        <strong className="text-slate-800 text-sm block mt-0.5">{selectedDossier.issueType}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold">Thời điểm nộp hồ sơ</span>
                        <strong className="text-slate-800 block mt-0.5 text-sm">{selectedDossier.date}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Associated asset details */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                      <Layers className="w-4.5 h-4.5 text-[#00236f]" />
                      <h3 className="font-bold text-slate-800 text-sm">Tài sản sườn liên quan</h3>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-slate-50 border border-slate-150 rounded-lg flex items-center justify-center p-1 font-bold">
                        <Camera className="w-8 h-8 text-slate-400" />
                      </div>
                      <div className="text-xs space-y-1">
                        <h4 className="font-serif font-black text-slate-900 text-sm">{selectedDossier.assetName}</h4>
                        <p><span className="text-slate-400 font-semibold mr-2">Mã định danh (S/NL):</span><strong className="font-mono text-slate-700 bg-slate-50 px-1.5 py-0.5 border rounded">{selectedDossier.serialNum}</strong></p>
                        <p><span className="text-slate-400 font-semibold mr-2">Giá trị tài sản hiện hành:</span><strong className="text-slate-800">{formatVND(selectedDossier.assetValuation)}</strong></p>
                      </div>
                    </div>
                  </div>

                  {/* Damaged narrative & Photo Checklist */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4.5 h-4.5 text-[#00236f]" />
                        <h3 className="font-bold text-slate-800 text-sm">Hình ảnh giám định hư hại tế bẩn</h3>
                      </div>
                      <button 
                        type="button"
                        onClick={handleAddCustomProofPhoto}
                        className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100/70 border border-blue-150 rounded text-blue-900 text-[11px] font-bold cursor-pointer"
                      >
                        
                        Tải ảnh thực tế
                      </button>
                    </div>

                    {/* Description */}
                    <div className="text-xs leading-relaxed text-slate-650 bg-slate-50/70 p-4 border border-slate-150 rounded-xl">
                      <strong className="text-[#00236f] text-[10px] uppercase font-black block mb-1">Tường trình thực nghiệm kỹ thuật:</strong>
                      {selectedDossier.techNotes}
                    </div>

                    {/* Photos grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {selectedDossier.proofPhotos.map((photo, index) => (
                        <div key={index} className="aspect-square bg-slate-50 border border-slate-200 rounded-lg overflow-hidden relative group">
                          <img 
                            src={photo} 
                            alt={`Giám định ${index}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute bottom-1 bg-slate-900/70 text-white font-mono font-bold text-[8px] px-1.5 py-0.2 rounded-md left-1">
                            #ẢNH {index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer claims feedback statement */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3.5">
                    <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                      <ThumbsDown className="w-4.5 h-4.5 text-rose-600" />
                      <h3 className="font-bold text-slate-800 text-sm">Kháng nghị kiến nghị từ phía khách hàng</h3>
                    </div>

                    <div className="text-xs leading-relaxed text-slate-600 bg-amber-50/20 p-4 border border-amber-100/30 rounded-xl border-l-4 border-l-amber-400">
                      <strong className="text-amber-800 text-[10px] uppercase font-black block mb-1">Ý kiến phản hồi của {selectedDossier.customerName}:</strong>
                      "{selectedDossier.customerStatement}"
                    </div>
                  </div>

                </div>

                {/* Right Column (Claim resolution action panel, signed contract file, timeline) */}
                <div className="space-y-6">
                  
                  {/* Resolution action block (Screen 2 Action section) */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                      <ShieldAlert className="w-4.5 h-4.5 text-rose-600" />
                      <h3 className="font-bold text-slate-800 text-sm">Khu vực giải quyết tranh chấp</h3>
                    </div>

                    {/* Radials selection */}
                    <div className="space-y-3 font-bold text-slate-750 text-xs">
                      <label className="text-[10px] uppercase text-slate-400 block font-bold">Xác minh lỗi hư hại</label>
                      
                      <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <input 
                          type="radio" 
                          name="resolution-decision" 
                          value="Phát sinh hợp lệ"
                          checked={resolutionDecision === 'Phát sinh hợp lệ'}
                          onChange={(e) => {
                            setResolutionDecision(e.target.value);
                            setResolutionNotes(`Xác thực lỗi do phía Khách hàng làm nứt kính ngoài trong thời hạn đặt thuê. Khấu trừ phí bảo hành sửa kính ngoài từ cọc thế chấp.`);
                          }}
                          className="w-4 h-4 text-[#00236f] accent-[#00236f] focus:ring-0"
                        />
                        <div>
                          <p className="font-black text-slate-800">Phát sinh hợp lệ</p>
                          <p className="text-[10px] text-slate-400 font-normal mt-0.5">Quy trách nhiệm bồi thường hư hại cho khách hàng.</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <input 
                          type="radio" 
                          name="resolution-decision" 
                          value="Phát sinh không hợp lệ"
                          checked={resolutionDecision === 'Phát sinh không hợp lệ'}
                          onChange={(e) => {
                            setResolutionDecision(e.target.value);
                            setResolutionNotes('Kính nứt từ trước thời điểm bàn giao sau khi kiểm tra camera. Cửa hàng hoàn 100% tiền cọc và tự chịu chi phí sửa chữa thấu kính.');
                          }}
                          className="w-4 h-4 text-[#00236f] accent-[#00236f] focus:ring-0"
                        />
                        <div>
                          <p className="font-black text-slate-850">Lỗi không hợp lệ (Cửa hàng chịu)</p>
                          <p className="text-[10px] text-slate-400 font-normal mt-0.5">Do lỗi cũ của cửa hàng hoặc trường hợp được miễn bồi hoàn.</p>
                        </div>
                      </label>
                    </div>

                    {/* Resolution Notes area */}
                    <div className="space-y-1.5 font-bold text-slate-700 text-xs">
                      <label>Nội dung xử lý khẩu đền bù bồi hoàn</label>
                      <textarea 
                        rows="4"
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                        className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-medium text-slate-650 resize-none leading-relaxed"
                      />
                    </div>

                    {/* Action buttons based on status & selection */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <button 
                        type="button"
                        onClick={handleNotifyCustomerClaim}
                        className="py-3 px-4 border border-[#00236f] hover:bg-slate-50 text-[#00236f] hover:text-blue-950 font-bold rounded-lg transition-colors active:scale-95 cursor-pointer whitespace-nowrap text-center"
                      >
                        Thông báo bồi hoàn
                      </button>

                      <button 
                        type="button"
                        onClick={handleApplyResolution}
                        className="py-3 px-4 bg-[#fea619] hover:bg-[#fea619]/90 text-amber-950 font-black rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap text-center"
                      >
                        Đồng ý đề xuất
                      </button>
                    </div>
                  </div>

                  {/* Signed Paper Contract download integration (Screen 2 option) */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                      <FileCheck2 className="w-4.5 h-4.5 text-[#00236f]" />
                      <h3 className="font-bold text-slate-800 text-sm">Hợp đồng giấy đã ký kết (PDF)</h3>
                    </div>

                    <div className="border border-dashed border-slate-200 rounded-xl p-4 flex items-center justify-between text-xs hover:border-[#00236f]/60 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-8 h-8 text-rose-500 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">Mẫu hợp đồng pháp lý ORD-552190</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">SIZE: 1.45 MB • PDF</p>
                        </div>
                      </div>

                      <button 
                        type="button"
                        onClick={() => alert('Bắt đầu tải tệp về hợp đồng pháp lý.')}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors cursor-pointer"
                        title="Tải tệp PDF xuống"
                      >T?i xu?ng
                        
                      </button>
                    </div>
                  </div>

                  {/* Operational timeline actions logs (Screen 2 footer component) */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                      <Clock className="w-4.5 h-4.5 text-[#00236f]" />
                      <h3 className="font-bold text-slate-800 text-sm">Lịch sử thao tác hồ sơ</h3>
                    </div>

                    <div className="relative border-l-2 border-slate-150 pl-4 ml-2.5 space-y-4 text-xs font-semibold text-slate-500">
                      
                      {/* step 1 */}
                      <div className="relative">
                        <span className="absolute -left-6.5 w-3 h-3 bg-[#fea619] rounded-full ring-4 ring-white"></span>
                        <p className="text-slate-800">Cập nhật kiểm kê thiết bị hư hại</p>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Hôm nay - 14:30 | Nhân viên kho Nguyễn Minh</span>
                      </div>

                      {/* step 2 */}
                      <div className="relative">
                        <span className="absolute -left-6.5 w-3 h-3 bg-[#00236f] rounded-full ring-4 ring-white"></span>
                        <p className="text-slate-800">Lập hồ sơ tranh chấp bồi hoàn PS-001</p>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Hôm nay - 14:35 | Hệ thống ERP Tự động</span>
                      </div>

                      {/* step 3 */}
                      <div className="relative">
                        <span className="absolute -left-6.5 w-3 h-3 bg-rose-600 rounded-full ring-4 ring-white"></span>
                        <p className="text-slate-800">Tiếp nhận khiếu nại của khách</p>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Hôm nay - 15:10 | Tổng đài CSKH Trâm Anh</span>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
              
            </div>
          )}
          
        </div>
      )}

      {/* ==================== TAB 2 Content (Maintenance checklist schedules) ==================== */}
      {activeTab === 'tab2' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in font-sans">
          
          {/* Maintenance list (tabular column) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-850">Hạng mục thiết bị đăng kí bảo trì định kì</h3>
            
            <div className="space-y-3">
              {maintenanceAssets.map((asset, index) => (
                <div 
                  key={asset.id} 
                  onClick={() => setSelectedMaintIndex(index)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer block ${
                    selectedMaintIndex === index 
                      ? 'border-[#00236f] bg-[#00236f]/5 shadow-sm' 
                      : 'border-slate-200 bg-white hover:border-slate-350 shadow-xs'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="text-xs space-y-1">
                      <span className="font-mono text-[9px] font-black text-[#00236f] bg-blue-50 border border-blue-150 px-2 py-0.5 rounded uppercase tracking-wider">
                        {asset.id}
                      </span>
                      <h4 className="font-serif font-black text-slate-900 text-sm mt-1">{asset.name}</h4>
                      <p className="text-slate-400 mt-1"><span className="font-semibold">Lý do bảo quản:</span> {asset.reason}</p>
                      <p className="text-[10px] text-indigo-700 font-extrabold flex items-center gap-1 mt-0.5" title="Sát cánh cùng chất lượng">
                        <Layers className="w-3.5 h-3.5" />
                        <span>S/N: {asset.serial}</span>
                      </p>
                    </div>

                    <div className="text-right text-xs">
                      {asset.status === 'maintenance' ? (
                        <span className="inline-block px-3 py-1 rounded-full text-[9px] font-black bg-rose-50 border border-rose-200 text-rose-700 uppercase tracking-widest">
                          Bảo trì
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-[9px] font-black bg-emerald-50 border border-emerald-250 text-emerald-800 uppercase tracking-widest">
                          Sẵn sàng
                        </span>
                      )}
                      <p className="font-black text-slate-800 mt-2">Phí: {asset.cost}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right hand details of selected item */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-850">Chi tiết trạng thái bảo trì</h3>
            
            {selectedMaintIndex !== null ? (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs font-semibold">
                
                {/* Visual detail */}
                <div className="space-y-1.5 border-b pb-3 text-slate-800">
                  <h4 className="font-serif font-black text-sm text-[#00236f]" id="maint-title-id">{maintenanceAssets[selectedMaintIndex].name}</h4>
                  <p className="font-mono text-slate-400">SERI: {maintenanceAssets[selectedMaintIndex].serial}</p>
                </div>

                <div className="space-y-2 text-slate-700">
                  <p><span className="text-slate-400 font-bold block">Nguyên nhân kỹ thuật bám bụi:</span> "{maintenanceAssets[selectedMaintIndex].reason}"</p>
                  <p><span className="text-slate-400 font-bold block">Phí ước tính trung tâm bảo hành:</span> {maintenanceAssets[selectedMaintIndex].cost}</p>
                  <p><span className="text-slate-400 font-bold block">Nhân viên chịu trách nhiệm bàn giao:</span> {maintenanceAssets[selectedMaintIndex].reporter}</p>
                  <p><span className="text-slate-400 font-bold block">Mức độ ưu tiên kiểm sửa:</span> <strong className="text-rose-600 font-black">{maintenanceAssets[selectedMaintIndex].priority}</strong></p>
                </div>

                <div className="bg-slate-50 border p-4.5 rounded-lg text-slate-500 font-medium leading-relaxed">
                  <strong className="text-slate-700 text-[10px] uppercase font-black block mb-1">Ghi chú lịch hạn:</strong>
                  {maintenanceAssets[selectedMaintIndex].note}
                </div>

                {maintenanceAssets[selectedMaintIndex].status === 'maintenance' && (
                  <button 
                    type="button"
                    onClick={() => setShowMaintModal(true)}
                    className="w-full text-center py-3 bg-[#00236f] hover:bg-blue-950 text-white font-black text-xs rounded-lg shadow transition active:scale-95 cursor-pointer mt-2"
                  >
                    Cập nhật kết quả sửa chữa
                  </button>
                )}

              </div>
            ) : (
              <div className="h-48 border border-dashed rounded-xl flex items-center justify-center text-xs text-slate-400 font-bold text-center p-6 bg-slate-50/50">
                Hãy click chuột chọn một tài sản hư tổn ở cột trái để xem lịch sử bảo đảm chất lượng.
              </div>
            )}
          </div>

        </div>
      )}

      {/* MODAL: Maintenance result update */}
      {showMaintModal && selectedMaintIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSaveMaint(); }}
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-xs font-sans"
          >
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 text-[#00236f] flex justify-between items-center font-bold">
              <h3 className="font-serif font-black text-sm uppercase">Cập nhật kết quả bảo trì thấu thấu kính</h3>
              <button type="button" onClick={() => setShowMaintModal(false)} className="text-slate-400 hover:text-slate-700">??ng
                
              </button>
            </div>

            <div className="p-6 space-y-4 font-bold text-slate-750">
              <div className="space-y-1">
                <label className="text-xs text-slate-700">Ghi nhận chi tiết kết nghiệm kỹ thuật</label>
                <textarea 
                  rows="4"
                  value={maintResultText}
                  onChange={(e) => setMaintResultText(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-medium text-slate-650 resize-none leading-relaxed"
                />
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-lg text-emerald-800 font-medium">
                Tài sản khi gửi xong sẽ lập tức chuyển đổi sang trạng thái <strong>"Sẵn sàng"</strong> để đáp ứng lưu thông đơn hàng mới.
              </div>
            </div>

            <div className="px-5 py-4 bg-slate-50 border-t border-slate-250 flex justify-end gap-2.5">
              <button 
                type="button" 
                onClick={() => setShowMaintModal(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-650 font-bold"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-[#00236f] text-white hover:bg-blue-950 rounded font-bold shadow-sm transition"
              >
                Lưu kết quả bảo hành
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
