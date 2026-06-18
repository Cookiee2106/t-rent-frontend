import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  RefreshCw, 
  DollarSign, 
  Boxes, 
  AlertTriangle, 
  FileSpreadsheet, 
  Sparkles,
  PieChart as PieIcon,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

const REVENUE_DATA = [
  { name: '01/06', rent: 14500000, deposit: 25000000, deduction: 1500000, refund: 23500000, real: 16000000 },
  { name: '03/06', rent: 18200000, deposit: 32000000, deduction: 2400000, refund: 29600000, real: 20600000 },
  { name: '05/06', rent: 22000000, deposit: 40000000, deduction: 3000000, refund: 37000000, real: 25000000 },
  { name: '07/06', rent: 15100000, deposit: 18000000, deduction: 800000, refund: 17200000, real: 15900000 },
  { name: '09/06', rent: 26400000, deposit: 55000000, deduction: 4500000, refund: 50500000, real: 30900000 },
  { name: '11/06', rent: 19800000, deposit: 35000000, deduction: 0, refund: 35000000, real: 19800000 },
  { name: '13/06', rent: 31200000, deposit: 60000000, deduction: 5000000, refund: 55000000, real: 36200000 },
  { name: '15/06', rent: 24500000, deposit: 40000000, deduction: 1200000, refund: 38800000, real: 25700000 }
];

const INVENTORY_SUMMARY_DATA = [
  { name: 'Sony A7 IV', total: 12, ready: 8, rented: 3, maint: 1, lost: 0, warning: false },
  { name: 'Canon R6 II', total: 6, ready: 3, rented: 2, maint: 1, lost: 0, warning: false },
  { name: 'Sony 24-70 GM II', total: 10, ready: 5, rented: 4, maint: 1, lost: 0, warning: false },
  { name: 'DJI RS 3 Pro', total: 8, ready: 4, rented: 3, maint: 0, lost: 1, warning: true },
  { name: 'Amaran 200d', total: 5, ready: 3, rented: 1, maint: 1, lost: 0, warning: false },
  { name: 'DJI Mic 2', total: 15, ready: 11, rented: 4, maint: 0, lost: 0, warning: false }
];

