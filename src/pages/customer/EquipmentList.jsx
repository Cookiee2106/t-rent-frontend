import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DUONG_DAN_API } from "../../api/api";

function EquipmentList() {
  const SO_SAN_PHAM_MOI_DONG = 4;

  // Mặc định lấy tất cả.
  // Nếu thầy yêu cầu chỉ hiện 8 mẫu thì sửa 0 thành 8.
  const SO_SAN_PHAM_MUON_LAY = 0;

  const [danhSachMau, setDanhSachMau] = useState([]);
  const [thongBao, setThongBao] = useState("");
  const [tuKhoa, setTuKhoa] = useState("");
  const [ngayNhan, setNgayNhan] = useState("");
  const [ngayTra, setNgayTra] = useState("");

  function layNgayHomNay() {
    const homNay = new Date();
    const nam = homNay.getFullYear();
    const thang = String(homNay.getMonth() + 1).padStart(2, "0");
    const ngay = String(homNay.getDate()).padStart(2, "0");

    return `${nam}-${thang}-${ngay}`;
  }

  const NGAY_HOM_NAY = layNgayHomNay();

  function dinhDangTien(giaTri) {
    return Number(giaTri || 0).toLocaleString("vi-VN") + " đ";
  }

  async function layDanhSachMauThietBi(coLocNgay = false) {
    try {
      setThongBao("");

      let url = `${DUONG_DAN_API}/api/equipment-models`;

      if (coLocNgay) {
        if (!ngayNhan || !ngayTra) {
          setThongBao("Vui lòng chọn đủ ngày nhận và ngày trả");
          return;
        }

        if (ngayNhan < NGAY_HOM_NAY || ngayTra < NGAY_HOM_NAY) {
          setThongBao("Ngày nhận và ngày trả không được là ngày trong quá khứ");
          return;
        }

        if (new Date(ngayTra) <= new Date(ngayNhan)) {
          setThongBao("Ngày trả phải sau ngày nhận");
          return;
        }

        url = `${url}?ngay_nhan=${ngayNhan}&ngay_tra=${ngayTra}`;
      }

      const phanHoi = await fetch(url);
      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachMau(duLieu.data || []);

        if (coLocNgay && (duLieu.data || []).length === 0) {
          setThongBao("Không có mẫu thiết bị sẵn sàng trong khoảng ngày đã chọn");
        }
      } else {
        setThongBao(duLieu.message);
      }
    } catch {
      setThongBao("Không kết nối được server");
    }
  }

  function xoaLocNgay() {
    setNgayNhan("");
    setNgayTra("");
    setThongBao("");
    layDanhSachMauThietBi(false);
  }

  useEffect(() => {
    layDanhSachMauThietBi(false);
  }, []);

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
    <div>
      <div className="tieu-de-trang-chu">
        <h1>Mẫu thiết bị</h1>
        <p>Xem danh sách mẫu thiết bị đang cho thuê tại T-Rent.</p>
      </div>

      <div className="khung-loc-san-pham">
        <div className="o-loc-san-pham">
          <label>Tìm kiếm</label>
          <input
            value={tuKhoa}
            onChange={(e) => setTuKhoa(e.target.value)}
            placeholder="Nhập tên hãng, tên mẫu, danh mục..."
          />
        </div>

        <div className="o-loc-san-pham">
          <label>Ngày nhận</label>
          <input
            type="date"
            min={NGAY_HOM_NAY}
            value={ngayNhan}
            onChange={(e) => setNgayNhan(e.target.value)}
          />
        </div>

        <div className="o-loc-san-pham">
          <label>Ngày trả</label>
          <input
            type="date"
            min={NGAY_HOM_NAY}
            value={ngayTra}
            onChange={(e) => setNgayTra(e.target.value)}
          />
        </div>

        <div className="nhom-nut-loc-san-pham">
          <button onClick={() => layDanhSachMauThietBi(true)}>Tìm kiếm</button>
          <button onClick={xoaLocNgay}>Xóa lọc</button>
        </div>
      </div>

      {thongBao && <p className="thong-bao">{thongBao}</p>}

      <div
        className="luoi-san-pham"
        style={{
          gridTemplateColumns: `repeat(${SO_SAN_PHAM_MOI_DONG}, 1fr)`,
        }}
      >
        {danhSachHienThi.map((mau) => (
          <div className="the-san-pham" key={mau.id}>
            <div className="anh-san-pham">
              {mau.anh_url ? (
                <img src={mau.anh_url} alt={mau.ten_mau} />
              ) : (
                <div className="khung-khong-anh">Không có ảnh</div>
              )}
            </div>

            <div className="noi-dung-san-pham">
              {/* Tên chỉ hiện tên mẫu */}
              <div className="ten-san-pham">{mau.ten_mau}</div>

              <p>Hãng: {mau.ten_hang || "Chưa có"}</p>

              <p>Danh mục: {mau.ten_danh_muc || "Chưa phân loại"}</p>

              <p>Giá thuê/ngày: {dinhDangTien(mau.gia_thue_ngay)}</p>

              <p>Tiền cọc: {dinhDangTien(mau.tien_coc)}</p>

              <p>Sẵn sàng: {mau.so_luong_san_sang || 0}</p>

              <Link to={`/equipments/${mau.id}`}>
                <button className="nut-rong">Xem chi tiết</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EquipmentList;