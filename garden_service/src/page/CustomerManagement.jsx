import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Container, Form, Row, Col,Pagination } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    type_users: "general",
    first_name: "", last_name: "", phone: "", email: "", address: "",
    idCard_taxId: "", legal_entity: "", password: ""
  });
  const [filterType, setFilterType] = useState("general"); // To filter customers based on type
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleShowModal = (customer = null) => {
    setEditingCustomer(customer);
    setFormData(customer || {
      type_users: "general",
      first_name: "", last_name: "", phone: "", email: "", address: "",
      idCard_taxId: "", legal_entity: "", password: ""
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (editingCustomer) {
  //       await axios.put(`http://localhost:3000/api/customers/update/${editingCustomer.customer_id}`, formData);
  //     } else {
  //       await axios.post("http://localhost:3000/api/customers/register", formData);
  //     }

  //       if (response.data.message) {
  //             Swal.fire({
  //               title: "สำเร็จ!",
  //               text: response.data.message,
  //               icon: "success",
  //               confirmButtonText: "ตกลง",
  //               width: "380px",
  //             });
  //       }

  //     fetchCustomers();
  //     setShowModal(false);
  //   } catch (error) {
  //     console.error("Error saving customer:", error);
  //     Swal.fire({
  //             title: "เกิดข้อผิดพลาด!",
  //             text: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
  //             icon: "error",
  //             confirmButtonText: "ตกลง",
  //             width: "300px",
  //           });
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingCustomer) {
        response = await axios.put(
          `http://localhost:3000/api/customers/update/${editingCustomer.customer_id}`,
          formData
        );
      } else {
        response = await axios.post("http://localhost:3000/api/customers/register", formData);
      }
  
      // ตรวจสอบว่ามี response และมี message หรือไม่
      if (response?.data?.message) {
        Swal.fire({
          title: "สำเร็จ!",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "ตกลง",
          width: "380px",
        });
      }
  
      fetchCustomers();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving customer:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
        width: "300px",
      });
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`http://localhost:3000/api/customers/delete/${id}`);
        fetchCustomers();
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  // Filter customers based on the selected type
  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${customer.first_name || ""} ${customer.last_name || ""}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesType =
      filterType === "all" || customer.type_users === filterType;

    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Container className="p-4">
   
     <Row>
       <Col md={3}>
       <Form.Control
        type="text"
        placeholder="Search customers..."
        className="mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        
      />
        </Col>
     </Row>
      {/* Filter buttons */}
      <div className="mb-3">
        <Button className="mx-2" variant="primary" onClick={() => handleShowModal()}>เพิ่มข้อมูลลูกค้า</Button>
        <Button className="mx-2" variant="warning" onClick={() => setFilterType("general")}>บุคคลทั่วไป</Button>{' '}
        <Button className="mx-2" variant="warning" onClick={() => setFilterType("legal_entity")}>นิติบุคคล</Button>
      </div>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>ID Card / Tax ID</th>
            <th>Legal Entity Name</th>
          
            <th>Type of User</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {paginatedCustomers.map((customer, index) => (
            <tr key={customer.customer_id}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{customer.first_name} {customer.last_name}</td>
              <td>{customer.phone}</td>
              <td>{customer.email}</td>
              <td>{customer.address}</td>
              <td>{customer.idCard_taxId}</td>
              <td>{customer.type_users === "legal_entity" ? customer.legal_entity : "N/A"}</td>
              <td>{customer.type_users === 'general' ? 'General' : 'Legal Entity'}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleShowModal(customer)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(customer.customer_id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingCustomer ? "Edit Customer" : "Add Customer"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type of User</Form.Label>
                  <Form.Select name="type_users" value={formData.type_users} onChange={handleChange}>
                    <option value="general">General</option>
                    <option value="legal_entity">Legal Entity</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                </Form.Group>
                {formData.type_users === "general" ? (
                  <Form.Group className="mb-3">
                    <Form.Label>ID Card</Form.Label>
                    <Form.Control type="text" name="idCard_taxId" value={formData.idCard_taxId} onChange={handleChange} required />
                  </Form.Group>
                ) : (
                  <Form.Group className="mb-3">
                    <Form.Label>Tax ID</Form.Label>
                    <Form.Control type="text" name="idCard_taxId" value={formData.idCard_taxId} onChange={handleChange} required />
                  </Form.Group>
                )}
              </Col>
              <Col md={6}>
                {formData.type_users === "legal_entity" && (
                  <Form.Group className="mb-3">
                    <Form.Label>Legal Entity Name</Form.Label>
                    <Form.Control type="text" name="legal_entity" value={formData.legal_entity} onChange={handleChange} required />
                  </Form.Group>
                )}
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Pagination className="justify-content-center">
        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
    </Container>
  );
};

export default CustomerManagement;
