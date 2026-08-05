import { useEffect, useMemo, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

const SO_DONG_MOI_TRANG = 10;
const TRANG_THAI_HIEN_THI = 601;
const TRANG_THAI_DA_AN = 602;

function AdminEquipmentBrandList() {
  const [tabDangChon, setTabDangChon] = useState("HANG");

  const [danhSachHang, setDanhSachHang] = useState([]);
  const [danhSachNgam, setDanhSachNgam] = useState([]);

  const [tuKhoaNhap, setTuKhoaNhap] = useState("");
  const [tuKhoa, setTuKhoa] = useState("");
  const [trangThaiLoc, setTrangThaiLoc] = useState("0");

  const [trangHienTai, setTrangHienTai] = useState(1);
  const [dangTai, setDangTai] = useState(false);
  const [dangGui, setDangGui] = useState(false);

  const [cheDoPopup, setCheDoPopup] = useState("");
  const [duLieuDangChon, setDuLieuDangChon] = useState(null);

  const [formHang, setFormHang] = useState({
    ten_hang: "",
  });

  const [formNgam, setFormNgam] = useState({
    ten_ngam: "",
    hang_so_huu_id: "",
  });

  const [popupThongBao, setPopupThongBao] = useState("");
  const [popupXacNhan, setPopupXacNhan] = useState(null);

  useEffect(() => {
    layToanBoDuLieu();
  }, []);

  function moPopupThongBao(noiDung) {
    setPopupThongBao(noiDung || "Có lỗi xảy ra");
  }

  function hienThi(giaTri) {
    return giaTri || "-";
  }

  function taoHeaderJson() {
    return {
      "Content-Type": "application/json",
      ...taoHeaderCoToken(),
    };
  }

  function layClassTrangThai(trangThai) {
    return Number(trangThai) === TRANG_THAI_HIEN_THI
      ? "trang-thai-badge trang-thai-xanh"
      : "trang-thai-badge trang-thai-xam";
  }

  function layTrangThaiMoi(item) {
    return Number(item.trang_thai) === TRANG_THAI_HIEN_THI
      ? TRANG_THAI_DA_AN
      : TRANG_THAI_HIEN_THI;
  }

  function layTenNutTrangThai(item) {
    return Number(item.trang_thai) === TRANG_THAI_HIEN_THI
      ? "Ẩn"
      : "Hiện";
  }

  function layClassNutTrangThai(item) {
    return Number(item.trang_thai) === TRANG_THAI_HIEN_THI
      ? "nut-an"
      : "nut-hien";
  }

  async function layToanBoDuLieu() {
    try {
      setDangTai(true);

      const [phanHoiHang, phanHoiNgam] = await Promise.all([
        fetch(`${DUONG_DAN_API}/api/equipment-brands`, {
          headers: taoHeaderCoToken(),
        }),
        fetch(`${DUONG_DAN_API}/api/equipment-mounts`, {
          headers: taoHeaderCoToken(),
        }),
      ]);

      const [duLieuHang, duLieuNgam] = await Promise.all([
        phanHoiHang.json(),
        phanHoiNgam.json(),
      ]);

      if (!duLieuHang.success) {
        throw new Error(duLieuHang.message);
      }

      if (!duLieuNgam.success) {
        throw new Error(duLieuNgam.message);
      }

      setDanhSachHang(duLieuHang.data || []);
      setDanhSachNgam(duLieuNgam.data || []);
    } catch (loi) {
      moPopupThongBao(loi.message || "Không kết nối được server");
    } finally {
      setDangTai(false);
    }
  }

  function doiTab(tabMoi) {
    setTabDangChon(tabMoi);
    setTuKhoaNhap("");
    setTuKhoa("");
    setTrangThaiLoc("0");
    setTrangHienTai(1);
    dongPopup();
  }

  function moThem() {
    setDuLieuDangChon(null);

    if (tabDangChon === "HANG") {
      setFormHang({
        ten_hang: "",
      });
    } else {
      setFormNgam({
        ten_ngam: "",
        hang_so_huu_id: "",
      });
    }

    setCheDoPopup("THEM");
  }

  function moCapNhat(item) {
    setDuLieuDangChon(item);

    if (tabDangChon === "HANG") {
      setFormHang({
        ten_hang: item.ten_hang || "",
      });
    } else {
      setFormNgam({
        ten_ngam: item.ten_ngam || "",
        hang_so_huu_id: item.hang_so_huu_id || "",
      });
    }

    setCheDoPopup("CAP_NHAT");
  }

  function dongPopup() {
    setCheDoPopup("");
    setDuLieuDangChon(null);

    setFormHang({
      ten_hang: "",
    });

    setFormNgam({
      ten_ngam: "",
      hang_so_huu_id: "",
    });
  }

  function kiemTraForm() {
    if (tabDangChon === "HANG") {
      if (!formHang.ten_hang.trim()) {
        moPopupThongBao("Vui lòng nhập tên hãng");
        return false;
      }

      return true;
    }

    if (!formNgam.ten_ngam.trim()) {
      moPopupThongBao("Vui lòng nhập tên ngàm");
      return false;
    }

    if (!formNgam.hang_so_huu_id) {
      moPopupThongBao("Vui lòng chọn hãng");
      return false;
    }

    return true;
  }

  async function guiForm(e) {
    e.preventDefault();

    if (!kiemTraForm()) return;

    try {
      setDangGui(true);

      const laThem = cheDoPopup === "THEM";
      const laHang = tabDangChon === "HANG";

      const url = laHang
        ? laThem
          ? `${DUONG_DAN_API}/api/equipment-brands`
          : `${DUONG_DAN_API}/api/equipment-brands/${duLieuDangChon.id}`
        : laThem
        ? `${DUONG_DAN_API}/api/equipment-mounts`
        : `${DUONG_DAN_API}/api/equipment-mounts/${duLieuDangChon.id}`;

      const body = laHang
        ? {
            ten_hang: formHang.ten_hang,
          }
        : {
            ten_ngam: formNgam.ten_ngam,
            hang_so_huu_id: formNgam.hang_so_huu_id,
          };

      const phanHoi = await fetch(url, {
        method: laThem ? "POST" : "PUT",
        headers: taoHeaderJson(),
        body: JSON.stringify(body),
      });

      const duLieu = await phanHoi.json();

      if (!duLieu.success) {
        moPopupThongBao(duLieu.message);
        return;
      }

      await layToanBoDuLieu();
      dongPopup();
      moPopupThongBao(duLieu.message);
    } catch {
      moPopupThongBao("Không kết nối được server");
    } finally {
      setDangGui(false);
    }
  }

  function xacNhanDoiTrangThai(item) {
    const trangThaiMoi = layTrangThaiMoi(item);
    const hanhDong =
      trangThaiMoi === TRANG_THAI_DA_AN ? "ẩn" : "hiện";

    const ten =
      tabDangChon === "HANG" ? item.ten_hang : item.ten_ngam;

    setPopupXacNhan({
      noiDung: `Bạn có chắc muốn ${hanhDong} ${
        tabDangChon === "HANG" ? "hãng" : "ngàm"
      } "${ten}" không?`,
      hanhDong: async () => {
        await doiTrangThai(item, trangThaiMoi);
      },
    });
  }

  async function doiTrangThai(item, trangThaiMoi) {
    try {
      setPopupXacNhan(null);

      const laHang = tabDangChon === "HANG";

      const url = laHang
        ? `${DUONG_DAN_API}/api/equipment-brands/${item.id}/status`
        : `${DUONG_DAN_API}/api/equipment-mounts/${item.id}/status`;

      const phanHoi = await fetch(url, {
        method: laHang ? "PUT" : "PATCH",
        headers: taoHeaderJson(),
        body: JSON.stringify({
          trang_thai: trangThaiMoi,
        }),
      });

      const duLieu = await phanHoi.json();

      if (!duLieu.success) {
        moPopupThongBao(duLieu.message);
        return;
      }

      await layToanBoDuLieu();
      moPopupThongBao(duLieu.message);
    } catch {
      moPopupThongBao("Không kết nối được server");
    }
  }

  const danhSachSauLoc = useMemo(() => {
    const danhSach =
      tabDangChon === "HANG" ? danhSachHang : danhSachNgam;

    return danhSach.filter((item) => {
      const dungTrangThai =
        trangThaiLoc === "0" ||
        Number(item.trang_thai) === Number(trangThaiLoc);

      const noiDung =
        tabDangChon === "HANG"
          ? `${item.ten_hang || ""} ${item.ten_trang_thai || ""}`
          : `${item.ten_ngam || ""} ${item.ten_hang || ""} ${
              item.ten_trang_thai || ""
            }`;

      return (
        dungTrangThai &&
        noiDung.toLowerCase().includes(tuKhoa.toLowerCase())
      );
    });
  }, [
    tabDangChon,
    danhSachHang,
    danhSachNgam,
    tuKhoa,
    trangThaiLoc,
  ]);

  const tongTrang = Math.max(
    1,
    Math.ceil(danhSachSauLoc.length / SO_DONG_MOI_TRANG)
  );

  const viTriBatDau = (trangHienTai - 1) * SO_DONG_MOI_TRANG;

  const danhSachHienThi = danhSachSauLoc.slice(
    viTriBatDau,
    viTriBatDau + SO_DONG_MOI_TRANG
  );

  const danhSachHangDangHienThi = danhSachHang.filter(
    (item) => Number(item.trang_thai) === TRANG_THAI_HIEN_THI
  );

  const hangCuDangBiAn =
    tabDangChon === "NGAM" &&
    duLieuDangChon?.hang_so_huu_id &&
    !danhSachHangDangHienThi.some(
      (item) =>
        String(item.id) === String(duLieuDangChon.hang_so_huu_id)
    )
      ? danhSachHang.find(
          (item) =>
            String(item.id) ===
            String(duLieuDangChon.hang_so_huu_id)
        )
      : null;

  return (
    <div className="khung-trang trang-quan-ly-hang-thiet-bi">
      <h2>Quản lý hãng và ngàm thiết bị</h2>

      <div className="thanh-tab-quan-ly">
        <button
          type="button"
          className={
            tabDangChon === "HANG"
              ? "nut-tab-quan-ly nut-tab-dang-chon"
              : "nut-tab-quan-ly"
          }
          onClick={() => doiTab("HANG")}
        >
          Hãng thiết bị
        </button>

        <button
          type="button"
          className={
            tabDangChon === "NGAM"
              ? "nut-tab-quan-ly nut-tab-dang-chon"
              : "nut-tab-quan-ly"
          }
          onClick={() => doiTab("NGAM")}
        >
          Ngàm thiết bị
        </button>
      </div>

      <div className="khung-loc-admin">
        <input
          placeholder={
            tabDangChon === "HANG"
              ? "Tìm tên hãng hoặc trạng thái"
              : "Tìm tên ngàm, hãng hoặc trạng thái"
          }
          value={tuKhoaNhap}
          onChange={(e) => {
            setTuKhoaNhap(e.target.value);
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
          <option value="0">Tất cả trạng thái</option>
          <option value="601">Hiển thị</option>
          <option value="602">Đã ẩn</option>
        </select>

        <button className="nut-them" type="button" onClick={moThem}>
          {tabDangChon === "HANG" ? "Thêm hãng" : "Thêm ngàm"}
        </button>
      </div>

      <div className="admin-bang-wrapper">
        {tabDangChon === "HANG" ? (
          <table className="bang-quan-ly bang-gon">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên hãng</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {dangTai ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : danhSachHienThi.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                danhSachHienThi.map((hang, index) => (
                  <tr key={hang.id}>
                    <td>{viTriBatDau + index + 1}</td>
                    <td>{hienThi(hang.ten_hang)}</td>

                    <td>
                      <span className={layClassTrangThai(hang.trang_thai)}>
                        {hienThi(hang.ten_trang_thai)}
                      </span>
                    </td>

                    <td>
                      <div className="cot-thao-tac">
                        <button
                          className="nut-cap-nhat"
                          type="button"
                          onClick={() => moCapNhat(hang)}
                        >
                          Cập nhật
                        </button>

                        <button
                          className={layClassNutTrangThai(hang)}
                          type="button"
                          onClick={() => xacNhanDoiTrangThai(hang)}
                        >
                          {layTenNutTrangThai(hang)}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="bang-quan-ly bang-gon bang-ngam-thiet-bi">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên ngàm</th>
                <th>Hãng</th>
                <th>Số mẫu đang dùng</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {dangTai ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : danhSachHienThi.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                danhSachHienThi.map((ngam, index) => (
                  <tr key={ngam.id}>
                    <td>{viTriBatDau + index + 1}</td>
                    <td>{hienThi(ngam.ten_ngam)}</td>
                    <td>{hienThi(ngam.ten_hang)}</td>
                    <td>{Number(ngam.so_mau_dang_dung || 0)}</td>

                    <td>
                      <span className={layClassTrangThai(ngam.trang_thai)}>
                        {hienThi(ngam.ten_trang_thai)}
                      </span>
                    </td>

                    <td>
                      <div className="cot-thao-tac">
                        <button
                          className="nut-cap-nhat"
                          type="button"
                          onClick={() => moCapNhat(ngam)}
                        >
                          Cập nhật
                        </button>

                        <button
                          className={layClassNutTrangThai(ngam)}
                          type="button"
                          onClick={() => xacNhanDoiTrangThai(ngam)}
                        >
                          {layTenNutTrangThai(ngam)}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="phan-trang">
        <button
          className="nut-dong-popup"
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
          className="nut-dong-popup"
          type="button"
          disabled={trangHienTai === tongTrang}
          onClick={() => setTrangHienTai(trangHienTai + 1)}
        >
          Sau
        </button>
      </div>

      {(cheDoPopup === "THEM" || cheDoPopup === "CAP_NHAT") && (
        <div className="popup-nen">
          <div className="popup-hop">
            <div className="popup-tieu-de">
              <h3>
                {cheDoPopup === "THEM" ? "Thêm" : "Cập nhật"}{" "}
                {tabDangChon === "HANG" ? "hãng thiết bị" : "ngàm thiết bị"}
              </h3>
            </div>

            <div className="popup-noi-dung">
              <form onSubmit={guiForm}>
                {tabDangChon === "HANG" ? (
                  <div className="o-form">
                    <label>Tên hãng</label>

                    <input
                      value={formHang.ten_hang}
                      onChange={(e) =>
                        setFormHang({
                          ...formHang,
                          ten_hang: e.target.value,
                        })
                      }
                    />
                  </div>
                ) : (
                  <>
                    <div className="o-form">
                      <label>Tên ngàm</label>

                      <input
                        value={formNgam.ten_ngam}
                        onChange={(e) =>
                          setFormNgam({
                            ...formNgam,
                            ten_ngam: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="o-form">
                      <label>Hãng</label>

                      <select
                        value={formNgam.hang_so_huu_id}
                        onChange={(e) =>
                          setFormNgam({
                            ...formNgam,
                            hang_so_huu_id: e.target.value,
                          })
                        }
                      >
                        <option value="">-- Chọn hãng --</option>

                        {hangCuDangBiAn && (
                          <option value={hangCuDangBiAn.id} disabled>
                            {hangCuDangBiAn.ten_hang} - Đã ẩn
                          </option>
                        )}

                        {danhSachHangDangHienThi.map((hang) => (
                          <option key={hang.id} value={hang.id}>
                            {hang.ten_hang}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div className="popup-actions">
                  <button
                    className={
                      cheDoPopup === "THEM"
                        ? "nut-them"
                        : "nut-cap-nhat-popup"
                    }
                    type="submit"
                    disabled={dangGui}
                  >
                    {dangGui
                      ? "Đang lưu..."
                      : cheDoPopup === "THEM"
                      ? "Thêm"
                      : "Cập nhật"}
                  </button>

                  <button
                    className="nut-huy"
                    type="button"
                    onClick={dongPopup}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {popupXacNhan && (
        <div className="popup-nen">
          <div className="popup-hop popup-xac-nhan">
            <div className="popup-tieu-de">
              <h3>Xác nhận</h3>
            </div>

            <div className="popup-noi-dung">
              <p>{popupXacNhan.noiDung}</p>

              <div className="popup-actions">
                <button
                  className="nut-dong-y"
                  type="button"
                  onClick={popupXacNhan.hanhDong}
                >
                  Đồng ý
                </button>

                <button
                  className="nut-huy"
                  type="button"
                  onClick={() => setPopupXacNhan(null)}
                >
                  Hủy
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
    </div>
  );
}

export default AdminEquipmentBrandList;