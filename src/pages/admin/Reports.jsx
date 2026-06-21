import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  User, 
  Eye, 
  ShieldAlert, 
  X, 
  Filter, 
  SlidersHorizontal,
  DollarSign, 
  CreditCard, 
  ClipboardList, 
  Info,
  Archive,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Laptop
} from 'lucide-react';

const formatVND = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Dữ liệu mẫu Báo cáo tồn kho bắt buộc có ít nhất 4 dòng
const INVENTORY_REPORT_DATA = [
  {
    productModel: "Sony A7 IV",
    brand: "Sony",
    category: "Body máy ảnh",
    totalPhysicalAssets: 5,
    availableAssets: 3,
    rentingAssets: 1,
    maintenanceAssets: 1,
    inactiveAssets: 0,
    rentableCompleteKits: 2,
    stockStatus: "Đủ bộ cho thuê",
    limitingComponent: "Lens 24-70 GM",
    statusModel: "Hoạt động",
    includedItems: [
      {
        itemName: "Pin NP-FZ100",
        managementType: "Thiết bị vật lý định danh",
        requiredQuantityPerKit: 1,
        availableQuantity: 3,
        supportedKits: 3,
        status: "Đủ"
      },
      {
        itemName: "Lens 24-70 GM",
        managementType: "Thiết bị vật lý định danh",
        requiredQuantityPerKit: 1,
        availableQuantity: 2,
        supportedKits: 2,
        status: "Thiếu so với body"
      },
      {
        itemName: "Túi Sony",
        managementType: "Phụ kiện số lượng",
        requiredQuantityPerKit: 1,
        availableQuantity: 5,
        supportedKits: 5,
        status: "Đủ"
      }
    ],
    message: "Có 3 body Sony sẵn sàng nhưng chỉ tạo được 2 bộ hoàn chỉnh do thiếu Lens 24-70 GM.",
    warning: "Thiếu 1 Lens 24-70 GM để tận dụng đủ 3 body Sony sẵn sàng."
  },
  {
    productModel: "Fuji X-T5",
    brand: "Fujifilm",
    category: "Body máy ảnh",
    totalPhysicalAssets: 3,
    availableAssets: 2,
    rentingAssets: 1,
    maintenanceAssets: 0,
    inactiveAssets: 0,
    rentableCompleteKits: 1,
    stockStatus: "Thiếu thành phần đi kèm",
    limitingComponent: "Lens XF 35mm",
    statusModel: "Hoạt động",
    includedItems: [
      {
        itemName: "Pin Fuji NP-W235",
        managementType: "Thiết bị vật lý định danh",
        requiredQuantityPerKit: 1,
        availableQuantity: 2,
        supportedKits: 2,
        status: "Đủ"
      },
      {
        itemName: "Lens XF 35mm",
        managementType: "Thiết bị vật lý định danh",
        requiredQuantityPerKit: 1,
        availableQuantity: 1,
        supportedKits: 1,
        status: "Thiếu so với body"
      },
      {
        itemName: "Túi Fuji",
        managementType: "Phụ kiện số lượng",
        requiredQuantityPerKit: 1,
        availableQuantity: 6,
        supportedKits: 6,
        status: "Đủ"
      }
    ],
    message: "Có 2 body Fuji sẵn sàng nhưng chỉ tạo được 1 bộ hoàn chỉnh do thiếu Lens XF 35mm.",
    warning: "Thiếu 1 Lens XF 35mm để tạo đủ 2 bộ Fuji X-T5."
  },
  {
    productModel: "Lens 24-70 GM",
    brand: "Sony",
    category: "Lens",
    totalPhysicalAssets: 4,
    availableAssets: 2,
    rentingAssets: 1,
    maintenanceAssets: 1,
    inactiveAssets: 0,
    rentableCompleteKits: 2,
    stockStatus: "Đủ thiết bị",
    limitingComponent: "Không có",
    statusModel: "Hoạt động",
    includedItems: [
      {
        itemName: "Cáp trước / sau",
        managementType: "Phụ kiện số lượng",
        requiredQuantityPerKit: 1,
        availableQuantity: 4,
        supportedKits: 4,
        status: "Đủ"
      }
    ],
    message: "Tất cả các Lens 24-70 GM đều có đầy đủ linh kiện đi kèm.",
    warning: "Thiết bị có đầy đủ phụ kiện cấu hình."
  },
  {
    productModel: "Canon EOS R6",
    brand: "Canon",
    category: "Body máy ảnh",
    totalPhysicalAssets: 2,
    availableAssets: 0,
    rentingAssets: 1,
    maintenanceAssets: 1,
    inactiveAssets: 0,
    rentableCompleteKits: 0,
    stockStatus: "Hết khả dụng",
    limitingComponent: "Không còn thiết bị chính sẵn sàng",
    statusModel: "Hoạt động",
    includedItems: [
      {
        itemName: "Pin LP-E6NH",
        managementType: "Thiết bị vật lý định danh",
        requiredQuantityPerKit: 1,
        availableQuantity: 2,
        supportedKits: 2,
        status: "Đủ"
      }
    ],
    message: "Không còn body Canon EOS R6 nào ở trạng thái Sẵn sàng để kết hợp.",
    warning: "Không thể tạo bộ cho thuê do hết thiết bị chính khả dụng."
  }
];

