import express from 'express';
const app = express();
import cors from 'cors';
app.use(
  cors()
);

import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'store.db');

let db = null;
app.use(express.json());


const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}`)
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()


app.post('/register', async (req, res) => {
  const { name, email, address, password, role } = req.body;
  console.log('Register request received:', name, email, address, role);

  // 🔍 Validation
  const errors = [];

  if (!name || name.length < 20 || name.length > 60) {
    errors.push('Name must be between 20 and 60 characters.');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email format.');
  }

  if (!address || address.length > 400) {
    errors.push('Address must not exceed 400 characters.');
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
  if (!passwordRegex.test(password)) {
    errors.push('Password must be 8–16 characters, include 1 uppercase and 1 special character.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // 🔒 Check for duplicate user by email
  const userCheck = await db.get(`SELECT * FROM user_details WHERE email = ?`, [email]);
  if (userCheck) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.run(
    `INSERT INTO user_details (name, email, address, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
    [name, email, address, hashedPassword, role]
  );

  res.json({ message: 'User registered successfully' });
});

const tokenAuthentication = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const jwtToken = authHeader && authHeader.split(' ')[1];

  if (!jwtToken) {
    return res.status(401).json({ error: 'Missing JWT token' });
  }

  jwt.verify(jwtToken, 'MY_SECRET_TOKEN', (error, payload) => {
    if (error) {
      return res.status(401).json({ error: 'Invalid JWT token' });
    }

    req.user = payload; // 👈 attach the decoded user info
    next();
  });
};


app.post('/login/',async (request, response) => {
  const { email, password } = request.body;

  console.log('Login request received:', email);

  // 🔍 Validation
  const errors = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Invalid email format.');
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
  if (!password || !passwordRegex.test(password)) {
    errors.push('Password must be 8–16 characters, include 1 uppercase and 1 special character.');
  }

  if (errors.length > 0) {
    return response.status(400).json({ errors });
  }

  try {
    const user = await db.get(`SELECT * FROM user_details WHERE email = ?`, [email]);
    console.log(user);

    if (!user) {
      return response.status(400).json({ error_msg: 'Invalid email address'});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return response.status(400).json({ error_msg: 'Invalid password' });
    }

    const payload = { userId: user.id, role: user.role };
    const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN');
    console.log('JWT Token generated:', jwtToken);
    return response.json({ jwtToken, userId: user.id ,role:user.role});

  } catch (error) {
    console.error('Login Error:', error.message);
    return response.status(500).json({ error_msg: 'Internal Server Error' });
  }
});

