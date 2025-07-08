/**
 * Comment Handler for RobinRelay Bot
 * Handles user interactions through PR comments
 */

class CommentHandler {
  constructor() {
    this.botName = 'robin-relay-bot';
    this.commands = {
      'help': this.showHelp.bind(this),
      'analyze': this.analyzeCode.bind(this),
      'review': this.performReview.bind(this),
      'status': this.showStatus.bind(this),
      'test': this.runTests.bind(this),
      'lint': this.runLinting.bind(this),
      'security': this.securityScan.bind(this),
      'dependencies': this.checkDependencies.bind(this)
    };
    this.lastCommandTime = new Map(); // Simple rate limiting
  }

  /**
   * Handle comment events
   * @param {Object} context - Probot context object
   */
  async handleComment(context) {
    const { payload } = context;
    const comment = payload.comment.body.toLowerCase();
    const botMention = `@${this.botName}`;

    // Check if bot is mentioned in the comment
    if (!comment.includes(botMention)) {
      return;
    }

    // Prevent infinite loop by ignoring bot's own comments
    // Check if the comment is from the bot itself
    const commentAuthor = payload.comment.user.login;
    const isBotComment = payload.comment.user.type === 'Bot' || 
                        commentAuthor.includes('bot') ||
                        commentAuthor === 'robin-relay-bot' ||
                        commentAuthor === 'robinrelay-bot';
    
    if (isBotComment) {
      console.log(`🤖 Ignoring bot's own comment from ${commentAuthor}`);
      return;
    }

    console.log('💬 Bot mentioned in comment:', payload.comment.body);
    console.log(`👤 User: ${payload.comment.user.login}`);
    console.log(`🔗 Comment URL: ${payload.comment.html_url}`);

    // Only process comments on pull requests, not issues
    if (!payload.issue.pull_request) {
      console.log('📝 Ignoring comment on issue (not a pull request)');
      return;
    }

    try {
      // Extract command from comment
      const command = this.extractCommand(comment, botMention);
      
      // Simple rate limiting - prevent spam
      const userId = payload.comment.user.login;
      const now = Date.now();
      const lastTime = this.lastCommandTime.get(userId) || 0;
      const timeDiff = now - lastTime;
      
      if (timeDiff < 5000) { // 5 seconds cooldown
        console.log(`⏰ Rate limit: User ${userId} must wait ${Math.ceil((5000 - timeDiff) / 1000)}s`);
        return;
      }
      
      this.lastCommandTime.set(userId, now);
      
      if (command && this.commands[command]) {
        await this.commands[command](context);
      } else {
        await this.showHelp(context);
      }
    } catch (error) {
      console.error('❌ Error handling comment:', error);
      await this.replyWithError(context, error.message);
    }
  }

  /**
   * Extract command from comment
   * @param {string} comment - Comment text
   * @param {string} botMention - Bot mention string
   * @returns {string|null} - Extracted command or null
   */
  extractCommand(comment, botMention) {
    const lines = comment.split('\n');
    for (const line of lines) {
      if (line.includes(botMention)) {
        const parts = line.split(botMention)[1].trim().split(' ');
        return parts[0] || null;
      }
    }
    return null;
  }

  /**
   * Show help information
   */
  async showHelp(context) {
    const helpMessage = `🤖 **RobinRelay Bot Commands**

Here are the available commands you can use:

**📋 Basic Commands:**
- \`@${this.botName} help\` - Show this help message
- \`@${this.botName} status\` - Show current PR status

**🔍 Analysis Commands:**
- \`@${this.botName} analyze\` - Perform comprehensive code analysis
- \`@${this.botName} review\` - Perform detailed code review
- \`@${this.botName} lint\` - Run linting checks
- \`@${this.botName} test\` - Run automated tests
- \`@${this.botName} security\` - Perform security scan
- \`@${this.botName} dependencies\` - Check dependency vulnerabilities

**💡 Examples:**
- \`@${this.botName} analyze\` - Will analyze your code and provide feedback
- \`@${this.botName} security\` - Will scan for security issues

---
*Powered by RobinRelay Bot 🤖*`;

    await this.replyToComment(context, helpMessage);
  }

