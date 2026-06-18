import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Layers, 
  Sparkles, 
  Eye, 
  EyeOff, 
  SlidersHorizontal,
  PlusCircle,
  ArrowLeft,
  Settings,
  ShieldCheck,
  AlertTriangle,
  Info,
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { EQUIPMENTS, CATEGORIES } from '../../data';

const formatVND = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Initial seeded list for accessories/bundle of Sony Alpha A7 IV (Screen 1)
const INITIAL_ACC_LIST = [
  {
    stt: 1,
    id: 'b1',
    name: 'Thân máy Sony Alpha A7 IV',
    type: 'Tài sản định danh',
    quantity: 1,
    required: true,
    canDelete: false,
    notes: 'Thành phần chính lõi của bộ'
  },
  {
    stt: 2,
    id: 'b2',
    name: 'Pin Sony NP-FZ100',
    type: 'Phụ kiện số lượng',
    quantity: 2,
    required: true,
    canDelete: true,
    notes: 'Pin sụt nguồn dự phòng 2280mAh'
  },
  {
    stt: 3,
    id: 'b3',
    name: 'Thể nhớ 128GB SanDisk V60',
    type: 'Phụ kiện số lượng',
    quantity: 1,
    required: false,
    canDelete: true,
    notes: 'Tốc độ 200MB/s ghi hình nhanh'
  }
];

