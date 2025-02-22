import React from "react";
import { Navbar, Nav, Container, Dropdown, Form, FormControl, InputGroup } from "react-bootstrap";
import { FaUserCircle, FaSearch } from "react-icons/fa";

const AdminNavbar = ({ searchTerm, setSearchTerm }) => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand href="#">Admin</Navbar.Brand>
        
        {/* Search Bar */}
        {/* <Form className="d-flex ms-auto">
          <InputGroup>
            <FormControl
              type="search"
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroup.Text style={{background:'#131f30'}}><FaSearch  style={{color:'#fefefe'}}/></InputGroup.Text>
          </InputGroup>
        </Form> */}
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
