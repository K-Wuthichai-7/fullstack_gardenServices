import React, { useState, useEffect } from 'react';
import PromtPay from './PromtPay'

const PaymentModal = ({ closeModal }) => {
  const [serviceType, setServiceType] = useState('');
  const [serviceTypeId, setServiceTypeId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [area, setArea] = useState('');
  const [serviceTypes, setServiceTypes] = useState([]);
  const [calculationResult, setCalculationResult] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

console.log(isLoggedIn,'isLoggedIn')

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/quotations/getService');
        const result = await response.json();
        setServiceTypes(result);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();

      // ตรวจสอบสถานะการล็อกอินจาก LocalStorage หรือ API
    const users = localStorage.getItem("user"); 
    if (users) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/quotations/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_type_id: serviceTypeId,
          quantity: quantity,
          area: area,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setCalculationResult(result);
        
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePayment = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/generate-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: calculationResult.total_amount,
          customerName: 'ลูกค้าทดสอบ',
          paymentId: Date.now().toString(),
        }),
      });
      
      const result = await response.json();
      if (response.ok) {
        setQrCodeData(result.qrCodeImage);
        setPaymentModal(true);
      
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handlePaymentClick = () => {
    if (!isLoggedIn) {
      alert("กรุณาเข้าสู่ระบบก่อนทำการชำระเงิน");
      // หรือ redirect ไปหน้า login เช่น window.location.href = "/login";
    } else {
      handlePayment();
    }
  };
 

  const uniqueServiceTypes = Array.from(new Set(serviceTypes.map((type) => type.type)));

  return (
    <>
      <div className="modal fade show" style={{ display: 'block' }} id="exampleModal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">คำนวณราคาเบื้องต้น</h5>
              <button type="button" className="btn-close" onClick={closeModal}></button>
            </div>
            <div className="modal-body">
              {calculationResult ? (
                <div>
                  <span>บริการ: {calculationResult.service_name}</span><br />
                  <span>จำนวนครั้ง: {calculationResult.quantity}</span><br />
                  <span>พื้นที่: {calculationResult.area} ตารางเมตร</span><br />
                  <span>ราคาต่อตารางเมตร: {calculationResult.unit_price} บาท</span><br />
                  <span>ราคาสุทธิ: {calculationResult.total_amount} บาท</span><br />
                </div>
              ) : (
                <form>
                  <div className="mb-3">
                    <label htmlFor="service_type" className="col-form-label">ประเภท</label>
                    <select
                      className="form-control"
                      id="service_type"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                    >
                      <option value="">เลือกประเภท</option>
                      {uniqueServiceTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="service_type_id" className="col-form-label">บริการ</label>
                    <select
                      className="form-control"
                      id="service_type_id"
                      value={serviceTypeId}
                      onChange={(e) => setServiceTypeId(e.target.value)}
                    >
                      <option value="">เลือกบริการ</option>
                      {serviceTypes
                        .filter((type) => type.type === serviceType)
                        .map((service) => (
                          <option key={service.service_type_id} value={service.service_type_id}>
                            {service.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="quantity" className="col-form-label">จำนวนครั้ง</label>
                    <input
                      type="number"
                      className="form-control"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="area" className="col-form-label">พื้นที่ (ตารางเมตร)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="area"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    />
                  </div>
                </form>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>ยกเลิก</button>
              {calculationResult ? (
                <button type="button" className="btn btn-primary" onClick={handlePaymentClick}>ชำระเงิน</button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>คำนวณ</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {paymentModal && (
      <PromtPay setPaymentModal={setPaymentModal} qrCodeData={qrCodeData} calculationResult={calculationResult}/>
      )}
    </>
  );
};

export default PaymentModal;