// Dữ liệu mẫu Báo cáo thanh toán
const PAYMENT_REPORT_DATA = [
  {
    paymentCode: "PAY001",
    orderCode: "ORD001",
    customerName: "Nguyễn Văn A",
    paymentType: "Cọc giữ chỗ",
    paymentMethod: "VNPAY Sandbox",
    amount: 6000000,
    status: "Đã thanh toán",
    paidAt: "2026-06-18 10:30",
    note: "Thanh toán cọc giữ chỗ cho đơn ORD001"
  },
  {
    paymentCode: "PAY002",
    orderCode: "ORD003",
    customerName: "Trần Thị B",
    paymentType: "Hoàn cọc",
    paymentMethod: "VNPAY Sandbox",
    amount: 3000000,
    status: "Đã hoàn cọc",
    paidAt: "2026-06-13 15:00",
    note: "Hoàn cọc sau khi thanh lý hợp đồng"
  },
  {
    paymentCode: "PAY003",
    orderCode: "ORD004",
    customerName: "Lê Văn C",
    paymentType: "Khấu trừ cọc",
    paymentMethod: "VNPAY Sandbox",
    amount: 1000000,
    status: "Đã khấu trừ",
    paidAt: "2026-06-14 16:20",
    note: "Khấu trừ do lens hư hỏng khi trả"
  }
];

// Dữ liệu mẫu Nhật ký thao tác
const SYSTEM_LOGS_DATA = [
  {
    id: "LOG001",
    time: "2026-06-18 09:00",
    user: "Nhân viên A",
    role: "Nhân viên",
    module: "Quản lý tài khoản",
    action: "Duyệt hồ sơ xác minh",
    description: "Duyệt hồ sơ xác minh của khách hàng Nguyễn Văn A",
    relatedObject: "nguyenvana@example.com",
    result: "Thành công",
    note: "Khách hàng đã cung cấp đủ GPLX và CCCD trùng khớp gương mặt rà quét."
  },
  {
    id: "LOG002",
    time: "2026-06-18 10:30",
    user: "Hệ thống",
    role: "Hệ thống",
    module: "Giỏ hàng / Đặt thuê",
    action: "Ghi nhận thanh toán cọc",
    description: "Ghi nhận thanh toán cọc qua VNPAY Sandbox cho đơn ORD001",
    relatedObject: "ORD001 / PAY001",
    result: "Thành công",
    note: "Nhận phản hồi IPN thành công từ cổng thử nghiệm của VNPay."
  },
  {
    id: "LOG003",
    time: "2026-06-20 08:30",
    user: "Nhân viên A",
    role: "Nhân viên",
    module: "Quản lý đơn hàng",
    action: "Lập phiếu bàn giao",
    description: "Lập phiếu bàn giao cho đơn ORD001",
    relatedObject: "ORD001",
    result: "Thành công",
    note: "Khách đã trực tiếp ký nhận đầy đủ phụ kiện máy ảnh."
  },
  {
    id: "LOG004",
    time: "2026-06-23 17:00",
    user: "Nhân viên B",
    role: "Nhân viên",
    module: "Thanh lý hợp đồng",
    action: "Lập phiếu trả và kiểm kê",
    description: "Ghi nhận Lens XF 35mm hư hỏng khi khách trả thiết bị",
    relatedObject: "ORD001 / LEN012",
    result: "Thành công",
    note: "Trầy xước kính ngoài thấu kính, lập biên bản khấu trừ 1.000.000đ tiền cọc."
  },
  {
    id: "LOG005",
    time: "2026-06-24 09:00",
    user: "Quản trị viên",
    role: "Quản trị viên",
    module: "Quản lý mẫu thiết bị",
    action: "Cấu hình bộ đi kèm",
    description: "Cập nhật bộ đi kèm cho Sony A7 IV",
    relatedObject: "Sony A7 IV",
    result: "Thành công",
    note: "Thêm ống kính Lens 24-70 GM làm tùy chọn định danh bắt buộc để tính bộ."
  }
];

