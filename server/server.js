import express from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import agentBrainService from './services/agentBrainService.js';
import db from './database.js';

// Get current file path (ES Modules equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Create tweets table
    db.run(`CREATE TABLE IF NOT EXISTS tweets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id INTEGER,
      content TEXT NOT NULL,
      media_urls TEXT,
      scheduled_for DATETIME,
      published_at DATETIME,
      likes INTEGER DEFAULT 0,
      retweets INTEGER DEFAULT 0,
      replies INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (campaign_id) REFERENCES campaigns (id)
    )`);

    // Create campaigns table
    db.run(`CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'draft',
      start_date DATETIME,
      end_date DATETIME,
      auto_generated BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create agent logs table
    db.run(`CREATE TABLE IF NOT EXISTS agent_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id INTEGER,
      action_type TEXT NOT NULL,
      thought_process TEXT,
      result TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (campaign_id) REFERENCES campaigns (id)
    )`);

    // Create agent thoughts table
    db.run(`CREATE TABLE IF NOT EXISTS agent_thoughts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      model_name TEXT,
      campaign_id INTEGER,
      FOREIGN KEY (campaign_id) REFERENCES campaigns (id)
    )`);

    // Create agent configuration table
    db.run(`CREATE TABLE IF NOT EXISTS agent_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      is_running BOOLEAN DEFAULT 0,
      personality TEXT,
      frequency INTEGER DEFAULT 3600000,
      last_run DATETIME,
      model_name TEXT DEFAULT 'meta-llama/Meta-Llama-3-8B-Instruct',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert default agent configuration if not exists
    db.get('SELECT * FROM agent_config WHERE id = 1', [], (err, row) => {
      if (err) {
        console.error('Error checking agent config:', err.message);
        return;
      }
      
      if (!row) {
        db.run(`INSERT INTO agent_config (
          is_running, personality, frequency, model_name
        ) VALUES (?, ?, ?, ?)`, 
        [
          0, 
          'You are a helpful DevRel agent for Base L2 network. Your goal is to create engaging content about Web3 developments and post bounties for content creators.',
          3600000, // 1 hour in milliseconds
          'meta-llama/Meta-Llama-3-8B-Instruct'
        ]);
      }
    });
  });
}

// Routes
app.get('/', (req, res) => {
  res.send('Twitter DevRel Agent API is running');
});

// Import route modules
import tweetRoutes from './routes/tweets.js';
import analyticsRoutes from './routes/analytics.js';
import campaignRoutes from './routes/campaigns.js';
import agentRoutes from './routes/agent.js';

// Use routes
app.use('/api/tweets', tweetRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/agent', agentRoutes);

// Initialize agent brain service
console.log('Initializing agent brain service...');
// The service will self-initialize when imported

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the database connection for use in other files
export default db; 