const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');

// Read from db.json
const readDB = () => {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

// Write to db.json
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// GET /products
app.get('/products', (req, res) => {
  res.json(readDB().products);
});

// Start server
app.listen(5000, () => {
  console.log('✅ Backend running on http://localhost:5000');
});