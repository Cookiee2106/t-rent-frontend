import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Calendar, 
  AlertCircle, 
  Check, 
  ArrowRight,
  ChevronRight,
  UserCheck, 
  Grid, 
  History, 
  Clock, 
  ShieldAlert, 
  Info, 
  Lock, 
  CheckCircle2, 
  Wallet, 
  QrCode, 
  Building,
  AlertTriangle,
  XCircle
} from 'lucide-react';

export default function Cart({
  cartItems: externalCartItems,
  onRemoveItem: externalOnRemoveItem,
  onProceedToCheckout,
  setActivePage,
  user: externalUser,
  userVerified: externalUserVerified,
  setOrders,
  orders = [],
  setCartItems
}) {
  // 1. CHUẨN HÓA THÔNG TIN KHÁCH HÀNG & TRẠNG THÁI XÁC MINH
  // Bắt buộc Khách hàng: Nguyễn Văn A, Email: nguyenvana@example.com, Trạng thái xác minh: Đã duyệt
  const [currentUser, setCurrentUser] = useState({
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    verified: true // 'Đã duyệt'
  });

  // Hỗ trợ cập nhật thông tin người dùng nếu nhận từ App.jsx
  useEffect(() => {
    if (externalUser) {
      setCurrentUser(prev => ({
        ...prev,
        name: externalUser.name || prev.name,
        email: externalUser.email || prev.email
      }));
    }
  }, [externalUser]);

  // Xác định trạng thái xác minh từ prop được truyền từ App.jsx
  const isVerified = externalUserVerified !== undefined ? externalUserVerified : true;

  // 2. DANH SÁCH SẢN PHẨM GIỎ HÀNG (MOCK KHỞI TẠO BẮT BUỘC 2 DÒNG COMBO SONY & FUJI)
  const [items, setItems] = useState([
    {
      cartItemId: "CI001",
      productModel: "Sony A7 IV",
      brand: "Sony",
      category: "Body máy ảnh",
      quantity: 1,
      startDate: "2026-06-20",
      endDate: "2026-06-23",
      rentalDays: 3,
      dailyPriceSnapshot: 800000,
      rentalAmount: 2400000,
      depositAmountSnapshot: 3000000,
      availableSnapshot: "Còn thiết bị", // Badge trạng thái khả dụng chỉ dùng: "Còn thiết bị" | "Không đủ số lượng khả dụng" | "Thông tin thuê không hợp lệ"
      image: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600",
      bundleText: "Pin NP-FZ100 x1 • Lens 24-70 GM x1 • Túi Sony x1"
    },
    {
      cartItemId: "CI002",
      productModel: "Fuji X-T5",
      brand: "Fujifilm",
      category: "Body máy ảnh",
      quantity: 1,
      startDate: "2026-06-20",
      endDate: "2026-06-23",
      rentalDays: 3,
      dailyPriceSnapshot: 700000,
      rentalAmount: 2100000,
      depositAmountSnapshot: 3000000,
      availableSnapshot: "Còn thiết bị",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600",
      bundleText: "Pin Fuji NP-W235 x1 • Lens XF 35mm x1 • Túi Fuji x1"
    }
  ]);

  // 3. CÁC STATE PHỤC VỤ THAO TÁC & HOẠT ĐỘNG
  const [feedback, setFeedback] = useState({ success: '', error: '' });
  const [itemToDelete, setItemToDelete] = useState(null); // Lưu thông tin item chuẩn bị xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Stepper đặt thuê (Các bước: 0 = Cart chính, 1 = Xác nhận, 2 = Điều khoản, 3 = OTP, 4 = Thanh toán cọc, 5 = Thành công)
  const [checkoutStep, setCheckoutStep] = useState(0); 

  // Form states của Stepper
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpTimer, setOtpTimer] = useState(115); // s
  const [otpAttempts, setOtpAttempts] = useState(0);

  // Phương thức thanh toán cọc giữ chỗ (chỉ dùng VNPAY Sandbox trực tuyến)
  const [paymentMethod, setPaymentMethod] = useState('online'); 
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [vnpayState, setVnpayState] = useState(null); // null, 'redirecting', 'simulating', 'failed'

  // Đơn hàng kết quả thành công
  const [createdOrder, setCreatedOrder] = useState(null);

  // Quản lý đếm ngược OTP
  useEffect(() => {
    let interval = null;
    if (checkoutStep === 3 && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [checkoutStep, otpTimer]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 4. BIỂU THỨC RECOMPUTE CÁC CHỈ SỐ TIỀN BẠC & SỐ LƯỢNG
  // Tính toán lại dải ngày, tiền thuê sườn và trạng thái khi có sự thay đổi
  const handleDateChange = (cartItemId, field, val) => {
    setFeedback({ success: '', error: '' });
    setItems(prevItems => prevItems.map(item => {
      if (item.cartItemId === cartItemId) {
        const updated = { ...item, [field]: val };
        
        if (updated.startDate && updated.endDate) {
          const start = new Date(updated.startDate);
          const end = new Date(updated.endDate);
          const diffMs = end.getTime() - start.getTime();
          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          
          if (diffDays > 0) {
            updated.rentalDays = diffDays;
            updated.rentalAmount = updated.dailyPriceSnapshot * diffDays * updated.quantity;
            // Áp dụng luật số lượng khả dụng
            if (updated.quantity > 3) {
              updated.availableSnapshot = "Không đủ số lượng khả dụng";
            } else {
              updated.availableSnapshot = "Còn thiết bị";
            }
          } else {
            updated.rentalDays = 0;
            updated.rentalAmount = 0;
            updated.availableSnapshot = "Thông tin thuê không hợp lệ";
          }
        } else {
          updated.rentalDays = 0;
          updated.rentalAmount = 0;
          updated.availableSnapshot = "Thông tin thuê không hợp lệ";
        }
        return updated;
      }
      return item;
    }));
  };

  const handleQtyChange = (cartItemId, newQty) => {
    setFeedback({ success: '', error: '' });
    if (newQty < 1) return;
    
    setItems(prevItems => prevItems.map(item => {
      if (item.cartItemId === cartItemId) {
        const updated = { ...item, quantity: Number(newQty) };
        updated.depositAmountSnapshot = 3000000 * updated.quantity; // Scale deposit with quantity
        
        if (updated.rentalDays > 0) {
          updated.rentalAmount = updated.dailyPriceSnapshot * updated.rentalDays * updated.quantity;
          if (updated.quantity > 3) {
            updated.availableSnapshot = "Không đủ số lượng khả dụng";
          } else {
            updated.availableSnapshot = "Còn thiết bị";
          }
        } else {
          updated.rentalAmount = 0;
          updated.availableSnapshot = "Thông tin thuê không hợp lệ";
        }
        return updated;
      }
      return item;
    }));
  };

  // Tính tổng
  const totalItemsCount = items.length;
  const totalQuantitySum = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalRentalSum = items.reduce((sum, i) => sum + i.rentalAmount, 0);
  const totalDepositSum = items.reduce((sum, i) => sum + i.depositAmountSnapshot, 0);
  const totalPayablePre = totalDepositSum; // Tiền cọc giữ chỗ là số tiền cần thanh toán trước

  // Kiểm tra tính hợp lệ toàn giỏ hàng để enable nút Đặt thuê
  const isEveryItemAvailable = items.length > 0 && items.every(i => i.availableSnapshot === "Còn thiết bị");
  const isEveryDateValid = items.length > 0 && items.every(i => i.rentalDays > 0);
  const isCartValidToCheckout = isEveryItemAvailable && isEveryDateValid;

  // 5. NGHIỆP VỤ XÓA SẢN PHẨM KHỎI GIỎ HÀNG
  const triggerDeleteConfirm = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    const targetId = itemToDelete.cartItemId;
    
    setItems(prev => prev.filter(i => i.cartItemId !== targetId));
    setShowDeleteModal(false);
    setItemToDelete(null);
    
    setFeedback({
      success: "Xóa sản phẩm khỏi giỏ hàng thành công",
      error: ""
    });
    
    // Nếu có hỗ trợ App.js synced
    if (externalOnRemoveItem) {
      // Find index
      const idx = items.findIndex(i => i.cartItemId === targetId);
      if (idx !== -1) {
        externalOnRemoveItem(idx);
      }
    }
  };

  // 6. NGHIỆP VỤ BẤM NÚT ĐẶT THUÊ (TIẾN HÀNH KIỂM TRA ĐIỀU KIỆN & STEPS CHUYỂN HOÁ)
  const handleProceedToRent = () => {
    setFeedback({ success: '', error: '' });

    // Quy tắc: Nếu khách hàng chưa xác minh, vẫn hiển thị nút [Đặt thuê] nhưng khi bấm thì báo lỗi
    if (!isVerified) {
      setFeedback({
        success: '',
        error: "Vui lòng xác minh tài khoản trước khi đặt thuê"
      });
      return;
    }

    if (!currentUser) {
      setFeedback({ success: '', error: "Vui lòng đăng nhập để đặt thuê" });
      return;
    }

    if (items.length === 0) {
      setFeedback({ success: '', error: "Giỏ hàng của bạn đang trống" });
      return;
    }

    if (!isEveryDateValid) {
      setFeedback({ success: '', error: "Thông tin thuê không hợp lệ" });
      return;
    }

    if (!isEveryItemAvailable) {
      setFeedback({ success: '', error: "Thiết bị hoặc phụ kiện không đủ số lượng khả dụng" });
      return;
    }

    // Nếu hợp lệ, dịch chuyển sang Bước 1: Xác nhận đặt thuê
    setCheckoutStep(1);
  };

  // Tiến sang bước 2: Điều khoản đặt thuê
  const handleStep1ToStep2 = () => {
    // Re-verify
    if (!isVerified) {
      setFeedback({ success: '', error: "Vui lòng xác minh tài khoản trước khi đặt thuê" });
      setCheckoutStep(0);
      return;
    }
    setCheckoutStep(2);
  };

  // Tiến sang bước 3: OTP đặt thuê
  const handleStep2ToStep3 = () => {
    if (!acceptedTerms) {
      setFeedback({ success: '', error: "Vui lòng đồng ý điều khoản thuê trước khi tiếp tục" });
      return;
    }
    // Gửi OTP giả lập
    setOtpValue('');
    setOtpError('');
    setOtpTimer(115);
    setOtpAttempts(0);
    setCheckoutStep(3);
  };

  // Tiến sang bước 4: Thanh toán cọc giữ chỗ
  const handleStep3ToStep4 = () => {
    if (!otpValue.trim()) {
      setOtpError("Vui lòng nhập mã OTP");
      return;
    }
    
    // Check sai số lần quá quy định
    if (otpAttempts >= 2) {
      setOtpError("Bạn đã nhập sai OTP quá số lần cho phép");
      return;
    }

    // Mã OTP bắt buộc là 123456
    if (otpValue.trim() !== '123456') {
      setOtpError("Mã OTP không hợp lệ hoặc đã hết hạn");
      setOtpAttempts(prev => prev + 1);
      return;
    }

    setOtpError('');
    setCheckoutStep(4);
  };

  // Bấm nút đóng kịch bản checkout quay lại giỏ chính
  const cancelCheckoutSuite = () => {
    setCheckoutStep(0);
    setAcceptedTerms(false);
    setOtpValue('');
    setOtpError('');
    setIsProcessingPayment(false);
    setVnpayState(null);
  };

  // Gửi lại mã OTP
  const resendOtpCode = () => {
    setOtpTimer(120);
    setOtpError('');
    setOtpAttempts(0);
  };

  // Khởi phát luồng thanh toán VNPAY Sandbox (kiểm tra điều kiện trước khi chuyển hướng)
  const startVNPAYPayment = () => {
    // 1. Kiểm tra giỏ hàng còn hợp lệ
    if (items.length === 0) {
      setFeedback({ success: '', error: "Giỏ hàng rỗng hoặc không hợp lệ." });
      return;
    }
    // 2. Kiểm tra khách hàng đã xác minh
    if (!isVerified) {
      setFeedback({ success: '', error: "Vui lòng xác minh tài khoản trước khi đặt thuê." });
      return;
    }
    // 3. Kiểm tra khách hàng đã đồng ý điều khoản
    if (!acceptedTerms) {
      setFeedback({ success: '', error: "Vui lòng đọc và chấp nhận điều khoản dịch vụ trước." });
      return;
    }
    // 4. Kiểm tra OTP đã xác thực
    if (otpValue.trim() !== '123456') {
      setFeedback({ success: '', error: "Mã OTP chưa được xác thực hoặc không hợp lệ." });
      return;
    }

    setFeedback({ success: '', error: '' });
    setPaymentError('');
    setIsProcessingPayment(true);
    setVnpayState('redirecting');

    // Chuyển sang VNPAY Sandbox sau 2s giả lập
    setTimeout(() => {
      setIsProcessingPayment(false);
      setVnpayState('simulating');
    }, 2000);
  };

  // Xác nhận thanh toán cọc giữ chỗ THÀNH CÔNG (sau khi VNPAY trả kết quả thành công)
  const processFinalPayment = () => {
    setIsProcessingPayment(true);
    setPaymentError('');

    setTimeout(() => {
      setIsProcessingPayment(false);
      
      const newOrderCode = "ORD001"; // Trả về ORD001 theo đúng yêu cầu
      
      // Tạo đơn hàng thành công, xóa giỏ hàng
      const orderData = {
        orderCode: newOrderCode,
        customerEmail: "nguyenvana@example.com",
        customerName: "Nguyễn Văn A",
        startDate: "20/06/2026",
        endDate: "23/06/2026",
        rentalDays: items[0]?.rentalDays || 3,
        totalRentalAmount: totalRentalSum,
        totalDepositAmount: totalDepositSum,
        orderStatus: "DEPOSIT_PAID",
        paymentStatus: "PAID",
        items: items.map(i => ({
          productModel: i.productModel,
          quantity: i.quantity,
          dailyPrice: i.dailyPriceSnapshot,
          depositAmount: i.depositAmountSnapshot
        }))
      };

      setCreatedOrder(orderData);
      
      // Đồng bộ sang App.jsx orders state nếu có
      if (setOrders) {
        const orderToInject = {
          id: Math.random().toString(),
          order_code: newOrderCode,
          customer_id: '86ae940c-0da5-46fd-bcc5-74889c19bfff',
          equipment: {
            name: items[0]?.productModel || 'Sony Alpha A7 IV',
            brand: items[0]?.brand || 'Sony',
            image: items[0]?.image || 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600',
            pricePerDay: items[0]?.dailyPriceSnapshot || 800000,
            deposit: items[0]?.depositAmountSnapshot || 3000000
          },
          startDate: "2026-06-20",
          endDate: "2026-06-23",
          totalPrice: totalRentalSum,
          deposit: totalDepositSum,
          status: 'paid', // Đã cọc giữ chỗ
          createdAt: '2026-06-21',
          rental_days: items[0]?.rentalDays || 3,
          total_rental_amount: totalRentalSum,
          total_deposit_amount: totalDepositSum
        };
        setOrders([orderToInject, ...orders]);
      }

      // Xóa các sản phẩm đã đặt thuê khỏi giỏ hàng
      setItems([]);
      if (setCartItems) {
        setCartItems([]);
      }

      setFeedback({
        success: "Đặt thuê thành công",
        error: ""
      });

      // Chuyển sang bước 5: Hiển thị Đặt thuê thành công
      setVnpayState('success');
      setCheckoutStep(5);
    }, 1000);
  };

  // Trình giả lập thanh toán thất bại
  const simulatePaymentFailure = (errorType) => {
    setIsProcessingPayment(true);
    setPaymentError('');
    setTimeout(() => {
      setIsProcessingPayment(false);

      let msg = "Thanh toán cọc qua VNPAY thất bại";
      if (errorType === 'cancelled') {
        msg = "Giao dịch đã bị hỏng hoặc bị hủy";
      } else if (errorType === 'expired') {
        msg = "Giao dịch đã hết hạn";
      } else if (errorType === 'error') {
        msg = "Không thể xác nhận kết quả thanh toán";
      }

      setFeedback({
        success: '',
        error: msg
      });
      setPaymentError(msg);
      setVnpayState('failed');
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fade-in text-left font-sans" id="cart-container-main">
      
      {/* 7. BREADCRUMBS BẮT BUỘC */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6 bg-white py-3 px-5 rounded-2xl border border-slate-200/80 shadow-xs" id="cart-breadcrumb">
        <button type="button" onClick={() => setActivePage('home')} className="hover:text-[#00236f] transition">Trang chủ</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
        <span className="text-slate-800 font-extrabold">Giỏ hàng</span>
      </nav>

      <div className="space-y-6" id="cart-main-content-flow">
        
        {/* Header trang */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#00236f] uppercase tracking-wide">Giỏ hàng</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Kiểm tra danh sách thiết bị, thời gian thuê và tiền cọc trước khi đặt thuê.
            </p>
          </div>
        </div>

        {/* Cảnh báo xác minh tài khoản nếu khách hàng chưa xác minh */}
        {!isVerified && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-950 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-bold leading-normal">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="block text-slate-900 font-black">Yêu cầu xác minh tài khoản</span>
                <span className="text-slate-650 font-medium">Vui lòng xác minh tài khoản của bạn trước khi thực hiện đặt thuê thiết bị.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActivePage('verification')}
              className="px-4.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition shrink-0 uppercase text-[10px] font-black tracking-wider cursor-pointer"
            >
              Đi đến Quản lý tài khoản
            </button>
          </div>
        )}

        {/* Feedback Messages */}
        {feedback.success && (
          <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 font-bold text-xs rounded-2xl flex items-center gap-2.5 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback.success}</span>
            </div>
          )}

          {feedback.error && (
            <div className="p-4 bg-rose-50 border border-rose-250 text-rose-800 font-bold text-xs rounded-2xl flex items-center gap-2.5 shadow-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{feedback.error}</span>
            </div>
          )}

          {/* 8. GIỎ HÀNG CHÍNH HOẶC CÁC BƯỚC STEPPER */}
          {checkoutStep === 0 && (
            <>
              {items.length === 0 ? (
                /* EMPTY STATE TRÌNH BÀY ĐÚNG THEO YÊU CẦU */
                <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-xs" id="empty-cart-view">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-base font-black text-slate-800">Giỏ hàng của bạn đang trống.</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1.5 mb-6 max-w-sm mx-auto leading-relaxed">
                    Hãy nhận định thời gian, chọn mẫu thiết bị phù hợp và thêm vào giỏ hàng để bắt đầu đặt thuê.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActivePage('equipments')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#00236f] hover:bg-[#fea619] hover:text-[#2a1700] text-white text-xs font-black uppercase rounded-xl transition shadow-xs"
                  >
                    Xem mẫu thiết bị
                  </button>
                </div>
              ) : (
                /* PHÂN HOẠCH BẢNG GIỎ HÀNG ĐÚNG CHỈ ĐỊNH */
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start" id="active-cart-grid">
                  
                  {/* BẢNG SẢN PHẨM (Mẫu: Col 8-9) */}
                  <div className="xl:col-span-8 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[#0f172a] text-[13px] font-semibold">
                            <th className="py-3 px-4 font-semibold whitespace-nowrap min-w-[70px]">Ảnh</th>
                            <th className="py-3 px-4 font-semibold whitespace-nowrap min-w-[200px]">Thiết bị & Phụ kiện đi kèm</th>
                            <th className="py-3 px-3 font-semibold whitespace-nowrap min-w-[100px]">Hãng</th>
                            <th className="py-3 px-3 font-semibold whitespace-nowrap min-w-[100px]">Danh mục</th>
                            <th className="py-3 px-3 text-center font-semibold whitespace-nowrap min-w-[155px]">Thời gian thuê</th>
                            <th className="py-3 px-3 text-center font-semibold whitespace-nowrap min-w-[90px]">Số lượng</th>
                            <th className="py-3 px-4 text-right font-semibold whitespace-nowrap min-w-[160px]">Giá thuê & Cọc</th>
                            <th className="py-3 px-3 text-center font-semibold whitespace-nowrap min-w-[105px]">Tình trạng</th>
                            <th className="py-3 px-4 text-center font-semibold whitespace-nowrap min-w-[90px]">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {items.map((item) => {
                            const isRowInvalid = item.rentalDays <= 0 || item.availableSnapshot !== "Còn thiết bị";
                            return (
                              <tr 
                                key={item.cartItemId} 
                                className={`transition-all duration-150 ${isRowInvalid ? 'bg-rose-50/20' : 'bg-white hover:bg-slate-50/40'}`}
                              >
                                {/* Ảnh */}
                                <td className="py-4 px-4 shrink-0">
                                  <div className="w-14 h-14 bg-slate-50 border border-slate-150 rounded-xl overflow-hidden flex items-center justify-center p-1.5">
                                    <img 
                                      src={item.image} 
                                      alt={item.productModel} 
                                      className="w-full h-full object-cover rounded-lg"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                </td>
                                
                                {/* Tên & Bộ đi kèm text nhỏ thu gọn */}
                                <td className="py-4 px-4 max-w-[200px]">
                                  <div className="space-y-0.5">
                                    <span className="text-[8px] font-black uppercase bg-[#00236f]/10 text-[#00236f] px-1.5 py-0.2 rounded">
                                      {item.category}
                                    </span>
                                    <h4 className="text-xs font-black text-slate-800 leading-snug">{item.productModel}</h4>
                                    
                                    {/* Bộ đi kèm text thu gọn nhỏ */}
                                    <div className="text-[10px] text-slate-450 border-t border-slate-100 pt-1 mt-1 font-bold leading-normal">
                                      <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Bộ đi kèm:</span>
                                      <p className="line-clamp-2 text-[#00236f]/80">{item.bundleText}</p>
                                    </div>
                                  </div>
                                </td>

                                {/* Hãng */}
                                <td className="py-4 px-3">
                                  <span className="text-[10px] font-extrabold text-slate-500 uppercase">{item.brand}</span>
                                </td>

                                {/* Danh mục hẹp */}
                                <td className="py-4 px-3 text-slate-600 font-bold whitespace-nowrap">
                                  {item.category}
                                </td>

                                {/* Ngày nhận, Ngày trả và Số ngày thuê */}
                                <td className="py-4 px-3 text-center">
                                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 space-y-2 max-w-[170px] mx-auto">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-[9px] uppercase font-bold text-slate-400">Nhận:</span>
                                      <input 
                                        type="date" 
                                        value={item.startDate}
                                        onChange={(e) => handleDateChange(item.cartItemId, 'startDate', e.target.value)}
                                        className="bg-white border border-slate-200 rounded px-2 py-0.5 text-[10px] font-bold text-slate-700 focus:ring-1 focus:ring-[#00236f] focus:outline-none w-26"
                                      />
                                    </div>
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-[9px] uppercase font-bold text-slate-400">Trả:</span>
                                      <input 
                                        type="date" 
                                        value={item.endDate}
                                        onChange={(e) => handleDateChange(item.cartItemId, 'endDate', e.target.value)}
                                        className="bg-white border border-slate-200 rounded px-2 py-0.5 text-[10px] font-bold text-slate-700 focus:ring-1 focus:ring-[#00236f] focus:outline-none w-26"
                                      />
                                    </div>
                                    <div className="text-right text-[10px] text-[#00236f] font-black border-t border-slate-200/50 pt-1 mt-1">
                                      <span>Thuê {item.rentalDays} ngày</span>
                                    </div>
                                  </div>
                                </td>

                                {/* Số lượng */}
                                <td className="py-4 px-3 text-center">
                                  <div className="flex items-center justify-center">
                                    <div className="flex items-center border border-slate-250 rounded-lg bg-white overflow-hidden shadow-xs">
                                      <button 
                                        type="button"
                                        onClick={() => handleQtyChange(item.cartItemId, item.quantity - 1)}
                                        className="w-7 h-7 flex items-center justify-center font-bold text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition"
                                      >
                                        -
                                      </button>
                                      <span className="w-8 text-center text-xs font-black text-slate-700">
                                        {item.quantity}
                                      </span>
                                      <button 
                                        type="button"
                                        onClick={() => handleQtyChange(item.cartItemId, item.quantity + 1)}
                                        className="w-7 h-7 flex items-center justify-center font-bold text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </td>

                                {/* Giá thuê, Tiền cọc */}
                                <td className="py-4 px-4 text-right">
                                  <div className="space-y-1 text-xs font-mono">
                                    <div>
                                      <span className="text-[9px] text-slate-400 font-bold uppercase mr-1">Thuê:</span>
                                      <strong className="text-slate-800 font-bold">{item.rentalAmount.toLocaleString('vi-VN')}đ</strong>
                                    </div>
                                    <div>
                                      <span className="text-[9px] text-slate-400 font-bold uppercase mr-1">Phí/ngày:</span>
                                      <span className="text-slate-500">{item.dailyPriceSnapshot.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <div className="border-t border-slate-100 pt-0.5 mt-0.5">
                                      <span className="text-[9px] text-rose-500 font-bold uppercase mr-1">Cọc:</span>
                                      <strong className="text-rose-900 font-extrabold">{item.depositAmountSnapshot.toLocaleString('vi-VN')}đ</strong>
                                    </div>
                                  </div>
                                </td>

                                {/* Trạng thái khả dụng */}
                                <td className="py-4 px-3 text-center">
                                  {item.availableSnapshot === "Còn thiết bị" && (
                                    <span className="status-badge bg-emerald-50 border border-emerald-250 text-emerald-807">
                                      Còn thiết bị
                                    </span>
                                  )}
                                  {item.availableSnapshot === "Không đủ số lượng khả dụng" && (
                                    <span className="status-badge bg-rose-50 border border-rose-250 text-rose-800">
                                      Không đủ số lượng khả dụng
                                    </span>
                                  )}
                                  {item.availableSnapshot === "Thông tin thuê không hợp lệ" && (
                                    <span className="status-badge bg-amber-50 border border-amber-250 text-amber-807">
                                      Thông tin thuê không hợp lệ
                                    </span>
                                  )}
                                </td>

                                {/* Thao tác xóa */}
                                <td className="py-2 px-4 text-center whitespace-nowrap">
                                  <div className="table-action-group justify-center">
                                    <button
                                      type="button"
                                      onClick={() => triggerDeleteConfirm(item)}
                                      className="table-action-button bg-rose-50 hover:bg-rose-600 border border-rose-200 text-rose-600 hover:text-white transition"
                                      id={`btn-remove-item-${item.cartItemId}`}
                                    >
                                      Xóa
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* TỔNG KẾT GIỎ HÀNG (Col 3-4) */}
                  <div className="xl:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-[#00236f] uppercase border-b border-slate-100 pb-3">
                      Tổng kết giỏ hàng
                    </h3>

                    <div className="space-y-3 text-xs leading-normal font-bold">
                      <div className="flex justify-between text-slate-500">
                        <span>Số lượng mẫu thiết bị:</span>
                        <span className="text-slate-800 font-mono font-extrabold">{totalItemsCount}</span>
                      </div>
                      
                      <div className="flex justify-between text-slate-500">
                        <span>Tổng số bộ thuê:</span>
                        <span className="text-slate-800 font-mono font-extrabold">{totalQuantitySum} bộ</span>
                      </div>

                      <div className="flex justify-between text-slate-500">
                        <span>Tổng tiền thuê dự kiến:</span>
                        <span className="text-slate-850 font-mono font-black text-rose-950">{totalRentalSum.toLocaleString('vi-VN')}đ</span>
                      </div>

                      <div className="flex justify-between text-slate-500">
                        <span>Tổng tiền cọc giữ chỗ:</span>
                        <span className="text-slate-850 font-mono font-black text-[#00236f]">{totalDepositSum.toLocaleString('vi-VN')}đ</span>
                      </div>

                      <div className="border-t border-dashed border-slate-200 pt-3"></div>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-1">
                        <div className="flex justify-between text-[#00236f] text-sm font-black">
                          <span>THANH TOÁN TRƯỚC:</span>
                          <span className="text-base font-mono font-extrabold text-[#fea619]">{totalPayablePre.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-medium leading-relaxed block text-right mt-1">
                          (Tiền giữ chỗ bằng tiền cọc. Hoàn trả sau khi nhận và kiểm kể thiết bị tại quầy)
                        </p>
                      </div>
                    </div>

                    {/* Nút đặt thuê chính */}
                    <button
                      type="button"
                      onClick={handleProceedToRent}
                      className={`w-full py-3.5 text-xs font-black uppercase rounded-2xl transition-all duration-150 flex items-center justify-center gap-2 shadow-sm ${
                        isCartValidToCheckout
                          ? 'bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] cursor-pointer'
                          : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      <span>Đặt thuê</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-3 text-[10px] text-slate-500 leading-relaxed font-bold">
                      <p className="flex items-start gap-1">
                        <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>Tiền cọc giữ chỗ sẽ được xử lý/hoàn hồi theo quy định khi khách hàng ký kết trả thiết bị dã ngoại.</span>
                      </p>
                    </div>

                  </div>

                </div>
              )}
            </>
          )}

          {/* ==================================================
              STEPPER 4 BƯỚC CHẤT LƯỢNG CAO CHI TIẾT
              ================================================== */}
          {checkoutStep > 0 && checkoutStep < 5 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              
              {/* Stepper Header Progress */}
              <div className="border-b border-slate-100 pb-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-black text-[#00236f] uppercase tracking-wide">Quy trình đặt thuê thiết bị</h3>
                  <button 
                    type="button" 
                    onClick={cancelCheckoutSuite}
                    className="text-xs text-slate-400 hover:text-rose-600 font-bold transition"
                  >
                    Hủy quy trình đặt
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <div className={`pb-2 border-b-2 transition ${checkoutStep >= 1 ? 'border-[#00236f] text-[#00236f]' : 'border-slate-100'}`}>
                    1. Xác nhận
                  </div>
                  <div className={`pb-2 border-b-2 transition ${checkoutStep >= 2 ? 'border-[#00236f] text-[#00236f]' : 'border-slate-100'}`}>
                    2. Điều khoản
                  </div>
                  <div className={`pb-2 border-b-2 transition ${checkoutStep >= 3 ? 'border-[#00236f] text-[#00236f]' : 'border-slate-100'}`}>
                    3. Xác thực OTP
                  </div>
                  <div className={`pb-2 border-b-2 transition ${checkoutStep >= 4 ? 'border-[#00236f] text-[#00236f]' : 'border-slate-100'}`}>
                    4. Thanh toán cọc
                  </div>
                </div>
              </div>

              {/* BƯỚC 1: XÁC NHẬN ĐẶT THUÊ */}
              {checkoutStep === 1 && (
                <div className="space-y-5 animate-fade-in" id="step-1-confirm">
                  <div className="border-l-4 border-[#00236f] pl-3 py-1">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Bước 1: Xác nhận đặt thuê</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Đối soát lại các mẫu máy và định mức cọc giữ bóng showroom.</p>
                  </div>

                  {/* Thông tin khách hàng */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Thành viên đối chiếu</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                      <div>
                        <span className="text-slate-450 block text-[9.5px]">Họ và tên:</span>
                        <strong className="text-slate-800 text-sm mt-0.5 block">{currentUser.name}</strong>
                      </div>
                      <div>
                        <span className="text-slate-450 block text-[9.5px]">Địa chỉ Email:</span>
                        <strong className="text-slate-800 text-sm mt-0.5 block">{currentUser.email}</strong>
                      </div>
                      <div>
                        <span className="text-slate-450 block text-[9.5px]">Số điện thoại di động:</span>
                        <strong className="text-slate-800 text-sm mt-0.5 block">{currentUser.phone}</strong>
                      </div>
                      <div>
                        <span className="text-slate-450 block text-[9.5px]">Hồ sơ định danh bảo hộ:</span>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide mt-1 ${
                          isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isVerified ? 'Đã duyệt' : 'Chưa xác minh'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs font-bold leading-tight">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[#0f172a] text-[12px] font-semibold">
                          <th className="p-3 text-left font-semibold whitespace-nowrap min-w-[200px]">Thiết bị đặt thuê</th>
                          <th className="p-3 text-center font-semibold whitespace-nowrap min-w-[155px]">Chu kỳ thuê</th>
                          <th className="p-3 text-center font-semibold whitespace-nowrap min-w-[80px]">Số lượng</th>
                          <th className="p-3 text-right font-semibold whitespace-nowrap min-w-[125px]">Tiền thuê</th>
                          <th className="p-3 text-right font-semibold whitespace-nowrap min-w-[125px]">Tiền đặt cọc</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {items.map((item, index) => (
                          <tr key={index} className="hover:bg-slate-50/40">
                            <td className="p-3">
                              <strong className="text-slate-800 block text-xs">{item.productModel}</strong>
                              <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{item.category} • {item.brand}</span>
                            </td>
                            <td className="p-3 text-center text-slate-600 font-semibold font-mono">
                              {item.startDate} đến {item.endDate} ({item.rentalDays} ngày)
                            </td>
                            <td className="p-3 text-center text-slate-750 font-extrabold">
                              {item.quantity}
                            </td>
                            <td className="p-3 text-right text-slate-800 font-mono">
                              {item.rentalAmount.toLocaleString('vi-VN')} VNĐ
                            </td>
                            <td className="p-3 text-right text-rose-900 font-extrabold font-mono">
                              {item.depositAmountSnapshot.toLocaleString('vi-VN')} VNĐ
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary row */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 space-y-2.5 text-xs font-bold text-right" id="stepper-total-confirm">
                    <div className="flex justify-between md:justify-end gap-12 text-slate-500">
                      <span>Tổng phí thuê máy ảnh dự kiến:</span>
                      <strong className="text-slate-800 font-mono">{totalRentalSum.toLocaleString('vi-VN')}đ</strong>
                    </div>
                    <div className="flex justify-between md:justify-end gap-12 text-slate-500">
                      <span>Tổng tiền đặt cọc showroom:</span>
                      <strong className="text-[#00236f] font-mono">{totalDepositSum.toLocaleString('vi-VN')}đ</strong>
                    </div>
                    <div className="border-t border-slate-200/60 pt-2 flex justify-between md:justify-end gap-12 text-sm text-[#00236f] font-black">
                      <span>TIỀN GIỮ CHỖ CẦN THANH TOÁN TRƯỚC:</span>
                      <span className="text-base text-rose-800 font-mono">{totalPayablePre.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                  </div>

                  {/* Stepper Buttons */}
                  <div className="flex justify-between pt-3 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={cancelCheckoutSuite}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase rounded-xl transition"
                    >
                      Hủy
                    </button>
                    <button 
                      type="button" 
                      onClick={handleStep1ToStep2}
                      className="px-6 py-2.5 bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] text-xs font-black uppercase rounded-xl transition shadow-xs flex items-center gap-1.5"
                    >
                      Tiếp tục
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* BƯỚC 2: ĐỒNG Ý ĐIỀU KHOẢN THUÊ */}
              {checkoutStep === 2 && (
                <div className="space-y-5 animate-fade-in" id="step-2-terms">
                  <div className="border-l-4 border-[#00236f] pl-3 py-1">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Bước 2: Đồng ý điều khoản thuê</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Vui lòng đọc kỹ thông tin thỏa ước ràng buộc pháp lý khi vận hành máy móc.</p>
                  </div>

                  {/* Scrollable Terms Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 h-64 overflow-y-auto text-xs text-slate-600 font-medium leading-relaxed space-y-3.5 shadow-inner">
                    <h5 className="font-extrabold text-slate-800 uppercase tracking-tight text-[11px]">ĐỒ ÁN PHÁP LÝ HỢP ĐỒNG THUÊ THIẾT BỊ CAMERA T-RENT</h5>
                    
                    <p className="flex items-start gap-2">
                      <span className="w-4 h-4 bg-[#00236f] text-white font-black text-[9px] rounded-full flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <span><strong>Khách hàng có trách nhiệm kiểm tra thiết bị khi nhận:</strong> Trước khi mang máy ra khỏi showroom, khách thuê phải cùng nhân viên đồng đối chứng, đối kiểm tất cả các linh kiện kèm theo, bao gồm cả tem bảo an.</span>
                    </p>

                    <p className="flex items-start gap-2">
                      <span className="w-4 h-4 bg-[#00236f] text-white font-black text-[9px] rounded-full flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <span><strong>Khách hàng phải hoàn trả thiết bị đúng thời gian đã đăng ký:</strong> Nếu xảy ra tình trạng gia hạn đột xuất hoặc phát sinh sự cố, khách hàng có trách nhiệm liên hệ Hotline trong vòng ít nhất 6 tiếng trước giờ bàn giao dự kiến. Các phát sinh muộn không báo trước sẽ bị áp dụng mức phí phụ phụ vượt giờ quy chuẩn.</span>
                    </p>

                    <p className="flex items-start gap-2">
                      <span className="w-4 h-4 bg-[#00236f] text-white font-black text-[9px] rounded-full flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <span><strong>Khách hàng chịu trách nhiệm nếu thiết bị, phụ kiện bị hư hỏng, mất hoặc thiếu khi trả:</strong> Trường hợp rơi vỡ, nứt kính quang học, hoặc hỏng mốc do tác động môi trường không bảo vệ, khách thuê đồng ý khấu hao trực tiếp từ tiền đặt cọc showroom hoặc lập hóa đơn bồi hoàn linh kiện theo khung giá hãng phân phối.</span>
                    </p>

                    <p className="flex items-start gap-2">
                      <span className="w-4 h-4 bg-[#00236f] text-white font-black text-[9px] rounded-full flex items-center justify-center shrink-0 mt-0.5">4</span>
                      <span><strong>Tiền cọc có thể được hoàn lại hoặc khấu trừ tùy theo kết quả kiểm kê khi trả thiết bị:</strong> Số tiền này sẽ đảm bảo giữ đúng giá trị cho đến khi sản xuất chu kỳ trả tặc tác hoàn tất kỹ thuật.</span>
                    </p>

                    <p className="flex items-start gap-2">
                      <span className="w-4 h-4 bg-[#00236f] text-white font-black text-[9px] rounded-full flex items-center justify-center shrink-0 mt-0.5">5</span>
                      <span><strong>Việc bàn giao thiết bị sẽ được nhân viên xác nhận bằng phiếu bàn giao và hợp đồng giấy:</strong> Hệ thống online chỉ phục vụ xử lý giữ phòng bảo cọc trực tuyến. Thủ tục bàn kỹ thuật sẽ diễn ra thực địa tại Showroom T-Rent.</span>
                    </p>
                  </div>

                  {/* Terms Checkbox */}
                  <label className="flex items-start gap-3 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 rounded-2xl p-4 cursor-pointer transition select-none">
                    <input 
                      type="checkbox" 
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-4.5 h-4.5 text-[#00236f] border-slate-300 rounded focus:ring-[#00236f] transition mt-0.5"
                    />
                    <div>
                      <span className="text-xs font-black text-slate-800">
                        Tôi đã đọc và đồng ý với điều khoản thuê thiết bị.
                      </span>
                      <p className="text-[10px] text-slate-550 font-bold mt-0.5 leading-normal">
                        Bằng việc tích chọn, bạn chính thức đồng ý với toàn bộ điều khoản pháp chế thuê máy của T-Rent và cam kết thực hiện đúng mọi quy định nêu trên.
                      </p>
                    </div>
                  </label>

                  {/* Stepper Buttons */}
                  <div className="flex justify-between pt-3 border-t border-slate-100">
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => setCheckoutStep(1)}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase rounded-xl transition"
                      >
                        Quay lại
                      </button>
                      <button 
                        type="button" 
                        onClick={cancelCheckoutSuite}
                        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 text-xs font-black uppercase rounded-xl transition"
                      >
                        Hủy
                      </button>
                    </div>

                    <button 
                      type="button" 
                      onClick={handleStep2ToStep3}
                      disabled={!acceptedTerms}
                      className={`px-6 py-2.5 text-xs font-black uppercase rounded-xl transition shadow-xs flex items-center gap-1.5 ${
                        acceptedTerms 
                          ? 'bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] cursor-pointer' 
                          : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      Tiếp tục
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* BƯỚC 3: XÁC THỰC OTP ĐẶT THUÊ */}
              {checkoutStep === 3 && (
                <div className="space-y-5 animate-fade-in" id="step-3-otp-screen">
                  <div className="border-l-4 border-[#00236f] pl-3 py-1">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Bước 3: Xác thực OTP đặt thuê</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Xác nhận danh tính thông qua mã bảo mật OTP được chuyển giao.</p>
                  </div>

                  <div className="max-w-md mx-auto bg-slate-50 border border-slate-150 rounded-2xl p-6 text-center space-y-4">
                    <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Lock className="w-5 h-5 text-[#00236f]" />
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-xs text-slate-600 font-bold leading-normal">
                        Mã OTP được gửi đến hòm thư liên kết của tài khoản:
                      </p>
                      <strong className="text-sm text-slate-850 font-black font-mono block">
                        nguyenvana@example.com <span className="text-slate-400 font-medium text-xs">hoặc</span> 0901234567
                      </strong>
                    </div>

                    {/* Numeric Pin Entry Field */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block text-left">Nhập mã OTP</label>
                      <input 
                        type="text" 
                        maxLength={6}
                        placeholder="••••••"
                        value={otpValue}
                        onChange={(e) => {
                          setOtpError('');
                          setOtpValue(e.target.value.replace(/\D/g, ''));
                        }}
                        className="w-full text-center py-3 px-4 border border-slate-250 rounded-xl font-mono text-lg font-black tracking-widest bg-white focus:ring-2 focus:ring-[#00236f] focus:outline-none"
                      />
                      
                      {otpError && (
                        <p className="text-xs font-black text-rose-700 mt-1.5 text-left bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 flex items-center gap-1.5 animate-shake">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {otpError}
                        </p>
                      )}

                      <span className="text-[10px] text-blue-800 bg-blue-50 border border-blue-100 rounded-lg px-2 py-1 font-bold block text-left leading-normal mt-1">
                        👉 <strong>Mã kiểm thử:</strong> Vui lòng nhập mã thực nghiệm <strong className="font-mono text-indigo-900 bg-white border px-1 rounded">123456</strong> để được tiếp tục bước thanh toán cọc.
                      </span>
                    </div>

                    {/* Countdown and resend option */}
                    <div className="flex justify-between items-center text-[10.5px] border-t border-slate-200/60 pt-3 text-slate-500 font-bold">
                      <span className="flex items-center gap-1 select-none">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        Thời gian hiệu lực: <strong className="text-slate-800 font-mono text-xs">{formatTimer(otpTimer)}</strong>
                      </span>
                      
                      {otpTimer === 0 ? (
                        <button 
                          type="button" 
                          onClick={resendOtpCode}
                          className="text-[#00236f] hover:text-[#fea619] underline"
                        >
                          Gửi lại mã OTP
                        </button>
                      ) : (
                        <button 
                          type="button"
                          disabled
                          className="text-slate-350 cursor-not-allowed"
                        >
                          Gửi lại sau
                        </button>
                      )}
                    </div>

                  </div>

                  {/* Stepper Buttons */}
                  <div className="flex justify-between pt-3 border-t border-slate-100">
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => setCheckoutStep(2)}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase rounded-xl transition"
                      >
                        Quay lại
                      </button>
                      <button 
                        type="button" 
                        onClick={cancelCheckoutSuite}
                        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 text-xs font-black uppercase rounded-xl transition"
                      >
                        Hủy
                      </button>
                    </div>

                    <button 
                      type="button" 
                      onClick={handleStep3ToStep4}
                      className="px-6 py-2.5 bg-[#00236f] text-white hover:bg-[#fea619] hover:text-[#2a1700] text-xs font-black uppercase rounded-xl transition shadow-xs flex items-center gap-1.5"
                    >
                      Xác nhận OTP
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* BƯỚC 4: THANH TOÁN CỌC GIỮ CHỖ */}
              {checkoutStep === 4 && (
                <div className="space-y-5 animate-fade-in" id="step-4-payment-screen">
                  
                  {/* LUỒNG CHƯA ĐI RA VNPAY (vnpayState === null) */}
                  {vnpayState === null && (
                    <div className="space-y-6">
                      <div className="border-l-4 border-[#00236f] pl-3 py-1">
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Thanh toán cọc giữ chỗ</h4>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">
                          Bạn sẽ được chuyển đến cổng thanh toán VNPAY Sandbox để thanh toán tiền cọc giữ chỗ.
                        </p>
                      </div>

                      <div className="max-w-xl bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4">
                        <h5 className="text-[11px] font-black uppercase tracking-wider text-[#00236f]">Thông tin thanh toán cọc</h5>

                        <div className="divide-y divide-slate-200/60 text-xs font-bold leading-normal text-slate-650 space-y-3 pt-1">
                          <div className="flex justify-between pb-2">
                            <span>Mã giao dịch tạm:</span>
                            <strong className="text-slate-800 font-mono">PAY-TEMP-001</strong>
                          </div>

                          <div className="flex justify-between py-2.5">
                            <span>Khách hàng đối chiếu:</span>
                            <strong className="text-slate-800">Nguyễn Văn A</strong>
                          </div>

                          <div className="flex justify-between py-2.5">
                            <span>Email:</span>
                            <strong className="text-slate-800">nguyenvana@example.com</strong>
                          </div>

                          <div className="flex justify-between py-2.5">
                            <span>Số điện thoại:</span>
                            <strong className="text-slate-800 font-mono">0901234567</strong>
                          </div>

                          <div className="flex justify-between py-2.5">
                            <span>Phương thức thanh toán:</span>
                            <span className="text-blue-800 font-black">VNPAY Sandbox</span>
                          </div>

                          <div className="flex justify-between py-2.5">
                            <span>Trạng thái thanh toán:</span>
                            <span className="text-amber-800 font-black">Chờ thanh toán</span>
                          </div>

                          <div className="flex justify-between pt-3 text-rose-950 border-t border-slate-200">
                            <span>Tổng tiền cọc giữ chỗ:</span>
                            <strong className="text-base text-[#00236f] font-mono font-black">{totalDepositSum.toLocaleString('vi-VN')} VNĐ</strong>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-[10.5px] leading-relaxed text-blue-900 font-semibold">
                          💡 <strong>Môi trường thử nghiệm:</strong> Bạn đang thao tác trong chế độ tích hợp VNPAY Sandbox dành cho đồ án tốt nghiệp.
                        </div>

                        {/* Error message */}
                        {paymentError && (
                          <p className="text-xs font-black text-[#ba1a1a] bg-rose-50 border border-rose-150 rounded-xl px-3 py-2 flex items-center gap-1.5 animate-shake">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {paymentError}
                          </p>
                        )}

                        {/* Buttons & Steppers */}
                        <div className="pt-2">
                          <button 
                            type="button"
                            onClick={startVNPAYPayment}
                            disabled={isProcessingPayment}
                            className="w-full py-3 bg-[#00236f] hover:bg-[#fea619] hover:text-[#2a1700] text-white text-xs font-black uppercase rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                          >
                            Thanh toán qua VNPAY
                          </button>
                        </div>
                      </div>

                      {/* Stepper Back & Cancel */}
                      <div className="flex justify-between pt-3 border-t border-slate-150 max-w-xl">
                        <div className="flex gap-2">
                          <button 
                            type="button" 
                            onClick={() => setCheckoutStep(3)}
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase rounded-xl transition"
                          >
                            Quay lại
                          </button>
                          <button 
                            type="button" 
                            onClick={cancelCheckoutSuite}
                            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 text-xs font-black uppercase rounded-xl transition"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TRẠNG THÁI REDIRECTING (Đang chuyển đến VNPAY...) */}
                  {vnpayState === 'redirecting' && (
                    <div className="max-w-xl bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6 text-center animate-fade-in mx-auto" id="vnpay-redirecting">
                      <div className="w-14 h-14 bg-indigo-50 border border-indigo-150 rounded-full flex items-center justify-center mx-auto shadow-xs relative">
                        <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-indigo-600 animate-spin"></div>
                        <Wallet className="w-6 h-6 text-[#00236f]" />
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-base md:text-lg font-black text-[#00236f] uppercase tracking-tight">Đang chuyển đến VNPAY</h4>
                        <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto leading-relaxed">
                          Vui lòng không tắt trình duyệt trong quá trình thanh toán.
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4.5 text-left text-xs font-bold leading-normal space-y-2.5 max-w-sm mx-auto">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold">Mã giao dịch tạm:</span>
                          <span className="text-slate-800 font-mono font-bold">PAY-TEMP-001</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold">Số tiền thanh toán:</span>
                          <span className="text-rose-700 font-mono font-black">{totalDepositSum.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold">Phương thức:</span>
                          <span className="text-[#00236f] font-extrabold">VNPAY Sandbox</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TRẠNG THÁI SIMULATING (CỔNG APU VNPAY SANDBOX) */}
                  {vnpayState === 'simulating' && (
                    <div className="max-w-xl bg-white border-2 border-indigo-600 rounded-3xl p-6.5 shadow-2xl space-y-5 animate-scale-up mx-auto" id="vnpay-sandbox-mock-gateway">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                          <strong className="text-xs uppercase tracking-widest text-indigo-700 font-black">Cổng Thanh Toán VNPAY Sandbox</strong>
                        </div>
                        <span className="text-[9.5px] bg-[#00236f] text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Chọn trạng thái</span>
                      </div>

                      <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                        Vui lòng lựa chọn kết quả phản hồi giao dịch cọc từ cổng **VNPAY Sandbox** để tiếp tục tiến trình:
                      </p>

                      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4.5 text-xs font-bold leading-normal text-slate-700 space-y-2.5">
                        <div className="flex justify-between">
                          <span>Đơn vị chấp nhận thanh toán:</span>
                          <strong className="text-slate-900">T-RENT CAMERA RENTAL SYSTEMS</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Mã giao dịch tạm gửi qua:</span>
                          <span className="text-indigo-900 font-mono">PAY-TEMP-001</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-200 text-rose-950 font-black">
                          <span>Số tiền thanh toán cọc:</span>
                          <span className="text-sm font-mono text-indigo-700">{totalDepositSum.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1.5">
                        <button
                          type="button"
                          onClick={processFinalPayment}
                          className="py-3 px-4 bg-[#00236f] hover:bg-[#001c59] text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                        >
                          <Check className="w-4 h-4" />
                          Thanh toán thành công
                        </button>

                      {/* Giá thuê, Tiền cọc, Thành tiền */}
                      <div className="col-span-12 md:col-span-2 text-right text-xs">
                        <div className="font-semibold text-slate-500 text-[10px]">
                          Thuê: <span className="font-bold text-slate-700 font-mono">{lineRent.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="font-semibold text-slate-500 text-[10px]">
                          Cọc thế: <span className="font-bold text-slate-700 font-mono">{lineDeposit.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="font-black text-[#00236f] text-xs pt-1 border-t border-slate-100 mt-1 font-mono">
                          T.Tiền: {lineTotal.toLocaleString('vi-VN')}đ
                        </div>
                      </div>

                      {/* Xóa dòng sản phẩm */}
                      <div className="col-span-12 md:col-span-1 flex justify-center">
                        <button
                          type="button"
                          onClick={() => simulatePaymentFailure('cancelled')}
                          className="py-3 px-4 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          Hủy/Thanh toán lỗi
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-400 font-bold leading-normal text-center pt-1 border-t border-slate-100">
                        🔒 Bảo mật SSL 256-bit • Kết nối Sandbox trực tiếp API • T-Rent 2026.
                      </div>
                    </div>
                  )}

                  {/* TRẠNG THÁI FAILED (Thanh toán cọc thất bại) */}
                  {vnpayState === 'failed' && (
                    <div className="max-w-xl bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-5 animate-fade-in mx-auto" id="vnpay-payment-failed">
                      <div className="w-14 h-14 bg-rose-50 border border-rose-150 rounded-full flex items-center justify-center mx-auto shadow-xs">
                        <XCircle className="w-8 h-8 text-rose-600" />
                      </div>

                      <div className="space-y-2 text-center">
                        <h4 className="text-lg md:text-xl font-black text-[#ba1a1a] uppercase tracking-tight">Thanh toán cọc thất bại</h4>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-sm mx-auto">
                          Giao dịch thanh toán cọc chưa được ghi nhận. Vui lòng thử lại hoặc quay về giỏ hàng.
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4.5 text-xs font-bold leading-normal text-slate-700 space-y-2.5 max-w-sm mx-auto p-5">
                        <div className="flex justify-between">
                          <span className="text-slate-450 font-semibold">Mã giao dịch tạm:</span>
                          <span className="text-slate-800 font-mono font-bold">PAY-TEMP-001</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-450 font-semibold">Phương thức thanh toán:</span>
                          <span className="text-slate-800">VNPAY Sandbox</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-450 font-semibold">Số tiền cần thanh toán:</span>
                          <span className="text-rose-700 font-mono font-extrabold">{totalDepositSum.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-450 font-semibold">Trạng thái thanh toán:</span>
                          <span className="text-rose-700 font-mono font-black uppercase">Thất bại</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-center gap-2.5 pt-2 select-none max-w-sm mx-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setVnpayState(null);
                            setPaymentError('');
                          }}
                          className="flex-1 py-3 bg-[#00236f] hover:bg-[#fea619] hover:text-[#2a1700] text-white text-xs font-black uppercase rounded-xl transition shadow-xs text-center cursor-pointer font-bold"
                        >
                          Thử thanh toán lại
                        </button>
                        <button
                          type="button"
                          onClick={cancelCheckoutSuite}
                          className="flex-1 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-705 text-xs font-black uppercase rounded-xl transition text-center cursor-pointer font-bold"
                        >
                          Quay về giỏ hàng
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          {/* ==================================================
              THÔNG BÁO ĐẶT THUÊ THÀNH CÔNG (MÀN HÌNH BƯỚC 5)
              ================================================== */}
          {checkoutStep === 5 && createdOrder && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm text-center space-y-6 animate-fade-in mx-auto max-w-xl" id="checkout-completed">
              
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-150 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-black text-rose-950 uppercase tracking-tight">Thanh toán cọc thành công</h3>
                <p className="text-xs text-slate-500 font-semibold max-w-lg mx-auto leading-relaxed">
                  Hệ thống đã ghi nhận thanh toán cọc giữ chỗ qua VNPAY Sandbox.
                </p>
              </div>

              {/* Order Detail Information strictly per requested */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-4">
                <div className="border-b border-slate-200/60 pb-3 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#00236f]">
                  <span>Thông số phiếu đặt</span>
                  <span className="bg-[#00236f] text-white px-2 py-0.5 rounded-lg text-[9.5px] font-black">ORD001</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold leading-snug">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Mã đơn hàng:</span>
                    <strong className="text-slate-800 text-sm">ORD001</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Mã giao dịch:</span>
                    <strong className="text-slate-800 text-sm">PAY001</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Phương thức thanh toán:</span>
                    <strong className="text-slate-800">VNPAY Sandbox</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Số tiền đã thanh toán:</span>
                    <strong className="text-rose-700 font-mono text-sm">6.000.000đ</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Trạng thái thanh toán:</span>
                    <span className="inline-flex bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.2 rounded font-black uppercase mt-1">Đã thanh toán</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Trạng thái đơn hàng:</span>
                    <span className="inline-flex bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.2 rounded font-black uppercase mt-1">Đã đặt cọc</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Ngày nhận:</span>
                    <strong className="text-slate-800 font-mono">20/06/2026</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Ngày trả:</span>
                    <strong className="text-slate-800 font-mono">23/06/2026</strong>
                  </div>
                </div>

                {/* Danh sách thiết bị trong đơn */}
                <div className="border-t border-slate-200 pt-3.5 space-y-2">
                  <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">Danh sách thiết bị trong đơn:</span>
                  <div className="divide-y divide-slate-100 bg-white border border-slate-150 rounded-xl overflow-hidden text-xs font-bold font-mono">
                    <div className="p-3 flex justify-between items-center hover:bg-slate-50/50">
                      <span>Sony A7 IV x1</span>
                      <span className="text-slate-500 font-normal">Bảo lãnh cọc</span>
                    </div>
                    <div className="p-3 flex justify-between items-center hover:bg-slate-50/50">
                      <span>Fuji X-T5 x1</span>
                      <span className="text-slate-500 font-normal">Bảo lãnh cọc</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action paths */}
              <div className="pt-3 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('orders');
                    setCheckoutStep(0);
                    setVnpayState(null);
                  }}
                  className="px-6 py-3 bg-[#00236f] hover:bg-[#fea619] hover:text-[#2a1700] text-white text-xs font-black uppercase rounded-xl transition shadow-xs cursor-pointer"
                >
                  Xem đơn hàng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('equipments');
                    setCheckoutStep(0);
                    setVnpayState(null);
                  }}
                  className="px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-black uppercase rounded-xl transition cursor-pointer"
                >
                  Về danh sách mẫu thiết bị
                </button>
              </div>

            </div>
          )}

      </div>

      {/* ==================================================
          MODAL XÁC NHẬN XÓA SẢN PHẨM KHỎI GIỎ HÀNG
          ================================================== */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs text-left" id="confirm-delete-modal">
          <div className="bg-white border border-slate-200 rounded-3xl p-5.5 md:p-6 w-full max-w-md shadow-2xl space-y-4 animate-scale-up">
            
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="text-sm font-black text-[#ba1a1a] uppercase tracking-wide">
                Xóa sản phẩm khỏi giỏ hàng
              </h3>
              <button 
                type="button" 
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }} 
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?
            </p>

            {/* Thông tin hiển thị của item bị xóa */}
            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 space-y-2.5 text-xs font-bold leading-snug">
              <div className="flex justify-between">
                <span className="text-slate-450 block text-[9px] uppercase font-bold">Mẫu thiết bị:</span>
                <strong className="text-slate-800">{itemToDelete.productModel}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450 block text-[9px] uppercase font-bold">Thời gian nhận:</span>
                <span className="text-slate-750 font-mono">{itemToDelete.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450 block text-[9px] uppercase font-bold">Thời gian trả:</span>
                <span className="text-slate-750 font-mono">{itemToDelete.endDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450 block text-[9px] uppercase font-bold">Số lượng thuê:</span>
                <span className="text-slate-750">{itemToDelete.quantity} bộ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450 block text-[9px] uppercase font-bold">Tiền thuê dự kiến:</span>
                <span className="text-slate-800 font-mono">{itemToDelete.rentalAmount.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-[#ba1a1a] block text-[9px] uppercase font-bold">Tiền cọc cần nộp:</span>
                <strong className="text-[#ba1a1a] font-mono">{itemToDelete.depositAmountSnapshot.toLocaleString('vi-VN')} đ</strong>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }}
                className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase rounded-xl transition"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2.5 bg-rose-700 text-white hover:bg-rose-800 text-xs font-black uppercase rounded-xl transition shadow-xs"
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
