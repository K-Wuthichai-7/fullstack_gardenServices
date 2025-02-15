// routes/quotations.js

const express = require('express');
const router = express.Router();
const db = require('../config/db');


//สร้างใบเสนอราคา
router.post('/auto-generate', async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { customer_id, service_type_id, quantity } = req.body;

    // ตรวจสอบว่าข้อมูลถูกส่งมาครบหรือไม่
    if (!customer_id || !service_type_id || !quantity) {
      return res.status(400).json({ message: 'กรุณาส่ง customer_id, service_type_id และ quantity' });
    }

    // ดึงข้อมูลบริการที่เลือก
    const [service] = await connection.execute(
      'SELECT * FROM service_types WHERE service_type_id = ?',
      [service_type_id]
    );

    if (!service.length) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลบริการ' });
    }

    const { base_price } = service[0];

    // คำนวณราคาตามจำนวนที่เลือก
    const unit_price = base_price;
    const subtotal = unit_price * quantity;
    const total_amount = subtotal; // เนื่องจากรับแค่ 1 บริการต่อครั้ง

    await connection.beginTransaction();

    // สร้างใบเสนอราคา
    const [quotation] = await connection.execute(
      'INSERT INTO quotations (customer_id, total_amount, valid_until) VALUES (?, ?, DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY))',
      [customer_id, total_amount]
    );

    // เพิ่มรายการบริการ
    await connection.execute(
      'INSERT INTO quotation_items (quotation_id, service_type_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)',
      [quotation.insertId, service_type_id, quantity, unit_price, subtotal]
    );

    await connection.commit();

    res.status(201).json({
      quotation_id: quotation.insertId,
      total_amount,
      items: [
        {
          service_type_id,
          quantity,
          unit_price,
          subtotal
        }
      ]
    });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});


router.get('/getService', async (req, res) => {
  try {
    const services = await db.execute('SELECT service_type_id,name,description,type FROM service_types');
    res.status(200).json(services[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})


// คำนวณราคา
router.post('/calculate', async (req, res) => {
  try {
    const {service_type_id, quantity, area } = req.body;

    // ตรวจสอบว่ามีข้อมูลครบหรือไม่
    if (!service_type_id || !quantity || !area) {
      return res.status(400).json({ message: 'service_type_id, quantity และ area' });
    }

    // ดึงข้อมูลบริการจากฐานข้อมูล
    const [service] = await db.execute(
      'SELECT name, base_price FROM service_types WHERE service_type_id = ?',
      [service_type_id]
    );

    if (!service.length) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลบริการ' });
    }

    const { name: service_name, base_price } = service[0];

    // คำนวณราคาโดยรวม area เข้าไปด้วย
    const unit_price = base_price;
    const subtotal = unit_price * quantity * area; // เพิ่ม area เข้าไปในการคำนวณ
    const total_amount = subtotal;

    res.status(200).json({
      service_type_id,
      service_name, 
      quantity,
      area,
      unit_price,
      subtotal,
      total_amount
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




module.exports = router; // export router