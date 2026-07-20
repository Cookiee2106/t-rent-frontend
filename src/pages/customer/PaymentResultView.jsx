import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { DUONG_DAN_API } from "../../api/api";

function PaymentResult() {
  const [searchParams] = useSearchParams();

  const thanhCong = searchParams.get("success") === "true";
  const phienThanhToanId = searchParams.get("phien_thanh_toan_id") || "";
  const maThamChieu = searchParams.get("ma_tham_chieu") || "";
  const maDonTuUrl = searchParams.get("ma_don") || "";
  const message = searchParams.get("message") || "";

  const maGiaoDichTuUrl =
    searchParams.get("ma_giao_dich") ||
    searchParams.get("vnp_TransactionNo") ||
    searchParams.get("vnp_BankTranNo") ||
    "";

  const [maDon, setMaDon] = useState(maDonTuUrl);
  const [maGiaoDich, setMaGiaoDich] = useState(maGiaoDichTuUrl);

  function taoHeaderCoToken() {
    const token = localStorage.getItem("token");

    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async function layThongTinPhienThanhToan() {
    try {
      if (!thanhCong || !phienThanhToanId) {
        return;
      }

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/payment-sessions/${phienThanhToanId}`,
        {
          headers: {
            ...taoHeaderCoToken(),
          },
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        if (!maDonTuUrl && duLieu.data?.ma_don) {
          setMaDon(duLieu.data.ma_don);
        }

        if (!maGiaoDichTuUrl && duLieu.data?.ma_giao_dich) {
          setMaGiaoDich(duLieu.data.ma_giao_dich);
        }
      }
    } catch {
      /*
        Không hiện lỗi ở đây.
        Nếu không lấy được từ API thì vẫn hiển thị mã lấy từ URL hoặc mã tham chiếu.
      */
    }
  }

  useEffect(() => {
    layThongTinPhienThanhToan();
  }, [thanhCong, phienThanhToanId]);

  return (
    <div className="trang-ket-qua-thanh-toan">
      <div className="the-ket-qua-thanh-toan">
        {thanhCong ? (
          <>
            <div className="icon-thanh-toan icon-thanh-toan-thanh-cong">✓</div>

            <h2>Thanh toán thành công</h2>

            <p>
              Mã số đơn hàng của bạn là{" "}
              <b className="ma-don-thanh-cong">
                {maDon || maThamChieu || "đang cập nhật"}
              </b>
              .
            </p>

            {maGiaoDich && (
              <p className="dong-ket-qua-thanh-toan">
                Mã giao dịch của bạn là{" "}
                <span className="ma-giao-dich-thanh-toan">{maGiaoDich}</span>.
              </p>
            )}

            <p>
              Bạn có thể xem chi tiết trong{" "}
              <Link className="link-don-hang-cua-toi" to="/orders">
                đơn hàng của tôi
              </Link>
              .
            </p>

            <Link to="/equipments">
              <button className="nut-tiep-tuc-mua-hang" type="button">
                Tiếp tục mua hàng
              </button>
            </Link>
          </>
        ) : (
          <>
            <div className="icon-thanh-toan icon-thanh-toan-that-bai">×</div>

            <h2>Thanh toán thất bại</h2>

            <p>{message || "Thanh toán thất bại hoặc đã bị hủy."}</p>

            <p>Bạn có thể quay lại giỏ hàng để thanh toán lại.</p>

            <Link to="/cart">
              <button className="nut-quay-lai-gio-hang" type="button">
                Quay lại giỏ hàng
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentResult;
