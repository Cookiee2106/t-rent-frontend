import { useEffect, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

const SO_DONG_MOI_TRANG = 10;

const TRANG_THAI_BAO_TRI_DANG_BAO_TRI = 1301;
const TRANG_THAI_BAO_TRI_HOAN_THANH = 1302;

const TRANG_THAI_THIET_BI_SAN_SANG = 501;
const TRANG_THAI_THIET_BI_HU_HONG = 506;

function MaintenanceList() {
  const [danhSachBaoTri, setDanhSachBaoTri] = useState([]);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [tongTrang, setTongTrang] = useState(1);
  const [tuKhoa, setTuKhoa] = useState("");
  const [trangThaiLoc, setTrangThaiLoc] = useState("0");
  const [dangTai, setDangTai] = useState(false);

  const [chiTietBaoTri, setChiTietBaoTri] = useState(null);
  const [baoTriDangCapNhat, setBaoTriDangCapNhat] = useState(null);
  const [dangTaiChiTiet, setDangTaiChiTiet] = useState(false);

  const [formKetQua, setFormKetQua] = useState({
    ket_qua: "",
    trang_thai_sau_bao_tri: String(TRANG_THAI_THIET_BI_SAN_SANG),
  });

  const [popupThongBao, setPopupThongBao] = useState("");
  const [dangGui, setDangGui] = useState(false);

  function moPopup(noiDung) {
    setPopupThongBao(noiDung || "Có lỗi xảy ra");
  }

  function hienThi(giaTri) {
    return giaTri || "-";
  }

  function dinhDangNgay(giaTri) {
    if (!giaTri) return "-";
    return new Date(giaTri).toLocaleDateString("vi-VN");
  }

  function layTenTrangThaiBaoTri(id, tenTrangThai) {
    if (Number(id) === TRANG_THAI_BAO_TRI_HOAN_THANH) return "Hoàn thành";
    if (tenTrangThai) return tenTrangThai;
    if (Number(id) === TRANG_THAI_BAO_TRI_DANG_BAO_TRI) return "Đang bảo trì";
    return id || "-";
  }

  function layClassTrangThaiBaoTri(id) {
    if (Number(id) === TRANG_THAI_BAO_TRI_DANG_BAO_TRI) {
      return "trang-thai-badge trang-thai-vang";
    }

    if (Number(id) === TRANG_THAI_BAO_TRI_HOAN_THANH) {
      return "trang-thai-badge trang-thai-xanh";
    }

    return "trang-thai-badge trang-thai-xam";
  }

  async function layDanhSachBaoTri() {
    try {
      setDangTai(true);

      const params = new URLSearchParams();
      params.set("page", trangHienTai);
      params.set("limit", SO_DONG_MOI_TRANG);

      if (tuKhoa.trim()) {
        params.set("tu_khoa", tuKhoa.trim());
      }

      if (trangThaiLoc !== "0") {
        params.set("trang_thai", trangThaiLoc);
      }

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/maintenances?${params.toString()}`,
        { headers: taoHeaderCoToken() }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        const tongSoDong = Number(duLieu.total || 0);
        setDanhSachBaoTri(duLieu.data || []);
        setTongTrang(Math.max(1, Math.ceil(tongSoDong / SO_DONG_MOI_TRANG)));
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    } finally {
      setDangTai(false);
    }
  }

  async function xemChiTietBaoTri(id) {
    try {
      setDangTaiChiTiet(true);
      setChiTietBaoTri(null);

      const phanHoi = await fetch(`${DUONG_DAN_API}/api/admin/maintenances/${id}`, {
        headers: taoHeaderCoToken(),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setChiTietBaoTri(duLieu.data);
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    } finally {
      setDangTaiChiTiet(false);
    }
  }

  function moFormKetQua(baoTri) {
    setBaoTriDangCapNhat(baoTri);
    setFormKetQua({
      ket_qua: "",
      trang_thai_sau_bao_tri: String(TRANG_THAI_THIET_BI_SAN_SANG),
    });
  }

  function doiFormKetQua(e) {
    setFormKetQua({
      ...formKetQua,
      [e.target.name]: e.target.value,
    });
  }

  async function guiKetQuaBaoTri(e) {
    e.preventDefault();

    if (!formKetQua.ket_qua.trim()) {
      return moPopup("Vui lòng nhập kết quả bảo trì");
    }

    try {
      setDangGui(true);

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/maintenances/${baoTriDangCapNhat.id}/result`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...taoHeaderCoToken(),
          },
          body: JSON.stringify({
            ket_qua: formKetQua.ket_qua.trim(),
            trang_thai_sau_bao_tri: Number(formKetQua.trang_thai_sau_bao_tri),
          }),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setBaoTriDangCapNhat(null);
        moPopup(duLieu.message);
        layDanhSachBaoTri();
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    } finally {
      setDangGui(false);
    }
  }

  useEffect(() => {
    layDanhSachBaoTri();
  }, [trangHienTai, tuKhoa, trangThaiLoc]);

  return (
    <div className="trang-bao-tri">
      <h2>Quản lý bảo trì</h2>

      <div className="khung-loc-admin">
        <input
          placeholder="Tìm mã phiếu, mẫu thiết bị, serial, mã đơn, lý do, kết quả"
          value={tuKhoa}
          onChange={(e) => {
            setTuKhoa(e.target.value);
            setTrangHienTai(1);
          }}
        />

        <select
          value={trangThaiLoc}
          onChange={(e) => {
            setTrangThaiLoc(e.target.value);
            setTrangHienTai(1);
          }}
        >
          <option value="0">Tất cả trạng thái bảo trì</option>
          <option value={TRANG_THAI_BAO_TRI_DANG_BAO_TRI}>Đang bảo trì</option>
          <option value={TRANG_THAI_BAO_TRI_HOAN_THANH}>Hoàn thành</option>
        </select>
      </div>

      <div className="admin-bang-wrapper">
        <table className="bang-quan-ly bang-gon">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã phiếu</th>
              <th>Mẫu thiết bị</th>
              <th>Serial</th>
              <th>Đơn thuê</th>
              {/* <th>Lý do</th>
              <th>Kết quả</th> */}
              <th>Trạng thái</th>
              <th>Bắt đầu</th>
              <th>Hoàn thành</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {dangTai ? (
              <tr>
                <td colSpan="11" style={{ textAlign: "center" }}>
                  Đang tải danh sách bảo trì...
                </td>
              </tr>
            ) : danhSachBaoTri.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ textAlign: "center" }}>
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              danhSachBaoTri.map((item, index) => (
                <tr key={item.id}>
                  <td>{(trangHienTai - 1) * SO_DONG_MOI_TRANG + index + 1}</td>
                  <td>{hienThi(item.ma_phieu_bao_tri)}</td>
                  <td>{hienThi(item.ten_mau)}</td>
                  <td>{hienThi(item.so_serial)}</td>
                  <td>{hienThi(item.ma_don)}</td>
                  {/* <td className="cot-noi-dung-bao-tri">{hienThi(item.ly_do)}</td>
                  <td className="cot-noi-dung-bao-tri">{hienThi(item.ket_qua)}</td> */}
                  <td>
                    <span className={layClassTrangThaiBaoTri(item.trang_thai_bao_tri)}>
                      {layTenTrangThaiBaoTri(
                        item.trang_thai_bao_tri,
                        item.ten_trang_thai_bao_tri
                      )}
                    </span>
                  </td>
                  <td>{dinhDangNgay(item.bat_dau_luc)}</td>
                  <td>{dinhDangNgay(item.hoan_thanh_luc)}</td>
                  <td>
                    <div className="cot-thao-tac">
                      <button
                        className="nut-thao-tac-bang-nhau"
                        type="button"
                        onClick={() => xemChiTietBaoTri(item.id)}
                      >
                        Xem chi tiết
                      </button>

                      <button
                        className="nut-cap-nhat nut-thao-tac-bang-nhau"
                        type="button"
                        disabled={Number(item.trang_thai_bao_tri) === TRANG_THAI_BAO_TRI_HOAN_THANH}
                        onClick={() => moFormKetQua(item)}
                      >
                        Cập nhật
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="phan-trang">
        <button
          type="button"
          disabled={trangHienTai === 1}
          onClick={() => setTrangHienTai(trangHienTai - 1)}
        >
          Trước
        </button>

        <span>
          Trang {trangHienTai} / {tongTrang}
        </span>

        <button
          type="button"
          disabled={trangHienTai === tongTrang}
          onClick={() => setTrangHienTai(trangHienTai + 1)}
        >
          Sau
        </button>
      </div>

      {(chiTietBaoTri || dangTaiChiTiet) && (
        <div className="popup-nen">
          <div className="popup-hop popup-rong">
            <div className="popup-tieu-de">
              <h3>Chi tiết phiếu bảo trì</h3>
              <button type="button" onClick={() => setChiTietBaoTri(null)}>
                Đóng
              </button>
            </div>

            <div className="popup-noi-dung">
              {dangTaiChiTiet && !chiTietBaoTri ? (
                <p className="thong-bao">Đang tải chi tiết bảo trì...</p>
              ) : (
                <table className="bang-popup">
                  <tbody>
                    <tr>
                      <td>Mã phiếu</td>
                      <td>{hienThi(chiTietBaoTri.ma_phieu_bao_tri)}</td>
                    </tr>
                    <tr>
                      <td>Mẫu thiết bị</td>
                      <td>{hienThi(chiTietBaoTri.ten_mau)}</td>
                    </tr>
                    <tr>
                      <td>Serial</td>
                      <td>{hienThi(chiTietBaoTri.so_serial)}</td>
                    </tr>
                    <tr>
                      <td>Đơn thuê liên quan</td>
                      <td>{hienThi(chiTietBaoTri.ma_don)}</td>
                    </tr>
                    <tr>
                      <td>Người tạo</td>
                      <td>{hienThi(chiTietBaoTri.ten_nguoi_tao)}</td>
                    </tr>
                    <tr>
                      <td>Lý do bảo trì</td>
                      <td>{hienThi(chiTietBaoTri.ly_do)}</td>
                    </tr>
                    <tr>
                      <td>Kết quả bảo trì</td>
                      <td>{hienThi(chiTietBaoTri.ket_qua)}</td>
                    </tr>
                    <tr>
                      <td>Trạng thái</td>
                      <td>
                        <span className={layClassTrangThaiBaoTri(chiTietBaoTri.trang_thai_bao_tri)}>
                          {layTenTrangThaiBaoTri(
                            chiTietBaoTri.trang_thai_bao_tri,
                            chiTietBaoTri.ten_trang_thai_bao_tri
                          )}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Bắt đầu lúc</td>
                      <td>{dinhDangNgay(chiTietBaoTri.bat_dau_luc)}</td>
                    </tr>
                    <tr>
                      <td>Hoàn thành lúc</td>
                      <td>{dinhDangNgay(chiTietBaoTri.hoan_thanh_luc)}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {baoTriDangCapNhat && (
        <div className="popup-nen">
          <div className="popup-hop">
            <div className="popup-tieu-de">
              <h3>Cập nhật kết quả bảo trì</h3>
            </div>

            <form onSubmit={guiKetQuaBaoTri}>
              <table className="bang-popup">
                <tbody>
                  <tr>
                    <td>Mã phiếu</td>
                    <td>{hienThi(baoTriDangCapNhat.ma_phieu_bao_tri)}</td>
                  </tr>
                  <tr>
                    <td>Mẫu thiết bị</td>
                    <td>{hienThi(baoTriDangCapNhat.ten_mau)}</td>
                  </tr>
                  <tr>
                    <td>Serial</td>
                    <td>{hienThi(baoTriDangCapNhat.so_serial)}</td>
                  </tr>
                  <tr>
                    <td>Lý do</td>
                    <td>{hienThi(baoTriDangCapNhat.ly_do)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="o-form">
                <label>Kết quả bảo trì</label>
                <textarea
                  name="ket_qua"
                  value={formKetQua.ket_qua}
                  onChange={doiFormKetQua}
                />
              </div>

              <div className="o-form">
                <label>Trạng thái sau bảo trì</label>
                <select
                  name="trang_thai_sau_bao_tri"
                  value={formKetQua.trang_thai_sau_bao_tri}
                  onChange={doiFormKetQua}
                >
                  <option value={TRANG_THAI_THIET_BI_SAN_SANG}>Sẵn sàng</option>
                  <option value={TRANG_THAI_THIET_BI_HU_HONG}>Hư hỏng</option>
                </select>
              </div>

              <div className="popup-actions">
                <button type="submit" disabled={dangGui}>
                  Lưu kết quả
                </button>
                <button
                  className="nut-do"
                  type="button"
                  onClick={() => setBaoTriDangCapNhat(null)}
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
            <button type="button" onClick={() => setPopupThongBao("")}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MaintenanceList;
