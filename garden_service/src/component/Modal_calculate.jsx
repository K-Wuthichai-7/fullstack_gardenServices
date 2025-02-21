import React, { useState, useEffect } from 'react';

const PaymentModal = ({ closeModal }) => {
  const [serviceType, setServiceType] = useState('');
  const [serviceTypeId, setServiceTypeId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [area, setArea] = useState('');
  const [serviceTypes, setServiceTypes] = useState([]);
  const [calculationResult, setCalculationResult] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');

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
                <button type="button" className="btn btn-primary" onClick={handlePayment}>ชำระเงิน</button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>คำนวณ</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {paymentModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">ชำระเงิน</h5>
                <button type="button" className="btn-close" onClick={() => setPaymentModal(false)}></button>
              </div>
              <div className='modal-body text-center'>
              <h4 style={{color:'#0061b1'}}>พร้อมเพย์</h4>
                  <span>บริษัท โกลเด้นริเวอร์ เซอร์วิส จำกัด</span><br />
              </div>
              <div className="modal-body text-center">
                <div className="qr-code-container">
                  {qrCodeData && (
                    <img 
                      src={`data:image/png;base64,${qrCodeData}`} 
                      alt="QR Code" 
                      style={{ maxWidth: '200px' }}
                    />
                  )}
                </div>
                <p>จำนวนเงิน: {calculationResult?.total_amount} บาท</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setPaymentModal(false)}>ปิด</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentModal;