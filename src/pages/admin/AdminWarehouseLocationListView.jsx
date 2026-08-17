import { useEffect, useMemo, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

const SO_DONG_MOI_TRANG = 10;

function AdminWarehouseLocationList() {
  const [danhSachViTri, setDanhSachViTri] = useState([]);
  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState([]);
  const [tuKhoaNhap, setTuKhoaNhap] = useState("");
  const [tuKhoa, setTuKhoa] = useState("");

  const [trangHienTai, setTrangHienTai] = useState(1);
  const [dangTai, setDangTai] = useState(false);
  const [dangGui, setDangGui] = useState(false);

  const [cheDoPopup, setCheDoPopup] = useState("");
  const [viTriDangChon, setViTriDangChon] = useState(null);

  const [formViTri, setFormViTri] = useState({
    ten_vi_tri: "",
    danh_muc_id: "",
    suc_chua_toi_da: "",
  });

  const [popupThongBao, setPopupThongBao] = useState("");
  const [popupXacNhan, setPopupXacNhan] = useState(null);

  useEffect(() => {
    layDanhSachViTri();
    layDanhSachDanhMuc();
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

  function layTrangThaiMoi(viTri) {
    return Number(viTri.trang_thai) === 601 ? 602 : 601;
  }

  function layTenNutTrangThai(viTri) {
    return Number(viTri.trang_thai) === 601 ? "Ẩn" : "Hiện";
  }

  function layClassNutTrangThai(viTri) {
    return Number(viTri.trang_thai) === 601 ? "nut-an" : "nut-hien";
  }

  async function layDanhSachViTri() {
    try {
      setDangTai(true);

      const phanHoi = await fetch(`${DUONG_DAN_API}/api/warehouse-locations`, {
        headers: taoHeaderCoToken(),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachViTri(duLieu.data || []);
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

  // Lấy đủ 3 nhóm danh mục đang dùng trong hệ thống:
  // thiết bị chính (2501), thiết bị phụ (2502), phụ kiện (2503).
  async function layDanhSachDanhMuc() {
    try {
      const danhSachTinhChat = [2501, 2502, 2503];

      const cacPhanHoi = await Promise.all(
        danhSachTinhChat.map((tinhChatId) =>
          fetch(
            `${DUONG_DAN_API}/api/equipment-categories/options?tinh_chat_id=${tinhChatId}`,
            {
              headers: taoHeaderCoToken(),
            }
          )
        )
      );

      const cacDuLieu = await Promise.all(
        cacPhanHoi.map((phanHoi) => phanHoi.json())
      );

      const danhMucGop = [];
      const daCo = new Set();

      for (const duLieu of cacDuLieu) {
        for (const danhMuc of duLieu.data || []) {
          if (!daCo.has(String(danhMuc.id))) {
            daCo.add(String(danhMuc.id));
            danhMucGop.push(danhMuc);
          }
        }
      }

      danhMucGop.sort((a, b) =>
        String(a.ten_danh_muc || "").localeCompare(
          String(b.ten_danh_muc || ""),
          "vi"
        )
      );

      setDanhSachDanhMuc(danhMucGop);
    } catch {
      moPopupThongBao("Không tải được danh sách danh mục");
    }
  }

  function moThem() {
    setViTriDangChon(null);

    setFormViTri({
      ten_vi_tri: "",
      danh_muc_id: "",
      suc_chua_toi_da: "",
    });

    setCheDoPopup("THEM");
  }

  function moCapNhat(viTri) {
    setViTriDangChon(viTri);

    setFormViTri({
      ten_vi_tri: viTri.ten_vi_tri || "",
      danh_muc_id: viTri.danh_muc_id || "",
      suc_chua_toi_da: viTri.suc_chua_toi_da || "",
    });

    setCheDoPopup("CAP_NHAT");
  }

  function dongPopup() {
    setCheDoPopup("");
    setViTriDangChon(null);

    setFormViTri({
      ten_vi_tri: "",
      danh_muc_id: "",
      suc_chua_toi_da: "",
    });
  }

  function doiFormViTri(tenTruong, giaTri) {
    setFormViTri({
      ...formViTri,
      [tenTruong]: giaTri,
    });
  }

  function kiemTraFormViTri() {
    const sucChua = Number(formViTri.suc_chua_toi_da);

    if (!formViTri.ten_vi_tri.trim()) {
      moPopupThongBao("Vui lòng nhập tên vị trí");
      return false;
    }

    if (!formViTri.danh_muc_id) {
      moPopupThongBao("Vui lòng chọn danh mục");
      return false;
    }

    if (!formViTri.suc_chua_toi_da) {
      moPopupThongBao("Vui lòng nhập sức chứa tối đa");
      return false;
    }

    if (!Number.isInteger(sucChua) || sucChua <= 0) {
      moPopupThongBao("Sức chứa tối đa phải là số nguyên lớn hơn 0");
      return false;
    }

    return true;
  }

  async function guiFormViTri(e) {
    e.preventDefault();

    if (!kiemTraFormViTri()) return;

    try {
      setDangGui(true);

      const laThem = cheDoPopup === "THEM";

      const url = laThem
        ? `${DUONG_DAN_API}/api/warehouse-locations`
        : `${DUONG_DAN_API}/api/warehouse-locations/${viTriDangChon.id}`;

      const phanHoi = await fetch(url, {
        method: laThem ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          ...taoHeaderCoToken(),
        },
        body: JSON.stringify({
          ten_vi_tri: formViTri.ten_vi_tri,
          danh_muc_id: formViTri.danh_muc_id,
          suc_chua_toi_da: Number(formViTri.suc_chua_toi_da),
        }),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        await layDanhSachViTri();
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

  function xacNhanDoiTrangThai(viTri) {
    const trangThaiMoi = layTrangThaiMoi(viTri);
    const hanhDong = trangThaiMoi === 602 ? "ẩn" : "hiện";

    setPopupXacNhan({
      noiDung: `Bạn có chắc muốn ${hanhDong} vị trí "${viTri.ten_vi_tri}" không?`,
      hanhDong: async () => {
        await doiTrangThaiViTri(viTri);
      },
    });
  }

  async function doiTrangThaiViTri(viTri) {
    try {
      setPopupXacNhan(null);

      const phanHoi = await fetch(
        `${DUONG_DAN_API}/api/warehouse-locations/${viTri.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...taoHeaderCoToken(),
          },
          body: JSON.stringify({
            trang_thai: layTrangThaiMoi(viTri),
          }),
        }
      );

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setDanhSachViTri((danhSachCu) =>
          danhSachCu.map((vt) =>
            vt.id === duLieu.data.id ? { ...vt, ...duLieu.data } : vt
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

  const danhSachSauLoc = useMemo(() => {
    return danhSachViTri.filter((vt) => {
      const noiDung = `${vt.ten_vi_tri || ""} ${
        vt.ten_danh_muc || ""
      } ${vt.ten_trang_thai || ""}`.toLowerCase();

      return noiDung.includes(tuKhoa.toLowerCase());
    });
  }, [danhSachViTri, tuKhoa]);

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
    <div className="khung-trang trang-admin-crud trang-quan-ly-vi-tri-kho">
      <h2>Quản lý vị trí kho</h2>

      <div className="khung-loc-admin">
        <input
          placeholder="Tìm tên vị trí, danh mục hoặc trạng thái"
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
              <th>Tên vị trí</th>
              <th>Danh mục</th>
              <th>Sức chứa tối đa</th>
              <th>Đang chứa</th>
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
              danhSachHienThi.map((vt, index) => (
                <tr key={vt.id}>
                  <td>{viTriBatDau + index + 1}</td>
                  <td>{hienThi(vt.ten_vi_tri)}</td>
                  <td>{hienThi(vt.ten_danh_muc)}</td>
                  <td>{vt.suc_chua_toi_da || 0}</td>
                  <td>{vt.so_luong_dang_chua || 0}</td>

                  <td>
                    <span className={layClassTrangThai(vt.trang_thai)}>
                      {hienThi(vt.ten_trang_thai)}
                    </span>
                  </td>

                  {/* <td>{dinhDangNgay(vt.created_at)}</td>
                  <td>{dinhDangNgay(vt.updated_at)}</td> */}

                  <td>
                    <div className="cot-thao-tac">
                      <button
                        className="nut-cap-nhat"
                        onClick={() => moCapNhat(vt)}
                      >
                        Cập nhật
                      </button>

                      <button
                        className={layClassNutTrangThai(vt)}
                        onClick={() => xacNhanDoiTrangThai(vt)}
                      >
                        {layTenNutTrangThai(vt)}
                      </button>
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
                  ? "Thêm vị trí kho"
                  : "Cập nhật vị trí kho"}
              </h3>
            </div>

            <div className="popup-noi-dung">
              <form onSubmit={guiFormViTri}>
                <div className="o-form">
                  <label>Tên vị trí</label>

                  <input
                    value={formViTri.ten_vi_tri}
                    onChange={(e) =>
                      doiFormViTri("ten_vi_tri", e.target.value)
                    }
                  />
                </div>

                <div className="o-form">
                  <label>Danh mục</label>

                  <select
                    value={formViTri.danh_muc_id}
                    onChange={(e) =>
                      doiFormViTri("danh_muc_id", e.target.value)
                    }
                  >
                    <option value="">-- Chọn danh mục --</option>

                    {danhSachDanhMuc.map((danhMuc) => (
                      <option key={danhMuc.id} value={danhMuc.id}>
                        {danhMuc.ten_danh_muc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="o-form">
                  <label>Sức chứa tối đa</label>

                  <input
                    type="number"
                    min="1"
                    value={formViTri.suc_chua_toi_da}
                    onChange={(e) =>
                      doiFormViTri("suc_chua_toi_da", e.target.value)
                    }
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

export default AdminWarehouseLocationList;