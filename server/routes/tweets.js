import express from 'express';
import db from '../server.js';

const router = express.Router();

const skipAuth = (req, res, next) => {
  next();
};

// Create a new tweet
router.post('/', skipAuth, (req, res) => {
  try {
    const { content, campaignId } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Tweet content is required' });
    }
    
    if (content.length > 280) {
      return res.status(400).json({ message: 'Tweet cannot exceed 280 characters' });
    }
    
    const sql = `INSERT INTO tweets (content, campaign_id) VALUES (?, ?)`;
    
    db.run(sql, [content, campaignId], function(err) {
      if (err) return res.status(500).json({ message: err.message });
      
      res.status(201).json({
        message: 'Tweet created successfully',
        id: this.lastID,
        content,
        campaign_id: campaignId,
        likes: 0,
        retweets: 0,
        replies: 0,
        created_at: new Date().toISOString()
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all tweets
router.get('/', skipAuth, (req, res) => {
  const campaignId = req.query.campaignId;
  let sql = 'SELECT * FROM tweets';
  const params = [];

  if (campaignId) {
    sql += ' WHERE campaign_id = ?';
    params.push(campaignId);
  }
  
  sql += ' ORDER BY created_at DESC';

  db.all(sql, params, (err, tweets) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(tweets);
  });
});

// Get a single tweet
router.get('/:id', skipAuth, (req, res) => {
  db.get('SELECT * FROM tweets WHERE id = ?', [req.params.id], (err, tweet) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!tweet) return res.status(404).json({ message: 'Tweet not found' });
    res.json(tweet);
  });
});

// Update tweet engagement
router.put('/:id/engagement', skipAuth, (req, res) => {
  const { likes, retweets, replies } = req.body;
  const tweetId = req.params.id;

  db.run(
    'UPDATE tweets SET likes = ?, retweets = ?, replies = ? WHERE id = ?',
    [likes, retweets, replies, tweetId],
    function(err) {
      if (err) return res.status(500).json({ message: err.message });
      if (this.changes === 0) return res.status(404).json({ message: 'Tweet not found' });
      
      db.get('SELECT * FROM tweets WHERE id = ?', [tweetId], (err, tweet) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(tweet);
      });
    }
  );
});

// Delete a tweet
router.delete('/:id', skipAuth, (req, res) => {
  db.run('DELETE FROM tweets WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ message: err.message });
    if (this.changes === 0) return res.status(404).json({ message: 'Tweet not found' });
    res.json({ message: 'Tweet deleted' });
  });
});

export default router; 