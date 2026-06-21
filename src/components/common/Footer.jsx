import React from 'react';
import { Camera, Mail, Phone, MapPin, ShieldAlert } from 'lucide-react';

const FacebookIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export default function Footer({ onNavToPage, userRole, onRoleToggle }) {
  const handleNavClick = (page, e) => {
    e.preventDefault();
    onNavToPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111318] text-[#e0e2ee] pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Main Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <a href="#" onClick={(e) => handleNavClick('home', e)} className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-[#fea619] rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-[#2a1700]" />
              </div>
              <span className="text-lg font-black text-white">T-Rent</span>
            </a>
            <p className="text-xs text-[#a0a2af] leading-relaxed max-w-sm">
              Showroom T-Rent - Địa chỉ cho thuê máy ảnh, ống kính, thiết bị sản xuất phim truyền thông chất lượng cao, an toàn bảo mật, cọc thanh toán cực kỳ tinh gọn tại Việt Nam.
            </p>
          </div>

          {/* Quick Nav Col */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Khám phá</h4>
            <ul className="space-y-2 text-xs text-[#a0a2af]">
              <li><a href="#" onClick={(e) => handleNavClick('home', e)} className="hover:text-[#fea619] transition">Trang chủ</a></li>
              <li><a href="#" onClick={(e) => handleNavClick('equipments', e)} className="hover:text-[#fea619] transition">Danh sách thiết bị</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); const sec = document.getElementById('rental-process'); if (sec) sec.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#fea619] transition">Quy trình giao nhận</a></li>
            </ul>
          </div>

          {/* Legal Agreement policy */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Hỗ trợ & Quy chế</h4>
            <ul className="space-y-2 text-xs text-[#a0a2af]">
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Quy định đặt thế tài đặt cọc: Cọc 100% bằng tiền mặt tương xứng giá trị hao hụt hoặc giấy tờ sở hữu xe môtô, ô tô tương đương, hoặc chiết khấu ưu đãi miễn cọc với Khách hàng uy tín tích lũy.'); }} className="hover:text-[#fea619] transition">Quy chế đặt cọc an toàn</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Chính sách đền bù mất mát hỏng hóc: Khách hàng chịu trách nhiệm nếu hỏng hóc sensor, vỡ kính quang học thấu kính hoặc rớt nước vô máy.'); }} className="hover:text-[#fea619] transition">Chính sách đền bù lỗi vật lý</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Tổng đài hỗ trợ sự cố kỹ thuật túc trực 24/7 hotline 1900-XXXX.'); }} className="hover:text-[#fea619] transition">Hotline hỗ trợ kỹ thuật</a></li>
            </ul>
          </div>

          {/* Location & Showroom details */}
          <div className="space-y-3 text-xs text-[#a0a2af]">
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-display">Liên hệ Showroom</h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 shrink-0 text-[#fea619] mt-0.5" />
              <span>Số 18, Đường 3/2, Quận 10, Thành phố Hồ Chí Minh</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#fea619]" />
              <span>Hotline đặt lịch: 090 123 4567</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#fea619]" />
              <span>contact@t-rent.vn</span>
            </div>
          </div>

        </div>

        {/* Bottom divider and copyright */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#a0a2af]">
          <span>© 1998 - 2026 T-Rent JSC. Hệ thống dữ liệu T-Rent được thiết kế và bảo hộ bản quyền.</span>
          <div className="flex items-center gap-4">
            <FacebookIcon className="w-4 h-4 hover:text-[#fea619] cursor-pointer" />
            <YoutubeIcon className="w-4 h-4 hover:text-[#fea619] cursor-pointer" />
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Yên tâm thuê máy
            </span>
          </div>
        </div>

        {onRoleToggle && (
          <div className="mt-6 pt-4 border-t border-gray-950 flex flex-wrap gap-4 items-center justify-center md:justify-start text-[11px] text-[#717482]">
            <span>Chuyển chế độ xem mô phỏng:</span>
            <button 
              onClick={() => onRoleToggle('customer')} 
              className={`hover:text-white transition cursor-pointer font-semibold ${userRole === 'customer' ? 'text-[#fea619]' : 'text-[#a0a2af]'}`}
            >
              Khách hàng
            </button>
            <span className="text-gray-800">|</span>
            <button 
              onClick={() => onRoleToggle('staff')} 
              className={`hover:text-white transition cursor-pointer font-semibold ${userRole === 'staff' ? 'text-[#fea619]' : 'text-[#a0a2af]'}`}
            >
              Nhân viên
            </button>
            <span className="text-gray-800">|</span>
            <button 
              onClick={() => onRoleToggle('admin')} 
              className={`hover:text-white transition cursor-pointer font-semibold ${userRole === 'admin' ? 'text-[#fea619]' : 'text-[#a0a2af]'}`}
            >
              Quản trị viên
            </button>
          </div>
        )}

      </div>
    </footer>
  );
}
