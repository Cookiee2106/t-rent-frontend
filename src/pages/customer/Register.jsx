import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DUONG_DAN_API } from "../../api/api";

function Register() {
  const dieuHuong = useNavigate();

  const [bieuMau, setBieuMau] = useState({
    ho_ten: "",
    email: "",
    so_dien_thoai: "",
    mat_khau: "",
    xac_nhan_mat_khau: "",
  });

  const [thongBao, setThongBao] = useState("");

  function thayDoiDuLieu(e) {
    setBieuMau({
      ...bieuMau,
      [e.target.name]: e.target.value,
    });
  }

  async function guiDangKy(e) {
    e.preventDefault();

    const phanHoi = await fetch(`${DUONG_DAN_API}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bieuMau),
    });

    const duLieu = await phanHoi.json();

    setThongBao(duLieu.message);

    if (duLieu.success) {
      dieuHuong("/login");
    }
  }

  return (
    <div className="trang-form">
      <form className="form-don-gian" onSubmit={guiDangKy}>
        <h2>Đăng ký</h2>

        <div className="o-form">
          <label>Họ tên</label>
          <input
            name="ho_ten"
            value={bieuMau.ho_ten}
            onChange={thayDoiDuLieu}
          />
        </div>

        <div className="o-form">
          <label>Email</label>
          <input
            name="email"
            value={bieuMau.email}
            onChange={thayDoiDuLieu}
          />
        </div>

        <div className="o-form">
          <label>Số điện thoại</label>
          <input
            name="so_dien_thoai"
            value={bieuMau.so_dien_thoai}
            onChange={thayDoiDuLieu}
          />
        </div>

        <div className="o-form">
          <label>Mật khẩu</label>
          <input
            type="password"
            name="mat_khau"
            value={bieuMau.mat_khau}
            onChange={thayDoiDuLieu}
          />
        </div>

        <div className="o-form">
          <label>Xác nhận mật khẩu</label>
          <input
            type="password"
            name="xac_nhan_mat_khau"
            value={bieuMau.xac_nhan_mat_khau}
            onChange={thayDoiDuLieu}
          />
        </div>

        <div className="hang-nut-form">
          <button type="submit">Đăng ký</button>
        </div>

        <p className="goi-y-form">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>

        <p className="thong-bao">{thongBao}</p>
      </form>
    </div>
  );
}

export default Register;