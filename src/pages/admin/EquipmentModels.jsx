import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  Edit3, 
  X, 
  ArrowLeft,
  Settings,
  ShieldCheck,
  Check,
  Plus,
  UploadCloud
} from 'lucide-react';

const formatVND = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Danh mục chuẩn theo mô tả trong use case
const CATEGORIES = [
  'Máy ảnh',
  'Ống kính',
  'Đèn flash',
  'Thiết bị chống rung',
  'Thiết bị thu âm',
  'Phụ kiện khác'
];

// Danh sách phụ kiện sẵn có trong cơ sở dữ liệu mẫu để gán vào mẫu thiết bị
const MOCK_DB_ACCESSORIES = [
  { id: 'ACC-01', name: 'Pin Sony NP-FZ100' },
  { id: 'ACC-02', name: 'Bộ sạc đôi đa năng' },
  { id: 'ACC-03', name: 'Thẻ nhớ SanDisk 128GB V60' },
  { id: 'ACC-04', name: 'Lens Filter Phi 67mm' },
  { id: 'ACC-05', name: 'Pin Canon LP-E6N' },
  { id: 'ACC-06', name: 'Đế sạc nhanh Kingma' },
  { id: 'ACC-07', name: 'Thẻ nhớ CFexpress Type A 80GB' }
];

const INITIAL_MODELS = [
  {
    id: 'MD-001',
    name: 'Sony Alpha A7 IV',
    brand: 'Sony',
    category: 'Máy ảnh',
    pricePerDay: 500000,
    deposit: 30000000,
    description: 'Thế hệ máy ảnh hybrid xuất sắc với cảm biến Exmor R 33MP đột phá, thích hợp quay chụp chuyên nghiệp.',
    specs: 'Cảm biến CMOS 33MP, Quay video 4K 60p, Chống rung 5 trục IBIS, Real-time Eye AF.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
    status: 'Kích hoạt', // 'Kích hoạt' | 'Tạm ẩn'
    compatibleAccessories: ['ACC-01', 'ACC-02', 'ACC-03']
  },
  {
    id: 'MD-002',
    name: 'Canon EOS R5',
    brand: 'Canon',
    category: 'Máy ảnh',
    pricePerDay: 900000,
    deposit: 60000000,
    description: 'Quái thú không gương lật sở hữu khả năng quay video 8K thô cùng cảm biến CMOS 45MP hoàn mỹ.',
    specs: 'Cảm biến 45MP, Quay 8K RAW, Dual Pixel CMOS AF II, Chống rung 8-stops.',
    image: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=400',
    status: 'Kích hoạt',
    compatibleAccessories: ['ACC-05', 'ACC-03', 'ACC-06']
  },
  {
    id: 'MD-003',
    name: 'Sony FE 24-70mm f/2.8 GM ii',
    brand: 'Sony',
    category: 'Ống kính',
    pricePerDay: 450000,
    deposit: 25000000,
    description: 'Ống kính zoom tiêu chuẩn siêu gọn nhẹ thế hệ hai nâng cao hiệu quả quang học và bắt nét siêu khủng.',
    specs: 'Khẩu độ f/2.8, Tiêu cự 24-70mm, 4 động cơ lấy nét cực nhanh XD Linear, Kháng bụi thời tiết.',
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400',
    status: 'Kích hoạt',
    compatibleAccessories: ['ACC-04']
  }
];

