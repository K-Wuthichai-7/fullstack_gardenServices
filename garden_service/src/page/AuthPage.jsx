import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert, Card } from "react-bootstrap";
import axios from "axios";

const AuthPage = ({ closeModal }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    idCard_taxId: "",
    legal_entity: "",
    type_users: "general",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      if (isRegister) {
        await axios.post("http://localhost:3000/api/customers/register", formData);
        setMessage("Registration successful! Please login.");
      } else {
        const response = await axios.post("http://localhost:3000/api/login", {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("user", JSON.stringify(response.data));
        setMessage("Login successful!");
        if (response.data.message === "Login successful.") {
          setTimeout(() => {
            closeModal();
          }, 1000);
          window.location.reload();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <Container className="d-flex justify-content-center">
      <div style={{ width: "100%", maxWidth: "600px", padding: "10px",}}>
        <h2 className="text-center">{isRegister ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}</h2>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              {/* ประเภทผู้ใช้ */}
              <Form.Group className="mb-1">
                <Form.Label>ประเภทผู้ใช้</Form.Label>
                <Form.Select name="type_users" value={formData.type_users} onChange={handleChange}>
                  <option value="general">บุคคลทั่วไป</option>
                  <option value="legal_entity">นิติบุคคล</option>
                </Form.Select>
              </Form.Group>

              {/* ชื่อ - นามสกุล */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-1">
                    <Form.Label>ชื่อ</Form.Label>
                    <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-1">
                    <Form.Label>นามสกุล</Form.Label>
                    <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>

              {/* เบอร์โทร - ที่อยู่ */}
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-1">
                    <Form.Label>เบอร์โทร</Form.Label>
                    <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-1">
                    <Form.Label>ที่อยู่</Form.Label>
                    <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>

              {/* บัตรประชาชน / เลขภาษี - นิติบุคคล */}
              <Row>
             {formData.type_users === "legal_entity"?(
                 <Col md={6}>
                 <Form.Group className="mb-1">
                   <Form.Label>เลขประจำตัวผู้เสียภาษี</Form.Label>
                   <Form.Control type="text" name="idCard_taxId" value={formData.idCard_taxId} onChange={handleChange} required />
                 </Form.Group>
               </Col>
             ):(
              <>
              <Form.Group className="mb-1">
                   <Form.Label>เลขบัตรประชาชน</Form.Label>
                   <Form.Control type="text" name="idCard_taxId" value={formData.idCard_taxId} onChange={handleChange} required />
                 </Form.Group>
              </>
             )}
                {formData.type_users === "legal_entity" && (
                  <Col md={6}>
                    <Form.Group className="mb-1">
                      <Form.Label>ชื่อนิติบุคคล</Form.Label>
                      <Form.Control type="text" name="legal_entity" value={formData.legal_entity} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                )}
              </Row>
            </>
          )}

          {/* อีเมล - รหัสผ่าน */}
         
           
              <Form.Group className="mb-3">
                <Form.Label>อีเมล</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>รหัสผ่าน</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
              </Form.Group>
           
       

          <div className="d-grid">
            <Button variant="primary" type="submit">{isRegister ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}</Button>
          </div>
        </Form>

        <p className="mt-3 text-center">
          {isRegister ? "มีบัญชีอยู่แล้ว? " : "ยังไม่มีบัญชี? "}
          <Button variant="link" onClick={() => setIsRegister(!isRegister)} className="p-0">
            {isRegister ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </Button>
        </p>
      </div>
    </Container>
  );
};

export default AuthPage;
