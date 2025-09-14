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

// GET /products → get all products
app.get('/products', (req, res) => {
  res.json(readDB().products);
});

// POST /products → add new product
app.post('/products', (req, res) => {
  const db = readDB();
  const newProduct = {
    id: Date.now(), // simple unique ID
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    price: parseFloat(req.body.price),
    quantity: parseInt(req.body.quantity)
  };
  db.products.push(newProduct);
  writeDB(db);
  res.status(201).json(newProduct);
});

// PUT /products/:id → update product
app.put('/products/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const index = db.products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  db.products[index] = {
    ...db.products[index],
    ...req.body,
    price: parseFloat(req.body.price || db.products[index].price),
    quantity: parseInt(req.body.quantity || db.products[index].quantity)
  };

  writeDB(db);
  res.json(db.products[index]);
});

// DELETE /products/:id → delete product
app.delete('/products/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  db.products = db.products.filter(p => p.id !== id);
  writeDB(db);
  res.status(204).send();
});

// POST /stock/:id → adjust stock (add or deduct)
app.post('/stock/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const index = db.products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const change = parseInt(req.body.change); // e.g., +10 or -5
  db.products[index].quantity += change;

  writeDB(db);
  res.json(db.products[index]);
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Wings Cafe Backend running on http://localhost:${PORT}`);
});