import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft,
  Settings,
  History,
  X,
  FileText
} from 'lucide-react';

const INITIAL_MAINTENANCE = [
  {
    id: 'MT-001',
    assetId: 'AST0403',
    assetName: 'Canon EOS R6 Mark II',
    serial: 'SN-R62-88001',
    reason: 'Trầy sước kính ngắm & Lau dọn bụi sensor',
    status: 'repairing', // repairing, completed, pending_parts
    statusLabel: 'Đang xử lý',
    startDate: '2026-06-10',
    endDate: '',
    createdBy: 'Trần Văn Hoàng (Admin)',
    technician: 'Lê Minh (Kỹ thuật)',
    notes: 'Kính ngắm bị bám bụi nhẹ, cảm biến xuất hiện 3 chấm mòn nhỏ cần kiểm tra f-stop.',
    resultInspect: '',
    resultRepair: '',
    historyLogs: [
      { action: 'Khởi tạo hồ sơ bảo trì', time: '10/06/2026 09:00', user: 'Trần Văn Hoàng' },
      { action: 'Nhận thiết bị tại quầy kỹ thuật', time: '11/06/2026 14:00', user: 'Lê Minh' }
    ]
  },
  {
    id: 'MT-002',
    assetId: 'AST0407',
    assetName: 'Aputure Amaran 200d LED Light',
    serial: 'SN-LGT-22101',
    reason: 'Cắm nguồn không lên bóng LED, quạt không hoạt động',
    status: 'pending_parts',
    statusLabel: 'Chờ linh kiện',
    startDate: '2026-06-12',
    endDate: '',
    createdBy: 'Nguyễn Văn B (Kỹ thuật)',
    technician: 'Nguyễn Văn B (Kỹ thuật)',
    notes: 'Nghi ngờ chập cuộn tụ đổi nguồn Adapter chính hãng, đã liên hệ hãng gửi tụ linh kiện thay thế.',
    resultInspect: 'Hỏng mạch đổi nguồn thứ cấp',
    resultRepair: '',
    historyLogs: [
      { action: 'Khởi tạo hồ sơ kiểm thử', time: '12/06/2026 10:30', user: 'Nguyễn Văn B' },
      { action: 'Gửi yêu cầu nhập linh kiện từ hãng', time: '13/06/2026 16:00', user: 'Nguyễn Văn B' }
    ]
  },
  {
    id: 'MT-003',
    assetId: 'AST0401',
    assetName: 'Sony Alpha A7 IV',
    serial: 'SN-A74-99201',
    reason: 'Kiểm tra f-stop định kỳ 50 lần thuê',
    status: 'completed',
    statusLabel: 'Đã hoàn thành',
    startDate: '2026-06-05',
    endDate: '2026-06-06',
    createdBy: 'Trần Văn Hoàng (Admin)',
    technician: 'Lê Minh (Kỹ thuật)',
    notes: 'Kiểm tra độ chụm thấu kính mặt sau, kiểm tra hệ thống chống rung sensor SteadyShot.',
    resultInspect: 'Cảm biến thấu kính bình thường, cơ chế chống rung hoạt động tốt.',
    resultRepair: 'Đã căn chỉnh lại thước đo khoảng cách hội tụ và lau dầu trục bánh răng gimbal chống rung.',
    historyLogs: [
      { action: 'Khởi tạo phiếu', time: '05/06/2026 08:00', user: 'Trần Văn Hoàng' },
      { action: 'Đã hoàn tất nghiệm thu & đưa lại tủ kệ trưng bày', time: '06/06/2026 11:30', user: 'Lê Minh' }
    ]
  }
];

export default function Maintenance({ onAddNotification }) {
  const [records, setRecords] = useState(INITIAL_MAINTENANCE);
  const [activeView, setActiveView] = useState('list'); // list, detail, edit
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Form states for update result
  const [inspectResult, setInspectResult] = useState('');
  const [repairResult, setRepairResult] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [targetAssetStatus, setTargetAssetStatus] = useState('available'); // available, repairing, retired

  // Notification Toast
  const [toast, setToast] = useState(null);
  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenDetail = (rec) => {
    setSelectedRecord(rec);
    setActiveView('detail');
  };

  const handleOpenEdit = () => {
    setInspectResult(selectedRecord.resultInspect || '');
    setRepairResult(selectedRecord.resultRepair || '');
    setFormNotes(selectedRecord.notes || '');
    setTargetAssetStatus(selectedRecord.status === 'completed' ? 'available' : 'repairing');
    setActiveView('edit');
  };

  const handleSaveResult = (e) => {
    e.preventDefault();
    if (!inspectResult.trim() || !repairResult.trim()) {
      alert('Vui lòng điền đầy đủ thông tin Kết quả kiểm tra và Kết quả sửa chữa/bảo dưỡng!');
      return;
    }

    const isDone = targetAssetStatus === 'available' || targetAssetStatus === 'retired';
    const updatedStatus = isDone ? 'completed' : (targetAssetStatus === 'repairing' ? 'repairing' : 'pending_parts');
    const label = updatedStatus === 'completed' ? 'Đã hoàn thành' : (updatedStatus === 'repairing' ? 'Đang xử lý' : 'Chờ linh kiện');

    const updatedRecord = {
      ...selectedRecord,
      status: updatedStatus,
      statusLabel: label,
      resultInspect: inspectResult,
      resultRepair: repairResult,
      notes: formNotes,
      endDate: isDone ? new Date().toISOString().split('T')[0] : '',
      historyLogs: [
        ...selectedRecord.historyLogs,
        { 
          action: `Cập nhật kết quả bảo trì: (Vật lý -> ${targetAssetStatus === 'available' ? 'Sẵn sàng' : targetAssetStatus === 'retired' ? 'Ngừng sử dụng' : 'Bảo trì'})`, 
          time: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour24: true }).substring(0, 5), 
          user: 'Nguyễn Văn B (Kỹ thuật)' 
        }
      ]
    };

    setRecords(records.map(r => r.id === selectedRecord.id ? updatedRecord : r));
    setSelectedRecord(updatedRecord);
    setActiveView('detail');

    let itemMsg = `Đã cập nhật hồ sơ bảo trì ${selectedRecord.id}. `;
    if (targetAssetStatus === 'available') {
      itemMsg += 'Thiết bị đã chuyển về trạng thái SÃN SÀNG đón đơn hàng mới!';
    } else if (targetAssetStatus === 'retired') {
      itemMsg += 'Thiết bị đã Ngừng cho thuê vĩnh viễn!';
    } else {
      itemMsg += 'Tiếp tục giữ thiết bị ở kho bảo dưỡng.';
    }
    triggerToast(itemMsg);
    if (onAddNotification) {
      onAddNotification(itemMsg);
    }
  };

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.assetName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.serial.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* Toast Notice */}
      {toast && (
        <div className="fixed top-20 right-4 bg-slate-900 border border-slate-700 text-white px-5 py-3 rounded-lg shadow-2xl z-[90] flex items-center gap-3 animate-fade-in">
          <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      {/* VIEW: LIST OF RECORDS */}
      {activeView === 'list' && (
        <>
          {/* Title bar */}
          <div className="flex justify-between items-center bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
            <div>
              <h2 className="text-xl font-bold text-[#00236f] flex items-center gap-2">
                <Wrench className="w-5 h-5 text-indigo-650" />
                PHIẾU YÊU CẦU & BẢO TRÌ THIẾT BỊ
              </h2>
              <p className="text-xs text-slate-500 mt-1">Giám sát vòng đời, sửa chữa và lau dọn cảm biến thiết bị quay chụp định kỳ.</p>
            </div>
          </div>

          {/* Search bar filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã bảo trì, tên thiết bị, mã serial..."
                className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:ring-1 focus:ring-blue-500/50 outline-none"
              />
            </div>
            <div className="w-full sm:w-48">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-xs focus:ring-1 focus:ring-blue-500/50 outline-none text-slate-800 cursor-pointer"
              >
                <option value="">Trạng thái: Tất cả</option>
                <option value="repairing">Đang xử lý</option>
                <option value="pending_parts">Chờ linh kiện</option>
                <option value="completed">Đã hoàn thành</option>
              </select>
            </div>
          </div>

          {/* Table list */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto w-full shadow-sm">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-rose-100 text-[10px] font-black uppercase tracking-wider">
                  <th className="px-6 py-4">Mã hồ sơ</th>
                  <th className="px-6 py-4">Thiết bị cần bảo trì</th>
                  <th className="px-6 py-4">Số Serial</th>
                  <th className="px-6 py-4">Lý do bảo trì</th>
                  <th className="px-6 py-4">Ngày bắt đầu</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-xs text-slate-400 font-medium">
                      ⚠️ Không tìm thấy hồ sơ bảo trì nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/55 transition duration-150">
                      <td className="px-6 py-4 font-mono text-xs text-indigo-600 font-black">{r.id}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-800 block">{r.assetName}</span>
                        <span className="text-[9.5px] text-slate-400 font-bold block">ID: {r.assetId}</span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">{r.serial}</td>
                      <td className="px-6 py-4 text-xs text-slate-600 max-w-[200px] truncate">{r.reason}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{r.startDate}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-[9px] font-black uppercase border ${
                          r.status === 'completed' 
                            ? 'bg-green-50 text-green-700 border-green-250 animate-pulse' 
                            : r.status === 'repairing'
                              ? 'bg-amber-50 text-amber-700 border-amber-250'
                              : 'bg-red-50 text-red-700 border-red-250'
                        }`}>
                          {r.statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleOpenDetail(r)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-[#fea619] hover:text-[#2a1700] text-slate-700 text-[11px] font-black rounded-lg transition-colors cursor-pointer"
                        >
                          XEM CHI TIẾT
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

      {/* VIEW: DETAIL OF MOISTURE/MAINTENANCE */}
      {activeView === 'detail' && selectedRecord && (
        <div className="space-y-6">
          {/* Breadcrumb nav */}
          <div className="flex items-center gap-2 text-xs">
            <button 
              onClick={() => setActiveView('list')} 
              className="text-slate-500 hover:text-slate-900 transition flex items-center gap-1 font-bold"
            >
              
              Danh sách bảo trì
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-extrabold">Chi tiết phiếu {selectedRecord.id}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Main Info */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div>
                  <span className="text-[10px] bg-slate-900 text-slate-10
                  0 font-mono px-2 py-0.5 rounded-md font-bold uppercase">{selectedRecord.id}</span>
                  <h3 className="text-sm font-bold text-slate-800 mt-2">{selectedRecord.assetName}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">ID: {selectedRecord.assetId} | Serial: {selectedRecord.serial}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-black uppercase border ${
                    selectedRecord.status === 'completed' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-amber-50 text-amber-700 border-amber-250'
                  }`}>
                    {selectedRecord.statusLabel}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-5">
                
                {/* 2 column specification details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold mb-1">Thời gian bắt đầu:</span>
                    <span className="text-slate-800 font-bold block">{selectedRecord.startDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold mb-1">Thời gian hoàn tất:</span>
                    <span className="text-slate-800 font-bold block">{selectedRecord.endDate || 'Chưa hoàn tất/Đang xử lý'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold mb-1">Cán bộ lập yêu cầu:</span>
                    <span className="text-slate-800 font-bold block">{selectedRecord.createdBy}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold mb-1">Kỹ thuật viên đảm nhiệm:</span>
                    <span className="text-slate-800 font-bold block">{selectedRecord.technician}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-black text-[#00236f] uppercase">Nội dung / Triệu chứng hư hỏng gốc</h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-3 border border-slate-150 rounded-lg italic">
                    "{selectedRecord.reason}"
                  </p>
                  <p className="text-xs text-slate-600 block mt-1 font-medium">Ghi chú bổ sung: {selectedRecord.notes}</p>
                </div>

                <div className="space-y-4 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    KẾT QUẢ PHỤC HỒI / NGHIỆM THU
                  </h4>

                  {selectedRecord.resultInspect ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 bg-green-50/50 border border-green-200 rounded-xl">
                        <span className="text-slate-500 font-bold block mb-1">Kết quả kiểm tra kỹ thuật:</span>
                        <p className="text-slate-800 font-semibold">{selectedRecord.resultInspect}</p>
                      </div>
                      <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl">
                        <span className="text-slate-500 font-bold block mb-1">Kết quả sửa chữa &amp; linh kiện:</span>
                        <p className="text-slate-800 font-semibold">{selectedRecord.resultRepair || 'Chỉ lau dọn và hiệu chuẩn phần mềm'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 text-center text-xs text-slate-400 border border-dashed border-slate-200 bg-slate-50 rounded-xl font-medium">
                      Chưa ghi nhận kết quả phục hồi. Vui lòng cập nhật phiếu khi kỹ sư hoàn tất xử lý.
                    </div>
                  )}
                </div>

                {/* Return actions on details view */}
                <div className="flex gap-3 pt-6 border-t border-slate-100">
                  <button 
                    onClick={() => setActiveView('list')}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition duration-150 cursor-pointer"
                  >
                    Quay lại danh sách
                  </button>

                  {selectedRecord.status !== 'completed' && (
                    <button 
                      onClick={handleOpenEdit}
                      className="px-6 py-2.5 bg-[#00236f] hover:bg-[#fea619] text-white hover:text-[#2a1700] text-xs font-black rounded-xl transition duration-150 flex items-center gap-1.5 shadow active:scale-95 cursor-pointer ml-auto"
                    >
                      
                      Cập nhật kết quả bảo trì
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* Sidebar History Logs */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <h4 className="text-xs font-black text-slate-800 uppercase mb-4 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-indigo-650" />
                  LỊCH SỬ BẢO TRÌ TÀI SẢN
                </h4>
                <div className="relative border-l-2 border-slate-150 pl-4 ml-2 space-y-6">
                  {selectedRecord.historyLogs.map((log, idx) => (
                    <div key={idx} className="relative text-xs">
                      {/* Node point */}
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 border-2 border-white ring-4 ring-indigo-50"></span>
                      <p className="font-bold text-slate-800">{log.action}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{log.time} - {log.user}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW: UPDATE MAINTENANCE RESULT FORM */}
      {activeView === 'edit' && selectedRecord && (
        <form onSubmit={handleSaveResult} className="space-y-6 max-w-3xl bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-[#00236f] flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              CẬP NHẬT KẾT QUẢ PHỤC HỒI / SỬA CHỮA {selectedRecord.id}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Tiến hành chốt bệnh lý, phương án kỹ thuật và chuyển đổi trạng thái thiết bị.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 text-xs font-medium">
            
            {/* Kết quả kiểm tra */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Kết quả kiểm tra / Nguyên nhân sự cố <span className="text-red-500">*</span></label>
              <textarea 
                required
                value={inspectResult}
                onChange={(e) => setInspectResult(e.target.value)}
                placeholder="Ví dụ: Cảm biến CCD bị mốc rễ tre sâu góc phải thấu kính, nguồn hỏng tụ..."
                rows="3"
                className="px-3.5 py-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* Kết quả sửa chữa */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Cách thức khắc phục / Linh kiện thay mới <span className="text-red-500">*</span></label>
              <textarea 
                required
                value={repairResult}
                onChange={(e) => setRepairResult(e.target.value)}
                placeholder="Ví dụ: Đã tháo rã thấu kính lau sấy mốc ẩm, chấm keo gia cố mặt ngoài cảm biến. Thay thế Adapter chập nguồn."
                rows="3"
                className="px-3.5 py-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* Trạng thái thiết bị */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Trạng thái thiết bị sau bảo trì</label>
              <select 
                value={targetAssetStatus}
                onChange={(e) => setTargetAssetStatus(e.target.value)}
                className="px-3 py-2.5 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none cursor-pointer"
              >
                <option value="available">🟢 Hoàn tất xuất sưởng - Chuyển sang SẴN SÀNG cho thuê</option>
                <option value="repairing">🟡 Đang xử lý tiếp - Giữ nguyên trạng thái BẢO TRÌ</option>
                <option value="retired">🔴 Ngừng cho thuê vĩnh viễn (Phế phẩm thanh lý)</option>
              </select>
            </div>

            {/* Ghi chú */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Ghi chú vận hành</label>
              <input 
                type="text"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Cân kiểm dải f-stop hoạt động bình thường, không bám vân tay trong thấu kính..."
                className="px-3.5 py-2.5 border border-slate-200 rounded-lg text-xs outline-none"
              />
            </div>

          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button"
              onClick={() => setActiveView('detail')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
            >
              Hủy bỏ, Quay lại
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-black rounded-lg transition flex items-center gap-1 shadow ml-auto"
            >
              LƯU PHIẾU NGHIỆM THU
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
