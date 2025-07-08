# Testing Guide for RobinRelay Bot

This guide will help you set up a test repository and verify that your GitHub App is working correctly.

## 🚀 Quick Setup

### Option 1: Using GitHub CLI (Recommended)

1. **Install GitHub CLI**:
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
   sudo apt update
   sudo apt install gh
   
   # Or download from: https://cli.github.com/
   ```

2. **Authenticate with GitHub**:
   ```bash
   gh auth login
   ```

3. **Run the setup script**:
   ```bash
   ./setup-test-repo.sh
   ```

### Option 2: Manual Setup

1. **Go to GitHub.com** and create a new repository:
   - Name: `robinrelay-test-repo`
   - Make it public
   - Don't initialize with README (we already have one)

2. **Push the test repository**:
   ```bash
   cd test-repo
   git remote add origin https://github.com/YOUR_USERNAME/robinrelay-test-repo.git
   git push -u origin master
   ```

## 🔧 Configure Your GitHub App

1. **Go to your GitHub App settings**: https://github.com/settings/apps
2. **Find your RobinRelay bot app** and click on it
3. **Install the app** on your test repository:
   - Click "Install App"
   - Select your test repository
   - Click "Install"

## 🌐 Set up ngrok (if not already running)

1. **Start ngrok**:
   ```bash
   ngrok http 3000
   ```

2. **Update your GitHub App webhook URL**:
   - Go to your GitHub App settings
   - Set the webhook URL to your ngrok URL (e.g., `https://abc123.ngrok.io`)
   - Save the changes

## 🧪 Test the Bot

### Method 1: Using the test script

```bash
./create-test-pr.sh
```

### Method 2: Manual testing

1. **Create a test branch**:
   ```bash
   cd test-repo
   git checkout -b test-bot-pr
   ```

2. **Make a change**:
   ```bash
   echo "Test change for RobinRelay Bot - $(date)" >> test.txt
   ```

3. **Commit and push**:
   ```bash
   git add test.txt
   git commit -m "Test PR for RobinRelay Bot"
   git push origin test-bot-pr
   ```

4. **Create a pull request**:
   - Go to your repository on GitHub.com
   - Click "Compare & pull request"
   - Add title: "Test PR for RobinRelay Bot"
   - Click "Create pull request"

## ✅ Expected Results

When you create the pull request, you should see logs in your bot console like:

```
🚀 New Pull Request Opened!
📝 PR Title: Test PR for RobinRelay Bot
🏠 Repository: your-username/robinrelay-test-repo
👤 Author: your-username
🔗 PR URL: https://github.com/your-username/robinrelay-test-repo/pull/1
---
```

## 🔍 Troubleshooting

### Bot not receiving webhooks?
- Check that ngrok is running
- Verify the webhook URL in your GitHub App settings
- Check the webhook delivery logs in your GitHub App settings

### Permission errors?
- Make sure your GitHub App has "Pull requests: Read" permission
- Verify the app is installed on the test repository

### No logs appearing?
- Check that your bot is running (`npm run dev`)
- Verify your `.env` file has the correct credentials
- Check the GitHub App webhook delivery logs for errors

## 📁 Project Structure

```
RobinRelay-bot/
├── app.js                    # Main bot application
├── test-repo/               # Test repository
│   ├── README.md
│   └── test.txt
├── setup-test-repo.sh       # Setup script
├── create-test-pr.sh        # Test PR creation script
├── TESTING-GUIDE.md         # This file
└── ... (other files)
``` 