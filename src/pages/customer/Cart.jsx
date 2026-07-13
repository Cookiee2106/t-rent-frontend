import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DUONG_DAN_API } from "../../api/api";

function Cart() {
  const [danhSachItem, setDanhSachItem] = useState([]);
  const [danhSachItemDuocChon, setDanhSachItemDuocChon] = useState([]);
  const [duLieuSua, setDuLieuSua] = useState({});
  const [dangTai, setDangTai] = useState(false);
  const [dangDatHang, setDangDatHang] = useState(false);
  const [dangCapNhatItemId, setDangCapNhatItemId] = useState("");
  const [thongBao, setThongBao] = useState("");

  function taoHeaderCoToken() {
    const token = localStorage.getItem("token");

    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };
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
    const soNgay = tinhSoNgayThue(item.ngay_nhan, item.ngay_tra);

    return (
      Number(item.gia_thue_ngay_snapshot || 0) *
      Number(item.so_luong || 0) *
      soNgay
    );
  }

  function tinhTienCocTamTinh(item) {
    return Number(item.tien_coc_snapshot || 0) * Number(item.so_luong || 0);
  }

  async function layGioHang() {
    try {
      setDangTai(true);
      setThongBao("");

      const token = localStorage.getItem("token");

      if (!token) {
        setThongBao("Vui lòng đăng nhập để xem giỏ hàng");
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

        const duLieuSuaMoi = {};

        items.forEach((item) => {
          duLieuSuaMoi[item.id] = {
            so_luong: item.so_luong,
            ngay_nhan: layNgayInput(item.ngay_nhan),
            ngay_tra: layNgayInput(item.ngay_tra),
          };
        });

        setDanhSachItem(items);
        setDuLieuSua(duLieuSuaMoi);
        setDanhSachItemDuocChon(items.map((item) => item.id));
      } else {
        setThongBao(duLieu.message);
      }
    } catch {
      setThongBao("Không kết nối được server");
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

  function thayDoiDuLieuSua(itemId, tenTruong, giaTri) {
    setDuLieuSua({
      ...duLieuSua,
      [itemId]: {
        ...duLieuSua[itemId],
        [tenTruong]: giaTri,
      },
    });
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

  function kiemTraCungNgayThue() {
    const danhSachDaChon = danhSachItem.filter((item) =>
      danhSachItemDuocChon.includes(item.id)
    );

    if (danhSachDaChon.length === 0) {
      return {
        hopLe: false,
        message: "Vui lòng chọn ít nhất một sản phẩm để đặt hàng",
      };
    }

    const itemDau = danhSachDaChon[0];
    const ngayNhanDau = duLieuSua[itemDau.id]?.ngay_nhan;
    const ngayTraDau = duLieuSua[itemDau.id]?.ngay_tra;

    for (const item of danhSachDaChon) {
      const duLieuItem = duLieuSua[item.id];
      const loi = kiemTraDuLieuItem(duLieuItem);

      if (loi) {
        return {
          hopLe: false,
          message: loi,
        };
      }

      const ngayNhan = duLieuItem.ngay_nhan;
      const ngayTra = duLieuItem.ngay_tra;

      if (ngayNhan !== ngayNhanDau || ngayTra !== ngayTraDau) {
        return {
          hopLe: false,
          message:
            "Các sản phẩm được chọn phải có cùng ngày nhận và ngày trả để tạo một đơn thuê",
        };
      }
    }

    return {
      hopLe: true,
      message: "",
    };
  }

  async function capNhatItem(itemId, duLieuMoi = null) {
    try {
      setThongBao("");
      setDangCapNhatItemId(itemId);

      const duLieuItem = duLieuMoi || duLieuSua[itemId];
      const loi = kiemTraDuLieuItem(duLieuItem);

      if (loi) {
        setThongBao(loi);
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
        await layGioHang();
      } else {
        setThongBao(duLieu.message);
      }
    } catch {
      setThongBao("Không kết nối được server");
    } finally {
      setDangCapNhatItemId("");
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
          ngay_nhan: duLieuItem.ngay_nhan,
          ngay_tra: duLieuItem.ngay_tra,
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

    setDuLieuSua({
      ...duLieuSua,
      [itemId]: duLieuMoi,
    });

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

    setDuLieuSua({
      ...duLieuSua,
      [itemId]: duLieuMoi,
    });

    await capNhatItem(itemId, duLieuMoi);
  }

  async function xoaItem(itemId) {
    try {
      const xacNhan = window.confirm("Bạn có chắc muốn xóa sản phẩm này không?");

      if (!xacNhan) {
        return;
      }

      setThongBao("");

      const phanHoi = await fetch(`${DUONG_DAN_API}/api/cart/items/${itemId}`, {
        method: "DELETE",
        headers: {
          ...taoHeaderCoToken(),
        },
      });

      const duLieu = await phanHoi.json();

      if (duLieu.success) {
        setThongBao("Xóa sản phẩm khỏi giỏ hàng thành công");
        layGioHang();
      } else {
        setThongBao(duLieu.message);
      }
    } catch {
      setThongBao("Không kết nối được server");
    }
  }

  async function datHang() {
    try {
      setDangDatHang(true);
      setThongBao("");

      const ketQuaKiemTra = kiemTraCungNgayThue();

      if (!ketQuaKiemTra.hopLe) {
        setThongBao(ketQuaKiemTra.message);
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
          setThongBao("Không lấy được đường dẫn thanh toán");
          return;
        }

        window.location.href = checkoutUrl;
      } else {
        setThongBao(duLieu.message);
      }
    } catch (loi) {
      setThongBao(loi.message || "Không kết nối được server");
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
    <div className="khung-trang">
      <h2>Giỏ hàng của tôi</h2>

      {thongBao && <p className="thong-bao">{thongBao}</p>}

      {dangTai ? (
        <p className="thong-bao">Đang tải giỏ hàng...</p>
      ) : danhSachItem.length === 0 ? (
        <div className="gio-hang-trong">
          <p className="thong-bao">Giỏ hàng của bạn đang trống.</p>

          <Link to="/equipments">
            <button>Tiếp tục thuê thiết bị</button>
          </Link>
        </div>
      ) : (
        <>
          <div className="hang-chon-gio-hang">
            <label>
              <input
                type="checkbox"
                checked={daChonTatCa}
                onChange={chonTatCa}
              />{" "}
              Chọn tất cả
            </label>

            <span>
              Đã chọn {danhSachItemDuocChon.length}/{danhSachItem.length} sản
              phẩm
            </span>
          </div>

          <div className="danh-sach-gio-hang">
            {danhSachItem.map((item) => {
              const duocChon = danhSachItemDuocChon.includes(item.id);
              const soNgay = tinhSoNgayThue(
                duLieuSua[item.id]?.ngay_nhan || item.ngay_nhan,
                duLieuSua[item.id]?.ngay_tra || item.ngay_tra
              );

              return (
                <div
                  className={
                    duocChon
                      ? "the-gio-hang the-gio-hang-duoc-chon"
                      : "the-gio-hang"
                  }
                  key={item.id}
                >
                  <div className="cot-chon-gio-hang">
                    <input
                      type="checkbox"
                      checked={duocChon}
                      onChange={() => doiTrangThaiChonItem(item.id)}
                    />
                  </div>

                  <div className="anh-gio-hang">
                    {item.anh_url ? (
                      <img src={item.anh_url} alt={item.ten_mau} />
                    ) : (
                      <div className="khung-khong-anh">Không có ảnh</div>
                    )}
                  </div>

                  <div className="noi-dung-gio-hang">
                    <h3>
                      {item.ten_hang} {item.ten_mau}
                    </h3>

                    <p>Danh mục: {item.ten_danh_muc || "Chưa phân loại"}</p>

                    <div className="hang-ngay-gio-hang">
                      <label>
                        Ngày nhận
                        <input
                          type="date"
                          min={NGAY_BAT_DAU_DUOC_DAT}
                          value={duLieuSua[item.id]?.ngay_nhan || ""}
                          onChange={(e) =>
                            thayDoiDuLieuSua(
                              item.id,
                              "ngay_nhan",
                              e.target.value
                            )
                          }
                          onBlur={() => capNhatItem(item.id)}
                        />
                      </label>

                      <label>
                        Ngày trả
                        <input
                          type="date"
                          min={NGAY_BAT_DAU_DUOC_DAT}
                          value={duLieuSua[item.id]?.ngay_tra || ""}
                          onChange={(e) =>
                            thayDoiDuLieuSua(
                              item.id,
                              "ngay_tra",
                              e.target.value
                            )
                          }
                          onBlur={() => capNhatItem(item.id)}
                        />
                      </label>
                    </div>

                    <p>Số ngày thuê: {soNgay}</p>

                    <div className="hang-so-luong-gio-hang">
                      <span>Số lượng:</span>

                      <button
                        disabled={dangCapNhatItemId === item.id}
                        onClick={() => giamSoLuong(item.id)}
                      >
                        -
                      </button>

                      <b>{duLieuSua[item.id]?.so_luong || item.so_luong}</b>

                      <button
                        disabled={dangCapNhatItemId === item.id}
                        onClick={() => tangSoLuong(item.id)}
                      >
                        +
                      </button>
                    </div>

                    <p>
                      Giá thuê/ngày:{" "}
                      {dinhDangTien(item.gia_thue_ngay_snapshot)}
                    </p>

                    <p>Tiền cọc/mẫu: {dinhDangTien(item.tien_coc_snapshot)}</p>

                    <div className="hang-tien-gio-hang">
                      <span>
                        Tạm tính thuê:{" "}
                        <b>{dinhDangTien(tinhTienThueTamTinh(item))}</b>
                      </span>

                      <span>
                        Tạm tính cọc:{" "}
                        <b>{dinhDangTien(tinhTienCocTamTinh(item))}</b>
                      </span>
                    </div>
                  </div>

                  <div className="cot-xoa-gio-hang">
                    <button className="nut-do" onClick={() => xoaItem(item.id)}>
                      Xóa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="thanh-tong-gio-hang">
            <div>
              <p>
                <b>Tổng tiền thuê:</b> {dinhDangTien(tongTienThue)}
              </p>

              <p>
                <b>Tổng tiền cọc cần thanh toán:</b>{" "}
                {dinhDangTien(tongTienCoc)}
              </p>
            </div>

            <div className="nhom-nut">
              <Link to="/equipments">
                <button>Tiếp tục thuê</button>
              </Link>

              <button onClick={datHang} disabled={dangDatHang}>
                {dangDatHang ? "Đang xử lý..." : "Đặt hàng"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;