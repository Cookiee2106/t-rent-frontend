import React, { useState, useEffect } from 'react';
import orderApi from '../../api/orderApi';
import { 
  History, 
  Calendar, 
  MapPin, 
  User, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  SlidersHorizontal,
  Info,
  X,
  Package,
  Save,
  CheckCheck,
  ChevronRight,
  Boxes,
  Lock,
  Compass
} from 'lucide-react';

// Mock fallback used if API response is empty during development
const SONY_LENS_INVENTORY = [
  {
    code: 'LNS-2470-004',
    serial: '44109283',
    condition: 'Mới 98%, thấu kính trong suốt không bám bụi',
    location: 'Kho phụ kiện - Khu C - Kệ 01 - Tầng 02 - Khay 02',
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=200' 
  }
];

export default function PrepareEquipment({ orderCode = '#ORD-5001', onGoBack }) {
  const [selectedLens, setSelectedLens] = useState(null); // Initially null
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tripodQty, setTripodQty] = useState(1);
  const [showToast, setShowToast] = useState(false);
  
  const [availableAssets, setAvailableAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoadingAssets(true);
        const id = orderCode.replace('#', '');
        const res = await orderApi.admin.getAvailableAssets(id);
        const rawData = res.data?.data || res.data;
        const assetsList = rawData?.tai_san_san_sang || [];
        setAvailableAssets(assetsList.length > 0 ? assetsList : SONY_LENS_INVENTORY); // Fallback to mock
      } catch (err) {
        console.error("Lỗi khi tải tài sản sẵn sàng", err);
        setAvailableAssets(SONY_LENS_INVENTORY);
      } finally {
        setLoadingAssets(false);
      }
    };
    fetchAssets();
  }, [orderCode]);

  // Sony Body item state
  const [bodyAsset, setBodyAsset] = useState({
    code: 'A7IV-001',
    serial: '88234190',
    location: 'Kho chính / Kệ 02 / Ô A-12'
  });

  const handleOpenSelectionModal = () => {
    setIsModalOpen(true);
  };

  const handleSelectLensAsset = (asset) => {
    setSelectedLens({
      code: asset.code,
      serial: asset.serial,
      location: asset.location.split(' - ').slice(0, 3).join(' / ')
    });
    setIsModalOpen(false);
  };

  const handleSavePreparation = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onGoBack(); // Return to orders list
    }, 2800);
  };

  const progressCount = (selectedLens ? 1 : 0) + (bodyAsset ? 1 : 0) + (tripodQty === 1 ? 1 : 0);
  const totalCount = 3;
  const isFinished = progressCount === totalCount;

  return (
    <div className="space-y-6 pb-24 relative font-sans">
      
      {/* Toast Success */}
      {showToast && (
        <div className="fixed top-24 right-4 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl z-[100] flex items-center gap-3 animate-slide-in">
          <CheckCheck className="w-5 h-5 text-white" />
          <div>
            <p className="font-bold text-sm">Chuẩn bị hoàn thành!</p>
            <p className="text-xs text-emerald-100 mt-0.5">Hồ sơ đã chuyển sang trạng thái Sẵn Sàng bàn giao.</p>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-xs text-slate-400 font-medium">
        <button onClick={onGoBack} className="hover:text-blue-900 transition-colors">Đơn đã giữ chỗ</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-bold text-[#00236f]">Chuẩn bị thiết bị {orderCode}</span>
      </nav>

      {/* Main Header title bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Chuẩn bị thiết bị cho đơn {orderCode}</h2>
          <div className="flex items-center gap-3 mt-1.5">
            <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${isFinished ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-blue-100 text-[#00236f] border border-blue-200'}`}>
              {isFinished ? 'Sẵn sàng bàn giao' : 'Chờ chuẩn bị'}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
              Cập nhật 5 phút trước
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Info Cards representing Mockup Step 1 */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Order Details box */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-[#00236f]">
                <Calendar className="w-5 h-5 text-[#00236f]" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-800">Thông tin đơn thuê</h3>
            </div>
            
            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Ngày nhận máy</span>
                <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  08:30 - Thứ Hai, 15/10/2023
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Ngày hoàn trả</span>
                <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  20:00 - Thứ Năm, 18/10/2023
                </div>
              </div>

              <div className="flex flex-col pt-3 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Địa điểm giao nhận</span>
                <div className="flex items-start gap-1.5 text-slate-600 mt-0.5 leading-relaxed text-xs">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>123 Đường Ba Tháng Hai, Phường 12, Quận 10, TP. Hồ Chí Minh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer profile index verification */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                <User className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-800">Thông tin khách hàng</h3>
            </div>

            <div className="space-y-4 font-sans">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 border border-slate-200 text-[#00236f] font-serif font-black text-sm rounded-full flex items-center justify-center">
                    NV
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Nguyễn Văn Bình</h4>
                    <p className="text-xs text-slate-450 font-mono mt-0.5">0908 123 456</p>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 bg-emerald-100 border border-emerald-250 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  TIN CẬY
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Giấy tờ định danh (CCCD)</span>
                <span className="text-emerald-700">Đã duyệt</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Active Equipment lists matching physical assets */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-sm font-semibold">
              <span className="text-[#00236f] font-bold font-serif">Danh sách thiết bị (3 sản phẩm)</span>
              <span className="text-xs text-slate-400 italic font-normal">Xác minh mã sê-ri chính xác trước khi xuất kho</span>
            </div>

            <div className="divide-y divide-slate-100">
              
              {/* Product item 1: Sony Alpha A7 IV (Already matched pre-filled) */}
              <div className="p-6 flex flex-col md:flex-row gap-6 hover:bg-slate-50/20 transition-colors">
                <div className="w-28 h-28 bg-slate-100 rounded-lg overflow-hidden border border-slate-200/60 shrink-0 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200" 
                    alt="Sony Alpha IV"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-base text-slate-900 leading-tight">Sony Alpha A7 IV</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        <span className="font-bold text-[#00236f] mr-1.5">Bộ đi kèm:</span>
                        Pin NP-FZ100 (2x), Thẻ nhớ 128GB, Túi đựng chuyên nghiệp
                      </p>
                    </div>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-blue-50 text-[#00236f] border border-blue-100">Thân máy</span>
                  </div>

                  <div className="pt-1.5">
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="text-xs flex-grow">
                        <p className="font-bold text-slate-800">Body Sony A7IV - SN: {bodyAsset.serial}</p>
                        <p className="text-slate-400 mt-0.5">{bodyAsset.location}</p>
                      </div>
                      <button 
                        onClick={() => alert('Mã thân máy này đã được liên kết cố định với kho ưu tiên.')} 
                        className="text-xs text-[#00236f] font-bold hover:underline"
                      >
                        Khóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product item 2: Sony Lens 24-70 GM II */}
              <div className="p-6 flex flex-col md:flex-row gap-6 hover:bg-slate-50/20 transition-colors">
                <div className="w-28 h-28 bg-slate-100 rounded-lg overflow-hidden border border-slate-200/60 shrink-0 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=200" 
                    alt="Sony Lens"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-base text-slate-900 leading-tight">Lens Sony 24-70mm f/2.8 GM II</h4>
                      <p className="text-xs text-slate-500 mt-1">Ống kính zoom đa dụng khẩu độ cao, bao gồm hood và nắp đậy trước sau.</p>
                    </div>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100">Ống kính</span>
                  </div>

                  <div className="pt-1">
                    {selectedLens ? (
                      <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div className="text-xs flex-grow">
                          <p className="font-bold text-slate-800">Lens Sony 24-70 GM II - SN: {selectedLens.serial}</p>
                          <p className="text-slate-450 mt-0.5">{selectedLens.location}</p>
                        </div>
                        <button 
                          onClick={handleOpenSelectionModal}
                          className="text-xs text-[#00236f] font-bold hover:underline ml-auto"
                        >
                          Thay đổi
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-150">
                        <div className="flex items-center gap-2 text-xs text-red-650">
                          <Info className="w-4 h-4 text-red-500" />
                          <span className="font-semibold">Chưa chọn mã tài sản sê-ri cụ thể</span>
                        </div>
                        <button 
                          onClick={handleOpenSelectionModal}
                          className="px-4 py-1.5 bg-[#00236f] hover:bg-blue-950 text-white rounded-lg text-xs font-bold transition-all active:scale-95"
                        >
                          Chọn tài sản
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product item 3: Manfrotto Tripod */}
              <div className="p-6 flex flex-col md:flex-row gap-6 hover:bg-slate-50/20 transition-colors">
                <div className="w-28 h-28 bg-slate-100 rounded-lg overflow-hidden border border-slate-200/60 shrink-0 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=200" 
                    alt="Manfrotto Tripod"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-base text-slate-900 leading-tight">Chân máy Manfrotto</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Chân máy carbon chuyên nghiệp chịu tải lớn kèm túi đeo thời trang.</p>
                    </div>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-slate-100 text-slate-700">Phụ kiện</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1.5">
                    <div className="max-w-[150px] w-full">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Số lượng xác nhận</span>
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <input 
                          type="number" 
                          min="1" 
                          max="1" 
                          value={tripodQty}
                          onChange={(e) => setTripodQty(Number(e.target.value))}
                          className="w-full border-none bg-transparent text-center font-bold text-sm text-slate-800 py-1"
                        />
                        <span className="px-2.5 py-1 text-xs font-semibold text-slate-400 border-l bg-slate-100">/ 1</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded-lg flex items-center gap-2 text-xs">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold">Khớp số lượng xuất</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Persistent Sticky Bottom Progress Saving Footer */}
      <footer className="fixed bottom-0 right-0 left-64 bg-white border-t border-slate-200 px-8 py-4 flex items-center justify-between z-40 shadow-[0_-5px_15px_rgba(0,0,0,0.06)] font-sans">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tiến độ chuẩn bị vật tư</span>
            <div className="flex items-center gap-3 mt-1">
              <div className="w-40 sm:w-56 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-150">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${(progressCount / totalCount) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-800 font-mono">{progressCount} / {totalCount} Thiết bị</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onGoBack} 
            className="px-5 py-2 hover:bg-slate-100 text-slate-500 font-bold text-xs rounded-lg transition-all"
          >
            Hủy bỏ
          </button>
          
          <button 
            type="button"
            onClick={handleSavePreparation}
            className={`px-8 py-2.5 text-xs font-bold rounded-lg flex items-center gap-2 shadow-sm transition-all active:scale-95 ${
              isFinished 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            {isFinished ? (
              <>
                <CheckCheck className="w-4 h-4" />
                Hoàn tất chuẩn bị
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Lưu chuẩn bị thiết bị
              </>
            )}
          </button>
        </div>
      </footer>

      {/* Asset Identification lookup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col scale-100 transition-all max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-[#00236f]" />
                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-900">Chọn tài sản: Sony FE 24-70mm f/2.8 GM  II</h3>
                  <p className="text-xs text-slate-450">Vui lòng đối chiếu số sê-ri vật lý trước khi bàn giao</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 transition-all text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal List Body */}
            <div className="p-6 overflow-y-auto space-y-4 bg-slate-100/40">
              {loadingAssets ? (
                <div className="text-center py-4 font-bold text-slate-500">Đang tải danh sách tài sản...</div>
              ) : (
                availableAssets.map((asset, index) => (
                  <div 
                    key={asset.code || asset.id || index}
                    className="bg-white border border-slate-200 rounded-xl p-4 flex gap-5 hover:border-[#00236f]/40 hover:shadow-sm transition-all"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden border bg-slate-50 shrink-0">
                      <img 
                        src={asset.image || 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=200'} 
                        alt={asset.code || 'Asset'} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    <div className="flex-grow space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-slate-900">{asset.ten_tai_san || asset.name || 'Thiết bị'}</h4>
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full">
                          Sẵn sàng
                        </span>
                      </div>
  
                      <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-xs text-slate-500">
                        <p><span className="font-semibold text-slate-400 mr-1.5">Mã tài sản:</span> <span className="font-bold text-[#00236f]">{asset.ma_tai_san || asset.code || asset.assetCode}</span></p>
                        <p><span className="font-semibold text-slate-400 mr-1.5">Mã sê-ri:</span> <span className="font-mono">{asset.so_serial || asset.serial || asset.serialNumber}</span></p>
                        <p className="col-span-2"><span className="font-semibold text-slate-400 mr-1.5">Tình trạng:</span>{asset.ghi_chu_tinh_trang || asset.condition || 'Tốt'}</p>
                        <p className="col-span-2 flex items-center gap-1 text-[11px] text-slate-450 mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {asset.location || 'Kho tiêu chuẩn'}
                        </p>
                      </div>
                    </div>
  
                    <div className="flex items-center shrink-0 pl-4">
                      <button 
                        onClick={() => handleSelectLensAsset({
                          code: asset.ma_tai_san || asset.code || asset.assetCode,
                          serial: asset.so_serial || asset.serial || asset.serialNumber,
                          location: asset.location || 'Kho tiêu chuẩn'
                        })}
                        className="px-5 py-2 bg-[#00236f] hover:bg-blue-900 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                      >
                        Chọn
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-4 py-2 hover:bg-slate-150 text-slate-600 rounded-lg text-xs font-semibold"
              >
                Hủy
              </button>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
