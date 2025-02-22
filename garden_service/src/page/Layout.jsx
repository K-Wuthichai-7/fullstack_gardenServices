import { Outlet, useLocation } from "react-router-dom";
import Navbars from "../component/Navbars";
import Footer from "../component/Footer";

const Layout = () => {
  const location = useLocation();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbars />
      <div style={{ flex: 1 }}>
        <Outlet /> {/* ตรงนี้จะเป็นจุดที่เปลี่ยนเนื้อหาตามเส้นทาง */}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;