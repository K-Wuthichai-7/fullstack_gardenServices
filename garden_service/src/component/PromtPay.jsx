import React, { useState,useEffect } from 'react';

const PromtPay = ({ setPaymentModal, qrCodeData, calculationResult }) => {
  const [slip, setSlip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState('');

  const handleFileChange = (event) => {
    setSlip(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!slip) {
      setMessage('กรุณาอัปโหลดสลิป');
      return;
    }

    const formData = new FormData();
    formData.append('customer_id', userData.user.id); // customer_id ที่ถูกต้อง
    formData.append('amount', calculationResult.total_amount);
    formData.append('slip', slip);

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/transactions/pay_and_upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('อัปโหลดสลิปสำเร็จ!');
        setTimeout(() => setPaymentModal(false), 2000);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error('Error uploading slip:', error);
      setMessage('เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
          const users = localStorage.getItem("user");
          if (users) {
              const parsedUser = JSON.parse(users);
              if (parsedUser.message === "Login successful.") {
                setUserData(parsedUser)
              }
          }
    }, []);

  return (
    <>
      <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">ชำระเงิน</h5>
              <button type="button" className="btn-close" onClick={() => setPaymentModal(false)}></button>
            </div>
            <div className="modal-body text-center">
              <h4 style={{ color: '#0061b1' }}>พร้อมเพย์</h4>
              <span>บริษัท โกลเด้นริเวอร์ เซอร์วิส จำกัด</span><br />
            </div>
            <div className="modal-body text-center">
              {qrCodeData && (
                <img src={`data:image/png;base64,${qrCodeData}`} alt="QR Code" style={{ maxWidth: '200px' }} />
              )}
              <p>จำนวนเงิน: {calculationResult?.total_amount} บาท</p>

              <input type="file" className="form-control mt-3" onChange={handleFileChange} accept="image/*" />
              {message && <p className="text-primary">{message}</p>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setPaymentModal(false)}>ปิด</button>
              <button type="button" className="btn btn-success" onClick={handleUpload} disabled={loading}>
                {loading ? 'กำลังอัปโหลด...' : 'อัปโหลดสลิป'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PromtPay;
