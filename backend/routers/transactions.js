const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../config/db");

const router = express.Router();

// ตั้งค่าการอัปโหลดไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use path.join() to ensure proper path format
    cb(null, "D:/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 📌 อัปโหลดสลิป
router.post("/upload_slip", upload.single("slip"), async (req, res) => {
  const { payment_id } = req.body;
  const slip_url = req.file ? "/uploads/" + req.file.filename : null;

  if (!slip_url) return res.status(400).json({ message: "Upload failed" });

  try {
    await db.execute(
      "INSERT INTO Transactions (payment_id, slip_url) VALUES (?, ?)",
      [payment_id, slip_url]
    );
    res.json({ success: true, slip_url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// 📌 ดึงรายการธุรกรรมทั้งหมด
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT id, payment_id, slip_url,uploaded_at FROM Transactions");
    res.json({ success: true, transactions: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


module.exports = router;