export default function EquipmentModels() {
  const [models, setModels] = useState(EQUIPMENTS);
  const [activeView, setActiveView] = useState('list'); // list, detail, add, edit, bundle
  const [selectedModel, setSelectedModel] = useState(null);

  // Bundle configuration states
  const [bundleItems, setBundleItems] = useState(INITIAL_ACC_LIST);
  const [showAddBundleItemModal, setShowAddBundleItemModal] = useState(false);
  const [newBundleItemName, setNewBundleItemName] = useState('');
  const [newBundleItemType, setNewBundleItemType] = useState('Phụ kiện số lượng');
  const [newBundleItemQty, setNewBundleItemQty] = useState(1);
  const [newBundleItemReq, setNewBundleItemReq] = useState(true);
  const [newBundleItemNotes, setNewBundleItemNotes] = useState('');

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');

  // Form Fields State for add/edit operations
  const [formFields, setFormFields] = useState({
    id: '', name: '', category: 'camera', brand: 'Sony', pricePerDay: 500000, deposit: 3000000, 
    image: '', description: '', specs: '', bufferTime: 3, isAvailable: true
  });

  // Toast
  const [toast, setToast] = useState(null);
  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Subpage togglers
  const handleOpenDetail = (model) => {
    setSelectedModel(model);
    setActiveView('detail');
  };

  const handleOpenAdd = () => {
    setFormFields({
      id: `model-${Date.now()}`,
      name: '',
      category: 'camera',
      brand: 'Sony',
      pricePerDay: 400000,
      deposit: 2000000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2x-rGysk6oBRGSau_Xn3wReZ2aFj3Nr5QGn4kcyXOuozjk__rnOAmKXRskJCrTaEib5O0fC1K2yHW_eoYUFtzcTgN2w13xDMHVshUEmakVKletLA60hDHc2ur8twtZXKYF6G2dwbGWywjXUvkKVohX-l3Mg7wjZ4RMsK0jWMqgmmKqVcfBhmLQm4Amuo5FvPsrMipC4JzDkMzUn2GSKBNJAvGVv1QojN23RcSVF7dGAKcQO48gFWGMZMlytjYmHuilEpbi_Je8Lo',
      description: '',
      specs: 'Cảm biến thấu kính vượt trội, độ phân tiến nhanh',
      bufferTime: 3,
      isAvailable: true
    });
    setActiveView('add');
  };

  const handleOpenEdit = () => {
    setFormFields({
      ...selectedModel,
      specs: selectedModel.specs ? selectedModel.specs.join(', ') : ''
    });
    setActiveView('edit');
  };

  const handleOpenBundle = () => {
    setActiveView('bundle');
  };

  // Actions
  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formFields.name.trim()) {
      alert('Vui lòng điền tên mẫu thiết bị!');
      return;
    }
    const specArray = formFields.specs ? formFields.specs.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
    const newModel = {
      ...formFields,
      specs: specArray,
      status: 'ACTIVE'
    };
    setModels([newModel, ...models]);
    setActiveView('list');
    triggerToast(`Đã lưu thành công mẫu thiết bị mới: ${newModel.name}`);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!formFields.name.trim()) {
      alert('Vui lòng điền tên mẫu thiết bị!');
      return;
    }
    const specArray = formFields.specs ? formFields.specs.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
    const updatedModel = {
      ...selectedModel,
      ...formFields,
      specs: specArray
    };
    setModels(models.map(m => m.id === selectedModel.id ? updatedModel : m));
    setSelectedModel(updatedModel);
    setActiveView('detail');
    triggerToast(`Đã lưu cập nhật thông tin mẫu thiết bị ${updatedModel.name}`);
  };

  const handleToggleStatus = () => {
    const updatedModel = {
      ...selectedModel,
      isAvailable: !selectedModel.isAvailable
    };
    setModels(models.map(m => m.id === selectedModel.id ? updatedModel : m));
    setSelectedModel(updatedModel);
    triggerToast(`Đã ${updatedModel.isAvailable ? 'KÍCH HOẠT' : 'ẨN'} mẫu thiết bị ${updatedModel.name}`);
  };

  const handleDeleteModel = () => {
    const codeName = selectedModel.name;
    const isLinked = selectedModel.brand === 'Sony' || selectedModel.brand === 'Canon' || selectedModel.brand === 'DJI';
    
    if (isLinked) {
      alert(`Lỗi nghiêm trọng: Không thể xóa mẫu thiết bị "${codeName}" vì hiện đang có các thiết bị vật lý hoặc phụ kiện liên kết thực tế trong kho lưu trữ! Vui lòng thu hồi hoặc xóa các bản ghi thiết bị vật lý liên kết trước.`);
      return;
    }
    
    if (window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn mẫu thiết bị "${codeName}" ra khỏi hệ thống?`)) {
      setModels(models.filter(m => m.id !== selectedModel.id));
      setActiveView('list');
      triggerToast(`Đã xóa thành công mẫu thiết bị "${codeName}".`);
    }
  };

  // Bundle operations
  const handleAddBundleItem = (e) => {
    e.preventDefault();
    if (!newBundleItemName.trim()) {
      alert('Vui lòng điền tên cấu phần!');
      return;
    }
    const newItem = {
      stt: bundleItems.length + 1,
      id: `b-${Date.now()}`,
      name: newBundleItemName,
      type: newBundleItemType,
      quantity: parseInt(newBundleItemQty) || 1,
      required: newBundleItemReq,
      canDelete: true,
      notes: newBundleItemNotes
    };
    setBundleItems([...bundleItems, newItem]);
    setNewBundleItemName('');
    setNewBundleItemNotes('');
    setShowAddBundleItemModal(false);
    triggerToast('Đã thêm 1 thành phần vào bộ đi kèm.');
  };

  const handleRemoveBundleItem = (id) => {
    setBundleItems(bundleItems.filter(item => item.id !== id));
    triggerToast('Đã loại bỏ thành phần khỏi cấu hình bộ.');
  };

  const handleToggleRequired = (id) => {
    setBundleItems(bundleItems.map(item => item.id === id ? { ...item, required: !item.required } : item));
  };

  const handleSaveBundleConfig = () => {
    setActiveView('detail');
    triggerToast('Đã lưu cấu hình bộ đi kèm thành công!');
  };

  // Filter calculations
  const filteredModels = models.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesBrand = selectedBrand === 'all' || m.brand.toLowerCase() === selectedBrand.toLowerCase();
    return matchesSearch && matchesCategory && matchesBrand;
  });

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* Toast Notice */}
      {toast && (
        <div className="fixed top-20 right-4 bg-slate-900 border border-slate-700 text-white px-5 py-3 rounded-lg shadow-2xl z-50 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#fea619]" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      {/* VIEW: 1. LIST MODULES */}
      {activeView === 'list' && (
        <>
          <div className="flex justify-between items-center bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
            <div>
              <h2 className="text-xl font-bold text-[#00236f] flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-650" />
                DANH SÁCH MẪU THIẾT BỊ
              </h2>
              <p className="text-xs text-slate-500 mt-1">Lập danh lục, thông tin kỹ thuật, dải giá thuê thô và chính sách cọc cho từng mẫu máy ảnh, ống kính.</p>
            </div>
            <button 
              onClick={handleOpenAdd}
              className="px-4 py-2.5 bg-[#00236f] hover:bg-[#fea619] text-white hover:text-[#2a1700] text-xs font-black rounded-lg transition-colors cursor-pointer"
            >
              + THÊM MẪU THIẾT BỊ
            </button>
          </div>

          {/* Filters search bar */}
          <div className="bg-white p-4.5 border border-slate-200 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between text-xs font-semibold">
            <div className="relative w-full md:flex-1 font-sans">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Tìm tên mẫu thiết bị..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
            </div>
            
            {/* Category Filter */}
            <div className="w-full md:w-52 font-sans">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 p-2.5 rounded-lg cursor-pointer text-sm font-medium"
              >
                <option value="all">Danh mục: Tất cả</option>
                {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div className="w-full md:w-52 font-sans">
              <select 
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-white border border-slate-200 p-2.5 rounded-lg cursor-pointer text-sm font-medium"
              >
                <option value="all">Hãng sản xuất: Tất cả</option>
                {Array.from(new Set(models.map(m => m.brand))).map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table List View */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto w-full shadow-sm">
            <table className="w-full min-w-[950px] text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-slate-50 text-[10px] text-slate-500 font-black uppercase tracking-wider border-b border-rose-100">
                  <th className="px-6 py-4 whitespace-nowrap">Mã mẫu thiết bị</th>
                  <th className="px-6 py-4 min-w-[200px]">Tên mẫu thiết bị</th>
                  <th className="px-6 py-4 whitespace-nowrap">Danh mục (Category)</th>
                  <th className="px-6 py-4 whitespace-nowrap">Hãng sản xuất (Brand)</th>
                  <th className="px-6 py-4 text-center whitespace-nowrap">Số lượng dòng sản phẩm đang sở hữu</th>
                  <th className="px-6 py-4 text-right whitespace-nowrap">Xem chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-650">
                {filteredModels.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center italic text-slate-400">
                      Không tìm thấy mẫu thiết bị phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredModels.map((model) => {
                    // Mock quantity based on model brand or preset
                    const ownedQty = model.brand === 'Sony' ? 8 : model.brand === 'Canon' ? 5 : 3;
                    return (
                      <tr key={model.id} className="hover:bg-slate-50/45 transition">
                        <td className="px-6 py-4 font-mono text-[#00236f] font-bold whitespace-nowrap">
                          {model.id.length > 12 ? `${model.id.substring(0, 8).toUpperCase()}...` : model.id.toUpperCase()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-10 bg-slate-50 border border-slate-200 rounded overflow-hidden flex items-center justify-center shrink-0">
                              <img 
                                src={model.image || model.image_url} 
                                alt={model.name} 
                                className="max-h-full max-w-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 block text-sm">{model.name}</span>
                              {model.specs && model.specs.length > 0 && (
                                <span className="text-[10px] text-slate-400 block font-normal">{model.specs.slice(0, 1).join(', ')}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {CATEGORIES.find(c => c.id === model.category)?.name || model.category}
                        </td>
                        <td className="px-6 py-4 text-slate-850 font-bold whitespace-nowrap">
                          <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700">{model.brand}</span>
                        </td>
                        <td className="px-6 py-4 text-center font-mono font-bold text-indigo-700 text-sm whitespace-nowrap">
                          {ownedQty} sản phẩm
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button 
                            onClick={() => handleOpenDetail(model)}
                            className="px-4 py-1.5 border border-[#00236f] text-[#00236f] hover:bg-blue-50 rounded-lg text-[10.5px] uppercase font-bold transition cursor-pointer"
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
        </>
      )}

      {/* VIEW: 2. DETAILED MODULE INFO */}
      {activeView === 'detail' && selectedModel && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold">
            <button 
              onClick={() => setActiveView('list')} 
              className="text-slate-500 hover:text-slate-900 transition flex items-center gap-1 font-bold"
            >
              
              DANH SÁCH MẪU
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-black">Chi tiết mẫu sườn {selectedModel.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Main specification card details */}
            <div className="md:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex gap-4">
                  <div className="w-24 h-20 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                    <img 
                      src={selectedModel.image || selectedModel.image_url} 
                      alt={selectedModel.name} 
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-xs">
                    <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-500 px-2.5 py-0.5 rounded font-black block w-fit leading-none mb-2">
                      MÃ MẪU: {selectedModel.id}
                    </span>
                    <h3 className="text-base font-black text-slate-850 leading-tight">{selectedModel.name}</h3>
                    <p className="text-slate-400 mt-1 font-bold">{selectedModel.brand} • {CATEGORIES.find(c => c.id === selectedModel.category)?.name}</p>
                  </div>
                </div>

                <span className={`inline-flex px-3 py-1 rounded text-[10px] font-black uppercase border ${
                  selectedModel.isAvailable 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-slate-100 text-slate-500 border-slate-250'
                }`}>
                  {selectedModel.isAvailable ? 'ĐANG HOẠT ĐỘNG' : 'ĐANG TẠM ẨN'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Giá gốc cho thuê thô:</span>
                  <span className="text-indigo-600 font-black text-sm block">{formatVND(selectedModel.pricePerDay)} / ngày</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Giá trị tiền cọc giữ máy:</span>
                  <span className="text-slate-900 font-black text-sm block">{formatVND(selectedModel.deposit || selectedModel.deposit_amount || 0)} Đ</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Thời gian đệm kiểm kê tủ bếp:</span>
                  <span className="text-slate-800 font-bold block">{selectedModel.bufferTime || 3} giờ đệm giữa 2 lượt thuê</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Mô tả sản phẩm:</span>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold italic bg-slate-50/50 border border-slate-150 p-3 rounded-xl">
                  "{selectedModel.description || 'Chưa cung cấp mô tả chi tiết sườn.'}"
                </p>
              </div>

              {/* Specs array tags list */}
              {selectedModel.specs && selectedModel.specs.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Thông số kỹ thuật then chốt:</span>
                  <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-700">
                    {selectedModel.specs.map((sp, idx) => (
                      <span key={idx} className="bg-slate-100 px-3 py-1 rounded-full">{sp}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bundle list visual info */}
              <div className="pt-4 border-t border-slate-100 text-xs text-slate-705">
                <h4 className="font-black text-[#00236f] uppercase block mb-3">Thông số phụ kiện / Bộ đi kèm đóng gói sẵn</h4>
                <div className="space-y-2 bg-slate-50/60 p-4 border border-slate-150 rounded-xl">
                  {bundleItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-2.5 border border-slate-150 rounded-lg">
                      <div>
                        <span className="font-bold text-slate-800">{item.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold block">{item.type} • SL: {item.quantity} quả</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${item.required ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                        {item.required ? 'Bắt buộc' : 'Tùy lựa chọn'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Restrict action buttons solely inside the detail side control panel */}
            <div className="md:col-span-4 bg-slate-50 border border-slate-205 p-5 rounded-2xl flex flex-col justify-between space-y-5">
              <div>
                <h4 className="text-[10px] font-black text-slate-450 uppercase block mb-3">Tác động mấu chốt</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  Các nút điều khiển sườn, thay đổi giá cả, hay dán nhãn ẩn hiện trưng bày.
                </p>
              </div>

              <div className="space-y-3 text-xs font-bold text-center font-sans">
                <button 
                  onClick={handleOpenEdit}
                  className="w-full py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  📝 CẬP NHẬT MẪU THIẾT BỊ
                </button>
                <button 
                  onClick={handleOpenBundle}
                  className="w-full py-2.5 bg-[#fea619] text-[#2a1700] font-black rounded-lg hover:brightness-105 transition cursor-pointer"
                >
                  ⚙️ CẤU HÌNH BỘ ĐI KÈM
                </button>
                <button 
                  onClick={handleToggleStatus}
                  className={`w-full py-2.5 rounded-lg border transition ${
                    selectedModel.isAvailable 
                      ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' 
                      : 'bg-green-50 border-green-200 text-green-750 hover:bg-green-100'
                  }`}
                >
                  {selectedModel.isAvailable ? '👁️ TẠM ẨN MẪU THIẾT BỊ' : '👁️ KÍCH HOẠT MẪU'}
                </button>
                <button 
                  onClick={handleDeleteModel}
                  className="w-full py-2.5 bg-rose-50 border border-rose-250 text-rose-700 hover:bg-rose-100 rounded-lg transition font-black cursor-pointer uppercase flex items-center justify-center gap-1.5"
                >
                  
                  XÓA MẪU THIẾT BỊ
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW: 3. ADD FORM */}
      {activeView === 'add' && (
        <form onSubmit={handleSaveAdd} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-5 text-xs text-slate-700 font-semibold">
          <div>
            <h3 className="text-sm font-bold text-[#00236f] uppercase">Khai báo thêm mẫu thiết bị mới</h3>
            <p className="text-[11px] text-slate-400 mt-1">Lập thông số sườn máy, đệm kiểm định, dải cọc.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700">Tên mẫu thiết bị <span className="text-rose-500">*</span></label>
              <input 
                type="text" required value={formFields.name}
                onChange={(e) => setFormFields({...formFields, name: e.target.value})}
                placeholder="Ví dụ: Sony Alpha A7R V"
                className="p-2.5 border border-slate-200 rounded-lg outline-none font-bold"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700">Thương hiệu / Hãng</label>
              <input 
                type="text" required value={formFields.brand}
                onChange={(e) => setFormFields({...formFields, brand: e.target.value})}
                className="p-2.5 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 font-mono">Giá thuê ngày (VND) <span className="text-rose-500">*</span></label>
              <input 
                type="number" required value={formFields.pricePerDay}
                onChange={(e) => setFormFields({...formFields, pricePerDay: parseFloat(e.target.value) || 0})}
                className="p-2.5 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 font-mono">Tiền cọc yêu cầu giữ máy (VND)</label>
              <input 
                type="number" value={formFields.deposit}
                onChange={(e) => setFormFields({...formFields, deposit: parseFloat(e.target.value) || 0})}
                className="p-2.5 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700">Nhóm phân loại</label>
              <select 
                value={formFields.category}
                onChange={(e) => setFormFields({...formFields, category: e.target.value})}
                className="p-2.5 border border-slate-200 rounded-lg bg-white cursor-pointer"
              >
                <option value="camera">Máy ảnh</option>
                <option value="lens">Ống kính</option>
                <option value="gimbal">Gimbal</option>
                <option value="mic">Micro</option>
                <option value="light">Đèn quay</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700">Thời gian đệm xoay vòng (giờ)</label>
              <input 
                type="number" value={formFields.bufferTime}
                onChange={(e) => setFormFields({...formFields, bufferTime: parseInt(e.target.value) || 3})}
                className="p-2.5 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-slate-700">Đăng dòng thông số (cách nhau bằng dấu phẩy)</label>
              <input 
                type="text" value={formFields.specs}
                onChange={(e) => setFormFields({...formFields, specs: e.target.value})}
                placeholder="Exmor CMOS 61MP, Lấy nét tự động bằng AI, IBIS Chống rung..."
                className="p-2.5 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-slate-700">Mô tả đặc điểm</label>
              <textarea 
                value={formFields.description}
                onChange={(e) => setFormFields({...formFields, description: e.target.value})}
                rows="3" className="p-2.5 border border-slate-200 rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" onClick={() => setActiveView('list')}
              className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 bg-[#00236f] text-white font-black rounded-lg transition shadow-sm"
            >
              THÊM MỚI SƯỜN MẪU
            </button>
          </div>
        </form>
      )}

      {/* VIEW: 4. EDIT FORM */}
      {activeView === 'edit' && (
        <form onSubmit={handleSaveEdit} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-5 text-xs text-slate-700 font-semibold">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase">Sửa đổi mẫu sườn thiết bị {selectedModel.name}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Điều chế giá cho thuê sườn máy, cọc yêu cầu giữ chỗ.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-slate-700">Tên mẫu thiết bị</label>
              <input 
                type="text" required value={formFields.name}
                onChange={(e) => setFormFields({...formFields, name: e.target.value})}
                className="p-2.5 border border-slate-200 rounded-lg outline-none text-slate-900 font-bold text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 font-mono">Giá thuê / ngày (VND)</label>
              <input 
                type="number" required value={formFields.pricePerDay}
                onChange={(e) => setFormFields({...formFields, pricePerDay: parseFloat(e.target.value) || 0})}
                className="p-2.5 border border-slate-200 rounded-lg text-indigo-650 font-black"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 font-mono">Tiền cọc giữ tủ (VND)</label>
              <input 
                type="number" value={formFields.deposit}
                onChange={(e) => setFormFields({...formFields, deposit: parseFloat(e.target.value) || 0})}
                className="p-2.5 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-slate-700">Mô tả đặc tính</label>
              <textarea 
                value={formFields.description}
                onChange={(e) => setFormFields({...formFields, description: e.target.value})}
                rows="3" className="p-2.5 border border-slate-200 rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" onClick={() => setActiveView('detail')}
              className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
            >
              Trở về chi tiết
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-black rounded-lg transition"
            >
              GHI NHẬN THAY ĐỔI
            </button>
          </div>
        </form>
      )}

      {/* VIEW: 5. BUNDLE CONFIGURATION */}
      {activeView === 'bundle' && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#00236f] flex items-center gap-1">
                <Layers className="w-5 h-5 text-[#fea619]" />
                CẤU HÌNH BỘ ĐI KÈM SƯỜN CHO: {selectedModel.name}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Bao bọc cất pin, chân phụ trợ, hoặc linh kiện đóng bộ khi xuất sưởng.</p>
            </div>
            <button 
              onClick={() => setShowAddBundleItemModal(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg flex items-center gap-1 cursor-pointer"
            >
              Thêm bộ phận +
            </button>
          </div>

          {/* Table representing components */}
          <div className="overflow-x-auto w-full border border-slate-150 rounded-xl bg-white">
            <table className="w-full min-w-[750px] text-left font-semibold text-slate-650">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">STT</th>
                  <th className="px-4 py-3">Tên linh kiện cấu phẩm</th>
                  <th className="px-4 py-3">Loại quản lý</th>
                  <th className="px-4 py-3 text-center">Số lượng</th>
                  <th className="px-4 py-3 text-center">Bắt buộc hay không</th>
                  <th className="px-4 py-3">Ghi chú vận hành</th>
                  <th className="px-4 py-3 text-right">Lựa chọn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bundleItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-bold text-[#00236f]">{idx + 1}</td>
                    <td className="px-4 py-3 font-black text-slate-800">{item.name}</td>
                    <td className="px-4 py-3 text-slate-500 font-bold block mt-1">{item.type}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-900">{item.quantity} chiếc</td>
                    <td className="px-4 py-3 text-center">
                      <input 
                        type="checkbox" checked={item.required}
                        onChange={() => handleToggleRequired(item.id)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-medium">{item.notes}</td>
                    <td className="px-4 py-3 text-right">
                      {item.canDelete ? (
                        <button 
                          onClick={() => handleRemoveBundleItem(item.id)}
                          className="text-red-600 hover:text-red-700 font-bold cursor-pointer transition p-1 hover:bg-red-50 rounded"
                        >
                          Xóa
                        </button>
                      ) : (
                        <span className="text-slate-350 italic">Cố định</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ADD COMPONENT POPUP */}
          {showAddBundleItemModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <form onSubmit={handleAddBundleItem} className="bg-white w-full max-w-sm border p-5 rounded-2xl shadow-xl space-y-4">
                <h4 className="font-bold text-slate-800 block text-xs uppercase text-[#00236f]">Thêm hạng mục đi kèm bộ</h4>

                <div className="space-y-4 font-bold text-slate-700">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black">Tên hạng mục:</label>
                    <input 
                      type="text" required placeholder="Bộ sạc, dây nối USB-C" value={newBundleItemName}
                      onChange={(e) => setNewBundleItemName(e.target.value)}
                      className="p-2 border border-slate-200 outline-none rounded"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black">Loại quản lý:</label>
                    <select 
                      value={newBundleItemType} onChange={(e) => setNewBundleItemType(e.target.value)}
                      className="p-2 border border-slate-200 bg-white rounded cursor-pointer"
                    >
                      <option>Phụ kiện số lượng</option>
                      <option>Tài sản định danh</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black">Số lượng đi kèm:</label>
                    <input 
                      type="number" value={newBundleItemQty} 
                      onChange={(e) => setNewBundleItemQty(parseInt(e.target.value) || 1)}
                      className="p-2 border border-slate-200 rounded"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400 uppercase font-black">Ghi chú:</label>
                    <input 
                      type="text" value={newBundleItemNotes} 
                      onChange={(e) => setNewBundleItemNotes(e.target.value)}
                      className="p-2 border border-slate-200 rounded"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t">
                  <button type="button" onClick={() => setShowAddBundleItemModal(false)} className="px-3 py-1.5 bg-slate-100 rounded">Hủy</button>
                  <button type="submit" className="px-4 py-1.5 bg-[#00236f] text-white rounded font-bold">Thêm cấu phần</button>
                </div>
              </form>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              onClick={() => setActiveView('detail')} 
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg cursor-pointer"
            >
              Hủy, trở lại
            </button>
            <button 
              onClick={handleSaveBundleConfig} 
              className="px-5 py-2 bg-[#fea619] text-[#2a1700] font-black rounded-lg transition shadow-sm hover:brightness-105 cursor-pointer"
            >
              Lưu cấu hình bộ
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
