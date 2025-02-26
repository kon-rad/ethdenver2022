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

// Get user's follower growth over time
router.get('/followers/growth/:userId', (req, res) => {
  const userId = req.params.userId;
  
  const sql = `
    SELECT 
      strftime('%Y-%m', created_at) as month,
      COUNT(*) as new_followers
    FROM followers
    WHERE following_id = ?
    GROUP BY month
    ORDER BY month
  `;
  
  db.all(sql, [userId], (err, data) => {
    if (err) return res.status(500).json({ message: err.message });
    
    res.json(data);
  });
});

// Get user's tweet engagement stats
router.get('/engagement/:userId', (req, res) => {
  const userId = req.params.userId;
  
  const sql = `
    SELECT 
      t.id,
      t.content,
      t.likes,
      t.retweets,
      t.created_at,
      (t.likes + t.retweets) as total_engagement
    FROM tweets t
    WHERE t.user_id = ?
    ORDER BY total_engagement DESC
  `;
  
  db.all(sql, [userId], (err, data) => {
    if (err) return res.status(500).json({ message: err.message });
    
    res.json(data);
  });
});

// Get user's tweet activity over time
router.get('/activity/:userId', (req, res) => {
  const userId = req.params.userId;
  
  const sql = `
    SELECT 
      strftime('%Y-%m', created_at) as month,
      COUNT(*) as tweet_count
    FROM tweets
    WHERE user_id = ?
    GROUP BY month
    ORDER BY month
  `;
  
  db.all(sql, [userId], (err, data) => {
    if (err) return res.status(500).json({ message: err.message });
    
    res.json(data);
  });
});

// Get overall account stats
router.get('/account/:userId', (req, res) => {
  const userId = req.params.userId;
  
  // Get follower count
  db.get('SELECT COUNT(*) as follower_count FROM followers WHERE following_id = ?', [userId], (err, followerData) => {
    if (err) return res.status(500).json({ message: err.message });
    
    // Get following count
    db.get('SELECT COUNT(*) as following_count FROM followers WHERE follower_id = ?', [userId], (err, followingData) => {
      if (err) return res.status(500).json({ message: err.message });
      
      // Get tweet count
      db.get('SELECT COUNT(*) as tweet_count FROM tweets WHERE user_id = ?', [userId], (err, tweetData) => {
        if (err) return res.status(500).json({ message: err.message });
        
        // Get total likes received
        db.get('SELECT SUM(likes) as total_likes FROM tweets WHERE user_id = ?', [userId], (err, likesData) => {
          if (err) return res.status(500).json({ message: err.message });
          
          // Get total retweets received
          db.get('SELECT SUM(retweets) as total_retweets FROM tweets WHERE user_id = ?', [userId], (err, retweetsData) => {
            if (err) return res.status(500).json({ message: err.message });
            
            res.json({
              follower_count: followerData.follower_count,
              following_count: followingData.following_count,
              tweet_count: tweetData.tweet_count,
              total_likes: likesData.total_likes || 0,
              total_retweets: retweetsData.total_retweets || 0,
              engagement_rate: calculateEngagementRate(
                likesData.total_likes || 0, 
                retweetsData.total_retweets || 0, 
                tweetData.tweet_count, 
                followerData.follower_count
              )
            });
          });
        });
      });
    });
  });
});

// Helper function to calculate engagement rate
function calculateEngagementRate(likes, retweets, tweetCount, followerCount) {
  if (tweetCount === 0 || followerCount === 0) return 0;
  
  const totalEngagements = likes + retweets;
  const averageEngagementsPerTweet = totalEngagements / tweetCount;
  const engagementRate = (averageEngagementsPerTweet / followerCount) * 100;
  
  return parseFloat(engagementRate.toFixed(2));
}

module.exports = router; 