/**
 * RobinRelay Bot - Main Application Entry Point
 * A GitHub App built with Probot that provides automated PR review functionality
 * with Slack integration for GitHub operations
 */

const EventHandler = require('./bot/event-handler');
const SlackBot = require('./slack/slack-bot');
const GitHubService = require('./slack/github-service');
require('dotenv').config();

module.exports = (app) => {
  // Initialize event handlers
  const eventHandler = new EventHandler();
  eventHandler.initialize(app);

  // Initialize Slack integration if configured
  if (process.env.SLACK_BOT_TOKEN && process.env.SLACK_SIGNING_SECRET && process.env.SLACK_APP_TOKEN) {
    console.log('🤖 Initializing Slack integration...');
    
    // Create GitHub service for Slack bot
    const githubService = new GitHubService(app);
    
    // Initialize Slack bot with GitHub service
    const slackBot = new SlackBot(githubService);
    
    // Start Slack bot
    slackBot.start().catch(error => {
      console.error('❌ Failed to start Slack bot:', error);
    });
    
    console.log('✅ Slack integration initialized');
  } else {
    console.log('⚠️  Slack integration not configured. Set SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, and SLACK_APP_TOKEN to enable.');
  }
}; 