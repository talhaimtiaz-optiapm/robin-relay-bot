# RobinRelay Bot 🤖

A powerful GitHub App built with Probot that provides automated pull request review functionality with Slack integration. The bot automatically reacts to PRs, creates check runs, and provides feedback to developers through both GitHub and Slack.

## ✨ Features

- **Automated PR Review**: Automatically processes pull requests when they're opened, synchronized, or reopened
- **Interactive Comments**: Users can interact with the bot through PR comments using commands
- **Slack Integration**: Full GitHub operations through Slack commands and mentions
- **Visual Feedback**: Adds eyes reaction and posts comments with loading spinners
- **Check Runs**: Creates and updates GitHub check runs to show review status
- **Multiple Commands**: Support for analyze, review, test, lint, security scan, and more
- **Modular Architecture**: Clean, maintainable code structure with separate handlers
- **Error Handling**: Comprehensive error handling and logging
- **Easy Setup**: Simple configuration with environment variables

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- GitHub account
- ngrok (for local development)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/robin-relay-bot.git
   cd robin-relay-bot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your GitHub App credentials
   ```

4. **Start the bot**:
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# GitHub App Configuration
APP_ID=your_github_app_id
WEBHOOK_SECRET=your_webhook_secret
PRIVATE_KEY_PATH=./path/to/your/private-key.pem
NODE_ENV=development

# Slack App Configuration (Optional)
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_SIGNING_SECRET=your-slack-signing-secret
SLACK_APP_TOKEN=xapp-your-slack-app-token
```

### GitHub App Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/apps)
2. Create a new GitHub App with the following settings:
   - **App name**: `robin-relay-bot`
   - **Homepage URL**: `http://localhost:3000`
   - **Webhook URL**: Your ngrok URL (e.g., `https://abc123.ngrok.io`)
   - **Webhook secret**: Generate a random secret

3. **Set permissions**:
   - **Repository permissions**:
     - **Pull requests**: Read & Write
     - **Issues**: Read & Write
     - **Checks**: Read & Write
     - **Contents**: Read

4. **Subscribe to events**:
   - **Pull requests**
   - **Installation**

5. **Generate and download private key**

6. **Install the app** on your repositories

## 🏗️ Project Structure

