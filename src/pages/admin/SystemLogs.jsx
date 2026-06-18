import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  ArrowLeft, 
  User, 
  FileCode, 
  Clock, 
  Smartphone, 
  ShieldCheck,
  ChevronRight,
  Eye
} from 'lucide-react';

const INITIAL_LOGS = [
  {
    id: 'LOG-55102',
    user: 'Trần Văn Hoàng',
    role: 'Quản trị viên',
    action: 'Duyệt hồ sơ xác minh',
    targetType: 'Khách hàng',
    targetId: '#VX-1002',
    time: '2026-06-17 11:32:10',
    description: 'Hồ sơ xác minh căn cước công dân của khách hàng Nguyễn Văn A đã được đối chứng thấu đáo và phê chuẩn tư cách xác minh mức III.',
    device: 'Vivaldi Browser on Windows 11',
    ip: '116.108.99.122',
    beforeChange: {
      user_id: 'NA-99120',
      fullName: 'Nguyễn Văn A',
      identityStatus: 'pending_verification',
      reviewer: null,
      reviewed_at: null
    },
    afterChange: {
      user_id: 'NA-99120',
      fullName: 'Nguyễn Văn A',
      identityStatus: 'approved_verified_tier3',
      reviewer: 'Trần Văn Hoàng',
      reviewed_at: '2026-06-17 11:32:10'
    }
  },
  {
    id: 'LOG-551010',
    user: 'Lê Minh',
    role: 'Nhân viên kỹ thuật',
    action: 'Cập nhật kết quả bảo trì',
    targetType: 'Thiết bị vật lý',
    targetId: 'AST0401',
    time: '2026-06-17 09:12:45',
    description: 'Bảo dưỡng hiệu chuẩn thấu kính Sony Alpha A7 IV (Serial: SN-A74-99201). Đưa thiết bị từ trạng thái Bảo trì sang Sẵn sàng.',
    device: 'Chrome on Android Mobile',
    ip: '27.72.100.41',
    beforeChange: {
      asset_id: 'AST0401',
      status: 'maintenance',
      lastCondition: 'Sensor bám bụi, kiểm chuẩn f-stop',
      lastRentedCount: 49
    },
    afterChange: {
      asset_id: 'AST0401',
      status: 'available',
      lastCondition: 'Sensor sạch bóng, thấu kính chuẩn nén, SteadyShot tối hảo',
      lastRentedCount: 49
    }
  },
  {
    id: 'LOG-550998',
    user: 'Trần Văn Hoàng',
    role: 'Quản trị viên',
    action: 'Thêm tài khoản nhân viên',
    targetType: 'Quản trị nhân sự',
    targetId: 'EMP-018',
    time: '2026-06-16 16:45:00',
    description: 'Tạo tài khoản nghiệp vụ CSKH/Vận hành kho cho nhân viên mới: Hoàng Minh Tú (@t-rent.vn).',
    device: 'Safari on macOS Sequoia',
    ip: '14.161.40.22',
    beforeChange: null,
    afterChange: {
      id: 'EMP-018',
      name: 'Hoàng Minh Tú',
      email: 'tu.hoang@t-rent.vn',
      phone: '0977 888 999',
      role: 'Quản lý kho',
      status: 'active'
    }
  },
  {
    id: 'LOG-550982',
    user: 'Nguyễn Văn B',
    role: 'Nhân viên bàn giao',
    action: 'Lập phiếu bàn giao',
    targetType: 'Đơn hàng',
    targetId: 'TR-ORD-001',
    time: '2026-06-16 14:10:00',
    description: 'Lập phiếu bàn giao thành công, xuất kho thiết bị cho khách thuê Nguyễn Văn A. Hợp đồng giấy, ảnh ký nhận đính kèm đầy đủ.',
    device: 'Chrome on Windows 11',
    ip: '113.161.22.88',
    beforeChange: {
      order_id: 'TR-ORD-001',
      orderStatus: 'active',
      allocatedAssets: [],
      paperContractUploaded: false,
      handoverPhotosUploaded: false
    },
    afterChange: {
      order_id: 'TR-ORD-001',
      orderStatus: 'renting',
      allocatedAssets: ['AST0401', 'AST0404'],
      paperContractUploaded: true,
      handoverPhotosUploaded: true
    }
  }
];

