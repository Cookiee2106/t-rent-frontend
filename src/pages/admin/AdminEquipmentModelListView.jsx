import { useEffect, useMemo, useRef, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

const SO_DONG_MOI_TRANG = 10;

const TRANG_THAI_HIEN_THI = 601;
const TRANG_THAI_DA_AN = 602;

function AdminEquipmentModelList() {
  const [danhSachMau, setDanhSachMau] = useState([]);
  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState([]);
  const [danhSachHang, setDanhSachHang] = useState([]);
  const [danhSachNgam, setDanhSachNgam] = useState([]);
  const [danhSachNhuCau, setDanhSachNhuCau] = useState([]);
  const [tyLeCocMacDinh, setTyLeCocMacDinh] = useState(null);

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
    ngam_id: "",
    nhu_cau_ids: [],
    ten_mau: "",
    mo_ta: "",
    gia_thue_ngay: "",
    gia_tri_thiet_bi: "",
    ty_le_coc: "",
  });

  // Chỉ gửi lại ngàm hoặc nhu cầu khi người dùng thực sự thay đổi.
  // Nhờ vậy vẫn cập nhật được mẫu cũ đang gắn dữ liệu đã bị ẩn.
  const [ngamDaThayDoi, setNgamDaThayDoi] = useState(false);
  const [nhuCauDaThayDoi, setNhuCauDaThayDoi] = useState(false);

  // Popup cấu hình nhu cầu dùng chung cho form Thêm và Cập nhật.
  const [hienPopupNhuCau, setHienPopupNhuCau] = useState(false);
  const [tuKhoaNhuCau, setTuKhoaNhuCau] = useState("");
  const [hienGoiYNhuCau, setHienGoiYNhuCau] = useState(false);
  const [nhuCauDangChon, setNhuCauDangChon] = useState(null);

  const [tuKhoaDanhMucForm, setTuKhoaDanhMucForm] = useState("");
  const [hienGoiYDanhMucForm, setHienGoiYDanhMucForm] = useState(false);
  const [tuKhoaHangForm, setTuKhoaHangForm] = useState("");
  const [hienGoiYHangForm, setHienGoiYHangForm] = useState(false);

  const comboDanhMucRef = useRef(null);
  const comboHangRef = useRef(null);
  const comboNhuCauRef = useRef(null);
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
    layLuaChonCauHinhMau();
  }, []);

  useEffect(() => {
    function dongComboboxKhiBamNgoai(e) {
      if (comboDanhMucRef.current && !comboDanhMucRef.current.contains(e.target)) {
        setHienGoiYDanhMucForm(false);
      }

      if (comboHangRef.current && !comboHangRef.current.contains(e.target)) {
        setHienGoiYHangForm(false);
      }

      if (
        comboNhuCauRef.current &&
        !comboNhuCauRef.current.contains(e.target)
      ) {
        setHienGoiYNhuCau(false);
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

  function dinhDangTienNeuCo(giaTri) {
    if (giaTri === undefined || giaTri === null || giaTri === "") {
      return "-";
    }

    return dinhDangTien(giaTri);
  }

  function dinhDangPhanTram(giaTri) {
    if (giaTri === undefined || giaTri === null || giaTri === "") {
      return "-";
    }

    return `${Number(giaTri)}%`;
  }

  function tinhTienCocDuKien() {
    const giaTriThietBi = Number(formMau.gia_tri_thiet_bi);
    const tyLeCoc = Number(formMau.ty_le_coc);

    if (
      !Number.isInteger(giaTriThietBi) ||
      giaTriThietBi < 0 ||
      !Number.isFinite(tyLeCoc) ||
      tyLeCoc < 0 ||
      tyLeCoc > 100
    ) {
      return 0;
    }

    return Math.round(
      giaTriThietBi * tyLeCoc / 100
    );
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

  function laDanhMucCanNgam(danhMucId) {
    const danhMuc = danhSachDanhMuc.find(
      (item) => String(item.id) === String(danhMucId)
    );

    const tenDanhMuc = String(danhMuc?.ten_danh_muc || "")
      .trim()
      .toLowerCase();

    return tenDanhMuc === "máy ảnh" || tenDanhMuc === "ống kính";
  }

  function layDanhSachNhuCauTrongForm() {
    const mapNhuCau = new Map();

    danhSachNhuCau.forEach((item) => {
      mapNhuCau.set(String(item.id), item);
    });

    (mauDangChon?.nhu_cau_su_dung || []).forEach((item) => {
      if (!mapNhuCau.has(String(item.id))) {
        mapNhuCau.set(String(item.id), item);
      }
    });

    return [...mapNhuCau.values()];
  }

  function layDanhSachNhuCauDaChon() {
    const tapId = new Set(
      (formMau.nhu_cau_ids || []).map((id) => String(id))
    );

    return layDanhSachNhuCauTrongForm().filter((item) =>
      tapId.has(String(item.id))
    );
  }

  function layDanhSachGoiYNhuCau() {
    const tapIdDaChon = new Set(
      (formMau.nhu_cau_ids || []).map((id) => String(id))
    );

    const khoa = tuKhoaNhuCau.trim().toLowerCase();

    return danhSachNhuCau.filter((item) => {
      const chuaChon = !tapIdDaChon.has(String(item.id));
      const dungTuKhoa =
        !khoa ||
        `${item.ten_nhu_cau || ""} ${item.mo_ta || ""}`
          .toLowerCase()
          .includes(khoa);

      return chuaChon && dungTuKhoa;
    });
  }

  function doiNgamForm(giaTri) {
    setFormMau({
      ...formMau,
      ngam_id: giaTri,
    });

    setNgamDaThayDoi(true);
  }

  function moPopupCauHinhNhuCau() {
    setTuKhoaNhuCau("");
    setNhuCauDangChon(null);
    setHienGoiYNhuCau(false);
    setHienPopupNhuCau(true);
  }

  function dongPopupCauHinhNhuCau() {
    setHienPopupNhuCau(false);
    setTuKhoaNhuCau("");
    setNhuCauDangChon(null);
    setHienGoiYNhuCau(false);
  }

  function doiTuKhoaNhuCau(giaTri) {
    setTuKhoaNhuCau(giaTri);
    setNhuCauDangChon(null);
    setHienGoiYNhuCau(true);
  }

  function chonGoiYNhuCau(item) {
    setNhuCauDangChon(item);
    setTuKhoaNhuCau(item.ten_nhu_cau || "");
    setHienGoiYNhuCau(false);
  }

  function themNhuCauVaoForm() {
    if (!nhuCauDangChon) {
      moPopupThongBao("Vui lòng chọn nhu cầu");
      return;
    }

    const id = String(nhuCauDangChon.id);
    const danhSachId = (formMau.nhu_cau_ids || []).map(String);

    if (danhSachId.includes(id)) {
      moPopupThongBao("Nhu cầu đã có trong danh sách");
      return;
    }

    setFormMau({
      ...formMau,
      nhu_cau_ids: [...danhSachId, id],
    });

    setNhuCauDaThayDoi(true);
    setTuKhoaNhuCau("");
    setNhuCauDangChon(null);
    setHienGoiYNhuCau(false);
  }

  function xoaNhuCauKhoiForm(nhuCauId) {
    setFormMau({
      ...formMau,
      nhu_cau_ids: (formMau.nhu_cau_ids || [])
        .map(String)
        .filter((id) => id !== String(nhuCauId)),
    });

    setNhuCauDaThayDoi(true);
  }

  function doiTuKhoaDanhMucForm(giaTri) {
    setTuKhoaDanhMucForm(giaTri);
    doiFormMau("danh_muc_id", "");
    setHienGoiYDanhMucForm(true);
  }

  function chonDanhMucForm(danhMuc) {
    const danhMucCuCanNgam = laDanhMucCanNgam(formMau.danh_muc_id);

    const tenDanhMucMoi = String(danhMuc.ten_danh_muc || "")
      .trim()
      .toLowerCase();

    const danhMucMoiCanNgam =
      tenDanhMucMoi === "máy ảnh" || tenDanhMucMoi === "ống kính";

    if (danhMucCuCanNgam !== danhMucMoiCanNgam) {
      setFormMau({
        ...formMau,
        danh_muc_id: danhMuc.id,
        ngam_id: "",
        nhu_cau_ids: [],
      });

      setNgamDaThayDoi(true);
      setNhuCauDaThayDoi(true);
    } else {
      setFormMau({
        ...formMau,
        danh_muc_id: danhMuc.id,
      });
    }

    setTuKhoaDanhMucForm(danhMuc.ten_danh_muc);
    setHienGoiYDanhMucForm(false);
  }

  function doiTuKhoaHangForm(giaTri) {
    setTuKhoaHangForm(giaTri);

    setFormMau({
      ...formMau,
      hang_id: "",
      ngam_id: "",
    });

    setNgamDaThayDoi(true);
    setHienGoiYHangForm(true);
  }

  function chonHangForm(hang) {
    const ngamHienTai = danhSachNgam.find(
      (item) => String(item.id) === String(formMau.ngam_id)
    );

    const ngamConDungHang =
      ngamHienTai &&
      String(ngamHienTai.hang_so_huu_id) === String(hang.id);

    setFormMau({
      ...formMau,
      hang_id: hang.id,
      ngam_id: ngamConDungHang ? formMau.ngam_id : "",
    });

    if (!ngamConDungHang) {
      setNgamDaThayDoi(true);
    }

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

  async function layLuaChonCauHinhMau() {
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
        setDanhSachNhuCau(duLieu.data?.nhu_cau || []);

        const tyLeMacDinh = Number(
          duLieu.data?.ty_le_coc_mac_dinh
        );

        if (
          Number.isFinite(tyLeMacDinh) &&
          tyLeMacDinh >= 0 &&
          tyLeMacDinh <= 100
        ) {
          setTyLeCocMacDinh(tyLeMacDinh);
        }
      }
    } catch {
      // Không chặn màn hình nếu ngàm hoặc nhu cầu chưa tải được.
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
      ngam_id: "",
      nhu_cau_ids: [],
      ten_mau: "",
      mo_ta: "",
      gia_thue_ngay: "",
      gia_tri_thiet_bi: "",
      ty_le_coc: tyLeCocMacDinh === null ? "" : String(tyLeCocMacDinh),
    });

    setNgamDaThayDoi(true);
    setNhuCauDaThayDoi(true);
    setHienPopupNhuCau(false);
    setTuKhoaNhuCau("");
    setNhuCauDangChon(null);

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
      ngam_id: mau.ngam_id || "",
      nhu_cau_ids: (mau.nhu_cau_su_dung || [])
        .map((item) => String(item.id))
        .filter(Boolean),
      ten_mau: mau.ten_mau || "",
      mo_ta: mau.mo_ta || "",
      gia_thue_ngay: mau.gia_thue_ngay ?? "",
      gia_tri_thiet_bi: mau.gia_tri_thiet_bi ?? "",
      ty_le_coc:
        mau.ty_le_coc ?? (tyLeCocMacDinh === null ? "" : String(tyLeCocMacDinh)),
    });

    setNgamDaThayDoi(false);
    setNhuCauDaThayDoi(false);
    setHienPopupNhuCau(false);
    setTuKhoaNhuCau("");
    setNhuCauDangChon(null);

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
    setNgamDaThayDoi(false);
    setNhuCauDaThayDoi(false);
    setHienPopupNhuCau(false);
    setTuKhoaNhuCau("");
    setNhuCauDangChon(null);
    setHienGoiYNhuCau(false);
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

    if (laDanhMucCanNgam(formMau.danh_muc_id)) {
      if (!formMau.ngam_id) {
        moPopupThongBao("Vui lòng chọn ngàm");
        return false;
      }

      if (!formMau.nhu_cau_ids || formMau.nhu_cau_ids.length === 0) {
        moPopupThongBao("Vui lòng chọn ít nhất một nhu cầu sử dụng");
        return false;
      }
    }

    if (Number(formMau.gia_thue_ngay || 0) < 0) {
      moPopupThongBao("Giá thuê không hợp lệ");
      return false;
    }

    if (
      formMau.gia_tri_thiet_bi === "" ||
      !Number.isInteger(Number(formMau.gia_tri_thiet_bi)) ||
      Number(formMau.gia_tri_thiet_bi) < 0
    ) {
      moPopupThongBao("Giá trị thiết bị phải là số nguyên lớn hơn hoặc bằng 0");
      return false;
    }

    if (
      formMau.ty_le_coc === "" ||
      !Number.isFinite(Number(formMau.ty_le_coc)) ||
      Number(formMau.ty_le_coc) < 0 ||
      Number(formMau.ty_le_coc) > 100
    ) {
      moPopupThongBao("Tỷ lệ tiền cọc phải từ 0 đến 100");
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
      formData.append("gia_tri_thiet_bi", Number(formMau.gia_tri_thiet_bi));
      formData.append("ty_le_coc", Number(formMau.ty_le_coc));

      const danhMucCanNgam = laDanhMucCanNgam(formMau.danh_muc_id);

      // Khi thêm luôn gửi ngàm và nhu cầu.
      // Khi cập nhật chỉ gửi nếu người dùng thực sự thay đổi.
      if (danhMucCanNgam && (laThem || ngamDaThayDoi)) {
        formData.append("ngam_id", formMau.ngam_id);
      }

      if (danhMucCanNgam && (laThem || nhuCauDaThayDoi)) {
        formData.append(
          "nhu_cau_ids",
          JSON.stringify(formMau.nhu_cau_ids || [])
        );
      }

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
      await layGoiYBoDiKem(mau.id, "", mau);
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

  function chuanHoaTenHang(giaTri) {
    return String(giaTri || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function laDanhMucTheNho(item) {
    return (
      chuanHoaTenHang(item?.ten_danh_muc) ===
      chuanHoaTenHang("Thẻ nhớ")
    );
  }

  function laBoDiKemHopLe(item, mauChinh) {
    if (!mauChinh) {
      return false;
    }

    // Riêng Thẻ nhớ: lấy tất cả, không phân biệt hãng.
    if (laDanhMucTheNho(item)) {
      return true;
    }

    const itemKhongCoHang =
      !item?.hang_id && !chuanHoaTenHang(item?.ten_hang);

    // Thiết bị phụ hoặc phụ kiện không gán hãng vẫn được lấy.
    if (itemKhongCoHang) {
      return true;
    }

    // Nếu cả hai bên có id hãng thì so sánh theo id.
    if (item.hang_id && mauChinh.hang_id) {
      return String(item.hang_id) === String(mauChinh.hang_id);
    }

    // Trường hợp API chỉ trả tên hãng thì so sánh tên đã chuẩn hóa.
    return (
      chuanHoaTenHang(item.ten_hang) ===
      chuanHoaTenHang(mauChinh.ten_hang)
    );
  }

  function gomGoiYBoDiKem(data, mauChinh) {
    const thietBiPhu = (data?.thiet_bi_phu || [])
      .filter((item) => laBoDiKemHopLe(item, mauChinh))
      .map((item) => ({
        id: item.id,
        loai: "THIET_BI_PHU",
        ten_hien_thi: item.ten_mau,
        mo_ta: `${item.ten_hang || "Không có hãng"} - ${
          item.ten_danh_muc || ""
        }`,
        mau_thiet_bi_phu_id: item.id,
        phu_kien_id: null,
      }));

    // Phụ kiện không còn lọc theo hãng ở Frontend.
    // Backend là nguồn sự thật:
    // chỉ Cáp sau của Ống kính mới được lọc theo cùng ngàm.
    const phuKien = (data?.phu_kien || []).map((item) => ({
      id: item.id,
      loai: "PHU_KIEN",
      ten_hien_thi: item.ten_phu_kien,
      mo_ta: `${item.ten_danh_muc || ""}${
        item.ten_ngam ? ` - Ngàm ${item.ten_ngam}` : ""
      }`,
      mau_thiet_bi_phu_id: null,
      phu_kien_id: item.id,
    }));

    return [...thietBiPhu, ...phuKien];
  }

  async function layGoiYBoDiKem(mauId, tuKhoaTim, mauChinh = mauDangChon) {
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

    setDanhSachGoiYBoDiKem(gomGoiYBoDiKem(duLieu.data || {}, mauChinh));
  }

  async function doiTuKhoaBoDiKem(giaTri) {
    setTuKhoaBoDiKem(giaTri);
    setBoDiKemDangChon(null);
    setHienGoiYBoDiKem(true);

    if (!mauDangChon) return;

    try {
      await layGoiYBoDiKem(mauDangChon.id, giaTri, mauDangChon);
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
        await layGoiYBoDiKem(mauDangChon.id, "", mauDangChon);
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
        await layGoiYBoDiKem(mauDangChon.id, "", mauDangChon);
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
              <th>Giá trị thiết bị</th>
              <th>Tỷ lệ cọc</th>
              <th>Tiền cọc</th>
              <th>Sẵn sàng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {dangTai ? (
              <tr>
                <td colSpan="12" style={{ textAlign: "center" }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : danhSachHienThi.length === 0 ? (
              <tr>
                <td colSpan="12" style={{ textAlign: "center" }}>
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
                  <td>{dinhDangTienNeuCo(mau.gia_tri_thiet_bi)}</td>
                  <td>{dinhDangPhanTram(mau.ty_le_coc)}</td>
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
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <img
                    src={chiTietMau.anh_url}
                    alt={chiTietMau.ten_mau}
                    onClick={() => setAnhDangXem(chiTietMau.anh_url)}
                    style={{
                      width: "460px",
                      maxWidth: "100%",
                      height: "300px",
                      display: "block",
                      objectFit: "contain",
                      margin: "0 auto",
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      background: "white",
                      cursor: "pointer",
                    }}
                  />
                </div>
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
                    <td>Ngàm</td>
                    <td>
                      {chiTietMau.ten_ngam ? (
                        <>
                          {chiTietMau.ten_ngam}
                          {Number(chiTietMau.trang_thai_ngam) ===
                          TRANG_THAI_DA_AN
                            ? " (Đã ẩn)"
                            : ""}
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td>Nhu cầu sử dụng</td>
                    <td>
                      {(chiTietMau.nhu_cau_su_dung || []).length === 0 ? (
                        "-"
                      ) : (
                        <div className="danh-sach-chip-nhu-cau-admin">
                          {(chiTietMau.nhu_cau_su_dung || []).map((item) => (
                            <span
                              key={item.id}
                              className={
                                Number(item.trang_thai) ===
                                TRANG_THAI_DA_AN
                                  ? "chip-nhu-cau-admin chip-nhu-cau-da-an"
                                  : "chip-nhu-cau-admin"
                              }
                            >
                              {item.ten_nhu_cau}
                              {Number(item.trang_thai) ===
                              TRANG_THAI_DA_AN
                                ? " (Đã ẩn)"
                                : ""}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td>Giá thuê/ngày</td>
                    <td>{dinhDangTien(chiTietMau.gia_thue_ngay)}</td>
                  </tr>

                  <tr>
                    <td>Giá trị thiết bị</td>
                    <td>{dinhDangTienNeuCo(chiTietMau.gia_tri_thiet_bi)}</td>
                  </tr>

                  <tr>
                    <td>Tỷ lệ tiền cọc</td>
                    <td>{dinhDangPhanTram(chiTietMau.ty_le_coc)}</td>
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
                    <td
                      style={{
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                      }}
                    >
                      {hienThi(chiTietMau.mo_ta)}
                    </td>
                  </tr>

                  {/* <tr>
                    <td>Ngày tạo</td>
                    <td>{dinhDangNgay(chiTietMau.created_at)}</td>
                  </tr> */}
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

                {laDanhMucCanNgam(formMau.danh_muc_id) && (
                  <>
                    <div className="o-form">
                      <label>Ngàm</label>

                      <select
                        value={formMau.ngam_id}
                        onChange={(e) => doiNgamForm(e.target.value)}
                      >
                        <option value="">-- Chọn ngàm --</option>

                        {mauDangChon?.ngam_id &&
                          !danhSachNgam.some(
                            (item) =>
                              String(item.id) ===
                              String(mauDangChon.ngam_id)
                          ) && (
                            <option
                              value={mauDangChon.ngam_id}
                              disabled
                            >
                              {mauDangChon.ten_ngam || "Ngàm cũ"} - Đã ẩn
                            </option>
                          )}

                        {danhSachNgam
                          .filter(
                            (ngam) =>
                              !formMau.hang_id ||
                              String(ngam.hang_so_huu_id) ===
                                String(formMau.hang_id)
                          )
                          .map((ngam) => (
                            <option key={ngam.id} value={ngam.id}>
                              {ngam.ten_ngam}
                            </option>
                          ))}
                      </select>

                      <small className="ghi-chu-o-form">
                        Ngàm dùng nội bộ để kiểm tra ống kính tương thích.
                      </small>
                    </div>

                  </>
                )}

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
                  <label>Giá trị thiết bị</label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formMau.gia_tri_thiet_bi}
                    onChange={(e) =>
                      doiFormMau("gia_tri_thiet_bi", e.target.value)
                    }
                  />
                </div>

                <div className="o-form">
                  <label>Tỷ lệ tiền cọc (%)</label>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formMau.ty_le_coc}
                    onChange={(e) =>
                      doiFormMau("ty_le_coc", e.target.value)
                    }
                  />

                  <small className="ghi-chu-o-form">
                    Mặc định: {tyLeCocMacDinh === null ? "-" : `${tyLeCocMacDinh}%`}.
                  </small>
                </div>

                <div className="o-form">
                  <label>Tiền cọc dự kiến</label>

                  <input
                    type="text"
                    value={dinhDangTien(tinhTienCocDuKien())}
                    readOnly
                  />

                </div>

                <div className="o-form">
                  <label>Mô tả</label>

                  <textarea
                    value={formMau.mo_ta}
                    onChange={(e) => doiFormMau("mo_ta", e.target.value)}
                  />
                </div>

                {laDanhMucCanNgam(formMau.danh_muc_id) && (
                  <div className="o-form o-form-nhu-cau-su-dung">
                    <label>Nhu cầu sử dụng</label>

                    <div className="hang-cau-hinh-nhu-cau-form">
                      <button
                        type="button"
                        className={
                          cheDoPopup === "THEM"
                            ? "nut-them"
                            : "nut-cap-nhat-popup"
                        }
                        onClick={moPopupCauHinhNhuCau}
                      >
                        {cheDoPopup === "THEM"
                          ? "Thêm nhu cầu"
                          : "Cập nhật nhu cầu"}
                      </button>

                      <span className="so-luong-nhu-cau-da-chon">
                        Đã chọn{" "}
                        <b>{(formMau.nhu_cau_ids || []).length}</b> nhu cầu
                      </span>
                    </div>

                    {(formMau.nhu_cau_ids || []).length === 0 && (
                      <small className="ghi-chu-o-form">
                        Máy ảnh và ống kính bắt buộc có ít nhất một nhu cầu sử dụng.
                      </small>
                    )}
                  </div>
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

                  <button className="nut-huy" type="button" onClick={dongPopup}>
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {hienPopupNhuCau && (
        <div className="popup-nen popup-nen-cap-hai">
          <div
            className={
              cheDoPopup === "CAP_NHAT"
                ? "popup-hop popup-cau-hinh-nhu-cau popup-nhu-cau-cap-nhat-rong"
                : layDanhSachNhuCauDaChon().length === 0
                ? "popup-hop popup-cau-hinh-nhu-cau popup-nhu-cau-chua-co-du-lieu"
                : "popup-hop popup-cau-hinh-nhu-cau"
            }
          >
            <div className="popup-tieu-de">
              <h3>
                Nhu cầu của {formMau.ten_mau.trim() || "mẫu thiết bị"}
              </h3>

              <button
                type="button"
                className="nut-dong-popup"
                onClick={dongPopupCauHinhNhuCau}
              >
                Đóng
              </button>
            </div>

            <div className="popup-noi-dung">
              <div className="khung-them-nhu-cau">
                <div className="combobox-admin" ref={comboNhuCauRef}>
                  <input
                    value={tuKhoaNhuCau}
                    placeholder="Tìm và chọn nhu cầu"
                    onFocus={() => setHienGoiYNhuCau(true)}
                    onChange={(e) => doiTuKhoaNhuCau(e.target.value)}
                  />

                  {hienGoiYNhuCau && (
                    <div className="danh-sach-combobox-admin">
                      {layDanhSachGoiYNhuCau().length === 0 ? (
                        <div className="dong-combobox-admin">
                          Không có gợi ý
                        </div>
                      ) : (
                        layDanhSachGoiYNhuCau().map((item) => (
                          <div
                            key={item.id}
                            className="dong-combobox-admin"
                            onClick={() => chonGoiYNhuCau(item)}
                          >
                            <b>{item.ten_nhu_cau}</b>
                            <span>{item.mo_ta || "Không có mô tả"}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="nut-them"
                  onClick={themNhuCauVaoForm}
                >
                  Thêm
                </button>
              </div>

              <h3>Danh sách nhu cầu đã chọn</h3>

              {layDanhSachNhuCauDaChon().length === 0 ? (
                <p>Chưa có nhu cầu sử dụng.</p>
              ) : (
                <div className="admin-bang-wrapper">
                  <table className="bang-popup bang-gon bang-nhu-cau-popup">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Tên nhu cầu</th>
                        <th>Mô tả</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>

                    <tbody>
                      {layDanhSachNhuCauDaChon().map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{item.ten_nhu_cau}</td>
                          <td className="cot-mo-ta-nhu-cau-popup">
                            {item.mo_ta || "-"}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="nut-xoa"
                              onClick={() => xoaNhuCauKhoiForm(item.id)}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
                <table className="bang-popup bang-gon bang-bo-di-kem-popup">
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
                            : `${item.ten_danh_muc_phu_kien || ""}${
                                item.ten_ngam_phu_kien
                                  ? ` - Ngàm ${item.ten_ngam_phu_kien}`
                                  : ""
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