import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  User, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle, 
  UploadCloud, 
  X, 
  Printer, 
  ShieldAlert, 
  HelpCircle, 
  BatteryCharging, 
  Database, 
  Briefcase,
  CheckCircle2,
  Trash2,
  Lock,
  ArrowLeftRight,
  ClipboardCheck,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { EQUIPMENTS } from '../../data';

const MOCK_HANDOVER_ORDERS = [
  {
    id: '#ORD-5001',
    customerName: 'Nguyễn Văn B',
    customerPhone: '0901 234 567',
    customerClass: 'Gold Member',
    startDate: '15/10/2026 09:00',
    endDate: '18/10/2026 18:00',
    totalPrice: '4.500.000đ',
    equipmentName: 'Body Sony A7IV & Lens 24-70mm GM II',
    equipmentSN: 'SN-A74-99201',
    image: EQUIPMENTS[0].image,
    items: [
      { name: 'Body Sony Alpha A7 IV', sn: 'SN-A74-99201', location: 'Kệ 02', status: 'Hoàn hảo' },
      { name: 'Lens Sony FE 24-70mm f/2.8 GM II', sn: 'SN-L2470-8812', location: 'Kệ 02', status: 'Hoàn hảo' }
    ],
    accessories: [
      { name: 'Pin NP-FZ100', qty: 'x2', icon: BatteryCharging },
      { name: 'Thẻ nhớ Extreme SD 128GB', qty: 'x1', icon: Database },
      { name: 'Túi đựng Peak Design', qty: 'x1', icon: Briefcase }
    ],
    avatarBg: 'bg-indigo-100 text-indigo-800',
    status: 'Chờ bàn giao'
  },
  {
    id: '#ORD-5002',
    customerName: 'Trần Thị C',
    customerPhone: '0987 654 321',
    customerClass: 'Silver Member',
    startDate: '16/10/2026 10:00',
    endDate: '19/10/2026 17:00',
    totalPrice: '1.200.000đ',
    equipmentName: 'Saramonic Blink 500 B2',
    equipmentSN: 'SN-SARAB5-3012',
    image: EQUIPMENTS[2]?.image || EQUIPMENTS[0].image,
    items: [
      { name: 'Saramonic Blink 500 B2 (TX+TX+RX)', sn: 'SN-SARAB5-3012', location: 'Kệ 05', status: 'Hoàn hảo' }
    ],
    accessories: [
      { name: 'Hộp sạc Blink 500', qty: 'x1', icon: BatteryCharging },
      { name: 'Cáp âm thanh 3.5mm TRS', qty: 'x1', icon: Database }
    ],
    avatarBg: 'bg-pink-100 text-pink-800',
    status: 'Chờ bàn giao'
  },
  {
    id: '#ORD-5003',
    customerName: 'Phạm Hoàng Linh',
    customerPhone: '0912 345 678',
    customerClass: 'Platinum Member',
    startDate: '10/10/2026 08:30',
    endDate: '13/10/2026 18:00',
    totalPrice: '3.100.000đ',
    equipmentName: 'DJI Ronin RSC 2 Gimbal',
    equipmentSN: 'SN-RSC2-55610',
    image: EQUIPMENTS[1]?.image || EQUIPMENTS[0].image,
    items: [
      { name: 'DJI Ronin RSC 2 Gimbal', sn: 'SN-RSC2-55610', location: 'Kệ 01', status: 'Hoàn hảo' }
    ],
    accessories: [
      { name: 'Tay nắm phụ Briefcase Grip', qty: 'x1', icon: Briefcase },
      { name: 'Cáp điều khiển USB-C', qty: 'x2', icon: Database }
    ],
    avatarBg: 'bg-teal-100 text-teal-800',
    status: 'Đang thuê'
  },
  {
    id: '#ORD-5004',
    customerName: 'Vũ Minh Tuấn',
    customerPhone: '0945 999 888',
    customerClass: 'Gold Member',
    startDate: '14/10/2026 14:00',
    endDate: '17/10/2026 14:00',
    totalPrice: '2.400.000đ',
    equipmentName: 'Body Canon EOS R6 Mark II',
    equipmentSN: 'SN-CANR62-8871',
    image: EQUIPMENTS[0].image,
    items: [
      { name: 'Canon EOS R6 Mark II', sn: 'SN-CANR62-8871', location: 'Kệ 04', status: 'Hoàn hảo' }
    ],
    accessories: [
      { name: 'Pin LP-E6NH', qty: 'x1', icon: BatteryCharging },
      { name: 'Sạc pin LC-E6', qty: 'x1', icon: BatteryCharging }
    ],
    avatarBg: 'bg-emerald-100 text-emerald-800',
    status: 'Đang thuê'
  }
];

