import { Link, useSearchParams } from "react-router-dom";

function PaymentResult() {
  const [searchParams] = useSearchParams();

  const success = searchParams.get("success");
  const maThamChieu = searchParams.get("ma_tham_chieu");
  const phienThanhToanId = searchParams.get("phien_thanh_toan_id");
  const responseCode = searchParams.get("vnp_response_code");
  const checksum = searchParams.get("checksum");

  const thanhCong = success === "true";

  return (
    <div className="khung-trang">
      <h2>Kết quả thanh toán</h2>

      {thanhCong ? (
        <p className="thong-bao">Thanh toán tiền cọc thành công.</p>
      ) : (
        <p className="thong-bao loi">Thanh toán thất bại hoặc bị hủy.</p>
      )}

      <table border="1" cellPadding="8" style={{ margin: "auto" }}>
        <tbody>
          <tr>
            <td>Mã tham chiếu</td>
            <td>{maThamChieu}</td>
          </tr>

          <tr>
            <td>ID phiên thanh toán</td>
            <td>{phienThanhToanId}</td>
          </tr>

          <tr>
            <td>Mã phản hồi VNPay</td>
            <td>{responseCode}</td>
          </tr>

          <tr>
            <td>Checksum</td>
            <td>{checksum}</td>
          </tr>
        </tbody>
      </table>

      <br />

      <Link to="/orders">Xem đơn thuê của tôi</Link>
    </div>
  );
}

export default PaymentResult;