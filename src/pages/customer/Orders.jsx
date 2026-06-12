import React, { useState } from 'react';
import { ClipboardList, Calendar, DollarSign, Wallet, CheckCircle2, Clock, ShieldAlert, ArrowRight, Star, AlertCircle } from 'lucide-react';

export default function Orders({
  orders,
  onCancelOrder,
  onReturnEquipment,
  setActivePage,
  onSelectOrder
}) {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', name: 'Tất cả' },
    { id: 'pending', name: 'Chờ thanh toán cọc' },
    { id: 'active', name: 'Đã giữ chỗ / Thuê' },
    { id: 'completed', name: 'Đã hoàn tất vẹn' }
  ];

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-250',
          label: 'Chờ thanh toán cọc',
          icon: <Clock className="w-3.5 h-3.5" />
        };
      case 'active':
        return {
          bg: 'bg-green-50 text-green-700 border-green-250',
          label: 'Đã giữ chỗ / Đang thuê',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
        };
      case 'completed':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-250',
          label: 'Đã hoàn tất thành công',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
        };
      default:
        return {
          bg: 'bg-gray-50 text-gray-700 border-gray-250',
          label: 'Trạng thái lưu chuyển',
          icon: <Clock className="w-3.5 h-3.5" />
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 animate-fade-in font-sans">
      
      {/* Header element */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 select-none">
        <div>
          <h1 className="text-3xl font-black text-[#00236f] font-sans">ĐƠN THUÊ CỦA TÔI</h1>
          <p className="text-xs text-gray-500 mt-0.5">Rà sát lịch bàn giao, thời gian thuê máy, hóa đơn cọc, và ký hợp đồng lưu động.</p>
        </div>

        {/* Tab filters matching Mockup 9 */}
        <div className="flex flex-wrap bg-white p-1 rounded-xl border border-[#c5c5d3] shadow-xs shrink-0 font-bold">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                activeTab === tab.id
                  ? 'bg-[#00236f] text-white shadow-sm'
                  : 'text-[#444651] hover:text-[#00236f]'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#c5c5d3] rounded-2xl shadow-xs">
          <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-bold text-gray-800">Không tìm thấy đơn hàng tương ứng nào</p>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto mb-6">
            Bạn chưa thực hiện bất kỳ giao dịch ký gửi bảo chứng nào, hoặc trạng thái duyệt lọc trên trống rỗng.
          </p>
          <button
            onClick={() => setActivePage('equipments')}
            className="px-6 py-2.5 bg-[#00236f] text-white font-black text-xs rounded-lg hover:bg-[#fea619] hover:text-[#2a1700] transition"
          >
            QUAY LẠI CHỌN THIẾT BỊ THUÊ
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredOrders.map((order) => {
            const st = getStatusStyle(order.status);
            const totalCọcDựTính = order.totalPrice + order.deposit;

            return (
              <div
                key={order.id}
                className="bg-white border border-[#c5c5d3] rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col md:flex-row shadow-xs"
              >
                {/* Visual pic leftmost preview cover */}
                <div className="w-full md:w-48 bg-gray-50 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-gray-100 shrink-0">
                  <div className="w-28 h-28 bg-white border border-gray-150 rounded-xl flex items-center justify-center p-2.5 shadow-inner overflow-hidden">
                    <img
                      src={order.equipment.image}
                      alt={order.equipment.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                </div>

                {/* Main Content card body right */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  {/* Top line ID & chip */}
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-50 pb-2.5">
                    <span className="text-xs font-black text-[#00236f] uppercase">
                      Mã đơn: #{order.order_code || order.id}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-[11px] font-extrabold border rounded-full ${st.bg}`}>
                      {st.icon}
                      {st.label}
                    </span>
                  </div>

                  {/* Mid block information */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-7 space-y-1">
                      <h4 className="text-sm font-black text-gray-900 leading-snug">
                        {order.equipment.name}
                      </h4>
                      <p className="text-[11.5px] text-gray-450 font-semibold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#00236f]" />
                        Kỳ hạn đặt: {order.startDate} đến {order.endDate} ({order.rental_days || 2} ngày thuê)
                      </p>
                    </div>

                    <div className="md:col-span-5 text-left md:text-right text-xs">
                      <div className="text-gray-400 font-bold block">Tổng tiền cọc dự dự thảo:</div>
                      <strong className="text-sm font-black text-amber-600 block">
                        {totalCọcDựTính.toLocaleString('vi-VN')} VNĐ
                      </strong>
                      <span className="text-[10px] text-gray-400 block font-semibold leading-none mt-0.5">
                        (Thuê: {order.totalPrice.toLocaleString('vi-VN')}đ + Ký: {order.deposit.toLocaleString('vi-VN')}đ)
                      </span>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                    <div className="text-[10px] text-gray-400 font-bold uppercase select-none tracking-tight">
                      Giao dịch tự động bảo bảo lưu bởi Vietcombank
                    </div>

                    {/* Sub actions navigation hooks */}
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => {
                            if (confirm('Bạn chắc chắn có nhu cầu hủy yêu cầu thuê máy này không?')) {
                              onCancelOrder(order.id);
                            }
                          }}
                          className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition focus:outline-none"
                        >
                          Hủy đơn
                        </button>
                      )}

                      {order.status === 'active' && (
                        <button
                          onClick={() => {
                            if (confirm('Bạn muốn gửi lệnh hoàn trả thiết bị này lên hệ thống?')) {
                              onReturnEquipment(order.id);
                              alert('Trà thiết bị thành công! Showroom đang tiến hành kiểm kiểm quầy và hoàn lại cọc 100% tài sản trong 5 phút!');
                            }
                          }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition focus:outline-none"
                        >
                          Hoàn trả thiết bị
                        </button>
                      )}

                      <button
                        onClick={() => onSelectOrder(order)}
                        className="px-4 py-2 bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] rounded-lg text-xs font-black transition flex items-center gap-1 shrink-0"
                      >
                        Chi tiết
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
