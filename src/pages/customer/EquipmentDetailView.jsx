import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DUONG_DAN_API } from "../../api/api";

function EquipmentDetail() {
  const { id } = useParams();

  const SO_MAU_TUONG_TU_MOI_DONG = 4;
  const SO_MAU_TUONG_TU_MUON_LAY = 4;

  const [chiTiet, setChiTiet] = useState(null);
  const [popupThongBao, setPopupThongBao] = useState("");
  const [thongBaoKhaDung, setThongBaoKhaDung] = useState("");
  const [ngayNhan, setNgayNhan] = useState("");
  const [ngayTra, setNgayTra] = useState("");
  const [soLuong, setSoLuong] = useState(1);
  const [boSanSang, setBoSanSang] = useState(null);
  const [ketQuaKhaDung, setKetQuaKhaDung] = useState(null);
  const [dangKiemTra, setDangKiemTra] = useState(false);

  // Hàm lấy ngày hôm nay.
  // function layNgayHomNay() {
  //   const homNay = new Date();
  //   const nam = homNay.getFullYear();
  //   const thang = String(homNay.getMonth() + 1).padStart(2, "0");
  //   const ngay = String(homNay.getDate()).padStart(2, "0");

  //   return `${nam}-${thang}-${ngay}`;
  // }
  /*
    const NGAY_HOM_NAY = layNgayHomNay();
  */

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

  function taoHeaderCoToken() {
    const token = localStorage.getItem("token");

    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  function moPopup(noiDung) {
    setPopupThongBao(noiDung);
  }

  function kiemTraNgayVaSoLuong() {
    if (!ngayNhan || !ngayTra) {
      return "Vui lòng chọn ngày nhận và ngày trả";
    }

    /*
      if (ngayNhan < NGAY_HOM_NAY || ngayTra < NGAY_HOM_NAY) {
        return "Ngày nhận và ngày trả không được là ngày trong quá khứ";
      }
    */

    if (
      ngayNhan < NGAY_BAT_DAU_DUOC_DAT ||
      ngayTra < NGAY_BAT_DAU_DUOC_DAT
    ) {
      return "Ngày nhận và ngày trả phải từ ngày mai trở đi";
    }

    if (new Date(ngayTra) <= new Date(ngayNhan)) {
      return "Ngày trả phải sau ngày nhận";
    }

    if (Number(soLuong) < 1) {
      return "Số lượng phải lớn hơn 0";
    }

    return "";
  }

  async function layChiTietMauThietBi() {
    try {
      const phanHoi = await fetch(`${DUONG_DAN_API}/api/equipment-models/${id}`);
      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setChiTiet(duLieu.data);
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    }
  }

  async function kiemTraBoSanSang() {
    try {
      setThongBaoKhaDung("");
      setBoSanSang(null);
      setKetQuaKhaDung(null);

      if (!ngayNhan || !ngayTra) {
        return;
      }

      const loi = kiemTraNgayVaSoLuong();

      if (loi) {
        moPopup(loi);
        return;
      }

      setDangKiemTra(true);

      const urlKiemTra = `${DUONG_DAN_API}/api/equipment-models/${id}?ngay_nhan=${ngayNhan}&ngay_tra=${ngayTra}&so_luong=${soLuong}`;

      const phanHoi = await fetch(urlKiemTra);
      const duLieu = await phanHoi.json();

      if (!duLieu.success) {
        moPopup(duLieu.message);
        return;
      }

      setKetQuaKhaDung(duLieu.data);
      setBoSanSang(duLieu.data.so_luong_san_sang || 0);

      if (!duLieu.data.co_the_thue) {
        moPopup(duLieu.data.ly_do_khong_the_thue);
      }
    } catch {
      moPopup("Không kết nối được server");
    } finally {
      setDangKiemTra(false);
    }
  }

  async function themVaoGioHang() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        moPopup("Vui lòng đăng nhập trước khi thêm vào giỏ hàng");
        return;
      }

      const loi = kiemTraNgayVaSoLuong();

      if (loi) {
        moPopup(loi);
        return;
      }

      const urlKiemTra = `${DUONG_DAN_API}/api/equipment-models/${id}?ngay_nhan=${ngayNhan}&ngay_tra=${ngayTra}&so_luong=${soLuong}`;

      const phanHoiKiemTra = await fetch(urlKiemTra);
      const duLieuKiemTra = await phanHoiKiemTra.json();

      if (!duLieuKiemTra.success) {
        moPopup(duLieuKiemTra.message);
        return;
      }

      if (!duLieuKiemTra.data.co_the_thue) {
        moPopup(duLieuKiemTra.data.ly_do_khong_the_thue);
        return;
      }

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
        /*
          Cập nhật lại số mẫu trong giỏ hàng ở Header.
        */
        window.dispatchEvent(new Event("cap-nhat-gio-hang"));

        moPopup("Thêm vào giỏ hàng thành công");
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    }
  }

  useEffect(() => {
    layChiTietMauThietBi();
  }, [id]);

  useEffect(() => {
    kiemTraBoSanSang();
  }, [ngayNhan, ngayTra, soLuong, id]);

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
              <td>Giá thuê/ngày</td>
              <td className="gia-chi-tiet">{dinhDangTien(chiTiet.gia_thue_ngay)}</td>
            </tr>

            <tr>
              <td>Tiền cọc</td>
              <td className="coc-chi-tiet">{dinhDangTien(chiTiet.tien_coc)}</td>
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
          <p className="khong-co-bo-di-kem-chi-tiet">Không có bộ đi kèm.</p>
        )}

        <h3>Chọn thời gian thuê</h3>

        <div className="khung-form-thue">
          <div className="o-form">
            <label>Ngày nhận</label>

            {/*
              min={NGAY_HOM_NAY}
            */}

            <input
              type="date"
              min={NGAY_BAT_DAU_DUOC_DAT}
              value={ngayNhan}
              onChange={(e) => setNgayNhan(e.target.value)}
            />
          </div>

          <div className="o-form">
            <label>Ngày trả</label>

            {/*
              min={NGAY_HOM_NAY}
            */}

            <input
              type="date"
              min={NGAY_BAT_DAU_DUOC_DAT}
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

        <div className="khung-tam-tinh">
          {!ngayNhan || !ngayTra ? (
            <p className="chu-mo">
              Chọn ngày nhận và ngày trả để kiểm tra bộ sẵn sàng.
            </p>
          ) : dangKiemTra ? (
            <p>Đang kiểm tra bộ sẵn sàng...</p>
          ) : (
            <>
              <p>
                <b>Bộ sẵn sàng:</b>{" "}
                {boSanSang === null ? "Chưa kiểm tra" : boSanSang}
              </p>

              {ketQuaKhaDung && ketQuaKhaDung.co_the_thue && (
                <p className="chu-mo">
                  Có thể thêm {soLuong} bộ vào giỏ hàng trong khoảng ngày đã chọn.
                </p>
              )}
            </>
          )}
        </div>

        <div className="nhom-nut nhom-nut-chi-tiet">
          <button onClick={themVaoGioHang}>Thêm vào giỏ hàng</button>

          <Link to="/equipments">
            <button>Quay lại danh sách</button>
          </Link>
        </div>
      </div>

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

      {/*
        ================= SẢN PHẨM TƯƠNG TỰ =================
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