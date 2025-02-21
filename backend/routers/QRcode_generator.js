const express = require('express');
const router = express.Router();
const generatePayload = require('promptpay-qr');
const QRCode = require('qrcode');

// PromptPay number configuration
const PROMPTPAY_NUMBER = "0969254369"; // Replace with your PromptPay number

router.post('/', async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Generate PromptPay payload
    const payload = generatePayload(PROMPTPAY_NUMBER, { amount });
    
    // Generate QR code as base64
    const qrCodeImage = await QRCode.toDataURL(payload);
    
    // Remove the data:image/png;base64, prefix
    const base64Data = qrCodeImage.replace(/^data:image\/png;base64,/, '');
    
    res.json({
      success: true,
      qrCodeImage: base64Data
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate QR code'
    });
  }
});



module.exports = router;