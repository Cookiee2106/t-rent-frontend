import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  Wrench, 
  AlertOctagon, 
  Boxes,
  ArrowLeft,
  Settings,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Barcode,
  History,
  FileText
} from 'lucide-react';

const INITIAL_SERIAL_ASSETS = [
  { id: 'AST0401', name: 'Body Sony Alpha A7 IV', model: 'Sony Alpha A7 IV', category: 'Máy ảnh', brand: 'Sony', sn: 'SN-A74-99201', location: 'Kệ 02-A', currentLoc: 'Kệ 02-A', status: 'available', statusLabel: 'Sẵn sàng', condition: '98% Mới, Cảm biến sạch bụi, cơ chế SteadyShot tốt', rentedCount: 49, maintThreshold: 50, history: [
    { time: '12/06/2026', action: 'Bảo dưỡng định kỳ an toàn', user: 'Lê Minh (Kỹ thuật)' },
    { time: '10/05/2026', action: 'Bàn giao hoàn trả hợp đồng TR-ORD-055', user: 'Nguyễn Văn B (Vận hành)' }
  ] },
  { id: 'AST0402', name: 'Body Sony Alpha A7 IV', model: 'Sony Alpha A7 IV', category: 'Máy ảnh', brand: 'Sony', sn: 'SN-A74-55102', location: 'Kệ 02-A', currentLoc: 'Đang đi cho thuê', status: 'rented', statusLabel: 'Đang thuê', condition: '95% Mới, Trầy xước nhẹ bọc cao su tay cầm', rentedCount: 65, maintThreshold: 80, history: [
    { time: '14/06/2026', action: 'Bàn giao thiết bị đơn TR-ORD-012', user: 'Lê Văn C (Vận hành)' }
  ] },
  { id: 'AST0403', name: 'Canon EOS R6 Mark II', model: 'Canon EOS R6 Mark II', category: 'Máy ảnh', brand: 'Canon', sn: 'SN-R62-88001', location: 'Kệ 02-B', currentLoc: 'Khu sửa chữa tủ 3', status: 'maintenance', statusLabel: 'Bảo trì', condition: 'Cảm biến có vết mốc mỏng sâu', rentedCount: 12, maintThreshold: 30, history: [
    { time: '10/06/2026', action: 'Gởi yêu cầu bảo trì hỏng hóc phát sinh', user: 'Trần Văn Hoàng (Admin)' }
  ] }
];

const INITIAL_GENERIC_ACCESSORIES = [
  { id: 'ACC-M01', name: 'Pin Sony NP-FZ100 (Chính hãng)', description: 'Pin Lithium-Ion dung lượng 2280mAh cao cấp dành cho dòng Sony Alpha.', total: 24, available: 16, rented: 6, maintenance: 2, damaged: 0, shelf: 'Tủ 01-Hộp A', history: [
    { time: '16/06/2026', action: 'Nhập kho bổ sung 5 quả pin mới mua từ NPP', qty: '+5' },
    { time: '15/06/2026', action: 'Ghi nhận hư hỏng chai hụt pin sau 300 chu kỳ sạc', qty: '-1' }
  ] },
  { id: 'ACC-M02', name: 'Thẻ nhớ SanDisk SD Extreme Pro 128GB', description: 'Tốc độ đọc lên tới 200MB/s ghi 140MB/s, chuẩn V30 tối ưu ghi hình 4K.', total: 40, available: 22, rented: 14, maintenance: 3, damaged: 1, shelf: 'Tủ 01-Hộp B', history: [
    { time: '11/06/2026', action: 'Xuất kho bù tủ phụ kiện', qty: '-2' }
  ] }
];

