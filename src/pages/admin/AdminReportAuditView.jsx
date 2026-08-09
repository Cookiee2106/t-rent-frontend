import { useEffect, useRef, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

const SO_DONG_MOI_TRANG = 10;

const NAM_HIEN_TAI = new Date().getFullYear();
const DANH_SACH_NAM_DOANH_THU = Array.from(
  { length: NAM_HIEN_TAI - 1999 },
  (_, index) => NAM_HIEN_TAI - index
);

// Nếu muốn phần Tổng quan thiết bị vật lý hiển thị ít/nhiều thẻ trên 1 hàng hơn,
// chỉ cần đổi số bên dưới.
const SO_THE_TONG_QUAN_THIET_BI_MOI_HANG = 5;

// Nếu muốn phần Tổng quan phụ kiện hiển thị ít/nhiều thẻ trên 1 hàng hơn,
// chỉ cần đổi số bên dưới.
const SO_THE_TONG_QUAN_PHU_KIEN_MOI_HANG = 3;

function ReportAuditPage() {
  const [tabDangChon, setTabDangChon] = useState("DOANH_THU");
  const [popupThongBao, setPopupThongBao] = useState("");
  const [dangTai, setDangTai] = useState(false);

  // LỌC DOANH THU THEO NGÀY CŨ - GIỮ LẠI ĐỂ CÓ THỂ DÙNG LẠI SAU NÀY.
  // const [tuNgayDoanhThu, setTuNgayDoanhThu] = useState("");
  // const [denNgayDoanhThu, setDenNgayDoanhThu] = useState("");

  // Lọc doanh thu theo tháng để thống nhất với bảng "Doanh thu theo tháng".
  const [namDoanhThu, setNamDoanhThu] = useState(String(NAM_HIEN_TAI));
  const [tuThangDoanhThu, setTuThangDoanhThu] = useState("");
  const [denThangDoanhThu, setDenThangDoanhThu] = useState("");
  const [baoCaoDoanhThu, setBaoCaoDoanhThu] = useState(null);
  const [trangDoanhThuTheoMau, setTrangDoanhThuTheoMau] = useState(1);

  const [hangId, setHangId] = useState("0");
  const [danhMucId, setDanhMucId] = useState("0");
  const [tuKhoaTonKho, setTuKhoaTonKho] = useState("");
  const [baoCaoTonKho, setBaoCaoTonKho] = useState(null);

  const [loaiThaoTac, setLoaiThaoTac] = useState("0");
  const [tuKhoaThaoTac, setTuKhoaThaoTac] = useState("");
  const [tuNgayThaoTac, setTuNgayThaoTac] = useState("");
  const [denNgayThaoTac, setDenNgayThaoTac] = useState("");
  const [danhSachThaoTac, setDanhSachThaoTac] = useState([]);
  const [tongDongThaoTac, setTongDongThaoTac] = useState(0);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [chiTietThaoTac, setChiTietThaoTac] = useState(null);

  // Chỉ nhận kết quả của lần tìm kiếm nhật ký mới nhất.
  // Phản hồi cũ về chậm sẽ bị bỏ qua để dữ liệu không nhảy ngược lại.
  const lanGoiNhatKyMoiNhat = useRef(0);

  // Giữ focus tại ô tìm kiếm để có thể giữ Backspace xóa liên tục.
  const oTimKiemThaoTacRef = useRef(null);

  function moPopupThongBao(noiDung) {
    setPopupThongBao(noiDung || "Có lỗi xảy ra");
  }

  function hienThi(giaTri) {
    if (giaTri === null || giaTri === undefined || giaTri === "") {
      return "-";
    }

    return giaTri;
  }

  function dinhDangTien(giaTri) {
    if (giaTri === null || giaTri === undefined) return "-";
    return Number(giaTri || 0).toLocaleString("vi-VN") + " đ";
  }

  function dinhDangNgayGio(giaTri) {
    if (!giaTri) return "-";

    return new Date(giaTri).toLocaleString("vi-VN", {
      hour12: false,
    });
  }

  // Chuyển giá trị yyyy-mm của input month thành MM/yyyy để hiển thị đẹp hơn.
  function dinhDangThangNam(giaTri) {
    if (!giaTri) return "";

    const [nam, thang] = giaTri.split("-");
    return `${thang}/${nam}`;
  }

  function hienThiVaiTro(item) {
    return item.ten_vai_tro || item.vai_tro || "-";
  }

  function coDuNgay(tuNgay, denNgay) {
    return (!tuNgay && !denNgay) || (tuNgay && denNgay);
  }

  function coDuThang(tuThang, denThang) {
    return (!tuThang && !denThang) || (tuThang && denThang);
  }

  function khoangThangDoanhThuHopLe() {
    if (!coDuThang(tuThangDoanhThu, denThangDoanhThu)) return false;

    if (!tuThangDoanhThu && !denThangDoanhThu) return true;

    if (
      !tuThangDoanhThu.startsWith(`${namDoanhThu}-`) ||
      !denThangDoanhThu.startsWith(`${namDoanhThu}-`)
    ) {
      return false;
    }

    return tuThangDoanhThu <= denThangDoanhThu;
  }

  // Chuyển 07/2026 thành ngày đầu tháng: 2026-07-01.
  function layNgayDauThang(thangNam) {
    if (!thangNam) return "";
    return `${thangNam}-01`;
  }

  // Chuyển 08/2026 thành ngày cuối tháng: 2026-08-31.
  function layNgayCuoiThang(thangNam) {
    if (!thangNam) return "";

    const [nam, thang] = thangNam.split("-").map(Number);
    const ngayCuoi = new Date(nam, thang, 0).getDate();

    return `${thangNam}-${String(ngayCuoi).padStart(2, "0")}`;
  }

  // Dùng cho tìm kiếm tên mẫu và tên phụ kiện ở Frontend.
  function chuanHoaChuoi(giaTri) {
    return String(giaTri || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");
  }

  async function layBaoCaoDoanhThu() {
    if (!khoangThangDoanhThuHopLe()) return;

    try {
      setDangTai(true);

      const params = new URLSearchParams();

      // LỌC THEO NGÀY CŨ - GIỮ LẠI, KHÔNG XÓA.
      // if (tuNgayDoanhThu && denNgayDoanhThu) {
      //   params.set("from", tuNgayDoanhThu);
      //   params.set("to", denNgayDoanhThu);
      // }

      // Ví dụ:
      // Từ tháng 07/2026 -> from = 2026-07-01.
      // Đến tháng 08/2026 -> to = 2026-08-31.
      let tuNgayBaoCao = `${namDoanhThu}-01-01`;
      let denNgayBaoCao = `${namDoanhThu}-12-31`;

      if (tuThangDoanhThu && denThangDoanhThu) {
        tuNgayBaoCao = layNgayDauThang(tuThangDoanhThu);
        denNgayBaoCao = layNgayCuoiThang(denThangDoanhThu);
      }

      params.set("from", tuNgayBaoCao);
      params.set("to", denNgayBaoCao);

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/reports/revenue?${params.toString()}`,
        {
          headers: taoHeaderCoToken(),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setBaoCaoDoanhThu(duLieu.data);
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    } finally {
      setDangTai(false);
    }
  }

  async function layBaoCaoTonKho() {
    try {
      setDangTai(true);

      const params = new URLSearchParams();

      if (hangId !== "0") {
        params.set("hang_id", hangId);
      }

      if (danhMucId !== "0") {
        params.set("danh_muc_id", danhMucId);
      }

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/reports/inventory?${params.toString()}`,
        {
          headers: taoHeaderCoToken(),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setBaoCaoTonKho(duLieu.data);
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    } finally {
      setDangTai(false);
    }
  }

  async function layDanhSachThaoTac() {
    if (!coDuNgay(tuNgayThaoTac, denNgayThaoTac)) return;

    // Mỗi lần gọi API được gắn một số thứ tự.
    // Chỉ lần gọi mới nhất được phép cập nhật giao diện.
    const lanGoiHienTai = lanGoiNhatKyMoiNhat.current + 1;
    lanGoiNhatKyMoiNhat.current = lanGoiHienTai;

    try {
      const params = new URLSearchParams();
      params.set("page", trangHienTai);
      params.set("limit", SO_DONG_MOI_TRANG);

      if (loaiThaoTac !== "0") {
        params.set("loai_thao_tac", loaiThaoTac);
      }

      const tuKhoa = tuKhoaThaoTac.trim();

      if (tuKhoa) {
        params.set("tu_khoa", tuKhoa);
      }

      if (tuNgayThaoTac && denNgayThaoTac) {
        params.set("from", tuNgayThaoTac);
        params.set("to", denNgayThaoTac);
      }

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/audit-logs?${params.toString()}`,
        {
          headers: taoHeaderCoToken(),
        }
      );

      const duLieu = await phanHoi.json();

      // Trong lúc chờ, nếu người dùng đã nhập từ khóa khác
      // thì không dùng kết quả cũ này nữa.
      if (lanGoiHienTai !== lanGoiNhatKyMoiNhat.current) {
        return;
      }

      if (duLieu.success) {
        setDanhSachThaoTac(duLieu.data || []);
        setTongDongThaoTac(Number(duLieu.total || 0));
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      // Chỉ hiện lỗi của lần gọi mới nhất.
      if (lanGoiHienTai === lanGoiNhatKyMoiNhat.current) {
        moPopupThongBao("Không kết nối được server");
      }
    }
  }

  async function xemChiTietThaoTac(id) {
    try {
      const phanHoi = await fetch(`${DUONG_DAN_API}/api/admin/audit-logs/${id}`, {
        headers: taoHeaderCoToken(),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setChiTietThaoTac(duLieu.data);
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    }
  }

  function xoaLocDoanhThu() {
    // LỌC THEO NGÀY CŨ - GIỮ LẠI, KHÔNG XÓA.
    // setTuNgayDoanhThu("");
    // setDenNgayDoanhThu("");

    setNamDoanhThu(String(NAM_HIEN_TAI));
    setTuThangDoanhThu("");
    setDenThangDoanhThu("");
    setTrangDoanhThuTheoMau(1);
  }

  function xoaLocTonKho() {
    setHangId("0");
    setDanhMucId("0");
    setTuKhoaTonKho("");
  }

  function xoaLocThaoTac() {
    setLoaiThaoTac("0");
    setTuKhoaThaoTac("");
    setTuNgayThaoTac("");
    setDenNgayThaoTac("");
    setTrangHienTai(1);
  }

  useEffect(() => {
    if (tabDangChon === "DOANH_THU") {
      layBaoCaoDoanhThu();
    }

    // DEPENDENCY LỌC THEO NGÀY CŨ - GIỮ LẠI, KHÔNG XÓA.
    // [tabDangChon, tuNgayDoanhThu, denNgayDoanhThu]
  }, [tabDangChon, namDoanhThu, tuThangDoanhThu, denThangDoanhThu]);

  useEffect(() => {
    if (tabDangChon === "TON_KHO") {
      layBaoCaoTonKho();
    }
  }, [tabDangChon, hangId, danhMucId]);

  useEffect(() => {
    if (tabDangChon === "NHAT_KY") {
      layDanhSachThaoTac();
    }
  }, [
    tabDangChon,
    loaiThaoTac,
    tuKhoaThaoTac,
    tuNgayThaoTac,
    denNgayThaoTac,
    trangHienTai,
  ]);

  const tongTrangThaoTac = Math.max(
    1,
    Math.ceil(tongDongThaoTac / SO_DONG_MOI_TRANG)
  );

  const tongPhuKienDangThue = (baoCaoTonKho?.accessories || []).reduce(
    (tong, item) => tong + Number(item.dang_thue || 0),
    0
  );

  // Tồn kho được lọc ngay khi người dùng nhập.
  const tuKhoaTonKhoChuanHoa = chuanHoaChuoi(tuKhoaTonKho);

  const danhSachThietBiDaLoc = (
    baoCaoTonKho?.physical_devices || []
  ).filter((item) => {
    if (!tuKhoaTonKhoChuanHoa) return true;

    return chuanHoaChuoi(item.ten_mau).includes(
      tuKhoaTonKhoChuanHoa
    );
  });

  const danhSachPhuKienDaLoc = (
    baoCaoTonKho?.accessories || []
  ).filter((item) => {
    if (!tuKhoaTonKhoChuanHoa) return true;

    return chuanHoaChuoi(item.ten_phu_kien).includes(
      tuKhoaTonKhoChuanHoa
    );
  });

  function renderTheThongKe(tieuDe, giaTri) {
    return (
      <div className="the-thong-ke-bao-cao">
        <p>{tieuDe}</p>
        <h3>{giaTri}</h3>
      </div>
    );
  }

  // Ô chọn tháng riêng để không hiện dạng gạch ngang xấu của input month.
  // Input month thật vẫn nằm phủ toàn bộ ô nên người dùng chỉ cần bấm vào ô.
  function renderOChonThang({
    nhan,
    giaTri,
    capNhatGiaTri,
    nam,
  }) {
    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flex: "0 0 230px",
          minWidth: "230px",
          height: "36px",
          padding: "0 9px",
          background: "#ffffff",
          border: "1px solid #b8b8b8",
          borderRadius: "4px",
          boxSizing: "border-box",
          width: "230px",
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontSize: "14px",
            color: giaTri ? "#111111" : "#6b7280",
            pointerEvents: "none",
          }}
        >
          {giaTri ? dinhDangThangNam(giaTri) : nhan}
        </span>

        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{
            color: "#111111",
            flexShrink: 0,
            pointerEvents: "none",
          }}
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4" />
          <path d="M8 3v4" />
          <path d="M3 11h18" />
        </svg>

        <input
          type="month"
          aria-label={nhan}
          title={nhan}
          value={giaTri}
          min={nam ? `${nam}-01` : undefined}
          max={nam ? `${nam}-12` : undefined}
          onChange={(e) => capNhatGiaTri(e.target.value)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
          }}
        />
      </div>
    );
  }

  function renderDoanhThu() {
    const data = baoCaoDoanhThu?.data || [];
    const doanhThuTheoMau =
      baoCaoDoanhThu?.revenue_by_models || [];

    const tongTrangDoanhThuTheoMau = Math.max(
      1,
      Math.ceil(doanhThuTheoMau.length / SO_DONG_MOI_TRANG)
    );

    const batDauDoanhThuTheoMau =
      (trangDoanhThuTheoMau - 1) * SO_DONG_MOI_TRANG;

    const danhSachDoanhThuTheoMau = doanhThuTheoMau.slice(
      batDauDoanhThuTheoMau,
      batDauDoanhThuTheoMau + SO_DONG_MOI_TRANG
    );

    return (
      <div>
        <div className="khung-loc-admin">
          {/* LỌC DOANH THU THEO NGÀY CŨ - GIỮ LẠI, KHÔNG XÓA.
          <input
            type="date"
            value={tuNgayDoanhThu}
            onChange={(e) => setTuNgayDoanhThu(e.target.value)}
          />

          <input
            type="date"
            value={denNgayDoanhThu}
            onChange={(e) => setDenNgayDoanhThu(e.target.value)}
          />
          */}

          <select
            value={namDoanhThu}
            onChange={(e) => {
              setNamDoanhThu(e.target.value);
              setTuThangDoanhThu("");
              setDenThangDoanhThu("");
              setTrangDoanhThuTheoMau(1);
            }}
          >
            {DANH_SACH_NAM_DOANH_THU.map((nam) => (
              <option key={nam} value={nam}>
                Năm {nam}
              </option>
            ))}
          </select>

          {renderOChonThang({
            nhan: "Từ tháng",
            giaTri: tuThangDoanhThu,
            nam: namDoanhThu,
            capNhatGiaTri: (giaTri) => {
              setTuThangDoanhThu(giaTri);
              setTrangDoanhThuTheoMau(1);
            },
          })}

          {renderOChonThang({
            nhan: "Đến tháng",
            giaTri: denThangDoanhThu,
            nam: namDoanhThu,
            capNhatGiaTri: (giaTri) => {
              setDenThangDoanhThu(giaTri);
              setTrangDoanhThuTheoMau(1);
            },
          })}

          <button className="nut-huy" type="button" onClick={xoaLocDoanhThu}>
            Xóa lọc
          </button>
        </div>

        {/* THÔNG BÁO LỌC THEO NGÀY CŨ - GIỮ LẠI, KHÔNG XÓA.
        {!coDuNgay(tuNgayDoanhThu, denNgayDoanhThu) && (
          <p className="thong-bao">
            Vui lòng chọn đủ ngày bắt đầu và ngày kết thúc.
          </p>
        )}
        */}

        {!coDuThang(tuThangDoanhThu, denThangDoanhThu) && (
          <p className="thong-bao">
            Vui lòng chọn đủ tháng bắt đầu và tháng kết thúc.
          </p>
        )}

        {coDuThang(tuThangDoanhThu, denThangDoanhThu) &&
          tuThangDoanhThu &&
          !khoangThangDoanhThuHopLe() && (
            <p className="thong-bao">
              Khoảng tháng phải thuộc năm {namDoanhThu} và tháng bắt đầu không được lớn hơn tháng kết thúc.
            </p>
          )}

        <div
          className="luoi-the-thong-ke luoi-the-thong-ke-gon"
          style={{ gridTemplateColumns: "repeat(2, minmax(220px, 1fr))" }}
        >
          {renderTheThongKe(
            "Tổng doanh thu",
            dinhDangTien(baoCaoDoanhThu?.tong_doanh_thu)
          )}
          {renderTheThongKe(
            "Số đơn có doanh thu",
            baoCaoDoanhThu?.tong_don_thue || 0
          )}
        </div>

        <h3>Doanh thu theo tháng</h3>

        <div className="admin-bang-wrapper">
          <table className="bang-quan-ly bang-gon">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tháng</th>
                <th>Số đơn có doanh thu</th>
                <th>Doanh thu</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => (
                <tr key={item.thang_hien_thi}>
                  <td>{index + 1}</td>
                  <td>{hienThi(item.thang_hien_thi)}</td>
                  <td>{item.so_don_thue}</td>
                  <td className="tien-thue-don">
                    {dinhDangTien(item.tong_doanh_thu)}
                  </td>
                </tr>
              ))}

              {data.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h3>Doanh thu theo mẫu thiết bị</h3>

        <div className="admin-bang-wrapper">
          <table className="bang-quan-ly bang-gon">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên mẫu</th>
                <th>Hãng</th>
                <th>Danh mục</th>
                <th>Số lần thuê</th>
                <th>Doanh thu tiền thuê</th>
              </tr>
            </thead>

            <tbody>
              {danhSachDoanhThuTheoMau.map((item, index) => (
                <tr key={item.mau_thiet_bi_id || index}>
                  <td>{batDauDoanhThuTheoMau + index + 1}</td>
                  <td>{hienThi(item.ten_mau)}</td>
                  <td>{hienThi(item.ten_hang)}</td>
                  <td>{hienThi(item.ten_danh_muc)}</td>
                  <td>{item.so_lan_thue}</td>
                  <td className="tien-thue-don">
                    {dinhDangTien(item.tong_doanh_thu)}
                  </td>
                </tr>
              ))}

              {doanhThuTheoMau.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="phan-trang">
          <button
            className="nut-dong-popup"
            type="button"
            disabled={trangDoanhThuTheoMau === 1}
            onClick={() => setTrangDoanhThuTheoMau(trangDoanhThuTheoMau - 1)}
          >
            Trước
          </button>

          <span>
            Trang {trangDoanhThuTheoMau} / {tongTrangDoanhThuTheoMau}
          </span>

          <button
            className="nut-dong-popup"
            type="button"
            disabled={trangDoanhThuTheoMau === tongTrangDoanhThuTheoMau}
            onClick={() => setTrangDoanhThuTheoMau(trangDoanhThuTheoMau + 1)}
          >
            Sau
          </button>
        </div>

      </div>
    );
  }

  function renderTonKho() {
    const summary = baoCaoTonKho?.summary || {};

    return (
      <div>
        <div className="khung-loc-admin">
          <input
            type="text"
            placeholder="Tìm tên mẫu hoặc phụ kiện"
            value={tuKhoaTonKho}
            onChange={(e) => setTuKhoaTonKho(e.target.value)}
          />

          <select value={hangId} onChange={(e) => setHangId(e.target.value)}>
            <option value="0">Tất cả hãng</option>
            {(baoCaoTonKho?.brands || []).map((hang) => (
              <option key={hang.id} value={hang.id}>
                {hang.ten_hang}
              </option>
            ))}
          </select>

          <select value={danhMucId} onChange={(e) => setDanhMucId(e.target.value)}>
            <option value="0">Tất cả danh mục</option>
            {(baoCaoTonKho?.categories || []).map((dm) => (
              <option key={dm.id} value={dm.id}>
                {dm.ten_danh_muc}
              </option>
            ))}
          </select>

          <button className="nut-huy" type="button" onClick={xoaLocTonKho}>
            Xóa lọc
          </button>
        </div>

        <h3>Tổng quan thiết bị vật lý</h3>

        <div
          className="luoi-the-thong-ke luoi-the-thong-ke-gon"
          style={{
            gridTemplateColumns: `repeat(${SO_THE_TONG_QUAN_THIET_BI_MOI_HANG}, minmax(170px, 1fr))`,
          }}
        >
          {renderTheThongKe("Tổng thiết bị", summary.tong_thiet_bi || 0)}
          {renderTheThongKe("Đang thuê", summary.thiet_bi_dang_thue || 0)}
          {renderTheThongKe("Đang bảo trì", summary.thiet_bi_dang_bao_tri || 0)}
          {renderTheThongKe("Hư hỏng", summary.thiet_bi_hu_hong || 0)}
          {renderTheThongKe("Bị mất", summary.thiet_bi_bi_mat || 0)}
        </div>

        <h3>Tổng quan phụ kiện</h3>

        <div
          className="luoi-the-thong-ke luoi-the-thong-ke-gon"
          style={{
            gridTemplateColumns: `repeat(${SO_THE_TONG_QUAN_PHU_KIEN_MOI_HANG}, minmax(220px, 1fr))`,
          }}
        >
          {renderTheThongKe(
            "Tổng phụ kiện",
            summary.tong_so_luong_phu_kien || 0
          )}
          {renderTheThongKe("Đang thuê", tongPhuKienDangThue)}
          {renderTheThongKe("Mất/hư hỏng", summary.phu_kien_mat_hu_hong || 0)}
        </div>

        <h3>Báo cáo thiết bị vật lý</h3>

        <div className="admin-bang-wrapper">
          <table className="bang-quan-ly bang-gon">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên mẫu</th>
                <th>Hãng</th>
                <th>Danh mục</th>
                <th>Tổng thiết bị</th>
                <th>Sẵn sàng</th>
                <th>Đang thuê</th>
                <th>Đang bảo trì</th>
                <th>Hư hỏng</th>
                <th>Bị mất</th>
              </tr>
            </thead>

            <tbody>
              {danhSachThietBiDaLoc.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{hienThi(item.ten_mau)}</td>
                  <td>{hienThi(item.ten_hang)}</td>
                  <td>{hienThi(item.ten_danh_muc)}</td>
                  <td>{item.tong_so_luong}</td>
                  <td>{item.san_sang}</td>
                  <td>{item.dang_thue}</td>
                  <td>{item.dang_bao_tri}</td>
                  <td>{item.hu_hong}</td>
                  <td>{item.bi_mat}</td>
                </tr>
              ))}

              {danhSachThietBiDaLoc.length === 0 && (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h3>Báo cáo phụ kiện</h3>

        <div className="admin-bang-wrapper">
          <table className="bang-quan-ly bang-gon">
            <thead>
              <tr>
                <th>STT</th>
                <th>Phụ kiện</th>
                <th>Danh mục</th>
                <th>Tổng phụ kiện</th>
                <th>Đang thuê</th>
                <th>Sẵn sàng</th>
                <th>Mất/hư hỏng</th>
              </tr>
            </thead>

            <tbody>
              {danhSachPhuKienDaLoc.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{hienThi(item.ten_phu_kien)}</td>
                  <td>{hienThi(item.ten_danh_muc)}</td>
                  <td>{item.tong_so_luong}</td>
                  <td>{item.dang_thue}</td>
                  <td>{item.san_sang}</td>
                  <td>{item.hu_hong_mat}</td>
                </tr>
              ))}

              {danhSachPhuKienDaLoc.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderNhatKy() {
    return (
      <div>
        <div className="khung-loc-admin">
          <input
            ref={oTimKiemThaoTacRef}
            type="text"
            placeholder="Tìm tên người hoặc mã đơn"
            value={tuKhoaThaoTac}
            onChange={(e) => {
              const viTriConTro = e.target.selectionStart;
              const giaTriMoi = e.target.value;

              setTuKhoaThaoTac(giaTriMoi);
              setTrangHienTai(1);

              // Sau khi React cập nhật dữ liệu, đưa focus và con trỏ
              // trở lại đúng vị trí trong ô tìm kiếm.
              requestAnimationFrame(() => {
                const oTimKiem = oTimKiemThaoTacRef.current;

                if (!oTimKiem) return;

                if (document.activeElement !== oTimKiem) {
                  oTimKiem.focus();
                }

                if (viTriConTro !== null) {
                  oTimKiem.setSelectionRange(
                    viTriConTro,
                    viTriConTro
                  );
                }
              });
            }}
          />

          <select
            value={loaiThaoTac}
            onChange={(e) => {
              setLoaiThaoTac(e.target.value);
              setTrangHienTai(1);
            }}
          >
            <option value="0">Tất cả hành động</option>
            <option value="THANH_TOAN_COC">Thanh toán tiền giữ chỗ</option>
            <option value="NHAN_TIEN_THUE">Nhận tiền thuê khi bàn giao</option>
            <option value="THANH_LY">Thanh lý hợp đồng</option>
          </select>

          <input
            type="date"
            value={tuNgayThaoTac}
            onChange={(e) => {
              setTuNgayThaoTac(e.target.value);
              setTrangHienTai(1);
            }}
          />

          <input
            type="date"
            value={denNgayThaoTac}
            onChange={(e) => {
              setDenNgayThaoTac(e.target.value);
              setTrangHienTai(1);
            }}
          />

          <button className="nut-huy" type="button" onClick={xoaLocThaoTac}>
            Xóa lọc
          </button>
        </div>

        {!coDuNgay(tuNgayThaoTac, denNgayThaoTac) && (
          <p className="thong-bao">Vui lòng chọn đủ ngày bắt đầu và ngày kết thúc.</p>
        )}

        <div className="admin-bang-wrapper">
          <table className="bang-quan-ly bang-gon">
            <thead>
              <tr>
                <th>STT</th>
                <th>Người dùng</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Mã đơn</th>
                <th>Hành động</th>
                <th>Thời gian</th>
                <th>Chi tiết</th>
              </tr>
            </thead>

            <tbody>
              {danhSachThaoTac.map((item, index) => (
                <tr key={item.id}>
                  <td>{(trangHienTai - 1) * SO_DONG_MOI_TRANG + index + 1}</td>
                  <td>{hienThi(item.ten_nguoi_dung)}</td>
                  <td>{hienThi(item.email)}</td>
                  <td>{hienThi(hienThiVaiTro(item))}</td>
                  <td>{hienThi(item.ma_don)}</td>
                  <td>{hienThi(item.ten_thao_tac)}</td>
                  <td>{dinhDangNgayGio(item.thoi_gian)}</td>
                  <td>
                    <button
                      className="nut-xem-chi-tiet"
                      type="button"
                      onClick={() => xemChiTietThaoTac(item.id)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}

              {danhSachThaoTac.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="phan-trang">
          <button
            className="nut-dong-popup"
            type="button"
            disabled={trangHienTai === 1}
            onClick={() => setTrangHienTai(trangHienTai - 1)}
          >
            Trước
          </button>

          <span>
            Trang {trangHienTai} / {tongTrangThaoTac}
          </span>

          <button
            className="nut-dong-popup"
            type="button"
            disabled={trangHienTai === tongTrangThaoTac}
            onClick={() => setTrangHienTai(trangHienTai + 1)}
          >
            Sau
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="khung-trang trang-bao-cao-nhat-ky">
      <h2>Báo cáo và nhật ký thao tác</h2>

      <div className="tab-bao-cao-nhat-ky">
        <button
          className={tabDangChon === "DOANH_THU" ? "tab-dang-chon" : ""}
          type="button"
          onClick={() => setTabDangChon("DOANH_THU")}
        >
          Doanh thu
        </button>

        <button
          className={tabDangChon === "TON_KHO" ? "tab-dang-chon" : ""}
          type="button"
          onClick={() => setTabDangChon("TON_KHO")}
        >
          Tài sản cho thuê
        </button>

        <button
          className={tabDangChon === "NHAT_KY" ? "tab-dang-chon" : ""}
          type="button"
          onClick={() => setTabDangChon("NHAT_KY")}
        >
          Nhật ký thao tác
        </button>
      </div>

      {dangTai && tabDangChon !== "NHAT_KY" && (
        <p className="thong-bao">Đang tải dữ liệu...</p>
      )}

      {!dangTai && tabDangChon === "DOANH_THU" && renderDoanhThu()}
      {!dangTai && tabDangChon === "TON_KHO" && renderTonKho()}

      {/* Nhật ký luôn được giữ trên màn hình khi đang tìm kiếm.
          Dữ liệu chỉ thay đổi sau khi API mới nhất trả về. */}
      {tabDangChon === "NHAT_KY" && renderNhatKy()}

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

      {chiTietThaoTac && (
        <div className="popup-overlay" onClick={() => setChiTietThaoTac(null)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h3>Chi tiết thao tác</h3>
            <p><strong>Người dùng:</strong> {hienThi(chiTietThaoTac.ten_nguoi_dung)}</p>
            <p><strong>Email:</strong> {hienThi(chiTietThaoTac.email)}</p>
            <p><strong>Vai trò:</strong> {hienThi(hienThiVaiTro(chiTietThaoTac))}</p>
            <p><strong>Mã đơn:</strong> {hienThi(chiTietThaoTac.ma_don)}</p>
            <p><strong>Hành động:</strong> {hienThi(chiTietThaoTac.ten_thao_tac)}</p>
            <p><strong>Số tiền:</strong> {dinhDangTien(chiTietThaoTac.so_tien)}</p>
            <p><strong>Thời gian:</strong> {dinhDangNgayGio(chiTietThaoTac.thoi_gian)}</p>
            <p><strong>Ghi chú:</strong> {hienThi(chiTietThaoTac.ghi_chu)}</p>
            <div className="popup-actions">
              <button className="nut-dong-popup" type="button" onClick={() => setChiTietThaoTac(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportAuditPage;