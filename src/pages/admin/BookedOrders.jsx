import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  ChevronRight, 
  CheckCircle, 
  FileCheck2, 
  X, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  Eye, 
  Info,
  ArrowLeft,
  Upload,
  FileText,
  BadgeAlert,
  Sliders,
  DollarSign,
  Wrench,
  CheckCircle2,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

const INITIAL_RENTAL_ORDERS = [
  {
    orderCode: 'TR-ORD-001',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0901 234 567',
    customerEmail: 'van.a@example.com',
    customerVerification: 'Đã xác minh (Mức III)',
    startDate: '2026-06-15',
    endDate: '2026-06-18',
    equipments: [
      { id: 'eq-1', name: 'Sony Alpha A7 IV', qty: 1, price: 800000, deposit: 5000000, allocatedAssetId: '' }
    ],
    totalPrice: 2400000,
    deposit: 5000000,
    escrowStatus: 'Đã khóa', // Đã khóa (paid deposit), Chờ thanh toán, Đã hoàn trả
    contractStatus: 'Đã ký',
    status: 'ACTIVE', // ACTIVE (Waiting handover), RENTING (Active rental), COMPLETED, PENDING_DEPOSIT
    paperContract: null,
    rentPaid: false,
    handoverPhotos: [],
    handoverSlip: null,
    returnPhotos: [],
    returnSlip: null,
    fines: 0,
    fineReason: '',
    notes: 'Khách thuê chụp studio cưới, ưu tiên máy sạch bảo dưỡng chuẩn.'
  },
  {
    orderCode: 'TR-ORD-002',
    customerName: 'Trần Thị B',
    customerPhone: '0988 777 666',
    customerEmail: 'thib@example.com',
    customerVerification: 'Đã xác minh (Mức II)',
    startDate: '2026-06-20',
    endDate: '2026-06-22',
    equipments: [
      { id: 'eq-2', name: 'Canon EOS R6 Mark II', qty: 1, price: 750000, deposit: 5000000, allocatedAssetId: '' }
    ],
    totalPrice: 1500000,
    deposit: 5000000,
    escrowStatus: 'Chờ thanh toán',
    contractStatus: 'Chưa có',
    status: 'PENDING_DEPOSIT',
    paperContract: null,
    rentPaid: false,
    handoverPhotos: [],
    handoverSlip: null,
    returnPhotos: [],
    returnSlip: null,
    fines: 0,
    fineReason: '',
    notes: 'Liên hệ trước 1 ngày để dán tem chuẩn bị thêm lens kit sườn phụ trợ.'
  }
];

