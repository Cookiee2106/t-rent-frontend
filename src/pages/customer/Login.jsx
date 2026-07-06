import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DUONG_DAN_API } from "../../api/api";

function Login() {
  const dieuHuong = useNavigate();

  const [bieuMau, setBieuMau] = useState({
    email: "",
    mat_khau: "",
  });

  const [thongBao, setThongBao] = useState("");

  function thayDoiDuLieu(e) {
    setBieuMau({
      ...bieuMau,
      [e.target.name]: e.target.value,
    });
  }

  async function guiDangNhap(e) {
    e.preventDefault();

    const phanHoi = await fetch(`${DUONG_DAN_API}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bieuMau),
    });

    const duLieu = await phanHoi.json();

    setThongBao(duLieu.message);

    if (duLieu.success) {
      localStorage.setItem("token", duLieu.token);
      localStorage.setItem("user", JSON.stringify(duLieu.data));

      dieuHuong("/");
    }
  }

  function chuyenSangDangKy() {
    dieuHuong("/register");
  }

  return (
    <div className="trang-form">
      <form className="form-don-gian" onSubmit={guiDangNhap}>
        <h2>Đăng nhập</h2>

        <div className="o-form">
          <label>Email</label>
          <input
            name="email"
            value={bieuMau.email}
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

        <div className="hang-nut-form">
          <button type="submit">Đăng nhập</button>

          <button type="button" onClick={chuyenSangDangKy}>
            Đăng ký
          </button>
        </div>

        <p className="thong-bao">{thongBao}</p>
      </form>
    </div>
  );
}

export default Login;