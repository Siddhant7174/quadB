const express = require('express');
const mysql = require('mysql2/promise');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'quadB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Fetch data from the API and store it in the MySQL database
async function fetchDataAndStore() {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const data = response.data;
    const connection = await pool.getConnection();
    await connection.query('TRUNCATE TABLE hodlinfo_data');

    for (const symbol in data) {
      if (data.hasOwnProperty(symbol)) {
        const { name, last, buy, sell, volume, base_unit } = data[symbol];

        const query = `
          INSERT INTO hodlinfo_data (name, last, buy, sell, volume, base_unit)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        await connection.query(query, [name, last, buy, sell, volume, base_unit]);
      }
    }

    connection.release();
    console.log('Data stored successfully.');
  } catch (error) {
    console.error('Error fetching and storing data:', error.message);
  }
}

// Fetch data from the MySQL database
app.get('', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM hodlinfo_data LIMIT 10');
    connection.release();
    console.log("Data retrieved successfully");
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch data and store on server startup
fetchDataAndStore();

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
