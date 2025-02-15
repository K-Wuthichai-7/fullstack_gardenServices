import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./page/Layout";
import Carousel_img from "./component/Carousel_img";
import About from "./page/About";
import Customer from "./page/Customer";
import ServiceManager from "./page/ServiceManager";


const App = () => {
  return (
    <Router>
      <Routes>
          {/* Route แม่ */}
        <Route path="/" element={<Layout />}>
            {/* Route ลูก */}
          <Route index element={<Carousel_img />} /> 
          <Route path="about" element={<About />} /> 
          <Route path="customer" element={<Customer />} /> 
          <Route path="service_manager" element={<ServiceManager />} /> 
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