app.post('/admin/users', tokenAuthentication, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }

  const { name, email, address, password, role } = req.body;
  console.log('Adding user:', name, email, address, role);

  // 🔍 Validate fields
  const errors = [];
  if (!name || name.length < 20 || name.length > 60) errors.push('Name must be between 20 and 60 characters.');
  if (!address || address.length > 400) errors.push('Address must not exceed 400 characters.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid email format.');
  if (!/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(password)) errors.push('Password must be 8–16 characters, include 1 uppercase and 1 special character.');

  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    // 🔒 Check for existing email
    const existingUser = await db.get('SELECT * FROM user_details WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(
      `INSERT INTO user_details (name, email, address, password_hash, role)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, address, hashedPassword, role]
    );

    res.json({ message: 'New user added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/admin/stores', tokenAuthentication, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }

  const { name, email, address,owner_id } = req.body;
  console.log('Adding store:', name, email, address, owner_id);
  const errors = [];

  // 🔍 Validation Rules
  if (!name || name.length < 5 || name.length > 100) {
    errors.push('Store name must be between 5 and 100 characters.');
  }

  if (!address || address.length > 400) {
    errors.push('Address must not exceed 400 characters.');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email format.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // 🔒 Check for duplicate store email
    const existingStore = await db.get(`SELECT * FROM stores WHERE email = ? or owner_id=?`, [email,owner_id]);
    if (existingStore) {
      return res.status(400).json({ message: 'Store with this email or owner_id already exists' });
    }

    await db.run(
      `INSERT INTO stores (name, email, address,owner_id) VALUES (?, ?, ?,?)`,
      [name, email, address,owner_id]
    );

    res.json({ message: 'Store added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/stores/:storeId/rating', tokenAuthentication, async (req, res) => {
  if (req.user.role !== 'user') return res.status(403).json({ error: 'Only users can rate' });

  const { storeId } = req.params;
  const { rating } = req.body;
  const query = `INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)`;
  await db.run(query, [req.user.userId, storeId, rating]);
  res.json({ message: 'Rating submitted' });
});

app.put('/ratings/:id', tokenAuthentication, async (req, res) => {
  if (req.user.role !== 'user') return res.status(403).json({ error: 'Only users can update ratings' });

  const { id } = req.params;
  const { rating } = req.body;
  const query = `UPDATE ratings SET rating = ? WHERE id = ? AND user_id = ?`;
  await db.run(query, [rating, id, req.user.userId]);
  res.json({ message: 'Rating updated' });
});

app.get('/stores', tokenAuthentication, async (req, res) => {
  const query = `SELECT * FROM stores`;
  const stores = await db.all(query);
  res.json(stores);
});

app.get('/owner/stores/:storeId/ratings', tokenAuthentication, async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ error: 'Access denied' });

  const { storeId } = req.params;
  const query = `
    SELECT users.name, users.email, ratings.rating
    FROM ratings
    JOIN user_details AS users ON ratings.user_id = users.id
    WHERE ratings.store_id = ?
  `;
  const ratings = await db.all(query, [storeId]);
  res.json(ratings);
});

app.get('/owner/stores/:storeId/average', tokenAuthentication, async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ error: 'Access denied' });

  const { storeId } = req.params;
  const query = `SELECT AVG(rating) as average FROM ratings WHERE store_id = ?`;
  const result = await db.get(query, [storeId]);
  res.json({ averageRating: result.average || 0 });
});


app.get('/user/:id', tokenAuthentication, async (req, res) => {
  const { id } = req.params;
  console.log('Fetching user data...'+id);
  try {
    const query = 'SELECT * FROM user_details WHERE id = ?';
    const user = await db.get(query, [id]);
    console.log(user);  // Added for debugging

    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send('Error fetching user data');
  }
});

app.get('/admin/users', tokenAuthentication, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }

  try {
    const users = await db.all(`
      SELECT 
        user_details.*,
        (
          SELECT average_rating 
          FROM stores 
          WHERE stores.owner_id = user_details.id
        ) AS average_rating
      FROM user_details
    `);

    res.json(users);
  } catch (error) {
    console.error('Error fetching users with ratings:', error);
    res.status(500).json({ error: 'Error fetching users with ratings' });
  }
});


// POST /user/:id/reset-password
app.post('/user/:id/reset-password', tokenAuthentication, async (req, res) => {
  const userId = req.params.id;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, userId]);
    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating password." });
  }
});

// Node/Express route (pseudo)
app.get('/admin/stats',  async (req, res) => {
  console.log('Fetching admin stats...');
  const userCount = await db.get('SELECT COUNT(*) as count FROM user_details where role like "user"');
  const storeCount = await db.get('SELECT COUNT(*) as count FROM stores');
  const ratingCount = await db.get('SELECT COUNT(*) as count FROM ratings');



  res.json({
    total_users: userCount.count,
    total_stores: storeCount.count,
    total_ratings: ratingCount.count
  });
});

app.delete('/admin/stores/:id', tokenAuthentication,async (req, res) => {
  const storeId = req.params.id;
  try {
    const result = await db.run('DELETE FROM stores WHERE id = ?', [storeId]);
    if (result.changes > 0) {
      res.json({ message: 'Store deleted successfully' });
    } else {
      res.status(404).json({ error: 'Store not found' });
    }
  } catch (error) {
    console.error('Delete failed:', error);
    res.status(500).json({ error: 'Server error during deletion' });
  }
});

app.post('/ratings', tokenAuthentication,async (req, res) => {
  const {storeId, rating } = req.body;
  const userId = req.user.userId; // decoded from JWT
  console.log(`Received rating for store ${storeId} by user ${userId}: ${rating}`);

  // Check if a rating already exists
  const existing = await db.get(
    'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
    [userId, storeId]
  );

  if (existing) {
    await db.run('UPDATE ratings SET rating = ? WHERE id = ?', [rating, existing.id]);
  } else {
    await db.run(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
      [userId, storeId, rating]
    );
  }

  // Recalculate store's average
  const avgResult = await db.get(
    'SELECT ROUND(AVG(rating), 2) as avg FROM ratings WHERE store_id = ?',
    [storeId]
  );

  await db.run(
    'UPDATE stores SET average_rating = ? WHERE id = ?',
    [avgResult.avg, storeId]
  );

  console.log(`Rating for store ${storeId} updated by user ${userId}. New average: ${avgResult.avg}`);

  res.json({ message: 'Rating saved', averageRating: avgResult.avg });
});

app.get('/stores/search', tokenAuthentication, async (req, res) => {
  const { name = '', address = '' } = req.query;
  const userId = req.user.userId;

  const rows = await db.all(
    `SELECT 
      stores.*,
      stores.average_rating,
      ratings.rating AS user_rating
    FROM stores
    LEFT JOIN ratings ON ratings.store_id = stores.id AND ratings.user_id = ?
    WHERE stores.name LIKE ? AND stores.address LIKE ?`,
    [userId, `%${name}%`, `%${address}%`]
  );

  res.json(rows);
});



app.get('/owner/store/', tokenAuthentication, async (req, res) => {
  const userId = req.user.userId;

  const getAvg = await db.get(
    'SELECT average_rating FROM stores WHERE owner_id = ?',
    [userId]
  );

  const userList=await db.all(
    `SELECT user_details.name,ratings.rating
    FROM ratings
    INNER JOIN user_details ON ratings.user_id = user_details.id
    INNER JOIN stores ON ratings.store_id = stores.id
    WHERE stores.owner_id = ?`,
    [userId]
  );

  console.log('Average rating:', getAvg);
  console.log('User list:', userList);

  res.json({
    average_rating: getAvg ? getAvg.average_rating : 0,
    user_list: userList
    });
});



export default app;