import { useEffect, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

const SO_DONG_MOI_TRANG = 10;
const SO_DONG_VI_TRI_MOI_TRANG = 10;

const TRANG_THAI_HIEN_THI = 601;
const TRANG_THAI_DA_AN = 602;

function AdminAccessoryList() {
  const [danhSachPhuKien, setDanhSachPhuKien] = useState([]);
  const [danhSachNgam, setDanhSachNgam] = useState([]);
  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState([]);
  const [danhSachViTri, setDanhSachViTri] = useState([]);

  const [tuKhoa, setTuKhoa] = useState("");
  const [ngamLoc, setNgamLoc] = useState("0");
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

  const [tenNgamDangChon, setTenNgamDangChon] = useState("");
  const [tenDanhMucDangChon, setTenDanhMucDangChon] = useState("");
  const [tenViTriDangChon, setTenViTriDangChon] = useState("");

  const [hienGoiYNgam, setHienGoiYNgam] = useState(false);
  const [hienGoiYDanhMuc, setHienGoiYDanhMuc] = useState(false);
  const [hienGoiYViTri, setHienGoiYViTri] = useState(false);
  const [hienPopupViTriKho, setHienPopupViTriKho] = useState(false);
  const [viTriPhanBoDangChon, setViTriPhanBoDangChon] = useState(null);

  const [form, setForm] = useState({
    ten_phu_kien: "",
    ngam_id: "",
    danh_muc_id: "",
    vi_tri_kho_id: "",
    tong_so_luong: "0",
    mo_ta: "",
  });

  const [danhSachPhanBo, setDanhSachPhanBo] = useState([]);
  const [danhSachPhanBoTam, setDanhSachPhanBoTam] = useState([]);
  const [trangViTriHienTai, setTrangViTriHienTai] = useState(1);

  useEffect(() => {
    layDanhSachPhuKien();
    layDanhSachNgam();
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

  function chuanHoaTen(giaTri) {
    return String(giaTri || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/\s+/g, " ");
  }

  function laDanhMucCapSauTheoTen(tenDanhMuc) {
    return chuanHoaTen(tenDanhMuc) === "cap sau";
  }

  function layDanhMucTrongForm() {
    return danhSachDanhMuc.find(
      (item) =>
        String(item.id) === String(form.danh_muc_id)
    );
  }

  function formDangChonCapSau() {
    return laDanhMucCapSauTheoTen(
      layDanhMucTrongForm()?.ten_danh_muc
    );
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

  async function layDanhSachNgam() {
    try {
      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/equipment-models/configuration-options`,
        {
          headers: taoHeaderCoToken(),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachNgam(duLieu.data?.ngam || []);
      }
    } catch {
      moPopup("Không tải được danh sách ngàm");
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

    setTenNgamDangChon("");
    setTenDanhMucDangChon("");
    setTenViTriDangChon("");

    setForm({
      ten_phu_kien: "",
      ngam_id: "",
      danh_muc_id: "",
      vi_tri_kho_id: "",
      tong_so_luong: "0",
      mo_ta: "",
    });

    setDanhSachPhanBo([]);
    setDanhSachPhanBoTam([]);
    setHienPopupViTriKho(false);
    setViTriPhanBoDangChon(null);
    setHienGoiYViTri(false);

    setHienForm(true);
  }

  function moFormSua(phuKien) {
    setCheDoForm("SUA");
    setPhuKienDangSua(phuKien);

    setTenNgamDangChon(phuKien.ten_ngam || "");
    setTenDanhMucDangChon(phuKien.ten_danh_muc || "");
    setTenViTriDangChon(phuKien.ten_vi_tri || "");

    setForm({
      ten_phu_kien: phuKien.ten_phu_kien || "",
      ngam_id: phuKien.ngam_id || "",
      danh_muc_id: phuKien.danh_muc_id || "",
      vi_tri_kho_id: phuKien.vi_tri_kho_id || "",
      tong_so_luong: String(phuKien.tong_so_luong || 0),
      mo_ta: phuKien.mo_ta || "",
    });

    const phanBoHienTai = Array.isArray(phuKien.vi_tri_kho)
      ? phuKien.vi_tri_kho
      : [];

    const danhSachPhanBoHienTai =
      phanBoHienTai.length > 0
        ? phanBoHienTai.map((item) => ({
            vi_tri_kho_id: item.vi_tri_kho_id || "",
            so_luong: String(item.so_luong || 0),
          }))
        : [
            {
              vi_tri_kho_id: phuKien.vi_tri_kho_id || "",
              so_luong: String(phuKien.tong_so_luong || 0),
            },
          ];

    setDanhSachPhanBo(danhSachPhanBoHienTai);
    setDanhSachPhanBoTam([]);

    setHienPopupViTriKho(false);
    setViTriPhanBoDangChon(null);
    setHienGoiYViTri(false);
    setHienForm(true);
  }

  function doiNgamDangChon(e) {
    const giaTri = e.target.value;
    setTenNgamDangChon(giaTri);
    setHienGoiYNgam(true);

    const ngam = danhSachNgam.find(
      (item) =>
        String(item.ten_ngam || "").toLowerCase() ===
        giaTri.toLowerCase()
    );

    setForm({
      ...form,
      ngam_id: ngam ? ngam.id : "",
    });
  }

  function chonNgam(ngam) {
    setTenNgamDangChon(ngam.ten_ngam || "");
    setForm({
      ...form,
      ngam_id: ngam.id,
    });
    setHienGoiYNgam(false);
  }

  function doiDanhMucDangChon(e) {
    const giaTri = e.target.value;
    setTenDanhMucDangChon(giaTri);
    setHienGoiYDanhMuc(true);

    const danhMuc = danhSachDanhMuc.find(
      (item) =>
        String(item.ten_danh_muc || "").toLowerCase() ===
        giaTri.toLowerCase()
    );

    const laCapSau = laDanhMucCapSauTheoTen(
      danhMuc?.ten_danh_muc
    );

    if (!laCapSau) {
      setTenNgamDangChon("");
      setHienGoiYNgam(false);
    }

    setForm({
      ...form,
      danh_muc_id: danhMuc ? danhMuc.id : "",
      ngam_id: laCapSau ? form.ngam_id : "",
    });
  }

  function chonDanhMuc(danhMuc) {
    const laCapSau = laDanhMucCapSauTheoTen(
      danhMuc.ten_danh_muc
    );

    setTenDanhMucDangChon(danhMuc.ten_danh_muc || "");

    if (!laCapSau) {
      setTenNgamDangChon("");
      setHienGoiYNgam(false);
    }

    setForm({
      ...form,
      danh_muc_id: danhMuc.id,
      ngam_id: laCapSau ? form.ngam_id : "",
    });

    setHienGoiYDanhMuc(false);
  }

  function moPopupPhanBoViTri() {
    setDanhSachPhanBoTam(
      danhSachPhanBo.map((item) => ({
        ...item,
      }))
    );
    setTenViTriDangChon("");
    setViTriPhanBoDangChon(null);
    setHienGoiYViTri(false);
    setTrangViTriHienTai(1);
    setHienPopupViTriKho(true);
  }

  function dongPopupPhanBoViTri() {
    setHienPopupViTriKho(false);
    setDanhSachPhanBoTam([]);
    setTrangViTriHienTai(1);
    setTenViTriDangChon("");
    setViTriPhanBoDangChon(null);
    setHienGoiYViTri(false);
  }

  function luuPopupPhanBoViTri() {
    if (danhSachPhanBoTam.length === 0) {
      moPopup("Vui lòng thêm ít nhất một vị trí kho");
      return;
    }

    const viTriDaChon = new Set();

    for (const item of danhSachPhanBoTam) {
      if (!item.vi_tri_kho_id) {
        moPopup("Vui lòng chọn đầy đủ vị trí kho trong danh sách");
        return;
      }

      const soLuong = Number(item.so_luong);

      if (!Number.isInteger(soLuong) || soLuong < 0) {
        moPopup("Số lượng tại vị trí phải là số nguyên lớn hơn hoặc bằng 0");
        return;
      }

      if (viTriDaChon.has(String(item.vi_tri_kho_id))) {
        moPopup("Một vị trí kho không được chọn lặp lại");
        return;
      }

      viTriDaChon.add(String(item.vi_tri_kho_id));
    }

    setDanhSachPhanBo(
      danhSachPhanBoTam.map((item) => ({
        ...item,
      }))
    );
    setHienPopupViTriKho(false);
    setDanhSachPhanBoTam([]);
    setTrangViTriHienTai(1);
    setTenViTriDangChon("");
    setViTriPhanBoDangChon(null);
    setHienGoiYViTri(false);
  }

  function doiViTriDangChon(e) {
    const giaTri = e.target.value;
    setTenViTriDangChon(giaTri);
    setViTriPhanBoDangChon(null);
    setHienGoiYViTri(true);
  }

  function chonViTri(viTri) {
    setTenViTriDangChon(viTri.ten_vi_tri || "");
    setViTriPhanBoDangChon(viTri);
    setHienGoiYViTri(false);
  }

  function thayDoiPhanBo(index, tenTruong, giaTri) {
    setDanhSachPhanBoTam((danhSachCu) =>
      danhSachCu.map((item, viTri) =>
        viTri === index
          ? {
              ...item,
              [tenTruong]: giaTri,
            }
          : item
      )
    );
  }

  function themPhanBoViTri() {
    if (!viTriPhanBoDangChon) {
      moPopup("Vui lòng chọn vị trí kho");
      return;
    }

    if (viTriDaDuocChon(viTriPhanBoDangChon.id)) {
      moPopup("Vị trí kho đã có trong danh sách");
      return;
    }

    setDanhSachPhanBoTam((danhSachCu) => {
      const danhSachMoi = [
        ...danhSachCu,
        {
          vi_tri_kho_id: viTriPhanBoDangChon.id,
          so_luong: "0",
        },
      ];

      setTrangViTriHienTai(
        Math.max(
          1,
          Math.ceil(danhSachMoi.length / SO_DONG_VI_TRI_MOI_TRANG)
        )
      );

      return danhSachMoi;
    });

    setTenViTriDangChon("");
    setViTriPhanBoDangChon(null);
    setHienGoiYViTri(false);
  }

  function xoaPhanBoViTri(index) {
    setDanhSachPhanBoTam((danhSachCu) => {
      const danhSachMoi = danhSachCu.filter(
        (_, viTri) => viTri !== index
      );

      const tongTrangMoi = Math.max(
        1,
        Math.ceil(danhSachMoi.length / SO_DONG_VI_TRI_MOI_TRANG)
      );

      setTrangViTriHienTai((trangCu) =>
        Math.min(trangCu, tongTrangMoi)
      );

      return danhSachMoi;
    });
  }

  function viTriDaDuocChon(viTriKhoId) {
    const danhSachCanKiemTra = hienPopupViTriKho
      ? danhSachPhanBoTam
      : danhSachPhanBo;

    return danhSachCanKiemTra.some(
      (item) =>
        String(item.vi_tri_kho_id || "") === String(viTriKhoId)
    );
  }

  function tongSoLuongTrongForm() {
    return danhSachPhanBo.reduce(
      (tong, item) => tong + Number(item.so_luong || 0),
      0
    );
  }

  async function guiForm(e) {
    e.preventDefault();

    if (!form.ten_phu_kien.trim()) {
      return moPopup("Vui lòng nhập tên phụ kiện");
    }

    if (!form.danh_muc_id) {
      return moPopup("Vui lòng chọn danh mục trong danh sách");
    }

    if (formDangChonCapSau() && !form.ngam_id) {
      return moPopup("Vui lòng chọn ngàm cho phụ kiện Cáp sau");
    }

    if (danhSachPhanBo.length === 0) {
      return moPopup("Vui lòng thêm ít nhất một vị trí kho");
    }

    const viTriDaChon = new Set();

    for (const item of danhSachPhanBo) {
      if (!item.vi_tri_kho_id) {
        return moPopup("Vui lòng chọn đầy đủ vị trí kho trong danh sách");
      }

      const soLuong = Number(item.so_luong);

      if (!Number.isInteger(soLuong) || soLuong < 0) {
        return moPopup("Số lượng tại vị trí phải là số nguyên lớn hơn hoặc bằng 0");
      }

      if (viTriDaChon.has(String(item.vi_tri_kho_id))) {
        return moPopup("Một vị trí kho không được chọn lặp lại");
      }

      viTriDaChon.add(String(item.vi_tri_kho_id));
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
          ngam_id: formDangChonCapSau()
            ? form.ngam_id
            : null,
          danh_muc_id: form.danh_muc_id,
          vi_tri_kho: danhSachPhanBo.map((item) => ({
            vi_tri_kho_id: item.vi_tri_kho_id,
            so_luong: Number(item.so_luong || 0),
          })),
          vi_tri_kho_id: danhSachPhanBo[0]?.vi_tri_kho_id || null,
          tong_so_luong: tongSoLuongTrongForm(),
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

  const danhSachNgamSauLoc = danhSachNgam.filter((ngam) =>
    String(ngam.ten_ngam || "")
      .toLowerCase()
      .includes(tenNgamDangChon.toLowerCase())
  );

  const danhSachDanhMucSauLoc = danhSachDanhMuc.filter((danhMuc) =>
    String(danhMuc.ten_danh_muc || "")
      .toLowerCase()
      .includes(tenDanhMucDangChon.toLowerCase())
  );

  const danhSachViTriSauLoc = danhSachViTri.filter((viTri) => {
    const khopTuKhoa = String(viTri.ten_vi_tri || "")
      .toLowerCase()
      .includes(tenViTriDangChon.toLowerCase());

    return khopTuKhoa && !viTriDaDuocChon(viTri.id);
  });

  const danhSachSauLoc = danhSachPhuKien.filter((phuKien) => {
    const noiDung = `${phuKien.ten_phu_kien || ""} ${
      phuKien.ten_ngam || ""
    } ${phuKien.ten_danh_muc || ""} ${
      phuKien.ten_vi_tri || ""
    }`.toLowerCase();

    const khopTuKhoa = noiDung.includes(tuKhoa.toLowerCase());
    const khopNgam =
      ngamLoc === "0" ||
      String(phuKien.ngam_id) === String(ngamLoc);
    const khopDanhMuc =
      danhMucLoc === "0" ||
      String(phuKien.danh_muc_id) === String(danhMucLoc);
    const khopViTri =
      viTriLoc === "0" ||
      (phuKien.vi_tri_kho || []).some(
        (item) => String(item.vi_tri_kho_id) === String(viTriLoc)
      );

    return khopTuKhoa && khopNgam && khopDanhMuc && khopViTri;
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

  const tongTrangViTri = Math.max(
    1,
    Math.ceil(danhSachPhanBoTam.length / SO_DONG_VI_TRI_MOI_TRANG)
  );

  const viTriBatDauPopup =
    (trangViTriHienTai - 1) * SO_DONG_VI_TRI_MOI_TRANG;

  const danhSachPhanBoHienThi = danhSachPhanBoTam.slice(
    viTriBatDauPopup,
    viTriBatDauPopup + SO_DONG_VI_TRI_MOI_TRANG
  );

  return (
    <div className="khung-trang trang-admin-crud trang-quan-ly-phu-kien">
      <h2>Quản lý phụ kiện</h2>

      <div className="khung-loc-admin khung-loc-phu-kien">
        <input
          placeholder="Tìm tên phụ kiện, ngàm, danh mục, vị trí"
          value={tuKhoa}
          onChange={(e) => {
            setTuKhoa(e.target.value);
            setTrangHienTai(1);
          }}
        />

        <select
          value={ngamLoc}
          onChange={(e) => {
            setNgamLoc(e.target.value);
            setTrangHienTai(1);
          }}
        >
          <option value="0">Tất cả ngàm</option>
          {danhSachNgam.map((ngam) => (
            <option key={ngam.id} value={ngam.id}>
              {ngam.ten_ngam}
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
              <th>Ngàm</th>
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
                <td>{hienThi(phuKien.ten_ngam)}</td>
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

                <td>
                  {(phuKien.vi_tri_kho || []).length > 0
                    ? phuKien.vi_tri_kho
                        .map(
                          (item) =>
                            `${item.ten_vi_tri || "-"} (${dinhDangSo(
                              item.so_luong
                            )})`
                        )
                        .join(", ")
                    : "-"}
                </td>
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

                  {laDanhMucCapSauTheoTen(
                    chiTietPhuKien.ten_danh_muc
                  ) && (
                    <tr>
                      <td>Ngàm</td>
                      <td>{hienThi(chiTietPhuKien.ten_ngam)}</td>
                    </tr>
                  )}

                  <tr>
                    <td>Danh mục</td>
                    <td>{hienThi(chiTietPhuKien.ten_danh_muc)}</td>
                  </tr>

                  <tr>
                    <td>Vị trí kho</td>
                    <td>
                      {(chiTietPhuKien.vi_tri_kho || []).length > 0 ? (
                        <div className="danh-sach-vi-tri-chi-tiet-phu-kien">
                          {chiTietPhuKien.vi_tri_kho.map((item) => (
                            <div key={item.id || item.vi_tri_kho_id}>
                              {item.ten_vi_tri || "-"}: {dinhDangSo(item.so_luong)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
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

              {formDangChonCapSau() && (
                <div className="o-form">
                  <label>Ngàm</label>

                  <div className="combobox-admin">
                    <input
                      value={tenNgamDangChon}
                      onChange={doiNgamDangChon}
                      onFocus={() => setHienGoiYNgam(true)}
                      onBlur={() =>
                        setTimeout(
                          () => setHienGoiYNgam(false),
                          150
                        )
                      }
                      placeholder="Bấm vào để chọn hoặc gõ để tìm ngàm"
                    />

                    {hienGoiYNgam && (
                      <div className="danh-sach-combobox-admin">
                        {danhSachNgamSauLoc.map((ngam) => (
                          <div
                            key={ngam.id}
                            className="dong-combobox-admin"
                            onMouseDown={() => chonNgam(ngam)}
                          >
                            {ngam.ten_ngam}
                          </div>
                        ))}

                        {danhSachNgamSauLoc.length === 0 && (
                          <div className="dong-combobox-admin">
                            Không tìm thấy ngàm
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="o-form o-form-phan-bo-vi-tri-phu-kien">
                <label>Phân bổ vị trí kho</label>

                <div className="hang-cau-hinh-vi-tri-form">
                  <button
                    type="button"
                    className={
                      cheDoForm === "THEM"
                        ? "nut-them"
                        : "nut-cap-nhat-popup"
                    }
                    onClick={moPopupPhanBoViTri}
                  >
                    {cheDoForm === "THEM"
                      ? "Thêm vị trí"
                      : "Cập nhật vị trí"}
                  </button>

                  <span className="so-luong-vi-tri-da-chon">
                    Đã chọn <b>{danhSachPhanBo.length}</b> vị trí
                  </span>
                </div>

                {danhSachPhanBo.length === 0 && (
                  <small className="ghi-chu-o-form">
                    Phụ kiện bắt buộc có ít nhất một vị trí kho.
                  </small>
                )}
              </div>

              <div className="o-form">
                <label>Tổng số lượng</label>
                <input value={tongSoLuongTrongForm()} readOnly />
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

      {hienPopupViTriKho && (
        <div className="popup-nen popup-nen-cap-hai">
          <div className="popup-hop popup-cau-hinh-vi-tri-phu-kien">
            <div className="popup-tieu-de">
              <h3>
                Vị trí kho của {form.ten_phu_kien.trim() || "phụ kiện"}
              </h3>
            </div>

            <div className="popup-noi-dung">
              <div className="khung-them-vi-tri-phu-kien">
                <div className="combobox-admin">
                  <input
                    value={tenViTriDangChon}
                    placeholder="Tìm và chọn vị trí kho"
                    autoComplete="off"
                    onFocus={() => setHienGoiYViTri(true)}
                    onChange={doiViTriDangChon}
                    onBlur={() => {
                      setTimeout(() => setHienGoiYViTri(false), 150);
                    }}
                  />

                  {hienGoiYViTri && (
                    <div className="danh-sach-combobox-admin">
                      {danhSachViTriSauLoc.length === 0 ? (
                        <div className="dong-combobox-admin">
                          Không có gợi ý
                        </div>
                      ) : (
                        danhSachViTriSauLoc.map((viTri) => (
                          <div
                            key={viTri.id}
                            className="dong-combobox-admin"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => chonViTri(viTri)}
                          >
                            <b>{viTri.ten_vi_tri}</b>
                            <span>
                              Sức chứa: {dinhDangSo(viTri.suc_chua_toi_da)} -
                              Đang chứa: {dinhDangSo(viTri.so_luong_dang_chua)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="nut-them"
                  onClick={themPhanBoViTri}
                >
                  Thêm
                </button>
              </div>

              <h3>Danh sách vị trí đã chọn</h3>

              {danhSachPhanBoTam.length === 0 ? (
                <p>Chưa có vị trí kho.</p>
              ) : (
                <div className="admin-bang-wrapper">
                  <table className="bang-popup bang-gon bang-vi-tri-phu-kien-popup">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Tên vị trí</th>
                        <th>Sức chứa</th>
                        <th>Số lượng</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>

                    <tbody>
                      {danhSachPhanBoHienThi.map((item, index) => {
                        const viTri = danhSachViTri.find(
                          (vt) => String(vt.id) === String(item.vi_tri_kho_id)
                        );

                        return (
                          <tr key={item.vi_tri_kho_id || index}>
                            <td>{viTriBatDauPopup + index + 1}</td>
                            <td>{viTri?.ten_vi_tri || "-"}</td>
                            <td>{dinhDangSo(viTri?.suc_chua_toi_da)}</td>
                            <td>
                              <input
                                className="o-so-luong-phan-bo-vi-tri"
                                type="number"
                                min="0"
                                value={item.so_luong}
                                onChange={(e) =>
                                  thayDoiPhanBo(
                                    viTriBatDauPopup + index,
                                    "so_luong",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <button
                                type="button"
                                className="nut-xoa"
                                onClick={() =>
                                  xoaPhanBoViTri(viTriBatDauPopup + index)
                                }
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {danhSachPhanBoTam.length > SO_DONG_VI_TRI_MOI_TRANG && (
                <div className="phan-trang phan-trang-vi-tri-phu-kien">
                  <button
                    type="button"
                    className="nut-dong-popup"
                    disabled={trangViTriHienTai === 1}
                    onClick={() =>
                      setTrangViTriHienTai(trangViTriHienTai - 1)
                    }
                  >
                    Trước
                  </button>

                  <span>
                    Trang {trangViTriHienTai} / {tongTrangViTri}
                  </span>

                  <button
                    type="button"
                    className="nut-dong-popup"
                    disabled={trangViTriHienTai === tongTrangViTri}
                    onClick={() =>
                      setTrangViTriHienTai(trangViTriHienTai + 1)
                    }
                  >
                    Sau
                  </button>
                </div>
              )}

              <div className="popup-actions popup-actions-vi-tri-phu-kien">
                <button
                  type="button"
                  className="nut-dong-y"
                  onClick={luuPopupPhanBoViTri}
                >
                  Lưu
                </button>

                <button
                  type="button"
                  className="nut-huy"
                  onClick={dongPopupPhanBoViTri}
                >
                  Đóng
                </button>
              </div>
            </div>
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
