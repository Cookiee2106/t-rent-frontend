import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Info, SlidersHorizontal, ShieldCheck, ShoppingBag } from 'lucide-react';
import { EQUIPMENTS, CATEGORIES } from '../../data';

export default function Equipments({
  selectedCategory,
  setSelectedCategory,
  onOpenEquipmentDetail
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState('all'); // 'all', 'under500', '500to1000', 'above1000'

  // Lấy danh sách hãng độc nhất
  const brands = ['all', ...new Set(EQUIPMENTS.map(eq => eq.brand))];

  // Lọc thiết bị
  const filteredEquipments = EQUIPMENTS.filter((eq) => {
    // Lọc danh mục
    const matchesCategory = selectedCategory === 'all' || eq.category === selectedCategory;
    
    // Lọc từ khóa (tên, hãng, mô tả)
    const matchesSearch = eq.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          eq.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (eq.description && eq.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Lọc hãng
    const matchesBrand = selectedBrand === 'all' || eq.brand.toLowerCase() === selectedBrand.toLowerCase();

    // Lọc khoảng giá
    let matchesPrice = true;
    if (priceRange === 'under500') {
      matchesPrice = eq.pricePerDay < 500000;
    } else if (priceRange === '500to1000') {
      matchesPrice = eq.pricePerDay >= 500000 && eq.pricePerDay <= 1000000;
    } else if (priceRange === 'above1000') {
      matchesPrice = eq.pricePerDay > 1000000;
    }

    return matchesCategory && matchesSearch && matchesBrand && matchesPrice;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10" id="equipment-list-screen">
      
      {/* Tiêu đề */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-black text-[#00236f] mb-1">Mẫu Thiết Bị Cho Thuê</h1>
        <p className="text-xs text-slate-500 font-semibold">
          Tìm thấy <span className="font-black text-[#00236f] text-sm">{filteredEquipments.length}</span> mẫu thiết bị phù hợp, sẵn sàng phục vụ nhu cầu của bạn.
        </p>
      </div>

      {/* Control Panel: Bộ Lọc và Tìm Kiếm */}
      <div className="bg-white border border-[#c5c5d3] rounded-2xl p-5 mb-8 shadow-sm space-y-4">
        
        {/* Hàng 1: Tìm kiếm */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm máy ảnh, ống kính, hãng..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-200 focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] focus:outline-none rounded-xl text-xs font-semibold text-slate-800 transition-all font-sans"
          />
        </div>

        {/* Hàng 2: Bộ lọc (Hãng, Khoảng giá, Danh mục) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          
          {/* Lọc Hãng */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Hãng thiết bị</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="h-10 px-3 border border-slate-200 focus:border-[#00236f] focus:outline-none rounded-xl text-xs font-semibold bg-white text-slate-700"
            >
              <option value="all">Tất cả hãng</option>
              {brands.filter(b => b !== 'all').map(br => (
                <option key={br} value={br}>{br}</option>
              ))}
            </select>
          </div>

          {/* Lọc Khoảng giá */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Khoảng giá thuê / ngày</span>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="h-10 px-3 border border-slate-200 focus:border-[#00236f] focus:outline-none rounded-xl text-xs font-semibold bg-white text-slate-700"
            >
              <option value="all">Tất cả mức giá</option>
              <option value="under500">Dưới 500.000đ / ngày</option>
              <option value="500to1000">Từ 500.000đ - 1.000.000đ / ngày</option>
              <option value="above1000">Trên 1.000.000đ / ngày</option>
            </select>
          </div>

        </div>

        {/* Lọc Danh mục */}
        <div className="pt-3 border-t border-slate-100">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-2">Thể loại thiết bị</span>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all duration-150 select-none border ${
                  selectedCategory === cat.id 
                    ? 'bg-[#00236f] text-white border-[#00236f] shadow-inner' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Hiển thị danh sách */}
      {filteredEquipments.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#c5c5d3] rounded-2xl shadow-sm">
          <Info className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm text-slate-800 font-bold mb-1">Không tìm thấy mẫu thiết bị phù hợp</p>
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
            }}
            className="mt-4 text-xs text-[#00236f] hover:underline bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl font-bold transition"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEquipments.map((eq) => (
            <div 
              key={eq.id}
              className="bg-white border border-[#c5c5d3] rounded-2xl overflow-hidden group hover:shadow-md transition-all duration-200 flex flex-col h-full shadow-sm"
              id={`eq-card-${eq.id}`}
            >
              <div className="relative aspect-square overflow-hidden bg-slate-50 border-b border-slate-100 flex items-center justify-center">
                <img 
                  alt={eq.name} 
                  src={eq.image} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" 
                />
                <span className="absolute top-3 left-3 bg-emerald-50 border border-emerald-250 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  Khả dụng
                </span>
                <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white px-2.5 py-1 rounded-lg font-black text-xs font-mono">
                  {eq.pricePerDay.toLocaleString('vi-VN')}đ/ngày
                </div>
              </div>

              <div className="p-4 flex flex-col flex-grow text-left">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                  {eq.brand}
                </span>
                
                <h3 className="text-sm font-bold text-slate-800 line-clamp-1 leading-snug mb-2 group-hover:text-[#00236f] transition-all">
                  {eq.name}
                </h3>
                
                <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-600 mb-3 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold">Giá thuê:</span>
                    <strong className="text-slate-800">{eq.pricePerDay.toLocaleString('vi-VN')}đ / ngày</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold">Yêu cầu cọc:</span>
                    <strong className="text-slate-800">{eq.deposit.toLocaleString('vi-VN')}đ</strong>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => onOpenEquipmentDetail(eq)}
                  className="mt-auto w-full py-2.5 bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] text-xs font-bold rounded-xl transition-all duration-150 flex items-center justify-center gap-1.5"
                >
                  
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trust Badges */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-100/50 border border-slate-200 rounded-2xl p-6 text-left">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#00236f] text-[#fea619] rounded-xl flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-[#00236f] uppercase tracking-wide">Thiết Bị Chính Hãng</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Tất cả thiết bị tại showroom T-Rent đều được nhập chính ngạch, bảo trì sensor và ống chụp kỹ lưỡng.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#00236f] text-[#fea619] rounded-xl flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-[#00236f] uppercase tracking-wide">Quy Trình Chuẩn Xác</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Sẵn sàng hỗ trợ kỹ thuật và kiểm thử máy chụp hình tận nơi cho khách thuê trước khi ra khỏi showroom.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#00236f] text-[#fea619] rounded-xl flex items-center justify-center shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-[#00236f] uppercase tracking-wide">Hỗ Trợ Tuyệt Đối</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Nạp hồ sơ bảo đảm an ninh, xác thực nhanh chóng để được hưởng các đặc quyền chiết khấu không ký quỹ.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
