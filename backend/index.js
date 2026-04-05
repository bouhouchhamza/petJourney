const express = require('express');
const cors = require('cors');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Products API ---
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM Products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// --- Orders / Customization Widget API ---
app.post('/api/orders', (req, res) => {
  const { productId, finish, name, phone } = req.body;
  const status = 'Engraving text, materials reserved';
  
  db.run(`INSERT INTO Orders (product_id, customization_text, finish, customer_name, phone_number, status) VALUES (?, ?, ?, ?, ?, ?)`,
    [productId, name, finish, name, phone, status],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, status, message: 'Order created successfully' });
    }
  );
});

app.get('/api/orders', (req, res) => {
  db.all(`
    SELECT Orders.*, Products.title as product_title 
    FROM Orders 
    LEFT JOIN Products ON Orders.product_id = Products.id
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  db.run('UPDATE Orders SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Status updated' });
  });
});

// --- Journal API ---
app.get('/api/journal', (req, res) => {
  db.all('SELECT * FROM JournalPosts ORDER BY date DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/journal', (req, res) => {
  const { title, date, battle_status, image_url, content } = req.body;
  db.run(`INSERT INTO JournalPosts (title, date, battle_status, image_url, content) VALUES (?, ?, ?, ?, ?)`,
    [title, date, battle_status, image_url, content],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: 'Journal post created successfully' });
    }
  );
});

// --- Analytics ---
app.get('/api/analytics', (req, res) => {
  // Mock analytics
  res.json({
    revenue: 12450.00,
    storeVisits: 8432,
    salesData: [
      { month: 'Jan', sales: 4000 },
      { month: 'Feb', sales: 3000 },
      { month: 'Mar', sales: 5000 },
      { month: 'Apr', sales: 8000 },
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
