import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'smeresor_smer',
  password: process.env.DB_PASSWORD || 'smer2025@',
  database: process.env.DB_NAME || 'smeresor_smer',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection()
  .then(conn => {
    console.log('✓ Database connected successfully');
    conn.release();
  })
  .catch(err => {
    console.error('✗ Database connection failed:', err.message);
  });

// Routes

// Get all sections
app.get('/api/sections', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM sections ORDER BY id');
    conn.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single section
app.get('/api/sections/:id', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM sections WHERE id = ?', [req.params.id]);
    conn.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Section not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching section:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update section text
app.put('/api/sections/:id', async (req, res) => {
  try {
    const { title, content, description } = req.body;
    const conn = await pool.getConnection();
    
    await conn.query(
      'UPDATE sections SET title = ?, content = ?, description = ?, updated_at = NOW() WHERE id = ?',
      [title, content, description, req.params.id]
    );
    
    conn.release();
    res.json({ message: 'Section updated successfully' });
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new section
app.post('/api/sections', async (req, res) => {
  try {
    const { title, content, description, section_key } = req.body;
    const conn = await pool.getConnection();
    
    const [result] = await conn.query(
      'INSERT INTO sections (title, content, description, section_key, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [title, content, description, section_key]
    );
    
    conn.release();
    res.status(201).json({ id: result.insertId, message: 'Section created successfully' });
  } catch (error) {
    console.error('Error creating section:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete section
app.delete('/api/sections/:id', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM sections WHERE id = ?', [req.params.id]);
    conn.release();
    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
