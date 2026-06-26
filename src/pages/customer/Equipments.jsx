import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Info, 
  SlidersHorizontal, 
  ShieldCheck, 
  ShoppingBag, 
  Calendar, 
  Sparkles, 
  AlertTriangle, 
  X, 
  Plus, 
  Minus, 
  Check, 
  Eye, 
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import deviceApi from '../../api/deviceApi';

const CUSTOMER_CATEGORIES = [
  { id: 'all', name: 'Tất cả' },
  { id: 'camera', name: 'Body máy ảnh' },
  { id: 'lens', name: 'Lens' },
  { id: 'accessory', name: 'Phụ kiện định danh' },
];

const getRelatedModelsFor = (eq, searchStartDate, searchEndDate, allEquipmentsList) => {
  const cleanName = (eq?.name || '').trim().toLowerCase();

  // If Sony A7 IV or Sony Alpha A7 IV is selected:
  if (cleanName === 'sony a7 iv' || cleanName === 'sony alpha a7 iv') {
    return allEquipmentsList.filter(item => {
      const nameLower = (item.name || '').toLowerCase();
      return nameLower.includes('24-70 gm') || nameLower.includes('pin np-fz100') || nameLower.includes('canon eos r6');
    });
  }

  // If Fuji X-T5 is selected:
  if (cleanName === 'fuji x-t5') {
    return allEquipmentsList.filter(item => {
      const nameLower = (item.name || '').toLowerCase();
      return nameLower.includes('xf 35mm') || nameLower.includes('pin fuji np-w235') || nameLower.includes('sony a7 iv') || nameLower.includes('sony alpha a7 iv');
    });
  }

  // Otherwise, fallback: same brand or same category, excluding itself
  return allEquipmentsList
    .filter(item => item.id !== eq.id && item.name !== eq.name)
    .slice(0, 3);
};

