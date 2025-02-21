//payment
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { generateContract } = require("./contracts");  // แก้ไขการ import



// 📌 ลูกค้าสร้างรายการชำระเงิน
router.post("/", async (req, res) => {
    const { customer_id, amount } = req.body;
    try {
      const [result] = await db.execute(
        "INSERT INTO Payments (customer_id, amount) VALUES (?, ?)",
        [customer_id, amount]
      );
      res.json({ success: true, payment_id: result.insertId });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  // 📌 แอดมินตรวจสอบการชำระเงิน
  router.put("/verify/:id", async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
  
    if (!["confirmed", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }
  
    try {
        // Update payment status
        await db.execute("UPDATE Payments SET status = ? WHERE payment_id = ?", [status, id]);
  
        let contractPath = null;
        console.log("Initial contractPath:", contractPath);
  
        // Fetch customer and payment details
        const [rows] = await db.execute(
            "SELECT c.first_name, c.last_name, p.amount FROM Payments p JOIN Customers c ON p.customer_id = c.customer_id WHERE p.payment_id = ?", 
            [id]
        );
        console.log("Fetched rows:", rows);

        if (rows.length > 0) {
            const { first_name, last_name, amount } = rows[0];
            const customerName = `${first_name} ${last_name}`;
    
            console.log(customerName,'customerName');
            try {
                console.log("Generated contract path before:", contractPath);
                // Ensure id is converted to a number if it's a string
                const paymentId = parseInt(id, 10);
                // Generate contract
                contractPath = await generateContract(paymentId, customerName, amount);
                console.log("Generated contract path after:", contractPath);

                // Validate contract path
                if (typeof contractPath !== 'string' || !contractPath.startsWith("/uploads/contract/")) {
                    throw new Error("Invalid contract path format");
                }
            } catch (err) {
                console.error("Contract generation error:", err);
                return res.status(500).json({ success: false, message: "Failed to generate contract", error: err.message });
            }
    
            // Update contract URL in database - now storing just the path
            await db.execute("UPDATE Payments SET contract_url = ? WHERE payment_id = ?", [contractPath, id]);
        }
  
        // When responding, we can construct the full URL if needed
        const fullContractUrl = contractPath ? `${process.env.SERVER_URL}${contractPath}` : null;
        res.json({ success: true, message: "Payment status updated", contract_url: fullContractUrl });
    } catch (error) {
        console.error("Error updating payment status:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
});


  // 📌 ดึงรายการชำระเงิน
const BASE_URL = "http://localhost:3000"; // URL สำหรับโหลดรูป

router.get("/paymentDetail", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        p.payment_id, 
        p.customer_id, 
        c.first_name,
        c.last_name,
        p.amount, 
        p.status, 
        p.created_at, 
        CONCAT('${BASE_URL}', COALESCE(t.slip_url, '')) AS slip_url, -- ถ้าไม่มี slip_url ให้เป็นค่าว่าง
        p.contract_url
      FROM payments p
      JOIN customers c ON p.customer_id = c.customer_id
      LEFT JOIN transactions t ON t.payment_id = p.payment_id -- ใช้ LEFT JOIN เพื่อให้แสดงทุกรายการใน payments
    `);
    
    res.json({ success: true, transactions: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

  
  module.exports = router;