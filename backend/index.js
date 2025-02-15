
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const customers = require('./routers/customers');
const quotations = require('./routers/quotations');
const contracts = require('./routers/contracts');
const invoices = require('./routers/invoices');
const schedules = require('./routers/schedules');
const services = require('./routers/services');

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customers', customers);
app.use('/api/quotations', quotations);
app.use('/api/contracts', contracts);
app.use('/api/invoices', invoices);
app.use('/api/schedules', schedules);
app.use('/api/services', services);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});