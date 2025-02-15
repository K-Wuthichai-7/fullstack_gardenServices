const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
      const services = await db.execute('SELECT service_type_id, name,description, type, base_price FROM service_types');
      res.status(200).json(services[0]);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })

  
// สร้างบริการใหม่
router.post('/createService', async (req, res) => {
    const { name, description, type, base_price } = req.body;
    
    if (!name || !description || !type || !base_price) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }
  
    try {
      const [result] = await db.execute(
        'INSERT INTO service_types (name, description, type, base_price) VALUES (?, ?, ?, ?)',
        [name, description, type, base_price]
      );
  
      res.status(201).json({
        message: 'บริการถูกสร้างขึ้นเรียบร้อยแล้ว',
        service_type_id: result.insertId
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // แก้ไขข้อมูลบริการ
  router.put('/updateService/:service_type_id', async (req, res) => {
    const { service_type_id } = req.params;
    const { name, description, type, base_price } = req.body;
  
    if (!name || !description || !type || !base_price) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }
  
    try {
      const [result] = await db.execute(
        'UPDATE service_types SET name = ?, description = ?, type = ?, base_price = ? WHERE service_type_id = ?',
        [name, description, type, base_price, service_type_id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'ไม่พบข้อมูลบริการ' });
      }
  
      res.status(200).json({
        message: 'ข้อมูลบริการได้รับการอัปเดตแล้ว'
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // ลบบริการ
  router.delete('/deleteService/:service_type_id', async (req, res) => {
    const { service_type_id } = req.params;
  
    try {
      const [result] = await db.execute(
        'DELETE FROM service_types WHERE service_type_id = ?',
        [service_type_id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'ไม่พบข้อมูลบริการ' });
      }
  
      res.status(200).json({
        message: 'บริการถูกลบออกแล้ว'
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  module.exports = router; // export router
