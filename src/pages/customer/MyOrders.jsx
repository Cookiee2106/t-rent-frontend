import { useEffect, useState } from "react";
import { DUONG_DAN_API } from "../../api/api";

const TRANG_THAI_DA_GIU_CHO = 1102;
const SO_DONG_MOI_TRANG = 10;

function MyOrders() {
  const [danhSachDon, setDanhSachDon] = useState([]);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [chiTietDon, setChiTietDon] = useState(null);
  const [moPopupChiTiet, setMoPopupChiTiet] = useState(false);
  const [anhDangXem, setAnhDangXem] = useState("");
  const [dangTai, setDangTai] = useState(false);
  const [dangTaiChiTiet, setDangTaiChiTiet] = useState(false);
  const [thongBao, setThongBao] = useState("");

  function taoHeaderCoToken() {
    const token = localStorage.getItem("token");

    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  function dinhDangTien(giaTri) {
    return Number(giaTri || 0).toLocaleString("vi-VN") + " đ";
  }

  function dinhDangNgay(giaTri) {
    if (!giaTri) {
      return "-";
    }

    return new Date(giaTri).toLocaleDateString("vi-VN");
  }

  function tinhSoNgayThue(ngayNhan, ngayTra) {
    if (!ngayNhan || !ngayTra) {
      return 0;
    }

    const ngayNhanDate = new Date(ngayNhan);
    const ngayTraDate = new Date(ngayTra);

    const mocNgayNhan = new Date(
      ngayNhanDate.getFullYear(),
      ngayNhanDate.getMonth(),
      ngayNhanDate.getDate()
    );

    const mocNgayTra = new Date(
      ngayTraDate.getFullYear(),
      ngayTraDate.getMonth(),
      ngayTraDate.getDate()
    );

    const soMsMotNgay = 24 * 60 * 60 * 1000;

    const soNgay = Math.round((mocNgayTra - mocNgayNhan) / soMsMotNgay);

    return Math.max(1, soNgay);
  }

  function laFileAnh(file) {
    if (!file) {
      return false;
    }

    if (file.loai_file && file.loai_file.startsWith("image/")) {
      return true;
    }

    const url = file.file_url || "";

    return (
      url.endsWith(".jpg") ||
      url.endsWith(".jpeg") ||
      url.endsWith(".png") ||
      url.endsWith(".webp")
    );
  }

  async function layDanhSachDon() {
    try {
      setDangTai(true);
      setThongBao("");

      const token = localStorage.getItem("token");

      if (!token) {
        setThongBao("Vui lòng đăng nhập để xem đơn thuê của bạn");
        setDangTai(false);
        return;
      }

      const phanHoi = await fetch(`${DUONG_DAN_API}/api/me/orders`, {
        headers: {
          ...taoHeaderCoToken(),
        },
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachDon(duLieu.data || []);
        setTrangHienTai(1);
      } else {
        setThongBao(duLieu.message);
      }
    } catch {
      setThongBao("Không kết nối được server");
    } finally {
      setDangTai(false);
    }
  }

  async function xemChiTietDon(donThueId) {
    try {
      setMoPopupChiTiet(true);
      setChiTietDon(null);
      setDangTaiChiTiet(true);
      setThongBao("");

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/me/orders/${donThueId}`,
        {
          headers: {
            ...taoHeaderCoToken(),
          },
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setChiTietDon(duLieu.data);
      } else {
        setThongBao(duLieu.message);
      }
    } catch {
      setThongBao("Không kết nối được server");
    } finally {
      setDangTaiChiTiet(false);
    }
  }

  function dongPopupChiTiet() {
    setMoPopupChiTiet(false);
    setChiTietDon(null);
  }

  async function huyDon(donThueId) {
    try {
      const lyDoHuy = window.prompt("Nhập lý do hủy đơn:");

      if (!lyDoHuy || lyDoHuy.trim() === "") {
        return;
      }

      const xacNhan = window.confirm("Bạn có chắc muốn hủy đơn thuê này không?");

      if (!xacNhan) {
        return;
      }

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/me/orders/${donThueId}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...taoHeaderCoToken(),
          },
          body: JSON.stringify({
            ly_do_huy: lyDoHuy,
          }),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setThongBao("Hủy đơn thuê thành công");
        dongPopupChiTiet();
        layDanhSachDon();
      } else {
        setThongBao(duLieu.message);
      }
    } catch {
      setThongBao("Không kết nối được server");
    }
  }

  useEffect(() => {
    layDanhSachDon();
  }, []);

  const tongTrang = Math.ceil(danhSachDon.length / SO_DONG_MOI_TRANG);
  const viTriBatDau = (trangHienTai - 1) * SO_DONG_MOI_TRANG;
  const danhSachDonHienThi = danhSachDon.slice(
    viTriBatDau,
    viTriBatDau + SO_DONG_MOI_TRANG
  );

  return (
    <div className="trang-don-cua-toi">
      <h2>Đơn thuê của tôi</h2>

      {thongBao && <p className="thong-bao">{thongBao}</p>}

      {dangTai ? (
        <p className="thong-bao">Đang tải danh sách đơn thuê...</p>
      ) : danhSachDon.length === 0 ? (
        <p className="thong-bao">Bạn chưa có đơn thuê nào.</p>
      ) : (
        <>
          <div className="admin-bang-wrapper">
            <table className="bang-quan-ly">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày nhận</th>
                  <th>Ngày trả</th>
                  <th>Tổng tiền thuê</th>
                  <th>Tổng tiền cọc</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {danhSachDonHienThi.map((don) => (
                  <tr key={don.id}>
                    <td>{don.ma_don}</td>
                    <td>{dinhDangNgay(don.ngay_nhan)}</td>
                    <td>{dinhDangNgay(don.ngay_tra)}</td>
                    <td>{dinhDangTien(don.tong_tien_thue)}</td>
                    <td>{dinhDangTien(don.tong_tien_coc)}</td>
                    <td>
                      <b>{don.ten_trang_thai || don.trang_thai}</b>
                    </td>
                    <td>{dinhDangNgay(don.created_at)}</td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <button onClick={() => xemChiTietDon(don.id)}>
                          Xem chi tiết
                        </button>

                        {Number(don.trang_thai) ===
                          TRANG_THAI_DA_GIU_CHO && (
                          <button
                            className="nut-do"
                            onClick={() => huyDon(don.id)}
                          >
                            Hủy đơn
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {tongTrang > 1 && (
            <div className="phan-trang">
              <button
                disabled={trangHienTai === 1}
                onClick={() => setTrangHienTai(trangHienTai - 1)}
              >
                Trước
              </button>

              <span>
                Trang {trangHienTai} / {tongTrang}
              </span>

              <button
                disabled={trangHienTai === tongTrang}
                onClick={() => setTrangHienTai(trangHienTai + 1)}
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}

      {moPopupChiTiet && (
        <div className="popup-nen">
          <div className="popup-hop popup-lon">
            <div className="popup-tieu-de">
              <h3>Chi tiết đơn thuê</h3>

              <button className="nut-do" onClick={dongPopupChiTiet}>
                Đóng
              </button>
            </div>

            <div className="popup-noi-dung">
              {dangTaiChiTiet ? (
                <p className="thong-bao">Đang tải chi tiết đơn thuê...</p>
              ) : chiTietDon ? (
                <>
                  <h3>Thông tin đơn thuê</h3>

                  <table className="bang-popup">
                    <tbody>
                      <tr>
                        <td>Mã đơn</td>
                        <td>{chiTietDon.don_thue.ma_don}</td>
                      </tr>

                      <tr>
                        <td>Ngày nhận</td>
                        <td>{dinhDangNgay(chiTietDon.don_thue.ngay_nhan)}</td>
                      </tr>

                      <tr>
                        <td>Ngày trả</td>
                        <td>{dinhDangNgay(chiTietDon.don_thue.ngay_tra)}</td>
                      </tr>

                      <tr>
                        <td>Số ngày thuê</td>
                        <td>
                          {tinhSoNgayThue(
                            chiTietDon.don_thue.ngay_nhan,
                            chiTietDon.don_thue.ngay_tra
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td>Tổng tiền thuê</td>
                        <td>
                          {dinhDangTien(chiTietDon.don_thue.tong_tien_thue)}
                        </td>
                      </tr>

                      <tr>
                        <td>Tổng tiền cọc</td>
                        <td>
                          {dinhDangTien(chiTietDon.don_thue.tong_tien_coc)}
                        </td>
                      </tr>

                      <tr>
                        <td>Trạng thái</td>
                        <td>
                          <b>
                            {chiTietDon.don_thue.ten_trang_thai ||
                              chiTietDon.don_thue.trang_thai}
                          </b>
                        </td>
                      </tr>

                      {/*
                        ================= CODE ĐIỀU KIỆN BÀN GIAO =================

                        HIỆN TẠI:
                        - Phần bàn giao bên dưới đang luôn hiển thị.
                        - Nếu chưa bàn giao thì dữ liệu hiện "-".

                        YÊU CẦU:
                        - Chỉ khi đã bàn giao mới hiện phần bàn giao.
                        - Khi đó bạn làm như sau:
                          1. Bỏ comment block code dưới đây.
                          2. Comment hoặc xóa 3 dòng bàn giao đang dùng ngay bên dưới
                             để tránh bị hiện trùng.

                        {chiTietDon.don_thue.ban_giao_luc && (
                          <>
                            <tr>
                              <td>Thời điểm bàn giao</td>
                              <td>{dinhDangNgay(chiTietDon.don_thue.ban_giao_luc)}</td>
                            </tr>

                            <tr>
                              <td>Nhân viên bàn giao</td>
                              <td>{chiTietDon.don_thue.ten_nguoi_ban_giao || "-"}</td>
                            </tr>

                            <tr>
                              <td>Ghi chú bàn giao</td>
                              <td>{chiTietDon.don_thue.ghi_chu_ban_giao || "-"}</td>
                            </tr>
                          </>
                        )}
                      */}

                      <tr>
                        <td>Thời điểm bàn giao</td>
                        <td>{dinhDangNgay(chiTietDon.don_thue.ban_giao_luc)}</td>
                      </tr>

                      <tr>
                        <td>Nhân viên bàn giao</td>
                        <td>
                          {chiTietDon.don_thue.ten_nguoi_ban_giao || "-"}
                        </td>
                      </tr>

                      <tr>
                        <td>Ghi chú bàn giao</td>
                        <td>{chiTietDon.don_thue.ghi_chu_ban_giao || "-"}</td>
                      </tr>

                      {/*
                        ================= CODE ĐIỀU KIỆN THANH LÝ =================

                        HIỆN TẠI:
                        - Phần thanh lý bên dưới đang luôn hiển thị.
                        - Nếu chưa thanh lý thì dữ liệu hiện "-".

                        NẾU THẦY YÊU CẦU:
                        - Chỉ khi đã thanh lý xong mới hiện phần thanh lý.
                        - Khi đó bạn làm như sau:
                          1. Bỏ comment block code dưới đây.
                          2. Comment hoặc xóa 5 dòng thanh lý đang dùng ngay bên dưới
                             để tránh bị hiện trùng.

                        {chiTietDon.don_thue.tra_luc && (
                          <>
                            <tr>
                              <td>Thời điểm trả</td>
                              <td>{dinhDangNgay(chiTietDon.don_thue.tra_luc)}</td>
                            </tr>

                            <tr>
                              <td>Nhân viên nhận trả</td>
                              <td>{chiTietDon.don_thue.ten_nguoi_nhan_tra || "-"}</td>
                            </tr>

                            <tr>
                              <td>Ghi chú thanh lý</td>
                              <td>{chiTietDon.don_thue.ghi_chu_thanh_ly || "-"}</td>
                            </tr>

                            <tr>
                              <td>Phí phát sinh</td>
                              <td>
                                {dinhDangTien(chiTietDon.don_thue.phi_phat_sinh_tien)}
                              </td>
                            </tr>

                            <tr>
                              <td>Lý do phát sinh</td>
                              <td>{chiTietDon.don_thue.phi_phat_sinh_ly_do || "-"}</td>
                            </tr>
                          </>
                        )}
                      */}

                      <tr>
                        <td>Thời điểm trả</td>
                        <td>{dinhDangNgay(chiTietDon.don_thue.tra_luc)}</td>
                      </tr>

                      <tr>
                        <td>Nhân viên nhận trả</td>
                        <td>
                          {chiTietDon.don_thue.ten_nguoi_nhan_tra || "-"}
                        </td>
                      </tr>

                      <tr>
                        <td>Ghi chú thanh lý</td>
                        <td>{chiTietDon.don_thue.ghi_chu_thanh_ly || "-"}</td>
                      </tr>

                      <tr>
                        <td>Phí phát sinh</td>
                        <td>
                          {dinhDangTien(
                            chiTietDon.don_thue.phi_phat_sinh_tien
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td>Lý do phát sinh</td>
                        <td>
                          {chiTietDon.don_thue.phi_phat_sinh_ly_do || "-"}
                        </td>
                      </tr>

                      <tr>
                        <td>Lý do hủy</td>
                        <td>{chiTietDon.don_thue.ly_do_huy || "-"}</td>
                      </tr>
                    </tbody>
                  </table>

                  <h3>Thiết bị trong đơn</h3>

                  {chiTietDon.chi_tiet_don &&
                  chiTietDon.chi_tiet_don.length > 0 ? (
                    <div className="admin-bang-wrapper">
                      <table className="bang-quan-ly">
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Hãng</th>
                            <th>Tên mẫu</th>
                            <th>Danh mục</th>
                            <th>Số lượng</th>
                            <th>Giá thuê/ngày</th>
                            <th>Tiền thuê</th>
                            <th>Tiền cọc</th>
                          </tr>
                        </thead>

                        <tbody>
                          {chiTietDon.chi_tiet_don.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>{item.ten_hang || "-"}</td>
                              <td>{item.ten_mau}</td>
                              <td>{item.ten_danh_muc || "-"}</td>
                              <td>{item.so_luong}</td>
                              <td>
                                {dinhDangTien(item.gia_thue_ngay_snapshot)}
                              </td>
                              <td>{dinhDangTien(item.tien_thue)}</td>
                              <td>{dinhDangTien(item.tien_coc)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>Chưa có thiết bị trong đơn.</p>
                  )}

                  <h3>Thanh toán</h3>

                  {chiTietDon.thanh_toan &&
                  chiTietDon.thanh_toan.length > 0 ? (
                    <div className="admin-bang-wrapper">
                      <table className="bang-quan-ly">
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Loại dòng tiền</th>
                            <th>Số tiền</th>
                            <th>Mã giao dịch</th>
                            <th>Ghi chú</th>
                            <th>Ngày tạo</th>
                          </tr>
                        </thead>

                        <tbody>
                          {chiTietDon.thanh_toan.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>{item.ten_loai_dong_tien || "-"}</td>
                              <td>{dinhDangTien(item.so_tien)}</td>
                              <td>{item.ma_giao_dich || "-"}</td>
                              <td>{item.ghi_chu || "-"}</td>
                              <td>{dinhDangNgay(item.created_at)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>Chưa có thông tin thanh toán.</p>
                  )}

                  <h3>Hình ảnh / file đơn thuê</h3>

                  {chiTietDon.tep_don_thue &&
                  chiTietDon.tep_don_thue.length > 0 ? (
                    <div className="nhom-anh-popup">
                      {chiTietDon.tep_don_thue.map((file) => (
                        <div className="the-tep-popup" key={file.id}>
                          <p>
                            <b>{file.ten_muc_dich}</b>
                          </p>

                          <p>{file.ten_file_goc}</p>

                          {laFileAnh(file) ? (
                            <img
                              className="anh-tep-popup"
                              src={file.file_url}
                              alt={file.ten_file_goc}
                              onClick={() => setAnhDangXem(file.file_url)}
                            />
                          ) : (
                            <p>File không phải hình ảnh</p>
                          )}

                          <button
                            onClick={() => window.open(file.file_url, "_blank")}
                          >
                            Mở file
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Chưa có hình ảnh/file cho đơn này.</p>
                  )}

                  {/*
                    ================= VẬT PHẨM BÀN GIAO =================

                    Phần này đã làm sẵn nhưng comment lại vì khách hàng
                    không cần xem quá chi tiết mã tài sản/serial/phụ kiện.

                    Yêu cầu hiển thị vật phẩm bàn giao:
                    1. Bỏ comment query vatPhamBanGiao ở Backend.
                    2. Bỏ comment phần JSX này.
                    3. Đảm bảo API trả vat_pham_ban_giao.
                  */}

                  {/*
                  <h3>Vật phẩm bàn giao</h3>

                  {chiTietDon.vat_pham_ban_giao &&
                  chiTietDon.vat_pham_ban_giao.length > 0 ? (
                    <div className="admin-bang-wrapper">
                      <table className="bang-quan-ly">
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Tên vật phẩm</th>
                            <th>Mã tài sản</th>
                            <th>Serial</th>
                            <th>Số lượng</th>
                            <th>Tình trạng trước</th>
                            <th>Ghi chú</th>
                          </tr>
                        </thead>

                        <tbody>
                          {chiTietDon.vat_pham_ban_giao.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>{item.ten_vat_pham_snapshot}</td>
                              <td>{item.ma_tai_san_snapshot || "-"}</td>
                              <td>{item.so_serial_snapshot || "-"}</td>
                              <td>{item.so_luong_giao}</td>
                              <td>{item.tinh_trang_truoc || "-"}</td>
                              <td>{item.ghi_chu_ban_giao || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>Chưa có vật phẩm bàn giao.</p>
                  )}
                  */}

                  <div className="popup-actions">
                    {Number(chiTietDon.don_thue.trang_thai) ===
                      TRANG_THAI_DA_GIU_CHO && (
                      <button
                        className="nut-do"
                        onClick={() => huyDon(chiTietDon.don_thue.id)}
                      >
                        Hủy đơn
                      </button>
                    )}

                    <button onClick={dongPopupChiTiet}>Đóng</button>
                  </div>
                </>
              ) : (
                <p className="thong-bao">Không có dữ liệu chi tiết đơn.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {anhDangXem && (
        <div className="popup-nen" onClick={() => setAnhDangXem("")}>
          <div className="popup-anh">
            <img src={anhDangXem} alt="Ảnh đơn thuê" />
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrders;