import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Calendar, 
  ShieldCheck, 
  ShoppingBag, 
  AlertTriangle, 
  Sparkles, 
  Check 
} from 'lucide-react';

const EQUIPMENTS_DATA = [
  {
    id: 'sony-a7iv',
    name: 'Sony A7 IV',
    brand: 'Sony',
    category: 'camera',
    pricePerDay: 800000,
    deposit: 3000000,
    descriptionShort: 'Body full-frame phù hợp chụp ảnh và quay video chuyên nghiệp.',
    descriptionLong: 'Máy ảnh Mirrorless Full-frame Sony Alpha A7 IV sở hữu cảm biến BSI CMOS 33MP thế hệ mới, bộ xử lý hình ảnh BIONZ XR cực đỉnh, hỗ trợ chụp liên tục 15fps và quay video lấy nét theo mắt thời gian thực.',
    image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600',
    availableQuantity: 2
  },
  {
    id: 'fuji-xt5',
    name: 'Fuji X-T5',
    brand: 'Fujifilm',
    category: 'camera',
    pricePerDay: 600000,
    deposit: 2500000,
    descriptionShort: 'Body mang phong cách cổ điển, chất màu Fujifilm độc bản.',
    descriptionLong: 'Fujifilm X-T5 trang bị cảm biến X-Trans CMOS 5 HR độ phân giải tới 40.2 MP, bộ xử lý hình ảnh X-Processor 5, chống rung 5 trục tích hợp ibis cực cao tới 7.0 stops.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600',
    availableQuantity: 2
  },
  {
    id: 'lens-2470gm',
    name: 'Lens 24-70 GM',
    brand: 'Sony',
    category: 'lens',
    pricePerDay: 500000,
    deposit: 2000000,
    descriptionShort: 'Lens zoom đa dụng phù hợp chụp sự kiện, chân dung và quay video.',
    descriptionLong: 'Ống kính ngàm E Sony FE 24-70mm f/2.8 GM mang hiệu năng quang học xuất sắc trên toàn dải zoom, thuộc dòng G Master cao cấp nhất của Sony.',
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600',
    availableQuantity: 3
  },
  {
    id: 'lens-xf35',
    name: 'Lens XF 35mm',
    brand: 'Fujifilm',
    category: 'lens',
    pricePerDay: 300000,
    deposit: 1500000,
    descriptionShort: 'Lens tiêu cự cố định nhỏ gọn, phù hợp chụp chân dung và đời thường.',
    descriptionLong: 'Ống kính một tiêu cự khẩu lớn Fujifilm XF 35mm f/1.4 R sở hữu khẩu độ mở tới f/1.4 cho khả năng xóa phông mượt mà và làm việc trong môi trường tối tuyệt vời.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600',
    availableQuantity: 3
  },
  {
    id: 'canon-r6',
    name: 'Canon EOS R6',
    brand: 'Canon',
    category: 'camera',
    pricePerDay: 750000,
    deposit: 3000000,
    descriptionShort: 'Body full-frame cân bằng giữa chụp ảnh và quay video.',
    descriptionLong: 'Máy ảnh Canon EOS R6 sở hữu cảm biến CMOS Fullframe 20 MP, hệ thống lấy nét siêu tốc Dual Pixel CMOS AF II lý tưởng hàng đầu.',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600',
    isAlwaysUnavailable: true,
    availableQuantity: 0
  },
  {
    id: 'pin-npfz100',
    name: 'Pin NP-FZ100',
    brand: 'Sony',
    category: 'accessory',
    pricePerDay: 80000,
    deposit: 500000,
    descriptionShort: 'Pin rời dùng cho các body Sony tương thích.',
    descriptionLong: 'Pin sạc Lithium-ion dung lượng cao, hoạt động ổn định và lâu dài cho các dòng máy ảnh Sony Alpha thế hệ mới.',
    image: 'https://images.unsplash.com/photo-1624456930905-513665559132?w=600',
    availableQuantity: 5
  },
  {
    id: 'pin-fuji-npw235',
    name: 'Pin Fuji NP-W235',
    brand: 'Fujifilm',
    category: 'accessory',
    pricePerDay: 80000,
    deposit: 500000,
    descriptionShort: 'Pin rời dùng cho các body Fujifilm tương thích.',
    descriptionLong: 'Pin rời dung lượng cao thế hệ mới, hoạt động bền bỉ, hỗ trợ kén sạc nhanh và chống tụt nhiệt độ.',
    image: 'https://images.unsplash.com/photo-1624456930905-513665559132?w=600',
    availableQuantity: 5
  }
];

