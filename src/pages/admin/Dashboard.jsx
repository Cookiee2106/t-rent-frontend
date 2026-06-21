import React from 'react';
import { 
  LayoutDashboard, 
  UserCheck, 
  CalendarRange, 
  FileText, 
  Boxes, 
  AlertTriangle, 
  Wrench, 
  Plus, 
  Search, 
  Bell, 
  ChevronRight, 
  History,
  CheckCircle2,
  Package2,
  FileQuestion,
  HelpCircle,
  FileWarning
} from 'lucide-react';

export default function Dashboard({ onViewPage, onSelectOrder }) {
  // Stats and Bento configurations
  const stats = [
    {
      title: 'Hồ sơ chờ duyệt',
      count: '12',
      badge: 'Chờ duyệt',
      badgeStyle: 'bg-amber-100 text-amber-700 font-semibold',
      icon: <UserCheck className="w-5 h-5 text-amber-600" />,
      pageStyle: 'border-l-4 border-amber-500',
      action: () => onViewPage('admin-verifications')
    },
    {
      title: 'Đơn giữ chỗ',
      count: '24',
      badge: 'Giữ chỗ',
      badgeStyle: 'bg-blue-100 text-blue-700 font-semibold',
      icon: <CalendarRange className="w-5 h-5 text-blue-600" />,
      pageStyle: 'border-l-4 border-blue-500',
      action: () => onViewPage('admin-orders')
    },
    {
      title: 'Cần bàn giao',
      count: '08',
      badge: 'Bàn giao',
      badgeStyle: 'bg-emerald-100 text-emerald-700 font-semibold',
      icon: <FileText className="w-5 h-5 text-emerald-600" />,
      pageStyle: 'border-l-4 border-emerald-500',
      action: () => onViewPage('admin-orders')
    },
    {
      title: 'Kiểm kê',
      count: '05',
      badge: 'Kiểm kê',
      badgeStyle: 'bg-indigo-100 text-indigo-700 font-semibold',
      icon: <Boxes className="w-5 h-5 text-indigo-600" />,
      pageStyle: 'border-l-4 border-indigo-500',
      action: () => onViewPage('admin-orders')
    }
  ];

  const issues = [
    {
      title: 'Hợp đồng chưa upload',
      count: '03',
      icon: <FileWarning className="w-5 h-5 text-red-600" />,
      style: 'bg-red-50 text-red-800 border-red-200'
    },
    {
      title: 'Hồ sơ phát sinh mới',
      count: '02',
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      style: 'bg-orange-50 text-orange-800 border-orange-200',
      action: () => onViewPage('admin-disputes')
    },
    {
      title: 'Tài sản bảo trì',
      count: '14',
      icon: <Wrench className="w-5 h-5 text-slate-600" />,
      style: 'bg-slate-50 text-slate-800 border-slate-200'
    }
  ];

  const tasks = [
    {
      type: 'Hồ sơ xác minh',
      icon: <UserCheck className="w-4 h-4 text-amber-600" />,
      badgeColor: 'bg-amber-100 text-amber-800',
      badgeText: 'Chờ xác minh',
      code: '#VX-202405-001',
      customer: 'Lê Văn Tám',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      time: '14:30 - Hôm nay',
      action: () => onViewPage('admin-verifications')
    },
    {
      type: 'Bàn giao',
      icon: <FileText className="w-4 h-4 text-blue-600" />,
      badgeColor: 'bg-blue-100 text-blue-800',
      badgeText: 'Đang xử lý',
      code: '#TR-68423-BC',
      customer: 'Trần Thị Bé',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      time: '09:00 - Sáng mai',
      action: () => onViewPage('admin-orders')
    },
    {
      type: 'Phát sinh',
      icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
      badgeColor: 'bg-red-100 text-red-800',
      badgeText: 'Cần xử lý gấp',
      code: '#ERR-992-FX',
      customer: 'Nguyễn Văn Bình',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      time: 'Quá hạn 2h',
      action: () => onViewPage('admin-disputes')
    },
    {
      type: 'Kiểm kê',
      icon: <Boxes className="w-4 h-4 text-teal-600" />,
      badgeColor: 'bg-teal-100 text-teal-800',
      badgeText: 'Chờ kiểm kê',
      code: '#TR-68425-KK',
      customer: 'Phạm Minh Hoàng',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      time: '17:00 - Hôm nay',
      action: () => onViewPage('admin-orders')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Upper Bar Dashboard Greetings */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-3xl font-serif font-bold text-[#00236f] tracking-tight">Tổng quan nhân viên</h2>
          <p className="text-sm text-slate-500 mt-1">Chào buổi sáng, Hoàng. Dưới đây là các công việc bạn cần ưu tiên xử lý.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Hôm nay, 24 Tháng 5
          </div>
          <button 
            onClick={() => onViewPage('admin-orders')}
            className="flex items-center gap-2 px-4 py-2 bg-[#00236f] hover:bg-blue-950 text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
          >
            
            Tạo hồ sơ mới
          </button>
        </div>
      </div>

      {/* Stats Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, id) => (
          <div 
            key={id}
            onClick={item.action}
            className={`cursor-pointer bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-36 relative overflow-hidden group ${item.pageStyle}`}
          >
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-slate-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                {item.icon}
              </div>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full ${item.badgeStyle}`}>
                {item.badge}
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{item.title}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-serif font-bold text-slate-900">{item.count}</span>
                <span className="text-xs text-slate-400">cần xử lý</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dispute issues status line widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {issues.map((item, id) => (
          <div 
            key={id}
            onClick={item.action}
            className={`border rounded-xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:shadow-md transition-all ${item.style}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/80 rounded-lg shadow-sm">
                {item.icon}
              </div>
              <span className="text-sm font-semibold">{item.title}</span>
            </div>
            <span className="text-2xl font-serif font-black">{item.count}</span>
          </div>
        ))}
      </div>

      {/* Main task schedule center */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#00236f]" />
              Công việc cần xử lý hôm nay
            </h3>
            <p className="text-xs text-slate-400 mt-1">Ưu tiên xử lý các mục quá hạn hoặc có khách liên hệ khẩn cấp</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Lọc nhanh:</span>
            <select className="bg-white border border-slate-200 text-xs rounded-lg py-1 px-3 focus:ring-1 focus:ring-blue-500">
              <option>Tất cả trạng thái</option>
              <option>Chờ xác minh</option>
              <option>Cần bàn giao</option>
              <option>Phát sinh gấp</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                <th className="px-6 py-4 whitespace-nowrap">Loại công việc</th>
                <th className="px-6 py-4 whitespace-nowrap">Mã đơn/hồ sơ</th>
                <th className="px-6 py-4 whitespace-nowrap">Khách hàng</th>
                <th className="px-6 py-4 whitespace-nowrap">Hạn xử lý</th>
                <th className="px-6 py-4 whitespace-nowrap">Trạng thái</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {tasks.map((task, id) => (
                <tr key={id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        {task.icon}
                      </div>
                      <span className="text-sm font-semibold text-slate-800">{task.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-bold text-[#00236f]">
                    <span className="bg-blue-50 px-2 py-1 rounded">
                      {task.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <img 
                        src={task.avatar} 
                        alt={task.customer} 
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-sm text-slate-700 font-medium">{task.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs font-medium ${task.time.includes('Quá hạn') ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                      {task.time}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-1 text-[11px] font-bold rounded-full ${task.badgeColor}`}>
                      {task.badgeText}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button 
                      onClick={task.action}
                      className="px-4 py-1.5 bg-[#00236f] hover:bg-blue-950 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1 ml-auto whitespace-nowrap"
                    >
                      Xử lý
                      
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <p>Hiển thị 4 trong số 18 công việc hoạt động trong ngày</p>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50" disabled>Trước</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white">Tiếp</button>
          </div>
        </div>
      </div>
    </div>
  );
}
