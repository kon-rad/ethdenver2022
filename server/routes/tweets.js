const express = require('express');
const router = express.Router();
const db = require('../../server');
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

// Create a new tweet
router.post('/', authenticateToken, (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;
    
    if (!content) {
      return res.status(400).json({ message: 'Tweet content is required' });
    }
    
    if (content.length > 280) {
      return res.status(400).json({ message: 'Tweet cannot exceed 280 characters' });
    }
    
    const sql = `INSERT INTO tweets (user_id, content) VALUES (?, ?)`;
    
    db.run(sql, [userId, content], function(err) {
      if (err) return res.status(500).json({ message: err.message });
      
      res.status(201).json({
        message: 'Tweet created successfully',
        tweetId: this.lastID
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all tweets
router.get('/', (req, res) => {
  const sql = `
    SELECT t.id, t.content, t.likes, t.retweets, t.created_at, 
           u.id as user_id, u.username
    FROM tweets t
    JOIN users u ON t.user_id = u.id
    ORDER BY t.created_at DESC
    LIMIT 100
  `;
  
  db.all(sql, [], (err, tweets) => {
    if (err) return res.status(500).json({ message: err.message });
    
    res.json(tweets);
  });
});

// Get tweets by user
router.get('/user/:userId', (req, res) => {
  const userId = req.params.userId;
  
  const sql = `
    SELECT t.id, t.content, t.likes, t.retweets, t.created_at, 
           u.id as user_id, u.username
    FROM tweets t
    JOIN users u ON t.user_id = u.id
    WHERE t.user_id = ?
    ORDER BY t.created_at DESC
  `;
  
  db.all(sql, [userId], (err, tweets) => {
    if (err) return res.status(500).json({ message: err.message });
    
    res.json(tweets);
  });
});

// Get a specific tweet
router.get('/:tweetId', (req, res) => {
  const tweetId = req.params.tweetId;
  
  const sql = `
    SELECT t.id, t.content, t.likes, t.retweets, t.created_at, 
           u.id as user_id, u.username
    FROM tweets t
    JOIN users u ON t.user_id = u.id
    WHERE t.id = ?
  `;
  
  db.get(sql, [tweetId], (err, tweet) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!tweet) return res.status(404).json({ message: 'Tweet not found' });
    
    res.json(tweet);
  });
});

// Like a tweet
router.post('/:tweetId/like', authenticateToken, (req, res) => {
  const tweetId = req.params.tweetId;
  
  // First check if the tweet exists
  db.get('SELECT * FROM tweets WHERE id = ?', [tweetId], (err, tweet) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!tweet) return res.status(404).json({ message: 'Tweet not found' });
    
    // Increment the likes count
    const sql = `UPDATE tweets SET likes = likes + 1 WHERE id = ?`;
    
    db.run(sql, [tweetId], function(err) {
      if (err) return res.status(500).json({ message: err.message });
      
      res.json({
        message: 'Tweet liked successfully',
        likes: tweet.likes + 1
      });
    });
  });
});

// Retweet a tweet
router.post('/:tweetId/retweet', authenticateToken, (req, res) => {
  const tweetId = req.params.tweetId;
  const userId = req.user.id;
  
  // First check if the tweet exists
  db.get('SELECT * FROM tweets WHERE id = ?', [tweetId], (err, tweet) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!tweet) return res.status(404).json({ message: 'Tweet not found' });
    
    // Increment the retweets count
    db.run('UPDATE tweets SET retweets = retweets + 1 WHERE id = ?', [tweetId], function(err) {
      if (err) return res.status(500).json({ message: err.message });
      
      // Create a new tweet as a retweet
      const retweetContent = `RT @${req.body.originalUsername}: ${tweet.content}`;
      
      db.run('INSERT INTO tweets (user_id, content) VALUES (?, ?)', 
        [userId, retweetContent], 
        function(err) {
          if (err) return res.status(500).json({ message: err.message });
          
          res.status(201).json({
            message: 'Tweet retweeted successfully',
            retweetId: this.lastID,
            retweets: tweet.retweets + 1
          });
        }
      );
    });
  });
});

// Delete a tweet
router.delete('/:tweetId', authenticateToken, (req, res) => {
  const tweetId = req.params.tweetId;
  const userId = req.user.id;
  
  // Check if the tweet belongs to the user
  db.get('SELECT * FROM tweets WHERE id = ? AND user_id = ?', [tweetId, userId], (err, tweet) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!tweet) return res.status(404).json({ message: 'Tweet not found or not authorized' });
    
    // Delete the tweet
    db.run('DELETE FROM tweets WHERE id = ?', [tweetId], function(err) {
      if (err) return res.status(500).json({ message: err.message });
      
      res.json({ message: 'Tweet deleted successfully' });
    });
  });
});

module.exports = router; 