import { useEffect, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

function SettlementList() {
  const SO_DONG_MOI_TRANG = 10;
  const SO_ANH_MOI_DONG = 5;

  const [danhSachDon, setDanhSachDon] = useState([]);

  /*
    XÓA KHỎI GIAO DIỆN
  */
  /*
  const [danhSachDonBiAn, setDanhSachDonBiAn] = useState([]);
  */

  const [tuKhoaNhap, setTuKhoaNhap] = useState("");
  const [trangThaiNhap, setTrangThaiNhap] = useState("0");

  const [tuKhoa, setTuKhoa] = useState("");
  const [trangThaiLoc, setTrangThaiLoc] = useState("0");

  /*
    TÌM KIẾM THEO KHOẢNG NGÀY
  */
  /*
  const [ngayNhanTuNhap, setNgayNhanTuNhap] = useState("");
  const [ngayNhanDenNhap, setNgayNhanDenNhap] = useState("");
  const [ngayTraTuNhap, setNgayTraTuNhap] = useState("");
  const [ngayTraDenNhap, setNgayTraDenNhap] = useState("");

  const [ngayNhanTu, setNgayNhanTu] = useState("");
  const [ngayNhanDen, setNgayNhanDen] = useState("");
  const [ngayTraTu, setNgayTraTu] = useState("");
  const [ngayTraDen, setNgayTraDen] = useState("");
  */

  const [trangHienTai, setTrangHienTai] = useState(1);
  const [thongBao, setThongBao] = useState("");

  const [chiTietThanhLy, setChiTietThanhLy] = useState(null);
  const [donDangChonId, setDonDangChonId] = useState(null);

  const [cheDoPopup, setCheDoPopup] = useState("");

  const [hinhThucXuLyCoc, setHinhThucXuLyCoc] = useState("HOAN_COC");
  const [soTien, setSoTien] = useState("");
  const [lyDoPhatSinh, setLyDoPhatSinh] = useState("");
  const [ghiChuThanhLy, setGhiChuThanhLy] = useState("");
  const [anhKhiTra, setAnhKhiTra] = useState([]);

  const [anhDangXem, setAnhDangXem] = useState("");
  const [dangGui, setDangGui] = useState(false);

  useEffect(() => {
    layDanhSachThanhLy();
  }, []);

  function dinhDangTien(giaTri) {
    return Number(giaTri || 0).toLocaleString("vi-VN") + " đ";
  }

  function dinhDangNgay(ngay) {
    if (!ngay) return "Chưa có";
    return new Date(ngay).toLocaleDateString("vi-VN");
  }

  function hienThi(giaTri) {
    return giaTri || "-";
  }

  /*
  function layTrangThaiThanhLy(don) {
    if (Number(don.trang_thai) === 1104 || don.tra_luc) {
      return "Đã thanh lý";
    }

    return "Chờ thanh lý";
  }
  */

  async function layDanhSachThanhLy() {
    try {
      const phanHoi = await fetch(`${DUONG_DAN_API}/api/admin/settlements`, {
        headers: taoHeaderCoToken(),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachDon(duLieu.data || []);
        setTrangHienTai(1);
        setThongBao("");
      } else {
        setThongBao(duLieu.message);
      }
    } catch {
      setThongBao("Không kết nối được server");
    }
  }

  function themAnhKhiTraToiDa5(e) {
    const filesMoi = Array.from(e.target.files || []);

    if (filesMoi.length === 0) {
      return;
    }

    const danhSachMoi = [...anhKhiTra, ...filesMoi];

    if (danhSachMoi.length > 5) {
      setThongBao("Chỉ được chọn tối đa 5 ảnh khi trả");
      e.target.value = "";
      return;
    }

    setAnhKhiTra(danhSachMoi);

    e.target.value = "";
  }

  function xoaAnhKhiTraDaChon(index) {
    const danhSachMoi = anhKhiTra.filter((_, viTri) => viTri !== index);

    setAnhKhiTra(danhSachMoi);
  }

  function timKiem() {
    setTuKhoa(tuKhoaNhap);
    setTrangThaiLoc(trangThaiNhap);

    /*
    setNgayNhanTu(ngayNhanTuNhap);
    setNgayNhanDen(ngayNhanDenNhap);
    setNgayTraTu(ngayTraTuNhap);
    setNgayTraDen(ngayTraDenNhap);
    */

    setTrangHienTai(1);
  }

  async function layChiTietDon(donThueId, cheDo) {
    try {
      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/settlements/${donThueId}`,
        {
          headers: taoHeaderCoToken(),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setChiTietThanhLy(duLieu.data);
        setDonDangChonId(donThueId);
        setCheDoPopup(cheDo);
        resetFormThanhLy();
        setThongBao("");
      } else {
        setThongBao(duLieu.message);
      }
    } catch {
      setThongBao("Không kết nối được server");
    }
  }

  function xemChiTiet(donThueId) {
    layChiTietDon(donThueId, "CHI_TIET");
  }

  function lapPhieuTra(donThueId) {
    layChiTietDon(donThueId, "THANH_LY");
  }

  function resetFormThanhLy() {
    setHinhThucXuLyCoc("HOAN_COC");
    setSoTien("");
    setLyDoPhatSinh("");
    setGhiChuThanhLy("");
    setAnhKhiTra([]);
  }

  function dongPopup() {
    setChiTietThanhLy(null);
    setDonDangChonId(null);
    setCheDoPopup("");
    resetFormThanhLy();
  }

  function tinhTienTamTinh() {
    const tienCoc = Number(
      chiTietThanhLy?.don_thue?.tien_coc_da_thanh_toan || 0
    );

    const tienNhap = Number(soTien || 0);

    if (hinhThucXuLyCoc === "HOAN_COC") {
      return {
        hoanCoc: tienCoc,
        khauTru: 0,
        phuThu: 0,
      };
    }

    if (hinhThucXuLyCoc === "KHAU_TRU_COC") {
      return {
        hoanCoc: tienCoc - tienNhap > 0 ? tienCoc - tienNhap : 0,
        khauTru: tienNhap,
        phuThu: 0,
      };
    }

    if (hinhThucXuLyCoc === "PHU_THU") {
      return {
        hoanCoc: 0,
        khauTru: tienCoc,
        phuThu: tienNhap,
      };
    }

    return {
      hoanCoc: 0,
      khauTru: 0,
      phuThu: 0,
    };
  }

  async function guiThanhLy(e) {
    e.preventDefault();

    if (!donDangChonId) {
      return setThongBao("Chưa chọn đơn thanh lý");
    }

    if (!ghiChuThanhLy.trim()) {
      return setThongBao("Vui lòng nhập ghi chú thanh lý");
    }

    if (hinhThucXuLyCoc !== "HOAN_COC") {
      if (Number(soTien || 0) <= 0) {
        return setThongBao("Vui lòng nhập số tiền khấu trừ/phụ thu");
      }

      if (!lyDoPhatSinh.trim()) {
        return setThongBao("Vui lòng nhập lý do phát sinh");
      }
    }

    if (!anhKhiTra || anhKhiTra.length === 0) {
      return setThongBao("Vui lòng chọn ít nhất 1 ảnh khi trả");
    }

    setDangGui(true);

    const formData = new FormData();

    formData.append("hinh_thuc_xu_ly_coc", hinhThucXuLyCoc);
    formData.append("so_tien", soTien || 0);
    formData.append("phi_phat_sinh_ly_do", lyDoPhatSinh);
    formData.append("ghi_chu_thanh_ly", ghiChuThanhLy);

    for (const file of anhKhiTra) {
      formData.append("anh_khi_tra", file);
    }

    try {
      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/settlements/${donDangChonId}/return`,
        {
          method: "POST",
          headers: taoHeaderCoToken(),
          body: formData,
        }
      );

      const duLieu = await phanHoi.json();

      setThongBao(duLieu.message);

      if (duLieu.success) {
        await layDanhSachThanhLy();
        await layChiTietDon(donDangChonId, "CHI_TIET");
      }
    } catch {
      setThongBao("Không kết nối được server");
    } finally {
      setDangGui(false);
    }
  }

  /*
    XÓA KHỎI GIAO DIỆN 
  */
  /*
  function xoaKhoiGiaoDien(donThueId) {
    const dongY = window.confirm(
      "Bạn có chắc muốn xóa đơn này khỏi giao diện hiện tại không?"
    );

    if (!dongY) return;

    setDanhSachDonBiAn([...danhSachDonBiAn, donThueId]);

    if (donDangChonId === donThueId) {
      dongPopup();
    }

    setThongBao("Đã xóa đơn khỏi giao diện hiện tại");
  }
  */

  /*
    CẬP NHẬT GHI CHÚ / LÝ DO 
  */
  /*
  async function capNhatGhiChuVaLyDo(donThueId) {
    const ghiChuMoi = window.prompt("Nhập ghi chú thanh lý mới:");
    if (ghiChuMoi === null) return;

    const lyDoMoi = window.prompt("Nhập lý do phát sinh mới:");
    if (lyDoMoi === null) return;

    const phanHoi = await fetch(
      `${DUONG_DAN_API}/api/admin/settlements/${donThueId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...taoHeaderCoToken(),
        },
        body: JSON.stringify({
          ghi_chu_thanh_ly: ghiChuMoi,
          phi_phat_sinh_ly_do: lyDoMoi,
        }),
      }
    );

    const duLieu = await phanHoi.json();
    setThongBao(duLieu.message);

    if (duLieu.success) {
      await layDanhSachThanhLy();
      await layChiTietDon(donThueId, "CHI_TIET");
    }
  }
  */

  /*
    CẬP NHẬT TIỀN THANH LÝ 
  */
  /*
  async function capNhatTienThanhLy(donThueId) {
    const hinhThucMoi = window.prompt(
      "Nhập HOAN_COC, KHAU_TRU_COC hoặc PHU_THU:"
    );
    if (!hinhThucMoi) return;

    const soTienMoi = window.prompt("Nhập số tiền mới:");
    if (soTienMoi === null) return;

    const lyDoMoi = window.prompt("Nhập lý do điều chỉnh:");
    if (lyDoMoi === null) return;

    const phanHoi = await fetch(
      `${DUONG_DAN_API}/api/admin/settlements/${donThueId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...taoHeaderCoToken(),
        },
        body: JSON.stringify({
          hinh_thuc_xu_ly_coc: hinhThucMoi,
          so_tien: Number(soTienMoi || 0),
          phi_phat_sinh_ly_do: lyDoMoi,
        }),
      }
    );

    const duLieu = await phanHoi.json();
    setThongBao(duLieu.message);

    if (duLieu.success) {
      await layDanhSachThanhLy();
      await layChiTietDon(donThueId, "CHI_TIET");
    }
  }
  */

  /*
    HỦY THANH LÝ
  */
  /*
  async function huyThanhLy(donThueId) {
    const dongY = window.confirm("Bạn có chắc muốn hủy thanh lý đơn này không?");
    if (!dongY) return;

    const phanHoi = await fetch(
      `${DUONG_DAN_API}/api/admin/settlements/${donThueId}/cancel`,
      {
        method: "PATCH",
        headers: taoHeaderCoToken(),
      }
    );

    const duLieu = await phanHoi.json();
    setThongBao(duLieu.message);

    if (duLieu.success) {
      await layDanhSachThanhLy();
      dongPopup();
    }
  }
  */

  function renderDongVatPham(vatPham, loai, index) {
    return (
      <tr key={`${loai}-${index}-${vatPham.ma_tai_san_snapshot || ""}`}>
        <td>{loai}</td>
        <td>{hienThi(vatPham.ten_vat_pham_snapshot)}</td>
        <td>{hienThi(vatPham.ma_tai_san_snapshot)}</td>
        <td>{hienThi(vatPham.so_serial_snapshot)}</td>
        <td>{hienThi(vatPham.so_luong_giao)}</td>
        {/* <td>{hienThi(vatPham.tinh_trang_truoc)}</td> */}
        <td>{hienThi(vatPham.vi_tri_luu_tru)}</td>
        {/* <td>{hienThi(vatPham.ghi_chu_ban_giao)}</td> */}
      </tr>
    );
  }

  function renderSanPhamKemSerial() {
    const danhSach = chiTietThanhLy?.san_pham_kem_serial || [];

    if (danhSach.length === 0) {
      return <p>Chưa có dữ liệu thiết bị bàn giao.</p>;
    }

    return (
      <div>
        {danhSach.map((sanPham, index) => {
          const danhSachThietBiChinh = Array.isArray(sanPham.thiet_bi_chinh)
            ? sanPham.thiet_bi_chinh
            : sanPham.thiet_bi_chinh
            ? [sanPham.thiet_bi_chinh]
            : [];

          const danhSachBoDiKem = Array.isArray(sanPham.bo_di_kem)
            ? sanPham.bo_di_kem
            : [];

          return (
            <div
              key={`${sanPham.chi_tiet_don_thue_id}-${index}`}
              className="khoi-san-pham-thanh-ly"
            >
              <h4>
                {sanPham.ten_hien_thi ||
                  `${sanPham.ten_hang || ""} ${sanPham.ten_mau || ""}`.trim() ||
                  "Sản phẩm"}
              </h4>

              <div className="bang-ngang">
                <table className="bang-popup bang-gon">
                  <thead>
                    <tr>
                      <th>Loại</th>
                      <th>Vật phẩm</th>
                      <th>Mã tài sản</th>
                      <th>Serial</th>
                      <th>SL giao</th>
                      {/* <th>Tình trạng bàn giao</th> */}
                      <th>Vị trí</th>
                      {/* <th>Ghi chú bàn giao</th> */}
                    </tr>
                  </thead>

                  <tbody>
                    {danhSachThietBiChinh.map((item, viTri) =>
                      renderDongVatPham(item, "Thiết bị chính", viTri)
                    )}

                    {danhSachBoDiKem.map((item, viTri) =>
                      renderDongVatPham(item, "Bộ đi kèm", viTri)
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function renderAnhTheoMucDich(tieuDe, mucDichId) {
    const danhSach = chiTietThanhLy?.tep_don_thue || [];

    const danhSachAnh = danhSach.filter((tep) => {
      return Number(tep.muc_dich_id) === Number(mucDichId);
    });

    return (
      <>
        <h3>{tieuDe}</h3>

        {danhSachAnh.length === 0 ? (
          <p>Chưa có ảnh.</p>
        ) : (
          <div className="nhom-anh-popup">
            {danhSachAnh.map((tep) => (
              <img
                key={tep.id}
                src={tep.file_url}
                alt={tep.ten_file_goc || tieuDe}
                onClick={() => setAnhDangXem(tep.file_url)}
              />
            ))}
          </div>
        )}
      </>
    );
  }

  /*
  function renderAnhThanhLy() {
    const danhSach = chiTietThanhLy?.tep_don_thue || [];

    const danhSachAnhThanhLy = danhSach.filter((tep) => {
      return (
        Number(tep.muc_dich_id) === 2603 ||
        tep.ma_muc_dich === "ANH_KHI_TRA"
      );
    });

    if (danhSachAnhThanhLy.length === 0) {
      return <p>Chưa có ảnh thanh lý.</p>;
    }

    return (
      <div className="nhom-anh-popup">
        {danhSachAnhThanhLy.map((tep) => (
          <img
            key={tep.id}
            src={tep.file_url}
            alt={tep.ten_file_goc}
            onClick={() => setAnhDangXem(tep.file_url)}
          />
        ))}
      </div>
    );
  }
  */

  function renderThanhToan() {
    const danhSach = chiTietThanhLy?.thanh_toan || [];

    if (danhSach.length === 0) {
      return <p>Chưa có thông tin thanh toán.</p>;
    }

    return (
      <table className="bang-popup bang-gon">
        <thead>
          <tr>
            <th>Nội dung</th>
            <th>Số tiền</th>
            <th>Người thực hiện</th>
            <th>Ghi chú</th>
            <th>Ngày ghi nhận</th>
          </tr>
        </thead>

        <tbody>
          {danhSach.map((tt) => (
            <tr key={tt.id}>
              <td>{hienThi(tt.ten_loai_dong_tien)}</td>
              <td>{dinhDangTien(tt.so_tien)}</td>
              <td>{hienThi(tt.nguoi_thuc_hien)}</td>
              <td>{hienThi(tt.ghi_chu)}</td>
              <td>{dinhDangNgay(tt.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  const danhSachSauLoc = danhSachDon.filter((don) => {
    /*
      XÓA KHỎI GIAO DIỆN - ĐANG COMMENT

      Mở đoạn này nếu đã mở state danhSachDonBiAn.
    */
    /*
    if (danhSachDonBiAn.includes(don.id)) {
      return false;
    }
    */

    const noiDung = `${don.ma_don || ""} ${don.ten_khach_hang || ""} ${
      don.email_khach_hang || ""
    } ${don.sdt_khach_hang || ""}`.toLowerCase();

    const khopTuKhoa = noiDung.includes(tuKhoa.toLowerCase());

    const khopTrangThai =
      trangThaiLoc === "0" || Number(don.trang_thai) === Number(trangThaiLoc);

    /*
      TÌM KIẾM THEO KHOẢNG NGÀY - ĐANG COMMENT
    */
    /*
    const ngayNhan = don.ngay_nhan ? String(don.ngay_nhan).slice(0, 10) : "";
    const ngayTra = don.ngay_tra ? String(don.ngay_tra).slice(0, 10) : "";

    const khopNgayNhanTu = !ngayNhanTu || ngayNhan >= ngayNhanTu;
    const khopNgayNhanDen = !ngayNhanDen || ngayNhan <= ngayNhanDen;
    const khopNgayTraTu = !ngayTraTu || ngayTra >= ngayTraTu;
    const khopNgayTraDen = !ngayTraDen || ngayTra <= ngayTraDen;

    return (
      khopTuKhoa &&
      khopTrangThai &&
      khopNgayNhanTu &&
      khopNgayNhanDen &&
      khopNgayTraTu &&
      khopNgayTraDen
    );
    */

    return khopTuKhoa && khopTrangThai;
  });

  const tongTrang = Math.ceil(danhSachSauLoc.length / SO_DONG_MOI_TRANG);
  const viTriBatDau = (trangHienTai - 1) * SO_DONG_MOI_TRANG;

  const danhSachHienThi = danhSachSauLoc.slice(
    viTriBatDau,
    viTriBatDau + SO_DONG_MOI_TRANG
  );

  const danhSachSanPhamKemSerial = chiTietThanhLy?.san_pham_kem_serial || [];

  const danhSachAnhHopDong = (chiTietThanhLy?.tep_don_thue || []).filter(
    (tep) => Number(tep.muc_dich_id) === 2601
  );

  const danhSachAnhBanGiao = (chiTietThanhLy?.tep_don_thue || []).filter(
    (tep) => Number(tep.muc_dich_id) === 2602
  );

  const danhSachAnhKhiTra = (chiTietThanhLy?.tep_don_thue || []).filter(
    (tep) => Number(tep.muc_dich_id) === 2603
  );

  const danhSachThanhToan = chiTietThanhLy?.thanh_toan || [];

  const tienTamTinh = tinhTienTamTinh();

  return (
    <div>
      <h2>Thanh lý hợp đồng</h2>

      <div className="khung-loc-admin">
        <input
          placeholder="Tìm mã đơn, tên khách, email, SĐT"
          value={tuKhoaNhap}
          onChange={(e) => setTuKhoaNhap(e.target.value)}
        />

        <select
          value={trangThaiNhap}
          onChange={(e) => setTrangThaiNhap(e.target.value)}
        >
          <option value="0">Tất cả trạng thái</option>
          <option value="1103">Đang thuê</option>
          <option value="1105">Quá hạn</option>
          <option value="1104">Hoàn thành</option>
        </select>

        {/*
          TÌM KIẾM THEO KHOẢNG NGÀY - ĐANG COMMENT
        */}
        {/*
        <input
          type="date"
          value={ngayNhanTuNhap}
          onChange={(e) => setNgayNhanTuNhap(e.target.value)}
        />

        <input
          type="date"
          value={ngayNhanDenNhap}
          onChange={(e) => setNgayNhanDenNhap(e.target.value)}
        />

        <input
          type="date"
          value={ngayTraTuNhap}
          onChange={(e) => setNgayTraTuNhap(e.target.value)}
        />

        <input
          type="date"
          value={ngayTraDenNhap}
          onChange={(e) => setNgayTraDenNhap(e.target.value)}
        />
        */}

        <button onClick={timKiem}>Tìm kiếm</button>
      </div>

      {thongBao && <p className="thong-bao">{thongBao}</p>}

      <div className="admin-bang-wrapper">
        <table className="bang-quan-ly bang-thanh-ly">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Ngày nhận</th>
              <th>Ngày trả</th>
              <th>Tiền cọc</th>
              <th>Trạng thái đơn</th>
              {/* <th>Trạng thái thanh lý</th> */}
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {danhSachHienThi.map((don, index) => (
              <tr key={don.id}>
                <td>{viTriBatDau + index + 1}</td>
                <td>{don.ma_don}</td>
                <td>{don.ten_khach_hang}</td>
                <td>{dinhDangNgay(don.ngay_nhan)}</td>
                <td>{dinhDangNgay(don.ngay_tra)}</td>
                <td>{dinhDangTien(don.tien_coc_da_thanh_toan)}</td>
                <td>{don.ten_trang_thai}</td>
                {/* <td>{layTrangThaiThanhLy(don)}</td> */}

                <td>
                  <div className="cot-thao-tac">
                    <button onClick={() => xemChiTiet(don.id)}>
                      Xem chi tiết
                    </button>

                    {Number(don.trang_thai) !== 1104 ? (
                      <button onClick={() => lapPhieuTra(don.id)}>
                        Lập phiếu trả
                      </button>
                    ) : (
                      <button disabled>Đã thanh lý</button>
                    )}

                    {/*
                      XÓA KHỎI GIAO DIỆN - ĐANG COMMENT

                      Mở nút này nếu thầy yêu cầu có nút Xóa.
                      Không gọi API, không xóa DB.
                    */}
                    {/*
                    <button
                      className="nut-do"
                      onClick={() => xoaKhoiGiaoDien(don.id)}
                    >
                      Xóa
                    </button>
                    */}
                  </div>
                </td>
              </tr>
            ))}

            {danhSachHienThi.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="phan-trang">
        <button
          disabled={trangHienTai === 1}
          onClick={() => setTrangHienTai(trangHienTai - 1)}
        >
          Trước
        </button>

        <span>
          Trang {trangHienTai} / {tongTrang || 1}
        </span>

        <button
          disabled={trangHienTai === tongTrang || tongTrang === 0}
          onClick={() => setTrangHienTai(trangHienTai + 1)}
        >
          Sau
        </button>
      </div>

      {chiTietThanhLy && cheDoPopup === "CHI_TIET" && (
        <div className="popup-nen">
          <div className="popup-hop popup-lon">
            <div className="popup-tieu-de">
              <h3>Xem chi tiết thanh lý hợp đồng</h3>
              <button onClick={dongPopup}>Đóng</button>
            </div>

            <div className="popup-noi-dung">
              <h3>Thông tin đơn và khách hàng</h3>

              <table className="bang-popup bang-gon">
                <tbody>
                  <tr>
                    <td>Mã đơn</td>
                    <td>{chiTietThanhLy.don_thue.ma_don}</td>
                  </tr>
                  <tr>
                    <td>Khách hàng</td>
                    <td>{chiTietThanhLy.don_thue.ten_khach_hang}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{hienThi(chiTietThanhLy.don_thue.email_khach_hang)}</td>
                  </tr>
                  <tr>
                    <td>SĐT</td>
                    <td>{hienThi(chiTietThanhLy.don_thue.sdt_khach_hang)}</td>
                  </tr>
                  <tr>
                    <td>Ngày nhận</td>
                    <td>{dinhDangNgay(chiTietThanhLy.don_thue.ngay_nhan)}</td>
                  </tr>
                  <tr>
                    <td>Ngày trả</td>
                    <td>{dinhDangNgay(chiTietThanhLy.don_thue.ngay_tra)}</td>
                  </tr>
                  <tr>
                    <td>Trạng thái</td>
                    <td>{chiTietThanhLy.don_thue.ten_trang_thai}</td>
                  </tr>
                  <tr>
                    <td>Tiền thuê</td>
                    <td>{dinhDangTien(chiTietThanhLy.don_thue.tong_tien_thue)}</td>
                  </tr>
                  <tr>
                    <td>Tiền cọc đã thanh toán</td>
                    <td>
                      {dinhDangTien(
                        chiTietThanhLy.don_thue.tien_coc_da_thanh_toan
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Thời điểm bàn giao</td>
                    <td>{dinhDangNgay(chiTietThanhLy.don_thue.ban_giao_luc)}</td>
                  </tr>
                  <tr>
                    <td>Nhân viên bàn giao</td>
                    <td>{hienThi(chiTietThanhLy.don_thue.ten_nguoi_ban_giao)}</td>
                  </tr>
                  <tr>
                    <td>Ghi chú bàn giao</td>
                    <td>{hienThi(chiTietThanhLy.don_thue.ghi_chu_ban_giao)}</td>
                  </tr>
                  <tr>
                    <td>Đã hoàn cọc</td>
                    <td>
                      {dinhDangTien(chiTietThanhLy.don_thue.tien_da_hoan_coc)}
                    </td>
                  </tr>
                  <tr>
                    <td>Đã khấu trừ</td>
                    <td>
                      {dinhDangTien(chiTietThanhLy.don_thue.tien_da_khau_tru)}
                    </td>
                  </tr>
                  <tr>
                    <td>Đã phụ thu</td>
                    <td>
                      {dinhDangTien(chiTietThanhLy.don_thue.tien_da_phu_thu)}
                    </td>
                  </tr>
                  <tr>
                    <td>Ghi chú thanh lý</td>
                    <td>{hienThi(chiTietThanhLy.don_thue.ghi_chu_thanh_ly)}</td>
                  </tr>
                  <tr>
                    <td>Lý do phát sinh</td>
                    <td>{hienThi(chiTietThanhLy.don_thue.phi_phat_sinh_ly_do)}</td>
                  </tr>
                </tbody>
              </table>

              <h3>Tài sản và phụ kiện đã bàn giao</h3>

              {danhSachSanPhamKemSerial.length === 0 ? (
                <p>Chưa có dữ liệu thiết bị bàn giao.</p>
              ) : (
                <div>
                  {danhSachSanPhamKemSerial.map((sanPham, index) => {
                    const danhSachThietBiChinh = Array.isArray(
                      sanPham.thiet_bi_chinh
                    )
                      ? sanPham.thiet_bi_chinh
                      : sanPham.thiet_bi_chinh
                      ? [sanPham.thiet_bi_chinh]
                      : [];

                    const danhSachBoDiKem = Array.isArray(sanPham.bo_di_kem)
                      ? sanPham.bo_di_kem
                      : [];

                    return (
                      <div
                        key={`${sanPham.chi_tiet_don_thue_id}-${index}`}
                        className="khoi-san-pham-thanh-ly"
                      >
                        <h4>
                          {sanPham.ten_hien_thi ||
                            `${sanPham.ten_hang || ""} ${
                              sanPham.ten_mau || ""
                            }`.trim() ||
                            "Sản phẩm"}
                        </h4>

                        <div className="bang-ngang">
                          <table className="bang-popup bang-gon">
                            <thead>
                              <tr>
                                <th>Loại</th>
                                <th>Vật phẩm</th>
                                <th>Mã tài sản</th>
                                <th>Serial</th>
                                <th>SL giao</th>
                                {/* <th>Tình trạng bàn giao</th> */}
                                <th>Vị trí</th>
                                {/* <th>Ghi chú bàn giao</th> */}
                              </tr>
                            </thead>

                            <tbody>
                              {danhSachThietBiChinh.map((vatPham, viTri) => (
                                <tr
                                  key={`thiet-bi-chinh-${index}-${viTri}-${
                                    vatPham.ma_tai_san_snapshot || ""
                                  }`}
                                >
                                  <td>Thiết bị chính</td>
                                  <td>{hienThi(vatPham.ten_vat_pham_snapshot)}</td>
                                  <td>{hienThi(vatPham.ma_tai_san_snapshot)}</td>
                                  <td>{hienThi(vatPham.so_serial_snapshot)}</td>
                                  <td>{hienThi(vatPham.so_luong_giao)}</td>
                                  {/* <td>{hienThi(vatPham.tinh_trang_truoc)}</td> */}
                                  <td>{hienThi(vatPham.vi_tri_luu_tru)}</td>
                                  {/* <td>{hienThi(vatPham.ghi_chu_ban_giao)}</td> */}
                                </tr>
                              ))}

                              {danhSachBoDiKem.map((vatPham, viTri) => (
                                <tr
                                  key={`bo-di-kem-${index}-${viTri}-${
                                    vatPham.ma_tai_san_snapshot || ""
                                  }`}
                                >
                                  <td>Bộ đi kèm</td>
                                  <td>{hienThi(vatPham.ten_vat_pham_snapshot)}</td>
                                  <td>{hienThi(vatPham.ma_tai_san_snapshot)}</td>
                                  <td>{hienThi(vatPham.so_serial_snapshot)}</td>
                                  <td>{hienThi(vatPham.so_luong_giao)}</td>
                                  {/* <td>{hienThi(vatPham.tinh_trang_truoc)}</td> */}
                                  <td>{hienThi(vatPham.vi_tri_luu_tru)}</td>
                                  {/* <td>{hienThi(vatPham.ghi_chu_ban_giao)}</td> */}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <h3>Ảnh hợp đồng giấy</h3>

              {danhSachAnhHopDong.length === 0 ? (
                <p>Chưa có ảnh.</p>
              ) : (
                <div className="nhom-anh-popup">
                  {danhSachAnhHopDong.map((tep) => (
                    <img
                      key={tep.id}
                      src={tep.file_url}
                      alt={tep.ten_file_goc || "Ảnh hợp đồng giấy"}
                      onClick={() => setAnhDangXem(tep.file_url)}
                    />
                  ))}
                </div>
              )}

              <h3>Ảnh bàn giao</h3>

              {danhSachAnhBanGiao.length === 0 ? (
                <p>Chưa có ảnh.</p>
              ) : (
                <div className="nhom-anh-popup">
                  {danhSachAnhBanGiao.map((tep) => (
                    <img
                      key={tep.id}
                      src={tep.file_url}
                      alt={tep.ten_file_goc || "Ảnh bàn giao"}
                      onClick={() => setAnhDangXem(tep.file_url)}
                    />
                  ))}
                </div>
              )}

              <h3>Ảnh khi trả</h3>

              {danhSachAnhKhiTra.length === 0 ? (
                <p>Chưa có ảnh.</p>
              ) : (
                <div className="nhom-anh-popup">
                  {danhSachAnhKhiTra.map((tep) => (
                    <img
                      key={tep.id}
                      src={tep.file_url}
                      alt={tep.ten_file_goc || "Ảnh khi trả"}
                      onClick={() => setAnhDangXem(tep.file_url)}
                    />
                  ))}
                </div>
              )}

              <h3>Thông tin thanh toán</h3>

              {danhSachThanhToan.length === 0 ? (
                <p>Chưa có thông tin thanh toán.</p>
              ) : (
                <table className="bang-popup bang-gon">
                  <thead>
                    <tr>
                      <th>Nội dung</th>
                      <th>Số tiền</th>
                      <th>Người thực hiện</th>
                      <th>Ghi chú</th>
                      <th>Ngày ghi nhận</th>
                    </tr>
                  </thead>

                  <tbody>
                    {danhSachThanhToan.map((tt) => (
                      <tr key={tt.id}>
                        <td>{hienThi(tt.ten_loai_dong_tien)}</td>
                        <td>{dinhDangTien(tt.so_tien)}</td>
                        <td>{hienThi(tt.nguoi_thuc_hien)}</td>
                        <td>{hienThi(tt.ghi_chu)}</td>
                        <td>{dinhDangNgay(tt.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {Number(chiTietThanhLy.don_thue.trang_thai) !== 1104 && (
                <div className="popup-actions">
                  <button onClick={() => setCheDoPopup("THANH_LY")}>
                    Lập phiếu trả
                  </button>
                </div>
              )}

              {Number(chiTietThanhLy.don_thue.trang_thai) === 1104 && (
                <div className="popup-actions">
                  <span>
                    <b>Hợp đồng này đã thanh lý hoàn tất.</b>
                  </span>

                  {/*
                  <button onClick={() => capNhatGhiChuVaLyDo(donDangChonId)}>
                    Sửa ghi chú/lý do
                  </button>
                  */}

                  {/*
                  <button onClick={() => capNhatTienThanhLy(donDangChonId)}>
                    Sửa tiền
                  </button>
                  */}

                  {/*
                  <button className="nut-do" onClick={() => huyThanhLy(donDangChonId)}>
                    Hủy thanh lý
                  </button>
                  */}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {chiTietThanhLy && cheDoPopup === "THANH_LY" && (
        <div className="popup-nen">
          <div className="popup-hop popup-lon">
            <div className="popup-tieu-de">
              <h3>Lập phiếu trả</h3>
              <button onClick={dongPopup}>Đóng</button>
            </div>

            <div className="popup-noi-dung">
              <h3>Thông tin hợp đồng</h3>

              <table className="bang-popup bang-gon">
                <tbody>
                  <tr>
                    <td>Mã đơn</td>
                    <td>{chiTietThanhLy.don_thue.ma_don}</td>
                  </tr>
                  <tr>
                    <td>Khách hàng</td>
                    <td>{chiTietThanhLy.don_thue.ten_khach_hang}</td>
                  </tr>
                  <tr>
                    <td>Ngày nhận</td>
                    <td>{dinhDangNgay(chiTietThanhLy.don_thue.ngay_nhan)}</td>
                  </tr>
                  <tr>
                    <td>Ngày trả</td>
                    <td>{dinhDangNgay(chiTietThanhLy.don_thue.ngay_tra)}</td>
                  </tr>
                  <tr>
                    <td>Tiền cọc đã thanh toán</td>
                    <td>
                      {dinhDangTien(
                        chiTietThanhLy.don_thue.tien_coc_da_thanh_toan
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Ghi chú bàn giao</td>
                    <td>{hienThi(chiTietThanhLy.don_thue.ghi_chu_ban_giao)}</td>
                  </tr>
                </tbody>
              </table>

              <h3>Tài sản và phụ kiện đã bàn giao</h3>

              {danhSachSanPhamKemSerial.length === 0 ? (
                <p>Chưa có dữ liệu thiết bị bàn giao.</p>
              ) : (
                <div>
                  {danhSachSanPhamKemSerial.map((sanPham, index) => {
                    const danhSachThietBiChinh = Array.isArray(
                      sanPham.thiet_bi_chinh
                    )
                      ? sanPham.thiet_bi_chinh
                      : sanPham.thiet_bi_chinh
                      ? [sanPham.thiet_bi_chinh]
                      : [];

                    const danhSachBoDiKem = Array.isArray(sanPham.bo_di_kem)
                      ? sanPham.bo_di_kem
                      : [];

                    return (
                      <div
                        key={`${sanPham.chi_tiet_don_thue_id}-${index}`}
                        className="khoi-san-pham-thanh-ly"
                      >
                        <h4>
                          {sanPham.ten_hien_thi ||
                            `${sanPham.ten_hang || ""} ${
                              sanPham.ten_mau || ""
                            }`.trim() ||
                            "Sản phẩm"}
                        </h4>

                        <div className="bang-ngang">
                          <table className="bang-popup bang-gon">
                            <thead>
                              <tr>
                                <th>Loại</th>
                                <th>Vật phẩm</th>
                                <th>Mã tài sản</th>
                                <th>Serial</th>
                                <th>SL giao</th>
                                {/* <th>Tình trạng bàn giao</th> */}
                                <th>Vị trí</th>
                                {/* <th>Ghi chú bàn giao</th> */}
                              </tr>
                            </thead>

                            <tbody>
                              {danhSachThietBiChinh.map((vatPham, viTri) => (
                                <tr
                                  key={`thiet-bi-chinh-${index}-${viTri}-${
                                    vatPham.ma_tai_san_snapshot || ""
                                  }`}
                                >
                                  <td>Thiết bị chính</td>
                                  <td>{hienThi(vatPham.ten_vat_pham_snapshot)}</td>
                                  <td>{hienThi(vatPham.ma_tai_san_snapshot)}</td>
                                  <td>{hienThi(vatPham.so_serial_snapshot)}</td>
                                  <td>{hienThi(vatPham.so_luong_giao)}</td>
                                  {/* <td>{hienThi(vatPham.tinh_trang_truoc)}</td> */}
                                  <td>{hienThi(vatPham.vi_tri_luu_tru)}</td>
                                  {/* <td>{hienThi(vatPham.ghi_chu_ban_giao)}</td> */}
                                </tr>
                              ))}

                              {danhSachBoDiKem.map((vatPham, viTri) => (
                                <tr
                                  key={`bo-di-kem-${index}-${viTri}-${
                                    vatPham.ma_tai_san_snapshot || ""
                                  }`}
                                >
                                  <td>Bộ đi kèm</td>
                                  <td>{hienThi(vatPham.ten_vat_pham_snapshot)}</td>
                                  <td>{hienThi(vatPham.ma_tai_san_snapshot)}</td>
                                  <td>{hienThi(vatPham.so_serial_snapshot)}</td>
                                  <td>{hienThi(vatPham.so_luong_giao)}</td>
                                  {/* <td>{hienThi(vatPham.tinh_trang_truoc)}</td> */}
                                  <td>{hienThi(vatPham.vi_tri_luu_tru)}</td>
                                  {/* <td>{hienThi(vatPham.ghi_chu_ban_giao)}</td> */}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <form onSubmit={guiThanhLy}>
                <div className="o-form">
                  <label>Hình thức xử lý cọc</label>

                  <div className="nhom-radio">
                    <label>
                      <input
                        type="radio"
                        name="hinh_thuc_xu_ly_coc"
                        checked={hinhThucXuLyCoc === "HOAN_COC"}
                        onChange={() => setHinhThucXuLyCoc("HOAN_COC")}
                      />
                      Hoàn cọc
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="hinh_thuc_xu_ly_coc"
                        checked={hinhThucXuLyCoc === "KHAU_TRU_COC"}
                        onChange={() => setHinhThucXuLyCoc("KHAU_TRU_COC")}
                      />
                      Khấu trừ cọc
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="hinh_thuc_xu_ly_coc"
                        checked={hinhThucXuLyCoc === "PHU_THU"}
                        onChange={() => setHinhThucXuLyCoc("PHU_THU")}
                      />
                      Phụ thu
                    </label>
                  </div>

                  {/*
                  <div className="nhom-radio">
                    <label>
                      <input
                        type="checkbox"
                        checked={hinhThucXuLyCoc === "HOAN_COC"}
                        onChange={() => setHinhThucXuLyCoc("HOAN_COC")}
                      />
                      Hoàn cọc
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={hinhThucXuLyCoc === "KHAU_TRU_COC"}
                        onChange={() => setHinhThucXuLyCoc("KHAU_TRU_COC")}
                      />
                      Khấu trừ cọc
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={hinhThucXuLyCoc === "PHU_THU"}
                        onChange={() => setHinhThucXuLyCoc("PHU_THU")}
                      />
                      Phụ thu
                    </label>
                  </div>
                  */}
                </div>

                {hinhThucXuLyCoc !== "HOAN_COC" && (
                  <>
                    <div className="o-form">
                      <label>
                        {hinhThucXuLyCoc === "KHAU_TRU_COC"
                          ? "Số tiền khấu trừ"
                          : "Số tiền phụ thu"}
                      </label>

                      <input
                        type="number"
                        value={soTien}
                        onChange={(e) => setSoTien(e.target.value)}
                      />
                    </div>

                    <div className="o-form">
                      <label>Lý do phát sinh</label>

                      <textarea
                        value={lyDoPhatSinh}
                        onChange={(e) => setLyDoPhatSinh(e.target.value)}
                        rows="3"
                      />
                    </div>
                  </>
                )}

                <div className="o-form">
                  <label>Ghi chú thanh lý</label>

                  <textarea
                    value={ghiChuThanhLy}
                    onChange={(e) => setGhiChuThanhLy(e.target.value)}
                    placeholder="Ví dụ: Khách trả đủ thiết bị và phụ kiện. Lens có trầy nhẹ nên khấu trừ cọc."
                    rows="4"
                  />
                </div>

                <div className="khung-tam-tinh">
                  <p>
                    <b>Tạm tính xử lý cọc</b>
                  </p>
                  <p>Hoàn cọc: {dinhDangTien(tienTamTinh.hoanCoc)}</p>
                  <p>Khấu trừ: {dinhDangTien(tienTamTinh.khauTru)}</p>
                  <p>Phụ thu: {dinhDangTien(tienTamTinh.phuThu)}</p>
                </div>

                <div className="o-form">
                  <label>Ảnh khi trả</label>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={themAnhKhiTraToiDa5}
                  />

                  <p className="chu-mo">
                    Đã chọn {anhKhiTra.length}/5 ảnh khi trả.
                  </p>

                  <div
                    className="danh-sach-anh-da-chon"
                    style={{
                      gridTemplateColumns: `repeat(${SO_ANH_MOI_DONG}, 1fr)`,
                    }}
                  >
                    {anhKhiTra.map((file, index) => {
                      const urlTam = URL.createObjectURL(file);

                      return (
                        <div
                          className="the-anh-da-chon"
                          key={`${file.name}-${index}`}
                        >
                          <img
                            src={urlTam}
                            alt="Ảnh khi trả"
                            onClick={() => setAnhDangXem(urlTam)}
                          />

                          <button
                            className="nut-do nut-xoa-anh"
                            type="button"
                            onClick={() => xoaAnhKhiTraDaChon(index)}
                          >
                            Xóa
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="popup-actions">
                  <button type="submit" disabled={dangGui}>
                    {dangGui ? "Đang xử lý..." : "Xác nhận phiếu trả"}
                  </button>

                  <button type="button" onClick={dongPopup}>
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {anhDangXem && (
        <div className="popup-nen" onClick={() => setAnhDangXem("")}>
          <div className="popup-anh" onClick={(e) => e.stopPropagation()}>
            <img src={anhDangXem} alt="Ảnh xem lớn" />
          </div>
        </div>
      )}
    </div>
  );
}

export default SettlementList;