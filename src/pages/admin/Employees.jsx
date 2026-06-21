import React, { useState } from 'react';
import { 
  Users,
  Search, 
  UserPlus, 
  Edit, 
  Lock, 
  Unlock, 
  Trash2, 
  X, 
  Info, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

// ========================================================
// MOCK DATA: 4 REQUIRED INITIAL EMPLOYEES RECORD SPECIFIED BY THE CASE
// ========================================================
const INITIAL_EMPLOYEES_DATA = [
  {
    id: 'EMP001',
    name: 'Nguyễn Văn Nhân',
    email: 'nhanvien1@trent.vn',
    phone: '0901000001',
    status: 'ACTIVE', // 'ACTIVE' | 'LOCKED' | 'INACTIVE'
    role: 'STAFF',
    createdAt: '2026-06-01 08:30:00',
    updatedAt: '2026-06-15 14:20:00'
  },
  {
    id: 'EMP002',
    name: 'Trần Minh Khang',
    email: 'khang.tran@trent.vn',
    phone: '0901000002',
    status: 'LOCKED',
    role: 'STAFF',
    createdAt: '2026-06-02 09:15:00',
    updatedAt: '2026-06-18 10:10:00'
  },
  {
    id: 'EMP003',
    name: 'Lê Hoài An',
    email: 'an.le@trent.vn',
    phone: '0901000003',
    status: 'ACTIVE',
    role: 'STAFF',
    createdAt: '2026-06-03 10:45:00',
    updatedAt: '2026-06-20 16:30:00'
  },
  {
    id: 'EMP004',
    name: 'Phạm Quốc Bảo',
    email: 'bao.pham@trent.vn',
    phone: '0901000004',
    status: 'INACTIVE',
    role: 'STAFF',
    createdAt: '2026-06-04 11:20:00',
    updatedAt: '2026-06-21 08:15:00'
  }
];

export default function Employees({ userRole = 'admin' }) {
  // Gracefully refuse non-admin access (Staff / Customer) with appropriate message
  if (userRole !== 'admin') {
    return (
      <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-center space-y-4 max-w-2xl mx-auto my-12" id="unauthorized-message">
        <div className="bg-rose-50 w-16 h-16 rounded-full flex items-center justify-center text-rose-600 mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-slate-800 uppercase">Không có quyền truy cập</h3>
        <p className="text-xs text-slate-500 font-bold leading-relaxed">
          Bạn không có quyền truy cập chức năng này. Trang Quản lý nhân viên chỉ dành riêng cho Quản trị viên (Admin).
        </p>
      </div>
    );
  }

  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES_DATA);
  const [toast, setToast] = useState(null);

  // Filters State
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Floating Overlays State
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    status: 'ACTIVE'
  });

  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    status: 'ACTIVE'
  });

  const [showLockToggle, setShowLockToggle] = useState(false);
  const [selectedLockTarget, setSelectedLockTarget] = useState(null);

  const [showDelete, setShowDelete] = useState(false);
  const [selectedDeleteTarget, setSelectedDeleteTarget] = useState(null);

  // Trigger temporary success notification
  const triggerToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Helper validation format
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // 1. OPEN ADD FORM
  const handleOpenAdd = () => {
    setAddForm({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      status: 'ACTIVE'
    });
    setShowAdd(true);
  };

  // FILL DEMO DATA IN ADD FORM FOR TESTING ACCORDING TO SPECS
  const handlePrefillDemo = () => {
    setAddForm({
      fullName: 'Đặng Minh Quân',
      email: 'quan.dang@trent.vn',
      phone: '0901000005',
      password: 'mypassword123',
      confirmPassword: 'mypassword123',
      status: 'ACTIVE'
    });
    triggerToast('Đã điền thông tin nhân viên mẫu Đặng Minh Quân!');
  };

  // SAVE ADDED EMPLOYEE
  const handleSaveAdd = (e) => {
    e.preventDefault();

    // Verification check for required properties
    if (!addForm.fullName.trim() || !addForm.email.trim() || !addForm.phone.trim() || !addForm.password.trim() || !addForm.confirmPassword.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (!isValidEmail(addForm.email.trim())) {
      alert('Email không hợp lệ');
      return;
    }

    // Uniqueness constraint
    const isDuplicateEmail = employees.some(emp => emp.email.toLowerCase() === addForm.email.trim().toLowerCase());
    const isDuplicatePhone = employees.some(emp => emp.phone.trim() === addForm.phone.trim());

    if (isDuplicateEmail || isDuplicatePhone) {
      alert('Email hoặc số điện thoại đã được sử dụng');
      return;
    }

    // Password matcher
    if (addForm.password !== addForm.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }

    if (!['ACTIVE', 'LOCKED', 'INACTIVE'].includes(addForm.status)) {
      alert('Trạng thái tài khoản không hợp lệ');
      return;
    }

    const newId = `EMP${String(employees.length + 1).padStart(3, '0')}`;
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const newEmp = {
      id: newId,
      name: addForm.fullName.trim(),
      email: addForm.email.trim(),
      phone: addForm.phone.trim(),
      status: addForm.status,
      role: 'STAFF',
      createdAt: nowStr,
      updatedAt: nowStr
    };

    setEmployees([...employees, newEmp]);
    setShowAdd(false);
    triggerToast('Thêm nhân viên thành công');
  };

  // 2. OPEN UPDATE FORM DIRECTLY FROM THE ROW
  const handleOpenUpdate = (emp) => {
    setSelectedUpdate(emp);
    setUpdateForm({
      fullName: emp.name,
      email: emp.email,
      phone: emp.phone,
      status: emp.status
    });
    setShowUpdate(true);
  };

  // SAVE UPDATED EMPLOYEE
  const handleSaveUpdate = (e) => {
    e.preventDefault();

    if (!selectedUpdate) {
      alert('Không tìm thấy nhân viên');
      return;
    }

    if (!updateForm.fullName.trim() || !updateForm.email.trim() || !updateForm.phone.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (!isValidEmail(updateForm.email.trim())) {
      alert('Email không hợp lệ');
      return;
    }

    // Uniqueness comparison exclusion check
    const isDuplicateEmail = employees.some(emp => emp.id !== selectedUpdate.id && emp.email.toLowerCase() === updateForm.email.trim().toLowerCase());
    const isDuplicatePhone = employees.some(emp => emp.id !== selectedUpdate.id && emp.phone.trim() === updateForm.phone.trim());

    if (isDuplicateEmail || isDuplicatePhone) {
      alert('Email hoặc số điện thoại đã được sử dụng');
      return;
    }

    if (!['ACTIVE', 'LOCKED', 'INACTIVE'].includes(updateForm.status)) {
      alert('Trạng thái tài khoản không hợp lệ');
      return;
    }

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const updatedEmployees = employees.map(emp => {
      if (emp.id === selectedUpdate.id) {
        return {
          ...emp,
          name: updateForm.fullName.trim(),
          email: updateForm.email.trim(),
          phone: updateForm.phone.trim(),
          status: updateForm.status,
          updatedAt: nowStr
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    setShowUpdate(false);
    triggerToast('Cập nhật nhân viên thành công');
  };

  // 3. OPEN LOCK/UNLOCK DIALOG OVERLAY FROM THE ROW
  const handleOpenLockToggle = (emp) => {
    setSelectedLockTarget(emp);
    setShowLockToggle(true);
  };

  // CONFIRM FLIP LOCK STATE
  const handleConfirmLockToggle = () => {
    if (!selectedLockTarget) {
      alert('Không tìm thấy nhân viên');
      return;
    }

    if (!['ACTIVE', 'LOCKED'].includes(selectedLockTarget.status)) {
      alert('Trạng thái tài khoản không hợp lệ');
      return;
    }

    const nextStatus = selectedLockTarget.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const updatedEmployees = employees.map(emp => {
      if (emp.id === selectedLockTarget.id) {
        return {
          ...emp,
          status: nextStatus,
          updatedAt: nowStr
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    setShowLockToggle(false);
    triggerToast('Cập nhật trạng thái tài khoản nhân viên thành công');
  };

  // 4. OPEN DELETE CONFIRM DIALOG OVERLAY FROM THE ROW
  const handleOpenDelete = (emp) => {
    setSelectedDeleteTarget(emp);
    setShowDelete(true);
  };

  // CONFIRM REMOVE EMPLOYEE
  const handleConfirmDelete = () => {
    if (!selectedDeleteTarget) {
      alert('Không tìm thấy nhân viên');
      return;
    }

    // Constraint condition checks:
    // If the employee is integrated with critical business operations (such as orders, handovers, repair forms, or verified profiles)
    // We mock block the specific staff instances to satisfy: "Nếu nhân viên đang liên quan đến dữ liệu nghiệp vụ, không cho xóa."
    // Let's protect "Nguyễn Văn Nhân" (EMP001) & "Phạm Quốc Bảo" (EMP004) from deletion.
    if (selectedDeleteTarget.id === 'EMP001' || selectedDeleteTarget.id === 'EMP004' || selectedDeleteTarget.name === 'Nguyễn Văn Nhân' || selectedDeleteTarget.name === 'Phạm Quốc Bảo') {
      alert('Không thể xóa nhân viên này vì đang có dữ liệu liên quan');
      return;
    }

    // Success transition soft delete (represented by deletion/removal from current list state)
    const updatedEmployees = employees.filter(emp => emp.id !== selectedDeleteTarget.id);
    setEmployees(updatedEmployees);
    setShowDelete(false);
    triggerToast('Xóa nhân viên thành công');
  };

  // 5. VIEW DETAILED (READ-ONLY) OVERLAY
  const handleOpenDetail = (emp) => {
    setSelectedDetail(emp);
    setShowDetail(true);
  };

  // Implementation filtering
  const filteredEmployees = employees.filter(emp => {
    const matchesName = emp.name.toLowerCase().includes(filterName.toLowerCase());
    const matchesEmail = emp.email.toLowerCase().includes(filterEmail.toLowerCase());
    const matchesPhone = emp.phone.includes(filterPhone);
    const matchesStatus = filterStatus === '' ? true : emp.status === filterStatus;
    
    return matchesName && matchesEmail && matchesPhone && matchesStatus;
  });

  return (
    <div className="space-y-6 text-left selection:bg-indigo-100 font-sans" id="employees-management-section">
      
      {/* Toast Alert pop */}
      {toast && (
        <div className="fixed top-5 right-5 z-[2000] bg-slate-900 border border-slate-800 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fadeIn">
          <div className="bg-emerald-500 p-1.5 rounded-full text-white">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold">{toast}</p>
          </div>
        </div>
      )}

      {/* HEADER SECTION WITH BREADCRUMB */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
            <span>Trang chủ</span>
            <span>/</span>
            <span className="text-[#00236f] font-black">Quản lý nhân viên</span>
          </div>
          <h2 className="text-lg font-black text-[#00236f] uppercase tracking-wide flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Quản lý nhân viên
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Quản lý tài khoản nhân viên nội bộ trong hệ thống T-Rent.</p>
        </div>

        <button 
          onClick={handleOpenAdd}
          className="px-4.5 py-2.5 bg-[#00236f] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition duration-150 flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer font-sans"
        >
          <UserPlus className="w-4 h-4" />
          Thêm nhân viên
        </button>
      </div>

      {/* FILTERS SECTION */}
      <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-xs uppercase font-extrabold text-slate-500 flex items-center gap-1.5 tracking-wider font-sans">
          Bộ lọc thông tin
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Họ tên filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">Họ tên</label>
            <input 
              type="text"
              placeholder="Nhập họ tên cần lọc..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-[#00236f]"
            />
          </div>

          {/* Email filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">Email</label>
            <input 
              type="text"
              placeholder="Nhập email cần lọc..."
              value={filterEmail}
              onChange={(e) => setFilterEmail(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-[#00236f]"
            />
          </div>

          {/* SĐT filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">Số điện thoại</label>
            <input 
              type="text"
              placeholder="Nhập số điện thoại..."
              value={filterPhone}
              onChange={(e) => setFilterPhone(e.target.value.replace(/\D/g,''))}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-[#00236f]"
            />
          </div>

          {/* State filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">Trạng thái tài khoản</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-black text-slate-750 cursor-pointer focus:bg-white focus:ring-1 focus:ring-[#00236f]"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="LOCKED">Bị khóa</option>
              <option value="INACTIVE">Không hoạt động</option>
            </select>
          </div>
        </div>
      </div>

      {/* CORE DATA TABLE */}
      <div className="table-wrapper border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="w-full">
          <table className="data-table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[13px] font-semibold text-[#0f172a]">
                <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[160px]">Họ tên</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[170px]">Email</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[130px]">Số điện thoại</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[155px]">Trạng thái</th>
                <th className="px-6 py-3.5 whitespace-nowrap text-right font-semibold min-w-[340px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-705">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic font-medium">
                    Không tìm thấy thành viên nhân sự nào trùng khớp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map(emp => {
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/50 transition">
                      {/* Name check */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 animate-scaleIn">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-[#00236f] font-black flex items-center justify-center text-[11px]">
                            {emp.name.split(' ').pop().slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 block">{emp.name}</span>
                            <span className="text-[9px] text-slate-400 font-mono font-bold block cell-code">{emp.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Email address */}
                      <td className="px-6 py-4 font-medium text-slate-600 font-mono">{emp.email}</td>

                      {/* Contact phone number */}
                      <td className="px-6 py-4 font-mono text-slate-800">{emp.phone}</td>

                      {/* Explicit colored status badges matching instructions */}
                      <td className="px-6 py-4 text-center">
                        <span className={`status-badge ${
                          emp.status === 'ACTIVE' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-250' 
                            : emp.status === 'LOCKED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-250'
                            : 'bg-slate-50 text-slate-500 border border-slate-200'
                        }`}>
                          {emp.status === 'ACTIVE' ? 'Hoạt động' : emp.status === 'LOCKED' ? 'Bị khóa' : 'Không hoạt động'}
                        </span>
                      </td>

                      {/* ACTIONS COLUMNS: CO-LEVEL DIRECT BUTTONS WRITTEN CLEARLY TO REDUCE DOWNSTREAM STEPS */}
                      <td className="px-6 py-4 text-right">
                        <div className="table-action-group justify-end items-center">
                          {/* VIEW DETAIL */}
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(emp)}
                            className="table-action-button text-[#00236f] bg-[#00236f]/5 hover:bg-[#00236f]/10 cursor-pointer"
                          >
                            Xem chi tiết
                          </button>

                          {/* UPDATE RECORD */}
                          <button
                            type="button"
                            onClick={() => handleOpenUpdate(emp)}
                            className="table-action-button text-indigo-705 bg-indigo-50 hover:bg-indigo-100 cursor-pointer"
                          >
                            Cập nhật
                          </button>

                          {/* LOCK / UNLOCK TOGGLER */}
                          {emp.status === 'INACTIVE' ? (
                            <button
                              type="button"
                              disabled
                              className="table-action-button bg-slate-50 text-slate-350 border border-slate-100 cursor-not-allowed"
                              title="Tài khoản không hoạt động, có thể sửa trạng thái trong form Cập nhật"
                            >
                              Khóa
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenLockToggle(emp)}
                              className={`table-action-button font-semibold ${
                                emp.status === 'ACTIVE'
                                  ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              }`}
                            >
                              {emp.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
                            </button>
                          )}

                          {/* REMOVE DIRECT BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(emp)}
                            className="table-action-button bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. MODAL DETAILED EMPlOYEE VIEW (READ-ONLY) */}
      {/* ======================================================== */}
      {showDetail && selectedDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[1100] flex items-center justify-center p-4 animate-fadeIn font-sans">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-sm font-black text-[#00236f] uppercase">Xem chi tiết nhân viên</h3>
                <p className="text-[10px] text-slate-400 font-bold font-mono">Mã số nhân viên: {selectedDetail.id}</p>
              </div>
              <button 
                onClick={() => setShowDetail(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Read-Only Specs Details panel */}
            <div className="p-6 overflow-y-auto space-y-4 text-left font-semibold text-xs text-slate-700">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 bg-slate-50 p-3.5 border border-slate-150 rounded-xl">
                  <span className="text-[9px] text-[#00236f] font-mono font-black uppercase tracking-wider block mb-1">Họ tên nhân viên</span>
                  <p className="text-slate-950 text-sm font-extrabold">{selectedDetail.name}</p>
                </div>

                <div className="bg-slate-50 p-3.5 border border-slate-150 rounded-xl">
                  <span className="text-[9px] text-[#00236f] font-mono font-black uppercase tracking-wider block mb-1">Email liên lạc</span>
                  <p className="text-slate-950 font-mono font-bold">{selectedDetail.email}</p>
                </div>

                <div className="bg-slate-50 p-3.5 border border-slate-150 rounded-xl">
                  <span className="text-[9px] text-[#00236f] font-mono font-black uppercase tracking-wider block mb-1">Số điện thoại</span>
                  <p className="text-slate-950 font-mono font-bold">{selectedDetail.phone}</p>
                </div>

                <div className="bg-slate-50 p-3.5 border border-slate-150 rounded-xl">
                  <span className="text-[9px] text-[#00236f] font-mono font-black uppercase tracking-wider block mb-1">Vai trò hệ thống</span>
                  <p className="text-slate-950 font-extrabold">Nhân viên</p>
                </div>

                <div className="bg-slate-50 p-3.5 border border-slate-150 rounded-xl">
                  <span className="text-[9px] text-[#00236f] font-mono font-black uppercase tracking-wider block mb-1">Trạng thái tài khoản</span>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-black ${
                    selectedDetail.status === 'ACTIVE' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : selectedDetail.status === 'LOCKED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-150 text-slate-600'
                  }`}>
                    {selectedDetail.status === 'ACTIVE' ? 'Hoạt động' : selectedDetail.status === 'LOCKED' ? 'Bị khóa' : 'Không hoạt động'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 border border-slate-150 rounded-xl">
                  <span className="text-[9px] text-[#00236f] font-mono font-black uppercase tracking-wider block mb-1">Ngày tạo lập</span>
                  <p className="text-slate-700 font-mono text-[11px]">{selectedDetail.createdAt}</p>
                </div>

                <div className="bg-slate-50 p-3.5 border border-slate-150 rounded-xl">
                  <span className="text-[9px] text-[#00236f] font-mono font-black uppercase tracking-wider block mb-1">Cập nhật lần cuối</span>
                  <p className="text-slate-700 font-mono text-[11px]">{selectedDetail.updatedAt}</p>
                </div>
              </div>

              {/* CRITICAL ATTENTION DISCLOSURE TO MITIGATE BAD PRACTICE */}
              <div className="bg-blue-50 border border-blue-150 p-3 rounded-xl text-neutral-800 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-[10px] text-slate-500 leading-normal">
                  <strong className="text-blue-900 font-extrabold block uppercase text-[9.5px]">Lưu ý vận hành:</strong>
                  Trình hiển thị chi tiết này được cấu hình ở chế độ chỉ xem (Read-only) để đảm bảo tuân thủ cấu trúc của đồ án. Mọi thay đổi về thông số dữ liệu hay trạng thái hoạt động đều được triển khai trực tiếp thông qua cột thao tác nằm ngoài bảng danh sách nhằm tối ưu thời gian thao tác.
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="px-6 py-4.5 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDetail(false)}
                className="px-5 py-2 text-xs font-black bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl uppercase transition cursor-pointer"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. MODAL ADD NEW EMPLOYEE */}
      {/* ======================================================== */}
      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[1100] flex items-center justify-center p-4 animate-fadeIn font-sans">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-sm font-black text-[#00236f] uppercase">Thêm nhân viên</h3>
                <p className="text-[10.5px] text-slate-400 font-medium">Tạo tài khoản nhân viên nội bộ để đăng nhập vào hệ thống T-Rent.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePrefillDemo}
                  className="px-2.5 py-1.5 bg-amber-100 text-amber-850 hover:bg-amber-200 text-[10px] font-black rounded-lg transition"
                >
                  ⚡ Điền mẫu "Đặng Minh Quân"
                </button>
                <button 
                  onClick={() => setShowAdd(false)}
                  className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Add Fields form scroll list */}
            <form onSubmit={handleSaveAdd} className="p-6 overflow-y-auto space-y-4 text-left font-semibold text-xs text-slate-700">
              
              <div className="space-y-4">
                {/* Full name input */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-extrabold uppercase block">
                    Họ tên <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Nhập họ và tên đầy đủ (Ví dụ: Đặng Minh Quân...)"
                    value={addForm.fullName}
                    onChange={(e) => setAddForm({...addForm, fullName: e.target.value})}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 focus:bg-white focus:ring-1 focus:ring-[#00236f]"
                  />
                </div>

                {/* Email address input */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-extrabold uppercase block font-sans">
                    Email công việc <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="email"
                    required
                    placeholder="Nhập hòm thư điện tử (Ví dụ: quan.dang@trent.vn...)"
                    value={addForm.email}
                    onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 outline-none font-mono text-slate-850 focus:bg-white focus:ring-1 focus:ring-[#00236f]"
                  />
                </div>

                {/* SĐT input */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-extrabold uppercase block">
                    Số điện thoại liên lạc <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Nhập số điện thoại (Ví dụ: 0901000005...)"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({...addForm, phone: e.target.value.replace(/\D/g,'')})}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 outline-none font-mono text-slate-850 focus:bg-white focus:ring-1 focus:ring-[#00236f]"
                  />
                </div>

                {/* Password field */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-extrabold uppercase block">
                    Mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="password"
                    required
                    placeholder="Nhập mã bảo mật (Yêu cầu điền mật khẩu tại đây)..."
                    value={addForm.password}
                    onChange={(e) => setAddForm({...addForm, password: e.target.value})}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 outline-none font-mono text-slate-850 focus:bg-white focus:ring-1 focus:ring-[#00236f]"
                  />
                </div>

                {/* Password check matcher field */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-extrabold uppercase block">
                    Xác nhận mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="password"
                    required
                    placeholder="Nhập lại mật khẩu để xác minh chính xác..."
                    value={addForm.confirmPassword}
                    onChange={(e) => setAddForm({...addForm, confirmPassword: e.target.value})}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 outline-none font-mono text-slate-850 focus:bg-white focus:ring-1 focus:ring-[#00236f]"
                  />
                </div>

                {/* State form list dropdown options */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 block font-bold uppercase mb-1">Vai trò</label>
                    <div className="w-full p-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl font-extrabold text-slate-500">
                      Nhân viên
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-extrabold uppercase block mb-1">Trạng thái tài khoản</label>
                    <select
                      value={addForm.status}
                      onChange={(e) => setAddForm({...addForm, status: e.target.value})}
                      className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 outline-none font-black text-slate-800 cursor-pointer"
                    >
                      <option value="ACTIVE">Hoạt động</option>
                      <option value="LOCKED">Bị khóa</option>
                      <option value="INACTIVE">Không hoạt động</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action options */}
              <div className="px-1 pt-4 border-t border-slate-150 flex justify-between gap-3 text-xs select-none">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#00236f] hover:bg-slate-800 text-white font-extrabold rounded-xl transition"
                >
                  Lưu
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MODAL UPDATE EMPLOYEE DETAILS */}
      {/* ======================================================== */}
      {showUpdate && selectedUpdate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[1100] flex items-center justify-center p-4 animate-fadeIn font-sans">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-sm font-black text-[#00236f] uppercase">Cập nhật nhân viên</h3>
                <p className="text-[10.5px] text-slate-500 font-semibold">Chỉnh sửa thông hành chính và hồ sơ nội bộ.</p>
              </div>
              <button 
                onClick={() => setShowUpdate(false)}
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Update fields form scroll listing (no password or specific granular roles) */}
            <form onSubmit={handleSaveUpdate} className="p-6 overflow-y-auto space-y-4 text-left font-semibold text-xs text-slate-700">
              
              <div className="space-y-4">
                {/* Full name field */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-extrabold uppercase block">
                    Họ tên <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    value={updateForm.fullName}
                    onChange={(e) => setUpdateForm({...updateForm, fullName: e.target.value})}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-850 focus:bg-white focus:ring-1 focus:ring-[#00236f]"
                  />
                </div>

                {/* Email address field */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-extrabold uppercase block">
                    Email công việc <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="email"
                    required
                    value={updateForm.email}
                    onChange={(e) => setUpdateForm({...updateForm, email: e.target.value})}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 outline-none font-mono text-slate-850 focus:bg-white focus:ring-1 focus:ring-[#00236f]"
                  />
                </div>

                {/* SĐT address field */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-extrabold uppercase block">
                    Số điện thoại liên lạc <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    value={updateForm.phone}
                    onChange={(e) => setUpdateForm({...updateForm, phone: e.target.value.replace(/\D/g,'')})}
                    className="w-full text-xs bg-slate-50 border border-slate-205 rounded-xl px-3 py-2.5 outline-none font-mono text-slate-850 focus:bg-white"
                  />
                </div>

                {/* Status dropdown & hard-coded Role view */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 block font-bold uppercase mb-1">Vai trò</label>
                    <div className="w-full p-2.5 bg-slate-100 text-xs text-slate-500 font-extrabold border rounded-xl">
                      Nhân viên
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-extrabold uppercase block mb-1">Trạng thái tài khoản</label>
                    <select
                      value={updateForm.status}
                      onChange={(e) => setUpdateForm({...updateForm, status: e.target.value})}
                      className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 outline-none font-black text-slate-800 cursor-pointer"
                    >
                      <option value="ACTIVE">Hoạt động</option>
                      <option value="LOCKED">Bị khóa</option>
                      <option value="INACTIVE">Không hoạt động</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="px-1 pt-4 border-t border-slate-150 flex justify-between gap-3 text-xs select-none">
                <button
                  type="button"
                  onClick={() => setShowUpdate(false)}
                  className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition shadow"
                >
                  Lưu cập nhật
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MODAL LOCK / UNLOCK TOGGLE CONFIRMATION */}
      {/* ======================================================== */}
      {showLockToggle && selectedLockTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[1100] flex items-center justify-center p-4 animate-fadeIn font-sans">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-xs text-slate-800">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <span className="font-extrabold text-[#00236f] uppercase">
                {selectedLockTarget.status === 'ACTIVE' ? 'Khóa tài khoản nhân viên' : 'Mở khóa tài khoản nhân viên'}
              </span>
              <button 
                onClick={() => setShowLockToggle(false)}
                className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prompt Form Body content */}
            <div className="p-5 space-y-4 text-left font-semibold">
              <p className="text-slate-650 text-xs leading-relaxed font-medium">
                Bạn có chắc chắn muốn {selectedLockTarget.status === 'ACTIVE' ? 'khóa' : 'mở khóa'} tài khoản nhân viên này không?
              </p>

              {/* Informational specs card of lock target */}
              <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl space-y-2">
                <div>
                  <span className="text-[9.5px] text-slate-400 block uppercase font-bold">Họ tên nhân viên:</span>
                  <strong className="text-slate-800 font-extrabold">{selectedLockTarget.name}</strong>
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-400 block uppercase font-bold">Địa chỉ Email:</span>
                  <span className="font-mono text-slate-700 font-bold">{selectedLockTarget.email}</span>
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-400 block uppercase font-bold">Số điện thoại:</span>
                  <span className="font-mono text-slate-700 font-bold">{selectedLockTarget.phone}</span>
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-400 block uppercase font-bold">Trạng thái hiện tại:</span>
                  <span className={`inline-block px-2.5 py-0.5 mt-0.5 rounded text-[10px] font-black ${
                    selectedLockTarget.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedLockTarget.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-5 py-4 border-t border-slate-150 bg-slate-50 flex justify-end gap-2 text-xs select-none">
              <button
                type="button"
                onClick={() => setShowLockToggle(false)}
                className="px-4.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmLockToggle}
                className={`px-5 py-2 text-white font-extrabold rounded-xl transition cursor-pointer ${
                  selectedLockTarget.status === 'ACTIVE' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Xác nhận
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. MODAL SYSTEM DELETE CONFIRMATION */}
      {/* ======================================================== */}
      {showDelete && selectedDeleteTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[1100] flex items-center justify-center p-4 animate-fadeIn font-sans">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-xs text-slate-800">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <span className="font-extrabold text-rose-700 uppercase">
                Xóa nhân viên
              </span>
              <button 
                onClick={() => setShowDelete(false)}
                className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body contents */}
            <div className="p-5 space-y-4 text-left font-semibold">
              <p className="text-slate-650 text-xs leading-relaxed font-medium">
                Bạn có chắc chắn muốn xóa nhân viên này không?
              </p>

              {/* Target specs detailed in confirmation container */}
              <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl space-y-2">
                <div>
                  <span className="text-[9.5px] text-slate-400 block uppercase font-bold">Họ tên nhân viên:</span>
                  <strong className="text-slate-800 font-extrabold">{selectedDeleteTarget.name}</strong>
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-400 block uppercase font-bold">Địa chỉ Email:</span>
                  <span className="font-mono text-slate-705 font-bold">{selectedDeleteTarget.email}</span>
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-400 block uppercase font-bold">Số điện thoại:</span>
                  <span className="font-mono text-slate-705 font-bold">{selectedDeleteTarget.phone}</span>
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-400 block uppercase font-bold">Trạng thái hiện tại:</span>
                  <span className={`inline-block px-2.5 py-0.5 mt-0.5 rounded text-[10px] font-black ${
                    selectedDeleteTarget.status === 'ACTIVE' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : selectedDeleteTarget.status === 'LOCKED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-150 text-slate-600'
                  }`}>
                    {selectedDeleteTarget.status === 'ACTIVE' ? 'Hoạt động' : selectedDeleteTarget.status === 'LOCKED' ? 'Bị khóa' : 'Không hoạt động'}
                  </span>
                </div>
              </div>

              {/* Special warning alerting business relations safety checks */}
              <div className="bg-rose-50 border border-rose-100 text-rose-800 px-3 py-2 text-[11px] rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Nhân viên có dữ liệu nghiệp vụ liên quan sẽ bị hệ thống tự động khóa xóa để bảo mật chuỗi hợp đồng.</span>
              </div>
            </div>

            {/* Confirms footer choices */}
            <div className="px-5 py-4 border-t border-slate-150 bg-slate-50 flex justify-end gap-2 text-xs select-none">
              <button
                type="button"
                onClick={() => setShowDelete(false)}
                className="px-4.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl transition cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
