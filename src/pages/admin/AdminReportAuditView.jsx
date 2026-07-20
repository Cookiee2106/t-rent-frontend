import { useEffect, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

const SO_DONG_MOI_TRANG = 10;

function ReportAuditPage() {
  const [tabDangChon, setTabDangChon] = useState("DOANH_THU");
  const [popupThongBao, setPopupThongBao] = useState("");
  const [dangTai, setDangTai] = useState(false);

  const [tuNgayDoanhThu, setTuNgayDoanhThu] = useState("");
  const [denNgayDoanhThu, setDenNgayDoanhThu] = useState("");
  const [baoCaoDoanhThu, setBaoCaoDoanhThu] = useState(null);

  const [hangId, setHangId] = useState("0");
  const [danhMucId, setDanhMucId] = useState("0");
  const [baoCaoTonKho, setBaoCaoTonKho] = useState(null);

  const [loaiThaoTac, setLoaiThaoTac] = useState("0");
  const [tuNgayThaoTac, setTuNgayThaoTac] = useState("");
  const [denNgayThaoTac, setDenNgayThaoTac] = useState("");
  const [danhSachThaoTac, setDanhSachThaoTac] = useState([]);
  const [tongDongThaoTac, setTongDongThaoTac] = useState(0);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [chiTietThaoTac, setChiTietThaoTac] = useState(null);

  function moPopupThongBao(noiDung) {
    setPopupThongBao(noiDung || "Có lỗi xảy ra");
  }

  function hienThi(giaTri) {
    return giaTri || "-";
  }

  function dinhDangTien(giaTri) {
    if (giaTri === null || giaTri === undefined) return "-";
    return Number(giaTri || 0).toLocaleString("vi-VN") + " đ";
  }

  function dinhDangNgay(giaTri) {
    if (!giaTri) return "-";
    return new Date(giaTri).toLocaleDateString("vi-VN");
  }

  function hienThiVaiTro(item) {
    return item.ten_vai_tro || item.vai_tro || "-";
  }

  function coDuNgay(tuNgay, denNgay) {
    return (!tuNgay && !denNgay) || (tuNgay && denNgay);
  }

  async function layBaoCaoDoanhThu() {
    if (!coDuNgay(tuNgayDoanhThu, denNgayDoanhThu)) return;

    try {
      setDangTai(true);

      const params = new URLSearchParams();

      if (tuNgayDoanhThu && denNgayDoanhThu) {
        params.set("from", tuNgayDoanhThu);
        params.set("to", denNgayDoanhThu);
      }

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

    try {
      setDangTai(true);

      const params = new URLSearchParams();
      params.set("page", trangHienTai);
      params.set("limit", SO_DONG_MOI_TRANG);

      if (loaiThaoTac !== "0") {
        params.set("loai_thao_tac", loaiThaoTac);
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

      if (duLieu.success) {
        setDanhSachThaoTac(duLieu.data || []);
        setTongDongThaoTac(Number(duLieu.total || 0));
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    } finally {
      setDangTai(false);
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
    setTuNgayDoanhThu("");
    setDenNgayDoanhThu("");
  }

  function xoaLocTonKho() {
    setHangId("0");
    setDanhMucId("0");
  }

  function xoaLocThaoTac() {
    setLoaiThaoTac("0");
    setTuNgayThaoTac("");
    setDenNgayThaoTac("");
    setTrangHienTai(1);
  }

  useEffect(() => {
    if (tabDangChon === "DOANH_THU") {
      layBaoCaoDoanhThu();
    }
  }, [tabDangChon, tuNgayDoanhThu, denNgayDoanhThu]);

  useEffect(() => {
    if (tabDangChon === "TON_KHO") {
      layBaoCaoTonKho();
    }
  }, [tabDangChon, hangId, danhMucId]);

  useEffect(() => {
    if (tabDangChon === "NHAT_KY") {
      layDanhSachThaoTac();
    }
  }, [tabDangChon, loaiThaoTac, tuNgayThaoTac, denNgayThaoTac, trangHienTai]);

  const tongTrangThaoTac = Math.max(
    1,
    Math.ceil(tongDongThaoTac / SO_DONG_MOI_TRANG)
  );

  function renderTheThongKe(tieuDe, giaTri) {
    return (
      <div className="the-thong-ke-bao-cao">
        <p>{tieuDe}</p>
        <h3>{giaTri}</h3>
      </div>
    );
  }

  function renderDoanhThu() {
    const data = baoCaoDoanhThu?.data || [];

    return (
      <div>
        <div className="khung-loc-admin">
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

          <button className="nut-dong-y" type="button" onClick={xoaLocDoanhThu}>
            Xóa lọc
          </button>
        </div>

        {!coDuNgay(tuNgayDoanhThu, denNgayDoanhThu) && (
          <p className="thong-bao">Vui lòng chọn đủ ngày bắt đầu và ngày kết thúc.</p>
        )}

        <div className="luoi-the-thong-ke luoi-the-thong-ke-gon">
          {renderTheThongKe("Tổng doanh thu tiền thuê", dinhDangTien(baoCaoDoanhThu?.tong_doanh_thu))}
          {renderTheThongKe("Số đơn đã ghi nhận tiền thuê", baoCaoDoanhThu?.tong_don_thue || 0)}
        </div>

        <h3>Doanh thu theo tháng</h3>

        <div className="admin-bang-wrapper">
          <table className="bang-quan-ly bang-gon">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tháng</th>
                <th>Số đơn thuê</th>
                <th>Doanh thu tiền thuê</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => (
                <tr key={item.thang_hien_thi}>
                  <td>{index + 1}</td>
                  <td>{hienThi(item.thang_hien_thi)}</td>
                  <td>{item.so_don_thue}</td>
                  <td className="tien-thue-don">{dinhDangTien(item.tong_doanh_thu)}</td>
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
      </div>
    );
  }

  function renderTonKho() {
    const summary = baoCaoTonKho?.summary || {};

    return (
      <div>
        <div className="khung-loc-admin">
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

          <button className="nut-dong-y" type="button" onClick={xoaLocTonKho}>
            Xóa lọc
          </button>
        </div>

        <div className="luoi-the-thong-ke luoi-the-thong-ke-gon">
          {renderTheThongKe("Tổng thiết bị", summary.tong_thiet_bi || 0)}
          {renderTheThongKe("Tổng phụ kiện", summary.tong_so_luong_phu_kien || 0)}
          {renderTheThongKe("Thiết bị hư hỏng", summary.thiet_bi_hu_hong || 0)}
          {renderTheThongKe("Thiết bị bị mất", summary.thiet_bi_bi_mat || 0)}
          {renderTheThongKe("Phụ kiện bị mất/hư hỏng", summary.phu_kien_mat_hu_hong || 0)}
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
                <th>Tổng số lượng</th>
                <th>Đang thuê</th>
                <th>Hư hỏng/mất</th>
                <th>Sẵn sàng</th>
              </tr>
            </thead>

            <tbody>
              {(baoCaoTonKho?.physical_devices || []).map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{hienThi(item.ten_mau)}</td>
                  <td>{hienThi(item.ten_hang)}</td>
                  <td>{hienThi(item.ten_danh_muc)}</td>
                  <td>{item.tong_so_luong}</td>
                  <td>{item.dang_thue}</td>
                  <td>{item.hu_hong_mat}</td>
                  <td>{item.san_sang}</td>
                </tr>
              ))}

              {(baoCaoTonKho?.physical_devices || []).length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
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
                <th>Hãng</th>
                <th>Danh mục</th>
                <th>Tổng số lượng</th>
                <th>Đang thuê</th>
                <th>Hư hỏng/mất</th>
                <th>Sẵn sàng</th>
              </tr>
            </thead>

            <tbody>
              {(baoCaoTonKho?.accessories || []).map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{hienThi(item.ten_phu_kien)}</td>
                  <td>{hienThi(item.ten_hang)}</td>
                  <td>{hienThi(item.ten_danh_muc)}</td>
                  <td>{item.tong_so_luong}</td>
                  <td>{item.dang_thue}</td>
                  <td>{item.hu_hong_mat}</td>
                  <td>{item.san_sang}</td>
                </tr>
              ))}

              {(baoCaoTonKho?.accessories || []).length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
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
          <select
            value={loaiThaoTac}
            onChange={(e) => {
              setLoaiThaoTac(e.target.value);
              setTrangHienTai(1);
            }}
          >
            <option value="0">Tất cả hành động</option>
            <option value="THANH_TOAN_COC">Thanh toán tiền cọc</option>
            <option value="NHAN_TIEN_THUE">Bàn giao và nhận tiền thuê</option>
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

          <button className="nut-dong-y" type="button" onClick={xoaLocThaoTac}>
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
                  <td>{dinhDangNgay(item.thoi_gian)}</td>
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
      <h2>Báo cáo nhật ký và thao tác</h2>

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
          Tồn kho
        </button>

        <button
          className={tabDangChon === "NHAT_KY" ? "tab-dang-chon" : ""}
          type="button"
          onClick={() => setTabDangChon("NHAT_KY")}
        >
          Nhật ký thao tác
        </button>
      </div>

      {dangTai && <p className="thong-bao">Đang tải dữ liệu...</p>}

      {tabDangChon === "DOANH_THU" && renderDoanhThu()}
      {tabDangChon === "TON_KHO" && renderTonKho()}
      {tabDangChon === "NHAT_KY" && renderNhatKy()}

      {chiTietThaoTac && (
        <div className="popup-nen">
          <div className="popup-hop">
            <div className="popup-tieu-de">
              <h3>Chi tiết thao tác</h3>
            </div>

            <div className="popup-noi-dung">
              <table className="bang-popup">
                <tbody>
                  <tr>
                    <td>Người dùng</td>
                    <td>{hienThi(chiTietThaoTac.ten_nguoi_dung)}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{hienThi(chiTietThaoTac.email)}</td>
                  </tr>
                  <tr>
                    <td>Vai trò</td>
                    <td>{hienThi(hienThiVaiTro(chiTietThaoTac))}</td>
                  </tr>
                  <tr>
                    <td>Mã đơn</td>
                    <td>{hienThi(chiTietThaoTac.ma_don)}</td>
                  </tr>
                  <tr>
                    <td>Hành động</td>
                    <td>{hienThi(chiTietThaoTac.ten_thao_tac)}</td>
                  </tr>
                  <tr>
                    <td>Số tiền</td>
                    <td>{dinhDangTien(chiTietThaoTac.so_tien)}</td>
                  </tr>
                  <tr>
                    <td>Ghi chú</td>
                    <td>{hienThi(chiTietThaoTac.ghi_chu)}</td>
                  </tr>
                  <tr>
                    <td>Thời gian</td>
                    <td>{dinhDangNgay(chiTietThaoTac.thoi_gian)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="popup-actions">
                <button
                  className="nut-dong-popup"
                  type="button"
                  onClick={() => setChiTietThaoTac(null)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}

export default ReportAuditPage;
