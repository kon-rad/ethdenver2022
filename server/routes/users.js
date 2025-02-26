const express = require('express');
const router = express.Router();
const db = require('../../server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        token
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    // Find the user
    const sql = `SELECT * FROM users WHERE username = ?`;
    
    db.get(sql, [username], async (err, user) => {
      if (err) return res.status(500).json({ message: err.message });
      if (!user) return res.status(404).json({ message: 'User not found' });
      
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });
      
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

// Get user's followers
router.get('/:userId/followers', (req, res) => {
  const userId = req.params.userId;
  
  const sql = `
    SELECT u.id, u.username, u.email, f.created_at as followed_at
    FROM users u
    JOIN followers f ON u.id = f.follower_id
    WHERE f.following_id = ?
  `;
  
  db.all(sql, [userId], (err, followers) => {
    if (err) return res.status(500).json({ message: err.message });
    
    res.json(followers);
  });
});

// Get users being followed by a user
router.get('/:userId/following', (req, res) => {
  const userId = req.params.userId;
  
  const sql = `
    SELECT u.id, u.username, u.email, f.created_at as followed_at
    FROM users u
    JOIN followers f ON u.id = f.following_id
    WHERE f.follower_id = ?
  `;
  
  db.all(sql, [userId], (err, following) => {
    if (err) return res.status(500).json({ message: err.message });
    
    res.json(following);
  });
});

// Follow a user
router.post('/follow', authenticateToken, (req, res) => {
  const followerId = req.user.id;
  const { followingId } = req.body;
  
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

module.exports = router; 