import { useEffect, useState } from "react";
import { DUONG_DAN_API } from "../../api/api";

const TRANG_THAI_DA_HUY = 1101;
const TRANG_THAI_DA_GIU_CHO = 1102;
const TRANG_THAI_HOAN_THANH = 1104;

const TRANG_THAI_YEU_CAU_HUY_CHO_XU_LY = 1701;
const TRANG_THAI_YEU_CAU_HUY_TU_CHOI = 1703;

const LOAI_HOAN_COC = 2303;
const LOAI_KHAU_TRU_COC = 2304;
const LOAI_PHU_THU = 2305;

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
  const [dangGuiYeuCauHuy, setDangGuiYeuCauHuy] = useState(false);

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

  function hienThiTrangThaiDon(don) {
    if (
      Number(don?.yeu_cau_huy?.trang_thai_id) ===
      TRANG_THAI_YEU_CAU_HUY_CHO_XU_LY
    ) {
      return (
        <span className="trang-thai-badge trang-thai-cam">
          {don.yeu_cau_huy.ten_trang_thai || "-"}
        </span>
      );
    }

    return hienThiTrangThai(don?.trang_thai, don?.ten_trang_thai);
  }

  function coTheGuiYeuCauHuy(don) {
    if (Number(don?.trang_thai) !== TRANG_THAI_DA_GIU_CHO) {
      return false;
    }

    if (!don?.yeu_cau_huy) {
      return true;
    }

    return (
      Number(don.yeu_cau_huy.trang_thai_id) ===
      TRANG_THAI_YEU_CAU_HUY_TU_CHOI
    );
  }

  function dangChoXacNhanHuy(don) {
    return (
      Number(don?.yeu_cau_huy?.trang_thai_id) ===
      TRANG_THAI_YEU_CAU_HUY_CHO_XU_LY
    );
  }

  function tinhPhiHuy(don) {
    const tongTienCoc = Number(don?.tong_tien_coc || 0);
    const tyLePhiHuy = Number(don?.ty_le_phi_huy_snapshot || 0);

    return Math.round((tongTienCoc * tyLePhiHuy) / 100);
  }

  function tinhTienCocHoanLai(don) {
    return Math.max(
      0,
      Number(don?.tong_tien_coc || 0) - tinhPhiHuy(don)
    );
  }

  // Chỉ hiển thị đúng một kết quả thanh lý: Hoàn cọc, Khấu trừ cọc hoặc Phụ thu.
  function layKetQuaThanhLyDaChon(chiTiet) {
    const don = chiTiet?.don_thue;

    if (
      !don ||
      (Number(don.trang_thai) !== TRANG_THAI_HOAN_THANH && !don.tra_luc)
    ) {
      return null;
    }

    const danhSachThanhToan = chiTiet?.thanh_toan || [];

    const tinhTongTheoLoai = (loaiDongTienId) =>
      danhSachThanhToan
        .filter(
          (item) =>
            Number(item.loai_dong_tien_id) === Number(loaiDongTienId)
        )
        .reduce((tong, item) => tong + Number(item.so_tien || 0), 0);

    const tienPhuThu = tinhTongTheoLoai(LOAI_PHU_THU);
    const tienKhauTru = tinhTongTheoLoai(LOAI_KHAU_TRU_COC);
    const tienHoanCoc = tinhTongTheoLoai(LOAI_HOAN_COC);

    if (tienPhuThu > 0) {
      return { ten: "Phụ thu", so_tien: tienPhuThu };
    }

    if (tienKhauTru > 0) {
      return { ten: "Khấu trừ cọc", so_tien: tienKhauTru };
    }

    if (tienHoanCoc > 0) {
      return { ten: "Hoàn cọc", so_tien: tienHoanCoc };
    }

    return null;
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

  async function guiYeuCauHuyDon() {
    try {
      if (!donCanHuy) {
        moPopup("Không tìm thấy đơn cần hủy");
        return;
      }

      if (!lyDoHuy.trim()) {
        moPopup("Vui lòng nhập lý do hủy đơn");
        return;
      }

      setDangGuiYeuCauHuy(true);

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/me/orders/${donCanHuy.id}/cancel-request`,
        {
          method: "POST",
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
        moPopup("Gửi yêu cầu hủy đơn thành công");
        dongPopupHuyDon();
        await layDanhSachDon();
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    } finally {
      setDangGuiYeuCauHuy(false);
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
                    <td>{hienThiTrangThaiDon(don)}</td>
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
                          disabled={!coTheGuiYeuCauHuy(don)}
                          onClick={() => {
                            if (coTheGuiYeuCauHuy(don)) {
                              moPopupNhapLyDoHuy(don);
                            }
                          }}
                        >
                          Hủy
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
                  <h3>Thông tin thuê</h3>

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
                        <td>{hienThiTrangThaiDon(chiTietDon.don_thue)}</td>
                      </tr>

                      {Number(chiTietDon.don_thue.trang_thai) ===
                        TRANG_THAI_DA_HUY && (
                        <>
                          <tr>
                            <td>Phí hủy đơn (%)</td>
                            <td>
                              {Number(
                                chiTietDon.don_thue.yeu_cau_huy
                                  ?.ty_le_phi_huy_snapshot ??
                                  chiTietDon.don_thue.ty_le_phi_huy_snapshot ??
                                  0
                              )}
                              %
                            </td>
                          </tr>

                          <tr>
                            <td>Phí hủy</td>
                            <td>
                              {dinhDangTien(
                                chiTietDon.don_thue.yeu_cau_huy?.phi_huy
                              )}
                            </td>
                          </tr>

                          <tr>
                            <td>Tiền cọc đã hoàn lại</td>
                            <td>
                              {dinhDangTien(
                                chiTietDon.don_thue.yeu_cau_huy
                                  ?.tien_coc_hoan_lai
                              )}
                            </td>
                          </tr>

                          <tr>
                            <td>Lý do hủy</td>
                            <td>
                              {chiTietDon.don_thue.ly_do_huy ||
                                chiTietDon.don_thue.yeu_cau_huy?.ly_do_huy ||
                                "-"}
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>

                  <h3>Thông tin bàn giao/thanh lý</h3>

                  <table className="bang-popup">
                    <tbody>
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

                      {(() => {
                        const ketQuaThanhLy =
                          layKetQuaThanhLyDaChon(chiTietDon);

                        if (!ketQuaThanhLy) return null;

                        return (
                          <tr>
                            <td>{ketQuaThanhLy.ten}</td>
                            <td>{dinhDangTien(ketQuaThanhLy.so_tien)}</td>
                          </tr>
                        );
                      })()}
                    </tbody>
                  </table>

                  <h3>Thiết bị trong đơn</h3>

                  {chiTietDon.chi_tiet_don && chiTietDon.chi_tiet_don.length > 0 ? (
                    <div className="admin-bang-wrapper">
                      <table className="bang-quan-ly bang-gon">
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Tên mẫu</th>
                            <th>Giá trị thiết bị</th>
                          </tr>
                        </thead>

                        <tbody>
                          {chiTietDon.chi_tiet_don.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>{item.ten_mau || "-"}</td>
                              <td>
                                {dinhDangTien(item.gia_tri_thiet_bi_snapshot)}
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
              <h3>Hủy đơn</h3>
            </div>

            <div className="popup-noi-dung">
              <p>
                Mã đơn: <b>{donCanHuy.ma_don || "-"}</b>
              </p>

              <p>
                Tiền cọc đã thanh toán:{" "}
                <b>{dinhDangTien(donCanHuy.tong_tien_coc)}</b>
              </p>

              <p>
                Tỷ lệ phí hủy:{" "}
                <b>{Number(donCanHuy.ty_le_phi_huy_snapshot || 0)}%</b>
              </p>

              <p>
                Phí hủy:{" "}
                <b>{dinhDangTien(tinhPhiHuy(donCanHuy))}</b>
              </p>

              <p>
                Tiền cọc hoàn lại:{" "}
                <b>{dinhDangTien(tinhTienCocHoanLai(donCanHuy))}</b>
              </p>

              <div className="o-form can-trai">
                <label>Lý do hủy</label>
                <textarea
                  value={lyDoHuy}
                  onChange={(e) => setLyDoHuy(e.target.value)}
                  placeholder="Nhập lý do hủy đơn..."
                />
              </div>

              <p
                style={{
                  color: "#dc2626",
                  fontSize: "13px",
                  fontStyle: "normal",
                }}
              >
                Sau khi gửi yêu cầu, vui lòng liên hệ cửa hàng để được xác nhận
                hủy và hoàn lại tiền cọc.
              </p>
            </div>

            <div className="popup-actions">
              <button
                className="nut-huy"
                type="button"
                onClick={dongPopupHuyDon}
                disabled={dangGuiYeuCauHuy}
              >
                Đóng
              </button>

              <button
                className="nut-dong-y"
                type="button"
                onClick={guiYeuCauHuyDon}
                disabled={dangGuiYeuCauHuy}
              >
                {dangGuiYeuCauHuy ? "Đang gửi..." : "Đồng ý"}
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