import { useEffect, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

const SO_DONG_MOI_TRANG = 10;

const TRANG_THAI_TAI_KHOAN_HOAT_DONG = 101;
const TRANG_THAI_TAI_KHOAN_BI_KHOA = 102;

function CustomerAccountList() {
  const [danhSachTaiKhoan, setDanhSachTaiKhoan] = useState([]);
  const [tuKhoa, setTuKhoa] = useState("");
  const [trangThai, setTrangThai] = useState("0");
  const [popupThongBao, setPopupThongBao] = useState("");

  const [trangHienTai, setTrangHienTai] = useState(1);
  const [chiTiet, setChiTiet] = useState(null);
  const [anhDangXem, setAnhDangXem] = useState("");

  const [hienXacNhanDuyet, setHienXacNhanDuyet] = useState(false);
  const [hienTuChoi, setHienTuChoi] = useState(false);
  const [lyDoTuChoi, setLyDoTuChoi] = useState("");

  const [hienXacNhanTrangThai, setHienXacNhanTrangThai] = useState(false);
  const [taiKhoanCanDoiTrangThai, setTaiKhoanCanDoiTrangThai] = useState(null);

  function moPopupThongBao(noiDung) {
    setPopupThongBao(noiDung);
  }

  function dinhDangNgay(ngay) {
    if (!ngay) return "Chưa có";
    return new Date(ngay).toLocaleDateString("vi-VN");
  }

  function layClassTrangThaiTaiKhoan(trangThaiId) {
    const id = Number(trangThaiId);

    if (id === TRANG_THAI_TAI_KHOAN_HOAT_DONG) {
      return "trang-thai-badge trang-thai-xanh";
    }

    if (id === TRANG_THAI_TAI_KHOAN_BI_KHOA) {
      return "trang-thai-badge trang-thai-do";
    }

    return "trang-thai-badge trang-thai-xam";
  }

  function layClassTrangThaiXacMinh(trangThaiId) {
    const id = Number(trangThaiId);

    if (id === 201) {
      return "trang-thai-badge trang-thai-xam";
    }

    if (id === 202) {
      return "trang-thai-badge trang-thai-vang";
    }

    if (id === 203) {
      return "trang-thai-badge trang-thai-xanh";
    }

    if (id === 204) {
      return "trang-thai-badge trang-thai-do";
    }

    return "trang-thai-badge trang-thai-xam";
  }

  function hienThiTrangThaiTaiKhoan(taiKhoan) {
    return (
      <span className={layClassTrangThaiTaiKhoan(taiKhoan.trang_thai)}>
        {taiKhoan.ten_trang_thai_tai_khoan || "Hoạt động"}
      </span>
    );
  }

  function hienThiTrangThaiXacMinh(taiKhoan) {
    return (
      <span
        className={layClassTrangThaiXacMinh(
          taiKhoan.trang_thai_xac_minh || taiKhoan.trang_thai_ho_so
        )}
      >
        {taiKhoan.ten_trang_thai_xac_minh ||
          taiKhoan.ten_trang_thai_ho_so ||
          "Chưa xác minh"}
      </span>
    );
  }

  async function layDanhSachTaiKhoan() {
    try {
      const url = `${DUONG_DAN_API}/api/admin/customers?tu_khoa=${encodeURIComponent(
        tuKhoa
      )}&trang_thai=${trangThai}`;

      const phanHoi = await fetch(url, {
        headers: taoHeaderCoToken(),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachTaiKhoan(duLieu.data || []);
        setTrangHienTai(1);
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    }
  }

  async function xemChiTiet(id) {
    try {
      const phanHoi = await fetch(`${DUONG_DAN_API}/api/admin/customers/${id}`, {
        headers: taoHeaderCoToken(),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setChiTiet(duLieu.data);
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    }
  }

  async function xacNhanDuyet() {
    try {
      if (!chiTiet.ho_so_xac_minh_id) {
        moPopupThongBao("Khách hàng chưa có hồ sơ xác minh");
        return;
      }

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/verifications/${chiTiet.ho_so_xac_minh_id}/approve`,
        {
          method: "PUT",
          headers: taoHeaderCoToken(),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setHienXacNhanDuyet(false);
        xemChiTiet(chiTiet.id);
        layDanhSachTaiKhoan();
        moPopupThongBao(duLieu.message);
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    }
  }

  async function xacNhanTuChoi() {
    try {
      if (!lyDoTuChoi.trim()) {
        moPopupThongBao("Vui lòng nhập lý do từ chối");
        return;
      }

      if (!chiTiet.ho_so_xac_minh_id) {
        moPopupThongBao("Khách hàng chưa có hồ sơ xác minh");
        return;
      }

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/verifications/${chiTiet.ho_so_xac_minh_id}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...taoHeaderCoToken(),
          },
          body: JSON.stringify({
            ly_do_tu_choi: lyDoTuChoi,
          }),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setHienTuChoi(false);
        setLyDoTuChoi("");
        xemChiTiet(chiTiet.id);
        layDanhSachTaiKhoan();
        moPopupThongBao(duLieu.message);
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    }
  }

  function doiTrangThaiTaiKhoan(taiKhoan) {
    setTaiKhoanCanDoiTrangThai(taiKhoan);
    setHienXacNhanTrangThai(true);
  }

  async function xacNhanDoiTrangThaiTaiKhoan() {
    try {
      if (!taiKhoanCanDoiTrangThai) {
        moPopupThongBao("Không tìm thấy tài khoản cần cập nhật");
        return;
      }

      const trangThaiHienTai = Number(taiKhoanCanDoiTrangThai.trang_thai);

      const trangThaiMoi =
        trangThaiHienTai === TRANG_THAI_TAI_KHOAN_HOAT_DONG
          ? TRANG_THAI_TAI_KHOAN_BI_KHOA
          : TRANG_THAI_TAI_KHOAN_HOAT_DONG;

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/admin/customers/${taiKhoanCanDoiTrangThai.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...taoHeaderCoToken(),
          },
          body: JSON.stringify({
            trang_thai: trangThaiMoi,
          }),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        const idCanTaiLai = taiKhoanCanDoiTrangThai.id;

        setHienXacNhanTrangThai(false);
        setTaiKhoanCanDoiTrangThai(null);

        layDanhSachTaiKhoan();

        if (chiTiet && chiTiet.id === idCanTaiLai) {
          xemChiTiet(idCanTaiLai);
        }

        moPopupThongBao(duLieu.message);
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    }
  }

  useEffect(() => {
    layDanhSachTaiKhoan();
  }, [tuKhoa, trangThai]);

  const tongTrang = Math.ceil(danhSachTaiKhoan.length / SO_DONG_MOI_TRANG);
  const viTriBatDau = (trangHienTai - 1) * SO_DONG_MOI_TRANG;

  const danhSachHienThi = danhSachTaiKhoan.slice(
    viTriBatDau,
    viTriBatDau + SO_DONG_MOI_TRANG
  );

  return (
    <div className="trang-admin-crud">
      <h2>Quản lý tài khoản khách hàng</h2>

      <div className="khung-loc-admin">
        <input
          placeholder="Tìm tên, email, số điện thoại, CCCD"
          value={tuKhoa}
          onChange={(e) => {
            setTuKhoa(e.target.value);
            setTrangHienTai(1);
          }}
        />

        <select
          value={trangThai}
          onChange={(e) => {
            setTrangThai(e.target.value);
            setTrangHienTai(1);
          }}
        >
          <option value="0">Tất cả trạng thái xác minh</option>
          <option value="201">Chưa xác minh</option>
          <option value="202">Chờ duyệt</option>
          <option value="203">Đã duyệt</option>
          <option value="204">Từ chối</option>
        </select>
      </div>

      <div className="admin-bang-wrapper">
        <table className="bang-quan-ly">
          <thead>
            <tr>
              <th>STT</th>
              <th>Khách hàng</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Số CCCD</th>
              <th>Trạng thái tài khoản</th>
              <th>Trạng thái xác minh</th>
              <th>Ngày gửi</th>
              <th>Ngày duyệt</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {danhSachHienThi.map((taiKhoan, index) => (
              <tr key={taiKhoan.id}>
                <td>{viTriBatDau + index + 1}</td>
                <td>{taiKhoan.ho_ten}</td>
                <td>{taiKhoan.email}</td>
                <td>{taiKhoan.so_dien_thoai}</td>
                <td>{taiKhoan.so_cccd || "Chưa có"}</td>
                <td>{hienThiTrangThaiTaiKhoan(taiKhoan)}</td>
                <td>{hienThiTrangThaiXacMinh(taiKhoan)}</td>
                <td>{dinhDangNgay(taiKhoan.ngay_gui)}</td>
                <td>{dinhDangNgay(taiKhoan.duyet_luc)}</td>

                <td>
                  <div className="cot-thao-tac">
                    <button
                      className="nut-xem-chi-tiet"
                      onClick={() => xemChiTiet(taiKhoan.id)}
                    >
                      Xem chi tiết
                    </button>

                    <button
                      className={
                        Number(taiKhoan.trang_thai) ===
                        TRANG_THAI_TAI_KHOAN_HOAT_DONG
                          ? "nut-an"
                          : "nut-hien"
                      }
                      onClick={() => doiTrangThaiTaiKhoan(taiKhoan)}
                    >
                      {Number(taiKhoan.trang_thai) ===
                      TRANG_THAI_TAI_KHOAN_HOAT_DONG
                        ? "Khóa"
                        : "Mở khóa"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {danhSachHienThi.length === 0 && (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
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
          disabled={trangHienTai === 1}
          onClick={() => setTrangHienTai(trangHienTai - 1)}
        >
          Trước
        </button>

        <span>
          Trang {trangHienTai} / {tongTrang || 1}
        </span>

        <button
          className="nut-dong-popup"
          disabled={trangHienTai === tongTrang || tongTrang === 0}
          onClick={() => setTrangHienTai(trangHienTai + 1)}
        >
          Sau
        </button>
      </div>

      {chiTiet && (
        <div className="popup-nen">
          <div className="popup-hop popup-lon">
            <div className="popup-tieu-de">
              <h3>Chi tiết tài khoản khách hàng</h3>

              <button
                className="nut-dong-popup"
                onClick={() => setChiTiet(null)}
              >
                Đóng
              </button>
            </div>

            <div className="popup-noi-dung">
              <table className="bang-popup">
                <tbody>
                  <tr>
                    <td>Họ tên</td>
                    <td>{chiTiet.ho_ten}</td>
                  </tr>

                  <tr>
                    <td>Email</td>
                    <td>{chiTiet.email}</td>
                  </tr>

                  <tr>
                    <td>Trạng thái tài khoản</td>
                    <td>{hienThiTrangThaiTaiKhoan(chiTiet)}</td>
                  </tr>

                  <tr>
                    <td>Số điện thoại</td>
                    <td>{chiTiet.so_dien_thoai}</td>
                  </tr>

                  <tr>
                    <td>Địa chỉ</td>
                    <td>{chiTiet.dia_chi || "Chưa cập nhật"}</td>
                  </tr>

                  <tr>
                    <td>Số CCCD</td>
                    <td>{chiTiet.so_cccd || "Chưa có"}</td>
                  </tr>

                  <tr>
                    <td>Trạng thái xác minh</td>
                    <td>{hienThiTrangThaiXacMinh(chiTiet)}</td>
                  </tr>

                  <tr>
                    <td>Lý do từ chối</td>
                    <td>{chiTiet.ly_do_tu_choi || "Không có"}</td>
                  </tr>

                  <tr>
                    <td>Ngày gửi</td>
                    <td>{dinhDangNgay(chiTiet.ngay_gui)}</td>
                  </tr>

                  <tr>
                    <td>Ngày duyệt</td>
                    <td>{dinhDangNgay(chiTiet.duyet_luc)}</td>
                  </tr>

                  {chiTiet.ho_so_xac_minh_id && (
                    <tr>
                      <td>Ảnh xác minh</td>
                      <td>
                        <div className="nhom-anh-popup">
                          <img
                            src={chiTiet.anh_mat_truoc_url}
                            alt="CCCD mặt trước"
                            onClick={() =>
                              setAnhDangXem(chiTiet.anh_mat_truoc_url)
                            }
                          />

                          <img
                            src={chiTiet.anh_mat_sau_url}
                            alt="CCCD mặt sau"
                            onClick={() =>
                              setAnhDangXem(chiTiet.anh_mat_sau_url)
                            }
                          />

                          <img
                            src={chiTiet.anh_cam_cccd_url}
                            alt="Ảnh cầm CCCD"
                            onClick={() =>
                              setAnhDangXem(chiTiet.anh_cam_cccd_url)
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="popup-actions">
                {Number(chiTiet.trang_thai_xac_minh) === 202 &&
                  chiTiet.ho_so_xac_minh_id && (
                    <>
                      <button
                        className="nut-dong-y"
                        onClick={() => setHienXacNhanDuyet(true)}
                      >
                        Duyệt hồ sơ xác minh
                      </button>

                      <button
                        className="nut-huy"
                        onClick={() => setHienTuChoi(true)}
                      >
                        Từ chối hồ sơ xác minh
                      </button>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      {hienXacNhanDuyet && (
        <div className="popup-nen">
          <div className="popup-hop popup-xac-nhan">
            <div className="popup-tieu-de">
              <h3>Xác nhận duyệt hồ sơ</h3>
            </div>

            <div className="popup-noi-dung">
              <p>Bạn có chắc muốn duyệt hồ sơ xác minh này không?</p>

              <div className="popup-actions">
                <button className="nut-dong-y" onClick={xacNhanDuyet}>
                  Đồng ý
                </button>

                <button
                  className="nut-huy"
                  onClick={() => setHienXacNhanDuyet(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {hienTuChoi && (
        <div className="popup-nen">
          <div className="popup-hop">
            <div className="popup-tieu-de">
              <h3>Từ chối hồ sơ xác minh</h3>
            </div>

            <div className="popup-noi-dung">
              <div className="o-form">
                <label>Lý do từ chối</label>

                <textarea
                  value={lyDoTuChoi}
                  onChange={(e) => setLyDoTuChoi(e.target.value)}
                />
              </div>

              <div className="popup-actions">
                <button className="nut-dong-y" onClick={xacNhanTuChoi}>
                  Đồng ý
                </button>

                <button className="nut-huy" onClick={() => setHienTuChoi(false)}>
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {hienXacNhanTrangThai && taiKhoanCanDoiTrangThai && (
        <div className="popup-nen">
          <div className="popup-hop popup-xac-nhan">
            <div className="popup-tieu-de">
              <h3>
                {Number(taiKhoanCanDoiTrangThai.trang_thai) ===
                TRANG_THAI_TAI_KHOAN_HOAT_DONG
                  ? "Xác nhận khóa tài khoản"
                  : "Xác nhận mở khóa tài khoản"}
              </h3>
            </div>

            <div className="popup-noi-dung">
              <p>
                Bạn có chắc muốn{" "}
                {Number(taiKhoanCanDoiTrangThai.trang_thai) ===
                TRANG_THAI_TAI_KHOAN_HOAT_DONG
                  ? "khóa"
                  : "mở khóa"}{" "}
                tài khoản "{taiKhoanCanDoiTrangThai.ho_ten}" không?
              </p>

              <div className="popup-actions">
                <button
                  className="nut-dong-y"
                  onClick={xacNhanDoiTrangThaiTaiKhoan}
                >
                  Đồng ý
                </button>

                <button
                  className="nut-huy"
                  onClick={() => {
                    setHienXacNhanTrangThai(false);
                    setTaiKhoanCanDoiTrangThai(null);
                  }}
                >
                  Hủy
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

      {anhDangXem && (
        <div className="popup-nen" onClick={() => setAnhDangXem("")}>
          <div className="popup-anh">
            <img src={anhDangXem} alt="Ảnh xác minh" />
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerAccountList;