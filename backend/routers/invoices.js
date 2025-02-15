// routes/invoices.js

const express = require('express');
const router = express.Router();
const db = require('../config/db');


// สร้างและจัดการใบเสร็จ
router.post('/create', async (req, res) => {
  const connection = await db.getConnection(); // สร้าง connection
  try {
    const { contract_id, amount, payment_method } = req.body;

    // ดึงข้อมูลสัญญา
    const [contract] = await connection.execute(
      'SELECT customer_id, total_amount, amount_paid, price_per_installment FROM service_contracts WHERE contract_id = ?',
      [contract_id]
    );

    if (!contract.length) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลสัญญา' });
    }

    const { customer_id, total_amount, amount_paid, price_per_installment } = contract[0];

    // คำนวณยอดที่ค้างชำระ
    const remaining_amount = total_amount - amount_paid;
    // คำนวณจำนวนงวดที่เหลือ
    const remaining_installments = Math.ceil(remaining_amount / price_per_installment);

    // สร้างใบแจ้งหนี้
    await connection.beginTransaction(); // เริ่ม transaction

    // สร้างใบแจ้งหนี้
    const [invoice] = await connection.execute(
      'INSERT INTO invoices (contract_id, customer_id, amount, payment_method, payment_status, remaining_amount, remaining_installments) VALUES (?, ?, ?, ?, "pending", ?, ?)',
      [contract_id, customer_id, amount, payment_method, remaining_amount, remaining_installments]
    );

    // ถ้าชำระครบ (ยอดที่ชำระ = ยอดคงเหลือ)
    if (remaining_amount <= (amount_paid + amount)) {
      // อัปเดตสถานะสัญญาเป็น "เสร็จสิ้น"
      await connection.execute(
        'UPDATE service_contracts SET status = "completed" WHERE contract_id = ?',
        [contract_id]
      );

      // อัปเดตสถานะใบแจ้งหนี้เป็น "paid"
      await connection.execute(
        'UPDATE invoices SET payment_status = "paid" WHERE invoice_id = ?',
        [invoice.insertId]
      );
    }

    await connection.commit(); // ยืนยัน transaction

    res.status(201).json({
      invoice_id: invoice.insertId,
      message: 'สร้างใบแจ้งหนี้สำเร็จ',
      remaining_amount,
      remaining_installments
    });
  } catch (error) {
    await connection.rollback(); // ยกเลิก transaction ถ้ามีข้อผิดพลาด
    res.status(500).json({ message: error.message });
  } finally {
    connection.release(); // ปล่อย connection
  }
});

  

  module.exports = router; // export router