import { useEffect, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

const SO_DONG_MOI_TRANG = 10;

const TRANG_THAI_HOAT_DONG = 101;
const TRANG_THAI_BI_KHOA = 102;

function EmployeeList() {
  const [danhSachNhanVien, setDanhSachNhanVien] = useState([]);
  const [tuKhoa, setTuKhoa] = useState("");
  const [trangThaiLoc, setTrangThaiLoc] = useState("0");
  const [trangHienTai, setTrangHienTai] = useState(1);

  const [popupThongBao, setPopupThongBao] = useState("");
  const [chiTietNhanVien, setChiTietNhanVien] = useState(null);

  const [hienForm, setHienForm] = useState(false);
  const [cheDoForm, setCheDoForm] = useState("THEM");
  const [nhanVienDangSua, setNhanVienDangSua] = useState(null);

  const [xacNhan, setXacNhan] = useState(null);

  const [form, setForm] = useState({
    ho_ten: "",
    email: "",
    so_dien_thoai: "",
    dia_chi: "",
    mat_khau: "",
  });

  useEffect(() => {
    layDanhSachNhanVien();
  }, []);

  function moPopup(noiDung) {
    setPopupThongBao(noiDung || "Có lỗi xảy ra");
  }

  function hienThi(giaTri) {
    return giaTri || "-";
  }

  function dinhDangNgay(ngay) {
    if (!ngay) return "-";
    return new Date(ngay).toLocaleDateString("vi-VN");
  }

  function layClassTrangThai(trangThaiId) {
    const id = Number(trangThaiId);

    if (id === TRANG_THAI_HOAT_DONG) {
      return "trang-thai-badge trang-thai-xanh";
    }

    if (id === TRANG_THAI_BI_KHOA) {
      return "trang-thai-badge trang-thai-do";
    }

    return "trang-thai-badge trang-thai-xam";
  }

  async function layDanhSachNhanVien() {
    try {
      const phanHoi = await fetch(`${DUONG_DAN_API}/api/admin/employees`, {
        headers: taoHeaderCoToken(),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachNhanVien(duLieu.data || []);
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    }
  }

  async function xemChiTietNhanVien(id) {
    try {
      const phanHoi = await fetch(`${DUONG_DAN_API}/api/admin/employees/${id}`, {
        headers: taoHeaderCoToken(),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setChiTietNhanVien(duLieu.data);
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    }
  }

  function moFormThem() {
    setCheDoForm("THEM");
    setNhanVienDangSua(null);

    setForm({
      ho_ten: "",
      email: "",
      so_dien_thoai: "",
      dia_chi: "",
      mat_khau: "",
    });

    setHienForm(true);
  }

  function moFormSua(nhanVien) {
    setCheDoForm("SUA");
    setNhanVienDangSua(nhanVien);

    setForm({
      ho_ten: nhanVien.ho_ten || "",
      email: "",
      so_dien_thoai: nhanVien.so_dien_thoai || "",
      dia_chi: nhanVien.dia_chi || "",
      mat_khau: "",
    });

    setHienForm(true);
  }

  function doiForm(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function guiForm(e) {
    e.preventDefault();

    if (!form.ho_ten.trim()) {
      return moPopup("Vui lòng nhập họ tên");
    }

    if (cheDoForm === "THEM") {
      if (!form.email.trim()) {
        return moPopup("Vui lòng nhập email");
      }

      if (!form.mat_khau.trim()) {
        return moPopup("Vui lòng nhập mật khẩu");
      }
    }

    try {
      const laThem = cheDoForm === "THEM";

      const url = laThem
        ? `${DUONG_DAN_API}/api/admin/employees`
        : `${DUONG_DAN_API}/api/admin/employees/${nhanVienDangSua.id}`;

      const bodyGuiDi = laThem
        ? {
            ho_ten: form.ho_ten,
            email: form.email,
            so_dien_thoai: form.so_dien_thoai,
            dia_chi: form.dia_chi,
            mat_khau: form.mat_khau,
          }
        : {
            ho_ten: form.ho_ten,
            so_dien_thoai: form.so_dien_thoai,
            dia_chi: form.dia_chi,
          };

      const phanHoi = await fetch(url, {
        method: laThem ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          ...taoHeaderCoToken(),
        },
        body: JSON.stringify(bodyGuiDi),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setHienForm(false);
        setNhanVienDangSua(null);
        layDanhSachNhanVien();
        moPopup(duLieu.message);
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    }
  }

  function moXacNhan(loai, nhanVien) {
    setXacNhan({
      loai,
      nhanVien,
    });
  }

  async function thucHienXacNhan() {
    if (!xacNhan) return;

    try {
      const nhanVien = xacNhan.nhanVien;
      let url = "";
      let method = "";
      let body = null;

      if (xacNhan.loai === "KHOA") {
        url = `${DUONG_DAN_API}/api/admin/employees/${nhanVien.id}/status`;
        method = "PUT";
        body = JSON.stringify({
          trang_thai: TRANG_THAI_BI_KHOA,
        });
      }

      if (xacNhan.loai === "MO_KHOA") {
        url = `${DUONG_DAN_API}/api/admin/employees/${nhanVien.id}/status`;
        method = "PUT";
        body = JSON.stringify({
          trang_thai: TRANG_THAI_HOAT_DONG,
        });
      }

      if (xacNhan.loai === "XOA") {
        url = `${DUONG_DAN_API}/api/admin/employees/${nhanVien.id}`;
        method = "DELETE";
      }

      const phanHoi = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...taoHeaderCoToken(),
        },
        body,
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setXacNhan(null);
        layDanhSachNhanVien();

        if (chiTietNhanVien && chiTietNhanVien.id === nhanVien.id) {
          setChiTietNhanVien(null);
        }

        moPopup(duLieu.message);
      } else {
        moPopup(duLieu.message);
      }
    } catch {
      moPopup("Không kết nối được server");
    }
  }

  const danhSachTrangThai = Array.from(
    new Map(
      danhSachNhanVien
        .filter((nv) => nv.trang_thai && nv.ten_trang_thai)
        .map((nv) => [String(nv.trang_thai), nv.ten_trang_thai])
    ).entries()
  );

  const danhSachSauLoc = danhSachNhanVien.filter((nv) => {
    const noiDung = `${nv.ho_ten || ""} ${nv.email || ""} ${
      nv.so_dien_thoai || ""
    }`.toLowerCase();

    const khopTuKhoa = noiDung.includes(tuKhoa.toLowerCase());

    const khopTrangThai =
      trangThaiLoc === "0" || Number(nv.trang_thai) === Number(trangThaiLoc);

    return khopTuKhoa && khopTrangThai;
  });

  const tongTrang = Math.max(
    1,
    Math.ceil(danhSachSauLoc.length / SO_DONG_MOI_TRANG)
  );

  const viTriBatDau = (trangHienTai - 1) * SO_DONG_MOI_TRANG;

  const danhSachHienThi = danhSachSauLoc.slice(
    viTriBatDau,
    viTriBatDau + SO_DONG_MOI_TRANG
  );

  return (
    <div className="trang-admin-crud">
      <h2>Quản lý nhân viên</h2>

      <div className="khung-loc-admin">
        <input
          placeholder="Tìm họ tên, email, số điện thoại"
          value={tuKhoa}
          onChange={(e) => {
            setTuKhoa(e.target.value);
            setTrangHienTai(1);
          }}
        />

        <select
          value={trangThaiLoc}
          onChange={(e) => {
            setTrangThaiLoc(e.target.value);
            setTrangHienTai(1);
          }}
        >
          <option value="0">Tất cả trạng thái</option>

          {danhSachTrangThai.map(([id, tenTrangThai]) => (
            <option key={id} value={id}>
              {tenTrangThai}
            </option>
          ))}
        </select>

        <button className="nut-them" onClick={moFormThem}>
          Thêm nhân viên
        </button>
      </div>

      <div className="admin-bang-wrapper">
        <table className="bang-quan-ly bang-gon">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {danhSachHienThi.map((nv, index) => (
              <tr key={nv.id}>
                <td>{viTriBatDau + index + 1}</td>
                <td>{hienThi(nv.ho_ten)}</td>
                <td>{hienThi(nv.email)}</td>
                <td>{hienThi(nv.so_dien_thoai)}</td>

                <td>
                  <span className={layClassTrangThai(nv.trang_thai)}>
                    {hienThi(nv.ten_trang_thai)}
                  </span>
                </td>

                <td>{dinhDangNgay(nv.created_at)}</td>

                <td>
                  <div className="cot-thao-tac">
                    <button
                      className="nut-xem-chi-tiet"
                      onClick={() => xemChiTietNhanVien(nv.id)}
                    >
                      Xem chi tiết
                    </button>

                    <button
                      className="nut-cap-nhat"
                      onClick={() => moFormSua(nv)}
                    >
                      Cập nhật
                    </button>

                    {Number(nv.trang_thai) === TRANG_THAI_HOAT_DONG ? (
                      <button className="nut-an" onClick={() => moXacNhan("KHOA", nv)}>
                        Khóa
                      </button>
                    ) : (
                      <button
                        className="nut-hien"
                        onClick={() => moXacNhan("MO_KHOA", nv)}
                      >
                        Mở khóa
                      </button>
                    )}

                    <button className="nut-xoa" onClick={() => moXacNhan("XOA", nv)}>
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {danhSachHienThi.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
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
          Trang {trangHienTai} / {tongTrang}
        </span>

        <button
          className="nut-dong-popup"
          disabled={trangHienTai === tongTrang}
          onClick={() => setTrangHienTai(trangHienTai + 1)}
        >
          Sau
        </button>
      </div>

      {chiTietNhanVien && (
        <div className="popup-nen">
          <div className="popup-hop">
            <div className="popup-tieu-de">
              <h3>Chi tiết nhân viên</h3>

              <button
                className="nut-dong-popup"
                onClick={() => setChiTietNhanVien(null)}
              >
                Đóng
              </button>
            </div>

            <table className="bang-popup">
              <tbody>
                <tr>
                  <td>Họ tên</td>
                  <td>{hienThi(chiTietNhanVien.ho_ten)}</td>
                </tr>

                <tr>
                  <td>Email</td>
                  <td>{hienThi(chiTietNhanVien.email)}</td>
                </tr>

                <tr>
                  <td>Số điện thoại</td>
                  <td>{hienThi(chiTietNhanVien.so_dien_thoai)}</td>
                </tr>

                <tr>
                  <td>Địa chỉ</td>
                  <td>{hienThi(chiTietNhanVien.dia_chi)}</td>
                </tr>

                <tr>
                  <td>Vai trò</td>
                  <td>{hienThi(chiTietNhanVien.vai_tro)}</td>
                </tr>

                <tr>
                  <td>Trạng thái</td>
                  <td>
                    <span className={layClassTrangThai(chiTietNhanVien.trang_thai)}>
                      {hienThi(chiTietNhanVien.ten_trang_thai)}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>Ngày tạo</td>
                  <td>{dinhDangNgay(chiTietNhanVien.created_at)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {hienForm && (
        <div className="popup-nen">
          <div className="popup-hop">
            <div className="popup-tieu-de">
              <h3>
                {cheDoForm === "THEM" ? "Thêm nhân viên" : "Cập nhật nhân viên"}
              </h3>

              <button className="nut-dong-popup" onClick={() => setHienForm(false)}>
                Đóng
              </button>
            </div>

            <form onSubmit={guiForm}>
              <div className="o-form">
                <label>Họ tên</label>
                <input name="ho_ten" value={form.ho_ten} onChange={doiForm} />
              </div>

              {cheDoForm === "THEM" && (
                <div className="o-form">
                  <label>Email</label>
                  <input name="email" value={form.email} onChange={doiForm} />
                </div>
              )}

              <div className="o-form">
                <label>Số điện thoại</label>
                <input
                  name="so_dien_thoai"
                  value={form.so_dien_thoai}
                  onChange={doiForm}
                />
              </div>

              <div className="o-form">
                <label>Địa chỉ</label>
                <textarea
                  name="dia_chi"
                  value={form.dia_chi}
                  onChange={doiForm}
                />
              </div>

              {cheDoForm === "THEM" && (
                <div className="o-form">
                  <label>Mật khẩu</label>
                  <input
                    type="password"
                    name="mat_khau"
                    value={form.mat_khau}
                    onChange={doiForm}
                  />
                </div>
              )}

              <div className="popup-actions">
                <button
                  className={cheDoForm === "THEM" ? "nut-them" : "nut-cap-nhat-popup"}
                  type="submit"
                >
                  {cheDoForm === "THEM" ? "Thêm" : "Cập nhật"}
                </button>

                <button
                  className="nut-huy"
                  type="button"
                  onClick={() => setHienForm(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {xacNhan && (
        <div className="popup-nen">
          <div className="popup-hop popup-xac-nhan">
            <div className="popup-tieu-de">
              <h3>Xác nhận</h3>
            </div>

            <div className="popup-noi-dung">
              <p>
                Bạn có chắc muốn{" "}
                <b>
                  {xacNhan.loai === "KHOA"
                    ? "khóa"
                    : xacNhan.loai === "MO_KHOA"
                    ? "mở khóa"
                    : "xóa"}
                </b>{" "}
                nhân viên <b>{xacNhan.nhanVien.ho_ten}</b> không?
              </p>

              <div className="popup-actions">
                <button className="nut-dong-y" onClick={thucHienXacNhan}>
                  Đồng ý
                </button>

                <button className="nut-huy" onClick={() => setXacNhan(null)}>
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
    </div>
  );
}

export default EmployeeList;