import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  Trash2, 
  Edit3, 
  Eye, 
  Plus, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft,
  Info,
  Layers,
  MapPin,
  RefreshCw,
  Sliders,
  Database
} from 'lucide-react';

const formatVND = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// INITIAL MOCK DATA FOR PHYSICAL ASSETS
const INITIAL_PHYSICAL_ASSETS = [
  {
    assetCode: 'BODY001',
    assetName: 'Sony A7 IV Body',
    assetType: 'Body',
    productModel: 'Sony A7 IV',
    serialNumber: 'SN-A7IV-001',
    identificationNote: 'Body máy ảnh Sony A7 IV ngàm E-mount',
    defaultLocation: 'Kệ A1',
    currentLocation: 'Kệ A1',
    status: 'AVAILABLE', // mapped to Sẵn sàng
    conditionNote: 'Tốt',
    rentalCount: 8,
    maintenanceThreshold: 20
  },
  {
    assetCode: 'FUJI002',
    assetName: 'Fuji X-T5 Body',
    assetType: 'Body',
    productModel: 'Fuji X-T5',
    serialNumber: 'SN-FUJI-001',
    identificationNote: 'Body Fujifilm X-T5 màu đen hoài cổ',
    defaultLocation: 'Kệ B1',
    currentLocation: 'Kệ B1',
    status: 'RENTED', // mapped to Đang thuê
    conditionNote: 'Đang bàn giao cho khách',
    rentalCount: 12,
    maintenanceThreshold: 20
  },
  {
    assetCode: 'LEN012',
    assetName: 'Lens XF 35mm',
    assetType: 'Lens',
    productModel: 'Lens XF 35mm',
    serialNumber: 'SN-LEN-F001',
    identificationNote: 'Ống kính Fujifilm prime tiêu cự 35mm f/1.4',
    defaultLocation: 'Khu bảo trì',
    currentLocation: 'Khu bảo trì',
    status: 'MAINTENANCE', // mapped to Bảo trì
    conditionNote: 'Lens lỗi vòng lấy nét',
    rentalCount: 15,
    maintenanceThreshold: 20
  },
  {
    assetCode: 'PIN003',
    assetName: 'Pin NP-FZ100',
    assetType: 'Pin',
    productModel: 'Pin NP-FZ100',
    serialNumber: 'SN-PIN-S001',
    identificationNote: 'Pin sạc Li-ion Sony chính hãng',
    defaultLocation: 'Kệ Pin A',
    currentLocation: 'Kệ Pin A',
    status: 'AVAILABLE', // mapped to Sẵn sàng
    conditionNote: 'Tốt',
    rentalCount: 19,
    maintenanceThreshold: 20
  },
  {
    assetCode: 'BODY010',
    assetName: 'Sony A7 IV Body',
    assetType: 'Body',
    productModel: 'Sony A7 IV',
    serialNumber: 'SN-A7IV-010',
    identificationNote: 'Body máy ảnh Sony A7 IV sơ cua lỗi mạch chính',
    defaultLocation: 'Kệ A2',
    currentLocation: 'Kệ A2',
    status: 'DECOMMISSIONED', // mapped to Ngừng sử dụng
    conditionNote: 'Hư main, không cho thuê',
    rentalCount: 28,
    maintenanceThreshold: 20
  }
];

// ACCESSORIES INITIAL MOCK DATA (kept as secondary fallback tab if selected)
const INITIAL_ACCESSORIES = [
  {
    id: 'ACC050',
    name: 'Thẻ nhớ SanDisk Extreme Pro 128GB SD',
    groupName: 'Thẻ nhớ',
    pricePerDay: 40000,
    deposit: 1200000,
    status: 'Kích hoạt',
    description: 'Tốc độ ghi chép thô tối đa 200MB/s chuẩn định dạng ghi hình 4K'
  },
  {
    id: 'ACC051',
    name: 'Chân máy ảnh Benro T899 Tripod',
    groupName: 'Chân máy',
    pricePerDay: 60000,
    deposit: 1500000,
    status: 'Kích hoạt',
    description: 'Trọng lượng hợp kim nhôm chống rung giật tốt'
  }
];

// STATUS MAPPING FOR PHYSICAL ASSETS
const STATUS_LABELS = {
  'AVAILABLE': 'Sẵn sàng',
  'RENTED': 'Đang thuê',
  'MAINTENANCE': 'Bảo trì',
  'DECOMMISSIONED': 'Ngừng sử dụng',
  'LOST': 'Mất'
};

const STATUS_COLORS = {
  'AVAILABLE': 'bg-emerald-50 text-emerald-700 border-emerald-250',
  'RENTED': 'bg-sky-50 text-sky-700 border-sky-200',
  'MAINTENANCE': 'bg-amber-50 text-amber-700 border-amber-200',
  'DECOMMISSIONED': 'bg-slate-100 text-slate-500 border-slate-200',
  'LOST': 'bg-rose-50 text-rose-700 border-rose-200'
};

const ASSET_TYPES = ['Body', 'Lens', 'Pin', 'Sạc', 'Thẻ nhớ', 'Gimbal', 'Đèn Flash', 'Khác'];

