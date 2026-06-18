import React, { useState } from 'react';
import { ClipboardList, Calendar, CheckCircle2, Clock, ArrowRight, AlertCircle, XCircle } from 'lucide-react';

export default function Orders({
  orders,
  onCancelOrder,
  onReturnEquipment,
  setActivePage,
  onSelectOrder
}) {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', name: 'Tất cả đơn' },
    { id: 'pending', name: 'Chờ đặt cọc' },
    { id: 'paid', name: 'Đã cọc giữ chỗ' },
    { id: 'completed', name: 'Đã hoàn tất dã quầy' },
    { id: 'cancelled', name: 'Đã hủy' }
  ];

  // Lọc danh sách đơn hàng
  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'paid') return order.status === 'paid' || order.status === 'active';
    return order.status === activeTab;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          label: 'Chờ thanh toán cọc',
          icon: <Clock className="w-3.5 h-3.5 text-amber-600" />
        };
      case 'paid':
      case 'active':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-250',
          label: 'Đã đặt cọc giữ chỗ',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        };
      case 'completed':
        return {
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
          label: 'Đã hoàn tất dã ngoại bàn giao',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-sky-650" />
        };
      case 'cancelled':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          label: 'Đã hủy đơn hàng',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          label: 'Chờ xử lý',
          icon: <Clock className="w-3.5 h-3.5" />
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 animate-fade-in text-left font-sans" id="orders-list-screen">
      
      {/* Tiêu đề & Danh mục lọc Tab */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl font-black text-[#00236f] uppercase tracking-wide">Danh Sách Đơn Hàng</h1>
          <p className="text-xs text-slate-400 mt-1">Theo dõi tiến trình bảo lộc giữ chỗ, bàn lưu bàn giao, hoàn trả thiết bị camera</p>
        </div>

        {/* Tabs lọc */}
        <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl border border-slate-250/60 shadow-inner font-bold text-xs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition text-[11px] font-black ${
                activeTab === tab.id
                  ? 'bg-white text-[#00236f] shadow-sm'
                  : 'text-slate-500 hover:text-[#00236f]'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-800">Không tìm thấy đơn hàng nào khớp điều kiện</p>
          <p className="text-xs text-slate-400 mt-1 mb-6">Bạn chưa khởi tạo giao dịch bảo cọc thiết bị ảnh nào.</p>
          <button
            onClick={() => setActivePage('equipments')}
            className="px-5 py-2.5 bg-[#00236f] text-white font-extrabold text-xs rounded-xl hover:bg-[#fea619] hover:text-[#2a1700] transition"
          >
            Thuê thiết bị ngay
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const st = getStatusStyle(order.status);
            // Tiền thuê
            const totalRent = order.totalPrice || 0;
            // Tiền cọc
            const totalDeposit = order.deposit || 0;

            return (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-[#00236f] transition p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer shadow-sm animate-fade-in"
              >
                
                {/* Info block */}
                <div className="space-y-3 flex-grow text-left">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-black text-[#00236f] font-mono">
                      #{order.order_code || order.id}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${st.bg}`}>
                      {st.icon}
                      {st.label}
                    </span>
                    
                    {/* Trạng thái thanh toán cọc */}
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${
                      order.status === 'pending' || order.status === 'cancelled'
                        ? 'bg-rose-50 text-rose-700 border-rose-200' 
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {order.status === 'pending' ? 'Chưa thanh toán cọc' : order.status === 'cancelled' ? 'Hủy đặt cọc' : 'Đã thanh toán cọc'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-[#00236f] leading-snug">
                        {order.equipment?.name || 'Mẫu thiết bị camera cao cấp'}
                      </h4>
                      <p className="text-[11px] text-slate-450 font-bold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Kỳ thuê: {order.startDate} đến {order.endDate} ({order.rental_days || 1} ngày thuê)
                      </p>
                    </div>

                    <div className="text-left sm:text-right space-y-0.5">
                      <div className="text-slate-400 block text-[10px] uppercase font-bold">Biểu phí chi tiết:</div>
                      <div className="text-slate-800 font-bold">
                        Đóng cọc giữ chỗ: <span className="text-amber-600 font-black font-mono">{(totalRent + totalDeposit).toLocaleString('vi-VN')} VNĐ</span>
                      </div>
                      <div className="text-[10px] text-slate-400 block font-semibold leading-none">
                        (Khấu trừ: Thuê {totalRent.toLocaleString('vi-VN')}đ + Cọc {totalDeposit.toLocaleString('vi-VN')}đ)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Button actions wrapper */}
                <div className="shrink-0 flex self-stretch justify-end md:items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectOrder(order);
                    }}
                    className="p-2.5 bg-slate-50 hover:bg-[#00236f] text-[#00236f] hover:text-white rounded-xl border border-slate-200 flex items-center gap-1 transition text-xs font-black shadow-inner"
                  >
                    Chi tiết
                    
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
