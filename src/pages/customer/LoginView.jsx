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

  async function dangNhap(e) {
    e.preventDefault();

    const phanHoi = await fetch(`${DUONG_DAN_API}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bieuMau),
    });

    const duLieu = await phanHoi.json();

    if (!duLieu.success) {
      return setThongBao(duLieu.message);
    }

    const data = duLieu.data || {};
    const token = data.token;

    if (!token) {
      return setThongBao("Không lấy được token sau khi đăng nhập");
    }

    localStorage.setItem("token", token);

    const phanHoiMe = await fetch(`${DUONG_DAN_API}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const duLieuMe = await phanHoiMe.json();

    if (!duLieuMe.success) {
      localStorage.removeItem("token");
      return setThongBao(
        duLieuMe.message || "Không lấy được thông tin tài khoản"
      );
    }

    const nguoiDung = duLieuMe.data;

    localStorage.setItem("user", JSON.stringify(nguoiDung));

    setThongBao("Đăng nhập thành công");

    const vaiTroNoiBo = ["NHAN_VIEN", "QUAN_TRI", "QUAN_TRI_VIEN"];

    if (vaiTroNoiBo.includes(nguoiDung.vai_tro)) {
      dieuHuong("/admin/customers");
      return;
    }

    dieuHuong("/");
  }

  return (
    <div className="trang-form">
      <form className="form-don-gian" onSubmit={dangNhap}>
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

          <button type="button" onClick={() => dieuHuong("/register")}>
            Đăng ký
          </button>
        </div>

        <p className="thong-bao">{thongBao}</p>
      </form>
    </div>
  );
}

export default Login;