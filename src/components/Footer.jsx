import { Link } from "react-router-dom";

function Footer() {
  const namHienTai = new Date().getFullYear();

  return (
    <footer className="chan-trang-dang-luoi">
      <div className="chan-trang-noi-dung">
        <div className="chan-trang-luoi">
          <section className="cot-chan-trang cot-thuong-hieu">
            <div className="logo-chan-trang">
              <h2>T-Rent</h2>
            </div>

            <p className="mo-ta-chan-trang">
              Dịch vụ cho thuê máy ảnh, ống kính và thiết bị quay chụp phù hợp
              cho nhiều nhu cầu.
            </p>
          </section>

          <section className="cot-chan-trang">
            <h3>Khám phá</h3>

            <nav className="danh-sach-lien-ket-chan-trang">
              <Link to="/">Trang chủ</Link>
              <Link to="/equipments">Mẫu thiết bị</Link>
              <a href="/#quy-trinh-thue">Quy trình thuê</a>
            </nav>
          </section>

          <section className="cot-chan-trang">
            <h3>Hỗ trợ và quy chế</h3>

            <div className="danh-sach-lien-ket-chan-trang">
              {/* <a href="/#quy-che-dat-coc">Quy chế đặt cọc</a>
              <a href="/#chinh-sach-den-bu">Chính sách đền bù</a> */}
              <a href="tel:0901234567">Hotline hỗ trợ</a>
            </div>
          </section>

          <section className="cot-chan-trang">
            <h3>Liên hệ showroom</h3>

            <div className="danh-sach-lien-he-chan-trang">
              <p>
                <span aria-hidden="true">⌖</span>
                <span>Số 18, Đường 3/2, Quận 10, TP. Hồ Chí Minh</span>
              </p>

              <p>
                <span aria-hidden="true">☎</span>
                <a href="tel:0901234567">090 123 4567</a>
              </p>

              <p>
                <span aria-hidden="true">✉</span>
                <a href="mailto:contact@t-rent.vn">contact@t-rent.vn</a>
              </p>
            </div>
          </section>
        </div>

        <div className="chan-trang-duoi">
          <p>
            © {namHienTai} T-Rent. Website cho thuê máy ảnh và thiết bị quay chụp.
          </p>

          <div className="lien-ket-phu-chan-trang">
            <a href="#" aria-label="Facebook T-Rent">
              Facebook
            </a>

            <a href="#" aria-label="YouTube T-Rent">
              YouTube
            </a>

            <span>Yên tâm thuê máy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;