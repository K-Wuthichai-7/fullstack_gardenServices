// routes/contracts.js
const express = require("express");
const nodemailer = require("nodemailer");
const db = require("../config/db");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");
require("dotenv").config();

const router = express.Router();

// สร้างสัญญาบริการ
// ฟังก์ชัน generateContract ที่แก้ไขแล้ว
// async function generateContract(paymentId, customerName, amount) {
//   console.log(`generateContract called with paymentId: ${paymentId} (${typeof paymentId}), customerName: ${customerName}, amount: ${amount}`);
  
//   return new Promise((resolve, reject) => {
//     try {
//       console.log("Creating new PDFDocument");
//       const doc = new PDFDocument();
      
//       // Ensure paymentId is a string
//       const safePaymentId = String(paymentId);
//       console.log(`Using safePaymentId: ${safePaymentId}`);
      
//       // Create an absolute path for saving the file
//       const contractPath = `D:/uploads/contract/contract_${safePaymentId}.pdf`;
//       console.log(`Contract path: ${contractPath}`);
      
//       // Create contracts directory if it doesn't exist
//       const dirPath = path.dirname(contractPath);
//       console.log(`Checking if directory exists: ${dirPath}`);
//       if (!fs.existsSync(dirPath)) {
//         console.log(`Creating directory: ${dirPath}`);
//         fs.mkdirSync(dirPath, { recursive: true });
//       }
      
//       console.log("Creating write stream");
//       const writeStream = fs.createWriteStream(contractPath);
//       console.log("Piping doc to write stream");
//       doc.pipe(writeStream);
      
//       console.log("Adding content to PDF");
//       doc.fontSize(20).text("สัญญาการชำระเงิน", { align: "center" });
//       doc.moveDown();
//       doc.fontSize(14).text(`รหัสชำระเงิน: ${safePaymentId}`);
//       doc.text(`ชื่อลูกค้า: ${customerName}`);
//       doc.text(`จำนวนเงิน: ${amount} บาท`);
//       doc.text(`วันที่ทำรายการ: ${new Date().toLocaleString()}`);
//       doc.moveDown();
//       doc.text("ขอบคุณสำหรับการใช้บริการ", { align: "center" });
      
//       console.log("Ending PDF document");
//       doc.end();
      
//       writeStream.on("finish", () => {
//         console.log(`Contract PDF generated at: ${contractPath}`);
//         // ส่งเฉพาะ relative path กลับไป
//         const relativePath = `/uploads/contract/contract_${safePaymentId}.pdf`;
//         console.log(`Returning relative path: ${relativePath}`);
//         resolve(relativePath);
//       });
      
//       writeStream.on("error", (error) => {
//         console.error("Write stream error:", error);
//         reject(error);
//       });
      
//     } catch (error) {
//       console.error("Error in generateContract:", error);
//       reject(error);
//     }
//   });
// }

async function generateContract(paymentId, customerName, amount) {
  console.log(`generateContract called with paymentId: ${paymentId} (${typeof paymentId}), customerName: ${customerName}, amount: ${amount}`);
  
  return new Promise((resolve, reject) => {
    try {
      console.log("Creating new PDFDocument");
      const doc = new PDFDocument();
      
      // Ensure paymentId is a string
      const safePaymentId = String(paymentId);
      console.log(`Using safePaymentId: ${safePaymentId}`);
      
      // Create an absolute path for saving the file
      const contractPath = `D:/uploads/contract/contract_${safePaymentId}.pdf`;
      console.log(`Contract path: ${contractPath}`);
      
      // Create contracts directory if it doesn't exist
      const dirPath = path.dirname(contractPath);
      console.log(`Checking if directory exists: ${dirPath}`);
      if (!fs.existsSync(dirPath)) {
        console.log(`Creating directory: ${dirPath}`);
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      console.log("Creating write stream");
      const writeStream = fs.createWriteStream(contractPath);
      console.log("Piping doc to write stream");
      doc.pipe(writeStream);
      
      // Load Thai font
      // const fontPath = `D:/uploads/,'fonts', 'THSarabunNew.ttf`;
      const fontPath = path.join("D:/uploads/fonts/THSarabunNew.ttf");

      doc.font(fontPath);
      
      console.log("Adding content to PDF");

      doc.fontSize(18).text("บริษัท โกลเด้นริเวอร์ เซอร์วิส จำกัด", { align: "center" });
      doc.fontSize(14).text("677/1 ถนนพระราม 4 แขวงรองเมือง เขตปทุมวัน กรุงเทพมหานคร 10330", { align: "center" });
      doc.moveDown(2);

      doc.fontSize(24).text("สัญญาการชำระเงิน", { align: "center", underline: true });
      doc.moveDown();
      
      doc.fontSize(16).text(`รหัสชำระเงิน: ${safePaymentId}`);
      doc.text(`ชื่อลูกค้า: ${customerName}`);
      doc.text(`จำนวนเงิน: ${amount} บาท`);
      doc.text(`วันที่ทำรายการ: ${new Date().toLocaleString('th-TH')}`);
      doc.moveDown();
      
      doc.text("ข้อตกลงและเงื่อนไข", { underline: true });
      doc.text("1. การชำระเงินนี้ไม่สามารถขอคืนได้ ยกเว้นกรณีที่มีข้อตกลงเป็นลายลักษณ์อักษร");
      doc.text("2. บริษัทขอสงวนสิทธิ์ในการระงับบริการหากพบว่ามีการชำระเงินที่ผิดปกติหรือไม่ถูกต้อง");
      doc.text("3. สัญญาฉบับนี้มีผลบังคับใช้ตั้งแต่วันที่ทำรายการจนกว่าจะมีการเปลี่ยนแปลง");
      doc.moveDown();
      
      doc.fontSize(16).text("ขอขอบคุณสำหรับการใช้บริการของเรา", { align: "center" });
      doc.moveDown(2);
      
      const signatureY = doc.y + 50; // ตั้งค่าระดับแนวเดียวกัน

      doc.text("ลงชื่อ ____________________________", 100, signatureY);
      doc.text(`(${customerName})`, 100, signatureY + 20);
      doc.text("ผู้ชำระเงิน", 100, signatureY + 40);
      
      doc.text("ลงชื่อ ____________________________", 350, signatureY);
      doc.text("(ตัวแทนบริษัท)", 350, signatureY + 20);
      doc.text("ผู้บริหาร", 350, signatureY + 40);
      
      
      console.log("Ending PDF document");
      doc.end();
      
      writeStream.on("finish", () => {
        console.log(`Contract PDF generated at: ${contractPath}`);
        // ส่งเฉพาะ relative path กลับไป
        const relativePath = `/uploads/contract/contract_${safePaymentId}.pdf`;
        console.log(`Returning relative path: ${relativePath}`);
        resolve(relativePath);
      });
      
      writeStream.on("error", (error) => {
        console.error("Write stream error:", error);
        reject(error);
      });
      
    } catch (error) {
      console.error("Error in generateContract:", error);
      reject(error);
    }
  });
}
// ตั้งค่าอีเมล
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📌 ส่งใบเสร็จทางอีเมล
router.post("/send-receipt/:payment_id", async (req, res) => {
  const { user_email, contract_file } = req.body;
  const { payment_id } = req.params;

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user_email,
      subject: "Payment Receipt & Contract",
      text: `Your payment ID: ${payment_id} has been confirmed. Attached is your contract.`,
      attachments: [{ filename: "contract.pdf", path: contract_file }],
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ส่งออกทั้ง router และ generateContract
module.exports = {
  router,
  generateContract
};