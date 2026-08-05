import { useEffect, useMemo, useState } from "react";
import { DUONG_DAN_API, taoHeaderCoToken } from "../../api/api";

const SO_DONG_MOI_TRANG = 10;
const TRANG_THAI_HIEN_THI = 601;
const TRANG_THAI_DA_AN = 602;

function AdminEquipmentCategoryList() {
  const [tabDangChon, setTabDangChon] = useState("DANH_MUC");

  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState([]);
  const [danhSachTinhChat, setDanhSachTinhChat] = useState([]);
  const [danhSachNhuCau, setDanhSachNhuCau] = useState([]);

  const [tuKhoaNhap, setTuKhoaNhap] = useState("");
  const [tuKhoa, setTuKhoa] = useState("");
  const [trangThaiLoc, setTrangThaiLoc] = useState("0");

  const [trangHienTai, setTrangHienTai] = useState(1);
  const [dangTai, setDangTai] = useState(false);
  const [dangGui, setDangGui] = useState(false);

  const [cheDoPopup, setCheDoPopup] = useState("");
  const [duLieuDangChon, setDuLieuDangChon] = useState(null);

  const [formDanhMuc, setFormDanhMuc] = useState({
    ten_danh_muc: "",
    tinh_chat_id: "",
  });

  const [formNhuCau, setFormNhuCau] = useState({
    ten_nhu_cau: "",
    mo_ta: "",
  });

  const [popupThongBao, setPopupThongBao] = useState("");
  const [popupXacNhan, setPopupXacNhan] = useState(null);

  useEffect(() => {
    layToanBoDuLieu();
  }, []);

  function moPopupThongBao(noiDung) {
    setPopupThongBao(noiDung || "Có lỗi xảy ra");
  }

  function hienThi(giaTri) {
    return giaTri || "-";
  }

  function taoHeaderJson() {
    return {
      "Content-Type": "application/json",
      ...taoHeaderCoToken(),
    };
  }

  function layClassTrangThai(trangThai) {
    return Number(trangThai) === TRANG_THAI_HIEN_THI
      ? "trang-thai-badge trang-thai-xanh"
      : "trang-thai-badge trang-thai-xam";
  }

  function layTrangThaiMoi(item) {
    return Number(item.trang_thai) === TRANG_THAI_HIEN_THI
      ? TRANG_THAI_DA_AN
      : TRANG_THAI_HIEN_THI;
  }

  function layTenNutTrangThai(item) {
    return Number(item.trang_thai) === TRANG_THAI_HIEN_THI
      ? "Ẩn"
      : "Hiện";
  }

  function layClassNutTrangThai(item) {
    return Number(item.trang_thai) === TRANG_THAI_HIEN_THI
      ? "nut-an"
      : "nut-hien";
  }

  async function layToanBoDuLieu() {
    try {
      setDangTai(true);

      const [
        phanHoiDanhMuc,
        phanHoiTinhChat,
        phanHoiNhuCau,
      ] = await Promise.all([
        fetch(`${DUONG_DAN_API}/api/equipment-categories`, {
          headers: taoHeaderCoToken(),
        }),
        fetch(
          `${DUONG_DAN_API}/api/equipment-categories/type-options`,
          {
            headers: taoHeaderCoToken(),
          }
        ),
        fetch(`${DUONG_DAN_API}/api/equipment-needs`, {
          headers: taoHeaderCoToken(),
        }),
      ]);

      const [
        duLieuDanhMuc,
        duLieuTinhChat,
        duLieuNhuCau,
      ] = await Promise.all([
        phanHoiDanhMuc.json(),
        phanHoiTinhChat.json(),
        phanHoiNhuCau.json(),
      ]);

      if (!duLieuDanhMuc.success) {
        throw new Error(duLieuDanhMuc.message);
      }

      if (!duLieuTinhChat.success) {
        throw new Error(duLieuTinhChat.message);
      }

      if (!duLieuNhuCau.success) {
        throw new Error(duLieuNhuCau.message);
      }

      setDanhSachDanhMuc(duLieuDanhMuc.data || []);
      setDanhSachTinhChat(duLieuTinhChat.data || []);
      setDanhSachNhuCau(duLieuNhuCau.data || []);
    } catch (loi) {
      moPopupThongBao(loi.message || "Không kết nối được server");
    } finally {
      setDangTai(false);
    }
  }

  function doiTab(tabMoi) {
    setTabDangChon(tabMoi);
    setTuKhoaNhap("");
    setTuKhoa("");
    setTrangThaiLoc("0");
    setTrangHienTai(1);
    dongPopup();
  }

  function moThem() {
    setDuLieuDangChon(null);

    if (tabDangChon === "DANH_MUC") {
      setFormDanhMuc({
        ten_danh_muc: "",
        tinh_chat_id: "",
      });
    } else {
      setFormNhuCau({
        ten_nhu_cau: "",
        mo_ta: "",
      });
    }

    setCheDoPopup("THEM");
  }

  function moCapNhat(item) {
    setDuLieuDangChon(item);

    if (tabDangChon === "DANH_MUC") {
      setFormDanhMuc({
        ten_danh_muc: item.ten_danh_muc || "",
        tinh_chat_id: item.tinh_chat_id || "",
      });
    } else {
      setFormNhuCau({
        ten_nhu_cau: item.ten_nhu_cau || "",
        mo_ta: item.mo_ta || "",
      });
    }

    setCheDoPopup("CAP_NHAT");
  }

  function dongPopup() {
    setCheDoPopup("");
    setDuLieuDangChon(null);

    setFormDanhMuc({
      ten_danh_muc: "",
      tinh_chat_id: "",
    });

    setFormNhuCau({
      ten_nhu_cau: "",
      mo_ta: "",
    });
  }

  function kiemTraForm() {
    if (tabDangChon === "DANH_MUC") {
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

    if (!formNhuCau.ten_nhu_cau.trim()) {
      moPopupThongBao("Vui lòng nhập tên nhu cầu");
      return false;
    }

    return true;
  }

  async function guiForm(e) {
    e.preventDefault();

    if (!kiemTraForm()) return;

    try {
      setDangGui(true);

      const laThem = cheDoPopup === "THEM";
      const laDanhMuc = tabDangChon === "DANH_MUC";

      const url = laDanhMuc
        ? laThem
          ? `${DUONG_DAN_API}/api/equipment-categories`
          : `${DUONG_DAN_API}/api/equipment-categories/${duLieuDangChon.id}`
        : laThem
        ? `${DUONG_DAN_API}/api/equipment-needs`
        : `${DUONG_DAN_API}/api/equipment-needs/${duLieuDangChon.id}`;

      const body = laDanhMuc
        ? {
            ten_danh_muc: formDanhMuc.ten_danh_muc,
            tinh_chat_id: Number(formDanhMuc.tinh_chat_id),
          }
        : {
            ten_nhu_cau: formNhuCau.ten_nhu_cau,
            mo_ta: formNhuCau.mo_ta,
          };

      const phanHoi = await fetch(url, {
        method: laThem ? "POST" : "PUT",
        headers: taoHeaderJson(),
        body: JSON.stringify(body),
      });

      const duLieu = await phanHoi.json();

      if (!duLieu.success) {
        moPopupThongBao(duLieu.message);
        return;
      }

      await layToanBoDuLieu();
      dongPopup();
      moPopupThongBao(duLieu.message);
    } catch {
      moPopupThongBao("Không kết nối được server");
    } finally {
      setDangGui(false);
    }
  }

  function xacNhanDoiTrangThai(item) {
    const trangThaiMoi = layTrangThaiMoi(item);
    const hanhDong =
      trangThaiMoi === TRANG_THAI_DA_AN ? "ẩn" : "hiện";

    const ten =
      tabDangChon === "DANH_MUC"
        ? item.ten_danh_muc
        : item.ten_nhu_cau;

    setPopupXacNhan({
      noiDung: `Bạn có chắc muốn ${hanhDong} ${
        tabDangChon === "DANH_MUC" ? "danh mục" : "nhu cầu"
      } "${ten}" không?`,
      hanhDong: async () => {
        await doiTrangThai(item, trangThaiMoi);
      },
    });
  }

  async function doiTrangThai(item, trangThaiMoi) {
    try {
      setPopupXacNhan(null);

      const laDanhMuc = tabDangChon === "DANH_MUC";

      const url = laDanhMuc
        ? `${DUONG_DAN_API}/api/equipment-categories/${item.id}/status`
        : `${DUONG_DAN_API}/api/equipment-needs/${item.id}/status`;

      const phanHoi = await fetch(url, {
        method: laDanhMuc ? "PUT" : "PATCH",
        headers: taoHeaderJson(),
        body: JSON.stringify({
          trang_thai: trangThaiMoi,
        }),
      });

      const duLieu = await phanHoi.json();

      if (!duLieu.success) {
        moPopupThongBao(duLieu.message);
        return;
      }

      await layToanBoDuLieu();
      moPopupThongBao(duLieu.message);
    } catch {
      moPopupThongBao("Không kết nối được server");
    }
  }

  const danhSachSauLoc = useMemo(() => {
    const danhSach =
      tabDangChon === "DANH_MUC"
        ? danhSachDanhMuc
        : danhSachNhuCau;

    return danhSach.filter((item) => {
      const dungTrangThai =
        trangThaiLoc === "0" ||
        Number(item.trang_thai) === Number(trangThaiLoc);

      const noiDung =
        tabDangChon === "DANH_MUC"
          ? `${item.ten_danh_muc || ""} ${
              item.ten_tinh_chat || ""
            } ${item.ten_trang_thai || ""}`
          : `${item.ten_nhu_cau || ""} ${item.mo_ta || ""} ${
              item.ten_trang_thai || ""
            }`;

      return (
        dungTrangThai &&
        noiDung.toLowerCase().includes(tuKhoa.toLowerCase())
      );
    });
  }, [
    tabDangChon,
    danhSachDanhMuc,
    danhSachNhuCau,
    tuKhoa,
    trangThaiLoc,
  ]);

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
      <h2>Quản lý danh mục và nhu cầu sử dụng</h2>

      <div className="thanh-tab-quan-ly">
        <button
          type="button"
          className={
            tabDangChon === "DANH_MUC"
              ? "nut-tab-quan-ly nut-tab-dang-chon"
              : "nut-tab-quan-ly"
          }
          onClick={() => doiTab("DANH_MUC")}
        >
          Danh mục thiết bị
        </button>

        <button
          type="button"
          className={
            tabDangChon === "NHU_CAU"
              ? "nut-tab-quan-ly nut-tab-dang-chon"
              : "nut-tab-quan-ly"
          }
          onClick={() => doiTab("NHU_CAU")}
        >
          Nhu cầu sử dụng
        </button>
      </div>

      <div className="khung-loc-admin">
        <input
          placeholder={
            tabDangChon === "DANH_MUC"
              ? "Tìm tên danh mục, tính chất hoặc trạng thái"
              : "Tìm tên, mô tả nhu cầu hoặc trạng thái"
          }
          value={tuKhoaNhap}
          onChange={(e) => {
            setTuKhoaNhap(e.target.value);
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
          <option value="601">Hiển thị</option>
          <option value="602">Đã ẩn</option>
        </select>

        <button className="nut-them" type="button" onClick={moThem}>
          {tabDangChon === "DANH_MUC"
            ? "Thêm danh mục"
            : "Thêm nhu cầu"}
        </button>
      </div>

      <div className="admin-bang-wrapper">
        {tabDangChon === "DANH_MUC" ? (
          <table className="bang-quan-ly bang-gon">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên danh mục</th>
                <th>Tính chất</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {dangTai ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : danhSachHienThi.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                danhSachHienThi.map((danhMuc, index) => (
                  <tr key={danhMuc.id}>
                    <td>{viTriBatDau + index + 1}</td>
                    <td>{hienThi(danhMuc.ten_danh_muc)}</td>
                    <td>{hienThi(danhMuc.ten_tinh_chat)}</td>

                    <td>
                      <span
                        className={layClassTrangThai(
                          danhMuc.trang_thai
                        )}
                      >
                        {hienThi(danhMuc.ten_trang_thai)}
                      </span>
                    </td>

                    <td>
                      <div className="cot-thao-tac">
                        <button
                          className="nut-cap-nhat"
                          type="button"
                          onClick={() => moCapNhat(danhMuc)}
                        >
                          Cập nhật
                        </button>

                        <button
                          className={layClassNutTrangThai(danhMuc)}
                          type="button"
                          onClick={() =>
                            xacNhanDoiTrangThai(danhMuc)
                          }
                        >
                          {layTenNutTrangThai(danhMuc)}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="bang-quan-ly bang-gon bang-nhu-cau-su-dung">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên nhu cầu</th>
                <th>Mô tả</th>
                <th>Số mẫu đang dùng</th>
                <th>Trạng thái</th>
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
                danhSachHienThi.map((nhuCau, index) => (
                  <tr key={nhuCau.id}>
                    <td>{viTriBatDau + index + 1}</td>
                    <td>{hienThi(nhuCau.ten_nhu_cau)}</td>
                    <td className="cot-mo-ta-nhu-cau">
                      {hienThi(nhuCau.mo_ta)}
                    </td>
                    <td>{Number(nhuCau.so_mau_dang_dung || 0)}</td>

                    <td>
                      <span
                        className={layClassTrangThai(
                          nhuCau.trang_thai
                        )}
                      >
                        {hienThi(nhuCau.ten_trang_thai)}
                      </span>
                    </td>

                    <td>
                      <div className="cot-thao-tac">
                        <button
                          className="nut-cap-nhat"
                          type="button"
                          onClick={() => moCapNhat(nhuCau)}
                        >
                          Cập nhật
                        </button>

                        <button
                          className={layClassNutTrangThai(nhuCau)}
                          type="button"
                          onClick={() =>
                            xacNhanDoiTrangThai(nhuCau)
                          }
                        >
                          {layTenNutTrangThai(nhuCau)}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

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

      {(cheDoPopup === "THEM" || cheDoPopup === "CAP_NHAT") && (
        <div className="popup-nen">
          <div className="popup-hop">
            <div className="popup-tieu-de">
              <h3>
                {cheDoPopup === "THEM" ? "Thêm" : "Cập nhật"}{" "}
                {tabDangChon === "DANH_MUC"
                  ? "danh mục thiết bị"
                  : "nhu cầu sử dụng"}
              </h3>
            </div>

            <div className="popup-noi-dung">
              <form onSubmit={guiForm}>
                {tabDangChon === "DANH_MUC" ? (
                  <>
                    <div className="o-form">
                      <label>Tên danh mục</label>

                      <input
                        value={formDanhMuc.ten_danh_muc}
                        onChange={(e) =>
                          setFormDanhMuc({
                            ...formDanhMuc,
                            ten_danh_muc: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="o-form">
                      <label>Tính chất</label>

                      <select
                        value={formDanhMuc.tinh_chat_id}
                        onChange={(e) =>
                          setFormDanhMuc({
                            ...formDanhMuc,
                            tinh_chat_id: e.target.value,
                          })
                        }
                      >
                        <option value="">
                          -- Chọn tính chất --
                        </option>

                        {danhSachTinhChat.map((tinhChat) => (
                          <option
                            key={tinhChat.id}
                            value={tinhChat.id}
                          >
                            {tinhChat.ten_danh_muc ||
                              tinhChat.ten_tinh_chat ||
                              tinhChat.ten}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="o-form">
                      <label>Tên nhu cầu</label>

                      <input
                        value={formNhuCau.ten_nhu_cau}
                        onChange={(e) =>
                          setFormNhuCau({
                            ...formNhuCau,
                            ten_nhu_cau: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="o-form">
                      <label>Mô tả</label>

                      <textarea
                        value={formNhuCau.mo_ta}
                        onChange={(e) =>
                          setFormNhuCau({
                            ...formNhuCau,
                            mo_ta: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                )}

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

                  <button
                    className="nut-huy"
                    type="button"
                    onClick={dongPopup}
                  >
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
                <button
                  className="nut-dong-y"
                  type="button"
                  onClick={popupXacNhan.hanhDong}
                >
                  Đồng ý
                </button>

                <button
                  className="nut-huy"
                  type="button"
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