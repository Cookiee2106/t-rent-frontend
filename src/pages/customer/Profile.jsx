import { useEffect, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

function Profile() {
  const [nguoiDung, setNguoiDung] = useState(null);
  const [thongBao, setThongBao] = useState("");

  async function layThongTinCaNhan() {
    const phanHoi = await fetch(`${DUONG_DAN_API}/api/auth/me`, {
      headers: taoHeaderCoToken(),
    });

    const duLieu = await phanHoi.json();

    if (duLieu.success) {
      setNguoiDung(duLieu.data);
      localStorage.setItem("user", JSON.stringify(duLieu.data));
    } else {
      setThongBao(duLieu.message);
    }
  }

  useEffect(() => {
    layThongTinCaNhan();
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Tài khoản của tôi</h2>

      {thongBao && <p className="thong-bao">{thongBao}</p>}

      {nguoiDung && (
        <div className="khung-giua">
          <table className="bang-don-gian">
            <tbody>
              <tr>
                <td>Họ tên</td>
                <td>{nguoiDung.ho_ten}</td>
              </tr>

              <tr>
                <td>Email</td>
                <td>{nguoiDung.email}</td>
              </tr>

              <tr>
                <td>Số điện thoại</td>
                <td>{nguoiDung.so_dien_thoai}</td>
              </tr>

              <tr>
                <td>Địa chỉ</td>
                <td>{nguoiDung.dia_chi || "Chưa cập nhật"}</td>
              </tr>

              <tr>
                <td>Trạng thái tài khoản</td>
                <td>{nguoiDung.ten_trang_thai_tai_khoan}</td>
              </tr>

              <tr>
                <td>Trạng thái xác minh</td>
                <td>{nguoiDung.ten_trang_thai_xac_minh}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Profile;