```
robin-relay-bot/
├── src/
│   ├── app.js                 # Main application entry point
│   ├── bot/
│   │   ├── event-handler.js   # Event routing and management
│   │   ├── pr-handler.js      # Pull request processing logic
│   │   └── comment-handler.js # Interactive comment commands
│   └── slack/
│       ├── slack-bot.js       # Slack bot configuration and handlers
│       └── github-service.js  # GitHub operations for Slack
├── test-repo/                 # Test repository for development
├── scripts/                   # Utility scripts
├── env.example               # Environment variables template
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🧪 Testing

### Local Testing

1. **Start ngrok**:
   ```bash
   ngrok http 3000
   ```

2. **Update webhook URL** in your GitHub App settings

3. **Test with curl**:
   ```bash
   npm run test
   ```

4. **Create a test PR** in your repository

### Expected Output

When a pull request is opened, you should see:

```
🚀 Processing Pull Request:
📝 Title: Your PR Title
🏠 Repository: username/repo-name
👤 Author: username
🔗 URL: https://github.com/username/repo-name/pull/123
---
👀 Added eyes reaction
💬 Posted initial comment
🔍 Created check run
🔍 Performing review analysis...
✅ Analysis completed
✅ Updated check run to completed
💬 Updated comment with final result
✅ PR processing completed successfully!
---
```

## 🔄 Bot Workflow

### Automated PR Processing
1. **PR Opened**: Bot detects new pull request
2. **Reaction**: Adds 👀 eyes reaction
3. **Comment**: Posts initial comment with loading spinner
4. **Check Run**: Creates in-progress check run
5. **Analysis**: Performs review analysis (extensible)
6. **Completion**: Updates check run and comment with results

### Interactive Commands
Users can interact with the bot by mentioning it in PR comments:

**📋 Available Commands:**
- `@robin-relay-bot help` - Show available commands
- `@robin-relay-bot analyze` - Perform comprehensive code analysis
- `@robin-relay-bot review` - Perform detailed code review
- `@robin-relay-bot status` - Show current PR status
- `@robin-relay-bot test` - Run automated tests
- `@robin-relay-bot lint` - Run linting checks
- `@robin-relay-bot security` - Perform security scan
- `@robin-relay-bot dependencies` - Check dependency vulnerabilities

**💡 Example Usage:**
```
@robin-relay-bot analyze
@robin-relay-bot security
@robin-relay-bot help
```

## 💬 Slack Integration

### Setup

1. **Create a Slack App** at [api.slack.com/apps](https://api.slack.com/apps)
2. **Configure OAuth & Permissions**:
   - Add bot token scopes: `app_mentions:read`, `chat:write`, `commands`
   - Add user token scopes: `chat:write`
3. **Enable Socket Mode** for local development
4. **Add environment variables** to your `.env` file:
   ```env
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   SLACK_SIGNING_SECRET=your-signing-secret
   SLACK_APP_TOKEN=xapp-your-app-token
   ```

### Usage

The bot responds to:
- **App mentions**: `@robin-relay-bot hello`
- **Direct messages**: Send any command directly to the bot
- **Slash commands**: `/robin-relay analyze my-repo 123`

### Available Slack Commands

**🔧 Basic Commands:**
- `hello` - Greet the bot
- `help` - Show available commands

**📊 GitHub Operations:**
- `analyze [repo] [pr#]` - Analyze code in a PR
- `list branches [repo]` - List all branches
- `create pr [from] [to] [title]` - Create a pull request
- `edit [file] [content]` - Edit a file

**🧪 Code Quality:**
- `test [repo]` - Run tests
- `lint [repo]` - Run linting
- `security [repo]` - Security analysis
- `dependencies [repo]` - Check dependencies

**💡 Examples:**
```
@robin-relay-bot analyze my-repo 123
@robin-relay-bot list branches my-repo
@robin-relay-bot create pr dev main "New feature"
@robin-relay-bot edit README.md "Updated introduction"
```

### GitHub Interactive Commands
Users can interact with the bot by mentioning it in PR comments:

**📋 Available Commands:**
- `@robin-relay-bot help` - Show available commands
- `@robin-relay-bot analyze` - Perform comprehensive code analysis
- `@robin-relay-bot review` - Perform detailed code review
- `@robin-relay-bot status` - Show current PR status
- `@robin-relay-bot test` - Run automated tests
- `@robin-relay-bot lint` - Run linting checks
- `@robin-relay-bot security` - Perform security scan
- `@robin-relay-bot dependencies` - Check dependency vulnerabilities

**💡 Example Usage:**
```
@robin-relay-bot analyze
@robin-relay-bot security
@robin-relay-bot help
```

## 🛠️ Development

### Adding New Features

1. **New Event Handlers**: Add to `src/bot/event-handler.js`
2. **New PR Logic**: Extend `src/bot/pr-handler.js`
3. **Configuration**: Update environment variables as needed

### Code Style

- Use ES6+ features
- Follow JSDoc comments for documentation
- Implement proper error handling
- Use async/await for asynchronous operations

## 📦 Deployment

### Local Development

```bash
npm run dev
```

### Production

```bash
npm start
```

### Docker (Coming Soon)

```bash
docker build -t robin-relay-bot .
docker run -p 3000:3000 robin-relay-bot
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/robin-relay-bot/issues)
- **Documentation**: [Wiki](https://github.com/your-username/robin-relay-bot/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/robin-relay-bot/discussions)

## 🙏 Acknowledgments

- Built with [Probot](https://probot.github.io/)
- Inspired by GitHub's automation capabilities
- Community contributions welcome!

---

**Made with ❤️ for the GitHub community** 