import { useEffect, useMemo, useRef, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

const SO_DONG_MOI_TRANG = 10;

const TRANG_THAI_HIEN_THI = 601;
const TRANG_THAI_DA_AN = 602;

function AdminEquipmentModelList() {
  const [danhSachMau, setDanhSachMau] = useState([]);
  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState([]);
  const [danhSachHang, setDanhSachHang] = useState([]);

  const [tuKhoaNhap, setTuKhoaNhap] = useState("");
  const [hangNhap, setHangNhap] = useState("");
  const [danhMucNhap, setDanhMucNhap] = useState("");
  const [trangThaiNhap, setTrangThaiNhap] = useState("0");

  const [tuKhoa, setTuKhoa] = useState("");
  const [hangLoc, setHangLoc] = useState("");
  const [danhMucLoc, setDanhMucLoc] = useState("");
  const [trangThaiLoc, setTrangThaiLoc] = useState("0");

  const [trangHienTai, setTrangHienTai] = useState(1);
  const [dangTai, setDangTai] = useState(false);
  const [dangGui, setDangGui] = useState(false);

  const [cheDoPopup, setCheDoPopup] = useState("");
  const [mauDangChon, setMauDangChon] = useState(null);
  const [chiTietMau, setChiTietMau] = useState(null);

  const [formMau, setFormMau] = useState({
    danh_muc_id: "",
    hang_id: "",
    ten_mau: "",
    mo_ta: "",
    gia_thue_ngay: "",
    tien_coc: "",
  });

  const [tuKhoaDanhMucForm, setTuKhoaDanhMucForm] = useState("");
  const [hienGoiYDanhMucForm, setHienGoiYDanhMucForm] = useState(false);
  const [tuKhoaHangForm, setTuKhoaHangForm] = useState("");
  const [hienGoiYHangForm, setHienGoiYHangForm] = useState(false);

  const comboDanhMucRef = useRef(null);
  const comboHangRef = useRef(null);
  const comboBoDiKemRef = useRef(null);

  const [anhMauFile, setAnhMauFile] = useState(null);
  const [anhMauPreview, setAnhMauPreview] = useState("");
  const [anhDangXem, setAnhDangXem] = useState("");

  const [danhSachBoDiKem, setDanhSachBoDiKem] = useState([]);
  const [danhSachGoiYBoDiKem, setDanhSachGoiYBoDiKem] = useState([]);
  const [tuKhoaBoDiKem, setTuKhoaBoDiKem] = useState("");
  const [hienGoiYBoDiKem, setHienGoiYBoDiKem] = useState(false);
  const [boDiKemDangChon, setBoDiKemDangChon] = useState(null);
  const [soLuongBoDiKem, setSoLuongBoDiKem] = useState(1);

  const [popupThongBao, setPopupThongBao] = useState("");
  const [popupXacNhan, setPopupXacNhan] = useState(null);

  useEffect(() => {
    layDanhSachMau();
    layDanhSachDanhMuc();
    layDanhSachHang();
  }, []);

  useEffect(() => {
    function dongComboboxKhiBamNgoai(e) {
      if (comboDanhMucRef.current && !comboDanhMucRef.current.contains(e.target)) {
        setHienGoiYDanhMucForm(false);
      }

      if (comboHangRef.current && !comboHangRef.current.contains(e.target)) {
        setHienGoiYHangForm(false);
      }

      if (comboBoDiKemRef.current && !comboBoDiKemRef.current.contains(e.target)) {
        setHienGoiYBoDiKem(false);
      }
    }

    document.addEventListener("mousedown", dongComboboxKhiBamNgoai);

    return () => {
      document.removeEventListener("mousedown", dongComboboxKhiBamNgoai);
    };
  }, []);

  function moPopupThongBao(noiDung) {
    setPopupThongBao(noiDung || "Có lỗi xảy ra");
  }

  function hienThi(giaTri) {
    return giaTri || "-";
  }

  function dinhDangNgay(giaTri) {
    if (!giaTri) return "-";
    return new Date(giaTri).toLocaleDateString("vi-VN");
  }

  function dinhDangTien(giaTri) {
    return Number(giaTri || 0).toLocaleString("vi-VN") + " đ";
  }

  function layTenMau(mau) {
    return mau?.ten_mau || "Mẫu thiết bị";
  }

  function layClassTrangThai(trangThai) {
    if (Number(trangThai) === TRANG_THAI_HIEN_THI) {
      return "trang-thai-badge trang-thai-xanh";
    }

    return "trang-thai-badge trang-thai-xam";
  }

  function hienThiTrangThai(trangThai, tenTrangThai) {
    return (
      <span className={layClassTrangThai(trangThai)}>
        {tenTrangThai || (Number(trangThai) === 601 ? "Hiển thị" : "Đã ẩn")}
      </span>
    );
  }

  function layTrangThaiMoi(mau) {
    return Number(mau.trang_thai) === TRANG_THAI_HIEN_THI
      ? TRANG_THAI_DA_AN
      : TRANG_THAI_HIEN_THI;
  }

  function layTenNutTrangThai(mau) {
    return Number(mau.trang_thai) === TRANG_THAI_HIEN_THI ? "Ẩn" : "Hiện";
  }

  function layClassNutTrangThai(mau) {
    return Number(mau.trang_thai) === TRANG_THAI_HIEN_THI
      ? "nut-an"
      : "nut-hien";
  }

  function layTenDanhMucTheoId(id) {
    const danhMuc = danhSachDanhMuc.find((dm) => String(dm.id) === String(id));
    return danhMuc?.ten_danh_muc || "";
  }

  function layTenHangTheoId(id) {
    const hang = danhSachHang.find((item) => String(item.id) === String(id));
    return hang?.ten_hang || "";
  }

  function doiTuKhoaDanhMucForm(giaTri) {
    setTuKhoaDanhMucForm(giaTri);
    doiFormMau("danh_muc_id", "");
    setHienGoiYDanhMucForm(true);
  }

  function chonDanhMucForm(danhMuc) {
    doiFormMau("danh_muc_id", danhMuc.id);
    setTuKhoaDanhMucForm(danhMuc.ten_danh_muc);
    setHienGoiYDanhMucForm(false);
  }

  function doiTuKhoaHangForm(giaTri) {
    setTuKhoaHangForm(giaTri);
    doiFormMau("hang_id", "");
    setHienGoiYHangForm(true);
  }

  function chonHangForm(hang) {
    doiFormMau("hang_id", hang.id);
    setTuKhoaHangForm(hang.ten_hang);
    setHienGoiYHangForm(false);
  }

  async function layDanhSachMau() {
    try {
      setDangTai(true);

      const phanHoi = await fetch(`${DUONG_DAN_API}/api/admin/equipment-models`, {
        headers: taoHeaderCoToken(),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachMau(duLieu.data || []);
        setTrangHienTai(1);
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    } finally {
      setDangTai(false);
    }
  }

  async function layDanhSachDanhMuc() {
    try {
      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/equipment-categories/options?tinh_chat_id=2501,2502`,
        {
          headers: taoHeaderCoToken(),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachDanhMuc(duLieu.data || []);
      }
    } catch {
      // Không chặn màn hình nếu danh mục chưa tải được.
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
      // Không chặn màn hình nếu hãng chưa tải được.
    }
  }

  async function layChiTietMau(mauId) {
    const phanHoi = await fetch(
      `${DUONG_DAN_API}/api/admin/equipment-models/${mauId}`,
      {
        headers: taoHeaderCoToken(),
      }
    );

    const duLieu = await phanHoi.json();

    if (!duLieu.success) {
      throw new Error(duLieu.message);
    }

    return duLieu.data;
  }

  async function xemChiTiet(mau) {
    try {
      const chiTiet = await layChiTietMau(mau.id);

      setChiTietMau(chiTiet);
      setMauDangChon(chiTiet);
      setCheDoPopup("CHI_TIET");
    } catch (loi) {
      moPopupThongBao(loi.message);
    }
  }

  function moThem() {
    setMauDangChon(null);
    setChiTietMau(null);

    setFormMau({
      danh_muc_id: "",
      hang_id: "",
      ten_mau: "",
      mo_ta: "",
      gia_thue_ngay: "",
      tien_coc: "",
    });

    setTuKhoaDanhMucForm("");
    setTuKhoaHangForm("");
    setHienGoiYDanhMucForm(false);
    setHienGoiYHangForm(false);

    setAnhMauFile(null);
    setAnhMauPreview("");
    setCheDoPopup("THEM");
  }

  function moCapNhat(mau) {
    setMauDangChon(mau);
    setChiTietMau(null);

    setFormMau({
      danh_muc_id: mau.danh_muc_id || "",
      hang_id: mau.hang_id || "",
      ten_mau: mau.ten_mau || "",
      mo_ta: mau.mo_ta || "",
      gia_thue_ngay: mau.gia_thue_ngay || "",
      tien_coc: mau.tien_coc || "",
    });

    setTuKhoaDanhMucForm(mau.ten_danh_muc || layTenDanhMucTheoId(mau.danh_muc_id));
    setTuKhoaHangForm(mau.ten_hang || layTenHangTheoId(mau.hang_id));
    setHienGoiYDanhMucForm(false);
    setHienGoiYHangForm(false);

    setAnhMauFile(null);
    setAnhMauPreview(mau.anh_url || "");
    setCheDoPopup("CAP_NHAT");
  }

  function dongPopup() {
    setCheDoPopup("");
    setMauDangChon(null);
    setChiTietMau(null);

    setDanhSachBoDiKem([]);
    setDanhSachGoiYBoDiKem([]);
    setTuKhoaBoDiKem("");
    setHienGoiYBoDiKem(false);
    setBoDiKemDangChon(null);
    setSoLuongBoDiKem(1);

    setTuKhoaDanhMucForm("");
    setHienGoiYDanhMucForm(false);
    setTuKhoaHangForm("");
    setHienGoiYHangForm(false);

    setAnhMauFile(null);
    setAnhMauPreview("");
  }

  function doiFormMau(tenTruong, giaTri) {
    setFormMau({
      ...formMau,
      [tenTruong]: giaTri,
    });
  }

  function chonAnhMau(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      moPopupThongBao("Vui lòng chọn file ảnh");
      e.target.value = "";
      return;
    }

    setAnhMauFile(file);
    setAnhMauPreview(URL.createObjectURL(file));
  }

  function kiemTraFormMau() {
    if (!formMau.danh_muc_id) {
      moPopupThongBao("Vui lòng chọn danh mục");
      return false;
    }

    if (!formMau.hang_id) {
      moPopupThongBao("Vui lòng chọn hãng");
      return false;
    }

    if (!formMau.ten_mau.trim()) {
      moPopupThongBao("Vui lòng nhập tên mẫu");
      return false;
    }

    if (Number(formMau.gia_thue_ngay || 0) < 0) {
      moPopupThongBao("Giá thuê không hợp lệ");
      return false;
    }

    if (Number(formMau.tien_coc || 0) < 0) {
      moPopupThongBao("Tiền cọc không hợp lệ");
      return false;
    }

    return true;
  }

  async function guiFormMau(e) {
    e.preventDefault();

    if (!kiemTraFormMau()) return;

    try {
      setDangGui(true);

      const laThem = cheDoPopup === "THEM";

      const url = laThem
        ? `${DUONG_DAN_API}/api/admin/equipment-models`
        : `${DUONG_DAN_API}/api/admin/equipment-models/${mauDangChon.id}`;

      const formData = new FormData();

      formData.append("danh_muc_id", formMau.danh_muc_id);
      formData.append("hang_id", formMau.hang_id);
      formData.append("ten_mau", formMau.ten_mau);
      formData.append("mo_ta", formMau.mo_ta || "");
      formData.append("gia_thue_ngay", Number(formMau.gia_thue_ngay || 0));
      formData.append("tien_coc", Number(formMau.tien_coc || 0));

      if (anhMauFile) {
        formData.append("anh_mau", anhMauFile);
      }

      const phanHoi = await fetch(url, {
        method: laThem ? "POST" : "PUT",
        headers: taoHeaderCoToken(),
        body: formData,
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        await layDanhSachMau();
        dongPopup();
        moPopupThongBao(duLieu.message);
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    } finally {
      setDangGui(false);
    }
  }

  function xacNhanDoiTrangThai(mau) {
    const trangThaiMoi = layTrangThaiMoi(mau);
    const hanhDong = trangThaiMoi === TRANG_THAI_DA_AN ? "ẩn" : "hiện";

    setPopupXacNhan({
      noiDung: `Bạn có chắc muốn ${hanhDong} mẫu "${layTenMau(mau)}" không?`,
      hanhDong: async () => {
        await doiTrangThaiMau(mau, trangThaiMoi);
      },
    });
  }

  async function doiTrangThaiMau(mau, trangThaiMoi) {
    try {
      setPopupXacNhan(null);

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/equipment-models/${mau.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...taoHeaderCoToken(),
          },
          body: JSON.stringify({
            trang_thai: trangThaiMoi,
          }),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachMau((danhSachCu) =>
          danhSachCu.map((item) =>
            item.id === duLieu.data.id ? { ...item, ...duLieu.data } : item
          )
        );

        if (chiTietMau && chiTietMau.id === duLieu.data.id) {
          setChiTietMau({
            ...chiTietMau,
            ...duLieu.data,
          });
        }

        moPopupThongBao(duLieu.message);
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    }
  }

  async function moBoDiKem(mau) {
    try {
      setMauDangChon(mau);
      setCheDoPopup("BO_DI_KEM");
      setTuKhoaBoDiKem("");
      setBoDiKemDangChon(null);
      setHienGoiYBoDiKem(false);
      setSoLuongBoDiKem(1);

      await layBoDiKem(mau.id);
      await layGoiYBoDiKem(mau.id, "");
    } catch (loi) {
      moPopupThongBao(loi.message);
    }
  }

  async function layBoDiKem(mauId) {
    const phanHoi = await fetch(
      `${DUONG_DAN_API}/api/admin/equipment-models/${mauId}/bundles`,
      {
        headers: taoHeaderCoToken(),
      }
    );

    const duLieu = await phanHoi.json();

    if (!duLieu.success) {
      throw new Error(duLieu.message);
    }

    setDanhSachBoDiKem(duLieu.data || []);
  }

  function gomGoiYBoDiKem(data) {
    const thietBiPhu = (data?.thiet_bi_phu || []).map((item) => ({
      id: item.id,
      loai: "THIET_BI_PHU",
      ten_hien_thi: item.ten_mau,
      mo_ta: `${item.ten_hang || ""} - ${item.ten_danh_muc || ""}`,
      mau_thiet_bi_phu_id: item.id,
      phu_kien_id: null,
    }));

    const phuKien = (data?.phu_kien || []).map((item) => ({
      id: item.id,
      loai: "PHU_KIEN",
      ten_hien_thi: item.ten_phu_kien,
      mo_ta: `${item.ten_hang || ""} - ${item.ten_danh_muc || ""}`,
      mau_thiet_bi_phu_id: null,
      phu_kien_id: item.id,
    }));

    return [...thietBiPhu, ...phuKien];
  }

  async function layGoiYBoDiKem(mauId, tuKhoaTim) {
    const params = new URLSearchParams();

    if (tuKhoaTim) {
      params.set("q", tuKhoaTim);
    }

    const phanHoi = await fetch(
      `${DUONG_DAN_API}/api/admin/equipment-models/${mauId}/bundle-options?${params.toString()}`,
      {
        headers: taoHeaderCoToken(),
      }
    );

    const duLieu = await phanHoi.json();

    if (!duLieu.success) {
      throw new Error(duLieu.message);
    }

    setDanhSachGoiYBoDiKem(gomGoiYBoDiKem(duLieu.data || {}));
  }

  async function doiTuKhoaBoDiKem(giaTri) {
    setTuKhoaBoDiKem(giaTri);
    setBoDiKemDangChon(null);
    setHienGoiYBoDiKem(true);

    if (!mauDangChon) return;

    try {
      await layGoiYBoDiKem(mauDangChon.id, giaTri);
    } catch {
      // Không hiện popup mỗi lần gõ.
    }
  }

  function chonGoiYBoDiKem(item) {
    setBoDiKemDangChon(item);
    setTuKhoaBoDiKem(item.ten_hien_thi);
    setHienGoiYBoDiKem(false);
  }

  async function themBoDiKem() {
    if (!mauDangChon) {
      moPopupThongBao("Chưa chọn mẫu thiết bị");
      return;
    }

    if (!boDiKemDangChon) {
      moPopupThongBao("Vui lòng chọn món đi kèm");
      return;
    }

    if (Number(soLuongBoDiKem || 0) <= 0) {
      moPopupThongBao("Số lượng phải lớn hơn 0");
      return;
    }

    try {
      setDangGui(true);

      const body = {
        so_luong: Number(soLuongBoDiKem),
      };

      if (boDiKemDangChon.loai === "THIET_BI_PHU") {
        body.mau_thiet_bi_phu_id = boDiKemDangChon.mau_thiet_bi_phu_id;
      }

      if (boDiKemDangChon.loai === "PHU_KIEN") {
        body.phu_kien_id = boDiKemDangChon.phu_kien_id;
      }

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/equipment-models/${mauDangChon.id}/bundles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...taoHeaderCoToken(),
          },
          body: JSON.stringify(body),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachBoDiKem(duLieu.data || []);
        setTuKhoaBoDiKem("");
        setBoDiKemDangChon(null);
        setSoLuongBoDiKem(1);
        await layGoiYBoDiKem(mauDangChon.id, "");
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    } finally {
      setDangGui(false);
    }
  }

  function layTenBoDiKem(item) {
    return item.ten_mau_thiet_bi_phu || item.ten_phu_kien || "Món đi kèm";
  }

  function xacNhanXoaBoDiKem(item) {
    setPopupXacNhan({
      noiDung: `Bạn có chắc muốn xóa "${layTenBoDiKem(item)}" khỏi bộ đi kèm không?`,
      hanhDong: async () => {
        await xoaBoDiKem(item.id);
      },
    });
  }

  async function xoaBoDiKem(bundleId) {
    if (!mauDangChon) return;

    try {
      setPopupXacNhan(null);

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/equipment-models/${mauDangChon.id}/bundles/${bundleId}`,
        {
          method: "DELETE",
          headers: taoHeaderCoToken(),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        await layBoDiKem(mauDangChon.id);
        await layGoiYBoDiKem(mauDangChon.id, "");
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    }
  }

  const danhSachSauLoc = useMemo(() => {
    return danhSachMau.filter((mau) => {
      const noiDung = `${mau.ten_mau || ""} ${mau.ten_hang || ""} ${
        mau.ten_danh_muc || ""
      }`.toLowerCase();

      const khopTuKhoa = noiDung.includes(tuKhoa.toLowerCase());

      const khopHang =
        !hangLoc || String(mau.hang_id) === String(hangLoc);

      const khopDanhMuc =
        !danhMucLoc || String(mau.danh_muc_id) === String(danhMucLoc);

      const khopTrangThai =
        trangThaiLoc === "0" ||
        Number(mau.trang_thai) === Number(trangThaiLoc);

      return khopTuKhoa && khopHang && khopDanhMuc && khopTrangThai;
    });
  }, [danhSachMau, tuKhoa, hangLoc, danhMucLoc, trangThaiLoc]);

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
    <div className="khung-trang trang-admin-crud trang-quan-ly-mau-thiet-bi">
      <h2>Quản lý mẫu thiết bị</h2>

      <div className="khung-loc-admin">
        <input
          placeholder="Tìm tên mẫu, hãng, danh mục"
          value={tuKhoaNhap}
          onChange={(e) => {
            setTuKhoaNhap(e.target.value);
            setTuKhoa(e.target.value);
            setTrangHienTai(1);
          }}
        />

        <select
          value={hangNhap}
          onChange={(e) => {
            setHangNhap(e.target.value);
            setHangLoc(e.target.value);
            setTrangHienTai(1);
          }}
        >
          <option value="">Tất cả hãng</option>

          {danhSachHang.map((hang) => (
            <option key={hang.id} value={hang.id}>
              {hang.ten_hang}
            </option>
          ))}
        </select>

        <select
          value={danhMucNhap}
          onChange={(e) => {
            setDanhMucNhap(e.target.value);
            setDanhMucLoc(e.target.value);
            setTrangHienTai(1);
          }}
        >
          <option value="">Tất cả danh mục</option>

          {danhSachDanhMuc.map((dm) => (
            <option key={dm.id} value={dm.id}>
              {dm.ten_danh_muc}
            </option>
          ))}
        </select>

        <select
          value={trangThaiNhap}
          onChange={(e) => {
            setTrangThaiNhap(e.target.value);
            setTrangThaiLoc(e.target.value);
            setTrangHienTai(1);
          }}
        >
          <option value="0">Tất cả trạng thái</option>
          <option value={TRANG_THAI_HIEN_THI}>Hiển thị</option>
          <option value={TRANG_THAI_DA_AN}>Đã ẩn</option>
        </select>


        <button className="nut-them" onClick={moThem}>
          Thêm
        </button>
      </div>

      <div className="admin-bang-wrapper">
        <table className="bang-quan-ly bang-gon bang-mau-thiet-bi">
          <thead>
            <tr>
              <th>STT</th>
              <th>Ảnh</th>
              <th>Tên mẫu</th>
              <th>Hãng</th>
              <th>Danh mục</th>
              <th>Giá thuê/ngày</th>
              <th>Tiền cọc</th>
              <th>Sẵn sàng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {dangTai ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : danhSachHienThi.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              danhSachHienThi.map((mau, index) => (
                <tr key={mau.id}>
                  <td>{viTriBatDau + index + 1}</td>

                  <td>
                    {mau.anh_url ? (
                      <img
                        src={mau.anh_url}
                        alt={mau.ten_mau}
                        className="anh-nho-admin"
                        onClick={() => setAnhDangXem(mau.anh_url)}
                      />
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>{hienThi(mau.ten_mau)}</td>
                  <td>{hienThi(mau.ten_hang)}</td>
                  <td>{hienThi(mau.ten_danh_muc)}</td>
                  <td>{dinhDangTien(mau.gia_thue_ngay)}</td>
                  <td>{dinhDangTien(mau.tien_coc)}</td>
                  <td>{hienThi(mau.so_luong_san_sang)}</td>

                  <td>{hienThiTrangThai(mau.trang_thai, mau.ten_trang_thai)}</td>

                  <td>
                    <div className="cot-thao-tac">
                      <button
                        className="nut-xem-chi-tiet"
                        onClick={() => xemChiTiet(mau)}
                      >
                        Xem chi tiết
                      </button>

                      <button
                        className="nut-cap-nhat"
                        onClick={() => moCapNhat(mau)}
                      >
                        Cập nhật
                      </button>

                      <button
                        className={layClassNutTrangThai(mau)}
                        onClick={() => xacNhanDoiTrangThai(mau)}
                      >
                        {layTenNutTrangThai(mau)}
                      </button>

                      <button className="nut-them" onClick={() => moBoDiKem(mau)}>
                        Bộ đi kèm
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
          className="nut-dong-popup"
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
          disabled={trangHienTai === tongTrang}
          onClick={() => setTrangHienTai(trangHienTai + 1)}
        >
          Sau
        </button>
      </div>

      {cheDoPopup === "CHI_TIET" && chiTietMau && (
        <div className="popup-nen">
          <div className="popup-hop popup-lon">
            <div className="popup-tieu-de">
              <h3>Xem chi tiết mẫu thiết bị</h3>

              <button className="nut-dong-popup" onClick={dongPopup}>
                Đóng
              </button>
            </div>

            <div className="popup-noi-dung">
              {chiTietMau.anh_url && (
                <img
                  src={chiTietMau.anh_url}
                  alt={chiTietMau.ten_mau}
                  className="anh-lon-popup"
                  onClick={() => setAnhDangXem(chiTietMau.anh_url)}
                />
              )}

              <table className="bang-popup bang-gon">
                <tbody>
                  <tr>
                    <td>Tên mẫu</td>
                    <td>{hienThi(chiTietMau.ten_mau)}</td>
                  </tr>

                  <tr>
                    <td>Hãng</td>
                    <td>{hienThi(chiTietMau.ten_hang)}</td>
                  </tr>

                  <tr>
                    <td>Danh mục</td>
                    <td>{hienThi(chiTietMau.ten_danh_muc)}</td>
                  </tr>

                  <tr>
                    <td>Giá thuê/ngày</td>
                    <td>{dinhDangTien(chiTietMau.gia_thue_ngay)}</td>
                  </tr>

                  <tr>
                    <td>Tiền cọc</td>
                    <td>{dinhDangTien(chiTietMau.tien_coc)}</td>
                  </tr>

                  <tr>
                    <td>Số lượng sẵn sàng</td>
                    <td>{hienThi(chiTietMau.so_luong_san_sang)}</td>
                  </tr>

                  <tr>
                    <td>Tổng thiết bị vật lý</td>
                    <td>{hienThi(chiTietMau.tong_thiet_bi_vat_ly)}</td>
                  </tr>

                  <tr>
                    <td>Trạng thái</td>
                    <td>
                      {hienThiTrangThai(
                        chiTietMau.trang_thai,
                        chiTietMau.ten_trang_thai
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td>Mô tả</td>
                    <td>{hienThi(chiTietMau.mo_ta)}</td>
                  </tr>

                  <tr>
                    <td>Ngày tạo</td>
                    <td>{dinhDangNgay(chiTietMau.created_at)}</td>
                  </tr>
                </tbody>
              </table>

              <h3>Bộ đi kèm</h3>

              {!chiTietMau.bo_di_kem || chiTietMau.bo_di_kem.length === 0 ? (
                <p>Chưa có bộ đi kèm.</p>
              ) : (
                <table className="bang-popup bang-gon">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Món đi kèm</th>
                      <th>Số lượng</th>
                    </tr>
                  </thead>

                  <tbody>
                    {chiTietMau.bo_di_kem.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{hienThi(layTenBoDiKem(item))}</td>
                        <td>{hienThi(item.so_luong)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="popup-actions">
                <button
                  className="nut-cap-nhat-popup"
                  onClick={() => moCapNhat(chiTietMau)}
                >
                  Cập nhật
                </button>

                <button className="nut-dong-y" onClick={() => moBoDiKem(chiTietMau)}>
                  Bộ đi kèm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {(cheDoPopup === "THEM" || cheDoPopup === "CAP_NHAT") && (
        <div className="popup-nen">
          <div className="popup-hop popup-lon">
            <div className="popup-tieu-de">
              <h3>
                {cheDoPopup === "THEM"
                  ? "Thêm mẫu thiết bị"
                  : "Cập nhật mẫu thiết bị"}
              </h3>
            </div>

            <div className="popup-noi-dung">
              <form onSubmit={guiFormMau}>
                <div className="o-form">
                  <label>Danh mục</label>

                  <div className="combobox-admin" ref={comboDanhMucRef}>
                    <input
                      value={tuKhoaDanhMucForm}
                      placeholder="Tìm và chọn danh mục"
                      onFocus={() => setHienGoiYDanhMucForm(true)}
                      onChange={(e) => doiTuKhoaDanhMucForm(e.target.value)}
                    />

                    {hienGoiYDanhMucForm && (
                      <div className="danh-sach-combobox-admin">
                        {danhSachDanhMuc
                          .filter((dm) =>
                            (dm.ten_danh_muc || "")
                              .toLowerCase()
                              .includes(tuKhoaDanhMucForm.toLowerCase())
                          )
                          .map((dm) => (
                            <div
                              key={dm.id}
                              className="dong-combobox-admin"
                              onClick={() => chonDanhMucForm(dm)}
                            >
                              <b>{dm.ten_danh_muc}</b>
                              <span>{dm.ten_tinh_chat || ""}</span>
                            </div>
                          ))}

                        {danhSachDanhMuc.filter((dm) =>
                          (dm.ten_danh_muc || "")
                            .toLowerCase()
                            .includes(tuKhoaDanhMucForm.toLowerCase())
                        ).length === 0 && (
                          <div className="dong-combobox-admin">Không có gợi ý</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="o-form">
                  <label>Hãng</label>

                  <div className="combobox-admin" ref={comboHangRef}>
                    <input
                      value={tuKhoaHangForm}
                      placeholder="Tìm và chọn hãng"
                      onFocus={() => setHienGoiYHangForm(true)}
                      onChange={(e) => doiTuKhoaHangForm(e.target.value)}
                    />

                    {hienGoiYHangForm && (
                      <div className="danh-sach-combobox-admin">
                        {danhSachHang
                          .filter((hang) =>
                            (hang.ten_hang || "")
                              .toLowerCase()
                              .includes(tuKhoaHangForm.toLowerCase())
                          )
                          .map((hang) => (
                            <div
                              key={hang.id}
                              className="dong-combobox-admin"
                              onClick={() => chonHangForm(hang)}
                            >
                              <b>{hang.ten_hang}</b>
                            </div>
                          ))}

                        {danhSachHang.filter((hang) =>
                          (hang.ten_hang || "")
                            .toLowerCase()
                            .includes(tuKhoaHangForm.toLowerCase())
                        ).length === 0 && (
                          <div className="dong-combobox-admin">Không có gợi ý</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="o-form">
                  <label>Tên mẫu</label>

                  <input
                    value={formMau.ten_mau}
                    onChange={(e) => doiFormMau("ten_mau", e.target.value)}
                  />
                </div>

                <div className="o-form">
                  <label>Ảnh mẫu thiết bị</label>

                  <input type="file" accept="image/*" onChange={chonAnhMau} />
                </div>

                {anhMauPreview && (
                  <img
                    src={anhMauPreview}
                    alt="Ảnh mẫu"
                    className="anh-lon-popup"
                    onClick={() => setAnhDangXem(anhMauPreview)}
                  />
                )}

                <div className="o-form">
                  <label>Giá thuê/ngày</label>

                  <input
                    type="number"
                    min="0"
                    value={formMau.gia_thue_ngay}
                    onChange={(e) => doiFormMau("gia_thue_ngay", e.target.value)}
                  />
                </div>

                <div className="o-form">
                  <label>Tiền cọc</label>

                  <input
                    type="number"
                    min="0"
                    value={formMau.tien_coc}
                    onChange={(e) => doiFormMau("tien_coc", e.target.value)}
                  />
                </div>

                <div className="o-form">
                  <label>Mô tả</label>

                  <textarea
                    value={formMau.mo_ta}
                    onChange={(e) => doiFormMau("mo_ta", e.target.value)}
                  />
                </div>

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

                  <button className="nut-huy" type="button" onClick={dongPopup}>
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {cheDoPopup === "BO_DI_KEM" && mauDangChon && (
        <div className="popup-nen">
          <div className="popup-hop popup-bo-di-kem">
            <div className="popup-tieu-de">
              <h3>Bộ đi kèm của {layTenMau(mauDangChon)}</h3>

              <button className="nut-dong-popup" onClick={dongPopup}>
                Đóng
              </button>
            </div>

            <div className="popup-noi-dung">
              <div className="khung-them-bo-di-kem">
                <div className="combobox-admin" ref={comboBoDiKemRef}>
                  <input
                    value={tuKhoaBoDiKem}
                    placeholder="Tìm mẫu thiết bị hoặc phụ kiện đi kèm"
                    onFocus={() => setHienGoiYBoDiKem(true)}
                    onChange={(e) => doiTuKhoaBoDiKem(e.target.value)}
                  />

                  {hienGoiYBoDiKem && (
                    <div className="danh-sach-combobox-admin">
                      {danhSachGoiYBoDiKem.length === 0 ? (
                        <div className="dong-combobox-admin">Không có gợi ý</div>
                      ) : (
                        danhSachGoiYBoDiKem.map((item) => (
                          <div
                            key={`${item.loai}-${item.id}`}
                            className="dong-combobox-admin"
                            onClick={() => chonGoiYBoDiKem(item)}
                          >
                            <b>{item.ten_hien_thi}</b>
                            <span>{item.mo_ta}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <input
                  className="o-so-luong-tra"
                  type="number"
                  min="1"
                  value={soLuongBoDiKem}
                  onChange={(e) => setSoLuongBoDiKem(e.target.value)}
                />

                <button className="nut-them" onClick={themBoDiKem} disabled={dangGui}>
                  Thêm
                </button>
              </div>

              <h3>Danh sách bộ đi kèm</h3>

              {danhSachBoDiKem.length === 0 ? (
                <p>Chưa có bộ đi kèm.</p>
              ) : (
                <table className="bang-popup bang-gon">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Món đi kèm</th>
                      <th>Thông tin</th>
                      <th>Số lượng</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>

                  <tbody>
                    {danhSachBoDiKem.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{hienThi(layTenBoDiKem(item))}</td>

                        <td>
                          {item.mau_thiet_bi_phu_id
                            ? `${item.ten_hang_thiet_bi_phu || ""} - ${
                                item.ten_danh_muc_thiet_bi_phu || ""
                              }`
                            : `${item.ten_hang_phu_kien || ""} - ${
                                item.ten_danh_muc_phu_kien || ""
                              }`}
                        </td>

                        <td>{hienThi(item.so_luong)}</td>

                        <td>
                          <button
                            className="nut-xoa"
                            onClick={() => xacNhanXoaBoDiKem(item)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
                <button className="nut-dong-y" onClick={popupXacNhan.hanhDong}>
                  Đồng ý
                </button>

                <button
                  className="nut-huy"
                  onClick={() => setPopupXacNhan(null)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {anhDangXem && (
        <div className="popup-nen" onClick={() => setAnhDangXem("")}>
          <div className="popup-anh">
            <img src={anhDangXem} alt="Ảnh đang xem" />
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

export default AdminEquipmentModelList;
