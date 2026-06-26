import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Calendar, 
  ShieldCheck, 
  ShoppingBag, 
  AlertTriangle, 
  Sparkles, 
  Check,
  RefreshCw 
} from 'lucide-react';
import deviceApi from '../../api/deviceApi';


export default function EquipmentDetail({
  equipment,
  onNavigateBack,
  onAddToCart,
  user,
  onOpenEquipmentDetail
}) {
  const [loading, setLoading] = useState(true);
  const [activeEquipment, setActiveEquipment] = useState(equipment);
  const [relatedEquipments, setRelatedEquipments] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [checkResult, setCheckResult] = useState(null); // { status: 'available'|'unavailable', qty: number, message: string }
  const [feedback, setFeedback] = useState({ success: '', error: '' });

  const systemTodayStr = '2026-06-21';

  // Keep active equipment synchronized with incoming prop
  useEffect(() => {
    setStartDate('');
    setEndDate('');
    setQuantity(1);
    setCheckResult(null);
    setFeedback({ success: '', error: '' });

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await deviceApi.getDeviceModelDetail(equipment.id);
        setActiveEquipment(res.data?.data || equipment);
      } catch (err) {
        console.error('Lỗi khi tải chi tiết', err);
        setActiveEquipment(equipment); // Fallback
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async () => {
      try {
        const res = await deviceApi.getDeviceModels({ limit: 4 });
        let items = res.data?.data?.items || res.data?.data || [];
        if (Array.isArray(items)) {
          items = items.filter(item => item.id !== equipment?.id).slice(0, 3);
          setRelatedEquipments(items);
        }
      } catch (err) {
        console.error('Lỗi khi tải thiết bị liên quan', err);
      }
    };

    if (equipment && equipment.id) {
      fetchDetail();
      fetchRelated();
    } else {
      setActiveEquipment(equipment);
      setLoading(false);
    }
  }, [equipment]);

  // Get matching bundle list for table
  const modelNameCleaned = activeEquipment?.name || '';
  const bundleList = activeEquipment?.includedItems || [];

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
        brand: activeEquipment.brand?.name || activeEquipment.brand,
        category: activeEquipment.category?.name || activeEquipment.category,
        pricePerDay: activeEquipment.dailyPrice || activeEquipment.daily_price || activeEquipment.pricePerDay,
        deposit: activeEquipment.depositAmount || activeEquipment.deposit_amount || activeEquipment.deposit,
        image: activeEquipment.imageUrl || activeEquipment.image || activeEquipment.image_url,
        description: activeEquipment.description
      },
      days: daysCalc,
      
      productModel: activeEquipment.name,
      startDate: startDate,
      endDate: endDate,
      quantity: quantity,
      dailyPrice: activeEquipment.dailyPrice || activeEquipment.daily_price || activeEquipment.pricePerDay,
      depositAmount: activeEquipment.depositAmount || activeEquipment.deposit_amount || activeEquipment.deposit
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
        
        Quay lại Danh sách
      </button>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <RefreshCw className="w-8 h-8 text-[#00236f] animate-spin" />
          <span className="text-sm font-bold text-slate-500">Đang tải chi tiết thiết bị...</span>
        </div>
      ) : (
        <>
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
              src={activeEquipment.imageUrl || activeEquipment.image || activeEquipment.image_url} 
              alt={activeEquipment.name} 
              className="w-full aspect-square object-cover rounded-xl"
            />
          </div>

          <div className="md:col-span-7 space-y-3.5">
            <span className="text-[10px] font-black uppercase text-[#fea619] tracking-widest">{activeEquipment.brand?.name || activeEquipment.brand}</span>
            <h1 className="text-xl md:text-2xl font-black text-[#00236f] tracking-tight leading-tight">
              {activeEquipment.name}
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              {activeEquipment.descriptionLong || activeEquipment.description || 'Sản phẩm cao cấp hàng đầu được bảo dưỡng nghiêm ngặt, đảm bảo độ tin cậy tuyệt đối cho toàn bộ hoạt động tác nghiệp.'}
            </p>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <div>
                <span className="text-[9.5px] uppercase font-bold text-slate-400 block mb-0.5">Giá một ngày</span>
                <strong className="text-sm font-black text-[#00236f] font-mono block">
                  {(activeEquipment.dailyPrice || activeEquipment.daily_price || activeEquipment.pricePerDay || 0).toLocaleString('vi-VN')}đ / ngày
                </strong>
              </div>
              <div>
                <span className="text-[9.5px] uppercase font-bold text-slate-400 block mb-0.5">Tiền đặt cọc</span>
                <strong className="text-sm font-black text-rose-800 font-mono block">
                  {(activeEquipment.depositAmount || activeEquipment.deposit_amount || activeEquipment.deposit || 0).toLocaleString('vi-VN')}đ
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
                    <td className="px-3.5 py-2.5 font-bold text-slate-900">{item.itemName || item.name}</td>
                    <td className="px-3.5 py-2.5 text-slate-600 font-semibold">{item.type || 'Phụ kiện'}</td>
                    <td className="px-3.5 py-2.5 text-center font-bold text-slate-800">{item.quantity || item.qty || 1}</td>
                    <td className="px-3.5 py-2.5 text-center">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[9.5px] border border-emerald-200 font-extrabold rounded-md">
                        {item.isRequired || item.required === 'Có' ? 'Có' : 'Không'}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-450 font-medium">{item.notes || item.note}</td>
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
          {relatedEquipments.map((item) => {
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
                    src={item.imageUrl || item.image || item.image_url} 
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
                    <span className="text-[9px] font-black uppercase text-[#fea619] tracking-widest leading-none block">{item.brand?.name || item.brand}</span>
                    <h4 className="text-sm font-extrabold text-slate-800 hover:text-[#00236f] transition truncate mt-0.5">{item.name}</h4>
                    <p className="text-xs text-slate-450 line-clamp-1 font-semibold leading-relaxed">{item.descriptionShort || item.description}</p>
                  </div>

                  <div className="space-y-1 text-xs border-t border-slate-100 pt-2.5">
                    <div className="flex justify-between items-center text-slate-550 font-bold">
                      <span>Phí / ngày:</span>
                      <strong className="text-slate-800 font-mono font-black">{(item.dailyPrice || item.daily_price || item.pricePerDay || 0).toLocaleString('vi-VN')} VNĐ</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-550 font-bold">
                      <span>Tiền cọc:</span>
                      <strong className="text-rose-900 font-mono font-black">{(item.depositAmount || item.deposit_amount || item.deposit || 0).toLocaleString('vi-VN')} VNĐ</strong>
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
        </>
      )}

    </div>
  );
}
