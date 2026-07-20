import { useEffect, useMemo, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

const SO_DONG_MOI_TRANG = 10;

function AdminEquipmentBrandList() {
  const [danhSachHang, setDanhSachHang] = useState([]);
  const [tuKhoaNhap, setTuKhoaNhap] = useState("");
  const [tuKhoa, setTuKhoa] = useState("");

  const [trangHienTai, setTrangHienTai] = useState(1);
  const [dangTai, setDangTai] = useState(false);
  const [dangGui, setDangGui] = useState(false);

  const [cheDoPopup, setCheDoPopup] = useState("");
  const [hangDangChon, setHangDangChon] = useState(null);

  const [formHang, setFormHang] = useState({
    ten_hang: "",
  });

  const [popupThongBao, setPopupThongBao] = useState("");
  const [popupXacNhan, setPopupXacNhan] = useState(null);

  useEffect(() => {
    layDanhSachHang();
  }, []);

  function moPopupThongBao(noiDung) {
    setPopupThongBao(noiDung || "Có lỗi xảy ra");
  }

  function hienThi(giaTri) {
    return giaTri || "-";
  }

  function dinhDangNgay(giaTri) {
    if (!giaTri) return "-";
    return new Date(giaTri).toLocaleDateString("vi-VN");
  }

  function layClassTrangThai(trangThai) {
    if (Number(trangThai) === 601) {
      return "trang-thai-badge trang-thai-xanh";
    }

    return "trang-thai-badge trang-thai-xam";
  }

  function layTrangThaiMoi(hang) {
    return Number(hang.trang_thai) === 601 ? 602 : 601;
  }

  function layTenNutTrangThai(hang) {
    return Number(hang.trang_thai) === 601 ? "Ẩn" : "Hiện";
  }

  function layClassNutTrangThai(hang) {
    return Number(hang.trang_thai) === 601 ? "nut-an" : "nut-hien";
  }

  async function layDanhSachHang() {
    try {
      setDangTai(true);

      const phanHoi = await fetch(`${DUONG_DAN_API}/api/equipment-brands`, {
        headers: taoHeaderCoToken(),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachHang(duLieu.data || []);
        setTrangHienTai(1);
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    } finally {
      setDangTai(false);
    }
  }

  function moThem() {
    setHangDangChon(null);

    setFormHang({
      ten_hang: "",
    });

    setCheDoPopup("THEM");
  }

  function moCapNhat(hang) {
    setHangDangChon(hang);

    setFormHang({
      ten_hang: hang.ten_hang || "",
    });

    setCheDoPopup("CAP_NHAT");
  }

  function dongPopup() {
    setCheDoPopup("");
    setHangDangChon(null);

    setFormHang({
      ten_hang: "",
    });
  }

  function doiFormHang(giaTri) {
    setFormHang({
      ...formHang,
      ten_hang: giaTri,
    });
  }

  function kiemTraFormHang() {
    if (!formHang.ten_hang.trim()) {
      moPopupThongBao("Vui lòng nhập tên hãng");
      return false;
    }

    return true;
  }

  async function guiFormHang(e) {
    e.preventDefault();

    if (!kiemTraFormHang()) return;

    try {
      setDangGui(true);

      const laThem = cheDoPopup === "THEM";

      const url = laThem
        ? `${DUONG_DAN_API}/api/equipment-brands`
        : `${DUONG_DAN_API}/api/equipment-brands/${hangDangChon.id}`;

      const phanHoi = await fetch(url, {
        method: laThem ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          ...taoHeaderCoToken(),
        },
        body: JSON.stringify({
          ten_hang: formHang.ten_hang,
        }),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        await layDanhSachHang();
        dongPopup();
        moPopupThongBao(duLieu.message);
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    } finally {
      setDangGui(false);
    }
  }

  function xacNhanDoiTrangThai(hang) {
    const trangThaiMoi = layTrangThaiMoi(hang);
    const hanhDong = trangThaiMoi === 602 ? "ẩn" : "hiện";

    setPopupXacNhan({
      noiDung: `Bạn có chắc muốn ${hanhDong} hãng "${hang.ten_hang}" không?`,
      hanhDong: async () => {
        await doiTrangThaiHang(hang);
      },
    });
  }

  async function doiTrangThaiHang(hang) {
    try {
      setPopupXacNhan(null);

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/equipment-brands/${hang.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...taoHeaderCoToken(),
          },
          body: JSON.stringify({
            trang_thai: layTrangThaiMoi(hang),
          }),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachHang((danhSachCu) =>
          danhSachCu.map((item) =>
            item.id === duLieu.data.id ? { ...item, ...duLieu.data } : item
          )
        );

        moPopupThongBao(duLieu.message);
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    }
  }

  function xacNhanXoa(hang) {
    setPopupXacNhan({
      noiDung: `Bạn có chắc muốn xóa hãng "${hang.ten_hang}" không?`,
      hanhDong: async () => {
        await xoaHang(hang.id);
      },
    });
  }

  async function xoaHang(id) {
    try {
      setPopupXacNhan(null);

      const phanHoi = await fetch(`${DUONG_DAN_API}/api/equipment-brands/${id}`, {
        method: "DELETE",
        headers: taoHeaderCoToken(),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachHang((danhSachCu) =>
          danhSachCu.filter((hang) => hang.id !== id)
        );

        moPopupThongBao(duLieu.message);
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    }
  }

  const danhSachSauLoc = useMemo(() => {
    return danhSachHang.filter((hang) => {
      const noiDung = `${hang.ten_hang || ""} ${
        hang.ten_trang_thai || ""
      }`.toLowerCase();

      return noiDung.includes(tuKhoa.toLowerCase());
    });
  }, [danhSachHang, tuKhoa]);

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
    <div className="khung-trang trang-quan-ly-hang-thiet-bi">
      <h2>Quản lý hãng thiết bị</h2>

      <div className="khung-loc-admin">
        <input
          placeholder="Tìm tên hãng hoặc trạng thái"
          value={tuKhoaNhap}
          onChange={(e) => {
            setTuKhoaNhap(e.target.value);
            setTuKhoa(e.target.value);
            setTrangHienTai(1);
          }}
        />

        <button className="nut-them" onClick={moThem}>
          Thêm
        </button>
      </div>

      <div className="admin-bang-wrapper">
        <table className="bang-quan-ly bang-gon">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên hãng</th>
              <th>Trạng thái</th>
              {/* <th>Ngày tạo</th>
              <th>Ngày cập nhật</th> */}
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {dangTai ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : danhSachHienThi.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              danhSachHienThi.map((hang, index) => (
                <tr key={hang.id}>
                  <td>{viTriBatDau + index + 1}</td>
                  <td>{hienThi(hang.ten_hang)}</td>

                  <td>
                    <span className={layClassTrangThai(hang.trang_thai)}>
                      {hienThi(hang.ten_trang_thai)}
                    </span>
                  </td>

                  {/* <td>{dinhDangNgay(hang.created_at)}</td>
                  <td>{dinhDangNgay(hang.updated_at)}</td> */}

                  <td>
                    <div className="cot-thao-tac">
                      <button
                        className="nut-cap-nhat"
                        onClick={() => moCapNhat(hang)}
                      >
                        Cập nhật
                      </button>

                      <button
                        className={layClassNutTrangThai(hang)}
                        onClick={() => xacNhanDoiTrangThai(hang)}
                      >
                        {layTenNutTrangThai(hang)}
                      </button>

                      {/* <button
                        className="nut-xoa"
                        onClick={() => xacNhanXoa(hang)}
                      >
                        Xóa
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))
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

      {(cheDoPopup === "THEM" || cheDoPopup === "CAP_NHAT") && (
        <div className="popup-nen">
          <div className="popup-hop">
            <div className="popup-tieu-de">
              <h3>
                {cheDoPopup === "THEM"
                  ? "Thêm hãng thiết bị"
                  : "Cập nhật hãng thiết bị"}
              </h3>
            </div>

            <div className="popup-noi-dung">
              <form onSubmit={guiFormHang}>
                <div className="o-form">
                  <label>Tên hãng</label>

                  <input
                    value={formHang.ten_hang}
                    onChange={(e) => doiFormHang(e.target.value)}
                  />
                </div>

                <div className="popup-actions">
                  <button
                    className={
                      cheDoPopup === "THEM"
                        ? "nut-them"
                        : "nut-cap-nhat-popup"
                    }
                    type="submit"
                    disabled={dangGui}
                  >
                    {dangGui
                      ? "Đang lưu..."
                      : cheDoPopup === "THEM"
                      ? "Thêm"
                      : "Cập nhật"}
                  </button>

                  <button className="nut-huy" type="button" onClick={dongPopup}>
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {popupXacNhan && (
        <div className="popup-nen">
          <div className="popup-hop popup-xac-nhan">
            <div className="popup-tieu-de">
              <h3>Xác nhận</h3>
            </div>

            <div className="popup-noi-dung">
              <p>{popupXacNhan.noiDung}</p>

              <div className="popup-actions">
                <button className="nut-dong-y" onClick={popupXacNhan.hanhDong}>
                  Đồng ý
                </button>

                <button
                  className="nut-huy"
                  onClick={() => setPopupXacNhan(null)}
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
    </div>
  );
}

export default AdminEquipmentBrandList;