export default function EquipmentModels() {
  const [models, setModels] = useState(INITIAL_MODELS);
  const [activeView, setActiveView] = useState('list'); // 'list' | 'detail' | 'add' | 'edit'
  const [selectedModel, setSelectedModel] = useState(null);

  // Bộ lọc danh sách
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Form State chỉ chứa các trường thông tin được mô tả trong Use Case
  const [formFields, setFormFields] = useState({
    name: '',
    brand: '',
    category: 'Máy ảnh',
    pricePerDay: 0,
    deposit: 0,
    description: '',
    specs: '',
    status: 'Kích hoạt',
    image: '',
    compatibleAccessories: [] // Array of accessory ids
  });

  const [simulatedFile, setSimulatedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenDetail = (model) => {
    setSelectedModel(model);
    setActiveView('detail');
  };

  const handleOpenAdd = () => {
    setFormFields({
      name: '',
      brand: '',
      category: 'Máy ảnh',
      pricePerDay: 300000,
      deposit: 15000000,
      description: '',
      specs: '',
      status: 'Kích hoạt',
      image: '',
      compatibleAccessories: []
    });
    setSimulatedFile(null);
    setActiveView('add');
  };

  const handleOpenEdit = () => {
    setFormFields({
      name: selectedModel.name,
      brand: selectedModel.brand,
      category: selectedModel.category,
      pricePerDay: selectedModel.pricePerDay,
      deposit: selectedModel.deposit,
      description: selectedModel.description,
      specs: selectedModel.specs,
      status: selectedModel.status,
      image: selectedModel.image,
      compatibleAccessories: selectedModel.compatibleAccessories || []
    });
    setSimulatedFile(selectedModel.image ? { name: 'anh_minh_hoa_da_luu.png', size: 1048576 } : null);
    setActiveView('edit');
  };

  // Giả lập thả ảnh
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSimulatedFile({ name: file.name, size: file.size });
      setFormFields(prev => ({ ...prev, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400' }));
    }
  };

  const handleFileClick = () => {
    setSimulatedFile({ name: 'camera_upload_sim.png', size: 450000 });
    setFormFields(prev => ({ ...prev, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400' }));
  };

  // Ghi nhận checkbox phụ kiện tương thích
  const handleAccessoryCheckboxChange = (accId) => {
    const current = [...formFields.compatibleAccessories];
    if (current.includes(accId)) {
      setFormFields(prev => ({
        ...prev,
        compatibleAccessories: current.filter(id => id !== accId)
      }));
    } else {
      setFormFields(prev => ({
        ...prev,
        compatibleAccessories: [...current, accId]
      }));
    }
  };

  // Áp dụng Thêm mới
  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formFields.name.trim() || !formFields.brand.trim()) {
      alert('Vui lòng điền đầy đủ Tên mẫu thiết bị và Hãng sản xuất!');
      return;
    }

    const newId = `MD-0${models.length + 12}`;
    const newModel = {
      id: newId,
      name: formFields.name.trim(),
      brand: formFields.brand.trim(),
      category: formFields.category,
      pricePerDay: Number(formFields.pricePerDay) || 0,
      deposit: Number(formFields.deposit) || 0,
      description: formFields.description.trim(),
      specs: formFields.specs.trim(),
      image: formFields.image || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
      status: formFields.status,
      compatibleAccessories: formFields.compatibleAccessories
    };

    setModels([newModel, ...models]);
    setActiveView('list');
    triggerToast(`Đã thêm mới thành công mẫu thiết bị: ${newModel.name}`);
  };

  // Áp dụng Cập nhật
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!formFields.name.trim() || !formFields.brand.trim()) {
      alert('Vui lòng điền đầy đủ Tên mẫu thiết bị và Hãng sản xuất!');
      return;
    }

    const updated = {
      ...selectedModel,
      name: formFields.name.trim(),
      brand: formFields.brand.trim(),
      category: formFields.category,
      pricePerDay: Number(formFields.pricePerDay) || 0,
      deposit: Number(formFields.deposit) || 0,
      description: formFields.description.trim(),
      specs: formFields.specs.trim(),
      image: formFields.image,
      status: formFields.status,
      compatibleAccessories: formFields.compatibleAccessories
    };

    setModels(models.map(m => m.id === selectedModel.id ? updated : m));
    setSelectedModel(updated);
    setActiveView('detail');
    triggerToast(`Đã cập nhật thông sườn mẫu thiết bị: ${updated.name}`);
  };

  // Ẩn/Hiện nhanh
  const handleToggleStatus = () => {
    const nextStatus = selectedModel.status === 'Kích hoạt' ? 'Tạm ẩn' : 'Kích hoạt';
    const updated = {
      ...selectedModel,
      status: nextStatus
    };
    setModels(models.map(m => m.id === selectedModel.id ? updated : m));
    setSelectedModel(updated);
    triggerToast(`Đã thay đổi trạng thái hoạt động: ${nextStatus}`);
  };

  // Xóa mẫu thiết bị
  const handleDeleteModel = () => {
    if (window.confirm(`Quý khách có chắc chắn muốn xóa mẫu thiết bị "${selectedModel.name}" khỏi hệ thống?`)) {
      setModels(models.filter(m => m.id !== selectedModel.id));
      setActiveView('list');
      triggerToast('Đã xóa mẫu thiết bị thành công!');
    }
  };

  // Tìm kiếm lọc
  const filteredModels = models.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === '' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 select-none font-sans text-left" id="equipment-models-screen">
      
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-4 bg-[#011638] text-white px-5 py-3.5 rounded-lg shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-[#fea619]" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* VIEW: 1. LIST OF MODELS */}
      {activeView === 'list' && (
        <>
          <div className="flex flex-wrap justify-between items-center bg-white p-5 border border-[#c5c5d3] rounded-2xl shadow-xs gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#00236f] flex items-center gap-2 uppercase tracking-wide">
                <Settings className="w-5 h-5 text-indigo-650" />
                Quản lý mẫu thiết bị
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Tạo lập định nghĩa, dải giá thuê, hãng linh thiết bị quay chụp toàn hệ thống</p>
            </div>
            <button 
              type="button" 
              onClick={handleOpenAdd}
              className="px-4 py-2.5 bg-[#00236f] hover:bg-[#fea619] text-white hover:text-[#2a1700] text-xs font-black rounded-xl transition shadow-xs cursor-pointer"
            >
              + Thêm mẫu thiết bị mới
            </button>
          </div>

          {/* Search filter bar */}
          <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs flex flex-col sm:flex-row gap-4 items-center text-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên mẫu thiết bị, hãng sản xuất..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-[#00236f] font-semibold text-slate-700"
              />
            </div>

            <div className="w-full sm:w-56">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-slate-650 cursor-pointer"
              >
                <option value="">Danh mục: Tất cả</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* List Table (NO Quantity/Tồn kho column to prevent rule violation!) */}
          <div className="table-wrapper border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="w-full">
              <table className="data-table text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-[#0f172a] text-[13px]">
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[110px]">Mã số mẫu</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[180px]">Tên mẫu</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[120px]">Hãng</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[120px]">Danh mục</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[130px]">Giá thuê ngày</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[120px]">Trạng thái</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-right font-semibold min-w-[120px]">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-705">
                  {filteredModels.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-10 text-center italic text-slate-400 font-semibold">
                        Không tìm thấy mẫu thiết bị nào trùng khớp bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredModels.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/40 transition">
                        <td className="px-6 py-4 font-mono font-bold text-[#00236f] cell-code">{m.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 border border-slate-200 bg-slate-50 overflow-hidden rounded-lg flex items-center justify-center shrink-0 animate-scaleIn">
                              <img src={m.image} alt={m.name} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                            </div>
                            <span className="font-bold text-slate-905">{m.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 uppercase"><span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-150">{m.brand}</span></td>
                        <td className="px-6 py-4 text-slate-650">{m.category}</td>
                        <td className="px-6 py-4 text-center font-mono font-bold text-indigo-750 cell-money">{formatVND(m.pricePerDay)}/ngày</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`status-badge ${
                            m.status === 'Kích hoạt' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-250' 
                              : 'bg-slate-55 text-slate-500 border border-slate-200'
                          }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(m)}
                            className="table-action-button text-[#00236f] bg-[#00236f]/5 hover:bg-[#00236f]/10 cursor-pointer"
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
        </>
      )}

      {/* VIEW: 2. DETAILED MODEL */}
      {activeView === 'detail' && selectedModel && (
        <div className="bg-white border border-[#c5c5d3] p-6 rounded-2xl shadow-xs space-y-6">
          <div className="flex border-b pb-4 items-center justify-between">
            <button 
              type="button" 
              onClick={() => setActiveView('list')}
              className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách mẫu
            </button>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Chi tiết định dạng mẫu: #{selectedModel.id}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs font-semibold">
            
            <div className="md:col-span-8 space-y-5 text-left">
              <div className="flex items-center gap-4">
                <div className="w-20 h-16 border rounded bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={selectedModel.image} alt={selectedModel.name} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-905">{selectedModel.name}</h3>
                  <p className="text-slate-405 mt-1 font-bold">{selectedModel.brand} • {selectedModel.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl">
                  <span className="text-slate-400 font-bold block uppercase text-[9px] mb-1">Giá cho thuê ngày:</span>
                  <strong className="text-indigo-705 text-sm font-black font-mono">{formatVND(selectedModel.pricePerDay)} / ngày</strong>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl">
                  <span className="text-slate-400 font-bold block uppercase text-[9px] mb-1">Giá trị thẩm định thiết bị (Tính cọc):</span>
                  <strong className="text-slate-805 text-sm font-mono">{formatVND(selectedModel.deposit)}</strong>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl sm:col-span-2">
                  <span className="text-slate-400 font-bold block uppercase text-[9px] mb-1">Thông số kỹ thuật then chốt:</span>
                  <span className="text-slate-800 text-xs font-bold leading-relaxed">{selectedModel.specs || 'N/A'}</span>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl sm:col-span-2">
                  <span className="text-slate-400 font-bold block uppercase text-[9px] mb-1">Mô tả đặc tính sườn mẫu:</span>
                  <p className="text-slate-700 leading-relaxed italic">"{selectedModel.description || 'Không có mô tả chi tiết.'}"</p>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl sm:col-span-2">
                  <span className="text-slate-400 font-bold block uppercase text-[9px] mb-2">Danh sách phụ kiện tương thích (DB mapping):</span>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    {selectedModel.compatibleAccessories && selectedModel.compatibleAccessories.length > 0 ? (
                      selectedModel.compatibleAccessories.map(accId => {
                        const accName = MOCK_DB_ACCESSORIES.find(a => a.id === accId)?.name || accId;
                        return (
                          <span key={accId} className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg font-bold">
                            📦 {accName}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-slate-400 font-bold italic">Chưa liên kết phụ kiện tương thích đi kèm</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar actions inside detail */}
            <div className="md:col-span-4 p-4 bg-slate-50 border border-slate-205 rounded-2xl flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[9px] block text-slate-400 font-black uppercase mb-1">Thao tác sản phẩm:</span>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                  Quý khách chỉ được phép chỉnh sửa sườn mẫu, tạm ẩn hiển thị bán dạo, hoặc xóa mẫu nếu không có ràng buộc vật lý.
                </p>
              </div>

              <div className="space-y-2 text-center font-bold">
                <button 
                  type="button" 
                  onClick={handleOpenEdit}
                  className="w-full py-2.5 bg-[#00236f] hover:bg-[#fea619] hover:text-[#2a1700] text-white font-black rounded-lg transition shadow-xs"
                >
                  📝 Cập nhật thông số mẫu
                </button>
                
                <button 
                  type="button" 
                  onClick={handleToggleStatus}
                  className={`w-full py-2.5 rounded-lg border transition ${
                    selectedModel.status === 'Kích hoạt' 
                      ? 'bg-amber-50 border-amber-250 text-amber-800 hover:bg-amber-100' 
                      : 'bg-emerald-50 border-emerald-250 text-emerald-805 hover:bg-emerald-100'
                  }`}
                >
                  {selectedModel.status === 'Kích hoạt' ? '🔒 Tạm ẩn mẫu thiết bị' : '🔓 Kích hoạt mẫu thiết bị'}
                </button>

                <button 
                  type="button" 
                  onClick={handleDeleteModel}
                  className="w-full py-2.5 bg-rose-50 hover:bg-rose-500 text-rose-700 hover:text-white border border-rose-200 rounded-lg transition"
                >
                  🗑️ Xóa mẫu thiết bị khỏi kho
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW: 3. ADD FORM */}
      {(activeView === 'add' || activeView === 'edit') && (
        <form onSubmit={activeView === 'add' ? handleSaveAdd : handleSaveEdit} className="bg-white border border-[#c5c5d3] p-6 rounded-2xl shadow-xs text-xs space-y-5 font-semibold text-slate-705">
          <div>
            <h3 className="text-sm font-black text-[#00236f] uppercase">{activeView === 'add' ? 'Thêm mẫu thiết bị mới' : 'Cập nhật mẫu thiết bị'}</h3>
            <p className="text-[11px] text-slate-400 mt-1 font-semibold">Nhập các trường thuộc tính quy định bắt buộc, gán kết các phụ kiện tương thích có sẵn trong hệ thống</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-slate-500 block font-bold uppercase text-[9px]">Tên mẫu thiết bị <span className="text-rose-550">*</span></label>
              <input 
                type="text" required value={formFields.name}
                onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                placeholder="Nhập tên thương mại (Ví dụ: Sony Alpha A7R V)"
                className="p-2.5 border rounded-lg text-slate-900 font-bold bg-slate-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-500 block font-bold uppercase text-[9px]">Hãng sản xuất <span className="text-rose-550">*</span></label>
              <input 
                type="text" required value={formFields.brand}
                onChange={(e) => setFormFields({ ...formFields, brand: e.target.value })}
                placeholder="Ví dụ: Sony, Canon, Fujifilm, DJI..."
                className="p-2.5 border rounded-lg text-slate-900 font-bold bg-slate-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-500 block font-bold uppercase text-[9px]">Danh mục phân loại</label>
              <select 
                value={formFields.category}
                onChange={(e) => setFormFields({ ...formFields, category: e.target.value })}
                className="p-2.5 border rounded-lg bg-white cursor-pointer font-bold"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-500 block font-bold uppercase text-[9px] font-mono">Giá thuê / ngày (VND) <span className="text-rose-550">*</span></label>
              <input 
                type="number" required value={formFields.pricePerDay}
                onChange={(e) => setFormFields({ ...formFields, pricePerDay: Number(e.target.value) || 0 })}
                className="p-2.5 border rounded-lg text-slate-900 font-mono"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-500 block font-bold uppercase text-[9px] font-mono">Giá trị máy định cọc (VND) <span className="text-rose-550">*</span></label>
              <input 
                type="number" required value={formFields.deposit}
                onChange={(e) => setFormFields({ ...formFields, deposit: Number(e.target.value) || 0 })}
                className="p-2.5 border rounded-lg text-slate-900 font-mono"
              />
            </div>

            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-slate-500 block font-bold uppercase text-[9px]">Thông số kỹ thuật cơ bản</label>
              <input 
                type="text" value={formFields.specs}
                onChange={(e) => setFormFields({ ...formFields, specs: e.target.value })}
                placeholder="Ví dụ: Cảm biến Full-frame 61MP, IBIS chống rung, Dual AF thấu quang..."
                className="p-2.5 border rounded-lg text-slate-900"
              />
            </div>

            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-slate-500 block font-bold uppercase text-[9px]">Mô tả chi tiết mẫu thiết bị</label>
              <textarea 
                value={formFields.description}
                onChange={(e) => setFormFields({ ...formFields, description: e.target.value })}
                rows="3" placeholder="Mô tả tóm tắt tính năng, ưu điểm vật lý hỗ trợ khách hàng tham khảo..."
                className="p-2.5 border rounded-lg text-slate-900 outline-none resize-none"
              />
            </div>

            <div className="col-span-2">
              <label className="text-slate-500 block font-bold uppercase text-[9px] mb-1.5">Trạng thái trưng bày sườn</label>
              <select 
                value={formFields.status}
                onChange={(e) => setFormFields({ ...formFields, status: e.target.value })}
                className="p-2.5 border rounded-lg bg-white cursor-pointer font-bold text-xs"
              >
                <option value="Kích hoạt">Kích hoạt</option>
                <option value="Tạm ẩn">Tạm ẩn</option>
              </select>
            </div>

            {/* Drag & Drop Photo placeholder */}
            <div className="col-span-2">
              <label className="text-slate-500 block font-bold uppercase text-[9px] mb-1.5">Ảnh minh họa sườn mẫu</label>
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleFileClick}
                className={`border-2 border-dashed rounded-xl p-5 text-center flex flex-col items-center justify-center cursor-pointer transition ${
                  dragOver ? 'border-[#00236f] bg-blue-50/10' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <UploadCloud className="w-8 h-8 text-slate-400 mb-1.5" />
                <span className="font-bold text-slate-700 block">Kéo thả ảnh sườn máy vào đây hoặc Click để nạp</span>
                <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Cho phép định dạng PNG, JPG, JPEG tối đa 10MB</span>
                {simulatedFile && (
                  <div className="mt-2.5 inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded text-[10.5px] font-bold">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>File ảnh sườn: {simulatedFile.name} ({(simulatedFile.size/1000).toFixed(0)} KB)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Checklist: Cấu hình danh sách phụ kiện tương thích (Chọn nhiều checkbox) */}
            <div className="col-span-2 pt-2">
              <label className="text-slate-500 block font-bold uppercase text-[9px] mb-2">
                Cấu hình danh sách phụ kiện tương thích đi kèm (Chọn nhiều trị giá checklist):
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-4 border border-slate-150 rounded-xl max-h-[200px] overflow-y-auto">
                {MOCK_DB_ACCESSORIES.map(acc => {
                  const isChecked = formFields.compatibleAccessories.includes(acc.id);
                  return (
                    <label key={acc.id} className="flex items-center gap-2.5 p-2 bg-white border border-slate-200 hover:border-[#00236f] rounded-lg cursor-pointer transition select-none">
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleAccessoryCheckboxChange(acc.id)}
                        className="cursor-pointer text-[#00236f] rounded focus:ring-1"
                      />
                      <div className="text-[11px] font-bold text-slate-800">
                        <span>{acc.name}</span>
                        <span className="text-[9px] block text-slate-400 font-mono leading-none">{acc.id}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t text-xs select-none">
            <button 
              type="button" 
              onClick={() => activeView === 'add' ? setActiveView('list') : setActiveView('detail')}
              className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 bg-[#00236f] hover:bg-[#fea619] hover:text-[#2a1700] text-white font-black rounded-lg transition shadow-xs"
            >
              {activeView === 'add' ? 'Thêm mẫu thiết bị' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
