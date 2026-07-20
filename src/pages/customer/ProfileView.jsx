import { useEffect, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

function Profile() {
  const [hoSo, setHoSo] = useState(null);
  const [popupThongBao, setPopupThongBao] = useState("");
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

  function moPopupThongBao(noiDung) {
    setPopupThongBao(noiDung);
  }

  function hienThi(giaTri) {
    return giaTri || "-";
  }

  function dinhDangNgay(ngay) {
    if (!ngay) return "Chưa có";
    return new Date(ngay).toLocaleDateString("vi-VN");
  }

  function layClassTrangThaiXacMinh(trangThaiId) {
    const id = Number(trangThaiId);

    if (id === 201) return "trang-thai-badge trang-thai-xam";
    if (id === 202) return "trang-thai-badge trang-thai-vang";
    if (id === 203) return "trang-thai-badge trang-thai-xanh";
    if (id === 204) return "trang-thai-badge trang-thai-do";

    return "trang-thai-badge trang-thai-xam";
  }

  async function layThongTinTaiKhoan() {
    try {
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
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    }
  }

  function moPopupCapNhat() {
    setFormCapNhat({
      ho_ten: hoSo?.ho_ten || "",
      so_dien_thoai: hoSo?.so_dien_thoai || "",
      dia_chi: hoSo?.dia_chi || "",
    });

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

    try {
      const phanHoi = await fetch(`${DUONG_DAN_API}/api/me/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...taoHeaderCoToken(),
        },
        body: JSON.stringify(formCapNhat),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setHienPopupCapNhat(false);
        layThongTinTaiKhoan();
        moPopupThongBao(duLieu.message);
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    }
  }

  function moPopupXacMinh() {
    setSoCccd("");
    setAnhMatTruoc(null);
    setAnhMatSau(null);
    setAnhCamCccd(null);
    setHienPopupXacMinh(true);
  }

  async function guiHoSoXacMinh(e) {
    e.preventDefault();

    try {
      setDangGuiHoSo(true);

      if (!soCccd || !anhMatTruoc || !anhMatSau || !anhCamCccd) {
        moPopupThongBao("Vui lòng nhập đầy đủ hồ sơ xác minh");
        setDangGuiHoSo(false);
        return;
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

      if (duLieu.success) {
        setHienPopupXacMinh(false);
        layThongTinTaiKhoan();
        moPopupThongBao(duLieu.message);
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    } finally {
      setDangGuiHoSo(false);
    }
  }

  function hienThiAnhXacMinh(tieuDe, url) {
    return (
      <div className="the-anh-xac-minh">
        <h4>{tieuDe}</h4>

        {url ? (
          <img src={url} alt={tieuDe} onClick={() => setAnhDangXem(url)} />
        ) : (
          <div className="khung-chua-co-anh">Chưa có ảnh</div>
        )}
      </div>
    );
  }

  useEffect(() => {
    layThongTinTaiKhoan();
  }, []);

  return (
    <div className="trang-ho-so-cua-toi">
      {hoSo && (
        <>
          <div className="the-ho-so-ca-nhan">
            <div className="dong-tieu-de-ho-so">
              <h2>Hồ sơ của tôi</h2>

              <button className="nut-sua-ho-so" type="button" onClick={moPopupCapNhat}>
                ✎ Cập nhật
              </button>
            </div>

            <div className="luoi-thong-tin-ho-so">
              <div className="dong-thong-tin-ho-so">
                <span>Họ và tên:</span>
                <b>{hienThi(hoSo.ho_ten)}</b>
              </div>

              <div className="dong-thong-tin-ho-so">
                <span>Số điện thoại:</span>
                <b>{hienThi(hoSo.so_dien_thoai)}</b>
              </div>

              <div className="dong-thong-tin-ho-so">
                <span>Email:</span>
                <b>{hienThi(hoSo.email)}</b>
              </div>

              <div className="dong-thong-tin-ho-so">
                <span>Địa chỉ:</span>
                <b>{hoSo.dia_chi || "Chưa cập nhật"}</b>
              </div>

              <div className="dong-thong-tin-ho-so">
                <span>Trạng thái xác minh:</span>
                <b className="o-trang-thai-xac-minh-ho-so">
                  <span className={layClassTrangThaiXacMinh(hoSo.trang_thai_xac_minh)}>
                    {hoSo.ten_trang_thai_xac_minh || "Chưa xác minh"}
                  </span>
                </b>
              </div>

              <div className="dong-thong-tin-ho-so">
                <span>Số CCCD:</span>
                <b>{hoSo.so_cccd || "Chưa gửi hồ sơ"}</b>
              </div>

              <div className="dong-thong-tin-ho-so">
                <span>Ngày gửi hồ sơ:</span>
                <b>{dinhDangNgay(hoSo.ngay_gui)}</b>
              </div>

              <div className="dong-thong-tin-ho-so">
                <span>Ngày duyệt:</span>
                <b>{dinhDangNgay(hoSo.duyet_luc)}</b>
              </div>

              <div className="dong-thong-tin-ho-so dong-day-du">
                <span>Lý do từ chối:</span>
                <b>{hoSo.ly_do_tu_choi || "Không có"}</b>
              </div>
            </div>
          </div>

          <div className="the-ho-so-ca-nhan">
            <div className="dong-tieu-de-ho-so">
              <h2>Ảnh xác minh</h2>

              {(!hoSo.ho_so_xac_minh_id ||
                Number(hoSo.trang_thai_xac_minh) === 204) && (
                <button className="nut-sua-ho-so" type="button" onClick={moPopupXacMinh}>
                  + Gửi hồ sơ xác minh
                </button>
              )}
            </div>

            {hoSo.ho_so_xac_minh_id ? (
              <div className="luoi-anh-xac-minh">
                {hienThiAnhXacMinh("CCCD mặt trước", hoSo.anh_mat_truoc_url)}
                {hienThiAnhXacMinh("CCCD mặt sau", hoSo.anh_mat_sau_url)}
                {hienThiAnhXacMinh("Ảnh cầm CCCD", hoSo.anh_cam_cccd_url)}
              </div>
            ) : (
              <p className="thong-bao-trong-the">Bạn chưa gửi hồ sơ xác minh.</p>
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
                <button className="nut-cap-nhat-popup" type="submit">
                  Cập nhật
                </button>

                <button
                  className="nut-huy"
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
                <button className="nut-luu" type="submit" disabled={dangGuiHoSo}>
                  {dangGuiHoSo ? "Đang gửi..." : "Gửi hồ sơ"}
                </button>

                <button
                  className="nut-huy"
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

      {popupThongBao && (
        <div className="popup-thong-bao-overlay">
          <div className="popup-thong-bao">
            <p>{popupThongBao}</p>

            <button
              className="nut-dong-y"
              type="button"
              onClick={() => setPopupThongBao("")}
            >
              OK
            </button>
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