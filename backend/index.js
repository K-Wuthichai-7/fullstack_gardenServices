
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();


const customers = require('./routers/customers');
const quotations = require('./routers/quotations');
const { router: contractsRouter } = require('./routers/contracts');  // แก้ไขการ import
const invoices = require('./routers/invoices');
const schedules = require('./routers/schedules');
const services = require('./routers/services');
const payments = require('./routers/payment');
const transactions = require('./routers/transactions');
const QRcode_generator = require('./routers/QRcode_generator');
const logIn = require('./routers/login');

app.use(cors());
app.use(express.json());

// ให้ Express เสิร์ฟไฟล์จาก D:\uploads
app.use("/uploads", express.static("D:/uploads"));
app.use("/uploads", express.static("C:/Users/uploads"));

// Routes
app.use('/api/customers', customers);
app.use('/api/quotations', quotations);
app.use('/api/contracts', contractsRouter);
app.use('/api/invoices', invoices);
app.use('/api/schedules', schedules);
app.use('/api/services', services);
app.use('/api/payments', payments);
app.use('/api/transactions', transactions);
app.use('/api/generate-qr', QRcode_generator);
app.use('/api/login', logIn);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});