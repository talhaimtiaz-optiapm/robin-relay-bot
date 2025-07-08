/**
 * RobinRelay Bot - Main Application Entry Point
 * A GitHub App built with Probot that provides automated PR review functionality
 */

const EventHandler = require('./bot/event-handler');
require('dotenv').config();

module.exports = (app) => {
  // Initialize event handlers
  const eventHandler = new EventHandler();
  eventHandler.initialize(app);
}; 