export default function Reports({ userRole }) {
  // --- KIỂM TRA QUYỀN TRUY CẬP ---
  if (userRole !== 'admin') {
    return (
      <div className="p-8 bg-white border border-rose-200 rounded-2xl text-center shadow-sm max-w-xl mx-auto my-12" id="no-access-container">
        <ShieldAlert className="w-12 h-12 text-[#b91c1c] mx-auto mb-4" />
        <h3 className="text-lg font-black text-[#991b1b] uppercase mb-2">Bạn không có quyền truy cập chức năng này</h3>
        <p className="text-xs text-slate-500 font-bold">Màn hình này chỉ dành riêng cho Quản trị viên hệ thống.</p>
      </div>
    );
  }

  // --- TABS & MODALS STATE ---
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'payment' | 'logs'
  const [selectedInventoryDetail, setSelectedInventoryDetail] = useState(null);
  const [selectedLogDetail, setSelectedLogDetail] = useState(null);

  // --- FILTERS STATE (BÁO CÁO TỒN KHO) ---
  const [invSearch, setInvSearch] = useState('');
  const [invBrand, setInvBrand] = useState('Tất cả');
  const [invCategory, setInvCategory] = useState('Tất cả');
  const [invStatus, setInvStatus] = useState('Tất cả');

  // --- FILTERS STATE (BÁO CÁO THANH TOÁN) ---
  const [payOrderSearch, setPayOrderSearch] = useState('');
  const [payType, setPayType] = useState('Tất cả');
  const [payStatus, setPayStatus] = useState('Tất cả');
  const [payStartDate, setPayStartDate] = useState('');
  const [payEndDate, setPayEndDate] = useState('');

  // --- FILTERS STATE (NHẬT KÝ THAO TÁC) ---
  const [logActorSearch, setLogActorSearch] = useState('');
  const [logRoleSelected, setLogRoleSelected] = useState('Tất cả');
  const [logModuleSelected, setLogModuleSelected] = useState('Tất cả');
  const [logActionSelected, setLogActionSelected] = useState('Tất cả');
  const [logResultSelected, setLogResultSelected] = useState('Tất cả');
  const [logStartDate, setLogStartDate] = useState('');
  const [logEndDate, setLogEndDate] = useState('');

  // --- FILTERING LOGIC ---
  const filteredInventory = INVENTORY_REPORT_DATA.filter(item => {
    const matchesSearch = item.productModel.toLowerCase().includes(invSearch.toLowerCase());
    const matchesBrand = invBrand === 'Tất cả' || item.brand === invBrand;
    const matchesCategory = invCategory === 'Tất cả' || item.category === invCategory;
    const matchesStatus = invStatus === 'Tất cả' || item.statusModel === invStatus;
    return matchesSearch && matchesBrand && matchesCategory && matchesStatus;
  });

  const filteredPayments = PAYMENT_REPORT_DATA.filter(p => {
    const matchesOrder = p.orderCode.toLowerCase().includes(payOrderSearch.toLowerCase());
    const matchesType = payType === 'Tất cả' || p.paymentType === payType;
    const matchesStatus = payStatus === 'Tất cả' || p.status === payStatus;
    
    let matchesDate = true;
    if (payStartDate) {
      const tempDateStr = p.paidAt.split(' ')[0]; // "2026-06-18"
      matchesDate = matchesDate && tempDateStr >= payStartDate;
    }
    if (payEndDate) {
      const tempDateStr = p.paidAt.split(' ')[0];
      matchesDate = matchesDate && tempDateStr <= payEndDate;
    }
    return matchesOrder && matchesType && matchesStatus && matchesDate;
  });

  const filteredLogs = SYSTEM_LOGS_DATA.filter(l => {
    const matchesActor = l.user.toLowerCase().includes(logActorSearch.toLowerCase());
    const matchesRole = logRoleSelected === 'Tất cả' || l.role === logRoleSelected;
    const matchesModule = logModuleSelected === 'Tất cả' || l.module === logModuleSelected;
    const matchesAction = logActionSelected === 'Tất cả' || l.action === logActionSelected;
    const matchesResult = logResultSelected === 'Tất cả' || l.result === logResultSelected;
    
    let matchesDate = true;
    if (logStartDate) {
      const tempDateStr = l.time.split(' ')[0];
      matchesDate = matchesDate && tempDateStr >= logStartDate;
    }
    if (logEndDate) {
      const tempDateStr = l.time.split(' ')[0];
      matchesDate = matchesDate && tempDateStr <= logEndDate;
    }
    return matchesActor && matchesRole && matchesModule && matchesAction && matchesResult && matchesDate;
  });

  // --- STATS CALCULATION FOR PAYMENT TAB ---
  const totalCocReceived = PAYMENT_REPORT_DATA
    .filter(p => p.paymentType === 'Cọc giữ chỗ' && p.status === 'Đã thanh toán')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCocRefunded = PAYMENT_REPORT_DATA
    .filter(p => p.paymentType === 'Hoàn cọc' && p.status === 'Đã hoàn cọc')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCocDeducted = PAYMENT_REPORT_DATA
    .filter(p => p.paymentType === 'Khấu trừ cọc' && p.status === 'Đã khấu trừ')
    .reduce((sum, p) => sum + p.amount, 0);

  const vnpaySuccessCount = PAYMENT_REPORT_DATA.filter(p => p.status.includes('Đã')).length;

  return (
    <div className="space-y-6 select-none font-sans text-left" id="reports-main-screen">
      
      {/* Breadcrumb */}
      <div className="text-xs text-slate-400 font-bold flex items-center gap-1.5" id="breadcrumb">
        <span>Trang chủ</span>
        <span>/</span>
        <span className="text-[#00236f] font-black">Báo cáo và nhật ký thao tác</span>
      </div>

      {/* Header trang */}
      <div className="bg-white border border-[#e2e8f0] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs" id="page-header">
        <div>
          <h2 className="text-xl font-bold text-[#00236f] flex items-center gap-2 uppercase tracking-wide">
            <TrendingUp className="w-5 h-5 text-[#00236f]" />
            Báo cáo và nhật ký thao tác
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Xem báo cáo tồn kho, báo cáo thanh toán và nhật ký thao tác trong hệ thống.
          </p>
        </div>

        {/* Tab switcher - Ngang hàng dạng card lựa chọn phía trên */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 shrink-0" id="reports-tabs-switcher">
          <button 
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'inventory' 
                ? 'bg-[#00236f] text-white shadow' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
            id="tab-btn-inventory"
          >
            <Archive className="w-3.5 h-3.5" />
            Báo cáo tồn kho
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('payment')}
            className={`px-4 py-2 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'payment' 
                ? 'bg-[#00236f] text-white shadow' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
            id="tab-btn-payment"
          >
            <CreditCard className="w-3.5 h-3.5" />
            Báo cáo thanh toán
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'logs' 
                ? 'bg-[#00236f] text-white shadow' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
            id="tab-btn-logs"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            Nhật ký thao tác
          </button>
        </div>
      </div>

      {/* --- TAB 1: BÁO CÁO TỒN KHO --- */}
      {activeTab === 'inventory' && (
        <div className="space-y-6" id="inventory-report-tab">
          
          {/* Bộ lọc tồn kho */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs" id="inv-filters">
            <div className="flex items-center gap-2 mb-4 text-[#00236f]">
              <Filter className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wide">Bộ lọc tìm kiếm mẫu thiết bị</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase mb-1.5">Tên mẫu thiết bị</label>
                <input 
                  type="text" 
                  value={invSearch}
                  onChange={(e) => setInvSearch(e.target.value)}
                  placeholder="Nhập tên mẫu..." 
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2 text-xs font-bold outline-none text-slate-700 placeholder:text-slate-400 focus:border-[#00236f]"
                  id="inv-filter-name"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase mb-1.5">Hãng</label>
                <select 
                  value={invBrand} 
                  onChange={(e) => setInvBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-[#cbd5e1] rounded-xl px-3 py-2 text-xs font-bold outline-none text-slate-705"
                  id="inv-filter-brand"
                >
                  <option value="Tất cả">Tất cả hãng / Thương hiệu</option>
                  <option value="Sony">Sony</option>
                  <option value="Fujifilm">Fujifilm</option>
                  <option value="Canon">Canon</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase mb-1.5">Danh mục</label>
                <select 
                  value={invCategory} 
                  onChange={(e) => setInvCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-[#cbd5e1] rounded-xl px-3 py-2 text-xs font-bold outline-none text-slate-705"
                  id="inv-filter-category"
                >
                  <option value="Tất cả">Tất cả danh mục</option>
                  <option value="Body máy ảnh">Body máy ảnh</option>
                  <option value="Lens">Lens</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase mb-1.5">Trạng thái mẫu thiết bị</label>
                <select 
                  value={invStatus} 
                  onChange={(e) => setInvStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-[#cbd5e1] rounded-xl px-3 py-2 text-xs font-bold outline-none text-slate-705"
                  id="inv-filter-status"
                >
                  <option value="Tất cả">Tất cả trạng thái</option>
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                </select>
              </div>
            </div>
          </div>

          {/* Banner giải nghĩa tính toán logic bộ đi kèm (không được vẽ thành chức năng riêng) */}
          <div className="bg-[#f8fafc] border border-slate-200 p-4 rounded-xl text-xs flex gap-3 text-slate-700" id="calculation-logic-info">
            <Info className="w-5 h-5 text-[#00236f] shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="font-black text-slate-800">Phương pháp hệ thống rà soát và đếm bộ đi kèm:</p>
              <p className="font-semibold text-slate-500 leading-relaxed">
                Số bộ có thể cho thuê của một mẫu thiết bị được xác định bằng giá trị nhỏ nhất giữa:
                <br />
                <span className="font-mono text-[#00236f] block bg-[#edf2f7] p-2 rounded-lg border border-slate-200 my-1">
                  Số bộ = min(Số thiết bị chính sẵn sàng, Thiết bị định danh đáp ứng, Phụ kiện số lượng đáp ứng)
                </span>
                Hệ thống tự động phát hiện thành phần giới hạn đang gây nghẽn cổ chai và cảnh báo trực quan cho Quản trị viên trong chi tiết mẫu.
              </p>
            </div>
          </div>

          {/* Bảng tồn kho tổng hợp theo từng mẫu thiết bị */}
          <div className="table-wrapper border border-slate-200 rounded-2xl overflow-hidden shadow-xs" id="inv-table-card">
            <div className="w-full">
              <table className="data-table">
                <thead>
                  <tr className="bg-slate-50 border-b text-[13px] font-semibold text-[#0f172a]">
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[180px]">Tên mẫu</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[100px]">Hãng</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[120px]">Danh mục</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[100px]">Tổng số lượng</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[95px]">Sẵn sàng</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[95px]">Đang thuê</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[95px]">Bảo trì</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[100px]">Ngừng thuê</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[130px] bg-slate-100/50">Số bộ cho thuê</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[110px]">Trạng thái</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[120px]">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-705 text-xs">
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="px-6 py-10 text-center text-slate-400 italic">
                        Không có dữ liệu báo cáo phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredInventory.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50/40">
                        <td className="px-6 py-4 font-black text-slate-900">{item.productModel}</td>
                        <td className="px-6 py-4">{item.brand}</td>
                        <td className="px-6 py-4">{item.category}</td>
                        <td className="px-6 py-4 text-center text-slate-800 font-bold">{item.totalPhysicalAssets}</td>
                        <td className="px-6 py-4 text-center text-[#15803d] font-bold">{item.availableAssets}</td>
                        <td className="px-6 py-4 text-center text-[#1d4ed8]">{item.rentingAssets}</td>
                        <td className="px-6 py-4 text-center text-[#b45309]">{item.maintenanceAssets}</td>
                        <td className="px-6 py-4 text-center text-[#be123c]">{item.inactiveAssets}</td>
                        <td className="px-6 py-4 text-center text-slate-900 font-black bg-slate-100/30">{item.rentableCompleteKits}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`status-badge border ${
                            item.stockStatus === 'Đủ bộ cho thuê' || item.stockStatus === 'Đủ thiết bị'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : item.stockStatus === 'Thiếu thành phần đi kèm'
                              ? 'bg-amber-50 border-amber-300 text-amber-800'
                              : 'bg-rose-50 border-rose-300 text-rose-850'
                          }`}>
                            {item.stockStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="table-action-group justify-center">
                            <button
                              type="button"
                              onClick={() => setSelectedInventoryDetail(item)}
                              className="table-action-button text-[#00236f] bg-[#00236f]/5 hover:bg-[#00236f]/10 cursor-pointer"
                              id={`btn-view-inv-${index}`}
                            >
                              Xem chi tiết tồn kho
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
        </div>
      )}

      {/* --- TAB 2: BÁO CÁO THANH TOÁN --- */}
      {activeTab === 'payment' && (
        <div className="space-y-6" id="payment-report-tab">
          
          {/* Cards thống kê */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4" id="pay-stats-cards">
            
            <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-3xs" id="stat-received">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Tổng tiền cọc đã nhận</span>
              <p className="text-lg font-black text-[#15803d] mt-1.5">{formatVND(totalCocReceived)}</p>
              <div className="flex items-center gap-1.5 mt-2 bg-[#f0fdf4] border border-[#dcfce7] px-2 py-0.5 rounded text-[9.5px] font-bold text-[#15803d]">
                <span className="w-1.5 h-1.5 bg-[#15803d] rounded-full animate-pulse"></span>
                Từ khách hàng cọc cổng
              </div>
            </div>

            <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-3xs" id="stat-refunded">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Tổng tiền đã hoàn cọc</span>
              <p className="text-lg font-black text-[#1d4ed8] mt-1.5">{formatVND(totalCocRefunded)}</p>
              <div className="flex items-center gap-1.5 mt-2 bg-[#eff6ff] border border-[#dbeafe] px-2 py-0.5 rounded text-[9.5px] font-bold text-[#1d4ed8]">
                <span>✓</span>
                Giải phóng quỹ cọc hoàn trả
              </div>
            </div>

            <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-3xs" id="stat-deducted">
              <span className="text-[10px] text-red-500 font-black uppercase tracking-wider block">Tổng tiền đã khấu trừ cọc</span>
              <p className="text-lg font-black text-[#b91c1c] mt-1.5">{formatVND(totalCocDeducted)}</p>
              <div className="flex items-center gap-1.5 mt-2 bg-[#fef2f2] border border-[#fee2e2] px-2 py-0.5 rounded text-[9.5px] font-bold text-[#b91c1c]">
                <span>⚠</span>
                Khấu trừ thiết bị lỗi/mất
              </div>
            </div>

            <div className="bg-[#f8fafc] p-5 border border-slate-250 rounded-2xl" id="stat-success">
              <span className="text-[10px] text-slate-500 font-black uppercase block">GD VNPAY Sandbox Thành công</span>
              <p className="text-xl font-black text-[#0f172a] mt-1.5">{vnpaySuccessCount}</p>
              <span className="text-[9.5px] text-slate-400 font-medium block mt-2">Hồi đáp IPN tự động thành công</span>
            </div>

            <div className="bg-[#f8fafc] p-5 border border-slate-250 rounded-2xl" id="stat-failed">
              <span className="text-[10px] text-slate-500 font-black uppercase block">Số giao dịch thất bại</span>
              <p className="text-xl font-black text-[#0f172a] mt-1.5">0</p>
              <span className="text-[9.5px] text-slate-400 font-medium block mt-2">Không chứa lỗi phát sinh</span>
            </div>
          </div>

          {/* Bộ lọc thanh toán */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs" id="pay-filters">
            <div className="flex items-center gap-2 mb-4 text-[#00236f]">
              <Filter className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wide">Bộ lọc báo cáo thanh toán</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase mb-1.5">Mã đơn hàng</label>
                <input 
                  type="text" 
                  value={payOrderSearch}
                  onChange={(e) => setPayOrderSearch(e.target.value)}
                  placeholder="Nhập mã ORD..." 
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2 text-xs font-bold outline-none text-slate-700 placeholder:text-slate-400 focus:border-[#00236f]"
                  id="pay-filter-order-id"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase mb-1.5">Loại thanh toán</label>
                <select 
                  value={payType} 
                  onChange={(e) => setPayType(e.target.value)}
                  className="w-full bg-slate-50 border border-[#cbd5e1] rounded-xl px-3 py-2 text-xs font-bold outline-none text-slate-705"
                  id="pay-filter-type"
                >
                  <option value="Tất cả">Tất cả loại hình</option>
                  <option value="Cọc giữ chỗ">Cọc giữ chỗ</option>
                  <option value="Hoàn cọc">Hoàn cọc</option>
                  <option value="Khấu trừ cọc">Khấu trừ cọc</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase mb-1.5">Trạng thái thanh toán</label>
                <select 
                  value={payStatus} 
                  onChange={(e) => setPayStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-[#cbd5e1] rounded-xl px-3 py-2 text-xs font-bold outline-none text-slate-705"
                  id="pay-filter-status"
                >
                  <option value="Tất cả">Tất cả trạng thái</option>
                  <option value="Đã thanh toán">Đã thanh toán</option>
                  <option value="Đã hoàn cọc">Đã hoàn cọc</option>
                  <option value="Đã khấu trừ">Đã khấu trừ</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase mb-1.5">Từ ngày</label>
                <input 
                  type="date" 
                  value={payStartDate}
                  onChange={(e) => setPayStartDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-1.5 text-xs font-bold outline-none text-slate-707 font-mono"
                  id="pay-filter-start-date"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase mb-1.5">Đến ngày</label>
                <input 
                  type="date" 
                  value={payEndDate}
                  onChange={(e) => setPayEndDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-1.5 text-xs font-bold outline-none text-slate-707 font-mono"
                  id="pay-filter-end-date"
                />
              </div>
            </div>
          </div>

          {/* Bảng báo cáo thanh toán */}
          <div className="table-wrapper border border-slate-205 rounded-2xl overflow-hidden shadow-xs" id="pay-table-card">
            <div className="w-full">
              <table className="data-table">
                <thead>
                  <tr className="bg-slate-50 border-b text-[13px] font-semibold text-[#0f172a]">
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[110px]">Mã giao dịch</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[110px]">Mã đơn hàng</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[150px]">Khách hàng</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[130px]">Loại GD</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[150px]">Cổng thanh toán</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-right font-semibold min-w-[120px]">Số tiền</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[110px]">Trạng thái</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[130px]">Thời gian</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[240px]">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-705 text-xs">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-6 py-10 text-center text-slate-400 italic">
                        Không có dữ liệu báo cáo phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/40">
                        <td className="px-6 py-4 font-mono font-bold text-slate-900 cell-code">{p.paymentCode}</td>
                        <td className="px-6 py-4 font-mono text-[#00236f] font-black cell-code">{p.orderCode}</td>
                        <td className="px-6 py-4 text-slate-800 font-bold">{p.customerName}</td>
                        <td className="px-6 py-4">
                          <span className={`status-badge border ${
                            p.paymentType === 'Cọc giữ chỗ'
                              ? 'bg-emerald-50 border-emerald-150 text-emerald-807'
                              : p.paymentType === 'Hoàn cọc'
                              ? 'bg-blue-50 border-blue-150 text-blue-805'
                              : 'bg-rose-50 border-rose-150 text-rose-800'
                          }`}>
                            {p.paymentType}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-605">{p.paymentMethod}</td>
                        <td className="px-6 py-4 text-right font-black text-slate-900 cell-money">{formatVND(p.amount)}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`status-badge border ${
                            p.status === 'Đã thanh toán'
                              ? 'bg-emerald-50 border-emerald-250 text-emerald-708'
                              : p.status === 'Đã hoàn cọc'
                              ? 'bg-blue-50 border-blue-200 text-[#1d4ed8]'
                              : 'bg-rose-50 border-rose-200 text-[#b91c1c]'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-505 cell-date">{p.paidAt}</td>
                        <td className="px-6 py-4 text-slate-500 font-medium italic text-[11px] leading-relaxed max-w-[240px] truncate" title={p.note}>
                          {p.note}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: NHẬT KÝ THAO TÁC --- */}
      {activeTab === 'logs' && (
        <div className="space-y-6" id="logs-report-tab">
          
          {/* Bộ lọc nhật ký */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs" id="log-filters">
            <div className="flex items-center gap-2 mb-4 text-[#00236f]">
              <span className="text-xs font-bold text-[#00236f]">Bộ lọc kiểm toán nhật ký</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Người thực hiện</label>
                <input 
                  type="text" 
                  value={logActorSearch}
                  onChange={(e) => setLogActorSearch(e.target.value)}
                  placeholder="Họ tên nhân viên..." 
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2 text-xs font-bold outline-none text-slate-707 placeholder:text-slate-400 focus:border-[#00236f]"
                  id="log-filter-actor"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Vai trò tác động</label>
                <select 
                  value={logRoleSelected} 
                  onChange={(e) => setLogRoleSelected(e.target.value)}
                  className="w-full bg-slate-50 border border-[#cbd5e1] rounded-xl px-3 py-2 text-xs font-bold outline-none text-slate-705"
                  id="log-filter-role"
                >
                  <option value="Tất cả">Tất cả vai trò</option>
                  <option value="Nhân viên">Nhân viên</option>
                  <option value="Quản trị viên">Quản trị viên</option>
                  <option value="Hệ thống">Hệ thống</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Nhóm chức năng</label>
                <select 
                  value={logModuleSelected} 
                  onChange={(e) => setLogModuleSelected(e.target.value)}
                  className="w-full bg-slate-50 border border-[#cbd5e1] rounded-xl px-3 py-2 text-xs font-bold outline-none text-slate-705"
                  id="log-filter-module"
                >
                  <option value="Tất cả">Tất cả nhóm</option>
                  <option value="Quản lý tài khoản">Quản lý tài khoản</option>
                  <option value="Giỏ hàng / Đặt thuê">Giỏ hàng / Đặt thuê</option>
                  <option value="Quản lý đơn hàng">Quản lý đơn hàng</option>
                  <option value="Thanh lý hợp đồng">Thanh lý hợp đồng</option>
                  <option value="Quản lý mẫu thiết bị">Quản lý mẫu thiết bị</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Kết quả kiểm tra</label>
                <select 
                  value={logResultSelected} 
                  onChange={(e) => setLogResultSelected(e.target.value)}
                  className="w-full bg-slate-50 border border-[#cbd5e1] rounded-xl px-3 py-2 text-xs font-bold outline-none text-slate-705"
                  id="log-filter-result"
                >
                  <option value="Tất cả">Tất cả kết quả</option>
                  <option value="Thành công">Thành công</option>
                  <option value="Thất bại">Thất bại</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Loại thao tác</label>
                <select 
                  value={logActionSelected} 
                  onChange={(e) => setLogActionSelected(e.target.value)}
                  className="w-full bg-slate-50 border border-[#cbd5e1] rounded-xl px-3 py-2 text-xs font-bold outline-none text-slate-705"
                  id="log-filter-action"
                >
                  <option value="Tất cả">Tất cả hành động</option>
                  <option value="Duyệt hồ sơ xác minh">Duyệt hồ sơ xác minh</option>
                  <option value="Ghi nhận thanh toán cọc">Ghi nhận thanh toán cọc</option>
                  <option value="Lập phiếu bàn giao">Lập phiếu bàn giao</option>
                  <option value="Lập phiếu trả và kiểm kê">Lập phiếu trả và kiểm kê</option>
                  <option value="Cấu hình bộ đi kèm">Cấu hình bộ đi kèm</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Thao tác từ ngày</label>
                <input 
                  type="date" 
                  value={logStartDate}
                  onChange={(e) => setLogStartDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-1.5 text-xs font-bold outline-none text-slate-707 font-mono"
                  id="log-filter-start-date"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Thao tác đến ngày</label>
                <input 
                  type="date" 
                  value={logEndDate}
                  onChange={(e) => setLogEndDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-1.5 text-xs font-bold outline-none text-slate-707 font-mono"
                  id="log-filter-end-date"
                />
              </div>
            </div>
          </div>

          {/* Bảng nhật ký thao tác */}
          <div className="table-wrapper border border-slate-205 rounded-2xl overflow-hidden shadow-xs" id="log-table-card">
            <div className="w-full">
              <table className="data-table">
                <thead>
                  <tr className="bg-slate-50 border-b text-[13px] font-semibold text-[#0f172a]">
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[130px]">Thời gian</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[140px]">Tài khoản</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[100px]">Vai trò</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[140px]">Chức năng</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[135px]">Hành động</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[280px]">Nội dung thao tác</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[160px]">Đối tượng</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[105px]">Kết quả</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[100px]">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-705 text-xs">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-6 py-10 text-center text-slate-400 italic">
                        Chưa có nhật ký thao tác.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((l, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/40">
                        <td className="px-6 py-4 font-mono text-slate-505 whitespace-nowrap cell-date">{l.time}</td>
                        <td className="px-6 py-4 font-black text-slate-900 whitespace-nowrap">{l.user}</td>
                        <td className="px-6 py-4">
                          <span className={`status-badge border ${
                            l.role === 'Quản trị viên'
                              ? 'bg-rose-50 border-rose-150 text-rose-800'
                              : l.role === 'Nhân viên'
                              ? 'bg-blue-50 border-blue-150 text-blue-805'
                              : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}>
                            {l.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-800 font-bold whitespace-nowrap">{l.module}</td>
                        <td className="px-6 py-4 font-black text-[#00236f] whitespace-nowrap">{l.action}</td>
                        <td className="px-6 py-4 font-medium text-slate-500 truncate max-w-[280px]" title={l.description}>{l.description}</td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-700 text-[10.5px] cell-code">{l.relatedObject}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`status-badge border ${
                            l.result === 'Thành công'
                              ? 'bg-emerald-50 border-emerald-150 text-emerald-807'
                              : 'bg-rose-50 border-rose-150 text-rose-800'
                          }`}>
                            {l.result}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <div className="table-action-group justify-center">
                            <button
                              type="button"
                              onClick={() => setSelectedLogDetail(l)}
                              className="table-action-button border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                              id={`btn-view-log-${idx}`}
                            >
                              Xem chi tiết
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
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL overlay: XEM CHI TIẾT TỒN KHO */}
      {/* ========================================================= */}
      {selectedInventoryDetail && (
        <div className="fixed inset-0 bg-slate-900/60 z-[999] backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full flex flex-col max-h-[85vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-150 flex justify-between items-center bg-[#f8fafc]">
              <div>
                <h3 className="text-sm font-black text-[#00236f] uppercase tracking-wider">Chi tiết cân đối tồn kho &amp; Bộ đi kèm</h3>
                <p className="text-[11px] text-slate-400 font-bold mt-1">Cách tính toán bộ khả dụng và phân rã chi tiết thiết bị</p>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedInventoryDetail(null)}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition"
                id="close-inv-modal-btn"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              
              {/* A. Thông tin mẫu thiết bị */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] text-[#00236f] font-black uppercase block tracking-wide">A. Thông tin mẫu thiết bị</span>
                <div className="grid grid-cols-2 gap-4 pt-1 font-semibold">
                  <p className="text-slate-500">Tên mẫu thiết bị: <strong className="text-slate-900">{selectedInventoryDetail.productModel}</strong></p>
                  <p className="text-slate-500">Hãng sản xuất: <strong className="text-slate-900">{selectedInventoryDetail.brand}</strong></p>
                  <p className="text-slate-500">Danh mục thiết bị: <strong className="text-slate-900">{selectedInventoryDetail.category}</strong></p>
                  <p className="text-slate-500">Trạng thái cấu hình mẫu: 
                    <span className="ml-1.5 inline-flex px-2 py-0.5 text-[9.5px] bg-emerald-50 border border-emerald-300 text-emerald-800 font-black rounded-md">
                      {selectedInventoryDetail.statusModel}
                    </span>
                  </p>
                </div>
              </div>

              {/* B. Tổng hợp thiết bị chính */}
              <div className="border border-slate-200 p-4 rounded-xl space-y-3">
                <span className="text-[10px] text-[#00236f] font-black uppercase block tracking-wide">B. Tổng hợp thiết bị chính</span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 text-center">
                  <div className="bg-slate-50 p-2.5 rounded-lg border">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">Tổng vật lý</span>
                    <strong className="text-base text-slate-900 font-black block mt-0.5">{selectedInventoryDetail.totalPhysicalAssets}</strong>
                  </div>
                  <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                    <span className="text-[9px] text-emerald-600 font-bold block uppercase">Sẵn sàng</span>
                    <strong className="text-base text-[#15803d] font-black block mt-0.5">{selectedInventoryDetail.availableAssets}</strong>
                  </div>
                  <div className="bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                    <span className="text-[9px] text-blue-600 font-bold block uppercase">Đang thuê</span>
                    <strong className="text-base text-[#1d4ed8] font-black block mt-0.5">{selectedInventoryDetail.rentingAssets}</strong>
                  </div>
                  <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                    <span className="text-[9px] text-amber-600 font-bold block uppercase">Bảo trì</span>
                    <strong className="text-base text-[#b45309] font-black block mt-0.5">{selectedInventoryDetail.maintenanceAssets}</strong>
                  </div>
                  <div className="bg-rose-50/50 p-2.5 rounded-lg border border-rose-100">
                    <span className="text-[9px] text-rose-600 font-bold block uppercase">Ngừng thuê</span>
                    <strong className="text-base text-[#be123c] font-black block mt-0.5">{selectedInventoryDetail.inactiveAssets}</strong>
                  </div>
                  <div className="bg-[#f1f5f9] p-2.5 rounded-lg border border-slate-300">
                    <span className="text-[9px] text-slate-500 font-bold block uppercase">Mất</span>
                    <strong className="text-base text-slate-700 font-black block mt-0.5">0</strong>
                  </div>
                </div>
              </div>

              {/* C. Cấu hình bộ đi kèm */}
              <div className="space-y-2">
                <span className="text-[10px] text-[#00236f] font-black uppercase block tracking-wide">C. Cấu hình bộ linh kiện đi kèm</span>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b text-[12px] font-semibold text-[#0f172a]">
                        <th className="px-4 py-2.5 whitespace-nowrap min-w-[150px]">Linh kiện đi kèm</th>
                        <th className="px-4 py-2.5 whitespace-nowrap min-w-[150px]">Phân loại quản lý</th>
                        <th className="px-4 py-2.5 whitespace-nowrap text-center min-w-[100px]">Yêu cầu/bộ</th>
                        <th className="px-4 py-2.5 whitespace-nowrap text-center min-w-[100px]">Sẵn có</th>
                        <th className="px-4 py-2.5 whitespace-nowrap text-center min-w-[100px]">Bộ đáp ứng</th>
                        <th className="px-4 py-2.5 whitespace-nowrap text-center min-w-[100px]">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y font-semibold text-slate-600">
                      {selectedInventoryDetail.includedItems.map((item, itemIdx) => (
                        <tr key={itemIdx} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-bold text-slate-900">{item.itemName}</td>
                          <td className="px-4 py-3 text-[11px] text-slate-500">{item.managementType}</td>
                          <td className="px-4 py-3 text-center text-slate-800">{item.requiredQuantityPerKit}</td>
                          <td className="px-4 py-3 text-center text-slate-900 font-bold">{item.availableQuantity}</td>
                          <td className="px-4 py-3 text-center font-black text-slate-900 bg-slate-50/30">{item.supportedKits}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[9.5px] font-bold border uppercase ${
                              item.status === 'Đủ'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-250'
                                : 'bg-amber-50 text-amber-800 border-amber-250'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* D. Kết quả tính số bộ có thể cho thuê */}
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-[#166534] font-black uppercase block tracking-wide">D. Kết quả tính số bộ có thể cho thuê</span>
                <div className="space-y-1.5 font-bold text-slate-700">
                  <p>Số thiết bị chính sẵn sàng: <span className="text-slate-900 font-mono text-xs">{selectedInventoryDetail.availableAssets}</span></p>
                  <p>Số bộ đáp ứng tối đa theo thiết bị định danh: <span className="text-slate-950 font-black">{selectedInventoryDetail.availableAssets}</span></p>
                  <p>Số bộ đáp ứng tối đa theo phụ kiện số lượng: <span className="text-slate-905">{selectedInventoryDetail.rentableCompleteKits}</span></p>
                  <p className="border-t border-dashed border-[#bbf7d0] pt-2 text-[#166534]">
                    Thành phần giới hạn cổ chai: <span className="text-[#b91c1c] font-black">{selectedInventoryDetail.limitingComponent}</span>
                  </p>
                  <p className="text-[#166534]">
                    Số bộ có thể cho thuê cuối cùng: <span className="text-base text-emerald-850 font-black tracking-wide font-mono">{selectedInventoryDetail.rentableCompleteKits} bộ</span>
                  </p>
                  <p className="text-[11px] text-slate-600 font-semibold italic mt-1 bg-white/70 p-2.5 rounded-lg border border-emerald-200">
                    💡 {selectedInventoryDetail.message}
                  </p>
                </div>
              </div>

              {/* E. Cảnh báo tồn kho */}
              <div className={`p-4 rounded-xl border ${
                selectedInventoryDetail.stockStatus === 'Đủ bộ cho thuê' || selectedInventoryDetail.stockStatus === 'Đủ thiết bị'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-250 text-rose-800'
              }`}>
                <span className="text-[10px] font-black uppercase block tracking-wide mb-1">E. Cảnh báo đối soát tồn kho</span>
                <p className="font-bold leading-relaxed">{selectedInventoryDetail.warning}</p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-end gap-2.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setSelectedInventoryDetail(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition text-xs shadow-xs cursor-pointer"
                id="close-inv-modal-footer-btn"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL overlay: XEM CHI TIẾT NHẬT KÝ THAO TÁC */}
      {/* ========================================================= */}
      {selectedLogDetail && (
        <div className="fixed inset-0 bg-slate-900/60 z-[999] backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-150 bg-[#f8fafc] flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-[#00236f] uppercase tracking-wider">Chi tiết nhật ký kiểm toán hệ thống</h3>
                <span className="text-[9.5px] font-mono text-slate-400 font-black block mt-0.5">MS: {selectedLogDetail.id}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedLogDetail(null)}
                className="p-1.5 hover:bg-slate-205 rounded-lg text-slate-400 hover:text-slate-700 transition"
                id="close-log-modal-btn"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs font-semibold text-slate-705">
              
              <div className="grid grid-cols-2 gap-3.5 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[9.5px] text-slate-400 font-black uppercase tracking-wider block">Thời gian thực tế</span>
                  <p className="text-slate-900 font-mono mt-0.5">{selectedLogDetail.time}</p>
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-400 font-black uppercase tracking-wider block">Người thực hiện</span>
                  <p className="text-slate-900 font-bold mt-0.5">{selectedLogDetail.user}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[9.5px] text-slate-400 font-black uppercase tracking-wider block">Vai trò</span>
                  <span className="inline-flex mt-1 px-2.5 py-0.5 rounded text-[9.5px] font-black uppercase bg-slate-100 border border-slate-300 text-slate-700">
                    {selectedLogDetail.role}
                  </span>
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-400 font-black uppercase tracking-wider block">Nhóm chức năng</span>
                  <p className="text-[#00236f] font-black mt-0.5">{selectedLogDetail.module}</p>
                </div>
              </div>

              <div className="border-b border-slate-100 pb-4">
                <span className="text-[9.5px] text-slate-400 font-black uppercase tracking-wider block">Loại thao tác</span>
                <p className="text-slate-900 font-bold mt-0.5">{selectedLogDetail.action}</p>
              </div>

              <div className="border-b border-slate-100 pb-4">
                <span className="text-[9.5px] text-slate-400 font-black uppercase tracking-wider block">Hành động và nội dung tác nhân</span>
                <p className="text-slate-800 font-medium leading-relaxed mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                  {selectedLogDetail.description}
                </p>
              </div>

              <div className="border-b border-slate-100 pb-4">
                <span className="text-[9.5px] text-slate-400 font-black uppercase tracking-wider block">Đối tượng liên quan</span>
                <p className="text-slate-900 font-mono font-bold mt-0.5 bg-[#edf2f7] px-2.5 py-1 rounded inline-block text-[10.5px]">
                  {selectedLogDetail.relatedObject}
                </p>
              </div>

              <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                <div>
                  <span className="text-[9.5px] text-slate-400 font-black uppercase tracking-wider block">Kết quả</span>
                  <span className="inline-flex mt-1 px-2 py-0.5 rounded text-[9.5px] font-black bg-[#ecfdf5] border-[#a7f3d0] text-[#047857] border uppercase">
                    {selectedLogDetail.result}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[9.5px] text-slate-400 font-black uppercase tracking-wider block">Ghi chú vận hành giải trình</span>
                <p className="text-slate-500 font-medium leading-relaxed italic mt-1">
                  &ldquo;{selectedLogDetail.note}&rdquo;
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-150 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLogDetail(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition text-xs shadow-xs cursor-pointer"
                id="close-log-modal-footer-btn"
              >
                Đóng nhật ký
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
