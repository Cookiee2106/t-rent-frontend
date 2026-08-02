import { useEffect, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

const SO_DONG_MOI_TRANG = 10;

const TRANG_THAI_HIEN_THI = 601;
const TRANG_THAI_DA_AN = 602;

function AdminAccessoryList() {
  const [danhSachPhuKien, setDanhSachPhuKien] = useState([]);
  const [danhSachHang, setDanhSachHang] = useState([]);
  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState([]);
  const [danhSachViTri, setDanhSachViTri] = useState([]);

  const [tuKhoa, setTuKhoa] = useState("");
  const [hangLoc, setHangLoc] = useState("0");
  const [danhMucLoc, setDanhMucLoc] = useState("0");
  const [viTriLoc, setViTriLoc] = useState("0");
  const [trangHienTai, setTrangHienTai] = useState(1);

  const [popupThongBao, setPopupThongBao] = useState("");
  const [chiTietPhuKien, setChiTietPhuKien] = useState(null);

  const [hienForm, setHienForm] = useState(false);
  const [cheDoForm, setCheDoForm] = useState("THEM");
  const [phuKienDangSua, setPhuKienDangSua] = useState(null);

  const [xacNhanXoa, setXacNhanXoa] = useState(null);
  const [xacNhanDoiTrangThai, setXacNhanDoiTrangThai] = useState(null);

  const [tenHangDangChon, setTenHangDangChon] = useState("");
  const [tenDanhMucDangChon, setTenDanhMucDangChon] = useState("");
  const [tenViTriDangChon, setTenViTriDangChon] = useState("");

  const [hienGoiYHang, setHienGoiYHang] = useState(false);
  const [hienGoiYDanhMuc, setHienGoiYDanhMuc] = useState(false);
  const [hienGoiYViTri, setHienGoiYViTri] = useState(false);

  const [form, setForm] = useState({
    ten_phu_kien: "",
    hang_id: "",
    danh_muc_id: "",
    vi_tri_kho_id: "",
    tong_so_luong: "0",
    mo_ta: "",
  });

  useEffect(() => {
    layDanhSachPhuKien();
    layDanhSachHang();
    layDanhSachDanhMuc();
    layDanhSachViTri();
  }, []);

  function moPopup(noiDung) {
    setPopupThongBao(noiDung || "Có lỗi xảy ra");
  }

  function hienThi(giaTri) {
    return giaTri || "-";
  }

  function dinhDangNgay(giaTri) {
    if (!giaTri) {
      return "-";
    }

    return new Date(giaTri).toLocaleDateString("vi-VN");
  }

  function dinhDangSo(giaTri) {
    return Number(giaTri || 0).toLocaleString("vi-VN");
  }

  async function layDanhSachPhuKien() {
    try {
      const phanHoi = await fetch(`${DUONG_DAN_API}/api/admin/accessories`, {
        headers: taoHeaderCoToken(),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachPhuKien(duLieu.data || []);
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    }
  }

  async function layDanhSachHang() {
    try {
      const phanHoi = await fetch(`${DUONG_DAN_API}/api/equipment-brands/options`, {
        headers: taoHeaderCoToken(),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachHang(duLieu.data || []);
      }
    } catch {
      moPopup("Không tải được danh sách hãng");
    }
  }

  async function layDanhSachDanhMuc() {
    try {
      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/equipment-categories/options?tinh_chat_id=2503`,
        {
          headers: taoHeaderCoToken(),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachDanhMuc(duLieu.data || []);
      }
    } catch {
      moPopup("Không tải được danh sách danh mục phụ kiện");
    }
  }

  async function layDanhSachViTri() {
    try {
      const phanHoi = await fetch(`${DUONG_DAN_API}/api/warehouse-locations/options`, {
        headers: taoHeaderCoToken(),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachViTri(duLieu.data || []);
      }
    } catch {
      moPopup("Không tải được danh sách vị trí kho");
    }
  }

  async function xemChiTietPhuKien(id) {
    try {
      const phanHoi = await fetch(`${DUONG_DAN_API}/api/admin/accessories/${id}`, {
        headers: taoHeaderCoToken(),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setChiTietPhuKien(duLieu.data);
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    }
  }

  function doiForm(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function moFormThem() {
    setCheDoForm("THEM");
    setPhuKienDangSua(null);

    setTenHangDangChon("");
    setTenDanhMucDangChon("");
    setTenViTriDangChon("");

    setForm({
      ten_phu_kien: "",
      hang_id: "",
      danh_muc_id: "",
      vi_tri_kho_id: "",
      tong_so_luong: "0",
      mo_ta: "",
    });

    setHienForm(true);
  }

  function moFormSua(phuKien) {
    setCheDoForm("SUA");
    setPhuKienDangSua(phuKien);

    setTenHangDangChon(phuKien.ten_hang || "");
    setTenDanhMucDangChon(phuKien.ten_danh_muc || "");
    setTenViTriDangChon(phuKien.ten_vi_tri || "");

    setForm({
      ten_phu_kien: phuKien.ten_phu_kien || "",
      hang_id: phuKien.hang_id || "",
      danh_muc_id: phuKien.danh_muc_id || "",
      vi_tri_kho_id: phuKien.vi_tri_kho_id || "",
      tong_so_luong: String(phuKien.tong_so_luong || 0),
      mo_ta: phuKien.mo_ta || "",
    });

    setHienForm(true);
  }

  function doiHangDangChon(e) {
    const giaTri = e.target.value;
    setTenHangDangChon(giaTri);
    setHienGoiYHang(true);

    const hang = danhSachHang.find(
      (item) => String(item.ten_hang || "").toLowerCase() === giaTri.toLowerCase()
    );

    setForm({
      ...form,
      hang_id: hang ? hang.id : "",
    });
  }

  function chonHang(hang) {
    setTenHangDangChon(hang.ten_hang || "");
    setForm({
      ...form,
      hang_id: hang.id,
    });
    setHienGoiYHang(false);
  }

  function doiDanhMucDangChon(e) {
    const giaTri = e.target.value;
    setTenDanhMucDangChon(giaTri);
    setHienGoiYDanhMuc(true);

    const danhMuc = danhSachDanhMuc.find(
      (item) =>
        String(item.ten_danh_muc || "").toLowerCase() === giaTri.toLowerCase()
    );

    setForm({
      ...form,
      danh_muc_id: danhMuc ? danhMuc.id : "",
    });
  }

  function chonDanhMuc(danhMuc) {
    setTenDanhMucDangChon(danhMuc.ten_danh_muc || "");
    setForm({
      ...form,
      danh_muc_id: danhMuc.id,
    });
    setHienGoiYDanhMuc(false);
  }

  function doiViTriDangChon(e) {
    const giaTri = e.target.value;
    setTenViTriDangChon(giaTri);
    setHienGoiYViTri(true);

    const viTri = danhSachViTri.find(
      (item) => String(item.ten_vi_tri || "").toLowerCase() === giaTri.toLowerCase()
    );

    setForm({
      ...form,
      vi_tri_kho_id: viTri ? viTri.id : "",
    });
  }

  function chonViTri(viTri) {
    setTenViTriDangChon(viTri.ten_vi_tri || "");
    setForm({
      ...form,
      vi_tri_kho_id: viTri.id,
    });
    setHienGoiYViTri(false);
  }

  async function guiForm(e) {
    e.preventDefault();

    if (!form.ten_phu_kien.trim()) {
      return moPopup("Vui lòng nhập tên phụ kiện");
    }

    if (!form.danh_muc_id) {
      return moPopup("Vui lòng chọn danh mục trong danh sách");
    }

    if (!form.vi_tri_kho_id) {
      return moPopup("Vui lòng chọn vị trí kho trong danh sách");
    }

    if (Number(form.tong_so_luong) < 0) {
      return moPopup("Tổng số lượng phải lớn hơn hoặc bằng 0");
    }

    try {
      const laThem = cheDoForm === "THEM";

      const url = laThem
        ? `${DUONG_DAN_API}/api/admin/accessories`
        : `${DUONG_DAN_API}/api/admin/accessories/${phuKienDangSua.id}`;

      const phanHoi = await fetch(url, {
        method: laThem ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          ...taoHeaderCoToken(),
        },
        body: JSON.stringify({
          ten_phu_kien: form.ten_phu_kien.trim(),
          hang_id: form.hang_id || null,
          danh_muc_id: form.danh_muc_id,
          vi_tri_kho_id: form.vi_tri_kho_id,
          tong_so_luong: Number(form.tong_so_luong || 0),
          mo_ta: form.mo_ta.trim(),
        }),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setHienForm(false);
        setPhuKienDangSua(null);
        moPopup(duLieu.message);
        layDanhSachPhuKien();
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    }
  }

  async function doiTrangThaiPhuKien() {
    if (!xacNhanDoiTrangThai) {
      return;
    }

    const dangHien =
      Number(xacNhanDoiTrangThai.trang_thai) ===
      TRANG_THAI_HIEN_THI;

    try {
      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/accessories/${xacNhanDoiTrangThai.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...taoHeaderCoToken(),
          },
          body: JSON.stringify({
            hanh_dong: dangHien ? "AN" : "HIEN",
          }),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setXacNhanDoiTrangThai(null);
        moPopup(duLieu.message);
        layDanhSachPhuKien();
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    }
  }

  async function xoaPhuKien() {
    if (!xacNhanXoa) {
      return;
    }

    try {
      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/accessories/${xacNhanXoa.id}`,
        {
          method: "DELETE",
          headers: taoHeaderCoToken(),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setXacNhanXoa(null);
        moPopup(duLieu.message);
        layDanhSachPhuKien();
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    }
  }

  const danhSachHangSauLoc = danhSachHang.filter((hang) =>
    String(hang.ten_hang || "").toLowerCase().includes(tenHangDangChon.toLowerCase())
  );

  const danhSachDanhMucSauLoc = danhSachDanhMuc.filter((danhMuc) =>
    String(danhMuc.ten_danh_muc || "")
      .toLowerCase()
      .includes(tenDanhMucDangChon.toLowerCase())
  );

  const danhSachViTriSauLoc = danhSachViTri.filter((viTri) =>
    String(viTri.ten_vi_tri || "")
      .toLowerCase()
      .includes(tenViTriDangChon.toLowerCase())
  );

  const danhSachSauLoc = danhSachPhuKien.filter((phuKien) => {
    const noiDung = `${phuKien.ten_phu_kien || ""} ${phuKien.ten_hang || ""} ${
      phuKien.ten_danh_muc || ""
    } ${phuKien.ten_vi_tri || ""}`.toLowerCase();

    const khopTuKhoa = noiDung.includes(tuKhoa.toLowerCase());
    const khopHang = hangLoc === "0" || String(phuKien.hang_id) === String(hangLoc);
    const khopDanhMuc =
      danhMucLoc === "0" || String(phuKien.danh_muc_id) === String(danhMucLoc);
    const khopViTri =
      viTriLoc === "0" || String(phuKien.vi_tri_kho_id) === String(viTriLoc);

    return khopTuKhoa && khopHang && khopDanhMuc && khopViTri;
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
    <div className="khung-trang trang-admin-crud trang-quan-ly-phu-kien">
      <h2>Quản lý phụ kiện</h2>

      <div className="khung-loc-admin khung-loc-phu-kien">
        <input
          placeholder="Tìm tên phụ kiện, hãng, danh mục, vị trí"
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
          {danhSachHang.map((hang) => (
            <option key={hang.id} value={hang.id}>
              {hang.ten_hang}
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
          {danhSachDanhMuc.map((danhMuc) => (
            <option key={danhMuc.id} value={danhMuc.id}>
              {danhMuc.ten_danh_muc}
            </option>
          ))}
        </select>

        <select
          value={viTriLoc}
          onChange={(e) => {
            setViTriLoc(e.target.value);
            setTrangHienTai(1);
          }}
        >
          <option value="0">Tất cả vị trí</option>
          {danhSachViTri.map((viTri) => (
            <option key={viTri.id} value={viTri.id}>
              {viTri.ten_vi_tri}
            </option>
          ))}
        </select>

        <button className="nut-them" type="button" onClick={moFormThem}>
          Thêm
        </button>
      </div>

      <div className="admin-bang-wrapper">
        <table className="bang-quan-ly bang-gon bang-phu-kien">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên phụ kiện</th>
              <th>Hãng</th>
              <th>Danh mục</th>
              <th>Tổng SL</th>
              <th>Đang dùng</th>
              <th>Trạng thái</th>
              <th>Vị trí kho</th>
              <th>Mô tả</th>
              {/* <th>Ngày tạo</th> */}
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {danhSachHienThi.map((phuKien, index) => (
              <tr key={phuKien.id}>
                <td>{viTriBatDau + index + 1}</td>
                <td>{hienThi(phuKien.ten_phu_kien)}</td>
                <td>{hienThi(phuKien.ten_hang)}</td>
                <td>{hienThi(phuKien.ten_danh_muc)}</td>
                <td>{dinhDangSo(phuKien.tong_so_luong)}</td>
                <td>{dinhDangSo(phuKien.so_luong_dang_su_dung)}</td>
                <td>
                  <span
                    className={`trang-thai-badge ${
                      Number(phuKien.trang_thai) ===
                      TRANG_THAI_HIEN_THI
                        ? "trang-thai-xanh"
                        : "trang-thai-xam"
                    }`}
                  >
                    {Number(phuKien.trang_thai) ===
                    TRANG_THAI_HIEN_THI
                      ? "Hiện"
                      : "Ẩn"}
                  </span>
                </td>

                <td>{hienThi(phuKien.ten_vi_tri)}</td>
                <td>{hienThi(phuKien.mo_ta)}</td>
                {/* <td>{dinhDangNgay(phuKien.created_at)}</td> */}
                <td>
                  <div className="cot-thao-tac">
                    {/* <button
                      className="nut-xem-chi-tiet"
                      type="button"
                      onClick={() => xemChiTietPhuKien(phuKien.id)}
                    >
                      Xem chi tiết
                    </button> */}

                    <button
                      className="nut-cap-nhat"
                      type="button"
                      onClick={() => moFormSua(phuKien)}
                    >
                      Cập nhật
                    </button>

                    {Number(phuKien.trang_thai) ===
                    TRANG_THAI_HIEN_THI ? (
                      <button
                        className="nut-an"
                        type="button"
                        onClick={() =>
                          setXacNhanDoiTrangThai(phuKien)
                        }
                      >
                        Ẩn
                      </button>
                    ) : (
                      <button
                        className="nut-hien"
                        type="button"
                        onClick={() =>
                          setXacNhanDoiTrangThai(phuKien)
                        }
                      >
                        Hiện
                      </button>
                    )}

                    {/* <button
                      className="nut-xoa"
                      type="button"
                      onClick={() => setXacNhanXoa(phuKien)}
                    >
                      Xóa
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}

            {danhSachHienThi.length === 0 && (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
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

      {chiTietPhuKien && (
        <div className="popup-nen">
          <div className="popup-hop">
            <div className="popup-tieu-de">
              <h3>Chi tiết phụ kiện</h3>

              <button
                className="nut-dong-popup"
                type="button"
                onClick={() => setChiTietPhuKien(null)}
              >
                Đóng
              </button>
            </div>

            <div className="popup-noi-dung">
              <table className="bang-popup">
                <tbody>
                  <tr>
                    <td>Tên phụ kiện</td>
                    <td>{hienThi(chiTietPhuKien.ten_phu_kien)}</td>
                  </tr>

                  <tr>
                    <td>Hãng</td>
                    <td>{hienThi(chiTietPhuKien.ten_hang)}</td>
                  </tr>

                  <tr>
                    <td>Danh mục</td>
                    <td>{hienThi(chiTietPhuKien.ten_danh_muc)}</td>
                  </tr>

                  <tr>
                    <td>Vị trí kho</td>
                    <td>{hienThi(chiTietPhuKien.ten_vi_tri)}</td>
                  </tr>

                  <tr>
                    <td>Trạng thái</td>
                    <td>
                      <span
                        className={`trang-thai-badge ${
                          Number(chiTietPhuKien.trang_thai) ===
                          TRANG_THAI_HIEN_THI
                            ? "trang-thai-xanh"
                            : "trang-thai-xam"
                        }`}
                      >
                        {Number(chiTietPhuKien.trang_thai) ===
                        TRANG_THAI_HIEN_THI
                          ? "Hiện"
                          : "Ẩn"}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>Tổng số lượng</td>
                    <td>{dinhDangSo(chiTietPhuKien.tong_so_luong)}</td>
                  </tr>

                  <tr>
                    <td>Đang dùng</td>
                    <td>{dinhDangSo(chiTietPhuKien.so_luong_dang_su_dung)}</td>
                  </tr>

                  <tr>
                    <td>Mô tả</td>
                    <td>{hienThi(chiTietPhuKien.mo_ta)}</td>
                  </tr>

                  <tr>
                    <td>Ngày tạo</td>
                    <td>{dinhDangNgay(chiTietPhuKien.created_at)}</td>
                  </tr>

                  <tr>
                    <td>Ngày cập nhật</td>
                    <td>{dinhDangNgay(chiTietPhuKien.updated_at)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {hienForm && (
        <div className="popup-nen">
          <div className="popup-hop">
            <div className="popup-tieu-de">
              <h3>{cheDoForm === "THEM" ? "Thêm phụ kiện" : "Cập nhật phụ kiện"}</h3>
            </div>

            <form onSubmit={guiForm}>
              <div className="o-form">
                <label>Tên phụ kiện</label>
                <input
                  name="ten_phu_kien"
                  value={form.ten_phu_kien}
                  onChange={doiForm}
                  placeholder="Ví dụ: Pin LP-E6N"
                />
              </div>

              <div className="o-form">
                <label>Hãng (không bắt buộc)</label>
                <div className="combobox-admin">
                  <input
                    value={tenHangDangChon}
                    onChange={doiHangDangChon}
                    onFocus={() => setHienGoiYHang(true)}
                    onBlur={() => setTimeout(() => setHienGoiYHang(false), 150)}
                    placeholder="Có thể bỏ trống hoặc chọn hãng"
                  />

                  {hienGoiYHang && (
                    <div className="danh-sach-combobox-admin">
                      {danhSachHangSauLoc.map((hang) => (
                        <div
                          key={hang.id}
                          className="dong-combobox-admin"
                          onMouseDown={() => chonHang(hang)}
                        >
                          {hang.ten_hang}
                        </div>
                      ))}

                      {danhSachHangSauLoc.length === 0 && (
                        <div className="dong-combobox-admin">Không tìm thấy hãng</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="o-form">
                <label>Danh mục</label>
                <div className="combobox-admin">
                  <input
                    value={tenDanhMucDangChon}
                    onChange={doiDanhMucDangChon}
                    onFocus={() => setHienGoiYDanhMuc(true)}
                    onBlur={() => setTimeout(() => setHienGoiYDanhMuc(false), 150)}
                    placeholder="Bấm vào để chọn hoặc gõ để tìm danh mục"
                  />

                  {hienGoiYDanhMuc && (
                    <div className="danh-sach-combobox-admin">
                      {danhSachDanhMucSauLoc.map((danhMuc) => (
                        <div
                          key={danhMuc.id}
                          className="dong-combobox-admin"
                          onMouseDown={() => chonDanhMuc(danhMuc)}
                        >
                          {danhMuc.ten_danh_muc}
                        </div>
                      ))}

                      {danhSachDanhMucSauLoc.length === 0 && (
                        <div className="dong-combobox-admin">Không tìm thấy danh mục</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="o-form">
                <label>Vị trí kho</label>
                <div className="combobox-admin">
                  <input
                    value={tenViTriDangChon}
                    onChange={doiViTriDangChon}
                    onFocus={() => setHienGoiYViTri(true)}
                    onBlur={() => setTimeout(() => setHienGoiYViTri(false), 150)}
                    placeholder="Bấm vào để chọn hoặc gõ để tìm vị trí"
                  />

                  {hienGoiYViTri && (
                    <div className="danh-sach-combobox-admin">
                      {danhSachViTriSauLoc.map((viTri) => (
                        <div
                          key={viTri.id}
                          className="dong-combobox-admin"
                          onMouseDown={() => chonViTri(viTri)}
                        >
                          {viTri.ten_vi_tri}
                          <span>Sức chứa: {dinhDangSo(viTri.suc_chua_toi_da)}</span>
                        </div>
                      ))}

                      {danhSachViTriSauLoc.length === 0 && (
                        <div className="dong-combobox-admin">Không tìm thấy vị trí</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="o-form">
                <label>Tổng số lượng</label>
                <input
                  name="tong_so_luong"
                  type="number"
                  min="0"
                  value={form.tong_so_luong}
                  onChange={doiForm}
                />
              </div>

              <div className="o-form">
                <label>Mô tả</label>
                <textarea name="mo_ta" value={form.mo_ta} onChange={doiForm} />
              </div>

              <div className="popup-actions">
                <button className="nut-dong-y" type="submit">
                  {cheDoForm === "THEM" ? "Thêm" : "Cập nhật"}
                </button>

                <button className="nut-huy" type="button" onClick={() => setHienForm(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {xacNhanDoiTrangThai && (
        <div className="popup-nen">
          <div className="popup-hop popup-xac-nhan">
            <div className="popup-tieu-de">
              <h3>
                Xác nhận{" "}
                {Number(xacNhanDoiTrangThai.trang_thai) ===
                TRANG_THAI_HIEN_THI
                  ? "ẩn"
                  : "hiện"}
              </h3>
            </div>

            <div className="popup-noi-dung">
              <p>
                Bạn có chắc muốn{" "}
                {Number(xacNhanDoiTrangThai.trang_thai) ===
                TRANG_THAI_HIEN_THI
                  ? "ẩn"
                  : "hiện"}{" "}
                phụ kiện <b>{xacNhanDoiTrangThai.ten_phu_kien}</b>
                không?
              </p>
            </div>

            <div className="popup-actions">
              <button
                className="nut-dong-y"
                type="button"
                onClick={doiTrangThaiPhuKien}
              >
                Đồng ý
              </button>

              <button
                className="nut-huy"
                type="button"
                onClick={() => setXacNhanDoiTrangThai(null)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {xacNhanXoa && (
        <div className="popup-nen">
          <div className="popup-hop popup-xac-nhan">
            <div className="popup-tieu-de">
              <h3>Xác nhận xóa</h3>
            </div>

            <div className="popup-noi-dung">
              <p>
                Bạn có chắc muốn xóa phụ kiện <b>{xacNhanXoa.ten_phu_kien}</b> không?
              </p>
            </div>

            <div className="popup-actions">
              <button className="nut-dong-y" type="button" onClick={xoaPhuKien}>
                Đồng ý
              </button>

              <button className="nut-huy" type="button" onClick={() => setXacNhanXoa(null)}>
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

            <button className="nut-dong-y" type="button" onClick={() => setPopupThongBao("")}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAccessoryList;