const LIGHT_PIE_DATA = [
  { name: 'Sẵn sàng', value: 34, color: '#10b981' },
  { name: 'Đang thuê', value: 17, color: '#3b82f6' },
  { name: 'Bảo trì', value: 4, color: '#f59e0b' },
  { name: 'Mất / Ngừng thuê', value: 1, color: '#ef4444' }
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('revenue'); // revenue, inventory
  
  // Filters
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2526-06-17');
  const [selectedBrand, setSelectedBrand] = useState('all');

  // Loading refresher state
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 850);
  };

  // Aggregated totals
  const totalRent = REVENUE_DATA.reduce((sum, item) => sum + item.rent, 0);
  const totalDeposit = REVENUE_DATA.reduce((sum, item) => sum + item.deposit, 0);
  const totalDeduction = REVENUE_DATA.reduce((sum, item) => sum + item.deduction, 0);
  const totalRefund = REVENUE_DATA.reduce((sum, item) => sum + item.refund, 0);
  const totalRealRevenue = REVENUE_DATA.reduce((sum, item) => sum + item.real, 0);

  const formatVND = (number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
  };

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* Title bar with toggle tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#00236f] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-650" />
            HỆ THỐNG BÁO CÁO TOÀN DIỆN
          </h2>
          <p className="text-xs text-slate-500 mt-1">Phân tích doanh thu, cơ cấu tài chính thực thu và báo cáo an toàn kho vận hành.</p>
        </div>
        
        {/* Tab switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-150">
          <button 
            type="button"
            onClick={() => setActiveTab('revenue')}
            className={`px-4 py-2 text-xs font-black rounded-lg transition duration-200 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'revenue' 
                ? 'bg-[#00236f] text-white shadow' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💸 BÁO CÁO DOANH THU
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-xs font-black rounded-lg transition duration-200 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'inventory' 
                ? 'bg-[#00236f] text-white shadow' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📦 BÁO CÁO TỒN KHO
          </button>
        </div>
      </div>

      {/* Date Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>Khoảng thời gian:</span>
          </div>
          <input 
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-slate-800 font-bold"
          />
          <span className="text-xs text-slate-400 font-bold">đến</span>
          <input 
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none text-slate-800 font-bold"
          />

          {activeTab === 'inventory' && (
            <select 
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs text-slate-700 font-bold outline-none cursor-pointer"
            >
              <option value="all">Thương hiệu: Tất cả</option>
              <option value="sony">Sony</option>
              <option value="canon">Canon</option>
              <option value="dji">DJI</option>
            </select>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button 
            onClick={handleRefresh}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-lg text-xs font-black transition duration-150 cursor-pointer"
          >
            
            LÀM MỚI
          </button>
          <button 
            onClick={() => alert('Đã khởi xuất báo cáo Excel thành thục xuống thư mục Downloads!')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-[#fea619] text-[#2a1700] py-2 px-4 rounded-lg text-xs font-black transition duration-150 cursor-pointer shadow-sm hover:brightness-105"
          >
            
            XUẤT FILE EXCEL
          </button>
        </div>
      </div>

      {/* RENDER TAB: REVENUE */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          
          {/* Bento aggregate panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Tổng tiền thuê</span>
              <p className="text-base font-black text-slate-800">{formatVND(totalRent)}</p>
              <span className="text-[9.5px] text-green-600 font-bold block mt-1">↑ 14% so với tháng trước</span>
            </div>

            <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Tổng tiền cọc nhận</span>
              <p className="text-base font-black text-indigo-650">{formatVND(totalDeposit)}</p>
              <span className="text-[9.5px] text-slate-400 font-medium block mt-1">Nhận giữ chân giữ máy</span>
            </div>

            <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[10px] text-rose-500 font-black uppercase tracking-wider block mb-1">Khấu trừ cọc gộp</span>
              <p className="text-base font-black text-rose-600">{formatVND(totalDeduction)}</p>
              <span className="text-[9.5px] text-rose-500 font-bold block mt-1">Từ các khoản hỏng hóc/trễ hạn</span>
            </div>

            <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Đã hoàn cọc tự động</span>
              <p className="text-base font-black text-slate-600">{formatVND(totalRefund)}</p>
              <span className="text-[9.5px] text-slate-400 font-medium block mt-1">Hoàn trả an toàn cho khách</span>
            </div>

            <div className="bg-gradient-to-br from-[#00236f] to-slate-900 text-white p-5 border border-[#00236f] rounded-xl shadow-lg">
              <span className="text-[10px] text-blue-200 font-black uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                Doanh thu thực tế
              </span>
              <p className="text-lg font-black text-white">{formatVND(totalRealRevenue)}</p>
              <span className="text-[9.5px] text-blue-300 font-bold block mt-1">Tiền thuê + Phần khấu trừ</span>
            </div>

          </div>

          {/* Visual chart section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Real Chart */}
            <div className="lg:col-span-8 bg-white border border-slate-150 p-5 rounded-2xl shadow-xs">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">BIỂU ĐỒ BIẾN ĐỘNG DOANH THU & TIỀN THUÊ LŨY KẾ</h3>
                <span className="text-[10px] text-slate-400 font-bold">Đơn vị: VNĐ</span>
              </div>
              <div className="h-80 w-full text-xs font-bold">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" tickFormatter={(v) => `${v/1000000}M`} />
                    <Tooltip formatter={(value) => formatVND(value)} />
                    <Legend />
                    <Bar name="Doanh thu thực tính (Màu xanh)" dataKey="real" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar name="Tiền thuê máy gốc" dataKey="rent" fill="#00236f" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Circular structure proportion */}
            <div className="lg:col-span-4 bg-white border border-slate-150 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-4">CƠ CẤU VỐN XOAY VÒNG</h3>
                <p className="text-[11px] text-slate-400 font-medium mb-4">Phân bổ lượng tiền ra/vào từ quỹ cọc ký quỹ tủ thiết bị vật lý.</p>
              </div>
              
              <div className="h-44 w-full flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart pading={0}>
                    <Pie
                      data={[
                        { name: 'Tiền thuê thô', value: totalRent, color: '#3b82f6' },
                        { name: 'Khấu trừ hoàn cọc', value: totalDeduction, color: '#ef4444' },
                        { name: 'Khách rút cọc hoàn', value: totalRefund, color: '#10b981' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[
                        { color: '#3b82f6' },
                        { color: '#ef4444' },
                        { color: '#10b981' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatVND(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends list */}
              <div className="space-y-2 text-xs pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-600 block">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 block"></span>
                    Tiền thuê thô:
                  </span>
                  <span className="text-slate-800 font-black">{formatVND(totalRent)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-600 block">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 block"></span>
                    Khấu trừ hỏng hóc:
                  </span>
                  <span className="text-slate-800 font-black">{formatVND(totalDeduction)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-600 block">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span>
                    Rút hoàn cọc:
                  </span>
                  <span className="text-slate-800 font-black">{formatVND(totalRefund)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Detailed Data list table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto w-full shadow-sm text-xs">
            <div className="px-5 py-4 border-b border-slate-150 min-w-[850px]">
              <span className="text-xs font-black text-slate-800 uppercase block">BẢNG KÊ DOANH THU ĐỐI SOÁT THEO NGÀY</span>
            </div>
            <table className="w-full min-w-[850px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] text-slate-500 font-black uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-3">Ngày báo cáo</th>
                  <th className="px-6 py-3">Tiền thuê gộp</th>
                  <th className="px-6 py-3">Ký quỹ đặt cọc nhận</th>
                  <th className="px-6 py-3">Deduction (Khấu trừ)</th>
                  <th className="px-6 py-3">Hoàn trả cọc</th>
                  <th className="px-6 py-3 text-right">Doanh thu thực hưởng (VND)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                {REVENUE_DATA.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-6 py-3.5 font-bold text-[#00236f]">{item.name}</td>
                    <td className="px-6 py-3.5">{formatVND(item.rent)}</td>
                    <td className="px-6 py-3.5 text-indigo-650">{formatVND(item.deposit)}</td>
                    <td className="px-6 py-3.5 text-rose-600 font-bold">+{formatVND(item.deduction)}</td>
                    <td className="px-6 py-3.5 text-slate-500">{formatVND(item.refund)}</td>
                    <td className="px-6 py-3.5 text-right font-black text-green-600">{formatVND(item.real)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* RENDER TAB: INVENTORY STATUS & WARNINGS */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          
          {/* Quick status bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            
            {LIGHT_PIE_DATA.map((item, idx) => (
              <div key={idx} className="bg-white p-5 border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.name}</span>
                  <p className="text-xl font-black text-slate-800 mt-1">{item.value} <span className="text-xs text-slate-400 font-medium">thiết bị</span></p>
                </div>
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></span>
              </div>
            ))}

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Inventory table details */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-800 uppercase">TỒN KHO THEO MẪU THIẾT BỊ VẬN HÀNH</h3>
                <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-black">5 mảng chuyên quay</span>
              </div>

              <div className="overflow-x-auto w-full text-xs">
                <table className="w-full min-w-[750px] text-left">
                  <thead>
                    <tr className="text-slate-400 font-bold border-b border-slate-100 pb-2 block"></tr>
                    <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="py-3">Mẫu thiết bị</th>
                      <th className="py-3 text-center">Tổng số tài sản</th>
                      <th className="py-3 text-center">Sẵn sàng</th>
                      <th className="py-3 text-center">Đang thuê</th>
                      <th className="py-3 text-center">Bảo trì</th>
                      <th className="py-3 text-center">Bị xóa/Mất</th>
                      <th className="py-3 text-right">Đối ứng bộ đi kèm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {INVENTORY_SUMMARY_DATA.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/40">
                        <td className="py-4 font-bold text-slate-800">{item.name}</td>
                        <td className="py-4 text-center font-black text-slate-900">{item.total}</td>
                        <td className="py-4 text-center text-green-600">{item.ready}</td>
                        <td className="py-4 text-center text-blue-600">{item.rented}</td>
                        <td className="py-4 text-center text-amber-500">{item.maint}</td>
                        <td className="py-4 text-center text-red-500">{item.lost}</td>
                        <td className="py-4 text-right">
                          {item.warning ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 border border-red-200 text-red-700 font-bold text-[9.5px] rounded-full animate-pulse">
                              <ShieldAlert className="w-3 h-3 text-red-600" />
                              Khuyết bộ (Cảnh báo)
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-[9.5px] rounded-full">
                              Đầy đủ
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Accessory Inventory alerts */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase mb-4 flex items-center gap-1 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  CẢNH BÁO QUÈ GIÁC / THIẾU BỘ ĐI KÈM
                </h3>
                <p className="text-[11px] text-slate-400 font-medium mb-4">Danh mục phụ kiện hoặc thiết bị vật lý trạm thiếu để đóng gói 'Bộ đi kèm camera' trước khi giao cho khách.</p>
              </div>

              <div className="space-y-4 my-3 flex-1">
                
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-rose-800">Cáp sạc USB-C DJI Mic 2</h5>
                    <p className="text-[10px] text-rose-600 mt-0.5 font-medium">Hiện có 15 mic nhưng chỉ 11 cáp sạc khớp trong hộp đóng đi kèm. Thiếu 4 chiếc để bàn giao!</p>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs flex items-start gap-2.5 animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-amber-800">Pin Sony NP-FZ100</h5>
                    <p className="text-[10px] text-amber-600 mt-0.5 font-medium">Lượng pin sạc đầy hiện có tại showroom chạm mức tối thiểu (3 viên). Đang sạc bù 5 viên chờ bàn giao chiều nay.</p>
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-slate-100 text-center">
                <button 
                  onClick={() => alert('Đã lập lệnh chuyển vận phụ trợ, luân kho tự động bù đắp 4 cáp, 10 pin từ cơ sở quận 3 đến!')}
                  className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-black rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  Yêu cầu điều chuyển phụ kiện tự động
                  
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
