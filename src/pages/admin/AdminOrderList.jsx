import { useEffect, useState } from "react";
import { DUONG_DAN_API } from "../../api/api";

const TRANG_THAI_DA_GIU_CHO = 1102;
const SO_DONG_MOI_TRANG = 10;
const SO_ANH_MOI_DONG = 5;

function AdminOrderList() {
  const [danhSachDon, setDanhSachDon] = useState([]);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [tongTrang, setTongTrang] = useState(1);
  const [trangThaiLoc, setTrangThaiLoc] = useState("");

  const [dangTai, setDangTai] = useState(false);
  const [thongBao, setThongBao] = useState("");

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
  const [anhDangXem, setAnhDangXem] = useState("");
  const [dangGuiBanGiao, setDangGuiBanGiao] = useState(false);

  function taoHeaderCoToken() {
    const token = localStorage.getItem("token");

    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  function dinhDangTien(giaTri) {
    return Number(giaTri || 0).toLocaleString("vi-VN") + " đ";
  }

  function dinhDangNgay(giaTri) {
    if (!giaTri) {
      return "-";
    }

    return new Date(giaTri).toLocaleDateString("vi-VN");
  }

  function hienThi(giaTri) {
    return giaTri || "-";
  }

  function layTenTrangThai(id, tenTrangThai) {
    if (tenTrangThai) {
      return tenTrangThai;
    }

    if (Number(id) === 1101) return "Đã hủy";
    if (Number(id) === 1102) return "Đã giữ chỗ";
    if (Number(id) === 1103) return "Đang thuê";
    if (Number(id) === 1104) return "Hoàn thành";
    if (Number(id) === 1105) return "Quá hạn";

    return id;
  }

  async function layDanhSachDon() {
    try {
      setDangTai(true);
      setThongBao("");

      const params = new URLSearchParams();

      params.set("page", trangHienTai);
      params.set("limit", SO_DONG_MOI_TRANG);

      if (trangThaiLoc) {
        params.set("trang_thai", trangThaiLoc);
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
        const danhSach = duLieu.data || [];
        const tongSoDong = Number(duLieu.total || danhSach.length || 0);

        setDanhSachDon(danhSach);
        setTongTrang(Math.max(1, Math.ceil(tongSoDong / SO_DONG_MOI_TRANG)));
      } else {
        setThongBao(duLieu.message);
      }
    } catch {
      setThongBao("Không kết nối được server");
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

  async function xemChiTiet(donId) {
    try {
      setMoPopupChiTiet(true);
      setDangTaiChiTiet(true);
      setChiTietDon(null);
      setThongBao("");

      const duLieu = await layChiTietDon(donId);
      setChiTietDon(duLieu);
    } catch (loi) {
      setThongBao(loi.message);
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

    if (ngayNhan) {
      params.set("ngay_nhan", ngayNhan);
    }

    if (ngayTra) {
      params.set("ngay_tra", ngayTra);
    }

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
      setThongBao("");
      setMoPopupBanGiao(true);
      setDonBanGiao(null);
      setBoDiKemTheoChiTiet({});
      setTaiSanTheoMau({});
      setLuaChonVatPham({});
      setGhiChuBanGiao("");
      setHopDongFiles([]);
      setAnhBanGiaoFiles([]);

      const chiTiet = await layChiTietDon(donId);

      const boDiKemTam = {};
      const taiSanTam = {};
      const luaChonTam = {};

      async function napTaiSanNeuChuaCo(mauId) {
        if (!mauId) return;

        if (taiSanTam[mauId]) {
          return;
        }

        taiSanTam[mauId] = await layTaiSanSanSang(
          mauId,
          chiTiet.ngay_nhan,
          chiTiet.ngay_tra
        );
      }

      for (const dong of chiTiet.chi_tiet || []) {
        const soLuongDat = Number(dong.so_luong || 0);

        await napTaiSanNeuChuaCo(dong.mau_thiet_bi_id);

        const boDiKem = await layBoDiKemCuaMau(dong.mau_thiet_bi_id);
        boDiKemTam[dong.id] = boDiKem;

        for (let i = 0; i < soLuongDat; i++) {
          luaChonTam[`thiet-bi-chinh-${dong.id}-${i}`] = "";
        }

        for (const bdk of boDiKem) {
          const soLuongCan = Number(bdk.so_luong || 1) * soLuongDat;

          if (bdk.mau_thiet_bi_phu_id) {
            await napTaiSanNeuChuaCo(bdk.mau_thiet_bi_phu_id);

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
      setThongBao(loi.message);
      setMoPopupBanGiao(false);
    }
  }

  function thayDoiLuaChon(key, value) {
    setLuaChonVatPham({
      ...luaChonVatPham,
      [key]: value,
    });
  }

  function demSoDongDaChon(dong) {
    const boDiKem = boDiKemTheoChiTiet[dong.id] || [];
    const soLuongDat = Number(dong.so_luong || 0);

    let tong = soLuongDat;
    let daChon = 0;

    for (let i = 0; i < soLuongDat; i++) {
      if (luaChonVatPham[`thiet-bi-chinh-${dong.id}-${i}`]) {
        daChon++;
      }
    }

    for (const bdk of boDiKem) {
      const soLuongCan = Number(bdk.so_luong || 1) * soLuongDat;

      if (bdk.mau_thiet_bi_phu_id) {
        tong += soLuongCan;

        for (let i = 0; i < soLuongCan; i++) {
          if (luaChonVatPham[`bdk-${dong.id}-${bdk.id}-${i}`]) {
            daChon++;
          }
        }
      }

      if (bdk.phu_kien_id) {
        tong += 1;

        if (Number(luaChonVatPham[`pk-${dong.id}-${bdk.id}`] || 0) > 0) {
          daChon++;
        }
      }
    }

    return {
      tong,
      daChon,
      du: tong > 0 && tong === daChon,
    };
  }

  function themAnhToiDa5(e, danhSachCu, setDanhSach, tenLoaiAnh) {
    const filesMoi = Array.from(e.target.files || []);

    if (filesMoi.length === 0) {
      return;
    }

    const danhSachMoi = [...danhSachCu, ...filesMoi];

    if (danhSachMoi.length > 5) {
      setThongBao(`Chỉ được chọn tối đa 5 ảnh ${tenLoaiAnh}`);
      e.target.value = "";
      return;
    }

    setDanhSach(danhSachMoi);

    e.target.value = "";
  }

  function xoaAnhDaChon(index, danhSachCu, setDanhSach) {
    const danhSachMoi = danhSachCu.filter((_, viTri) => viTri !== index);

    setDanhSach(danhSachMoi);
  }

  function layDanhSachTaiSanChuaChon(mauThietBiId, keyHienTai) {
    const danhSachDaChon = Object.entries(luaChonVatPham)
      .filter(([key, value]) => {
        if (!value) return false;

        return key.startsWith("thiet-bi-chinh-") || key.startsWith("bdk-");
      })
      .filter(([key]) => key !== keyHienTai)
      .map(([, value]) => String(value));

    return (taiSanTheoMau[mauThietBiId] || []).filter((tb) => {
      return !danhSachDaChon.includes(String(tb.id));
    });
  }

  function taoTenVatPhamMau(dong) {
    return `${dong.ten_hang || ""} ${dong.ten_mau || ""}`.trim();
  }

  function taoTenVatPhamBoDiKem(bdk) {
    if (bdk.ten_mau_phu) {
      return `${bdk.ten_hang_phu || ""} ${bdk.ten_mau_phu || ""}`.trim();
    }

    return bdk.ten_phu_kien || "Phụ kiện đi kèm";
  }

  function timTaiSanTheoId(mauThietBiId, thietBiId) {
    const danhSach = taiSanTheoMau[mauThietBiId] || [];

    return danhSach.find((tb) => String(tb.id) === String(thietBiId));
  }

  function hienThiTaiSanTrongSelect(tb) {
    return `${tb.ma_tai_san || "Chưa có mã"} - ${
      tb.so_serial || "Chưa có serial"
    } - ${tb.vi_tri_luu_tru || "Chưa rõ vị trí"}`;

    // ${tb.tinh_trang || "Chưa rõ tình trạng"} -
  }

  function taoVatPhamBanGiao() {
    const vatPham = [];

    if (!donBanGiao) {
      return vatPham;
    }

    for (const dong of donBanGiao.chi_tiet || []) {
      const boDiKem = boDiKemTheoChiTiet[dong.id] || [];
      const soLuongDat = Number(dong.so_luong || 0);
      const tenVatPhamChinh = taoTenVatPhamMau(dong);

      for (let i = 0; i < soLuongDat; i++) {
        const key = `thiet-bi-chinh-${dong.id}-${i}`;
        const thietBiId = luaChonVatPham[key];

        if (!thietBiId) {
          throw new Error(`Chưa chọn đủ thiết bị chính cho mẫu ${dong.ten_mau}`);
        }

        const thietBi = timTaiSanTheoId(dong.mau_thiet_bi_id, thietBiId);

        if (!thietBi) {
          throw new Error(`Không tìm thấy tài sản đã chọn của mẫu ${dong.ten_mau}`);
        }

        vatPham.push({
          chi_tiet_don_thue_id: dong.id,
          bo_di_kem_id: null,
          thiet_bi_id: thietBiId,
          phu_kien_id: null,
          ten_vat_pham_snapshot: tenVatPhamChinh,
          ma_tai_san_snapshot: thietBi.ma_tai_san || null,
          so_serial_snapshot: thietBi.so_serial || null,
          so_luong_giao: 1,
          // tinh_trang_truoc: thietBi.tinh_trang || null,
        });
      }

      for (const bdk of boDiKem) {
        const soLuongCan = Number(bdk.so_luong || 1) * soLuongDat;
        const tenVatPhamDiKem = taoTenVatPhamBoDiKem(bdk);

        if (bdk.mau_thiet_bi_phu_id) {
          for (let i = 0; i < soLuongCan; i++) {
            const key = `bdk-${dong.id}-${bdk.id}-${i}`;
            const thietBiId = luaChonVatPham[key];

            if (!thietBiId) {
              throw new Error(
                `Chưa chọn đủ thiết bị đi kèm cho mẫu ${dong.ten_mau}`
              );
            }

            const thietBi = timTaiSanTheoId(bdk.mau_thiet_bi_phu_id, thietBiId);

            if (!thietBi) {
              throw new Error(
                `Không tìm thấy tài sản đi kèm đã chọn cho mẫu ${dong.ten_mau}`
              );
            }

            vatPham.push({
              chi_tiet_don_thue_id: dong.id,
              bo_di_kem_id: bdk.id,
              thiet_bi_id: thietBiId,
              phu_kien_id: null,
              ten_vat_pham_snapshot: tenVatPhamDiKem,
              ma_tai_san_snapshot: thietBi.ma_tai_san || null,
              so_serial_snapshot: thietBi.so_serial || null,
              so_luong_giao: 1,
              // tinh_trang_truoc: thietBi.tinh_trang || null,
            });
          }
        }

        if (bdk.phu_kien_id) {
          const key = `pk-${dong.id}-${bdk.id}`;
          const soLuongGiao = Number(luaChonVatPham[key] || 0);

          if (soLuongGiao <= 0) {
            throw new Error(
              `Chưa nhập số lượng phụ kiện đi kèm cho mẫu ${dong.ten_mau}`
            );
          }

          vatPham.push({
            chi_tiet_don_thue_id: dong.id,
            bo_di_kem_id: bdk.id,
            thiet_bi_id: null,
            phu_kien_id: bdk.phu_kien_id,
            ten_vat_pham_snapshot: tenVatPhamDiKem,
            so_luong_giao: soLuongGiao,
          });
        }
      }
    }

    return vatPham;
  }

  async function xacNhanBanGiao() {
    try {
      setDangGuiBanGiao(true);
      setThongBao("");

      if (!donBanGiao) {
        setThongBao("Không có dữ liệu đơn bàn giao");
        return;
      }

      if (hopDongFiles.length === 0) {
        setThongBao("Vui lòng upload ảnh hợp đồng giấy");
        return;
      }

      if (anhBanGiaoFiles.length === 0) {
        setThongBao("Vui lòng upload ít nhất 1 ảnh bàn giao");
        return;
      }

      const vatPham = taoVatPhamBanGiao();

      const formData = new FormData();

      formData.append("ghi_chu_ban_giao", ghiChuBanGiao || "");
      formData.append("vat_pham", JSON.stringify(vatPham));

      for (const file of hopDongFiles) {
        formData.append("hop_dong_giay", file);
      }

      for (const file of anhBanGiaoFiles) {
        formData.append("anh_ban_giao", file);
      }

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
        setThongBao("Lập phiếu bàn giao thành công");
        setMoPopupBanGiao(false);
        layDanhSachDon();
      } else {
        setThongBao(duLieu.message);
      }
    } catch (loi) {
      setThongBao(loi.message || "Không kết nối được server");
    } finally {
      setDangGuiBanGiao(false);
    }
  }

  function dongPopupChiTiet() {
    setMoPopupChiTiet(false);
    setChiTietDon(null);
  }

  function dongPopupBanGiao() {
    setMoPopupBanGiao(false);
    setDonBanGiao(null);
  }

  function renderVatPhamBanGiaoChiTiet() {
    const danhSach = chiTietDon?.vat_pham_ban_giao || [];

    if (danhSach.length === 0) {
      return <p>Chưa có dữ liệu bàn giao.</p>;
    }

    return (
      <table className="bang-popup bang-gon">
        <thead>
          <tr>
            <th>Vật phẩm</th>
            <th>Mã tài sản</th>
            <th>Serial</th>
            <th>Số lượng</th>
            {/* <th>Tình trạng bàn giao</th> */}
          </tr>
        </thead>

        <tbody>
          {danhSach.map((item) => (
            <tr key={item.id}>
              <td>{hienThi(item.ten_vat_pham_snapshot || item.ten_phu_kien)}</td>
              <td>{hienThi(item.ma_tai_san_snapshot || item.ma_tai_san)}</td>
              <td>{hienThi(item.so_serial_snapshot || item.so_serial)}</td>
              <td>{hienThi(item.so_luong_giao)}</td>
              {/* <td>{hienThi(item.tinh_trang_truoc)}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function renderAnhDonThue(tieuDe, mucDichId) {
    const danhSach = chiTietDon?.tep_don_thue || [];

    const danhSachAnh = danhSach.filter((tep) => {
      return Number(tep.muc_dich_id) === Number(mucDichId);
    });

    return (
      <>
        <h3>{tieuDe}</h3>

        {danhSachAnh.length === 0 ? (
          <p>Chưa có ảnh.</p>
        ) : (
          <div className="nhom-anh-popup">
            {danhSachAnh.map((tep) => (
              <img
                key={tep.id}
                src={tep.file_url}
                alt={tep.ten_file_goc || tieuDe}
                onClick={() => setAnhDangXem(tep.file_url)}
              />
            ))}
          </div>
        )}
      </>
    );
  }

  function renderAnhDaChon(danhSachAnh, setDanhSach, tenAnh) {
    if (danhSachAnh.length === 0) {
      return null;
    }

    return (
      <div
        className="danh-sach-anh-da-chon"
        style={{ gridTemplateColumns: `repeat(${SO_ANH_MOI_DONG}, 1fr)` }}
      >
        {danhSachAnh.map((file, index) => {
          const urlTam = URL.createObjectURL(file);

          return (
            <div className="the-anh-da-chon" key={`${file.name}-${index}`}>
              <img
                src={urlTam}
                alt={tenAnh}
                onClick={() => setAnhDangXem(urlTam)}
              />

              <button
                className="nut-do nut-xoa-anh"
                type="button"
                onClick={() => xoaAnhDaChon(index, danhSachAnh, setDanhSach)}
              >
                Xóa
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  function renderChonTaiSanTheoMau() {
    if (!donBanGiao) {
      return <p>Đang tải dữ liệu bàn giao...</p>;
    }

    return (
      <>
        <p>
          Chọn thiết bị chính và bộ đi kèm cho từng mẫu thiết bị trong đơn thuê.
        </p>

        {(donBanGiao.chi_tiet || []).map((dong) => {
          const boDiKem = boDiKemTheoChiTiet[dong.id] || [];
          const soLuongDat = Number(dong.so_luong || 0);
          const dem = demSoDongDaChon(dong);

          return (
            <div className="the-ban-giao" key={dong.id}>
              <div className="tieu-de-ban-giao">
                <div>
                  <b>
                    {dong.ten_hang} {dong.ten_mau}
                  </b>

                  <span className="nhan-so-luong">x{soLuongDat}</span>
                </div>

                <div>
                  <span
                    className={dem.du ? "nhan-da-chon-du" : "nhan-chua-chon-du"}
                  >
                    {dem.du ? "ĐÃ CHỌN ĐỦ" : "CHƯA CHỌN ĐỦ"}
                  </span>

                  <span className="dem-thanh-phan">
                    {dem.daChon}/{dem.tong} thành phần
                  </span>
                </div>
              </div>

              <div className="noi-dung-the-ban-giao">
                <table className="bang-quan-ly bang-chon-tai-san">
                  <thead>
                    <tr>
                      <th>Loại</th>
                      <th>Vật phẩm</th>
                      <th>Tài sản / Số lượng bàn giao</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Array.from({ length: soLuongDat }).map((_, index) => {
                      const key = `thiet-bi-chinh-${dong.id}-${index}`;

                      const danhSachTaiSan = layDanhSachTaiSanChuaChon(
                        dong.mau_thiet_bi_id,
                        key
                      );

                      return (
                        <tr key={key}>
                          <td>
                            <b>Thiết bị chính</b>
                          </td>

                          <td>
                            {dong.ten_hang} {dong.ten_mau}
                          </td>

                          <td>
                            <select
                              value={luaChonVatPham[key] || ""}
                              onChange={(e) => thayDoiLuaChon(key, e.target.value)}
                            >
                              <option value="">-- Chọn thiết bị chính --</option>

                              {danhSachTaiSan.map((tb) => (
                                <option key={tb.id} value={tb.id}>
                                  {hienThiTaiSanTrongSelect(tb)}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}

                    {boDiKem.map((bdk) => {
                      const soLuongCan = Number(bdk.so_luong || 1) * soLuongDat;

                      if (bdk.mau_thiet_bi_phu_id) {
                        const tenThanhPhan = taoTenVatPhamBoDiKem(bdk);

                        return Array.from({ length: soLuongCan }).map((_, index) => {
                          const key = `bdk-${dong.id}-${bdk.id}-${index}`;

                          const danhSachTaiSan = layDanhSachTaiSanChuaChon(
                            bdk.mau_thiet_bi_phu_id,
                            key
                          );

                          return (
                            <tr key={key}>
                              <td>
                                <b>Bộ đi kèm</b>
                              </td>

                              <td>{tenThanhPhan}</td>

                              <td>
                                <select
                                  value={luaChonVatPham[key] || ""}
                                  onChange={(e) =>
                                    thayDoiLuaChon(key, e.target.value)
                                  }
                                >
                                  <option value="">-- Chọn thiết bị đi kèm --</option>

                                  {danhSachTaiSan.map((tb) => (
                                    <option key={tb.id} value={tb.id}>
                                      {hienThiTaiSanTrongSelect(tb)}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          );
                        });
                      }

                      if (bdk.phu_kien_id) {
                        const key = `pk-${dong.id}-${bdk.id}`;

                        return (
                          <tr key={key}>
                            <td>
                              <b>Phụ kiện</b>
                            </td>

                            <td>{bdk.ten_phu_kien || "Phụ kiện đi kèm"}</td>

                            <td>
                              <input
                                type="number"
                                min="1"
                                value={luaChonVatPham[key] || ""}
                                onChange={(e) =>
                                  thayDoiLuaChon(key, e.target.value)
                                }
                              />

                              <span className="chu-mo">
                                {" "}
                                Số lượng cần bàn giao: {soLuongCan}
                              </span>
                            </td>
                          </tr>
                        );
                      }

                      return null;
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  /*
    RENDER KIỂU TỪNG THIẾT BỊ
    - Canon R6 #1
        + Thiết bị chính
        + Lens đi kèm
        + Pin đi kèm
    - Canon R6 #2
        + Thiết bị chính
        + Lens đi kèm
        + Pin đi kèm

    thì:
    1. Mở hàm này.
    2. Trong JSX đổi:
       {renderChonTaiSanTheoMau()}
       thành:
       {renderChonTaiSanTheoTungThietBi()}
  */
  /*
  function renderChonTaiSanTheoTungThietBi() {
    if (!donBanGiao) {
      return <p>Đang tải dữ liệu bàn giao...</p>;
    }

    return (
      <>
        <p>Chọn tài sản theo từng bộ thiết bị bàn giao cho khách.</p>

        {(donBanGiao.chi_tiet || []).map((dong) => {
          const boDiKem = boDiKemTheoChiTiet[dong.id] || [];
          const soLuongDat = Number(dong.so_luong || 0);
          const dem = demSoDongDaChon(dong);

          return (
            <div className="the-ban-giao" key={dong.id}>
              <div className="tieu-de-ban-giao">
                <div>
                  <b>
                    {dong.ten_hang} {dong.ten_mau}
                  </b>

                  <span className="nhan-so-luong">x{soLuongDat}</span>
                </div>

                <div>
                  <span
                    className={dem.du ? "nhan-da-chon-du" : "nhan-chua-chon-du"}
                  >
                    {dem.du ? "ĐÃ CHỌN ĐỦ" : "CHƯA CHỌN ĐỦ"}
                  </span>

                  <span className="dem-thanh-phan">
                    {dem.daChon}/{dem.tong} thành phần
                  </span>
                </div>
              </div>

              {Array.from({ length: soLuongDat }).map((_, indexThietBi) => {
                const keyThietBiChinh = `thiet-bi-chinh-${dong.id}-${indexThietBi}`;

                const danhSachTaiSanChinh = layDanhSachTaiSanChuaChon(
                  dong.mau_thiet_bi_id,
                  keyThietBiChinh
                );

                return (
                  <div
                    className="noi-dung-the-ban-giao"
                    key={`bo-${dong.id}-${indexThietBi}`}
                  >
                    <h4>
                      {dong.ten_hang} {dong.ten_mau} #{indexThietBi + 1}
                    </h4>

                    <table className="bang-quan-ly bang-chon-tai-san">
                      <thead>
                        <tr>
                          <th>Loại</th>
                          <th>Vật phẩm</th>
                          <th>Tài sản / Số lượng bàn giao</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td>
                            <b>Thiết bị chính</b>
                          </td>

                          <td>
                            {dong.ten_hang} {dong.ten_mau}
                          </td>

                          <td>
                            <select
                              value={luaChonVatPham[keyThietBiChinh] || ""}
                              onChange={(e) =>
                                thayDoiLuaChon(keyThietBiChinh, e.target.value)
                              }
                            >
                              <option value="">-- Chọn thiết bị chính --</option>

                              {danhSachTaiSanChinh.map((tb) => (
                                <option key={tb.id} value={tb.id}>
                                  {hienThiTaiSanTrongSelect(tb)}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>

                        {boDiKem.map((bdk) => {
                          if (bdk.mau_thiet_bi_phu_id) {
                            const soLuongMoiBo = Number(bdk.so_luong || 1);
                            const tenThanhPhan = taoTenVatPhamBoDiKem(bdk);

                            return Array.from({ length: soLuongMoiBo }).map(
                              (_, indexThanhPhan) => {
                                const viTriTrongTong =
                                  indexThietBi * soLuongMoiBo + indexThanhPhan;

                                const key = `bdk-${dong.id}-${bdk.id}-${viTriTrongTong}`;

                                const danhSachTaiSan = layDanhSachTaiSanChuaChon(
                                  bdk.mau_thiet_bi_phu_id,
                                  key
                                );

                                return (
                                  <tr key={key}>
                                    <td>
                                      <b>Bộ đi kèm</b>
                                    </td>

                                    <td>{tenThanhPhan}</td>

                                    <td>
                                      <select
                                        value={luaChonVatPham[key] || ""}
                                        onChange={(e) =>
                                          thayDoiLuaChon(key, e.target.value)
                                        }
                                      >
                                        <option value="">
                                          -- Chọn thiết bị đi kèm --
                                        </option>

                                        {danhSachTaiSan.map((tb) => (
                                          <option key={tb.id} value={tb.id}>
                                            {hienThiTaiSanTrongSelect(tb)}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                  </tr>
                                );
                              }
                            );
                          }

                          return null;
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })}

              <div className="noi-dung-the-ban-giao">
                <h4>Phụ kiện số lượng dùng chung</h4>

                <table className="bang-quan-ly bang-chon-tai-san">
                  <thead>
                    <tr>
                      <th>Loại</th>
                      <th>Vật phẩm</th>
                      <th>Số lượng bàn giao</th>
                    </tr>
                  </thead>

                  <tbody>
                    {boDiKem.map((bdk) => {
                      if (!bdk.phu_kien_id) {
                        return null;
                      }

                      const key = `pk-${dong.id}-${bdk.id}`;

                      return (
                        <tr key={key}>
                          <td>
                            <b>Phụ kiện</b>
                          </td>

                          <td>{bdk.ten_phu_kien || "Phụ kiện đi kèm"}</td>

                          <td>
                            <input
                              type="number"
                              min="1"
                              value={luaChonVatPham[key] || ""}
                              onChange={(e) =>
                                thayDoiLuaChon(key, e.target.value)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </>
    );
  }
  */

  useEffect(() => {
    layDanhSachDon();
  }, [trangHienTai, trangThaiLoc]);

  const danhSachVatPhamBanGiaoChiTiet = chiTietDon?.vat_pham_ban_giao || [];

  const danhSachAnhHopDongChiTiet = (chiTietDon?.tep_don_thue || []).filter(
    (tep) => Number(tep.muc_dich_id) === 2601
  );

  const danhSachAnhBanGiaoChiTiet = (chiTietDon?.tep_don_thue || []).filter(
    (tep) => Number(tep.muc_dich_id) === 2602
  );

  const danhSachAnhKhiTraChiTiet = (chiTietDon?.tep_don_thue || []).filter(
    (tep) => Number(tep.muc_dich_id) === 2603
  );

  return (
    <div className="khung-trang">
      <h2>Quản lý đơn thuê</h2>

      {thongBao && <p className="thong-bao">{thongBao}</p>}

      <div className="bo-loc-don-hang">
        <label>Trạng thái</label>

        <select
          value={trangThaiLoc}
          onChange={(e) => {
            setTrangThaiLoc(e.target.value);
            setTrangHienTai(1);
          }}
        >
          <option value="">Tất cả</option>
          <option value="1102">Đã giữ chỗ</option>
          <option value="1103">Đang thuê</option>
          <option value="1104">Hoàn thành</option>
          <option value="1105">Quá hạn</option>
          <option value="1101">Đã hủy</option>
        </select>
      </div>

      {dangTai ? (
        <p className="thong-bao">Đang tải danh sách đơn thuê...</p>
      ) : (
        <>
          <div className="admin-bang-wrapper">
            <table className="bang-quan-ly bang-gon">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Ngày nhận</th>
                  <th>Ngày trả</th>
                  <th>Tiền thuê</th>
                  <th>Tiền cọc</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {danhSachDon.map((don, index) => (
                  <tr key={don.id}>
                    <td>{(trangHienTai - 1) * SO_DONG_MOI_TRANG + index + 1}</td>
                    <td>{don.ma_don}</td>
                    <td>{don.ten_khach_hang}</td>
                    <td>{dinhDangNgay(don.ngay_nhan)}</td>
                    <td>{dinhDangNgay(don.ngay_tra)}</td>
                    <td>{dinhDangTien(don.tong_tien_thue)}</td>
                    <td>{dinhDangTien(don.tong_tien_coc)}</td>
                    <td>{layTenTrangThai(don.trang_thai, don.ten_trang_thai)}</td>
                    <td>
                      <div className="cot-thao-tac">
                        <button onClick={() => xemChiTiet(don.id)}>
                          Xem chi tiết
                        </button>

                        {Number(don.trang_thai) === TRANG_THAI_DA_GIU_CHO && (
                          <button onClick={() => moLapBanGiao(don.id)}>
                            Bàn giao
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {danhSachDon.length === 0 && (
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
              disabled={trangHienTai === 1}
              onClick={() => setTrangHienTai(trangHienTai - 1)}
            >
              Trước
            </button>

            <span>
              Trang {trangHienTai} / {tongTrang}
            </span>

            <button
              disabled={trangHienTai === tongTrang}
              onClick={() => setTrangHienTai(trangHienTai + 1)}
            >
              Sau
            </button>
          </div>
        </>
      )}

      {moPopupChiTiet && (
        <div className="popup-nen">
          <div className="popup-hop popup-lon">
            <div className="popup-tieu-de">
              <h3>Chi tiết đơn thuê</h3>
              <button onClick={dongPopupChiTiet}>Đóng</button>
            </div>

            <div className="popup-noi-dung">
              {dangTaiChiTiet ? (
                <p>Đang tải chi tiết đơn...</p>
              ) : chiTietDon ? (
                <>
                  <h3>Thông tin đơn</h3>

                  <table className="bang-popup bang-gon">
                    <tbody>
                      <tr>
                        <td>Mã đơn</td>
                        <td>{chiTietDon.ma_don}</td>
                      </tr>
                      <tr>
                        <td>Khách hàng</td>
                        <td>{chiTietDon.ten_khach_hang}</td>
                      </tr>
                      <tr>
                        <td>Email</td>
                        <td>{hienThi(chiTietDon.email_khach_hang)}</td>
                      </tr>
                      <tr>
                        <td>SĐT</td>
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
                        <td>Trạng thái</td>
                        <td>
                          {layTenTrangThai(
                            chiTietDon.trang_thai,
                            chiTietDon.ten_trang_thai
                          )}
                        </td>
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
                        <td>Ghi chú bàn giao</td>
                        <td>{hienThi(chiTietDon.ghi_chu_ban_giao)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <h3>Chi tiết sản phẩm</h3>

                  <table className="bang-popup bang-gon">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Mẫu thiết bị</th>
                        <th>Số lượng</th>
                        <th>Tiền thuê</th>
                        <th>Tiền cọc</th>
                      </tr>
                    </thead>

                    <tbody>
                      {(chiTietDon.chi_tiet || []).map((dong, index) => (
                        <tr key={dong.id}>
                          <td>{index + 1}</td>
                          <td>
                            {dong.ten_hang} {dong.ten_mau}
                          </td>
                          <td>{dong.so_luong}</td>
                          <td>{dinhDangTien(dong.tien_thue)}</td>
                          <td>{dinhDangTien(dong.tien_coc)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <h3>Vật phẩm đã bàn giao</h3>

                  {danhSachVatPhamBanGiaoChiTiet.length === 0 ? (
                    <p>Chưa có dữ liệu bàn giao.</p>
                  ) : (
                    <table className="bang-popup bang-gon">
                      <thead>
                        <tr>
                          <th>Vật phẩm</th>
                          <th>Mã tài sản</th>
                          <th>Serial</th>
                          <th>Số lượng</th>
                          {/* <th>Tình trạng bàn giao</th> */}
                        </tr>
                      </thead>

                      <tbody>
                        {danhSachVatPhamBanGiaoChiTiet.map((item) => (
                          <tr key={item.id}>
                            <td>
                              {hienThi(
                                item.ten_vat_pham_snapshot || item.ten_phu_kien
                              )}
                            </td>
                            <td>
                              {hienThi(
                                item.ma_tai_san_snapshot || item.ma_tai_san
                              )}
                            </td>
                            <td>
                              {hienThi(
                                item.so_serial_snapshot || item.so_serial
                              )}
                            </td>
                            <td>{hienThi(item.so_luong_giao)}</td>
                            {/* <td>{hienThi(item.tinh_trang_truoc)}</td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  <h3>Ảnh hợp đồng giấy</h3>

                  {danhSachAnhHopDongChiTiet.length === 0 ? (
                    <p>Chưa có ảnh.</p>
                  ) : (
                    <div className="nhom-anh-popup">
                      {danhSachAnhHopDongChiTiet.map((tep) => (
                        <img
                          key={tep.id}
                          src={tep.file_url}
                          alt={tep.ten_file_goc || "Ảnh hợp đồng giấy"}
                          onClick={() => setAnhDangXem(tep.file_url)}
                        />
                      ))}
                    </div>
                  )}

                  <h3>Ảnh bàn giao</h3>

                  {danhSachAnhBanGiaoChiTiet.length === 0 ? (
                    <p>Chưa có ảnh.</p>
                  ) : (
                    <div className="nhom-anh-popup">
                      {danhSachAnhBanGiaoChiTiet.map((tep) => (
                        <img
                          key={tep.id}
                          src={tep.file_url}
                          alt={tep.ten_file_goc || "Ảnh bàn giao"}
                          onClick={() => setAnhDangXem(tep.file_url)}
                        />
                      ))}
                    </div>
                  )}

                  <h3>Ảnh khi trả</h3>

                  {danhSachAnhKhiTraChiTiet.length === 0 ? (
                    <p>Chưa có ảnh.</p>
                  ) : (
                    <div className="nhom-anh-popup">
                      {danhSachAnhKhiTraChiTiet.map((tep) => (
                        <img
                          key={tep.id}
                          src={tep.file_url}
                          alt={tep.ten_file_goc || "Ảnh khi trả"}
                          onClick={() => setAnhDangXem(tep.file_url)}
                        />
                      ))}
                    </div>
                  )}

                  <h3>Thông tin thanh toán</h3>

                  <table className="bang-popup bang-gon">
                    <thead>
                      <tr>
                        <th>Loại tiền</th>
                        <th>Số tiền</th>
                        <th>Ghi chú</th>
                        <th>Ngày</th>
                      </tr>
                    </thead>

                    <tbody>
                      {(chiTietDon.thanh_toan || []).map((tt) => (
                        <tr key={tt.id}>
                          <td>{hienThi(tt.ten_loai_dong_tien)}</td>
                          <td>{dinhDangTien(tt.so_tien)}</td>
                          <td>{hienThi(tt.ghi_chu)}</td>
                          <td>{dinhDangNgay(tt.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <p>Không có dữ liệu chi tiết.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {moPopupBanGiao && (
        <div className="popup-nen">
          <div className="popup-hop popup-rong">
            <div className="popup-tieu-de">
              <h3>Lập phiếu bàn giao</h3>
              <button onClick={dongPopupBanGiao}>Đóng</button>
            </div>

            <div className="popup-noi-dung">
              {!donBanGiao ? (
                <p>Đang tải dữ liệu bàn giao...</p>
              ) : (
                <>
                  <h3>Thông tin đơn</h3>

                  <table className="bang-popup bang-gon">
                    <tbody>
                      <tr>
                        <td>Mã đơn</td>
                        <td>{donBanGiao.ma_don}</td>
                      </tr>
                      <tr>
                        <td>Khách hàng</td>
                        <td>{donBanGiao.ten_khach_hang}</td>
                      </tr>
                      <tr>
                        <td>Ngày nhận</td>
                        <td>{dinhDangNgay(donBanGiao.ngay_nhan)}</td>
                      </tr>
                      <tr>
                        <td>Ngày trả</td>
                        <td>{dinhDangNgay(donBanGiao.ngay_tra)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <h3>Chọn tài sản cụ thể</h3>

                  {renderChonTaiSanTheoMau()}

                  {/*
                    Nếu muốn hiển thị theo từng thiết bị thì dùng dòng dưới
                    và comment dòng renderChonTaiSanTheoMau ở trên.

                    {renderChonTaiSanTheoTungThietBi()}
                  */}

                  <h3>Ảnh hợp đồng giấy</h3>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      themAnhToiDa5(e, hopDongFiles, setHopDongFiles, "hợp đồng giấy")
                    }
                  />

                  <p className="chu-mo">
                    Đã chọn {hopDongFiles.length}/5 ảnh hợp đồng giấy.
                  </p>

                  {renderAnhDaChon(hopDongFiles, setHopDongFiles, "Ảnh hợp đồng giấy")}

                  <h3>Ảnh bàn giao</h3>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      themAnhToiDa5(e, anhBanGiaoFiles, setAnhBanGiaoFiles, "bàn giao")
                    }
                  />

                  <p className="chu-mo">
                    Đã chọn {anhBanGiaoFiles.length}/5 ảnh bàn giao.
                  </p>

                  {renderAnhDaChon(anhBanGiaoFiles, setAnhBanGiaoFiles, "Ảnh bàn giao")}

                  <h3>Ghi chú bàn giao</h3>

                  <textarea
                    rows="4"
                    value={ghiChuBanGiao}
                    onChange={(e) => setGhiChuBanGiao(e.target.value)}
                    placeholder="Ví dụ: Máy hoạt động tốt, phụ kiện đầy đủ..."
                    style={{ width: "100%" }}
                  />

                  <div className="popup-actions">
                    <button onClick={xacNhanBanGiao} disabled={dangGuiBanGiao}>
                      {dangGuiBanGiao ? "Đang xác nhận..." : "Xác nhận bàn giao"}
                    </button>

                    <button onClick={dongPopupBanGiao}>Hủy</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {anhDangXem && (
        <div className="popup-nen" onClick={() => setAnhDangXem("")}>
          <div className="popup-anh" onClick={(e) => e.stopPropagation()}>
            <img src={anhDangXem} alt="Ảnh xem lớn" />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrderList;