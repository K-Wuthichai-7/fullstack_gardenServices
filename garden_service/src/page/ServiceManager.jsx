import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";


const ServiceManagement = () => {
    

  const [services, setServices] = useState([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    base_price: ""
  });

  // ดึงข้อมูลบริการ
  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/services");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // เปิด/ปิด Modal
  const handleShow = (service = null) => {
    setShow(true);
    if (service) {
      setEditing(service.service_type_id);
      setFormData(service);
    } else {
      setEditing(null);
      setFormData({ name: "", description: "", type: "", base_price: "" });
    }
  };
  const handleClose = () => setShow(false);

  // จัดการฟอร์มการเปลี่ยนค่า
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ส่งข้อมูลเพิ่ม/แก้ไขบริการ
//   const handleSubmit = async () => {
//     try {
//       if (editing) {
//         // อัปเดตบริการ
//         await axios.put(`http://localhost:3000/api/services/updateService/${editing}`, formData);
//       } else {
//         // เพิ่มบริการใหม่
//         await axios.post("http://localhost:3000/api/services/createService", formData);
//       }
//       fetchServices();
//       handleClose();
//     } catch (error) {
//       console.error("Error saving service:", error);
//     }
//   };

const handleSubmit = async () => {
    try {
      let response;
      if (editing) {
        // อัปเดตบริการ
        response = await axios.put(`http://localhost:3000/api/services/updateService/${editing}`, formData);
      } else {
        // เพิ่มบริการใหม่
        response = await axios.post("http://localhost:3000/api/services/createService", formData);
      }
  
      if (response.data.message) {
        Swal.fire({
          title: "สำเร็จ!",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "ตกลง",
          width: "380px", // กำหนดขนาดให้เล็กลง
        });
      }
  
      fetchServices();
      handleClose();
    } catch (error) {
      console.error("Error saving service:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
        width: "300px", // กำหนดขนาดให้เล็กลง
      });
    }
  };
  // ลบบริการ
  const handleDelete = async (id) => {
    if (window.confirm("คุณต้องการลบบริการนี้ใช่หรือไม่?")) {
      try {
        await axios.delete(`http://localhost:3000/api/services/deleteService/${id}`);
        fetchServices();
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  return (
   <>
    <div className="container mt-4">
      <h2>จัดการบริการ</h2>
      <Button variant="primary" onClick={() => handleShow()}>
        + เพิ่มบริการ
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>ชื่อบริการ</th>
            <th>รายละเอียด</th>
            <th>ประเภท</th>
            <th>ราคา</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => (
            <tr key={service.service_type_id}>
              <td>{index + 1}</td>
              <td>{service.name}</td>
              <td>{service.description}</td>
              <td>{service.type}</td>
              <td>{service.base_price} บาท</td>
              <td style={{display:'flex'}}>
                <Button className="me-2" variant="warning" size="sm" onClick={() => handleShow(service)}>แก้ไข</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(service.service_type_id)}>ลบ</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal สำหรับเพิ่ม/แก้ไขบริการ */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "แก้ไขบริการ" : "เพิ่มบริการใหม่"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>ชื่อบริการ</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>รายละเอียด</Form.Label>
              <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>ประเภท</Form.Label>
              <Form.Control type="text" name="type" value={formData.type} onChange={handleChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>ราคา</Form.Label>
              <Form.Control type="number" name="base_price" value={formData.base_price} onChange={handleChange} required />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ยกเลิก
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editing ? "อัปเดต" : "เพิ่ม"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
   </>
  );
};

export default ServiceManagement;
