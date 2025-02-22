import React from "react";
import { useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { FaTachometerAlt,FaServicestack, FaMoneyCheck, FaUser } from "react-icons/fa";


const Sidebar = () => {

  const navigate = useNavigate();

  const toCustomerMeneger = () => navigate("CustomerManager")
  const toServiceManager = () => navigate("serviceManager")
  const toPayments = () => navigate("payments")
  return (
    <div className="d-flex flex-column vh-100 p-3 text-white" style={{ width: "250px",background:'#131f30' }}>
      <h4 className="text-center">Admin Panel</h4>
      <hr />
      <Nav className="flex-column">
        {/* <Nav.Link href="#" className="text-white sidebar-item">
          <FaTachometerAlt /> Dashboard
        </Nav.Link> */}
        <Nav.Link href="#" onClick={toPayments} className="text-white sidebar-item">
          <FaMoneyCheck /> การชำระเงิน
        </Nav.Link>
        <Nav.Link href="#" onClick={toServiceManager} className="text-white sidebar-item">
          <FaServicestack /> บริการ
        </Nav.Link>
        <Nav.Link href="#" onClick={toCustomerMeneger} className="text-white sidebar-item">
          <FaUser /> ผู้ใช้
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;

