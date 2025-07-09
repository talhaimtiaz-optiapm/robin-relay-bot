const { App } = require('@slack/bolt');

class SlackBot {
  constructor(githubApp) {
    this.githubApp = githubApp;
    this.app = new App({
      token: process.env.SLACK_BOT_TOKEN,
      signingSecret: process.env.SLACK_SIGNING_SECRET,
      socketMode: true,
      appToken: process.env.SLACK_APP_TOKEN,
    });

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // Handle app mentions (@robin-relay-bot)
    this.app.event('app_mention', async ({ event, say }) => {
      try {
        console.log('🤖 Slack: Received app mention:', event.text);
        await this.handleAppMention(event, say);
      } catch (error) {
        console.error('❌ Slack: Error handling app mention:', error);
        await say('Sorry, I encountered an error processing your request.');
      }
    });

    // Handle direct messages
    this.app.message(async ({ message, say }) => {
      try {
        console.log('🤖 Slack: Received direct message:', message.text);
        await this.handleDirectMessage(message, say);
      } catch (error) {
        console.error('❌ Slack: Error handling direct message:', error);
        await say('Sorry, I encountered an error processing your request.');
      }
    });

    // Handle slash commands
    this.app.command('/robin-relay', async ({ command, ack, respond }) => {
      await ack();
      try {
        console.log('🤖 Slack: Received slash command:', command.text);
        await this.handleSlashCommand(command, respond);
      } catch (error) {
        console.error('❌ Slack: Error handling slash command:', error);
        await respond('Sorry, I encountered an error processing your request.');
      }
    });
  }

  async handleAppMention(event, say) {
    const text = event.text.replace(/<@[^>]+>/, '').trim();
    const response = await this.processCommand(text, event.user);
    await say(response);
  }

  async handleDirectMessage(message, say) {
    const response = await this.processCommand(message.text, message.user);
    await say(response);
  }

  async handleSlashCommand(command, respond) {
    const response = await this.processCommand(command.text, command.user_id);
    await respond(response);
  }

  async processCommand(text, userId) {
    const command = text.toLowerCase().trim();
    
    console.log(`🤖 Slack: Processing command "${command}" from user ${userId}`);

    if (!command) {
      return this.getHelpMessage();
    }

    // Parse command and arguments
    const parts = command.split(' ');
    const action = parts[0];
    const args = parts.slice(1).join(' ');

    switch (action) {
      case 'hello':
      case 'hi':
        return this.handleHello(userId);
      
      case 'help':
        return this.getHelpMessage();
      
      case 'analyze':
        return await this.handleAnalyze(args, userId);
      
      case 'list':
      case 'branches':
        return await this.handleListBranches(args, userId);
      
      case 'create':
      case 'pr':
        return await this.handleCreatePR(args, userId);
      
      case 'edit':
        return await this.handleEdit(args, userId);
      
      case 'status':
        return await this.handleStatus(args, userId);
      
      case 'test':
        return await this.handleTest(args, userId);
      
      case 'lint':
        return await this.handleLint(args, userId);
      
      case 'security':
        return await this.handleSecurity(args, userId);
      
      case 'dependencies':
        return await this.handleDependencies(args, userId);
      
      default:
        return `❌ Unknown command: \`${action}\`. Type \`help\` to see available commands.`;
    }
  }

  handleHello(userId) {
    return `👋 Hello <@${userId}>! I'm RobinRelay Bot, your GitHub assistant. 

I can help you with:
• Analyzing code and PRs
• Managing branches and pull requests  
• Editing files
• Running tests and security checks
• And much more!

Type \`help\` to see all available commands.`;
  }

  getHelpMessage() {
    return `🤖 *RobinRelay Bot Commands*

*Basic Commands:*
• \`hello\` - Greet the bot
• \`help\` - Show this help message

*GitHub Operations:*
• \`analyze [repo] [pr#]\` - Analyze code in a PR
• \`list branches [repo]\` - List all branches
• \`create pr [from] [to] [title]\` - Create a pull request
• \`edit [file] [content]\` - Edit a file

*Code Quality:*
• \`test [repo]\` - Run tests
• \`lint [repo]\` - Run linting
• \`security [repo]\` - Security analysis
• \`dependencies [repo]\` - Check dependencies

*Examples:*
• \`analyze my-repo 123\`
• \`list branches my-repo\`
• \`create pr dev main "New feature"\`
• \`edit README.md "Updated introduction"\`

*Note:* You can mention me with @robin-relay-bot or use the /robin-relay slash command!`;
  }