const SPECIFIC_BUNDLES = {
  'Sony A7 IV': [
    { name: 'Pin NP-FZ100', type: 'Thiết bị vật lý định danh', qty: 1, required: 'Có', note: 'Pin rời đi kèm body Sony' },
    { name: 'Lens 24-70 GM', type: 'Thiết bị vật lý định danh', qty: 1, required: 'Có', note: 'Lens đi kèm combo Sony' },
    { name: 'Túi Sony', type: 'Phụ kiện số lượng', qty: 1, required: 'Có', note: 'Túi đựng bộ Sony' }
  ],
  'Sony Alpha A7 IV': [
    { name: 'Pin NP-FZ100', type: 'Thiết bị vật lý định danh', qty: 1, required: 'Có', note: 'Pin rời đi kèm body Sony' },
    { name: 'Lens 24-70 GM', type: 'Thiết bị vật lý định danh', qty: 1, required: 'Có', note: 'Lens đi kèm combo Sony' },
    { name: 'Túi Sony', type: 'Phụ kiện số lượng', qty: 1, required: 'Có', note: 'Túi đựng bộ Sony' }
  ],
  'Fuji X-T5': [
    { name: 'Pin Fuji NP-W235', type: 'Thiết bị vật lý định danh', qty: 1, required: 'Có', note: 'Pin rời đi kèm body Fuji' },
    { name: 'Lens XF 35mm', type: 'Thiết bị vật lý định danh', qty: 1, required: 'Có', note: 'Lens đi kèm combo Fuji' },
    { name: 'Túi Fuji', type: 'Phụ kiện số lượng', qty: 1, required: 'Có', note: 'Túi đựng bộ Fuji' }
  ],
  'Lens 24-70 GM': [
    { name: 'Nắp đậy Lens trước', type: 'Phụ kiện số lượng', qty: 1, required: 'Có', note: 'Nắp bảo trì' },
    { name: 'Nắp đậy Lens sau', type: 'Phụ kiện số lượng', qty: 1, required: 'Có', note: 'Nắp bảo trì' },
    { name: 'Hộp đựng chống sốc', type: 'Phụ kiện số lượng', qty: 1, required: 'Có', note: 'Hộp bảo quản' }
  ],
  'Lens XF 35mm': [
    { name: 'Nắp trước', type: 'Phụ kiện số lượng', qty: 1, required: 'Có', note: 'Bảo quản thấu kính' },
    { name: 'Nắp sau', type: 'Phụ kiện số lượng', qty: 1, required: 'Có', note: 'Bảo quản thấu kính' }
  ],
  'Canon EOS R6': [
    { name: 'Pin Canon LP-E6NH', type: 'Thiết bị vật lý định danh', qty: 1, required: 'Có', note: 'Pin zin theo máy' },
    { name: 'Túi Canon đựng máy', type: 'Phụ kiện số lượng', qty: 1, required: 'Có', note: 'Túi đeo bảo quản' },
    { name: 'Sạc rời Canon', type: 'Phụ kiện số lượng', qty: 1, required: 'Có', note: 'Sạc theo máy' }
  ],
  'Canon EOS R6 Mark II': [
    { name: 'Pin Canon LP-E6NH', type: 'Thiết bị vật lý định danh', qty: 1, required: 'Có', note: 'Pin zin theo máy' },
    { name: 'Túi Canon đựng máy', type: 'Phụ kiện số lượng', qty: 1, required: 'Có', note: 'Túi đeo bảo quản' },
    { name: 'Sạc rời Canon', type: 'Phụ kiện số lượng', qty: 1, required: 'Có', note: 'Sạc theo máy' }
  ],
  'Pin NP-FZ100': [
    { name: 'Kén sạc pin', type: 'Phụ kiện số lượng', qty: 1, required: 'Có', note: 'Kén sạc bảo hộ pin' }
  ],
  'Pin Fuji NP-W235': [
    { name: 'Kén sạc pin Fuji', type: 'Phụ kiện số lượng', qty: 1, required: 'Có', note: 'Kén bảo quản rời' }
  ]
};

