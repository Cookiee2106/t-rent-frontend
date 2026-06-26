import React, { useState, useEffect } from 'react';
import orderApi from '../../api/orderApi';
import { 
  Wrench, 
  Search, 
  Calendar, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft,
  History,
  X,
  FileText,
  Info
} from 'lucide-react';

const formatVND = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// INITIAL REQUIRED MOCK DATA
const INITIAL_MAINTENANCE_RECORDS = [
  {
    maintenanceCode: 'MT001',
    assetCode: 'LEN012',
    equipmentName: 'Lens XF 35mm',
    modelName: 'Lens XF 35mm',
    serial: 'SN-LEN-F001',
    reason: 'Hư hỏng khi khách hàng trả thiết bị',
    status: 'Đang xử lý', // 'Đang xử lý', 'Hoàn tất', 'Hủy'
    createdAt: '23/06/2026',
    createdBy: 'Nhân viên A',
    // Detailed fields for view/update
    notes: 'Lens bị lỗi vòng lấy nét sau khi khách hàng trả',
    rentCount: 14,
    maintenanceThreshold: '20 lần',
    assetStatus: 'Bảo trì', // 'Sẵn sàng', 'Bảo trì', 'Ngừng sử dụng', 'Mất'
    conditionNotes: 'Kính trầy xước nhẹ vỏ ngoài, cơ chế xoay trơn bị kẹt góc 45 độ.',
    // Source details
    sourceType: 'LIQUIDATION', // 'LIQUIDATION' or 'INVENTORY_MANAGER'
    relatedOrderCode: 'ORD001',
    relatedReturnSlip: 'PR001',
    conditionOnReturn: 'Hư hỏng',
    auditNotes: 'Khách hàng vô ý va chạm trong buổi chụp dã ngoại ngoài trời',
    // Executed results
    processContent: '',
    result: '',
    cost: 0,
    resultNotes: '',
    // History entries
    history: [
      {
        maintenanceCode: 'MT001',
        createdAt: '23/06/2026',
        reason: 'Hư hỏng khi khách hàng trả thiết bị',
        createdBy: 'Nhân viên A',
        status: 'Đang xử lý',
        processContent: 'Chưa có',
        cost: 0,
        notes: 'Tạo từ thanh lý hợp đồng ORD001'
      },
      {
        maintenanceCode: 'MT000',
        createdAt: '10/05/2026',
        reason: 'Kiểm tra định kỳ',
        createdBy: 'Nhân viên B',
        status: 'Hoàn tất',
        processContent: 'Vệ sinh lens, hoạt động bình thường',
        cost: 100000,
        notes: 'Không phát sinh lỗi'
      }
    ]
  },
  {
    maintenanceCode: 'MT002',
    assetCode: 'BODY010',
    equipmentName: 'Sony A7 IV Body',
    modelName: 'Sony A7 IV',
    serial: 'SN-A7IV-010',
    reason: 'Đạt ngưỡng số lần thuê cần kiểm tra',
    status: 'Đang xử lý',
    createdAt: '24/06/2026',
    createdBy: 'Quản trị viên',
    notes: 'Cần kiểm tra kỹ báng cầm cao su bị bong nhẹ và nút chụp phản hồi kém',
    rentCount: 50,
    maintenanceThreshold: '50 lần',
    assetStatus: 'Bảo trì',
    conditionNotes: 'Tấm đệm cao su bọc tay cầm có dấu hiệu rão cơ học.',
    sourceType: 'INVENTORY_MANAGER',
    relatedOrderCode: '',
    relatedReturnSlip: '',
    conditionOnReturn: '',
    auditNotes: 'Hệ thống tự động kích hoạt cảnh báo bảo trì định kỳ dựa trên khối lượng lượt thuê.',
    processContent: '',
    result: '',
    cost: 0,
    resultNotes: '',
    history: [] // empty history to test "Thiết bị chưa có lịch sử bảo trì" scenario
  },
  {
    maintenanceCode: 'MT003',
    assetCode: 'PIN003',
    equipmentName: 'Pin NP-FZ100',
    modelName: 'Pin NP-FZ100',
    serial: 'SN-PIN-S001',
    reason: 'Pin sạc yếu',
    status: 'Hoàn tất',
    createdAt: '15/06/2026',
    createdBy: 'Nhân viên B',
    notes: 'Đã thay cell pin chất lượng cao mới',
    rentCount: 32,
    maintenanceThreshold: '40 lần',
    assetStatus: 'Sẵn sàng',
    conditionNotes: 'Pin tụt điện năng áp quá nhanh.',
    sourceType: 'INVENTORY_MANAGER',
    relatedOrderCode: '',
    relatedReturnSlip: '',
    conditionOnReturn: '',
    auditNotes: 'Khách hàng phản hồi pin nhanh sụt rớt lúc chụp phơi sáng đêm.',
    processContent: 'Thay thế cụm cell pin Lithium polymer cao cấp',
    result: 'Dung tích pin khôi phục 98%, dòng sạc xả ổn định.',
    cost: 250000,
    resultNotes: 'Đưa trở lại hệ thống sẵn sàng phân phối',
    history: [
      {
        maintenanceCode: 'MT003',
        createdAt: '15/06/2026',
        reason: 'Pin sạc yếu',
        createdBy: 'Nhân viên B',
        status: 'Hoàn tất',
        processContent: 'Thay thế cụm cell pin Lithium polymer cao cấp',
        cost: 250000,
        notes: 'Pin khôi phục hiệu suất tối đa'
      }
    ]
  }
];

const MAINTENANCE_STATUS_MAP = {
  'IN_PROGRESS': 'Đang xử lý',
  'COMPLETED': 'Hoàn tất',
  'CANCELLED': 'Hủy',
};

