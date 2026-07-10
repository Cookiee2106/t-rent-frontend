import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DUONG_DAN_API } from "../../api/api";

function EquipmentDetail() {
  const { id } = useParams();

  const SO_MAU_TUONG_TU_MOI_DONG = 4;
  const SO_MAU_TUONG_TU_MUON_LAY = 4;

  const [chiTiet, setChiTiet] = useState(null);
  const [thongBaoThemGio, setThongBaoThemGio] = useState("");
  const [ngayNhan, setNgayNhan] = useState("");
  const [ngayTra, setNgayTra] = useState("");
  const [soLuong, setSoLuong] = useState(1);

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

  function taoHeaderCoToken() {
    const token = localStorage.getItem("token");

    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async function layChiTietMauThietBi() {
    try {
      const phanHoi = await fetch(`${DUONG_DAN_API}/api/equipment-models/${id}`);
      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setChiTiet(duLieu.data);
      } else {
        setThongBaoThemGio(duLieu.message);
      }
    } catch {
      setThongBaoThemGio("Không kết nối được server");
    }
  }

  async function themVaoGioHang() {
    try {
      setThongBaoThemGio("");

      if (!ngayNhan || !ngayTra) {
        setThongBaoThemGio("Vui lòng chọn ngày nhận và ngày trả");
        return;
      }

      if (ngayNhan < NGAY_HOM_NAY || ngayTra < NGAY_HOM_NAY) {
        setThongBaoThemGio("Ngày nhận và ngày trả không được là ngày trong quá khứ");
        return;
      }

      if (new Date(ngayTra) <= new Date(ngayNhan)) {
        setThongBaoThemGio("Ngày trả phải sau ngày nhận");
        return;
      }

      if (Number(soLuong) < 1) {
        setThongBaoThemGio("Số lượng phải lớn hơn 0");
        return;
      }

      // Bấm thêm giỏ mới kiểm tra khả dụng.
      // Nếu không đủ mẫu chính/bộ đi kèm/phụ kiện thì BE trả lý do.
      const urlKiemTra = `${DUONG_DAN_API}/api/equipment-models/${id}?ngay_nhan=${ngayNhan}&ngay_tra=${ngayTra}&so_luong=${soLuong}`;

      const phanHoiKiemTra = await fetch(urlKiemTra);
      const duLieuKiemTra = await phanHoiKiemTra.json();

      if (!duLieuKiemTra.success) {
        setThongBaoThemGio(duLieuKiemTra.message);
        return;
      }

      if (!duLieuKiemTra.data.co_the_thue) {
        setThongBaoThemGio(duLieuKiemTra.data.ly_do_khong_the_thue);
        return;
      }

      // Gọi API thêm giỏ hàng.
      // Nếu hiện tại bạn chưa làm trang giỏ hàng thì vẫn để nút này.
      const phanHoi = await fetch(`${DUONG_DAN_API}/api/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...taoHeaderCoToken(),
        },
        body: JSON.stringify({
          mau_thiet_bi_id: id,
          so_luong: Number(soLuong),
          ngay_nhan: ngayNhan,
          ngay_tra: ngayTra,
        }),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setThongBaoThemGio("Thêm vào giỏ hàng thành công");
      } else {
        setThongBaoThemGio(duLieu.message);
      }
    } catch {
      setThongBaoThemGio("Không kết nối được server");
    }
  }

  useEffect(() => {
    layChiTietMauThietBi();
  }, [id]);

  if (!chiTiet) {
    return <p className="thong-bao">Đang tải chi tiết mẫu thiết bị...</p>;
  }

  const sanPhamTuongTu = (chiTiet.san_pham_tuong_tu || []).slice(
    0,
    SO_MAU_TUONG_TU_MUON_LAY
  );

  return (
    <div className="khung-chi-tiet-day-du">
      <div className="khung-anh-chi-tiet-tren">
        {chiTiet.anh_url ? (
          <img src={chiTiet.anh_url} alt={chiTiet.ten_mau} />
        ) : (
          <div className="khung-khong-anh">Không có ảnh</div>
        )}
      </div>

      <div className="noi-dung-chi-tiet-duoi">
        <table className="bang-don-gian bang-chi-tiet-mau">
          <tbody>
            <tr>
              <td>Hãng</td>
              <td>{chiTiet.ten_hang}</td>
            </tr>

            <tr>
              <td>Tên mẫu</td>
              <td>{chiTiet.ten_mau}</td>
            </tr>

            <tr>
              <td>Danh mục</td>
              <td>{chiTiet.ten_danh_muc || "Chưa phân loại"}</td>
            </tr>

            <tr>
              <td>Giá thuê/ngày</td>
              <td>{dinhDangTien(chiTiet.gia_thue_ngay)}</td>
            </tr>

            <tr>
              <td>Tiền cọc</td>
              <td>{dinhDangTien(chiTiet.tien_coc)}</td>
            </tr>

            <tr>
              <td>Mô tả</td>
              <td>{chiTiet.mo_ta || "Chưa có mô tả"}</td>
            </tr>
          </tbody>
        </table>

        <h3>Bộ đi kèm</h3>

        {chiTiet.bo_di_kem && chiTiet.bo_di_kem.length > 0 ? (
          <table className="bang-don-gian bang-bo-di-kem">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên vật phẩm</th>
                <th>Số lượng</th>
              </tr>
            </thead>

            <tbody>
              {chiTiet.bo_di_kem.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>

                  <td>
                    {item.ten_mau_phu
                      ? `${item.ten_hang_phu || ""} ${item.ten_mau_phu}`
                      : item.ten_phu_kien || "Chưa rõ"}
                  </td>

                  <td>{item.so_luong}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Chưa có bộ đi kèm.</p>
        )}

        <h3>Chọn thời gian thuê</h3>

        <div className="khung-form-thue">
          <div className="o-form">
            <label>Ngày nhận</label>
            <input
              type="date"
              min={NGAY_HOM_NAY}
              value={ngayNhan}
              onChange={(e) => setNgayNhan(e.target.value)}
            />
          </div>

          <div className="o-form">
            <label>Ngày trả</label>
            <input
              type="date"
              min={NGAY_HOM_NAY}
              value={ngayTra}
              onChange={(e) => setNgayTra(e.target.value)}
            />
          </div>

          <div className="o-form">
            <label>Số lượng</label>
            <input
              type="number"
              min="1"
              value={soLuong}
              onChange={(e) => setSoLuong(e.target.value)}
            />
          </div>
        </div>

        <div className="nhom-nut nhom-nut-chi-tiet">
          <button onClick={themVaoGioHang}>Thêm vào giỏ hàng</button>

          <Link to="/equipments">
            <button>Quay lại danh sách</button>
          </Link>
        </div>

        {/* Lỗi hoặc thông báo thêm giỏ hiện ngay dưới nút thêm giỏ */}
        {thongBaoThemGio && (
          <p className="thong-bao-duoi-nut">{thongBaoThemGio}</p>
        )}
      </div>

      {/*
        ================= SẢN PHẨM TƯƠNG TỰ =================
        Phần này đang comment lại.
        Khi thầy yêu cầu hiển thị sản phẩm tương tự:
        1. Bỏ comment khối JSX bên dưới.
        2. Muốn đổi số mẫu hiển thị thì sửa SO_MAU_TUONG_TU_MUON_LAY.
        3. Muốn đổi số mẫu trên 1 dòng thì sửa SO_MAU_TUONG_TU_MOI_DONG.
      */}

      {/*
      <div className="hang-tieu-de-muc">
        <h2>Sản phẩm tương tự</h2>
      </div>

      <div
        className="luoi-san-pham"
        style={{
          gridTemplateColumns: `repeat(${SO_MAU_TUONG_TU_MOI_DONG}, 1fr)`,
        }}
      >
        {sanPhamTuongTu.map((mau) => (
          <div className="the-san-pham" key={mau.id}>
            <div className="anh-san-pham">
              {mau.anh_url ? (
                <img src={mau.anh_url} alt={mau.ten_mau} />
              ) : (
                <div className="khung-khong-anh">Không có ảnh</div>
              )}
            </div>

            <div className="noi-dung-san-pham">
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
      */}
    </div>
  );
}

export default EquipmentDetail;