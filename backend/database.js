const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    db.serialize(() => {
    // Create Tables
    db.run(`CREATE TABLE IF NOT EXISTS Products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      stock INTEGER NOT NULL,
      image_url TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      customization_text TEXT,
      finish TEXT,
      customer_name TEXT,
      phone_number TEXT,
      status TEXT NOT NULL,
      FOREIGN KEY(product_id) REFERENCES Products(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS JournalPosts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      battle_status TEXT,
      image_url TEXT,
      content TEXT
    )`);

    // Insert sample data if none exists
    db.get('SELECT count(*) as count FROM Products', (err, row) => {
      if (row && row.count === 0) {
        const stmt = db.prepare('INSERT INTO Products (title, price, category, stock, image_url) VALUES (?, ?, ?, ?, ?)');
        stmt.run('Artisan Leather Collar', 45.00, 'Collars', 50, 'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&q=80&w=800');
        stmt.run('Engraved Brass Tag', 20.00, 'Tags', 120, 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80&w=800');
        stmt.run('Braided Rope Leash', 35.00, 'Leashes', 30, 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=800');
        stmt.finalize();
      }
    });

    db.get('SELECT count(*) as count FROM JournalPosts', (err, row) => {
      if (row && row.count === 0) {
        const stmt = db.prepare('INSERT INTO JournalPosts (title, date, battle_status, image_url, content) VALUES (?, ?, ?, ?, ?)');
        stmt.run('A New Therapy Begins', '2023-10-15', 'Challenge', 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=800', 'Today Oliver started his new physical therapy. It was a tough morning, but he showed so much resilience...');
        stmt.run('Oliver is Walking Better!', '2023-11-02', 'Success', 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=800', 'We are seeing incredible progress. He took 10 steps today without his harness!');
        stmt.finalize();
      }
    });
  });
  }
});

module.exports = db;
