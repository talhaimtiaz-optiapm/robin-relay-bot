# RobinRelay Bot - Comment Commands Guide

This guide shows you how to interact with the RobinRelay Bot through PR comments.

## 🤖 How to Use

Simply mention the bot in any PR comment with a command:

```
@robin-relay-bot [command]
```

## 📋 Available Commands

### Basic Commands

**Help**
```
@robin-relay-bot help
```
Shows all available commands and their descriptions.

**Status**
```
@robin-relay-bot status
```
Shows current PR status, checks, and statistics.

### Analysis Commands

**Code Analysis**
```
@robin-relay-bot analyze
```
Performs comprehensive code analysis including:
- File changes summary
- Code quality assessment
- Recommendations for improvement
- Overall score

**Code Review**
```
@robin-relay-bot review
```
Performs detailed code review including:
- Review points
- Positive aspects
- Areas for improvement
- Overall assessment

### Quality Commands

**Run Tests**
```
@robin-relay-bot test
```
Simulates running automated tests and shows results.

**Linting Check**
```
@robin-relay-bot lint
```
Runs linting checks and reports issues found.

### Security Commands

**Security Scan**
```
@robin-relay-bot security
```
Performs security analysis including:
- Vulnerability assessment
- Security best practices check
- Risk analysis
- Recommendations

**Dependency Check**
```
@robin-relay-bot dependencies
```
Analyzes dependencies for:
- Known vulnerabilities
- Outdated packages
- Security issues
- Update recommendations

## 💡 Example Interactions

### Scenario 1: New PR Analysis
```
User: @robin-relay-bot analyze
Bot: 🔍 Starting Code Analysis...
     ✅ Code Analysis Complete!
     📊 Analysis Summary:
     - Files Changed: 5
     - Lines Added: 120
     - Lines Removed: 15
     - Overall Score: 8.5/10
```

### Scenario 2: Security Check
```
User: @robin-relay-bot security
Bot: 🔒 Running Security Scan...
     ✅ Security Scan Complete
     🔒 Scan Results:
     - Vulnerabilities: 0 critical, 1 medium, 2 low
     - Security Score: 8.5/10
```

### Scenario 3: Get Help
```
User: @robin-relay-bot help
Bot: 🤖 RobinRelay Bot Commands
     📋 Basic Commands:
     - @robin-relay-bot help - Show this help message
     - @robin-relay-bot status - Show current PR status
     ...
```

## 🎯 Best Practices

1. **Use specific commands** for targeted analysis
2. **Check status first** to understand current PR state
3. **Run security scans** before merging sensitive changes
4. **Use analyze command** for comprehensive review
5. **Check dependencies** regularly for vulnerabilities

## 🔧 Customization

The bot can be easily extended with new commands by:
1. Adding new methods to `CommentHandler` class
2. Registering commands in the `commands` object
3. Updating the help message

## 🚀 Getting Started

1. Install the RobinRelay Bot on your repository
2. Create a pull request
3. Add a comment with `@robin-relay-bot help`
4. Explore the available commands!

---

*Powered by RobinRelay Bot 🤖* 