export default function Inventory({ defaultTab = 'assets', onAddNotification, userRole = 'staff', onSwitchPage }) {
  const [activeTab, setActiveTab] = useState(defaultTab); // assets, accessories
  const [activeView, setActiveView] = useState('list'); // list, asset-detail, asset-add, asset-edit, accessory-detail, accessory-add, accessory-edit
  
  // Storage states
  const [assets, setAssets] = useState(INITIAL_SERIAL_ASSETS);
  const [accessories, setAccessories] = useState(INITIAL_GENERIC_ACCESSORIES);

  // Selected records
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedAccessory, setSelectedAccessory] = useState(null);

  // Form states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Asset Add/Edit Fields
  const [assetForm, setAssetForm] = useState({
    id: '', name: '', model: '', category: 'Máy ảnh', brand: 'Sony', sn: '', location: '', currentLoc: '', status: 'available', condition: 'Mới 100%', rentedCount: 0, maintThreshold: 50
  });

  // Accessory Add/Edit Fields
  const [accessoryForm, setAccessoryForm] = useState({
    id: '', name: '', description: '', total: 10, available: 10, rented: 0, maintenance: 0, damaged: 0, shelf: ''
  });

  // Inventory modal states
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [invNotes, setInvNotes] = useState('');
  const [invCondition, setInvCondition] = useState('');
  const [invStatus, setInvStatus] = useState('available');

  // Toast
  const [toast, setToast] = useState(null);
  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const notify = (msg) => {
    triggerToast(msg);
    if (onAddNotification) onAddNotification(msg);
  };

  // Switch layouts nicely
  const handleOpenAssetDetail = (ast) => {
    setSelectedAsset(ast);
    setActiveView('asset-detail');
  };

  const handleOpenAccessoryDetail = (acc) => {
    setSelectedAccessory(acc);
    setActiveView('accessory-detail');
  };

  const handleOpenAddAsset = () => {
    setAssetForm({
      id: 'AST' + (400 + assets.length + 1),
      name: '',
      model: 'Sony Alpha A7 IV',
      category: 'Máy ảnh',
      brand: 'Sony',
      sn: '',
      location: 'Kệ 02-C',
      currentLoc: 'Kệ 02-C',
      status: 'available',
      condition: '100% Mới khui tem dán kiểm định',
      rentedCount: 0,
      maintThreshold: 50
    });
    setActiveView('asset-add');
  };

  const handleOpenEditAsset = () => {
    setAssetForm({ ...selectedAsset });
    setActiveView('asset-edit');
  };

  const handleOpenAddAccessory = () => {
    setAccessoryForm({
      id: 'ACC-M0' + (accessories.length + 1),
      name: '',
      description: '',
      total: 10,
      available: 10,
      rented: 0,
      maintenance: 0,
      damaged: 0,
      shelf: 'Tủ phụ kiện 03'
    });
    setActiveView('accessory-add');
  };

  const handleOpenEditAccessory = () => {
    setAccessoryForm({ ...selectedAccessory });
    setActiveView('accessory-edit');
  };

  // Action Save Hooks
  const handleSaveAddAsset = (e) => {
    e.preventDefault();
    if (!assetForm.name.trim() || !assetForm.sn.trim()) {
      alert('Vui lòng điền đủ tên tài sản và số Serial vật lý!');
      return;
    }
    const newAst = {
      ...assetForm,
      statusLabel: 'Sẵn sàng',
      history: [{ time: new Date().toLocaleDateString('vi-VN'), action: 'Thêm mới vào hệ thống kiểm kê', user: 'Quản lý' }]
    };
    setAssets([newAst, ...assets]);
    setActiveView('list');
    notify(`Đã định danh và dán nhãn thành công thiết bị ${newAst.id} (${newAst.name})`);
  };

  const handleSaveEditAsset = (e) => {
    e.preventDefault();
    const updated = assets.map(a => a.id === assetForm.id ? {
      ...assetForm,
      statusLabel: assetForm.status === 'available' ? 'Sẵn sàng' : assetForm.status === 'rented' ? 'Đang thuê' : assetForm.status === 'maintenance' ? 'Bảo trì' : 'Lỗi hỏng'
    } : a);
    setAssets(updated);
    setSelectedAsset({
      ...assetForm,
      statusLabel: assetForm.status === 'available' ? 'Sẵn sàng' : assetForm.status === 'rented' ? 'Đang thuê' : assetForm.status === 'maintenance' ? 'Bảo trì' : 'Lỗi hỏng'
    });
    setActiveView('asset-detail');
    notify(`Đã cập nhật chi tiết thiết bị vật lý ${assetForm.id}`);
  };

  const handleDeleteAsset = (id) => {
    if (confirm(`Bạn có chắc chắn muốn XÓA vĩnh viễn thiết bị vật lý ${id} khởi tủ kho không?`)) {
      setAssets(assets.filter(a => a.id !== id));
      setActiveView('list');
      notify(`Đã xóa dứt điểm thiết bị ${id} khỏi hệ thống vận hành.`);
    }
  };

  const handleOpenInventoryCheck = () => {
    setInvNotes('');
    setInvCondition(selectedAsset.condition || 'Bình thường');
    setInvStatus(selectedAsset.status || 'available');
    setShowInventoryModal(true);
  };

  const handleSaveInventoryCheck = (e) => {
    e.preventDefault();
    if (!invCondition.trim()) {
      alert('Vui lòng nhập ghi nhận tình trạng vật lý hao mòn!');
      return;
    }
    
    const nextStatusLabel = invStatus === 'available' ? 'Sẵn sàng' : invStatus === 'rented' ? 'Đang thuê' : 'Bảo trì';
    const logAction = `Kiểm kê định kỳ ghi nhận: ${invNotes || 'Đã kiểm tra định kỳ'} - Hao mòn: ${invCondition}`;
    
    const updatedHistory = [
      {
        time: new Date().toLocaleDateString('vi-VN'),
        action: logAction,
        user: 'Trần Tú (Vận hành viên)'
      },
      ...selectedAsset.history
    ];
    
    const updated = {
      ...selectedAsset,
      condition: invCondition,
      status: invStatus,
      statusLabel: nextStatusLabel,
      history: updatedHistory
    };
    
    setAssets(assets.map(a => a.id === selectedAsset.id ? updated : a));
    setSelectedAsset(updated);
    setShowInventoryModal(false);
    notify(`Đã lưu biên bản kiểm kê thiết bị ${selectedAsset.id}`);
  };

  // Accessory Saves
  const handleSaveAddAccessory = (e) => {
    e.preventDefault();
    if (!accessoryForm.name.trim()) {
      alert('Vui lòng điền tên phụ kiện!');
      return;
    }
    const newAcc = {
      ...accessoryForm,
      history: [{ time: new Date().toLocaleDateString('vi-VN'), action: 'Khai báo lập mã SKU phụ kiện', qty: `+${accessoryForm.total}` }]
    };
    setAccessories([newAcc, ...accessories]);
    setActiveView('list');
    notify(`Đã lập mã SKU và chuyển kho thành công nhóm phụ kiện ${newAcc.name}`);
  };

  const handleSaveEditAccessory = (e) => {
    e.preventDefault();
    const updated = accessories.map(a => a.id === accessoryForm.id ? accessoryForm : a);
    setAccessories(updated);
    setSelectedAccessory(accessoryForm);
    setActiveView('accessory-detail');
    notify(`Đã cập nhật tồn kho SKU phụ kiện ${accessoryForm.name}`);
  };

  const handleDeleteAccessory = (id) => {
    if (confirm(`Bạn có chắc chắn muốn xóa mã phụ kiện ${id} khỏi tủ đồ?`)) {
      setAccessories(accessories.filter(a => a.id !== id));
      setActiveView('list');
      notify(`Đã loại bỏ mã SKU phụ kiện ${id} khỏi kệ.`);
    }
  };

  // Create Maintenance Order directly
  const handleTriggerMaintenance = (ast) => {
    if (confirm(`Đồng ý đưa thiết bị vật lý ${ast.id} chuyển sang kho nghiệp vụ BẢO TRÌ?`)) {
      const updated = assets.map(a => a.id === ast.id ? { ...a, status: 'maintenance', statusLabel: 'Bảo trì', currentLoc: 'Phòng kỹ thuật lầu 1' } : a);
      setAssets(updated);
      setSelectedAsset({ ...selectedAsset, status: 'maintenance', statusLabel: 'Bảo trì', currentLoc: 'Phòng kỹ thuật lầu 1' });
      notify(`Đã thiết lập trạng thái BẢO TRÌ và chuyển khu kỹ thuật cho thiết bị ${ast.id}`);
    }
  };

  // Filter computations
  const filteredAssets = assets.filter(a => {
    const s = searchQuery.toLowerCase();
    const matchesSearch = a.name.toLowerCase().includes(s) || a.id.toLowerCase().includes(s) || a.sn.toLowerCase().includes(s);
    const matchesStatus = statusFilter === '' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredAccessories = accessories.filter(a => {
    return a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* Toast box */}
      {toast && (
        <div className="fixed top-20 right-4 bg-slate-900 border border-slate-705 text-white px-5 py-3 rounded-xl shadow-2xl z-50 animate-bounce flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#fea619]" />
          <span className="text-xs font-black">{toast}</span>
        </div>
      )}

      {/* VIEW: 1. LIST VIEW FOR ASSETS & ACCESSORIES */}
      {activeView === 'list' && (
        <>
          {/* Header page title */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
            <div>
              <h2 className="text-xl font-bold text-[#00236f] flex items-center gap-2">
                <Boxes className="w-5 h-5 text-indigo-650" />
                {activeTab === 'assets' ? 'QUẢN LÝ THIẾT BỊ VẬT LÝ' : 'QUẢN LÝ PHỤ KIỆN TỒN KHO'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {activeTab === 'assets' 
                  ? 'Khai bám gán tem serial cho từng máy cụ thể, kiểm soát vị trí tủ kho vật lý và trạng thái hoạt động.'
                  : 'Sổ sách theo dõi tổng số lượng, khấu hao thất lạc các gói pin phụ trợ, chân đỡ, cáp kết nối.'}
              </p>
            </div>

            {/* Top ADD primary buttons */}
            {activeTab === 'assets' ? (
              userRole === 'staff' && (
                <button 
                  onClick={handleOpenAddAsset}
                  className="px-4 py-2.5 bg-[#00236f] hover:bg-[#fea619] text-white hover:text-slate-950 text-xs font-black rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  
                  THÊM THIẾT BỊ VẬT LÝ MỚI
                </button>
              )
            ) : (
              <button 
                onClick={handleOpenAddAccessory}
                className="px-4 py-2.5 bg-[#00236f] hover:bg-[#fea619] text-white hover:text-slate-950 text-xs font-black rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                
                THÊM MÃ PHỤ KIỆN TỔN HỢP
              </button>
            )}
          </div>

          {/* Core Tabs menu */}
          <div className="flex border-b border-slate-200 gap-8 text-xs font-bold leading-none">
            <button 
              onClick={() => { setActiveTab('assets'); setSearchQuery(''); setStatusFilter(''); }}
              className={`pb-3 border-b-2 px-1 transition duration-200 cursor-pointer ${
                activeTab === 'assets' ? 'border-[#00236f] text-[#00236f] font-black' : 'border-transparent text-slate-400'
              }`}
            >
              🛠️ 1. Thiết bị vật lý ({assets.length} máy)
            </button>
            <button 
              onClick={() => { setActiveTab('accessories'); setSearchQuery(''); setStatusFilter(''); }}
              className={`pb-3 border-b-2 px-1 transition duration-200 cursor-pointer ${
                activeTab === 'accessories' ? 'border-[#00236f] text-[#00236f] font-black' : 'border-transparent text-slate-400'
              }`}
            >
              🔋 2. Danh mục Phụ kiện ({accessories.length} dòng SKU)
            </button>
          </div>

          {/* Search boxes */}
          <div className="bg-white p-4.5 border border-slate-200 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between text-xs font-semibold">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'assets' ? "Tìm mã máy cụ thể, số sê-ri máy..." : "Tìm tên linh kiện phụ trợ..."}
                className="w-full bg-slate-50 border border-slate-150 rounded-lg pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            {activeTab === 'assets' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-48 bg-white border border-slate-200 px-3 py-2 rounded-lg cursor-pointer text-xs"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="available">Sẵn sàng vận hành</option>
                <option value="rented">Đang đi cho thuê</option>
                <option value="maintenance">Đang bảo trì kỳ sạch</option>
              </select>
            )}
          </div>

          {/* RENDER TABLE: 1. PHYSICAL ASSETS */}
          {activeTab === 'assets' ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto w-full text-xs">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="px-6 py-4">Mã thiết bị</th>
                    <th className="px-6 py-4">Tên mẫu thiết bị</th>
                    <th className="px-6 py-4 font-mono">Số Serial</th>
                    <th className="px-6 py-4">Trạng thái hoạt động</th>
                    <th className="px-6 py-4">Vị trí trong kho</th>
                    <th className="px-6 py-4 text-right">Xem chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-650">
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((ast) => (
                      <tr key={ast.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4 font-mono font-black text-[#00236f]">{ast.id}</td>
                        <td className="px-6 py-4">
                          <div>
                            <span className="font-bold text-slate-800 block text-sm">{ast.model || ast.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{ast.category} • {ast.brand}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-800">{ast.sn}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded text-[9.5px] font-black uppercase text-center border ${
                            ast.status === 'available' 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : ast.status === 'rented'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {ast.statusLabel || (ast.status === 'available' ? 'Sẵn sàng' : ast.status === 'rented' ? 'Đang thuê' : 'Bảo trì')}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-500">{ast.location}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleOpenAssetDetail(ast)}
                            className="px-4 py-1.5 border border-[#00236f] text-[#00236f] hover:bg-blue-50 font-black rounded-lg text-[10.5px] transition cursor-pointer uppercase"
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-400 italic font-semibold">
                        ⚠️ Không tìm thấy thiết bị vật lý nào khớp bộ lọc.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            // RENDER TABLE: 2. ACCESSORIES
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto w-full text-xs">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="px-6 py-4">Mã SKU sỉ</th>
                    <th className="px-6 py-4 min-w-[150px]">Tên phụ kiện</th>
                    <th className="px-6 py-4 text-center">Mức tổng tồn</th>
                    <th className="px-6 py-4 text-center text-green-700">Khả dụng</th>
                    <th className="px-6 py-4 text-center text-blue-700">Đang thuê</th>
                    <th className="px-6 py-4 text-center text-amber-700">Bảo dưỡng</th>
                    <th className="px-6 py-4 text-center text-red-600">Thất lạc/Hỏng</th>
                    <th className="px-6 py-4">Vị trí tủ kệ</th>
                    <th className="px-6 py-4 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                  {filteredAccessories.length > 0 ? (
                    filteredAccessories.map((acc) => (
                      <tr key={acc.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4 font-mono font-black text-slate-700">{acc.id}</td>
                        <td className="px-6 py-4">
                          <div>
                            <span className="font-bold text-slate-800 block">{acc.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{acc.category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-black text-slate-900">{acc.total}</td>
                        <td className="px-6 py-4 text-center text-green-600 font-black bg-green-50/20">{acc.available}</td>
                        <td className="px-6 py-4 text-center text-blue-600 font-bold">{acc.rented}</td>
                        <td className="px-6 py-4 text-center text-amber-500 font-bold">{acc.maintenance}</td>
                        <td className="px-6 py-4 text-center text-red-700 font-bold">{acc.damaged}</td>
                        <td className="px-6 py-4 font-semibold text-slate-500">{acc.shelf}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleOpenAccessoryDetail(acc)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-[#fea619] text-slate-700 hover:text-slate-950 font-black rounded text-[10px] transition cursor-pointer"
                          >
                            XEM CHI TIẾT
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-6 py-12 text-center text-slate-400 italic font-semibold">
                        ⚠️ Không tìm thấy phụ kiện tồn kho nào phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* VIEW: 2. DETAILED SCREEN - PHYSICAL ASSET */}
      {activeView === 'asset-detail' && selectedAsset && (
        <div className="space-y-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
          
          {/* Breadcrumb nav top banner */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <button 
              onClick={() => setActiveView('list')}
              className="text-xs font-black text-slate-500 hover:text-slate-990 flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              
              QUAY LẠI DANH SÁCH THIẾT BỊ
            </button>
            <span className="font-mono text-xs text-slate-400 font-bold uppercase">MÁY ẢNH ĐỊNH DANH</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
            
            {/* Standard Profile Data Column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] bg-indigo-650 text-white font-mono px-2.5 py-1 rounded font-bold uppercase block">{selectedAsset.id}</span>
                <span className={`inline-flex px-3 py-1 rounded text-[10px] font-black uppercase border leading-none ${
                  selectedAsset.status === 'available' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {selectedAsset.statusLabel}
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900 leading-none">{selectedAsset.name}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-0.5">
                  <span className="text-[10.5px] text-slate-400 font-bold block">Phiên bản / Model chính:</span>
                  <span className="text-slate-800 text-xs font-black block">{selectedAsset.model}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10.5px] text-slate-400 font-bold block">Số Serial dán tem gốc:</span>
                  <span className="text-slate-800 font-mono text-xs font-black block">{selectedAsset.sn}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10.5px] text-slate-400 font-bold block">Vị trí tủ cất kho vật lý:</span>
                  <span className="text-slate-800 text-xs font-black block">{selectedAsset.location}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10.5px] text-slate-400 font-bold block">Vị trí thực tế hiện tại:</span>
                  <span className="text-indigo-600 text-xs font-black block">{selectedAsset.currentLoc}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10.5px] text-slate-400 font-bold block">Tổng số lần đã cho thuê:</span>
                  <span className="text-slate-800 text-xs font-black block">{selectedAsset.rentedCount} lần thuê</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10.5px] text-slate-400 font-bold block">Số lần cho thuê giới hạn bảo dưỡng:</span>
                  <span className="text-amber-600 text-xs font-black block">Cứ {selectedAsset.maintThreshold} lần thuê cần bảo trì</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl mt-4">
                <span className="text-[10px] font-black text-slate-800 uppercase block mb-1">Hiện trạng tình trạng vật lý:</span>
                <p className="text-xs text-slate-600 block leading-relaxed font-semibold">"{selectedAsset.condition}"</p>
              </div>

            </div>

            {/* Sidebar quick metadata actions */}
            <div className="p-4.5 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">HÀNH ĐỘNG HẠN CHẾ SỬ DỤNG</h4>
                <p className="text-[10.5px] text-slate-500 font-semibold mb-4 leading-relaxed font-sans">
                  Các nút thao tác vật lý, bàn giao, kiểm kê hao mòn định kỳ, hoặc xóa lưu kho.
                </p>
              </div>

              <div className="space-y-2.5 font-sans">
                {/* 1. Cập nhật thiết bị vật lý (mọi vai trò) */}
                <button 
                  onClick={handleOpenEditAsset}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold rounded-lg transition duration-200 cursor-pointer text-center uppercase"
                >
                  📝 CẬP NHẬT THIẾT BI VẬT LÝ
                </button>

                {/* 2. Bàn giao thiết bị (Chỉ Nhân viên) */}
                {userRole === 'staff' && (
                  <button 
                    onClick={() => {
                      if (onSwitchPage) {
                        onSwitchPage('admin-orders');
                        notify("Đã điều hướng sang trang Đơn hàng để tiến hành Bàn giao thiết bị.");
                      } else {
                        alert("Chuyển trang Đơn hàng");
                      }
                    }}
                    className="w-full py-2.5 bg-[#00236f] hover:bg-blue-900 text-white text-[11px] font-bold rounded-lg transition duration-200 cursor-pointer text-center uppercase"
                  >
                    🤝 BÀN GIAO THIẾT BỊ
                  </button>
                )}

                {/* 3. Kiểm kê thiết bị (Chỉ Nhân viên) */}
                {userRole === 'staff' && (
                  <button 
                    onClick={handleOpenInventoryCheck}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded-lg transition duration-200 cursor-pointer text-center uppercase"
                  >
                    📋 KIỂM KÊ THIẾT BỊ
                  </button>
                )}

                {selectedAsset.status !== 'maintenance' && (
                  <button 
                    onClick={() => handleTriggerMaintenance(selectedAsset)}
                    className="w-full py-2.5 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 text-[11px] font-bold rounded-lg transition duration-200 cursor-pointer text-center uppercase"
                  >
                    🛠️ TẠO HỒ SƠ BẢO TRÌ ĐỊNH KỲ
                  </button>
                )}

                {/* 4. Xóa thiết bị vật lý (Chỉ Quản trị viên) */}
                {userRole === 'admin' && (
                  <button 
                    onClick={() => handleDeleteAsset(selectedAsset.id)}
                    className="w-full py-2.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-[11px] font-bold rounded-lg transition duration-200 cursor-pointer text-center uppercase flex items-center justify-center gap-1.5"
                  >
                    ❌ XÓA THIẾT BỊ VẬT LÝ
                  </button>
                )}
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3 font-sans">
            <h4 className="text-[10.5px] font-black text-slate-800 uppercase flex items-center gap-1">
              <History className="w-4 h-4 text-slate-400" />
              Lịch sử bảo trì (bảng chi tiết):
            </h4>
            
            <div className="bg-slate-50 border border-slate-150 rounded-xl overflow-x-auto w-full mt-2">
              <table className="w-full min-w-[500px] text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-150 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="px-4 py-2.5">Ngày bảo trì</th>
                    <th className="px-4 py-2.5">Nội dung bảo trì</th>
                    <th className="px-4 py-2.5 text-right">Chi phí</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-medium text-slate-650">
                  {selectedAsset.history.length > 0 ? (
                    selectedAsset.history.map((h, i) => (
                      <tr key={i} className="hover:bg-slate-100/50 transition bg-white">
                        <td className="px-4 py-2.5 font-mono text-slate-400 font-bold">{h.time}</td>
                        <td className="px-4 py-2.5 text-slate-800 font-bold">{h.action}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-teal-700 font-semibold">
                          {h.cost || '250.000 đ'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-4 py-6 text-center text-slate-400 italic">
                        Chưa có lịch sử ghi nhận bảo trì.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* VIEW: 3. DETAILED SCREEN - ACCESSORY */}
      {activeView === 'accessory-detail' && selectedAccessory && (
        <div className="space-y-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <button 
              onClick={() => setActiveView('list')}
              className="text-xs font-black text-slate-500 hover:text-slate-905 flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              
              Quay lại danh sách phụ kiện
            </button>
            <span className="font-mono text-xs text-slate-400 font-bold uppercase">PHỤ KIỆN SKU SỈ</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
            
            <div className="md:col-span-2 space-y-4">
              <span className="text-[10px] bg-slate-900 text-white font-mono px-2.5 py-1 rounded font-bold uppercase">{selectedAccessory.id}</span>
              <h3 className="text-base font-black text-slate-900 leading-none">{selectedAccessory.name}</h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed italic mt-1 font-serif">"{selectedAccessory.description}"</p>

              <div className="grid grid-cols-2 gap-4 p-4.5 bg-slate-50 border border-slate-150 rounded-2xl relative">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">TỦ KỆ PHỤC VỤ TRƯNG BÀY:</span>
                  <span className="text-slate-800 text-xs font-bold block">{selectedAccessory.shelf}</span>
                </div>
                <div>
                  <span className="text-[10px] text-green-600 font-black block mb-1">KHẢ DỤNG CHO THUÊ SẴN:</span>
                  <span className="text-green-600 text-sm font-black block">{selectedAccessory.available} / {selectedAccessory.total} chiếc</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">THIẾT LẬP THAO TÁC</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-4">
                  Thực hiện sửa đổi số lượng sỉ tồn kho của túi đựng, pin sac sỉ đi kèm.
                </p>
              </div>

              <div className="space-y-2.5">
                <button 
                  onClick={handleOpenEditAccessory}
                  className="w-full py-2.5 bg-slate-800 hover:bg-[#fea619] hover:text-slate-950 text-white text-[11px] font-black rounded-lg transition cursor-pointer text-center"
                >
                  📝 CẬP NHẬT PHÂN BỔ SỔ SÁCH
                </button>
                <button 
                  onClick={() => handleDeleteAccessory(selectedAccessory.id)}
                  className="w-full py-2.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-[11px] font-black rounded-lg transition cursor-pointer text-center"
                >
                  ❌ XÓA PHỤ KIỆN SKU KHỎI DATABASE
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW: 4. ADD PHYSICAL ASSET FORM */}
      {activeView === 'asset-add' && (
        <form onSubmit={handleSaveAddAsset} className="bg-white border border-slate-205 p-6 rounded-2xl shadow-sm text-xs font-medium text-slate-705 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-[#00236f] flex items-center gap-1.5 uppercase">
              <Plus className="w-5 h-5 text-indigo-600" />
              Khai báo dán tem vật lý mới lẻ (SKU)
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Cấp mã kiểm kê định danh, ghi nhận vị trí sếp tủ cho từng chiếc camera hay len lọt lòng thực tiễn.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Tên dán nhãn hiển thị <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                required 
                value={assetForm.name} 
                onChange={(e) => setAssetForm({...assetForm, name: e.target.value})}
                placeholder="Ví dụ: Body Sony Alpha A7 IV (Đợt mua 2026/A)"
                className="p-2.5 border border-slate-200 rounded-lg outline-none text-xs text-slate-800"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Giá trị sê-ri vật lý <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                required 
                value={assetForm.sn} 
                onChange={(e) => setAssetForm({...assetForm, sn: e.target.value})}
                placeholder="Ví dụ: SN-9988221A"
                className="p-2.5 border border-slate-200 rounded-lg outline-none text-xs font-mono"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Thương hiệu</label>
              <select 
                value={assetForm.brand} 
                onChange={(e) => setAssetForm({...assetForm, brand: e.target.value})}
                className="p-2.5 border border-slate-200 rounded-lg cursor-pointer"
              >
                <option value="Sony">Sony</option>
                <option value="Canon">Canon</option>
                <option value="DJI">DJI</option>
                <option value="Aputure">Aputure</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Nhóm phân loại</label>
              <select 
                value={assetForm.category} 
                onChange={(e) => setAssetForm({...assetForm, category: e.target.value})}
                className="p-2.5 border border-slate-200 rounded-lg cursor-pointer"
              >
                <option value="Máy ảnh">Máy ảnh</option>
                <option value="Ống kính">Ống kính</option>
                <option value="Gimbal">Gimbal</option>
                <option value="Đèn quay">Đèn quay</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Kệ để kho mặc định</label>
              <input 
                type="text" 
                value={assetForm.location} 
                onChange={(e) => setAssetForm({...assetForm, location: e.target.value})}
                placeholder="Ví dụ: Kệ 03-A"
                className="p-2.5 border border-slate-200 rounded-lg outline-none text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Ngưỡng bảo dưỡng (Số lần thuê)</label>
              <input 
                type="number" 
                value={assetForm.maintThreshold} 
                onChange={(e) => setAssetForm({...assetForm, maintThreshold: parseInt(e.target.value) || 50})}
                className="p-2.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setActiveView('list')} 
              className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-[#00236f] text-white font-black rounded-lg transition shadow-sm"
            >
              LÀM MỚI KHO VẬT LÝ
            </button>
          </div>
        </form>
      )}

      {/* VIEW: 5. EDIT PHYSICAL ASSET FORM */}
      {activeView === 'asset-edit' && (
        <form onSubmit={handleSaveEditAsset} className="bg-white border border-slate-205 p-6 rounded-2xl shadow-sm text-xs font-medium text-slate-705 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase leading-none">
              <Edit3 className="w-5 h-5 text-indigo-600" />
              Sửa đổi thông số máy định danh {assetForm.id}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Điều chế nhãn tem, địa chỉ tủ trưng bày thực tiễn hoặc hiện trạng sứt hỏng xước xát thấu kính.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-xs font-bold text-slate-700">Tên định danh tem kho</label>
              <input 
                type="text" 
                required 
                value={assetForm.name} 
                onChange={(e) => setAssetForm({...assetForm, name: e.target.value})}
                className="p-2.5 border border-slate-200 rounded-lg text-xs text-slate-800 font-bold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Vị trí tủ cất mặc định</label>
              <input 
                type="text" 
                value={assetForm.location} 
                onChange={(e) => setAssetForm({...assetForm, location: e.target.value})}
                className="p-2.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Vị trí hiện tại thực tế</label>
              <input 
                type="text" 
                value={assetForm.currentLoc} 
                onChange={(e) => setAssetForm({...assetForm, currentLoc: e.target.value})}
                className="p-2.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Trạng thái định danh</label>
              <select 
                value={assetForm.status} 
                onChange={(e) => setAssetForm({...assetForm, status: e.target.value})}
                className="p-2.5 border border-slate-200 rounded-lg cursor-pointer font-bold"
              >
                <option value="available">🟢 Sẵn sàng chờ phục vụ đơn</option>
                <option value="rented">🔵 Đang trọ đi cho thuê</option>
                <option value="maintenance">🟡 Đang rã tháo bảo trì sấy</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Ghi chú miêu tả hao mòn</label>
              <input 
                type="text" 
                value={assetForm.condition} 
                onChange={(e) => setAssetForm({...assetForm, condition: e.target.value})}
                className="p-2.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-106">
            <button 
              type="button" 
              onClick={() => setActiveView('asset-detail')} 
              className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
            >
              Trở về chi tiết
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-green-600 text-white font-black rounded-lg transition shadow-sm hover:bg-green-700"
            >
              GHI NHẬN HỒ SƠ
            </button>
          </div>
        </form>
      )}

      {/* VIEW: 6. ADD ACCESSORY FORM */}
      {activeView === 'accessory-add' && (
        <form onSubmit={handleSaveAddAccessory} className="bg-white border border-slate-205 p-6 rounded-2xl shadow-sm text-xs space-y-5 font-medium text-slate-700">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase leading-none">Thêm nhóm phụ trợ sỉ (SKU)</h3>
            <p className="text-[11px] text-slate-400 mt-1">Lập danh mục sỉ cho các phụ kiện lẻ số lượng như các quả pin, túi máy hay thẻ nhớ sấy...</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Tên linh kiện phụ kiện <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                required 
                value={accessoryForm.name} 
                onChange={(e) => setAccessoryForm({...accessoryForm, name: e.target.value})}
                placeholder="Ví dụ: Chân đế Benro Tripod sỉ"
                className="p-2.5 border border-slate-200 rounded-lg outline-none text-slate-800 font-bold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Vị trí tủ cất kho sỉ</label>
              <input 
                type="text" 
                value={accessoryForm.shelf} 
                onChange={(e) => setAccessoryForm({...accessoryForm, shelf: e.target.value})}
                placeholder="Tủ phụ 04-Hộp G"
                className="p-2.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Tổng số lượng định biên trong kho</label>
              <input 
                type="number" 
                value={accessoryForm.total} 
                onChange={(e) => setAccessoryForm({...accessoryForm, total: parseInt(e.target.value) || 0, available: parseInt(e.target.value) || 0})}
                className="p-2.5 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1.5 py-4 col-span-2">
              <label className="text-xs font-bold text-slate-700">Mô tả công dụng phụ kiện</label>
              <textarea 
                value={accessoryForm.description} 
                onChange={(e) => setAccessoryForm({...accessoryForm, description: e.target.value})}
                placeholder="Chuẩn kết nối ngàm Peak, dộ chịu trọng lực 4kg..."
                rows="3"
                className="p-2.5 border border-slate-200 rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setActiveView('list')} 
              className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
            >
              Hủy bỏ, Quay ra
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-[#00236f] text-white font-black rounded-lg transition"
            >
              KHAI BÁO MÃ SKU
            </button>
          </div>
        </form>
      )}

      {/* VIEW: 7. EDIT ACCESSORY FORM */}
      {activeView === 'accessory-edit' && (
        <form onSubmit={handleSaveEditAccessory} className="bg-white border border-slate-205 p-6 rounded-2xl shadow-sm text-xs space-y-5 font-medium text-slate-701">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Sửa sổ lượng sỉ linh phụ trợ {accessoryForm.id}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Chỉnh lý lượng cất trữ, trượt số lượng lỗi bám sượt chai hỏng.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-xs font-bold text-slate-700">Tên phân kho sỉ phụ trợ</label>
              <input 
                type="text" 
                required 
                value={accessoryForm.name} 
                onChange={(e) => setAccessoryForm({...accessoryForm, name: e.target.value})}
                className="p-2.5 border border-slate-200 rounded-lg font-bold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 font-mono text-green-700">Số lượng Khả dụng (Available)</label>
              <input 
                type="number" 
                value={accessoryForm.available} 
                onChange={(e) => setAccessoryForm({...accessoryForm, available: parseInt(e.target.value) || 0})}
                className="p-2.5 border border-green-200 bg-green-50/10 rounded-lg text-green-800"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Tổng tồn định biên (Total)</label>
              <input 
                type="number" 
                value={accessoryForm.total} 
                onChange={(e) => setAccessoryForm({...accessoryForm, total: parseInt(e.target.value) || 0})}
                className="p-2.5 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 text-amber-600">Đang bảo trì sửa chữa</label>
              <input 
                type="number" 
                value={accessoryForm.maintenance} 
                onChange={(e) => setAccessoryForm({...accessoryForm, maintenance: parseInt(e.target.value) || 0})}
                className="p-2.5 border border-amber-200 rounded-lg text-amber-700"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 text-rose-600">Tổng thất thoát / chai hỏng</label>
              <input 
                type="number" 
                value={accessoryForm.damaged} 
                onChange={(e) => setAccessoryForm({...accessoryForm, damaged: parseInt(e.target.value) || 0})}
                className="p-2.5 border border-rose-200 rounded-lg text-rose-700"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setActiveView('accessory-detail')} 
              className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
            >
              Hủy sửa, Trở lại
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-green-600 text-white font-black rounded-lg transition hover:bg-green-700"
            >
              XÁC ĐỊNH SỐ LIỆU
            </button>
          </div>
        </form>
      )}

      {/* MODAL: KIỂM KÊ THIẾT BỊ VẬT LÝ */}
      {showInventoryModal && selectedAsset && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-slate-700">
            <div className="bg-[#00236f] text-white p-5">
              <h3 className="text-sm font-black uppercase tracking-wider">📋 KIỂM KÊ THIẾT BỊ ĐỊNH KỲ</h3>
              <p className="text-[10px] text-blue-200 mt-1 font-semibold">Ghi nhận thông số vật lý hiện trạng của máy {selectedAsset.id}</p>
            </div>
            
            <form onSubmit={handleSaveInventoryCheck} className="p-5 space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-450 uppercase block">Trạng thái hoạt động mới:</label>
                <select
                  value={invStatus}
                  onChange={(e) => setInvStatus(e.target.value)}
                  className="w-full bg-white border border-slate-150 p-2.5 rounded-lg text-xs font-bold text-slate-800"
                >
                  <option value="available">Sẵn sàng vận hành</option>
                  <option value="rented">Đang thuê</option>
                  <option value="maintenance">Bảo trì sửa chữa</option>
                </select>
              </div>

              <div className="space-y-1.5 font-sans">
                <label className="text-[10px] font-black text-slate-450 uppercase block">Hiện trạng hao mòn (Tình trạng %):</label>
                <input
                  type="text"
                  required
                  value={invCondition}
                  onChange={(e) => setInvCondition(e.target.value)}
                  placeholder="Ví dụ: Mới 95%, trầy nhẹ tay cầm..."
                  className="w-full p-2.5 border border-slate-150 rounded-lg outline-none font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-450 uppercase block">Mô tả hao mòn hàng tuần:</label>
                <textarea
                  value={invNotes}
                  onChange={(e) => setInvNotes(e.target.value)}
                  placeholder="Ví dụ: Đã kiểm tra kính ngắm sạch bụi, mô-tơ lấy nét phản hồi nhanh..."
                  rows="3"
                  className="w-full p-2.5 border border-slate-150 rounded-lg outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInventoryModal(false)}
                  className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition text-xs cursor-pointer uppercase font-sans"
                >
                  HỦY BỎ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#00236f] hover:bg-blue-900 text-white font-black rounded-lg transition text-xs cursor-pointer uppercase font-sans"
                >
                  💾 LƯU PHIẾU KIỂM KÊ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
