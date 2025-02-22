
const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/db");

const router = express.Router();

// ตั้งค่าการอัปโหลดไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "C:/Users/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 📌 ชำระเงินและอัปโหลดสลิปพร้อมกัน
router.post("/pay_and_upload", upload.single("slip"), async (req, res) => {
  const { customer_id, amount } = req.body;
  const slip_url = req.file ? "/uploads/" + req.file.filename : null;

  if (!slip_url) return res.status(400).json({ message: "Upload failed" });

  const connection = await db.getConnection(); // ใช้ connection จาก pool

  try {
    await connection.beginTransaction(); // เริ่ม transaction

    // 🔹 1. บันทึกข้อมูลการชำระเงิน
    const [paymentResult] = await connection.execute(
      "INSERT INTO Payments (customer_id, amount, status) VALUES (?, ?, 'pending')",
      [customer_id, amount]
    );

    const payment_id = paymentResult.insertId; // ดึง payment_id ที่เพิ่งสร้าง

    // 🔹 2. บันทึก slip ใน Transactions
    await connection.execute(
      "INSERT INTO Transactions (payment_id, slip_url) VALUES (?, ?)",
      [payment_id, slip_url]
    );

    await connection.commit(); // บันทึกการเปลี่ยนแปลงทั้งหมด

    res.json({ success: true, message: "Payment and slip uploaded successfully", payment_id, slip_url });
  } catch (error) {
    await connection.rollback(); // ยกเลิกการเปลี่ยนแปลงหากมีข้อผิดพลาด
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release(); // ปล่อย connection กลับไปที่ pool
  }
});

// 📌 ดึงรายการธุรกรรมทั้งหมด
router.get("/transactions", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT id, payment_id, slip_url, uploaded_at FROM Transactions");
    res.json({ success: true, transactions: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

