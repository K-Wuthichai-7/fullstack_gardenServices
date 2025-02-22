// routes/customers.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

const bcrypt = require('bcryptjs');


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
    const { first_name, last_name, phone, email, address, idCard_taxId, legal_entity, password, type_users } = req.body;

    // เข้ารหัสรหัสผ่านก่อนบันทึกลงฐานข้อมูล
    const hashedPassword = await bcrypt.hash(password, 10); // ใช้ salt รอบละ 10

    await connection.beginTransaction();
    
    const [result] = await connection.query(
      'INSERT INTO customers (first_name, last_name, phone, email, address, idCard_taxId, legal_entity, password, type_users) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, phone, email, address, idCard_taxId, legal_entity, hashedPassword, type_users]
    );
    
    await connection.commit();
    res.status(201).json({ message: 'Customer registered successfully', customer_id: result.insertId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});




router.put('/update/:id', async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, email, address, idCard_taxId, legal_entity, password, type_users } = req.body;

    await connection.beginTransaction();

    // ดึงข้อมูลปัจจุบันของลูกค้า
    const [customer] = await connection.query('SELECT password FROM customers WHERE customer_id = ?', [id]);
    if (customer.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Customer not found' });
    }

    // เข้ารหัสรหัสผ่านใหม่ถ้ามีการเปลี่ยนแปลง
    let hashedPassword = customer[0].password; // ใช้รหัสผ่านเดิมหากไม่มีการเปลี่ยน
    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    // อัปเดตข้อมูลลูกค้า
    const [result] = await connection.query(
      'UPDATE customers SET first_name = ?, last_name = ?, phone = ?, email = ?, address = ?, idCard_taxId = ?, legal_entity = ?, password = ?, type_users = ? WHERE customer_id = ?',
      [first_name, last_name, phone, email, address, idCard_taxId, legal_entity, hashedPassword, type_users, id]
    );

    await connection.commit();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer updated successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

router.delete('/delete/:id', async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { id } = req.params;
    await connection.beginTransaction();
    
    const [result] = await connection.query('DELETE FROM customers WHERE customer_id =?', [id]);
    
    await connection.commit();
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});





module.exports = router; // export router