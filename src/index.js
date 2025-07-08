const { Probot } = require('probot');
require('dotenv').config();

// Initialize the Probot app
const app = new Probot({
  appId: process.env.APP_ID,
  privateKey: require('fs').readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8'),
  secret: process.env.WEBHOOK_SECRET,
});

// Listen for pull_request.opened events
app.on('pull_request.opened', async (context) => {
  const { payload } = context;
  
  // Log the PR title and repository name
  console.log('🚀 New Pull Request Opened!');
  console.log(`📝 PR Title: ${payload.pull_request.title}`);
  console.log(`🏠 Repository: ${payload.repository.full_name}`);
  console.log(`👤 Author: ${payload.pull_request.user.login}`);
  console.log(`🔗 PR URL: ${payload.pull_request.html_url}`);
  console.log('---');
});

// Handle app installation
app.on('installation.created', async (context) => {
  console.log('✅ GitHub App installed successfully!');
});

// Handle errors
app.onError((error) => {
  console.error('❌ Probot error:', error);
});

module.exports = app; 