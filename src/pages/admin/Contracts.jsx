import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Calendar, 
  User, 
  FileCheck2, 
  Eye, 
  Trash2, 
  Save, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  UploadCloud, 
  ArrowRight, 
  Settings, 
  X,
  FileCheck
} from 'lucide-react';

const INITIAL_CONTRACTS = [
  {
    id: 'CTR-1001',
    orderCode: 'ORD-5001',
    customerName: 'Nguyễn Văn Bình',
    customerPhone: '0901 234 567',
    customerInitial: 'NB',
    signDate: '2026-06-11',
    creator: 'Trần Văn A',
    status: 'uploaded', // uploaded, signed, pending
    statusLabel: 'Đã upload',
    avatarBg: 'bg-blue-100 text-blue-800',
    items: [
      { name: 'Body Sony Alpha A7 IV', sn: 'SN-A74-99201', price: '450.000đ/ngày' }
    ],
    scannedFile: 'file_hop_dong_Binh_signed.pdf',
    scannedTime: '10:30 11/06/2026',
    notes: 'Khách hàng cam kết bảo quản cẩn thận, đã đối chiếu khớp CCCD.'
  },
  {
    id: 'CTR-1002',
    orderCode: 'ORD-5002',
    customerName: 'Trần Thị Bích',
    customerPhone: '0912 345 678',
    customerInitial: 'TB',
    signDate: '2026-06-10',
    creator: 'Trần Văn A',
    status: 'signed',
    statusLabel: 'Đã ký',
    avatarBg: 'bg-amber-100 text-amber-850',
    items: [
      { name: 'Body Sony Alpha A7 IV', sn: '88201922', price: '450.000đ/ngày' },
      { name: 'Lens Sony FE 24-70mm f/2.8 GM II', sn: '77112233', price: '350.000đ/ngày' }
    ],
    scannedFile: null,
    scannedTime: null,
    notes: 'Thiếu bản scan gốc, hợp đồng giấy đã lấy chữ ký đầy đủ, chờ chụp scan lưu hệ thống.'
  },
  {
    id: 'CTR-1003',
    orderCode: 'ORD-5003',
    customerName: 'Lê Văn Cường',
    customerPhone: '0987 654 321',
    customerInitial: 'LC',
    signDate: '2026-06-09',
    creator: 'Lê Thị C',
    status: 'pending',
    statusLabel: 'Chưa ký',
    avatarBg: 'bg-slate-100 text-slate-800',
    items: [
      { name: 'Canon EOS R5 Body', sn: 'SN-CAN-88220', price: '600.000đ/ngày' }
    ],
    scannedFile: null,
    scannedTime: null,
    notes: 'Chờ khách hàng đến trực tiếp ký hợp đồng giấy khi nhận bàn giao máy.'
  }
];

