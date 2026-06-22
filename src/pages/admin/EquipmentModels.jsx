import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  Edit3, 
  X, 
  Settings,
  Check,
  Plus,
  UploadCloud,
  Eye,
  Settings2,
  AlertTriangle
} from 'lucide-react';

// Custom clean Vietnamese Currency Formatter matching user format instructions
const formatVND = (value) => {
  if (value === undefined || value === null) return '';
  return value.toLocaleString('vi-VN') + 'đ';
};

const CATEGORIES = [
  'Body máy ảnh',
  'Lens',
  'Đèn flash',
  'Thiết bị chống rung',
  'Thiết bị thu âm',
  'Phụ kiện khác'
];

const INITIAL_MODELS = [
  {
    id: 'MD-001',
    name: 'Sony A7 IV',
    brand: 'Sony',
    category: 'Body máy ảnh',
    pricePerDay: 800000,
    deposit: 3000000,
    description: 'Thế hệ máy ảnh hybrid xuất sắc với cảm biến Exmor R 33MP đột phá, thích hợp quay chụp chuyên nghiệp.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
    status: 'Hoạt động', // 'Hoạt động' | 'Ẩn'
    components: [
      { id: 'C-001', name: 'Pin Sony NP-FZ100', type: 'Phụ kiện số lượng', qty: 2, source: 'Kho phụ kiện', required: true, notes: 'Pin Lithium chính hãng đã sạc đầy' },
      { id: 'C-002', name: 'Sạc đôi đa năng NP-FZ-100', type: 'Phụ kiện số lượng', qty: 1, source: 'Kho phụ kiện', required: true, notes: 'Bao gồm dây sạc Type-C' }
    ],
    isLinked: true
  },
  {
    id: 'MD-002',
    name: 'Fuji X-T5',
    brand: 'Fujifilm',
    category: 'Body máy ảnh',
    pricePerDay: 700000,
    deposit: 3000000,
    description: 'Thiết kế cổ điển kết hợp hiệu năng vượt trội, cảm biến X-Trans CMOS 5 HR 40.2MP sản xuất hình ảnh cực kỳ sắc nét.',
    image: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=400',
    status: 'Hoạt động',
    components: [
      { id: 'C-003', name: 'Pin Fujifilm NP-W235', type: 'Phụ kiện số lượng', qty: 1, source: 'Kho phụ kiện', required: true, notes: 'Pin sạc đầy' }
    ],
    isLinked: true
  },
  {
    id: 'MD-003',
    name: 'Lens 24-70 GM',
    brand: 'Sony',
    category: 'Lens',
    pricePerDay: 500000,
    deposit: 2000000,
    description: 'Ống kính zoom tiêu chuẩn chất lượng cao thuộc dòng G Master danh tiếng mang lại dải tiêu cự đa dụng.',
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400',
    status: 'Hoạt động',
    components: [
      { id: 'C-004', name: 'Lens Cap & Hood', type: 'Thiết bị vật lý định danh', qty: 1, source: 'Kho phụ kiện', required: true, notes: 'Bảo vệ thấu kính' }
    ],
    isLinked: false
  },
  {
    id: 'MD-004',
    name: 'Canon EOS R6',
    brand: 'Canon',
    category: 'Body máy ảnh',
    pricePerDay: 750000,
    deposit: 3000000,
    description: 'Mẫu máy ảnh full-frame chống rung cực tốt, độ nhạy sáng cực cao thích hợp mọi điều kiện thời tiết.',
    image: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=400',
    status: 'Ẩn',
    components: [
      { id: 'C-005', name: 'Pin Canon LP-E6NH', type: 'Phụ kiện số lượng', qty: 1, source: 'Kho phụ kiện', required: true, notes: 'Pin sạc đi kèm máy' }
    ],
    isLinked: true
  }
];