  async handleAnalyze(args, userId) {
    if (!args) {
      return '❌ Please specify a repository and PR number. Example: `analyze my-repo 123`';
    }

    const parts = args.split(' ');
    if (parts.length < 2) {
      return '❌ Please provide both repository name and PR number. Example: `analyze my-repo 123`';
    }

    const repo = parts[0];
    const prNumber = parts[1];

    try {
      // This would integrate with your existing GitHub app
      const analysis = await this.githubApp.analyzePR(repo, prNumber);
      return `📊 *Analysis for ${repo}#${prNumber}*\n\n${analysis}`;
    } catch (error) {
      console.error('Error analyzing PR:', error);
      return `❌ Error analyzing PR ${repo}#${prNumber}: ${error.message}`;
    }
  }

  async handleListBranches(args, userId) {
    const repo = args || 'robin-relay-bot'; // Default to current repo

    try {
      // This would integrate with your existing GitHub app
      const branches = await this.githubApp.listBranches(repo);
      return `🌿 *Branches in ${repo}*\n\n${branches.join('\n')}`;
    } catch (error) {
      console.error('Error listing branches:', error);
      return `❌ Error listing branches for ${repo}: ${error.message}`;
    }
  }

  async handleCreatePR(args, userId) {
    if (!args) {
      return '❌ Please specify source branch, target branch, and title. Example: `create pr dev main "New feature"`';
    }

    const parts = args.split(' ');
    if (parts.length < 3) {
      return '❌ Please provide source branch, target branch, and title. Example: `create pr dev main "New feature"`';
    }

    const fromBranch = parts[0];
    const toBranch = parts[1];
    const title = parts.slice(2).join(' ');

    try {
      // This would integrate with your existing GitHub app
      const pr = await this.githubApp.createPR(fromBranch, toBranch, title);
      return `✅ *Pull Request Created!*\n\n• Title: ${title}\n• From: \`${fromBranch}\` → \`${toBranch}\`\n• URL: ${pr.url}`;
    } catch (error) {
      console.error('Error creating PR:', error);
      return `❌ Error creating PR: ${error.message}`;
    }
  }

  async handleEdit(args, userId) {
    if (!args) {
      return '❌ Please specify file and content. Example: `edit README.md "New introduction"`';
    }

    const parts = args.split(' ');
    if (parts.length < 2) {
      return '❌ Please provide file name and content. Example: `edit README.md "New introduction"`';
    }

    const file = parts[0];
    const content = parts.slice(1).join(' ');

    try {
      // This would integrate with your existing GitHub app
      const result = await this.githubApp.editFile(file, content);
      return `✏️ *File Updated!*\n\n• File: \`${file}\`\n• Status: ${result.status}\n• Commit: ${result.commit}`;
    } catch (error) {
      console.error('Error editing file:', error);
      return `❌ Error editing file ${file}: ${error.message}`;
    }
  }

  async handleStatus(args, userId) {
    const repo = args || 'robin-relay-bot';

    try {
      // This would integrate with your existing GitHub app
      const status = await this.githubApp.getStatus(repo);
      return `📈 *Status for ${repo}*\n\n${status}`;
    } catch (error) {
      console.error('Error getting status:', error);
      return `❌ Error getting status for ${repo}: ${error.message}`;
    }
  }

  async handleTest(args, userId) {
    const repo = args || 'robin-relay-bot';

    try {
      // This would integrate with your existing GitHub app
      const results = await this.githubApp.runTests(repo);
      return `🧪 *Test Results for ${repo}*\n\n${results}`;
    } catch (error) {
      console.error('Error running tests:', error);
      return `❌ Error running tests for ${repo}: ${error.message}`;
    }
  }

  async handleLint(args, userId) {
    const repo = args || 'robin-relay-bot';

    try {
      // This would integrate with your existing GitHub app
      const results = await this.githubApp.runLint(repo);
      return `🔍 *Lint Results for ${repo}*\n\n${results}`;
    } catch (error) {
      console.error('Error running lint:', error);
      return `❌ Error running lint for ${repo}: ${error.message}`;
    }
  }

  async handleSecurity(args, userId) {
    const repo = args || 'robin-relay-bot';

    try {
      // This would integrate with your existing GitHub app
      const results = await this.githubApp.securityCheck(repo);
      return `🔒 *Security Analysis for ${repo}*\n\n${results}`;
    } catch (error) {
      console.error('Error running security check:', error);
      return `❌ Error running security check for ${repo}: ${error.message}`;
    }
  }

  async handleDependencies(args, userId) {
    const repo = args || 'robin-relay-bot';

    try {
      // This would integrate with your existing GitHub app
      const results = await this.githubApp.checkDependencies(repo);
      return `📦 *Dependency Check for ${repo}*\n\n${results}`;
    } catch (error) {
      console.error('Error checking dependencies:', error);
      return `❌ Error checking dependencies for ${repo}: ${error.message}`;
    }
  }

  async start() {
    await this.app.start();
    console.log('🤖 Slack bot is running!');
  }

  async stop() {
    await this.app.stop();
    console.log('🤖 Slack bot stopped.');
  }
}

module.exports = SlackBot; 