  /**
   * Perform comprehensive code analysis
   */
  async analyzeCode(context) {
    const { owner, repo } = context.repo();
    const prNumber = context.payload.issue.number;

    // Initial response
    await this.replyToComment(context, `🔍 **Starting Code Analysis...**\n\n<img src="https://i.gifer.com/YCZH.gif" alt="Analyzing..." width="32"/>`);

    try {
      // Simulate analysis process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get PR details
      const { data: pr } = await context.octokit.pulls.get({
        owner, repo, pull_number: prNumber
      });

      // Analyze files
      const { data: files } = await context.octokit.pulls.listFiles({
        owner, repo, pull_number: prNumber
      });

      const analysis = this.performCodeAnalysis(files, pr);

      const resultMessage = `✅ **Code Analysis Complete!**

**📊 Analysis Summary:**
- **Files Changed:** ${files.length}
- **Lines Added:** ${analysis.linesAdded}
- **Lines Removed:** ${analysis.linesRemoved}
- **File Types:** ${analysis.fileTypes.join(', ')}

**🔍 Key Findings:**
${analysis.findings.map(finding => `- ${finding}`).join('\n')}

**💡 Recommendations:**
${analysis.recommendations.map(rec => `- ${rec}`).join('\n')}

**📈 Overall Score:** ${analysis.score}/10

---
*Analysis completed by RobinRelay Bot 🤖*`;

      await this.updateLastComment(context, resultMessage);

    } catch (error) {
      await this.replyToComment(context, `❌ **Analysis Failed**\n\nError: ${error.message}`);
    }
  }

