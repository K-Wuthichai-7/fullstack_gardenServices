import React from "react";
import { Nav } from "react-bootstrap";
import { FaTachometerAlt, FaMoneyCheck, FaUser } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="d-flex flex-column vh-100 p-3 text-white" style={{ width: "250px",background:'#131f30' }}>
      <h4 className="text-center">Admin Panel</h4>
      <hr />
      <Nav className="flex-column">
        <Nav.Link href="#" className="text-white sidebar-item">
          <FaTachometerAlt /> Dashboard
        </Nav.Link>
        <Nav.Link href="#" className="text-white sidebar-item">
          <FaMoneyCheck /> การชำระเงิน
        </Nav.Link>
        <Nav.Link href="#" className="text-white sidebar-item">
          <FaUser /> ผู้ใช้
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;