export default function Contracts() {
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Scanned file attachment simulation
  const [mockAttachedFile, setMockAttachedFile] = useState(null);

  // Filters state
  const [searchCode, setSearchCode] = useState('');
  const [searchOrder, setSearchOrder] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // form state for edit inside detail modal
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [signDate, setSignDate] = useState('');
  const [creator, setCreator] = useState('');

  // Form for creation
  const [newOrderCode, setNewOrderCode] = useState('ORD-5004');
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  const handleOpenDetail = (ctr) => {
    setSelectedContract(ctr);
    setNotes(ctr.notes || '');
    setStatus(ctr.status);
    setSignDate(ctr.signDate);
    setCreator(ctr.creator);
    setMockAttachedFile(ctr.scannedFile ? { name: ctr.scannedFile, time: ctr.scannedTime } : null);
    setShowDetailModal(true);
  };

  const handleSaveContract = () => {
    if (!selectedContract) return;

    const updated = contracts.map(c => {
      if (c.id === selectedContract.id) {
        return {
          ...c,
          notes,
          status,
          statusLabel: status === 'uploaded' ? 'Đã upload' : status === 'signed' ? 'Đã ký' : 'Chưa ký',
          signDate,
          creator,
          scannedFile: mockAttachedFile ? mockAttachedFile.name : null,
          scannedTime: mockAttachedFile ? mockAttachedFile.time : null
        };
      }
      return c;
    });

    setContracts(updated);
    setShowDetailModal(false);
    alert(`Cập nhật hợp đồng thương lượng ${selectedContract.id} cực kỳ thành công!`);
  };

  const handleNewUploadClick = () => {
    setMockAttachedFile({
      name: `scanned_contract_${selectedContract?.id || 'CTR-NEW'}_signed.pdf`,
      time: 'Vừa xong'
    });
    if (status === 'pending' || status === 'signed') {
      setStatus('uploaded');
    }
  };

  const handleDeleteAttachedFile = () => {
    setMockAttachedFile(null);
    if (status === 'uploaded') {
      setStatus('signed');
    }
  };

  const handleCreateContract = (e) => {
    e.preventDefault();
    if (!newCustName.trim()) {
      alert('Vui lòng điền tên khách hàng!');
      return;
    }

    const nextId = `CTR-${1000 + contracts.length + 1}`;
    const newContractObj = {
      id: nextId,
      orderCode: newOrderCode,
      customerName: newCustName,
      customerPhone: newCustPhone || 'Chưa cung cấp',
      customerInitial: newCustName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      signDate: new Date().toISOString().split('T')[0],
      creator: 'Trần Văn A',
      status: 'pending',
      statusLabel: 'Chưa ký',
      avatarBg: 'bg-emerald-100 text-emerald-800',
      items: [
        { name: 'Thiết bị sản xuất combo chính', sn: 'SN-MOCK-RANDOM', price: '500.000đ/ngày' }
      ],
      scannedFile: null,
      scannedTime: null,
      notes: 'Hợp đồng khởi tạo tự động, chờ khách hàng ký giấy trực tiếp khi bàn giao.'
    };

    setContracts([newContractObj, ...contracts]);
    setNewCustName('');
    setNewCustPhone('');
    setShowCreateModal(false);
    alert(`Khởi tạo thành công bản hợp đồng giấy ${nextId} phục vụ cho đơn ${newOrderCode}!`);
  };

  const handleResetFilters = () => {
    setSearchCode('');
    setSearchOrder('');
    setSearchCustomer('');
    setFilterStatus('');
  };

  const filteredContracts = contracts.filter(c => {
    const matchCode = c.id.toLowerCase().includes(searchCode.toLowerCase().trim());
    const matchOrder = c.orderCode.toLowerCase().includes(searchOrder.toLowerCase().trim());
    const matchCust = c.customerName.toLowerCase().includes(searchCustomer.toLowerCase().trim());
    const matchStatus = filterStatus ? c.status === filterStatus : true;
    return matchCode && matchOrder && matchCust && matchStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#00236f]">Hợp đồng giấy</h2>
          <p className="text-sm text-slate-500 mt-1">Quản lý, ký nhận và lưu giữ hồ sơ pháp lý hợp đồng vật lý cho khách thuê.</p>
        </div>
        <div className="flex gap-3">
          <button 
            type="button" 
            onClick={() => alert('Đang xuất mẫu Excel báo cáo hồ sơ lưu kho vật lý...')}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>
          <button 
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-[#fea619] hover:bg-[#fea619]/90 text-[#2a1700] rounded-lg text-xs font-black shadow-sm flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Tạo hợp đồng mới
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Mã hợp đồng</label>
            <input 
              type="text" 
              placeholder="CTR-XXXX"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Mã đơn thuê</label>
            <input 
              type="text" 
              placeholder="ORD-XXXX"
              value={searchOrder}
              onChange={(e) => setSearchOrder(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Khách hàng</label>
            <input 
              type="text" 
              placeholder="Nhập tên khách..."
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Trạng thái hợp đồng</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chưa ký</option>
              <option value="signed">Đã ký</option>
              <option value="uploaded">Đã upload scan</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2.5">
          <button 
            type="button" 
            onClick={handleResetFilters}
            className="px-4 py-2 hover:bg-slate-100 text-xs font-bold text-slate-600 rounded-lg transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      </section>

      {/* Contract Listing Table */}
      <section className="table-wrapper rounded-xl border border-slate-205 shadow-sm overflow-hidden">
        <div className="w-full">
          <table className="data-table text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-150 text-[#0f172a] text-[13px] font-semibold">
                <th className="px-6 py-4 whitespace-nowrap font-semibold">Mã hợp đồng</th>
                <th className="px-6 py-4 whitespace-nowrap font-semibold">Mã đơn thuê</th>
                <th className="px-6 py-4 min-w-[170px] font-semibold">Khách hàng</th>
                <th className="px-6 py-4 whitespace-nowrap font-semibold">Ngày ký</th>
                <th className="px-6 py-4 whitespace-nowrap font-semibold">Người lập</th>
                <th className="px-6 py-4 whitespace-nowrap font-semibold">Trạng thái</th>
                <th className="px-6 py-4 text-right whitespace-nowrap font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 font-semibold text-slate-705">
              {filteredContracts.length > 0 ? (
                filteredContracts.map((ctr) => (
                  <tr key={ctr.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-black text-[#00236f] font-mono whitespace-nowrap cell-code">{ctr.id}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono font-medium whitespace-nowrap cell-code">{ctr.orderCode}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full ${ctr.avatarBg} flex items-center justify-center font-black text-[10px] shrink-0`}>
                          {ctr.customerInitial}
                        </div>
                        <div className="whitespace-nowrap">
                          <p className="font-semibold text-slate-800">{ctr.customerName}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{ctr.customerPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-semibold whitespace-nowrap cell-date">{ctr.signDate}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap">{ctr.creator}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ctr.status === 'uploaded' && (
                        <span className="status-badge bg-emerald-50 text-emerald-700 border border-emerald-150 whitespace-nowrap">
                          {ctr.statusLabel}
                        </span>
                      )}
                      {ctr.status === 'signed' && (
                        <span className="status-badge bg-blue-50 text-blue-700 border border-blue-150 whitespace-nowrap">
                          {ctr.statusLabel}
                        </span>
                      )}
                      {ctr.status === 'pending' && (
                        <span className="status-badge bg-amber-50 text-amber-700 border border-amber-150 whitespace-nowrap">
                          {ctr.statusLabel}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="table-action-group justify-end">
                        <button 
                          onClick={() => handleOpenDetail(ctr)}
                          className="table-action-button text-[#00236f] bg-[#00236f]/5 hover:bg-[#00236f]/10 cursor-pointer whitespace-nowrap"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-slate-400 italic">
                    Không tìm thấy hợp đồng giấy phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Contract Detail/Editor Modal Overlay */}
      {showDetailModal && selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5 text-[#00236f]">
                <FileText className="w-5 h-5" />
                <h3 className="text-sm font-black font-serif">Chi tiết &amp; Cập nhật hợp đồng giấy {selectedContract.id}</h3>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Scroll */}
            <div className="p-6 space-y-6 overflow-y-auto shrink select-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Panel Info Left - Order Info */}
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-3.5">
                  <h4 className="text-[10px] font-extrabold text-[#00236f] uppercase tracking-widest">Thông tin đơn thuê</h4>
                  
                  <div className="flex justify-between border-b border-slate-200 pb-2 text-xs">
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">Mã đơn thuê</span>
                    <span className="font-mono font-bold text-slate-800">{selectedContract.orderCode}</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-slate-400 font-semibold uppercase text-[10px] block">Danh sách máy móc</span>
                    {selectedContract.items.map((item, idx) => (
                      <div key={idx} className="bg-white border rounded p-2 text-xs flex justify-between items-center shadow-xs">
                        <div>
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">S/N: {item.sn}</p>
                        </div>
                        <span className="font-bold text-blue-900 text-[11px]">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Panel Info Right - Client details */}
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-3">
                  <h4 className="text-[10px] font-extrabold text-[#00236f] uppercase tracking-widest">Thông tin đối tác / Khách hàng</h4>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#fea619]/10 text-amber-800 flex items-center justify-center font-black">
                      {selectedContract.customerInitial}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">{selectedContract.customerName}</p>
                      <p className="text-xs font-mono text-slate-400">{selectedContract.customerPhone}</p>
                    </div>
                  </div>

                  <div className="pt-1.5 flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded-full border border-emerald-150 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      CCCD Định danh gốc đã duyệt
                    </span>
                  </div>
                </div>
              </div>

              {/* Editable Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 block ml-0.5">Người lập hợp đồng</label>
                  <input 
                    type="text"
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 block ml-0.5">Ngày ký kết</label>
                  <input 
                    type="date"
                    value={signDate}
                    onChange={(e) => setSignDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 block ml-0.5">Trạng thái xử lý pháp lý</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-lg focus:ring-1 focus:ring-blue-500 outline-none font-bold text-blue-900"
                  >
                    <option value="pending">Chờ ký giấy</option>
                    <option value="signed">Đã ký (chờ file scan)</option>
                    <option value="uploaded">Đã upload scan lưu kho</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 block ml-0.5">Ghi chú lưu kho</label>
                <textarea
                  rows="2.5"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Điền ghi nhớ pháp lý..."
                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500/50 outline-none transition-all resize-none placeholder:text-slate-400"
                />
              </div>

              {/* Scanned upload area */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 block ml-0.5">Bản scan hợp đồng đóng dấu ký kết</label>
                
                {!mockAttachedFile ? (
                  <div 
                    onClick={handleNewUploadClick}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-5 hover:bg-slate-50/70 transition-all cursor-pointer flex flex-col items-center justify-center text-center group"
                  >
                    <UploadCloud className="w-8 h-8 text-slate-300 group-hover:text-[#00236f] transition-all" />
                    <p className="text-xs text-slate-500 mt-1 font-bold">Kéo thả file scan chụp JPG/PNG hoặc click để chọn tệp</p>
                    <p className="text-[10px] text-slate-405 mt-0.5">Kích thước file tệp PDF tối đa 10MB</p>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 text-red-700 rounded-lg flex items-center justify-center font-black shrink-0">
                        PDF
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-xs truncate max-w-[250px]">{mockAttachedFile.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Lưu trữ lúc: {mockAttachedFile.time}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => alert('Đang tải xem trước tệp PDF...')}
                        className="px-3 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-[#00236f] hover:bg-slate-100 transition cursor-pointer"
                      >
                        File mẫu
                      </button>
                      <button 
                        type="button"
                        onClick={handleDeleteAttachedFile}
                        className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Warning label */}
              {status !== 'uploaded' && (
                <div className="bg-amber-50 border border-amber-200/60 text-amber-800 text-xs p-3.5 rounded-lg flex gap-2.5 items-start">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold">Cảnh báo pháp lý lưu trữ</h5>
                    <p className="mt-0.5 text-[11px] opacity-90 leading-relaxed">
                      Thiết bị chưa được upload bản scan kỹ thuật số. Vui lòng in 02 bản hợp đồng cho khách ký tên lăn tay đầy đủ, chụp/scan rồi upload đính kèm bản mềm để đảm bảo giá trị pháp lý bồi thường khi xảy ra tranh chấp.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition"
              >
                Hủy quay lại
              </button>
              <button 
                type="button"
                onClick={handleSaveContract}
                className="px-6 py-2.5 bg-[#00236f] hover:bg-blue-900 border-none text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contract Creation Modal Overlay */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <form 
            onSubmit={handleCreateContract}
            className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="px-5 py-4.5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="text-xs font-black uppercase text-slate-700 block">Tạo hồ sơ hợp đồng mới</h3>
              <button 
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-200 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-4 text-xs select-none">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Chọn mã đơn thuê (Chờ chuẩn bị)</label>
                <select
                  value={newOrderCode}
                  onChange={(e) => setNewOrderCode(e.target.value)}
                  className="w-full border border-slate-200 bg-slate-50 px-3 py-2 rounded-lg font-bold text-[#00236f]"
                >
                  <option value="ORD-5004">ORD-5004 (Chờ bàn giao máy)</option>
                  <option value="ORD-5005">ORD-5005 (Đơn cọc giữ chỗ mới)</option>
                  <option value="ORD-5006">ORD-5006 (Đang soạn thiết bị)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Tên khách hàng thuê</label>
                <input 
                  type="text"
                  required
                  placeholder="Nhập tên đối tác chính..."
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full border border-slate-200 px-3 py-2 rounded-lg text-slate-700 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Số điện thoại liên lạc</label>
                <input 
                  type="text"
                  placeholder="09xx xxx xxx"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="w-full border border-slate-200 px-3 py-2 rounded-lg text-slate-700 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200 text-[10px] text-slate-500 leading-relaxed">
                Khi khởi tạo hợp đồng, trạng thái ban đầu sẽ mặc định ở mức <span className="font-bold text-amber-700">Chưa ký</span>. Sau khi khách hàng đến kiểm máy, in ấn 02 bản hợp đồng giấy kí tên lăn tay đầy đủ, nhân viên sẽ chuyển hồ sơ sang <span className="font-bold text-blue-700">Đã ký</span> và upload scan.
              </div>
            </div>

            <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5">
              <button 
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 hover:bg-slate-100 text-slate-600 font-bold"
              >
                Hủy
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-[#fea619] hover:bg-[#fea619]/90 text-[#2a1700] rounded-lg font-black active:scale-95 transition-all shadow-sm"
              >
                Tạo bản ghi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Archiving process static guide bento widget */}
      <div className="p-5 bg-gradient-to-br from-[#00236f]/5 to-blue-50 border-l-4 border-[#00236f] rounded-xl flex items-start gap-4 shadow-sm select-none">
        <FileCheck className="w-5 h-5 text-[#00236f] shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-[#00236f] text-sm">Quy trình lưu trữ &amp; Bảo mật hồ sơ vật lý</h4>
          <ul className="mt-2 space-y-1.5 text-xs text-slate-600 list-disc list-inside">
            <li>Quản lý chặt chẽ mã vạch / SKU kết nối trực tiếp với ID của đơn và thiết bị trong luồng chuẩn bị máy.</li>
            <li>In 02 bản cứng biểu mẫu hợp đồng tiêu chuẩn hệ thống T-Rent soạn thảo.</li>
            <li>Kiểm kê tình trạng thiết bị ký nhận biên bản bàn giao, cam kết bồi thường rõ ràng.</li>
            <li>Lưu trữ kho giấy vật lý bảo mật riêng tư, kết thúc thời hạn thuê lưu giữ trong 01 năm phục vụ thanh tra.</li>
          </ul>
        </div>
      </div>

    </div>
  );
}
