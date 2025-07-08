/**
 * Event Handler for RobinRelay Bot
 * Manages all GitHub events and routes them to appropriate handlers
 */

const PRHandler = require('./pr-handler');
const CommentHandler = require('./comment-handler');

class EventHandler {
  constructor() {
    this.prHandler = new PRHandler();
    this.commentHandler = new CommentHandler();
  }

  /**
   * Initialize all event handlers
   * @param {Object} app - Probot app instance
   */
  initialize(app) {
    console.log('🔧 Initializing RobinRelay Bot event handlers...');

    // Handle pull request events
    this.handlePullRequestEvents(app);

    // Handle comment events
    this.handleCommentEvents(app);

    // Handle installation events
    this.handleInstallationEvents(app);

    // Handle error events
    this.handleErrorEvents(app);

    console.log('✅ Event handlers initialized successfully');
  }

  /**
   * Handle pull request related events
   */
  handlePullRequestEvents(app) {
    const events = ['pull_request.opened', 'pull_request.synchronize', 'pull_request.reopened'];
    
    app.on(events, async (context) => {
      try {
        await this.prHandler.handlePullRequest(context);
      } catch (error) {
        console.error('❌ Error in pull request handler:', error);
      }
    });

    console.log(`📋 Registered handlers for: ${events.join(', ')}`);
  }

  /**
   * Handle comment events
   */
  handleCommentEvents(app) {
    app.on('issue_comment.created', async (context) => {
      try {
        await this.commentHandler.handleComment(context);
      } catch (error) {
        console.error('❌ Error in comment handler:', error);
      }
    });

    app.on('pull_request_review_comment.created', async (context) => {
      try {
        await this.commentHandler.handleComment(context);
      } catch (error) {
        console.error('❌ Error in review comment handler:', error);
      }
    });

    console.log('📋 Registered comment event handlers');
  }

  /**
   * Handle installation events
   */
  handleInstallationEvents(app) {
    app.on('installation.created', async (context) => {
      console.log('✅ GitHub App installed successfully!');
      console.log(`🏠 Installed on: ${context.payload.installation.account.login}`);
      console.log('---');
    });

    app.on('installation.deleted', async (context) => {
      console.log('❌ GitHub App uninstalled');
      console.log(`🏠 Uninstalled from: ${context.payload.installation.account.login}`);
      console.log('---');
    });

    console.log('📋 Registered installation event handlers');
  }

  /**
   * Handle error events
   */
  handleErrorEvents(app) {
    app.onError((error) => {
      console.error('❌ Probot error:', error.message);
      console.error('Stack trace:', error.stack);
      console.log('---');
    });

    console.log('📋 Registered error handler');
  }
}

module.exports = EventHandler; 