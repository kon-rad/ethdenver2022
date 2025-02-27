import db from '../database.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// Together AI API key
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

// Base URL for Together AI API
const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';

class AgentBrainService {
  constructor() {
    this.isRunning = false;
    this.intervalId = null;
    this.checkInterval = 10000; // Check every 10 seconds if agent should run
    this.init();
  }

  async init() {
    try {
      // Check if agent should be running
      const config = await this.getAgentConfig();
      if (config && config.is_running) {
        this.start();
      } else {
        console.log('Agent brain service initialized but not running');
      }
      
      // Start the check interval
      this.startCheckInterval();
    } catch (error) {
      console.error('Error initializing agent brain service:', error);
    }
  }

  startCheckInterval() {
    this.intervalId = setInterval(async () => {
      try {
        const config = await this.getAgentConfig();
        
        // If agent should be running but isn't
        if (config && config.is_running && !this.isRunning) {
          this.start();
        } 
        // If agent should not be running but is
        else if (config && !config.is_running && this.isRunning) {
          this.stop();
        }
      } catch (error) {
        console.error('Error in agent check interval:', error);
      }
    }, this.checkInterval);
  }

  async getAgentConfig() {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM agent_config WHERE id = 1', [], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }

  async start() {
    if (this.isRunning) return;
    
    console.log('Starting agent brain service');
    this.isRunning = true;
    
    // Log agent start
    await this.logAgentThought('system', 'Agent brain service started', 'system');
    
    // Start the agent loop
    this.runAgentLoop();
  }

  stop() {
    console.log('Stopping agent brain service');
    this.isRunning = false;
    this.logAgentThought('system', 'Agent brain service stopped', 'system');
  }

  async runAgentLoop() {
    if (!this.isRunning) return;
    
    try {
      const config = await this.getAgentConfig();
      
      // Check if it's time to run based on frequency
      const now = new Date();
      const lastRun = config.last_run ? new Date(config.last_run) : new Date(0);
      const timeSinceLastRun = now - lastRun;
      
      if (timeSinceLastRun >= config.frequency) {
        console.log('Running agent brain cycle');
        
        // Update last run time
        await this.updateLastRunTime();
        
        // Get latest news and context
        const context = await this.getContext();
        
        // Generate the prompt
        const prompt = this.generatePrompt(context, config.personality);
        
        // Log the input
        await this.logAgentThought('input', prompt, config.model_name);
        
        // Call the LLM
        const response = await this.callTogetherAI(prompt, config.model_name);
        
        // Log the output
        await this.logAgentThought('output', response, config.model_name);
        
        // Process the response (e.g., create tweets, check bounties)
        await this.processResponse(response);
      }
      
      // Schedule next run
      setTimeout(() => {
        if (this.isRunning) {
          this.runAgentLoop();
        }
      }, 60000); // Check again in 1 minute
    } catch (error) {
      console.error('Error in agent loop:', error);
      
      // Log the error
      await this.logAgentThought('error', `Error in agent loop: ${error.message}`, 'system');
      
      // Try again in 5 minutes
      setTimeout(() => {
        if (this.isRunning) {
          this.runAgentLoop();
        }
      }, 300000);
    }
  }

  async updateLastRunTime() {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      db.run('UPDATE agent_config SET last_run = ?, updated_at = ? WHERE id = 1', 
        [now, now], 
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  }

  async getContext() {
    // Get recent tweets, campaigns, and other relevant data
    const recentTweets = await this.getRecentTweets();
    const activeCampaigns = await this.getActiveCampaigns();
    
    return {
      recentTweets,
      activeCampaigns,
      currentTime: new Date().toISOString()
    };
  }

  async getRecentTweets() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM tweets ORDER BY created_at DESC LIMIT 5', [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows || []);
      });
    });
  }

  async getActiveCampaigns() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM campaigns WHERE status = "active"', [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows || []);
      });
    });
  }

  generatePrompt(context, personality) {
    const { recentTweets, activeCampaigns, currentTime } = context;
    
    // Format recent tweets
    const tweetSection = recentTweets.length > 0 
      ? `Recent tweets:\n${recentTweets.map(t => `- ${t.content} (${t.published_at || 'scheduled'})`).join('\n')}`
      : 'No recent tweets.';
    
    // Format active campaigns
    const campaignSection = activeCampaigns.length > 0
      ? `Active campaigns:\n${activeCampaigns.map(c => `- ${c.title}: ${c.description}`).join('\n')}`
      : 'No active campaigns.';
    
    return `${personality || 'You are a helpful DevRel agent.'}\n\n
Current time: ${currentTime}\n\n
${tweetSection}\n\n
${campaignSection}\n\n
Based on the above information, please perform one of the following tasks:
1. Generate a tweet about recent developments in Base L2 network or Web3
2. Create a bounty for content creators to promote Base L2
3. Analyze recent engagement and suggest content strategy

Choose the most appropriate task and provide your response.`;
  }

  async callTogetherAI(prompt, modelName) {
    if (!TOGETHER_API_KEY) {
      throw new Error('Together AI API key not configured');
    }
    
    try {
      const response = await fetch(TOGETHER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: modelName || 'meta-llama/Meta-Llama-3-8B-Instruct',
          messages: [
            { role: 'system', content: 'You are a helpful DevRel agent for Base L2 network.' },
            { role: 'user', content: prompt }
          ]
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Together AI API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling Together AI:', error);
      throw error;
    }
  }

  async processResponse(response) {
    // Analyze the response to determine what action to take
    if (response.toLowerCase().includes('tweet:')) {
      // Extract and create a tweet
      await this.createTweet(response);
    } else if (response.toLowerCase().includes('bounty:')) {
      // Extract and create a bounty
      await this.createBounty(response);
    } else {
      // Log as a general thought
      console.log('General agent thought:', response);
    }
  }

  async createTweet(response) {
    // Extract tweet content
    const tweetMatch = response.match(/tweet:[\s\n]*(.*?)(?:\n|$)/i);
    if (tweetMatch && tweetMatch[1]) {
      const tweetContent = tweetMatch[1].trim();
      
      // Insert into tweets table
      return new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO tweets (content, scheduled_for) VALUES (?, ?)',
          [tweetContent, new Date(Date.now() + 3600000).toISOString()], // Schedule for 1 hour later
          function(err) {
            if (err) {
              reject(err);
              return;
            }
            console.log('Tweet created:', tweetContent);
            resolve();
          }
        );
      });
    }
  }

  async createBounty(response) {
    // Extract bounty details
    const bountyMatch = response.match(/bounty:[\s\n]*(.*?)(?:\n|$)/i);
    if (bountyMatch && bountyMatch[1]) {
      const bountyContent = bountyMatch[1].trim();
      
      // Create a campaign for the bounty
      return new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO campaigns (title, description, status, auto_generated) VALUES (?, ?, ?, ?)',
          [`Bounty: ${bountyContent.substring(0, 30)}...`, bountyContent, 'active', 1],
          function(err) {
            if (err) {
              reject(err);
              return;
            }
            console.log('Bounty created:', bountyContent);
            resolve();
          }
        );
      });
    }
  }

  async logAgentThought(type, content, modelName, campaignId = null) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO agent_thoughts (type, content, model_name, campaign_id) VALUES (?, ?, ?, ?)',
        [type, content, modelName, campaignId],
        function(err) {
          if (err) {
            console.error('Error logging agent thought:', err);
            reject(err);
            return;
          }
          resolve(this.lastID);
        }
      );
    });
  }
}

// Create and export a singleton instance
const agentBrainService = new AgentBrainService();
export default agentBrainService; 