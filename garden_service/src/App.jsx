import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./page/Layout";
import Carousel_img from "./component/Carousel_img";
import About from "./page/About";
import Customer from "./page/Customer";
import ServiceManager from "./page/ServiceManager";
import AdminPanel from "./page/AdminPanel";
import PaymentVerification from "./component/PaymentVerification";
import ServiceManagement from "./page/ServiceManager";
import CustomerManagement from "./page/CustomerManagement";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Carousel_img />} />
          <Route path="about" element={<About />} />
          <Route path="customer" element={<Customer />} />
          <Route path="service_manager" element={<ServiceManager />} />
          
          {/* แอดมิน */}
          <Route path="admin" element={<AdminPanel />}>
            <Route path="payments" element={<PaymentVerification />} />
            <Route path="serviceManager" element={<ServiceManagement />} />
            <Route path="CustomerManager" element={<CustomerManagement />} />
          </Route>

        </Route>
      </Routes>
    </Router>
  );
};

export default App;
