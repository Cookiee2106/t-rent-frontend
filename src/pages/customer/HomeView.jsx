import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DUONG_DAN_API } from "../../api/api";

function Home() {
  const SO_SAN_PHAM_MOI_DONG = 4;
  const SO_SAN_PHAM_MUON_LAY = 0;

  const [danhSachMau, setDanhSachMau] = useState([]);
  const [thongBao, setThongBao] = useState("");
  const [popupLoi, setPopupLoi] = useState("");

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

  async function layDanhSachMauThietBi() {
    try {
      setThongBao("");
      setPopupLoi("");

      const phanHoi = await fetch(`${DUONG_DAN_API}/api/equipment-models`);
      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachMau(duLieu.data || []);
      } else {
        setPopupLoi(duLieu.message);
      }
    } catch {
      setPopupLoi("Không kết nối được server");
    }
  }

  useEffect(() => {
    layDanhSachMauThietBi();
  }, []);

  const danhSachHienThi =
    SO_SAN_PHAM_MUON_LAY === 0
      ? danhSachMau
      : danhSachMau.slice(0, SO_SAN_PHAM_MUON_LAY);

  return (
    <div className="khung-trang-san-pham">
      <div className="tieu-de-trang-chu">
        <h1>Trang chủ T-Rent</h1>
        <p>Thuê máy ảnh và thiết bị quay chụp nhanh chóng, rõ ràng.</p>
      </div>

      {thongBao && <p className="thong-bao">{thongBao}</p>}

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

                {/*
                <p>Hãng: {mau.ten_hang || "Chưa có"}</p>

                <p>Danh mục: {mau.ten_danh_muc || "Chưa phân loại"}</p>
                */}

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

                {/*
                Nếu muốn hiện lại nút xem chi tiết thì mở comment đoạn này.
                Khi mở nút thì nên bỏ Link đang bọc toàn bộ card ở bên ngoài.

                <Link to={`/equipments/${mau.id}`}>
                  <button className="nut-rong">Xem chi tiết</button>
                </Link>
                */}
              </div>
            </div>
          </Link>
        ))}

        {danhSachHienThi.length === 0 && (
          <p className="thong-bao">Chưa có mẫu thiết bị nào.</p>
        )}
      </div>

      <div className="nhom-nut">
        <Link to="/equipments">
          <button>Xem tất cả mẫu thiết bị</button>
        </Link>
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

export default Home;