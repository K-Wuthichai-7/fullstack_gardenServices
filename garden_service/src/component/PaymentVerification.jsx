import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Image, Container, Pagination } from "react-bootstrap";
import axios from "axios";

const PaymentVerification = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/payments/paymentDetail");
      setPayments(response.data.transactions);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const confirmPayment = async (paymentId) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/payments/verify/${paymentId}`, {
        status: "confirmed",
      });

      if (response.data.success) {
        alert("ยืนยันการชำระเงินสำเร็จ!");
        fetchData();
        if (response.data.contract_url) {
          window.open(`${response.data.contract_url}`, "_blank"); 
        }
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
    }
  };

  const rejectPayment = async (paymentId) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/payments/verify/${paymentId}`, {
        status: "rejected",
      });

      if (response.data.success) {
        alert("ปฏิเสธการชำระเงินเรียบร้อย!");
        fetchData();
      }
    } catch (error) {
      console.error("Error rejecting payment:", error);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const fullName = `${payment.first_name || ""} ${payment.last_name || ""}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amount.toString().includes(searchTerm);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  return (
    <Container className="p-4">
      <h2>ตรวจสอบการชำระเงิน</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>ชื่อผู้ใช้</th>
            <th>จำนวนเงิน</th>
            <th>วันที่ชำระ</th>
            <th>สลิป</th>
            <th>สถานะ</th>
            <th>การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {currentPayments.map((payment, index) => (
            <tr key={payment.id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{payment.first_name + " " + payment.last_name}</td>
              <td>{payment.amount} บาท</td>
              <td>{new Date(payment.created_at).toLocaleString()}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => {
                    setSelectedSlip(payment.slip_url);
                    setShowModal(true);
                  }}
                >
                  ดูสลิป
                </Button>
              </td>
              <td>{payment.status}</td>
              <td>
                <Button variant="success" size="sm" onClick={() => confirmPayment(payment.payment_id)}>
                  ✅ ยืนยัน
                </Button>
                <Button variant="danger" size="sm" className="ms-2" onClick={() => rejectPayment(payment.payment_id)}>
                  ❌ ปฏิเสธ
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    

      {/* Modal แสดงสลิป */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>สลิปการโอน</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center" }}>
          {selectedSlip && <Image src={selectedSlip} alt="slip" style={{ maxHeight: "350px" }} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>

        
      {/* Pagination */}
      <Pagination>
        <Pagination.Prev 
          onClick={() => setCurrentPage(currentPage - 1)} 
          disabled={currentPage === 1} 
        />
        {[...Array(totalPages).keys()].map((number) => (
          <Pagination.Item 
            key={number + 1} 
            active={number + 1 === currentPage} 
            onClick={() => setCurrentPage(number + 1)}
          >
            {number + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next 
          onClick={() => setCurrentPage(currentPage + 1)} 
          disabled={currentPage === totalPages} 
        />
      </Pagination>
    </Container>
  );
};

export default PaymentVerification;
