# Slack Integration Setup Guide

This guide will help you set up the Slack integration for RobinRelay Bot.

## Prerequisites

- A GitHub App already configured (see main README)
- A Slack workspace where you have admin permissions
- Node.js 18+ installed

## Step 1: Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click **"Create New App"**
3. Choose **"From scratch"**
4. Enter app name: `RobinRelay Bot`
5. Select your workspace
6. Click **"Create App"**

## Step 2: Configure Bot Token Scopes

1. In your Slack app dashboard, go to **"OAuth & Permissions"**
2. Scroll to **"Scopes"** section
3. Under **"Bot Token Scopes"**, add these permissions:
   - `app_mentions:read` - Read mentions of your app
   - `chat:write` - Send messages as the bot
   - `commands` - Add slash commands
   - `im:history` - Read direct messages
   - `im:read` - Read direct message metadata
   - `im:write` - Send direct messages

## Step 3: Enable Socket Mode (for local development)

1. Go to **"Socket Mode"** in the left sidebar
2. Toggle **"Enable Socket Mode"** to ON
3. Enter an app-level token name (e.g., `robin-relay-socket-token`)
4. Click **"Generate App-Level Token"**
5. Copy the generated token (starts with `xapp-`)

## Step 4: Configure Event Subscriptions

1. Go to **"Event Subscriptions"** in the left sidebar
2. Toggle **"Enable Events"** to ON
3. Under **"Subscribe to bot events"**, add:
   - `app_mention` - When someone mentions your bot
   - `message.im` - When someone sends a direct message to your bot

## Step 5: Add Slash Commands (Optional)

1. Go to **"Slash Commands"** in the left sidebar
2. Click **"Create New Command"**
3. Fill in the details:
   - **Command**: `/robin-relay`
   - **Request URL**: Leave empty (we're using Socket Mode)
   - **Short Description**: `Interact with RobinRelay Bot`
   - **Usage Hint**: `analyze my-repo 123`
4. Click **"Save"**

## Step 6: Install the App

1. Go to **"OAuth & Permissions"**
2. Click **"Install to Workspace"**
3. Review the permissions and click **"Allow"**
4. Copy the **"Bot User OAuth Token"** (starts with `xoxb-`)

## Step 7: Get Your Signing Secret

1. Go to **"Basic Information"** in the left sidebar
2. Scroll to **"App Credentials"**
3. Copy the **"Signing Secret"**

## Step 8: Configure Environment Variables

Add these variables to your `.env` file:

```env
# Slack Configuration
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_SIGNING_SECRET=your-signing-secret-here
SLACK_APP_TOKEN=xapp-your-app-token-here
```

## Step 9: Test the Integration

1. Start your bot:
   ```bash
   npm run dev
   ```

2. You should see:
   ```
   🤖 Initializing Slack integration...
   🤖 Slack bot is running!
   ✅ Slack integration initialized
   ```

3. Test in Slack:
   - Mention the bot: `@RobinRelay Bot hello`
   - Send a direct message: `help`
   - Use slash command: `/robin-relay analyze my-repo 123`

## Troubleshooting

### Bot not responding
- Check that all environment variables are set correctly
- Verify the bot is installed in your workspace
- Check the console logs for error messages

### Socket Mode errors
- Ensure Socket Mode is enabled in your Slack app
- Verify the app-level token is correct
- Check that the bot token has the required scopes

### Permission errors
- Make sure the bot has been installed to your workspace
- Verify all required scopes are added
- Check that the bot user is active

## Production Deployment

For production deployment:

1. **Disable Socket Mode** in your Slack app
2. **Set up a webhook URL** in Event Subscriptions
3. **Update slash command URLs** to point to your production server
4. **Use environment variables** for all tokens and secrets

## Security Notes

- Never commit your Slack tokens to version control
- Use environment variables for all sensitive data
- Regularly rotate your tokens
- Monitor your app's usage and permissions

## Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify all configuration steps were completed
3. Test with a simple command like `hello`
4. Check Slack's API documentation for updates 