export default function BookedOrders({ onAddNotification, userRole = 'staff' }) {
  const [orders, setOrders] = useState(INITIAL_RENTAL_ORDERS);
  const [activeSubTab, setActiveSubTab] = useState('orders'); // orders, transactions
  const [activeView, setActiveView] = useState('list'); // list, detail
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Search filter options
  const [searchCode, setSearchCode] = useState('');
  const [searchName, setSearchName] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Handover state controllers (Screen 20 to 24)
  const [allocateInput, setAllocateInput] = useState('AST0401'); // Mock physical asset selection
  const [mockContractFile, setMockContractFile] = useState('');
  const [mockHandoverFiles, setMockHandoverFiles] = useState([]);
  
  // Return check-in controllers (Screen 25 to 29)
  const [mockReturnFiles, setMockReturnFiles] = useState([]);
  const [isCheckInMode, setIsCheckInMode] = useState(false);
  const [returnStatus, setReturnStatus] = useState('normal'); // normal, late, damaged, missing
  const [damageFine, setDamageFine] = useState(0);
  const [damageNotes, setDamageNotes] = useState('');
  const [lateDays, setLateDays] = useState(0);
  const [missingFine, setMissingFine] = useState(0);

  // User-requested specific Modals & States
  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [handoverSerial, setHandoverSerial] = useState('AST0401');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnQualityNote, setReturnQualityNote] = useState('Linh kiện bình thường, hao mòn 1-2%, thấu kính ngoài sạch bụi.');
  const [showDeductModal, setShowDeductModal] = useState(false);
  const [deductAmount, setDeductAmount] = useState(200000);
  const [deductReason, setDeductReason] = useState('Trầy dăm nhẹ sườn bảo vệ tay cầm của máy');

  // Toast Box
  const [toast, setToast] = useState(null);
  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenDetail = (ord) => {
    setSelectedOrder(ord);
    // Reset wizard states
    setAllocateInput(ord.equipments[0].allocatedAssetId || 'AST0401');
    setMockContractFile(ord.paperContract || '');
    setMockHandoverFiles(ord.handoverPhotos || []);
    setMockReturnFiles(ord.returnPhotos || []);
    setIsCheckInMode(false);
    setReturnStatus('normal');
    setDamageFine(0);
    setDamageNotes('');
    setLateDays(0);
    setMissingFine(0);
    setActiveView('detail');
  };

  // HANDOVER PROGRESS HOOKS
  const handleAllocateAsset = () => {
    if (!allocateInput.trim()) {
      alert('Vui lòng gõ mã tài sản vật lý (AST...) khả dụng!');
      return;
    }
    const updated = {
      ...selectedOrder,
      equipments: selectedOrder.equipments.map(eq => ({ ...eq, allocatedAssetId: allocateInput }))
    };
    setSelectedOrder(updated);
    setOrders(orders.map(o => o.orderCode === selectedOrder.orderCode ? updated : o));
    triggerToast(`Đã chọn gán tài sản ${allocateInput} cho cấu phần đơn hàng.`);
  };

  const handleUploadPaperContract = () => {
    const filename = `HD_giay_${selectedOrder.orderCode}_signed.pdf`;
    const updated = { ...selectedOrder, paperContract: filename };
    setSelectedOrder(updated);
    setOrders(orders.map(o => o.orderCode === selectedOrder.orderCode ? updated : o));
    triggerToast(`Đã tải lên tệp hợp đồng giấy thành công: ${filename}`);
  };

  const handleConfirmRentPaid = () => {
    const updated = { ...selectedOrder, rentPaid: true };
    setSelectedOrder(updated);
    setOrders(orders.map(o => o.orderCode === selectedOrder.orderCode ? updated : o));
    triggerToast('Đã xác ghi nhận thanh toán đủ tiền thuê thực tế tại showroom.');
  };

  const handleUploadHandoverPhotos = () => {
    const photos = ['img_truoc_ban_giao.png', 'img_sau_giam_sat.png'];
    const updated = { ...selectedOrder, handoverPhotos: photos };
    setMockHandoverFiles(photos);
    setSelectedOrder(updated);
    setOrders(orders.map(o => o.orderCode === selectedOrder.orderCode ? updated : o));
    triggerToast('Đã tải lên 2 ảnh gối giám sát trạng thái sường máy bàn bàn giao.');
  };

  const handleGenerateHandoverSlip = () => {
    // Validate prerequisites
    const hasAsset = selectedOrder.equipments.every(e => e.allocatedAssetId);
    if (!hasAsset) {
      alert('⚠️ Bạn chưa chọn gán mã tài sản vật lý cụ thể (Số Serial) cho đơn hàng!');
      return;
    }
    if (!selectedOrder.paperContract) {
      alert('⚠️ Chưa upload đính kèm bản sao hợp đồng giấy ký nhận!');
      return;
    }
    if (!selectedOrder.rentPaid) {
      alert('⚠️ Khách hàng chưa hoàn tất thanh toán tiền thuê!');
      return;
    }
    if (selectedOrder.handoverPhotos.length === 0) {
      alert('⚠️ Chưa chụp ảnh giám sát bàn giao vỏ bọc lót của máy ảnh!');
      return;
    }

    const slip = {
      slipCode: `HDO-SLIP-${selectedOrder.orderCode}`,
      time: new Date().toLocaleString('vi-VN'),
      officer: 'Nguyễn Văn B (Vận hành kho)'
    };

    const updated = {
      ...selectedOrder,
      status: 'RENTING',
      handoverSlip: slip
    };

    setSelectedOrder(updated);
    setOrders(orders.map(o => o.orderCode === selectedOrder.orderCode ? updated : o));
    triggerToast(`🎉 Lập phiếu bàn giao ${slip.slipCode} thành công! Đơn chuyển sang: ĐANG THUÊ.`);
    if (onAddNotification) {
      onAddNotification(`Đã cấp phát bàn giao thành công đơn hàng ${selectedOrder.orderCode}.`);
    }
  };

  // CHECK-IN / RETURN PROGRESS HOOKS
  const handleUploadReturnPhotos = () => {
    const photos = ['img_tra_lens_mat_truoc.png', 'img_tra_lens_mat_sau.png'];
    const updated = { ...selectedOrder, returnPhotos: photos };
    setMockReturnFiles(photos);
    setSelectedOrder(updated);
    setOrders(orders.map(o => o.orderCode === selectedOrder.orderCode ? updated : o));
    triggerToast('Đã upload thành công ảnh hiện trạng trả máy của khách.');
  };

  const handleProcessCheckIn = (e) => {
    e.preventDefault();
    if (mockReturnFiles.length === 0) {
      alert('Vui lòng upload chụp ảnh hiện trạng trước khi làm phiếu trả kiểm định!');
      return;
    }

    let calculatedFines = 0;
    let reason = '';

    if (returnStatus === 'late') {
      calculatedFines = (lateDays * 500000);
      reason = `Phạt rớt trễ hạn ${lateDays} ngày (@500K/đêm)`;
    } else if (returnStatus === 'damaged') {
      calculatedFines = parseFloat(damageFine) || 0;
      reason = `Chi phí khôi phục hư hỏng phát sinh: ${damageNotes}`;
    } else if (returnStatus === 'missing') {
      calculatedFines = parseFloat(missingFine) || 0;
      reason = 'Đền bù thất lạc hao mòn phụ trợ đi kèm';
    }

    const slip = {
      slipId: `RTN-SLIP-${selectedOrder.orderCode}`,
      time: new Date().toLocaleString('vi-VN'),
      officer: 'Nguyễn Văn B (Kiểm thử kỹ thuật)'
    };

    const updated = {
      ...selectedOrder,
      fines: calculatedFines,
      fineReason: reason,
      returnSlip: slip
    };

    setSelectedOrder(updated);
    setOrders(orders.map(o => o.orderCode === selectedOrder.orderCode ? updated : o));
    setIsCheckInMode(false);
    triggerToast('Lập phiếu trả máy kiểm kê thành công!');
  };

  const handleRecordRefundFull = () => {
    // Hoàn cọc 100%
    const updated = {
      ...selectedOrder,
      status: 'COMPLETED',
      escrowStatus: 'Đã hoàn trả'
    };
    setSelectedOrder(updated);
    setOrders(orders.map(o => o.orderCode === selectedOrder.orderCode ? updated : o));
    triggerToast('Đã ghi nhận HOÀN CỌC 100% cho khách hàng.');
    if (onAddNotification) {
      onAddNotification(`Hoàn tất tất toán dứt điểm đơn hàng ${selectedOrder.orderCode}`);
    }
  };

  const handleRecordRefundDeducted = () => {
    // Khấu trừ cọc gộp tiền phạt suất ngoại lệ
    const updated = {
      ...selectedOrder,
      status: 'COMPLETED',
      escrowStatus: `Khấu trừ ${selectedOrder.fines.toLocaleString('vi-VN')}đ / Hoàn nốt số dư`
    };
    setSelectedOrder(updated);
    setOrders(orders.map(o => o.orderCode === selectedOrder.orderCode ? updated : o));
    triggerToast(`Đã khấu trừ ${selectedOrder.fines.toLocaleString('vi-VN')} VND khỏi cọc ký quỹ và hoàn trả phần thừa.`);
    if (onAddNotification) {
      onAddNotification(`Khấu trừ hoàn tất bàn giao TR-ORD-${selectedOrder.orderCode}`);
    }
  };

  const handleTriggerAutoMaintenance = () => {
    alert(`⚡ Đã tự động tạo và luân chuyển hồ sơ BẢO HÀNH PHỤC HỒI cho thiết bị ${selectedOrder.equipments[0].allocatedAssetId} sang phòng Kỹ thuật lầu 1 thành công!`);
  };

  const handleActionHandover = (serialNumber) => {
    if (!serialNumber.trim()) {
      alert("Vui lòng cung cấp mã sê-ri / số Serial của thiết bị vật lý!");
      return;
    }
    const nowStr = new Date().toLocaleString('vi-VN');
    const newOp = {
      time: nowStr,
      user: 'Nguyễn Văn B (Nhân viên vận hành)',
      action: `Gán thiết bị sê-ri [${serialNumber}] và tiến hành bàn giao`
    };
    const updated = {
      ...selectedOrder,
      status: 'RENTING',
      equipments: selectedOrder.equipments.map(eq => ({ ...eq, allocatedAssetId: serialNumber })),
      operations: [...(selectedOrder.operations || [
        { time: '15/06/2026 10:00', user: 'Lê Minh (Kỹ thuật)', action: 'Khóa tiền ký quỹ cọc giữ chỗ' },
        { time: '15/06/2026 10:15', user: 'Nhân viên tủ quầy', action: 'Duyệt hồ sơ định danh' }
      ]), newOp]
    };
    setSelectedOrder(updated);
    setOrders(orders.map(o => o.orderCode === selectedOrder.orderCode ? updated : o));
    setShowHandoverModal(false);
    triggerToast(`Đã bàn giao thiết bị ${serialNumber} và đổi trạng thái sang ĐANG THUÊ!`);
    if (onAddNotification) {
      onAddNotification(`Bàn giao thành công đơn hàng ${selectedOrder.orderCode}`);
    }
  };

  const handleActionReturn = (qualityNote) => {
    const nowStr = new Date().toLocaleString('vi-VN');
    const newOp = {
      time: nowStr,
      user: 'Nguyễn Văn B (Nhân viên vận hành)',
      action: `Nhận trả thiết bị. Ghi chú hao mòn: ${qualityNote}`
    };
    const updated = {
      ...selectedOrder,
      status: 'RETURNED',
      operations: [...(selectedOrder.operations || [
        { time: '15/06/2026 10:00', user: 'Lê Minh (Kỹ thuật)', action: 'Khóa tiền ký quỹ cọc giữ chỗ' },
        { time: '15/06/2026 10:15', user: 'Nhân viên tủ quầy', action: 'Duyệt hồ sơ định danh' }
      ]), newOp]
    };
    setSelectedOrder(updated);
    setOrders(orders.map(o => o.orderCode === selectedOrder.orderCode ? updated : o));
    setShowReturnModal(false);
    triggerToast(`Đã nhận trả thiết bị thành công! Trạng thái đơn đổi thành Đã trả.`);
  };

  const handleActionRefund = () => {
    const nowStr = new Date().toLocaleString('vi-VN');
    const newOp = {
      time: nowStr,
      user: 'Trần Tú (Quản trị viên)',
      action: 'Hoàn trả cọc ký quỹ 100% tài sản sườn'
    };
    const updated = {
      ...selectedOrder,
      status: 'COMPLETED',
      escrowStatus: 'Đã hoàn trả',
      operations: [...(selectedOrder.operations || [
        { time: '15/06/2026 10:00', user: 'Lê Minh (Kỹ thuật)', action: 'Khóa tiền ký quỹ cọc giữ chỗ' },
        { time: '15/06/2026 10:15', user: 'Nhân viên tủ quầy', action: 'Duyệt hồ sơ định danh' }
      ]), newOp]
    };
    setSelectedOrder(updated);
    setOrders(orders.map(o => o.orderCode === selectedOrder.orderCode ? updated : o));
    triggerToast(`Đã hoàn trả 100% cọc giữ chỗ. Đơn hàng hoàn tất.`);
  };

  const handleActionDeduct = (amount, reason) => {
    if (amount <= 0 || !reason.trim()) {
      alert("Vui lòng điền đầy đủ Tiền phạt và Lý do khấu trừ!");
      return;
    }
    const nowStr = new Date().toLocaleString('vi-VN');
    const newOp = {
      time: nowStr,
      user: 'Trần Tú (Quản trị viên)',
      action: `Khấu trừ cọc giữ chỗ. Phạt ${amount.toLocaleString('vi-VN')} đ. Lý do: ${reason}`
    };
    const updated = {
      ...selectedOrder,
      status: 'COMPLETED',
      fines: amount,
      fineReason: reason,
      escrowStatus: `Khấu trừ ${amount.toLocaleString('vi-VN')}đ / Hoàn số dư`,
      operations: [...(selectedOrder.operations || [
        { time: '15/06/2026 10:00', user: 'Lê Minh (Kỹ thuật)', action: 'Khóa tiền ký quỹ cọc giữ chỗ' },
        { time: '15/06/2026 10:15', user: 'Nhân viên tủ quầy', action: 'Duyệt hồ sơ định danh' }
      ]), newOp]
    };
    setSelectedOrder(updated);
    setOrders(orders.map(o => o.orderCode === selectedOrder.orderCode ? updated : o));
    setShowDeductModal(false);
    triggerToast(`Đã lưu khấu trừ cọc thành công và chuyển trạng thái thành Hoàn tất.`);
  };

  const handleActionCancel = () => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      return;
    }
    const nowStr = new Date().toLocaleString('vi-VN');
    const newOp = {
      time: nowStr,
      user: userRole === 'admin' ? 'Trần Tú (Quản trị viên)' : 'Khách hàng',
      action: 'Hủy đơn hàng và giải phóng đặt giữ thiết bị định biên'
    };
    const updated = {
      ...selectedOrder,
      status: 'CANCELLED',
      operations: [...(selectedOrder.operations || [
        { time: '15/06/2026 10:00', user: 'Lê Minh (Kỹ thuật)', action: 'Khóa tiền ký quỹ cọc giữ chỗ' },
        { time: '15/06/2026 10:15', user: 'Nhân viên tủ quầy', action: 'Duyệt hồ sơ định danh' }
      ]), newOp]
    };
    setSelectedOrder(updated);
    setOrders(orders.map(o => o.orderCode === selectedOrder.orderCode ? updated : o));
    triggerToast(`Đã hủy đơn hàng thành công.`);
  };

  // Filter calculations
  const filteredOrders = orders.filter(o => {
    const matchesCode = o.orderCode.toLowerCase().includes(searchCode.toLowerCase());
    const matchesName = o.customerName.toLowerCase().includes(searchName.toLowerCase());
    const matchesStatus = statusFilter === '' || o.status === statusFilter;
    return matchesCode && matchesName && matchesStatus;
  });

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* Toast Notice box */}
      {toast && (
        <div className="fixed top-20 right-4 bg-slate-900 border border-slate-700 text-white px-5 py-3 rounded-lg shadow-2xl z-50 animate-bounce flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#fea619]" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      {/* VIEW: 1. LIST ORDERS */}
      {activeView === 'list' && (
        <>
          {/* Header row section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
            <div>
              <h2 className="text-xl font-bold text-[#00236f] flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-indigo-650" />
                QUẢN LÝ ĐƠN HÀNG THUÊ THIẾT BỊ
              </h2>
              <p className="text-xs text-slate-500 mt-1">Giám tháp, check-in, check-out bàn giao dán mã tem và bồi hoàn cọc ký quỹ an ninh.</p>
            </div>
            
            {/* Payment vs order tab controls */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-150">
              <button 
                onClick={() => setActiveSubTab('orders')}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition-colors cursor-pointer ${
                  activeSubTab === 'orders' ? 'bg-[#00236f] text-white font-black' : 'text-slate-650'
                }`}
              >
                📥 ĐƠN HÀNG THUÊ
              </button>
              <button 
                onClick={() => setActiveSubTab('payments')}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition-colors cursor-pointer ${
                  activeSubTab === 'payments' ? 'bg-[#00236f] text-white font-black' : 'text-slate-650'
                }`}
              >
                💳 LỊCH SỬ THỦ QUỸ CỌC
              </button>
            </div>
          </div>

          {activeSubTab === 'orders' ? (
            <>
              {/* Order Lists Filters boxes */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center text-xs">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    placeholder="Lọc chính xác mã đơn hàng (TR-ORD...)"
                    className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-2.5 outline-none font-bold"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <input 
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Lọc theo tên khách thuê..."
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none bg-white text-slate-800 font-bold"
                  />
                </div>
                <div className="w-full sm:w-44">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-2 font-bold cursor-pointer"
                  >
                    <option value="">Trạng thái: Tất cả</option>
                    <option value="ACTIVE">Chờ xuất (Đặt cọc rồi)</option>
                    <option value="RENTING">Đang thuê ngoài</option>
                    <option value="COMPLETED">Hoàn tất hoàn cọc</option>
                    <option value="PENDING_DEPOSIT">Đợi cọc ký quỹ</option>
                  </select>
                </div>
              </div>

              {/* Data list Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto w-full text-xs">
                <table className="w-full min-w-[900px] text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="px-6 py-4">Mã đơn hàng</th>
                      <th className="px-6 py-4">Tên khách hàng</th>
                      <th className="px-6 py-4">Ngày thuê</th>
                      <th className="px-6 py-4">Ngày trả</th>
                      <th className="px-6 py-4 text-right">Tổng tiền thanh toán cọc giữ chỗ</th>
                      <th className="px-6 py-4 text-center">Trạng thái đơn hàng</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-650 animate-fade-in">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-10 text-center italic text-slate-400">
                          Không tìm thấy đơn hàng thuê nào trùng khớp.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.orderCode} className="hover:bg-slate-50/50 transition duration-150 bg-white">
                          <td className="px-6 py-4 font-mono font-black text-[#00236f]">{ord.orderCode}</td>
                          <td className="px-6 py-4 text-slate-800 font-bold">{ord.customerName}</td>
                          <td className="px-6 py-4 font-mono">{ord.startDate}</td>
                          <td className="px-6 py-4 font-mono">{ord.endDate}</td>
                          <td className="px-6 py-4 text-right font-mono font-black text-[#00236f]">{ord.deposit.toLocaleString('vi-VN')} đ</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex px-2.5 py-0.5 rounded text-[9.5px] font-black uppercase border leading-none ${
                              ord.status === 'ACTIVE' 
                                ? 'bg-amber-50 text-amber-700 border-amber-205'
                                : ord.status === 'RENTING'
                                  ? 'bg-blue-50 text-blue-700 border-blue-205'
                                  : ord.status === 'COMPLETED'
                                    ? 'bg-green-50 text-green-700 border-green-205'
                                    : 'bg-slate-100 text-slate-500 border-slate-205'
                            }`}>
                              {ord.status === 'ACTIVE' ? 'Chở bàn giao' : ord.status === 'RENTING' ? 'Đang thuê' : ord.status === 'COMPLETED' ? 'Đã hoàn thành' : 'Đợi chuyển cọc'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleOpenDetail(ord)}
                              className="px-4 py-1.5 border border-[#00236f] text-[#00236f] hover:bg-blue-50 font-black rounded-lg text-[10px] uppercase transition cursor-pointer"
                            >
                              xem chi tiết
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            // TRANSACTIONS LIST SUITE
            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto w-full shadow-sm text-xs select-none">
              <div className="p-4 bg-slate-50 border-b font-black text-slate-800 uppercase tracking-widest text-[9.5px]">
                SỔ NHẬT KÝ ĐỐI SOÁT CHUYỂN HOÀN KÝ QUỸ ĐỒ ĐẠC
              </div>
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="bg-slate-50 border-b font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="px-6 py-4">Mã Giao dịch</th>
                    <th className="px-6 py-4">Mã đơn hàng</th>
                    <th className="px-6 py-4">Khách hàng</th>
                    <th className="px-6 py-4">Loại giao thức</th>
                    <th className="px-6 py-4 text-right">Giá trị quỹ cọc</th>
                    <th className="px-6 py-4 text-center">Trạng thái quỹ</th>
                    <th className="px-6 py-4 text-right">Thời gian chốt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-650">
                  <tr className="hover:bg-slate-50/20">
                    <td className="px-6 py-4 font-mono font-bold text-indigo-700">TR-TXN-1001</td>
                    <td className="px-6 py-4 font-mono">TR-ORD-001</td>
                    <td className="px-6 py-4 font-black text-slate-800">Nguyễn Văn A</td>
                    <td className="px-6 py-4 text-emerald-700">Nhận Ký Quỹ Độc Quyền</td>
                    <td className="px-6 py-4 text-right">5.000.000 đ</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-[9px] font-bold">KHÓA QUỸ THÀNH CÔNG</span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-400">15/06/2026 09:12</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* VIEW: 2. DETAILED SCREEN FOR ORDER */}
      {activeView === 'detail' && selectedOrder && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold mb-4">
            <button 
              onClick={() => setActiveView('list')} 
              className="text-slate-500 hover:text-slate-905 flex items-center gap-1 cursor-pointer"
            >
              
              DANH SÁCH ĐƠN HÀNG
            </button>
            <span className="text-slate-350">/</span>
            <span className="text-slate-900 font-extrabold uppercase">CHI TIẾT ĐƠN HÀNG {selectedOrder.orderCode}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Main Booking Specifications */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Profile Client Info summary box */}
              <div className="bg-white border border-slate-201 p-6 rounded-2xl shadow-xs space-y-4">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-[#00236f] flex items-center gap-1 uppercase leading-none">
                      👤 THÔNG TIN KHÁCH HÀNG &amp; THỜI HẠN
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">Thông số kiểm tra thẻ định danh đã duyệt hoàn hảo.</p>
                  </div>
                  <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded text-[10px] border border-green-200 font-black">
                    {selectedOrder.customerVerification}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-slate-400 block font-bold">Họ và tên:</span>
                    <span className="text-slate-800 text-sm font-black block">{selectedOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold">Số điện thoại:</span>
                    <span className="text-slate-800 block">{selectedOrder.customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold">Email chính chủ:</span>
                    <span className="text-slate-800 block">{selectedOrder.customerEmail}</span>
                  </div>
                  <div className="col-span-1 sm:col-span-2 pt-2 border-t border-slate-50">
                    <span className="text-slate-400 block font-bold">Lịch trình Thuê - Trả máy:</span>
                    <span className="text-indigo-650 block">📅 Từ 09:00, {selectedOrder.startDate} ── Đến trước 18:00, {selectedOrder.endDate}</span>
                  </div>
                </div>
              </div>

              {/* Items Table details inside Booking */}
              <div className="bg-white border border-slate-201 rounded-2xl overflow-x-auto w-full shadow-xs text-xs">
                <div className="p-4 border-b font-black text-slate-800 uppercase tracking-widest text-[9px] min-w-[700px]">
                  DANH SÁCH THIẾT BỊ LƯU TRỮ TRONG ĐƠN HÀNG
                </div>
                <table className="w-full min-w-[700px] text-left">
                  <thead>
                    <tr className="bg-slate-50 font-bold border-b border-slate-150 text-slate-500 uppercase text-[9.5px]">
                      <th className="px-6 py-3">Tên sản phẩm</th>
                      <th className="px-6 py-3 text-center">Số lượng</th>
                      <th className="px-6 py-3 text-right">Tổng tiền thuê ngày</th>
                      <th className="px-6 py-3 text-right">Mức cọc máy sườn</th>
                      <th className="px-6 py-3 text-right">MÃ TÀI SẢN VẬT LÝ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {selectedOrder.equipments.map((eq, i) => (
                      <tr key={i}>
                        <td className="px-6 py-3 font-bold text-slate-800">{eq.name}</td>
                        <td className="px-6 py-3 text-center">{eq.qty} chiếc</td>
                        <td className="px-6 py-3 text-right text-indigo-650">{eq.price.toLocaleString('vi-VN')} đ</td>
                        <td className="px-6 py-3 text-right text-slate-500">{eq.deposit.toLocaleString('vi-VN')} đ</td>
                        <td className="px-6 py-3 text-right">
                          {eq.allocatedAssetId ? (
                            <span className="font-mono bg-blue-900 text-white font-extrabold px-2 py-0.5 rounded text-[10.5px]">
                              {eq.allocatedAssetId}
                            </span>
                          ) : (
                            <span className="text-rose-500 text-[10.5px] italic">Chưa gán máy sườn cụ thể</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {/* Aggregation rows */}
                    <tr className="bg-slate-50/50">
                      <td colSpan="3" className="px-6 py-3 text-right font-bold text-slate-450 uppercase">Tổng cộng tiền thuê đợt:</td>
                      <td colSpan="2" className="px-6 py-3 text-right font-black text-[#00236f] text-sm">{selectedOrder.totalPrice.toLocaleString('vi-VN')} VND</td>
                    </tr>
                    <tr className="bg-slate-50/50 border-t">
                      <td colSpan="3" className="px-6 py-3 text-right font-bold text-slate-450 uppercase">Tổng đặt cọc (Tiền ký quỹ giữ tủ):</td>
                      <td colSpan="2" className="px-6 py-3 text-right font-black text-emerald-700 text-sm">{selectedOrder.deposit.toLocaleString('vi-VN')} VND</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ACTION PROGRESS STEPS: 1. HANDOVER ZONE (ACTIVE OR PENDING) */}
              {selectedOrder.status === 'ACTIVE' && (
                <div className="bg-gradient-to-br from-indigo-50/20 to-orange-50/25 p-5 border-2 border-indigo-200 rounded-2xl space-y-4">
                  <div className="flex items-center gap-1.5 text-[#00236f]">
                    <Sliders className="w-5 h-5 text-[#fea619]" />
                    <span className="text-xs font-black uppercase tracking-wider">TIẾN TRÌNH THỦ TỤC BÀN GIAO THIẾT BỊ (WIZARD STEPS)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    
                    {/* Step 1: Specific Serial Allocation (Screen 20) */}
                    <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-2">
                      <h4 className="font-extrabold text-[#00236f] flex items-center gap-1">
                        <span className="w-4 h-4 bg-indigo-500 text-white text-[9.5px] rounded-full inline-flex items-center justify-center font-bold">1</span>
                        Gán sê-ri máy cụ thể xuất tủ kho
                      </h4>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={allocateInput}
                          onChange={(e) => setAllocateInput(e.target.value)}
                          placeholder="Nhập mã AST0401..."
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded outline-none font-mono text-[10.5px]"
                        />
                        <button 
                          onClick={handleAllocateAsset}
                          className="px-3 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded cursor-pointer transition text-[10.5px]"
                        >
                          CHỌN MÃ
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-normal">Gán trực tiếp serial của chiếc máy cụ thể lót tủ.</span>
                    </div>

                    {/* Step 2: Paper agreement scan copy (Screen 21) */}
                    <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-2.5">
                      <h4 className="font-extrabold text-[#00236f] flex items-center gap-1">
                        <span className="w-4 h-4 bg-indigo-500 text-white text-[9.5px] rounded-full inline-flex items-center justify-center font-bold">2</span>
                        Hợp đồng giấy / Chụp scan ký nhận
                      </h4>
                      {selectedOrder.paperContract ? (
                        <div className="text-green-600 flex items-center gap-1 font-bold text-[10.5px]">
                          <CheckCircle2 className="w-4 h-4" />
                          Đã đính kèm: {selectedOrder.paperContract}
                        </div>
                      ) : (
                        <button 
                          onClick={handleUploadPaperContract}
                          className="w-full py-1.5 border border-[#fea619] text-[#fea619] font-black rounded hover:bg-amber-50 cursor-pointer transition flex items-center justify-center gap-1 text-[10.5px]"
                        >
                          
                          UPLOAD HỢP ĐỒNG KÝ GIẤY
                        </button>
                      )}
                      <span className="text-[10px] text-slate-400 block font-normal">Hợp đồng giấy ký tay lăn tay chụp ảnh đối chứng an toàn.</span>
                    </div>

                    {/* Step 3: Cash / Store Rent payments (Screen 22) */}
                    <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-2.5">
                      <h4 className="font-extrabold text-[#00236f] flex items-center gap-1">
                        <span className="w-4 h-4 bg-indigo-500 text-white text-[9.5px] rounded-full inline-flex items-center justify-center font-bold">3</span>
                        Xác nhận thanh toán tiền thuê thô
                      </h4>
                      {selectedOrder.rentPaid ? (
                        <div className="text-green-600 flex items-center gap-1 font-bold text-[10.5px]">
                          <CheckCircle2 className="w-4 h-4" />
                          Tiền thuê: Đã đóng đủ tại showroom
                        </div>
                      ) : (
                        <button 
                          onClick={handleConfirmRentPaid}
                          className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded cursor-pointer transition text-[10.5px]"
                        >
                          💸 ĐÃ NHẬN TIỀN THUÊ ({selectedOrder.totalPrice.toLocaleString('vi-VN')}Đ)
                        </button>
                      )}
                      <span className="text-[10px] text-slate-400 block font-normal">Xác nhận thu đủ tổng giá thuê gốc của máy trước khi rời tủ.</span>
                    </div>

                    {/* Step 4: Hand-off conditions photo uploading (Screen 23) */}
                    <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-2.5">
                      <h4 className="font-extrabold text-[#00236f] flex items-center gap-1">
                        <span className="w-4 h-4 bg-indigo-500 text-white text-[9.5px] rounded-full inline-flex items-center justify-center font-bold">4</span>
                        Tuyển chọn chụp ảnh hiện trạng xuất xưởng
                      </h4>
                      {mockHandoverFiles.length > 0 ? (
                        <div className="space-y-1">
                          <span className="text-green-600 flex items-center gap-1 font-bold text-[10.5px]">
                            <CheckCircle2 className="w-4 h-4" />
                            Đã gác lưu {mockHandoverFiles.length} ảnh bảo chứng
                          </span>
                          <span className="text-[9.5px] text-slate-400 max-w-[200px] block truncate">{mockHandoverFiles.join(', ')}</span>
                        </div>
                      ) : (
                        <button 
                          onClick={handleUploadHandoverPhotos}
                          className="w-full py-1.5 border border-slate-300 text-slate-600 font-bold rounded hover:bg-slate-50 cursor-pointer transition flex items-center justify-center gap-1 text-[10.5px]"
                        >
                          
                          CHỤP / UPLOAD ẢNH BÀN GIAO
                        </button>
                      )}
                      <span className="text-[10px] text-slate-400 block font-normal">Chụp ảnh thấu cảm, sensor sạch đẹp làm đối trọng kiểm kê khố sau.</span>
                    </div>

                  </div>

                  {/* Step 5: Final Handover validation and receipt trigger (Screen 24) */}
                  <div className="pt-4 border-t border-indigo-150 flex justify-end items-center">
                    <button 
                      onClick={handleGenerateHandoverSlip}
                      className="px-6 py-2.5 bg-[#00236f] hover:bg-[#fea619] hover:text-[#2a1700] text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow active:scale-95 cursor-pointer ml-auto"
                    >
                      
                      LẬP PHIẾU BÀN GIAO XUẤT KHO TRẠM (SCREEN 24)
                    </button>
                  </div>
                </div>
              )}

              {/* ACTION PROGRESS STEPS: 2. RETURN & CHECK-IN SYSTEM ZONE */}
              {selectedOrder.status === 'RENTING' && (
                <div className="bg-gradient-to-br from-indigo-50/25 to-rose-50/25 p-5 border-2 border-indigo-200 rounded-2xl space-y-4">
                  <div className="flex items-center gap-1.5 text-[#00236f]">
                    <Sliders className="w-5 h-5 text-indigo-650 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-wider">HỒ SƠ KHẢO KIỂM THU HỒI / lập phiếu trả</span>
                  </div>

                  {/* Step 1: Upload return photos (Screen 25) */}
                  <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-3 font-semibold text-xs">
                    <h4 className="font-extrabold text-[#00236f] flex items-center gap-1">
                      <span className="w-4 h-4 bg-indigo-500 text-white text-[9.5px] rounded-full inline-flex items-center justify-center font-bold">1</span>
                      Kiểm nghiệm chụp ảnh thu hồi thiết bị thực tế
                    </h4>
                    
                    {mockReturnFiles.length > 0 ? (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-1">
                        <span className="text-green-700 font-bold block flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Đã lưu thành công bộ {mockReturnFiles.length} ảnh kiểm định hoàn hảo
                        </span>
                        <p className="text-[10px] text-slate-500">{mockReturnFiles.join(', ')}</p>
                      </div>
                    ) : (
                      <button 
                        onClick={handleUploadReturnPhotos}
                        className="w-full sm:w-auto px-5 py-2 border border-indigo-550 text-indigo-650 hover:bg-indigo-50 font-black rounded-lg transition text-[11px] flex items-center gap-1.5 cursor-pointer"
                      >
                        
                        CHỤP / UPLOAD ẢNH NHẬN TRẢ (SCREEN 25)
                      </button>
                    )}
                  </div>

                  {/* Step 2: Create returns check-in report details (Screen 26) */}
                  {mockReturnFiles.length > 0 && !selectedOrder.returnSlip && (
                    <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-4">
                      <h4 className="font-extrabold text-[#00236f] flex items-center gap-1">
                        <span className="w-4 h-4 bg-indigo-500 text-white text-[9.5px] rounded-full inline-flex items-center justify-center font-bold">2</span>
                        Thủ tục Lập phiếu trả máy &amp; Kiểm kê lỗi hao mòn (Screen 26)
                      </h4>

                      {!isCheckInMode ? (
                        <button 
                          onClick={() => setIsCheckInMode(true)}
                          className="w-full py-2 bg-[#fea619] hover:bg-[#fea619]/90 text-[#2a1700] text-xs font-black rounded-lg transition flex items-center justify-center gap-1"
                        >
                          📂 BẮT ĐẦU FORM KIỂM KÊ KỸ THUẬT
                        </button>
                      ) : (
                        <form onSubmit={handleProcessCheckIn} className="space-y-4 font-semibold text-xs border bg-slate-50 p-4 rounded-xl">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-slate-700">Tình trạng thu lại của thấu kính, sensor máy ảnh sườn:</label>
                            <select 
                              value={returnStatus}
                              onChange={(e) => setReturnStatus(e.target.value)}
                              className="p-2 border bg-white rounded cursor-pointer font-bold"
                            >
                              <option value="normal">🟢 Bình thường - Đầy đủ linh phụ kiện</option>
                              <option value="late">🔴 Trễ hạn hoàn trả thiết bị</option>
                              <option value="damaged">💥 Có sự cố trầy xước, dính rễ tre sensor thấu kính</option>
                              <option value="missing">⚠️ Thất thoát phụ kiện đạn sạc thẻ nhớ đi kèm</option>
                            </select>
                          </div>

                          {returnStatus === 'late' && (
                            <div className="flex flex-col gap-1.5 p-3.5 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <label className="text-amber-850">Số đêm quá hạn giữ máy (đợt):</label>
                              <input 
                                type="number" required value={lateDays}
                                onChange={(e) => setLateDays(parseInt(e.target.value) || 0)}
                                className="p-2 bg-white border outline-none rounded"
                              />
                              <p className="text-[10px] text-amber-600 block mt-1">Hệ thống tự động phạt @500.000 VNĐ / đêm quá hạn lưu.</p>
                            </div>
                          )}

                          {returnStatus === 'damaged' && (
                            <div className="space-y-3 p-3.5 bg-rose-50 border border-rose-200 rounded-lg">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-rose-800">Miêu tả hiện tượng hao mòn đặc chủng:</label>
                                <input 
                                  type="text" required value={damageNotes}
                                  onChange={(e) => setDamageNotes(e.target.value)}
                                  placeholder="Ráp xước dăm thấu thấu kính trước, sensor bụi dày mốc..."
                                  className="p-2 bg-white border outline-none rounded"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="text-rose-800">Ước định chi phí phạt tút dọn, sửa thô (VND):</label>
                                <input 
                                  type="number" required value={damageFine}
                                  onChange={(e) => setDamageFine(parseFloat(e.target.value) || 0)}
                                  className="p-2 bg-white border outline-none rounded"
                                />
                              </div>
                            </div>
                          )}

                          {returnStatus === 'missing' && (
                            <div className="flex flex-col gap-1 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <label className="text-red-800 font-bold">Số tiền phạt bồi gỗ hao phụ trợ (VND):</label>
                              <input 
                                type="number" required value={missingFine}
                                onChange={(e) => setMissingFine(parseFloat(e.target.value) || 0)}
                                className="p-2 bg-white border rounded"
                              />
                            </div>
                          )}

                          <div className="flex justify-end gap-2.5 pt-2 border-t">
                            <button type="button" onClick={() => setIsCheckInMode(false)} className="px-3 py-1.5 bg-white border rounded">Hủy</button>
                            <button type="submit" className="px-4 py-1.5 bg-indigo-650 text-white rounded font-bold">CHỐT KIỂM NGHIỆM PHIẾU TRẢ</button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}

                  {/* Step 3: Outcomes - Escrow calculations (Screen 27, 28, 29) */}
                  {selectedOrder.returnSlip && (
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4">
                      <div className="p-4.5 bg-slate-50 border border-slate-150 rounded-xl text-xs space-y-2">
                        <h4 className="font-bold text-slate-800 uppercase text-[#00236f] leading-none mb-1">KẾT QUẢ ĐỐI SOÁT ĐƠN HOÀN TRẢ</h4>
                        <p className="text-slate-500 font-bold">Mã phiếu kiểm: <span className="font-mono">{selectedOrder.returnSlip.slipId}</span></p>
                        <p className="text-slate-500">Giám sát viên: {selectedOrder.returnSlip.officer}</p>
                        {selectedOrder.fines > 0 ? (
                          <div className="p-3 bg-rose-50 border border-rose-250 text-rose-700 rounded-lg">
                            ⚠️ Có phát sinh bồi hoàn: <span className="font-black text-rose-800">{selectedOrder.fines.toLocaleString('vi-VN')} đ</span> ({selectedOrder.fineReason})
                          </div>
                        ) : (
                          <div className="p-3 bg-green-50 border border-green-250 text-green-700 rounded-lg font-bold">
                            🟢 Không phát sinh bất kỳ hao mòn khuyết hỏng hay chậm đêm quá ngày nào.
                          </div>
                        )}
                      </div>

                      {/* Refund Trigger buttons conditional (Screen 27 & 28) */}
                      {selectedOrder.escrowStatus === 'Đã khóa' && (
                        <div className="pt-3 border-t flex flex-col sm:flex-row gap-3">
                          {selectedOrder.fines === 0 ? (
                            <button 
                              onClick={handleRecordRefundFull}
                              className="w-full bg-green-600 hover:bg-green-750 text-white text-xs font-black py-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              ✨ GHI NHẬN HOÀN CỌC 100% (SCREEN 27)
                            </button>
                          ) : (
                            <div className="space-y-3 w-full">
                              <button 
                                onClick={handleRecordRefundDeducted}
                                className="w-full bg-rose-600 hover:bg-rose-750 text-white text-xs font-black py-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                💸 KHẤU TRỪ CỌC &amp; HOÀN SỐ DƯ (SCREEN 28)
                              </button>

                              {returnStatus === 'damaged' && (
                                <button 
                                  type="button"
                                  onClick={handleTriggerAutoMaintenance}
                                  className="w-full border border-[#00236f] text-[#00236f] hover:bg-blue-50 text-xs font-black py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1"
                                >
                                  🛠️ CHUYỂN BẢO TRÌ SỬA CHỮA THIẾT BỊ (SCREEN 29)
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Sidebar quick metadata state info logs */}
            <div className="lg:col-span-4 space-y-5">
              
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
                <h4 className="text-[10.5px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-150 pb-2">📂 BAN ĐIỀU HÀNH &amp; HÀNH ĐỘNG</h4>
                <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                  Các nút bên dưới tự động kích hoạt/ẩn dựa trên chức năng phân quyền vận hành:
                </p>

                <div className="space-y-2.5 font-sans">
                  {/* 1. Nút: Bàn giao thiết bị (Chỉ Nhân viên) */}
                  {userRole === 'staff' && (
                    <button 
                      onClick={() => {
                        setHandoverSerial('AST0401');
                        setShowHandoverModal(true);
                      }}
                      className="w-full py-2.5 bg-[#00236f] hover:bg-blue-900 text-white text-[11px] font-bold rounded-lg transition duration-200 cursor-pointer text-center uppercase"
                    >
                      🤝 BÀN GIAO THIẾT BỊ
                    </button>
                  )}

                  {/* 2. Nút: Nhận trả thiết bị (Chỉ Nhân viên) */}
                  {userRole === 'staff' && (
                    <button 
                      onClick={() => {
                        setReturnQualityNote('Linh kiện đầy đủ, sườn hao mòn 1%, ko xước dăm thấu kính.');
                        setShowReturnModal(true);
                      }}
                      className="w-full py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-[11px] font-bold rounded-lg transition duration-200 cursor-pointer text-center uppercase"
                    >
                      🔄 NHẬN TRẢ THIẾT BỊ
                    </button>
                  )}

                  {/* 3. Nút: Hoàn trả cọc (Chỉ Quản trị viên) */}
                  {userRole === 'admin' && (
                    <button 
                      onClick={handleActionRefund}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition duration-200 cursor-pointer text-center uppercase"
                    >
                      💰 HOÀN TRẢ CỌC 100%
                    </button>
                  )}

                  {/* 4. Nút: Khấu trừ cọc (Chỉ Quản trị viên) */}
                  {userRole === 'admin' && (
                    <button 
                      onClick={() => {
                        setDeductAmount(200000);
                        setDeductReason('Khấu trừ phí hao mòn phụ trợ vỏ sườn bảo vệ');
                        setShowDeductModal(true);
                      }}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded-lg transition duration-200 cursor-pointer text-center uppercase"
                    >
                      ⚠️ KHẤU TRỪ TIỀN CỌC
                    </button>
                  )}

                  {/* 5. Nút: Hủy đơn hàng (Chỉ Quản trị viên hoặc Khách hàng) */}
                  {(userRole === 'admin' || userRole === 'customer') && (
                    <button 
                      onClick={handleActionCancel}
                      className="w-full py-2.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-[11px] font-bold rounded-lg transition duration-200 cursor-pointer text-center uppercase"
                    >
                      ❌ HỦY ĐƠN HÀNG
                    </button>
                  )}
                </div>
              </div>

              {/* Lịch sử thao tác đơn hàng (dạng bảng lưu mốc thời gian, nhân viên thao tác, nội dung hành động) */}
              <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-xs space-y-3 font-sans">
                <h4 className="text-[10.5px] font-black text-slate-800 uppercase">
                  📜 CHI TIẾT LỊCH SỬ THAO TÁC ĐƠN HÀNG:
                </h4>
                
                <div className="border border-slate-150 rounded-xl overflow-x-auto w-full bg-slate-50">
                  <table className="w-full min-w-[450px] text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-slate-150 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider text-[9px]">
                        <th className="px-3 py-2">Mốc thời gian</th>
                        <th className="px-3 py-2">Thực hiện</th>
                        <th className="px-3 py-2">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 font-medium text-slate-650 bg-white">
                      {(selectedOrder.operations || [
                        { time: '15/06/2026 10:00', user: 'Lê Minh (Vận hành)', action: 'Duyệt hồ sơ định danh và khóa quỹ' },
                        { time: '15/06/2026 10:15', user: 'Nhân viên quầy', action: 'Gửi OTP ký kết hợp đồng khung' }
                      ]).map((op, idx) => (
                        <tr key={idx} className="hover:bg-slate-100/40 transition">
                          <td className="px-3 py-2 font-mono text-slate-400 font-bold whitespace-nowrap">{op.time}</td>
                          <td className="px-3 py-2 text-slate-800 font-bold whitespace-nowrap">{op.user}</td>
                          <td className="px-3 py-2 text-slate-600 font-bold">{op.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* MODAL 1: BÀN GIAO THIẾT BỊ */}
      {showHandoverModal && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-slate-700 font-sans">
            <div className="bg-[#00236f] text-white p-5">
              <h3 className="text-sm font-black uppercase tracking-wider">🤝 BÀN GIAO THIẾT BỊ VẬT LÝ</h3>
              <p className="text-[10px] text-blue-200 mt-1 font-semibold">Gán số Serial của sườn máy còn trống cho đơn {selectedOrder.orderCode}</p>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleActionHandover(handoverSerial); }} className="p-5 space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-450 uppercase block">Chọn sườn thiết bị trống trong tủ kho:</label>
                <select
                  value={handoverSerial}
                  onChange={(e) => setHandoverSerial(e.target.value)}
                  className="w-full bg-white border border-slate-150 p-2.5 rounded-lg text-xs font-bold text-slate-800"
                >
                  <option value="AST0401">AST0401 - Sony Alpha A7 IV (Trống tủ)</option>
                  <option value="AST0402">AST0402 - Sony Alpha A7 IV (Trống tủ)</option>
                  <option value="AST0501">AST0501 - Canon EOS R6 Mark II (Trống tủ)</option>
                  <option value="AST0603">AST0603 - DJI Ronin SC2 (Trống tủ)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowHandoverModal(false)}
                  className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition uppercase text-[10px]"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#00236f] hover:bg-blue-900 text-white font-black rounded-lg transition uppercase text-[10px]"
                >
                  XÁC NHẬN BÀN GIAO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: NHẬN TRẢ THIẾT BỊ */}
      {showReturnModal && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-slate-700 font-sans">
            <div className="bg-[#00236f] text-white p-5">
              <h3 className="text-sm font-black uppercase tracking-wider">🔄 NHẬN TRẢ &amp; KIỂM TRA HAO MÒN</h3>
              <p className="text-[10px] text-blue-200 mt-1 font-semibold">Ghi nhận độ hao mòn sườn và phụ tùng thu hồi từ khách hàng</p>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleActionReturn(returnQualityNote); }} className="p-5 space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-450 uppercase block">Nhập ghi nhận tình trạng vật lý hao mòn:</label>
                <textarea
                  required
                  rows="3"
                  value={returnQualityNote}
                  onChange={(e) => setReturnQualityNote(e.target.value)}
                  placeholder="Ghi nhận độ trầy xước sườn máy, thấu kính có bám bụi hay không..."
                  className="w-full p-2.5 border border-slate-150 rounded-lg outline-none font-medium text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition uppercase text-[10px]"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg transition uppercase text-[10px]"
                >
                  XÁC NHẬN ĐÃ THU HỒI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: KHẤU TRỪ TIỀN CỌC */}
      {showDeductModal && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden text-slate-700 font-sans">
            <div className="bg-[#00236f] text-white p-5">
              <h3 className="text-sm font-black uppercase tracking-wider">⚠️ LẬP BIÊN BẢN KHẤU TRỪ TIỀN CỌC</h3>
              <p className="text-[10px] text-blue-200 mt-1 font-semibold">Khai khấu hao tổn thất vật lý và áp giá bồi hoàn trực tiếp vào tiền cọc</p>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleActionDeduct(deductAmount, deductReason); }} className="p-5 space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-450 uppercase block">Số tiền phạt bồi thường khấu trừ (VND):</label>
                <input
                  type="number"
                  required
                  value={deductAmount}
                  onChange={(e) => setDeductAmount(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 border border-slate-150 rounded-lg outline-none font-bold text-rose-700 font-mono text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-450 uppercase block">Lý do phạt trừ tiền cọc giữ chỗ:</label>
                <input
                  type="text"
                  required
                  value={deductReason}
                  onChange={(e) => setDeductReason(e.target.value)}
                  placeholder="Ví dụ: Làm trầy xước thấu kính..."
                  className="w-full p-2.5 border border-slate-150 rounded-lg outline-none font-bold text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDeductModal(false)}
                  className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition uppercase text-[10px]"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-lg transition uppercase text-[10px]"
                >
                  THỰC THI KHẤU TRỪ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
