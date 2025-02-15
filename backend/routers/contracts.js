// routes/contracts.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');


// สร้างสัญญาบริการ
router.post('/create', async (req, res) => {
  const connection = await db.getConnection(); // สร้าง connection
  try {
    const { quotation_id, start_date, end_date, installments, payment_terms } = req.body;

    // ตรวจสอบว่ามีข้อมูลครบหรือไม่
    if (!quotation_id || !start_date || !end_date || !installments || !payment_terms) {
      return res.status(400).json({ message: 'กรุณาส่ง quotation_id, start_date, end_date, installments และ payment_terms' });
    }

    // ดึงข้อมูลใบเสนอราคา
    const [quotation] = await connection.execute(
      'SELECT customer_id, total_amount FROM quotations WHERE quotation_id = ? AND status = "pending"',
      [quotation_id]
    );

    if (quotation.length === 0) {
      return res.status(404).json({ message: 'ไม่พบใบเสนอราคาที่ถูกต้อง' });
    }

    const { customer_id, total_amount } = quotation[0];



    await connection.beginTransaction(); // เริ่ม transaction

    // สร้างสัญญา
    const [contract] = await connection.execute(
      'INSERT INTO service_contracts (quotation_id, customer_id, start_date, end_date, total_amount, installments, payment_terms) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [quotation_id, customer_id, start_date, end_date, total_amount, installments, payment_terms]
    );

    // อัปเดตสถานะใบเสนอราคา
    await connection.execute(
      'UPDATE quotations SET status = "accepted" WHERE quotation_id = ?',
      [quotation_id]
    );

    await connection.commit(); // ยืนยัน transaction

    res.status(201).json({
      contract_id: contract.insertId,
      total_amount,
      installments,
      message: 'สร้างสัญญาสำเร็จ'
    });

  } catch (error) {
    await connection.rollback(); // ยกเลิก transaction ถ้าเกิดข้อผิดพลาด
    res.status(500).json({ message: error.message });
  } finally {
    connection.release(); // ปล่อย connection
  }
});



  module.exports = router; // export router