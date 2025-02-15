import React, { useState, useEffect } from 'react';

const Modal_calculate = ({ closeModal }) => {
  const [serviceType, setServiceType] = useState('');
  const [serviceTypeId, setServiceTypeId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [area, setArea] = useState('');
  const [serviceTypes, setServiceTypes] = useState([]); // เก็บข้อมูลประเภทบริการ
  const [calculationResult, setCalculationResult] = useState(null); // เก็บผลคำนวณ

  useEffect(() => {
    // ดึงข้อมูลประเภทและบริการจาก API
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/quotations/getService');
        const result = await response.json(); // สมมติว่า API ส่งข้อมูลเป็น JSON
        setServiceTypes(result); // กำหนดให้ข้อมูลประเภทบริการ
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []); // ทำการดึงข้อมูลเมื่อ component ถูก mount

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/quotations/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_type_id: serviceTypeId,
          quantity: quantity,
          area: area,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setCalculationResult(result); // กำหนดผลลัพธ์ที่คำนวณได้
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // กรองประเภทบริการที่ไม่ซ้ำ
  const uniqueServiceTypes = Array.from(new Set(serviceTypes.map((type) => type.type)));

  return (
    <div className="modal fade show" style={{ display: 'block' }} id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">คำนวณราคาเบื้องต้น</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            {/* แสดงผลการคำนวณ */}
            {calculationResult ? (
              <div>
                <span>บริการ: {calculationResult.service_name}</span><br/>
                <span>จำนวนครั้ง: {calculationResult.quantity}</span><br/>
                <span>พื้นที่: {calculationResult.area} ตารางเมตร</span><br/>
                <span>ราคาต่อตารางเมตร: {calculationResult.unit_price} บาท</span><br/>
                <span>ราคาสุทธิ: {calculationResult.total_amount} บาท</span><br/>
              </div>
            ) : (
              <form>
                {/* Dropdown for Service Type */}
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
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropdown for Service */}
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
                      .filter((type) => type.type === serviceType) // กรองให้แสดงเฉพาะบริการที่ตรงกับประเภท
                      .map((service) => (
                        <option key={service.service_type_id} value={service.service_type_id}>
                          {service.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* จำนวนครั้ง */}
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

                {/* พื้นที่ */}
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
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              ยกเลิก
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              คำนวณ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal_calculate;
