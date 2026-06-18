import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  UserCheck,
  Edit, 
  Lock, 
  Unlock, 
  X, 
  Eye, 
  EyeOff, 
  Save, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ArrowLeft
} from 'lucide-react';

const INITIAL_EMPLOYEES = [
  {
    id: 'EMP-001',
    name: 'Lê Minh',
    initials: 'LM',
    email: 'minh.le@trent.com',
    phone: '0987 123 456',
    role: 'Điều phối',
    roleValue: 'tech',
    status: 'active',
    statusLabel: 'Hoạt động',
    createdDate: '12/01/2024',
    address: '456 Lê Lợi, Quận 1, TP.HCM',
    cccd: '031092004455'
  },
  {
    id: 'EMP-005',
    name: 'Trần Hùng',
    initials: 'TH',
    email: 'hung.tran@trent.com',
    phone: '0902 333 444',
    role: 'Kế toán',
    roleValue: 'warehouse',
    status: 'locked',
    statusLabel: 'Bị khóa',
    createdDate: '05/11/2023',
    address: '789 Nguyễn Trãi, Quận 5, TP.HCM',
    cccd: '079095001122'
  },
  {
    id: 'EMP-012',
    name: 'Phạm Thảo',
    initials: 'PT',
    email: 'thao.pham@trent.com',
    phone: '0911 222 333',
    role: 'CSKH',
    roleValue: 'support',
    status: 'active',
    statusLabel: 'Hoạt động',
    createdDate: '20/02/2024',
    address: '12 Ba Tháng Hai, Quận 10, TP.HCM',
    cccd: '080096005566'
  }
];

