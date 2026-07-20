import { useEffect, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

const SO_DONG_MOI_TRANG = 10;

const TRANG_THAI_SAN_SANG = 501;
const TRANG_THAI_DANG_THUE = 502;
const TRANG_THAI_BAO_TRI = 503;
const TRANG_THAI_DA_AN = 504;
const TRANG_THAI_BI_MAT = 505;
const TRANG_THAI_HU_HONG = 506;

function AssetList() {
  const [danhSachThietBi, setDanhSachThietBi] = useState([]);
  const [danhSachMau, setDanhSachMau] = useState([]);
  const [danhSachViTriKho, setDanhSachViTriKho] = useState([]);

  const [tuKhoa, setTuKhoa] = useState("");
  const [hangLoc, setHangLoc] = useState("0");
  const [danhMucLoc, setDanhMucLoc] = useState("0");
  const [trangThaiLoc, setTrangThaiLoc] = useState("0");
  const [trangHienTai, setTrangHienTai] = useState(1);

  const [tenMauDangChon, setTenMauDangChon] = useState("");
  const [hienDanhSachMau, setHienDanhSachMau] = useState(false);

  const [tenViTriDangChon, setTenViTriDangChon] = useState("");
  const [hienDanhSachViTri, setHienDanhSachViTri] = useState(false);

  const [popupThongBao, setPopupThongBao] = useState("");
  const [chiTietThietBi, setChiTietThietBi] = useState(null);

  const [hienForm, setHienForm] = useState(false);
  const [cheDoForm, setCheDoForm] = useState("THEM");
  const [thietBiDangSua, setThietBiDangSua] = useState(null);

  const [xacNhan, setXacNhan] = useState(null);

  const [thietBiBaoTri, setThietBiBaoTri] = useState(null);
  const [lyDoBaoTri, setLyDoBaoTri] = useState("");

  const [form, setForm] = useState({
    mau_thiet_bi_id: "",
    // Không dùng mã tài sản ở FE, giữ lại comment nếu sau này cần mở lại.
    // ma_tai_san: "",
    so_serial: "",
    vi_tri_kho_id: "",
  });

  useEffect(() => {
    layDanhSachThietBi();
    layDanhSachMau();
    layDanhSachViTriKho();
  }, []);

  function moPopup(noiDung) {
    setPopupThongBao(noiDung || "Có lỗi xảy ra");
  }

  function hienThi(giaTri) {
    return giaTri || "-";
  }

  function dinhDangNgay(ngay) {
    if (!ngay) return "-";

    return new Date(ngay).toLocaleDateString("vi-VN");
  }

  function layTenMau(thietBi) {
    return thietBi.ten_mau || "";
  }

  function layTenMauOption(mau) {
    return `${mau.ten_hang || ""} ${mau.ten_mau || ""}`.trim();
  }

  function layTenViTriOption(viTri) {
    return viTri.ten_vi_tri || "";
  }

  function layClassTrangThai(trangThaiId) {
    const id = Number(trangThaiId);

    if (id === TRANG_THAI_SAN_SANG) return "trang-thai-badge trang-thai-xanh";
    if (id === TRANG_THAI_DANG_THUE) return "trang-thai-badge trang-thai-xanh-duong";
    if (id === TRANG_THAI_BAO_TRI) return "trang-thai-badge trang-thai-vang";
    if (id === TRANG_THAI_DA_AN) return "trang-thai-badge trang-thai-xam";
    if (id === TRANG_THAI_BI_MAT) return "trang-thai-badge trang-thai-do";
    if (id === TRANG_THAI_HU_HONG) return "trang-thai-badge trang-thai-cam";

    return "trang-thai-badge trang-thai-xam";
  }

  function coTheCapNhat(thietBi) {
    return Number(thietBi.trang_thai) !== TRANG_THAI_DANG_THUE;
  }

  function coTheTaoBaoTri(thietBi) {
    return Number(thietBi.trang_thai) === TRANG_THAI_SAN_SANG;
  }

  function coTheXoa(thietBi) {
    return Number(thietBi.trang_thai) !== TRANG_THAI_DANG_THUE;
  }

  function layTenHanhDong(loai) {
    if (loai === "AN") return "ẩn";
    if (loai === "HIEN") return "hiện";
    if (loai === "XOA") return "xóa";

    return "xử lý";
  }

  async function layDanhSachThietBi() {
    try {
      const phanHoi = await fetch(`${DUONG_DAN_API}/api/admin/assets`, {
        headers: taoHeaderCoToken(),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachThietBi(duLieu.data || []);
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    }
  }

  async function layDanhSachMau() {
    try {
      const phanHoi = await fetch(`${DUONG_DAN_API}/api/equipment-models`, {
        headers: taoHeaderCoToken(),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachMau(duLieu.data || []);
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    }
  }

  async function layDanhSachViTriKho() {
    try {
      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/warehouse-locations/options`,
        {
          headers: taoHeaderCoToken(),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachViTriKho(duLieu.data || []);
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    }
  }

  async function xemChiTietThietBi(id) {
    try {
      const phanHoi = await fetch(`${DUONG_DAN_API}/api/admin/assets/${id}`, {
        headers: taoHeaderCoToken(),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setChiTietThietBi(duLieu.data);
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    }
  }

  function moFormThem() {
    setCheDoForm("THEM");
    setThietBiDangSua(null);
    setTenMauDangChon("");
    setHienDanhSachMau(false);
    setTenViTriDangChon("");
    setHienDanhSachViTri(false);

    setForm({
      mau_thiet_bi_id: "",
      // Không dùng mã tài sản ở FE, giữ lại comment nếu sau này cần mở lại.
      // ma_tai_san: "",
      so_serial: "",
      vi_tri_kho_id: "",
    });

    setHienForm(true);
  }

  function moFormSua(thietBi) {
    if (!coTheCapNhat(thietBi)) {
      return moPopup("Không thể cập nhật thiết bị đang thuê");
    }

    setCheDoForm("SUA");
    setThietBiDangSua(thietBi);
    setTenMauDangChon(layTenMauOption(thietBi));
    setHienDanhSachMau(false);
    setTenViTriDangChon(thietBi.ten_vi_tri || "");
    setHienDanhSachViTri(false);

    setForm({
      mau_thiet_bi_id: thietBi.mau_thiet_bi_id || "",
      // Không dùng mã tài sản ở FE, giữ lại comment nếu sau này cần mở lại.
      // ma_tai_san: thietBi.ma_tai_san || "",
      so_serial: thietBi.so_serial || "",
      vi_tri_kho_id: thietBi.vi_tri_kho_id || "",
    });

    setHienForm(true);
  }

  function doiForm(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function doiMauThietBi(e) {
    const tenMau = e.target.value;

    setTenMauDangChon(tenMau);
    setHienDanhSachMau(true);

    const mauTimDuoc = danhSachMau.find(
      (mau) => layTenMauOption(mau) === tenMau
    );

    setForm({
      ...form,
      mau_thiet_bi_id: mauTimDuoc ? mauTimDuoc.id : "",
    });
  }

  function chonMauThietBi(mau) {
    setTenMauDangChon(layTenMauOption(mau));

    setForm({
      ...form,
      mau_thiet_bi_id: mau.id,
    });

    setHienDanhSachMau(false);
  }

  function doiViTriKho(e) {
    const tenViTri = e.target.value;

    setTenViTriDangChon(tenViTri);
    setHienDanhSachViTri(true);

    const viTriTimDuoc = danhSachViTriKho.find(
      (viTri) => layTenViTriOption(viTri) === tenViTri
    );

    setForm({
      ...form,
      vi_tri_kho_id: viTriTimDuoc ? viTriTimDuoc.id : "",
    });
  }

  function chonViTriKho(viTri) {
    setTenViTriDangChon(layTenViTriOption(viTri));

    setForm({
      ...form,
      vi_tri_kho_id: viTri.id,
    });

    setHienDanhSachViTri(false);
  }

  async function guiForm(e) {
    e.preventDefault();

    if (!form.mau_thiet_bi_id) {
      return moPopup("Vui lòng chọn mẫu thiết bị trong danh sách");
    }

    if (!form.so_serial.trim()) {
      return moPopup("Vui lòng nhập số serial");
    }

    if (!form.vi_tri_kho_id) {
      return moPopup("Vui lòng chọn vị trí kho trong danh sách");
    }

    try {
      const laThem = cheDoForm === "THEM";

      const url = laThem
        ? `${DUONG_DAN_API}/api/admin/assets`
        : `${DUONG_DAN_API}/api/admin/assets/${thietBiDangSua.id}`;

      const bodyGuiDi = {
        mau_thiet_bi_id: form.mau_thiet_bi_id,
        // Không gửi mã tài sản từ FE, giữ lại comment nếu sau này cần mở lại.
        // ma_tai_san: form.ma_tai_san,
        so_serial: form.so_serial,
        vi_tri_kho_id: form.vi_tri_kho_id,
      };

      const phanHoi = await fetch(url, {
        method: laThem ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          ...taoHeaderCoToken(),
        },
        body: JSON.stringify(bodyGuiDi),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setHienForm(false);
        setThietBiDangSua(null);
        moPopup(duLieu.message);
        layDanhSachThietBi();
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    }
  }

  function moXacNhan(loai, thietBi) {
    setXacNhan({
      loai,
      thietBi,
    });
  }

  async function thucHienXacNhan() {
    if (!xacNhan) return;

    try {
      const thietBi = xacNhan.thietBi;

      let url = "";
      let method = "";
      let body = null;

      if (xacNhan.loai === "AN") {
        url = `${DUONG_DAN_API}/api/admin/assets/${thietBi.id}/status`;
        method = "PUT";
        body = JSON.stringify({
          trang_thai: TRANG_THAI_DA_AN,
        });
      }

      if (xacNhan.loai === "HIEN") {
        url = `${DUONG_DAN_API}/api/admin/assets/${thietBi.id}/status`;
        method = "PUT";
        body = JSON.stringify({
          trang_thai: TRANG_THAI_SAN_SANG,
        });
      }

      if (xacNhan.loai === "XOA") {
        url = `${DUONG_DAN_API}/api/admin/assets/${thietBi.id}`;
        method = "DELETE";
      }

      const phanHoi = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...taoHeaderCoToken(),
        },
        body,
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setXacNhan(null);
        moPopup(duLieu.message);
        layDanhSachThietBi();
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    }
  }

  function moFormBaoTri(thietBi) {
    if (!coTheTaoBaoTri(thietBi)) {
      return moPopup("Chỉ thiết bị sẵn sàng mới được tạo bảo trì");
    }

    setThietBiBaoTri(thietBi);
    setLyDoBaoTri("");
  }

  async function guiBaoTri(e) {
    e.preventDefault();

    if (!lyDoBaoTri.trim()) {
      return moPopup("Vui lòng nhập lý do bảo trì");
    }

    try {
      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/assets/${thietBiBaoTri.id}/maintenance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...taoHeaderCoToken(),
          },
          body: JSON.stringify({
            ly_do: lyDoBaoTri,
          }),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setThietBiBaoTri(null);
        setLyDoBaoTri("");
        moPopup(duLieu.message);
        layDanhSachThietBi();
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    }
  }

  const danhSachTrangThai = Array.from(
    new Map(
      danhSachThietBi
        .filter((tb) => tb.trang_thai && tb.ten_trang_thai)
        .map((tb) => [String(tb.trang_thai), tb.ten_trang_thai])
    ).entries()
  );

  const danhSachHangLoc = Array.from(
    new Map(
      danhSachThietBi
        .filter((tb) => tb.ten_hang)
        .map((tb) => [String(tb.hang_id || tb.ten_hang), tb.ten_hang])
    ).entries()
  );

  const danhSachDanhMucLoc = Array.from(
    new Set(
      danhSachThietBi
        .map((tb) => tb.ten_danh_muc)
        .filter(Boolean)
    )
  );

  const danhSachMauSauLoc = danhSachMau.filter((mau) => {
    const noiDung = layTenMauOption(mau).toLowerCase();

    return noiDung.includes(tenMauDangChon.toLowerCase());
  });

  const danhSachViTriSauLoc = danhSachViTriKho.filter((viTri) => {
    const noiDung = layTenViTriOption(viTri).toLowerCase();

    return noiDung.includes(tenViTriDangChon.toLowerCase());
  });

  const danhSachSauLoc = danhSachThietBi.filter((tb) => {
    const noiDung = `${tb.ten_mau || ""} ${tb.so_serial || ""} ${
      tb.ten_hang || ""
    } ${tb.ten_danh_muc || ""} ${tb.ten_vi_tri || ""}`.toLowerCase();

    const khopTuKhoa = noiDung.includes(tuKhoa.toLowerCase());

    const khopHang =
      hangLoc === "0" || String(tb.hang_id || tb.ten_hang) === hangLoc;

    const khopDanhMuc =
      danhMucLoc === "0" || String(tb.ten_danh_muc || "") === danhMucLoc;

    const khopTrangThai =
      trangThaiLoc === "0" || Number(tb.trang_thai) === Number(trangThaiLoc);

    return khopTuKhoa && khopHang && khopDanhMuc && khopTrangThai;
  });

  const tongTrang = Math.max(
    1,
    Math.ceil(danhSachSauLoc.length / SO_DONG_MOI_TRANG)
  );

  const viTriBatDau = (trangHienTai - 1) * SO_DONG_MOI_TRANG;

  const danhSachHienThi = danhSachSauLoc.slice(
    viTriBatDau,
    viTriBatDau + SO_DONG_MOI_TRANG
  );

  return (
    <div className="khung-trang trang-admin-crud trang-quan-ly-thiet-bi-vat-ly">
      <h2>Quản lý thiết bị vật lý</h2>

      <div className="khung-loc-admin khung-loc-thiet-bi-vat-ly">
        <input
          placeholder="Tìm mẫu thiết bị, serial, vị trí"
          value={tuKhoa}
          onChange={(e) => {
            setTuKhoa(e.target.value);
            setTrangHienTai(1);
          }}
        />

        <select
          value={hangLoc}
          onChange={(e) => {
            setHangLoc(e.target.value);
            setTrangHienTai(1);
          }}
        >
          <option value="0">Tất cả hãng</option>

          {danhSachHangLoc.map(([id, tenHang]) => (
            <option key={id} value={id}>
              {tenHang}
            </option>
          ))}
        </select>

        <select
          value={danhMucLoc}
          onChange={(e) => {
            setDanhMucLoc(e.target.value);
            setTrangHienTai(1);
          }}
        >
          <option value="0">Tất cả danh mục</option>

          {danhSachDanhMucLoc.map((tenDanhMuc) => (
            <option key={tenDanhMuc} value={tenDanhMuc}>
              {tenDanhMuc}
            </option>
          ))}
        </select>

        <select
          value={trangThaiLoc}
          onChange={(e) => {
            setTrangThaiLoc(e.target.value);
            setTrangHienTai(1);
          }}
        >
          <option value="0">Tất cả trạng thái</option>

          {danhSachTrangThai.map(([id, tenTrangThai]) => (
            <option key={id} value={id}>
              {tenTrangThai}
            </option>
          ))}
        </select>

        <button className="nut-them" type="button" onClick={moFormThem}>
          Thêm thiết bị
        </button>
      </div>

      <div className="admin-bang-wrapper">
        <table className="bang-quan-ly bang-gon">
          <thead>
            <tr>
              <th>STT</th>
              {/* Không dùng mã tài sản ở FE, giữ lại comment nếu sau này cần mở lại.
              <th>Mã tài sản</th>
              */}
              <th>Mẫu thiết bị</th>
              <th>Số serial</th>
              <th>Hãng</th>
              <th>Danh mục</th>
              <th>Vị trí kho</th>
              <th>Trạng thái</th>
              {/* <th>Ngày tạo</th> */}
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {danhSachHienThi.map((tb, index) => (
              <tr key={tb.id}>
                <td>{viTriBatDau + index + 1}</td>
                {/* Không dùng mã tài sản ở FE, giữ lại comment nếu sau này cần mở lại.
                <td>{hienThi(tb.ma_tai_san)}</td>
                */}
                <td>{hienThi(layTenMau(tb))}</td>
                <td>{hienThi(tb.so_serial)}</td>
                <td>{hienThi(tb.ten_hang)}</td>
                <td>{hienThi(tb.ten_danh_muc)}</td>
                <td>{hienThi(tb.ten_vi_tri)}</td>

                <td>
                  <span className={layClassTrangThai(tb.trang_thai)}>
                    {hienThi(tb.ten_trang_thai)}
                  </span>
                </td>

                {/* <td>{dinhDangNgay(tb.created_at)}</td> */}

                <td>
                  <div className="cot-thao-tac">
                    {/* <button
                      className="nut-xem-chi-tiet nut-thao-tac-bang-nhau"
                      type="button"
                      onClick={() => xemChiTietThietBi(tb.id)}
                    >
                      Xem chi tiết
                    </button> */}

                    <button
                      className="nut-cap-nhat nut-thao-tac-bang-nhau"
                      type="button"
                      disabled={!coTheCapNhat(tb)}
                      onClick={() => moFormSua(tb)}
                    >
                      Cập nhật
                    </button>

                    <button
                      className="nut-dong-y nut-thao-tac-bang-nhau"
                      type="button"
                      disabled={!coTheTaoBaoTri(tb)}
                      onClick={() => moFormBaoTri(tb)}
                    >
                      Tạo bảo trì
                    </button>

                    {Number(tb.trang_thai) === TRANG_THAI_DA_AN ? (
                      <button
                        className="nut-hien nut-thao-tac-bang-nhau"
                        type="button"
                        onClick={() => moXacNhan("HIEN", tb)}
                      >
                        Hiện
                      </button>
                    ) : (
                      <button
                        className="nut-an nut-thao-tac-bang-nhau"
                        type="button"
                        disabled={Number(tb.trang_thai) !== TRANG_THAI_SAN_SANG}
                        onClick={() => moXacNhan("AN", tb)}
                      >
                        Ẩn
                      </button>
                    )}

                    {/* <button
                      className="nut-xoa nut-thao-tac-bang-nhau"
                      type="button"
                      disabled={!coTheXoa(tb)}
                      onClick={() => moXacNhan("XOA", tb)}
                    >
                      Xóa
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}

            {danhSachHienThi.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

      {chiTietThietBi && (
        <div className="popup-nen">
          <div className="popup-hop">
            <div className="popup-tieu-de">
              <h3>Chi tiết thiết bị vật lý</h3>

              <button
                className="nut-dong-popup"
                type="button"
                onClick={() => setChiTietThietBi(null)}
              >
                Đóng
              </button>
            </div>

            <table className="bang-popup">
              <tbody>
                {/* Không dùng mã tài sản ở FE, giữ lại comment nếu sau này cần mở lại.
                <tr>
                  <td>Mã tài sản</td>
                  <td>{hienThi(chiTietThietBi.ma_tai_san)}</td>
                </tr>
                */}

                <tr>
                  <td>Mẫu thiết bị</td>
                  <td>{hienThi(layTenMau(chiTietThietBi))}</td>
                </tr>

                <tr>
                  <td>Số serial</td>
                  <td>{hienThi(chiTietThietBi.so_serial)}</td>
                </tr>

                <tr>
                  <td>Hãng</td>
                  <td>{hienThi(chiTietThietBi.ten_hang)}</td>
                </tr>

                <tr>
                  <td>Danh mục</td>
                  <td>{hienThi(chiTietThietBi.ten_danh_muc)}</td>
                </tr>

                <tr>
                  <td>Vị trí kho</td>
                  <td>{hienThi(chiTietThietBi.ten_vi_tri)}</td>
                </tr>

                <tr>
                  <td>Trạng thái</td>
                  <td>
                    <span className={layClassTrangThai(chiTietThietBi.trang_thai)}>
                      {hienThi(chiTietThietBi.ten_trang_thai)}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>Ngày tạo</td>
                  <td>{dinhDangNgay(chiTietThietBi.created_at)}</td>
                </tr>

                <tr>
                  <td>Ngày cập nhật</td>
                  <td>{dinhDangNgay(chiTietThietBi.updated_at)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {hienForm && (
        <div className="popup-nen">
          <div className="popup-hop">
            <div className="popup-tieu-de">
              <h3>
                {cheDoForm === "THEM"
                  ? "Thêm thiết bị vật lý"
                  : "Cập nhật thiết bị vật lý"}
              </h3>
            </div>

            <form onSubmit={guiForm}>
              <div className="o-form">
                <label>Mẫu thiết bị</label>

                <div className="combo-tim-kiem">
                  <input
                    placeholder="Bấm vào để chọn hoặc gõ để tìm mẫu thiết bị"
                    value={tenMauDangChon}
                    onChange={doiMauThietBi}
                    onFocus={() => setHienDanhSachMau(true)}
                    onBlur={() => {
                      setTimeout(() => {
                        setHienDanhSachMau(false);
                      }, 150);
                    }}
                  />

                  {hienDanhSachMau && (
                    <div className="combo-danh-sach">
                      {danhSachMauSauLoc.map((mau) => (
                        <div
                          key={mau.id}
                          className="combo-dong"
                          onMouseDown={() => chonMauThietBi(mau)}
                        >
                          {layTenMauOption(mau)}
                        </div>
                      ))}

                      {danhSachMauSauLoc.length === 0 && (
                        <div className="combo-dong combo-rong">
                          Không tìm thấy mẫu thiết bị
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Không dùng mã tài sản ở FE, giữ lại comment nếu sau này cần mở lại.
              <div className="o-form">
                <label>Mã tài sản</label>

                <input
                  name="ma_tai_san"
                  value={form.ma_tai_san}
                  onChange={doiForm}
                  placeholder="Có thể để trống nếu chưa có mã"
                />
              </div>
              */}

              <div className="o-form">
                <label>Số serial</label>

                <input
                  name="so_serial"
                  value={form.so_serial}
                  onChange={doiForm}
                />
              </div>

              <div className="o-form">
                <label>Vị trí kho</label>

                <div className="combo-tim-kiem">
                  <input
                    placeholder="Bấm vào để chọn hoặc gõ để tìm vị trí kho"
                    value={tenViTriDangChon}
                    onChange={doiViTriKho}
                    onFocus={() => setHienDanhSachViTri(true)}
                    onBlur={() => {
                      setTimeout(() => {
                        setHienDanhSachViTri(false);
                      }, 150);
                    }}
                  />

                  {hienDanhSachViTri && (
                    <div className="combo-danh-sach">
                      {danhSachViTriSauLoc.map((viTri) => (
                        <div
                          key={viTri.id}
                          className="combo-dong"
                          onMouseDown={() => chonViTriKho(viTri)}
                        >
                          {layTenViTriOption(viTri)}
                        </div>
                      ))}

                      {danhSachViTriSauLoc.length === 0 && (
                        <div className="combo-dong combo-rong">
                          Không tìm thấy vị trí kho
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="popup-actions">
                <button className="nut-luu" type="submit">
                  {cheDoForm === "THEM" ? "Thêm" : "Lưu cập nhật"}
                </button>

                <button
                  className="nut-huy"
                  type="button"
                  onClick={() => setHienForm(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {thietBiBaoTri && (
        <div className="popup-nen">
          <div className="popup-hop">
            <div className="popup-tieu-de">
              <h3>Tạo hồ sơ bảo trì</h3>
            </div>

            <form onSubmit={guiBaoTri}>
              <table className="bang-popup">
                <tbody>
                  <tr>
                    <td>Mẫu thiết bị</td>
                    <td>{hienThi(layTenMau(thietBiBaoTri))}</td>
                  </tr>

                  <tr>
                    <td>Số serial</td>
                    <td>{hienThi(thietBiBaoTri.so_serial)}</td>
                  </tr>

                  <tr>
                    <td>Hãng</td>
                    <td>{hienThi(thietBiBaoTri.ten_hang)}</td>
                  </tr>

                  <tr>
                    <td>Danh mục</td>
                    <td>{hienThi(thietBiBaoTri.ten_danh_muc)}</td>
                  </tr>

                  <tr>
                    <td>Trạng thái</td>
                    <td>
                      <span className={layClassTrangThai(thietBiBaoTri.trang_thai)}>
                        {hienThi(thietBiBaoTri.ten_trang_thai)}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="o-form">
                <label>Lý do bảo trì</label>

                <textarea
                  value={lyDoBaoTri}
                  onChange={(e) => setLyDoBaoTri(e.target.value)}
                />
              </div>

              <div className="popup-actions">
                <button className="nut-luu" type="submit">
                  Tạo bảo trì
                </button>

                <button
                  className="nut-huy"
                  type="button"
                  onClick={() => setThietBiBaoTri(null)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {xacNhan && (
        <div className="popup-nen">
          <div className="popup-hop popup-xac-nhan">
            <div className="popup-tieu-de">
              <h3>Xác nhận</h3>
            </div>

            <div className="popup-noi-dung">
              <p>
                Bạn có chắc muốn <b>{layTenHanhDong(xacNhan.loai)}</b> thiết bị
                serial <b>{hienThi(xacNhan.thietBi.so_serial)}</b> không?
              </p>
            </div>

            <div className="popup-actions">
              <button
                className="nut-dong-y"
                type="button"
                onClick={thucHienXacNhan}
              >
                Đồng ý
              </button>

              <button
                className="nut-huy"
                type="button"
                onClick={() => setXacNhan(null)}
              >
                Hủy
              </button>
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

export default AssetList;