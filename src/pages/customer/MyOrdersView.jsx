import { useEffect, useState } from "react";
import { DUONG_DAN_API } from "../../api/api";

const TRANG_THAI_DA_GIU_CHO = 1102;
const SO_DONG_MOI_TRANG = 10;
const SO_ANH_MOI_DONG = 5;

const MUC_DICH_HOP_DONG_GIAY = 2601;
const MUC_DICH_ANH_BAN_GIAO = 2602;
const MUC_DICH_ANH_KHI_TRA = 2603;

function MyOrders() {
  const [danhSachDon, setDanhSachDon] = useState([]);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [chiTietDon, setChiTietDon] = useState(null);
  const [moPopupChiTiet, setMoPopupChiTiet] = useState(false);
  const [anhDangXem, setAnhDangXem] = useState("");

  const [dangTai, setDangTai] = useState(false);
  const [dangTaiChiTiet, setDangTaiChiTiet] = useState(false);

  const [popupThongBao, setPopupThongBao] = useState("");
  const [hienPopupHuyDon, setHienPopupHuyDon] = useState(false);
  const [donCanHuy, setDonCanHuy] = useState(null);
  const [lyDoHuy, setLyDoHuy] = useState("");

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

    const batDau = new Date(ngayNhan);
    const ketThuc = new Date(ngayTra);

    const mocBatDau = new Date(
      batDau.getFullYear(),
      batDau.getMonth(),
      batDau.getDate()
    );

    const mocKetThuc = new Date(
      ketThuc.getFullYear(),
      ketThuc.getMonth(),
      ketThuc.getDate()
    );

    const soNgay = Math.round((mocKetThuc - mocBatDau) / (24 * 60 * 60 * 1000));

    return soNgay < 1 ? 1 : soNgay;
  }

  function layClassTrangThai(trangThaiId) {
    const id = Number(trangThaiId);

    if (id === 1101) return "trang-thai-badge trang-thai-do";
    if (id === 1102) return "trang-thai-badge trang-thai-vang";
    if (id === 1103) return "trang-thai-badge trang-thai-xanh-duong";
    if (id === 1104) return "trang-thai-badge trang-thai-xanh";
    if (id === 1105) return "trang-thai-badge trang-thai-cam";

    return "trang-thai-badge trang-thai-xam";
  }

  function hienThiTrangThai(trangThaiId, tenTrangThai) {
    return (
      <span className={layClassTrangThai(trangThaiId)}>
        {tenTrangThai || trangThaiId || "-"}
      </span>
    );
  }

  function coTheHuyDon(trangThai) {
    return Number(trangThai) === TRANG_THAI_DA_GIU_CHO;
  }

  function laFileAnh(file) {
    if (!file) return false;
    if (file.loai_file && file.loai_file.startsWith("image/")) return true;

    const url = String(file.file_url || "").toLowerCase();

    return (
      url.endsWith(".jpg") ||
      url.endsWith(".jpeg") ||
      url.endsWith(".png") ||
      url.endsWith(".webp")
    );
  }

  function layAnhTheoMucDich(mucDichId) {
    return (chiTietDon?.tep_don_thue || []).filter((file) => {
      return Number(file.muc_dich_id) === Number(mucDichId) && laFileAnh(file);
    });
  }

  function hienThiNhomAnhDonThue(tieuDe, mucDichId) {
    const danhSachAnh = layAnhTheoMucDich(mucDichId);

    return (
      <div className="khoi-file-theo-muc-dich">
        <h4>{tieuDe}</h4>

        {danhSachAnh.length > 0 ? (
          <div
            className="nhom-anh-popup"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${SO_ANH_MOI_DONG}, minmax(0, 1fr))`,
            }}
          >
            {danhSachAnh.map((file) => (
              <img
                className="anh-tep-popup"
                key={file.id}
                src={file.file_url}
                alt={tieuDe}
                onClick={() => setAnhDangXem(file.file_url)}
              />
            ))}
          </div>
        ) : (
          <p>Chưa có {tieuDe.toLowerCase()}.</p>
        )}
      </div>
    );
  }

  async function layDanhSachDon() {
    try {
      setDangTai(true);

      const token = localStorage.getItem("token");

      if (!token) {
        moPopup("Vui lòng đăng nhập để xem đơn thuê của bạn");
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
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    } finally {
      setDangTai(false);
    }
  }

  async function xemChiTietDon(donThueId) {
    try {
      setMoPopupChiTiet(true);
      setChiTietDon(null);
      setDangTaiChiTiet(true);

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
        setMoPopupChiTiet(false);
        moPopup(duLieu.message);
      }
    } catch {
      setMoPopupChiTiet(false);
      moPopup("Không kết nối được server");
    } finally {
      setDangTaiChiTiet(false);
    }
  }

  function dongPopupChiTiet() {
    setMoPopupChiTiet(false);
    setChiTietDon(null);
  }

  function moPopupNhapLyDoHuy(don) {
    setDonCanHuy(don);
    setLyDoHuy("");
    setHienPopupHuyDon(true);
  }

  function dongPopupHuyDon() {
    setHienPopupHuyDon(false);
    setDonCanHuy(null);
    setLyDoHuy("");
  }

  async function xacNhanHuyDon() {
    try {
      if (!donCanHuy) {
        moPopup("Không tìm thấy đơn cần hủy");
        return;
      }

      if (!lyDoHuy.trim()) {
        moPopup("Vui lòng nhập lý do hủy đơn");
        return;
      }

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/me/orders/${donCanHuy.id}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...taoHeaderCoToken(),
          },
          body: JSON.stringify({
            ly_do_huy: lyDoHuy.trim(),
          }),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        moPopup("Hủy đơn thuê thành công");
        dongPopupHuyDon();
        dongPopupChiTiet();
        layDanhSachDon();
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
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
    <div className="khung-trang trang-don-cua-toi">
      <h2>Đơn thuê của tôi</h2>

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
                    <td className="tien-thue-don">
                      {dinhDangTien(don.tong_tien_thue)}
                    </td>
                    <td className="tien-coc-don">
                      {dinhDangTien(don.tong_tien_coc)}
                    </td>
                    <td>{hienThiTrangThai(don.trang_thai, don.ten_trang_thai)}</td>
                    <td>{dinhDangNgay(don.created_at)}</td>
                    <td>
                      <div className="cot-thao-tac">
                        <button
                          className="nut-xem-chi-tiet"
                          type="button"
                          onClick={() => xemChiTietDon(don.id)}
                        >
                          Xem chi tiết
                        </button>

                        <button
                          className="nut-huy"
                          type="button"
                          disabled={!coTheHuyDon(don.trang_thai)}
                          onClick={() => {
                            if (coTheHuyDon(don.trang_thai)) {
                              moPopupNhapLyDoHuy(don);
                            }
                          }}
                        >
                          Hủy đơn
                        </button>
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
                className="nut-dong-popup"
                type="button"
                disabled={trangHienTai === 1}
                onClick={() => setTrangHienTai(trangHienTai - 1)}
              >
                Trước
              </button>

              <span>
                Trang {trangHienTai} / {tongTrang}
              </span>

              <button
                className="nut-dong-popup"
                type="button"
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

              <button
                className="nut-dong-popup"
                type="button"
                onClick={dongPopupChiTiet}
              >
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
                        <td className="tien-thue-don">
                          {dinhDangTien(chiTietDon.don_thue.tong_tien_thue)}
                        </td>
                      </tr>

                      <tr>
                        <td>Tổng tiền cọc</td>
                        <td className="tien-coc-don">
                          {dinhDangTien(chiTietDon.don_thue.tong_tien_coc)}
                        </td>
                      </tr>

                      <tr>
                        <td>Trạng thái</td>
                        <td>
                          {hienThiTrangThai(
                            chiTietDon.don_thue.trang_thai,
                            chiTietDon.don_thue.ten_trang_thai
                          )}
                        </td>
                      </tr>

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
                        <td>{dinhDangTien(chiTietDon.don_thue.phi_phat_sinh_tien)}</td>
                      </tr>

                      <tr>
                        <td>Lý do hủy</td>
                        <td>{chiTietDon.don_thue.ly_do_huy || "-"}</td>
                      </tr>
                    </tbody>
                  </table>

                  <h3>Thiết bị trong đơn</h3>

                  {chiTietDon.chi_tiet_don && chiTietDon.chi_tiet_don.length > 0 ? (
                    <div className="admin-bang-wrapper">
                      <table className="bang-quan-ly bang-gon">
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
                              <td>{dinhDangTien(item.gia_thue_ngay_snapshot)}</td>
                              <td className="tien-thue-don">
                                {dinhDangTien(item.tien_thue)}
                              </td>
                              <td className="tien-coc-don">
                                {dinhDangTien(item.tien_coc)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>Chưa có thiết bị trong đơn.</p>
                  )}

                  <h3>Thanh toán</h3>

                  {chiTietDon.thanh_toan && chiTietDon.thanh_toan.length > 0 ? (
                    <div className="admin-bang-wrapper">
                      <table className="bang-quan-ly bang-gon">
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

                  <h3>Hình ảnh đơn thuê</h3>

                  {chiTietDon.tep_don_thue && chiTietDon.tep_don_thue.length > 0 ? (
                    <>
                      {hienThiNhomAnhDonThue("Ảnh hợp đồng", MUC_DICH_HOP_DONG_GIAY)}
                      {hienThiNhomAnhDonThue("Ảnh bàn giao", MUC_DICH_ANH_BAN_GIAO)}
                      {hienThiNhomAnhDonThue("Ảnh thanh lý", MUC_DICH_ANH_KHI_TRA)}
                    </>
                  ) : (
                    <p>Chưa có hình ảnh cho đơn này.</p>
                  )}

                </>
              ) : (
                <p className="thong-bao">Không có dữ liệu chi tiết đơn.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {hienPopupHuyDon && donCanHuy && (
        <div className="popup-nen">
          <div className="popup-hop popup-xac-nhan">
            <div className="popup-tieu-de">
              <h3>Xác nhận hủy đơn</h3>
            </div>

            <div className="popup-noi-dung">
              <p>
                Bạn có chắc muốn hủy đơn <b>{donCanHuy.ma_don || "này"}</b>
                không?
              </p>

              <div className="o-form can-trai">
                <label>Lý do hủy</label>
                <textarea
                  value={lyDoHuy}
                  onChange={(e) => setLyDoHuy(e.target.value)}
                  placeholder="Nhập lý do hủy đơn..."
                />
              </div>
            </div>

            <div className="popup-actions">
              <button className="nut-dong-y" type="button" onClick={xacNhanHuyDon}>
                Đồng ý
              </button>

              <button className="nut-huy" type="button" onClick={dongPopupHuyDon}>
                Hủy
              </button>
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