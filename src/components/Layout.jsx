import Header from "./Header";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="bo-cuc">
      <Header />

      <div className="noi-dung">{children}</div>

      <Footer />
    </div>
  );
}

export default Layout;