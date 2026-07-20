import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DUONG_DAN_API } from "../../api/api";

function EquipmentList() {
  const SO_SAN_PHAM_MOI_DONG = 4;
  const SO_SAN_PHAM_MUON_LAY = 0;

  const [danhSachMau, setDanhSachMau] = useState([]);
  const [danhSachGoc, setDanhSachGoc] = useState([]);

  const [thongBao, setThongBao] = useState("");
  const [popupLoi, setPopupLoi] = useState("");

  const [tuKhoa, setTuKhoa] = useState("");
  const [hangId, setHangId] = useState("");
  const [danhMucId, setDanhMucId] = useState("");

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

  function doiNgayNhan(giaTri) {
    setNgayNhan(giaTri);
    setDaTimTheoNgay(false);
    setThongBao("");
  }

  function doiNgayTra(giaTri) {
    setNgayTra(giaTri);
    setDaTimTheoNgay(false);
    setThongBao("");
  }

  async function layDanhSachMauThietBi(coLocNgay = false) {
    try {
      setThongBao("");
      setPopupLoi("");

      const params = new URLSearchParams();

      if (hangId) {
        params.set("hang_id", hangId);
      }

      if (danhMucId) {
        params.set("danh_muc_id", danhMucId);
      }

      if (coLocNgay) {
        if (!ngayNhan || !ngayTra) {
          setPopupLoi("Vui lòng chọn đủ ngày nhận và ngày trả");
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

      if (duLieu.success) {
        setDanhSachMau(duLieu.data || []);

        if (!coLocNgay && !hangId && !danhMucId) {
          setDanhSachGoc(duLieu.data || []);
        }

        if (coLocNgay) {
          setDaTimTheoNgay(true);
        } else {
          setDaTimTheoNgay(false);
        }

        if (coLocNgay && (duLieu.data || []).length === 0) {
          setThongBao("Không có mẫu thiết bị sẵn sàng trong khoảng ngày đã chọn");
        }
      } else {
        setDaTimTheoNgay(false);
        setPopupLoi(duLieu.message);
      }
    } catch {
      setDaTimTheoNgay(false);
      setPopupLoi("Không kết nối được server");
    } finally {
      setDangTimKiemTheoNgay(false);
    }
  }

  function xoaLoc() {
    setTuKhoa("");
    setHangId("");
    setDanhMucId("");
    setNgayNhan("");
    setNgayTra("");
    setThongBao("");
    setPopupLoi("");
    setDaTimTheoNgay(false);
    setDanhSachMau(danhSachGoc);
  }

  useEffect(() => {
    layDanhSachMauThietBi(false);
  }, []);

  useEffect(() => {
    layDanhSachMauThietBi(false);
  }, [hangId, danhMucId]);

  const danhSachHang = useMemo(() => {
    const map = new Map();

    danhSachGoc.forEach((mau) => {
      if (mau.hang_id && mau.ten_hang) {
        map.set(String(mau.hang_id), mau.ten_hang);
      }
    });

    return Array.from(map.entries()).map(([id, ten_hang]) => ({
      id,
      ten_hang,
    }));
  }, [danhSachGoc]);

  const danhSachDanhMuc = useMemo(() => {
    const map = new Map();

    danhSachGoc.forEach((mau) => {
      if (mau.danh_muc_id && mau.ten_danh_muc) {
        map.set(String(mau.danh_muc_id), mau.ten_danh_muc);
      }
    });

    return Array.from(map.entries()).map(([id, ten_danh_muc]) => ({
      id,
      ten_danh_muc,
    }));
  }, [danhSachGoc]);

  const danhSachSauKhiTim = danhSachMau.filter((mau) => {
    const noiDung = `${mau.ten_hang || ""} ${mau.ten_mau || ""} ${
      mau.ten_danh_muc || ""
    }`.toLowerCase();

    return noiDung.includes(tuKhoa.toLowerCase());
  });

  const danhSachHienThi =
    SO_SAN_PHAM_MUON_LAY > 0
      ? danhSachSauKhiTim.slice(0, SO_SAN_PHAM_MUON_LAY)
      : danhSachSauKhiTim;

  return (
    <div className="khung-trang-san-pham">
      <div className="tieu-de-trang-chu">
        <h1>Mẫu thiết bị</h1>
        <p>Xem danh sách mẫu thiết bị đang cho thuê tại T-Rent.</p>
      </div>

      <div className="khung-loc-san-pham khung-loc-san-pham-nhieu-cot">
        <div className="o-loc-san-pham">
          <label>Tìm kiếm</label>
          <input
            value={tuKhoa}
            onChange={(e) => setTuKhoa(e.target.value)}
            placeholder="Nhập tên hãng, tên mẫu, danh mục..."
          />
        </div>

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

        <div className="o-loc-san-pham">
          <label>Danh mục</label>
          <select
            value={danhMucId}
            onChange={(e) => setDanhMucId(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>

            {danhSachDanhMuc.map((dm) => (
              <option key={dm.id} value={dm.id}>
                {dm.ten_danh_muc}
              </option>
            ))}
          </select>
        </div>

        <div className="o-loc-san-pham">
          <label>Ngày nhận</label>
          <input
            type="date"
            min={NGAY_BAT_DAU_DUOC_DAT}
            value={ngayNhan}
            onChange={(e) => doiNgayNhan(e.target.value)}
          />
        </div>

        <div className="o-loc-san-pham">
          <label>Ngày trả</label>
          <input
            type="date"
            min={NGAY_BAT_DAU_DUOC_DAT}
            value={ngayTra}
            onChange={(e) => doiNgayTra(e.target.value)}
          />
        </div>

        <div className="nhom-nut-loc-san-pham">
          <button
            onClick={() => layDanhSachMauThietBi(true)}
            disabled={dangTimKiemTheoNgay}
          >
            {dangTimKiemTheoNgay ? "Đang kiểm tra..." : "Tìm kiếm"}
          </button>

          <button onClick={xoaLoc}>Xóa lọc</button>
        </div>
      </div>

      {thongBao && <p className="thong-bao">{thongBao}</p>}

      {danhSachHienThi.length === 0 && !thongBao && (
        <p className="thong-bao">Không tìm thấy mẫu thiết bị phù hợp.</p>
      )}

      <div
        className="luoi-san-pham"
        style={{
          gridTemplateColumns: `repeat(${SO_SAN_PHAM_MOI_DONG}, 1fr)`,
        }}
      >
        {danhSachHienThi.map((mau) => (
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
                    Chọn ngày và bấm tìm kiếm để kiểm tra bộ sẵn sàng
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