// Fallback bundle inside detail
const DEFAULT_BUNDLE = [
  { name: 'Cáp kết nối đa năng', type: 'Phụ kiện số lượng', qty: 1, required: 'Có', note: 'Cáp đồng bộ hóa' },
  { name: 'Túi đựng chống ẩm', type: 'Phụ kiện số lượng', qty: 1, required: 'Có', note: 'Bảo vệ thiết bị' }
];

const getRelatedModelsFor = (eq, searchStartDate, searchEndDate, allEquipmentsList) => {
  const cleanName = (eq?.name || '').trim().toLowerCase();

  // If Sony A7 IV or Sony Alpha A7 IV is selected:
  if (cleanName === 'sony a7 iv' || cleanName === 'sony alpha a7 iv') {
    return allEquipmentsList.filter(item => {
      const nameLower = item.name.toLowerCase();
      return nameLower.includes('24-70 gm') || nameLower.includes('pin np-fz100') || nameLower.includes('canon eos r6');
    });
  }

  // If Fuji X-T5 is selected:
  if (cleanName === 'fuji x-t5') {
    return allEquipmentsList.filter(item => {
      const nameLower = item.name.toLowerCase();
      return nameLower.includes('xf 35mm') || nameLower.includes('pin fuji np-w235') || nameLower.includes('sony a7 iv') || nameLower.includes('sony alpha a7 iv');
    });
  }

  // Otherwise, fallback: same brand or same category, excluding itself
  return allEquipmentsList
    .filter(item => item.id !== eq.id && item.name !== eq.name)
    .slice(0, 3);
};

