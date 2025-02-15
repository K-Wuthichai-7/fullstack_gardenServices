// routes/customers.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM customers');
    
    if (rows.length > 0) {
      res.json(rows); // ✅ ส่งคืนลูกค้าทุกคน
    } else {
      res.status(404).json({ message: 'No customers found' });
    }
  } catch (error) {
    console.error(error); // ✅ Log error เพื่อ debug
    res.status(500).json({ message: error.message });
  }
});



router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM customers WHERE customer_id = ?', [req.params.id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.post('/register', async (req, res) => {
  const connection = await db.getConnection(); // 🔹 ใช้ connection แยก
  try {
    const { 
      customer: { first_name, last_name, phone, email, address },
      garden: { area_size, garden_type, special_requirements }
    } = req.body;
    
    await connection.beginTransaction(); // ✅ ใช้ connection.beginTransaction()
    
    // บันทึกข้อมูลลูกค้า
    const [customerResult] = await connection.execute(
      'INSERT INTO customers (first_name, last_name, phone, email, address) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, phone, email, address]
    );
    
    // บันทึกข้อมูลสวน
    await connection.execute(
      'INSERT INTO garden_details (customer_id, area_size, garden_type, special_requirements) VALUES (?, ?, ?, ?)',
      [customerResult.insertId, area_size, garden_type, special_requirements]
    );
    
    await connection.commit(); // ✅ ใช้ connection.commit()
    res.status(201).json({ 
      message: 'Customer and garden details registered successfully',
      customer_id: customerResult.insertId
    });
  } catch (error) {
    await connection.rollback(); // ✅ ใช้ connection.rollback() แทน
    res.status(500).json({ message: error.message });
  } finally {
    connection.release(); // ✅ คืน connection กลับไปที่ pool
  }
});


router.put('/:id', async (req, res) => {
  const connection = await db.getConnection(); // ใช้ connection เฉพาะ
  try {
    const customerId = req.params.id; // ได้รับ `id` จาก URL parameter
    const { 
      customer: { first_name, last_name, phone, email, address },
      garden: { area_size, garden_type, special_requirements }
    } = req.body; // รับข้อมูลลูกค้าและสวนที่ต้องการอัปเดต

    // ตรวจสอบว่ามีลูกค้าในระบบหรือไม่
    const [existingCustomer] = await connection.execute(
      'SELECT * FROM customers WHERE customer_id = ?', [customerId]
    );
    
    if (existingCustomer.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // เริ่มต้น transaction
    await connection.beginTransaction();

    // อัปเดตข้อมูลลูกค้า
    await connection.execute(
      'UPDATE customers SET first_name = ?, last_name = ?, phone = ?, email = ?, address = ? WHERE customer_id = ?',
      [first_name, last_name, phone, email, address, customerId]
    );

    // อัปเดตข้อมูลสวน
    await connection.execute(
      'UPDATE garden_details SET area_size = ?, garden_type = ?, special_requirements = ? WHERE customer_id = ?',
      [area_size, garden_type, special_requirements, customerId]
    );
    
    // คอมมิตการอัปเดต
    await connection.commit();

    res.status(200).json({ message: 'Customer and garden details updated successfully' });
  } catch (error) {
    await connection.rollback(); // ย้อนกลับหากเกิดข้อผิดพลาด
    res.status(500).json({ message: error.message });
  } finally {
    connection.release(); // คืน connection กลับ pool
  }
});




module.exports = router; // export router