export default function HandoverInventory() {
  const [activeTab, setActivePageTab] = useState('handover'); // handover, return
  const [selectedHandoverOrder, setSelectedHandoverOrder] = useState(null);
  
  // Handover state checkmarks
  const [checkedItems, setCheckedItems] = useState({});
  const [paperContractWarningResolved, setPaperContractWarningResolved] = useState(false);
  const [paymentWarningResolved, setPaymentWarningResolved] = useState(false);
  const [handoverNotes, setHandoverNotes] = useState('');
  const [handoverImages, setHandoverImages] = useState([]);

  // Modal triggers
  const [showInvoicePrintModal, setShowInvoicePrintModal] = useState(false);
  const [showHandoverConfirmModal, setShowHandoverConfirmModal] = useState(false);
  const [showReturnConfirmModal, setShowReturnConfirmModal] = useState(false);

  // Return & audit state
  const [mainAssetState, setMainAssetState] = useState('correct'); // correct, wrong, missing, damaged
  const [accessory1State, setAccessory1State] = useState('enough'); // enough, missing, lost, damaged
  const [accessory2State, setAccessory2State] = useState('lost'); // enough, missing, lost, damaged
  const [returnNotes, setReturnNotes] = useState('');
  const [returnImages, setReturnImages] = useState([
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150'
  ]);

  const handleToggleItemCheck = (sn) => {
    setCheckedItems(prev => ({
      ...prev,
      [sn]: !prev[sn]
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropHandoverImage = (e) => {
    e.preventDefault();
    setHandoverImages([...handoverImages, 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=150']);
  };

  const handleNewUploadClick = () => {
    setHandoverImages([...handoverImages, 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=150']);
  };

  const handleDropReturnImage = (e) => {
    e.preventDefault();
    setReturnImages([...returnImages, 'https://images.unsplash.com/photo-1620510629702-92149b10003e?w=150']);
  };

  const isAllItemsChecked = selectedHandoverOrder ? selectedHandoverOrder.items.every(item => checkedItems[item.sn]) : false;
  const isHandoverReady = isAllItemsChecked && paperContractWarningResolved && paymentWarningResolved;

  const handleConfirmHandoverSubmit = () => {
    setShowHandoverConfirmModal(false);
    if (selectedHandoverOrder) {
      alert(`Bàn giao đơn hàng ${selectedHandoverOrder.id} thành công! Trạng thái đơn được chuyển sang 'Đang thuê'.`);
      setSelectedHandoverOrder(null);
    }
  };

  const handleConfirmReturnSubmit = () => {
    setShowReturnConfirmModal(false);
    if (selectedHandoverOrder) {
      alert(`Xác nhận hoàn tất thủ tục bàn giao kiểm kê đối chiếu tài sản cho đơn hàng ${selectedHandoverOrder.id} thành công!`);
      setSelectedHandoverOrder(null);
    }
  };

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* Toast Confirmation modals */}
      {showInvoicePrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4.5 bg-blue-900 text-white flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-sm font-black font-serif text-white">Xem trước phiếu bàn giao {selectedHandoverOrder.id}</h3>
                <p className="text-[10px] text-blue-200 mt-0.5">Vui lòng rà soát lại kỹ thông số kỹ vĩ trước khi in phiếu giao vật lý.</p>
              </div>
              <button onClick={() => setShowInvoicePrintModal(false)} className="text-blue-100 hover:text-white">??ng
                
              </button>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto shrink text-xs text-slate-700 leading-normal">
              
              {/* Receipt metadata grid */}
              <div className="grid grid-cols-2 gap-6 border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Thông tin đơn cọc</h4>
                  <p className="flex justify-between"><span>Mã đơn:</span> <strong className="text-slate-800">{selectedHandoverOrder.id}</strong></p>
                  <p className="flex justify-between"><span>Khách hàng:</span> <strong className="text-slate-800">{selectedHandoverOrder.customerName}</strong></p>
                  <p className="flex justify-between"><span>Số điện thoại:</span> <strong className="text-slate-800 font-mono">{selectedHandoverOrder.customerPhone}</strong></p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Thời gian giao ước</h4>
                  <p className="flex justify-between"><span>Giao máy:</span> <strong className="text-slate-800">{selectedHandoverOrder.startDate}</strong></p>
                  <p className="flex justify-between"><span>Trả máy:</span> <strong className="text-slate-800">{selectedHandoverOrder.endDate}</strong></p>
                  <p className="flex justify-between"><span>Tổng cộng:</span> <strong className="text-slate-800">3 ngày</strong></p>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Danh mục tài sản thực tế bàn giao</h4>
                <div className="border border-slate-200 rounded-lg overflow-x-auto w-full">
                  <table className="w-full min-w-[550px] text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Thiết bị</th>
                        <th className="px-4 py-2 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Mã Sê-ri</th>
                        <th className="px-4 py-2 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Tình trạng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedHandoverOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-semibold text-slate-800">{item.name}</td>
                          <td className="px-4 py-3 font-mono font-medium text-slate-600">{item.sn}</td>
                          <td className="px-4 py-3 text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {item.status} (Mới 98%)
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Legal Notice */}
              <div className="bg-blue-50/50 p-4 border-l-4 border-blue-900 rounded text-slate-600 text-[11px] leading-relaxed">
                <h5 className="font-bold text-[#00236f] flex items-center gap-1.5 mb-1.5 uppercase text-[10px] tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#00236f]" />
                  Điều khoản liên đới ràng buộc bàn giao
                </h5>
                <p>Khách hàng ký tên xác nhận ở trên đồng nghĩa với việc đã trực tiếp kích hoạt kiểm thử tính năng của các trang thiết bị đạt chuẩn đầy đủ hoàn hảo. Mọi tổn hao hoặc hư hỏng phát sinh sau khi nhận máy cọc sẽ được đối chiếu bồi thường theo đúng mẫu cam kết hợp đồng dịch vụ vật lý #CTR-1002.</p>
              </div>

            </div>

            <div className="px-6 py-4.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <button 
                type="button" 
                onClick={() => setShowInvoicePrintModal(false)}
                className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-650 hover:bg-slate-100 transition"
              >
                Hủy quay lại
              </button>
              <button 
                type="button" 
                onClick={() => {
                  alert('Đang kết nối hệ thống máy in nhiệt tại cửa hàng...');
                  setShowInvoicePrintModal(false);
                }}
                className="px-6 py-2.5 bg-blue-900 hover:bg-blue-950 border-none text-white text-xs font-black rounded-xl transition shadow-sm flex items-center gap-2"
              >
                
                Xác nhận in &amp; Ký lập
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Handover Confirm dialog screen 32 */}
      {showHandoverConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-5 border border-emerald-150 shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-base font-black font-serif text-slate-800 mb-2">Xác nhận bàn giao thiết bị?</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Bạn có chắc chắn đồng ý hoàn tất kiểm chứng và khởi động bàn giao cho đơn hàng <strong className="text-blue-900 font-mono">{selectedHandoverOrder.id}</strong>? Trạng thái thuê máy sẽ chuyển dứt điểm sang <strong className="text-blue-800">"Đang thuê"</strong>.
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowHandoverConfirmModal(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleConfirmHandoverSubmit}
                className="flex-1 py-2.5 bg-blue-900 hover:bg-blue-950 border-none text-white text-xs font-black rounded-lg transition"
              >
                Giao máy ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Verify Modal Screen 30 */}
      {showReturnConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-8 flex flex-col items-center text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-[#fea619]/10 text-amber-700 rounded-full flex items-center justify-center mb-5 border border-amber-150">
              <ClipboardCheck className="w-9 h-9" />
            </div>
            <h3 className="text-base font-black font-serif text-slate-800 mb-2">Hoàn tất quy trình kiểm kê?</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Hệ thống sẽ đối chiếu toàn bộ tình trạng máy và phụ kiện đi kèm để chuyển trả thiết bị cho đơn <strong className="text-blue-900 font-mono">{selectedHandoverOrder.id}</strong> sang trạng thái hoàn thành an toàn.
            </p>
            
            {/* Penalty fine alert box if something missing */}
            {(mainAssetState !== 'correct' || accessory1State !== 'enough' || accessory2State !== 'enough') && (
              <div className="bg-red-50 text-red-700 text-[10px] p-2.5 rounded border border-red-150 w-full mb-6 text-left leading-normal space-y-1">
                <span className="font-bold block text-red-800">Cơ chế phát sinh ghi nhận phí đền bù:</span>
                {mainAssetState !== 'correct' && <li>Tài sản chính đổi khác hoặc hư hại</li>}
                {accessory1State !== 'enough' && <li>NP-FZ100 battery bị hao hụt/đổi khác</li>}
                {accessory2State !== 'enough' && <li>SD card hoặc hộp sạc bị mất mát</li>}
              </div>
            )}
            
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowReturnConfirmModal(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Trở lại kiểm tra
              </button>
              <button 
                onClick={handleConfirmReturnSubmit}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 border-none text-white text-xs font-black rounded-lg transition"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#00236f]">Bàn giao và kiểm kê thiết bị</h2>
        <p className="text-sm text-slate-500 mt-1">Xác lập an toàn chứng từ bàn giao, đối chiếu vật lý đầy đủ vật phẩm trước và sau cho thuê.</p>
      </div>

      {/* Tabs list navigation system */}
      <div className="flex border-b border-slate-200 gap-8 text-xs font-bold leading-none select-none">
        <button 
          onClick={() => {
            setActivePageTab('handover');
            setSelectedHandoverOrder(null);
          }}
          className={`pb-3.5 border-b-2 px-1 transition-all ${
            activeTab === 'handover' 
              ? 'border-blue-900 text-blue-900 font-black' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          1. Bàn giao thiết bị
        </button>
        <button 
          onClick={() => {
            setActivePageTab('return');
            setSelectedHandoverOrder(null);
          }}
          className={`pb-3.5 border-b-2 px-1 transition-all ${
            activeTab === 'return' 
              ? 'border-blue-900 text-blue-900 font-black' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          2. Hoàn trả và kiểm kê
        </button>
      </div>

      {selectedHandoverOrder === null ? (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm animate-fade-in text-xs">
          <div className="p-5 border-b border-slate-150 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {activeTab === 'handover' ? 'Danh sách đơn chờ bàn giao máy' : 'Danh sách đơn đang thuê chờ nhận máy & kiểm kê'}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                {activeTab === 'handover' 
                  ? 'Vui lòng kiểm duyệt hồ sơ cọc, cho khách kiểm máy trực tiếp và tích lập phiếu bàn giao.' 
                  : 'Ghi nhận đối chiếu hiện trạng thiết bị, phụ kiện thu hồi từ khách hàng và khấu trừ cọc khi có phát sinh.'}
              </p>
            </div>
            
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Tìm mã đơn, tên khách..."
                className="w-full text-xs pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-250 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="px-6 py-4 whitespace-nowrap">Mã đơn</th>
                  <th className="px-6 py-4 min-w-[150px]">Khách hàng</th>
                  <th className="px-6 py-4 whitespace-nowrap">Thiết bị</th>
                  <th className="px-6 py-4 whitespace-nowrap">Hạn thuê</th>
                  <th className="px-6 py-4 whitespace-nowrap">Tổng đền cọc</th>
                  <th className="px-6 py-4 text-center whitespace-nowrap">Trạng thái</th>
                  <th className="px-6 py-4 text-right whitespace-nowrap">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 font-medium text-slate-600">
                {MOCK_HANDOVER_ORDERS.filter(o => activeTab === 'handover' ? o.status === 'Chờ bàn giao' : o.status === 'Đang thuê').map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5 font-mono text-xs font-bold text-[#00236f] whitespace-nowrap">{o.id}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${o.avatarBg}`}>
                          {o.customerName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-xs leading-none">{o.customerName}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{o.customerPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={o.image} 
                          alt={o.equipmentName} 
                          className="w-8 h-8 rounded border object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="whitespace-nowrap">
                          <p className="font-bold text-slate-800 text-xs leading-tight">{o.equipmentName}</p>
                          <p className="text-[9px] font-mono text-[#00236f] bg-blue-50/70 inline-block px-1.5 py-0.5 rounded mt-0.5">{o.equipmentSN}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-slate-500 font-semibold text-[11px]">
                      <div className="text-[11px] text-slate-600 space-y-0.5 leading-tight">
                        <p><span className="text-slate-400">Từ:</span> {o.startDate}</p>
                        <p><span className="text-slate-400">Đến:</span> {o.endDate}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap font-bold text-slate-900">{o.totalPrice}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2.5 py-0.5 border rounded-full text-[10px] font-bold ${
                        activeTab === 'handover' 
                          ? 'bg-amber-50 text-amber-750 border-amber-200 animate-pulse' 
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {activeTab === 'handover' ? 'Chờ nhận máy' : 'Đang thuê'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      <button 
                        onClick={() => {
                          setSelectedHandoverOrder(o);
                          if (activeTab === 'return') {
                            setMainAssetState('correct');
                            setAccessory1State('enough');
                            setAccessory2State('enough');
                            setReturnNotes('');
                          }
                        }}
                        className={`px-4 py-2 border rounded-lg text-[11px] font-bold transition-all shadow-xs active:scale-95 cursor-pointer ${
                          activeTab === 'handover' 
                            ? 'border-blue-900 hover:bg-blue-900 hover:text-white text-blue-900' 
                            : 'border-emerald-600 hover:bg-emerald-600 hover:text-white text-emerald-600'
                        }`}
                      >
                        {activeTab === 'handover' ? 'Bàn giao ngay →' : 'Kiểm kê trả máy →'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-55 p-4.5 rounded-xl border border-slate-200 shadow-xs mb-2 animate-fade-in text-xs">
            <button 
              onClick={() => setSelectedHandoverOrder(null)}
              className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold hover:text-blue-950 rounded-lg transition shadow-xs flex items-center gap-1.5 text-xs inline-flex cursor-pointer"
            >
              
              <span>← Quay lại danh sách đơn ({activeTab === 'handover' ? 'Chờ bàn giao máy' : 'Đang cho thuê'})</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">Đang xử lý hồ sơ:</span>
              <strong className="text-xs text-blue-900 bg-blue-100 border border-blue-200 px-3 py-1 rounded-lg font-mono tracking-wider">{selectedHandoverOrder.id}</strong>
            </div>
          </div>

          {activeTab === 'handover' ? (
        // HANDOVER FLOW
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in text-xs">
          
          {/* Handover Details left card columns */}
          <div className="lg:col-span-4 space-y-5">
            {/* Block 1: Order Information */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold font-serif text-slate-800">
                Thông tin đơn thuê
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Mã đơn hàng</span>
                  <strong className="text-blue-900 font-mono">{selectedHandoverOrder.id}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Ngày bắt đầu</span>
                  <span className="font-semibold text-slate-800">{selectedHandoverOrder.startDate}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Ngày kết thúc</span>
                  <span className="font-semibold text-slate-800">{selectedHandoverOrder.endDate}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Tổng đền cọc</span>
                  <strong className="text-[#00236f] text-sm">{selectedHandoverOrder.totalPrice}</strong>
                </div>
              </div>
            </div>

            {/* Block 2: Customer info */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold font-serif text-slate-800">
                Thông tin khách hàng cọc
              </div>
              <div className="p-5 flex gap-4">
                <div className={`w-11 h-11 rounded-full ${selectedHandoverOrder.avatarBg} flex items-center justify-center font-black text-xs shrink-0 shadow-inner`}>
                  NB
                </div>
                <div className="space-y-2 flex-grow">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{selectedHandoverOrder.customerName}</h4>
                    <p className="text-[10px] text-amber-800 uppercase font-black tracking-wider leading-none mt-1">Hạng: {selectedHandoverOrder.customerClass}</p>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-500 font-medium">
                    <p className="flex items-center gap-1.5">
                      <span>SDT:</span>
                      <strong className="text-slate-700 font-mono">{selectedHandoverOrder.customerPhone}</strong>
                    </p>
                    <p className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      CCCD cọc đã dán khớp
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Block 3: Verification Checkboxes gating actions */}
            <div className="space-y-3">
              <label 
                className={`p-4 rounded-xl border flex gap-3 cursor-pointer transition select-none ${
                  paperContractWarningResolved 
                    ? 'bg-emerald-50/50 border-emerald-250 text-emerald-800' 
                    : 'bg-amber-50/50 border-amber-200 text-amber-800'
                }`}
              >
                <input 
                  type="checkbox"
                  checked={paperContractWarningResolved}
                  onChange={(e) => setPaperContractWarningResolved(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#00236f] focus:ring-[#00236f]/20 border-slate-300"
                />
                <div className="leading-snug">
                  <strong className="block text-[11px] uppercase tracking-wider font-extrabold mb-0.5">Xác nhận cập nhật Hợp Đồng Giấy</strong>
                  <p className="text-[10px] opacity-90 font-medium">Đối tác đã đọc hợp đồng, ký kết mực lăn tay và hồ sơ biên nhận cọc đã đầy đủ.</p>
                </div>
              </label>

              <label 
                className={`p-4 rounded-xl border flex gap-3 cursor-pointer transition select-none ${
                  paymentWarningResolved 
                    ? 'bg-emerald-50/50 border-emerald-250 text-emerald-800' 
                    : 'bg-red-50/50 border-red-200 text-red-800'
                }`}
              >
                <input 
                  type="checkbox"
                  checked={paymentWarningResolved}
                  onChange={(e) => setPaymentWarningResolved(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#00236f] focus:ring-[#00236f]/20 border-slate-300"
                />
                <div className="leading-snug">
                  <strong className="block text-[11px] uppercase tracking-wider font-extrabold mb-0.5">Xác nhận thanh toán giữ máy</strong>
                  <p className="text-[10px] opacity-90 font-medium">Khách hàng hoàn tất thanh toán tiền thuê khi nhận máy (Duyệt thu cọc).</p>
                </div>
              </label>
            </div>

          </div>

          {/* Handover asset audit column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Asset checklist list */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-black font-serif text-slate-800 mb-4 block">1. Kiểm chứng tài sản thực tế bàn giao</h3>
              
              <div className="border border-slate-100 rounded-lg overflow-x-auto w-full mb-2">
                <table className="w-full min-w-[700px] text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3 min-w-[150px]">Tên thiết bị</th>
                      <th className="px-4 py-3 whitespace-nowrap">Mã Serial</th>
                      <th className="px-4 py-3 whitespace-nowrap">Vị trí kho</th>
                      <th className="px-4 py-3 whitespace-nowrap">Tình trạng</th>
                      <th className="px-4 py-3 text-right whitespace-nowrap">Xác nhận khớp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                    {selectedHandoverOrder.items.map((item, idx) => {
                      const isChecked = !!checkedItems[item.sn];
                      return (
                        <tr 
                          key={idx} 
                          onClick={() => handleToggleItemCheck(item.sn)}
                          className={`hover:bg-slate-50/50 transition cursor-pointer ${
                            isChecked ? 'bg-emerald-50/30' : ''
                          }`}
                        >
                          <td className="px-4 py-4 font-bold text-slate-800">{item.name}</td>
                          <td className="px-4 py-4 font-mono font-bold text-[#00236f] whitespace-nowrap">{item.sn}</td>
                          <td className="px-4 py-4 text-[11px] whitespace-nowrap">{item.location}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 whitespace-nowrap">
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500/20 border-slate-300"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-slate-400 italic font-medium">* Click vào từng dòng để tích xác nhận tình trạng vật phẩm nguyên vẹn đạt yêu cầu.</p>
            </section>

            {/* Accessories accompanying card bento rows */}
            <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-black font-serif text-slate-800 mb-4 block">2. Đính kèm phụ kiện đi kèm theo hộp</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedHandoverOrder.accessories.map((acc, idx) => {
                  const Icon = acc.icon;
                  return (
                    <div key={idx} className="bg-slate-55 border border-slate-150 p-3 rounded-lg flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-blue-900 shrink-0" />
                        <span className="font-bold text-slate-700">{acc.name}</span>
                      </div>
                      <strong className="text-[#00236f] font-mono text-sm">{acc.qty}</strong>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Note & image zones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-[11px] font-extrabold uppercase text-[#00236f] mb-3 block">Ghi chú bàn giao</h3>
                <textarea 
                  rows="3.5"
                  value={handoverNotes}
                  onChange={(e) => setHandoverNotes(e.target.value)}
                  placeholder="Ghi nhận vết hao mòn cũ hoặc lưu ý cọc giữ chỗ..."
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500/50 outline-none resize-none placeholder:text-slate-400 font-medium"
                />
              </section>

              <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-[11px] font-extrabold uppercase text-[#00236f] mb-3 block">Ảnh chứng thực mòn máy</h3>
                
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDropHandoverImage}
                  onClick={handleNewUploadClick}
                  className="border-2 border-dashed border-slate-200 hover:bg-slate-50 rounded-lg h-28 flex flex-col items-center justify-center text-center cursor-pointer transition select-none group"
                >
                  <UploadCloud className="w-6 h-6 text-slate-300 group-hover:text-blue-900 transition-colors" />
                  <span className="font-bold text-slate-650 mt-1 block">Kéo kéo thả hoặc nhấp để tệp lên</span>
                  <span className="text-[9px] text-slate-400">Hỗ trợ ảnh JPG/PNG tối đa 10MB</span>
                </div>

                {handoverImages.length > 0 && (
                  <div className="flex gap-2.5 mt-3 overflow-x-auto pr-1">
                    {handoverImages.map((img, idx) => (
                      <div key={idx} className="relative w-11 h-11 rounded border overflow-hidden shrink-0 group">
                        <img src={img} alt="Handover draft proof" className="w-full h-full object-cover" />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setHandoverImages(handoverImages.filter((_, i) => i !== idx));
                          }}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >X?a
                          
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </div>

            {/* Action triggering layout */}
            <div className="pt-2 flex justify-end gap-3 items-center">
              <button 
                type="button"
                onClick={() => setShowInvoicePrintModal(true)}
                className="px-6 py-3 border border-blue-900 hover:bg-blue-50 text-blue-900 font-bold rounded-lg transition active:scale-95 cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                
                Lập phiếu bàn giao
              </button>
              
              {isHandoverReady ? (
                <button 
                  type="button"
                  onClick={() => setShowHandoverConfirmModal(true)}
                  className="px-8 py-3 bg-[#0a236f] hover:bg-blue-900 text-white font-black rounded-lg transition shadow-md active:scale-95 cursor-pointer select-none flex items-center gap-1.5 animate-pulse"
                >
                  
                  Xác nhận bàn giao
                </button>
              ) : (
                <button 
                  type="button"
                  disabled
                  title="Vui lòng kiểm duyệt và tích chọn khớp đầy đủ điều khoản dán cọc giấy và dán thanh toán"
                  className="px-8 py-3 bg-slate-200 text-slate-450 font-bold rounded-lg cursor-not-allowed flex items-center gap-1.5 select-none"
                >
                  
                  Xác nhận bàn giao (Gated)
                </button>
              )}
            </div>

            {!isHandoverReady && (
              <p className="text-right text-[10px] text-red-500 font-medium">* Vui lòng tích chọn khớp máy móc sê-ri &amp; dọn đủ giấy cọc / thanh toán để mở khóa nút bàn giao.</p>
            )}

          </div>

        </div>
      ) : (
        // RETURN & RECONCILIATION FLOW (TAB 2)
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in text-xs">
          
          <div className="lg:col-span-8 space-y-6">
            
            {/* Block 1: Real-time renting invoice selection */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center font-bold text-[#00236f]">
                <span className="font-serif">THÔNG TIN ĐƠN ĐANG THUÊ</span>
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] uppercase font-black">
                  Đang thuê máy
                </span>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Mã đơn hàng</span>
                  <strong className="text-lg text-blue-900 font-mono">#ORD-5001</strong>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Khách cọc máy</span>
                  <p className="font-bold text-slate-800 text-sm">Nguyễn Văn A</p>
                  <p className="text-[10px] text-slate-400 font-mono font-medium">Phone: 0908 123 456</p>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Thời gian giao trả</span>
                  <p className="font-bold text-slate-800 text-sm">15/10 - 18/10/2026</p>
                  <span className="text-[10px] text-red-600 font-black italic block mt-0.5">(Quá hạn giao nhận 2 giờ)</span>
                </div>
              </div>
            </div>

            {/* Block 2: Main asset reconciliation check */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-[#00236f] font-bold font-serif uppercase tracking-widest text-[11px]">
                <ArrowLeftRight className="w-4 h-4 shrink-0 text-[#00236f]" />
                Đối chiếu thiết bị cốt lõi chính
              </div>

              <div className="flex gap-4 p-4 bg-slate-50 border border-slate-150 rounded-lg items-center">
                <div className="w-14 h-14 bg-white rounded border overflow-hidden p-1 shrink-0">
                  <img src={EQUIPMENTS[0].image} alt="Sony alpha code" className="w-full h-full object-contain" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm">Body Sony Alpha A7 IV</h4>
                  <p className="text-[10px] text-slate-450 font-bold">
                    Số Serial bàn giao gốc: <span className="font-mono bg-blue-50 px-2 py-0.5 rounded text-blue-900 font-black">SN-A74-99201</span>
                  </p>
                </div>
              </div>

              {/* Status Radio matrix switcher - SCREEN 30 style */}
              <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 bg-white font-bold select-none cursor-pointer">
                
                <div 
                  onClick={() => setMainAssetState('correct')}
                  className={`p-3.5 border rounded-xl flex flex-col items-center gap-2.5 transition text-center ${
                    mainAssetState === 'correct' 
                      ? 'border-emerald-500 bg-emerald-50/20 text-emerald-800 font-black' 
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <input 
                    type="radio" 
                    checked={mainAssetState === 'correct'}
                    readOnly
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Đúng tài sản</span>
                </div>

                <div 
                  onClick={() => setMainAssetState('wrong')}
                  className={`p-3.5 border rounded-xl flex flex-col items-center gap-2.5 transition text-center ${
                    mainAssetState === 'wrong' 
                      ? 'border-red-500 bg-red-50/20 text-red-800 font-black' 
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <input 
                    type="radio" 
                    checked={mainAssetState === 'wrong'}
                    readOnly
                    className="w-4 h-4 text-red-650 focus:ring-red-500"
                  />
                  <span>Sai sê-ri máy</span>
                </div>

                <div 
                  onClick={() => setMainAssetState('missing')}
                  className={`p-3.5 border rounded-xl flex flex-col items-center gap-2.5 transition text-center ${
                    mainAssetState === 'missing' 
                      ? 'border-amber-500 bg-amber-50/20 text-amber-800 font-black' 
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <input 
                    type="radio" 
                    checked={mainAssetState === 'missing'}
                    readOnly
                    className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                  />
                  <span>Thiếu hụt cọc</span>
                </div>

                <div 
                  onClick={() => setMainAssetState('damaged')}
                  className={`p-3.5 border rounded-xl flex flex-col items-center gap-2.5 transition text-center ${
                    mainAssetState === 'damaged' 
                      ? 'border-red-500 bg-red-50/20 text-red-800 font-black' 
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <input 
                    type="radio" 
                    checked={mainAssetState === 'damaged'}
                    readOnly
                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                  />
                  <span>Hư hỏng máy móc</span>
                </div>

              </div>

            </div>

            {/* Block 3: Acc audit with 4 status options toggling */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-[#00236f] font-bold font-serif uppercase tracking-widest text-[11px]">
                <ClipboardCheck className="w-4 h-4 shrink-0 text-[#00236f]" />
                ĐỐI CHIẾU KIỂM KÊ PHỤ KIỆN HỘP
              </div>

              <div className="space-y-4">
                
                {/* Accessory item 1: Battery */}
                <div className="border border-slate-150 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 border">
                      <BatteryCharging className="w-5 h-5 text-blue-900" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Pin NP-FZ100 (Chính hãng)</p>
                      <span className="text-[10px] text-slate-450 font-bold block mt-0.5">Số lượng bàn giao gốc: x2 quả</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['enough', 'missing', 'lost', 'damaged'].map((st) => {
                      const textMap = { enough: 'Đủ', missing: 'Thiếu', lost: 'Mất', damaged: 'Hỏng' };
                      const isSel = accessory1State === st;
                      const colors = st === 'enough' 
                        ? 'border-emerald-500 bg-emerald-50/30 text-emerald-800' 
                        : st === 'missing' 
                        ? 'border-amber-500 bg-amber-50/20 text-amber-800' 
                        : 'border-red-500 bg-red-50/20 text-red-800';
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setAccessory1State(st)}
                          className={`px-3 py-1.5 rounded-full border text-[10px] font-bold transition active:scale-95 shrink-0 ${
                            isSel ? colors : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          {textMap[st]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Accessory item 2: SD Card */}
                <div className="border border-slate-150 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 border">
                      <Database className="w-5 h-5 text-blue-900" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Thẻ nhớ Extreme SD 128GB</p>
                      <span className="text-[10px] text-slate-450 font-bold block mt-0.5">Số lượng bàn giao gốc: x1 thẻ</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 font-bold">
                    {['enough', 'missing', 'lost', 'damaged'].map((st) => {
                      const textMap = { enough: 'Đủ', missing: 'Thiếu', lost: 'Mất', damaged: 'Hỏng' };
                      const isSel = accessory2State === st;
                      const colors = st === 'enough' 
                        ? 'border-emerald-500 bg-emerald-50/30 text-emerald-800' 
                        : st === 'missing' 
                        ? 'border-amber-500 bg-amber-50/20 text-amber-800' 
                        : 'border-red-500 bg-red-50/20 text-red-800';
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setAccessory2State(st)}
                          className={`px-3 py-1.5 rounded-full border text-[10px] font-bold transition active:scale-95 shrink-0 ${
                            isSel ? colors : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          {textMap[st]}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right column sidebar Return audit */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Condition picture collection */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">Hình ảnh thực tế lúc trả máy</span>
              
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDropReturnImage}
                onClick={() => setReturnImages([...returnImages, EQUIPMENTS[1].image])}
                className="border-2 border-dashed border-slate-200 hover:bg-slate-50 rounded-xl p-5 shrink-0 text-center cursor-pointer transition select-none flex flex-col items-center justify-center group"
              >
                <UploadCloud className="w-7 h-7 text-slate-350 group-hover:text-blue-900 transition-colors" />
                <p className="font-bold text-slate-650 mt-1">Gắp tệp thả kiểm kê</p>
                <p className="text-[8px] text-slate-400">Hỗ trợ tối đa 5 file ảnh JPEG/PNG</p>
              </div>

              {returnImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 pt-1.5">
                  {returnImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded border border-slate-200 overflow-hidden group shadow-inner">
                      <img src={img} alt="Return asset visual audit" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setReturnImages(returnImages.filter((_, i) => i !== idx));
                        }}
                        className="absolute inset-[1px] bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded"
                      >X?a
                        
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Note logs */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">Ghi nhận tình trạng hư hỏng</span>
              <textarea 
                rows="4"
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                placeholder="Ghi nhận chi tiết vết xước nhẹ, sensor bám bụi bẩn, hoặc lỗi phát sinh cần phạt cọc..."
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500/50 outline-none resize-none placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Overtime penalty alert info panel */}
            <div className="p-4 bg-amber-50/50 border border-amber-200 text-amber-850 rounded-xl flex gap-3 text-[11px] leading-relaxed select-none">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 text-xs">Cơ chế tự động phạt trả trễ trọn ngày</strong>
                <p className="mt-0.5 text-[10px] font-semibold text-slate-500 leading-normal">
                  Ngày trả máy quy định là 18/10, đơn hàng hiện trễ hơn 2 tiếng. Hệ thống sẽ kết chuyển tự động phụ phí quá giờ vào hóa đơn đền bù cuối cùng.
                </p>
              </div>
            </div>

            {/* Return action buttons */}
            <div className="space-y-2.5">
              <button 
                type="button"
                onClick={() => setShowReturnConfirmModal(true)}
                className="w-full py-3 bg-[#10b981] hover:bg-emerald-600 text-white font-black rounded-lg transition shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                
                Hoàn tất đối soát kiểm kê
              </button>
              
              <button 
                type="button"
                onClick={() => {
                  alert('Hệ thống đang lưu trữ và kết chuyển hồ sơ sự cố hư tổn sang bộ phận Quản lý Tranh Chấp (Disputes)...');
                }}
                className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border border-red-200/50 font-bold rounded-lg transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                
                Ghi nhận tranh chấp sự cố
              </button>
            </div>

          </div>

        </div>
      )}
        </div>
      )}

    </div>
  );
}
