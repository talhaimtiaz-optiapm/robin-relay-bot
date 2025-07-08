const crypto = require('crypto');
const fs = require('fs');

// Read the webhook payload
const payload = fs.readFileSync('./scripts/test-webhook-payload.json', 'utf8');

// Get the webhook secret from environment
const webhookSecret = process.env.WEBHOOK_SECRET || 'secret';

// Generate the signature
const signature = crypto
  .createHmac('sha256', webhookSecret)
  .update(payload)
  .digest('hex');

console.log('🔐 GitHub Webhook Signature for Postman:');
console.log('=========================================');
console.log(`X-Hub-Signature-256: sha256=${signature}`);
console.log('');
console.log('📋 Postman Setup Instructions:');
console.log('==============================');
console.log('1. Method: POST');
console.log('2. URL: http://localhost:3000/');
console.log('3. Headers:');
console.log(`   - Content-Type: application/json`);
console.log(`   - X-GitHub-Event: pull_request`);
console.log(`   - X-Hub-Signature-256: sha256=${signature}`);
console.log('4. Body: Raw JSON (copy from scripts/test-webhook-payload.json)');
console.log('');
console.log('🎯 Expected Result:');
console.log('==================');
console.log('If your bot is working, you should see in your terminal:');
console.log('🚀 New Pull Request Opened!');
console.log('📝 PR Title: Test PR for RobinRelay Bot');
console.log('🏠 Repository: talhaimtiaz-optiapm/robinrelay-test-repo');
console.log('👤 Author: talhaimtiaz-optiapm');
console.log('🔗 PR URL: https://github.com/talhaimtiaz-optiapm/robinrelay-test-repo/pull/1');
console.log('---'); 