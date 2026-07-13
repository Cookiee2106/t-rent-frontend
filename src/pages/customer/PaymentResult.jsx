import { Link, useSearchParams } from "react-router-dom";

function PaymentResult() {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const thanhCong = success === "true";

  return (
    <div className="khung-trang">
      <div
        style={{
          maxWidth: "600px",
          margin: "60px auto",
          textAlign: "center",
        }}
      >
        <h2>Kết quả thanh toán</h2>

        {thanhCong ? (
          <>
            <p className="thong-bao">Thanh toán tiền cọc thành công.</p>

            <p>
              Đơn thuê của bạn đã được tạo. Bạn có thể xem lại trong trang đơn
              thuê cá nhân.
            </p>

            <Link to="/orders">
              <button>Xem đơn thuê của tôi</button>
            </Link>
          </>
        ) : (
          <>
            <p className="thong-bao loi">Thanh toán thất bại hoặc đã bị hủy.</p>

            <p>Bạn có thể quay lại giỏ hàng để thực hiện thanh toán lại.</p>

            <Link to="/cart">
              <button>Quay lại giỏ hàng</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentResult;