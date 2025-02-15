const express = require('express');
const router = express.Router();
const db = require('../config/db');

// จัดการตารางนัดหมาย
router.post('/create', async (req, res) => {
    try {
      const { contract_id, service_date, service_time, notes } = req.body;
      
      // ตรวจสอบการซ้ำซ้อนของเวลานัด
      const [existingSchedule] = await db.execute(
        'SELECT * FROM service_schedules WHERE service_date = ? AND service_time = ? AND status = "pending"',
        [service_date, service_time]
      );
      
      if (existingSchedule.length > 0) {
        return res.status(400).json({ message: 'Time slot is not available' });
      }
      
      const [schedule] = await db.execute(
        'INSERT INTO service_schedules (contract_id, service_date, service_time, notes) VALUES (?, ?, ?, ?)',
        [contract_id, service_date, service_time, notes]
      );
      
      res.status(201).json({
        schedule_id: schedule.insertId,
        message: 'Service schedule created successfully'
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // อัพเดทสถานะการให้บริการ
  router.patch('/:schedule_id/status', async (req, res) => {
    try {
      const { status, notes } = req.body;
      
      await db.execute(
        'UPDATE service_schedules SET status = ?, notes = ? WHERE schedule_id = ?',
        [status, notes, req.params.schedule_id]
      );
      
      res.json({ message: 'Service schedule status updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  module.exports = router; // export router