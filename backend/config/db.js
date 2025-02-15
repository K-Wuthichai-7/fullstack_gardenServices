
const mysql = require('mysql2/promise'); // ใช้ promises

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'graden_service_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// // ✅ ทดสอบ query ใน async function
// (async () => {
//   try {
//     const [rows] = await db.execute('SELECT * FROM customers');
//     console.log('Fetched customers:', rows);
//   } catch (err) {
//     console.error('Database error:', err);
//   }
// })();

module.exports = db;


