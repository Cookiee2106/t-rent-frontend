import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { DUONG_DAN_API } from "../../api/api";
import {
  CAU_HINH_BO_LOC_MAU_THIET_BI,
  CAU_HINH_DANH_MUC,
  CAU_HINH_TRANG_MAU_THIET_BI,
  chuanHoaChuoi,
  mauThuocDanhMuc,
  timCauHinhDanhMucTheoSlug,
} from "../../config/equipmentDisplayConfig";

function EquipmentList() {
  const [searchParams] = useSearchParams();
  const nhom = searchParams.get("nhom") || "";
  const cauHinhDanhMuc = timCauHinhDanhMucTheoSlug(nhom);
  const laTrangTatCa = !cauHinhDanhMuc;

  const SO_SAN_PHAM_MOI_DONG = cauHinhDanhMuc
    ? cauHinhDanhMuc.soSanPhamMoiDongTrangDanhSach
    : CAU_HINH_TRANG_MAU_THIET_BI.soSanPhamMoiDong;

  const SO_SAN_PHAM_MUON_LAY = cauHinhDanhMuc
    ? cauHinhDanhMuc.soSanPhamMuonLayTrangDanhSach
    : CAU_HINH_TRANG_MAU_THIET_BI.soSanPhamMuonLay;

  const [danhSachMau, setDanhSachMau] = useState([]);
  const [danhSachGoc, setDanhSachGoc] = useState([]);

  const [thongBao, setThongBao] = useState("");
  const [popupLoi, setPopupLoi] = useState("");

  const [hangId, setHangId] = useState("");
  const [danhMucId, setDanhMucId] = useState("");
  const [mucGia, setMucGia] = useState("");
  const [sapXepGia, setSapXepGia] = useState("");

  const [ngayNhan, setNgayNhan] = useState("");
  const [ngayTra, setNgayTra] = useState("");

  const [daTimTheoNgay, setDaTimTheoNgay] = useState(false);
  const [dangTimKiemTheoNgay, setDangTimKiemTheoNgay] = useState(false);

  function layNgayMai() {
    const ngayMai = new Date();
    ngayMai.setDate(ngayMai.getDate() + 1);

    const nam = ngayMai.getFullYear();
    const thang = String(ngayMai.getMonth() + 1).padStart(2, "0");
    const ngay = String(ngayMai.getDate()).padStart(2, "0");

    return `${nam}-${thang}-${ngay}`;
  }

  const NGAY_BAT_DAU_DUOC_DAT = layNgayMai();

  function dinhDangTien(giaTri) {
    return Number(giaTri || 0).toLocaleString("vi-VN") + " đ";
  }

  function layTenVatPhamDiKem(item) {
    return item.ten_hien_thi || item.ten_mau_phu || item.ten_phu_kien || "";
  }

  function hienThiBoDiKem(mau) {
    const danhSach = (mau.bo_di_kem || []).filter((item) =>
      layTenVatPhamDiKem(item)
    );

    if (danhSach.length === 0) {
      return (
        <div className="bo-di-kem-chip-box">
          <p className="tieu-de-bo-di-kem">Bộ đi kèm:</p>
          <p className="khong-co-bo-di-kem-card">Không có bộ đi kèm</p>
        </div>
      );
    }

    return (
      <div className="bo-di-kem-chip-box">
        <p className="tieu-de-bo-di-kem">Bộ đi kèm:</p>

        <div className="danh-sach-chip-bo-di-kem">
          {danhSach.map((item) => (
            <span className="chip-bo-di-kem" key={item.id}>
              {layTenVatPhamDiKem(item)} x{item.so_luong || 1}
            </span>
          ))}
        </div>
      </div>
    );
  }

  async function layDanhSachMauThietBi(coLocNgay = false) {
    try {
      setThongBao("");
      setPopupLoi("");

      const params = new URLSearchParams();

      if (coLocNgay) {
        if (!ngayNhan || !ngayTra) {
          return;
        }

        if (
          ngayNhan < NGAY_BAT_DAU_DUOC_DAT ||
          ngayTra < NGAY_BAT_DAU_DUOC_DAT
        ) {
          setPopupLoi("Ngày nhận và ngày trả phải từ ngày mai trở đi");
          return;
        }

        if (new Date(ngayTra) <= new Date(ngayNhan)) {
          setPopupLoi("Ngày trả phải sau ngày nhận");
          return;
        }

        params.set("ngay_nhan", ngayNhan);
        params.set("ngay_tra", ngayTra);

        setDaTimTheoNgay(false);
        setDangTimKiemTheoNgay(true);
      }

      const chuoiQuery = params.toString();
      const url = chuoiQuery
        ? `${DUONG_DAN_API}/api/equipment-models?${chuoiQuery}`
        : `${DUONG_DAN_API}/api/equipment-models`;

      const phanHoi = await fetch(url);
      const duLieu = await phanHoi.json();

      if (!duLieu.success) {
        setDaTimTheoNgay(false);
        setPopupLoi(duLieu.message);
        return;
      }

      setDanhSachMau(duLieu.data || []);

      if (!coLocNgay) {
        setDanhSachGoc(duLieu.data || []);
      }

      setDaTimTheoNgay(coLocNgay);

      if (coLocNgay && (duLieu.data || []).length === 0) {
        setThongBao("Không có mẫu thiết bị sẵn sàng trong khoảng ngày đã chọn");
      }
    } catch {
      setDaTimTheoNgay(false);
      setPopupLoi("Không kết nối được server");
    } finally {
      setDangTimKiemTheoNgay(false);
    }
  }

  function xoaLoc() {
    setHangId("");
    setDanhMucId("");
    setMucGia("");
    setSapXepGia("");
    setNgayNhan("");
    setNgayTra("");
    setThongBao("");
    setPopupLoi("");
    setDaTimTheoNgay(false);
    setDanhSachMau(danhSachGoc);
  }

  // Tải toàn bộ mẫu thiết bị khi vào trang.
  useEffect(() => {
    layDanhSachMauThietBi(false);
  }, []);

  // Khi đã chọn đủ ngày nhận và ngày trả thì tự động gọi API.
  useEffect(() => {
    if (!ngayNhan || !ngayTra) {
      return;
    }

    layDanhSachMauThietBi(true);
  }, [ngayNhan, ngayTra]);

  const danhSachHang = useMemo(() => {
    const map = new Map();

    danhSachGoc.forEach((mau) => {
      if (mau.hang_id && mau.ten_hang) {
        map.set(String(mau.hang_id), mau.ten_hang);
      }
    });

    const tatCaHang = Array.from(map.entries()).map(([id, ten_hang]) => ({
      id,
      ten_hang,
    }));

    if (CAU_HINH_BO_LOC_MAU_THIET_BI.hang.layTatCa) {
      return tatCaHang;
    }

    const danhSachTenDuocPhep =
      CAU_HINH_BO_LOC_MAU_THIET_BI.hang.danhSachTen.map(chuanHoaChuoi);

    return tatCaHang.filter((hang) =>
      danhSachTenDuocPhep.includes(chuanHoaChuoi(hang.ten_hang))
    );
  }, [danhSachGoc]);

  const danhSachDanhMuc = useMemo(() => {
    const map = new Map();

    danhSachGoc.forEach((mau) => {
      if (mau.danh_muc_id && mau.ten_danh_muc) {
        map.set(String(mau.danh_muc_id), mau.ten_danh_muc);
      }
    });

    const tatCaDanhMuc = Array.from(map.entries()).map(
      ([id, ten_danh_muc]) => ({
        id,
        ten_danh_muc,
      })
    );

    if (CAU_HINH_BO_LOC_MAU_THIET_BI.danhMuc.layTatCa) {
      return tatCaDanhMuc;
    }

    const danhSachTenDuocPhep =
      CAU_HINH_BO_LOC_MAU_THIET_BI.danhMuc.danhSachTen.map(chuanHoaChuoi);

    return tatCaDanhMuc.filter((danhMuc) =>
      danhSachTenDuocPhep.includes(
        chuanHoaChuoi(danhMuc.ten_danh_muc)
      )
    );
  }, [danhSachGoc]);

  const danhSachSauKhiLoc = useMemo(() => {
    /*
      TRƯỜNG HỢP MUỐN LẤY TẤT CẢ MẪU ĐANG HIỂN THỊ:
      Giữ nguyên dòng dưới để sau này có thể dùng lại.

      let ketQua = [...danhSachMau];
    */

    // Hiện tại chỉ lấy những mẫu thuộc hãng và danh mục được phép trong cấu hình.
    let ketQua = danhSachMau.filter((mau) => {
      const cauHinhHang = CAU_HINH_BO_LOC_MAU_THIET_BI.hang;
      const cauHinhDanhMucLoc = CAU_HINH_BO_LOC_MAU_THIET_BI.danhMuc;

      const duocHienThiTheoHang =
        cauHinhHang.layTatCa ||
        cauHinhHang.danhSachTen
          .map(chuanHoaChuoi)
          .includes(chuanHoaChuoi(mau.ten_hang));

      const duocHienThiTheoDanhMuc =
        cauHinhDanhMucLoc.layTatCa ||
        cauHinhDanhMucLoc.danhSachTen
          .map(chuanHoaChuoi)
          .includes(chuanHoaChuoi(mau.ten_danh_muc));

      return duocHienThiTheoHang && duocHienThiTheoDanhMuc;
    });

    if (cauHinhDanhMuc) {
      ketQua = ketQua.filter((mau) =>
        mauThuocDanhMuc(mau, cauHinhDanhMuc)
      );
    }

    if (hangId) {
      ketQua = ketQua.filter(
        (mau) => String(mau.hang_id || "") === String(hangId)
      );
    }

    if (laTrangTatCa && danhMucId) {
      ketQua = ketQua.filter(
        (mau) => String(mau.danh_muc_id || "") === String(danhMucId)
      );
    }

    if (mucGia) {
      const cauHinhMucGia =
        CAU_HINH_BO_LOC_MAU_THIET_BI.mucGia.find(
          (item) => item.giaTri === mucGia
        );

      if (cauHinhMucGia) {
        ketQua = ketQua.filter((mau) => {
          const giaThue = Number(mau.gia_thue_ngay || 0);

          const dungGiaTu =
            cauHinhMucGia.tu === null || giaThue >= cauHinhMucGia.tu;

          const dungGiaDen =
            cauHinhMucGia.den === null || giaThue <= cauHinhMucGia.den;

          return dungGiaTu && dungGiaDen;
        });
      }
    }

    if (sapXepGia === "thap-den-cao") {
      ketQua.sort(
        (a, b) =>
          Number(a.gia_thue_ngay || 0) -
          Number(b.gia_thue_ngay || 0)
      );
    }

    if (sapXepGia === "cao-den-thap") {
      ketQua.sort(
        (a, b) =>
          Number(b.gia_thue_ngay || 0) -
          Number(a.gia_thue_ngay || 0)
      );
    }

    return Number(SO_SAN_PHAM_MUON_LAY) === 0
      ? ketQua
      : ketQua.slice(0, Number(SO_SAN_PHAM_MUON_LAY));
  }, [
    danhSachMau,
    cauHinhDanhMuc,
    hangId,
    danhMucId,
    mucGia,
    sapXepGia,
    laTrangTatCa,
    SO_SAN_PHAM_MUON_LAY,
  ]);

  return (
    <div className="khung-trang-san-pham trang-cua-hang-moi">
      <nav className="breadcrumb-cua-hang" aria-label="Breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span>/</span>

        {cauHinhDanhMuc ? (
          <>
            <Link to="/equipments">Mẫu thiết bị</Link>
            <span>/</span>
            <span className="breadcrumb-muc-hien-tai">{cauHinhDanhMuc.ten}</span>
          </>
        ) : (
          <span className="breadcrumb-muc-hien-tai">Mẫu thiết bị</span>
        )}
      </nav>

      <div className="khung-loc-cua-hang">
        <div className="o-loc-san-pham">
          <label>Hãng</label>
          <select value={hangId} onChange={(e) => setHangId(e.target.value)}>
            <option value="">Tất cả hãng</option>

            {danhSachHang.map((hang) => (
              <option key={hang.id} value={hang.id}>
                {hang.ten_hang}
              </option>
            ))}
          </select>
        </div>

        {laTrangTatCa && (
          <div className="o-loc-san-pham">
            <label>Danh mục</label>
            <select
              value={danhMucId}
              onChange={(e) => setDanhMucId(e.target.value)}
            >
              <option value="">Tất cả danh mục</option>

              {danhSachDanhMuc.map((danhMuc) => (
                <option key={danhMuc.id} value={danhMuc.id}>
                  {danhMuc.ten_danh_muc}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* <div className="o-loc-san-pham">
          <label>Mức giá thuê / ngày</label>
          <select
            value={mucGia}
            onChange={(e) => setMucGia(e.target.value)}
          >
            <option value="">Tất cả mức giá</option>

            {CAU_HINH_BO_LOC_MAU_THIET_BI.mucGia.map((item) => (
              <option key={item.giaTri} value={item.giaTri}>
                {item.ten}
              </option>
            ))}
          </select>
        </div> */}

        <div className="o-loc-san-pham">
          <label>Sắp xếp giá</label>
          <select
            value={sapXepGia}
            onChange={(e) => setSapXepGia(e.target.value)}
          >
            <option value="">Mặc định</option>
            <option value="thap-den-cao">Thấp đến cao</option>
            <option value="cao-den-thap">Cao đến thấp</option>
          </select>
        </div>

        <div className="o-loc-san-pham">
          <label>Ngày nhận</label>
          <input
            type="date"
            min={NGAY_BAT_DAU_DUOC_DAT}
            value={ngayNhan}
            onChange={(e) => setNgayNhan(e.target.value)}
          />
        </div>

        <div className="o-loc-san-pham">
          <label>Ngày trả</label>
          <input
            type="date"
            min={NGAY_BAT_DAU_DUOC_DAT}
            value={ngayTra}
            onChange={(e) => setNgayTra(e.target.value)}
          />
        </div>

        <div className="nhom-nut-loc-san-pham">
          <button
            className="nut-huy"
            type="button"
            onClick={xoaLoc}
          >
            Xóa lọc
          </button>
        </div>
      </div>

      {dangTimKiemTheoNgay && (
        <p className="chu-mo thong-bao-dang-loc-ngay">
          Đang kiểm tra thiết bị sẵn sàng...
        </p>
      )}

      {thongBao && <p className="thong-bao">{thongBao}</p>}

      {danhSachSauKhiLoc.length === 0 && !thongBao && (
        <p className="thong-bao">Không tìm thấy mẫu thiết bị phù hợp.</p>
      )}

      <div
        className="luoi-san-pham"
        style={{
          gridTemplateColumns: `repeat(${SO_SAN_PHAM_MOI_DONG}, minmax(0, 1fr))`,
        }}
      >
        {danhSachSauKhiLoc.map((mau) => (
          <Link
            to={`/equipments/${mau.id}`}
            className="link-card-san-pham"
            key={mau.id}
          >
            <div className="the-san-pham">
              <div className="anh-san-pham">
                {mau.anh_url ? (
                  <img src={mau.anh_url} alt={mau.ten_mau} />
                ) : (
                  <div className="khung-khong-anh">Không có ảnh</div>
                )}
              </div>

              <div className="noi-dung-san-pham">
                <div className="ten-san-pham">{mau.ten_mau}</div>

                <div className="khung-gia-card">
                  <p className="dong-thong-tin-card gia-thue-card">
                    Giá thuê/ngày: <b>{dinhDangTien(mau.gia_thue_ngay)}</b>
                  </p>

                  <p className="dong-thong-tin-card tien-coc-card">
                    Tiền cọc: <b>{dinhDangTien(mau.tien_coc)}</b>
                  </p>
                </div>

                <div className="khoang-bo-di-kem-card">
                  {hienThiBoDiKem(mau)}
                </div>

                {dangTimKiemTheoNgay ? (
                  <p className="chu-mo dong-thong-tin-card trang-thai-san-sang-card">
                    Đang kiểm tra bộ sẵn sàng...
                  </p>
                ) : daTimTheoNgay ? (
                  <p className="dong-thong-tin-card trang-thai-san-sang-card">
                    Bộ sẵn sàng: {mau.so_luong_san_sang || 0}
                  </p>
                ) : (
                  <p className="chu-mo dong-thong-tin-card trang-thai-san-sang-card">
                    Chọn đủ ngày nhận và ngày trả để kiểm tra bộ sẵn sàng
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {popupLoi && (
        <div className="popup-thong-bao-overlay">
          <div className="popup-thong-bao">
            <p>{popupLoi}</p>

            <button
              className="nut-dong-y"
              type="button"
              onClick={() => setPopupLoi("")}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EquipmentList;