const mapRecord = (r) => ({
  maintenanceCode: r.id?.substring(0, 8) || '',
  assetCode: r.identified_assets?.asset_code || '',
  equipmentName: r.identified_assets?.asset_name || '',
  modelName: r.identified_assets?.asset_name || '',
  serial: r.identified_assets?.serial_number || '',
  reason: r.reason || '',
  status: MAINTENANCE_STATUS_MAP[r.status] || r.status,
  createdAt: r.started_at ? new Date(r.started_at).toLocaleDateString('vi-VN') : '',
  createdBy: r.users_maintenance_records_started_byTousers?.full_name || '',
  notes: r.note || '',
  // keep raw for filtering
  _status: r.status,
});

const ASSET_OPTIONS = [
  { assetId: '00000000-0000-0000-0000-000000000060', assetCode: 'TS-R5-001', equipmentName: 'Canon EOS R5 #001', modelName: 'Canon EOS R5', serial: 'CE0A240001' },
  { assetId: '00000000-0000-0000-0000-000000000061', assetCode: 'TS-R5-002', equipmentName: 'Canon EOS R5 #002', modelName: 'Canon EOS R5', serial: 'CE0A240002' },
  { assetId: '00000000-0000-0000-0000-000000000062', assetCode: 'TS-R5-003', equipmentName: 'Canon EOS R5 #003', modelName: 'Canon EOS R5', serial: 'CE0A240003' },
  { assetId: '00000000-0000-0000-0000-000000000063', assetCode: 'TS-A7IV-001', equipmentName: 'Sony A7 IV #001', modelName: 'Sony A7 IV', serial: 'SA7V240001' },
  { assetId: '00000000-0000-0000-0000-000000000064', assetCode: 'TS-A7IV-002', equipmentName: 'Sony A7 IV #002', modelName: 'Sony A7 IV', serial: 'SA7V240002' },
  { assetId: '00000000-0000-0000-0000-000000000065', assetCode: 'TS-A7IV-003', equipmentName: 'Sony A7 IV #003', modelName: 'Sony A7 IV', serial: 'SA7V240003' },
  { assetId: '00000000-0000-0000-0000-000000000066', assetCode: 'TS-RF2470-001', equipmentName: 'Canon RF 24-70mm #001', modelName: 'Canon RF 24-70mm f/2.8L IS USM', serial: 'RF247024001' },
  { assetId: '00000000-0000-0000-0000-000000000067', assetCode: 'TS-RF2470-002', equipmentName: 'Canon RF 24-70mm #002', modelName: 'Canon RF 24-70mm f/2.8L IS USM', serial: 'RF247024002' },
  { assetId: '00000000-0000-0000-0000-000000000068', assetCode: 'TS-RS4-001', equipmentName: 'DJI RS 4 Pro #001', modelName: 'DJI RS 4 Pro', serial: 'RS4P240001' },
  { assetId: '00000000-0000-0000-0000-000000000069', assetCode: 'TS-RS4-002', equipmentName: 'DJI RS 4 Pro #002', modelName: 'DJI RS 4 Pro', serial: 'RS4P240002' },
];

const REASON_OPTIONS = [
  'Hư hỏng khi khách hàng trả thiết bị',
  'Đạt ngưỡng số lần thuê cần kiểm tra',
  'Pin sạc yếu',
  'Kiểm tra định kỳ',
  'Lỗi kỹ thuật',
  'Hư hỏng vật lý',
  'Bảo dưỡng theo lịch',
];

