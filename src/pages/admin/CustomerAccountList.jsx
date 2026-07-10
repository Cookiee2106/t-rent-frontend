import { useEffect, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

function CustomerAccountList() {
  const SO_DONG_MOI_TRANG = 10;
  const [danhSachTaiKhoan, setDanhSachTaiKhoan] = useState([]);
  const [tuKhoa, setTuKhoa] = useState("");
  const [trangThai, setTrangThai] = useState("0");
  const [thongBao, setThongBao] = useState("");
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [chiTiet, setChiTiet] = useState(null);
  const [anhDangXem, setAnhDangXem] = useState("");
  const [hienXacNhanDuyet, setHienXacNhanDuyet] = useState(false);
  const [hienTuChoi, setHienTuChoi] = useState(false);
  const [lyDoTuChoi, setLyDoTuChoi] = useState("");

  function dinhDangNgay(ngay) {
    if (!ngay) return "Chưa có";
    return new Date(ngay).toLocaleString("vi-VN");
  }
  async function layDanhSachTaiKhoan() {
    const phanHoi = await fetch(
      `${DUONG_DAN_API}/api/admin/customers?tu_khoa=${tuKhoa}&trang_thai=${trangThai}`,
      {
        headers: taoHeaderCoToken(),
      }
    );

    const duLieu = await phanHoi.json();

    if (duLieu.success) {
      setDanhSachTaiKhoan(duLieu.data);
      setTrangHienTai(1);
      setThongBao("");
    } else {
      setThongBao(duLieu.message);
    }
  }

  async function xemChiTiet(id) {
    const phanHoi = await fetch(`${DUONG_DAN_API}/api/admin/customers/${id}`, {
      headers: taoHeaderCoToken(),
    });

    const duLieu = await phanHoi.json();

    if (duLieu.success) {
      setChiTiet(duLieu.data);
      setThongBao("");
    } else {
      setThongBao(duLieu.message);
    }
  }

  async function xacNhanDuyet() {
    if (!chiTiet.ho_so_xac_minh_id) {
      return setThongBao("Khách hàng chưa có hồ sơ xác minh");
    }
    const phanHoi = await fetch(
      `${DUONG_DAN_API}/api/admin/verifications/${chiTiet.ho_so_xac_minh_id}/approve`,
      {
        method: "PUT",
        headers: taoHeaderCoToken(),
      }
    );

    const duLieu = await phanHoi.json();

    setThongBao(duLieu.message);
    setHienXacNhanDuyet(false);

    if (duLieu.success) {
      xemChiTiet(chiTiet.id);
      layDanhSachTaiKhoan();
    }
  }

  async function xacNhanTuChoi() {
    if (!lyDoTuChoi.trim()) {
      return setThongBao("Vui lòng nhập lý do từ chối");
    }

    if (!chiTiet.ho_so_xac_minh_id) {
      return setThongBao("Khách hàng chưa có hồ sơ xác minh");
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

    setThongBao(duLieu.message);
    setHienTuChoi(false);
    setLyDoTuChoi("");

    if (duLieu.success) {
      xemChiTiet(chiTiet.id);
      layDanhSachTaiKhoan();
    }
  }

  useEffect(() => {
    layDanhSachTaiKhoan();
  }, []);

  
  const tongTrang = Math.ceil(danhSachTaiKhoan.length / SO_DONG_MOI_TRANG);
  const viTriBatDau = (trangHienTai - 1) * SO_DONG_MOI_TRANG;
  const danhSachHienThi = danhSachTaiKhoan.slice(
    viTriBatDau,
    viTriBatDau + SO_DONG_MOI_TRANG
  );

  return (
    <div>
      <h2>Quản lý tài khoản khách hàng</h2>

      <div className="khung-loc-admin">
        <input
          placeholder="Tìm tên, email, số điện thoại"
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
        />

        <select value={trangThai} onChange={(e) => setTrangThai(e.target.value)}>
          <option value="0">Tất cả trạng thái xác minh</option>
          <option value="201">Chưa xác minh</option>
          <option value="202">Chờ duyệt</option>
          <option value="203">Đã duyệt</option>
          <option value="204">Từ chối</option>
        </select>

        <button onClick={layDanhSachTaiKhoan}>Tìm kiếm</button>
      </div>

      {thongBao && <p className="thong-bao">{thongBao}</p>}

      <div className="admin-bang-wrapper">
        <table className="bang-quan-ly">
          <thead>
            <tr>
              <th>STT</th>
              <th>Khách hàng</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Số CCCD</th>
              <th>Trạng thái xác minh</th>
              <th>Ngày gửi</th>
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
                <td>
                  {taiKhoan.ten_trang_thai_xac_minh ||
                    taiKhoan.ten_trang_thai_ho_so ||
                    "Chưa xác minh"}
                </td>
                <td>{dinhDangNgay(taiKhoan.ngay_gui)}</td>
                <td>
                  <button onClick={() => xemChiTiet(taiKhoan.id)}>
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
            {danhSachHienThi.length === 0 && (
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

      {chiTiet && (
        <div className="popup-nen">
          <div className="popup-hop popup-lon">
            <div className="popup-tieu-de">
              <h3>Chi tiết tài khoản khách hàng</h3>

              <button onClick={() => setChiTiet(null)}>Đóng</button>
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
                    <td>
                      {chiTiet.ten_trang_thai_xac_minh ||
                        chiTiet.ten_trang_thai_ho_so ||
                        "Chưa xác minh"}
                    </td>
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

              {Number(chiTiet.trang_thai_xac_minh) === 202 &&
                chiTiet.ho_so_xac_minh_id && (
                  <div className="popup-actions">
                    <button onClick={() => setHienXacNhanDuyet(true)}>
                      Duyệt hồ sơ xác minh
                    </button>

                    <button onClick={() => setHienTuChoi(true)}>
                      Từ chối hồ sơ xác minh
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {hienXacNhanDuyet && (
        <div className="popup-nen">
          <div className="popup-hop">
            <h3>Xác nhận duyệt hồ sơ</h3>

            <p>Bạn có chắc muốn duyệt hồ sơ xác minh này không?</p>

            <div className="popup-actions">
              <button onClick={xacNhanDuyet}>Xác nhận</button>

              <button onClick={() => setHienXacNhanDuyet(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {hienTuChoi && (
        <div className="popup-nen">
          <div className="popup-hop">
            <h3>Từ chối hồ sơ xác minh</h3>

            <div className="o-form">
              <label>Lý do từ chối</label>

              <textarea
                value={lyDoTuChoi}
                onChange={(e) => setLyDoTuChoi(e.target.value)}
              />
            </div>

            <div className="popup-actions">
              <button onClick={xacNhanTuChoi}>Xác nhận</button>

              <button onClick={() => setHienTuChoi(false)}>Hủy</button>
            </div>
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