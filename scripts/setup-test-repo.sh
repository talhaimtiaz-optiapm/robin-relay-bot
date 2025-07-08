#!/bin/bash

echo "🚀 Setting up Test Repository for RobinRelay Bot"
echo "================================================"

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Please install it first: https://cli.github.com/"
    echo "Or manually create a repository on GitHub.com"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo "Please run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is ready"

# Create repository on GitHub
echo "📦 Creating repository on GitHub..."
REPO_NAME="robinrelay-test-repo"
gh repo create $REPO_NAME --public --description "Test repository for RobinRelay Bot" --source=test-repo --remote=origin --push

if [ $? -eq 0 ]; then
    echo "✅ Repository created successfully!"
    echo "🔗 Repository URL: https://github.com/$(gh api user --jq .login)/$REPO_NAME"
    
    echo ""
    echo "📋 Next Steps:"
    echo "1. Go to your GitHub App settings: https://github.com/settings/apps"
    echo "2. Install the app on the repository: $(gh api user --jq .login)/$REPO_NAME"
    echo "3. Make sure your bot is running with ngrok"
    echo "4. Create a test pull request to verify the bot works"
    
    echo ""
    echo "🧪 To test the bot:"
    echo "cd test-repo"
    echo "git checkout -b test-branch"
    echo "echo 'Test change' >> test.txt"
    echo "git add test.txt"
    echo "git commit -m 'Test PR for bot'"
    echo "git push origin test-branch"
    echo "# Then create a PR on GitHub.com"
    
else
    echo "❌ Failed to create repository"
    echo "You can manually create a repository on GitHub.com and push the test-repo folder"
fi 