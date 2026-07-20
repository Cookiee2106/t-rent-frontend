import { useEffect, useMemo, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

const SO_DONG_MOI_TRANG = 10;

function AdminEquipmentCategoryList() {
  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState([]);
  const [danhSachTinhChat, setDanhSachTinhChat] = useState([]);

  const [tuKhoaNhap, setTuKhoaNhap] = useState("");
  const [tuKhoa, setTuKhoa] = useState("");

  const [trangHienTai, setTrangHienTai] = useState(1);
  const [dangTai, setDangTai] = useState(false);
  const [dangGui, setDangGui] = useState(false);

  const [cheDoPopup, setCheDoPopup] = useState("");
  const [danhMucDangChon, setDanhMucDangChon] = useState(null);

  const [formDanhMuc, setFormDanhMuc] = useState({
    ten_danh_muc: "",
    tinh_chat_id: "",
  });

  const [popupThongBao, setPopupThongBao] = useState("");
  const [popupXacNhan, setPopupXacNhan] = useState(null);

  useEffect(() => {
    layDanhSachDanhMuc();
    layDanhSachTinhChat();
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

  function layTrangThaiMoi(danhMuc) {
    return Number(danhMuc.trang_thai) === 601 ? 602 : 601;
  }

  function layTenNutTrangThai(danhMuc) {
    return Number(danhMuc.trang_thai) === 601 ? "Ẩn" : "Hiện";
  }

  function layClassNutTrangThai(danhMuc) {
    return Number(danhMuc.trang_thai) === 601 ? "nut-an" : "nut-hien";
  }

  async function layDanhSachDanhMuc() {
    try {
      setDangTai(true);

      const phanHoi = await fetch(`${DUONG_DAN_API}/api/equipment-categories`, {
        headers: taoHeaderCoToken(),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachDanhMuc(duLieu.data || []);
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

  async function layDanhSachTinhChat() {
    try {
      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/equipment-categories/type-options`,
        {
          headers: taoHeaderCoToken(),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachTinhChat(duLieu.data || []);
      } else {
        moPopupThongBao(duLieu.message);
      }
    } catch {
      moPopupThongBao("Không kết nối được server");
    }
  }

  function moThem() {
    setDanhMucDangChon(null);

    setFormDanhMuc({
      ten_danh_muc: "",
      tinh_chat_id: "",
    });

    setCheDoPopup("THEM");
  }

  function moCapNhat(danhMuc) {
    setDanhMucDangChon(danhMuc);

    setFormDanhMuc({
      ten_danh_muc: danhMuc.ten_danh_muc || "",
      tinh_chat_id: danhMuc.tinh_chat_id || "",
    });

    setCheDoPopup("CAP_NHAT");
  }

  function dongPopup() {
    setCheDoPopup("");
    setDanhMucDangChon(null);

    setFormDanhMuc({
      ten_danh_muc: "",
      tinh_chat_id: "",
    });
  }

  function doiFormDanhMuc(tenTruong, giaTri) {
    setFormDanhMuc({
      ...formDanhMuc,
      [tenTruong]: giaTri,
    });
  }

  function kiemTraFormDanhMuc() {
    if (!formDanhMuc.ten_danh_muc.trim()) {
      moPopupThongBao("Vui lòng nhập tên danh mục");
      return false;
    }

    if (!formDanhMuc.tinh_chat_id) {
      moPopupThongBao("Vui lòng chọn tính chất danh mục");
      return false;
    }

    return true;
  }

  async function guiFormDanhMuc(e) {
    e.preventDefault();

    if (!kiemTraFormDanhMuc()) return;

    try {
      setDangGui(true);

      const laThem = cheDoPopup === "THEM";

      const url = laThem
        ? `${DUONG_DAN_API}/api/equipment-categories`
        : `${DUONG_DAN_API}/api/equipment-categories/${danhMucDangChon.id}`;

      const phanHoi = await fetch(url, {
        method: laThem ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          ...taoHeaderCoToken(),
        },
        body: JSON.stringify({
          ten_danh_muc: formDanhMuc.ten_danh_muc,
          tinh_chat_id: Number(formDanhMuc.tinh_chat_id),
        }),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        await layDanhSachDanhMuc();
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

  function xacNhanDoiTrangThai(danhMuc) {
    const trangThaiMoi = layTrangThaiMoi(danhMuc);
    const hanhDong = trangThaiMoi === 602 ? "ẩn" : "hiện";

    setPopupXacNhan({
      noiDung: `Bạn có chắc muốn ${hanhDong} danh mục "${danhMuc.ten_danh_muc}" không?`,
      hanhDong: async () => {
        await doiTrangThaiDanhMuc(danhMuc);
      },
    });
  }

  async function doiTrangThaiDanhMuc(danhMuc) {
    try {
      setPopupXacNhan(null);

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/equipment-categories/${danhMuc.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...taoHeaderCoToken(),
          },
          body: JSON.stringify({
            trang_thai: layTrangThaiMoi(danhMuc),
          }),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachDanhMuc((danhSachCu) =>
          danhSachCu.map((dm) =>
            dm.id === duLieu.data.id ? { ...dm, ...duLieu.data } : dm
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

  function xacNhanXoa(danhMuc) {
    setPopupXacNhan({
      noiDung: `Bạn có chắc muốn xóa danh mục "${danhMuc.ten_danh_muc}" không?`,
      hanhDong: async () => {
        await xoaDanhMuc(danhMuc.id);
      },
    });
  }

  async function xoaDanhMuc(id) {
    try {
      setPopupXacNhan(null);

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/equipment-categories/${id}`,
        {
          method: "DELETE",
          headers: taoHeaderCoToken(),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachDanhMuc((danhSachCu) =>
          danhSachCu.filter((dm) => dm.id !== id)
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
    return danhSachDanhMuc.filter((dm) => {
      const noiDung = `${dm.ten_danh_muc || ""} ${dm.ten_tinh_chat || ""} ${
        dm.ten_trang_thai || ""
      }`.toLowerCase();

      return noiDung.includes(tuKhoa.toLowerCase());
    });
  }, [danhSachDanhMuc, tuKhoa]);

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
    <div className="khung-trang trang-quan-ly-danh-muc-thiet-bi">
      <h2>Quản lý danh mục thiết bị</h2>

      <div className="khung-loc-admin">
        <input
          placeholder="Tìm tên danh mục, tính chất hoặc trạng thái"
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
              <th>Tên danh mục</th>
              <th>Tính chất</th>
              <th>Trạng thái</th>
              {/* <th>Ngày tạo</th>
              <th>Ngày cập nhật</th> */}
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {dangTai ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : danhSachHienThi.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              danhSachHienThi.map((dm, index) => (
                <tr key={dm.id}>
                  <td>{viTriBatDau + index + 1}</td>
                  <td>{hienThi(dm.ten_danh_muc)}</td>
                  <td>{hienThi(dm.ten_tinh_chat)}</td>

                  <td>
                    <span className={layClassTrangThai(dm.trang_thai)}>
                      {hienThi(dm.ten_trang_thai)}
                    </span>
                  </td>

                  {/* <td>{dinhDangNgay(dm.created_at)}</td>
                  <td>{dinhDangNgay(dm.updated_at)}</td> */}

                  <td>
                    <div className="cot-thao-tac">
                      <button
                        className="nut-cap-nhat"
                        onClick={() => moCapNhat(dm)}
                      >
                        Cập nhật
                      </button>

                      <button
                        className={layClassNutTrangThai(dm)}
                        onClick={() => xacNhanDoiTrangThai(dm)}
                      >
                        {layTenNutTrangThai(dm)}
                      </button>

                      {/* <button
                        className="nut-xoa"
                        onClick={() => xacNhanXoa(dm)}
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
                  ? "Thêm danh mục thiết bị"
                  : "Cập nhật danh mục thiết bị"}
              </h3>
            </div>

            <div className="popup-noi-dung">
              <form onSubmit={guiFormDanhMuc}>
                <div className="o-form">
                  <label>Tên danh mục</label>

                  <input
                    value={formDanhMuc.ten_danh_muc}
                    onChange={(e) =>
                      doiFormDanhMuc("ten_danh_muc", e.target.value)
                    }
                  />
                </div>

                <div className="o-form">
                  <label>Tính chất</label>

                  <select
                    value={formDanhMuc.tinh_chat_id}
                    onChange={(e) =>
                      doiFormDanhMuc("tinh_chat_id", e.target.value)
                    }
                  >
                    <option value="">-- Chọn tính chất --</option>

                    {danhSachTinhChat.map((tc) => (
                      <option key={tc.id} value={tc.id}>
                        {tc.ten_danh_muc}
                      </option>
                    ))}
                  </select>
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

export default AdminEquipmentCategoryList;