import { useEffect, useRef, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

function Profile() {
  const [hoSo, setHoSo] = useState(null);
  const [popupThongBao, setPopupThongBao] = useState("");
  const [anhDangXem, setAnhDangXem] = useState("");
  const [blobAnhXacMinh, setBlobAnhXacMinh] = useState({});
  const blobUrlsRef = useRef(new Set());

  const [hienPopupCapNhat, setHienPopupCapNhat] = useState(false);
  const [hienPopupXacMinh, setHienPopupXacMinh] = useState(false);
  const [hienPopupXacNhanXacMinh, setHienPopupXacNhanXacMinh] = useState(false);

  const [formCapNhat, setFormCapNhat] = useState({
    ho_ten: "",
    so_dien_thoai: "",
    dia_chi: "",
  });

  const [soCccd, setSoCccd] = useState("");
  const [anhMatTruoc, setAnhMatTruoc] = useState(null);
  const [anhMatSau, setAnhMatSau] = useState(null);
  const [anhCamCccd, setAnhCamCccd] = useState(null);

  // URL xem trước cho 3 ảnh khách vừa chọn trước khi gửi lên Backend.
  const [anhXemTruoc, setAnhXemTruoc] = useState({
    matTruoc: "",
    matSau: "",
    camCccd: "",
  });

  // Ref dùng để xóa giá trị của ô Choose File khi người dùng bấm Xóa ảnh.
  const inputAnhMatTruocRef = useRef(null);
  const inputAnhMatSauRef = useRef(null);
  const inputAnhCamCccdRef = useRef(null);

  const [dangGuiHoSo, setDangGuiHoSo] = useState(false);

  const daDuocDuyet = Number(hoSo?.trang_thai_xac_minh) === 203;

  function moPopupThongBao(noiDung) {
    setPopupThongBao(noiDung);
  }

  function taoBlobUrl(blob) {
    const blobUrl = URL.createObjectURL(blob);
    blobUrlsRef.current.add(blobUrl);
    return blobUrl;
  }

  function thuHoiBlobUrl(blobUrl) {
    if (!blobUrl || !blobUrl.startsWith("blob:")) return;
    URL.revokeObjectURL(blobUrl);
    blobUrlsRef.current.delete(blobUrl);
  }

  function xoaBlobAnhXacMinh() {
    setBlobAnhXacMinh((hienTai) => {
      Object.values(hienTai).forEach(thuHoiBlobUrl);
      return {};
    });
  }

  // Chọn ảnh và tạo blob URL cục bộ để xem trước ngay trên popup.
  function chonAnhXacMinh(e, loaiAnh, setFile) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!String(file.type || "").startsWith("image/")) {
      moPopupThongBao("File tải lên phải là ảnh");
      e.target.value = "";
      return;
    }

    const blobUrlMoi = taoBlobUrl(file);

    setAnhXemTruoc((hienTai) => {
      // Nếu người dùng chọn lại ảnh thì thu hồi blob URL cũ.
      thuHoiBlobUrl(hienTai[loaiAnh]);

      return {
        ...hienTai,
        [loaiAnh]: blobUrlMoi,
      };
    });

    setFile(file);
  }

  // Xóa một ảnh đã chọn khỏi form gửi hồ sơ.
  function xoaAnhXacMinhDaChon(loaiAnh, setFile, inputRef) {
    setAnhXemTruoc((hienTai) => {
      const blobUrlCu = hienTai[loaiAnh];

      if (anhDangXem === blobUrlCu) {
        setAnhDangXem("");
      }

      thuHoiBlobUrl(blobUrlCu);

      return {
        ...hienTai,
        [loaiAnh]: "",
      };
    });

    setFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  // Xóa toàn bộ ảnh xem trước khi đóng popup hoặc gửi thành công.
  function xoaTatCaAnhXemTruoc() {
    setAnhDangXem("");

    setAnhXemTruoc((hienTai) => {
      Object.values(hienTai).forEach(thuHoiBlobUrl);

      return {
        matTruoc: "",
        matSau: "",
        camCccd: "",
      };
    });

    setAnhMatTruoc(null);
    setAnhMatSau(null);
    setAnhCamCccd(null);

    if (inputAnhMatTruocRef.current) inputAnhMatTruocRef.current.value = "";
    if (inputAnhMatSauRef.current) inputAnhMatSauRef.current.value = "";
    if (inputAnhCamCccdRef.current) inputAnhCamCccdRef.current.value = "";
  }

  function dongPopupXacMinh() {
    setHienPopupXacNhanXacMinh(false);
    setHienPopupXacMinh(false);
    xoaTatCaAnhXemTruoc();
  }

  // Giữ nguyên ô Choose File giống phần bàn giao/thanh lý.
  // Sau khi chọn ảnh sẽ hiện ảnh xem trước bên dưới và có nút Xóa.
  function hienThiAnhDaChon({
    tieuDe,
    loaiAnh,
    file,
    blobUrl,
    setFile,
    inputRef,
  }) {
    return (
      <div className="o-form">
        <label>{tieuDe}</label>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => chonAnhXacMinh(e, loaiAnh, setFile)}
        />

        {file && blobUrl && (
          <div
            className="danh-sach-anh-da-chon"
            style={{
              marginTop: "10px",
              gridTemplateColumns: "repeat(1, minmax(0, 180px))",
            }}
          >
            <div className="the-anh-da-chon">
              <img
                src={blobUrl}
                alt={tieuDe}
                title="Bấm để xem ảnh"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                onClick={() => setAnhDangXem(blobUrl)}
                style={{ cursor: "pointer" }}
              />

              <button
                className="nut-do nut-xoa-anh"
                type="button"
                onClick={() =>
                  xoaAnhXacMinhDaChon(loaiAnh, setFile, inputRef)
                }
              >
                Xóa
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach((blobUrl) => URL.revokeObjectURL(blobUrl));
      blobUrlsRef.current.clear();
    };
  }, []);

  async function layBlobAnhXacMinhBaoVe(hoSoId, loaiAnh) {
    const phanHoi = await fetch(
      `${String(DUONG_DAN_API).replace(/\/+$/, "")}/api/protected-files/verifications/${hoSoId}/${loaiAnh}/content`,
      {
        headers: taoHeaderCoToken(),
      }
    );

    if (!phanHoi.ok) {
      const duLieuLoi = await phanHoi.json().catch(() => ({}));
      throw new Error(duLieuLoi.message || "Không thể tải ảnh xác minh");
    }

    const blob = await phanHoi.blob();
    return taoBlobUrl(blob);
  }

  async function taiAnhXacMinhBaoVe(duLieuHoSo) {
    xoaBlobAnhXacMinh();

    if (!duLieuHoSo?.ho_so_xac_minh_id) {
      return;
    }

    const cauHinh = [
      ["front", "co_anh_mat_truoc"],
      ["back", "co_anh_mat_sau"],
      ["holding", "co_anh_cam_cccd"],
    ];

    const ketQua = {};

    await Promise.all(
      cauHinh.map(async ([loaiAnh, truongCoAnh]) => {
        if (!duLieuHoSo[truongCoAnh]) return;

        try {
          ketQua[loaiAnh] = await layBlobAnhXacMinhBaoVe(
            duLieuHoSo.ho_so_xac_minh_id,
            loaiAnh
          );
        } catch {
          ketQua[loaiAnh] = "";
        }
      })
    );

    setBlobAnhXacMinh(ketQua);
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
        await taiAnhXacMinhBaoVe(duLieu.data);

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
      const bodyGuiDi = daDuocDuyet
        ? {
            so_dien_thoai: formCapNhat.so_dien_thoai,
            dia_chi: formCapNhat.dia_chi,
          }
        : formCapNhat;

      const phanHoi = await fetch(`${DUONG_DAN_API}/api/me/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...taoHeaderCoToken(),
        },
        body: JSON.stringify(bodyGuiDi),
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
    if (
      !String(hoSo?.so_dien_thoai || "").trim() ||
      !String(hoSo?.dia_chi || "").trim()
    ) {
      moPopupThongBao(
        "Vui lòng cập nhật số điện thoại và địa chỉ hiện tại trước khi gửi hồ sơ xác minh"
      );
      return;
    }

    setSoCccd("");
    xoaTatCaAnhXemTruoc();
    setHienPopupXacNhanXacMinh(false);
    setHienPopupXacMinh(true);
  }

  // Bấm Gửi hồ sơ lần đầu chỉ mở popup xác nhận thông tin.
  function guiHoSoXacMinh(e) {
    e.preventDefault();

    if (!soCccd || !anhMatTruoc || !anhMatSau || !anhCamCccd) {
      moPopupThongBao("Vui lòng nhập đầy đủ hồ sơ xác minh");
      return;
    }

    if (!/^[0-9]{12}$/.test(String(soCccd).trim())) {
      moPopupThongBao("Số CCCD phải gồm 12 chữ số");
      return;
    }

    setHienPopupXacNhanXacMinh(true);
  }

  // Chỉ gửi lên Backend sau khi khách hàng xác nhận Họ tên và Số CCCD.
  async function xacNhanGuiHoSoXacMinh() {
    try {
      setDangGuiHoSo(true);

      const formData = new FormData();

      formData.append("so_cccd", String(soCccd).trim());
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
        setHienPopupXacNhanXacMinh(false);
        setHienPopupXacMinh(false);
        xoaTatCaAnhXemTruoc();
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
          <img
            src={url}
            alt={tieuDe}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onClick={() => setAnhDangXem(url)}
          />
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
                {hienThiAnhXacMinh(
                  "CCCD mặt trước",
                  hoSo.co_anh_mat_truoc ? blobAnhXacMinh.front : ""
                )}
                {hienThiAnhXacMinh(
                  "CCCD mặt sau",
                  hoSo.co_anh_mat_sau ? blobAnhXacMinh.back : ""
                )}
                {hienThiAnhXacMinh(
                  "Ảnh cầm CCCD",
                  hoSo.co_anh_cam_cccd ? blobAnhXacMinh.holding : ""
                )}
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
              {!daDuocDuyet && (
                <div className="o-form">
                  <label>Họ tên</label>

                  <input
                    name="ho_ten"
                    value={formCapNhat.ho_ten}
                    onChange={thayDoiFormCapNhat}
                  />
                </div>
              )}

              <div className="o-form">
                <label>Số điện thoại</label>

                <input
                  name="so_dien_thoai"
                  value={formCapNhat.so_dien_thoai}
                  onChange={thayDoiFormCapNhat}
                />
              </div>

              <div className="o-form">
                <label>Địa chỉ hiện tại</label>

                <input
                  name="dia_chi"
                  value={formCapNhat.dia_chi}
                  placeholder="Vui lòng nhập địa chỉ hiện tại"
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
              <div
                style={{
                  marginBottom: "14px",
                  padding: "10px 12px",
                  border: "1px solid #f59e0b",
                  borderRadius: "6px",
                  background: "#fffbeb",
                }}
              >
                <b>Lưu ý:</b> Họ tên và số CCCD phải trùng khớp với thông tin
                trên CCCD. Vui lòng kiểm tra kỹ trước khi gửi hồ sơ xác minh.
              </div>

              <div className="o-form">
                <label>Số CCCD</label>

                <input
                  value={soCccd}
                  onChange={(e) => setSoCccd(e.target.value)}
                />
              </div>

              {hienThiAnhDaChon({
                tieuDe: "Ảnh mặt trước CCCD",
                loaiAnh: "matTruoc",
                file: anhMatTruoc,
                blobUrl: anhXemTruoc.matTruoc,
                setFile: setAnhMatTruoc,
                inputRef: inputAnhMatTruocRef,
              })}

              {hienThiAnhDaChon({
                tieuDe: "Ảnh mặt sau CCCD",
                loaiAnh: "matSau",
                file: anhMatSau,
                blobUrl: anhXemTruoc.matSau,
                setFile: setAnhMatSau,
                inputRef: inputAnhMatSauRef,
              })}

              {hienThiAnhDaChon({
                tieuDe: "Ảnh cầm CCCD",
                loaiAnh: "camCccd",
                file: anhCamCccd,
                blobUrl: anhXemTruoc.camCccd,
                setFile: setAnhCamCccd,
                inputRef: inputAnhCamCccdRef,
              })}

              <div className="popup-actions">
                <button className="nut-luu" type="submit" disabled={dangGuiHoSo}>
                  {dangGuiHoSo ? "Đang gửi..." : "Gửi hồ sơ"}
                </button>

                <button
                  className="nut-huy"
                  type="button"
                  onClick={dongPopupXacMinh}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {hienPopupXacNhanXacMinh && (
        <div className="popup-nen">
          <div className="popup-hop popup-xac-nhan">
            <div className="popup-tieu-de">
              <h3>Xác nhận thông tin xác minh</h3>
            </div>

            <div className="popup-noi-dung">
              <p>
                Vui lòng kiểm tra lại thông tin trước khi gửi. Họ tên và số CCCD
                dưới đây phải trùng khớp với thông tin trên CCCD đã tải lên.
              </p>

              <table className="bang-popup">
                <tbody>
                  <tr>
                    <td>Họ và tên</td>
                    <td>
                      <b>{hoSo?.ho_ten || "-"}</b>
                    </td>
                  </tr>

                  <tr>
                    <td>Số CCCD</td>
                    <td>
                      <b>{String(soCccd || "").trim()}</b>
                    </td>
                  </tr>
                </tbody>
              </table>

              <p style={{ marginTop: "14px" }}>
                Bạn xác nhận các thông tin trên là chính xác và trùng khớp với
                CCCD?
              </p>

              <div className="popup-actions">
                <button
                  className="nut-dong-y"
                  type="button"
                  disabled={dangGuiHoSo}
                  onClick={xacNhanGuiHoSoXacMinh}
                >
                  {dangGuiHoSo ? "Đang gửi..." : "Xác nhận gửi"}
                </button>

                <button
                  className="nut-huy"
                  type="button"
                  disabled={dangGuiHoSo}
                  onClick={() => setHienPopupXacNhanXacMinh(false)}
                >
                  Quay lại
                </button>
              </div>
            </div>
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
            <img
              src={anhDangXem}
              alt="Ảnh xác minh"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;