export default function EquipmentDetail({
  equipment,
  onNavigateBack,
  onAddToCart,
  user,
  onOpenEquipmentDetail
}) {
  const [activeEquipment, setActiveEquipment] = useState(equipment);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [checkResult, setCheckResult] = useState(null); // { status: 'available'|'unavailable', qty: number, message: string }
  const [feedback, setFeedback] = useState({ success: '', error: '' });

  const systemTodayStr = '2026-06-21';

  // Keep active equipment synchronized with incoming prop
  useEffect(() => {
    setActiveEquipment(equipment);
    setStartDate('');
    setEndDate('');
    setQuantity(1);
    setCheckResult(null);
    setFeedback({ success: '', error: '' });
  }, [equipment]);

  // Get matching bundle list for table
  const modelNameCleaned = activeEquipment?.name || '';
  const bundleList = SPECIFIC_BUNDLES[modelNameCleaned] || DEFAULT_BUNDLE;

  const isCanon = modelNameCleaned.toLowerCase().includes('canon');

  const showFeedbackError = (msg) => {
    setFeedback({ success: '', error: msg });
  };
  const showFeedbackSuccess = (msg) => {
    setFeedback({ error: '', success: msg });
  };

  // -------------------------------------------------------------
  // KIỂM TRA SẴN SÀNG (READINESS CHECKER)
  // -------------------------------------------------------------
  const handleVerifyReadiness = () => {
    setFeedback({ error: '', success: '' });
    setCheckResult(null);

    if (!startDate) {
      showFeedbackError('Vui lòng chọn ngày nhận');
      return;
    }

    if (!endDate) {
      showFeedbackError('Vui lòng chọn ngày trả');
      return;
    }

    if (new Date(startDate) < new Date(systemTodayStr)) {
      showFeedbackError('Ngày nhận không được nhỏ hơn ngày hiện tại');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      showFeedbackError('Ngày trả phải lớn hơn ngày nhận');
      return;
    }

    if (!quantity || quantity <= 0) {
      showFeedbackError('Số lượng thuê không hợp lệ');
      return;
    }

    // Mock Availability Stock limits
    const maxStock = isCanon ? 0 : 2; // Sony & Fujifilm get 2 available units, Canon gets 0

    if (isCanon) {
      setCheckResult({
        status: 'unavailable',
        qty: 0,
        message: 'Mẫu thiết bị không đủ số lượng khả dụng trong thời gian đã chọn.'
      });
      showFeedbackError('Mẫu thiết bị không đủ số lượng khả dụng trong thời gian đã chọn');
      return;
    }

    if (quantity > maxStock) {
      setCheckResult({
        status: 'unavailable',
        qty: maxStock,
        message: 'Mẫu thiết bị không đủ số lượng khả dụng trong thời gian đã chọn.'
      });
      showFeedbackError('Mẫu thiết bị không đủ số lượng khả dụng trong thời gian đã chọn');
      return;
    }

    // Valid check
    setCheckResult({
      status: 'available',
      qty: maxStock,
      message: 'Mẫu thiết bị còn khả dụng trong thời gian đã chọn.'
    });
    showFeedbackSuccess('Kiểm tra sẵn sàng thành công! Thiết bị có thể thêm vào giỏ hàng.');
  };

  // -------------------------------------------------------------
  // THÊM VÀO GIỎ HÀNG
  // -------------------------------------------------------------
  const handlePushToCart = () => {
    setFeedback({ error: '', success: '' });

    if (!user) {
      showFeedbackError('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }

    if (!startDate || !endDate || new Date(endDate) <= new Date(startDate)) {
      showFeedbackError('Vui lòng chọn ngày thuê hợp lệ');
      return;
    }

    if (!checkResult) {
      showFeedbackError('Vui lòng kiểm tra sẵn sàng trước khi thêm vào giỏ hàng');
      return;
    }

    if (checkResult.status !== 'available') {
      showFeedbackError('Mẫu thiết bị không còn khả dụng');
      return;
    }

    // Days calculate
    const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
    const daysCalc = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Integrated payload matching original app keys & prompt JSON schema
    const normalizedPayload = {
      equipment: {
        id: activeEquipment.id,
        name: activeEquipment.name,
        brand: activeEquipment.brand,
        category: activeEquipment.category,
        pricePerDay: activeEquipment.pricePerDay || activeEquipment.daily_price,
        deposit: activeEquipment.deposit || activeEquipment.deposit_amount,
        image: activeEquipment.image || activeEquipment.image_url,
        description: activeEquipment.description
      },
      days: daysCalc,
      
      productModel: activeEquipment.name,
      startDate: startDate,
      endDate: endDate,
      quantity: quantity,
      dailyPrice: activeEquipment.pricePerDay || activeEquipment.daily_price,
      depositAmount: activeEquipment.deposit || activeEquipment.deposit_amount
    };

    if (onAddToCart) {
      onAddToCart(normalizedPayload);
    }

    alert('Thêm vào giỏ hàng thành công');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 animate-fade-in text-left font-sans" id="equipment-detail-route-wrapper">
      
      {/* Nút quay lại */}
      <button
        onClick={onNavigateBack}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#00236f] hover:text-[#fea619] transition bg-white py-1.5 px-3 border border-slate-200 rounded-xl shadow-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Quay lại Danh sách
      </button>

      {/* Main card box details */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        
        {/* Error & Success Feedback displays */}
        {feedback.error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-[#ba1a1a] font-bold rounded-xl flex items-center gap-2 select-none shadow-xs">
            <AlertTriangle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
            <span>{feedback.error}</span>
          </div>
        )}
        {feedback.success && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold rounded-xl flex items-center gap-2 select-none shadow-xs">
            <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span>{feedback.success}</span>
          </div>
        )}

        {/* PHẦN A. THÔNG TIN MẪU THIẾT BỊ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          <div className="md:col-span-5 bg-slate-50 border border-slate-100 p-3 rounded-2xl">
            <img 
              src={activeEquipment.image || activeEquipment.image_url} 
              alt={activeEquipment.name} 
              className="w-full aspect-square object-cover rounded-xl"
            />
          </div>

          <div className="md:col-span-7 space-y-3.5">
            <span className="text-[10px] font-black uppercase text-[#fea619] tracking-widest">{activeEquipment.brand}</span>
            <h1 className="text-xl md:text-2xl font-black text-[#00236f] tracking-tight leading-tight">
              {activeEquipment.name}
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              {activeEquipment.descriptionLong || activeEquipment.description || 'Sản phẩm cao cấp hàng đầu được bảo dưỡng nghiêm ngặt, đảm bảo độ tin cậy tuyệt đối cho toàn bộ hoạt động tạc tác nghiệp.'}
            </p>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <div>
                <span className="text-[9.5px] uppercase font-bold text-slate-400 block mb-0.5">Giá một ngày</span>
                <strong className="text-sm font-black text-[#00236f] font-mono block">
                  {(activeEquipment.pricePerDay || activeEquipment.daily_price || 0).toLocaleString('vi-VN')}đ / ngày
                </strong>
              </div>
              <div>
                <span className="text-[9.5px] uppercase font-bold text-slate-400 block mb-0.5">Tiền đặt cọc</span>
                <strong className="text-sm font-black text-rose-800 font-mono block">
                  {(activeEquipment.deposit || activeEquipment.deposit_amount || 0).toLocaleString('vi-VN')}đ
                </strong>
              </div>
            </div>
          </div>

        </div>

        {/* PHẦN B. BỘ ĐI KÈM */}
        <div className="bg-slate-50/50 border border-slate-150 p-4.5 rounded-2xl space-y-3">
          <div className="flex items-center gap-1.5 border-b border-slate-205 pb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h4 className="text-[11px] font-black text-[#00236f] uppercase tracking-wider">
              B. Bộ đi kèm cố định cơ sở
            </h4>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-[10.5px] text-left border-collapse">
              <thead className="bg-slate-55 border-b border-slate-200">
                <tr>
                  <th className="px-3.5 py-2 font-black text-[#00236f] uppercase">Thành phần</th>
                  <th className="px-3.5 py-2 font-black text-slate-500 uppercase">Loại quản lý</th>
                  <th className="px-3.5 py-2 font-black text-slate-500 uppercase text-center">Số lượng</th>
                  <th className="px-3.5 py-2 font-black text-slate-500 uppercase text-center">Bắt buộc</th>
                  <th className="px-3.5 py-2 font-black text-slate-500 uppercase">Ghi chú</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {bundleList.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-3.5 py-2.5 font-bold text-slate-900">{item.name}</td>
                    <td className="px-3.5 py-2.5 text-slate-600 font-semibold">{item.type}</td>
                    <td className="px-3.5 py-2.5 text-center font-bold text-slate-800">{item.qty}</td>
                    <td className="px-3.5 py-2.5 text-center">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[9.5px] border border-emerald-200 font-extrabold rounded-md">
                        {item.required}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-450 font-medium">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PHẦN C. FORM CHỌN THÔNG TIN THUÊ */}
        <div className="bg-slate-50 border border-slate-105 p-4.5 rounded-2xl space-y-4">
          <h4 className="text-[11px] font-black text-[#00236f] uppercase tracking-wider block border-b border-slate-200 pb-1">
            C. Cài đặt thời kỳ thuê & Số lượng đặt thuê
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="flex flex-col gap-1 text-xs">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#00236f]" />
                Ngày nhận thiết bị: <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                min={systemTodayStr}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCheckResult(null);
                  setFeedback({ success: '', error: '' });
                }}
                className="h-10 px-3 bg-white border border-slate-200 focus:border-[#00236f] focus:outline-none rounded-xl text-xs font-semibold text-slate-800"
              />
            </div>

            <div className="flex flex-col gap-1 text-xs">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Ngày trả thiết bị: <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={endDate}
                min={startDate || systemTodayStr}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCheckResult(null);
                  setFeedback({ success: '', error: '' });
                }}
                className="h-10 px-3 bg-white border border-slate-200 focus:border-[#00236f] focus:outline-none rounded-xl text-xs font-semibold text-slate-800"
              />
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Số lượng:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-xs">
                <button
                  type="button"
                  onClick={() => { 
                    setQuantity(prev => Math.max(1, prev - 1)); 
                    setCheckResult(null); 
                    setFeedback({ success: '', error: '' });
                  }}
                  className="w-8 h-8 flex items-center justify-center font-bold text-slate-450 hover:text-[#00236f]"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-black text-[#00236f]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => { 
                    setQuantity(prev => prev + 1); 
                    setCheckResult(null); 
                    setFeedback({ success: '', error: '' });
                  }}
                  className="w-8 h-8 flex items-center justify-center font-bold text-slate-450 hover:text-[#00236f]"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleVerifyReadiness}
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-black uppercase rounded-xl border border-slate-300 transition"
            >
              Kiểm tra sẵn sàng
            </button>

          </div>

        </div>

        {/* PHẦN D. KẾT QUẢ KIỂM TRA SẴN SÀNG */}
        {checkResult && (
          <div className="p-4 rounded-xl border border-slate-200 text-left space-y-1.5 bg-slate-50/20">
            <span className="text-[9.5px] uppercase font-bold text-slate-400 block">D. Kết quả kiểm tra sẵn sàng</span>
            
            {checkResult.status === 'available' ? (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold">
                  <Check className="w-4 h-4 bg-emerald-500 text-white rounded-full p-0.5" />
                  <span>Trạng thái: Còn thiết bị</span>
                </div>
                <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                  Thiết bị còn trống, sẵn sàng bàn giao trong thời hạn yêu cầu.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-rose-850 font-extrabold">
                  <AlertTriangle className="w-4 h-4 bg-rose-650 text-white rounded-full p-0.5 shrink-0" />
                  <span>Trạng thái: Hết thiết bị theo ngày chọn</span>
                </div>
                <p className="text-[11px] text-rose-950 font-bold leading-relaxed font-sans">
                  {checkResult.message}
                </p>
              </div>
            )}
          </div>
        )}

        {/* AREA HOẠT ĐỘNG BOTTOM */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          
          <button
            type="button"
            onClick={onNavigateBack}
            className="px-5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black uppercase rounded-xl"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={handlePushToCart}
            disabled={!checkResult || checkResult.status !== 'available'}
            className={`px-6 py-3 font-black uppercase rounded-xl transition flex items-center gap-1.5 ${
              checkResult && checkResult.status === 'available'
                ? 'bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700]'
                : 'bg-slate-300 text-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Thêm thiết bị vào giỏ hàng
          </button>

        </div>

      </div>

      {/* KHU VỰC THIẾT BỊ LIÊN QUAN */}
      <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-4 text-left" id="related-equipments-section-page">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-[#00236f] uppercase tracking-tight">Thiết bị liên quan</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Các mẫu thiết bị khác có thể phù hợp với nhu cầu thuê của bạn.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {getRelatedModelsFor(activeEquipment, startDate, endDate, EQUIPMENTS_DATA).map((item) => {
            // Get status
            let itemStatus = 'Chưa chọn ngày thuê';
            if (startDate && endDate && new Date(endDate) > new Date(startDate)) {
              if (item.name.toLowerCase().includes('canon')) {
                itemStatus = 'Hết thiết bị theo ngày chọn';
              } else {
                itemStatus = 'Còn thiết bị';
              }
            }

            return (
              <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col hover:border-indigo-150 hover:shadow-md transition-all duration-300">
                <div className="relative aspect-video bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2">
                    {itemStatus === 'Chưa chọn ngày thuê' && (
                      <span className="bg-slate-100 text-slate-700 border border-slate-250 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        Chưa chọn ngày thuê
                      </span>
                    )}
                    {itemStatus === 'Còn thiết bị' && (
                      <span className="bg-emerald-100 text-emerald-805 border border-emerald-250 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        Còn thiết bị
                      </span>
                    )}
                    {itemStatus === 'Hết thiết bị theo ngày chọn' && (
                      <span className="bg-rose-100 text-rose-805 border border-rose-250 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        Hết thiết bị theo ngày chọn
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow text-left space-y-3">
                  <div>
                    <span className="text-[9px] font-black uppercase text-[#fea619] tracking-widest leading-none block">{item.brand}</span>
                    <h4 className="text-sm font-extrabold text-slate-800 hover:text-[#00236f] transition truncate mt-0.5">{item.name}</h4>
                    <p className="text-xs text-slate-450 line-clamp-1 font-semibold leading-relaxed">{item.descriptionShort}</p>
                  </div>

                  <div className="space-y-1 text-xs border-t border-slate-100 pt-2.5">
                    <div className="flex justify-between items-center text-slate-550 font-bold">
                      <span>Phí / ngày:</span>
                      <strong className="text-slate-800 font-mono font-black">{item.pricePerDay.toLocaleString('vi-VN')} VNĐ</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-550 font-bold">
                      <span>Tiền cọc:</span>
                      <strong className="text-rose-900 font-mono font-black">{item.deposit.toLocaleString('vi-VN')} VNĐ</strong>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => {
                      setActiveEquipment(item);
                      setStartDate('');
                      setEndDate('');
                      setQuantity(1);
                      setCheckResult(null);
                      setFeedback({ success: '', error: '' });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      if (onOpenEquipmentDetail) {
                        onOpenEquipmentDetail(item);
                      }
                    }}
                    className="w-full py-2.5 bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] text-xs font-black uppercase rounded-xl transition mt-auto cursor-pointer flex items-center justify-center"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
