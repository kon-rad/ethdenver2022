import express from 'express';
import db from '../server.js';
import agentBrainService from '../services/agentBrainService.js';

const router = express.Router();

// Simplified middleware that skips authentication
const skipAuth = (req, res, next) => {
  next();
};

// Get agent status
router.get('/status', skipAuth, (req, res) => {
  // Get agent configuration
  db.get('SELECT * FROM agent_config WHERE id = 1', [], (err, config) => {
    if (err) return res.status(500).json({ message: err.message });
    
    // Get active campaigns count
    db.get(
      'SELECT COUNT(*) as active_campaigns FROM campaigns WHERE status = ?',
      ['active'],
      (err, campaignData) => {
        if (err) return res.status(500).json({ message: err.message });
        
        // Get recent agent thoughts
        db.all(
          `SELECT * FROM agent_thoughts 
           ORDER BY timestamp DESC LIMIT 5`,
          [],
          (err, thoughts) => {
            if (err) return res.status(500).json({ message: err.message });
            
            // Get scheduled tweets count
            db.get(
              `SELECT COUNT(*) as scheduled_tweets 
               FROM tweets 
               WHERE scheduled_for > datetime('now') AND published_at IS NULL`,
              [],
              (err, tweetData) => {
                if (err) return res.status(500).json({ message: err.message });
                
                res.json({
                  status: config.is_running ? 'active' : 'idle',
                  active_campaigns: campaignData.active_campaigns,
                  scheduled_tweets: tweetData.scheduled_tweets,
                  recent_activity: thoughts,
                  config: {
                    personality: config.personality,
                    frequency: config.frequency,
                    model_name: config.model_name,
                    last_run: config.last_run
                  }
                });
              }
            );
          }
        );
      }
    );
  });
});

// Toggle agent status (start/stop)
router.post('/toggle', skipAuth, (req, res) => {
  db.get('SELECT is_running FROM agent_config WHERE id = 1', [], (err, config) => {
    if (err) return res.status(500).json({ message: err.message });
    
    const newStatus = config ? !config.is_running : true;
    
    db.run(
      'UPDATE agent_config SET is_running = ?, updated_at = ? WHERE id = 1',
      [newStatus ? 1 : 0, new Date().toISOString()],
      function(err) {
        if (err) return res.status(500).json({ message: err.message });
        
        // Log the status change
        db.run(
          'INSERT INTO agent_thoughts (type, content, model_name) VALUES (?, ?, ?)',
          ['system', `Agent ${newStatus ? 'started' : 'stopped'}`, 'system'],
          function(err) {
            if (err) console.error('Error logging agent status change:', err.message);
            
            res.json({
              message: `Agent ${newStatus ? 'started' : 'stopped'} successfully`,
              status: newStatus ? 'active' : 'idle'
            });
          }
        );
      }
    );
  });
});

// Configure agent
router.post('/configure', skipAuth, (req, res) => {
  const { personality, frequency, modelName } = req.body;
  
  // Update agent configuration
  db.run(
    `UPDATE agent_config 
     SET personality = ?, frequency = ?, model_name = ?, updated_at = ? 
     WHERE id = 1`,
    [
      personality, 
      frequency, 
      modelName,
      new Date().toISOString()
    ],
    function(err) {
      if (err) return res.status(500).json({ message: err.message });
      
      // Log the configuration
      db.run(
        'INSERT INTO agent_thoughts (type, content, model_name) VALUES (?, ?, ?)',
        [
          'system', 
          `Agent configuration updated: ${JSON.stringify({ personality, frequency, modelName })}`,
          'system'
        ],
        function(err) {
          if (err) console.error('Error logging agent configuration:', err.message);
          
          res.json({
            message: 'Agent configured successfully',
            configuration: {
              personality,
              frequency,
              modelName
            }
          });
        }
      );
    }
  );
});

// Get agent thoughts
router.get('/thoughts', skipAuth, (req, res) => {
  const campaignId = req.query.campaignId;
  const limit = parseInt(req.query.limit) || 20;
  
  let sql = `
    SELECT * FROM agent_thoughts
  `;
  
  const params = [];
  
  if (campaignId) {
    sql += ' WHERE campaign_id = ?';
    params.push(campaignId);
  }
  
  sql += ' ORDER BY timestamp DESC LIMIT ?';
  params.push(limit);
  
  db.all(sql, params, (err, thoughts) => {
    if (err) return res.status(500).json({ message: err.message });
    
    res.json(thoughts);
  });
});

// Force agent to run now
router.post('/run-now', skipAuth, (req, res) => {
  // Update last run time to force the agent to run on next check
  db.run(
    'UPDATE agent_config SET last_run = ? WHERE id = 1',
    [new Date(0).toISOString()],
    function(err) {
      if (err) return res.status(500).json({ message: err.message });
      
      res.json({
        message: 'Agent will run on next check cycle',
        success: true
      });
    }
  );
});

export default router; 