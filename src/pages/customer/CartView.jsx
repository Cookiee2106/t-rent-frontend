import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DUONG_DAN_API } from "../../api/api";

function Cart() {
  const [danhSachItem, setDanhSachItem] = useState([]);
  const [danhSachItemDuocChon, setDanhSachItemDuocChon] = useState([]);
  const [duLieuSua, setDuLieuSua] = useState({});

  const [ngayNhanChung, setNgayNhanChung] = useState("");
  const [ngayTraChung, setNgayTraChung] = useState("");
  const [khaDungTheoItem, setKhaDungTheoItem] = useState({});

  const [dangTai, setDangTai] = useState(false);
  const [dangDatHang, setDangDatHang] = useState(false);
  const [dangCapNhatItemId, setDangCapNhatItemId] = useState("");
  const [dangCapNhatNgayChung, setDangCapNhatNgayChung] = useState(false);

  const [thongBao, setThongBao] = useState("");
  const [popupThongBao, setPopupThongBao] = useState("");

  function taoHeaderCoToken() {
    const token = localStorage.getItem("token");

    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  function moPopupLoi(noiDung) {
    setPopupThongBao(noiDung);
  }

  function dinhDangTien(giaTri) {
    return Number(giaTri || 0).toLocaleString("vi-VN") + " đ";
  }

  function layNgayInput(giaTri) {
    if (!giaTri) return "";
    return String(giaTri).slice(0, 10);
  }

  /*
  function layNgayHomNay() {
    const homNay = new Date();
    const nam = homNay.getFullYear();
    const thang = String(homNay.getMonth() + 1).padStart(2, "0");
    const ngay = String(homNay.getDate()).padStart(2, "0");

    return `${nam}-${thang}-${ngay}`;
  }
  */

  function layNgayMai() {
    const ngayMai = new Date();
    ngayMai.setDate(ngayMai.getDate() + 1);

    const nam = ngayMai.getFullYear();
    const thang = String(ngayMai.getMonth() + 1).padStart(2, "0");
    const ngay = String(ngayMai.getDate()).padStart(2, "0");

    return `${nam}-${thang}-${ngay}`;
  }

  function layNgaySauNgay(ngayText, soNgayCongThem) {
    const ngay = new Date(ngayText);
    ngay.setDate(ngay.getDate() + soNgayCongThem);

    const nam = ngay.getFullYear();
    const thang = String(ngay.getMonth() + 1).padStart(2, "0");
    const ngayTrongThang = String(ngay.getDate()).padStart(2, "0");

    return `${nam}-${thang}-${ngayTrongThang}`;
  }

  // const NGAY_BAT_DAU_DUOC_DAT = layNgayHomNay();
  const NGAY_BAT_DAU_DUOC_DAT = layNgayMai();

  function tinhSoNgayThue(ngayNhan, ngayTra) {
    if (!ngayNhan || !ngayTra) return 0;

    const batDau = new Date(ngayNhan);
    const ketThuc = new Date(ngayTra);

    const mocBatDau = new Date(
      batDau.getFullYear(),
      batDau.getMonth(),
      batDau.getDate()
    );

    const mocKetThuc = new Date(
      ketThuc.getFullYear(),
      ketThuc.getMonth(),
      ketThuc.getDate()
    );

    const soMsMotNgay = 24 * 60 * 60 * 1000;
    const soNgay = Math.round((mocKetThuc - mocBatDau) / soMsMotNgay);

    return soNgay < 1 ? 1 : soNgay;
  }

  function tinhTienThueTamTinh(item) {
    const duLieuItem = duLieuSua[item.id] || {};

    const soNgay = tinhSoNgayThue(
      duLieuItem.ngay_nhan || item.ngay_nhan,
      duLieuItem.ngay_tra || item.ngay_tra
    );

    return (
      Number(item.gia_thue_ngay_snapshot || 0) *
      Number(duLieuItem.so_luong || item.so_luong || 0) *
      soNgay
    );
  }

  function tinhTienCocTamTinh(item) {
    const duLieuItem = duLieuSua[item.id] || {};

    return (
      Number(item.tien_coc_snapshot || 0) *
      Number(duLieuItem.so_luong || item.so_luong || 0)
    );
  }

  function kiemTraNgayChung(ngayNhan, ngayTra) {
    if (!ngayNhan || !ngayTra) {
      return "Vui lòng chọn đủ ngày nhận và ngày trả";
    }

    if (
      ngayNhan < NGAY_BAT_DAU_DUOC_DAT ||
      ngayTra < NGAY_BAT_DAU_DUOC_DAT
    ) {
      return "Ngày nhận và ngày trả phải từ ngày mai trở đi";
    }

    if (new Date(ngayTra) <= new Date(ngayNhan)) {
      return "Ngày trả phải sau ngày nhận";
    }

    return "";
  }

  function kiemTraDuLieuItem(duLieuItem) {
    if (!duLieuItem) {
      return "Không tìm thấy sản phẩm cần cập nhật";
    }

    if (!duLieuItem.ngay_nhan || !duLieuItem.ngay_tra) {
      return "Vui lòng chọn đủ ngày nhận và ngày trả";
    }

    if (
      duLieuItem.ngay_nhan < NGAY_BAT_DAU_DUOC_DAT ||
      duLieuItem.ngay_tra < NGAY_BAT_DAU_DUOC_DAT
    ) {
      return "Ngày nhận và ngày trả phải từ ngày mai trở đi";
    }

    if (new Date(duLieuItem.ngay_tra) <= new Date(duLieuItem.ngay_nhan)) {
      return "Ngày trả phải sau ngày nhận";
    }

    if (Number(duLieuItem.so_luong) < 1) {
      return "Số lượng phải lớn hơn 0";
    }

    return "";
  }

  async function kiemTraKhaDungGioHang(
    ngayNhan,
    ngayTra,
    items,
    duLieuSuaHienTai
  ) {
    if (!ngayNhan || !ngayTra || items.length === 0) {
      return;
    }

    const ketQua = {};

    for (const item of items) {
      try {
        const soLuong = Number(
          duLieuSuaHienTai[item.id]?.so_luong || item.so_luong || 1
        );

        const phanHoi = await fetch(
          `${DUONG_DAN_API}/api/equipment-models/${item.mau_thiet_bi_id}?ngay_nhan=${ngayNhan}&ngay_tra=${ngayTra}&so_luong=${soLuong}`
        );

        const duLieu = await phanHoi.json();

        if (duLieu.success) {
          ketQua[item.id] = {
            co_the_thue: duLieu.data?.co_the_thue,
            so_luong_san_sang:
              duLieu.data?.so_luong_san_sang ||
              duLieu.data?.so_bo_san_sang ||
              duLieu.data?.so_luong_co_the_thue ||
              0,
            ly_do_khong_the_thue: duLieu.data?.ly_do_khong_the_thue || "",
          };
        } else {
          ketQua[item.id] = {
            co_the_thue: false,
            so_luong_san_sang: 0,
            ly_do_khong_the_thue: duLieu.message,
          };
        }
      } catch {
        ketQua[item.id] = {
          co_the_thue: false,
          so_luong_san_sang: 0,
          ly_do_khong_the_thue: "Không kiểm tra được khả dụng",
        };
      }
    }

    setKhaDungTheoItem(ketQua);
  }

  async function layGioHang() {
    try {
      setDangTai(true);
      setThongBao("");

      const token = localStorage.getItem("token");

      if (!token) {
        moPopupLoi("Vui lòng đăng nhập để xem giỏ hàng");
        setDangTai(false);
        return;
      }

      const phanHoi = await fetch(`${DUONG_DAN_API}/api/cart`, {
        headers: {
          ...taoHeaderCoToken(),
        },
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        const items = duLieu.data?.items || [];

        if (items.length === 0) {
          setDanhSachItem([]);
          setDuLieuSua({});
          setDanhSachItemDuocChon([]);
          setKhaDungTheoItem({});
          return;
        }

        const itemMoiNhat = items[0];

        const ngayNhanMoiNhat =
          layNgayInput(itemMoiNhat.ngay_nhan) || NGAY_BAT_DAU_DUOC_DAT;

        const ngayTraMoiNhat =
          layNgayInput(itemMoiNhat.ngay_tra) ||
          layNgaySauNgay(ngayNhanMoiNhat, 1);

        const duLieuSuaMoi = {};

        items.forEach((item) => {
          duLieuSuaMoi[item.id] = {
            so_luong: item.so_luong,
            ngay_nhan: ngayNhanMoiNhat,
            ngay_tra: ngayTraMoiNhat,
          };
        });

        setDanhSachItem(items);
        setDuLieuSua(duLieuSuaMoi);
        setDanhSachItemDuocChon(items.map((item) => item.id));
        setNgayNhanChung(ngayNhanMoiNhat);
        setNgayTraChung(ngayTraMoiNhat);

        kiemTraKhaDungGioHang(
          ngayNhanMoiNhat,
          ngayTraMoiNhat,
          items,
          duLieuSuaMoi
        );
      } else {
        moPopupLoi(duLieu.message);
      }
    } catch {
      moPopupLoi("Không kết nối được server");
    } finally {
      setDangTai(false);
    }
  }

  function chonTatCa() {
    if (danhSachItemDuocChon.length === danhSachItem.length) {
      setDanhSachItemDuocChon([]);
    } else {
      setDanhSachItemDuocChon(danhSachItem.map((item) => item.id));
    }
  }

  function doiTrangThaiChonItem(itemId) {
    if (danhSachItemDuocChon.includes(itemId)) {
      setDanhSachItemDuocChon(
        danhSachItemDuocChon.filter((id) => id !== itemId)
      );
    } else {
      setDanhSachItemDuocChon([...danhSachItemDuocChon, itemId]);
    }
  }

  function thayDoiNgayChung(tenTruong, giaTri) {
    if (tenTruong === "ngay_nhan") {
      setNgayNhanChung(giaTri);
    }

    if (tenTruong === "ngay_tra") {
      setNgayTraChung(giaTri);
    }

    setDuLieuSua((duLieuCu) => {
      const duLieuMoi = { ...duLieuCu };

      danhSachItem.forEach((item) => {
        duLieuMoi[item.id] = {
          ...duLieuMoi[item.id],
          [tenTruong]: giaTri,
        };
      });

      return duLieuMoi;
    });
  }

  async function capNhatItem(itemId, duLieuMoi = null) {
    try {
      setThongBao("");
      setDangCapNhatItemId(itemId);

      const duLieuItem = duLieuMoi || duLieuSua[itemId];
      const loi = kiemTraDuLieuItem(duLieuItem);

      if (loi) {
        moPopupLoi(loi);
        return;
      }

      const phanHoi = await fetch(`${DUONG_DAN_API}/api/cart/items/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...taoHeaderCoToken(),
        },
        body: JSON.stringify({
          so_luong: Number(duLieuItem.so_luong),
          ngay_nhan: duLieuItem.ngay_nhan,
          ngay_tra: duLieuItem.ngay_tra,
        }),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
      const duLieuSuaMoi = {
        ...duLieuSua,
        [itemId]: {
          so_luong: Number(duLieuItem.so_luong),
          ngay_nhan: duLieuItem.ngay_nhan,
          ngay_tra: duLieuItem.ngay_tra,
        },
      };

      setDuLieuSua(duLieuSuaMoi);

      const danhSachMoi = danhSachItem.map((item) =>
        item.id === itemId
          ? {
              ...item,
              so_luong: Number(duLieuItem.so_luong),
              ngay_nhan: duLieuItem.ngay_nhan,
              ngay_tra: duLieuItem.ngay_tra,
            }
          : item
      );

      setDanhSachItem(danhSachMoi);

      window.dispatchEvent(new Event("cap-nhat-gio-hang"));

      kiemTraKhaDungGioHang(
        ngayNhanChung,
        ngayTraChung,
        danhSachMoi,
        duLieuSuaMoi
      );
    } else {
      moPopupLoi(duLieu.message);
    }
    } finally {
      setDangCapNhatItemId("");
    }
  }

  async function capNhatNgayChoTatCa() {
    try {
      setDangCapNhatNgayChung(true);

      const loi = kiemTraNgayChung(ngayNhanChung, ngayTraChung);

      if (loi) {
        moPopupLoi(loi);
        return;
      }

      const duLieuSuaMoi = { ...duLieuSua };

      for (const item of danhSachItem) {
        const duLieuItem = {
          so_luong: Number(duLieuSua[item.id]?.so_luong || item.so_luong || 1),
          ngay_nhan: ngayNhanChung,
          ngay_tra: ngayTraChung,
        };

        const phanHoi = await fetch(
          `${DUONG_DAN_API}/api/cart/items/${item.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              ...taoHeaderCoToken(),
            },
            body: JSON.stringify(duLieuItem),
          }
        );

        const duLieu = await phanHoi.json();

        if (!duLieu.success) {
          moPopupLoi(duLieu.message);
          return;
        }

        duLieuSuaMoi[item.id] = duLieuItem;
      }

      const danhSachMoi = danhSachItem.map((item) => ({
        ...item,
        ngay_nhan: ngayNhanChung,
        ngay_tra: ngayTraChung,
      }));

      setDuLieuSua(duLieuSuaMoi);
      setDanhSachItem(danhSachMoi);

      window.dispatchEvent(new Event("cap-nhat-gio-hang"));

      kiemTraKhaDungGioHang(
        ngayNhanChung,
        ngayTraChung,
        danhSachMoi,
        duLieuSuaMoi
      );
    } catch {
      moPopupLoi("Không kết nối được server");
    } finally {
      setDangCapNhatNgayChung(false);
    }
  }

  async function capNhatSanPhamDaChonTruocKhiDatHang() {
    for (const itemId of danhSachItemDuocChon) {
      const duLieuItem = duLieuSua[itemId];
      const loi = kiemTraDuLieuItem(duLieuItem);

      if (loi) {
        throw new Error(loi);
      }

      const phanHoi = await fetch(`${DUONG_DAN_API}/api/cart/items/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...taoHeaderCoToken(),
        },
        body: JSON.stringify({
          so_luong: Number(duLieuItem.so_luong),
          ngay_nhan: ngayNhanChung,
          ngay_tra: ngayTraChung,
        }),
      });

      const duLieu = await phanHoi.json();

      if (!duLieu.success) {
        throw new Error(duLieu.message);
      }
    }
  }

  async function tangSoLuong(itemId) {
    const duLieuHienTai = duLieuSua[itemId];

    const duLieuMoi = {
      ...duLieuHienTai,
      so_luong: Number(duLieuHienTai.so_luong || 1) + 1,
    };

    await capNhatItem(itemId, duLieuMoi);
  }

  async function giamSoLuong(itemId) {
    const duLieuHienTai = duLieuSua[itemId];
    const soLuongMoi = Number(duLieuHienTai.so_luong || 1) - 1;

    if (soLuongMoi < 1) {
      return;
    }

    const duLieuMoi = {
      ...duLieuHienTai,
      so_luong: soLuongMoi,
    };

    await capNhatItem(itemId, duLieuMoi);
  }

  async function xoaItem(itemId) {
    try {
      const xacNhan = window.confirm("Bạn có chắc muốn xóa sản phẩm này không?");

      if (!xacNhan) {
        return;
      }

      const phanHoi = await fetch(`${DUONG_DAN_API}/api/cart/items/${itemId}`, {
        method: "DELETE",
        headers: {
          ...taoHeaderCoToken(),
        },
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        await layGioHang();

        window.dispatchEvent(new Event("cap-nhat-gio-hang"));
      } else {
        moPopupLoi(duLieu.message);
      }
    } catch {
      moPopupLoi("Không kết nối được server");
    }
  }

  async function datHang() {
    try {
      setDangDatHang(true);
      setThongBao("");

      if (danhSachItemDuocChon.length === 0) {
        moPopupLoi("Bạn vẫn chưa chọn sản phẩm nào để mua.");
        return;
      }

      const loiNgay = kiemTraNgayChung(ngayNhanChung, ngayTraChung);

      if (loiNgay) {
        moPopupLoi(loiNgay);
        return;
      }

      await capNhatSanPhamDaChonTruocKhiDatHang();

      const phanHoi = await fetch(`${DUONG_DAN_API}/api/cart/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...taoHeaderCoToken(),
        },
        body: JSON.stringify({
          item_ids: danhSachItemDuocChon,
        }),
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        const checkoutUrl = duLieu.data?.checkout_url;

        if (!checkoutUrl) {
          moPopupLoi("Không lấy được đường dẫn thanh toán");
          return;
        }

        window.location.href = checkoutUrl;
      } else {
        moPopupLoi(duLieu.message);
      }
    } catch (loi) {
      moPopupLoi(loi.message || "Không kết nối được server");
    } finally {
      setDangDatHang(false);
    }
  }

  useEffect(() => {
    layGioHang();
  }, []);

  const danhSachDaChon = danhSachItem.filter((item) =>
    danhSachItemDuocChon.includes(item.id)
  );

  const tongTienThue = danhSachDaChon.reduce((tong, item) => {
    return tong + tinhTienThueTamTinh(item);
  }, 0);

  const tongTienCoc = danhSachDaChon.reduce((tong, item) => {
    return tong + tinhTienCocTamTinh(item);
  }, 0);

  const daChonTatCa =
    danhSachItem.length > 0 &&
    danhSachItemDuocChon.length === danhSachItem.length;

  return (
    <div className="khung-trang khung-gio-hang-moi">
      <h2>Giỏ hàng</h2>

      {thongBao && <p className="thong-bao">{thongBao}</p>}

      {dangTai ? (
        <p className="thong-bao">Đang tải giỏ hàng...</p>
      ) : danhSachItem.length === 0 ? (
        <div className="gio-hang-trong">
          <p className="thong-bao">Giỏ hàng của bạn đang trống.</p>

          <Link to="/equipments">
            <button type="button">Tiếp tục thuê thiết bị</button>
          </Link>
        </div>
      ) : (
        <>
          <div className="khung-ngay-chung-gio-hang">
            <div className="nhom-ngay-chung-gio-hang">
              <label>
                Ngày nhận
                <input
                  type="date"
                  min={NGAY_BAT_DAU_DUOC_DAT}
                  value={ngayNhanChung}
                  onChange={(e) =>
                    thayDoiNgayChung("ngay_nhan", e.target.value)
                  }
                  onBlur={capNhatNgayChoTatCa}
                />
              </label>

              <label>
                Ngày trả
                <input
                  type="date"
                  min={NGAY_BAT_DAU_DUOC_DAT}
                  value={ngayTraChung}
                  onChange={(e) =>
                    thayDoiNgayChung("ngay_tra", e.target.value)
                  }
                  onBlur={capNhatNgayChoTatCa}
                />
              </label>

              {dangCapNhatNgayChung && <span>Đang cập nhật...</span>}
            </div>
          </div>

          <div className="tieu-de-gio-hang-moi">
            <div className="cot-check-gio-hang"></div>
            <div className="cot-san-pham">Sản phẩm</div>
            <div className="cot-don-gia">Đơn giá</div>
            <div className="cot-so-luong">Số lượng</div>
            <div className="cot-so-tien">Số tiền</div>
            <div className="cot-thao-tac">Thao tác</div>
          </div>

          <div className="danh-sach-gio-hang-moi">
            {danhSachItem.map((item) => {
              const duocChon = danhSachItemDuocChon.includes(item.id);
              const khaDung = khaDungTheoItem[item.id];

              return (
                <div className="dong-item-gio-hang" key={item.id}>
                  <div className="cot-check-gio-hang">
                    <input
                      type="checkbox"
                      checked={duocChon}
                      onChange={() => doiTrangThaiChonItem(item.id)}
                    />
                  </div>

                  <div className="cot-san-pham cot-san-pham-noi-dung">
                    <div className="anh-item-gio-hang">
                      {item.anh_url ? (
                        <img src={item.anh_url} alt={item.ten_mau} />
                      ) : (
                        <div className="khung-khong-anh">Không có ảnh</div>
                      )}
                    </div>

                    <div className="thong-tin-item-gio-hang">
                      <h3>
                        {item.ten_mau}
                      </h3>

                      <p>
                        Bộ có thể cho thuê:{" "}
                        <b>
                          {khaDung ? khaDung.so_luong_san_sang : "Đang kiểm tra"}
                        </b>
                      </p>
                    </div>
                  </div>

                  <div className="cot-don-gia cot-du-lieu-gio-hang">
                    <p>{dinhDangTien(item.gia_thue_ngay_snapshot)}/ngày</p>

                    <p className="tien-coc-item">
                      Cọc: {dinhDangTien(item.tien_coc_snapshot)}
                    </p>
                  </div>

                  <div className="cot-so-luong cot-du-lieu-gio-hang">
                    <div className="cum-so-luong-gio-hang">
                      <button
                        type="button"
                        onClick={() => giamSoLuong(item.id)}
                        disabled={dangCapNhatItemId === item.id}
                      >
                        -
                      </button>

                      <span>{duLieuSua[item.id]?.so_luong || item.so_luong}</span>

                      <button
                        type="button"
                        onClick={() => tangSoLuong(item.id)}
                        disabled={dangCapNhatItemId === item.id}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cot-so-tien cot-du-lieu-gio-hang">
                    <p className="tien-thue-item">
                      Thuê: {dinhDangTien(tinhTienThueTamTinh(item))}
                    </p>

                    <p className="tien-coc-item">
                      Cọc: {dinhDangTien(tinhTienCocTamTinh(item))}
                    </p>
                  </div>

                  <div className="cot-thao-tac cot-du-lieu-gio-hang">
                    <button
                      type="button"
                      className="nut-link-xoa"
                      onClick={() => xoaItem(item.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="chan-gio-hang-moi">
            <label className="chon-tat-ca-gio-hang">
              <input
                type="checkbox"
                checked={daChonTatCa}
                onChange={chonTatCa}
              />
              <span>Chọn tất cả ({danhSachItem.length})</span>
            </label>

            <div className="phai-chan-gio-hang">
              <div className="tong-tien-gio-hang">
                <p className="tong-tien-thue">
                  Tổng tiền thuê: <b>{dinhDangTien(tongTienThue)}</b>
                </p>

                <p className="tong-coc-can-thanh-toan">
                  Tổng tiền cọc cần thanh toán:{" "}
                  <b>{dinhDangTien(tongTienCoc)}</b>
                </p>
              </div>

              <button
                type="button"
                className="nut-dat-hang-gio-hang"
                onClick={datHang}
                disabled={dangDatHang}
              >
                {dangDatHang ? "Đang xử lý..." : "Đặt hàng"}
              </button>
            </div>
          </div>
        </>
      )}

    {popupThongBao && (
      <div className="popup-loi-overlay">
        <div className="popup-loi">
          <p>{popupThongBao}</p>

          <button type="button" onClick={() => setPopupThongBao("")}>
            OK
          </button>
        </div>
      </div>
    )}
    </div>
  );
}

export default Cart;