export default function EquipmentModels() {
  const [models, setModels] = useState(INITIAL_MODELS);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modals Toggles State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showToggleStatusModal, setShowToggleStatusModal] = useState(false);
  const [showConfigComboModal, setShowConfigComboModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  // Selected object state
  const [selectedModel, setSelectedModel] = useState(null);

  // Form State for Adding / Editing
  const [formFields, setFormFields] = useState({
    name: '',
    brand: '',
    category: 'Body máy ảnh',
    pricePerDay: 0,
    deposit: 0,
    description: '',
    status: 'Hoạt động',
    image: ''
  });

  // Combo Configuration State
  const [tempComponents, setTempComponents] = useState([]);

  // Toast message
  const [toastMsg, setToastMsg] = useState(null);
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Simulated image upload state
  const [simulatedFile, setSimulatedFile] = useState(null);

  // 1. Trigger View Detail
  const handleOpenDetail = (model) => {
    setSelectedModel(model);
    setShowDetailModal(true);
  };

  // 2. Trigger Add Form Modal
  const handleOpenAdd = () => {
    setFormFields({
      name: '',
      brand: '',
      category: 'Body máy ảnh',
      pricePerDay: 500000,
      deposit: 2000000,
      description: '',
      status: 'Hoạt động',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400'
    });
    setSimulatedFile(null);
    setShowAddModal(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formFields.name.trim() || !formFields.brand.trim()) {
      alert('Vui lòng điền đầy đủ Tên mẫu thiết bị và Hãng!');
      return;
    }

    const newId = `MD-00${models.length + 1}`;
    const newModel = {
      id: newId,
      name: formFields.name.trim(),
      brand: formFields.brand.trim(),
      category: formFields.category,
      pricePerDay: Number(formFields.pricePerDay) || 0,
      deposit: Number(formFields.deposit) || 0,
      description: formFields.description.trim(),
      image: formFields.image || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
      status: formFields.status,
      components: [],
      isLinked: false
    };

    setModels([newModel, ...models]);
    setShowAddModal(false);
    triggerToast(`Đã thêm mới thành công mẫu thiết bị: ${newModel.name}`);
  };

  // 3. Trigger Edit Form Modal
  const handleOpenEdit = (model) => {
    setSelectedModel(model);
    setFormFields({
      name: model.name,
      brand: model.brand,
      category: model.category,
      pricePerDay: model.pricePerDay,
      deposit: model.deposit,
      description: model.description || '',
      status: model.status,
      image: model.image
    });
    setSimulatedFile(model.image ? { name: 'ảnh_mẫu_thiết_bị.png', size: 524288 } : null);
    setShowEditModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!formFields.name.trim() || !formFields.brand.trim()) {
      alert('Vui lòng điền đầy đủ Tên mẫu thiết bị và Hãng!');
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
      image: formFields.image,
      status: formFields.status
    };

    setModels(models.map(m => m.id === selectedModel.id ? updated : m));
    setShowEditModal(false);
    triggerToast(`Đã cập nhật thông tin mẫu thiết bị: ${updated.name}`);
  };

  // 4. Trigger Toggle Status Modal (Ẩn / Kích hoạt)
  const handleOpenToggleStatus = (model) => {
    setSelectedModel(model);
    setShowToggleStatusModal(true);
  };

  const handleConfirmToggleStatus = () => {
    const nextStatus = selectedModel.status === 'Hoạt động' ? 'Ẩn' : 'Hoạt động';
    const updated = {
      ...selectedModel,
      status: nextStatus
    };
    setModels(models.map(m => m.id === selectedModel.id ? updated : m));
    setShowToggleStatusModal(false);
    triggerToast(`Đã chuyển trạng thái mẫu ${selectedModel.name} sang: ${nextStatus}`);
  };

  // 5. Trigger Configure Accompanying Combo Model
  const handleOpenConfigCombo = (model) => {
    setSelectedModel(model);
    setTempComponents(model.components ? JSON.parse(JSON.stringify(model.components)) : []);
    setShowConfigComboModal(true);
  };

  const handleAddComponentRow = () => {
    const newComponent = {
      id: `C-00${tempComponents.length + 10}`,
      name: '',
      type: 'Phụ kiện số lượng',
      qty: 1,
      source: 'Kho phụ kiện',
      required: true,
      notes: ''
    };
    setTempComponents([...tempComponents, newComponent]);
  };

  const handleRemoveComponentRow = (index) => {
    setTempComponents(tempComponents.filter((_, i) => i !== index));
  };

  const handleComponentChange = (index, field, value) => {
    const nextList = [...tempComponents];
    nextList[index][field] = value;
    setTempComponents(nextList);
  };

  const handleSaveConfigCombo = () => {
    // Validate rows
    for (let i = 0; i < tempComponents.length; i++) {
      if (!tempComponents[i].name.trim()) {
        alert('Tên thành phần trong bộ đi kèm không được phép để trống!');
        return;
      }
    }

    const updated = {
      ...selectedModel,
      components: tempComponents
    };
    setModels(models.map(m => m.id === selectedModel.id ? updated : m));
    setShowConfigComboModal(false);
    triggerToast(`Đã cập nhật cấu hình bộ đi kèm thiết bị: ${selectedModel.name}`);
  };

  // 6. Trigger Delete Confirmation Modal
  const handleOpenDelete = (model) => {
    setSelectedModel(model);
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    setModels(models.filter(m => m.id !== selectedModel.id));
    setShowDeleteConfirmModal(false);
    triggerToast('Đã xóa mẫu thiết bị thành công!');
  };

  // Filters logic
  const filteredModels = models.filter(m => {
    const sQuery = searchQuery.toLowerCase().trim();
    const matchesSearch = m.name.toLowerCase().includes(sQuery) || 
                          m.brand.toLowerCase().includes(sQuery) ||
                          m.id.toLowerCase().includes(sQuery);
    const matchesCategory = categoryFilter === '' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Simulated drop controls
  const handleFileClick = () => {
    setSimulatedFile({ name: 'image_model_upload.png', size: 1048576 });
    setFormFields(prev => ({ ...prev, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400' }));
  };

  return (
    <div className="space-y-6 select-none font-sans text-left pb-12" id="equipment-models-screen">
      
      <style>{`
        .action-cell {
          min-width: 520px !important;
          width: 520px !important;
        }
        .action-group {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 8px !important;
          flex-wrap: nowrap !important;
          white-space: nowrap !important;
        }
        .action-group button {
          white-space: nowrap !important;
          height: 32px !important;
          padding: 0 12px !important;
          border-radius: 8px !important;
          font-size: 13px !important;
          font-weight: 500 !important;
        }
      `}</style>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-4 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* HEADER TRANG */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 border border-slate-200 rounded-2xl shadow-sm gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#00236f] flex items-center gap-2 uppercase tracking-wide">
            <Settings className="w-5.2 h-5.2 text-indigo-700 shrink-0" />
            Quản lý mẫu thiết bị
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Quản lý thông tin mẫu thiết bị, giá thuê, tiền cọc và bộ đi kèm.
          </p>
        </div>
        <button 
          type="button" 
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#00236f] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Thêm mẫu thiết bị
        </button>
      </div>

      {/* BỘ LỌC (SEARCH & FILTERS) */}
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
            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 outline-none font-bold text-slate-600 cursor-pointer"
          >
            <option value="">Danh mục: Tất cả</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* BẢNG DANH SÁCH MẪU THIẾT BỊ */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-xs text-left text-slate-600 border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold uppercase text-[10px] tracking-wider">
                <th className="px-5 py-3.5 whitespace-nowrap min-w-[70px]">Ảnh</th>
                <th className="px-5 py-3.5 whitespace-nowrap min-w-[160px]">Tên mẫu thiết bị</th>
                <th className="px-5 py-3.5 whitespace-nowrap min-w-[100px]">Hãng</th>
                <th className="px-5 py-3.5 whitespace-nowrap min-w-[120px]">Danh mục</th>
                <th className="px-5 py-3.5 text-center whitespace-nowrap min-w-[110px]">Giá/ngày</th>
                <th className="px-5 py-3.5 text-center whitespace-nowrap min-w-[110px]">Tiền cọc</th>
                <th className="px-5 py-3.5 text-center whitespace-nowrap min-w-[100px]">Trạng thái</th>
                <th className="px-5 py-3.5 text-right whitespace-nowrap action-cell">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredModels.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-10 text-center italic text-slate-400 font-medium bg-white">
                    Không tìm thấy mẫu thiết bị nào trùng khớp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredModels.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="w-10 h-10 border border-slate-200 bg-slate-50 overflow-hidden rounded-lg flex items-center justify-center shrink-0">
                        <img 
                          src={m.image} 
                          alt={m.name} 
                          className="max-h-full max-w-full object-contain" 
                          referrerPolicy="no-referrer" 
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-extrabold text-slate-900 text-sm">{m.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{m.id}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-805">{m.brand}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-slate-600 font-semibold">{m.category}</span>
                    </td>
                    <td className="px-5 py-4 text-center font-bold text-[#00236f] text-sm">
                      {formatVND(m.pricePerDay)}
                    </td>
                    <td className="px-5 py-4 text-center font-mono font-bold text-slate-700">
                      {formatVND(m.deposit)}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold border uppercase tracking-wider ${
                        m.status === 'Hoạt động' 
                          ? 'bg-emerald-55 bg-opacity-10 text-emerald-700 border-emerald-200' 
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right action-cell">
                      {/* SIBLING ACTIONS ROW IN TABLE (All on equal footing) */}
                      <div className="action-group justify-end">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(m)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition"
                        >
                          Xem chi tiết
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(m)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer transition"
                        >
                          Cập nhật
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenToggleStatus(m)}
                          className={`cursor-pointer transition ${
                            m.status === 'Hoạt động'
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {m.status === 'Hoạt động' ? 'Ẩn' : 'Kích hoạt'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenConfigCombo(m)}
                          className="bg-purple-50 hover:bg-purple-100 text-purple-700 cursor-pointer transition"
                        >
                          Cấu hình bộ đi kèm
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(m)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer transition"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* ==================== SCREEN MODALS (DIRECT OVERLAYS) ==================== */}

      {/* 1. MODAL: XEM CHI TIẾT MẪU THIẾT BỊ (ReadOnly, NO Actions except Đóng) */}
      {showDetailModal && selectedModel && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden w-full max-w-2xl shadow-2xl animate-scaleIn text-left flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Chi tiết mẫu thiết bị</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Mã số mẫu: {selectedModel.id}</p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowDetailModal(false)}
                className="p-1.5 hover:bg-slate-205 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs text-slate-650 leading-relaxed font-semibold">
              
              {/* Part A: Thông tin mẫu thiết bị */}
              <div className="space-y-4">
                <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 flex items-center gap-3">
                  <div className="w-16 h-16 border rounded bg-white flex items-center justify-center overflow-hidden shrink-0">
                    <img 
                      src={selectedModel.image} 
                      alt={selectedModel.name} 
                      className="max-h-full max-w-full object-contain" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{selectedModel.name}</h4>
                    <p className="text-slate-500 font-bold mt-0.5">{selectedModel.brand} • {selectedModel.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Hãng sản xuất</span>
                    <p className="text-slate-900 font-extrabold text-sm mt-0.5">{selectedModel.brand}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Danh mục phân loại</span>
                    <p className="text-slate-900 font-extrabold text-sm mt-0.5">{selectedModel.category}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Giá thuê/ngày</span>
                    <p className="text-[#00236f] font-black text-base mt-0.5">{formatVND(selectedModel.pricePerDay)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Tiền cọc</span>
                    <p className="text-slate-900 font-black text-base mt-0.5">{formatVND(selectedModel.deposit)}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Trạng thái trưng bày</span>
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider mt-1.5 ${
                      selectedModel.status === 'Hoạt động' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-250' 
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}>
                      {selectedModel.status}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Mô tả chi tiết</span>
                    <p className="text-slate-700 bg-slate-50 p-3.5 border border-slate-100 rounded-lg italic mt-1 font-medium leading-relaxed">
                      "{selectedModel.description || 'Không có mô tả chi tiết.'}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Part B: Bộ đi kèm hiện tại */}
              <div className="space-y-3 pt-2">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Bộ đi kèm hiện tại</h4>
                </div>

                <div className="table-wrapper border border-slate-150 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-[11px] font-medium border-collapse bg-slate-50/50">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                        <th className="px-3.5 py-2">Tên thành phần</th>
                        <th className="px-3.5 py-2">Loại quản lý</th>
                        <th className="px-3.5 py-2 text-center">Số lượng</th>
                        <th className="px-3.5 py-2 text-center">Bắt buộc</th>
                        <th className="px-3.5 py-2">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 text-slate-800">
                      {!selectedModel.components || selectedModel.components.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-3.5 py-4 text-center italic text-slate-400 font-medium">
                            Chưa cấu hình thành phần linh phụ kiện đi kèm.
                          </td>
                        </tr>
                      ) : (
                        selectedModel.components.map((comp, idx) => (
                          <tr key={idx} className="bg-white hover:bg-slate-50/30">
                            <td className="px-3.5 py-2 font-bold text-slate-900">{comp.name}</td>
                            <td className="px-3.5 py-2 font-semibold text-slate-500">{comp.type}</td>
                            <td className="px-3.5 py-2 text-center font-mono font-bold text-slate-905">{comp.qty}</td>
                            <td className="px-3.5 py-2 text-center font-bold">
                              {comp.required ? (
                                <span className="text-indigo-600 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded text-[9.5px]">Bắt buộc</span>
                              ) : (
                                <span className="text-slate-455 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[9.5px]">Không</span>
                              )}
                            </td>
                            <td className="px-3.5 py-2 text-slate-500 max-w-[150px] truncate" title={comp.notes}>{comp.notes || '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Footer containing ONLY Đóng button */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50">
              <button 
                type="button" 
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}


      {/* 2. MODAL: THÊM MẪU THIẾT BỊ MỚI */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <form 
            onSubmit={handleSaveAdd}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden w-full max-w-xl shadow-2xl animate-scaleIn text-left flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-sm font-black text-[#00236f] uppercase tracking-wide">Thêm mẫu thiết bị mới</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Quy chuẩn định mức cơ sở dữ liệu mẫu dải máy ảnh linh phụ kiện toàn hệ thống</p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 hover:bg-slate-205 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs font-semibold text-slate-650">
              <div className="space-y-4">
                <div>
                  <label className="text-slate-505 block font-bold mb-1">Tên mẫu thiết bị <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    value={formFields.name}
                    onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                    placeholder="Nhập tên mẫu (Ví dụ: Sony A7 IV)"
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 font-bold bg-slate-50 outline-none focus:border-[#00236f]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-505 block font-bold mb-1">Hãng <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      required 
                      value={formFields.brand}
                      onChange={(e) => setFormFields({ ...formFields, brand: e.target.value })}
                      placeholder="Ví dụ: Sony, Fujifilm, Canon"
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 font-bold bg-slate-50 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-505 block font-bold mb-1">Danh mục</label>
                    <select 
                      value={formFields.category}
                      onChange={(e) => setFormFields({ ...formFields, category: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 bg-white rounded-lg cursor-pointer font-bold outline-none"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-505 block font-bold mb-1">Giá thuê/ngày (VND) <span className="text-rose-500">*</span></label>
                    <input 
                      type="number" 
                      required 
                      min="0"
                      value={formFields.pricePerDay || ''}
                      onChange={(e) => setFormFields({ ...formFields, pricePerDay: Number(e.target.value) || 0 })}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 font-bold font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-505 block font-bold mb-1">Tiền cọc (VND) <span className="text-rose-500">*</span></label>
                    <input 
                      type="number" 
                      required 
                      min="0"
                      value={formFields.deposit || ''}
                      onChange={(e) => setFormFields({ ...formFields, deposit: Number(e.target.value) || 0 })}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 font-bold font-mono outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-505 block font-bold mb-1">Mô tả</label>
                  <textarea 
                    value={formFields.description}
                    onChange={(e) => setFormFields({ ...formFields, description: e.target.value })}
                    rows="3" 
                    placeholder="Nhập thông tin tính năng đặc tả của sườn máy..."
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 font-medium outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-slate-505 block font-bold mb-1">Trạng thái</label>
                  <select 
                    value={formFields.status}
                    onChange={(e) => setFormFields({ ...formFields, status: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 bg-white rounded-lg cursor-pointer font-bold outline-none"
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Ẩn">Ẩn</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-550 block font-bold mb-1">Ảnh minh họa</label>
                  <div 
                    onClick={handleFileClick}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition"
                  >
                    <UploadCloud className="w-8 h-8 text-slate-400 mb-1" />
                    <span className="font-bold text-slate-700 block text-[11px]">Chọn ảnh minh họa hoặc nhấn để giả lập upload</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Định dạng JPG, PNG lên tới 5MB</span>
                    {simulatedFile && (
                      <div className="mt-2 inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded text-[10px] font-bold">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Đã nạp file: {simulatedFile.name} ({(simulatedFile.size/1000).toFixed(0)} KB)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                className="px-4.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition cursor-pointer"
              >
                Hủy
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-[#00236f] hover:bg-slate-800 text-white font-black rounded-xl transition shadow-sm cursor-pointer"
              >
                Lưu mẫu
              </button>
            </div>
          </form>
        </div>
      )}


      {/* 3. MODAL: CẬP NHẬT MẪU THIẾT BỊ (Mở trực tiếp từ bảng danh sách) */}
      {showEditModal && selectedModel && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <form 
            onSubmit={handleSaveEdit}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden w-full max-w-xl shadow-2xl animate-scaleIn text-left flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-sm font-black text-[#00236f] uppercase tracking-wide">Cập nhật mẫu thiết bị</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">ID sườn mẫu: #{selectedModel.id}</p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowEditModal(false)}
                className="p-1.5 hover:bg-slate-205 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs font-semibold text-slate-650">
              <div className="space-y-4">
                <div>
                  <label className="text-slate-505 block font-bold mb-1">Tên mẫu thiết bị <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    value={formFields.name}
                    onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 font-bold bg-slate-50 outline-none focus:border-[#00236f]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-505 block font-bold mb-1">Hãng <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      required 
                      value={formFields.brand}
                      onChange={(e) => setFormFields({ ...formFields, brand: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 font-bold bg-slate-50 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-505 block font-bold mb-1">Danh mục</label>
                    <select 
                      value={formFields.category}
                      onChange={(e) => setFormFields({ ...formFields, category: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 bg-white rounded-lg cursor-pointer font-bold outline-none"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-505 block font-bold mb-1">Giá thuê/ngày (VND) <span className="text-rose-500">*</span></label>
                    <input 
                      type="number" 
                      required 
                      min="0"
                      value={formFields.pricePerDay || ''}
                      onChange={(e) => setFormFields({ ...formFields, pricePerDay: Number(e.target.value) || 0 })}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 font-bold font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-505 block font-bold mb-1">Tiền cọc (VND) <span className="text-rose-500">*</span></label>
                    <input 
                      type="number" 
                      required 
                      min="0"
                      value={formFields.deposit || ''}
                      onChange={(e) => setFormFields({ ...formFields, deposit: Number(e.target.value) || 0 })}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 font-bold font-mono outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-505 block font-bold mb-1">Mô tả</label>
                  <textarea 
                    value={formFields.description}
                    onChange={(e) => setFormFields({ ...formFields, description: e.target.value })}
                    rows="3" 
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-900 font-medium outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-slate-505 block font-bold mb-1">Trạng thái</label>
                  <select 
                    value={formFields.status}
                    onChange={(e) => setFormFields({ ...formFields, status: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 bg-white rounded-lg cursor-pointer font-bold outline-none"
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Ẩn">Ẩn</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-550 block font-bold mb-1">Ảnh minh họa sườn</label>
                  <div 
                    onClick={handleFileClick}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition"
                  >
                    <UploadCloud className="w-8 h-8 text-slate-400 mb-1" />
                    <span className="font-bold text-slate-700 block text-[11px]">Thay đổi ảnh minh họa sườn</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Click để giả lập upload ảnh mới</span>
                    {simulatedFile && (
                      <div className="mt-2 inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded text-[10px] font-bold">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Đã gán file: {simulatedFile.name}</span>
                      </div>
                    )}
                  </div>
                  {formFields.image && (
                    <div className="mt-2.5 flex items-center gap-2 bg-slate-50 p-2 border border-slate-100 rounded-lg">
                      <div className="w-10 h-10 border bg-white rounded overflow-hidden flex items-center justify-center shrink-0">
                        <img src={formFields.image} alt="Preview" className="max-h-full max-w-full object-contain pointer-events-none" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono italic truncate">Đường dẫn: {formFields.image}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                type="button" 
                onClick={() => setShowEditModal(false)}
                className="px-4.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition cursor-pointer"
              >
                Hủy
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-[#00236f] hover:bg-slate-800 text-white font-black rounded-xl transition shadow-sm cursor-pointer"
              >
                Lưu cập nhật
              </button>
            </div>
          </form>
        </div>
      )}


      {/* 4. MODAL: ẨN / KÍCH HOẠT MẪU THIẾT BỊ (Mở trực tiếp từ bảng danh sách) */}
      {showToggleStatusModal && selectedModel && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden w-full max-w-md shadow-2xl animate-scaleIn text-left">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                {selectedModel.status === 'Hoạt động' ? 'Ẩn mẫu thiết bị' : 'Kích hoạt mẫu thiết bị'}
              </h3>
              <button 
                type="button" 
                onClick={() => setShowToggleStatusModal(false)}
                className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 text-xs text-slate-650 space-y-3 font-semibold leading-relaxed">
              <p>
                Bạn có chắc chắn muốn thực hiện hành động này đối với mẫu thiết bị dưới đây hay không?
              </p>
              
              <div className="bg-slate-50/80 p-3.5 border border-slate-150 rounded-xl space-y-1">
                <p className="text-slate-900 font-black text-sm">{selectedModel.name}</p>
                <p className="text-slate-400 font-mono text-[10px]">Mã sườn máy: {selectedModel.id}</p>
                <p className="text-[11px] text-slate-500 font-bold">
                  Trạng thái hiện tại: <span className="text-slate-800 font-extrabold">{selectedModel.status}</span>
                </p>
                <p className="text-[11px] text-indigo-700 font-black pt-1">
                  💡 Sau khi xác nhận, trạng thái sẽ được chuyển thành:{' '}
                  <span className="underline font-black">{selectedModel.status === 'Hoạt động' ? 'Ẩn' : 'Hoạt động'}</span>.
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-5 py-3.5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                type="button" 
                onClick={() => setShowToggleStatusModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-850 font-bold rounded-lg transition text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button 
                type="button"
                onClick={handleConfirmToggleStatus}
                className={`px-4.5 py-2 font-black rounded-lg transition text-xs shadow-xs cursor-pointer text-white ${
                  selectedModel.status === 'Hoạt động'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {selectedModel.status === 'Hoạt động' ? 'Xác nhận ẩn' : 'Xác nhận kích hoạt'}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* 5. MODAL: CẤU HÌNH BỘ ĐI KÈM (Mở trực tiếp từ bảng danh sách, NO serial details) */}
      {showConfigComboModal && selectedModel && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden w-full max-w-4xl shadow-2xl animate-scaleIn text-left flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-sm font-black text-[#00236f] uppercase tracking-wide">Cấu hình bộ đi kèm thiết bị</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Bổ sung định mức các bộ phụ kiện, vật chất, linh kiện bắt buộc đi kèm khi giao nhận máy.</p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowConfigComboModal(false)}
                className="p-1.5 hover:bg-slate-205 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs text-slate-650 leading-relaxed font-semibold">
              
              {/* Product Info Banner */}
              <div className="bg-slate-50 p-4 border border-slate-150 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Mẫu thiết bị đang cấu hình</span>
                <div className="flex justify-between items-center flex-wrap gap-2 mt-1.5">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{selectedModel.name}</h4>
                    <p className="text-slate-500 font-bold mt-0.5">Hãng sườn: {selectedModel.brand} • Danh mục: {selectedModel.category}</p>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-150 rounded px-2.5 py-1 font-black">
                    Mã sườn: {selectedModel.id}
                  </span>
                </div>
              </div>

              {/* Combo accompanying components list */}
              <div className="space-y-3">
                <div className="flex justify-between items-center flex-wrap gap-2 border-b pb-2">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Danh sách thành phần đi kèm hiện tại</h4>
                  <button
                    type="button"
                    onClick={handleAddComponentRow}
                    className="px-3 py-1.5 bg-[#00236f] hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Thêm thành phần
                  </button>
                </div>

                <div className="table-wrapper border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-slate-650 border-collapse bg-white">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold text-[11px]">
                        <th className="px-3.5 py-2.5 min-w-[150px]">Tên thành phần</th>
                        <th className="px-3.5 py-2.5 min-w-[150px]">Loại quản lý</th>
                        <th className="px-3.5 py-2.5 text-center min-w-[80px]">Số lượng</th>
                        <th className="px-3.5 py-2.5 min-w-[110px]">Nguồn tham chiếu</th>
                        <th className="px-3.5 py-2.5 text-center min-w-[70px]">Bắt buộc</th>
                        <th className="px-3.5 py-2.5 min-w-[150px]">Ghi chú</th>
                        <th className="px-3.5 py-2.5 text-right min-w-[60px]">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-xs">
                      {tempComponents.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-3.5 py-8 text-center italic text-slate-400 font-medium">
                            Chưa có phụ kiện nào được gán vào bộ đi kèm. Vui lòng bấm [Thêm thành phần] để bắt đầu cấu hình.
                          </td>
                        </tr>
                      ) : (
                        tempComponents.map((comp, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/40">
                            <td className="px-3 py-2">
                              <input 
                                type="text"
                                required
                                value={comp.name}
                                onChange={(e) => handleComponentChange(idx, 'name', e.target.value)}
                                placeholder="Ví dụ: Pin Sony NP-FZ100"
                                className="w-full p-2 border border-slate-200 rounded text-slate-900 font-bold bg-slate-50 focus:bg-white outline-none focus:border-[#00236f]"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <select
                                value={comp.type}
                                onChange={(e) => handleComponentChange(idx, 'type', e.target.value)}
                                className="w-full p-2 border border-slate-200 bg-white rounded cursor-pointer font-bold outline-none"
                              >
                                <option value="Thiết bị vật lý định danh">Thiết bị vật lý định danh</option>
                                <option value="Phụ kiện số lượng">Phụ kiện số lượng</option>
                              </select>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <input 
                                type="number"
                                required
                                min="1"
                                value={comp.qty}
                                onChange={(e) => handleComponentChange(idx, 'qty', Number(e.target.value) || 1)}
                                className="w-16 p-2 border border-slate-200 rounded text-center text-slate-900 font-bold font-mono outline-none"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input 
                                type="text"
                                value={comp.source || ''}
                                onChange={(e) => handleComponentChange(idx, 'source', e.target.value)}
                                placeholder="Kho phụ kiện"
                                className="w-full p-2 border border-slate-200 rounded text-slate-900 outline-none"
                              />
                            </td>
                            <td className="px-3 py-2 text-center">
                              <input 
                                type="checkbox"
                                checked={comp.required}
                                onChange={(e) => handleComponentChange(idx, 'required', e.target.checked)}
                                className="cursor-pointer h-4 w-4 text-indigo-700 border-slate-200 focus:ring-1"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input 
                                type="text"
                                value={comp.notes || ''}
                                onChange={(e) => handleComponentChange(idx, 'notes', e.target.value)}
                                placeholder="Trạng thái bàn giao hoặc dán nhãn..."
                                className="w-full p-2 border border-slate-200 rounded text-slate-700 outline-none"
                              />
                            </td>
                            <td className="px-3 py-2 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveComponentRow(idx)}
                                className="p-1 px-2.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded border border-rose-150 transition font-bold"
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                type="button" 
                onClick={() => setShowConfigComboModal(false)}
                className="px-4.5 py-2 bg-slate-250 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button 
                type="button"
                onClick={handleSaveConfigCombo}
                className="px-5 py-2 bg-[#00236f] hover:bg-slate-800 text-white font-black rounded-lg text-xs shadow-xs cursor-pointer"
              >
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}


      {/* 6. MODAL: XÓA MẪU THIẾT BỊ (Mở trực tiếp từ danh sách) */}
      {showDeleteConfirmModal && selectedModel && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden w-full max-w-md shadow-2xl animate-scaleIn text-left">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xs font-black text-rose-700 uppercase tracking-wide">Xóa mẫu thiết bị</h3>
              <button 
                type="button" 
                onClick={() => setShowDeleteConfirmModal(false)}
                className="p-1 hover:bg-slate-205 rounded text-slate-400 hover:text-slate-700 cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 text-xs text-slate-650 space-y-4 font-semibold leading-relaxed">
              <p className="text-slate-700 text-bold">
                Hệ thống yêu cầu xác nhận xóa vĩnh viễn định dạng mẫu thiết bị này:
              </p>

              <div className="bg-slate-50 p-3.5 border border-slate-150 rounded-xl space-y-1.5">
                <p className="text-slate-950 font-black text-sm">{selectedModel.name}</p>
                <p className="text-slate-500 font-bold">Hãng: {selectedModel.brand} • Danh mục: {selectedModel.category}</p>
                <p className="text-[11px] text-slate-500">
                  Trạng thái hiện tại: <span className="font-extrabold text-slate-800">{selectedModel.status}</span>
                </p>
              </div>

              {/* Ràng buộc nghiệp vụ: Nếu mẫu đang liên quan tới thiết bị vật lý, đơn thuê hoặc bộ đi kèm thì không cho phép xóa */}
              {selectedModel.isLinked ? (
                <div className="p-3 bg-rose-50 border border-rose-150 rounded-lg flex items-start gap-2.5 text-rose-950">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-[10.5px]">
                    <span className="font-black block uppercase tracking-wider text-[9px] mb-0.5">Lỗi ràng buộc:</span>
                    Không thể xóa mẫu thiết bị này vì đang liên quan đến các thiết bị vật lý sẵn có trong kho hàng, các gói bộ đi kèm hoặc đơn hàng thuê máy ảnh đang hiện hành.
                  </div>
                </div>
              ) : (
                <p className="text-amber-700 bg-amber-50/50 p-2.5 rounded border border-amber-200 text-[11px]">
                  ⚠️ <strong>Cảnh báo:</strong> Thao tác xóa là vĩnh viễn và không thể khôi phục tự động.
                </p>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="px-5 py-3.5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                type="button" 
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-350 text-slate-800 font-bold rounded-lg text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button 
                type="button"
                disabled={selectedModel.isLinked}
                onClick={handleConfirmDelete}
                className={`px-4 py-2 font-black rounded-lg text-xs transition shadow-xs ${
                  selectedModel.isLinked
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                    : 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer'
                }`}
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
