// Import Header dùng ở đầu trang.
import Header from "./Header";

// Import Footer dùng ở cuối trang.
import Footer from "./Footer";

// Layout khách hàng bọc Header, nội dung chính và Footer.
function Layout({ children }) {
  return (
    <div className="bo-cuc">
      {/* Header dùng chung cho các trang khách hàng */}
      <Header />

      {/* Nội dung chính của từng trang */}
      <main className="noi-dung">{children}</main>

      {/* Footer dùng chung cho các trang khách hàng */}
      <Footer />
    </div>
  );
}

// Export Layout để App.jsx dùng.
export default Layout;