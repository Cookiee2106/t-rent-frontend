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
  const [moTaNhuCauTheoId, setMoTaNhuCauTheoId] = useState({});
  const [thietBiPhuHop, setThietBiPhuHop] = useState([]);
  const [sanPhamTuongTuDayDu, setSanPhamTuongTuDayDu] = useState([]);
  const [dangTaiGoiY, setDangTaiGoiY] = useState(false);
  const [hienTatCaThietBiPhuHop, setHienTatCaThietBiPhuHop] =
    useState(false);
  const [hienTatCaSanPhamTuongTu, setHienTatCaSanPhamTuongTu] =
    useState(false);

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

  function chuanHoaChuoi(giaTri) {
    return String(giaTri || "")
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/Đ/g, "D")
      .replace(/đ/g, "d")
      .toLowerCase();
  }

  async function layMoTaNhuCau() {
    try {
      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/equipment-models/filter-options`
      );

      const duLieu = await phanHoi.json();

      if (!duLieu.success) {
        return;
      }

      const map = {};

      (duLieu.data?.nhu_cau || []).forEach((item) => {
        map[String(item.id)] = item.mo_ta || "";
      });

      setMoTaNhuCauTheoId(map);
    } catch {
      // Không làm trang chi tiết bị lỗi nếu API mô tả chưa sẵn sàng.
    }
  }

  async function layDanhSachGoiY(mauDangXem) {
    try {
      setDangTaiGoiY(true);

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/equipment-models`
      );

      const duLieu = await phanHoi.json();

      if (!duLieu.success) {
        setThietBiPhuHop([]);
        setSanPhamTuongTuDayDu(
          mauDangXem.san_pham_tuong_tu || []
        );
        return;
      }

      const danhSachTatCa = duLieu.data || [];
      const tenDanhMucDangXem = chuanHoaChuoi(
        mauDangXem.ten_danh_muc
      );

      const nhuCauDangXem = new Set(
        (mauDangXem.nhu_cau_su_dung || []).map((item) =>
          String(item.id)
        )
      );

      const giaDangXem = Number(mauDangXem.gia_thue_ngay || 0);

      function tinhDiemGoiY(mau) {
        const soNhuCauTrung = (mau.nhu_cau_su_dung || []).filter(
          (item) => nhuCauDangXem.has(String(item.id))
        ).length;

        return {
          ...mau,
          so_nhu_cau_trung: soNhuCauTrung,
          chenhlech_gia: Math.abs(
            Number(mau.gia_thue_ngay || 0) - giaDangXem
          ),
        };
      }

      function sapXepGoiY(a, b) {
        return (
          b.so_nhu_cau_trung - a.so_nhu_cau_trung ||
          a.chenhlech_gia - b.chenhlech_gia
        );
      }

      const danhSachTuongTu = danhSachTatCa
        .filter((mau) => {
          if (String(mau.id) === String(mauDangXem.id)) {
            return false;
          }

          if (
            chuanHoaChuoi(mau.ten_danh_muc) !==
            tenDanhMucDangXem
          ) {
            return false;
          }

          if (
            tenDanhMucDangXem === "ong kinh" &&
            mauDangXem.ngam_id
          ) {
            return (
              String(mau.ngam_id || "") ===
              String(mauDangXem.ngam_id)
            );
          }

          return true;
        })
        .map(tinhDiemGoiY)
        .filter(
          (mau) =>
            nhuCauDangXem.size === 0 ||
            mau.so_nhu_cau_trung > 0
        )
        .sort(sapXepGoiY);

      setSanPhamTuongTuDayDu(danhSachTuongTu);

      const laMayAnh = tenDanhMucDangXem === "may anh";
      const laOngKinh = tenDanhMucDangXem === "ong kinh";

      if ((!laMayAnh && !laOngKinh) || !mauDangXem.ngam_id) {
        setThietBiPhuHop([]);
        return;
      }

      const danhMucCanGoiY = laMayAnh ? "ong kinh" : "may anh";

      const danhSachThietBiPhuHop = danhSachTatCa
        .filter(
          (mau) =>
            chuanHoaChuoi(mau.ten_danh_muc) ===
              danhMucCanGoiY &&
            String(mau.ngam_id || "") ===
              String(mauDangXem.ngam_id)
        )
        .map(tinhDiemGoiY)
        .sort(sapXepGoiY);

      setThietBiPhuHop(danhSachThietBiPhuHop);
    } catch {
      setThietBiPhuHop([]);
      setSanPhamTuongTuDayDu(
        mauDangXem.san_pham_tuong_tu || []
      );
    } finally {
      setDangTaiGoiY(false);
    }
  }

  function layTenVatPhamDiKem(item) {
    return (
      item.ten_hien_thi ||
      item.ten_mau_phu ||
      item.ten_phu_kien ||
      ""
    );
  }

  function hienThiBoDiKem(mau) {
    const danhSach = (mau.bo_di_kem || []).filter((item) =>
      layTenVatPhamDiKem(item)
    );

    if (danhSach.length === 0) {
      return (
        <div className="bo-di-kem-chip-box">
          <p className="tieu-de-bo-di-kem">Bộ đi kèm:</p>
          <p className="khong-co-bo-di-kem-card">
            Không có bộ đi kèm
          </p>
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

  function hienThiNhuCauSuDung(mau) {
    const danhSach = Array.isArray(mau.nhu_cau_su_dung)
      ? mau.nhu_cau_su_dung
      : [];

    if (danhSach.length === 0) {
      return null;
    }

    return (
      <div className="khoang-nhu-cau-card">
        <p className="tieu-de-nhu-cau-card">Phù hợp:</p>

        <div className="danh-sach-chip-nhu-cau-card">
          {danhSach.map((item) => (
            <span
              className="chip-nhu-cau-card"
              key={item.id}
              title={item.mo_ta || item.ten_nhu_cau}
            >
              {item.ten_nhu_cau}
            </span>
          ))}
        </div>
      </div>
    );
  }

  function hienThiTheGoiY(mau) {
    return (
      <Link
        className="link-card-san-pham"
        to={`/equipments/${mau.id}`}
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
                Giá thuê/ngày:{" "}
                <b>{dinhDangTien(mau.gia_thue_ngay)}</b>
              </p>

              <p className="dong-thong-tin-card tien-coc-card">
                Tiền cọc: <b>{dinhDangTien(mau.tien_coc)}</b>
              </p>
            </div>

            {hienThiNhuCauSuDung(mau)}

            <div className="khoang-bo-di-kem-card">
              {hienThiBoDiKem(mau)}
            </div>

            <p className="chu-mo dong-thong-tin-card trang-thai-san-sang-card">
              Chọn đủ ngày nhận và ngày trả để kiểm tra bộ sẵn sàng
            </p>
          </div>
        </div>
      </Link>
    );
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
        layDanhSachGoiY(duLieu.data);
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

        moPopup("Thêm vào giỏ thành công");
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    }
  }

  useEffect(() => {
    setHienTatCaThietBiPhuHop(false);
    setHienTatCaSanPhamTuongTu(false);
    layChiTietMauThietBi();
    layMoTaNhuCau();
  }, [id]);

  useEffect(() => {
    kiemTraBoSanSang();
  }, [ngayNhan, ngayTra, soLuong, id]);

  if (!chiTiet) {
    return <p className="thong-bao">Đang tải chi tiết mẫu thiết bị...</p>;
  }

  const coNhuCauDangXem =
    Array.isArray(chiTiet.nhu_cau_su_dung) &&
    chiTiet.nhu_cau_su_dung.length > 0;

  const nhuCauDangXem = new Set(
    (chiTiet.nhu_cau_su_dung || []).map((item) =>
      String(item.id)
    )
  );

  const nguonSanPhamTuongTuBanDau =
    sanPhamTuongTuDayDu.length > 0
      ? sanPhamTuongTuDayDu
      : chiTiet.san_pham_tuong_tu || [];

  const nguonSanPhamTuongTu = coNhuCauDangXem
    ? nguonSanPhamTuongTuBanDau.filter((mau) =>
        (mau.nhu_cau_su_dung || []).some((item) =>
          nhuCauDangXem.has(String(item.id))
        )
      )
    : nguonSanPhamTuongTuBanDau;

  const tieuDeSanPhamTuongTu = coNhuCauDangXem
    ? "Sản phẩm tương tự phù hợp với nhu cầu của bạn"
    : "Sản phẩm tương tự";

  const sanPhamTuongTu = hienTatCaSanPhamTuongTu
    ? nguonSanPhamTuongTu
    : nguonSanPhamTuongTu.slice(0, SO_MAU_TUONG_TU_MUON_LAY);

  const tenDanhMucChiTiet = chuanHoaChuoi(
    chiTiet.ten_danh_muc
  );

  const laChiTietMayAnh = tenDanhMucChiTiet === "may anh";
  const laChiTietOngKinh = tenDanhMucChiTiet === "ong kinh";

  const tieuDeThietBiPhuHop = laChiTietMayAnh
    ? "Ống kính dùng được với mẫu này"
    : "Máy ảnh dùng được với mẫu này";

  const moTaThietBiPhuHop = laChiTietMayAnh
    ? "Các ống kính có nhu cầu tương tự với mẫu máy bạn đang xem"
    : "Các máy ảnh dùng được với mẫu bạn đang xem";

  const thongBaoDangTaiThietBiPhuHop = laChiTietMayAnh
    ? "Đang tìm ống kính dùng được..."
    : "Đang tìm máy ảnh dùng được...";

  const danhSachThietBiPhuHopHienThi =
    hienTatCaThietBiPhuHop
      ? thietBiPhuHop
      : thietBiPhuHop.slice(
          0,
          SO_MAU_TUONG_TU_MUON_LAY
        );

  return (
    <div className="trang-chi-tiet-va-goi-y">
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
              <td>Danh mục</td>
              <td>{chiTiet.ten_danh_muc || "Chưa phân loại"}</td>
            </tr>

            <tr>
              <td>Mô tả</td>
              <td>{chiTiet.mo_ta || "Chưa có mô tả"}</td>
            </tr>

            {chiTiet.ten_ngam && (
              <tr>
                <td>Ngàm</td>
                <td>{chiTiet.ten_ngam}</td>
              </tr>
            )}

            {Array.isArray(chiTiet.nhu_cau_su_dung) &&
              chiTiet.nhu_cau_su_dung.length > 0 && (
                <tr>
                  <td>Nhu cầu sử dụng</td>
                  <td>
                    <div className="danh-sach-nhu-cau-chi-tiet">
                      {chiTiet.nhu_cau_su_dung.map((item) => (
                        <div
                          className="muc-nhu-cau-chi-tiet"
                          key={item.id}
                        >
                          <b>{item.ten_nhu_cau}</b>

                          <p>
                            {item.mo_ta ||
                              moTaNhuCauTheoId[String(item.id)] ||
                              "Chưa có mô tả cho nhu cầu này"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
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
                  Có thể thêm {soLuong} bộ vào giỏ trong khoảng ngày đã chọn.
                </p>
              )}
            </>
          )}
        </div>

        <div className="nhom-nut nhom-nut-chi-tiet">
          <button onClick={themVaoGioHang}>Thêm vào giỏ</button>

          <Link to="/equipments">
            <button>Quay lại danh sách</button>
          </Link>
        </div>
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

      {(laChiTietMayAnh || laChiTietOngKinh) &&
        (dangTaiGoiY || thietBiPhuHop.length > 0) && (
          <section className="khung-goi-y-ben-ngoai">
            <div className="muc-noi-bat-rieng muc-goi-y-chi-tiet">
              <div className="hang-tieu-de-muc-co-nut">
                <h3>{tieuDeThietBiPhuHop}</h3>

                {thietBiPhuHop.length >
                  SO_MAU_TUONG_TU_MUON_LAY && (
                  <button
                    type="button"
                    className="link-xem-them nut-xem-them-goi-y"
                    onClick={() =>
                      setHienTatCaThietBiPhuHop(
                        !hienTatCaThietBiPhuHop
                      )
                    }
                  >
                    {hienTatCaThietBiPhuHop
                      ? "Thu gọn"
                      : "Xem thêm"}
                    <span aria-hidden="true">
                      {hienTatCaThietBiPhuHop ? "‹" : "›"}
                    </span>
                  </button>
                )}
              </div>

              <p className="mo-ta-muc-goi-y">
                {moTaThietBiPhuHop}
              </p>

              {dangTaiGoiY ? (
                <p className="chu-mo thong-bao-goi-y">
                  {thongBaoDangTaiThietBiPhuHop}
                </p>
              ) : (
                <div
                  className="luoi-san-pham luoi-san-pham-goi-y"
                  style={{
                    gridTemplateColumns: `repeat(${SO_MAU_TUONG_TU_MOI_DONG}, minmax(0, 1fr))`,
                  }}
                >
                  {danhSachThietBiPhuHopHienThi.map((mau) =>
                    hienThiTheGoiY(mau)
                  )}
                </div>
              )}
            </div>
          </section>
        )}

      {nguonSanPhamTuongTu.length > 0 && (
        <section className="khung-goi-y-ben-ngoai">
          <div className="muc-noi-bat-rieng muc-goi-y-chi-tiet">
            <div className="hang-tieu-de-muc-co-nut">
              <h3>{tieuDeSanPhamTuongTu}</h3>

              {nguonSanPhamTuongTu.length >
                SO_MAU_TUONG_TU_MUON_LAY && (
                <button
                  type="button"
                  className="link-xem-them nut-xem-them-goi-y"
                  onClick={() =>
                    setHienTatCaSanPhamTuongTu(
                      !hienTatCaSanPhamTuongTu
                    )
                  }
                >
                  {hienTatCaSanPhamTuongTu
                    ? "Thu gọn"
                    : "Xem thêm"}
                  <span aria-hidden="true">
                    {hienTatCaSanPhamTuongTu ? "‹" : "›"}
                  </span>
                </button>
              )}
            </div>

            <p className="mo-ta-muc-goi-y">
              Các mẫu máy có nhu cầu tương tự với mẫu máy bạn đang xem
            </p>

            <div
              className="luoi-san-pham luoi-san-pham-goi-y"
              style={{
                gridTemplateColumns: `repeat(${SO_MAU_TUONG_TU_MOI_DONG}, minmax(0, 1fr))`,
              }}
            >
              {sanPhamTuongTu.map((mau) =>
                hienThiTheGoiY(mau)
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default EquipmentDetail;