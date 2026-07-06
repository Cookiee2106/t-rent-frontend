import { useEffect, useState } from "react";
import { DUONG_DAN_API } from "../../api/api";

function Home() {
  const SO_SAN_PHAM_LAY = 4;
  const SO_SAN_PHAM_MOT_DONG = 4;

  const [danhSachSanPham, setDanhSachSanPham] = useState([]);
  const [thongBao, setThongBao] = useState("");

  function dinhDangTien(soTien) {
    return Number(soTien || 0).toLocaleString("vi-VN") + "đ";
  }

  async function laySanPhamNoiBat() {
    const phanHoi = await fetch(
      `${DUONG_DAN_API}/api/equipment-models?limit=${SO_SAN_PHAM_LAY}`
    );

    const duLieu = await phanHoi.json();

    if (duLieu.success) {
      setDanhSachSanPham(duLieu.data);
    } else {
      setThongBao(duLieu.message);
    }
  }

  function xemChiTiet() {
    alert("Chức năng xem chi tiết sẽ làm sau");
  }

  useEffect(() => {
    laySanPhamNoiBat();
  }, []);

  return (
    <div>
      <div className="tieu-de-trang-chu">
        <h2>Trang chủ T-Rent</h2>
        <p>Website cho thuê máy ảnh và thiết bị quay chụp.</p>
      </div>

      <h3>Sản phẩm nổi bật</h3>

      {thongBao && <p>{thongBao}</p>}

      <div
        className="luoi-san-pham"
        style={{
          gridTemplateColumns: `repeat(${SO_SAN_PHAM_MOT_DONG}, 1fr)`,
        }}
      >
        {danhSachSanPham.map((sanPham) => (
          <div className="the-san-pham" key={sanPham.id}>
            <div className="anh-san-pham">
              {sanPham.anh_url ? (
                <img src={sanPham.anh_url} alt={sanPham.ten_mau} />
              ) : (
                <div className="khung-khong-anh">Không có ảnh</div>
              )}
            </div>

            <div className="noi-dung-san-pham">
              <p>
                <b>{sanPham.ten_hang}</b>
              </p>

              <h3 className="ten-san-pham">{sanPham.ten_mau}</h3>

              <p>Giá thuê/ngày: {dinhDangTien(sanPham.gia_thue_ngay)}</p>
              <p>Tiền cọc: {dinhDangTien(sanPham.tien_coc)}</p>

              <button className="nut-rong" onClick={xemChiTiet}>
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;