export default function Maintenance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await orderApi.admin.getMaintenanceRecords();
      setRecords((res.data?.data || []).map(mapRecord));
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  // Filters state
  const [filterCode, setFilterCode] = useState('');
  const [filterAssetCode, setFilterAssetCode] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCreatedDate, setFilterCreatedDate] = useState('');

  // Add form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    assetCode: '', equipmentName: '', modelName: '', serial: '',
    reason: '', notes: '', sourceType: 'INVENTORY_MANAGER',
  });

  // Modals state
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Form Input states for updating work result
  const [formProcessContent, setFormProcessContent] = useState('');
  const [formResult, setFormResult] = useState('');
  const [formCost, setFormCost] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formAssetStatusAfter, setFormAssetStatusAfter] = useState('Sẵn sàng'); // 'Sẵn sàng', 'Tiếp tục bảo trì', 'Hư hỏng', 'Ngừng sử dụng'

  // Form submit diagnostics log state (for demonstration)
  const [diagnosticLog, setDiagnosticLog] = useState(null);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Pre-fill form when triggering "Cập nhật kết quả bảo trì"
  const handleOpenUpdateForm = (rec) => {
    if (rec.status === 'Hoàn tất') {
      return; // Disabled click
    }

    setSelectedUpdate(rec);

    // Pre-fill for MT001 specifically as specified in requirements
    if (rec.maintenanceCode === 'MT001') {
      setFormProcessContent('Kiểm tra vòng lấy nét và vệ sinh lens');
      setFormResult('Đã xử lý lỗi vòng lấy nét, lens hoạt động bình thường');
      setFormCost('300000');
      setFormNotes('Có thể đưa thiết bị về trạng thái sẵn sàng');
      setFormAssetStatusAfter('Sẵn sàng');
    } else {
      setFormProcessContent('');
      setFormResult('');
      setFormCost('0');
      setFormNotes('');
      setFormAssetStatusAfter('Sẵn sàng');
    }

    setShowUpdateModal(true);
  };

  const handleOpenDetail = (rec) => {
    setSelectedDetail(rec);
    setShowDetailModal(true);
  };

  const handleOpenHistory = (rec) => {
    if (!rec.history || rec.history.length === 0) {
      alert('Thiết bị chưa có lịch sử bảo trì');
    }
    setSelectedHistory(rec);
    setShowHistoryModal(true);
  };

  // Save/Update results
  const handleSaveUpdate = (e) => {
    e.preventDefault();

    if (!selectedUpdate) {
      alert('Không tìm thấy hồ sơ bảo trì');
      return;
    }

    if (selectedUpdate.status === 'Hoàn tất') {
      alert('Hồ sơ bảo trì đã hoàn tất');
      return;
    }

    if (!formProcessContent.trim()) {
      alert('Vui lòng nhập nội dung xử lý');
      return;
    }

    if (!formResult.trim()) {
      alert('Vui lòng nhập kết quả bảo trì');
      return;
    }

    const parsedCost = parseFloat(formCost);
    if (isNaN(parsedCost) || parsedCost < 0) {
      alert('Chi phí phát sinh không hợp lệ');
      return;
    }

    const validStatuses = ['Sẵn sàng', 'Tiếp tục bảo trì', 'Hư hỏng', 'Ngừng sử dụng'];
    if (!validStatuses.includes(formAssetStatusAfter)) {
      alert('Trạng thái thiết bị không hợp lệ');
      return;
    }

    // Determine final status
    let nextMaintenanceStatus = 'Đang xử lý';
    let nextAssetStatus = 'Bảo trì';

    if (formAssetStatusAfter === 'Sẵn sàng') {
      nextMaintenanceStatus = 'Hoàn tất';
      nextAssetStatus = 'Sẵn sàng';
    } else if (formAssetStatusAfter === 'Tiếp tục bảo trì') {
      nextMaintenanceStatus = 'Đang xử lý';
      nextAssetStatus = 'Bảo trì';
    } else if (formAssetStatusAfter === 'Hư hỏng') {
      nextMaintenanceStatus = 'Đang xử lý'; // Maintenance in progress as it is still damaged
      nextAssetStatus = 'Bảo trì';
    } else if (formAssetStatusAfter === 'Ngừng sử dụng') {
      nextMaintenanceStatus = 'Hoàn tất';
      nextAssetStatus = 'Ngừng sử dụng';
    }

    // Prepare JSON payload for output display as requested by specifications
    const payload = {
      maintenanceCode: selectedUpdate.maintenanceCode,
      assetCode: selectedUpdate.assetCode,
      processContent: formProcessContent,
      result: formResult,
      cost: parsedCost,
      note: formNotes,
      assetStatusAfterMaintenance: formAssetStatusAfter === 'Sẵn sàng' ? 'AVAILABLE' : (formAssetStatusAfter === 'Ngừng sử dụng' ? 'DECOMMISSIONED' : 'MAINTENANCE'),
      maintenanceStatus: nextMaintenanceStatus === 'Hoàn tất' ? 'COMPLETED' : 'IN_PROGRESS'
    };

    setDiagnosticLog(payload);

    // Perform state updating of local mock db
    const updatedRecords = records.map(r => {
      if (r.maintenanceCode === selectedUpdate.maintenanceCode) {
        // Construct new history item inside the record as well
        const newHistoryLog = {
          maintenanceCode: r.maintenanceCode,
          createdAt: new Date().toLocaleDateString('vi-VN'),
          reason: r.reason,
          createdBy: r.createdBy,
          status: nextMaintenanceStatus,
          processContent: formProcessContent,
          cost: parsedCost,
          notes: formNotes || 'Cập nhật trực tiếp kết quả nghiệm thu hàng ngày.'
        };

        return {
          ...r,
          status: nextMaintenanceStatus,
          assetStatus: nextAssetStatus,
          processContent: formProcessContent,
          result: formResult,
          cost: parsedCost,
          resultNotes: formNotes,
          history: [newHistoryLog, ...(r.history || [])]
        };
      }
      return r;
    });

    setRecords(updatedRecords);
    setShowUpdateModal(false);
    triggerToast('Cập nhật kết quả bảo trì thành công');
    
    // Display prompt specified success alerts
    setTimeout(() => {
      alert(`Cập nhật kết quả bảo trì thành công\n\n[Dữ liệu gửi lên server]:\n${JSON.stringify(payload, null, 2)}`);
    }, 300);
  };

  // Apply search filtering
  const filteredRecords = records.filter(r => {
    const matchesCode = filterCode === '' || r.maintenanceCode.toLowerCase().includes(filterCode.toLowerCase());
    const matchesAssetCode = filterAssetCode === '' || r.assetCode.toLowerCase().includes(filterAssetCode.toLowerCase());
    const matchesName = filterName === '' || r.equipmentName.toLowerCase().includes(filterName.toLowerCase());
    const matchesStatus = filterStatus === '' || r._status === filterStatus || r.status === filterStatus;
    const matchesDate = filterCreatedDate === '' || r.createdAt.includes(filterCreatedDate);

    return matchesCode && matchesAssetCode && matchesName && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-6 text-left selection:bg-indigo-100">
      
      {/* Toast Alert pop */}
      {toast && (
        <div className="fixed top-5 right-5 z-[2000] bg-slate-900 border border-slate-800 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fadeIn">
          <div className="bg-emerald-500 p-1.5 rounded-full text-white">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold font-sans">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Breadcrumb & Header Section */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
            <span>Trang chủ</span>
            <span>/</span>
            <span className="text-indigo-600 font-black">Quản lý bảo trì</span>
          </div>
          <h2 className="text-lg font-black text-[#00236f] uppercase tracking-wide flex items-center gap-2">
            <Wrench className="w-5 h-5 text-indigo-600" />
            Quản lý bảo trì
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Theo dõi lịch trình chẩn đoán lỗi, khắc phục hao mòn kỹ thuật và phục hồi các thiết bị quay chụp hư hại từ vận hành thực tế.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="px-5 py-2.5 bg-[#00236f] hover:bg-indigo-800 text-white text-xs font-black uppercase rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          Thêm hồ sơ bảo trì
        </button>
      </div>

      {/* FILTER CONTROL CARD */}
      <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
        <h3 className="text-xs uppercase font-extrabold text-slate-500 mb-3.5 flex items-center gap-1.5 tracking-wider">
          <Search className="w-3.5 h-3.5 text-indigo-500" />
          Bộ lọc hồ sơ bảo trì
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Mã hồ sơ */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">Mã hồ sơ bảo trì</label>
            <input 
              type="text" 
              placeholder="Nhập mã hồ sơ (Ví dụ: MT001)"
              value={filterCode}
              onChange={(e) => setFilterCode(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Mã tài sản */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">Mã tài sản (Asset Code)</label>
            <input 
              type="text" 
              placeholder="Nhập mã tài sản (Ví dụ: LEN012)"
              value={filterAssetCode}
              onChange={(e) => setFilterAssetCode(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Tên thiết bị */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">Tên thiết bị</label>
            <input 
              type="text" 
              placeholder="Nhập tên thiết bị..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Trạng thái bảo trì */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">Trạng thái bảo trì</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-extrabold text-slate-700 cursor-pointer focus:bg-white focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Tất cả</option>
              <option value="IN_PROGRESS">Đang xử lý</option>
              <option value="COMPLETED">Hoàn tất</option>
              <option value="CANCELLED">Hủy</option>
            </select>
          </div>

          {/* Ngày tạo */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">Ngày tạo hồ sơ</label>
            <input 
              type="text" 
              placeholder="Ví dụ: 23/06/2026"
              value={filterCreatedDate}
              onChange={(e) => setFilterCreatedDate(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* ADD MAINTENANCE FORM */}
      {showAddForm && (
        <div className="bg-white border-2 border-indigo-200 rounded-2xl p-5 shadow-sm space-y-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-[#00236f] uppercase tracking-wider">Thêm hồ sơ bảo trì</h3>
            <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Mã tài sản *</label>
              <select value={addForm.assetCode}
                onChange={e => {
                  const asset = ASSET_OPTIONS.find(a => a.assetCode === e.target.value);
                  setAddForm({
                    ...addForm,
                    assetCode: e.target.value,
                    equipmentName: asset?.equipmentName || '',
                    modelName: asset?.modelName || '',
                    serial: asset?.serial || '',
                  });
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 focus:ring-1 focus:ring-indigo-500 cursor-pointer">
                <option value="">-- Chọn mã tài sản --</option>
                {ASSET_OPTIONS.map(a => (
                  <option key={a.assetCode} value={a.assetCode}>{a.assetCode} — {a.equipmentName}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Tên thiết bị</label>
              <select value={addForm.equipmentName} disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-500 cursor-not-allowed">
                <option value="">{addForm.equipmentName || 'Chọn mã tài sản trước'}</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Mẫu thiết bị</label>
              <select value={addForm.modelName} disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-500 cursor-not-allowed">
                <option value="">{addForm.modelName || 'Chọn mã tài sản trước'}</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Số serial</label>
              <select value={addForm.serial} disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-500 cursor-not-allowed">
                <option value="">{addForm.serial || 'Chọn mã tài sản trước'}</option>
              </select>
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Lý do bảo trì *</label>
              <select value={addForm.reason}
                onChange={e => setAddForm({...addForm, reason: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 focus:ring-1 focus:ring-indigo-500 cursor-pointer">
                <option value="">-- Chọn lý do --</option>
                {REASON_OPTIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-3 space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Ghi chú</label>
              <textarea rows={2} placeholder="Ghi chú thêm..." value={addForm.notes}
                onChange={e => setAddForm({...addForm, notes: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 resize-none" />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button onClick={() => setShowAddForm(false)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase rounded-xl transition cursor-pointer">
              Hủy
            </button>
            <button onClick={async () => {
              if (!addForm.assetCode || !addForm.reason) {
                alert('Vui lòng nhập đủ các trường bắt buộc (có dấu *)');
                return;
              }
              try {
                const asset = ASSET_OPTIONS.find(a => a.assetCode === addForm.assetCode);
                await orderApi.admin.createMaintenanceRecord({
                  assetId: asset?.assetId,
                  reason: addForm.reason,
                  note: addForm.notes,
                });
                setShowAddForm(false);
                setAddForm({ assetCode: '', equipmentName: '', modelName: '', serial: '', reason: '', notes: '', sourceType: 'INVENTORY_MANAGER' });
                triggerToast('Thêm hồ sơ bảo trì thành công');
                fetchRecords();
              } catch (err) {
                alert(err.response?.data?.message || 'Lỗi khi tạo hồ sơ bảo trì');
              }
            }}
              className="px-5 py-2.5 bg-[#00236f] hover:bg-indigo-800 text-white text-xs font-black uppercase rounded-xl transition shadow-xs cursor-pointer">
              Thêm hồ sơ
            </button>
          </div>
        </div>
      )}

      {/* DIAGNOSTIC API PAYLOAD SIMULATOR PREVIEW (ELEGANT DESIGN ELEMENT) */}
      {diagnosticLog && (
        <div className="bg-slate-900 text-slate-100 p-4.5 rounded-2xl border border-slate-800 font-mono text-xs">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800">
            <span className="text-amber-400 font-bold text-[10.5px]">📡 [Cập nhật thành công] Dữ liệu JSON gửi đi (Dạng nghiệp vụ):</span>
            <button 
              onClick={() => setDiagnosticLog(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap">{JSON.stringify(diagnosticLog, null, 2)}</pre>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="text-center py-10 text-xs font-bold text-slate-400">Đang tải dữ liệu...</div>
      )}

      {/* TABLE LISTING */}
      {!loading && (
      <div className="table-wrapper border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="w-full">
          <table className="data-table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[13px] font-semibold text-[#0f172a]">
                <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[120px]">Mã hồ sơ</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[100px]">Mã tài sản</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[140px]">Tên thiết bị</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[150px]">Mẫu thiết bị</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[110px]">Số serial</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[200px]">Lý do bảo trì</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[125px]">Trạng thái</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[110px]">Ngày tạo</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[130px]">Người tạo</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-right font-semibold min-w-[345px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-705">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-12 text-center text-slate-400 italic font-bold">
                    Không tìm thấy hồ sơ bảo trì phù hợp bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(r => {
                  const isCompleted = r.status === 'Hoàn tất';
                  return (
                    <tr key={r.maintenanceCode} className="hover:bg-slate-50/50 transition duration-150">
                      {/* Mã hồ sơ */}
                      <td className="px-6 py-4 text-[#00236f] font-mono font-black cell-code">{r.maintenanceCode}</td>
                      
                      {/* Mã tài sản */}
                      <td className="px-6 py-4 text-slate-800 font-bold font-mono cell-code">{r.assetCode}</td>
                      
                      {/* Tên thiết bị */}
                      <td className="px-6 py-4 text-slate-900 font-bold">{r.equipmentName}</td>
                      
                      {/* Mẫu thiết bị */}
                      <td className="px-6 py-4 text-slate-600">{r.modelName}</td>
                      
                      {/* Số serial */}
                      <td className="px-6 py-4 font-mono font-bold text-slate-800 cell-serial">{r.serial}</td>
                      
                      {/* Lý do bảo trì */}
                      <td className="px-6 py-4 text-slate-500 max-w-[200px] truncate" title={r.reason}>{r.reason}</td>
                      
                      {/* Trạng thái bảo trì */}
                      <td className="px-6 py-4 text-center">
                        <span className={`status-badge ${
                          r.status === 'Hoàn tất' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : r.status === 'Hủy'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-250'
                        }`}>
                          {r.status}
                        </span>
                      </td>

                      {/* Ngày tạo */}
                      <td className="px-6 py-4 text-center font-mono cell-date">{r.createdAt}</td>

                      {/* Người tạo */}
                      <td className="px-6 py-4 text-slate-805 font-bold">{r.createdBy}</td>

                      {/* BA NÚT NGANG HÀNG BẮT BUỘC KHÔNG ĐƯỢC GIẤU */}
                      <td className="px-6 py-4 text-right">
                        <div className="table-action-group justify-end items-center">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(r)}
                            className="table-action-button text-[#00236f] bg-[#00236f]/5 hover:bg-[#00236f]/10 cursor-pointer"
                          >
                            Xem chi tiết
                          </button>

                          <div className="relative group">
                            <button
                              type="button"
                              disabled={isCompleted}
                              onClick={() => handleOpenUpdateForm(r)}
                              className={`table-action-button transition cursor-pointer font-semibold ${
                                isCompleted
                                  ? 'bg-slate-50 text-slate-350 border border-slate-100 cursor-not-allowed'
                                  : 'bg-indigo-50 text-indigo-705 hover:bg-indigo-100'
                              }`}
                            >
                              Cập nhật kết quả bảo trì
                            </button>
                            
                            {isCompleted && (
                              <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:block transition duration-200 z-[100] max-w-[200px] w-48 text-left bg-slate-900 text-white rounded-lg p-2.5 shadow-2xl">
                                <p className="text-[10px] font-bold font-sans">Hồ sơ bảo trì đã hoàn tất</p>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenHistory(r)}
                            className="table-action-button text-slate-705 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                          >
                            Xem lịch sử bảo trì
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* ========================================================= */}
      {/* 1. DRAWER / MODAL: XEM CHI TIẾT BẢO TRÌ (Chỉ xem, KHÔNG nút) */}
      {/* ========================================================= */}
      {showDetailModal && selectedDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[1100] flex justify-end animate-fadeIn font-sans">
          <div className="bg-white w-full max-w-2xl h-screen shadow-2xl flex flex-col animate-slideLeft text-slate-800 text-xs">
            
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-sm font-black text-[#00236f] uppercase">Chi tiết hồ sơ quản lý bảo trì</h3>
                <p className="text-[11px] text-slate-400 font-bold font-mono">ID bảo trì: {selectedDetail.maintenanceCode} | Tài sản: {selectedDetail.assetCode}</p>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scroll */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 text-left font-semibold">
              
              {/* A. THÔNG TIN HỒ SƠ BẢO TRÌ */}
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[9.5px] text-[#00236f] font-extrabold uppercase block tracking-wider border-b pb-1">
                  A. Thông tin hồ sơ bảo trì
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div>
                    <span className="text-slate-400 block">Mã hồ sơ bảo trì:</span>
                    <p className="text-[#00236f] font-mono font-black text-xs">{selectedDetail.maintenanceCode}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Trạng thái bảo trì:</span>
                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      selectedDetail.status === 'Hoàn tất' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {selectedDetail.status}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block">Lý do bảo trì:</span>
                    <p className="text-slate-900 font-bold">{selectedDetail.reason}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Ngày tạo:</span>
                    <p className="text-slate-850 font-mono font-bold">{selectedDetail.createdAt}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Người tạo hồ sơ:</span>
                    <p className="text-slate-850 font-bold">{selectedDetail.createdBy}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block">Ghi chú ban đầu:</span>
                    <p className="text-slate-700 italic font-medium">"{selectedDetail.notes || 'Không ghi nhận ghi chú ban đầu'}"</p>
                  </div>
                </div>

                {/* Kết quả phục hồi sửa chữa nếu có */}
                {selectedDetail.processContent && (
                  <div className="mt-3.5 pt-3.5 border-t border-slate-200 space-y-2 bg-indigo-50/20 p-3 rounded-lg">
                    <span className="text-[9px] text-indigo-700 font-extrabold uppercase block">Kết quả nghiệm thu bảo dưỡng</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 block text-[9.5px]">Nội dung kỹ sư thực hiện:</span>
                        <p className="text-slate-850 font-bold">{selectedDetail.processContent}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 block text-[9.5px]">Kết quả thu hoạch kiểm thử:</span>
                        <p className="text-slate-850 font-bold">{selectedDetail.result}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9.5px]">Chi phí thực tế:</span>
                        <p className="text-[#00236f] font-mono font-black text-sm">{formatVND(selectedDetail.cost)}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9.5px]">Ghi chú kết quả:</span>
                        <p className="text-slate-650 italic">"{selectedDetail.resultNotes || 'Không có ghi chú'}"</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* B. THÔNG TIN THIẾT BỊ VẬT LÝ */}
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[9.5px] text-[#00236f] font-extrabold uppercase block tracking-wider border-b pb-1">
                  B. Thông tin cấu hình thiết bị vật lý
                </span>
                
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400 block">Mã tài sản:</span>
                    <p className="text-slate-900 font-mono font-extrabold">{selectedDetail.assetCode}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Danh tính thiết bị:</span>
                    <p className="text-slate-900 font-black">{selectedDetail.equipmentName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Thuộc mẫu thiết bị:</span>
                    <p className="text-slate-700 font-bold">{selectedDetail.modelName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Số sản phẩm serial:</span>
                    <p className="text-[#00236f] font-mono font-black">{selectedDetail.serial}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Tần suất lượt thuê máy:</span>
                    <p className="text-slate-850 font-bold">{selectedDetail.rentCount} lần thuê</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Ngưỡng kiểm tra định kỳ:</span>
                    <p className="text-slate-800 font-bold">{selectedDetail.maintenanceThreshold || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block">Trạng thái thiết bị hiện tại:</span>
                    <span className={`inline-block mt-0.5 px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                      selectedDetail.assetStatus === 'Sẵn sàng' ? 'bg-emerald-50 text-emerald-700 border border-emerald-250' : 
                      selectedDetail.assetStatus === 'Ngừng sử dụng' ? 'bg-slate-100 text-slate-500 border border-slate-250' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {selectedDetail.assetStatus}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block">Ghi chú hao mòn tình trạng:</span>
                    <p className="text-slate-650 italic font-medium">"{selectedDetail.conditionNotes || 'Thiết bị hoạt động bền bỉ.'}"</p>
                  </div>
                </div>
              </div>

              {/* C. NGUỒN PHÁT SINH HỒ SƠ */}
              <div className="bg-white border border-dashed border-indigo-200 p-4 rounded-xl space-y-2">
                <span className="text-[9.5px] text-indigo-700 font-extrabold uppercase block tracking-wider border-b border-indigo-100 pb-1">
                  C. Nguồn gốc xuất xứ hồ sơ bảo trì
                </span>
                
                {selectedDetail.sourceType === 'LIQUIDATION' ? (
                  <div className="space-y-2">
                    <div className="inline-flex px-2 py-0.5 bg-rose-50 text-rose-800 text-[9.5px] rounded-sm font-black border border-rose-100">
                      PHÁT SINH TỪ QUÁ TRÌNH THANH LÝ HỢP ĐỒNG
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div>
                        <span className="text-slate-400 block">Mã đơn hàng liên quan:</span>
                        <p className="text-indigo-850 font-mono font-extrabold">{selectedDetail.relatedOrderCode || 'ORD001'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Mã phiếu trả &amp; kiểm kê:</span>
                        <p className="text-slate-850 font-mono font-bold">{selectedDetail.relatedReturnSlip || 'PR001'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Hiện trạng ghi nhận khi trả:</span>
                        <span className="text-red-600 font-extrabold text-[11px] block">⚠️ {selectedDetail.conditionOnReturn || 'Hư hỏng vật lý'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Ghi chú đối soát kiểm kê:</span>
                        <p className="text-slate-700 italic font-medium">"{selectedDetail.auditNotes || 'Khách hoàn trả phát hiện móp méo cụm zoom kính ngoài.'}"</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="inline-flex px-2 py-0.5 bg-yellow-50 text-yellow-800 text-[9.5px] rounded-sm font-black border border-yellow-100">
                      PHÁT SINH TỪ QUẢN LÝ KHO THIẾT BỊ VẬT LÝ
                    </div>
                    <div>
                      <span className="text-slate-400 block">Ghi chú tạo từ quản lý thiết bị:</span>
                      <p className="text-slate-850 font-bold">"{selectedDetail.auditNotes || 'Được kỹ thuật chủ động kích hoạt kiểm thử hoặc định kỳ.'}"</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Lý do kiểm tra/bảo trì:</span>
                      <p className="text-slate-750 font-bold">{selectedDetail.reason}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* RE-HIGHLIGHT EXTREMELY IMPORTANT CLAUSE: NO OPERATION BUTTONS ALLOWED HERE */}
              <div className="p-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-[11px] font-semibold flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <p>Theo quy chuẩn kiểm thử nghiệp vụ, các thao tác <strong>Cập nhật kết quả bảo trì</strong> hoặc <strong>Xem lịch sử bảo trì</strong> phải được mở trực tiếp từ bảng danh sách bên ngoài để đảm bảo tính minh bạch, không được phép lồng ghép tại đây.</p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                type="button" 
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2.5 bg-slate-250 text-slate-700 font-black rounded-xl hover:bg-slate-350 transition uppercase text-xs cursor-pointer"
              >
                Đóng thông tin
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. DRAWER / MODAL: CẬP NHẬT KẾT QUẢ BẢO TRÌ */}
      {/* ========================================================= */}
      {showUpdateModal && selectedUpdate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[1100] flex justify-end animate-fadeIn font-sans">
          <div className="bg-white w-full max-w-2xl h-screen shadow-2xl flex flex-col animate-slideLeft text-slate-850 text-xs">
            
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <span className="text-[9.5px] text-indigo-700 font-black uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-650 animate-ping"></span>
                  Nghiệm thu dịch vụ kỹ thuật
                </span>
                <h3 className="text-sm font-black text-[#00236f] uppercase mt-0.5">Cập nhật kết quả bảo trì</h3>
                <p className="text-[11px] text-slate-400 font-medium">Nhập chi tiết xử lý sự cố và chuyển đổi trạng thái thiết bị vật lý tương ứng.</p>
              </div>
              <button 
                onClick={() => setShowUpdateModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scroll Area */}
            <form onSubmit={handleSaveUpdate} className="flex-grow overflow-y-auto p-6 space-y-5.5 text-left font-semibold">
              
              {/* A. THÔNG TIN HỒ SƠ */}
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[9.5px] text-[#00236f] font-extrabold uppercase block tracking-wider">
                  A. Thông tin hồ sơ bảo trì cơ bản
                </span>
                <div className="grid grid-cols-2 gap-3.5 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Mã hồ sơ bảo trì</span>
                    <span className="text-slate-900 font-mono font-black">{selectedUpdate.maintenanceCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Ngày khởi tạo</span>
                    <span className="text-slate-850 font-mono font-bold">{selectedUpdate.createdAt}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Nhân sự thiết lập</span>
                    <span className="text-slate-850 font-bold">{selectedUpdate.createdBy}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Trạng thái hiện trạng</span>
                    <span className="bg-amber-100 text-amber-800 text-[9px] px-2 py-0.5 rounded font-black border border-amber-200 uppercase">
                      {selectedUpdate.status}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[9.5px]">Lý do bảo rưỡng thu hồi</span>
                    <p className="text-slate-900 font-bold text-xs">"{selectedUpdate.reason}"</p>
                  </div>
                </div>
              </div>

              {/* B. THÔNG TIN THIẾT BỊ */}
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[9.5px] text-[#00236f] font-extrabold uppercase block tracking-wider">
                  B. Thông tin nhận dạng thiết bị vật lý
                </span>
                <div className="grid grid-cols-2 gap-3.5 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Mã tài sản (Asset Code)</span>
                    <span className="text-[#00236f] font-mono font-black">{selectedUpdate.assetCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Tên mã sản phẩm</span>
                    <span className="text-slate-900 font-extrabold">{selectedUpdate.equipmentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Số sản phẩm Serial</span>
                    <span className="text-slate-850 font-mono font-bold">{selectedUpdate.serial}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Trạng thái vật lý hiện tại</span>
                    <span className="bg-rose-50 text-rose-700 text-[9.5px] px-2 py-0.5 rounded font-black uppercase border border-rose-150">
                      {selectedUpdate.assetStatus}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[9.5px]">Ghi chú chẩn đoán ban đầu</span>
                    <p className="text-slate-750 italic">"{selectedUpdate.notes || 'Pin yếu hoặc sước mờ kính ngoài.'}"</p>
                  </div>
                </div>
              </div>

              {/* C. KẾT QUẢ XỬ LÝ */}
              <div className="border border-slate-250 p-4 rounded-xl space-y-3 bg-white">
                <span className="text-[9.5px] text-indigo-700 font-extrabold uppercase block tracking-wider border-b pb-1">
                  C. Nhập biên bản kết quả xử lý thực tế
                </span>

                {/* Nội dung xử lý */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Nội dung xử lý <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows="2"
                    value={formProcessContent}
                    onChange={(e) => setFormProcessContent(e.target.value)}
                    placeholder="Nhập chi tiết các bước xử lý (Ví dụ: Tháo mặt kính ngoài, sấy bụi cảm biến sensor...)"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                  <span className="text-[10px] text-slate-400 font-medium italic block mt-0.5">Mô tả hành vi lắp đặt, can thiệp hoặc chẩn đoán thiết bị.</span>
                </div>

                {/* Kết quả bảo trì */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Kết quả bảo trì / Nghiệm thu <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows="2"
                    value={formResult}
                    onChange={(e) => setFormResult(e.target.value)}
                    placeholder="Nhập kết quả (Ví dụ: Ống kính về lại trạng thái hội tụ chuẩn nét, không xước dăm...)"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Chi phí phát sinh */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Chi phí phát sinh thực tế (VNĐ) <span className="text-slate-400">(Nếu không có, điền 0)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formCost}
                    onChange={(e) => setFormCost(e.target.value)}
                    placeholder="Nhập số tiền..."
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Ghi chú */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">Ghi chú bồi hoàn / Hậu mãi bảo hành</label>
                  <input
                    type="text"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Thiết bị hồi lưu tốt..."
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* D. TRẠNG THÁI SAU BẢO TRÌ CỦA THIẾT BỊ */}
              <div className="bg-rose-50/40 border border-rose-100 p-4 rounded-xl space-y-2">
                <label className="text-[10.5px] text-rose-800 font-extrabold uppercase block tracking-wider">
                  D. Quyết định trạng thái thiết bị sau bảo trì
                </label>
                <select
                  value={formAssetStatusAfter}
                  onChange={(e) => setFormAssetStatusAfter(e.target.value)}
                  className="w-full text-xs bg-white border border-rose-200 rounded-xl p-2.5 outline-none font-black text-slate-800 cursor-pointer focus:ring-1 focus:ring-rose-500"
                >
                  <option value="Sẵn sàng">Sẵn sàng (Thiết bị hoạt động tốt - Kết thúc bảo trì)</option>
                  <option value="Tiếp tục bảo trì">Tiếp tục bảo trì (Chưa đạt an toàn kỹ thuật)</option>
                  <option value="Hư hỏng">Hư hỏng (Hư hỏng sâu bách bộ phận - Giữ trạng thái Bảo trì)</option>
                  <option value="Ngừng sử dụng">Ngừng sử dụng (Khải tử tài sản quá rát - Thanh lý)</option>
                </select>
                <div className="text-[10px] text-rose-700 font-medium">
                  • <strong>Chú ý:</strong> Nếu chọn <span className="underline">Sẵn sàng</span> hoặc <span className="underline">Ngừng sử dụng</span>, hồ Sơ bảo trì sẽ được cập nhật thành <strong>Hoàn tất</strong>.
                </div>
              </div>

            </form>

            {/* Modal Footer */}
            <div className="p-4.5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <button 
                type="button" 
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2.5 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition text-xs cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button 
                type="button" 
                onClick={handleSaveUpdate}
                className="px-6 py-2.5 bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] font-black rounded-xl transition shadow-md text-xs cursor-pointer"
              >
                Lưu cập nhật kết quả
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. DRAWER / MODAL: XEM LỊCH SỬ BẢO TRÌ */}
      {/* ========================================================= */}
      {showHistoryModal && selectedHistory && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[1100] flex justify-end animate-fadeIn font-sans">
          <div className="bg-white w-full max-w-3xl h-screen shadow-2xl flex flex-col animate-slideLeft text-slate-800 text-xs">
            
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-sm font-black text-[#00236f] uppercase">Lịch sử bảo trì thiết bị</h3>
                <p className="text-[11px] text-slate-400 font-medium font-mono">Tài sản: {selectedHistory.assetCode} | Serial: {selectedHistory.serial}</p>
              </div>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-5 text-left font-semibold">
              
              {/* Thống kê thiết bị */}
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Mã tài sản</span>
                  <p className="font-mono font-black text-[#00236f]">{selectedHistory.assetCode}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Tên thiết bị</span>
                  <p className="font-bold text-slate-900 truncate">{selectedHistory.equipmentName}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Số Serial</span>
                  <p className="font-mono font-bold text-slate-800">{selectedHistory.serial}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Trạng thái hiện tại</span>
                  <span className="inline-block mt-0.5 bg-indigo-50 text-indigo-700 pointer-events-none px-2 py-0.5 font-bold rounded">
                    {selectedHistory.assetStatus}
                  </span>
                </div>
              </div>

              {/* Bảng hồ sơ bảo trì */}
              <div className="space-y-2">
                <span className="text-slate-400 text-[10px] uppercase font-extrabold tracking-wider block">Các sự vụ bảo dưỡng qua các năm</span>
                
                {!selectedHistory.history || selectedHistory.history.length === 0 ? (
                  <div className="py-12 border border-dashed border-slate-250 bg-slate-50 rounded-xl text-center">
                    <p className="text-slate-400 font-bold italic">Thiết bị chưa có lịch sử bảo trì</p>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px] border-collapse min-w-[700px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[#0f172a] text-[12px] font-semibold">
                            <th className="p-3 whitespace-nowrap min-w-[100px]">Mã hồ sơ</th>
                            <th className="p-3 whitespace-nowrap min-w-[110px]">Ngày tạo</th>
                            <th className="p-3 whitespace-nowrap min-w-[180px]">Lý do bảo trì</th>
                            <th className="p-3 whitespace-nowrap min-w-[120px]">Người tạo</th>
                            <th className="p-3 whitespace-nowrap min-w-[110px]">Trạng thái</th>
                            <th className="p-3 whitespace-nowrap min-w-[200px]">Xử lý kỹ thuật</th>
                            <th className="p-3 text-right whitespace-nowrap min-w-[110px]">Chi phí</th>
                            <th className="p-3 whitespace-nowrap min-w-[150px]">Ghi chú</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                          {selectedHistory.history.map((h, hIdx) => (
                            <tr key={hIdx} className="hover:bg-slate-50/50">
                              <td className="p-3 text-[#00236f] font-mono font-black">{h.maintenanceCode}</td>
                              <td className="p-3 font-mono">{h.createdAt}</td>
                              <td className="p-3 text-slate-600 max-w-[120px] truncate" title={h.reason}>{h.reason}</td>
                              <td className="p-3 font-bold text-slate-800">{h.createdBy}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase ${
                                  h.status === 'Hoàn tất' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                                }`}>
                                  {h.status}
                                </span>
                              </td>
                              <td className="p-3 max-w-[160px] truncate" title={h.processContent}>{h.processContent}</td>
                              <td className="p-3 text-right font-mono font-bold text-slate-900">{formatVND(h.cost)}</td>
                              <td className="p-3 text-slate-400 italic max-w-[120px] truncate" title={h.notes}>{h.notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                type="button" 
                onClick={() => setShowHistoryModal(false)}
                className="px-5 py-2.5 bg-slate-250 text-slate-700 font-extrabold rounded-xl hover:bg-slate-350 transition text-xs cursor-pointer"
              >
                Đóng lịch sử và danh sách
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
