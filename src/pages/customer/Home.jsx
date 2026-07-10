import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DUONG_DAN_API } from "../../api/api";

function Home() {
  const SO_SAN_PHAM_MOI_DONG = 4;
  const SO_SAN_PHAM_MUON_LAY = 4;

  const [danhSachMau, setDanhSachMau] = useState([]);
  const [thongBao, setThongBao] = useState("");

  function dinhDangTien(giaTri) {
    return Number(giaTri || 0).toLocaleString("vi-VN") + " đ";
  }

  async function layDanhSachMauThietBi() {
    try {
      const phanHoi = await fetch(`${DUONG_DAN_API}/api/equipment-models`);
      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachMau(duLieu.data || []);
      } else {
        setThongBao(duLieu.message);
      }
    } catch {
      setThongBao("Không kết nối được server");
    }
  }

  useEffect(() => {
    layDanhSachMauThietBi();
  }, []);

  const danhSachHienThi = danhSachMau.slice(0, SO_SAN_PHAM_MUON_LAY);

  return (
    <div>
      <div className="tieu-de-trang-chu">
        <h1>Trang chủ T-Rent</h1>
        <p>Thuê máy ảnh và thiết bị quay chụp nhanh chóng, rõ ràng.</p>
      </div>

      {thongBao && <p className="thong-bao">{thongBao}</p>}

      {/* Chữ Sản phẩm nổi bật nằm bên trái, ngay trên các card sản phẩm */}
      <div className="hang-tieu-de-muc">
        <h2>Sản phẩm nổi bật</h2>
      </div>

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
              {/* Tên chỉ hiện tên mẫu, không ghép hãng để tránh bị lặp */}
              <div className="ten-san-pham">{mau.ten_mau}</div>

              <p>Hãng: {mau.ten_hang || "Chưa có"}</p>

              <p>Danh mục: {mau.ten_danh_muc || "Chưa phân loại"}</p>

              <p>Giá thuê/ngày: {dinhDangTien(mau.gia_thue_ngay)}</p>

              <p>Tiền cọc: {dinhDangTien(mau.tien_coc)}</p>

              <Link to={`/equipments/${mau.id}`}>
                <button className="nut-rong">Xem chi tiết</button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="nhom-nut">
        <Link to="/equipments">
          <button>Xem tất cả mẫu thiết bị</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;