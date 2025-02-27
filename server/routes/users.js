import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../server.js';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access token required' });
  
  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the user into the database
    const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    
    db.run(sql, [username, email, hashedPassword], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ message: 'Username or email already exists' });
        }
        return res.status(500).json({ message: err.message });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: this.lastID, username },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '24h' }
      );
      
      res.status(201).json({
        message: 'User registered successfully',
        userId: this.lastID,
        username,
        token
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  
  const sql = `SELECT * FROM users WHERE username = ?`;
  
  db.get(sql, [username], async (err, user) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });
    
    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid username or password' });
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      userId: user.id,
      username: user.username,
      token
    });
  });
});

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  const sql = `SELECT id, username, email, created_at FROM users WHERE id = ?`;
  
  db.get(sql, [userId], (err, user) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user);
  });
});

// Follow a user
router.post('/follow/:followingId', authenticateToken, (req, res) => {
  const followerId = req.user.id;
  const followingId = req.params.followingId;
  
  if (followerId === parseInt(followingId)) {
    return res.status(400).json({ message: 'You cannot follow yourself' });
  }
  
  const sql = `INSERT INTO followers (follower_id, following_id) VALUES (?, ?)`;
  
  db.run(sql, [followerId, followingId], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ message: 'Already following this user' });
      }
      return res.status(500).json({ message: err.message });
    }
    
    res.status(201).json({
      message: 'Successfully followed user',
      id: this.lastID
    });
  });
});

// Unfollow a user
router.delete('/unfollow/:followingId', authenticateToken, (req, res) => {
  const followerId = req.user.id;
  const followingId = req.params.followingId;
  
  const sql = `DELETE FROM followers WHERE follower_id = ? AND following_id = ?`;
  
  db.run(sql, [followerId, followingId], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Not following this user' });
    }
    
    res.json({ message: 'Successfully unfollowed user' });
  });
});

export default router; 