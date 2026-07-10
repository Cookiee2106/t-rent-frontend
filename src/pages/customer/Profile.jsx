import { useEffect, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

function Profile() {
  const [hoSo, setHoSo] = useState(null);
  const [thongBao, setThongBao] = useState("");
  const [anhDangXem, setAnhDangXem] = useState("");
  const [hienPopupCapNhat, setHienPopupCapNhat] = useState(false);
  const [hienPopupXacMinh, setHienPopupXacMinh] = useState(false);
  const [formCapNhat, setFormCapNhat] = useState({
    ho_ten: "",
    so_dien_thoai: "",
    dia_chi: "",
  });
  const [soCccd, setSoCccd] = useState("");
  const [anhMatTruoc, setAnhMatTruoc] = useState(null);
  const [anhMatSau, setAnhMatSau] = useState(null);
  const [anhCamCccd, setAnhCamCccd] = useState(null);
  const [dangGuiHoSo, setDangGuiHoSo] = useState(false);

  function dinhDangNgay(ngay) {
    if (!ngay) return "Chưa có";
    return new Date(ngay).toLocaleString("vi-VN");
  }

  async function layThongTinTaiKhoan() {
    const phanHoi = await fetch(`${DUONG_DAN_API}/api/me/verification`, {
      headers: taoHeaderCoToken(),
    });

    const duLieu = await phanHoi.json();

    if (duLieu.success) {
      setHoSo(duLieu.data);
      const nguoiDung = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...nguoiDung,
          ho_ten: duLieu.data.ho_ten,
          email: duLieu.data.email,
          so_dien_thoai: duLieu.data.so_dien_thoai,
          dia_chi: duLieu.data.dia_chi,
        })
      );
    } else {
      setThongBao(duLieu.message);
    }
  }

  function moPopupCapNhat() {
    setFormCapNhat({
      ho_ten: hoSo?.ho_ten || "",
      so_dien_thoai: hoSo?.so_dien_thoai || "",
      dia_chi: hoSo?.dia_chi || "",
    });
    setThongBao("");
    setHienPopupCapNhat(true);
  }

  function thayDoiFormCapNhat(e) {
    setFormCapNhat({
      ...formCapNhat,
      [e.target.name]: e.target.value,
    });
  }

  async function guiCapNhatThongTin(e) {
    e.preventDefault();
    const phanHoi = await fetch(`${DUONG_DAN_API}/api/me/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...taoHeaderCoToken(),
      },
      body: JSON.stringify(formCapNhat),
    });

    const duLieu = await phanHoi.json();

    setThongBao(duLieu.message);

    if (duLieu.success) {
      setHienPopupCapNhat(false);
      layThongTinTaiKhoan();
    }
  }

  function moPopupXacMinh() {
    setSoCccd("");
    setAnhMatTruoc(null);
    setAnhMatSau(null);
    setAnhCamCccd(null);
    setThongBao("");
    setHienPopupXacMinh(true);
  }

  async function guiHoSoXacMinh(e) {
    e.preventDefault();

    try {
      setDangGuiHoSo(true);
      setThongBao("");
      if (!soCccd || !anhMatTruoc || !anhMatSau || !anhCamCccd) {
        setDangGuiHoSo(false);
        return setThongBao("Vui lòng nhập đầy đủ hồ sơ xác minh");
      }

      const formData = new FormData();

      formData.append("so_cccd", soCccd);
      formData.append("anh_mat_truoc", anhMatTruoc);
      formData.append("anh_mat_sau", anhMatSau);
      formData.append("anh_cam_cccd", anhCamCccd);

      const phanHoi = await fetch(`${DUONG_DAN_API}/api/me/verification`, {
        method: "POST",
        headers: taoHeaderCoToken(),
        body: formData,
      });

      const duLieu = await phanHoi.json();

      setThongBao(duLieu.message);

      if (duLieu.success) {
        setHienPopupXacMinh(false);
        layThongTinTaiKhoan();
      }
    } catch (loi) {
      setThongBao(loi.message);
    } finally {
      setDangGuiHoSo(false);
    }
  }

  useEffect(() => {
    layThongTinTaiKhoan();
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Tài khoản của tôi</h2>
      {thongBao && <p className="thong-bao">{thongBao}</p>}
      {hoSo && (
        <>
          <div className="khung-giua">
            <table className="bang-don-gian">
              <tbody>
                <tr>
                  <td>Họ tên</td>
                  <td>{hoSo.ho_ten}</td>
                </tr>
                
                <tr>
                  <td>Email</td>
                  <td>{hoSo.email}</td>
                </tr>

                <tr>
                  <td>Số điện thoại</td>
                  <td>{hoSo.so_dien_thoai}</td>
                </tr>

                <tr>
                  <td>Địa chỉ</td>
                  <td>{hoSo.dia_chi || "Chưa cập nhật"}</td>
                </tr>

                <tr>
                  <td>Trạng thái xác minh</td>
                  <td>{hoSo.ten_trang_thai_xac_minh || "Chưa xác minh"}</td>
                </tr>

                <tr>
                  <td>Số CCCD</td>
                  <td>{hoSo.so_cccd || "Chưa gửi hồ sơ"}</td>
                </tr>

                <tr>
                  <td>Lý do từ chối</td>
                  <td>{hoSo.ly_do_tu_choi || "Không có"}</td>
                </tr>

                <tr>
                  <td>Ngày gửi hồ sơ</td>
                  <td>{dinhDangNgay(hoSo.ngay_gui)}</td>
                </tr>

                <tr>
                  <td>Ngày duyệt</td>
                  <td>{dinhDangNgay(hoSo.duyet_luc)}</td>
                </tr>

                {hoSo.ho_so_xac_minh_id && (
                  <tr>
                    <td>Ảnh xác minh</td>
                    <td>
                      <div className="khung-anh-trong-bang">
                        <img
                          src={hoSo.anh_mat_truoc_url}
                          alt="CCCD mặt trước"
                          onClick={() => setAnhDangXem(hoSo.anh_mat_truoc_url)}
                        />

                        <img
                          src={hoSo.anh_mat_sau_url}
                          alt="CCCD mặt sau"
                          onClick={() => setAnhDangXem(hoSo.anh_mat_sau_url)}
                        />

                        <img
                          src={hoSo.anh_cam_cccd_url}
                          alt="Ảnh cầm CCCD"
                          onClick={() => setAnhDangXem(hoSo.anh_cam_cccd_url)}
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="nhom-nut">
            <button onClick={moPopupCapNhat}>Cập nhật thông tin</button>

            {(!hoSo.ho_so_xac_minh_id ||
              Number(hoSo.trang_thai_xac_minh) === 204) && (
              <button onClick={moPopupXacMinh}>Gửi hồ sơ xác minh</button>
            )}
          </div>
        </>
      )}

      {hienPopupCapNhat && (
        <div className="popup-nen">
          <div className="popup-hop">
            <div className="popup-tieu-de">
              <h3>Cập nhật thông tin</h3>
            </div>

            <form onSubmit={guiCapNhatThongTin}>
              <div className="o-form">
                <label>Họ tên</label>

                <input
                  name="ho_ten"
                  value={formCapNhat.ho_ten}
                  onChange={thayDoiFormCapNhat}
                />
              </div>

              <div className="o-form">
                <label>Số điện thoại</label>

                <input
                  name="so_dien_thoai"
                  value={formCapNhat.so_dien_thoai}
                  onChange={thayDoiFormCapNhat}
                />
              </div>

              <div className="o-form">
                <label>Địa chỉ</label>

                <input
                  name="dia_chi"
                  value={formCapNhat.dia_chi}
                  onChange={thayDoiFormCapNhat}
                />
              </div>

              <div className="popup-actions">
                <button type="submit">Cập nhật</button>

                <button
                  type="button"
                  onClick={() => setHienPopupCapNhat(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {hienPopupXacMinh && (
        <div className="popup-nen">
          <div className="popup-hop">
            <div className="popup-tieu-de">
              <h3>Gửi hồ sơ xác minh</h3>
            </div>

            <form onSubmit={guiHoSoXacMinh}>
              <div className="o-form">
                <label>Số CCCD</label>

                <input
                  value={soCccd}
                  onChange={(e) => setSoCccd(e.target.value)}
                />
              </div>

              <div className="o-form">
                <label>Ảnh mặt trước CCCD</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAnhMatTruoc(e.target.files[0])}
                />
              </div>

              <div className="o-form">
                <label>Ảnh mặt sau CCCD</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAnhMatSau(e.target.files[0])}
                />
              </div>

              <div className="o-form">
                <label>Ảnh cầm CCCD</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAnhCamCccd(e.target.files[0])}
                />
              </div>

              <div className="popup-actions">
                <button type="submit" disabled={dangGuiHoSo}>
                  {dangGuiHoSo ? "Đang gửi..." : "Gửi hồ sơ"}
                </button>

                <button
                  type="button"
                  onClick={() => setHienPopupXacMinh(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {anhDangXem && (
        <div className="popup-nen" onClick={() => setAnhDangXem("")}>
          <div className="popup-anh">
            <img src={anhDangXem} alt="Ảnh xác minh" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;