export default function SystemLogs() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [activeView, setActiveView] = useState('list'); // list, detail
  const [selectedLog, setSelectedLog] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const handleOpenDetail = (log) => {
    setSelectedLog(log);
    setActiveView('detail');
  };

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.targetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === '' || l.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* VIEW: LIST ACTIONS */}
      {activeView === 'list' && (
        <>
          {/* Title row */}
          <div className="flex justify-between items-center bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
            <div>
              <h2 className="text-xl font-bold text-[#00236f] flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-650" />
                NHẬT KÝ THAO TÁC HỆ THỐNG
              </h2>
              <p className="text-xs text-slate-500 mt-1">Lịch trình ghi nhân chi tiết mọi tác động, tinh chỉnh tham số của Quản trị viên và Nhân viên.</p>
            </div>
            <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1 rounded-full font-bold">
              🔒 CHẾ ĐỘ CHỈ ĐỌC (AUDIT)
            </span>
          </div>

          {/* Search boxes filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm người thao tác, hành động, ID đối tượng, mô tả hành động..."
                className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-2.5 text-xs focus:ring-1 focus:ring-blue-500/50 outline-none text-slate-800"
              />
            </div>
            <div className="w-full sm:w-48">
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-xs focus:ring-1 focus:ring-blue-500/50 outline-none text-slate-700 font-bold"
              >
                <option value="">Xem vai trò: Tất cả</option>
                <option value="Quản trị viên">Quản trị viên</option>
                <option value="Nhân viên bàn giao">Nhân viên bàn giao</option>
                <option value="Nhân viên kỹ thuật">Nhân viên kỹ thuật</option>
              </select>
            </div>
          </div>

          {/* Table log list */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto w-full shadow-sm text-xs">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] text-slate-500 font-black uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4">Thời gian</th>
                  <th className="px-4 py-4">Tài khoản</th>
                  <th className="px-4 py-4">Vai trò</th>
                  <th className="px-4 py-4">Hành động</th>
                  <th className="px-4 py-4">Bộ phận</th>
                  <th className="px-4 py-4">Đối tượng</th>
                  <th className="px-6 py-4 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-slate-400 text-sm">
                      Không tìm thấy bản ghi nhật ký nào.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-mono text-slate-500 whitespace-nowrap">{log.time}</td>
                      <td className="px-4 py-4 font-bold text-slate-900">{log.user}</td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                          {log.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-bold text-[#00236f]">{log.action}</td>
                      <td className="px-4 py-4 text-slate-500 font-bold block mt-1">{log.targetType}</td>
                      <td className="px-4 py-4 font-mono text-slate-600">{log.targetId}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleOpenDetail(log)}
                          className="p-1.5 hover:bg-[#fea619] hover:text-[#2a1700] bg-slate-100 rounded-lg text-slate-700 transition"
                          title="Xem chi tiết biến thiên"
                        >Hi?n
                          
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* VIEW: LOG DETAILS WITH BEFORE/AFTER STATE COMPARISONS */}
      {activeView === 'detail' && selectedLog && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs">
            <button 
              onClick={() => setActiveView('list')} 
              className="text-slate-500 hover:text-slate-900 transition flex items-center gap-1 font-bold"
            >
              
              Nhật ký hành động
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-black">Mã log {selectedLog.id}</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <span className="text-[10px] bg-slate-900 text-slate-200 font-mono font-bold px-2 py-0.5 rounded-md uppercase">{selectedLog.id}</span>
              <h3 className="text-sm font-bold text-slate-800 mt-2 block">
                {selectedLog.user} ({selectedLog.role}) - <span className="text-indigo-650">{selectedLog.action}</span>
              </h3>
              <p className="text-xs text-slate-400 font-serif mt-1 italic">"{selectedLog.description}"</p>
            </div>

            <div className="p-6 space-y-6 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-slate-400 block font-bold">Thời gian:</span>
                  <span className="text-slate-800 block flex items-center gap-1">
                    <Clock className="w-4 h-4 text-slate-500" />
                    {selectedLog.time}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-slate-400 block font-bold">Thiết bị tác động:</span>
                  <span className="text-slate-800 block flex items-center gap-1">
                    <Smartphone className="w-4 h-4 text-slate-500" />
                    {selectedLog.device}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-slate-400 block font-bold font-mono">Địa chỉ IP:</span>
                  <span className="text-slate-800 block font-mono">
                    {selectedLog.ip}
                  </span>
                </div>
              </div>

              {/* JSON delta comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
                
                {/* Before change state state */}
                <div className="space-y-2">
                  <span className="text-xs font-black text-rose-600 uppercase flex items-center gap-1">
                    🔴 THỨC TRẠNG TRƯỚC THAY ĐỔI
                  </span>
                  <pre className="p-4 bg-slate-900 text-indigo-200 font-mono text-[10.5px] rounded-xl overflow-x-auto select-text leading-relaxed border border-slate-800 max-h-72">
                    {selectedLog.beforeChange 
                      ? JSON.stringify(selectedLog.beforeChange, null, 2) 
                      : 'Nồ (Thành lập mới - Không có trạng thái trước)'}
                  </pre>
                </div>

                {/* After state change */}
                <div className="space-y-2">
                  <span className="text-xs font-black text-green-600 uppercase flex items-center gap-1">
                    🟢 THỰC TRẠNG SAU THAY ĐỔI
                  </span>
                  <pre className="p-4 bg-slate-900 text-emerald-250 font-mono text-[10.5px] rounded-xl overflow-x-auto select-text leading-relaxed border border-slate-800 max-h-72">
                    {JSON.stringify(selectedLog.afterChange, null, 2)}
                  </pre>
                </div>

              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-100">
                <button 
                  onClick={() => setActiveView('list')}
                  className="px-5 py-2.5 bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] text-xs font-black rounded-lg transition-colors cursor-pointer"
                >
                  Quay lại danh sách nhật ký
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
