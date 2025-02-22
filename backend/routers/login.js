const express = require('express');
const router = express.Router();
const db = require('../config/db');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password." });
    }

    try {
        // ใช้ db.execute แทน query ปกติ
        const [rows] = await db.execute("SELECT * FROM customers WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const user = rows[0];

        // ตรวจสอบรหัสผ่านที่เข้ารหัส
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // สร้าง JWT Token
        const token = jwt.sign({ id: user.id, email: user.email }, 'secretkey', { expiresIn: '1h' });

        res.status(200).json({
            message: "Login successful.",
            token: token,
            user:{id: user.customer_id, email: user.email, name:`${user.first_name}`}
        });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Failed to login.", error: error.message });
    }
});


module.exports = router;