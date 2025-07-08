#!/bin/bash

echo "🧪 Testing Webhook with curl"
echo "============================"

# Generate signature
SIGNATURE=$(node -e "
const crypto = require('crypto');
const fs = require('fs');
const payload = fs.readFileSync('./scripts/test-webhook-payload.json', 'utf8');
const webhookSecret = process.env.WEBHOOK_SECRET || 'secret';
const signature = crypto.createHmac('sha256', webhookSecret).update(payload).digest('hex');
console.log(signature);
")

echo "🔐 Generated signature: $SIGNATURE"
echo ""

# Send the webhook
echo "📤 Sending webhook to http://localhost:3000/..."
echo ""

curl -X POST http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: pull_request" \
  -H "X-Hub-Signature-256: sha256=$SIGNATURE" \
  -d @scripts/test-webhook-payload.json \
  -w "\n\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n"

echo ""
echo "✅ If your bot is working, you should see logs in your terminal!" 