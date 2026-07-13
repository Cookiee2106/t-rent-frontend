import Header from "./Header";
import Footer from "./Footer";

function Layout({ children }) {
  return (
    <div className="bo-cuc">
      <Header />
      <main className="noi-dung">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;