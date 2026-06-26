import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, Mail, Phone, Lock, Calendar, ClipboardList, CreditCard, FileText, RefreshCw, AlertTriangle } from 'lucide-react';
import customerApi from '../../api/customerApi';

export default function Profile({ user, userVerified, onSave, setActivePage }) {
  const [name, setName] = useState(user?.fullName || user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [identityNumber, setIdentityNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const res = await customerApi.getAccount();
        const data = res.data?.data;
        if (data) {
          setName(data.ho_ten || data.fullName || '');
          setPhone(data.so_dien_thoai || data.phone || '');
          setEmail(data.email || '');
          setAddress(data.ho_so_khach_hang?.dia_chi || data.profile?.address || '');
          setIdentityNumber(data.ho_so_khach_hang?.so_cccd || data.profile?.identityNumber || '');
        }
      } catch (err) {
        setFetchError('Không thể tải thông tin tài khoản');
      } finally {
        setLoading(false);
      }
    };
    fetchAccount();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaveError(null);
      await customerApi.updateProfile({ address, identityNumber });
      if (onSave) onSave({ name, phone });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Cập nhật hồ sơ thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LHS Side Tab links (Col 3) */}
        <div className="lg:col-span-3 space-y-3.5 select-none font-sans">
          <div className="bg-white border border-[#c5c5d3] rounded-2xl p-5 shadow-xs text-center space-y-4">
            <div className="w-20 h-20 bg-[#00236f]/10 border-2 border-[#00236f] text-[#00236f] rounded-full flex items-center justify-center font-black mx-auto text-2xl relative">
              {name.charAt(0)}
              {userVerified && (
                <span className="absolute bottom-0 right-0 bg-[#fea619] text-[#2a1700] rounded-full p-1 border-2 border-white shadow-md">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </span>
              )}
            </div>
            <div>
              <h3 className="text-base font-black text-[#00236f] leading-snug">{name}</h3>
              <p className="text-[10px] text-gray-400 font-medium">{email}</p>
            </div>
            {/* Status */}
            {userVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 text-green-700 text-[10.5px] font-black rounded-full shadow-sm animate-pulse">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                ĐÃ XÁC MINH HỒ SƠ
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10.5px] font-bold rounded-full">
                ⚠️ CHƯA XÁC MINH DANH TÍNH
              </span>
            )}
          </div>

          <div className="bg-white border border-[#c5c5d3] rounded-2xl overflow-hidden shadow-xs">
            <div className="flex flex-col text-xs font-bold divide-y divide-gray-100 text-gray-650">
              <button
                onClick={() => setActivePage('profile')}
                className="flex items-center gap-3 px-5 py-4 bg-[#00236f]/5 text-[#00236f] font-black text-left border-l-4 border-[#00236f]"
              >
                <User className="w-4 h-4 text-[#00236f]" />
                Thông tin cá nhân tài khoản
              </button>
              <button
                onClick={() => setActivePage('verification')}
                className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 text-left transition text-gray-700"
              >
                <CreditCard className="w-4 h-4 text-[#00236f]" />
                Hồ sơ pháp lý xác minh (KYC)
              </button>
              <button
                onClick={() => setActivePage('orders')}
                className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 text-left transition text-gray-700"
              >
                <ClipboardList className="w-4 h-4 text-[#00236f]" />
                Đơn hàng thuê của tôi
              </button>
              <button
                onClick={() => alert('Mục Lịch sử giao dịch ví thanh toán đang được tiến hành cập nhật bản nâng cao!')}
                className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 text-left transition text-gray-700"
              >
                <FileText className="w-4 h-4 text-[#00236f]" />
                Lịch sử thanh toán & Hợp đồng
              </button>
            </div>
          </div>
        </div>

        {/* RHS: Form information container (Col 9) */}
        <div className="lg:col-span-9 bg-white border border-[#c5c5d3] rounded-2xl p-6 md:p-8 shadow-xs">
          <div className="border-b border-gray-150 pb-4 mb-6">
            <h2 className="text-xl font-black text-[#00236f] font-sans flex items-center gap-2">
              <User className="text-[#fea619] w-6 h-6" />
              THÔNG TIN CÁ NHÂN CHỦ TÀI KHOẢN
            </h2>
            <p className="text-xs text-gray-500 mt-1">Cập nhật hồ sơ thông số cá nhân để showroom lập hợp đồng dịch vụ chính chủ nhanh chóng.</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <RefreshCw className="w-8 h-8 text-[#00236f] animate-spin mb-4" />
              <p className="text-sm text-slate-500 font-semibold">Đang tải thông tin tài khoản...</p>
            </div>
          ) : (
          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Avatar display */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-[#00236f] text-white rounded-full flex items-center justify-center font-black text-xl shadow-inner">
                {(name || 'K').charAt(0)}
              </div>
            </div>

            {/* Success/Error messages */}
            {isSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                Cập nhật hồ sơ thành công
              </div>
            )}
            {saveError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 font-bold rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{saveError}</span>
              </div>
            )}
            {fetchError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 font-bold rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{fetchError}</span>
              </div>
            )}

            {/* Inputs wrap */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              
              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                  <User className="w-4 text-gray-400 h-4" />
                  Họ và tên (Readonly):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    value={name}
                    className="w-full h-11 px-3 bg-gray-100 border border-gray-200 text-gray-500 rounded-lg text-xs font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                  <Phone className="w-4 text-gray-400 h-4" />
                  Số điện thoại (Readonly):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    value={phone}
                    className="w-full h-11 px-3 bg-gray-100 border border-gray-200 text-gray-500 rounded-lg text-xs font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                  <Mail className="w-4 text-gray-400 h-4" />
                  Địa chỉ Email (Readonly):
                </label>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full h-11 px-3 bg-gray-100 border border-gray-200 text-gray-400 rounded-lg text-xs font-semibold cursor-not-allowed"
                  />
                  <Lock className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 shrink-0" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold text-gray-500 uppercase flex items-center gap-1.5">
                  <User className="w-4 text-[#00236f] h-4" />
                  Địa chỉ liên hệ:
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập địa chỉ liên hệ"
                  className="w-full h-11 px-3 bg-gray-50 border border-gray-300 focus:border-[#00236f] focus:outline-none rounded-lg text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold text-gray-500 uppercase flex items-center gap-1.5">
                  <CreditCard className="w-4 text-[#fea619] h-4" />
                  Số giấy tờ định danh (CCCD):
                </label>
                <input
                  type="text"
                  value={identityNumber}
                  onChange={(e) => setIdentityNumber(e.target.value)}
                  placeholder="Nhập số CCCD/CMND"
                  className="w-full h-11 px-3 bg-gray-50 border border-gray-300 focus:border-[#00236f] focus:outline-none rounded-lg text-xs font-semibold"
                />
              </div>

            </div>

            {/* Verification prompt call out if unverified */}
            {!userVerified && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center gap-4 text-xs text-amber-900 leading-relaxed">
                <div>
                  <span className="font-extrabold text-amber-950 block">⚠️ Tài khoản chưa kích hoạt xác minh pháp lý CCCD</span>
                  Để nâng cao hạn mức cọc thuê thiết bị lên tới 35 Triệu và nhận máy cực lẹ, xin mời bạn nhấp cập nhật KYC.
                </div>
                <button type="button" onClick={() => setActivePage('verification')} className="px-4 py-2 bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] text-xs font-black rounded-lg transition shrink-0 whitespace-nowrap">
                  Kích hoạt ngay
                </button>
              </div>
            )}

            {/* Actions button */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving || loading}
                className="px-6 py-3 bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] text-xs font-black rounded-lg transition-all shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Đang lưu...' : 'LƯU THAY ĐỔI CẬP NHẬT'}
              </button>
            </div>

          </form>
          )}
        </div>

      </div>
    </div>
  );
}
