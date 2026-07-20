import { useEffect, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

const TRANG_THAI_DA_HUY = 1101;
const TRANG_THAI_DA_GIU_CHO = 1102;
const TRANG_THAI_DANG_THUE = 1103;
const TRANG_THAI_HOAN_THANH = 1104;
const TRANG_THAI_QUA_HAN = 1105;

const SO_DONG_MOI_TRANG = 10;
const SO_FILE_TOI_DA = 5;
const SO_ANH_MOI_DONG = 5;

function AdminOrderList() {
  const [danhSachDon, setDanhSachDon] = useState([]);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [tongTrang, setTongTrang] = useState(1);
  const [trangThaiLoc, setTrangThaiLoc] = useState("");
  const [tuKhoa, setTuKhoa] = useState("");

  const [dangTai, setDangTai] = useState(false);
  const [popupThongBao, setPopupThongBao] = useState("");

  const [moPopupChiTiet, setMoPopupChiTiet] = useState(false);
  const [chiTietDon, setChiTietDon] = useState(null);
  const [dangTaiChiTiet, setDangTaiChiTiet] = useState(false);

  const [moPopupBanGiao, setMoPopupBanGiao] = useState(false);
  const [donBanGiao, setDonBanGiao] = useState(null);
  const [boDiKemTheoChiTiet, setBoDiKemTheoChiTiet] = useState({});
  const [taiSanTheoMau, setTaiSanTheoMau] = useState({});
  const [luaChonVatPham, setLuaChonVatPham] = useState({});
  const [ghiChuBanGiao, setGhiChuBanGiao] = useState("");
  const [hopDongFiles, setHopDongFiles] = useState([]);
  const [anhBanGiaoFiles, setAnhBanGiaoFiles] = useState([]);
  const [dangGuiBanGiao, setDangGuiBanGiao] = useState(false);

  const [anhDangXem, setAnhDangXem] = useState("");

  function moPopup(noiDung) {
    setPopupThongBao(noiDung || "Có lỗi xảy ra");
  }

  function hienThi(giaTri) {
    return giaTri || "-";
  }

  function dinhDangTien(giaTri) {
    return Number(giaTri || 0).toLocaleString("vi-VN") + " đ";
  }

  function dinhDangNgay(giaTri) {
    if (!giaTri) return "-";
    return new Date(giaTri).toLocaleDateString("vi-VN");
  }

  function layTenTrangThai(id, tenTrangThai) {
    if (tenTrangThai) return tenTrangThai;

    const trangThai = Number(id);

    if (trangThai === TRANG_THAI_DA_HUY) return "Đã hủy";
    if (trangThai === TRANG_THAI_DA_GIU_CHO) return "Đã giữ chỗ";
    if (trangThai === TRANG_THAI_DANG_THUE) return "Đang thuê";
    if (trangThai === TRANG_THAI_HOAN_THANH) return "Hoàn thành";
    if (trangThai === TRANG_THAI_QUA_HAN) return "Quá hạn";

    return id || "-";
  }

  function layClassTrangThai(id) {
    const trangThai = Number(id);

    if (trangThai === TRANG_THAI_DA_HUY) {
      return "trang-thai-badge trang-thai-do";
    }

    if (trangThai === TRANG_THAI_DA_GIU_CHO) {
      return "trang-thai-badge trang-thai-vang";
    }

    if (trangThai === TRANG_THAI_DANG_THUE) {
      return "trang-thai-badge trang-thai-xanh-duong";
    }

    if (trangThai === TRANG_THAI_HOAN_THANH) {
      return "trang-thai-badge trang-thai-xanh";
    }

    if (trangThai === TRANG_THAI_QUA_HAN) {
      return "trang-thai-badge trang-thai-cam";
    }

    return "trang-thai-badge trang-thai-xam";
  }

  function tenMauDayDu(item) {
    return `${item.ten_hang || ""} ${item.ten_mau || ""}`.trim();
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

  function laFileAnhDangChon(file) {
    return file && file.type && file.type.startsWith("image/");
  }

  function moFileDaUpload(file) {
    if (!file || !file.file_url) return;

    if (laFileAnh(file)) {
      setAnhDangXem(file.file_url);
      return;
    }

    window.open(file.file_url, "_blank");
  }

  function moFileDangChon(file) {
    if (!file) return;

    const url = URL.createObjectURL(file);

    if (laFileAnhDangChon(file)) {
      setAnhDangXem(url);
      return;
    }

    window.open(url, "_blank");
  }

  function layFileTheoMucDich(mucDichId) {
    return (chiTietDon?.tep_don_thue || []).filter((file) => {
      return Number(file.muc_dich_id) === Number(mucDichId);
    });
  }

  function hienThiNhomFile(tieuDe, mucDichId) {
    const danhSachFile = layFileTheoMucDich(mucDichId);

    return (
      <div className="khoi-file-theo-muc-dich">
        <h4>{tieuDe}</h4>

        {danhSachFile.length > 0 ? (
          <div
            className="luoi-file-admin"
            style={{
              gridTemplateColumns: `repeat(${SO_ANH_MOI_DONG}, minmax(0, 1fr))`,
            }}
          >
            {danhSachFile.map((file) => (
              <div
                className="the-file-admin"
                key={file.id}
                onClick={() => moFileDaUpload(file)}
              >
                {laFileAnh(file) ? (
                  <img
                    className="anh-file-admin"
                    src={file.file_url}
                    alt="Ảnh đơn thuê"
                  />
                ) : (
                  <div className="khung-file-khong-anh">File</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Chưa có {tieuDe.toLowerCase()}.</p>
        )}
      </div>
    );
  }

  function hienThiFileDangChon(danhSachFile, setDanhSachFile) {
    if (danhSachFile.length === 0) return null;

    return (
      <div
        className="luoi-file-admin luoi-file-dang-chon"
        style={{
          gridTemplateColumns: `repeat(${SO_ANH_MOI_DONG}, minmax(0, 1fr))`,
        }}
      >
        {danhSachFile.map((file, index) => (
          <div className="the-file-admin" key={`${file.name}-${index}`}>
            <div onClick={() => moFileDangChon(file)}>
              {laFileAnhDangChon(file) ? (
                <img
                  className="anh-file-admin"
                  src={URL.createObjectURL(file)}
                  alt="Ảnh đã chọn"
                />
              ) : (
                <div className="khung-file-khong-anh">File</div>
              )}
            </div>

            <button
              className="nut-do nut-xoa-file-admin"
              type="button"
              onClick={() => xoaFile(index, danhSachFile, setDanhSachFile)}
            >
              Xóa
            </button>
          </div>
        ))}
      </div>
    );
  }

  async function layDanhSachDon() {
    try {
      setDangTai(true);

      const params = new URLSearchParams();

      params.set("page", trangHienTai);
      params.set("limit", SO_DONG_MOI_TRANG);

      if (trangThaiLoc) {
        params.set("trang_thai", trangThaiLoc);
      }

      if (tuKhoa.trim()) {
        params.set("tu_khoa", tuKhoa.trim());
      }

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/orders?${params.toString()}`,
        {
          headers: {
            ...taoHeaderCoToken(),
          },
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        const tongSoDong = Number(duLieu.total || 0);

        setDanhSachDon(duLieu.data || []);
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

  async function layChiTietDon(donId) {
    const phanHoi = await fetch(`${DUONG_DAN_API}/api/admin/orders/${donId}`, {
      headers: {
        ...taoHeaderCoToken(),
      },
    });

    const duLieu = await phanHoi.json();

    if (!duLieu.success) {
      throw new Error(duLieu.message);
    }

    return duLieu.data;
  }

  async function xemChiTietDon(donId) {
    try {
      setMoPopupChiTiet(true);
      setChiTietDon(null);
      setDangTaiChiTiet(true);

      const data = await layChiTietDon(donId);

      setChiTietDon(data);
    } catch (loi) {
      setMoPopupChiTiet(false);
      moPopup(loi.message);
    } finally {
      setDangTaiChiTiet(false);
    }
  }

  async function layBoDiKemCuaMau(mauThietBiId) {
    const phanHoi = await fetch(
      `${DUONG_DAN_API}/api/equipment-models/${mauThietBiId}`
    );

    const duLieu = await phanHoi.json();

    if (!duLieu.success) {
      throw new Error(duLieu.message);
    }

    return duLieu.data?.bo_di_kem || [];
  }

  async function layTaiSanSanSang(mauThietBiId, ngayNhan, ngayTra) {
    const params = new URLSearchParams();

    params.set("mau_thiet_bi_id", mauThietBiId);

    if (ngayNhan) params.set("ngay_nhan", ngayNhan);
    if (ngayTra) params.set("ngay_tra", ngayTra);

    const phanHoi = await fetch(
      `${DUONG_DAN_API}/api/admin/assets/available?${params.toString()}`,
      {
        headers: {
          ...taoHeaderCoToken(),
        },
      }
    );

    const duLieu = await phanHoi.json();

    if (!duLieu.success) {
      throw new Error(duLieu.message);
    }

    return duLieu.data || [];
  }

  async function moLapBanGiao(donId) {
    try {
      setMoPopupBanGiao(true);
      setDonBanGiao(null);
      setBoDiKemTheoChiTiet({});
      setTaiSanTheoMau({});
      setLuaChonVatPham({});
      setGhiChuBanGiao("");
      setHopDongFiles([]);
      setAnhBanGiaoFiles([]);

      const chiTiet = await layChiTietDon(donId);

      if (Number(chiTiet.trang_thai) !== TRANG_THAI_DA_GIU_CHO) {
        throw new Error("Chỉ lập bàn giao được đơn ở trạng thái Đã giữ chỗ");
      }

      const boDiKemTam = {};
      const taiSanTam = {};
      const luaChonTam = {};

      async function napTaiSanTheoMau(mauId) {
        if (!mauId || taiSanTam[mauId]) return;

        taiSanTam[mauId] = await layTaiSanSanSang(
          mauId,
          chiTiet.ngay_nhan,
          chiTiet.ngay_tra
        );
      }

      for (const dong of chiTiet.chi_tiet || []) {
        const soLuongDat = Number(dong.so_luong || 0);

        await napTaiSanTheoMau(dong.mau_thiet_bi_id);

        for (let i = 0; i < soLuongDat; i++) {
          luaChonTam[`main-${dong.id}-${i}`] = "";
        }

        const boDiKem = await layBoDiKemCuaMau(dong.mau_thiet_bi_id);
        boDiKemTam[dong.id] = boDiKem;

        for (const bdk of boDiKem) {
          const soLuongCan = Number(bdk.so_luong || 1) * soLuongDat;

          if (bdk.mau_thiet_bi_phu_id) {
            await napTaiSanTheoMau(bdk.mau_thiet_bi_phu_id);

            for (let i = 0; i < soLuongCan; i++) {
              luaChonTam[`bdk-${dong.id}-${bdk.id}-${i}`] = "";
            }
          }

          if (bdk.phu_kien_id) {
            luaChonTam[`pk-${dong.id}-${bdk.id}`] = soLuongCan;
          }
        }
      }

      setDonBanGiao(chiTiet);
      setBoDiKemTheoChiTiet(boDiKemTam);
      setTaiSanTheoMau(taiSanTam);
      setLuaChonVatPham(luaChonTam);
    } catch (loi) {
      setMoPopupBanGiao(false);
      moPopup(loi.message);
    }
  }

  function thayDoiLuaChon(key, value) {
    setLuaChonVatPham({
      ...luaChonVatPham,
      [key]: value,
    });
  }

  function layTaiSanChuaChon(mauThietBiId, keyHienTai) {
    const daChon = Object.entries(luaChonVatPham)
      .filter(([key, value]) => {
        if (!value) return false;
        if (key === keyHienTai) return false;

        return key.startsWith("main-") || key.startsWith("bdk-");
      })
      .map(([, value]) => String(value));

    return (taiSanTheoMau[mauThietBiId] || []).filter((item) => {
      return !daChon.includes(String(item.id));
    });
  }

  function timTaiSanTheoId(mauThietBiId, thietBiId) {
    return (taiSanTheoMau[mauThietBiId] || []).find((item) => {
      return String(item.id) === String(thietBiId);
    });
  }

  function hienThiTaiSanTrongSelect(taiSan) {
    return `${taiSan.so_serial || "Chưa có serial"} - ${
      taiSan.ten_vi_tri_kho || "Chưa rõ vị trí"
    }`;
  }

  function taoTenVatPhamBoDiKem(bdk) {
    if (bdk.ten_mau_phu) return bdk.ten_mau_phu;
    if (bdk.ten_phu_kien) return bdk.ten_phu_kien;

    return "Bộ đi kèm";
  }

  function taoVatPhamBanGiao() {
    const vatPham = [];

    for (const dong of donBanGiao.chi_tiet || []) {
      const soLuongDat = Number(dong.so_luong || 0);
      const boDiKem = boDiKemTheoChiTiet[dong.id] || [];

      for (let i = 0; i < soLuongDat; i++) {
        const key = `main-${dong.id}-${i}`;
        const thietBiId = luaChonVatPham[key];

        if (!thietBiId) {
          throw new Error(`Chưa chọn đủ thiết bị chính cho ${dong.ten_mau}`);
        }

        const taiSan = timTaiSanTheoId(dong.mau_thiet_bi_id, thietBiId);

        if (!taiSan) {
          throw new Error("Không tìm thấy thiết bị đã chọn");
        }

        vatPham.push({
          chi_tiet_don_thue_id: dong.id,
          bo_di_kem_id: null,
          thiet_bi_id: thietBiId,
          phu_kien_id: null,
          so_luong_giao: 1,
        });
      }

      for (const bdk of boDiKem) {
        const soLuongCan = Number(bdk.so_luong || 1) * soLuongDat;

        if (bdk.mau_thiet_bi_phu_id) {
          for (let i = 0; i < soLuongCan; i++) {
            const key = `bdk-${dong.id}-${bdk.id}-${i}`;
            const thietBiId = luaChonVatPham[key];

            if (!thietBiId) {
              throw new Error(`Chưa chọn đủ ${taoTenVatPhamBoDiKem(bdk)}`);
            }

            vatPham.push({
              chi_tiet_don_thue_id: dong.id,
              bo_di_kem_id: bdk.id,
              thiet_bi_id: thietBiId,
              phu_kien_id: null,
              so_luong_giao: 1,
            });
          }
        }

        if (bdk.phu_kien_id) {
          const key = `pk-${dong.id}-${bdk.id}`;
          const soLuongGiao = Number(luaChonVatPham[key] || 0);

          if (soLuongGiao !== soLuongCan) {
            throw new Error(
              `Số lượng ${taoTenVatPhamBoDiKem(bdk)} phải bằng ${soLuongCan}`
            );
          }

          vatPham.push({
            chi_tiet_don_thue_id: dong.id,
            bo_di_kem_id: bdk.id,
            thiet_bi_id: null,
            phu_kien_id: bdk.phu_kien_id,
            so_luong_giao: soLuongGiao,
          });
        }
      }
    }

    return vatPham;
  }

  function themFile(e, danhSachCu, setDanhSach, tenLoai) {
    const filesMoi = Array.from(e.target.files || []);

    if (filesMoi.length === 0) return;

    const danhSachMoi = [...danhSachCu, ...filesMoi];

    if (danhSachMoi.length > SO_FILE_TOI_DA) {
      moPopup(`Chỉ được chọn tối đa ${SO_FILE_TOI_DA} file ${tenLoai}`);
      e.target.value = "";
      return;
    }

    setDanhSach(danhSachMoi);
    e.target.value = "";
  }

  function xoaFile(index, danhSachCu, setDanhSach) {
    setDanhSach(danhSachCu.filter((_, viTri) => viTri !== index));
  }

  async function xacNhanBanGiao() {
    try {
      setDangGuiBanGiao(true);

      if (!donBanGiao) {
        throw new Error("Không có dữ liệu đơn bàn giao");
      }

      if (hopDongFiles.length === 0) {
        throw new Error("Vui lòng tải lên hợp đồng giấy");
      }

      if (anhBanGiaoFiles.length === 0) {
        throw new Error("Vui lòng tải lên ảnh bàn giao");
      }

      const vatPham = taoVatPhamBanGiao();
      const formData = new FormData();

      formData.append("ghi_chu_ban_giao", ghiChuBanGiao);
      formData.append("vat_pham", JSON.stringify(vatPham));

      hopDongFiles.forEach((file) => {
        formData.append("hop_dong_giay", file);
      });

      anhBanGiaoFiles.forEach((file) => {
        formData.append("anh_ban_giao", file);
      });

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/orders/${donBanGiao.id}/handover`,
        {
          method: "POST",
          headers: {
            ...taoHeaderCoToken(),
          },
          body: formData,
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setMoPopupBanGiao(false);
        setDonBanGiao(null);
        moPopup(duLieu.message);
        layDanhSachDon();
      } else {
        moPopup(duLieu.message);
      }
    } catch (loi) {
      moPopup(loi.message);
    } finally {
      setDangGuiBanGiao(false);
    }
  }

  useEffect(() => {
    layDanhSachDon();
  }, [trangHienTai, trangThaiLoc, tuKhoa]);

  return (
    <div className="trang-quan-ly-don-thue">
      <h2>Quản lý đơn thuê</h2>

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
          <option value="">Tất cả trạng thái</option>
          <option value="1101">Đã hủy</option>
          <option value="1102">Đã giữ chỗ</option>
          <option value="1103">Đang thuê</option>
          <option value="1104">Hoàn thành</option>
          <option value="1105">Quá hạn</option>
        </select>
      </div>

      <div className="admin-bang-wrapper">
        <table className="bang-quan-ly bang-gon">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Số điện thoại</th>
              <th>Ngày nhận</th>
              <th>Ngày trả</th>
              <th>Tiền thuê</th>
              <th>Tiền cọc</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {dangTai ? (
              <tr>
                <td colSpan="11" style={{ textAlign: "center" }}>
                  Đang tải danh sách đơn thuê...
                </td>
              </tr>
            ) : danhSachDon.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ textAlign: "center" }}>
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              danhSachDon.map((don, index) => (
                <tr key={don.id}>
                  <td>{(trangHienTai - 1) * SO_DONG_MOI_TRANG + index + 1}</td>
                  <td>{hienThi(don.ma_don)}</td>
                  <td>{hienThi(don.ten_khach_hang)}</td>
                  <td>{hienThi(don.sdt_khach_hang)}</td>
                  <td>{dinhDangNgay(don.ngay_nhan)}</td>
                  <td>{dinhDangNgay(don.ngay_tra)}</td>
                  <td>{dinhDangTien(don.tong_tien_thue)}</td>
                  <td>{dinhDangTien(don.tong_tien_coc)}</td>
                  <td>
                    <span className={layClassTrangThai(don.trang_thai)}>
                      {layTenTrangThai(don.trang_thai, don.ten_trang_thai)}
                    </span>
                  </td>
                  <td>{dinhDangNgay(don.created_at)}</td>
                  <td>
                    <div className="cot-thao-tac">
                      <button
                        className="nut-thao-tac-bang-nhau"
                        type="button"
                        onClick={() => xemChiTietDon(don.id)}
                      >
                        Xem chi tiết
                      </button>

                      <button
                        className="nut-ban-giao nut-thao-tac-bang-nhau"
                        type="button"
                        disabled={Number(don.trang_thai) !== TRANG_THAI_DA_GIU_CHO}
                        onClick={() => moLapBanGiao(don.id)}
                      >
                        Bàn giao
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

      {moPopupChiTiet && (
        <div className="popup-nen">
          <div className="popup-hop popup-lon">
            <div className="popup-tieu-de">
              <h3>Chi tiết đơn thuê</h3>

              <button
                className="nut-dong-popup"
                type="button"
                onClick={() => {
                  setMoPopupChiTiet(false);
                  setChiTietDon(null);
                }}
              >
                Đóng
              </button>
            </div>

            <div className="popup-noi-dung">
              {dangTaiChiTiet ? (
                <p className="thong-bao">Đang tải chi tiết đơn thuê...</p>
              ) : chiTietDon ? (
                <>
                  <h3>Thông tin đơn thuê</h3>

                  <table className="bang-popup">
                    <tbody>
                      <tr>
                        <td>Mã đơn</td>
                        <td>{hienThi(chiTietDon.ma_don)}</td>
                      </tr>

                      <tr>
                        <td>Khách hàng</td>
                        <td>{hienThi(chiTietDon.ten_khach_hang)}</td>
                      </tr>

                      <tr>
                        <td>Email</td>
                        <td>{hienThi(chiTietDon.email_khach_hang)}</td>
                      </tr>

                      <tr>
                        <td>Số điện thoại</td>
                        <td>{hienThi(chiTietDon.sdt_khach_hang)}</td>
                      </tr>

                      <tr>
                        <td>Ngày nhận</td>
                        <td>{dinhDangNgay(chiTietDon.ngay_nhan)}</td>
                      </tr>

                      <tr>
                        <td>Ngày trả</td>
                        <td>{dinhDangNgay(chiTietDon.ngay_tra)}</td>
                      </tr>

                      <tr>
                        <td>Tổng tiền thuê</td>
                        <td>{dinhDangTien(chiTietDon.tong_tien_thue)}</td>
                      </tr>

                      <tr>
                        <td>Tổng tiền cọc</td>
                        <td>{dinhDangTien(chiTietDon.tong_tien_coc)}</td>
                      </tr>

                      <tr>
                        <td>Trạng thái</td>
                        <td>
                          <span className={layClassTrangThai(chiTietDon.trang_thai)}>
                            {layTenTrangThai(
                              chiTietDon.trang_thai,
                              chiTietDon.ten_trang_thai
                            )}
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td>Lý do hủy</td>
                        <td>{hienThi(chiTietDon.ly_do_huy)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <h3>Thông tin bàn giao / thanh lý</h3>

                  <table className="bang-popup">
                    <tbody>
                      <tr>
                        <td>Thời điểm bàn giao</td>
                        <td>{dinhDangNgay(chiTietDon.ban_giao_luc)}</td>
                      </tr>

                      <tr>
                        <td>Nhân viên bàn giao</td>
                        <td>{hienThi(chiTietDon.ten_nguoi_ban_giao)}</td>
                      </tr>

                      <tr>
                        <td>Ghi chú bàn giao</td>
                        <td>{hienThi(chiTietDon.ghi_chu_ban_giao)}</td>
                      </tr>

                      <tr>
                        <td>Thời điểm trả</td>
                        <td>{dinhDangNgay(chiTietDon.tra_luc)}</td>
                      </tr>

                      <tr>
                        <td>Nhân viên nhận trả</td>
                        <td>{hienThi(chiTietDon.ten_nguoi_nhan_tra)}</td>
                      </tr>

                      <tr>
                        <td>Ghi chú thanh lý</td>
                        <td>{hienThi(chiTietDon.ghi_chu_thanh_ly)}</td>
                      </tr>

                      <tr>
                        <td>Phí phát sinh</td>
                        <td>{dinhDangTien(chiTietDon.phi_phat_sinh_tien)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <h3>Vật phẩm đã bàn giao</h3>

                  {(chiTietDon.vat_pham_ban_giao || []).length > 0 ? (
                    <div className="admin-bang-wrapper">
                      <table className="bang-quan-ly bang-gon">
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Tên vật phẩm</th>
                            <th>Serial</th>
                            <th>Vị trí kho</th>
                            <th>Số lượng giao</th>
                          </tr>
                        </thead>

                        <tbody>
                          {chiTietDon.vat_pham_ban_giao.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>
                                {hienThi(
                                  item.ten_vat_pham_snapshot ||
                                    item.ten_phu_kien
                                )}
                              </td>
                              <td>
                                {hienThi(
                                  item.so_serial_snapshot || item.so_serial
                                )}
                              </td>
                              <td>{hienThi(item.ten_vi_tri_kho)}</td>
                              <td>{item.so_luong_giao}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>Chưa có vật phẩm bàn giao.</p>
                  )}

                  <h3>Thanh toán</h3>

                  {(chiTietDon.thanh_toan || []).length > 0 ? (
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
                          {chiTietDon.thanh_toan.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>{hienThi(item.ten_loai_dong_tien)}</td>
                              <td>{hienThi(item.ten_nguoi_thanh_toan)}</td>
                              <td>{dinhDangTien(item.so_tien)}</td>
                              <td>{hienThi(item.ma_giao_dich)}</td>
                              <td>{hienThi(item.ghi_chu)}</td>
                              <td>{dinhDangNgay(item.created_at)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>Chưa có thông tin thanh toán.</p>
                  )}

                  <h3>File đơn thuê</h3>

                  <div className="nhom-file-theo-muc-dich">
                    {hienThiNhomFile("Ảnh hợp đồng giấy", 2601)}
                    {hienThiNhomFile("Ảnh bàn giao", 2602)}
                    {hienThiNhomFile("Ảnh khi trả", 2603)}
                  </div>
                </>
              ) : (
                <p className="thong-bao">Không có dữ liệu chi tiết.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {moPopupBanGiao && (
        <div className="popup-nen">
          <div className="popup-hop popup-lon">
            <div className="popup-tieu-de">
              <h3>Lập phiếu bàn giao</h3>

              <button
                className="nut-dong-popup"
                type="button"
                onClick={() => setMoPopupBanGiao(false)}
              >
                Đóng
              </button>
            </div>

            <div className="popup-noi-dung">
              {!donBanGiao ? (
                <p className="thong-bao">Đang tải dữ liệu bàn giao...</p>
              ) : (
                <>
                  <table className="bang-popup">
                    <tbody>
                      <tr>
                        <td>Mã đơn</td>
                        <td>{hienThi(donBanGiao.ma_don)}</td>
                      </tr>

                      <tr>
                        <td>Khách hàng</td>
                        <td>{hienThi(donBanGiao.ten_khach_hang)}</td>
                      </tr>

                      <tr>
                        <td>Số điện thoại</td>
                        <td>{hienThi(donBanGiao.sdt_khach_hang)}</td>
                      </tr>

                      <tr>
                        <td>Ngày nhận</td>
                        <td>{dinhDangNgay(donBanGiao.ngay_nhan)}</td>
                      </tr>

                      <tr>
                        <td>Ngày trả</td>
                        <td>{dinhDangNgay(donBanGiao.ngay_tra)}</td>
                      </tr>

                      <tr>
                        <td>Tổng tiền thuê</td>
                        <td>{dinhDangTien(donBanGiao.tong_tien_thue)}</td>
                      </tr>

                      <tr>
                        <td>Tổng tiền cọc đã thanh toán</td>
                        <td>
                          {dinhDangTien(
                            donBanGiao.tien_coc_da_thanh_toan ??
                              donBanGiao.tong_tien_coc
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {(donBanGiao.chi_tiet || []).map((dong) => {
                    const soLuongDat = Number(dong.so_luong || 0);
                    const boDiKem = boDiKemTheoChiTiet[dong.id] || [];

                    return (
                      <div className="khoi-ban-giao" key={dong.id}>
                        <div className="tieu-de-mau-ban-giao">
                          {dong.anh_url ? (
                            <img
                              className="anh-mau-ban-giao"
                              src={dong.anh_url}
                              alt={dong.ten_mau}
                              onClick={() => setAnhDangXem(dong.anh_url)}
                            />
                          ) : (
                            <div className="anh-mau-ban-giao-rong">Không ảnh</div>
                          )}

                          <h4>
                            {hienThi(dong.ten_mau)} - Số lượng: {soLuongDat}
                          </h4>
                        </div>

                        <table className="bang-quan-ly bang-gon">
                          <thead>
                            <tr>
                              <th>Loại</th>
                              <th>Vật phẩm</th>
                              <th>Chọn thiết bị / số lượng</th>
                            </tr>
                          </thead>

                          <tbody>
                            {Array.from({ length: soLuongDat }).map((_, index) => {
                              const key = `main-${dong.id}-${index}`;

                              return (
                                <tr key={key}>
                                  <td>Thiết bị chính</td>
                                  <td>{hienThi(dong.ten_mau)}</td>
                                  <td>
                                    <select
                                      value={luaChonVatPham[key] || ""}
                                      onChange={(e) =>
                                        thayDoiLuaChon(key, e.target.value)
                                      }
                                    >
                                      <option value="">Chọn thiết bị</option>

                                      {layTaiSanChuaChon(
                                        dong.mau_thiet_bi_id,
                                        key
                                      ).map((taiSan) => (
                                        <option key={taiSan.id} value={taiSan.id}>
                                          {hienThiTaiSanTrongSelect(taiSan)}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                </tr>
                              );
                            })}

                            {boDiKem.map((bdk) => {
                              const soLuongCan =
                                Number(bdk.so_luong || 1) * soLuongDat;

                              if (bdk.mau_thiet_bi_phu_id) {
                                return Array.from({ length: soLuongCan }).map(
                                  (_, index) => {
                                    const key = `bdk-${dong.id}-${bdk.id}-${index}`;

                                    return (
                                      <tr key={key}>
                                        <td>Thiết bị đi kèm</td>
                                        <td>{taoTenVatPhamBoDiKem(bdk)}</td>
                                        <td>
                                          <select
                                            value={luaChonVatPham[key] || ""}
                                            onChange={(e) =>
                                              thayDoiLuaChon(key, e.target.value)
                                            }
                                          >
                                            <option value="">Chọn thiết bị</option>

                                            {layTaiSanChuaChon(
                                              bdk.mau_thiet_bi_phu_id,
                                              key
                                            ).map((taiSan) => (
                                              <option
                                                key={taiSan.id}
                                                value={taiSan.id}
                                              >
                                                {hienThiTaiSanTrongSelect(taiSan)}
                                              </option>
                                            ))}
                                          </select>
                                        </td>
                                      </tr>
                                    );
                                  }
                                );
                              }

                              if (bdk.phu_kien_id) {
                                const key = `pk-${dong.id}-${bdk.id}`;

                                return (
                                  <tr key={key}>
                                    <td>Phụ kiện</td>
                                    <td>{taoTenVatPhamBoDiKem(bdk)}</td>
                                    <td>
                                      <div className="nhom-nhap-so-luong-phu-kien">
                                        <input
                                          className="o-so-luong-phu-kien"
                                          type="number"
                                          min="0"
                                          value={luaChonVatPham[key] || 0}
                                          onChange={(e) =>
                                            thayDoiLuaChon(key, e.target.value)
                                          }
                                        />

                                        <span className="goi-y-so-luong">
                                          Cần giao: {soLuongCan}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              }

                              return null;
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}

                  <div className="o-form">
                    <label>Ghi chú bàn giao</label>
                    <textarea
                      value={ghiChuBanGiao}
                      onChange={(e) => setGhiChuBanGiao(e.target.value)}
                    />
                  </div>

                  <div className="o-form">
                    <label>Ảnh hợp đồng giấy</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={(e) =>
                        themFile(e, hopDongFiles, setHopDongFiles, "hợp đồng")
                      }
                    />

                    {hienThiFileDangChon(hopDongFiles, setHopDongFiles)}
                  </div>

                  <div className="o-form">
                    <label>Ảnh bàn giao</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        themFile(
                          e,
                          anhBanGiaoFiles,
                          setAnhBanGiaoFiles,
                          "ảnh bàn giao"
                        )
                      }
                    />

                    {hienThiFileDangChon(anhBanGiaoFiles, setAnhBanGiaoFiles)}
                  </div>

                  <div className="popup-actions">
                    <button
                      className="nut-dong-y"
                      type="button"
                      disabled={dangGuiBanGiao}
                      onClick={xacNhanBanGiao}
                    >
                      {dangGuiBanGiao ? "Đang lưu..." : "Xác nhận bàn giao"}
                    </button>

                  </div>
                </>
              )}
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
            <img src={anhDangXem} alt="Ảnh đơn thuê" />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrderList;
