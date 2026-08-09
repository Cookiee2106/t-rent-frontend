import { useEffect, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

const SO_DONG_MOI_TRANG = 10;
const SO_ANH_MOI_DONG = 5;

const TRANG_THAI_DANG_THUE = 1103;
const TRANG_THAI_HOAN_THANH = 1104;
const TRANG_THAI_QUA_HAN = 1105;

const TRANG_THAI_TB_SAN_SANG = 501;
const TRANG_THAI_TB_BAO_TRI = 503;
const TRANG_THAI_TB_BI_MAT = 505;

const MUC_DICH_HOP_DONG_GIAY = 2601;
const MUC_DICH_ANH_BAN_GIAO = 2602;
const MUC_DICH_ANH_KHI_TRA = 2603;

function SettlementList() {
  const [danhSachDon, setDanhSachDon] = useState([]);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [tongTrang, setTongTrang] = useState(1);
  const [tuKhoa, setTuKhoa] = useState("");
  const [trangThaiLoc, setTrangThaiLoc] = useState("0");
  const [dangTai, setDangTai] = useState(false);

  const [chiTietThanhLy, setChiTietThanhLy] = useState(null);
  const [cheDoPopup, setCheDoPopup] = useState("");
  const [dangTaiChiTiet, setDangTaiChiTiet] = useState(false);

  const [hinhThucXuLyCoc, setHinhThucXuLyCoc] = useState("HOAN_COC");
  const [soTien, setSoTien] = useState("");
  const [ghiChuThanhLy, setGhiChuThanhLy] = useState("");
  const [anhKhiTra, setAnhKhiTra] = useState([]);
  const [danhSachKiemTraVatPham, setDanhSachKiemTraVatPham] = useState([]);
  const [dangGui, setDangGui] = useState(false);

  const [anhDangXem, setAnhDangXem] = useState("");
  const [popupThongBao, setPopupThongBao] = useState("");

  useEffect(() => {
    layDanhSachThanhLy();
  }, [trangHienTai, tuKhoa, trangThaiLoc]);

  function moPopupThongBao(noiDung) {
    setPopupThongBao(noiDung || "Có lỗi xảy ra");
  }

  function dinhDangTien(giaTri) {
    return Number(giaTri || 0).toLocaleString("vi-VN") + " đ";
  }

  function dinhDangNgay(giaTri) {
    if (!giaTri) return "-";
    return new Date(giaTri).toLocaleDateString("vi-VN");
  }

  function hienThi(giaTri) {
    return giaTri || "-";
  }

  function layKetQuaThanhLyDaChon(don) {
    if (
      !don ||
      (Number(don.trang_thai) !== TRANG_THAI_HOAN_THANH && !don.tra_luc)
    ) {
      return null;
    }

    const tienPhuThu = Number(don.tien_da_phu_thu || 0);
    const tienKhauTru = Number(don.tien_da_khau_tru || 0);
    const tienHoanCoc = Number(don.tien_da_hoan_coc || 0);

    if (tienPhuThu > 0) {
      return {
        ten: "Phụ thu",
        so_tien: tienPhuThu,
      };
    }

    if (tienKhauTru > 0) {
      return {
        ten: "Khấu trừ cọc",
        so_tien: tienKhauTru,
      };
    }

    if (tienHoanCoc > 0) {
      return {
        ten: "Hoàn cọc",
        so_tien: tienHoanCoc,
      };
    }

    return null;
  }

  function laFileAnh(file) {
    if (!file) return false;
    if (file.loai_file && file.loai_file.startsWith("image/")) return true;

    const url = String(file.file_url || "").toLowerCase();
    return (
      url.endsWith(".jpg") ||
      url.endsWith(".jpeg") ||
      url.endsWith(".png") ||
      url.endsWith(".webp")
    );
  }

  function layClassTrangThaiDon(trangThaiId) {
    const id = Number(trangThaiId);

    if (id === TRANG_THAI_DANG_THUE) return "trang-thai-badge trang-thai-xanh-duong";
    if (id === TRANG_THAI_HOAN_THANH) return "trang-thai-badge trang-thai-xanh";
    if (id === TRANG_THAI_QUA_HAN) return "trang-thai-badge trang-thai-cam";

    return "trang-thai-badge trang-thai-xam";
  }

  function hienThiTrangThaiDon(trangThaiId, tenTrangThai) {
    return (
      <span className={layClassTrangThaiDon(trangThaiId)}>
        {tenTrangThai || trangThaiId || "-"}
      </span>
    );
  }

  function coTheThanhLy(don) {
    const trangThai = Number(don?.trang_thai);
    return trangThai === TRANG_THAI_DANG_THUE || trangThai === TRANG_THAI_QUA_HAN;
  }

  async function layDanhSachThanhLy() {
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
        `${DUONG_DAN_API}/api/admin/settlements?${params.toString()}`,
        {
          headers: taoHeaderCoToken(),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        const tongSoDong = Number(duLieu.total || 0);
        setDanhSachDon(duLieu.data || []);
        setTongTrang(Math.max(1, Math.ceil(tongSoDong / SO_DONG_MOI_TRANG)));
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    } finally {
      setDangTai(false);
    }
  }

  async function layChiTietDon(donThueId, cheDo) {
    try {
      setDangTaiChiTiet(true);
      setCheDoPopup(cheDo);
      setChiTietThanhLy(null);
      resetFormThanhLy();

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/settlements/${donThueId}`,
        {
          headers: taoHeaderCoToken(),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setChiTietThanhLy(duLieu.data);

        if (cheDo === "THANH_LY") {
          setDanhSachKiemTraVatPham(taoDanhSachKiemTraMacDinh(duLieu.data));
        }
      } else {
        setCheDoPopup("");
        moPopupThongBao(duLieu.message);
      }
    } catch {
      setCheDoPopup("");
      moPopupThongBao("Không kết nối được server");
    } finally {
      setDangTaiChiTiet(false);
    }
  }

  function xemChiTiet(donThueId) {
    layChiTietDon(donThueId, "CHI_TIET");
  }

  function lapPhieuTra(donThueId) {
    layChiTietDon(donThueId, "THANH_LY");
  }

  function resetFormThanhLy() {
    setHinhThucXuLyCoc("HOAN_COC");
    setSoTien("");
    setGhiChuThanhLy("");
    setAnhKhiTra([]);
    setDanhSachKiemTraVatPham([]);
  }

  function dongPopup() {
    setChiTietThanhLy(null);
    setCheDoPopup("");
    resetFormThanhLy();
  }

  function taoKeyPhuKien(item) {
    const banGiaoVatPhamId =
      item.ban_giao_vat_pham_id || item.id || null;

    if (banGiaoVatPhamId) {
      return `BGVP_${banGiaoVatPhamId}`;
    }

    return `${item.chi_tiet_don_thue_id}_${item.bo_di_kem_id || ""}_${item.phu_kien_id}_${item.phu_kien_vi_tri_kho_id || ""}`;
  }

  function taoDanhSachKiemTraMacDinh(chiTiet) {
    const danhSach = [];

    for (const sanPham of chiTiet?.san_pham_kem_serial || []) {
      const thietBiChinh = sanPham.thiet_bi_chinh || [];
      const boDiKem = sanPham.bo_di_kem || [];

      for (const vatPham of [...thietBiChinh, ...boDiKem]) {
        if (vatPham.thiet_bi_id) {
          danhSach.push({
            loai_kiem_tra: "THIET_BI",
            thiet_bi_id: vatPham.thiet_bi_id,
            chi_tiet_don_thue_id: sanPham.chi_tiet_don_thue_id,
            bo_di_kem_id: vatPham.bo_di_kem_id || null,
            phu_kien_id: null,
            trang_thai_sau_tra: String(TRANG_THAI_TB_SAN_SANG),
            ly_do_bao_tri: "",
            so_luong_giao: Number(vatPham.so_luong_giao || 1),
            so_luong_tra_lai: Number(vatPham.so_luong_giao || 1),
          });
        }

        if (!vatPham.thiet_bi_id && vatPham.phu_kien_id) {
          danhSach.push({
            loai_kiem_tra: "PHU_KIEN",
            ban_giao_vat_pham_id: vatPham.id,
            thiet_bi_id: null,
            chi_tiet_don_thue_id: sanPham.chi_tiet_don_thue_id,
            bo_di_kem_id: vatPham.bo_di_kem_id || null,
            phu_kien_id: vatPham.phu_kien_id,
            phu_kien_vi_tri_kho_id: vatPham.phu_kien_vi_tri_kho_id || null,
            trang_thai_sau_tra: "",
            so_luong_giao: Number(vatPham.so_luong_giao || 1),
            so_luong_tra_lai: Number(vatPham.so_luong_giao || 1),
          });
        }
      }
    }

    return danhSach;
  }

  function timIndexKiemTra(vatPham, sanPham) {
    if (vatPham.thiet_bi_id) {
      return danhSachKiemTraVatPham.findIndex(
        (item) => item.loai_kiem_tra === "THIET_BI" && item.thiet_bi_id === vatPham.thiet_bi_id
      );
    }

    if (vatPham.phu_kien_id) {
      const keyCanTim = taoKeyPhuKien({
        id: vatPham.id,
        chi_tiet_don_thue_id: sanPham.chi_tiet_don_thue_id,
        bo_di_kem_id: vatPham.bo_di_kem_id || null,
        phu_kien_id: vatPham.phu_kien_id,
        phu_kien_vi_tri_kho_id: vatPham.phu_kien_vi_tri_kho_id || null,
      });

      return danhSachKiemTraVatPham.findIndex((item) => {
        if (item.loai_kiem_tra !== "PHU_KIEN") return false;
        return taoKeyPhuKien(item) === keyCanTim;
      });
    }

    return -1;
  }

  function doiKiemTraVatPham(index, field, value) {
    setDanhSachKiemTraVatPham(
      danhSachKiemTraVatPham.map((item, viTri) => {
        if (viTri !== index) return item;

        return {
          ...item,
          [field]: value,
        };
      })
    );
  }

  function themAnhKhiTra(e) {
    const filesMoi = Array.from(e.target.files || []);
    const danhSachMoi = [...anhKhiTra, ...filesMoi];

    if (danhSachMoi.length > 10) {
      moPopupThongBao("Chỉ được chọn tối đa 10 ảnh khi trả");
      e.target.value = "";
      return;
    }

    setAnhKhiTra(danhSachMoi);
    e.target.value = "";
  }

  function xoaAnhKhiTra(index) {
    setAnhKhiTra(anhKhiTra.filter((_, viTri) => viTri !== index));
  }

  function tinhTienTamTinh() {
    const tienCoc = Number(chiTietThanhLy?.tien_coc_da_thanh_toan || 0);
    const tienNhap = Number(soTien || 0);

    if (hinhThucXuLyCoc === "HOAN_COC") {
      return { hoanCoc: tienCoc, khauTru: 0, phuThu: 0 };
    }

    if (hinhThucXuLyCoc === "KHAU_TRU_COC") {
      return {
        hoanCoc: tienCoc - tienNhap > 0 ? tienCoc - tienNhap : 0,
        khauTru: tienNhap,
        phuThu: 0,
      };
    }

    return { hoanCoc: 0, khauTru: tienCoc, phuThu: tienNhap };
  }

  function kiemTraFormThanhLy() {
    if (!chiTietThanhLy) {
      moPopupThongBao("Chưa chọn đơn thanh lý");
      return false;
    }

    if (!ghiChuThanhLy.trim()) {
      moPopupThongBao("Vui lòng nhập ghi chú thanh lý");
      return false;
    }

    if (hinhThucXuLyCoc !== "HOAN_COC" && Number(soTien || 0) <= 0) {
      moPopupThongBao("Vui lòng nhập số tiền xử lý cọc");
      return false;
    }

    if (hinhThucXuLyCoc === "KHAU_TRU_COC") {
      const tienCoc = Number(chiTietThanhLy?.tien_coc_da_thanh_toan || 0);

      if (Number(soTien || 0) > tienCoc) {
        moPopupThongBao("Số tiền khấu trừ không được lớn hơn tiền cọc");
        return false;
      }
    }

    for (const item of danhSachKiemTraVatPham) {
      if (
        item.loai_kiem_tra === "THIET_BI" &&
        Number(item.trang_thai_sau_tra) === TRANG_THAI_TB_BAO_TRI &&
        !String(item.ly_do_bao_tri || "").trim()
      ) {
        moPopupThongBao("Vui lòng nhập lý do bảo trì cho từng thiết bị chọn Bảo trì");
        return false;
      }

      if (item.loai_kiem_tra === "PHU_KIEN") {
        const soLuongTraLai = Number(item.so_luong_tra_lai);
        const soLuongGiao = Number(item.so_luong_giao);

        if (!Number.isInteger(soLuongTraLai) || soLuongTraLai < 0) {
          moPopupThongBao("Số lượng phụ kiện trả lại không hợp lệ");
          return false;
        }

        if (soLuongTraLai > soLuongGiao) {
          moPopupThongBao("Số lượng phụ kiện trả lại không được lớn hơn số lượng giao");
          return false;
        }
      }
    }

    if (anhKhiTra.length === 0) {
      moPopupThongBao("Vui lòng chọn ít nhất 1 ảnh khi trả");
      return false;
    }

    return true;
  }

  async function guiThanhLy(e) {
    e.preventDefault();

    if (!kiemTraFormThanhLy()) return;

    try {
      setDangGui(true);

      const danhSachThietBi = danhSachKiemTraVatPham
        .filter((item) => item.loai_kiem_tra === "THIET_BI")
        .map((item) => ({
          thiet_bi_id: item.thiet_bi_id,
          trang_thai_sau_tra: Number(item.trang_thai_sau_tra),
          ly_do_bao_tri: String(item.ly_do_bao_tri || "").trim(),
        }));

      const danhSachPhuKien = danhSachKiemTraVatPham
        .filter((item) => item.loai_kiem_tra === "PHU_KIEN")
        .map((item) => ({
          ban_giao_vat_pham_id: item.ban_giao_vat_pham_id,
          chi_tiet_don_thue_id: item.chi_tiet_don_thue_id,
          bo_di_kem_id: item.bo_di_kem_id,
          phu_kien_id: item.phu_kien_id,
          phu_kien_vi_tri_kho_id: item.phu_kien_vi_tri_kho_id || null,
          so_luong_tra_lai: Number(item.so_luong_tra_lai),
        }));

      const formData = new FormData();
      formData.append("hinh_thuc_xu_ly_coc", hinhThucXuLyCoc);
      formData.append("so_tien", soTien || 0);
      formData.append("ghi_chu_thanh_ly", ghiChuThanhLy.trim());
      formData.append("kiem_tra_thiet_bi", JSON.stringify(danhSachThietBi));
      formData.append("kiem_tra_phu_kien", JSON.stringify(danhSachPhuKien));

      for (const file of anhKhiTra) {
        formData.append("anh_khi_tra", file);
      }

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/settlements/${chiTietThanhLy.id}/return`,
        {
          method: "POST",
          headers: taoHeaderCoToken(),
          body: formData,
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        moPopupThongBao("Lập phiếu trả/thanh lý thành công");
        dongPopup();
        layDanhSachThanhLy();
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    } finally {
      setDangGui(false);
    }
  }

  function locTep(mucDichId) {
    return (chiTietThanhLy?.tep_don_thue || []).filter(
      (file) => Number(file.muc_dich_id) === mucDichId
    );
  }

  function renderNhomAnh(tieuDe, danhSachFile) {
    return (
      <div className="khoi-anh-thanh-ly">
        <h4>{tieuDe}</h4>

        {danhSachFile.length === 0 ? (
          <p>Chưa có ảnh/file.</p>
        ) : (
          <div
            className="luoi-anh-thanh-ly"
            style={{ gridTemplateColumns: `repeat(${SO_ANH_MOI_DONG}, 1fr)` }}
          >
            {danhSachFile.map((file) => (
              <div
                className="the-anh-thanh-ly"
                key={file.id}
                onClick={() => {
                  if (laFileAnh(file)) {
                    setAnhDangXem(file.file_url);
                  } else {
                    window.open(file.file_url, "_blank");
                  }
                }}
              >
                {laFileAnh(file) ? (
                  <img src={file.file_url} alt="Ảnh đơn thuê" />
                ) : (
                  <div className="tep-khong-phai-anh">Mở file</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function renderAnhDangChon() {
    if (anhKhiTra.length === 0) return null;

    return (
      <div
        className="luoi-anh-thanh-ly"
        style={{ gridTemplateColumns: `repeat(${SO_ANH_MOI_DONG}, 1fr)` }}
      >
        {anhKhiTra.map((file, index) => {
          const url = URL.createObjectURL(file);

          return (
            <div className="the-anh-thanh-ly co-nut-xoa" key={`${file.name}-${index}`}>
              <img
                src={url}
                alt="Ảnh khi trả"
                onClick={() => setAnhDangXem(url)}
              />

              <button
                className="nut-do nut-xoa-anh-thanh-ly"
                type="button"
                onClick={() => xoaAnhKhiTra(index)}
              >
                Xóa ảnh
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  function renderThongTinDon() {
    if (!chiTietThanhLy) return null;

    return (
      <>
        <h3>Thông tin đơn thuê</h3>

        <table className="bang-popup">
          <tbody>
            <tr>
              <td>Mã đơn</td>
              <td>{hienThi(chiTietThanhLy.ma_don)}</td>
            </tr>
            <tr>
              <td>Khách hàng</td>
              <td>{hienThi(chiTietThanhLy.ten_khach_hang)}</td>
            </tr>
            <tr>
              <td>Số điện thoại</td>
              <td>{hienThi(chiTietThanhLy.sdt_khach_hang)}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{hienThi(chiTietThanhLy.email_khach_hang)}</td>
            </tr>
            <tr>
              <td>Ngày nhận</td>
              <td>{dinhDangNgay(chiTietThanhLy.ngay_nhan)}</td>
            </tr>
            <tr>
              <td>Ngày trả dự kiến</td>
              <td>{dinhDangNgay(chiTietThanhLy.ngay_tra)}</td>
            </tr>
            <tr>
              <td>Tổng tiền thuê</td>
              <td>{dinhDangTien(chiTietThanhLy.tong_tien_thue)}</td>
            </tr>
            <tr>
              <td>Tổng tiền cọc</td>
              <td>{dinhDangTien(chiTietThanhLy.tong_tien_coc)}</td>
            </tr>
            <tr>
              <td>Trạng thái</td>
              <td>{hienThiTrangThaiDon(chiTietThanhLy.trang_thai, chiTietThanhLy.ten_trang_thai)}</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }

  function renderThongTinBanGiaoThanhLy() {
    if (!chiTietThanhLy) return null;

    return (
      <>
        <h3>Thông tin bàn giao / thanh lý</h3>

        <table className="bang-popup">
          <tbody>
            <tr>
              <td>Thời điểm bàn giao</td>
              <td>{dinhDangNgay(chiTietThanhLy.ban_giao_luc)}</td>
            </tr>
            <tr>
              <td>Nhân viên bàn giao</td>
              <td>{hienThi(chiTietThanhLy.ten_nguoi_ban_giao)}</td>
            </tr>
            <tr>
              <td>Ghi chú bàn giao</td>
              <td>{hienThi(chiTietThanhLy.ghi_chu_ban_giao)}</td>
            </tr>
            <tr>
              <td>Thời điểm trả</td>
              <td>{dinhDangNgay(chiTietThanhLy.tra_luc)}</td>
            </tr>
            <tr>
              <td>Nhân viên nhận trả</td>
              <td>{hienThi(chiTietThanhLy.ten_nguoi_nhan_tra)}</td>
            </tr>
            <tr>
              <td>Ghi chú thanh lý</td>
              <td>{hienThi(chiTietThanhLy.ghi_chu_thanh_ly)}</td>
            </tr>
            {(() => {
              const ketQuaThanhLy = layKetQuaThanhLyDaChon(chiTietThanhLy);

              if (!ketQuaThanhLy) return null;

              return (
                <tr>
                  <td>{ketQuaThanhLy.ten}</td>
                  <td>{dinhDangTien(ketQuaThanhLy.so_tien)}</td>
                </tr>
              );
            })()}
          </tbody>
        </table>
      </>
    );
  }


  function renderThongTinThanhLyGon() {
    if (!chiTietThanhLy) return null;

    return (
      <>
        <h3>Thông tin đơn thuê</h3>

        <table className="bang-popup">
          <tbody>
            <tr>
              <td>Mã đơn</td>
              <td>{hienThi(chiTietThanhLy.ma_don)}</td>
            </tr>
            <tr>
              <td>Khách hàng</td>
              <td>{hienThi(chiTietThanhLy.ten_khach_hang)}</td>
            </tr>
            <tr>
              <td>Số điện thoại</td>
              <td>{hienThi(chiTietThanhLy.sdt_khach_hang)}</td>
            </tr>
            <tr>
              <td>Ngày nhận</td>
              <td>{dinhDangNgay(chiTietThanhLy.ngay_nhan)}</td>
            </tr>
            <tr>
              <td>Ngày trả dự kiến</td>
              <td>{dinhDangNgay(chiTietThanhLy.ngay_tra)}</td>
            </tr>
            <tr>
              <td>Ghi chú bàn giao</td>
              <td>{hienThi(chiTietThanhLy.ghi_chu_ban_giao)}</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }

  function layLoaiVatPham(vatPham) {
    if (vatPham.thiet_bi_id && !vatPham.bo_di_kem_id) return "Thiết bị chính";
    if (vatPham.thiet_bi_id && vatPham.bo_di_kem_id) return "Thiết bị kèm";
    return "Phụ kiện";
  }

  function renderCotKiemTra(vatPham, sanPham) {
    const viTriKiemTra = timIndexKiemTra(vatPham, sanPham);
    const kiemTra = danhSachKiemTraVatPham[viTriKiemTra];

    if (viTriKiemTra === -1) {
      return <td>-</td>;
    }

    if (vatPham.thiet_bi_id) {
      return (
        <td className="cot-kiem-tra-thiet-bi">
          <select
            value={kiemTra?.trang_thai_sau_tra || TRANG_THAI_TB_SAN_SANG}
            onChange={(e) =>
              doiKiemTraVatPham(
                viTriKiemTra,
                "trang_thai_sau_tra",
                e.target.value
              )
            }
          >
            <option value={TRANG_THAI_TB_SAN_SANG}>Sẵn sàng</option>
            <option value={TRANG_THAI_TB_BAO_TRI}>Bảo trì</option>
            <option value={TRANG_THAI_TB_BI_MAT}>Bị mất</option>
          </select>

          {Number(kiemTra?.trang_thai_sau_tra) === TRANG_THAI_TB_BAO_TRI && (
            <textarea
              className="o-ly-do-bao-tri"
              value={kiemTra?.ly_do_bao_tri || ""}
              onChange={(e) =>
                doiKiemTraVatPham(
                  viTriKiemTra,
                  "ly_do_bao_tri",
                  e.target.value
                )
              }
              placeholder="Nhập lý do bảo trì riêng cho thiết bị này"
            />
          )}
        </td>
      );
    }

    const soLuongGiao = Number(kiemTra?.so_luong_giao || vatPham.so_luong_giao || 0);
    const soLuongTraLai = Number(kiemTra?.so_luong_tra_lai ?? soLuongGiao);
    const soLuongThieu = soLuongGiao - soLuongTraLai;

    return (
      <td>
        <div className="nhom-so-luong-tra">
          <input
            className="o-so-luong-tra"
            type="number"
            min="0"
            max={soLuongGiao}
            value={soLuongTraLai}
            onChange={(e) =>
              doiKiemTraVatPham(
                viTriKiemTra,
                "so_luong_tra_lai",
                e.target.value
              )
            }
          />

          <span className="so-luong-thieu">
            Thiếu: {soLuongThieu > 0 ? soLuongThieu : 0}
          </span>
        </div>
      </td>
    );
  }

  function renderSanPhamBanGiao(coKiemKe) {
    if (!chiTietThanhLy) return null;

    const daThanhLy =
      Number(chiTietThanhLy.trang_thai) === TRANG_THAI_HOAN_THANH ||
      Boolean(chiTietThanhLy.tra_luc);

    return (
      <>
        <h3>{coKiemKe ? "Kiểm kê vật phẩm khi trả" : "Vật phẩm đã bàn giao"}</h3>

        {(chiTietThanhLy.san_pham_kem_serial || []).map((sanPham) => (
          <div className="khoi-ban-giao-thanh-ly" key={sanPham.chi_tiet_don_thue_id}>
            <div className="tieu-de-mau-ban-giao-thanh-ly">
              {sanPham.anh_url ? (
                <img
                  className="anh-mau-ban-giao-thanh-ly"
                  src={sanPham.anh_url}
                  alt="Ảnh mẫu"
                  onClick={() => setAnhDangXem(sanPham.anh_url)}
                />
              ) : (
                <div className="anh-mau-ban-giao-thanh-ly khong-co-anh">Ảnh</div>
              )}

              <h4>
                {hienThi(sanPham.ten_mau)} - Số lượng: {sanPham.so_luong_dat}
              </h4>
            </div>

            <div className="admin-bang-wrapper">
              <table className="bang-quan-ly bang-gon bang-thanh-ly">
                <thead>
                  <tr>
                    <th>Loại</th>
                    <th>Vật phẩm</th>
                    <th>Serial</th>
                    <th>SL giao</th>
                    <th>Vị trí</th>
                    {coKiemKe && <th>Trạng thái sau trả / SL trả</th>}
                    {!coKiemKe && daThanhLy && <th>SL trả</th>}
                  </tr>
                </thead>

                <tbody>
                  {[...(sanPham.thiet_bi_chinh || []), ...(sanPham.bo_di_kem || [])].map(
                    (vatPham, index) => (
                      <tr key={`${vatPham.id || vatPham.phu_kien_id}-${index}`}>
                        <td>{layLoaiVatPham(vatPham)}</td>
                        <td>{hienThi(vatPham.ten_vat_pham_snapshot || vatPham.ten_phu_kien)}</td>
                        <td>{hienThi(vatPham.so_serial || vatPham.so_serial_snapshot)}</td>
                        <td>{hienThi(vatPham.so_luong_giao)}</td>
                        <td>{hienThi(vatPham.ten_vi_tri_kho)}</td>

                        {coKiemKe && renderCotKiemTra(vatPham, sanPham)}

                        {!coKiemKe && daThanhLy && (
                          <td>
                            {vatPham.phu_kien_id
                              ? vatPham.so_luong_tra_lai ?? "-"
                              : "-"}
                          </td>
                        )}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </>
    );
  }

  function renderThanhToan() {
    if (!chiTietThanhLy) return null;

    return (
      <>
        <h3>Thanh toán</h3>

        <div className="admin-bang-wrapper">
          <table className="bang-quan-ly bang-gon">
            <thead>
              <tr>
                <th>STT</th>
                <th>Loại dòng tiền</th>
                <th>Người thực hiện</th>
                <th>Số tiền</th>
                <th>Mã giao dịch</th>
                <th>Ghi chú</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>

            <tbody>
              {(chiTietThanhLy.thanh_toan || []).map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{hienThi(item.ten_loai_dong_tien)}</td>
                  <td>{hienThi(item.ten_nguoi_thuc_hien)}</td>
                  <td>{dinhDangTien(item.so_tien)}</td>
                  <td>{hienThi(item.ma_giao_dich)}</td>
                  <td>{hienThi(item.ghi_chu)}</td>
                  <td>{dinhDangNgay(item.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  function renderFileDonThue() {
    if (!chiTietThanhLy) return null;

    return (
      <>
        <h3>Hình ảnh / file đơn thuê</h3>
        {renderNhomAnh("Ảnh hợp đồng giấy", locTep(MUC_DICH_HOP_DONG_GIAY))}
        {renderNhomAnh("Ảnh bàn giao", locTep(MUC_DICH_ANH_BAN_GIAO))}
        {renderNhomAnh("Ảnh khi trả", locTep(MUC_DICH_ANH_KHI_TRA))}
      </>
    );
  }

  function renderFormThanhLy() {
    if (!chiTietThanhLy || cheDoPopup !== "THANH_LY") return null;

    const tienTamTinh = tinhTienTamTinh();

    return (
      <form onSubmit={guiThanhLy}>
        {renderSanPhamBanGiao(true)}

        <h3>Xử lý tiền cọc</h3>

        <table className="bang-popup">
          <tbody>
            <tr>
              <td>Hình thức xử lý</td>
              <td>
                <select
                  value={hinhThucXuLyCoc}
                  onChange={(e) => {
                    setHinhThucXuLyCoc(e.target.value);
                    setSoTien("");
                  }}
                >
                  <option value="HOAN_COC">Hoàn toàn bộ cọc</option>
                  <option value="KHAU_TRU_COC">Khấu trừ cọc</option>
                  <option value="PHU_THU">Phụ thu</option>
                </select>
              </td>
            </tr>

            {hinhThucXuLyCoc !== "HOAN_COC" && (
              <tr>
                <td>Số tiền</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={soTien}
                    onChange={(e) => setSoTien(e.target.value)}
                  />
                </td>
              </tr>
            )}

            <tr>
              <td>Tạm tính hoàn cọc</td>
              <td>{dinhDangTien(tienTamTinh.hoanCoc)}</td>
            </tr>
            <tr>
              <td>Tạm tính khấu trừ</td>
              <td>{dinhDangTien(tienTamTinh.khauTru)}</td>
            </tr>
            <tr>
              <td>Tạm tính phụ thu</td>
              <td>{dinhDangTien(tienTamTinh.phuThu)}</td>
            </tr>
          </tbody>
        </table>

        <div className="o-form">
          <label>Ghi chú thanh lý</label>
          <textarea
            value={ghiChuThanhLy}
            onChange={(e) => setGhiChuThanhLy(e.target.value)}
            placeholder="Nhập ghi chú thanh lý, tình trạng khi trả..."
          />
        </div>

        <div className="o-form">
          <label>Ảnh khi trả</label>
          <input type="file" multiple accept="image/*" onChange={themAnhKhiTra} />
        </div>

        {renderAnhDangChon()}

        <div className="popup-actions">
          <button className="nut-dong-y" type="submit" disabled={dangGui}>
            {dangGui ? "Đang xử lý..." : "Xác nhận thanh lý"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="trang-thanh-ly-hop-dong">
      <h2>Quản lý thanh lý hợp đồng</h2>

      <div className="khung-loc-admin">
        <input
          placeholder="Tìm theo mã đơn, tên khách hàng, số điện thoại"
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
          <option value="0">Tất cả trạng thái</option>
          <option value={TRANG_THAI_DANG_THUE}>Đang thuê</option>
          <option value={TRANG_THAI_QUA_HAN}>Quá hạn</option>
          <option value={TRANG_THAI_HOAN_THANH}>Hoàn thành</option>
        </select>
      </div>

      <div className="admin-bang-wrapper">
        <table className="bang-quan-ly bang-gon">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Số điện thoại</th>
              <th>Ngày nhận</th>
              <th>Ngày trả</th>
              <th>Tổng tiền thuê</th>
              <th>Tổng tiền cọc</th>
              <th>Trạng thái</th>
              {/* <th>Ngày bàn giao</th> */}
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {dangTai ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : danhSachDon.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              danhSachDon.map((don) => (
                <tr key={don.id}>
                  <td>{don.ma_don}</td>
                  <td>{hienThi(don.ten_khach_hang)}</td>
                  <td>{hienThi(don.sdt_khach_hang)}</td>
                  <td>{dinhDangNgay(don.ngay_nhan)}</td>
                  <td>{dinhDangNgay(don.ngay_tra)}</td>
                  <td>{dinhDangTien(don.tong_tien_thue)}</td>
                  <td>{dinhDangTien(don.tong_tien_coc)}</td>
                  <td>{hienThiTrangThaiDon(don.trang_thai, don.ten_trang_thai)}</td>
                  {/* <td>{dinhDangNgay(don.ban_giao_luc)}</td> */}
                  <td>
                    <div className="cot-thao-tac">
                      <button
                        className="nut-xem-chi-tiet nut-thao-tac-bang-nhau"
                        type="button"
                        onClick={() => xemChiTiet(don.id)}
                      >
                        Xem chi tiết
                      </button>

                      <button
                        className="nut-dong-y nut-thao-tac-bang-nhau"
                        type="button"
                        disabled={!coTheThanhLy(don)}
                        onClick={() => {
                          if (coTheThanhLy(don)) lapPhieuTra(don.id);
                        }}
                      >
                        Thanh lý
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
          type="button"
          disabled={trangHienTai === 1}
          onClick={() => setTrangHienTai(trangHienTai - 1)}
        >
          Trước
        </button>

        <span>Trang {trangHienTai} / {tongTrang}</span>

        <button
          className="nut-dong-popup"
          type="button"
          disabled={trangHienTai === tongTrang}
          onClick={() => setTrangHienTai(trangHienTai + 1)}
        >
          Sau
        </button>
      </div>

      {cheDoPopup && (
        <div className="popup-nen">
          <div className="popup-hop popup-lon">
            <div className="popup-tieu-de">
              <h3>
                {cheDoPopup === "THANH_LY"
                  ? "Lập phiếu trả / thanh lý"
                  : "Chi tiết thanh lý"}
              </h3>

              <button className="nut-dong-popup" type="button" onClick={dongPopup}>
                Đóng
              </button>
            </div>

            <div className="popup-noi-dung">
              {dangTaiChiTiet ? (
                <p className="thong-bao">Đang tải chi tiết...</p>
              ) : chiTietThanhLy ? (
                <>
                  {cheDoPopup === "CHI_TIET" ? (
                    <>
                      {renderThongTinDon()}
                      {renderThongTinBanGiaoThanhLy()}
                      {renderSanPhamBanGiao(false)}
                      {renderThanhToan()}
                      {renderFileDonThue()}
                    </>
                  ) : (
                    <>
                      {renderThongTinThanhLyGon()}
                      {renderFormThanhLy()}
                    </>
                  )}
                </>
              ) : (
                <p className="thong-bao">Không có dữ liệu chi tiết.</p>
              )}
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

      {anhDangXem && (
        <div className="popup-nen" onClick={() => setAnhDangXem("")}>
          <div className="popup-anh">
            <img src={anhDangXem} alt="Ảnh xem lớn" />
          </div>
        </div>
      )}
    </div>
  );
}

export default SettlementList;