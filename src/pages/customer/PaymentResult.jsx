import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader, ArrowRight } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function PaymentResult({ setActivePage }) {
  const [status, setStatus] = useState('processing'); // processing, success, fail
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Gọi API BE để kiểm tra tính toàn vẹn và trạng thái thanh toán từ VNPay
    const verifyPayment = async () => {
      const searchParams = window.location.search;
      if (!searchParams) {
        setStatus('fail');
        setMessage('Không tìm thấy thông tin thanh toán.');
        return;
      }
      try {
        const res = await axiosClient.get(`/api/payments/vnpay/return${searchParams}`);
        if (res.data?.data?.isSuccess) {
          setStatus('success');
          setMessage('Thanh toán thành công!');
        } else {
          setStatus('fail');
          setMessage('Thanh toán thất bại hoặc bị hủy.');
        }
      } catch (err) {
        setStatus('fail');
        setMessage(err.response?.data?.message || 'Có lỗi xảy ra khi xác thực thanh toán.');
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-sm text-center">
        {status === 'processing' && (
          <div className="flex flex-col items-center">
            <Loader className="w-16 h-16 text-[#00236f] animate-spin mb-4" />
            <h2 className="text-xl font-bold text-slate-800">Đang xử lý kết quả thanh toán...</h2>
            <p className="mt-2 text-sm text-slate-500">Vui lòng không đóng trình duyệt.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center animate-fade-in">
            <CheckCircle className="w-20 h-20 text-emerald-500 mb-4" />
            <h2 className="text-2xl font-black text-slate-800 mb-2">Thanh toán thành công!</h2>
            <p className="text-slate-600 mb-8">{message}</p>
            <button
              onClick={() => setActivePage('orders')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#00236f] text-white rounded-xl font-bold hover:bg-[#fea619] transition"
            >
              Xem đơn hàng <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {status === 'fail' && (
          <div className="flex flex-col items-center animate-fade-in">
            <XCircle className="w-20 h-20 text-rose-500 mb-4" />
            <h2 className="text-2xl font-black text-slate-800 mb-2">Thanh toán thất bại!</h2>
            <p className="text-slate-600 mb-8">{message}</p>
            <button
              onClick={() => setActivePage('cart')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition"
            >
              Quay lại giỏ hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