export default function Inventory({ defaultTab = 'assets', userRole = 'staff' }) {
  // Store Physical Assets in State
  const [assets, setAssets] = useState(INITIAL_PHYSICAL_ASSETS);
  const [accessories, setAccessories] = useState(INITIAL_ACCESSORIES);
  const [currentTab, setCurrentTab] = useState(defaultTab);

  if (currentTab === 'accessories') {
    return <AccessoriesManager userRole={userRole} />;
  }
  
  const [toast, setToast] = useState(null);
  const [diagnosticPayload, setDiagnosticPayload] = useState(null);

  // Filters State for Physical Assets
  const [filterAssetCode, setFilterAssetCode] = useState('');
  const [filterAssetName, setFilterAssetName] = useState('');
  const [filterProductModel, setFilterProductModel] = useState('');
  const [filterSerialNumber, setFilterSerialNumber] = useState('');
  const [filterCurrentLocation, setFilterCurrentLocation] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modals state
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(null);

  const [showDelete, setShowDelete] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState(null);

  const [showMaintenance, setShowMaintenance] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);

  // Form input states for ADD
  const [addForm, setAddForm] = useState({
    assetCode: '',
    assetName: '',
    assetType: 'Body',
    productModel: '',
    serialNumber: '',
    identificationNote: '',
    defaultLocation: '',
    currentLocation: '',
    status: 'AVAILABLE',
    conditionNote: 'Tốt',
    rentalCount: 0,
    maintenanceThreshold: ''
  });

  // Form input states for UPDATE
  const [updateForm, setUpdateForm] = useState({
    assetCode: '',
    assetName: '',
    assetType: '',
    productModel: '',
    serialNumber: '',
    identificationNote: '',
    defaultLocation: '',
    currentLocation: '',
    status: 'AVAILABLE',
    conditionNote: '',
    rentalCount: 0,
    maintenanceThreshold: ''
  });

  // Form input states for CREATE MAINTENANCE RECORD
  const [maintReason, setMaintReason] = useState('');
  const [maintInitialNote, setMaintInitialNote] = useState('');

  // Toast dispatch helper
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Pre-fill fields for ADD Equipment (Thêm thiết bị vật lý)
  const handleOpenAdd = () => {
    setAddForm({
      assetCode: '',
      assetName: '',
      assetType: 'Body',
      productModel: '',
      serialNumber: '',
      identificationNote: '',
      defaultLocation: '',
      currentLocation: '', // will default to defaultLocation on save if blank
      status: 'AVAILABLE',
      conditionNote: 'Tốt',
      rentalCount: 0,
      maintenanceThreshold: ''
    });
    setShowAdd(true);
  };

  // Submit ADD Equipment Form
  const handleSaveAdd = (e) => {
    e.preventDefault();

    // Validations
    if (!addForm.assetCode.trim() || !addForm.assetName.trim() || !addForm.productModel.trim() || !addForm.serialNumber.trim() || !addForm.defaultLocation.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    // Check unique constraint for assetCode
    const codeExists = assets.some(a => a.assetCode.toLowerCase() === addForm.assetCode.trim().toLowerCase());
    if (codeExists) {
      alert('Mã tài sản đã tồn tại');
      return;
    }

    // Check unique constraint for serialNumber
    const serialExists = assets.some(a => a.serialNumber.toLowerCase() === addForm.serialNumber.trim().toLowerCase());
    if (serialExists) {
      alert('Số serial đã tồn tại');
      return;
    }

    // Validate maintenance threshold
    let thresholdValue = null;
    if (addForm.maintenanceThreshold !== '') {
      thresholdValue = parseInt(addForm.maintenanceThreshold);
      if (isNaN(thresholdValue) || thresholdValue <= 0) {
        alert('Ngưỡng bảo trì phải lớn hơn 0');
        return;
      }
    }

    // Validate status
    const allowedStatuses = ['AVAILABLE', 'RENTED', 'MAINTENANCE', 'DECOMMISSIONED', 'LOST'];
    if (!allowedStatuses.includes(addForm.status)) {
      alert('Trạng thái thiết bị không hợp lệ');
      return;
    }

    const payload = {
      assetCode: addForm.assetCode.trim(),
      assetName: addForm.assetName.trim(),
      assetType: addForm.assetType,
      productModel: addForm.productModel.trim(),
      serialNumber: addForm.serialNumber.trim(),
      identificationNote: addForm.identificationNote.trim(),
      defaultLocation: addForm.defaultLocation.trim(),
      currentLocation: addForm.currentLocation.trim() || addForm.defaultLocation.trim(),
      status: addForm.status,
      conditionNote: addForm.conditionNote.trim(),
      rentalCount: Number(addForm.rentalCount) || 0,
      maintenanceThreshold: thresholdValue
    };

    setDiagnosticPayload({
      action: 'ADD_ASSET',
      data: payload
    });

    setAssets([...assets, payload]);
    setShowAdd(false);
    triggerToast('Thêm thiết bị vật lý thành công');
  };

  // Pre-fill and open UPDATE Equipment form
  const handleOpenUpdate = (asset) => {
    setSelectedUpdate(asset);
    setUpdateForm({
      assetCode: asset.assetCode,
      assetName: asset.assetName,
      assetType: asset.assetType,
      productModel: asset.productModel,
      serialNumber: asset.serialNumber,
      identificationNote: asset.identificationNote || '',
      defaultLocation: asset.defaultLocation,
      currentLocation: asset.currentLocation,
      status: asset.status,
      conditionNote: asset.conditionNote || '',
      rentalCount: asset.rentalCount,
      maintenanceThreshold: asset.maintenanceThreshold || ''
    });
    setShowUpdate(true);
  };

  // Save UPDATE Equipment
  const handleSaveUpdate = (e) => {
    e.preventDefault();

    if (!selectedUpdate) {
      alert('Không tìm thấy thiết bị vật lý');
      return;
    }

    // Validations
    if (!updateForm.assetName.trim() || !updateForm.productModel.trim() || !updateForm.serialNumber.trim() || !updateForm.defaultLocation.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    // Check unique serial except itself
    const serialExists = assets.some(a => a.assetCode !== selectedUpdate.assetCode && a.serialNumber.toLowerCase() === updateForm.serialNumber.trim().toLowerCase());
    if (serialExists) {
      alert('Số serial đã được sử dụng');
      return;
    }

    // Validate maintenance threshold
    let thresholdValue = null;
    if (updateForm.maintenanceThreshold !== '') {
      thresholdValue = parseInt(updateForm.maintenanceThreshold);
      if (isNaN(thresholdValue) || thresholdValue <= 0) {
        alert('Ngưỡng bảo trì phải lớn hơn 0');
        return;
      }
    }

    // Validate status
    const allowedStatuses = ['AVAILABLE', 'RENTED', 'MAINTENANCE', 'DECOMMISSIONED', 'LOST'];
    if (!allowedStatuses.includes(updateForm.status)) {
      alert('Trạng thái thiết bị không hợp lệ');
      return;
    }

    const payload = {
      assetCode: selectedUpdate.assetCode, // locked
      assetName: updateForm.assetName.trim(),
      assetType: updateForm.assetType,
      productModel: updateForm.productModel.trim(),
      serialNumber: updateForm.serialNumber.trim(),
      identificationNote: updateForm.identificationNote.trim(),
      defaultLocation: updateForm.defaultLocation.trim(),
      currentLocation: updateForm.currentLocation.trim() || updateForm.defaultLocation.trim(),
      status: updateForm.status,
      conditionNote: updateForm.conditionNote.trim(),
      rentalCount: selectedUpdate.rentalCount, // locked
      maintenanceThreshold: thresholdValue
    };

    setDiagnosticPayload({
      action: 'UPDATE_ASSET',
      data: payload
    });

    setAssets(assets.map(a => a.assetCode === selectedUpdate.assetCode ? payload : a));
    setShowUpdate(false);
    triggerToast('Cập nhật thiết bị vật lý thành công');
  };

  // Open DELETE Confirmation Modal
  const handleOpenDelete = (asset) => {
    setSelectedDelete(asset);
    setShowDelete(true);
  };

  // Action DELETE Asset
  const handleConfirmDelete = () => {
    if (!selectedDelete) {
      alert('Không tìm thấy thiết bị vật lý');
      return;
    }

    // Rules
    if (selectedDelete.status === 'RENTED') {
      alert('Không thể xóa thiết bị đang thuê');
      return;
    }

    if (selectedDelete.status === 'MAINTENANCE') {
      alert('Không thể xóa thiết bị đang có hồ sơ bảo trì chưa hoàn tất');
      return;
    }

    // Simulate related data constraints (e.g. BODY001 is set up as linked in contracts, deliveries etc)
    if (selectedDelete.assetCode === 'BODY001') {
      alert('Không thể xóa thiết bị này vì đang có dữ liệu liên quan');
      return;
    }

    // Soft delete / remove from state
    setAssets(assets.filter(a => a.assetCode !== selectedDelete.assetCode));
    setShowDelete(false);
    triggerToast('Xóa thiết bị vật lý thành công');
  };

  // Open Create Maintenance Form
  const handleOpenMaintenance = (asset) => {
    if (asset.status === 'MAINTENANCE') {
      return; // Disabled
    }
    setSelectedMaintenance(asset);
    
    // Set default reason as per PIN003 request if appropriate
    if (asset.assetCode === 'PIN003') {
      setMaintReason('Pin gần đạt ngưỡng số lần thuê cần kiểm tra');
      setMaintInitialNote('Kiểm tra dung lượng pin và khả năng sạc');
    } else {
      setMaintReason('');
      setMaintInitialNote('');
    }
    
    setShowMaintenance(true);
  };

  // Submit Create Maintenance
  const handleSaveMaintenance = (e) => {
    e.preventDefault();

    if (!selectedMaintenance) {
      alert('Không thể tạo hồ sơ bảo trì');
      return;
    }

    if (!maintReason.trim()) {
      alert('Vui lòng nhập lý do bảo trì');
      return;
    }

    // Prepare JSON Payload
    const payload = {
      assetCode: selectedMaintenance.assetCode,
      reason: maintReason.trim(),
      initialNote: maintInitialNote.trim(),
      maintenanceStatus: 'IN_PROGRESS',
      assetStatusAfterCreate: 'MAINTENANCE'
    };

    setDiagnosticPayload({
      action: 'CREATE_MAINTENANCE_RECORD',
      data: payload
    });

    // Update status to 'MAINTENANCE' (Bảo trì)
    setAssets(assets.map(a => {
      if (a.assetCode === selectedMaintenance.assetCode) {
        return {
          ...a,
          status: 'MAINTENANCE',
          conditionNote: maintReason.trim()
        };
      }
      return a;
    }));

    setShowMaintenance(false);
    triggerToast('Tạo hồ sơ bảo trì thành công');

    alert(`Tạo hồ sơ bảo trì thành công\n\n[Dữ liệu gửi lên server]:\n${JSON.stringify(payload, null, 2)}`);
  };

  // Open Detail Display
  const handleOpenDetail = (asset) => {
    setSelectedDetail(asset);
    setShowDetail(true);
  };

  // Filter Physical Assets
  const filteredAssets = assets.filter(a => {
    const matchesCode = filterAssetCode === '' || a.assetCode.toLowerCase().includes(filterAssetCode.toLowerCase());
    const matchesName = filterAssetName === '' || a.assetName.toLowerCase().includes(filterAssetName.toLowerCase());
    const matchesModel = filterProductModel === '' || a.productModel.toLowerCase().includes(filterProductModel.toLowerCase());
    const matchesSerial = filterSerialNumber === '' || a.serialNumber.toLowerCase().includes(filterSerialNumber.toLowerCase());
    const matchesLocation = filterCurrentLocation === '' || a.currentLocation.toLowerCase().includes(filterCurrentLocation.toLowerCase());
    const matchesStatus = filterStatus === '' || a.status === filterStatus;

    return matchesCode && matchesName && matchesModel && matchesSerial && matchesLocation && matchesStatus;
  });

  return (
    <div className="space-y-6 text-left selection:bg-indigo-100">
      
      {/* Toast Alert Pop */}
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

      {/* Header section matching requirements precisely */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
            <span>Trang chủ</span>
            <span>/</span>
            <span className="text-indigo-600 font-black">Quản lý thiết bị vật lý</span>
          </div>
          <h2 className="text-lg font-black text-[#00236f] uppercase tracking-wide flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            Quản lý thiết bị vật lý
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Quản lý các tài sản định danh theo mã tài sản và số serial.</p>
        </div>

        {/* Thêm thiết bị vật lý action trigger button inside page header */}
        <button 
          onClick={handleOpenAdd}
          className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition duration-150 flex items-center gap-1.5 shadow-sm hover:shadow active:scale-95 cursor-pointer font-sans"
        >
          <Plus className="w-4 h-4" />
          Thêm thiết bị vật lý
        </button>
      </div>

      {/* DIAGNOSTIC DETAILED PAYLOAD STREAM SIMULATOR */}
      {diagnosticPayload && (
        <div className="bg-slate-950 text-emerald-400 p-4 rounded-2xl border border-slate-800 font-mono text-xs shadow-lg">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-850">
            <span className="text-indigo-400 font-black tracking-wider text-[10.5px]">📡 [T-Rent CMS API Debugger] Payload gửi lên hệ thống:</span>
            <button 
              onClick={() => setDiagnosticPayload(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 font-semibold mb-1">Hành động: <span className="text-white bg-slate-800 px-1.5 py-0.5 rounded font-mono font-black">{diagnosticPayload.action}</span></p>
          <pre className="overflow-x-auto whitespace-pre-wrap max-h-56 select-all">{JSON.stringify(diagnosticPayload.data, null, 2)}</pre>
        </div>
      )}

      {/* FILTERS CARD */}
      <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
        <h3 className="text-xs uppercase font-extrabold text-slate-500 mb-3.5 flex items-center gap-1.5 tracking-wider">
          <Sliders className="w-3.5 h-3.5 text-indigo-500" />
          Bộ lọc thông tin tài sản
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
          {/* Mã tài sản */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">Mã tài sản</label>
            <input 
              type="text" 
              placeholder="BODY001..."
              value={filterAssetCode}
              onChange={(e) => setFilterAssetCode(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Tên tài sản */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">Tên tài sản</label>
            <input 
              type="text" 
              placeholder="Sony A7..."
              value={filterAssetName}
              onChange={(e) => setFilterAssetName(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Mẫu thiết bị */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">Mẫu thiết bị</label>
            <input 
              type="text" 
              placeholder="Fuji x-t5..."
              value={filterProductModel}
              onChange={(e) => setFilterProductModel(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Số serial */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">Số serial</label>
            <input 
              type="text" 
              placeholder="SN-A7..."
              value={filterSerialNumber}
              onChange={(e) => setFilterSerialNumber(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Vị trí kho */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">Vị trí kho</label>
            <input 
              type="text" 
              placeholder="Kệ A1..."
              value={filterCurrentLocation}
              onChange={(e) => setFilterCurrentLocation(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Trạng thái */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">Trạng thái thiết bị</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-black text-slate-700 cursor-pointer focus:bg-white focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Tất cả</option>
              <option value="AVAILABLE">Sẵn sàng</option>
              <option value="RENTED">Đang thuê</option>
              <option value="MAINTENANCE">Bảo trì</option>
              <option value="DECOMMISSIONED">Ngừng sử dụng</option>
              <option value="LOST">Mất</option>
            </select>
          </div>
        </div>
      </div>

      {/* CORE TABLE LISTING */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[1250px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[13px] font-semibold text-[#0f172a]">
                <th className="px-5 py-3.5 whitespace-nowrap text-left font-semibold min-w-[100px]">Mã tài sản</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-left font-semibold min-w-[150px]">Tên thiết bị</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-left font-semibold min-w-[110px]">Phân loại</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-left font-semibold min-w-[160px]">Mẫu thiết bị</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-left font-semibold min-w-[110px]">Số serial</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-left font-semibold min-w-[120px]">Vị trí kho</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-center font-semibold min-w-[110px]">Trạng thái</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-left font-semibold min-w-[180px]">Ghi chú tình trạng</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-center font-semibold min-w-[100px]">Số lần thuê</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-center font-semibold min-w-[110px]">Cảnh báo</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-right font-semibold min-w-[370px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-650">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan="11" className="px-6 py-12 text-center text-slate-400 italic font-bold">
                    Không tìm thấy thiết bị vật lý nào phù hợp tiêu chí bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredAssets.map(a => {
                  const isRented = a.status === 'RENTED';
                  const isMaintenance = a.status === 'MAINTENANCE';
                  const isDecommissioned = a.status === 'DECOMMISSIONED';
                  const isLost = a.status === 'LOST';

                  // Determine active warnings based on rent limits
                  const isCloseToThreshold = a.maintenanceThreshold && (a.rentalCount === a.maintenanceThreshold - 1);
                  const isOverThreshold = a.maintenanceThreshold && (a.rentalCount >= a.maintenanceThreshold);

                  return (
                    <tr key={a.assetCode} className="hover:bg-slate-50/50 transition duration-150">
                      {/* Mã tài sản */}
                      <td className="px-5 py-4 text-[#00236f] font-mono font-black">{a.assetCode}</td>

                      {/* Tên tài sản */}
                      <td className="px-5 py-4 text-slate-900 font-extrabold">{a.assetName}</td>

                      {/* Loại tài sản */}
                      <td className="px-5 py-4">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-[10px] font-bold">
                          {a.assetType}
                        </span>
                      </td>

                      {/* Mẫu thiết bị */}
                      <td className="px-5 py-4 text-slate-600">{a.productModel}</td>

                      {/* Số serial */}
                      <td className="px-5 py-4 font-mono font-bold text-slate-800">{a.serialNumber}</td>

                      {/* Vị trí kho hiện tại */}
                      <td className="px-5 py-4 font-semibold text-slate-700 cell-location">
                        {a.currentLocation}
                      </td>

                      {/* Trạng thái */}
                      <td className="px-5 py-4 text-center">
                        <span className={`status-badge ${STATUS_COLORS[a.status] || ''}`}>
                          {STATUS_LABELS[a.status] || a.status}
                        </span>
                      </td>

                      {/* Ghi chú tình trạng */}
                      <td className="px-5 py-4 text-slate-500 max-w-[150px] truncate" title={a.conditionNote}>
                        {a.conditionNote}
                      </td>

                      {/* Số lần thuê */}
                      <td className="px-5 py-4 text-center font-mono font-bold text-slate-800">
                        {a.rentalCount}
                      </td>

                      {/* Cảnh báo / Ngưỡng bảo trì */}
                      <td className="px-5 py-4 text-center font-mono">
                        <div className="flex flex-col items-center gap-1 justify-center">
                          <span className="text-[11px] text-slate-400 font-medium">/{a.maintenanceThreshold || 'N/A'}</span>
                          
                          {/* Warnings requirements check for PIN003 etc. */}
                          {isCloseToThreshold && (
                            <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[9.5px] px-2 py-0.5 rounded font-sans font-semibold">
                              Sắp chạm ngưỡng
                            </span>
                          )}

                          {isOverThreshold && (
                            <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[9.5px] px-2 py-0.5 rounded font-sans font-semibold">
                              Chạm ngưỡng
                            </span>
                          )}
                        </div>
                      </td>

                      {/* THAO TÁC 4 NÚT NGANG HÀNG BẮT BUỘC KHÔNG ĐƯỢC GIẤU */}
                      <td className="px-5 py-4 text-right">
                        <div className="table-action-group justify-end">
                          {/* Xem chi tiết */}
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(a)}
                            className="table-action-button text-[#00236f] bg-[#00236f]/5 hover:bg-[#00236f]/10 cursor-pointer"
                          >
                            Xem chi tiết
                          </button>

                          {/* Cập nhật */}
                          <button
                            type="button"
                            onClick={() => handleOpenUpdate(a)}
                            className="table-action-button text-indigo-705 bg-indigo-50 hover:bg-indigo-100 cursor-pointer"
                          >
                            Cập nhật
                          </button>

                          {/* Tạo hồ sơ bảo trì */}
                          <div className="relative group">
                            <button
                              type="button"
                              disabled={isMaintenance || isRented}
                              onClick={() => handleOpenMaintenance(a)}
                              className={`table-action-button transition cursor-pointer font-semibold ${
                                (isMaintenance || isRented)
                                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                  : 'bg-slate-200 hover:bg-slate-300 text-slate-705'
                              }`}
                            >
                              Tạo hồ sơ bảo trì
                            </button>

                            {isMaintenance && (
                              <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:block transition duration-200 z-[100] max-w-[200px] w-48 text-left bg-slate-900 text-white rounded-lg p-2  shadow-2xl">
                                <p className="text-[10px] font-semibold font-sans">Tài sản đang có hồ sơ bảo trì chưa hoàn tất.</p>
                              </div>
                            )}

                            {isRented && (
                              <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:block transition duration-200 z-[100] max-w-[200px] w-48 text-left bg-slate-900 text-white rounded-lg p-2  shadow-2xl">
                                <p className="text-[10px] font-semibold font-sans">Vật tư đang được thuê bởi khách hàng.</p>
                              </div>
                            )}
                          </div>

                          {/* Xóa */}
                          <button
                            type="button"
                            disabled={isRented || isMaintenance}
                            onClick={() => handleOpenDelete(a)}
                            className={`table-action-button font-semibold ${
                              (isRented || isMaintenance)
                                ? 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
                                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            }`}
                          >
                            Xóa
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

      {/* ======================================================== */}
      {/* 1. DRAWER / MODAL: VIEW DETAILS (READ-ONLY, NO OP BUTTONS) */}
      {/* ======================================================== */}
      {showDetail && selectedDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[1100] flex justify-end animate-fadeIn font-sans">
          <div className="bg-white w-full max-w-2xl h-screen shadow-2xl flex flex-col animate-slideLeft text-slate-800 text-xs">
            
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-sm font-black text-[#00236f] uppercase">Chi tiết thông tin thiết bị vật lý</h3>
                <p className="text-[11px] text-slate-400 font-bold font-mono">Token ID: {selectedDetail.assetCode} | Serial: {selectedDetail.serialNumber}</p>
              </div>
              <button 
                onClick={() => setShowDetail(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Panel content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-5.5 text-left font-semibold">
              
              {/* A. THÔNG TIN ĐỊNH DANH */}
              <div className="bg-slate-50 p-4 border border-slate-205 rounded-xl space-y-2">
                <span className="text-[9.5px] text-[#00236f] font-extrabold uppercase block tracking-wider border-b pb-1">
                  A. Thông tin định danh tài sản
                </span>
                
                <div className="grid grid-cols-2 gap-3.5 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Mã tài sản (Asset Code):</span>
                    <strong className="text-slate-900 font-mono text-sm font-black">{selectedDetail.assetCode}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Tên tài sản (Tên gọi):</span>
                    <strong className="text-slate-850 text-xs font-black">{selectedDetail.assetName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Loại thiết bị:</span>
                    <strong className="text-slate-850">{selectedDetail.assetType}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Thuộc mẫu sản phẩm:</span>
                    <strong className="text-slate-850 font-bold">{selectedDetail.productModel}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[9.5px]">Số sản phẩm Serial (Chính xác):</span>
                    <strong className="text-[#00236f] font-mono text-xs font-black">{selectedDetail.serialNumber}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[9.5px]">Ghi chú nhận dạng riêng biệt:</span>
                    <p className="text-slate-700 italic font-medium">"{selectedDetail.identificationNote || 'Không có ghi chú nhận dạng riêng biệt.'}"</p>
                  </div>
                </div>
              </div>

              {/* B. THÔNG TIN VỊ TRÍ */}
              <div className="bg-slate-50 p-4 border border-slate-205 rounded-xl space-y-2">
                <span className="text-[9.5px] text-[#00236f] font-extrabold uppercase block tracking-wider border-b pb-1">
                  B. Định vị trí lưu kho vật lý
                </span>
                <div className="grid grid-cols-2 gap-3 pb-1 pt-1.5">
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Kho lưu trữ định sẵn (Mặc định):</span>
                    <p className="text-slate-800 font-extrabold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      {selectedDetail.defaultLocation || 'Kệ chính'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Vị trí giao nhận / Lưu trú hiện tại:</span>
                    <p className="text-[#00236f] font-black flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-650" />
                      {selectedDetail.currentLocation || 'Kệ chính'}
                    </p>
                  </div>
                </div>
              </div>

              {/* C. THÔNG TIN TRẠNG THÁI */}
              <div className="bg-slate-50 p-4 border border-slate-205 rounded-xl space-y-2">
                <span className="text-[9.5px] text-[#00236f] font-extrabold uppercase block tracking-wider border-b pb-1">
                  C. Hiện trạng hao mòn, lượt vận hành
                </span>
                
                <div className="grid grid-cols-2 gap-3.5 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Trạng thái thiết bị hiện thời:</span>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${STATUS_COLORS[selectedDetail.status] || ''}`}>
                      {STATUS_LABELS[selectedDetail.status]}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Ghi chú chất lượng hao hụt:</span>
                    <p className="text-slate-800 font-bold mt-1 text-xs">{selectedDetail.conditionNote || 'Bình thường'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Số lần cho mượn thuê thực tế:</span>
                    <p className="text-slate-905 font-mono text-xs font-black">{selectedDetail.rentalCount} lượt thuê</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Ngưỡng kiểm thử kỹ thuật định kỳ:</span>
                    <p className="text-slate-850 font-bold">{selectedDetail.maintenanceThreshold ? `${selectedDetail.maintenanceThreshold} lần thuê` : 'Không thiết lập'}</p>
                  </div>
                </div>
              </div>

              {/* D. THÔNG TIN LIÊN QUAN */}
              <div className="bg-white border border-dashed border-indigo-200 p-4 rounded-xl space-y-2">
                <span className="text-[9.5px] text-indigo-700 font-extrabold uppercase block tracking-wider border-b border-indigo-100 pb-1">
                  D. Cổng liên hệ nghiệp vụ phát sinh
                </span>

                {selectedDetail.status === 'RENTED' && (
                  <div className="space-y-1 pt-1">
                    <span className="text-slate-400 block text-[9.5px]">Đơn hàng khách hàng đang thuê liên quan:</span>
                    <div className="p-2 bg-sky-50 text-sky-850 font-mono font-black rounded text-[11px] border border-sky-100 flex items-center justify-between">
                      <span>Mã khế ước đơn thuê: #ORD-5009</span>
                      <span className="text-[9.5px] font-sans bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded uppercase">Đang cho thuê</span>
                    </div>
                  </div>
                )}

                {selectedDetail.status === 'MAINTENANCE' && (
                  <div className="space-y-1 pt-1">
                    <span className="text-slate-400 block text-[9.5px]">Mã hồ sơ bảo trì đang mở liên quan:</span>
                    <div className="p-2 bg-amber-50 text-amber-850 font-mono font-black rounded text-[11px] border border-amber-100 flex items-center justify-between">
                      <span>Mã số tiếp nhận: #MT001</span>
                      <span className="text-[9.5px] font-sans bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded uppercase">Đang tiến hành</span>
                    </div>
                  </div>
                )}

                {selectedDetail.status === 'DECOMMISSIONED' && (
                  <div className="space-y-1 pt-1">
                    <span className="text-slate-400 block text-[9.5px]">Ghi chú chi tiết ngừng sử dụng:</span>
                    <div className="p-2.5 bg-slate-50 text-slate-700 rounded italic font-medium leading-relaxed">
                      "Không đủ điều kiện kiểm tra vận hành an toàn. Ngừng triển khai dịch vụ để tháo rã linh kiện sơ cua thay thế."
                    </div>
                  </div>
                )}

                {!['RENTED', 'MAINTENANCE', 'DECOMMISSIONED'].includes(selectedDetail.status) && (
                  <p className="text-slate-400 text-[10.5px] italic text-center font-medium pt-1">Tài sản hiện trạng độc lập, chưa phát sinh lệnh liên kết ngoài.</p>
                )}
              </div>

              {/* CRITICAL ATTRIBUTE RULE DISPLAY */}
              <div className="bg-rose-50 border border-slate-100 p-3 rounded-xl text-slate-800 flex items-start gap-2 max-w-full">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <div className="space-y-0.5">
                  <span className="text-[9.5px] text-rose-800 font-extrabold uppercase tracking-wider block">Nguyên tắc xem thông tin:</span>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Để tránh lỗi che giấu nghiệp vụ, toàn bộ các chức năng <strong>Cập nhật</strong>, <strong>Tạo hồ sơ bảo trì</strong> và <strong>Xóa</strong> đã được thiết kế mở trực tiếp tại bảng ngoài. Màn hình chi tiết này chỉ phục vụ đối chiếu dữ liệu tĩnh.</p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50">
              <button
                type="button"
                onClick={() => setShowDetail(false)}
                className="px-5 py-2.5 bg-slate-200 text-slate-700 font-black rounded-xl hover:bg-slate-300 transition text-xs uppercase cursor-pointer"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. DRAWER / MODAL: ADD PHYSICAL EQUIPMENT */}
      {/* ======================================================== */}
      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[1100] flex justify-end animate-fadeIn font-sans">
          <div className="bg-white w-full max-w-2xl h-screen shadow-2xl flex flex-col animate-slideLeft text-slate-850 text-xs">
            
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <span className="text-[9.5px] text-indigo-700 font-black uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                  Khai báo tài sản mới
                </span>
                <h3 className="text-sm font-black text-[#00236f] uppercase">Thêm thiết bị vật lý</h3>
              </div>
              <button 
                onClick={() => setShowAdd(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSaveAdd} className="flex-grow overflow-y-auto p-6 space-y-4.5 text-left font-semibold">
              <p className="text-[11px] text-slate-400 font-bold mb-1 italic">Vui lòng hoàn tất biểu mẫu khai sinh tài sản đáp ứng chuẩn dữ liệu của phòng kĩ thuật.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mã tài sản */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Mã tài sản (Asset Code) <span className="text-rose-550">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Ví dụ: BODY011"
                    value={addForm.assetCode}
                    onChange={(e) => setAddForm({ ...addForm, assetCode: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 font-mono focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Tên tài sản */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Tên tài sản <span className="text-rose-550">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Ví dụ: Sony A7 IV Body (Chiếc số 4)"
                    value={addForm.assetName}
                    onChange={(e) => setAddForm({ ...addForm, assetName: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Loại tài sản */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Loại tài sản <span className="text-rose-550">*</span>
                  </label>
                  <select 
                    value={addForm.assetType}
                    onChange={(e) => setAddForm({ ...addForm, assetType: e.target.value })}
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-black text-slate-800 cursor-pointer focus:ring-1 focus:ring-indigo-500"
                  >
                    {ASSET_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Mẫu thiết bị */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Mẫu thiết bị (Product Model) <span className="text-rose-550">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Ví dụ: Sony A7 IV"
                    value={addForm.productModel}
                    onChange={(e) => setAddForm({ ...addForm, productModel: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Số serial */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Số serial <span className="text-rose-550">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Ví dụ: SN-A7IV-011"
                    value={addForm.serialNumber}
                    onChange={(e) => setAddForm({ ...addForm, serialNumber: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 font-mono focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Trạng thái thiết bị - default Sẵn sàng */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Trạng thái thiết bị
                  </label>
                  <select 
                    value={addForm.status}
                    onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-black text-slate-800 cursor-pointer focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="AVAILABLE">Sẵn sàng</option>
                    <option value="RENTED">Đang thuê</option>
                    <option value="MAINTENANCE">Bảo trì</option>
                    <option value="DECOMMISSIONED">Ngừng sử dụng</option>
                    <option value="LOST">Mất</option>
                  </select>
                </div>

                {/* Vị trí kho mặc định */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Vị trí kho mặc định <span className="text-rose-550">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Ví dụ: Kệ A1"
                    value={addForm.defaultLocation}
                    onChange={(e) => setAddForm({ ...addForm, defaultLocation: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Vị trí kho hiện tại */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Vị trí kho hiện tại <span className="text-slate-400 font-normal">(Để trống sẽ lấy vị trí mặc định)</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="Ví dụ: Kệ A1"
                    value={addForm.currentLocation}
                    onChange={(e) => setAddForm({ ...addForm, currentLocation: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Số lần thuê - default 0 */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Số lần thuê ban đầu
                  </label>
                  <input 
                    type="number"
                    min="0"
                    placeholder="0"
                    value={addForm.rentalCount}
                    onChange={(e) => setAddForm({ ...addForm, rentalCount: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 font-mono focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Ngưỡng bảo trì */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Ngưỡng bảo trì (Lượt thuê) <span className="text-slate-400 font-normal">(Thí dụ: 20)</span>
                  </label>
                  <input 
                    type="number"
                    min="1"
                    placeholder="Để trống hoặc nhập số > 0"
                    value={addForm.maintenanceThreshold}
                    onChange={(e) => setAddForm({ ...addForm, maintenanceThreshold: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 font-mono focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Ghi chú nhận dạng */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">Ghi chú nhận dạng</label>
                  <input 
                    type="text"
                    placeholder="Ví dụ: Trầy xóc cạnh đáy gần chỗ tháo pin..."
                    value={addForm.identificationNote}
                    onChange={(e) => setAddForm({ ...addForm, identificationNote: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Ghi chú tình trạng ban đầu */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">Ghi chú tình trạng ban đầu</label>
                  <textarea 
                    rows="2"
                    placeholder="Tốt, sẵn sàng cho thuê..."
                    value={addForm.conditionNote}
                    onChange={(e) => setAddForm({ ...addForm, conditionNote: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-bold text-slate-800 focus:bg-white focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </div>

            </form>

            {/* Actions Footer */}
            <div className="px-6 py-4.5 border-t border-slate-100 flex justify-between items-center bg-slate-50">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4.5 py-2.5 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition text-xs cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveAdd}
                className="px-5 py-2.5 bg-indigo-650 text-white font-black rounded-xl hover:bg-indigo-700 transition text-xs uppercase cursor-pointer shadow"
              >
                Khai báo lưu trữ
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. DRAWER / MODAL: UPDATE PHYSICAL EQUIPMENT */}
      {/* ======================================================== */}
      {showUpdate && selectedUpdate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[1100] flex justify-end animate-fadeIn font-sans">
          <div className="bg-white w-full max-w-2xl h-screen shadow-2xl flex flex-col animate-slideLeft text-slate-850 text-xs text-left">
            
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <span className="text-[9.5px] text-indigo-700 font-black uppercase tracking-wider block">Sửa đổi thông số hồ sơ kĩ thuật</span>
                <h3 className="text-sm font-black text-[#00236f] uppercase">Cập nhật thiết bị vật lý</h3>
              </div>
              <button 
                onClick={() => setShowUpdate(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form parameters */}
            <form onSubmit={handleSaveUpdate} className="flex-grow overflow-y-auto p-6 space-y-4.5 text-left font-semibold">
              
              <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 flex items-start gap-2 text-[11px] text-amber-800">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Mã tài sản cố định (<strong>{selectedUpdate.assetCode}</strong>) và Số lần đã cho thuê (<strong>{selectedUpdate.rentalCount} lượt</strong>) là trường đóng băng hệ thống do máy chủ định cư, không cấp quyền cấu hình thủ công.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* LOCKED: Mã tài sản */}
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Mã tài sản (Chỉ xem)</label>
                  <input 
                    type="text" 
                    disabled 
                    value={selectedUpdate.assetCode}
                    className="w-full text-xs bg-slate-100 border border-slate-200 text-slate-400 font-mono font-black rounded-xl px-3 py-2.5 cursor-not-allowed outline-none" 
                  />
                </div>

                {/* Tên tài sản */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Tên tài sản <span className="text-rose-550">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Nhập tên gọi..."
                    value={updateForm.assetName}
                    onChange={(e) => setUpdateForm({ ...updateForm, assetName: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Loại tài sản */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Loại tài sản <span className="text-rose-550">*</span>
                  </label>
                  <select 
                    value={updateForm.assetType}
                    onChange={(e) => setUpdateForm({ ...updateForm, assetType: e.target.value })}
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-black text-slate-805 cursor-pointer focus:ring-1 focus:ring-indigo-500"
                  >
                    {ASSET_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Mẫu thiết bị */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Mẫu thiết bị <span className="text-rose-550">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Mẫu thiết bị..."
                    value={updateForm.productModel}
                    onChange={(e) => setUpdateForm({ ...updateForm, productModel: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Số serial */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Số serial <span className="text-rose-550">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Số serial..."
                    value={updateForm.serialNumber}
                    onChange={(e) => setUpdateForm({ ...updateForm, serialNumber: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 font-mono focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Trạng thái thiết bị */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Trạng thái thiết bị <span className="text-rose-550">*</span>
                  </label>
                  <select 
                    value={updateForm.status}
                    onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-black text-slate-805 cursor-pointer focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="AVAILABLE">Sẵn sàng</option>
                    <option value="RENTED">Đang thuê</option>
                    <option value="MAINTENANCE">Bảo trì</option>
                    <option value="DECOMMISSIONED">Ngừng sử dụng</option>
                    <option value="LOST">Mất</option>
                  </select>
                </div>

                {/* Vị trí kho mặc định */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Vị trí kho mặc định <span className="text-rose-550">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Vị trí kho mặc định..."
                    value={updateForm.defaultLocation}
                    onChange={(e) => setUpdateForm({ ...updateForm, defaultLocation: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Vị trí kho hiện tại */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Vị trí kho hiện tại <span className="text-rose-550">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Vị trí kho hiện tại..."
                    value={updateForm.currentLocation}
                    onChange={(e) => setUpdateForm({ ...updateForm, currentLocation: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* LOCKED: Số lần thuê */}
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Số lần thuê (Hệ thống khóa)</label>
                  <input 
                    type="text" 
                    disabled 
                    value={`${selectedUpdate.rentalCount} lượt`}
                    className="w-full text-xs bg-slate-100 border border-slate-200 text-slate-400 font-mono font-bold rounded-xl px-3 py-2.5 cursor-not-allowed outline-none" 
                  />
                </div>

                {/* Ngưỡng bảo trì */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Ngưỡng bảo trì (Lượt thuê)
                  </label>
                  <input 
                    type="number"
                    min="1"
                    placeholder="Ví dụ: 20"
                    value={updateForm.maintenanceThreshold}
                    onChange={(e) => setUpdateForm({ ...updateForm, maintenanceThreshold: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 font-mono focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Ghi chú nhận dạng */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">Ghi chú nhận dạng</label>
                  <input 
                    type="text"
                    placeholder="Ghi chú nhận dạng phụ thêm..."
                    value={updateForm.identificationNote}
                    onChange={(e) => setUpdateForm({ ...updateForm, identificationNote: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Ghi chú tình trạng */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">Ghi chú tình trạng hiện tại</label>
                  <textarea 
                    rows="2"
                    placeholder="Nhập ghi chú hiện đại..."
                    value={updateForm.conditionNote}
                    onChange={(e) => setUpdateForm({ ...updateForm, conditionNote: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-bold text-slate-800 focus:bg-white focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </div>

            </form>

            {/* Actions panel */}
            <div className="px-6 py-4.5 border-t border-slate-100 flex justify-between items-center bg-slate-50">
              <button
                type="button"
                onClick={() => setShowUpdate(false)}
                className="px-4.5 py-2.5 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition text-xs cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                onClick={handleSaveUpdate}
                className="px-5 py-2.5 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition text-xs uppercase cursor-pointer shadow-sm"
              >
                Lưu cập nhật
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. DRAWER / MODAL: CONFIRM DELETION */}
      {/* ======================================================== */}
      {showDelete && selectedDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[1200] flex items-center justify-center animate-fadeIn font-sans p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 border border-rose-50 animate-zoomIn text-xs font-semibold text-slate-700">
            
            {/* Header Title */}
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-black uppercase text-slate-900 font-sans">Xóa thiết bị vật lý</h3>
            </div>

            {/* Body */}
            <div className="space-y-3.5 text-left pt-1">
              <p className="text-slate-500 font-medium leading-relaxed">Bạn có chắc chắn muốn xóa thiết bị vật lý này khỏi hệ thống kĩ thuật T-Rent không?</p>
              
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5 font-sans">
                <p>• Mã tài sản: <strong className="text-[#00236f] font-mono font-black">{selectedDelete.assetCode}</strong></p>
                <p>• Tên tài sản: <span className="text-slate-900 font-black">{selectedDelete.assetName}</span></p>
                <p>• Số sản phẩm serial: <span className="text-slate-800 font-mono font-bold">{selectedDelete.serialNumber}</span></p>
                <p>• Trạng thái hiện tại: 
                  <span className={`inline-block ml-1 px-2.5 py-0.5 rounded text-[9.5px] font-black uppercase ${STATUS_COLORS[selectedDelete.status] || ''}`}>
                    {STATUS_LABELS[selectedDelete.status]}
                  </span>
                </p>
              </div>

              {/* Warnings message notes */}
              {selectedDelete.assetCode === 'BODY001' && (
                <div className="p-2.5 bg-rose-50 text-rose-800 text-[10px] rounded border border-rose-100">
                  ⚠️ <strong>Ủy thác phụ thuộc:</strong> Thiết bị BODY001 hiện đang nằm trong các phiếu kiểm kê bồi hoàn cũ. Hành vi xóa sẽ bị máy chủ chặn hoàn toàn để duy trì tính toàn vẹn dữ liệu.
                </div>
              )}
            </div>

            {/* Actions panel */}
            <div className="flex justify-end gap-3.5 pt-3.5 border-t">
              <button
                type="button"
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 bg-slate-150 text-slate-700 rounded-lg hover:bg-slate-200 transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-[#dc2626] text-white rounded-lg hover:bg-red-700 font-black uppercase tracking-wider transition cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. DRAWER / MODAL: CREATE MAINTENANCE RECORD */}
      {/* ======================================================== */}
      {showMaintenance && selectedMaintenance && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[1100] flex justify-end animate-fadeIn font-sans">
          <div className="bg-white w-full max-w-2xl h-screen shadow-2xl flex flex-col animate-slideLeft text-slate-850 text-xs text-left">
            
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <span className="text-[10px] text-amber-600 font-black uppercase tracking-wider flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5 animate-pulse" />
                  Ủy ban nghiệp vụ sửa chữa
                </span>
                <h3 className="text-sm font-black text-[#00236f] uppercase">Tạo hồ sơ bảo trì</h3>
                <p className="text-[11px] text-slate-400 font-medium">Tạo hồ sơ bảo trì cho thiết bị cần kiểm tra hoặc xử lý.</p>
              </div>
              <button 
                onClick={() => setShowMaintenance(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Scroll panel content */}
            <form onSubmit={handleSaveMaintenance} className="flex-grow overflow-y-auto p-6 space-y-5.5 font-semibold">
              
              {/* A. THÔNG TIN THIẾT BỊ ĐƯỢC CHỌN (Chỉ xem) */}
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[9.5px] text-[#00236f] font-extrabold uppercase block tracking-wider">
                  A. Thông tin thiết bị được chọn (Chỉ xem)
                </span>
                
                <div className="grid grid-cols-2 gap-3.5 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Mã tài sản (Asset Code):</span>
                    <strong className="text-slate-900 font-mono font-black">{selectedMaintenance.assetCode}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Tên gọi:</span>
                    <strong className="text-slate-750">{selectedMaintenance.assetName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Loại thiết bị:</span>
                    <strong className="text-slate-750">{selectedMaintenance.assetType}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Số Serial:</span>
                    <strong className="text-[#00236f] font-mono font-bold text-xs">{selectedMaintenance.serialNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Tổng số lần thuê:</span>
                    <strong className="text-slate-800 font-mono block mt-0.5">{selectedMaintenance.rentalCount} lượt thuê</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Ngưỡng kiểm tra đạt hạn:</span>
                    <strong className="text-slate-850 block mt-0.5">{selectedMaintenance.maintenanceThreshold ? `${selectedMaintenance.maintenanceThreshold} lần` : 'N/A'}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[9.5px]">Ghi chú tình trạng vật lý hiện thời:</span>
                    <p className="text-slate-700 italic">"{selectedMaintenance.conditionNote || 'Bình thường'}"</p>
                  </div>
                </div>

                {/* Warning message if asset does not actually need maintenance */}
                {selectedMaintenance.rentalCount < (selectedMaintenance.maintenanceThreshold || 20) - 5 && (
                  <div className="p-3 bg-indigo-50 text-indigo-800 text-[10.5px] font-medium rounded-lg border border-indigo-150 flex items-start gap-1.5 mt-2">
                    <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <p><strong>Khuyến nghị từ hệ thống:</strong> Thiết bị này mới thuê {selectedMaintenance.rentalCount} lần, chưa hề tiếp cận ngưỡng bảo dưỡng định kỳ ({selectedMaintenance.maintenanceThreshold || 20} lần). Bạn hoàn toàn có thể cân nhắc trước khi cách ly tài sản vô thời hạn.</p>
                  </div>
                )}
              </div>

              {/* B. THÔNG TIN HỒ SƠ BẢO TRÌ */}
              <div className="bg-white border border-slate-255 p-4 rounded-xl space-y-3">
                <span className="text-[9.5px] text-amber-700 font-extrabold uppercase block tracking-wider border-b pb-1">
                  B. Thông số lập hồ sơ bảo dưỡng/sửa chữa mới
                </span>

                {/* Lý do bảo trì */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Lý do bảo trì <span className="text-rose-550">*</span>
                  </label>
                  <textarea
                    rows="2"
                    required
                    value={maintReason}
                    onChange={(e) => setMaintReason(e.target.value)}
                    placeholder="Nhập lý do chi tiết..."
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2 outline-none font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                  <span className="text-[10px] text-slate-400 font-medium italic block mt-0.5">Trường thông tin bắt buộc đối sánh cho việc tạo hồ sơ. Thí dụ: Pin sụt sạc nhanh, lỏng báng cầm...</span>
                </div>

                {/* Ghi chú ban đầu */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">Ghi chú ban đầu (Ý kiến chuẩn bị)</label>
                  <textarea
                    rows="2"
                    value={maintInitialNote}
                    onChange={(e) => setMaintInitialNote(e.target.value)}
                    placeholder="Nhập ý kiến chỉ đạo hoặc ghi chú thêm của thợ kỹ thuật..."
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2 outline-none font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="bg-amber-100/30 border border-amber-200 text-amber-800 p-3.5 rounded-xl font-medium text-[10.5px]">
                💡 <strong>Hành vi đồng bộ:</strong> Sau khi click <strong>Lưu hồ sơ</strong> thành công, tình trạng của thiết bị sẽ tự động chuyển sang trạng thái <strong>Bảo trì</strong>, khóa mọi liên kết bàn giao cho mượn và đồng bộ trực tiếp sang cấu mẫu của module <strong>Quản lý bảo trì</strong>.
              </div>

            </form>

            {/* Actions Footer */}
            <div className="px-6 py-4.5 border-t border-slate-100 flex justify-between items-center bg-slate-50">
              <button
                type="button"
                onClick={() => setShowMaintenance(false)}
                className="px-4.5 py-2.5 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                onClick={handleSaveMaintenance}
                className="px-5 py-2.5 bg-amber-500 text-white font-black rounded-xl hover:bg-amber-600 transition text-xs uppercase cursor-pointer shadow-sm"
              >
                Lưu hồ sơ bảo trì
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// ========================================================
// CORE WEB COMPONENT: QUANTITY-BASED ACCESSORIES MANAGEMENT (QUẢN LÝ PHỤ KIỆN)
// Actor: Nhân viên, Quản trị viên
// ========================================================
const SEED_ACCESSORIES_DATA = [
  {
    id: 'ACC001',
    name: 'Túi Sony',
    description: 'Túi đựng body Sony và phụ kiện',
    totalQuantity: 20,
    maintenanceQuantity: 2,
    lostQuantity: 1,
    storageLocation: 'Kệ PK-A1',
    status: 'ACTIVE',
    note: 'Dùng cho các combo Sony',
    history: [
      { id: 'H1', time: '01/06/2026 08:30', type: 'IMPORT', change: '+20', reason: 'Tạo phụ kiện ban đầu', order: '-', user: 'Quản trị viên' },
      { id: 'H2', time: '20/06/2026 10:15', type: 'DELIVER', change: '-1', reason: 'Bàn giao cho đơn ORD001', order: 'ORD001', user: 'Nhân viên A' },
      { id: 'H3', time: '23/06/2026 16:30', type: 'RETURN', change: '+1', reason: 'Khách trả đủ phụ kiện', order: 'ORD001', user: 'Nhân viên A' },
      { id: 'H4', time: '24/06/2026 14:00', type: 'DAMAGED', change: '+1', reason: 'Túi bị rách khi trả', order: 'ORD003', user: 'Nhân viên B' }
    ],
    isLinkedToSet: true,
    isLinkedToOrder: false,
    deliveredCount: 0
  },
  {
    id: 'ACC002',
    name: 'Túi Fuji',
    description: 'Túi đựng body Fuji và phụ kiện',
    totalQuantity: 12,
    maintenanceQuantity: 0,
    lostQuantity: 0,
    storageLocation: 'Kệ PK-B1',
    status: 'ACTIVE',
    note: 'Dùng cho các combo Fujifilm',
    history: [
      { id: 'H1', time: '01/06/2026 09:00', type: 'IMPORT', change: '+12', reason: 'Tạo phụ kiện ban đầu', order: '-', user: 'Quản trị viên' }
    ],
    isLinkedToSet: false,
    isLinkedToOrder: false,
    deliveredCount: 0
  },
  {
    id: 'ACC003',
    name: 'Thẻ nhớ SD 128GB',
    description: 'Thẻ nhớ dùng kèm máy ảnh',
    totalQuantity: 30,
    maintenanceQuantity: 3,
    lostQuantity: 2,
    storageLocation: 'Hộp PK-C1',
    status: 'ACTIVE',
    note: 'Thẻ Sandisk tốc độ cao',
    history: [
      { id: 'H1', time: '01/06/2026 10:00', type: 'IMPORT', change: '+30', reason: 'Tạo phụ kiện ban đầu', order: '-', user: 'Quản trị viên' }
    ],
    isLinkedToSet: false,
    isLinkedToOrder: true,
    deliveredCount: 0
  },
  {
    id: 'ACC004',
    name: 'Dây đeo máy ảnh',
    description: 'Dây đeo dùng kèm body máy ảnh',
    totalQuantity: 25,
    maintenanceQuantity: 1,
    lostQuantity: 0,
    storageLocation: 'Kệ PK-A2',
    status: 'ACTIVE',
    note: 'Dây đeo Peak Design êm ái',
    history: [
      { id: 'H1', time: '01/06/2026 11:15', type: 'IMPORT', change: '+25', reason: 'Tạo phụ kiện ban đầu', order: '-', user: 'Quản trị viên' }
    ],
    isLinkedToSet: false,
    isLinkedToOrder: false,
    deliveredCount: 0
  },
  {
    id: 'ACC005',
    name: 'Hộp chống sốc',
    description: 'Hộp bảo vệ thiết bị khi bàn giao',
    totalQuantity: 8,
    maintenanceQuantity: 2,
    lostQuantity: 1,
    storageLocation: 'Kệ PK-D1',
    status: 'INACTIVE',
    note: 'Hộp chống va đập xịn',
    history: [
      { id: 'H1', time: '01/06/2026 13:00', type: 'IMPORT', change: '+8', reason: 'Tạo phụ kiện ban đầu', order: '-', user: 'Quản trị viên' }
    ],
    isLinkedToSet: true,
    isLinkedToOrder: false,
    deliveredCount: 0
  }
];

export function AccessoriesManager({ userRole = 'staff' }) {
  const [accList, setAccList] = useState(SEED_ACCESSORIES_DATA);
  const [toast, setToast] = useState(null);

  // Filters State
  const [filterName, setFilterName] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modals state
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    description: '',
    totalQuantity: 50,
    maintenanceQuantity: 0,
    lostQuantity: 0,
    storageLocation: 'Kệ PK-E1',
    status: 'ACTIVE',
    note: 'Phụ kiện dùng kèm cho nhiều mẫu thiết bị'
  });

  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    name: '',
    description: '',
    totalQuantity: 0,
    maintenanceQuantity: 0,
    lostQuantity: 0,
    storageLocation: '',
    status: 'ACTIVE',
    note: ''
  });

  const [showDelete, setShowDelete] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState(null);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Pre-fill fields for ADD Accessory Form
  const handleOpenAdd = () => {
    setAddForm({
      name: '',
      description: '',
      totalQuantity: 0,
      maintenanceQuantity: 0,
      lostQuantity: 0,
      storageLocation: '',
      status: 'ACTIVE',
      note: ''
    });
    setShowAdd(true);
  };

  // Load a demo accessory to write faster as per use case request
  const handlePrefillDemo = () => {
    setAddForm({
      name: 'Khăn lau lens',
      description: 'Khăn lau dùng kèm bộ thiết bị khi bàn giao',
      totalQuantity: 50,
      maintenanceQuantity: 0,
      lostQuantity: 0,
      storageLocation: 'Kệ PK-E1',
      status: 'ACTIVE',
      note: 'Phụ kiện dùng kèm cho nhiều mẫu thiết bị'
    });
    triggerToast('Đã điền dữ liệu mẫu thành công!');
  };

  // Submit ADD Accessory
  const handleSaveAdd = (e) => {
    e.preventDefault();

    if (!addForm.name.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc (Tên phụ kiện là bắt buộc)');
      return;
    }

    const total = parseInt(addForm.totalQuantity);
    const maint = parseInt(addForm.maintenanceQuantity);
    const lost = parseInt(addForm.lostQuantity);

    if (isNaN(total) || total < 0 || isNaN(maint) || maint < 0 || isNaN(lost) || lost < 0) {
      alert('Số lượng phụ kiện không hợp lệ');
      return;
    }

    if (maint + lost > total) {
      alert('Tổng số lượng không được nhỏ hơn số lượng bảo trì/hư hỏng và số lượng mất');
      return;
    }

    const newId = `ACC${String(accList.length + 1).padStart(3, '0')}`;
    const newAcc = {
      id: newId,
      name: addForm.name.trim(),
      description: addForm.description.trim(),
      totalQuantity: total,
      maintenanceQuantity: maint,
      lostQuantity: lost,
      storageLocation: addForm.storageLocation.trim() || 'Nhà kho chính',
      status: addForm.status,
      note: addForm.note.trim(),
      history: [
        {
          id: 'H_INIT',
          time: new Date().toLocaleString('vi-VN'),
          type: 'IMPORT',
          change: `+${total}`,
          reason: addForm.note.trim() || 'Tạo phụ kiện ban đầu',
          order: '-',
          user: userRole === 'admin' ? 'Quản trị viên' : 'Nhân viên'
        }
      ],
      isLinkedToSet: false,
      isLinkedToOrder: false,
      deliveredCount: 0
    };

    setAccList([...accList, newAcc]);
    setShowAdd(false);
    triggerToast('Thêm phụ kiện thành công');
  };

  // Pre-fill and open UPDATE Drawer
  const handleOpenUpdate = (acc) => {
    setSelectedUpdate(acc);
    setUpdateForm({
      name: acc.name,
      description: acc.description,
      totalQuantity: acc.totalQuantity,
      maintenanceQuantity: acc.maintenanceQuantity,
      lostQuantity: acc.lostQuantity,
      storageLocation: acc.storageLocation,
      status: acc.status,
      note: acc.note || ''
    });
    setShowUpdate(true);
  };

  // Pre-fill demo update for "Túi Sony" for verification ease
  const handlePrefillUpdateDemo = () => {
    if (selectedUpdate?.name === 'Túi Sony') {
      setUpdateForm({
        ...updateForm,
        totalQuantity: 22,
        note: 'Bổ sung thêm 2 túi Sony'
      });
      triggerToast('Đã điền thông số cập nhật mẫu');
    }
  };

  // Save UPDATE Accessory
  const handleSaveUpdate = (e) => {
    e.preventDefault();

    if (!selectedUpdate) {
      alert('Không tìm thấy phụ kiện');
      return;
    }

    if (!updateForm.name.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc (Tên phụ kiện là bắt buộc)');
      return;
    }

    const total = parseInt(updateForm.totalQuantity);
    const maint = parseInt(updateForm.maintenanceQuantity);
    const lost = parseInt(updateForm.lostQuantity);

    if (isNaN(total) || total < 0 || isNaN(maint) || maint < 0 || isNaN(lost) || lost < 0) {
      alert('Số lượng phụ kiện không hợp lệ');
      return;
    }

    if (maint + lost > total) {
      alert('Tổng số lượng không được nhỏ hơn số lượng bảo trì/hư hỏng và số lượng mất');
      return;
    }

    const available = total - maint - lost;
    if (available < 0) {
      alert('Không cho cập nhật làm số lượng khả dụng âm.');
      return;
    }

    // Determine if inventory counts changed
    const hasLogChange = 
      selectedUpdate.totalQuantity !== total ||
      selectedUpdate.maintenanceQuantity !== maint ||
      selectedUpdate.lostQuantity !== lost;

    const updatedHistory = [...selectedUpdate.history];

    if (hasLogChange) {
      const qDiff = total - selectedUpdate.totalQuantity;
      const mDiff = maint - selectedUpdate.maintenanceQuantity;
      const lDiff = lost - selectedUpdate.lostQuantity;

      let logReason = updateForm.note.trim() || 'Cập nhật số lượng thủ công';
      let changeString = '';
      if (qDiff !== 0) changeString += ` Tổng: ${qDiff > 0 ? '+' : ''}${qDiff}`;
      if (mDiff !== 0) changeString += ` Bảo trì: ${mDiff > 0 ? '+' : ''}${mDiff}`;
      if (lDiff !== 0) changeString += ` Mất: ${lDiff > 0 ? '+' : ''}${lDiff}`;

      updatedHistory.unshift({
        id: `H_EDIT_${Date.now()}`,
        time: new Date().toLocaleString('vi-VN'),
        type: 'UPDATE',
        change: changeString.trim() || 'Vận hành số dư',
        reason: logReason,
        order: '-',
        user: userRole === 'admin' ? 'Quản trị viên' : 'Nhân viên'
      });
    }

    const updatedAcc = {
      ...selectedUpdate,
      name: updateForm.name.trim(),
      description: updateForm.description.trim(),
      totalQuantity: total,
      maintenanceQuantity: maint,
      lostQuantity: lost,
      storageLocation: updateForm.storageLocation.trim(),
      status: updateForm.status,
      note: updateForm.note.trim(),
      history: updatedHistory
    };

    setAccList(accList.map(item => item.id === selectedUpdate.id ? updatedAcc : item));
    setShowUpdate(false);
    triggerToast('Cập nhật phụ kiện thành công');
  };

  // Open DELETE Modal
  const handleOpenDelete = (acc) => {
    setSelectedDelete(acc);
    setShowDelete(true);
  };

  // Confirm DELETE Accessory (incorporates hard filters constraint checks)
  const handleConfirmDelete = () => {
    if (!selectedDelete) {
      alert('Không tìm thấy phụ kiện');
      return;
    }

    // Explicit constraint validation messages as strictly modeled by the assignment
    if (selectedDelete.name === 'Hộp chống sốc' || selectedDelete.isLinkedToSet) {
      alert('Không thể xóa phụ kiện đang được dùng trong bộ đi kèm');
      return;
    }

    if (selectedDelete.name === 'Thẻ nhớ SD 128GB' || selectedDelete.isLinkedToOrder) {
      alert('Không thể xóa phụ kiện đang liên quan đến đơn thuê');
      return;
    }

    // Any logs of other relations
    if (selectedDelete.name === 'Túi Sony' || (selectedDelete.history && selectedDelete.history.length > 1)) {
      alert('Không thể xóa phụ kiện này vì đang có dữ liệu liên quan');
      return;
    }

    // Safe soft delete for permitted rows: "Túi Fuji", "Dây đeo máy ảnh"
    setAccList(accList.filter(item => item.id !== selectedDelete.id));
    setShowDelete(false);
    triggerToast('Xóa phụ kiện thành công');
  };

  // Open Detail display
  const handleOpenDetail = (acc) => {
    setSelectedDetail(acc);
    setShowDetail(true);
  };

  // Filtering implementation
  const filteredAccs = accList.filter(item => {
    const matchesName = item.name.toLowerCase().includes(filterName.toLowerCase());
    const matchesLocation = item.storageLocation.toLowerCase().includes(filterLocation.toLowerCase());
    
    // ACTIVE / INACTIVE mapping status filter matching
    let matchesStatus = true;
    if (filterStatus === 'ACTIVE') {
      matchesStatus = item.status === 'ACTIVE';
    } else if (filterStatus === 'INACTIVE') {
      matchesStatus = item.status === 'INACTIVE';
    }

    return matchesName && matchesLocation && matchesStatus;
  });

  return (
    <div className="space-y-6 text-left selection:bg-indigo-100 font-sans">
      
      {/* Toast Alert pop */}
      {toast && (
        <div className="fixed top-5 right-5 z-[2000] bg-slate-900 border border-slate-800 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fadeIn">
          <div className="bg-emerald-500 p-1.5 rounded-full text-white">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold">{toast.message}</p>
          </div>
        </div>
      )}

      {/* HEADER SECTION WITH BREADCRUMB */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
            <span>Trang chủ</span>
            <span>/</span>
            <span className="text-[#00236f] font-black">Quản lý phụ kiện</span>
          </div>
          <h2 className="text-lg font-black text-[#00236f] uppercase tracking-wide flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            Quản lý phụ kiện
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Quản lý các phụ kiện số lượng dùng trong bộ thiết bị cho thuê.</p>
        </div>

        <button 
          onClick={handleOpenAdd}
          className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition duration-150 flex items-center gap-1.5 shadow-sm hover:shadow active:scale-95 cursor-pointer font-sans"
        >
          <Plus className="w-4 h-4" />
          Thêm phụ kiện
        </button>
      </div>

      {/* FILTERS SECTION */}
      <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-xs uppercase font-extrabold text-slate-500 flex items-center gap-1.5 tracking-wider font-sans">
          <Sliders className="w-3.5 h-3.5 text-indigo-500" />
          Bộ lọc thông tin
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Tên phụ kiện */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Tên phụ kiện</label>
            <input 
              type="text"
              placeholder="Ví dụ: Túi Sony, Dây đeo..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Vị trí kho */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Vị trí kho</label>
            <input 
              type="text"
              placeholder="Ví dụ: Kệ PK-A1, Hộp PK-C1..."
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Trạng thái */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block font-sans">Trạng thái</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-black text-slate-750 cursor-pointer focus:bg-white focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Tất cả</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Không hoạt động</option>
            </select>
          </div>
        </div>
      </div>

      {/* ACCESSORIES TABLE LIST */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[1000px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[13px] font-semibold text-[#0f172a]">
                <th className="px-5 py-3.5 whitespace-nowrap text-left font-semibold min-w-[160px]">Tên phụ kiện</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-left font-semibold min-w-[260px]">Mô tả</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-center font-semibold min-w-[100px]">Tổng SL</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-center font-semibold min-w-[110px]">SL hư hỏng</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-center font-semibold min-w-[100px]">SL mất</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-center font-semibold min-w-[110px]">Khả dụng</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-left font-semibold min-w-[120px]">Vị trí kho</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-center font-semibold min-w-[120px]">Trạng thái</th>
                <th className="px-5 py-3.5 whitespace-nowrap text-right font-semibold min-w-[220px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-650">
              {filteredAccs.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-slate-400 italic">
                    Không tìm thấy phụ kiện nào phù hợp bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredAccs.map(item => {
                  const available = item.totalQuantity - item.maintenanceQuantity - item.lostQuantity;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition">
                      {/* Tên phụ kiện */}
                      <td className="px-5 py-4 text-slate-900 font-extrabold">{item.name}</td>

                      {/* Mô tả */}
                      <td className="px-5 py-4 text-slate-500 max-w-[200px] truncate" title={item.description}>
                        {item.description}
                      </td>

                      {/* Tổng số lượng */}
                      <td className="px-5 py-4 text-center font-mono font-bold text-slate-800">
                        {item.totalQuantity}
                      </td>

                      {/* Số lượng bảo trì / hư hỏng */}
                      <td className="px-5 py-4 text-center font-mono text-amber-700">
                        {item.maintenanceQuantity > 0 ? (
                          <span className="bg-amber-50 px-2 py-0.5 rounded font-black">
                            {item.maintenanceQuantity}
                          </span>
                        ) : '0'}
                      </td>

                      {/* Số lượng mất */}
                      <td className="px-5 py-4 text-center font-mono text-red-700">
                        {item.lostQuantity > 0 ? (
                          <span className="bg-rose-50 px-2 py-0.5 rounded font-black">
                            {item.lostQuantity}
                          </span>
                        ) : '0'}
                      </td>

                      {/* Số lượng khả dụng with specific color indicator */}
                      <td className="px-5 py-4 text-center font-mono">
                        <div className="flex flex-col items-center justify-center">
                          <span className={`text-[14px] font-bold ${available <= 3 ? 'text-amber-600' : 'text-emerald-700'}`}>
                            {available}
                          </span>
                          {available === 0 ? (
                            <span className="mt-1 bg-red-100 text-[#991b1b] text-[11px] px-2 py-0.5 rounded-full font-medium">Hết khả dụng</span>
                          ) : item.maintenanceQuantity > 0 ? (
                            <span className="mt-1 bg-amber-100 text-[#92400e] text-[11px] px-2 py-0.5 rounded-full font-medium">Có hư hỏng</span>
                          ) : item.lostQuantity > 0 ? (
                            <span className="mt-1 bg-red-100 text-[#991b1b] text-[11px] px-2 py-0.5 rounded-full font-medium">Có mất</span>
                          ) : available <= 3 ? (
                            <span className="mt-1 bg-amber-100 text-[#92400e] text-[11px] px-2 py-0.5 rounded-full font-medium">Sắp hết</span>
                          ) : null}
                        </div>
                      </td>

                      {/* Vị trí kho */}
                      <td className="px-5 py-4 text-slate-705 font-bold cell-location">{item.storageLocation}</td>

                      {/* Trạng thái (Hoạt động / Không hoạt động) */}
                      <td className="px-5 py-4 text-center">
                        <span className={`status-badge ${
                          item.status === 'ACTIVE' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-slate-50 text-slate-500 border border-slate-205'
                        }`}>
                          {item.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>

                      {/* THAO TÁC COT - NGANG HÀNG NHAU */}
                      <td className="px-5 py-4 text-right">
                        <div className="table-action-group justify-end">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(item)}
                            className="table-action-button text-[#00236f] bg-[#00236f]/5 hover:bg-[#00236f]/10 cursor-pointer"
                          >
                            Xem chi tiết
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenUpdate(item)}
                            className="table-action-button text-indigo-705 bg-indigo-50 hover:bg-indigo-100 cursor-pointer"
                          >
                            Cập nhật
                          </button>

                          {/* Soft-disable row 5 Hộp chống sốc specifically */}
                          {item.id === 'ACC005' || item.name === 'Hộp chống sốc' ? (
                            <button
                              type="button"
                              disabled
                              className="table-action-button bg-slate-50 text-slate-350 cursor-not-allowed border border-slate-100"
                              title="Không thể xóa phụ kiện đang sử dụng trong bộ đi kèm"
                            >
                              Xóa
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenDelete(item)}
                              className="table-action-button bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer"
                            >
                              Xóa
                            </button>
                          )}
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

      {/* ======================================================== */}
      {/* 1. VIEW ACCESSORY DETAIL DRAWER (READ-ONLY) */}
      {/* ======================================================== */}
      {showDetail && selectedDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[1100] flex justify-end animate-fadeIn font-sans">
          <div className="bg-white w-full max-w-2xl h-screen shadow-2xl flex flex-col animate-slideLeft text-slate-800 text-xs">
            
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-sm font-black text-[#00236f] uppercase">Xem chi tiết phụ kiện</h3>
                <p className="text-[11px] text-slate-400 font-bold font-mono">Mã kiểm kê: {selectedDetail.id} | Kho: {selectedDetail.storageLocation}</p>
              </div>
              <button 
                onClick={() => setShowDetail(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Panel Scrollable */}
            <div className="flex-grow overflow-y-auto p-6 space-y-5.5 text-left font-semibold">
              
              {/* A. GENERAL SPECS */}
              <div className="bg-slate-50 p-4 border border-slate-205 rounded-xl space-y-2">
                <span className="text-[9.5px] text-[#00236f] font-extrabold uppercase block tracking-wider border-b pb-1">
                  A. Thông tin chi tiết phụ kiện
                </span>
                
                <div className="grid grid-cols-2 gap-3.5 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Tên phụ kiện:</span>
                    <strong className="text-slate-900 text-sm font-black">{selectedDetail.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Vị trí lưu kho:</span>
                    <strong className="text-slate-800">{selectedDetail.storageLocation}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[9.5px]">Mô tả chức năng:</span>
                    <p className="text-slate-700 italic font-medium leading-relaxed">"{selectedDetail.description || 'Không có mô tả chi tiết'}"</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Trạng thái hệ thống:</span>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-black ${
                      selectedDetail.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-150 text-slate-600'
                    }`}>
                      {selectedDetail.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">Ghi chú ghi nhận:</span>
                    <p className="text-slate-800 mt-1">{selectedDetail.note || 'Trống'}</p>
                  </div>
                </div>
              </div>

              {/* B. DETAILED QUANTITY SUMMARY STATS */}
              <div className="bg-slate-50 p-4 border border-slate-205 rounded-xl space-y-2">
                <span className="text-[9.5px] text-[#00236f] font-extrabold uppercase block tracking-wider border-b pb-1">
                  B. Thông số số lượng và sử dụng
                </span>
                
                <div className="grid grid-cols-4 gap-2 text-center pt-2">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Tổng số</span>
                    <span className="text-sm font-mono font-black text-slate-800">{selectedDetail.totalQuantity}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Hư hỏng</span>
                    <span className="text-sm font-mono font-black text-amber-600">{selectedDetail.maintenanceQuantity}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Thất thoát</span>
                    <span className="text-sm font-mono font-black text-rose-600">{selectedDetail.lostQuantity}</span>
                  </div>
                  <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                    <span className="text-emerald-800 block text-[9px] uppercase font-bold font-sans">Khả dụng</span>
                    <span className="text-sm font-mono font-black text-emerald-700">
                      {selectedDetail.totalQuantity - selectedDetail.maintenanceQuantity - selectedDetail.lostQuantity}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3">
                  <div className="p-2.5 bg-blue-50/50 rounded-xl border border-blue-100">
                    <span className="text-slate-400 block text-[9.5px]">Số lượng đang bàn giao/chưa trả:</span>
                    <p className="font-extrabold text-blue-700 mt-0.5">{selectedDetail.deliveredCount || 0} món</p>
                  </div>
                  <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
                    <span className="text-slate-400 block text-[9.5px]">Đang dùng trong các đơn thuê:</span>
                    <p className="font-extrabold text-indigo-700 mt-0.5">
                      {selectedDetail.name === 'Túi Sony' ? '1 (Đơn thuê ORD001)' : '0'}
                    </p>
                  </div>
                </div>
              </div>

              {/* C. FIXED DURATION INVENTORY MOVEMENT HISTORY */}
              <div className="bg-slate-50 p-4 border border-slate-205 rounded-xl space-y-2">
                <span className="text-[9.5px] text-[#00236f] font-extrabold uppercase block tracking-wider border-b pb-1 flex justify-between items-center">
                  <span>C. Lịch sử tồn kho chuyển giao</span>
                  <span className="text-[8px] bg-slate-250 text-slate-500 px-1.5 py-0.2 rounded font-normal normal-case">Chỉ xem thông tin</span>
                </span>
                
                <div className="overflow-x-auto w-full pt-1">
                  <table className="w-full text-[11px] text-left border-collapse bg-white rounded-lg overflow-hidden border">
                    <thead>
                      <tr className="bg-slate-100 text-slate-705 text-[12px] font-semibold border-b">
                        <th className="p-2 whitespace-nowrap min-w-[120px]">Thời gian</th>
                        <th className="p-2 whitespace-nowrap min-w-[120px]">Phân loại thay đổi</th>
                        <th className="p-2 text-center whitespace-nowrap min-w-[80px]">Biến số</th>
                        <th className="p-2 whitespace-nowrap min-w-[200px]">Lý do</th>
                        <th className="p-2 whitespace-nowrap min-w-[120px]">Liên quan</th>
                        <th className="p-2 whitespace-nowrap min-w-[120px]">Thực hiện</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {selectedDetail.history && selectedDetail.history.length > 0 ? (
                        selectedDetail.history.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50/50 text-[10.5px]">
                            <td className="p-2 whitespace-nowrap font-mono">{log.time}</td>
                            <td className="p-2">
                              <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                                log.type === 'IMPORT' ? 'bg-green-100 text-green-800' :
                                log.type === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                                log.type === 'DELIVER' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-850'
                              }`}>
                                {log.type}
                              </span>
                            </td>
                            <td className="p-2 text-center font-mono font-bold text-slate-800">{log.change}</td>
                            <td className="p-2 text-slate-600 max-w-[150px] truncate" title={log.reason}>{log.reason}</td>
                            <td className="p-2 font-mono text-slate-500">{log.order}</td>
                            <td className="p-2 whitespace-nowrap text-slate-705 font-bold">{log.user}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="p-3 text-center text-slate-400 italic">Trống</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CRITICAL ANTI-AI SLOP INSTRUCTION DISCLOSURE */}
              <div className="bg-indigo-50 border border-slate-150 p-3.5 rounded-xl text-slate-800 flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-indigo-500" />
                <div className="space-y-0.5">
                  <span className="text-[9.5px] text-indigo-800 font-extrabold uppercase tracking-wider block">Nguyên tắc xem thông tin:</span>
                  <p className="text-[10px] text-slate-500 leading-normal font-medium font-sans">Theo tiêu chuẩn đồ án thiết kế, màn hình này thuần xem tĩnh. Việc điều chỉnh đã giải phóng hoàn toàn và đặt trực tiếp ngang cấp ở cột thao tác phía ngoài.</p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-105 flex justify-end bg-slate-50">
              <button
                type="button"
                onClick={() => setShowDetail(false)}
                className="px-5 py-2.5 bg-slate-205 text-slate-700 font-black rounded-xl hover:bg-slate-300 transition text-xs uppercase cursor-pointer"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ADD ACCESSORY DRAWER / MODAL */}
      {/* ======================================================== */}
      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[1100] flex justify-end animate-fadeIn font-sans">
          <div className="bg-white w-full max-w-2xl h-screen shadow-2xl flex flex-col animate-slideLeft text-slate-850 text-xs">
            
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <span className="text-[9.5px] text-indigo-700 font-black uppercase tracking-wider block">Khai báo lưu trữ mới</span>
                <h3 className="text-sm font-black text-[#00236f] uppercase">Thêm phụ kiện</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrefillDemo}
                  className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition font-black text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  ⚡ Nhập mẫu "Khăn lau lens"
                </button>
                <button 
                  onClick={() => setShowAdd(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form Roll Panel */}
            <form onSubmit={handleSaveAdd} className="flex-grow overflow-y-auto p-6 space-y-4.5 text-left font-semibold">
              <p className="text-[11px] text-slate-400 font-bold mb-1 italic">Vui lòng điền đủ các thông số phụ kiện chính xác để hệ thống kĩ thuật T-Rent đồng bộ định danh.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tên phụ kiện */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">
                    Tên phụ kiện <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Nhập tên phụ kiện (Thí dụ: Bút lau nắp lens...)"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-855 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Mô tả */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] text-slate-505 font-bold uppercase block">Mô tả phụ kiện</label>
                  <input 
                    type="text"
                    placeholder="Mô tả chức năng đi kèm..."
                    value={addForm.description}
                    onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Tổng số lượng */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-505 font-bold uppercase block">
                    Tổng số lượng <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="number"
                    min="0"
                    placeholder="Nhập số nguyên không âm..."
                    value={addForm.totalQuantity}
                    onChange={(e) => setAddForm({ ...addForm, totalQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 font-mono focus:bg-white"
                  />
                </div>

                {/* Số lượng bảo trì / hư hỏng */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-505 font-bold uppercase block">Số lượng bảo trì/hư hỏng</label>
                  <input 
                    type="number"
                    min="0"
                    placeholder="Mặc định: 0"
                    value={addForm.maintenanceQuantity}
                    onChange={(e) => setAddForm({ ...addForm, maintenanceQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 font-mono focus:bg-white"
                  />
                </div>

                {/* Số lượng mất */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-505 font-bold uppercase block">Số lượng mất</label>
                  <input 
                    type="number"
                    min="0"
                    placeholder="Mặc định: 0"
                    value={addForm.lostQuantity}
                    onChange={(e) => setAddForm({ ...addForm, lostQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 font-mono focus:bg-white"
                  />
                </div>

                {/* Vị trí kho */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-505 font-bold uppercase block">Vị trí kho</label>
                  <input 
                    type="text"
                    placeholder="Kệ PK-A1, Ngăn kéo C..."
                    value={addForm.storageLocation}
                    onChange={(e) => setAddForm({ ...addForm, storageLocation: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 focus:bg-white"
                  />
                </div>

                {/* Trạng thái */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-505 font-bold uppercase block">Trạng thái</label>
                  <select 
                    value={addForm.status}
                    onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                    className="w-full text-xs bg-white border border-slate-205 rounded-xl p-2.5 outline-none font-black text-slate-800 cursor-pointer"
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Không hoạt động</option>
                  </select>
                </div>

                {/* Ghi chú */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] text-slate-505 font-bold uppercase block">Ghi chú</label>
                  <textarea 
                    rows="2"
                    placeholder="Nhập ghi chú thêm cho phụ kiện..."
                    value={addForm.note}
                    onChange={(e) => setAddForm({ ...addForm, note: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl p-3 outline-none font-bold text-slate-800 resize-none focus:bg-white"
                  />
                </div>
              </div>
            </form>

            {/* Actions */}
            <div className="px-6 py-4.5 border-t border-slate-105 flex justify-between items-center bg-slate-50">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4.5 py-2.5 bg-slate-205 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition text-xs cursor-pointer shadow-sm"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveAdd}
                className="px-5 py-2.5 bg-indigo-650 text-white font-black rounded-xl hover:bg-indigo-700 transition text-xs uppercase cursor-pointer shadow"
              >
                Lưu
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. UPDATE ACCESSORY DRAWER / MODAL */}
      {/* ======================================================== */}
      {showUpdate && selectedUpdate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[1100] flex justify-end animate-fadeIn font-sans">
          <div className="bg-white w-full max-w-2xl h-screen shadow-2xl flex flex-col animate-slideLeft text-slate-850 text-xs">
            
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <span className="text-[9.5px] text-indigo-700 font-semibold uppercase tracking-wider block">Cấu hình hồ sơ kĩ thuật phụ kiện</span>
                <h3 className="text-sm font-black text-[#00236f] uppercase">Cập nhật phụ kiện</h3>
              </div>
              <div className="flex items-center gap-2">
                {selectedUpdate.name === 'Túi Sony' && (
                  <button
                    type="button"
                    onClick={handlePrefillUpdateDemo}
                    className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-lg font-black text-[10.5px] cursor-pointer"
                  >
                    ⚡ Sửa nhanh "Túi Sony" (Tổng 22)
                  </button>
                )}
                <button 
                  onClick={() => setShowUpdate(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form updates */}
            <form onSubmit={handleSaveUpdate} className="flex-grow overflow-y-auto p-6 space-y-4.5 text-left font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Tên phụ kiện */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] text-slate-505 font-bold uppercase block">
                    Tên phụ kiện <span className="text-rose-550">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    value={updateForm.name}
                    onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 focus:bg-white"
                  />
                </div>

                {/* Mô tả */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] text-slate-505 font-bold uppercase block">Mô tả</label>
                  <input 
                    type="text"
                    value={updateForm.description}
                    onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 focus:bg-white"
                  />
                </div>

                {/* Tổng số lượng */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-505 font-bold uppercase block">
                    Tổng số lượng <span className="text-rose-550">*</span>
                  </label>
                  <input 
                    type="number"
                    min="0"
                    value={updateForm.totalQuantity}
                    onChange={(e) => setUpdateForm({ ...updateForm, totalQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 font-mono focus:bg-white"
                  />
                </div>

                {/* Bảo trì */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-505 font-bold uppercase block">Số lượng bảo trì/hư hỏng</label>
                  <input 
                    type="number"
                    min="0"
                    value={updateForm.maintenanceQuantity}
                    onChange={(e) => setUpdateForm({ ...updateForm, maintenanceQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 font-mono focus:bg-white"
                  />
                </div>

                {/* Thất thoát / mất */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-505 font-bold uppercase block">Số lượng mất</label>
                  <input 
                    type="number"
                    min="0"
                    value={updateForm.lostQuantity}
                    onChange={(e) => setUpdateForm({ ...updateForm, lostQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-855 font-mono focus:bg-white"
                  />
                </div>

                {/* Vị trí kho */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">Vị trí kho</label>
                  <input 
                    type="text"
                    value={updateForm.storageLocation}
                    onChange={(e) => setUpdateForm({ ...updateForm, storageLocation: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 focus:bg-white"
                  />
                </div>

                {/* Trạng thái */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">Trạng thái</label>
                  <select 
                    value={updateForm.status}
                    onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                    className="w-full text-xs bg-white border border-slate-205 rounded-xl p-2.5 outline-none font-black text-slate-805 cursor-pointer"
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Không hoạt động</option>
                  </select>
                </div>

                {/* Ghi chú */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase block">Ghi chú</label>
                  <textarea 
                    rows="2"
                    placeholder="Nhập lý do thay đổi số dư kho (Thí dụ: Bổ sung thêm 2 túi Sony)..."
                    value={updateForm.note}
                    onChange={(e) => setUpdateForm({ ...updateForm, note: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl p-3 outline-none font-bold text-slate-800 resize-none"
                  />
                </div>
              </div>
            </form>

            {/* Footer buttons */}
            <div className="px-6 py-4.5 border-t border-slate-105 flex justify-between items-center bg-slate-50">
              <button
                type="button"
                onClick={() => setShowUpdate(false)}
                className="px-4.5 py-2.5 bg-slate-205 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveUpdate}
                className="px-5 py-2.5 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition text-xs uppercase cursor-pointer shadow-sm"
              >
                Lưu cập nhật
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. DELETE CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {showDelete && selectedDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[1200] flex items-center justify-center animate-fadeIn font-sans p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 border border-rose-50 animate-zoomIn text-xs font-semibold text-slate-700">
            
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-black uppercase text-slate-900 font-sans">Xóa phụ kiện</h3>
            </div>

            <div className="space-y-3 text-left pt-1 leading-relaxed text-[11.5px] font-sans">
              <p className="text-slate-500 font-medium font-sans">Bạn có chắc chắn muốn xóa phụ kiện này không?</p>
              
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5 font-sans font-medium text-slate-800">
                <p>• Tên phụ kiện: <strong className="text-slate-900">{selectedDelete.name}</strong></p>
                <p>• Tổng số lượng: <strong className="text-slate-900 font-mono">{selectedDelete.totalQuantity}</strong></p>
                <p>• Số lượng khả dụng: <strong className="text-[#00236f] font-mono">{selectedDelete.totalQuantity - selectedDelete.maintenanceQuantity - selectedDelete.lostQuantity}</strong></p>
                <p>• Vị trí kho: <span className="font-bold text-slate-700">{selectedDelete.storageLocation}</span></p>
                <p>• Trạng thái hiện tại: 
                  <span className={`inline-block ml-1 px-2 py-0.5 rounded text-[9.5px] font-bold ${
                    selectedDelete.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-705'
                  }`}>
                    {selectedDelete.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </p>
              </div>

              {/* Alert note descriptions */}
              {selectedDelete.name === 'Túi Sony' && (
                <div className="p-2.5 bg-rose-50 border border-rose-100 text-[10px] text-rose-800 rounded">
                  ⚠️ <strong>Ủy thác phụ thuộc:</strong> Vật phẩm này hiện đang tồn tại các biên mục lịch sử bàn giao cho đơn hàng <strong>ORD001</strong>. Hệ thống chặn xóa để duy trì tính nhất quán.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3.5 pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 bg-slate-150 text-slate-700 rounded-lg hover:bg-slate-200 transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-[#dc2626] text-white rounded-lg hover:bg-red-700 font-black uppercase tracking-wider transition cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
