#!/bin/bash

echo "🧪 Creating Test Pull Request"
echo "============================"

cd test-repo

# Create a new branch
echo "📝 Creating test branch..."
git checkout -b test-bot-pr

# Make a change
echo "Test change for RobinRelay Bot - $(date)" >> test.txt

# Commit the change
git add test.txt
git commit -m "Test PR for RobinRelay Bot"

# Push the branch
echo "🚀 Pushing branch to GitHub..."
git push origin test-bot-pr

echo ""
echo "✅ Test branch created and pushed!"
echo "📋 Next steps:"
echo "1. Go to your repository on GitHub.com"
echo "2. You should see a prompt to create a pull request"
echo "3. Click 'Compare & pull request'"
echo "4. Add a title like 'Test PR for RobinRelay Bot'"
echo "5. Click 'Create pull request'"
echo "6. Check your bot console for the PR event logs"
echo ""
echo "🔗 Or use GitHub CLI to create the PR:"
echo "gh pr create --title 'Test PR for RobinRelay Bot' --body 'Testing the RobinRelay Bot functionality'" 