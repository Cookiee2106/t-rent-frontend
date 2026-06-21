import React, { useState } from 'react';
import { 
  ClipboardList, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  AlertCircle, 
  XCircle,
  Eye,
  X,
  Search,
  Filter,
  Check,
  ShieldCheck,
  FileText,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Info,
  ChevronRight,
  TrendingUp,
  Package,
  Clock4
} from 'lucide-react';

export default function Orders({
  orders = [],
  onCancelOrder,
  onReturnEquipment,
  setActivePage,
  onSelectOrder
}) {
  // Local state for toast notification
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Filter state
  const [searchCode, setSearchCode] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Dialog / Modal state
  const [viewingOrder, setViewingOrder] = useState(null);
  const [cancelingOrder, setCancelingOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelFieldError, setCancelFieldError] = useState('');

  // 1. STATS LOGIC
  const stats = {
    total: orders.length,
    waitingHandover: orders.filter(o => o.orderStatus === 'DEPOSIT_PAID').length,
    renting: orders.filter(o => o.orderStatus === 'RENTING').length,
    completed: orders.filter(o => o.orderStatus === 'COMPLETED').length
  };

  // 2. FILTER LOGIC
  const filteredOrders = orders.filter((order) => {
    // Search Code
    if (searchCode && !order.orderCode.toLowerCase().includes(searchCode.toLowerCase())) {
      return false;
    }
    // Filter Status
    if (filterStatus !== 'all' && order.orderStatus !== filterStatus) {
      return false;
    }
    // Filter Start Date (receive date)
    if (filterStartDate) {
      // support both YYYY-MM-DD and DD/MM/YYYY
      const formattedStart = formatToComparableDate(order.startDate);
      if (formattedStart < filterStartDate) return false;
    }
    // Filter End Date (return date)
    if (filterEndDate) {
      const formattedEnd = formatToComparableDate(order.endDate);
      if (formattedEnd > filterEndDate) return false;
    }
    return true;
  });

  function formatToComparableDate(dateStr) {
    if (!dateStr) return '';
    if (dateStr.includes('-')) return dateStr; // YYYY-MM-DD
    if (dateStr.includes('/')) {
      const [d, m, y] = dateStr.split('/');
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
    return dateStr;
  }

  // Reset filter handler
  const handleResetFilters = () => {
    setSearchCode('');
    setFilterStatus('all');
    setFilterStartDate('');
    setFilterEndDate('');
    showToast('Đã khởi tạo lại bộ lọc về mặc định', 'success');
  };

  // Get status details & styling helpers
  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'DEPOSIT_PAID':
        return {
          label: 'Đã đặt cọc',
          style: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />
        };
      case 'RENTING':
        return {
          label: 'Đang thuê',
          style: 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]',
          icon: <Clock4 className="w-3.5 h-3.5" />
        };
      case 'COMPLETED':
        return {
          label: 'Hoàn tất',
          style: 'bg-zinc-100 text-zinc-700 border-zinc-200',
          icon: <Check className="w-3.5 h-3.5" />
        };
      case 'CANCELLED':
        return {
          label: 'Đã hủy',
          style: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <XCircle className="w-3.5 h-3.5" />
        };
      default:
        // fallback
        return {
          label: status || 'Đang xử lý',
          style: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: <Info className="w-3.5 h-3.5" />
        };
    }
  };

  const getDepositPaymentBadge = (status) => {
    switch (status) {
      case 'PAID':
        return {
          label: 'Đã thanh toán qua VNPAY Sandbox',
          style: 'bg-green-50 text-green-700 border-green-200'
        };
      case 'PENDING':
        return {
          label: 'Chờ thanh toán',
          style: 'bg-amber-50 text-amber-700 border-amber-200'
        };
      case 'FAILED':
        return {
          label: 'Thanh toán thất bại',
          style: 'bg-rose-50 text-rose-700 border-rose-200'
        };
      case 'REFUNDED':
        return {
          label: 'Đã hoàn cọc',
          style: 'bg-teal-50 text-teal-700 border-teal-200'
        };
      case 'REFUNDED_DEDUCTED':
        return {
          label: 'Đã khấu trừ cọc',
          style: 'bg-pink-50 text-pink-700 border-pink-200'
        };
      case 'REFUND_CANCELLED':
        return {
          label: 'Đã hoàn cọc do hủy đơn',
          style: 'bg-orange-50 text-orange-700 border-orange-200'
        };
      default:
        return {
          label: status || 'Chờ đối soát',
          style: 'bg-slate-150 text-slate-700 border-slate-200'
        };
    }
  };

  // CHECK ELIGIBILITY FOR CANCEL
  const isEligibleToCancel = (order) => {
    // Valid for deposit paid and pending hand over, but not renting, completed, already cancelled.
    return order.orderStatus === 'DEPOSIT_PAID' || order.orderStatus === 'PENDING';
  };

  // HANDLERS
  const handleOpenCancelDialog = (order, e) => {
    e.stopPropagation();
    if (!isEligibleToCancel(order)) {
      showToast('Đơn hàng không đủ điều kiện hủy!', 'error');
      return;
    }
    setCancelingOrder(order);
    setCancelReason('');
    setCancelFieldError('');
  };

  const submitCancellation = () => {
    if (!cancelReason.trim()) {
      setCancelFieldError('Vui lòng nhập lý do hủy đơn (bắt buộc).');
      return;
    }
    // Trigger cancellation
    onCancelOrder(cancelingOrder.orderCode, cancelReason);
    setCancelingOrder(null);
    showToast('Hủy đơn hàng thành công!', 'success');
  };

  const handleOpenDetailModal = (order, e) => {
    if (e) e.stopPropagation();
    setViewingOrder(order);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans" id="t-rent-orders-root">
      
      {/* Toast helper */}
      {toast.show && (
        <div className={`fixed top-20 right-6 z-[200] max-w-sm flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-xl transition-all duration-300 animate-slide-in ${
          toast.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
            : 'bg-rose-50 text-rose-900 border-rose-200'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="text-xs font-bold leading-normal">{toast.message}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* Breadcrumb spacing */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-3 select-none">
          <span className="hover:text-[#00236f] cursor-pointer" onClick={() => setActivePage('home')}>T-Rent</span>
          <ChevronRight className="w-3.5 h-3.5 font-bold" />
          <span className="text-slate-600">Quản lý đơn hàng</span>
        </div>

        {/* Page Title & Desc */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="text-left">
            <h1 className="text-2xl font-black text-[#00236f] uppercase tracking-tight flex items-center gap-2">
              <ClipboardList className="w-6.5 h-6.5 text-[#fea619]" />
              Quản lý đơn thuê của tôi
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">
              Theo dõi các đơn thuê thiết bị, trạng thái thanh toán cọc, bàn giao và hoàn tất.
            </p>
          </div>
        </div>

        {/* Summary mini cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 select-none">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3.5 hover:shadow transition duration-200">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-450 block uppercase font-extrabold tracking-wider">Tổng số đơn</span>
              <span className="text-lg font-black text-slate-800 leading-none">{stats.total}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3.5 hover:shadow transition duration-200">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-450 block uppercase font-extrabold tracking-wider">Chờ bàn giao</span>
              <span className="text-lg font-black text-slate-800 leading-none">{stats.waitingHandover}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3.5 hover:shadow transition duration-200">
            <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-450 block uppercase font-extrabold tracking-wider">Đang thuê máy</span>
              <span className="text-lg font-black text-slate-800 leading-none">{stats.renting}</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3.5 hover:shadow transition duration-200">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
              <Check className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-450 block uppercase font-extrabold tracking-wider">Đơn hoàn tất</span>
              <span className="text-lg font-black text-slate-800 leading-none">{stats.completed}</span>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3 mb-4 select-none">
            <Filter className="w-4.5 h-4.5 text-slate-500" />
            <h2 className="text-xs font-black text-slate-700 uppercase tracking-wide">Bộ lọc tìm kiếm nhanh</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filter 1: Input code */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-500 block text-left">Mã đơn hàng</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-450 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Nhập mã đơn (e.g. ORD001)"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-250 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00236f]/30 transition"
                />
              </div>
            </div>

            {/* Filter 2: Select Status */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-500 block text-left">Trạng thái đơn hàng</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-250 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00236f]/30 transition appearance-none cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="DEPOSIT_PAID">Đã đặt cọc</option>
                <option value="RENTING">Đang thuê</option>
                <option value="COMPLETED">Hoàn tất</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>

            {/* Filter 3: Start Renting Date */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-500 block text-left">Ngày nhận máy từ</label>
              <input 
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-250 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00236f]/30 transition cursor-text"
              />
            </div>

            {/* Filter 4: Return Date */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-500 block text-left">Ngày trả máy đến</label>
              <input 
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-250 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00236f]/30 transition cursor-text"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 border-t border-slate-100 mt-5 pt-4">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 hover:bg-slate-100 text-slate-500 border border-transparent rounded-xl flex items-center gap-1 text-[11px] font-extrabold transition uppercase"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Làm mới bộ lọc
            </button>
            <button
              disabled
              className="px-4 py-2 bg-slate-100 text-slate-400 rounded-xl text-[11px] font-extrabold cursor-not-allowed select-none border border-slate-200"
            >
              Phù hợp: {filteredOrders.length} dòng
            </button>
          </div>
        </div>

        {/* Empty orders state */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl py-20 px-8 text-center shadow-sm select-none">
            <ClipboardList className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-black text-slate-800">Bạn chưa có đơn hàng nào hoặc không có kết quả phù hợp.</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 mb-8 leading-relaxed font-medium">
              Hãy chọn mẫu thiết bị phù hợp và thêm vào giỏ hàng để bắt đầu đặt thuê.
            </p>
            <button
              onClick={() => setActivePage('equipments')}
              className="px-6 py-3 bg-[#00236f] hover:bg-[#fea619] hover:text-[#2a1700] text-white font-extrabold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 mx-auto uppercase tracking-wider"
            >
              <Package className="w-4 h-4" />
              Xem mẫu thiết bị
            </button>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
            {/* Table layout desktop / scroll block */}
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[#0f172a] text-[13px] font-semibold select-none">
                    <th className="px-5 py-3.5 whitespace-nowrap text-left font-semibold min-w-[110px]">Mã đơn hàng</th>
                    <th className="px-4 py-3.5 whitespace-nowrap text-center font-semibold min-w-[110px]">Ngày nhận</th>
                    <th className="px-4 py-3.5 whitespace-nowrap text-center font-semibold min-w-[110px]">Ngày trả</th>
                    <th className="px-4 py-3.5 whitespace-nowrap text-center font-semibold min-w-[100px]">Số ngày</th>
                    <th className="px-4 py-3.5 whitespace-nowrap text-center font-semibold min-w-[80px]">Số mẫu</th>
                    <th className="px-4 py-3.5 whitespace-nowrap text-right font-semibold min-w-[125px]">Thành tiền</th>
                    <th className="px-4 py-3.5 whitespace-nowrap text-right font-semibold min-w-[125px]">Tiền cọc</th>
                    <th className="px-5 py-3.5 whitespace-nowrap text-center font-semibold min-w-[145px]">Thanh toán cọc</th>
                    <th className="px-5 py-3.5 whitespace-nowrap text-center font-semibold min-w-[140px]">Trạng thái</th>
                    <th className="px-5 py-3.5 whitespace-nowrap text-center font-semibold min-w-[150px]">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-xs text-slate-705">
                  {filteredOrders.map((order) => {
                    const osBadge = getOrderStatusBadge(order.orderStatus);
                    const dpBadge = getDepositPaymentBadge(order.depositPaymentStatus);
                    const cancelable = isEligibleToCancel(order);

                    // Compute device count
                    const totalQty = order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 1;

                    return (
                      <tr 
                        key={order.id} 
                        className="hover:bg-slate-50/50 transition cursor-pointer"
                        onClick={() => handleOpenDetailModal(order)}
                      >
                        {/* 1. Code */}
                        <td className="py-4 px-5 cell-code">
                          <span className="text-[#00236f] font-black font-mono text-[13px] hover:underline">
                            {order.orderCode}
                          </span>
                        </td>
                        {/* 2. Start Date */}
                        <td className="py-4 px-4 text-center text-slate-505 cell-date">
                          {order.startDate}
                        </td>
                        {/* 3. Return Date */}
                        <td className="py-4 px-4 text-center text-slate-550 cell-date">
                          {order.endDate}
                        </td>
                        {/* 4. Days */}
                        <td className="py-4 px-4 text-center font-mono font-bold text-slate-800">
                          {order.rentalDays}
                        </td>
                        {/* 5. Device counts */}
                        <td className="py-4 px-4 text-center font-bold">
                          {totalQty}
                        </td>
                        {/* 6. Rental Cost */}
                        <td className="py-4 px-4 text-right text-slate-900 font-bold cell-money">
                          {order.totalRentalAmount.toLocaleString('vi-VN')}đ
                        </td>
                        {/* 7. Deposit */}
                        <td className="py-4 px-4 text-right text-[#00236f] font-black cell-money">
                          {order.totalDepositAmount.toLocaleString('vi-VN')}đ
                        </td>
                        {/* 8. Pay status */}
                        <td className="py-4 px-5 text-center select-none">
                          <span className={`status-badge border ${dpBadge.style}`}>
                            {dpBadge.label}
                          </span>
                        </td>
                        {/* 9. Order status */}
                        <td className="py-4 px-5 text-center select-none">
                          <span className={`status-badge border ${osBadge.style}`}>
                            {osBadge.label}
                          </span>
                        </td>
                        {/* 10. Actions */}
                        <td className="py-4 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="table-action-group justify-center">
                            <button
                              onClick={(e) => handleOpenDetailModal(order, e)}
                              className="table-action-button border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                            >
                              Xem chi tiết
                            </button>
                            <button
                              onClick={(e) => handleOpenCancelDialog(order, e)}
                              disabled={!cancelable}
                              title={cancelable ? "Hủy đơn đặt thuê giữ cọc" : "Đơn hàng đã bàn giao hoặc xử lý hoàn tất, không thể hủy."}
                              className={`table-action-button border transition ${
                                cancelable 
                                  ? 'bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border-rose-200' 
                                  : 'bg-slate-100 text-slate-350 border-slate-200 cursor-not-allowed opacity-50'
                              }`}
                            >
                              Hủy đơn
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: VIEW DETAILED ORDER DRAWERS/DIALOG */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black/60 z-[160] flex justify-end animate-fade-in font-sans">
          {/* Backdrop dismiss */}
          <div className="absolute inset-0" onClick={() => setViewingOrder(null)} />
          
          {/* Drawer container body */}
          <div className="relative bg-white h-screen w-full max-w-xl md:max-w-2xl shadow-2xl flex flex-col z-[170] overflow-hidden animate-slide-left text-left">
            
            {/* Header row details */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-[#00236f]/95 text-white">
              <div className="space-y-0.5">
                <span className="text-[10px] text-blue-200 font-extrabold tracking-widest block uppercase">Màn hình T-Rent chi tiết</span>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-serif font-black text-white">Đơn hàng {viewingOrder.orderCode}</h3>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${getOrderStatusBadge(viewingOrder.orderStatus).style}`}>
                    {getOrderStatusBadge(viewingOrder.orderStatus).label}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setViewingOrder(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable details contents */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              
              {/* ORDER LIFE-CYCLE STEP TIMELINE PROGRESS BAR */}
              <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-2xl select-none">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-4 text-center">Tiến trình bàn đơn</h4>
                <div className="flex items-center justify-between max-w-md mx-auto">
                  
                  {/* Step 1 */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md border-4 border-emerald-100">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] text-slate-700 font-bold mt-1">Gửi đơn</span>
                  </div>
                  
                  <div className={`h-0.5 flex-1 ${
                    viewingOrder.orderStatus !== 'CANCELLED' ? 'bg-emerald-500' : 'bg-slate-300'
                  }`} />

                  {/* Step 2 */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md border-4 border-emerald-100">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] text-slate-700 font-bold mt-1">Đã đặt cọc</span>
                  </div>

                  <div className={`h-0.5 flex-1 ${
                    viewingOrder.orderStatus === 'RENTING' || viewingOrder.orderStatus === 'COMPLETED' ? 'bg-[#0284c7]' : 'bg-slate-200'
                  }`} />

                  {/* Step 3 */}
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                      viewingOrder.orderStatus === 'RENTING' || viewingOrder.orderStatus === 'COMPLETED'
                        ? 'bg-[#0284c7] text-white border-[#bae6fd] shadow-md'
                        : 'bg-slate-100 text-slate-350 border-slate-200'
                    }`}>
                      {viewingOrder.orderStatus === 'COMPLETED' ? <Check className="w-4 h-4" /> : '3'}
                    </div>
                    <span className="text-[9px] text-slate-750 font-bold mt-1">Đang thuê</span>
                  </div>

                  <div className={`h-0.5 flex-1 ${
                    viewingOrder.orderStatus === 'COMPLETED' ? 'bg-zinc-700' : 'bg-slate-200'
                  }`} />

                  {/* Step 4 */}
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                      viewingOrder.orderStatus === 'COMPLETED'
                        ? 'bg-zinc-700 text-white border-zinc-200 shadow-md'
                        : 'bg-slate-100 text-slate-350 border-slate-200'
                    }`}>
                      {viewingOrder.orderStatus === 'COMPLETED' ? <Check className="w-4 h-4" /> : '4'}
                    </div>
                    <span className="text-[9px] text-slate-700 font-bold mt-1">Hoàn tất</span>
                  </div>

                </div>
              </div>

              {/* SECTION A: THÔNG TIN ĐƠN HÀNG CHUNG */}
              <div className="bg-slate-10/40 border border-slate-200 rounded-2xl p-5 space-y-3.5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <FileText className="w-4.5 h-4.5 text-[#00236f]" />
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">A. Thông tin đơn đặt thuê máy</h4>
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">MÃ GIAO DỊCH ĐƠN:</span>
                    <span className="font-mono font-black text-slate-800">{viewingOrder.orderCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">NGÀY KHỞI TẠO:</span>
                    <span className="font-bold text-slate-700">{viewingOrder.createdAt}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">KỲ THUỂ (CHECKIN-CHECKOUT):</span>
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {viewingOrder.startDate} đến {viewingOrder.endDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">TỔNG THỜI GIAN THUÊ:</span>
                    <span className="font-bold text-slate-800">{viewingOrder.rentalDays} ngày sử dụng</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">PHƯƠNG THỨC CHỦ ĐẠO:</span>
                    <span className="font-bold text-amber-700 font-mono text-[11px]">VNPAY Sandbox (Online)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">TIỀN CỌC THIẾT BỊ:</span>
                    <span className="font-black text-amber-600 font-mono text-xs">{viewingOrder.totalDepositAmount.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                </div>
              </div>

              {/* SECTION B: THÔNG TIN KHÁCH HÀNG */}
              <div className="bg-slate-10/40 border border-slate-200 rounded-2xl p-5 space-y-3.5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-green-600" />
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">B. Khách hàng giao dịch</h4>
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-semibold">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">HỌ VÀ TÊN KHÁCH:</span>
                    <span className="font-bold text-slate-800">{viewingOrder.customer.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">ĐỊA CHỈ TRUY CẬP EMAIL:</span>
                    <span className="font-bold text-slate-600">{viewingOrder.customer.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">SỐ ĐIỆN THOẠI DI ĐỘNG:</span>
                    <span className="font-mono text-slate-800">{viewingOrder.customer.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">XÁC MINH CÔNG DÂN:</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-50 text-green-700 font-black border border-green-200 text-[9px] uppercase leading-none">
                      {viewingOrder.customer.verificationStatus === 'APPROVED' ? 'Đã duyệt bằng lái' : 'Chưa định danh'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION C: DANH SÁCH MẪU THIẾT BỊ THUÊ */}
              <div className="bg-slate-10/40 border border-slate-200 rounded-2xl p-5 space-y-3.5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Package className="w-4.5 h-4.5 text-blue-600" />
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">C. Danh sách mẫu camera và phụ kiện chọn lọc</h4>
                </div>
                
                <div className="space-y-3">
                  {viewingOrder.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-2.5">
                      <div className="flex justify-between items-start gap-2">
                        <div className="text-left">
                          <h5 className="font-black text-slate-800 text-[12.5px] font-sans">{item.productModel}</h5>
                          <p className="text-[10px] text-slate-450 uppercase font-black tracking-wider mt-0.5">
                            Thương hiệu: {item.brand} | Loại: {item.category}
                          </p>
                        </div>
                        <span className="bg-[#00236f]/10 text-[#00236f] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                          Số lượng: {item.quantity} máy
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-dotted border-slate-200 text-[11px] font-semibold text-slate-600">
                        <div>
                          <span className="text-slate-450 block text-[9px] font-bold">Đơn giá/Ngày:</span>
                          <span className="font-bold">{item.dailyPrice.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div>
                          <span className="text-slate-450 block text-[9px] font-bold">Tiền thuê ({viewingOrder.rentalDays} ngày):</span>
                          <span className="font-bold text-slate-800">{item.rentalAmount.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div>
                          <span className="text-slate-450 block text-[9px] font-bold">Bảo cọc giữ máy:</span>
                          <span className="font-bold text-amber-600">{item.depositAmount.toLocaleString('vi-VN')}đ</span>
                        </div>
                      </div>

                      {/* Included accessories gear lists */}
                      <div className="space-y-1 bg-white/80 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-[9px] text-slate-400 block font-black uppercase tracking-widest">Phụ kiện đi kèm theo máy miễn phí:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1">
                          {item.includedItems.map((acc, aIdx) => (
                            <div key={aIdx} className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-50 px-2 py-1 border border-slate-100 rounded">
                              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                              <span className="truncate">{acc.name} (x{acc.quantity})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION D: LỊCH SỬ THANH TOÁN CỌC QUA CỔNG VNPAY */}
              <div className="bg-slate-10/40 border border-slate-200 rounded-2xl p-5 space-y-3.5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <DollarSign className="w-4.5 h-4.5 text-amber-600" />
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">D. Thông tin thanh toán cọc VND</h4>
                </div>
                {viewingOrder.depositPayment ? (
                  <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs font-semibold text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold">PHƯƠNG THỨC:</span>
                      <span className="font-black text-[#00236f] font-mono text-[11px]">VNPAY SANDBOX ONLINE</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold">MÃ GIAO DỊCH CỔNG:</span>
                      <span className="font-mono font-black text-slate-800">{viewingOrder.depositPayment.paymentCode}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold">TỔNG SỐ TIỀN ĐÃ KÝ GỬI:</span>
                      <span className="font-black text-emerald-600 font-mono text-xs">{viewingOrder.depositPayment.amount.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold">THỜI GIAN GIAO DỊCH:</span>
                      <span className="text-slate-700 font-bold">{viewingOrder.depositPayment.paidAt}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold">TRẠNG THÁI GIAO DỊCH PHỤ:</span>
                      <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold">
                        Đã xác nhận thanh toán thành công
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-rose-500 font-bold">Chưa thanh toán cọc.</p>
                )}
              </div>

              {/* SECTION E: ĐIỀU KHOẢN THUÊ ĐÃ HỢP ĐỒNG ĐỒNG Ý */}
              <div className="bg-slate-10/40 border border-slate-200 rounded-2xl p-5 space-y-3.5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-blue-600" />
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">E. Thỏa thuận và Điều khoản bảo cọc thuê camera</h4>
                </div>
                <div className="text-xs leading-relaxed text-slate-600 bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-2 font-semibold">
                  <p className="text-[11px]">✔ <strong>Ủy quyền tài sản:</strong> Bên thuê cam kết bàn giao giữ tài chính cọc camera đầy đủ.</p>
                  <p className="text-[11px]">✔ <strong>Xử lý hư hại:</strong> Khấu trừ cọc nếu phát hiện rơi vỡ, trầy xước không đúng khi bàn giao.</p>
                  <p className="text-[11px] text-slate-500 border-t border-slate-200 pt-2 flex items-center gap-1 select-none">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                    Đồng ý thỏa thuận vào lúc: {viewingOrder.termAcceptance?.acceptedAt || 'Đồng ý trực tuyến khi cọc'}
                  </p>
                </div>
              </div>

              {/* SECTION F: LỊCH SỬ BÀN GIAO THIẾT BỊ VẬT LÝ */}
              <div className="bg-slate-10/40 border border-slate-200 rounded-2xl p-5 space-y-3.5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Package className="w-4.5 h-4.5 text-slate-650" />
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">F. Thông tin biên bản bàn bàn giao khi nhận máy</h4>
                </div>
                <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs font-semibold text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">TRẠNG THÁI BÀN GIAO MÁY:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block mt-1 ${
                      viewingOrder.handover?.status === 'DELIVERED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-250'
                        : 'bg-slate-100 text-slate-450 border-slate-200'
                    }`}>
                      {viewingOrder.handover?.status === 'DELIVERED' ? 'Đã bàn giao tại quầy' : 'Đơn chưa bàn giao'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">THỜI GIAN BÀN GIAO:</span>
                    <span className="text-slate-805 block font-bold mt-1">{viewingOrder.handover?.handoverAt || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">NHÂN VIÊN PHỤ TRÁCH:</span>
                    <span className="text-slate-805 block font-bold mt-1">{viewingOrder.handover?.staffName || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold">HỢP ĐỒNG GIẤY KÝ KẾT:</span>
                    <span className="text-slate-805 block font-bold mt-1">{viewingOrder.handover?.paperContractUploaded ? '✔ Đã lưu bản cứng scan' : 'Chưa lưu'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px] font-bold">ẢNH CHỤP BÀN GIAO LÀM CHỨNG:</span>
                    <span className="text-slate-850 block font-bold mt-1">{viewingOrder.handover?.handoverImagesUploaded ? '✔ Đã tải lên ảnh thiết bị thực tế' : 'Chưa tải'}</span>
                  </div>
                  {viewingOrder.handover?.notes && (
                    <div className="col-span-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <span className="text-amber-800 text-[10px] font-black uppercase block tracking-wider mb-1">Ghi chú bàn giao:</span>
                      <p className="text-[11px] text-amber-950 font-bold leading-normal">{viewingOrder.handover.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION G & H: KIỂM KÊ HOÀN TRẢ HOẶC DO HỦY ĐƠN */}
              {viewingOrder.returnInfo && (
                <div className="bg-teal-50/50 border border-teal-200 rounded-2xl p-5 space-y-3.5">
                  <div className="flex items-center gap-2 border-b border-teal-200 pb-2">
                    <RotateCcw className="w-4.5 h-4.5 text-teal-700" />
                    <h4 className="text-xs font-black text-teal-800 uppercase tracking-wide">G. Biên bản nghiệm thu kiểm kê trả máy</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-semibold text-slate-700">
                    <div>
                      <span className="text-teal-800/60 block text-[10px] font-bold">NGÀY TRẢ THỰC TẾ:</span>
                      <span className="font-bold">{viewingOrder.returnInfo.actualReturnDate}</span>
                    </div>
                    <div>
                      <span className="text-teal-800/60 block text-[10px] font-bold">KẾT QUẢ ĐỐI SOÁT:</span>
                      <span className="font-bold">{viewingOrder.returnInfo.inventoryResult}</span>
                    </div>
                    <div>
                      <span className="text-teal-800/60 block text-[10px] font-bold">TIỀN HOÀN TRẢ KHÁCH VÀ QUY CÁCH:</span>
                      <span className="font-black text-teal-700 font-mono text-xs">{viewingOrder.returnInfo.depositRefundAmount.toLocaleString('vi-VN')}đ ({viewingOrder.returnInfo.depositRefundStatus})</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-teal-800/60 block text-[10px] font-bold">GHI CHÚ KIỂM KÊ:</span>
                      <p className="text-[11px] text-slate-650 leading-relaxed mt-1 font-bold">{viewingOrder.returnInfo.notes}</p>
                    </div>
                  </div>
                </div>
              )}

              {viewingOrder.orderStatus === 'CANCELLED' && (
                <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-5 space-y-3.5 animate-pulse-slow">
                  <div className="flex items-center gap-2 border-b border-rose-105 pb-2">
                    <XCircle className="w-4.5 h-4.5 text-rose-700" />
                    <h4 className="text-xs font-black text-rose-800 uppercase tracking-wide">Thông tin hủy bỏ đặt đơn giữ máy</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-y-2 text-xs font-semibold">
                    <div>
                      <span className="text-rose-700/60 block text-[10px] font-bold">LÝ DO HỦY ĐƠN HÀNG:</span>
                      <p className="font-bold text-rose-950 bg-rose-50 p-3 rounded-lg border border-rose-100 mt-1 leading-normal">
                        {viewingOrder.cancelReason || 'Người dùng trực tuyến tự hủy bỏ đơn đặt.'}
                      </p>
                    </div>
                    {viewingOrder.cancelledAt && (
                      <div>
                        <span className="text-rose-700/60 block text-[10px] font-bold">THỜI GIAN THỰC HIỆN HỦY:</span>
                        <span className="font-bold text-rose-900">{viewingOrder.cancelledAt}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Sticky footer action buttons (pure read-only view) */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 select-none">
              <button 
                onClick={() => setViewingOrder(null)}
                className="px-5 py-2.5 bg-[#00236f] hover:bg-[#fea619] hover:text-[#2a1700] text-white font-extrabold text-xs rounded-xl shadow transition uppercase"
              >
                Đã hiểu và Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRM CANCEL ORDER POPUP */}
      {cancelingOrder && (
        <div className="fixed inset-0 bg-black/60 z-[180] flex items-center justify-center p-4 animate-fade-in font-sans">
          
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden w-full max-w-lg shadow-2xl relative animate-scale-up text-left flex flex-col">
            
            {/* Header Dialog */}
            <div className="px-6 py-4 bg-rose-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h3 className="font-serif font-black text-base text-white">Yêu cầu hủy đơn hàng {cancelingOrder.orderCode}</h3>
              </div>
              <button 
                onClick={() => setCancelingOrder(null)}
                className="text-white bg-white/10 hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body scroll */}
            <div className="px-6 py-5 space-y-5 leading-normal max-h-[70vh] overflow-y-auto">
              
              <div className="bg-rose-50 text-rose-950 p-4 rounded-xl border border-rose-100 text-xs font-semibold leading-relaxed">
                <p className="font-bold">⚠️ Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
                <p className="mt-1 text-rose-800">Sau khi hoàn tất hủy đơn, trạng thái đơn sẽ đổi sang “Đã hủy”. Các giao dịch đặt cọc giữ chỗ sẽ được hệ thống tiến hành hoàn cọc tự động qua VNPay theo quy trình của T-Rent.</p>
              </div>

              {/* Order summarizing details */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs font-bold text-slate-700 space-y-2">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider leading-none">Tóm tắt đơn hàng hủy:</p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>Mã đơn: <span className="font-mono font-black text-slate-800">{cancelingOrder.orderCode}</span></div>
                  <div>Trạng thái hiện tại: <span className="text-emerald-700 font-extrabold">Đã đặt cọc</span></div>
                  <div>Nhận máy: <span className="text-slate-800">{cancelingOrder.startDate}</span></div>
                  <div>Trả máy: <span className="text-slate-800">{cancelingOrder.endDate}</span></div>
                  <div className="col-span-2">
                    Thiết bị thuê: <span className="text-[#00236f]">{cancelingOrder.items.map(i => `${i.productModel} (x${i.quantity})`).join(', ')}</span>
                  </div>
                  <div>Tiền cọc thiết bị: <span className="text-amber-600 font-black font-mono">{cancelingOrder.totalDepositAmount.toLocaleString('vi-VN')}đ</span></div>
                  <div>Tiền thuê dự kiến: <span className="text-slate-900 font-black font-mono">{cancelingOrder.totalRentalAmount.toLocaleString('vi-VN')}đ</span></div>
                </div>
              </div>

              {/* Textarea lý do */}
              <div className="space-y-1.5 text-xs">
                <label className="font-black text-slate-700 flex items-center gap-1">
                  Nhập lý do hủy đơn <span className="text-red-500 font-bold">*</span>
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => {
                    setCancelReason(e.target.value);
                    if (e.target.value.trim()) setCancelFieldError('');
                  }}
                  rows={3}
                  className={`w-full p-3 font-semibold bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition text-xs ${
                    cancelFieldError ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-250'
                  }`}
                  placeholder="Ghi rõ lý do thay đổi lịch trình, đổi ý, hay sự cố đột xuất... (Lý do hủy đơn là bắt buộc)"
                />
                {cancelFieldError && (
                  <p className="text-red-500 text-[11px] font-bold flex items-center gap-1 select-none">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {cancelFieldError}
                  </p>
                )}
              </div>

            </div>

            {/* Footer action buttons */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex justify-end gap-3 select-none">
              <button
                type="button"
                onClick={() => setCancelingOrder(null)}
                className="px-4.5 py-2 hover:bg-slate-200 text-slate-600 font-extrabold text-xs rounded-xl transition uppercase"
              >
                Không hủy
              </button>
              <button
                type="button"
                onClick={submitCancellation}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition uppercase"
              >
                Xác nhận hủy đơn
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
