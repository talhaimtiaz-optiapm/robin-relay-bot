/**
 * RobinRelay Bot - Main Application Entry Point
 * A GitHub App built with Probot that provides automated PR review functionality
 */

const { Probot } = require('probot');
const EventHandler = require('./bot/event-handler');
require('dotenv').config();

// Initialize the Probot app
const app = new Probot({
  appId: process.env.APP_ID,
  privateKey: require('fs').readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8'),
  secret: process.env.WEBHOOK_SECRET,
});

// Initialize event handlers
const eventHandler = new EventHandler();
eventHandler.initialize(app);

module.exports = app; 