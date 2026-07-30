import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DUONG_DAN_API } from "../../api/api";
import {
  CAU_HINH_DANH_MUC,
  layTheoSoLuong,
  mauThuocDanhMuc,
} from "../../config/equipmentDisplayConfig";

function Home() {
  const ANH_BANNER =
    "https://res.cloudinary.com/dfxbfk4zp/image/upload/v1785330764/Screenshot_2026-07-29_195411_zdjzbp.png";

  const [danhSachMau, setDanhSachMau] = useState([]);
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

  // Chỉ những danh mục có hienTrangChu = true mới xuất hiện ở Sản phẩm nổi bật.
  const danhSachMucNoiBat = useMemo(() => {
    return CAU_HINH_DANH_MUC.filter((item) => item.hienTrangChu).map(
      (cauHinh) => {
        const danhSachTheoDanhMuc = danhSachMau.filter((mau) =>
          mauThuocDanhMuc(mau, cauHinh)
        );

        return {
          ...cauHinh,
          danhSach: layTheoSoLuong(
            danhSachTheoDanhMuc,
            cauHinh.soSanPhamMuonLayTrangChu
          ),
        };
      }
    );
  }, [danhSachMau]);

  function renderDanhSachSanPham(danhSach, soSanPhamMoiDong) {
    return (
      <div
        className="luoi-san-pham"
        style={{
          gridTemplateColumns: `repeat(${soSanPhamMoiDong}, minmax(0, 1fr))`,
        }}
      >
        {danhSach.map((mau) => (
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
              </div>
            </div>
          </Link>
        ))}

        {danhSach.length === 0 && (
          <p className="thong-bao">Chưa có sản phẩm trong mục này.</p>
        )}
      </div>
    );
  }

  return (
    <div className="khung-trang-san-pham trang-chu-moi">
      <div className="banner-trang-chu-moi">
        <img
          className="anh-banner-trang-chu-moi"
          src={ANH_BANNER}
          alt="Banner thuê thiết bị T-Rent"
        />

        <div className="noi-dung-banner-trang-chu-moi">
          <h1>Thuê thiết bị quay chụp tại T-Rent</h1>
          <p>Nhanh chóng, rõ ràng và thuận tiện</p>

          <Link to="/equipments">
            <button className="nut-banner-trang-chu">Xem mẫu thiết bị</button>
          </Link>
        </div>
      </div>

      <section className="khung-san-pham-noi-bat-moi">
        <div className="tieu-de-khoi-lon">
          <h2>Sản phẩm nổi bật</h2>
        </div>

        {danhSachMucNoiBat.map((muc) => (
          <div className="muc-noi-bat-rieng" key={muc.slug}>
            <div className="hang-tieu-de-muc-co-nut">
              <h3>{muc.ten}</h3>

              <Link
                to={`/equipments?nhom=${muc.slug}`}
                className="link-xem-them"
              >
                Xem thêm <span aria-hidden="true">›</span>
              </Link>
            </div>

            {renderDanhSachSanPham(
              muc.danhSach,
              muc.soSanPhamMoiDongTrangChu
            )}
          </div>
        ))}
      </section>

      <section className="khung-quy-trinh-thue-moi">
        <div className="tieu-de-khoi-lon">
          <h2>Quy trình thuê tại T-Rent</h2>
          <p>Chỉ với 3 bước đơn giản</p>
        </div>

        <div className="luoi-quy-trinh-thue">
          <div className="the-buoc-thue">
            <div className="so-buoc-thue">1</div>
            <h3>Chọn thiết bị</h3>
            <p>Chọn mẫu thiết bị phù hợp với nhu cầu của bạn.</p>
          </div>

          <div className="the-buoc-thue">
            <div className="so-buoc-thue">2</div>
            <h3>Thanh toán</h3>
            <p>Chọn thời gian thuê, tạo đơn và thanh toán tiền cọc.</p>
          </div>

          <div className="the-buoc-thue">
            <div className="so-buoc-thue">3</div>
            <h3>Nhận và trả</h3>
            <p>Nhận thiết bị đúng hẹn và hoàn trả sau khi sử dụng.</p>
          </div>
        </div>
      </section>

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