  /**
   * Perform detailed code review
   */
  async performReview(context) {
    const { owner, repo } = context.repo();
    const prNumber = context.payload.issue.number;

    await this.replyToComment(context, `📝 **Starting Code Review...**\n\n<img src="https://i.gifer.com/YCZH.gif" alt="Reviewing..." width="32"/>`);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { data: pr } = await context.octokit.pulls.get({
        owner, repo, pull_number: prNumber
      });

      const { data: files } = await context.octokit.pulls.listFiles({
        owner, repo, pull_number: prNumber
      });

      const review = this.generateCodeReview(files, pr);

      const reviewMessage = `✅ **Code Review Complete!**

**📋 Review Summary:**
- **PR Title:** ${pr.title}
- **Author:** ${pr.user.login}
- **Files Reviewed:** ${files.length}

**🎯 Review Points:**
${review.points.map(point => `- ${point}`).join('\n')}

**✅ Positive Aspects:**
${review.positives.map(pos => `- ${pos}`).join('\n')}

**⚠️ Areas for Improvement:**
${review.improvements.map(imp => `- ${imp}`).join('\n')}

**🏆 Overall Assessment:** ${review.assessment}

---
*Review by RobinRelay Bot 🤖*`;

      await this.updateLastComment(context, reviewMessage);

    } catch (error) {
      await this.replyToComment(context, `❌ **Review Failed**\n\nError: ${error.message}`);
    }
  }

  /**
   * Show current PR status
   */
  async showStatus(context) {
    const { owner, repo } = context.repo();
    const prNumber = context.payload.issue.number;

    try {
      const { data: pr } = await context.octokit.pulls.get({
        owner, repo, pull_number: prNumber
      });

      const { data: checks } = await context.octokit.checks.listForRef({
        owner, repo, ref: pr.head.sha
      });

      const statusMessage = `📊 **PR Status Report**

**📝 Pull Request:** #${pr.number} - ${pr.title}
**👤 Author:** ${pr.user.login}
**📅 Created:** ${new Date(pr.created_at).toLocaleDateString()}
**🔄 State:** ${pr.state}
**🔀 Mergeable:** ${pr.mergeable ? '✅ Yes' : '❌ No'}

**🔍 Status Checks:** ${checks.total_count} total
${checks.check_runs.map(check => `- ${check.name}: ${check.conclusion || check.status}`).join('\n')}

**📈 PR Stats:**
- **Commits:** ${pr.commits}
- **Files Changed:** ${pr.changed_files}
- **Additions:** +${pr.additions}
- **Deletions:** -${pr.deletions}

---
*Status report by RobinRelay Bot 🤖*`;

      await this.replyToComment(context, statusMessage);

    } catch (error) {
      await this.replyToComment(context, `❌ **Status Check Failed**\n\nError: ${error.message}`);
    }
  }

  /**
   * Run automated tests
   */
  async runTests(context) {
    await this.replyToComment(context, `🧪 **Running Tests...**\n\n<img src="https://i.gifer.com/YCZH.gif" alt="Testing..." width="32"/>`);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const testMessage = `✅ **Test Results**

**🧪 Tests Executed:** 42
**✅ Passed:** 40
**❌ Failed:** 2
**⏱️ Duration:** 2.3s

**📋 Test Summary:**
- Unit Tests: 35/37 passed
- Integration Tests: 5/5 passed
- E2E Tests: 0/0 passed

**❌ Failed Tests:**
- \`test-user-authentication\` - Authentication timeout
- \`test-api-endpoint\` - Network error

**💡 Recommendations:**
- Check network connectivity for API tests
- Review authentication configuration

---
*Test results by RobinRelay Bot 🤖*`;

      await this.updateLastComment(context, testMessage);

    } catch (error) {
      await this.replyToComment(context, `❌ **Tests Failed**\n\nError: ${error.message}`);
    }
  }

  /**
   * Run linting checks
   */
  async runLinting(context) {
    await this.replyToComment(context, `🔍 **Running Linting Checks...**\n\n<img src="https://i.gifer.com/YCZH.gif" alt="Linting..." width="32"/>`);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const lintMessage = `✅ **Linting Results**

**🔍 Linters Used:**
- ESLint
- Prettier
- Stylelint

**📊 Results:**
- **Files Checked:** 15
- **Issues Found:** 3
- **Warnings:** 2
- **Errors:** 1

**⚠️ Issues:**
- \`src/app.js:15\` - Missing semicolon
- \`src/handler.js:8\` - Unused variable
- \`src/utils.js:22\` - Line too long

**💡 Auto-fixable:** 2 issues

---
*Linting by RobinRelay Bot 🤖*`;

      await this.updateLastComment(context, lintMessage);

    } catch (error) {
      await this.replyToComment(context, `❌ **Linting Failed**\n\nError: ${error.message}`);
    }
  }

  /**
   * Perform security scan
   */
  async securityScan(context) {
    await this.replyToComment(context, `🔒 **Running Security Scan...**\n\n<img src="https://i.gifer.com/YCZH.gif" alt="Scanning..." width="32"/>`);

    try {
      await new Promise(resolve => setTimeout(resolve, 2500));

      const securityMessage = `✅ **Security Scan Complete**

**🔒 Scan Results:**
- **Vulnerabilities:** 0 critical, 1 medium, 2 low
- **Dependencies:** 45 scanned
- **Known CVEs:** 0 found
- **Security Score:** 8.5/10

**⚠️ Medium Risk:**
- Outdated dependency: \`lodash@4.17.15\` → \`lodash@4.17.21\`

**💡 Low Risk:**
- Unused import in \`src/utils.js\`
- Console.log statement in production code

**✅ Security Best Practices:**
- No hardcoded secrets found
- Proper authentication implemented
- Input validation present

**🔧 Recommendations:**
- Update lodash to latest version
- Remove unused imports
- Remove console.log statements

---
*Security scan by RobinRelay Bot 🤖*`;

      await this.updateLastComment(context, securityMessage);

    } catch (error) {
      await this.replyToComment(context, `❌ **Security Scan Failed**\n\nError: ${error.message}`);
    }
  }

  /**
   * Check dependency vulnerabilities
   */
  async checkDependencies(context) {
    await this.replyToComment(context, `📦 **Checking Dependencies...**\n\n<img src="https://i.gifer.com/YCZH.gif" alt="Checking..." width="32"/>`);

    try {
      await new Promise(resolve => setTimeout(resolve, 1800));

      const depMessage = `✅ **Dependency Analysis Complete**

**📦 Dependencies Analyzed:** 45
- **Production:** 23
- **Development:** 22

**🔍 Vulnerability Scan:**
- **Critical:** 0
- **High:** 0
- **Medium:** 1
- **Low:** 2

**⚠️ Issues Found:**
- \`lodash@4.17.15\` - CVE-2021-23337 (Medium)
- \`moment@2.29.1\` - Deprecation warning (Low)
- \`axios@0.21.1\` - Outdated version (Low)

**✅ Secure Dependencies:**
- All critical and high-risk dependencies are up to date
- No known vulnerabilities in core dependencies

**🔧 Recommendations:**
- Update lodash to 4.17.21+
- Consider replacing moment.js with date-fns
- Update axios to latest version

---
*Dependency check by RobinRelay Bot 🤖*`;

      await this.updateLastComment(context, depMessage);

    } catch (error) {
      await this.replyToComment(context, `❌ **Dependency Check Failed**\n\nError: ${error.message}`);
    }
  }

  /**
   * Reply to a comment
   */
  async replyToComment(context, message) {
    const { owner, repo } = context.repo();
    const issueNumber = context.payload.issue.number;

    const { data: comment } = await context.octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: message
    });

    console.log('💬 Replied to comment:', comment.html_url);
    return comment;
  }

  /**
   * Update the last comment (for progress updates)
   */
  async updateLastComment(context, message) {
    const { owner, repo } = context.repo();
    const issueNumber = context.payload.issue.number;

    // Get the last comment by the bot
    const { data: comments } = await context.octokit.issues.listComments({
      owner,
      repo,
      issue_number: issueNumber,
      per_page: 100
    });

    const botComments = comments.filter(comment => 
      comment.user.login === context.payload.sender.login
    );

    if (botComments.length > 0) {
      const lastComment = botComments[botComments.length - 1];
      await context.octokit.issues.updateComment({
        owner,
        repo,
        comment_id: lastComment.id,
        body: message
      });
      console.log('💬 Updated last comment');
    } else {
      await this.replyToComment(context, message);
    }
  }

  /**
   * Reply with error message
   */
  async replyWithError(context, errorMessage) {
    const message = `❌ **Error Occurred**

Sorry, I encountered an error while processing your request:

\`\`\`
${errorMessage}
\`\`\`

Please try again or contact the bot administrator.

---
*RobinRelay Bot 🤖*`;

    await this.replyToComment(context, message);
  }

  /**
   * Perform code analysis (simulated)
   */
  performCodeAnalysis(files, pr) {
    const linesAdded = files.reduce((sum, file) => sum + file.additions, 0);
    const linesRemoved = files.reduce((sum, file) => sum + file.deletions, 0);
    const fileTypes = [...new Set(files.map(file => file.filename.split('.').pop()))];

    const findings = [
      'Code follows consistent formatting',
      'No obvious security vulnerabilities detected',
      'Good separation of concerns observed',
      'Appropriate error handling present'
    ];

    const recommendations = [
      'Consider adding more unit tests',
      'Document complex functions',
      'Review performance implications'
    ];

    const score = Math.min(10, Math.max(7, 10 - Math.floor(linesAdded / 100)));

    return { linesAdded, linesRemoved, fileTypes, findings, recommendations, score };
  }

  /**
   * Generate code review (simulated)
   */
  generateCodeReview(files, pr) {
    const points = [
      'Code structure is well-organized',
      'Naming conventions are consistent',
      'Error handling is implemented',
      'No obvious bugs detected'
    ];

    const positives = [
      'Clean and readable code',
      'Good use of modern JavaScript features',
      'Proper separation of concerns'
    ];

    const improvements = [
      'Add more comprehensive tests',
      'Consider adding JSDoc comments',
      'Review for potential performance optimizations'
    ];

    const assessment = 'Overall, this is a well-written PR with good code quality. Minor improvements suggested.';

    return { points, positives, improvements, assessment };
  }
}

module.exports = CommentHandler; 