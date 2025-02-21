import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Sidebar from "../admin/Sidebar";
import AdminNavbar from "../admin/NavbarAdmin";

const AdminPanel = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={2} className="p-0">
          <Sidebar />
        </Col>
        <Col md={10} className="p-0">
          <AdminNavbar />
          <Outlet /> {/* เนื้อหาจะเปลี่ยนตาม Route */}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPanel;