export default function Equipments({
  selectedCategory,
  setSelectedCategory,
  onOpenEquipmentDetail, // standard callback for app
  onAddToCart,          // custom callback to bypass to cart
  cartItems = [],       // to check existing items in shopping bag
  user                  // current simulation user
}) {
  const [allModels, setAllModels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters local states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState('all'); // 'all', 'under500', '500to1000', 'above1000'
  const [mainStartDate, setMainStartDate] = useState('');
  const [mainEndDate, setMainEndDate] = useState('');

  // Date Check validation on main search filters
  const [dateErrorMsg, setDateErrorMsg] = useState('');

  // Details Modal controls
  const [selectedModel, setSelectedModel] = useState(null);
  const [detailStartDate, setDetailStartDate] = useState('');
  const [detailEndDate, setDetailEndDate] = useState('');
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [checkResult, setCheckResult] = useState(null); // { status: 'available'|'unavailable', qty: number, message: string }
  const [modalFeedback, setModalFeedback] = useState({ success: '', error: '' });
  const modalScrollRef = React.useRef(null);

  // Reset errors and trigger alerts
  const showModalError = (msg) => {
    setModalFeedback({ success: '', error: msg });
  };
  const showModalSuccess = (msg) => {
    setModalFeedback({ error: '', success: msg });
  };

  // Get current local formatted date dynamically to assign to "min"
  // Defaulting to "2026-06-21" according to local mock metadata
  const systemTodayStr = '2026-06-21';

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const res = await deviceApi.getDeviceModels({ limit: 100 });
        setAllModels(res.data?.data?.items || res.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch device models:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, []);

  // -------------------------------------------------------------
  // TRẠNG THÁI KHẢ DỤNG CỦA CARD Ở DANH SÁCH NGOÀI
  // Trả về: 'Chưa chọn ngày thuê', 'Còn thiết bị', 'Hết thiết bị theo ngày chọn'
  // -------------------------------------------------------------
  const getAvailabilityStatus = (item, startDate, endDate) => {
    if (!startDate || !endDate) {
      return 'Chưa chọn ngày thuê'; // State 1
    }
    // Check if dates are invalid
    if (new Date(endDate) <= new Date(startDate)) {
      return 'Chưa chọn ngày thuê'; 
    }
    if (item.isAlwaysUnavailable) {
      return 'Hết thiết bị theo ngày chọn'; // State 3
    }
    return 'Còn thiết bị'; // State 2
  };

  // Synchronize main page filters dates changes with validation
  const handleMainDateChange = (type, val) => {
    setDateErrorMsg('');
    if (type === 'start') {
      setMainStartDate(val);
      if (val && new Date(val) < new Date(systemTodayStr)) {
        setDateErrorMsg('Ngày nhận không được nhỏ hơn ngày hiện tại');
      }
    } else {
      setMainEndDate(val);
      if (mainStartDate && val && new Date(val) <= new Date(mainStartDate)) {
        setDateErrorMsg('Ngày trả phải lớn hơn ngày nhận');
      }
    }
  };

  // Brands list
  const brands = ['all', 'Sony', 'Fujifilm', 'Canon'];

  // Main Filtering query logic
  const filteredModels = allModels.filter((eq) => {
    // 1. Category check
    const mappedCat = eq.category?.name?.toLowerCase() || (typeof eq.category === 'string' ? eq.category.toLowerCase() : ''); 
    let isCatMatched = selectedCategory === 'all';
    if (!isCatMatched) {
      if (selectedCategory === 'camera') {
        isCatMatched = mappedCat.includes('camera') || mappedCat.includes('máy ảnh') || mappedCat.includes('body') || mappedCat === 'camera';
      } else if (selectedCategory === 'lens') {
        isCatMatched = mappedCat.includes('lens') || mappedCat.includes('ống kính') || mappedCat === 'lens';
      } else if (selectedCategory === 'accessory') {
        isCatMatched = mappedCat.includes('phụ kiện') || mappedCat.includes('accessory') || mappedCat === 'accessory';
      }
    }

    // 2. Brand check
    const brandName = eq.brand?.name || eq.brand || '';
    const isBrandMatched = selectedBrand === 'all' || brandName.toLowerCase() === selectedBrand.toLowerCase();

    // 3. Search text query check
    const isSearchMatched = 
      (eq.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      brandName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (eq.description || eq.descriptionShort || '').toLowerCase().includes(searchQuery.toLowerCase());

    // 4. Price range checks
    const dailyPrice = eq.dailyPrice || eq.pricePerDay || 0;
    let isPriceMatched = true;
    if (priceRange === 'under500') {
      isPriceMatched = dailyPrice < 500000;
    } else if (priceRange === '500to1000') {
      isPriceMatched = dailyPrice >= 500000 && dailyPrice <= 1000000;
    } else if (priceRange === 'above1000') {
      isPriceMatched = dailyPrice > 1000000;
    }

    return isCatMatched && isBrandMatched && isSearchMatched && isPriceMatched;
  });

  // Open detail popup modal handler with synchronized values
  const handleOpenDetailModal = async (eq) => {
    try {
      const res = await deviceApi.getDeviceModelDetail(eq.id);
      const detail = res.data?.data || res.data;
      
      setSelectedModel({
        ...detail,
        bundle: detail.includedItems?.map(item => ({
          name: item.name || item.item?.name,
          type: item.type || 'Phụ kiện',
          qty: item.quantity || item.qty || 1,
          required: item.isRequired ? 'Có' : 'Không',
          note: item.note || ''
        })) || []
      });
      // Synced dates from main index if provided and correct
      setDetailStartDate(mainStartDate || '');
      setDetailEndDate(mainEndDate || '');
      setDetailQuantity(1);
      setCheckResult(null);
      setModalFeedback({ success: '', error: '' });
    } catch (error) {
      console.error('Failed to fetch model details:', error);
    }
  };

  // Close detail popup modal handler
  const handleCloseDetailModal = () => {
    setSelectedModel(null);
    setCheckResult(null);
    setModalFeedback({ success: '', error: '' });
  };

  // -------------------------------------------------------------
  // KIỂM TRA SẴN SÀNG (READINESS CHECKER IN MODAL)
  // -------------------------------------------------------------
  const handleVerifyReadiness = () => {
    setModalFeedback({ error: '', success: '' });
    setCheckResult(null);

    // 1. Khách hàng đã chọn ngày nhận chưa
    if (!detailStartDate) {
      showModalError('Vui lòng chọn ngày nhận');
      return;
    }

    // 2. Khách hàng đã chọn ngày trả chưa
    if (!detailEndDate) {
      showModalError('Vui lòng chọn ngày trả');
      return;
    }

    // 3. Ngày nhận không được nhỏ hơn ngày hiện tại
    if (new Date(detailStartDate) < new Date(systemTodayStr)) {
      showModalError('Ngày nhận không được nhỏ hơn ngày hiện tại');
      return;
    }

    // 4. Ngày trả phải lớn hơn ngày nhận
    if (new Date(detailEndDate) <= new Date(detailStartDate)) {
      showModalError('Ngày trả phải lớn hơn ngày nhận');
      return;
    }

    // 5. Số lượng thuê có hợp lệ không
    if (!detailQuantity || detailQuantity <= 0) {
      showModalError('Số lượng thuê không hợp lệ');
      return;
    }

    // 6. Mẫu thiết bị có đang hoạt động không (Giả định tất cả trong list đang hoạt động)
    
    // 7. Check if model is always unavailable
    if (selectedModel.isAlwaysUnavailable) {
      setCheckResult({
        status: 'unavailable',
        qty: 0,
        message: 'Mẫu thiết bị không đủ số lượng khả dụng trong thời gian đã chọn.'
      });
      showModalError('Mẫu thiết bị không đủ số lượng khả dụng trong thời gian đã chọn');
      return;
    }

    // 8. Check if requested qty exceeds safety stock limit
    const availableQty = selectedModel.availableQuantity ?? 10;
    if (detailQuantity > availableQty) {
      setCheckResult({
        status: 'unavailable',
        qty: availableQty,
        message: 'Mẫu thiết bị không đủ số lượng khả dụng trong thời gian đã chọn.'
      });
      showModalError('Mẫu thiết bị không đủ số lượng khả dụng trong thời gian đã chọn');
      return;
    }

    // If fully passed
    setCheckResult({
      status: 'available',
      qty: availableQty,
      message: 'Mẫu thiết bị còn khả dụng trong thời gian đã chọn.'
    });
    showModalSuccess('Kiểm tra sẵn sàng thành công! Thiết bị có thể thêm vào giỏ hàng.');
  };

  // -------------------------------------------------------------
  // THÊM VÀO GIỎ HÀNG (ADD TO SHOPPING BAG)
  // -------------------------------------------------------------
  const handlePushToCart = () => {
    setModalFeedback({ error: '', success: '' });

    // 1. Kiểm tra đăng nhập
    if (!user) {
      showModalError('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }

    // 2. Ngày thuê hợp lệ
    if (!detailStartDate || !detailEndDate || new Date(detailEndDate) <= new Date(detailStartDate)) {
      showModalError('Vui lòng chọn ngày thuê hợp lệ');
      return;
    }

    // 3. Đã thực hiện kiểm tra sẵn sàng chưa
    if (!checkResult) {
      showModalError('Vui lòng kiểm tra sẵn sàng trước khi thêm vào giỏ hàng');
      return;
    }

    // 4. Kiểm tra xem kết quả khả dụng có thành công không
    if (checkResult.status !== 'available') {
      showModalError('Mẫu thiết bị không còn khả dụng');
      return;
    }

    // 5. Kiểm tra trùng lặp trong giỏ hàng (Cùng sản phẩm + thời gian thuê)
    const isAlreadyInCart = cartItems.some(item => 
      item.productModel === selectedModel.name && 
      item.startDate === detailStartDate && 
      item.endDate === detailEndDate
    );

    if (isAlreadyInCart) {
      showModalError('Sản phẩm đã có trong giỏ hàng với thời gian thuê này');
      return;
    }

    // 6. Tính số ngày thuê
    const diffTime = Math.abs(new Date(detailEndDate) - new Date(detailStartDate));
    const daysCalc = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 7. Tạo payload tích hợp (bảo toàn cấu trúc gốc + chuẩn hóa schema theo yêu cầu)
    const normalizedPayload = {
      // Platform original keys to avoid UI regression
      equipment: {
        id: selectedModel.id,
        name: selectedModel.name,
        brand: selectedModel.brand?.name || selectedModel.brand,
        category: selectedModel.category?.name || selectedModel.category,
        pricePerDay: selectedModel.dailyPrice || selectedModel.pricePerDay,
        deposit: selectedModel.depositAmount || selectedModel.deposit,
        image: selectedModel.imageUrl || selectedModel.image,
        description: selectedModel.description || selectedModel.descriptionLong
      },
      days: daysCalc,
      
      // JSON Schema specific properties of user prompt
      productModel: selectedModel.name,
      startDate: detailStartDate,
      endDate: detailEndDate,
      quantity: detailQuantity,
      dailyPrice: selectedModel.dailyPrice || selectedModel.pricePerDay,
      depositAmount: selectedModel.depositAmount || selectedModel.deposit
    };

    // Push callback to top App
    if (onAddToCart) {
      onAddToCart(normalizedPayload);
    }

    // Sẵn sàng đóng modal và kích hoạt alert
    handleCloseDetailModal();
    alert('Thêm vào giỏ hàng thành công');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6 text-left font-sans" id="equipments-main-wrapper">
      
      {/* TẬP BREADCRUMB */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
            <span>Trang chủ</span>
            <span>/</span>
            <span className="text-[#00236f] font-black">Mẫu thiết bị</span>
          </div>
          <h2 className="text-lg font-black text-[#00236f] uppercase tracking-wide flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            Mẫu thiết bị
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Chọn máy ảnh, lens và phụ kiện phù hợp cho nhu cầu quay chụp của bạn.
          </p>
        </div>
      </div>

      {/* CẢNH BÁO LỖI NGÀY TRỰC QUAN TRÊN BỘ LỌC CHÍNH */}
      {dateErrorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-fadeIn mb-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{dateErrorMsg}</span>
        </div>
      )}

      {/* BỘ LỌC TÌM KIẾM CHUNG */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4" id="search-filter-panel">
        
        {/* Tìm kiếm từ khóa */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm mẫu máy ảnh, lens, phụ kiện, hãng sản xuất..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-200 focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] focus:outline-none rounded-xl text-xs font-semibold text-slate-800 transition-all"
          />
        </div>

        {/* Lưới bộ lọc: Hãng, Khoảng giá, Trạng thái khả dụng qua ngày thuê */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-slate-100">
          
          {/* Lọc Hãng */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-slate-450 tracking-wider">Hãng sản xuất</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="h-10 px-3 border border-slate-220 bg-white focus:border-[#00236f] focus:outline-none rounded-xl text-xs font-semibold text-slate-705"
            >
              <option value="all">Tất cả hãng</option>
              {brands.filter(b => b !== 'all').map(br => (
                <option key={br} value={br}>{br}</option>
              ))}
            </select>
          </div>

          {/* Lọc Khoảng giá */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-slate-450 tracking-wider">Mức giá thuê / ngày</label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="h-10 px-3 border border-slate-220 bg-white focus:border-[#00236f] focus:outline-none rounded-xl text-xs font-semibold text-slate-705"
            >
              <option value="all">Tất cả mức giá</option>
              <option value="under500">Dưới 500.000đ / ngày</option>
              <option value="500to1000">Từ 500.000đ - 1.000.000đ / ngày</option>
              <option value="above1000">Trên 1.000.000đ / ngày</option>
            </select>
          </div>

          {/* Ngày nhận */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase text-indigo-755 tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              Ngày nhận dự kiến
            </label>
            <input 
              type="date"
              value={mainStartDate}
              min={systemTodayStr}
              onChange={(e) => handleMainDateChange('start', e.target.value)}
              className="h-10 px-3 border border-slate-220 bg-white rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00236f]"
            />
          </div>

          {/* Ngày trả */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase text-indigo-755 tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Ngày trả dự kiến
            </label>
            <input 
              type="date"
              value={mainEndDate}
              min={mainStartDate || systemTodayStr}
              onChange={(e) => handleMainDateChange('end', e.target.value)}
              className="h-10 px-3 border border-slate-220 bg-white rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00236f]"
            />
          </div>

        </div>

        {/* Lọc danh mục dạng Button Pill Tabs */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase text-slate-450 tracking-wider">Thể loại thiết bị</span>
          <div className="flex flex-wrap gap-1.5">
            {CUSTOMER_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all duration-150 border select-none ${
                  selectedCategory === cat.id 
                    ? 'bg-[#00236f] text-white border-[#00236f] shadow-inner' 
                    : 'bg-slate-50 text-slate-600 border-slate-205 hover:bg-slate-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* DANH SÁCH MẪU THIẾT BỊ DẠNG GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <RefreshCw className="w-8 h-8 text-[#00236f] animate-spin mb-4" />
          <p className="text-sm text-slate-500 font-semibold">Đang tải danh sách thiết bị...</p>
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <Info className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm text-slate-850 font-black mb-1">Không tìm thấy mẫu thiết bị phù hợp</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
            Quý khách vui lòng điều chỉnh từ khóa tìm kiếm hoặc đặt lại các bộ lọc.
          </p>
          <button 
            type="button"
            onClick={() => { 
              setSearchQuery(''); 
              setSelectedCategory('all'); 
              setSelectedBrand('all'); 
              setPriceRange('all'); 
              setMainStartDate('');
              setMainEndDate('');
              setDateErrorMsg('');
            }}
            className="mt-4 text-xs text-[#00236f] font-black bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition"
          >
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6" id="models-bento-grid">
          {filteredModels.map((eq) => {
            const availStatus = getAvailabilityStatus(eq, mainStartDate, mainEndDate);
            
            return (
              <div 
                key={eq.id}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden group hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col h-full shadow-xs"
                id={`eq-card-${eq.id}`}
              >
                {/* Visual Image container */}
                <div className="relative aspect-video overflow-hidden bg-slate-50 border-b border-slate-100 flex items-center justify-center">
                  <img 
                    alt={eq.name} 
                    src={eq.imageUrl || eq.image} 
                    className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-105" 
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Badge Trạng thái khả dụng được kiểm soát chặt chẽ */}
                  <div className="absolute top-3 left-3 select-none">
                    {availStatus === 'Chưa chọn ngày thuê' && (
                      <span className="bg-slate-100 text-slate-800 border border-slate-300 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        Chưa chọn ngày thuê
                      </span>
                    )}
                    {availStatus === 'Còn thiết bị' && (
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        Còn thiết bị
                      </span>
                    )}
                    {availStatus === 'Hết thiết bị theo ngày chọn' && (
                      <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        Hết thiết bị theo ngày chọn
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 bg-slate-900/95 text-white px-3 py-1 rounded-xl font-bold text-xs font-mono border border-white/10">
                    {(eq.dailyPrice || eq.pricePerDay || 0).toLocaleString('vi-VN')}đ / ngày
                  </div>
                </div>

                {/* Info block */}
                <div className="p-5 flex flex-col flex-grow text-left space-y-3.5">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#fea619] mb-0.5 block">
                      {eq.brand?.name || eq.brand}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-800 hover:text-[#00236f] transition-all">
                      {eq.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-2">
                    {eq.description || eq.descriptionShort}
                  </p>

                  <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3 text-xs text-slate-700 space-y-1.5 font-semibold">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-450 font-bold">Giá thuê một ngày:</span>
                      <strong className="text-slate-900 font-mono font-black">{(eq.dailyPrice || eq.pricePerDay || 0).toLocaleString('vi-VN')} VNĐ</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-450 font-bold">Tiền đặt cọc tối thiểu:</span>
                      <strong className="text-rose-900 font-mono font-black">{(eq.depositAmount || eq.deposit || 0).toLocaleString('vi-VN')} VNĐ</strong>
                    </div>
                  </div>

                  {/* Nút Xem chi tiết duy nhất nằm ở card */}
                  <button 
                    type="button"
                    onClick={() => handleOpenDetailModal(eq)}
                    className="mt-auto w-full py-3 bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] text-xs font-black uppercase rounded-2xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 shrink-0" />
                    Xem chi tiết
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================= */}
      {/* DRAWER / MODAL CHI TIẾT MẪU THIẾT BỊ (THEO ĐẶC TẢ SÁT SAO) */}
      {/* ============================================================= */}
      <AnimatePresence>
        {selectedModel && (
          <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
            
            {/* Backdrop cover overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDetailModal}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
            />

            {/* Modal box Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-xs text-slate-800 font-semibold"
            >
              
              {/* Header section of modal */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-150 flex justify-between items-center sticky top-0 z-[10] shrink-0">
                <div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1">
                    <span>{selectedModel.brand?.name || selectedModel.brand}</span>
                    <span>•</span>
                    <span className="text-[#00236f]">
                      {selectedModel.category?.name || (selectedModel.category === 'camera' ? 'Body máy ảnh' : selectedModel.category === 'lens' ? 'Ống kính' : 'Phụ kiện')}
                    </span>
                  </div>
                  <h3 className="font-black text-[#00236f] text-base uppercase mt-0.5">{selectedModel.name}</h3>
                </div>
                <button 
                  onClick={handleCloseDetailModal}
                  className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-full transition"
                  title="Đóng chi tiết"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Contents areas */}
              <div ref={modalScrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Error & Success Notice Feedback */}
                {modalFeedback.error && (
                  <div className="p-3.5 bg-rose-50 border border-rose-250 text-[#ba1a1a] font-bold rounded-xl flex items-center gap-2 animate-fadeIn select-none shadow-xs">
                    <AlertTriangle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
                    <span>{modalFeedback.error}</span>
                  </div>
                )}
                {modalFeedback.success && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-250 text-emerald-900 font-bold rounded-xl flex items-center gap-2 animate-fadeIn select-none shadow-xs">
                    <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    <span>{modalFeedback.success}</span>
                  </div>
                )}

                {/* PHẦN A. THÔNG TIN MẪU THIẾT BỊ */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                  
                  {/* Aspect ratio frame for product image */}
                  <div className="sm:col-span-5 bg-slate-50 border border-slate-150 p-2.5 rounded-2xl">
                    <img 
                      src={selectedModel.imageUrl || selectedModel.image} 
                      alt={selectedModel.name} 
                      className="w-full aspect-square object-cover rounded-xl shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Specs information column */}
                  <div className="sm:col-span-7 space-y-3 text-left">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">A. Thông tin mẫu thiết bị</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                      {selectedModel.description || selectedModel.descriptionLong}
                    </p>

                    <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-150 rounded-2xl p-3.5 mt-2">
                      <div>
                        <span className="text-[9.5px] uppercase font-bold text-slate-400 block mb-0.5">Giá thuê thiết bị</span>
                        <strong className="text-sm font-black text-[#00236f] font-mono leading-none">
                          {(selectedModel.dailyPrice || selectedModel.pricePerDay || 0).toLocaleString('vi-VN')} VNĐ / ngày
                        </strong>
                      </div>
                      <div>
                        <span className="text-[9.5px] uppercase font-bold text-slate-400 block mb-0.5">Tiền đặt cọc</span>
                        <strong className="text-sm font-black text-rose-800 font-mono leading-none">
                          {(selectedModel.depositAmount || selectedModel.deposit || 0).toLocaleString('vi-VN')} VNĐ
                        </strong>
                      </div>
                    </div>
                  </div>

                </div>

                {/* PHẦN B. BỘ ĐI KÈM TRONG CƠ SỞ DỮ LIỆU */}
                <div className="space-y-2.5 text-left bg-indigo-50/20 border border-indigo-100 p-4.5 rounded-2xl">
                  <div className="flex items-center gap-1.5 border-b border-indigo-100/50 pb-1.5 mb-1 select-none">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-[11px] font-black text-indigo-950 uppercase tracking-wider">
                      B. Bộ đi kèm cố định
                    </h4>
                  </div>
                  
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-[10.5px] text-left border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-3.5 py-2 font-black text-[#00236f] uppercase">Thành phần</th>
                          <th className="px-3.5 py-2 font-black text-slate-500 uppercase">Loại quản lý</th>
                          <th className="px-3.5 py-2 font-black text-slate-500 uppercase text-center">Số lượng</th>
                          <th className="px-3.5 py-2 font-black text-slate-500 uppercase text-center">Bắt buộc</th>
                          <th className="px-3.5 py-2 font-black text-slate-500 uppercase">Ghi chú</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {selectedModel.bundle.map((item, idx) => (
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
                <div className="bg-slate-50 border border-slate-150 p-4.5 rounded-2xl space-y-4 text-left">
                  <h4 className="text-[11px] font-black text-[#00236f] uppercase tracking-wider block border-b border-slate-200 pb-1 flex items-center gap-1">
                    <span className="w-1 h-3.5 bg-[#00236f] inline-block rounded-xs"></span>
                    C. Cấu hình thời hạn thuê & Số lượng thuê
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Ngày nhận */}
                    <div className="flex flex-col gap-1 text-xs">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#00236f]" />
                        Ngày nhận thiết bị: <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={detailStartDate}
                        min={systemTodayStr}
                        onChange={(e) => {
                          setDetailStartDate(e.target.value);
                          setCheckResult(null); // Reset check to force re-run
                          setModalFeedback({ success: '', error: '' });
                        }}
                        className="h-10 px-3 bg-white border border-slate-200 focus:border-[#00236f] focus:outline-none rounded-xl text-xs font-semibold text-slate-800"
                      />
                    </div>

                    {/* Ngày trả */}
                    <div className="flex flex-col gap-1 text-xs">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Ngày trả thiết bị: <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={detailEndDate}
                        min={detailStartDate || systemTodayStr}
                        onChange={(e) => {
                          setDetailEndDate(e.target.value);
                          setCheckResult(null); // Reset check to force re-run
                          setModalFeedback({ success: '', error: '' });
                        }}
                        className="h-10 px-3 bg-white border border-slate-200 focus:border-[#00236f] focus:outline-none rounded-xl text-xs font-semibold text-slate-800"
                      />
                    </div>

                  </div>

                  {/* Cấu hình số lượng thuê */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                    
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase font-extrabold text-slate-500 block">Số lượng thiết bị:</span>
                      <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-xs">
                        <button
                          type="button"
                          onClick={() => { 
                            setDetailQuantity(prev => Math.max(1, prev - 1)); 
                            setCheckResult(null); 
                            setModalFeedback({ success: '', error: '' });
                          }}
                          className="w-8 h-8 flex items-center justify-center font-black text-slate-450 hover:text-[#00236f] transition select-none"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-black text-[#00236f] select-none">
                          {detailQuantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => { 
                            setDetailQuantity(prev => prev + 1); 
                            setCheckResult(null); 
                            setModalFeedback({ success: '', error: '' });
                          }}
                          className="w-8 h-8 flex items-center justify-center font-black text-slate-450 hover:text-[#00236f] transition select-none"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Nút Kiểm tra sẵn sàng nằm ngay trong khu vực form/modal */}
                    <button
                      type="button"
                      onClick={handleVerifyReadiness}
                      className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-805 text-[11px] font-black uppercase rounded-xl border border-slate-300 transition shrink-0 cursor-pointer"
                    >
                      Kiểm tra sẵn sàng
                    </button>

                  </div>

                </div>

                {/* PHẦN D. KẾT QUẢ KIỂM TRA SẴN SÀNG */}
                {checkResult && (
                  <div className="p-4 rounded-2xl border text-left space-y-1.5 transition-all animate-fadeIn" id="readiness-check-result">
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 block">D. Kết quả kiểm tra sẵn sàng</span>
                    
                    {checkResult.status === 'available' ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold">
                          <Check className="w-4 h-4 bg-emerald-500 text-white rounded-full p-0.5" />
                          <span>Trạng thái: Còn thiết bị</span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                          Số lượng trống trong kho: <strong className="text-slate-900 font-mono font-black">{checkResult.qty} máy</strong>. Mẫu thiết bị còn khả dụng trong thời gian đã chọn.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-rose-850 font-extrabold">
                          <AlertTriangle className="w-4 h-4 bg-rose-650 text-white rounded-full p-0.5 shrink-0" />
                          <span>Trạng thái: Hết thiết bị theo ngày chọn</span>
                        </div>
                        <p className="text-[11px] text-rose-950 font-bold leading-relaxed">
                          Số lượng khả dụng: <strong className="text-rose-900 font-mono font-black">0 máy</strong>. {checkResult.message}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* THIẾT BỊ LIÊN QUAN */}
                <div className="pt-5 border-t border-slate-155 text-left space-y-3.5" id="related-equipments-section-modal">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-black text-[#00236f] uppercase tracking-wider block">Thiết bị liên quan</h4>
                    <span className="text-[10px] text-slate-450 font-semibold mt-0.5 block">Các mẫu thiết bị khác có thể phù hợp với nhu cầu thuê của bạn.</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getRelatedModelsFor(selectedModel, detailStartDate, detailEndDate, allModels).map((item) => {
                      const itemStatus = getAvailabilityStatus(item, detailStartDate, detailEndDate);
                      return (
                        <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col space-y-3 hover:border-indigo-200 transition-all shadow-xs">
                          {/* Item header */}
                          <div className="flex gap-3">
                            <img 
                              src={item.imageUrl || item.image} 
                              alt={item.name} 
                              className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0">
                              <span className="text-[8px] font-black uppercase text-[#fea619] block leading-none">{item.brand?.name || item.brand}</span>
                              <h5 className="text-[11px] font-bold text-slate-800 tracking-tight truncate mt-1">{item.name}</h5>
                              <p className="text-[9.5px] text-slate-450 truncate font-semibold">{item.description || item.descriptionShort}</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[10px] border-t border-slate-150 pt-2">
                            <div className="flex flex-col">
                              <strong className="text-slate-800 font-mono font-extrabold">{(item.dailyPrice || item.pricePerDay || 0).toLocaleString('vi-VN')} VNĐ / ngày</strong>
                              <span className="text-[8.5px] text-slate-400">Cọc: {(item.depositAmount || item.deposit || 0).toLocaleString('vi-VN')}đ</span>
                            </div>
                            <div>
                              {itemStatus === 'Chưa chọn ngày thuê' && (
                                <span className="bg-slate-100 text-slate-650 border border-slate-250 text-[8.5px] font-extrabold px-2 py-0.5 rounded-lg uppercase tracking-wider">
                                  Chưa chọn ngày thuê
                                </span>
                              )}
                              {itemStatus === 'Còn thiết bị' && (
                                <span className="bg-emerald-100 text-emerald-850 border border-emerald-250 text-[8.5px] font-extrabold px-2 py-0.5 rounded-lg uppercase tracking-wider">
                                  Còn thiết bị
                                </span>
                              )}
                              {itemStatus === 'Hết thiết bị theo ngày chọn' && (
                                <span className="bg-rose-100 text-rose-850 border border-rose-250 text-[8.5px] font-extrabold px-2 py-0.5 rounded-lg uppercase tracking-wider">
                                  Hết thiết bị theo ngày chọn
                                </span>
                              )}
                            </div>
                          </div>

                          <button 
                            type="button"
                            onClick={() => {
                              setSelectedModel(item);
                              setCheckResult(null);
                              setModalFeedback({ success: '', error: '' });
                              setDetailQuantity(1);
                              if (modalScrollRef.current) {
                                modalScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }}
                            className="w-full py-2 bg-white text-[#00236f] hover:bg-[#00236f] hover:text-white border border-[#00236f] text-[10.5px] font-bold uppercase rounded-xl transition text-center cursor-pointer"
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* PHẦN E. KHU VỰC THAO TÁC / BUTTON BOTTOM */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                
                {/* Tính toán hiển thị giá trị dòng tiền tạm tính */}
                <div className="text-left w-full sm:w-auto">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Ước lượng đặt cọc và phí thuê:</span>
                  <p className="text-xs font-bold text-slate-500">
                    Thuê trong khoảng ngày: <span className="text-slate-800 font-black">
                      {detailStartDate && detailEndDate && (new Date(detailEndDate) > new Date(detailStartDate))
                        ? `${Math.ceil(Math.abs(new Date(detailEndDate) - new Date(detailStartDate)) / (1000 * 60 * 60 * 24))} ngày`
                        : 'Chưa đủ điều kiện tính ngày'
                      }
                    </span>
                  </p>
                </div>

                <div className="flex gap-2.5 w-full sm:w-auto justify-end select-none">
                  
                  {/* Nút ĐÓNG */}
                  <button
                    type="button"
                    onClick={handleCloseDetailModal}
                    className="px-5 py-3 bg-slate-200 hover:bg-slate-350 text-slate-700 font-black uppercase rounded-2xl transition cursor-pointer"
                  >
                    Đóng
                  </button>

                  {/* Nút THÊM VÀO GIỎ HÀNG */}
                  <button
                    type="button"
                    onClick={handlePushToCart}
                    disabled={!checkResult || checkResult.status !== 'available'}
                    className={`px-6 py-3 font-black uppercase rounded-2xl transition flex items-center gap-2 ${
                      checkResult && checkResult.status === 'available'
                        ? 'bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] cursor-pointer'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-55'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Thêm vào giỏ hàng
                  </button>

                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
