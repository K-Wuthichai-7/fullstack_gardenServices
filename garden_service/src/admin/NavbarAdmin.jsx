import React from "react";
import { Navbar, Nav, Container, Dropdown, Form, FormControl, InputGroup } from "react-bootstrap";
import { FaUserCircle, FaSearch } from "react-icons/fa";

const AdminNavbar = ({ searchTerm, setSearchTerm }) => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand href="#">Admin Panel</Navbar.Brand>
        
        {/* Search Bar */}
        <Form className="d-flex ms-auto">
          <InputGroup>
            <FormControl
              type="search"
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroup.Text style={{background:'#131f30'}}><FaSearch  style={{color:'#fefefe'}}/></InputGroup.Text>
          </InputGroup>
        </Form>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                <FaUserCircle size={24} /> Admin
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#">Profile</Dropdown.Item>
                <Dropdown.Item href="#">Settings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="#">Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