export default function Employees() {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [activeView, setActiveView] = useState('list'); // list, detail, add, edit
  const [selectedEmp, setSelectedEmp] = useState(null);

  // Search filter hooks
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  // Add / Edit form states
  const [formFields, setFormFields] = useState({
    id: '', name: '', email: '', phone: '', role: 'CSKH', status: 'active', address: '', cccd: '', password: 'trent12345'
  });

  // Toast
  const [toast, setToast] = useState(null);
  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenDetail = (emp) => {
    setSelectedEmp(emp);
    setActiveView('detail');
  };

  const handleOpenAdd = () => {
    setFormFields({
      id: `EMP-0${employees.length + 12}`,
      name: '',
      email: '',
      phone: '',
      role: 'CSKH',
      status: 'active',
      address: '',
      cccd: ''
    });
    setActiveView('add');
  };

  const handleOpenEdit = () => {
    setFormFields({ ...selectedEmp });
    setActiveView('edit');
  };

  // Actions
  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formFields.name.trim() || !formFields.email.trim()) {
      alert('Vui lòng nhập đầy đủ tên và email nhân sự!');
      return;
    }
    
    // Check duplicate email & phone
    const emailDup = employees.some(emp => emp.email.toLowerCase() === formFields.email.trim().toLowerCase());
    const phoneDup = formFields.phone.trim() && employees.some(emp => emp.phone.trim() === formFields.phone.trim());
    
    if (emailDup) {
      alert('Lỗi trùng lặp: Địa chỉ email này đã tồn tại trên hệ thống!');
      return;
    }
    if (phoneDup) {
      alert('Lỗi trùng lặp: Số điện thoại này đã tồn tại trên hệ thống!');
      return;
    }

    const initials = formFields.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const generatedId = `NV${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newEmp = {
      ...formFields,
      id: generatedId,
      initials,
      statusLabel: 'Hoạt động',
      createdDate: new Date().toLocaleDateString('vi-VN'),
      updatedDate: new Date().toLocaleDateString('vi-VN')
    };

    setEmployees([newEmp, ...employees]);
    setActiveView('list');
    triggerToast(`Đã thêm mới nhân viên thành công: ${newEmp.name} (${generatedId})`);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!formFields.name.trim()) {
      alert('Tên nhân viên không được để trống!');
      return;
    }
    
    // Check duplicates except target employee
    const emailDup = employees.some(emp => emp.id !== selectedEmp.id && emp.email.toLowerCase() === formFields.email.trim().toLowerCase());
    const phoneDup = formFields.phone.trim() && employees.some(emp => emp.id !== selectedEmp.id && emp.phone.trim() === formFields.phone.trim());

    if (emailDup) {
      alert('Lỗi trùng lặp: Địa chỉ email này đã tồn tại trên hệ thống!');
      return;
    }
    if (phoneDup) {
      alert('Lỗi trùng lặp: Số điện thoại này đã tồn tại trên hệ thống!');
      return;
    }

    const updated = {
      ...selectedEmp,
      ...formFields,
      statusLabel: formFields.status === 'active' ? 'Hoạt động' : 'Bị khóa',
      updatedDate: new Date().toLocaleDateString('vi-VN')
    };
    setEmployees(employees.map(e => e.id === selectedEmp.id ? updated : e));
    setSelectedEmp(updated);
    setActiveView('detail');
    triggerToast(`Đã lưu thay đổi hồ sơ nhân viên ${updated.name}`);
  };

  const handleToggleLockStatus = () => {
    const isCurrentlyActive = selectedEmp.status === 'active';
    const actionMessage = isCurrentlyActive 
      ? `Bạn có chắc chắn muốn KHÓA tài khoản của nhân viên ${selectedEmp.name}? Nhân viên này sẽ không thể đăng nhập vào hệ thống.`
      : `Bạn có chắc chắn muốn MỞ KHÓA tài khoản của nhân viên ${selectedEmp.name}?`;
    
    if (window.confirm(actionMessage)) {
      const nextStatus = isCurrentlyActive ? 'locked' : 'active';
      const updated = {
        ...selectedEmp,
        status: nextStatus,
        statusLabel: nextStatus === 'active' ? 'Hoạt động' : 'Bị khóa',
        updatedDate: new Date().toLocaleDateString('vi-VN')
      };
      setEmployees(employees.map(e => e.id === selectedEmp.id ? updated : e));
      setSelectedEmp(updated);
      triggerToast(`Đã ${nextStatus === 'active' ? 'MỞ KHÓA' : 'TẠM KHÓA'} tài khoản của ${selectedEmp.name}`);
    }
  };

  // Filters computed
  const filteredEmployees = employees.filter(emp => {
    const matchesName = emp.name.toLowerCase().includes(searchName.toLowerCase()) || emp.id.toLowerCase().includes(searchName.toLowerCase());
    const matchesEmail = emp.email.toLowerCase().includes(searchEmail.toLowerCase());
    const matchesStatus = searchStatus === '' || emp.status === searchStatus;
    return matchesName && matchesEmail && matchesStatus;
  });

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* Toast Announcement */}
      {toast && (
        <div className="fixed top-20 right-4 bg-slate-900 border border-slate-700 text-white px-5 py-3 rounded-lg shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#fea619]" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      {/* VIEW: 1. LIST EMPLOYEES */}
      {activeView === 'list' && (
        <>
          <div className="flex justify-between items-center bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
            <div>
              <h2 className="text-xl font-bold text-[#00236f] flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-650" />
                QUẢN LÝ TÀI KHOẢN NHÂN VIÊN
              </h2>
              <p className="text-xs text-slate-500 mt-1">Đăng ký thành viên điều phối cơ động, lễ tân cửa phòng bãi và kỹ thuật bảo dưỡng.</p>
            </div>
            <button 
              onClick={handleOpenAdd}
              className="px-4 py-2.5 bg-[#00236f] hover:bg-[#fea619] text-white hover:text-slate-950 text-xs font-black rounded-lg transition active:scale-95 cursor-pointer"
            >
              + THÊM NHÂN VIÊN MỚI
            </button>
          </div>

          {/* Table Search & Filter box */}
          <div className="bg-white p-4.5 border border-slate-200 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center text-xs font-semibold">
            {/* Họ tên / id filter */}
            <div className="relative w-full md:flex-1 font-sans">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Tìm họ tên, mã số nhân viên..."
                className="w-full bg-slate-50 border border-slate-205 pl-10 pr-4 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
            </div>
            
            {/* Email filter */}
            <div className="relative w-full md:w-64 font-sans">
              <input 
                type="text" 
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Tìm email nhân viên..."
                className="w-full bg-slate-50 border border-slate-205 pl-4 pr-4 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
            </div>

            {/* Trạng thái filter */}
            <div className="w-full md:w-48 font-sans">
              <select 
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
                className="w-full bg-white border border-slate-205 p-2 rounded-lg cursor-pointer text-xs font-semibold"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="locked">Bị khóa</option>
              </select>
            </div>
          </div>

          {/* Table Card layout */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto w-full shadow-sm text-xs">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-rose-50">
                  <th className="px-6 py-4">Họ tên</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Số điện thoại</th>
                  <th className="px-6 py-4 text-center">Trạng thái tài khoản</th>
                  <th className="px-6 py-4 text-center">Ngày tạo</th>
                  <th className="px-6 py-4 text-right">Xem chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-650">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center italic text-slate-400">
                      Không tìm thấy dữ liệu nhân viên trùng khớp.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-[#00236f] font-black text-[10.5px] items-center justify-center flex shrink-0">
                            {emp.initials}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 text-xs block">{emp.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono font-bold block">{emp.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{emp.email}</td>
                      <td className="px-6 py-4 text-slate-700 font-mono font-medium">{emp.phone}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-0.5 rounded text-[9.5px] font-black uppercase border ${
                          emp.status === 'active' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {emp.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-500 font-medium">{emp.createdDate || '12/01/2024'}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleOpenDetail(emp)}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-[#fea619] hover:text-[#2a1700] text-slate-800 font-black rounded-lg text-[10px] uppercase transition cursor-pointer border border-slate-205"
                        >
                          xem chi tiết nhân viên
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

      {/* VIEW: 2. DETAILED SCREEN FOR STAFF */}
      {activeView === 'detail' && selectedEmp && (
        <div className="space-y-6 bg-white border border-slate-205 p-6 rounded-2xl shadow-xs">
          
          <div className="flex items-center justify-between border-b pb-4">
            <button 
              onClick={() => setActiveView('list')}
              className="text-xs font-black text-slate-500 hover:text-slate-905 flex items-center gap-1.5 cursor-pointer uppercase tracking-widest"
            >
              
              QUAY LẠI DANH SÁCH NHÂN SỰ
            </button>
            <span className="font-mono text-xs text-slate-400 font-bold uppercase">HỒ SƠ NHÂN VIÊN</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
            
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] bg-slate-900 text-white font-mono px-2.5 py-1 rounded font-bold uppercase">{selectedEmp.id}</span>
                <span className={`inline-flex px-2.5 py-0.5 rounded text-[9.5px] font-black uppercase border ${
                  selectedEmp.status === 'active' 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {selectedEmp.statusLabel}
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900 leading-none">{selectedEmp.name}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Địa chỉ thư điện tử:</span>
                  <span className="text-slate-800 text-xs font-black block">{selectedEmp.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Số điện thoại liên lạc:</span>
                  <span className="text-slate-800 text-xs font-black block">{selectedEmp.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Mã số căn cước CCCD:</span>
                  <span className="text-slate-800 text-xs font-black block font-mono">{selectedEmp.cccd || '31295500021A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Địa chỉ thường trú:</span>
                  <span className="text-slate-800 text-xs font-black block">{selectedEmp.address || 'Quận 1, TP Hồ Chí Minh'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Vị trí đảm nhận:</span>
                  <span className="text-slate-800 text-xs font-black block">{selectedEmp.role}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Ngày tạo hồ sơ (Gia nhập):</span>
                  <span className="text-slate-800 text-xs font-black block">{selectedEmp.createdDate || '12/01/2024'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Ngày cập nhật gần nhất:</span>
                  <span className="text-slate-800 text-xs font-black block">{selectedEmp.updatedDate || selectedEmp.createdDate || '12/01/2024'}</span>
                </div>
              </div>

            </div>

            {/* Actions are only allowed here */}
            <div className="p-4.5 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-[10px] font-black text-slate-450 uppercase block mb-3">TÁC ĐỘNG HỒ SƠ</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-4">
                  Sửa đổi thông số bảo mật, luân chuyển văn phòng hoặc tạm khóa tài khoản khi có bận mát nhân viên.
                </p>
              </div>

              <div className="space-y-2.5 text-center font-bold">
                <button 
                  onClick={handleOpenEdit}
                  className="w-full py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-905 transition cursor-pointer"
                >
                  📝 CẬP NHẬT THÔNG TIN
                </button>
                <button 
                  onClick={handleToggleLockStatus}
                  className={`w-full py-2.5 rounded-lg border transition cursor-pointer ${
                    selectedEmp.status === 'active' 
                      ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100' 
                      : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {selectedEmp.status === 'active' ? '🔒 KHÓA TÀI KHOẢN' : '🔓 MỞ KHÓA TÀI KHOẢN'}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW: 3. ADD FORM STYLE */}
      {activeView === 'add' && (
        <form onSubmit={handleSaveAdd} className="bg-white border border-slate-205 p-6 rounded-2xl shadow-sm text-xs space-y-5 font-semibold text-slate-700">
          <div>
            <h3 className="text-sm font-bold text-[#00236f] uppercase leading-none">Tuyển dụng / Biên chế nhân sự mới</h3>
            <p className="text-[11px] text-slate-400 mt-1">Lập tài khoản phân quyền vai trò phòng ban.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label>Họ và tên nhân viên <span className="text-rose-500">*</span></label>
              <input 
                type="text" required value={formFields.name}
                onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                placeholder="Ví dụ: Nguyễn Văn B"
                className="p-2.5 border rounded-lg text-slate-900 font-bold"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label>Địa chỉ email liên hệ <span className="text-rose-500">*</span></label>
              <input 
                type="email" required value={formFields.email}
                onChange={(e) => setFormFields({ ...formFields, email: e.target.value })}
                placeholder="vd: nguyen.van.b@trent.com"
                className="p-2.5 border rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label>Số điện thoại</label>
              <input 
                type="text" value={formFields.phone}
                onChange={(e) => setFormFields({ ...formFields, phone: e.target.value })}
                placeholder="SĐT di động"
                className="p-2.5 border rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label>Mã căn cước CCCD</label>
              <input 
                type="text" value={formFields.cccd}
                onChange={(e) => setFormFields({ ...formFields, cccd: e.target.value })}
                placeholder="12 số căn cước quyết định"
                className="p-2.5 border rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label>Vị trí phân bàn giao</label>
              <select 
                value={formFields.role}
                onChange={(e) => setFormFields({ ...formFields, role: e.target.value })}
                className="p-2.5 border rounded-lg bg-white cursor-pointer font-bold"
              >
                <option value="Điều phối">Điều phối hành trình</option>
                <option value="Kế toán">Kế toán thanh quỹ</option>
                <option value="CSKH">Chăm sóc CSKH</option>
                <option value="Kỹ thuật viên">Kỹ thuật viên phòng máy</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label>Địa chỉ nhà ở</label>
              <input 
                type="text" value={formFields.address}
                onChange={(e) => setFormFields({ ...formFields, address: e.target.value })}
                placeholder="Địa chỉ thường trú"
                className="p-2.5 border rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label>Mật khẩu đăng nhập <span className="text-slate-400">(Mặc định: trent12345)</span></label>
              <input 
                type="password" value={formFields.password}
                onChange={(e) => setFormFields({ ...formFields, password: e.target.value })}
                placeholder="••••••••"
                className="p-2.5 border rounded-lg font-mono font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button" onClick={() => setActiveView('list')}
              className="px-4.5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 bg-[#00236f] text-white font-black rounded-lg shadow-sm"
            >
              GHI DANH NHÂN SỰ
            </button>
          </div>
        </form>
      )}

      {/* VIEW: 4. EDIT FORM STYLE */}
      {activeView === 'edit' && (
        <form onSubmit={handleSaveEdit} className="bg-white border border-slate-205 p-6 rounded-2xl shadow-sm text-xs space-y-5 font-semibold text-slate-700">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase">Sửa đổi thông số hồ sơ {selectedEmp.name}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Điều chế chi tiết số thẻ căn cước, điện thoại, hoặc lốt kệ cắm.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 col-span-2">
              <label>Họ và tên nhân sự</label>
              <input 
                type="text" required value={formFields.name}
                onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                className="p-2.5 border rounded-lg text-slate-900 font-bold text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label>Số điện thoại liên hệ</label>
              <input 
                type="text" value={formFields.phone}
                onChange={(e) => setFormFields({ ...formFields, phone: e.target.value })}
                className="p-2.5 border rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label>Vị trí ban điều khiển</label>
              <select 
                value={formFields.role}
                onChange={(e) => setFormFields({ ...formFields, role: e.target.value })}
                className="p-2.5 border rounded-lg bg-white cursor-pointer"
              >
                <option value="Điều phối">Điều phối</option>
                <option value="Kế toán">Kế toán</option>
                <option value="CSKH">CSKH</option>
                <option value="Kỹ thuật viên">Kỹ thuật viên</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button" onClick={() => setActiveView('detail')}
              className="px-4.5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg"
            >
              Quay về chi tiết
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-black rounded-lg"
            >
              XÁC NHẬN SỬA ĐỒI
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
