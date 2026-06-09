import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Info, SlidersHorizontal, ArrowUpDown, ShieldCheck, Heart, ShoppingBag } from 'lucide-react';
import { EQUIPMENTS, CATEGORIES } from '../../data';

export default function Equipments({
  selectedCategory,
  setSelectedCategory,
  onOpenEquipmentDetail
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');

  const filteredEquipments = EQUIPMENTS.filter((eq) => {
    const matchesCategory = selectedCategory === 'all' || eq.category === selectedCategory;
    const matchesSearch = eq.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          eq.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (eq.description && eq.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort equipments
  const sortedEquipments = [...filteredEquipments].sort((a, b) => {
    if (sortOption === 'priceAsc') return a.pricePerDay - b.pricePerDay;
    if (sortOption === 'priceDesc') return b.pricePerDay - a.pricePerDay;
    if (sortOption === 'depositDesc') return b.deposit - a.deposit;
    return 0; // default
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      
      {/* Title & Stats */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#00236f] mb-2 font-display">Danh mục thiết bị</h1>
        <p className="text-sm text-[#444651]">
          Tìm thấy <span className="font-bold text-[#00236f]">{sortedEquipments.length}</span> thiết bị phù hợp trong hệ thống.
        </p>
      </div>

      {/* Control Panel: Search, Category Filter Pill Tabs & Sort */}
      <div className="bg-white border border-[#c5c5d3] rounded-xl p-5 mb-8 shadow-sm space-y-5">
        
        {/* Search Input and Sort Selection */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#757682]" />
            <input 
              type="text" 
              placeholder="Tìm kiếm máy ảnh, ống kính, gimbal, đèn quay chụp, hiệu Sony, Canon..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-12 pr-4 bg-gray-50 border border-[#c5c5d3] focus:border-[#00236f] focus:outline-none rounded-lg text-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-[#757682]" />
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="h-11 px-3 border border-[#c5c5d3] focus:border-[#00236f] focus:outline-none rounded-lg text-xs font-semibold bg-white"
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="priceAsc">Giá thuê: Thấp đến Cao</option>
              <option value="priceDesc">Giá thuê: Cao đến Thấp</option>
              <option value="depositDesc">Tiền cọc: Cao đến Thấp</option>
            </select>
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="border-t border-gray-100 pt-4">
          <label className="text-xs font-bold uppercase tracking-wider text-[#444651] block mb-3">
            Lọc theo thể loại
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 select-none ${
                  selectedCategory === cat.id 
                    ? 'bg-[#00236f] text-white shadow-sm ring-2 ring-[#00236f]/10' 
                    : 'bg-gray-100 text-[#444651] hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Equipment List Grid */}
      {sortedEquipments.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#c5c5d3] rounded-xl shadow-sm">
          <Info className="w-12 h-12 text-[#757682] mx-auto mb-4" />
          <p className="text-base text-[#111827] font-semibold mb-1">Không tìm thấy thiết bị nào</p>
          <p className="text-xs text-[#444651] max-w-sm mx-auto">
            Vui lòng thay đổi từ khóa tìm kiếm hoặc chọn một danh mục thiết bị khác để tìm kiếm.
          </p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="mt-5 text-xs text-white bg-[#00236f] px-4 py-2 rounded-lg font-bold"
          >
            Reset bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedEquipments.map((eq) => (
            <motion.div 
              layout
              whileHover={{ y: -6 }}
              key={eq.id}
              className="bg-white border border-[#c5c5d3] rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
                <img 
                  alt={eq.name} 
                  src={eq.image} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Available Badge */}
                <span className="absolute top-3 left-3 bg-green-100 border border-green-300 text-green-800 text-[10px] font-extrabold px-2 py-1 rounded uppercase tracking-wider">
                  Còn sẵn
                </span>

                {/* Pricing Overlay Badge */}
                <div className="absolute bottom-3 right-3 bg-[#00236f]/95 shadow-md text-white px-3 py-1.5 rounded font-extrabold text-xs">
                  {eq.pricePerDay.toLocaleString('vi-VN')}đ / ngày
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#757682] mb-1">
                  {eq.brand}
                </span>
                
                <h3 className="text-base font-bold text-[#111827] mb-2 line-clamp-2 leading-snug group-hover:text-[#fea619] transition-colors">
                  {eq.name}
                </h3>
                
                <p className="text-xs text-[#444651] mb-4">
                  Cọc: <span className="text-[#00236f] font-semibold">{eq.deposit.toLocaleString('vi-VN')}đ</span>
                </p>

                {eq.description && (
                  <p className="text-xs text-[#757682] line-clamp-2 mb-4">
                    {eq.description}
                  </p>
                )}

                <button 
                  onClick={() => onOpenEquipmentDetail(eq)}
                  className="mt-auto w-full py-2.5 bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] text-xs font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  Thuê ngay & Xem chi tiết
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Trust Badges */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#dce1ff]/30 border border-[#c5c5d3]/50 rounded-xl p-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#00236f] text-[#fea619] rounded-full flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#00236f] mb-1">100% Thiết bị chính hãng</h4>
            <p className="text-xs text-[#444651] leading-relaxed">
              Tất cả máy ảnh, ống kính và thiết bị tại T-Rent đều được nhập khẩu chính hãng, bảo dưỡng định kỳ cực kỳ nghiêm ngặt.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#00236f] text-[#fea619] rounded-full flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#00236f] mb-1">Kiểm tra & Hỗ trợ kỹ thuật</h4>
            <p className="text-xs text-[#444651] leading-relaxed">
              Được đội ngũ kỹ thuật lành nghề tại cửa hàng hướng dẫn setup, kiểm tra kỹ lưỡng sensor và ống kính trước khi bàn giao.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#00236f] text-[#fea619] rounded-full flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#00236f] mb-1">Không giữ giấy tờ?</h4>
            <p className="text-xs text-[#444651] leading-relaxed">
              Chiết khấu đặt cọc thông minh qua hệ thức thanh toán điện tử, hỗ trợ doanh nghiệp hoặc các cá nhân có hồ sơ thuê uy tín.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
